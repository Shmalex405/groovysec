# Connect GitHub

Expose GitHub issues, pull requests, and comments to AI assistants
through the Whiteout AI Connector.

## Prerequisites

- A **GitHub account** with **admin access** on the repository (or
  repositories) you want exposed
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **GitHub**.
2. Click **Connect GitHub**.
3. Provide:
   - **Personal access token** (fine-grained recommended) OR install
     the Whiteout GitHub App
   - **Owner** and **Repo** — the repository to expose
4. The card shows **Connected**.

## Scopes / permissions

| Permission | Why |
|---|---|
| `repo:read` (issues + pull requests + metadata) | Read the resource content we classify. |
| `webhook:write` | Register the real-time event hook on the repo. |

We **do not** classify code in PR diffs — only PR descriptions,
issue bodies, and comments. The deep classifier is trained on
documents, not source code.

## What to expect after connect

- **No initial scan.** GitHub is a firehose — anchored at "now".
- **Tier 1 sync:** every 5 minutes, `/repos/{owner}/{repo}/events`
  filtered to `IssuesEvent`, `IssueCommentEvent`, `PullRequestEvent`,
  `PullRequestReviewCommentEvent`.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. We
  register a per-repo webhook with HMAC-SHA256 signing
  (`X-Hub-Signature-256`).
- **Multi-repo:** add each repo as a separate connection. Each one
  registers its own webhook.

## Troubleshooting

- **403 on webhook registration** — token lacks `webhook:write` /
  `admin:repo_hook`. Re-issue with the correct scope.
- **Push / commit events not appearing** — by design. We don't
  classify commits. Diffs aren't classifiable content for this engine.
- **Bot comments classifying noisily** — known limitation. Filter by
  `user.login` in the audit dashboard to mute specific bots.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=github`.
