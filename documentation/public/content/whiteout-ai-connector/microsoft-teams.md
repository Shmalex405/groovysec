# Connect Microsoft Teams

> **Availability: ✅ Live** once your tenant has granted (or re-granted)
> the [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
> admin-consent that includes the Teams permissions. **Chats are
> zero-click; channels require each user's own connected account.**

Expose Microsoft Teams conversations to AI assistants through the
Whiteout AI Connector — the governed alternative to claude.ai's native
M365 connector reading Teams directly. Teams is a **live source**:
per-user only, classified **on demand at query time**.

Two surfaces with different access models, both vetted per message:

- **Chats (1:1 and group)** — served **zero-click**: each caller sees
  only their own chats, by construction. No per-user connect.
- **Team channels** — **delegated-only**: the caller must connect their
  own Microsoft account (Connect your sources), and sees exactly the
  teams they're a member of. Whiteout never serves channel content with
  the org-wide app credential — an app-wide token could read every team.

> **Route Teams only through Whiteout.** If the same AI workspace also
> has a vendor-native Teams/M365 connector enabled, the AI can read
> messages directly on that path, skipping Whiteout's vetting. Block the
> native connector where you govern Teams through Whiteout (the
> Microsoft Teams card on the Data Integrations page).

## Prerequisites

- **Whiteout admin** access (to expose Microsoft Teams)
- Tenant admin-consent including the Teams permissions — tenants that
  consented before Teams support must **re-consent** (one click, same
  flow)
- For channels: each user connects their Microsoft account from
  **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Microsoft Teams** on.
2. No backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI about a chat → vetted messages. Ask about a channel
   → served with your own membership, or a governed "connect your
   account" prompt if you haven't linked.
