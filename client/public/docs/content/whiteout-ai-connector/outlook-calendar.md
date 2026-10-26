# Connect Outlook Calendar

> **Availability: ⚙️ Requires operator setup.** Microsoft 365 needs
> Whiteout's Entra app enabled for your deployment (a one-time operator
> step). With
> [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
> in place, Outlook Calendar works **zero-click** — no per-user connect
> step. Zero-click is read-only: changes need each person's own
> Microsoft connection (see [What the AI can change](#what-the-ai-can-change)).

Expose Outlook calendar content to AI assistants through the Whiteout AI
Connector. Outlook Calendar is a **live source**: it's **per-user only**
and classified **on demand at query time**.

- **Whiteout governs content** — event subjects and bodies routinely
  carry sensitive context (deals, candidates, incident bridges); every
  event is vetted against your connector policy (org-wide by default;
  rules can be scoped to groups) before an AI
  sees it.
- **Microsoft governs access** — each user is served only their own
  calendars.

## Prerequisites

- **Whiteout admin** access (to expose Outlook Calendar and manage the
  org-wide policy)
- Either the one-time
  [Microsoft 365 zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
  tenant consent (recommended), **or** each user connects their own
  Microsoft account from **Connect your sources**
- For changes: each person's own Microsoft connection with write
  access; see [What the AI can change](#what-the-ai-can-change)

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Outlook Calendar**
   on.
2. No backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI what's on your calendar; events come back vetted.

## What the AI can change

When your admin allows it, the AI can create, change and cancel events
on the person's own calendar, through that person's own Microsoft
connection. The changes show up in Outlook under their name, not under
Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | An event with no one else invited | Allowed |
| **Edit** | Change an event that has no other attendees | Allowed |
| **Comment & post** | Create or change an event that invites anyone besides the person, or change a meeting that already has other attendees | **Needs approval** |
| **Delete, archive & merge** | Cancel a meeting the person organizes (attendees get a cancellation), or delete their own event | **Off** |

Set these in **Integrations → Whiteout AI Connector → Outlook Calendar
→ What the AI can change**.

**Invitations count as sending.** An event is a send when it invites
anyone besides the person making it. Outlook always emails attendees
when a meeting with attendees is created or changed. So changing a
meeting that already has other attendees needs "notify", and that
counts as sending. Sending starts at **Needs approval**:
the AI says it's waiting on approval and gives a request code, and
approvers decide in **Agents → Approvals**, or from the approval
notification. Once it's approved, the AI retries the identical request
and it's sent exactly once. A denied send isn't asked about again for
an hour.

**Only the organizer.** Only the meeting organizer can change or cancel
a meeting through the AI. Attendees decline in Outlook themselves.

**Inviting people outside your organization.** An invitation that
reaches any address outside your organization's own email domains is
tagged as an **External send**, so any Action Policy for external sends
(**Agents → Action Policies**) applies too. **Activity → MCP Activity**
shows each send's recipients: how many people, and which outside
domains.

**Cancelling reaches people too.** Cancelling a meeting sends its
attendees a cancellation, so it's tagged as an external send in the
same way. It stays a **Delete** change: once you turn Delete on, your
Action Policies for external sends apply to it.

**What's checked.** The event's title, description, location and
attendee addresses are checked against Outlook Calendar's policy set
and for planted instructions. Events are checked by their own id: a
**Hidden** event is refused as not found, and one restricted by policy
is refused. Calendars aren't checked, and are recorded as *not checked*.
See [Write Actions](./whiteout-ai-connector/write-actions.md#sending-email-and-invitations).

### Limits

- For an all-day event, the end date is the day after the event ends.
- Attendee addresses must be plain ASCII email addresses (`Name
  <pat@example.com>` is fine), up to 100 per event. Addresses with
  non-ASCII characters are refused for now.
- Bad input, such as an invalid address or a line break in one, is
  refused before anything is held for approval. The AI is told what to
  fix right away, and no approval request is created.

### Before the AI can make changes

Changes use each person's own Microsoft connection, never your
organization's
[zero-click](./whiteout-ai-connector/microsoft-365-zero-click.md)
access, because changes made with app-only access would show as made by
the app. Zero-click reads keep working.

1. **Your operator** adds the delegated permission `Calendars.ReadWrite`
   to Whiteout's Entra app (Whiteout-hosted: ask your account manager).
2. **Each person** connects their own Microsoft account once, from
   **Connect your sources**. People who read Outlook Calendar zero-click
   see **Connect to make changes**; until they connect, the AI is told
   to connect first (`connect_for_write`). People who connected before
   changes were turned on see **Grant write access** and reconnect once.

One Microsoft connection covers SharePoint, OneDrive, Outlook Mail and
Outlook Calendar. The consent screen asks only for the write
permissions of the sources your organization has exposed and allows
changes in.

## Audit log

Reads are on **Activity → AI Connector**; filter the source to Outlook
Calendar. Changes and invitations the AI made or tried to make are on
**Activity → MCP Activity**.
