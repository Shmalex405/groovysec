# Connect an AI Assistant

This is the last mile: pointing an AI assistant at the Whiteout AI
Connector so its reads flow through Whiteout instead of hitting your
data sources directly. **Nothing is governed until you do this step** —
exposing an integration and setting policy only matter once an
assistant actually queries *through* the connector.

The connector is a **remote MCP server**. In every assistant the shape
is the same:

1. **Add Whiteout as a connector / MCP server** using the connector's
   MCP URL.
2. **Complete an OAuth consent to Whiteout.** This is what identifies
   *who is asking* — it binds the connection to a specific Whiteout
   user, which is exactly what makes **per-user access** and
   **policy enforcement** apply to every read. Without it, the
   connector has no caller identity to enforce against.

> **This step is the whole point.** Whiteout can only vet content the
> AI reads **through the Whiteout AI Connector**. For any source you
> govern through Whiteout, route it **exclusively** through this
> connector and disable the assistant's vendor-native connector for
> that same source. See
> [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout).

## The two things you need

Both are shown in the Whiteout desktop app — admins under
**Integrations → Whiteout AI Connector → Generate credentials**, and
every user on **Connect your sources → Personal connector token**
(same URLs, plus your own token for static-header clients):

| Value | Looks like | Used by |
|---|---|---|
| **MCP URL** | `https://<your-org-slug>.api.whiteout.groovysec.com/mcp` | Claude, Cursor, VS Code, Cline, and any MCP client |
| **OpenAPI URL** | `https://<your-org-slug>.api.whiteout.groovysec.com/connector/v1/openapi.json` | ChatGPT Custom GPTs, Gemini Actions |

> **Get the exact URL from your own connector settings.** The host is
> specific to your org — copy the pre-filled URL from the connector's
> **Generate credentials** dialog rather than typing it by hand. If you
> haven't stood the connector up yet, it will read like
> `https://<your-whiteout-host>/mcp`.

The connector speaks **Streamable HTTP** and authenticates with
**OAuth 2.1** (bearer). MCP-native clients discover the OAuth flow
automatically from the URL and prompt you to sign in to Whiteout; a few
clients still take a static bearer token instead — for those, use your
**personal connector token** (see
[Personal connector tokens](#personal-connector-tokens-static-header-clients)
below).

## Claude (claude.ai / Claude Desktop)

Claude supports **custom / remote connectors** over MCP directly.

1. Open **Settings → Connectors** (claude.ai) or the **connectors**
   panel in Claude Desktop.
2. Click **Add custom connector**.
3. **Name:** `Whiteout AI`. **URL:** paste the connector **MCP URL**.
4. Save. Claude opens an **OAuth consent to Whiteout** — sign in with
   your Whiteout account and approve. This is the identity step: the
   connection is now bound to you.
5. Start a new chat, open the connectors icon, and confirm the
   **Whiteout AI** tools are listed (e.g. `gdrive_search_files`,
   `gmail_search`). Ask it to read a document you have access to; the
   response comes back vetted.

> Claude Desktop can also be wired via
> `claude_desktop_config.json` with a static bearer token instead of
> the OAuth consent. If you do, use your **personal connector token**
> (below) — it carries your identity exactly like the OAuth sign-in.
> The org-shared token cannot read per-user sources (Drive, Gmail,
> OneDrive, mailboxes, …) for anyone — those queries return a governed
> "mint your personal token" message instead of data.

## ChatGPT (Custom GPT action / connector)

ChatGPT reaches the connector over its **OpenAPI Actions** surface, not
MCP.

1. **Create a GPT → Configure → Actions → Create new action.**
2. **Schema → Import from URL:** paste the connector **OpenAPI URL**.
   The action list auto-populates with the tools for every exposed
   integration.
3. **Authentication → OAuth**, pointing at your connector's authorize
   and token URLs (under the same host as the OpenAPI URL). Signing in
   completes the **consent to Whiteout** and binds the action to the
   user.
4. Save. ChatGPT signs in and the Whiteout actions appear in the tool
   list.

> ChatGPT cannot reach `localhost` — the connector must be on a public
> HTTPS host (your `<slug>.api.whiteout.groovysec.com`). This is the
> same host shown in your connector settings.

## Gemini (Actions)

Gemini also consumes the **OpenAPI** surface.

1. In your Gemini / Vertex agent's **Actions** (or extension) config,
   **import the OpenAPI schema** from the connector **OpenAPI URL**.
2. Configure **OAuth** against your connector's authorize/token URLs
   and sign in to Whiteout to complete consent.
3. The exposed integration tools appear and are callable, vetted per
   read.

## IDE clients (Cursor, VS Code, Cline, and other MCP clients)

Any MCP-capable IDE client connects with the **MCP URL** exactly like
Claude Desktop.

- **Cursor:** **Settings → MCP → Add new MCP server**, choose an
  **HTTP / remote** server, name it `whiteout-ai`, and paste the
  connector **MCP URL**. Complete the OAuth sign-in when prompted.
- **VS Code (MCP):** add the server to your MCP configuration with the
  connector **MCP URL** as an **HTTP** (Streamable HTTP) server, then
  authorize when the client opens the Whiteout consent.
- **Cline / Continue / Windsurf and others:** add a remote MCP server
  pointing at the **MCP URL**; sign in to Whiteout when prompted.

> For clients that only accept a static token rather than an
> interactive OAuth sign-in, paste your **personal connector token** as
> an `Authorization: Bearer <token>` header (next section). Prefer the
> interactive OAuth consent wherever the client supports it; both carry
> your identity into per-user access and policy enforcement.

## Personal connector tokens (static-header clients)

Some clients can't run an interactive OAuth sign-in and only accept a
static `Authorization` header. For those, every user mints their
**own** token — self-service, no admin needed:

1. In the Whiteout desktop app, open **Connect your sources** (from the
   chat avatar menu; admins can also reach it from the connector card).
2. On the **Personal connector token** card, click **Mint token**. The
   token is shown **once** — copy it. The dialog also shows your MCP
   and OpenAPI URLs.
3. Paste it into the client's config as
   `Authorization: Bearer <token>`.

A personal token identifies **you**: reads are served with your own
source permissions, your groups' policy scopes apply, and activity is
logged under your name. Treat it like a password — anyone holding it
acts as you. Click **Rotate token** to replace it (the old one stops
working immediately) and **Revoke** to kill it. Admins can see and
revoke every active personal token from the connector card's
**Credentials** dialog.

**What about the org-shared token?** It stays valid, but it carries no
individual identity, so it cannot read per-user-scoped sources — Drive,
Gmail, OneDrive, mailboxes, ticketing, and the rest. Queries through it
get a governed "mint your personal token" message instead of another
person's data. Keep it only for Slack (shared-bot model) and
service-style automations.

## Verify it's working

Ask the assistant to list or read a document you can access through an
exposed source. You should see:

- **Allowed content** returned normally — but only for items your own
  account can access (access stays per-user).
- **Blocked content** withheld with a short policy note instead of the
  document body, when a connector policy rule matches.

If the assistant shows no Whiteout tools at all, the connector wasn't
added or the OAuth consent didn't complete — re-add it and finish the
sign-in.

## Related

- [Overview → Route each source only through Whiteout](./whiteout-ai-connector/overview.md#route-each-source-only-through-whiteout)
- [Connector Policy](./whiteout-ai-connector/connector-policy.md) — the
  rules the connector enforces on every read.
