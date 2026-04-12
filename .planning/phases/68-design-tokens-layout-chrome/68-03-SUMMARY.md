---
phase: 68-design-tokens-layout-chrome
plan: 03
subsystem: ui
tags: [glass, footer, stickybar, layout-chrome, tailwindcss, next.js, lucide-react]

# Dependency graph
requires:
  - phase: 68-01
    provides: navigation.ts with FOOTER_SERVICES_LINKS, FOOTER_NAV_LINKS, TAGLINE; globals.css glass shadow tokens
provides:
  - Glass card footer with 4-column layout, legal entities, trust badges
  - Glass floating StickyBar with smart anchor routing via usePathname
affects: [phase-69-sections, page-layouts]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Glass card container pattern: bg-white/60 backdrop-blur-3xl rounded-[Nrem] border border-white/60 shadow-glass-lg"
    - "Smart anchor routing: usePathname() to switch between #anchor on index vs /page on other pages"
    - "Glass pill icon: bg-white/60 backdrop-blur-md rounded-xl border shadow-glass-inner-strong wrapping lucide icon"

key-files:
  created: []
  modified:
    - next/src/components/layout/Footer.tsx
    - next/src/components/layout/StickyBar.tsx

key-decisions:
  - "Footer uses Link for internal routes and <a> for hash links -- handles Next.js routing correctly for mixed href types"
  - "StickyBar translate-y offset uses calc(100%+16px) to fully clear bottom-4 floating position"

patterns-established:
  - "Glass card footer: 4-column grid with Company/Services/Navigation/Contacts structure"
  - "Trust badge row: Shield + Globe lucide icons in bottom bar with ISO/GDPR/AstanaHub labels"
  - "Smart CTA routing: usePathname === '/' for index-specific anchors vs page navigation"

requirements-completed: [LAY-01, LAY-02]

# Metrics
duration: 3min
completed: 2026-04-12
---

# Phase 68 Plan 03: Footer & StickyBar Summary

**Glass card footer with 4-column layout (Company/Services/Navigation/Contacts), legal entities, trust badges, and floating glass StickyBar with smart anchor routing via usePathname**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-12T16:38:39Z
- **Completed:** 2026-04-12T16:41:36Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Footer rewritten from dark bg-[#1A365D] to glass card (bg-white/60 backdrop-blur-3xl rounded-[3rem]) with 4-column grid layout
- Footer includes legal entities (MedicusUnion GmbH Wien + TOO MedicusUnion KZ Almaty), trust badges (ISO 27001, GDPR, Astana Hub) with Shield/Globe icons
- StickyBar upgraded to floating glass bar with smart CTA routing (#contact on index, /contacts on service pages) via usePathname

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite Footer.tsx to glass card with 4-column layout** - `7321b06` (feat)
2. **Task 2: Rewrite StickyBar.tsx with glass styling and smart anchor routing** - `65f4538` (feat)

## Files Created/Modified
- `next/src/components/layout/Footer.tsx` - Glass card footer with 4 columns (Company with gradient logo + legal entities, Services via FOOTER_SERVICES_LINKS, Navigation via FOOTER_NAV_LINKS, Contacts with glass pill phone/email icons), trust badge bottom bar
- `next/src/components/layout/StickyBar.tsx` - Floating glass sticky bar with gradient CTA, smart routing via usePathname, IntersectionObserver hide-on-contact/footer preserved

## Decisions Made
- Footer uses Next.js `Link` for internal routes (`/contacts`, `/privacy`, etc.) and plain `<a>` for hash links (`/#clinics`, `/#why-us`) to correctly handle client-side vs anchor navigation
- StickyBar hide translation uses `calc(100%+16px)` instead of plain `translate-y-full` to account for the bottom-4 (16px) floating offset so the bar fully disappears below viewport edge
- App Store / Google Play badges intentionally omitted from footer per CONTEXT.md decision (no live apps to link to)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `node_modules` missing in worktree -- installed via `npm install` before build verification. Standard worktree setup, not a code issue.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All Phase 68 layout chrome components complete (Header, MobileMenu, MeshBackground from Plans 01-02; Footer, StickyBar from Plan 03)
- Phase 69 (section content) can proceed -- layout chrome provides consistent glass design language across all persistent UI elements

---
*Phase: 68-design-tokens-layout-chrome*
*Completed: 2026-04-12*
