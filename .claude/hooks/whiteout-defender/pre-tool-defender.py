# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
"""Whiteout AI - Claude Code Policy Compliance Gate (PreToolUse Hook)"""
import json, os, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    yaml = None

BLOCKING_SEVERITIES = {"critical", "high"}

def load_patterns():
    script_dir = Path(__file__).parent
    cfg = script_dir / "patterns.yaml"
    if cfg.exists() and yaml:
        with open(cfg, "r") as f:
            return yaml.safe_load(f) or {}
    return {}

def is_excluded_path(tool_name, tool_input):
    _EXCLUDED = ("/whiteout-defender/", "/vscode-extension/src/defend/")
    def _chk(fp):
        return any(m in fp for m in _EXCLUDED)
    if tool_name in ("Read", "Write", "Edit"):
        return _chk(tool_input.get("file_path", ""))
    elif tool_name == "Grep":
        return _chk(tool_input.get("path", ""))
    elif tool_name == "Glob":
        return _chk(tool_input.get("path", ""))
    elif tool_name == "NotebookEdit":
        return _chk(tool_input.get("notebook_path", ""))
    return False

def extract_input_text(tool_name, tool_input):
    field_map = {"Bash": "command", "Write": "content", "Edit": "new_string",
                 "NotebookEdit": "new_source", "Task": "prompt", "Read": "file_path",
                 "WebFetch": "url", "Grep": "pattern", "Glob": "pattern"}
    return tool_input.get(field_map.get(tool_name, ""), "")

def scan(text, config):
    detections = []
    categories = [
        ("Instruction Override", "instructionOverridePatterns"),
        ("Role-Playing/DAN", "rolePlayingPatterns"),
        ("Encoding/Obfuscation", "encodingPatterns"),
        ("Context Manipulation", "contextManipulationPatterns"),
        ("Data Exfiltration", "dataExfiltrationPatterns"),
        ("Policy Bypass", "policyBypassPatterns"),
    ]
    for cat_name, key in categories:
        for item in config.get(key, []):
            if not isinstance(item, dict): continue
            p = item.get("pattern", "")
            if p:
                try:
                    if re.search(p, text, re.IGNORECASE | re.MULTILINE):
                        detections.append((cat_name, p, item.get("reason", ""), item.get("severity", "medium")))
                except re.error:
                    pass
    return detections

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})
    monitored = {"Read","WebFetch","Bash","Grep","Glob","Task","Edit","Write","NotebookEdit"}
    if tool_name not in monitored:
        sys.exit(0)
    if is_excluded_path(tool_name, tool_input):
        sys.exit(0)
    text = extract_input_text(tool_name, tool_input)
    if not text or len(text) < 10:
        sys.exit(0)
    config = load_patterns()
    detections = scan(text, config)
    blocking = [d for d in detections if d[3] in BLOCKING_SEVERITIES]
    if blocking:
        lines = ["=" * 64, "WHITEOUT AI - PRE-EXECUTION BLOCK", "=" * 64, ""]
        for cat, _, reason, sev in blocking:
            lines.append(f"  [{sev.upper()}] [{cat}] {reason}")
        lines.extend(["", "Action blocked before execution.", "=" * 64])
        print(json.dumps({"decision": "block", "reason": "\n".join(lines)}))
        sys.exit(0)
    # No backend call - policy compliance handled by prompt-defender only
    sys.exit(0)

if __name__ == "__main__":
    main()
