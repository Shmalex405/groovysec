# AI System Register

Almost every AI framework starts with an inventory. ISO/IEC 42001 asks you to document the tools and resources AI systems use, NIST AI RMF asks for mechanisms to inventory AI systems (GOVERN 1.6) and to document intended purposes (MAP 1.1), the EU AI Act asks you not to use prohibited practices (Article 5), GDPR asks for records of processing (Article 30), and the Colorado AI Act asks for a public statement on high-risk systems in use.

Discovery tells you *what* AI is in use. Only your organization can say *who owns it*, *what it's for* and *how risky it is*. The **AI System Register** puts the two side by side: every AI tool Whiteout's discovery has found, with the owner, purpose, risk tier and approval you record for it.

Open it from **Governance** > **Compliance Evidence** > **AI Register**, or with **AI Register** on the Integrations card. The page is titled **AI System Register**.

## Where the tools come from

The register fills automatically from **AI Footprint** discovery. Each row is an AI tool found by at least one of:

- **Desktop Guard**, on employee laptops and desktops;
- the **infrastructure agent**, on servers, containers and build hosts;
- an **MDM integration**, reporting AI apps on managed devices.

Discovery finds desktop apps, IDE and browser extensions, local model runtimes, command-line tools, SDK dependencies, model files and MCP server configurations. Installs of the same tool on different devices, or reinstalled later, are grouped into one register row, so your record follows the tool rather than the device.

You can't add tools by hand. A register entry can only exist for a tool discovery has actually seen, which keeps the register tied to evidence rather than typed-in rows. If the register is empty, the page says *No AI tools discovered yet* and offers **Open AI Footprint**. Deploy one of the discovery surfaces first.

## The page

At the top, six figures summarize the tools currently installed:

| Figure | Meaning |
|--------|---------|
| **AI tools** | Distinct AI tools currently installed somewhere in your organization |
| **Fully recorded** | Tools with an owner, an intended purpose and a risk tier |
| **Unassessed** | Tools whose risk tier is still **Unassessed** |
| **High risk** | Tools you've rated **High** |
| **Prohibited, still in use** | Tools you've rated **Prohibited** that discovery still finds installed. Act on these first. |
| **Approved** | Tools marked **Approved for use** |

The table lists one row per tool:

| Column | What it shows |
|--------|---------------|
| **AI tool** | The tool's name, with a check mark once it's fully recorded. Underneath: its category, provider, and *no longer installed* if it has been removed. |
| **Users** | How many people have it installed |
| **Owner** | The business owner's email |
| **Purpose** | The intended purpose (hover to read it all) |
| **Risk tier** | **Minimal**, **Limited**, **High**, **Prohibited** or **Unassessed** |
| **Approved** | **Yes** or **No** |

Two switches filter the table:

- **Only incomplete** hides tools that are already fully recorded. When every tool is recorded, the page says *Every AI tool is fully recorded*.
- **Show tools no longer installed (*n*)** appears when some registered tools have been uninstalled everywhere. They stay on the register with your record, so you keep the history.

## Record a tool

1. Click the edit icon at the end of the tool's row.
2. The dialog is titled with the tool's name, and reminds you that *an entry is complete once it names an owner, an intended purpose and a risk tier.* Fill in:

   | Field | Notes |
   |-------|-------|
   | **Business owner** | Any user in your organization, or **No owner**. The person accountable for the tool's use, not necessarily an admin. |
   | **Intended purpose** | What the tool is used for, for example *Drafting customer support replies*. Up to 4,000 characters. |
   | **Risk tier** | **Unassessed**, **Minimal**, **Limited**, **High** or **Prohibited**. |
   | **Next review** | Optional. The date you plan to review this entry again. |
   | **Approved for use** | Tick when the tool is approved. Whiteout records who approved it and when, and shows *Approved by \<email\> on \<date\>*. Unticking it clears the approval. |
   | **Notes** | Optional. Up to 4,000 characters, for example the vendor assessment reference or the data classes the tool may process. |

3. Click **Save**.

An entry counts as **complete** once it has a business owner, a non-empty intended purpose and any risk tier other than **Unassessed**. Approval and the review date don't affect completeness, but they appear in evidence packs.

Every save is written to the admin audit log, with the old and new risk tier, approval and owner, and whether a purpose is recorded.

### Choosing a risk tier

The tiers follow the risk-based vocabulary of the EU AI Act. Whiteout doesn't assign them, and doesn't check them against any legal definition. The tier is your organization's assessment:

| Tier | Typical meaning |
|------|-----------------|
| **Minimal** | General-purpose productivity use with low risk |
| **Limited** | Use that carries transparency obligations or handles some sensitive data |
| **High** | Use that affects consequential decisions about people or processes regulated data at scale |
| **Prohibited** | Use your organization doesn't allow. Pair it with a block, for example an AI app restriction, so discovery doesn't keep finding it. |
| **Unassessed** | Not yet assessed. This is the default. |

The register records your decision; it doesn't enforce it. Rating a tool **Prohibited** doesn't block it. To block an AI app or provider, use Whiteout's policy and app-access settings. Those blocks then appear as **AI app and provider restrictions** evidence.

## How the register is used as evidence

The register feeds the **AI System Register** [evidence source](./compliance-evidence/evidence-sources.md#inventory-and-discovery), which backs:

- NIST AI RMF **MAP 1.1** (intended purposes documented)
- EU AI Act **Article 5** (no prohibited practices)
- GDPR **Article 30** (records of processing)
- Colorado AI Act **6-1-1703(5)** (statement on high-risk systems in use)

It reads **Present** when every inventoried tool is complete, **Partial** when some are, and **Absent** when none are. The register also appears in the inventory snapshot each day, so the register's completeness over time is recorded once you track a framework.

In every evidence pack:

- `report.pdf` has an **AI System Register** section: the summary figures and a table of tool, category, owner, risk tier and approved, showing up to 100 tools, with the full count stated.
- `csv/ai_register.csv` lists every row, including tools no longer installed, with the tool key, tool, category, provider, installs, users, business owner, purpose, risk tier, approved, approved by and whether it's still in the inventory.

Owners and approvers who aren't admins or Read-Only users appear as pseudonyms unless you choose to show end-user email addresses. See [Email addresses and pseudonyms](./compliance-evidence/evidence-packs.md#email-addresses-and-pseudonyms).

## Keeping the register current

- **Review new tools weekly.** Turn on **Only incomplete** and work down the list. New tools discovery finds arrive as **Unassessed** with no owner.
- **Deal with prohibited tools still in use.** A non-zero **Prohibited, still in use** figure is exactly what an auditor will ask about. Block the tool, or record why it's still in use.
- **Use the review date.** Set **Next review** to match your governance cadence, for example every 12 months, or sooner for **High** tools.
- **Share the load.** Business owners don't need admin access. An admin records the owner, and the owner provides the purpose and assessment.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| *No AI tools discovered yet* | No discovery surface is enrolled, or discovery hasn't reported yet. Deploy Desktop Guard, the infrastructure agent or an MDM integration, then check **AI Footprint**. |
| A tool you know is in use isn't listed | Discovery hasn't seen it on any enrolled device. Check that the device runs Desktop Guard or is MDM-managed. |
| A person isn't in the **Business owner** list | The list shows users in your Whiteout organization. Sync your identity provider, or add the user. |
| The edit icon is greyed out | You have the **Read-Only** role. |
| *Unknown AI tool* when saving | The tool is no longer in the current inventory and has never been registered. Only tools discovery currently sees can get a new entry. |
| A removed tool disappeared | It's hidden, not deleted. Turn on **Show tools no longer installed**. |
