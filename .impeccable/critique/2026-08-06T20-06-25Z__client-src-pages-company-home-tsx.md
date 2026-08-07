---
target: Clean Sweep light restyle — homepage
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-06T20-06-25Z
slug: client-src-pages-company-home-tsx
---
# Critique — Clean Sweep light restyle (groovysec.com homepage)

Method: dual-agent (A: a610ad874049cbb47 · B: a578cd2d4eac02088)
Target: client/src/pages/company-home.tsx (Option 00 "Clean Sweep" light direction applied to today's site)
Mode: Persuade. Browser overlay skipped: dev server not running; CLI detector covered the same markup.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Fake "live" pulsing dot on static compliance text |
| 2 | Match System / Real World | 3 | Verdict trio + flow diagram map the domain well; eyebrow acronym-speak undecoded (copy frozen) |
| 3 | User Control and Freedom | 3 | Standard nav; splash replays on root (hard constraint, noted) |
| 4 | Consistency and Standards | 2 | Four radii; three visual treatments for "Request Demo"; per-section accent rainbow; Products→Whiteout links to `/` though `/whiteout-ai` exists |
| 5 | Error Prevention | 3 | Low-risk surface |
| 6 | Recognition Rather Than Recall | 3 | Company-vs-product identity blur at root |
| 7 | Flexibility and Efficiency | n/a | Persuade surface, first-time visitors |
| 8 | Aesthetic and Minimalist Design | 2 | Post-relight still stacks 4 bg layers + gradient text + self-animating buttons |
| 9 | Error Recovery | n/a | No error states on this surface (form lives on /demo) |
| 10 | Help and Documentation | n/a | Persuade surface; Resources nav is the ceiling |
| **Total** | | **19/28** | **Acceptable (68%)** |

## Design Specificity Verdict

Split verdict: content layer authored (tri-plate mark, flow diagram, orbital map, verdict-color trio), chrome layer category-interchangeable (badge pill, dark radial-gradient CTAs, blob wash, gradient headline, blur nav, uniform rounded cards). The relight as-mocked moves ~60% of the way from "dark AI slop" to authored.

Deterministic scan: 16 findings — gradient-text ×15 across 9 files (index.css defines `.gradient-text` / `.text-gradient-brand` / `.text-gradient-hero` globally; call sites in solution-page, government, academic-integrity, security-whitepaper, skills, download, whiteout-differentiators, gradient-text.tsx primitive), bounce-easing ×1 in protected splash-intro.tsx (excluded). Detector and design review agree: gradient text is the #1 codified tell. Detector adds: the pattern is sitewide, not hero-only — skills.tsx has three different gradient spans in one sentence; differentiators put gradients on stat numbers.

## Per-flag survival table (the user's five flags vs the Clean Sweep as-mocked)

| Flag | Status after relight | Finishing move (token/CSS only) |
|------|---------------------|--------------------------------|
| 1 Aurora blobs | Partial — alphas lowered, all 4 blobs + drift keyframes survive | Freeze the drift; collapse to 1–2 static hero-scoped radial washes; not page-wide |
| 2 Gradient headline | Partial — animation gone, still blue→green gradient line; `.text-gradient-hero` (white-ended stops) breaks on white | Solid ink headline; single brand-blue accent line at most; delete text-gradient utilities from light theme |
| 3 Glassmorphism | Mostly retired on cards; survives in nav (72% white + blur) and dark dropdown/mobile panels | Solid white nav + hairline + scroll shadow; solid white dropdowns; zero backdrop-filter |
| 4 One radius, one weight | Not retired — 999/11/9/14px radii, two identical filled CTAs | Radius tokens 6px controls / 12px containers; exactly one filled CTA per view, secondary = 1px ink outline; keep stat-row hairlines as the structural motif |
| 5 Identity clash | Half-dissolved by paper ground | Letterspaced-caps eyebrow token (0.18–0.2em, ink) on badges/stat labels/captions/footer; optional Cinzel eyebrows |

## Priority Issues

- [P0] Dark radial-gradient CTAs on white + 8s autonomous color-cycle on nav button. Fix in `.gradient-button` block: solid #1A5FB4 primary, ink-outline secondary, delete btn-color-shift.
- [P0] `text-gradient-hero` white-ended stops on company-home 8xl headline — near-invisible on #FBFCFE. Solid #0F1B2D.
- [P1] Freeze aurora drift; 1–2 static hero-scoped washes. Motion budget → plate spin + flow-route dashes only.
- [P1] De-glass nav/dropdowns/mobile sheet; remove all backdrop-filter (perf win too).
- [P2] Token pass: radius 6/12; grays slate-400/500 → #51617A/#0F1B2D (slate-400 on white = 2.6:1, fails AA); accents = brand blue + verdict colors only.
- [P2] Retire residual theater: founder-card glow-pulse → standard shadow; live-dot → static; cursor-follow glow → border hover; RevealCard full-wipe → quiet hover.
- [P3] Eyebrow/micro-label system echoing wordmark tracking.

## Persona Red Flags

Jordan (first-timer): Whiteout-vs-Groovy identity blur; Products→"Whiteout AI" links to `/`; three CTA verbs (Request Demo / Schedule Consultation / See How It Works); undecoded proof-numbers.
Riley (stress tester): self-cycling nav button reads as broken; RevealCard duplicates content (read twice by screen readers); slate-400 AA failures; no Esc on dropdowns; blob banding on cheap panels.
Casey (mobile): 4 blurred layers + blur nav = scroll jank on mid-tier Android; mobile menu CTA is a third grammar; pulsing dot beside primary CTA at decision moment; grayscale Maestro mark reads broken on white.

## Minor Observations

- Ground sweep needed beyond body: footer + nav scrolled-state hardcode bg-slate-950; decide if footer stays dark deliberately.
- Prune from light theme: hero-gradient, glass-card-dark, scan-line, sparkle-float, glow-pulse keyframes.
- CheckCircle bullets → verdict-ok green #2E7D32 for semantic consistency.
- Stat row ships "12 Frameworks / 23+ Platforms" — known divergence vs deck standard (9 domains / 35+ integrations).
- Name the mono micro-label token so it doesn't drift.

## Questions to Consider

1. What if the primary CTA wore verdict-green — every click enacting "approved" — instead of a gradient that belongs to everyone?
2. Is the identity clash actually an identity shortage — should Cinzel's voice recur in eyebrows instead of appearing once?
3. Can the aurora be given a job — ambient "AI traffic" behind the interception diagram only — so the last motion-without-meaning becomes the motion that tells the story?
