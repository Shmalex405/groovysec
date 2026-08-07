# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
# whiteout-hook-version: 1.4.0
"""
Whiteout AI - Policy Compliance Gate (PreToolUse Hook)
======================================================
Groovy Security / Whiteout AI pre-execution governance layer for Claude Code
and OpenAI Codex.

Scans tool inputs BEFORE execution using local pattern matching:
  - Catches data exfiltration, policy bypass via regex on Bash/MCP tools.
  - Other tool types (Read, Write, Edit, etc.) are monitored but only
    for completeness — injection patterns are handled elsewhere.

Backend policy compliance is handled exclusively by prompt-defender.py
(UserPromptSubmit hook). This keeps pre-tool scanning fast (~10ms).

Exit codes:
  0 = Always (hook contract on BOTH hosts)

JSON output to deny:
  {"hookSpecificOutput": {"hookEventName": "PreToolUse",
                          "permissionDecision": "deny", ...}}

Note: In PreToolUse, denying PREVENTS the tool from executing. This is the
governance gate — use it to enforce org policy.

Host agents (--agent, default "claude"): Claude Code and OpenAI Codex share
this event name, the deny JSON shape, and the always-exit-0 contract, so the
enforcement path is identical. The flag only changes attribution (`ai_tool`,
event `agent` field) and where session/cwd come from — Codex passes no
environment to hooks and supplies them in the stdin payload instead.
Codex tool names differ from Claude's (`shell` rather than `Bash`, etc.), so
tool identification is capability-based; see _normalize_tool_name.
"""

try:
    import fcntl  # POSIX advisory file locking (Unix only)
except ImportError:  # Windows has no fcntl
    # The event log is a best-effort single-writer append; a no-op lock keeps
    # this script cross-platform without changing macOS/Linux behavior — the
    # log write still happens, only advisory locking is skipped on Windows.
    class _FcntlNoop:
        LOCK_EX = 0
        LOCK_UN = 0

        @staticmethod
        def flock(*_args, **_kwargs):
            return None

    fcntl = _FcntlNoop()  # type: ignore[assignment]
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:
    yaml = None


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
# Minimum text length to bother scanning
MIN_SCAN_LENGTH = 10

# Severity levels that warrant blocking (PreToolUse = hard block)
BLOCKING_SEVERITIES = {"critical", "high"}

# Host agent — see the module docstring. Set from --agent by main().
AGENT = "claude"
HOOK_VERSION = "1.4.0"
_AGENT_AI_TOOL = {"claude": "claude_code", "codex": "codex_cli"}

# Session/cwd for this invocation (env on Claude Code, stdin payload on Codex).
SESSION_ID = ""
PROJECT_DIR = ""

# Tools whose input this hook scans, in Claude Code's vocabulary.
MONITORED_TOOLS = {
    "Read", "WebFetch", "Bash", "Grep", "Glob",
    "Task", "Edit", "Write", "NotebookEdit",
}

# Codex names the same capabilities differently, and the set has moved across
# releases (the 2026-04 docs described a single "Bash" tool; 0.145.0 ships a
# richer set). Pinning a version-specific table would silently stop scanning
# the day Codex renames a tool, so unknown names fall back to inference from
# the INPUT SHAPE — which is what the scanners actually consume.
_TOOL_ALIASES = {
    "bash": "Bash", "shell": "Bash", "local_shell": "Bash",
    "exec_command": "Bash", "run_command": "Bash", "container_exec": "Bash",
    "apply_patch": "Write", "write_file": "Write", "create_file": "Write",
    "edit_file": "Edit", "str_replace": "Edit", "patch_file": "Edit",
    "read_file": "Read", "view_file": "Read", "view_image": "Read",
    "web_search": "WebFetch", "web_fetch": "WebFetch", "fetch": "WebFetch",
    "grep": "Grep", "search": "Grep", "glob": "Glob", "find": "Glob",
    "update_plan": "Task", "task": "Task",
}

# Input keys that identify a capability when the tool name is unrecognized.
# Ordered: the first match wins, most specific first.
_INPUT_SHAPE = (
    ("command", "Bash"),
    ("new_string", "Edit"),
    ("new_source", "NotebookEdit"),
    ("content", "Write"),
    ("url", "WebFetch"),
    ("pattern", "Grep"),
    ("file_path", "Read"),
    ("path", "Read"),
    ("prompt", "Task"),
)


def normalize_tool_name(tool_name: str, tool_input: Dict[str, Any]) -> str:
    """Map a host-specific tool name onto Claude Code's vocabulary.

    Everything downstream (extract_input_text, the Bash/MCP gating, the
    exclusion checks) is written against Claude's names, so normalizing here
    keeps one scanning implementation for both hosts.
    """
    if tool_name in MONITORED_TOOLS:
        return tool_name
    if tool_name.startswith("mcp__") or tool_name.startswith("mcp_"):
        return tool_name

    low = tool_name.strip().lower()
    if low in _TOOL_ALIASES:
        return _TOOL_ALIASES[low]

    if isinstance(tool_input, dict):
        for key, mapped in _INPUT_SHAPE:
            if key in tool_input:
                return mapped
    return tool_name


# ---------------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------------
def load_patterns() -> Dict[str, Any]:
    """Load injection patterns, preferring patterns.json over patterns.yaml.

    Checks multiple locations in order:
    1. Script's own directory (installed location)
    2. Project .claude/hooks directory
    3. Home directory global config

    patterns.json is the dependency-free format: it loads with the stdlib only,
    so scanning works on a minimal/embedded Python that has no PyYAML. patterns.yaml
    remains the human-editable source and is used only where PyYAML is importable.
    """
    script_dir = Path(__file__).parent

    search_dirs = [script_dir]
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if project_dir:
        search_dirs.append(
            Path(project_dir) / ".claude" / "hooks" / "whiteout-defender"
        )
    search_dirs.append(Path.home() / ".claude" / "hooks" / "whiteout-defender")

    for directory in search_dirs:
        json_config = directory / "patterns.json"
        if json_config.exists():
            try:
                with open(json_config, "r", encoding="utf-8") as f:
                    return json.loads(f.read()) or {}
            except Exception:
                return {}
        yaml_config = directory / "patterns.yaml"
        if yaml_config.exists():
            return _load_yaml(yaml_config)

    return {}



def _find_config_file(filename: str) -> Optional[Path]:
    """Search for a config file in standard locations."""
    script_dir = Path(__file__).parent
    candidate = script_dir / filename
    if candidate.exists():
        return candidate

    # PROJECT_DIR is CLAUDE_PROJECT_DIR on Claude Code and the payload's `cwd`
    # on Codex (which exports no environment to hooks).
    project_dir = PROJECT_DIR or os.environ.get("CLAUDE_PROJECT_DIR")
    if project_dir:
        candidate = Path(project_dir) / ".claude" / "hooks" / "whiteout-defender" / filename
        if candidate.exists():
            return candidate

    home = Path.home()
    candidate = home / ".claude" / "hooks" / "whiteout-defender" / filename
    if candidate.exists():
        return candidate

    return None


def _load_yaml(path: Path) -> Dict[str, Any]:
    """Load YAML file safely."""
    if yaml is None:
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    except Exception:
        return {}


# ---------------------------------------------------------------------------
# Hook event logging (JSONL → consumed by VS Code extension)
# ---------------------------------------------------------------------------
HOOK_EVENTS_LOG = Path.home() / ".claude" / "hooks" / "whiteout-defender" / "hook-events.jsonl"
MAX_LOG_SIZE = 5 * 1024 * 1024   # 5 MB
TRIM_TO_SIZE = 1 * 1024 * 1024   # 1 MB


def _rotate_log_if_needed() -> None:
    """If log exceeds MAX_LOG_SIZE, truncate to last TRIM_TO_SIZE bytes."""
    try:
        if not HOOK_EVENTS_LOG.exists():
            return
        size = HOOK_EVENTS_LOG.stat().st_size
        if size <= MAX_LOG_SIZE:
            return
        with open(HOOK_EVENTS_LOG, "r+b") as f:
            f.seek(-TRIM_TO_SIZE, 2)
            tail = f.read()
            # Align to next newline to avoid partial JSON lines
            nl = tail.find(b"\n")
            if nl >= 0:
                tail = tail[nl + 1:]
            f.seek(0)
            f.write(tail)
            f.truncate()
    except Exception:
        pass


def _load_defender_config() -> Dict[str, Any]:
    """Load defender-config.yaml for logging options."""
    config_path = _find_config_file("defender-config.yaml")
    if config_path is None or yaml is None:
        return {}
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    except Exception:
        return {}


def log_hook_event(
    event_type: str,
    tool_name: str,
    decision: str,
    source: str,
    detections: List[Dict[str, str]],
    max_severity: Optional[str],
    policy_block: bool = False,
    violated_policies: Optional[List[str]] = None,
    policy_descriptions: Optional[List[str]] = None,
    scan_phase: str = "local",
) -> None:
    """Append a hook event to the JSONL log for the VS Code extension to consume."""
    # Only log blocks/warnings by default; allow verbose mode via config
    if decision == "allow" and event_type in ("pre_tool_allow", "post_tool_clean"):
        defender_cfg = _load_defender_config()
        if not defender_cfg.get("log_allows", False):
            return

    _rotate_log_if_needed()

    record = {
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "hook_type": "PreToolUse",
        "tool_name": tool_name,
        "decision": decision,
        "source": source,
        # Codex passes no environment to hooks — session/cwd arrive in the
        # stdin payload instead, captured into these globals by main().
        "session_id": SESSION_ID or os.environ.get("CLAUDE_SESSION_ID", ""),
        "project_dir": PROJECT_DIR or os.environ.get("CLAUDE_PROJECT_DIR", ""),
        "detections": detections,
        "max_severity": max_severity,
        "detection_count": len(detections),
        "policy_block": policy_block,
        "violated_policies": violated_policies or [],
        "policy_descriptions": policy_descriptions or [],
        "defender_version": HOOK_VERSION,
        "agent": AGENT,
        "ai_tool": _AGENT_AI_TOOL.get(AGENT, "claude_code"),
        "scan_phase": scan_phase,
    }

    try:
        HOOK_EVENTS_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(HOOK_EVENTS_LOG, "a", encoding="utf-8") as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            try:
                f.write(json.dumps(record) + "\n")
            finally:
                fcntl.flock(f, fcntl.LOCK_UN)
    except Exception:
        pass  # Never fail the hook due to logging


# ---------------------------------------------------------------------------
# Input text extraction
# ---------------------------------------------------------------------------
def extract_input_text(tool_name: str, tool_input: Dict[str, Any]) -> str:
    """Extract the scannable text from tool_input (before execution).

    Each tool type carries its actionable content in different fields.
    """
    if tool_name == "Bash":
        return tool_input.get("command", "")

    if tool_name == "Write":
        return tool_input.get("content", "")

    if tool_name == "Edit":
        return tool_input.get("new_string", "")

    if tool_name == "NotebookEdit":
        return tool_input.get("new_source", "")

    if tool_name == "Task":
        return tool_input.get("prompt", "")

    if tool_name == "Read":
        return tool_input.get("file_path", "")

    if tool_name == "WebFetch":
        return tool_input.get("url", "")

    if tool_name == "Grep":
        return tool_input.get("pattern", "")

    if tool_name == "Glob":
        return tool_input.get("pattern", "")

    # MCP tools — serialize the full input
    if tool_name.startswith("mcp__") or tool_name.startswith("mcp_"):
        try:
            return json.dumps(tool_input)
        except (TypeError, ValueError):
            return str(tool_input)

    return ""


def get_source_label(tool_name: str, tool_input: Dict[str, Any]) -> str:
    """Build a human-readable label for the tool action being blocked."""
    if tool_name == "Bash":
        cmd = tool_input.get("command", "unknown")
        return f"command: {cmd[:80]}..." if len(cmd) > 80 else f"command: {cmd}"
    if tool_name == "Write":
        return f"write to {tool_input.get('file_path', 'unknown file')}"
    if tool_name == "Edit":
        return f"edit {tool_input.get('file_path', 'unknown file')}"
    if tool_name == "NotebookEdit":
        return f"notebook edit {tool_input.get('notebook_path', 'unknown')}"
    if tool_name == "Task":
        desc = tool_input.get("description", "")
        return f"agent task: {desc[:50]}" if desc else "agent task"
    if tool_name == "Read":
        return f"read {tool_input.get('file_path', 'unknown')}"
    if tool_name == "WebFetch":
        return f"fetch {tool_input.get('url', 'unknown')}"
    if tool_name.startswith("mcp__") or tool_name.startswith("mcp_"):
        return f"MCP tool: {tool_name}"
    return f"{tool_name} input"


# ---------------------------------------------------------------------------
# Phase 1: Local pattern scan
# ---------------------------------------------------------------------------
def scan_local_patterns(
    text: str, config: Dict[str, Any]
) -> List[Tuple[str, str, str, str]]:
    """Scan text against local injection/exfiltration patterns.

    Returns list of (category, pattern, reason, severity) tuples.
    """
    if not text:
        return []

    detections = []
    categories = [
        ("Instruction Override", "instructionOverridePatterns"),
        ("Role-Playing/DAN", "rolePlayingPatterns"),
        ("Encoding/Obfuscation", "encodingPatterns"),
        ("Context Manipulation", "contextManipulationPatterns"),
        ("Data Exfiltration", "dataExfiltrationPatterns"),
        ("Policy Bypass", "policyBypassPatterns"),
    ]

    for category_name, config_key in categories:
        patterns = config.get(config_key, [])
        for item in patterns:
            if not isinstance(item, dict):
                continue
            pattern = item.get("pattern", "")
            reason = item.get("reason", "Pattern matched")
            severity = item.get("severity", "medium")
            if not pattern:
                continue
            try:
                if re.search(pattern, text, re.IGNORECASE | re.MULTILINE):
                    detections.append((category_name, pattern, reason, severity))
            except re.error:
                continue

    return detections


# ---------------------------------------------------------------------------
# Behavioral gating
# ---------------------------------------------------------------------------
# A keyword alone (the word "credential", a filename, a status banner) is
# NOT a threat. Data exfiltration requires sensitive data AND a real outbound
# vector in the SAME command. Governance bypass requires the action to target
# the DEFENDER'S OWN files. These gates replace pure keyword matching for the
# hard-block decision; everything else degrades to a PostToolUse warning.

# Set inside the Kali/pentest product container image. In assessment mode,
# reading credentials and sending payloads IS the sanctioned job, so exfil /
# payload patterns relax to non-blocking. Self-protection stays hard-blocking.
ASSESSMENT_MODE = os.environ.get("WHITEOUT_ASSESSMENT_MODE", "").strip().lower() in (
    "1", "true", "yes", "on",
)

# Actual secret MATERIAL (files/keys), not the mere words "auth"/"token"/
# "session" — those appear in ordinary code investigation and must not block.
_SENSITIVE_MATERIAL = re.compile(
    r"(?i)("
    r"\.env\b|\bcredentials?\b|\bid_rsa\b|\bid_ed25519\b|\.ssh\b|\.aws\b|"
    r"\.pem\b|\.p12\b|\.pfx\b|private[_-]?key|secret[_-]?key|"
    r"-----BEGIN [A-Z ]*PRIVATE KEY|/etc/shadow|\.kube/config|\.docker/config"
    r")"
)

# A genuine egress mechanism: an HTTP body/upload, a netcat/socat pipe, a
# remote scp/rsync, an object-store push, a known paste service, a bash
# /dev/tcp socket, or DNS-style `$(...secret...).attacker.tld` exfil.
# A BARE url is intentionally NOT a vector (so `grep https .env` is fine).
_OUTBOUND_VECTOR = re.compile(
    r"(?i)("
    r"\b(curl|wget)\b[^|;&]*\s(-d|--data|--data-binary|--data-raw|-F|--form|"
    r"-T|--upload-file|-X\s*POST|-X\s*PUT)\b|"
    r"\|\s*(nc|ncat|netcat|socat)\b|"
    r"\b(nc|ncat|netcat|socat)\b[^|]*\b\d{2,5}\b|"
    r"\b(scp|rsync)\b[^|]*\s\S+@\S+:|"
    r"\bs3://|\bgs://|\baz://|"
    r"/dev/tcp/|"
    r"pastebin\.com|transfer\.sh|0x0\.st|ix\.io|termbin\.com|"
    r"requestbin|webhook\.site|dnscat|"
    r"\b(dig|nslookup|host)\b[^|]*\$\(|"
    r"\$\([^)]*\)\.[a-z0-9.-]+\.[a-z]{2,}"
    r")"
)

# A destructive/redirect op operating ON the defender's own files, its
# directory, or its parent hooks dir — the op must sit ADJACENT to the path
# (within ~80 chars), not merely both be present somewhere in the text.
# Proximity is what stops prose that names a defender path (a PR description,
# a git diff, this very comment) from tripping the self-protection block: a
# real self-disable command is `rm <path>` / `sed -i <path>` / `> <path>`,
# with the op right on the path. `sed` requires `-i` (a bare `sed` only reads);
# `install` was dropped — far too common in ordinary English ("install",
# "InstallCursorHooks") to carry as a lone mutation signal.
#
# The path arm matches the defender DIR itself, not just the three specific
# script filenames — so a wholesale `rm -rf .../whiteout-defender`, a glob
# (`.../whiteout-defender/*.py`), a `chmod -R 000 .../whiteout-defender`, a
# rename (`mv .../whiteout-defender .../whiteout-defender.bak`), or nuking the
# `.claude/hooks` parent are all caught. (Before 2026-07-22 the arm required a
# specific filename after `whiteout-defender/`, so every directory-level
# self-disable slipped straight through the only remaining hard pre-block.)
_DEFENDER_MUTATION = re.compile(
    r"(?i)"
    r"(?:"
    # a destructive command word, then the defender path within ~80 chars
    r"(?:\brm\b|\bunlink\b|\bsed\b\s+-i|\bperl\b\s+-i|\btee\b|\btruncate\b|"
    r"\bcp\b|\bmv\b|\bchmod\b|\bchown\b|\bln\b|\bdd\b|\bshred\b)"
    r"[^\n]{0,80}?"
    # OR a redirect whose TARGET is a defender path (`: > .../prompt-defender.py`).
    # `\S*?` keeps the match inside the single redirect-target token, so an
    # unrelated `echo x > /tmp/y; ls .../whiteout-defender` does NOT match.
    r"|>>?\s*\S*?"
    r")"
    r"(?:whiteout-defender\b"          # the defender dir, any file/glob under it, or a rename target
    r"|\.claude/hooks(?:/|\b)"         # the parent hooks dir (rm -rf ~/.claude/hooks)
    r"|\.whiteout-desktop/hook-secret)"
)
# Killing the Desktop Guard / governance process is also self-disable.
_DEFENDER_KILL = re.compile(
    r"(?i)\b(kill|pkill|killall|kill\s*-9)\b[^|]*"
    r"(whiteout|WhiteoutDG|whiteout-macos-helper|Whiteout Interceptor)"
)

# Local, no-egress operations that are always safe to run. The exfil gate
# already won't block these (no outbound vector); this short-circuits them
# explicitly and documents intent. Local git plumbing + read/search tools.
_ALLOWLIST_LEADING = re.compile(
    r"^\s*(cd\s+\S+\s*(&&|;)\s*)?"
    r"(git\s+(status|add|commit|diff|log|show|merge|stash|restore|checkout|"
    r"branch|rebase|reset|fetch|pull|switch|tag|blame|rev-parse|ls-files)"
    r"|cat|less|more|head|tail|grep|rg|egrep|fgrep|find|ls|stat|file|wc|"
    r"sort|uniq|awk|cut|tr|tree|pwd|echo|printf)\b"
)


def has_outbound_vector(text: str) -> bool:
    return bool(_OUTBOUND_VECTOR.search(text))


def has_sensitive_material(text: str) -> bool:
    return bool(_SENSITIVE_MATERIAL.search(text))


def targets_defender_files(text: str) -> bool:
    """True if the command mutates the defender's own files or kills it.

    A destructive op must sit ADJACENT to the defender path (see
    _DEFENDER_MUTATION) — prose that merely names defender files without an op
    operating on them (a PR description, a git diff) no longer trips this.
    Killing the DG process is also self-disable.
    """
    if _DEFENDER_KILL.search(text):
        return True
    return bool(_DEFENDER_MUTATION.search(text))


def is_allowlisted_local(text: str) -> bool:
    """Local git op or read/search with no egress and no self-tamper."""
    if has_outbound_vector(text) or targets_defender_files(text):
        return False
    return bool(_ALLOWLIST_LEADING.match(text))


def decide_exec_block(
    text: str, detections: List[Tuple[str, str, str, str]]
) -> List[Tuple[str, str, str, str]]:
    """Behavioral hard-block decision for Bash/MCP.

    Per product direction, the defender WARNS (PostToolUse) on everything
    EXCEPT self-protection. The double-check (model re-examines its own action
    and self-corrects) is preferred to a hard stop for the false-positive-prone
    majority — and even for confirmed data exfiltration, which is surfaced as a
    PostToolUse warning (see post-tool-defender.py), not a pre-block.

    The SOLE remaining hard pre-block is self-protection: mutating the
    defender's own files / killing its process. This must stay a pre-block
    because (a) a post-hoc warning cannot un-neuter a hook that was already
    deleted/edited, and (b) self-disable is precisely the case where the model
    may be the compromised actor (prompt injection), so asking it to
    self-correct is the wrong tool. Always on, even in assessment mode.
    """
    blocking: List[Tuple[str, str, str, str]] = []

    if targets_defender_files(text):
        blocking.append((
            "Policy Bypass",
            "_targets_defender_files",
            "Self-protection: command mutates the defender's own hooks/config/process",
            "critical",
        ))

    return blocking


# ---------------------------------------------------------------------------
# Output formatting
# ---------------------------------------------------------------------------
def format_local_block(
    detections: List[Tuple[str, str, str, str]],
    tool_name: str,
    source_label: str,
) -> Dict[str, Any]:
    """Build block output for local pattern detections."""
    lines = [
        "=" * 64,
        "WHITEOUT AI - PRE-EXECUTION BLOCK (Local Pattern)",
        "=" * 64,
        "",
        f"Blocked {tool_name} before execution.",
        f"Action: {source_label}",
        "",
    ]

    for category, _pattern, reason, severity in detections:
        if severity in BLOCKING_SEVERITIES:
            lines.append(f"  [{severity.upper()}] [{category}] {reason}")

    lines.extend([
        "",
        "This action was blocked because it matched a high-severity",
        "security pattern. If this is a false positive, review the",
        "patterns in .claude/hooks/whiteout-defender/patterns.yaml.",
        "",
        "Powered by Whiteout AI (Groovy Security)",
        "=" * 64,
    ])

    reason_text = "\n".join(lines)
    return {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason_text,
        }
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def is_excluded_path(tool_name: str, tool_input: Dict[str, Any]) -> bool:
    """Check if the tool operation targets a defender-related file.

    Excludes ALL files under /whiteout-defender/ and /vscode-extension/src/defend/
    to prevent the defender from flagging its own pattern definitions.
    """
    _EXCLUDED_DIRS = ("/whiteout-defender/", "/vscode-extension/src/defend/")

    def _is_defender_file(filepath: str) -> bool:
        return any(marker in filepath for marker in _EXCLUDED_DIRS)

    if tool_name in ("Read", "Write", "Edit"):
        return _is_defender_file(tool_input.get("file_path", ""))

    elif tool_name == "Grep":
        return _is_defender_file(tool_input.get("path", ""))

    elif tool_name == "Glob":
        return _is_defender_file(tool_input.get("path", ""))

    elif tool_name == "NotebookEdit":
        return _is_defender_file(tool_input.get("notebook_path", ""))

    return False


def _parse_agent(argv: List[str]) -> str:
    """Read --agent from argv without argparse (keeps hook startup cheap)."""
    for i, arg in enumerate(argv):
        value = None
        if arg == "--agent" and i + 1 < len(argv):
            value = argv[i + 1]
        elif arg.startswith("--agent="):
            value = arg.split("=", 1)[1]
        if value and value.strip().lower() in _AGENT_AI_TOOL:
            return value.strip().lower()
    return "claude"


def main() -> None:
    """Main entry point for the PreToolUse hook.

    Flow:
      1. Parse tool_name + tool_input from stdin
      2. Normalize the tool name onto Claude Code's vocabulary
      3. Extract scannable text from the input
      4. Local pattern scan — block immediately on critical/high
      5. Allow if scan passes
    """
    global AGENT, SESSION_ID, PROJECT_DIR
    AGENT = _parse_agent(sys.argv[1:])

    # Read hook input
    try:
        input_data = json.load(sys.stdin)
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    SESSION_ID = str(input_data.get("session_id") or os.environ.get("CLAUDE_SESSION_ID", ""))
    PROJECT_DIR = str(input_data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR", ""))

    tool_input = input_data.get("tool_input", {})
    if not isinstance(tool_input, dict):
        tool_input = {}
    # Host-specific names (Codex `shell`, `apply_patch`, …) become Claude's
    # so one scanning implementation serves both.
    tool_name = normalize_tool_name(input_data.get("tool_name", ""), tool_input)

    is_mcp = tool_name.startswith("mcp__") or tool_name.startswith("mcp_")

    if tool_name not in MONITORED_TOOLS and not is_mcp:
        sys.exit(0)

    # Self-exclusion: skip scanning files inside the whiteout-defender directory
    if is_excluded_path(tool_name, tool_input):
        sys.exit(0)

    # Extract the text we'll scan
    text = extract_input_text(tool_name, tool_input)
    if not text or len(text) < MIN_SCAN_LENGTH:
        sys.exit(0)

    source_label = get_source_label(tool_name, tool_input)

    # ------------------------------------------------------------------
    # Phase 1: Local pattern scan (Bash & MCP execution tools only)
    # ------------------------------------------------------------------
    # Local patterns only run on tools that EXECUTE content (Bash, MCP).
    # Write/Edit/Read/etc. content is either Claude's output or just a
    # file path — instruction override, role-playing, encoding, and
    # context manipulation patterns cause false positives on legitimate
    # code and config files (e.g. "new task" in a GitHub Actions YAML).
    #
    # Those input-side threats are already covered by:
    #   - prompt-defender.py  (UserPromptSubmit — scans user prompts)
    #   - post-tool-defender.py (PostToolUse — scans ingested content)
    #
    # For Bash/MCP, only data exfiltration and policy bypass patterns
    # are checked — the output-side threats that must be caught BEFORE
    # the command actually runs.
    if tool_name == "Bash" or is_mcp:
        patterns_config = load_patterns()
        exec_config = {
            k: v for k, v in patterns_config.items()
            if k in ("dataExfiltrationPatterns", "policyBypassPatterns")
        }
        local_detections = scan_local_patterns(text, exec_config)
    else:
        local_detections = []

    # Allowlist: local git plumbing / reads / searches with no egress and no
    # self-tamper are always permitted (and never block) regardless of which
    # keywords they happen to contain.
    if (tool_name == "Bash") and is_allowlisted_local(text):
        log_hook_event(
            event_type="pre_tool_allow",
            tool_name=tool_name,
            decision="allow",
            source=source_label,
            detections=[],
            max_severity=None,
            scan_phase="local",
        )
        sys.exit(0)

    # BEHAVIORAL hard-block decision. A keyword match alone no longer blocks;
    # exfil requires sensitive data + an outbound vector, governance bypass
    # requires targeting the defender's own files. Keyword-only matches fall
    # through to ALLOW here (PostToolUse warns instead — the model double-take).
    if tool_name == "Bash" or is_mcp:
        blocking_detections = decide_exec_block(text, local_detections)
    else:
        blocking_detections = []

    if blocking_detections:
        detection_records = [
            {"category": d[0], "reason": d[2], "severity": d[3]}
            for d in blocking_detections
        ]
        max_sev = max(
            (d[3] for d in blocking_detections),
            key=lambda s: {"low": 0, "medium": 1, "high": 2, "critical": 3}.get(s, 0),
        )
        log_hook_event(
            event_type="pre_tool_block",
            tool_name=tool_name,
            decision="block",
            source=source_label,
            detections=detection_records,
            max_severity=max_sev,
            scan_phase="local",
        )
        output = format_local_block(blocking_detections, tool_name, source_label)
        print(json.dumps(output))
        sys.exit(0)

    # ------------------------------------------------------------------
    # All clear — allow tool execution
    # ------------------------------------------------------------------
    # NOTE: Pre-tool defender does LOCAL pattern scanning only.
    # Backend policy compliance is handled exclusively by prompt-defender.py
    # (UserPromptSubmit hook). Pre-tool's job is to catch tool-specific
    # threats (data exfiltration, policy bypass) via local patterns.
    log_hook_event(
        event_type="pre_tool_allow",
        tool_name=tool_name,
        decision="allow",
        source=source_label,
        detections=[],
        max_severity=None,
        scan_phase="local",
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
