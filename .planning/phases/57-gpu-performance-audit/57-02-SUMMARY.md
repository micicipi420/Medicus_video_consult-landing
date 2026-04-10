---
phase: 57-gpu-performance-audit
plan: 02
subsystem: ui
tags: [backdrop-filter, intersection-observer, gpu-budget, glass, performance]

# Dependency graph
requires:
  - phase: 57-gpu-performance-audit/01
    provides: backdrop-blur cleanup and will-change hygiene baseline
provides:
  - IntersectionObserver-based glass budget system capping active backdrop-filter to 6
  - .glass-idle CSS class with opaque background fallback for light/dark mode
  - Priority-based downgrade system (header never idled, buttons first)
affects: [liquid-glass, main-js, gpu-performance]

# Tech tracking
tech-stack:
  added: []
  patterns: [viewport-budget-observer, priority-based-gpu-downgrade]

key-files:
  modified:
    - src/styles/liquid-glass.css
    - js/main.js
    - css/styles.css

key-decisions:
  - "Used single IntersectionObserver with threshold:0 for minimal callback overhead"
  - "4-tier priority system: header(1) > nav/stats(2) > card/regular(3) > btn/clear/fluted(4)"
  - "Observer stored in closure variable for disconnect/reconnect on SPA reinit"

patterns-established:
  - "glass-idle: CSS class that disables backdrop-filter and provides opaque fallback"
  - "initGlassBudget: viewport-aware budget pattern using IntersectionObserver + Set"

requirements-completed: [PERF-01]

# Metrics
duration: 9min
completed: 2026-04-10
---

# Phase 57 Plan 02: Viewport Glass Budget Summary

**IntersectionObserver-based backdrop-filter budget capping active glass to 6 elements with priority-based downgrade**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-10T15:03:28Z
- **Completed:** 2026-04-10T15:12:26Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- Added .glass-idle CSS class (Section 18) with backdrop-filter: none and opaque background approximation for both light and dark mode
- Implemented initGlassBudget() with 6-element viewport budget using IntersectionObserver
- Priority system ensures header glass is never downgraded; buttons/decorative glass downgrade first
- Wired into initAll(), reinitPageContent(), and window.MU for SPA router support

## Task Commits

Each task was committed atomically:

1. **Task 1: Add .glass-idle CSS class and viewport budget JS** - `ee2d2a3` (perf)

## Files Created/Modified
- `src/styles/liquid-glass.css` - Added Section 18 with .glass-idle class and light/dark fallback backgrounds
- `js/main.js` - Added initGlassBudget() with IntersectionObserver, priority system, and SPA reinit support
- `css/styles.css` - Rebuilt via make build with new glass-idle rules

## Decisions Made
- Used a single IntersectionObserver instance with threshold:0 for minimal callback overhead (no threshold array)
- 4-tier priority system matches the plan: header backdrop never downgraded, buttons/clear/fluted downgraded first
- Observer reference stored in module-scoped _glassBudgetObserver for clean disconnect on SPA page transitions
- Budget enforcement does not skip for reduced-motion users (they already get backdrop-filter disabled via media queries, so glass-idle is a no-op)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Glass budget system is active and enforces the 6-element limit at all scroll positions
- Manual verification recommended: open index.html in Chrome DevTools Layers panel, scroll through, confirm max 6 composited backdrop-filter layers
- System is compatible with SPA router reinit and bfcache restoration

## Self-Check: PASSED

All files exist, all commits verified.

---
*Phase: 57-gpu-performance-audit*
*Completed: 2026-04-10*
