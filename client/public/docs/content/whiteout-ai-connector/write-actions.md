# Write Actions

The Whiteout AI Connector doesn't only read. AI assistants can also
**create, edit, comment and post** in eight connected sources, and
**delete, archive or merge** when you allow it. Every change is made
**as the person who asked**, through their own connected account, and
Whiteout checks it before it reaches the source:

- **The document's state.** A document you've set to **Hidden**, or one
  your connector policy restricts, can't be changed. These are the same
  **Policy / Available / Hidden** settings that govern what the AI may read.
- **The text being written.** The text is checked against that source's
  policy set, the same set its reads are checked against.
- **Planted instructions.** Whiteout watches for instructions planted in
  documents the AI read, and in the text it's about to write.
- **What you've allowed.** You set the allowed changes per source and
  per kind of change: **Off**, **Allowed** or **Needs approval**.

Everything the AI changed, or tried to change, is listed on
**Activity → MCP Activity**, with who asked, what Whiteout checked and
what it decided.

## Sources and what the AI can change

| Source | Create | Edit | Comment & post | Delete, archive & merge |
|---|---|---|---|---|
| **GitHub** | Issues, pull requests, branches, repositories, forks | Issues (including closing them), files (push) | Issue and pull request comments | Delete a file, merge a pull request |
| **Jira** | Issues | Issues, status transitions | Comments | — |
| **Confluence** | Pages | Pages | Comments | — |
| **Notion** | Pages, database items | Append content to a page | — | Archive a page |
| **Linear** | Issues | Issues | Comments | — |
| **Asana** | Tasks | Tasks | Comments | — |
| **Trello** | Cards | Cards, moving cards between lists | Comments | Close (archive) a card |
| **Slack** | — | — | Post a message (as the Whiteout bot) | — |

The other connector sources (Google Drive, Gmail, Google Calendar,
SharePoint, OneDrive, Outlook, Teams, Box, Dropbox, Salesforce, HubSpot,
Zoom, Intercom and GitLab) stay read-only.

The connector marks which of its tools change things and which only
read, using the standard MCP tool annotations (`readOnlyHint`,
`destructiveHint`). AI clients that ask before running a tool that
changes something can use them.

## The defaults

| Kind of change | Default |
|---|---|
| **Create** | Allowed |
| **Edit** | Allowed |
| **Comment & post** | Allowed |
| **Delete, archive & merge** | **Off** |

The defaults apply to sources you already expose and to sources you
expose later. Every allowed change still goes through every check
below.

> **If you're upgrading:** before this release, a source exposed to the
> connector accepted every change its tools could make, with no
> checks. Deleting GitHub files, merging GitHub pull requests and
> archiving Notion pages now stay **off** until an admin turns them on.

## Choose what the AI can change

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector**, or **Activity → MCP Activity → Sources**. Both show the
   same connector card.
2. Open a source. Its detail dialog has a **What the AI can change**
   panel with one row per kind of change.
3. Set each row:
   - **Off:** the AI is told this kind of change is turned off for the
     source. Nothing is changed.
   - **Allowed:** the change goes through every check below, and is
     made if they pass.
   - **Needs approval:** the change goes through every check, then waits
     for an approver. It isn't offered for **Create**: holding new items
     adds friction for little protection.
4. If any row needs approval, choose **Who approves**: **Any org admin**
   (the default), or **A group…** and pick the approver groups.

Changes save as you make them and apply to the next call. Each change is
written to the admin **Audit Log** (`connector.write_access.updated`)
with the before and after values. Each row also shows how many changes
of that kind the AI made in the last 7 days.

Read-only administrators can see these settings but can't change them.

## What's checked before every change

Whiteout runs these checks in order. The first one that fails stops the
change.

| # | Check | What stops the change |
|---|---|---|
| 1 | **Role** | The person's Whiteout role is **read-only**. |
| 2 | **Permission** | This kind of change is **Off** for the source. |
| 3 | **Write access** | The person's connected account wasn't granted write access. See [Reconnect for write access](#reconnect-for-write-access). |
| 4 | **The document** | The document, or the page it would be created under, is **Hidden** or restricted by policy. |
| 5 | **The text** | The text matches a policy in the source's policy set. |
| 6 | **Planted instructions** | Injection Defense is on and the text carries planted instructions. See [Planted instructions](#planted-instructions-prompt-injection). |
| 7 | **Approval and action policies** | The source is set to **Needs approval**, or one of your [Action Policies](#action-policies) holds or blocks the change. |

### The document

Whiteout looks up the document the AI wants to change, using the same
classification that governs reads:

| Document state | Change |
|---|---|
| **Hidden** (by an admin override, or a policy that hides documents entirely) | Refused as if the document doesn't exist. The AI is told it couldn't be found, worded like the source's own not-found, so a Hidden document's existence isn't confirmed. |
| **Restricted by policy** (its content is withheld from reads) | Refused. You can't change a document whose contents you aren't allowed to see, which stops an AI blindly overwriting or appending to it. |
| **Available** (an admin override) | Allowed. |
| **Allowed**, or not scanned yet | Allowed. A document Whiteout hasn't scanned is recorded as *not checked*. |

Creating a page under a **Hidden** or restricted Confluence or Notion
page is refused, so content can't be planted inside a restricted tree.

After a change to a Confluence or Notion page, Whiteout re-scans that
page, so its new content is classified within the normal sync cadence.

### The text

The text the AI is writing (a title, body, comment, message or file) is
checked against the source's [policy set](./whiteout-ai-connector/connector-policy.md),
with the same group exemptions its reads get. A rule that stops PHI
being read out of Confluence also stops the AI writing PHI into
Confluence, so data can't be moved from one source into another
through the connector.

- **A match** refuses the change. The AI is told which policies matched,
  so it can tell the person what to remove.
- **Moves with no text**, such as moving a Trello card, skip this check.
- **Files pushed to GitHub** are checked as text. Binary content is
  recorded as *not checked*.
- **If Whiteout's policy check is unavailable**, the change follows your
  organization's **Compliance fail behaviour** setting. With **Fail
  open** it goes through and is recorded as *not checked*; with **Fail
  closed** it's refused.

## Planted instructions (prompt injection)

Writes are what make planted instructions dangerous. A document can tell
the AI to change, delete, post or send something. Or someone can use the
AI to plant instructions in a shared page that other people's
assistants will read later. Whiteout covers both:

- **What the AI reads.** For a source where any kind of change isn't
  Off, Whiteout scans what the AI reads from it for planted
  instructions, **even when Injection Defense is off**. This scan
  doesn't change what's returned; only your Injection Defense settings
  decide that. If it finds planted instructions, it marks that person's
  session with that AI client as **tainted** for 30 minutes or 25 tool
  calls, whichever comes first.
- **What the AI writes.** The text of every change is scanned for
  planted instructions and for patterns that send data to an outside
  address.

What happens next depends on your
[Injection Defense](./injection-defense/configuration.md) setting:

| Injection Defense | A change in a tainted session | A change whose text carries planted instructions |
|---|---|---|
| **Off** | Goes through **flagged** | Goes through **flagged** |
| **On**, action **Block** or **Quarantine** | **Held for approval** | **Refused** |
| **On**, action **Record** | Goes through **flagged** | Goes through **flagged** |

**Flagged** means the change is made and recorded for review, with no
hold and no notification:

- MCP Activity shows it as **Done · flagged**, with the reason, such as
  *"Made after the session read planted instructions"*.
- The AI is told too. The result carries a `whiteout_note`, e.g.
  *"Whiteout made this change in Confluence and flagged it for review:
  earlier in this chat you read instructions aimed at an AI assistant (in
  Vendor notes)."*, and the AI is asked to tell the person.

**Holds in a tainted session** go to the person first, so they can
confirm the change was theirs. If they don't decide within two minutes,
the request goes to your admins too. A source already set to **Needs
approval** loses self-approval while the session is tainted.

**Clear a taint** once you've checked the document. Go to **MCP Activity
→ People & agents**, open the person, then select **Clear** on the
banner. Clearing is audited.

Detections are listed in **Agents → Injection Defense** as well as on
MCP Activity.

## Approvals

When a change needs approval:

1. Whiteout holds the call for up to 20 seconds. If an approver decides
   in that time, the change is made or refused straight away.
2. Otherwise the AI is told the change is waiting, with a request code
   (for example `A-7F3K`), and asked to tell the person. It's also told
   not to try a different way to make the change.
3. Approvers are notified through your notification rules
   (**Alerts & Audit → Notifications**): in the app, and by email, Slack
   or Teams. When your organization has set it
   up, approvers also get an email or Slack DM with a single-use link to
   a phone-friendly decision page.
4. The approver reviews the change in **Agents → Approvals**, or from
   **MCP Activity → Approvals**. They see what would change, where, who
   asked and why it was held. They confirm with their password or
   single sign-on first.
5. On approval, the AI's next call with **exactly the same arguments**
   makes the change. Approving **once** covers that one change; an
   approver can instead approve this kind of change for the rest of the
   session or for a set time. A changed argument is a new request.

A request nobody decides within an hour expires and the change isn't
made. A change that was **denied** in the last hour is reported as
denied if the AI tries it again, without asking the approvers a second
time.

## What the AI is told when a change isn't made

Every refusal and hold comes back as one structured result, never a raw
vendor error or stack trace:

```json
{
  "status": "not_done",
  "whiteout": {
    "reason": "target_restricted",
    "message": "Your organization restricts this page from AI access (Finance), so the AI can't change it.",
    "what_to_do": "Tell the person the AI isn't allowed to change this one; they can make the change themselves. Don't try a different way to make this change.",
    "policies": ["Financial statements"]
  }
}
```

| `reason` | Meaning |
|---|---|
| `role_read_only` | The person's Whiteout account is read-only. |
| `write_type_off` | This kind of change is turned off for the source. |
| `reconnect_for_write` | The person needs to reconnect the source to grant write access. |
| `target_not_found` | Not found (also returned for **Hidden** documents). |
| `target_restricted` | The document is restricted by policy. |
| `content_blocked` | The text matched a policy; `policies` lists which. |
| `content_injection` | The text carried instructions aimed at an AI. |
| `content_exfiltration` | The text looked like it sends data to an outside address. |
| `held_for_approval` | Waiting for approval; `approval.code` is the request code. |
| `approval_denied` / `approval_expired` | The approver said no, or nobody decided in time. |
| `blocked_by_rule` | One of your Action Policies blocks this change. |
| `checks_unavailable` | Whiteout couldn't check the change, and your organization fails closed. |
| `vendor_denied` / `vendor_error` | The source itself refused the change or returned an error. |

## Reconnect for write access

Connecting a source has always asked the person's account for read
access only. Some sources need the person to grant write access too:

| Source | What's needed |
|---|---|
| **Jira**, **Confluence** (Atlassian) | Reconnect once. Whiteout now also asks for `write:jira-work` and `write:confluence-content`. |
| **Linear** | Reconnect once (`read,write`). |
| **Trello** | Reconnect once (`read,write`). |
| **GitHub**, **Asana** | Nothing. The existing grant already allows changes. |
| **Notion** | Nothing. The AI can change only pages that are shared with Whiteout's Notion integration. |
| **Slack** | The Whiteout bot needs Slack's `chat:write` scope. Messages are posted as the bot, only in channels it's a member of. |

- **Who needs to reconnect.** In the **What the AI can change** panel,
  Whiteout shows how many connected people need to reconnect before the
  AI can make changes as them.
- **How they reconnect.** Those people see **Grant write access** next to
  the source on **Connect your sources**.
- **If they try first,** the AI tells them to reconnect, with a link,
  instead of failing at the source.

Whiteout asks for write access only while at least one kind of change
is Allowed or Needs approval for a source. If every row is Off, connect
stays read-only.

## Agents

Whiteout treats an AI agent exactly like a person. Its changes go
through the same checks and appear in the same places. Which identity
an agent carries depends on how it runs:

| Agent | Identity on the connector |
|---|---|
| Acting for a person (their Claude Code, Cursor, desktop app or claude.ai) | **That person.** It uses their sign-in or personal connector token, so its changes are theirs. |
| A deployed, enrolled infrastructure agent | **The agent.** Give it its own connector token (below). |

**Give an enrolled agent its own connector identity:**

1. Open **Coverage → Infrastructure** and open the agent.
2. Under **Connector identity**, choose **Run as**: the person whose
   connected source accounts the agent should read and write with.
3. Select **Create token**. Copy the token and the MCP server URL shown.
   The token isn't shown again.
4. Configure the agent's MCP client to send the token as a Bearer
   header.

Everything the agent does is then recorded as the agent: on MCP
Activity (marked as an agent, with who it runs as), in the audit trail
and in **Agents → Sessions**. Some differences from a person:

- **Approvals.** An agent's approval requests go to admins; an agent can
  never approve its own change.
- **Group exemptions.** An agent token doesn't take the run-as person's
  group policy exemptions.
- **Tokens.** **Rotate token** issues a new token and stops the old one,
  and **Revoke** stops it outright.

**Changes seen after they ran.** The
[Infrastructure Agent](./infrastructure/tool-activity-governance.md)
reports an agent's tool calls after they run. Whiteout applies the same
planted-instruction logic to them:

- A tool result carrying planted instructions taints that agent's
  session.
- Each change the agent made (an MCP write, a publish, a delete, a
  message sent) is recorded under the agent. It's flagged when the
  session was tainted or its input carried planted instructions.

An observed call has already run, so it can only be flagged. MCP
Activity labels these changes **Seen after it ran**.

## MCP Activity

**Activity → MCP Activity** shows what people and agents did through
the connector. It refreshes every 60 seconds.

| Tab | What it shows |
|---|---|
| **Actions** | Totals for the window (changes, stopped, waiting, flagged, tainted sessions), then every change as a sentence: who, which AI client, what they did to which document, and the outcome. Filter by person, source, kind of change and outcome. Open a row to see every check's result, the document's state, the approval trail and a masked preview of the text. Revealing the text is audited. |
| **People & agents** | One row per person or agent: reads, changes, flagged, stopped, held, last active, and whether a session is tainted. Open one for a timeline of reads, where planted instructions turned up and the changes that followed. |
| **Approvals** | Connector changes waiting for a decision, with time left, then decided requests. **Review** opens the request in **Agents → Approvals**. |
| **Sources** | The same connector card as on Integrations, so you can change what the AI can read and change without leaving the page. |

**Activity → AI Connector** still shows every connector call. Its
events table has an **Operation** filter (Read, Write, Admin) to separate
reads from changes.

## Action Policies

The action policies in **Agents → Action Policies** apply to connector
changes too, alongside the per-source
settings above, and the stricter of the two wins. Use one when you
need something the per-source settings can't express, such as "only
Engineering may change GitHub" or "hold every Slack post to a shared
channel".

## Audit-only mode

In [audit-only mode](./governance/audit-only-mode.md), nothing is
refused or held. Every check still runs and records what it would have
done, and MCP Activity labels those results **Would be refused
(audit-only)**. Two exceptions:

- The **read-only** role check still applies. It's an identity rule, not
  enforcement.
- Planted-instruction scanning doesn't run, because Injection Defense is
  off in audit-only mode.

## Audit trail and SIEM

- **Audit columns.** Every change is one row in the connector audit log,
  with the kind of change, the document and its state, each check's
  result, the approval code, and a digest and masked preview of the
  text. The full text isn't stored with the call's parameters, so
  document bodies don't travel to your SIEM.
- **SOC events.** Connector events sent to your configured SOC/SIEM
  destinations carry the operation, the kind of change, the document title, the reason and the
  approval code.
- **Admin Audit Log.** Changes to these settings, and minted and revoked
  agent tokens, are recorded there with the admin who made them.

## Limits today

- **GitHub targets aren't checked yet.** GitHub content is classified per
  file and issue without its repository, so a GitHub change is recorded
  with its document as *not checked*. Its text is still checked.
- **Slack channels are usually not checked.** Channels rarely carry a
  classification, so the channel is recorded as *not checked*. The
  message text is still checked.
- **Read-only sources stay read-only.** Changing documents in Drive,
  SharePoint or OneDrive, drafting mail, and posting in Teams aren't
  available yet.
- **Matched text is refused, not redacted.** The AI is told what matched
  so the person can remove it.

## Related

- [Connector Policy](./whiteout-ai-connector/connector-policy.md): the
  policy sets that govern reads and the text of every change.
- [Connect an AI Assistant](./whiteout-ai-connector/connect-ai-assistant.md):
  sign-in and personal connector tokens.
- [Injection Defense](./injection-defense/configuration.md): the
  setting that decides whether planted instructions are flagged, held or
  refused.
