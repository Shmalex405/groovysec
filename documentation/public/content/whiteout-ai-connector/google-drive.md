# Connect Google Drive

This guide walks an admin through exposing their organization's Google
Drive to AI assistants through the Whiteout AI Connector.

## Prerequisites

- **Google Workspace admin** access (to consent to OAuth scopes)
- **Whiteout admin** access to the Integrations page
- Whiteout's Drive OAuth app is pre-configured in the Whiteout backend
  — nothing to register on the Google side

## Setup steps

1. From the Integrations page, scroll to the **Whiteout AI Connector**
   card.
2. Find **Google Drive** in the apps grid (top-left). Click it.
3. The detail dialog opens with a **Connect Google Drive** button.
   Click it.
4. You're redirected to Google's OAuth consent screen. Sign in with
   the workspace admin account, review the scopes, and click **Allow**.
5. You're returned to Whiteout. The Drive card now shows the green
   **Connected** dot.
6. The **initial scan** starts within ~60 seconds. The progress bar
   shows live counts.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `drive.readonly` | Read all Drive files the admin can see, so we can classify them before AI sees them. |
| `drive.metadata.readonly` | Detect new/modified/deleted docs without re-reading content. |

We **do not** request write scopes. Whiteout never modifies your Drive.

## What to expect after connect

- **Initial scan duration:** roughly 3 seconds per document on the
  standard compliance engine. A 1,000-doc Drive takes ~50 minutes; a
  10,000-doc Drive takes ~8 hours. Customers with large corpora can
  bump the scanner GPU temporarily.
- **Tier 1 sync starts:** every 5 minutes after the initial scan
  completes. New/modified/deleted docs flow into the cache.
- **Tier 2 (real-time) sync:** click **Enable real-time sync** in the
  detail dialog. This registers a Drive `changes.watch` channel with
  a 7-day expiry that we auto-renew.
- The connector's overall **Active** badge appears in the card header
  once the scan completes.

## Troubleshooting

- **"google_drive integration is not CONNECTED"** — the OAuth grant
  expired or was revoked. Click Connect Google Drive again to
  re-authorize.
- **Initial scan stuck at 0** — check that the scanner GPU endpoint
  is configured (admin-only, in the Preflight dialog).
- **Webhook channel expired** — should auto-renew at the 24-hour-out
  mark. If you see this on the dashboard, click **Re-register
  webhook** in the detail dialog.

## Audit log

Every Drive read through an AI assistant lands in **Admin → Audit →
MCP Activity** tagged `integration=google_drive`. Each row shows the
tool name (e.g. `gdrive_search_files`), the requesting user, the
blocked-policy list, and which fields were redacted.
