# Connect SharePoint

Expose a SharePoint site's document library to AI assistants through
the Whiteout AI Connector.

## Prerequisites

- **Microsoft 365 Global Admin** access (consent to app-only scopes)
- **Whiteout admin** access
- The SharePoint site URL you want to expose (e.g.
  `https://contoso.sharepoint.com/sites/engineering`)

## Setup steps

1. From the Integrations page, open the **Whiteout AI Connector**
   card and click **SharePoint** in the apps grid.
2. Click **Connect SharePoint**.
3. You'll be prompted for:
   - **Tenant ID** — your Microsoft tenant GUID
   - **Site URL** — the specific SharePoint site to expose
4. Sign in as a Global Admin and **Accept** the requested permissions.
5. You're returned to Whiteout; the card shows **Connected**.
6. Initial scan begins automatically.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `Files.Read.All` (Application) | Read SharePoint document library content for classification. |
| `Sites.Read.All` (Application) | Enumerate sites + drives for the site you authorize. |

App-only (client credentials) flow — we don't impersonate any user.

## What to expect after connect

- **Initial scan duration:** ~3s per doc. SharePoint site libraries
  range from hundreds to tens of thousands of docs depending on size.
- **Sync model:** Tier 1 (poll) uses Microsoft Graph's `delta`
  endpoint — true incremental, not timestamp polling.
- **Real-time sync:** click **Enable real-time sync**. We register a
  Graph subscription on `sites/{site_id}/drive/root`. Subscriptions
  auto-renew via PATCH; default lifetime ~3 days.
- During subscription registration, Microsoft Graph performs a
  validation handshake with our webhook URL. If your network blocks
  inbound HTTPS from `*.notifications.api.microsoft.com`, registration
  fails — open the firewall to that range.

## Troubleshooting

- **"sharepoint integration is not CONNECTED"** — the app-only token
  expired (tokens are minted from client credentials and typically
  last 1 hour). Whiteout auto-refreshes; if you see this persistently
  the client secret is likely rotated. Re-connect to refresh.
- **403 Forbidden on subscription create** — the SharePoint admin
  hasn't consented to `Sites.Read.All`. Re-run consent.
- **No files appearing in the scan** — verify the site URL points to
  a site, not a sub-folder. Whiteout enumerates the site's default
  drive, not arbitrary URL paths.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=sharepoint`.
SharePoint events also surface in your tenant's Microsoft 365 audit
log under the application name you used at consent time.
