# Guard API Reference

The Guard API is the public HTTP interface behind every server-side Custom AI Apps method. Call it from any language: check each prompt before it reaches the model, and each reply before it reaches the user. The Python and Node SDKs, auto-instrumentation and the gateway plugins all use it under the hood.

## Overview

| Endpoint | Purpose | Can block |
|----------|---------|-----------|
| `POST /v1/guard/input` | Check a prompt (and optional context) before it reaches the model | Yes |
| `POST /v1/guard/output` | Check the model's reply before it reaches the user | Yes |
| `POST /v1/guard/events` | Record calls that already happened, in batches | No |
| `GET /v1/guard/config` | Read the app's policy settings, for client-side caching | Not applicable |
| `POST /v1/guard/portkey` | Webhook adapter for Portkey guardrails (see [Gateways](./custom-ai-apps/gateways.md#portkey)) | Yes |
| `POST /v1/otlp/traces` | OpenTelemetry trace ingest (see [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md#opentelemetry-visibility-only)) | No |

## Prerequisites

Before you begin, ensure you have:
- A registered custom app (see [Register an App](./custom-ai-apps/setup-wizard.md))
- An **app key** for the environment you're calling from (`wo_app_<environment>_…`), stored as a secret
- Your **Whiteout API URL**. The wizard's snippets are pre-filled with it. The examples below use `$WHITEOUT_BASE_URL`

---

## Authentication

Send the app key as a bearer token on every request:

```http
Authorization: Bearer wo_app_prod_xxxxxxxxxxxxxxxx
```

The key decides the organisation, the app, the environment and the policy. Nothing in the request body can change them. A key can only check and record calls for its own app; it can't read logs or admin data.

App keys created in the admin console carry three scopes: `guard:evaluate` (`/input`, `/output`, `/portkey`), `guard:events` (`/events`, `/v1/otlp/traces`) and `guard:config` (`/config`).

Gateway keys (`wo_gw_…`) are accepted on the same endpoints. With a gateway key, name the app each call belongs to in the `X-Whiteout-App` header or the `app_ref` body field. See [Gateways](./custom-ai-apps/gateways.md).

---

## Quick Start

### curl

```bash
# 1. Check the prompt
curl -s "$WHITEOUT_BASE_URL/v1/guard/input" \
  -H "Authorization: Bearer $WHITEOUT_APP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Summarise this contract"}],"provider":"openai","model":"gpt-4o"}'

# → {"decision":"allow","evaluation_id":"6f1c…","mode":"enforce","fail_open":false,…}

# 2. Call your model, then check the reply before showing it
curl -s "$WHITEOUT_BASE_URL/v1/guard/output" \
  -H "Authorization: Bearer $WHITEOUT_APP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"evaluation_id":"<from step 1>","text":"<model reply>"}'
```

### Python

```python
import os, requests

GUARD = os.environ["WHITEOUT_BASE_URL"].rstrip("/") + "/v1/guard"
HEADERS = {"Authorization": f"Bearer {os.environ['WHITEOUT_APP_KEY']}"}

def guarded_chat(messages, call_model):
    check = requests.post(f"{GUARD}/input", headers=HEADERS, timeout=15,
                          json={"messages": messages, "provider": "openai"}).json()
    if check["decision"] == "block":
        return "This request was blocked by your organisation's AI policy."
    reply = call_model(messages)
    out = requests.post(f"{GUARD}/output", headers=HEADERS, timeout=15,
                        json={"evaluation_id": check["evaluation_id"], "text": reply}).json()
    return "The response was withheld by policy." if out["decision"] == "block" else reply
```

### Node.js

```js
const GUARD = `${process.env.WHITEOUT_BASE_URL.replace(/\/+$/, "")}/v1/guard`;
const headers = { Authorization: `Bearer ${process.env.WHITEOUT_APP_KEY}`, "Content-Type": "application/json" };

export async function guardedChat(messages, callModel) {
  const check = await (await fetch(`${GUARD}/input`, { method: "POST", headers,
    body: JSON.stringify({ messages, provider: "openai" }) })).json();
  if (check.decision === "block") return "This request was blocked by your organisation's AI policy.";
  const reply = await callModel(messages);
  const out = await (await fetch(`${GUARD}/output`, { method: "POST", headers,
    body: JSON.stringify({ evaluation_id: check.evaluation_id, text: reply }) })).json();
  return out.decision === "block" ? "The response was withheld by policy." : reply;
}
```

These examples don't handle network errors. In production, decide what your app does when Whiteout can't be reached (see [Handling Failures](#handling-failures)), or use the [SDK](./custom-ai-apps/sdk-integration.md), which does this for you.

---

## POST /v1/guard/input

Check a prompt before it reaches the model.

### Request headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <app key or gateway key>` |
| `Content-Type` | Yes | `application/json` |
| `X-Whiteout-User-Token` | No | The signed-in employee's OpenID Connect ID token, for apps using the employee's own policies |
| `X-Whiteout-User-Email` | No | The employee's email, accepted only when the app is set to trust app-asserted identity |
| `X-Whiteout-App` | Gateway keys | Which app the call belongs to |

### Request body

Provide `messages`, `text`, or both.

| Field | Type | Description |
|-------|------|-------------|
| `messages` | array | The conversation, as `{"role": "...", "content": "..."}` objects. Roles: `system`, `user`, `assistant`, `tool`. Up to 500 messages |
| `text` | string | A plain prompt, instead of or in addition to `messages` |
| `scan` | array | What to check: any of `user`, `system`, `context`, `tool`. Default `["user"]`, which checks the **latest** user message |
| `context` | array | Retrieved documents or other context, as `{"source": "...", "content": "..."}`. Checked when `scan` includes `context`. Up to 100 documents |
| `model` | string | The model the app is calling. Needed for the model allowlist |
| `provider` | string | The provider, for example `openai`, `anthropic`, `bedrock`. Needed for blocked providers |
| `token_count_in` | integer | Input token count, if known. Needed for the token budget |
| `end_user` | string | An opaque ID for your app's end user. Whiteout stores only a keyed hash of it, never the raw value |
| `session_id` | string | Your conversation or session ID |
| `metadata` | object | Free-form metadata |
| `app_ref` | string | Gateway keys only: which app the call belongs to (alternative to `X-Whiteout-App`) |

Each text field can be up to 200,000 characters.

> **What `scan` controls.** By default only the latest user message is checked. Add `system` to catch sensitive data in system prompts, `tool` for tool results, and `context` for retrieved documents, for example `"scan": ["user", "context", "tool"]` in a retrieval app.

### Response

```json
{
  "decision": "block",
  "violated_policies": ["PII - Government identifiers"],
  "reason": "The prompt contains a social security number.",
  "evaluation_id": "6f1c2e9a-8a51-4c0b-9d1e-2b7f3c1d0a42",
  "fail_open": false,
  "mode": "enforce",
  "latency_ms": 412
}
```

| Field | Description |
|-------|-------------|
| `decision` | `allow`, `warn` or `block` (see [Verdicts](./custom-ai-apps/policies-and-identity.md#verdicts)) |
| `violated_policies` | Names of the policies that matched |
| `reason` | A human-readable explanation |
| `evaluation_id` | Pass this to `/v1/guard/output` so the reply is linked to the prompt |
| `fail_open` | `true` when Whiteout couldn't reach a verdict and allowed the call under a fail-open policy |
| `mode` | The mode applied: `monitor`, `warn` or `enforce` |
| `latency_ms` | How long the check took |
| `rule` | Present when a model, provider or token check matched: `model_not_allowed`, `blocked_provider` or `token_budget` |
| `user` | Employee-policy apps: the verified employee (`email`, `group_id`, `verified_by`) |
| `identity` | Employee-policy apps: why the call fell back to the app's policy group, when it did |
| `blocked_by` | `ai_app_access` when the app is blocked for the employee's group under AI Applications |
| `redacted_text` | Employee-policy apps only, on some blocks: a redacted version of the prompt produced by your organisation's redaction settings |
| `injection` | When Prompt Injection Defense is on: what was detected. In an audit-only organisation, `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}` instead, because the detector doesn't run |
| `quarantine` | When Prompt Injection Defense is on: `{"messages": [...], "context": [...]}`, the indexes of messages and context documents to keep away from the model |
| `enforced` | Audit-only organisations: `false` when a check would have blocked or warned but wasn't enforced (see [Audit-only organisations](#audit-only-organisations)) |
| `would_action` | Audit-only organisations: what the check asked for, `block` or `warn` |
| `suppressed_by` | Audit-only organisations: `"AUDIT_ONLY"` |
| `would_block_by` | Audit-only organisations, employee-policy apps: `ai_app_access` when the app is blocked for the employee's group but the call was allowed |

If `decision` is `block`, don't send the prompt to the model. If it's `warn`, you may continue and show the reason. Fields you don't use can be ignored; new optional fields may be added.

---

## POST /v1/guard/output

Check the model's reply before it reaches the user. This call is synchronous and can block.

| Field | Type | Description |
|-------|------|-------------|
| `evaluation_id` | string | **Required.** The `evaluation_id` from `/input`. If Whiteout doesn't recognise it, the reply is recorded as a standalone call |
| `text` | string | **Required.** The reply text |
| `finish` | boolean | Default `true`. Set `false` for a streaming checkpoint (see below) |
| `model`, `provider` | string | As for `/input` |
| `token_count_in`, `token_count_out` | integer | Token counts from the provider, if known |
| `app_ref` | string | Gateway keys only |

The response has the same shape as `/input`, plus `response_flagged` (`true` when the reply violated a policy). In `enforce` mode a violation returns `block`: withhold the reply. In `monitor` mode the reply is recorded as flagged and the decision stays `allow`.

### Streaming replies

To check a streamed reply while it's being generated, send the text so far with `"finish": false` at intervals (for example every 2,000 characters), then the complete text with `"finish": true`.

- A **clean checkpoint** returns the verdict and records nothing
- A **flagged checkpoint** is recorded, because your app should stop the stream there
- The **final call** (`finish: true`) records the reply

Text already shown to the user can't be taken back. Where you enforce, hold the reply until the final check passes. The SDKs do this by default.

---

## POST /v1/guard/events

Record calls your app already made, without checking their content. Useful for back-filling, or for apps that can only report after the fact.

```json
{
  "events": [
    {"input": "…", "output": "…", "model": "gpt-4o", "provider": "openai",
     "end_user": "user-1234", "token_count_in": 812, "token_count_out": 240}
  ]
}
```

| Field | Description |
|-------|-------------|
| `events` | 1 to 100 events. Each may carry `input`, `output`, `model`, `provider`, `end_user`, `token_count_in`, `token_count_out` (all optional) |
| `app_ref` | Gateway keys only |

The response is `202 Accepted` with `{"accepted": 1, "flagged": 0}`. Events are recorded in the app's activity (text only with `full` data capture), and the model, provider and token checks are applied as *would block* findings. **Events never block and are never sent to the compliance engine.** Use `/input` and `/output` for content checks.

---

## GET /v1/guard/config

Returns the settings that apply to the key, so clients can cache them. Supports `ETag` / `If-None-Match` (a `304` when unchanged).

```json
{
  "app": {"id": "…", "name": "Support Assistant", "slug": "support-assistant"},
  "environment": "prod",
  "mode": "enforce",
  "fail_behavior": "open",
  "data_capture": "metadata_only",
  "allowed_models": ["gpt-4o"],
  "blocked_providers": [],
  "max_tokens_per_call": null,
  "timeout_seconds": 10
}
```

With a gateway key, `app` is `null` and a `gateway` object is included instead. The SDKs read this endpoint to follow your policy group's fail behaviour.

In an [audit-only organisation](#audit-only-organisations), the response is non-blocking whatever the policy group says, so a client that caches it never blocks or fails closed locally: `mode` is `monitor`, `fail_behavior` is `open`, `allowed_models` and `blocked_providers` are empty, `max_tokens_per_call` is `null`, and `"auditonly": true` is added.

---

## Audit-Only Organisations

If your organisation runs Whiteout in [audit-only mode](./governance/audit-only-mode.md), the Guard API never blocks. Every check still runs and is recorded:

- `/input` and `/output` always return `"decision": "allow"` and `"mode": "monitor"`, and fail open even when the policy group fails closed.
- When a model, provider or token check, an AI Applications rule, or a fail-closed setting would have acted, the response adds `"enforced": false`, `"would_action"` (`block` or `warn`) and `"suppressed_by": "AUDIT_ONLY"`. A model, provider or token match also carries `rule`, as usual.
- Prompt Injection Defense doesn't run. If it's switched on in your settings, `injection` reads `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}` and there's no `quarantine` object. If it's switched off, `injection` is left out, as usual.
- `/v1/guard/portkey` always returns `"verdict": true`.
- `/v1/guard/config` serves non-blocking settings, as described under `GET /v1/guard/config` above.

Example: an app whose policy group is in `enforce` mode calls a model that isn't on the allowlist.

```json
{
  "decision": "allow",
  "violated_policies": [],
  "reason": "Model 'gpt-4o-mini' is not on the allowlist",
  "evaluation_id": "6f1c2e9a-8a51-4c0b-9d1e-2b7f3c1d0a42",
  "fail_open": false,
  "mode": "monitor",
  "latency_ms": 38,
  "enforced": false,
  "would_action": "block",
  "suppressed_by": "AUDIT_ONLY",
  "rule": "model_not_allowed"
}
```

The extra fields are additive, so existing code and SDKs keep working unchanged. Read them if you want your app to log or show what enforcement would have done.

---

## Errors

Error responses use standard HTTP status codes. Authentication and state errors carry a machine-readable code:

```json
{"detail": {"code": "key_revoked", "message": "This app key has been revoked"}}
```

| Status | Code | Meaning | What to do |
|--------|------|---------|-----------|
| 401 | `invalid_key` | Missing, malformed or unknown key | Check `WHITEOUT_APP_KEY` is set to a complete `wo_app_…` key |
| 401 | `key_revoked` | The key was revoked | Deploy a current key from the app's **Keys** tab |
| 401 | `key_expired` | The key has expired | Mint a new key |
| 401 | `app_not_found` | The app was archived | Register the app again, or use another app's key |
| 401 | `gateway_not_found` | The gateway was removed | Use a current gateway key |
| 403 | `scope_missing` | The key lacks the scope this endpoint needs | Use a key minted in the admin console |
| 409 | `app_paused` | An admin paused coverage for this app | Resume coverage on the app page |
| 422 | | The request body is invalid, for example neither `messages` nor `text` was sent, or an unknown role was used | Fix the request |
| 429 | | Rate limit exceeded | Back off and retry |

Whiteout never returns an error because the compliance engine is slow or unavailable. It returns `200` with a decision based on the policy group's fail behaviour and `fail_open` set accordingly.

---

## Rate Limits and Size Limits

| Limit | Value |
|-------|-------|
| `/v1/guard/input`, `/v1/guard/output`, `/v1/guard/portkey` | 600 requests per minute per key |
| `/v1/guard/events` | 120 requests per minute per key (up to 100 events each) |
| `/v1/otlp/traces` | 240 requests per minute per key |
| Text per field | 200,000 characters |
| Messages per call | 500 |
| Context documents per call | 100 |

---

## Handling Failures

Decide in advance what your app does when Whiteout can't be reached, and make it match the app's policy group:

- **Fail open** (default for most apps): if the call to Whiteout times out or errors, continue to the model and log it. Your app stays available; the call is ungoverned.
- **Fail closed**: if the call to Whiteout fails, don't call the model. Use this where an unchecked prompt is unacceptable.

Recommended practice:

- Set a client timeout a little above the policy group's compliance timeout (10 seconds by default), for example 15 seconds
- Treat `401` and `409` as coverage problems and alert on them, not just as failures
- Read `GET /v1/guard/config` at startup and use its `fail_behavior`, which is what the SDKs do

See [Fail Behaviour](./custom-ai-apps/policies-and-identity.md#fail-behaviour) for how Whiteout itself handles timeouts.

---

## Related Guides

- [SDK Integration](./custom-ai-apps/sdk-integration.md): the same API with streaming, retries and fail behaviour built in
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md): what each decision means
- [Gateways](./custom-ai-apps/gateways.md): calling the Guard API from a gateway
