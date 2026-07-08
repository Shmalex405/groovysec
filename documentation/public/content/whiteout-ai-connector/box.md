# Connect Box

Expose Box file content to AI assistants through the Whiteout AI
Connector. Box is a **live source**: it's **per-user only** and
classified **on demand at read time** — there is no pre-scanned corpus,
no org-wide scanner, and no admin **Documents** review view.

- **Whiteout governs content** — one org-wide connector policy vets
  every file's content the instant an AI reads it, before the AI sees
  it.
- **Box governs access** — each user connects their own Box account and
  is served only the files and folders their account can access.

> **Route Box only through Whiteout.** If the same AI workspace also has
> a vendor-native Box connector enabled, the AI can read Box directly on
> that path, skipping Whiteout's vetting. Disable the native connector
> where you govern Box through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## How access works

Two concerns are kept separate:

- **Content governance (org-wide).** Your Whiteout admin defines one
  connector policy for the organization. Every Box file's content is
  vetted against it the moment an assistant reads it — there is no
  up-front scan.
- **Access (per user).** Each user connects their *own* Box account, and
  the connector serves that user only the files and folders their
  account can access. No shared admin credential exposes everyone's Box
  content.

## Prerequisites

- **Whiteout admin** access (to expose Box and manage the org-wide
  policy)
- Each end user needs their **own Box account** with access to the files
  they want to reach
- **Operator OAuth app:** per-user connect activates once your operator
  registers the Box OAuth app and sets `BOX_CLIENT_ID` /
  `BOX_CLIENT_SECRET`. Until those are set, connecting fails safe to a
  "connect your account" stub.

## Setup steps

### Admin — expose Box

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **Box**.
2. Click **Expose** to make Box available to your users.
3. Set your org-wide **connector policy**.

### Each user — connect their own account

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Box** in the list and click **Connect**.
3. Sign in with your own Box account and complete Box OAuth.
4. Your files are now vetted on demand whenever an AI assistant reads
   them — limited to what your own Box account can access.

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Per-user serving | `root_readonly` | At read time, read only the files and folders the connecting user can access, for classification and serving. |

Read-only — no write or delete scopes, and no scanner credential (Box
has no org-wide corpus scan).

## What to expect after connect

- **No corpus scan.** Nothing is classified up front. Files are vetted
  the moment an assistant reads them, per user.
- **Access is per-user.** A user can only surface files their own Box
  account can access; Box's permissions do the scoping. There is no
  shared credential and no admin scanner reading everyone's Box.
- **Content vetting:** flagged items return with content withheld plus a
  `whiteout_vetting` annotation; existence-classified items are removed.

## Troubleshooting

- **Users can't connect Box** — the operator hasn't set
  `BOX_CLIENT_ID` / `BOX_CLIENT_SECRET` yet, so connect fails safe to a
  stub. Have your operator register the Box OAuth app and set those
  secrets.
- **A file is missing (per-user)** — the connecting user's Box account
  can't see it. Fix sharing in Box.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=box`.
