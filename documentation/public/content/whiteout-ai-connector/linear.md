# Connect Linear

Expose Linear issues and comments to AI assistants through the
Whiteout AI Connector.

## Prerequisites

- **Linear workspace admin** (to authorize the OAuth or personal API
  key)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Linear**.
2. Click **Connect Linear**.
3. Either:
   - **OAuth flow** — sign in and authorize the Whiteout app, OR
   - **API key flow** — paste a Linear personal API key (create at
     `https://linear.app/settings/api`)
4. The card shows **Connected**.

## Scopes / permissions

If using OAuth, Whiteout requests the **read** scope. Personal API
keys carry whatever permissions the issuing user has.

## What to expect after connect

- **No initial scan.** Linear is a firehose — we anchor at "now" and
  classify issues + comments as they fire.
- **Tier 1 sync:** every 5 minutes, GraphQL `issueSearch(filter:
  {updatedAt: {gt: "..."}})`.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  create a Linear webhook subscribed to `Issue` + `Comment` resource
  types. Notifications are HMAC-SHA256-signed (Linear's
  per-subscription secret).
- **Comments emit as separate events** under composite ids
  (`<issue_id>:comment:<comment_id>`) so each gets its own cache row.

## Troubleshooting

- **GraphQL 401** — API key revoked or OAuth scopes downgraded.
  Re-connect.
- **Webhook signature mismatch** — Linear's secret was rotated.
  Click **Re-register webhook** in the detail dialog.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=linear`.
