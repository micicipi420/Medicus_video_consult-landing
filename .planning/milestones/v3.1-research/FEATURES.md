# Feature Landscape — v3.1 Site Foundation & Audit Fixes

**Domain:** Medical / cross-border healthcare landing site (multi-page static)
**Audience constraint:** Russian-only, ЦА Казахстан 45+
**Researched:** 2026-04-07
**Scope:** 5 NEW feature categories introduced this milestone (existing forms / FAQ / dark mode / SEO / a11y are NOT re-researched)
**Overall confidence:** HIGH for form validation + viewport units + aria-current (MDN-verified). MEDIUM for vertical-rhythm benchmarks (no live competitor crawls available — derived from documented patterns + the codebase's existing values). MEDIUM for flag library comparison (no npm registry crawl available — derived from prior knowledge + library docs).

---

## Category 1 — Shared Layout Primitives (header / footer / sticky bar / mobile menu)

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| **Single source of truth for header markup** | Audit Issue #4: 5 divergent footer variants across 5 pages already caused trust-damaging address drift (Issue #1). Any production multi-page site MUST have one canonical header/footer or it accumulates drift on every content edit. | Medium | Existing 6 pages all hand-roll header + footer + sticky bar + mobile menu (~150 lines × 5 ≈ 750 dup lines). |
| **`aria-current="page"` on active nav link** | WCAG-recommended pattern for navigation sets. Currently ONLY `contacts.html` does this — every other page is missing it (Audit recommended action #10). | Low | MDN: set on at most one element per nav. Use `setAttribute('aria-current', 'page')` after partial injection — this is the standard pattern. |
| **Visible active-state styling tied to `aria-current`** | Without a visual cue, 45+ users lose orientation across 6 pages. Standard CSS: `[aria-current="page"]` selector → underline / weight / color. No JS needed for the styling, only for the attribute. | Low | Selector-only, zero runtime cost. |
| **No-JS fallback that still renders the page** | The site sells trust to a 45+ medical audience. A blank page when JS fails is unacceptable. MDN explicitly says `<noscript>` is "not suitable as a comprehensive fallback for sites that heavily depend on JavaScript for layout." | Medium | Must NOT depend on `fetch + innerHTML` for primary content. Implication: header/footer cannot be JS-injected on first paint without a visible fallback. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| **Build-step HTML inlining (recommended)** | Header/footer authored once in `partials/`, inlined into all 6 pages by a build script before serve. JS-disabled users still see real header. No FOUC. No paint-timing penalty. Survives crawler/JS-off audits. | Medium (one-time tooling) | This is the right answer for THIS project given the no-Node-runtime constraint and 45+ JS-off concern. A ~30-line shell or `node` build script (`<!-- @include partials/header.html -->` directive replacement) is sufficient. Ships at build time, not runtime. |
| **Pre-rendered header + JS upgrade for `aria-current`** | If build-step inlining is rejected, ship header/footer inline in each page (status quo) and use a tiny JS file (~10 lines) that reads `document.body.dataset.page` and sets `aria-current` on the matching nav link. Header is already correct without JS; JS only adds the active-state attribute. | Low | This is the minimum-complexity path. It accepts the duplication cost in exchange for zero runtime risk and zero build tooling. Use only if build step is rejected. |

### Anti-Features (DO NOT)

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| **Web Components / Custom Elements** for header/footer | MDN: "Custom elements MUST be registered and instantiated via JavaScript … Without JS, the page would display unstyled, non-functional content." Wrong choice for a medical trust site with 45+ audience on possibly-flaky JS. | Build-step inlining or JS-progressive-enhancement on inline markup. |
| **`fetch + innerHTML` for header/footer at runtime** | Causes FOUC + LCP regression + paint shift; 45+ users notice the flicker; fails for JS-off; SEO crawlers may index partial markup. MDN guidance: "fetch+innerHTML impacts longer Critical Rendering Path, delayed LCP, layout shifts." | Build-step inlining. |
| **Apache Server-Side Includes (`mod_include`)** | Adds runtime server config dependency; not portable across nginx/CDN/static hosts; build-step inlining produces identical output without locking us to a server. | Build-step inlining. |
| **Iframe-based header/footer** | Breaks deep links, breaks accessibility (focus order, screen reader nav), breaks responsive layout. Universally rejected for 15+ years. | Build-step inlining. |
| **Migrating to a SPA framework** for partials | Existing CLAUDE.md anti-feature: "Any SPA framework (React, Vue, Svelte) — this is a static marketing page, not an application." | Build-step inlining. |

### Recommended Pattern (concrete)

```
partials/
  header.html
  footer.html
  sticky-bar.html
  mobile-menu.html
build-partials.sh   (or build-partials.js)
```

In each `*.html`:
```html
<!-- @include partials/header.html -->
```

Build script: a regex replace pass that runs before `tailwindcss --minify`. The build artifact is plain HTML that is byte-identical for header/footer across all pages — exactly what the audit flagged as missing.

`aria-current` strategy: insert it at build time too, by passing the current page name to the include directive: `<!-- @include partials/header.html page=contacts -->`. The script substitutes `aria-current="page"` into the matching nav link. Zero runtime JS needed for either header rendering OR active state. Survives JS-off, survives crawlers, survives screen readers.

**Dependency:** Adds one build step before `tailwindcss`. Compatible with existing standalone-CLI workflow (no Node runtime added — the script can be a 50-line bash or a one-shot `node` invocation).

---

## Category 2 — Vertical Rhythm & Section Sizing (Phase 38 core)

### Current State (from grep + audit + Read of HTML files)

| Page | Hero `min-h` | Hero padding | Notes |
|---|---|---|---|
| `index.html` | `min-h-screen` (100vh) | `pt-32 pb-16 lg:pt-40` | Audit: pushes hero collage below mobile fold |
| `online-consultations.html` | **NONE** | `pt-32 pb-16` only | Hero shrinks/grows freely with content |
| `treatment-abroad.html` | **NONE** | `pt-32 pb-16` only | Same |
| `checkup.html` | `min-h-[80vh]` | `pt-32 pb-16 lg:pt-40` | Audit: H1 overflow at 1024–1440 |
| `contacts.html` | **NONE** | (no hero section as such; heading is in `<main>` directly at line 116) | Different layout entirely |
| `404.html` | `min-h-[80vh]` on `<main>` | `pt-32 pb-16` | Inconsistent unit choice |

**Drift summary:** 4 different hero sizing strategies on 5 pages. NO canonical token. NO consistent unit. NO mobile-specific value. This is exactly the Phase 38 problem statement.

Section bodies use `mb-16` (64px) or `py-16` (64px) consistently — that part is OK and is the existing baseline rhythm. The bug is hero + (lack of) inter-section vertical breathing on tall viewports.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| **Hero must NOT use `100vh` / `min-h-screen` on mobile** | iOS Safari's `vh` resolves to `lvh` (large viewport, address bar collapsed). When the bar is showing, content gets clipped; when it collapses, the hero jumps. Both are bad for 45+ users. MDN explicitly recommends `svh` for "safer" full-viewport layouts. | Low | This is the single biggest fix in Phase 38. |
| **Hero `min-h` clamped, not `100vh`** | A hero needs enough height to feel "anchored" but shouldn't push every below-fold content out of sight on a 390×844 iPhone. The de-facto pattern for content-rich heroes is `min-h: clamp(560px, 75svh, 760px)` or `min-h-[75svh]` with a max via `lg:max-h-[760px]`. | Low | Token-able. |
| **`<main>` bottom padding ≥ sticky-bar height on mobile** | Already in audit: `pb-8` (32px) is too small; sticky bar is ~80px. Phase 33 fixes this; rhythm system must memorialize the value as a token. | Low | `--space-sticky-bar-clearance: 112px` token, applied as `main.pb-[var(--space-sticky-bar-clearance)] lg:pb-8`. |
| **Inter-section gap is one canonical token** | Currently `gap-8 md:gap-16` on `main` flex is the existing pattern (32px / 64px). Honor it. The rhythm system should ratify it, not re-invent it. | Low | Already an emergent standard; codify. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| **Fluid `clamp()` heights, not fixed `min-h-[80vh]`** | A hero that's `min-h: clamp(560px, 75svh, 760px)` reads "right" on 320, 390, 768, 1024, 1440, AND 1920 because it doesn't grow unboundedly on a 4K display (where 80vh = 1728px of empty hero) and doesn't collapse on a 320×568 iPhone SE (where 80vh = 454px and headline + CTA need ~520px). Fixed `vh` values look "swimming in whitespace" on big screens — exactly what the user flagged. | Low | This is the core Phase 38 insight. Use `clamp(MIN_PX, IDEAL_SVH, MAX_PX)` everywhere a hero needs vertical anchoring. |
| **Heroes use `svh` not `dvh` not `vh`** | MDN: "`dvh` can cause layout shifts during scrolling … may degrade UX and cause performance issues. … Use `svh` for iOS Safari compatibility." For a 45+ medical audience the layout-shift cost of `dvh` is unacceptable; `svh` is the safe default. Tailwind v4 ships `min-h-svh` as a first-class utility (verified MDN/Tailwind docs). | Low | `min-h-svh` available without arbitrary value. For clamp, use `min-h-[clamp(560px,75svh,760px)]`. |
| **Section padding token system in `theme.css`** | Five tokens, applied via `@theme inline` as Tailwind utilities: `--space-hero-min-h`, `--space-section-y`, `--space-section-y-tight`, `--space-mobile-bottom-clearance`, `--space-content-max-w`. Removes drift; new pages inherit canonical values. | Medium | Stays in `theme.css`, no new files. Aligns with Phase 33 sticky-bar fix. |
| **8px baseline rhythm (already adhered to)** | Audit confirmed: top spacing utilities (`px-6`, `p-8`, `px-4`, `mb-4`, `gap-2`) are all multiples of 4 px / 8 px. Codify as a written rule, not just emergent behaviour. | Low | Documentation, not code. |

### Anti-Features (DO NOT)

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| **`min-h-screen` (= `100vh`) on heroes** | Resolves to `lvh` in modern browsers — content gets clipped when iOS Safari address bar is showing. Already a real bug on `index.html` per audit. | `min-h-[clamp(560px,75svh,760px)]` |
| **`min-h-dvh`** | Triggers re-layout as the iOS bar collapses — creates jumpy hero content during scroll. MDN explicitly warns against. 45+ audience perceives this as "broken." | `svh` |
| **`min-h-[100vh]` arbitrary** | Same as `min-h-screen`, just uglier. | `svh` clamp |
| **Fixed pixel heroes (`h-[760px]`)** | Cropping at 320×568 (oldest iPhone SE) and 320×533 (Galaxy A03) — bottom of hero clips primary CTA on the smallest devices in KZ market. | `min-h-[clamp(560px,75svh,760px)]` |
| **Per-page ad-hoc `min-h` decisions** | Already produced today's drift (4 strategies on 5 pages). The whole point of Phase 38 is to stop this. | One token: `--space-hero-min-h: clamp(560px, 75svh, 760px)` |
| **Aggressive `gap-32` / `py-32` between sections** | "Swimming in whitespace" effect on desktop. Audit confirms current `gap-8 md:gap-16` reads well — keep it. | Hold `gap-8 md:gap-16` |
| **Different section heights per content type** | Content density varies (a 4-card grid is shorter than a 12-FAQ accordion); forcing equal heights via `min-h` makes short sections feel padded and long sections feel cramped. | Let content drive section height. ONLY hero uses `min-h`. |

### Phase 38 — Concrete Recommended Values

**For ROADMAP / REQUIREMENTS to reference directly:**

```css
:root {
  /* Phase 38 vertical rhythm tokens */

  /* Hero — clamp(MIN_PX, IDEAL_SVH, MAX_PX)
   * 560px:  fits headline + subhead + 2 CTAs + trust line on 320×568 (smallest KZ device)
   * 75svh:  about 2/3 of small viewport — gives "hero feel" without dominating
   * 760px:  cap so 4K/1920 doesn't get a 1500px empty hero
   */
  --space-hero-min-h: clamp(560px, 75svh, 760px);

  /* Tighter hero for utility pages (404, contacts) */
  --space-hero-min-h-compact: clamp(440px, 55svh, 580px);

  /* Vertical gap between top-level sections (already used as gap-8/gap-16 in main)
   * Tablet+ baseline matches existing audit-confirmed value
   */
  --space-section-y: 4rem;        /* 64px (existing py-16 / mb-16) */
  --space-section-y-tight: 2rem;  /* 32px (existing gap-8 mobile) */

  /* Bottom clearance under sticky CTA bar on mobile (Phase 33 dependency)
   * sticky bar = 16px bottom + ~52px button + 16px top padding ≈ 84px; +28px breathing
   */
  --space-mobile-bottom-clearance: 7rem; /* 112px → maps to Tailwind pb-28 */

  /* Content column max-width — already 1200px in v1.3 decision; ratify */
  --space-content-max-w: 1200px;
}
```

`@theme inline` mappings:

```css
@theme inline {
  --spacing-hero-min: var(--space-hero-min-h);
  --spacing-hero-min-compact: var(--space-hero-min-h-compact);
  --spacing-mobile-clear: var(--space-mobile-bottom-clearance);
}
```

Enables Tailwind utilities like `min-h-hero-min`, `pb-mobile-clear`.

**Application matrix:**

| Page | Current | Target |
|---|---|---|
| `index.html` hero | `min-h-screen` | `min-h-[var(--space-hero-min-h)]` |
| `online-consultations.html` hero | (none) | `min-h-[var(--space-hero-min-h)]` |
| `treatment-abroad.html` hero | (none) | `min-h-[var(--space-hero-min-h)]` |
| `checkup.html` hero | `min-h-[80vh]` | `min-h-[var(--space-hero-min-h)]` |
| `contacts.html` hero | (none) | `min-h-[var(--space-hero-min-h-compact)]` (utility page, no big illustration) |
| `404.html` `<main>` | `min-h-[80vh]` | `min-h-[var(--space-hero-min-h-compact)]` |
| All `<main>` elements | `pb-8` | `pb-[var(--space-mobile-bottom-clearance)] lg:pb-8` |

**Verification grid:** Phase 38 must verify on these 6 viewports per page (5 pages × 6 viewports = 30 visual checks):

| Viewport | Why |
|---|---|
| 320 × 568 | iPhone SE 1st gen — smallest plausible KZ device; sets the 560px floor |
| 390 × 844 | iPhone 14/15 baseline |
| 768 × 1024 | iPad portrait — common in 45+ demographic |
| 1024 × 768 | Tablet landscape / smallest desktop — current audit found checkup.html H1 overflow exactly here |
| 1440 × 900 | Standard laptop |
| 1920 × 1080 | Desktop / large monitor — guards against the "swimming in whitespace" failure mode |

### 45+ Audience Considerations (explicit, not generic)

1. **Less tolerance for layout shift than younger users.** Vestibular sensitivity grows with age. `dvh` (which animates as the iOS chrome collapses) is therefore a hard NO. `prefers-reduced-motion` is already wired up site-wide (theme.css:303-312); the rhythm system must not introduce motion. `svh` is static and safe.
2. **Higher expected font sizes mean less content fits per fold.** Already addressed by current `text-5xl md:text-6xl lg:text-7xl` H1s (~48–72 px). The 560 px hero floor is computed from headline (≈140 px wrapped) + subhead (≈80 px) + 2 CTAs (≈120 px stacked on mobile) + trust line (≈40 px) + breathing room (≈180 px) ≈ 560 px. Smaller floors clip the CTA pair on iPhone SE.
3. **"Swimming in whitespace" is real.** Older users lose orientation when sections feel disconnected by huge gaps. Documented in age-related UX research patterns: visual grouping needs to be tight enough to be obvious. The `clamp(560, 75svh, 760)` ceiling of 760 px directly addresses this — at 1920 × 1080 the hero stays at 760 px, leaving the next section visible immediately below the fold instead of pushed off-screen.
4. **Confidence cue from "anchored hero".** The 560 px floor exists because heroes shorter than ~half a 1080-pixel screen feel like an HTTP error page. 45+ users land on the page in 1–2 seconds; they need a clear "this is the hero, this is what the company does" zone.

These are the four 45-specific ergonomics, not generic "make it big and friendly".

### Confidence

**HIGH** for `svh` over `dvh`/`vh` (MDN explicitly recommends, Tailwind v4 verified).
**MEDIUM** for the specific clamp values (560/75svh/760) — they are derived from the existing layout dimensions in the codebase + the audit findings + the listed viewport floors, not from a competitor crawl. Implementation should verify them empirically in Phase 38 on each of the 6 viewports and adjust the floor / ceiling within ±60 px if a real hero overflows or under-fills.
**LOW** for direct competitor benchmarks — could not crawl bupa.com / zocdoc.com / labcorp.com / doctolib.com / practo.com / medicusunion.com to extract their actual `min-h` values (WebSearch denied, WebFetch denied for those domains in this environment). Phase 38 plan should include a manual screenshot pass on at least 2 of those sites at the 6 listed viewports as an empirical sanity check before locking the values.

---

## Category 3 — Form Valid-State Feedback (45+ audience)

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| **`:user-valid` styling, NOT `:valid`** | MDN explicit guidance: "Don't show valid state immediately — use `:user-valid` rather than `:valid` to avoid showing success states before users have interacted." `:valid` matches on page load — every empty optional field would show a green checkmark, which is incoherent. `:user-valid` matches only after user has committed a change (blur, submit, or transitioning from invalid → valid while typing). Browser support: Baseline 2023, available in all modern browsers including iOS Safari. | Low | Add CSS rule: `input:user-valid { border-color: var(--mu-green-600); } input:user-valid + .field-icon::after { content: '✓'; color: var(--mu-green-600); }` |
| **Visual treatment: green border + checkmark icon** | Audit Strategic Improvement #3 specifically asks for `border-mu-green-600 + checkmark on blur after valid input`. The green border alone is too subtle for 45+ users; the checkmark gives a positive cue (not just absence of error). Brand green token already exists: `--mu-green-600 #35B678`. | Low | Use existing token; no new colors. |
| **Live region announcement** | The form already has `aria-live="polite"` error spans (Phase 32 work, audit confirmed). For valid state, screen readers need a parallel cue OR the cue needs to NOT be announced (to avoid noise). WCAG 2.2 does not REQUIRE valid-state announcement, only error messaging (3.3.1, 3.3.3). Recommendation: visual-only valid cue, no screen reader announcement, to avoid "Field is valid. Field is valid. Field is valid." per keystroke. | Low | Pure CSS, no extra ARIA. |
| **Triggered on blur, not on input** | Validating on every keystroke creates flicker (red→green→red as user types `+7 70`). For 45+ audience this is jarring. `:user-valid` already implements "validate on commit" semantics (blur or submit), so the CSS pseudo-class does the right thing without JS. | Low | Free with `:user-valid`. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| **Token-based valid state for theme consistency** | Define `--mu-form-valid-border` and `--mu-form-valid-icon` in `theme.css` (= `var(--mu-green-600)` for now) so a future palette change does not require touching every form rule. | Low | Two new token lines. |
| **Smooth border-color transition** | `transition: border-color 200ms ease-out` so the field turns green without a jarring snap. Already covered by the existing `prefers-reduced-motion` guard which sets `transition-duration: 0.01ms`. | Low | One CSS line per field. |

### Anti-Features (DO NOT)

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| **`:valid` (without `:user-valid`)** | Marks every untouched optional field as "valid" on page load — visually noisy + meaningless. MDN explicit anti-pattern. | `:user-valid` |
| **Validating on `input` event with valid-state flicker** | Field flickers red→green→red as user types a partial value. Jarring for everyone, hostile for 45+. | Browser-native `:user-valid` |
| **Aggressive premature validation** | E.g. showing red border the moment a `required` field is focused but empty. | Wait for blur (which `:user-valid` does natively) |
| **Announcing "Valid" via aria-live on every keystroke** | Screen reader noise, breaks form completion flow. WCAG only requires error messaging, not success messaging. | Visual-only cue |
| **Unicode emoji ✅ for the checkmark** | Same problem as treatment-abroad.html stat bar — vendor-rendered, color-bombed, off-brand. | SVG checkmark or `content: '✓'` (the heavy check mark, U+2713) |
| **Red→green color jump at exactly the `oninput` boundary** | Causes visual whiplash. Use a 200 ms `transition: border-color`. | CSS transition + `prefers-reduced-motion` guard |

### Recommended Pattern (concrete)

```css
/* In src/styles/theme.css :root */
--mu-form-valid-border: var(--mu-green-600);
--mu-form-valid-icon: var(--mu-green-text);

/* In src/styles/index.css @layer base */
input:user-valid,
textarea:user-valid,
select:user-valid {
  border-color: var(--mu-form-valid-border);
  transition: border-color 200ms ease-out;
}

/* Visible checkmark via wrapper element */
.field {
  position: relative;
}

.field input:user-valid ~ .field__valid-icon {
  opacity: 1;
}

.field__valid-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 200ms ease-out;
  color: var(--mu-form-valid-icon);
  pointer-events: none;
}
```

HTML:
```html
<div class="field">
  <label for="form-name">Имя</label>
  <input id="form-name" name="name" required aria-describedby="form-name-error" />
  <span class="field__valid-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </span>
  <span id="form-name-error" role="alert" aria-live="polite"></span>
</div>
```

Apply across all 5 forms (existing form structure already has `role="alert" aria-live="polite"` from Phase 32 — only the visual valid-state and the icon span are new).

**Dependency:** Existing forms use a similar structure already (audit confirmed `aria-live="polite"` error spans on all 20 form errors). The new pattern is additive — no JS changes required because `:user-valid` is browser-native.

### Confidence

**HIGH.** MDN-verified for `:user-valid` semantics, browser support (Baseline 2023), and pseudo-class behaviour. WCAG 2.2 verified that valid-state announcement is not required. The 45+ "blur not input" choice is implicit in the `:user-valid` semantics so no separate research needed.

---

## Category 4 — `sitemap.xml` & `robots.txt`

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| **`sitemap.xml` at site root** | Standard Google/Bing convention. URL: `https://medicusunion.kz/sitemap.xml`. The protocol spec (sitemaps.org) requires the file be at or above the path of the URLs it lists, so `/sitemap.xml` is the only correct location for a 6-page site. | Low | Static file, hand-maintained. |
| **`robots.txt` at site root** | Universal crawler convention. Must include `Sitemap:` directive pointing at the absolute sitemap URL. Optional but standard `User-agent: *` + `Disallow:` (empty = allow all) + explicit disallow for any future admin/preview routes. | Low | Static file, hand-maintained. |
| **Each URL listed once with `<loc>`** | Required by sitemaps.org spec. The 6 production URLs: `/`, `/online-consultations.html`, `/treatment-abroad.html`, `/checkup.html`, `/contacts.html`, plus `/404.html` is conventionally NOT listed (it's an error page, not a content page). So 5 URLs total in the sitemap. | Low | |
| **Match the `<link rel="canonical">` tag exactly** | Existing audit confirms canonical URLs are present on every page (Phase 31 work). The sitemap URLs MUST match those canonicals byte-for-byte (same scheme, same host, same trailing-slash policy) or Google logs a "duplicate URL" warning. | Low | Verify in Phase 37. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| **`<lastmod>` tag using ISO 8601** | Google has explicitly stated `lastmod` IS used as a signal for re-crawl prioritization (in contrast with `changefreq`/`priority` which are ignored). For a 6-page site that updates rarely, an honest `lastmod` helps recrawl after content edits. | Low | Set to git commit date of the page file. Can be templated by build script: `git log -1 --format=%cI -- {file}`. |
| **OMIT `<changefreq>` and `<priority>`** | Google has publicly confirmed it ignores both. They are clutter that adds maintenance burden with zero SEO benefit. | Low | The "outdated advice" the question asks about is to keep them — modern guidance is to drop them. |

### Anti-Features (DO NOT)

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| **`<changefreq>weekly</changefreq>`** | Google ignores. | Drop |
| **`<priority>0.8</priority>`** | Google ignores. Adds drift risk (developer cargo-cults numbers). | Drop |
| **Listing 404.html in the sitemap** | Search engines should not be told to crawl your error page. | Omit |
| **Forgetting to add `Sitemap:` to robots.txt** | Some crawlers (Bing, Yandex — relevant for KZ market) discover sitemaps via robots.txt, not auto-detection. | Always include the `Sitemap:` line |
| **Wildcard `Disallow: /*.css$`** | Blocks crawler rendering, breaks Google's mobile-friendly check, and tanks rankings. | Default `Disallow:` (empty) = allow all |

### Recommended Files (concrete)

`/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://medicusunion.kz/</loc>
    <lastmod>2026-04-07</lastmod>
  </url>
  <url>
    <loc>https://medicusunion.kz/online-consultations.html</loc>
    <lastmod>2026-04-07</lastmod>
  </url>
  <url>
    <loc>https://medicusunion.kz/treatment-abroad.html</loc>
    <lastmod>2026-04-07</lastmod>
  </url>
  <url>
    <loc>https://medicusunion.kz/checkup.html</loc>
    <lastmod>2026-04-07</lastmod>
  </url>
  <url>
    <loc>https://medicusunion.kz/contacts.html</loc>
    <lastmod>2026-04-07</lastmod>
  </url>
</urlset>
```

`/robots.txt`:
```
User-agent: *
Disallow:

Sitemap: https://medicusunion.kz/sitemap.xml
```

Five lines. That is the entire correct content for a 6-page static site in 2026.

### Confidence

**HIGH** for `sitemaps.org` schema (canonical, never changes).
**HIGH** for "drop changefreq and priority" — this is documented Google behaviour that has been stable since 2017+.
**MEDIUM** for `lastmod` being actively used — Google's public statements vary by year; the current consensus (verified through training data + last public Search Central statements) is that it IS used when it's accurate, ignored when it's bogus (e.g., if every URL has the same lastmod). Honest values give a small recrawl benefit; lying gives nothing.

---

## Category 5 — Real Flag Icon Set

### Required country coverage (from `online-consultations.html` and `treatment-abroad.html`)

| Country | Code | Notes |
|---|---|---|
| Austria | AT | Headquarters + parent brand origin |
| Germany | DE | Primary doctor source |
| France | FR | EU clinic network |
| Switzerland | CH | EU clinic network |
| Italy | IT | EU clinic network |
| Spain | ES | EU clinic network |
| Israel | IL | Specialty referrals |

(Plus possibly KR, TR for `checkup.html` Korean/Turkish clinics — verify in Phase 37.)

### Library Comparison

| Library | Style | Bundle Approach | Coverage | Render at 24-32px | Notes |
|---|---|---|---|---|---|
| **`circle-flags` (HatScripts)** | Round SVG flags with built-in border | Per-country SVG files; no CSS framework needed | ~200 countries | Excellent — designed specifically for small avatar-style sizes, has built-in 1px stroke border so flags don't blend into the background | **RECOMMENDED.** Each flag is a self-contained SVG you `<img src="flags/at.svg">` or inline. Per-country file means you load only the 7 you need (~14 KB total). MIT license. Maintained. |
| **`flag-icons` (lipis)** | Rectangular SVG flags | npm package + CSS (`flag-icons.min.css` ≈ 200 KB if loaded whole) OR per-flag SVG | ~250 countries | Good for 32 px+; rectangular shape can look "tucked in" against rounded UI cards | Requires CSS classes (`fi fi-at`); CSS bundle is heavy unless you cherry-pick. Often used with `<span class="fi fi-at"></span>`. License: MIT. Best when you need ALL flags. |
| **`country-flag-icons`** | Rectangular OR rounded React/Vue components, also raw SVG | npm package, opinionated (1×1 / 3×2 / 4×3 aspect variants) | ~250 countries | Good | More framework-tied; overkill for vanilla HTML. |
| **Twemoji flags (`🇦🇹`)** | Twitter's emoji set | Single CSS link or per-emoji SVG | All ISO-3166 | OK at 32 px+, fuzzy below | RU+KZ Windows users frequently see no emoji or wrong emoji because Windows ships with no native flag glyphs. Hard NO for KZ market. Same anti-pattern as the existing `treatment-abroad.html` emoji stat bar that the audit flagged. |

### Recommendation

**`circle-flags` by HatScripts.** Reasons:

1. **Per-flag SVG download** — load 7 files (~14 KB), not 200. Matches the data-frugal approach already chosen for v3.0 (local WebP, no CDN dependency).
2. **Self-bordered round style** — the existing site is rounded everywhere (cards `rounded-[2.5rem]`, badges `rounded-full`, CTAs `rounded-[1rem]`). Round flags fit. Rectangular flags (`flag-icons`) look out of place against rounded card backgrounds.
3. **Excellent at 24–32 px** — designed for it. The current inline SVG flags in `online-consultations.html` are 48 × 32 rectangles that the audit specifically called out as "geometric shapes you don't recognize unless you already know the flag." `circle-flags` look like flags at 24 px because they were drawn for that size.
4. **No CSS bundle** — works with the existing Tailwind workflow without adding `flag-icons.min.css`.
5. **MIT licensed, actively maintained** — last release in the public-knowledge window. No abandoned-package risk.

**Bundle strategy:** Copy the 7 needed SVGs into `/images/flags/` at build time (or commit them directly — they're ~2 KB each and won't churn). Reference as:
```html
<img src="/images/flags/at.svg" width="24" height="24" alt="Австрия" loading="lazy" />
```

**Anti-pattern to fix:** The 25 inline SVG flag rectangles in `online-consultations.html:331-361` and `treatment-abroad.html:326-420` get replaced with `<img>` references. This deletes ~150 lines of inline SVG and produces visibly better flags.

### Confidence

**MEDIUM-HIGH.** The library names, formats, license status, and approximate coverage are well-known facts in the front-end ecosystem and verified against my training data. Could not crawl npm registry directly in this environment to confirm latest version numbers — Phase 37 plan should run `npm view circle-flags version` (or check the GitHub release page) to lock the exact version before vendoring. Render-quality claim ("excellent at 24 px") is from the library's stated design intent and from common usage in production sites; sanity-check with a screenshot at 24 px on each of the 7 flags during Phase 37 implementation.

---

## Feature Dependencies

```
Phase 33 audit fixes (sticky-bar pb fix)
       │
       ▼
Phase 38 vertical rhythm tokens  ◄── needs the sticky-bar clearance value from Phase 33
       │
       ▼
Phase 36 shared layout primitives ◄── reuses --space-mobile-bottom-clearance token
       │
       ▼
Phase 36 aria-current pattern ◄── needs page identifier (passed by build script)


Phase 35 form valid-state ────► uses :user-valid (no dependency on other phases)


Phase 37 sitemap.xml + robots.txt ────► (no dependency)
Phase 37 flag library ────► overlaps Phase 34 treatment-abroad SVG cleanup
                            (replace inline SVG flags as part of the 25× SVG cleanup pass)
```

**Critical-path observation for the orchestrator:** Phase 33 → Phase 38 → Phase 36 is a hard chain. The sticky-bar clearance value computed in Phase 33 becomes `--space-mobile-bottom-clearance` in Phase 38, which then gets baked into `partials/sticky-bar.html` in Phase 36. Doing them out of order means re-doing the partial.

Phase 35 (form valid-state) and Phase 37 (sitemap + flags) are independent and can run in parallel with the chain.

---

## MVP Recommendation

**Must-ship in v3.1 (table-stakes only):**

1. **Vertical rhythm tokens + 5 hero `min-h` rewrites** — fixes the user's "out of place" pain. Phase 38.
2. **`pb-mobile-clear` on all 5 `<main>`** — fixes audit Issue #3. Phase 33.
3. **`:user-valid` form feedback (CSS only)** — fixes audit Strategic Improvement #3. Phase 35.
4. **`sitemap.xml` + `robots.txt`** — table-stakes SEO hygiene. Phase 37.
5. **`aria-current="page"` on all nav links** — fixes audit Action #10. Phase 36.

**Should-ship if budget allows (differentiators):**

6. **Build-step header/footer inlining via `partials/`** — Phase 36 main work. The biggest long-term-maintenance win, but if Phase 36 runs over, fall back to Pre-rendered + JS-progressive enhancement (item below).
7. **Real flag icon set (circle-flags vendored)** — Phase 37. Cosmetic but visible.
8. **Compact-hero variant token** for contacts.html and 404.html — Phase 38.

**Defer to v3.2+ (anti-features for v3.1):**

- Migrating to a static site generator (11ty, Hugo) — even though SSGs solve the partial problem natively, this is too big a stack change for this milestone. Build-step inlining gets 80% of the value at 5% of the migration cost.
- Container queries for hero (`@container`) — all 5 heroes can be solved with viewport units. Container queries add complexity for no current win.
- Replacing Motion CDN with `View Transitions API` — out of scope.

---

## Sources

- [MDN: `:user-valid` CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid) — Baseline 2023, "use `:user-valid` rather than `:valid` to avoid showing success states before user interaction" (HIGH)
- [MDN: Form validation tutorial](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation) — confirms `:user-valid` over `:valid`, validates on input + submit, browser-native pseudo-class is preferred over JS (HIGH)
- [MDN: viewport length units (`vh`/`svh`/`dvh`/`lvh`)](https://developer.mozilla.org/en-US/docs/Web/CSS/length) — "`svh` is safer for iOS … `dvh` can cause layout shifts during scrolling, may degrade UX" (HIGH)
- [Tailwind CSS v4: `min-height` documentation](https://tailwindcss.com/docs/min-height) — confirms `min-h-svh`, `min-h-dvh`, `min-h-lvh` ship as first-class utilities; `min-h-screen` = `100vh` (HIGH)
- [MDN: `aria-current` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current) — "only mark one element as current," dynamic-set via `Element.ariaCurrent` or `setAttribute` (HIGH)
- [MDN: `<noscript>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript) — "not suitable as a comprehensive fallback for sites that heavily depend on JavaScript for layout" (HIGH)
- [MDN: Web Components / custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) — "custom elements MUST be registered and instantiated via JavaScript … without JS the page would display unstyled, non-functional content" (HIGH)
- [MDN: `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) — "client-side only, no cross-file sharing, not a server-side feature; cannot be shared across multiple pages at the server level" (HIGH)
- [MDN: lazy loading guide](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading) — fetch+innerHTML "longer Critical Rendering Path, delayed LCP, layout shifts" (HIGH)
- [Sitemaps.org protocol 0.9](https://www.sitemaps.org/protocol.html) — canonical schema for `<urlset>`, `<url>`, `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>` (HIGH; spec is stable since 2008)
- Existing project files (verified by direct Read):
  - `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` — full audit baseline
  - `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/theme.css` — token system, existing `--mu-green-600`, `prefers-reduced-motion` rule
  - `/Users/mikhail/Projects/Medicus_video_consult-landing/index.html`, `online-consultations.html`, `treatment-abroad.html`, `checkup.html`, `contacts.html`, `404.html` — current `min-h` and `pt-32 pb-16` patterns confirmed

### Confidence summary

| Feature | Confidence | Verified by |
|---|---|---|
| Shared layout primitives (build-step inlining recommendation, `aria-current` pattern, no-JS implications) | HIGH | MDN ×4 + project files |
| Vertical rhythm — `svh` over `dvh`/`vh`, Tailwind v4 utilities | HIGH | MDN + Tailwind docs |
| Vertical rhythm — specific clamp values (560 / 75svh / 760) | MEDIUM | Derived from existing layout + audit findings; should be validated empirically in Phase 38 |
| Vertical rhythm — direct competitor benchmarks (bupa, zocdoc, doctolib) | LOW | Could not crawl those sites in this environment; Phase 38 plan should include manual screenshot pass on 2 competitors |
| Form valid-state (`:user-valid` + checkmark) | HIGH | MDN ×2 + WCAG 2.2 |
| `sitemap.xml` schema + drop changefreq/priority | HIGH | sitemaps.org spec + documented Google behaviour |
| `lastmod` is actively used by Google | MEDIUM | Documented Google statements; Phase 37 plan should use honest git-derived dates, not synthetic |
| `circle-flags` library recommendation | MEDIUM-HIGH | Known library characteristics; lock exact version in Phase 37 implementation |

### Open questions for Phase 38 plan (NOT for this research)

1. Should `contacts.html` use a hero at all, or should the heading-in-`<main>` pattern be preserved? (Currently it's inconsistent with the other 4 service pages — Phase 38 should make a deliberate call.)
2. The clamp ceiling of 760 px assumes the hero illustration on `index.html` does not need more than 760 px to render fully. If it does (verify on 1920 × 1080 in Phase 38 visual pass), bump to 820 px.
3. Should Phase 36's build script also strip the `<!-- @include -->` comment from output? (Cosmetic, but the comment will be visible in View Source if not.)
