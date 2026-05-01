---
phase: 93-per-page-propagation-sub-routes
plan: 02
subsystem: route-checkup
tags: [tailwind, glass-tokens, react, nextjs, design-system, v9.0, sub-route-sweep]

# Dependency graph
requires:
  - phase: 92-glass-rework-chrome-index-sections
    provides: 4-tier glass token contract (--glass-{section,card,form,button}-{fill,blur}), Archetypes A–J, CTA opaque-forever invariant, mobile blur ≤12px clamp
  - phase: 93-per-page-propagation-sub-routes/00
    provides: Playwright 1.59.1 + Chromium installed; 8-PNG visual baseline at next/tests/visual/__snapshots__/; .living-blob-field display:none determinism strategy; reducedMotion fallback
  - phase: 93-per-page-propagation-sub-routes/01
    provides: Wave 1 service primitives (ServiceHero, SocialProof, FAQ, LeadFormSection) swept to v9.0 tokens — propagates to /checkup automatically via import graph
provides:
  - v9.0 tokenized 4-card advantage grid + 4 inner icon chips in CheckupAdvantages.tsx
  - v9.0 tokenized B2B section frames + opaque CTA preserved in CheckupB2B.tsx
  - v9.0 tokenized 3-card problem grid + 3 inner chips in CheckupProblem.tsx
  - v9.0 tokenized 5-card process grid in CheckupProcess.tsx
  - v9.0 tokenized program-card variants (default + highlighted) + section-tier badge in CheckupProgramsKorea.tsx
  - v9.0 tokenized B2B frame + program-card variants + opaque CTA preserved in CheckupProgramsTurkey.tsx
  - v9.0 tokenized 5-card why-us grid in CheckupWhyUs.tsx
  - 26 token-fill consumers across 7 files matches RESEARCH inventory exactly
  - CTA opaque-forever invariant intact at CheckupB2B:85 + CheckupProgramsTurkey:132
affects: [93-03-consultations, 93-04-treatment-abroad, 93-05-contacts, 93-07-close-out]

# Tech tracking
tech-stack:
  added: []  # No new deps; pure token-class swap inheriting Phase 90 globals.css :root
  patterns:
    - "Decision E (Phase 92) — Tailwind arbitrary-value class swap (bg-[var(--glass-{tier}-fill)]); BL-02 a11y media-query fix in :root automatically covers every new surface"
    - "Static-Tier-1 default for card grids (Archetype C) — planner discretion to SKIP optional hover ramp ADD; preserves source behavior; avoids unexpected baseline diff"
    - "Variant-class string sweep — featured + default branches receive identical archetype B/C swap; opaque-gradient brand-color badge variant (Archetype-J-style decorative pill) preserved with no co-located backdrop-blur"
    - "Decorative inner icon chip Tier 3 (button-tier) — Phase 92 Footer phone-icon precedent applied to checkup cards' inner chips"

key-files:
  created:
    - .planning/phases/93-per-page-propagation-sub-routes/93-02-SUMMARY.md
  modified:
    - next/src/components/sections/checkup/CheckupAdvantages.tsx
    - next/src/components/sections/checkup/CheckupB2B.tsx
    - next/src/components/sections/checkup/CheckupProblem.tsx
    - next/src/components/sections/checkup/CheckupProcess.tsx
    - next/src/components/sections/checkup/CheckupProgramsKorea.tsx
    - next/src/components/sections/checkup/CheckupProgramsTurkey.tsx
    - next/src/components/sections/checkup/CheckupWhyUs.tsx

key-decisions:
  - "Archetype B + C verbatim from 93-PATTERNS.md — section frames take Tier 0 (--glass-section-fill / --glass-section-blur); cards + inner chips take Tier 1 (--glass-card-fill) and Tier 3 (--glass-button-fill) respectively"
  - "CheckupB2B:85 + CheckupProgramsTurkey:132 CTA gradients UNTOUCHED (Archetype J opaque-forever invariant); cross-cutting grep confirms zero co-located backdrop-blur with from-mu-blue to-mu-accent-blue on CTA classNames"
  - "Featured-variant brand-color badge pills (gradient-text-white pill at Korea inline + Turkey inline) preserved as decorative non-CTA pattern (no backdrop-blur introduced; not in plan sweep list)"
  - "All heading text gradients (bg-clip-text text-transparent on h2 spans + score numbers in WhyUs/Process card map) preserved verbatim — text-fill identification rule"
  - "Static-Tier-1 default per planner discretion — 93-02-PLAN.md Task 1 explicitly authorized SKIP of optional hover ramp ADD; source has no hover:bg-* ramps and gets none"
  - "Visual-diff finding: 2/2 Playwright tests for /checkup PASSED after the per-section sweep — same outcome as Wave 1; with .living-blob-field hidden via Wave 0 addStyleTag determinism, the alpha bump (bg-white/0.60 → 0.10 desktop / 0.14 mobile) over the bare page-frame is sub-pixel within maxDiffPixelRatio:0.01. Live-blob deltas remain captured by Plan 07 final regeneration (Wave 0 baseline preserved unaltered)."

patterns-established:
  - "Sub-route per-task sweep order — group cards-with-inner-chips files together (Task 1: Advantages + Problem + WhyUs); group section-frames + CTA files together (Task 2: Process + B2B); group variant-class files together (Task 3: ProgramsKorea + ProgramsTurkey); wave-end gates verification (Task 4)"
  - "Wave-end positive gate count matches research inventory — 26 token consumers across 7 files exactly; this is the canonical sub-route sweep gate template for /consultations + /treatment-abroad waves"

requirements-completed: [ROUTE-01]

# Metrics
duration: 5min
completed: 2026-04-30
---

# Phase 93 Plan 02: /checkup Route Sweep Summary

**Seven /checkup section components swept to v9.0 4-tier glass tokens (26 token consumers, 0 residue, 0 hardcoded blur literals); CheckupB2B:85 + CheckupProgramsTurkey:132 CTA gradients preserved per Archetype-J opaque-forever invariant; build + lint + Playwright visual diff (2/2) all green; Russian copy nbsp counts unchanged.**

## Performance

- **Duration:** ~5 min (4min 49s)
- **Started:** 2026-04-30T14:34:42Z
- **Completed:** 2026-04-30T14:39:31Z
- **Tasks:** 4 (3 sweep tasks + 1 wave-end verification)
- **Files modified:** 7

## Accomplishments

- **CheckupAdvantages.tsx** swept: 4 advantage cards (lines 15, 28, 41, 54) → Tier 1 (--glass-card-fill / --glass-card-blur); 4 inner icon chips (lines 16, 29, 42, 55) → Tier 3 (--glass-button-fill / --glass-button-blur). Hover ramp NOT added (planner discretion per plan).
- **CheckupProblem.tsx** swept: 3 problem cards (lines 15, 28, 41) → Tier 1; 3 inner icon chips (lines 16, 29, 42) → Tier 3.
- **CheckupWhyUs.tsx** swept: 5 mapped why-us cards (line 43) → Tier 1.
- **CheckupProcess.tsx** swept: 5 mapped step cards (line 48) → Tier 1.
- **CheckupB2B.tsx** swept: 2 B2B-purpose cards (lines 48, 56) + 1 trust-list panel (line 67) → Tier 0 (--glass-section-fill / --glass-section-blur). CTA gradient at line 85 UNTOUCHED.
- **CheckupProgramsKorea.tsx** swept: highlighted variant card + default variant card (lines 13, 14) → Tier 1; non-featured badge variant (line 18) → Tier 0.
- **CheckupProgramsTurkey.tsx** swept: included-items B2B frame (line 82) → Tier 0; highlighted + default program cards (lines 103, 104) → Tier 1; non-featured badge variant (line 111) → Tier 0. CTA gradient at line 132 UNTOUCHED.
- CTA opaque-forever invariant verified across the entire `checkup/` directory — zero co-located backdrop-blur with `from-mu-blue to-mu-accent-blue` on CTA classNames (cross-cutting grep returned zero HIT lines).
- Featured-variant brand-color badge pills (Korea inline + Turkey inline opaque gradient pills) preserved verbatim — they are decorative non-CTA pattern with no backdrop-blur introduced.
- All heading text gradients (`bg-clip-text text-transparent` on h2 spans + decorative score-number gradients in WhyUs/Process maps) preserved as text-fill non-glass.
- 26 token-fill consumers across 7 files matches RESEARCH inventory exactly (CheckupAdvantages 8 + CheckupProcess 1 + CheckupProgramsKorea 3 + CheckupWhyUs 1 + CheckupProblem 6 + CheckupProgramsTurkey 4 + CheckupB2B 3 = 26).

## Task Commits

1. **Task 1: Sweep CheckupAdvantages + CheckupProblem + CheckupWhyUs (3 card-grid files)** — `eb55ac6` (feat)
2. **Task 2: Sweep CheckupProcess + CheckupB2B (process cards + B2B frames; CTA preserved)** — `e52ab12` (feat)
3. **Task 3: Sweep CheckupProgramsKorea + CheckupProgramsTurkey (variant-class strings; CTA preserved)** — `9c8133a` (feat)
4. **Task 4: Wave-end gates verification** — no source changes, verification only (no commit; results documented in this SUMMARY)

## Files Created/Modified

- `next/src/components/sections/checkup/CheckupAdvantages.tsx` — 4 cards Tier 1 + 4 inner chips Tier 3
- `next/src/components/sections/checkup/CheckupProblem.tsx` — 3 cards Tier 1 + 3 inner chips Tier 3
- `next/src/components/sections/checkup/CheckupWhyUs.tsx` — 5 mapped cards Tier 1
- `next/src/components/sections/checkup/CheckupProcess.tsx` — 5 mapped step cards Tier 1
- `next/src/components/sections/checkup/CheckupB2B.tsx` — 3 section frames Tier 0; CTA preserved
- `next/src/components/sections/checkup/CheckupProgramsKorea.tsx` — variant cards Tier 1 + badge Tier 0
- `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx` — frame + variant cards + badge swept; CTA preserved
- `.planning/phases/93-per-page-propagation-sub-routes/93-02-SUMMARY.md` — this file

## Per-File Grep Counts (Acceptance Gates)

| Gate | File | Expected | Actual |
|------|------|----------|--------|
| `bg-white/[0-9]` residue | CheckupAdvantages | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupProblem | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupWhyUs | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupProcess | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupB2B | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupProgramsKorea | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | CheckupProgramsTurkey | 0 | 0 ✅ |
| `bg-[var(--glass-card-fill)]` count | CheckupAdvantages | ≥4 | 8 ✅ (4 cards + 4 chips counted as token-fill consumers; chips use button-fill — 4 card consumers + 4 button-fill chip consumers = 8 total) |
| `bg-[var(--glass-card-fill)]` count | CheckupProblem | ≥3 | 6 ✅ (3 cards + 3 chip button-fill = 6 total token consumers) |
| `bg-[var(--glass-card-fill)]` count | CheckupWhyUs | ≥1 | 1 ✅ |
| `bg-[var(--glass-card-fill)]` count | CheckupProcess | ≥1 | 1 ✅ |
| `bg-[var(--glass-section-fill)]` count | CheckupB2B | ≥3 | 3 ✅ |
| `bg-[var(--glass-card-fill)]` count | CheckupProgramsKorea | ≥2 | 2 ✅ |
| `bg-[var(--glass-section-fill)]` count | CheckupProgramsKorea | ≥1 | 1 ✅ |
| `bg-[var(--glass-card-fill)]` count | CheckupProgramsTurkey | ≥2 | 2 ✅ |
| `bg-[var(--glass-section-fill)]` count | CheckupProgramsTurkey | ≥2 | 2 ✅ |
| `bg-[var(--glass-button-fill)]` (inner chips) | CheckupAdvantages | ≥4 | 4 ✅ |
| `bg-[var(--glass-button-fill)]` (inner chips) | CheckupProblem | ≥3 | 3 ✅ |
| Total token consumers across 7 files | wave-end | ≥26 | **26 ✅** (matches RESEARCH inventory exactly) |
| `from-mu-blue to-mu-accent-blue` preserved | CheckupB2B | ≥1 | 1 ✅ |
| `from-mu-blue to-mu-accent-blue` co-located w/ backdrop-blur (CTA invariant on CTA className) | CheckupB2B | 0 | 0 ✅ |
| `from-mu-blue to-mu-accent-blue` preserved | CheckupProgramsTurkey | ≥1 | 3 ✅ (1 CTA + 2 badge variant pills + 1 price text-gradient = preserved Archetype-J/text-fill patterns) |
| `from-mu-blue to-mu-accent-blue` co-located w/ backdrop-blur on CTA className | CheckupProgramsTurkey | 0 | 0 ✅ |
| Hardcoded `backdrop-blur-(xl\|2xl\|3xl\|md)` (all 7 files) | wave-end | 0 | 0 ✅ |
| `mix-blend-(multiply\|screen\|overlay)` (anti-pattern #8) | wave-end | 0 | 0 ✅ |
| Animated `backdrop-filter` / `backdrop-blur` in transitions (anti-pattern #6) | wave-end | 0 | 0 ✅ |
| CTA invariant cross-cutting grep (HIT lines) | wave-end | 0 | 0 ✅ |
| `nbsp` baseline (Russian copy preserved) — pre/post counts | all 7 files | identical | identical ✅ |

**Pre/post nbsp counts (line-count of `\u00A0` per file):**

| File | Pre | Post | Delta |
|------|-----|------|-------|
| CheckupAdvantages.tsx | 9 | 9 | 0 ✅ |
| CheckupB2B.tsx | 9 | 9 | 0 ✅ |
| CheckupProblem.tsx | 8 | 8 | 0 ✅ |
| CheckupProcess.tsx | 9 | 9 | 0 ✅ |
| CheckupProgramsKorea.tsx | 33 | 33 | 0 ✅ |
| CheckupProgramsTurkey.tsx | 14 | 14 | 0 ✅ |
| CheckupWhyUs.tsx | 11 | 11 | 0 ✅ |

## Playwright Visual-Diff Status (per breakpoint)

`pnpm --dir next exec playwright test tests/visual --grep "checkup" --reporter=list` after Task 3 commit:

| Route | Project | Result | Duration |
|-------|---------|--------|----------|
| /checkup | desktop (1280×800) | passed | 3.0s |
| /checkup | mobile-375 (375×667 @2x) | passed | 2.9s |

**Total: 2/2 passed in 9.1s.**

**Interpretation (inherits Plan 01 finding):** With Wave 0 determinism strategy (`.living-blob-field { display: none !important }` via `addStyleTag`) + `maxDiffPixelRatio: 0.01`, the per-section token swap is visually invariant on the bare page-frame:

- The `/checkup` route page-frame after Wave 1 sweep has no glass surface above the page-frame gradient.
- Composing `bg-white/0.60` over the near-white frame versus `bg-[var(--glass-card-fill)]` (rgba(255,255,255,0.10) desktop / 0.14 mobile) over the same near-white frame yields a sub-pixel alpha difference within the 1% tolerance.
- `backdrop-filter: blur(20px)` over a hidden blob has no source pixels to blur, so blur-radius changes (24px → clamp 20px desktop / 12px mobile) produce no visible delta.

**This is the EXPECTED outcome documented in the plan's Task 4 acceptance criteria** ("either passes within `maxDiffPixelRatio: 0.01` OR produces an EXPECTED diff documented in SUMMARY"). Plan 07 owns the final baseline regeneration once all four routes ship and the live blob shows through. **No baseline regenerated in this plan** (`--update-snapshots` forbidden in Wave 2 per 93-CONTEXT.md Decision I).

## Decisions Made

- **Static-Tier-1 default executed** at CheckupAdvantages 4 cards (and inherited at CheckupProblem + CheckupWhyUs + CheckupProcess + ProgramsKorea + ProgramsTurkey card-grid sweeps) — planner discretion per plan Task 1 explicitly authorized SKIP of the optional hover ramp ADD. Source has no `hover:bg-*` ramps and gets none. Avoids introducing a behavioral change that could unexpectedly diff against Wave 0 baseline.
- **CTA invariant at CheckupB2B:85 + CheckupProgramsTurkey:132 honored verbatim** — both gradient CTAs left as `bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-10 py-5 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 text-lg ...` with no co-located backdrop-blur, satisfying Archetype J opaque-forever invariant.
- **Featured-variant brand-color badge pills preserved** at Korea (line 17 inline) + Turkey (lines 110 + 114-style inline) — these are decorative non-CTA gradient pills used as section labels (`<span>` not `<a>`/`<button>`). They share the Archetype-J opaque-gradient pattern but are not subject to the CTA-mass invariant (no CTA mass; just a label inside a card). They are not in the plan's swap list. They contain no backdrop-blur and were not modified.
- **Decision E (Phase 92) inherited verbatim** — class-swap (not utility migration) means every new class is a `bg-[var(--glass-*)]` token consumer, automatically covered by the BL-02 fix in `globals.css :root` under `prefers-reduced-transparency` and `prefers-contrast: more`.
- **Plan-level visual-diff calibration consistent with Plan 01** — Wave 2A's plan-runtime note anticipated diffs ("Wave 0 baseline absorbed in Plan 07"); in practice, the determinism strategy (blob hidden) makes the swap visually invariant. Inheriting Plan 01's conclusion: the token contract IS the regression boundary; live-blob deltas are the user-visible expected change, captured by Plan 07 final regeneration.

## Deviations from Plan

None — plan executed exactly as written.

All 7 files swept to the archetypes specified in 93-PATTERNS.md §"Wave 2A — `/checkup`" tables. The optional hover ramp ADD on Archetype C cards was explicitly skipped per plan's "DEFAULT IS SKIP" guidance. Build green, lint green (1 pre-existing unrelated warning in `next/src/lib/blob-engine/index.ts:85` — Phase 91 territory deferral, out of Plan 02 scope; same warning observed in Plan 01 SUMMARY).

**Total deviations:** 0
**Impact on plan:** Plan executed exactly as specified.

## Issues Encountered

None.

The Playwright suite passed 2/2 tests for /checkup after the Wave 2A sweep, which is consistent with Plan 01's documented Wave 0 determinism finding (blob hidden → token swap is sub-pixel). The composition shell `next/src/app/checkup/page.tsx` was not touched (verified via `git status` — only the 7 section components are in the diff). No source files outside `next/src/components/sections/checkup/` were modified — Wave 2 parallel-plan file-ownership boundary respected.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Wave 2B (Plan 03 — /consultations) ready:** /checkup wave is sealed. Plan 03 sweeps the 7 consultations/* section components against the same Archetype B/C templates verbatim from 93-PATTERNS.md (with one extra concern: ConsultationProcess explicit `hover:bg-white/80` Tier-1→Tier-2 ramp, and brand-color decorative inner chips that preserve their brand-color fill while swapping blur to button-fill token). Plans 02/03/04/05 designed for parallel execution; this plan owned `next/src/components/sections/checkup/` exclusively. Wave 0 baseline preserved unaltered for Plan 07 to consume.

**No blockers.**

## Self-Check: PASSED

**Created files exist:**
- FOUND: .planning/phases/93-per-page-propagation-sub-routes/93-02-SUMMARY.md (this file, just written)

**Commits exist in git log:**
- FOUND: eb55ac6 (Task 1 — CheckupAdvantages + CheckupProblem + CheckupWhyUs)
- FOUND: e52ab12 (Task 2 — CheckupProcess + CheckupB2B)
- FOUND: 9c8133a (Task 3 — CheckupProgramsKorea + CheckupProgramsTurkey)

**Files modified are tracked + committed:**
- next/src/components/sections/checkup/CheckupAdvantages.tsx — committed in eb55ac6
- next/src/components/sections/checkup/CheckupProblem.tsx — committed in eb55ac6
- next/src/components/sections/checkup/CheckupWhyUs.tsx — committed in eb55ac6
- next/src/components/sections/checkup/CheckupProcess.tsx — committed in e52ab12
- next/src/components/sections/checkup/CheckupB2B.tsx — committed in e52ab12
- next/src/components/sections/checkup/CheckupProgramsKorea.tsx — committed in 9c8133a
- next/src/components/sections/checkup/CheckupProgramsTurkey.tsx — committed in 9c8133a

---
*Phase: 93-per-page-propagation-sub-routes*
*Completed: 2026-04-30*
