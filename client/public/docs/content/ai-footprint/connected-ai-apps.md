# AI Apps Connected With Work Accounts

People connect AI apps to their work account all the time: a meeting notetaker that joins their calendar, a ChatGPT or Claude connector that reads their Gmail or Drive, an AI writing tool they signed in to with Google or Microsoft. Each one is recorded in your identity provider, whatever device or browser it was done from. Once a day, Whiteout checks Google Workspace, Microsoft 365 and Okta for AI apps people connected with their work account, and shows them in AI Footprint.

> **Finding an app never removes it.** Detecting needs read-only access. Removing an app's access needs its own permissions, and it's always an admin action, unless you turn on **Remove access automatically**.

The check is on for every organization that gives Whiteout read access to Google Workspace, Microsoft 365 or Okta. There's no switch to turn it on. See [Set up read access](#set-up-read-access).

---

## What it finds

AI apps people signed in to, or gave access to company data, with their work account. Whiteout's catalog includes:

- **Meeting notetakers:** Otter.ai, Fireflies.ai, Read.ai, Fathom, tl;dv and Avoma
- **AI assistants and their connectors:** ChatGPT (OpenAI), Claude (Anthropic), Perplexity and Mistral
- **AI writing and workspace tools:** Grammarly, Notion AI, Jasper and Copy.ai

Whiteout recognizes an app by its exact OAuth app ID where it has confirmed that ID belongs to the vendor. Otherwise it recognizes the app by its name. A name match is shown for you to review. Whiteout never removes access for an app it matched only by name until an admin in your organization confirms the app is what it looks like.

Only AI apps are reported. Every other app connected in your identity provider is ignored.

---

## Where it shows

| Where | What you see |
|---|---|
| **Coverage → AI Footprint** | One row per AI app, with the category **Signed in with a work account**. Open it to see who connected it, through which identity provider, and what it can reach: **Sign-in only** (the app sees the person's name and email, not their files or mail) or the work data it was given access to. |
| **Integrations → Data Integrations** | The card **AI apps connected through your identity provider**: for each provider, whether detecting and removing access are set up, when it last checked, **View apps**, the **Read access** settings, and the **Remove access automatically** switch |
| **Findings** | **Unapproved AI app connected**, below |

Use through these apps counts as a work account, because it went through your organization's identity provider. See [Personal and work accounts](./ai-footprint/account-types.md).

---

## Unapproved AI app connected

**Unapproved AI app connected** means someone gave an AI app access to company data through their work account, for example their mail, files or calendar, and your organization hasn't approved the app.

It isn't raised when:

- the app only signs the person in (their name and email), with no access to data
- an admin gave consent for the whole organization. That was an admin's decision, not one person's.
- the app is on your allowlist
- a connector policy already blocks that data for the app. The **Connector still connected** finding covers that case instead. See [Vendor-Native Connector Control](./whiteout-ai-connector/native-connector-control.md).

**Why it matters.** The app can keep reading that data, for as long as the access stays in place, from any device. Nothing it reads passes through Whiteout.

**Severity.** **Medium**. It's a decision for you to make, not a policy violation.

**What to do:**

1. **Check what it can reach.** The finding lists the app, the person, the identity provider and the access it was given.
2. **If the app isn't approved,** remove its access: choose **View apps** on the identity provider's row, or remove it in your Google Workspace or Microsoft 365 admin console. Let the person know, so they don't simply reconnect it.
3. **If it's approved,** allowlist it under **Coverage → AI Footprint → Manage → Allowlisted tools**, with the catalog key the finding shows.
4. **Acknowledge the finding** with a note.

The finding resolves by itself once a daily check no longer finds the access, or when you allowlist the app. Like other AI Footprint findings, a new one raises the **Shadow AI detected** notification and goes to your SOC/SIEM destinations.

---

## Removing access

On Google Workspace and Microsoft 365, Whiteout can remove an AI app's access for you, once the remove permissions are in place.

- **One app at a time.** Choose **View apps** on the provider's row, pick the app and the people, and confirm. Whiteout shows what will be removed before it does anything. The dialog is described in [Vendor-Native Connector Control](./whiteout-ai-connector/native-connector-control.md).
- **Only exactly identified apps.** Whiteout removes access only for apps it identified by their exact OAuth app ID. An app matched by name shows a **Confirm** option: an admin confirms it's the vendor's app, and removal unlocks for your organization.
- **On Google Workspace, access is per app.** Removing an app's access removes all of it at once: Drive, Gmail and Calendar.
- **On Microsoft 365, existing sessions can outlast the removal.** Access the app already has can keep working for up to about an hour. You can also choose to sign the people affected out, which signs them out of all Microsoft apps.
- **Okta is detect-only.** To remove an AI app there, use Okta's admin console.

### Remove access automatically

The **Remove access automatically** switch is off by default. When you turn it on (you type `enable` to confirm), each daily check removes access it finds for AI apps Whiteout can identify by their exact app ID, one person at a time, without asking first.

- Consent given for the whole organization is never removed automatically. It always waits for you.
- Every removal is recorded in the admin audit log.
- People can reconnect an app later if you decide to allow it.
- It needs the remove permissions on Google Workspace or Microsoft 365.

---

## Set up read access

On the **AI apps connected through your identity provider** card, the **Read access** section shows what the daily check reads with, per provider. Keys and tokens you enter are stored encrypted and never shown again.

### Google Workspace

Whiteout reads which AI apps people connected by acting as a Google Workspace admin, through Google's domain-wide delegation. The [Gemini audit log](./ai-footprint/vendor-audit-logs.md) uses the same access.

The **Google Workspace** row under **Read access**, and its setup dialog, show what to authorize, each with a copy button:

- **Client ID:** the client ID of Whiteout's service account. It's shown when this Whiteout server has a shared service account and you aren't using your own.
- **Scopes to authorize:** the scopes below, as one comma-separated list, ready to paste.
- The Admin console path, with an **Open it** link.

1. In Whiteout, open **Integrations → Data Integrations**, and find **Read access** on the **AI apps connected through your identity provider** card. Copy the **Client ID** and the **Scopes to authorize** from the **Google Workspace** row.
2. In Google's Admin console, go to **Security → Access and data control → API controls → Domain-wide delegation**. Add a new entry with that client ID and those scopes.
   - **If the client ID is already listed,** for example for the Whiteout connector's Drive and Gmail access, edit that entry and add the scopes. Keep the scopes already there.
   - **Using your own service account instead?** Create a service account with domain-wide delegation in your own Google Cloud project, and authorize *its* client ID with the same scopes. See [Google Workspace (Zero-Click)](./whiteout-ai-connector/google-workspace-dwd.md) for how to create one.
3. Back in Whiteout, choose **Set up** on **Google Workspace**.
4. Enter the **Admin email** of a Google Workspace admin for Whiteout to read as. If you use your own service account, paste its JSON key into **Your own service-account key (optional)**. Choose **Save**.

Whiteout's service account can only act for an email domain registered to your organization in Whiteout. If no shared service account is set up on your Whiteout server, the card asks you to use your own.

The scopes Whiteout asks for:

| Scope | Why |
|---|---|
| `https://www.googleapis.com/auth/admin.directory.user.readonly` | List your Workspace users, so each one can be checked |
| `https://www.googleapis.com/auth/admin.directory.user.security` | List the apps each user has given access to, and remove an app's access when you choose to |
| `https://www.googleapis.com/auth/admin.reports.audit.readonly` | For the [Gemini audit log](./ai-footprint/vendor-audit-logs.md#google-gemini) |

Whiteout lists and removes connected apps with the same scope, so on Google Workspace the card shows **Revoke** as on as soon as read access works. Whiteout still removes access only when you choose to, or when **Remove access automatically** is on.

> **The scope box holds one comma-separated list, and saving replaces the whole list.** When you edit an existing entry, add to what's already there rather than retyping it, or you'll drop a scope another Whiteout feature uses.

If Whiteout says **That admin's email domain isn't registered to your organization**, ask Whiteout support to register the domain, or use your own service account.

### Microsoft 365

Microsoft 365 needs nothing typed into the **Read access** section. Whiteout uses an admin consent in your Entra tenant, started from the **Microsoft 365** row of the card. There can be two Whiteout apps:

| App | Used for | Button on the Microsoft 365 row |
|---|---|---|
| **Whiteout Discovery** (read-only) | Detecting AI apps, and the [Microsoft 365 Copilot audit log](./ai-footprint/vendor-audit-logs.md#microsoft-365-copilot) | **Grant read-only access**, under **Detect** |
| **Whiteout** (the Microsoft 365 connector's app) | Removing access | **Grant removal access**, under **Revoke** |

The Whiteout Discovery app can read, never change. A tenant can consent to it on its own, so Whiteout can detect AI apps without being given any write access. If the Discovery app isn't set up on your Whiteout server, or your tenant hasn't consented to it yet, detecting uses the Whiteout app's admin consent instead, the same consent as the Whiteout AI Connector ([Microsoft 365 (Zero-Click)](./whiteout-ai-connector/microsoft-365-zero-click.md#1-grant-tenant-admin-consent-one-click)). Removing access always uses the Whiteout app.

The row says in a line which consent each part uses, for example *Detect reads with the read-only Whiteout Discovery app.* To consent, choose the button, sign in to Microsoft as a tenant admin, approve, then refresh the card in Whiteout.

The Microsoft Graph application permissions Whiteout asks for:

| App | Permission | Why |
|---|---|---|
| **Whiteout Discovery** (or the Whiteout app, when it's used for detecting) | `Application.Read.All` | Identify AI apps in your tenant |
| | `DelegatedPermissionGrant.Read.All` | List the consent people gave to each app |
| | `User.Read.All` | Match each consent to a person |
| **Whiteout Discovery** (or the Whiteout app, when it reads the Copilot audit log) | `AiEnterpriseInteraction.Read.All` | Read the [Microsoft 365 Copilot audit log](./ai-footprint/vendor-audit-logs.md#microsoft-365-copilot), if you connect it |
| **Whiteout** (removing access) | `DelegatedPermissionGrant.ReadWrite.All` | Remove a person's consent to an app |
| | `AppRoleAssignment.ReadWrite.All` | Remove an app's application permissions |
| | `User.RevokeSessions.All` | Optional: sign people out when you remove an app, so existing sessions end at once |

Detecting needs only read permissions. The removal permissions are needed only to remove access from Whiteout. The **Revoke** column reads **Not set up** until the Whiteout app's consent includes them. If a consent is missing a permission, the row names it and offers **Grant again**.

> Evaluate the removal permissions on their own terms: `DelegatedPermissionGrant.ReadWrite.All` can remove any app's consent in your tenant, not only AI apps'. Whiteout limits every removal to apps it identified exactly and shows each one before you confirm, but the permission itself is broad.

**Consented before?** Microsoft records the permissions in force when you consented. If your tenant consented before a permission was added, consent again with the same button to pick it up.

### Okta

Okta shows which AI apps people sign in to with their work account, through Okta. It's **detect-only**: Whiteout reads Okta but never changes it. Because Okta records sign-ins rather than data access, Okta findings never raise **Unapproved AI app connected**. The apps show in AI Footprint as **Signed in with a work account**.

What Whiteout reads: your Okta app list (matched to AI vendors by name), who's assigned to each AI app, and sign-in events to those apps from the last 7 days of the System Log.

**Recommended: an API service app.**

1. In Okta's Admin Console, create an API service app integration for Whiteout that authenticates with a public and private key pair.
2. Grant it the Okta API scopes Whiteout asks for: `okta.apps.read`, `okta.users.read` and `okta.logs.read`. Depending on your Okta setup, the service app may also need an admin role. Choose the narrowest one that can read apps, users and the System Log.
3. **Turn off DPoP** (Demonstrating Proof of Possession) on the service app. Whiteout doesn't support DPoP-bound tokens yet, and the check fails while it's required.
4. In Whiteout, open **Integrations → Data Integrations**, and under **Read access** choose **Set up** on **Okta**.
5. Enter your **Okta domain**, for example `acme.okta.com`. Use your Okta org domain, not a custom domain.
6. Choose **API service app (recommended)**, and enter the **Client ID** and the app's **Private key (PEM)**. Add the **Key ID (optional)** if you registered the key with one. Choose **Save**.

See Okta's developer documentation on service apps for the steps in Okta's console.

**Alternative: an API token.** Choose **API token** and paste it. A token carries every permission of the admin who created it, so create it as a read-only admin. A service app with read scopes is safer.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| **Detect: Not set up** | Read access isn't set up for that provider. See above. |
| **Detect: Last check failed** | The card shows the reason. Usually a scope or permission is missing, consent was withdrawn, or the key changed. Nobody's AI use is affected. |
| **Waiting for the first check** | The first daily check hasn't run yet |
| Grants couldn't be read for some people | Whiteout keeps their previous results and tries again at the next check. A failed read never counts as an app being removed. |
| Okta says DPoP is required | Turn off DPoP on the service app, or use an API token |
| **Revoke: Not set up** on Microsoft 365 | The Whiteout app's consent doesn't include the removal permissions. Choose **Grant removal access** if you want Whiteout to remove access. Detecting still works. |
| No **Grant read-only access** button on the Microsoft 365 row | The read-only Discovery app isn't set up on your Whiteout server, so detecting uses the Whiteout app's admin consent (*Detect uses your Microsoft 365 admin consent*). Contact Whiteout support if you'd like the read-only app. |

---

## Privacy

- **AI apps only.** Other apps in your identity provider are never stored.
- **Metadata only.** Whiteout records the app, the person, the identity provider and the access granted. It never reads the person's mail, files or calendar to do this.
- **No tokens kept.** Whiteout never stores the apps' own tokens. Its own keys and tokens for your identity provider are stored encrypted and never shown again.
