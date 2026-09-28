# Evidence Packs

An evidence pack is **one framework over one period, exported as a ZIP your auditor can keep**. It holds a PDF report with the control matrix and a page for each control, CSV exports of the sample data behind every evidence source, the AI System Register, the daily snapshot list, and a `manifest.json` recording the SHA-256 hash of every file. With the manifest, anyone can later prove the pack hasn't been changed since Whiteout AI generated it.

Open it from **Governance** > **Compliance Evidence** > **Evidence Packs**, or with **Evidence Packs** on the Integrations card. The page is titled **Evidence packs** and has four sections: **Generate a pack**, **Generated packs**, **Scheduled packs** and **Verify a pack**. The **GRC connections** button in the page header manages pushes to Vanta and Drata; see [GRC Connections](./compliance-evidence/grc-connections.md).

## Generate a pack

Admins can generate packs; Read-Only users can download and verify them.

1. Under **Generate a pack**, choose a **Framework**. Frameworks you don't track are marked *(not tracked)*. You can still generate a pack for them, but without snapshot history.
2. Choose the period:
   - **Audit period**, shown when the framework has an audit period set, with the dates underneath. If the audit period hasn't ended yet, the pack runs from its start to now.
   - **Last 90 days**, shown instead when no audit period is set.
   - **Custom dates**: set **From** and **To**. The end date is inclusive, and a period can be at most three years long.
3. Leave **Show end-user email addresses** off unless your auditor needs real addresses. See [Email addresses and pseudonyms](#email-addresses-and-pseudonyms).
4. Click **Generate pack**. Whiteout confirms *Generating the \<framework\> pack…*

The pack appears at the top of **Generated packs** and updates by itself while it's generated, usually in under a minute. If the framework is a draft mapping, the form reminds you that *the pack will say so on its scope page*.

Up to three packs can be generating at once for your organization. A fourth request is refused with *Evidence packs are already being generated; try again shortly*.

## Generated packs

**Generated packs** lists your packs, newest first. Packs are **kept for 90 days** and then deleted. Downloads are audit-logged.

| Column | What it shows |
|--------|---------------|
| **Framework** | The framework, with a **Draft** chip for draft mappings and an **Emails** chip if end-user addresses are shown. *Scheduled* appears under packs made by a schedule. |
| **Period** | The period the pack covers |
| **Status** | Queued, running, completed or failed. Hover a failed pack for the reason. |
| **Generated** | When it completed, and who requested it (or *Schedule*) |
| **Size** | The ZIP's size |
| **Manifest SHA-256** | The first 16 characters of the manifest's hash. Click the copy icon for the full hash. |
| **Sent to** | One chip per GRC connection the pack was pushed to, green for success and red for failure. Hover for the reference or the error. |

Two actions sit at the end of each completed pack's row:

- **Download ZIP** downloads the pack. Every download is written to the admin audit log.
- **Send to a GRC platform**, the upload icon, pushes the pack's PDF to Vanta or Drata. It's available once an enabled connection exists; see [Push a pack](./compliance-evidence/grc-connections.md#push-a-pack).

Record the **Manifest SHA-256** of any pack you hand to an auditor, for example in your audit request tracker. It's how the pack can be verified later, including after Whiteout has deleted it.

## What's in a pack

The ZIP contains one folder, named `evidence-pack_<framework>_<start>-<end>`, for example `evidence-pack_iso42001_20260101-20260701`:

| File | Contents |
|------|----------|
| `report.pdf` | The human-readable report; see below |
| `csv/controls.csv` | Every control with its ID, area, title, rating, status, each evidence source's status (for example `ai_inventory=present; shadow_ai_findings=present`), your recorded state, owner and deployment hint |
| `csv/evidence/<source>.csv` | One file per evidence source the framework uses: its sample rows (up to 25), or its figures as `metric,value` pairs for sources without sample rows |
| `csv/ai_register.csv` | Every AI System Register row, including tools no longer installed |
| `csv/snapshots.csv` | Every daily snapshot in the period: date, kind, SHA-256 and whether it still matches its hash |
| `manifest.json` | The SHA-256 hash and size of every file above, plus the framework, catalog version, review status, period, organization, generation time, who generated it, whether end-user emails are shown, the status counts, and the enforcement mode over the period (`enforcement_mode`: `mode`, `days_observed`, `days_audit_only`) |

### The report

`report.pdf` opens with a cover (*Whiteout AI · Compliance Evidence Pack*, the framework, period, organization, and when and by whom it was generated). Then come these sections:

1. **Scope and method.** What the pack evidences and for which period, the catalog version, whether it covers the full framework or the AI-relevant subset, the draft-mapping notice where it applies, the framework's own note, an audit-only warning if your organization was in audit-only mode for any of the period, headline counts (**Controls**, **Evidenced**, **Partially evidenced**, **Supported**, **Customer-owned**, **Gaps**) and *How to read the ratings*.
2. **Control matrix.** Every control's ID, title, rating, status and owner on one table.
3. **A section per control.** The rating and status for the period, *What Whiteout provides*, a table of evidence sources with their status and finding, their notes, any deployment hint, *Organisation's responsibility* for **Supports** and **Customer-owned** controls, and *Organisation's record*: your state, owner, note, not-applicable justification, and who recorded it when.
4. **AI System Register.** Summary figures, then up to 100 tools with category, owner, risk tier and approval. The full list is in the CSV.
5. **Evidence history.** How many daily snapshots fall in the period and how many still match their hash, with a warning if any don't, or if there are none.
6. **Where Whiteout stops.** Every **Customer-owned** control with what your organization is expected to provide, and the known limits of the evidence (see below).
7. **About this pack.** How to verify it, and what it does and doesn't contain.

### Known limits of the evidence

Every pack lists these limits under *Where Whiteout stops*:

- The admin audit log and the browser, desktop and IDE prompt logs are append-only by design but are not hash-chained. Infrastructure-agent, SDK and Guard API activity, and the Prompt Injection Defense scan log, are hash-chained and verifiable.
- Whiteout has no configurable log-retention policy. The pack shows how far back AI-use and admin logs go; retention itself must be documented in your own policy. Tamper, protection-state and fail-open events are kept for 90 days, so periods older than that show none. Generated packs can be downloaded for 90 days; keep your own copy.
- Policy and coverage history starts on the day this framework was first enabled. Earlier configuration is shown through the policy change log only.
- Prompt Injection Defense is off unless an administrator turns it on, and always off in audit-only mode. When on, it runs server-side on the Guard API and SDK (Custom AI Apps, including trace ingest, which records only), on AI Connector tool results and on scans sent by the VS Code extension. It does not scan browser-extension, Desktop Guard or JetBrains traffic. When it is off, only IDE and coding-agent injection warnings are recorded.
- Human-oversight evidence comes from Accountable Override, flagged-prompt review and finding acknowledgement records.
- Coverage evidence reflects devices and workloads running a Whiteout client. AI use on unenrolled devices is visible only through discovery and egress observation.

If your organization was in [audit-only mode](./compliance-evidence/overview.md#audit-only-discovery-mode) on any day of the period, the pack adds one more limit, and shows the same text as a warning on the *Scope and method* page:

> **Audit-only mode.** This organisation was in audit-only mode for all or part of the period. In audit-only mode AI interactions are logged but not evaluated against policy, and nothing is blocked. Evidence for those days reflects logging, not enforcement: configured rules were not applied.

The mode is judged from the daily evidence snapshots in the period, plus the current mode for today, and is recorded in `manifest.json` under `enforcement_mode`: `mode` is `enforcing`, `audit_only` or `mixed`, with the number of days observed and the number in audit-only mode.

### How to use the CSVs

- Filter `csv/controls.csv` on `status` to list gaps, or on `attestation_state` to find customer-owned controls you haven't started.
- Each file in `csv/evidence/` is named after the evidence source's key. For example, `policy_change_log.csv` holds the policy changes, and `identity_lifecycle.csv` the IdP sync runs. The [Evidence Sources](./compliance-evidence/evidence-sources.md) reference explains every source.
- Cells that begin with `=`, `+`, `-` or `@` are prefixed with an apostrophe, so that spreadsheet software doesn't run them as formulas.

### What a pack never contains

Packs are **metadata only**. They never contain prompt, response, file, rule or override-justification text, destination endpoints or credentials. Your own notes against controls and register entries are included, because you wrote them for the auditor.

## Email addresses and pseudonyms

By default, a pack replaces **end-user** email addresses with stable pseudonyms of the form `user-3f9a1c0b2e`. The same person always gets the same pseudonym in your organization's packs, so an auditor can follow one person across packs without knowing who they are. Pseudonyms are specific to your organization.

**Admin** and **Read-Only** email addresses always appear as-is, because auditors need to see who changed policy, approved tools and recorded evidence.

If your auditor needs real end-user addresses, tick **Show end-user email addresses** when you generate or schedule the pack. That choice:

- is written to the admin audit log with the pack request;
- is recorded in the pack's `manifest.json` as `"end_user_emails": "shown"`;
- is flagged with an **Emails** chip in **Generated packs**.

Pseudonyms apply to what leaves Whiteout. Admins in the console always see real addresses.

## Schedule packs

A scheduled pack generates on a cadence and delivers to the destinations you choose, so evidence keeps flowing to your GRC team without anyone remembering to click. Scheduled packs are also stored in **Generated packs**, marked *Scheduled*.

1. Under **Scheduled packs**, click **Schedule a pack**. The dialog is titled **Schedule an evidence pack**.
2. Set up the pack:

   | Field | Options |
   |-------|---------|
   | **Name** | Defaults to *Evidence pack: \<framework\>* |
   | **Framework** | Any framework; untracked ones are marked *(not tracked)* |
   | **Period each run covers** | **Framework audit period (else last 90 days)**, **Last calendar month**, **Quarter to date**, **Last 30 days**, **Last 90 days** |
   | **Show end-user email addresses** | Off by default; see [above](#email-addresses-and-pseudonyms) |

3. Set the schedule:

   | Field | Options |
   |-------|---------|
   | **Schedule enabled** / **Schedule paused** | Pause without deleting |
   | **Cadence** | **Daily**, **Weekly** or **Monthly** (the default for a new pack) |
   | **Day of week** | For weekly packs |
   | **Day of month** | For monthly packs: 1 to 28 |
   | **Hour**, **Minute** | When the pack runs |
   | **Timezone** | The timezone for the schedule and for calendar-based periods |

4. Under **Destinations**, click **Add** and choose up to 10:

   | Destination | What it receives |
   |-------------|------------------|
   | **Email** | Up to 25 recipients. The email says the pack is a ZIP archive to download from Compliance Evidence, with a **Download report** button when the download link is on. The ZIP is never attached, because mail filters strip archives. |
   | **Notification channel** | A message to a Slack, Slack webhook, Microsoft Teams webhook or generic webhook channel from the Notification Center, with the link when it's on. |
   | **SOC destination** | A `report` event with the pack's period, headline counts, the ZIP's SHA-256 and the link when it's on. |
   | **GRC platform (Vanta, Drata)** | The pack's PDF, pushed through a [GRC connection](./compliance-evidence/grc-connections.md). |

5. Turn on **Include a download link in every delivery** for recipients who don't have console access. It's a signed link that expires after 7 days, and every use is audit-logged. With it off, recipients download the pack from the console.
6. Click **Save schedule**. Whiteout confirms *Scheduled pack created.*, and the dialog shows the schedule's next run time.

To check the destinations work, click **Send test** once the schedule is saved. Whiteout generates a pack immediately and delivers it to every destination: *Test pack generating — it will be delivered to the schedule's destinations.*

The **Scheduled packs** list shows each schedule's name, framework, period, cadence, next run and an **Active** or **Paused** chip. Click the edit icon to change a schedule, or **Remove schedule** in the dialog to delete it. Packs it already generated stay in **Generated packs** until they expire.

> **Recommended setup:** one schedule per tracked framework, **Monthly** on day 1, covering the **Last calendar month**, delivered to your GRC platform and to your compliance lead by email with the download link on. You then have a verifiable pack for every month of the audit period.

## Verify a pack

Verification confirms a pack came from your organization and hasn't been changed. Admins and Read-Only users can verify, and nothing is stored when you do.

1. Under **Verify a pack**, click **Choose a file**.
2. Select the pack's ZIP file (up to 30 MB), or just its `manifest.json`.

The result is one of:

| Result | Meaning |
|--------|---------|
| **Verified.** *The archive is byte-for-byte identical to the one Whiteout generated.* | You uploaded the original ZIP. |
| **Verified.** *Every file matches the manifest (the archive itself was re-packed).* | Someone extracted and re-zipped the pack, but every file is unchanged. |
| **Verified.** *The manifest matches; check each file's SHA-256 against it.* | You uploaded `manifest.json` on its own. It's genuine; to verify the other files, compare their hashes with it (see below). |
| **This pack has been altered since it was generated.** | The manifest is genuine, but files have changed or are missing. The result names them under **Changed:** and **Missing:**. |
| **Not recognised.** | No pack from your organization matches: *No evidence pack or manifest from your organization has this hash*, *The archive has no manifest.json*, or *The manifest does not match any pack from your organization — it may have been edited.* |

A verified result also names the framework, period, generation time and who requested the pack.

> **Verify within 90 days.** Verification matches against packs Whiteout still holds. Once a pack is deleted after 90 days, uploading it returns **Not recognised**, even though it's genuine. For older packs, compare the manifest hash with the one you recorded when you handed the pack over, and check the files by hand.

### Verify by hand

Auditors outside the platform can check a pack without a Whiteout account:

1. Compute the SHA-256 hash of `manifest.json` and compare it with the **Manifest SHA-256** recorded from **Generated packs**, or with the hash in the pack's GRC-platform description.
2. Compute the SHA-256 hash of every other file and compare it with its `sha256` entry in `manifest.json`.

```bash
# macOS / Linux, from inside the pack folder
shasum -a 256 manifest.json report.pdf csv/*.csv csv/evidence/*.csv
```

```powershell
# Windows PowerShell, from inside the pack folder
Get-ChildItem -Recurse -File | Get-FileHash -Algorithm SHA256
```

The manifest proves the **pack** is unaltered since it was generated. It doesn't make the underlying logs tamper-proof. For that, see the **Tamper-evident infrastructure log** and **Admin audit trail** entries in [Evidence Sources](./compliance-evidence/evidence-sources.md#logging).

## What gets logged

| Action | Admin audit log entry |
|--------|-----------------------|
| Generate a pack | `grc.pack.requested`, with the framework, period and whether end-user emails are shown |
| Download a pack from the console | `report.run.downloaded` |
| Download a pack from a signed link | `report.link.downloaded` |
| Push a pack by hand | `grc.pack.pushed`, with the connection and result |

Verifying a pack isn't logged, because nothing is stored.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| **Generate pack** is greyed out | You have the **Read-Only** role, no framework is selected, or the custom dates are incomplete or reversed. |
| *Evidence packs are already being generated; try again shortly* | Three packs are already generating. Wait for one to finish. |
| A pack failed with *The report exceeded the 25 MB limit* | The pack is too large. Generate it for a shorter period. |
| A pack failed with *Report generation failed. Try again; contact support if it persists.* | A temporary error. Generate it again. |
| The pack says no daily snapshots fall in the period | The period ends before you first tracked the framework, or you don't track it. Snapshots start the day you first track a framework. |
| An email recipient got no attachment | By design: packs are never attached. Turn on **Include a download link in every delivery**, or have them download it from the console. |
| **Send test** is greyed out | Save the schedule first, including any pending changes. |
| **Not recognised** for a pack you know is genuine | The pack is more than 90 days old, it came from a different Whiteout organization, or the manifest was edited. See [Verify by hand](#verify-by-hand). |
| **Notification channel** or **SOC destination** shows *(none configured)* | Set up a channel in the Notification Center, or a [SOC destination](./soc-destinations/webhook.md), first. Only Slack, Teams webhook and generic webhook channels can receive packs. |
