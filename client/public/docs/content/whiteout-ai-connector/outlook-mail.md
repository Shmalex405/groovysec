# Connect Outlook Mail

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step). With
> [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
> in place, Outlook Mail works **zero-click** — no per-user connect step.
> Zero-click is read-only: drafting and sending need each person's own
> Microsoft connection (see [What the AI can change](#what-the-ai-can-change)).

Expose Outlook mailbox content to AI assistants through the Whiteout AI
Connector. Outlook Mail is a **live source**: it's **per-user only** and
classified **on demand at query time** — there is no pre-scanned corpus
and no org-wide scanner.

- **Whiteout governs content** — the connector policy (org-wide by
  default; rules can be scoped to groups) vets every message, and every
  attachment's extracted text, before an AI sees it. Raw attachment
  bytes are never returned to the AI.
- **Microsoft governs access** — each user is served only their own
  mailbox (`/users/{caller}/…` under zero-click, or their own delegated
  token if they connected manually).

> **Route Outlook only through Whiteout.** If the same AI workspace also
> has a vendor-native Microsoft 365 connector enabled, the AI can read
> mail directly on that path, skipping Whiteout's vetting. Disable the
> native connector where you govern Outlook through Whiteout.

## Prerequisites

- **Whiteout admin** access (to expose Outlook Mail and manage the
  org-wide policy)
- Either the one-time
  [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
  tenant consent (recommended), **or** each user connects their own
  Microsoft account from **Connect your sources**
- For changes (drafts, sending, deleting): each person's own Microsoft
  connection with write access; see
  [What the AI can change](#what-the-ai-can-change)

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Outlook Mail** on.
2. There is no backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI to search your mail; the response is vetted against
   your connector policies before anything is returned.

## What the AI can change

When your admin allows it, the AI can write drafts and send email from
the person's own mailbox, through that person's own Microsoft
connection. The changes show up in Outlook under their name, not under
Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Write a draft: a new email, or a reply draft | Allowed |
| **Edit** | Change a draft (only drafts) | Allowed |
| **Comment & post** | Send an email, reply or reply all | **Needs approval** |
| **Delete, archive & merge** | Move a message to Deleted Items | **Off** |

Set these in **Integrations → Whiteout AI Connector → Outlook Mail →
What the AI can change**.

**Sending waits for approval by default.** A draft is a **Create**:
nobody sees it until someone sends it. So the AI can prepare email
while every send waits for a person. We recommend keeping it that way:
the AI drafts, and the person sends it from Outlook, or an approver
approves the AI's send. When a send is held, the AI says it's waiting on
approval and gives a request code. Approvers decide in **Agents →
Approvals**, or from the approval notification. Once it's approved, the
AI retries the identical request and the email is sent exactly once. A
denied send isn't asked about again for an hour.

**Sending outside your organization.** A send that reaches any address
outside your organization's own email domains is tagged as an
**External send**, so any Action Policy for external sends (**Agents →
Action Policies**) applies too. A reply always counts as external,
because the people it reaches come from the original message, not from
the AI's request. **Activity → MCP Activity** shows each send's
recipients: how many people, and which outside domains.

**What's checked.** The subject, body and every recipient address are
checked against Outlook Mail's policy set and for planted instructions.
A reply, or a reply draft, to a message that's **Hidden** or restricted
by policy is refused. Messages are checked by their own id; drafts
aren't checked, and are recorded as *not checked*. See
[Write Actions](./whiteout-ai-connector/write-actions.md#sending-email-and-invitations).

### Limits

- Plain-text email bodies only, and no attachments.
- Up to 100 recipients per email, and a body of up to 1 MB.
- Addresses must be plain ASCII email addresses (`Name
  <pat@example.com>` is fine). Addresses with non-ASCII characters are
  refused for now.
- Bad input is refused before anything is held for approval: an invalid
  address, a line break in an address or subject, more than 100
  recipients, or a send with no "to" address. The AI is told what to
  fix right away, and no approval request is created.
- Only drafts can be changed. The AI can't send a draft that already
  exists: it creates the draft and the person sends it from Outlook, or
  the AI sends a new email.

### Before the AI can make changes

Changes use each person's own Microsoft connection, never your
organization's
[zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
access, because changes made with app-only access would show as made by
the app. Zero-click reads keep working.

1. **Your operator** adds the delegated permissions `Mail.ReadWrite` and
   `Mail.Send` to Whiteout's Entra app (Whiteout-hosted: ask your
   account manager).
2. **Each person** connects their own Microsoft account once, from
   **Connect your sources**. People who read Outlook Mail zero-click see
   **Connect to make changes**; until they connect, the AI is told to
   connect first (`connect_for_write`). People who connected before
   changes were turned on see **Grant write access** and reconnect once.

One Microsoft connection covers SharePoint, OneDrive, Outlook Mail and
Outlook Calendar. The consent screen asks only for the write
permissions of the sources your organization has exposed and allows
changes in.

## Audit log

Reads are on **Activity → AI Connector**; filter the source to Outlook
Mail. Drafts, sends and other changes the AI made or tried to make are
on **Activity → MCP Activity**.
