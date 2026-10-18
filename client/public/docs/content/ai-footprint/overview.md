# AI Footprint

AI Footprint shows the AI on your organization's devices and workloads: what is installed, what is running, what is sending traffic to AI services, and which AI websites and AI browser extensions people use. It includes AI that no Whiteout surface governs. That's how you find shadow AI: AI tools used outside your policies, whether by accident or to get around them.

Open it in the admin app under **Coverage → AI Footprint**.

> **AI Footprint never blocks anything.** It finds AI and reports it. Policy checks and blocking stay with Desktop Guard, the browser extension and the IDE extensions. A finding is a prompt for you to look, not an action Whiteout has taken.

AI Footprint is on for every organization. There is nothing to turn on.

---

## What AI Footprint shows

| | What it means | Where it comes from |
|---|---|---|
| **Installed** | AI software on a device: desktop apps, IDE extensions, AI command-line tools, local LLM runtimes such as Ollama or LM Studio, MCP servers in an AI tool's configuration, and [third-party AI browser extensions](./ai-footprint/ai-browser-extensions.md) | Desktop Guard scans each device every 8 hours and when you choose **Rescan**. Managed devices also report installed AI apps through your MDM connection. The infrastructure agent reports AI on servers and workloads. |
| **Running** | AI processes running now. They're found by what they do (an AI engine, a model file, an LLM server or AI traffic), not by their name, so renaming a tool doesn't hide it. | Desktop Guard's AI process sensor, on macOS and Windows |
| **Active** | Traffic from a device or workload to an AI service | Desktop Guard's network sensor on Windows, the infrastructure agent, and [DNS or proxy logs you import](./ai-footprint/network-logs.md) |
| **Web AI** | [AI websites](./ai-footprint/web-ai-sites.md) used in a browser | The Whiteout browser extension |
| **Built-in browser AI** | [AI built into the browser](./ai-footprint/built-in-browser-ai.md), such as Gemini in Chrome and Copilot in Edge, and whether it's on | Desktop Guard's browser profile scan, on macOS and Windows |
| **AI inside a work app** | [Slack AI, Notion AI and Atlassian Rovo](./ai-footprint/ai-in-work-apps.md) when they're used, and the Slack, Notion and Grammarly apps | The Whiteout browser extension, Desktop Guard and your MDM connection |
| **Signed in with a work account** | [AI apps people connected](./ai-footprint/connected-ai-apps.md) to their work account, such as meeting notetakers and ChatGPT or Claude connectors | A daily check of Google Workspace, Microsoft 365 and Okta |
| **Vendor audit logs** | AI use the [vendor recorded](./ai-footprint/vendor-audit-logs.md) in Microsoft 365 Copilot and Gemini in Google Workspace | The Microsoft 365 and Google Workspace audit logs you connect |

AI SDK packages and model weight files on disk are scanned only when your organization has that scan turned on. It is off by default. Contact support@groovysec.com to turn it on.

### Known and uncatalogued

Whiteout keeps a catalog of AI tools: apps, extensions, websites, CLIs, runtimes and AI service hosts.

- A **Known** chip means the catalog recognizes the tool.
- An **Unknown** chip means no catalog entry names it. Whiteout found it from what it looks like or what it does: an AI-style name, an LLM API on a local port, an AI engine or model loaded by a process, or an AI-style website. These are your uncatalogued **shadow AI tools**, counted in the **AI tools found** tile at the top of the page.
- **Built-in** and **Embedded** AI is the operating system's own AI, or AI inside a signed app from a known vendor. It is expected, governance doesn't apply to it, and it never raises a finding.
- **Built-in browser AI** is different: it's a browser's own AI assistant, and it raises a finding when it's used with nothing checking it. See [Built-in browser AI](./ai-footprint/built-in-browser-ai.md).

A single weak signal about an unknown tool stays in the inventory without raising a finding. See [Unknown tools](./ai-footprint/shadow-ai.md#unknown-tools).

### Governed and shadow

A tool is **governed** on a device when a Whiteout surface that covers it is live on that same device. For example, the ChatGPT desktop app is governed where Desktop Guard is running. ChatGPT in a browser is governed where the Whiteout browser extension is running in that browser. Coverage is judged per device: Desktop Guard on someone's laptop doesn't govern the AI on their other computer.

A tool with no covering surface live on the device is **ungoverned**. The **Not governed** column counts those devices.

---

## The tabs

| Tab | What's on it |
|---|---|
| **AI tools** | One row per tool: **Tool**, **Category**, **Provider**, **Devices**, **Not governed**, **Last active** and **Last seen**. A collapsible **Overview** above the list shows new AI tools per day and how many installs are governed. Click the device count to see every device and user the tool was found on, with the signals behind it and recent prompt activity where Whiteout records it. [Web AI](./ai-footprint/web-ai-sites.md) rows also show which [kinds of account](./ai-footprint/account-types.md) people used. |
| **Processes** | AI processes the sensor reported, in four views: **Needs attention**, **Named AI**, **Built-in & embedded** and **All**. Filter by platform, or show **Running now only**. Open a process to see its signer, path, AI engines, models, auto-start entries and file hashes. |
| **Network activity** | Hourly records of traffic to AI services: **Provider**, **Destination**, **Observer**, **Process**, **Device / source**, **Hour** and **Flows**. Imported logs appear here too, with the observer **Cisco Umbrella DNS log**, **Zscaler web log** or **Network log (CSV)**. |
| **Findings** | Ungoverned AI that needs a decision. See below. |
| **Catalog** | Tools your organization added to the catalog with **Add to catalog**. |

### Findings

Each finding is one tool (or one person, for imported logs) that needs a decision. Filter the list by status (**Open**, **Acknowledged**, **Resolved**, **All**) and by kind (**All**, **Installed**, **Running**, **Active**). Choose **Review** to see why it's a finding, the evidence, and a **Recommended action**.

| Finding | What it means | Guide |
|---|---|---|
| **Shadow AI — installed** | AI software is on a device where no Whiteout surface covers it | [Shadow AI findings](./ai-footprint/shadow-ai.md#installed) |
| **Shadow AI — running** | An uncatalogued AI process is running on a device | [Shadow AI findings](./ai-footprint/shadow-ai.md#running) |
| **Suspicious compute** | An untrusted program uses heavy compute with no proof of AI | [Shadow AI findings](./ai-footprint/shadow-ai.md#running) |
| **Shadow AI — active** | AI traffic from a source no Whiteout surface governs, including browsers or browser profiles without the extension | [Shadow AI findings](./ai-footprint/shadow-ai.md#active), [Browser coverage](./ai-footprint/browser-coverage.md) |
| **AI use with no Whiteout on any device** | Imported network logs show a known user using AI, with no live Whiteout surface on any of their devices | [Importing network logs](./ai-footprint/network-logs.md#ungoverned-usage) |
| **AI use by someone we can't match to a user** | Imported network logs show AI traffic from an identity that isn't a Whiteout user | [Importing network logs](./ai-footprint/network-logs.md#unknown-actor) |
| **Shadow AI — active**, for built-in browser AI | A browser's built-in AI, such as Gemini in Chrome, was used with nothing checking it | [Built-in browser AI](./ai-footprint/built-in-browser-ai.md#built-in-browser-ai-in-use) |
| **AI use with no Whiteout on any device**, seen only in a vendor's audit log | The vendor's own audit log shows AI use that no Whiteout device saw | [Vendor audit logs](./ai-footprint/vendor-audit-logs.md#seen-only-in-the-vendors-audit-log) |
| **Unapproved AI app connected** | Someone gave an AI app your organization hasn't approved access to company data, through their work account | [AI apps connected with work accounts](./ai-footprint/connected-ai-apps.md#unapproved-ai-app-connected) |
| **Personal account used** | Someone used an AI app with a personal account where your account rule allows work accounts only | [Account rules](./governance/account-rules.md#personal-account-used) |
| **Workspace not on your list** | Someone used an AI app with a work account in a workspace your account rule doesn't list | [Account rules](./governance/account-rules.md#workspace-not-on-your-list) |

The same list also shows **Custom app bypass** findings for [Custom AI Apps](./custom-ai-apps/monitoring-and-troubleshooting.md) and **Connector still connected** findings for the [Whiteout AI Connector](./whiteout-ai-connector/overview.md).

New findings raise the **Shadow AI detected** notification in **Alerts & Audit → Notifications**, and they're sent to your SOC/SIEM destinations.

---

## Filters

At the top of the page, four tiles summarize your footprint: **AI tools found** (known and unknown), **Not governed**, **Unknown AI running** and **Open findings**. Select a tile to jump to the list behind it.

On the **AI tools** tab, pick a group or person and search by name. Choose **Filters** for the rest:

| Filter | Options |
|---|---|
| Group and user | Any group or person in your organization |
| **Category** | Desktop app, IDE extension, Third-party AI extension, Web AI, Built-in browser AI, AI inside a work app, Signed in with a work account, Local LLM runtime, CLI, SDK dependency, Model file, MCP server, Custom AI App, AI process |
| **Provider** | The AI vendor behind the tool |
| **Governance** | **Not governed (any device)**, **Governed**, **Partially governed** (ungoverned on some devices), **Ungoverned**, **Not applicable (built-in or work app)** |
| **Type** | **All AI**, **Shadow AI (uncatalogued)**, **Known catalog**, **Built-in & embedded** |
| Search | Tool or provider name |

---

## Rescan

Desktop Guard scans for installed AI every 8 hours, and scans browser profiles every 15 minutes. To get fresh results sooner, choose **Rescan**. Every Desktop Guard rescans installed and running AI on its next check-in, within about 5 minutes.

---

## Manage: mute and allowlist

Choose **Manage** to open **Discovery settings**.

| Setting | What it does |
|---|---|
| **Muted categories** | No shadow AI findings are raised for a muted category. Its tools stay in the inventory. Besides the categories above, you can mute **Suspicious compute** and **Imported network logs**. |
| **Allowlisted tools** | Tools you've sanctioned but Whiteout doesn't govern never raise a finding, and open findings for them resolve. Add a catalog key (for example `ollama`), a footprint or evidence key, or the SHA-256 of an exact binary. See [what you can allowlist](./ai-footprint/shadow-ai.md#mute-allowlist-acknowledge-or-add-to-catalog). |
| **AI process sensor** | **Report running AI processes** and **Flag unexplained heavy compute** are on by default. You can also set how long inactive processes are kept and when a silent device counts as stale. |

---

## Add to catalog

When you know what an unknown tool is, open its finding, process or footprint row and choose **Add to catalog**. You give it a name, category and provider, and choose:

- **How to recognize it.** Options depend on what was found. They include **This signed app**, **This executable from this signer**, **This script or module**, **This exact binary (SHA-256)**, **Everything from this developer team**, **This app's bundle ID**, **Its launch command**, **Its process name or server banner**, **This site** (a website and its sub-domains) and **This exact identity**.
- **Tier.** **Named tool**: governance applies, so ungoverned use still raises findings. **Built-in & embedded (expected vendor AI)**: never raises findings.
- **Risk level.** **Standard** or **Elevated**. Elevated tools raise high-severity findings.
- **Governance.** Which Whiteout surface governs it, or **Recognize only (still flagged as ungoverned)**.
- **Also stop alerting on this tool (allowlist)**, if its use is sanctioned.

From then on the tool is recognized on every device, and it's listed on the **Catalog** tab. If Custom AI Apps is on for your organization, an unknown installed tool also offers **Register as custom app**. See [Custom AI Apps](./custom-ai-apps/overview.md).

---

## Network visibility

The **Network visibility** card shows, in one line, how many devices Desktop Guard can see browser AI traffic on. Choose **Show what to do** (or **Details**) for the per-device counts and the fixes. See [Network visibility](./ai-footprint/network-visibility.md).

**Import network logs** brings in Cisco Umbrella, Zscaler or other DNS and proxy logs to find AI use the endpoints can't show you. See [Importing network logs](./ai-footprint/network-logs.md).

---

## Who can do what

| Role | Can |
|---|---|
| Admin | Everything on this page |
| Read-only | View every tab and finding. Can't rescan, import logs, acknowledge findings, or change the catalog or settings. |

---

## Privacy

- **AI only.** Devices report only items that match the AI catalog or look like AI. Whiteout never collects a full software inventory, a full process list or a browsing history. Everything else is dropped on the device.
- **Metadata only.** Traffic records hold the AI host, the process, the hour and a count. AI Footprint never reads prompts, page content or files.
- **No credentials.** Whiteout never reads vendor passwords, tokens, cookies or session files.

---

## What AI Footprint does not see

These are AI Footprint's known blind spots. The first seven are also listed in the app under **What AI Footprint does not see**.

- **Root and SYSTEM processes, in detail.** Without the macOS sensor daemon or the Windows sensor service, processes running as root or SYSTEM show only their path, CPU and memory, static analysis and auto-start entries, not the models or libraries they load.
- **Very short jobs.** System-launched jobs that finish in under about 15 seconds can be missed.
- **Inside VMs and containers.** Docker Desktop, UTM, Lima, Parallels and WSL2 appear as the hypervisor. Only forwarded listeners and compute are attributed to them.
- **AI in a browser tab.** WebGPU or WebNN inference inside a web page is not seen by the process sensor.
- **Stripped engines with encrypted weights.** A stripped, statically linked engine that keeps encrypted weights in memory leaves no engine or model trace. Only the heavy-compute check applies.
- **Silenced devices.** Desktop Guard can be stopped or blocked, and device identity is reported by the device itself. Coverage shows those devices as silent, their findings stay open, and MDM remains the hard enforcement layer.
- **Which model is running.** Neural Engine and GPU counters measure how hard a process works, not which model it runs.
- **What's typed into AI panels built into browsers.** AI Footprint shows where Gemini in Chrome, Copilot in Edge, Brave Leo, Opera Aria and Firefox's chatbot are on, but Whiteout doesn't check prompts typed into them yet. See [Built-in browser AI](./ai-footprint/built-in-browser-ai.md).
- **AI in other SaaS apps.** Slack AI, Notion AI and Atlassian Rovo are checked in the browser. Their desktop apps, file uploads in those apps, and AI in other SaaS apps such as Zoom or Salesforce are not. See [AI inside work apps](./ai-footprint/ai-in-work-apps.md).
- **Network traffic on Macs.** Desktop Guard doesn't observe network traffic on macOS yet, so Macs don't raise **Shadow AI — active** findings. Browser coverage on Macs comes from the extension and the profile scan. See [Network visibility](./ai-footprint/network-visibility.md#not-observed).
- **Browser traffic Desktop Guard can't see.** On Windows, browsers that resolve names themselves, or send traffic through a secure web gateway, hide their AI traffic from the device. See [Network visibility](./ai-footprint/network-visibility.md).
- **Some browsers in the profile scan.** Safari isn't scanned, Opera's side profiles aren't scanned, and Aside isn't scanned on Windows. See [Browser coverage](./ai-footprint/browser-coverage.md).
- **Devices without Whiteout.** A personal phone or an unmanaged laptop shows up only in [imported network logs](./ai-footprint/network-logs.md), and only while it uses your network.

---

## Versions

Most of AI Footprint works with any current Desktop Guard. The newest parts need:

| Feature | Version |
|---|---|
| Third-party AI extensions, per-browser findings, network visibility | Desktop Guard 1.8.106 or later (macOS and Windows) |
| Browser profile scan | Desktop Guard 1.8.51 or later |
| AI-site visits and account types | Browser extension 1.14.0 or later |
| Web AI, account types and network-log import in the admin app | Admin app 2.87.0 or later |
| Network visibility card | Admin app 2.88.0 or later |
