# Configuration and Rollout

Injection Defense has one set of settings for your whole organisation. They live under **Governance → Injection Defense → Settings**, and every control saves as soon as you change it. This page explains each setting, how settings combine into an action, how suppressions work, and how to roll the feature out without disrupting anyone.

## Settings reference

| Setting | Default | Effect |
|---|---|---|
| **On / Off — Prompt Injection Defense** | Off | The master switch. Off: no surface is scanned and nothing is recorded; Guard API responses are exactly as they were before the feature existed. On: every covered surface is scanned and every scan is recorded. |
| **When a user's own prompt is an injection** | Warn | The action for a flagged **user prompt** or **system prompt**. |
| **When a document or tool result carries instructions** | Quarantine | The action for a flagged **retrieved document** or **tool result**, including AI Connector results, IDE scans and a model's reply. |
| **Sensitivity** | Balanced | How readily the rules flag text. **Strict** flags lower-scoring matches: it catches more, with more false alarms. It doesn't change the classifier. |
| **Use the second-stage classifier** | On | Whether the classifier scores content alongside the rules. It has no effect when your deployment shows **Rules only**. |
| **Notify on detections** | On | Whether each acting detection raises a **Prompt injection detected** event in the Notification Center. |
| **Flagged content: keep a short excerpt around each match** | On | Whether a masked excerpt (up to 400 characters) is stored with each detection. Scores, rules and categories are always stored. |

Every change is written to the admin **Audit Log** as `injection.settings.updated`, with the fields that changed.

## The actions

| Action | Label in Settings | What it does |
|---|---|---|
| **Record** | Record only | Lets the request through unchanged and records the detection. |
| **Warn** | Warn (let it through, flag it) | Lets the request through and flags it. Custom AI Apps receive the detection in the Guard response so the app can react, for example by showing a notice or logging. |
| **Quarantine** | Quarantine the document (recommended) | Drops only the flagged documents or tool results from the model's context. The rest of the request goes ahead. |
| **Block** | Block the prompt / Block the whole request | Stops the whole request. |

What each action means on each surface:

| | Record / Warn | Quarantine | Block |
|---|---|---|---|
| **Custom AI Apps** (Guard API, SDK, auto-instrumented, gateway) | Request allowed; the Guard response includes an `injection` result | Guard response lists the flagged items under `quarantine`. The SDKs (0.3+) replace quarantined system and tool turns and drop quarantined documents before the model call. If you call the Guard API directly, your code must drop them. | The Guard decision becomes **block** with the injection reason, even if the data policy allowed it. The SDKs raise their blocked error. |
| **Custom AI App replies** (checked as tool content) | Reported in the output check's `injection` result | Reported only; a reply can't be partly removed | The output check fails |
| **AI Connector (MCP)** | Result returned, with a `whiteout_injection` annotation listing the flagged items | The flagged item's text and preview are replaced with *"[Removed by Whiteout: this item contained instructions aimed at the AI assistant. Ask your administrator if you need the original.]"* and its title with *"[removed by Whiteout]"*. Other items are returned untouched. | The tool call returns an error instead of data: *"Whiteout blocked this \<source\> result: it contained instructions aimed at the AI assistant."* |
| **IDE / coding agent** | Recorded | Recorded, and reported to the extension as blocked | Recorded, and reported to the extension as blocked |
| **OpenTelemetry** | Recorded | Recorded as warn | Recorded as warn |

On the IDE surface, the VS Code extension shows its own warning from its local scan and writes the server verdict to its output channel. The agent isn't stopped. On OpenTelemetry the calls have already happened, so detections are always capped at warn.

### How the action is chosen

For every part the detector flags:

1. **Retrieved documents and tool results** take the *document or tool result* action.
2. **User and system prompts** take the *user's own prompt* action **if a rule fired**. If only the classifier fired, the action is **warn** (or **record**, if you chose Record only). A classifier-only match can never block a user's prompt.
3. **Monitor-mode Custom AI Apps and OpenTelemetry** cap every action at **warn**.
4. **A suppression** that covers every rule that fired turns the hit into a recorded, non-acting detection. See [Suppressions](#suppressions).

The scan's overall result is the strongest action across its parts: block, then quarantine, then warn, then record.

### Sensitivity

**Balanced** is tuned so that ordinary work content rarely trips a rule. **Strict** lowers the score a rule match needs before it counts, so it catches more borderline phrasing and flags more legitimate text. Use **Test the detector** with samples of your own content to see the difference before you switch, and expect to review more false positives in the audit log afterwards.

### The classifier

The classifier catches injected instructions that no rule describes, and does most of its work on documents and tool results. It runs on your Whiteout backend; scanned text is never sent to a third party. Turn **Use the second-stage classifier** off if you want every detection to be explainable by a named rule. Detection then relies on the rules alone.

On very large requests, the rules check every part (up to 64 per request) and the classifier scores up to 16 of them, documents and tool results first.

## Relationship to Policies

Injection Defense is **separate from your data policies**:

- It isn't configured under **Governance → Policies** or in group settings, and it doesn't use the policy library. Enabling or disabling a policy rule doesn't change injection detection, and the reverse is also true.
- There are **no per-group or per-user injection settings**. One set of settings applies to every covered surface.
- On a Custom AI App request, the data policy check and the injection check both run. Either can block. If the data policy allows a request and the injection check blocks it, the result is a block with the injection reason.
- On the AI Connector, the connector policy runs first. Items it withholds never reach the injection check, and the injection check runs on what's left. See [Connector Policy](./whiteout-ai-connector/connector-policy.md).
- **Audit-only mode** switches Injection Defense off. Nothing is scanned on any surface while your organisation is in audit-only mode. See [Audit-only mode](#audit-only-mode).

The per-app controls that do affect injection outcomes are a Custom AI App's **monitor mode** (never blocked or quarantined) and app-scoped **suppressions**.

## Audit-only mode

Prompt Injection Defense needs policy enforcement, so it's **off** while your organisation runs Whiteout in [audit-only mode](./governance/audit-only-mode.md), whatever its own switch says:

- **Nothing is scanned, on any surface.** The detector doesn't run for Custom AI Apps (Guard API, SDKs, auto-instrumented apps and gateways), OpenTelemetry traces, AI Connector tool results, IDE and coding-agent scans, or the Scan API, including dry runs.
- **Nothing is recorded or sent.** No scans or detections are added to the audit log, no **Prompt injection detected** alerts fire, and no detection events go to your SIEM.
- **Requests pass through untouched.** Nothing is blocked, quarantined or annotated. AI Connector results come back without a `whiteout_injection` annotation.
- **API responses say the detector didn't run.** If Injection Defense is switched on in your settings, the `injection` result on a Guard API, SDK or gateway call reads `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}`, with no `quarantine` lists. A call to the Scan API returns the same result. If the feature is switched off in your settings, the `injection` result is left out, as it is under enforcement.
- **Your settings are kept.** The actions, sensitivity, classifier, notification and excerpt settings, and your suppressions, stay exactly as they are. They're shown greyed out and can't be changed (see [In the console](#in-the-console)).
- **Past detections stay available.** Scans recorded before your organisation moved to audit-only mode stay on the **Overview** and **Audit log** tabs, and you can still open, review, export and verify them.

When enforcement is enabled for your organisation, Injection Defense resumes from the next request with the settings you saved, if its switch is on.

### In the console

- The **Audit-only mode** banner at the top of **Governance → Injection Defense** reads: *"**Audit-only mode** — Prompt Injection Defense needs policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement. It is off: nothing is scanned or recorded, and your saved settings resume when enforcement is enabled. Past detections stay available under Overview and Audit log."*
- The header chip reads **Off (audit-only)**.
- **Test the detector** is disabled. Hovering over it shows *"Audit-only mode — the detector doesn't run"*.
- The **Settings** tab is greyed out, and every control on it is disabled, including **Add suppression** and **Revoke**.
- In the sidebar, **Injection Defense** is dimmed, with a lock icon when the sidebar is expanded and the tooltip **"Audit-only mode — view only"**. It still opens the page.

### Through the API

- `GET /injection/settings` and `GET /injection/summary` include `"active": false` and `"off_reason": "AUDIT_ONLY"`. `enabled` still shows your own switch. Under enforcement, `active` matches `enabled` and `off_reason` is `null`.
- `PUT /injection/settings` and `POST /injection/suppressions` are rejected with HTTP 403 and the message *"Policy enforcement is not included in this tier (audit-only / discovery)."*
- Revoking a suppression (`POST /injection/suppressions/{id}/revoke`) is still accepted, although the console disables the button.
- `POST /injection/scan` returns `{"status": "off", "reason": "AUDIT_ONLY", "detected": false, "action": "allow"}` without scanning, even as a dry run.

## Suppressions

A suppression is an audited exception for content you trust: a knowledge-base article that quotes attack phrasing, a security team's training material, a tool whose output legitimately contains role markers. A suppressed hit is **still recorded**, marked **suppressed**, but it doesn't warn, quarantine or block.

To add one, open **Settings → Suppressions → Add suppression**:

1. **Suppress**: **A whole category** or **One rule**. Choose the narrowest that works. The rule list shows each rule's ID and description; the **Detectors** tab and a scan's detection card show which rule fired.
2. **Only in** (optional): **Any part of the request**, or only **User prompts**, **System prompts**, **Retrieved documents** or **Tool results**.
3. **For** (optional): **All apps and surfaces**, or one Custom AI App.
4. **Why this is safe** (required, at least 3 characters): *"Recorded with the suppression and shown on every scan it affects."*
5. **Expires (optional)**: the suppression stops at the end of that day. Prefer an expiry to an open-ended exception.
6. Click **Add suppression**.

Rules of the road:

- **Every rule that fired must be covered.** If three rules fire on the same content and your suppression covers two, the hit still acts. One suppressed rule can't hide another.
- **Suppressions apply to rule hits only.** A detection made by the classifier alone can't be suppressed. For classifier-only false positives, see [Investigating detections → False positives](./injection-defense/investigating-events.md#false-positives).
- **App-scoped suppressions apply only to that app's traffic.** AI Connector, IDE and Scan API traffic have no app, so only **All apps and surfaces** suppressions apply to them.
- **Nothing is hidden.** Suppressed hits stay in the audit log, the scan drawer lists the suppression and its reason, and the **Hits** column counts its use.
- **Every change is audited.** Creating and revoking suppressions are written to the admin Audit Log (`injection.suppression.created`, `injection.suppression.revoked`). Revoking takes effect on the next request.

## Recommended rollout

The defaults (Warn for prompts, Quarantine for documents) start acting the moment you switch the feature on. To observe first:

**Stage 1: prepare (feature off)**

1. Open **Test the detector** and run the four examples, then samples of your own content: typical prompts, the documents your apps retrieve, connector results. Confirm that everyday content passes.
2. Check the classifier status on the **Detectors** tab so you know whether you're running with the classifier or on rules only.
3. Set both actions to **Record only**. Leave **Sensitivity** on **Balanced**, **Notify on detections** on, and excerpts on.
4. Decide who should hear about detections. Admins are alerted in-app by default: **Prompt injection detected** is part of the default **Security events** notification rule. To add email, Slack, Microsoft Teams, a webhook or PagerDuty, edit that rule (see [Investigating detections → Alerts](./injection-defense/investigating-events.md#alerts)).

**Stage 2: monitor (1–2 weeks)**

5. Switch the feature **On**.
6. Review flagged scans in the **Audit log** regularly. Mark each detection **Confirmed attack** or **False positive**; **Reviewed precision** on the Overview tab builds up from those verdicts.
7. For recurring false positives from trusted sources, add narrow, expiring suppressions with clear reasons.
8. Watch **Latency p95** on the Overview tab to understand the time the detector adds to your apps.

**Stage 3: enforce**

9. Set **When a document or tool result carries instructions** to **Quarantine the document (recommended)**. Quarantine removes only the hostile item, so it's the least disruptive enforcing action. For Custom AI Apps, make sure the app uses SDK 0.3 or later, or drops the items listed under `quarantine` itself.
10. Set **When a user's own prompt is an injection** to **Warn**. Move to **Block the prompt** only for apps where a jailbreak attempt should end the request, and after the monitoring period has shown few false positives.
11. Use **Block the whole request** for documents only where any tampered source should stop the whole request, for example in agents that can take irreversible actions.

Keep a Custom AI App in **monitor mode** while its team is still validating it. Its injection detections stay at warn whatever the org-wide actions are.

## Related

- [The Injection Defense console](./injection-defense/console.md)
- [Investigating detections](./injection-defense/investigating-events.md)
- [FAQ and troubleshooting](./injection-defense/troubleshooting.md)
