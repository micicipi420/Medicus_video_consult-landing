---
phase: 21-bold-typography-scale
plan: 01
subsystem: ui
tags: [typography, css, clamp, fluid-type, manrope, dark-mode]

# Dependency graph
requires:
  - phase: 20-dark-mode-token-infrastructure
    provides: "[data-theme='dark'] token block and dark mode toggle — headings must remain legible in both modes"
provides:
  - h1 clamp(2.5rem, 5vw, 3.5rem) — fluid 40px→56px at weight 800
  - h2 clamp(1.75rem, 3.5vw, 2.75rem) — fluid 28px→44px at weight 800
  - h3 clamp(1.375rem, 2.5vw, 2rem) — fluid 22px→32px at weight 700
  - --line-height-display: 1.1 token for display-scale headings
  - text-wrap: balance on all h1/h2/h3 — eliminates Cyrillic single-word orphan lines
affects:
  - 22-glassmorphism
  - 23-micro-animations-enhancement

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "clamp() fluid type scale — min/preferred/max values tied to viewport width via vw units"
    - "text-wrap: balance on all headings — prevents Cyrillic orphan lines without JS"
    - "Per-element weight/line-height overrides for h1/h2 on top of shared h1,h2,h3,h4 base rule"

key-files:
  created: []
  modified:
    - css/styles.css

key-decisions:
  - "h1/h2 go to weight 800 (Manrope Variable supports 200–800), h3 stays at 700 — only display-scale headings get the bump"
  - "--line-height-display: 1.1 added as separate token from --line-height-heading: 1.2 — tighter leading for large display sizes reduces visual bulk"
  - "text-wrap: balance applied to h3 as well as h1/h2 — all heading levels benefit from orphan prevention"
  - "No letter-spacing added to any heading — Cyrillic tracking reduction is explicitly forbidden (PITFALLS.md)"
  - ".hero__title and .pricing__heading NOT touched — both correctly inherit h1/h2 via cascade after base rule update"

patterns-established:
  - "Fluid type via clamp(): use (min-size, vw-preferred, max-size) pattern for all future display headings"
  - "Token-only heading changes: update :root tokens, expand per-element rules — never override in component classes unless unavoidable"

requirements-completed: [TYPO-01, TYPO-02]

# Metrics
duration: ~15min
completed: 2026-03-24
---

# Phase 21 Plan 01: Bold Typography Scale Summary

**Manrope Variable heading scale upgraded to display standards: h1 clamp(40px→56px)/800, h2 clamp(28px→44px)/800, text-wrap: balance on all headings — verified no Cyrillic orphan lines at 320px and 390px**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-24
- **Completed:** 2026-03-24
- **Tasks:** 2 (1 auto + 1 checkpoint:human-verify)
- **Files modified:** 1

## Accomplishments

- Updated three CSS custom property tokens in :root: --font-size-h1, --font-size-h2, --font-size-h3 to fluid clamp() values
- Added --line-height-display: 1.1 token; applied to h1 and h2 for tighter display-scale leading
- Set font-weight: 800 on h1 and h2; h3 remains at 700
- Added text-wrap: balance to all three heading levels — eliminates single-word Cyrillic orphan lines
- Human visual verification confirmed: fluid scaling at 320px/390px/1440px, no overflow, no regression in sticky bar / FAQ / form / dark mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Update heading tokens and base rules (TYPO-01 + TYPO-02)** - `34f5bb8` (feat)
2. **Task 2: Visual verification at 320px, 390px and dark mode** - APPROVED (no code changes — checkpoint only)

**Plan metadata:** (this commit)

## Files Created/Modified

- `css/styles.css` - Updated :root heading tokens to clamp() values; added --line-height-display token; expanded h1/h2/h3 rules with weight 800 (h1/h2), line-height 1.1 (h1/h2), text-wrap: balance (all three)

## Decisions Made

- h1 and h2 advance to font-weight: 800; h3 stays at 700. Only display-scale headings get the visual weight boost — smaller headings at 700 maintain hierarchy without looking heavy.
- Separate --line-height-display: 1.1 token introduced alongside existing --line-height-heading: 1.2. At clamp-scale sizes, tighter leading (1.1) reduces visual bulk on multiline headings.
- No letter-spacing added to any heading. PITFALLS.md explicitly forbids Cyrillic tracking adjustments — letter-spacing breaks Cyrillic character spacing and degrades readability.
- .hero__title and .pricing__heading left untouched — both have no font-size override and correctly inherit from h1/h2 via cascade. Token change propagates automatically.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 21 complete. All three Phase 21 success criteria met (hero visibly bolder/larger, fluid scaling confirmed, dark mode contrast clean).
- Phase 22 (Glassmorphism) can begin: depends on Phase 20 (complete) and Phase 21 (now complete).
- No blockers.

---
*Phase: 21-bold-typography-scale*
*Completed: 2026-03-24*
