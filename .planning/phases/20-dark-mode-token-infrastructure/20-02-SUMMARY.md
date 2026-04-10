---
phase: 20-dark-mode-token-infrastructure
plan: "02"
subsystem: ui
tags: [dark-mode, javascript, accessibility, wcag, contrast-audit, localStorage]

# Dependency graph
requires:
  - phase: 20-01
    provides: "[data-theme='dark'] CSS token block, .theme-toggle button, FOUC-prevention inline script"
provides:
  - initDarkMode() JS function wired to .theme-toggle button
  - localStorage theme persistence across page reload
  - aria-pressed state management on toggle button
  - Icon switching (sun/moon) on theme change
  - meta[name='theme-color'] update for Android browser chrome
  - Contrast audit — all dark token pairs documented and verified WCAG AA/AAA
affects:
  - phase-21 (dark mode JS infrastructure is now complete — Phase 21 visual work can assume working toggle)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "initDarkMode() reads data-theme already set by FOUC-prevention script — avoids double-apply on init"
    - "applyTheme(theme) is a single function handling all side-effects: setAttribute, localStorage, aria-pressed, icon text, meta theme-color"
    - "ES5 var + function declarations throughout — no const/let/arrow functions per project constraint"

key-files:
  created: []
  modified:
    - js/main.js

key-decisions:
  - "initDarkMode() placed last in initAll() so all other UI is initialised before theme state reconciliation"
  - "applyTheme() as single side-effect function ensures aria-pressed, icon, and localStorage always stay in sync"
  - ".hero hardcoded background: #ffffff replaced with var(--color-white) — token cascade must be uninterrupted for dark mode to work correctly"

patterns-established:
  - "Dark mode toggle: read current data-theme from documentElement, invert, call applyTheme — no separate state variable needed"
  - "meta[name='theme-color'] updated on every theme change for Android status bar colour matching"

requirements-completed: [DM-01, DM-03, DM-04]

# Metrics
duration: 10min
completed: 2026-03-24
---

# Phase 20 Plan 02: Dark Mode JS Toggle and Contrast Audit Summary

**initDarkMode() function with localStorage persistence, aria-pressed management, icon switching, and WCAG AAA contrast verified for all dark token pairs**

## Performance

- **Duration:** ~10 min (including human verification checkpoint)
- **Completed:** 2026-03-24
- **Tasks:** 2
- **Files modified:** 1 (js/main.js) + 1 auto-fix (css/styles.css via deviation)

## Accomplishments

- Added `initDarkMode()` function inside the existing ES5 IIFE in `js/main.js` — 42 lines; called as the last entry in `initAll()`
- Implemented `applyTheme(theme)` inner function that atomically handles: `document.documentElement.setAttribute('data-theme', ...)`, `localStorage.setItem('theme', ...)`, `aria-pressed` toggle, icon character swap (sun/moon), `meta[name="theme-color"]` update for Android status bar
- Theme persists across page reload — hard-refresh with saved dark preference shows dark immediately (no FOUC, handled by Plan 01 inline script)
- First-visit OS dark preference correctly shows dark mode; after user explicitly chooses light, localStorage wins on all subsequent visits (DM-04 default-light policy)
- Contrast audit completed — all 7 dark token pairs pass WCAG AA (4.5:1 minimum); body text passes AAA (7:1 target)

## Contrast Audit Results

All ratios measured with dark base `#0F1923`:

| Token pair | Text colour | Ratio | Standard |
|---|---|---|---|
| Body text (--color-text) | #E0ECF8 | 14.8:1 | AAA pass |
| Primary blue (--color-primary) | #5FD5F9 | 10.45:1 | AAA pass |
| Primary dark blue (--color-primary-dark) | #38C6F4 | 8.92:1 | AAA pass |
| Secondary green (--color-secondary) | #3FCF88 | 8.86:1 | AAA pass |
| Secondary dark green (--color-secondary-dark) | #1AC67E | 7.96:1 | AAA pass |
| Badge text (#0D3324 bg / #3FCF88 text) | #3FCF88 on #0D3324 | 6.92:1 | AA pass |

All pairs exceed 4.5:1 AA. All main text pairs exceed 7:1 AAA.

## Task Commits

Each task committed atomically:

1. **Task 1: Add initDarkMode() and wire to initAll()** — `f0f5d8e` (feat)
2. **Task 2 (auto-fix deviation): Replace hardcoded hero background with var(--color-white)** — `8aa49fb` (fix)
3. **Task 2: Contrast audit checkpoint** — approved by human verification

## Files Created/Modified

- `js/main.js` — `initDarkMode()` function added (42 lines), `initDarkMode()` call added as last entry in `initAll()`
- `css/styles.css` — `.hero` selector: hardcoded `background: #ffffff` replaced with `var(--color-white)` (deviation Rule 1 auto-fix)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed .hero hardcoded background breaking dark mode cascade**
- **Found during:** Task 2 contrast audit
- **Issue:** `.hero` had a hardcoded `background: #ffffff` that overrode the CSS token cascade, causing the hero section to remain white in dark mode regardless of the `[data-theme="dark"]` token override
- **Fix:** Replaced `background: #ffffff` with `background: var(--color-white)` so the dark mode token `--color-white: #0F1923` correctly applies in dark mode
- **Files modified:** css/styles.css
- **Commit:** `8aa49fb`

## Known Stubs

None — dark mode is fully functional end-to-end: toggle wired, persistence works, all sections render correctly in dark mode via the token cascade.

## Self-Check: PASSED

- FOUND: js/main.js
- FOUND: css/styles.css (deviation fix)
- FOUND commit: f0f5d8e (Task 1 — initDarkMode)
- FOUND commit: 8aa49fb (Task 2 deviation — hero background fix)

---
*Phase: 20-dark-mode-token-infrastructure*
*Completed: 2026-03-24*
