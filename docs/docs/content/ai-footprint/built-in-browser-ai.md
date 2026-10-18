# Built-In Browser AI

Most browsers now ship with their own AI assistant: Gemini in Chrome, Copilot in Edge, Leo in Brave, Aria in Opera and the AI chatbot sidebar in Firefox. Some of these can read the page that's open as well as what people type. AI Footprint shows, for every browser on every device, whether its built-in AI is on. An optional MDM recipe lets you turn each one off, or stop it reading pages.

They appear in **Coverage → AI Footprint** with the category **Built-in browser AI**.

> **Detection and policy, for now.** Whiteout shows where each feature is on, and the MDM recipe below sets the browser's own policy for it. Whiteout doesn't yet check what people type into these panels. Checks before send for Gemini in Chrome and Copilot in Edge are coming. Until then, the recipe is how you control them.

Desktop Guard reports this as part of its browser profile scan, on macOS and Windows. There's nothing to turn on.

---

## What's detected

| Feature | Browser | What the MDM recipe offers |
|---|---|---|
| **Gemini in Chrome** | Google Chrome | Allow, Turn off |
| **Copilot in Edge** (the sidebar and the toolbar Copilot button) | Microsoft Edge | Allow, Turn off, Allow but block page reading |
| **Brave Leo** | Brave | Allow, Turn off |
| **Firefox AI chatbot** (the sidebar chatbot) | Firefox | Allow, Turn off |
| **Opera Aria** | Opera | Detection only. Whiteout knows of no enterprise policy for Aria. |

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
| Governance | Who checks what's typed into it. Today this reads **Detection and policy only**. |

### States

| State | Meaning |
|---|---|
| **On** | The feature is on in this browser |
| **Off** | Someone turned it off in the browser's own settings |
| **Turned off by policy** | A browser policy your IT team set turns it off |
| **Not in this browser** | This browser, or this browser profile, doesn't offer the feature |
| **Not reported** | Desktop Guard couldn't tell whether it's on |

A browser with several profiles shows **On** if the feature is on in any of them.

**Off** and **Turned off by policy** are useful posture: those rows never count as **Not governed** and never raise a finding. A feature that's **On** counts under **Not governed**, because nothing checks what's typed into it yet.

**How Desktop Guard decides "turned off by policy".** It uses a policy to set the state only once Whiteout has confirmed what that policy's values mean in the browser. For the other policies, the **Policy** field shows the name and value exactly as Desktop Guard found them on the device, and the state comes from the browser's own settings, or shows **Not reported**. Desktop Guard only reads policies that are really enforced by management, so a setting a person can change themselves never reads as a policy.

---

## Built-in browser AI in use

A built-in AI feature raises a finding only when there's evidence someone **used** it, not just because it's switched on. The finding is a **Shadow AI — active** finding, with the feature and browser underneath, for example *Gemini in Chrome · Google Chrome*.

Evidence of use is either:

- Desktop Guard saw the feature's panel open on that device, or
- that browser sent traffic to the feature's own AI service. Whiteout counts this only for services it has confirmed belong to the feature, so it doesn't mistake ordinary use of a website for the built-in panel.

**Why it matters.** Whatever people type into the panel goes to the browser vendor's AI with no Whiteout check. Panels that can read the open page can also send that page's content, including internal apps, email and documents.

**Severity.** **High**. It becomes **critical** once it's been seen on 3 or more days.

**What to do:**

1. **If the feature isn't approved,** turn it off with the [MDM recipe](#turn-features-off-with-your-mdm).
2. **If people may use it but shouldn't share pages with it,** use **Allow but block page reading** (Copilot in Edge).
3. **If its use is sanctioned,** allowlist it under **Manage → Allowlisted tools**, using its catalog key: `gemini_in_chrome`, `edge_copilot_sidebar`, `brave_leo`, `opera_aria` or `firefox_ai_chatbot`.
4. **Acknowledge the finding** with a note.

The finding resolves by itself when the feature is turned off, when you allowlist it, or when there's been no sign of use for 7 days.

---

## Turn features off with your MDM

Whiteout's MDM deployment payload includes an optional, separately labelled block, **Browser built-in AI (optional)**. For each feature you choose:

| Choice | What it does |
|---|---|
| **Allow** | Deploys nothing. The browser's default and each person's own setting apply. |
| **Turn off** | Sets the browser's policy that turns the feature off |
| **Allow but block page reading** | Copilot in Edge only. Copilot stays available but is stopped from reading the open page on its own. |

Nothing in the block is applied unless you choose to deploy it, and profiles you already have are unchanged. This is policy content you choose. It doesn't change what Whiteout detects: Desktop Guard reports each feature's state either way, so AI Footprint shows the result.

### What each choice sets

These are the browser vendors' own policies. Whiteout writes them in the same places as the profiles that force-install the Whiteout extension.

| Feature | Choice | Policy Whiteout sets |
|---|---|---|
| Gemini in Chrome | Turn off | `GeminiSettings` = `1` |
| Copilot in Edge | Turn off | `HubsSidebarEnabled` = `false` and `Microsoft365CopilotChatIconEnabled` = `false` |
| Copilot in Edge | Allow but block page reading | `CopilotPageContext` = `false` and `EdgeEntraCopilotPageContext` = `false` |
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
- **Firefox on macOS** reads policy only when `EnterprisePoliciesEnabled` is true, so the recipe includes it. Newer Firefox versions also have an AI controls policy. If you set that one as well, check `about:policies` to see which Firefox applies.

macOS configuration profile content for Gemini in Chrome (domain `com.google.Chrome`):

```xml
<key>GeminiSettings</key>
<integer>1</integer>
```

For Copilot in Edge, page reading blocked (domain `com.microsoft.Edge`):

```xml
<key>CopilotPageContext</key>
<false/>
<key>EdgeEntraCopilotPageContext</key>
<false/>
```

### Check it on a test device first

Browser vendors change how their AI features and policies behave between versions, and Whiteout hasn't confirmed every policy on every version. Deploy to one test device first, then:

1. Open the browser's policy page and check the policy is listed with the value you set: `chrome://policy`, `edge://policy`, `brave://policy` or `about:policies` (Firefox).
2. Check the feature is gone, or can no longer read the page.
3. Look at the device in AI Footprint after Desktop Guard's next browser scan, within about 15 minutes.

Then roll it out to the rest of the fleet. See your browser vendor's enterprise policy documentation for the full description of each policy.

### Deploying it

| MDM | How |
|---|---|
| **Jamf, Kandji, Mosyle, Workspace ONE** | The payload has a **BROWSER BUILT-IN AI (OPTIONAL)** section with one block per feature and choice. Upload only the blocks you chose, each as its own profile for the domain it names. **Allow** has no block. |
| **Microsoft Intune** | Run `intune-fanout.py` with `--builtin-ai` and `--browser-group`, for example `--builtin-ai gemini_in_chrome=off,edge_copilot_sidebar=block_page_reading`. Only the choices you name are created. Firefox needs Mozilla's Firefox ADMX templates imported into Intune, as for the force-install profile. No Intune profile is created for Brave on Windows; set its registry value with your own tooling. |
| **NinjaOne** | The deployment script writes the choices you give when you generate it, on Windows and macOS. The rollback script generated with the same choices removes them. See below. |

See [Zero-Touch MDM](./deployment/zero-touch-mdm.md) for generating the payload and running the fanout script.

For NinjaOne, generate the script from the API with `builtin_ai`, as a comma-separated list of `feature=choice`:

```bash
curl -G -H "Authorization: Bearer $ADMIN_TOKEN" \
  -o whiteout-deploy.ps1 \
  --data-urlencode "kind=deploy" \
  --data-urlencode "platform=windows" \
  --data-urlencode "builtin_ai=gemini_in_chrome=off,edge_copilot_sidebar=block_page_reading" \
  "https://api.whiteout.groovysec.com/mdm/integrations/$INTEGRATION_ID/ninjaone-script"
```

Use `platform=macos` for the macOS script, and `kind=rollback` for the matching rollback script. The features are `gemini_in_chrome`, `edge_copilot_sidebar`, `brave_leo` and `firefox_ai_chatbot`, and the choices are `allow`, `off` and `block_page_reading`.

---

## What isn't covered yet

- **What's typed into the panels.** Whiteout doesn't check prompts typed into built-in browser AI yet. Checks before send for Gemini in Chrome and Copilot in Edge are coming.
- **Page content the panel reads by itself.** When checks before send arrive, they'll cover what people type and attach. Content a panel pulls from the open page on its own isn't something Whiteout sees, which is why the recipe offers **Allow but block page reading**.
- **Opera Aria** can be detected, but Whiteout knows of no policy to turn it off.
- **Safari** isn't part of the browser profile scan. See [Browser coverage](./ai-footprint/browser-coverage.md).
- **Devices without Desktop Guard.** The feature's state comes from Desktop Guard's browser scan.
