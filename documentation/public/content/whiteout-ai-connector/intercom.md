# Connect Intercom

> **Availability: ⚙️ Requires operator setup.** Intercom needs its OAuth
> app configured for your Whiteout deployment
> (`INTERCOM_CLIENT_ID/SECRET`, a one-time operator step). US region for
> v1 (EU/AU regional hosts are a scoped follow-up).

Expose Intercom customer conversations, contacts, and articles to AI
assistants through the Whiteout AI Connector. Intercom is a **live
source**: per-user only, classified **on demand at query time**.

- **Whiteout governs content** — customer conversations are vetted
  message-by-message: the opener AND **every reply in the thread** is
  individually classified; contact records are vetted whole-record (PII
  can't leak through individual fields).
- **Intercom governs access** — each user connects their own Intercom
  account with their workspace permissions.

## Prerequisites

- **Whiteout admin** access; operator has set `INTERCOM_CLIENT_ID/SECRET`
- Each user connects their Intercom account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Intercom** on.
2. Users connect; conversation and contact reads serve their own
   workspace view, vetted per message.
