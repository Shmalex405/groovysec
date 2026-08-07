# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
# whiteout-hook-version: 1.4.0
"""
Whiteout AI - Prompt Compliance Gate (UserPromptSubmit Hook)
============================================================
Groovy Security / Whiteout AI pre-prompt governance layer for Claude Code
and OpenAI Codex.

Evaluates user prompts BEFORE Claude processes them using backend policy
compliance only. Content is sent to the Whiteout backend for LLM-based
evaluation against the org's group policies — the same compliance engine
that governs the browser extension and desktop guard.

Local regex pattern scanning is NOT used for user prompts. Regex patterns
are reserved for tool-level defense (pre-tool and post-tool hooks) where
they scan untrusted content from external sources. User prompts are
authored by the user themselves and should only be evaluated against
org-level policies via the backend.

Fail-open: if backend is unreachable or not configured, the prompt
proceeds without blocking.

Accountable Override (docs/feature-specs/accountable-override.md):
hooks exit immediately, so there is no interactive input at block time.
When a blocked verdict carries override_available=true, the block message
teaches a resubmit-with-justification escape hatch:

  1. Block — the verdict's decision_id + the blocked text's sha256 are
     cached in pending-override.json (next to hook-events.jsonl).
  2. The user submits `whiteout override: <justification>` — that message
     is itself blocked (it never reaches the model) and the hook calls
     POST /ide-activity/override. On success the returned allow-once
     override_token replaces the cached block context.
  3. The user resubmits the original prompt — the hook spends the token
     on the judge call, the backend short-circuits to status "Overridden",
     and a prompt_override event is logged to hook-events.jsonl.

When override_available is false/absent the feature is invisible — block
messages and behavior are unchanged. Overriding is never fail-open: if
the backend is unreachable, the override command reports an error and
consumes nothing.

Host agents (--agent, default "claude"):

  claude  Claude Code. Blocking uses TWO signals for maximum compatibility:
          exit code 2 + stderr message (primary — works on all versions), and
          JSON stdout {"decision": "block"} (secondary — newer versions).

  codex   OpenAI Codex CLI/TUI/IDE-extension (hooks GA since 2026-05).
          Blocking is JSON stdout {"decision": "block"} with EXIT CODE 0.
          A non-zero exit is NOT a block on Codex: it marks the hook "Failed"
          and Codex fails open, so the prompt reaches the model anyway.
          Verified empirically on Codex 0.145.0 (2026-07-26) — exit 2 with
          identical JSON was allowed through, exit 0 with the same JSON
          blocked. See docs/feature-specs/codex-hooks-defender-parity.md §2.

Exit codes:
  0 = Allow (prompt proceeds) — and, on Codex, also the BLOCK exit code
  2 = Block (Claude Code only; on Codex this silently fails open)

Note: In UserPromptSubmit, "block" PREVENTS the prompt from being processed.
The prompt is erased from context entirely.
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
import hashlib
import json
import os
import re
import signal
import socket
import sys
import threading
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Host agent adaptation
# ---------------------------------------------------------------------------
# Set from --agent before anything else runs. The two supported hosts share the
# UserPromptSubmit event name and the {"decision": "block"} stdout contract but
# disagree on the exit code (see module docstring), so every exit path routes
# through the helpers below rather than calling sys.exit directly.
AGENT = "claude"

# Version stamped into every hook-events.jsonl record. Kept in step with the
# `whiteout-hook-version` marker above (they drifted before 1.4.0).
HOOK_VERSION = "1.4.0"

# Session/working directory for this invocation. Claude Code exports these as
# environment variables; Codex passes no environment at all and supplies them
# in the stdin payload, so main() populates these from whichever is available.
SESSION_ID = ""
PROJECT_DIR = ""

# Per-agent judge attribution. Both are in the backend's _CLI_AI_TOOLS set, so
# allowed prompts are judge-only (no PromptLog row) on either host.
_AGENT_AI_TOOL = {"claude": "claude_code", "codex": "codex_cli"}
_AGENT_DISPLAY = {"claude": "Claude Code", "codex": "Codex"}


def _block_exit_code() -> int:
    """Exit code that signals a block on the current host.

    Claude Code: 2 (primary signal, with the JSON as a secondary).
    Codex: 0 — the JSON is the ONLY block signal there; a non-zero exit marks
    the hook Failed and Codex fails open (verified on 0.145.0). Returning 2 on
    Codex would turn every block into a silent allow.
    """
    return 0 if AGENT == "codex" else 2


def _sigterm_handler(signum: int, frame: Any) -> None:
    """Flush buffers on SIGTERM so block signals reach the host agent."""
    sys.stdout.flush()
    sys.stderr.flush()
    # On Claude Code a SIGTERM near the hook timeout still emits the block
    # code. On Codex there is no such signal — exiting non-zero would only be
    # recorded as a hook failure — so fail open, matching Codex's own doctrine
    # for crashed/timed-out hooks.
    sys.exit(0 if AGENT == "codex" else 2)


signal.signal(signal.SIGTERM, _sigterm_handler)

try:
    import yaml
except ImportError:
    yaml = None


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
# Backend HTTP timeout — must leave headroom within the hook timeout (60s).
# Budget: ~1s uv startup + ~1s YAML/config + backend call + ~1s output/log.
# PHI/PII analysis by the backend LLM can take 15-20s for complex prompts.
# NOTE: urllib applies this per socket operation (connect / each recv) —
# it bounds neither getaddrinfo nor total wall time. The absolute caps
# live in the transport hardening section below.
BACKEND_TIMEOUT_SECONDS = 25


def _env_float(name: str, default: float) -> float:
    """Read a float env override; fall back to default on absent/garbage."""
    try:
        return float(os.environ.get(name) or default)
    except (TypeError, ValueError):
        return default


# Total wall-clock budget for one backend HTTP exchange, DNS included. On
# networks with black-holed IPv6 paths (NAT64/DNS64 cellular routers) a
# judge call was observed to stall 85s while the server processed it in
# <1s once it arrived (docs/incidents/2026-07-21-claude-hook-timeout-
# cold-start.md): Python has no happy-eyeballs, so each dead address
# burns a full BACKEND_TIMEOUT_SECONDS before the next is tried, and
# Claude Code then kills the hook at its own limit (default 60s) with a
# red "output discarded" error on every prompt. 28s preserves the full
# 25s server-side evaluation budget above while staying under the hook
# cap; expiry maps onto the existing backend-unreachable fail-open path,
# so decision semantics are unchanged.
BACKEND_TOTAL_DEADLINE_SECONDS = _env_float("WHITEOUT_HOOK_DEADLINE_SECONDS", 28.0)

# Cap for a single getaddrinfo() call, which urllib's timeout never
# covers — a stalled resolver otherwise hangs the hook indefinitely.
DNS_RESOLVE_TIMEOUT_SECONDS = 5.0

# Minimum text length to bother scanning
MIN_SCAN_LENGTH = 10

# Accountable Override command — the justification submission. Prefix match
# is case-insensitive; DOTALL lets multi-line justifications through.
OVERRIDE_COMMAND_RE = re.compile(
    r"^\s*whiteout override:\s*(.+)$", re.IGNORECASE | re.DOTALL
)


# ---------------------------------------------------------------------------
# Transport hardening (NAT64 / stalled-resolver networks)
# ---------------------------------------------------------------------------
# Pure transport-level bounds — no change to what is sent, received, or
# decided. Verdicts are identical; the only new outcome is that a hang
# which previously ended with Claude Code killing the hook now ends as a
# clean in-hook fail-open (the same path as any backend error).
_SYSTEM_GETADDRINFO = socket.getaddrinfo


def _bounded_v4first_getaddrinfo(*args, **kwargs):
    """socket.getaddrinfo with a hard timeout and IPv4-preferred ordering.

    * getaddrinfo is a blocking C call urllib's timeout does not cover;
      run it on a daemon thread and give up after
      DNS_RESOLVE_TIMEOUT_SECONDS (callers see a normal resolution
      failure → existing fail-open path).
    * Python tries addresses strictly in getaddrinfo order, so a
      black-holed IPv6 first hop costs a full per-address timeout before
      IPv4 is ever attempted. A stable sort putting AF_INET first makes
      the working path the first attempt on NAT64/DNS64 networks and is
      harmless elsewhere: v6-only hosts fail the v4 attempt instantly
      (no route) and fall through to v6 as before.
    """
    box: Dict[str, Any] = {}

    def _resolve() -> None:
        try:
            box["result"] = _SYSTEM_GETADDRINFO(*args, **kwargs)
        except Exception as exc:  # gaierror/OSError — re-raised below
            box["error"] = exc

    worker = threading.Thread(target=_resolve, daemon=True)
    worker.start()
    worker.join(DNS_RESOLVE_TIMEOUT_SECONDS)
    if worker.is_alive():
        raise socket.gaierror(
            getattr(socket, "EAI_AGAIN", -3),
            "DNS resolution exceeded %.0fs (Whiteout defender bound)"
            % DNS_RESOLVE_TIMEOUT_SECONDS,
        )
    if "error" in box:
        raise box["error"]
    return sorted(
        box["result"], key=lambda info: 0 if info[0] == socket.AF_INET else 1
    )


socket.getaddrinfo = _bounded_v4first_getaddrinfo


def _run_with_deadline(operation, deadline_seconds):
    """Run `operation` on a daemon thread; give up after `deadline_seconds`.

    Returns (finished, result). `operation` must do its own exception
    handling (both backend callers here catch everything and return a
    value). An attempt still wedged in connect/recv when the hook exits
    dies with the process instead of keeping it alive.
    """
    box: Dict[str, Any] = {}

    def _invoke() -> None:
        box["result"] = operation()

    worker = threading.Thread(target=_invoke, daemon=True)
    worker.start()
    worker.join(deadline_seconds)
    if worker.is_alive():
        return False, None
    return True, box.get("result")


def _is_token_expired(token: str) -> bool:
    """Check JWT exp claim without a library (base64 decode only)."""
    try:
        import base64
        import time
        parts = token.split(".")
        if len(parts) != 3:
            return False
        payload = parts[1]
        payload += "=" * (4 - len(payload) % 4)  # pad base64
        claims = json.loads(base64.b64decode(payload))
        exp = claims.get("exp", 0)
        return time.time() > exp
    except Exception:
        return False  # Can't determine — let backend decide


_BROKER_HOOK_TOKEN_URL = "http://127.0.0.1:18444/hook/token"
_BROKER_HOOK_TIMEOUT_SECONDS = 0.5
_BROKER_HOOK_SECRET_PATH = Path.home() / ".whiteout-desktop" / "hook-secret"


def _fetch_from_broker() -> Optional[Dict[str, str]]:
    """Resolve backend config from the local Desktop Guard broker.

    Uses a per-machine secret stored at ~/.whiteout-desktop/hook-secret as a
    capability check (mode 600, written by DG on first run). Returns None on
    any failure — caller falls through to defender-config.yaml legacy path.
    Tight timeout so a missing/down DG doesn't slow the hook fire.
    """
    try:
        # utf-8-sig, not utf-8: Desktop Guard has written this file with a
        # UTF-8 BOM (observed on Windows, 2026-07-15). Plain utf-8 keeps the
        # BOM as U+FEFF, str.strip() does not remove it (it is not whitespace
        # in Python), and urllib then fails to latin-1 encode the header —
        # raising UnicodeEncodeError, a ValueError subclass that the except
        # below swallows. The result was a silently dead broker path that fell
        # back to the short-lived config token and, once that expired, stopped
        # calling the backend at all. utf-8-sig strips a BOM when present and
        # is identical to utf-8 otherwise.
        secret = _BROKER_HOOK_SECRET_PATH.read_text(encoding="utf-8-sig").strip()
    except (FileNotFoundError, PermissionError, OSError):
        return None
    if not secret:
        return None

    req = urllib.request.Request(
        _BROKER_HOOK_TOKEN_URL,
        headers={"X-Hook-Secret": secret},
    )
    try:
        with urllib.request.urlopen(req, timeout=_BROKER_HOOK_TIMEOUT_SECONDS) as resp:
            if resp.status != 200:
                return None
            data = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, OSError, json.JSONDecodeError, ValueError):
        return None

    if not isinstance(data, dict):
        return None
    token = data.get("token")
    backend_url = data.get("backend_url")
    group_id = data.get("group_id")
    if not (token and backend_url and group_id):
        return None
    return {
        "backend_url": str(backend_url),
        "auth_token": str(token),
        "group_id": str(group_id),
    }


def load_backend_config() -> Optional[Dict[str, str]]:
    """Load backend connection config for policy compliance checks.

    Resolution order:
      1. Env vars (WHITEOUT_BACKEND_URL/_AUTH_TOKEN/_GROUP_ID) — for tests/overrides.
      2. DG broker loopback helper (127.0.0.1:18444/hook/token) — primary path
         when DG is running and broker mode is enabled.
      3. defender-config.yaml — legacy fallback for hosts without DG.
    """
    env_url = os.environ.get("WHITEOUT_BACKEND_URL")
    env_token = os.environ.get("WHITEOUT_AUTH_TOKEN")
    env_group = os.environ.get("WHITEOUT_GROUP_ID")
    if env_url and env_token and env_group:
        if _is_token_expired(env_token):
            print("[Whiteout] Token expired, skipping backend check", file=sys.stderr)
            return None
        return {
            "backend_url": env_url,
            "auth_token": env_token,
            "group_id": env_group,
        }

    broker_cfg = _fetch_from_broker()
    if broker_cfg is not None:
        if _is_token_expired(broker_cfg["auth_token"]):
            print("[Whiteout] Broker token expired, skipping backend check", file=sys.stderr)
            return None
        return broker_cfg

    config_path = _find_config_file("defender-config.yaml")
    if config_path is None or yaml is None:
        return None

    try:
        with open(config_path, "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f)
        if not isinstance(cfg, dict):
            return None
        if not cfg.get("backend_url") or not cfg.get("auth_token") or not cfg.get("group_id"):
            return None
        if _is_token_expired(str(cfg["auth_token"])):
            print("[Whiteout] Token expired, skipping backend check", file=sys.stderr)
            return None
        return {
            "backend_url": str(cfg["backend_url"]),
            "auth_token": str(cfg["auth_token"]),
            "group_id": str(cfg["group_id"]),
        }
    except Exception:
        return None


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


# ---------------------------------------------------------------------------
# Hook event logging (JSONL → consumed by VS Code extension)
# ---------------------------------------------------------------------------
HOOK_EVENTS_LOG = Path.home() / ".claude" / "hooks" / "whiteout-defender" / "hook-events.jsonl"
MAX_LOG_SIZE = 5 * 1024 * 1024   # 5 MB
TRIM_TO_SIZE = 1 * 1024 * 1024   # 1 MB

# Accountable Override state — lives next to hook-events.jsonl so all
# cross-invocation hook state stays in the same home-anchored directory.
# Holds either a pending block context ({decision_id, prompt_sha256,
# blocked_at[, prompt_text]}) or a minted allow-once token
# ({override_token, prompt_sha256, expires_at}).
PENDING_OVERRIDE_FILE = HOOK_EVENTS_LOG.parent / "pending-override.json"


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
    if decision == "allow" and event_type == "prompt_allow":
        defender_cfg = _load_defender_config()
        if not defender_cfg.get("log_allows", False):
            return

    _rotate_log_if_needed()

    record = {
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "hook_type": "UserPromptSubmit",
        "tool_name": "UserPrompt",
        "decision": decision,
        "source": source,
        # Codex passes no environment to hooks — session/cwd arrive in the
        # stdin payload instead, captured into these module globals by main().
        "session_id": SESSION_ID or os.environ.get("CLAUDE_SESSION_ID", ""),
        "project_dir": PROJECT_DIR or os.environ.get("CLAUDE_PROJECT_DIR", ""),
        "detections": detections,
        "max_severity": max_severity,
        "detection_count": len(detections),
        "policy_block": policy_block,
        "violated_policies": violated_policies or [],
        "policy_descriptions": policy_descriptions or [],
        "defender_version": HOOK_VERSION,
        # Which agent produced this event — consumers (VS Code hookEventWatcher,
        # DG ClaudeHookEventWatcher / AuditWatchers) attribute the row with it.
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
        pass


# ---------------------------------------------------------------------------
# Accountable Override state (pending-override.json)
# ---------------------------------------------------------------------------
def _sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _read_pending_override() -> Optional[Dict[str, Any]]:
    """Best-effort read of the override state file. None if absent/corrupt."""
    try:
        with open(PENDING_OVERRIDE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else None
    except Exception:
        return None


def _write_pending_override(data: Dict[str, Any]) -> None:
    try:
        PENDING_OVERRIDE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(PENDING_OVERRIDE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except Exception:
        pass


def _clear_pending_override() -> None:
    try:
        PENDING_OVERRIDE_FILE.unlink()
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Backend policy compliance
# ---------------------------------------------------------------------------
def check_backend_compliance(
    text: str,
    backend_config: Dict[str, str],
    override_token: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Call Whiteout backend to evaluate prompt against org policies.

    Uses the same /interception/judge endpoint as the browser extension.
    A valid `override_token` (minted by POST /ide-activity/override) makes
    the backend short-circuit to {blocked: false, status: "Overridden"}.
    """
    url = backend_config["backend_url"].rstrip("/") + "/interception/judge"
    token = backend_config["auth_token"]
    group_id = backend_config["group_id"]

    payload: Dict[str, Any] = {
        "text": text,
        "group_id": group_id,
        "ai_tool": _AGENT_AI_TOOL.get(AGENT, "claude_code"),
        "force": False,
    }
    if override_token:
        payload["override_token"] = override_token
    body = json.dumps(payload).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    try:
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=BACKEND_TIMEOUT_SECONDS) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"[Whiteout] Backend: blocked={result.get('blocked')}, compliant={result.get('is_compliant')}", file=sys.stderr)
            return result
    except Exception as exc:
        print(f"[Whiteout] Backend error ({type(exc).__name__}): {exc}", file=sys.stderr)
        return None


def call_override_endpoint(
    backend_config: Dict[str, str],
    justification: str,
    decision_id: Optional[str],
    prompt_text: Optional[str],
) -> Dict[str, Any]:
    """Call POST /ide-activity/override with the cached block context.

    Returns the backend response dict with "ok": True on success, or
    {"ok": False, "error": <user-facing message>[, "network": True]}.
    Unlike judging, overriding is NEVER fail-open — network failure is
    reported and consumes nothing.
    """
    url = backend_config["backend_url"].rstrip("/") + "/ide-activity/override"
    payload: Dict[str, Any] = {"justification": justification}
    if decision_id:
        payload["decision_id"] = decision_id
    elif prompt_text:
        payload["prompt_text"] = prompt_text
    body = json.dumps(payload).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {backend_config['auth_token']}",
    }

    try:
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=BACKEND_TIMEOUT_SECONDS) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            if isinstance(result, dict) and result.get("override_token"):
                result["ok"] = True
                return result
            return {"ok": False, "error": "Unexpected response from the compliance service."}
    except urllib.error.HTTPError as exc:
        detail = ""
        try:
            err_body = json.loads(exc.read().decode("utf-8"))
            raw = err_body.get("detail", "") if isinstance(err_body, dict) else ""
            detail = raw if isinstance(raw, str) else json.dumps(raw)
        except Exception:
            pass
        fallback = {
            403: "Override not permitted for your group.",
            404: "No recent blocked prompt found.",
            422: "Justification must be at least 20 characters.",
        }
        return {
            "ok": False,
            "error": detail or fallback.get(exc.code, f"Override failed (HTTP {exc.code})."),
        }
    except Exception as exc:
        print(f"[Whiteout] Override endpoint error ({type(exc).__name__}): {exc}", file=sys.stderr)
        return {
            "ok": False,
            "error": "Could not reach the compliance service — try again.",
            "network": True,
        }


# ---------------------------------------------------------------------------
# Output formatting
# ---------------------------------------------------------------------------
def format_policy_block(
    compliance_result: Dict[str, Any],
    prompt_preview: str,
) -> Dict[str, Any]:
    """Build block output for backend policy violation."""
    reason = compliance_result.get("reason", "Policy violation detected")
    policies = compliance_result.get("policy_descriptions", [])
    violated = compliance_result.get("violated_policies", [])

    lines = [
        "=" * 64,
        "WHITEOUT AI - PROMPT BLOCKED (Policy Compliance)",
        "=" * 64,
        "",
        "Your prompt was blocked before being processed.",
        f"Preview: {prompt_preview}",
        "",
        "This content violates your organization's policies:",
        "",
    ]

    if policies:
        for desc in policies:
            lines.append(f"  - {desc}")
    elif violated:
        for vid in violated:
            lines.append(f"  - Policy: {vid}")

    if reason:
        lines.extend(["", f"Reason: {reason}"])

    # Accountable Override escape hatch — only taught when the backend says
    # the user's group allows it. When override_available is false/absent
    # the message is byte-for-byte unchanged (feature invisible).
    if compliance_result.get("override_available"):
        lines.extend([
            "",
            "Your organization allows accountable overrides. To proceed,",
            "submit exactly: `whiteout override: <your justification (min 20 characters)>`",
            "then resubmit your prompt.",
        ])

    lines.extend([
        "",
        "Contact your Whiteout admin to adjust policies if needed.",
        "",
        "Powered by Whiteout AI (Groovy Security)",
        "=" * 64,
    ])

    return {
        "decision": "block",
        "reason": "\n".join(lines),
    }


def emit_block(reason: str) -> None:
    """Emit a block for the current host agent and exit. Never returns.

    Both hosts read {"decision": "block"} from stdout; they differ only in the
    exit code (see _block_exit_code). stdout is flushed BEFORE anything else
    because it is fully buffered when piped — if the process is killed near the
    timeout boundary, a buffered block signal is a silent allow.
    """
    print(json.dumps({"decision": "block", "reason": reason}))
    sys.stdout.flush()
    print(reason, file=sys.stderr)
    sys.stderr.flush()
    sys.exit(_block_exit_code())


def emit_override_block(message: str) -> None:
    """Block the current submission with an Accountable Override result.

    The `whiteout override: ...` command is a message to Whiteout, not a
    prompt for the model — it is ALWAYS blocked (exit 2) regardless of
    whether the override succeeded.
    """
    lines = [
        "=" * 64,
        "WHITEOUT AI - ACCOUNTABLE OVERRIDE",
        "=" * 64,
        "",
        message,
        "",
        "Powered by Whiteout AI (Groovy Security)",
        "=" * 64,
    ]
    emit_block("\n".join(lines))


def handle_override_command(justification: str) -> None:
    """Handle a `whiteout override: <justification>` submission. Always exits 2.

    Reads the pending block context cached by the most recent block, calls
    POST /ide-activity/override, and on success replaces the state file with
    the minted allow-once token so the next resubmit of the original prompt
    is allowed.
    """
    justification = justification.strip()
    pending = _read_pending_override()

    # A token was already minted and not yet spent.
    if pending and pending.get("override_token"):
        expires_at = float(pending.get("expires_at") or 0)
        if datetime.now(timezone.utc).timestamp() < expires_at:
            emit_override_block(
                "✅ Override already recorded — resubmit your prompt now to send it."
            )
        # Expired token is dead forever — drop it and fall through.
        _clear_pending_override()
        pending = None

    if not pending or not (pending.get("decision_id") or pending.get("prompt_text")):
        emit_override_block(
            "No recent blocked prompt found to override. Submit your prompt first —\n"
            "if it is blocked and your organization allows overrides, you can then\n"
            "submit: `whiteout override: <your justification (min 20 characters)>`"
        )

    backend_config = load_backend_config()
    if backend_config is None:
        # No backend connectivity/config — override is never fail-open.
        emit_override_block("Could not reach the compliance service — try again.")

    decision_id = pending.get("decision_id")
    prompt_text = pending.get("prompt_text") if not decision_id else None
    # Same absolute bound as the judge call. Overrides stay never-fail-open:
    # deadline expiry reports the existing network-failure message and
    # consumes nothing.
    finished, result = _run_with_deadline(
        lambda: call_override_endpoint(
            backend_config, justification, decision_id, prompt_text
        ),
        BACKEND_TOTAL_DEADLINE_SECONDS,
    )
    if not finished:
        result = {
            "ok": False,
            "error": "Could not reach the compliance service — try again.",
            "network": True,
        }

    if not result.get("ok"):
        # State file is left untouched — the user can fix and retry.
        emit_override_block(str(result.get("error") or "Override failed."))

    expires_in = int(result.get("expires_in") or 300)
    _write_pending_override({
        "override_token": str(result["override_token"]),
        "prompt_sha256": pending.get("prompt_sha256"),
        "expires_at": datetime.now(timezone.utc).timestamp() + expires_in,
    })
    emit_override_block("✅ Override recorded — resubmit your prompt now to send it.")


def get_prompt_preview(text: str, max_len: int = 80) -> str:
    """Build a truncated preview of the prompt for display."""
    # Collapse whitespace for preview
    preview = " ".join(text.split())
    if len(preview) > max_len:
        return preview[:max_len] + "..."
    return preview


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def _parse_agent(argv: List[str]) -> str:
    """Read --agent from argv without argparse (keeps hook startup cheap).

    Accepts `--agent codex` and `--agent=codex`. Anything unrecognized falls
    back to "claude", which preserves the pre-1.4.0 behavior exactly.
    """
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
    """Main entry point for the UserPromptSubmit hook.

    Flow:
      1. Parse prompt text from stdin
      2. Backend policy compliance — block if policy violated (fail-open)
      3. Allow if backend passes or is unreachable
    """
    global AGENT, SESSION_ID, PROJECT_DIR
    AGENT = _parse_agent(sys.argv[1:])

    # Read hook input
    try:
        input_data = json.load(sys.stdin)
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    # Session + project context. Claude Code exports these as env vars; Codex
    # supplies them only here, so prefer the payload and fall back to the env.
    SESSION_ID = str(input_data.get("session_id") or os.environ.get("CLAUDE_SESSION_ID", ""))
    PROJECT_DIR = str(input_data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR", ""))

    prompt = input_data.get("prompt", "")
    if not prompt or len(prompt) < MIN_SCAN_LENGTH:
        sys.exit(0)

    prompt_preview = get_prompt_preview(prompt)

    # ------------------------------------------------------------------
    # Accountable Override command — `whiteout override: <justification>`
    # ------------------------------------------------------------------
    # The justification submission is itself blocked (it never reaches the
    # model); the handler records the override and exits 2.
    override_match = OVERRIDE_COMMAND_RE.match(prompt)
    if override_match:
        handle_override_command(override_match.group(1))
        return  # unreachable — handle_override_command always exits

    # ------------------------------------------------------------------
    # Accountable Override allow-once resubmit
    # ------------------------------------------------------------------
    # If an unexpired override token exists for this exact prompt text,
    # spend it on the judge call: the backend short-circuits to
    # {blocked: false, status: "Overridden"} without re-running the engine.
    override_token: Optional[str] = None
    pending = _read_pending_override()
    if pending and pending.get("override_token") and pending.get("prompt_sha256"):
        expires_at = float(pending.get("expires_at") or 0)
        if datetime.now(timezone.utc).timestamp() >= expires_at:
            # Token TTL elapsed — it is dead forever; drop the state.
            _clear_pending_override()
        elif _sha256_text(prompt) == pending.get("prompt_sha256"):
            override_token = str(pending["override_token"])
        # On hash mismatch: leave the state file alone, evaluate normally.

    # ------------------------------------------------------------------
    # Backend policy compliance (when configured)
    # ------------------------------------------------------------------
    # Evaluate prompt against org policies via the Whiteout backend.
    # This is the only enforcement mechanism for user prompts — no local
    # regex scanning. Regex patterns are reserved for tool-level hooks.
    backend_config = load_backend_config()

    if backend_config is not None:
        # Absolute wall-clock bound (DNS + connect + TLS + response). On
        # expiry the verdict is simply "unreachable" — the same fail-open
        # branch as any backend error — but decided inside the hook instead
        # of by Claude Code's hook killer, so the prompt is neither delayed
        # past the deadline nor flagged with a timeout error.
        finished, compliance = _run_with_deadline(
            lambda: check_backend_compliance(
                prompt, backend_config, override_token=override_token
            ),
            BACKEND_TOTAL_DEADLINE_SECONDS,
        )
        if not finished:
            print(
                "[Whiteout] Backend call exceeded %.0fs deadline — fail-open"
                % BACKEND_TOTAL_DEADLINE_SECONDS,
                file=sys.stderr,
            )
            compliance = None

        if (
            override_token
            and compliance is not None
            and not compliance.get("blocked", False)
            and compliance.get("status") == "Overridden"
        ):
            # Token spent — the original PromptLog row (marked overridden)
            # is the audit record. Clear local state and surface the event
            # to the VS Code status bar via hook-events.jsonl.
            _clear_pending_override()
            log_hook_event(
                event_type="prompt_override",
                decision="allow",
                source=prompt_preview,
                detections=[{
                    "category": "Accountable Override",
                    "reason": compliance.get("reason", "Allowed via accountable override."),
                    "severity": "info",
                }],
                max_severity=None,
                policy_block=False,
                violated_policies=[],
                policy_descriptions=["Accountable override (audited)"],
                scan_phase="backend",
            )
            sys.exit(0)

        if compliance is not None and compliance.get("blocked", False):
            # Fail-safe: if the backend returned a block solely because the
            # compliance engine itself is unavailable (e.g. model swap, sidecar
            # restart), treat it as a soft-allow. Matches the browser
            # extension and frontend streamClient behavior so a transient
            # outage doesn't lock the developer out of their coding agent.
            v_policies_check = compliance.get("violated_policies", []) or []
            if v_policies_check and all(
                str(p).strip() == "SYSTEM: compliance-unavailable"
                for p in v_policies_check
            ):
                print(
                    "[Whiteout] Compliance engine unavailable — soft-allow (fail-open)",
                    file=sys.stderr,
                )
                log_hook_event(
                    event_type="prompt_allow",
                    decision="allow",
                    source=prompt_preview,
                    detections=[{
                        "category": "Compliance Unavailable",
                        "reason": compliance.get("reason", "compliance unavailable"),
                        "severity": "info",
                    }],
                    max_severity=None,
                    policy_block=False,
                    violated_policies=[],
                    policy_descriptions=["SYSTEM: compliance-unavailable (soft-allow)"],
                    scan_phase="backend",
                )
                sys.exit(0)

            # CRITICAL: Output block signal FIRST, flush IMMEDIATELY.
            # stdout is fully buffered when piped — if we log first and the
            # process is killed near the timeout boundary, the host agent never
            # sees the block JSON even though the log file records it.
            #
            # NOTE: unlike every other block path this one does NOT exit here —
            # the override context and the audit event still have to be written
            # first, so the exit happens at the end of the branch.
            output = format_policy_block(compliance, prompt_preview)
            print(json.dumps(output))
            sys.stdout.flush()
            print(output["reason"], file=sys.stderr)
            sys.stderr.flush()

            # Cache the block context for a potential accountable override
            # (best-effort — block signal is already sent). Only when the
            # backend says the group allows it; otherwise any prior state
            # is left untouched and the feature stays invisible.
            if compliance.get("override_available"):
                pending_ctx: Dict[str, Any] = {
                    "decision_id": compliance.get("decision_id"),
                    "prompt_sha256": _sha256_text(prompt),
                    "blocked_at": datetime.now(timezone.utc).isoformat(),
                }
                if not pending_ctx["decision_id"]:
                    # decision_id can be null on the wire — keep the exact
                    # blocked text so POST /ide-activity/override can resolve
                    # the block via its prompt_text fallback.
                    pending_ctx["prompt_text"] = prompt
                _write_pending_override(pending_ctx)

            # Now log (best-effort — block signal is already sent)
            v_policies = compliance.get("violated_policies", [])
            p_descriptions = compliance.get("policy_descriptions", [])
            log_hook_event(
                event_type="prompt_block",
                decision="block",
                source=prompt_preview,
                detections=[{
                    "category": "Policy Violation",
                    "reason": compliance.get("reason", ""),
                    "severity": "high",
                }],
                max_severity="high",
                policy_block=True,
                violated_policies=v_policies,
                policy_descriptions=p_descriptions,
                scan_phase="backend",
            )
            sys.exit(_block_exit_code())

        # compliance is None → fail-open (backend unreachable), continue

    # ------------------------------------------------------------------
    # All clear — allow prompt
    # ------------------------------------------------------------------
    log_hook_event(
        event_type="prompt_allow",
        decision="allow",
        source=prompt_preview,
        detections=[],
        max_severity=None,
        scan_phase="backend" if backend_config else "none",
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
