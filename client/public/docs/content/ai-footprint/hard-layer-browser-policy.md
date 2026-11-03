# Chrome and Edge: block AI sites and AI extensions

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It sets two policies for both browsers:
- `URLBlocklist`: the blocked AI sites. An entry like `chatgpt.com` also blocks every subdomain, on any scheme and path.
- `ExtensionSettings` with `installation_mode: blocked`: the blocked AI extensions, by Chrome Web Store or Edge Add-ons id. The browser disables an extension that is already installed and refuses to install it.

Whiteout generates the file; you deploy it. Firefox extension ids are listed as "not included": this payload covers Chrome and Edge only.

## Import

- **macOS (any MDM):** download the **macOS profile (.mobileconfig)** file. It is an unsigned profile with one payload each for `com.google.Chrome` and `com.microsoft.Edge`. Upload it as a custom profile in Jamf, Kandji, Mosyle or Intune (Devices > Configuration > Custom > Configuration profile file), on the device channel. Its `PayloadIdentifier` and `PayloadUUID` stay the same between downloads, so a newer file replaces the installed profile.
- **Windows, Intune:** download the **JSON** file. For each browser, create one Custom OMA-URI setting per `intune_oma_uri` entry. This needs the Chrome and Edge ADMX templates in Intune, as for the force-install profiles. The OMA-URI paths are leads: check `chrome://policy` on a test device first.
- **Windows, other tools or GPO:** download the **Windows registry (.reg)** file. It writes `HKLM\SOFTWARE\Policies\Google\Chrome` and `...\Microsoft\Edge`. It deletes and rewrites the `URLBlocklist` key whole, so an entry a newer file drops really goes.

`ExtensionSettings` and `URLBlocklist` are each one policy per browser. If you already deploy either one (your own, or Whiteout's "Keep AI extensions off sensitive sites" recipe), merge the entries into it instead of deploying a second.

## Test

1. Assign the file to a test device group only.
2. On a test device, open `chrome://policy` and `edge://policy` and select **Reload policies**. Both policies must show with status OK.
3. Open a blocked site. The browser shows its own "blocked by your organization" page.
4. Check that a blocked extension shows as blocked by the administrator on `chrome://extensions`.
5. Then widen the assignment.

## Roll back

- **MDM:** unassign or delete the profile or the Intune configuration. The browser drops the policies at its next policy refresh.
- **.reg:** delete the `URLBlocklist` key and the `ExtensionSettings` value under each browser's policy key, for example:
  ```
  reg delete "HKLM\SOFTWARE\Policies\Google\Chrome\URLBlocklist" /f
  reg delete "HKLM\SOFTWARE\Policies\Google\Chrome" /v ExtensionSettings /f
  ```
  If you merged Whiteout's entries into your own policy, remove only Whiteout's entries.

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
