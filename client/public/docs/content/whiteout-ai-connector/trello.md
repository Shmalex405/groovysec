# Connect Trello

Expose Trello card content (descriptions + comments) to AI assistants
through the Whiteout AI Connector.

## Prerequisites

- **Trello workspace admin** OR **board admin** access
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Trello**.
2. Click **Connect Trello**.
3. Provide:
   - **Trello API key** (from `https://trello.com/app-key`)
   - **OAuth token** (Trello generates this on the same page after
     authorizing)
   - **Board ID** — the board to expose
4. The card shows **Connected**.

## Scopes / permissions

Trello uses OAuth 1.0a with the **read** scope. We don't request
`write` or `account`. To cover multiple boards, connect each board as
a separate connection.

## What to expect after connect

- **No initial scan.** Firehose anchored at "now".
- **Tier 1 sync:** every 5 minutes, via
  `/boards/{board_id}/actions?since=<action_id>`. Filter is
  `createCard,updateCard,commentCard,deleteCard`.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  POST to `/webhooks` with `idModel=<board_id>`. Trello first sends a
  HEAD request to verify the URL — our receiver responds 200
  automatically. Auth is token-in-URL.
- **Comments emit as separate events** with synthetic IDs of the form
  `<card_id>:comment:<action_id>`.

## Troubleshooting

- **HEAD request fails** — your Whiteout backend isn't publicly
  reachable on HTTPS. Trello refuses to register the webhook.
- **Card content not updating** — `fetch_event_content` re-fetches
  the card on demand if the event payload didn't carry the body. If
  the OAuth user lost access to the card, fetch returns nothing.
- **OAuth 1.0a token expired** — Trello tokens don't auto-expire but
  can be manually revoked. Generate a fresh one and re-connect.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=trello`.
