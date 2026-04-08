# Phase 36: Shared Layout Primitives (Phase 36a — Normalize Drift Only)

**Gathered:** 2026-04-07
**Status:** Ready for planning — SCOPED DOWN
**Mode:** User decision 2026-04-07 — execute drift-normalization subset; defer extraction to Phase 36b (v3.2 or future session)

<domain>
## Phase Boundary (Phase 36a)

Normalize header + footer + sticky-bar + mobile menu drift across all 5 production HTML pages into a canonical form. Bake `aria-current="page"` consistently. Add router.js first-load nav sync, mobile menu event delegation, and bfcache pageshow listener. **Do NOT extract to partials/, do NOT create build scripts.**

Phase 36b (extraction + build pipeline + build-script invocation mechanism) is deferred to v3.2 or a focused follow-up session. Deploy target is nginx (CLAUDE.md canonical); the 76 MB `tailwindcss` binary runs only locally during dev, so no build-image compatibility spike is needed. Invocation mechanism (Makefile / pre-commit / CI) is a 36b planning decision.

</domain>

<decisions>
## Implementation Decisions

### Scope split (LAYOUT requirements)

**In scope for Phase 36a:**
- LAYOUT-06: Bake `aria-current="page"` consistently in static HTML for each page's own nav link
- LAYOUT-07: Augment `js/router.js init()` with `updateActiveNav(window.location.pathname)` on first load
- LAYOUT-08: Mobile menu hamburger uses event delegation on `document`
- LAYOUT-09: `pageshow` listener handles bfcache restoration via `e.persisted`
- LAYOUT-10: Verify `MedicalBusiness` JSON-LD stays in static inline HTML on index.html (no extraction)
- **NEW: Normalize header drift** (implicit in LAYOUT-06, expanded)
- **NEW: Normalize footer drift** (implicit in extraction gate, pulled forward)
- **NEW: Normalize sticky-bar drift**

**Deferred to Phase 36b (v3.2):**
- LAYOUT-01: `partials/` directory
- LAYOUT-02: `scripts/build-pages.sh`
- LAYOUT-03: `build.sh` root wrapper
- LAYOUT-04: Build-script invocation mechanism (Makefile / pre-commit / CI)
- LAYOUT-05: BUILD markers + initial splice
- LAYOUT-11: 7th-page 0-edit invariant
- LAYOUT-12: Local `./build.sh` byte-identity smoke-test

### Drift findings (verified 2026-04-07)

**Header drift:**
- `index.html` missing BEM classes (`header__inner`, `header__logo`, etc.) that `contacts.html` has
- `index.html` has HTML comments (`<!-- Desktop Navigation -->`) that other pages don't
- `aria-current="page"` present on `contacts.html`, `online-consultations.html`, `treatment-abroad.html`, `checkup.html`. Missing or inconsistent on `index.html`.
- CTA target varies per page (by design — each page has its own form anchor)

**Footer drift:**
- Line count spread: 61 to 83 (22-line difference)
- BEM classes (`footer__wrapper`, `footer__logo`, `footer__desc`, `footer__heading`, `footer__links`, `footer__link`) present on `contacts.html` only
- Description text differs: index.html says "Международная медицинская платформа"; contacts.html says "Международный медицинский сервис. Австрия · Казахстан"
- Link text drifts: `Чек-ап` vs `Чек-апы`
- Column structure may differ (needs full diff during execution)

### Canonical decisions

**BEM convention (normalize UP):**
- Add `header__inner`, `header__logo`, `header__nav`, `header__cta`, `header__menu-btn` classes to all 5 pages
- Add `footer__wrapper`, `footer__logo`, `footer__desc`, `footer__heading`, `footer__links`, `footer__link`, `footer__column` classes to all 5 pages
- Rationale: v1.0 Key Decisions explicitly lists BEM naming as project convention. contacts.html has them; normalizing UP (adding classes) matches convention.

**HTML comment convention:**
- Remove decorative comments like `<!-- Desktop Navigation -->` from `index.html` to match other pages
- Keep functional comments (e.g. `<!-- Start of TestimonialsSection -->`) that aid navigation

**CTA target (PAGE-SPECIFIC, not extractable):**
- Each page keeps its own CTA href. `index.html` → `#form` (primary contact form section); other pages → their existing in-page anchors.
- Markup structure is identical across pages; only the `href` value differs.
- Document this as canonical: "header CTA always points to the current page's primary form anchor"
- index.html currently points CTA to `contacts.html` — change to `#form` (or whatever the primary form anchor is on index.html) during execution. VERIFY the target anchor exists before changing.

**aria-current baked (LAYOUT-06):**
- Each page's own link in desktop nav + mobile menu + (optionally) sticky bar gets `aria-current="page"` + `class="text-mu-blue-text font-medium tracking-tight"` (matching contacts.html pattern)
- Other pages' links get default hover-state classes: `text-mu-text-700 hover:text-mu-blue-text transition-colors font-medium tracking-tight`
- Applied to 5 pages × 3 nav contexts = up to 15 spots

**Footer canonical copy:**
- Description: "Международный медицинский сервис. Австрия · Казахстан" (contacts.html version — more specific, matches the rename)
- Entity lines: "MedicusUnion GmbH · Billrothstrasse 78, 1190 Vienna, Austria" and "ТОО «MedicusUnion KZ» · Резидент Astana Hub"
- Service link label: `Чек-ап` (singular, matches treatment-abroad page title convention)
- Columns: 4-column layout (Company, Services, Navigation, Contact) — use the fullest-version layout (probably index.html at 81 lines)

**Mobile menu + sticky-bar:**
- Both expected to be similar across pages but need verification during execution
- Normalize classes + structure; `aria-current` in mobile menu nav links mirrors desktop nav

### LAYOUT-07 router.js init augmentation

Current `router.js init()` is around lines 397-426 per research. Add (ES5):
```js
// On first load (not via SPA navigation), sync aria-current based on URL
if (typeof window.MU !== 'undefined' && window.MU.router) {
  var pathname = window.location.pathname;
  // updateActiveNav is already defined in router.js
  updateActiveNav(pathname);
}
```

Actually — static HTML has aria-current baked, so runtime sync is only for SPA navigation. The `updateActiveNav` already runs on SPA routes via `transitionTo`. The first-load sync is only needed if static HTML's aria-current could be out of sync with URL. Since static HTML is baked per-page, first-load is already correct. LAYOUT-07 may be a no-op — verify during execution.

### LAYOUT-08 mobile menu event delegation

Current mobile menu button click is likely attached directly to the button. Change to delegated pattern on `document`:
```js
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.header__menu-btn');
  if (btn) {
    toggleMobileMenu();
  }
});
```
Find the current direct-attach code in js/main.js and replace.

### LAYOUT-09 pageshow bfcache

Add at top of js/main.js DOMContentLoaded or after router init:
```js
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    // Restored from bfcache — re-sync state
    if (window.MU && window.MU.reinitPageContent) {
      window.MU.reinitPageContent();
    }
  }
});
```

### LAYOUT-10 MedicalBusiness JSON-LD static verification

Verification only: `grep -n 'application/ld+json' index.html` must show JSON-LD in static `<head>` inline (around lines 50-140 per prior research). No extraction. This is a gate check, not a code change.

### Claude's Discretion
- Whether to add BEM classes before or after normalizing copy/structure (recommend: classes first, copy second — smaller diffs)
- Whether to split into multiple plans or one — recommend ONE plan with multiple atomic commits to keep review easy
- Exact index.html CTA anchor target (look up the actual form section anchor during execution)

</decisions>

<code_context>
## Existing Code Insights

### Files touched (5 production HTML + 2 JS)
- index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html
- js/main.js — mobile menu handler, pageshow listener
- js/router.js — potentially unchanged (LAYOUT-07 may be no-op)

### Reusable patterns
- contacts.html is the BEM reference (header__*, footer__*)
- v3.0 Phase 32 added focus-visible rule globally — don't disrupt
- v3.0 Phase 33 just unified Vienna + ТОО in footers — extend to full copy unification

### Reality checks
- js/router.js handles SPA navigation with `#page-content`, `#footer`, `#sticky-bar` swap — these IDs must be preserved on all pages
- After all 5 headers/footers normalized, Phase 36b extraction (deferred) becomes feasible in a future session

</code_context>

<specifics>
## Specific Ideas

- Use contacts.html's class structure as the canonical reference for BEM
- Use fullest footer (index.html at 81 lines) as the canonical column layout
- Pick canonical copy per-element through diffs — prefer most specific/branded wording
- Skip CTA href normalization — it's page-specific by design

</specifics>

<deferred>
## Deferred Ideas

- Partials directory (v3.2 Phase 36b)
- Build script + invocation mechanism (Makefile / pre-commit / CI) (v3.2 Phase 36b)
- Template placeholders (v3.2 Phase 36b)
- 7th-page invariant verification (v3.2 Phase 36b)
- Router.js first-load nav sync (likely no-op after normalization — verify and skip if unchanged)

</deferred>
