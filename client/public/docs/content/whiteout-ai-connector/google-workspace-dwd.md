# Google Workspace (Zero-Click)

Light up **per-user** Google Drive **and** Gmail access for the Whiteout
AI Connector across your whole Workspace tenant — with **no end-user
OAuth screen**. Instead of every user clicking "Connect," a Workspace
super admin authorizes Whiteout **once**, org-wide, using Google's
**domain-wide delegation (DWD)**. From then on the connector mints a
per-user token by impersonating each caller's Workspace identity at
query time.

This one setup covers **Google Drive, Gmail, and Google Calendar** — you
do it once, not per source.

- **Zero per-user clicks.** No individual consent screen, and no wait
  on Google restricted-scope verification.
- **Still ACL-correct.** Each user is served only their own mail and
  files. Delegation removes the per-user *grant* step; it does **not**
  widen access. Content is still vetted org-wide before any AI sees it.
- **Changes go through it too.** Changes the AI makes in Drive, Gmail
  and Calendar go only through this delegation, as the person who asked,
  once you add the write scopes. Reads don't need them. See
  [Let the AI make changes](#let-the-ai-make-changes-write-scopes).

> This is the recommended path for a Google Workspace tenant. If you'd
> rather have each user connect their own Google account instead, use
> the per-user OAuth flow described in the
> [Google Drive](./whiteout-ai-connector/google-drive.md) and
> [Gmail](./whiteout-ai-connector/gmail.md) guides — that path needs
> Google restricted-scope verification for general rollout.

## Prerequisites

- A **Google Workspace super admin** (to authorize delegation in the
  Admin Console).
- Access to the **GCP project** backing your tenant (to create the
  service account).
- Your **Whiteout operator or account manager** — they set one backend
  secret at the end. (Whiteout-hosted: your account manager does this
  on request. Self-hosted: your own ops team.)
- Users' **Workspace email addresses must match their Whiteout login**
  — impersonation is keyed to the Workspace email (see the last step).

## Setup steps

### 1. Create a service account with domain-wide delegation

1. In the GCP project backing your tenant: **IAM & Admin → Service
   Accounts → Create service account**. Name it e.g.
   `whiteout-connector-dwd`.
2. On the service account, **enable domain-wide delegation** and
   **create a JSON key**. Download the key file and keep it safe — it's
   a credential.
3. Note the service account's **OAuth client ID** — a long numeric ID
   on the service-account details page (also present in the key JSON as
   `client_id`). You'll paste this into the Admin Console next.

### 2. Enable the Google APIs

In the same GCP project, enable the **Google Drive API**, the
**Gmail API** and, if you use Google Calendar through the connector, the
**Google Calendar API**.

### 3. Authorize the client ID in the Workspace Admin Console

1. Go to **admin.google.com → Security → Access and data control →
   API controls → Domain-wide delegation → Add new**.
2. **Client ID:** the service account's OAuth client ID from step 1.3.
3. **OAuth scopes** (comma-separated) — exactly what the connector uses:
   ```
   https://www.googleapis.com/auth/drive.readonly,
   https://www.googleapis.com/auth/gmail.readonly,
   https://www.googleapis.com/auth/calendar.readonly,
   https://www.googleapis.com/auth/admin.directory.user.readonly,
   https://www.googleapis.com/auth/admin.directory.user.security
   ```
   - `drive.readonly`, `gmail.readonly`, `calendar.readonly` — the
     content the connector reads on each user's behalf.
   - `admin.directory.user.readonly` — lets the corpus scanner enumerate
     your Workspace users for the org-wide Drive scan.
   - `admin.directory.user.security` — **optional.** Only needed if you
     want Whiteout to find and revoke AI vendors' existing OAuth grants
     against your Workspace. See
     [Vendor-Native Connector Control](./whiteout-ai-connector/native-connector-control.md).
     Omit it and everything else still works.
   - To let the AI make changes too, also add the write scopes in
     [Let the AI make changes](#let-the-ai-make-changes-write-scopes).
     Reads don't need them.
4. Click **Authorize.**

> **Adding a scope later?** The scope box holds one comma-separated list
> and **saving replaces the whole list** — append to what's already
> there rather than retyping it, or you'll silently drop a scope the
> connector depends on.

> With only the scopes above, Whiteout can't change anything in Drive,
> Gmail or Calendar. It makes changes only once you add the write scopes
> below, only the kinds of changes you allow, and always as the person
> who asked. The other non-read-only capability —
> `admin.directory.user.security` — can delete third-party OAuth grants,
> and only ever does so when you explicitly confirm a revocation. It
> gives Whiteout no access to mail or file content.

### 4. Hand the service-account key to your Whiteout operator

Your operator sets the downloaded key as the backend secret
`GOOGLE_DWD_SERVICE_ACCOUNT_JSON` (the full key JSON, on a single line),
alongside the connector's other secrets, and restarts the backend to
pick it up.

> **Treat the key as a secret.** It lets Whiteout impersonate your
> users within the scopes you authorized in step 3: read-only, unless
> you also add the write scopes. Deliver it through your secret store
> (1Password, Vault, AWS Secrets Manager), not over chat or email.

### 5. Expose Drive and Gmail on the connector

If you haven't already, open **Integrations → Whiteout AI Connector**
and **Expose** Google Drive and/or Gmail. For Drive, the org-wide
**scanner** classifies the corpus as usual; delegation governs the
**per-user serving** path underneath it.

## What to expect after setup

- **Every Workspace user is provisioned instantly** — the moment they
  query Drive or Gmail through the connector, Whiteout mints a per-user
  token by impersonating their Workspace identity. No consent screen
  ever appears.
- **Each user sees only their own data.** The minted token carries that
  user's own ACLs; Drive returns only files they can access, Gmail only
  their own mailbox.
- **Content is still vetted org-wide.** Delegation changes *how access
  is provisioned*, not *what is allowed through* — the connector policy
  applies exactly as before. See
  [Connector Policy](./whiteout-ai-connector/connector-policy.md).

## Let the AI make changes (write scopes)

Changes the AI makes in Google Drive, Gmail and Google Calendar go
**only** through this delegation, acting as the person who asked. They
show up in Google's own history under that person, not under Whiteout.
A personal Google sign-in still serves reads, but never makes changes.

Reads don't need the write scopes; changes do. Add the scopes for each
source you want the AI to change:

| Source | Write scopes to add | What they let the AI do |
|---|---|---|
| Google Drive | `https://www.googleapis.com/auth/drive` | Create files, replace their content, rename and move them, comment, move to the trash |
| Gmail | `https://www.googleapis.com/auth/gmail.compose`, `https://www.googleapis.com/auth/gmail.modify` | Write and change drafts, send email and replies, move messages to the trash |
| Google Calendar | `https://www.googleapis.com/auth/calendar.events` | Create, change and delete events, and send invitations |

1. A Workspace super admin goes to **admin.google.com → Security →
   Access and data control → API controls → Domain-wide delegation**
   (the **Manage Domain Wide Delegation** button).
2. Find Whiteout's client ID and edit it.
3. Add the write scopes to the **end** of the existing list,
   comma-separated.
4. **Keep the scopes already there: saving replaces the whole list.**
   Dropping a read scope stops reads for that source.
5. Save.

With all three sources, the list looks like this (keep
`admin.directory.user.security` if you added it):

```
https://www.googleapis.com/auth/drive.readonly,
https://www.googleapis.com/auth/gmail.readonly,
https://www.googleapis.com/auth/calendar.readonly,
https://www.googleapis.com/auth/admin.directory.user.readonly,
https://www.googleapis.com/auth/drive,
https://www.googleapis.com/auth/gmail.compose,
https://www.googleapis.com/auth/gmail.modify,
https://www.googleapis.com/auth/calendar.events
```

**Until the write scopes are added,** reads keep working, and a change
the AI tries is refused with a note that your Google Workspace admin
needs to add them (`org_grant_missing`). In Whiteout, each Google
source's **What the AI can change** panel (**Integrations → Whiteout AI
Connector**) shows exactly which scopes to add, with a button to copy
them.

Once the scopes are in place, the AI can make the changes each source
allows in Whiteout. By default, **Create**, **Edit** and **Comment &
post** are Allowed and **Delete** is Off. For Gmail and Google
Calendar, **Comment & post** is sending, and it starts at **Needs
approval**. Set what the AI may change per source;
see [Write Actions](./whiteout-ai-connector/write-actions.md).

## Identity matching — the one thing that must line up

The connector impersonates the caller by their **Workspace email**, so
each user's Whiteout login email **must equal** their Google Workspace
email. If they differ, impersonation targets the wrong identity or
fails outright.

- If your org signs in to Whiteout with Google Workspace SSO, this is
  automatic.
- If Whiteout logins use a different domain or alias than Workspace,
  reconcile them before rollout.

## Troubleshooting

- **`unauthorized_client` / "Client is unauthorized to retrieve access
  tokens"** — the client ID or the scope string in the Admin Console
  doesn't exactly match. Re-check step 3: the client ID must be the
  service account's OAuth client ID, and every scope Whiteout uses must
  be present verbatim.
- **A user gets no files / no mail** — expected if that user genuinely
  has none, but also check their Whiteout email matches their Workspace
  email (see above).
- **All users fail after setup** — the backend didn't pick up
  `GOOGLE_DWD_SERVICE_ACCOUNT_JSON`, or the key JSON is malformed. Have
  your operator confirm the secret is set (single-line JSON) and the
  backend was restarted.
- **The AI says your Google Workspace admin needs to add scopes
  (`org_grant_missing`)** — the delegation doesn't include that
  source's write scopes yet. Add them as described in
  [Let the AI make changes](#let-the-ai-make-changes-write-scopes).
  Reads aren't affected.
- **Reads stopped after you added the write scopes** — the save
  probably replaced the read scopes. Edit Whiteout's client again and
  put them back: saving replaces the whole list.

## Audit log

Drive, Gmail and Calendar reads are on **Activity → AI Connector**,
filtered by source — same trail as any other connector read, now
resolved per user. Changes the AI made or tried to make are on
**Activity → MCP Activity**.

### Org-wide corpus scan (no scanner credential needed)

With the delegation in place, Whiteout's **corpus scanner** can also run
zero-click: it enumerates every active Workspace user (Directory API) and
scans each user's Drive view — all My Drives **and all shared drives** —
into the admin Documents review. Your Whiteout operator sets one value,
the **scanner subject** (`GOOGLE_DWD_SCANNER_SUBJECT`): a Workspace
**admin** identity used for the enumeration. No customer-created OAuth
credential is required. The scanner only classifies — serving is always
per-user, and vetting applies to every read whether or not a document was
pre-scanned.
