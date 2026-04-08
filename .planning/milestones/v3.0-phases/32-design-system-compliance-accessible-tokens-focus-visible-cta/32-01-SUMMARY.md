---
phase: 32-design-system-compliance
plan: 01
subsystem: ui
tags: [accessibility, wcag, css-tokens, focus-visible, reduced-motion, tailwind-v4]

# Dependency graph
requires: []
provides:
  - WCAG AA accessible text color tokens (mu-blue-text, mu-accent-blue-text, mu-accent-teal-text, mu-accent-orange-text, mu-green-text)
  - CTA gradient tokens (mu-cta-from, mu-cta-to)
  - Form inset shadow token (shadow-form-inset)
  - Updated neutral text ramp (mu-text-700, mu-text-500) with WCAG AA contrast
  - Global focus-visible keyboard navigation ring
  - prefers-reduced-motion CSS rule
affects: [32-02-PLAN, html-pages, cta-buttons, text-colors]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Accessible text tokens use -text suffix (mu-blue-text vs mu-blue) to distinguish WCAG-safe text colors from bright icon/background colors"
    - "Focus-visible ring via box-shadow (0 0 0 2px white, 0 0 0 4px brand-color) for global CSS approach without HTML changes"

key-files:
  created: []
  modified:
    - src/styles/theme.css
    - css/styles.css

key-decisions:
  - "Used box-shadow instead of outline for focus-visible ring to achieve ring-offset-2 effect in a single global CSS rule"
  - "Placed prefers-reduced-motion outside @layer base for universal override scope"

patterns-established:
  - "Accessible text tokens: --mu-{color}-text for WCAG AA text, --mu-{color} for icons/backgrounds"
  - "Global focus-visible: single CSS rule in @layer base, no per-element HTML changes needed"

requirements-completed: [A11Y-01, A11Y-02, A11Y-03, A11Y-07]

# Metrics
duration: 1min
completed: 2026-04-05
---

# Phase 32 Plan 01: Accessible Color Tokens Summary

**WCAG AA color tokens, focus-visible keyboard ring, and prefers-reduced-motion rule added to theme.css -- foundation for design system compliance across all pages**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-05T18:38:59Z
- **Completed:** 2026-04-05T18:40:12Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added 7 WCAG AA accessible text/CTA color tokens to :root and mapped them in @theme inline for Tailwind utility class resolution
- Updated --mu-text-700 (#63687A -> #4A4E5C, 3.75:1 -> 5.89:1) and --mu-text-500 (#A4A8B5 -> #6B6F80, 2.29:1 -> 4.50:1) to pass WCAG AA
- Implemented global focus-visible keyboard navigation ring using box-shadow with var(--mu-blue-text) brand color
- Added prefers-reduced-motion media query disabling all animations and transitions for accessibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Add accessible color tokens and update neutral values** - `45a0379` (feat)
2. **Task 2: Add focus-visible and prefers-reduced-motion CSS rules** - `037e720` (feat)

## Files Created/Modified
- `src/styles/theme.css` - Added 9 new CSS custom properties in :root, 8 new @theme inline mappings, updated 2 neutral values, added focus-visible rule in @layer base, added prefers-reduced-motion media query
- `css/styles.css` - Recompiled Tailwind output with all new tokens and rules

## Decisions Made
- Used box-shadow (0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)) instead of Tailwind ring utilities for focus-visible -- enables single global CSS rule without any HTML changes across all 6 pages
- Placed @media (prefers-reduced-motion: reduce) outside @layer base at file level so it applies universally with !important overrides

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All accessible color tokens now available as Tailwind utility classes (text-mu-blue-text, from-mu-cta-from, etc.)
- Plan 32-02 can proceed with HTML class replacements across all pages
- Focus-visible and reduced-motion are already active globally -- no further HTML work needed for these

## Self-Check: PASSED
- All files exist: src/styles/theme.css, css/styles.css, 32-01-SUMMARY.md
- All commits verified: 45a0379, 037e720
