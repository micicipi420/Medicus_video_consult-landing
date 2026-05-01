---
phase: 92-glass-rework-chrome-index-sections
fixed_at: 2026-04-30
review_path: .planning/phases/92-glass-rework-chrome-index-sections/92-REVIEW.md
iteration: 1
findings_in_scope: 2
fixed: 2
skipped: 0
deferred: 2
status: partial
---

# Phase 92: Code Review Fix Report

**Fixed at:** 2026-04-30
**Source review:** `.planning/phases/92-glass-rework-chrome-index-sections/92-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings reviewed by orchestrator: 4 blockers (BL-01, BL-02, BL-03, BL-04)
- Findings in scope for this fix run: 2 (BL-02, BL-03)
- Fixed: 2
- Skipped: 0
- Intentionally deferred: 2 (BL-01, BL-04 — see below)

This run is targeted: only BL-02 and BL-03 were addressed because they
are migration-tail defects directly traceable to the Phase 92 token
migration (a11y selector gap and a missed success-overlay surface).
BL-01 and BL-04 each carry independent risk profiles (filter-chain
clobbering on mobile; data-integrity / fake-success anti-bot UX) and
deserve standalone review and decisions before any fix.

## Build Verification

`pnpm --dir next build` — clean. 11 routes generated, 0 errors.
One pre-existing ESLint warning in `src/lib/blob-engine/index.ts`
(unused `no-console` disable) is unrelated to either fix.

## Fixed Issues

### BL-02: `prefers-contrast: more` and `prefers-reduced-transparency` did not cover `bg-[var(--glass-*-fill)]` consumers

**File modified:** `next/src/app/globals.css`
**Commit:** `da8d1fd` — `fix(92): close a11y selector gap for token-based glass surfaces (BL-02)`

**Approach:** Override the four glass-tier custom properties
(`--glass-section-fill`, `--glass-card-fill`, `--glass-form-fill`,
`--glass-button-fill`) at `:root` inside both media-query blocks.

Rationale for token-rewrite over per-selector matching:
- Every Phase 92 glass surface consumes one of the four tier tokens.
  Rewriting the tokens flips every consumer in a single declaration.
- Named `.liquid-*` classes and future utility consumers that resolve
  the same custom properties pick up the override automatically — no
  selector-list maintenance debt.
- `prefers-reduced-transparency` previously only zeroed `backdrop-filter`,
  leaving low-alpha (0.06–0.50) fills as near-empty rectangles. Now
  surfaces become readable opaque white at `0.92` (mirrors the
  `liquid-glass.css` fallback opacity convention).
- `prefers-contrast: more` token rewrites to fully-opaque white (`rgb(255 255 255)`),
  matching the existing `[class*="bg-white/"]` rule's intent.

Also added: `[class*="border-glass-border"]` selector inside
`prefers-contrast: more` to override token-based borders to
`rgba(0, 0, 0, 0.55)` — parity with the existing `[class*="border-white/"]` rule.

### BL-03: ContactForm success overlay was not migrated to the v9 form-fill token

**File modified:** `next/src/components/sections/ContactForm.tsx`
**Commit:** `f599af9` — `fix(92): migrate ContactForm success overlay to KD-v9-002 tokens (BL-03)`

**Change (line 111):**
- Before: `bg-white/82 … backdrop-blur-3xl`
- After:  `bg-[var(--glass-form-fill)] … backdrop-blur-[var(--glass-form-blur)]`

Positioning (`absolute inset-0 z-20`), layout, content, inner avatar
and shadow utilities are unchanged. The overlay now reads at the same
`0.50` opacity and `clamp(12px, 1.4vw, 18px)` blur as the rest of the
form panel (per KD-v9-002).

## Intentionally Deferred (Out of Scope This Run)

### BL-01: Mobile blur cap rule clobbers `backdrop-saturate-*` filter chain

**Why deferred:** The fix has multiple viable shapes (re-emit full
filter chain at the cap rule vs. read a `--liquid-saturate` token vs.
restructure consumers to use a single combined utility), each with
different downstream impact on `HeaderClient.tsx` and `MobileMenu.tsx`.
The reviewer's own analysis acknowledges the bug is the saturate-loss
on mobile, not the cap value itself. This change touches the global
mobile-blur enforcement contract from Phase 79 and should be landed
under a focused fix run with its own visual-regression check on mobile
header saturation.

### BL-04: ContactForm honeypot/timing branches silently swallow legitimate submissions

**Why deferred:** This is a data-integrity / business-logic issue, not
a visual or token-layer one. The fix (raise threshold, tag suspect
submissions server-side, or remove the fake-success branches entirely)
crosses the client/server boundary and intersects with the Directus
schema (`suspected_bot` field would need to exist server-side). Needs
a product decision on lead-loss tolerance vs. spam load before the
client code changes — and likely a backend schema change.

## Files Touched

- `next/src/app/globals.css` (BL-02)
- `next/src/components/sections/ContactForm.tsx` (BL-03)

## Commits in This Fix Run

1. `da8d1fd` — `fix(92): close a11y selector gap for token-based glass surfaces (BL-02)`
2. `f599af9` — `fix(92): migrate ContactForm success overlay to KD-v9-002 tokens (BL-03)`

---

_Fixed: 2026-04-30_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
