# Compliance Evidence

Auditors of an AI-governance programme ask much the same questions whatever framework you're assessed against. Which AI tools are in use? What are the rules? Are they enforced? Who can change them, and who did? Whiteout AI already records the answers as a side effect of governing AI use. **Compliance Evidence** maps that data onto the controls of the frameworks you're audited against. It shows, control by control, what Whiteout can evidence for a given audit period and what your organization has to evidence itself, and it packages the result for your auditor.

Compliance Evidence is **generally available** and switched on for every organization. There is no early-access switch and nothing to enable at the organization level. Each page carries a small **Compliance Evidence is new** banner, which you can dismiss once to hide it on every Compliance Evidence page in that browser.

> **Evidence, not certification.** Compliance Evidence gives you evidence that supports your audit. It does not certify you, and it can't make your organization compliant with any framework. Whether a control is met is your assessor's decision. The framework mappings are also new, and every framework is currently a **Draft mapping** (see [Draft mappings](#draft-mappings)). Review them with your auditor before you rely on them.

## What you can do

| Task | Where | Guide |
|------|-------|-------|
| Choose the frameworks you're audited against, and set each one's audit period and scope | **Frameworks** | [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md) |
| See every control's status for a period, the evidence behind it and the sample rows | **Frameworks** > a framework | [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md#review-a-frameworks-controls) |
| Record your own evidence against a control: state, owner, note, or a not-applicable justification | Control drawer > **Your record** | [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md#record-your-own-evidence) |
| Record an owner, intended purpose, risk tier and approval for every AI tool discovery has found | **AI Register** | [AI System Register](./compliance-evidence/ai-system-register.md) |
| Export one framework over one period as a ZIP for your auditor, on demand or on a schedule | **Evidence Packs** | [Evidence Packs](./compliance-evidence/evidence-packs.md) |
| Confirm that a pack you were handed is genuine and unaltered | **Evidence Packs** > **Verify a pack** | [Evidence Packs](./compliance-evidence/evidence-packs.md#verify-a-pack) |
| Push packs to Vanta or Drata | **Evidence Packs** > **GRC connections** | [GRC Connections](./compliance-evidence/grc-connections.md) |
| Look up which Whiteout data backs each control | Reference | [Evidence Sources](./compliance-evidence/evidence-sources.md), [Control Catalog](./compliance-evidence/control-catalog.md) |
| Get ready for an audit | Workflow | [Preparing for an Audit](./compliance-evidence/audit-preparation.md) |

## Where to find it

There are two ways into Compliance Evidence in the Whiteout AI admin console:

- **Sidebar:** **Governance** > **Compliance Evidence**. This opens the **Compliance frameworks** page.
- **Integrations:** **Integrations** > **Global Integrations** > **Compliance Evidence (GRC)**. The accordion header shows how many frameworks you track, for example *(2 tracked)*. Expand it to see the **Compliance Evidence** card, which shows:
  - how many frameworks are tracked, or **Not set up**;
  - **Register *n*/*m* complete**, once discovery has found AI tools;
  - one row per tracked framework, with its status bar and its evidenced and gap counts. Click a row to open that framework;
  - the **Frameworks**, **AI Register** and **Evidence Packs** buttons.

  If you don't track any framework yet, the card says so and offers **Enable a framework**.

Every Compliance Evidence page has a back button in its header. The **Frameworks**, **AI Register** and **Evidence Packs** pages go back to **Integrations**, and a framework's controls page goes back to **Frameworks**.

## Who can do what

Compliance Evidence is part of the admin console. End users (the **Member** role) don't see it.

| Action | Admin | Read-Only |
|--------|:-----:|:---------:|
| View frameworks, controls, evidence, sample rows and your organization's records | ✓ | ✓ |
| View the AI System Register | ✓ | ✓ |
| View and download generated evidence packs | ✓ | ✓ |
| Verify a pack | ✓ | ✓ |
| View GRC connections and their push history | ✓ | ✓ |
| Enable or disable a framework, set its audit period and scope note | ✓ | |
| Record your own evidence against a control | ✓ | |
| Edit AI System Register entries | ✓ | |
| Generate a pack, or create, edit or delete a scheduled pack | ✓ | |
| Add, edit, test, enable, disable or delete a GRC connection, or push a pack | ✓ | |

The **Read-Only** role suits an internal or external auditor who needs to follow the evidence without changing it. Read-Only users see every control and can download and verify packs, but edit controls are disabled for them and show *Read-only access*. To give someone the role, open the user's detail drawer and set their role to **Read-Only**.

If your organization requires the Administrator Terms to be accepted, Compliance Evidence is unavailable until an administrator accepts them, as with every other admin page.

## How it works

Compliance Evidence builds up in four layers, from raw Whiteout data to the pack your auditor keeps:

1. **Whiteout records what happens.** Every Whiteout surface you deploy produces data, and so does every admin change. The surfaces are the browser extension, Desktop Guard, IDE plugins, the infrastructure agent and SDK, MDM integrations, identity-provider sync, the Whiteout AI Connector and SOC forwarding. You don't collect anything specially for Compliance Evidence.
2. **Evidence sources summarize that data for a period.** Each of the 24 [evidence sources](./compliance-evidence/evidence-sources.md) answers one question about your organization over the audit period, such as *"was AI-use policy changed, and by whom?"* or *"what share of active users had a Whiteout client reporting?"*. It reports a finding, key figures, up to 25 sample rows and where the data comes from, plus a status: **Present**, **Partial**, **Absent** or **Not deployed**.
3. **Controls combine evidence sources.** Each control in the framework catalog is rated **Evidence**, **Supports** or **Customer-owned**, and names the evidence sources that back it. Its **status** for the period follows from its rating and those sources' statuses, for example **Evidenced**, **Partially supported** or **Gap**. You add your own record alongside.
4. **Packs freeze it for the auditor.** An evidence pack captures one framework over one period as a ZIP: a PDF report, CSV exports and a manifest of SHA-256 hashes, so anyone can later check the pack hasn't been altered.

Once you track at least one framework, Whiteout also takes **daily evidence snapshots** of your policy configuration, monitoring coverage, identity and AI inventory. Each is hashed when it's taken, so you can show how things stood on any day of the audit period, not only today. See [Daily evidence snapshots](./compliance-evidence/frameworks-and-controls.md#daily-evidence-snapshots).

## Supported frameworks

There are **15 frameworks with 188 controls** in five groups. Each framework is either the **full framework** or the **AI-relevant subset**: the controls where governed AI use produces evidence.

| Group | Framework | Scope | Controls |
|-------|-----------|-------|---------:|
| AI governance | ISO/IEC 42001 | Full framework (Annex A) | 38 |
| AI governance | NIST AI RMF 1.0 | AI-relevant subset | 20 |
| AI governance | NIST AI 600-1 Generative AI Profile | Full framework | 12 |
| AI governance | EU AI Act (deployer obligations) | AI-relevant subset | 10 |
| AI governance | Colorado AI Act (deployer duties) | AI-relevant subset | 5 |
| AI governance | Singapore Model AI Governance Framework for Generative AI | Full framework | 9 |
| AI security | OWASP Top 10 for LLM Applications (2025) | Full framework | 10 |
| Information security | ISO/IEC 27001:2022 Annex A | AI-relevant subset | 16 |
| Information security | SOC 2 (AI-relevant criteria) | AI-relevant subset | 8 |
| Information security | NIST Cybersecurity Framework 2.0 | AI-relevant subset | 12 |
| Information security | NIST SP 800-53 Rev. 5 | AI-relevant subset | 16 |
| Privacy | GDPR (AI use) | AI-relevant subset | 9 |
| Privacy | HIPAA Security and Privacy Rules (AI use) | AI-relevant subset | 10 |
| Sector regulation | NYDFS Cybersecurity Regulation (23 NYCRR 500) | AI-relevant subset | 7 |
| Sector regulation | DORA (Digital Operational Resilience Act) | AI-relevant subset | 6 |

Editions, rating counts and notes for each framework are in [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md#the-15-frameworks). Every individual control is listed in the [Control Catalog](./compliance-evidence/control-catalog.md).

Control IDs and short paraphrased titles are used throughout. Copyrighted standard text, such as ISO and AICPA wording, is not reproduced.

### Draft mappings

Every framework currently carries a **Draft mapping** badge. The control mappings were prepared by the Whiteout product team and have not yet been reviewed by an independent compliance specialist. Treat the ratings as a starting point for your assessor, not a conclusion. The badge appears on the **Compliance frameworks** page, on the framework's controls page, on the Integrations card and in **Generated packs**, and every pack built from a draft framework says so on its scope page.

You can't mark a mapping as reviewed yourself. The review status belongs to the framework catalog, which is the same for every customer. What you control is your own record against each control, where you can note your assessor's view. See [Record your own evidence](./compliance-evidence/frameworks-and-controls.md#record-your-own-evidence).

## Ratings and statuses at a glance

Each control has a fixed **rating** from the catalog:

| Rating | Meaning |
|--------|---------|
| **Evidence** | Whiteout data demonstrates the control. |
| **Supports** | Whiteout data helps, but the control also needs your own documented process. |
| **Customer-owned** | Whiteout produces no evidence for this control, for example impact assessments or staff training. Your own record is what counts. |

For the period you're looking at, each control then gets a **status**:

| Status | Meaning |
|--------|---------|
| **Evidenced** | Whiteout data demonstrates this control over the period. |
| **Partially evidenced** | Some of the evidence this control relies on was present; some was not. |
| **Supported** | Whiteout data supports this control; it also needs your own documented process. |
| **Partially supported** | Some supporting evidence was present; some was not. |
| **Customer-owned** | Whiteout produces no evidence for this control. You record your own progress against it. |
| **Gap** | The evidence this control relies on was absent in the period. |
| **Not applicable** | Your organization marked it not applicable, with a recorded justification. |

[How a control's status is worked out](./compliance-evidence/frameworks-and-controls.md#how-a-controls-status-is-worked-out) gives the exact rules.

## What the evidence contains

Evidence is **metadata only**: counts, identifiers, timestamps, tool and group names, and email addresses. It never contains prompt, response, file or override-justification text. For Accountable Override, for example, the evidence records *whether* a justification was given, never the justification itself.

In evidence packs, end-user email addresses are replaced with stable pseudonyms by default. Admin and Read-Only email addresses always appear, because auditors need to see who changed what. See [Email addresses and pseudonyms](./compliance-evidence/evidence-packs.md#email-addresses-and-pseudonyms).

## Audit-only (discovery) mode

Some organizations run Whiteout in **audit-only** mode, the discovery tier. In audit-only mode the compliance engine is never called: AI activity is logged, but prompts aren't evaluated against your rules and nothing is blocked. This changes what some evidence means:

- **Unaffected:** evidence that doesn't depend on evaluating prompts works as usual. That includes the AI tool inventory, shadow-AI findings, the AI System Register, monitoring coverage, tamper events, identity and access, the admin audit trail, policy change history, event log history, SOC forwarding and connected data sources.
- **Needs explaining:** the **Runtime enforcement** source counts logged AI interactions, and its summary line calls them *evaluated*, but in audit-only mode none of them were evaluated against your rules and none were blocked. Likewise, **Enforced AI-use policy** lists the rules configured for each group, but audit-only mode doesn't apply them. There will also be no Accountable Override records, because nothing is blocked for anyone to override.

So on an audit-only deployment, a control such as ISO/IEC 42001 A.9.2 or ISO/IEC 27001 A.8.12 can show **Evidenced** even though no rule was enforced. Don't present those controls as enforced:

- record the mode in each affected control's note, for example *"Audit-only (discovery) deployment: AI use monitored, not enforced"*. Your record prints on the control's page in every evidence pack;
- add the same line to each framework's scope note, so everyone working in the console sees it;
- walk your assessor through it.

Inventory, register and coverage evidence are still a strong basis for the "know what AI you use" controls that every framework starts with.

## Human-in-the-loop approvals are not AI-oversight evidence

Several frameworks ask for **human oversight of AI**, for example EU AI Act Article 26(2), NIST AI RMF MANAGE 4.1, NIST AI 600-1 GAI-7 (human-AI configuration) and Singapore SG-1 (accountability). Don't confuse this with any human-in-the-loop (HITL) approval workflow you use in Whiteout.

Compliance Evidence **does not** cite HITL approvals as AI-oversight evidence, and no control maps to them. Human-oversight evidence comes only from:

- **Accountable Override records:** a person who is blocked chooses to override, the server authorizes it and the person records a justification;
- **Flagged-prompt review:** administrators reviewing flagged prompts;
- **Shadow-AI finding acknowledgement:** administrators acknowledging discovery findings, with the time it took them.

Even with these, the human-oversight controls are rated **Supports**, not **Evidence**. The frameworks expect you to assign oversight to competent, authorized people, which is a process only you can document.

## Where Whiteout stops

Whiteout governs how people and systems use AI. It doesn't write your policies, run impact assessments, train staff or operate your incident process. Controls like those are rated **Customer-owned**, and every pack lists them with what your organization is expected to provide. The evidence has limits of its own, which every pack also states:

- The **admin audit log** is append-only by design but is not hash-chained. Infrastructure-agent and SDK activity is hash-chained and verifiable.
- Whiteout has **no configurable log-retention policy**. The evidence shows how far back your logs go; the retention policy itself belongs in your own documentation.
- **Policy and coverage history** starts on the day you first track a framework. Earlier configuration is covered by the policy change history only.
- **Coverage** reflects devices and workloads running a Whiteout client. AI use on unenrolled devices is visible only through discovery.
- An evidence pack's manifest proves the **pack** hasn't been altered since it was generated. It doesn't make the underlying logs tamper-proof.

## Get started

1. Open **Governance** > **Compliance Evidence** and switch on each framework you're audited against. Set its audit period. See [Track a framework](./compliance-evidence/frameworks-and-controls.md#track-a-framework).
2. Filter each framework to **Gaps & partial**, then deploy or configure what the gaps call for. Each control's drawer tells you what's missing.
3. Complete the [AI System Register](./compliance-evidence/ai-system-register.md): an owner, an intended purpose and a risk tier for every AI tool.
4. Work through the **Customer-owned** controls and record your own evidence against each one.
5. [Connect Vanta or Drata](./compliance-evidence/grc-connections.md) if your compliance team uses one.
6. [Schedule a monthly evidence pack](./compliance-evidence/evidence-packs.md#schedule-packs) for each framework, and give your auditor a Read-Only account.

For the full sequence, see [Preparing for an Audit](./compliance-evidence/audit-preparation.md).
