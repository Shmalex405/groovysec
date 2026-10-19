# Connect SharePoint

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step) — after that, **[Microsoft 365 (Zero-Click)](./whiteout-ai-connector/microsoft-365-zero-click.md)**
> is the recommended path: one tenant admin-consent covers SharePoint,
> OneDrive and Outlook, and SharePoint is additionally bounded to an
> admin-chosen **site allowlist**. The backfill scanner can run off the
> same grant — no customer-registered Entra app needed. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).
> Zero-click is read-only: changes need each person's own Microsoft
> connection (see [What the AI can change](#what-the-ai-can-change)).

Expose your organization's SharePoint content to AI assistants through
the Whiteout AI Connector. SharePoint is a **document store**, so it
uses two credentials with separate roles: an org-wide **scanner** that
classifies the whole corpus, and **per-user** connections that decide
what each person is actually served.

- **Whiteout governs content** — the connector policy (org-wide by
  default; rules can be scoped to groups) vets every file
  before an AI sees it — a dedicated connector policy, separate from
  your users' normal group policies, which don't apply to connector
  reads.
- **Microsoft governs access** — each user is served only the sites and
  files their own account can already see.

> **Route SharePoint only through Whiteout.** If the same AI workspace
> also has its vendor-native SharePoint connector enabled (e.g.
> claude.ai's built-in SharePoint), the AI can read files directly on
> that path, skipping Whiteout's vetting. Disable the native SharePoint
> connector where you govern SharePoint through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Prerequisites

- **Whiteout admin** access (to expose SharePoint and manage the
  org-wide policy)
- A **Microsoft 365 tenant admin** to grant admin-consent for the
  org-wide scanner credential
- Each end user needs their **own Microsoft account** to connect
- Your **Tenant ID** (Microsoft tenant GUID)

> No restricted-scope review. Unlike Google, Microsoft's scopes here
> need only tenant **admin-consent** — there's no separate security
> assessment gating rollout.

## Setup steps

### Admin — expose SharePoint and connect the scanner

1. **Connect the org-wide scanner credential (operator/admin setup).**
   Microsoft 365 support requires its OAuth app configured for your
   deployment; a tenant admin then grants **admin-consent** (provide
   your **Tenant ID**, sign in as a tenant admin, **Accept** the
   requested permissions). This is the step that's **not yet enabled**
   — see the Availability note above.
2. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **SharePoint**.
3. Toggle **Expose**. The expose wizard verifies SharePoint is
   reachable, has you point it at a **GPU endpoint** for the backfill,
   and starts the **initial scan** (Test integration → Configure GPU →
   Start initial scan).
4. The scan classifies the corpus, populating the admin **Documents**
   review view. The scanner **only classifies — it never serves files
   to a user.** (Without the step-1 scanner credential the scan has
   nothing to enumerate.)

### Each user — connect their own account

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Microsoft** in the list and click **Connect**.
3. Sign in with your own Microsoft account and approve access.
4. You're now served SharePoint content at query time — limited to the
   sites and files your own account can access, drawn from the
   already-classified corpus.

> One connect per provider: connecting **Microsoft** covers both
> SharePoint and OneDrive. Users don't connect them separately.

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Scanner (org-wide) | `Sites.Read.All` | Enumerate all sites + drives to classify the whole corpus. |
| Scanner (org-wide) | `Files.Read.All` | Read document-library content for classification. |
| Per-user serving | `Sites.Read.All` | At query time, resolve which sites that user can access. |
| Per-user serving | `Files.Read.All` | At query time, read only the files that user's account can access. |
| Changes (each person's own connection) | `Files.ReadWrite.All`, `Sites.ReadWrite.All` | Upload, change, rename, move and delete files as the person who asked, when your admin allows the AI to change SharePoint. |

The write permissions are delegated permissions on each person's own
Microsoft connection. Your organization's zero-click access stays
read-only. See [What the AI can change](#what-the-ai-can-change).

## What the AI can change

When your admin allows it, the AI can change SharePoint files as the
person who asked, through that person's own Microsoft connection. The
changes show up in SharePoint's own history under their name, not under
Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Upload a text file | Allowed |
| **Edit** | Replace a text file's content, rename a file, move a file | Allowed |
| **Delete, archive & merge** | Delete a file (it goes to the recycle bin) | **Off** |

SharePoint has no **Comment & post** changes. Set these in
**Integrations → Whiteout AI Connector → SharePoint → What the AI can
change**. Every change is checked first: a **Hidden** file is refused as
not found, a file restricted by policy is refused, and the text is
checked against SharePoint's policy set and for planted instructions.
See [Write Actions](./whiteout-ai-connector/write-actions.md).

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

1. **Your operator** adds the delegated permissions `Files.ReadWrite.All`
   and `Sites.ReadWrite.All` to Whiteout's Entra app (Whiteout-hosted:
   ask your account manager).
2. **Each person** connects their own Microsoft account once, from
   **Connect your sources**. People who read SharePoint zero-click see
   **Connect to make changes**; until they connect, the AI is told to
   connect first (`connect_for_write`). People who connected before
   changes were turned on see **Grant write access** and reconnect once.

One Microsoft connection covers SharePoint, OneDrive, Outlook Mail and
Outlook Calendar. The consent screen asks only for the write
permissions of the sources your organization has exposed and allows
changes in.

## What to expect after connect

- **Corpus classification (scanner):** ~3s per doc. Tenant libraries
  range from hundreds to tens of thousands of docs. The **Documents**
  review view fills in as the scan runs.
- **Per-user serving is immediate.** Once a user connects, queries are
  served right away from the classified corpus, intersected with that
  user's live SharePoint permissions.
- **Sync model:** delta sync uses Microsoft Graph's `delta` endpoint —
  true incremental, not timestamp polling — with optional real-time
  change notifications for sub-minute latency.
- During change-notification registration, Microsoft Graph performs a
  validation handshake with our webhook URL. If your network blocks
  inbound HTTPS from `*.notifications.api.microsoft.com`, registration
  fails — open the firewall to that range.

## Troubleshooting

- **403 Forbidden during scan or consent** — the tenant admin hasn't
  granted admin-consent for `Sites.Read.All` / `Files.Read.All`. Re-run
  consent as a tenant admin.
- **User sees fewer sites/files than expected** — by design. A user is
  served only what their own Microsoft account can access. Fix broader
  access in SharePoint's permissions, not in Whiteout.
- **"sharepoint integration is not CONNECTED"** — the scanner token
  expired or the client secret rotated. Re-connect the org-wide scanner
  credential to refresh.

## Audit log

Reads are on **Activity → AI Connector**; filter the source to
SharePoint. SharePoint reads also surface in your tenant's Microsoft
365 audit log under the application name you used at consent time.

Changes the AI made or tried to make are on **Activity → MCP Activity**.
In SharePoint itself, a change is recorded under the person who asked,
because it's made with their own Microsoft connection.
