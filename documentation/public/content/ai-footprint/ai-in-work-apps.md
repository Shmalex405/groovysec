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

To check these composers, the extension needs access to the Slack, Notion and Atlassian sites listed above.

- **Extension force-installed through MDM:** the browser grants the access silently when the extension updates. Nobody sees a prompt.
- **Extension installed by the person:** when the extension updates, the browser asks them once to approve the new site access. Until they approve it, the browser can keep the extension turned off or on its previous version, so prompts in that browser may not be checked. Let people know before the update, or force-install the extension through MDM (see [Force-install the extension](./ai-footprint/browser-coverage.md#force-install-the-extension)).

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
3. **Keep them off your sensitive sites** and let people use them everywhere else, with the recipe below.

### Keep AI extensions off sensitive sites

Whiteout's MDM deployment payload has an optional block, **Keep AI extensions off sensitive sites (optional)**. You list the sites, and choose which AI extensions it applies to. By default it covers every third-party AI extension in Whiteout's catalog.

It uses Chrome's and Edge's `ExtensionSettings` policy: for each chosen extension ID, Whiteout writes a `runtime_blocked_hosts` entry with your sites, so the browser keeps that extension off them. The extension keeps working on every other site.

```json
{
  "<extension id>": {
    "runtime_blocked_hosts": ["*://intranet.example.com", "*://*.corp.example.com"]
  }
}
```

- **Sites** are hostnames, such as `intranet.example.com`, or a whole domain, such as `*.corp.example.com`. Don't include `https://`, a path or a port. Whiteout covers every scheme for each site. You can list up to 100.
- **Extensions** are catalog keys, such as `grammarly_extension`. The finding's **Tool** column shows the key.
- **Chrome and Edge only.** Firefox's extension policy has no per-site setting like this, so Firefox isn't covered.
- **`ExtensionSettings` is a single policy per browser.** If you already manage it for Chrome or Edge, merge these entries into yours rather than deploying a second profile, or the two will conflict. The NinjaOne script merges for you.

This is the browsers' own extension setting, so test it on one device before rolling out: open `chrome://policy` or `edge://policy`, check `ExtensionSettings` shows your entries, and confirm the extension no longer runs on a listed site. See Chrome's and Edge's documentation for `ExtensionSettings` for the full behaviour.

**Generating it.** The block has profiles only when you generate the payload with your sites:

| MDM | How |
|---|---|
| **Intune** | Generate the payload with `ai_extension_blocked_hosts` (and optionally `ai_extensions`), then run `intune-fanout.py` with `--ai-extension-sites` and `--browser-group` |
| **Jamf, Kandji, Mosyle, Workspace ONE** | Generate the payload with `ai_extension_blocked_hosts`. It gains a **KEEP AI EXTENSIONS OFF SENSITIVE SITES (OPTIONAL)** section to upload as its own profiles. |
| **NinjaOne** | Generate the deployment script with `ai_extension_blocked_hosts`. The script merges the entries into any `ExtensionSettings` already on the device, and the matching rollback script removes them. |

For example, for Intune:

```bash
curl -G -H "Authorization: Bearer $ADMIN_TOKEN" \
  -o intune-payload.json \
  --data-urlencode "ai_extension_blocked_hosts=intranet.example.com,*.corp.example.com" \
  "https://api.whiteout.groovysec.com/mdm/integrations/$INTEGRATION_ID/intune-payload"
```

For an Apple MDM, use `jamf-payload` (Jamf) or `apple-profile-payload` (Kandji, Mosyle, Workspace ONE) in place of `intune-payload`. For NinjaOne, add the same parameter to the `ninjaone-script` request shown in [Built-in browser AI](./ai-footprint/built-in-browser-ai.md#deploying-it). See [Zero-Touch MDM](./deployment/zero-touch-mdm.md) for the rest of the payload steps.

---

## What isn't covered yet

- **File uploads in Slack, Notion and Atlassian.** Files attached in these apps aren't checked yet, including files added in the AI panel.
- **Slack AI and Notion AI in the desktop apps.** Only the browser is checked.
- **What AI writing extensions send.** Whiteout lists them and what they can read, but can't see their traffic.
- **Other work apps' AI,** such as Salesforce Agentforce, Zoom AI Companion, ServiceNow, Canva, Figma and Adobe.
- **Browsers without the extension.** See [Browser coverage](./ai-footprint/browser-coverage.md).
