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
- **Zero-click is read-only.** Changes the AI makes in SharePoint,
  OneDrive, Outlook Mail and Outlook Calendar use each person's own
  Microsoft connection, never this app-only access. See
  [Changes need each person's own connection](#changes-need-each-persons-own-connection).

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

> **Re-consent when the permission set grows.** Microsoft records the
> permissions in force at the moment you consented, so any tenant that
> consented earlier must re-run this same one-click flow to pick up new
> ones. Permissions have been added for Teams support, for finding and
> optionally removing AI apps people connected (below), and for the
> [Microsoft 365 Copilot audit log](./ai-footprint/vendor-audit-logs.md#microsoft-365-copilot).

### 1b. Permissions for finding and removing AI apps

The same consent lets Whiteout check your tenant once a day for AI apps
people connected with their work account, and, if you choose, remove
their access — see
[AI Apps Connected With Work Accounts](./ai-footprint/connected-ai-apps.md#microsoft-365)
and [Vendor-Native Connector Control](./whiteout-ai-connector/native-connector-control.md).
The Graph **application** permissions come in two sets:

| Set | Permission | Purpose |
|---|---|---|
| Detect (read-only) | `Application.Read.All` | Identify AI-vendor applications in your tenant |
| | `DelegatedPermissionGrant.Read.All` | List the consent people gave to each app |
| | `User.Read.All` | Match each consent to a person |
| Revoke | `DelegatedPermissionGrant.ReadWrite.All` | Remove delegated consent grants |
| | `AppRoleAssignment.ReadWrite.All` | Remove application-permission grants |
| | `User.RevokeSessions.All` | *Optional* — force immediate sign-out so already-issued tokens die with the grant |

> Evaluate the revoke set on its own terms: delegated-grant write can remove
> **any** application's consent in your tenant, not only AI vendors'.
> Whiteout constrains every action to applications it can identify by
> verified OAuth ID and previews each one before you confirm — but the
> permission itself is broad.

Detecting needs only the read-only set; the revoke set is needed only to
remove access from Whiteout. Where your Whiteout server has the separate,
read-only **Whiteout Discovery** app, your tenant can consent to that for
detecting (and for the Microsoft 365 Copilot audit log) instead, without
giving this app's write permissions; see
[AI Apps Connected With Work Accounts](./ai-footprint/connected-ai-apps.md#microsoft-365). Blocking native connectors needs **no
Microsoft permissions at all.**

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

## Changes need each person's own connection

Zero-click access is app-only. Any change made with it would show as
made by the Whiteout app, not by the person. So every change the AI
makes in SharePoint, OneDrive, Outlook Mail and Outlook Calendar uses
that person's own Microsoft connection, and shows up in Microsoft 365
under their name. Zero-click reads keep working, and nothing changes
for people who only read.

### Add the delegated permissions (operator, once)

Your Whiteout operator adds these **delegated** permissions to
Whiteout's Entra app (Whiteout-hosted: ask your account manager):

| Source | Delegated permissions |
|---|---|
| SharePoint | `Files.ReadWrite.All`, `Sites.ReadWrite.All` |
| OneDrive | `Files.ReadWrite.All` |
| Outlook Mail | `Mail.ReadWrite`, `Mail.Send` |
| Outlook Calendar | `Calendars.ReadWrite` |

### Each person connects once

- People who read these sources zero-click see **Connect to make
  changes** on **Connect your sources**. Until they connect, the AI is
  told to connect their Microsoft account first (`connect_for_write`),
  with a link.
- People who connected their own Microsoft account before changes were
  turned on see **Grant write access** there, and reconnect once.
- **One Microsoft connection covers all four sources.** The consent
  screen asks only for the write permissions of the sources your
  organization has exposed and allows changes in.

Each source's **What the AI can change** panel shows when people need
to connect before the AI can make changes as them. What the AI may
change is set per source; see
[Write Actions](./whiteout-ai-connector/write-actions.md). Microsoft
Teams stays read-only.

## How access is decided

| Source | Zero-click read | Permission model | Changes |
|---|---|---|---|
| OneDrive | The caller's own drive | Per-user by construction | Each person's own Microsoft connection |
| Teams chats | The caller's own 1:1/group chats | Per-user by construction | Read-only |
| Teams channels | Not served zero-click | Delegated-only — each user's own connected account, exactly their team memberships | Read-only |
| Outlook Mail / Calendar | The caller's own mailbox/calendar | Per-user by construction | Each person's own Microsoft connection |
| SharePoint | Allowlisted sites only | Site-level (admin-chosen); users with their own connected account keep full per-user permissions | Each person's own Microsoft connection |

## Revoking

Remove the Whiteout app's consent in **Entra → Enterprise applications**
at any time. App-only serving stops within the hour (token lifetime);
users fall back to per-user connect, and unconnected users get the
governed "connect your account" response — never someone else's data.
