# Network Visibility

Desktop Guard can watch a device's network for traffic to AI services. That traffic is behind **Shadow AI — active** findings, including the per-browser findings in [Browser coverage](./ai-footprint/browser-coverage.md). But some browsers look up website addresses themselves, and some networks send browser traffic through a gateway, and in both cases Desktop Guard can't see which AI sites the browser reaches.

The **Network visibility** card in **Coverage → AI Footprint** shows, per device, whether Desktop Guard can see browser AI traffic, and what to do when it can't. It opens as one line; choose **Show what to do** (or **Details**) to see the counts, gateways and policies below.

> **Whiteout only reports this.** It never changes network or browser settings. It doesn't act as a proxy, rewrite DNS, decrypt traffic or capture packets, and it never turns off or works around a secure web gateway. Any change is yours to make, through your MDM.

---

## How Desktop Guard sees AI traffic

On **Windows**, Desktop Guard's network sensor watches the device's connections and the name lookups made through Windows' own DNS resolver, and matches them against Whiteout's list of AI hosts. It records only the AI host, the process, the hour and a count of connections. It never sees what's sent.

That works only when a browser asks Windows to look up the name. Two common browser settings prevent it:

- **Built-in DNS client.** Chrome and other Chromium-based browsers can resolve names with their own DNS client, which bypasses the Windows resolver.
- **DNS over HTTPS.** Firefox turns DNS over HTTPS on by default in some regions, including the United States, and so can Chromium-based browsers.

In both cases the browser's AI traffic is invisible to the sensor. A secure web gateway hides it too, because the browser hands its traffic to the gateway.

On **macOS**, device-level network observation isn't available yet.

---

## The verdicts

Desktop Guard 1.8.106 and later reports how each device's browsers resolve names, whether a proxy or gateway is in use, and whether its network sensor is running. Whiteout turns that into one verdict per device. The card counts devices in each.

| Verdict | Meaning |
|---|---|
| **Visible** | Desktop Guard sees AI traffic from every browser on the device. |
| **Browsers not visible** | At least one browser resolves names itself, so Desktop Guard can't see its AI traffic. |
| **Through a gateway** | Browser traffic goes through a proxy or secure web gateway. |
| **Not observed on this device** | The device doesn't observe network traffic. Browser coverage comes from the extension and the profile scan. |
| **Not reported yet** | The device's Desktop Guard doesn't report network visibility yet. |

The same information appears in two more places:

- **Finding drawers.** When a **Shadow AI — active** finding comes from a device that isn't **Visible**, its drawer adds one line saying the findings for that device may be incomplete, and why.
- **Coverage → Enrollment → Browsers.** The **Traffic visible** column gives the answer per browser: **Visible**, **Not visible — built-in DNS**, **Not visible — DNS over HTTPS**, **May not be visible — DNS mode unknown**, **Through gateway**, or **—** when the device doesn't observe network traffic.

---

## Visible

The device runs Windows, Desktop Guard's network sensor is running, no gateway is in use, and every browser looks up names through Windows. Desktop Guard sees AI traffic from every browser, so the per-browser findings for this device are complete.

Nothing to do.

---

## Browsers not visible

At least one browser on the device uses its built-in DNS client or DNS over HTTPS. A browser whose DNS mode Desktop Guard couldn't determine, such as Firefox on its regional default, also counts as not visible. Whiteout never assumes it can see traffic it may not.

The card lists each browser that isn't visible, with the number of devices and the policy that fixes it. **Copy MDM policy** copies the exact settings.

These policies put the browser's lookups back on the system resolver. They're the same settings Zscaler and Netskope recommend so their own DNS controls work, so they don't conflict with a gateway. If all browser traffic already goes through your gateway, skip them and [import the gateway's logs](./ai-footprint/network-logs.md#import) instead.

Turning DNS over HTTPS off in the browser means the browser no longer encrypts its own lookups. They go to the system's DNS like every other app's.

### Chrome, Edge, Brave, Chromium and Vivaldi

| Policy | Value |
|---|---|
| `BuiltInDnsClientEnabled` | `false` (on Windows, a `REG_DWORD` of `0`) |
| `DnsOverHttpsMode` | `off` (on Windows, a `REG_SZ`) |

| Browser | macOS preference domain | Windows registry key |
|---|---|---|
| Chrome | `com.google.Chrome` | `HKLM\SOFTWARE\Policies\Google\Chrome` |
| Edge | `com.microsoft.Edge` | `HKLM\SOFTWARE\Policies\Microsoft\Edge` |
| Brave | `com.brave.Browser` | `HKLM\SOFTWARE\Policies\BraveSoftware\Brave` |
| Chromium | `org.chromium.Chromium` | `HKLM\SOFTWARE\Policies\Chromium` |
| Vivaldi | `com.vivaldi.Vivaldi` | Not listed by Whiteout. Check Vivaldi's documentation. |

macOS configuration profile content (for example, in a Jamf **Application & Custom Settings** payload or an Intune custom profile for the domain above):

```xml
<key>BuiltInDnsClientEnabled</key>
<false/>
<key>DnsOverHttpsMode</key>
<string>off</string>
```

### Firefox

| Policy | Value |
|---|---|
| `DNSOverHTTPS` | `Enabled` = `false`, `Locked` = `true` |

- **macOS:** preference domain `org.mozilla.firefox`. Firefox on macOS reads policy only when `EnterprisePoliciesEnabled` is true, so include it.
- **Windows:** registry key `HKLM\SOFTWARE\Policies\Mozilla\Firefox\DNSOverHTTPS`, with `Enabled` as a `REG_DWORD` of `0` and `Locked` as a `REG_DWORD` of `1`.

```xml
<key>EnterprisePoliciesEnabled</key>
<true/>
<key>DNSOverHTTPS</key>
<dict>
  <key>Enabled</key>
  <false/>
  <key>Locked</key>
  <true/>
</dict>
```

### Opera, Arc, Comet and Aside

These browsers have no enterprise policy for this. Their coverage comes from the Whiteout extension and the [profile scan](./ai-footprint/browser-coverage.md).

### With Whiteout's MDM deployment payload

If you deploy with [Zero-Touch MDM](./deployment/zero-touch-mdm.md), the deployment payload includes these settings for Chrome, Edge and Firefox as a separate, clearly labelled optional block, **Network visibility (optional)**. Nothing in it is applied unless you choose to:

- **Intune:** run `intune-fanout.py` with `--network-visibility` (together with `--browser-group`) to create these profiles. As with the Firefox force-install profile, Mozilla's Firefox ADMX templates must be imported into Intune first.
- **Jamf:** the payload has a **NETWORK VISIBILITY (OPTIONAL)** section you can upload as its own profiles.

After the policy reaches a device, its verdict updates at Desktop Guard's next report, within about 15 minutes.

---

## Through a gateway

The device sends browser traffic through a proxy or secure web gateway. Whiteout reports this verdict when:

- the device uses a proxy auto-config (PAC) file, an explicit proxy or a tunnel, or
- one of these gateway agents is running: **Zscaler**, **Netskope**, **Palo Alto GlobalProtect**, **Cisco Secure Client (Umbrella)**, **Cloudflare WARP** or **Forcepoint**.

Automatic proxy detection on its own doesn't count, because Windows turns it on by default whether or not a proxy exists. A gateway agent that's installed but not running doesn't count either.

**Why it isn't visible.** The browser connects to the gateway, not to the AI site, so the device can't tell which AI sites were reached.

**What to do: import the gateway's logs.** The gateway already records which sites each person reached. The card lists **Gateways detected**, with the vendor and number of devices, and a button such as **Import Zscaler logs** that opens the import with the right format chosen:

| Gateway | Import format |
|---|---|
| Zscaler | Zscaler web (NSS) |
| Cisco Secure Client (Umbrella), Cisco Umbrella | Cisco Umbrella DNS |
| Netskope, Palo Alto GlobalProtect, Cloudflare WARP, Forcepoint, or a proxy Whiteout couldn't identify | Generic CSV |

See [Importing network logs](./ai-footprint/network-logs.md#import).

Whiteout never recommends turning a gateway off or getting around it. Desktop Guard reports only the proxy mode and the gateway vendor's name, never proxy addresses, PAC file locations or DNS server addresses.

---

## Not observed

The UI label is **Not observed on this device**. The device doesn't observe network traffic, so it can't raise **Shadow AI — active** findings.

- **Macs.** Device-level network observation isn't available on macOS yet. Every Mac shows this verdict.
- **Windows devices whose network sensor isn't running.**

What still works: the Whiteout extension checks prompts in every browser profile it's in, the [profile scan](./ai-footprint/browser-coverage.md) finds profiles without it, and [imported network logs](./ai-footprint/network-logs.md) show AI use from any device on your network.

---

## Not reported

The UI label is **Not reported yet**. The device's Desktop Guard is older than 1.8.106, or it hasn't sent its first report. Desktop Guard updates itself. Once it's on 1.8.106 or later, the device reports within about 15 minutes.
