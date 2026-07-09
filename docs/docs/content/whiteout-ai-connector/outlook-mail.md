# Connect Outlook Mail

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step). With
> [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
> in place, Outlook Mail works **zero-click** — no per-user connect step.

Expose Outlook mailbox content to AI assistants through the Whiteout AI
Connector. Outlook Mail is a **live source**: it's **per-user only** and
classified **on demand at query time** — there is no pre-scanned corpus
and no org-wide scanner.

- **Whiteout governs content** — one org-wide policy vets every message,
  and every attachment's extracted text, before an AI sees it. Raw
  attachment bytes are never returned to the AI.
- **Microsoft governs access** — each user is served only their own
  mailbox (`/users/{caller}/…` under zero-click, or their own delegated
  token if they connected manually).

> **Route Outlook only through Whiteout.** If the same AI workspace also
> has a vendor-native Microsoft 365 connector enabled, the AI can read
> mail directly on that path, skipping Whiteout's vetting. Disable the
> native connector where you govern Outlook through Whiteout.

## Prerequisites

- **Whiteout admin** access (to expose Outlook Mail and manage the
  org-wide policy)
- Either the one-time
  [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
  tenant consent (recommended), **or** each user connects their own
  Microsoft account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Outlook Mail** on.
2. There is no backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI to search your mail; the response is vetted against
   your connector policies before anything is returned.
