---
title: "We Made Our Penetration Testing Platform Free"
slug: why-maestro-is-free
date: 2026-08-11
author: Alex Flowers
role: CEO & Founder
excerpt: "Maestro started as the tooling I built to do my own security assessments. It is now free, with the source public — because the scanners were never the expensive part, and the orchestration should not be either."
tags: [Maestro, Open Source, Penetration Testing, Security]
category: Product
---

Maestro is free as of this week. The desktop app, all 24 agents, every surface — web,
API, cloud, Kubernetes, identity, AI/LLM. The source is public and auditable. There is
no crippled tier, no seat count, and no licence key.

I want to explain why, because "we made it free" is a marketing sentence and the actual
reasoning is more specific than that.

## It started as the tooling I needed

I built the first version of Maestro to do my own work. Running an assessment means
driving the same twenty tools in roughly the same order, reading a great deal of output
that mostly does not matter, and then doing the part that is actually hard — working out
which of four hundred alerts is real, chaining the three that combine into something
serious, and writing it up so an engineer can act on it.

The tools were never the bottleneck. nmap, sqlmap, semgrep, nuclei — excellent, free,
and sitting right there for decades. What takes the time is the orchestration and the
judgement, and that does not scale by hiring harder.

So it began as internal tooling alongside Whiteout AI, our AI-governance platform. It
grew because every assessment taught it something. It is now the thing I reach for
first, which is the only endorsement of a tool that means anything.

## Why give it away

A serious penetration test costs five figures and takes weeks to schedule. That
arithmetic works for a bank. It does not work for the clinic, the school district, the
two-person startup holding real customer data, or the non-profit running something
critical on a volunteer budget.

Those organisations are not less exposed. They are more exposed, and an attacker knows
it. The gap between who can afford to find their vulnerabilities and who cannot is not a
market inefficiency — it is where breaches come from.

We could not construct a good argument for putting the orchestration behind an
enterprise contract when the instruments underneath it have been free for thirty years.
So we did not.

## The part I actually care about

If you have looked at this category recently you have seen a lot of "AI-powered
security testing," and you have probably learned to distrust it. The reason is
straightforward: language models are agreeable. Ask one whether the exploit worked and
it will often tell you what you seem to want to hear. A tool that hallucinates findings
is worse than no tool, because now you are paying an engineer to chase ghosts.

Maestro's answer is not a better prompt. It is structural.

**The model supplies the experiment and never the verdict.** Every finding marked
exploitable is re-proven under one of six deterministic oracles, each with a mandatory
control. The model can propose the test, run it, and describe what it saw. It cannot
write `verified` — that is enforced in three separate places, including a database
constraint. Not a rule in an instruction file the model might reinterpret. A constraint
it cannot reach.

Two more mechanisms exist for the same reason:

**A missing scanner cannot look like a clean result.** If a test passes but the tool
behind it was absent from the container or never exited successfully, the result is
forced to BLOCKED. Silent tool failure producing green checkmarks is one of the
commonest ways automated security reporting lies, and it is invisible from the outside.

**Severity is earned, not inherited.** A finding's severity comes from what exploitation
actually achieved, not from what a CVE record says the worst case might be. A critical
CVE in a dependency you never call is not a critical finding, and saying so is more
useful than inflating a number.

None of this makes the tool clever. It makes it unable to flatter itself, which for a
security tool matters considerably more.

## Check it yourself

That is a strong claim, so it should be a checkable one. The source is public — read the
oracle layer, the scope guard, the container definition and the agent instructions
before you run anything. The repository also stands up OWASP Juice Shop and NodeGoat
locally, both built to be attacked, so you can point it at a target designed for the
purpose and judge the output rather than take my word for it.

You should want that from any tool that executes real attacks from your machine. Doing
so on trust from a binary is a poor idea, which is a large part of why we published the
code.

## What we sell

Maestro runs entirely on your machine. Your findings, target details and credentials
stay there — nothing is sent to us, and there is no account to create.

Two things remain commercial, and neither is a feature we removed from the free build.
The first is the **human-signed attestation**: an auditor or a customer's security
questionnaire generally wants a named practitioner standing behind a report, and a tool
cannot supply that. The second is the **team backend** — if several people need to work
from the same findings, that needs infrastructure and support.

The tool is yours. What we sell is a signature and a service.

## Where to start

Signed builds for macOS, Windows and Linux are at
[groovysec.com/maestro/install](/maestro/install). You will need Docker, the toolkit
image, and your own Claude or ChatGPT account — Maestro does not ship a model and does
not meter your usage.

One thing worth reading before you begin: Maestro performs real exploitation. It sends
live payloads, forges tokens and reads data in order to prove impact. Every tool call is
validated against your scope first, with exclusions that fail closed. That is a
guardrail, not permission — only assess systems you are authorized to test.

If it helps you find something before someone else does, it has done its job. If it gets
something wrong, [tell us](https://github.com/Shmalex405/maestro/issues/new/choose) —
a report that a finding is wrong is worth more to us than a compliment.
