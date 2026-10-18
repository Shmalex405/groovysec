# Third-Party AI Extensions

AI browser extensions such as Grammarly, Sider, Monica and HARPA AI read the pages people open and the text they type, and send it to their own AI service. That path skips Whiteout. AI Footprint lists these extensions on every device so you can decide which to allow.

They appear in **Coverage → AI Footprint** with the category **Third-party AI extension**. This never includes Whiteout's own extension.

---

## What's inventoried

Desktop Guard 1.8.106 and later reads the installed extensions in every profile of every browser it scans (see [Browser coverage](./ai-footprint/browser-coverage.md#how-the-profile-scan-works) for the list). It does this as part of its full scan, every 8 hours and when you choose **Rescan**.

**Only AI extensions are kept.** An extension is reported only if:

- its ID matches an AI extension in Whiteout's catalog (shown as **Known**), or
- its name looks like AI, for example it contains *ChatGPT*, *Claude*, *Gemini*, *Copilot* or *Perplexity*, or the word *AI*, *GPT*, *LLM* or *Assistant* (shown as **unknown**).

Every other extension is dropped on the device and never sent to Whiteout.

**Catalogued AI extensions** include Claude for Chrome, ChatGPT, Grammarly, Sider, Monica, HARPA AI, Merlin, MaxAI, Liner, Compose AI, QuillBot, Wordtune, Jasper and Glasp. Extension IDs are added to the catalog only after they're confirmed in the Chrome Web Store, Microsoft Edge Add-ons or Firefox Add-ons.

### What each extension shows

Open the extension's footprint row, or the finding, to see:

| Field | Values |
|---|---|
| **Browser** and **Profile** | Which browser and which profile (by folder name, such as *Default*) |
| **Profile account** | **Work account**, **Personal account**, **Not signed in** or **Unknown account**. Only this verdict leaves the device, never the email address. |
| **Install source** | **Installed by policy (IT)**, **Web store**, **Sideloaded** (installed by other software), **Developer mode** or **Unknown** |
| **Site access** | **Can read every site** or **Limited to specific sites** |
| **Version** and **Enabled** | The installed version, and whether it's turned on |
| **Extension ID** | The ID to use if you block it |

### Can read every site

An extension marked **Can read every site** has permission to read and change any page the person opens, including your internal apps, email and documents. It can send what it reads to its vendor. That's why such an extension raises a **high** severity finding.

---

## Findings

A catalogued AI extension on a device raises **Shadow AI — installed** because no Whiteout surface checks what it sends. The exception is **Claude for Chrome**: Desktop Guard checks the prompts sent through it, so it counts as governed wherever Desktop Guard is live.

| Extension | Severity |
|---|---|
| Can read every site | High |
| A catalogued AI assistant rated **Elevated** risk (most of the list above) | High |
| A catalogued extension with standard risk, limited to specific sites | Medium |
| Unknown (AI-style name only) | High, once another signal from the same device backs it up. A name alone stays in the inventory without a finding. See [Unknown tools](./ai-footprint/shadow-ai.md#unknown-tools). |

**What to do:**

1. **If it's sanctioned,** allowlist it under **Manage → Allowlisted tools**. For a catalogued extension, use the catalog key shown in the finding's **Tool** column, for example `grammarly_extension`.
2. **If it isn't approved,** remove it from the profile, and keep it out with your browser's extension policy (below).
3. **If it's unknown and you know what it is,** choose **Add to catalog**.

---

## Block AI extensions with your MDM

Chrome and Edge read the same extension policies. Firefox has its own. Copy the **Extension ID** from the finding's evidence.

| Browser | Policy | How |
|---|---|---|
| **Chrome**, **Edge** | `ExtensionInstallBlocklist` | A list of extension IDs people can't install. Chrome and Edge also turn off a blocklisted extension that's already installed. |
| **Chrome**, **Edge** | `ExtensionSettings` | Per extension ID, set `installation_mode` to `blocked`. Use this when you manage extensions with `ExtensionSettings` already. |
| **Firefox** | `ExtensionSettings` | Per add-on ID, set `installation_mode` to `blocked`. |

Policy locations are the same ones you use to force-install Whiteout. For example, Chrome uses the macOS domain `com.google.Chrome` and the Windows key `HKLM\SOFTWARE\Policies\Google\Chrome`. See [Force-install the extension](./ai-footprint/browser-coverage.md#force-install-the-extension).

> **If you block all extensions** (with `*` in the blocklist) and allow only approved ones, add the Whiteout extension ID to `ExtensionInstallAllowlist`, or force-install it, so Whiteout keeps working.

An extension can have a different ID in each store. A Chrome Web Store extension installed in Edge keeps its Chrome ID. Block the ID the finding shows.

After you block an extension, its finding resolves at the next full scan that no longer finds it.

**Keep an extension off sensitive sites instead.** If people may use an AI extension in general but it shouldn't run on your internal apps, the **Browser AI policy** setting can keep chosen extensions off the sites you list, through the MDM profiles Whiteout generates. See [Keep AI extensions off sensitive sites](./ai-footprint/ai-in-work-apps.md#keep-ai-extensions-off-sensitive-sites).

---

## What isn't covered

- **What the extension sends.** Whiteout lists the extension and what it can access. It doesn't see what the extension reads or sends.
- **Safari** extensions, and browsers the profile scan doesn't read. See [Browser coverage](./ai-footprint/browser-coverage.md#how-the-profile-scan-works).
- **AI panels built into the browser,** such as the Copilot sidebar in Edge, Gemini in Chrome and Leo in Brave. These aren't extensions. AI Footprint lists them separately. See [Built-in browser AI](./ai-footprint/built-in-browser-ai.md).
