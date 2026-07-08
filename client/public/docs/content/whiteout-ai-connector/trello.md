# Connect Trello

Expose Trello card content (descriptions + comments) to AI assistants
through the Whiteout AI Connector — with each user connecting their
**own** Trello account.

## How access works

- **Whiteout governs content.** Your org-wide connector policy vets
  every card description and comment before any AI assistant sees it.
- **Trello governs access.** The connector reads through *your* Trello
  grant, so it only ever sees the boards and cards **you** can already
  access. Trello's own permissions scope what's reachable — there is no
  shared key + token standing in for everyone.

This is a **live, on-demand** source. There is no pre-scanned org-wide
corpus and no admin "Documents" view — content is classified at query
time, per user, against your org connector policy.

> **Availability:** Per-user connect for Trello is **built and wired**.
> Its connect design differs from the other sources: Trello does not use
> standard OAuth — it authenticates with an **API key + token** pair
> rather than an OAuth app. That per-user key + token flow is wired into
> the connector's connect layer; it activates for your org once your
> operator sets the Trello **`TRELLO_API_KEY`** (the app's API key,
> against which each user captures their own read-only token). Until
> then the **Connect** button on the "Connect your sources" page falls
> back to a "connect your account" stub.

## Prerequisites

- A **Trello account** — each user connects their own; no shared board
  admin key
- The **Whiteout desktop app**, signed in
- **Admin (one-time):** expose the Trello integration and set the
  org-wide connector policy in the desktop app
- **Operator (one-time):** register a Trello API key and set
  `TRELLO_API_KEY` on the backend (Trello uses a key + token pair, not
  OAuth2). Until this is set, per-user connect stays in its fail-safe
  "connect your account" stub.

## Setup steps (per user)

1. Open the Whiteout desktop app → **Connect your sources**.
2. Find **Trello** in the sources grid → click **Connect**.
3. Authorize Whiteout with your own Trello account. Because Trello uses
   key + token auth rather than OAuth, the connect flow captures a
   per-user token scoped to your access.
4. You're returned to Whiteout; Trello shows **Connected** for your
   account.

## Scopes / permissions

Trello authenticates with an **API key + token** pair (not standard
OAuth). The intended per-user flow requests **read-only** access — we
do not request `write` or `account` scopes, and Whiteout never modifies
your boards.

## What to expect after connect

- **Per-user visibility.** Each user sees only the boards and cards
  **they** can access. Nothing is pooled under a shared key + token.
- **On-demand classification.** Content is vetted at query time the
  first time your assistant requests it, then the verdict is cached.
  There is no initial scan and no org-wide corpus.
- **Content-governed results.** Items that fail policy come back with
  `content: null` plus a `whiteout_vetting` annotation; existence-
  classified items are removed entirely.

## Troubleshooting

- **Connect opens a "connect your account" stub instead of Trello's
  authorize screen** — your operator hasn't set `TRELLO_API_KEY` yet.
  Per-user connect is wired; it activates once the key is in place.
- **A board or card isn't showing up** — the connector only sees what
  your Trello grant sees. Confirm you have access in Trello itself;
  access is governed by Trello, not Whiteout.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=trello`. Each row
is tagged with the requesting user, so per-user activity is visible.
