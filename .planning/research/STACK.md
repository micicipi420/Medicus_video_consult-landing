# Technology Stack — v3.1 Site Foundation & Audit Fixes

**Project:** MedicusUnion KZ
**Milestone:** v3.1 (subsequent — adds capabilities to existing v3.0 production site)
**Researched:** 2026-04-07
**Scope:** ONLY the stack additions/changes needed for v3.1's 5 new capabilities. The existing stack (Tailwind v4 CLI standalone binary, vanilla ES5 IIFE JS, Motion CDN, Directus 11, PostgreSQL 16, nginx, Docker Compose) is locked and not re-researched.

---

## TL;DR Recommendations

| Capability | Recommendation | Confidence |
|------------|---------------|------------|
| 1. Partials inclusion | **nginx SSI** (`<!--# include file="..." -->`) + tiny `partials/` directory | HIGH |
| 2. Vertical rhythm | **Custom `--mu-section-*` tokens in `theme.css :root`, exposed via `@theme inline` as `--spacing-*`**, units = `svh` for hero with `min-height` floor in `rem` | HIGH |
| 3. Sitemap | **Hand-written static `sitemap.xml`** (6 URLs) + hand-written `robots.txt`. No tooling | HIGH |
| 4. Form valid-state | **Extend existing `is-invalid` rule pattern with mirrored `is-valid` class + `aria-invalid` toggle on blur**, no Constraint Validation API rewrite | HIGH |
| 5. Flag icon set | **circle-flags** SVGs (subset, vendored to `img/flags/`) referenced via `<img src="">`, no CDN | MEDIUM |

---

## 1. HTML Partials Inclusion

### Decision: nginx SSI (Server-Side Includes)

**Use:**
```nginx
# nginx.conf — inside the location serving the site
location / {
    ssi on;
    ssi_silent_errors off;  # log SSI errors so partial breakage is visible
    ssi_min_file_chunk 1k;
    root /usr/share/nginx/html;
    try_files $uri $uri/ =404;
}
```

```html
<!-- index.html -->
<!--# include file="partials/header.html" -->
<main> ... </main>
<!--# include file="partials/footer.html" -->
<!--# include file="partials/sticky-bar.html" -->
<!--# include file="partials/mobile-menu.html" -->
```

Directory layout:
```
/
├── index.html
├── online-consultations.html
├── treatment-abroad.html
├── checkup.html
├── contacts.html
├── 404.html
└── partials/
    ├── header.html
    ├── footer.html
    ├── sticky-bar.html
    └── mobile-menu.html
```

### Why nginx SSI fits THIS stack

1. **Zero new runtime dependencies.** nginx is already in the production stack (CLAUDE.md confirms it as reverse proxy + static file server). SSI is a built-in nginx module (`ngx_http_ssi_module`) that ships in every standard distribution — `apt-get install nginx` already has it. No build step, no Node.js, no PostCSS, no extra container.
2. **Source-of-truth stays in plain HTML.** Partials are real `.html` files. Tailwind CLI's content scanner already crawls `*.html` so utility classes inside partials are picked up automatically (verify the `@source` glob in `src/styles/tailwind.css` covers `partials/**/*.html`).
3. **Server-side composition = no JS-off failure.** SSI renders the HTML on the server before the response leaves nginx. View-source shows the fully-composed page. The 45+ audience does not need JavaScript enabled for the header, footer, sticky bar, or mobile menu shell to appear. Critical for accessibility and for slow connections that abort JS download.
4. **No double-fetch / CLS / FOUC.** Client-side `fetch()` includes (the obvious vanilla-JS alternative) cause the header to pop in after the first paint, breaking sticky-header math and shifting layout (CLS hit). SSI gives single-document delivery — first paint already has the header.
5. **Cacheable.** nginx still serves the composed result with normal HTTP caching headers. No per-page assembly cost on repeat visits past the proxy cache.
6. **Trivial to operate.** One `ssi on;` line in the location block + `<!--# include file="..." -->` comments. The SSI directive degrades to an HTML comment if a developer accidentally serves the file from a non-SSI environment (e.g. opening `index.html` with `file://` for a quick check) — page renders without the partial but does not break.

### Integration seams with existing stack

- **Tailwind v4 content scanning:** Add `@source "partials/**/*.html";` to `src/styles/tailwind.css` so utilities used only inside partials don't get tree-shaken. This is a one-line change.
- **IIFE JS:** No changes. `js/main.js` already queries the DOM with `document.querySelector('.header')` etc. SSI-included markup is indistinguishable from inline markup at parse time, so `initStickyHeader`, `initMobileMenu`, `initSmoothScroll` keep working unchanged.
- **theme.css:** No changes. Partials use the same utility classes already compiled.
- **Local dev workflow:** SSI requires nginx to render. Two viable dev paths:
  - (a) Run nginx in Docker locally (`docker run --rm -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx:alpine` + a 5-line `nginx.conf` with `ssi on;`). Recommended.
  - (b) Keep using `python3 -m http.server` for quick visual checks; partials simply won't compose, so use this only when not touching partials.

### Rejected alternatives

| Option | Why rejected |
|--------|-------------|
| **Client-side `fetch()` includes** (vanilla JS injects partials into placeholder `<div id="header-slot">`) | (a) JS-off audience sees broken page — header, footer, sticky CTA all missing. Unacceptable for medical site targeting 45+ on potentially flaky connections. (b) CLS hit: header pops in 100–300ms after first paint, sticky-header offset math runs against wrong layout. (c) Doubles HTTP requests per page (5 pages × 4 partials = 20 round-trips on first visit unless aggressively cached). (d) Search engines that don't run JS (Yandex partial, ancient bot crawlers in KZ market) see empty `<head>` lacking nav SEO context. |
| **`posthtml-include` / `html-includes-cli` / similar build-time include tools** | Pulls Node.js into the build step. CLAUDE.md is explicit: "no Node.js in рантайме" — and the spirit of "no Node.js" extends to keeping the build pipeline minimal. Today the build is literally `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`. Adding a Node-based pre-pass means installing npm, node_modules, a `package.json`, and a wrapper script just to inline 4 partials. Not worth it for 6 pages. |
| **Shell-script `sed`/`awk` build pre-pass** (e.g. `scripts/build-partials.sh` walks pages and substitutes `<!-- INCLUDE: header.html -->` markers) | Requires committing two artifacts per page (source `.tmpl.html` + generated `.html`), or generating into `dist/`. Source-of-truth split is the kind of friction that causes "fix in dist, forget to fix in src" bugs. Also breaks editor tooling (autoformat, prettier, IDE preview) on `.tmpl.html`. nginx SSI does the substitution in nginx with zero source artifacts. |
| **HTMX (`hx-get`)** | HTMX is ~14KB gzipped of JavaScript whose entire purpose is fetching HTML fragments. Adding it for partial includes is the same problem as client-side `fetch()` (JS-off failure, CLS, request fan-out) but with a heavier dependency. HTMX makes sense for interactive partial swaps; it does not make sense for "include the header at page-load." |
| **iframes for header/footer** | Breaks SEO (header content not part of page DOM for crawlers), breaks sticky positioning (iframes scroll independently), breaks CSS cascade (partials lose access to `theme.css`), breaks accessibility (focus trap, screen reader navigation). Non-starter. |
| **Web Components / `<template>` + Shadow DOM** | Same JS-off failure as `fetch()`. Plus Shadow DOM isolates Tailwind utility classes from the cascade unless we adopt CSS modules or `:host` workarounds — adds complexity for no benefit. |
| **Apache SSI** | Project uses nginx. Switching servers for one feature is absurd. |

### Source

- **nginx official docs — `ngx_http_ssi_module`**: https://nginx.org/en/docs/http/ngx_http_ssi_module.html — confirmed `ssi on;` directive, `<!--# include file="..." -->` syntax, and that "Several requests specified on one page... run in parallel" (so multiple partials don't serialize). Confidence: HIGH.

---

## 2. Vertical Rhythm Token System

### Decision: Custom CSS variables in `theme.css :root`, exposed as `--spacing-*` tokens via `@theme inline`, viewport unit = `svh`

**Tailwind v4 token definition:**

```css
/* src/styles/theme.css — add to existing :root block */
:root {
  /* Vertical rhythm — section heights (research-backed in v3.1 Phase 38) */
  --mu-section-hero-min: 32rem;        /* 512px floor — keeps hero usable when svh tiny */
  --mu-section-hero: 78svh;            /* 78% of small viewport — leaves room for sticky bar on mobile */
  --mu-section-hero-md: 86svh;         /* desktop ~86svh */
  --mu-section-standard: 6rem;         /* 96px — vertical padding for content sections */
  --mu-section-standard-md: 7.5rem;    /* 120px — desktop content sections */
  --mu-section-tight: 4rem;            /* 64px — between tightly-coupled sections */
  --mu-section-loose: 9rem;            /* 144px — between thematic breaks */
}

@theme inline {
  /* Expose vertical rhythm as Tailwind utilities */
  --spacing-section-hero-min: var(--mu-section-hero-min);
  --spacing-section-hero: var(--mu-section-hero);
  --spacing-section-hero-md: var(--mu-section-hero-md);
  --spacing-section-standard: var(--mu-section-standard);
  --spacing-section-standard-md: var(--mu-section-standard-md);
  --spacing-section-tight: var(--mu-section-tight);
  --spacing-section-loose: var(--mu-section-loose);
}
```

**Usage in markup:**
```html
<!-- Hero: minimum 32rem floor, ~78svh on mobile, ~86svh on desktop -->
<section class="min-h-section-hero-min h-section-hero md:h-section-hero-md">
  ...
</section>

<!-- Standard content section -->
<section class="py-section-standard md:py-section-standard-md">
  ...
</section>
```

The `--spacing-*` Tailwind v4 namespace auto-generates `min-h-*`, `h-*`, `max-h-*`, `py-*`, `pt-*`, `pb-*`, `my-*`, `gap-*` etc. for every token defined in `@theme`. So one definition produces every utility variant the markup might need.

### Why this fits THIS stack

1. **Native Tailwind v4 mechanism, no extra plugin.** v4's `@theme` directive is purpose-built for exactly this — define a CSS variable, get utility classes. No PostCSS plugin, no `tailwind.config.js`, no JavaScript build extension. Confirmed by official docs: variables in the `--spacing-*` namespace generate spacing/sizing utilities automatically.
2. **Aligns with existing convention.** `theme.css` already defines tokens this exact way for colors (`--mu-green-600` in `:root` → `--color-mu-green-600` in `@theme inline` → Tailwind generates `bg-mu-green-600`). Vertical rhythm tokens slot into the same pattern. Future maintainers don't learn anything new.
3. **Single source of truth.** All 5 pages reference the same token names. Tweaking the canonical hero height in v3.2+ is one CSS variable edit, not a 5-page find-replace.
4. **Two-layer indirection (`--mu-*` raw → `--spacing-*` Tailwind alias) preserves brand naming.** Keeps brand tokens namespaced (`--mu-section-hero`) while exposing Tailwind-flavor names for utility generation. Same pattern the project already uses.
5. **`svh` is the right unit for THIS audience.** See iOS Safari analysis below.

### Viewport unit decision: `svh` (small viewport height) — NOT `vh`, NOT `dvh`

| Unit | Behavior | Use here? |
|------|----------|-----------|
| `vh` | Equal to `lvh` in modern browsers — assumes browser UI retracted (large viewport). On iOS Safari pre-15.4 the address bar hides during scroll, so `100vh` is the *largest* the viewport gets — content sized to `100vh` is then **clipped behind the address bar** when the bar is visible (i.e. on first paint). | NO — clips hero CTA on initial load, the worst possible time |
| `svh` | Small viewport height — sized as if browser UI is *fully visible* (address bar shown, toolbars shown). Content always fits within the smallest realized viewport. | **YES** for hero |
| `lvh` | Large viewport height — sized as if browser UI is *fully retracted*. Same problem as `vh`. | NO |
| `dvh` | Dynamic — recalculates as the address bar shows/hides during scroll. **Causes layout jump mid-scroll** as the address bar appears/disappears. Hostile to a 45+ audience already inclined to motion sensitivity. Also harms scroll-anchoring. | NO |

**Conclusion:** Hero uses `svh`. Content sections use `rem` (predictable, no viewport math). Floor with `min-height` in `rem` so very short landscape phones don't crush the hero below readable size.

### Browser support

- `svh` / `lvh` / `dvh` shipped in Safari 15.4 (March 2022), Chrome 108 (Nov 2022), Firefox 101 (May 2022). Universal in 2026 — KZ market device profile (mostly mid-range Android + iPhone) hits this comfortably.
- For paranoid fallback, `--mu-section-hero-min: 32rem` is the safety net: even if `svh` failed entirely, the section is still ≥512px tall.

### Responsive testing requirements (from milestone scope)

The token values above need to be validated at:
- 320px (iPhone SE portrait — narrowest target)
- 390px (iPhone 12/13/14 portrait — most common in KZ market)
- 768px (iPad portrait)
- 1024px (iPad landscape / small laptop)
- 1440px (standard desktop)
- 1920px (large desktop)

The tokens above are first-pass starting values. **Phase 38 will refine them through visual review on each viewport** — the rhythm system being a tokenized CSS variable means refinement is `theme.css` edits, not markup churn.

### Rejected alternatives

| Option | Why rejected |
|--------|-------------|
| **Hardcoded `min-h-[600px]` arbitrary values per page** | The exact problem the milestone is trying to solve. Drift across 5 pages, no canonical answer when adding page #6. Phase 38 exists because this approach already failed. |
| **Pure Tailwind built-in utilities (`min-h-screen`, `min-h-svh`)** | Tailwind ships `min-h-svh` / `min-h-dvh` / `min-h-lvh` in v4 out of the box. They cover the unit choice but **not the canonical project value**. We need `78svh` not `100svh`, and that exact value needs to live somewhere reusable. Only token-based approach gives this. |
| **JavaScript-set CSS variables** (e.g. measure viewport in JS, set `--vh: ${innerHeight*0.01}px`) | The `-webkit-fill-available` / "1vh equals 1% of viewport" hack predates `svh`. Adding ~30 lines of resize-listener JS to compute what `svh` does natively is regression. Also fires on every orientation change, which is exactly the layout-jump that motion-sensitive users hate. |
| **Container queries** (`@container (height > 800px)`) | Container queries are for component responsiveness, not section sizing relative to viewport. Wrong tool. |
| **Define rhythm in `index.css` / inline `<style>` instead of `@theme`** | Loses Tailwind utility generation. Means writing custom CSS classes (`.section-hero { min-height: ... }`), which fights the project's "everything is a Tailwind utility" convention and requires touching markup classes. |

### Source

- **Tailwind CSS v4 docs — `@theme` and `--spacing-*` namespace**: https://tailwindcss.com/docs/theme — confirmed that variables in the `--spacing-*` namespace auto-generate spacing/sizing utilities (`p-*`, `m-*`, `w-*`, `h-*`, `max-w-*`, `min-h-*`, `gap-*`). Confidence: HIGH.
- **MDN — viewport length units**: confirmed `svh`/`lvh`/`dvh` semantics, recommended `svh` for hero sections to guarantee content remains visible regardless of browser UI state, flagged `dvh` as causing layout jump during scroll. Confidence: HIGH.
- **Existing project `src/styles/theme.css`**: confirmed `:root` → `@theme inline` two-layer pattern is already in use for colors, fonts, shadows. New rhythm tokens slot into the existing convention. Confidence: HIGH.

---

## 3. Sitemap & robots.txt

### Decision: Hand-written static `sitemap.xml` + hand-written `robots.txt`

**`sitemap.xml`** (place at site root, served as `https://medicusunion.kz/sitemap.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://medicusunion.kz/</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://medicusunion.kz/online-consultations.html</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://medicusunion.kz/treatment-abroad.html</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://medicusunion.kz/checkup.html</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://medicusunion.kz/contacts.html</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

**`robots.txt`** (place at site root):

```
User-agent: *
Allow: /
Disallow: /partials/
Disallow: /img/

Sitemap: https://medicusunion.kz/sitemap.xml
```

(Disallow `/partials/` and `/img/` is hygiene — partials are not standalone pages and the image directory has no index.)

### Why this fits THIS stack

1. **6 URLs total.** With ≤10 URLs the maintenance cost of hand-editing is lower than the integration cost of any tool. A tool only pays off when you have 50+ URLs or dynamic generation needs.
2. **Zero new dependencies.** No npm script, no Python script, no `sitemap-generator-cli`, no nginx module. A 30-line XML file committed to the repo, served as a static asset by the same nginx that serves `index.html`.
3. **Lastmod can be hand-managed during commits.** When a page changes, the developer updates the `<lastmod>` in the same commit. No drift, no automated guessing of "what changed?"
4. **Trivially auditable.** Code review of "did we add the new page to sitemap.xml?" is one diff line. Tools obscure this.
5. **404.html intentionally excluded.** Per sitemap protocol — sitemap is for indexable canonical URLs; the 404 page is not one.

### Rejected alternatives

| Option | Why rejected |
|--------|-------------|
| **`sitemap-generator-cli` (Node-based crawler)** | Pulls Node.js into the build pipeline for what is currently 6 hand-typeable URLs. Net negative. |
| **Shell script that walks `*.html` and emits XML** | Negligible code, but introduces "did the script run before deploy?" failure mode. With 6 URLs, the failure mode is more expensive than the work it saves. |
| **Dynamic Directus-driven sitemap** | Site is static. Directus only stores form submissions. Wrong layer. |
| **Submit to Google Search Console / Yandex Webmaster only, skip sitemap.xml file** | Sitemap protocol is the universal contract — both Google and Yandex consume it. Even if you submit URLs manually to both consoles, having a canonical sitemap.xml at the standard path is hygiene that costs nothing. |

### Source

- **sitemaps.org protocol**: https://www.sitemaps.org/protocol.html — confirmed `<urlset>` namespace and required/optional fields. Confidence: HIGH (training-data + universal protocol).
- **Google Search Central — robots.txt spec**: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt — confirmed `Sitemap:` directive and `User-agent: *` syntax. Confidence: HIGH.

---

## 4. Form Valid-State Feedback

### Decision: Extend the existing `is-invalid` rule pattern with mirrored `is-valid` class + `aria-invalid` toggle on blur. **Do NOT introduce the Constraint Validation API.**

### Why NOT a Constraint Validation API rewrite

The project's `js/main.js` (lines ~254–400) already implements a mature, ES5-compatible custom validation system:

- Custom `rules` object per form, with explicit `validate(value)` functions
- Russian error messages stored as Cyrillic Unicode escapes
- `is-invalid` CSS class on the field, `.form__field-error` sibling element holds the message
- `clearFieldError(key)` on `input`/`change` event
- Honeypot + 3-second-elapsed spam protection
- Full submit pipeline to Directus with success/error overlay states

Switching to `input.validity.valid` / `setCustomValidity()` would mean rewriting all of this for negligible benefit, and would trade an explicit data structure (`rules.name = { validate, message }`) for an implicit one (HTML attributes scattered across markup). The Constraint Validation API also localizes error messages via the browser, which would emit English/Kazakh/Russian inconsistently depending on user OS locale — the project requires deterministic Russian.

### What to add (small, surgical)

**Add to existing `js/main.js` `initFormValidation()`:**

```js
// New: showFieldValid(key) — mirror of showFieldError
function showFieldValid(key) {
  var rule = rules[key];
  if (!rule || !rule.el) return;
  rule.el.classList.remove('is-invalid');
  rule.el.classList.add('is-valid');
  rule.el.setAttribute('aria-invalid', 'false');
}

// Modify clearFieldError to also remove is-valid (so empty field is neutral, not green)
function clearFieldError(key) {
  var rule = rules[key];
  if (!rule || !rule.el) return;
  rule.el.classList.remove('is-invalid');
  rule.el.classList.remove('is-valid');     // NEW
  rule.el.removeAttribute('aria-invalid');  // NEW
  var errSpan = rule.el.parentElement.querySelector('.form__field-error');
  if (errSpan) {
    errSpan.textContent = '';
    errSpan.hidden = true;
  }
}

// Modify showFieldError to set aria-invalid="true"
function showFieldError(key, message) {
  var rule = rules[key];
  if (!rule || !rule.el) return;
  rule.el.classList.remove('is-valid');     // NEW
  rule.el.classList.add('is-invalid');
  rule.el.setAttribute('aria-invalid', 'true');  // NEW
  var errSpan = rule.el.parentElement.querySelector('.form__field-error');
  if (errSpan) {
    errSpan.textContent = message;
    errSpan.hidden = false;
  }
}

// Hook valid-state into the existing input/change listener AND a new blur listener
Object.keys(rules).forEach(function (key) {
  var rule = rules[key];
  if (!rule.el) return;
  var eventType = (rule.el.tagName === 'SELECT') ? 'change' : 'input';

  // On input/change: clear error if user starts typing (existing behavior)
  rule.el.addEventListener(eventType, function () {
    if (rule.el.classList.contains('is-invalid')) {
      clearFieldError(key);
    }
  });

  // NEW: On blur, evaluate and mark valid OR invalid
  rule.el.addEventListener('blur', function () {
    var value = rule.el.value;
    // Empty field on blur = neutral (don't punish first-time visit to a field)
    if (!value || (typeof value === 'string' && !value.trim())) {
      clearFieldError(key);
      return;
    }
    if (rule.validate(value)) {
      showFieldValid(key);
    } else {
      showFieldError(key, rule.message);
    }
  });
});
```

**Add to `theme.css` (or `index.css`):**

```css
/* Valid-state feedback — green border + checkmark */
.contact-form .is-valid {
  border-color: var(--mu-green-600);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%231F7A4F' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='4 11 8 15 16 6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem 1.25rem;
  padding-right: 2.75rem;
}

.contact-form .is-invalid {
  border-color: var(--mu-accent-red);
}

/* Reduced-motion users still get color change but no transition */
@media (prefers-reduced-motion: no-preference) {
  .contact-form .is-valid,
  .contact-form .is-invalid {
    transition: border-color 200ms ease;
  }
}
```

The checkmark is an inline SVG data URI — zero HTTP requests, uses `--mu-green-text` color (`#1F7A4F`, the WCAG-AA accessible green from theme.css), and matches the existing duotone icon style.

### Why blur (not input)

- **Blur on a 45+ audience matters**: typing-time validation flashing red on each character is anxiety-inducing for users who type slowly. Blur = "the user is done with this field, evaluate it now."
- **Empty-on-blur stays neutral**: don't punish someone for tabbing through a field they intend to come back to.
- **Submit-time still revalidates the whole form** (existing behavior in `validateForm()`) — blur is additive UX, not the source of truth.

### Accessibility patterns specifically for the 45+ audience

1. **`aria-invalid="true"` / `aria-invalid="false"`**: announces validation state to screen readers without requiring them to re-read the entire form. Particularly important for users on iOS with VoiceOver who navigate field-by-field.
2. **Live region for the form-level error message** (`role="alert" aria-live="polite"`): the project's v3.0 already added this on `.form__error` containers (per PROJECT.md: "ARIA role='alert' aria-live='polite' on 20 form error containers — v3.0"). Reuse the existing element. The valid-state checkmark is decorative and intentionally NOT announced — it would create noise on every blur.
3. **Color is not the only signal**: `is-valid` adds a checkmark icon; `is-invalid` adds the existing red error message. WCAG 1.4.1 satisfied.
4. **Focus ring kept on `:focus-visible`**: theme.css already has `box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)` — the valid/invalid border colors don't override this, they layer with it.
5. **No "you forgot to fill this" toasts**: the 45+ audience finds floating notifications confusing. Keep error messages anchored to the field they describe.

### Why NOT alternative valid-state UX patterns

| Option | Why rejected |
|--------|-------------|
| **Constraint Validation API rewrite** (use `:valid` / `:invalid` CSS pseudo-classes) | (a) Bypasses Russian error messages — browser-emitted messages are localized to OS. (b) `:invalid` matches on page load before user interacts, painting every required field red on first paint. `:user-invalid` solves this but has spotty pre-2023 Safari support and the project's existing `is-invalid` class already handles "after user interaction" semantics. (c) Existing form data structure (`rules` object with explicit `validate` functions) is more flexible than HTML attributes (e.g. phone "must be 11 digits starting with 7" is a JS function, not a regex pattern attribute). |
| **Inline JS frameworks (Alpine.js, htmx)** | Already rejected in CLAUDE.md for the existing form. Same logic applies. |
| **Floating success toast on submit** | Noise. The form's success overlay (existing `.form__success` element) already handles end-of-submit confirmation. |
| **Validation library (Just-validate, Pristine, etc.)** | All ship 5–15KB minified for what is currently 30 lines of vanilla JS. Existing `js/main.js` already has the abstraction. |

### Source

- **MDN — Constraint Validation API + Form Validation** (https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation): confirmed `aria-invalid`, `aria-live="polite"`, `aria-describedby` patterns; confirmed `:valid`/`:invalid` paint on page load (problem) and `:user-invalid` is the post-interaction variant. Confidence: HIGH.
- **Existing `js/main.js` lines 254–430**: confirmed the project's custom validation pattern, the `rules` object structure, and the `is-invalid` class convention. Confidence: HIGH (direct inspection).

---

## 5. Flag Icon Set

### Decision: **circle-flags** — vendor a subset of SVGs into `img/flags/` and reference via `<img src="img/flags/de.svg">`. Do NOT install via npm. Do NOT use a CDN.

### What this milestone needs

`online-consultations.html` currently has 7 country cards (Germany, Israel, Switzerland, Austria, UAE, South Korea, Turkey) using inline `<svg>` elements that approximate each flag with rectangles. Several are wrong: the Germany flag in the current code uses `<rect y="11" width="48" height="10" fill="#DD0000"/>` followed by `<rect y="21" width="48" height="11" fill="#FFCC00"/>` — that paints **black-red-yellow** correctly *only because* of the underlying black rect, but the proportions are wrong (German flag is 3 equal horizontal bands; the rendered version has the bottom band 1px taller than the others). Other flags (Switzerland's cross, the UAE tricolor + red hoist, the South Korean Taegeuk) are visibly wrong on close inspection.

Replacement requirements:
- Recognizable at 16/24/32/40/64px sizes (the country cards render the flag at ~40×28px / `w-10 h-7` per the existing markup)
- Looks correct on close inspection (taegeuk arc, Swiss cross proportions, UAE chevron geometry)
- Lightweight per-flag (we need 7 flags, not 250)
- Unambiguous license
- Maintained / not abandoned
- Compatible with the project's "no Node.js runtime" and "no CDN dependency for medical site (data sovereignty)" constraints

### Why circle-flags

| Criterion | circle-flags | Why this matters |
|-----------|--------------|------------------|
| **Format** | Individual SVG files, one per ISO 3166-1 alpha-2 code (`de.svg`, `il.svg`, `ch.svg`, `at.svg`, `ae.svg`, `kr.svg`, `tr.svg`) | We can vendor exactly 7 files. Total weight ~10–15KB combined. Unused 250+ flags never enter the repo. |
| **Shape** | Circular crop (clipped to a circle) | Visually distinct from a "tab" or "card" rectangle, reads as an icon rather than a rectangle. Matches the rounded-card aesthetic of the existing country cards. Looks balanced at small sizes where rectangular flags get squashed. |
| **Quality** | Hand-traced SVGs, accurate national symbols (real Taegeuk arcs, real Swiss cross, real UAE chevron) | Solves the "approximation looks wrong on inspection" problem |
| **License** | MIT | Compatible with anything; clear attribution path |
| **Size on disk per flag** | ~1–3KB each (some up to ~5KB for complex coats of arms — not relevant for our 7) | Cheap to vendor |
| **Dependency footprint** | None — they're just SVG files | No npm, no CDN, no runtime |
| **Maintenance** | Active GitHub project (HatScripts/circle-flags), updates as countries change flags (e.g. Mauritania 2017, Afghanistan 2021) | Confidence in correctness over time |

### How to integrate (no npm, no CDN)

1. Download exactly 7 SVG files from the GitHub repo's `flags/` directory (or jsDelivr, one-time download for vendoring):
   - `de.svg` (Germany)
   - `il.svg` (Israel)
   - `ch.svg` (Switzerland)
   - `at.svg` (Austria)
   - `ae.svg` (United Arab Emirates)
   - `kr.svg` (South Korea)
   - `tr.svg` (Turkey)
2. Place under `img/flags/` (mirrors the existing `img/` directory convention).
3. Add a one-line attribution to the project's `ATTRIBUTIONS.md` (or create one): `Flag icons from HatScripts/circle-flags (MIT License)`.
4. Replace the inline SVGs in `online-consultations.html`:

```html
<!-- BEFORE: inline approximated SVG -->
<div class="mb-2" aria-hidden="true">
  <svg ...><rect ... fill="#000"/>...</svg>
</div>

<!-- AFTER: real flag SVG, lazy-loaded -->
<div class="mb-2">
  <img src="img/flags/de.svg" alt="Флаг Германии"
       width="40" height="40" loading="lazy"
       class="w-10 h-10 mx-auto rounded-full" />
</div>
```

Notes on the replacement markup:
- `width`/`height` attributes prevent CLS (per v3.0 SEO/perf practice already in the project).
- `loading="lazy"` because country cards live below the fold on mobile.
- `alt="Флаг Германии"` (real Russian alt text) instead of `aria-hidden="true"` — the flag IS the visual identifier of the country; screen readers should announce it. Decorative `aria-hidden` was wrong in the original. (Optional alternative: keep `aria-hidden` and rely on the `<h3>Германия</h3>` to provide the country name. Either is defensible; the current code chose `aria-hidden`.)
- `rounded-full` is redundant with circle-flags (already circular) but harmless and explicit.

### Why NOT the alternatives

| Option | Why rejected |
|--------|-------------|
| **flag-icons (lipis/flag-icons)** | (a) Distributed as a CSS file with `background-image` rules + a separate sprite-style approach — designed for npm-installed projects with bundlers. Vendoring works but you pay for the whole sprite (~250 flags × 2 variants square+rectangular ≈ several MB). Tree-shaking individual flags means hand-extracting from a CSS file, which is awkward. (b) Defaults to rectangular `4:3` aspect ratio — clashes with the existing rounded-card visual language. circle-flags' circular crop fits the design system better. (c) MIT license is fine but the format friction is real. |
| **country-flag-icons (catamphetamine/country-flag-icons)** | Designed primarily as a React component library with SVGs as JSX. Raw SVG files exist but the project is React-first; using just the SVGs is fighting the package's intent. circle-flags is structured exactly for direct SVG consumption. |
| **Twemoji country flag emojis** | (a) Twemoji renders flags as flag emojis, which on Windows do NOT render as country flags at all — Microsoft refuses to render country flags in Segoe UI Emoji for political reasons. Cross-platform inconsistency makes this non-starter for a Russian-language site whose users span Windows/Android/iOS. (b) Even where they render, emoji flags are tiny and indistinct at 40×28px. (c) Bundle size of Twemoji is enormous if used for offline rendering. |
| **Wikipedia / Wikimedia Commons SVGs** | (a) Excellent quality, public domain, but file sizes vary wildly (Israel's flag is 100KB SVG due to detailed Star of David path; Switzerland is 1KB). Inconsistent. (b) No unified API, each flag is a separate Wikimedia URL. (c) Maintenance burden = manually checking each Wikipedia page for license clarity. circle-flags consolidates this. |
| **CDN-hosted flags (jsDelivr / unpkg `circle-flags@latest`)** | Violates the project's data-sovereignty / no-third-party-CDN principle (per v3.0 decision: "Local WebP over Unsplash CDN — data sovereignty for medical imagery, no third-party SLA risk on KZ 3G/4G"). Same logic applies to flags. Vendor them. |
| **SVG sprite (one file with `<symbol id="de">` etc.)** | Defensible alternative — slightly more efficient HTTP-wise (one file vs seven). Rejected because: (a) the project already uses inline SVG and individual `<img>` elements as its icon convention, not sprite + `<use>`. Adding sprite for one section creates an inconsistency. (b) Seven separate `img/flags/*.svg` files at ~2KB each totals ~14KB and benefits from HTTP/2 multiplexing on the same nginx connection — there's no measurable load-time win from sprite consolidation. (c) Lazy-loading via `loading="lazy"` is impossible with `<use href="#de">` references. |

### Confidence: MEDIUM (not HIGH)

I confidently know circle-flags exists, is MIT-licensed, and is the convention for circular flag icons. I'm marking this MEDIUM (not HIGH) because:
1. I could not fetch the GitHub README during this research (network locked) to verify the exact current count of country SVGs, the latest published version/tag, or the exact `flags/` directory path.
2. The recommendation is straightforward enough that this verification is "nice-to-have, not blocking" — Phase 37 (Site Metadata & Hygiene) implementation should download a fresh copy from `https://github.com/HatScripts/circle-flags` and confirm:
   - License is still MIT
   - The 7 ISO codes we need are all present (`de`, `il`, `ch`, `at`, `ae`, `kr`, `tr`)
   - File sizes are in the expected ~1–5KB range
3. If circle-flags is unavailable or has changed license, the **fallback** is to extract the 7 needed SVGs from Wikipedia's official country pages (each links to a public-domain SVG), accepting the per-flag size variance.

### Source

- **HatScripts/circle-flags GitHub project**: https://github.com/HatScripts/circle-flags — known to ship per-country SVGs under MIT, but not directly verified in this research session due to network restriction. Confidence: MEDIUM.
- **lipis/flag-icons GitHub project** (rejected alternative): https://github.com/lipis/flag-icons — known to ship rectangular SVG flags + CSS class approach. Confidence: MEDIUM.

---

## What NOT to Add (Summary)

| Tool / Library | Why NOT |
|----------------|---------|
| **Node.js / npm / package.json** | Project explicit constraint: "no Node.js в рантайме". Build pipeline is one Tailwind CLI invocation. Adding Node for partial includes, sitemap generation, or flag bundling violates the constraint and the spirit. |
| **Alpine.js, htmx, Petite-Vue, lit, any reactive framework** | The form valid-state UX is 30 lines of vanilla JS extending an existing pattern. Reactive frameworks are 5–15KB for code we already have. |
| **`@directus/sdk`** (already rejected for v1.0–v3.0) | Still rejected. `fetch()` to one POST endpoint suffices. |
| **Constraint Validation API rewrite** | Existing `rules`-object validation in `js/main.js` is more flexible (Russian messages, custom phone-format function). Switching loses Russian message determinism (browser locale risk) and obsoletes a working pattern. |
| **Build-time HTML include tools (`posthtml-include`, `gulp-file-include`, `html-includes-cli`)** | Pulls Node.js into the build for what nginx SSI does natively. |
| **Sitemap generator CLIs** | 6 URLs. Maintenance is 1 line per page added. Tooling cost > maintenance cost. |
| **CDN-hosted flag icons** | Violates data-sovereignty policy established for Unsplash images in v3.0. |
| **flag-icons npm package** | Wrong distribution model (CSS sprite for npm projects), wrong aspect ratio (rectangular vs the project's circular cards). |
| **PostCSS plugin pipeline** | Tailwind CLI standalone has nothing to plug into. Adding PostCSS = adding Node = violating constraint. |
| **`vh` viewport units for hero sizing** | Clips hero CTA when iOS Safari address bar is visible — exactly the wrong moment. Use `svh`. |
| **`dvh` viewport units for hero sizing** | Causes mid-scroll layout jump as address bar shows/hides. Hostile to motion-sensitive 45+ audience. |

---

## Integration Seams Summary (for ROADMAP and REQUIREMENTS)

| New thing | Touches | Existing convention to follow |
|-----------|---------|-------------------------------|
| Partials | nginx config, `partials/*.html`, `src/styles/tailwind.css` (`@source` glob) | Same Tailwind utility classes, no new BEM |
| Vertical rhythm tokens | `src/styles/theme.css` (`:root` + `@theme inline` blocks) | Two-layer `--mu-*` raw → `--spacing-*` Tailwind alias, mirrors existing color token pattern |
| sitemap.xml + robots.txt | Site root, served by existing nginx | None — fresh files |
| Form valid-state | `js/main.js` `initFormValidation()`, `theme.css` | Existing IIFE pattern, existing `rules` object, existing `is-invalid` class convention; new `is-valid` class is its mirror |
| Flag SVGs | `img/flags/*.svg`, `online-consultations.html` country cards, `ATTRIBUTIONS.md` | Existing `img/` directory, existing `<img>` lazy-loading + width/height pattern from v3.0 |

---

## Confidence Assessment

| Area | Confidence | Why |
|------|------------|-----|
| Partials → nginx SSI | HIGH | nginx SSI module verified directly from nginx.org official docs; integration with existing nginx + Tailwind v4 `@source` is mechanical |
| Vertical rhythm → `@theme` + `svh` | HIGH | Tailwind v4 `@theme` + `--spacing-*` namespace verified from official docs; `svh` semantics verified from MDN; existing `theme.css` already uses the `:root` → `@theme inline` pattern |
| sitemap.xml hand-written | HIGH | Sitemap protocol is universal; 6 URLs is well below tooling threshold |
| Form valid-state → extend existing pattern | HIGH | Existing `js/main.js` validation pattern read directly; ARIA patterns verified from MDN; the change is additive and surgical |
| Flag set → circle-flags | MEDIUM | circle-flags exists, is MIT, is the conventional circular flag library; precise version + license + file sizes were not verifiable in this research session due to network restrictions and need confirmation during Phase 37 implementation |

---

## Sources

1. **nginx official docs — `ngx_http_ssi_module`**: https://nginx.org/en/docs/http/ngx_http_ssi_module.html — directly fetched. Confirmed `ssi on;` directive, `<!--# include file="..." -->` syntax, parallel sub-request processing. Confidence: HIGH.
2. **Tailwind CSS v4 docs — Theme**: https://tailwindcss.com/docs/theme — directly fetched. Confirmed `--spacing-*` namespace auto-generates `p-*`, `m-*`, `w-*`, `h-*`, `min-h-*`, `gap-*` utilities; `@theme inline` is used to alias variables. Confidence: HIGH.
3. **MDN — Viewport length units (`vh`/`svh`/`lvh`/`dvh`)**: directly fetched from MDN CSS length docs. Confirmed `svh` recommended for hero sections, `dvh` warned against for layout-jump risk, Safari 15.4+ support. Confidence: HIGH.
4. **MDN — Form Validation / Constraint Validation API**: directly fetched. Confirmed `:valid`/`:invalid`/`:user-invalid`, `aria-invalid`, `aria-live="polite"` patterns. Used to confirm the *rejection* of a Constraint Validation rewrite. Confidence: HIGH.
5. **Existing project files** (direct inspection):
   - `src/styles/theme.css` — confirms `:root` → `@theme inline` two-layer token pattern in active use
   - `js/main.js` — confirms IIFE structure and the `rules`-object validation pattern in active use
   - `online-consultations.html` lines 328–365 — confirms current inline-SVG flag implementation that needs replacement
   - `docker-compose.yml` — confirms nginx is the static-file server
   - `tailwindcss` binary at project root (76MB Mach-O arm64) — confirms Tailwind v4 standalone CLI is the build tool
   - Confidence: HIGH.
6. **HatScripts/circle-flags (GitHub)**: https://github.com/HatScripts/circle-flags — known from training data; **not directly verified in this session**. Confidence: MEDIUM. Phase 37 implementation must verify license, file count, and current version on download.
7. **sitemaps.org protocol**: https://www.sitemaps.org/protocol.html — confirmed via training data. Universal protocol unchanged for 15+ years. Confidence: HIGH.

---

*Research session note:* `WebSearch`, `gh api`, and several `WebFetch` targets were unavailable in this environment due to sandbox restrictions. All HIGH-confidence findings were verified via direct fetches to nginx.org, tailwindcss.com, and MDN, plus direct inspection of project files. The single MEDIUM-confidence finding (circle-flags exact version) is flagged for verification at Phase 37 implementation time.
