---
phase: 39
plan: 01
subsystem: layout
tags: [chrome, BEM, normalization, 404, prerequisite, layout-05]
dependency_graph:
  requires:
    - contacts.html (canonical reference from Phase 36a)
    - 36-SUMMARY.md (canonical pattern rationale)
  provides:
    - 404.html chrome (header, footer, sticky-bar, mobile-menu) in canonical BEM shape, ready for Phase 39-02 partial extraction
  affects:
    - Phase 39-02 splicer (can now process 404.html as a peer of the other 5 pages with no per-page special-case)
tech_stack:
  added: []
  patterns:
    - BEM class prefixes: footer__wrapper, footer__grid, footer__col, footer__logo, footer__desc, footer__heading, footer__links, footer__link, footer__contact-item, footer__contact-icon, footer__bottom, footer__copyright, footer__badges, footer__badge-item, footer__badge-dot
    - BEM class prefixes: header__inner, header__logo
    - BEM class prefixes: sticky-bar, sticky-bar__container, sticky-bar__phone, sticky-bar__cta, btn-primary
key_files:
  created: []
  modified:
    - 404.html
decisions:
  - 404.html adopts canonical contacts.html footer content verbatim (diff empty); the Vienna / KZ legal paragraphs and 3 extra Навигация links were intentional drift, not lost data — the same business info is still reachable on the canonical contact path.
  - The CSS rule `a[aria-current="page"] { ... }` in the `<style>` block is preserved (it is canonical and present in all 6 pages); the plan's `grep 'aria-current="page"'` verify is an over-broad test, satisfied-in-intent because no anchor element in the body carries the attribute.
metrics:
  duration_minutes: 8
  completed: 2026-04-08
  tasks: 1
  commits: 1
  files_changed: 1
  lines_added: 38
  lines_removed: 63
---

# Phase 39 Plan 01: 404 Chrome Normalization Summary

One-liner: 404.html header / footer / sticky-bar / mobile-menu normalized to the canonical contacts.html BEM shape (LAYOUT-05) so Phase 39-02 can extract and splice partials without per-page special-casing.

## What Changed

### Header (404.html lines 51–80 → 51–78, 3 lines shorter)

- Added `header__inner` class to the inner flex wrapper (`<div class="header__inner flex items-center justify-between">`).
- Added `header__logo` class to the logo anchor so it becomes `<a href="index.html" class="header__logo text-2xl font-bold ...">`.
- Removed 3 decorative HTML comments: `<!-- Desktop Navigation -->`, `<!-- Desktop Phone & CTA -->`, `<!-- Mobile Menu Button -->`.
- Preserved: header CTA `href="contacts.html"` / label `Оставить заявку`, the `header__nav`, `header__actions`, `header__phone`, `header__cta`, `header__menu-btn` classes (already present), the `О нас` → `index.html#why-us` cross-page anchor, and the absence of `aria-current="page"` on the Контакты link (404 is not in primary nav).
- Final header line count: **26** (matches contacts.html exactly).

### Footer (404.html lines 119–200 → 116–168, 30 lines shorter)

Full rewrite to byte-identical contacts.html shape:

- Added BEM classes: `footer__wrapper`, `footer__grid`, `footer__logo`, `footer__desc`, `footer__heading` (×3), `footer__links` (×3), `footer__link` (×5), `footer__contact-item` (×2), `footer__contact-icon` (×2, span not div), `footer__bottom`, `footer__copyright`, `footer__badges`, `footer__badge-item`, `footer__badge-dot`.
- Changed the inner glass wrapper from `<div class="bg-white/60 backdrop-blur-3xl ...">` to `<div class="footer__wrapper bg-white/60 backdrop-blur-3xl ...">`.
- Changed the grid wrapper from `<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">` to `<div class="footer__grid grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">`.
- Changed contact icon wrappers from `<div class="bg-white/60 backdrop-blur-md p-2.5 rounded-xl ...">` to `<span class="footer__contact-icon glass-icon bg-white/60 backdrop-blur-md p-2.5 rounded-xl ...">`.
- Changed bottom bar wrapper from `<div class="border-t border-mu-text-300/30 pt-8 mt-8">` to `<div class="footer__bottom border-t border-mu-text-300/30 pt-8 mt-8">`.
- Column 1: collapsed 3 paragraphs (international platform + Vienna GmbH address + KZ TOO Astana Hub) into 1 canonical sentence: "Международный медицинский сервис. Австрия · Казахстан".
- Column 2 (Услуги): changed "Чек-апы" → "Чек-ап" to match canonical.
- Column 3 (Навигация): pruned from 5 links to 2 (Главная, Контакты) — removed index.html#clinics, index.html#why-us, and the # privacy link.
- Column 4 (Контакты): removed the App Store / Google Play link block entirely; no such feature on this site.
- Bottom bar: changed ISO 27001 · GDPR · "Защита персональных данных" composite badge text to the canonical "ISO 27001 Certified" single-line badge inside `<span class="footer__badge-item">`.
- Removed 5 decorative HTML comments: `<!-- Column 1: Company -->`, `<!-- Column 2: Services -->`, `<!-- Column 3: Navigation -->`, `<!-- Column 4: Contacts -->`, `<!-- Bottom bar -->`.
- Removed the `<!-- FOOTER (Footer.tsx) -->` Tsx-origin comment immediately above the footer tag (matches contacts.html, which has no such comment).
- Final footer line count: **61** (matches contacts.html exactly).
- Footer body diff against contacts.html: **empty** (byte-identical).

### Sticky-Bar (404.html lines 202–208 → 170–175, 1 line shorter)

- Added `sticky-bar` class to the outer `<div>` (`<div class="sticky-bar fixed bottom-4 ..." id="sticky-bar" ...>`).
- Added `container sticky-bar__container` classes to the inner flex wrapper (`<div class="container sticky-bar__container flex items-center justify-between gap-3">`).
- Added `sticky-bar__phone` class to the phone `<a>` element.
- Added `btn-primary sticky-bar__cta` classes to the CTA `<a>` element.
- Removed `<!-- Sticky Mobile CTA Bar -->` decorative comment immediately above the sticky-bar block.
- Preserved: CTA `href="contacts.html"` / label `Оставить заявку`.

### Mobile-Menu (404.html lines 82–100 — unchanged)

Already BEM-compliant from v3.1 creation (verified during planning): `mobile-menu-overlay`, `mobile-menu`, `mobile-menu__nav`, `mobile-menu__link` (×5), `mobile-menu__divider`, `mobile-menu__phone`, `mobile-menu__cta`. No edits needed. The 5 mobile-menu links match contacts.html in href and label except the Контакты link, which intentionally lacks the `aria-current="page"` + `text-mu-blue-text bg-mu-blue/5` active styling (404 is not a canonical nav target).

### Out of Scope (Untouched)

- `<head>` block (doctype, meta, preload, stylesheet, style block) — byte-identical.
- `<body>` opening tag and the `.mesh-bg` animated background div — byte-identical (includes the `<!-- Animated Mesh Background (Layout.tsx) -->` comment and non-canonical `.mesh-bg__blob` wrapping — deferred to a future layout-consistency plan if ever needed).
- `<main id="page-content">` block (404 big number, H1 "Страница не найдена", paragraph, "На главную" button) — byte-identical, confirmed by `grep -q 'Страница&nbsp;не&nbsp;найдена'`.
- Script tags (motion CDN, main.js, animations.js, router.js) — byte-identical.
- Closing `</body>` and `</html>` tags — byte-identical.
- The `<!-- Header (Header.tsx) -->` comment above the header tag — left in place because plan scope is strictly inside the chrome awk ranges and contacts.html has `<!-- Header -->` (a 1-line drift OUTSIDE the splicer region that has no impact on Phase 39-02 partial extraction).

## Verification Gate Results

| Gate | Command | Result |
|------|---------|--------|
| File exists | `test -f 404.html` | PASS |
| Header BEM wrapper | `grep -q 'class="header__inner flex' 404.html` | PASS |
| Header logo BEM | `grep -q 'class="header__logo text-2xl' 404.html` | PASS |
| Footer wrapper BEM | `grep -q 'class="footer__wrapper' 404.html` | PASS |
| Footer grid BEM | `grep -q 'class="footer__grid' 404.html` | PASS |
| Footer bottom BEM | `grep -q 'class="footer__bottom' 404.html` | PASS |
| Sticky-bar outer | `grep -q 'class="sticky-bar fixed' 404.html` | PASS |
| Sticky-bar container | `grep -q 'class="container sticky-bar__container' 404.html` | PASS |
| Sticky-bar phone | `grep -q 'class="sticky-bar__phone' 404.html` | PASS |
| Sticky-bar CTA | `grep -q 'class="btn-primary sticky-bar__cta' 404.html` | PASS |
| No App Store block | `! grep -q 'App.Store' 404.html` | PASS |
| No Google Play block | `! grep -q 'Google.Play' 404.html` | PASS |
| No Vienna address | `! grep -q 'Billrothstrasse' 404.html` | PASS |
| No Desktop Navigation comment | `! grep -q '<!-- Desktop Navigation -->' 404.html` | PASS |
| No Column 1 comment | `! grep -q '<!-- Column 1: Company -->' 404.html` | PASS |
| No Sticky Mobile CTA Bar comment | `! grep -q '<!-- Sticky Mobile CTA Bar -->' 404.html` | PASS |
| Header line count = 26 | `awk '/<header/,/<\/header>/' 404.html \| wc -l` | PASS (26) |
| Footer line count = 61 | `awk '/<footer/,/<\/footer>/' 404.html \| wc -l` | PASS (61) |
| Footer body diff empty | `diff <(awk '/<footer/,/<\/footer>/' contacts.html) <(awk '/<footer/,/<\/footer>/' 404.html)` | PASS (empty) |
| Header CTA preserved | `grep -q 'href="contacts.html" class="header__cta' 404.html` | PASS |
| Sticky-bar CTA preserved | `grep -q 'href="contacts.html" class="btn-primary sticky-bar__cta' 404.html` | PASS |
| 404 H1 intact | `grep -q 'Страница&nbsp;не&nbsp;найдена' 404.html` | PASS |
| Mobile-menu BEM (5 classes) | `grep -c 'mobile-menu__link' 404.html` | PASS (5 links, all 5 BEM classes present) |
| No nav-link aria-current | `grep -E '<a[^>]*aria-current' 404.html` | PASS (no match; CSS selector in `<style>` block is canonical and kept) |

All 24 gates pass.

## Deviations from Plan

### 1. [Rule 3 - Blocking Issue] Over-broad `aria-current="page"` verify test

**Found during:** Task 1 automated verification run.

**Issue:** The plan's automated verify block contains `! grep -q 'aria-current="page"' 404.html`, which the plan intends to assert "no nav link has an aria-current attribute". But this grep also matches the CSS selector `a[aria-current="page"] { ... }` in the `<style>` block at line 39 of 404.html. That CSS rule is **canonical** — it exists in all 6 pages (verified: contacts.html:46, index.html:50, online-consultations.html:53, treatment-abroad.html:58, checkup.html:50, 404.html:39) and was never supposed to be removed. The plan's grep, as written, would fail on ALL canonical pages too.

**Fix:** Interpreted the intent as "no `<a>` element in the body has an `aria-current` attribute". Verified via `grep -E '<a[^>]*aria-current' 404.html` — no matches. The CSS rule is preserved exactly as-is on all 6 pages.

**Files modified:** None (verification-only interpretation).

**Commit:** N/A (no code change).

## Threat Register Outcomes

| Threat ID | Disposition | Status |
|-----------|-------------|--------|
| T-39-01-01 (Tampering: chrome content) | mitigate | **Mitigated** — footer body diff against contacts.html is empty; header line count = 26; all BEM class greps pass; any drift would have failed the verify gate. |
| T-39-01-02 (Info Disclosure: Vienna address) | accept | **Accepted** — Vienna address pruned from 404.html footer as planned; still reachable via canonical business disclosures; no information leak. |
| T-39-01-03 (DoS: 404 main content) | mitigate | **Mitigated** — `<main id="page-content">` block byte-identical pre/post; `grep -q 'Страница&nbsp;не&nbsp;найдена'` exits 0; "На главную" button and 404 big number intact. |

## Commits

| Task | Hash | Message |
|------|------|---------|
| 1 | `2f5de2b` | refactor(39-01): normalize 404.html chrome to canonical BEM pattern |

## Known Stubs

None.

## Threat Flags

None — no new security-relevant surface introduced.

## Self-Check

- [x] 404.html exists (modified, not deleted): FOUND
- [x] Commit 2f5de2b exists: FOUND
- [x] Footer body diff against contacts.html is empty (byte-identical)
- [x] Header awk line count = 26 (matches contacts.html)
- [x] Footer awk line count = 61 (matches contacts.html)
- [x] 404 main content block untouched
- [x] All 24 verification gates pass

## Self-Check: PASSED
