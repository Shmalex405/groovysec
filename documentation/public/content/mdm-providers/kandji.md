# Kandji MDM Setup Guide

This guide walks you through connecting Kandji to Whiteout AI so your
managed devices and the AI applications on them appear in Whiteout.

## Overview

The Kandji integration allows Whiteout AI to:
- Query device inventory and compliance status for macOS, iOS and iPadOS devices
- Detect AI applications installed across your Apple fleet
- Map each managed device to a person, so device activity is attributable

> **What this integration does today.** Whiteout reads your Kandji device
> inventory — device, platform, serial, Apple UDID, assigned user, compliance
> state — and detects AI applications installed on those devices. That is the
> whole of it.
>
> Whiteout does **not** push apps or profiles into Kandji, and does not mirror
> Kandji Blueprints. Deploying Desktop Guard and the browser extension is done from your
> Kandji console using its own app and profile deployment, exactly as you
> would deploy any other software. Per-device zero-touch enrollment profiles —
> the ones Whiteout generates for Intune and Jamf — are not generated for
> Kandji yet; enroll from Whiteout's **Enrollment** page instead.

## Prerequisites

Before you begin, ensure you have:
- **Kandji** subscription
- **Kandji Administrator** access
- **Whiteout AI Admin** privileges
- Devices enrolled in Kandji

---

## Setup

### Step 1: Create API credentials in Kandji

1. Log in to your Kandji web app
2. Navigate to **Settings** → **Access** → **API Token**
3. Click **Add Token** and name it `Whiteout AI Integration`
4. Under **Permissions**, enable read access to:

| Permission | Access |
|------------|--------|
| Device list | Read |
| Device details | Read |
| Application list | Read |

   Deployment permissions — Device actions, Blueprints, Custom apps — are
   **not** needed. Whiteout never writes to Kandji, so granting them widens
   the blast radius of the token for nothing.

5. Click **Create**
6. Copy the token immediately — Kandji displays it once
7. Note your API URL from the same screen, including the region


### Step 2: Connect in Whiteout AI

1. Open the Whiteout AI admin dashboard
2. Go to **Integrations** → **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **Kandji**
4. Enter:

| Field | Value |
|-------|-------|
| **Kandji API URL** | Your tenant API host **including region** — `https://<subdomain>.api.kandji.io`, or `https://<subdomain>.api.eu.kandji.io` for EU tenants |
| **API Token** | The token from Step 1 |

> **The region is part of the credential.** A token issued for a US tenant is
> not valid against the EU host and vice versa, so the full host is entered
> rather than derived from your subdomain.

5. Click **Connect**. The form validates with a live connection test before
   saving, so a credential problem is caught here rather than at the first sync.

---

## Post-setup: deploying the Whiteout clients

Whiteout does not push software into Kandji. You deploy from your Kandji
console, then enroll from Whiteout.

### 1. Deploy Desktop Guard

Add the Desktop Guard installer to Kandji as you would any other package,
using Kandji's Custom Apps or Auto Apps library, and assign it to the devices in scope.

### 2. Force-install the browser extension

Whiteout generates the browser force-install and private-browsing payloads as
standard Apple configuration profiles (`.mobileconfig`). Download them from
**Integrations → MDM → Generate Deployment Payload** on an Intune or Jamf
integration, then upload the macOS entries to Kandji as custom profiles.
They are plain Apple profiles and are not Intune- or Jamf-specific.

Without them Desktop Guard runs but the browser extension never installs,
which is a silent failure — the dashboard looks healthy.

### 3. Enroll users

Mint enrollment tokens from **Enrollment** in the Whiteout admin UI and deliver
them with your Desktop Guard deployment. Kandji-specific per-device token profiles are not generated yet.

---

## Verification

1. **Connection test** — click **Test Connection** when saving the integration.
   It probes the device listing itself, so a token that authenticates but
   cannot list devices fails here rather than looking healthy and syncing
   nothing.
2. **Device sync** — run a sync and confirm your devices appear under
   **Devices**, with the right platform and assigned user.
3. **AI app detection** — confirm detected AI applications appear against
   those devices.

---

## Troubleshooting

### "401 Unauthorized"

- Verify the token is correct and has not been revoked
- Check the token was copied completely, with no trailing whitespace
- Confirm the API URL matches the token's region — a US token against the EU
  host fails as a 401, which looks like a bad token

### Devices not appearing

- Confirm the devices are enrolled in Kandji
- Verify the token carries the Device list and Device details permissions
- Allow a few minutes for the first sync on a large fleet

### Devices appear but have no user

Whiteout maps a device to a person by email. If Kandji has no assigned user
for a device, or that address does not match anyone in your directory, the
device syncs unmapped. Check that your identity provider has been connected
and synced first.

---

## Security considerations

- **Credential storage** — Whiteout encrypts Kandji credentials at rest
- **Read-only** — the integration only reads. No deployment or write
  permissions are needed, so grant none
- **Dedicated credentials** — use a dedicated API account or token for
  Whiteout so its activity is separately auditable
- **Rotation** — establish a rotation schedule; these credentials do not
  expire on their own
