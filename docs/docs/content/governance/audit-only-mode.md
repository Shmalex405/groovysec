# Audit-Only Mode

**Audit-only mode** gives your organization full visibility into how people and systems use AI, without enforcing policy. Every prompt, file and AI interaction that Whiteout AI captures is still logged and shows up in your dashboards, but **nothing is ever blocked**. Audit-only mode is also called the **Discovery tier**.

In audit-only mode, the compliance engine doesn't check the content of prompts and files, and Prompt Injection Defense is off. Every other Whiteout check still runs, such as model and provider rules, AI Applications rules and connector vetting. Each one records what it *would* have done, but none of them blocks, redacts, quarantines, rate-limits or warns. Settings that need the compliance engine, or that exist only to block, are view only; see [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode).

Audit-only mode is set for your whole organization. You can't turn it on for some groups and off for others. Groovy Security sets it as part of your subscription, and the admin app shows it in a few places, described below.

## Who audit-only mode is for

| Situation | Why audit-only fits |
|-----------|---------------------|
| **Visibility-first rollout** | Deploy Desktop Guard, the browser extension and the IDE plugins across the fleet and see real usage before anything can interrupt anyone. Switch to enforcement once you know what your rules should be. |
| **Shadow-AI discovery** | Build an inventory of the AI tools, desktop apps, IDE assistants, local model runtimes and connectors in use across the organization. |
| **Evaluation and pilots** | Show stakeholders what AI activity looks like in your environment, and what your other controls would have stopped, before you commit to enforcement. |
| **A lower-cost tier** | Organizations that need oversight and an audit trail, but not blocking, can stay on audit-only permanently. |

### What audit-only mode is not

- **It isn't a content-policy dry run.** The compliance engine isn't called, so there are no "would have been blocked" results for your **data policies** (PHI, PII, Finance and so on). Prompts are recorded as **Allowed**, with no policy violations. The *other* checks do record what they would have done; see [Where to see what would have been blocked](#where-to-see-what-would-have-been-blocked).
- **It isn't a per-user permission.** The **read-only** admin role limits what one administrator can change. Audit-only mode is an organization setting that applies to everyone, including full administrators.
- **It isn't something admins switch themselves.** On a Groovy-hosted (SaaS) organization, only Groovy Security can change the mode. On a self-hosted deployment, your signed license sets the upper limit (see [Moving between audit-only and full enforcement](#moving-between-audit-only-and-full-enforcement)).
- **It doesn't delete or reset your settings.** Policy settings, Injection Defense settings, AI Applications rules, connector blocks and resource policy groups are all kept exactly as they are, and take effect as soon as enforcement is enabled. Most of them are view only while audit-only mode is on.

---

## What changes and what keeps working

> **Nothing blocks in audit-only mode, on any surface.** Every check except content policy and Prompt Injection Defense still runs and is recorded, so you can see what enforcement would have done. The one exception to "nothing blocks" is the self-protection of the Whiteout defender hooks, described in [Enforcement that audit-only mode doesn't switch off](#enforcement-that-audit-only-mode-doesnt-switch-off).

| Surface | In audit-only mode |
|---------|--------------------|
| **Policies page** | View only. The page opens, and you can choose a group and expand each policy category to read the catalog. Every control that would change enforcement is disabled, and so is **Request Custom Policy**. See [The Policies page](#the-policies-page). |
| **Prompt Review** | Works as normal: search, filters, prompt details. A blue banner says enforcement isn't enabled. Every captured prompt shows as **Allowed**, and **Policy Violation** reads **None**. |
| **Chat** (in the desktop app) | Works as normal, including file attachments. The **Checking compliance** and **Compliance passed** status indicators are hidden because no compliance check runs. Nothing is blocked. |
| **Browser extension** | Keeps capturing prompts, pastes, drops and file uploads on supported AI sites and reporting them. Prompts and files are always allowed, with no block or redaction dialog. AI Applications blocks and **Block External AI** connector blocks aren't applied: every AI site and connector stays usable. |
| **Desktop Guard** | Keeps watching supported desktop AI apps and reporting activity. Prompts and file drops are always allowed. AI Applications and connector blocks aren't applied, and private-browsing enforcement is switched off. |
| **IDE plugins and coding-agent hooks** (VS Code, JetBrains, Claude Code, Codex and others) | Keep reporting prompts and agent activity. Pre-send checks always allow, and the transcript audit doesn't flag anything. A block on VS Code's built-in chat under AI Applications isn't applied, and the VS Code **Pre-send gate** switch is view only. Prompt-injection scans don't run. |
| **Infrastructure agent** | Keeps monitoring and reporting AI calls from your workloads. Agents are sent a non-blocking configuration: `monitor` mode, fail open, and no provider blocklist, model allowlist, token budget or rate limit. Checks that would have blocked a call are recorded against the activity, which is never marked as blocked. |
| **SDKs, gateways and Custom AI Apps** | Every call returns `allow` in `monitor` mode and fails open. Model, provider and token checks and AI Applications rules still run, and the response says what they would have done. Prompt Injection Defense doesn't run. An app's or gateway's policy group, "whose policies apply" and Bedrock guardrail choice are view only. See [Custom AI Apps: audit-only organisations](./custom-ai-apps/policies-and-identity.md#audit-only-organisations). |
| **Prompt Injection Defense** | **Off**, whatever its own switch says. Nothing is scanned on any surface, and no detections, alerts or SIEM events are recorded or sent. The page is view only: the settings are greyed out and **Test the detector** is disabled. Past detections stay readable, and your saved settings resume when enforcement is enabled. See [Injection Defense in audit-only mode](./injection-defense/configuration.md#audit-only-mode). |
| **Whiteout AI Connector** | Content is vetted against your connector policy set as usual, but served **unredacted**, and what would have been withheld is recorded. Access rules that stop internal or external AI from reading a source are recorded but not applied. Vetting uses document metadata and patterns only, because documents aren't classified by the compliance engine: classification scans wait until enforcement is enabled. Policy sets, document availability overrides and re-evaluation are view only. Tool results aren't scanned for prompt injection. See [Connector Policy](./whiteout-ai-connector/connector-policy.md#audit-only-mode). |
| **File uploads and scans** | Files are logged and kept for review as usual, and always approved. The content check doesn't run. If a file safeguard would have refused the file (an unsupported file type, a file that couldn't be read, or a file with no extractable text), the record says so. |
| **Redaction** | Not available. Redaction is only offered when a prompt is blocked, and nothing is blocked in this mode. |
| **Accountable Override** | The per-group switch on the Policies page is disabled, and the server rejects changes to it. No prompt is blocked, so nobody is ever offered an override. The switch's saved setting doesn't change. |
| **AWS Bedrock Guardrails** | Registering, syncing and attaching a Whiteout-managed guardrail are refused, because AWS would enforce it inline. **Detaching** and deleting still work. See [AWS Bedrock](./integrations/aws-bedrock.md#audit-only-mode). |
| **Mobile policies** | Creating, changing and pushing mobile AI block policies are refused, because they would block apps or domains on devices. |
| **Dashboard, AI Activity, IDE Activity, Token Usage** | Fully working. These are the main value of audit-only mode. Counts of blocked prompts will be zero. |
| **AI Footprint, Enrollment, Managed Devices, Infrastructure, People** | Fully working. Discovery, coverage and per-user usage are unaffected. A few settings on these pages are view only: the compliance fail-open switch and private-browsing exceptions on **Enrollment**, mobile block policies on **Managed Devices**, and the enforcement settings of resource policy groups and Bedrock guardrails on **Infrastructure**. See [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode). |
| **Integrations** | SSO and identity providers, MDM, SOC destinations and data integrations can be set up and changed as usual. Settings that only block are view only: AI Applications allow/block rules, **Block External AI** and the per-group external-AI access switch, the VS Code pre-send gate, and the Whiteout AI Connector's policy sets and document availability overrides. They're kept, and apply once enforcement is enabled. |
| **SOC destinations** | Prompt events are still delivered, marked as not blocked. Connector vetting events are still sent when content would have been withheld, marked `enforced: false`. No prompt injection detection events are sent, because Injection Defense is off. |
| **Notifications** | Coverage, device and system alerts keep working, and so do connector alerts (see [Where to see what would have been blocked](#where-to-see-what-would-have-been-blocked)). Injection Defense alerts don't fire, because it's off. Alerts that depend on a blocked prompt or a content-policy violation don't fire, because neither happens. |
| **Audit Log** | Fully working. Tier changes are recorded here. See [Audit trail](#audit-trail). |
| **Groups, users, roles, reports** | Unchanged. You can still manage groups and administrators and schedule reports. |

### Where to see what would have been blocked

Checks other than the compliance engine and Prompt Injection Defense keep running and record what they would have done. That's a good way to preview what enforcement will do before you switch it on.

| Where | What you'll find |
|-------|------------------|
| **Coverage → Custom AI Apps** → an app → **Activity** | Calls that a model, provider or token check would have blocked or warned about show as **Flagged**, with the rule that matched. For apps that use employee policies, a call from a group the app is blocked for is allowed, and the call details record the AI Applications rule that would have blocked it. |
| **Coverage → Infrastructure** → **Activity** | Calls that a provider, model or token check would have blocked are recorded with the rule that matched, and aren't marked as blocked. |
| **Activity → AI Connector** | A **Would Block (audit-only)** tile counts the calls whose content would have been withheld, with how many items were served in full. Those events show **Would block (audit-only)** (a verdict you can filter on), and never count as blocked. Each vetting record carries `enforced: false`. Reads that an access rule would have refused get an extra audit record reading *"AUDIT_ONLY (not enforced): …"*. |
| **Governance → Prompt Review** | File uploads that a file safeguard would have refused read *"File upload approved (audit-only mode; would have blocked: …)"*. |
| **Alerts & Audit → Notifications** | Connector alerts titled *"Connector content would have been blocked (audit-only) — …"*, whose text ends *"Served in full (audit-only mode)."* |
| **Your SIEM** | Connector vetting events for reads that would have been withheld. Their `vetting` object carries `enforced: false`, `suppressed_by: "AUDIT_ONLY"` and `would_block: true`. |

Content-policy violations and prompt-injection detections don't appear anywhere, because neither the compliance engine nor Prompt Injection Defense runs. Browser extension and Desktop Guard activity on an AI app or connector you've blocked is captured like any other activity, but isn't marked as "would have been blocked". Filter **AI Activity** or **Prompt Review** by that tool to see how much it's used.

### Enforcement that audit-only mode doesn't switch off

Audit-only mode stops Whiteout from blocking anything. It can't remove enforcement that runs outside Whiteout's control, and it reaches each client when that client next checks in:

- **Clients pick up the change on their next policy check.** Checks made on the Whiteout backend (Guard API verdicts, connector vetting, Injection Defense, file uploads) and the settings locks change on the very next request. The browser extension, Desktop Guard, the IDE plugins, the SDKs and the infrastructure agent cache their block lists and settings, and pick up the non-blocking versions within seconds to minutes. A device that is offline keeps its last lists until it reconnects.
- **Bedrock guardrails that are already attached** keep blocking at AWS until you detach them under **Infrastructure → Bedrock Guardrails**.
- **MDM browser profiles** that turn off or gate private browsing (Chrome Incognito, Edge InPrivate), and **mobile policies already pushed** to devices, stay in force until you remove them in your MDM.
- **Gateways and apps that fail closed on their own.** A Cloudflare Worker with `WHITEOUT_FAIL = "closed"`, an Azure API Management fragment you changed to fail closed, Portkey's own guardrail timeout settings, and code that forces fail-closed (for example `fail_open=False` in an SDK) still refuse calls when Whiteout can't be reached.
- **Defender hook self-protection.** The defender hooks Whiteout installs for coding agents still refuse commands that tamper with the hooks' own files or process.

---

## What administrators see

These visual cues appear in **desktop app 2.86.3 and later**. Earlier versions show some of them (see [Troubleshooting](#troubleshooting)). The dimmed **Injection Defense** item and the locks described in [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode) need **desktop app 2.86.4 or later**. With an older app those settings may look editable, but the server still rejects changes to them.

### Sidebar

In the sidebar under **Governance**, the **Policies** and **Injection Defense** items are dimmed:

- With the sidebar **expanded**, the row is faded and a small **lock icon** appears to the right of the label.
- **Hovering** over the row, with the sidebar expanded or collapsed, shows the tooltip **"Audit-only mode — view only"**.
- The rows still work. Clicking one opens the page so you can review it.

Every other sidebar item looks and works as normal. Pages with only some locked settings, such as **Infrastructure**, **Custom AI Apps** and **Integrations**, aren't dimmed; the locked settings are greyed out in place (see [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode)).

### The Policies page

At the top of the page, under the **Policies** header and the **Select Group** menu, an information banner with a lock icon reads:

> **Audit-only mode** — Policy management needs policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement.

Everything below the banner is shown in grey at reduced opacity, so it's clearly inactive.

| Element | State |
|---------|-------|
| **Select Group** menu | Works. Switch groups to see how each group is configured. |
| **Compliance Frameworks** checkboxes | Disabled. You can read which frameworks are selected but can't change them. Hovering a framework still shows its description. |
| **Accountable Override** switch ("Allow users in this group to override blocked prompts and uploads with a written justification") | Disabled. It still shows the group's saved setting. |
| Policy categories (for example **PHI Policies**) | You can still expand and collapse them with the arrow button. The **N/M active** counter is still shown. |
| **Select All Internal** / **Select All External** | Disabled. |
| Per-policy **Apply to Internal** / **Apply to External** checkboxes | Disabled. Their checked state shows what will be enforced when enforcement is turned on. |
| **Save Changes** | Doesn't appear. No changes can be staged. |
| **Request Custom Policy** (the round help button in the bottom-right corner) | Disabled. Hovering over it shows **"Audit-only mode — custom policies need policy enforcement"**. |

The page is locked on the server as well as in the app. If a policy change, an Accountable Override change or a custom policy request is sent to the backend by any route, such as an older app version or a script, it's rejected with HTTP 403 and the message *"Policy enforcement is not included in this tier (audit-only / discovery)."* Reading the settings still works. When a policy save is rejected, the app shows **"Failed to save changes — Policy enforcement is not included in this tier (audit-only / discovery)."**

The same 403 message is returned for every other locked setting; see [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode).

### Prompt Review

Under **Governance → Prompt Review**:

- The page subtitle changes to **"Audit and review all AI prompts and responses captured across your organization."** With enforcement on, it reads "Audit and review all AI prompts, responses, and policy enforcement actions."
- A blue banner reads:

  > **Audit-only mode** — policy enforcement is not enabled for your organization, so prompts and files are logged for visibility but nothing is blocked. Contact your account team to enable enforcement.

- Prompts captured in audit-only mode show as **Allowed**. The **Blocked** and **Flagged** filters return nothing for this period. In the prompt details, **Policy Violation** reads **None**.

### The AUDIT_ONLY marker

Records of something that audit-only mode stopped from acting carry the marker `AUDIT_ONLY`:

- Text fields read *"AUDIT_ONLY (not enforced): \<what would have happened\>"*, for example on a file upload that would have been refused, or on a connector read that an access rule would have denied.
- API responses and structured records carry `suppressed_by: "AUDIT_ONLY"`, together with `enforced: false` and `would_action` (what the check asked for, such as `block`, `quarantine` or `warn`).

Responses where no check would have acted simply come back as allowed, with no marker.

### Chat

When you use **Chat** in the desktop app, the **Checking compliance** and **Compliance passed** status steps are hidden. The indicator goes straight to the steps that follow, such as **Thinking** and **Generating response**. **Blocked by policy** never appears.

### End users

Users of the browser extension, Desktop Guard and IDE plugins don't get a separate audit-only notice. They simply never see a block, redaction or override prompt, and AI apps and connectors you've blocked stay usable. Their activity is still captured and reported as normal.

---

## Settings locked in audit-only mode

Settings that need the compliance engine, or that exist only to block, are **view only** in audit-only mode, the same way as the Policies page. You can open and read them, but you can't change them. They're kept exactly as they are and apply once enforcement is enabled.

Each locked area shows the same information banner with a lock icon:

> **Audit-only mode** — \<feature\> needs policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement.

Some banners add a sentence about what still works. The locked controls below the banner are greyed out and disabled. Settings on the same page that don't enforce anything stay editable, and so do removals and clean-up, such as deleting a group, detaching a guardrail or revoking an exception.

| Page | Locked (view only) | Still editable |
|------|--------------------|----------------|
| **Governance → Policies** | Compliance Frameworks, **Apply to Internal** / **Apply to External**, **Select All**, Accountable Override, **Request Custom Policy** | **Select Group**, expanding policy categories to read them |
| **Governance → Injection Defense** | Every setting, adding suppressions, **Test the detector**. **Revoke** is disabled in the app too, although the server still accepts a revoke. | Reading the **Overview**, **Audit log** and **Detectors** tabs, opening past scans, recording verdicts, exporting, **Verify now** |
| **Coverage → Infrastructure → Resource Policies** | **Enforcement**, **On Failure**, **Evaluate tool calls**, **Infrastructure Rules** (blocked providers, allowed models, max tokens per call, rate limit), **Content Policies**, **Compliance Engine (Premium)** and its connection test | Name, description, **Data Capture**, **Classification**, alerting (**Alert On**, **Alert Destinations**). You can create new groups; they start with the default enforcement settings (`monitor`, fail open, no rules). Deleting a group. |
| **Coverage → Infrastructure → Bedrock Guardrails** | **Register guardrail**, sync, **Attach agent** | Detaching and deleting a guardrail |
| **Coverage → Custom AI Apps** → register an app | The **Which policy should apply?** step: the app is registered with no policy | Every other step |
| **Coverage → Custom AI Apps** → an app | **Policy group**, whose policies apply (the app's group or each employee's groups), the Bedrock guardrail choice | Token audiences, identity settings, keys, the Bedrock IAM roles, name and owner |
| **Coverage → Custom AI Apps → Gateways** | The policy for apps you haven't confirmed yet, **Until you confirm an app**, and the policy group when you confirm an app. New gateways use no policy and monitor. | Creating a gateway, automatic discovery, confirming apps (with no policy), keys |
| **Integrations → AI Applications** | Allowing and blocking applications (per group and globally). The accordion shows *(N would be blocked — audit-only)*. | Everything else on the page |
| **Integrations** → a data integration | **Block External AI**, and the per-group **external AI** access switch | Connecting and enabling the integration, internal AI access |
| **Integrations** → IDE assistants | The VS Code **Pre-send gate** switch | Everything else |
| **Integrations → Whiteout AI Connector** | Connector policy sets (creating, renaming, choosing policies, assigning a set to a source), document availability overrides, the scan step of the expose wizard and scan progress (scans wait until enforcement is enabled). **Re-evaluate** is hidden. | Connecting sources, exposing them to the connector, reading existing classifications |
| **Coverage → Enrollment** | The **Compliance Enforcement** fail open / fail closed switch, granting a private-browsing exception | Revoking a private-browsing exception, everything else |
| **Coverage → Managed Devices** | Mobile AI block policies: choosing blocked apps and domains, saving, pushing to your MDM | Viewing devices and policies |

These settings are locked on the server too, so an older app version, a script or a direct API call can't change them. The following writes return HTTP 403 with *"Policy enforcement is not included in this tier (audit-only / discovery)."*:

| Area | Rejected with 403 |
|------|-------------------|
| Policies | Every policy change under `/restrictions`, `PATCH /admin/groups/{id}/override-settings`, `POST /admin/policy-request` |
| Injection Defense | `PUT /injection/settings`, `POST /injection/suppressions` |
| Resource policy groups | `POST /admin/infra/resource-policies` and `PATCH /admin/infra/resource-policies/{id}` when a locked field is set or changed, `PATCH /admin/infra/resource-policies/{id}/content-policies` when the policies change, `POST /admin/infra/resource-policies/{id}/test-connection` |
| Bedrock guardrails | `POST /admin/bedrock/guardrails`, `POST /admin/bedrock/guardrails/{id}/sync`, `POST /admin/bedrock/guardrails/{id}/attach` |
| Custom AI Apps | `POST /custom-apps` with a policy group, `PATCH /custom-apps/{id}` when the policy group or whose policies apply changes, `POST /custom-apps/{id}/methods` when the Bedrock guardrail changes |
| Gateways | `POST /custom-apps/gateways` and `PATCH /custom-apps/gateways/{id}` with a default policy or an unconfirmed-app mode other than monitor, `POST /custom-apps/{id}/confirm` with a policy group |
| AI Applications | `POST /ai-apps/access`, `DELETE /ai-apps/access` |
| Data integrations | `POST /integrations/connector-policies`, `POST /integrations/llm-access` for external access, `POST /integrations/global/group-access` when external access is set |
| IDE assistants | `PATCH /admin/groups/{id}/ide-settings` |
| Whiteout AI Connector | `POST /connector/policy-sets`, `PATCH /connector/policy-sets/{id}`, `POST /connector/policy-sets/{id}/policies`, `POST /connector/exposures/{id}/policy-set`, `POST /connector/policies`, `PATCH /connector/classifications/override`, `PATCH /connector/classifications/override/bulk`, `POST /connector/classifications/reevaluate`, `POST /connector/test-gpu`, `POST /connector/scan-runs/{id}/attach-gpu`, `POST /connector/backfill/{id}` |
| Enrollment | `PUT /admin/org/fail-open-on-compliance-unavailable`, `POST /private-browsing/grants` |
| Mobile policies | `POST /mobile/policies`, `PATCH /mobile/policies/{id}`, `POST /mobile/policies/{id}/push`, `POST /mobile/policies/defaults` |

Where one request carries both locked and editable settings (a resource policy group, a custom app or a gateway), it's rejected only if a locked setting actually changes, so saving an unchanged group with a new name works. Reads are never rejected, and neither are removals: deleting a resource policy group, a mobile policy or a guardrail registration, detaching a guardrail, and revoking a suppression or a private-browsing exception.

---

## Check your organization's current mode

### In the admin app

Your organization is in audit-only mode if **any** of these are true:

- The **Policies** and **Injection Defense** items in the sidebar are dimmed, show a lock when the sidebar is expanded, and show **"Audit-only mode — view only"** on hover.
- The Policies page shows the **Audit-only mode** banner.
- Prompt Review shows the **Audit-only mode** banner. Older desktop app versions show a banner that starts **Discovery tier** instead; it means the same thing.

If none of these appear and the Policies checkboxes can be edited (by an administrator who isn't read-only), your organization is on full enforcement.

### Through the API

Any signed-in user in your organization can read the mode:

```
GET /admin/org/auditonly-mode
```

Send it to your organization's Whiteout AI backend (for example, `https://<your-org-slug>.api.whiteout.groovysec.com/admin/org/auditonly-mode` on SaaS) with a valid `Authorization: Bearer <token>` header. Example response:

```json
{
  "auditonly_mode": true,
  "compliance_enabled": false
}
```

| Field | Meaning |
|-------|---------|
| `compliance_enabled` | **Use this one.** It's the effective answer: `true` means policies are enforced for your organization, and `false` means audit-only. It takes both the organization setting and, on self-hosted deployments, your license into account. |
| `auditonly_mode` | The organization-level setting on its own. On a self-hosted deployment whose license doesn't include full enforcement, this can read `false` while `compliance_enabled` is also `false`. The license wins. |

> **Rule of thumb:** if `compliance_enabled` is `false`, you are in audit-only mode, whatever `auditonly_mode` says.

Custom AI Apps can read the mode too: `GET /v1/guard/config` returns `"auditonly": true` for an audit-only organization.

---

## Moving between audit-only and full enforcement

How you change the mode depends on how Whiteout AI is hosted for you. See [Deployment Models Overview](./deployment/overview.md) if you're not sure.

### Groovy-hosted (SaaS)

Groovy Security manages the mode on SaaS. The admin app has no switch for it, and an administrator can't change it through the API. A request to change it returns HTTP 403 with *"Organization tier is managed by your provider."*

To change modes:

1. Contact your Groovy Security account team or support (support@groovysec.com) and say which direction you want: **audit-only → full enforcement** or **full enforcement → audit-only**.
2. Groovy Security makes the change. When moving to enforcement, it also makes sure the compliance engine is ready for your organization before switching.
3. Checks made on the Whiteout backend change on the **next request**. Endpoints, SDKs and agents pick up their new block lists and settings on their next policy check, usually within seconds to minutes. Nothing needs restarting and nothing needs redeploying.
4. The change is recorded in your **Audit Log** (see [Audit trail](#audit-trail)).
5. In the desktop app, open the **Policies** page again to see the updated state. The locks and banners disappear, or appear, on every page once the app has read the new mode.

### Self-hosted

On a self-hosted deployment, the **signed license** Groovy Security issues controls whether full enforcement is available. The license is authoritative. For how the license and your own setting combine, see [Your license and enforcement tier](./deployment/self-hosted-aws.md#your-license-and-enforcement-tier). The license comes in two tiers:

| License tier | Effect |
|--------------|--------|
| **Full** | Full enforcement is available. Your organization enforces policies unless an administrator has turned audit-only on locally (see below). |
| **Discovery** | Audit-only is forced. No local setting, database change or configuration can turn enforcement on. The **Policies** page stays greyed out and policy changes are rejected with HTTP 403, whatever the local setting says. |

**To move to full enforcement:**

1. Contact your Groovy Security account team to upgrade your license to the full tier.
2. Make sure your deployment is sized to run the compliance engine. Groovy Security support will confirm the settings for your deployment package. Enforcement needs the compliance engine to be running. If it isn't, prompts wait for the engine and are then handled by your organization's compliance-unavailable setting.
3. Wait for the license to be picked up:
   - **Online deployments** check their license in the background, so the change takes effect **within about 15 minutes**. To apply it immediately, restart the Whiteout AI backend service, which forces a fresh license check.
   - **Deployments with intermittent connectivity** pick it up on the next successful license check. Until then, they keep the tier in their most recent signed license token.
   - **Air-gapped deployments** never contact the license service, so they won't see a tier change. Groovy Security will issue you a **new license token** to install in place of the current one.
4. If an administrator turned audit-only on locally in the past, turn it off (see the next section).
5. Confirm that `GET /admin/org/auditonly-mode` returns `"compliance_enabled": true`.

**To move to audit-only:**

- **Keep your full license and turn audit-only on locally.** An administrator can switch the organization to audit-only through the API:

  ```
  PUT /admin/org/auditonly-mode
  Content-Type: application/json

  {"enabled": true}
  ```

  To go back to enforcement, send `{"enabled": false}`. This only works while your license includes full enforcement. Otherwise it's rejected with HTTP 403: *"Full policy enforcement is not included in this license tier."* Both directions require the **admin** role and are recorded in the Audit Log.
- **Move to the Discovery license tier.** Ask your account team. Once the license is picked up (within about 15 minutes online, straight away after a backend restart, or when you install the new token on an air-gapped deployment), audit-only is forced. You can then scale down the compliance engine in your deployment to save on your own infrastructure. Groovy Security support can advise on this.

> **Your local setting can't grant enforcement that your license doesn't include.** On a Discovery license, `compliance_enabled` stays `false` whatever `auditonly_mode` is set to.

### Before you switch to full enforcement: checklist

Once enforcement is on, every enabled policy starts blocking **on the very next request**, and so do your AI Applications and connector blocks and the blocking settings in your resource policy groups. If Injection Defense is switched on in your settings, it resumes scanning with the settings you saved. Every setting that's locked in audit-only mode (see [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode)) becomes editable at the same moment, but not before, so you can't change them in advance. You can only review them. Plan the switch:

1. **Review what would have been blocked.** Go through the records described in [Where to see what would have been blocked](#where-to-see-what-would-have-been-blocked): **Flagged** Custom AI App calls, infrastructure activity, connector vetting and file uploads. Each one shows something that will be blocked, quarantined, withheld or warned about once enforcement is on, so they're a direct preview of the impact. Adjust the settings behind any you don't want stopped.
2. **Review each group's policies.** On the **Policies** page, go through every group in **Select Group**. The checked **Apply to Internal** and **Apply to External** boxes are what will be enforced. Write down what you want to change. Content policies have no would-have-blocked records, because the compliance engine doesn't run in audit-only mode.
3. **Review Compliance Frameworks.** Note which frameworks are selected for each group. Selecting a framework turns on its required policies.
4. **Decide on Accountable Override** for each group, if you want users to be able to override a block with a written justification. It's off unless you turn it on, and it can only be changed after the switch.
5. **Review the other locked settings.** Go through the pages in [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode): Injection Defense actions and suppressions, AI Applications allow/block rules, **Block External AI**, the VS Code pre-send gate, connector policy sets, each resource policy group's enforcement mode, fail behaviour, rules and content policies, Custom AI App and gateway policy groups, the compliance fail-open switch, and mobile block policies. They'll apply exactly as shown from the first request. Write down what you want to change. Injection Defense has no audit-only detections to preview, so use **Test the detector** right after the switch if you want to check your settings.
6. **Check that your groups are right.** Make sure users are in the groups whose policies should apply to them. Look at **Groups** and your identity-provider sync.
7. **Check coverage.** Use **Enrollment**, **Managed Devices** and **AI Footprint** to confirm that endpoints are enrolled and reporting. Enforcement only applies where Whiteout AI is deployed.
8. **Use your discovery data.** Look through **Prompt Review**, **AI Activity** and **People** for the kinds of data people actually send to AI tools, so your policies match real usage.
9. **Tell your users.** Once enforcement starts, some prompts and uploads will be blocked, AI apps and connectors you've blocked stop working, and users may be offered redaction or, if enabled, an override.
10. **Pick a time with Groovy Security.** Ask your account team to switch at a time when you're available. Right after the switch, open **Policies**, apply the changes you noted in steps 2–4, and click **Save Changes**. Then apply the changes you noted in step 5. If you use them, register and attach Bedrock guardrails and push mobile policies now.
11. **Verify.** In Prompt Review, the audit-only banner disappears. New prompts that break an enabled policy appear as **Blocked** (or **Flagged** for surfaces that are only audited after the fact).

### Switching from full enforcement to audit-only

- From the next request, nothing that Whiteout checks is blocked, Prompt Injection Defense stops scanning, and the settings listed in [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode) become view only. Clients pick up their non-blocking lists and settings on their next policy check.
- Your policy configuration, framework selections, Accountable Override settings, Injection Defense settings and suppressions, AI Applications and connector blocks, and resource policy group settings are **kept as they are**. They come back into force if you return to enforcement.
- Past Prompt Review records, including blocked and overridden prompts, stay as they were recorded.
- If you want nothing at all to block, remove the enforcement that runs outside Whiteout: detach Bedrock guardrails, and remove private-browsing and mobile policies from your MDM. See [Enforcement that audit-only mode doesn't switch off](#enforcement-that-audit-only-mode-doesnt-switch-off).

---

## How policies behave across the switch

- **Settings are kept while locked.** Audit-only mode doesn't clear, reset or change any per-group policy setting. The server rejects changes while it's on, so the configuration you see is exactly what will be enforced when enforcement is turned on.
- **Existing policies keep their default state.** A group you have never configured uses each policy's default. The policies that come enabled by default are the ones shown checked on the Policies page.
- **New policies start off.** When Groovy Security adds a policy to the catalog, it arrives **disabled** in every organization and group. A group must turn it on explicitly. Improvements to the wording of an existing policy never change whether it's enabled. New catalog additions can't quietly start blocking prompts after you move to enforcement.
- **Audit-only overrides everything.** Even if policies, Injection Defense and other blocking settings are enabled, in audit-only mode the compliance engine isn't called, Injection Defense doesn't run and nothing is blocked.

---

## Audit trail

Every change to the mode is recorded in **Alerts & Audit → Audit Log**:

| How the change was made | How it appears in the Audit Log |
|-------------------------|---------------------------------|
| An administrator on a self-hosted deployment, through `PUT /admin/org/auditonly-mode` | **"Audit-only mode: off → on"** (or **on → off**), with the administrator's email as the actor. |
| Groovy Security, changing the mode for your organization | **"Audit-only mode changed by Groovy Security: off → on"** (or **on → off**). The entry's list of changes reads **audit-only mode: off → on**. |

Click any entry to open its details, including the full raw event data. Audit Log exports include these entries.

Changes to your **license tier** on a self-hosted deployment happen at Groovy Security, not in your deployment, so they don't appear in your Audit Log. Ask your account team for a record of license changes.

---

## FAQ

**Is anything checked in audit-only mode?**
Yes, everything except content policy and prompt injection. The compliance engine isn't called for prompts, files, agent activity or infrastructure calls, and Prompt Injection Defense is off. Every other check still runs and records what it would have done: model, provider and token checks, AI Applications rules, connector vetting and file safeguards. Whiteout AI also records what was sent, by whom, from which tool and device, and when.

**Can I test my policies in audit-only mode to see what would have been blocked?**
For content policies and prompt injection, no: neither the compliance engine nor Injection Defense runs, so there are no "would have blocked" results for them. For everything else, yes. See [Where to see what would have been blocked](#where-to-see-what-would-have-been-blocked).

**Why is nothing being blocked, even an AI app I blocked?**
In audit-only mode nothing blocks, on any surface. AI Applications rules, connector blocks, resource policy group checks and file safeguards still run and record what they would have done, and your settings are kept for when enforcement is enabled.

**Why is Injection Defense off?**
It needs policy enforcement, so it doesn't run in audit-only mode, whatever its own switch says. Nothing is scanned or recorded. Your settings and suppressions are kept, and it resumes with them from the first request after enforcement is enabled. Detections recorded before the move to audit-only mode stay readable. See [Injection Defense in audit-only mode](./injection-defense/configuration.md#audit-only-mode).

**Why can't I change my AI Applications rules, resource policy groups or other settings?**
Settings that need the compliance engine or only exist to block are view only in audit-only mode, like the Policies page. The page shows an **Audit-only mode** banner, and the server rejects changes with HTTP 403. Settings that don't enforce anything, such as names, data capture, alerting and identity settings, stay editable. See [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode). If something is still being blocked, see [Enforcement that audit-only mode doesn't switch off](#enforcement-that-audit-only-mode-doesnt-switch-off).

**Can I put some groups in audit-only mode and enforce others?**
No. The mode applies to the whole organization.

**Are prompts still stored in audit-only mode?**
Yes. Prompts and files are logged exactly as they are with enforcement on, and appear in Prompt Review, the activity dashboards and your SOC destinations.

**Can my administrators turn audit-only off themselves?**
On SaaS, no: only Groovy Security can change the mode. On self-hosted, an administrator can turn the local setting on and off only while the license includes full enforcement.

**Will Whiteout AI updates re-enable enforcement?**
No. New policies launch disabled, and in audit-only mode no check blocks, whatever the configuration is.

**Do end users need to do anything when we switch modes?**
No. The browser extension, Desktop Guard, IDE plugins, SDKs and infrastructure agents pick up the new behavior on their next policy check. Nothing needs reinstalling or restarting.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| The Policies page and sidebar look normal (not greyed out, no lock), but you're on audit-only | A desktop app older than **2.86.3**. Older versions may show the banner and disabled checkboxes, but not the greyed-out page or the dimmed sidebar item. | Update the desktop app to 2.86.3 or later. Enforcement isn't affected. The server still rejects policy changes. |
| The checkboxes on the Policies page can be clicked, but saving shows **"Failed to save changes — Policy enforcement is not included in this tier (audit-only / discovery)."** | Your organization is in audit-only mode. The app couldn't read the mode (for example because of a brief network error) and fell back to showing the page as editable. | Reload the Policies page. The server check is the one that counts, and your policies haven't changed. |
| Changing **Accountable Override**, a resource policy group's enforcement settings, an AI Applications rule, a Bedrock guardrail, a mobile policy or another locked setting fails with *"Policy enforcement is not included in this tier (audit-only / discovery)."* | Expected. The setting needs policy enforcement, which audit-only mode doesn't include. See [Settings locked in audit-only mode](#settings-locked-in-audit-only-mode). | Make the change after moving to enforcement. |
| A setting on **Infrastructure**, **Custom AI Apps** or **Integrations** is greyed out with an **Audit-only mode** banner | Expected. Only the settings that need enforcement are locked; the rest of the page stays editable. | Make the change after moving to enforcement. |
| Injection Defense shows **Off (audit-only)**, and **Test the detector** is disabled | Expected. Injection Defense doesn't run in audit-only mode. | Your settings are kept and resume once enforcement is enabled. |
| Nothing is being blocked, even prompts that clearly break a policy, injection attempts or AI apps you've blocked | Your organization is in audit-only mode. | Check the mode as described in [Check your organization's current mode](#check-your-organizations-current-mode), and review [what would have been blocked](#where-to-see-what-would-have-been-blocked). If you expected enforcement, contact your account team. |
| Something is still blocked after moving to audit-only | A client hasn't picked up its new settings yet, or the block is enforced outside Whiteout. | Wait for the client's next policy check, or reconnect an offline device. Check for attached Bedrock guardrails, MDM browser and mobile policies, and gateways or code set to fail closed. See [Enforcement that audit-only mode doesn't switch off](#enforcement-that-audit-only-mode-doesnt-switch-off). |
| A coding agent refuses a command that edits or stops the Whiteout defender hooks | The hooks' self-protection, which audit-only mode doesn't change. | Expected. Manage the hooks through your Whiteout deployment, not by editing them. |
| The AI Connector page, a notification or your SIEM says connector content was blocked | In audit-only mode these are what would have been withheld. The content was served. | Expected. Each vetting record carries `enforced: false`. |
| **Self-hosted:** `auditonly_mode` is `false`, but nothing is blocked and the Policies page is locked | Your license doesn't include full enforcement. `compliance_enabled` is `false`. The license always wins over the local setting. | Ask your account team to confirm your license tier. |
| **Self-hosted:** the license was upgraded, but the page is still locked | The license hasn't been revalidated yet, the deployment can't currently reach the license service, or it's air-gapped. | Wait up to about 15 minutes, or restart the backend service to force a license check. With intermittent connectivity, the new tier applies on the next successful check. Air-gapped deployments need a new license token. See [Changing tier](./deployment/self-hosted-aws.md#your-license-and-enforcement-tier). |
| **SaaS:** setting the mode through the API returns **"Organization tier is managed by your provider."** | Expected. On SaaS, only Groovy Security changes the mode. | Contact your account team. |
| After moving to enforcement, Prompt Review still shows the audit-only banner | The app is still showing the mode it read earlier. | Reopen the page or restart the desktop app. |
| Prompts are slow or come back with a compliance-unavailable warning right after moving to enforcement (self-hosted) | Enforcement is on, but your deployment's compliance engine isn't running yet. | Make sure the compliance engine is running in your deployment. Contact Groovy Security support if you need help. |

## Next steps

- [Deployment Models Overview](./deployment/overview.md): how SaaS and self-hosted deployments differ.
- [Self-Hosted AWS Deployment](./deployment/self-hosted-aws.md): licensing and deployment for self-hosted organizations.
- [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md): roll out Whiteout AI across your fleet to get complete discovery coverage.
- [Injection Defense](./injection-defense/configuration.md#audit-only-mode): why Injection Defense is off in audit-only mode.
- [Compliance Evidence](./compliance-evidence/overview.md): map your AI-governance data to audit frameworks.
