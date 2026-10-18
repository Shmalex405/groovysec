# Built-In Browser AI

Most browsers now ship with their own AI assistant: Gemini in Chrome, Copilot in Edge, Leo in Brave, Aria in Opera and the AI chatbot sidebar in Firefox. Some of these can read the page that's open as well as what people type. AI Footprint shows, for every browser on every device, whether its built-in AI is on. A **Browser AI policy** setting lets you turn each one off, or stop it reading pages, through the MDM profiles Whiteout generates.

They appear in **Coverage → AI Footprint** with the category **Built-in browser AI**.

Desktop Guard reports this as part of its browser profile scan, on macOS and Windows. There's nothing to turn on.

---

## What's detected, and what's checked

| Feature | Browser | Checked before send | Browser AI policy choices |
|---|---|---|---|
| **Copilot in Edge** (the sidebar and the toolbar Copilot button) | Microsoft Edge | **Windows:** yes, by Desktop Guard. **macOS:** detection only. | Allow, Turn off, Allow but block page reading |
| **Gemini in Chrome** | Google Chrome | Not yet: detection only | Allow, Turn off |
| **Brave Leo** | Brave | No: detection only | Allow, Turn off |
| **Firefox AI chatbot** (the sidebar chatbot) | Firefox | No: detection only | Allow, Turn off |
| **Opera Aria** | Opera | No: detection only | None. Whiteout knows of no enterprise policy for Aria. |

**Copilot in Edge on Windows.** Desktop Guard checks what people type and attach in the Copilot pane before it's sent, the same way it checks the Copilot desktop app. A prompt that breaks your policies is blocked or warned about. If Desktop Guard can't read the pane, the prompt goes through as normal and is recorded as not checked.

**Copilot in Edge on macOS** is detection only. Edge on macOS doesn't expose the pane's content to the accessibility interface Desktop Guard reads, so there's nothing for it to check. Use the Browser AI policy to control it there.

**Gemini in Chrome** is detection only for now. Checks before send are coming. Gemini in Chrome also isn't offered in some regions, or to some accounts. Where it isn't offered, AI Footprint shows **Not in this browser**.

Arc, Vivaldi and Chromium report no built-in AI. AI browsers such as Aside, Comet and Dia have their own rows in AI Footprint.

---

## What AI Footprint shows

There's one row per feature. Open it to see each device and browser it was found on, with:

| Field | What it means |
|---|---|
| **Browser** | The browser the feature belongs to |
| **State** | Whether the feature is on in that browser. See below. |
| **Policy** | The browser policy Desktop Guard found for it, with its value, for example `GeminiSettings = 1 (device-wide)`. **No policy set** if there isn't one. |
| **Page reading** | For Gemini in Chrome and Copilot in Edge: **Can read the open page**, **Can't read the open page** or **Not reported** |
| Governance | Who checks what's typed into it: Desktop Guard, or **Detection and policy only** |

Choose **Set browser policy** in the drawer to open the [Browser AI policy](#turn-features-off-with-your-mdm) setting.

### States

| State | Meaning |
|---|---|
| **On** | The feature is on in this browser |
| **Off** | Someone turned it off in the browser's own settings |
| **Turned off by policy** | A browser policy your IT team set turns it off |
| **Not in this browser** | This browser, or this browser profile, doesn't offer the feature |
| **Not reported** | Desktop Guard couldn't tell whether it's on |

A browser with several profiles shows **On** if the feature is on in any of them.

**Off** and **Turned off by policy** are useful posture: those rows never count as **Not governed** and never raise a finding. A feature that's **On** counts under **Not governed** wherever nothing checks what's typed into it. Copilot in Edge counts as governed on Windows devices where Desktop Guard is running.

**How Desktop Guard decides "turned off by policy".** It uses a policy to set the state only once Whiteout has confirmed what that policy's values mean in the browser. For the other policies, the **Policy** field shows the name and value exactly as Desktop Guard found them on the device, and the state comes from the browser's own settings, or shows **Not reported**. Desktop Guard only reads policies that are really enforced on the device by management, so a setting a person can change themselves never reads as a policy.

**Policies set from a cloud console.** A Chrome policy you set from the Google Admin console, rather than through your MDM, reaches Chrome as a cloud policy. Desktop Guard doesn't read cloud policies, so the **Policy** field doesn't show it. The feature's state still reflects what the browser reports.

---

## Built-in browser AI in use

A built-in AI feature raises a finding only when there's evidence someone **used** it with nothing checking it, not just because it's switched on. The finding is a **Shadow AI — active** finding, with the feature and browser underneath, for example *Gemini in Chrome · Google Chrome*.

Evidence of use is either:

- Desktop Guard saw the feature's panel open on that device, or
- that browser sent traffic to the feature's own AI service. Whiteout counts this only for services it has confirmed belong to the feature, so it doesn't mistake ordinary use of a website for the built-in panel.

Copilot in Edge used on a Windows device where Desktop Guard checks it doesn't raise this finding.

**Why it matters.** Whatever people type into the panel goes to the browser vendor's AI with no Whiteout check. Panels that can read the open page can also send that page's content, including internal apps, email and documents.

**Severity.** **High**. It becomes **critical** once it's been seen on 3 or more days.

**What to do:**

1. **If the feature isn't approved,** turn it off with the [Browser AI policy](#turn-features-off-with-your-mdm).
2. **If people may use it but shouldn't share pages with it,** choose **Allow but block page reading** (Copilot in Edge).
3. **For Copilot in Edge on Windows,** make sure Desktop Guard is installed and running on the device.
4. **If its use is sanctioned,** allowlist it under **Manage → Allowlisted tools**, using its catalog key: `gemini_in_chrome`, `edge_copilot_sidebar`, `brave_leo`, `opera_aria` or `firefox_ai_chatbot`.
5. **Acknowledge the finding** with a note.

The finding resolves by itself when the feature is turned off, when you allowlist it, or when there's been no sign of use for 7 days.

---

## Turn features off with your MDM

Set this once, under **Integrations → Mobile Device Management (MDM) → Browser AI policy**. The **Set browser policy** button in AI Footprint opens it too.

Under **AI built into the browser**, pick a choice for each feature, then choose **Save**:

| Choice | What it does |
|---|---|
| **Allow** | Adds nothing. The browser's default and each person's own setting apply. This is the default. |
| **Turn off** | Sets the browser's policy that turns the feature off |
| **Allow, block page reading** | Copilot in Edge only. Copilot stays available but is stopped from reading the open page on its own. |

From then on, Whiteout adds your choices to every MDM profile and script it generates: Intune, Jamf, Kandji, Mosyle, Workspace ONE and NinjaOne. The payload and NinjaOne dialogs remind you of this.

- **Nothing changes on devices until you deploy a newly generated profile.** Saving the setting doesn't touch profiles already deployed.
- **Allow everywhere adds nothing,** so profiles you generate stay exactly as they were.
- **It doesn't change what Whiteout detects.** Desktop Guard reports each feature's state either way, so AI Footprint shows the result.

The same card holds [Keep AI extensions off sensitive sites](./ai-footprint/ai-in-work-apps.md#keep-ai-extensions-off-sensitive-sites).

### What each choice sets

These are the browser vendors' own policies. Whiteout writes them in the same places as the profiles that force-install the Whiteout extension.

| Feature | Choice | Policy Whiteout sets |
|---|---|---|
| Gemini in Chrome | Turn off | `GeminiSettings` = `1` |
| Copilot in Edge | Turn off | `HubsSidebarEnabled` = `false` and `Microsoft365CopilotChatIconEnabled` = `false` |
| Copilot in Edge | Allow, block page reading | `CopilotPageContext` = `false` and `EdgeEntraCopilotPageContext` = `false` |
| Brave Leo | Turn off | `BraveAIChatEnabled` = `false` |
| Firefox AI chatbot | Turn off | `GenerativeAI` with `Chatbot` = `false` and `Locked` = `true` |

| Browser | macOS preference domain | Windows registry key |
|---|---|---|
| Chrome | `com.google.Chrome` | `HKLM\SOFTWARE\Policies\Google\Chrome` |
| Edge | `com.microsoft.Edge` | `HKLM\SOFTWARE\Policies\Microsoft\Edge` |
| Brave | `com.brave.Browser` | `HKLM\SOFTWARE\Policies\BraveSoftware\Brave` |
| Firefox | `org.mozilla.firefox` | `HKLM\SOFTWARE\Policies\Mozilla\Firefox\GenerativeAI` |

On Windows, `false` is a `REG_DWORD` of `0`, and Firefox's `Locked` is a `REG_DWORD` of `1`.

Things to know before you deploy:

- **Turning Copilot off in Edge can hide the whole Edge sidebar,** not only Copilot: `HubsSidebarEnabled` is Edge's policy for the sidebar itself, and `Microsoft365CopilotChatIconEnabled` is the one for the toolbar Copilot button.
- **Many of Edge's Copilot policies apply to work (Microsoft Entra ID) profiles only.** A profile signed in with a personal Microsoft account may not follow them. Check `edge://policy` in that profile.
- **For work profiles, your Google Workspace settings can also decide** whether Gemini in Chrome is offered at all. A profile it isn't offered to shows **Not in this browser**.
- **Firefox on macOS** reads policy only when `EnterprisePoliciesEnabled` is true, so Whiteout includes it. Newer Firefox versions also have an AI controls policy. If you set that one as well, check `about:policies` to see which Firefox applies.

### Check it on a test device first

The policy names come from each browser vendor's policy list and are still being checked. Browser vendors also change how their AI features and policies behave between versions. Deploy to one test device first, then:

1. Open the browser's policy page and check the policy is listed with the value you set: `chrome://policy`, `edge://policy`, `brave://policy` or `about:policies` (Firefox).
2. Check the feature is gone, or can no longer read the page.
3. Look at the device in AI Footprint after Desktop Guard's next browser scan, within about 15 minutes.

Then roll it out to the rest of the fleet. See your browser vendor's enterprise policy documentation for the full description of each policy.

### Deploying it

After you save the Browser AI policy, generate the deployment payload or script as usual. See [Zero-Touch MDM](./deployment/zero-touch-mdm.md).

| MDM | What you get |
|---|---|
| **Jamf, Kandji, Mosyle, Workspace ONE** | The payload has a **BROWSER BUILT-IN AI (OPTIONAL)** section with a block for each feature you didn't leave on **Allow**. Upload each block as its own profile for the domain it names. |
| **Microsoft Intune** | `intune-fanout.py` with `--browser-group` creates the profiles for your saved choices along with the browser profiles. Firefox needs Mozilla's Firefox ADMX templates imported into Intune, as for the force-install profile. No Intune profile is created for Brave on Windows; set its registry value with your own tooling. |
| **NinjaOne** | The deployment script writes your saved choices, on Windows and macOS. Generate the rollback script after saving too, so it removes the same policies. |

> **Advanced: overriding the saved choice for one payload.** The payload and NinjaOne script API requests accept a `builtin_ai` parameter, a comma-separated list of `feature=choice`, which replaces the saved choice for that one request. `intune-fanout.py` takes `--builtin-ai` with the same list, or `--builtin-ai none` to create no built-in AI profiles. The features are `gemini_in_chrome`, `edge_copilot_sidebar`, `brave_leo` and `firefox_ai_chatbot`, and the choices are `allow`, `off` and `block_page_reading`. Most organizations don't need this.

---

## What isn't covered yet

- **Prompts in Gemini in Chrome, Brave Leo, Opera Aria and Firefox's chatbot.** Whiteout shows where they're on but doesn't check what's typed into them. Checks before send for Gemini in Chrome are coming.
- **Copilot in Edge on macOS.** Detection and policy only, as described above.
- **Page content a panel reads by itself.** Desktop Guard's check of Copilot in Edge covers what people type and attach. Content the pane pulls from the open page on its own isn't something Whiteout sees, which is why the Browser AI policy offers **Allow, block page reading**.
- **Opera Aria** can be detected, but Whiteout knows of no policy to turn it off.
- **Safari** isn't part of the browser profile scan. See [Browser coverage](./ai-footprint/browser-coverage.md).
- **Devices without Desktop Guard.** The feature's state, and the Copilot in Edge check on Windows, both come from Desktop Guard.
