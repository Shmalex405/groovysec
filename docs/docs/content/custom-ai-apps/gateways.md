# Gateways

Many organisations already send their LLM traffic through one gateway, such as a LiteLLM Proxy or Portkey. Add the Whiteout guardrail to that gateway once, and **every app behind it is covered**, with no change to the apps. Whiteout tells the apps apart from what the gateway already knows about each request, and lists each one under Custom AI Apps.

## Overview

| Gateway | How Whiteout plugs in | Status |
|---------|----------------------|--------|
| **LiteLLM Proxy** | The `whiteout-litellm` guardrail package, added in `config.yaml` | Tested against LiteLLM |
| **Portkey** | A webhook guardrail pointing at Whiteout | Built against Portkey's webhook format; verify with your Portkey version |
| **Cloudflare AI Gateway / Workers** | A Worker in front of your model API or AI Gateway | Tested |
| **Azure API Management** | A policy fragment | **Unverified template**: try it on a non-production instance first |
| **Kong AI Gateway** | Not available yet. Use the Guard API directly (see [Any other gateway](#any-other-gateway)) | Planned |
| **Any other gateway** | Call the Guard API before and after each model call | Available |

Each gateway authenticates with a **gateway key** (`wo_gw_<environment>_…`). Unlike an app key, a gateway key can report calls for any app in your organisation. Each call names its app, and an app Whiteout hasn't seen before appears as a **Discovered** app for you to confirm.

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI admin** access
- Admin access to the gateway's configuration
- Optionally, a **resource policy group** for apps you haven't confirmed yet (see [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md#resource-policy-groups))
- Outbound HTTPS from the gateway to your Whiteout API URL

---

## Step 1: Add the Gateway in Whiteout

1. Open **Coverage → Custom AI Apps** and click **Gateways**.
2. Click **Add a gateway**.
3. Fill in the dialog:

| Field | Description |
|-------|-------------|
| **Name** | A name for this gateway, for example `LiteLLM prod` |
| **Gateway** | LiteLLM Proxy, Portkey, Kong AI Gateway, Azure API Management, Cloudflare AI Gateway, or Other gateway. This decides which setup snippet you're shown |
| **Policy for apps you haven't confirmed yet** | A resource policy group, or **No policy — record only** |
| **Until you confirm an app** | **Monitor only — record, never block (recommended)**, or **Enforce the policy above as configured** |
| **Add apps to Custom AI Apps automatically the first time they're seen** | On by default. Off: new app names are listed on the gateway page but not added as apps |

4. Click **Add gateway**.

The gateway's page opens and Whiteout creates its first gateway key for the `prod` environment. The key is shown **once**, in a panel reading **Your prod gateway key — copy it now. It won't be shown again.** Copy it into your secrets manager.

The **Set up the guardrail** card shows the configuration for your gateway type, pre-filled with the key and your Whiteout API URL.

---

## Step 2: Configure the Gateway

### LiteLLM Proxy

Install the guardrail package where the proxy runs (Python 3.9+), and set the key and URL:

```bash
pip install whiteout-litellm
export WHITEOUT_GATEWAY_KEY=wo_gw_prod_xxxxxxxxxxxxxxxx
export WHITEOUT_BASE_URL=https://<your Whiteout API URL>
```

Add the guardrail to the proxy's `config.yaml`:

```yaml
guardrails:
  - guardrail_name: whiteout
    litellm_params:
      guardrail: whiteout_litellm.WhiteoutGuardrail
      mode: [pre_call, post_call]
      api_key: os.environ/WHITEOUT_GATEWAY_KEY
      api_base: os.environ/WHITEOUT_BASE_URL
      default_on: true
```

Restart the proxy. What happens on each request:

- **Before the model call**: the prompt, system prompt and tool results are checked. Tool turns quarantined by Prompt Injection Defense are replaced before the model sees them
- **After the call**: the reply is checked. Streams are held until the reply passes
- **A block** reaches the caller as LiteLLM's usual guardrail error (HTTP 400)

**Which app a request belongs to** is taken, in order, from the request's `metadata.app`, then the LiteLLM team alias, the key alias, then the team ID. The simplest way to name apps is one LiteLLM virtual key or team per app.

| Variable | Default |
|----------|---------|
| `WHITEOUT_GATEWAY_KEY` | Required. Without it, requests pass through ungoverned and an error is logged |
| `WHITEOUT_BASE_URL` | Whiteout's hosted API |
| `WHITEOUT_SCAN` | `user,system,tool` |

### Portkey

In Portkey, open **Guardrails** and create a **Webhook** guardrail. Add it as both an **input** and an **output** guardrail on your config:

```
Webhook URL:  https://<your Whiteout API URL>/v1/guard/portkey
Headers:      {"Authorization": "Bearer wo_gw_prod_xxxxxxxxxxxxxxxx"}
Timeout:      10000
```

Portkey sends each request (and, after the call, the reply) to Whiteout, and Whiteout returns a verdict: a block becomes a failed guardrail check in Portkey. The app is named by the request's Portkey metadata `app` (or `app_ref`); otherwise set an `X-Whiteout-App` header on the webhook.

> **Verify with your Portkey version.** The adapter reads Portkey's webhook payload tolerantly, but test it end to end before relying on it. Portkey's own guardrail settings decide what happens if the webhook times out.

### Cloudflare AI Gateway / Workers

Whiteout provides a Cloudflare Worker (`worker.js`) that sits in front of your model API or Cloudflare AI Gateway. Ask Groovy Security for the Whiteout gateways pack if you don't have it.

```bash
wrangler secret put WHITEOUT_GATEWAY_KEY        # paste wo_gw_prod_…
```

```toml
# wrangler.toml
[vars]
WHITEOUT_BASE_URL = "https://<your Whiteout API URL>"
UPSTREAM_URL      = "https://gateway.ai.cloudflare.com/v1/<account>/<gateway>/openai"   # or https://api.openai.com
WHITEOUT_FAIL     = "open"          # "closed" to refuse calls when Whiteout is unreachable
```

Point your apps' base URL at the Worker instead of the provider. For each chat completions, Responses or Messages call, the Worker:

- Checks the prompt before forwarding it. A block returns HTTP 400 with a `whiteout_blocked` error
- Checks non-streaming replies before returning them. A block returns HTTP 400 instead of the reply
- Passes streams straight through and records their text afterwards (streamed text can't be recalled)

Apps name themselves with an `x-whiteout-app` request header, or `metadata.app` in the request body; otherwise the Worker's `WHITEOUT_APP_REF` variable is used. Optional: `WHITEOUT_TIMEOUT_MS` (default 10000).

### Azure API Management

Whiteout provides a policy fragment (`whiteout-guard.policy.xml`) for the API that fronts your model endpoint, such as Azure OpenAI. Ask Groovy Security for the gateways pack if you don't have it.

> **Unverified template.** Validate it on a non-production APIM instance first. Import it through the portal, Bicep or the Azure CLI, not a generic XML tool.

1. Create two **Named values**: `whiteout-base-url` (your Whiteout API URL) and `whiteout-gateway-key` (the gateway key, marked **secret**).
2. Add the fragment's `<inbound>` and `<outbound>` sections to the policy of the API in front of your model.

The inbound section sends the request's messages to Whiteout and returns HTTP 400 on a block. The outbound section checks non-streaming replies and returns HTTP 400 instead of a blocked reply. The app is the APIM **product** name, else the subscription name; edit the `X-Whiteout-App` expression to use your own attribution. As shipped the fragment fails open; the template's comments explain how to fail closed.

### Any Other Gateway

Any gateway that can make an HTTP call can use the [Guard API](./custom-ai-apps/guard-api.md) directly: call `POST /v1/guard/input` before the model and `POST /v1/guard/output` after it, with the gateway key as a bearer token and the app's name in `X-Whiteout-App`:

```bash
curl -s https://<your Whiteout API URL>/v1/guard/input \
  -H "Authorization: Bearer wo_gw_prod_xxxxxxxxxxxxxxxx" \
  -H "X-Whiteout-App: support-bot" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "..."}]}'
```

---

## Step 3: Review Discovered Apps

Send a request through the gateway. On the gateway's page, **Apps seen through this gateway** lists every app name the gateway has sent:

| Column | Description |
|--------|-------------|
| **Seen as** | The name the gateway reported (for example a LiteLLM team alias) |
| **App** | The Custom AI App it counts as, with a link |
| **Status** | **Discovered** (added, not confirmed), **Confirmed**, **Not added** (automatic discovery was off or a limit was reached) or **Ignored** |
| **Calls** | Calls seen with this name |
| **Last seen** | When it was last seen |

Actions on each row:

- **Confirm**: gives the app its own policy. The dialog asks for the **App name** and a **Policy group** (or **No policy — monitor only**). Click **Confirm app**. From then on the app uses its own policy instead of the gateway's default.
- **Merge…**: the name is a duplicate of an app you've already registered. Pick the **App**; calls sent under this name count as that app and use its policy, and the discovered duplicate is removed.
- **Assign…**: for a **Not added** name, link it to an existing app.
- **Ignore**: stop treating the name as an app. Its calls keep using the gateway's default policy. **Restore** undoes it.

The **Custom AI Apps** list shows a banner while discovered apps are waiting, and each discovered app carries a **Discovered via a gateway** chip. Its app page explains that it's running on the gateway's default policy until confirmed.

### Discovered apps

Until you confirm a discovered app:

- It runs on the gateway's **Policy for apps you haven't confirmed**, in **monitor** mode unless you chose **Enforce the policy above as configured**
- Calls that don't name an app, and calls under ignored names, also use this policy. They aren't listed under any app
- It appears with the status **Discovered** and can't use employee policies

To prevent a misconfigured gateway (for example one that sends a request ID as the app name) from flooding your app list, at most **25** new apps are added per gateway per day, and no more than 200 apps in total per organisation.

---

## Managing a Gateway

The gateway's page also has:

- **Discovery**: change **Add new apps to Custom AI Apps automatically**, **Policy for apps you haven't confirmed** and **Until you confirm an app** at any time.
- **Gateway keys**: each key's prefix, environment, last use and status. Click **New key** to create one (two active keys per environment, so you can deploy a new key before revoking the old one), and **Revoke** to disable one immediately.
- **Manage → Remove gateway**: its keys stop working immediately. Apps it discovered stay in Custom AI Apps.

The **Gateways** list shows each gateway's type, number of apps (with a **N to review** chip for unconfirmed ones), number of active keys (**No key** if none) and last call.

On each app's page, calls through a gateway are labelled **Gateway**, and the app shows a **Gateway** coverage method.

---

## Troubleshooting

### No Apps Appear on the Gateway Page

- Check the gateway can reach your Whiteout API URL, and the key is set. LiteLLM logs *WHITEOUT_GATEWAY_KEY is not set — requests through this proxy are NOT governed* when it's missing
- Check the gateway key hasn't been revoked (**Gateway keys** card)
- Check the requests carry an app name. Calls without one are governed by the gateway's default policy but not listed under any app

### Every Request Shows Up as One App

The gateway is sending the same name for every request. For LiteLLM, give each app its own team or virtual key, or set `metadata.app` per request. For Cloudflare, set the `x-whiteout-app` header per app.

### Too Many Discovered Apps

The gateway is sending a changing value (such as a request ID) as the app name. Fix the attribution, then **Ignore** or **Merge…** the extra names. Turn off automatic discovery while you do.

### Calls Aren't Blocked

- Discovered apps run in monitor mode until confirmed, unless you chose to enforce
- Check the confirmed app's policy group is in `enforce` mode
- Streaming replies aren't blocked by the Cloudflare Worker or Azure API Management fragment

---

## Related Guides

- [Guard API Reference](./custom-ai-apps/guard-api.md): the API every gateway plugin calls
- [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md): policies and fail behaviour
- [Zero-Code Coverage](./custom-ai-apps/zero-code-coverage.md): covering apps that don't use a gateway
