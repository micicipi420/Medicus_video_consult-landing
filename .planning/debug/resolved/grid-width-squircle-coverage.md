---
status: awaiting_human_verify
trigger: "Fix two issues: (1) content blocks don't span full 12-col grid width, (2) not all rounded shapes converted to squircle"
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:01:00Z
---

## Current Focus

hypothesis: CONFIRMED -- Mobile overflow caused by grid-cols-12 column gap creating minimum intrinsic width exceeding mobile viewport. gap-8 (32px * 11 = 352px) and gap-12/16 (528px/704px) exceeded 343px content area. CTA cards with p-12 also overflowed on mobile.
test: Playwright overflow detection at 320/375/768/1440px across all 6 pages
expecting: Zero html overflow at all viewports
next_action: Await human verification that mobile layout is correct

## Symptoms

expected: 
- Issue 1: Content blocks span the full grid width. 3 cards = 4+4+4 cols. 2-column = 6+6. No floating-in-middle look.
- Issue 2: ALL rounded form inputs, textareas, selects, card containers, badges use squircle classes.
actual:
- Issue 1: Many sections have narrow content within wide container.
- Issue 2: Some form elements and rounded elements still use rounded-* instead of squircle-*.
errors: None -- visual/layout issues
reproduction: Open http://localhost:8080/index.html at 1440px width
started: Since v4.0 migration

## Eliminated

- hypothesis: Issue 2 -- form elements still using rounded-* instead of squircle
  evidence: All form inputs/textareas/selects already use squircle-md. The 15 remaining rounded-2xl and rounded-[1.5rem] instances are ALL icon chips with group-hover:rotate-3 (rotating elements). Per squircle docs: "NEVER apply squircle to rotating elements. mask-image distorts during CSS transform: rotate()." These are the documented exception.
  timestamp: 2026-04-09

## Evidence

- timestamp: 2026-04-09
  checked: All 7 HTML pages + partials for rounded-* classes (excluding rounded-full)
  found: 15 instances of rounded-2xl/rounded-[1.5rem], ALL in index.html, ALL on icon chips with group-hover:rotate-3
  implication: Issue 2 was already resolved -- all rounded-* are documented exceptions

- timestamp: 2026-04-09
  checked: All grid containers across 7 pages for max-w-*xl mx-auto constraints
  found: index.html had 6 constrained grids/cards (max-w-2xl, max-w-5xl, max-w-6xl, max-w-3xl). online-consultations.html had 7 (max-w-3xl, max-w-5xl, max-w-4xl, max-w-6xl, max-w-xl). treatment-abroad.html had 2 (max-w-4xl). checkup.html had 1 (max-w-2xl on hero + FAQ max-w-3xl). 404.html had 1 (max-w-lg). 
  implication: Content was constrained to 768px-1152px within a 1400px container, leaving visible empty space

- timestamp: 2026-04-09
  checked: All form elements on v4.0 pages for squircle compliance
  found: All inputs, textareas, selects on index, online-consultations, treatment-abroad, checkup, contacts already use squircle-md
  implication: Form squircle migration was already complete

- timestamp: 2026-04-09
  checked: Mobile viewport (375px) after removing max-w constraints -- Playwright element inspection
  found: Body scroll width 720px (vs 375px viewport). Hero grid-cols-12 gap-12 created 528px minimum (11 gaps * 48px). Why-Us grid-cols-12 gap-16 created 704px minimum. All grid-cols-12 with gap-8+ overflowed. Also CTA p-12 (48px padding) overflowed card container.
  implication: CSS Grid column gap defines minimum intrinsic width even when children span all columns. On mobile (col-span-12 stacked), only row gap is needed.

- timestamp: 2026-04-09
  checked: All pages at 320/375/768/1440px after applying responsive gap fix
  found: html scrollWidth matches viewport exactly at all sizes on all 6 pages. Zero visible horizontal overflow. body scrollWidth slightly exceeds viewport on some pages due to nbsp-bound headings in CTA cards, but overflow-x:clip on html prevents any visual issue.
  implication: Fix confirmed -- responsive gap-y + breakpoint-activated full gap eliminates mobile overflow while preserving desktop layout.

## Resolution

root_cause: |
  Issue 1 (desktop): Grid containers had inner max-w constraints (max-w-3xl through max-w-6xl + mx-auto) narrowing content below the 1400px container.
  
  Issue 1 (mobile regression): Removing max-w exposed a latent bug in grid-cols-12 grids. CSS Grid column gap creates minimum intrinsic width = (N-1) * gap_size. With 12 columns: gap-8 = 352px, gap-12 = 528px, gap-16 = 704px. Mobile content area is 343px (375px - 32px padding), so all gap-8+ grids overflowed. Additionally, CTA cards with p-12 (48px padding) exceeded their container on mobile.
  
  Issue 2: Already resolved. All form elements use squircle-md. Remaining rounded-* are rotating icon chips (documented exception).

fix: |
  Phase 1 (desktop -- previous session): Removed max-w + mx-auto from grid/card wrappers across all pages.
  
  Phase 2 (mobile -- this session): Made grid column gaps responsive on all 8 grid-cols-12 sections in index.html:
  - Hero: gap-12 lg:gap-8 → gap-y-12 lg:gap-8 (children go multi-col at lg)
  - Services: gap-8 → gap-y-8 md:gap-8 (children go multi-col at md)
  - Problem: gap-8 → gap-y-8 md:gap-8
  - Steps: gap-8 → gap-y-8 md:gap-8
  - Why Us: gap-16 → gap-y-16 lg:gap-16 (children go multi-col at lg)
  - Clinics: gap-6 → gap-y-6 md:gap-6
  - Reviews: gap-8 → gap-y-8 md:gap-8
  - Contact: gap-12 → gap-y-12 lg:gap-12 (children go multi-col at lg)
  
  Made CTA card padding responsive across all pages:
  - index.html CTA: p-12 lg:p-20 → p-6 md:p-12 lg:p-20
  - online-consultations.html CTA: p-12 lg:p-20 → p-6 md:p-12 lg:p-20
  - treatment-abroad.html CTA: p-12 lg:p-20 → p-6 md:p-12 lg:p-20
  - checkup.html CTA: p-12 lg:p-20 → p-6 md:p-12 lg:p-20
  
  Pattern: On mobile, children stack (col-span-12) so only row gap matters. gap-y-* sets row gap without column gap. At the breakpoint where multi-column kicks in (md or lg), full gap-* applies both axes.

verification: |
  Playwright automated testing at 320/375/768/1440px across all 6 pages:
  - html scrollWidth matches viewport exactly at all sizes (zero visible overflow)
  - Desktop 1440px: content fills full grid width properly
  - Mobile 375px: text fully visible, cards stack vertically, no horizontal scroll
  - Tablet 768px: two-column layouts work with appropriate gaps
  - CSS rebuild succeeds (tailwindcss v4.2.2)

files_changed:
  - index.html
  - online-consultations.html
  - treatment-abroad.html
  - checkup.html
  - 404.html
  - css/styles.css
