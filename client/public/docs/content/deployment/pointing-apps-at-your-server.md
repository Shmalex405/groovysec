# Pointing Apps at Your Server

On a self-hosted deployment, your Whiteout apps need the address of your own
Whiteout server. Usually they find it themselves. This page covers the cases
where they can't, and the three ways to tell them: through your MDM, with a
setup link, or in each app.

---

## Who this is for

This page is for **self-hosted deployments** only. On Whiteout's hosted
service there's nothing to set up.

By default, the apps find your server through **central discovery**. Groovy
Security registers your email domains and your server address centrally. When
someone signs in to a Whiteout app with their work email, the app looks up
their email domain, learns your server's address and connects to it, with no
per-device setup. See
[How the apps find your server](./deployment/self-hosted-aws.md#how-the-apps-find-your-server).

Point the apps at your server yourself when central discovery can't do it:

| Situation | Why central discovery doesn't help |
|-----------|-----------------------------------|
| **An email domain that isn't registered yet** | For example a newly acquired company. Until Groovy Security adds the domain, central discovery doesn't know where to send those people |
| **No route to central discovery** | An air-gapped deployment, or a network that blocks outbound traffic to `api.whiteout.groovysec.com` |
| **Testing** | A second server, such as a staging deployment, for people whose email domain is registered to production |
| **You want the address fixed** | An MDM-set address can't be changed by the person using the computer |

---

## Your server address

Your server's address is `https://<api_domain>`, where `api_domain` is the
hostname you set in Terraform. `terraform output -raw api_url` prints it. For
example: `https://whiteout.yourcompany.com`.

An address must start with `https://`, and its host must be a DNS name, not an
IP address. It can include a port and a path, and has no trailing slash.

Check it from any computer:

```bash
curl https://whiteout.yourcompany.com/public/server-info
# {"product":"whiteout-ai","api_base":"https://whiteout.yourcompany.com"}
```

`"product":"whiteout-ai"` is how the apps recognize a Whiteout server. The
`api_base` it reports is the address they save, whatever form you typed: with
a trailing slash, say, or `:443`.

---

## Option 1: Set it with your MDM (recommended)

An address set by your MDM is fixed for that computer. The apps hide
**Use a different server**, and ignore setup links: Desktop Guard says
*"Your organization manages which server Whiteout uses, so this link was
ignored."*

> **Zero-Touch MDM already does this for Desktop Guard.** The deployment
> payload your server generates carries its own address. See
> [Zero-Touch MDM](./deployment/zero-touch-mdm.md).

### Desktop Guard and the Whiteout AI desktop app

Both apps read the same managed settings, so one payload configures both.

**macOS:** a configuration profile with custom settings for the preference
domain `com.groovysecurity.whiteout-desktop-guard`.

| Key | Value |
|-----|-------|
| `apiBase` | Your server address, for example `https://whiteout.yourcompany.com` |
| `orgId` | *Optional.* Your organization's ID |
| `orgDomain` | *Optional.* Your email domain |
| `ssoConfigId` | *Optional.* The identity provider to sign in with |
| `enrollmentToken` | Zero-Touch MDM only, one per device |

**Windows:** string (`REG_SZ`) values under
`HKLM\SOFTWARE\Policies\GroovySecurity\WhiteoutDesktopGuard`: `ApiBase`, and
optionally `OrgId`, `OrgDomain` and `SsoConfigId`. Deliver them by Group Policy,
or with an Intune custom configuration profile or script.

### Browser extension

The extension reads managed settings in **Chrome** and **Microsoft Edge**
(Edge from extension 1.12.0). Set them as the extension's policy:

| Key | Value |
|-----|-------|
| `orgApiBase` | Your server address |
| `orgSlug` | *Optional.* Your organization's slug, for display |
| `ssoConfigId` | *Optional.* The identity provider to sign in with |

| Browser | Where the policy goes |
|---------|-----------------------|
| **Chrome** | Windows: `HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\dcbndpnolggjgmclalpdcogigpedlhpn\policy`. macOS: the preference domain `com.google.Chrome.extensions.dcbndpnolggjgmclalpdcogigpedlhpn` |
| **Edge** | Windows: `HKLM\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\oihdhmfgchleljlnddplaaaoeffmjdao\policy`. macOS: the preference domain `com.microsoft.Edge.extensions.oihdhmfgchleljlnddplaaaoeffmjdao` |

In Firefox, people set the server in the extension instead (Option 3).

### VS Code

Set `whiteout.apiBase` to your server address, through the policy or
default-settings mechanism you use for VS Code. When the value comes from
there, **Whiteout: Set Server Address** is hidden.

With `whiteout.apiBase` empty, VS Code extension 1.24.0 and later uses the
server Desktop Guard or the desktop app is connected to, so on most computers
you don't need to set it at all.

### JetBrains IDEs

The JetBrains plugin has no managed setting. Set **API Base URL** in each IDE
(see Option 3).

> **Someone who is already signed in stays on their server.** A signed-in app
> keeps talking to the server it signed in to. A new MDM address applies the
> next time the person signs in.

---

## Option 2: Send people the setup link

Every self-hosted server has a setup page:

```
https://<your server>/public/setup
```

It opens **Set up Whiteout on this computer**: *"Your company runs its own
Whiteout server. Connect your Whiteout apps to it."* The page shows:

- **Your server address**, with a **Copy** button
- **Open Whiteout and connect**, which hands the address to Desktop Guard or
  the Whiteout AI desktop app
- the hint *"Nothing happened? Install Desktop Guard or the Whiteout AI app
  first, then click again."*
- **Other Whiteout apps**: how to set the server in the browser extension, VS
  Code and JetBrains IDEs
- *"Then sign in with your work email."*

The address on the page always comes from your server's own settings, never
from the link, so a doctored link can't send people somewhere else. Adding
`?email=` with a work address only fills in that email, on the page and at the
app's sign-in.

### Emails send it for you

On a self-hosted server, invitation, reminder and re-activation emails include
a setup link for each person automatically. When people install Whiteout
themselves, the email has a section headed **Connect Whiteout to your
company's server.**: *"After installing, open Set up Whiteout on this computer on the same
computer. Or choose Use a different server when signing in and enter*
`<your server>`*."* When IT installs it, the email has one line: *"If a
Whiteout app asks which server to use, open Set up Whiteout on this computer or
enter* `<your server>`*."* Which version people get follows
**Coverage → Enrollment → Settings → How Whiteout gets installed**.

The **You're all set!** page people see after creating their account also
shows your server address, with **Copy** and **Open Whiteout and connect**.

### What people see

1. They click **Open Whiteout and connect**. Desktop Guard (or the desktop app)
   opens and asks **Connect Whiteout to a different server?**
2. The dialog shows your server's host name in full, and your organization's
   name when the server recognizes their email: *"Whiteout will send your
   sign-in and AI activity to: {host}. Only continue if your IT team or your
   invitation told you to use this server."*
3. They click **Connect**. The app confirms *"Connected to {host}. Sign in with
   your work email."*, and they sign in.

Desktop Guard and the desktop app share the address, so connecting one
connects both. The browser extension and JetBrains IDEs need it set
separately; the setup page tells people how.

The button needs **Desktop Guard 1.8.88** or **desktop app 2.86.27** or later.
With neither installed, clicking it does nothing, which is what the hint is
for.

---

## Option 3: Set it in each app

Each app can be pointed at a different server from its sign-in screen. The
person has to be **signed out** to change it.

| App | Where |
|-----|-------|
| **Desktop Guard** (macOS and Windows) | The Control Panel's sign-in: **Use a different server**, under the sign-in form |
| **Whiteout AI desktop app** | The sign-in screen: **Use a different server** |
| **Browser extension** (Chrome, Edge, Firefox) | Click the Whiteout icon in the toolbar, then **Use a different server** |
| **VS Code, Cursor and Windsurf** | Command Palette: **Whiteout: Set Server Address** |
| **JetBrains IDEs** | **Settings → Tools → Whiteout AI → API Base URL** |

In Desktop Guard, the desktop app, the browser extension and VS Code:

1. Enter the address under **Server address** and click **Continue** (in VS
   Code, press Enter).
2. In the browser extension, the browser asks permission to connect to your
   server. Choose **Allow**.
3. The app checks the server, then asks **Connect Whiteout to a different
   server?**, showing the host. Click **Connect**.
4. The app says *"Connected to {host}. Sign in with your work email."*

From then on, the sign-in screen in Desktop Guard, the desktop app and the
browser extension shows **Server: {host} · Change · Use Whiteout Cloud**.
**Change** enters a different address. **Use Whiteout Cloud** switches back to
Whiteout's hosted service. In VS Code, run **Whiteout: Set Server Address**
again to change it, or clear the `whiteout.apiBase` setting to switch back.

In JetBrains IDEs, enter the address in **API Base URL**, apply the setting and
sign in. The plugin doesn't run the checks below.

The Safari extension hasn't been tested with a different server yet.

### Where the choice is kept

| App | Stored in | Kept after sign-out? |
|-----|-----------|----------------------|
| **Desktop Guard and the desktop app** | `~/.whiteout-desktop/server.json` (on Windows, `%USERPROFILE%\.whiteout-desktop\server.json`), readable only by that user | Yes. Only **Use Whiteout Cloud** removes it |
| **Browser extension** | The extension's own storage, per browser profile | Yes |
| **VS Code** | `whiteout.apiBase` in the person's user settings | Yes |
| **JetBrains IDEs** | The plugin's **API Base URL** setting | Yes |

---

## What the apps check before connecting

Desktop Guard, the desktop app, the browser extension and VS Code all apply
the same checks, whether the address was typed or came from a setup link:

- **HTTPS only.** No `http://`, no IP addresses, and no user name, password,
  query or fragment in the address. They never guess a scheme.
- **It must be a Whiteout server.** They ask the server's `/public/server-info`
  and only go on when it answers `"product":"whiteout-ai"`. An older server
  without that endpoint is checked with `/health` instead.
- **The server's own address is what's saved.** They store the `api_base` the
  server reports, not the text that was typed or linked.
- **The operating system decides which certificates to trust.** There's no
  option to accept a certificate the computer doesn't trust.
- **Links never carry credentials.** A setup link only passes the server
  address and, optionally, an email address. A link that contains anything
  else that looks like a credential is rejected outright, and no app accepts a
  sign-in from a link.
- **Nothing changes without a click.** The confirm dialog always shows the
  host in full, and nothing is saved until the person clicks **Connect**.
- **Never while signed in.** The option is hidden or refused until the person
  signs out.
- **Apart from your MDM, the browser extension only takes an address typed
  into its own popup**, never one from a web page or from another app.
- **Your server stays your server.** If your server doesn't recognize
  someone's email, the app shows that error. It doesn't fall back to
  Whiteout's hosted service.

---

## Troubleshooting

### Messages

| Message | What it means | What to do |
|---------|---------------|------------|
| *"The server address must start with https://."* | The address has no scheme, or uses `http://` | Type the full address, starting `https://` |
| *"Enter a server address like https://whiteout.yourcompany.com."* | The address isn't valid: an IP address, a query string or a user name, for example | Use your server's DNS name |
| *"{host} isn't a Whiteout server. Check the address with your IT team."* | Something answered, but not as a Whiteout server: another web server, or a proxy or captive-portal page | Check the address. `curl https://<server>/public/server-info` should return `"product":"whiteout-ai"` |
| *"Couldn't reach {host}. Check the address, or connect to your company network or VPN, and try again."* | No answer: a wrong name, DNS, a firewall, no VPN connection, or a certificate the computer doesn't trust | See [Certificates](#certificates) and [Firewalls and network access](#firewalls-and-network-access) |
| *"Too many attempts. Wait a minute and try again."* | The server, or central discovery, is limiting lookups from this network | Wait a minute. See [Many people signing in at once](#many-people-signing-in-at-once) |
| *"Sign out first to change servers."* | The person is signed in | Sign out, then change the server |
| *"You're signed in to {host}. Sign out first, then open the link again."* | A setup link was opened while signed in | Sign out of Desktop Guard (or the desktop app) and click the link again |
| *"Your organization manages which server Whiteout uses, so this link was ignored."* | Your MDM sets the address on this computer | Change the address in your MDM, not with a link |
| *"Whiteout needs your permission to connect to {host}. Try again and choose Allow."* | In the browser extension, the browser's permission prompt was declined | Try again and choose **Allow** |

### Certificates

The apps trust what the operating system trusts. If your server's certificate
is issued by an internal certificate authority, for example because a
TLS-inspecting proxy sits in front of it, that CA must be trusted on every
computer: in the System keychain on macOS, and in **Trusted Root
Certification Authorities** on Windows. Push it with your MDM or Group Policy.
Until it's trusted, the apps report that they *couldn't reach* the server.

### Org lookup on your own server returns 404

On a current release, a server that hosts one organization answers org lookups
for any work email address. On an older release it only answers for your
organization's email domain, once that's set: it comes from the `email_domain`
Terraform variable (`EMAIL_DOMAIN` on the server). Check with:

```bash
curl "https://<server>/public/org-lookup?email=someone@yourcompany.com"
```

A `404` with `{"detail":"Organization not found"}` means the domain isn't set.
Your deployment guide covers setting it. For people on other email domains,
ask Groovy Security to add them.

### Firewalls and network access

Each computer needs HTTPS access to your server, on port 443 or the port in
its address, from wherever people work: through your VPN if the server is
internal. Central discovery also needs outbound HTTPS to
`api.whiteout.groovysec.com`. Where that's blocked, use Option 1, 2 or 3.

### Many people signing in at once

Your server and central discovery both limit how many lookups one IP address
can make in a short time. A large office behind one public IP address, all
signing in during a rollout, can hit the limit and see *"Too many attempts"*.
It clears within minutes. Before a large rollout, tell Groovy Security.

### The browser extension can't talk to your server (CORS)

The browser extension calls your server from its own extension origin. Your
deployment always allows `https://<api_domain>` and the Chrome and Edge
extension origins:

- `chrome-extension://dcbndpnolggjgmclalpdcogigpedlhpn` (Chrome)
- `chrome-extension://oihdhmfgchleljlnddplaaaoeffmjdao` (Edge)

To allow another origin, such as your own web front end, add it to the
`additional_allowed_origins` Terraform variable and apply. Don't remove the
defaults. If you deployed from an older module release that doesn't include
the extension origins, update the module, or add them to
`additional_allowed_origins` yourself.

---

## Minimum versions

| App | Minimum version | What needs it |
|-----|-----------------|---------------|
| **Desktop Guard** | 1.8.88 | The setup link and **Use a different server**. On macOS, also an MDM `apiBase` on computers without an enrollment token |
| **Whiteout AI desktop app** | 2.86.27 | The setup link and **Use a different server** |
| **Browser extension** | 1.12.0 | **Use a different server**, an MDM `orgApiBase` applied without opening the popup, and managed settings in Edge |
| **VS Code extension** | 1.24.0 | **Whiteout: Set Server Address**, and following the server Desktop Guard or the desktop app uses |
| **JetBrains plugin** | Any | **API Base URL** |

Your server also needs a current backend release for `/public/server-info` and
`/public/setup`. Self-hosted deployments update automatically unless you've
pinned a version; see
[Self-Hosted AWS](./deployment/self-hosted-aws.md#automatic-updates).

---

## Related

- [Self-Hosted AWS](./deployment/self-hosted-aws.md): your server address,
  using your own domain, and central discovery.
- [Installing Without MDM or SSO](./deployment/install-without-mdm.md):
  installing and signing in to each app.
- [Zero-Touch MDM](./deployment/zero-touch-mdm.md): silent enrollment through
  your MDM.
