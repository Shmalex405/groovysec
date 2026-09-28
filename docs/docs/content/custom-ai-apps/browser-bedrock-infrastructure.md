# Browser, Bedrock and Infrastructure Coverage

Three coverage methods don't use an app key: the **browser extension** for internal web chats, the **Bedrock Guardrail** for apps calling AWS Bedrock directly, and the **infrastructure agent** for monitoring workloads without touching their code. This guide sets up each one.

| Method | Blocks prompts | Blocks replies | Whose policy applies |
|--------|---------------|----------------|----------------------|
| [Browser extension](#browser-extension) | Yes (prompts, pastes, uploads) | No | Each employee's own group policies, as on ChatGPT |
| [Bedrock Guardrail](#bedrock-guardrail) | Yes, enforced by AWS | Yes, enforced by AWS | Your Whiteout-managed Bedrock guardrail |
| [Infrastructure agent](#infrastructure-agent) | No, monitor only | No | The policy group of the agent's enrollment token, in record mode |

You can add any of these in the wizard's **Coverage method** step, or later from the app's **Setup** tab with **Add a method**.

---

## Browser Extension

The Whiteout browser extension can govern an internal web chat, such as `https://chat.corp.example.com`, the same way it governs ChatGPT or Claude: prompts, pastes, drag-and-drop and file uploads are checked before they're sent, and blocked content never leaves the page.

### Prerequisites

- The app has at least one **web address** (starting with `https://`). Add one with **Edit** on the app page if it doesn't. The browser method can't be added without it
- Staff run the **Whiteout AI browser extension 1.9.0 or later** on Chrome, Edge or Firefox, signed in to your organisation (see [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md) for force-installing it)

### Set it up

1. Add the **Browser extension** method: pick it in the wizard, or on the app's **Setup** tab click **Enable** on the banner *This app has a web URL. Turn on browser-extension coverage…*, or use **Add a method**.
2. The **Browser extension** card lists the **Covered pages** (your web addresses).
3. Tell staff to do this once: click the Whiteout icon in the browser toolbar and choose **Enable Whiteout on internal AI sites**. The browser asks them to allow access to these pages only.
4. Coverage turns **live** on the first prompt Whiteout checks on the site.

Extensions pick up new or changed web addresses within a few minutes, and whenever the user signs in.

> **The one-time enable can't be pre-granted.** Browsers don't let enterprise policy grant an extension's optional site access in advance, so each person clicks **Enable Whiteout on internal AI sites** once. Until they do, the extension doesn't run on the site. Include the step in your rollout message.

### How prompts are judged

Prompts typed into the internal chat are judged exactly as on public AI sites: with the **signed-in employee's own group policies**, and with the same block and warning overlays. In an [audit-only organisation](./governance/audit-only-mode.md) nothing is blocked, as on public AI sites. They're logged with the app's name and appear in Prompt Review and AI Activity. The app's resource policy group doesn't apply to this method.

The extension checks what users send. It doesn't check the chat's replies. To check replies, cover the chat's backend as well, for example with the [SDK](./custom-ai-apps/sdk-integration.md) or [auto-instrumentation](./custom-ai-apps/zero-code-coverage.md#auto-instrumentation).

### Selector hints (optional)

Whiteout finds the prompt box and send button on most chat pages by itself. If your chat's page is unusual, give it CSS selectors on the **Browser extension** card:

| Field | Example |
|-------|---------|
| **Prompt box** | `textarea#prompt` |
| **Send button** | `button[data-testid=send]` |
| **File upload input** | `input[type=file]#attach` |

Click **Save selectors**. Each selector must be valid CSS and at most 300 characters. Selectors are only used to locate elements on the page; they are never run as code. Browsers pick up the change within a few minutes.

### When the page changes

If a redesign of your chat means the extension can't find the prompt box, send button or file input, it reports this to Whiteout. The method turns **stale**, and the **Browser extension** card shows a warning naming the element it couldn't find. Add or update a selector hint; coverage turns live again on the next checked prompt. You can also use **Request help from Groovy** on the app page.

---

## Bedrock Guardrail

For apps that call AWS Bedrock models directly, Bedrock itself can enforce your Whiteout policy. Whiteout translates your policy library into a native Bedrock guardrail, your app passes that guardrail on each call, and AWS blocks violating prompts and replies inline. The results reach Whiteout through the Bedrock invocation-log ingest and are recorded against the app.

> **Audit-only organisations.** AWS applies a guardrail whenever the app passes it, so audit-only mode can't switch this blocking off. If your organisation runs in [audit-only mode](./governance/audit-only-mode.md) and nothing should be blocked, don't pass the guardrail in the app's Bedrock calls. The other coverage methods don't block in audit-only mode.
>
> In audit-only mode the **Guardrail** choice on the method card is greyed out under a banner that reads *"**Audit-only mode** — Choosing a Bedrock guardrail needs policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement. The IAM roles below stay editable."* A guardrail isn't selected for you, and changing the guardrail through the API is rejected with HTTP 403. Registering, syncing and attaching guardrails under **Infrastructure → Bedrock Guardrails** are locked too; see [AWS Bedrock](./integrations/aws-bedrock.md#audit-only-mode).

### Prerequisites

- **Invocation Log Ingest** and **Whiteout-Managed Guardrails** set up for the AWS account and region, and a guardrail published. See [AWS Bedrock Integration](./integrations/aws-bedrock.md) (Options 2 and 3)
- The IAM roles the app runs as, if it uses InvokeModel or Bedrock Agents

If no guardrail is published yet, the card shows *No Whiteout guardrail is published for your AWS account yet. Publish one under Infrastructure → Bedrock first*, with a **Set up Bedrock** button.

### Set it up

1. Add the **Bedrock Guardrail** method (the wizard recommends it for **App on AWS Bedrock**).
2. In **Guardrail**, choose your organisation's guardrail. Each option shows the AWS account, region, guardrail ID and version, or *not synced yet*. If there's only one, it's selected for you.
3. The card shows the guardrail's **ID**, **Version** and region, and a snippet for your developers:

```python
import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
reply = bedrock.converse(
    modelId=MODEL_ID,
    messages=messages,
    guardrailConfig={"guardrailIdentifier": "<guardrail id>", "guardrailVersion": "<version>"},
    requestMetadata={"whiteout_app": "support-assistant"},   # binds the call to this app in Whiteout
)

# Checking text outside a model call (for example retrieved documents):
bedrock.apply_guardrail(guardrailIdentifier="<guardrail id>", guardrailVersion="<version>",
                        source="INPUT", content=[{"text": {"text": document}}])
```

4. Under **How calls are tied to this app**, list the **IAM roles** the app runs as, one per line, as a role ARN (`arn:aws:iam::111122223333:role/support-bot`) or role name. Up to 20.
5. Click **Save**.

### How calls are tied to the app

One Whiteout guardrail serves every app in an AWS account and region, so the guardrail alone can't tell apps apart. Whiteout binds each call to an app in this order:

1. **`requestMetadata`** `whiteout_app` on Converse calls, set to the app's slug as in the snippet
2. The **IAM role** that made the call, matched against the roles you listed. Calls from an assumed-role session match their role
3. Otherwise the call isn't bound to this app

Use the IAM role list for InvokeModel calls and Bedrock Agents, which can't carry `requestMetadata`.

Calls usually appear on the app's page within a few minutes, labelled **Bedrock**.

---

## Infrastructure Agent

The Whiteout infrastructure agent can run as a sidecar next to your app and record each model call against it. It's **monitor only**: it never blocks. Use it for visibility while you plan enforcement, or for workloads you can't change.

### Prerequisites

- An **enrollment token** from **Infrastructure → Enrollment**, bound to the resource policy group that should evaluate these calls (see [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md))
- Access to the Whiteout agent container image. It's distributed by Groovy Security: click **Request image access** on the card, and Groovy Security will share the registry details for your account

### Set it up

1. Add the **Infrastructure agent** method.
2. Store the enrollment token as a Kubernetes secret:

   ```bash
   kubectl create secret generic whiteout-agent --from-literal=token=<enrollment token>
   ```

3. Add the sidecar from the **Infrastructure agent** card to your app's pod spec. `WHITEOUT_APP_SLUG` ties its traffic to this app:

   ```yaml
   - name: whiteout-agent
     image: <whiteout agent image>          # from Groovy Security
     env:
       - { name: WHITEOUT_MODE, value: tap }
       - { name: WHITEOUT_APP_SLUG, value: support-assistant }
       - { name: WHITEOUT_BACKEND_URL, value: https://<your Whiteout API URL> }
       - { name: WHITEOUT_RESOURCE_TYPE, value: eks_pod }
       - name: WHITEOUT_RESOURCE_ID
         valueFrom: { fieldRef: { fieldPath: metadata.name } }
       - name: WHITEOUT_TOKEN
         valueFrom: { secretKeyRef: { name: whiteout-agent, key: token } }
     ports: [{ containerPort: 8080 }]
   ```

4. Have the app (or its HTTP client hook) post each model call to the sidecar:

   ```
   POST http://127.0.0.1:8080/ingest
   {"request_host": "api.openai.com", "request_body": "...", "response_body": "...", "model": "gpt-4o"}
   ```

5. Coverage turns **live** when the first call is recorded, usually within a few seconds.

Calls are evaluated against the enrollment token's resource policy group and recorded on the app's page, labelled **Infrastructure agent**. The agent also appears on the **Infrastructure** page like any other enrolled resource.

---

## Troubleshooting

### Browser: The Method Stays "Pending"

- Check the user's extension is version 1.9.0 or later and signed in
- Check they clicked **Enable Whiteout on internal AI sites** and allowed access
- Check the page's address matches one of the app's web addresses
- Add selector hints if the prompt box isn't found

### Bedrock: No Calls Appear

- Check invocation logging and the log ingest are working (see [AWS Bedrock Integration](./integrations/aws-bedrock.md#verification))
- Check the calls pass `requestMetadata={"whiteout_app": "<slug>"}` with the app's exact slug, or run as one of the listed IAM roles
- Allow a few minutes for the logs to arrive

### Infrastructure Agent: No Calls Appear

- Check the sidecar is running and its logs show a successful registration
- Check `WHITEOUT_APP_SLUG` matches the app's slug exactly
- Check the app is posting to `http://127.0.0.1:8080/ingest`

---

## Related Guides

- [Register an App](./custom-ai-apps/setup-wizard.md)
- [AWS Bedrock Integration](./integrations/aws-bedrock.md)
- [Infrastructure Agent Quickstart](./infrastructure/agent-quickstart.md)
- [Monitoring and Troubleshooting](./custom-ai-apps/monitoring-and-troubleshooting.md)
