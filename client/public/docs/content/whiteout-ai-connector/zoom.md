# Connect Zoom

> **Availability: ⚙️ Requires operator setup.** Zoom needs a USER-level
> OAuth app configured for your Whiteout deployment
> (`ZOOM_CLIENT_ID/SECRET`, a one-time operator step).

Expose Zoom meetings and — most importantly — **recording transcripts**
to AI assistants through the Whiteout AI Connector. Zoom is a **live
source**: per-user only, classified **on demand at query time**.

- **Whiteout governs content** — meeting topics, agendas, and full
  recording **transcripts** are vetted like any document before an AI
  sees them. (Transcripts are exactly the kind of content that carries
  M&A, HR, and incident detail.)
- **Zoom governs access** — each user connects their own Zoom account
  and reaches only their own meetings and recordings.

## Prerequisites

- **Whiteout admin** access; operator has set `ZOOM_CLIENT_ID/SECRET`
  (user-level OAuth app — scopes fixed on the app registration)
- Each user connects their Zoom account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Zoom** on.
2. Users connect; meeting lists and transcripts serve their own
   recordings, vetted.
