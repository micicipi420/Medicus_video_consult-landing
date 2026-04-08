---
phase: 25-migrate-to-tailwind-css-v4
plan: "04"
title: "Service/Contact Pages Tailwind Migration"
subsystem: frontend-html
tags: [tailwind, migration, multi-page, glassmorphism]
dependency_graph:
  requires: ["25-01", "25-02", "25-03"]
  provides: ["all-pages-tailwind-classes"]
  affects: ["css/tw-output.css"]
tech_stack:
  added: []
  patterns: ["TSX-to-HTML class mapping", "shared shell pattern across pages"]
key_files:
  created: []
  modified:
    - online-consultations.html
    - treatment-abroad.html
    - checkups.html
    - contacts.html
decisions:
  - "Shared header/footer/mesh-bg/mobile-menu/sticky-bar copy-pasted from index.html for pixel-perfect consistency"
  - "Page-specific content sections mapped 1:1 from TSX className strings to HTML class attributes"
  - "contacts.html form inputs use Tailwind glass input pattern from ContactsPage.tsx (backdrop-blur-md, focus:ring-4, inset shadow)"
metrics:
  duration_minutes: 16
  completed: "2026-04-04"
  tasks: 2
  files_modified: 4
---

# Phase 25 Plan 04: Service/Contact Pages Tailwind Migration Summary

Migrated all 4 non-index HTML pages to Tailwind CSS v4 utility classes by mapping className strings from their React TSX page components in the Redesign/ folder, completing the site-wide Tailwind class migration.

## What Was Done

### Task 1: online-consultations.html and treatment-abroad.html (21ee316)
- Replaced BEM-only shared elements (header, footer, mesh bg, mobile menu, sticky bar) with Tailwind-enriched versions identical to index.html
- Added `<link rel="stylesheet" href="css/tw-output.css">` and inline `<style>` block for JS-toggled states
- Mapped all page-specific section classes from OnlineConsultationsPage.tsx:
  - Hero with glass badge, gradient H1, image frame with `rounded-[3rem]` and `shadow-glass-lg`
  - 6-card features grid with `bg-white/60 backdrop-blur-2xl rounded-[2.5rem]` and hover effects
  - 4-step "how it works" with step number opacity and hover transitions
  - Specializations section with glass pill badges
  - CTA section with decorative blur blobs
- Mapped all page-specific section classes from TreatmentAbroadPage.tsx:
  - 8-card countries grid with `grid-cols-2 md:grid-cols-4`
  - 6-card "what's included" features with icon containers
  - 4-step process with `text-mu-blue/15` step numbers
  - CTA with green decorative blur blob

### Task 2: checkups.html and contacts.html (73f201d)
- Same shared element migration as Task 1
- Mapped CheckupsPage.tsx classes:
  - Hero with glass badge and gradient title
  - 6-card features grid
  - 3-column pricing cards with `rounded-[3rem]`, flex-col layout, popular badge
  - CTA section
- Mapped ContactsPage.tsx classes:
  - Centered hero with gradient title
  - Coordinator card with glass styling and avatar
  - 2x2 contact method grid with icon containers
  - Trust badge pills with glass styling
  - Contact form with Tailwind glass inputs (`backdrop-blur-md`, `focus:ring-4 focus:ring-mu-blue/20`, `shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]`)
  - All JS-targeted classes preserved: `contact-form`, `form__submit`, `form__input`, `form__select`, `form__textarea`, `form__error`, `form__success`

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Shared shell copy from index.html**: Rather than manually constructing header/footer for each page, copied the complete Tailwind-enriched versions from index.html (Plans 02-03). This guarantees identical rendering across all 5 pages.
2. **TSX className direct mapping**: Used exact className strings from TSX components rather than inventing Tailwind classes. This ensures the HTML pages match the Redesign prototype pixel-for-pixel.
3. **contacts.html form glass inputs**: Applied the exact input styling from ContactsPage.tsx including the `shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]` arbitrary value for inner shadow, matching the Redesign form UX.

## Known Stubs

None. All sections have real content and proper Tailwind class coverage.

## Self-Check: PASSED

- [x] online-consultations.html exists, 39 backdrop-blur occurrences
- [x] treatment-abroad.html exists, 34 backdrop-blur occurrences
- [x] checkups.html exists, 27 backdrop-blur occurrences
- [x] contacts.html exists, 27 backdrop-blur occurrences
- [x] Commit 21ee316 (Task 1) found
- [x] Commit 73f201d (Task 2) found
