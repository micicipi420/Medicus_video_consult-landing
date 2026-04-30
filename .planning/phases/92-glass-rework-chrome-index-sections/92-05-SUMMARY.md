---
phase: 92-glass-rework-chrome-index-sections
plan: 05
subsystem: ui-glass-tokens
tags:
  - glass-tier-sweep
  - mid-section
  - wave-3
  - v9.0-tokens
requires:
  - 92-01 (token contract)
  - 92-03 (chrome sweep)
  - 92-04 (above-fold sweep)
provides:
  - mid-section-tier-1-cards
  - mid-section-tier-0-frames
  - brand-color-decorative-chip-pattern-applied
affects:
  - next/src/components/sections/ProcessSection.tsx
  - next/src/components/sections/ProblemSection.tsx
  - next/src/components/sections/WhyUsSection.tsx
  - next/src/components/sections/ClinicsSection.tsx
  - next/src/components/sections/PlatformSection.tsx
  - next/src/components/sections/ReviewsSection.tsx
tech-stack:
  added: []
  patterns:
    - "Tier 1 → Tier 2 hover ramp via hover:bg-[var(--glass-form-fill)] (parity with ServicesGrid)"
    - "Brand-color decorative chip: keep ${color} fill, tokenize blur to var(--glass-button-blur)"
key-files:
  created:
    - .planning/phases/92-glass-rework-chrome-index-sections/92-05-SUMMARY.md
  modified:
    - next/src/components/sections/ProcessSection.tsx
    - next/src/components/sections/ProblemSection.tsx
    - next/src/components/sections/WhyUsSection.tsx
    - next/src/components/sections/ClinicsSection.tsx
    - next/src/components/sections/PlatformSection.tsx
    - next/src/components/sections/ReviewsSection.tsx
decisions:
  - "Brand-color advantage chips and problem-card icon chips preserve their data-driven brand-color iconBg interpolation; only the hardcoded backdrop-blur-{md,xl,2xl} migrates to var(--glass-button-blur). Anti-pattern #5 (green-tint-on-card) NOT triggered — these are colored icon chips inside cards, not card surfaces themselves."
  - "Cards with hover state (Process/Problem/Clinics/Reviews) gain hover:bg-[var(--glass-form-fill)] for visual parity with ServicesGrid Tier 1 → Tier 2 ramp."
metrics:
  duration: ~12min
  completed: 2026-04-30
---

# Phase 92 Plan 05: Mid-section glass-tier sweep Summary

Swept 6 mid-page section components (ProcessSection, ProblemSection, WhyUsSection, ClinicsSection, PlatformSection, ReviewsSection) from direct Tailwind opacity classes (`bg-white/{20,40,55,60,65}`) and hardcoded blurs (`backdrop-blur-{md,xl,2xl}`) to v9.0 tier-token arbitrary-value classes per Plan 92-PATTERNS.md per-line tables — Tier 1 cards default + Tier 2 hover ramp where applicable, Tier 0 frames, Tier 3 inner chips. Brand-color decorative chips kept their data-driven brand fill while tokenizing blur for consistency.

## Tasks Executed

| Task | Files | Commit |
|------|-------|--------|
| 1 | ProcessSection.tsx, ProblemSection.tsx | 58971bf |
| 2 | WhyUsSection.tsx | 0340ee6 |
| 3a | ClinicsSection.tsx, PlatformSection.tsx | cb9fb1f |
| 3b | ReviewsSection.tsx | 4eb30c0 |

## Per-file Migrations

### ProcessSection.tsx
- Step card (line 107): `bg-white/65 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` + ADDED `hover:bg-[var(--glass-form-fill)]` (Tier 2 hover ramp).
- Inner icon chip (line 117): `bg-white/55 backdrop-blur-md` → `bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)]`.

### ProblemSection.tsx
- Problem card (line 102): `bg-white/60 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` + ADDED `hover:bg-[var(--glass-form-fill)]`.
- Inner icon chip (line 105): `${card.iconBg} backdrop-blur-xl` → `${card.iconBg} backdrop-blur-[var(--glass-button-blur)]` (brand-color iconBg PRESERVED).

### WhyUsSection.tsx
- Section pill (line 13): `bg-white/40 backdrop-blur-xl` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`.
- 4 advantage chips (lines 28/45/62/79): `${color} backdrop-blur-xl` → `${color} backdrop-blur-[var(--glass-button-blur)]` (brand-color tints PRESERVED: bg-mu-blue/10, bg-mu-accent-teal-bg, bg-mu-accent-orange-bg, bg-mu-green-50).
- 3 image frames (lines 99/102/107): `bg-white/20 backdrop-blur-2xl` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`.
- Stat card (line 110): `bg-white/40 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]`.

### ClinicsSection.tsx
- Country card (line 130): `bg-white/60 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` + ADDED `hover:bg-[var(--glass-form-fill)]`.

### PlatformSection.tsx
- Single panel (line 15): `bg-white/60 backdrop-blur-2xl` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`.

### ReviewsSection.tsx
- Review card (line 77): `bg-white/60 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` + ADDED `hover:bg-[var(--glass-form-fill)]`.

## Verification

- `pnpm --dir next build` exits 0 (verified after each task — final build passes 11/11 static pages).
- All grep acceptance criteria met (per-task and cross-file).
- All hardcoded `backdrop-blur-{xl,2xl,3xl}` removed from the 6 files (final sweep returns 0 across all).
- All `bg-white/{20,40,55,60,65}` removed from the 6 files.
- `&nbsp;` baselines preserved across all 6 files (ProcessSection 13, others 0 — Russian copy + nbsp binding intact).
- Brand-color tints preserved in WhyUsSection (4 distinct chips) and ProblemSection (data-driven iconBg).

## Deviations from Plan

None — plan executed exactly as written.

## Threat Model Compliance

| Threat ID | Status | Notes |
|-----------|--------|-------|
| T-92-05-01 (mobile blur DoS) | Mitigated | All sweeps consume `--glass-{tier}-blur` tokens; mobile clamp ≤12px enforced by token defs. |
| T-92-05-02 (brand-color regression) | Mitigated | Brand-color grep ≥4 in WhyUsSection; ${card.iconBg} preserved in ProblemSection. |
| T-92-05-03 (anti-pattern #5) | Accepted | Brand-color chips inside cards are sanctioned per PATTERNS.md cross-cutting rule; no static green tint applied to card surfaces. |
| T-92-05-04 (≤2 glass per viewport) | Mitigated | Sanctioned exception per RESEARCH §Anti-pattern #13: cards count as siblings of each other. |

## Self-Check: PASSED

**Files verified:**
- FOUND: next/src/components/sections/ProcessSection.tsx
- FOUND: next/src/components/sections/ProblemSection.tsx
- FOUND: next/src/components/sections/WhyUsSection.tsx
- FOUND: next/src/components/sections/ClinicsSection.tsx
- FOUND: next/src/components/sections/PlatformSection.tsx
- FOUND: next/src/components/sections/ReviewsSection.tsx

**Commits verified:**
- FOUND: 58971bf (Task 1)
- FOUND: 0340ee6 (Task 2)
- FOUND: cb9fb1f (Task 3a)
- FOUND: 4eb30c0 (Task 3b)
