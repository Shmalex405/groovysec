# Connector Policy

Every read that flows through the Whiteout AI Connector is vetted
against **one org-wide policy set** before any AI sees the content. This
page explains where that policy lives, how it relates to the rest of
Whiteout, and how an admin turns rules on and off.

## The connector has its own dedicated policy

> **The single most-missed point:** the connector enforces a
> **dedicated, org-wide connector policy** — *not* your users' normal
> Whiteout group DLP policies. The per-group policies you set for
> browser, desktop, and IDE interception **do not apply to connector
> reads.** Connector reads are governed by their own separate policy
> profile, and only by that.

This is deliberate. Interception policy answers *"what may this user
send to an AI?"* and is naturally per-group. Connector policy answers
*"what content may leave a source through the connector at all?"* — a
property of the **content**, the same for every user and every
assistant. So Whiteout keeps one connector policy for the whole org
rather than resolving a different rule set per caller.

Under the hood this is a single hidden, per-org policy profile
(Whiteout seeds it from your **Default** group the first time you open
the connector's policy view). You don't manage it as a group — you edit
it directly on the connector card, described below.

## View, enable, and disable rules

1. In the Whiteout desktop app, open **Integrations → Whiteout AI
   Connector**.
2. Open the connector card's **Policies** surface. It lists every rule
   in the policy library with an on/off state **for the connector**.
3. Toggle a rule **on** to have the connector enforce it on every read;
   toggle it **off** to stop enforcing it. Changes apply org-wide to
   all connector traffic — they do not touch your interception group
   policies, and your group policies do not touch this list.

> Edits here affect the connector **only**. If you want the same rule
> enforced on browser/desktop/IDE traffic too, enable it in the
> relevant group policy separately — the two surfaces are configured
> independently by design.

## Relationship to the policy library

The connector draws from the **same ~60-rule policy library** that
powers the rest of Whiteout — expert-authored rules spanning the
**PHI, PII, GDPR, Finance, Legal, Confidential, Security, and Code**
data classes. The connector's Policies surface is a *view onto that
library*: the rules are identical; what's connector-specific is which
of them are **enabled for connector reads**.

That means a rule like "block payroll data" or "withhold credentials"
behaves the same way it does elsewhere in Whiteout — the connector just
decides, on its own switch, whether to apply it to what the AI is
trying to read.

## What a block looks like to the AI

When a rule matches, the connector never hands the raw content to the
assistant. What the AI receives depends on how the rule classifies the
match:

- **Allowed read** — the content is returned normally (vetted), and the
  assistant works with it as usual. Access is still trimmed to what the
  querying user's own account can see.
- **Content withheld (title visible)** — the item still appears in a
  listing, but its body/preview is nulled and replaced with a short
  **policy stub** (a `whiteout_vetting` annotation naming the policy).
  If the AI tries to read it, it can only report that the content was
  blocked by policy — it never sees the text.
- **Withheld entirely (existence-classified)** — for the most sensitive
  rules the item is dropped from results altogether and counts are
  corrected, so the assistant has no way to verbalize that it ever
  existed.

In every blocked case the AI gets a governed stub in place of data, so
it can explain *that* something was withheld without leaking *what*.

## Audit

Connector reads that block or omit any item are recorded and fanned out
to your configured SOC/SIEM destinations. Find the trail in **Admin →
Audit → MCP Activity**; each row shows the tool, the requesting user,
and the policies that fired.

## Related

- [Connect an AI Assistant](./whiteout-ai-connector/connect-ai-assistant.md)
  — the step that puts reads on the connector in the first place.
- [Overview → Content vs. access — the core split](./whiteout-ai-connector/overview.md)
  — why content policy is org-wide while access stays per-user.
