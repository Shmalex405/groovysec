# Jamf Pro: Restricted Software for blocked macOS apps

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It holds one Jamf Pro Restricted Software record per blocked macOS app. Each record:
- restricts the app's bundle name (`Comet.app`), with **Match exact process name** on;
- has **Kill process** on, which is what makes it a block;
- never deletes the app;
- shows a message that names the approved alternative.

Whiteout generates the records; you create and scope them in Jamf.

**Jamf matches by name.** A Restricted Software record has no bundle id or team id field: Jamf matches the process name. So Whiteout includes an app only when both hold:
- the decision identifies it strongly, by bundle id and Apple team id;
- a device has reported that app's bundle name together with that same signature.

Each record's comment names its bundle and team ids. Jamf itself still matches only the name, so another app with the same bundle name is restricted too. Apps without an observed name are listed as "not included". (Jamf Protect's custom prevent lists can match team ids and signing ids, but that is a different product and isn't generated here.)

## Import

- **Script (recommended):** download the **shell script (.sh)** file.
  - Run `./whiteout-jamf-restricted-software-<scope>.sh` first. It prints the records and sends nothing.
  - Then run `JAMF_URL=https://yourserver.jamfcloud.com JAMF_TOKEN=<bearer token> ./… --apply`. It creates each record, or updates one that exists. An update sends `<general>` only, so the scope you set in Jamf Pro is kept.
  - The token needs Create, Read, Update and Delete on Restricted Software. Use an API client, or `POST /api/v1/auth/token`. The script hands the token to curl on stdin (curl 7.55 or later), so it never shows in a process list. TLS verification stays on.
- **By hand:** download the **XML** file. Each `<restricted_software>` element is one Classic API body for `POST /JSSResource/restrictedsoftware/id/0`. You can also enter the same values under **Computers > Restricted Software > New**.

Records are created with an **empty scope**. Nothing is restricted until you scope them.

## Test

1. Scope each record to a test Smart Group only.
2. On a test Mac, run `sudo jamf manage`, or wait for check-in.
3. Open the app: Jamf stops it and shows the message.
4. Then widen the scope. For group payloads (`group_id`), scope each to the Smart Group that matches the Whiteout group.

## Roll back

Run the script with `--remove`, which deletes the records it names, or delete the records under **Computers > Restricted Software**.

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
