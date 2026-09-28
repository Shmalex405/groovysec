# Frameworks and Controls

This guide covers the two pages where most Compliance Evidence work happens. On **Compliance frameworks** you choose what you're audited against. On each framework's controls page you review every control's status, drill into the evidence behind it and record your own evidence. For what Compliance Evidence is and who can use it, start with the [Compliance Evidence overview](./compliance-evidence/overview.md).

## The 15 frameworks

The catalog is the same for every customer, and each pack cites the version it used. **Evidence**, **Supports** and **Customer-owned** are the control ratings explained [below](#ratings).

| Framework | Edition | Scope | Controls | Evidence | Supports | Customer-owned |
|-----------|---------|-------|---------:|---------:|---------:|---------------:|
| **AI governance** | | | | | | |
| ISO/IEC 42001 | ISO/IEC 42001:2023 (EN ISO/IEC 42001:2026) | Full framework (Annex A) | 38 | 7 | 13 | 18 |
| NIST AI RMF 1.0 | NIST AI 100-1 (January 2023) | AI-relevant subset | 20 | 8 | 10 | 2 |
| NIST AI 600-1 Generative AI Profile | NIST AI 600-1 (July 2024) | Full framework | 12 | 3 | 5 | 4 |
| EU AI Act (deployer obligations) | Regulation (EU) 2024/1689, as amended by the Digital Omnibus on AI | AI-relevant subset | 10 | 1 | 5 | 4 |
| Colorado AI Act (deployer duties) | SB 24-205 (C.R.S. 6-1-1701 et seq.), as amended | AI-relevant subset | 5 | 0 | 2 | 3 |
| Singapore Model AI Governance Framework for Generative AI | IMDA / AI Verify Foundation (May 2024) | Full framework | 9 | 2 | 4 | 3 |
| **AI security** | | | | | | |
| OWASP Top 10 for LLM Applications | 2025 | Full framework | 10 | 4 | 3 | 3 |
| **Information security** | | | | | | |
| ISO/IEC 27001 Annex A (AI-relevant) | ISO/IEC 27001:2022 | AI-relevant subset | 16 | 10 | 5 | 1 |
| SOC 2 (AI-relevant criteria) | AICPA Trust Services Criteria (2017, revised points of focus 2022) | AI-relevant subset | 8 | 4 | 4 | 0 |
| NIST Cybersecurity Framework 2.0 (AI-relevant) | NIST CSWP 29 (February 2024) | AI-relevant subset | 12 | 6 | 4 | 2 |
| NIST SP 800-53 Rev. 5 (AI-relevant) | SP 800-53 Rev. 5.1 | AI-relevant subset | 16 | 9 | 6 | 1 |
| **Privacy** | | | | | | |
| GDPR (AI use) | Regulation (EU) 2016/679 | AI-relevant subset | 9 | 3 | 5 | 1 |
| HIPAA Security and Privacy Rules (AI use) | 45 CFR Parts 160 and 164 | AI-relevant subset | 10 | 7 | 2 | 1 |
| **Sector regulation** | | | | | | |
| NYDFS Cybersecurity Regulation (23 NYCRR 500) | As amended November 2023 | AI-relevant subset | 7 | 2 | 5 | 0 |
| DORA (Digital Operational Resilience Act) | Regulation (EU) 2022/2554 (applies from 17 Jan 2025) | AI-relevant subset | 6 | 3 | 3 | 0 |
| **Total** | | | **188** | **69** | **76** | **43** |

Some frameworks carry a note, which appears on every pack's scope page:

- **ISO/IEC 42001:** covers every Annex A control. Control IDs and paraphrased titles only; the standard's clause text is copyrighted.
- **NIST AI RMF 1.0:** the subcategories Whiteout's data touches, plus the governance subcategories auditors ask about most. Subcategories that aren't listed are customer-owned by default.
- **NIST AI 600-1:** organized by the profile's twelve generative-AI risk areas (GAI-1 to GAI-12). The profile's suggested actions sit under the AI RMF functions and are covered by the NIST AI RMF catalog.
- **EU AI Act:** deployer-side articles only. Article 26 applies to high-risk AI systems: Annex III obligations apply from 2 December 2027 after the Digital Omnibus, and Annex I from 2 August 2028. Article 50 transparency applies from August 2026. Re-verify the dates before relying on them.
- **Colorado AI Act:** deployer duties for high-risk AI systems that make consequential decisions. The effective date was moved to 30 June 2026; re-verify before relying on it.
- **Singapore:** the framework's nine dimensions. It is voluntary guidance.
- **OWASP Top 10 for LLM Applications:** for third-party AI tools, Whiteout governs your organization's side of each risk. For your own LLM applications, coverage depends on the infrastructure agent or SDK being in the request path.
- **NIST SP 800-53:** base controls only. NIST's AI-specific control overlays are still in development and aren't mapped yet.
- **HIPAA:** Security Rule safeguards and the Privacy Rule minimum-necessary standard. The proposed 2025 Security Rule amendments aren't mapped.
- **NYDFS:** read with DFS's 2024 guidance on AI-related cybersecurity risks.
- **DORA:** articles where governed AI use produces evidence for EU financial entities, treating AI vendors as ICT third-party service providers. Re-verify the article mapping against the regulatory technical standards before relying on it.

Every control, with its rating and the evidence sources behind it, is listed in the [Control Catalog](./compliance-evidence/control-catalog.md).

> **All 15 frameworks are draft mappings.** They were prepared by the Whiteout product team and haven't yet been reviewed by an independent compliance specialist. See [Draft mappings](./compliance-evidence/overview.md#draft-mappings).

## Ratings

Every control has one fixed rating, set in the catalog:

| Rating | Meaning | What you do |
|--------|---------|-------------|
| **Evidence** | Whiteout data demonstrates the control. | Make sure the evidence sources are present for the whole period, and deploy what's missing. |
| **Supports** | Whiteout data helps, but the control also needs your own documented process. | Keep the Whiteout evidence present *and* record where your own process is documented. |
| **Customer-owned** | Whiteout produces no evidence for this control. | Record your own evidence: state, owner and a note saying where it lives. |

Each **Supports** and **Customer-owned** control also says what your organization is expected to provide. It appears in the control's drawer under **Your record**, and in packs under *Organisation's responsibility*.

## Track a framework

**Compliance frameworks** (**Governance** > **Compliance Evidence**, or **Frameworks** on the Integrations card) lists every framework, grouped as **AI governance**, **AI security**, **Information security**, **Privacy** and **Sector regulation**.

Each framework card shows:

- the framework name, a **Full framework** or **AI-relevant subset** chip, and the **Draft mapping** chip;
- the edition, the number of controls and the rating counts, for example *38 controls · 7 evidence, 13 supports, 18 customer-owned*;
- a switch to track the framework, and a **Controls** button.

To start tracking:

1. Turn on the framework's switch. Whiteout confirms *Tracking \<framework\>. Daily evidence snapshots start today.*
2. The card expands. It shows the period the status is computed over, the share of controls that are evidenced or supported (for example *62% of controls evidenced or supported*), and a status bar with a legend.
3. Optionally, set the **Audit period from** and **to** dates. Leave both blank to use the last 90 days. The end date is inclusive, and an audit period can be at most three years long.
4. Optionally, add a **Scope note**, for example *Clinical and finance staff only*, up to 2,000 characters.
5. Click **Save**. Whiteout confirms *Audit period saved.*

Tracking a framework does three things:

- it adds the framework to the Integrations card and to the count in the accordion header;
- the **Frameworks** page and the card show its status for its audit period;
- it starts [daily evidence snapshots](#daily-evidence-snapshots) for your organization, if they aren't already running for another framework.

You can open any framework's controls, and generate a pack for it, without tracking it. An untracked framework just has no snapshot history. To stop tracking, turn the switch off. Your records against its controls are kept, and so is its snapshot history.

Every change to a framework (tracking on or off, audit period, scope note) is written to the admin audit log with the old and new values, and raises an administrator configuration-change notification.

## Review a framework's controls

Click **Controls** on a framework card, or a framework row on the Integrations card. The page title is the framework's name, with the edition and catalog version underneath.

Two banners can appear at the top of the page:

- **Draft mapping**, which appears on every framework at present.
- *This framework isn't tracked yet, so daily evidence snapshots aren't being recorded for it. The view below uses current data.* Click **Enable** to go to **Frameworks** and track it.

### Choose the period

The period card shows the period being viewed and a status bar with a legend. By default the period is the framework's audit period, or the last 90 days if none is set. To look at a different period, set **From** and **To** and click **Apply**. This changes the view only; it doesn't change the saved audit period.

### Filter and search

| Filter | Shows controls with status |
|--------|---------------------------|
| **All** | Every control |
| **Gaps & partial** | **Gap**, **Partially evidenced**, **Partially supported** |
| **Customer-owned** | **Customer-owned** |
| **Evidenced & supported** | **Evidenced**, **Supported** |

Controls marked **Not applicable** appear only under **All**. **Search controls** matches the control ID, title or area.

### The controls table

| Column | What it shows |
|--------|---------------|
| **Control** | The control ID, for example `A.9.4`, `GOVERN 1.6` or `Art. 26(6)` |
| **Title** | The paraphrased title, with the control's area underneath |
| **Rated** | **Evidence**, **Supports** or **Customer-owned** |
| **Status** | The derived status for the period. Hover for a one-line explanation. |
| **Evidence** | One chip per evidence source: **Present**, **Partial**, **Absent** or **Not deployed**. Hover a chip for the source's name and finding. |
| **Your record** | Your recorded state and owner. With no record, **Supports** and **Customer-owned** controls show *Not started*, and **Evidence** controls show *—*. |

Click any row to open the control's drawer.

## How a control's status is worked out

A control's status comes from its rating and the statuses of the evidence sources it relies on, over the period you're viewing:

| Rating | Every source **Present** | At least one **Present** or **Partial** | None **Present** or **Partial** |
|--------|--------------------------|-----------------------------------------|---------------------------------|
| **Evidence** | **Evidenced** | **Partially evidenced** | **Gap** |
| **Supports** | **Supported** | **Partially supported** | **Gap** |
| **Customer-owned** | **Customer-owned**, whatever the evidence | | |

One record overrides everything: if you mark a control **Not applicable**, with a justification, its status is **Not applicable** whatever its rating or evidence.

Nothing else you record changes the status. Marking a control **Implemented** doesn't turn a **Gap** into **Evidenced**. The status always reflects Whiteout's data, and your record sits alongside it for the auditor to read.

Each evidence source has one of four statuses:

| Evidence status | Meaning |
|-----------------|---------|
| **Present** | The evidence was there for the period. |
| **Partial** | Some of it was there. For example, an identity provider is connected but no sync succeeded in the period, or logs go back less than six months. |
| **Absent** | The relevant surface or setting exists, but there was nothing to show for the period, or nothing is configured. For example, no policy changes, or no SOC destination enabled. |
| **Not deployed** | The Whiteout surface that produces this evidence isn't deployed. The drawer says what to deploy. |

A **Gap** therefore doesn't always mean something is missing from your deployment. Some sources read **Absent** when the period was simply quiet, for example **Policy change history** when no policy was changed. The [Evidence Sources](./compliance-evidence/evidence-sources.md) reference gives the exact conditions for each source. When a quiet period is the true answer, say so in the control's note.

## The control drawer

The drawer shows everything behind one control for the period you're viewing, from top to bottom:

1. **Area, ID and title.**
2. **Status** and **Rated:** chips. Hover the status for its explanation.
3. **What Whiteout provides:** how the platform helps with this control.
4. **A deployment hint**, when a source is **Not deployed**. For example: *Deploy Desktop Guard, the infrastructure agent or MDM to build the AI inventory.*
5. **Evidence for this period:** one block per evidence source, with:
   - its name and status;
   - a one-line finding, for example *41 AI tools inventoried across 1,212 installs.*;
   - its key figures (percentages are shown as percentages; breakdowns by category or day are in the evidence pack CSVs);
   - up to 10 sample rows. When there are more, the drawer says *Showing 10 of N. Evidence packs include the full sample*, and packs include up to 25;
   - notes, for example that a figure reflects current configuration;
   - **Source:** the data tables and admin console pages the figures come from, so an auditor can trace them.
6. **Your record.** See below.

## Record your own evidence

The bottom of the drawer, **Your record**, is where you record what only your organization can say about the control. You can keep a record against any control, whatever its rating. Records matter most for **Supports** and **Customer-owned** controls.

When the control expects something from your organization, that's shown first. For example, for a customer-owned impact-assessment control, it says what the impact assessment should cover.

1. Choose a **State**:

   | State | Use it when |
   |-------|-------------|
   | **Not started** | Nothing is in place yet. This is the default. |
   | **In progress** | Work is under way. |
   | **Implemented** | Your part of the control is in place. |
   | **Not applicable** | The control doesn't apply to your organization. Requires a justification. |

2. Choose an **Owner**, any user in your organization, or **No owner**.
3. If you chose **Not applicable**, fill in **Why is this control not applicable?** Auditors will see this justification, and you can't save without one.
4. Add a **Note**, for example *where the evidence lives, what's outstanding…*. Notes and justifications can be up to 4,000 characters.
5. Click **Save**.

The drawer then shows *Last updated by \<email\> on \<date\>*. Every save is written to the admin audit log, with the old and new state and the owner.

A few things to know about records:

- **Records are per framework.** A record against ISO/IEC 27001 A.5.9 doesn't carry over to NIST SP 800-53 CM-8, even though both cover inventory.
- **Records reflect now.** A record isn't tied to a period. A pack prints each control's record as it stood when the pack was generated.
- **No file uploads.** Records hold text only. Put a link to, or the location of, the underlying document (policy, training log, impact assessment) in the note.
- **Records aren't mapping reviews.** Records can't change a control's rating or clear the **Draft mapping** badge. If your assessor disagrees with a rating, write their view in the note.

In packs, your record appears on each control's page under *Organisation's record*: the state, the owner, the note, any not-applicable justification, and who recorded it and when.

## Daily evidence snapshots

Much of what auditors ask about is state, not events. Was this rule on in July? What share of staff was monitored each day last quarter? Whiteout can only compute state like that for *now*. So while you track at least one framework, it records a snapshot once per UTC day:

| Snapshot | What it records |
|----------|-----------------|
| **Policy configuration** | For each group: library rules enabled (and which), custom rules, and whether Accountable Override is allowed. Totals across groups. |
| **Coverage** | Devices reporting per surface (Desktop Guard, browser extension, IDE), active infrastructure agents, MDM-managed devices, active users, users with a live Whiteout client and the resulting user-coverage percentage. |
| **Identity** | Users by role, active users, identity providers connected, sync runs completed and failed, SCIM events and users deactivated by sync. |
| **Inventory** | Distinct AI tools, installs, unknown tools, tools with ungoverned installs, tools by category, and the AI System Register summary. |

How snapshots work:

- The **first snapshot** is taken as soon as you first track a framework, so history starts that day.
- After that, one snapshot of each kind is taken **each UTC day**. It describes the **24 hours before** it was taken.
- **History isn't backfilled.** Snapshots can't be rebuilt for days before you started tracking, because past device activity and policy states can't be reliably reconstructed. For earlier policy history, the **Policy change history** evidence lists every policy change in the admin audit log.
- **Missed days stay missing.** If a day has no snapshot, the evidence says so, for example *Configuration recorded daily on 88 of 90 days in the period*, and never fills the gap in.
- **Every snapshot is hashed** (SHA-256 over its contents) when it's taken. Each pack re-checks every snapshot in its period against its hash and reports how many still match.
- **Snapshots stop** if you stop tracking every framework, and resume when you track one again.

The **Enforced AI-use policy** and **Monitoring coverage** evidence sources use the snapshots for their history. **Enforced AI-use policy** reports days recorded, rules enabled at the first and last snapshot and days with no rules. **Monitoring coverage** reports days recorded and the minimum and average daily user coverage. The pack's `csv/snapshots.csv` lists every snapshot in the period with its hash and whether it still verifies.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| A control shows **Gap** although the feature is in use | Open the drawer and look at each evidence source. A source can be **Absent** because nothing happened in the period (for example no policy changes, or no flagged prompts reviewed). Widen the period, or explain the quiet period in the note. |
| **Not deployed** on inventory, shadow-AI or register evidence | None of Desktop Guard, the infrastructure agent or an MDM integration is enrolled. Discovery needs at least one of them. |
| **Identity and access lifecycle** is **Partial** | No identity provider is connected, or none synced successfully in the period. Connect your IdP and run a sync. See the SSO provider guides, for example [Okta](./sso-providers/okta.md) or [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md). |
| **SOC/SIEM forwarding** is **Partial** or **Absent** | No SOC destination is enabled, or one is failing. See [SOC destinations](./soc-destinations/webhook.md). |
| **Six months of log history** is **Partial** | Your logs go back less than 183 days. It becomes **Present** once you have six months of history. |
| An evidence source says *This evidence could not be computed.* | A temporary error computing that source. It counts as **Absent**. Reload the page; if it persists, contact support. |
| Policy or coverage evidence says no snapshots fall in the period | You started tracking after the period ended, or you're viewing a framework you don't track. The figures show current state. |
| The switch or **Save** is greyed out | You have the **Read-Only** role. Ask an admin. |
| *Audit period can be at most three years* | Shorten the period. |
