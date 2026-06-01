# Connect Slack

Expose Slack public-channel messages to AI assistants through the
Whiteout AI Connector.

## Prerequisites

- **Slack workspace admin** (to install our app)
- **Whiteout admin** access

## Setup steps

1. Open the **Whiteout AI Connector** card → click **Slack**.
2. Click **Connect Slack**.
3. Sign in to the Slack workspace and **Allow** the Whiteout app.
4. The card shows **Connected**.

## Scopes Whiteout requests

| Scope | Why |
|---|---|
| `channels:history` | Read messages in public channels. |
| `channels:read` | Enumerate channels at sync time. |
| `users:read` | Identify which user posted each message. |

**Off by default**: `groups:history` (private channels), `im:history`
(DMs), `mpim:history` (group DMs). Enable these only if you want
governance over private/DM traffic — they require additional admin
consent.

## What to expect after connect

- **No initial scan.** Slack is a high-volume firehose — we anchor at
  "now". Historical messages stay out of cache unless touched.
- **Content-length floor:** messages under 50 characters skip the deep
  classifier. ~80% of Slack traffic is short ack messages ("yes",
  "+1", "thanks") — running them through Ollama is pure waste.
- **Tier 1 sync:** every 5 minutes, `conversations.history` per
  channel filtered by message timestamp.
- **Real-time sync (Tier 2):** click **Enable real-time sync**. Slack's
  Events API is configured at the Whiteout-app level (we've already
  done this); Enable real-time binds your workspace's team_id to your
  org so notifications route correctly.

## Troubleshooting

- **Bot can't read a channel** — the Slack bot user needs to be
  invited to that specific channel. Type `/invite @whiteout-ai-bot`
  in the channel.
- **Replay attacks rejected** — Slack signatures have a 5-minute
  freshness window. If your backend clock drifts > 5min from real
  time, signatures fail. Sync NTP.
- **DM traffic not appearing** — by design. Enable the DM scopes
  during connect (see above) to opt in.

## Audit log

**Admin → Audit → MCP Activity**, filter `integration=slack`.
