# Microsoft 365 (Zero-Click)

> **Availability: ⚙️ Requires operator setup.** The platform support is
> live; your Whiteout operator enables the Entra app for the deployment
> (a one-time step — Whiteout-hosted: ask your account manager). After
> that, everything on this page is a single admin click.

Light up **per-user** SharePoint, OneDrive, Outlook Mail **and** Outlook
Calendar access for the Whiteout AI Connector across your whole Microsoft
365 tenant — with **no end-user OAuth screen**. Instead of every user
clicking "Connect," a Microsoft **tenant admin consents once**, org-wide,
to the Whiteout app; from then on the connector serves each caller their
**own** data using Microsoft's app-only (application-permission) model.

This one consent covers **SharePoint, OneDrive, Outlook Mail, Outlook
Calendar, and Microsoft Teams chats** — you do it once, not per source.
(Tenants that consented before Teams support must **re-consent** — same
one-click flow — because the app's permission set grew.)

- **Zero per-user clicks.** No individual consent screens.
- **Still ACL-correct for personal data.** Every read is addressed to the
  calling user's own drive, mailbox, or calendar (`/users/{caller}/…`),
  and Whiteout verifies the caller exists in your tenant before serving.
  Content is still vetted org-wide before any AI sees it.
- **SharePoint is bounded by an allowlist.** Shared sites don't carry
  per-user permissions under an app-only token, so zero-click SharePoint
  serves **only the sites you explicitly allowlist** — and stays off until
  you add at least one. Users who connect their own Microsoft account are
  always served with their own token first, preserving full per-user
  permissions inside shared sites.

> If you'd rather have each user connect their own Microsoft account
> instead, use the per-user OAuth flow in the
> [SharePoint](./whiteout-ai-connector/sharepoint.md) and
> [OneDrive](./whiteout-ai-connector/onedrive.md) guides — no Microsoft
> app verification wait applies either way.

## Prerequisites

- A **Microsoft tenant admin** (Global Administrator or Privileged Role
  Administrator) to accept the consent.
- Users' **Microsoft sign-in (UPN) must match their Whiteout login
  email** — zero-click reads are keyed to that email.
- Whiteout's Entra app is pre-configured — nothing to register on the
  Microsoft side. (Self-hosted deployments: your operator sets
  `MICROSOFT_CLIENT_ID/SECRET` first — see the ops runbook.)

## Setup steps

### 1. Grant tenant admin-consent (one click)

1. In Whiteout: **Integrations → Whiteout AI Connector** → open any
   Microsoft source (SharePoint, OneDrive, Outlook Mail or Calendar).
2. In the **Microsoft 365 zero-click** panel, click **Grant admin
   consent**.
3. Sign in as a tenant admin and **Accept**. Microsoft returns you to a
   confirmation page; back in Whiteout, refresh the panel — it shows
   **Consent granted** with your tenant id.

Whiteout validates the grant immediately (it mints a real app-only token
before recording anything), so a half-completed consent can't be saved.

### 2. (SharePoint only) Allowlist the sites to govern

In the SharePoint source's zero-click panel, enter the site URLs to make
available — one per line — and **Save allowlist**:

```
https://contoso.sharepoint.com/sites/engineering
https://contoso.sharepoint.com/sites/handbook
```

Each URL is verified against your tenant at save time. The allowlist
bounds both what zero-click users can read **and** what Whiteout's
scanner classifies for the org-wide Documents review. An empty allowlist
keeps SharePoint zero-click off.

### 3. Expose the sources

Expose SharePoint / OneDrive / Outlook Mail / Outlook Calendar on the
connector card as usual. OneDrive and Outlook need no further setup;
SharePoint's backfill scan runs against your allowlisted sites using the
same grant — no separate scanner credential to configure.

## How access is decided

| Source | Zero-click read | Permission model |
|---|---|---|
| OneDrive | The caller's own drive | Per-user by construction |
| Teams chats | The caller's own 1:1/group chats | Per-user by construction |
| Teams channels | Not served zero-click | Delegated-only — each user's own connected account, exactly their team memberships |
| Outlook Mail / Calendar | The caller's own mailbox/calendar | Per-user by construction |
| SharePoint | Allowlisted sites only | Site-level (admin-chosen); users with their own connected account keep full per-user permissions |

## Revoking

Remove the Whiteout app's consent in **Entra → Enterprise applications**
at any time. App-only serving stops within the hour (token lifetime);
users fall back to per-user connect, and unconnected users get the
governed "connect your account" response — never someone else's data.
