# Vendor Audit Logs

Microsoft, Google and Slack keep their own audit logs of what happens in their business products. When you connect one, Whiteout reads it and shows AI use the vendor recorded, including use that happened where no Whiteout app was running: on a phone, in a desktop app without Desktop Guard, or in a browser without the extension.

Connect them under **Integrations → Data Integrations → Vendor audit logs**. There's one card per vendor, each with its own **Connect**, so you approve each vendor's request separately.

> **Only metadata is stored.** From each record Whiteout keeps who used the AI, which product they used it in (for example Copilot in Word, or Gemini in Gmail) and when. It never stores the prompt or the response text, even when the vendor's log includes them.

| Vendor log | What it shows | Needs |
|---|---|---|
| **Microsoft 365 Copilot** | Who used Copilot in Word, Excel, Outlook, Teams and Copilot Chat, and when | Microsoft 365 Copilot licenses, and the Whiteout Microsoft app's admin consent |
| **Google Gemini** | Who used Gemini in Gmail, Docs, Sheets and the other Workspace apps, and when | Google Workspace read access for Whiteout |
| **Slack** | AI apps added to your Slack workspace | A Slack Enterprise Grid plan |

---

## What you see

Each card shows its status, when it last pulled, and how many items it pulled in the last 24 hours.

| Status | Meaning |
|---|---|
| **Connected** | Whiteout pulls the log on a schedule: Microsoft 365 Copilot every 3 hours, Google Gemini and Slack every hour |
| **Not connected** | Not set up yet |
| **Last pull failed** | The last pull didn't work. The card shows the reason. Whiteout tries again on the next pull. |
| **Not available on this Slack plan** | Slack's audit log isn't offered on your plan. This isn't an error. |

AI use from the Microsoft and Google logs appears:

- in **Coverage → AI Footprint**, as use of Microsoft 365 Copilot or Gemini in Google Workspace, with the vendor's audit log as its source, for the last 30 days
- in **Activity → AI Activity**, with the vendor's audit log as the surface

When a Whiteout surface also captured the same interaction, Whiteout matches the two (same person, same tool, within about 10 minutes), so it isn't counted twice. Records are kept for 180 days.

**Only Whiteout users.** A record is matched to a person by email address, including the alternate addresses your identity provider lists. Use by someone who isn't a Whiteout user raises no finding. The Microsoft 365 Copilot log is read only for people who are Whiteout users.

---

## Seen only in the vendor's audit log

This finding means the vendor's own audit log shows someone using its AI, and **no Whiteout device saw it.** In the Findings list it's an **AI use with no Whiteout on any device** finding, with *Seen only in the Microsoft 365 Copilot audit log* (or the Gemini one) underneath.

**Why it matters.** The person used the AI somewhere Whiteout doesn't check: a phone, a desktop app without Desktop Guard, or a browser or browser profile without the extension. Nothing they sent there was checked against your policies.

**Severity.** **High**. It becomes **critical** once it's been seen on 3 or more days.

**What to do:**

1. **Look at where it happened.** The finding names the product, such as Copilot in Teams.
2. **Cover the person's devices.** Install Desktop Guard and the browser extension on the devices they use, ideally through MDM. See [Browser coverage](./ai-footprint/browser-coverage.md).
3. **If the use is sanctioned** from a place Whiteout can't cover, allowlist the tool under **Manage → Allowlisted tools**.
4. **Acknowledge the finding** with a note.

There's one finding per person and vendor. It resolves by itself when there have been no such interactions for 7 days, or when you disconnect that vendor's log.

---

## Microsoft 365 Copilot

Whiteout reads Copilot interaction records from Microsoft Graph, through the same Whiteout Microsoft app as the [Microsoft 365 connector](./whiteout-ai-connector/microsoft-365-zero-click.md). There's something to read only for people who have Microsoft 365 Copilot licenses.

The permission Whiteout asks for:

| Permission | Type | Why |
|---|---|---|
| `AiEnterpriseInteraction.Read.All` | Application | Read the Copilot interaction records for your tenant |

Whiteout also uses `User.Read.All`, which the Microsoft 365 connector already has, to find each Whiteout user in your tenant.

**To connect:**

1. On the **Microsoft 365 Copilot** card, choose **Connect**.
2. If your tenant's consent to the Whiteout app already includes the Copilot permission, the card connects straight away.
3. Otherwise Microsoft's admin consent page opens. Sign in as a tenant admin (Global Administrator or Privileged Role Administrator) and approve. Then refresh the card in Whiteout.

**Already consented to the Whiteout app?** Microsoft records the permissions in force when you consented. If you consented before the Copilot permission was added, you need to consent again to add Copilot interaction access. **Connect** takes you through it.

If the card says **Microsoft 365 isn't set up on this Whiteout server yet**, contact Whiteout support. On a self-hosted deployment, your operator sets up the Whiteout Microsoft app first.

See Microsoft's documentation on Microsoft 365 Copilot interaction export for what Microsoft records.

## Google Gemini

Whiteout reads Gemini activity from your Google Workspace Admin audit log, using the same Google Workspace read access as [AI apps connected with work accounts](./ai-footprint/connected-ai-apps.md#google-workspace).

The scope Whiteout asks for:

| Scope | Why |
|---|---|
| `https://www.googleapis.com/auth/admin.reports.audit.readonly` | Read the Gemini events in your Workspace audit log |

**To connect:**

1. Set up Google Workspace read access first, if you haven't. See [Set up read access](./ai-footprint/connected-ai-apps.md#google-workspace).
2. On the **Google Gemini** card, choose **Connect**. Whiteout checks whether it can read the audit log.
3. If it can't yet, the Google Admin console opens on **Domain-wide delegation**. Add the scope above to the client ID Whiteout uses, keeping the scopes already listed, then choose **Connect** again in Whiteout.

Only the name of the Workspace app each event happened in is read. Any other detail in the event, such as a prompt, a document title or a summary, is dropped without being stored.

## Slack

Slack's audit log is available only on **Enterprise Grid**. On any other plan the card shows **Not available on this Slack plan**, and the token you entered isn't kept.

It records **AI apps added to your Slack workspace**: installs, and changes to an app's permissions, for apps that match an AI vendor in Whiteout's catalog. The card counts them. It doesn't record use of Slack AI itself yet. To see and check Slack AI prompts, see [AI inside work apps](./ai-footprint/ai-in-work-apps.md).

**To connect:**

1. A Slack Org Owner creates an org-level Slack app with the `auditlogs:read` scope and installs it on the Enterprise Grid organization. See Slack's documentation on the Audit Logs API.
2. On the **Slack** card, choose **Connect** and paste the app's token.
3. Whiteout checks the token, stores it encrypted and never shows it again.

---

## When a log stops

If a pull fails, for example because consent was withdrawn, a permission was removed or the vendor's service kept failing:

- **Nobody's AI use is affected.** Only the vendor's record stops filling in.
- The card shows **Last pull failed** and the reason.
- **Notification Center** raises **Vendor audit feed stopped**, once per outage, not on every retry. **Vendor audit feed restored** follows when it pulls again.

To fix it, follow the reason on the card, then choose **Reconnect**.

**Disconnect** stops the pulls and removes Whiteout's credential for that vendor. The vendor's rows leave AI Footprint, and its findings resolve. Records already stored stay in AI Activity until they're 180 days old.

---

## Who can do what

| Role | Can |
|---|---|
| Admin | Connect, reconnect and disconnect each log |
| Read-only | See each card's status |
