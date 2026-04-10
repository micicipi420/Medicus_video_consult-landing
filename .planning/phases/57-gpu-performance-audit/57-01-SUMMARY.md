---
phase: 57-gpu-performance-audit
plan: 01
subsystem: performance
tags: [gpu, backdrop-filter, will-change, css, tailwind]

requires:
  - phase: 56-specular-physics-interaction-states
    provides: Glass interaction hover/active states in liquid-glass.css Section 16
provides:
  - Decorative backdrop-blur stripped from all HTML pages (reduced GPU composite layers)
  - will-change hygiene on animated/interactive glass selectors only
affects: [57-02, future glass performance work]

tech-stack:
  added: []
  patterns:
    - "will-change only on :hover/:active/animated selectors, never on static glass"
    - "Decorative icons use opaque bg tokens instead of backdrop-blur"
    - "Form inputs use bg-white/80 instead of bg-white/50 + backdrop-blur-md"

key-files:
  created: []
  modified:
    - src/styles/liquid-glass.css
    - index.html
    - checkup.html
    - online-consultations.html
    - treatment-abroad.html
    - contacts.html
    - 404.html
    - styleguide.html
    - partials/mobile-menu.html
    - css/styles.css

key-decisions:
  - "bg-mu-blue/10 with backdrop-blur-xl replaced by bg-mu-blue/20 (no blur) for small icons"
  - "Form inputs changed from bg-white/50 + backdrop-blur-md to bg-white/80 (opaque enough inside liquid-card parent)"
  - "Header underlay backdrop-blur-[40px] removed entirely (redundant with parent glass class)"
  - "Mobile menu backdrop-blur-[80px] removed (redundant with liquid-regular class)"

patterns-established:
  - "PERF-02: will-change declarations only on :hover, :active, and continuously-animated selectors"
  - "Decorative icon backgrounds use opaque tokens, not backdrop-blur"

requirements-completed: [PERF-02]

duration: 29min
completed: 2026-04-10
---

# Phase 57 Plan 01: GPU Performance Audit -- Backdrop-Blur Cleanup & Will-Change Hygiene Summary

**Stripped wasteful inline backdrop-blur from 30+ decorative elements across 7 pages and added targeted will-change to 6 animated glass selectors**

## Performance

- **Duration:** 29 min
- **Started:** 2026-04-10T14:20:22Z
- **Completed:** 2026-04-10T14:49:55Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Removed all inline backdrop-blur-md/xl/[custom] from decorative HTML elements (checkmarks, card icons, advantage icons, social icons, form inputs, header underlays, mobile menus) across all 7 pages + mobile-menu partial
- Added will-change: filter, transform to glass :hover and :active states (Section 16)
- Added will-change: background-position to .liquid-card::before glint animation (Section 8)
- Added will-change: transform to .shimmer-sweep:hover::before (Section 5)
- Added will-change: filter, transform to button hover states (Section 3)
- Zero will-change: backdrop-filter declarations in codebase (PERF-02 compliance)

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove wasteful inline backdrop-blur from decorative elements** - `d23e0a7` (perf)
2. **Task 2: Add will-change hygiene to animated glass selectors** - `cc0a585` (perf)

## Files Created/Modified
- `src/styles/liquid-glass.css` - Added will-change to hover/active/animated selectors with PERF-02 comment
- `index.html` - Removed 20+ backdrop-blur instances from icons, form inputs, header underlay, mobile menu
- `checkup.html` - Removed backdrop-blur from header underlay, mobile menu, form inputs
- `online-consultations.html` - Removed backdrop-blur from header underlay, mobile menu, form inputs
- `treatment-abroad.html` - Removed backdrop-blur from header underlay, mobile menu, form inputs
- `contacts.html` - Removed backdrop-blur from header underlay, mobile menu, form inputs
- `404.html` - Removed backdrop-blur from header underlay, mobile menu
- `styleguide.html` - Removed backdrop-blur from header underlay, mobile menu, form inputs
- `partials/mobile-menu.html` - Removed redundant backdrop-blur-[80px] (liquid-regular provides it)
- `css/styles.css` - Rebuilt via make build

## Decisions Made
- bg-mu-blue/10 icons upgraded to bg-mu-blue/20 when removing backdrop-blur (slightly more opaque to compensate for lost blur frosting)
- bg-white/60 checkmark/social icons upgraded to bg-white/90 (near-opaque at 24px/32px size -- blur was imperceptible)
- Form inputs upgraded from bg-white/50 to bg-white/80 (parent liquid-card already provides frosted effect)
- Header underlay divs kept but stripped of backdrop-blur/backdrop-saturate (div retained for bg-white/40 overlay)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 57-01 complete, ready for 57-02 (viewport layer budget audit)
- All glass CSS changes are backwards-compatible
- Build passes cleanly

## Self-Check: PASSED

All key files exist on disk. Both task commits (d23e0a7, cc0a585) verified in git log.

---
*Phase: 57-gpu-performance-audit*
*Completed: 2026-04-10*
