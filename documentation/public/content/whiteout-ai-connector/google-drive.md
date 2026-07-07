# Connect Google Drive

Expose your organization's Google Drive to AI assistants through the
Whiteout AI Connector. Drive is a **document store**, so it uses two
credentials with separate roles: an org-wide **scanner** that
classifies the whole corpus, and **per-user** connections that decide
what each person is actually served.

- **Whiteout governs content** — one org-wide policy vets every file
  before an AI sees it.
- **Google governs access** — each user is served only the files their
  own Drive account can already see.

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

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Scanner (org-wide) | `drive.readonly` | Read the whole corpus once to classify every file before any AI sees it. |
| Scanner (org-wide) | `drive.metadata.readonly` | Detect new/modified/deleted docs without re-reading content. |
| Per-user serving | `drive.readonly` | At query time, read only the files that user's own account can access. |

We **do not** request write scopes. Whiteout never modifies your Drive.

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

Every Drive read through an AI assistant lands in **Admin → Audit →
MCP Activity** tagged `integration=google_drive`. Each row shows the
tool name (e.g. `gdrive_search_files`), the requesting user, the
blocked-policy list, and which fields were redacted.
