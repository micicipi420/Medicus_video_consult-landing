# Architectural Decisions: MedicusUnion KZ

This file documents intentional architectural choices that could appear as inconsistencies to future maintainers.

---

## AD-01: Dual header scroll class naming (design system vs production)

**Date:** 2026-04-14
**Context:** Phase 74.1 integration audit identified a class name divergence between CSS layers.

**Finding:** `src/styles/theme.css` targets `.header--scrolled` (Next.js component naming convention) while `js/main.js` toggles `.is-scrolled` on the header element (BEM state modifier convention). Production CSS (`css/styles.css`) uses `.site-header.is-scrolled`.

**Decision:** This is intentional and NOT a bug. The two layers serve distinct runtimes:

- `src/styles/theme.css` serves the Next.js scaffold (Tailwind compilation, component-based naming)
- `js/main.js` + `css/styles.css` serve vanilla HTML production pages (BEM conventions)

The `.header--scrolled` class in theme.css is unreachable by the vanilla JS because the vanilla header never receives that class. The `.is-scrolled` toggle in main.js is unreachable by theme.css because Next.js does not load main.js.

**Resolution:** No code change needed. The two layers are architecturally isolated. They would only need alignment if the Next.js scaffold were extended to reuse the same JS scroll handler, which is out of scope for v7.0.

**Affected files:**
- `src/styles/theme.css` line ~470: `.header--scrolled` (design system layer)
- `js/main.js` line ~470: `classList.add('is-scrolled')` (production layer)
- `css/styles.css` line ~390: `.site-header.is-scrolled` (production layer)

**Related:** v7.0 Milestone Audit finding #3 (integration section)
