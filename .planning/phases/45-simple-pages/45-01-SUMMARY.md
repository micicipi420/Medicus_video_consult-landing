---
phase: 45-simple-pages
plan: 01
subsystem: 404-page
tags: [migration, liquid-glass, squircle, grid-wrapper, v4.0]
dependency_graph:
  requires: [42-01, 43-01, 44-01]
  provides: [404-v4-migrated]
  affects: [404.html]
tech_stack:
  added: []
  patterns: [liquid-card-wrap shadow-wrap, squircle-xl card surface, liquid-btn-primary CTA, max-w-1200px grid wrapper]
key_files:
  created: []
  modified: [404.html]
decisions:
  - "Shadow-wrap pattern applied: liquid-card-wrap outer div carries box-shadow, inner liquid-card squircle-xl carries mask + glass material"
  - "Grid wrapper uses max-w-[1200px] per 41-REVIEW.md namespace bug note (not max-w-content)"
  - "CTA classes consolidated: liquid-btn-primary squircle-md replaces 8 individual Tailwind utility classes for gradient/shadow/hover"
metrics:
  duration: 15min
  completed: "2026-04-09T10:49:32Z"
  tasks: 1
  files: 1
---

# Phase 45 Plan 01: 404 Page v4.0 Migration Summary

Migrated 404.html main content to v4.0 Liquid Design System -- grid wrapper (max-w-[1200px]), liquid-card squircle-xl glass surface with shadow-wrap pattern, squircle-md CTA button replacing 8 utility classes with liquid-btn-primary.

## Task Results

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate 404.html main content to v4.0 design system | 3f9b3d4 | 404.html |

## Changes Made

### 404.html Main Content (lines 123-138)

**Grid wrapper added:**
- Old: `<div class="text-center max-w-lg mx-auto px-4">`
- New: `<div class="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">` as outer container

**Liquid card surface added:**
- New shadow-wrap: `<div class="liquid-card-wrap max-w-lg mx-auto">`
- New glass card: `<div class="liquid-card squircle-xl text-center p-8 md:p-12">`

**CTA button migrated:**
- Old: `bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 inline-flex items-center gap-2 mx-auto hover:shadow-xl hover:shadow-mu-blue/40 transition-shadow`
- New: `liquid-btn-primary squircle-md px-8 py-4 font-bold inline-flex items-center gap-2 mx-auto`

**Preserved exactly:**
- Gradient "404" text div (unchanged)
- h1 with 2 nbsp entities (unchanged)
- p with 4 nbsp entities (unchanged)
- SVG arrow icon in CTA (unchanged)
- "На главную" link text (unchanged)
- All 11 nbsp entities across page (verified)
- All chrome BUILD blocks (header, mobile-menu, footer, sticky-bar, svg-defs) untouched

## Verification Results

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| make build | exit 0 | exit 0 | PASS |
| nbsp count | 11 | 11 | PASS |
| squircle- count | >= 2 | 17 | PASS |
| liquid-card count | >= 2 | 3 | PASS |
| liquid-btn-primary count | >= 1 | 1 | PASS |
| max-w-[1200px] count | >= 1 | 2 | PASS |
| rounded-3xl in main content | 0 | 0 | PASS |

## Decisions Made

1. **Shadow-wrap pattern**: Applied liquid-card-wrap as outer shadow div, inner liquid-card squircle-xl carries mask + glass. This follows the documented anti-pattern avoidance (never apply box-shadow AND mask-image on same element).
2. **Grid wrapper token**: Used `max-w-[1200px]` (arbitrary value) instead of `max-w-content` per the 41-REVIEW.md namespace bug note.
3. **CTA class consolidation**: `liquid-btn-primary` encapsulates gradient, shadow, specular edge, hover brightness, and active scale -- replacing 8 individual utility classes.

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED
