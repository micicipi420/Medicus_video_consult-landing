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
