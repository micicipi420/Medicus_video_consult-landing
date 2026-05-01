---
phase: 93-per-page-propagation-sub-routes
plan: 04
subsystem: route-treatment-abroad
tags: [tailwind, glass-tokens, react, nextjs, design-system, v9.0, sub-route-sweep, main-offer]

# Dependency graph
requires:
  - phase: 92-glass-rework-chrome-index-sections
    provides: 4-tier glass token contract (--glass-{section,card,form,button}-{fill,blur}), Archetypes A–J, CTA opaque-forever invariant, mobile blur ≤12px clamp
  - phase: 93-per-page-propagation-sub-routes/00
    provides: Playwright 1.59.1 + Chromium installed; 8-PNG visual baseline at next/tests/visual/__snapshots__/; .living-blob-field display:none determinism strategy
  - phase: 93-per-page-propagation-sub-routes/01
    provides: Wave 1 service primitives (ServiceHero, SocialProof, FAQ, LeadFormSection) swept to v9.0 tokens — propagates to /treatment-abroad automatically via import graph
provides:
  - v9.0 tokenized 4-card about-us grid + 4 decorative inner icon chips Tier-3 in TreatmentAboutUs.tsx
  - v9.0 tokenized 8-country card grid (8 identical Archetype C cards) in TreatmentClinics.tsx
  - v9.0 tokenized review card wrapper with data-driven `review.gradient` ribbon UNTOUCHED in TreatmentReviews.tsx
  - v9.0 tokenized 4-step section panels in TreatmentSteps.tsx
  - 21 token-fill consumers across 4 files (matches RESEARCH inventory exactly: 4+4 AboutUs + 4 Steps + 8 Clinics + 1 Reviews = 21)
  - CTA invariant intact — no Archetype-J CTAs in /treatment-abroad files (route CTAs delegated to shared LeadFormSection from Plan 01 + FinalCTA from Phase 92)
affects: [93-05-contacts, 93-06-shadcn, 93-07-close-out]

# Tech tracking
tech-stack:
  added: []  # No new deps; pure token-class swap inheriting Phase 90 globals.css :root
  patterns:
    - "Decision E (Phase 92) — Tailwind arbitrary-value class swap (bg-[var(--glass-{tier}-fill)]); BL-02 a11y media-query fix in :root automatically covers every new surface"
    - "Data-driven decorative gradient preservation — TreatmentReviews `review.gradient` field consumed by avatar `<span>` (line 46) with `bg-gradient-to-br ${review.gradient}` is NOT a CTA. The avatar lacks any backdrop-blur or glass-tier surface; the gradient is a brand-color decoration, NOT subject to opaque-forever invariant. Threat T-93-04-02 mitigated."
    - "TreatmentClinics 8-card replace_all — 8 country cards (Австрия, Германия, Швейцария, Израиль, Индия, ОАЭ, Турция, Южная Корея) share an identical className string; `replace_all` semantics swept all 8 in one Edit call. Threat T-93-04-03 mitigated (acceptance gate `bg-[var(--glass-card-fill)]` count = 8)."
    - "Static-Tier-1 default — no source file in this plan had a `hover:bg-white/N` ramp; sweep preserved this. None of the 4 components received a hover ramp addition (consistent with planner discretion in Plans 02/04)."

key-files:
  created:
    - .planning/phases/93-per-page-propagation-sub-routes/93-04-SUMMARY.md
  modified:
    - next/src/components/sections/treatment/TreatmentAboutUs.tsx
    - next/src/components/sections/treatment/TreatmentClinics.tsx
    - next/src/components/sections/treatment/TreatmentReviews.tsx
    - next/src/components/sections/treatment/TreatmentSteps.tsx

# Decisions
key-decisions:
  - "Wave 2C /treatment-abroad sweep complete: 4 section components migrated to v9.0 4-tier glass tokens; ROUTE-03 satisfied (with Plan 01 service primitives + Plan 04 sections together fully covering /treatment-abroad — the MAIN OFFER route)."
  - "No Archetype-J CTA in /treatment-abroad files — route-level CTA delegated to shared LeadFormSection (Plan 01) and FinalCTA (Phase 92, frozen). Cross-cutting line-level grep returned 0 co-located gradient+backdrop hits."
  - "TreatmentReviews data-driven `review.gradient` field UNTOUCHED — 4 entries in REVIEWS array preserve their decorative avatar gradients verbatim (from-mu-blue, from-mu-green-500, from-mu-accent-teal, from-mu-accent-orange). Avatar `<span>` on line 46 carries no backdrop-blur, confirming non-CTA classification."
  - "TreatmentAboutUs decorative inner icon chips (4) routed to Tier 3 (--glass-button-fill/blur) per plan — distinct from card Tier 1, matching Phase 92 LeadFormSection GlassCheckmark template."
  - "TreatmentClinics 8 country cards swept atomically via Edit replace_all — all 8 confirmed via grep count; no partial sweep regression."
  - "Russian copy nbsp counts unchanged across all 4 files (baseline AboutUs=6 / Steps=6 / Clinics=3 / Reviews=7; post-sweep identical); no semantic-text regression."
  - "Composition shell next/src/app/treatment-abroad/page.tsx UNTOUCHED."
  - "Per-route Playwright visual diff: 2/2 tests passed within maxDiffPixelRatio:0.01 (consistent with Plans 01/02/03 finding — blob hidden via addStyleTag → token swap sub-pixel over bare page-frame). Final live-blob baseline regeneration deferred to Plan 07."

# Performance metrics
metrics:
  duration: ~4 minutes
  completed: 2026-04-30T14:57:55Z
  tasks: 3
  files_modified: 4
---

# Phase 93 Plan 04: Wave 2C `/treatment-abroad` Sweep Summary

**One-liner:** Mechanical migration of all 4 `/treatment-abroad` section components (the main-offer route) from raw `bg-white/N backdrop-blur-Nxl` Tailwind classes to v9.0 4-tier `--glass-{section,card,button,form}-{fill,blur}` token consumers, with the data-driven `review.gradient` decorative avatar field preserved verbatim and zero Archetype-J CTAs in scope.

## What Shipped

### Per-File Token Consumption (21 total — exact RESEARCH inventory match)

| File | Surfaces swept | Tier 1 (--glass-card-fill) | Tier 3 (--glass-button-fill) | Total fill consumers |
|------|---------------|-----|-----|-----|
| TreatmentAboutUs.tsx | 4 cards (Archetype C) + 4 inner chips (decorative inner) | 4 | 4 | 8 |
| TreatmentClinics.tsx | 8 country cards (Archetype C, identical className) | 8 | 0 | 8 |
| TreatmentReviews.tsx | 1 review card wrapper (Archetype C; data-driven avatar gradient preserved) | 1 | 0 | 1 |
| TreatmentSteps.tsx | 4 step section panels (Archetype C) | 4 | 0 | 4 |
| **Total** | | **17** | **4** | **21** |

### CTA Opaque-Forever Invariant — Status: INTACT

No Archetype-J CTAs exist in `next/src/components/sections/treatment/`. Route-level CTAs are delegated:
- Lead-capture CTA → shared `LeadFormSection` (covered by Plan 01)
- Below-fold CTA → shared `FinalCTA` (Phase 92 territory, frozen)

Cross-cutting **line-level** grep:
```
grep -nE "from-mu-blue to-mu-accent-blue" next/src/components/sections/treatment/TreatmentReviews.tsx \
  | grep -E "(backdrop-blur|backdrop-filter)" | wc -l
→ 0
```

The file-level grep produces an apparent "HIT" because both substrings appear in TreatmentReviews.tsx — but on **different lines**:
- Line 6: `gradient: 'from-mu-blue to-mu-accent-blue',` (data array entry)
- Line 43: `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` (review card wrapper)
- Line 46: `bg-gradient-to-br ${review.gradient}` (avatar `<span>` — NO backdrop-blur)

This is the documented edge case in `93-04-PLAN.md` Task 3 ("`from-mu-blue to-mu-accent-blue` lives inside a data array, not a glass-tier className"). Threat **T-93-04-02 explicitly mitigated**.

### Data Preservation — TreatmentReviews `review.gradient`

| Reviewer | Avatar gradient | Touched? |
|----------|-----------------|----------|
| Ренат | `from-mu-blue to-mu-accent-blue` | NO |
| Жанна | `from-mu-green-500 to-mu-green-600` | NO |
| Андрей | `from-mu-accent-teal to-mu-green-600` | NO |
| Арина | `from-mu-accent-orange to-mu-accent-red` | NO |

`grep -c 'review.gradient' next/src/components/sections/treatment/TreatmentReviews.tsx` → **1** (JSX consumer at line 46 still references the data field).

### TreatmentClinics — 8/8 Country Cards Swept

| # | Country | Line (pre-sweep) | Card swept |
|---|---------|------------------|------------|
| 1 | Австрия | 15 | YES |
| 2 | Германия | 32 | YES |
| 3 | Швейцария | 50 | YES |
| 4 | Израиль | 66 | YES |
| 5 | Индия | 86 | YES |
| 6 | ОАЭ | 105 | YES |
| 7 | Турция | 123 | YES |
| 8 | Южная Корея | 142 | YES |

`grep -c 'bg-\[var(--glass-card-fill)\]' next/src/components/sections/treatment/TreatmentClinics.tsx` → **8**. Threat **T-93-04-03 mitigated**.

### Russian Copy / nbsp Regression Check

| File | Baseline `\u00A0` count | Post-sweep | Delta |
|------|------------------------|------------|-------|
| TreatmentAboutUs.tsx | 6 | 6 | 0 |
| TreatmentSteps.tsx | 6 | 6 | 0 |
| TreatmentClinics.tsx | 3 | 3 | 0 |
| TreatmentReviews.tsx | 7 | 7 | 0 |

Zero semantic-text regression.

### Heading Text Gradients — Untouched

Three heading text-fill gradients preserved verbatim (NEVER swept per CLAUDE.md design contract + plan rule):
- `TreatmentAboutUs.tsx:5` — `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent`
- `TreatmentSteps.tsx:11` — same pattern
- `TreatmentReviews.tsx:36` — same pattern

### Build / Lint / Visual

| Gate | Result |
|------|--------|
| `pnpm --dir next build` | exit 0 |
| `pnpm --dir next lint` | 0 errors, 1 pre-existing warning in `lib/blob-engine/index.ts:85` (unused eslint-disable directive — out of scope per `<deviation_rules>` SCOPE BOUNDARY) |
| `pnpm --dir next exec playwright test tests/visual --grep "treatment-abroad"` | **2/2 passed** (desktop + mobile-375) within `maxDiffPixelRatio:0.01` |

Visual diff is informational for Plan 07 (live-blob baseline regen). Consistent with Plans 01/02/03: blob is hidden via `addStyleTag display:none`, so token swap is sub-pixel within tolerance.

### Composition Shell

`next/src/app/treatment-abroad/page.tsx` — UNTOUCHED (per planner constraint; no glass surfaces in shell).

## Anti-Pattern Status

| # | Anti-pattern | Status |
|---|-------------|--------|
| #4 | fills > 0.16 without sanction | OK — only KD-v9-002 sanctioned form fills exist; this plan touched only Tier 1/Tier 3 |
| #5 | green tint on cards | OK — TreatmentSteps brand-color tint chips (`bg-mu-blue/10`, `bg-mu-accent-teal-bg`, `bg-mu-accent-orange-bg`, `bg-mu-green-50`) are pill-shaped duration badges inside cards, not green-on-card surfaces |
| #6 | animated `backdrop-filter` | OK — no `transition-[...,backdrop-filter,...]` in any swept className |
| #8 | `mix-blend-mode` on glass | OK — `grep -rciE 'mix-blend-(multiply|screen|overlay)' next/src/components/sections/treatment/` → 0 |
| #11 | `backdrop-filter` on `.living-blob-field` | N/A — this plan doesn't touch blob field |
| #12 | mobile blur > 12px | OK — token clamp() enforces; zero hardcoded blur literals after sweep |
| #13 | >2 glass layers per viewport | OK — TreatmentClinics 8-card grid is sibling-not-nested (Phase 82 grandfathered exception); TreatmentAboutUs 4-card + inner-chip is acceptable nesting (Tier-1 outer + Tier-3 inner = 2 levels, within budget) |
| #14 | new glass class without a11y registration | OK — Decision E class-swap, no new utility |
| #15 | cheat-passing a11y | OK — no a11y branch verification claimed; deferred to Phase 94 hard gate |

## Deviations from Plan

None — plan executed exactly as written. All 3 tasks completed:
- Task 1: TreatmentAboutUs (4 cards Tier 1 + 4 chips Tier 3) + TreatmentSteps (4 panels Tier 1) — committed `928ca58`
- Task 2: TreatmentClinics (8 cards Tier 1) + TreatmentReviews (1 card Tier 1; `review.gradient` data preserved) — committed `0839e81`
- Task 3: Wave-end gates — verification only, no commit

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| 1 | sweep TreatmentAboutUs + TreatmentSteps | `928ca58` |
| 2 | sweep TreatmentClinics + TreatmentReviews | `0839e81` |

## Acceptance Gates — All Passed

**Positive gates:**
- ✅ `grep -rcE 'bg-\[var\(--glass-(card|section|button)-fill\)\]' next/src/components/sections/treatment/` = 21 (≥21 required)

**Negative gates:**
- ✅ `grep -rcE 'bg-white/[0-9]+' next/src/components/sections/treatment/` = 0
- ✅ `grep -rcE 'backdrop-blur-(xl|2xl|3xl|md)' next/src/components/sections/treatment/` = 0
- ✅ Line-level CTA invariant: 0 co-located gradient+backdrop hits
- ✅ TreatmentReviews data preservation: `grep -c 'review.gradient' …` = 1
- ✅ No `mix-blend-*` introduced

**Build gates:**
- ✅ `pnpm --dir next build` exit 0
- ✅ `pnpm --dir next lint` exit 0 (0 errors; 1 pre-existing unrelated warning)
- ✅ Playwright `/treatment-abroad` visual: 2/2 passed

## Threat Surface Scan

No new security-relevant surface introduced. All changes are CSS class swaps — no new network endpoints, auth paths, file access, or schema changes. Threat register from `93-04-PLAN.md` (T-93-04-01 through T-93-04-04) all mitigated as planned.

## Self-Check: PASSED

- ✅ `next/src/components/sections/treatment/TreatmentAboutUs.tsx` exists and modified
- ✅ `next/src/components/sections/treatment/TreatmentClinics.tsx` exists and modified
- ✅ `next/src/components/sections/treatment/TreatmentReviews.tsx` exists and modified
- ✅ `next/src/components/sections/treatment/TreatmentSteps.tsx` exists and modified
- ✅ Commit `928ca58` exists in `git log --oneline`
- ✅ Commit `0839e81` exists in `git log --oneline`
- ✅ All 21 token consumers verified via grep
- ✅ All negative gates verified via grep (zero hits)
- ✅ `pnpm build` + `pnpm lint` + Playwright `/treatment-abroad` all green
