---
phase: 15-design-tokens-buttons-hero
plan: 01
subsystem: ui
tags: [css, design-tokens, buttons, hero, brand-alignment]

# Dependency graph
requires: []
provides:
  - "--color-cta and --color-cta-hover CSS tokens for green brand CTA"
  - "Pill-shape buttons (border-radius: 100px) across all button variants"
  - "Warm cream hero background (#fffbf4)"
affects: [16-card-section-spacing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CTA-specific color tokens separate from accent color tokens"

key-files:
  created: []
  modified:
    - css/styles.css

key-decisions:
  - "Keep --color-primary (#38C6F4) for accents, separate --color-cta (#35B678) for buttons"
  - "White text on green CTA (3.66:1 AA for large text 20px+)"
  - "Remove .button--secondary class as redundant with green primary"

patterns-established:
  - "CTA tokens: --color-cta / --color-cta-hover / --color-text-on-cta for button styling"

requirements-completed: [TOKEN-01, BTN-01, BTN-02, BTN-03, SPACE-02]

# Metrics
duration: 2min
completed: 2026-03-23
---

# Phase 15 Plan 01: Design Tokens, Buttons & Hero Summary

**Green pill-shape CTA buttons with --color-cta/#35B678 tokens and warm cream hero background (#fffbf4)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-23T10:39:40Z
- **Completed:** 2026-03-23T10:41:10Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added CTA design tokens (--color-cta, --color-cta-hover, --color-text-on-cta) to :root
- Replaced cold blue hero gradient with flat warm cream background (#fffbf4), removed dot-grid texture overlay
- Updated all buttons to pill-shape (border-radius: 100px) with font-weight 700
- Switched .button--primary from cyan to green CTA, removed .button--secondary
- Updated pulse-glow animation from cyan to green

## Task Commits

Each task was committed atomically:

1. **Task 1: Update design tokens and hero background** - `389c6d3` (feat)
2. **Task 2: Update button styles to pill-shape green CTA** - `81af1c6` (feat)

## Files Created/Modified
- `css/styles.css` - Added CTA tokens, pill-shape buttons, green primary CTA, warm hero background, green pulse-glow

## Decisions Made
- Kept --color-primary (#38C6F4) for accent use (icons, links, duotone SVGs) while adding separate --color-cta (#35B678) for buttons
- White text on green CTA buttons (3.66:1 contrast ratio, meets AA for large text at 20px+)
- Removed .button--secondary entirely since green primary CTA makes it redundant; outline button remains as secondary action

## Deviations from Plan

None - plan executed exactly as written.

Note: The plan's automated verification for Task 1 checked for absence of `radial-gradient(circle` globally, but a pre-existing unrelated usage exists at line 1637 (social proof decoration). This is not related to the hero dot-grid that was removed.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CTA tokens ready for use by other components
- Card and section spacing updates can proceed (Phase 16)
- All button variants now pill-shape, consistent with medicusunion.com brand

## Self-Check: PASSED

- FOUND: css/styles.css
- FOUND: 15-01-SUMMARY.md
- FOUND: commit 389c6d3 (Task 1)
- FOUND: commit 81af1c6 (Task 2)

---
*Phase: 15-design-tokens-buttons-hero*
*Completed: 2026-03-23*
