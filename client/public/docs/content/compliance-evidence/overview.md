# Compliance Evidence

Auditors reviewing an AI-governance programme ask the same questions whichever framework you're certified against: which AI tools are in use, what the rules are, whether they're enforced, and who can change them. Whiteout AI already records the answers. **Compliance Evidence** maps that data onto the controls of the frameworks you're audited against, shows which controls are evidenced, and keeps a record of the controls only your organisation can evidence.

Find it under **Integrations → Compliance Evidence (GRC)**.

## Supported frameworks

| Group | Frameworks |
|-------|-----------|
| AI governance | ISO/IEC 42001 (all Annex A controls), NIST AI RMF 1.0, NIST AI 600-1 Generative AI Profile, EU AI Act (deployer obligations), Colorado AI Act, Singapore Model AI Governance Framework for Generative AI |
| AI security | OWASP Top 10 for LLM Applications (2025) |
| Information security | ISO/IEC 27001:2022 Annex A, SOC 2, NIST Cybersecurity Framework 2.0, NIST SP 800-53 Rev. 5 |
| Privacy | GDPR, HIPAA Security and Privacy Rules |
| Sector | NYDFS 23 NYCRR 500, DORA |

Apart from ISO/IEC 42001, each catalog covers the AI-relevant subset of the framework: the controls where governed AI use produces evidence. Control IDs and paraphrased titles are used throughout; copyrighted standard text is not reproduced.

> **Draft mappings.** A framework marked **Draft mapping** was prepared by the Whiteout product team and has not yet been reviewed by an independent compliance specialist. Treat its ratings as a starting point for your assessor. Evidence packs print this status on their scope page.

## How controls are rated

Every control carries one of three ratings, set in the framework catalog:

| Rating | Meaning |
|--------|---------|
| **Evidence** | Whiteout data demonstrates the control. |
| **Supports** | Whiteout data helps, but the control also needs your own documented process. |
| **Customer-owned** | Whiteout produces no evidence for this control, for example impact assessments or staff training. |

For your audit period, each control then gets a **status** worked out from its rating and the evidence found:

| Status | When |
|--------|------|
| Evidenced / Supported | Every evidence source the control relies on was present. |
| Partially evidenced / Partially supported | Some were present, some were not. |
| Gap | None were present. This usually means the relevant Whiteout surface isn't deployed; the control tells you which one. |
| Customer-owned | Your own record against the control is shown instead. |
| Not applicable | You marked it not applicable, with a justification auditors can read. |

## Enable a framework

1. Open **Integrations → Compliance Evidence → Frameworks**.
2. Switch on each framework you're audited against.
3. Optionally set the **audit period** and a **scope note** (for example "clinical and finance staff only"). With no audit period set, the last 90 days are used.

Enabling a framework starts **daily evidence snapshots** for your organisation: policy configuration, monitoring coverage, identity and AI inventory are recorded once a day and hashed, so you can show how things stood on any day of the audit period. History starts on the day you first enable a framework.

## Review controls and record your own evidence

Open a framework to see every control with its status for the period. Filter to **Gaps & partial** or **Customer-owned** to find what needs attention, or pick another period with the date controls.

Click a control to open its evidence:

- **What Whiteout provides**: how the platform helps with this control.
- **Evidence for this period**: each source with its finding, the key figures, sample rows and where the data comes from.
- **Your record**: set a state (Not started, In progress, Implemented, Not applicable), an owner and a note. Marking a control **Not applicable** requires a justification.

Every change is written to the admin audit log.

## AI System Register

Every framework asks first for an inventory of the AI systems in use. The **AI Register** lists every AI tool Whiteout's discovery has found (desktop apps, IDE extensions, local model runtimes, SDKs, MCP servers) and lets you record what only your organisation knows:

- **Business owner**
- **Intended purpose**
- **Risk tier**: minimal, limited, high, prohibited or unassessed
- **Approval** and next review date

An entry is complete once it names an owner, a purpose and a risk tier. Entries stay on the register, marked as no longer installed, if a tool is removed. The register backs controls such as NIST AI RMF MAP 1.1, EU AI Act Article 5, GDPR Article 30 and the Colorado AI Act's public-statement duty.

## What the evidence contains

Evidence is **metadata only**: counts, identifiers, timestamps and administrator email addresses. It never contains prompt, response, file or override-justification text.

## Where Whiteout stops

Whiteout governs how people and systems use AI. It does not write your policies, run impact assessments, train staff or operate your incident process. Those controls are marked Customer-owned. A few limits apply to the evidence itself:

- The admin audit log is append-only but not hash-chained. Infrastructure-agent and SDK activity is hash-chained and verifiable.
- There is no configurable log-retention policy. Evidence shows how far back logs go.
- Prompt-injection detection runs on IDE and coding-agent surfaces.

## Next steps

- [Evidence Packs](./evidence-packs.md): export a framework's evidence for your auditor.
- [GRC Connections](./grc-connections.md): push evidence packs to Vanta or Drata.
