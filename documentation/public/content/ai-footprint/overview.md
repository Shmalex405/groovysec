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

AI SDK packages and model weight files on disk are scanned only when your organization has that scan turned on. It is off by default. Contact support@groovysec.com to turn it on.

### Known and uncatalogued

Whiteout keeps a catalog of AI tools: apps, extensions, websites, CLIs, runtimes and AI service hosts.

- A **Known** chip means the catalog recognizes the tool.
- An **unknown** chip means no catalog entry names it. Whiteout found it from what it looks like or what it does: an AI-style name, an LLM API on a local port, an AI engine or model loaded by a process, or an AI-style website. These are your uncatalogued **shadow AI tools**, counted in the chip at the top of the page.
- **Built-in** and **Embedded** AI is the operating system's own AI, or AI inside a signed app from a known vendor. It is expected, governance doesn't apply to it, and it never raises a finding.

A single weak signal about an unknown tool stays in the inventory without raising a finding. See [Unknown tools](./ai-footprint/shadow-ai.md#unknown-tools).

### Governed and shadow

A tool is **governed** on a device when a Whiteout surface that covers it is live on that same device. For example, the ChatGPT desktop app is governed where Desktop Guard is running. ChatGPT in a browser is governed where the Whiteout browser extension is running in that browser. Coverage is judged per device: Desktop Guard on someone's laptop doesn't govern the AI on their other computer.

A tool with no covering surface live on the device is **ungoverned**. The **Ungoverned** column counts those devices.

---

## The tabs

| Tab | What's on it |
|---|---|
| **Footprint** | One row per tool: **Tool**, **Category**, **Provider**, **Devices**, **Ungoverned**, **Last active** and **Last seen**. Click the device count to see every device and user the tool was found on, with the signals behind it and recent prompt activity where Whiteout records it. [Web AI](./ai-footprint/web-ai-sites.md) rows also show which [kinds of account](./ai-footprint/account-types.md) people used. |
| **Processes** | AI processes the sensor reported, in four views: **Needs attention**, **Named AI**, **Built-in & embedded** and **All**. Filter by platform, or show **Running now only**. Open a process to see its signer, path, AI engines, models, auto-start entries and file hashes. |
| **Egress** | Hourly records of traffic to AI services: **Provider**, **Destination**, **Observer**, **Process**, **Device / source**, **Hour** and **Flows**. Imported logs appear here too, with the observer **Cisco Umbrella DNS log**, **Zscaler web log** or **Network log (CSV)**. |
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

The same list also shows **Custom app bypass** findings for [Custom AI Apps](./custom-ai-apps/monitoring-and-troubleshooting.md) and **Connector still connected** findings for the [Whiteout AI Connector](./whiteout-ai-connector/overview.md).

New findings raise the **Shadow AI detected** notification in **Alerts & Audit → Notifications**, and they're sent to your SOC/SIEM destinations.

---

## Filters

Above the tabs, chips summarize what needs attention: **unknown AI processes running**, **shadow AI tools (uncatalogued)** and **actively talking out** (tools seen sending AI traffic from an ungoverned source). Click a chip to filter.

On the **Footprint** tab you can filter by:

| Filter | Options |
|---|---|
| Group and user | Any group or person in your organization |
| **Category** | Desktop app, IDE extension, Third-party AI extension, Web AI, Local LLM runtime, CLI, SDK dependency, Model file, MCP server, Custom AI App, AI process |
| **Provider** | The AI vendor behind the tool |
| **Governance** | **Governed**, **Partially governed** (ungoverned on some devices), **Ungoverned**, **Not applicable (built-in)** |
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

The **Network visibility** card shows, per device, whether Desktop Guard can see browser AI traffic, and what to do when it can't. See [Network visibility](./ai-footprint/network-visibility.md).

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
- **AI panels built into browsers.** The Copilot sidebar in Edge, Gemini in Chrome and Leo in Brave are not covered.
- **AI built into other SaaS apps.** AI features inside apps such as Notion and Slack are not covered.
- **Blocking by account type.** Whiteout detects whether a prompt came from a personal or a work account on supported AI sites, but it can't block or allow by account type yet. See [Personal and work accounts](./ai-footprint/account-types.md).
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
