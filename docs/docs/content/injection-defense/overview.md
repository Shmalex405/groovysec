# Injection Defense

A prompt injection is text that tries to take control of an AI system. Some attacks are typed directly into the chat. Others arrive hidden in content the AI reads on the user's behalf: a document, an email, a web page, a ticket or a tool result. **Prompt Injection Defense** checks that content before it reaches the model, acts on what it finds, and keeps a tamper-evident record of every request it checks.

Find it under **Governance → Injection Defense**. The page is titled **Prompt Injection Defense**.

> **Off by default.** Injection Defense is a separate feature that you switch on for your organisation. Until you do, nothing is scanned or recorded. You can still try the detector with **Test the detector**. See [Configuration](./injection-defense/configuration.md).

## The threat in plain language

An AI assistant follows instructions. It can't reliably tell the instructions you meant it to follow from instructions that happen to appear in the text it's reading. Attackers use this in two ways.

### Direct injection (jailbreaks)

The person talking to the AI writes the attack themselves. Typical attempts:

- telling the assistant to drop or replace its instructions
- asking it to adopt a persona "with no rules"
- asking it to reveal its system prompt
- dressing a forbidden request up as a hypothetical

Direct attacks mostly matter for **your own AI apps**. There, a user who talks the model out of its instructions can make it misbehave in your product, leak its configuration or misuse its tools.

### Indirect injection (planted instructions)

The attacker never talks to the AI. They plant instructions in content they expect an AI to read later:

| Where it's planted | Example |
|---|---|
| **Documents and files** | A contract, résumé or PDF with a hidden line addressed to "the AI assistant" |
| **Email and chat messages** | An inbound email telling any assistant that summarises it to forward the thread elsewhere |
| **Web pages** | Text on a page, often invisible to people, that a browsing agent or retrieval pipeline picks up |
| **Tool and API results** | A ticket comment or a JSON field that contains fake "system" instructions |
| **Code repositories** | A README, issue or code comment telling a coding agent to run a command or print secrets |

Indirect injection is the more dangerous class, for three reasons. The person using the AI doesn't know the content is hostile. Anyone who can send your organisation an email or edit a shared document can plant it. And when the AI can act (call tools, run commands, send data), a planted instruction becomes an action.

## How Whiteout inspects content

Every request that reaches the detector is split into **parts**, and each part is scored separately:

| Part | What it is | Setting that decides the action |
|---|---|---|
| **User prompt** | What the person typed (the latest user turn) | *When a user's own prompt is an injection* |
| **System prompt** | Your app's own instructions to the model | *When a user's own prompt is an injection* |
| **Retrieved document** | Content your app fetched and handed to the model (RAG) | *When a document or tool result carries instructions* |
| **Tool result** | What a tool, API, connector or agent step returned | *When a document or tool result carries instructions* |

Scoring each part separately lets Whiteout act precisely. When one retrieved document out of ten carries a planted instruction, that one document can be **quarantined** (dropped from the model's context) while the request goes ahead with the other nine.

The detector works in two tiers, both on your Whiteout backend. Scanned text is never sent to a third party.

1. **Rules.** Exact patterns for known attack phrasing. They run on a normalised copy of the text: invisible characters are removed, look-alike letters are folded and base64 and hex are decoded, so hidden instructions can't slip past. Every rule hit names the rule that fired.
2. **Classifier.** A second-stage classifier trained to recognise injected instructions, which catches phrasing the rules don't know. Whether it's available depends on your deployment. The console shows its status (see [Console → Detectors](./injection-defense/console.md#detectors)).

How the two tiers combine:

- **Documents and tool results** are flagged if the rules **or** the classifier flag them.
- **A user's own prompt** can only be **blocked** by the rules. If only the classifier flags it, the action is at most a **warning**, because the classifier can't tell someone *discussing* an attack from someone *making* one.
- **Custom AI Apps in monitor mode are never blocked or quarantined**, whatever the settings. Their detections are capped at a warning.
- **In an audit-only organisation, Injection Defense is off.** Nothing is scanned or recorded on any surface, and your settings are kept for when enforcement is enabled. See [Configuration → Audit-only mode](./injection-defense/configuration.md#audit-only-mode).

The detector looks for these categories:

| Category | What it looks for |
|---|---|
| instruction override | Tries to make the assistant drop or replace its instructions. |
| role play | Tries to change who the assistant is: personas, "developer mode", pretend scenarios. |
| policy bypass | Tries to talk the assistant out of its safety or company rules. |
| context manipulation | Fakes new context: "the conversation above is over", fake updates, fake authority. |
| exfiltration | Tries to send data somewhere: links, emails, webhooks, markdown images. |
| encoding | Hides instructions in base64, hex, ciphers or other encodings. |
| role markers | Fakes conversation structure: system tags, role markers, chat delimiters. |
| addressed to ai | Text inside a document that speaks directly to the AI reading it. |
| tool coercion | Tries to make an agent run commands or call tools it shouldn't. |
| hidden text | Instructions hidden with invisible characters or look-alike letters. |

The **Detectors** tab lists every rule in each category.

## Where Whiteout checks

Injection Defense runs on the surfaces where content passes through the Whiteout backend. When the feature is on, all of these surfaces use the same settings.

| Surface (as shown in the console) | What is scanned | What happens when something is caught |
|---|---|---|
| **Guard API**, **SDK**, **Auto-instrumented**, **Gateway** (your Custom AI Apps) | Each request's latest user prompt, system prompt, tool messages and retrieved documents. The model's final reply is also checked, as tool content. | The Guard verdict carries the result. **Block** turns the decision into a block. **Quarantine** lists the documents and messages to drop. The Whiteout SDKs (0.3 and later) drop quarantined content automatically. |
| **AI Connector (MCP)** | Each item returned by the connector's content-reading tools (search, get and read on every connected source), after connector policy has run | **Quarantine** replaces that item's text with a removal notice. **Block** fails the whole tool call. **Warn** and **Record** pass the result through with an annotation. |
| **IDE / coding agent** | Content a coding agent read (file contents, command output, fetched pages) that the Whiteout VS Code extension flagged locally as high or critical | Detection and audit. The extension shows its own warning; the server verdict does not stop the agent. |
| **OpenTelemetry** | Model calls reported by apps that send traces to Whiteout | Record only, after the fact. Traces are never blocked. |
| **Scan API** | Text submitted directly to Whiteout's injection scan endpoint by a signed-in user | The verdict is returned to the caller. |

### What isn't covered yet

Be clear about the gaps when you plan your rollout:

- **The browser extension and Desktop Guard** (employees using ChatGPT, Claude, Gemini, Copilot and similar tools) are **not** checked by Injection Defense. Prompts, pastes and uploads on those surfaces are still governed by your data policies, but the injection detector doesn't run on them.
- **The JetBrains plugin** doesn't send content to the detector.
- **In VS Code, only content the local scanner already rates high or critical** reaches the server detector, and only the first 8 KB of it. The extension's own on-device checks, and the defender hooks Whiteout installs for coding agents, run whether or not Injection Defense is on. This page's settings don't change them.

## What the feature does not do

- It doesn't replace your **data policies**. Injection Defense asks "is this text trying to hijack the AI?". Your policy library asks "does this text contain data that mustn't reach an AI?". The two run independently, and a request can trip either or both. See [Configuration → Relationship to Policies](./injection-defense/configuration.md#relationship-to-policies).
- It **fails open**. If the detector errors or the audit record can't be written, the request continues with the verdict it would otherwise have had.
- It never stores the text of requests that pass. See [What the audit log keeps](./injection-defense/console.md#what-the-audit-log-keeps).

## In this section

- [The Injection Defense console](./injection-defense/console.md): every tab, card and control.
- [Configuration and rollout](./injection-defense/configuration.md): settings, defaults, suppressions and a monitor-first rollout plan.
- [Investigating detections](./injection-defense/investigating-events.md): triage, verdicts, false positives, exports and alerts.
- [FAQ and troubleshooting](./injection-defense/troubleshooting.md)

## Related

- [Whiteout AI Connector overview](./whiteout-ai-connector/overview.md): the MCP connector whose results Injection Defense scans.
- [Compliance Evidence](./compliance-evidence/overview.md): injection detections feed the *Prompt-injection detection* evidence source.
