# VMware Workspace ONE MDM Setup Guide

This guide walks you through connecting Workspace ONE to Whiteout AI so your
managed devices and the AI applications on them appear in Whiteout.

## Overview

The Workspace ONE integration allows Whiteout AI to:
- Query device inventory and compliance status across Windows, macOS, iOS, iPadOS and Android
- Detect AI applications installed across the fleet
- Map each managed device to a person, so device activity is attributable

> **What this integration does today.** Whiteout reads your Workspace ONE device
> inventory — device, platform, serial, device UDID, assigned user, compliance
> state — and detects AI applications installed on those devices. That is the
> whole of it.
>
> Whiteout does **not** push apps or profiles into Workspace ONE, and does not mirror
> organization groups or Smart Groups. Deploying Desktop Guard and the browser extension is done from your
> Workspace ONE console using its own app and profile deployment, exactly as you
> would deploy any other software. Whiteout does generate a zero-touch payload for
> Workspace ONE that you upload yourself: per-device enrollment profiles, the browser
> extension profiles and Codex protection. It hasn't been verified against a
> live Workspace ONE tenant yet, so try it on one device first.

## Prerequisites

Before you begin, ensure you have:
- **VMware Workspace ONE UEM** console access
- **Administrator** role with API access
- **Whiteout AI Admin** privileges
- Devices enrolled in Workspace ONE UEM

---

## Setup

### Step 1: Create API credentials in Workspace ONE

1. Log in to the Workspace ONE UEM console
2. Navigate to **Groups & Settings** → **All Settings** → **System** →
   **Advanced** → **API** → **REST API**
3. Ensure the REST API is **Enabled**
4. Copy the **API Key** — this is the `aw-tenant-code` value
5. Create or identify an admin account for the integration and give it
   **Device Details: Read** and **Device Application List: Read**


### Step 2: Connect in Whiteout AI

1. Open the Whiteout AI admin dashboard
2. Go to **Integrations** → **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **Workspace ONE**
4. Enter:

| Field | Value |
|-------|-------|
| **Workspace ONE API URL** | Your tenant host, e.g. `https://as123.awmdm.com`. The `as###` prefix is tenant-specific |
| **API Admin Username** | An admin account with API access |
| **API Admin Password** | That account's password |
| **API Tenant Code** | The `aw-tenant-code` key from **Groups & Settings → All Settings → System → Advanced → API** |

> **The tenant code is required.** Without it the API returns `401` with a
> message about credentials — which reads as a wrong password and sends you
> looking in the wrong place. If the connection test fails, check the tenant
> code before the password.

5. Click **Connect**. The form validates with a live connection test before
   saving, so a credential problem is caught here rather than at the first sync.

---

## Post-setup: deploying the Whiteout clients

Whiteout does not push software into Workspace ONE. You deploy from your Workspace ONE
console, then enroll from Whiteout.

### 1. Deploy Desktop Guard

Add the Desktop Guard installer to Workspace ONE as you would any other package,
using Workspace ONE's Apps & Books deployment, and assign it to the devices in scope.
Download it from **Coverage → Enrollment → Install** in the admin app.

### 2. Force-install the browser extension

Download this integration's payload: under **Integrations → Mobile Device
Management (MDM)**, click the download icon on the Workspace ONE row, then
**Generate & Download**. Each block in the file is a standard Apple profile.
Upload the browser force-install and private-browsing blocks in
**Devices → Profiles & Resources → Profiles → Add → Apple macOS → Custom Settings** and assign them to the Smart Group that covers these Macs.

Without them Desktop Guard runs but the browser extension never installs,
which is a silent failure — the dashboard looks healthy.

### 3. Enroll users

The same download carries one enrollment profile per device, with that
device's token filled in. Assign each enrollment profile to its own device. This is for Macs only: on Windows, Workspace ONE reports its own device ID instead of the Windows machine ID, so enroll Windows devices with tokens from the **Enrollment** page (see the anchor note below).

You can also mint tokens from **Enrollment** in the admin app and deliver them
with your Desktop Guard deployment.

### 4. Codex protection

Codex runs Whiteout's checks for every user, with no prompt, only when they
come from a source an administrator controls: a configuration profile on
macOS, and Codex's machine requirements file on Windows.

**Macs.** The configuration payload you download for this integration (the
download icon under **Integrations → Mobile Device Management (MDM)**) has a
section labelled **Codex protection**: a plist for the `com.openai.codex`
domain with one key, `requirements_toml_base64`. Add it in **Devices →
Profiles & Resources → Profiles → Add → Apple macOS → Custom Settings** and
assign it to your Macs with Desktop Guard. It is the same on every Mac. If
you'd rather work from a ready-made `.mobileconfig`, ask your Whiteout contact
for `whiteout-codex-hooks.mobileconfig`, which carries the same setting.

**Windows.** The payload covers Macs only. Run `Install-WhiteoutCodexHooks.ps1`
as SYSTEM on your PCs (ask your Whiteout contact for the script), or have an
administrator choose **Turn On Codex Protection…** in Desktop Guard on each PC.

If you already deploy a `com.openai.codex` profile of your own, add Whiteout's
block to it instead of adding a second profile. Details are in
[Protecting Codex](./deployment/codex.md).

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

Check **both** the admin credentials and the `aw-tenant-code`. A missing or
wrong tenant code fails identically to a wrong password.

### Windows devices enrol but hardware-bound tokens are rejected

Expected, and worth understanding before a Windows rollout. Workspace ONE
reports a UEM-generated device UDID, which is **not** the `MachineGuid` that
Desktop Guard reports as its hardware anchor on Windows. A token bound to the
Workspace ONE identifier therefore cannot be redeemed by the client.

Apple platforms are unaffected — there the UDID is the same value macOS and
iOS report natively.

For Windows fleets managed by Workspace ONE, use unbound enrollment tokens
from the **Enrollment** page rather than hardware-bound ones.

### Devices appear but have no user

Whiteout maps a device to a person by email. If Workspace ONE has no
enrollment user email for a device, or that address does not match anyone in
your directory, the device syncs unmapped. Connect and sync your identity
provider first.

---

## Security considerations

- **Credential storage** — Whiteout encrypts Workspace ONE credentials at rest
- **Read-only** — the integration only reads. No deployment or write
  permissions are needed, so grant none
- **Dedicated credentials** — use a dedicated API account or token for
  Whiteout so its activity is separately auditable
- **Rotation** — establish a rotation schedule; these credentials do not
  expire on their own
