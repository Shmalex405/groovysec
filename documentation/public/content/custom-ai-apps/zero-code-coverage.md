# Zero-Code Coverage

You don't have to change an app's code to govern it. This guide covers the three ways to cover a custom app with configuration alone:

| Path | What changes | Blocks | Covers |
|------|--------------|--------|--------|
| [Auto-instrumentation](#auto-instrumentation) | One environment variable and a launcher (or a preload flag) | Yes | Python and Node services using OpenAI, Anthropic or (Python) AWS Bedrock clients |
| [Kubernetes webhook](#kubernetes-webhook) | A namespace label and a pod annotation | Yes | Every opted-in Python or Node pod in a cluster |
| [OpenTelemetry](#opentelemetry-visibility-only) | Exporter settings | No, visibility only | Any app already emitting OpenTelemetry GenAI traces |

A fourth zero-code option, adding Whiteout to the LLM gateway your apps already use, is covered in [Gateways](./custom-ai-apps/gateways.md).

## Prerequisites

Before you begin, ensure you have:
- A registered custom app (see [Register an App](./custom-ai-apps/setup-wizard.md)) with an **app key** for the environment
- Your **Whiteout API URL**, shown on the app's **Setup** tab
- Outbound HTTPS from the service to that URL

---

## Auto-Instrumentation

Auto-instrumentation runs the same checks as the [SDK](./custom-ai-apps/sdk-integration.md), without any change to your code. The Whiteout package patches the supported AI client libraries when your app imports them: each prompt is checked before it reaches the model, and each reply before it reaches the user.

In the wizard this is the **Auto-instrument (no code)** method. On the app's **Setup** tab it's the **Auto-instrument (no code)** card.

### Python

**1. Install the package** in the service's environment (image or virtualenv):

```bash
pip install "whiteout-ai[auto]>=0.3"
```

**2. Set the key and URL**:

```bash
export WHITEOUT_APP_KEY=wo_app_prod_xxxxxxxxxxxxxxxx
export WHITEOUT_BASE_URL=https://<your Whiteout API URL>
```

**3. Start the service through the launcher**. Your code doesn't change:

```bash
whiteout-ai run python app.py
whiteout-ai run -- gunicorn app:server -w 4       # or uvicorn, celery, ...
```

**In containers where you can't change the start command**, put the bootstrap on `PYTHONPATH` instead. It runs any `sitecustomize` you already have:

```bash
export PYTHONPATH="$(whiteout-ai bootstrap-path)"
```

**4. Check the setup**:

```bash
whiteout-ai check
```

This prints whether `WHITEOUT_APP_KEY` holds an app key, the mode, whether `WHITEOUT_DISABLE` is set, and which supported clients are installed:

```
WHITEOUT_APP_KEY   set (wo_app_prod_xx…)
WHITEOUT_MODE      enforce
openai             installed — will be governed
anthropic          not installed
bedrock (boto3)    installed — will be governed
```

You can also turn auto-instrumentation on from inside the process: `import whiteout_ai.auto; whiteout_ai.auto.instrument()`.

**What's governed in Python:**

| Library | Calls |
|---------|-------|
| `openai` | Chat completions and the Responses API, sync and async |
| `anthropic` | `messages.create`, sync and async. The `messages.stream()` helper is checked on input, and its final text is recorded (it can't be blocked mid-stream) |
| `boto3` `bedrock-runtime` | Converse and InvokeModel (prompt and reply), and their streaming variants (prompt) |

A library is patched only when your app imports it, so there's no start-up cost for clients you don't use. Clients you've already wrapped with `AppGuard` by hand aren't checked twice.

### Node.js

**1. Install the package**:

```bash
npm i @groovysec/whiteout-ai@^0.3
```

**2. Preload the register hook** when starting the service. Your code doesn't change:

```bash
export WHITEOUT_APP_KEY=wo_app_prod_xxxxxxxxxxxxxxxx
export WHITEOUT_BASE_URL=https://<your Whiteout API URL>
NODE_OPTIONS="--import @groovysec/whiteout-ai/register" node server.js
```

On start-up the service logs *[Whiteout] auto-instrumentation armed for openai, anthropic*. If it can't start, it logs an error and the service runs ungoverned; it never stops your service from starting.

**What's governed in Node.js** (ESM and CommonJS apps, Node 18.19 or later):

| Library | Calls |
|---------|-------|
| `openai` | Chat completions and the Responses API |
| `@anthropic-ai/sdk` | `messages.create`. The `messages.stream()` helper isn't covered; use `create({ stream: true })` |

Governed calls return a plain `Promise`, so OpenAI's `.withResponse()` helper isn't available on them. AWS Bedrock isn't auto-instrumented in Node.js.

### Environment variables

| Variable | Values | Default |
|----------|--------|---------|
| `WHITEOUT_APP_KEY` | The app key. Without it nothing is patched and a warning is logged | Required |
| `WHITEOUT_BASE_URL` | Your Whiteout API URL | Whiteout's hosted API |
| `WHITEOUT_MODE` | `enforce`, or `observe` to check and record every call without ever raising | `enforce` |
| `WHITEOUT_STREAM_MODE` | `buffered` or `passthrough` (see [Streaming](./custom-ai-apps/sdk-integration.md#streaming)) | `buffered` |
| `WHITEOUT_SCAN` | Comma list of `user`, `system`, `context`, `tool` | `user` |
| `WHITEOUT_INCLUDE` | Comma list of clients to patch: `openai`, `anthropic`, `bedrock` (Python only) | All |
| `WHITEOUT_EXCLUDE` | Comma list of clients to leave alone | None |
| `WHITEOUT_DISABLE` | `1` switches auto-instrumentation off completely, with no patching | Off |

> **Two different "monitor" switches.** `WHITEOUT_MODE=observe` is set on the service and stops the client from raising, whatever the policy says. The **policy group's mode** (monitor, warn, enforce) is set by admins in Whiteout and decides the verdict itself. To trial an app safely, keep `WHITEOUT_MODE=enforce` and put the app's policy group in `monitor`; you can then move to `enforce` from the console without touching the service.

### How blocks appear

A blocked call raises `WhiteoutBlockedError` (Python and Node) from the model call, with `stage` set to `input` or `output` and the reason in the message. Your existing error handling around the model call catches it. To show users a friendly message, catch `WhiteoutBlockedError` specifically (see [Handling a block](./custom-ai-apps/sdk-integration.md#handling-a-block)).

If Whiteout can't be reached, the app's policy group fail behaviour applies (see [Fail Behaviour](./custom-ai-apps/policies-and-identity.md#fail-behaviour)).

### Limits

- Only the clients listed above are governed. Calls made with a raw HTTP client (`requests`, `httpx`, `fetch`) to a model API aren't seen. If you declared the app's model host, the AI Footprint still flags that traffic and marks the app **Degraded**
- Apps that vendor or fork the client libraries need the [SDK](./custom-ai-apps/sdk-integration.md) instead
- Employee identity can't be forwarded automatically. For apps using the employee's own policies, use the SDK's `user_token` option

---

## Kubernetes Webhook

The Whiteout **admission webhook** turns on auto-instrumentation for every opted-in pod in a cluster, with no change to images or code. It works like the OpenTelemetry Operator: when an opted-in pod is created, the webhook adds an init container that copies the Whiteout instrumentation into a shared volume, and sets the environment variables that enable it.

The app's **Setup** tab shows a ready-made snippet on the **Kubernetes (no image changes)** card.

### Before you start

- **cert-manager** installed in the cluster (it issues the webhook's serving certificate)
- The **webhook manifest** (`admission-webhook.yaml`) and access to the webhook and instrumentation images. These are provided by Groovy Security: send a [coverage request](./custom-ai-apps/monitoring-and-troubleshooting.md#coverage-requests) if you don't have them. You can mirror the images to your own registry
- An **app key** (or a [gateway key](./custom-ai-apps/gateways.md)) for the workloads

### Install once per cluster

```bash
kubectl apply -f admission-webhook.yaml
```

The manifest runs the webhook in the `whiteout-system` namespace. Set `WHITEOUT_BASE_URL` in it to your Whiteout API URL.

### Opt in a namespace

```bash
# The key, in the same namespace as the pods
kubectl -n <namespace> create secret generic whiteout-app-key --from-literal=key=$WHITEOUT_APP_KEY

# Opt the namespace in
kubectl label namespace <namespace> whiteout.groovysec.com/inject=enabled
```

To opt in a single workload instead of a whole namespace, label its pod template `whiteout.groovysec.com/inject: "true"`.

### Annotate the Deployment

On the pod template of each Deployment:

```yaml
spec:
  template:
    metadata:
      annotations:
        whiteout.groovysec.com/app: support-assistant      # the app's slug
        whiteout.groovysec.com/language: python            # or node, or python,node
```

Then restart it so new pods are created:

```bash
kubectl -n <namespace> rollout restart deploy/<deployment>
```

| Annotation | Description | Default |
|------------|-------------|---------|
| `whiteout.groovysec.com/app` | App name for attribution | The pod's `app.kubernetes.io/name` or `app` label, else the pod name prefix |
| `whiteout.groovysec.com/language` | `python`, `node` or `python,node` | `python` |
| `whiteout.groovysec.com/key-secret` | Secret holding the app or gateway key | `whiteout-app-key` |
| `whiteout.groovysec.com/inject` | `"false"` opts a pod out of a labelled namespace | |

**Which app the calls count against:**

- With an **app key** in the Secret, every pod using that Secret reports as that app. Use one Secret per app (with `key-secret`) if a namespace runs several apps
- With a **gateway key**, the `app` annotation names the app, and names Whiteout hasn't seen before appear as **Discovered** apps (see [Gateways](./custom-ai-apps/gateways.md#discovered-apps))

> **The webhook never blocks a pod.** It is registered to be ignored on failure, and any error leaves the pod unchanged. If the key Secret is missing, the pod starts without a key and isn't governed. Check each app's status after rollout.

---

## OpenTelemetry (Visibility Only)

If an app is already instrumented with OpenTelemetry's **GenAI semantic conventions**, for example with OpenLLMetry or OpenInference, add Whiteout as a traces exporter. Every model call the instrumentation sees is recorded against the app.

In the wizard this is the **OpenTelemetry (visibility only)** method.

> **Visibility only.** OpenTelemetry reports calls after they've happened, so Whiteout can't block or change them. Content is checked in **record mode**: violations are recorded as flagged calls. Use auto-instrumentation, the SDK or a gateway to enforce.

### Configure the exporter

```bash
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://<your Whiteout API URL>/v1/otlp/traces
export OTEL_EXPORTER_OTLP_TRACES_HEADERS="Authorization=Bearer wo_app_prod_xxxxxxxxxxxxxxxx"

# Prompt and reply text is only sent if your instrumentation captures it, for example:
export OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true
```

If you already export traces elsewhere, add Whiteout as a second exporter in your OpenTelemetry Collector rather than replacing your existing destination.

### What Whiteout reads

- **Transport**: OTLP over HTTP, protobuf or JSON, optionally gzip-compressed
- **Spans**: only GenAI spans (spans with `gen_ai.*` or `llm.*` attributes). Other spans are ignored
- **Per call**: provider, model, input and output token counts, and timing
- **Content**, when present: prompts and replies from `gen_ai.input.messages` / `gen_ai.output.messages`, OpenLLMetry's `gen_ai.prompt.*` / `gen_ai.completion.*` attributes, or GenAI span events

Each GenAI span becomes a call in the app's **Activity** tab, labelled **OpenTelemetry**. When content is present, the policy group's data capture allows it, and a policy group is set, Whiteout checks the latest prompt against the group's content policies and records any violation. Prompt Injection Defense, if on, scans the messages in record mode too.

### Limits

| Limit | Value |
|-------|-------|
| Export request size | 5 MB |
| Spans per export request | 1,000 (extras are reported back to the exporter as rejected) |
| Content checks per export request | 10 (further calls in the same request are recorded without a content check) |
| Requests | 240 per minute per key |

The exporter's key needs the `guard:events` scope, which every app key created in the console has. With a gateway key, each resource's `service.name` names the app, and new names appear as **Discovered** apps.

---

## Troubleshooting

### The Method Stays "Pending"

- **Python**: run `whiteout-ai check` in the same environment as the service. Confirm the key is set and the client library is listed as *will be governed*
- **Node**: look for *auto-instrumentation armed* in the start-up log. If it's missing, check `NODE_OPTIONS` reaches the process (some process managers drop it) and that Node is 18.19 or later
- **Kubernetes**: check the pod has the `whiteout-autoinstrument-*` init container and the `WHITEOUT_APP_KEY` variable. If not, check the namespace label or pod label, and that the webhook is running
- **OpenTelemetry**: check the endpoint path ends in `/v1/otlp/traces` and the `Authorization` header is set. Check your instrumentation emits GenAI spans

### Calls Are Recorded but Never Blocked

- `WHITEOUT_MODE=observe` is set on the service, or the app's policy group is in `monitor` mode
- The method is OpenTelemetry, which never blocks
- Your organisation is in [audit-only mode](./custom-ai-apps/policies-and-identity.md#audit-only-organisations), where no call is blocked. What would have been blocked is shown as **Flagged** in the app's **Activity** tab

### The Service Logs "WHITEOUT_APP_KEY is not set"

The key didn't reach the process. Nothing is governed until it does. In Kubernetes, check the Secret exists in the pod's namespace with the key name `key`.

### Some Calls Are Missing

Only the supported clients are governed. A second code path calling the model with a raw HTTP client isn't seen. Declare the model host on the app so the AI Footprint can flag that traffic.

---

## Related Guides

- [SDK Integration](./custom-ai-apps/sdk-integration.md): the same checks, with full control in code
- [Gateways](./custom-ai-apps/gateways.md): one configuration for every app behind an LLM gateway
- [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md): checking coverage health after rollout
