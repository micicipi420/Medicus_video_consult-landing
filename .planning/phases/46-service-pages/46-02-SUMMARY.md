---
phase: 46-service-pages
plan: 02
subsystem: online-consultations-page
tags: [liquid-glass, squircle, grid-migration, css-migration, v4.0]
dependency_graph:
  requires: [liquid-glass.css, squircles.css, theme.css]
  provides: [online-consultations.html v4.0 migrated]
  affects: [css/styles.css]
tech_stack:
  added: []
  patterns: [liquid-card-wrap > liquid-card squircle-*, liquid-regular squircle-full badges, liquid-btn-primary squircle-md CTAs, 12-col grid layout]
key_files:
  created: []
  modified: [online-consultations.html, css/styles.css]
decisions:
  - "Country cards use squircle-lg (medium) not squircle-xl (large) -- smaller cards benefit from tighter radius"
  - "Advantage 5 uses md:col-span-8 to fill remaining space at md breakpoint, lg:col-span-4 to fit 3+2 row"
  - "hover:brightness-105 replaces hover:shadow-glass-lg -- glass material uses filter:brightness for hover instead of shadow"
metrics:
  duration: 12m17s
  completed: 2026-04-09
  tasks_completed: 1
  tasks_total: 1
  files_modified: 2
---

# Phase 46 Plan 02: Online Consultations Page v4.0 Migration Summary

Migrated online-consultations.html 12-section main content from v3.x glass classes to v4.0 Liquid Design System -- liquid-card-wrap shadow wrappers, squircle mask shapes, 12-column grid layout, liquid-btn CTA buttons.

## Completed Tasks

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Migrate online-consultations.html 12 sections to v4.0 design system | `26577dd` | online-consultations.html, css/styles.css |

## Changes Made

### Section-by-Section Migration (12 sections)

**Section 1 (Hero):** Container to max-w-[1200px], grid to 12-col with col-span-6/6, badge to liquid-regular squircle-full, primary CTA to liquid-btn-primary squircle-md, secondary CTA to liquid-btn-secondary squircle-md, image frame to liquid-card-wrap > squircle-xl.

**Section 2 (Features):** 6 cards each wrapped in liquid-card-wrap > liquid-card squircle-xl, icon boxes to liquid-regular squircle-md, grid to 12-col with col-span-4.

**Section 3 (Problem):** Single card to liquid-card-wrap > liquid-card squircle-xl.

**Section 4 (Benefits):** 4 cards each wrapped in liquid-card-wrap > liquid-card squircle-xl, icon boxes to liquid-regular squircle-md, grid to 12-col with col-span-6.

**Section 5 (Process):** 3 step cards each wrapped in liquid-card-wrap > liquid-card squircle-xl, grid to 12-col with col-span-4.

**Section 6 (Doctors):** Info card to liquid-card-wrap > liquid-card squircle-xl, 7 country cards to liquid-card-wrap > liquid-card squircle-lg with squircle-full flags, specialization container to liquid-card-wrap > liquid-card squircle-xl, 14 badges to liquid-regular squircle-full, "Все врачи" link to liquid-btn-secondary squircle-md.

**Section 7 (Why MedicusUnion):** 5 advantage cards each wrapped in liquid-card-wrap > liquid-card squircle-xl, icon boxes to liquid-regular squircle-md, grid to 12-col with col-span-4.

**Section 8 (Triggers):** Card to liquid-card-wrap > liquid-card squircle-xl, 5 check circles to liquid-regular squircle-full.

**Section 9 (Pricing):** Card to liquid-card-wrap > liquid-card squircle-xl, badge to liquid-regular squircle-full, CTA to liquid-btn-primary squircle-md.

**Section 10 (Form):** Grid to 12-col with col-span-5/7, form container to liquid-card-wrap > liquid-card squircle-xl, inputs from rounded-2xl to squircle-md, submit button to liquid-btn-primary squircle-md, trust badges to liquid-regular squircle-full.

**Section 11 (FAQ):** 6 accordion items from bg-white/60 backdrop-blur-2xl rounded-2xl to liquid-regular squircle-md overflow-hidden.

**Section 12 (Final CTA):** Card to liquid-card-wrap > liquid-card squircle-xl, primary CTA to liquid-btn-primary squircle-md, secondary CTA to liquid-btn-secondary squircle-md.

## Verification Results

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| nbsp entities | 203 | 203 | PASS |
| visually-hidden | 2 | 2 | PASS |
| role="alert" | 4 | 4 | PASS |
| aria-live | 4 | 4 | PASS |
| rounded-[ in main | 0 | 0 | PASS |
| rounded-2xl in main | 0 | 0 | PASS |
| rounded-3xl in main | 0 | 0 | PASS |
| container mx-auto in main | 0 | 0 | PASS |
| squircle- count | >= 60 | 110 | PASS |
| liquid-card count | >= 30 | 66 | PASS |
| liquid-btn-primary count | >= 2 | 4 | PASS |
| max-w-[1200px] count | >= 12 | 13 | PASS |
| grid-cols-12 count | >= 1 | 6 | PASS |
| make build | exit 0 | exit 0 | PASS |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Country cards use squircle-lg**: Smaller cards (p-5) benefit from tighter 24px radius rather than 40px squircle-xl.
2. **Advantage 5 col-span**: Uses md:col-span-8 lg:col-span-4 to handle the 3+2 card layout at different breakpoints.
3. **hover:brightness-105 for card hover**: Since glass cards use liquid-card class with backdrop-filter, brightness filter is more appropriate than shadow-based hover (mask clips outer shadows).
