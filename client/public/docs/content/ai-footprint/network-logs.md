# Importing Network Logs

Your DNS and proxy logs see AI use that your endpoints can't show you: people who don't have the browser extension or Desktop Guard, devices Whiteout isn't on, browser traffic that goes through a secure web gateway, and identities that aren't Whiteout users. Importing those logs into AI Footprint turns that AI use into evidence and findings.

> **Only AI-site rows are kept.** Every other row is discarded while the file is read. It's never stored.

---

## Import

1. Go to **Coverage → AI Footprint** and choose **Import network logs**. If the **Network visibility** card lists a gateway, its button (for example **Import Zscaler logs**) opens the same dialog with the format already chosen.
2. Choose the **Log format**.
3. Choose **Choose file** and pick the log.
4. Choose **Import**.

When the import finishes, the dialog shows **Rows read**, **AI rows kept**, **AI sites**, **Users matched**, **Unmatched identities** and **Findings opened**, plus the AI tools it found. Choose **View findings** to go to the **Findings** tab. The AI rows appear on the **Egress** tab, with the observer **Cisco Umbrella DNS log**, **Zscaler web log** or **Network log (CSV)**.

Only admins can import. Read-only viewers can't.

### Formats

| Log format | What to upload |
|---|---|
| **Cisco Umbrella DNS** | The DNS log export (`.csv.gz` from S3, no header row), or an Activity Search CSV export |
| **Zscaler web (NSS)** | A web-log NSS feed saved as CSV or TSV, with or without a header row |
| **Generic CSV** | Any CSV with a header row: a timestamp, a host / domain / URL column, and a user / email or client IP column |

For **Generic CSV**, Whiteout recognizes common header names, such as `timestamp` or `time`; `host`, `domain`, `url` or `dest`; `user`, `username`, `email`, `identity` or `upn`; and `src_ip` or `client_ip`. If there's a URL column, only its hostname is used.

### Limits

- **Up to 200 MB per file,** as uploaded. Gzip a large log (`.csv.gz`), or split it into several files.
- **The same file can't be imported twice within 30 days.** A byte-identical file is refused, because importing it again would double-count its traffic. The message gives the date it was first imported.
- **One import at a time** per organization.
- **Rows the gateway blocked are skipped.** A blocked request isn't AI use.
- **A row with a time Whiteout can't read** is counted at the time of the import.
- **Times without a time zone** are read as UTC.

### Import recent logs, regularly

Findings are based on AI traffic from the **last 7 days** in your imported logs. Older rows are kept as evidence on the **Egress** tab but don't open findings. A finding resolves by itself once that person or identity has no AI traffic in the last 7 days of imported logs, so import new logs regularly, for example daily or weekly, to keep findings current.

---

## Getting logs out of your gateway

These are the exports Whiteout reads. For the exact steps in your console, see your vendor's documentation: [Cisco Umbrella documentation](https://docs.umbrella.com/) and [Zscaler Help](https://help.zscaler.com/zia).

**Cisco Umbrella.** Two exports work:

- **The DNS logs Umbrella writes to an Amazon S3 bucket** when log management is set up. These are gzipped CSV files with no header row. Upload them as they are.
- **A CSV export of the Activity Search report.** It has a header row. Its timestamps follow your Umbrella account's time zone, and Whiteout reads them as UTC, so expect an offset if your account isn't on UTC.

**Zscaler.** Use a **web log** NSS feed. You define the feed's output format, and NSS writes no header row. Include at least the time, the user (`login`), the URL or host, and the client IP. Whiteout recognizes Zscaler's field names when a header row is present, and otherwise works out the columns from the first rows of the file. Save it as CSV or TSV.

**Other gateways** (Netskope, Palo Alto, Cloudflare, Forcepoint and others): export a CSV with a header row and use **Generic CSV**.

---

## Privacy

- **The file is read as a stream.** Each row whose host isn't an AI site is discarded on the spot. It's never stored, buffered or logged.
- **For AI rows, Whiteout keeps only** the hostname, the hour, a count of requests, and the identity. Never paths, query strings, full URLs or byte counts.
- **The uploaded file isn't kept.** The audit log records the import: the file name and size, a fingerprint of its contents (to catch a duplicate), and the counts.
- **What counts as an AI site** is Whiteout's AI catalog plus any sites your organization has added with **Add to catalog**. See [Web AI sites](./ai-footprint/web-ai-sites.md#unknown-sites).

---

## How identities are matched to users

Each AI row's identity (the user, login or email in the log, or else the client IP) is matched to a Whiteout user:

| The log says | Matches |
|---|---|
| An email address, such as `jdoe@example.com` | The user with that email, ignoring case. Alternate emails from your identity provider match too. |
| A name with an email in it, such as `Jane Doe (jdoe@example.com)` | The user with that email |
| A username, such as `jdoe` or `CORP\jdoe` | `jdoe@<your organization's email domain>`. If no domain is set for your organization, it matches only when exactly one user has that username. |
| An IP address, or anything else that doesn't match a user | No user. These become unmatched identities. |

All of one person's identities across logs roll up to that person. Rows that name nobody are grouped under one identity, `unattributed`.

What happens next depends on the match:

| Identity | Result |
|---|---|
| Matched, and the person has a live Whiteout surface on any device | Evidence only, on the **Egress** tab. No finding. |
| Matched, with no live Whiteout surface on any device | **AI use with no Whiteout on any device** |
| Not matched to any user | **AI use by someone we can't match to a user** |

---

## Ungoverned usage

**AI use with no Whiteout on any device** means your imported logs show a Whiteout user using AI sites in the last 7 days, and none of their devices has a live Whiteout surface: no browser extension, Desktop Guard or IDE extension that has checked in recently. Nothing they sent was checked.

**Severity:** high, and critical once it has been seen on 3 or more days.

Common causes: the person was never set up, Whiteout was removed or stopped running on their device, or they use a device Whiteout isn't on.

**How to resolve it:**

1. Check the person under **Coverage → Enrollment**.
2. Deploy the browser extension (an MDM force-install is best) and Desktop Guard for them. See [Zero-Touch MDM](./deployment/zero-touch-mdm.md) or [Installing without MDM or SSO](./deployment/install-without-mdm.md).
3. If their use of the service is sanctioned, allowlist the service (its host, for example `chatgpt.com`, or its provider) or the person's email under **Manage → Allowlisted tools**.

The finding resolves by itself once a Whiteout surface is live for the person, or once their imported traffic is more than 7 days old.

---

## Unknown actor

**AI use by someone we can't match to a user** means your imported logs show AI traffic from an identity that matches no Whiteout user. The drawer shows the identity.

**Severity:** medium, and high once it has been seen on 3 or more days.

It's often one of these:

- someone not yet invited to Whiteout, such as a new hire or a contractor
- a shared or guest network, or a NAT address many devices share
- a service account or a server
- a username format Whiteout couldn't turn into an email address

**How to resolve it:**

1. Find out who or what it is. The identity and the AI tools are in the finding.
2. **If it's a person,** invite them and get them enrolled. If their log identity is a username that doesn't match their email address, export the log with an email or UPN column if your gateway can, or make sure the address appears as an alternate email from your identity provider.
3. **If it's a sanctioned system,** add `net:<identity>` (or the identity itself) to **Manage → Allowlisted tools**.

The finding resolves by itself once that identity has no AI traffic in the last 7 days of imported logs.

To stop all findings from imported logs, mute **Imported network logs** under **Manage → Muted categories**. The rows stay on the **Egress** tab.

---

## Notifications

New findings from an import raise the **Shadow AI detected** notification. A first import can open many **unknown actor** findings at once, so each pass notifies for at most 20 new findings. The rest are still on the **Findings** tab.
