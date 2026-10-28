# Installing Without MDM or SSO

You don't need a device management (MDM) platform or a single sign-on (SSO)
identity provider to run Whiteout AI. Without an MDM, people install the
Whiteout clients themselves from links you share. Without SSO, you create their
accounts by inviting them by email, and they sign in to every client with an
email address and password.

This page covers both, and any mix: SSO without an MDM, an MDM without SSO, or
neither. For the full onboarding sequence, see the
[Onboarding Walkthrough](./onboarding/overview.md).

---

## When to use this

| Situation | Why a manual install fits |
|-----------|---------------------------|
| **No MDM** | Nothing can push software to your computers, so people install Whiteout themselves |
| **Devices your MDM doesn't reach** | Contractors, personal computers, or a team managed separately |
| **A pilot before IT packages it** | A handful of people can install in minutes while IT prepares an MDM deployment |
| **No identity provider, or not connected yet** | Invite people by email. You can connect SSO later without starting again |

> **If you have an MDM, use it for the devices it manages.** An MDM deployment
> installs everything, signs people in with no prompts, and stops people
> removing the browser extension. See [Zero-Touch MDM](./deployment/zero-touch-mdm.md).
> Manual installs are for everything else.

---

## Step 1: Tell Whiteout people install it themselves

**Coverage → Enrollment → Settings → How Whiteout gets installed**

| Option | What happens |
|--------|--------------|
| **Automatic (recommended)** | IT installs it when an MDM integration is switched on and has synced at least once. Otherwise, users install it themselves. The option shows which of the two applies right now |
| **IT installs it** | Emails tell people to contact your IT team |
| **Users install it themselves** | Emails include install links and how to sign in |

Choose **Users install it themselves**, or leave **Automatic (recommended)** if
you have no MDM connected. Read-only admins can see the setting but can't
change it.

The setting decides what people are told about installing Whiteout in:

- the invitation email
- the **Finish setting up Whiteout AI** reminder email
- the re-activation email
- the **You're all set!** page people see after they create their account

When people install it themselves, these include the install links and one
line on signing in: *"When a Whiteout app asks you to sign in, sign in with
your email address and the password you set."* If you have SSO, it says to
sign in with their company account (SSO) instead.

Set it before you invite anyone, so the first email says the right thing.

---

## Step 2: Get the installers

**Coverage → Enrollment → Install** lists the current installers. The top of
the tab shows how Whiteout gets installed for your organization, with a
**Change in Settings** button.

Each installer has a **Download** button and a **Copy link** button. If one
is briefly unavailable, it says **Temporarily unavailable** and its buttons are
off; try again in a minute.

| Card | What's in it |
|------|--------------|
| **Desktop Guard** | macOS `.dmg`, Windows `.exe`, Windows `.msi` |
| **Desktop Guard sensor service** | Windows `.msi`, for MDM deployments only (see [Windows MSI](./deployment/windows-msi.md#the-desktop-guard-sensor-service)). Manual installs don't need it |
| **Whiteout AI** | The Whiteout AI desktop app: macOS `.dmg`, Windows `.exe`, Windows `.msi` |
| **All-in-one installer** | macOS `.dmg`: the Whiteout AI desktop app and Desktop Guard in one go |
| **Browser and IDE extensions** | **Open** and **Copy link** for each store: Chrome Web Store, Microsoft Edge Add-ons, Firefox Add-ons, Visual Studio Marketplace, Open VSX (Cursor, Windsurf), JetBrains Marketplace |

The macOS installers are for Apple silicon Macs only.

> **"These links are for your organization. Share them internally; please
> don't post them publicly."** Put them on your intranet or in an email to the
> people you're onboarding.

### What each person needs

| Client | Who needs it |
|--------|--------------|
| **Desktop Guard** | Everyone. It covers the desktop AI apps, installs the coding-agent hooks, and signs the other clients in |
| **Browser extension** | Everyone, in every browser they use for work |
| **VS Code or JetBrains extension** | Developers, in the editors they use. Cursor users too, for Cursor's coding-agent hooks |
| **Whiteout AI desktop app** | Admins, who use it for the admin console, and people who use Whiteout's own **Chat**. Re-activation emails also need it on the device |

By default, **Coverage → Enrollment** counts someone as covered when they have
Desktop Guard and the browser extension. You can change which clients are
required under **Coverage → Enrollment → Settings → Coverage Requirements**.

The **Install** tab has no Safari link. If you need Safari coverage, contact
Groovy Security.

---

## Step 3: Create accounts

### Without SSO: invite people by email

1. Go to **Governance → Groups** and open the **Users** tab.
2. Click **Invite Single**, enter the person's email address and click
   **Send Invite**. For a list, use **Bulk Invite (CSV)**.
3. The person gets an email, **You're invited to join Whiteout AI**, with a
   **Complete Setup** button. It opens a page where they choose a password (at
   least 12 characters), accept the terms and click **Create account**.

That email address and password are what they sign in with, in every Whiteout
client.

In the user list, each person shows **invited** until they finish and
**registered** after. An invitation is valid for 7 days. If it lapses, the
person shows **expired**; tick them and click **Re-invite Selected** to send a
fresh one.

> **Invite people at their work address, on your organization's domain.**
> Desktop Guard finds a person's organization from the domain of the email
> address they sign in with, and it has to match your organization's domain
> exactly.

### Then put them in a group

People you invite aren't in any group yet, and a person's group decides which
policies apply to them. Once they have created their account:

1. Go to **Governance → Groups** and open the group they belong in.
2. Under **All Users**, tick them and click **Add to Group**.

Someone who signs in before they're in a group sees that no policy group is
assigned yet. Protection starts automatically once you add them to a group;
they don't need to sign in again.

### With SSO

Onboard people from your directory, as in
[step 3 of the walkthrough](./onboarding/overview.md#with-sso-onboard-people-from-your-directory).
Wherever this page says to sign in with an email address and password, they
choose your identity provider instead. The clients offer it once they know the
person's email address.

---

## Step 4: Install and sign in

Install **Desktop Guard first**. Once it's signed in, the browser extension and
the IDE extensions can sign in through it, so people sign in once instead of
in every client.

### Desktop Guard on macOS

1. Download the `.dmg` and open it.
2. Drag **Whiteout Interceptor** into **Applications**. That's Desktop Guard's
   name on macOS, and it's the name System Settings shows.

   > **It has to be in Applications.** Running it from the disk image or from
   > Downloads stops it starting when the person logs in.

3. Open **Whiteout Interceptor** from **Applications**. It runs in the menu bar,
   with no Dock icon. macOS may show a **Background Items Added** notification;
   that's Desktop Guard setting itself to start at login.
4. Desktop Guard's Control Panel opens by itself at its sign-in form:
   1. Enter your work email address under **Email**. When you move to the
      next field, it shows **Checking for single sign-on…**.
   2. **With SSO**, click **Sign in with** *your provider*. To use a password
      instead, follow **or sign in with password**.
   3. **Without SSO**, enter your **Password** and click
      **Sign in & Enable Protection**.
5. Approve the macOS permissions as they come up (see below).

If the Control Panel isn't open, or you need to sign in again later, click the
Whiteout icon in the menu bar and choose **Sign In…**. It goes straight to
your identity provider when your organization has SSO, and to the Control
Panel's sign-in when it doesn't.

#### macOS permissions

macOS asks for these one at a time, not all at once during setup:

| Permission | When macOS asks | What it's for | If it's not allowed |
|------------|-----------------|---------------|---------------------|
| **Notifications** | When Desktop Guard starts | Desktop Guard's alerts, such as a blocked message or an expired sign-in | Desktop Guard still works; people just don't see its alerts |
| **Accessibility** | The first time Desktop Guard checks a message being sent in a desktop AI app | Reading what's about to be sent so it can be checked | Desktop Guard can't check messages in desktop AI apps |
| **Network extension** | After sign-in, as a notification: **Whiteout: Approval Required** | AI traffic monitoring | Follow the notification: *System Settings › Privacy & Security › Network Extensions*, and allow **Whiteout Interceptor**. Without it, AI traffic monitoring is off; Desktop Guard's other protections still work |

If macOS asks for **Input Monitoring** for Whiteout Interceptor, allow it.
Desktop Guard doesn't use Screen Recording, Automation or Full Disk Access.

> **Accessibility is the one that matters.** Without it, Desktop Guard can't
> check what people send from desktop AI apps such as ChatGPT or Claude. If
> it's turned on after Desktop Guard has signed in, quit and reopen Desktop
> Guard: click **Exit Whiteout Interceptor** in the Control Panel and open it
> again from **Applications**, or log out of the Mac and back in.
> To turn it on by hand: **System Settings → Privacy & Security →
> Accessibility → Whiteout Interceptor**.

### Desktop Guard on Windows

1. Download the Desktop Guard **Setup** `.exe` and run it. It installs for the
   signed-in Windows user only, so it doesn't ask for administrator rights.
   (The `.msi` is for software-distribution tools; see
   [Windows MSI](./deployment/windows-msi.md).)
2. If Windows shows **Windows protected your PC**, click **More info**, then
   **Run anyway**. See [the note on SmartScreen](#windows-protected-your-pc)
   below.
3. Leave **Launch Whiteout Desktop Guard** ticked at the end of setup. Desktop
   Guard starts in the system tray, showing **Not signed in**. If you can't see
   the icon, it may be under the **^** overflow arrow.
4. A few seconds later, Desktop Guard's Control Panel opens by itself at its
   sign-in:
   1. Enter your **Work email** and click **Continue**. It shows
      **Looking up your organization…**.
   2. **With SSO**, it shows **Signing in as** *your email*. Click
      **Sign in with** *your provider*, or **Sign in with a password instead**.
      **Use a different email** goes back a step.
   3. **Without SSO**, enter your **Password** and click
      **Sign in & Enable Protection**.

If the Control Panel isn't open, or you need to sign in again later,
right-click the Whiteout icon in the system tray and choose **Sign In…**.

#### The Whiteout AI Sensor prompt

Shortly after sign-in, people who can give administrator approval may see a
**Whiteout AI Sensor** prompt. It turns on Desktop Guard's AI sensor, which
sees which AI services apps on the computer connect to (connection details
only, never content). Clicking **Yes** makes Windows ask for administrator
permission once. It's optional, but where people are allowed to, recommend
**Yes**. If they click **No**, Desktop Guard asks again after 7 days. People
who can't give administrator approval aren't asked.

#### "Windows protected your PC"

Whiteout's Windows installers are signed by Groovy Security. Windows also
judges a download by its *reputation*: how many people have run that file.
Each new release starts with none, so Microsoft Defender SmartScreen can warn
about a manual download until reputation builds. **More info → Run anyway**
continues the install, and the publisher it shows is Groovy Security.

Installs delivered by an MDM don't get this warning. If your organization runs
application control (WDAC or AppLocker), allowlist the publisher instead; see
[Windows only: allowlist the publisher first](./onboarding/overview.md#windows-only-allowlist-the-publisher-first).

### Browser extension

1. Open the store link for your browser from the **Install** tab (Chrome Web
   Store, Microsoft Edge Add-ons or Firefox Add-ons) and add the extension.
2. Pin it, so the Whiteout icon stays in the toolbar.
3. Sign in:
   - **If Desktop Guard is signed in on the same computer**, the extension
     signs in through it. The first time, Desktop Guard asks
     **Allow Whiteout client to sign in?** Click **Allow** (on Windows,
     **Yes**). It asks once for the browser extension and remembers the answer.
   - **Otherwise**, click the Whiteout icon in the toolbar, enter your
     **Email** and **Password** and click **Log in**. With SSO, use the
     sign-in button for your identity provider instead.

> **Add it to every browser people use for work.** Without an MDM, nothing
> installs the browser extension for people: Desktop Guard doesn't. Each
> browser, and each browser profile, needs the extension added once. When a
> browser is in use without it, **Coverage → Enrollment** flags the person as
> **Browser without Whiteout**.

### VS Code, Cursor and Windsurf

1. Install **Whiteout AI - IDE Governance**: from the Visual Studio Marketplace
   for VS Code, or from Open VSX for Cursor and Windsurf. The **Install** tab
   has both links.
2. Sign in:
   - **If Desktop Guard is signed in**, the extension signs in through it. The
     first time, Desktop Guard asks **Allow Whiteout client to sign in?** for
     the IDE extension. Click **Allow** (on Windows, **Yes**).
   - **Otherwise**, open the Command Palette and run **Whiteout: Sign In**, or
     click **Whiteout** in the status bar. Enter your email address, then your
     password. With SSO, the extension offers your identity provider.
3. Check it with **Whiteout: Show Status**.

### JetBrains IDEs

IntelliJ IDEA, PyCharm, WebStorm, GoLand and the other JetBrains IDEs:

1. Open **Settings → Plugins → Marketplace**, search for
   **Whiteout AI - IDE Governance**, install it and restart the IDE. Or use the
   JetBrains Marketplace link on the **Install** tab.
2. Sign in:
   - **If Desktop Guard is signed in**, the plugin signs in through it, with
     the same one-time **Allow** prompt.
   - **Otherwise**, choose **Tools → Whiteout AI → Sign In** and enter your
     email address, then your password.

### Coding agents: Claude Code, Codex and Cursor

Once Desktop Guard is signed in, it installs Whiteout's defender hooks for
**Claude Code** and **Codex** by itself: straight away on macOS, and within
about 5 minutes on Windows. It also puts them back if they're removed or
changed. That covers these agents wherever they run, including from a terminal
or a JetBrains IDE. Codex needs one more step before it runs Whiteout's hooks;
see [Protecting Codex](./deployment/codex.md).

For **Cursor**, install the Whiteout extension in Cursor (from Open VSX, as
above) and run **Whiteout: Install Cursor Defender Hooks** from the Command
Palette.

### Whiteout AI desktop app

On macOS, open the `.dmg` and drag the app into **Applications**. On Windows,
run the Setup `.exe` (the same SmartScreen note applies). Sign in with your
email address and password and click **Sign in**, or with your identity
provider's button if you use SSO. On a Mac, the **All-in-one installer**
installs the desktop app and Desktop Guard together.

---

## What you give up without an MDM

| | With an MDM | Without an MDM |
|---|-------------|----------------|
| **Installing** | IT pushes Desktop Guard and force-installs the browser extension | Each person installs every client |
| **Signing in** | Silent: each device signs itself in with its own credential | Each person signs in once in Desktop Guard (or in each client), and approves the one-time **Allow** prompts |
| **Keeping it installed** | People can't remove a force-installed browser extension | People can quit or uninstall Desktop Guard and remove the extensions |
| **Browsers** | The extension is in every managed browser automatically | People must add it to each browser and profile they use |
| **Windows SmartScreen** | No warning for MDM-delivered installs | A warning on a manual download until reputation builds |
| **macOS approvals** | The network extension can be pre-approved through your MDM | People approve each macOS prompt themselves |

What you keep is the same governance: the same policies, the same Prompt
Review, the same audit trail. The difference is that coverage depends on
people installing and keeping the clients, so check it.

---

## Checking coverage

Open **Coverage → Enrollment**. Each person shows whether Desktop Guard, the
browser extension and the IDE extension are enrolled and running, and an
overall status:

| Status | Meaning |
|--------|---------|
| **Covered** | Everything required is enrolled |
| **Missing Coverage** | A required client isn't installed or signed in |
| **Needs attention** | Desktop Guard is running with its protection paused, or a browser is in use without the extension |

To nudge someone who hasn't finished, click the envelope icon on their row. It
emails them the **Finish setting up Whiteout AI** reminder, which follows your
**How Whiteout gets installed** setting. For what each state means, see
[Verify coverage](./onboarding/overview.md#step-6-verify-coverage) in the
walkthrough.

---

## Troubleshooting

### Sign-in messages

| Message | What to do |
|---------|------------|
| *"Incorrect email or password. If you were just invited, set your password from the invitation email first."* | Check the password. Someone who never clicked **Complete Setup** in the invitation has no password yet; re-invite them if the link has expired |
| *"Your Whiteout account has been deactivated. Contact your IT administrator."* | The account was deactivated in Whiteout. Reactivate it if that was a mistake |
| *"Your account isn't part of a Whiteout organization yet. Contact your IT administrator."* | The person isn't a Whiteout user. Invite them, or onboard them from your directory |
| *"Your organization's Whiteout workspace isn't active. Contact your IT administrator."* | Contact Groovy Security |
| *"Too many sign-in attempts. Wait a minute, then try again."* | Wait a minute, then try again |

### Other problems

**Desktop Guard can't find the organization.** The person is probably signing
in with an address on a different domain, such as a personal address or an
alias domain. They need their work email on your organization's domain.

**The invitation email never arrived, or has expired.** Check the address under
**Governance → Groups → Users**, tick the person and click
**Re-invite Selected**.

**The browser extension or IDE extension doesn't sign in on its own.** Desktop
Guard has to be signed in first. If it is, the person may have clicked **Deny**
on the **Allow Whiteout client to sign in?** prompt. Desktop Guard remembers
that, and it stays that way until an administrator edits
`~/.whiteout-desktop/approved-clients.json` on that computer. Meanwhile, the
person can sign in directly in the extension.

**Signed in, but no policy group assigned.** Add the person to a group: see
[Then put them in a group](#then-put-them-in-a-group). Protection starts
automatically once they're in one.

**On a Mac, nothing is checked in the ChatGPT or Claude desktop app.** Desktop
Guard doesn't have Accessibility access. Turn on **Whiteout Interceptor** under
**System Settings → Privacy & Security → Accessibility**, then quit and reopen
Desktop Guard.

**Windows won't run the installer.** See
["Windows protected your PC"](#windows-protected-your-pc). If your organization
blocks unknown apps outright, ask IT to allowlist the publisher.
