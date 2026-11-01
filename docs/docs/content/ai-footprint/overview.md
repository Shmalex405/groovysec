# AI Footprint

AI Footprint shows the AI on your organization's devices and workloads: what is installed, what is running, what is sending traffic to AI services, and which AI websites and AI browser extensions people use. It includes AI that no Whiteout surface governs. That's how you find shadow AI: AI tools used outside your policies, whether by accident or to get around them.

Open it in the admin app under **Coverage → AI Footprint**.

> **Finding AI doesn't block it.** AI Footprint finds AI and reports it. Policy checks and blocking stay with Desktop Guard, the browser extension and the IDE extensions. A finding is a prompt for you to look, not an action Whiteout has taken. The one setting on this page that can block anything is the [MCP allowlist](./ai-footprint/overview.md#mcp-allowlist), and only when you set it to **Enforce**.

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

## The page

At the top of the page:

- **Rescan**, **Export AI-BOM**, **Settings** and **Help**. See [Rescan](./ai-footprint/overview.md#rescan), [Export AI-BOM](./ai-footprint/overview.md#export-ai-bom) and [Settings](./ai-footprint/overview.md#settings). **Help** opens this guide in a side panel, and lists **What AI Footprint does not see**.
- Two tiles. **AI tools found** counts every tool, known and unknown. **Needs review** counts open findings plus open known vulnerabilities, and says how many are critical or high. Select a tile to open the list behind it.

Below the tiles, AI Footprint has three areas:

| Area | Answers | What's in it |
|---|---|---|
| **Inventory** | What AI do we have? | Every AI tool found, with the evidence behind it, by tool, person or device. Also the processes, network traffic and MCP servers behind those tools. |
| **Review** | What needs a decision? | Findings and known vulnerabilities in one queue, with saved views and bulk actions. See [Review and triage](./ai-footprint/review-and-triage.md). |
| **Controls** | What have we set? | **Exceptions** (muted categories and allowlisted tools), the **MCP allowlist**, and your organization's **Catalog**. |

The group or person you pick in Inventory or Review applies to both. Links from notifications, SOC alerts and other pages still open the right area. If you used the older tabs, see [Where things moved](./ai-footprint/overview.md#where-things-moved).

---

## Inventory

**View**, at the top of Inventory, switches between four views:

| View | What's on it |
|---|---|
| **Tools** | One row per AI tool. Inventory opens here. See below. |
| **Processes** | AI processes the sensor reported, in four groups: **Needs attention**, **Named AI**, **Built-in & embedded** and **All**. Filter by platform, or show **Running now only**. Open a process to see its signer, path, AI engines, models, auto-start entries and file hashes. When unknown AI is running, the button says so, for example **Processes · 2 unknown**. |
| **Network** | The [Network visibility](./ai-footprint/network-visibility.md) card, **Import network logs**, and hourly records of traffic to AI services: **Provider**, **Destination**, **Observer**, **Process**, **Device / source**, **Seen** and **Flows**. Imported logs appear here too, with the observer **Cisco Umbrella DNS log**, **Zscaler web log** or **Network log (CSV)**. |
| **MCP servers** | MCP servers configured in AI tools on your devices: what each one runs, how many devices and people have it, and **Approve** to add it to the [MCP allowlist](./ai-footprint/overview.md#mcp-allowlist). |

### Tools, People and Devices

The **Tools**, **People** and **Devices** switch picks what each row is:

- **Tools.** One row per AI tool. This is the main table.
- **People.** One row per person: how many AI tools they use (the first few by name), their devices, how many of their tools aren't governed, and when they were last active and last seen. Select a person to see their tools. Shared workloads with no person aren't listed.
- **Devices.** One row per device, with its AI tools, its people and the same counts. Desktop Guard and the browser extension on the same computer count as one device. Work-account sign-ins aren't listed, because they aren't on a device.

### The tools table

| Column | What it shows |
|---|---|
| **Tool** | The name and a **Known** or **Unknown** chip. **Active** means the tool sent traffic from an ungoverned source. A vulnerability chip means some devices run a version with a published advisory: select it to see the advisories in Review. Under the name are the provider and category, and, on [Web AI](./ai-footprint/web-ai-sites.md) rows, which [kinds of account](./ai-footprint/account-types.md) people used. |
| **Devices** | How many devices have the tool. Select the number to see every device and user it was found on, with the signals behind it and recent prompt activity where Whiteout records it. |
| **Not governed** | Devices where no Whiteout surface covers the tool. Select the number to see which. Built-in AI shows **Built-in**, work apps show **Work app**, and built-in browser AI that's switched off shows **Off**. |
| **Evidence** | Where the tool was seen. See the chips below. |
| **Last active** | When the AI process sensor last saw it running, and on how many devices it's running now |
| **Last seen** | When any source last reported it |

Select a column header to sort by it, and select it again to reverse. Pages hold 25, 50 or 100 rows. Above the table, a collapsible **Overview** shows new AI tools per day and how many installs are governed, and a one-line **Network visibility** status opens the **Network** view.

### Search and filters

Pick a group or a person, and search by tool or provider name. In **People** and **Devices**, search also matches emails and device names. Choose **Filters** for the rest:

| Filter | Options |
|---|---|
| **Category** | Desktop app, IDE extension, Third-party AI extension, Web AI, Built-in browser AI, AI inside a work app, Signed in with a work account, Local LLM runtime, CLI, SDK dependency, Model file, MCP server, Custom AI App, AI process |
| **Provider** | The AI vendor behind the tool |
| **Governance** | **Not governed (any device)**, **Governed**, **Partially governed** (ungoverned on some devices), **Ungoverned**, **Not applicable (built-in or work app)** |
| **Type** | **All AI**, **Shadow AI (uncatalogued)**, **Known catalog**, **Built-in & embedded** |

Each filter you set shows as a chip. Remove it there, or choose **Clear all**.

The **Evidence** chips under the search filter by where a tool was seen. Each chip shows how many tools have that evidence. Pick several to see tools with any of them; **Any evidence** clears them.

| Chip | Means |
|---|---|
| **Installed** | Found installed on a device: an app, CLI, runtime, package, model file or extension |
| **Running** | Seen running by the AI process sensor. When unknown AI is running, the chip also says how many, for example **Running 12 · 2 unknown**. |
| **Network** | Seen in AI traffic: an AI website, or traffic to its provider from an ungoverned source |
| **MCP** | An MCP server configured on a device |
| **Extensions** | A browser or IDE extension |
| **Sign-ins** | Signed in to with a work or personal account |
| **Vulnerable** | On a device that runs a version with a published advisory |

In **People** and **Devices** the chips still filter, but don't show counts.

### Allowlist several tools

Tick the tools in the table, choose **Allowlist** in the bar that appears, and type `allowlist` to confirm. Allowlisted tools are sanctioned but not governed: their open findings resolve and they raise no new ones. You can remove them later under **Controls → Exceptions**.

---

## Review

**Review** is the queue of everything that needs a decision: findings and known vulnerabilities, most severe first. You can filter it, save the views you use, and acknowledge, mute, snooze or reopen findings one at a time from their drawer, or many at once. See [Review and triage](./ai-footprint/review-and-triage.md).

For what each kind of finding means and what to do about it, see [Shadow AI findings](./ai-footprint/shadow-ai.md).

---

## Controls

**Controls** lists its sections on the left: **Exceptions**, **MCP allowlist** and **Catalog**.

### Exceptions

What AI Footprint never raises a finding for.

| Setting | What it does |
|---|---|
| **Muted categories** | No shadow AI findings are raised for a muted category. Its tools stay in the inventory. Besides the categories above, you can mute **Suspicious compute** and **Imported network logs**. |
| **Allowlisted tools** | Tools you've sanctioned but Whiteout doesn't govern never raise a finding, and open findings for them resolve. Add a catalog key (for example `ollama`), a footprint or evidence key, or the SHA-256 of an exact binary. See [what you can allowlist](./ai-footprint/shadow-ai.md#mute-allowlist-acknowledge-or-add-to-catalog). |

Choose **Save exceptions** to apply your changes, or **Discard changes**.

Muting a category is not the same as muting a finding. A muted category stops findings for that whole category. **Mute** in Review acts only on the findings you choose. See [Mute a finding or mute a category](./ai-footprint/review-and-triage.md#mute-a-finding-or-mute-a-category).

### MCP allowlist

The MCP allowlist controls which MCP servers AI assistants may call. You approve a server by what it runs (its npm or PyPI package, container image, program or remote host), not by its name in an MCP config, so renaming a server doesn't get around the list. Whiteout's own AI connector is always allowed. The Whiteout hooks in Claude Code, Codex and Cursor check the list.

| Mode | What happens |
|---|---|
| **Off** | Any MCP server can run. Discovered servers are still listed. |
| **Shadow** | Nothing is blocked. Calls to servers that aren't approved are recorded as "would be denied", so you can see what **Enforce** would stop. |
| **Enforce** | Calls to servers that aren't approved are blocked in Claude Code, Codex and Cursor, and so are servers Whiteout can't identify. Changes reach devices within about 5 minutes. |

Start with **Shadow**. Before **Enforce** turns on, Whiteout lists the discovered servers that aren't approved yet. If your organization is in audit-only mode, **Enforce** runs as **Shadow** and blocks nothing.

To approve a server, choose **Approve** on it under **Inventory → MCP servers**. Or choose **Add server** and approve it by **Package, image, program or host**, **Launch command** or **Server URL**. **Remove** takes a server off the list.

The same section holds the **Desktop MCP gateway**. It routes the local MCP servers configured in the Claude desktop app through Whiteout, so each tool call gets the same checks a coding agent's does. Turning it on edits the app's MCP settings on each computer, and people are asked to restart the app. It has its own **Off**, **Shadow** and **Enforce** setting, and **Desktop MCP gateway coverage** shows how each device is doing.

### Catalog

Your organization's own catalog entries, added with [Add to catalog](./ai-footprint/overview.md#add-to-catalog): **Name**, **Category**, **Provider**, **Risk** and **Governance**. **Remove** deletes an entry. Entries for [Custom AI Apps](./custom-ai-apps/overview.md) are managed from the app itself.

---

## Rescan

Desktop Guard scans for installed AI every 8 hours, and scans browser profiles every 15 minutes. To get fresh results sooner, choose **Rescan**. Every Desktop Guard rescans installed and running AI on its next check-in, within about 5 minutes. To rescan one device, open one of its processes and choose **Rescan this device**.

---

## Export AI-BOM

**Export AI-BOM** downloads a CycloneDX 1.6 AI bill of materials: AI apps, local models, MCP servers, extensions, SDKs, AI-vendor OAuth grants and known vulnerabilities. It covers your whole organization, or the group you picked.

- **Counts only** gives the device count for each component, with no users or devices.
- **With device detail** adds each device and its user. Only admins can choose it.

---

## Settings

**Settings** opens **AI Footprint settings**:

| Setting | What it does |
|---|---|
| **Import network logs** | Brings in Cisco Umbrella, Zscaler or other DNS and proxy logs to find AI use the endpoints can't show you. See [Importing network logs](./ai-footprint/network-logs.md). |
| **Report running AI processes** | The AI process sensor. On by default. |
| **Flag unexplained heavy compute** | Raises a **Suspicious compute** finding for untrusted programs with sustained heavy CPU or memory use and no proof of AI. On by default. |
| **Keep inactive processes (days)** | How long a process that stopped running is kept |
| **Mark devices stale after (days)** | How long without a Desktop Guard check-in before a device counts as stale |

Muted categories and allowlisted tools are under **Controls → Exceptions**. **Open Exceptions** takes you there.

---

## Add to catalog

When you know what an unknown tool is, open its finding, process or footprint row and choose **Add to catalog**. You give it a name, category and provider, and choose:

- **How to recognize it.** Options depend on what was found. They include **This signed app**, **This executable from this signer**, **This script or module**, **This exact binary (SHA-256)**, **Everything from this developer team**, **This app's bundle ID**, **Its launch command**, **Its process name or server banner**, **This site** (a website and its sub-domains) and **This exact identity**.
- **Tier.** **Named tool**: governance applies, so ungoverned use still raises findings. **Built-in & embedded (expected vendor AI)**: never raises findings.
- **Risk level.** **Standard** or **Elevated**. Elevated tools raise high-severity findings.
- **Governance.** Which Whiteout surface governs it, or **Recognize only (still flagged as ungoverned)**.
- **Also stop alerting on this tool (allowlist)**, if its use is sanctioned.

From then on the tool is recognized on every device, and it's listed under **Controls → Catalog**. If Custom AI Apps is on for your organization, an unknown installed tool also offers **Register as custom app**. See [Custom AI Apps](./custom-ai-apps/overview.md).

---

## Where things moved

AI Footprint used to have seven tabs and a **Manage** dialog. Here is where each part is now.

| Before | Now |
|---|---|
| **AI tools** tab | **Inventory**, view **Tools** |
| **Processes** tab | **Inventory**, view **Processes** |
| **Network activity** tab, and the **Network visibility** card at the top of the page | **Inventory**, view **Network** |
| **Findings** tab | **Review** |
| **Known vulnerabilities** tab | **Review**, finding type **Known vulnerability** |
| **MCP servers** tab | Discovered servers: **Inventory**, view **MCP servers**. Mode, approved servers and the desktop MCP gateway: **Controls → MCP allowlist** |
| **Catalog** tab | **Controls → Catalog** |
| **Manage**: muted categories and allowlisted tools | **Controls → Exceptions** |
| **Manage**: AI process sensor | **Settings** |
| **Import network logs** | **Settings**, or **Inventory → Network** |
| Help icon and **What AI Footprint does not see** | **Help** |
| **Not governed** tile | The **Governance** filter and the **Not governed** column |
| **Unknown AI running** tile | The **Running** chip and the **Processes** view |
| **Open findings** tile | **Needs review** |

---

## Who can do what

| Role | Can |
|---|---|
| Admin | Everything on this page |
| Read-only | View every area, finding and known vulnerability, open saved views, and export the AI-BOM with **Counts only**. Can't rescan, import logs, select rows, acknowledge, mute, snooze or reopen findings, save views, or change exceptions, the MCP allowlist, the catalog or settings. |

---

## Privacy

- **AI only.** Devices report only items that match the AI catalog or look like AI. Whiteout never collects a full software inventory, a full process list or a browsing history. Everything else is dropped on the device.
- **Metadata only.** Traffic records hold the AI host, the process, the hour and a count. AI Footprint never reads prompts, page content or files.
- **No credentials.** Whiteout never reads vendor passwords, tokens, cookies or session files.

---

## What AI Footprint does not see

These are AI Footprint's known blind spots. The first seven are also listed in the app under **Help → What AI Footprint does not see**.

- **Root and SYSTEM processes, in detail.** Without the macOS sensor daemon or the Windows sensor service, processes running as root or SYSTEM show only their path, CPU and memory, static analysis and auto-start entries, not the models or libraries they load.
- **Very short jobs.** System-launched jobs that finish in under about 15 seconds can be missed.
- **Inside VMs and containers.** Docker Desktop, UTM, Lima, Parallels and WSL2 appear as the hypervisor. Only forwarded listeners and compute are attributed to them.
- **AI in a browser tab.** WebGPU or WebNN inference inside a web page is not seen by the process sensor.
- **Stripped engines with encrypted weights.** A stripped, statically linked engine that keeps encrypted weights in memory leaves no engine or model trace. Only the heavy-compute check applies.
- **Silenced devices.** Desktop Guard can be stopped or blocked, and device identity is reported by the device itself. Coverage shows those devices as silent, their findings stay open, and MDM remains the hard enforcement layer.
- **Which model is running.** Neural Engine and GPU counters measure how hard a process works, not which model it runs.
- **What's typed into most AI panels built into browsers.** AI Footprint shows where Gemini in Chrome, Copilot in Edge, Brave Leo, Opera Aria and Firefox's chatbot are on. Desktop Guard checks prompts in Copilot in Edge on Windows. The others, and Copilot in Edge on macOS, aren't checked yet. See [Built-in browser AI](./ai-footprint/built-in-browser-ai.md).
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
| Inventory, Review and Controls; the evidence chips; saved views; bulk **Acknowledge** and **Allowlist** | Admin app 2.98.0 or later |
| **Mute**, **Snooze** and **Reopen**; the **People** and **Devices** views; views shared with other admins | Admin app 2.98.0 or later, with the platform update released alongside it. Until your deployment has that update, the app hides them and keeps the views you save on your computer. |
| Third-party AI extensions, per-browser findings, network visibility | Desktop Guard 1.8.106 or later (macOS and Windows) |
| Browser profile scan | Desktop Guard 1.8.51 or later |
| AI-site visits and account types | Browser extension 1.14.0 or later |
| Web AI, account types and network-log import in the admin app | Admin app 2.87.0 or later |
| Network visibility card | Admin app 2.88.0 or later |
