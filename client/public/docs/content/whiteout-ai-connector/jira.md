# Connect Jira

Expose Jira Cloud issues and comments to AI assistants through the
Whiteout AI Connector — with each user connecting their **own**
Atlassian account.

## How access works

- **Whiteout governs content.** Your org-wide connector policy vets
  every issue and comment before any AI assistant sees it.
- **Jira governs access.** The connector reads through *your* Atlassian
  grant, so it only ever sees the projects and issues **you** can
  already access. Jira's own project permissions scope what's
  reachable — there is no shared admin token standing in for everyone.

This is a **live, on-demand** source. There is no pre-scanned org-wide
corpus and no admin "Documents" view — content is classified at query
time, per user, against your org connector policy.

> **Route Jira only through Whiteout.** If the same AI workspace also
> has its vendor-native Jira connector enabled (e.g. claude.ai's
> built-in Atlassian), the AI can read Jira directly on that path,
> skipping Whiteout's vetting. Disable the native Jira connector where
> you govern Jira through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

> **Availability:** Per-user connect for Jira is **built and wired**. It
> activates for your org once your operator registers an Atlassian OAuth
> app and sets its `ATLASSIAN_CLIENT_ID` / `ATLASSIAN_CLIENT_SECRET`.
> Until then the **Connect** button on the "Connect your sources" page
> falls back to a "connect your account" stub instead of starting
> Atlassian's OAuth flow.

## Prerequisites

- An **Atlassian account** — each user connects their own; no shared
  admin API token
- The **Whiteout desktop app**, signed in
- **Admin (one-time):** expose the Jira integration and set the
  org-wide connector policy in the desktop app
- **Operator (one-time):** register an Atlassian OAuth app and set
  `ATLASSIAN_CLIENT_ID` / `ATLASSIAN_CLIENT_SECRET` on the backend (this
  same app covers Confluence). Until this is set, per-user connect stays
  in its fail-safe "connect your account" stub.

## Setup steps (per user)

1. Open the Whiteout desktop app → **Connect your sources**.
2. Find **Jira** in the sources grid → click **Connect**.
3. Authorize the Whiteout app on Atlassian's OAuth screen with your own
   account.
4. You're returned to Whiteout; Jira shows **Connected** for your
   account.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `read:jira-work` | Read the issues and comments in the projects you can access, so we can classify them before AI sees them. |

We **do not** request write scopes. Whiteout never modifies your Jira.

## What to expect after connect

- **Per-user visibility.** Each user sees only the Jira projects and
  issues **they** can access. Nothing is pooled under a shared admin
  or service-account token.
- **On-demand classification.** Content is vetted at query time the
  first time your assistant requests it, then the verdict is cached.
  There is no initial scan and no org-wide corpus.
- **Content-governed results.** Items that fail policy come back with
  `content: null` plus a `whiteout_vetting` annotation; existence-
  classified items are removed entirely.

## Troubleshooting

- **Connect opens a "connect your account" stub instead of Atlassian's
  OAuth screen** — your operator hasn't set `ATLASSIAN_CLIENT_ID` /
  `ATLASSIAN_CLIENT_SECRET` yet. Per-user connect is wired; it activates
  once those are in place.
- **A project or issue isn't showing up** — the connector only sees
  what your Atlassian grant sees. Confirm you have access in Jira
  itself; access is governed by Jira, not Whiteout.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=jira`. Each row
is tagged with the requesting user, so per-user activity is visible.
