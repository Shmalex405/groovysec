# Tool-Activity Governance

On agentic workloads, the risk usually isn't the prompt — it's what the agent *does next*. A coding agent asked to "clean up the repo" issues shell commands, rewrites files, and calls external services, and the command that exfiltrates a secret never appears in any prompt. Tool-activity governance extends the Infrastructure Agent's transcript mode to capture those tool calls as first-class, policy-evaluable activity.

This guide assumes a working transcript-mode agent — if you don't have one yet, start with the [Agent Quickstart](./agent-quickstart.md).

## What Gets Captured

When enabled, the agent parses each `tool_use` / `tool_result` pair out of the session transcripts it already watches and reports it alongside the session's prompts and responses. Each tool row carries the tool name, a bounded input payload (the shell command, the file path and content, the URL fetched), and a bounded output payload.

A single agentic turn — one prompt, one shell command, one response — therefore produces **three** activity rows: prompt, tool, response. The dashboard and its statistics keep these distinct: tool rows never inflate your AI-call counts.

## Step 1 — Enable Capture on the Agent

Set one environment variable and restart the service:

```bash
# /etc/whiteout/agent.env
WHITEOUT_TOOL_CAPTURE=risky        # off (default) | risky | all
```

```bash
sudo systemctl restart whiteout-agent
```

| Setting | Behavior |
|---------|----------|
| `off` *(default)* | No tool rows — prompts and responses only |
| `risky` *(recommended)* | Captures the tools with real blast radius: shell execution, file writes/edits, web fetch/search, and all MCP tool calls |
| `all` | Every tool call, including read-only ones — noisy; useful for short forensic windows |

Payloads are truncated agent-side at 4 KB per field (`WHITEOUT_TOOL_PAYLOAD_MAX`) before they ever leave the host.

## Step 2 — Decide What Content Is Stored

The policy group's **data capture** tier applies to tool payloads exactly as it does to prompts:

| Tier | Tool rows contain |
|------|-------------------|
| `full` | Tool name + input/output payloads (truncated) |
| `metadata_only` | Tool name only — the fact and shape of the action, no content |
| `none` | Nothing — tool capture is effectively off for the group |

`metadata_only` is a meaningful middle ground for sensitive environments: you still see *that* an agent ran shell commands at 3 a.m., without storing what they were.

## Step 3 — Read the Activity

In **Infrastructure → Activity**, tool calls appear as rows with the tool's name as the Type chip (`Bash`, `Write`, `WebFetch`, …) next to Prompt and Response rows from the same session. From there:

- **Filter** by row type (Prompts / Responses / Tool calls), time window, resource type, or search — counts and pagination reflect the full filtered window, not just the visible page.
- **Open a row** for the full captured input and output.
- **Charts** carry a dedicated tool-calls series, and the stat band shows Tool Calls (24h) beside AI Calls (24h).
- **Export** the current view to CSV, tool columns included.

## Step 4 — Turn On Policy Evaluation

Capture and evaluation are separate switches. Capture is an agent-side setting; evaluation is a per-group control:

**Infrastructure → Resource Policies → your group → "Evaluate tool calls."**

With the flag on, the backend runs each captured tool **input** through the compliance engine at ingest, the same engine that judges prompts — so a shell command that embeds a customer record, an API key, or a bulk data pull gets flagged against the same policy library. Flagged rows surface in the Activity view and count toward the group's violation statistics.

Two honesty notes, so your expectations match the architecture:

- **Transcript mode is post-hoc.** The tool call already ran by the time the transcript records it. Evaluation gives you detection, audit evidence, and alerting — not pre-execution blocking. (Pre-execution enforcement on developer machines is the job of the agentic-coding defender hooks; in-line blocking on servers is the SDK's.)
- **Evaluation fails open.** If the compliance engine is unreachable or scaled down, tool rows are still captured and stored — they simply aren't evaluated. Nothing about this feature can take your workload down.

## Verify End to End

1. On the enrolled host, run any agentic turn that executes a shell command.
2. `journalctl -u whiteout-agent -f` — within one batch interval (10 s default) you'll see `[transcript] submitted 3 items` for the turn: prompt + tool + response.
3. In **Infrastructure → Activity**, filter Type → **Tool calls**: the row shows the command as its content preview, with full input/output behind the row click.

## Recommended Rollout

1. **Capture first, evaluate later.** Run `WHITEOUT_TOOL_CAPTURE=risky` in `monitor` mode for a few days and read what your agents actually do — the volume and shape usually surprise teams.
2. **Right-size the capture tier** per group once you've seen real payloads.
3. **Flip "Evaluate tool calls"** on the groups where the content matters. Watch the flagged-row rate before graduating the group's enforcement posture.
