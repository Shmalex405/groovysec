# Browser Coverage

Prompts typed into AI websites are checked by the Whiteout browser extension, but only in the browser profiles where it is installed and turned on. Someone with two Chrome profiles, a work profile with Whiteout and a personal one without it, can use ChatGPT unchecked in the second.

Desktop Guard finds those gaps by scanning every browser profile on the device. On Windows, when AI traffic comes from a browser with an uncovered profile, or from a browser where the extension isn't running at all, AI Footprint raises a finding.

---

## How the profile scan works

Desktop Guard 1.8.51 and later scans the device's browsers every 15 minutes, starting about a minute after it launches. It reads only each browser's own profile files and the browser policy in effect. It never reads browsing history, page content or credential files.

| Platform | Browsers scanned |
|---|---|
| **macOS** | Chrome, Edge, Brave, Arc, Vivaldi, Opera, Chromium, Aside, Comet, Firefox |
| **Windows** | Chrome, Edge, Brave, Arc, Vivaldi, Opera, Chromium, Comet, Firefox |

Not scanned: **Safari** (its extension state can't be read without Full Disk Access; on macOS, Desktop Guard still notices Safari running), **Opera's side profiles**, and **Aside on Windows**.

For each profile, Desktop Guard reports:

| | Values |
|---|---|
| **Whiteout** | **Installed**, **Turned off** or **Missing** |
| **Installed by** | **Force-installed by IT**, **Added by the user**, **Installed by software** or **Developer mode** |
| **Last used** | The day the profile was last used |
| **Account** | **Work account**, **Personal account**, **Not signed in** or **Unknown account** |

**How the account is decided.** Desktop Guard compares the domain of the account signed in to the browser profile with the domain of the person's Whiteout sign-in. A match is a work account; any other domain is personal. Only that verdict leaves the device. The email address never does. If your organization uses several email domains, a profile signed in with another of your domains shows as **Personal account**, because the comparison is with the person's own sign-in domain.

Profiles are identified by their folder name, such as *Default* or *Profile 1*, never by the name the person gave them.

**Which profiles count.** A profile counts if it was used in the last 14 days. Older profiles are listed but never count as a gap.

The scan also checks whether your MDM's force-install policy for each browser includes Whiteout.

---

## Profile without Whiteout

The finding is **Shadow AI — active**, shown as *Google Chrome · profile without Whiteout*. Its drawer reads, for example:

> **Google Chrome sent traffic to chatgpt.com from a profile without Whiteout.**

The drawer also lists **Profiles without Whiteout**, each with its account type and when it was last active.

**When it's raised.** Desktop Guard saw AI traffic from the browser on the device, and the Whiteout extension is running in that browser. But the latest profile scan shows at least one profile of that browser, used in the last 14 days, where Whiteout is missing or turned off. Coverage is judged per browser: a browser counts as covered only when every profile used in the last 14 days has the extension turned on.

**Why it matters.** Network traffic doesn't say which profile sent it, so some of that AI use may have come from the uncovered profile, where prompts aren't checked. The list of uncovered profiles shows where to look. A personal profile on a work laptop is the most common case.

**How to fix it:**

1. **Force-install the extension for that browser through your MDM.** Every profile gets it, and people can't remove or turn it off. See [Force-install the extension](./ai-footprint/browser-coverage.md#force-install-the-extension) below.
2. Or ask the person to turn the extension on in that profile (if it's **Turned off**), or to add it.
3. If the profile isn't needed, removing it also clears the gap.

The finding resolves by itself once a profile scan shows Whiteout turned on in every profile of that browser used in the last 14 days. Until then, the person also shows as **Browser without Whiteout** under **Coverage → Enrollment**.

---

## Browser without extension

The finding is **Shadow AI — active**, shown as *Google Chrome · no Whiteout extension*. Its drawer reads, for example:

> **Google Chrome sent traffic to chatgpt.com, and the Whiteout extension isn't running in that browser on this device.**

**When it's raised.** Desktop Guard saw AI traffic from the browser, and the Whiteout extension hadn't checked in from that browser on that device around the time of the traffic.

**Why it matters.** Prompts typed into a browser are checked by the Whiteout extension. Without it, nothing sent from that browser is checked.

**How to fix it:**

1. Install the extension in that browser. An MDM force-install covers every profile.
2. If the extension is installed but signed out or turned off, have the person sign in or turn it on.
3. If this use is sanctioned, allowlist the provider (for example `openai`) under **Manage**.

> The extension can't tell Brave, Arc, Vivaldi, Opera and Chromium apart from Chrome. When it runs in any of them, it counts as running in all of them. The profile scan is the precise check for those browsers.

---

## Where these findings come from

Both findings need Desktop Guard to see the browser's AI traffic on the device. Today that means:

- **Windows**, with Desktop Guard's network sensor running,
- a browser that uses the Windows resolver rather than its own DNS, and
- traffic that doesn't go through a secure web gateway.

On **macOS**, Desktop Guard doesn't observe network traffic yet, so Macs don't raise these findings. Uncovered profiles on a Mac still show under **Coverage → Enrollment → Browsers** and count as a coverage gap there.

When a device's browser traffic isn't fully visible, the finding's drawer says so in one line. See [Network visibility](./ai-footprint/network-visibility.md) for how to fix that.

---

## Force-install the extension

Force-installing through your MDM is the fix for both findings. Each browser reads its own policy, so a Chrome policy doesn't reach Edge, Firefox or Aside.

| Browser | Extension ID | Policy |
|---|---|---|
| **Chrome** | `dcbndpnolggjgmclalpdcogigpedlhpn` | `ExtensionInstallForcelist` with the entry `dcbndpnolggjgmclalpdcogigpedlhpn;https://clients2.google.com/service/update2/crx`. macOS domain `com.google.Chrome`. Windows key `HKLM\SOFTWARE\Policies\Google\Chrome`. |
| **Edge** | `oihdhmfgchleljlnddplaaaoeffmjdao` | `ExtensionInstallForcelist` with the entry `oihdhmfgchleljlnddplaaaoeffmjdao;https://edge.microsoft.com/extensionwebstorebase/v1/crx`. macOS domain `com.microsoft.Edge`. Windows key `HKLM\SOFTWARE\Policies\Microsoft\Edge`. |
| **Firefox** | `whiteout-ai@groovysec.com` | `ExtensionSettings` with the extension set to `force_installed`. On macOS, domain `org.mozilla.firefox` with `EnterprisePoliciesEnabled` set to true. On Windows, key `HKLM\SOFTWARE\Policies\Mozilla\Firefox\ExtensionSettings\whiteout-ai@groovysec.com`. |
| **Aside** (macOS) | `dcbndpnolggjgmclalpdcogigpedlhpn` | `ExtensionInstallForcelist` with the same entry as Chrome, in the domain `at.studio.AsideBrowser` |

Step-by-step profiles for each MDM are in [Zero-Touch MDM](./deployment/zero-touch-mdm.md), [Microsoft Intune](./mdm-providers/microsoft-intune.md) and [Jamf](./mdm-providers/jamf.md).

**Other Chromium-based browsers** (Brave, Vivaldi, Arc, Opera, Comet, Chromium) install the Chrome Web Store version of the extension, with the Chrome ID above. Whether they accept a force-install policy, and where, depends on the browser:

- **Opera** doesn't document an enterprise policy for installing extensions. People add Whiteout from the store themselves.
- **Arc** has no policy location on Windows. On macOS, Whiteout hasn't verified that Arc applies a force-install policy.
- **Comet:** Whiteout hasn't verified that Comet applies a force-install policy.
- **Brave, Vivaldi and Chromium:** check the browser's own enterprise documentation.

For browsers you can't force-install into, ask people to add the extension from the store, and use the profile scan to confirm they did.

---

## Enrollment → Browsers

**Coverage → Enrollment → Browsers** shows every scanned browser profile in your organization.

- **Summary:** **Machines scanned**, **Profiles with Whiteout**, **Profiles without Whiteout** and **Force-install gaps**.
- **Force-install gaps:** *Whiteout is missing from the force-install list on N machines* means your MDM pushes a force-install list to those browsers, but Whiteout isn't on it. It isn't installed automatically, and people can remove it. The alert gives the extension ID to add for each browser.
- **Profile table:** **User**, **Machine**, **Browser**, **Profile**, **Account**, **Whiteout**, **Traffic visible**, **Installed by**, **Version** and **Last used**. Filter by **Without Whiteout**, **Personal accounts**, **Added by hand**, **Force-installed**, **All in use** or **All profiles**.

### Traffic visible

The **Traffic visible** column says whether Desktop Guard can see that browser's AI traffic on that machine, which is what the findings above depend on.

| Value | Meaning |
|---|---|
| **Visible** | The browser uses the system resolver, so Desktop Guard sees its AI traffic. |
| **Not visible — built-in DNS** | The browser resolves names with its own DNS client. |
| **Not visible — DNS over HTTPS** | The browser uses DNS over HTTPS. |
| **May not be visible — DNS mode unknown** | Desktop Guard couldn't tell how the browser resolves names, for example Firefox on its regional default. |
| **Through gateway** | Browser traffic on this machine goes through a proxy or secure web gateway. |
| **—** | Network-level AI traffic isn't observed on this machine (for example, a Mac). |

See [Network visibility](./ai-footprint/network-visibility.md) for what each one means and how to fix it.
