# The Injection Defense Console

This page walks through every part of **Governance → Injection Defense**: the header, the four tabs, the scan detail drawer and the **Test the detector** dialog. For what each setting *does*, see [Configuration and rollout](./injection-defense/configuration.md). For how to work a detection, see [Investigating detections](./injection-defense/investigating-events.md).

## Who can use it

| Role | What they can do |
|---|---|
| **Admin** | Everything: change settings, review detections, add and revoke suppressions, open scans, export, verify the chain, test the detector |
| **Read-only** (auditor) | View every tab, open scans (excerpts included), export the audit log and run **Verify now**. Settings, verdicts and suppressions are view-only. |

Opening a scan, exporting and verifying are all written to the admin **Audit Log**, whoever does them.

## Page header

The header reads **Prompt Injection Defense**, with the subtitle *"Catch jailbreaks and instructions planted in documents or tool results before they reach the model — with a complete, tamper-evident record of every request checked."*

To the right of the title:

- **On** / **Off**: whether the feature is switched on for your organisation. In an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation it reads **Off (audit-only)**, whatever the switch says.
- **Classifier status** (shown only while the feature is on): one of **Classifier on**, **Classifier loading**, **Rules only** or **Classifier unavailable**. See [Classifier status](#classifier-status).
- **Test the detector**: opens the [test dialog](#test-the-detector). It works even while the feature is off, but not in audit-only mode: the button is disabled, and hovering over it shows *"Audit-only mode — the detector doesn't run"*.

While the feature is off, every tab except **Settings** shows a banner: *"Protection is off — nothing is scanned or recorded. You can still try the detector."* The banner's **Settings** button takes you straight to the switch.

In an audit-only organisation, every tab shows the **Audit-only mode** banner instead: *"**Audit-only mode** — Prompt Injection Defense needs policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement. It is off: nothing is scanned or recorded, and your saved settings resume when enforcement is enabled. Past detections stay available under Overview and Audit log."* The **Overview** and **Audit log** tabs still show scans recorded before the move to audit-only mode, and the **Settings** tab is greyed out and view only. In the sidebar, **Injection Defense** is dimmed, with a lock icon and the tooltip **"Audit-only mode — view only"**. See [Configuration → Audit-only mode](./injection-defense/configuration.md#audit-only-mode).

The four tabs are **Overview**, **Audit log**, **Detectors** and **Settings**. The selected tab and any open scan are part of the page URL, so you can bookmark or share a link to a specific scan.

## Overview

The **Overview** tab summarises what the detector has seen. Use the period menu at the right of the tab bar to choose **Last 7 days**, **Last 30 days** (the default), **Last 90 days** or **Last 365 days**.

If nothing has been scanned in the period, the tab shows **No scans yet** (feature on) or **Protection is off** (feature off) instead of charts.

### Headline tiles

| Tile | Meaning |
|---|---|
| **Scans** | Requests that reached the detector in the period, passed or flagged |
| **Detections** | Flagged parts that acted (not suppressed). The hint shows how many scans were flagged. One scan can hold several detections. |
| **Blocked** | Scans whose outcome was *block* |
| **Quarantined** | Scans whose outcome was *quarantine* |
| **Pass rate** | Share of scans with nothing found |
| **Latency p95** | 95th-percentile time the detector added, over the last 7 days; the hint shows the median (p50) |

### Charts and cards

| Card | What it shows |
|---|---|
| **Detections over time** | Stacked bars per day, coloured by what the detector did (record, warn, quarantine, block), on the left axis. A line shows every request scanned, on the right axis. |
| **Where scans come from** | Scan volume by surface: Guard API, SDK, Auto-instrumented, Gateway, AI Connector (MCP), IDE / coding agent, OpenTelemetry, Scan API |
| **Why content was flagged** | Detections by [category](./injection-defense/overview.md#how-whiteout-inspects-content). A classifier-only detection counts under *classifier*. |
| **Found in** | Which part of the request carried the injection: user prompt, system prompt, retrieved document or tool result |
| **Top rules** | The rules that fired most often |
| **Top apps** | Custom AI Apps with the most detections |
| **Caught by** | Detections by tier: rules or classifier. *"Rules are exact patterns; the classifier catches what the rules miss."* |
| **Reviewed precision** | Confirmed attacks ÷ (confirmed + false positives), from your analysts' verdicts, with counts of confirmed, false positive and not-reviewed detections |

**Reviewed precision** is only as good as your reviews. It reflects the detections your team has marked, not a measured accuracy of the detector.

## Audit log

The **Audit log** tab lists *"every request that reached the detector — passed or flagged."* Passed requests keep metadata and a fingerprint of each part, never the text.

### Filters

| Filter | Options |
|---|---|
| **Result** | All, Flagged, Passed |
| **Action** | Any, passed, record, warn, quarantine, block |
| **Surface** | Any, or one of the eight surfaces |
| **Period** | 24 hours, 7 days, 30 days (default), 90 days, 365 days, All time |
| **User email** | Exact email address. Applies when you press Enter or leave the field. |
| **Content SHA-256** | Paste the SHA-256 of a text to find every scan of that exact content, without Whiteout ever storing the text |

### Columns

| Column | Meaning |
|---|---|
| **#** | The scan's position in your organisation's tamper-evident chain |
| **When** | Date and time of the scan |
| **Where** | The Custom AI App's name (with its surface underneath), or the surface |
| **Who** | The user's email, when the surface identifies one |
| **Scanned** | What the request held, e.g. *1 user prompt, 3 retrieved documents* |
| **Result** | **passed**, **record**, **warn**, **quarantine** or **block**, plus a **suppressed** chip when a suppression kept a hit from acting |
| **Why** | Up to three categories; for a classifier-only hit, the tier |
| **Score** | The highest score in the scan, 0–1 (flagged scans only) |
| **ms** | Time the detector took |

The newest scans come first. Click **Load older** at the bottom for more. Click any row to open the [scan drawer](#scan-drawer).

### Export

**Export** offers **CSV (spreadsheet)** or **JSON Lines (SIEM)**. The export uses the filters you've set and contains, per scan: sequence number, time, surface, app and gateway IDs, user email, result, action, highest score, tier, categories, detection and suppressed counts, detector version, whether the classifier was used, latency, request reference, the SHA-256 of each part, and the chain hashes (`prev_hash`, `row_hash`). Exports contain no scanned text and no excerpts. Each export is recorded in the admin Audit Log.

## Scan drawer

Clicking a scan opens **Scan #\<number\>** on the right.

**Summary**: the result chip, how many hits were suppressed, and the time, followed by the fields below.

| Field | Meaning |
|---|---|
| **Surface** | Where the request came from |
| **App** | The Custom AI App, linked to its page (app traffic only) |
| **User** | The user's email, when known |
| **Detector** | Detector version, **classifier on** or **rules only**, and latency |
| **Request** | The caller's reference for the request, when one was sent: a Guard evaluation ID, a connector *source:tool* pair, or an IDE source such as a file path |
| **Prompt** | **Open in Prompt Review**, when the scan belongs to a prompt recorded in Prompt Review (user-aware Custom AI App calls) |

**What was scanned**: one row per part (for example *Retrieved document #2 · 1,204 chars*) with its SHA-256 fingerprint and a copy button. *"Hash your own copy of a text to prove it's the one that was scanned."*

**Detections**: one card per flagged part, showing:

- the part (e.g. **Tool result #3**) and what was done to it, or **suppressed**
- the tier and score (e.g. **Rules · 0.92**), and your team's verdict if one exists
- the categories and the IDs of the rules that fired
- a short **excerpt** around the match, with personal data masked, if excerpts were on when the scan ran. Otherwise the card reads *"No excerpt kept for this detection (excerpts off when it was scanned)."*
- **Your verdict**: **Confirmed attack** or **False positive**, an optional note, and **Save**

**Suppressions that applied**: each suppression that covered a hit, with its reason, who created it, and whether it has since been revoked.

**Review history**: every verdict recorded on this scan's detections, newest first.

**Tamper evidence**: **Chain position**, **Row hash**, **Previous hash** and **Detections digest**. *"Opening this scan was recorded in the audit log."*

## Detectors

The **Detectors** tab explains how the detector works and lists its rules.

| Card | What it shows |
|---|---|
| **Tier 1 — Rules** | The number of patterns and the rule pack version, and how rules run on a normalised copy of the text |
| **Tier 2 — Classifier** | What the classifier does, its status chip (or **Off for your organization** when you've turned it off in Settings), and the score at or above which it flags content (0–1 scale) |
| **How a verdict is reached** | *"Documents and tool results: flagged if the rules OR the classifier flag them. A user's own prompt: only the rules can block; a classifier-only match is a warning, because it can't tell someone discussing an attack from one. Apps in monitor mode are never blocked."* |
| **Rules by category** | One expandable row per category with its description and rule count. Expand it to see every rule's ID, severity (critical, high, medium, low) and what it looks for. |
| **Audit log integrity** | **Verify now** walks your organisation's whole hash chain. See below. |

### Classifier status

| Status | Meaning |
|---|---|
| **Classifier on** | Rules plus the second-stage classifier |
| **Classifier loading** | The classifier is loading; rules are active meanwhile |
| **Rules only** | The classifier isn't enabled on this deployment, so detection uses the rules |
| **Classifier unavailable** | The classifier failed to load; detection falls back to the rules |

### Verify the chain

Every scan is chained to the one before it with a SHA-256 hash, so editing, removing or reordering any record breaks the chain. **Verify now** checks every record and reports one of:

- **Chain intact — N records verified (time).**
- **Chain broken at record #N: reason. N records before it verified.**

Each verification is itself recorded in the admin Audit Log. The chain proves the log hasn't been altered since it was written. It doesn't prove that every request in your environment was sent to the detector; see the coverage table in the [Overview](./injection-defense/overview.md#where-whiteout-checks).

## Settings

The **Settings** tab has three cards. Every control saves as soon as you change it. There is no separate Save button.

### Protection

*"Applies to your Custom AI Apps (Guard API, SDK, gateways), AI Connector results and IDE injection scans."* The classifier status chip sits at the top right; hover it for an explanation.

| Control | Options | Default |
|---|---|---|
| **On / Off — Prompt Injection Defense** | switch | **Off** |
| **When a user's own prompt is an injection** | Record only · Warn (let it through, flag it) · Block the prompt | **Warn** |
| **When a document or tool result carries instructions** | Record only · Quarantine the document (recommended) · Block the whole request | **Quarantine** |
| **Sensitivity** | Balanced (recommended) · Strict — catches more, more false alarms | **Balanced** |
| **Use the second-stage classifier** | switch | **On** |
| **Notify on detections** | switch | **On** |

The note under the controls reads: *"Documents flagged for quarantine are dropped from the model's context and the request goes ahead. A user's prompt is only ever blocked by a high-confidence rule; a classifier-only match on a user prompt is a warning. Apps in monitor mode are never blocked."* It is followed by the email of the admin who last changed the settings.

You can change every control while the feature is off. Setting your actions *before* you switch it on is the recommended way to start; see [Configuration → Recommended rollout](./injection-defense/configuration.md#recommended-rollout).

In an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation the whole **Settings** tab is greyed out and every control is disabled, including **Add suppression** and **Revoke**. Your saved settings are shown as they are and apply again once enforcement is enabled.

### What the audit log keeps

*"Every request that reaches the detector is recorded for as long as your organization uses Whiteout."*

- **Every request:** where it came from, who sent it, what kinds of content it held, a SHA-256 fingerprint of each part, the verdict and the detector version. The text of requests that pass is never stored.
- **Flagged content:** *keep a short excerpt around each match, with personal data masked.* This switch is **on** by default.

*"Excerpts are visible to admins and read-only auditors; opening a record and every export are logged. Turning this off stops new excerpts — rules, categories and scores are always kept."*

### Suppressions

*"Exceptions for content you trust — a matching hit is still recorded, but doesn't warn, quarantine or block. Every change is audited."*

The table lists each active suppression:

| Column | Meaning |
|---|---|
| **Suppresses** | A rule ID, or *All \<category\> rules*, plus *in \<part\>s* if limited to one kind of part |
| **Where** | A specific Custom AI App, or **All apps and surfaces** |
| **Reason** | Why it's safe, as entered |
| **Hits** | How many detections it has covered |
| **Added** | Date and the admin who added it |
| **Expires** | Expiry date, or *Revoked \<date\>* |

Turn on **Show revoked** to include revoked suppressions. **Revoke** ends one immediately. With no suppressions, the card reads *"No suppressions. Every detection acts."*

**Add suppression** opens a dialog. See [Configuration → Suppressions](./injection-defense/configuration.md#suppressions) for how to use it.

## Test the detector

**Test the detector** opens a dialog where you build a request the way your app would send it and see what the detector would do. *"A dry run — nothing is recorded or notified."*

1. Pick an example chip, **Everyday request**, **Jailbreak attempt**, **Poisoned document** or **Tool result hijack**, or start from a blank part.
2. For each part, choose its kind in **Part** (**User prompt**, **System prompt**, **Retrieved document**, **Tool result**) and paste up to 20,000 characters of text. **Add a part** adds another; the bin icon removes one.
3. Click **Check**.

The result panel shows:

- a verdict banner: the reason and what Whiteout **would** do (block, warn, record, or *quarantine the flagged part*), or *"Nothing detected — this request would pass."*, with the detector version, **classifier on** or **rules only**, and the time taken
- one card per part, with its outcome (**clean**, an action, or **suppressed**), the tier and score, and a score bar
- the part's text after normalisation, with **matched text highlighted**
- each rule that matched, with its ID, category, severity and description. *(found after decoding hidden text)* marks matches that only appeared after decoding.
- *"No rule matched — the classifier flagged this part."* when only the classifier fired

The test uses your current settings: sensitivity, actions, whether the classifier is on, and your active suppressions. It works while the feature is off, so you can tune before you enable anything. Read-only users can run it only while the feature is on. It isn't available in an [audit-only](./injection-defense/configuration.md#audit-only-mode) organisation, where the detector doesn't run.

## On a Custom AI App's page

Each app under **Coverage → Custom AI Apps** carries its own injection views:

- The app list's **Injection** tile shows detections over the last 7 days and links to this console's audit log.
- An app's **Overview** tab shows an **Injection** tile (*detections of scans*) and a **Prompt injection** card broken down by action, with **Open →**.
- An app's **Injection** tab is the same audit log, filtered to that app (without the Surface filter), with the same scan drawer.
- An app's **Activity** tab shows **Open the injection scan** on requests that were scanned.
