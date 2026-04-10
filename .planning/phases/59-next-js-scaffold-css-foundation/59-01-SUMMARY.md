---
phase: 59-next-js-scaffold-css-foundation
plan: 01
subsystem: infra
tags: [next.js, tailwind-v4, postcss, typescript, react-19, fonts, css-tokens]

# Dependency graph
requires: []
provides:
  - "Next.js 15 App Router project skeleton in next/ subdirectory"
  - "Tailwind CSS v4 via @tailwindcss/postcss with full theme token pipeline"
  - "Self-hosted Inter + Manrope fonts via next/font/local"
  - "50+ CSS custom properties (brand colors, glass, motion, grid) mapped to Tailwind utilities"
  - "Dark mode token overrides via .dark class"
  - "Production build (standalone output) verified working"
affects: [59-02, 60-component-library, 61-page-sections]

# Tech tracking
tech-stack:
  added: [next@15.5.15, react@19.1.0, react-dom@19.1.0, tailwindcss@4, "@tailwindcss/postcss@4", tw-animate-css@1.4.0, typescript@5, eslint-config-next@15.5.15]
  patterns: [next-font-local-css-variable-injection, tailwind-v4-theme-inline, css-custom-property-to-utility-mapping, standalone-output-docker-ready]

key-files:
  created:
    - next/package.json
    - next/tsconfig.json
    - next/next.config.ts
    - next/postcss.config.mjs
    - next/src/app/layout.tsx
    - next/src/app/globals.css
    - next/src/app/page.tsx
    - next/src/fonts/inter-latin-wght-normal.woff2
    - next/src/fonts/inter-cyrillic-wght-normal.woff2
    - next/src/fonts/manrope-latin-wght-normal.woff2
    - next/src/fonts/manrope-cyrillic-wght-normal.woff2
  modified: []

key-decisions:
  - "next/font/local with --font-family-body-next and --font-family-heading-next CSS variables injected on html, consumed in globals.css via var() fallback chain"
  - "Single globals.css entry point merges tailwind.css imports and theme.css tokens (no separate files) for Next.js automatic source detection"
  - "sideEffects: ['*.css'] in package.json prevents Webpack CSS reordering in production builds"

patterns-established:
  - "Font loading: next/font/local with variable property, applied via className on html element"
  - "Token architecture: CSS custom properties in :root, mapped to Tailwind via @theme inline"
  - "Dark mode: @custom-variant dark (&:is(.dark *)) with .dark class overrides"

requirements-completed: [SCAF-01]

# Metrics
duration: 7min
completed: 2026-04-10
---

# Phase 59 Plan 01: Next.js Scaffold + CSS Foundation Summary

**Next.js 15 project with Tailwind v4, self-hosted Inter/Manrope fonts, and 50+ ported theme tokens (brand, glass, motion, grid) verified via production build**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-10T19:35:23Z
- **Completed:** 2026-04-10T19:42:48Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Next.js 15.5.x App Router project scaffolded in `next/` with React 19, TypeScript, ESLint, Turbopack dev server
- Tailwind CSS v4 pipeline via @tailwindcss/postcss with all MedicusUnion brand tokens mapped to utility classes (bg-mu-green-500, text-mu-text-900, etc.)
- Inter and Manrope fonts self-hosted via next/font/local with CSS variable injection (--font-family-body-next, --font-family-heading-next)
- Full theme token port: brand colors, green/text ramps, accent colors, WCAG-accessible text variants, CTA gradient, vertical rhythm, glass hierarchy, squircle masks, motion tokens, dark mode overrides
- Production build (standalone output) succeeds with exit code 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15 project and configure build pipeline** - `71343ec` (chore)
2. **Task 2: Port fonts, theme tokens, and root layout** - `4afff9e` (feat)

## Files Created/Modified
- `next/package.json` - Next.js 15 with sideEffects CSS config, tw-animate-css, turbopack dev
- `next/tsconfig.json` - TypeScript config with @/* path alias
- `next/next.config.ts` - Standalone output, AVIF/WebP image formats
- `next/postcss.config.mjs` - Tailwind v4 PostCSS plugin
- `next/eslint.config.mjs` - Next.js ESLint config
- `next/src/app/layout.tsx` - Root layout with Inter/Manrope font loading, lang=ru, globals.css import
- `next/src/app/globals.css` - Single CSS entry with Tailwind v4, all theme tokens, dark mode, base/utility/component layers
- `next/src/app/page.tsx` - Scaffold page testing Tailwind token resolution with colored squares
- `next/src/fonts/*.woff2` - 4 self-hosted font files (Inter latin/cyrillic, Manrope latin/cyrillic)

## Decisions Made
- Used next/font/local with CSS variable injection pattern (--font-family-body-next consumed via var() fallback in globals.css) rather than direct font-family assignment, maintaining compatibility with existing token architecture
- Merged tailwind.css and theme.css into single globals.css entry point since Next.js automatically detects sources (no @source directives needed)
- Added sideEffects: ["*.css"] to package.json per Next.js GitHub Issue #79531 to prevent CSS import reordering in Webpack production builds

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The `next/` directory already existed from a prior scaffold attempt with config files already customized (package.json, next.config.ts, postcss.config.mjs). Verified existing state matched plan requirements rather than re-scaffolding. Layout, globals.css, and page.tsx were still default Next.js templates and were replaced as planned.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Next.js build pipeline verified, ready for Plan 02 (liquid-glass CSS port, squircle utilities, component extraction)
- All theme tokens available as both CSS custom properties and Tailwind utility classes
- Font loading operational, dark mode token overrides in place

## Self-Check: PASSED

All 11 created files verified present. Both task commits (71343ec, 4afff9e) verified in git log. SUMMARY.md exists.

---
*Phase: 59-next-js-scaffold-css-foundation*
*Completed: 2026-04-10*
