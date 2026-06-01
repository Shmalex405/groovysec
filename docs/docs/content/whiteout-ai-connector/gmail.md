# Connect Gmail

Expose Gmail mailbox content to AI assistants through the Whiteout AI
Connector. This is the only integration with a customer-side
infrastructure requirement (a Google Cloud Pub/Sub topic) — plan ~30
minutes for the GCP setup.

## Prerequisites

- A **Gmail mailbox** (Workspace or personal)
- **Google Cloud Platform** access to create a Pub/Sub topic
- **Whiteout admin** access

## Setup steps

### Step A — Create the Pub/Sub topic (one-time, customer-side)

1. In Google Cloud Console, create or select a project.
2. Enable the **Cloud Pub/Sub API**.
3. Create a topic named `whiteout-gmail-notifications` (or any name —
   you'll provide it to Whiteout).
4. Create a **push subscription** on that topic with:
   - **Endpoint URL** —
     `https://api.whiteout.<your-customer-org>.com/connector/v1/webhooks/gmail`
     (Whiteout will provide the exact URL on the Gmail card detail
     dialog)
   - **Authentication** — use a service account with role
     `pubsub.subscriber`
5. Grant `roles/pubsub.publisher` on the topic to
   `gmail-api-push@system.gserviceaccount.com` (Google's official
   Gmail push service account).
6. Copy the topic name (full `projects/<project-id>/topics/...` form).

### Step B — Connect Gmail in Whiteout

1. Open the **Whiteout AI Connector** card → click **Gmail**.
2. Click **Connect Gmail**.
3. Sign in to the Gmail account and authorize.
4. In the detail dialog, paste the **Pub/Sub topic name** from Step
   A.6.
5. Click **Enable real-time sync**. Whiteout calls `users.watch()`
   pointing at your topic.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `gmail.readonly` | Read email subject + body for classification. |
| `gmail.metadata` | Detect new emails via the history feed. |

## What to expect after connect

- **No initial scan.** Anchored at the current `historyId`.
- **Content-length floor:** emails under 100 characters skip the deep
  classifier (auto-replies, one-liners).
- **Tier 1 sync:** every 5 minutes, `users.history.list` from the
  persisted historyId.
- **Tier 2 sync:** Pub/Sub push delivers near-instant notifications,
  which trigger an immediate Tier 1 poll.
- **Gmail watch expires every 7 days.** Whiteout auto-renews via the
  channel renewal sweep.
- **Attachments NOT classified.** Email body text only. To govern
  attachments, route them through the Whiteout interception flow
  (browser extension or desktop guard).

## Troubleshooting

- **`users.watch()` 403** — the Gmail account hasn't granted
  publisher access to `gmail-api-push@system.gserviceaccount.com` on
  your Pub/Sub topic. Re-check Step A.5.
- **Push messages not arriving** — Pub/Sub subscription's endpoint
  URL is wrong. Check it matches exactly (no trailing slash issues).
- **Watch expired** — the renewal sweep should fix this within 24h of
  expiry. If it persists, check the channel's `status` in the
  Connector detail dialog and click **Re-register webhook**.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=gmail`.
