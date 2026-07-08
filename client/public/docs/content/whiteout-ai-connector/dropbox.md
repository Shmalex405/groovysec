# Connect Dropbox

Expose Dropbox file content to AI assistants through the Whiteout AI
Connector. Dropbox is a **live source**: it's **per-user only** and
classified **on demand at read time** — there is no pre-scanned corpus,
no org-wide scanner, and no admin **Documents** review view.

- **Whiteout governs content** — one org-wide connector policy vets
  every file's content the instant an AI reads it, before the AI sees
  it.
- **Dropbox governs access** — each user connects their own Dropbox
  account and is served only the files their account can access.

> **Route Dropbox only through Whiteout.** If the same AI workspace also
> has a vendor-native Dropbox connector enabled, the AI can read Dropbox
> directly on that path, skipping Whiteout's vetting. Disable the native
> connector where you govern Dropbox through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## How access works

Two concerns are kept separate:

- **Content governance (org-wide).** Your Whiteout admin defines one
  connector policy for the organization. Every Dropbox file's content is
  vetted against it the moment an assistant reads it — there is no
  up-front scan.
- **Access (per user).** Each user connects their *own* Dropbox account,
  and the connector serves that user only the files their account can
  see. No shared admin credential exposes everyone's Dropbox content.

## Prerequisites

- **Whiteout admin** access (to expose Dropbox and manage the org-wide
  policy)
- Each end user needs their **own Dropbox account** with access to the
  files they want to reach
- **Operator OAuth app:** per-user connect activates once your operator
  registers the Dropbox OAuth app and sets `DROPBOX_CLIENT_ID` /
  `DROPBOX_CLIENT_SECRET`. Until those are set, connecting fails safe to
  a "connect your account" stub.

## Setup steps

### Admin — expose Dropbox

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **Dropbox**.
2. Click **Expose** to make Dropbox available to your users.
3. Set your org-wide **connector policy**.

### Each user — connect their own account

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Dropbox** in the list and click **Connect**.
3. Sign in with your own Dropbox account and complete Dropbox OAuth.
4. Your files are now vetted on demand whenever an AI assistant reads
   them — limited to what your own Dropbox account can access.

## Scopes Whiteout requests

Read-only scopes only:

| Scope | Why |
|---|---|
| `files.content.read` | At read time, read file content for classification and serving. |
| `files.metadata.read` | Enumerate the connecting user's files. |

No write scopes, and no scanner credential (Dropbox has no org-wide
corpus scan).

## What to expect after connect

- **No corpus scan.** Nothing is classified up front. Files are vetted
  the moment an assistant reads them, per user.
- **Access is per-user.** A user can only surface files their own
  Dropbox account can see; Dropbox's permissions do the scoping. There
  is no shared credential and no admin scanner reading everyone's
  Dropbox.
- **Content vetting:** flagged items return with content withheld plus a
  `whiteout_vetting` annotation; existence-classified items are removed.

## Troubleshooting

- **Users can't connect Dropbox** — the operator hasn't set
  `DROPBOX_CLIENT_ID` / `DROPBOX_CLIENT_SECRET` yet, so connect fails
  safe to a stub. Have your operator register the Dropbox OAuth app and
  set those secrets.
- **Assistant sees 0 files (per-user)** — Dropbox only surfaces files
  the connecting user's account can see. Verify by browsing
  `dropbox.com` while signed in as that account.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=dropbox`.
