# Infrastructure Agent Quickstart

The Whiteout AI Infrastructure Agent brings governance to the AI usage that never touches a browser or desktop app: coding agents on build hosts, LLM calls from server workloads, CI/CD jobs, and hosted agents in your cloud account. This guide walks you from an empty dashboard to a live, reporting agent on your first resource.

Two design decisions shape everything below:

- **No proxy, no MITM.** The agent is never in the request path. It observes — session transcripts, tapped traffic, or egress metadata — and reports to your Whiteout backend. The one exception that can block in-line is the in-process SDK, which you explicitly compile into your own application.
- **Fail-open by design.** A crashed or unreachable agent never takes your workload down with it. Liveness monitoring in the dashboard exists precisely so a silent agent is a visible event, not a silent coverage gap.

---

## Before You Start

| Requirement | Detail |
|-------------|--------|
| **Admin access** | The Infrastructure pages require the admin role |
| **A resource to enroll** | VM, EC2 instance, EKS pod, ECS task, or Lambda |
| **Outbound HTTPS** | The resource must reach your Whiteout backend URL |
| **The agent binary** | `whiteout-agent`, provided with your license (Linux amd64/arm64, macOS) |

---

## Step 1 — Create a Resource Policy Group

**Infrastructure → Resource Policies → New group.**

A policy group is the unit of governance for infrastructure: every agent enrolled under it inherits the group's posture. Configure:

- **Enforcement mode** — `monitor` (observe and record), `warn`, or `enforce`. Start with `monitor`; you can graduate a group later without touching any agent.
- **Fail behavior** — `open` or `closed`, for the SDK path when the backend is unreachable.
- **Data capture** — `full` (prompt and payload text), `metadata_only` (events without content), or `none`.
- **Guardrails** — model allowlist, blocked providers, per-call token budget, hourly rate limit.

> **Audit-only organizations.** If your organization runs in [audit-only mode](./governance/audit-only-mode.md), nothing is blocked, whatever the group says. Agents and the SDK are sent a non-blocking posture: `monitor` mode, fail-open, and no model allowlist, blocked providers, token budget or rate limit. The group's own settings are kept, and the configuration served to agents lists them under `configured`. Checks still run on the backend: a call that a provider, model or token rule would have blocked is recorded in the **Activity** tab with the rule, and isn't marked as blocked. SDK evaluations return `allow` in `monitor` mode, with `"enforced": false` and `"would_action"` when the group's mode would have acted. Your settings apply again from the next policy refresh once enforcement is enabled.
>
> In audit-only mode the group's enforcement settings are also **view only**. On **Infrastructure → Resource Policies**, **Enforcement**, **On Failure**, **Evaluate tool calls**, **Infrastructure Rules**, **Content Policies** and **Compliance Engine (Premium)**, including its connection test, are greyed out under a banner that reads *"**Audit-only mode** — Enforcement modes, infrastructure rules, content policies and the compliance engine need policy enforcement, which isn't enabled for your organization. You can review the settings here, but changes are disabled. Contact your account team to enable enforcement. Name, data capture, classification and alerting stay editable."* You can still create a group (it starts with the default enforcement settings, `monitor` and no rules), rename it, change its description, data capture, classification and alerting, and delete it. Through the API, a create or update that sets or changes a locked field, a content-policy change and a connection test are rejected with HTTP 403: *"Policy enforcement is not included in this tier (audit-only / discovery)."*

## Step 2 — Mint an Enrollment Token

**Infrastructure → Enrollment → New token**, bound to the policy group from Step 1.

The token is the agent's credential and its group membership in one value. Treat it as a secret: it is shown once, and every agent that presents it lands in that group.

## Step 3 — Install the Agent

The agent is a single static Go binary configured entirely by environment variables. On a VM or EC2 instance, run it as a systemd service; on Kubernetes, use the provided Helm chart to run it as a sidecar or node daemon.

Minimal environment (`/etc/whiteout/agent.env`, mode `0600`):

```bash
WHITEOUT_TOKEN=<enrollment token>
WHITEOUT_BACKEND_URL=https://<your-backend>
WHITEOUT_AGENT_NAME=build-host-01        # defaults to hostname
WHITEOUT_RESOURCE_ID=i-0abc123def        # defaults to hostname
WHITEOUT_RESOURCE_TYPE=ec2_instance      # ec2_instance | eks_pod | ecs_task | lambda | vm
WHITEOUT_REGION=us-east-1
```

Systemd unit (`/etc/systemd/system/whiteout-agent.service`):

```ini
[Unit]
Description=Whiteout AI Infrastructure Agent
After=network-online.target

[Service]
EnvironmentFile=/etc/whiteout/agent.env
ExecStart=/usr/local/bin/whiteout-agent
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now whiteout-agent
```

> **Updating:** the agent has no self-updater by design (a governance agent that rewrites itself is an audit problem). To update, replace the binary and `systemctl restart whiteout-agent`.

## Step 4 — Choose an Observation Mode

`WHITEOUT_MODE` selects how the agent sees AI activity. `transcript` is the default and the right choice for most hosts.

| Mode | What it watches | Use it for |
|------|-----------------|-----------|
| `transcript` *(default)* | The session logs AI coding tools already write to disk — Claude Code, Codex, Cursor, Gemini CLI, Aider | Developer VMs, build hosts, autonomous-agent boxes |
| `tap` | Request/response pairs delivered to a local receiver by your own capture (sidecars, log forwarders) | Existing network observability pipelines |
| eBPF egress *(beta, Linux)* | Outbound connects classified against the AI-provider catalog — **metadata only** | Workloads that write no transcript and load no SDK |
| SDK *(in-process)* | Calls made through the Python/Node SDK wrappers — the only mode that can **block** in-line | Server workloads that need a hard policy boundary |

Transcript-mode notes:

- Sources are selected with `WHITEOUT_TRANSCRIPT_SOURCES` (default `claude-code`; add `codex`, `cursor`, `gemini`, `aider` as comma-separated values). Each source's log root is overridable (`WHITEOUT_TRANSCRIPT_ROOT`, `WHITEOUT_CODEX_ROOT`, …) — set the root explicitly when the service user differs from the user running the AI tool.
- Existing files are seeded at end-of-file: activity appears **from enrollment forward**, never retroactively.
- Batching defaults to 50 events / 10 seconds (`WHITEOUT_BATCH_SIZE`, `WHITEOUT_BATCH_INTERVAL`).
- To also capture the **tool calls** agentic sessions execute, see [Tool-Activity Governance](./infrastructure/tool-activity-governance.md).

For AWS Bedrock — including managed Bedrock Agents where no agent or SDK can reach — see the dedicated [AWS Bedrock integration](../integrations/aws-bedrock.md), which covers the SDK wrapper, the invocation-log ingest worker, and native Guardrails translation.

Air-gapped hosts can run with a local policy bundle and a local activity sink instead of a backend connection: set `WHITEOUT_POLICY_BUNDLE_PATH` (and optionally `WHITEOUT_ACTIVITY_LOG_PATH`).

## Step 5 — Verify

On the host:

```bash
sudo journalctl -u whiteout-agent -n 20 --no-pager
```

You should see, in order: `whiteout-agent version=… starting`, the resolved config, `[transcript] registered: agent_id=…`, the watched sources, and — once real AI activity occurs — `[transcript] submitted N items`.

In the dashboard (**Infrastructure**):

- **Agents tab** — your agent appears with a green **Active** dot within one heartbeat (30 s). Click the row for heartbeat history, uptime, and status transitions.
- **Activity tab** — prompt and response rows from the watched tools, with provider, model, and content preview. Rows are filterable by time window, resource type, row type, and free-text search.

## Operating a Fleet

- **Liveness tiers** — agents move `active → stale → disconnected` based on missed heartbeats, with a page-level "needs attention" banner on transitions and per-agent history. A decommissioned or archived agent leaves the health math.
- **Version drift** — the dashboard flags agents running behind the current release.
- **Policy refresh** — agents pull group policy every 60 s (`WHITEOUT_CONFIG_REFRESH`); changing a group's posture reaches the fleet without redeploys. A move into or out of [audit-only mode](./governance/audit-only-mode.md) reaches agents the same way.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| Registration fails | Token revoked/mistyped, or `WHITEOUT_BACKEND_URL` unreachable from the host |
| Agent Active but no activity rows | Transcript root doesn't match where the AI tool actually writes (check the service user's home), or no *new* sessions since enrollment — history is never backfilled |
| Rows show `not captured` for content | The policy group's data capture is `metadata_only` — intentional, not a fault |
| Agent shows Stale after host sleep | Expected — it returns to Active on the next heartbeat |
| Nothing is blocked, and the agent reports `monitor` mode whatever the group says | Your organization is in [audit-only mode](./governance/audit-only-mode.md). Would-be blocks are recorded in the Activity tab |
| A group's mode, fail behaviour, rules and content policies are greyed out, or saving them returns HTTP 403 | Your organization is in [audit-only mode](./governance/audit-only-mode.md#settings-locked-in-audit-only-mode), where these settings are view only. Name, data capture, classification and alerting stay editable |
