# GRC Connections: Vanta and Drata

Push evidence packs straight into the GRC platform your compliance team already uses. Each push sends the pack's PDF, with a description that carries the framework, period and **manifest SHA-256**, so the platform copy can always be matched back to the full pack in Whiteout. The ZIP, with its CSV samples, stays in Whiteout.

Find it under **Integrations → Compliance Evidence → Evidence Packs → GRC connections**.

## Connect Vanta

1. In Vanta's developer console, create an **OAuth application** with these scopes:
   - `vanta-api.all:read`
   - `vanta-api.all:write`
   - `vanta-api.documents:upload`
2. Copy the **client ID** and generate a **client secret**.
3. In Whiteout, click **Connect Vanta**, paste both values and click **Save and test**.

On the first push for each framework, Whiteout creates a custom document in Vanta named *Whiteout AI evidence pack: \<framework\>* and reuses it for every later push. Each push uploads the PDF to that document and submits it, so it's visible to your auditor.

## Connect Drata

1. In Drata, create an **API key** with Evidence Library create and list permissions.
2. Note your **workspace ID** and the numeric **user ID** of the Drata user who should own the evidence.
3. In Whiteout, click **Connect Drata**, enter the key, workspace ID and owner, choose the API endpoint your Drata tenant uses, and click **Save and test**.
4. Optionally, for each framework you track, list the **Drata control IDs** the evidence should be linked to.

Each push adds a new item to the workspace's **Evidence Library**, renewing monthly, linked to the controls you listed.

## Push a pack

- **Manually:** in **Generated packs**, click the upload icon on a completed pack and choose a connection. The **Sent to** column shows the result; hover for details.
- **On a schedule:** in a scheduled pack, add a **GRC platform** destination. Every scheduled run is pushed automatically.

If a push fails, for example because a credential expired or a permission is missing, the reason is shown on the pack and on the connection, and nothing is retried silently. Fix the connection, then use **Test** and push again.

## Security

- Secrets are encrypted at rest and never shown again after you save them. To keep a stored secret while editing a connection, leave the masked value (`****`) in place.
- Whiteout only calls the vendors' fixed API endpoints.
- Only the pack PDF, which is metadata only, leaves Whiteout. Every connection change and every push is written to the admin audit log, and connection changes notify administrators.
