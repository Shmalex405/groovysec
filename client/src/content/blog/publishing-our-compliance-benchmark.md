---
title: "Why We Publish Our Compliance Benchmark in the Open"
slug: publishing-our-compliance-benchmark
date: 2026-06-29
author: Alex Flowers
role: Co-Founder
excerpt: "Most AI-governance vendors ask you to trust a marketing number. We published the full 15,915-prompt benchmark behind Whiteout AI — every prompt, every label — so you can verify our accuracy yourself."
tags: [AI Governance, Compliance, Research]
category: Research
---

Every AI data-protection vendor publishes an accuracy number. Almost none of them publish the test.

That asymmetry is a problem. An accuracy figure with no dataset behind it is unfalsifiable — you can't reproduce it, you can't probe its weak spots, and you can't tell whether it was measured on a hand-picked set of easy cases. For a control that sits between your workforce and every AI tool they touch, "trust us" is not good enough.

So we did the opposite. The full benchmark we use to evaluate Whiteout AI's compliance engine is **public** — all 15,915 prompts, every label, spanning all nine policy domains.

## What's in the benchmark

The dataset is built to look like real traffic, not a demo:

- **15,915 prompts** ranging from one-line questions to long-form documents
- **All nine policy domains** — from PII and PHI to source code, financials, and credentials
- **Safe, violation, and edge-case scenarios** in every domain, because the edge cases are where keyword filters fall apart

The engine scores **greater than 99% accuracy** across the set, and it's calibrated to flag genuine violations without interrupting legitimate work. That second half matters as much as the first: a governance tool that cries wolf gets switched off.

## Why "greater than 99%" and not a single decimal

We recently re-ran the benchmark against an updated build. It landed in the same band — comfortably above 99%. Rather than chase a vanity decimal that shifts with every release, we now describe the result as **greater than 99% accuracy**, and point you to the dataset so you can compute whatever number you care about yourself.

That's the whole point of publishing: the number is ours, but the verification is yours.

## Verify it yourself

The benchmark is open on Hugging Face. Run your own prompts against it, check our labels, or use it to evaluate any other tool you're considering. Good governance should survive scrutiny — we'd rather invite it than ask you to take our word.
