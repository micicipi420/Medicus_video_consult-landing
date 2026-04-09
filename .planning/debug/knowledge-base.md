# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## v4-layout-regressions -- Layout spacing broken after design system migration
- **Date:** 2026-04-09
- **Error patterns:** broken paddings, margins, container spacing, cramped, double-padding, liquid-card, max-w-1200px, container mx-auto, grid-cols
- **Root cause:** v4.0 migration replaced `container mx-auto` with fixed `max-w-[1200px]` losing responsive stepping; `.liquid-card` CSS had built-in `padding: 1.5rem` causing double-padding on cards with internal padding; header narrowed from `max-w-7xl` to `max-w-[1200px]`; service grid changed from `md:grid-cols-2` to 3-col on tablet.
- **Fix:** Restored `container mx-auto px-4 lg:px-6` on all section containers. Removed built-in padding from `.liquid-card` and `.stats-glass` CSS classes. Restored `max-w-7xl` on header. Fixed service cards to `md:col-span-6 lg:col-span-4`. Added explicit padding utilities where needed.
- **Files changed:** src/styles/liquid-glass.css, partials/header.html, index.html, checkup.html, online-consultations.html, treatment-abroad.html, contacts.html, 404.html, styleguide.html, css/styles.css
---

## broken-squircle-masks -- Squircle SVG masks look like capsules instead of rounded rectangles
- **Date:** 2026-04-09
- **Error patterns:** squircle, mask-image, SVG mask, capsule, pill shape, distorted corners, superellipse, viewBox 0 0 100 100, corner blend region, border-radius
- **Root cause:** SVG mask paths encoded a full n=5 superellipse (|x/a|^n + |y/b|^n = 1) where corner blend regions occupied 33-44% of each element side. This made elements look like rounded capsules/pills instead of subtly-smoothed rectangles. The approach should have been rect-with-superellipse-corners, not full-superellipse.
- **Fix:** Replaced all three SVG mask data-URIs in theme.css with rect-with-superellipse-corners paths. New paths use viewBox 0 0 1 1 (unit square), small corner fractions (md=6%, lg=7%, xl=8%), n=5 superellipse exponent, and H/V commands for straight edges.
- **Files changed:** src/styles/theme.css, css/styles.css
---

## missed-squircle-migrations -- Hero badge icon boxes kept rounded-* instead of squircle-md
- **Date:** 2026-04-09
- **Error patterns:** rounded-2xl, squircle migration, missed elements, hero badge, icon box, SQUIRCLE-01
- **Root cause:** Phase 47 migration plan explicitly chose to keep rounded-2xl on 2 hero floating badge icon containers, documenting them as "decorative, no need for squircle." This directly contradicted the SQUIRCLE-01 requirement that ALL border-radius elements use squircle classes. The 15 rotating icon chips across the page are correct exceptions (squircles distort under CSS transform: rotate()), but the 2 non-rotating hero badge icon boxes were simply an oversight in the plan.
- **Fix:** Replaced rounded-2xl with squircle-md on both hero floating badge icon containers (w-14 h-14 boxes at lines 271, 282 of index.html). shadow-inner (inset shadow) is safe with mask-image per squircles.css docs.
- **Files changed:** index.html, css/styles.css
---
