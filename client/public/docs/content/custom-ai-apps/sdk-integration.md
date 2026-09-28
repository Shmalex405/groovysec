# SDK Integration

The Whiteout AI SDKs for Python and Node.js cover a custom app with two lines of code. Wrap your OpenAI or Anthropic client once, and every prompt is checked before it reaches the model and every reply (including streams) before it reaches your user. The SDKs call the [Guard API](./custom-ai-apps/guard-api.md) for you and handle streaming, fail behaviour and quarantine.

This guide covers `AppGuard`, the client for Custom AI Apps. If you'd rather not change code at all, see [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md). The older enrollment-token client, `WhiteoutGuard`, is for infrastructure workloads and is documented in the [Python SDK](./developers/python-sdk.md) and [Node.js SDK](./developers/node-sdk.md) guides.

## Overview

`AppGuard` gives your application:

- **Wrapped clients**: `guard.openai(client)` and `guard.anthropic(client)` return the same client with its model calls governed
- **Checks on both sides**: the prompt before the model call, the reply after it. A block raises `WhiteoutBlockedError`
- **Streaming support**: streams are held until the reply passes (default), or passed through with periodic checks
- **Fail behaviour that follows your policy group**, read from Whiteout and cached
- **Employee identity**: forward the signed-in employee's ID token for apps using the employee's own policies
- **Quarantine**: when Prompt Injection Defense is on, poisoned tool results and system turns are replaced before the model sees them
- **Manual checks** for any other model client, a **LangChain** callback (Python), and **async** clients

| | Python | Node.js |
|--|--------|---------|
| Package | `whiteout-ai` (PyPI) | `@groovysec/whiteout-ai` (npm) |
| Version | 0.3 or later | 0.3 or later |
| Runtime | Python 3.9+ | Node 18+ |
| Governed clients | `openai` (chat completions, Responses API), `anthropic` (`messages.create`) | `openai` (chat completions, Responses API), `@anthropic-ai/sdk` (`messages.create`) |
| Async | `AsyncAppGuard` | Native promises |

## Prerequisites

Before you begin, ensure you have:
- A registered custom app with an **app key** for your environment (`wo_app_<environment>_…`). See [Register an App](./custom-ai-apps/setup-wizard.md)
- Your **Whiteout API URL**, shown in the wizard's snippets and on the app's **Setup** tab
- Outbound HTTPS from the app to that URL

---

## Installation

**Python**

```bash
pip install "whiteout-ai>=0.3"
```

**Node.js**

```bash
npm i @groovysec/whiteout-ai@^0.3
```

## Configuration

Set two environment variables, from your secrets manager:

```bash
export WHITEOUT_APP_KEY=wo_app_prod_xxxxxxxxxxxxxxxx
export WHITEOUT_BASE_URL=https://<your Whiteout API URL>
```

`AppGuard()` reads both. If `WHITEOUT_BASE_URL` isn't set, the SDK uses Whiteout's hosted API, `https://api.whiteout.groovysec.com`. You can also pass the key and URL to the constructor, but keep the key out of source code.

> **App keys only.** `AppGuard` accepts app keys (`wo_app_…`) and gateway keys (`wo_gw_…`). Passing an enrollment token (`whiteout_enroll_…`) raises a configuration error that points you to `WhiteoutGuard`.

---

## Quick Start

### Python

```python
from openai import OpenAI
from whiteout_ai import AppGuard, WhiteoutBlockedError

guard = AppGuard()                          # create once, at startup
client = guard.openai(OpenAI())             # or guard.anthropic(Anthropic())

try:
    reply = client.chat.completions.create(model="gpt-4o", messages=messages)
except WhiteoutBlockedError as e:
    # e.stage is "input" (the prompt) or "output" (the reply)
    reply = None                            # show your own policy message
```

### Node.js

```ts
import OpenAI from "openai";
import { AppGuard, WhiteoutBlockedError } from "@groovysec/whiteout-ai";

const guard = new AppGuard();                          // create once, at startup
const client = guard.openai(new OpenAI());             // or guard.anthropic(new Anthropic())

try {
  const reply = await client.chat.completions.create({ model: "gpt-4o", messages });
} catch (e) {
  if (!(e instanceof WhiteoutBlockedError)) throw e;   // e.stage is "input" or "output"
  // show your own policy message
}
```

The wrapped client is the same object, with only its model-call methods governed; everything else passes straight through. Create the guard and the wrapped client once and reuse them.

---

## What Happens on Each Call

1. The SDK extracts the messages, system prompt, model and provider from the call.
2. It calls `POST /v1/guard/input`. On `block`, it raises `WhiteoutBlockedError` with `stage="input"` and the model is **not** called.
3. If Prompt Injection Defense quarantined any system or tool turns, they are replaced with a short notice before the call. Your own message objects are never modified.
4. The model is called with your original arguments.
5. The SDK calls `POST /v1/guard/output` with the reply. On `block`, it raises `WhiteoutBlockedError` with `stage="output"` and the reply isn't returned.
6. On `allow` or `warn`, you get the provider's normal response.

The SDK never raises on `warn`.

### Handling a block

`WhiteoutBlockedError` carries:

| Python | Node.js | Description |
|--------|---------|-------------|
| `e.stage` | `e.stage` | `"input"` or `"output"` |
| `e.reason` | `e.reason` | Human-readable reason |
| `e.violated_policies` | `e.violatedPolicies` | Policies that matched |
| `e.rule` | `e.rule` | The model, provider or token rule that matched, if any |
| `e.evaluation_id` | `e.evaluationId` | Links to the call in the app's **Activity** tab |
| `e.failed_closed` | `e.failedClosed` | `True` when Whiteout couldn't decide and the fail-closed policy blocked the call |

Show the user a clear, non-technical message, and log `evaluation_id` so admins can find the call.

---

## Per-Call Options

Pass Whiteout options on a wrapped call with the `whiteout` argument. It's removed before the provider sees the request.

**Python**

```python
client.chat.completions.create(
    model="gpt-4o", messages=messages,
    whiteout={"end_user": user.id, "session_id": conversation_id},
)
```

**Node.js**

```ts
await client.chat.completions.create({
  model: "gpt-4o", messages,
  whiteout: { endUser: user.id, sessionId: conversationId },
} as any);
```

| Python key | Node key | Description |
|-----------|----------|-------------|
| `end_user` | `endUser` | An opaque ID for your end user. Stored only as a keyed hash |
| `user_token` | `userToken` | The employee's OpenID Connect ID token (see [Employee Policies](#employee-policies)) |
| `session_id` | `sessionId` | Your conversation ID |
| `scan` | `scan` | Which parts to check: `user`, `system`, `context`, `tool` |
| `context` | `context` | Retrieved documents to check |
| `metadata` | `metadata` | Free-form metadata |
| `app_ref` | `appRef` | Gateway keys only: which app the call belongs to |

Python raises a configuration error for unknown keys.

---

## Constructor Options

| Python | Node.js | Default | Description |
|--------|---------|---------|-------------|
| `app_key` | `appKey` | `WHITEOUT_APP_KEY` | The app key (or `WHITEOUT_GATEWAY_KEY`) |
| `base_url` | `baseUrl` | `WHITEOUT_BASE_URL`, else Whiteout's hosted API | Your Whiteout API URL |
| `timeout` | `timeoutMs` | 10 seconds / `10000` | Request timeout per Guard API call |
| `fail_open` | `failOpen` | Follow the policy group | Force fail-open (`True`) or fail-closed (`False`) |
| `block_output` | `blockOutput` | `True` | `False` makes reply checks fire-and-forget: replies are recorded but never blocked |
| `scan` | `scan` | `["user"]` | Default parts to check on every call |
| `stream_mode` | `streamMode` | `"buffered"` | `"buffered"` or `"passthrough"` (see [Streaming](#streaming)) |
| `check_every` | `checkEvery` | `2000` | Characters between checkpoints in passthrough mode |
| `enforce` | `enforce` | `True` | `False` = observe: every call is checked and recorded, nothing raises |
| `app_ref` | `appRef` | `WHITEOUT_APP_REF` | Gateway keys only: default app for every call |

---

## What Gets Scanned

By default the SDK checks the **latest user message**. For apps where sensitive data or instructions can arrive from other places, widen the scan:

```python
guard = AppGuard(scan=["user", "system", "context", "tool"])
```

- `system`: system and developer prompts
- `tool`: tool and function results in the conversation
- `context`: documents you pass as `context=` (for example, retrieved chunks in a RAG app)

The SDK normalises OpenAI messages (including the `developer` role and content parts), Anthropic messages (`system=` and `tool_result` blocks) and LangChain message objects.

---

## Checking Without a Wrapper

For any other model client, call the checks yourself.

**Python**

```python
d = guard.check_input(messages, context=retrieved_docs, model="my-model", provider="self-hosted")
reply = call_your_model(messages)
guard.check_output(d.evaluation_id, reply)        # raises WhiteoutBlockedError on block
```

**Node.js**

```ts
const d = await guard.checkInput({ messages, context: retrievedDocs, model: "my-model", provider: "self-hosted" });
const reply = await callYourModel(messages);
await guard.checkOutput(d.evaluationId, reply);   // throws WhiteoutBlockedError on block
```

Both return a decision object with `decision`, `violated_policies` / `violatedPolicies`, `reason`, `evaluation_id` / `evaluationId`, `fail_open` / `failOpen`, `mode`, `allowed`, and (when relevant) `user`, `identity`, `injection` and `quarantine`. Pass `raise_on_block=False` / `raiseOnBlock: false` to get the decision back instead of an exception.

---

## Streaming

`stream=True` / `stream: true` works for both providers.

| `stream_mode` | Behaviour | Use when |
|---------------|-----------|----------|
| `"buffered"` (default) | The whole reply is held until the output check passes, then yielded. Nothing flagged reaches the user | You enforce policy on replies |
| `"passthrough"` | Chunks are yielded as they arrive, with a check every `check_every` characters plus a final check. Iteration stops at the first flagged checkpoint (Node also aborts the upstream stream) | Latency matters more than stopping every flagged sentence |

> **Streamed text can't be recalled.** In passthrough mode, text the user has already seen stays on screen when a later checkpoint blocks. Use buffered mode wherever you enforce.

In Python, Anthropic's `messages.stream()` helper isn't governed by the wrapper; use `messages.create(stream=True)`. In Node, the wrapped `create` returns a plain `Promise`, so OpenAI's `.withResponse()` helper isn't available on it.

---

## Fail Behaviour

If Whiteout can't be reached, or rejects the key, the SDK applies a fail behaviour:

1. `fail_open` / `failOpen`, if you set it
2. Otherwise, your app's **policy group** fail behaviour, which the SDK reads from `GET /v1/guard/config` and caches for 5 minutes (retrying after 60 seconds if the read fails)
3. With no setting available yet, it **fails open**

Fail-open returns `allow` with `fail_open=True`; fail-closed raises `WhiteoutBlockedError` with `failed_closed=True`.

In an [audit-only organisation](./custom-ai-apps/policies-and-identity.md#audit-only-organisations), `GET /v1/guard/config` always serves fail-open, so step 2 never fails closed. Setting `fail_open=False` / `failOpen: false` in code still forces fail-closed during an outage.

A rejected key (revoked, expired, app archived) is logged at **ERROR** level: *app key rejected … coverage is NOT being applied*. Alert on this log line. A paused app is treated the same way as an outage.

---

## Audit-Only Organisations

If your organisation runs Whiteout in [audit-only mode](./governance/audit-only-mode.md), the SDK never raises `WhiteoutBlockedError` because of a Whiteout verdict: every decision is `allow`, `mode` is `monitor`, and nothing is quarantined. Every check except Prompt Injection Defense still runs, and what it would have done is recorded in the app's **Activity** tab. Prompt Injection Defense is off: nothing is scanned or quarantined. You don't need to change any code.

The decision object keeps `rule` (for a model, provider or token match) and `injection`, which reads `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}` if Injection Defense is switched on in your settings. The Guard API's top-level `enforced`, `would_action` and `suppressed_by` fields aren't copied onto the decision object; call the [Guard API](./custom-ai-apps/guard-api.md#audit-only-organisations) directly if your code needs them.

---

## Employee Policies

For apps set to **The employee's own policies** (see [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md#the-employees-own-policies)), pass the employee's OpenID Connect ID token from your app's sign-in session:

**Python**

```python
guard.check_input(messages, user_token=session["id_token"])
client.chat.completions.create(model="gpt-4o", messages=messages,
                               whiteout={"user_token": session["id_token"]})
```

**Node.js**

```ts
await guard.checkInput({ messages, userToken: session.idToken });
await client.chat.completions.create({ model: "gpt-4o", messages,
  whiteout: { userToken: session.idToken } } as any);
```

The decision's `user` field shows the verified employee; `identity` explains any fallback to the app's policy group.

---

## Prompt Injection Quarantine

When your organisation has Prompt Injection Defense on, a system prompt, tool result or context document carrying instructions aimed at the model can be quarantined:

- **Wrapped clients and auto-instrumentation** replace quarantined system and tool turns with a notice (*[Removed by Whiteout: this content contained instructions aimed at the AI assistant and was not passed to the model.]*). Tool calls stay paired with their results, so the provider still accepts the request.
- **Context documents** you pass as `context=` can't be rewritten inside your prompt, so drop them yourself:

**Python**

```python
d = guard.check_input(messages, context=docs, scan=["user", "context"])
docs = d.clean_context(docs)            # the documents Whiteout didn't quarantine
```

**Node.js**

```ts
import { cleanContext } from "@groovysec/whiteout-ai";
const d = await guard.checkInput({ messages, context: docs, scan: ["user", "context"] });
docs = cleanContext(docs, d);
```

---

## Async (Python)

`AsyncAppGuard` has the same interface for `asyncio` apps:

```python
from openai import AsyncOpenAI
from whiteout_ai import AsyncAppGuard

async with AsyncAppGuard() as guard:
    client = guard.openai(AsyncOpenAI())
    reply = await client.chat.completions.create(model="gpt-4o", messages=messages)
```

Use it as an async context manager so background reply checks finish before exit.

---

## LangChain (Python)

```bash
pip install "whiteout-ai[langchain]"
```

```python
from langchain_openai import ChatOpenAI
from whiteout_ai import AppGuard
from whiteout_ai.langchain import WhiteoutCallbackHandler

llm = ChatOpenAI(callbacks=[WhiteoutCallbackHandler(AppGuard())])
```

The prompt is checked when the model starts and the completion when it ends. A block raises `WhiteoutBlockedError` out of the chain. Streaming chains are checked when the completion finishes, so streamed tokens aren't retracted.

---

## Recording Without Blocking

Three ways to observe before you enforce:

- **Put the app in monitor mode** in its policy group. The SDK code doesn't change, and you can move to enforce later without a redeploy
- **`enforce=False`** (`enforce: false`): every call is checked and recorded, and nothing raises, whatever the policy says
- **`block_output=False`** (`blockOutput: false`): reply checks run in the background and never block. In Node, call `await guard.flush()` before a serverless handler returns so pending checks complete

To report calls after the fact, use `guard.send_events([...])` / `guard.sendEvents([...])`. Events are batched 100 per request, recorded, and never checked for content.

---

## Troubleshooting

### Calls Are Allowed When You Expected a Block

- Check the app's policy: with **No policy — monitor only** or a group in `monitor` mode, nothing is blocked (see [What gets checked](./custom-ai-apps/policies-and-identity.md#what-gets-checked-in-each-mode))
- Check whether your organisation is in [audit-only mode](./custom-ai-apps/policies-and-identity.md#audit-only-organisations). If it is, nothing is blocked and `decision.mode` is `monitor` on every call
- Check the logs for *app key rejected* or *Whiteout unreachable … failing open*
- Make sure the model call goes through the **wrapped** client, not the original one
- Widen `scan` if the sensitive data is in a system prompt, tool result or document

### `WhiteoutConfigError` at Startup

- *app_key is required*: set `WHITEOUT_APP_KEY`
- *app_key must be a Whiteout app key*: you passed an enrollment token or a truncated key
- *scan must be a non-empty subset…* or *stream_mode must be one of…*: fix the option value
- *unknown whiteout= options*: check the per-call option names

### `WhiteoutBlockedError` with `failed_closed=True`

Whiteout couldn't be reached and the policy group fails closed. Check connectivity to your Whiteout API URL, and whether the key was revoked or the app paused.

### Nothing Appears in the App's Activity Tab

- Confirm the key belongs to this app (its prefix is shown on the **Keys** tab)
- Confirm the app isn't **Paused** or archived
- Confirm the process can reach your Whiteout API URL

---

## Related Guides

- [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md): the same checks with no code changes
- [Guard API Reference](./custom-ai-apps/guard-api.md): the HTTP API the SDKs call
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md): what gets checked and what each decision means
