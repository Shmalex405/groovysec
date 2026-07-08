# Connect Linear

Expose Linear issues and comments to AI assistants through the Whiteout
AI Connector — with each user connecting their **own** Linear account.

## How access works

- **Whiteout governs content.** Your org-wide connector policy vets
  every issue and comment before any AI assistant sees it.
- **Linear governs access.** The connector reads through *your* Linear
  grant, so it only ever sees the teams and issues **you** can already
  access. Linear's own permissions scope what's reachable — there is no
  shared API key standing in for everyone.

This is a **live, on-demand** source. There is no pre-scanned org-wide
corpus and no admin "Documents" view — content is classified at query
time, per user, against your org connector policy.

> **Availability:** Per-user connect for Linear is **built and wired**.
> It activates for your org once your operator registers a Linear OAuth
> app and sets its `LINEAR_CLIENT_ID` / `LINEAR_CLIENT_SECRET`. Until
> then the **Connect** button on the "Connect your sources" page falls
> back to a "connect your account" stub instead of starting Linear's
> OAuth flow.

## Prerequisites

- A **Linear account** — each user connects their own; no shared
  personal API key
- The **Whiteout desktop app**, signed in
- **Admin (one-time):** expose the Linear integration and set the
  org-wide connector policy in the desktop app
- **Operator (one-time):** register a Linear OAuth app and set
  `LINEAR_CLIENT_ID` / `LINEAR_CLIENT_SECRET` on the backend. Until this
  is set, per-user connect stays in its fail-safe "connect your account"
  stub.

## Setup steps (per user)

1. Open the Whiteout desktop app → **Connect your sources**.
2. Find **Linear** in the sources grid → click **Connect**.
3. Authorize the Whiteout app on Linear's OAuth screen with your own
   account.
4. You're returned to Whiteout; Linear shows **Connected** for your
   account.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `read` | Read the issues and comments you can access, so we can classify them before AI sees them. |

We **do not** request write scopes. Whiteout never modifies your
Linear workspace.

## What to expect after connect

- **Per-user visibility.** Each user sees only the Linear teams and
  issues **they** can access. Nothing is pooled under a shared key.
- **On-demand classification.** Content is vetted at query time the
  first time your assistant requests it, then the verdict is cached.
  There is no initial scan and no org-wide corpus.
- **Content-governed results.** Items that fail policy come back with
  `content: null` plus a `whiteout_vetting` annotation; existence-
  classified items are removed entirely.

## Troubleshooting

- **Connect opens a "connect your account" stub instead of Linear's
  OAuth screen** — your operator hasn't set `LINEAR_CLIENT_ID` /
  `LINEAR_CLIENT_SECRET` yet. Per-user connect is wired; it activates
  once those are in place.
- **An issue isn't showing up** — the connector only sees what your
  Linear grant sees. Confirm you have access in Linear itself; access
  is governed by Linear, not Whiteout.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=linear`. Each row
is tagged with the requesting user, so per-user activity is visible.
