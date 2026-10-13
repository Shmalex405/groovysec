# Shadow AI Findings

A shadow AI finding means AI is installed, running or sending traffic on a device where no Whiteout surface governs it. Anything sent through that AI skips your policies. This page explains each kind of finding, how serious it is, and what to do about it.

Findings are on the **Findings** tab of **Coverage → AI Footprint**. The **Installed**, **Running** and **Active** filters match the sections below.

> **A finding never blocks anything.** Whiteout reports the AI. What happens next is your decision: bring it under Whiteout, sanction it, or remove it.

---

## How findings work

- **One finding per tool, per device.** Seeing the same tool again updates **Days** and **Last seen** rather than opening a new finding. Findings that look identical (same type, same person or device, same tool) are shown as one row with a **×N** chip, and acknowledging that row resolves all of them.
- **Status.** A finding is **open** until you **acknowledge** it (you've reviewed it, with a note) or it **resolves** by itself. It resolves when the tool is no longer found, when a Whiteout surface starts governing it, or when you allowlist it.
- **Alerts.** A new finding raises the **Shadow AI detected** notification in **Alerts & Audit → Notifications** and is sent to your SOC/SIEM destinations. A finding that flaps open and closed doesn't alert again unless it had been resolved for at least 24 hours.
- **Review.** Choose **Review** on a finding to see a plain-language reason, the evidence, and a **Recommended action**.

### Severity

Whiteout sets each finding's severity from the facts in it. The first matching row wins.

| Severity | When |
|---|---|
| **Critical** | AI traffic from an ungoverned source, seen on 3 or more days. A process that claims to be a catalogued AI tool but is signed by someone else. An unknown, untrusted AI process that also starts automatically, runs from a suspicious location, serves an LLM to the network or sends AI traffic. |
| **High** | AI traffic from an ungoverned source, seen on fewer than 3 days. An installed AI tool no catalog names. An AI browser extension that can read every site. An ungoverned local LLM runtime or MCP server. A catalogued tool with **Elevated** risk. An unknown AI process that is unsigned or untrusted, or that serves an LLM to the network. Suspicious compute from a program that starts automatically. |
| **Medium** | A catalogued tool with standard risk, installed where nothing governs it. An unknown AI process from a trusted, signed developer. Other suspicious compute. |
| **Low** | A catalogued tool marked low risk. |

---

## Installed

**Shadow AI — installed** means AI software is on a device and no Whiteout surface that covers it is live on that device.

| Category | Typical examples | What to check |
|---|---|---|
| **Desktop app** | An AI chat app, an AI meeting assistant | Is Desktop Guard enrolled and running on this device? |
| **IDE extension** | An AI coding assistant in VS Code or a JetBrains IDE | Is the Whiteout IDE extension installed and active? |
| **CLI** | An AI command-line tool | Should this tool be sanctioned and governed? |
| **Local LLM runtime** | Ollama, LM Studio, llama.cpp server | Local models can process any data with no policy check. Enroll the device, or remove the runtime. |
| **MCP server** | A server configured in Claude Desktop, Cursor or Claude Code | What does the server connect to? Is the device enrolled? |
| **Third-party AI extension** | Grammarly, Sider, Monica | See [Third-party AI extensions](./ai-footprint/ai-browser-extensions.md). |
| **Web AI** | An AI website the extension doesn't govern | See [Web AI sites](./ai-footprint/web-ai-sites.md). |
| **SDK dependency**, **Model file** | An AI SDK in a project, model weights on disk | Raised only when another signal from the same device backs it up. |

**Why it matters.** If no Whiteout surface governs the tool, nothing sent through it is checked. For a tool Whiteout normally governs, such as the ChatGPT desktop app, the drawer says which surface governs it (**Normally governed by Desktop Guard**). The finding then means that surface isn't live on this device: Desktop Guard isn't installed, isn't running, or has protection paused. That's a coverage problem, not an unknown tool.

**What to do:**

1. **If Whiteout normally governs the tool,** check the device under **Coverage → Enrollment** or **People → Devices**, and get Desktop Guard or the IDE extension running there.
2. **If its use is sanctioned,** allowlist it.
3. **If it isn't approved,** remove it from the device, or block it with your MDM.
4. **If it's unknown and you know what it is,** choose **Add to catalog** to name it.
5. **Acknowledge the finding** with a note, for example *Sanctioned for the data team, tracked in JIRA-1234*.

The finding resolves by itself after the next full scan once the tool is gone or governed.

---

## Running

**Shadow AI — running** means Desktop Guard's AI process sensor found an AI process running on the device that no catalog entry names and no Whiteout surface governs. It was found by what it does (its AI engine, its models, an LLM server or AI traffic), not by its name.

Two related findings come from the same sensor:

- **Suspicious compute.** An untrusted or out-of-place program has used a lot of CPU or memory for a sustained period but shows no AI engine, model or AI traffic. Disguised local inference and cryptominers both look like this.
- **Impersonation.** A process claims to be a catalogued AI tool but is signed by a different developer, or not signed at all. The finding is marked **Impersonates** and is critical.

**Why it matters.** A running AI process with no Whiteout coverage can handle any data on the device. A process that hides its identity or runs from an odd location deserves a closer look.

**What to do:**

1. Choose **View process details and IOCs** and review the signer, path, AI engines, models and auto-start entries.
2. **If it's sanctioned,** allowlist it, or choose **Add to catalog** and match it by its signed app or signer so it's recognized everywhere.
3. **If it isn't approved,** remove it from the device.
4. **For impersonation,** treat the device as potentially compromised: isolate it, collect the binary (its SHA-256 is in the evidence) and investigate.

Built-in AI (the operating system's own) and embedded AI (inside a signed vendor app) never raise these findings. To stop the sensor's findings altogether, turn off **Report running AI processes** or **Flag unexplained heavy compute** under **Manage**.

---

## Active

**Shadow AI — active** means a device or workload sent traffic to an AI provider, and no Whiteout surface that covers that traffic is live there. It's the strongest signal: data is actually leaving.

The traffic comes from Desktop Guard's network sensor on Windows and from the infrastructure agent. Rows on the **AI tools** tab with this traffic show an **Active** chip. Imported network logs raise their own findings instead. See [Importing network logs](./ai-footprint/network-logs.md).

Whiteout judges the traffic by the process that sent it:

| The traffic came from | It counts as governed when |
|---|---|
| **A browser** | The Whiteout extension runs in that browser on that device, and every profile of it used in the last 14 days has the extension turned on. Otherwise the finding names the browser and the reason. See [Browser coverage](./ai-footprint/browser-coverage.md). |
| **A catalogued app** | The Whiteout surface that governs that app is live on the device |
| **A process Whiteout can't identify** | Any Whiteout surface is live on the device |

The evidence lists the provider, the AI hosts, what observed the traffic, and the number of connections. A finding covers traffic from the last 7 days. It becomes critical once it has been seen on 3 or more days, and it resolves when there has been no ungoverned traffic for 7 days.

If the device's browser traffic isn't fully visible to Desktop Guard, the drawer says so in one line, because the findings for that device may be incomplete. See [Network visibility](./ai-footprint/network-visibility.md).

**What to do:**

1. Enroll the device, or check why its Whiteout surface isn't live.
2. For a browser, follow the fix in [Browser coverage](./ai-footprint/browser-coverage.md).
3. If the use is sanctioned, allowlist the provider (for example `openai`) or the host (for example `api.openai.com`).

---

## Unknown tools

An **unknown** tool is one no catalog entry names. Whiteout finds it from what it looks like or what it does:

- a desktop app or extension with an AI-style name
- a local port that answers like an LLM API
- a process that loads an AI engine or model
- a website that looks like an AI site (see [Web AI sites](./ai-footprint/web-ai-sites.md#unknown-sites))

Unknown tools are shown with an **Unknown** chip, and the **Shadow AI (uncatalogued)** type filter lists them.

**One weak signal isn't enough.** A hint like an AI-style name can be wrong, so an unknown tool found by one weak signal stays in the inventory and doesn't raise a finding. It becomes a finding when another signal from the same device backs it up, for example AI traffic from that device, or an AI tool or process on it that Whiteout is confident about. SDK dependencies and model files always need that second signal.

Once an unknown tool does raise a finding, the finding is **high** severity, because Whiteout can't even name the tool.

**What to do:** if you know what it is, choose **Add to catalog**. You can name it, say how to recognize it, mark it as governed or **Recognize only**, set its risk, and allowlist it in the same step. From then on it shows as **Known** on every device. See [Add to catalog](./ai-footprint/overview.md#add-to-catalog).

---

## Mute, allowlist, acknowledge or add to catalog

| Action | Effect | Use it when |
|---|---|---|
| **Acknowledge finding** | Marks the finding as reviewed, with your note. It moves to **Acknowledged**. | You've looked at it and accept it for now. |
| **Allowlist** (**Manage → Allowlisted tools**) | The tool never raises a finding, and its open findings resolve. It stays in the inventory. | Its use is sanctioned, but Whiteout doesn't govern it. |
| **Mute a category** (**Manage → Muted categories**) | No findings for a whole category. Items stay in the inventory. | A whole class of tool isn't a concern for you. |
| **Add to catalog** | Names and classifies the tool everywhere. | You know what an unknown tool is. |

What you can add to the allowlist:

| Key | Example | Silences |
|---|---|---|
| A catalog key | `ollama`, `grammarly_extension` | That tool everywhere. The **Tool** column of an installed finding shows the catalog key. |
| A footprint or evidence key | `web:character.ai` | That exact item |
| A SHA-256 | the hash from a process's evidence | That exact binary |
| A provider or host | `openai`, `api.openai.com` | Traffic findings to that provider or host |
| A network-log identity | `net:10.0.4.17` or the identity itself, or a user's email | [Imported network log](./ai-footprint/network-logs.md) findings for that identity or person |
