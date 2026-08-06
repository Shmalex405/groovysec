# Vendor-Native Connector Control

ChatGPT, Claude, and Gemini all ship **their own connectors** to Google
Drive, Gmail, SharePoint, OneDrive, Teams and more. Those are a second,
ungoverned door into the same data the Whiteout AI Connector guards —
content read on the native path never passes your policies.

This page covers the three controls Whiteout gives you over that door:

1. **Block** a source's native connector so it can't be connected.
2. **Find** connections that already existed before Whiteout arrived.
3. **Revoke** the AI vendor's standing access at the data source itself.

> **Where this fits:** [Overview → Route each source only through
> Whiteout](./whiteout-ai-connector/overview.md) explains *why* a source
> should have exactly one door. This page is *how you enforce it.*

## 1. Block a connector for external AI

**Integrations → Data Integrations →** click a source **→ Block
External AI.**

The setting is **org-wide** and works whether or not anyone has ever
connected that source. Blocked sources show a red **Blocked** chip on
their card.

On a user's machine the browser extension then:

- **greys out and blocks** that connector wherever an AI platform offers
  it — the connectors settings list, the in-chat connector picker, the
  "add connectors" directory, and file-picker menu items like *Add from
  Drive*;
- **intercepts the click** and shows an explanation naming your
  organization, rather than silently failing.

This stops **new** connections. It does not, by itself, remove a
connection that already exists — which is what the next two sections
are for.

## 2. Find pre-existing connections

If someone connected Gmail to ChatGPT *before* your organization
deployed Whiteout, blocking the connector does not disconnect it. The
grant keeps working.

Whiteout finds these two ways:

**On the endpoint.** When a user visits a connectors page on ChatGPT,
Claude, or Gemini, the extension reports which connectors are listed and
whether each is connected. This is **metadata only** — connector names
and their connected/available state. No page content, no messages, and
no document data ever leaves the page.

**At the data source.** For Google Workspace and Microsoft 365,
Whiteout can ask your tenant directly which AI vendors hold OAuth grants
— covering every user and every device, including personal laptops and
phones that never run Whiteout. See setup below.

Either way, a connector that is **still connected while your policy
blocks it** raises a **high-severity finding**:

- **Integrations → Data Integrations** shows a banner — *"N pre-existing
  connections to blocked connectors still active on external AI
  platforms"* — and each affected card carries a **"N still connected"**
  chip.
- **Review** opens the finding in **AI Footprint**, showing who, which
  platform, and the recommended action. Findings deliver to your
  SOC/SIEM like any other coverage gap.
- A finding **resolves by itself** once the connector is disconnected or
  you unblock the policy — there is nothing to tidy up manually.

### What the user sees

A blocked-but-still-connected row is **not frozen**. Whiteout marks it
**"Blocked — disconnect required"** and deliberately **leaves the
disconnect controls working**, with an overlay explaining what to do.
Using the connector stays blocked everywhere; the path to *comply* stays
open. The user can fix it themselves in a few seconds, and the finding
closes on its own.

## 3. Revoke existing grants at the source

Endpoint controls guide a user to disconnect. **Revoking removes the AI
vendor's access outright** — from every device and browser, whether or
not Whiteout is installed there.

**Integrations → Data Integrations →** a Google or Microsoft source **→
Revoke existing grants…**

Whiteout first shows you a **live preview** before anything is
destroyed:

- every user whose account has granted that vendor access;
- the **data sources each grant reaches**;
- which grants will actually be revoked versus which are **review only**.

Only then does it ask you to type `revoke` to confirm.

> **A grant is per AI application, not per data source.** One ChatGPT
> grant typically covers Drive **and** Gmail **and** Calendar. Revoking
> it removes all of them at once — Google and Microsoft offer no way to
> revoke part of a grant. The preview always spells out the full reach
> so this is never a surprise.

Every revocation is written to the admin audit trail
(`connector.grants.revoked`) and raises a config-change notification.

### "Review only" grants

Whiteout revokes an application **only** when it can identify it by its
verified OAuth client ID. An app that merely *looks* like an AI vendor
by name is listed for your review and is never revoked automatically.
This is deliberate: a mistaken match would revoke a legitimate business
application for your entire organization.

### Microsoft: tokens outlive the grant

Deleting a grant stops Microsoft issuing **new** tokens, but tokens
already issued stay valid for up to an hour. For an immediate cut-off,
tick **"Also force sign-out"** — note this signs the affected users out
of **all** Microsoft applications, not just the AI tool.

Microsoft also distinguishes **per-user consent** from **organization-wide
admin consent**. Org-wide grants are labelled *Entire organization* in
the preview, since revoking one affects everybody at once.

## Setup

Blocking and detection work out of the box — **no cloud permissions
required.** Only source-side revocation needs additional authorization.

### Google Workspace

Add one scope to the domain-wide delegation grant you created in
[Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md):

```
https://www.googleapis.com/auth/admin.directory.user.security
```

**admin.google.com → Security → Access and data control → API controls →
Domain-wide delegation →** edit your Whiteout client ID and **append**
this scope to the existing list.

> The scope box **replaces** the whole list when saved — add to what is
> already there rather than retyping it.

This scope lets Whiteout list and delete third-party OAuth grants for
users in your domain. It grants no access to mail or file content.

### Microsoft 365

Your Microsoft tenant admin re-consents through the usual one-click flow
(**Integrations → Whiteout AI Connector → Microsoft admin consent**)
after the app's permission set is extended with:

| Permission | Purpose |
|---|---|
| `Application.Read.All` | Identify AI-vendor applications in your tenant |
| `DelegatedPermissionGrant.ReadWrite.All` | Remove delegated consent grants |
| `AppRoleAssignment.ReadWrite.All` | Remove application-permission grants |
| `User.RevokeSessions.All` | *Optional* — the immediate force-sign-out above |

> These are powerful permissions: delegated-grant write can remove **any**
> application's consent, not only AI vendors'. Whiteout constrains every
> action to verified AI-vendor applications and previews each one, but
> your security team should evaluate the permission on its own terms.

### If you'd rather not grant either

You don't have to. Blocking and detection need **no cloud permissions
at all** — you still see exactly who has a blocked connector connected,
and your users are still guided to disconnect. You simply perform the
revocation yourself in your own Google or Microsoft admin console.

## Honest limits

- **Endpoint enforcement is advisory by design.** The browser extension
  blocks connectors on managed browsers. A user on an unmanaged personal
  device is not covered — which is precisely why source-side revocation
  exists, since it applies everywhere.
- **Personal accounts are invisible to the source-side sweep.** Asking
  your Google or Microsoft tenant reveals grants against **your**
  corporate data. A user connecting a personal Gmail to a personal
  ChatGPT is outside your tenant; only endpoint detection can see it.
- **Gemini's access to Workspace is not a third-party grant.** Google
  governs it natively, so it doesn't appear as a revocable OAuth grant —
  manage that through your own Workspace admin controls.
- **Non-Microsoft, non-Google sources** (GitHub, Atlassian, Notion, …)
  are blocked and detected as normal, but revocation is done in that
  vendor's own admin console; Whiteout does not automate it today.

## Related

- [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md)
- [Connector Policy](./whiteout-ai-connector/connector-policy.md) — what
  Whiteout vets on its **own** path
- [Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md)
- [Microsoft 365 (Zero-Click)](./whiteout-ai-connector/microsoft-365-zero-click.md)
