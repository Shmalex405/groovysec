# Custom AI Apps

Most organisations don't only use public AI tools. They also build their own: an internal chat on `chat.corp.example.com`, a retrieval (RAG) service that calls OpenAI, a support bot on AWS Bedrock, an agent that plans and calls tools. **Custom AI Apps** brings those applications under the same Whiteout AI policies, visibility and audit trail as ChatGPT, Claude or Copilot.

You register each app once, choose how Whiteout should cover it, and hand the resulting key and snippet to the team that runs the app. From then on every prompt and reply the app sends through Whiteout is checked, logged and shown on the app's own page.

Custom AI Apps is available to every organisation. There is nothing to switch on.

## Overview

With Custom AI Apps you can:

- **Register** your own LLM applications, gateways and internal AI tools, each with an owner, environments, web addresses and model endpoints
- **Check prompts before they reach the model, and replies before they reach the user**, with verdicts of allow, warn or block
- **Choose whose policies apply**: one policy group for the whole app, or each signed-in employee's own group policies, exactly as in ChatGPT
- **Cover apps without code changes** using auto-instrumentation, a Kubernetes webhook, a guardrail in your LLM gateway, or an OpenTelemetry exporter
- **Prove coverage from traffic**: an app is only marked **Covered** once Whiteout receives its events, and is marked **Degraded** when its model host is called without Whiteout seeing the call
- **Review every governed call** in an activity audit trail, with tamper-evident records
- **Ask Groovy Security** to set up anything you can't set up yourself, through tracked coverage requests

---

## Where to Find It

Open **Coverage → Custom AI Apps** in the admin console sidebar. The same page is linked from the **Custom AI Apps** card on **Integrations**, which shows how many apps you have, how many are covered or degraded, and any open requests.

| Page | What it's for |
|------|---------------|
| **Custom AI Apps** | Every registered app with its status, coverage methods and 7-day call volume |
| **Register a custom AI app** | The five-step setup wizard (see [Register an App](./custom-ai-apps/setup-wizard.md)) |
| **App page** | One app's overview, activity, injection findings, policy, setup, keys and requests |
| **Gateways** | LLM gateways (LiteLLM, Portkey, Cloudflare, Azure API Management) that cover every app behind them (see [Gateways](./custom-ai-apps/gateways.md)) |
| **Coverage requests** | Everything you've asked Groovy Security to set up, with its status |

All Custom AI Apps pages require the **admin** role. Users with the **read-only** role can open every page but can't register apps, mint keys or change settings.

---

## Key Concepts

### App

A Custom AI App is one application you own. It has:

- **App name**, **Owner** and a description
- **Type**: Server app / API, Agent or workflow, Internal web chat, App on AWS Bedrock, Desktop app, or Something else
- **Environments**, such as `prod` and `staging`. Each environment gets its own keys
- **Web addresses** (for internal web chats) and **model endpoints** (the hosts the app sends prompts to)
- A **policy**: either a resource policy group, or the employee's own policies
- One or more **coverage methods**

Each app also gets a short identifier (its *slug*, for example `support-assistant`), derived from its name. Some setup snippets use it.

### App keys

Server-side coverage methods authenticate with an **app key**. App keys:

- Look like `wo_app_prod_xxxxxxxx…`, with the environment name in the prefix
- Are shown **once**, when they're created. Whiteout stores only a hash
- Belong to **one app and one environment**. They can check prompts and replies and record events for that app, and nothing else. A key can't read logs or any admin data
- Can be **rotated with overlap**: each environment can have two active keys at a time, so you can deploy the new key before revoking the old one

Gateways use a similar **gateway key** (`wo_gw_prod_…`), which can report calls for any app behind that gateway. See [Gateways](./custom-ai-apps/gateways.md).

### Coverage methods

A coverage method is how Whiteout sees the app's AI traffic. An app can use several, for example a web chat covered by the browser extension plus its backend covered by the SDK. Each method reports its own health.

| Method | Best for | Code changes | Blocks prompts | Blocks replies |
|--------|----------|--------------|----------------|----------------|
| **Guard API** | Any language or framework | A call before and after each model call | Yes | Yes |
| **Python / Node SDK** | Python and Node services using OpenAI or Anthropic | Two lines | Yes | Yes |
| **Auto-instrument (no code)** | Python and Node services you'd rather not edit | None: one environment variable and a launcher | Yes | Yes |
| **Kubernetes webhook** | Many services in a cluster | None: a namespace label and one annotation | Yes | Yes |
| **Gateway** | Apps that already call models through LiteLLM, Portkey, Cloudflare or Azure API Management | None in the apps; one gateway configuration | Yes | Yes (non-streaming replies on some gateways) |
| **OpenTelemetry (visibility only)** | Apps already exporting GenAI traces | None: exporter settings only | No | No |
| **Infrastructure agent** | Workloads you want to monitor without touching the app | None in the app; a sidecar | No | No |
| **Bedrock Guardrail** | Apps calling AWS Bedrock directly | Pass the guardrail on each call | Yes (enforced by AWS) | Yes (enforced by AWS) |
| **Browser extension** | Internal web chats your staff use in a browser | None | Yes (prompts, pastes, uploads) | No |
| **Request from Groovy** | Desktop apps, unusual UIs, anything else | Varies | Varies | Varies |

How to choose:

- **Need to block, and can deploy a config change?** Use **auto-instrumentation** (or the **Kubernetes webhook** at scale).
- **Already have an LLM gateway?** Add the Whiteout guardrail to the gateway once and every app behind it is covered.
- **Want full control over how blocks are shown to users?** Use the **SDK** or the **Guard API** directly.
- **Only want visibility first?** Start with **OpenTelemetry** or the **infrastructure agent**, both of which record calls and never block.
- **Internal web chat?** Use the **browser extension**.
- **Bedrock?** Use the **Bedrock Guardrail** method.

The wizard recommends methods based on the app type you choose. See [Where Each Method Is Documented](#where-each-method-is-documented) for the guide to each one.

### Policy: app policy group or employee policies

Every app is governed one of two ways (see [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md)):

- **The app's policy group.** One resource policy group applies to every call. The group sets the mode (**monitor**, **warn** or **enforce**), what content is stored, and what happens if Whiteout is unreachable. With no group selected the app is **monitor only**: calls are logged (metadata only) and never blocked.
- **The employee's own policies.** The app forwards the signed-in employee's identity token, and Whiteout judges the prompt with that employee's group policies. The app then behaves like ChatGPT in the browser: its calls appear in **Prompt Review** and **People**, and the app can be allowed or blocked per group under **AI Applications**.

### App status

| Status | Meaning |
|--------|---------|
| **Draft** | The app is registered but has no coverage method yet |
| **Waiting for events** | A method is set up, but Whiteout hasn't received a call in the last 7 days |
| **Covered** | At least one method has reported a call in the last 7 days |
| **Degraded** | A method is set up, but the app's model host was called in the last 24 hours without Whiteout seeing the call. Some service is bypassing coverage |
| **Discovered** | A gateway reported this app for the first time; an admin hasn't confirmed it yet |
| **Paused** | An admin paused coverage. Guard API calls are refused |

Each coverage method also has its own status: **pending** (no call yet), **live** (a call in the last 7 days) or **stale** (no call for 7 days, or the browser extension reported that the page changed).

---

## The Custom AI Apps Page

The list page shows:

- **Stat tiles** (once you have at least one app): **Apps** (with how many are covered), **Calls** and **Blocked** in the last 7 days (with the flagged count), **Injection** detections in the last 7 days, and **Needs attention** (degraded apps plus apps that are drafts or waiting for events). Click **Needs attention** to filter to degraded apps.
- A banner when apps have been **discovered through your gateways** and are waiting to be confirmed, merged or ignored, with a **Review** button.
- A table of apps with **App**, **Type**, **Coverage** (one chip per method), **Status**, **Calls, 7 days** (with a sparkline), **Last event** and **Environments**. Apps discovered through a gateway show a **Discovered via a gateway** chip; apps judged by employee policies show an **Employee policies** chip.
- **Search** and filters for **Status**, **Type** and **Covered by**.
- Buttons for **Gateways**, **Coverage requests** and **Register an app**.

Click any row to open the app page. See [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md) for a tour of the app page.

---

## Prerequisites

Before you register your first app, have:

- **Whiteout AI admin** access
- **An idea of the app's shape**: where it runs, which model host it calls, and whether staff use it in a browser
- **Optional: a resource policy group** for the app, created under **Infrastructure** (see [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md#step-1--create-a-resource-policy-group)). You can start without one in monitor-only mode and add it later
- **Optional: an OpenID Connect identity provider** connected under **Integrations**, if you want the app judged with each employee's own policies (see the [SSO provider guides](./sso-providers/okta.md))
- **For the developers who connect the app:** outbound HTTPS from the app to your Whiteout API URL. The wizard's snippets are pre-filled with the right URL

---

## Where Each Method Is Documented

| Method | Guide |
|--------|-------|
| Guard API | [Guard API Reference](./custom-ai-apps/guard-api.md) |
| Python / Node SDK | [SDK Integration](./custom-ai-apps/sdk-integration.md) |
| Auto-instrumentation, Kubernetes webhook, OpenTelemetry | [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md) |
| LiteLLM, Portkey, Cloudflare, Azure API Management, any gateway | [Gateways](./custom-ai-apps/gateways.md) |
| Browser extension, Bedrock Guardrail, infrastructure agent | [Browser, Bedrock and Infrastructure Coverage](./custom-ai-apps/browser-bedrock-infrastructure.md) |

---

## Known Limits

- **Replies can't be un-streamed.** When a reply is streamed to the user as it's generated, text already shown can't be taken back. The SDKs hold streams until the reply passes by default; see [SDK Integration](./custom-ai-apps/sdk-integration.md#streaming).
- **No redaction verdict for app-policy apps.** The Guard API returns allow, warn or block. It does not return a rewritten prompt for apps governed by a policy group.
- **Visibility-only methods can't block.** OpenTelemetry and the infrastructure agent record calls after they happen.
- **Bypass detection needs the traffic to be visible.** Whiteout can only mark an app **Degraded** if it sees calls to the app's model host, and only for hosts that aren't shared public AI providers (see [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md#coverage-proof-and-bypass-detection)).
- **Desktop apps** can't be covered self-serve. Send a coverage request.

---

## Related Guides

- [Register an App](./custom-ai-apps/setup-wizard.md): the setup wizard, step by step
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md): what gets checked, and what your app receives
- [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md): app pages, keys, requests and FAQ
