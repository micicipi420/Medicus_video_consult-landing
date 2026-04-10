---
phase: 20-dark-mode-token-infrastructure
plan: "01"
subsystem: ui
tags: [dark-mode, css-tokens, css-custom-properties, accessibility, fouc-prevention]

# Dependency graph
requires:
  - phase: 19-v1-3-cleanup
    provides: Clean v1.3 CSS token foundation with --color-*, --shadow-*, --gradient-cta tokens
provides:
  - CSS [data-theme="dark"] token override block with navy #0F1923 base
  - "@media (prefers-color-scheme: dark) first-visit OS preference hint"
  - Glass surface tokens (--glass-bg, --glass-border, --glass-blur) in :root and dark override
  - Synchronous ES5 FOUC-prevention inline script in <head> before CSS link
  - data-theme="light" attribute on <html> element as default
  - .theme-toggle button in .site-header__container with aria attributes and 44px touch target
affects:
  - 20-02 (JS toggle wiring — connects to .theme-toggle button and localStorage)
  - phase-22-glassmorphism (--glass-* tokens pre-defined here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "data-theme attribute on <html> for CSS cascade dark mode (no JS class toggling)"
    - "Token-only dark mode: [data-theme='dark'] redefines exact same --color-* names — zero component CSS changes needed"
    - "ES5 IIFE FOUC-prevention script — var, no arrow functions, synchronous before CSS link"
    - "OS preference via :root:not([data-theme='light']) — explicit user toggle always wins"

key-files:
  created: []
  modified:
    - index.html
    - css/styles.css

key-decisions:
  - "navy #0F1923 as dark mode background base — avoids pure #000 halation for astigmatic 45+ users"
  - "Token reuse pattern: [data-theme='dark'] redefines exact --color-* names, never parallel names like --color-white-dark"
  - "Default-light policy (DM-04): @media prefers-color-scheme scoped to :root:not([data-theme='light']) so OS dark preference is hint-only, not forced"
  - "Glass tokens --glass-bg/--glass-border/--glass-blur added now for Phase 22 glassmorphism pre-wire"

patterns-established:
  - "FOUC-prevention: synchronous ES5 IIFE in <head> before <link rel='stylesheet'> reads localStorage and sets data-theme before CSS renders"
  - "Dark mode via data-theme attribute selector — all component colours auto-update via existing token references, no component rules modified"

requirements-completed: [DM-02, DM-03, DM-01]

# Metrics
duration: 2min
completed: 2026-03-24
---

# Phase 20 Plan 01: Dark Mode Token Infrastructure Summary

**CSS [data-theme="dark"] token cascade with navy base, glass surface tokens, @media OS hint, FOUC-prevention ES5 script, and .theme-toggle button scaffold**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-24T05:04:02Z
- **Completed:** 2026-03-24T05:05:33Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `data-theme="light"` default to `<html>` and synchronous ES5 FOUC-prevention script in `<head>` before the CSS link — eliminates white-flash for returning dark-mode users
- Added complete `[data-theme="dark"]` token override block (18 token overrides) with WCAG AA contrast ratios, navy #0F1923 base to avoid halation for 45+ users
- Added `@media (prefers-color-scheme: dark)` first-visit hint block scoped to `:root:not([data-theme="light"])` enforcing DM-04 default-light policy
- Added `--glass-bg`, `--glass-border`, `--glass-blur` tokens to both `:root` (light defaults) and dark override block — pre-wired for Phase 22 glassmorphism
- Added `.theme-toggle` button to `.site-header__container` with `aria-pressed="false"`, `aria-label`, icon, and text label (44px minimum touch target)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add FOUC prevention script, data-theme attribute, and toggle button** - `58ebc32` (feat)
2. **Task 2: Add dark mode token infrastructure to css/styles.css** - `3f6efd7` (feat)

**Plan metadata:** (docs commit pending)

## Files Created/Modified

- `index.html` - Added `data-theme="light"` to `<html>`, ES5 FOUC-prevention `<script>` before CSS link, `.theme-toggle` button in header
- `css/styles.css` - Added glass tokens to `:root`, `[data-theme="dark"]` block after `:root`, `@media prefers-color-scheme` hint block, `.theme-toggle` styles

## Decisions Made

- **navy #0F1923 as dark background**: Avoids pure black halation artifact for astigmatic users (target audience 45+)
- **Token reuse pattern**: `[data-theme="dark"]` redefines exact same `--color-*`, `--shadow-*` token names — never creates parallel `--color-white-dark` style names. All 1,640+ existing CSS lines auto-update via cascade.
- **Default-light policy (DM-04)**: `@media prefers-color-scheme: dark` is scoped to `:root:not([data-theme="light"])` — OS preference is a first-visit hint only; once user explicitly sets light/dark it is honoured over OS preference
- **Glass tokens pre-wired**: `--glass-bg`, `--glass-border`, `--glass-blur` added now in both light defaults and dark overrides — Phase 22 glassmorphism components can use them without any token infrastructure work

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Token infrastructure complete — setting `document.documentElement.setAttribute('data-theme', 'dark')` in DevTools immediately switches all section colours via the cascade
- Plan 02 (JS toggle wiring) can now connect click handler on `.theme-toggle`, update `aria-pressed`, persist to `localStorage`, and update the icon/label
- Glass tokens `--glass-bg`/`--glass-border`/`--glass-blur` are available for Phase 22 glassmorphism without any additional token work

## Self-Check: PASSED

- FOUND: index.html
- FOUND: css/styles.css
- FOUND: 20-01-SUMMARY.md
- FOUND commit: 58ebc32 (Task 1)
- FOUND commit: 3f6efd7 (Task 2)

---
*Phase: 20-dark-mode-token-infrastructure*
*Completed: 2026-03-24*
