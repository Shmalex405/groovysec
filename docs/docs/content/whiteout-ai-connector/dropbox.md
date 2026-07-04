# Connect Dropbox

Expose a Dropbox account to AI assistants through the Whiteout AI
Connector.

## Prerequisites

- A **Dropbox account** (Personal, Family, Plus, Business — any tier
  that supports OAuth apps; Business Standard or higher recommended
  for admin-level audit)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Dropbox**.
2. Click **Connect Dropbox**.
3. Sign in to Dropbox and **Allow** the requested permissions.
4. You're returned to Whiteout; the card shows **Connected**.
5. Dropbox content is now available to your assistants — items are
   vetted on demand at query time.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `files.metadata.read` | Enumerate files + detect changes. |
| `files.content.read` | Read file content for classification. |
| `account_info.read` | Identify which Dropbox account the OAuth belongs to (used for webhook routing). |

We do **not** request write scopes.

## What to expect after connect

- **On-demand vetting:** Dropbox content is not scanned up front.
  Documents are classified at query time (~3s per doc) the first time
  an assistant requests them, and the verdict is cached. Enumeration
  uses Dropbox's `/files/list_folder` + `/continue` paginator.
- **Tier 1 sync:** every 5 minutes, via `/files/list_folder/continue`
  with the persisted cursor — changed files are re-vetted before
  their next access.
- **Real-time sync (Tier 2):** Dropbox webhooks are configured once at
  the Whiteout-app level (we've already done this on our side). Click
  **Enable real-time sync** to bind your account ID to your org so
  notifications route correctly. No per-customer webhook URL to
  configure.

## Troubleshooting

- **Assistant sees 0 files** — Dropbox's permissions model only
  surfaces files the OAuth user can see. Verify by browsing
  `https://www.dropbox.com/home` while signed in as that account.
- **Excluded files:** `.zip`, `.exe`, `.mp4`, fonts, and similar
  non-classifiable extensions are skipped by design.
- **Webhook notifications not arriving** — ensure **Enable real-time
  sync** was clicked. Without it we don't route notifications for
  your account.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=dropbox`.
