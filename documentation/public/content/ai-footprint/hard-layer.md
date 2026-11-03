# The Hard Layer: Deploy What Whiteout Generates

**What this is.** AI Footprint decisions block a tool where Whiteout runs: the browser extension, Desktop Guard and the coding-agent hooks. Those blocks fail open by design. The hard layer is what prevents: your MDM, identity provider and EDR. Whiteout generates each payload from your Blocked decisions. You test it and deploy it. Whiteout pushes nothing and calls no vendor API.

## Get a file

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

- **Scope:** your whole organization (its org-wide decisions), or one group (what that group's members get: the group's own decision wins over the org-wide one, as Whiteout itself applies it). Assign a group's file to the matching device group.
- **What's in it:** Blocked decisions in enforce mode. Turn on **Include quarantined tools** to add Quarantined ones. Monitor-mode decisions are left out everywhere except the Defender file, which carries them with the Audit action.
- **Who:** admins and read-only admins can download. Every download is recorded in the admin audit log, with the type, format, scope, counts and the file's fingerprint.
- **Fingerprint:** every file carries your organization, the scope, when it was made and a fingerprint. The same decisions always give the same fingerprint, so you can tell whether a newer file changed anything.

## What is never in a file

- **Weak identifiers.** A file only uses identifiers that name one tool: a bundle id with its team id, a signer with its exe name, a SHA-256, a site host, an extension id, or a verified Entra application id. Weak ones are reported as "not included", never guessed:
  - an IP address, `localhost` or a single-label name
  - a bundle id without a team id
  - a vendor known only by name
- **Hosts that would block more than AI.** The host of AI inside a work app (Word, Gmail, Slack) would block the whole app. A shared host such as `www.bing.com` also serves Bing search.
- **Whiteout's own components.** A decision whose identifiers name any of them ships nothing.
- **Private data.** No MCP server addresses (so no URL paths, which can hold secrets), prompt content, user emails or device names.
- **Anything that could change the file's meaning.** Names typed by people and identifiers reported by devices are treated as untrusted:
  - Names lose control characters, Unicode direction marks and `@@`.
  - An identifier that carries any of these is reported as invalid, never altered and shipped.
  - Every value is escaped for its format: XML, plist, shell, PowerShell, .reg, CSV (never a formula) and JSON.
  - File headers show a left-out value only when it is a plain token.

## The files

| File | Deploy with | Formats | Guide |
|---|---|---|---|
| Chrome and Edge: block AI sites and AI extensions | Any MDM: Chrome and Edge `URLBlocklist`, `ExtensionSettings` | mobileconfig, reg, json | [Guide](./ai-footprint/hard-layer-browser-policy.md) |
| VS Code: block AI extensions with AllowedExtensions | Any MDM: VS Code `AllowedExtensions` | mobileconfig, reg, json | [Guide](./ai-footprint/hard-layer-vscode-extensions.md) |
| Jamf Pro: Restricted Software for blocked macOS apps | Jamf Pro | xml, sh | [Guide](./ai-footprint/hard-layer-jamf-restricted-software.md) |
| Intune App Control for Business: deny policy for blocked Windows apps | Intune App Control for Business | ps1 (builder), xml (base) | [Guide](./ai-footprint/hard-layer-intune-app-control.md) |
| Microsoft Entra ID: turn off user sign-in for blocked AI apps | Microsoft Entra ID | csv, ps1 | [Guide](./ai-footprint/hard-layer-entra-app-signin.md) |
| Microsoft Defender for Endpoint: indicators for blocked AI tools | Microsoft Defender for Endpoint | csv, file_csv, domain_csv | [Guide](./ai-footprint/hard-layer-defender-indicators.md) |

## Always

1. **Test first.** Use a test device group, a test Smart Group, Audit Mode or a dry run, as each page says.
2. **Merge where a policy is single.** `ExtensionSettings`, `URLBlocklist` and `AllowedExtensions` are one value per browser or app. If you already set one, merge Whiteout's entries into it instead of deploying a second.
3. **Know the rollback** before you deploy. Each page has it.
