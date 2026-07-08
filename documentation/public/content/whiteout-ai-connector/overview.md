# Whiteout AI Connector — Overview

The Whiteout AI Connector is the single endpoint your AI assistants
(Claude Desktop, ChatGPT Custom GPTs, Gemini Actions, and any other
MCP-capable client such as Cursor, VS Code, or Cline) connect to in
order to read documents and events from your connected apps —
**after** every payload passes through Whiteout's policy engine.

## Content vs. access — the core split

The connector and the source system each own one half of the decision:

- **Whiteout governs CONTENT.** One org-wide policy set vets every
  payload before any AI sees it. Flagged material is redacted or
  withheld regardless of who asked for it. This policy is the same for
  every query, every user, every assistant.
- **The source governs ACCESS.** Google, Microsoft, and Slack keep
  their own ACLs. Whiteout never overrides them and never widens them.

The practical consequence: **content is vetted org-wide, but access is
per-user.** Each user connects their *own* account, so the connector
reads only what that user is already permitted to see in the source.
There is no single shared admin credential handing the same data to
everyone.

## Route each source only through Whiteout

Whiteout's guarantee — **every document and email is vetted against
your policies before the AI sees it** — holds only for content the AI
reads **through the Whiteout AI Connector**. Whiteout cannot govern a
path it doesn't sit on.

Most AI workspaces ship their **own vendor-native connectors** too:
claude.ai has a built-in Gmail and Google Drive connector, and ChatGPT
and Gemini offer their own equivalents. If the **same** workspace has
both Whiteout **and** a vendor-native connector enabled for the **same**
source, the AI can read that source **directly on the native path**,
bypassing Whiteout's vetting entirely. The two connectors are separate
doors into the same room — Whiteout only guards its own.

> **Important:** For any source you govern through Whiteout, do **not**
> also enable the vendor-native connector for that source in the same
> workspace. Route it **exclusively** through the Whiteout AI Connector.
> If you genuinely need both, treat the native connector as an
> **ungoverned path** and disable it for that source — otherwise the AI
> keeps a direct, unvetted line to your data.

## The three connect models

Every integration uses one of three models. Each source's guide tells
you which one applies.

**1. Per-user OAuth (live sources)** — Gmail and similar. Each user
connects their own account. Content is classified on demand at query
time; there is no pre-scanned corpus. The user is served only what
their own account can read.

**2. Per-user OAuth + org-wide scanner (document stores)** — Google
Drive, SharePoint, OneDrive. Two credentials with **separate roles**:

- An **org-wide scanner credential** (a Workspace / service admin
  account, or domain-wide delegation) pre-scans and classifies the
  *entire* org corpus, so the admin's **Documents** review view is
  complete. The scanner **only classifies — it never serves data to a
  user.**
- **Per-user serving:** each user connects their own account. At query
  time they're served only the documents their own account can access,
  drawn from the already-classified corpus.

**3. Shared bot (Slack)** — a single workspace app reads shared
public-channel content on behalf of the workspace. Access is scoped by
Slack's channel membership, not by a per-user grant.

## Who does what

- **Admin (Whiteout desktop app):** *exposes* an integration, connects
  the org-wide scanner credential for document stores, and manages the
  **org-wide connector policy** — one policy set that governs every
  connector query.
- **Each user (Whiteout desktop app → "Connect your sources"):**
  connects their own account. The page lists the exposed integrations
  with a **Connect** button that runs OAuth for that provider. It's
  **one connect per provider** — connecting Google covers both Drive
  and Gmail; connecting Microsoft covers SharePoint and OneDrive.

## What's on this page

Each linked guide on the left walks through:
1. **Prerequisites** — what admin/user access you need where
2. **Step-by-step setup** — exact click-paths in Whiteout and the
   source app, for both the admin and the per-user connect
3. **Required scopes** — what we ask for and why, per role
4. **What to expect after connect** — how classification and serving
   behave, and how to verify it's working
5. **Troubleshooting** — the errors we surface most often and how to
   fix them
6. **Audit log location** — where to find the connector's activity
   trail in your admin dashboard
