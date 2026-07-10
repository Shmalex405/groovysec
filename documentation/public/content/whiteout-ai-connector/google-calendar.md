# Connect Google Calendar

> **Availability: ✅ Live.** With
> [Google Workspace zero-click](./whiteout-ai-connector/google-workspace-dwd.md)
> in place (the DWD grant must include the `calendar.readonly` scope),
> Google Calendar works **zero-click** — no per-user connect step.

Expose Google Calendar content to AI assistants through the Whiteout AI
Connector. Calendar is a **live source**: per-user only, classified **on
demand at query time**.

- **Whiteout governs content** — event titles and descriptions routinely
  carry sensitive context (deals, candidates, incident bridges); every
  event is vetted against your org-wide connector policy before an AI
  sees it.
- **Google governs access** — each user is served only their own
  calendars (and calendars shared with them).

## Prerequisites

- **Whiteout admin** access (to expose Google Calendar)
- Either the Workspace **DWD grant** including `calendar.readonly`
  (recommended — zero-click), **or** each user connects their Google
  account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Google Calendar** on.
2. No backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI what's on your calendar; events come back vetted.
