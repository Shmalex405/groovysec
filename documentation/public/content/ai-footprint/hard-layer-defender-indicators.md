# Microsoft Defender for Endpoint: indicators for blocked AI tools

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It is a CSV in Defender's own import format: the parameters listed under **Import a list of IoCs** in Microsoft's "Manage indicators" page, in the order of the portal's sample CSV. It holds:
- a `FileSha256` row for each blocked binary, by the file's SHA-256 (the plain file hash, which is what Defender matches);
- a `DomainName` row for each blocked AI site.

The Action is **Block** for an enforce-mode decision and **Audit** for a monitor-mode one. It is never `BlockAndRemediate`: Whiteout never asks for a file to be quarantined or deleted. URL paths aren't included, because domain indicators block whole domains. Each row's Description carries the organization and the generation time.

Whiteout generates the file; you import it.

## Import

1. Defender imports one entity type per tab, at most 500 indicators per file. So:
   - import the **CSV: file hashes only** file on **Settings > Endpoints > Indicators > File hashes > Import**;
   - import the **CSV: domains only** file on the **URLs/domains** tab.

   the **CSV** file has both types, for review. A format with more than 500 rows is split into numbered files (named `-partK-of-N`), each its own download. Import each part.
2. Domain indicators block outside Edge only when **network protection** is in block mode.
3. File indicators need the Defender antimalware engine in active mode, and cloud-delivered protection.
4. Leave `RbacGroups` empty for every device, or fill in a device group name to scope the indicators (for example, for a group payload).

## Test

1. Before importing, change the Action column to `Audit` (or import only the Audit rows of monitor-mode decisions).
2. Run the blocked app or open the site on a test device, and check that the alerts name only what you meant.
3. Then import again with `Block`. Importing the same indicator again updates it.

## Roll back

Under **Settings > Endpoints > Indicators**, filter by the title prefix "Whiteout AI:", select the indicators and delete them.

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
