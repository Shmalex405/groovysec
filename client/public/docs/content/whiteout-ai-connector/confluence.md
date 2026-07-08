# Connect Confluence

Confluence is a **document store**: the Whiteout AI Connector governs
the *content* assistants can read, while Confluence (Atlassian) governs
*access*. Every page is classified against your org's connector policy
before any assistant sees it, and each user is served only the pages
their own Atlassian account can access.

> **Per-user connect for Confluence is built and wired.** It activates
> for your org once your operator registers an Atlassian OAuth app and
> sets its `ATLASSIAN_CLIENT_ID` / `ATLASSIAN_CLIENT_SECRET` (the same
> app covers Jira). Until then the **Connect** button falls back to a
> "connect your account" stub. The org scanner side (below) is
> independent and available today.

## How access works

Two concerns are kept separate:

- **Content governance (org-wide).** Your Whiteout admin defines one
  connector policy for the organization. Every Confluence page is
  vetted against it before an assistant reads it.
- **Access (per user).** Each user will connect their *own* Atlassian
  account, and the connector serves that user only the pages their
  account can see — Confluence's space and page permissions do the
  scoping. No shared admin credential exposes everyone's spaces to
  everyone.

Confluence uses **two credentials with different jobs**:

| Credential | Who sets it up | What it does |
|---|---|---|
| **Org scanner** | Admin, once | Pre-scans and classifies the whole corpus so the admin's **Documents** review view is complete. It **only classifies — it never serves content to assistants.** |
| **Per-user connection** | Each user, for their own account | Serves that user only the pages their Atlassian account can access, after content vetting. Activates once the operator sets `ATLASSIAN_CLIENT_ID` / `ATLASSIAN_CLIENT_SECRET`. |

## Prerequisites

**Admin / operator**
- **Whiteout admin** access to the desktop app
- **Confluence Cloud admin** to authorize the org scanner
- **Operator (one-time):** register an Atlassian OAuth app and set
  `ATLASSIAN_CLIENT_ID` / `ATLASSIAN_CLIENT_SECRET` on the backend to
  activate per-user connect (this same app covers Jira)

**Each user**
- An **Atlassian account** with access to the spaces they need
- The **Whiteout desktop app**, signed in

## Setup steps

**Admin — expose Confluence and enable scanning**
1. In the Whiteout desktop app, expose **Confluence** and authorize the
   **org scanner** so the corpus is classified into the **Documents**
   review view.
2. Set your org-wide **connector policy**.

**Each user — connect your own account**
1. Open **Connect your sources** in the Whiteout desktop app.
2. Find **Confluence**, click **Connect**, and complete Atlassian
   OAuth.
3. Assistants then read only the pages your Atlassian account can
   access, after content vetting.

## Scopes / permissions

Per-user connect requests a single read scope:

| Scope | Why |
|---|---|
| `read:confluence-content.all` | Read the Confluence content the connecting user can access, for classification and serving. |

Read-only — we never request write access.

## What to expect after connect

- **Per-user scope:** assistants see only the spaces/pages the
  connecting user can access. Atlassian's permissions do the scoping;
  the connector never returns content the user can't see.
- **Org scanner coverage:** the admin's Documents view reflects the
  whole corpus today, independent of per-user connect.
- **Content vetting:** flagged pages return with content withheld plus
  a `whiteout_vetting` annotation; existence-classified pages are
  removed.
- **Sync:** Tier 1 delta polling runs ~every 5 minutes; Tier 2
  **real-time sync** is available for sub-minute latency.

## Troubleshooting

- **Connect opens a "connect your account" stub instead of Atlassian's
  OAuth screen** — your operator hasn't set `ATLASSIAN_CLIENT_ID` /
  `ATLASSIAN_CLIENT_SECRET` yet. Per-user connect is wired; it activates
  once those are in place. The org scanner works independently either
  way.
- **Pages from one space missing (per-user)** — the connecting user
  lacks view permission on that space in Confluence. Grant access
  there.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=confluence`.
