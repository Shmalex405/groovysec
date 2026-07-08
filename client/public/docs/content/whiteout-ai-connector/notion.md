# Connect Notion

> **Availability: ⚙️ Requires operator setup.** Notion needs its OAuth
> app configured for your Whiteout deployment before it can be
> connected. Google Workspace (Drive + Gmail) is the currently-live
> provider. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).

Notion is a **document store**: the Whiteout AI Connector governs the
*content* your AI assistants can read, while Notion governs *access*.
Every page is classified against your org's connector policy before any
assistant sees it, and each user is served only the pages their own
Notion account can access.

> **Route Notion only through Whiteout.** If the same AI workspace also
> has its vendor-native Notion connector enabled (e.g. claude.ai's
> built-in Notion), the AI can read pages directly on that path,
> skipping Whiteout's vetting. Disable the native Notion connector where
> you govern Notion through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## How access works

Two concerns are kept separate:

- **Content governance (org-wide).** Your Whiteout admin defines one
  connector policy for the organization — separate from your users'
  normal group policies, which don't apply to connector reads. Every
  Notion page is vetted against it before an assistant is allowed to
  read it.
- **Access (per user).** Each user connects their *own* Notion account
  from the Whiteout desktop app. The connector then serves that user
  only the pages they've shared with the integration — Notion's own
  permissions do the scoping. There is **no shared admin credential**
  that exposes everyone's pages to everyone.

Notion uses **two credentials with different jobs**:

| Credential | Who sets it up | What it does |
|---|---|---|
| **Org scanner** | Admin, once | Pre-scans and classifies the whole shared corpus so the admin's **Documents** review view is complete. It **only classifies — it never serves content to assistants.** |
| **Per-user connection** | Each user, for their own account | Serves that user only the pages their account can access, after content vetting. |

## Prerequisites

**Admin**
- **Whiteout admin** access to the desktop app (to expose Notion and
  manage the connector policy)
- **Notion workspace admin** to authorize the org scanner integration

**Each user**
- A **Notion account** in the workspace
- The **Whiteout desktop app**, signed in

## Setup steps

**Admin — expose Notion and enable scanning**
1. In the Whiteout desktop app, open the connector's integration
   management and **expose Notion** to your users.
2. Authorize the **org scanner** integration so the entire shared
   corpus is classified into the **Documents** review view.
3. Review and set your org-wide **connector policy** — this decides
   which classes of content assistants may read.

**Each user — connect your own account**
1. Open the **Connect your sources** page in the Whiteout desktop app.
2. Find **Notion** and click **Connect**.
3. You're redirected to Notion. Select the workspace and the
   pages/databases you want to share with the integration, then click
   **Allow**.
4. You're returned to Whiteout; Notion shows **Connected**. Assistants
   can now read the pages you shared — but only content that passes the
   connector policy.

## Scopes / permissions

Notion uses an integration-token model. During **Connect** you grant
**per-page access** — the connector only sees pages you explicitly
share with the integration, read-only. We do **not** request write
capabilities. The Notion OAuth app is fully wired, so per-user connect
is live today.

## What to expect after connect

- **Per-user scope:** assistants see only the pages *you* shared. To
  expose more, share them with the integration from Notion's page
  `•••` menu → **Add connections**.
- **Org scanner coverage:** the admin's Documents view reflects the
  whole shared corpus, independent of any one user's connection — the
  scanner classifies, it never serves.
- **Content vetting:** flagged pages come back to the assistant with
  content withheld plus a `whiteout_vetting` annotation;
  existence-classified pages are removed entirely.
- **Sync:** Tier 1 delta polling runs ~every 5 minutes; enable Tier 2
  **real-time sync** for sub-minute latency.

## Troubleshooting

- **Assistant sees 0 pages** — you haven't shared any pages with the
  integration. In Notion, open a parent page → `•••` → **Add
  connections** → select **Whiteout**.
- **A teammate's page is missing** — expected. Each user is served only
  what their own Notion account can access; pages they haven't shared
  won't appear for them.
- **Archived pages disappear** — Notion-trashed pages are marked stale
  and stop appearing. Restore them in Notion to bring them back.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=notion`.
