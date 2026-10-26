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
| Changes | `root_readwrite` | Upload, change, rename, move, comment on and trash files as the person who asked, when your admin allows the AI to change Box. |

Whiteout asks for `root_readwrite` only while at least one kind of
change is allowed for Box. There's no scanner credential (Box has no
org-wide corpus scan). See [What the AI can change](#what-the-ai-can-change).

## What the AI can change

When your admin allows it, the AI can change Box files as the person
who asked, through that person's own Box connection. The changes show
up in Box's own history under their name, not under Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Upload a text file | Allowed |
| **Edit** | Replace a text file's content (saved as a new version), rename a file, move a file | Allowed |
| **Comment & post** | Comment on a file | Allowed |
| **Delete, archive & merge** | Move a file to the trash | **Off** |

Set these in **Integrations → Whiteout AI Connector → Box → What the AI
can change**. Every change is checked first: a **Hidden** file is
refused as not found, a file restricted by policy is refused, and the
text is checked against Box's policy set and for planted instructions.
See [Write Actions](./whiteout-ai-connector/write-actions.md).

### Limits

- Content changes accept text files only: .txt, .md, .csv, .json,
  .html, .xml, .yaml and .log. Word, Excel, PowerPoint and other binary
  files can't have their content changed, but can still be renamed or
  moved.
- File names can't contain `/` or `\`, and can't be `.` or `..`.
- A file is checked by its own id. The folder a new file is created in
  isn't checked, and is recorded as *not checked*.
- A changed file is checked again the next time the AI reads it.

### Before the AI can make changes

1. **Your operator** enables **Write all files and folders**
   (`root_readwrite`) on the Box app.
2. **Each person** who connected Box before changes were turned on
   reconnects once: they see **Grant write access** on **Connect your
   sources**. If they try first, the AI tells them to reconnect, with a
   link.

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

Reads are on **Activity → AI Connector**; filter the source to Box.
Changes the AI made or tried to make are on **Activity → MCP Activity**.
