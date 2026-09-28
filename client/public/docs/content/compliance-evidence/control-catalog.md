# Control Catalog

This reference lists all **188 controls** in the 15 frameworks Compliance Evidence supports. For each control it gives the rating and the [evidence sources](./compliance-evidence/evidence-sources.md) that back it. Use it to plan which Whiteout AI surfaces to deploy before an audit, or to show an assessor how a control is mapped.

The console is always the authoritative view. Each framework's controls page shows the same catalog, with your organization's live statuses, and each evidence pack cites the catalog version it used. The versions below were current when this page was written.

- **Rating** is fixed per control: **Evidence** (Whiteout data demonstrates it), **Supports** (Whiteout data helps; your own documented process is also needed) or **Customer-owned** (Whiteout produces no evidence; your own record is what counts). See [Ratings](./compliance-evidence/frameworks-and-controls.md#ratings).
- **Evidence sources** are the Whiteout data the control's status is computed from. A control's status for a period depends on whether these sources are present; see [How a control's status is worked out](./compliance-evidence/frameworks-and-controls.md#how-a-controls-status-is-worked-out).
- Titles are short paraphrases. Standard text that is copyrighted, such as ISO and AICPA wording, is not reproduced.

> **All frameworks are draft mappings.** The mappings were prepared by the Whiteout product team and haven't yet been reviewed by an independent compliance specialist. Treat them as a starting point for your assessor. See [Draft mappings](./compliance-evidence/overview.md#draft-mappings).

What your organization is expected to provide for each **Supports** and **Customer-owned** control is shown in the console, in the control's drawer under **Your record**, and in every evidence pack.

**Frameworks on this page:** ISO/IEC 42001 · NIST AI RMF 1.0 · NIST AI 600-1 · EU AI Act · Colorado AI Act · Singapore GenAI framework · OWASP Top 10 for LLM Applications · ISO/IEC 27001 · SOC 2 · NIST CSF 2.0 · NIST SP 800-53 · GDPR · HIPAA · NYDFS 23 NYCRR 500 · DORA

## ISO/IEC 42001

ISO/IEC 42001:2023 (EN ISO/IEC 42001:2026) · catalog `2026.09.26.1` · full framework · 38 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| A.2.2 | Maintain a documented AI policy | Supports | Enforced AI-use policy, Policy change history |
| A.2.3 | Align the AI policy with other organizational policies | Supports | Enforced AI-use policy |
| A.2.4 | Review the AI policy at planned intervals | Supports | Policy change history, Runtime enforcement |
| A.3.2 | Define AI roles and responsibilities | Supports | Identity and access lifecycle, Admin audit trail |
| A.3.3 | Provide a way to report AI concerns | Customer-owned | None (your record only) |
| A.4.2 | Document the resources AI systems use | Evidence | AI tool inventory |
| A.4.3 | Document data resources | Supports | Connected data sources |
| A.4.4 | Document tooling resources | Evidence | AI tool inventory, Shadow-AI findings |
| A.4.5 | Document system and computing resources | Supports | Monitoring coverage |
| A.4.6 | Document human resources and competence | Customer-owned | None (your record only) |
| A.5.2 | Establish an AI impact assessment process | Customer-owned | None (your record only) |
| A.5.3 | Document impact assessments | Customer-owned | None (your record only) |
| A.5.4 | Assess impacts on individuals and groups | Supports | Runtime enforcement |
| A.5.5 | Assess societal impacts | Customer-owned | None (your record only) |
| A.6.1.2 | Set objectives for responsible development | Customer-owned | None (your record only) |
| A.6.1.3 | Define responsible design and development processes | Customer-owned | None (your record only) |
| A.6.2.2 | Specify AI system requirements | Customer-owned | None (your record only) |
| A.6.2.3 | Document design and development | Customer-owned | None (your record only) |
| A.6.2.4 | Verify and validate the AI system | Customer-owned | None (your record only) |
| A.6.2.5 | Plan and control deployment | Supports | Monitoring coverage |
| A.6.2.6 | Operate and monitor the AI system | Evidence | Runtime enforcement, Monitoring coverage, Degraded (fail-open) periods, Tamper and protection-state events |
| A.6.2.7 | Maintain technical documentation | Customer-owned | None (your record only) |
| A.6.2.8 | Record AI system event logs | Evidence | Event log history, Tamper-evident infrastructure log, Admin audit trail |
| A.7.2 | Manage data used to develop and improve AI | Customer-owned | None (your record only) |
| A.7.3 | Govern how data is acquired | Customer-owned | None (your record only) |
| A.7.4 | Define and measure data quality | Customer-owned | None (your record only) |
| A.7.5 | Record data provenance | Supports | AI connector data access |
| A.7.6 | Control data preparation | Supports | Runtime enforcement |
| A.8.2 | Give users documentation and information | Supports | Runtime enforcement, Accountable Override records |
| A.8.3 | Accept external reports of adverse impacts | Customer-owned | None (your record only) |
| A.8.4 | Communicate AI incidents | Supports | SOC/SIEM forwarding |
| A.8.5 | Report information to interested parties | Customer-owned | None (your record only) |
| A.9.2 | Define processes for responsible use | Evidence | Runtime enforcement, Accountable Override records |
| A.9.3 | Set objectives for responsible use | Supports | Runtime enforcement, Flagged-prompt review |
| A.9.4 | Use AI only as intended | Evidence | AI app and provider restrictions, Enforced AI-use policy |
| A.10.2 | Allocate responsibilities with third parties | Customer-owned | None (your record only) |
| A.10.3 | Govern AI suppliers | Evidence | Shadow-AI findings, AI app and provider restrictions |
| A.10.4 | Address customer needs and expectations | Customer-owned | None (your record only) |

## NIST AI RMF 1.0

NIST AI 100-1 (January 2023) · catalog `2026.09.26.2` · AI-relevant subset · 20 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| GOVERN 1.1 | Legal and regulatory requirements for AI are understood and managed | Supports | Enforced AI-use policy |
| GOVERN 1.4 | Risk management is established through transparent policies and controls | Evidence | Enforced AI-use policy, Policy change history |
| GOVERN 1.5 | Ongoing monitoring and periodic review of AI risk are planned | Supports | Runtime enforcement, Policy change history |
| GOVERN 1.6 | Mechanisms are in place to inventory AI systems | Evidence | AI tool inventory, Shadow-AI findings |
| GOVERN 2.1 | Roles, responsibilities and lines of communication for AI risk are documented | Supports | Identity and access lifecycle, Admin audit trail |
| GOVERN 2.2 | Personnel receive AI risk management training | Customer-owned | None (your record only) |
| GOVERN 4.3 | Practices enable AI testing, incident identification and information sharing | Supports | SOC/SIEM forwarding, Tamper and protection-state events |
| GOVERN 6.1 | Policies address risks from third-party AI (including data and IP) | Evidence | AI app and provider restrictions, Shadow-AI findings |
| GOVERN 6.2 | Contingency processes handle failures of third-party AI | Supports | Degraded (fail-open) periods |
| MAP 1.1 | Intended purposes and contexts of use are understood and documented | Supports | AI System Register |
| MAP 4.1 | Legal and technology risks of third-party AI components are mapped | Supports | AI tool inventory, Connected data sources |
| MAP 5.1 | Likelihood and magnitude of each identified impact are documented | Customer-owned | None (your record only) |
| MEASURE 2.4 | AI system functionality and behavior are monitored in production | Evidence | Runtime enforcement, Monitoring coverage |
| MEASURE 2.7 | AI security and resilience are evaluated and documented | Supports | Tamper and protection-state events, Degraded (fail-open) periods |
| MEASURE 2.10 | Privacy risk of the AI system is examined and documented | Evidence | Runtime enforcement, Enforced AI-use policy |
| MEASURE 3.1 | Approaches are in place to identify and track emergent risks | Supports | Shadow-AI findings |
| MANAGE 2.4 | Mechanisms exist to supersede, disengage or deactivate AI systems | Evidence | AI app and provider restrictions |
| MANAGE 3.1 | Third-party AI risks are regularly monitored and controls applied | Evidence | Shadow-AI findings, AI app and provider restrictions, AI connector data access |
| MANAGE 4.1 | Post-deployment monitoring, including override and incident handling, is implemented | Evidence | Runtime enforcement, Accountable Override records, SOC/SIEM forwarding |
| MANAGE 4.3 | Incidents and errors are communicated to relevant parties | Supports | SOC/SIEM forwarding |

## NIST AI 600-1 — Generative AI Profile

NIST AI 600-1 (July 2024), companion to the AI RMF · catalog `2026.09.26.1` · full framework · 12 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| GAI-1 | CBRN information or capabilities | Customer-owned | None (your record only) |
| GAI-2 | Confabulation | Customer-owned | None (your record only) |
| GAI-3 | Dangerous, violent or hateful content | Supports | Model output scanning, Enforced AI-use policy |
| GAI-4 | Data privacy | Evidence | Runtime enforcement, Enforced AI-use policy |
| GAI-5 | Environmental impacts | Supports | AI consumption limits |
| GAI-6 | Harmful bias and homogenisation | Customer-owned | None (your record only) |
| GAI-7 | Human-AI configuration | Supports | Accountable Override records, Runtime enforcement |
| GAI-8 | Information integrity | Customer-owned | None (your record only) |
| GAI-9 | Information security | Evidence | Prompt-injection detection, Agent tool-call governance, Tamper and protection-state events |
| GAI-10 | Intellectual property | Supports | Runtime enforcement, Enforced AI-use policy |
| GAI-11 | Obscene, degrading or abusive content | Supports | Model output scanning, Enforced AI-use policy |
| GAI-12 | Value chain and component integration | Evidence | AI tool inventory, Shadow-AI findings, AI app and provider restrictions |

## EU AI Act — deployer obligations

Regulation (EU) 2024/1689, as amended by the Digital Omnibus on AI · catalog `2026.09.26.2` · AI-relevant subset · 10 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| Art. 4 | Ensure a sufficient level of AI literacy among staff | Supports | Runtime enforcement |
| Art. 5 | Do not use prohibited AI practices | Supports | AI tool inventory, AI System Register, AI app and provider restrictions |
| Art. 26(1) | Use high-risk systems in line with the provider's instructions | Customer-owned | None (your record only) |
| Art. 26(2) | Assign human oversight to competent, authorised people | Supports | Identity and access lifecycle, Accountable Override records |
| Art. 26(4) | Ensure input data is relevant and representative for the intended purpose | Supports | Runtime enforcement, Enforced AI-use policy |
| Art. 26(5) | Monitor operation and inform the provider of risks or serious incidents | Evidence | Runtime enforcement, Monitoring coverage, SOC/SIEM forwarding |
| Art. 26(6) | Keep automatically generated logs for at least six months | Supports | Six months of log history, Tamper-evident infrastructure log |
| Art. 26(7) | Inform workers' representatives before workplace use | Customer-owned | None (your record only) |
| Art. 27 | Carry out a fundamental rights impact assessment where required | Customer-owned | None (your record only) |
| Art. 50 | Disclose AI interaction, generated content and deep fakes where required | Customer-owned | None (your record only) |

## Colorado AI Act — deployer duties

SB 24-205 (C.R.S. 6-1-1701 et seq.), as amended · catalog `2026.09.26.2` · AI-relevant subset · 5 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| 6-1-1703(2) | Implement a risk management policy and program | Supports | Enforced AI-use policy, Policy change history |
| 6-1-1703(3) | Complete impact assessments, and review them annually | Customer-owned | None (your record only) |
| 6-1-1703(4) | Notify consumers and explain adverse consequential decisions | Customer-owned | None (your record only) |
| 6-1-1703(5) | Publish a statement on high-risk AI systems in use | Supports | AI tool inventory, AI System Register |
| 6-1-1703(7) | Disclose discovered algorithmic discrimination to the Attorney General | Customer-owned | None (your record only) |

## Singapore Model AI Governance Framework for Generative AI

IMDA / AI Verify Foundation (May 2024) · catalog `2026.09.26.1` · full framework · 9 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| SG-1 | Accountability | Supports | Identity and access lifecycle, Admin audit trail, Accountable Override records |
| SG-2 | Data | Evidence | Runtime enforcement, Enforced AI-use policy |
| SG-3 | Trusted development and deployment | Supports | Monitoring coverage, AI app and provider restrictions |
| SG-4 | Incident reporting | Supports | SOC/SIEM forwarding, Tamper and protection-state events |
| SG-5 | Testing and assurance | Supports | Event log history, Tamper-evident infrastructure log |
| SG-6 | Security | Evidence | Prompt-injection detection, Agent tool-call governance, Tamper and protection-state events |
| SG-7 | Content provenance | Customer-owned | None (your record only) |
| SG-8 | Safety and alignment research and development | Customer-owned | None (your record only) |
| SG-9 | AI for public good | Customer-owned | None (your record only) |

## OWASP Top 10 for LLM Applications

2025 · catalog `2026.09.26.1` · full framework · 10 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| LLM01 | Prompt injection | Supports | Prompt-injection detection |
| LLM02 | Sensitive information disclosure | Evidence | Runtime enforcement, Model output scanning, Enforced AI-use policy |
| LLM03 | Supply chain | Evidence | AI tool inventory, Shadow-AI findings |
| LLM04 | Data and model poisoning | Customer-owned | None (your record only) |
| LLM05 | Improper output handling | Supports | Model output scanning |
| LLM06 | Excessive agency | Evidence | Agent tool-call governance, AI connector data access |
| LLM07 | System prompt leakage | Customer-owned | None (your record only) |
| LLM08 | Vector and embedding weaknesses | Supports | Connected data sources, AI connector data access |
| LLM09 | Misinformation | Customer-owned | None (your record only) |
| LLM10 | Unbounded consumption | Evidence | AI consumption limits |

## ISO/IEC 27001 — Annex A (AI-relevant)

ISO/IEC 27001:2022 · catalog `2026.09.26.1` · AI-relevant subset · 16 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| A.5.9 | Inventory of information and other associated assets | Evidence | AI tool inventory |
| A.5.10 | Acceptable use of information and assets | Evidence | Enforced AI-use policy, Runtime enforcement |
| A.5.12 | Classification of information | Supports | Enforced AI-use policy, Connected data sources |
| A.5.14 | Information transfer | Evidence | Runtime enforcement |
| A.5.15 | Access control | Supports | AI app and provider restrictions, Identity and access lifecycle |
| A.5.18 | Access rights | Evidence | Identity and access lifecycle |
| A.5.19 | Information security in supplier relationships | Supports | AI tool inventory, AI app and provider restrictions |
| A.5.23 | Information security for use of cloud services | Evidence | AI app and provider restrictions, Shadow-AI findings, Runtime enforcement |
| A.5.24 | Incident management planning and preparation | Supports | SOC/SIEM forwarding |
| A.5.34 | Privacy and protection of PII | Evidence | Runtime enforcement, Enforced AI-use policy |
| A.6.3 | Information security awareness, education and training | Customer-owned | None (your record only) |
| A.8.2 | Privileged access rights | Evidence | Identity and access lifecycle, Admin audit trail |
| A.8.12 | Data leakage prevention | Evidence | Runtime enforcement, Model output scanning, Enforced AI-use policy |
| A.8.15 | Logging | Evidence | Event log history, Tamper-evident infrastructure log, Admin audit trail |
| A.8.16 | Monitoring activities | Evidence | Monitoring coverage, Tamper and protection-state events, Shadow-AI findings |
| A.8.32 | Change management | Supports | Policy change history |

## SOC 2 — AI-relevant criteria

AICPA Trust Services Criteria (2017, revised points of focus 2022) · catalog `2026.09.26.1` · AI-relevant subset · 8 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| CC6.1 | Logical access to information assets is restricted | Supports | AI app and provider restrictions, Connected data sources |
| CC6.2 | Users are registered, authorised and removed | Evidence | Identity and access lifecycle |
| CC6.3 | Access is role-based and follows least privilege | Evidence | Identity and access lifecycle, Admin audit trail |
| CC6.7 | Transmission of information is restricted to authorised parties | Evidence | Runtime enforcement, Enforced AI-use policy |
| CC7.2 | System components are monitored for anomalies | Evidence | Monitoring coverage, Tamper and protection-state events, Shadow-AI findings |
| CC7.3 | Security events are evaluated | Supports | SOC/SIEM forwarding |
| CC8.1 | Changes are authorised, documented and tracked | Supports | Policy change history, Admin audit trail |
| CC9.2 | Vendor and business-partner risk is assessed and managed | Supports | AI tool inventory, AI app and provider restrictions |

## NIST Cybersecurity Framework 2.0 (AI-relevant)

NIST CSWP 29 (February 2024) · catalog `2026.09.26.1` · AI-relevant subset · 12 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| GV.PO-01 | Cybersecurity risk management policy is established, communicated and enforced | Evidence | Enforced AI-use policy, Runtime enforcement |
| GV.SC-04 | Suppliers are known and prioritised by criticality | Supports | AI tool inventory |
| ID.AM-02 | Inventories of software, services and systems are maintained | Evidence | AI tool inventory, Shadow-AI findings |
| ID.AM-07 | Inventories of data and metadata are maintained | Supports | Connected data sources |
| PR.AA-05 | Access permissions are defined, managed and enforced | Evidence | Identity and access lifecycle, AI app and provider restrictions |
| PR.AT-01 | Personnel receive awareness and training | Customer-owned | None (your record only) |
| PR.DS-02 | Data in transit is protected | Evidence | Runtime enforcement |
| PR.PS-04 | Log records are generated and available for continuous monitoring | Evidence | Event log history, SOC/SIEM forwarding |
| DE.CM-03 | Personnel activity and technology usage are monitored | Evidence | Runtime enforcement, Monitoring coverage, Shadow-AI findings |
| DE.CM-09 | Computing hardware, software and their data are monitored | Supports | Tamper and protection-state events, Monitoring coverage |
| DE.AE-02 | Potentially adverse events are analysed | Supports | Flagged-prompt review, SOC/SIEM forwarding |
| RS.MA-01 | The incident response plan is executed with relevant parties | Customer-owned | None (your record only) |

## NIST SP 800-53 Rev. 5 (AI-relevant)

SP 800-53 Rev. 5.1 · catalog `2026.09.26.1` · AI-relevant subset · 16 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| AC-2 | Account management | Evidence | Identity and access lifecycle |
| AC-3 | Access enforcement | Evidence | AI app and provider restrictions, AI connector data access |
| AC-4 | Information flow enforcement | Evidence | Runtime enforcement, Enforced AI-use policy |
| AC-6 | Least privilege | Supports | Identity and access lifecycle |
| AT-2 | Literacy training and awareness | Customer-owned | None (your record only) |
| AU-2 | Event logging | Evidence | Runtime enforcement, Admin audit trail |
| AU-6 | Audit record review, analysis and reporting | Supports | Flagged-prompt review, SOC/SIEM forwarding |
| AU-9 | Protection of audit information | Supports | Tamper-evident infrastructure log |
| AU-11 | Audit record retention | Supports | Event log history |
| AU-12 | Audit record generation | Evidence | Runtime enforcement, Event log history |
| CM-8 | System component inventory | Evidence | AI tool inventory |
| CM-10 | Software usage restrictions | Evidence | AI app and provider restrictions, Runtime enforcement |
| CM-11 | User-installed software | Evidence | Shadow-AI findings, AI tool inventory |
| IR-6 | Incident reporting | Supports | SOC/SIEM forwarding |
| SI-4 | System monitoring | Evidence | Monitoring coverage, Tamper and protection-state events, Runtime enforcement |
| SR-6 | Supplier assessments and reviews | Supports | AI tool inventory |

## GDPR (AI use)

Regulation (EU) 2016/679 · catalog `2026.09.26.2` · AI-relevant subset · 9 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| Art. 5(1)(c) | Data minimisation | Evidence | Runtime enforcement, Enforced AI-use policy |
| Art. 5(1)(f) | Integrity and confidentiality | Evidence | Runtime enforcement, Tamper and protection-state events |
| Art. 25 | Data protection by design and by default | Supports | Enforced AI-use policy |
| Art. 28 | Use of processors | Supports | AI tool inventory, AI app and provider restrictions |
| Art. 30 | Records of processing activities | Supports | AI tool inventory, AI System Register, Runtime enforcement |
| Art. 32 | Security of processing | Evidence | Runtime enforcement, Identity and access lifecycle, Event log history |
| Art. 33 | Notification of a personal data breach | Supports | SOC/SIEM forwarding |
| Art. 35 | Data protection impact assessment | Customer-owned | None (your record only) |
| Art. 44 | General principle for transfers | Supports | AI app and provider restrictions |

## HIPAA Security and Privacy Rules (AI use)

45 CFR Parts 160 and 164 · catalog `2026.09.26.1` · AI-relevant subset · 10 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| 164.308(a)(1)(ii)(D) | Information system activity review | Evidence | Runtime enforcement, Flagged-prompt review, Admin audit trail |
| 164.308(a)(3) | Workforce security | Evidence | Identity and access lifecycle |
| 164.308(a)(4) | Information access management | Evidence | AI app and provider restrictions, Enforced AI-use policy |
| 164.308(a)(5) | Security awareness and training | Customer-owned | None (your record only) |
| 164.308(a)(6) | Security incident procedures | Supports | SOC/SIEM forwarding, Tamper and protection-state events |
| 164.308(b)(1) | Business associate contracts | Supports | AI tool inventory, AI app and provider restrictions |
| 164.312(a)(1) | Access control | Evidence | Identity and access lifecycle, AI app and provider restrictions |
| 164.312(b) | Audit controls | Evidence | Event log history, Tamper-evident infrastructure log, Admin audit trail |
| 164.312(e)(1) | Transmission security | Evidence | Runtime enforcement |
| 164.502(b) | Minimum necessary | Evidence | Runtime enforcement, Enforced AI-use policy |

## NYDFS Cybersecurity Regulation (23 NYCRR 500)

As amended November 2023 · catalog `2026.09.26.1` · AI-relevant subset · 7 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| 500.3 | Cybersecurity policy | Supports | Enforced AI-use policy, Policy change history |
| 500.6 | Audit trail | Evidence | Event log history, Tamper-evident infrastructure log, Runtime enforcement |
| 500.7 | Access privileges and management | Evidence | Identity and access lifecycle, Admin audit trail |
| 500.11 | Third-party service provider security policy | Supports | AI tool inventory, AI app and provider restrictions |
| 500.13 | Asset management and data retention | Supports | AI tool inventory, Event log history |
| 500.14 | Monitoring and training | Supports | Runtime enforcement, Monitoring coverage |
| 500.16 | Incident response and business continuity | Supports | SOC/SIEM forwarding, Degraded (fail-open) periods |

## DORA — Digital Operational Resilience Act

Regulation (EU) 2022/2554 (applies from 17 Jan 2025) · catalog `2026.09.26.1` · AI-relevant subset · 6 controls

| Control | Title | Rating | Evidence sources |
|---------|-------|--------|------------------|
| Art. 6 | ICT risk management framework | Supports | Enforced AI-use policy, Policy change history |
| Art. 8 | Identification of ICT assets and dependencies | Evidence | AI tool inventory, Shadow-AI findings |
| Art. 9 | Protection and prevention | Evidence | Runtime enforcement, Identity and access lifecycle |
| Art. 10 | Detection of anomalous activities | Evidence | Tamper and protection-state events, Shadow-AI findings, Monitoring coverage |
| Art. 17 | ICT-related incident management process | Supports | SOC/SIEM forwarding |
| Art. 28 | General principles of ICT third-party risk management | Supports | AI tool inventory, AI app and provider restrictions |

