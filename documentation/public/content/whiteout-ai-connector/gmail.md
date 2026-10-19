# Connect Gmail

> **Availability: ✅ Live.** Google Workspace is configured via
> domain-wide delegation, so Gmail works **zero-click** — no per-user
> connect step. See
> [Overview → Before you connect](./whiteout-ai-connector/overview.md#before-you-connect--availability--prerequisites).

Expose Gmail mailbox content to AI assistants through the Whiteout AI
Connector. Gmail is a **live source**: it's **per-user only** and
classified **on demand at query time** — there is no pre-scanned corpus
and no org-wide scanner.

- **Whiteout governs content** — the connector policy (org-wide by
  default; rules can be scoped to groups) vets every message before an
  AI sees it.
- **Google governs access** — each user connects their own mailbox and
  is served only their own mail.

> **Route Gmail only through Whiteout.** If the same AI workspace also
> has its vendor-native Gmail connector enabled (e.g. claude.ai's
> built-in Gmail), the AI can read mail directly on that path, skipping
> Whiteout's vetting. Disable the native Gmail connector where you
> govern Gmail through Whiteout. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## Prerequisites

- **Whiteout admin** access (to expose Gmail and manage the org-wide
  policy)
- Each end user needs their **own Gmail account** (Workspace or
  personal) to connect
- Whiteout's OAuth app is pre-configured — nothing to register on the
  Google side
- **Google restricted-scope verification:** `gmail.readonly` is a
  restricted scope. Google requires the Whiteout OAuth app to pass a
  security assessment before general rollout. Until verification
  completes, connecting works only for **allowlisted test users**.

> No customer-side infrastructure. Because Gmail is classified on
> demand per user rather than pre-scanned, the old Pub/Sub topic
> requirement no longer applies.

> **Google Workspace tenant?** Skip the per-user connect *and* the
> restricted-scope verification wait with domain-wide delegation — one
> admin authorization provisions every user's Gmail (and Drive)
> zero-click. See
> [Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md).

## Setup steps

### Admin — expose Gmail

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector** and find **Gmail**.
2. Click **Expose** to make Gmail available to your users.

### Each user — connect their own mailbox

1. In the Whiteout desktop app, open **Connect your sources**.
2. Find **Google** in the list and click **Connect**.
3. Sign in with your own Google account and click **Allow**.
4. Your mail is now vetted on demand whenever an AI assistant queries
   it — limited to your own mailbox.

> One connect per provider: connecting **Google** covers both Gmail and
> Drive. Users don't connect them separately.

### Admin — zero-click via domain-wide delegation (optional)

Instead of each user running the OAuth screen, a **Google Workspace
admin** can authorize Whiteout's service account for **domain-wide
delegation** on the `https://www.googleapis.com/auth/gmail.readonly`
scope **once**. Every user then gets Gmail governance **zero-click** —
no per-user consent screen. Users still only ever surface their **own**
mailbox; delegation only removes the individual grant step. This is the
same DWD path described for Drive in the
[Connect Google Drive](./whiteout-ai-connector/google-drive.md#domain-wide-delegation-recommended)
guide. To let the AI draft and send email too, the delegation also needs
the write scopes; see [What the AI can change](#what-the-ai-can-change).

## Scopes Whiteout requests

| Role | Scope | Why |
|---|---|---|
| Per-user serving | `gmail.readonly` | At query time, read only that user's own mail subject + body for classification. |
| Changes (Workspace delegation) | `gmail.compose`, `gmail.modify` | Write drafts, send email and replies, and move messages to the trash as the person who asked, when your admin allows the AI to change Gmail. |

Reads use only `gmail.readonly`. The write scopes are needed only for
changes, and only on your Workspace's domain-wide delegation: a personal
Google sign-in never makes changes. There's no scanner credential, as
Gmail has no org-wide corpus scan.

## What the AI can change

When your admin allows it, the AI can write drafts and send email from
the person's own mailbox. Changes go through your organization's
Workspace delegation as that person, so they show up in Gmail under
their name, not under Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | Write a draft: a new email, or a reply draft | Allowed |
| **Edit** | Change a draft | Allowed |
| **Comment & post** | Send an email, reply or reply all | **Needs approval** |
| **Delete, archive & merge** | Move a message to the trash (recoverable for 30 days) | **Off** |

Set these in **Integrations → Whiteout AI Connector → Gmail → What the
AI can change**.

**Sending waits for approval by default.** A draft is a **Create**:
nobody sees it until someone sends it. So the AI can prepare email
while every send waits for a person. We recommend keeping it that way:
the AI drafts, and the person sends it from Gmail, or an approver
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
checked against Gmail's policy set and for planted instructions. A
reply, or a reply draft, to a message that's **Hidden** or restricted
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
- The AI can't send a draft that already exists. It creates the draft
  and the person sends it from Gmail, or the AI sends a new email.
- A draft that has attachments, or one with only an HTML body, can't be
  rewritten by the AI.

### Before the AI can make changes

Changes in Gmail go only through your Google Workspace domain-wide
delegation. A personal Google sign-in still serves reads, but never
makes changes. A **Workspace super admin** adds these scopes to
Whiteout's existing delegation entry:

```
https://www.googleapis.com/auth/gmail.compose,
https://www.googleapis.com/auth/gmail.modify
```

In the Google Admin console, open **Security → Access and data control
→ API controls → Domain-wide delegation**, edit Whiteout's client and
add the scopes to the end of the list. **Keep the scopes already there:
saving replaces the whole list.**

Until they're added, reads keep working and the AI is told your admin
needs to add them (`org_grant_missing`). The **What the AI can change**
panel shows exactly which scopes to add, with a button to copy them.
See
[Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md#let-the-ai-make-changes-write-scopes).

## What to expect after connect

- **No corpus scan.** Nothing is classified up front. Messages are
  vetted the moment an assistant requests them, per user.
- **Access is per-user.** A user can only surface their own mailbox.
  There is no shared credential and no admin scanner reading everyone's
  mail.
- **Attachments NOT classified.** Email body text only. To govern
  attachments, route them through the Whiteout interception flow
  (browser extension or desktop guard).

## Troubleshooting

- **"Access blocked: this app hasn't been verified"** — Google
  restricted-scope verification isn't complete yet. Add the affected
  user to the OAuth app's **test users** allowlist, or wait for
  verification to finish for general rollout.
- **User sees no mail / fewer results than expected** — Gmail is
  per-user and on-demand; a user only ever surfaces their own mailbox,
  and only messages that match the query.
- **"gmail integration is not CONNECTED"** — that user's OAuth grant
  expired or was revoked. Have them re-connect **Google** from
  **Connect your sources**.

## Audit log

Reads are on **Activity → AI Connector**; filter the source to Gmail.
Drafts, sends and other changes the AI made or tried to make are on
**Activity → MCP Activity**.
