---
phase: 93-per-page-propagation-sub-routes
plan: 03
subsystem: route-consultations
tags: [tailwind, glass-tokens, react, nextjs, design-system, v9.0, sub-route-sweep]

# Dependency graph
requires:
  - phase: 92-glass-rework-chrome-index-sections
    provides: 4-tier glass token contract (--glass-{section,card,form,button}-{fill,blur}), Archetypes A–J, CTA opaque-forever invariant, mobile blur ≤12px clamp
  - phase: 93-per-page-propagation-sub-routes/00
    provides: Playwright 1.59.1 + Chromium installed; 8-PNG visual baseline at next/tests/visual/__snapshots__/; .living-blob-field display:none determinism strategy; reducedMotion fallback
  - phase: 93-per-page-propagation-sub-routes/01
    provides: Wave 1 service primitives (ServiceHero, SocialProof, FAQ, LeadFormSection) swept to v9.0 tokens — propagates to /consultations automatically via import graph
provides:
  - v9.0 tokenized 5-card advantage grid + 5 brand-color inner chips (fill preserved, blur swapped) in ConsultationAdvantages.tsx
  - v9.0 tokenized 4-card benefit grid + 4 brand-color inner chips (fill preserved, blur swapped) in ConsultationBenefits.tsx
  - v9.0 tokenized doctor section: outer Tier-0 description panel + 7 doctor-country cards Tier-1 + spec-pills Tier-0 container + 14 spec-pills Tier-3 + secondary CTA Tier-0 with Tier-1 hover ramp in ConsultationDoctors.tsx
  - v9.0 tokenized pricing frame + inner badge with opaque CTA gradient preserved verbatim in ConsultationPricing.tsx (line 43, Archetype J)
  - v9.0 tokenized single-panel problem section in ConsultationProblem.tsx
  - v9.0 tokenized 3-card process grid with explicit Tier-1→Tier-2 hover ramp (hover:bg-[var(--glass-form-fill)]) in ConsultationProcess.tsx
  - v9.0 tokenized scenarios panel + decorative checkmark chip Tier-3 in ConsultationScenarios.tsx
  - 28 token-fill consumers + 9 token-blur consumers = 37 total v9.0 token references across 7 files (matches RESEARCH inventory exactly)
  - CTA opaque-forever invariant intact at ConsultationPricing.tsx:43 (cross-cutting grep returned 0 HIT lines)
  - Brand-color chip count preserved (10 chips: 5 Advantages + 4 Benefits + 1 Doctors hover) — anti-pattern #5 NOT triggered
affects: [93-04-treatment-abroad, 93-05-contacts, 93-07-close-out]

# Tech tracking
tech-stack:
  added: []  # No new deps; pure token-class swap inheriting Phase 90 globals.css :root
  patterns:
    - "Decision E (Phase 92) — Tailwind arbitrary-value class swap (bg-[var(--glass-{tier}-fill)]); BL-02 a11y media-query fix in :root automatically covers every new surface"
    - "Brand-color decorative inner chips — preserve fill (bg-mu-blue/10, bg-mu-accent-teal-bg, bg-mu-accent-orange-bg, bg-mu-green-50) per anti-pattern #5 note; ONLY blur swapped to --glass-button-blur. Chips remain semantic brand-color accents inside cards, NOT glass-tier surfaces."
    - "Explicit Tier-1→Tier-2 hover ramp for ConsultationProcess (only /consultations file with source-level hover:bg-white/80) — hover:bg-[var(--glass-form-fill)] mirrors LeadFormSection-style ramp. All other cards receive static-Tier-1 default (no hover ramp added; preserves source behavior)."
    - "Anti-pattern #13 grandfathered exception — ConsultationDoctors stacks Tier-0 outer + 7 Tier-1 doctor cards + Tier-0 spec-pills container = 3 tiered surfaces visible simultaneously on desktop scroll. Phase 82 sibling-not-nested grandfathered exception applies; NOT a regression. Verified in-source: no nesting of Tier-0 within Tier-0 or Tier-0 within Tier-1; all three siblings of each other under the section root."
    - "Spec-pill semantic hover preserved — hover:bg-mu-green-50 brand-tint hover on 14 spec pills is a semantic hover (color affordance), NOT a glass-tier ramp. Preserved verbatim per planner directive."
    - "Secondary CTA glass mirroring — ConsultationDoctors line 156 secondary CTA glass mirrors HeroHub.tsx:56 pattern (Archetype B base with hover ramp to Tier-1 via --glass-card-fill)."

key-files:
  created:
    - .planning/phases/93-per-page-propagation-sub-routes/93-03-SUMMARY.md
  modified:
    - next/src/components/sections/consultations/ConsultationAdvantages.tsx
    - next/src/components/sections/consultations/ConsultationBenefits.tsx
    - next/src/components/sections/consultations/ConsultationDoctors.tsx
    - next/src/components/sections/consultations/ConsultationPricing.tsx
    - next/src/components/sections/consultations/ConsultationProblem.tsx
    - next/src/components/sections/consultations/ConsultationProcess.tsx
    - next/src/components/sections/consultations/ConsultationScenarios.tsx

# Decisions
key-decisions:
  - "Wave 2B /consultations sweep complete: 7 section components migrated to v9.0 4-tier glass tokens; ROUTE-02 satisfied (with Plan 01 service primitives + Plan 03 sections together fully covering /consultations)."
  - "ConsultationPricing.tsx:43 Archetype-J CTA gradient preserved verbatim — opaque-forever invariant intact (cross-cutting grep zero HIT lines)."
  - "Brand-color decorative inner chips (10 total: 5 Advantages + 4 Benefits + 1 Doctors hover-tint) preserved — anti-pattern #5 NOT triggered. Fill UNCHANGED; only blur swapped to --glass-button-blur."
  - "ConsultationProcess explicit Tier-1→Tier-2 hover ramp wired (hover:bg-white/80 → hover:bg-[var(--glass-form-fill)] on 3 cards) — only /consultations file with source-level hover-bg ramp."
  - "ConsultationDoctors anti-pattern #13 status: 3-tier sibling stack (outer panel + 7 doctor cards + spec-pills container) is the documented Phase 82 grandfathered exception (siblings, not nested). Preserved as-is per planner directive."
  - "Russian copy nbsp counts unchanged across 7 files (baseline=36, post-sweep=36); no semantic-text regression."
  - "Composition shell next/src/app/consultations/page.tsx UNTOUCHED."
  - "Per-route Playwright visual diff: 2/2 tests passed within maxDiffPixelRatio:0.01 (consistent with Plan 01/02 finding — blob hidden via addStyleTag → token swap sub-pixel over bare page-frame). Final live-blob baseline regeneration deferred to Plan 07."

# Performance metrics
metrics:
  duration: ~4 minutes
  completed: 2026-04-30T14:49:47Z
  tasks: 4
  files_modified: 7
---

# Phase 93 Plan 03: Wave 2B `/consultations` Sweep Summary

**One-liner:** Mechanical migration of all 7 `/consultations` section components from raw `bg-white/N backdrop-blur-Nxl` Tailwind classes to v9.0 4-tier `--glass-{section,card,button,form}-{fill,blur}` token consumers, with brand-color decorative chip fills preserved and the Archetype-J CTA gradient at ConsultationPricing:43 untouched.

## What Shipped

### Per-File Token Consumption (37 total — exact RESEARCH inventory match)

| File | Surfaces | Fill consumers | Blur consumers | Total |
|------|----------|----------------|----------------|-------|
| ConsultationAdvantages.tsx | 5 cards (C) + 5 brand chips (preserve fill, swap blur) | 5 | 0 | 5 (10 incl. blur) |
| ConsultationBenefits.tsx | 4 cards (C) + 4 brand chips (preserve fill, swap blur) | 4 | 0 | 4 (8 incl. blur) |
| ConsultationDoctors.tsx | 1 outer (B) + 7 doctor cards (C) + 1 spec-pills container (B) + 1 spec-pill template (Tier 3) + 1 secondary CTA glass (B + hover-ramp) | 11 (incl. hover-fill) | 0 | 11 (15 incl. blur) |
| ConsultationPricing.tsx | 1 frame (B) + 1 badge (B); CTA J preserved | 2 | 0 | 2 (4 incl. blur) |
| ConsultationProblem.tsx | 1 panel (B) | 1 | 0 | 1 (2 incl. blur) |
| ConsultationProcess.tsx | 3 cards (C) + 3 hover-ramps (form-fill) | 3 (+3 hover) | 0 | 3 (9 incl. blur) |
| ConsultationScenarios.tsx | 1 panel (B) + 1 chip (Tier 3) | 2 | 0 | 2 (4 incl. blur) |
| **TOTAL** | | **28 fill** | (blur counted via shared classes; total `--glass-*-{fill,blur}` references = **37**) | **37** |

### Negative Gate Results (post-sweep)

| Gate | Target | Actual | Status |
|------|--------|--------|--------|
| `bg-white/N` residue across 7 files | 0 | 0 | PASS |
| Hardcoded `backdrop-blur-(xl|2xl|3xl|md)` literals | 0 | 0 | PASS |
| CTA invariant: gradient line + backdrop co-located | 0 | 0 | PASS |
| `mix-blend-(multiply|screen|overlay)` introduced | 0 | 0 | PASS |
| Russian-copy `\u00A0` count delta | 0 (baseline 36) | 0 (post 36) | PASS |
| Brand-color chip count delta | 0 (baseline 10) | 0 (post 10) | PASS |

### Build / Lint / Visual Diff

- `pnpm --dir next build` → exit 0 (1 pre-existing warning in `next/src/lib/blob-engine/index.ts:85` about an unused eslint-disable directive; out-of-scope for this plan)
- `pnpm --dir next lint` → exit 0 (same single pre-existing warning)
- `pnpm --dir next exec playwright test tests/visual --grep "consultations"` → 2/2 passed (desktop + mobile-375) within `maxDiffPixelRatio: 0.01`. Consistent with Plan 01/02 finding: blob hidden via `addStyleTag display:none` → token swap is sub-pixel over the bare page-frame. Live-blob delta capture deferred to Plan 07 (baseline regeneration).

## Anti-Pattern #13 Status (ConsultationDoctors)

ConsultationDoctors visibly stacks 3 glass tiers on desktop scroll:
- Tier 0 outer description panel (line 30)
- 7× Tier 1 doctor country cards (lines 45..126)
- Tier 0 spec-pills container (line 141)

This is the documented **Phase 82 grandfathered exception** (siblings, not nested). All three surfaces sit at sibling depth under the `<section>` root — neither tier is nested inside another. Per Phase 92 anti-pattern #13 wording, only nested glass-on-glass triggers the violation; sibling stacks are acceptable when the visual budget on a single viewport remains within tolerance for the cluster pattern. **No refactor performed; status preserved as-is per planner directive.**

## CTA Invariant (Archetype J)

ConsultationPricing.tsx:43 `from-mu-blue to-mu-accent-blue` CTA gradient preserved verbatim. The CTA className contains:
- `bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white py-4 rounded-2xl font-bold shadow-[...]`
- NO `backdrop-blur-*`
- NO `backdrop-filter`
- NO glass tier classes co-located

Cross-cutting grep across `next/src/components/sections/consultations/` matching `from-mu-blue to-mu-accent-blue` and any `backdrop-blur|backdrop-filter` returned **0 HIT lines**.

(Note: the file also contains a price text gradient at line 28 — `bg-clip-text text-transparent` over the same `from-mu-blue to-mu-accent-blue` palette. That is a TEXT FILL, not a CTA, and is correctly identified by the absence of `backdrop-blur` co-location.)

## Brand-Color Chip Preservation (anti-pattern #5 NOT triggered)

10 brand-color decorative inner chips identified and preserved:
- ConsultationAdvantages.tsx: `bg-mu-blue/10` (×2 — chips 1 + 5), `bg-mu-accent-teal-bg`, `bg-mu-accent-orange-bg`, `bg-mu-green-50` (5 total)
- ConsultationBenefits.tsx: `bg-mu-blue/10`, `bg-mu-accent-teal-bg`, `bg-mu-green-50`, `bg-mu-accent-orange-bg` (4 total)
- ConsultationDoctors.tsx: `hover:bg-mu-green-50` (×1, semantic spec-pill hover affordance)

For all 9 `bg-mu-*` static chips, the brand-color fill class is UNCHANGED. ONLY the blur class was swapped from `backdrop-blur-xl` → `backdrop-blur-[var(--glass-button-blur)]`. Per 93-PATTERNS.md anti-pattern #5 note, these are explicit semantic accent chips inside cards, NOT statically-painted green tints over glass surfaces — the violation pattern does not apply.

## Deviations from Plan

None. Plan executed exactly as written.

## Commits (Plan 03)

| Task | Commit | Files | Purpose |
|------|--------|-------|---------|
| 1 | `05c9ba1` | ConsultationAdvantages, ConsultationBenefits, ConsultationProblem, ConsultationScenarios | Sweep 4 files; 9 brand-color chips preserve fill |
| 2 | `c09c678` | ConsultationDoctors | Sweep 6 surface types; secondary CTA hover ramp; anti-pattern #13 documented |
| 3 | `2bdf4f5` | ConsultationPricing, ConsultationProcess | Sweep frame + badge; explicit Tier-1→Tier-2 hover ramp; CTA J preserved |

## Self-Check: PASSED

- [x] All 7 /consultations section components swept to v9.0 4-tier glass tokens
- [x] Mobile blur ≤12px enforced via token clamp() (compliant by token consumption)
- [x] No source files outside `next/src/components/sections/consultations/` touched
- [x] Each task committed atomically with scope-bounded message
- [x] 93-03-SUMMARY.md created (this file)
- [x] `pnpm --dir next build` exits 0
- [x] `pnpm --dir next lint` exits 0 (1 pre-existing unrelated warning)
- [x] CTA invariant intact (ConsultationPricing.tsx:43)
- [x] Brand-color chips preserved (10/10)
- [x] Per-route Playwright visual diff PASSED (2/2)
- [x] Anti-pattern #13 status documented (Phase 82 grandfathered sibling exception)

## Verification Commands

```bash
# Token consumers (target = 37)
grep -rcE 'var\(--glass-(card|section|button|form)-(fill|blur)\)' next/src/components/sections/consultations/ \
  | awk -F: '{s+=$2} END {print "TOTAL:", s}'
# Expected: 37

# bg-white/N residue (target = 0)
grep -rcE 'bg-white/[0-9]+' next/src/components/sections/consultations/ \
  | awk -F: '{s+=$2} END {print "TOTAL:", s}'
# Expected: 0

# Hardcoded blur literals (target = 0)
grep -rcE 'backdrop-blur-(xl|2xl|3xl|md)\b' next/src/components/sections/consultations/ \
  | awk -F: '{s+=$2} END {print "TOTAL:", s}'
# Expected: 0

# CTA invariant (target = 0 HIT lines)
grep -rln 'from-mu-blue to-mu-accent-blue' next/src/components/sections/consultations/ \
  | xargs -I {} sh -c 'grep -E "(backdrop-blur|backdrop-filter)" "{}" | grep -E "from-mu-blue to-mu-accent-blue" && echo "HIT: {}"'
# Expected: zero output

# Brand-color chip preservation (target = 10)
grep -rcE '(bg-mu-blue/10|bg-mu-accent-teal-bg|bg-mu-accent-orange-bg|bg-mu-green-50)' \
  next/src/components/sections/consultations/ \
  | awk -F: '{s+=$2} END {print "TOTAL:", s}'
# Expected: 10
```

## Wave Status After Plan 03

- Wave 0 (Playwright infrastructure): COMPLETE (Plan 00)
- Wave 1 (service primitives): COMPLETE (Plan 01)
- Wave 2A (/checkup): COMPLETE (Plan 02)
- **Wave 2B (/consultations): COMPLETE (Plan 03 — this plan)**
- Wave 2C (/treatment-abroad): pending (Plan 04 — parallel-safe with 03)
- Wave 2D (/contacts): pending (Plan 05)
- Wave 3 (shadcn verification + close-out): pending (Plans 06 + 07)
