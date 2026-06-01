# Connect Jira

Expose Jira Cloud issues and comments to AI assistants through the
Whiteout AI Connector.

## Prerequisites

- **Jira Cloud admin** access (to register webhooks)
- A **user API token** from the Atlassian account that owns the
  connector (create at
  `https://id.atlassian.com/manage-profile/security/api-tokens`)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Jira**.
2. Click **Connect Jira**.
3. Provide:
   - **Base URL** — `https://yourorg.atlassian.net`
   - **Email** — the Atlassian account email
   - **API token** — paste the token from step 1
4. The card shows **Connected**.

## Scopes / permissions

Email + API token (HTTP Basic). The token inherits the user's project
permissions. For governance over all projects, use an **Atlassian
admin's** token. For scoped governance, use a **service account** with
explicit project assignments.

## What to expect after connect

- **No initial scan.** Jira is a firehose integration — we anchor at
  "now" and classify issues + comments as they're created or updated.
  Historical issues stay out of the cache unless they're touched.
- **Tier 1 sync:** every 5 minutes, JQL `updated > "<timestamp>"`.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  POST to `/rest/api/3/webhook` with events
  `jira:issue_created/updated/deleted` and the matching comment
  events. Auth is a per-channel token in the URL.
- **Issue comments** fire as their own events under their parent
  issue's id, so blocking one comment doesn't redact the whole issue.

## Troubleshooting

- **401 Unauthorized** — API token revoked. Mint a fresh one.
- **Webhook registration returns empty result** — Jira plan tier may
  restrict webhook access. Tier 1 polling continues to work.
- **Old issues not appearing** — by design. Touch an issue (edit,
  comment, transition) and it'll surface within ~5 minutes.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=jira`.
