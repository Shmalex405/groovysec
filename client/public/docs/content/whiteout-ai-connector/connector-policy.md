# Connector Policy

Every read that flows through the Whiteout AI Connector is vetted
against a **dedicated connector policy set** before any AI sees the
content — org-wide by default, with individual rules optionally
**scoped to user groups**. This page explains where that policy lives,
how it relates to the rest of Whiteout, and how an admin turns rules on
and off.

## The connector has its own dedicated policy

> **The single most-missed point:** the connector enforces a
> **dedicated, org-wide connector policy** — *not* your users' normal
> Whiteout group DLP policies. The per-group policies you set for
> browser, desktop, and IDE interception **do not apply to connector
> reads.** Connector reads are governed by their own separate policy
> profile, and only by that.

This is deliberate. Interception policy answers *"what may this user
send to an AI?"* and is naturally per-group. Connector policy answers
*"what content may leave a source through the connector?"* — a property
of the **content**, so it lives in one org-wide profile rather than
being scattered across group policy sets. Where permissions genuinely
differ by team, you narrow an individual rule's **scope** on that same
profile (see below) instead of maintaining a policy set per group.

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
   toggle it **off** to stop enforcing it. Changes apply to all
   connector traffic (or to the rule's scope, if you've narrowed one —
   see the next section) — they do not touch your interception group
   policies, and your group policies do not touch this list.

> Edits here affect the connector **only**. If you want the same rule
> enforced on browser/desktop/IDE traffic too, enable it in the
> relevant group policy separately — the two surfaces are configured
> independently by design.

## Exempt groups from a rule

By default an enforced rule fires for **every** connector query. When
permissions genuinely differ by team — the finance group may retrieve
financial statements through the connector while everyone else may not —
exempt that team from the rule instead of inverting your whole policy
set:

1. On the **Policies** surface, every enforced rule shows a scope chip
   (**All users** by default).
2. Click it and pick the groups to **exempt**. The rule then applies to
   everyone *except* those groups — the chip reads e.g.
   **Exempt: Finance**. Deselect every group to return to **All users**.
3. Save. The change applies on the very next query — scoping is decided
   at read time against the already-classified corpus, so there is
   **no re-scan**.

Note there is deliberately **no "apply only to these groups" mode**:
every user belongs to your org's baseline group, so an "only" list can
never exempt anyone from an org-wide rule, and apply-to lists silently
miss groups synced from your IdP later. Exemption lists stay
fail-closed: a new group is covered by every rule until you explicitly
exempt it.

Three rules of the road:

- **Membership in any exempted group counts.** A user in several groups
  is exempted if *any* of their groups is exempted — an exemption is a
  grant, and grants union.
- **Scoping requires caller identity.** It applies to reads made via an
  OAuth sign-in or a **personal connector token**. Queries made with
  the org-shared token carry no individual identity and always get the
  **full baseline** — no exemptions.
- **Exemptions stay visible.** Every read where a scoped rule was
  exempted for the caller is recorded in the audit trail and SOC events
  with the exempted policies listed.

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
and the policies that fired. Reads served under a group-scope exemption
carry the exempted policies too (`scope_exempted_policies`), so
carve-out use is as auditable as a block.

## Related

- [Connect an AI Assistant](./whiteout-ai-connector/connect-ai-assistant.md)
  — the step that puts reads on the connector in the first place.
- [Overview → Content vs. access — the core split](./whiteout-ai-connector/overview.md)
  — why content policy is org-wide while access stays per-user.
