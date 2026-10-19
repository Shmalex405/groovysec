# Account Rules for AI Apps

An account rule lets you allow an AI app with work accounts and stop it being used with personal ones: for example, allow ChatGPT with your company workspace, but not with someone's personal ChatGPT Plus. A prompt sent from a personal account falls under the vendor's consumer terms, not your organization's agreement, even when the prompt itself is fine.

Account rules are set per app under **Integrations → AI Applications**, organization-wide or per group.

> **The account is a strong signal, not proof.** Whiteout reads which account is in use from the AI app itself, on the person's device: from the page in the browser, or from what the desktop app shows on screen. Someone determined could change what the page shows. Treat account rules as a guardrail for honest mistakes, and keep MDM as the hard control.

---

## Which apps

Account rules are available for the apps where Whiteout can tell which account is in use: **ChatGPT**, **Codex**, **Claude**, **Gemini**, **Copilot**, **Perplexity** and **DeepSeek**. The **Accounts** control appears only on these apps. DeepSeek has no work accounts, so a rule there treats every DeepSeek account as personal.

On the web, see [how each site's account is read](./ai-footprint/account-types.md#how-each-site-is-read). For desktop apps, Desktop Guard reads the account where the app shows it on screen. Which desktop apps it can read is still expanding. Where it can't tell, the prompt shows **Not observable** and the rule doesn't apply.

---

## Set a rule

1. Open **Integrations → AI Applications**, on the **Global Integrations** tab for the whole organization or **Group Integrations** for one group, and open the app.
2. Under **Accounts**, choose who can use it:

   | Choice | Who can send |
   |---|---|
   | **Any account** | Anyone. This is the default, and it's the same as no rule. |
   | **Work accounts only** | Accounts signed in with one of your organization's email domains, including a work email on a workspace Whiteout couldn't confirm is yours |
   | **Work accounts in these workspaces** | Work accounts in the workspaces you list. See [Listing workspaces](#listing-workspaces). |

3. Tick **Also allow use without signing in** if people may use the app signed out, for example consumer Copilot. Otherwise signed-out use counts as not allowed.
4. Choose the mode: **Enforce**, **Warn** or **Monitor**. See below.
5. Before you save, the panel shows how many of the app's prompts came from personal accounts in the last 30 days, so you can see the impact first.
6. Choose **Save account rule**.

Your organization's email domains are the domain set up for your organization in Whiteout, any additional email domains registered for it, and the domain of a Google Workspace identity provider.

**Groups.** A group's own rule replaces the organization-wide one for that group, the same way a group's allow or block does. If the app is blocked for a group, the block wins and the account rule doesn't apply.

**Audit-only organizations.** Nothing is blocked or warned. Prompts that a rule would have stopped are recorded as **would block**. See [Audit-only mode](./governance/audit-only-mode.md).

---

## Modes

| Mode | What happens when someone sends from an account the rule doesn't allow |
|---|---|
| **Enforce** | The prompt isn't sent. The person sees a card telling them how to switch to their work account. There's no override. |
| **Warn** | The person sees the same card with **Send anyway**. No reason is asked for. Each warning, and each **Send anyway**, is recorded. |
| **Monitor** | Nothing is shown and nothing is blocked. The prompt is recorded as one the rule would have blocked. |

Start with **Monitor** or **Warn** to see how often it happens, then move to **Enforce**.

### What people see

With **Enforce**, the card reads, for example:

> Your organization allows ChatGPT with your work account. You're signed in with a personal account. Switch to your work account to continue.

If they're signed out, it asks them to sign in with their work account. If the workspace isn't on your list, it asks them to switch to your organization's workspace. Each app's card adds a one-line hint:

| App | Hint |
|---|---|
| ChatGPT | Open your profile menu in ChatGPT and switch to your work workspace, or sign out and sign in with your work account. |
| Claude | Open your account menu in Claude and switch to your organization, or sign out and sign in with your work account. |
| Gemini | Switch to your work Google account from the profile picture in Gemini, or use a browser profile signed in with your work account. |
| Copilot | Sign in to Copilot with your work (Microsoft Entra) account, or use Microsoft 365 Copilot Chat with your work account. |
| Perplexity | Sign out of Perplexity and sign in with your work account. |
| Codex | Sign out of Codex and sign in with your work ChatGPT account. |
| DeepSeek | DeepSeek has no work accounts. Use an AI tool your organization provides instead. |

The check happens when the person sends, not when they open the site, so they can always reach the app's account switcher.

---

## When Whiteout can't tell the account

**If Whiteout can't tell which account is in use, the prompt always goes through.** It's recorded as **not checked**. There's no setting to block unknown accounts: Whiteout never blocks a prompt because of something it can't see.

How each kind of account is treated:

| Account | Any account | Work accounts only |
|---|---|---|
| **Work workspace** | Sent | Sent |
| **Work email, unverified workspace** | Sent | Sent |
| **Personal account** (for example ChatGPT Plus, Claude Pro, a gmail.com Gemini account) | Sent | Not allowed |
| **Signed out** | Sent | Not allowed, unless you ticked **Also allow use without signing in** |
| **Unknown account** (for example ChatGPT Team or Claude Enterprise, where the site shows the plan but not whose workspace it is) | Sent | Sent, recorded as not checked |
| **Not observable** (the surface can't see the account) | Sent | Sent, recorded as not checked |

So on ChatGPT and Claude, **Work accounts only** stops personal plans and signed-out use, while business-plan accounts go through.

**Microsoft Copilot on the web** now lives at `copilot.com` (`copilot.microsoft.com` redirects there). Both work and personal Microsoft accounts land on it, so Whiteout shows the account there as unknown, and a Copilot account rule records those prompts as not checked rather than blocking them.

See [Personal and work accounts](./ai-footprint/account-types.md) for what each value means.

### Listing workspaces

**Work accounts in these workspaces** narrows the rule to the workspaces you list. An account in any other workspace counts as not allowed, and raises [Workspace not on your list](#workspace-not-on-your-list).

Few AI apps show which workspace an account belongs to, so today this check applies only rarely. Where Whiteout can't tell the workspace, the prompt goes through and is recorded as not checked.

Whiteout never sees a workspace's own ID on these sites, so you can't type it in from the app's admin settings. It identifies a workspace by a one-way fingerprint, its **account reference**. The way to list a workspace is from a **Workspace not on your list** finding:

- Open the finding and choose **Allow this workspace**. Whiteout adds it to the app's organization-wide rule, and the finding resolves on the next discovery check.
- Or copy the finding's account reference (`account_ref` in its evidence) into the **Workspace account reference** field of the rule.

If the organization-wide rule doesn't list workspaces, the finding came from a group's rule. **Allow this workspace** says so rather than changing the rule for everyone else; add the reference in that group's **Accounts** control instead.

---

## Where it's recorded

- **Governance → Prompt Review** shows the rule's outcome under the account on each prompt: **Blocked by the account rule**, **Account warning shown**, **Sent anyway after an account warning**, **Account rule: would block (monitor)** or **Account rule: not checked**. It's in the CSV export too.
- **SOC/SIEM events** include the outcome.
- **Admin audit log** records every change to an account rule.
- **Coverage → AI Footprint → Findings** raises the two findings below.

---

## Personal account used

**Personal account used** means someone used an AI app with a personal or signed-out account that the app's account rule doesn't allow. There's one finding per person and app, covering the last 7 days. The line under it says what the rule did: **Blocked by an account rule**, **Warned by an account rule** or **Recorded by an account rule (monitor)**.

**Why it matters.** Work data sent from a personal account sits in that person's own account, under the vendor's consumer terms, outside your organization's agreement and its retention and legal-hold settings.

**Severity:**

| Severity | When |
|---|---|
| **High** | At least one prompt that got through also matched one of your policies |
| **Medium** | Prompts got through (warned, sent anyway or monitor mode), with no policy match |
| **Low** | Every prompt was stopped, so nothing reached the personal account |

**What to do:**

1. **Talk to the person.** Ask them to switch to their work account. The card already told them how.
2. **If it keeps happening in Warn or Monitor mode,** consider moving the rule to **Enforce**.
3. **Acknowledge the finding** with a note.

It resolves by itself when there have been no such prompts for 7 days.

## Workspace not on your list

**Workspace not on your list** means someone used an AI app with a work account, but in a workspace your account rule doesn't list. There's one finding per app and workspace. It lists the people who used it.

**Why it matters.** It may be a team workspace someone set up outside IT, with its own settings, members and data retention, that your organization doesn't administer.

**Severity.** **High** if any prompt sent there matched one of your policies, otherwise **Medium**.

**What to do:**

1. **Find out who owns the workspace.**
2. **If it's yours,** choose **Allow this workspace** on the finding. See [Listing workspaces](#listing-workspaces).
3. **If it isn't,** ask its users to move to your organization's workspace.
4. **Acknowledge the finding** with a note.

It resolves by itself when there have been no such prompts for 7 days.

---

## Limits

- **The account is client-reported.** It's read on the person's device from what the AI app shows, so a determined person could change it. Account rules fail open: if the check can't run, the prompt goes through. MDM remains the hard control.
- **Business plans are often unknown.** On ChatGPT and Claude, Team and Enterprise accounts can't yet be confirmed as yours, so they go through rather than being treated as work accounts. On `copilot.com`, every account shows as unknown.
- **Desktop apps.** Which desktop apps show the account is still expanding. Where Desktop Guard can't read it, the rule doesn't apply.
- **IDEs and coding agents** don't report an account, so rules don't apply there.
