# Connect Gmail

Expose Gmail mailbox content to AI assistants through the Whiteout AI
Connector. Gmail is a **live source**: it's **per-user only** and
classified **on demand at query time** — there is no pre-scanned corpus
and no org-wide scanner.

- **Whiteout governs content** — one org-wide policy vets every message
  before an AI sees it.
- **Google governs access** — each user connects their own mailbox and
  is served only their own mail.

> **Route Gmail only through Whiteout.** If the same AI workspace also
> has its vendor-native Gmail connector enabled (e.g. claude.ai's
> built-in Gmail), the AI can read mail directly on that path, skipping
> Whiteout's vetting. Disable the native Gmail connector where you
> govern Gmail through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Prerequisites

- **Whiteout admin** access (to expose Gmail and manage the org-wide
  policy)
- Each end user needs their **own Gmail account** (Workspace or
  personal) to connect
- Whiteout's OAuth app is pre-configured — nothing to register on the
  Google side
- **Google restricted-scope verification:** `gmail.readonly` is a
  restricted scope. Google requires the Whiteout OAuth app to pass a
  security assessment before general rollout. Until verification
  completes, connecting works only for **allowlisted test users**.

> No customer-side infrastructure. Because Gmail is classified on
> demand per user rather than pre-scanned, the old Pub/Sub topic
> requirement no longer applies.

## Setup steps

### Admin — expose Gmail

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **Gmail**.
2. Click **Expose** to make Gmail available to your users.

### Each user — connect their own mailbox

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Google** in the list and click **Connect**.
3. Sign in with your own Google account and click **Allow**.
4. Your mail is now vetted on demand whenever an AI assistant queries
   it — limited to your own mailbox.

> One connect per provider: connecting **Google** covers both Gmail and
> Drive. Users don't connect them separately.

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Per-user serving | `gmail.readonly` | At query time, read only that user's own mail subject + body for classification. |

We request no write scopes and no scanner credential — Gmail has no
org-wide corpus scan.

## What to expect after connect

- **No corpus scan.** Nothing is classified up front. Messages are
  vetted the moment an assistant requests them, per user.
- **Content-length floor:** messages under 100 characters skip the deep
  classifier (auto-replies, one-liners).
- **Access is per-user.** A user can only surface their own mailbox.
  There is no shared credential and no admin scanner reading everyone's
  mail.
- **Attachments NOT classified.** Email body text only. To govern
  attachments, route them through the Whiteout interception flow
  (browser extension or desktop guard).

## Troubleshooting

- **"Access blocked: this app hasn't been verified"** — Google
  restricted-scope verification isn't complete yet. Add the affected
  user to the OAuth app's **test users** allowlist, or wait for
  verification to finish for general rollout.
- **User sees no mail / fewer results than expected** — Gmail is
  per-user and on-demand; a user only ever surfaces their own mailbox,
  and only messages that match the query.
- **"gmail integration is not CONNECTED"** — that user's OAuth grant
  expired or was revoked. Have them re-connect **Google** from
  **Connect your sources**.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=gmail`.
