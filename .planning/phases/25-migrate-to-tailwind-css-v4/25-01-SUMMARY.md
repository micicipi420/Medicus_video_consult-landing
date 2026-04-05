---
phase: 25-migrate-to-tailwind-css-v4
plan: 01
subsystem: infra
tags: [tailwind-css-v4, standalone-cli, css-build-pipeline, design-tokens]

# Dependency graph
requires:
  - phase: 01-apply-redesign-from-redesign-folder-to-main-project
    provides: Redesign/src/styles/ source files (theme.css, fonts.css, tailwind.css)
provides:
  - Tailwind CSS v4 standalone CLI binary (tailwindcss v4.2.2, macOS arm64)
  - src/styles/ directory with theme tokens, font-face declarations, and Tailwind entry point
  - Working build command: ./tailwindcss -i src/styles/tailwind.css -o css/tw-output.css
affects: [25-02, 25-03, 25-04, 25-05]

# Tech tracking
tech-stack:
  added: [tailwindcss-v4.2.2-standalone-cli]
  patterns: [standalone-cli-no-npm, source-none-with-explicit-source-glob]

key-files:
  created:
    - src/styles/tailwind.css
    - src/styles/theme.css
    - src/styles/fonts.css
    - src/styles/index.css
  modified:
    - .gitignore

key-decisions:
  - "Tailwind standalone CLI (no npm/Node.js) -- keeps stack constraint of no build tooling dependencies"
  - "source(none) with explicit @source glob for *.html -- scans only root HTML files, not node_modules or Redesign"
  - "Removed tw-animate-css import -- animations handled by js/animations.js + Motion CDN, not Tailwind plugin"
  - "index.css kept as documentation reference only -- tailwind.css is the actual entry point"

patterns-established:
  - "Build command: ./tailwindcss -i src/styles/tailwind.css -o css/tw-output.css"
  - "Theme tokens in @theme inline block, brand variables in :root, dark overrides in .dark"

requirements-completed: [TW-SETUP, TW-THEME]

# Metrics
duration: 3min
completed: 2026-04-04
---

# Phase 25 Plan 01: Tailwind CSS v4 Standalone CLI Setup Summary

**Tailwind CSS v4.2.2 standalone CLI with full MedicusUnion design token theme, SF Pro font-face declarations, and verified build pipeline producing valid CSS from HTML source scanning**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T07:31:14Z
- **Completed:** 2026-04-04T07:34:42Z
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments
- Downloaded Tailwind CSS v4.2.2 standalone CLI binary for macOS arm64 (73MB, no Node.js needed)
- Created src/styles/ directory with theme.css (268 lines: brand colors, glass shadows, dark mode, @theme inline mapping), tailwind.css (entry point), fonts.css (SF Pro Display/Rounded)
- Adapted Redesign entry point: removed tw-animate-css npm import, changed @source from TSX to HTML glob
- Verified build produces 409-line CSS output with all theme tokens, glass shadows, and font declarations

## Task Commits

Each task was committed atomically:

1. **Task 1: Download Tailwind CLI standalone and create src/styles/ with Redesign theme files** - `6cc8c58` (feat)

## Files Created/Modified
- `src/styles/tailwind.css` - Tailwind entry point: imports fonts + tailwindcss + theme, scans *.html
- `src/styles/theme.css` - Full design token set: MedicusUnion brand colors, green ramp, text neutrals, UI accents, glass shadows, dark mode, @theme inline mapping
- `src/styles/fonts.css` - @font-face declarations for SF Pro Display and SF Pro Rounded (local sources)
- `src/styles/index.css` - Reference-only file documenting the React-to-standalone entry point change
- `.gitignore` - Added tailwindcss binary and css/tw-output.css exclusions

## Decisions Made
- Used Tailwind standalone CLI instead of npm package to preserve the "no Node.js/no npm" stack constraint
- Used `source(none)` with explicit `@source '../../*.html'` to scan only root-level HTML files
- Removed `@import 'tw-animate-css'` since animations are handled by js/animations.js with Motion CDN
- Kept index.css as documentation reference only; tailwind.css is the build entry point

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all files contain production-ready content.

## Next Phase Readiness
- Tailwind build pipeline operational, ready for Plan 25-02 (HTML class migration)
- All theme tokens from Redesign available for utility class usage
- Build command documented in index.css and this summary

## Self-Check: PASSED

- All 5 created/modified files exist
- Task commit 6cc8c58 verified in git log
- tailwindcss binary present and executable
- Build produces valid CSS output (409 lines, 11KB)

---
*Phase: 25-migrate-to-tailwind-css-v4*
*Completed: 2026-04-04*
