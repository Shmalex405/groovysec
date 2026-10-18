# Web AI Sites

AI Footprint lists the AI websites people use in their browsers, with the category **Web AI**. The rows come from the Whiteout browser extension in two ways:

- **Prompts on sites the extension governs.** The extension checks prompts on sites such as ChatGPT, Claude and Gemini. That use appears as a Web AI row.
- **Visits to AI sites it doesn't govern.** The extension (1.14.0 and later) notes visits to other AI sites, such as Character.AI, so you can see AI use that nothing checks.

> **This never blocks or slows a page.** The extension records the visit and the page loads as normal.

---

## Known sites

Known sites are in Whiteout's catalog.

**Sites the extension governs.** Prompts typed here are checked against your policies.

- **OpenAI and Anthropic:** ChatGPT (web), Claude (web)
- **Google:** Gemini (web), Gemini in Google Workspace, Google AI Studio
- **Microsoft:** Microsoft Copilot (web), Microsoft 365 Copilot (web)
- **Others:** Perplexity (web), Le Chat (Mistral), Grok (web), DeepSeek (web), You.com, Poe, HuggingChat

A governed site never raises a shadow AI finding. Its row shows how many devices and people use it and, where the extension can tell, which [kinds of account](./ai-footprint/account-types.md) they use. If someone uses a governed site from a browser or profile without the extension, that's a [browser coverage](./ai-footprint/browser-coverage.md) gap.

**Sites in the catalog that the extension doesn't govern:** **Meta AI (web)**, **Character.AI** and **NotebookLM**, plus any sites your organization adds to the catalog. A visit to one of these raises **Shadow AI — installed** with the category **Web AI**, because nothing checks what's sent there. Its severity is **medium**.

**What to do:**

1. **If the site is sanctioned,** allowlist it under **Manage**. Use its catalog key or its evidence key, for example `web:character.ai`.
2. **If it isn't approved,** review the person's access. You can block the site with your web gateway or browser policy.
3. **Acknowledge the finding** with a note.

---

## Unknown sites

An unknown site is an AI site that isn't one of the catalogued tools above. It's either:

- a domain on Whiteout's wider list of AI services, or
- a domain that looks like an AI site: it's under `.ai`, or a part of its name is *gpt*, *llm* or *chatbot*.

The row shows the site's hostname, with an **Unknown** chip and low confidence.

**Unknown sites stay in the inventory.** A visit to an unknown site doesn't raise a finding on its own, because a domain name is a weak signal. Many `.ai` domains aren't AI chat tools.

**Promote a site to the catalog** when you know it's an AI tool:

1. Open its footprint row and choose **Add to catalog**.
2. Under how to recognize it, choose **This site**. It matches the site and its sub-domains, on every device.
3. Choose its governance (usually **Recognize only (still flagged as ungoverned)**), its risk, and whether to allowlist it.

From then on the site shows as **Known**. Unless you allowlist it, visits raise findings like other catalogued sites the extension doesn't govern. Your catalog entry is also used to classify [imported network logs](./ai-footprint/network-logs.md).

---

## What the extension collects

| Step | What happens |
|---|---|
| A page loads | The extension takes the page's hostname, for the main page only (not frames inside it). |
| On the device | It compares the hostname with the list of AI sites Whiteout sends it (refreshed every 6 hours), then with the rules for unknown sites above. |
| Not an AI site | **Dropped immediately.** It isn't stored or sent. |
| An AI site | It adds one to that site's visit count for the day. |
| Every 15 minutes, and when the browser goes idle | It sends each AI site's hostname, the day, the number of visits, and whether the visits were in a private window. |

**Never collected:** full URLs, paths, page titles, page content, search terms, or any non-AI site.

- **Private windows.** If the extension is allowed to run in private windows, visits there are counted and marked private, not dropped.
- **Signed out.** The extension keeps counting but sends nothing until someone signs in.
- **How long it's kept.** Daily visit counts are kept for 35 days. A Web AI row that nobody has used or visited for 30 days is removed from the footprint.

---

## The "Read your browsing history" permission

To see which AI sites are opened, the extension uses the browser's `webNavigation` permission. It's required in extension 1.14.0 and later. Browsers describe it in broad terms:

| Browser | What the browser calls it |
|---|---|
| Chrome, Edge | **Read your browsing history** |
| Firefox | **Access browser activity during navigation** |

The extension doesn't read or upload your history. It looks at each page's hostname as the page loads, and it discards any site that isn't an AI site on the device, as described above.

**Who has to approve it:**

- **Extension force-installed through MDM:** the browser grants the permission silently. Nobody sees a prompt.
- **Extension installed by the person:** when the extension updates to 1.14.0, the browser asks them once to approve the new permission. Until they approve it, the browser can keep the extension turned off or on its previous version, so prompts in that browser may not be checked. Let people know before the update, or force-install the extension through MDM (see [Force-install the extension](./ai-footprint/browser-coverage.md#force-install-the-extension)).

To check who hasn't approved yet, look under **Coverage → Enrollment** for people whose browser extension stopped checking in.

---

## What isn't covered

- **AI panels built into the browser,** such as the Copilot sidebar in Edge, Gemini in Chrome and Leo in Brave. These aren't websites. AI Footprint lists them separately. See [Built-in browser AI](./ai-footprint/built-in-browser-ai.md).
- **AI features inside other web apps.** Their requests go to the app's own site, which isn't an AI site. Slack AI, Notion AI and Atlassian Rovo are covered separately. See [AI inside work apps](./ai-footprint/ai-in-work-apps.md).
- **Browsers without the extension.** Use the [profile scan](./ai-footprint/browser-coverage.md) and [imported network logs](./ai-footprint/network-logs.md) to find those.
