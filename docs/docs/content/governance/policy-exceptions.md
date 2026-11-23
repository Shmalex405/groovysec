# Policy Exceptions for AI Apps

A group's policies normally apply the same way to every AI app. A **policy exception** changes that for one app: you can leave selected policies out for it, or stop checking its prompts against policy altogether while still recording them.

Use an exception when a policy is right for most AI apps but not for one of them. For example, an app that is covered by your enterprise agreement, or a coding assistant that your code policies shouldn't stop.

Exceptions are set per app under **Integrations → AI Applications**, organization-wide or per group.

> **An exception only removes checks.** It never makes an app stricter, and it never switches recording off. Every prompt sent to the app is still recorded with the person, the app and the text.

---

## The three choices

Every AI app has one of these settings:

| Choice | What happens to a prompt sent to that app |
|---|---|
| **All policies** | The default. Every policy a group has on applies. |
| **Selected policies don't apply** | The data classes, individual policies or custom rules you tick are skipped for this app. Everything else the group has on still applies, and the prompt still gets a normal result. |
| **Audit only** | No policy checks for this app. Nothing is blocked, warned about or redacted on policy grounds. Each prompt is recorded and marked **Audit only**, never **Compliant**. A reason is required. |

### What still applies

An exception changes policy checks only. These still apply to the app, whichever choice you make:

- **The allow or block switch.** A blocked app stays blocked. The block wins, and the exception has no effect until the app is allowed again.
- **Account rules.** See [Account Rules for AI Apps](./governance/account-rules.md).
- **Hidden-instruction checks** on files sent with a prompt.

---

## Set an exception for one app

1. Open **Integrations → AI Applications**, on the **Global Integrations** tab for the whole organization or **Group Integrations** for one group, and open the app.
2. Under **Policies for this app**, choose **All policies**, **Selected policies don't apply** or **Audit only**.
3. For **Selected policies don't apply**, tick what to skip:
   - A **data class**, such as Security or Code. The number beside it is how many policies it holds. Ticking a class also covers policies added to that class later.
   - **Custom rules**, to skip the group's custom rules. They're skipped together; you can't pick one custom rule.
   - **Choose individual policies**, to tick single policies instead of a whole class.

   The line under the list tells you how many policies won't apply to the app.
4. For **Audit only**, fill in **Reason (required)**, for example *covered by our enterprise agreement*. The reason is shown wherever the exception is listed.
5. Choose **Save**. The change applies from the next prompt, unless it needs approval (see [Approval for exceptions](#approval-for-exceptions)).

A selected-policies exception doesn't ask for a reason.

Once saved, the app's card shows a **Custom policies** or **Audit only** chip. A blocked app shows no chip.

**Cards that hold several apps.** On a combined card, such as OpenAI, Microsoft 365 Copilot or Google Workspace Gemini, the setting applies to every app on the card. To treat one of them differently, use **Set one app by itself** at the bottom of the section. If the apps differ, the section shows **Mixed**.

---

## Add an exception for several apps at once

The **Policy exceptions** card at the top of **Integrations → AI Applications** lists every app that has an exception: the app, what doesn't apply, and the reason. If there are none, it reads *Every app follows each group's policies.*

1. On the **Policy exceptions** card, choose **Add exception**. The **Add a policy exception** dialog opens.
2. **Which apps?** Select one or more apps. Choose **Show all apps** for the full list. Blocked apps aren't listed.
3. **What changes for them?** Choose **Selected policies don't apply** or **Audit only**.
4. **Which policies don't apply?** Tick the data classes, custom rules or individual policies. For Audit only, this step is **Why?** and asks for the reason.
5. Read **What this does**. It says in plain words which policies stop applying, to which apps and for whom. If one of the apps already has an exception, it tells you this one replaces it.
6. Choose **Add exception**.

The dialog works on the tab you opened it from: organization-wide on **Global Integrations**, or for the selected group on **Group Integrations**.

### Change or remove an exception

On the **Policy exceptions** card, choose **Edit** beside the app. Change the setting, or choose **Remove exception** to go back to all policies. You can also open the app and choose **All policies** under **Policies for this app**.

---

## Organization-wide and per group

An exception set on **Global Integrations** applies to everyone. A group can have its own setting for an app, which replaces the organization-wide one for that group.

On **Group Integrations**, open the app and look at **Policies for this app**:

- **Using the org-wide setting** means the group follows the organization-wide setting. Choose **Override for this group** to give the group its own.
- A group's own setting can be an exception, or **All policies**. Use **All policies** to keep a group fully checked while the rest of the organization has an exception; the section then reads **This group checks all policies**.
- **Reset to org-wide** removes the group's own setting, so it follows the organization-wide one again. It doesn't change the group's allow or block switch or its account rules.

An exception applies to the people in the group it's set for.

---

## Approval for exceptions

If your organization requires a second administrator's approval for policy changes (**Governance → Policy Approvals**), exceptions are covered:

- **Adding or widening an exception waits for a second admin's approval.** Until it's approved, the current setting stays in force, and the app shows **Pending approval**.
- **Removing or narrowing an exception applies at once**, because it only tightens what's checked.

Resetting a group to the organization-wide setting also waits when that gives the group a wider exception than it has now.

---

## On the Policies page

**Governance → Policies** shows which apps have exceptions for the group you're viewing, so you can see what a policy really covers:

- A banner for each audit-only app: ***App* is audit only.** None of the policies below are checked for it. Prompts are still recorded.
- Under each data class, **Doesn't apply to** with the apps that skip the whole class, or **Some policies don't apply to** with the apps that skip part of it. A class with no exceptions reads **Applies to every app**.
- On a policy an exception leaves out: **On · except** and the app's name.
- A note listing the apps the group's custom rules don't apply to.
- A notice when an exception change is waiting for approval.

Each app name and **Open in Integrations** link takes you to that app's setting.

The two pages work from the same saved settings. The Policies page decides which policies are on for a group; exceptions are made per app in Integrations. If you turn a policy off for a group, an exception that names it has no effect there, and the count on the Integrations page drops. If you turn it back on, the exception applies again.

---

## Where exceptions show up

Prompts sent to an app with an exception are recorded like any other. What changes is how they're labelled:

| Where | What you see |
|---|---|
| **Governance → Prompt Review** | An audit-only prompt reads **Audit only · not checked** in place of a clean result, and has its own count and its own **Audit only** choice in the status filter. A prompt checked under a selected-policies exception keeps its real result, with a chip such as **13 policies not applied**. The prompt's details have a **Policy scope** line, and exports carry it too: an audit-only prompt exports as **Not checked (audit only)**. |
| **Dashboard** | A separate **Audit only** figure, shown once there are such prompts. The block rate is worked out from checked prompts only. |
| **Activity → AI Activity**, **People** | Audit-only prompts are their own count. They aren't included in **Allowed**. |
| **Alerts & Audit → Reports** | Audit-only prompts are their own count, not part of **Allowed**. The **AI app policy exceptions** section lists the exceptions in effect (app, who it applies to, mode, what isn't applied, reason, who set it and when) and the changes made in the period. |
| **Governance → Compliance Evidence** | An **AI app policy exceptions** evidence item, with the same list and change history. If an app is set to **Audit only** now, or was at any point in the evidence period, the item reads **Partial**, and the controls that rely on it show as partially evidenced. Selected-policies exceptions are listed without changing the status. |
| **Alerts & Audit → Audit Log** | Every exception that's added, changed or removed, with the before and after, who made the change, and the reason. |
| **Alerts & Audit → Notifications** | One notification when an exception is added or widened. |
| **SOC/SIEM events** | An event for each exception change. Prompt events say which exception applied. |

---

## Limits

- **Exceptions only remove policies.** You can't give one app stricter rules than its group has.
- **Not every surface has them.** Exceptions aren't available for the infrastructure agent, the SDKs, the Whiteout AI Connector or Secure AI chat.
- **File uploads follow the exception only when the upload says which app it's for.** Otherwise the file is checked against all policies. An older version of the browser extension may not name the app, so keep the extension up to date.
- **The app is reported by the person's device.** If Whiteout can't tell which app a prompt is going to, all policies apply. An exception is never applied by guesswork.
- **Exceptions don't expire.** There's no review-by date. An exception stays until an administrator removes it.
- **Audit-only organizations.** No policies are checked for any app, so there's nothing to except, and exceptions can't be added. See [Audit-Only Mode](./governance/audit-only-mode.md).

## Next steps

- [Account Rules for AI Apps](./governance/account-rules.md): allow an app with work accounts only.
- [Audit-Only Mode](./governance/audit-only-mode.md): the organization-wide mode that Audit only mirrors for one app.
- [Compliance Evidence](./compliance-evidence/overview.md): how evidence items and control statuses are worked out.
