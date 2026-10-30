# Redacted Quick Send

When Whiteout blocks a prompt, it can make a **redacted version**: the same prompt with the flagged details replaced by blanks (`______`). With **Quick Send** set to **Send a redacted version**, people in a group send that redacted version by pressing Enter again. The original prompt never leaves their device, and every redacted send is recorded for administrators.

> **Enter again never sends the original prompt in this mode.** If Whiteout can't make a redacted version, Enter again does nothing. The only way to send the original is [Accountable Override](#accountable-override-is-the-trump-card), with a written justification, and only where you've turned it on.

---

## The two Quick Send options

Quick Send decides what pressing Enter again does on a blocked prompt. Each group has one setting:

| Quick Send | Enter again on a blocked prompt | Needs Accountable Override |
|---|---|---|
| **Off** (default) | Nothing. The block stands. | No |
| **Send a redacted version** | Sends Whiteout's redacted version of the prompt. | No |
| **Send the original** | Sends the original prompt with no written justification. It's recorded as an override. | Yes |

A group can use only one of the two options at a time.

---

## Accountable Override is the trump card

Accountable Override lets people send a blocked prompt as it is, after writing a business justification. Redacted Quick Send works with or without it:

| Accountable Override | Quick Send | Enter again does | Can the original be sent? |
|---|---|---|---|
| Off | Off | Nothing | No |
| Off | **Send a redacted version** | Sends the redacted version | No |
| On | Off | Nothing (the justification box is offered) | Yes, with a justification |
| On | Send the original | Sends the original, no justification | Yes, with Enter again |
| On | **Send a redacted version** | Sends the redacted version | Yes, with a justification |

When Accountable Override is on, every block card in the group keeps **Send the original instead (justification required)**, including cards where no redacted version could be made. The justification and the send are recorded as an override, as they are today.

---

## Turn it on for a group

1. In the Whiteout AI admin app, go to **Governance → Policies**.
2. Choose the group in **Select Group**.
3. In the **Quick Send** box (*Press Enter again on a blocked prompt to…*), choose **Send a redacted version**.

The setting saves as soon as you choose it.

- **Send the original** is greyed out, with *Turn on Accountable Override first.*, while Accountable Override is off for the group.
- With Accountable Override on and **Send a redacted version** chosen, the box shows *People can still send the original with a justification.*
- Each change is recorded in **Alerts & Audit → Audit Log**. If your organization requires a second administrator to approve policy changes, the change takes effect once it's approved.
- In [audit-only mode](./governance/audit-only-mode.md) nothing is blocked, so there is nothing to redact, and the setting is view only.
- Devices don't need a restart. The next blocked prompt follows the new setting.

With Quick Send **Off** or **Send the original**, block cards in the browser extension and Desktop Guard still offer **Generate redacted version** wherever a redacted version can be made, so people can copy it and send it themselves.

---

## What users see

### Browser extension and Desktop Guard

The block card shows the redacted version, with the blanks highlighted:

```
 Prompt blocked: contains patient health information (PHI)
 ┌──────────────────────────────────────────────────────────┐
 │ Summarize the discharge notes for ______ (MRN ______),   │
 │ admitted ______ with ______.                              │
 └──────────────────────────────────────────────────────────┘
 Press Enter to send this redacted version.     [ Send redacted version ]
 Edit my prompt  ·  Send the original instead (justification required)
 Whiteout records what was sent.
```

- **Enter again** puts the redacted version in the message box and sends it. The user sees **Redacted version sent — recorded.**
- **Send redacted version** does the same with a click.
- **Edit my prompt** puts the original back in the message box, if it's empty, so the user can rewrite it. It never overwrites other text.
- **Send the original instead** appears only when Accountable Override is on, and opens the justification box.

To make sure the user has seen what will be sent, Enter again only counts when:

- the redacted version has been on screen for 0.7 seconds;
- it's a fresh key press (holding Enter down doesn't count);
- the message box still holds the blocked prompt, unchanged (Desktop Guard also accepts an empty box, because it clears the blocked text).

If the user types something else, the offer is withdrawn and the new text is checked as a new prompt.

For a prompt over 2,000 characters, the card first shows **Preparing redacted version…**. Enter does nothing until the redacted version is on screen.

If Whiteout can't make a redacted version, the card says why, for example *Can't make a redacted version of this one — most of it is sensitive. Edit your prompt, or send the original with a justification.* The reasons are:

| Reason on the card | Try again? |
|---|---|
| most of it is sensitive | No |
| there are no specific details to take out | No |
| it couldn't be prepared right now | Yes |
| it took too long to prepare | Yes |
| Whiteout couldn't be reached | Yes |

If the redacted version can't be put in the message box, Whiteout copies it to the clipboard and says *Couldn't put the redacted version in the message box. It's on your clipboard — paste it and press Enter.*

| Surface | Notes |
|---|---|
| **Browser extension** (Chrome, Edge, Firefox, Safari) | The card appears on the AI site. If the site refuses the send afterwards (for example, a usage limit), the card says so and the redacted version stays in the message box. |
| **Desktop Guard** (macOS and Windows) | The card appears next to the AI app and doesn't take focus, so Enter in the app's message box is the Enter again. On Windows, Enter must be pressed in the same window that was blocked. Blocks on an edited earlier message, or on a one-click prompt card, don't offer a redacted version on Windows. |

### Coding agents (Claude Code, Codex, Cursor, GitHub Copilot)

The Whiteout defender hooks can allow or block a prompt, but they can't type for the user. So in coding agents, the Whiteout VS Code extension puts the redacted version in front of the user, and the user presses Enter. Whiteout never presses Enter itself.

The block message has a **Send a redacted version** section: *Whiteout made a redacted version of your prompt, with the flagged details removed.* What happens next depends on where the agent runs:

| Where | What the user does |
|---|---|
| **Claude Code or Codex in a VS Code terminal**, Accountable Override off | Whiteout types the redacted version into the agent's box. The user reads it and presses Enter. In Claude Code, the original prompt is set aside and comes back after the send. |
| **Claude Code or Codex in a VS Code terminal**, Accountable Override on | The user clicks **Use Redacted Version** on the Whiteout pop-up in VS Code, then presses Enter. (Or adds a justification to send the original.) |
| **Claude Code's panel, VS Code chat, Codex on Windows, or a terminal VS Code can't reach** | The user clicks **Copy Redacted Prompt** on the Whiteout pop-up, pastes it and sends it. |
| **Cursor** | The user clicks **Copy Redacted Prompt**, then starts a new chat and sends it there. Cursor keeps the blocked message in the old chat and would send it along. |
| **GitHub Copilot with `@whiteout`** | The reply shows the redacted version, with a **Send redacted version** follow-up. |

- Claude Code also gets **Copy Redacted Prompt** instead of typing when the redacted version is 4 lines or longer, because Claude Code would rewrite it.
- Only that exact text is accepted, within 5 minutes. If the user changes anything, it's checked again as a new prompt.
- After the send, the VS Code status bar shows **Whiteout: redacted version sent — recorded**.
- The JetBrains plugin reviews coding-agent activity after it happens and never holds prompts, so it doesn't offer redacted versions.

---

## What is recorded

### Prompt Review

Go to **Governance → Prompt Review**.

- **The row stays Blocked.** The original never left the device, so its status doesn't change.
- **The Override column shows a Redacted sent chip.** Hover over it for how it was sent.
- **Status → Redacted** in the filters shows only blocked prompts whose redacted version was sent.
- **The prompt details** show the exact text that was sent, when, and how.
- **CSV and PDF exports** include the redacted send and its time.

How it was sent:

| Method | Meaning |
|---|---|
| **Enter again** | The user pressed Enter again on the card, or sent the redacted version Whiteout put in a coding agent's box. A Copy Redacted Prompt paste in a coding agent is recorded the same way. |
| **Send button** | The user clicked **Send redacted version**. |
| **Pasted** | The user copied the redacted version (for example, from **Generate redacted version**) and sent it themselves. |

The send is recorded when Whiteout approves the redacted version for sending. If the AI site then refuses the send, the row still shows **Redacted sent**.

### SOC destinations

Each redacted send is delivered to your SOC destinations as a `prompt_redacted` event, after the block's own `prompt_log` event. The redacted text it carries follows each destination's **Prompt content** setting (Full text, Hash only or Redacted).

| Destination | Label for `prompt_redacted` |
|---|---|
| Webhook and Tines | Header `X-Whiteout-Event-Type: prompt_redacted` |
| Splunk | Sourcetype `whiteout:prompt_redacted` |
| Elasticsearch (no index configured) | Index `whiteout-prompt-redactions` |
| Microsoft Sentinel (no table configured) | Table `WhiteoutAI_PromptRedactions_CL`, stream `Custom-WhiteoutAI_PromptRedactions_CL` |

A Sentinel destination created through the API without a table name needs that stream (and its table) in its DCR. See [Azure Sentinel](./soc-destinations/azure-sentinel.md).

### Compliance Evidence

[Compliance Evidence](./compliance-evidence/overview.md) counts the groups using **Send a redacted version** and the redacted sends against blocks: blocks that ended with the sensitive details taken out.

Redacted sends don't create notifications.

---

## Limits

- **5 or more policies.** When a prompt breaks 5 or more policies, Whiteout doesn't make a redacted version. The card is a normal block, with **Send the original instead** if Accountable Override is on.
- **Prompts over 2,000 characters.** The browser extension and Desktop Guard prepare the redacted version after the block, so there's a short wait. Coding agents don't offer one.
- **Enter again never sends the original.** In a **Send a redacted version** group, Enter again with no redacted version does nothing. In a **Send the original** group, Enter again is also switched off while a redacted version is showing on the card (from **Generate redacted version**); the original then takes the **Send anyway** button.
- **Prompts only.** Files, pastes, folders and voice don't get a redacted version. In coding agents, neither does a prompt with an attached or referenced file, or a message from another agent.
- **Some blocks can't be redacted.** A blocked AI app, an [account rule](./governance/account-rules.md) or Prompt Injection Defense blocks the prompt outright, with no redacted version.
- **The exact text, within 5 minutes.** Whiteout accepts only the redacted version it made for that user's blocked prompt, unchanged and within 5 minutes. Anything else is checked as a new prompt.
- **Read it before sending.** Whiteout checks that its redacted version only removes text, and that no Social Security number, card number, IBAN or secret key from the original is left in it. A detail the policies didn't flag can still remain, so the user sees the redacted version before it's sent.

---

## Versions that support this

| Client | Version |
|---|---|
| Whiteout AI admin app (the **Quick Send** setting) | 2.97.5 or later |
| Browser extension (Chrome, Edge, Firefox, Safari) | 1.17.3 or later |
| Desktop Guard (macOS and Windows) | 1.8.135 or later |
| VS Code extension | 1.28.6 or later |
| Whiteout defender hooks (Claude Code, Codex, Cursor) | 1.32.0 or later, installed by Desktop Guard and the VS Code extension |

Older clients in a **Send a redacted version** group show the earlier block card: **Generate redacted version**, plus the justification box if Accountable Override is on. Nothing is sent that wasn't before. Desktop Guard and the desktop app update themselves. Browser extensions update from their stores.

---

## Troubleshooting

**Enter does nothing on the card.**
The redacted version may still be preparing, it may have been on screen for less than 0.7 seconds, or the message box no longer holds the blocked prompt. If the card says it can't make a redacted version, Enter does nothing by design. The user can edit the prompt, or send the original with a justification if Accountable Override is on.

**A blocked prompt has no redacted version offered.**
Check the limits above: 5 or more policies, an outright block, a file, a coding-agent prompt over 2,000 characters, or a client older than the versions above.

**A user says Enter sent their original prompt.**
In a **Send a redacted version** group it can't. Check the row in Prompt Review: a **Redacted sent** chip means the redacted version went out, and **Overridden** means the user sent the original with a justification.

**The row shows Redacted sent, but the user says nothing arrived.**
The AI site refused the send after Whiteout approved it (for example, a usage or rate limit). In the browser, the card says *The site didn't send* and the redacted version stays in the message box. If the user sends it again, Whiteout checks it as a new prompt.
