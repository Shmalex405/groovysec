# Connect Asana

Expose Asana tasks and comments to AI assistants through the Whiteout
AI Connector.

## Prerequisites

- An **Asana workspace** or **project admin**
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Asana**.
2. Click **Connect Asana**.
3. Sign in with the Asana account and choose:
   - **Workspace ID** — for org-wide coverage, OR
   - **Project ID** — to scope to a specific project
4. The card shows **Connected**.

## Scopes / permissions

Asana OAuth requests **default app permissions** (read tasks, stories,
projects). The token inherits the OAuth user's access — to govern
private projects, use a project admin's account.

## What to expect after connect

- **No initial scan.** Firehose model — anchor at "now".
- **Tier 1 sync:** every 5 minutes, via Asana's `/events?sync=`
  endpoint (native delta cursor).
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  POST to `/webhooks` against the resource (workspace or project).
  Asana performs a one-time **X-Hook-Secret handshake** during
  creation — our receiver auto-echoes the secret back. Subsequent
  notifications use token-in-URL auth.
- **Task content** is fetched lazily on event arrival (`fetch_event_content`
  pulls task name + notes from `/tasks/{gid}`).

## Troubleshooting

- **Webhook handshake fails** — Asana's verification POST didn't
  reach our receiver. Verify your Whiteout backend is publicly
  reachable on HTTPS.
- **`task` events seen, `story` (comment) events missing** — the
  Asana plan tier may filter story events. Tier 1 polling still
  catches them; latency is just higher.
- **Events stream lag** — Asana's `/events` retains 24 hours of
  history. If sync was paused longer, do a fresh re-connect.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=asana`.
