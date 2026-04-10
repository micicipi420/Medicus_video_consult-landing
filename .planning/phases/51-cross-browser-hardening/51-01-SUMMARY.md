---
phase: 51-cross-browser-hardening
plan: 01
subsystem: liquid-glass-css
tags: [safari, firefox, backdrop-filter, cross-browser, fallback]
dependency_graph:
  requires: []
  provides: [safari-backdrop-filter-fallback, firefox-opacity-fallback]
  affects: [liquid-glass-css, css-output]
tech_stack:
  added: []
  patterns: [cascade-based-safari-fallback, supports-query-fallback]
key_files:
  created: []
  modified:
    - src/styles/liquid-glass.css
    - css/styles.css
decisions:
  - "Light-mode hardcoded values used as universal Safari fallback -- dark-mode param difference (28px/160%/115% vs 24px/180%/108%) is visually negligible"
  - "Header backdrop excluded from Safari fallback (already hardcoded at blur(20px))"
  - "Refraction probe (Section 10) excluded -- Chromium-only by design"
metrics:
  duration: 417s
  completed: 2026-04-10T08:27:03Z
  tasks: 2/2
  files: 2
---

# Phase 51 Plan 01: Safari/Firefox Backdrop-Filter Fallbacks Summary

Hardcoded -webkit-backdrop-filter fallback lines for Safari (vars fail in -webkit- prefix) plus Firefox @supports fallback hardening for header backdrop.

## What Was Done

### Task 1: Safari hardcoded -webkit-backdrop-filter fallbacks
**Commit:** 69aad82

Added hardcoded `-webkit-backdrop-filter` declarations immediately before each var()-based line in 4 glass classes. Safari ignores CSS custom properties inside `-webkit-backdrop-filter`, so it falls through to the hardcoded line. Chromium reads both and uses the var()-based line (last valid wins).

**Changes:**
- `.liquid-regular`: Added `blur(24px) saturate(180%) brightness(108%)` fallback
- `.liquid-card`: Added `blur(24px) saturate(180%) brightness(108%)` fallback
- `.liquid-btn-secondary`: Added `blur(24px) saturate(180%) brightness(108%)` fallback
- `.stats-glass`: Added `blur(40px) saturate(180%) brightness(108%)` fallback (uses blur-lg)
- Added Safari fallback strategy comment block at Section 1 header
- Added `prefers-reduced-transparency` browser support note at Section 14

**Untouched (as specified):**
- `.liquid-header-backdrop` (already hardcoded at blur(20px))
- Section 10 refraction (Chromium-only, gated by data-refract)
- Section 13 reduced-motion (already hardcoded blur(8px))
- Section 14 reduced-transparency (sets backdrop-filter: none)
- Section 15 @supports fallback (separate task)

### Task 2: Firefox @supports fallback hardening
**Commit:** c623a20

Verified all 4 glass classes + dark variants were already in the @supports fallback. Found gap: `.liquid-header-backdrop` was missing. Added it for both light and dark mode. Updated Section 15 comment block with Firefox version context (Firefox 103+ supports backdrop-filter).

**Changes:**
- Added `.liquid-header-backdrop` light fallback: `background: rgba(255, 255, 255, 0.85)`
- Added `.dark .liquid-header-backdrop` dark fallback: `background: rgba(30, 40, 60, 0.85)`
- Updated Section 15 comment with Firefox 103+ context
- Rebuilt Tailwind CSS output

## Decisions Made

1. **Light-mode universal fallback:** Safari always gets light-mode hardcoded values (24px/180%/108%) regardless of .dark class. The visual difference vs dark params is negligible, and duplicating all 4 classes under .dark would add 40+ lines for marginal fidelity.
2. **Header backdrop excluded from Safari fix:** Already uses hardcoded `blur(20px) saturate(180%)` -- no var() involved.
3. **Refraction excluded:** Chromium-only by design, gated by `html[data-refract="true"]` JS probe.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

| Check | Result |
|-------|--------|
| Safari fallback comments (4+) | 4 found |
| blur(24px) hardcoded matches (3) | 3 found |
| blur(40px) hardcoded matches (1) | 1 found |
| header-backdrop in @supports | 2 refs found |
| Tailwind CSS build | Done in 58ms |

## Known Stubs

None.

## Self-Check: PASSED

All files exist, all commits verified.
