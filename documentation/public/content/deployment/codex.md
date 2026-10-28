# Protecting Codex

Whiteout checks OpenAI Codex prompts and tool calls with the same defender hooks it uses for Claude Code. Desktop Guard, or the Whiteout VS Code extension, installs those hooks for each user. Before Codex runs them, there is one more step. This page explains that step, the three ways to take it, and how to see which devices are protected.

The step covers Codex wherever it runs: the Codex CLI, the Codex extension in VS Code and JetBrains IDEs, and the Codex desktop app.

## Why Codex needs one step

Since October 2026, Codex runs hooks without asking only when they come from a source an administrator controls:

- **macOS**: a configuration profile that forces Codex's `com.openai.codex` preference, or Codex's machine requirements file, `/etc/codex/requirements.toml`.
- **Windows**: Codex's machine requirements file, `%ProgramData%\OpenAI\Codex\requirements.toml`. If you set `HKLM\SOFTWARE\Policies\OpenAI\Codex\RequirementsPath`, Codex uses that file instead.

Codex runs hooks from anywhere else only after the user trusts them, in a prompt it shows when it starts. If none of the steps below is taken, Codex runs and none of its prompts are checked.

## Three ways to protect a device

| Method | Who it covers | What to know |
|---|---|---|
| **Your MDM** delivers Codex's machine configuration | Every user of the device | No prompt for anyone, and users can't turn the checks off from Codex. Use this on managed fleets. |
| **An administrator** chooses **Turn On Codex Protection…** in Desktop Guard | Every user of the device | Needs administrator approval once. No prompt for users after that. |
| **The user** chooses **Trust all and continue** when Codex starts | That user only | Lasts until Whiteout's hooks change. |

In all three cases, Codex runs each user's own Whiteout hooks, which Desktop Guard or the VS Code extension installs. For a user of the device who has neither, the hooks do nothing.

### Your MDM

Your MDM writes the same setting to every device, with no prompt for users. See [Deploying with your MDM](#deploying-with-your-mdm).

### Turn On Codex Protection in Desktop Guard

On a device where Codex is installed and not yet protected for every user, Desktop Guard shows **Turn On Codex Protection…** in its menu (the menu bar icon on a Mac, the tray icon on Windows). On Windows, the item reads **Codex: needs approval — Turn On Codex Protection…** while the user hasn't trusted Whiteout's hooks.

Choosing it asks for an administrator password on a Mac, or Windows administrator approval on a PC. Desktop Guard then adds Whiteout's block to Codex's machine requirements file: `/etc/codex/requirements.toml` on a Mac, `%ProgramData%\OpenAI\Codex\requirements.toml` on Windows. Nothing else in the file changes. Restart any Codex session that was already open.

- On a Mac, the item changes to **Update Codex Protection…** when the file carries an older version of Whiteout's block.
- If the file already defines Codex hooks in a shape Whiteout's block can't be added to (for example inline `hooks = …`), Desktop Guard leaves the file unchanged and says so. Add the block by hand, as described in [If you already manage Codex](#if-you-already-manage-codex).
- On a Mac that doesn't get Desktop Guard's settings from an MDM, Desktop Guard also suggests this to the user, at most once a week, while Codex is unprotected.
- On a device with only the Whiteout VS Code extension, run **Whiteout: Turn On Codex Protection** from the Command Palette instead.

### The user trusts Whiteout's hooks in Codex

When no machine source carries Whiteout's hooks, Desktop Guard (or the VS Code extension) registers them for each user in `~/.codex/hooks.json`. Codex runs those only once the user trusts them. When Codex starts, it lists the hooks it doesn't trust yet and offers **Review**, **Trust all and continue** and **Continue without trusting**.

**Trust all and continue** turns on Whiteout's checks for that user until the hooks change. **Continue without trusting** leaves Codex running with nothing checked, and the device shows **Needs approval** on the Coverage page.

---

## Deploying with your MDM

Codex protection is one setting, the same on every device. It carries no per-device credentials, so scope it to every device that has Desktop Guard or the VS Code extension.

### Microsoft Intune, from the admin app

If Intune is connected, Whiteout can create the two Intune items for you. Nothing changes in your tenant until you confirm.

1. In the admin app, open the **Coverage** page. The **Codex** card appears there once at least one device reports Codex
2. On the Codex card, click **Deploy with Intune**
3. Review the two items the dialog names:
   - **macOS**: a custom configuration profile, "Whiteout AI — Codex protection (macOS)", delivered on the device channel. It sets the `com.openai.codex` preference that carries Whiteout's hook block
   - **Windows**: a platform script, "Whiteout AI — Codex protection (Windows)", run once as SYSTEM in 64-bit PowerShell. It adds Whiteout's block to Codex's machine requirements file and keeps anything else in it
4. Under **Assign to**, choose **All devices** or **Specific device groups**. Whiteout lists your Entra security groups when the app registration has `Group.Read.All`; otherwise, paste group object IDs
5. Click **Deploy to Intune**

The Codex card then shows when the deployment was made and by whom. The deployment is also recorded in Whiteout's admin audit log. When Whiteout's block changes, the button reads **Update Intune deployment**, and updating changes the same two items in place. If you deleted one of them in Intune, it's created again.

If some Macs already have a Codex profile from your MDM that doesn't include Whiteout's block, the macOS profile can't be pushed. The dialog then offers **Push the Windows script only**. See [If you already manage Codex](#if-you-already-manage-codex) for the Macs.

### Microsoft Intune, by hand

The Intune payload you download from **Integrations → Mobile Device Management (MDM)** has a `codexProtection` section with both items:

| Field | What to do with it |
|---|---|
| `codexProtection.macos.mobileconfig` | Save it as `whiteout-codex-hooks.mobileconfig`. Upload it as a macOS **Custom** configuration profile, with the deployment channel set to **Device channel** |
| `codexProtection.windows.scriptContent` | Save it as `Install-WhiteoutCodexHooks.ps1`. Add it as a Windows platform script, with **Run this script using the logged on credentials** set to **No** and **Run script in 64 bit PowerShell Host** set to **Yes** |

Both fields are JSON strings. To save them as files, you can use `jq`, for example:

```bash
jq -r '.codexProtection.macos.mobileconfig' intune-payload.json > whiteout-codex-hooks.mobileconfig
jq -r '.codexProtection.windows.scriptContent' intune-payload.json > Install-WhiteoutCodexHooks.ps1
```

To deploy the script as the install command of a Win32 app instead, use this detection rule: `%ProgramData%\OpenAI\Codex\requirements.toml` contains `whiteout-defender (managed by Whiteout Desktop Guard)`.

The script writes to the file in `RequirementsPath` if you set one, and to `%ProgramData%\OpenAI\Codex\requirements.toml` otherwise. It keeps any other content in the file and replaces an older Whiteout block. It exits with code 1 and changes nothing if the file defines Codex hooks in a shape Whiteout's block can't be added to (for example inline `hooks = …`). If that happens, add the block by hand: ask your Whiteout contact for `requirements.windows.toml`.

### Jamf Pro, Kandji, Mosyle and Workspace ONE

The configuration payload you download for the integration, from **Integrations → Mobile Device Management (MDM)**, has a section labelled **Codex protection**. It is a plist for the preference domain `com.openai.codex` with one key, `requirements_toml_base64`.

- Upload it as its own profile, in the same way as the other sections of that file. The upload steps for your MDM are at the top of the file.
- Scope it to all your Macs with Desktop Guard. Unlike the enrollment profiles, it is the same on every Mac, so one profile covers the fleet.
- If your MDM needs a ready-made `.mobileconfig`, ask your Whiteout contact for `whiteout-codex-hooks.mobileconfig`. It carries the same setting.

This payload covers Macs only. For Windows devices in Workspace ONE, run `Install-WhiteoutCodexHooks.ps1` as SYSTEM (ask your Whiteout contact for the script), or use **Turn On Codex Protection…** on each PC.

### NinjaOne

The NinjaOne deploy scripts include a Codex protection step, on by default:

- **Windows**: the script runs `Install-WhiteoutCodexHooks.ps1`, which adds Whiteout's block to Codex's machine requirements file and keeps anything else in it.
- **macOS**: the script writes the `com.openai.codex` preference to `/Library/Managed Preferences` as root. Codex treats a value there as forced, the same as one from a configuration profile. The script never writes over a value that isn't Whiteout's.

Scripts downloaded before this step was added don't include it. Download the deploy script again and replace it in NinjaOne.

If the step fails, `whiteoutDeviceStatus` shows an `error:` that names `codex-protection`. On a Mac that already has Codex requirements from someone else, the error names `codex-foreign-profile` instead, and nothing is written. See [If you already manage Codex](#if-you-already-manage-codex).

The rollback script doesn't undo this step.

---

## If you already manage Codex

**macOS.** If your MDM already forces `com.openai.codex` → `requirements_toml_base64` with your own TOML, don't deploy a second profile for the same key. macOS won't merge two profiles for one preference key, so only one of them takes effect. Instead, add Whiteout's block to your TOML, base64-encode the result, and redeploy your profile. Include the whole block, from the `# >>>` marker line to the `# <<<` marker line. It is self-contained:

```toml
# >>> whiteout-defender (managed by Whiteout Desktop Guard) >>>
# Whiteout AI defender hooks for OpenAI Codex, for every user of this device.
# Each command runs that user's own launcher (codex-hook.sh, or codex-hook.cmd
# on Windows, in ~/.claude/hooks/whiteout-defender) and does nothing for a
# user who doesn't have one. Added with administrator approval or by MDM.

[[hooks.UserPromptSubmit]]
matcher = ".*"

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = '[ -f "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" ] || exit 0; exec /bin/sh "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" "$HOME/.claude/hooks/whiteout-defender/prompt-defender.py" --agent codex'
timeout = 30

[[hooks.PreToolUse]]
matcher = ".*"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '[ -f "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" ] || exit 0; exec /bin/sh "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" "$HOME/.claude/hooks/whiteout-defender/pre-tool-defender.py" --agent codex'
timeout = 30

[[hooks.PostToolUse]]
matcher = ".*"

[[hooks.PostToolUse.hooks]]
type = "command"
command = '[ -f "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" ] || exit 0; exec /bin/sh "$HOME/.claude/hooks/whiteout-defender/codex-hook.sh" "$HOME/.claude/hooks/whiteout-defender/post-tool-defender.py" --agent codex'
timeout = 30

# <<< whiteout-defender (managed by Whiteout Desktop Guard) <<<
```

The Codex card on the Coverage page warns when a device has a Codex configuration from your MDM without Whiteout's checks. While any Mac reports one, the Intune push won't send the macOS profile. The NinjaOne macOS step never writes over your value.

**Windows.** `Install-WhiteoutCodexHooks.ps1` adds Whiteout's block to your existing requirements file and keeps everything else. You only need to add the block by hand if the script refuses your file, as described in [Microsoft Intune, by hand](#microsoft-intune-by-hand).

## Don't combine MDM and Turn On Codex Protection on the same Mac

If someone chose **Turn On Codex Protection…** on a Mac before your MDM profile arrived, the Mac has Whiteout's block in two places: the profile and `/etc/codex/requirements.toml`. Codex then runs both copies, so every Codex prompt is checked twice and logged twice. The Coverage page's Codex card and the device page warn that the checks are "in two places".

To fix it, remove Whiteout's block (from the `# >>>` marker line to the `# <<<` marker line) from `/etc/codex/requirements.toml` on that Mac, or leave that Mac out of the profile's scope. Once a profile carries the checks, Desktop Guard no longer offers the menu option.

This doesn't happen on Windows. The menu option and the MDM script write the same file, and the script reports "Already current".

---

## Checking a device

**Mac.** For a device protected by MDM, run this in Terminal. It prints Whiteout's block:

```bash
defaults read "/Library/Managed Preferences/com.openai.codex" requirements_toml_base64 | base64 -D
```

For a Mac protected from the Desktop Guard menu, the block is in `/etc/codex/requirements.toml`.

**PC.** In Command Prompt, run this. The output contains Whiteout's block, marked `whiteout-defender (managed by Whiteout Desktop Guard)`:

```bat
type "%ProgramData%\OpenAI\Codex\requirements.toml"
```

If you set `RequirementsPath`, check that file instead.

**In Codex**, on either platform, run `/hooks`. It lists three Whiteout hooks as managed.

---

## What you see in Whiteout

Codex status needs **Desktop Guard 1.8.134 or later**, or the **Whiteout VS Code extension 1.28.5 or later**. A user whose Whiteout apps are older shows **Update Desktop Guard**.

### Coverage page

The **Codex** card at the top of the page appears once at least one device reports Codex. It shows:

- how many devices have Codex, and how each is protected, for example "14 devices — 10 protected by MDM, 2 user-approved, 2 need approval"
- how many devices run Codex without Whiteout's checks
- your Intune deployment, or where your other MDM's payload carries Codex protection
- a warning when a device has Whiteout's checks in two places, or a Codex profile from your MDM without them

At the same time, the user table gains a **Codex** column. Each user gets one status, from their least-protected device. If they have more than one device, hover over the status to see each one.

| Status | Meaning | What fixes it |
|---|---|---|
| **Protected · MDM** | Your MDM forces Codex's preference on this Mac with Whiteout's checks. They run for every user, and Codex can't turn them off. | — |
| **Protected · admin** | Codex's machine requirements file carries Whiteout's checks, so they run for every user. On a Mac, an administrator chose **Turn On Codex Protection…**. On Windows, it's also what an MDM-deployed script shows, because the device can't tell who wrote the file. | — |
| **Protected · user-approved** | The user chose **Trust all and continue** in Codex. Checks run for this user until the hooks change. | Deploy with your MDM if you don't want to depend on each user. |
| **Needs approval** | Codex is installed, but the user hasn't trusted Whiteout's hooks. Codex prompts aren't checked. | The user chooses **Trust all and continue** when Codex starts, or you deploy with your MDM. |
| **Not set up** | Codex is installed, and Whiteout's hooks aren't registered. Codex prompts aren't checked. | Update Desktop Guard or the VS Code extension on the device. |
| **Off by setting** | A setting turned Whiteout's Codex checks off on the device. Codex prompts aren't checked. | Turn the VS Code setting `whiteout.enableCodexHooks` back on. |
| **Checks silent** | Whiteout's checks should run and Codex is being used, but no checked Codex prompt has arrived from the device in 24 hours. | Run `/hooks` in Codex on the device to confirm the three Whiteout hooks are listed, and check that Desktop Guard is signed in. If they are, contact Groovy support. |
| **Update Desktop Guard** | The user's Whiteout apps don't report Codex status yet. | Update Desktop Guard or the VS Code extension. |
| **Unknown** | The device couldn't tell whether Codex runs Whiteout's checks. | — |

**Needs approval**, **Not set up**, **Off by setting** and **Checks silent** count against the user's overall coverage. The user shows as **Needs attention**, with **Codex without Whiteout** as the reason. A device that hasn't reported Codex status, reports **Unknown**, or hasn't reported for a week never counts against coverage.

On the **IDE extension** tab, the **Codex without Whiteout** filter lists those users. Reminder emails you send from the Coverage page tell each user what to do on which device. The CSV export includes the Codex columns.

### Device page

A device that reports Codex has a **Codex** section, with one entry for each user. Each entry shows:

- the status
- where the checks come from: an MDM configuration profile, the machine requirements file, or the user's hooks file
- the Codex version and the Whiteout app that reported, with its version
- the last report, the last Codex use, the last checked Codex prompt, and the number of Codex turns in the last 24 hours
- the fix for the current status

### Alerts

Whiteout raises two notifications for Codex, in **Alerts & Audit → Notifications**. Both are device events at medium severity or above, so your organization's **Critical platform events** rule includes them without any setup.

| Notification | Severity | When it fires |
|---|---|---|
| **Codex used without Whiteout's checks** | Medium | A device reported **Needs approval**, **Not set up** or **Off by setting** on two heartbeats in a row, and Codex was used on it in the last 24 hours. The alert names the user, the device and the fix. It repeats at most weekly for each device and user. |
| **Codex checks silent** | High | Whiteout's checks should run on a device (managed or user-trusted, unchanged for 24 hours), the device reported 3 or more Codex turns in the last 24 hours, and no Codex prompt from it was checked in the same 24 hours. It doesn't fire while the device reports checks unavailable during a Whiteout outage. It repeats at most weekly for each device. |

Neither fires for **Unknown**. There is no "restored" notification: the device's status turns green on the Coverage page instead.

---

## Privacy

For Codex status, only states, the Codex version and a count of Codex turns leave the device. Prompt content is never sent for this feature. To count turns, Desktop Guard and the VS Code extension read only the type and time of each entry in Codex's local session files.
