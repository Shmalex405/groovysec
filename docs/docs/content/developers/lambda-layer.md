# AWS Lambda Layer

The Whiteout AI Lambda layer adds governance to any Python Lambda function with zero code changes beyond one import. It packages the Whiteout AI Python SDK, a pre-configured guard built from environment variables, and a cold-start warmer — so functions get policy enforcement without bundling dependencies or writing setup code.

## Overview

Lambda has no place for a long-running sidecar — there is no daemon, no service manager, and invocations may run on cold containers that disappear seconds later. The SDK pattern works perfectly *inside* a Lambda, but bundling the SDK into every function adds packaging friction.

The layer solves this. It is a published `python/` directory of pre-installed dependencies that you attach to any Lambda function. It carries:

- The `whiteout-ai` Python SDK
- `whiteout_ai_lambda` — a thin shim that builds a ready-to-use `WhiteoutGuard` from environment variables
- `sitecustomize.py` — runs at interpreter startup to warm the guard, eliminating first-call registration latency

## Prerequisites

Before you begin, ensure you have:
- A **Python 3.11 or 3.12** Lambda function making AI API calls
- **Whiteout AI Admin** access, to mint an enrollment token
- Your organization's **Whiteout API URL**
- The **Whiteout AI layer ARN** for your AWS region (or the layer zip, if you publish it into your own account — see below)

---

## Setup Process

### Step 1: Attach the Layer

Attach the published Whiteout AI layer ARN for your region to the Lambda function — via the AWS console, `aws lambda update-function-configuration --layers`, or your IaC tool (SAM, CDK, Terraform).

### Step 2: Set Environment Variables

The layer configures itself entirely from the Lambda runtime's environment variables — no code-level configuration is needed:

| Variable | Required | Description |
|----------|----------|-------------|
| `WHITEOUT_TOKEN` | Yes | Enrollment token minted in the Whiteout AI admin console |
| `WHITEOUT_BACKEND_URL` | Yes | Your organization's Whiteout API URL |
| `WHITEOUT_FAIL_OPEN` | No | Set to `false` to fail closed; default is fail open |

Store the token using your standard practice for Lambda secrets (for example, encrypted environment variables or a secrets manager lookup that populates the variable at deploy time).

### Step 3: Import and Use

In your handler, import the pre-built guard from the shim and wrap your AI calls:

```python
from whiteout_ai_lambda import guard
from whiteout_ai import WhiteoutBlockedError

def handler(event, context):
    try:
        response = guard.wrap(
            openai.chat.completions.create,
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": event["prompt"]}],
        )
    except WhiteoutBlockedError as e:
        return {"statusCode": 403, "body": f"Blocked by policy: {e.reason}"}
    ...
```

The guard is already constructed and registered — you never call `WhiteoutGuard(...)` yourself. All the SDK patterns (`evaluate()`, `wrap()`, `WhiteoutBlockedError`) work exactly as described in the Python SDK guide.

---

## Cold Starts and `sitecustomize.py`

Registration with the Whiteout backend costs one HTTPS round-trip (to `/infra-agent/register`) at first initialization.

Without the layer's warmer, that cost would land on your handler's first `wrap()` or `evaluate()` call. The layer avoids this: `sitecustomize.py` runs at Python interpreter startup — during Lambda's init phase, before your handler is invoked — and warms the guard then. Your handler's first call does not pay the registration latency.

On a typical provisioned-concurrency setup, the cost is amortized to zero: initialization happens in pre-warmed environments, so invocations never see it.

---

## Fail-Open Semantics

The layer defaults to **fail open**: if the Whiteout backend is unreachable, AI calls go through. A Whiteout outage will never break your Lambda.

Set `WHITEOUT_FAIL_OPEN=false` to fail closed for high-compliance workloads where an unevaluated prompt is unacceptable.

---

## When to Use the Layer vs the Plain SDK

| Situation | Recommendation |
|-----------|----------------|
| Python Lambda functions | **Layer** — zero packaging changes, env-var-only configuration, cold-start warming built in |
| Many Lambda functions across a team | **Layer** — attach one ARN per function; no per-function dependency management |
| You already vendor all dependencies into each function and want programmatic control of guard construction | **Plain SDK** — `pip install whiteout-ai` into your bundle and build the `WhiteoutGuard` yourself |
| Long-running services (EC2, ECS, Kubernetes) | **Plain SDK** — no layer mechanism applies; construct the guard at process startup |
| AWS App Runner / ECS Fargate | **Plain SDK** — install at container build time, set the same env vars at deploy |
| Google Cloud Run / Cloud Functions, Azure Functions | **Plain SDK** — pip-install the SDK, same env-var pattern |

In short: the layer is the Lambda-native packaging of the same SDK. Use it whenever the function runs on a supported Lambda runtime; use the plain SDK everywhere else.

## Runtime Coverage

| Lambda runtime | Status |
|---|---|
| Python 3.11, 3.12 | Supported via this layer |
| Node 18, 20 | Pending — the Node SDK ships first, then a similar Node layer |
| Other runtimes | Not yet supported |

---

## Building and Publishing the Layer Yourself

If your organization publishes the layer into its own AWS account (for example, to meet artifact-provenance requirements), you can build it from the SDK source:

```sh
./build.sh                   # outputs dist/whiteout-ai-lambda-layer.zip
```

Building requires Python 3.11+ and `zip`. Then publish per region:

```sh
aws lambda publish-layer-version \
  --layer-name whiteout-ai \
  --compatible-runtimes python3.11 python3.12 \
  --zip-file fileb://dist/whiteout-ai-lambda-layer.zip
```

A working SAM template and example handler are included alongside the layer source in the `example/` directory.

---

## Troubleshooting

### `ModuleNotFoundError: whiteout_ai_lambda`

- Confirm the layer is attached to the function and the deployment has completed
- Verify the function runtime is Python 3.11 or 3.12

### Calls Are Allowed When You Expected a Block

- The layer fails open by default — verify the Lambda can reach `WHITEOUT_BACKEND_URL` (check VPC egress, NAT, and security groups if the function runs in a VPC)
- Confirm `WHITEOUT_TOKEN` and `WHITEOUT_BACKEND_URL` are set on the function

### Elevated First-Invocation Latency

- One registration round-trip occurs during interpreter startup on cold containers; with provisioned concurrency this is fully amortized
- If cold-start latency matters for your workload, enable provisioned concurrency on the function

---

## Related Guides

- **Python SDK** — full `WhiteoutGuard` usage, configuration reference, and fail-open semantics
- **Node.js SDK** — governance for Node applications (a Node Lambda layer is planned)
