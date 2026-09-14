# NinjaOne Setup Guide

This guide walks you through connecting NinjaOne to Whiteout AI and rolling Whiteout out to your managed Windows and macOS fleet with no end-user interaction.

## Overview

NinjaOne is an **RMM**, not an MDM, and that difference shapes the whole setup. There is no configuration-profile engine to upload a profile into. Instead, deployment is:

- **one PowerShell script**, which you add to NinjaOne once and attach to a policy, plus
- **per-device custom fields**, which is how each device receives its own enrollment credential.

One script serves the entire fleet, so this is less setup work than the profile-based providers — but the steps are different, and doing them out of order is the most common reason a rollout stalls.

The integration gives Whiteout AI the ability to:

- Sync your managed device inventory (hostname, serial, OS, last contact, assigned user)
- Read installed-software inventory across the tenant to surface **unsanctioned AI tools** already on your endpoints
- Deploy and silently sign in Whiteout Desktop Guard
- Force-install the Whiteout browser extension in Chrome, Edge and Firefox, including coverage in private windows
- Report per-device rollout status back into NinjaOne, so you can track progress from your own console

### Two things to know before you start

**Whiteout cannot start a script run in NinjaOne.** NinjaOne's API rejects script execution for machine-to-machine credentials — it requires a signed-in operator's session. NinjaOne's own scheduler runs the script. There is no "Deploy now" button in Whiteout for NinjaOne, by design; don't wait for one.

**Rollout takes two script runs.** The first run reports the hardware identifier Whiteout needs, and the second run performs the actual install. In between, Whiteout issues that device its credential. The script is safe to run on a schedule and does nothing once a device is finished, so in practice you attach it to a policy once and the fleet converges on its own.

## Prerequisites

- **NinjaOne** account with administrator access
- **Whiteout AI Admin** privileges
- Endpoints with the NinjaOne agent installed
- Your NinjaOne console URL — the region is part of your credential (see Step 1)
- **An identity provider already connected and synced in Whiteout** (Okta, Entra ID, Google Workspace, JumpCloud…). This is a hard requirement, not a convenience: each device's credential is issued *for a specific person*, so Whiteout has to know who your people are before it can issue anything. Connect your IdP and run a user sync first.

> **How devices get matched to people.** NinjaOne has no user directory, so Whiteout matches each device using the last signed-in account NinjaOne reports. It handles the common shapes automatically:
>
> | What NinjaOne reports | Example | Matched? |
> |---|---|---|
> | A full address | `AzureAD\alex@company.com` | Yes, directly |
> | A display name | `AzureAD\AlexFlowers` | Yes, if it resolves to exactly one person |
> | An AD login | `CORP\aflowers` | Yes, if it resolves to exactly one person |
> | A Mac short name | `alex` | Yes, if it resolves to exactly one person |
>
> Matching checks both the address and any alternate addresses synced from your identity provider, so `alex@company.com` and `aflowers@company.onmicrosoft.com` resolve to the same person.
>
> **When a login could belong to more than one person, Whiteout refuses to choose.** Issuing one person's credential to another person's device is worse than leaving the device unmapped, so those devices are skipped and reported. Set the `whiteoutUserEmail` custom field (Step 2) on them and re-sync. The Provision step names every device that needs it, so there is nothing to audit up front.

> **Platform support:** **Windows and macOS.** They are two separate NinjaOne scripts sharing one integration, one set of custom fields, and one provisioning step — add whichever platforms you manage. Two macOS caveats before you start:
>
> - The macOS release channel currently publishes **Apple silicon** builds only. On an Intel Mac the script applies all configuration and deliberately skips the app install, reporting `configured-no-app` rather than leaving a broken app behind.
> - **Don't target Macs already enrolled in Jamf or Intune** for the same browser settings. Those tools own the same preference files and will overwrite this on their next check-in.

---

## Setup Process

### Step 1: Create an API client in NinjaOne

1. In NinjaOne, go to **Administration** > **Apps** > **API**
2. Open the **Client App IDs** tab and click **Add**
3. Set **Application Platform** to **API Services (machine-to-machine)**
4. Under **Scopes**, select:

| Scope | Purpose |
|-------|---------|
| **Monitoring** | Read device inventory, installed software, and custom fields |
| **Management** | Write each device's enrollment credential to its custom field |

5. Leave **Control** **unchecked** — that scope grants remote access, and Whiteout AI never uses it
6. Save, then copy the **Client ID** and **Client Secret**

> The client secret is shown once. Copy it before closing the dialog.

Also note your **instance URL** — the address of your NinjaOne console, for example `https://app.ninjarmm.com` or `https://eu.ninjarmm.com`. The region matters: a client app only works on the instance that issued it.

### Step 2: Create the custom fields

In NinjaOne, go to **Administration** > **Devices** > **Custom Fields** and create these four fields. All are type **Text**, and all need **Script** permission set to **read/write**.

| Field name | Written by | Purpose |
|------------|-----------|---------|
| `whiteoutHardwareUuid` | The script | The device's hardware identifier. Whiteout binds the enrollment credential to it, so this must exist before a credential can be issued. |
| `whiteoutEnrollmentToken` | Whiteout AI | That device's enrollment credential. |
| `whiteoutDeviceStatus` | The script | Last rollout result (`awaiting-token`, `configured`, or `error: …`). Gives you a fleet-wide progress view inside NinjaOne. |
| `whiteoutUserEmail` | You (optional) | Override for devices where the last signed-in Windows account doesn't match the person's directory email. |

> If a field is missing, the **Provision** step in Whiteout fails with an error naming that exact field. That's the expected symptom, not a bug.

### Step 3: Connect NinjaOne in Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Mobile Device Management (MDM)**
3. Click **Connect MDM** and choose **NinjaOne**
4. Enter:

| Field | Description |
|-------|-------------|
| **NinjaOne Instance URL** | Your console URL from Step 1 |
| **Client ID** | From Step 1 |
| **Client Secret** | From Step 1 |

5. Click **Connect**. Whiteout validates the credentials with a live test before saving, so a failure here means the credentials or scopes are wrong — not that the integration is broken.
6. Click the **Sync** icon on the integration row and confirm your device count is greater than zero

### Step 4: Add the deployment script to NinjaOne

1. On the NinjaOne integration row in Whiteout, click the **download** icon
2. Review the script options:

| Option | Default | What it does |
|--------|---------|--------------|
| **Install Desktop Guard** | On | Downloads Desktop Guard from Whiteout's signed release feed and verifies it before running. No version is pinned, so the script keeps deploying current builds. Turn this off if you deploy Desktop Guard through NinjaOne's own software deployment instead. |
| **Gate Edge InPrivate** | On | Blocks Edge InPrivate until the Whiteout extension is allowed to run in it. Requires Edge 139 or later. Costs users nothing. |
| **Disable Chrome Incognito** | **Off** | Chrome provides no way to force an extension on in Incognito, so the only way to cover it is to turn Incognito off. This is visible to your users — opt in deliberately. |

3. Choose the **Platform** — Windows or macOS. If you manage both, work through this section twice; they are separate NinjaOne scripts.
4. Click **Download deploy script**, and also **Download rollback script**
5. In NinjaOne, go to **Administration** > **Library** > **Automation** > **Add** > **New Script**
6. Paste the deploy script and configure it for the platform you chose:

| Setting | Windows | macOS |
|---------|---------|-------|
| **Language** | PowerShell | ShellScript |
| **Architecture / OS** | 64-bit | Mac |
| **Run As** | **System** | **System** |
| **Name** | `Whiteout AI — Deploy (Windows)` | `Whiteout AI — Deploy (macOS)` |

7. Repeat for the rollback script, named `Whiteout AI — Remove (…)`
8. Attach each deploy script to the matching policy under **Scheduled Scripts**, on an hourly or daily schedule

> **Add the rollback script even if you never plan to use it.** It removes everything the deploy script configured, which is what makes a limited pilot a reversible change rather than a commitment.

### Step 5: First run — the device reports its hardware identifier

Run the script once. **Run Now** on a single device is the fastest way to check. Expected output on Windows:

```
[Whiteout] MachineGuid = 8f14e45f-ceea-467a-9f4e-0d0a6a3f37b1
[Whiteout] no enrollment token yet — reported MachineGuid and stopping here.
```

and on macOS:

```
[Whiteout] IOPlatformUUID = f290f11f-1a2b-4c3d-9e8f-0a1b2c3d4e5f
[Whiteout] no enrollment token yet — reported hardware UUID and stopping here.
```

`whiteoutHardwareUuid` is now populated on that device and `whiteoutDeviceStatus` reads `awaiting-token`. Nothing has been installed yet — that is correct at this stage.

### Step 6: Provision from Whiteout AI

1. Sync the integration again, so Whiteout picks up the reported identifiers
2. Open the NinjaOne deployment dialog and click **Provision devices**

Use **Dry run** first if you want to see the plan without making any changes.

Provisioning issues each eligible device its own credential and writes it into that device's `whiteoutEnrollmentToken` field. It is safe to re-run: devices that are already provisioned are skipped rather than issued a second credential. It also runs automatically on the integration's sync schedule.

The dialog reports why any device was skipped:

| Reason | What to do |
|--------|-----------|
| `awaiting_hardware_uuid` | The script hasn't run on that device yet, or the sync hasn't picked it up. Run the script, then sync. |
| `no_user_mapping` | The device's last signed-in account doesn't match a Whiteout user. Set `whiteoutUserEmail` on that device and re-sync. |
| `hardware_uuid_collision` | Two devices report the same hardware identifier — usually a cloned disk image deployed without running Sysprep. Fix the imaging process; provisioning either device would let one redeem the other's credential. |

### Step 7: Second run — the device enrolls

Run the script again. Expected output:

```
[Whiteout] enrollment token present
[Whiteout] wrote managed config
[Whiteout] Chrome policy applied
[Whiteout] Edge policy applied
[Whiteout] Firefox policy applied (force-install + private browsing)
[Whiteout] installer verified
[Whiteout] done — device configured
```

Desktop Guard signs in silently as the mapped user, and the browser extension and IDE plugins sign in through it. The user sees no prompts.

> **Windows:** Desktop Guard installs per-user while NinjaOne scripts run as the System account, so the script stages the verified installer and schedules it to run in the user's own session — immediately if someone is signed in, otherwise at their next sign-in.
>
> **macOS:** the app is machine-wide in `/Applications`, so the script installs it directly, then launches it once in the signed-in user's session so it can register itself to start at login.
>
> Either way, a device with nobody logged in shows as configured before the app appears. That's expected.

---

## Verification

1. **Connection**: the integration row shows a successful sync with a device count
2. **NinjaOne status**: `whiteoutDeviceStatus` reads `configured` on your test device
3. **Desktop Guard**: the app is running and signed in as the correct user, with no sign-in prompt shown
4. **Chrome and Edge**: the Whiteout extension is installed and signed in
5. **Firefox**: `about:policies` shows the extension as **Active**, and it is enabled in private windows
6. **Shadow AI**: unsanctioned AI applications already installed on your endpoints appear in Whiteout

---

## Troubleshooting

### Connection test fails immediately

- Confirm the instance URL matches your region. A client app is only valid on the instance that created it.
- Confirm the client app's platform is **API Services (machine-to-machine)**. Other platform types cannot authenticate this way.
- Confirm both **Monitoring** and **Management** scopes are enabled. A client app created without Monitoring still authenticates and then fails on every read.

### Devices sync, but columns are empty

Open the NinjaOne integration and run the built-in **diagnostics** check. It returns what NinjaOne reported alongside how Whiteout interpreted it, which identifies a field mismatch in one step instead of leaving you guessing.

### Provisioning fails naming a custom field

That field doesn't exist in NinjaOne yet, or it isn't script-writable. Re-check Step 2 — the field name must match exactly.

### Script runs but reports `awaiting-token` forever

The device is reporting its identifier but never receiving a credential. Check the **Provision** results for that device — it is almost always `no_user_mapping`, which you resolve by setting `whiteoutUserEmail`.

### Desktop Guard doesn't appear after a successful run

The install runs in the user's session, not the System account's. If nobody has signed in since the script ran, it is still pending. Sign in and allow a few minutes.

### macOS: status reads `configured-no-app`

That Mac is an Intel machine, and the macOS release channel currently publishes Apple silicon builds only. All configuration was applied; only the app install was skipped. Deploy Desktop Guard to Intel Macs by another route, or ask your Whiteout contact about an Intel build.

### macOS: configuration applied but Desktop Guard doesn't pick it up

macOS caches managed preferences. The script flushes that cache after writing, but an app that was already running may need a restart — quit and reopen Desktop Guard.

### The extension installs but isn't covered in private windows

Chrome cannot force an extension on in Incognito. Either enable **Disable Chrome Incognito** in the script options, or accept that Chrome private windows are uncovered. Edge and Firefox are covered by the defaults.

---

## Security Considerations

- **Least privilege**: grant only **Monitoring** and **Management**. Never grant **Control** — Whiteout AI does not use remote access.
- **Secret handling**: store the client secret in Whiteout only. It is encrypted at rest, and Whiteout never writes it to an endpoint.
- **Credential scope**: each device's enrollment credential is bound to that specific device. A credential copied off one machine cannot be used on another.
- **Custom field visibility**: enrollment credentials live in NinjaOne custom fields, readable by your NinjaOne administrators. That is the same trust boundary as a configuration profile in any other management tool, and it is why the credentials are device-bound.
- **Verified installs**: the script verifies Desktop Guard's installer against Whiteout's signed release manifest before executing it.
- **Existing policy is preserved**: the script merges its browser policy with whatever is already configured, so extensions you manage yourself are not removed.
- **Audit trail**: connecting an integration, exporting a script, and provisioning devices are each recorded in Whiteout's admin audit log.
