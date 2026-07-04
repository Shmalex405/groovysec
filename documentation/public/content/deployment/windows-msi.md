# Windows MSI Enterprise Deployment

Whiteout AI's Windows applications ship in **two interchangeable installer formats**: a standard `.exe` (NSIS) and an `.msi` (Windows Installer), for IT teams whose deployment tooling — Group Policy, Intune, or other software distribution — requires MSI packages.

## Overview

| Artifact | Format | Install scope | Auto-update |
|----------|--------|---------------|-------------|
| `*-Setup-*.exe` | NSIS | Per-user (`%LocalAppData%`) | Yes — built-in updater |
| `*-x64.msi` | MSI | Per-user, same location | Yes — identical |

**The two formats are functionally identical.** The MSI installs to the *same* per-user location as the EXE, so an MSI-installed app rides the same auto-update feed and self-updates in place with no elevation. When Groovy Security publishes a new version, every device picks it up automatically — MSI- or EXE-installed alike. The choice of installer is purely about how IT prefers to distribute the *first* install; everything after that is handled by auto-update.

MSI packages are available for each Windows application:

| Application | MSI package |
|-------------|-------------|
| Whiteout AI (main desktop app) | `WhiteoutAI-<version>-x64.msi` |
| Whiteout AI bundled installer | `WhiteoutAI-Bundled-<version>-x64.msi` |
| Whiteout AI Desktop Guard | `Whiteout.DesktopGuard-<version>-x64.msi` |

## Prerequisites

Before you begin, ensure you have:
- The MSI package(s) for the applications you're deploying
- A distribution mechanism: **Microsoft Intune**, **Group Policy**, or any tool that can run `msiexec` in the user's context
- Outbound access from endpoints to `https://updates.groovysec.com` (the auto-update feed)

---

## Why Per-User Installation

The installers deliberately install per-user (under `%LocalAppData%`) rather than per-machine (`Program Files`):

- The built-in updaters replace the app binary in a user-writable location **with no elevation**
- A per-machine install would block self-update for standard users and require a privileged updater service
- Per-user is what keeps "push once, reaches everyone" true — the vendor-published update reaches every device automatically

### How auto-update works

- **Whiteout AI (main app)**: the updater polls the Groovy Security update feed at `updates.groovysec.com`, downloads the new installer, and applies it to the per-user install location
- **Desktop Guard**: its built-in updater polls the same feed and replaces its own running binary in place with the signed update

The MSI itself is not part of the update feed — it doesn't need to be. It lands the app where the updater already expects it, and the updater takes over from there.

---

## Silent Install and Uninstall

```powershell
# Install (per-user, no UI, no elevation required)
msiexec /i "WhiteoutAI-<version>-x64.msi" /qn /norestart

# Uninstall
msiexec /x "WhiteoutAI-<version>-x64.msi" /qn

# Install with a verbose log (recommended for scripted rollouts)
msiexec /i "WhiteoutAI-<version>-x64.msi" /qn /l*v install.log
```

The NSIS `.exe` is equally scriptable if you prefer it: `Setup.exe /S`.

---

## Configuration via Installer Properties

The Whiteout AI MSIs require **no custom installer properties** — the standard `msiexec` options above are all you need. Device enrollment and sign-in configuration are not baked into the installer; they are delivered separately through your MDM as an enrollment payload, which Desktop Guard reads at launch (registry policy keys on Windows, with `%ProgramData%\WhiteoutAI` pre-created by the Desktop Guard MSI for enrollment data).

See [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md) for generating and delivering the enrollment payload.

---

## Distributing with Intune

1. In the [Intune admin center](https://intune.microsoft.com), go to **Apps** > **All apps** > **Add**
2. Upload the `.msi` directly, or wrap it with the Microsoft Win32 Content Prep Tool (`.intunewin`) and add it as a **Windows app (Win32)**
3. Because the install is per-user, configure the install to run in the **user context** (not system context)
4. Under **Assignments** > **Required**, assign to your target groups
5. Confirm the app appears on a few pilot devices before broad rollout

For connecting Intune to Whiteout AI itself (device sync, compliance, deployment from the Whiteout AI console), see the [Microsoft Intune MDM Setup Guide](./mdm-providers/microsoft-intune.md).

## Distributing with Group Policy

1. Place the `.msi` on a network share readable by target users
2. In the Group Policy Management Console, edit or create a GPO linked to the target OU
3. Because the install is per-user, configure it under **User Configuration** > **Policies** > **Software Settings** > **Software installation** (not Computer Configuration)
4. Add the MSI as an **Assigned** package
5. The install applies at the user's next sign-in

---

## Desktop Guard MSI Details

The Desktop Guard MSI mirrors the NSIS installer's per-user layout exactly:

- Installs to `%LocalAppData%\Programs\Whiteout Desktop Guard\Whiteout.DesktopGuard.exe`
- Creates per-user Start menu and desktop shortcuts
- Auto-starts at login via the `HKCU\...\Run` registry key
- Registers the `whiteout-desktop://` URL protocol under `HKCU\Software\Classes`
- Pre-creates `%ProgramData%\WhiteoutAI` for MDM enrollment data
- Force-closes a running instance before an upgrade
- Self-updates in place via its built-in updater — the same feed as the EXE

---

## Verification

After deploying to a pilot group:

1. **Install path**: confirm the app is installed under `%LocalAppData%\Programs\<product>` for the signed-in user
2. **Launch**: confirm the app starts — Desktop Guard should appear in the system tray
3. **Enrollment** (if you've deployed the zero-touch payload): right-click the Desktop Guard tray icon > **Status** and confirm it is signed in — see [Zero-Touch MDM Deployment](./deployment/zero-touch-mdm.md)
4. **Auto-update**: after the next release, confirm the app updates in place (version increments, no duplicate install, app relaunches on the new version)

---

## Troubleshooting

### Install succeeds but the app is missing for other users on the device

The install is per-user by design. Deploy in the user context (Intune) or under User Configuration (GPO) so each targeted user gets their own install.

### Install fails silently

Re-run with verbose logging and inspect the log:

```powershell
msiexec /i "WhiteoutAI-<version>-x64.msi" /qn /l*v install.log
```

### App installs but never updates

Confirm endpoints can reach `https://updates.groovysec.com` through your proxy or firewall. MSI-installed apps use the same update feed as EXE installs — no separate allowance is needed for MSI.

### Upgrade while the app is running

The Desktop Guard MSI force-closes a running instance before upgrading, so an in-use app does not block deployment.
