# FAQ and Troubleshooting

## FAQ

### Is Injection Defense on by default?

No. It's off for every organisation until an admin switches it on under **Governance → Injection Defense → Settings**. While it's off, nothing is scanned or recorded, and Custom AI App Guard responses are unchanged.

### Does it protect employees using ChatGPT, Claude, Gemini or Copilot in the browser or on the desktop?

Not today. Injection Defense covers your Custom AI Apps, AI Connector results, IDE scans from the VS Code extension, OpenTelemetry traces and direct Scan API calls. The browser extension, Desktop Guard and the JetBrains plugin don't send content to the injection detector. Your data policies still apply on those surfaces. See [Overview → What isn't covered yet](./injection-defense/overview.md#what-isnt-covered-yet).

### Does scanned text leave our Whiteout deployment?

No. Both tiers run on your Whiteout backend, and scanned text is never sent to a third party.

### What does Whiteout store?

For every scan: where it came from, who sent it, what kinds of parts it held, a SHA-256 fingerprint and length of each part, the verdict, scores, rules, categories and the detector version. For flagged parts only, and only while excerpts are on: a short excerpt around the match (up to 400 characters), with personal data masked. The full text of a request is never stored, and the text of a passed request isn't stored at all.

### How is personal data masked in excerpts?

Before the excerpt is stored, patterns for common personal data and secrets are replaced with placeholders: email addresses, phone numbers, card and account numbers, national ID numbers, IBANs, API keys, access tokens, private keys and credentials. The masking is pattern-based, so treat excerpts as sensitive. They're visible to admins and read-only auditors, and every view is logged. Turn off **Flagged content: keep a short excerpt around each match** if you don't want them stored.

### Are detections sent to our SIEM?

Yes. Every acting detection is sent to each enabled SOC/SIEM destination as a `prompt_injection_detection` event, whether or not **Notify on detections** is on. Suppressed detections and clean scans aren't sent. Splunk receives them with the sourcetype `whiteout:prompt_injection`, Elasticsearch in the index `whiteout-prompt-injection`, and Azure Sentinel in the table `WhiteoutAI_PromptInjection_CL`, which you need to add to your DCR unless you've set a **Table Name**. AWS S3 and IBM QRadar destinations don't receive them. See [Investigating detections → SIEM export](./injection-defense/investigating-events.md#siem-export).

### Do excerpts leave the console?

Only to your own SOC/SIEM destinations, and only while excerpts are on. Each detection event carries the masked excerpt, and each destination's privacy settings apply: a destination set to hash-only or redacted content receives a hash or `[CONTENT_REDACTED]` instead. Turn excerpts off to keep them out of your SIEM entirely.

### Are admins alerted about detections by default?

Yes. **Prompt injection detected** is in the default **Security events** notification rule, which alerts every admin in-app. Organizations that already had notification rules got it added automatically, unless one of their rules already covered it. Add email, Slack, Teams, webhook or PagerDuty delivery by editing the rule under **Alerts & Audit → Notifications → Rules**.

### How long are records kept?

Scans are kept **for as long as your organisation uses Whiteout**, and each is chained to the one before it with a SHA-256 hash. Use **Detectors → Verify now** to check the chain.

### Can I set different actions for different teams or surfaces?

No. There's one set of actions for the organisation. You can control outcomes per Custom AI App with **monitor mode** (never blocked or quarantined) and with app-scoped **suppressions**. The action for documents and tool results is always separate from the action for user prompts.

### Does it use the policy library or my group policies?

No. Injection Defense is independent of **Governance → Policies** and of group settings. See [Configuration → Relationship to Policies](./injection-defense/configuration.md#relationship-to-policies).

### Does it run in audit-only mode?

No. In an [audit-only](./governance/audit-only-mode.md) organisation, Injection Defense is off, whatever its own switch says. Nothing is scanned on any surface, no detections are recorded, and no alerts or SIEM events are sent. Guard decisions and connector results go through unchanged, and a Guard API, SDK or gateway response carries `"injection": {"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}` if the feature is switched on in your settings. The settings are greyed out and can't be changed, but they're kept, and Injection Defense resumes with them from the next request once enforcement is enabled. See [Configuration → Audit-only mode](./injection-defense/configuration.md#audit-only-mode).

### Test the detector is disabled, and the settings are greyed out

Your organisation is in [audit-only mode](./injection-defense/configuration.md#audit-only-mode), where the detector doesn't run. Hovering over **Test the detector** shows *"Audit-only mode — the detector doesn't run"*, and saving settings or adding a suppression through the API is rejected with HTTP 403: *"Policy enforcement is not included in this tier (audit-only / discovery)."* Past detections are still on the **Overview** and **Audit log** tabs. Contact your account team to enable enforcement.

### Why was a user's prompt only warned about, when I chose Block?

Only a **rule** match can block a user's own prompt. When only the classifier flags a user prompt, the action is capped at warn, because a classifier can't tell a user discussing an attack from one making it. The detection card shows **Classifier** as the tier in that case. A monitor-mode app is also capped at warn.

### What does my app need to do for Quarantine to work?

With the Whiteout SDKs (version 0.3 and later), wrapped clients and auto-instrumentation apply quarantine automatically: quarantined system and tool turns are replaced with a short notice before the model sees them, and tool calls stay paired. For retrieved documents, pass your list through the decision's `clean_context` (Python) or `cleanContext(docs, decision)` (Node.js) to get back only the documents Whiteout didn't quarantine. If you call the Guard API directly, read the `quarantine` object in the response (`context` lists the indexes of documents to drop, `messages` the indexes of messages) and remove those items before calling the model. See the [Python SDK](./developers/python-sdk.md) and [Node.js SDK](./developers/node-sdk.md) guides.

### Does the detector slow requests down?

It adds some time to every scanned request. The **Latency p95** tile on the Overview tab shows the real figure for your traffic over the last 7 days, and each scan's latency is in the audit log. Rules are fast; the classifier accounts for most of the time when it's on.

### Can I test without affecting anyone?

Yes. **Test the detector** is always a dry run: nothing is recorded or notified. It works while the feature is off and uses your current settings and suppressions.

## Troubleshooting

### The Overview says "No scans yet"

The feature is on but no content has reached the detector. Check that:

- your Custom AI Apps are sending traffic through the Guard API, an SDK, auto-instrumentation or a gateway
- the AI Connector is being used with content-reading tools (search, get, read)
- VS Code users have the extension signed in. Remember that the extension only sends content its local scanner already rates high or critical, so an IDE-only deployment may see few scans.

### The classifier shows "Rules only"

Your deployment doesn't have the classifier enabled, so detection uses the rules. The **Use the second-stage classifier** switch has no effect until it's available. Self-hosted customers should contact Whiteout support.

### The classifier shows "Classifier unavailable"

The classifier failed to load, and detection has fallen back to the rules. Protection continues on the rules. Contact Whiteout support.

### The classifier shows "Classifier loading"

The classifier is starting, for example after you switched it on or after a restart. The rules are active meanwhile. The status changes to **Classifier on** once it has loaded.

### A trusted document keeps getting quarantined

Open one of its scans and check the tier. If rules fired, add a suppression that covers **every** rule that fired, scoped to **Retrieved documents** (or **Tool results**) and to the app, with an expiry. If the tier is **Classifier**, a suppression can't help; see [Investigating detections → False positives](./injection-defense/investigating-events.md#false-positives).

### I added a suppression but the content is still flagged

- Check that it covers **every** rule that fired on that part. One uncovered rule keeps the hit acting.
- Check the scope. An app-scoped suppression doesn't apply to AI Connector, IDE or Scan API traffic; use **All apps and surfaces** there.
- Check **Only in**. A suppression limited to *Retrieved documents* doesn't cover the same text arriving as a *Tool result*.
- Check that it hasn't expired or been revoked (turn on **Show revoked**).
- Classifier-only detections can't be suppressed.

### Blocked requests aren't generating alerts

- Check that **Notify on detections** is on.
- Check that a notification rule includes **Prompt injection detected** and is enabled. The default **Security events** rule includes it; if you edited or disabled that rule, or deleted it and its replacement **Prompt injection detected** rule, add a rule under **Alerts & Audit → Notifications → Rules**.
- Check that the event isn't silenced in **Alerts & Audit → Notifications → Library**.
- Suppressed hits don't raise events.
- Repeats from the same surface and app or user are coalesced.

### A Custom AI App never blocks, whatever the settings

The app is probably in **monitor mode**, which caps injection actions at warn. OpenTelemetry traffic is also always capped at warn, because the calls have already happened.

If **nothing** is scanned at all and the page header reads **Off (audit-only)**, your organisation is in [audit-only mode](./governance/audit-only-mode.md), where Injection Defense is off.

### Quarantine is reported, but the model still saw the document

The app is calling the Guard API directly (or through an integration that doesn't apply quarantine) and isn't dropping the items listed in `quarantine`. Upgrade to SDK 0.3 or later, or drop the listed items in your code. See [What does my app need to do for Quarantine to work?](#what-does-my-app-need-to-do-for-quarantine-to-work)

### Verify now reports "Chain broken"

A record in your organisation's injection audit log no longer matches its hash, or a record is missing or out of order. The result names the first broken record and how many records before it verified. Export the log, keep the verification result, and contact Whiteout support. The verification itself is recorded in the admin Audit Log.

### I can't change settings or record verdicts

You're signed in with the **read-only** role. Read-only users can view every tab, open scans, export and verify the chain, but can't change settings, record verdicts or manage suppressions.

## Related

- [Injection Defense overview](./injection-defense/overview.md)
- [The Injection Defense console](./injection-defense/console.md)
- [Configuration and rollout](./injection-defense/configuration.md)
- [Investigating detections](./injection-defense/investigating-events.md)
