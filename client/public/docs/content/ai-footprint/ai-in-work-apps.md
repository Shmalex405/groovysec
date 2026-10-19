# AI Inside Work Apps

Many work apps now have AI built in: Slack AI, Notion AI and Atlassian Rovo in Jira and Confluence, plus AI writing tools such as Grammarly. People use them without opening an AI site, so they're easy to miss. This page explains what Whiteout checks in each, what it can only show, and what you can control.

| | In the browser | Desktop app |
|---|---|---|
| **Slack AI** | Prompts typed into Slack AI are checked | The Slack app is shown as AI inside a work app |
| **Notion AI** | Prompts typed into Notion AI are checked | The Notion app is shown as AI inside a work app |
| **Atlassian Rovo** | Prompts typed into Rovo Chat on your Jira and Confluence sites are checked | — |
| **Grammarly and other AI writing extensions** | Listed, but Whiteout can't see what they send. An optional MDM recipe keeps them off sensitive sites. | The Grammarly app is shown as AI inside a work app |

---

## Slack AI, Notion AI and Rovo in the browser

The Whiteout browser extension checks prompts typed into the AI composers of Slack (`app.slack.com`), Notion (`notion.so` and `app.notion.com`) and Atlassian sites (`*.atlassian.net`), the same way it checks a prompt on ChatGPT. A prompt that breaks your policies is blocked or warned about before it's sent.

**Only the AI composer is checked.** Ordinary Slack messages, Notion pages, Jira issues, Confluence pages and comments are never judged, even when they mention AI. The extension acts only when someone sends from inside the app's AI panel.

| App | What's checked |
|---|---|
| **Notion AI** | The Notion AI side panel and the full-page Notion AI chat |
| **Slack AI** | Slack's AI assistant panel |
| **Atlassian Rovo** | Rovo Chat on your Jira and Confluence Cloud sites |

These apps change their pages often. If the extension doesn't recognize an AI panel, prompts there go through as normal and aren't checked. Whiteout never blocks a send because it can't read a panel.

### AI actions with no prompt

Some AI features run without anyone typing a prompt: Slack recaps and summaries, Notion's suggested actions such as *Summarize this page*, and Notion's AI answers in search. There's nothing to check, so these are **never blocked**. The extension records that the app's AI was used, and it shows as use in AI Footprint. No prompt or page content is collected.

### Block only the AI

Slack AI, Notion AI and Atlassian Rovo are listed under **Integrations → AI Applications**, organization-wide and per group. Blocking one is a **partial block**: it turns off only the app's AI panel in the browser. Slack, Notion, Jira and Confluence keep working as normal. The app's card carries an **AI only** chip.

The same applies to the AI built into other work apps Whiteout already covers, such as Copilot in Microsoft 365 and Gemini in Google Workspace: blocking the AI never blocks the app around it.

### The new site permission

To check these composers, browser extension 1.16.0 needs access to the Slack, Notion and Atlassian sites listed above. The same update also adds `copilot.com`, where Microsoft Copilot on the web now lives (see [Web AI sites](./ai-footprint/web-ai-sites.md#known-sites)).

- **Extension force-installed through MDM:** the browser grants the access silently when the extension updates. Nobody sees a prompt.
- **Extension installed by the person:** when the extension updates to 1.16.0, the browser asks them once to approve the new site access. Until they approve it, the browser can keep the extension turned off or on its previous version, so prompts in that browser may not be checked. Let people know before the update, or force-install the extension through MDM (see [Force-install the extension](./ai-footprint/browser-coverage.md#force-install-the-extension)).

The extension uses this access only to find the AI composer and its send button. It doesn't read or collect messages, pages or files.

### In AI Footprint

Slack AI, Notion AI and Rovo appear with the category **AI inside a work app** once someone uses them: a prompt the extension checked, or an AI action it saw. A row that only says someone visited Slack or Notion is never created.

---

## Slack, Notion and Grammarly desktop apps

The Slack, Notion and Grammarly desktop apps are listed in AI Footprint as **AI inside a work app**, shown as **Work app** in the table.

- They never count as **Not governed** and never raise a finding. They're work apps with AI inside, not AI tools in their own right.
- Their governance shows as **Not applicable (built-in or work app)**.
- For the Grammarly app, the drawer says **Whiteout can't see what this app sends.**

Prompts typed into Slack AI or Notion AI inside the desktop apps aren't checked yet. To have them checked, people can use Slack and Notion in a browser with the Whiteout extension.

---

## Grammarly and other AI writing extensions

AI writing extensions such as Grammarly, Sider, Monica and HARPA AI read what people type, and often the whole page, and send it to their own service. There's no AI composer and no send step that Whiteout could check, so **Whiteout can't see what these extensions send.** AI Footprint lists them, with the sites they can read, under [Third-party AI extensions](./ai-footprint/ai-browser-extensions.md).

You have three options:

1. **Allow them**, and allowlist them under **Manage** so they stop raising findings.
2. **Block them** with your browser's extension policy. See [Block AI extensions with your MDM](./ai-footprint/ai-browser-extensions.md#block-ai-extensions-with-your-mdm).
3. **Keep them off your sensitive sites** and let people use them everywhere else, with the setting below.

### Keep AI extensions off sensitive sites

The **Browser AI policy** setting, under **Integrations → Mobile Device Management (MDM)**, has a section **Keep AI extensions off sensitive sites**. In Chrome and Edge, the AI extensions you choose stop running on the sites you list and keep working everywhere else.

1. Under **Sensitive sites**, list the sites, one per line: a hostname such as `intranet.example.com`, or a whole domain such as `*.corp.example.com`. Don't include `https://`, a path or a port. You can list up to 100.
2. By default it applies to every third-party AI extension in Whiteout's catalog. To pick, turn on **Only some AI extensions** and choose them.
3. Choose **Save**.

From then on, Whiteout adds these entries to every MDM profile and script it generates: Intune, Jamf, Kandji, Mosyle, Workspace ONE and NinjaOne. Nothing changes on devices until you deploy a newly generated profile, and with no sites listed nothing is added.

It uses Chrome's and Edge's `ExtensionSettings` policy: for each chosen extension ID, Whiteout writes a `runtime_blocked_hosts` entry with your sites, so the browser keeps that extension off them.

```json
{
  "<extension id>": {
    "runtime_blocked_hosts": ["*://intranet.example.com", "*://*.corp.example.com"]
  }
}
```

- **Chrome and Edge only.** Firefox's extension policy has no per-site setting like this, so Firefox isn't covered.
- **`ExtensionSettings` is a single policy per browser.** If you already manage it for Chrome or Edge, merge these entries into yours rather than deploying a second profile, or the two will conflict. The NinjaOne script merges for you, and its rollback script removes only these entries.
- **Intune:** `intune-fanout.py` with `--browser-group` creates these profiles along with the browser profiles.
- **Apple MDMs:** the payload gains a **KEEP AI EXTENSIONS OFF SENSITIVE SITES (OPTIONAL)** section to upload as its own profiles.

This is the browsers' own extension setting, so test it on one device before rolling out: open `chrome://policy` or `edge://policy`, check `ExtensionSettings` shows your entries, and confirm the extension no longer runs on a listed site. See Chrome's and Edge's documentation for `ExtensionSettings` for the full behaviour.

> **Advanced: overriding the saved sites for one payload.** The payload and NinjaOne script API requests accept `ai_extension_blocked_hosts` (and optionally `ai_extensions`, as catalog keys such as `grammarly_extension`), which replace the saved sites for that one request. `intune-fanout.py --no-ai-extension-sites` skips these profiles for one run. Most organizations don't need this.

---

## What isn't covered yet

- **File uploads in Slack, Notion and Atlassian.** Files attached in these apps aren't checked yet, including files added in the AI panel.
- **Slack AI and Notion AI in the desktop apps.** Only the browser is checked.
- **What AI writing extensions send.** Whiteout lists them and what they can read, but can't see their traffic.
- **Other work apps' AI,** such as Salesforce Agentforce, Zoom AI Companion, ServiceNow, Canva, Figma and Adobe.
- **Browsers without the extension.** See [Browser coverage](./ai-footprint/browser-coverage.md).
