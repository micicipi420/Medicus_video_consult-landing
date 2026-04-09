# Pitfalls Research — v3.1 Site Foundation & Audit Fixes

**Researched:** 2026-04-07
**Project:** MedicusUnion KZ
**Domain:** Existing production multi-page medical landing (HTML + Tailwind v4 + ES5 IIFE JS + Motion CDN + Directus, 6 pages, ~4,714 LOC, Russian-only, 45+ KZ audience)
**Confidence:** MEDIUM-HIGH overall — architectural pitfalls verified against actual codebase. iOS Safari/Yandex/circle-flags claims based on training data; flagged for live verification.

---

## CRITICAL CORRECTION (changes Phase 36 architecture)

`js/router.js` already exists (465 lines) and is a SPA-like client router. It intercepts internal `<a>` clicks, fetches the target HTML, and **already swaps `<main id="page-content">`, `<footer id="footer">`, and `<div id="sticky-bar">`** between page navigations. It also already sets `aria-current="page"` (lines 174–197) and prefetches nav links on idle.

**Implications:**
- "Extract header/footer/sticky-bar to partials" is a **source-level** dedup task, not a **runtime** injection task
- Injection-FOUC and observer-attach-order pitfalls only apply to **first page load**, not subsequent navigations
- Phase 36 must NOT introduce a second injection mechanism that fights router.js
- **Recommended approach: build-step source-level concatenation**, not runtime fetch

---

## CRITICAL PITFALLS (rewrite-causing or release-blocking)

### CRIT-01 — Phase 36 partials introduce a second injection layer that fights router.js
**Phase:** 36
**What goes wrong:** A naive "fetch + innerHTML" partial loader at boot competes with router.js's prefetch loop. First load: empty header → flicker → injected → router cache stale. Two systems writing to the same DOM nodes (`#footer`, `#sticky-bar`) with different sources of truth.
**Warning sign:** After clicking index → contacts → back, footer briefly shows index.html's content before switching.
**Prevention:**
- Use a **build-step** (shell/sed/cat) that concatenates `partials/{header,footer,sticky-bar}.html` into all 6 HTML files at build time
- Each HTML file remains complete and SEO-crawlable
- Add `data-partial-version="v3.1"` attribute on `<footer>` for grep-able drift detection

### CRIT-02 — Source-level partials shipped before audit fixes (Phase 33–35) land
**Phase:** Cross-phase (33/34/35 vs 36)
**What goes wrong:** Phase 33 fixes "ТОО «MedicusUnion KZ»" inline on 5 pages. Phase 36 then extracts the footer from one of those 5 pages — which may or may not be the corrected version. Whatever pre-existing variant gets picked becomes canonical, audit fix is silently reverted on 4 other pages.
**Warning sign:** After Phase 36, `git grep 'MedicusUnion KZ\|Medicus Union KZ'` shows mixed variants.
**Prevention:**
- **Hard ordering:** Phase 33 must merge before Phase 36 begins extraction
- After Phase 33, run `diff` of header/footer/sticky-bar regions across all 5 pages — must be byte-identical for extracted regions
- Phase 36 acceptance: `git grep 'ТОО «'` returns matches only in `partials/footer.html`

### CRIT-03 — Phase 38 vertical-rhythm tokens conflict with Phase 35's ad-hoc `min-h` fix
**Phase:** Cross-phase (35 vs 38)
**What goes wrong:** Phase 35 fixes checkup H1 1024–1440px overflow by jiggling `min-h-[80vh]` → `min-h-[90vh]` ad-hoc. Phase 38 sweeps these to tokens. The Phase 35 fix is either silently overridden or reverted.
**Warning sign:** After Phase 38, the Phase 35 verification screenshot at 1280px no longer matches.
**Prevention:**
- **Sequence Phase 35 to NOT touch hero `min-h`** — fix the H1 overflow with content/typography (responsive `<br>`, line-break shortening, gradient phrase swap)
- If Phase 35 must touch min-h, leave a `<!-- VR-TODO: Phase 38 token --> ` marker
- Phase 38 acceptance: zero arbitrary `min-h-[*]` values on hero/section elements

### CRIT-04 — Sitemap.xml generated before Phase 36 contradicts canonical URLs
**Phase:** Cross-phase (36 vs 37)
**What goes wrong:** Phase 37 generates sitemap from current HTML files. Phase 36 changes canonical URLs inside the now-shared partial. Sitemap and `<link rel="canonical">` disagree. Crawl budget burned.
**Warning sign:** `curl -s https://medicusunion.kz/sitemap.xml | grep -o 'https[^<]*'` does not match the unique canonical values across `*.html`.
**Prevention:**
- **Order:** Phase 37 must run AFTER Phase 36 (or after Phase 33 canonical audit at minimum)
- `scripts/build-sitemap.sh` derives entries from each HTML file's actual `<link rel="canonical">` value — single source of truth

### CRIT-05 — robots.txt blocks /js/ /css/ → Yandex penalty
**Phase:** 37
**What goes wrong:** Cargo-cult robots.txt with `Disallow: /css/` and `Disallow: /js/`. Googlebot can't render JS-injected partials → falls back to raw HTML (acceptable for this site). **YandexBot in worse shape — pages whose CSS is blocked may render with no styles and get classified as low-quality.**
**Warning sign:** Yandex Webmaster shows "Blocked by robots.txt" warnings on `/css/styles.css` and `/js/main.js`.
**Prevention:**
```
User-agent: *
Allow: /
Disallow: /.planning/
Disallow: /Redesign/
Disallow: /scripts/
Disallow: /src/
Sitemap: https://medicusunion.kz/sitemap.xml
```
- Verify with both Google Search Console AND Yandex Webmaster (separate tools, KZ priority)

### CRIT-06 — Yandex cannot read JSON-LD MedicalBusiness if behind JS-injected partials
**Phase:** 36/37
**What goes wrong:** index.html's `MedicalBusiness` JSON-LD currently lives in inline HTML. If a future refactor moves it into a JS-injected `<script type="application/ld+json">`, **Yandex may not see it** (Google does execute JS for JSON-LD; Yandex less reliable in 2024–2026).
**Warning sign:** After Phase 36, Yandex Webmaster's structured-data validator does not list MedicalBusiness.
**Prevention:**
- **Keep all `<script type="application/ld+json">` blocks in static HTML** — never extract to partials, never inject via fetch
- Treat Yandex as the harder-to-please crawler for KZ market
- 30-min spike in Yandex Webmaster recommended before Phase 36 freezes the partial boundary

### CRIT-07 — `100vh` / `min-h-screen` clips on iOS Safari with URL bar visible
**Phase:** 38
**What goes wrong:** `index.html:201` and `body` on all 6 pages use `min-h-screen` (`100vh`). On iOS Safari (and in-app browsers like Telegram, Instagram for KZ traffic), the dynamic URL bar means visual viewport is shorter than `100vh` when the bar is visible. Hero CTA is **below the fold on first paint**, hidden behind the URL bar. For 45+ users this looks like the page is glitching.
**Warning sign:** Real iOS Safari (not desktop emulation) — bottom of hero clipped behind chrome on iPhone SE / iPhone 12.
**Prevention:**
- Phase 38 must adopt `svh` (small viewport height) for hero `min-h`, NOT `vh` and NOT `dvh`
- `dvh` causes mid-scroll layout jump (hostile to vestibular-sensitive 45+ users)
- `svh` is the smallest the viewport will ever be — content doesn't jump
- iOS Safari 15.4+ and KZ Android Chrome 108+ support svh natively (≥99% coverage)

### CRIT-08 — `100vh` on `<body>` itself causes weird stretch on long pages
**Phase:** 38
**What goes wrong:** All 6 pages set `<body class="relative min-h-screen">`. Combined with `min-h-screen` hero, on a viewport of 812px the body and hero compete. On 404.html, body forces 812px → hero is also 812px → footer pushed below the fold → user thinks page is broken.
**Warning sign:** On 404.html on a tall viewport, footer at bottom edge with visible whitespace gap above.
**Prevention:**
- `<body>` should NOT have `min-h-screen`
- Replace with page wrapper: `<body><div class="page-shell flex flex-col min-h-[100dvh]"><header/><main class="flex-1"/><footer/></div></body>`
- 404.html uses `min-h-[80svh]` on its main, not `min-h-screen` on body

### CRIT-09 — Sticky mobile bar IntersectionObserver attaches before footer is in DOM (router context)
**Phase:** 36
**What goes wrong:** Plan to add IntersectionObserver to hide sticky bar over the footer. But router.js swaps `#footer` content via `innerHTML` — destroys previous DOM node and creates new ones. Any IntersectionObserver attached to OLD footer is now observing a detached node. After SPA navigation, sticky bar never hides again.
**Warning sign:** Hard-refresh contacts.html → sticky bar hides over form (correct). Click "Главная" → scroll to footer → sticky bar still visible (broken).
**Prevention:**
- The router exposes `window.MU.reinitPageContent` (router.js:277). Sticky-bar observer must wire into this re-init lifecycle
- Pattern:
```js
window.MU.reinitStickyBarObserver = function () {
  if (window.__stickyObserver) window.__stickyObserver.disconnect();
  var footer = document.getElementById('footer');
  if (!footer) return;
  window.__stickyObserver = new IntersectionObserver(/* ... */);
  window.__stickyObserver.observe(footer);
};
```

### CRIT-10 — bfcache invalidated by router; needs explicit pageshow handling
**Phase:** 36 / 37
**What goes wrong:** Browser back/forward cache snapshots state. Router uses `popstate` which fires whether page came from bfcache or not. The bfcache snapshot may include stale `aria-current`, stale sticky-bar state, or cached `pageCache` from in-memory router that no longer matches reality.
**Warning sign:** index → contacts → back → page restores instantly but sticky bar text says "Заявка на чек-ап" instead of index.html version.
**Prevention:**
```js
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    window.MU.router && window.MU.router.clearCache && window.MU.router.clearCache();
    // Re-run init to reset DOM-derived state
  }
});
```
- Audit router.js for `unload` / `beforeunload` listeners — there are none currently (good), don't add any

---

## MODERATE PITFALLS

### MOD-01 — `aria-current="page"` race with router on first paint
**Phase:** 36
**What goes wrong:** router.js sets aria-current only AFTER navigation. On the very first page load via direct URL, no nav link has aria-current set until JS runs. Screen reader users hear all 6 nav items as equal-priority links.
**Prevention:**
- Bake `aria-current="page"` into static HTML for each page's own link (only `contacts.html:68/95` has this currently)
- Add `updateActiveNav(window.location.pathname)` to router.js's `init()` function

### MOD-02 — Mobile menu hamburger click falls through after partial swap
**Phase:** 36
**What goes wrong:** Hamburger button exists in DOM before its click handler is attached. Tap → nothing → user gives up. For 45+ users, hard failure.
**Prevention:** Use **event delegation on `document`** (matches existing pattern in router.js:406 for link interception). Handler attached at boot regardless of when button enters DOM.

### MOD-03 — `file://` local testing breaks fetched partials
**Phase:** 36
**What goes wrong:** Opening HTML files via `file://` causes `fetch()` of relative paths to fail CORS-style. Designer says "the page has no header" — they double-clicked .html in Finder.
**Prevention:** Build-step approach (CRIT-01) makes this moot. Each HTML file is complete on disk.

### MOD-04 — Premature form validation: red borders on first focus
**Phase:** 35
**What goes wrong:** Naive `oninput` → validate → red border. User types one letter, sees red. For 45+ users on a medical inquiry form, triggers anxiety.
**Prevention:**
- **Validation timing:** validate on `blur` (first time), then on `input` only after the field has been blurred at least once with errors
- Use `:user-valid` CSS pseudo-class (Baseline 2023, blur-aware natively)
- Pattern:
```js
field.addEventListener('blur', function () { field.dataset.touched = '1'; validate(field); });
field.addEventListener('input', function () { if (field.dataset.touched) validate(field); });
```

### MOD-05 — Valid-state checkmark looks like "form submitted"
**Phase:** 35
**What goes wrong:** Green ✓ next to valid field uses universal "completed/done" symbol. 45+ user fills name + phone, sees green checks, thinks "done" → closes the tab.
**Prevention:**
- Use **subtle green border-bottom or left-rule**, not a checkmark icon
- OR a tiny outlined check that's visually a "field state" not a "completed action"
- Keep submit button visually dominant as the only "done" affordance
- Add aria-only text: `<span class="sr-only">поле заполнено</span>` for SR users

### MOD-06 — `aria-live="polite"` over-announces on every keystroke
**Phase:** 35
**Prevention:**
- aria-live announcements **only fire on validation transitions** (invalid → valid, valid → invalid)
- Prefer `aria-invalid="false"` (attribute) over live region
- Never `aria-live="assertive"` for form fields

### MOD-07 — Phone mask oscillates valid/invalid as user types `+7 7XX XXX XX XX`
**Phase:** 35
**Prevention:**
- Validate phone on **blur only**
- Never show invalid-state mid-typing
- Reserve red for: blurred + incomplete OR blurred + invalid format

### MOD-08 — Russian error messages 1.4–1.8× longer than English equivalents
**Phase:** 35
**What goes wrong:** "Required" → "Это поле обязательно для заполнения" (32 chars). "Invalid phone" → "Введите корректный номер телефона в формате +7 (___) ___-__-__" (60+ chars). On 320px wraps to 3–4 lines.
**Prevention:**
- **Cap error messages at ≤30 Russian characters**
- Examples:
  - "Это поле обязательно" (20) ✓
  - "Введите имя" (11) ✓
  - "Проверьте номер" (15) ✓
- Cap error container width: `max-w-[280px]`

### MOD-09 — Gender-specific copy ("Не определился" — masculine only)
**Phase:** 35
**Prevention:**
- Use gender-neutral phrasing: "Пока не выбрал(а)", "Не уверен(а)", or restructure to noun: "Нужна помощь с выбором"
- Audit ALL form labels/placeholders/buttons for masculine-default verbs: grep for `-лся\b`, `-ил\b`, `-ал\b`
- Add to CONVENTIONS.md: "All form copy must work for both genders"

### MOD-10 — Cyrillic in fluid `clamp()` cramped at 1920+, awkward at 320
**Phase:** 38
**What goes wrong:** `font-size: clamp(40px, 4vw, 56px)` clamped to 56 at both 1440 and 1920. Russian compound words ("медицинский", "консультация", "Великобритании") wrap awkwardly.
**Prevention:**
- **Test viewports:** 320, 360, 390, 412, 768, 1024, 1280, 1440, 1920, 2560
- Set clamp upper bound based on visual feel at 1920+, not 1440
- For h1: `clamp(2.5rem, 5vw, 4.5rem)` (40 → 72px)
- Pair with `max-width: 55ch` for Russian (vs `60ch` English) — Russian average word length is 6 chars vs 5

### MOD-11 — Section heights uniform — looks fine on landing, wrong on contacts
**Phase:** 38
**What goes wrong:** Token system applies `--section-min-h: 80vh` uniformly. On rich-content index.html, perfect. On contacts.html (form + info card), 80vh is empty whitespace. On checkup.html B2B page, 80vh too cramped.
**Prevention:** Tokens **named by content density**, not generic numbers:
- `--hero-h-rich` (index, online-consultations) — 100svh
- `--hero-h-medium` (treatment-abroad, checkup) — 80svh
- `--hero-h-compact` (contacts, 404) — 60svh

Pages opt into the right token, they don't all use the same one.

### MOD-12 — Smooth-scroll anchors land behind sticky header
**Phase:** 38
**Prevention:**
```css
section[id], h1[id], h2[id] { scroll-margin-top: 88px; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### MOD-13 — Scroll-reveal triggers before section visible (because min-h is too large)
**Phase:** 38
**Prevention:**
- Animation observer uses `rootMargin: '-100px 0px -100px 0px'` (trigger only when section is genuinely 100px into viewport)
- OR observe a child element of the section, not the section itself

### MOD-14 — circle-flags bundled whole adds 1.4MB of SVGs
**Phase:** 37
**Prevention:**
- **Subset to 7 flags only.** Manually copy needed SVGs into `img/flags/` and inline OR load on-demand
- Better: **inline the 7 flag SVGs** (matches existing pattern of inline icons). Total: ~7 × 2KB = 14KB inlined
- License: circle-flags is MIT. ✓

### MOD-15 — Israel flag (RTL) flipping incorrectly with `transform: scaleX(-1)`
**Phase:** 37
**Prevention:** Site is `<html lang="ru" dir="ltr">` (no RTL). Inline IL flag as static SVG; never apply `transform: scaleX()`.

### MOD-16 — Historical/political flag versions (DE not GDR; CH federal vs civil)
**Phase:** 37
**Prevention:**
- Source from current set (circle-flags last updated 2024+)
- Manual visual diff against Wikipedia for the 7 countries actually used
- Confirm Switzerland flag is square version (national flag)

### MOD-17 — Flag icons at 24px in older Chrome on KZ Android — sub-pixel rendering blur
**Phase:** 37
**Prevention:**
- Render flags at minimum **32×32px on mobile**, 24×24px is absolute minimum on desktop
- Use `circle` style (solid color block with flag in circle) — more recognizable at small sizes than rectangle

### MOD-18 — Sitemap stale `lastmod` causes Google deprioritization
**Phase:** 37
**Prevention:**
- Generate `lastmod` from `git log -1 --format=%cI <file>` (more reliable than mtime)
- Better: omit `<lastmod>` entirely. Google doesn't require it; wrong is worse than missing

### MOD-19 — Canonical URL drift: trailing slash vs no trailing slash
**Phase:** 37
**Prevention:**
- Pick one canonical pattern: `https://medicusunion.kz/` (no `index.html`) for homepage
- Service pages: `https://medicusunion.kz/online-consultations.html` (with extension)
- Audit: `grep -h '<link rel="canonical"' *.html | grep -o 'https://[^"]*'` — should show 6 URLs, all matching the same scheme

### MOD-20 — Sitemap served from wrong location
**Phase:** 37
**Prevention:**
- File at site root: `https://medicusunion.kz/sitemap.xml`
- robots.txt references absolute URL
- Acceptance: `curl -sI https://medicusunion.kz/sitemap.xml` returns `200 OK` and `content-type: application/xml`

### MOD-21 — Sitemap accidentally includes 404.html or test/staging URLs
**Phase:** 37
**Prevention:**
- Sitemap is **explicit allowlist** of 5 production pages, not auto-discovered
- 404.html must NOT be in sitemap (it's served at the 404 status code; search engines find it via that mechanism)

### MOD-22 — Sitemap built locally references staging URLs after deploy
**Phase:** 37
**Prevention:**
- Sitemap generation script reads `BASE_URL` from environment
- Production deploy sets `BASE_URL` explicitly
- CI smoke test: `curl -s https://medicusunion.kz/sitemap.xml | grep -c "https://medicusunion.kz"` must equal 5

### MOD-23 — Hero photo swap (Phase 34) references stat-bar layout that Phase 34 also modifies
**Phase:** 34
**Prevention:**
- **Internal ordering within Phase 34:** stat bar rework FIRST (code-only, fast), THEN hero photo swap (asset sourcing slow)
- Asset spec for hero photo references the new stat bar layout: "image must have visual quiet space in bottom-third where stat bar will overlap"

### MOD-24 — Removing body `min-h-screen` leaves footer floating on tall viewports
**Phase:** 38
**Prevention:**
- Replace body `min-h-screen` with **page wrapper**: `<body><div class="page-shell flex flex-col min-h-[100dvh]"><header/><main class="flex-1"/><footer/></div></body>`
- `flex-1` on main pushes footer to bottom even on tall viewports

---

## MINOR PITFALLS

### MIN-01 — Sticky bar ID collision after partial extraction
**Phase:** 36
**Prevention:** CI grep: `grep -o 'id="sticky-bar"' index.html | wc -l` must equal 1

### MIN-02 — `defer` script order broken if router.js loads after main.js
**Phase:** 36
**Prevention:** All inter-dependent scripts use `defer` (NOT `async`). Order in HTML: main.js BEFORE router.js. Guard already exists at router.js:277

### MIN-03 — Footer `aria-label` lost during partial extraction
**Phase:** 36
**Prevention:** Diff all 5 footers' ARIA attributes BEFORE extraction. Pick the most-accessible variant as canonical, not the most-common one

### MIN-04 — Counter animation re-runs on every SPA navigation
**Phase:** 36
**Prevention:** Cache "already animated" state in `sessionStorage`, OR only animate counters on first visit per session, OR skip animation if document.referrer is same-origin

### MIN-05 — Heading H1 collision when checkup hero shrinks via responsive `<br>`
**Phase:** 35
**Prevention:** Use `<br class="md:hidden">` or `<br class="xl:hidden">` — pick the breakpoint where headline genuinely needs the break. Test 768 → 1920 in 50px increments

### MIN-06 — `&ndash;` replacement on treatment-abroad.html accidentally hits CSS comments
**Phase:** 34
**Prevention:** Scoped regex `'\([0-9]\)--\([0-9]\)' '\1\&ndash;\2'` (only between digits, the actual case in audit). Or do it manually — only ~6 occurrences

### MIN-07 — Phase 33 sticky-bar `pb-28` doesn't account for safe-area-inset on iPhone X+
**Phase:** 33
**What goes wrong:** Audit fix is `pb-28 lg:pb-8` (112px mobile). On iPhone with home indicator, sticky bar sits above home indicator (`env(safe-area-inset-bottom)` = 34px). Actual occluded area is 146px. Trust line still partially clipped.
**Prevention:** Use `pb-[calc(7rem+env(safe-area-inset-bottom))]` OR apply `padding-bottom: env(safe-area-inset-bottom)` to the sticky bar itself

### MIN-08 — meta-description consistency check forgets 404.html
**Phase:** 37
**Prevention:** Audit script runs over all **6** files including 404.html. Description: "Страница не найдена. Откройте главную или свяжитесь с координатором MedicusUnion."

### MIN-09 — Phase 38 viewport tests skip 360px (Android default)
**Phase:** 38
**Prevention:** Test viewport list: `320, 360, 390, 412, 768, 1024, 1280, 1440, 1920`. **360 and 412 are the Android sizes that matter for KZ market**

### MIN-10 — Hero `min-h: 100dvh` causes content to jump as iOS Safari URL bar collapses
**Phase:** 38
**Prevention:** Use `svh` (small) on hero — sized to smallest possible viewport, no jump. `dvh` is for elements that should match visible viewport at all times (modal overlays). For hero: prefer `svh`.

---

## CROSS-PHASE ORDERING CONSTRAINTS (HARD chain)

```
Phase 33 (data unification)
   │  must merge before
   ▼
Phase 36 (partial extraction)
   │  must merge before
   ▼
Phase 37 (sitemap + canonical audit)

Phase 35 (form UX + checkup H1)  ──── must NOT touch hero min-h ──┐
                                                                  │
Phase 38 (vertical rhythm — last, owns ALL min-h tokens) ◄────────┘

Phase 34 (Treatment Abroad)
   │  internal ordering: stat bar BEFORE hero photo (MOD-23)
```

**Recommended sequence:**
1. **Phase 33** — first, fast, unblocks 36
2. **Phase 34** — parallel with 33, internal ordering matters
3. **Phase 35** — parallel with 33/34/36, stays away from min-h
4. **Phase 36** — after 33 merges, before 37 — **HIGHEST RISK PHASE**
5. **Phase 37** — after 36 merges
6. **Phase 38** — last, owns min-h tokens

If Phases 33–37 sequenced correctly, Phase 38 has zero merge conflicts.

---

## PRE-PHASE-START GREP GATES

**Before Phase 36:**
```bash
# All footers must be byte-identical for the regions to extract
diff <(sed -n '/<footer/,/<\/footer>/p' index.html) <(sed -n '/<footer/,/<\/footer>/p' contacts.html)
# Must be empty (or only differ in aria-current)

# Vienna address must be canonical
grep -h 'Wien\|Vienna' *.html | sort -u | wc -l  # Should be 1
grep -h 'ТОО «' *.html | sort -u | wc -l  # Should be 1
```

**Before Phase 37:**
```bash
# Canonical URLs must follow one pattern
grep -h 'rel="canonical"' *.html | grep -o 'href="[^"]*"' | sort -u
# Should show 6 URLs, all matching the same scheme

# Partials must be extracted
ls partials/footer.html partials/header.html partials/sticky-bar.html
```

**Before Phase 38:**
```bash
# No new ad-hoc min-h values added in Phases 33-37
git diff main..HEAD -- '*.html' | grep -E 'min-h-\[' | grep -v 'min-h-screen'
# Should be empty or only show removals
```

---

## OPEN VERIFICATION ITEMS

To resolve before relevant phase ships (WebSearch denied this session):

1. **Yandex Webmaster: does YandexBot 2026 execute JS for `<script type="application/ld+json">`?** — Pivot for CRIT-06
2. **caniuse svh/dvh on iOS 15.4+ and KZ Android Chrome 108+** for CRIT-07 confirmation
3. **circle-flags current package size (2026 release)** for MOD-14
4. **bfcache + popstate behavior on Safari 17.4+** for CRIT-10
5. **Yandex robots.txt analyzer behavior** when /css/ is blocked for CRIT-05

---

## FILES REFERENCED

- `.planning/PROJECT.md` — milestone scope
- `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` — audit findings
- `CLAUDE.md` — constraints
- `js/router.js` — **the most important file for Phase 36**
- `js/main.js` — registers `window.MU.reinitPageContent`, hosts IO patterns
- `js/animations.js` — Motion CDN integration
