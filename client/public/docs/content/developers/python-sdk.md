# Python SDK

The Whiteout AI Python SDK wraps your AI API calls with Whiteout policy enforcement. Three lines of code add governance — policy evaluation, audit, and compliance — to any Python AI application.

## Overview

The SDK gives your application:
- Pre-call policy evaluation of prompts before they reach an AI provider
- Automatic provider detection for OpenAI, Anthropic, Google, and Mistral calls
- Fast checks cached locally (provider blocks, model allowlists) so most decisions never leave your process
- Remote compliance evaluation for content policies
- Output governance — AI responses are scanned in the background after the call returns
- Fail-open behavior by default, so a Whiteout outage never breaks your application
- Thread safety for use in multi-threaded services

## Prerequisites

Before you begin, ensure you have:
- **Python** application making AI API calls (OpenAI, Anthropic, Google, or Mistral)
- **Whiteout AI Admin** access, to mint an enrollment token
- Your organization's **Whiteout API URL** (for example, `https://your-org.api.whiteout.groovysec.com`)

---

## Installation

```bash
pip install whiteout-ai
```

## Getting an Enrollment Token

The SDK authenticates to your Whiteout backend with an enrollment token:

1. Log in to the Whiteout AI admin console as an administrator
2. Mint a new enrollment token for SDK use
3. Copy the token (starts with `whiteout_enroll_...`) and store it securely — for example, in an environment variable or your secrets manager

Treat enrollment tokens like any other credential: do not commit them to source control, and rotate them according to your security policy.

---

## Quick Start

Create a `WhiteoutGuard` once at application startup, then use it to evaluate or wrap AI calls:

```python
from whiteout_ai import WhiteoutGuard

guard = WhiteoutGuard(
    token="whiteout_enroll_...",
    backend_url="https://your-org.api.whiteout.groovysec.com",
)
```

The SDK supports three integration patterns.

### Pattern 1: Evaluate a Prompt Directly

Call `evaluate()` to check a prompt against your policies before you send it anywhere:

```python
result = guard.evaluate(
    prompt="Summarize this patient record...",
    ai_provider="openai",
    model="gpt-4o",
)
# result = {"decision": "block", "reason": "Contains PHI", ...}
```

Use this pattern when you want full control over what happens on a `block` or `warn` decision — for example, to show a custom message to the user or route the request elsewhere.

### Pattern 2: Wrap an AI SDK Call

Call `wrap()` to have Whiteout evaluate, execute, and govern a provider call in one step:

```python
import openai

response = guard.wrap(
    openai.chat.completions.create,
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello world"}],
)
```

`wrap()` extracts the prompt, provider, and model from the call arguments, evaluates the prompt pre-call, runs the call if allowed, and scans the response in the background for output governance.

### Pattern 3: Catch Blocked Prompts

When a prompt violates policy, the SDK raises `WhiteoutBlockedError`. Catch it to handle blocks gracefully:

```python
from whiteout_ai import WhiteoutBlockedError

try:
    guard.evaluate(prompt="SSN 123-45-6789")
except WhiteoutBlockedError as e:
    print(f"Blocked: {e.reason}")
    print(f"Policies: {e.violated_policies}")
```

The exception carries the block `reason` and the list of `violated_policies`, so you can log the decision or surface it to the user.

---

## Configuration Reference

Pass these parameters to the `WhiteoutGuard` constructor:

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `token` | Yes | - | Enrollment token minted in the Whiteout AI admin console |
| `backend_url` | Yes | - | Your organization's Whiteout API URL |
| `fail_open` | No | `True` | Allow calls through when the backend is unreachable |
| `timeout` | No | `10.0` | Backend call timeout, in seconds |
| `mode` | No | `sdk` | Deployment mode identifier reported to the backend |

---

## Automatic Provider Detection

When you use `guard.wrap()`, the SDK inspects the wrapped call and detects the AI provider automatically. Detection is supported for:

| Provider | Detected |
|----------|----------|
| **OpenAI** | Yes |
| **Anthropic** | Yes |
| **Google** | Yes |
| **Mistral** | Yes |

When you use `guard.evaluate()` directly, pass `ai_provider` and `model` explicitly so policy rules that target specific providers or models can apply.

---

## Fail-Open Semantics

By default the SDK **fails open**: if the Whiteout backend is unreachable — at startup or during an evaluation — your AI calls are allowed through. This guarantees that a Whiteout outage or a network problem never breaks your application.

Consider the trade-off for your environment:

- **Fail open (`fail_open=True`, default)**: Availability first. Governance is best-effort during a backend outage. Recommended for most production applications.
- **Fail closed (`fail_open=False`)**: Enforcement first. If the backend cannot be reached, AI calls fail rather than proceed ungoverned. Appropriate for high-compliance workloads where an unevaluated prompt is unacceptable.

Note that fast checks cached locally (provider blocks, model allowlists) continue to apply regardless of backend reachability.

---

## Troubleshooting

### Calls Are Allowed When You Expected a Block

- Remember the SDK fails open by default — if the backend is unreachable, calls go through. Verify connectivity to your `backend_url` from the application host
- Confirm the relevant policy is enabled in the Whiteout AI admin console
- Check that the prompt actually reaches the guard (`evaluate()` or `wrap()`), rather than calling the provider SDK directly

### `WhiteoutBlockedError` on Legitimate Prompts

- Inspect `e.reason` and `e.violated_policies` to identify which policy fired
- Review and tune the policy in the Whiteout AI admin console

### Authentication Errors

- Verify the enrollment token is complete and has not been revoked
- Mint a fresh token in the admin console and update your configuration

### Timeouts

- The default backend timeout is 10 seconds; raise the `timeout` parameter if your network path to the backend is slow
- With `fail_open=True`, a timed-out evaluation allows the call through rather than failing your request

### Wrong or Missing Provider Detection

- Provider detection applies to `wrap()` calls for OpenAI, Anthropic, Google, and Mistral SDK shapes
- For any other provider, or for custom call paths, use `evaluate()` and pass `ai_provider` and `model` explicitly

---

## Related Guides

- **Node.js SDK** — the same guard pattern for Node 18+ applications
- **AWS Lambda Layer** — deploy this SDK to Lambda functions with zero packaging changes
