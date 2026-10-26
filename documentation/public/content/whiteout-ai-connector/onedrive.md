# Connect OneDrive

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step) — after that, **[Microsoft 365 (Zero-Click)](./whiteout-ai-connector/microsoft-365-zero-click.md)**
> is the recommended path: one tenant admin-consent and every user is
> served their own OneDrive with no per-user connect screen. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).
> Zero-click is read-only: changes need each person's own Microsoft
> connection (see [What the AI can change](#what-the-ai-can-change)).

Expose your organization's OneDrive content to AI assistants through
the Whiteout AI Connector. OneDrive is a **document store** on the same
Microsoft Graph foundation as SharePoint, so it uses two credentials
with separate roles: an org-wide **scanner** that classifies the whole
corpus, and **per-user** connections that decide what each person is
actually served.

- **Whiteout governs content** — the connector policy (org-wide by
  default; rules can be scoped to groups) vets every file
  before an AI sees it — a dedicated connector policy, separate from
  your users' normal group policies, which don't apply to connector
  reads.
- **Microsoft governs access** — each user is served only the files
  their own OneDrive can already see.

> **Route OneDrive only through Whiteout.** If the same AI workspace
> also has its vendor-native OneDrive connector enabled (e.g.
> claude.ai's built-in OneDrive), the AI can read files directly on
> that path, skipping Whiteout's vetting. Disable the native OneDrive
> connector where you govern OneDrive through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Prerequisites

- **Whiteout admin** access (to expose OneDrive and manage the org-wide
  policy)
- A **Microsoft 365 tenant admin** to grant admin-consent for the
  org-wide scanner credential
- Each end user needs their **own Microsoft account** to connect
- Your **Tenant ID** (Microsoft tenant GUID)

> No restricted-scope review. Microsoft's scope here needs only tenant
> **admin-consent** — there's no separate security assessment gating
> rollout.

## Setup steps

### Admin — expose OneDrive and connect the scanner

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **OneDrive**.
2. Click **Expose** to make OneDrive available to your users.
3. Provide your **Tenant ID**, then sign in as a tenant admin and
   **Accept** the requested permissions (admin-consent).
4. The org-wide **scan** starts automatically and classifies every
   user's OneDrive content, populating the admin **Documents** review
   view. The scanner **only classifies — it never serves files to a
   user.**

### Each user — connect their own OneDrive

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Microsoft** in the list and click **Connect**.
3. Sign in with your own Microsoft account and approve access.
4. You're now served OneDrive content at query time — limited to your
   own drive, drawn from the already-classified corpus.

> One connect per provider: connecting **Microsoft** covers both
> OneDrive and SharePoint. Users don't connect them separately.

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Scanner (org-wide) | `Files.Read.All` | Read every user's OneDrive content once to classify the corpus. |
| Per-user serving | `Files.Read.All` | At query time, read only the files that user's own drive can access. |
| Changes (each person's own connection) | `Files.ReadWrite.All` | Upload, change, rename, move and delete files as the person who asked, when your admin allows the AI to change OneDrive. |

The write permission is a delegated permission on each person's own
Microsoft connection. Your organization's zero-click access stays
read-only. See [What the AI can change](#what-the-ai-can-change).

## What the AI can change

When your admin allows it, the AI can change OneDrive files as the
person who asked, through that person's own Microsoft connection. The
changes show up in OneDrive's own history under their name, not under
Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Upload a text file | Allowed |
| **Edit** | Replace a text file's content, rename a file, move a file | Allowed |
| **Delete, archive & merge** | Delete a file (it goes to the recycle bin) | **Off** |

OneDrive has no **Comment & post** changes. Set these in **Integrations
→ Whiteout AI Connector → OneDrive → What the AI can change**. Every
change is checked first: a **Hidden** file is refused as not found, a
file restricted by policy is refused, and the text is checked against
OneDrive's policy set and for planted instructions. See
[Write Actions](./whiteout-ai-connector/write-actions.md).

### Limits

- Content changes accept text files only: .txt, .md, .csv, .json,
  .html, .xml, .yaml and .log. Word, Excel, PowerPoint and other binary
  files can't have their content changed, but can still be renamed or
  moved.
- Uploads are capped at 4 MB.
- Folders can't be changed, moved or deleted, because Whiteout can't
  check everything inside a folder.
- File names can't contain `/` or `\`, and can't be `.` or `..`.
- A file is checked by its own id. The folder a new file is created in
  isn't checked, and is recorded as *not checked*.
- After a change, Whiteout re-scans, so the new content gets a fresh
  classification.

### Before the AI can make changes

Changes use each person's own Microsoft connection, never your
organization's
[zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
access, because changes made with app-only access would show as made by
the app. Zero-click reads keep working.

1. **Your operator** adds the delegated permission `Files.ReadWrite.All`
   to Whiteout's Entra app (Whiteout-hosted: ask your account manager).
2. **Each person** connects their own Microsoft account once, from
   **Connect your sources**. People who read OneDrive zero-click see
   **Connect to make changes**; until they connect, the AI is told to
   connect first (`connect_for_write`). People who connected before
   changes were turned on see **Grant write access** and reconnect once.

One Microsoft connection covers SharePoint, OneDrive, Outlook Mail and
Outlook Calendar. The consent screen asks only for the write
permissions of the sources your organization has exposed and allows
changes in.

## What to expect after connect

- **Corpus classification (scanner):** ~3s per doc across the tenant's
  OneDrive content. The **Documents** review view fills in as the scan
  runs.
- **Per-user serving is immediate.** Once a user connects, queries are
  served right away from the classified corpus — scoped to that user's
  own `/me/drive` and below. Shared drives the user has access to are
  NOT included automatically — expose those as SharePoint sites.
- **Sync model:** delta sync via Microsoft Graph, with optional
  real-time change notifications for sub-minute latency.

## Troubleshooting

- **403 Forbidden during scan or consent** — the tenant admin hasn't
  granted admin-consent for `Files.Read.All`. Re-run consent as a
  tenant admin.
- **User's connect returns 0 files** — that user has no content in their
  root drive. Verify by opening `https://onedrive.live.com` as that
  user.
- **User sees fewer files than expected** — by design. A user is served
  only what their own OneDrive can access.
- **"onedrive integration is not CONNECTED"** — the scanner token
  expired or the client secret rotated. Re-connect the org-wide scanner
  credential to refresh.

## Audit log

Reads are on **Activity → AI Connector**; filter the source to OneDrive.
Changes the AI made or tried to make are on **Activity → MCP Activity**.
