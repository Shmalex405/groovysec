# Zero-Touch MDM Deployment

This guide walks you through deploying Whiteout AI across your managed fleet with **zero end-user interaction**, using device-attested enrollment tokens delivered through Microsoft Intune or Jamf Pro. It assumes your MDM provider is already connected to Whiteout AI — see the [Microsoft Intune](./mdm-providers/microsoft-intune.md) and [Jamf](./mdm-providers/jamf.md) setup guides for that step.

Zero-touch deployment currently supports **Microsoft Intune** and **Jamf Pro**, targeting desktop devices (Windows and macOS).

## Overview

With zero-touch deployment, a user simply opens their laptop. Within seconds:

1. Whiteout AI Desktop Guard launches at login
2. Desktop Guard reads the MDM-pushed enrollment token and signs in automatically
3. Chrome, Edge, or Firefox starts — the Whiteout AI browser extension requests credentials from Desktop Guard's local broker and receives delegated tokens
4. VS Code or JetBrains starts — the IDE plugin does the same

No SSO redirect. No approval prompt. No login screen. No clicks. What the user sees is the Whiteout AI icon in their menu bar or system tray, already signed in as `their.email@company.com` — with all three surfaces (Desktop Guard, browser extension, IDE plugins) enforcing policy.

## Prerequisites

Before you begin, ensure you have:
- **MDM integration connected** — [Microsoft Intune](./mdm-providers/microsoft-intune.md) or [Jamf](./mdm-providers/jamf.md) configured in Whiteout AI
- **SSO / identity provider connected** — see the SSO provider guides (e.g. [Okta](./sso-providers/okta.md), [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md))
- **Whiteout AI Admin** privileges
- Devices enrolled in your MDM
- The Desktop Guard installer packages for your platforms (macOS `.pkg`, Windows `.exe` or `.msi` — see [Windows MSI Enterprise Deployment](./deployment/windows-msi.md))

---

## How Zero-Touch Enrollment Works

### Device-attested enrollment tokens

Whiteout AI mints a **per-device, single-use enrollment token** for every managed device. Each token is bound to the device's hardware identifier:

| Platform | Hardware anchor |
|----------|-----------------|
| macOS | `IOPlatformUUID` |
| Windows | `MachineGuid` |

The hardware anchor survives app reinstalls. It does not survive a disk wipe and re-image — which is fine, because a re-imaged device re-enrolls into your MDM and a fresh token is minted.

Your MDM delivers the token to each device as managed configuration (an `enrollment.json` file on macOS, registry policy keys on Windows). At first launch, Desktop Guard reads the token, calls the `/auth/device-enroll` endpoint, and signs in as the user mapped to that device in your MDM — no user interaction required.

Tokens expire after **30 days** by default. If your MDM doesn't deliver the payload within that window, mint fresh tokens before rolling out.

### Delegated sign-in for browsers and IDEs

Once Desktop Guard is enrolled, it acts as a **local credential broker** on `127.0.0.1:18444`. The browser extension and IDE plugins request credentials from the broker, and on MDM-managed devices Desktop Guard approves these sibling clients silently — handing down tokens bound to the same user it is signed in as. Every silent approval emits an audit event (see [Monitoring silent approvals](#monitoring-silent-approvals)).

### The deployment payload is multi-profile

The payload you generate from Whiteout AI contains more than the Desktop Guard enrollment configuration:

- **App configuration profile** — the per-device Desktop Guard enrollment payload (an App Configuration Policy in Intune, a Configuration Profile in Jamf)
- **Six browser force-install profiles** — Chrome, Edge, and Firefox, each for macOS and Windows

Each browser profile must be delivered as its own configuration profile in your MDM. If you skip them, Desktop Guard enrolls silently but the browser extensions do **not** auto-install on enrolled devices. The fanout scripts (below) handle all of them for you.

> **Firefox on Windows** requires Mozilla's Firefox ADMX templates to be ingested into Intune first (**Devices** > **Configuration** > **Import ADMX** > upload `firefox.admx` + `firefox.adml`). If you can't use ADMX, see [Firefox force-install fallback](#firefox-force-install-fallback).

---

## Pre-Deployment Checklist

Run all of these before a mass deployment. If any fails, fix it first.

1. **SSO configured and tested** — in Whiteout AI, confirm your identity provider connection passes **Test Connection**
2. **IdP user sync run at least once** — click **Sync Users** and confirm the user count is greater than zero. After the initial sync, the scheduler re-syncs automatically
3. **MDM integration connected** — confirm Intune or Jamf Pro shows as connected under **Settings** > **MDM Providers**
4. **MDM device sync run at least once** — run a sync and confirm the device count is greater than zero. The sync maps each device to a user from your IdP; devices without a mapped user are skipped during payload generation
5. **Spot-check five representative devices** with the dry-run endpoint:

```bash
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://api.whiteout.groovysec.com/mdm/integrations/$INTEGRATION_ID/dry-run/$MDM_DEVICE_ID
```

All seven checks in the response should show `passed: true`. Any failure means fix it before mass deployment — see [Troubleshooting](#troubleshooting) for what each failed check means.

---

## Generating the Deployment Payload

**Recommended: use the Whiteout AI admin UI.**

1. Navigate to **Settings** > **MDM Providers**
2. On the connected integration, click the **Download** icon to open the **Generate Deployment Payload** dialog
3. Review the device count and token type summary
4. Click **Generate & Download**

The format is selected automatically from the provider:
- **Intune** — `whiteout-zero-touch-intune-<integration_name>-<timestamp>.json` with per-device tokens inlined
- **Jamf Pro** — `whiteout-zero-touch-jamf-<integration_name>-<timestamp>.plist` (Configuration Profile XML) with per-device `<dict>` entries containing inlined tokens

If you've previously generated tokens for this integration, the dialog warns about live unredeemed tokens. Tick **Replace existing live tokens** to revoke them and mint fresh — useful when rotating tokens before a re-rollout.

**Scripted alternative.** The same payload is available from the API, suitable for automation:

```bash
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -o intune-payload.json \
  "https://api.whiteout.groovysec.com/mdm/integrations/$INTEGRATION_ID/mint-and-payload?format=intune" \
  -d '{}'
```

Use `format=jamf` for the Jamf plist. Re-running without `replace_existing` returns **409** if any device already has live tokens — a guard against accidentally burning fresh tokens during retries. To deliberately rotate:

```bash
curl ... -d '{"replace_existing": true}'
```

---

## Deploying with Microsoft Intune

### Step 1: Upload the Desktop Guard installer as an Intune app

The installer is separate from the configuration payload — Intune treats them as two different artifacts.

1. In the [Intune admin center](https://intune.microsoft.com), go to **Apps** > **All apps** > **Add**
2. App type: **Windows app (Win32)** for Windows, or the macOS app type for macOS
3. Upload `Whiteout.DesktopGuard-Setup-<version>.exe` (Windows) or `Whiteout-Desktop-Guard.pkg` (macOS)
4. Under **Assignments** > **Required**, assign to the device group you'll use for the rollout (e.g. "Whiteout Pilot Group")
5. Wait for the install to push to a few pilot devices and confirm Desktop Guard appears in their tray

### Step 2: Generate the Intune payload

Follow [Generating the Deployment Payload](#generating-the-deployment-payload) above, with the Intune integration selected (or `format=intune` via the API).

### Step 3: Fan out the per-device profiles

The payload contains one entry per device, but Intune doesn't natively iterate over a per-device array — each device needs its own Configuration Profile plus a single-device Entra ID group. Groovy Security provides a fanout script, `intune-fanout.py`, that does this in one command. It authenticates with an Entra ID app registration supplied via environment variables:

```bash
export AZURE_TENANT_ID=<your-tenant-id>
export AZURE_CLIENT_ID=<your-client-id>
export AZURE_CLIENT_SECRET=<your-client-secret>

# Dry-run first — validates payload and authentication, makes no changes
./intune-fanout.py intune-payload.json --dry-run

# Real run
./intune-fanout.py intune-payload.json --out fanout-results.json
```

The script also walks the browser force-install profiles and creates one Configuration Profile per entry, all targeting the same device group as the Desktop Guard profile. It is idempotent (safe to re-run) and resilient (a per-device failure doesn't abort the rest).

> **Windows devices**: Desktop Guard enrollment configuration on Windows is delivered as registry policy keys, which Intune applies via **Custom OMA-URI** configuration profiles rather than App Configuration Policies. Create these profiles manually from the payload's per-device entries.

### Step 4: Verify

Pick a pilot device. Within roughly 10 minutes of the next Intune check-in cycle, run through the [Verification](#verification) steps below.

---

## Deploying with Jamf Pro

### Step 1: Upload the Desktop Guard installer as a Jamf policy

1. In Jamf Pro, go to **Computers** > **Policies** > **New**
2. Under **Packages**, upload `Whiteout-Desktop-Guard.pkg`
3. **Scope**: the Smart Group of Macs you'll target
4. **Trigger**: Recurring Check-in (or Self Service for a pilot)
5. Save and let it deploy to a few pilot Macs

### Step 2: Generate the Jamf payload

Follow [Generating the Deployment Payload](#generating-the-deployment-payload) above, with the Jamf Pro integration selected (or `format=jamf` via the API).

### Step 3: Fan out the per-device profiles

Jamf Pro doesn't natively iterate over a per-device plist array — each device needs its own Configuration Profile plus a Smart Computer Group keyed on its UDID. Groovy Security provides a fanout script, `jamf-fanout.py`, that does this:

```bash
export JAMF_BASE_URL=https://yourcompany.jamfcloud.com
export JAMF_CLIENT_ID=<your-api-client-id>
export JAMF_CLIENT_SECRET=<your-api-client-secret>

# Dry-run first
./jamf-fanout.py jamf-payload.plist --dry-run

# Real run
./jamf-fanout.py jamf-payload.plist --out fanout-results.json
```

The script authenticates with a Jamf Pro API client (see the [Jamf setup guide](./mdm-providers/jamf.md) for creating API Roles and Clients). Like the Intune fanout, it is idempotent and resilient to per-device failures.

### Step 4: Verify

Same as Intune — a pilot Mac should be silently signed in within minutes of its next check-in. Run through the [Verification](#verification) steps below.

---

## Firefox Force-Install Fallback

The deployment payload emits Firefox force-install profiles automatically alongside Chrome and Edge — both macOS (an `org.mozilla.firefox` plist payload) and Windows (Firefox ADMX via Custom OMA-URI). **For most deployments, you don't need this section.** It is the fallback for two cases: environments where you can't deliver the auto-generated `org.mozilla.firefox` payload via MDM and need to script-deploy a plist directly, and Windows fleets that haven't ingested Mozilla's ADMX templates and prefer registry policy.

### macOS delivery paths

Firefox on macOS reads enterprise policy from managed preferences for the `org.mozilla.firefox` domain, via either:

1. **A Configuration Profile** (`.mobileconfig`) with `PayloadType = "org.mozilla.firefox"`, delivered by your MDM — this is what Intune and Jamf push for you
2. **A system-wide preferences file** at `/Library/Preferences/org.mozilla.firefox.plist`, dropped by a deployment script

> Dropping a `policies.json` file (the Linux convention) is silently ignored by Firefox on macOS — use one of the two paths above.

Whichever channel you use, the keys to deliver are:

```xml
<dict>
    <key>EnterprisePoliciesEnabled</key>
    <true/>
    <key>ExtensionSettings</key>
    <dict>
        <key>whiteout-ai@groovysec.com</key>
        <dict>
            <key>installation_mode</key>
            <string>force_installed</string>
            <key>install_url</key>
            <string>https://addons.mozilla.org/firefox/downloads/latest/whiteout-ai/latest.xpi</string>
        </dict>
    </dict>
</dict>
```

- **Intune**: create a Settings Catalog > macOS > Firefox template profile (or upload a custom `.mobileconfig` with the keys above). Scope to the same device group as the Desktop Guard profile.
- **Jamf**: **Configuration Profiles** > **New** > **Application & Custom Settings** > **External Applications** > Domain `org.mozilla.firefox` > upload a property list with the keys above.

### Windows registry fallback

Push HKLM registry keys via Intune Custom OMA-URI or Group Policy:

```
HKLM\Software\Policies\Mozilla\Firefox
  - DisableAppUpdate (DWORD) = 0
HKLM\Software\Policies\Mozilla\Firefox\ExtensionSettings\whiteout-ai@groovysec.com
  - installation_mode (REG_SZ) = "force_installed"
  - install_url (REG_SZ) = "https://addons.mozilla.org/firefox/downloads/latest/whiteout-ai/latest.xpi"
```

### Auto-login behavior on Firefox

Once the extension is force-installed, it does **not** need a per-device managed-storage push for auto-login. Firefox's extension calls the local Desktop Guard broker on `127.0.0.1:18444` and receives a token bound to the same user — the same broker delegation pattern as Chrome and Edge. No user consent prompt fires for a policy-force-installed, AMO-signed extension.

---

## Verification

On a pilot device, confirm:

1. **Desktop Guard**: appears in the menu bar / system tray and shows as signed in (right-click > **Status**)
2. **Browser extension**: open Chrome — the Whiteout AI extension popup should show the user's email
3. **IDE plugin**: open VS Code — the **Whiteout: Show Status** command should show the user's email
4. **Admin UI**: in Whiteout AI, open the **Devices** page, filter by the pilot user, and confirm three active sessions (Desktop Guard, browser extension, IDE extension) all sharing the same hardware UUID

---

## Troubleshooting

### Dry-run failures

| Check | What it means | Fix |
|-------|---------------|-----|
| `mdm_device_exists: false` | The device hasn't synced from your MDM yet | Run an MDM sync, or wait for the next scheduled sync |
| `hardware_uuid_present: false` | The MDM didn't report a hardware identifier for the device | Re-enroll the device in MDM; for older Windows devices, install the Microsoft Intune Management Extension |
| `hardware_uuid_unique: false` | Two devices share a hardware identifier (VDI clone, missed sysprep) | Re-image with sysprep generalize, or remove the duplicate device record. Minting refuses to proceed for colliding devices — it cannot safely determine which user's token belongs on which machine |
| `user_mapping_resolved: false` ("User exists but…") | The user exists but the device record isn't linked to them | Run an MDM resync to re-link the device |
| `user_mapping_resolved: false` ("No User found…") | The device's email doesn't match any user in your organization | Check email alias coverage between your IdP and MDM. Common case: Intune reports `jdoe@company.onmicrosoft.com` while your IdP has `jane@company.com`. Alias sources such as Entra `proxyAddresses` and Okta `secondEmail` are synced automatically — run a fresh IdP sync |
| `user_in_org: false` | The user belongs to a different Whiteout AI organization | Correct the user's organization assignment in the admin UI |
| `token_mintable: false` | An earlier check failed | Fix the earlier check first |
| `broker_auto_approves_siblings: false` | The device doesn't see itself as MDM-managed | Verify the payload was actually delivered (Intune admin center: **Devices** > **Configuration** > profile status; Jamf: the device's inventory tab) |

### User shows as signed in but not enforcing policy

Check the Whiteout AI **Devices** page for an active session on the device. If none exists, Desktop Guard never completed enrollment — verify the device received its `enrollment.json` (macOS) or registry policy keys (Windows).

### Browser extension still shows a login prompt

Check that the extension has permission to reach `http://127.0.0.1:18444/*`. Current extension builds include this by default; older builds need an extension update.

### All three surfaces signed in but no enforcement events in the dashboard

Verify a SOC destination is configured (**Settings** > **SOC Destinations** — see the [SOC/SIEM destination guides](./soc-destinations/webhook.md)). Silent-approval audit events confirm the broker path is working; if those are present but enforcement events are not, check the destination configuration.

---

## Monitoring Silent Approvals

Every silent client approval on a managed device emits one audit event with the action `mdm_bypass_auto_approve`. Recommended alerts for your SOC:

| Metric | Alert when | Why |
|--------|-----------|-----|
| Count of `mdm_bypass_auto_approve` per hour | Drops to zero unexpectedly | The broker is broken, Desktop Guard isn't running on managed devices, or managed configuration isn't being delivered |
| Distinct users with `mdm_bypass_auto_approve` | Diverges from the count of active managed devices with a mapped user | Some users' devices are silently failing to enroll |
| `mdm_bypass_auto_approve` with an unknown client type | Anything greater than zero | A new client type appeared — verify it's a legitimate Whiteout AI binary |

Forward these to Splunk, Datadog, or your SIEM via a [SOC destination](./soc-destinations/splunk-hec.md).

---

## Security Considerations

- **Single-use tokens**: enrollment tokens can be redeemed exactly once, and are bound to a specific device's hardware identifier
- **Token TTL**: tokens expire after 30 days by default. To mint non-expiring (still single-use) tokens for slow rollouts, pass `expires_in_days: null` in the mint request
- **Token rotation**: use **Replace existing live tokens** (or `replace_existing: true`) to revoke outstanding unredeemed tokens and mint fresh ones before a re-rollout
- **Credential encryption**: MDM provider credentials (Intune client secret, Jamf API credentials) are encrypted at rest
- **Sync freshness**: IdP sync defaults to every 24 hours and MDM sync to every 60 minutes; adjust per integration in the admin UI to balance freshness against API quota
