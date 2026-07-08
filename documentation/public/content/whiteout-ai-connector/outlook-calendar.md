# Connect Outlook Calendar

> **Availability: ✅ Live.** With
> [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
> in place, Outlook Calendar works **zero-click** — no per-user connect
> step.

Expose Outlook calendar content to AI assistants through the Whiteout AI
Connector. Outlook Calendar is a **live source**: it's **per-user only**
and classified **on demand at query time**.

- **Whiteout governs content** — event subjects and bodies routinely
  carry sensitive context (deals, candidates, incident bridges); every
  event is vetted against your org-wide connector policy before an AI
  sees it.
- **Microsoft governs access** — each user is served only their own
  calendars.

## Prerequisites

- **Whiteout admin** access (to expose Outlook Calendar and manage the
  org-wide policy)
- Either the one-time
  [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
  tenant consent (recommended), **or** each user connects their own
  Microsoft account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Outlook Calendar**
   on.
2. No backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI what's on your calendar; events come back vetted.
