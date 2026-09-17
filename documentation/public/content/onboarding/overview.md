# Onboarding Walkthrough

Getting from a new Whiteout AI tenant to a governed pilot group, end to end.

Follow this page in order. At two points — your identity provider and your
device management platform — you pick your own and follow that guide, then come
back here. Everything else is the same whatever you run.

**Roughly an hour**, most of it waiting for your MDM to push a profile.

---

## What you need before you start

| | |
|---|---|
| **Your Whiteout tenant** | Provisioned by Groovy Security. You will have a URL and a first admin sign-in |
| **Identity provider admin** | Enough rights to register an application and grant admin consent |
| **MDM admin** | Enough rights to create an API credential and assign a configuration profile |
| **A pilot list** | The people you want governed first. Start small — a handful, not the whole company |

You do **not** need to deploy anything to every device to begin. The whole
point of the steps below is that you choose exactly who is covered.

---

## The shape of it

```
  1. Sign in                    first admin, set a real password
        ↓
  2. Connect your IdP           ← pick your provider
        ↓
  3. Onboard your pilot users   selective — only the people you name
        ↓
  4. Connect your MDM           ← pick your platform
        ↓
  5. Generate credentials       Whiteout mints; your MDM distributes
        ↓
  6. Verify coverage            confirm each person is actually protected
```

Steps 2 and 3 are separate on purpose. Connecting your directory lets people
*sign in*; onboarding decides who Whiteout *manages*. You can connect a
10,000-person directory and onboard twelve.

---

## Step 1 — Claim the admin account

There is no initial password to be sent one. When Groovy provisions your
tenant, an administrator account is created in a pending state with no
password, and a **one-time setup link** is emailed to the contact address you
gave us.

1. Find the setup email. The account is `admin@<your-domain>` unless you asked
   for something else.
2. Follow the link and set a password.
3. Sign in at your tenant URL.
4. Go to **Profile** and set a recovery email — particularly if the admin
   address is a shared mailbox rather than a person.

> **The setup link expires after 48 hours.** If provisioning and your first
> sign-in are a few days apart, expect it to have lapsed. That is not a
> problem — ask your Groovy contact to reissue it, which takes a moment and
> creates no duplicate account.

> **Keep this account after SSO is connected.** Your team will sign in through
> your identity provider, but this local admin is your way back in if that
> connection breaks — an expired client secret, revoked consent, a tenant
> migration. It exists precisely for the case where SSO is the thing that is
> broken, so do not delete it once SSO works.

---

## Step 2 — Connect your identity provider

**Integrations → Identity Providers (SSO) → Connect**

Pick yours and follow that guide, then return here:

| | |
|---|---|
| [Microsoft Entra ID](/admin-guides/sso-providers/microsoft-entra-id) | Azure AD. Most common alongside Intune |
| [Okta](/admin-guides/sso-providers/okta) | |
| [Google Workspace](/admin-guides/sso-providers/google-workspace) | |
| [JumpCloud](/admin-guides/sso-providers/jumpcloud) | |
| [OneLogin](/admin-guides/sso-providers/onelogin) | |
| [Ping Identity](/admin-guides/sso-providers/ping-identity) | PingOne |
| [Auth0](/admin-guides/sso-providers/auth0) | Sign-in only — see the note below |
| [Generic OIDC](/admin-guides/sso-providers/generic-oidc) | Sign-in only — see the note below |
| [Generic SAML](/admin-guides/sso-providers/generic-saml) | Sign-in only — see the note below |

### Two things that decide whether the rest of this works

**Directory sync is a separate permission from sign-in.** Every provider in the
first six rows can enumerate your directory, but only with admin-level API
credentials granted *in addition* to the sign-in ones. Granting only the
sign-in permissions produces a connection that logs users in perfectly and
syncs nobody — and because the steps below map devices to people by email
address, no users means no devices get governed either.

The provider picker marks the last three rows **Sign-in only**. Those have no
directory to enumerate at all, so steps 3 and 5 do not apply — add people by
SCIM or by invitation instead.

**Click Test Connection before moving on.** It does not just check the
credentials authenticate; it reads your directory the way sync will. If it
reports a missing permission, fix that first. A green result here means sync
will work.

### Then confirm Whiteout can read your directory

Open **Configure → Users** on the provider card. Your directory is listed
there, read live from your provider — there is no import step, and nothing is
governed by looking at it.

If the list is populated, directory access is working and you can move on. If
it is empty or errors, that is the permissions problem described above, and
**Test connection** on the Settings tab will name what is missing.

### Checking a connection later

**Configure → Settings** on the provider card is where you go afterwards. It
shows JIT provisioning, group sync, default role, sync cadence and the last
sync time, along with any error from the most recent sync.

**Test connection** there re-checks the credentials *and* whether they can
still read your directory — the two fail differently, and a credential that
authenticates while having lost directory access is the one that produces a
sync returning nobody. If the test fails it names the specific permission or
scope to fix.

A provider with no directory at all shows a **sign-in only** notice here, and
its group-sync settings read **Unavailable — no directory** rather than On or
Off, because those toggles cannot do anything for it.

---

## Step 3 — Onboard only your pilot users

This is the step that keeps a pilot a pilot.

1. On the connected provider card, click **Configure**.
2. You land on the **Users** tab — your whole directory, read live from your
   provider. Anyone already
   onboarded shows **In Whiteout**; everyone else shows **Not onboarded**.
   The filter chips along the top split the list into **All**, **Not
   onboarded** and **Onboarded**, and there is a search box for name or
   email.
3. Tick the people in your pilot group.
4. Click **Onboard *n* selected**.

Only those people become Whiteout users. Everyone else stays in your directory,
able to sign in later, and is not governed until you say so.

> **Do not use "Sync entire directory" for a pilot.** It provisions your whole
> directory *and removes any Whiteout user who is no longer in it*. That is the
> right tool for steady-state operation once you are rolling out broadly; it is
> the wrong one when you have deliberately onboarded twelve people out of
> ten thousand.

### Adding someone later

Repeat the same four steps. Selective onboarding is additive — it never removes
anyone, so you can grow the pilot a person at a time.

---

## Step 4 — Connect your device management platform

**Integrations → Mobile Device Management (MDM) → Connect MDM**

| | |
|---|---|
| [Microsoft Intune](/admin-guides/mdm-providers/microsoft-intune) | Windows, macOS, iOS, Android |
| [Jamf Pro](/admin-guides/mdm-providers/jamf) | Apple only |
| [NinjaOne](/admin-guides/mdm-providers/ninjaone) | Windows and macOS. An RMM — deploys by script, not profile |
| [Kandji](/admin-guides/mdm-providers/kandji) | Apple only |
| [Mosyle](/admin-guides/mdm-providers/mosyle) | Apple only |
| [VMware Workspace ONE](/admin-guides/mdm-providers/vmware-workspace-one) | Apple devices — see the Windows note in that guide |

The connection form validates with a live test before saving, so a wrong
credential is caught here rather than at the first sync.

Once connected, run a device sync from the integration row and confirm your
devices appear under **Managed Devices**.

### Check that devices found their people

Whiteout maps each managed device to a person by email address. Under
**Managed Devices**, confirm the pilot devices show the right user.

A device with no user cannot be governed, because there is nobody to attribute
its activity to. The usual causes:

- The identity provider has not been synced yet — do step 2 first.
- The device's account address differs from the directory's primary address.
  Entra and Okta publish alias lists that Whiteout uses automatically; Google,
  JumpCloud, OneLogin and PingOne publish fewer, so an unusual address may need
  correcting at the source.
- The MDM has no user assigned to that device at all.

---

## Step 5 — Generate credentials and hand them to your MDM

### Dry-run first

Before generating anything, dry-run a few representative devices — including
one of each operating system you are deploying to. It walks the full chain and
tells you exactly which link is broken, rather than leaving you to infer it
from a device that never checks in.

Every step should pass. Read the `enroll_anchor_compatible` step carefully on
Windows: it names the minimum Desktop Guard version and whether the device is
joined to your directory in the way enrollment requires.

### Who decides what gets installed

**Your MDM does.** Whiteout never installs software and never pushes anything
to a device. Your IT team deploys Desktop Guard through your MDM's own app
deployment and scopes it however they normally scope software.

What Whiteout produces is the *credential* that lets those devices sign
themselves in — one per device, bound to that device's hardware identifier so
it is worthless anywhere else. That binding is why there is no single shared
connection string to paste: each device needs its own, and the payload below
carries one entry per device.

So the selection you make here is not "who gets Whiteout". It is "who has a
credential waiting". Distribution stays entirely yours.

### Generate the payload

**Integrations → MDM → the download icon on your integration row.**

The dialog opens on **Deploy to all *n* eligible devices**. For a first
generation that is usually what you want — mint for the whole directory, then
let your rollout happen at whatever pace suits you. To narrow it, click
**Choose specific devices** and filter by name or address.

### Set the credential lifetime deliberately

The dialog defaults to **30 days**, which suits deploying now. If you are
generating for the whole organisation ahead of a rollout that runs over months,
choose **Never expires** instead.

This is worth getting right: an expired credential produces a profile that
installs cleanly and silently signs nobody in. There is no error — the device
simply never appears as enrolled.

Two things the device list tells you:

- **Already deployed** marks a device that still holds a live credential from
  an earlier run. Including it again asks you to confirm replacement first, and
  replacement only ever affects the devices you selected — never the rest of
  the fleet.
- **Greyed-out devices cannot be selected**, and each says why underneath. The
  usual reasons are no hardware identifier from the MDM, no mapped person, or a
  hardware identifier shared with another device — a cloned image deployed
  without sysprep, where either machine could redeem the other's credential.

If someone in your pilot is missing from the list, they will be in it greyed
out with the reason. That is the answer to "why isn't Dana here?".

### Adding devices later

New hires and replacement laptops are the normal case, and there is one trap.

When you generate again, **select just the new devices**. Whiteout then issues
credentials for those alone and leaves every existing one untouched.

If you instead generate across the whole integration, it will refuse — the
devices from your first run already hold live credentials. The only way past
that refusal is to reissue for everything, which revokes the credential each
already-deployed device uses to recover a broken session. Nothing breaks
immediately, which is exactly what makes it easy to miss: those devices keep
working until one of them needs to recover and cannot.

Scope to the new devices and none of this arises.

### Windows only: allowlist the publisher first

**Do this before you deploy, not after a user reports a block.** It takes a few
minutes and removes a whole class of problem.

Windows decides whether to trust an unfamiliar binary partly on *reputation* —
how many machines have run it, for how long. A newly released build has none,
regardless of how it is signed. Microsoft removed the automatic reputation
grant for EV certificates in 2024, so there is no certificate you can buy that
skips this.

If your organisation runs **WDAC** or **AppLocker**, do not depend on
reputation at all. Create a **publisher rule** instead. It is deterministic: it
matches on the signing identity rather than on any particular file, so it
survives every version bump, needs no waiting period, and covers every Whiteout
Windows binary — Desktop Guard, its ETW service, the desktop app and the
bundled installer — because all of them are signed under one identity.

Our signing subject is:

```
CN=Groovy Security, O=Groovy Security, L=St. George, S=Utah, C=US
```

> **Do not pin a certificate thumbprint.** We sign with Azure Artifact Signing,
> which rotates the leaf certificate roughly daily. A thumbprint rule works
> today and blocks every install by next week. Pin the publisher.
>
> One more gotcha: PowerShell renders the state as `S=Utah` while some .NET
> APIs emit `ST=Utah`. If you are hand-writing a rule, generate it from a
> signed binary instead of typing the DN.

**AppLocker** — generate the rule from a signed file so the publisher string is
exactly right, then widen it to all versions:

```powershell
Get-AppLockerFileInformation -Path "C:\Path\To\Whiteout.DesktopGuard.exe" |
  New-AppLockerPolicy -RuleType Publisher -User Everyone -Optimize |
  Set-AppLockerPolicy -Merge
```

Then edit the resulting rule so the version range is `*` to `*` and the product
and file names are `*`. That single rule then covers current and future
releases of all four binaries.

**WDAC** — a publisher-level rule does the same thing:

```powershell
$rules = New-CIPolicyRule -Level Publisher `
  -DriverFilePath "C:\Path\To\Whiteout.DesktopGuard.exe"
```

Use `-Level Publisher`, not `-Level SignedVersion` or `-Level Hash`. The first
is version-independent; the other two pin to a build and break on the next
update.

**If you do not run application control**, deploying through your MDM already
avoids most of this — files delivered by MDM do not carry the Mark of the Web
that triggers SmartScreen on a manual download. Reputation then builds on its
own over the first weeks.

### Upload it

The downloaded file carries its own instructions in a header comment — which
console screen it goes to, and how to scope it. Follow those; they differ per
platform.

> **Browser coverage is a separate upload, and its absence is silent.** The
> bundle contains browser force-install and private-browsing profiles alongside
> the main one. If you upload only the main profile, Desktop Guard installs and
> signs in correctly, the dashboard looks healthy, and the browser extension
> never installs. Upload every profile in the bundle, scoped to the same
> devices.

---

## Step 6 — Verify coverage

Give your MDM time to push the profile — minutes to hours depending on platform
and check-in interval — then open **Enrollment**.

Each pilot user should show coverage across the surfaces you deployed: Desktop
Guard, browser extension, IDE extensions. The page refreshes on its own.

Coverage distinguishes four states per surface, which is worth understanding
before you read it:

| State | Meaning |
|---|---|
| **Live** | Enrolled and currently running |
| **Offline** | Enrolled, not running right now. A closed laptop looks like this and is fine |
| **Coverage gap** | The person is active on another surface while this one is dark — worth investigating |
| **Not enrolled** | Never enrolled, or signed out |

A laptop asleep overnight showing **Offline** is expected. **Coverage gap** is
the state that means something.

### What to check by the end of day one

- Every pilot user appears under **Enrollment** with at least Desktop Guard live.
- **Managed Devices** shows each pilot device mapped to the right person.
- A test prompt from a governed device appears under **Prompt Review**.

That last one is the real proof. Everything before it shows the plumbing is
connected; a prompt arriving shows governance is actually running.

---

## Troubleshooting

**Sign-in fails with a redirect or reply-URL error.** The redirect URI
registered with your identity provider must match your Whiteout API host
exactly — scheme, host, and path, with no trailing slash. Your provider's guide
gives the exact value. Providers do not normalise it, so compare it character
by character.

**Sign-in works but the Users tab is empty.** Almost always the directory
permissions from step 2 rather than anything about sign-in — a credential can
authenticate perfectly and still be unable to enumerate. **Configure →
Settings → Test connection** names the specific permission or scope missing.

**A device shows in your MDM but not in Whiteout.** Run a device sync. If it
still does not appear, the device may not be enrolled in the MDM in the way the
API reports — the platform's own guide covers this.

**Devices enrolled but a user shows Not enrolled.** Check that the browser and
IDE profiles were uploaded, not just the main one. See the callout in step 5.

**Windows devices never enroll.** Check Desktop Guard's version against the
minimum the dry-run named, and confirm the device is directory-joined rather
than only registered. The Intune guide covers the distinction.

---

## After the pilot

Broadening from a pilot to the whole organisation is the same steps at a larger
scale, with one change of tool: once you intend to govern everyone, **Sync entire
directory** becomes the right control, because keeping Whiteout's user list in step
with your directory — including removals — is what you want in steady state.

For devices, the pattern is the reverse: keep scoping each generation to the
devices that do not yet have a credential. There is no point at which
generating across the whole integration becomes the right move, because by then
most devices already hold one.

A common shape is to generate for the whole directory once, with **Never
expires**, so every employee has a credential waiting — and then let IT roll
out to groups on their own schedule without coming back to Whiteout at all.
