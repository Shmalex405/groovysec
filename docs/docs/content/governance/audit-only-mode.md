# Audit-Only Mode

**Audit-only mode** gives your organization full visibility into how people and systems use AI, without enforcing policy. Every prompt, file and AI interaction that Whiteout AI captures is still logged and shows up in your dashboards, but the compliance engine does not evaluate it and nothing is blocked. Audit-only mode is also called the **Discovery tier**.

Audit-only mode is set for your whole organization. You can't turn it on for some groups and off for others. Groovy Security sets it as part of your subscription, and the admin app shows it in a few places, described below.

## Who audit-only mode is for

| Situation | Why audit-only fits |
|-----------|---------------------|
| **Visibility-first rollout** | Deploy Desktop Guard, the browser extension and the IDE plugins across the fleet and see real usage before anything can interrupt anyone. Switch to enforcement once you know what your rules should be. |
| **Shadow-AI discovery** | Build an inventory of the AI tools, desktop apps, IDE assistants, local model runtimes and connectors in use across the organization. |
| **Evaluation and pilots** | Show stakeholders what AI activity looks like in your environment before you commit to enforcement. |
| **A lower-cost tier** | Organizations that need oversight and an audit trail, but not blocking, can stay on audit-only permanently. |

### What audit-only mode is not

- **It isn't a warn-only or monitor mode.** Whiteout AI doesn't check prompts in the background and then let them through. The compliance engine isn't called at all, so there are no "would have been blocked" results to review. Prompts are recorded as **Allowed**, with no policy violations.
- **It isn't a per-user permission.** The **read-only** admin role limits what one administrator can change. Audit-only mode is an organization setting that applies to everyone, including full administrators.
- **It isn't something admins switch themselves.** On a Groovy-hosted (SaaS) organization, only Groovy Security can change the mode. On a self-hosted deployment, your signed license sets the upper limit (see [Moving between audit-only and full enforcement](#moving-between-audit-only-and-full-enforcement)).
- **It doesn't delete or reset your policies.** Policy settings are kept exactly as they are. They're locked while audit-only mode is on and take effect as soon as enforcement is enabled.

---

## What changes and what keeps working

The compliance engine checks the content of prompts and files. That check is skipped for every surface: the desktop app's Chat, the browser extension, Desktop Guard, the IDE plugins and coding-agent hooks, the infrastructure agent, SDKs and Custom AI Apps, and file uploads. Each surface still reports the activity, and the backend still logs it, and the compliance engine's verdict is always **allowed**.

> **Controls that don't use the compliance engine keep running.** Audit-only mode switches off *content policy* enforcement, not every control. These stay active and can still stop a request:
> - **Injection Defense.** It has its own on/off switch and actions. To detect without enforcing, set it to **Record only**. See [Injection Defense configuration](./injection-defense/configuration.md).
> - **Custom AI Apps checks that aren't content checks:** model allowlists, blocked providers, token budgets and AI Applications allow/block rules. See [Policies, Identity and Verdicts](./custom-ai-apps/policies-and-identity.md).
> - **Infrastructure agent provider blocklists, model allowlists and rate limits**, which the agent applies locally.
>
> If you want a purely observational rollout, review these settings as well.

| Surface | In audit-only mode |
|---------|--------------------|
| **Policies page** | View only. The page opens, and you can choose a group and expand each policy category to read the catalog. Every control that would change enforcement is disabled. See [The Policies page](#the-policies-page). |
| **Prompt Review** | Works as normal: search, filters, prompt details. A blue information banner says enforcement isn't active. Every captured prompt shows as **Allowed**, and **Policy Violation** reads **None**. |
| **Chat** (in the desktop app) | Works as normal, including file attachments. The **Checking compliance** and **Compliance passed** status indicators are hidden because no compliance check runs. Nothing is blocked. |
| **Browser extension** | Keeps capturing prompts, pastes, drops and file uploads on supported AI sites and reporting them. Prompts and files are always allowed, with no block or redaction dialog. |
| **Desktop Guard** | Keeps watching supported desktop AI apps and reporting activity. Prompts and file drops are always allowed. |
| **IDE plugins and coding-agent hooks** (VS Code, JetBrains, Claude Code, Codex and others) | Keep reporting prompts and agent activity. Pre-send checks always allow, and the transcript audit doesn't flag anything. |
| **Infrastructure agent** | Keeps monitoring and reporting AI calls from your workloads. Content checks sent to the backend always return allowed. |
| **SDKs and Custom AI Apps** | Content checks return **allow** and the interaction is logged. Non-content checks (model allowlist, blocked providers, token budget, AI Applications rules, Injection Defense) still apply. |
| **File uploads and scans** | Files are logged and kept for review as usual. The scan finishes immediately with an **allowed** verdict. No text extraction or content check runs. |
| **Redaction** | Not available. Redaction is only offered when a prompt is blocked, and nothing is blocked in this mode. |
| **Accountable Override** | The per-group switch on the Policies page is disabled. No prompt is blocked, so nobody is ever offered an override. The switch's saved setting doesn't change. |
| **Dashboard, AI Activity, IDE Activity, Token Usage** | Fully working. These are the main value of audit-only mode. Counts of blocked prompts will be zero. |
| **AI Footprint, Enrollment, Managed Devices, Infrastructure, People** | Fully working. Discovery, coverage and per-user usage are unaffected. |
| **Integrations** | Fully editable. SSO and identity providers, MDM, SOC destinations, data integrations and the Whiteout AI Connector can all be set up and changed. They're what drive discovery. |
| **SOC destinations** | Prompt events are still delivered, marked as not blocked. |
| **Notifications** | Coverage, device and system alerts keep working. Alerts that depend on a blocked prompt or a policy violation won't fire, because neither happens. |
| **Audit Log** | Fully working. Tier changes are recorded here. See [Audit trail](#audit-trail). |
| **Groups, users, roles, reports** | Unchanged. You can still manage groups and administrators and schedule reports. |

---

## What administrators see

These visual cues appear in **desktop app 2.86.3 and later**. Earlier versions show some of them (see [Troubleshooting](#troubleshooting)).

### Sidebar

In the sidebar under **Governance**, the **Policies** item is dimmed:

- With the sidebar **expanded**, the row is faded and a small **lock icon** appears to the right of the label.
- **Hovering** over the row, with the sidebar expanded or collapsed, shows the tooltip **"Audit-only mode — view only"**.
- The row still works. Clicking it opens the Policies page so you can review the catalog.

Every other sidebar item looks and works as normal.

### The Policies page

At the top of the page, under the **Policies** header and the **Select Group** menu, an information banner with a lock icon reads:

> **Audit-only mode** — policy enforcement is not enabled for your organization, so AI activity is logged but nothing is blocked. You can review the policy catalog here, but changes are disabled. Contact your account team to enable enforcement.

Everything below the banner is shown in grey at reduced opacity, so it's clearly inactive.

| Element | State |
|---------|-------|
| **Select Group** menu | Works. Switch groups to see how each group is configured. |
| **Compliance Frameworks** checkboxes | Disabled. You can read which frameworks are selected but can't change them. Hovering a framework still shows its description. |
| **Accountable Override** switch ("Allow users in this group to override blocked prompts and uploads with a written justification") | Disabled. |
| Policy categories (for example **PHI Policies**) | You can still expand and collapse them with the arrow button. The **N/M active** counter is still shown. |
| **Select All Internal** / **Select All External** | Disabled. |
| Per-policy **Apply to Internal** / **Apply to External** checkboxes | Disabled. Their checked state shows what will be enforced when enforcement is turned on. |
| **Save Changes** | Doesn't appear. No changes can be staged. |
| **Request Custom Policy** (the round help button in the bottom-right corner) | Available. You can still ask Groovy Security for a custom policy. |

The page is locked on the server as well as in the app. If a change is sent to the backend by any route, such as an older app version or a script, it's rejected with HTTP 403 and the message *"Policy enforcement is not included in this tier (audit-only / discovery)."* In the app, that appears as **"Failed to save changes — Policy enforcement is not included in this tier (audit-only / discovery)."**

### Prompt Review

Under **Governance → Prompt Review**:

- The page subtitle changes to **"Audit and review all AI prompts and responses captured across your organization."** With enforcement on, it reads "Audit and review all AI prompts, responses, and policy enforcement actions."
- A blue banner reads:

  > Discovery tier — prompts and files are logged for visibility, but no enforcement policies are active, so nothing is blocked. Contact your account team to enable enforcement.

- Prompts captured in audit-only mode show as **Allowed**. The **Blocked** and **Flagged** filters return nothing for this period. In the prompt details, **Policy Violation** reads **None**.

Some raw data carries the reason code `AUDIT_ONLY`, which tells you the compliance engine was skipped for that request. You'll see it in file-scan results and infrastructure-agent evaluations, among others. Other responses simply come back as allowed with no reason. The Prompt Review screens don't show it.

### Chat

When you use **Chat** in the desktop app, the **Checking compliance** and **Compliance passed** status steps are hidden. The indicator goes straight to the steps that follow, such as **Thinking** and **Generating response**. **Blocked by policy** never appears.

### End users

Users of the browser extension, Desktop Guard and IDE plugins don't get a separate audit-only notice. They simply never see a block, redaction or override prompt. Their activity is still captured and reported as normal.

---

## Check your organization's current mode

### In the admin app

Your organization is in audit-only mode if **any** of these are true:

- The **Policies** item in the sidebar is dimmed, shows a lock when the sidebar is expanded, and shows **"Audit-only mode — view only"** on hover.
- The Policies page shows the **Audit-only mode** banner.
- Prompt Review shows the **Discovery tier** banner.

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

---

## Moving between audit-only and full enforcement

How you change the mode depends on how Whiteout AI is hosted for you. See [Deployment Models Overview](./deployment/overview.md) if you're not sure.

### Groovy-hosted (SaaS)

Groovy Security manages the mode on SaaS. The admin app has no switch for it, and an administrator can't change it through the API. A request to change it returns HTTP 403 with *"Organization tier is managed by your provider."*

To change modes:

1. Contact your Groovy Security account team or support (support@groovysec.com) and say which direction you want: **audit-only → full enforcement** or **full enforcement → audit-only**.
2. Groovy Security makes the change. When moving to enforcement, it also makes sure the compliance engine is ready for your organization before switching.
3. The change takes effect on the **next request** your endpoints send. Nothing needs restarting and nothing needs redeploying.
4. The change is recorded in your **Audit Log** (see [Audit trail](#audit-trail)).
5. In the desktop app, open the **Policies** page again to see the updated state. The lock and banners disappear, or appear, once the app has read the new mode.

### Self-hosted

On a self-hosted deployment, the **signed license** Groovy Security issues controls whether full enforcement is available. It comes in two tiers:

| License tier | Effect |
|--------------|--------|
| **Full** | Full enforcement is available. Your organization enforces policies unless an administrator has turned audit-only on locally (see below). |
| **Discovery** | Audit-only is forced. No local setting, database change or configuration can turn enforcement on. |

**To move to full enforcement:**

1. Contact your Groovy Security account team to upgrade your license to the full tier.
2. Make sure your deployment is sized to run the compliance engine. Groovy Security support will confirm the settings for your deployment package. Enforcement needs the compliance engine to be running. If it isn't, prompts wait for the engine and are then handled by your organization's compliance-unavailable setting.
3. Wait for the license to be picked up:
   - **Connected deployments** revalidate their license automatically. The change takes effect **within about one hour**. To apply it immediately, restart the Whiteout AI backend service, which forces a fresh license check.
   - **Offline or air-gapped deployments** never contact the license service, so they won't see a tier change. Groovy Security will issue you a **new license token** to install in place of the current one.
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
- **Move to the Discovery license tier.** Ask your account team. Once the license is picked up (within about one hour, or straight away after a backend restart), audit-only is forced. You can then scale down the compliance engine in your deployment to save on your own infrastructure. Groovy Security support can advise on this.

> **Your local setting can't grant enforcement that your license doesn't include.** On a Discovery license, `compliance_enabled` stays `false` whatever `auditonly_mode` is set to.

### Before you switch to full enforcement: checklist

Once enforcement is on, every enabled policy starts blocking **on the very next request**. The Policies page is locked in audit-only mode, so you can't change policies in advance. You can only review them. Plan the switch:

1. **Review each group's policies.** On the **Policies** page, go through every group in **Select Group**. The checked **Apply to Internal** and **Apply to External** boxes are what will be enforced. Write down what you want to change.
2. **Review Compliance Frameworks.** Note which frameworks are selected for each group. Selecting a framework turns on its required policies.
3. **Decide on Accountable Override** for each group, if you want users to be able to override a block with a written justification. It's off unless you turn it on.
4. **Check that your groups are right.** Make sure users are in the groups whose policies should apply to them. Look at **Groups** and your identity-provider sync.
5. **Check coverage.** Use **Enrollment**, **Managed Devices** and **AI Footprint** to confirm that endpoints are enrolled and reporting. Enforcement only applies where Whiteout AI is deployed.
6. **Use your discovery data.** Look through **Prompt Review**, **AI Activity** and **People** for the kinds of data people actually send to AI tools, so your policies match real usage.
7. **Tell your users.** Once enforcement starts, some prompts and uploads will be blocked, and users may be offered redaction or, if enabled, an override.
8. **Pick a time with Groovy Security.** Ask your account team to switch at a time when you're available. Right after the switch, open **Policies**, apply the changes you noted in steps 1–3, and click **Save Changes**.
9. **Verify.** In Prompt Review, the Discovery banner disappears. New prompts that break an enabled policy appear as **Blocked** (or **Flagged** for surfaces that are only audited after the fact).

### Switching from full enforcement to audit-only

- From the next request, nothing is blocked and the Policies page becomes view only.
- Your policy configuration, framework selections and Accountable Override settings are **kept as they are**. They come back into force if you return to enforcement.
- Past Prompt Review records, including blocked and overridden prompts, stay as they were recorded.

---

## How policies behave across the switch

- **Settings are kept while locked.** Audit-only mode doesn't clear, reset or change any per-group policy setting. The server rejects changes while it's on, so the configuration you see is exactly what will be enforced when enforcement is turned on.
- **Existing policies keep their default state.** A group you have never configured uses each policy's default. The policies that come enabled by default are the ones shown checked on the Policies page.
- **New policies start off.** When Groovy Security adds a policy to the catalog, it arrives **disabled** in every organization and group. A group must turn it on explicitly. Improvements to the wording of an existing policy never change whether it's enabled. New catalog additions can't quietly start blocking prompts after you move to enforcement.
- **Audit-only overrides everything.** Even if policies are enabled, in audit-only mode the compliance engine isn't called and nothing is blocked.

---

## Audit trail

Every change to the mode is recorded in **Alerts & Audit → Audit Log**:

| How the change was made | How it appears in the Audit Log |
|-------------------------|---------------------------------|
| An administrator on a self-hosted deployment, through `PUT /admin/org/auditonly-mode` | **"Audit-only mode: off → on"** (or **on → off**), with the administrator's email as the actor. |
| Groovy Security, changing the mode for your organization | Action `org.auditonly_mode.set`. The event details show the previous and new value (`before` / `after`) and the Groovy Security operator who made the change. |

Click any entry to open its details, including the full raw event data. Audit Log exports include these entries.

Changes to your **license tier** on a self-hosted deployment happen at Groovy Security, not in your deployment, so they don't appear in your Audit Log. Ask your account team for a record of license changes.

---

## FAQ

**Is anything checked in audit-only mode?**
No content check is run. The compliance engine isn't called for prompts, files, agent activity or infrastructure calls. Whiteout AI still records what was sent, by whom, from which tool and device, and when.

**Can I test my policies in audit-only mode to see what would have been blocked?**
No. Audit-only mode doesn't evaluate prompts, so it produces no "would have blocked" results. Use your discovery data to design policies, then move to enforcement at a planned time (see the [checklist](#before-you-switch-to-full-enforcement-checklist)).

**Can I put some groups in audit-only mode and enforce others?**
No. The mode applies to the whole organization.

**Are prompts still stored in audit-only mode?**
Yes. Prompts and files are logged exactly as they are with enforcement on, and appear in Prompt Review, the activity dashboards and your SOC destinations.

**Can my administrators turn audit-only off themselves?**
On SaaS, no: only Groovy Security can change the mode. On self-hosted, an administrator can turn the local setting on and off only while the license includes full enforcement.

**Will Whiteout AI updates re-enable enforcement?**
No. New policies launch disabled, and audit-only mode skips the compliance engine whatever the policy configuration is.

**Do end users need to do anything when we switch modes?**
No. The browser extension, Desktop Guard and IDE plugins pick up the new behavior on their next request. Nothing needs reinstalling or restarting.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| The Policies page and sidebar look normal (not greyed out, no lock), but you're on audit-only | A desktop app older than **2.86.3**. Older versions may show the banner and disabled checkboxes, but not the greyed-out page or the dimmed sidebar item. | Update the desktop app to 2.86.3 or later. Enforcement isn't affected. The server still rejects policy changes. |
| The checkboxes on the Policies page can be clicked, but saving shows **"Failed to save changes — Policy enforcement is not included in this tier (audit-only / discovery)."** | Your organization is in audit-only mode. The app couldn't read the mode (for example because of a brief network error) and fell back to showing the page as editable. | Reload the Policies page. The server check is the one that counts, and your policies haven't changed. |
| Nothing is being blocked, even for prompts that clearly break a policy | Your organization is in audit-only mode. | Check the mode as described in [Check your organization's current mode](#check-your-organizations-current-mode). If you expected enforcement, contact your account team. |
| **Self-hosted:** `auditonly_mode` is `false`, but nothing is blocked and the Policies page is locked | Your license doesn't include full enforcement. `compliance_enabled` is `false`. | Ask your account team to confirm your license tier. |
| **Self-hosted:** the license was upgraded, but the page is still locked | The license hasn't been revalidated yet, or the deployment is offline or air-gapped. | Wait up to about an hour, or restart the backend service to force a license check. Offline and air-gapped deployments need a new license token. |
| **SaaS:** setting the mode through the API returns **"Organization tier is managed by your provider."** | Expected. On SaaS, only Groovy Security changes the mode. | Contact your account team. |
| After moving to enforcement, Prompt Review still shows the Discovery banner | The app is still showing the mode it read earlier. | Reopen the page or restart the desktop app. |
| Prompts are slow or come back with a compliance-unavailable warning right after moving to enforcement (self-hosted) | Enforcement is on, but your deployment's compliance engine isn't running yet. | Make sure the compliance engine is running in your deployment. Contact Groovy Security support if you need help. |

## Next steps

- [Deployment Models Overview](./deployment/overview.md): how SaaS and self-hosted deployments differ.
- [Self-Hosted AWS Deployment](./deployment/self-hosted-aws.md): licensing and deployment for self-hosted organizations.
- [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md): roll out Whiteout AI across your fleet to get complete discovery coverage.
- [Compliance Evidence](./compliance-evidence/overview.md): map your AI-governance data to audit frameworks.
