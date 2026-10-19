# Connect Google Calendar

> **Availability: ✅ Live.** With
> [Google Workspace zero-click](./whiteout-ai-connector/google-workspace-dwd.md)
> in place (the DWD grant must include the `calendar.readonly` scope),
> Google Calendar works **zero-click** — no per-user connect step.

Expose Google Calendar content to AI assistants through the Whiteout AI
Connector. Calendar is a **live source**: per-user only, classified **on
demand at query time**.

- **Whiteout governs content** — event titles and descriptions routinely
  carry sensitive context (deals, candidates, incident bridges); every
  event is vetted against your org-wide connector policy before an AI
  sees it.
- **Google governs access** — each user is served only their own
  calendars (and calendars shared with them).

## Prerequisites

- **Whiteout admin** access (to expose Google Calendar)
- Either the Workspace **DWD grant** including `calendar.readonly`
  (recommended — zero-click), **or** each user connects their Google
  account from **Connect your sources**
- For changes: the DWD grant must also include `calendar.events`. A
  personal Google sign-in serves reads only. See
  [What the AI can change](#what-the-ai-can-change)

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **Google Calendar** on.
2. No backfill scan (on-demand source) — exposure is immediate.
3. Ask a governed AI what's on your calendar; events come back vetted.

## What the AI can change

When your admin allows it, the AI can create, change and delete events
on the person's own calendars. Changes go through your organization's
Workspace delegation as that person, so they show up in Google Calendar
under their name, not under Whiteout.

| Kind of change | What the AI can do | Default |
|---|---|---|
| **Create** | An event with no one else invited | Allowed |
| **Edit** | Change an event without notifying anyone | Allowed |
| **Comment & post** | Create or change an event that invites anyone besides the person, or send a change to the people already on it ("notify") | **Needs approval** |
| **Delete, archive & merge** | Delete an event (with "notify", the default, attendees are told) | **Off** |

Set these in **Integrations → Whiteout AI Connector → Google Calendar →
What the AI can change**.

**Invitations count as sending.** An event is a send when it invites
anyone besides the person making it. "Notify" decides whether Google
emails the attendees about a change. Sending starts at **Needs
approval**: the AI says it's waiting on approval and gives a request
code, and approvers decide in **Agents → Approvals**, or from the
approval notification. Once it's approved, the AI retries the identical
request and the invitation is sent exactly once. A denied send isn't
asked about again for an hour.

**Inviting people outside your organization.** An invitation that
reaches any address outside your organization's own email domains is
tagged as an **External send**, so any Action Policy for external sends
(**Agents → Action Policies**) applies too. **Activity → MCP Activity**
shows each send's recipients: how many people, and which outside
domains.

**Deleting can reach people too.** Deleting an event with "notify" on
(the default) tells its attendees, so it's tagged as an external send
in the same way. It stays a **Delete** change: once you turn Delete on,
your Action Policies for external sends apply to it. A delete without
"notify" reaches no one.

**What's checked.** The event's title, description, location and
attendee addresses are checked against Google Calendar's policy set and
for planted instructions. Events are checked by their own id: a
**Hidden** event is refused as not found, and one restricted by policy
is refused. Calendars aren't checked, and are recorded as *not checked*.
See [Write Actions](./whiteout-ai-connector/write-actions.md#sending-email-and-invitations).

### Limits

- Event times need a time zone: an offset in the time, or a time zone
  setting.
- For an all-day event, the end date is the day after the event ends.
- Replacing an event's attendee list keeps the remaining guests' RSVPs.
- Attendee addresses must be plain ASCII email addresses (`Name
  <pat@example.com>` is fine), up to 100 per event. Addresses with
  non-ASCII characters are refused for now.
- Bad input, such as an invalid address or a line break in one, is
  refused before anything is held for approval. The AI is told what to
  fix right away, and no approval request is created.

### Before the AI can make changes

Changes in Google Calendar go only through your Google Workspace
domain-wide delegation. A personal Google sign-in still serves reads,
but never makes changes. A **Workspace super admin** adds this scope to
Whiteout's existing delegation entry:

```
https://www.googleapis.com/auth/calendar.events
```

In the Google Admin console, open **Security → Access and data control
→ API controls → Domain-wide delegation**, edit Whiteout's client and
add the scope to the end of the list. **Keep the scopes already there:
saving replaces the whole list.**

Until it's added, reads keep working and the AI is told your admin needs
to add it (`org_grant_missing`). The **What the AI can change** panel
shows exactly which scopes to add, with a button to copy them. See
[Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md#let-the-ai-make-changes-write-scopes).

## Audit log

Reads are on **Activity → AI Connector**; filter the source to Google
Calendar. Changes and invitations the AI made or tried to make are on
**Activity → MCP Activity**.
