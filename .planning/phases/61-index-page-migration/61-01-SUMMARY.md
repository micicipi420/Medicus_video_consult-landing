---
phase: 61-index-page-migration
plan: 01
subsystem: frontend/sections
tags: [react, server-components, html-to-jsx, svg, tailwind]
dependency_graph:
  requires: [60-01, 60-02]
  provides: [index-page-sections]
  affects: [next/src/components/sections/]
tech_stack:
  added: []
  patterns: [server-component, inline-svg-jsx, tailwind-utility, next-link]
key_files:
  created:
    - next/src/components/sections/HeroHub.tsx
    - next/src/components/sections/StatsBar.tsx
    - next/src/components/sections/ServicesGrid.tsx
    - next/src/components/sections/GuideGrid.tsx
    - next/src/components/sections/AdvantagesGrid.tsx
    - next/src/components/sections/FinalCTA.tsx
  modified: []
decisions:
  - Plain <a> tags for hash anchors and tel: links (not next/link)
  - next/link for internal routes (/consultations, /treatment-abroad, /checkup)
  - Inline SVG as separate React components within each file
  - Data arrays with typed const for repeated card patterns
metrics:
  duration: 262s
  completed: 2026-04-11T04:29:35Z
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 0
---

# Phase 61 Plan 01: Index Page Static Sections Summary

6 React Server Components ported verbatim from index.html with inline SVG-to-JSX conversion, Tailwind utility classes, and next/link for internal routes

## What Was Done

### Task 1: HeroHub, StatsBar, ServicesGrid (commit defd096)

Created 3 Server Components:

- **HeroHub.tsx** -- Hero section with gradient background (from-[#F0F7FF] to-white), centered h1/subtitle, and 2 CTA buttons using hash anchors (`#services`, `#contact`). Gradient CTA button uses `from-mu-cta-from to-mu-cta-to` tokens.

- **StatsBar.tsx** -- Dark navy (#1A365D) stats bar with 4 items (43 clinics, 11 countries, 500+ doctors, 15+ years). Data extracted into typed const array. Static numbers rendered (animated counters deferred to Phase 63).

- **ServicesGrid.tsx** -- 3-column product card grid with:
  - 3 inline SVG icons converted to JSX (camelCase attributes: strokeWidth, strokeLinecap, strokeLinejoin)
  - Mint badges (bg-[#d0fae4], text-[#007955])
  - 3-item feature lists
  - CTA links using next/link for internal routes (/consultations, /treatment-abroad, /checkup)

### Task 2: GuideGrid, AdvantagesGrid, FinalCTA (commit 974cdce)

Created 3 Server Components:

- **GuideGrid.tsx** -- 3-column guide items on #F0F7FF background. Each item has 48x48 SVG icon, title, description, and next/link arrow link to subpages. Arrow character uses unicode \u2192.

- **AdvantagesGrid.tsx** -- 4-column (responsive: 1/2/4) advantage cards with SVG icons and `<span>`-wrapped number highlights (43, 11, 15+, 10 000+). All text verbatim from index.html.

- **FinalCTA.tsx** -- Dark navy (#1A365D) section with centered heading, subtitle, gradient CTA button (#contact hash), and outline call button using `tel:${PHONE_NUMBER}` from navigation constants.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Plain `<a>` for hash/tel links, next/link for routes** -- Hash anchors (#services, #contact) and tel: protocol links use plain `<a>` tags since they don't need client-side routing. Internal routes (/consultations, /treatment-abroad, /checkup) use next/link for prefetching.

2. **SVG icons as separate React components** -- Each inline SVG extracted as a named component (ConsultationIcon, GlobeIcon, etc.) within the same file for readability and reuse within the data array pattern.

3. **Typed const arrays for card data** -- Service cards, guide items, advantages, and stats all use typed const arrays mapped in JSX, matching the pattern established in Footer.tsx (FOOTER_NAV_LINKS).

## Verification

- TypeScript: `npx tsc --noEmit` passes with zero errors
- All 6 files exist in next/src/components/sections/
- No file contains "use client" -- all are Server Components
- All 6 files export named functions
- All Russian text content matches index.html verbatim (with HTML entity conversion)

## Self-Check: PASSED

- All 6 component files exist on disk
- Commit defd096 (Task 1) exists in git history
- Commit 974cdce (Task 2) exists in git history
