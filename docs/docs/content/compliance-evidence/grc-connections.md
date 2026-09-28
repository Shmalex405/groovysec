# GRC Connections: Vanta and Drata

If your compliance team works in **Vanta** or **Drata**, Whiteout AI can push evidence packs straight into it, by hand or on every scheduled run. Each push sends the pack's **PDF report**, with a description that carries the framework, the period and the pack's **manifest SHA-256**. The copy in the GRC platform can always be matched back to the full pack in Whiteout. The ZIP, with its CSV samples and manifest, stays in Whiteout: GRC platforms take documents, not archives, and the CSVs are for the auditor working from the ZIP.

GRC connections are managed from either of two places, which open the same dialog:

- **Integrations** > **Global Integrations** > **Compliance Evidence (GRC)** > **GRC Connections** (desktop app 2.86.5 and later)
- **Governance** > **Compliance Evidence** > **Evidence Packs** > **GRC connections**

Both buttons show how many connections you have. Admins can add and change connections; Read-Only users can see them and their last push.

## Before you start

- You need the **Admin** role in Whiteout.
- You need access to create API credentials in Vanta or Drata. Plan this with whoever administers your GRC platform.
- Track the frameworks you want to push first. For Drata, the dialog only offers control mapping for tracked frameworks. See [Track a framework](./compliance-evidence/frameworks-and-controls.md#track-a-framework).
- You can add up to 10 connections, including several of the same type, for example two Drata workspaces.

## Connect Vanta

Whiteout authenticates to Vanta as an OAuth application with the client-credentials flow.

### Step 1: Create the OAuth application in Vanta

1. In Vanta's developer console, create an **OAuth application** for Whiteout AI.
2. Give it these three scopes:

   | Scope | Why Whiteout needs it |
   |-------|------------------------|
   | `vanta-api.all:read` | To test the connection by listing documents |
   | `vanta-api.all:write` | To create the evidence document and submit it |
   | `vanta-api.documents:upload` | To upload the pack's PDF |

3. Copy the **client ID** and generate a **client secret**.

### Step 2: Add the connection in Whiteout

1. Open **GRC connections** (from the Integrations card or the Evidence packs page), then click **Connect Vanta**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | **Name** | Defaults to *Vanta*. Change it if you add more than one. |
   | **Client ID** | From Step 1 |
   | **Client secret** | From Step 1 |

3. Click **Save and test**. Whiteout saves the connection and immediately tests it: it signs in to Vanta and lists your documents. A successful test shows *\<name\>: Signed in to Vanta and listed documents.*

### What appears in Vanta

- On the **first push for each framework**, Whiteout creates a custom document in Vanta named **Whiteout AI evidence pack: \<framework\>**. It's marked sensitive, with a monthly cadence. Whiteout remembers the document and reuses it for every later push of that framework.
- Each push **uploads the PDF** to that document, with the description below, and **submits** it, so it's visible to your auditor.
- The file is named after the pack, with a `.pdf` extension.

The description reads: *Whiteout AI evidence pack for \<framework\>, \<period\>. Generated \<date and time\> UTC. Manifest SHA-256: \<hash\>. The full pack (CSV samples and manifest) is kept in Whiteout AI; verify any copy under Compliance Evidence → Evidence Packs.*

In Vanta, link the document to the controls it supports as you would any other document.

## Connect Drata

Whiteout authenticates to Drata with an API key and adds each pack to a workspace's **Evidence Library**.

### Step 1: Collect what Whiteout needs from Drata

1. In Drata, create an **API key** with **Evidence Library** create and list permissions.
2. Note the numeric **workspace ID** of the workspace the evidence belongs in.
3. Note the numeric **user ID** of the Drata user who should own the evidence. Drata needs an owner for every Evidence Library item.
4. Check which Drata API endpoint your tenant uses: `public-api.drata.com` (the public API) or `api.drata.com/v1`. Your Drata administrator or Drata's API documentation can confirm it.
5. Optionally, list the numeric **Drata control IDs** each pack should be linked to, per framework.

### Step 2: Add the connection in Whiteout

1. Open **GRC connections** (from the Integrations card or the Evidence packs page), then click **Connect Drata**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | **Name** | Defaults to *Drata* |
   | **API key** | From Step 1 |
   | **Workspace ID** | Numbers only |
   | **Evidence owner (Drata user ID)** | Numbers only |
   | **API endpoint** | **public-api.drata.com (public API)** (the default) or **api.drata.com/v1** |
   | **\<framework\>: Drata control IDs** | Optional. Appears once for each framework you track. Enter numeric IDs separated by commas or spaces, for example `1024, 1031`. Up to 200 per framework. |

3. Click **Save and test**. Whiteout saves the connection and tests it by listing the workspace's Evidence Library. A successful test shows *\<name\>: Connected to the Drata workspace's Evidence Library.*

If you don't track any framework yet, the dialog says *Track a framework to map it to Drata controls.* You can add control IDs later by editing the connection.

### What appears in Drata

Each push adds a **new item** to the workspace's Evidence Library:

| Drata field | Value |
|-------------|-------|
| Name | **Whiteout AI evidence pack: \<framework\> (\<date\>)** |
| Description | The same text as for Vanta, including the manifest SHA-256 |
| File | The pack's PDF |
| Filed date | The day of the push |
| Renewal | Monthly |
| Owner | The Drata user you chose |
| Controls | The Drata control IDs you listed for that framework, if any |

Monthly scheduled packs therefore build up a monthly trail of evidence items in Drata.

## Push a pack

### By hand

1. On **Evidence packs**, find the completed pack under **Generated packs**.
2. Click the **Send to a GRC platform** icon (the upload icon) and choose **Send to \<connection\>**. Only enabled connections are listed.
3. Whiteout confirms *Sent to \<connection\>.*, or shows the error.

The **Sent to** column then shows a chip for the connection: green on success, red on failure. Hover the chip for the platform reference (for example the Vanta document or Drata evidence ID) and time, or for the error.

### On a schedule

In a [scheduled pack](./compliance-evidence/evidence-packs.md#schedule-packs), add a **GRC platform (Vanta, Drata)** destination and choose the **GRC connection**. Every scheduled run is then pushed automatically, and **Send test** pushes a test pack straight away. GRC destinations are only available on evidence-pack schedules.

## Manage connections

The **GRC connections** dialog lists each connection with its name, type, and last push (*Last push \<time\>*, with the error if it failed, or *No pushes yet*). Each row has:

- **Test**, to re-run the connection test;
- a switch to **enable** or **disable** the connection. A disabled connection isn't offered for manual pushes, and scheduled pushes to it fail with *This connection is disabled*;
- an edit icon;
- a delete icon. Deleting asks you to confirm: *Scheduled packs that push to this connection will skip it. Evidence already pushed stays in the platform.*

When you edit a connection, stored secrets show as `****`. Leave **Client secret** or **API key** as `****` to keep the saved value, or type a new one to rotate it. Saving an edit re-tests the connection.

## Security

- **Secrets are write-only.** Client secrets and API keys are encrypted at rest and never shown again after you save them.
- **Fixed endpoints.** Whiteout only calls the vendors' own API hosts: `api.vanta.com`, and `public-api.drata.com` or `api.drata.com`. Nothing you type becomes a URL.
- **Only the PDF leaves.** A push sends the pack's `report.pdf`, which is metadata only, and its description. The CSVs and manifest stay in Whiteout. End-user emails in the PDF follow the pack's pseudonym setting; see [Email addresses and pseudonyms](./compliance-evidence/evidence-packs.md#email-addresses-and-pseudonyms).
- **Everything is logged.** Creating, editing and deleting connections are written to the admin audit log (`grc.connection.created`, `grc.connection.updated`, `grc.connection.deleted`) and raise an administrator configuration-change notification. Manual pushes are logged as `grc.pack.pushed`. Every push, manual or scheduled, is recorded against the pack and shown in **Sent to**.
- **No silent retries.** A failed push isn't retried in the background. The reason is shown on the pack and on the connection, and the connection counts consecutive failures until the next success.

## Troubleshooting

Test and push errors name the step that failed and the reason:

| Message | Meaning and fix |
|---------|-----------------|
| *Vanta sign-in failed: credentials were rejected* | The client ID or secret is wrong, or the application was deleted. Re-enter them. |
| *… failed: the credentials lack the required permission/scope* | Vanta: add all three scopes to the OAuth application. Drata: give the API key Evidence Library create and list permissions. |
| *… failed: the target was not found (check IDs)* | Drata: check the workspace ID, and that the API endpoint matches your tenant. Vanta: the framework's document may have been deleted in Vanta. Whiteout keeps using the document it created first, so delete the connection and add it again to have a new document created on the next push. |
| *… failed: the vendor rate-limited the request* | Wait and push again. |
| *Could not reach Vanta* / *Could not reach Drata* | A network error or timeout. Try again. |
| *Drata needs a numeric workspace ID* / *Drata needs the numeric user ID that will own the evidence* | Enter numbers only. |
| *Drata control IDs for \<framework\> must be numbers* | Remove anything that isn't a number from the control ID list. |
| *This connection is disabled* | Turn the connection back on in **GRC connections**. |
| *Only completed evidence packs can be pushed* | Wait for the pack to finish generating. |
| *The pack file is no longer available* | The pack is more than 90 days old and has been deleted. Generate a new one. |
| The upload icon is greyed out | You have the **Read-Only** role, the pack isn't completed, or no connection is enabled (*Connect Vanta or Drata first*). |

After fixing the cause, click **Test** on the connection, then push the pack again.
