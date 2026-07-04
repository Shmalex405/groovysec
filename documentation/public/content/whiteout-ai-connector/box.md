# Connect Box

Expose a Box account to AI assistants through the Whiteout AI
Connector.

## Prerequisites

- A **Box account** with access to the content you want exposed
- **Box admin** if you want org-wide content; **end-user** OAuth
  scopes their own content only
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Box**.
2. Click **Connect Box**.
3. Sign in and authorize the Whiteout app for Box.
4. You're returned to Whiteout; the card shows **Connected**.
5. Box content is now available to your assistants — items are vetted
   on demand at query time, enumerated from the root folder (id=`0`)
   through accessible subfolders.

## Scopes Whiteout requests

Box uses a single scope grant tied to the OAuth app's configuration:

| Scope | Why |
|---|---|
| Read all files and folders stored in Box | Classify content before AI access. |

We **do not** request write or delete scopes.

## What to expect after connect

- **On-demand vetting:** Box content is not scanned up front.
  Documents are classified at query time (~3s per doc plus a small
  per-folder enumeration overhead) the first time an assistant
  requests them, and the verdict is cached.
- **Tier 1 sync:** every 5 minutes, via Box's `/events?stream_position`
  endpoint — changed files are re-vetted before their next access.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  register a Box webhook against the root folder (`/0`) with triggers
  for upload, rename, move, copy, trash, delete, restore. Box webhooks
  persist until deleted — no renewal cycle.

## Troubleshooting

- **"box integration is not CONNECTED"** — Box refresh token expired
  (Box tokens last ~60 days). Re-connect.
- **Webhook signatures fail verification** — the app-level
  `BOX_WEBHOOK_PRIMARY_KEY` / `BOX_WEBHOOK_SECONDARY_KEY` env vars
  must be set on the Whiteout backend. Contact Whiteout support — this
  is a one-time per-deployment configuration.
- **Slow first-time enumeration** — Box's `/folders/{id}/items`
  endpoint paginates 100 items at a time. Tens-of-thousand-file
  accounts can take an hour-plus to enumerate fully. Subsequent
  ticks are fast (events-based).

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=box`.
