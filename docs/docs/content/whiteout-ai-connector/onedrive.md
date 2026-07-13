# Connect OneDrive

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step) — after that, **[Microsoft 365 (Zero-Click)](./whiteout-ai-connector/microsoft-365-zero-click.md)**
> is the recommended path: one tenant admin-consent and every user is
> served their own OneDrive with no per-user connect screen. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).

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

We **do not** request write scopes. Whiteout never modifies your
OneDrive content.

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

**Admin → Audit → MCP Activity**, filter `integration=onedrive`.
