# Folders in AI Tools

When someone drops or pastes a whole folder into an AI tool, Whiteout AI checks every file in it, one by one. Files that pass go to the AI tool. Files that break a policy are held back. The user sees one card for the whole folder, and administrators see one entry in Prompt Review.

> **Whiteout never blocks a folder because it can't check something.** A file Whiteout can't read, a file type it doesn't support yet, or a file past its limits still goes through, and it's marked as **not checked**. Only files that break a policy are held back.

This is part of Whiteout for every organization. There is nothing to turn on.

---

## Where this works

| Surface | How folders arrive | Minimum version |
|---|---|---|
| **Desktop AI apps** (Claude, ChatGPT, Codex, Copilot, Gemini and the other apps Desktop Guard covers) | Dragged onto the app, pasted (⌘V / Ctrl+V or right-click **Paste**), or picked in Whiteout's upload window | Desktop Guard 1.8.91 |
| **AI websites** (ChatGPT, Claude, Gemini and the other sites the browser extension covers) | Dragged onto the page | Browser extension 1.13.0 |

Choosing a folder in an AI app's own **Open Folder** window works normally. Desktop Guard lets the app open it and records that a folder was opened.

---

## What the user sees

1. A **Checking folder** card shows progress: *Checking Folder "Client Files" — 12 of 40 files…*
2. Then one of these:

| Result | What happens |
|---|---|
| **Every file passes** | Desktop apps: the folder is attached exactly as it was dropped. Websites: its files are attached. |
| **Some files break a policy** | The other files are attached. A card lists the files that were held back and why. |
| **Some files couldn't be checked** | They go through with the rest, and the card says how many weren't checked. |

If the user's group allows overrides, the card asks for a business reason. One reason covers every held-back file in the folder, and they're then attached. The reason is recorded with the folder's Prompt Review entry.

---

## What Whiteout checks

- **Every file**, including hidden files such as `.env`, `.npmrc` and anything under `.aws`. These are often exactly what should be checked.
- **The file names themselves.** A list of the folder's file names is checked as one item, because a name can reveal sensitive information on its own. A flagged name is shown in Prompt Review; it does not hold files back.
- **The riskiest files first.** Documents and spreadsheets come first, then keys, configuration and code, then images (whose text is read). If a folder is larger than Whiteout checks at once, the files left unchecked are the least likely to be sensitive.

### What isn't checked

| Item | What happens |
|---|---|
| **Dependency and version-control folders** (`node_modules`, `.git`, `.venv`, `__pycache__` and similar) | Not checked and not attached. They hold downloaded packages or file history, not your content. |
| **Links that point outside the folder** | Not followed. |
| **Cloud files that aren't downloaded** (iCloud, OneDrive "online-only") | Not downloaded just to check them. They go through, marked not checked. |
| **Files over 50 MB** | Go through, marked not checked. |
| **Files past the limit** (200 files on a website, 2,000 files or 1 GB in a desktop app) | Go through, marked not checked. |
| **File types Whiteout can't read yet** | Whiteout reads any readable text inside them. If there's none, they go through, marked not checked. |

---

## Repeat folders are fast

Whiteout remembers its verdict for each exact file under your current policies. Dropping the same folder again, or a folder that shares files with an earlier one, skips the files already checked. When an administrator changes a policy or a custom rule, every file is checked again the next time it's used.

Checking a large folder never slows down the messages people are sending: live messages are always checked first.

---

## What administrators see

Each folder is **one entry in Prompt Review**, for example:

> **[Folder] Client Files — 40 files: 37 allowed, 2 blocked, 1 not checked**

The entry shows **Folder, checked file by file** under the platform. Open it to see every file with its verdict and, for anything not checked, the reason.

- A file that was held back is kept as evidence, as a blocked single upload is.
- Files that passed aren't stored, only their names and sizes.
- Blocked files raise the usual **Document blocked** alert.

---

## When Whiteout can't check a folder

If Whiteout's service can't be reached, the folder follows your organization's **Fail open** / **Fail closed** setting:

- **Fail open** (default): the folder is attached with a **Sent without a Whiteout check** notice, and the attach is recorded.
- **Fail closed**: the folder isn't attached.

See [When Whiteout Is Unavailable](./governance/when-whiteout-is-unavailable.md).

---

## Folders handed to AI agents

Some AI assistants can be given a folder to work in, such as **Attach folder** in the Aside browser's assistant or Claude's Cowork. Today those folders are allowed and recorded in your activity. Checking each file an agent reads from such a folder is coming in a later release.
