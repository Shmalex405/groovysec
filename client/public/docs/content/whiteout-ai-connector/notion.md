# Connect Notion

Expose a Notion workspace to AI assistants through the Whiteout AI
Connector.

## Prerequisites

- **Notion workspace admin** (to install the Whiteout integration)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Notion**.
2. Click **Connect Notion**.
3. You're redirected to Notion's auth page. Select the workspace and
   the pages/databases the Whiteout integration should access.
4. Click **Allow**. You're returned to Whiteout; the card shows
   **Connected**.
5. Initial scan begins on the pages you authorized.

## Scopes / permissions

Notion uses an integration-token model. You grant **per-page access**
during connect — Whiteout only sees pages you explicitly share with
the integration. We do **not** request write capabilities; the
integration is read-only.

## What to expect after connect

- **Initial scan duration:** ~3s per page (one Notion API call per
  page's block tree). Larger pages with many blocks take longer.
- **Scan scope:** only pages shared with the integration during the
  OAuth grant. To add more pages later, share them with the
  integration from Notion's page menu.
- **Tier 1 sync:** every 5 minutes, via `/search` with descending
  `last_edited_time` order — we walk results client-side until we hit
  the cursor.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  register a Notion webhook (requires the 2024+ webhook API; check
  your Notion plan supports it). Notion signs each notification with
  HMAC-SHA256 over the body.

## Troubleshooting

- **Initial scan returns 0 pages** — you didn't share any pages with
  the integration. In Notion, open a parent page → `•••` menu →
  **Add connections** → select the Whiteout integration.
- **Archived pages disappear** — Notion-archived (trashed) pages are
  marked stale in our cache; they stop appearing in AI responses.
  Restore in Notion to bring them back.
- **Webhook 401 errors** — the integration's webhook secret was
  rotated. Click **Re-register webhook** in the detail dialog.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=notion`.
