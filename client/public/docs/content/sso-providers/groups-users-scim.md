# Groups, Users & SCIM Provisioning

This guide explains how a Whiteout AI administrator gets groups and users from a connected identity provider into the platform, and what stays in sync automatically afterward — including just-in-time (JIT) provisioning, SCIM provisioning, rename propagation, deleted-source detection, and opt-in auto-import.

Everything in this guide is done in the admin dashboard UI — no CLI or API calls required.

## Overview

Once an identity provider is connected (see the per-provider setup guides), Whiteout AI can:
- **JIT Provisioning**: Create user accounts automatically on first SSO login
- **Group Sync**: Import IdP groups and keep membership in sync
- **Lifecycle Sync**: Propagate renames, detect deleted source groups, auto-import new groups
- **SCIM Provisioning**: Let the IdP push user and group changes in real time

## Concepts

| Term | Meaning |
|------|---------|
| **IdP config** | A connected identity provider (Integrations page). An organization can connect more than one. |
| **Whiteout group** | The unit policy is scoped to. Users belong to groups; groups carry policy settings. |
| **Group mapping** | Links one IdP group to one Whiteout group. Membership (and, for IdP-created groups, the name) flows IdP → Whiteout. |
| **IdP-synced group** | A Whiteout group created *from* an IdP group. Locked in Whiteout AI (no rename/delete/membership edits) — the IdP is its source of truth. |
| **JIT provisioning** | A Whiteout account is created automatically the first time a directory user signs in via SSO, or when group sync encounters them. |

## Provider Capability Matrix

| Provider | SSO Login | Group Sync & Lifecycle | SCIM Push |
|----------|-----------|------------------------|-----------|
| [Okta](./sso-providers/okta.md) | Yes | Yes | Yes |
| [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md) | Yes | Yes | Yes |
| [Google Workspace](./sso-providers/google-workspace.md) | Yes | Yes | No (pull-only) |
| [OneLogin](./sso-providers/onelogin.md) | Yes | Yes | Yes |
| [Ping Identity](./sso-providers/ping-identity.md) | Yes | Yes | Yes |
| [JumpCloud](./sso-providers/jumpcloud.md) | Yes | Yes | Yes |
| [Auth0](./sso-providers/auth0.md) | Yes | No | No |
| [Generic OIDC](./sso-providers/generic-oidc.md) / [SAML](./sso-providers/generic-saml.md) | Yes | No | No |

**Group Sync & Lifecycle** covers everything in this guide: membership sync, rename propagation, deleted-source detection, and auto-import. Providers without it still get SSO login and JIT user provisioning; groups are managed manually.

On SCIM-capable providers, enabling SCIM makes the IdP push changes in real time and demotes the scheduled pull to a weekly read-only verifier that catches missed pushes. On pull-only providers (Google Workspace), the sync interval **is** your freshness — set it accordingly.

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- A connected identity provider (see the setup guide for your IdP)

---

## Step 1: Configure Provisioning Settings

Go to **Integrations** > your identity provider card > **Connect** (or **Configure** > **Edit** on an existing connection). Besides credentials, three switches and one number control the whole workflow:

| Setting | Default | Purpose |
|---------|---------|---------|
| **Just-In-Time (JIT) user provisioning** | On | Directory users get Whiteout accounts on first SSO login and during group sync. |
| **Auto-sync group memberships** | Off | Enables the background group sync. All lifecycle behavior below requires this. |
| **Auto-import new IDP groups** | Off | Any IdP group that has no mapping yet becomes a Whiteout group (name + members) on each sync, with no admin click. Leave off if you import selectively. |
| **Directory sync interval (hours)** | 24 | Cadence of the background scheduler. With SCIM enabled this becomes a weekly verifier instead. |

> The scheduler only touches integrations with JIT provisioning or group sync enabled. If nothing seems to sync, check these switches first.

---

## Step 2: Get Groups In — Three Paths

### Zero-Click (Auto-Import On)

Create the group in the IdP, populate it, done. On the next sync, the Whiteout group exists with the same name, members provisioned and attached, sync fully enabled. The Audit Log records *"Auto-imported IdP group 'X' as a new group"* (actor `system`).

### One-Click Import

1. Go to the **Groups** page
2. Click **Import from SSO**
3. Pick an IdP group
4. Click **Create Whiteout AI Group**

This creates the group and mapping and pulls members immediately. The same dialog manages existing imports (remap / unassign).

### Attach to an Existing Group

For a Whiteout group you created by hand:

1. Open the group
2. Go to the **SSO Sync** tab
3. Link one or more IdP groups

Members flow in from every linked group. Hand-created groups keep their own name — only the mapping's display name tracks IdP renames.

---

## What Stays in Sync Automatically

On every sync cycle (scheduled, or **Sync Users Now** on a group's **SSO Sync** tab):

| Change in the IdP | Effect in Whiteout AI |
|-------------------|-----------------------|
| User added to a mapped group | Added to the Whiteout group (JIT-provisioned first if needed) |
| User removed from a mapped group | Removed from the Whiteout group — **only if they came from the IdP**; manually added members are never auto-removed |
| Group renamed | IdP-created Whiteout group renames itself; hand-created mapped groups keep their name |
| Group deleted | Mapping flagged **"Missing in IDP"** (import dialog + SSO Sync tab), sync pauses, members stay put. Unassign the mapping to release the group, or delete the group. The flag clears automatically if the group reappears. |
| New group created | Auto-imported (if the toggle is on); otherwise appears in the Import-from-SSO picker |

Every one of these lands in the **Audit Log** with actor `system`, with exact old → new values in the detail drawer.

---

## SCIM Provisioning

On providers with SCIM push support (see the capability matrix), the IdP pushes user and group changes to Whiteout AI in real time instead of waiting for the scheduled pull:

- **With SCIM enabled**: Changes arrive as they happen. The scheduled pull is demoted to a weekly read-only verifier that catches missed pushes.
- **Without SCIM (pull-only)**: Changes land on the directory sync interval, or on demand via **Sync Users Now**.

For per-provider SCIM credential walkthroughs (base URL, bearer token, provisioning features), see the SCIM section of your provider's setup guide.

---

## Users Outside the IdP

Contractors and external users don't need to be in the directory:

1. Go to **Groups** > **Users** tab
2. Use **Invite Single** or **Bulk Invite (CSV)** — invitees register through the invite link
3. Add them to groups from a group's **Members** tab (two-pane add/remove)

IdP-synced groups lock manual membership edits. Put manual users in manually-managed groups, or link an IdP group to a hand-created group where both populations coexist.

---

## Safety Rules

- **Roles are local.** Whiteout AI roles (admin / user / read-only) are managed in-app and never overwritten by the IdP. Only group *membership* is IdP-managed.
- **Manual members are protected.** Auto-remove never touches a user who was added by hand — only IdP-originated members are pruned.
- **IdP-synced groups are locked.** Rename, delete, and membership edits are disabled in Whiteout AI for groups the IdP owns. To take a group back, unassign its mapping (Import-from-SSO dialog or SSO Sync tab); members stay, and the lock lifts.
- **Full directory sync vs. selective onboarding.** The per-provider Configure workspace also offers directory review with *selective* user onboarding (strictly additive). The full "sync entire directory" option is the destructive variant — it also deprovisions local IdP users absent from the directory.

---

## Troubleshooting

### Nothing Syncs

- Check the Configure dialog: are the JIT provisioning and group sync switches on?
- Is the sync interval sane?
- Is the provider listed with group sync support in the capability matrix?

### Group Changes Lag

- **Pull-only provider (Google Workspace)**: Changes land on the sync interval, or use **Sync Users Now**
- **SCIM provider**: Check the SCIM token and endpoint — the weekly verifier logs missed pushes

### "Missing in IDP" Warning

- The source group was deleted (or the API can no longer see it)
- Sync is paused for that mapping; unassign it to release the Whiteout group
- The flag clears automatically if the group reappears

### Member Counts Look Wrong

- Per-mapping last-sync time, member count, and last error are on the group's **SSO Sync** tab
- Org-wide sync history is in the IdP's Configure workspace sync logs

### Who Did What?

- Check the **Audit Log** page — filter Category = IdP or Actor = `system`
- Scheduler actions are first-class audit events
