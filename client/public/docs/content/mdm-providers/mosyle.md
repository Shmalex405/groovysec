# Mosyle MDM Setup Guide

This guide walks you through connecting Mosyle to Whiteout AI so your
managed devices and the AI applications on them appear in Whiteout.

## Overview

The Mosyle integration allows Whiteout AI to:
- Query device inventory and compliance status for macOS, iOS and iPadOS devices
- Detect AI applications installed across your Apple fleet
- Map each managed device to a person, so device activity is attributable

> **What this integration does today.** Whiteout reads your Mosyle device
> inventory — device, platform, serial, Apple UDID, assigned user, compliance
> state — and detects AI applications installed on those devices. That is the
> whole of it.
>
> Whiteout does **not** push apps or profiles into Mosyle, and does not mirror
> Mosyle device groups or tags. Deploying Desktop Guard and the browser extension is done from your
> Mosyle console using its own app and profile deployment, exactly as you
> would deploy any other software. Per-device zero-touch enrollment profiles —
> the ones Whiteout generates for Intune and Jamf — are not generated for
> Mosyle yet; enroll from Whiteout's **Enrollment** page instead.

## Prerequisites

Before you begin, ensure you have:
- **Mosyle Business** or **Mosyle Fuse** subscription
- **Mosyle Administrator** access
- **Whiteout AI Admin** privileges
- Devices enrolled in Mosyle

---

## Setup

### Step 1: Create API credentials in Mosyle

1. Log in to Mosyle at [manager.mosyle.com](https://manager.mosyle.com)
2. Navigate to **Organization** → **Settings** → **API Integration**
3. Enable **API Access** if it is not already on
4. Generate an **Access Token** and copy it
5. Identify the Mosyle account whose email and password you will use. It needs
   API access; a dedicated service account is preferable to a person's login,
   so the integration keeps working when someone leaves


### Step 2: Connect in Whiteout AI

1. Open the Whiteout AI admin dashboard
2. Go to **Integrations** → **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **Mosyle**
4. Enter:

| Field | Value |
|-------|-------|
| **Access Token** | The integration token from **Organization → API** |
| **Account Email** | A Mosyle account with API access |
| **Account Password** | That account's password |

> **Mosyle needs all three.** Unlike most MDM APIs, the token identifies the
> *integration* and the email/password identify the *account* — every request
> carries both. A token-only setup authenticates and then fails on the first
> call, which looks like an empty fleet rather than a credential problem.

5. Click **Connect**. The form validates with a live connection test before
   saving, so a credential problem is caught here rather than at the first sync.

---

## Post-setup: deploying the Whiteout clients

Whiteout does not push software into Mosyle. You deploy from your Mosyle
console, then enroll from Whiteout.

### 1. Deploy Desktop Guard

Add the Desktop Guard installer to Mosyle as you would any other package,
using Mosyle's application management, and assign it to the devices in scope.

### 2. Force-install the browser extension

Whiteout generates the browser force-install and private-browsing payloads as
standard Apple configuration profiles (`.mobileconfig`). Download them from
**Integrations → MDM → Generate Deployment Payload** on an Intune or Jamf
integration, then upload the macOS entries to Mosyle as custom profiles.
They are plain Apple profiles and are not Intune- or Jamf-specific.

Without them Desktop Guard runs but the browser extension never installs,
which is a silent failure — the dashboard looks healthy.

### 3. Enroll users

Mint enrollment tokens from **Enrollment** in the Whiteout admin UI and deliver
them with your Desktop Guard deployment. Mosyle-specific per-device token profiles are not generated yet.

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

### The connection test fails with valid-looking credentials

Mosyle needs the access token **and** the account email and password. Entering
only the token is the most common half-configured state; it authenticates the
integration and then fails per-request.

### Devices not appearing

- Confirm the devices are enrolled in Mosyle
- Confirm the account has API access enabled
- Mosyle can return a success-shaped response carrying an error status for a
  permissions problem. Whiteout surfaces that as a failed sync rather than an
  empty one, so check the sync error text on the integration row.

### Devices appear but have no user

Whiteout maps a device to a person by email. If Mosyle has no user for a
device, or that address does not match anyone in your directory, the device
syncs unmapped. Connect and sync your identity provider first.

---

## Security considerations

- **Credential storage** — Whiteout encrypts Mosyle credentials at rest
- **Read-only** — the integration only reads. No deployment or write
  permissions are needed, so grant none
- **Dedicated credentials** — use a dedicated API account or token for
  Whiteout so its activity is separately auditable
- **Rotation** — establish a rotation schedule; these credentials do not
  expire on their own
