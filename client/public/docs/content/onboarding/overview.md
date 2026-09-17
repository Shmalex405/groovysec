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
  5. Deploy to chosen devices   only the devices you select
        ↓
  6. Verify coverage            confirm each person is actually protected
```

Steps 2 and 3 are separate on purpose. Connecting your directory lets people
*sign in*; onboarding decides who Whiteout *manages*. You can connect a
10,000-person directory and onboard twelve.

---

## Step 1 — First sign-in

1. Open the tenant URL Groovy sent you.
2. Sign in with the first admin credentials.
3. **Change the password immediately.** This account is created during
   provisioning and is the only way in until your identity provider is
   connected.
4. Go to **Profile** and set a recovery email if the admin address is a shared
   mailbox.

> **Keep this account.** After SSO is connected your team signs in through your
> identity provider, but this local admin remains your way back in if the IdP
> connection breaks — an expired client secret, a revoked consent, a tenant
> migration. Do not delete it.

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

### Then sync

Once connected, click **Sync Users** on the provider card. Confirm the user
count is what you expect. This pulls your directory into Whiteout so you can
choose from it — it does not yet govern anyone.

---

## Step 3 — Onboard only your pilot users

This is the step that keeps a pilot a pilot.

1. On the connected provider card, click **Configure**.
2. You land on the **Users** tab — your whole directory, with everyone not yet
   onboarded marked **Not onboarded**.
3. Tick the people in your pilot group. Filter or search to find them.
4. Click **Onboard *n* selected**.

Only those people become Whiteout users. Everyone else stays in your directory,
able to sign in later, and is not governed until you say so.

> **Do not use "Sync all users" for a pilot.** It provisions your entire
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

## Step 5 — Deploy to your chosen devices

### Dry-run first

Before generating anything, dry-run a few representative devices — including
one of each operating system you are deploying to. It walks the full chain and
tells you exactly which link is broken, rather than leaving you to infer it
from a device that never checks in.

Every step should pass. Read the `enroll_anchor_compatible` step carefully on
Windows: it names the minimum Desktop Guard version and whether the device is
joined to your directory in the way enrollment requires.

### Generate the deployment payload

**Integrations → MDM → the download icon on your integration row.**

The dialog opens on **Deploy to all *n* eligible devices**, which is what you
want for a full rollout. For a pilot, click **Choose specific devices** and
tick only the people in your group. Filter by name or address to find them.

Whiteout then issues enrollment credentials for exactly those machines. This
matters beyond tidiness: credentials issued for devices you are not deploying
to sit unredeemed, and every unredeemed credential is surface area you did not
need.

Two things the list tells you:

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

**Sign-in works but Sync Users returns nothing.** Almost always the directory
permissions from step 2 rather than anything about sign-in. Click **Test
Connection** — it names the specific permission that is missing.

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
scale, with one change of tool: once you intend to govern everyone, **Sync all
users** becomes the right control, because keeping Whiteout's user list in step
with your directory — including removals — is what you want in steady state.

Grow in stages. Each stage is a fresh pass through steps 3 and 5 with a larger
selection.
