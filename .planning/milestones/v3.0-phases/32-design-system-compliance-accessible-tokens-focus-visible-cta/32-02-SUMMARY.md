---
phase: 32-design-system-compliance
plan: 02
subsystem: ui
tags: [accessibility, wcag, aria, color-contrast, tailwind-v4, glassmorphism]

# Dependency graph
requires:
  - phase: 32-01
    provides: Accessible text tokens (mu-blue-text, mu-cta-from, etc.) in theme.css and compiled CSS
provides:
  - WCAG AA compliant text colors across all 6 HTML pages
  - Accessible CTA gradient (from-mu-cta-from to-mu-cta-to) on 77 buttons
  - ARIA live regions on all 20 form error containers
  - Glass-5 spec form containers (bg-white/70)
  - Design token shadow-form-inset on contacts.html form inputs
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Text vs icon color distinction: *-text variants on readable text, bright originals on SVG icons and decorative icon containers"
    - "Form error accessibility: role=alert aria-live=polite on all error containers for screen reader announcement"

key-files:
  created: []
  modified:
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html
    - 404.html
    - css/styles.css

key-decisions:
  - "Icon containers (divs with flex/items-center/justify-center) and SVGs keep bright original colors; only text elements get *-text accessible variants"
  - "Decorative large numbers with opacity-20 (aria-hidden step indicators) keep original colors since they are non-functional"

patterns-established:
  - "Color replacement judgment: SVGs = keep, icon containers = keep, opacity decorative = keep, all other text = replace with *-text"
  - "Form error ARIA pattern: role=alert aria-live=polite with hidden attribute toggled by JS validation"

requirements-completed: [A11Y-04, A11Y-05, A11Y-06, A11Y-08]

# Metrics
duration: 6min
completed: 2026-04-05
---

# Phase 32 Plan 02: Accessible Color and ARIA Compliance Summary

**WCAG AA color contrast on 77 CTA buttons, 88 hover states, 62 text elements; ARIA live regions on 20 form errors; Glass-5 form containers across all 6 pages**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-05T18:42:43Z
- **Completed:** 2026-04-05T18:49:34Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Replaced CTA gradient from-mu-blue/to-mu-accent-blue with from-mu-cta-from/to-mu-cta-to on 77 buttons across all 6 pages (WCAG AA 4.5:1+ white text contrast)
- Replaced 88 hover:text-mu-blue and 4 group-hover:text-mu-blue with accessible -text variants on all link/card hover states
- Replaced 62 readable text elements using bright accent colors (mu-blue, mu-accent-blue, mu-accent-teal, mu-accent-orange, mu-green-600) with WCAG AA compliant *-text variants while preserving 63 SVG icons and icon containers with original bright colors
- Added role="alert" aria-live="polite" to all 20 form error elements (3 field-errors + 1 form-error per page, 5 pages)
- Fixed form container glass level from bg-white/60 to bg-white/70 (Glass-5 spec) on 5 form wrappers
- Replaced 4 hardcoded form input shadows with shadow-form-inset design token on contacts.html
- Recompiled Tailwind CSS with tree-shaking (74KB -> 61KB, removed unused old classes)

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace CTA gradient and text color classes across all 6 HTML files** - `2661f0a` (feat)
2. **Task 2: Add ARIA attributes to form errors, fix Glass-5 form containers, and recompile Tailwind** - `9f0749d` (feat)

## Files Created/Modified
- `index.html` - Accessible CTA gradient, text colors, ARIA on form errors, Glass-5 form container
- `online-consultations.html` - Accessible CTA gradient, text colors, ARIA on form errors, Glass-5 form container
- `treatment-abroad.html` - Accessible CTA gradient, text colors, ARIA on form errors, Glass-5 form container
- `checkup.html` - Accessible CTA gradient, text colors (stat numbers, badge labels), ARIA on form errors, Glass-5 form container
- `contacts.html` - Accessible CTA gradient, text colors, ARIA on form errors, Glass-5 form container, shadow-form-inset on 4 inputs
- `404.html` - Accessible CTA gradient and hover states only (no form on this page)
- `css/styles.css` - Recompiled Tailwind output with all new token classes, tree-shaken from 74KB to 61KB

## Decisions Made
- Icon containers (divs with flex/items-center/justify-center) and SVGs keep bright original colors; only text elements get *-text accessible variants
- Decorative large numbers with opacity-20 and aria-hidden="true" (step indicators on online-consultations.html) keep original colors since they are non-functional decorative elements
- Used Python script for context-aware text color replacements instead of blind find-replace to prevent icon/SVG regressions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed group-hover:text-mu-blue not caught by initial sed**
- **Found during:** Task 1 (hover text color replacement)
- **Issue:** BSD sed `\b` word boundary didn't work, leaving 84 hover:text-mu-blue unreplaced. Additionally, 4 group-hover:text-mu-blue on card headings in index.html were not targeted by the initial replacement.
- **Fix:** Used Python regex with negative lookahead `(?!-text)` for precise replacement of all 84 hover states and 4 group-hover states
- **Files modified:** All 6 HTML files
- **Verification:** Python scan confirmed 0 remaining hover:text-mu-blue without -text suffix
- **Committed in:** 2661f0a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor tooling issue (BSD sed vs GNU sed). Fixed immediately with Python. No scope creep.

## Issues Encountered
- BSD sed on macOS does not support `\b` word boundaries, causing initial hover:text-mu-blue replacements to silently fail. Resolved by switching to Python for all regex-based replacements.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 32 (design system compliance) is now fully complete
- All WCAG AA color contrast requirements met across all pages
- Focus-visible (Plan 01) + accessible colors (Plan 02) = full accessibility compliance
- Site is ready for visual review to confirm no regressions on icon/decorative colors

## Self-Check: PASSED
- All 7 modified files exist
- All 2 task commits verified: 2661f0a, 9f0749d
- 6 HTML files use new CTA gradient, 0 files retain old gradient
- 20 ARIA elements added, 5 Glass-5 form containers, 4 shadow-form-inset inputs
