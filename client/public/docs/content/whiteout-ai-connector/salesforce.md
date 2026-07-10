# Connect Salesforce

> **Availability: ⚙️ Requires operator setup.** Salesforce needs a
> Connected App configured for your Whiteout deployment
> (`SALESFORCE_CLIENT_ID/SECRET`, a one-time operator step).

Expose Salesforce CRM data to AI assistants through the Whiteout AI
Connector. Salesforce is a **live source**: per-user only, classified
**on demand at query time**.

- **Whiteout governs content** — records are returned as governed views
  and classified **whole-record**: if a record trips policy, the entire
  record is withheld — no individual field slips past.
- **Salesforce governs access** — each user connects their own account;
  your org's roles and sharing rules scope exactly what they see.

## Prerequisites

- **Whiteout admin** access; operator has set
  `SALESFORCE_CLIENT_ID/SECRET` (Connected App with `api` +
  `refresh_token` scopes)
- Each user connects their Salesforce account from **Connect your
  sources**

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Salesforce** on.
2. Users connect; SOQL/SOSL/record reads serve their own permissions,
   vetted whole-record.
