# Onboarding Walkthrough

Getting from a new Whiteout AI tenant to a governed pilot group, end to end.

Follow this page in order. It works whether or not you have single sign-on
(SSO) and whether or not you have a device management (MDM) platform. Where
your setup matters, the step says so and points you to the right guide.
Everything else is the same whatever you run.

**Roughly an hour**, most of it waiting for your MDM to push a profile. Without
an MDM, most of it is waiting for people to install and sign in.

---

## What you need before you start

| | |
|---|---|
| **Your Whiteout tenant** | Provisioned by Groovy Security. You get a setup email for the first admin account and, sent to you privately, the installer for the Whiteout AI desktop app |
| **Identity provider admin** *(optional)* | Only if you're connecting SSO. Enough rights to register an application and grant admin consent |
| **MDM admin** *(optional)* | Only if you're deploying through an MDM. Enough rights to create an API credential, upload an app and assign a configuration profile |
| **A pilot list** | The people you want governed first. Start small: a handful, not the whole company |

You do **not** need to deploy anything to every device to begin. The whole
point of the steps below is that you choose exactly who is covered.

---

## The shape of it

```
  1. Claim the admin account     first admin, set a password
        ↓
  2. Connect your IdP            optional  ← pick your provider
        ↓
  3. Add your pilot users        from your directory, or invite by email
        ↓
  4. Connect your MDM            optional  ← pick your platform
        ↓
  5. Generate credentials        MDM only: Whiteout mints, your MDM distributes
        ↓
  6. Verify coverage             confirm each person is actually protected
```

### Which steps apply to you

| | **With an MDM** | **Without an MDM** |
|---|---|---|
| **With SSO** | Every step, 1 to 6 | Steps 1 to 3, then [Installing Without MDM or SSO](./deployment/install-without-mdm.md), then step 6 |
| **Without SSO** | Step 1, step 3 (invite by email), then steps 4 to 6 | Step 1, step 3 (invite by email), then [Installing Without MDM or SSO](./deployment/install-without-mdm.md), then step 6 |

Steps 2 and 3 are separate on purpose. Connecting your directory lets people
*sign in*; onboarding decides who Whiteout *manages*. You can connect a
10,000-person directory and onboard twelve.

---

## Step 1: Claim the admin account

There is no initial password to be sent one. When Groovy Security provisions
your tenant, an administrator account is created with no password, and a
**one-time setup link** is emailed to the contact address you gave us. The
email's subject starts **Welcome to Whiteout AI — finish setting up**.

1. Find the setup email. The account is `admin@<your-domain>` unless you asked
   for something else.
2. Follow the link and set a password.
3. Install the Whiteout AI desktop app. Groovy Security sends you the installer
   directly; the admin console is part of that app.
4. Open the app and sign in with the admin email address and the password you
   just set.

If the admin address is a shared mailbox, make sure the people who will
administer Whiteout can read it. Password resets for this account go to that
address.

> **The setup link expires after 48 hours.** If provisioning and your first
> sign-in are a few days apart, expect it to have lapsed. Contact your Groovy
> Security contact for a new one.

> **Keep this account, even after SSO is connected.** If you connect SSO in
> step 2, your team will sign in through your identity provider, but this local
> admin is your way back in if that connection breaks: an expired client
> secret, revoked consent, a tenant migration. It exists precisely for the case
> where SSO is the thing that is broken, so do not delete it once SSO works.

---

## Step 2: Connect your identity provider (optional)

> **No SSO?** Skip to [step 3](#step-3-add-your-pilot-users) and invite people
> by email. Everyone can sign in to every Whiteout client with an email address
> and password instead. You can connect SSO later without starting again.

**Integrations → Identity Providers (SSO) → Add Provider**

Pick yours in the **Add Identity Provider** list and follow that guide, then
return here:

| | |
|---|---|
| [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md) | Azure AD. Most common alongside Intune |
| [Okta](./sso-providers/okta.md) | |
| [Google Workspace](./sso-providers/google-workspace.md) | |
| [OneLogin](./sso-providers/onelogin.md) | |
| [Ping Identity](./sso-providers/ping-identity.md) | PingOne |
| [JumpCloud](./sso-providers/jumpcloud.md) | |
| [Auth0](./sso-providers/auth0.md) | Sign-in only, see the note below |
| [Generic OIDC](./sso-providers/generic-oidc.md) | Sign-in only, see the note below |
| [Generic SAML](./sso-providers/generic-saml.md) | Listed as **Generic SAML (Beta)**. Sign-in only, see the note below |

### Two things that decide whether the rest of this works

**Directory sync is a separate permission from sign-in.** Every provider in the
first six rows can enumerate your directory, but only with admin-level API
credentials granted *in addition* to the sign-in ones. Granting only the
sign-in permissions produces a connection that logs users in perfectly and
syncs nobody. And because the steps below map devices to people by email
address, no users means no devices get governed either.

The provider list marks the last three rows **Sign-in only**. Those have no
directory to enumerate at all, so the directory part of step 3 does not apply
to them. Add people by SCIM or by invitation instead.

**Click Test Connection before you click Connect.** It does not just check that
the credentials authenticate; it reads your directory the way sync will. If it
reports a missing permission, fix that first. A green result here means sync
will work.

### Then confirm Whiteout can read your directory

Click **Configure** on the provider card and open the **Users** tab. Your
directory is listed there, read live from your provider. There is no import
step, and nothing is governed by looking at it.

If the list is populated, directory access is working and you can move on. If
it is empty or errors, that is the permissions problem described above, and
**Test connection** on the **Settings** tab will name what is missing.

### Checking a connection later

**Configure → Settings** on the provider card is where you go afterwards. It
shows JIT provisioning, group sync, default role, auto-sync and the last sync
time.

**Test connection** there re-checks the credentials *and* whether they can
still read your directory. The two fail differently, and a credential that
authenticates while having lost directory access is the one that produces a
sync returning nobody. If the test fails it names the specific permission or
scope to fix.

A provider with no directory at all shows a **sign-in only** notice here, and
its group-sync settings read **Unavailable — no directory** rather than On or
Off, because those settings cannot do anything for it.

---

## Step 3: Add your pilot users

This is the step that keeps a pilot a pilot. How you do it depends on whether
you connected SSO in step 2.

### With SSO: onboard people from your directory

1. On the connected provider card, click **Configure**.
2. You land on the **Users** tab: your whole directory, read live from your
   provider. Anyone already onboarded shows **In Whiteout**; everyone else
   shows **Not onboarded**. The buttons along the top split the list into
   **All**, **Not onboarded** and **Onboarded**, and there is a search box for
   name or email.
3. Tick the people in your pilot group.
4. Click **Onboard *n* selected**.

Only those people become Whiteout users. Everyone else stays in your directory,
able to sign in later, and is not governed until you say so.

They join your **group for new users** (set at the top of **Governance →
Groups**) unless one of your identity-provider group mappings puts them in a
different group. The same goes for everyone who arrives later by auto-sync,
SCIM or their first single sign-on, so nobody is signed in without policies.

> **Do not use "Sync entire directory" for a pilot.** It provisions your whole
> directory *and removes any Whiteout user who is no longer in it*. That is the
> right tool for steady-state operation once you are rolling out broadly; it is
> the wrong one when you have deliberately onboarded twelve people out of
> ten thousand.

#### Adding someone later

Repeat the same four steps. Selective onboarding is additive. It never removes
anyone, so you can grow the pilot a person at a time.

#### Or let auto-sync do it

Most organisations want everyone in their directory governed eventually, and
for them the manual step above is only for the first group. Whiteout syncs your
directory on a schedule (**Configure → Settings → Auto-sync**, which reads
**Every 24h** by default), so new hires appear without anyone remembering to
click anything, and people who leave your directory are deprovisioned.

That is usually what you want. It is worth understanding one thing about it
though:

> **Auto-sync provisions your whole directory, not just your selection.** It
> runs the same operation as **Sync entire directory**. If you have
> deliberately onboarded twelve people out of ten thousand, the next scheduled
> run will onboard the other nine thousand nine hundred and eighty-eight.
>
> The control is **JIT provisioning** on the Settings tab, which also gates the
> scheduler despite its name. To keep a pilot limited to the people you chose,
> turn it off, and turn it back on when you are ready for everyone.
>
> Group sync has the same effect, because group membership needs the user rows
> to exist first.

So there are two working models, and they are both legitimate:

| | |
|---|---|
| **Everyone, kept current** | Leave auto-sync on. Your whole directory is governed and stays in step, new hires included. This is the common case |
| **A chosen subset** | Turn JIT provisioning and group sync off, and onboard people deliberately. Nothing arrives that you did not pick |

Pilots usually start in the second and move to the first.

### Without SSO: invite people by email

1. Go to **Governance → Groups** and open the **Users** tab.
2. Click **Invite Single** and enter the person's email address. For a list,
   click **Bulk Invite (CSV)** and choose the file instead.
3. Choose their **Group**. It starts on your group for new users; pick another
   group, or **No group** if you'll place them yourself. Click **Send invite**
   (or **Send *n* invites**).
4. Each person gets an email, **You're invited to join Whiteout AI**, inviting
   them to join your organization, with a **Complete Setup** button. It opens
   a page where they choose a password (at least 12 characters) and click
   **Create account**.

From then on they sign in to every Whiteout client with that email address and
password. In the user list, each person shows **invited** until they finish and
**registered** after. An invitation is valid for 7 days; if it lapses the
person shows **expired**. Tick them and click **Re-invite Selected**: they get
the same link again, working for another 7 days.

Invite people at their work address, on your organization's domain: Desktop
Guard finds a person's organization from the domain of the address they sign
in with.

**Which group they join.** A person's group decides which policies apply to
them. People join the group you chose when you invited them as soon as they
create their account, so protection starts from their first sign-in. To change
it before they accept, click their email address in the **Users** list, pick a
**Group** and click **Save Changes**, or open a group and use **Add to Group**.
Their existing invite then joins that group; they don't get a second email.

Everyone who joins any other way (single sign-on, directory sync or SCIM) lands
in your **group for new users**, set at the top of **Governance → Groups**,
unless an identity-provider group mapping puts them somewhere else. If you set
it to **None — I'll assign people myself**, new people won't be in any group,
so no policies apply to them until you add them to one. The Groups page shows
how many people aren't in any group, with a **Show them** link.

> **Invite people at the address your MDM knows them by.** If you are using an
> MDM, step 4 matches devices to people by email address. Without an identity
> provider there are no alias addresses to fall back on, so the address you
> invite must be the one your MDM reports for that person. A person becomes a
> Whiteout user when they finish **Create account**, not when you invite them,
> so their devices only map to them after that.

### What the emails tell people about installing

Invitation, reminder and re-activation emails, and the **You're all set!**
page people see after creating their account, follow one setting:
**Coverage → Enrollment → Settings → How Whiteout gets installed**.

| Option | What people are told |
|---|---|
| **Automatic (recommended)** | As **IT installs it** when an MDM integration is switched on and has synced at least once; otherwise as **Users install it themselves**. The option shows which applies right now |
| **IT installs it** | That your IT team installs Whiteout, and to contact them if it isn't installed yet. Use this when you deploy everything yourselves, through an MDM or otherwise |
| **Users install it themselves** | Install links for each client, and how to sign in: with your company account if you have SSO, otherwise with their email address and the password they set |

Set it before you invite anyone, so the first email says the right thing. The
**Coverage → Enrollment → Install** tab also shows the current choice, with a
**Change in Settings** button.

On a self-hosted deployment, these emails also tell people how to connect
their Whiteout apps to your server, with a link to your server's setup page.
See [Pointing Apps at Your Server](./deployment/pointing-apps-at-your-server.md).

---

## Step 4: Connect your device management platform (optional)

> **No MDM?** People install Whiteout themselves. Skip steps 4 and 5, follow
> [Installing Without MDM or SSO](./deployment/install-without-mdm.md), then
> come back for [step 6](#step-6-verify-coverage).

**Integrations → Mobile Device Management (MDM) → Connect MDM**

(Once one MDM is connected, the button reads **Add Another MDM**.)

| | |
|---|---|
| [Microsoft Intune](./mdm-providers/microsoft-intune.md) | Windows, macOS, iOS, Android |
| [Jamf Pro](./mdm-providers/jamf.md) | Apple only |
| [NinjaOne](./mdm-providers/ninjaone.md) | Windows and macOS. An RMM: deploys by script, not profile |
| [Kandji](./mdm-providers/kandji.md) | Apple only |
| [Mosyle](./mdm-providers/mosyle.md) | Apple only |
| [VMware Workspace ONE](./mdm-providers/vmware-workspace-one.md) | Apple devices; see the Windows note in that guide |

Clicking **Connect** in the form runs a live connection test before saving, so
a wrong credential is caught here rather than at the first sync.

Once connected, click **Sync Now** (the sync icon) on the integration row and
confirm your devices appear under **Coverage → Managed Devices**.

### Check that devices found their people

Whiteout maps each managed device to a person by email address. Under
**Coverage → Managed Devices**, confirm the pilot devices show the right user.

A device with no user cannot be governed, because there is nobody to attribute
its activity to. The usual causes:

- The person isn't a Whiteout user yet. Onboard them (step 3), or, without
  SSO, check they have finished their invitation.
- The device's account address differs from the person's address in Whiteout.
  Entra and Okta publish alias lists that Whiteout uses automatically; Google,
  JumpCloud, OneLogin and PingOne publish fewer, so an unusual address may need
  correcting at the source. Without SSO there are no aliases at all.
- The MDM has no user assigned to that device at all.

---

## Step 5: Generate credentials and hand them to your MDM

This step is for MDM deployments only.

### Dry-run first

Before generating anything, dry-run a few representative devices, including
one of each operating system you are deploying to. It walks the full chain and
tells you exactly which link is broken, rather than leaving you to infer it
from a device that never checks in.

The dry run is an API call; there is no button for it in the admin app. See
the [Pre-Deployment Checklist](./deployment/zero-touch-mdm.md#pre-deployment-checklist)
for the request and the [dry-run failures](./deployment/zero-touch-mdm.md#dry-run-failures)
table for what each step means.

Every step should pass. Read the `enroll_anchor_compatible` step carefully on
Windows: it names the minimum Desktop Guard version and whether the device is
joined to your directory in the way enrollment requires.

### Who decides what gets installed

**Your MDM does.** Whiteout never installs software and never pushes anything
to a device. Your IT team deploys Desktop Guard through your MDM's own app
deployment and scopes it however they normally scope software.

Get the Desktop Guard installer for your MDM from **Coverage → Enrollment →
Install** in the admin app: a `.dmg` for macOS (Apple silicon), and a `.exe` or
`.msi` for Windows. On Windows, also deploy the per-machine **Desktop Guard
sensor service** `.msi` from the same tab, in SYSTEM context; see
[Windows MSI](./deployment/windows-msi.md#the-desktop-guard-sensor-service).
The same tab has the store links for the browser and IDE extensions.

While you are there, set **Coverage → Enrollment → Settings → How Whiteout gets
installed** to **Automatic (recommended)** or **IT installs it**, so invitation
and reminder emails tell people that IT is installing it rather than sending
them install links.

What Whiteout produces is the *credential* that lets those devices sign
themselves in: one per device, bound to that device's hardware identifier so
it is worthless anywhere else. That binding is why there is no single shared
connection string to paste: each device needs its own, and the payload below
carries one entry per device.

So the selection you make here is not "who gets Whiteout". It is "who has a
credential waiting". Distribution stays entirely yours.

### Generate the payload

**Integrations → Mobile Device Management (MDM)**, then the download icon
(**Generate Deployment Payload**) on your integration row. NinjaOne has its own
deployment dialog instead; follow the [NinjaOne guide](./mdm-providers/ninjaone.md).

The dialog opens on **Deploy to all *n* eligible devices**. For a first
generation that is usually what you want: mint for the whole directory, then
let your rollout happen at whatever pace suits you. To narrow it, click
**Choose specific devices** and filter by name or address.

### Set the credential lifetime deliberately

**Credential lifetime** defaults to **30 days — deploying now**. The other
choices are **90 days — deploying over this quarter** and **Never expires —
rollout timing not yet decided**. If you are generating for the whole
organisation ahead of a rollout that runs over months, choose **Never
expires**.

This is worth getting right: an expired credential produces a profile that
installs cleanly and silently signs nobody in. There is no error; the device
simply never appears as enrolled.

Two things the device list tells you:

- **Already deployed** marks a device that still holds a live credential from
  an earlier run. Including it again asks you to confirm replacement first, and
  replacement only ever affects the devices you selected, never the rest of
  the fleet.
- **Greyed-out devices cannot be selected**, and each says why underneath. The
  usual reasons are no hardware identifier from the MDM, no mapped person, or a
  hardware identifier shared with another device: a cloned image deployed
  without sysprep, where either machine could redeem the other's credential.

If someone in your pilot is missing from the list, they will be in it greyed
out with the reason. That is the answer to "why isn't Dana here?".

Click **Generate & Download** when the selection is right.

### Adding devices later

New hires and replacement laptops are the normal case, and there is one trap.

When you generate again, **select just the new devices**. Whiteout then issues
credentials for those alone and leaves every existing one untouched.

If you instead generate across the whole integration, it will refuse: the
devices from your first run already hold live credentials. The only way past
that refusal is to reissue for everything, which revokes the credential each
already-deployed device uses to recover a broken session. Nothing breaks
immediately, which is exactly what makes it easy to miss: those devices keep
working until one of them needs to recover and cannot.

Scope to the new devices and none of this arises.

### Windows only: allowlist the publisher first

**Do this before you deploy, not after a user reports a block.** It takes a few
minutes and removes a whole class of problem.

Windows decides whether to trust an unfamiliar binary partly on *reputation*:
how many machines have run it, for how long. A newly released build has none,
regardless of how it is signed. Microsoft removed the automatic reputation
grant for EV certificates in 2024, so there is no certificate you can buy that
skips this.

If your organisation runs **WDAC** or **AppLocker**, do not depend on
reputation at all. Create a **publisher rule** instead. It is deterministic: it
matches on the signing identity rather than on any particular file, so it
survives every version bump, needs no waiting period, and covers every Whiteout
Windows binary (Desktop Guard, its sensor service, the desktop app and the
bundled installer) because all of them are signed under one identity.

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

**AppLocker**: generate the rule from a signed file so the publisher string is
exactly right, then widen it to all versions:

```powershell
Get-AppLockerFileInformation -Path "C:\Path\To\Whiteout.DesktopGuard.exe" |
  New-AppLockerPolicy -RuleType Publisher -User Everyone -Optimize |
  Set-AppLockerPolicy -Merge
```

Then edit the resulting rule so the version range is `*` to `*` and the product
and file names are `*`. That single rule then covers current and future
releases of all four binaries.

**WDAC**: a publisher-level rule does the same thing:

```powershell
$rules = New-CIPolicyRule -Level Publisher `
  -DriverFilePath "C:\Path\To\Whiteout.DesktopGuard.exe"
```

Use `-Level Publisher`, not `-Level SignedVersion` or `-Level Hash`. The first
is version-independent; the other two pin to a build and break on the next
update.

**If you do not run application control**, deploying through your MDM already
avoids most of this: files delivered by MDM do not carry the Mark of the Web
that triggers SmartScreen on a manual download. Reputation then builds on its
own over the first weeks.

### Upload it

The downloaded file carries its own instructions in a header comment: which
console screen it goes to, and how to scope it. Follow those; they differ per
platform.

> **Browser coverage is a separate upload, and its absence is silent.** The
> bundle contains browser force-install and private-browsing profiles alongside
> the main one. If you upload only the main profile, Desktop Guard installs and
> signs in correctly, the dashboard looks healthy, and the browser extension
> never installs. Upload every profile in the bundle, scoped to the same
> devices.

---

## Step 6: Verify coverage

With an MDM, give it time to push the profile (minutes to hours depending on
platform and check-in interval). Without one, give people time to install and
sign in. Then open **Coverage → Enrollment**.

Each pilot user should show coverage across the surfaces you deployed: Desktop
Guard, browser extension, IDE extensions. The page refreshes on its own every
30 seconds.

Each surface shows one of these states, which is worth understanding before
you read the page:

| State | Meaning |
|---|---|
| **Live** | Enrolled and currently running |
| **Enrolled, not running** | Enrolled, not running right now. A closed laptop or a closed IDE looks like this and is fine |
| **Protection paused** | Desktop Guard is running with its protection paused. Worth investigating |
| **Not enrolled** | Never enrolled, or signed out |

Each person then gets an overall status:

| Status | Meaning |
|---|---|
| **Covered** | Every required surface is enrolled |
| **Missing Coverage** | A required surface is not enrolled |
| **Needs attention** | A real hole while they work: the row says **Protection paused**, or **Browser without Whiteout** for a browser in use with no extension in it |

Which surfaces count as required is set under **Coverage → Enrollment →
Settings → Coverage Requirements**. By default that is the browser extension
and Desktop Guard; the IDE extension is tracked but optional.

A laptop asleep overnight showing **Enrolled, not running** is expected.
**Needs attention** is the status that means something.

If someone is missing coverage because they have not installed or signed in
yet, the envelope icon on their row emails them a reminder (**Action Required:
Finish setting up Whiteout AI**). What it tells them follows the **How Whiteout
gets installed** setting from step 3.

### What to check by the end of day one

- Every pilot user appears under **Coverage → Enrollment** with at least
  Desktop Guard live.
- With an MDM: **Coverage → Managed Devices** shows each pilot device mapped to
  the right person.
- A test prompt from a governed device appears under **Governance → Prompt
  Review**.

That last one is the real proof. Everything before it shows the plumbing is
connected; a prompt arriving shows governance is actually running.

---

## Troubleshooting

**Sign-in fails with a redirect or reply-URL error.** The redirect URI
registered with your identity provider must match your Whiteout API host
exactly: scheme, host, and path, with no trailing slash. Your provider's guide
gives the exact value. Providers do not normalise it, so compare it character
by character.

**Sign-in works but the Users tab is empty.** Almost always the directory
permissions from step 2 rather than anything about sign-in: a credential can
authenticate perfectly and still be unable to enumerate. **Configure →
Settings → Test connection** names the specific permission or scope missing.

**An invited person never received the email, or the link has expired.** Check
the address in **Governance → Groups → Users**, then tick them and click
**Re-invite Selected**. They get the same link again, working for another 7
days.

**A device shows in your MDM but not in Whiteout.** Click **Sync Now** on the
integration row. If it still does not appear, the device may not be enrolled
in the MDM in the way the API reports; the platform's own guide covers this.

**Devices enrolled but a user shows Not enrolled.** Check that the browser and
IDE profiles were uploaded, not just the main one. See the callout in step 5.

**Windows devices never enroll.** Check Desktop Guard's version against the
minimum the dry run named, and confirm the device is directory-joined rather
than only registered. The Intune guide covers the distinction.

---

## After the pilot

Broadening from a pilot to the whole organisation is the same steps at a larger
scale, with one change of tool: once you intend to govern everyone, **Sync entire
directory** becomes the right control, because keeping Whiteout's user list in step
with your directory, including removals, is what you want in steady state.
Without SSO, keep inviting people by email; **Bulk Invite (CSV)** takes a list.

For devices, the pattern is the reverse: keep scoping each generation to the
devices that do not yet have a credential. There is no point at which
generating across the whole integration becomes the right move, because by then
most devices already hold one.

A common shape is to generate for the whole directory once, with **Never
expires**, so every employee has a credential waiting, and then let IT roll
out to groups on their own schedule without coming back to Whiteout at all.
