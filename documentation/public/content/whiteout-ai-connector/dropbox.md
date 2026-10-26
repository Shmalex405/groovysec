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

| Scope | Why |
|---|---|
| `files.content.read` | At read time, read file content for classification and serving. |
| `files.metadata.read` | Enumerate the connecting user's files. |
| `files.content.write` | Upload, change, move, rename and delete files as the person who asked, when your admin allows the AI to change Dropbox. |

Whiteout asks for `files.content.write` only while at least one kind of
change is allowed for Dropbox. There's no scanner credential (Dropbox
has no org-wide corpus scan). See
[What the AI can change](#what-the-ai-can-change).

## What the AI can change

When your admin allows it, the AI can change Dropbox files as the
person who asked, through that person's own Dropbox connection. The
changes show up in Dropbox's own history under their name, not under
Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Upload a text file | Allowed |
| **Edit** | Replace an existing text file's content, move or rename a file | Allowed |
| **Delete, archive & merge** | Delete a file | **Off** |

Dropbox has no **Comment & post** changes. Set these in **Integrations
→ Whiteout AI Connector → Dropbox → What the AI can change**. Every
change is checked first: a **Hidden** file is refused as not found, a
file restricted by policy is refused, and the text is checked against
Dropbox's policy set and for planted instructions. See
[Write Actions](./whiteout-ai-connector/write-actions.md).

### Limits

- Content changes accept text files only: .txt, .md, .csv, .json,
  .html, .xml, .yaml and .log. Word, Excel, PowerPoint and other binary
  files can't have their content changed, but can still be moved or
  renamed.
- An edit replaces only a file that already exists, so it can't create a
  new file.
- Folders can't be changed, moved or deleted, because Whiteout can't
  check everything inside a folder.
- File names can't contain `/` or `\`, and can't be `.` or `..`.
- A file addressed by its Dropbox id (`id:…`) is checked. A file
  addressed by a plain path is recorded as *not checked*, and so is the
  folder a new file is created in.
- A changed file is checked again the next time the AI reads it.

### Before the AI can make changes

1. **Your operator** enables `files.content.write` on the Dropbox app.
2. **Each person** who connected Dropbox before changes were turned on
   reconnects once: they see **Grant write access** on **Connect your
   sources**. If they try first, the AI tells them to reconnect, with a
   link.

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

Reads are on **Activity → AI Connector**; filter the source to Dropbox.
Changes the AI made or tried to make are on **Activity → MCP Activity**.
