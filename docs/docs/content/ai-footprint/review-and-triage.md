# Review and Triage

**Review**, in **Coverage → AI Footprint**, is the queue of everything that needs a decision: [shadow AI findings](./ai-footprint/shadow-ai.md) and the other finding types below, plus known vulnerabilities in the AI tools on your devices. This page explains how to filter the queue, save the views you use, and act on findings one at a time or many at once.

> **Nothing here changes a device.** **Acknowledge**, **Mute**, **Snooze** and **Reopen** change a finding's status in Whiteout. They don't block, remove or change anything on a device.

---

## The queue

Each row is one finding or one known vulnerability. Findings that look identical (same status, same type, same person or device, same tool) are merged into one row with a **×N** chip. Acting on that row acts on every finding in it.

| Column | What it shows |
|---|---|
| **Severity** | **Critical**, **High**, **Medium** or **Low**. A known vulnerability with no published score shows **Not rated**. |
| **Finding** | The finding type, with a short reason under it. For a known vulnerability: the advisory, the affected versions and the version that fixes it. |
| **Tool** | The tool. **×N** means N findings were merged into this row. |
| **User / source** | The person and device, or the source. For a known vulnerability, how many devices are affected. |
| **First seen**, **Last seen** | When the finding was first and last seen |
| **Status** | **Open**, **Acknowledged**, **Muted**, **Snoozed** or **Resolved**. Hover a **Snoozed** chip to see when it reopens. |
| **Days** | How many days the finding has been observed |
| **Action** | **Review** opens the finding |

Select a column header to sort by **Severity** (the default, worst first), **Tool**, **First seen**, **Last seen** or **Days**. Select it again to reverse the order. The queue lists every matching finding, 25, 50 or 100 to a page.

Above the queue, two charts follow your filters: **New findings** per day over the last 30 days, and **By severity**. Select a severity in the chart to filter by it. When more than 500 findings are in scope, the charts cover the 500 most recently seen; the queue still lists them all.

---

## Filters

Pick a group or a person to scope the queue to them. The same choice applies in Inventory. Then:

| Filter | Options |
|---|---|
| Status | **Open** (the default), **Acknowledged**, **Muted**, **Snoozed**, **Resolved** or **All**, each with its count |
| Kind | **All**, **Installed**, **Running** or **Active**. They match the sections of [Shadow AI findings](./ai-footprint/shadow-ai.md). |
| Search | A tool, person, device or site. Every word you type must match. |

Choose **Filters** for the rest:

| Filter | Options |
|---|---|
| **Finding type** | Any of the [finding types](./ai-footprint/review-and-triage.md#finding-types), including **Known vulnerability** |
| **Severity** | **Critical**, **High**, **Medium**, **Low**, and **Unknown** for known vulnerabilities with no score |
| **Seen by** | Where findings came from: **Devices (Desktop Guard)**, **Browser extension**, **Imported network logs**, **Vendor audit logs**, **Servers and workloads**, **AI connectors and sign-ins** or **Other** |
| **Browser** | The browser a finding came from |
| **Catalog** | **Only AI the catalog doesn't know** |
| **Dates** | **First seen** and **Last seen**, each with **From** and **To**. Days are in your local time. |

**Seen by** and **Browser** list only the values your findings have. Each filter you set shows as a chip next to **Filters**. Remove one there, or choose **Clear all**.

---

## Saved views

The **Views** strip above the queue holds named sets of filters. Select a view to apply it.

| View | Shows |
|---|---|
| **All open** | Every open finding and known vulnerability |
| **New this week** | Open findings first seen in the last 7 days |
| **Unknown apps** | Open findings for installed or running AI that the catalog doesn't know |

Your own views come next, then views other admins shared, marked with their email.

**Save a view.** Set up the filters and sort you want, choose **Save view**, and give the view a name of up to 60 characters. Turn on **Share with every admin** to let the other admins open it. Only you can change it. **Save view** is greyed out while the queue already matches a view.

A view keeps the status, the filters and the sort. It doesn't keep the group or person you picked, so one view works for any scope.

**Change a view.** Select the **…** button next to one of your views:

- **Save the current filters to this view** replaces what the view shows with the filters on screen.
- **Rename…**
- **Share with every admin**, or **Stop sharing**.
- **Delete**.

The three built-in views and views other admins shared can't be changed. Read-only viewers can open views, but can't save them.

---

## Acknowledge, mute, snooze and reopen

Act on one finding from its drawer, or on several at once with the bulk bar. Either way, a merged (**×N**) row acts on every finding in it.

| Action | Applies to | What happens |
|---|---|---|
| **Acknowledge** | Open findings | They move to **Acknowledged**, with your note. Use it when you've reviewed them and accept them. |
| **Mute** | Open findings | They move to **Muted** and stay there until someone reopens them. Use it for findings you don't want in the queue but don't want to sanction either. |
| **Snooze** | Open findings | They move to **Snoozed** until the date you pick, then go back to **Open** if the tool is still there. Use it to come back later, for example after a rollout. |
| **Reopen** | Acknowledged, muted and snoozed findings | They go back to **Open**. The acknowledgement or mute, its note and the snooze date are cleared. The admin audit log keeps the history. |

- **Notes.** **Acknowledge** asks why it's OK. If you leave the note empty, it's *Acknowledged from AI Footprint*. **Mute** and **Snooze** take an optional note. **Reopen** takes no note.
- **Snooze date.** It starts at a week from today. Pick any day from tomorrow to a year from today. The findings reopen at the start of that day, in your local time.
- **Audit.** Every action is recorded in the admin audit log, with who did it and the note.

### One finding

Choose **Review** on a row to open its drawer: a plain-language reason, the evidence, a **Recommended action**, and a link to the guide for that kind of finding. The drawer shows only the actions that fit the finding's status:

- **Open:** **Acknowledge finding**, **Mute** and **Snooze…**, with one **Note** box that's kept with whichever you choose, for example *Sanctioned for the data team, tracked in JIRA-1234*. **Snooze…** asks for the date first.
- **Acknowledged**, **Muted** or **Snoozed:** the drawer says when it was set aside and shows the note, for example *Muted on …* or *Snoozed until …*, and offers **Reopen finding**.
- **Resolved:** nothing to do. It reopens by itself if the evidence comes back.

An open finding's drawer can also offer:

- **Add to catalog**, to name and classify an unknown tool. See [Add to catalog](./ai-footprint/overview.md#add-to-catalog).
- **View process details and IOCs**, for a running AI process
- **Register as custom app**, for an unknown installed tool, when Custom AI Apps is on for your organization

### Many findings

Select rows with their checkboxes. The checkbox in the header selects every row on the page that an action applies to. Your selection stays when you move between pages, and clears when you change the filters or the sort.

A bar with **Acknowledge**, **Mute**, **Snooze** and **Reopen** appears above the queue. If only some of the selected rows qualify for an action, its button says how many, for example **Reopen 3**. Resolved findings and known vulnerabilities can't be selected. Each action asks you to confirm, with the note and date described above.

When it's done, a message says how many findings changed and how many were skipped, for example because they were already muted. If some fail, those rows stay selected and the message offers **Retry**.

---

## Statuses

| Status | Meaning | Changes by itself when |
|---|---|---|
| **Open** | Needs a decision | It resolves when the tool is no longer found, when a Whiteout surface starts governing it, or when you allowlist it. |
| **Acknowledged** | Reviewed and accepted, with a note | It doesn't. It stays acknowledged until someone reopens it. |
| **Muted** | Set aside, without accepting it | It doesn't. It stays muted until someone reopens it. If the tool is seen again, the muted finding just updates. |
| **Snoozed** | Set aside until a date | It goes back to **Open** on that date if the tool is still there. If the tool goes away first, it resolves. |
| **Resolved** | Closed by Whiteout: the tool is gone, governed or allowlisted | It reopens if the evidence comes back. |

Disconnecting a [vendor audit log](./ai-footprint/vendor-audit-logs.md) also resolves that vendor's open and snoozed findings. Its acknowledged and muted findings stay as they are.

Muting, snoozing and reopening don't raise notifications. A snoozed finding that goes back to **Open** doesn't raise a new notification or SOC/SIEM event.

### Mute a finding or mute a category

- **Mute** in Review acts on the finding or findings you choose. A new finding for the same tool on another device still opens.
- **Muted categories**, under **Controls → Exceptions**, stop findings for a whole category everywhere.
- To stop findings for one tool everywhere, allowlist it under **Controls → Exceptions**, or select it in **Inventory** and choose **Allowlist**.

See [Mute, allowlist, acknowledge or add to catalog](./ai-footprint/shadow-ai.md#mute-allowlist-acknowledge-or-add-to-catalog) for when to use each.

---

## Known vulnerabilities

Whiteout checks the versions of the AI tools it finds against public advisories. When devices run an affected version, a **Known vulnerability** row appears in Review.

- **Where advisories come from.** Desktop apps and editor extensions are checked against Whiteout's curated advisory list. Package versions are checked against OSV.dev, unless that's turned off for your deployment. Installs that report no version can't be checked.
- **Only advisories.** Choose **Filters → Finding type → Known vulnerability**. A line above the queue then says where advisories come from and when the last check ran.
- **From a tool.** In Inventory, a tool with an affected version has a vulnerability chip. Select it to open Review with only that tool's advisories, under an **Advisories for** chip.
- **The advisory.** **Review** shows the fix (the version to update to), the installed versions with their device counts, the affected devices, references, and when it was first and last detected. **Open in AI tools** shows the affected tools in Inventory.
- **Closing.** A known vulnerability resolves by itself once no device runs an affected version, for example after the devices update. It can't be acknowledged, muted or snoozed.

---

## Finding types

| Finding | What it means | Guide |
|---|---|---|
| **Shadow AI — installed** | AI software is on a device where no Whiteout surface covers it | [Shadow AI findings](./ai-footprint/shadow-ai.md#installed) |
| **Shadow AI — running** | An uncatalogued AI process is running on a device | [Shadow AI findings](./ai-footprint/shadow-ai.md#running) |
| **Suspicious compute** | An untrusted program uses heavy compute with no proof of AI | [Shadow AI findings](./ai-footprint/shadow-ai.md#running) |
| **Shadow AI — active** | AI traffic from a source no Whiteout surface governs, including browsers or browser profiles without the extension | [Shadow AI findings](./ai-footprint/shadow-ai.md#active), [Browser coverage](./ai-footprint/browser-coverage.md) |
| **AI use with no Whiteout on any device** | Imported network logs show a known user using AI, with no live Whiteout surface on any of their devices | [Importing network logs](./ai-footprint/network-logs.md#ungoverned-usage) |
| **AI use by someone we can't match to a user** | Imported network logs show AI traffic from an identity that isn't a Whiteout user | [Importing network logs](./ai-footprint/network-logs.md#unknown-actor) |
| **Shadow AI — active**, for built-in browser AI | A browser's built-in AI, such as Gemini in Chrome, was used with nothing checking it | [Built-in browser AI](./ai-footprint/built-in-browser-ai.md#built-in-browser-ai-in-use) |
| **AI use with no Whiteout on any device**, seen only in a vendor's audit log | The vendor's own audit log shows AI use that no Whiteout device saw | [Vendor audit logs](./ai-footprint/vendor-audit-logs.md#seen-only-in-the-vendors-audit-log) |
| **Unapproved AI app connected** | Someone gave an AI app your organization hasn't approved access to company data, through their work account | [AI apps connected with work accounts](./ai-footprint/connected-ai-apps.md#unapproved-ai-app-connected) |
| **Personal account used** | Someone used an AI app with a personal account where your account rule allows work accounts only | [Account rules](./governance/account-rules.md#personal-account-used) |
| **Workspace not on your list** | Someone used an AI app with a work account in a workspace your account rule doesn't list | [Account rules](./governance/account-rules.md#workspace-not-on-your-list) |
| **Known vulnerability** | A discovered AI tool runs a version with a published advisory on some devices | [Known vulnerabilities](./ai-footprint/review-and-triage.md#known-vulnerabilities) |

The queue also shows **Custom app bypass** findings for [Custom AI Apps](./custom-ai-apps/monitoring-and-troubleshooting.md) and **Connector still connected** findings for the [Whiteout AI Connector](./whiteout-ai-connector/overview.md).

New findings raise the **Shadow AI detected** notification in **Alerts & Audit → Notifications**, and they're sent to your SOC/SIEM destinations. A link to a finding from a notification or another page opens it in Review.

---

## Who can do what

| Role | Can |
|---|---|
| Admin | Everything on this page. Only the admin who saved a view can change or delete it. |
| Read-only | See the queue, open findings and known vulnerabilities, and open saved views. Can't select rows, acknowledge, mute, snooze or reopen findings, or save views. |

---

## Versions

Review needs admin app 2.98.0 or later. **Mute**, **Snooze**, **Reopen** and views shared with other admins also need the platform update released alongside it. Until your deployment has that update, the drawer and the bulk bar offer **Acknowledge** only, and the views you save are kept on your computer. The strip then says **Saved on this computer until the next platform update**.
