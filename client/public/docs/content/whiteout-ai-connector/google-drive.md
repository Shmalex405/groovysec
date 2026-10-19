# Connect Google Drive

> **Availability: ✅ Live.** Google Workspace is configured via
> domain-wide delegation, so Drive works **zero-click** — no per-user
> connect step. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).

Expose your organization's Google Drive to AI assistants through the
Whiteout AI Connector. Drive is a **document store**, so it uses two
credentials with separate roles: an org-wide **scanner** that
classifies the whole corpus, and **per-user** connections that decide
what each person is actually served.

- **Whiteout governs content** — the connector policy (org-wide by
  default; rules can be scoped to groups) vets every file before an AI
  sees it.
- **Google governs access** — each user is served only the files their
  own Drive account can already see.

> **Route Drive only through Whiteout.** If the same AI workspace also
> has its vendor-native Google Drive connector enabled (e.g.
> claude.ai's built-in Drive connector), the AI can read files directly
> on that path, skipping Whiteout's vetting. Disable the native Drive
> connector where you govern Drive through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Prerequisites

- **Whiteout admin** access (to expose Drive and manage the org-wide
  policy)
- A **Google Workspace admin** account for the org-wide scanner
  credential — either a service admin account or domain-wide delegation
- Each end user needs their **own Google account** to connect
- Whiteout's Drive OAuth app is pre-configured in the Whiteout backend
  — nothing to register on the Google side
- **Google restricted-scope verification:** `drive.readonly` is a
  restricted scope. Google requires the Whiteout OAuth app to pass a
  security assessment before general rollout. Until verification
  completes, connecting works only for **allowlisted test users**. (See
  Troubleshooting.)

## Setup steps

### Admin — expose Drive and connect the scanner

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **Google Drive**.
2. Click **Expose** to make Drive available to your users.
3. Connect the **org-wide scanner credential** — either sign in with a
   Workspace service admin account, or configure **domain-wide
   delegation** (recommended, see below).
4. The org-wide **scan** starts within ~60 seconds and classifies every
   file in the corpus. This populates the admin **Documents** review
   view. The scanner **only classifies — it never serves files to a
   user.**

### Each user — connect their own Drive

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Google** in the list and click **Connect**.
3. Sign in with your own Google account and click **Allow**.
4. You're now served Drive content at query time — limited to what your
   own account can access, drawn from the already-classified corpus.

> One connect per provider: connecting **Google** covers both Drive and
> Gmail. Users don't connect them separately.

### Domain-wide delegation (recommended)

A Workspace admin can grant **domain-wide delegation** to Whiteout's
service account. This provisions every user **zero-click** — no
per-user OAuth consent screen. Users still only ever see their own
files; delegation just removes the individual grant step.

> For the full step-by-step DWD runbook (it covers both Drive **and**
> Gmail in one setup), see
> [Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md).

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Scanner (org-wide) | `drive.readonly` | Read the whole corpus once to classify every file before any AI sees it. |
| Scanner (org-wide) | `drive.metadata.readonly` | Detect new/modified/deleted docs without re-reading content. |
| Per-user serving | `drive.readonly` | At query time, read only the files that user's own account can access. |
| Changes (Workspace delegation) | `drive` | Create, change, comment on and trash files as the person who asked, when your admin allows the AI to change Drive. |

Reads use only the read-only scopes. The `drive` scope is needed only
for changes, and only on your Workspace's domain-wide delegation: a
personal Google sign-in never makes changes. See
[What the AI can change](#what-the-ai-can-change).

## What the AI can change

When your admin allows it, the AI can change Drive files as the person
who asked. Changes go through your organization's Workspace delegation
as that person, so they show up in Drive's own history under their
name, not under Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Create a file from text: a Google Doc by default, or a plain text file | Allowed |
| **Edit** | Replace a Google Doc's or text file's content, rename a file, move a file | Allowed |
| **Comment & post** | Comment on a file | Allowed |
| **Delete, archive & merge** | Move a file to the trash | **Off** |

Set these in **Integrations → Whiteout AI Connector → Google Drive →
What the AI can change**. Every change is checked first: a **Hidden**
file is refused as not found, a file restricted by policy is refused,
and the text is checked against Drive's policy set and for planted
instructions. See [Write Actions](./whiteout-ai-connector/write-actions.md).

### Limits

- Content changes accept Google Docs and text files only: .txt, .md,
  .csv, .json, .html, .xml, .yaml and .log. Word, Excel, PowerPoint and
  other binary files can't have their content changed, but can still be
  renamed or moved.
- Uploads are capped at 5 MB.
- File names can't contain `/` or `\`, and can't be `.` or `..`.
- A file is checked by its own id. The folder a new file is created in
  isn't checked, and is recorded as *not checked*.
- After a change, Whiteout re-scans, so the new content gets a fresh
  classification.

### Before the AI can make changes

Changes in Drive go only through your Google Workspace domain-wide
delegation. A personal Google sign-in still serves reads, but never
makes changes. A **Workspace super admin** adds this scope to
Whiteout's existing delegation entry:

```
https://www.googleapis.com/auth/drive
```

In the Google Admin console, open **Security → Access and data control
→ API controls → Domain-wide delegation**, edit Whiteout's client and
add the scope to the end of the list. **Keep the scopes already there:
saving replaces the whole list.**

Until it's added, reads keep working and the AI is told your admin needs
to add it (`org_grant_missing`). The **What the AI can change** panel
shows exactly which scopes to add, with a button to copy them. See
[Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md#let-the-ai-make-changes-write-scopes).

## What to expect after connect

- **Corpus classification (scanner):** roughly 3 seconds per document
  on the standard compliance engine. A 1,000-doc org takes ~50 minutes;
  a 10,000-doc org takes ~8 hours. Large corpora can bump the scanner
  GPU temporarily. The **Documents** review view fills in as the scan
  runs.
- **Per-user serving is immediate.** Once a user connects, queries are
  served right away from the classified corpus — no per-user scan.
  Access is intersected with that user's live Drive ACLs.
- **Delta sync** keeps the classified corpus current every ~5 minutes;
  real-time change notifications drop that to seconds.

## Troubleshooting

- **"Access blocked: this app hasn't been verified"** — Google
  restricted-scope verification isn't complete yet. Add the affected
  user to the OAuth app's **test users** allowlist, or wait for
  verification to finish for general rollout.
- **User sees fewer files than expected** — by design. A user is served
  only what their own Google account can access. If they need broader
  access, fix it in Google Drive's sharing, not in Whiteout.
- **"google_drive integration is not CONNECTED"** — the scanner grant
  expired or was revoked. Re-connect the org-wide scanner credential.
- **Corpus scan stuck at 0** — check that the scanner GPU endpoint is
  configured (admin-only, in the Preflight dialog).

## Audit log

Reads are on **Activity → AI Connector**; filter the source to Google
Drive. Each row shows the tool name (e.g. `gdrive_search_files`), the
requesting user, the blocked-policy list, and which fields were
redacted. Changes the AI made or tried to make are on **Activity → MCP
Activity**.
