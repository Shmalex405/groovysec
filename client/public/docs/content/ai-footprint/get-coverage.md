# Get Coverage

**Get coverage** is for an AI tool in AI Footprint that Whiteout doesn't cover yet. It does one of two things:

- **Ask Groovy Security to build it.** Groovy Security builds official support for the tool, and you're told as the build moves.
- **Set it up on this computer.** You set coverage up yourself, on your own computer, in a few guided minutes. Desktop Guard (or the browser extension, for a website) walks you through it.

Whichever you choose, Groovy Security is told, so it can build official support for the tool.

> **Until a tool is governed, its prompts aren't checked.** Requesting coverage, setting it up and **Observing** don't check, hold or record any prompt in the tool. Whiteout checks prompts in a tool with your policies only once it's **Governed**.

---

## Where to find it

| Where | What's there |
|---|---|
| **Coverage → AI Footprint → Inventory**, the **Coverage** column | **Get coverage** on an ungoverned tool that can be covered, or the tool's coverage state once it's requested. See [The Coverage column](./ai-footprint/get-coverage.md#the-coverage-column). |
| The tool's details, the **Coverage** section | **Get coverage**, each platform's state, the setup on a computer (with its proof), and **Full coverage from Groovy**: the official build. |
| **Controls → Coverage profiles** | Every coverage request in your organization, with its **Status**, **Official build**, **Last updated** and **Source** (**Captured here** when you set it up yourself, **Groovy** when Groovy Security builds it). **Details** shows more. |

Coverage is per platform: **Mac**, **Windows** and **Web**. When a tool's platforms are in different states, the chip shows the one that needs attention first, and hovering it lists each platform.

---

## The Coverage column

The **Coverage** column shows how Whiteout covers each tool. It also keeps the number of devices where no Whiteout control applies to the tool yet. Select the number to see which devices.

| State | What it means |
|---|---|
| **None** | Whiteout doesn't check prompts in this tool yet. |
| **Requested** | Coverage was requested. It's set up on a computer with Desktop Guard next. |
| **Setting up** | A setup is running on a computer with Desktop Guard, or in a browser for a website. |
| **Ready to start** | Set up and proven. An admin reviews what was found, then starts it. |
| **Observing** | Whiteout is checking that it can see sends. Nothing is checked or recorded yet; only counts leave each device. |
| **Needs recapture** | The app changed in an update, so it needs to be set up again. |
| **Sent to Groovy** | Groovy Security is building official support. The tool stays ungoverned until then. The tool's **Coverage** section says why, for example **You asked Groovy Security to build it**, **This kind of tool needs an official build**, or why a setup didn't pass. |
| **Governed · native** | Whiteout has built-in support for this tool, or Groovy Security released official support for it. Devices pick up official support as Desktop Guard updates. |
| **Native support** | Whiteout supports this tool, but some devices aren't protected yet. Install or update Desktop Guard or the browser extension on them. |

**Coming later:** the **Pilot** and **Governed · profile** stages, where prompts in a tool you set up yourself are checked with your policies, come with a later update.

---

## Which tools can get coverage

**Get coverage** shows on an ungoverned AI tool that has been seen on a device. When a tool can't get coverage, the **Coverage** column or the **Get coverage** dialog says why:

| What you see | Why | What to do |
|---|---|---|
| **Add to catalog first** | Coverage needs to know exactly which app the tool is. | Choose **Add to catalog first** and add it with its identifiers. See [Add to catalog](./ai-footprint/overview.md#add-to-catalog). Then choose **Get coverage**. |
| **Already covered by Whiteout** | Whiteout has built-in support for the tool, so there's nothing to set up. | If some devices still aren't protected, install or update Desktop Guard or the browser extension on them. |
| **Covered as a Custom AI App** | The tool is one of your Custom AI Apps. Its coverage is managed under Custom AI Apps. | See [Custom AI Apps](./custom-ai-apps/overview.md). |
| **This is part of Whiteout** | The tool is one of Whiteout's own components, so there's nothing to cover. | Nothing. |
| **Not an AI tool** | The tool isn't an AI tool, so Whiteout won't read what people type in it. Messaging, mail, meeting, terminal and password-manager apps, and ordinary browsers, are never covered. | Nothing. |
| **Add it from its AI Footprint row** | The tool is in your catalog, but coverage can't use its entry: it wasn't added from something Whiteout discovered, or its rule also matches another app. | Remove it under **Controls → Catalog**, then add it again from its row in AI Footprint, with a rule that names only this tool. |
| **Fix catalog entry** | The tool's catalog entry now matches more than the tool it was added from, so coverage is off for it. | Remove it under **Controls → Catalog**, then add it again from this tool's row in AI Footprint, with a rule that names only this tool. |
| **Not seen on any device right now** | The tool hasn't been seen on a device recently. | **Get coverage** works again once it's seen in use. |

**Set it up on this computer** works for desktop apps and AI websites. For other kinds of tools, such as CLIs, IDE extensions, local runtimes and MCP servers, it says **This kind of tool needs an official build from Groovy Security**, and **Ask Groovy Security to build it** is the option to use.

---

## Ask Groovy Security

1. Choose **Get coverage** on the tool.
2. Under **Where the tool is used**, pick the platform: **Mac**, **Windows** or **Web**. Each shows how many devices use the tool there.
3. Choose **Ask Groovy Security to build it**, then **Send to Groovy Security**.

There's no walkthrough, and nothing changes on any device. Then:

- The tool's coverage shows **Sent to Groovy**, with **You asked Groovy Security to build it**.
- The tool's **Coverage** section shows **Full coverage from Groovy**: the official build moves through **Queued**, **In build**, **Ships in DG** with the Desktop Guard version, and **Released**. A note from Groovy Security shows there as **From Groovy Security**.
- You're told as the official build moves, with the **AI tool coverage changed** notification in **Alerts & Audit → Notifications**.
- When the official build is released, the tool moves to **Governed · native** by itself, and you get the **AI tool now covered natively** notification. Devices pick it up as Desktop Guard updates.

The tool stays ungoverned until the official build is released.

### What Groovy Security receives

Every Get coverage request tells Groovy Security, whichever option you choose. Clicking **Get coverage** and choosing an option is your OK to send this notice. Groovy Security receives:

- which tool it is. For a tool you added to your catalog yourself, that's only the app's public signing identity (such as its bundle ID), not the name you gave it.
- the tool's version, the platform, and how many devices use it
- which option you chose, where the request stands, and the reason when it goes to Groovy
- the request's ID, so Groovy Security can update the official build

Groovy Security never receives who asked, or anything anyone types or sends in the tool. Groovy Security is told again when the request moves on, for example when a setup finishes or the tool is sent to Groovy.

---

## Set it up on this computer

### Before you start

| You need | |
|---|---|
| **The admin app** | 2.98.2 or later |
| **For a desktop app** | Desktop Guard 1.8.138 or later, on a Mac or a Windows PC that has the tool installed. Desktop Guard must be signed in as you: the same admin as the admin app. |
| **For a website** | The Whiteout browser extension 1.18.0 or later, signed in as you |
| **Your organization** | Setting it up on this computer must be turned on for your organization. If it isn't, the option is greyed out. Ask Groovy Security instead, or contact support@groovysec.com. |

Each platform is set up from that kind of computer. A Mac sets up the tool's Mac coverage, and a Windows PC sets up its Windows coverage. A website can be set up from either.

> **Open a new, empty chat in the tool first.** Whiteout's test needs a fresh conversation. A long existing conversation can't be checked, so the setup sends the tool to Groovy Security instead.

### Start the setup

1. Choose **Get coverage** on the tool, in Inventory or in its **Coverage** section.
2. Pick this computer's platform. The dialog marks it, for example **This computer is a Mac**.
3. Choose **Set it up on this computer**, then **Start on this computer**.

The admin app says **Opening Desktop Guard on this computer…**, and Desktop Guard's setup panel opens beside the tool. The admin app then waits with **Setting up the tool on this computer… finish in the Desktop Guard window.** You come back to it to review what Whiteout found before anything starts.

### The steps in Desktop Guard

The panel shows where you are (**Getting ready**, then **Step 1 of 6** to **Step 6 of 6**) and ticks each check as it passes. **I need help** gives a tip for the step you're on, and **Have Groovy set this up instead**. **Stop** is always there.

**Getting ready.** A checklist ticks itself: **Whiteout is up to date**, **Whiteout can see app windows**, and the tool is open. Desktop Guard brings the tool to the front, and reminds you to open a new, empty chat.

**On a Mac,** the first time, macOS may ask you to allow Desktop Guard under **Accessibility** and **Input Monitoring**. Choose **Open Settings**, turn on Desktop Guard in each, and the setup carries on by itself.

| Step | What you do | What Whiteout does |
|---|---|---|
| **1. The box** | Click inside the box where you type messages to the tool. | Outlines the box and asks **Is this the box?** Choose **Yes**, or **No** and click the box again. |
| **2. The test text** | Nothing. Don't touch the keyboard. | Types a test message in the box and reads it back. This test text is never sent to the tool. |
| **3. Send** | Press Enter, or click Send, as if you're sending it. | Stops it. Nothing is sent, and the text stays in the box. If it finds a likely Send button, it outlines it and asks **Is this the Send button?** |
| **4. The card** | Look at the tool's window and answer **Can you see it?** | Shows its warning card over the tool, with a **Setup test** badge: *This is how Whiteout's warning looks in the tool. Nothing was blocked; this is only a test.* |
| **5. The test message** | Choose **Send test**, then answer **Did the message show up in your chat?** | Sends one short message, *Whiteout setup check, please ignore*, only after you choose **Send test**, to check that your normal messages still go through. |
| **6. Attach (optional)** | Choose **Yes, show me** and click the button you use to attach files, or choose **No, skip**. | Opens the file picker, chooses its own sample file, checks that it appears in the box, then removes it. Asks **Did you see the file appear and then disappear?** |

- **Step 5 is needed.** If you choose **Don't send, ask Groovy Security**, or the message doesn't show up, the tool goes to Groovy Security.
- **Step 6 is optional.** Your own files stay where they are. Some apps upload a file as soon as it's attached; the sample file contains only the words *Whiteout setup sample*. If you skip it, the setup can still pass, with **Attaching files: skipped. Groovy Security will add it.**
- **A step that doesn't work** gets one more try. If it misses twice, the setup ends and the tool goes to Groovy Security: **We couldn't finish setting up the tool here, and that's OK.** The admin app says why.

When every check passes, the panel says **All set. Whiteout can cover the tool on this computer.** Choose **See what's being uploaded** to see exactly what goes to Whiteout, then **Finish**.

### Review and Start

Back in the admin app, **Review the tool's setup** shows:

- **What was found:** the box where you type, the send key, the Send button (or **not used**), and attach (or **skipped**).
- **Proof record:** each check, with what Desktop Guard measured, what Whiteout saw, and your answer. Five checks are needed: **Reads what's typed**, **Stops a send**, **Warning card shows**, **Normal messages still send** and **Settings are solid**. When you tested attach, **Attach is caught** makes six. The headline reads, for example, *Proof: 5 of 5 passed on* your device, with the tool's version and the time. The test message is not stored as a prompt log.
- **What was uploaded:** structure only. See [What's collected](./ai-footprint/get-coverage.md#whats-collected-and-what-isnt).
- **What happens next**, and **Pilot devices (optional)**: up to 10 devices that try the tool alongside this computer in the Pilot stage, which comes with a later update. The people who use the tool most are good picks.

Choose **Start**. The tool moves to **Observing** and is listed under **Controls → Coverage profiles**. In Observing, nothing in the tool is checked, held or recorded. Until the later Pilot and Governed · profile stages arrive, Whiteout doesn't check prompts in the tool.

Choose **Not now** to leave it as **Ready to start**. To start it later, choose **Review** in the tool's **Coverage** section.

Groovy Security has been told too, so it can build official support. When its official build is released, it replaces your setup automatically, and the tool moves to **Governed · native**.

### Websites

1. Choose **Get coverage** on the website, pick **Web**, then **Set it up on this computer** and **Start on this computer**.
2. The admin app says: *Open the site in your browser, click the Whiteout extension icon, and choose Set up coverage for this site.*
3. If the extension asks, allow Whiteout on the site: click the button again and choose **Allow**.
4. The same steps run in a Whiteout panel on the page. Choose **Finish** at the end, then review and **Start** in the admin app.

### Stop a setup

- **Stop** in Desktop Guard's panel (or the panel on the website) asks **Stop setting up the tool? Nothing has been uploaded.** Choose **Stop**. Nothing is uploaded, the tool is left as it was, and its coverage goes back to **Requested**, so you can start again.
- **Cancel setup** in the admin app works until Desktop Guard has picked the setup up. After that, stop it in Desktop Guard.
- A setup ends by itself after 10 minutes without any action, or 30 minutes in total.

---

## What's collected, and what isn't

When you choose **Finish**, the setup uploads only the structure of the tool's interface and the results of the checks:

- the kinds of items around the box where you type, such as a text box or a button, and how they're arranged
- ids and labels only when they're made of common interface words, such as "Send" or "Message"
- the app's identifiers (such as its bundle ID), its version, your operating system's version, and the send key

It never collects:

- what you or anyone types, or what's in the box
- chat titles or conversation text
- file names, other than Whiteout's own sample file
- window titles
- screenshots
- Whiteout's test text or test message

The results are stored with the request in Whiteout, for your admins to review. They aren't part of the notice Groovy Security receives.

During the setup, every send to the tool is held back, except the one test message you approve in step 5, and, if you test attach, the sample file in apps that upload it as soon as it's attached.

---

## Troubleshooting

Each message names the tool you're setting up. Here it's written as *the tool*.

### In the admin app

| Message | What to do |
|---|---|
| **Desktop Guard isn't running on this computer. Open Desktop Guard to continue: it runs the walkthrough beside the tool.** | Choose **Open Desktop Guard**, wait until it's running, then **Try again**. |
| **Desktop Guard on this computer is signed in as someone else (or to another Whiteout server). Sign in to Desktop Guard as you, then try again.** | Sign in to Desktop Guard as the admin who is using the admin app, then start again. |
| **Sign in to Desktop Guard first, then try again.** Or **Desktop Guard's sign-in has expired.** | Sign in to Desktop Guard, then try again. |
| **Setting it up on this computer isn't available right now. Ask Groovy Security instead.** | It isn't turned on for your organization, or it was turned off while the setup ran, which ends the setup. Choose **Ask Groovy Security to build it**. |
| **Setting it up here comes with the next Desktop Guard update.** (under a greyed-out **Set it up on this computer**) | It isn't turned on for your organization yet. Ask Groovy Security instead, or contact support@groovysec.com. |
| **This Desktop Guard can't run the setup yet. Update Desktop Guard, or ask Groovy Security to build it.** | Update Desktop Guard to 1.8.138 or later, then try again. |
| **This computer isn't a Mac. An admin on a Mac can set it up from there, or ask Groovy Security.** (or a Windows PC) | Set it up from that kind of computer, or ask Groovy Security. |
| **Desktop Guard already has a setup open. Finish or stop it there, then try again.** | Finish or stop the other setup in Desktop Guard first. |
| **Too many coverage requests just now. Wait a minute, then try again.** Or **Desktop Guard just started a setup. Wait a few seconds, then try again.** | Wait, then try again. |
| **This setup isn't valid any more. Start it again.** | The setup timed out, a newer one replaced it, or the request moved on. Choose **Start again**. |
| **The tool is blocked or quarantined, so it can't be set up. Ask Groovy Security instead.** | Choose **Ask Groovy Security to build it**. |
| **Desktop Guard can't set up the tool on this computer. Ask Groovy Security to build it instead.** | Desktop Guard never sets up some apps, such as Office, messaging apps, terminals and Whiteout itself. Ask Groovy Security instead. |

### In Desktop Guard or on the website

| Message | What to do |
|---|---|
| **Open a new, empty chat in the tool first. Whiteout's test needs a fresh conversation.** | Start a new chat in the tool. The setup carries on by itself. |
| **Please empty the box where you type in the tool. Whiteout never changes or sends what you typed.** | Clear the box, or open a new chat, then carry on. |
| **Whiteout needs the tool in front for this.** Or **Click back into the tool to continue.** | Click the tool's window, then **Try again**. |
| **Too many tries; wait a minute.** | Wait a minute, then try again. |
| **This setup isn't valid any more. Start it again from the admin app.** | Start it again from the tool's **Coverage** section in the admin app. |
| **Setting it up on this computer isn't available right now. Ask Groovy Security from the admin app.** | It isn't turned on for your organization any more. Ask Groovy Security from the admin app. |
| **Remove the attachment from the message box, then click Send test again.** (websites) | Remove the file from the box, then choose **Send test** again. |
| **The setup stopped because Desktop Guard stopped responding. Start it again from the admin app.** On a Mac: **The setup stopped because it got stuck.** | Start it again from the admin app. If it happens again, ask Groovy Security instead. |
| **Whiteout couldn't remove its test text; delete it before sending.** On a website: **Delete Whiteout's test text before sending.** | Delete Whiteout's test text from the box yourself before you send anything. |
| **The tool was closed, so the setup stopped.** (Mac) | Open the tool, then start again from the admin app. |
| **Whiteout needs your permission to work on this site. Click the button again and choose Allow.** (websites) | Click **Set up coverage for this site** again and choose **Allow**. |

### If the setup sends the tool to Groovy

**We couldn't finish setting up the tool here, and that's OK** is a normal outcome, not an error. Some apps need an official build. Groovy Security builds it, and you're told as it moves. The admin app shows why, for example:

- **The test message didn't appear in the chat.** This can happen when the chat wasn't new. Open a new, empty chat, then set it up again.
- **The test message wasn't sent, and it's needed to prove normal messages still go through.**
- **A step didn't work twice.**
- **The app's chat is a floating panel, which needs an official build.**
- **Whiteout couldn't find a reliable way to recognise the box where you type.**

To try again after a reason you can fix, such as a chat that wasn't new, choose **Get coverage** on the tool, then **Set it up on this computer**.

---

## Questions

**Does Get coverage change how prompts are judged?**
No. It changes which tools Whiteout can see prompts in, not how prompts are judged. Once a tool is governed, its prompts are checked with the same policies as your other AI tools. The setup's test messages are never judged and never stored as prompt logs. Prompts in your other AI tools are checked as usual while a setup runs.

**What if the app updates?**
If an update changes the app so your setup no longer fits it, its coverage shows **Needs recapture**: the app changed in an update, so it needs to be set up again. Choose **Set it up again** in the tool's **Coverage** section and follow the same steps. When Groovy Security's official build is released, it takes over, and no setup is needed.

**Can I stop a setup?**
Yes. Choose **Stop** in Desktop Guard's panel, or in the panel on the website. Nothing is uploaded, and the tool is left as it was. See [Stop a setup](./ai-footprint/get-coverage.md#stop-a-setup).

**Who runs the setup?**
Only the admin who chose **Set it up on this computer**, on their own computer, with Desktop Guard or the extension signed in as them. A setup never runs on anyone else's device.

---

## Who can do what

| Role | Can |
|---|---|
| Admin | Request coverage, set it up on their own computer, review it and start it |
| Read-only | See the **Coverage** column, each tool's **Coverage** section and **Controls → Coverage profiles**. Can't request coverage, set it up or start it. |

Every request, setup and **Start** is recorded in the admin audit log.

---

## Versions

| Feature | Version |
|---|---|
| The **Coverage** column, **Get coverage**, **Ask Groovy Security to build it**, the tool's **Coverage** section and **Controls → Coverage profiles** | Admin app 2.98.1 or later, with the platform update released alongside it. Until your deployment has that update, the app says **Coverage isn't available on this server yet.** |
| **Set it up on this computer**, the review and **Start** | Admin app 2.98.2 or later, with Desktop Guard 1.8.138 or later (macOS and Windows) for desktop apps, or browser extension 1.18.0 or later for websites, when it's turned on for your organization |
| **Pilot** and **Governed · profile** | A later update |
