# Investigating Detections

This page covers what to do when Injection Defense flags something: where detections show up, how to triage one, how to record a verdict, how to deal with false positives, and how to get the data into your alerting, SIEM and compliance evidence.

## Where detections appear

| Place | What you see |
|---|---|
| **Governance → Injection Defense → Audit log** | Every scan, passed or flagged, from every surface. This is the system of record. |
| **Governance → Injection Defense → Overview** | Trends: volume, outcomes, categories, surfaces, top rules and apps |
| **Coverage → Custom AI Apps** | The app list's **Injection** tile, and each app's **Overview**, **Injection** and **Activity** tabs, filtered to that app |
| **Governance → Prompt Review** | Reached from a scan's **Open in Prompt Review** link, when the scan belongs to a user-aware Custom AI App prompt |
| **Activity → IDE Activity** | IDE scans that were flagged also appear as an injection warning for the user and AI tool |
| **Alerts & Audit → Notifications** | A **Prompt injection detected** event for each acting detection, when **Notify on detections** is on |
| **Your SIEM** | A `prompt_injection_detection` event for each acting detection, on every enabled [SOC/SIEM destination](./soc-destinations/webhook.md#prompt-injection-detection-events) |
| **Alerts & Audit → Audit Log** | Admin activity on the feature: settings changes, scans opened, exports, chain verifications, verdicts and suppressions |
| **Integrations → Compliance Evidence** | Detections feed the **Prompt-injection detection** evidence source |

AI Connector (MCP) detections appear in the Injection Defense audit log with the surface **AI Connector (MCP)**. The **Request** field shows the connector source and tool (for example `google_drive:gdrive_read_file`).

## Triage workflow

1. **Find flagged scans.** On the **Audit log** tab, set **Result** to **Flagged**. Narrow by **Action** (start with **block** and **quarantine**), **Surface**, **Period** or **User email**. In an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation nothing new is scanned, so the log only holds scans from before the move to audit-only mode.
2. **Open the scan.** Click the row to open the scan drawer.
3. **Establish where it came from.** Read **Surface**, **App**, **User** and **Request**. The request reference often points straight at the source: a connector *source:tool* pair, a file path from an IDE, or a Guard evaluation ID.
4. **Read each detection card.** Note which **part** carried the text (a user prompt is a different story from a retrieved document), the **tier** (rules or classifier), the **score**, the **categories** and the **rules** that fired.
5. **Read the excerpt.** If excerpts were on, the card shows the text around the match, with personal data masked. Look it up on the **Detectors** tab to see what the fired rule looks for.
6. **Decide what it is:**
   - **An attack or planted instruction.** Mark it **Confirmed attack**, then work the source: see [Responding to a confirmed attack](#responding-to-a-confirmed-attack).
   - **Legitimate content.** Mark it **False positive**, and consider a suppression. See [False positives](#false-positives).
   - **Unsure.** Add a note and leave it unreviewed, or reproduce it in **Test the detector** with a copy of the content.
7. **Confirm the content** if you need to. When you hold a copy of the suspect text, compute its SHA-256 and compare it with the part's fingerprint under **What was scanned**. Paste the same hash into the audit log's **Content SHA-256** filter to find every other scan of that exact content, across users and surfaces.

### Reading a score

Scores run from 0 to 1. A rule hit's score reflects the rules that fired and their severity. A classifier hit's score is the classifier's confidence, and the **Detectors** tab shows the threshold it must reach. A higher score means stronger evidence, not a more dangerous attack. Judge the danger from the part and the surface: a planted instruction in a tool result read by an agent that can act matters more than a user testing a jailbreak in a chat app.

## Recording a verdict

In each detection card, under **Your verdict**, choose **Confirmed attack** or **False positive**, add an optional **Note**, and click **Save**.

- Verdicts are **append-only**. Saving a new verdict doesn't erase the old one; the latest is current and the rest stay in **Review history**.
- Each verdict is written to the admin Audit Log as `injection.detection.reviewed`.
- **Reviewed precision** on the Overview tab is confirmed attacks ÷ (confirmed + false positives), across the detections your team has reviewed in the period.
- Verdicts are records. A verdict doesn't change what happened to the request, and marking a false positive doesn't stop the same content being flagged again. Use a suppression for that.

Read-only users can see verdicts but can't record them.

## Responding to a confirmed attack

What to do depends on where the text came from:

| Found in | Typical response |
|---|---|
| **Retrieved document** (Custom AI App) | Find the document in your app's knowledge source and remove or clean it. Check who could write to that source. |
| **Tool result** via **AI Connector (MCP)** | The **Request** field names the source and tool. Find the item (email, document, ticket, message) in that system. An inbound email or an externally editable document is the usual origin. |
| **Tool result** via **IDE / coding agent** | The **Request** field usually names the file, command or URL the agent read. Check the repository, dependency or page, and whether the agent went on to run anything. |
| **User prompt** | Talk to the user or app owner. Repeated jailbreak attempts against an internal app may be a policy matter as much as a security one. |
| **System prompt** | Your own app's instructions contain attack-like phrasing. That is usually a false positive; otherwise, the app's configuration has been tampered with. |

Use the **Content SHA-256** filter to find other scans of the same payload, and the **User email** filter to see what else that user's traffic triggered.

## False positives

Some legitimate content looks like an injection: security training material, articles *about* prompt injection, documentation that shows chat-template markers, support tickets that quote a customer's attempt.

1. **Mark it False positive** so your precision figure stays honest.
2. **Check what fired.** If a single rule or category keeps firing on the same trusted content, add a **suppression**: scoped to that rule or category, limited to the part kind (for example **Retrieved documents**) and app where it occurs, with a clear reason and an expiry. See [Configuration → Suppressions](./injection-defense/configuration.md#suppressions).
3. **If the hit was classifier-only** (the tier reads **Classifier** and no rule is listed), a suppression can't cover it. Your options:
   - For user prompts, a classifier-only match is already only a warning. Consider leaving it and marking the verdict.
   - For documents and tool results, if one app is affected, put that app in **monitor mode** while you investigate.
   - If classifier false positives are widespread in your content, turn **Use the second-stage classifier** off. Detection then relies on named rules only.
4. **If Strict sensitivity is generating the noise,** go back to **Balanced**.

Test any change in **Test the detector** with a copy of the content before relying on it. The test applies your current settings and active suppressions.

## Alerts

With **Notify on detections** on, every scan with an acting detection raises a **Prompt injection detected** event (category *Prompts & Policy*, default severity *High*). Suppressed-only scans don't raise events. Record-only detections do, titled *"Prompt injection recorded — \<surface\>"*; other actions are titled with the action, e.g. *"Prompt injection block — gateway"*. In an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation Injection Defense is off, so no alerts are raised. The event links straight to the scan. Repeats are coalesced per surface and per app or user.

> **Admins are alerted by default.** **Prompt injection detected** is part of the default **Security events** notification rule: every admin gets it in-app, in real time, with repeats deduplicated over 15 minutes and at most 20 alerts an hour. Organizations that already had notification rules got it added automatically: appended to **Security events**, or, if that rule had been deleted, as a new rule named **Prompt injection detected** with the same settings. If one of your rules already covered the event, including a disabled one, nothing was added.

To change who hears about it and where, open **Alerts & Audit → Notifications**. On **Rules**, edit **Security events** (or your own rule) to add email, Slack, Microsoft Teams, a webhook or PagerDuty, or to narrow the audience. In the **Library**, find **Prompt injection detected** under *Prompts & Policy* to re-tier its severity or silence it.

## SIEM export

Detections are **streamed automatically** to your [SOC/SIEM destinations](./soc-destinations/webhook.md#prompt-injection-detection-events). There's nothing extra to set up: every enabled destination receives them.

- **One event per acting detection**, with the event type `prompt_injection_detection`. Suppressed detections and clean scans aren't sent. Record-only detections are.
- **Severity** follows the action: **block** and **quarantine** are `high`, **warn** is `medium`, **record** is `low`.
- **Independent of Notify on detections.** Turning notifications off doesn't stop SIEM delivery.
- **None in audit-only mode.** Injection Defense is off in an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation, so no detection events are sent.
- **Routed separately** from prompt logs: Splunk sourcetype `whiteout:prompt_injection`, Elasticsearch index `whiteout-prompt-injection`, Azure Sentinel table `WhiteoutAI_PromptInjection_CL`, and the webhook header `X-Whiteout-Event-Type: prompt_injection_detection`. Sentinel customers need to add that stream to their DCR or set a **Table Name**; see [Azure Sentinel](./soc-destinations/azure-sentinel.md#prompt-injection-detection-events).
- **Metadata, plus the excerpt if you keep one.** Each event has the surface, app, user, action, categories, rule IDs, tier, score and a link to the scan. The masked excerpt is included only while **Flagged content: keep a short excerpt around each match** is on, and each destination's privacy settings (hash-only or redacted content, stripped or tokenized user email) apply to it.

The event fields and an example payload are in [Webhook → Prompt injection detection events](./soc-destinations/webhook.md#prompt-injection-detection-events). AWS S3 and IBM QRadar destinations don't receive these events.

IDE injection warnings recorded while Injection Defense is off aren't sent to your SIEM; they only raise notifications.

For a complete record, including scans that passed, **export** the audit log as **JSON Lines (SIEM)** (or CSV). Each line is one scan with its metadata, part fingerprints and chain hashes, without scanned text or excerpts. Exports are recorded in the admin Audit Log.

## Audit trail of admin activity

Everything an admin does in the console is written to **Alerts & Audit → Audit Log**:

| Action | Recorded when |
|---|---|
| `injection.settings.updated` | Any setting changes (the changed fields are listed) |
| `injection.scan.viewed` | Someone opens a scan in the drawer |
| `injection.scans.exported` | Someone exports the audit log (format, row count and filters) |
| `injection.chain.verified` | Someone runs **Verify now** (with the result) |
| `injection.detection.reviewed` | Someone records a verdict |
| `injection.suppression.created` | A suppression is added |
| `injection.suppression.revoked` | A suppression is revoked |

## Compliance evidence

When Injection Defense is on, the **Prompt-injection detection** evidence source in [Compliance Evidence](./compliance-evidence/overview.md) reports detections for the audit period by surface and action, with sample rows (time, surface, the part it was found in, action). Only verdict metadata is included, never the scanned text. For a period your organisation spent entirely in [audit-only mode](./governance/audit-only-mode.md), the source reads **Absent**: *"Prompt Injection Defense is off: this organization is in audit-only mode, so no content is scanned for prompt injection."* A period that mixes audit-only and enforced days reads **Partial**. For long-term proof that the log is intact, run **Verify now** on the **Detectors** tab and keep an export alongside your evidence pack.

## Related

- [The Injection Defense console](./injection-defense/console.md)
- [Configuration and rollout](./injection-defense/configuration.md)
- [FAQ and troubleshooting](./injection-defense/troubleshooting.md)
