---
phase: 41-foundation-tokens
plan: 01
subsystem: infra
tags: [css-tokens, tailwind-v4, liquid-glass, squircle, design-system, motion]

# Dependency graph
requires: []
provides:
  - "All v4.0 design tokens in theme.css: grid, squircle masks, liquid glass (light+dark), motion"
  - "--container-content: 1200px in @theme inline for max-w-content utility"
  - "Reduced-motion guard extended with --dur-* token zeroing"
affects: [42-squircle-components, 43-liquid-glass-components, 44-motion-system, 45-grid-layout, 46-page-layouts, 47-responsive]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "v4.0 token blocks appended at END of each theme.css zone with /* v4.0: ... */ comment headers"
    - "Superellipse SVG data-URIs as CSS custom properties (n=7 md, n=5 lg, n=3.5 xl, none for full)"
    - "@theme inline --container-content uses literal 1200px (not var()) to avoid circular reference"

key-files:
  created: []
  modified:
    - src/styles/theme.css
    - css/styles.css

key-decisions:
  - "Squircle variants use different n values (7/5/3.5) for different roundedness rather than padding inset"
  - "--squircle-mask-full set to none with comment: use border-radius 50% instead of SVG mask"
  - "@theme inline --container-content uses literal 1200px to avoid var() circular reference"

patterns-established:
  - "v4.0 tokens organized in clearly commented blocks at end of each zone"
  - "Liquid glass tokens are recipe ingredients in :root/.dark, NOT bridged to @theme inline"
  - "Motion duration tokens have parallel 0ms overrides in reduced-motion guard"

requirements-completed: [GRID-01]

# Metrics
duration: 5min
completed: 2026-04-09
---

# Phase 41 Plan 01: Foundation Tokens Summary

**v4.0 design tokens added to theme.css: grid container (1200px), 3 squircle SVG masks + 1 none placeholder, liquid glass material recipes (light rgba(255,255,255,0.18) + dark rgba(30,40,60,0.45)), motion easing/duration tokens with reduced-motion zeroing**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-09T08:08:38Z
- **Completed:** 2026-04-09T08:13:56Z
- **Tasks:** 1 (auto) + 1 (checkpoint:human-verify, pending)
- **Files modified:** 2

## Accomplishments
- Added all 5 v4.0 token categories to theme.css in a single structured edit
- Generated parametric superellipse SVG paths (64 points per quadrant) for 3 squircle mask variants
- Liquid glass recipes defined for both light and dark modes with full rim shadow system
- Motion tokens with complementary reduced-motion guard that zeroes source tokens directly
- @theme inline bridge enables max-w-content Tailwind utility (verified with temporary test HTML)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add v4.0 token blocks to :root, .dark, and @theme inline** - `6fde560` (feat)

**Plan metadata:** pending (after checkpoint)

## Files Created/Modified
- `src/styles/theme.css` - Added 67 lines: grid tokens, squircle SVG data-URIs, liquid glass light+dark recipes, motion tokens, reduced-motion extension
- `css/styles.css` - Recompiled Tailwind output (no max-w-content yet -- JIT generates only when class is used in HTML)

## Decisions Made
- **Squircle n-values:** Used n=7 (md, subtle rounding), n=5 (lg, Apple standard), n=3.5 (xl, very rounded) to create visually distinct variants rather than identical shapes with different semantic labels
- **--squircle-mask-full: none** -- Per plan guidance and Research open question #3, full variant uses border-radius: 50% instead of SVG mask; token stores `none` with explanatory comment
- **@theme inline literal value:** Used `--container-content: 1200px` (literal) in @theme inline, not `var(--container-content)`, to avoid potential circular variable reference per plan instruction

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] max-w-content not in compiled CSS output**
- **Found during:** Task 1 verification
- **Issue:** Plan acceptance criterion expects `max-w-content` in css/styles.css, but Tailwind v4 JIT only generates utilities that are consumed in HTML source files. No HTML currently uses `max-w-content`.
- **Fix:** Verified with temporary test HTML that the token definition is correct and `max-w-content{max-width:1200px}` IS generated when the class appears in HTML. The @theme inline declaration is correct. This is expected Tailwind v4 JIT behavior -- the utility will appear in compiled CSS once Phases 45-47 add `max-w-content` to HTML pages.
- **Files modified:** None (verification only)
- **Verification:** Temporary HTML file with `max-w-content` class produced correct CSS output
- **Committed in:** N/A (no code change needed)

---

**Total deviations:** 1 (documented JIT behavior mismatch with plan expectation)
**Impact on plan:** No code impact. Token infrastructure is correctly defined. The utility will auto-generate when HTML consumers are added in later phases.

## Issues Encountered
None beyond the max-w-content JIT behavior documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All v4.0 token categories ready for consumption by Phases 42-49
- Plan 41-02 (focus-visible ring refactoring) can proceed independently
- max-w-content utility will activate once HTML pages use the class

---
*Phase: 41-foundation-tokens*
*Completed: 2026-04-09*
