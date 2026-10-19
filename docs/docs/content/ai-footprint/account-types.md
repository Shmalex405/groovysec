# Personal and Work Accounts

On supported AI sites, the Whiteout browser extension notes which kind of account each prompt was sent from: a personal account, your organization's workspace, or no account at all. Desktop Guard does the same in desktop AI apps that show the account on screen. A prompt sent from a personal ChatGPT or Claude account falls under that vendor's consumer terms, not your organization's contract, even when your policies allowed the prompt itself.

> **To allow or block by account,** set an [account rule](./governance/account-rules.md) on the AI app, for example "work accounts only" for ChatGPT. This page explains how the account is read and what each value means.

This needs browser extension 1.14.0 or later.

---

## Where it shows

| Where | What you see |
|---|---|
| **Governance → Prompt Review** | An **Account** column on each prompt |
| **Activity → AI Activity** | A **Personal accounts** column per tool: the share of that tool's prompts sent from personal accounts, out of the prompts whose account type is known. **—** means no account type was seen. |
| **Coverage → AI Footprint** | Chips on [Web AI](./ai-footprint/web-ai-sites.md) rows, such as **4 personal · 9 unknown**. These count people, not prompts, over the last 30 days. Someone who used two kinds of account is counted in both. |

This is the account on the **AI site**. It's different from the **Account** column under **Coverage → Enrollment → Browsers**, which is the account signed in to the browser profile. See [Browser coverage](./ai-footprint/browser-coverage.md).

AI apps people connected through your identity provider, and AI use from a [vendor's audit log](./ai-footprint/vendor-audit-logs.md), count as work accounts, because they went through your organization's own tenant. See [AI apps connected with work accounts](./ai-footprint/connected-ai-apps.md).

### What the values mean

| Value | Meaning |
|---|---|
| **Personal account**, or **Personal (Plus)** with the plan | A personal account or a personal plan on the AI site |
| **Work workspace**, for example **Work workspace (Enterprise)** | A business plan, signed in with one of your organization's email domains |
| **Work email, unverified workspace** | Signed in with one of your organization's email domains, but Whiteout couldn't confirm the workspace belongs to your organization |
| **Signed out** | Sent without signing in to the AI site |
| **Unknown account**, or **Unknown account (Team)** with the plan | The site was used, but Whiteout couldn't tell whose account it was |
| **Not observable** | This surface can't see the account: IDEs, desktop apps that don't show it, older extensions and sites not listed below. It never means a work account. |

**A personal plan wins over a work email.** Someone who signed up for ChatGPT Plus with their work address is counted as personal. The plan decides which terms cover the data, not the mailbox used to sign up.

---

## How each site is read

| Site | How Whiteout tells | What you'll see |
|---|---|---|
| **Claude** | The plan of the signed-in Claude organization, read from claude.ai with the page's own session (as the Claude page itself does), or else the plan label in Claude's sidebar | Free, Pro or Max: **Personal**. Team or Enterprise: **Unknown account (Team)** or **(Enterprise)**, because claude.ai doesn't show the account's email domain. |
| **ChatGPT** | The plan shown in ChatGPT's own interface: the label in the profile menu or sidebar, an **Upgrade plan** button (Free), or a workspace switcher. Whiteout never reads ChatGPT's session data. | Free, Plus, Pro or Go: **Personal**. Team, Business, Enterprise or Edu: **Unknown account** with the plan, because ChatGPT doesn't show the account's email domain. Guest chats: **Signed out**. |
| **Gemini** | The domain of the Google account shown on Gemini's account button. Only the domain is read. | gmail.com or another personal email provider: **Personal**. One of your organization's domains: **Work email, unverified workspace**. Any other domain: **Unknown account**. Not signed in: **Signed out**. |
| **Microsoft Copilot** (copilot.com, where copilot.microsoft.com now redirects) | The site itself. Both work and personal Microsoft accounts sign in there, so the site doesn't say which. | **Unknown account** |
| **Microsoft 365 Copilot** (cloud.microsoft and the Microsoft 365 Copilot app) | The site itself: it accepts work accounts only, but it doesn't show which organization | **Unknown account** |
| **Perplexity** | An Enterprise badge in Perplexity's interface | **Unknown account (Enterprise)** when the badge shows. Otherwise the account type can't be read. |
| **DeepSeek** | DeepSeek has no organization accounts | Always **Personal** |
| **Any other site** | Not read | **Not observable** |

Reading copilot.com as **Unknown account** needs browser extension 1.16.0 or later. If copilot.microsoft.com itself loads without redirecting, it still reads as **Personal** or **Signed out**, as before.

**Work workspace** needs a business plan and one of your organization's email domains together. None of the sites above shows both today, so **Work workspace** doesn't appear for them yet. Your organization's domains are the domain set up for your organization in Whiteout, any additional email domains registered for it, and the domain of a Google Workspace identity provider.

---

## Privacy

- **Never the email address.** For Gemini, only the domain part is read on the page. For the other sites, no email address is read at all.
- **Never tokens or session data.** Whiteout never reads the AI vendor's passwords, cookies, access tokens or session data. ChatGPT's session data carries an access token, so the extension reads only what ChatGPT shows on screen.
- **A one-way fingerprint, not an identity.** Whiteout stores a one-way fingerprint of the vendor account, mixed with your organization's ID, so repeat use of the same account can be recognized without storing who it is.
- **Never delays a prompt.** The account type is read when the page loads. If it can't be read, the prompt goes as normal and shows **Not observable**.
- **SOC events** include the account type and plan, never the fingerprint.

---

## What isn't built yet

- **Most desktop apps and all IDEs.** Desktop Guard reads the account only where a desktop app shows it on screen, and which apps it can read is still expanding. Prompts from coding agents show **Not observable**.
- **Confirming Team and Enterprise workspaces** on Claude, ChatGPT, Microsoft 365 Copilot and Perplexity. These show **Unknown account** with the plan, rather than **Work workspace**.
