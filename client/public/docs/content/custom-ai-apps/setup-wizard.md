# Register an App

This guide walks through the **Register a custom AI app** wizard: every step, field and button, and what happens behind each one. At the end you'll have a registered app, a coverage method, a key (for key-based methods), and confirmation that Whiteout is receiving the app's calls.

The wizard takes five steps: **Describe**, **Policy**, **Coverage method**, **Connect** and **Verify**.

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI admin** access (read-only users can step through the wizard but can't register an app)
- The app's **name**, the **environments** it runs in, and the **model host** it calls, if you know it
- For an internal web chat, the **web address** staff use (it must start with `https://`)
- Optionally, a **resource policy group** under **Infrastructure** (see [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md#resource-policy-groups))
- A way to hand the key and snippet to the app's developers securely, such as your secrets manager

---

## Starting the Wizard

You can open the wizard from three places:

- **Coverage → Custom AI Apps → Register an app**
- **Integrations → Custom AI Apps card → Register an app**
- **Coverage → AI Footprint**, from an unrecognised finding (**Register as custom app** in the finding drawer) or from an internal model host in the egress list (**Register app**)

When you start from the AI Footprint, the wizard opens with an information banner, **Pre-filled from the AI Footprint**, and fills in the app name and the model host, process or app bundle Whiteout observed. Once the app is registered, Whiteout recognises that traffic as this app and flags calls that skip coverage.

---

## Step 1: Describe

Tell Whiteout what the app is.

| Field | Required | Description |
|-------|----------|-------------|
| **App name** | Yes | A name admins will recognise, for example `Support Assistant`. Up to 200 characters |
| **Owner** | No | A user in your organisation responsible for the app. Choose **No owner yet** to leave it blank |
| **What does it do?** | No | A short description, up to 4,000 characters |
| **What kind of app is it?** | Yes | One of six cards (below). The choice drives which coverage methods are recommended in step 3 |
| **Environments** | Yes | One or more environment names, for example `prod`, `staging`. Type a name and press **Enter** or click **Add**. Names are lower-cased and may contain letters, digits and dashes (up to 32 characters). Each environment gets its own keys |
| **Web addresses** | Only for **Internal web chat** | Where staff use the chat, for example `https://chat.corp.example.com/*`. Must start with `https://` and be at most 300 characters |
| **Model endpoints (optional)** | No | Hosts the app sends prompts to, for example `llm.internal.example.com` or `api.openai.com`. Paste a URL and Whiteout keeps just the host. Used to spot traffic that skips Whiteout |

The six app types:

| Card | Use it for |
|------|-----------|
| **Server app / API** | A backend service that calls an LLM (OpenAI, Anthropic, a self-hosted model…) |
| **Agent or workflow** | An agent or automation that plans, calls tools and talks to a model |
| **Internal web chat** | A chat UI your staff use in the browser, for example `chat.yourcompany.com` |
| **App on AWS Bedrock** | An application that calls AWS Bedrock models directly |
| **Desktop app** | An installed desktop or Electron app |
| **Something else** | Anything else. Tell Groovy Security about it and they'll help you cover it |

Click **Continue** when the name, at least one environment and (for a web chat) at least one web address are filled in.

> **Web address rules.** Whiteout rejects web addresses that would widen or shadow built-in coverage: public AI services Whiteout already covers (such as `chatgpt.com`), their parent domains (such as `openai.com`), and bare public suffixes. Use your own domain.

> **Public provider hosts.** You can list a public provider such as `api.openai.com` as a model endpoint, but Whiteout can't tell your app's calls to it apart from any other workload's, so it doesn't use that host for bypass detection. Internal hosts, single-label service names (such as `llm-server`) and IP addresses are tracked.

---

## Step 2: Policy

**Which policy should apply?** Custom apps use your infrastructure **resource policy groups**, which set the mode (monitor, warn, enforce), data capture and fail behaviour.

Choose one:

- **No policy yet — monitor only.** Calls are logged (metadata only) and never blocked. A good way to start.
- **An existing policy group.** Each group is listed with its mode (**monitor**, **warn** or **enforce**), description, data capture setting and fail behaviour (for example *data capture: metadata_only · fails open*).

To create or change a group, click **Create or edit policy groups in Infrastructure →**. You can change the app's policy group, or switch the app to the employee's own policies, at any time from the app's **Policy & identity** tab. See [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md).

Click **Continue**.

---

## Step 3: Coverage Method

**How should Whiteout cover it?** Pick the method that fits how the app is built. You can add more methods later from the app's **Setup** tab.

Each method appears as a card showing its name, a one-line description and what it can do (**Blocks prompts**, **· blocks replies**, or **Monitor only**). The first method recommended for your app type carries a **Recommended** badge, and recommended methods are listed first.

| Card | What the wizard gives you next | Guide |
|------|-------------------------------|-------|
| **Guard API** | An app key, plus Python, Node.js and curl snippets | [Guard API Reference](./custom-ai-apps/guard-api.md) |
| **Python / Node SDK** | An app key, plus SDK snippets | [SDK Integration](./custom-ai-apps/sdk-integration.md) |
| **Auto-instrument (no code)** | An app key, plus the launcher commands | [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md#auto-instrumentation) |
| **OpenTelemetry (visibility only)** | An app key, plus exporter settings | [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md#opentelemetry-visibility-only) |
| **Infrastructure agent** | A Kubernetes sidecar snippet | [Browser, Bedrock and Infrastructure Coverage](./custom-ai-apps/browser-bedrock-infrastructure.md#infrastructure-agent) |
| **Bedrock Guardrail** | Your published guardrail and a Converse snippet | [Browser, Bedrock and Infrastructure Coverage](./custom-ai-apps/browser-bedrock-infrastructure.md#bedrock-guardrail) |
| **Browser extension** | Rollout steps and optional selector hints | [Browser, Bedrock and Infrastructure Coverage](./custom-ai-apps/browser-bedrock-infrastructure.md#browser-extension) |

Recommended methods by app type:

| App type | Recommended, in order |
|----------|----------------------|
| Server app / API, Agent or workflow, Something else | Guard API, Auto-instrument, SDK, OpenTelemetry, Infrastructure agent |
| Internal web chat | Browser extension, Guard API |
| App on AWS Bedrock | Bedrock Guardrail, Guard API, Auto-instrument, SDK |
| Desktop app | None: send a request |

Gateways don't appear here, because a gateway is set up once and covers many apps. See [Gateways](./custom-ai-apps/gateways.md).

Below the cards, an information banner offers **Request from Groovy**. For desktop apps and internal web chats it reads *Desktop apps and internal web chats need a small piece of client work from us. Send a request and we'll set it up.* Clicking it opens the request dialog pre-filled with the app's name, type, description, web addresses and model endpoints (see [Coverage requests](./custom-ai-apps/monitoring-and-troubleshooting.md#coverage-requests)).

When you're ready, click the button at the bottom right:

- **Register and create key** for Guard API, SDK, Auto-instrument and OpenTelemetry. Whiteout registers the app, adds the method, and creates the app's first key for the **first environment** you listed in step 1.
- **Register app** for the infrastructure agent, Bedrock Guardrail and browser extension, which don't use an app key.

Registering the app is recorded in the admin **Audit Log** (*Registered custom AI app*, *Set up … for …*, *Created … key*).

---

## Step 4: Connect

This step shows what the app's developers need.

### Key-based methods

For Guard API, SDK, Auto-instrument and OpenTelemetry, a highlighted panel shows the new key:

> **Your prod app key — copy it now. It won't be shown again.**

Click **Copy** and store the key as a secret, for example in an environment variable called `WHITEOUT_APP_KEY` in your secrets manager. The key can only evaluate and log calls for this app.

Below the key is a snippet card for the method you chose, with tabs for **Python**, **Node.js** and (for the Guard API) **curl**, and a copy button. The snippets are pre-filled with the new key and your Whiteout API URL, so developers can paste them as they are.

- **Call the Guard API from your app**: check each prompt before it reaches the model, and each reply before it reaches the user. Every response includes `mode` and `fail_open`.
- **Wrap your model client** (SDK): prompts, replies and streams are checked for you. Streams are held until the reply is checked.
- **Start your service with Whiteout** (auto-instrument): no code changes. Blocked calls raise an error with a Whiteout message; `WHITEOUT_MODE=observe` records without blocking; `WHITEOUT_DISABLE=1` switches it off.
- **Export traces to Whiteout** (OpenTelemetry): every model call your instrumentation sees is recorded against this app, and content is checked in record mode. Nothing is blocked.

Each card also states the policy group's fail behaviour (for example *fails open*), which applies if Whiteout is unreachable.

When you've stored the key, click **I've copied the key — continue**. You can't go back from this step, because the key would be lost.

> **Lost the key?** Mint another one from the app's **Keys** tab. Each environment can have two active keys at once; revoke the one you lost.

### Methods without a key

- **Infrastructure agent**: a sidecar snippet bound to the app, plus **Enrollment tokens** and **Request image access** buttons.
- **Bedrock Guardrail**: a guardrail picker, the guardrail's ID, version and region, a Converse snippet, and a field for the IAM roles the app runs as.
- **Browser extension**: the covered pages, the rollout steps for staff, and optional selector hints.

These are described in [Browser, Bedrock and Infrastructure Coverage](./custom-ai-apps/browser-bedrock-infrastructure.md). Click **Continue**.

---

## Step 5: Verify

**Confirm it works.**

### Key-based methods

1. Click **Send test prompt**. The wizard sends a real Guard API call with your new key and a synthetic prompt containing a fake social security number.
2. The result appears as an alert: **Whiteout answered *allow*, *warn* or *block* in *N* ms (mode: *monitor*)**, with any policies that matched. If the app's policy is in monitor mode, the alert explains that monitor mode records but never blocks.
3. The status line below changes from **Waiting for the first event from your app…** to **Events are arriving. Now send one real request from your app — the app page shows each call.** The page checks every few seconds.

The test call is a real call: it appears in the app's **Activity** tab and makes the method **live**.

> **Why did the test prompt return allow?** With **No policy yet — monitor only**, nothing is blocked and prompt content isn't checked. With a policy group in **monitor** mode, prompt content isn't sent for a content check either. Switch the app to a group in **warn** or **enforce** mode to see a content verdict. See [What gets checked](./custom-ai-apps/policies-and-identity.md#what-gets-checked-in-each-mode).

### Methods without a key

- **Browser extension**: open the site in a browser with the Whiteout extension, enable Whiteout on internal AI sites, and send a prompt. The status changes to **Whiteout is checking prompts on this site.**
- **Infrastructure agent**: make one model call from the app. The sidecar forwards it within a few seconds.
- **Bedrock Guardrail**: make one model call. Bedrock logs reach Whiteout through the ingest pipeline, usually within a few minutes.

For these methods the status changes to **Calls are being recorded against this app.**

You don't have to wait. Click **Open app** at any time; the app stays in **Waiting for events** until its first call arrives.

---

## After the Wizard

- **Hand off**: send the app's developers the key (through your secrets manager) and the relevant guide from this section.
- **Tighten the policy** once events look right: move the app from monitor-only to a group in **warn** or **enforce**, or to the employee's own policies.
- **Add more methods** from the app's **Setup** tab with **Add a method**.
- **Declare model endpoints** if you skipped them, so Whiteout can detect traffic that bypasses coverage.
- **Mint keys for other environments** on the **Keys** tab. The wizard only creates a key for the first environment.

---

## Troubleshooting

### Continue Is Disabled on Step 1

- Enter an **App name** and at least one **Environment**. Remember to press **Enter** or click **Add** after typing each value.
- For an **Internal web chat**, add at least one **Web address** starting with `https://`.

### "Not a Valid Entry" Under a Web Address

- The address must start with `https://`, contain no spaces and be at most 300 characters.

### An Error When Registering

- *At most 200 custom apps*: archive apps you no longer need.
- *Web URL: '…' is a public AI service Whiteout already covers*, or *'…' is too broad*: use your own domain (see [Step 1](#step-1-describe)).
- *Add the app's web URL … first*: the browser extension method needs a web address. Go back to step 1, or add one later with **Edit** on the app page.

### No Policy Groups Listed on Step 2

- No resource policy groups exist yet. Choose **No policy yet — monitor only** and add a group later, or click **Create or edit policy groups in Infrastructure →**.

### The Test Prompt Fails

- The test call goes from your browser straight to your Whiteout API. Check that your network allows it.
- If the app was paused or archived from another tab, the call is refused.

---

## Related Guides

- [Custom AI Apps overview](./custom-ai-apps/overview.md)
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md)
- [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md)
