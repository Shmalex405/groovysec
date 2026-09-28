# Monitoring and Troubleshooting

Once an app is connected, its **app page** is where you check that coverage is working, review what Whiteout decided, manage keys and ask Groovy Security for help. This guide tours the app page, explains how coverage is proven from traffic, and covers key management, coverage requests, troubleshooting, security and common questions.

## The App Page

Open **Coverage → Custom AI Apps** and click an app.

### Header

- The app's **name**, type and description
- A **status** chip (see [App status](./custom-ai-apps/overview.md#app-status)), a **policy** chip (the policy group and its mode, **Employee policies**, or **No policy — monitor only**) and the app's **environments**
- **Test the guard**: send a real Guard API call with one of the app's keys (see [Test the guard](#test-the-guard))
- **Edit**: change the app's details (see [Edit an app](#edit-an-app))
- The **⋮** menu:
  - **Pause coverage** / **Resume coverage**. While paused, Guard API calls with the app's keys are refused (HTTP 409)
  - **Request help from Groovy**
  - **Archive app**. Every key for the app stops working immediately; its activity history is kept

### Overview tab

| Section | What it shows |
|---------|---------------|
| **Tiles** | **Calls**, **Blocked** (with the block rate), **Flagged** (with flagged replies), **Injection** detections (of scans), **Tokens** (in and out) and **Employee calls** (judged by the employee's own policies), for the selected period |
| **Calls over time** | Calls per day by decision (allowed, flagged, blocked), over **7d**, **30d** or **90d** |
| **Coverage health** | One card per coverage method with its status (**pending**, **live**, **stale**), first and last event, and a hint on what to fix when it's gone quiet |
| **How calls arrive**, **Models**, **Providers** | Where calls came from (Guard API, SDK, Auto-instrumented, Gateway, OpenTelemetry, …) and which models and providers they used |
| **Prompt injection** | Detections by action, when Prompt Injection Defense has scanned this app's traffic |
| **AI Footprint** | Declared hosts and any bypass traffic (see [Coverage proof](#coverage-proof-and-bypass-detection)) |

### Activity tab

Every call Whiteout governed for this app, newest first, for both app-policy and employee-policy calls.

- **Filters**: **Decision** (Allowed, Flagged, Blocked), **Arrived via** (Guard API, SDK, Auto-instrumented, Gateway, Events API, OpenTelemetry, Infrastructure agent, Employee policies) and **Period** (24 hours to 365 days)
- **Columns**: **When**, **Decision** (with a **reply flagged** chip when the reply violated a policy), **Arrived via**, **Who** (the employee's email for employee-policy calls, otherwise an anonymised end-user reference), **Model**, **Why** (policies or reason) and **Tokens**
- **Load older** pages back through history

Click a call to open **Call details**: the decision, who, model, tokens and evaluation ID; the policies and reason; the **Prompt** and **Reply** when the policy stores content (otherwise *Not kept — this app's policy stores metadata only*); Whiteout's verdict; links to **Open the injection scan** and **Open in Prompt Review** where relevant; and **Tamper evidence**, the call's record hash and the previous record's hash in the audit chain.

> **Opening a call is audited.** Viewing a call's details is recorded in the admin **Audit Log**, as it may show prompt content.

### Injection tab

When your organisation has Prompt Injection Defense on, this tab lists every scan of the app's traffic, with the same detail drawer as **Governance → Injection Defense**.

### Policy & identity tab

- **Policy**: the **Policy group** drop-down (or **No policy — monitor only**), **Manage policy groups →**, and chips for the group's **Mode**, **Data capture** and **If Whiteout is unreachable** setting
- **Whose policies apply**: switch between the app's policy group and the employee's own policies, and set token audiences (see [The Employee's Own Policies](./custom-ai-apps/policies-and-identity.md#the-employees-own-policies))

Changes take effect on the next call.

### Setup tab

Every way to cover the app, with ready-to-copy snippets that use `$WHITEOUT_APP_KEY` in place of the key:

- Cards for any **Bedrock Guardrail**, **Infrastructure agent** or **Browser extension** method you've added
- **Auto-instrument (no code)**, **Kubernetes (no image changes)**, **OpenTelemetry (visibility only)**, **Python / Node SDK** and **Guard API**, always shown
- **Add a method**: pick another method. Methods that need configuration (browser, infrastructure agent, Bedrock) get a card on this tab; key-based methods turn live on their first call. **Browser extension** is disabled until the app has a web address

### Keys tab

See [Managing Keys](#managing-keys).

### Requests tab

This app's coverage requests with their status and any response from Groovy Security, and a **New request** button.

---

## Test the Guard

Click **Test the guard** in the app header to send a real Guard API call, exactly as your app would:

1. Paste one of the app's keys in **App key** (keys are only shown when created; if you've just created one on the Keys tab it's filled in for you).
2. Edit the **Prompt**.
3. Click **Send test call**.

The result shows the decision, the mode, the latency, the reason and any policies that matched, and whether Whiteout failed open. The test call is recorded in the app's activity like any other call.

## Edit an App

Click **Edit** to change the **Name**, **Description**, **Type**, **Environments** (comma separated; keys can only be minted for listed environments), **Web addresses** (one per line, starting with `https://`), **Model endpoints** (one per line) and **Data it handles** (for example `PII, PHI`, for your reference).

Changing web addresses or model endpoints updates what the browser extension covers and what the AI Footprint tracks for this app.

---

## Coverage Proof and Bypass Detection

Whiteout doesn't take a coverage method's word for it. An app is only **Covered** once calls actually arrive, and it turns **Degraded** when Whiteout sees the app's model host being called without matching calls.

### How it works

When you declare an app's **model endpoints** and **web addresses**, Whiteout adds them to your AI Footprint catalog as a **Custom AI App** entry. The AI Footprint then recognises traffic to those hosts from devices running Desktop Guard and from infrastructure agents.

If a declared model host receives traffic in the last 24 hours and the app sent **no** calls through Whiteout in the same period, Whiteout:

- Raises a **custom app bypass** finding in the AI Footprint, listing the top sources, hosts and flows. It's high severity, and critical after 3 days
- Marks the app **Degraded**, and shows the details on the **AI Footprint** card of the app's Overview: *<host> was called from N sources (N flows) with no Guard or SDK events in the last 24 hours*, with a **View finding** button

The finding resolves when the app's calls resume, or when the app is paused or archived. You can mute it in the AI Footprint like any other finding.

### What's tracked

The **AI Footprint** card lists the app's hosts in three groups:

| Group | Meaning |
|-------|---------|
| **Model hosts — bypass-tracked** | Internal hosts, service names and IP addresses. Traffic to them is attributed to this app |
| **Web hosts** | The app's web addresses |
| **Public provider hosts — not bypass-tracked** | Hosts such as `api.openai.com`. Every workload calls these, so traffic can't be attributed to one app. Cover them with the SDK or Guard API; the AI Footprint still reports ungoverned use of the provider |

> **Limits of bypass detection.** Whiteout can only flag a bypass when it sees the traffic, from devices running Desktop Guard or from infrastructure agents. It flags an app only while the app sends **no** calls; a second service calling the model host alongside a covered one isn't told apart.

### Register as custom app

In the AI Footprint, an unrecognised finding or an unclaimed internal model host can be turned into a custom app with **Register as custom app** (in the finding drawer) or **Register app** (on the egress row). The wizard opens pre-filled with the host, process and app bundle, and once registered Whiteout recognises that exact traffic as the app. Custom AI App entries in the Footprint's catalog are managed from the app itself, so they can't be edited or deleted there.

---

## Managing Keys

The **Keys** tab lists every key with its **Key** prefix (for example `wo_app_prod_Ab3x…`) and name, **Environment**, **Created**, **Last used** and **Status** (active or revoked).

| Action | How |
|--------|-----|
| **Create a key** | Choose an environment and click **New key**. The key is shown once; copy it into your secrets manager |
| **Rotate a key** | Click **Rotate** on the key and follow the three steps below |
| **Revoke a key** | Click **Revoke** and confirm. Calls using it fail immediately |

Limits: two active keys per environment, and 20 keys per app in total, including revoked ones.

### Rotating without downtime

**Rotate** opens a three-step dialog:

1. **Create the new key**: click **Create new key**. Both keys work until you revoke the old one. The dialog shows when the old key was last used.
2. **Deploy it**: copy the new key, update the app's configuration and redeploy. The dialog watches for the first call made with the new key and shows *The new key is in use* when it arrives. Click **Continue**, or **Continue without waiting**.
3. **Revoke the old key**: click **Revoke old key**. Any service still using it fails its Guard API calls immediately.

You can close the dialog with **Finish later** at any point; both keys stay active.

If the environment already has two active keys, revoke an unused one first.

---

## Coverage Requests

For anything you can't set up yourself (a desktop app, an unusual web chat, a gateway that isn't supported, or help wiring up a method), send a request to Groovy Security.

### Send a request

Click **Request from Groovy** in the wizard, **Request help from Groovy** in an app's **⋮** menu, **New request** on an app's **Requests** tab, or **New request** on **Custom AI Apps → Coverage requests**. The **Request coverage from Groovy** dialog asks for:

| Field | Description |
|-------|-------------|
| **Summary** | Required, at least 3 characters |
| **App type** | For custom app requests |
| **Details** | Where it runs, who uses it, which model it calls, what you'd like governed. Up to 8,000 characters |
| **Urgency** | Low, Normal or High |

> **Don't paste credentials.** If the text looks like it contains a key or password, the dialog warns you and won't send until you remove it.

The **Request Integration** button on the Integrations page opens the same dialog, as **Request an integration**.

### Track a request

**Custom AI Apps → Coverage requests** lists every request with its **Status**, the response **From Groovy** and when it was **Updated**:

| Status | Meaning |
|--------|---------|
| **Submitted** | Received |
| **Triaged** | Reviewed and scoped |
| **In progress** | Being worked on |
| **Delivered** | Done. Often the delivered coverage appears on the app as a **Delivered by Groovy** method, with no software update needed |
| **Declined** | Not something Groovy Security can deliver; see the response |
| **Closed** | Closed |

Groovy Security follows up by email, and you're notified in the admin console as the status changes. Submitting a request is recorded in the Audit Log.

---

## Notifications and Audit

- **Notifications**: blocked calls raise a *Custom AI app call blocked* notification linking to the app. Coverage request updates notify your admins
- **Alert routing and SOC destinations**: warn and block alerts follow the app's resource policy group
- **Audit Log**: registering, updating and archiving apps, adding and removing methods, creating and revoking keys, viewing call details and submitting requests are all recorded
- **Tamper evidence**: each call record is hash-chained, and the chain position is shown in the call details

---

## Troubleshooting

### The App Stays "Waiting for Events"

- Check the method's card under **Coverage health** for a hint
- Check the service is deployed with a key for this app (compare the key prefix with the **Keys** tab) and that **Last used** is recent
- Check the service can reach your Whiteout API URL
- For the browser extension, check users have enabled Whiteout on internal AI sites

### The App Is "Degraded"

Some service is calling the app's model host without going through Whiteout.

- Open **View finding** to see which devices or workloads made the calls
- Check every deployment and every replica has the key and the coverage method, including batch jobs and staging services pointed at the same host
- If the calls come from a different app that shares the host, register that app too

### A Method Is "Stale"

- No calls for 7 days: is the service still running, with a valid key?
- Browser extension: the page changed. Update the selector hints

### Calls Are Allowed That Should Be Blocked

- Check the policy chip in the header. **No policy — monitor only** and groups in `monitor` mode never block; in monitor mode prompt content isn't checked at all
- Check the group's **Data capture** isn't `none`, which turns off content checks
- Check the call's `fail_open` flag in Activity or your logs: Whiteout may have been unreachable
- Check what's being scanned: by default only the latest user message
- For employee-policy apps, open the call to see whether it fell back to the app's policy group

### The App's Calls Suddenly Fail or Go Ungoverned

- A key was revoked, the app was paused or archived. The SDKs log *app key rejected* and apply the fail behaviour: fail-open apps continue ungoverned, fail-closed apps block every call
- Check the **Audit Log** for recent changes to the app

### "At Most Two Active Keys" When Creating a Key

Revoke a key that isn't in use in that environment, or use **Rotate**.

---

## Security Notes

- **Treat app and gateway keys as secrets.** Store them in a secrets manager and inject them as environment variables. Never commit them to source control or paste them into tickets
- **Keys are scoped.** An app key can only check and record calls for its own app and environment. It can't read activity, prompts or any admin data. Gateway keys can report calls for any app, so protect them accordingly
- **Keys are shown once and stored hashed.** Whiteout can't show a key again; mint a new one if it's lost
- **Rotate regularly** using the overlap rotation, and revoke immediately if a key may be exposed. **Last used** shows whether a key is still in use before you revoke it
- **Use one environment per deployment stage**, so a leaked staging key can't report production calls
- **Content storage is opt-in.** New apps store metadata only. Prompt and reply text is stored only when the policy group's data capture is `full`
- **End-user IDs are anonymised.** The `end_user` value your app sends is stored only as a keyed hash
- **Trusting app-asserted identity** lets any holder of the key act as any employee. Leave it off unless the app can't forward an ID token
- **Selector hints are never executed**; they're only used to find elements on the page

---

## FAQ

**Is there anything to enable before using Custom AI Apps?**
No. It's available to every organisation. You need the admin role to register apps.

**Does Whiteout proxy our model traffic?**
No. Whiteout checks prompts and replies through the Guard API; your app, gateway or cloud still calls the model directly. Whiteout never holds your provider API keys.

**Does auto-instrumentation read our OpenAI or Anthropic keys?**
No. It wraps the client's calls; the client still sends its own credentials to the provider.

**Can one app use several methods?**
Yes. For example, a web chat can be covered by the browser extension for what staff type, and by the SDK on its backend for replies and tool results. Each method reports its own health.

**What does a check cost in latency?**
One round-trip to Whiteout before the model call and one after, plus the compliance engine's time when content is checked. Each response reports `latency_ms`, and the app page shows it per call.

**What happens if Whiteout is down?**
The policy group's fail behaviour applies: fail-open apps continue ungoverned, fail-closed apps block. See [Fail Behaviour](./custom-ai-apps/policies-and-identity.md#fail-behaviour).

**Can we see the prompts?**
Only if the app's policy group stores content (`full` data capture). Otherwise Whiteout keeps metadata only. For employee-policy apps, prompts follow the same rules as other AI tools in Prompt Review.

**Why doesn't a discovered app block anything?**
Discovered apps run in monitor mode until you confirm them, unless you chose to enforce when adding the gateway.

**How do we cover a desktop app?**
Send a coverage request. Desktop apps need client work from Groovy Security.

**What happens in audit-only mode?**
The compliance engine isn't called: calls are logged and allowed. See [Audit-Only Organisations](./custom-ai-apps/policies-and-identity.md#audit-only-organisations).

**How do we remove an app?**
Use **Archive app** in the app's **⋮** menu. Its keys stop working immediately and its history is kept. To stop checking temporarily instead, use **Pause coverage**.

---

## Related Guides

- [Custom AI Apps overview](./custom-ai-apps/overview.md)
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md)
- [Register an App](./custom-ai-apps/setup-wizard.md)
