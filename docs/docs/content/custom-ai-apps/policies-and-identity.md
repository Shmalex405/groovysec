# Policies, Identity and Verdicts

This guide explains how Whiteout decides what happens to a custom app's calls: which policy applies, what is checked in each mode, what the app receives back, how admins see the result, and what happens when Whiteout can't be reached.

## Overview

Every custom app is governed in one of two ways, chosen on the app's **Policy & identity** tab under **Whose policies apply**:

| Option | What applies | Best for |
|--------|-------------|----------|
| **The app's policy group** | One resource policy group for every call: its mode, data capture, fail behaviour, model and provider rules, and content policies | Server apps, pipelines and agents with no signed-in employee, or where one policy fits every user |
| **The employee's own policies** | The signed-in employee's group policies, exactly as when they use ChatGPT in the browser | Internal chats and assistants where you know who is typing |

---

## Resource Policy Groups

Custom apps reuse the **resource policy groups** you manage under **Infrastructure**, the same groups that govern infrastructure workloads. A group sets:

| Setting | Values | Effect on a custom app |
|---------|--------|------------------------|
| **Enforcement mode** | `monitor`, `warn`, `enforce` | Whether violations are only recorded, returned as a warning, or blocked (see below) |
| **Data capture** | `full`, `metadata_only`, `none` | Whether prompt and reply text is stored with each call, and whether content is checked at all |
| **Fail behaviour** | `open`, `closed` | What happens when Whiteout can't reach a verdict |
| **Model allowlist** | List of models (empty allows all) | A call naming a model not on the list is caught |
| **Blocked providers** | List of providers | A call to a blocked provider is caught |
| **Token budget per call** | Number of input tokens | A call over the budget is caught |
| **Compliance timeout** | Seconds (default 10) | How long Whiteout waits for a content verdict before applying the fail behaviour |
| **Content policies** | Rules from your policy library | What the compliance engine checks prompts and replies against |
| **Alert routing** | Destinations | Where warn and block alerts are sent |

To create or edit a group, open **Infrastructure → Resource Policies** (see [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md#step-1--create-a-resource-policy-group)). To assign a group to an app, pick it on the app's **Policy & identity** tab, in the **Policy group** drop-down. The tab then shows the group's **Mode**, **Data capture** and **If Whiteout is unreachable** setting.

Choose **No policy — monitor only** to govern an app without a group. Its calls are logged with metadata only and are never checked or blocked.

> **Model and provider checks need the call details.** The model allowlist, blocked providers and token budget can only apply when the call says which model and provider it uses. The SDKs, auto-instrumentation and gateways send these automatically; with the Guard API, pass `model`, `provider` and `token_count_in`.

### What gets checked in each mode

For an app governed by its policy group:

| | No policy group | `monitor` | `warn` | `enforce` |
|---|---|---|---|---|
| **Call is logged** | Yes (metadata only) | Yes | Yes | Yes |
| **Model, provider and token checks** | No | Recorded as *would block*; the call is allowed | Returns `warn` | Returns `block` |
| **Prompt content checked by the compliance engine** | No | No | Yes; a violation returns `warn` | Yes; a violation returns `block` |
| **Reply content checked** | No | Yes; a violation is recorded as a flagged reply; the verdict stays `allow` | Yes; a violation returns `warn` | Yes; a violation returns `block` |
| **Prompt Injection Defense** (when your organisation has it on) | Yes, reporting only | Yes, reporting only | Yes | Yes |

Data capture changes this table:

- **`full`**: content is checked as above, and the prompt and reply text are stored with the call and shown in the **Activity** tab.
- **`metadata_only`**: content is checked as above, but the text isn't stored. The Activity tab shows *Not kept — this app's policy stores metadata only.*
- **`none`**: no content is sent to the compliance engine for prompts or replies, and no text is stored. Model, provider and token checks still apply.

> **Start in monitor, then move up.** A common rollout is: register the app with **No policy yet — monitor only**, confirm calls are arriving, move it to a group in `monitor` to see *would block* findings and flagged replies, then `warn`, then `enforce`. Changing the group or its mode takes effect on the next call; no redeploy is needed.

---

## Verdicts

### What the app receives

Every check returns a decision:

| Decision | Meaning | What the app should do |
|----------|---------|------------------------|
| `allow` | No violation, or the app is in monitor mode | Continue |
| `warn` | A violation in `warn` mode | Continue, optionally showing the reason to the user |
| `block` | A violation in `enforce` mode, a blocked app, an injection block, or a fail-closed outcome. Never returned in an [audit-only organisation](#audit-only-organisations) | Don't send the prompt to the model, or don't show the reply |

The Guard API response also carries `violated_policies`, a human-readable `reason`, the `mode` that was applied, `fail_open` (true when Whiteout couldn't decide and allowed the call), an `evaluation_id` to link the reply check to the prompt, and the check's `latency_ms`. See [Guard API Reference](./custom-ai-apps/guard-api.md#response) for every field.

How each method surfaces a block:

| Method | Prompt blocked | Reply blocked |
|--------|---------------|---------------|
| **Guard API** | `"decision": "block"` in the response. Your code decides what to show | Same, from `/v1/guard/output` |
| **SDK** and **auto-instrumentation** | `WhiteoutBlockedError` is raised with `stage="input"` before the model is called | `WhiteoutBlockedError` with `stage="output"`; the reply isn't returned |
| **LiteLLM** | LiteLLM's usual guardrail error (HTTP 400) to the caller | Same |
| **Cloudflare Worker** | HTTP 400 with a `whiteout_blocked` error body | HTTP 400 for non-streaming replies |
| **Azure API Management** | HTTP 400 to the caller | HTTP 400 for non-streaming replies |
| **Portkey** | Portkey's webhook guardrail verdict (`verdict: false`) | Same |
| **Browser extension** | The prompt isn't sent, and the block overlay is shown, as on ChatGPT | Not applicable |
| **Bedrock Guardrail** | AWS applies the guardrail | AWS applies the guardrail |
| **OpenTelemetry**, **infrastructure agent** | Never blocks | Never blocks |

The SDKs never raise on `warn`; they return the decision so you can act on it.

### What admins see

- **App page → Activity**: every call with its decision, shown as **Allowed**, **Flagged** or **Blocked**. **Flagged** covers warnings, *would block* findings in monitor mode and flagged replies (marked **reply flagged**). Open a call to see the policies, the reason and, with `full` data capture, the prompt and reply.
- **App page → Overview**: **Calls**, **Blocked**, **Flagged** and **Injection** tiles and a **Calls over time** chart.
- **Notifications**: a *Custom AI app call blocked — <app> (<provider>)* event for blocks, which links back to the app page.
- **Alert routing and SOC destinations**: warn and block alerts go wherever the app's policy group routes them.
- **Prompt Review, People and AI Activity**: for apps using employee policies (see below).

---

## The Employee's Own Policies

With **The employee's own policies**, a custom app is governed like ChatGPT, Claude or Copilot in the browser:

- Each prompt is judged by the compliance engine with the **signed-in employee's group policies**
- The call appears in **Prompt Review**, on the employee's row in **People**, and in per-user risk, labelled with the app's name
- The app is listed under **AI Applications**, so you can allow or block it per group, just like a public AI tool
- The verdict is **enforced whatever the app's policy group mode is**, as it is in ChatGPT

### How the app identifies the employee

The app forwards the employee's **OpenID Connect ID token**, issued by your organisation's identity provider when the employee signed in to the app:

- **Guard API**: in the `X-Whiteout-User-Token` header
- **Python SDK**: `user_token=` on `check_input`, or `whiteout={"user_token": ...}` on a wrapped client
- **Node SDK**: `userToken` on `checkInput`, or `whiteout: { userToken }` on a wrapped client

Whiteout verifies the token's signature against your identity provider's published signing keys, and checks its issuer, audience and expiry. It then finds the Whiteout user by the token's email, or by the identity provider's user ID.

Supported identity providers are the OpenID Connect providers you connect under **Integrations**: Okta, Microsoft Entra ID, Google, Auth0, OneLogin, Ping Identity, JumpCloud and generic OIDC. See the [SSO provider guides](./sso-providers/okta.md).

### Set it up

1. Make sure an OpenID Connect identity provider is connected and enabled under **Integrations**. If none is, the card shows *No OpenID Connect identity provider is set up for your organization* and every call falls back to the app's policy group.
2. Open the app and go to **Policy & identity**.
3. Under **Whose policies apply**, choose **The employee's own policies**.
4. In **Token audiences (client IDs)**, enter the client ID your app signs employees in with (comma separated if there are several), and click **Save**. The helper text shows your identity provider's admin-app client ID for reference. Without at least one audience, no token is accepted.
5. Ask the app's developers to forward the ID token on every call, as above.

The app's chip on the list page and header now reads **Employee policies**.

### Apps that can't forward a token

Some apps can't forward an ID token, for example apps behind SAML-only sign-in. For those, you can turn on **Trust the app to name the employee by email (`X-Whiteout-User-Email`)**. The app then sends the employee's email address in that header, or as an email in the `end_user` field.

> **Warning.** With this switch on, anyone holding the app's key can act as any employee. Use it only for apps that can't forward a token, and protect the key accordingly. It is off by default.

### When Whiteout falls back to the app's policy group

A call falls back to the app's policy group, and is handled exactly as described in [What gets checked in each mode](#what-gets-checked-in-each-mode), when:

- The call carries no token (and no trusted email)
- The token can't be verified: wrong signature, issuer or audience, or expired
- No identity provider is connected
- The employee isn't a Whiteout user, or isn't in any group

The Guard API response then includes an `identity` object explaining why, for example `{"verified": false, "fallback": "app_group", "reason": "..."}`. When verification succeeds, the response includes a `user` object with the employee's email, group and how they were verified.

### Replies

The reply to an employee-policy prompt is attached to that prompt's record, so Prompt Review shows the whole exchange. If the app also has a policy group, the reply is checked against that group's content policies and mode.

### Allow or block the app per group

Custom apps appear in the **AI Applications** list on **Integrations**, for each group and organisation-wide on the **Global** tab. Block the app for a group and every employee-policy call from that group returns `block` with the reason *<App name> is not allowed for your group.* In an [audit-only organisation](#audit-only-organisations), the call is allowed instead and the response records the rule that would have blocked it, and the allow/block rules can't be changed until enforcement is enabled.

---

## Prompt Injection Defense

If your organisation has **Prompt Injection Defense** turned on, custom app traffic is scanned for jailbreaks and planted instructions as well:

- The prompt, system prompt, context documents and tool results in each Guard API call are scanned
- Replies are scanned for instructions the model is repeating or passing on to tools
- A detection can turn the decision into `block`, depending on your Injection Defense settings; in monitor mode it's reported only
- A context document or tool result carrying instructions can be **quarantined**: the response lists which messages and documents to keep away from the model. The SDKs and auto-instrumentation replace quarantined turns with a short notice automatically

The response gains `injection` and `quarantine` fields only when the feature is on. In an [audit-only organisation](#audit-only-organisations) the detector doesn't run: `injection` reports `"status": "off"` and there's no `quarantine` field. Findings appear on the app's **Injection** tab and under **Governance → Injection Defense**. See [Injection Defense](./injection-defense/overview.md) for how detection, blocking and quarantine are configured.

---

## Fail Behaviour

Custom apps are designed so that a Whiteout outage doesn't take your app down, unless you choose otherwise.

### On the Whiteout side

If the compliance engine doesn't return a verdict within the policy group's **compliance timeout** (10 seconds by default), or an internal error occurs, the group's **fail behaviour** decides:

- **`open`** (the default): the call is allowed, and the response says `"fail_open": true`
- **`closed`**: the call is blocked, with a reason ending in *(fail-closed)*

Apps with no policy group always fail open, and so does every app in an [audit-only organisation](#audit-only-organisations).

### On the app side, when Whiteout can't be reached

When the app can't reach Whiteout at all (network failure, timeout, an HTTP error, or a revoked key), the client decides:

| Method | Behaviour |
|--------|-----------|
| **SDK** and **auto-instrumentation** | Follows the policy group's fail behaviour, which the SDK reads from Whiteout and caches for 5 minutes. With no cached setting it fails open. You can override it in code with `fail_open` / `failOpen` |
| **Guard API** (your own code) | Your code decides. Use a timeout on each call and handle errors explicitly |
| **LiteLLM** | Follows the gateway's policy group fail behaviour, as the SDK does |
| **Cloudflare Worker** | The Worker's `WHITEOUT_FAIL` variable: `open` (default) or `closed` |
| **Azure API Management** | Fails open as shipped; the template explains how to fail closed |
| **Portkey** | Depends on your Portkey guardrail settings |

> **Revoked, archived and paused apps fall under fail behaviour.** When a key is revoked, the app is archived, or coverage is paused, Whiteout refuses the call. The SDKs treat a refused call like an outage: with fail-open the model call goes ahead ungoverned, and with fail-closed it's blocked. Revoked keys are logged at error level by the SDK.

---

## Audit-Only Organisations

If your organisation runs Whiteout in **audit-only** mode, custom apps are **never blocked**, whatever the policy group, the app's identity setting or your Injection Defense settings say. Prompt Injection Defense is off, and every other check still runs and records what it would have done:

| Check | In audit-only mode |
|-------|--------------------|
| **Prompt and reply content** | Not checked: the compliance engine isn't called, as for every other surface. No content verdict is reached |
| **Model allowlist, blocked providers, token budget** | Still checked. A match is recorded against the call (shown as **Flagged** in the Activity tab, with the rule), and the call is allowed |
| **AI Applications** (employee-policy apps) | Still checked. A call from a group the app is blocked for is allowed and judged as usual. The response carries `"would_block_by": "ai_app_access"` and the reason *"\<App name\> is not allowed for your group — not enforced (audit-only mode)"*, and the call details record the rule |
| **Prompt Injection Defense** | Off: nothing is scanned or recorded, and nothing is quarantined. If the feature is switched on in your settings, the response's `injection` result reads `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}`. See [Injection Defense in audit-only mode](./injection-defense/configuration.md#audit-only-mode) |
| **Mode** | Every response reports `"mode": "monitor"`, whatever the policy group's mode |
| **Fail behaviour** | Always open, even when the policy group fails closed. `GET /v1/guard/config` serves `fail_behavior: open` |

Every decision is `allow`. When a check would have blocked or warned, the response also carries:

- `enforced`: `false`
- `would_action`: what the check asked for, `block` or `warn`
- `suppressed_by`: `"AUDIT_ONLY"`

These fields are additive: apps and SDKs that don't read them behave exactly as before. See [Guard API Reference → Audit-only organisations](./custom-ai-apps/guard-api.md#audit-only-organisations).

Calls still appear in the app's Activity tab, in AI Activity and, for employee-policy apps, in Prompt Review.

### Settings you can't change in audit-only mode

A policy group, the employee's own policies and a Bedrock guardrail only matter to the compliance engine or to enforcement, so they're view only in audit-only mode. On an app's **Policy & identity** tab, the **Policy group** drop-down and **Whose policies apply** are greyed out under a banner that reads *"**Audit-only mode** — The policy group and employee policies need policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement. Token audiences and identity settings stay editable."*

| Where | Locked | Still editable |
|-------|--------|----------------|
| **Register a custom app**, step **Which policy should apply?** | Choosing a policy group. The app is registered with **No policy yet — monitor only**. | Every other step |
| An app's **Policy & identity** tab | **Policy group**, **Whose policies apply** | Token audiences and identity settings |
| An app's **Bedrock Guardrail** method | Choosing the guardrail | The IAM roles that attribute calls to the app |
| **Gateways** | The policy for apps you haven't confirmed yet, **Until you confirm an app**, and the policy group when you confirm an app. See [Gateways](./custom-ai-apps/gateways.md#audit-only-organisations). | Everything else |
| **Infrastructure → Resource Policies** | Each group's enforcement, fail behaviour, rules, content policies and compliance engine settings. See [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md#step-1--create-a-resource-policy-group). | Name, description, data capture, classification and alerting |

Through the API, `POST /custom-apps` with a `policy_group_id`, and `PATCH /custom-apps/{id}` or `POST /custom-apps/{id}/methods` that change the policy group, `policy_source` or the Bedrock guardrail, are rejected with HTTP 403: *"Policy enforcement is not included in this tier (audit-only / discovery)."* A request that re-sends those fields unchanged, for example to rename an app, is accepted. AI Applications rules and Injection Defense settings are view only too.

Everything you had set is kept as it is, and applies from the next call once enforcement is enabled for your organisation. See [Audit-Only Mode](./governance/audit-only-mode.md#settings-locked-in-audit-only-mode) for how audit-only mode affects every surface.

> **Clients that fail closed on their own still can.** Audit-only mode makes Whiteout's verdicts non-blocking, but it can't change what a client does when it can't reach Whiteout. A Cloudflare Worker with `WHITEOUT_FAIL = "closed"`, an Azure API Management fragment changed to fail closed, Portkey's guardrail timeout settings, and SDK code that sets `fail_open=False` / `failOpen: false` still refuse calls during an outage.

---

## Discovered Apps

Apps that a gateway reports for the first time are **Discovered**. Until you confirm one, it runs on the gateway's policy for unconfirmed apps, in **monitor** mode unless you chose otherwise when adding the gateway. Discovered apps always use the app-policy path, not employee policies. See [Gateways](./custom-ai-apps/gateways.md#discovered-apps).

---

## Related Guides

- [Guard API Reference](./custom-ai-apps/guard-api.md): the full request and response format
- [SDK Integration](./custom-ai-apps/sdk-integration.md): handling blocks in Python and Node
- [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md): reading the Activity tab
- [Injection Defense](./injection-defense/overview.md): scanning custom app traffic for prompt injection
- [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md): creating resource policy groups
