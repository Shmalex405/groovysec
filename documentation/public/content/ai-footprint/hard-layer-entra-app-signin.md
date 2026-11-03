# Microsoft Entra ID: turn off user sign-in for blocked AI apps

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It names the Entra enterprise apps (service principals) of the blocked AI vendors, by application (client) id, and includes a script that turns off their **Enabled for users to sign in?** setting (the service principal's `accountEnabled`). With it off, nobody in your tenant can sign in to that app through Entra ID.

It doesn't stop a personal account on the vendor's own site: use the browser payload for that.

**Whiteout makes no Graph call** and asks for no new Graph permission. You run the script in your own session.

**Which apps.** Only verified application ids are included:
- ids Whiteout verified in its catalog;
- ids your admins confirmed from the OAuth grant list.

A vendor known only by name is listed as "not included: no verified Entra application id". Confirm the app from the grant list first; a name match is never enough.

## Run

1. Download the **CSV** file to review the list: `app_id`, vendor, tool, decision, and where each id came from.
2. Download the **PowerShell script (.ps1)** file (`Set-WhiteoutEntraAppSignIn-<scope>.ps1`). It needs the Microsoft Graph PowerShell SDK (`Install-Module Microsoft.Graph.Applications`).
3. Run it with no switch: a **dry run**. It signs in with `Application.Read.All` and lists each app, whether it is in your tenant, and its current state.
4. Run it with `-Apply`. It signs in with `Application.ReadWrite.All`, which you consent to in your own session, and turns user sign-in off for each app. It saves the prior state to `whiteout-entra-prior-<time>.csv`.

## Test

Apply to one app first (edit the `$Apps` list in the script), then confirm a test user can no longer sign in to it. Only then run it for all.

## Roll back

Run `-Rollback -PriorStateFile .\whiteout-entra-prior-<time>.csv`. Every app goes back to the state saved before `-Apply`. You can also turn **Enabled for users to sign in?** back on per app under **Entra > Enterprise applications > the app > Properties**.

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
