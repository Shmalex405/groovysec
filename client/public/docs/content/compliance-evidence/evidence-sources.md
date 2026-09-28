# Evidence Sources

Compliance Evidence collects nothing by hand. Every figure comes from data Whiteout AI already records while governing AI use. This reference lists all **24 evidence sources**: what each one measures, which Whiteout surface produces it, and when it reads **Present**, **Partial**, **Absent** or **Not deployed**. Use it to plan a deployment for an audit, or to explain a status to your assessor.

To see which controls use each source, see the [Control Catalog](./compliance-evidence/control-catalog.md). How source statuses combine into a control's status is covered in [Frameworks and Controls](./compliance-evidence/frameworks-and-controls.md#how-a-controls-status-is-worked-out).

## Which surface produces what

| Whiteout surface | Evidence it produces |
|------------------|----------------------|
| **Browser extension** | Runtime enforcement (prompts evaluated and blocked), Accountable Override records, monitoring coverage, tamper events |
| **Desktop Guard** | Runtime enforcement, Accountable Override records, AI tool inventory and shadow-AI findings (discovery), monitoring coverage, tamper events |
| **IDE plugins** (VS Code, JetBrains) | Runtime enforcement (IDE events and flags), monitoring coverage, prompt-injection detection |
| **Infrastructure agent and SDK** | Runtime enforcement (infrastructure calls), AI tool inventory (discovery), tamper-evident infrastructure log, agent tool-call governance, model output scanning, AI consumption limits, AI app and provider restrictions |
| **MDM integration** | AI tool inventory and shadow-AI findings (discovery), MDM-managed devices in monitoring coverage |
| **File scanning** | Runtime enforcement (file scans), Accountable Override records for files |
| **Identity provider sync and SCIM** | Identity and access lifecycle |
| **Whiteout AI Connector** | AI connector data access, connected data sources, agent tool-call governance |
| **SOC destinations** | SOC/SIEM forwarding |
| **Admin console** | Enforced AI-use policy, policy change history, admin audit trail, flagged-prompt review, AI app restrictions, AI System Register, AI consumption limits (spend-threshold notification rules) |
| **Prompt Injection Defense** | Prompt-injection detection |
| **Compliance engine health** | Degraded (fail-open) periods |

Evidence sources aren't limited to the frameworks you track: the same data backs every framework. Deploying one more surface can lift controls across several frameworks at once.

## Period evidence and current-state evidence

Most sources count what happened **during the period** you're viewing: prompts evaluated, policy changes, syncs, findings. A few describe **configuration as it stands now**, because Whiteout doesn't keep a history of that setting. Their drawer entries carry an "as of" time:

- **Enforced AI-use policy** (current configuration, plus daily snapshot history once you track a framework)
- **SOC/SIEM forwarding**
- **Connected data sources**
- **AI app and provider restrictions**
- **AI consumption limits**
- **AI System Register**
- **Event log history** and **Six months of log history**
- **Tamper-evident infrastructure log** (verified when you look)
- **Prompt-injection detection**, for whether Prompt Injection Defense is on now; its detections are counted for the period

User counts and roles in **Identity and access lifecycle** are also current; its sync runs are counted for the period. For a pack that covers a past period, current-state sources describe the configuration when the pack was generated. Daily [evidence snapshots](./compliance-evidence/frameworks-and-controls.md#daily-evidence-snapshots) fill in the history for policy, coverage, identity and inventory.

## The 24 evidence sources

### Inventory and discovery

**AI tool inventory**
AI tools found on endpoints and workloads during the period: desktop apps, IDE and browser extensions, local model runtimes, CLIs, SDK dependencies, model files and MCP server configurations. Figures: distinct tools, installs, unknown tools (not in Whiteout's catalog), tools with ungoverned installs, and tools by category. Sample rows: tool, category, provider, installs, ungoverned installs, last seen.

- **Present:** at least one AI tool was inventoried in the period.
- **Absent:** discovery is deployed, but no AI tools were inventoried in the period.
- **Not deployed:** none of Desktop Guard, the infrastructure agent or an MDM integration is enrolled.

**Shadow-AI findings**
Discovery findings for unsanctioned AI presence or activity: findings in the period, open, acknowledged and resolved, and the median hours from detection to acknowledgement. Sample rows: tool, finding type, status, first seen, acknowledged.

- **Present:** discovery is deployed, including when it raised no findings, since a clean result is evidence too.
- **Not deployed:** no discovery surface is enrolled.

**AI System Register**
How complete your [AI System Register](./compliance-evidence/ai-system-register.md) is: tools, tools fully recorded (owner, purpose and risk tier), unassessed, high risk, prohibited but still in use, and approved. Sample rows: tool, owner, risk tier, approved, purpose recorded (yes or no; the purpose text itself isn't sampled).

- **Present:** every inventoried AI tool has an owner, a purpose and a risk tier.
- **Partial:** some do.
- **Absent:** none do, or nothing is currently inventoried.
- **Not deployed:** no discovery surface is enrolled.

### Policy and change control

**Enforced AI-use policy**
Your AI-use rules per group: policy library rules enabled, custom rules, and whether Accountable Override is allowed. Figures: groups, groups with rules, library rules enabled, custom rules, and, once you track a framework, the daily history (days recorded, rules enabled at the first and last snapshot, days with no rules at all).

- **Present:** at least one group has library or custom rules enabled.
- **Absent:** no AI-use rules are enabled for any group.

**Policy change history**
Every policy change in the admin audit log during the period: number of changes, number of admins who made them, and changes by action. Sample rows: time, action, actor, entity.

- **Present:** at least one policy change in the period.
- **Absent:** no policy changes in the period. A stable policy is often the right answer; explain it in the control's note.

**Admin audit trail**
Every admin action during the period: count, number of people and actions by area. Sample rows: time, action, actor, entity. The admin audit log is append-only by design but isn't hash-chained, and the evidence says so.

- **Present:** at least one admin action in the period.
- **Absent:** none.

### Enforcement and oversight

**Runtime enforcement**
AI interactions Whiteout governed during the period: prompts evaluated and blocked (browser extension and Desktop Guard), IDE events and IDE events flagged, infrastructure calls and infrastructure calls blocked, and file scans. Sample rows: blocked prompts by data class, for example PII or PHI.

- **Present:** at least one interaction in the period.
- **Absent:** clients are deployed but nothing was evaluated in the period.
- **Not deployed:** no Whiteout client is enrolled.

In [audit-only mode](./compliance-evidence/overview.md#audit-only-discovery-mode), these counts are logged interactions that weren't evaluated against your rules, and nothing is blocked.

**Accountable Override records**
Overrides of blocked prompts and blocked files during the period, the share with a justification recorded, and how many groups allow override. Sample rows: time, who overrode, AI tool, and whether a justification was recorded. The justification text is never included, because it can quote the prompt.

- **Present:** there were overrides, or there was enforcement activity and no overrides.
- **Otherwise:** the same status as **Runtime enforcement**.

**Flagged-prompt review**
The number of flagged prompts administrators reviewed during the period.

- **Present:** at least one review in the period.
- **Absent:** none.

**Prompt-injection detection**
With **Prompt Injection Defense** on, this counts its detections in the period by surface (the Guard API and SDK, Whiteout AI Connector results and IDE scans) and by action taken. Only verdict metadata is kept, never the scanned text. With it off, it counts the prompt-injection attempts detected and blocked on IDE and coding-agent surfaces.

- **Present:** Prompt Injection Defense is on. Or, with it off, the IDE extension or Desktop Guard is deployed.
- **Partial:** Prompt Injection Defense is off now but recorded detections during the period.
- **Not deployed:** Prompt Injection Defense is off and neither the IDE extension nor Desktop Guard is deployed.

**Agent tool-call governance**
Tool calls by AI agents: infrastructure-agent tool calls and how many were blocked, Whiteout AI Connector tool calls by outcome, and infrastructure policy groups that evaluate tool calls.

- **Present:** agent or connector tool calls were seen in the period.
- **Absent:** tool-call governance is configured or the infrastructure agent is deployed, but no tool calls were seen.
- **Not deployed:** neither the infrastructure agent nor the Whiteout AI Connector is in use.

**Model output scanning**
Model responses scanned and flagged for policy violations, on infrastructure-agent and SDK traffic. Flags are recorded; the SDK doesn't block output.

- **Present:** at least one response was scanned or flagged in the period.
- **Absent:** the infrastructure agent is deployed but no responses were scanned.
- **Not deployed:** neither the infrastructure agent nor the SDK is in use.

**AI app and provider restrictions**
AI apps blocked for your organization or for groups, and infrastructure policy groups that restrict providers or models. Sample rows: control, target, scope.

- **Present:** at least one app, provider or model restriction is in force.
- **Absent:** none are configured.

**AI consumption limits**
Spend-threshold notification rules, per-call token limits on infrastructure policy groups, and spend thresholds crossed in the period. If per-hour rate limits are configured, the evidence notes that they are stored but not yet enforced server-side.

- **Present:** a spend threshold or token limit is configured.
- **Absent:** neither is configured.

### Monitoring and resilience

**Monitoring coverage**
Clients reporting during the period: devices per surface (Desktop Guard, browser extension, IDE), active infrastructure agents, MDM-managed devices, and the share of active users with a live Whiteout client. Once you track a framework, it adds the daily history: days recorded, and minimum and average daily user coverage.

- **Present:** at least one client reported in the period.
- **Absent:** clients are enrolled, but none reported in the period.
- **Not deployed:** no Whiteout clients are enrolled.

**Tamper and protection-state events**
Hook tampering, protection disabled on a device and protection restored, during the period. Sample rows: time, event, user.

- **Present:** any Whiteout client is deployed. No events is a valid result, meaning tamper monitoring was active and saw nothing.
- **Not deployed:** no client is enrolled.

**Degraded (fail-open) periods**
How many times, and for how many hours in total, the compliance engine was unavailable and clients failed open (allowed activity without a verdict) during the period.

- **Present:** always. *The compliance engine did not fail open in the period* is itself evidence.

**SOC/SIEM forwarding**
Whether events are forwarded to your SOC: destinations configured, enabled and currently failing. Sample rows: destination name, type, enabled, last delivery status and time. Destination endpoints and secrets are never included.

- **Present:** at least one destination is enabled, and none is failing.
- **Partial:** at least one enabled destination is failing.
- **Absent:** no destination is enabled.

### Logging

**Event log history**
How far back your AI-use and admin logs go, overall and per log (browser and desktop prompt activity, IDE activity, infrastructure activity, admin audit log). Whiteout has no configurable log-retention policy, so this shows history depth, not a retention policy.

- **Present:** logs exist.
- **Absent:** no AI-use or admin logs on record.

**Six months of log history**
The same measure, tested against six months (183 days), for EU AI Act Article 26(6).

- **Present:** logs go back at least six months.
- **Partial:** logs go back less than six months so far.
- **Absent:** no logs.

**Tamper-evident infrastructure log**
Verifies the hash chain over infrastructure-agent and SDK activity, reporting records checked and, if broken, where. Up to the oldest 200,000 records are verified, and the evidence says when that limit applied. Prompt and response text is outside the hash.

- **Present:** the chain verified.
- **Partial:** a break was detected.
- **Not deployed:** no infrastructure-agent or SDK activity is hash-chained.

### Identity and data access

**Identity and access lifecycle**
Users under role-based access (by role, and active), identity providers connected, and during the period: sync runs completed and failed, SCIM events and users deactivated by sync. Sample rows: sync start, type, status, users created, users deactivated.

- **Present:** an identity provider is connected and at least one sync succeeded in the period.
- **Partial:** no identity provider is connected, or none synced successfully in the period.

**AI connector data access**
Governed Whiteout AI Connector tool calls during the period, by user count, outcome and data source.

- **Present:** at least one connector tool call in the period.
- **Not deployed:** no connector activity in the period.

**Connected data sources**
Data sources connected under governance through **Integrations** > **Data Integrations**, organization-wide or per group.

- **Present:** at least one source is connected.
- **Not deployed:** none are connected.

## Content and privacy

Every source is **metadata only**. None of them read prompt, response, file, rule or override-justification text. Sample rows are capped at 25 per source. In evidence packs, end-user email addresses in sample rows are pseudonymized by default; see [Evidence Packs](./compliance-evidence/evidence-packs.md#email-addresses-and-pseudonyms).

All evidence is computed for your organization only.
