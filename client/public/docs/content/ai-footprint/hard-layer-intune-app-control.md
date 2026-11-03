# Intune App Control for Business: deny policy for blocked Windows apps

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It produces an App Control for Business (WDAC) **deny** policy for the blocked Windows apps.
- Signed apps get publisher rules: Microsoft's FilePublisher level, falling back to Hash.
- Unsigned binaries get hash rules.

It is a download, not a push: Whiteout makes no change in Intune. **Test it in audit mode first.**

**Why there's a builder.** App Control rules need facts a Whiteout decision doesn't hold:
- A publisher rule needs the signing certificate chain (the issuing CA's certificate) and the file's OriginalFileName. The decision has only the signer's name and the exe name.
- A hash rule needs the file's Authenticode hash, not the plain SHA-256 that Whiteout records.

So the main download is a builder script that reads those facts from the real files, with Microsoft's own cmdlets (`New-CIPolicyRule -Deny`, `Merge-CIPolicy`).

## Build

1. Download the **PowerShell script (.ps1)** file (`Build-WhiteoutAppControlDenyPolicy-<scope>.ps1`).
2. On a reference Windows device where the blocked apps are installed, run it as an administrator in Windows PowerShell 5.1 (it needs the ConfigCI module). Use `Unblock-File` first if the browser marked the download. The script:
   - finds each blocked exe under `-SearchPath`, which defaults to Program Files and `%LOCALAPPDATA%\Programs`;
   - keeps only files whose Authenticode signature is valid and names the decision's signer;
   - adds a FilePublisher deny rule for each, falling back to Hash. It never uses the broader Publisher fallback, which would block everything that publisher signs;
   - adds a Hash deny rule for each file whose SHA-256 matches a blocked hash (the fallback for unsigned code);
   - merges the rules into the base policy and writes the XML.
3. The base (the **XML** file) is an "Allow All" deny-policy base:
   - multiple-policy format, with **Audit Mode** on and script enforcement off;
   - a PolicyID derived from your organization and the scope, so a rebuilt policy updates in place;
   - a version that rises on every rebuild.

   On its own it allows everything.
4. The script lists every file it denied and every blocked app it didn't find.

## Deploy and test

1. In Intune, go to **Endpoint security > App Control for Business > Create policy** and upload the XML. Assign it to a test device group.
2. On a test device, run the blocked app. With Audit Mode it still runs, and event **3076** appears in **Applications and Services Logs > Microsoft > Windows > CodeIntegrity > Operational**. Check that the events name only the apps you meant to block.
3. Then rebuild with `-Enforce` (it removes Audit Mode). Upload the result to the same Intune policy and widen the assignment.

If you already run an App Control allowlist, Microsoft's guidance is to merge these deny rules into it without the Allow All rules (`Merge-CIPolicy`), rather than deploy this standalone base.

## Roll back

Unassign or delete the App Control policy in Intune. A device may need a reboot to unload it. To soften without removing, redeploy the policy built without `-Enforce` (Audit Mode).

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
