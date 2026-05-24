# Connect Confluence

Expose a Confluence Cloud space to AI assistants through the Whiteout
AI Connector.

## Prerequisites

- **Confluence Cloud admin** access
- A **user API token** from the Atlassian account that will own the
  connector (create at
  `https://id.atlassian.com/manage-profile/security/api-tokens`)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Confluence**.
2. Click **Connect Confluence**.
3. Provide:
   - **Base URL** — `https://yourorg.atlassian.net/wiki`
   - **Email** — the Atlassian account email
   - **API token** — paste the token from step 1
4. The card shows **Connected**. Initial scan begins.

## Scopes / permissions

Confluence Cloud uses email + API token (HTTP Basic). The token
inherits the user's space permissions, so the connector sees what the
user sees. Use a **dedicated service-account user** if you want to
limit which spaces are exposed.

## What to expect after connect

- **Initial scan duration:** ~3s per page. Confluence's `content/search`
  endpoint returns pages plus their version metadata.
- **Tier 1 sync:** every 5 minutes, via CQL
  `lastmodified > "<timestamp>"`. Synthetic-cursor model — no native
  delta API on Confluence Cloud.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  register a Confluence webhook for `page_created`/`page_updated`/
  `page_removed`. Auth is via a per-channel token in the URL query
  string (Confluence Cloud has no per-org HMAC).

## Troubleshooting

- **401 Unauthorized on initial scan** — API token revoked or the
  account lost access to the space. Mint a fresh token at the URL
  above.
- **Webhook registration fails** — your Confluence plan tier may not
  include webhook access. Tier 1 polling continues regardless.
- **Pages from one space not appearing** — check the OAuth user has
  view permission on that space. Confluence doesn't return content
  the API caller can't see.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=confluence`.
