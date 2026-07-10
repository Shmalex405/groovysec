# Connect HubSpot

> **Availability: ⚙️ Requires operator setup.** HubSpot needs its OAuth
> app configured for your Whiteout deployment (`HUBSPOT_CLIENT_ID/SECRET`,
> a one-time operator step).

Expose HubSpot CRM data (contacts, companies, deals) to AI assistants
through the Whiteout AI Connector. HubSpot is a **live source**:
per-user only, classified **on demand at query time**.

- **Whiteout governs content** — CRM objects are returned as governed
  views and classified **whole-record**; contact PII can't leak through
  individual property fields.
- **HubSpot governs access** — each user connects their own account with
  their own CRM permissions.

## Prerequisites

- **Whiteout admin** access; operator has set `HUBSPOT_CLIENT_ID/SECRET`
  (scopes: `crm.objects.contacts.read`, `crm.objects.companies.read`,
  `crm.objects.deals.read`)
- Each user connects their HubSpot account from **Connect your sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **HubSpot** on.
2. Users connect; searches and record reads serve their own permissions,
   vetted whole-record.
