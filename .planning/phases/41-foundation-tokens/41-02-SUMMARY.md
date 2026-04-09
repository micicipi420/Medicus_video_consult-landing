---
phase: 41-foundation-tokens
plan: 02
subsystem: infra
tags: [css-tokens, focus-visible, accessibility, squircle-prerequisite, wcag-aa]

# Dependency graph
requires:
  - "41-01"
provides:
  - "Focus-visible ring uses outline (not box-shadow) -- immune to mask-image clipping"
  - "outline: 2px solid var(--mu-blue-text) with outline-offset: 3px in @layer base"
  - "SQUIRCLE-03 prerequisite satisfied -- Phase 42 can safely apply mask-image"
affects: [42-squircle-components, 43-liquid-glass-components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Focus-visible uses outline + outline-offset instead of box-shadow double-ring"
    - "box-shadow: none explicitly set to prevent stray shadows from other sources"

key-files:
  created: []
  modified:
    - src/styles/theme.css
    - css/styles.css

key-decisions:
  - "outline: 2px solid over box-shadow: CSS outline is painted outside box model, not clipped by mask-image"
  - "outline-offset: 3px provides visual breathing room between element edge and focus ring"
  - "box-shadow: none set explicitly to prevent double-ring artifacts from utility classes"

patterns-established:
  - "Focus indicators must use outline (not box-shadow) for mask-image compatibility"

requirements-completed: [SQUIRCLE-03]

# Metrics
duration: 2min
completed: 2026-04-09
---

# Phase 41 Plan 02: Focus-Visible Ring Refactoring Summary

**Refactored focus-visible ring from box-shadow double-ring (white+blue) to outline: 2px solid var(--mu-blue-text) with 3px offset -- SQUIRCLE-03 prerequisite ensuring focus rings survive mask-image clipping in Phase 42**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-09T08:16:53Z
- **Completed:** 2026-04-09T08:18:37Z
- **Tasks:** 1 (auto) + 1 (checkpoint:human-verify, pending)
- **Files modified:** 2

## Accomplishments
- Replaced old double-ring box-shadow (0 0 0 2px white, 0 0 0 4px --mu-blue-text) with single outline ring
- Added outline-offset: 3px for breathing room between element border and focus ring
- Explicitly set box-shadow: none to prevent stray shadow artifacts
- All 7 interactive element selectors preserved (a, button, input, select, textarea, [role="button"], [tabindex])
- WCAG AA contrast maintained (--mu-blue-text = #0E8FB5, 4.6:1 ratio on white)
- Zero HTML files changed
- make build passes cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor focus-visible from box-shadow to outline** - `1a80ee2` (feat)

## Files Created/Modified
- `src/styles/theme.css` - Changed 3 CSS declarations inside the focus-visible rule block in @layer base
- `css/styles.css` - Recompiled Tailwind output reflecting the updated focus-visible rule

## Decisions Made
- **outline over box-shadow:** CSS `outline` is painted outside the box model and is NOT clipped by `mask-image` or `overflow: hidden`. Phase 42 will apply `mask-image` to squircle elements, so all focus indicators must use outline to survive clipping.
- **outline-offset: 3px:** Provides visual breathing room between the element edge and the focus ring, similar to the old double-ring's white gap but achieved with a single declaration.
- **box-shadow: none explicit:** While the old pattern is removed, `box-shadow: none` is set explicitly to prevent any utility class or component-level box-shadow from appearing alongside the new outline ring.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- SQUIRCLE-03 prerequisite is satisfied -- Phase 42 can safely apply mask-image to squircle elements without clipping focus rings
- All Plan 01 tokens remain intact (--container-content, --liquid-bg, --ease-liquid verified present)
- Phase 41 complete once human-verify checkpoint is approved

---
*Phase: 41-foundation-tokens*
*Completed: 2026-04-09*
