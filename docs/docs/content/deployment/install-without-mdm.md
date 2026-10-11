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
| **Automatic (recommended)** | When an MDM is connected, IT installs Whiteout. When none is connected, people install it themselves |
| **IT installs it** | Invitation and reminder emails tell people to contact IT |
| **Users install it themselves** | Invitation and reminder emails include install links and sign-in steps |

Choose **Users install it themselves**, or leave **Automatic (recommended)** if
you have no MDM connected.

The setting decides what people are told in:

- the invitation email
- the **Finish setting up Whiteout AI** reminder email
- the re-activation email
- the **You're all set!** page people see after they create their account

Set it before you invite anyone, so the first email says the right thing.

---

## Step 2: Get the installers

**Coverage → Enrollment → Install** lists the current installers. Each one has
a **Download** button and a **Copy link** button.

| Card | What's in it |
|------|--------------|
| **Desktop Guard** | macOS (`.dmg`), Windows (`.exe`), Windows (`.msi`) |
| **Whiteout AI desktop app** | macOS (`.dmg`), Windows (`.exe`), Windows (`.msi`) |
| **Browser and IDE extensions** | Store links: Chrome Web Store, Microsoft Edge Add-ons, Firefox Add-ons, VS Code Marketplace, Open VSX (for Cursor and Windsurf), JetBrains Marketplace |

> **The links are for your organization.** Share them internally, on your
> intranet or in an email to the people you're onboarding. Don't post them
> publicly.

### What each person needs

| Client | Who needs it |
|--------|--------------|
| **Desktop Guard** | Everyone. It covers the desktop AI apps, installs the coding-agent hooks, and signs the other clients in |
| **Browser extension** | Everyone, in every browser they use for work |
| **VS Code or JetBrains extension** | Developers, in the editors they use |
| **Whiteout AI desktop app** | Admins, who use it for the admin console. Other people only need it if they use Whiteout's own **Chat** |

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

### Then put them in a group

People you invite aren't in any group, and a person's group decides which
policies apply to them. Once they have created their account:

1. Go to **Governance → Groups** and open the group they belong in.
2. Under **All Users**, tick them and click **Add to Group**.

Someone who isn't in a group sees *"Whiteout: No policy group assigned to your
account. Contact your admin."* in VS Code.

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
3. Open it from **Applications**. It runs in the menu bar, with no Dock icon.
4. Click the Whiteout icon in the menu bar and choose **Sign In…**.
   - **With SSO**, it takes you to your identity provider.
   - **Without SSO**, it opens Desktop Guard's Control Panel. Enter your email
     address and password.
5. Approve the macOS permissions as they come up (see below).

#### macOS permissions

macOS asks for these one at a time, not all at once during setup:

| Permission | When macOS asks | What it's for | If it's not allowed |
|------------|-----------------|---------------|---------------------|
| **Notifications** | The first time Desktop Guard starts | Desktop Guard's alerts, such as a blocked message or an expired sign-in | Desktop Guard still works; people just don't see its alerts |
| **Accessibility** | The first time Desktop Guard checks a message being sent in a desktop AI app | Reading what's about to be sent so it can be checked | Desktop Guard can't check messages in desktop AI apps. Turn it on under **System Settings → Privacy & Security → Accessibility → Whiteout Interceptor** |
| **Network extension** | After sign-in, as a notification: **Whiteout: Approval Required** | AI traffic monitoring | The notification says what to do: *"Open System Settings › Privacy & Security › Network Extensions and allow Whiteout Interceptor."* Without it, AI traffic monitoring is off; Desktop Guard's other protections are unaffected |
| **Login items** | Only if macOS asks for approval | Starting Desktop Guard when the person logs in | Turn it on under **System Settings → General → Login Items** |

> **Accessibility is the one that matters.** Without it, Desktop Guard can't
> check what people send from desktop AI apps such as ChatGPT or Claude.

### Desktop Guard on Windows

1. Download the Desktop Guard **Setup** `.exe` and run it. It installs for the
   signed-in Windows user only, so it doesn't need administrator rights. (The
   `.msi` installs the same way, for software-distribution tools; see
   [Windows MSI](./deployment/windows-msi.md).)
2. If Windows shows **Windows protected your PC**, click **More info**, then
   **Run anyway**. See [the note on SmartScreen](#windows-protected-your-pc)
   below.
3. Desktop Guard starts in the system tray. If you can't see it, it may be
   under the **^** overflow arrow.
4. Right-click the Whiteout icon in the system tray and choose **Sign In…**.
   - **With SSO**, it takes you to your identity provider.
   - **Without SSO**, it opens Desktop Guard's Control Panel. Enter your email
     address and password.

After sign-in, Desktop Guard may ask to turn on its **Whiteout AI Sensor**,
which sees which AI services apps on the computer connect to (connection
details only, never content). Clicking **Yes** makes Windows ask for
administrator permission once. People without administrator rights can click
**No**.

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
   - **Otherwise**, click the Whiteout icon in the toolbar, enter your email
     address and password and click **Log in**. With SSO, use the sign-in
     button for your identity provider instead.

> **Add it to every browser people use for work.** Desktop Guard doesn't
> install the browser extension; only an MDM can force-install it. Each
> browser, and each browser profile, needs the extension added once. When a
> browser is in use without it, **Coverage → Enrollment** flags the person as
> **Browser without Whiteout**.

If someone clicks **Deny** on the Desktop Guard prompt, Desktop Guard remembers
that too. They can still sign in from the extension's toolbar icon.

### VS Code, Cursor and Windsurf

1. Install **Whiteout AI - IDE Governance**: from the VS Code Marketplace for
   VS Code, or from Open VSX for Cursor and Windsurf. The **Install** tab has
   both links.
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

### Coding agents: Claude Code, Codex, Cursor and others

There's nothing separate to install. Once Desktop Guard is signed in, it
installs Whiteout's defender hooks for **Claude Code**, **Codex**, **Cursor**
and **Antigravity**, and puts them back if they're removed or changed. That
covers these agents wherever they run, including from a terminal or a
JetBrains IDE.

If someone uses VS Code but not Desktop Guard, the VS Code extension installs
the Claude Code and Codex hooks itself once they're signed in and in a group,
but its Claude Code hooks only cover the project open in VS Code. For Cursor,
they run **Whiteout: Install Cursor Defender Hooks**. Installing Desktop Guard
is the simpler route.

### Whiteout AI desktop app

On macOS, open the `.dmg` and drag the app into **Applications**. On Windows,
run the Setup `.exe` (the same SmartScreen note applies). Sign in with your
email address and password and click **Sign in**, or with your identity
provider's button if you use SSO.

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

**The invitation email never arrived, or has expired.** Check the address under
**Governance → Groups → Users**, tick the person and click
**Re-invite Selected**.

**The browser extension or IDE extension doesn't sign in on its own.** Desktop
Guard has to be signed in first. If it is, the person may have clicked **Deny**
on the **Allow Whiteout client to sign in?** prompt. Either way, they can sign
in directly in the extension.

**VS Code says no policy group is assigned.** Add the person to a group: see
[Then put them in a group](#then-put-them-in-a-group).

**On a Mac, nothing is checked in the ChatGPT or Claude desktop app.** Desktop
Guard doesn't have Accessibility access. Turn on **Whiteout Interceptor** under
**System Settings → Privacy & Security → Accessibility**.

**Windows won't run the installer.** See
["Windows protected your PC"](#windows-protected-your-pc). If your organization
blocks unknown apps outright, ask IT to allowlist the publisher.
