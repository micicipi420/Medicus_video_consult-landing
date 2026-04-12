---
phase: 68-design-tokens-layout-chrome
plan: 01
subsystem: ui
tags: [css-tokens, tailwind, navigation, mesh-background, next-layout]

requires:
  - phase: 67.1-visual-parity-rework
    provides: Production utility classes and tokens ported to Next.js globals.css
provides:
  - Updated CSS design tokens (green ramp, selection styles, deprecated markers)
  - Navigation data with 5 NAV_LINKS, FOOTER_SERVICES_LINKS, FOOTER_NAV_LINKS
  - MeshBackground server component (3 gradient blobs + frosted overlay)
  - Layout wrapper with z-10 main, pt-24 header clearance, section gap spacing
affects: [68-02-header-footer, 68-03-mobile-menu-sticky-bar, 69-sections]

tech-stack:
  added: []
  patterns: [mesh-gradient-background-layer, z-layer-separation, deprecated-class-markers]

key-files:
  created:
    - next/src/components/layout/MeshBackground.tsx
  modified:
    - next/src/app/globals.css
    - next/src/lib/navigation.ts
    - next/src/app/layout.tsx
    - next/package.json

key-decisions:
  - "Remove dark mode completely -- new design is light-only"
  - "Mark production utility classes DEPRECATED rather than delete -- ~55 references still depend on them"
  - "Switch dev script from Turbopack to Webpack -- Turbopack has open backdrop-filter bug #78302"
  - "MeshBackground as server component -- purely decorative, no client interactivity needed"
  - "pt-24 on main for fixed header clearance (76px header + 16px offset + breathing room)"

patterns-established:
  - "DEPRECATED comment markers for phased migration of production classes"
  - "z-layer separation: mesh z-0, main content z-10"
  - "Section spacing via flex-col gap-8 md:gap-16 on main element"

requirements-completed: [LAY-03]

duration: 5min
completed: 2026-04-12
---

# Phase 68 Plan 01: Design Tokens, Navigation Data, and Mesh Background Summary

**CSS design tokens updated (dark mode removed, green ramp added), navigation restructured with 5 links + footer arrays, MeshBackground gradient component layered behind z-10 content**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-12T16:30:28Z
- **Completed:** 2026-04-12T16:36:10Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Removed dark mode variant and `.dark` block from globals.css, establishing light-only design foundation
- Added green-200/400/900 tokens to both :root and @theme inline for Tailwind class generation
- Added body ::selection styles with mu-blue tint for brand-consistent text selection
- Restructured navigation.ts: 5 NAV_LINKS (added "O kompanii"), split footer links into FOOTER_SERVICES_LINKS + FOOTER_NAV_LINKS, updated tagline
- Created MeshBackground server component with 3 gradient blobs and frosted overlay at z-0
- Updated layout.tsx: MeshBackground rendered, main element elevated to z-10 with pt-24 header clearance and section gap spacing

## Task Commits

Each task was committed atomically:

1. **Task 1: Update design tokens in globals.css, navigation data, and dev script** - `88f76a5` (feat)
2. **Task 2: Create MeshBackground component and update layout.tsx** - `1ecd4e0` (feat)
3. **Package lock** - `9389b76` (chore: package-lock.json for reproducible installs)

## Files Created/Modified
- `next/src/app/globals.css` - Removed dark mode, added green ramp tokens, selection styles, deprecated markers
- `next/src/lib/navigation.ts` - 5 NAV_LINKS, FOOTER_SERVICES_LINKS, FOOTER_NAV_LINKS, updated TAGLINE
- `next/package.json` - Dev script switched from Turbopack to Webpack
- `next/package-lock.json` - Lock file for reproducible installs
- `next/src/components/layout/MeshBackground.tsx` - New server component: 3 gradient blobs + frosted overlay
- `next/src/app/layout.tsx` - Integrated MeshBackground, updated body/main classes

## Decisions Made
- Removed dark mode entirely (`.dark` block + `@custom-variant dark`) -- new design is light-only
- Marked production utility classes as DEPRECATED rather than deleting -- ~55 references across section components still depend on them
- Switched dev script from `next dev --turbopack` to `next dev` -- Turbopack has open backdrop-filter rendering bug (#78302), kept `dev:turbo` as opt-in
- MeshBackground implemented as server component (no `'use client'`) -- purely decorative, no interactivity
- Used `pt-24` (96px) on main for fixed header clearance above mesh background

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm install required in worktree**
- **Found during:** Task 1 verification (build step)
- **Issue:** Worktree had no node_modules -- `npx next build` could not find the `next` binary
- **Fix:** Ran `npm install` to install dependencies, committed package-lock.json
- **Files modified:** next/package-lock.json
- **Verification:** `npx next build` exits 0
- **Committed in:** 9389b76

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Standard worktree setup, no scope change.

## Issues Encountered
None beyond the worktree dependency installation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CSS tokens ready for Header, Footer, MobileMenu, StickyBar components (plans 02 and 03)
- Navigation data (NAV_LINKS, FOOTER_SERVICES_LINKS, FOOTER_NAV_LINKS) ready for consumption
- MeshBackground renders at z-0, all content above at z-10
- Build passes cleanly with all changes

---
*Phase: 68-design-tokens-layout-chrome*
*Completed: 2026-04-12*
