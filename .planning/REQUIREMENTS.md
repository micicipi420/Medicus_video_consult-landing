# Requirements: v3.1 Site Foundation & Audit Fixes

**Milestone:** v3.1 (Phases 33–38)
**Started:** 2026-04-07
**Status:** Active

**Goal:** Ship 14 audit fixes from `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` AND establish shared layout primitives + a researched vertical-rhythm system so v3.2+ page additions become cheap. Bridge from "polished landing" to "scalable multi-page site".

**Research context:** `.planning/research/SUMMARY.md` — 6 critical corrections to PROJECT.md assumptions. Key findings: `js/router.js` SPA router already ships; hero must use `svh`; dark mode claim is stale. (Note: the research doc also flagged a non-nginx deploy-target assumption, which was reverted 2026-04-07 — canonical deploy target is nginx per CLAUDE.md; see supersession banner at the top of the research SUMMARY.)

---

## Audit Quick Wins (Phase 33)

- [x] **AUDIT-01**: Mobile sticky-bar overlap fixed on all 5 pages — `main.pb-8` → `pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-8` to account for 112px sticky bar + iPhone home indicator safe area
- [x] **AUDIT-02**: Vienna address unified to `Billrothstrasse 78, 1190 Vienna, Austria` across JSON-LD x2 + `parentOrganization` schema + index.html footer + treatment-abroad.html footer (5 edits total)
- [x] **AUDIT-03**: KZ office city unified to `Алматы` — fix `contacts.html:165` (was "Астана") to match index.html + JSON-LD
- [x] **AUDIT-04**: Legal entity name unified to `ТОО «MedicusUnion KZ»` (no space) — fix `treatment-abroad.html:826` and `:866` (were "Medicus Union KZ") to match JSON-LD `alternateName`
- [x] **AUDIT-05**: Emoji stat bar on `treatment-abroad.html` replaced with SVG icons copied from index.html stats pattern (visual consistency)
- [x] **AUDIT-06**: `online-consultations.html` H1 dangling em-dash fixed — bind "врача —" with `&nbsp;` or restructure phrase
- [x] **AUDIT-07**: After Phase 33 merges, `git grep 'Wien\|Vienna' *.html | sort -u` returns 1 unique match AND `git grep 'ТОО «' *.html | sort -u` returns 1 unique match (pre-flight gate for Phase 36)

## Treatment Abroad Overhaul (Phase 34)

- [x] **TRTOVR-01**: All 25× hardcoded SVG hex strokes on `treatment-abroad.html` (`#38C6F4`, `#35B678`, `rgba(56,198,244,0.1)`) replaced with `currentColor` + Tailwind brand color classes
- [x] **TRTOVR-02**: `stroke="#047857"` (emerald-700) on line 752 replaced with `var(--mu-green-600)` token reference
- [x] **TRTOVR-03**: Typewriter `--` replaced with `&ndash;` in step duration badges on `treatment-abroad.html` — `2--4 дня` → `2&ndash;4&nbsp;дня` (4 occurrences) + `2--3 клиник` on line 447. Scoped regex `'\([0-9]\)--\([0-9]\)' '\1\&ndash;\2'` to avoid hitting CSS comments (MIN-06)
- [x] **TRTOVR-04**: Stat bar hierarchy on `treatment-abroad.html:180-200` reworked to match index.html stats pattern — DO THIS FIRST within Phase 34 (MOD-23 internal ordering)
- [x] **TRTOVR-05**: Hero photo replaced from syringes close-up → clinic interior / care team photo, sourced as WebP, integrated into markup with width/height for CLS prevention — DO THIS AFTER stat bar rework (MOD-23). Asset spec: visual quiet space in bottom-third where stat bar overlaps
- [x] **TRTOVR-06**: `treatment-abroad.html` page re-audit score ≥17/24 (from 14/24)

## Checkup Fix + Form UX Polish (Phase 35)

- [x] **CHKPOL-01**: `checkup.html` H1 overflow at 1024–1440px fixed via **typography/content change** (responsive `<br>` on the gradient phrase OR shortening "Samsung Medical Center и Severance Hospital" with brand names in subtitle) — **MUST NOT touch `min-h`** (CRIT-03; Phase 38 owns all hero min-h tokens)
- [x] **CHKPOL-02**: `checkup.html` H2 form heading hierarchy reduced: `text-4xl md:text-5xl` → `text-3xl md:text-4xl` (currently too close to H1)
- [x] **CHKPOL-03**: Gender-neutral form labels applied on `checkup.html` — "Не определился" → "Пока не выбрал(а)" or "Помогите выбрать". Site-wide grep for `-лся\b`, `-ил\b`, `-ал\b` in form copy; no gender-specific past-tense first-person
- [x] **CHKPOL-04**: `:user-valid` CSS pseudo-class applied to all 5 forms (name, phone, specialization) — green border-bottom or left-rule on valid state, NOT checkmark icon (MOD-05 — mistaken "submitted" signal)
- [x] **CHKPOL-05**: `js/main.js` `initFormValidation()` extended with blur-first validation timing — validate on blur first; re-validate on input only after field has been blurred with errors (MOD-04 — no premature red borders)
- [x] **CHKPOL-06**: Phone mask validation on blur only, not on input — no valid/invalid flicker as user types `+7 701 532 24 78` (MOD-07)
- [x] **CHKPOL-07**: All Russian form error messages capped at ≤30 characters and container at `max-w-[280px]` to prevent 3-line wrapping on 320px (MOD-08)
- [x] **CHKPOL-08**: Screen-reader-only success text (`<span class="sr-only">поле заполнено</span>`) added per valid field; aria-live announcements only on validation transitions, never on every input (MOD-06)

## Shared Layout Primitives (Phase 36a / 36b) — ARCHITECTURAL CENTERPIECE

**Scope decision 2026-04-07 (user):** Phase 36a ships drift normalization + JS wiring; Phase 36b (partials extraction + build pipeline + build-script invocation mechanism) deferred to v3.2.

- [ ] **LAYOUT-01** _(DEFERRED to v3.2 Phase 36b)_: `partials/` directory with single-source files
- [ ] **LAYOUT-02** _(DEFERRED to v3.2 Phase 36b)_: `scripts/build-pages.sh` marker-based splice
- [ ] **LAYOUT-03** _(DEFERRED to v3.2 Phase 36b)_: `build.sh` wrapper at repo root
- [ ] **LAYOUT-04** _(DEFERRED to v3.2 Phase 36b)_: Build-script invocation mechanism (Makefile target, pre-commit hook, or CI step — exact mechanism to be decided when Phase 36b is planned). MUST be reproducible and idempotent.
- [ ] **LAYOUT-05** _(DEFERRED to v3.2 Phase 36b)_: BUILD markers + byte-identical splice verification
- [x] **LAYOUT-06**: `aria-current="page"` baked in static HTML — 9 placements across 5 pages (drift normalized in Phase 36a)
- [x] **LAYOUT-07**: Verified no-op — `router.js:updateActiveNav()` already fires on SPA navigation; static baked HTML covers first-load
- [x] **LAYOUT-08**: Mobile menu hamburger uses event delegation on `document` via `.header__menu-btn` selector
- [x] **LAYOUT-09**: `pageshow` listener handles bfcache restoration via `e.persisted` in `js/main.js`
- [x] **LAYOUT-10**: `MedicalBusiness` JSON-LD stays in static inline HTML on `index.html` (verified: 1 script tag, not extracted)
- [ ] **LAYOUT-11** _(DEFERRED to v3.2 Phase 36b)_: 7th-page 0-edit invariant verification
- [ ] **LAYOUT-12** _(DEFERRED to v3.2 Phase 36b)_: Smoke-test `./build.sh` locally and verify resulting HTML matches checked-in pages byte-for-byte (no drift). The 76 MB checked-in `tailwindcss` binary runs only locally during dev — nginx serves the already-compiled `css/styles.css`.

**Bonus work in Phase 36a (not in original reqs but implicit from audit CRIT-02):**
- Header + footer + sticky-bar drift normalized across 5 pages (BEM classes unified, copy unified, nav links consistent)
- Preserves Phase 33 canonical Vienna address + ТОО name

## Site Metadata & Hygiene (Phase 37)

- [x] **META-01**: `sitemap.xml` created at repo root as hand-written allowlist of 5 production pages (index, online-consultations, treatment-abroad, checkup, contacts) — NO 404.html, NO `<changefreq>`, NO `<priority>` (Google ignores both), `<lastmod>` from `git log -1 --format=%cI <file>` per page
- [x] **META-02**: `robots.txt` created at repo root with explicit `Allow: /`, disallows for `/.planning/`, `/Redesign/`, `/scripts/`, `/src/`, and `Sitemap: https://medicusunion.kz/sitemap.xml` reference. **Does NOT block `/css/`, `/js/`, `/img/`** (CRIT-05 — Yandex penalty)
- [x] **META-03**: Canonical URL audit across all 6 HTML files — one pattern (`https://medicusunion.kz/` for homepage; `https://medicusunion.kz/<name>.html` for service pages; no trailing slash drift). `grep -h 'rel="canonical"' *.html | grep -o 'href="[^"]*"' | sort -u` shows exactly 6 unique URLs
- [x] **META-04**: `404.html` H1 upgraded from `text-3xl font-extrabold` → `text-5xl md:text-6xl lg:text-7xl` to match other pages (audit #11)
- [x] **META-05**: `404.html` body copy rewritten from generic "Возможно, страница была перемещена или удалена" → "Эту страницу либо перенесли, либо она ещё не появилась. Откройте главную или напишите координатору."
- [x] **META-06**: Meta description consistency audit across all **6** pages (including 404.html — MIN-08) — each unique, 150–160 chars, includes primary keyword
- [x] **META-07**: `circle-flags` vendored — 7 SVGs (de, at, ch, fr, it, es, il) inlined into `img/flags/` or directly into `online-consultations.html` country list, replacing current approximated inline SVGs. Total budget: ~14KB. Rendered at ≥32px on mobile, 24px minimum on desktop

## Vertical Rhythm & Section Sizing (Phase 38) — RESEARCH-FIRST

**Dependency:** `/gsd-plan-phase 38` must include empirical verification of clamp values on 6 viewports (320, 390, 768, 1024, 1440, 1920) + manual competitor screenshot pass on 2–3 medical landing sites before bulk migration.

- [x] **RHYTHM-01**: Vertical rhythm tokens added to `src/styles/theme.css :root`: `--section-h-hero-rich`, `--section-h-hero-medium`, `--section-h-hero-compact`, `--section-pt`, `--section-pt-lg`, `--section-pb` — all hero values use `svh` (NOT `vh`, NOT `dvh` — CRIT-07)
- [x] **RHYTHM-02**: Tokens re-exported to `@theme inline` as `--height-section-*` and `--spacing-section-*` following existing `--mu-*` → `--color-mu-*` two-layer pattern
- [x] **RHYTHM-03**: Smoke-test before bulk migration: adding one `--height-section-hero-rich` token generates Tailwind utility `min-h-section-hero-rich` (30-min spike before touching markup)
- [x] **RHYTHM-04**: `<body class="min-h-screen">` replaced with page-shell wrapper across all 6 pages: `<body><div class="page-shell flex flex-col min-h-[100dvh]"><header/><main class="flex-1"/><footer/></div></body>` — fixes footer-floats-on-tall-viewports bug (CRIT-08, MOD-24)
- [x] **RHYTHM-05**: Hero classes migrated on all 5 content pages — content-density tier assigned per page:
  - `index.html`, `online-consultations.html` → `min-h-section-hero-rich`
  - `treatment-abroad.html`, `checkup.html` → `min-h-section-hero-medium`
  - `contacts.html`, `404.html` → `min-h-section-hero-compact`
- [x] **RHYTHM-06**: `section[id], h1[id], h2[id] { scroll-margin-top: var(--header-h); }` global rule added to prevent smooth-scroll anchor links from landing behind sticky header (MOD-12)
- [x] **RHYTHM-07**: `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` added for 45+ vestibular-safe behavior
- [x] **RHYTHM-08**: Scroll-reveal IntersectionObserver `rootMargin` changed from default to `'-100px 0px -100px 0px'` so animations fire when content is genuinely visible, not when tall section's empty top enters viewport (MOD-13)
- [x] **RHYTHM-09**: Cyrillic typography clamp widened where needed — `max-width: 55ch` on Russian hero headings (vs 60ch for English), clamp ceiling raised based on 1920/2560 visual review (MOD-10)
- [x] **RHYTHM-10**: Viewport verification completed 2026-04-08 via Playwright MCP across 320, 375, 1440 (spot-checked 6 pages each); all pages report `documentElement.scrollWidth === clientWidth`. Reference: `.planning/ui-reviews/UX-VALIDATION-v3.1-post-260407-j79.md` POST-FIX section. Phase 38.1 landed the corrective fixes: `html { overflow-x: clip }` safety net + per-page nbsp cleanup + checkup H1 gradient-span split + SVG clipPath on 3 flag icons.
- [x] **RHYTHM-11**: Post-migration gate — `git diff main..HEAD -- '*.html' | grep -E 'min-h-\[' | grep -v 'min-h-screen'` shows zero ad-hoc arbitrary min-h values on hero/section elements (all replaced with tokens)
- [x] **RHYTHM-12**: All counter animations cached via `sessionStorage` or referrer-check so they don't re-run on every SPA navigation (MIN-04 — polished UX hygiene)

---

## Future Requirements (deferred to v3.2+)

- **`doctors.html` page** — European doctor credentials, board memberships, photos. Biggest credibility gap but needs real client content (names, CVs, photos, board registrations). Parking until client provides.
- **`privacy.html` page** — Kazakhstan Personal Data Law No. 94-V compliance. Needs legal review before content can be written.
- **Content hub / blog** — Medical articles for SEO + trust. Separate initiative, requires content strategy and editorial calendar.
- **Kazakh language version** — Out of scope per CLAUDE.md constraint. Revisit post-launch.
- **Online booking / calendar integration** — Requires backend work and coordinator availability logic. Post-v3.
- **WhatsApp Business API integration** — Currently using `wa.me` links. Full API integration is post-v3.
- **Dark mode re-implementation** — `.dark` token overrides in theme.css exist but no toggle script ships. Deferred to a focused dark-mode milestone.

## Out of Scope

- **Directory rename** (`Medicus_video_consult-landing` stays) — would break git remotes, local clones, bookmarks, CI paths
- **JS framework migration** — vanilla ES5 IIFE pattern works for the 45+ audience and the no-Node-runtime constraint
- **Node.js runtime or npm dependencies** — Tailwind CLI standalone binary is the only build tool; Phase 36 introduces shell scripts, not a Node pipeline
- **CSS-in-JS, Sass/SCSS, PostCSS full pipeline** — Tailwind v4 @theme inline handles everything
- **Constraint Validation API rewrite of form** — would risk OS-localized error messages instead of Russian
- **Server-Side Includes (nginx SSI)** — deploy target is nginx (SSI technically valid), but Phase 36b keeps build-time shell splice for `file://` preview compatibility and deploy-target-agnostic output
- **Yandex/Google analytics integration** — separate initiative
- **A/B testing infrastructure** — requires server-side, premature
- **`changefreq` and `priority` tags in sitemap** — Google ignores both

---

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| AUDIT-01 | Phase 33 | TBD | pending |
| AUDIT-02 | Phase 33 | TBD | pending |
| AUDIT-03 | Phase 33 | TBD | pending |
| AUDIT-04 | Phase 33 | TBD | pending |
| AUDIT-05 | Phase 33 | TBD | pending |
| AUDIT-06 | Phase 33 | TBD | pending |
| AUDIT-07 | Phase 33 | TBD | pending |
| TRTOVR-01 | Phase 34 | TBD | pending |
| TRTOVR-02 | Phase 34 | TBD | pending |
| TRTOVR-03 | Phase 34 | TBD | pending |
| TRTOVR-04 | Phase 34 | TBD | pending |
| TRTOVR-05 | Phase 34 | TBD | pending |
| TRTOVR-06 | Phase 34 | TBD | pending |
| CHKPOL-01 | Phase 35 | TBD | pending |
| CHKPOL-02 | Phase 35 | TBD | pending |
| CHKPOL-03 | Phase 35 | TBD | pending |
| CHKPOL-04 | Phase 35 | TBD | pending |
| CHKPOL-05 | Phase 35 | TBD | pending |
| CHKPOL-06 | Phase 35 | TBD | pending |
| CHKPOL-07 | Phase 35 | TBD | pending |
| CHKPOL-08 | Phase 35 | TBD | pending |
| LAYOUT-01 | Phase 36 | TBD | pending |
| LAYOUT-02 | Phase 36 | TBD | pending |
| LAYOUT-03 | Phase 36 | TBD | pending |
| LAYOUT-04 | Phase 36 | TBD | pending |
| LAYOUT-05 | Phase 36 | TBD | pending |
| LAYOUT-06 | Phase 36 | TBD | pending |
| LAYOUT-07 | Phase 36 | TBD | pending |
| LAYOUT-08 | Phase 36 | TBD | pending |
| LAYOUT-09 | Phase 36 | TBD | pending |
| LAYOUT-10 | Phase 36 | TBD | pending |
| LAYOUT-11 | Phase 36 | TBD | pending |
| LAYOUT-12 | Phase 36 | TBD | pending |
| META-01 | Phase 37 | TBD | pending |
| META-02 | Phase 37 | TBD | pending |
| META-03 | Phase 37 | TBD | pending |
| META-04 | Phase 37 | TBD | pending |
| META-05 | Phase 37 | TBD | pending |
| META-06 | Phase 37 | TBD | pending |
| META-07 | Phase 37 | TBD | pending |
| RHYTHM-01 | Phase 38 | TBD | pending |
| RHYTHM-02 | Phase 38 | TBD | pending |
| RHYTHM-03 | Phase 38 | TBD | pending |
| RHYTHM-04 | Phase 38 | TBD | pending |
| RHYTHM-05 | Phase 38 | TBD | pending |
| RHYTHM-06 | Phase 38 | TBD | pending |
| RHYTHM-07 | Phase 38 | TBD | pending |
| RHYTHM-08 | Phase 38 | TBD | pending |
| RHYTHM-09 | Phase 38 | TBD | pending |
| RHYTHM-10 | Phase 38.1 | 2026-04-08 | verified |
| RHYTHM-11 | Phase 38 | TBD | pending |
| RHYTHM-12 | Phase 38 | TBD | pending |
