# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
"""Whiteout AI - Claude Code Prompt Compliance Gate (UserPromptSubmit Hook)"""
import json, os, re, sys, urllib.request, urllib.error
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

def _is_token_expired(token):
    try:
        import base64, time
        parts = token.split(".")
        if len(parts) != 3: return False
        payload = parts[1] + "=" * (4 - len(parts[1]) % 4)
        claims = json.loads(base64.b64decode(payload))
        return time.time() > claims.get("exp", 0)
    except Exception:
        return False

def load_backend_config():
    url = os.environ.get("WHITEOUT_BACKEND_URL")
    token = os.environ.get("WHITEOUT_AUTH_TOKEN")
    group = os.environ.get("WHITEOUT_GROUP_ID")
    if url and token and group:
        if _is_token_expired(token):
            print("[Whiteout] Token expired, skipping backend check", file=sys.stderr)
            return None
        return {"backend_url": url, "auth_token": token, "group_id": group}
    script_dir = Path(__file__).parent
    cfg_path = script_dir / "defender-config.yaml"
    if cfg_path.exists() and yaml:
        with open(cfg_path, "r") as f:
            cfg = yaml.safe_load(f) or {}
        if cfg.get("backend_url") and cfg.get("auth_token") and cfg.get("group_id"):
            if _is_token_expired(str(cfg.get("auth_token", ""))):
                print("[Whiteout] Token expired, skipping backend check", file=sys.stderr)
                return None
            return cfg
    return None

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

def check_backend(text, backend_config):
    try:
        url = backend_config["backend_url"].rstrip("/") + "/interception/judge"
        body = json.dumps({"text": text, "group_id": backend_config["group_id"],
                           "ai_tool": "claude_code", "force": False}).encode()
        req = urllib.request.Request(url, data=body, method="POST",
            headers={"Content-Type": "application/json",
                     "Authorization": f"Bearer {backend_config['auth_token']}"})
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode())
            print(f"[Whiteout] Backend: blocked={result.get('blocked')}, compliant={result.get('is_compliant')}", file=sys.stderr)
            return result
    except Exception as exc:
        print(f"[Whiteout] Backend error ({type(exc).__name__}): {exc}", file=sys.stderr)
        return None

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    prompt = data.get("prompt", "")
    if not prompt or len(prompt) < 10:
        sys.exit(0)
    preview = " ".join(prompt.split())[:80]
    # Phase 1: Backend policy compliance (catches API keys, PHI, secrets)
    backend_config = load_backend_config()
    if backend_config:
        result = check_backend(prompt, backend_config)
        if result and result.get("blocked"):
            policies = result.get("policy_descriptions", [])
            reason = result.get("reason", "Policy violation")
            lines = ["=" * 64, "WHITEOUT AI - PROMPT BLOCKED (Policy)", "=" * 64, ""]
            for p in policies:
                lines.append(f"  - {p}")
            if reason:
                lines.append(f"\nReason: {reason}")
            lines.extend(["", "=" * 64])
            reason_text = "\n".join(lines)
            print(json.dumps({"decision": "block", "reason": reason_text}))
            print(reason_text, file=sys.stderr)
            sys.exit(2)
    # Phase 2: Local pattern scan (catches injection attempts)
    config = load_patterns()
    detections = scan(prompt, config)
    blocking = [d for d in detections if d[3] in BLOCKING_SEVERITIES]
    if blocking:
        lines = ["=" * 64, "WHITEOUT AI - PROMPT BLOCKED", "=" * 64, "",
                 f"Preview: {preview}", ""]
        for cat, _, reason, sev in blocking:
            lines.append(f"  [{sev.upper()}] [{cat}] {reason}")
        lines.extend(["", "Prompt blocked before processing.", "=" * 64])
        reason_text = "\n".join(lines)
        print(json.dumps({"decision": "block", "reason": reason_text}))
        print(reason_text, file=sys.stderr)
        sys.exit(2)
    sys.exit(0)

if __name__ == "__main__":
    main()
