# Microsoft Intune Setup Guide

This guide walks you through connecting Microsoft Intune to Whiteout AI and deploying Whiteout's clients across your managed fleet with no end-user interaction.

## Overview

The Microsoft Intune integration allows Whiteout AI to:

- Sync device inventory and user-device assignments for enrolled Windows, macOS, iOS and Android devices
- Read Intune's detected-apps inventory to surface **unsanctioned AI tools** already installed on your endpoints
- Generate the configuration payload that silently signs Whiteout clients in on managed devices
- Push AI app and domain blocking policies into Intune as device configuration profiles

### How deployment works

Whiteout does not install itself into your tenant. Deployment is three artifacts that Intune treats separately, and mixing them up is the most common reason a rollout stalls:

1. **The app** — you upload the Whiteout Desktop Guard installer to Intune as an app and assign it, exactly like any other Win32 or macOS app.
2. **The configuration payload** — Whiteout generates this. It carries a per-device enrollment credential so each device signs in as the right person without a prompt.
3. **The browser extension policies** — separate configuration profiles that force-install the Whiteout extension in Chrome, Edge and Firefox.

All three are required. With only the app, Desktop Guard installs but every user gets a sign-in prompt. With only the payload, nothing is installed to configure. Skip the extension policies and Desktop Guard enrolls silently while the browsers stay uncovered.

## Prerequisites

Before you begin, ensure you have:

- **Microsoft Intune** subscription (standalone or as part of Microsoft 365 E3/E5)
- **Microsoft Entra ID** Global Administrator or Intune Administrator role
- **Whiteout AI Admin** privileges
- Devices **enrolled in Intune** — Entra-joined alone is not sufficient

---

## Setup Process

### Step 1: Register an application in Microsoft Entra ID

1. Log in to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** > **App registrations**
3. Click **New registration**
4. Enter application details:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI - Intune Integration` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Leave blank |

5. Click **Register**
6. On the overview page, copy the **Application (client) ID** and the **Directory (tenant) ID**

> **No redirect URI is needed.** Whiteout AI authenticates to Microsoft Graph as the application itself (OAuth client credentials), not on behalf of a signed-in user, so there is no browser redirect in the flow.

### Step 2: Create a client secret

1. In your registered app, navigate to **Certificates & secrets**
2. Click **New client secret**
3. Enter a description (e.g. `Whiteout AI Integration`)
4. Select an expiration period (recommended: 24 months)
5. Click **Add**
6. Copy the **Value** immediately — it will not be shown again

### Step 3: Configure API permissions

1. Navigate to **API permissions** in your registered app
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Application permissions** and add:

| Permission | Why it's needed |
|------------|-----------------|
| `DeviceManagementManagedDevices.Read.All` | Read device inventory and Intune's detected-apps list |
| `DeviceManagementConfiguration.ReadWrite.All` | Create and assign the device configuration profiles used for policy push |
| `Group.Read.All` | Resolve device groups for policy targeting |

4. Click **Grant admin consent for [Your Organization]**
5. Verify all permissions show a green checkmark under **Status**

> **Least privilege:** these three are all the integration uses. If you plan to run the automated per-device deployment tool in Step 6, it needs two additional permissions — add them only if you use it.

### Step 4: Connect Intune in Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **Microsoft Intune**
4. Enter the following:

| Field | Description |
|-------|-------------|
| **Display Name** | A friendly name, e.g. `Production Intune` |
| **Azure AD Tenant ID** | Directory (tenant) ID from Step 1 |
| **Client ID** | Application (client) ID from Step 1 |
| **Client Secret** | Client secret value from Step 2 |

5. Click **Connect**

Whiteout validates the credentials against Microsoft Graph before saving, so a failure here means the credentials or the consent grant are wrong — the integration is not created in a broken state.

6. Click the **Sync** icon on the integration row and confirm the device count is greater than zero

> Device sync resolves each Intune device's user to a Whiteout user by email address. Devices whose user cannot be matched are synced but skipped during payload generation — see [Troubleshooting](#devices-are-skipped-during-payload-generation).

---

## Deployment

### Step 5: Upload the Desktop Guard installer as an Intune app

This is separate from the Whiteout configuration payload, and it comes first.

1. Intune admin center > **Apps** > **All apps** > **Add**
2. Choose the app type: **Windows app (Win32)** for Windows, or **macOS app (DMG/PKG)** for macOS
3. Upload the Desktop Guard installer for that platform
4. Under **Assignments**, add the app as **Required** for the device group you'll use for the rollout
5. Confirm the install reaches a few pilot devices before continuing

### Step 6: Generate the configuration payload

1. In Whiteout AI, go to **Integrations** > **Mobile Device Management (MDM)**
2. On the Intune integration row, click the **download** icon
3. Review the device count in the dialog, then click **Generate & Download**

You receive a JSON file with each device's enrollment credential already filled in. It contains:

| Section | What it is |
|---------|-----------|
| `appConfigurationProfile` | The per-device Desktop Guard configuration, uploaded as an App Configuration Policy |
| `additionalProfiles` | The browser extension force-install and private-browsing profiles, one per browser and platform |

> If you have generated credentials for this integration before, the dialog warns that unredeemed ones already exist. Tick **Replace existing live tokens** to revoke them and issue fresh — use this when rotating before a re-rollout, not on a routine retry.

### Step 7: Upload the profiles to Intune

Each entry in the payload becomes its **own** configuration profile in Intune, all assigned to the same device group.

**The Desktop Guard configuration:**

1. Intune admin center > **Apps** > **App configuration policies** > **Add** > **Managed devices**
2. Target the Whiteout Desktop Guard app
3. Supply the configuration from `appConfigurationProfile`

**The browser extension profiles**, for each entry in `additionalProfiles`:

1. **Devices** > **Configuration** > **Create profile**
2. For macOS entries: **Templates** > **Custom**, uploading the supplied configuration profile
3. For Windows entries: **Templates** > **Custom**, using the supplied OMA-URI and value
4. For entries marked as declarative: upload under **Declarative device management** rather than as a custom profile

Two things to know before you skip this step:

- **Without the browser profiles, the extension does not install.** Desktop Guard will enroll silently and the browsers will have no Whiteout coverage at all.
- **Firefox on Windows requires Mozilla's ADMX templates** ingested into Intune first (**Devices** > **Configuration** > **Import ADMX**). Without them, the Firefox Windows entry cannot apply.

> **Automating this for a large fleet.** Intune assigns one configuration profile to one group, so a per-device credential means one profile and one device group per device. Doing that by hand is impractical beyond a pilot. Whiteout ships a fanout tool that creates them through Microsoft Graph, and it needs two permissions beyond the three in Step 3: `DeviceManagementApps.ReadWrite.All` and `Group.ReadWrite.All`. Ask your Whiteout contact for it — it is not required for a pilot of a few devices.

### Step 8: Push AI blocking policies (optional)

Once connected, Whiteout can author AI app and domain blocking policies and push them into Intune as device configuration profiles, so you don't re-author them per console. This uses the `DeviceManagementConfiguration.ReadWrite.All` permission from Step 3 and is configured from Whiteout's mobile policy screens.

---

## Verification

1. **Connection** — the integration row shows a successful sync with a device count
2. **Device inventory** — enrolled devices appear in Whiteout, with the correct assigned user
3. **Detected apps** — unsanctioned AI applications already installed on your endpoints appear in Whiteout
4. **Silent sign-in** — on a pilot device, Desktop Guard is running and signed in as the correct user, with no sign-in prompt shown
5. **Browser coverage** — Chrome and Edge show the Whiteout extension installed and signed in
6. **Firefox** — `about:policies` lists the extension as **Active**

---

## Troubleshooting

### "Unauthorized" or "Access Denied" when connecting

- Verify the Tenant ID, Client ID and Client Secret are correct
- Confirm **admin consent** has been granted — added-but-unconsented permissions fail exactly like missing ones
- Check whether the client secret has expired or been rotated without updating Whiteout

### Devices not appearing

- Confirm the devices are **enrolled in Intune**, not only Entra-joined
- Confirm `DeviceManagementManagedDevices.Read.All` is granted **with admin consent**
- Allow up to 15 minutes for the first sync on a large tenant

### Devices are skipped during payload generation

A device needs a resolvable Whiteout user before it can be issued a credential. This is almost always an email mismatch between Intune and your identity provider — for example a person who appears as `alex@company.com` in your directory but `aflowers@company.onmicrosoft.com` in Intune. Whiteout matches known alternate addresses synced from your identity provider, so the usual fix is to ensure the alias is present there.

### Desktop Guard installs but prompts users to sign in

The app reached the device but the configuration payload did not. Confirm the App Configuration Policy from Step 7 is assigned to the same group as the app, and that the device has checked in since.

### The extension didn't install in Edge

Edge has its own extension listing with its own identifier, distinct from the Chrome Web Store. The generated payload uses the correct one for each browser — but a payload generated before **September 2026** carries the older Edge entry and installs nothing in Edge. Re-generate the payload in Step 6.

### Policy push fails

Confirm `DeviceManagementConfiguration.ReadWrite.All` is granted with admin consent. Read-only configuration permission is enough to sync but not to create or assign profiles.

---

## Security Considerations

- **Least privilege** — grant only the three permissions in Step 3, and the two extra fanout permissions only if you use that tool
- **Dedicated app registration** — register a dedicated app for Whiteout AI rather than reusing an existing one, so its permissions and sign-in activity are separately auditable
- **Secret rotation** — set a reminder to rotate the client secret before it expires; an expired secret stops device sync silently until it's replaced
- **Credential scope** — each device's enrollment credential is bound to that specific device, so one copied off a machine cannot be used elsewhere
- **Payload handling** — the generated payload contains enrollment credentials for every device in it. Treat it as a secret, upload it, and don't leave copies in shared storage
- **Audit logging** — monitor Entra ID sign-in logs for the Whiteout service principal; connecting an integration and generating a payload are also recorded in Whiteout's own admin audit log
