---
title: "The 100,000-Prompt Compliance Benchmark, and the Number We Actually Stand Behind"
slug: the-100k-compliance-benchmark
date: 2026-09-05
author: Alex Flowers
role: CEO & Founder
excerpt: "We rebuilt the Whiteout AI benchmark at 100,000 prompts, published every prompt and label, and adjudicated every miss against the deployed rule text. The result is 96.8% corrected accuracy with a 99.9% pass rate on everyday prompts, at interactive speed."
tags: [AI Governance, Compliance, Research]
category: Research
---

When we first published our compliance benchmark, the point was falsifiability: a number with no dataset behind it cannot be checked. That still holds. What changed is the benchmark itself, and the way we score it.

## What the benchmark is now

The new release is **100,000 prompts** across all eight policy domains, in six bands:

- **core** (36,095): violations, safe prompts, and edge cases for every deployed policy
- **benign** (36,416): everyday work prompts that must pass; this is the false-positive floor
- **mixed** (9,920): a real work request paired with sensitive or masked content
- **multilingual** (7,548): non-English prompts across the domains
- **adversarial** (6,673): thirteen obfuscation techniques, from reversed text to homoglyphs, applied to real violations and to decoys
- **long** (3,348): documents of 1,000 to 7,800 characters with buried, split, and decoy payloads

Every prompt carries a ground-truth verdict and the policy facet it exercises. All of it is on [Hugging Face](https://huggingface.co/datasets/ShmalexFlow/enterprise-ai-prompt-compliance-100k) under Apache 2.0.

## How we score it

Raw accuracy is easy to compute and easy to inflate. Our published figure is **corrected accuracy**: after a run, every residual miss is checked against the text of the deployed rule that governs it. If the rule's own wording disagrees with the label, the label is wrong and we adjust the score. If the rule agrees with the label, the engine is wrong and nothing is adjusted. Crediting an engine defect as a bad label would inflate the headline by exactly the work we still owe, so we do not.

On this release the engine scores **96.53% raw** and **96.78% corrected** (95% confidence interval 96.65 to 96.95). Recall on violations is 96.4%, specificity on prompts that should pass is 96.6%, and on the 36,416 everyday prompts the pass rate is **99.89%**: forty false blocks in a working day's worth of ordinary requests, across a hundred thousand.

## Speed is part of the result

Accuracy at a latency people will not tolerate is not governance, it is friction. The engine sustains **9.6 prompts per second** on two engines, with a median verdict of about **1.1 seconds** for allowed prompts and **2.7 seconds** for blocked ones at sixteen concurrent requests. It reaches those numbers by producing verdicts on a forced answer channel with schema-constrained decoding, and escalating only the few percent of prompts where a deterministic pre-analysis disagrees with the first verdict.

## What is left

The remaining error mass is judgment-shaped: semantic violations with no lexical shape, and over-blocks on content where sensitive values are masked. Prompt and rule engineering have reached their plateau there. The path forward is fine-tuning the engine on adjudicated verdicts, with the benign band as the guardrail that must not move. The [technical report that accompanies this release](/Whiteout_AI_Compliance_Benchmark_TR-2026-09.pdf) documents every table, the adjudication protocol, the fail-closed validation, and that roadmap. Read it as the standard we hold ourselves to: for each policy, what a compliant prompt looks like, what a violation looks like, and how close the engine gets.

Run your own prompts against it. Check our labels. Good governance should survive scrutiny.
