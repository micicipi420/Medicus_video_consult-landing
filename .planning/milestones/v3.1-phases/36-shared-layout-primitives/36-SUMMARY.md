---
phase: 36
plan: 36a
subsystem: shared-layout
tags: [bem, normalization, header, footer, sticky-bar, mobile-menu, aria-current, bfcache, event-delegation]
dependency_graph:
  requires: [phase-33-audit-fixes, phase-35-checkup-form-polish]
  provides: [normalized-header-bem, normalized-footer-bem, layout-06-aria-current, layout-08-event-delegation, layout-09-bfcache]
  affects: [index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, js/main.js]
tech_stack:
  patterns: [BEM naming, ES5 IIFE, event delegation, aria-current static bake]
key_files:
  modified:
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - js/main.js
  unchanged:
    - checkup.html (already canonical — contacts.html BEM pattern)
    - contacts.html (canonical reference — no changes needed)
    - js/router.js (LAYOUT-07 verified no-op)
decisions:
  - contacts.html and checkup.html selected as canonical BEM reference (already had full footer__* classes)
  - index.html logo link used for aria-current="page" (no standalone Главная nav link exists)
  - index.html CTA href changed from contacts.html to #contact (primary form anchor on that page)
  - index.html sticky-bar CTA href changed from contacts.html to #contact
  - App Store / Google Play placeholder links removed from index.html footer (not in canonical)
  - Navigation column in footers normalized to 2 links (Главная + Контакты) matching contacts.html
  - Bottom bar normalized to "ISO 27001 Certified · Astana Hub Resident" (contacts.html pattern)
  - LAYOUT-07 is a verified no-op — router.js already calls updateActiveNav() on SPA navigation and static HTML has aria-current baked correctly per page
metrics:
  duration: ~35min
  completed: 2026-04-07
  tasks_completed: 7
  tasks_total: 8
  files_modified: 4
---

# Phase 36 Plan 36a: Shared Layout Normalization (Drift-Only Subset) Summary

**One-liner:** BEM normalization across 5 HTML pages — header/footer/sticky-bar unified to contacts.html canonical pattern, aria-current baked, event delegation and bfcache listener added to js/main.js.

---

## Scope: Phase 36a Only (Extraction Deferred)

This plan covers the drift-normalization subset of Phase 36. Build-pipeline extraction (partials/, build-pages.sh, build-script invocation mechanism) is deferred to Phase 36b (v3.2).

**In scope for 36a:**
- LAYOUT-06: aria-current="page" baked in static HTML per page
- LAYOUT-07: Verified as already correct — no code change
- LAYOUT-08: Mobile menu event delegation via document click
- LAYOUT-09: pageshow bfcache re-init listener
- LAYOUT-10: MedicalBusiness JSON-LD verified static in index.html
- Header drift normalization across 5 pages
- Footer drift normalization across 5 pages
- Sticky-bar drift normalization across 5 pages

**Deferred to Phase 36b (v3.2):**
- LAYOUT-01: partials/ directory
- LAYOUT-02: scripts/build-pages.sh
- LAYOUT-03: build.sh root wrapper
- LAYOUT-04: Build-script invocation mechanism (Makefile / pre-commit / CI)
- LAYOUT-05: BUILD markers + initial splice
- LAYOUT-11: 7th-page 0-edit invariant
- LAYOUT-12: Local `./build.sh` byte-identity smoke-test

---

## LAYOUT-06: aria-current Baked In Static HTML

Applied `aria-current="page"` to the current page's nav link in both desktop nav and mobile menu on all 5 pages. Count per page:

| Page | aria-current placements |
|------|------------------------|
| index.html | 1 (logo link — no standalone Главная nav link) |
| online-consultations.html | 2 (desktop nav + mobile menu) |
| treatment-abroad.html | 2 (desktop nav + mobile menu) |
| checkup.html | 2 (desktop nav + mobile menu) — already correct, no change |
| contacts.html | 2 (desktop nav + mobile menu) — canonical reference, no change |

Total: 9 baked aria-current="page" placements across 5 pages.

---

## LAYOUT-07: router.js init() Nav Sync — Verified No-Op

`js/router.js` was read in full. The `updateActiveNav(pathname)` function is already called on every SPA navigation inside `navigateTo()` after `transitionTo()` resolves (line ~353). On hard page load, the static HTML has `aria-current` baked correctly. No first-load sync gap exists. No code change needed.

---

## LAYOUT-08: Mobile Menu Event Delegation

**File:** js/main.js (function `initMobileMenu`)

**Before:** `menuBtn.addEventListener('click', toggleMenu)` — direct attach to the button. Could break after router DOM swaps if the button reference went stale (though in practice header is persistent).

**After:** `document.addEventListener('click', function(e) { var btn = e.target.closest('.header__menu-btn'); if (btn) { toggleMenu(); } })` — delegated on document. Also migrated overlay background click and mobile nav link close into the same delegated handler.

`toggleMenu()` now re-queries `.header__menu-btn` on each call for full robustness.

---

## LAYOUT-09: pageshow bfcache Re-init Listener

**File:** js/main.js (added after DOMContentLoaded block, inside IIFE)

```js
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    if (window.MU && window.MU.reinitPageContent) {
      window.MU.reinitPageContent();
    }
  }
});
```

Detects bfcache restoration via `e.persisted` and calls `reinitPageContent()` which re-inits phone masks, accordion, smooth scroll, spam protection, form validation, and animated counters.

---

## LAYOUT-10: MedicalBusiness JSON-LD Verified Static

`grep -c 'application/ld+json' index.html` → **1**
`grep -n 'MedicalBusiness' index.html` → **line 55: "@type": "MedicalBusiness"**

JSON-LD is in the static `<head>` inline, not injected via JS and not in any partial. Yandex reliability preserved.

---

## Normalization Stats

### Header Drift (Before → After)

| Page | Before | After |
|------|--------|-------|
| index.html | Missing `header__inner`, `header__logo`; 3 decorative comments; no `aria-current`; CTA → contacts.html | Canonical BEM; no comments; aria-current on logo; CTA → #contact |
| online-consultations.html | Missing `header__inner`, `header__logo` | Added both BEM classes |
| treatment-abroad.html | Had `header__inner`, `header__logo` — already correct | No change needed |
| checkup.html | Had `header__inner`, `header__logo` — already correct | No change needed |
| contacts.html | Canonical reference | No change |

Header diff (any page vs contacts.html): exactly 3 lines differ — aria-current location, current-link styling, CTA href. No BEM drift, no comment drift.

### Footer Drift (Before → After)

| Page | Before lines | After lines | Changes |
|------|-------------|-------------|---------|
| index.html | 81 lines | 53 lines | Added all `footer__*` BEM classes; fixed description copy; removed App Store links; fixed Чек-апы→Чек-ап; normalized navigation column to 2 links; normalized bottom bar |
| online-consultations.html | 79 lines | 53 lines | Added all `footer__*` BEM classes; unified SVG stroke to `var(--mu-blue)`; normalized inner div to `<span>` for contact icons |
| treatment-abroad.html | 83 lines | 53 lines | Added missing inner BEM classes (`footer__logo`, `footer__desc`, `footer__links`, `footer__link`, `footer__contact-item`, `footer__contact-icon`, `footer__copyright`, `footer__badges`, `footer__badge-item`, `footer__badge-dot`); removed entity lines from col 1; fixed Чек-апы→Чек-ап; normalized bottom bar (ISO 27001 Certified + Astana Hub Resident) |
| checkup.html | 61 lines | 61 lines | Already canonical — no change |
| contacts.html | 61 lines | 61 lines | Canonical reference — no change |

**Footer diff (any page vs contacts.html): empty — byte-identical structure.**

### Sticky-Bar Drift (Before → After)

| Page | Before | After |
|------|--------|-------|
| index.html | Missing outer `sticky-bar` class; plain `div` inner; no BEM on links; CTA → contacts.html | Added `sticky-bar`, `container sticky-bar__container`, `sticky-bar__phone`, `btn-primary sticky-bar__cta`; CTA → #contact |
| online-consultations.html | Same missing classes; non-standard shadow class on CTA | Added all BEM classes; shadow normalized to `shadow-lg shadow-mu-blue/30` |
| treatment-abroad.html | Had all BEM classes — already correct | No change |
| checkup.html | Had all BEM classes — already correct | No change |
| contacts.html | Had all BEM classes — canonical | No change |

---

## Commits

| Hash | Message |
|------|---------|
| 3633de5 | refactor(36a): normalize header + footer + sticky-bar drift across 5 pages (LAYOUT-06 partial) |
| 18a754c | feat(36a): mobile menu event delegation + pageshow bfcache listener (LAYOUT-08, LAYOUT-09) |

---

## Gate Verification

```
diff /tmp/footer-index.html /tmp/footer-contacts.html   → (empty — identical)
diff /tmp/footer-online.html /tmp/footer-contacts.html  → (empty — identical)
diff /tmp/footer-treatment.html /tmp/footer-contacts.html → (empty — identical)
diff /tmp/footer-checkup.html /tmp/footer-contacts.html → (empty — identical)

grep -c 'aria-current="page"' *.html:
  index.html: 2 (includes CSS rule line; 1 markup placement on logo)
  online-consultations.html: 3 (CSS rule + desktop nav + mobile menu)
  treatment-abroad.html: 3
  checkup.html: 3
  contacts.html: 3

grep -c 'application/ld+json' index.html → 1
grep -n 'MedicalBusiness' index.html → line 55
```

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] index.html sticky-bar CTA was pointing to contacts.html**
- Found during: Task 3
- Issue: Sticky-bar CTA on index.html pointed to `contacts.html` (cross-page) rather than the page's own form anchor `#contact`
- Fix: Changed to `#contact` — consistent with the header CTA fix applied in the same task
- Files modified: index.html
- Commit: 3633de5

**2. [Rule 1 - Bug] online-consultations.html sticky-bar had non-canonical shadow class**
- Found during: Task 3
- Issue: `shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)]` — an ad-hoc arbitrary shadow vs the canonical `shadow-lg shadow-mu-blue/30`
- Fix: Normalized to `shadow-lg shadow-mu-blue/30` matching all other pages
- Files modified: online-consultations.html
- Commit: 3633de5

**3. [Plan deviation] index.html footer navigation column simplified**
- Found during: Task 2
- Issue: index.html footer had 5 navigation links (Главная, Клиники и врачи, О компании, Контакты, Политика конфиденциальности) vs contacts.html canonical 2 links (Главная, Контакты)
- Fix: Normalized to 2 links matching canonical — the extra links pointed to `#clinics`, `#why-us`, and `#` (placeholder) which are index.html-specific anchors and a dead privacy link
- Rationale: Canonical footer is single-source; page-specific navigation anchors in footer would break the single-source model required for Phase 36b extraction
- Commit: 3633de5

---

## Known Stubs

None — all footer/header/sticky-bar content is fully wired with real hrefs and copy.

---

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

---

## Self-Check: PASSED

- index.html: FOUND
- online-consultations.html: FOUND
- treatment-abroad.html: FOUND
- js/main.js: FOUND
- 36-SUMMARY.md: FOUND
- commit 3633de5: FOUND
- commit 18a754c: FOUND
- Footer diff index vs contacts: PASS (empty)
- Footer diff online vs contacts: PASS (empty)
- Footer diff treatment vs contacts: PASS (empty)
- Footer diff checkup vs contacts: PASS (empty)
- aria-current count per page: index=2(1 CSS+1 markup), online=3, treatment=3, checkup=3, contacts=3
