# Connect Dropbox

Dropbox is a **document store**: the Whiteout AI Connector governs the
*content* assistants can read, while Dropbox governs *access*. Every
item is classified against your org's connector policy before any
assistant sees it, and each user is served only the content their own
Dropbox account can access.

> **Per-user connect for Dropbox is coming.** The Dropbox OAuth app is
> not yet wired into the connector's connect layer, so users can't yet
> connect their own Dropbox accounts from the desktop app. The intended
> model is described below; the org scanner side is available today.

## How access works

Two concerns are kept separate:

- **Content governance (org-wide).** Your Whiteout admin defines one
  connector policy for the organization. Every Dropbox item is vetted
  against it before an assistant reads it.
- **Access (per user).** Each user will connect their *own* Dropbox
  account, and the connector serves that user only the files their
  account can see. No shared admin credential exposes everyone's
  Dropbox content.

Dropbox uses **two credentials with different jobs**:

| Credential | Who sets it up | What it does |
|---|---|---|
| **Org scanner** | Admin, once | Pre-scans and classifies the whole corpus so the admin's **Documents** review view is complete. It **only classifies — it never serves content to assistants.** |
| **Per-user connection** *(coming)* | Each user, for their own account | Will serve that user only the content their Dropbox account can access, after content vetting. |

## Prerequisites

**Admin**
- **Whiteout admin** access to the desktop app
- **Dropbox admin** to authorize the org scanner

**Each user** *(once per-user connect ships)*
- A **Dropbox account** with access to the content they need
- The **Whiteout desktop app**, signed in

## Setup steps

**Admin — expose Dropbox and enable scanning**
1. In the Whiteout desktop app, expose **Dropbox** and authorize the
   **org scanner** so the corpus is classified into the **Documents**
   review view.
2. Set your org-wide **connector policy**.

**Each user — connect your own account** *(coming)*
1. Open **Connect your sources** in the Whiteout desktop app.
2. Find **Dropbox**, click **Connect**, and complete Dropbox OAuth.
3. Assistants then read only the content your Dropbox account can
   access, after content vetting.

## Scopes Whiteout requests

Per-user connect requests read-only scopes:

| Scope | Why |
|---|---|
| `files.content.read` | Read file content for classification and serving. |
| `files.metadata.read` | Enumerate files and detect changes. |

No write scopes.

## What to expect after connect

- **Per-user scope:** assistants see only the content the connecting
  user can access; Dropbox's permissions do the scoping.
- **Org scanner coverage:** the admin's Documents view reflects the
  whole corpus today, independent of per-user connect.
- **Content vetting:** flagged items return with content withheld plus
  a `whiteout_vetting` annotation; existence-classified items are
  removed.
- **Sync:** Tier 1 delta polling runs ~every 5 minutes; Tier 2
  **real-time sync** is available for sub-minute latency.

## Troubleshooting

- **Users can't connect Dropbox yet** — expected. Per-user connect
  isn't wired yet; only the org scanner is live.
- **Assistant sees 0 files (per-user)** — Dropbox only surfaces files
  the connecting user's account can see. Verify by browsing
  `dropbox.com` while signed in as that account.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=dropbox`.
