# Jamf Setup Guide

This guide walks you through connecting Jamf Pro to Whiteout AI and deploying Whiteout's clients to your managed Macs with no end-user interaction.

## Overview

The Jamf integration allows Whiteout AI to:

- Sync device inventory for managed macOS computers and iOS/iPadOS devices
- Read Jamf's application inventory to surface **unsanctioned AI tools** already installed on your Macs
- Generate the configuration profile that silently signs Whiteout clients in on managed devices

### What Whiteout does and does not do in your Jamf tenant

**The Jamf integration is read-only.** Whiteout reads inventory and *generates* the profile content you deploy; it does not upload packages, create policies, or write configuration profiles into Jamf on your behalf. You stay in control of what lands in your tenant.

That makes deployment three artifacts, which Jamf treats separately:

1. **The package** — you upload the Whiteout Desktop Guard installer to Jamf and scope a policy to install it, exactly as you would any other package.
2. **The configuration profile** — Whiteout generates this. It carries a per-device enrollment credential so each Mac signs in as the right person without a prompt. You upload it as an Application & Custom Settings profile.
3. **The browser extension profiles** — additional profiles that force-install the Whiteout extension in Chrome, Edge and Firefox.

All three are required. With only the package, Desktop Guard installs but every user gets a sign-in prompt. Skip the extension profiles and Desktop Guard enrolls silently while the browsers stay uncovered.

## Prerequisites

- **Jamf Pro** 10.49 or later (for API Roles and Clients)
- Jamf Pro administrator access
- **Whiteout AI Admin** privileges
- Macs enrolled in Jamf Pro

---

## Setup Process

### Step 1: Create an API Role in Jamf Pro

1. Log in to Jamf Pro
2. Navigate to **Settings** > **System** > **API Roles and Clients**
3. On the **API Roles** tab, create a new role named `Whiteout AI Integration`
4. Grant these privileges:

| Privilege | Why it's needed |
|-----------|-----------------|
| Read Computers | Query macOS inventory |
| Read Computer Inventory Collection | Read hardware and user details for those computers |
| Read Computer App Information | Detect installed applications on Macs |
| Read Mobile Devices | Query iOS/iPadOS inventory |
| Read Mobile Device Inventory Collection | Read details for those devices |
| Read Mobile Device App Information | Detect installed apps on mobile devices |

5. Save the role

> **Read-only by design.** The integration never writes to Jamf, so it needs no create or update privileges. If you later use the automated per-device deployment tool in Step 6, that tool needs write privileges — add them then, scoped to a separate role if you prefer.

### Step 2: Create an API Client

1. On the **API Clients** tab, click **New**
2. Configure the client:

| Field | Value |
|-------|-------|
| **Display Name** | `Whiteout AI` |
| **API Roles** | Select the role from Step 1 |
| **Access Token Lifetime** | Leave the default |

3. **Enable** the client, then save
4. Click **Generate Client Secret** and copy the **Client ID** and **Client Secret**

> The client secret is shown once. Copy it before closing the dialog.

### Step 3: Note your Jamf Pro URL

Your Jamf Pro URL is the address you use to reach the console, for example `https://yourcompany.jamfcloud.com`. Enter it without a trailing slash and without any path.

### Step 4: Connect Jamf in Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **Jamf Pro**
4. Enter the following:

| Field | Description |
|-------|-------------|
| **Display Name** | A friendly name, e.g. `Production Jamf` |
| **Jamf Pro URL** | Your server URL from Step 3 |
| **API Client ID** | From Step 2 |
| **API Client Secret** | From Step 2 |

5. Click **Connect**

Whiteout validates the credentials against Jamf before saving, so a failure here means the credentials or role privileges are wrong — the integration is not created in a broken state.

6. Click the **Sync** icon on the integration row and confirm the device count is greater than zero

> Device sync resolves each device's user to a Whiteout user by email address, using the user assigned in Jamf inventory. Devices with no assigned user, or whose email doesn't match, are synced but skipped during profile generation — see [Troubleshooting](#devices-are-skipped-during-profile-generation).

---

## Deployment

### Step 5: Deploy the Desktop Guard package

1. Jamf Pro > **Computers** > **Policies** > **New**
2. Under **Packages**, add the Whiteout Desktop Guard installer package
3. Set **Scope** to the group of Macs you're rolling out to
4. Set **Trigger** to Recurring Check-in, or Self Service for a pilot
5. Save, and confirm the install reaches a few pilot Macs before continuing

### Step 6: Generate the configuration profile

1. In Whiteout AI, go to **Integrations** > **Mobile Device Management (MDM)**
2. On the Jamf integration row, click the **download** icon
3. Review the device count in the dialog, then click **Generate & Download**

You receive a property list (`.plist`) with each device's enrollment credential already filled in.

> **This file covers Desktop Guard only.** Unlike the Intune payload, the Jamf download does not currently include the browser extension profiles — you create those by hand in Step 8. Skipping Step 8 leaves Desktop Guard enrolled and the browsers with no Whiteout coverage.

> If you have generated credentials for this integration before, the dialog warns that unredeemed ones already exist. Tick **Replace existing live tokens** to revoke them and issue fresh — use this when rotating before a re-rollout, not on a routine retry.

### Step 7: Upload the profiles to Jamf

**The Desktop Guard configuration:**

1. Jamf Pro > **Computers** > **Configuration Profiles** > **New**
2. Add an **Application & Custom Settings** payload
3. Use the Whiteout Desktop Guard preference domain and the supplied plist content
4. Set **Scope** to the same group of Macs as the package in Step 5

### Step 8: Create the browser extension profiles

These force-install the Whiteout extension. Create one Application & Custom Settings profile per browser, each scoped to the same group of Macs, using these preference domains and keys. Ask your Whiteout contact for the current extension identifiers rather than copying them from an older runbook — the Chrome and Edge stores issue separate identifiers, and an Edge profile carrying the Chrome one installs nothing.

| Browser | Preference domain | Key |
|---------|-------------------|-----|
| Chrome | `com.google.Chrome` | `ExtensionInstallForcelist` — one entry, `<extension id>;<update URL>` |
| Edge | `com.microsoft.Edge` | `ExtensionInstallForcelist` as above, plus `ExtensionAllowedTypes` set to `extension` |
| Firefox | `org.mozilla.firefox` | `EnterprisePoliciesEnabled` = true, and `ExtensionSettings` with the extension set to `force_installed` |

Optional, for private-window coverage:

| Browser | Setting | Effect |
|---------|---------|--------|
| Edge | `MandatoryExtensionsForInPrivateNavigation` | Blocks InPrivate until the extension is allowed to run in it. Requires Edge 139 or later. |
| Firefox | `private_browsing` on the extension's `ExtensionSettings` entry | Genuinely enables the extension in private windows. Requires Firefox 136 or ESR 128.8 or later. |
| Chrome | `IncognitoModeAvailability` = 1 | Chrome cannot force an extension on in Incognito, so the only way to cover it is to turn Incognito off. Visible to your users — decide deliberately. |

> Firefox on macOS reads policy through managed preferences, so the domain above is the correct delivery path. The `policies.json` file used on Windows and Linux is ignored on macOS.

Without these profiles, Desktop Guard will enroll silently and the browsers will have no Whiteout coverage.

> **Automating this for a large fleet.** A per-device credential means one configuration profile scoped to one Smart Group per device, which is impractical by hand beyond a pilot. Whiteout ships a fanout tool that creates the profiles and their Smart Groups through the Jamf API. It needs write privileges the integration itself does not: create and update Smart Computer Groups, and create and update macOS Configuration Profiles. Ask your Whiteout contact for it — it is not required for a pilot of a few Macs.

---

## Verification

1. **Connection** — the integration row shows a successful sync with a device count
2. **Device inventory** — managed Macs and mobile devices appear in Whiteout, with the correct assigned user
3. **Detected apps** — unsanctioned AI applications already installed on your Macs appear in Whiteout
4. **Silent sign-in** — on a pilot Mac, Desktop Guard is running and signed in as the correct user, with no sign-in prompt shown
5. **Browser coverage** — Chrome and Edge show the Whiteout extension installed and signed in
6. **Firefox** — `about:policies` lists the extension as **Active**

---

## Troubleshooting

### "401 Unauthorized" when connecting

- Verify the Client ID and Client Secret, and that the API Client is **enabled**
- Confirm the API Role has the read privileges from Step 1
- Confirm the Jamf Pro URL has no trailing slash and no path

### Devices not appearing

- Confirm the API Role includes **Read Computers** and **Read Mobile Devices**
- Confirm the devices are enrolled and reporting inventory to Jamf
- Allow up to 15 minutes for the first sync on a large fleet

### Devices are skipped during profile generation

A device needs a resolvable Whiteout user before it can be issued a credential. Check that the device has a user assigned in Jamf inventory and that the email matches the one in your identity provider. Whiteout also matches known alternate addresses synced from your identity provider, so adding the alias there usually resolves it.

### Desktop Guard installs but prompts users to sign in

The package reached the Mac but the configuration profile did not. Confirm the profile from Step 7 is scoped to the same group as the package, and that the Mac has checked in since.

### Applications aren't being detected on mobile devices

Per-device application detail is only collected for smaller mobile fleets, to stay within Jamf's API rate limits. macOS application inventory is always collected.

---

## Security Considerations

- **Read-only integration** — grant only the read privileges in Step 1; Whiteout never writes to your Jamf tenant
- **Separate role for the fanout tool** — if you use it, consider a second API Role holding its write privileges, so the always-connected integration keeps the smaller set
- **Secret rotation** — rotate the API Client secret periodically; an expired secret stops device sync silently until it's replaced
- **Credential scope** — each device's enrollment credential is bound to that specific device, so one copied off a Mac cannot be used elsewhere
- **Payload handling** — the generated profile contains enrollment credentials for every device in it. Treat it as a secret, upload it, and don't leave copies in shared storage
- **Audit logging** — connecting an integration and generating a payload are recorded in Whiteout's admin audit log
