# Connect OneDrive

Expose a user's OneDrive to AI assistants through the Whiteout AI
Connector. Same Microsoft Graph foundation as SharePoint, but
user-delegated instead of app-only.

## Prerequisites

- A **OneDrive user account** (the one whose Drive you want exposed)
- **Whiteout admin** access
- That user must complete an OAuth consent step

## Setup steps

1. Open the **Whiteout AI Connector** card → click **OneDrive**.
2. Click **Connect OneDrive**.
3. Sign in as the OneDrive account holder and approve the requested
   scopes.
4. You're returned to Whiteout; the card shows **Connected**.
5. Initial scan begins on the user's default drive (`me/drive/root`).

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `Files.Read` (delegated) | Read the user's OneDrive content for classification. |
| `offline_access` | Get a refresh token so we don't ask the user to re-auth every hour. |

## What to expect after connect

- **Scan scope:** the authorized user's `/me/drive/root` and below.
  Shared drives the user has access to are NOT included automatically
  — connect them separately as SharePoint sites.
- **Initial scan duration:** ~3s per doc.
- **Real-time sync:** click **Enable real-time sync**. Same Graph
  subscription model as SharePoint, ~3-day auto-renewing.

## Troubleshooting

- **"onedrive integration is not CONNECTED"** — refresh token expired
  (Microsoft tokens last 90 days of inactivity). Re-connect.
- **Initial scan returns 0 files** — the OAuth user has no content in
  their root drive. Verify by opening `https://onedrive.live.com` as
  that user.
- **Subscription registration 401** — the consent didn't include
  `offline_access`. Re-run consent.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=onedrive`.
