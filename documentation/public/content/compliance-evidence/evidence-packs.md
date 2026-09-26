# Evidence Packs

An evidence pack is one framework over one audit period, exported as a ZIP your auditor can keep. It contains everything on the Compliance Evidence pages plus the sample data behind it, and a manifest that proves nothing was changed after it left Whiteout.

Find it under **Integrations → Compliance Evidence → Evidence Packs**.

## What's in a pack

| File | Contents |
|------|----------|
| `report.pdf` | Scope and method, control matrix, a page per control (guidance, evidence findings, your record), AI System Register, evidence history, "where Whiteout stops" |
| `csv/controls.csv` | Every control with its rating, status, evidence and your record |
| `csv/evidence/*.csv` | The sample rows behind each evidence source |
| `csv/ai_register.csv` | The AI System Register |
| `csv/snapshots.csv` | Each daily evidence snapshot in the period, with its hash and whether it still matches |
| `manifest.json` | The SHA-256 hash of every file above, plus the framework, catalog version, period and organisation |

Packs are **metadata only**: they never contain prompt, response, file or override-justification text.

**End-user email addresses** are replaced with stable pseudonyms (`user-…`) by default, so the same person has the same pseudonym across packs. Administrator and auditor addresses always appear, because auditors need to see who changed what. You can choose to show end-user addresses when generating a pack; that choice is audit-logged and recorded in the manifest.

## Generate a pack

1. Choose a **framework**.
2. Choose the **period**: the framework's audit period (or the last 90 days if none is set), or custom dates.
3. Click **Generate pack**. Packs usually finish within a minute and appear under **Generated packs**.

Packs are kept for 90 days. Every download is audit-logged.

## Schedule packs

Under **Scheduled packs**, click **Schedule a pack** to generate one automatically, for example on the first of each month for the previous calendar month. Each run can be delivered:

- **By email**, as a secure download link valid for 7 days. Packs are never attached, because mail filters strip ZIP archives. Turn on **Include a download link in every delivery**.
- **To a notification channel** (Slack, Teams, webhook) or **a SOC destination**.
- **To a GRC platform** (Vanta or Drata). See [GRC Connections](./grc-connections.md).

Use **Send test** to generate and deliver a pack immediately.

## Verify a pack

Anyone with admin or read-only (auditor) access can check that a pack is genuine and unaltered:

1. Under **Verify a pack**, choose the pack's ZIP file, or just its `manifest.json`.
2. Whiteout reports one of:
   - **Verified**: byte-for-byte identical to the pack Whiteout generated, or every file matches its manifest if the archive was re-packed.
   - **Altered**: the pack came from your organisation but files have changed or are missing. The changed files are named.
   - **Not recognised**: no pack from your organisation has this hash.

Nothing is stored when you verify. Auditors outside the platform can also check each file's SHA-256 against `manifest.json` themselves, and compare the manifest's own hash with the one shown under **Generated packs**.

The manifest proves the pack is unaltered since it was generated. It does not make the underlying logs tamper-proof.
