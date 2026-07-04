# Whiteout AI Connector — Overview

The Whiteout AI Connector is the single endpoint your AI assistants
(Claude Desktop, ChatGPT Custom GPTs, Gemini Actions, and any other
MCP-capable client such as Cursor, VS Code, or Cline) connect to in
order to read documents and events from your connected apps —
**after** every payload passes through Whiteout's policy engine.

## How it works

1. **Connect a source app** (Google Drive, Slack, etc.) once from the
   Integrations page. We OAuth into the source under your admin's
   account.
2. **Initial scan runs automatically** for pre-vetted document-store
   integrations (Drive, SharePoint, OneDrive, Confluence, Notion).
   Every doc gets classified against your policy library and stamped
   into our verdict cache. Typical duration: ~5 minutes for 100 docs,
   scaling roughly linearly.
3. **Real-time sync** keeps the cache fresh. Drive/SharePoint/OneDrive/
   Confluence/Notion poll for deltas every 5 minutes and optionally
   fire webhooks for sub-minute latency. Dropbox and Box are vetted
   on demand at query time instead. Gmail/Slack/GitHub/Jira/Linear/
   Asana/Trello classify events as they happen.
4. **Your AI assistant calls the connector.** It only sees content
   that survived the policy verdict — flagged docs come back with
   `content: null` plus a `whiteout_vetting` annotation, existence-
   classified items are removed entirely.

## Setup categories

**Document stores (pre-vetted)** — full corpus is scanned up front,
deltas keep it current: Google Drive, SharePoint, OneDrive,
Confluence, Notion.

**Document stores (on-demand)** — no upfront corpus scan; content is
vetted at query time when your assistant requests it: Dropbox, Box.

**Event streams (firehose)** — no historical scan; classified on
arrival, optionally backfilled to last 30 days: Gmail, Slack, GitHub,
Jira, Linear, Asana, Trello.

## Two-tier sync

Each integration ships with two complementary sync modes:

- **Tier 1 (delta polling)** — runs every ~5 minutes. Always on.
  Authoritative.
- **Tier 2 (webhooks)** — drops change-detection latency from minutes
  to seconds. Enable per integration via **"Enable real-time sync"**
  in the Connector card detail dialog. If webhooks fail, Tier 1
  catches everything within 5 minutes.

## What's on this page

Each linked guide on the left walks through:
1. **Prerequisites** — what admin access you need where
2. **Step-by-step setup** — exact click-paths in both Whiteout and
   the source app
3. **Required scopes** — what we ask for and why
4. **What to expect after connect** — initial scan size estimate,
   when sync starts, how to verify it's working
5. **Real-time sync setup** — for integrations that support it
6. **Troubleshooting** — the errors we surface most often and how to
   fix them
7. **Audit log location** — where to find the connector's activity
   trail in your admin dashboard
