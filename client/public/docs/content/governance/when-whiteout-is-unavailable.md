# When Whiteout Is Unavailable

Whiteout AI checks messages before they reach an AI tool. Sometimes Whiteout itself can't give an answer: a user's sign-in has expired, their device is offline, Whiteout's service has a problem, or a check takes too long. This page explains what your users see when that happens, what is recorded for administrators, and how to get alerted.

> **By default, a Whiteout problem never stops or slows down anyone's AI tools.** The message is sent immediately, the user sees a short notice, and the message is recorded and checked afterward, so it still appears in Prompt Review. If your organization requires a check before anything is sent, the message is held instead, and the user's text stays in the box.

This page is about Whiteout being *unable* to check a message. A message that is checked and breaks a policy is blocked as usual.

---

## Why Whiteout can be unavailable

| Reason | What happened | What the user needs to do |
|--------|---------------|---------------------------|
| **Sign-in expired** | The device's Whiteout sign-in has expired and couldn't be renewed. | Sign in again. |
| **Not signed in** | The browser extension or IDE extension has no Whiteout sign-in at all. | Sign in. |
| **Whiteout service problem** | Whiteout's service returned an error or asked devices to slow down. | Nothing. Protection comes back on by itself. |
| **Offline** | The device can't reach Whiteout: no internet connection, a VPN or proxy problem, or a firewall blocking Whiteout. | Check the internet or VPN connection. |
| **Check timed out** | Whiteout didn't answer in time. | Nothing. |

While a device is in one of these states, it stops asking Whiteout for a verdict on each message, so nothing waits on a check that can't finish. It keeps trying to reconnect in the background, waiting a little longer between attempts each time, up to five minutes. As soon as a sign-in or a connection succeeds, checks resume on the next message.

---

## Choose what happens: fail open or fail closed

Your organization decides whether messages go through or are held while Whiteout can't check them.

1. In the admin app, go to **Coverage → Enrollment**.
2. Open the **Settings** tab.
3. In the **Compliance Enforcement** card, choose **Fail open** or **Fail closed**.

| | **Fail open** (default) | **Fail closed** |
|---|---|---|
| **The message** | Sent immediately, with no waiting. | Not sent. The text stays in the box so the user can send it later. |
| **What the user sees** | An amber **Sent without a Whiteout check** notice. | A **Message not sent** notice. |
| **What admins get** | The message is recorded with its text and checked afterward. It appears in Prompt Review. | A count of held messages in the outage alert. Nothing left the device, so there's no Prompt Review entry. |

The setting applies to your whole organization. It covers every reason in the table above, as well as the compliance engine itself being unavailable. Devices remember the last setting they received, so a device that restarts during an outage still follows a **Fail closed** setting.

In [audit-only mode](./governance/audit-only-mode.md), nothing is ever blocked, so the setting is locked to **Fail open**.

---

## What users see

### Fail open (default)

- **The first message in an outage** shows a card titled **Sent without a Whiteout check**. The card explains why and gives one line on what to do. For sign-in problems it has a **Sign in** button. The card is amber, disappears after a few seconds, and doesn't take focus, so the user can keep typing.
- **Later messages in the same outage** show a single line, such as **Sent unchecked · sign-in expired**, instead of the full card. If the outage is still going 30 minutes later, the full card is shown again.
- **When Whiteout is working again**, the user sees **Connection restored. Protection active.** once.
- **There are no pop-up dialogs** and nothing to dismiss.

What the card says, by reason (Desktop Guard wording):

| Reason | Message | What to do |
|--------|---------|------------|
| Sign-in expired | Your Whiteout sign-in has expired, so this message wasn't checked. It's been recorded for your admin. | To turn protection back on, sign in: click the Whiteout icon in the menu bar and choose **Sign In**. (On Windows the card says *system tray* instead of *menu bar*.) |
| Not signed in | You're not signed in to Whiteout, so this message wasn't checked. It's been recorded for your admin. | Sign in to Whiteout to turn protection back on. |
| Whiteout service problem | Whiteout is having a problem on its end, so this message wasn't checked. It's been recorded for your admin. | Nothing to do. Protection turns back on automatically. |
| Offline | Whiteout can't reach its server, so this message wasn't checked. It will be recorded for your admin when you're back online. | Check your internet or VPN connection. |
| Check timed out | Whiteout took too long to respond, so this message was sent without a check. It's been recorded for your admin. | Nothing to do. |

In the browser extension, the sign-in direction reads *"click the Whiteout extension icon and sign in"* instead.

### Fail closed

The message isn't sent, and the user sees a card titled **Message not sent**:

> Whiteout can't check messages right now (sign-in expired), and your organization requires a check before anything is sent. Your message is still in the box.

The card gives the same directions as the table above and has a **Sign in** button for sign-in problems. Once the problem is fixed, the user can send the message as normal.

### Status indicators

While Whiteout is unavailable, the Desktop Guard menu bar or system tray icon and the VS Code and JetBrains status bars show the state instead of a generic error:

- **Not protected: sign-in expired**. For Desktop Guard, **Sign In…** is the first item in its menu.
- **Not protected: not signed in**
- **Not protected: Whiteout service issue (retrying)**
- **Not protected: offline**
- **Not protected: Whiteout not responding (retrying)**

The browser extension's toolbar popup shows a shorter badge, such as **Not protected · sign-in expired**.

### On each surface

| Surface | During an outage |
|---------|------------------|
| **Desktop Guard** (macOS and Windows) | The card appears next to the AI app. The menu bar or tray icon shows the status, and its menu offers **Sign In…**, which goes to your identity provider or, without SSO, to an email-and-password sign-in. |
| **Browser extension** | The card appears on the AI site. The toolbar popup shows the status and, for sign-in problems, the sign-in form. |
| **Coding agents** (Claude Code, Codex, Cursor) | Prompts go through at once. The Whiteout defender hooks add a one-time note to the agent session, telling the user to sign in from the Whiteout menu bar or tray icon, or the VS Code status bar. With **Fail closed**, the prompt is stopped with the **Message not sent** explanation. |
| **VS Code extension** | The status bar shows the status. One notification per outage, with a **Sign In** button for sign-in problems. |
| **JetBrains plugin** | The status bar shows the status. One notification per outage. The plugin reviews coding-agent activity after it happens and never holds messages, so it doesn't block anything. |

---

## What admins see

### Prompt Review

Go to **Governance → Prompt Review**.

- Every message sent without a check has an amber **Sent unchecked · *reason*** label, for example **Sent unchecked · offline**.
- The **Status** column shows the result of the check that ran after the message was sent. **Flagged** means it broke a policy and would have been blocked. **Allowed** means it was fine.
- Hover over the label for details, including when the message couldn't be checked afterward (for example, because the compliance engine was also unavailable).
- To see only these messages, open the filters and choose **Status → Sent unchecked**.

How these messages reach Prompt Review:

- **Messages appear once the device can reach Whiteout again.** A device that was offline sends its records when it reconnects. A device whose sign-in expired sends them right away, during the outage.
- **Records wait on the device for up to 7 days.** Anything older is discarded and never appears.
- **Messages from Desktop Guard and the browser extension are checked afterward.** If the text of the message couldn't be read, the Prompt Review entry says so and there is nothing to check.
- **Messages from coding agents** (Claude Code, Codex, Cursor) are covered by the normal coding-agent session review, not by this after-the-fact check. They don't carry the **Sent unchecked** label, but the outage still shows on the Devices page and in notifications.
- **Messages held by Fail closed** never left the device, so they don't appear in Prompt Review. They're counted in the outage alert.

### Devices page

Go to **People → Devices**. A device that currently can't get checks shows an amber label such as **Checks unavailable since 4:35 PM · sign-in expired**, both in the list and on its detail page. The label clears automatically when the device recovers.

### Notifications

Whiteout has two notification events for outages, in **Alerts & Audit → Notifications**:

| Event | Severity | When it fires |
|-------|----------|---------------|
| **Device sending prompts unchecked** (`device.checks_unavailable`) | High | Once per outage per device, when Whiteout first hears about it. It names the user, the device, the Whiteout client, the reason, and how many messages have gone out unchecked so far. It links to the device page. |
| **Device checks restored** (`device.checks_restored`) | Info | When the outage ends. It gives how long the outage lasted and how many messages went out unchecked or were held. |

- **You're alerted by default.** Every organization has a **Critical platform events** rule that Whiteout creates automatically. It includes device events of medium severity and above, so **Device sending prompts unchecked** appears in the Notification Center feed for administrators with no setup.
- **One alert per outage, never one per message.**
- **A device that was offline for the whole outage** produces a single alert once it reconnects, marked **(recovered)**, instead of two.
- **Alerts never include message text.**

**To get these alerts by email, Slack, Microsoft Teams, PagerDuty or a webhook:**

1. On the **Channels** tab, add the channel.
2. On the **Rules** tab, edit **Critical platform events** and add the channel. Or create a new rule with the event type **Device sending prompts unchecked**.
3. Use the rule's test button to send a test event.

To be told when devices recover as well, create a rule for **Device checks restored** with the minimum severity set to **Info**.

---

## How recorded messages are protected

- **Encrypted on the device.** Messages waiting to be uploaded are encrypted at rest: with a key held in the macOS Keychain, with Windows Data Protection (DPAPI) for the signed-in Windows user, or with a browser key that can't be exported.
- **Kept for at most 7 days**, then discarded if they couldn't be uploaded.
- **Uploaded only for the account that sent them.** If someone else signs in on the same device, they can't upload another person's records under their own account.
- **Recorded even while a sign-in is expired.** Whiteout accepts outage records from a device whose sign-in has lapsed, so you see the outage while it's happening. This only records outage events. It can't be used to sign in or to read anything.

---

## Versions that support this

| Client | Version |
|--------|---------|
| Desktop Guard (macOS and Windows) | 1.8.84 or later (1.8.86 or later for the **Sign In…** wording) |
| Browser extension (Chrome, Edge, Firefox, Safari) | 1.11.0 or later |
| VS Code extension | 1.23.0 or later |
| JetBrains plugin | 1.7.0 or later |
| Whiteout defender hooks (Claude Code, Codex, Cursor) | 1.10.0 or later, installed by Desktop Guard and the VS Code extension |

Older versions don't record messages sent during an outage, and they can make users wait several seconds for a check that can't succeed. Desktop Guard and the desktop app update themselves. Browser extensions update from their stores.

---

## Troubleshooting

**A user keeps seeing "sign-in expired".**
Ask them to choose **Sign in** on the card, or **Sign In…** from the Whiteout menu bar or tray icon. In the browser, they click the Whiteout extension icon and sign in. If it comes back soon after they sign in, contact support@groovysec.com.

**Many devices show "Whiteout service problem" at the same time.**
The problem is on Whiteout's side, and users don't need to do anything. Messages keep flowing (with **Fail open**) and are checked once the service recovers. If it lasts more than a few minutes, contact support@groovysec.com.

**One device shows "offline" while it has internet access.**
Something between the device and Whiteout is blocking it: a VPN, a proxy, or a firewall rule. Make sure the device can reach your organization's Whiteout address (for example, `https://<your-org-slug>.api.whiteout.groovysec.com` on SaaS).

**An outage alert arrived, but Prompt Review shows nothing for that device.**
The records upload when the device can reach Whiteout. They might also be coding-agent prompts, which don't carry the label, or messages held by **Fail closed**, which aren't sent at all. Check the alert's counts and the device's label on the **Devices** page.

**Will users be blocked when Whiteout is down?**
Only if your organization uses **Fail closed**. With the default **Fail open**, AI tools keep working, and every unchecked message is recorded and checked afterward.
