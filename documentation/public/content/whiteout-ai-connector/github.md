# Connect GitHub

Expose GitHub issues, pull requests, and comments to AI assistants
through the Whiteout AI Connector — with each developer connecting
their **own** GitHub account.

## How access works

- **Whiteout governs content.** Your org-wide connector policy vets
  every payload before any AI assistant sees it.
- **GitHub governs access.** The connector reads through *your* GitHub
  grant, so it only ever sees the repos and issues **you** can already
  access. GitHub's own permissions scope what's reachable — there is
  no shared admin credential standing in for everyone.

This is a **live, on-demand** source. There is no pre-scanned org-wide
corpus and no admin "Documents" view — content is classified at query
time, per user, against your org connector policy.

> **Route GitHub only through Whiteout.** If the same AI workspace also
> has its vendor-native GitHub connector enabled (e.g. claude.ai's
> built-in GitHub), the AI can read GitHub directly on that path,
> skipping Whiteout's vetting. Disable the native GitHub connector where
> you govern GitHub through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

> **Availability:** Per-user connect for GitHub is **built and wired**.
> It activates for your org once your operator registers a GitHub OAuth
> app and sets its `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`. Until
> then the **Connect** button on the "Connect your sources" page falls
> back to a "connect your account" stub instead of starting GitHub's
> OAuth flow.

## Prerequisites

- A **GitHub account** — each user connects their own; no admin token
- The **Whiteout desktop app**, signed in
- **Admin (one-time):** expose the GitHub integration and set the
  org-wide connector policy in the desktop app
- **Operator (one-time):** register a GitHub OAuth app and set
  `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` on the backend. Until this
  is set, per-user connect stays in its fail-safe "connect your account"
  stub.

## Setup steps (per user)

1. Open the Whiteout desktop app → **Connect your sources**.
2. Find **GitHub** in the sources grid → click **Connect**.
3. Authorize the Whiteout app on GitHub's OAuth screen with your own
   account.
4. You're returned to Whiteout; GitHub shows **Connected** for your
   account.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `repo` | Read the content (issue bodies, PR descriptions, comments) of the repos you can access, so we can classify it before AI sees it. |
| `read:org` | Resolve your org and team membership to enumerate the repos available to you. |

We **do not** request write scopes, and we **do not** classify code in
PR diffs — only PR descriptions, issue bodies, and comments. The deep
classifier is trained on documents, not source code.

## What to expect after connect

- **Per-user visibility.** Each developer sees only the repos **they**
  can access. Two users who connect will each get their own scoped
  view; nothing is pooled under a shared credential.
- **On-demand classification.** Content is vetted at query time the
  first time your assistant requests it, then the verdict is cached.
  There is no initial scan and no org-wide corpus.
- **Content-governed results.** Items that fail policy come back with
  `content: null` plus a `whiteout_vetting` annotation; existence-
  classified items are removed entirely.

## Troubleshooting

- **Connect opens a "connect your account" stub instead of GitHub's
  OAuth screen** — your operator hasn't set `GITHUB_CLIENT_ID` /
  `GITHUB_CLIENT_SECRET` yet. Per-user connect is wired; it activates
  once those are in place.
- **A repo isn't showing up** — the connector only sees what your
  GitHub grant sees. Confirm you have access to the repo on GitHub
  itself; access is governed by GitHub, not Whiteout.
- **Bot comments classifying noisily** — filter by `user.login` in the
  audit dashboard to mute specific bots.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=github`. Each row
is tagged with the requesting user, so per-user activity is visible.
