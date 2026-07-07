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

> **Availability:** Per-user connect for Jira is **coming**. The
> Atlassian OAuth app is not yet wired into the connector's connect
> layer, so the **Connect** button is not live on the "Connect your
> sources" page yet. This guide describes the intended per-user model
> and the scope we'll request so you know what to expect.

## Prerequisites

- An **Atlassian account** — each user connects their own; no shared
  admin API token
- The **Whiteout desktop app**, signed in
- **Admin (one-time):** expose the Jira integration and set the
  org-wide connector policy in the desktop app

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

- **Connect button missing** — expected for now; per-user connect ships
  once the Atlassian OAuth app is wired into the connect layer.
- **A project or issue isn't showing up** — the connector only sees
  what your Atlassian grant sees. Confirm you have access in Jira
  itself; access is governed by Jira, not Whiteout.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=jira`. Each row
is tagged with the requesting user, so per-user activity is visible.
