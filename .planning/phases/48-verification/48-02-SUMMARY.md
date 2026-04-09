---
phase: 48-verification
plan: 02
subsystem: accessibility
tags: [reduced-motion, print, android-fps, a11y, audit, specificity]
dependency_graph:
  requires: [phase-43-liquid-glass, phase-44-chrome]
  provides: [reduced-motion-verified, print-stylesheet-verified, android-fps-documented]
  affects: [liquid-glass-css, squircles-css]
tech_stack:
  added: []
  patterns: [refraction-specificity-override-in-reduced-motion]
key_files:
  created: []
  modified:
    - src/styles/liquid-glass.css
    - src/styles/squircles.css
    - css/styles.css
    - .planning/phases/48-verification/48-AUDIT-REPORT.md
decisions:
  - "Preemptive fix for refraction specificity bug even though data-refract probe not yet deployed"
  - "Squircle print guard added to squircles.css (not liquid-glass.css) to keep print rules co-located with their CSS primitives"
  - "Android FPS assessment DEFERRED to real-device testing with 3-tier mitigation strategy documented"
metrics:
  duration: 209s
  completed: 2026-04-09
  tasks: 2/2
  files_created: 0
  files_modified: 4
---

# Phase 48 Plan 02: Reduced Motion, Print, and Android FPS Audit Summary

Audited reduced-motion guard completeness, print stylesheet coverage, and budget Android FPS risk across all v4.0 liquid glass surfaces; fixed refraction specificity bypass (FIX-05) and squircle print mask clipping (FIX-06).

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Reduced Motion + Print + Android FPS Audit | 40dd765 | Appended VERIFY-03 (Android FPS DEFERRED) and VERIFY-04 (reduced-motion + print audit) to 48-AUDIT-REPORT.md |
| 2 | Apply Reduced Motion and Print Fixes | b34de37 | FIX-05: refraction specificity in liquid-glass.css; FIX-06: squircle print guard in squircles.css |

## Key Findings

### VERIFY-03: Budget Android FPS

- **Status:** DEFERRED -- CLI executor cannot run physical device testing
- **Risk factors:** index.html has 58 glass elements (backdrop-filter) and 72 squircle masks, but peak concurrent viewport count is approximately 4-8
- **Existing mitigations:** reduced-motion guard (67% blur reduction), no will-change on static cards, single shimmer per page, configurable blur tokens
- **Mitigation strategy documented:** 3 tiers -- (1) reduce blur radius, (2) viewport-based culling, (3) media query degradation for low-end devices
- **Recommended test devices:** Samsung Galaxy A14, A34, A54; Xiaomi Redmi Note 12

### VERIFY-04: Reduced Motion

- **theme.css blanket guard:** COMPLETE -- `*, *::before, *::after` with `!important` zeroes all animation-duration, transition-duration, scroll-behavior
- **liquid-glass.css glass guard:** COMPLETE -- all 4 glass classes reduce backdrop-filter to blur(8px), shimmer hidden
- **Refraction specificity bug found:** Reduced-motion guard (0,1,0) lost to refraction selector (0,2,1) -- FIXED (FIX-05)
- **JS animation guards:** All 2 animation functions (initScrollAnimations, initAnimatedCounters) check prefers-reduced-motion with early return
- **Print stylesheet:** Glass classes covered, scroll-fade handled, but squircle mask-image was MISSING -- FIXED (FIX-06)
- **Inline animation bypasses:** None found across all 6 pages

## Fixes Applied

### FIX-05: Refraction Specificity Under Reduced-Motion (APPLIED)

- **File:** `src/styles/liquid-glass.css`
- **Issue:** `html[data-refract="true"] .liquid-regular` (specificity 0,2,1) overrode `@media (prefers-reduced-motion: reduce) { .liquid-regular }` (specificity 0,1,0)
- **Fix:** Added `html[data-refract="true"]`-prefixed selectors to the reduced-motion block, matching specificity (0,2,1) and winning via source-order cascade
- **Risk level was LOW:** Refraction probe not yet deployed, but fix applied preemptively to prevent future accessibility regression

### FIX-06: Squircle Print Guard (APPLIED)

- **File:** `src/styles/squircles.css`
- **Issue:** `.squircle-md`, `.squircle-lg`, `.squircle-xl` mask-image not removed in `@media print`, potentially clipping content in print engines
- **Fix:** Added `@media print` block with `mask-image: none !important` for all squircle classes

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Preemptive refraction specificity fix** -- Although no page currently sets `data-refract="true"`, the fix was applied to prevent a latent accessibility regression when the refraction probe is eventually deployed.

2. **Squircle print guard in squircles.css** -- Placed the `@media print` block in `squircles.css` (not `liquid-glass.css`) to keep print rules co-located with the CSS primitives they modify. This follows the existing pattern where `liquid-glass.css` handles its own print rules and `squircles.css` handles squircle-specific concerns.

3. **Android FPS DEFERRED** -- No blur reduction or performance degradation code applied. The documented 3-tier mitigation strategy provides a clear action plan, but changes should only be made after real-device measurement confirms the problem exists.

## Self-Check: PASSED

- [x] 48-AUDIT-REPORT.md contains VERIFY-03 section with DEFERRED status
- [x] 48-AUDIT-REPORT.md contains VERIFY-04 section with reduced-motion guard table
- [x] Commit 40dd765 exists (Task 1)
- [x] Commit b34de37 exists (Task 2)
- [x] `grep -c "prefers-reduced-motion" src/styles/liquid-glass.css` returns >= 1
- [x] `grep -c "@media print" src/styles/liquid-glass.css` returns >= 1
- [x] `grep -c "@media print" src/styles/squircles.css` returns >= 1
- [x] `make build` exits 0
