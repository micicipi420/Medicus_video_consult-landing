# Architecture Research — v3.1 Site Foundation & Audit Fixes

**Researched:** 2026-04-07
**Mode:** Project Architecture (subsequent milestone, integration-focused)
**Confidence:** HIGH (all claims verified against existing source files)

---

## CRITICAL CORRECTIONS TO MILESTONE BRIEF

Four reality checks that change the recommended architecture:

### 1. An SPA-style client router already ships (`js/router.js`, 465 lines)

- Intercepts internal link clicks, fetches the target HTML, parses with `DOMParser`
- Already swaps `<main id="page-content">`, `<footer id="footer">`, and `<div id="sticky-bar">` on every navigation (lines 238–253)
- Already re-runs `MU.reinitPageContent()` and `MU.initAnimations(false)` after swap (lines 277–282)
- Already has `updateActiveNav(pathname)` setting `aria-current="page"` (line 174)
- Already prefetches other pages on `requestIdleCallback`

**Implication:** The "5 duplicated copies" of header/footer/sticky-bar across 6 HTML files are the **canonical source the router reads from**. Any client-side fetch+inject approach would break `parsePageHTML` (which would see `null` footer/sticky-bar in fetched docs) and destroy the SPA routing.

### 2. There is no dark-mode FOUC-prevention script in the codebase

`theme.css:1` declares `@custom-variant dark (&:is(.dark *));` and lines 91–126 define `.dark` token overrides, but no JS toggles `.dark`, no `localStorage` read happens, and no inline `<head>` script exists. PROJECT.md's "v1.4 dark mode shipped" claim is stale — toggle was either reverted or never landed. **Dark-mode is not a v3.1 concern.**

### 3. There is no build pipeline

No `Makefile`, no `package.json`, no `scripts/build.sh`. Only build step is manual `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`. The standalone `tailwindcss` binary (~76 MB) is checked into git at repo root.

### 4. Deploy target is Netlify, not nginx

`.netlify/netlify.toml` publishes the directory as-is with no build command. **This kills any nginx SSI (`<!--# include -->`) recommendation** because Netlify does not support SSI. Any partials solution must work as a build-time transformation, not a server-side include.

### 5. No `IntersectionObserver` hide-near-footer on sticky-bar

Sticky bar is a static `class="fixed bottom-4 left-4 right-4 z-50 ... lg:hidden"` at `index.html:1156`. Never hides, disappears at `lg:` breakpoint. The only `IntersectionObserver` usage is for animated counters at `main.js:457`.

---

## Existing File State (verified)

| File | Relevance to v3.1 |
|------|-------------------|
| `js/router.js` | SPA router — swap targets: `#page-content`, `#footer`, `#sticky-bar`. MUST preserve these IDs. |
| `js/main.js` | IIFE pattern, initFormValidation at lines 254–430 (rules object, Russian error messages, custom phone format). Extendable for valid-state. |
| `js/animations.js` | Motion CDN integration. No interaction with v3.1 changes. |
| `src/styles/theme.css` | Two-layer tokens: `:root` (brand `--mu-*`) + `@theme inline` (Tailwind `--color-mu-*`). Existing pattern for shadow/font/color. |
| `src/styles/tailwind.css` | Declares `@source '../../*.html'` at line 3 — Tailwind scans repo-root HTML for utilities. |
| `.netlify/netlify.toml` | No build command currently. Phase 36 must add `[build] command = "./build.sh"`. |
| `tailwindcss` (76 MB) | Standalone binary, checked in, executable, gitignored elsewhere. |

---

## Hero Drift — Phase 38 source of truth

| Page | Current hero classes |
|------|---------------------|
| `index.html:201` | `min-h-screen flex items-center justify-center pt-32 pb-16 lg:pt-40` |
| `checkup.html:113` | `min-h-[80vh] flex items-center justify-center pt-32 pb-16 lg:pt-40` |
| `online-consultations.html:116` | `pt-32 pb-16` (NO min-h) |
| `treatment-abroad.html:120` | `pt-32 pb-16` (NO min-h) |
| `contacts.html` | smaller layout |
| `404.html` | smaller centered layout |

Three different hero strategies across four content pages. This is exactly what Phase 38 needs to systematize.

---

## Recommended Architecture (v3.1 deltas)

### 1. Partials integration — build-time shell splice (NOT runtime fetch, NOT nginx SSI)

**Why not client-side fetch+inject:**
- Breaks the router's `parsePageHTML()` — it requires header/footer/sticky-bar in the parsed doc. If they're runtime-injected only, footer/sticky-bar are `null` on fetch → navigation swap breaks.
- 100–500 ms headerless flash on slow connections — wrong for 45+ medical audience.
- Googlebot executes JS but Yandex (KZ market) is unreliable on JS-rendered chrome. Trust signals + legal entity in footer are SEO-relevant.
- `<noscript>` fallback means duplicating header inline anyway, defeating the purpose.

**Why not nginx SSI:**
- Netlify does not support SSI. STACK.md's recommendation is inapplicable to this deploy target.
- Would couple source-of-truth to server config, breaking local `file://` preview.

**Why not naive `cat` concat:**
- Forces page body files to contain literally nothing of the surrounding chrome — much bigger refactor than in-place marker replacement.

**Recommended: marker-based splice via `scripts/build-pages.sh`**

```
partials/
  header.html
  footer.html
  sticky-bar.html
  mobile-menu.html
scripts/
  build-pages.sh           (~40 lines of sh/awk)
build.sh                   (wraps build-pages.sh + tailwindcss)
```

Each page gains build markers:

```html
<!-- BUILD:partial header -->
<header class="header fixed z-50 ..." id="header">...</header>
<!-- BUILD:end header -->
```

`build-pages.sh` does awk replacement between matched markers with `partials/<name>.html`, in-place across all 6 pages. Also accepts `--page=index.html` arg to set `aria-current="page"` on matching nav link.

**Build order integration with Tailwind:**

```bash
# build.sh
#!/bin/sh
set -e
./scripts/build-pages.sh
./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify
```

Order matters: splice must happen before Tailwind runs, because `@source '../../*.html'` scans the post-splice files. Classes that only appear in `partials/header.html` would be tree-shaken out if Tailwind ran first.

**Netlify integration:** Add to `.netlify/netlify.toml`:
```toml
[build]
command = "./build.sh"
```

The checked-in `tailwindcss` binary (76 MB) is executable — Netlify's Linux build image should run it (MEDIUM confidence; requires smoke-test deploy before relying on it in production).

**FOUC risk:** None. Splice at build time, output byte-identical to current files.
**JS-off fallback:** Same as today — full HTML works without JS, router no-ops, links navigate normally.

**Active state sync (`aria-current="page"`):** Dual-layer:
- **Build time:** `build-pages.sh --page=index.html` sets attribute on matching nav link. Handles first paint + JS-off.
- **Runtime:** Router's existing `updateActiveNav(pathname)` at `router.js:174` continues to work on SPA navigation. No new code.

### 2. Vertical rhythm token integration — extend `theme.css` (no new file)

Follow existing two-layer pattern in `src/styles/theme.css`:
1. Declare brand value in `:root` as `--mu-*` or `--section-*` (lines 7–47 area)
2. Re-export to Tailwind via `@theme inline` as `--spacing-*` / `--height-*` (lines 128–161 area)

**Proposed additions to `:root`:**

```css
--section-h-hero: 100svh;           /* svh avoids iOS address-bar clip + mid-scroll jump */
--section-h-hero-mobile: 88svh;     /* avoid covering trust line on 320–414px */
--section-pt: 8rem;                 /* current pt-32 */
--section-pt-lg: 10rem;             /* current lg:pt-40 */
--section-pb: 4rem;                 /* current pb-16 */
--section-gap-y: 4rem;
--section-gap-y-mobile: 2rem;
```

**Proposed additions to `@theme inline`:**

```css
--spacing-section-pt: var(--section-pt);
--spacing-section-pt-lg: var(--section-pt-lg);
--spacing-section-pb: var(--section-pb);
--height-section-hero: var(--section-h-hero);
--height-section-hero-mobile: var(--section-h-hero-mobile);
```

Tailwind v4 auto-generates utilities: `h-section-hero`, `min-h-section-hero`, `pt-section-pt-lg`, etc.

**Why svh (not vh, not dvh) for hero:**
- `vh` clips on iOS Safari first paint (address bar subtraction bug)
- `dvh` causes mid-scroll layout jump as address bar shrinks — hostile to motion-sensitive 45+ users and prefers-reduced-motion
- `svh` is the stable choice; supported in Safari 15.4+ (June 2022) which covers ≥99% of KZ mobile traffic

**Migration path:**
1. Land tokens in `theme.css` first (no visual change — utilities exist but unused)
2. Per-page replacement in 5 commits (one per page): replace `min-h-screen`, `min-h-[80vh]`, bare `pt-32 pb-16` with token utilities
3. Visual diff each page after replacement
4. Re-run Tailwind CLI once at the end to verify utilities tree-shake correctly

**Important:** Token migration is a renaming exercise. It does NOT by itself fix the checkup H1 overflow bug — that's either a text cap, a responsive `<br>`, or a gradient-phrase shortening. Phase 35 addresses the fix; Phase 38 only systematizes heights to prevent future drift.

### 3. Sitemap.xml + canonical URLs

- **sitemap.xml:** hand-maintained at repo root, 6 URLs. Netlify serves from publish dir automatically.
- **robots.txt:** sibling at root, references `Sitemap: https://medicusunion.kz/sitemap.xml`.
- **lastmod:** `build-pages.sh` can embed `git log -1 --format=%cI -- <file>` per page on build.
- **Canonical URLs:** grep + reconcile; router already syncs them at runtime (`router.js:158`).

### 4. Form valid-state (`js/main.js` extension, not rewrite)

- Extend existing `is-invalid` pattern with mirrored `is-valid` class + `aria-invalid` toggle on blur.
- Do NOT migrate to Constraint Validation API — the existing rules-object pattern has explicit Russian error messages; browser-API approach risks OS-localized messages.
- Add ~30 lines to `initFormValidation()`; preserve existing `showFieldError`/`clearFieldError` API.

### 5. Flag icons

- Vendor `circle-flags` (7 SVGs: de/at/ch/fr/it/es/il) to `img/flags/`.
- Circular crop matches project rounded-card aesthetic.
- 1–5KB per flag, MIT license.
- Vendored not CDN'd to honor v3.0 data-sovereignty principle.

---

## Component Boundaries (after v3.1)

| Component | Source | Phase | Notes |
|-----------|--------|-------|-------|
| `partials/header.html` | New | 36 | Read by router via spliced pages; do not inject at runtime |
| `partials/footer.html` | New | 36 | Fixes 5-divergent-footer drift (audit #4, #1) |
| `partials/sticky-bar.html` | New | 36 | Mobile-only; padding fix lives here once |
| `partials/mobile-menu.html` | New | 36 | Extract from current inline overlays |
| `scripts/build-pages.sh` | New | 36 | Marker-based splice + aria-current |
| `build.sh` (repo root) | New | 36 | `build-pages.sh` → `tailwindcss` |
| `.netlify/netlify.toml` | Modified | 36 | Add `[build] command = "./build.sh"` |
| `src/styles/theme.css` | Modified | 38 | New `--section-*` tokens in `:root` + `@theme inline` |
| `js/main.js` | Modified | 35 | `initFormValidation()` valid-state extension |
| `js/router.js` | UNMODIFIED | — | Existing swap contract preserved |
| `js/animations.js` | UNMODIFIED | — | No interaction |
| `sitemap.xml` | New | 37 | Static at root |
| `robots.txt` | New | 37 | Static at root |

**Invariant:** Router's `parsePageHTML()` contract — `#page-content`, `#footer`, `#sticky-bar` IDs and their structural positions — MUST NOT be broken. Marker-based splice preserves them by definition.

---

## Phase Build Order & Dependencies

### Phase 33 — Audit Quick Wins
- **Touches:** `*.html` directly (sticky-bar pb-, Vienna+ТОО unification, emoji→SVG, Astana↔Алматы, em-dash)
- **Prereqs:** None
- **Enables:** Clean baseline for Phase 36 extraction (unified data before partials = no merge conflicts)
- **Order:** Ship FIRST

### Phase 34 — Treatment Abroad Overhaul
- **Touches:** `treatment-abroad.html` only + potentially new hero photo asset
- **Prereqs:** Phase 33 (so Vienna address is correct before page refactor)
- **Enables:** Worst-page score recovery (14/24 → ~18/24)
- **Order:** After Phase 33

### Phase 36 — Shared Layout Primitives ← RENUMBER DISCUSSION
- **Touches:** New `partials/`, `scripts/build-pages.sh`, `build.sh`, modifies `netlify.toml`, modifies all 6 `*.html` (insert markers + initial splice)
- **Prereqs:** Phase 33 (HARD — data drift unified). Phase 34 (SOFT — treatment-abroad footer normalized)
- **Enables:** Phase 37 (sitemap reads partials footer), Phase 38 (cleaner diffs when chrome is in partials)
- **Order:** After 33+34, before 37+38
- **Risk:** HIGHEST. Recommend 2 sub-commits: (1) introduce partials + build script + splice, verify byte-identical, smoke-test router; (2) remove inlined chrome from source files
- **Prerequisite spike:** Test Netlify deploy with checked-in tailwindcss binary (1 hour)

### Phase 37 — Site Metadata & Hygiene
- **Touches:** new `sitemap.xml`, `robots.txt`, canonical URL audit, 404.html upgrade, meta-description consistency, flag SVG vendor
- **Prereqs:** Phase 36 (stable footer + canonical partial)
- **Order:** After Phase 36

### Phase 38 — Vertical Rhythm & Section Sizing
- **Touches:** `src/styles/theme.css` (new tokens), all 5 production `*.html` (replace ad-hoc min-h + pt/pb with token utilities), `css/styles.css` regenerated
- **Prereqs:** FEATURES.md research deliverable for canonical vh values; Phase 36 SOFT (cleaner diffs)
- **Enables:** Permanent fix for Phase 35's checkup H1 overflow (tokens are the systematic fix)
- **Order:** Before Phase 35 for cleanest outcome

### Phase 35 — Checkup Fix + Form UX Polish
- **Touches:** `checkup.html` (H1 overflow, H2 hierarchy, gender-neutral labels), `js/main.js` (valid-state feedback across 5 forms)
- **Prereqs:** Phase 38 SOFT (so H1 fix uses tokens, not throwaway min-h)
- **Order:** After Phase 38 ideally

### Recommended Execution Sequence

```
1. Phase 33 — Audit Quick Wins              (no deps)
2. Phase 34 — Treatment Abroad Overhaul     (after 33)
3. Phase 36 — Shared Layout Primitives      (after 33+34)
4. Phase 37 — Site Metadata & Hygiene       (after 36)
5. Phase 38 — Vertical Rhythm & Sizing      (after 36)
6. Phase 35 — Checkup + Form UX             (after 38)
```

**Note:** This is NOT numerical order. If strict numerical order is mandated (33→34→35→36→37→38), accept that:
- Phase 35's checkup H1 fix uses ad-hoc `min-h-[XXvh]` that Phase 38 rewrites — 2× work, no functional difference
- Everything else still works

---

## Patterns

### Token-first vertical rhythm
```html
<!-- BAD (drift-prone) -->
<section class="min-h-screen pt-32 pb-16 lg:pt-40">

<!-- GOOD (token-anchored) -->
<section class="min-h-section-hero pt-section-pt pb-section-pb lg:pt-section-pt-lg">
```

### Build-marker splice
```html
<!-- BUILD:partial header -->
<header class="header fixed z-50 ..." id="header">...</header>
<!-- BUILD:end header -->
```

### Dual-layer aria-current
Build script sets on matching link per page. Router syncs on SPA navigation. Never set runtime-only.

---

## Anti-patterns

### Client-side fetch+inject for header/footer
Breaks the router's `parsePageHTML` (footer/sticky-bar null in fetched docs), causes flash, breaks Yandex SEO. Not necessary because the router already handles cross-page sync.

### Ad-hoc `min-h-[XXvh]` per page
Causes the exact drift Phase 38 exists to eliminate. Use tokens.

### Modifying partials without re-running build
Add `[build] command = "./build.sh"` to `netlify.toml` so deploy always re-splices. Alternatively, pre-commit hook.

### Recommending nginx SSI on a Netlify site
STACK.md's recommendation is inapplicable. Use build-time splice instead.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|-----------|-------|
| Router existence + contract | HIGH | Read `js/router.js` end-to-end |
| Two-layer token pattern | HIGH | Verified in `theme.css` |
| No build pipeline | HIGH | No Makefile/package.json/scripts/build.sh |
| Tailwind `@source` HTML scanning | HIGH | Verified `tailwind.css:3` |
| Netlify deploy target | HIGH | `.netlify/netlify.toml` exists |
| nginx SSI inapplicable | HIGH | Netlify doesn't support SSI (documented) |
| No dark-mode FOUC script | HIGH | Grepped — zero matches |
| Hero class drift | HIGH | Verified per-page with grep |
| Tailwind v4 `--height-*`/`--spacing-*` utility generation | MEDIUM | Project's `--shadow-form-inset` → `shadow-form-inset` confirms convention; recommend smoke-test one new token before bulk migration |
| Netlify build executing checked-in 76 MB binary | MEDIUM | Binary is executable and checked in; slight concern about Netlify build image permissions — test deploy needed |
| Yandex JS-rendering unreliability | LOW | Conventional wisdom; not load-bearing since recommendation is build-time splice |

---

## Open Questions for Phase-specific Planning

1. **Tailwind v4 utility name smoke-test** — Does `--height-section-hero` become `min-h-section-hero` or `min-h-[var(--section-h-hero)]`? 30-min spike before Phase 38 bulk migration.
2. **Netlify build deploy spike** — Test deploy with `[build] command = "./build.sh"` + checked-in tailwindcss. 1-hour prerequisite for Phase 36.
3. **`partials/header.html` inline `<style>` block** — `index.html:23–51` has inline styles for `.header--scrolled`, `.mobile-menu-overlay`, `.faq__answer`, `a[aria-current="page"]`. Extract to separate partial or move to `theme.css @layer base`? Phase 36 sub-decision.
4. **Vertical rhythm research** — Concrete vh benchmarks for medical landing pages targeting 45+. See FEATURES.md research deliverable.
