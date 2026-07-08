# Connect Slack

Slack is the **exception** to the connector's per-user model. Where
document stores connect per user, Slack is exposed **once by an admin**
through a shared Whiteout Slack **bot**.

> **Route Slack only through Whiteout.** If the same AI workspace also
> has its vendor-native Slack connector enabled (e.g. claude.ai's
> built-in Slack), the AI can read messages directly on that path,
> skipping Whiteout's vetting. Disable the native Slack connector where
> you govern Slack through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Why Slack is different

For document stores, each user connects their own account so the
connector serves only what that user can see. Slack works the other
way: a single **bot** reads the channels it's been invited to, and
**the bot's own membership *is* the intended exposure**. Adding the bot
to a channel is itself an access-control decision (a Slack ACL), not an
override of one — so there is no per-user connect. Content is still
governed the same way: every message is vetted against your org-wide
connector policy before an assistant reads it — a dedicated policy,
separate from your users' normal group policies, which don't apply to
connector reads.

## Prerequisites

- **Slack workspace admin** (to install the Whiteout bot)
- **Whiteout admin** access to the desktop app (to expose Slack and
  manage the connector policy)

## Setup steps

1. In the Whiteout desktop app, open the connector and **Connect
   Slack**.
2. Sign in to your Slack workspace and **Allow** the Whiteout app to
   install the bot.
3. Slack shows **Connected**.
4. **Invite the bot to the channels you want governed:** in each
   channel, type `/invite @whiteout-ai-bot`. The bot reads only
   channels it's a member of.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `search:read` | Find messages across the channels the bot is in. |
| `channels:history` | Read messages in channels the bot is a member of. |
| `channels:read` | Enumerate channels at sync time. |

The bot never reads a channel it hasn't been invited to.

## What to expect after connect

- **Access = bot membership.** Assistants can surface messages only
  from channels the bot has been added to. Removing the bot from a
  channel removes that channel from governance.
- **Not per-user.** Unlike Notion / Confluence / Box / Dropbox, users
  do **not** connect their own Slack accounts. The single bot is the
  connection for the whole org.
- **Content vetting:** every message still passes the org-wide
  connector policy before an assistant sees it.
- **Sync:** Tier 1 delta polling runs ~every 5 minutes; enable Tier 2
  **real-time sync** for sub-minute latency.

## Troubleshooting

- **Bot can't read a channel** — invite it: `/invite @whiteout-ai-bot`
  in that channel.
- **Private channels / DMs not appearing** — by design. The bot only
  reads channels it's explicitly added to.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=slack`.
