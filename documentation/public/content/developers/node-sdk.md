# Node.js SDK

The Whiteout AI Node.js SDK (`@groovysec/whiteout-ai`) adds policy enforcement, audit, and compliance to any AI workload in three lines of code. It ships with TypeScript types and works with the official OpenAI, Anthropic, AWS Bedrock, and Google SDKs.

## Overview

The SDK gives your application:
- Pre-call policy evaluation of prompts before they reach an AI provider
- Automatic extraction of prompt, provider, and model from wrapped SDK calls
- Output governance — responses are scanned asynchronously after the call returns
- Fail-open behavior by default, so a Whiteout outage never breaks your application
- Registration with your Whiteout backend, so SDK-governed workloads appear on the Infrastructure page

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18 or later** — the SDK uses native `fetch` and `AbortController`
- **Whiteout AI Admin** access, to mint an enrollment token
- Your organization's **Whiteout API URL**

---

## Installation

```sh
npm install @groovysec/whiteout-ai
```

## Getting an Enrollment Token

1. Log in to the Whiteout AI admin console as an administrator
2. Mint a new enrollment token for SDK use
3. Store it securely — the examples below read it from the `WHITEOUT_TOKEN` environment variable

---

## Quick Start (TypeScript)

```ts
import { WhiteoutGuard, WhiteoutBlockedError } from "@groovysec/whiteout-ai";
import OpenAI from "openai";

const guard = new WhiteoutGuard({
  token: process.env.WHITEOUT_TOKEN!,             // minted in the Whiteout admin console
  backendUrl: process.env.WHITEOUT_BACKEND_URL!,  // e.g. https://your-org.api.whiteout.groovysec.com
});

const openai = new OpenAI();

try {
  const response = await guard.wrap(
    openai.chat.completions.create.bind(openai.chat.completions),
    {
      model: "gpt-4o",
      messages: [{ role: "user", content: userPrompt }],
    },
  );
  console.log(response.choices[0].message.content);
} catch (err) {
  if (err instanceof WhiteoutBlockedError) {
    console.error("Blocked by policy:", err.reason);
  } else {
    throw err;
  }
}
```

Note the `.bind()` call — when wrapping a method on an SDK client, bind it to its owner object so `this` resolves correctly inside the provider SDK.

---

## Three Integration Patterns

### Pattern 1: Evaluate a Prompt Manually

Call `evaluate()` to check a prompt against your policies before sending it anywhere:

```ts
const result = await guard.evaluate({
  prompt: "Summarize this patient record …",
  aiProvider: "openai",
  model: "gpt-4o",
});
// { decision: "allow" | "block" | "warn", reason?, violatedPolicies? }
```

Use this pattern when you want full control over what happens on a `block` or `warn` decision.

### Pattern 2: Wrap an SDK Call

`guard.wrap(fn, ...args)` extracts the prompt, provider, and model from the call arguments, evaluates the prompt pre-call, runs the call if allowed, and asynchronously scans the response for output governance.

Supported call shapes today:

| Provider | Call Shape |
|----------|-----------|
| **OpenAI** | `chat.completions.create({ model, messages })` |
| **Anthropic** | `messages.create({ model, system, messages })` |
| **AWS Bedrock** | `InvokeModel({ modelId, body })` — Anthropic, Titan, and Cohere body shapes |
| **Google** | `generateContent({ contents })` |

For call shapes outside this list, fall back to Pattern 1 and evaluate the prompt manually.

### Pattern 3: Catch Blocks

`WhiteoutBlockedError` is thrown from both `evaluate()` and `wrap()` when the backend returns `decision: "block"`. It carries `reason`, `violatedPolicies`, and `rule`:

```ts
try {
  await guard.evaluate({ prompt, aiProvider: "openai", model: "gpt-4o" });
} catch (err) {
  if (err instanceof WhiteoutBlockedError) {
    console.error(err.reason, err.violatedPolicies, err.rule);
  } else {
    throw err;
  }
}
```

---

## Configuration Reference

Pass these options to the `WhiteoutGuard` constructor:

| Option | Default | Notes |
|--------|---------|-------|
| `token` | required | Enrollment token minted in the Whiteout AI admin console |
| `backendUrl` | required | `https://…` (no trailing slash needed) |
| `agentName` | `sdk-<pid>` | Display name shown on the Infrastructure page |
| `resourceId` | `sdk-<pid>` | EC2 instance id, Kubernetes pod name, etc. |
| `resourceType` | `vm` | One of `vm`, `pod`, `lambda`, `ecs_task` |
| `mode` | `sdk` | Reported to the backend; informational |
| `timeoutMs` | `10000` | Per-request timeout to the backend, in milliseconds |
| `failOpen` | `true` | If the backend is unreachable, allow calls through |
| `register` | `true` | Set `false` to defer registration with the backend |

Setting `agentName` and `resourceId` to meaningful values (service name, instance id) makes governed workloads easier to identify in the Whiteout AI console.

---

## Fail-Open Behavior

The default is **fail open**: if the Whiteout backend is unreachable at startup or during evaluation, calls are allowed through, so a Whiteout outage never breaks your AI application.

Set `failOpen: false` to fail closed — AI calls will fail rather than proceed ungoverned when the backend cannot be reached. This is appropriate for high-compliance workloads where an unevaluated prompt is unacceptable.

---

## Streaming: Current Limitation

Streaming responses (for example, `openai.chat.completions.create({ stream: true })`) are **not yet wrapped end-to-end**. When you wrap a streaming call:

- `evaluate()` still runs pre-call, so prompt governance is fully enforced
- The streaming chunks are **not** scanned — output governance does not run automatically on streamed responses

If response governance is required for a streaming call, accumulate the streamed output and call `evaluateResponse()` manually after the stream completes. Full end-to-end streaming support is planned.

---

## Troubleshooting

### Calls Are Allowed When You Expected a Block

- The SDK fails open by default — verify the application host can reach your `backendUrl`
- Confirm the relevant policy is enabled in the Whiteout AI admin console
- Confirm the call goes through `guard.wrap()` or `guard.evaluate()` rather than the provider SDK directly

### `TypeError` or Context Errors When Wrapping

- Bind SDK methods before passing them to `wrap()`: `openai.chat.completions.create.bind(openai.chat.completions)`

### Workload Not Appearing on the Infrastructure Page

- Check that `register` has not been set to `false`
- Verify the enrollment token is valid and the backend is reachable at startup

### Native `fetch` Errors

- Confirm you are running Node 18 or later; earlier versions lack the native `fetch` and `AbortController` the SDK depends on

---

## License

The SDK is released under the **Apache-2.0** license.

## Related Guides

- **Python SDK** — the same guard pattern for Python applications
- **AWS Lambda Layer** — Whiteout governance for Lambda functions (Python today; a Node layer follows the Node SDK)
