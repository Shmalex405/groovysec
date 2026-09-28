# Preparing for an Audit

This guide puts Compliance Evidence together into a workflow for an audit or assessment against any of the supported frameworks. It's written for the compliance or GRC lead who owns the audit, working with the security admin who runs Whiteout AI. Each step links to the detailed guide.

The single most important point: **start tracking a framework before your audit period begins.** Daily evidence snapshots, which show policy and coverage state *over* the period, start on the day you first track a framework and can't be backfilled.

## At a glance

| When | Step | Owner |
|------|------|-------|
| Before the audit period starts | [1. Agree scope and start tracking](#1-agree-scope-and-start-tracking) | Compliance lead |
| First weeks | [2. Close deployment gaps](#2-close-deployment-gaps) | Security admin |
| First weeks | [3. Complete the AI System Register](#3-complete-the-ai-system-register) | Compliance lead with business owners |
| First month | [4. Record your own evidence](#4-record-your-own-evidence) | Control owners |
| First month | [5. Review the mappings with your assessor](#5-review-the-mappings-with-your-assessor) | Compliance lead |
| Throughout the period | [6. Keep evidence flowing](#6-keep-evidence-flowing) | Security admin |
| Fieldwork | [7. Hand over to the auditor](#7-hand-over-to-the-auditor) | Compliance lead |

## 1. Agree scope and start tracking

1. Agree with your auditor which frameworks are in scope and the exact audit period.
2. In **Governance** > **Compliance Evidence**, turn on each in-scope framework. Set its **Audit period from** and **to** dates, and a **Scope note** describing what's in scope, for example *All employees in the EU entity; excludes contractors*. See [Track a framework](./compliance-evidence/frameworks-and-controls.md#track-a-framework).
3. If your auditor assesses against several frameworks, track them all. The same Whiteout data backs every framework, so there's no extra deployment effort per framework.

Audit period dates are whole UTC days, and the end date is inclusive.

## 2. Close deployment gaps

1. Open each tracked framework and filter to **Gaps & partial**.
2. Open each control. The drawer's hint says what's missing, for example *Deploy Desktop Guard, the infrastructure agent or MDM to build the AI inventory.* The [Evidence Sources](./compliance-evidence/evidence-sources.md) reference lists what makes each source **Present**.
3. Common fixes that lift controls across many frameworks:

   | Gap | Fix |
   |-----|-----|
   | Inventory, shadow-AI and register evidence **Not deployed** | Deploy Desktop Guard, the infrastructure agent or an MDM integration for discovery. For fleet rollout, see [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md). |
   | **Identity and access lifecycle** **Partial** | Connect your identity provider and let it sync, for example [Okta](./sso-providers/okta.md) or [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md). SCIM is covered in [Groups, Users and SCIM](./sso-providers/groups-users-scim.md). |
   | **SOC/SIEM forwarding** **Absent** | Add a SOC destination, for example [Splunk HEC](./soc-destinations/splunk-hec.md) or a [webhook](./soc-destinations/webhook.md). |
   | **Enforced AI-use policy** **Absent** | Enable AI-use rules for your groups. If rules are configured and it's still **Absent** or **Partial**, your organization was in [audit-only mode](./compliance-evidence/overview.md#audit-only-discovery-mode) for all or part of the period, so the rules weren't enforced. |
   | **Runtime enforcement** **Absent** or **Partial** with activity logged | Audit-only mode was on for all or part of the period; the summary gives the number of audit-only days. This is accurate, not a fault: record the deployment mode in the control's note. |
   | **AI app and provider restrictions** **Absent** | Block the AI apps or providers your policy doesn't allow. |
   | **Tamper-evident infrastructure log** or **Model output scanning** **Not deployed** | Deploy the [infrastructure agent](./infrastructure/agent-quickstart.md) or an SDK ([Python](./developers/python-sdk.md), [Node.js](./developers/node-sdk.md)) for your own AI workloads. |

4. Not every gap needs fixing. If a gap reflects a genuine scoping decision, record it (step 4). If it reflects a quiet period, for example no policy changes, explain it in the control's note.

## 3. Complete the AI System Register

Every framework asks first what AI you use. In the [AI System Register](./compliance-evidence/ai-system-register.md):

1. Turn on **Only incomplete**.
2. For every tool, record a **Business owner**, an **Intended purpose** and a **Risk tier**, and tick **Approved for use** where it's approved.
3. Act on any **Prohibited, still in use** tools: block them, or record why they remain.
4. Set **Next review** dates that match your governance cadence.

The register's evidence source reads **Present** only when *every* inventoried tool is complete.

## 4. Record your own evidence

Filter each framework to **Customer-owned**, then work through the **Supports** controls. For each one, open the drawer and fill in **Your record**:

- a **State**: **Not started**, **In progress**, **Implemented** or **Not applicable**;
- an **Owner** who is accountable for the control;
- a **Note** saying where the evidence lives, for example *AI acceptable-use policy v3, approved by the CISO 2026-03-02, stored in the policy library*, and what's outstanding;
- for **Not applicable**, a justification your auditor will read.

Records hold text, not files, so point to the documents rather than attaching them. See [Record your own evidence](./compliance-evidence/frameworks-and-controls.md#record-your-own-evidence).

## 5. Review the mappings with your assessor

Every framework is currently a **Draft mapping**: it was prepared by the Whiteout product team and hasn't yet been reviewed by an independent compliance specialist. Before fieldwork:

1. Generate a pack for each framework and share it with your assessor. The [Control Catalog](./compliance-evidence/control-catalog.md) is a convenient overview.
2. Ask them to flag any control where they disagree with the rating, or where they need more than the evidence shown.
3. Record their view in the control's note. You can't change a rating, but the note prints on the control's page in every pack.

## 6. Keep evidence flowing

1. [Schedule a pack](./compliance-evidence/evidence-packs.md#schedule-packs) per framework: **Monthly**, **Day of month** 1, covering the **Last calendar month**.
2. Deliver it to your GRC platform through a [GRC connection](./compliance-evidence/grc-connections.md), and by email to the compliance lead with **Include a download link in every delivery** on.
3. Each month, check:
   - **Generated packs**: every scheduled pack completed, and **Sent to** is green;
   - the pack's *Evidence history*: snapshots were recorded on every day, and all still verify;
   - the AI System Register: new tools are recorded.
4. Download each monthly pack and store it with your audit evidence. Whiteout deletes packs after 90 days.

## 7. Hand over to the auditor

1. **Give the auditor a Read-Only account** so they can browse frameworks, controls, evidence and the register themselves, download packs and verify them, without being able to change anything. See [Who can do what](./compliance-evidence/overview.md#who-can-do-what).
2. **Generate the final pack** for the full audit period, and record its **Manifest SHA-256** in your audit request tracker.
3. **Walk them through the pack**: *Scope and method*, the *Control matrix*, then *Where Whiteout stops*, which lists the customer-owned controls and the known limits of the evidence.
4. **Answer sample requests from the CSVs.** `csv/evidence/` holds up to 25 sample rows per evidence source, and `csv/controls.csv` the full control list. If the auditor needs to trace a sample back to a person, you can generate a pack with **Show end-user email addresses** on; that choice is audit-logged.
5. **Let them verify the pack** under **Verify a pack**, or [by hand](./compliance-evidence/evidence-packs.md#verify-by-hand) against the manifest.

### What to tell your auditor

- **It's evidence, not an opinion.** Every status is computed from Whiteout data for the stated period, with its source named. Nothing is a hand-typed tick box.
- **The mappings are drafts.** Ratings are the Whiteout product team's mapping, not yet independently reviewed.
- **Metadata only.** No prompt, response, file or justification text is included. End users are pseudonymized unless you chose otherwise.
- **Integrity has a boundary.** The manifest proves the pack is unaltered since it was generated. Infrastructure-agent, SDK and Guard API activity, and the Prompt Injection Defense scan log, are hash-chained. The admin audit log and the browser, desktop and IDE prompt logs are append-only but not hash-chained.
- **History starts when tracking started.** Daily snapshots begin the day you first tracked the framework. Earlier policy history comes from the admin audit log.
- **Retention is yours.** Whiteout shows how far back logs go, but it has no configurable retention policy. Your retention policy is your own documentation. Tamper, protection-state and fail-open events are kept for 90 days, and generated packs can be downloaded for 90 days, so keep your own copy of every pack you hand over.
- **Audit-only deployments.** If you ran in [audit-only mode](./compliance-evidence/overview.md#audit-only-discovery-mode) on any day of the period, AI use was monitored but not enforced on those days. The pack says so on its *Scope and method* page and in its known limits, and rates enforcement evidence **Absent** or **Partial** accordingly. Say so up front too.
- **HITL isn't oversight.** Human-oversight evidence comes from Accountable Override, flagged-prompt review and finding acknowledgement, never from HITL approvals. See [the overview](./compliance-evidence/overview.md#human-in-the-loop-approvals-are-not-ai-oversight-evidence).

## FAQ

**Does Compliance Evidence make us compliant, or certify us?**
No. It produces evidence that supports your audit. Whether a control is met, and whether you're certified, is your assessor's decision.

**Do we need to turn Compliance Evidence on?**
No. It's generally available to every organization. You only choose which frameworks to track.

**Can we change a control's rating, or add our own controls or frameworks?**
No. The catalog is the same for every customer, and packs cite its version. Record your assessor's view, or your own scoping, in the control's note, or mark a control **Not applicable** with a justification.

**Why does a control show Evidenced when we haven't done anything specific for it?**
Because Whiteout data demonstrates it for the period. For example, discovery evidences an AI inventory control without extra work. Open the drawer to see exactly which data. In audit-only mode, enforcement evidence is never rated as present; see [Audit-only (discovery) mode](./compliance-evidence/overview.md#audit-only-discovery-mode).

**We marked a control Implemented. Why is it still a Gap?**
Your record doesn't change the computed status; only **Not applicable** does. The status reflects Whiteout's data, and your record sits alongside it. Fix the underlying gap, or explain it in the note.

**Can we upload documents, such as policies or training records, as evidence?**
Not in Compliance Evidence. Records hold text notes of up to 4,000 characters. Note where the document lives. If you use Vanta or Drata, keep the documents there alongside the pushed packs.

**Why is there no policy or coverage history before a certain date?**
Daily snapshots start on the day you first track a framework, and earlier days can't be reconstructed. The **Policy change history** evidence still lists every policy change in the admin audit log for the period.

**Can we look at a past period?**
Yes. Choose any period on a framework's controls page, or generate a pack with custom dates. Event-based evidence covers any period for which your logs exist; snapshot history only covers days since you started tracking.

**Is our prompt content ever in a pack or sent to Vanta or Drata?**
No. Evidence is metadata only, and only the pack's PDF is pushed to a GRC platform.

**Are records shared between frameworks?**
No. Each framework's controls have their own records, even where two controls cover similar ground.

**What happens if we stop tracking a framework?**
Its records and snapshot history are kept. If you stop tracking every framework, daily snapshots stop until you track one again.

**How long are packs kept?**
90 days. Download and archive the packs you need to keep, and record their manifest hashes. After 90 days, verification in the console returns **Not recognised**, but you can still [verify by hand](./compliance-evidence/evidence-packs.md#verify-by-hand).

**Which GRC platforms are supported?**
Vanta and Drata. For other platforms, download the pack and upload it yourself, or deliver it by email, to a webhook or to your SOC on a [schedule](./compliance-evidence/evidence-packs.md#schedule-packs).

**Can an external auditor use Compliance Evidence directly?**
Yes. Give them a user with the **Read-Only** role. They can view everything, download packs and verify them, but can't change anything.

## Troubleshooting

Each guide has its own troubleshooting table:

- [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md#troubleshooting): unexpected **Gap** or **Partial** statuses, missing snapshot history.
- [AI System Register](./compliance-evidence/ai-system-register.md#troubleshooting): empty register, missing tools or owners.
- [Evidence Packs](./compliance-evidence/evidence-packs.md#troubleshooting): failed packs, email delivery, verification.
- [GRC Connections](./compliance-evidence/grc-connections.md#troubleshooting): Vanta and Drata test and push errors.
