# Technology Stack — v4.0 Liquid Design System

**Project:** MedicusUnion KZ (existing multi-page landing — v4.0 milestone)
**Researched:** 2026-04-09
**Scope:** Stack additions ONLY for (1) responsive 12/8/2-3 grid, (2) universal squircle shapes, (3) Apple Liquid Design materials. Existing stack (Tailwind v4.2.2 standalone CLI, vanilla ES6+ IIFE JS, Motion 12.x CDN, Directus backend, SF Pro system fonts) is LOCKED — not re-researched.
**Overall confidence:** HIGH on architectural choices, MEDIUM on specific CSS patterns (experimental specs), LOW only on cosmetic fidelity vs. native Apple implementation (known gap).

---

## Executive Summary

The v4.0 goals are achievable **with zero new Node.js runtime dependencies** and **zero new build tools**. The existing `tailwindcss` standalone binary + `make build` + POSIX-sh partial splicer pipeline is sufficient.

**The three canonical choices:**

1. **Squircles** — `mask-image` with inline SVG data-URI generated per-radius, plus a hand-authored `corner-shape: superellipse(2)` progressive-enhancement layer for Chrome 139+. **No JS library, no Houdini paint worklet, no build-time preprocessor.** (figma-squircle and squircle.js are explicitly rejected — see section A.)
2. **Liquid Glass** — multi-layer CSS: `backdrop-filter: blur() saturate() brightness()` (the cross-browser core), inline `<svg>` `feTurbulence + feDisplacementMap` wrapped in `@supports (backdrop-filter: url(#x))` for Chrome/Edge only, specular highlights via layered `linear-gradient` + `radial-gradient` + `::before/::after` pseudo-elements, edge lighting via `inset 0 1px 1px rgba(255,255,255,...)` (already in theme.css as `--shadow-glass-*`). **No WebGL, no Houdini.**
3. **Grid** — pure Tailwind v4 utilities: `grid-cols-2 md:grid-cols-8 lg:grid-cols-12` with a new `--container-max-content` token and `container max-w-[1200px]` pattern. Tailwind v4 generates arbitrary column counts out of the box — **no config extension needed, no custom classes, no plugins.**

**What NOT to add (hard anti-recommendations):**
- `figma-squircle`, `@squircle-js/react`, `corner-smoothing` npm packages — all require `npm install` which breaks zero-Node constraint, and all would need ResizeObserver runtime overhead for responsive recalculation.
- `smooth-corners` Houdini paint worklet — Chromium-only (Safari zero support, Firefox zero support), disabled on `<a>` elements with `href`, and would ship a partial solution for Apple's own users (most relevant to project aesthetic).
- Alpine.js, htmx, Stimulus, Lit — tempting for reactive Liquid components but violates zero-framework policy and not needed (Motion 12.x + vanilla JS covers all reactivity needs).
- PostCSS, `@tailwindcss/container-queries` plugin, `@tailwindcss/forms`, `@tailwindcss/typography` — Tailwind v4 ships container queries and all needed utilities natively.
- SF Pro Expanded / Compact / Rounded self-hosted WOFF2 — not shipped by Apple for web use, EULA-restricted for Apple platforms. Stay on the system stack.
- Motion version upgrade to 12.37+ unless needed — 12.x CDN works and the new features (ViewTimeline, hardware-accelerated scroll offsets) are nice-to-have, not blockers.

---

## Recommended Stack Additions

### A. Squircle Implementation (highest-risk area — CSS primitive gap in 2026)

**Recommended technique:** **SVG `mask-image` data-URI** as the production default, with `corner-shape: superellipse(2)` as a progressive-enhancement layer via `@supports`.

**Why not corner-shape alone:**

The CSS `corner-shape` property landed in **Chrome 139 and Edge 139 in August 2025** and is still marked "Limited availability / Experimental" on MDN as of April 2026. **Safari and Firefox have zero support and no public implementation timelines.** For a product targeting macOS/iOS users (the single most relevant audience for Apple's own design language), shipping a Chrome-only primitive is unacceptable. It is, however, perfectly suitable as progressive enhancement — it degrades gracefully to `border-radius` in unsupported browsers.

**Why not figma-squircle / squircle.js / Houdini smooth-corners:**

| Library | Fatal issue for this project |
|---------|-------------------------------|
| `figma-squircle` (npm) | Requires `npm install`. Breaks zero-Node. ~26KB package. Needs ResizeObserver runtime for responsive elements. Authored in TypeScript — no precompiled UMD for script-tag use without a bundler |
| `squircle.js` | React-only wrapper over figma-squircle. Same Node constraint, plus pulls in React |
| `@squircle-js/react`, `@squircle/js` | React-only, Node-only |
| `smooth-corners` (Houdini) | Chromium-only (no Safari, no Firefox). Paint worklet disabled on `<a href>` elements for privacy. Would underserve Apple-device users on the project's own aesthetic target |
| `sanalabs/corner-smoothing` | Ships as React component. Node-dependent. Abandoned (last commit 2022) |

**The math (so nothing is mystery):**

Apple's squircle corresponds to the superellipse formula `|x/a|^n + |y/b|^n = 1` with **n ≈ 5** in the classical Lamé curve sense (Apple's actual value; used by iOS app icons). The CSS `corner-shape: superellipse(<k>)` specification uses a different parametrization where `k` is a signed curvature index — `superellipse(1)` = regular round corner, `superellipse(2)` = squircle (Apple-like), `superellipse(infinity)` = square, `superellipse(0)` = bevel. **Recommended token value: `superellipse(2)`**. For non-CSS techniques (SVG path generation), you want the figma-squircle "smoothing=0.6" equivalent, which maps to the Apple default.

**The production pattern — SVG `mask-image` data-URI:**

For each unique (width, height, corner-radius) combination used in the project, hand-author an SVG squircle path and inline it as a CSS `mask-image` data-URI. Because the project has a tokenized radius scale (not arbitrary per-element radii), the number of unique shapes is **bounded and small** — maybe 8 distinct radius tokens × a few aspect ratio buckets.

Working pattern (pseudocode, to be finalized in planning):

```css
/* In src/styles/theme.css under @theme inline or :root */
:root {
  /* Squircle radius scale (replaces --radius-sm/md/lg/xl) */
  --squircle-sm: 8px;   /* inputs, badges */
  --squircle-md: 16px;  /* buttons, icon-buttons */
  --squircle-lg: 24px;  /* cards */
  --squircle-xl: 40px;  /* hero containers, mobile-menu */
  --squircle-full: 9999px; /* pills, avatars */

  /* Pre-authored mask data-URIs (generated once by hand, committed to repo) */
  --squircle-mask-md: url("data:image/svg+xml;utf8,<svg ... superellipse path ...>");
}

.squircle-md {
  border-radius: var(--squircle-md); /* fallback for browsers without mask-image */
  -webkit-mask-image: var(--squircle-mask-md);
          mask-image: var(--squircle-mask-md);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

/* Progressive enhancement for Chrome 139+ */
@supports (corner-shape: superellipse(2)) {
  .squircle-md {
    -webkit-mask-image: none;
            mask-image: none;
    corner-shape: superellipse(2);
  }
}
```

**Known trade-offs of `mask-image`:**

1. **Box-shadows, borders, and outlines are clipped by the mask.** This is the #1 reason mask-image "looks wrong" in naive implementations. Workaround: move shadows to a **wrapper element** that is NOT masked, and apply the mask only to the inner surface. This is called the "shadow-wrap pattern." Form container, cards, and buttons all need this. Hero glass panels likewise — shadow on outer, mask on inner. **Document this as a project convention in PITFALLS.md.**
2. **Focus-visible rings are clipped.** The project's `box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)` focus ring (in `theme.css` `:focus-visible`) will be clipped by the mask. Fix: switch focus rings to `outline: 2px solid var(--mu-blue-text); outline-offset: 4px` which is not clipped by `mask-image`. **Accessibility-critical — must be verified in Phase.**
3. **SVG paths are hand-authored per unique (w,h) pair OR generated at runtime once.** For a small radius scale this is fine. For fully dynamic sizing (which the project does NOT need — all elements are token-sized), you would need a JS runtime helper. Not required for this milestone.
4. **Responsive squircles.** When an element's width changes at a breakpoint (e.g., a card is 320px on mobile, 400px on desktop), the mask SVG's absolute path coordinates do not scale perfectly unless authored with `preserveAspectRatio="none"` and scaled via `mask-size`. This works for nearly all cases; the only visible artifact is at extreme aspect ratios (very thin tall cards), which this project does not use.

**Graceful degradation chain:**

```
Tier 1 (Chrome 139+):  corner-shape: superellipse(2) on border-radius — native, GPU-accelerated, perfect
Tier 2 (Safari 17+, Firefox 120+, Chrome <139, Edge <139): mask-image with SVG data-URI — production default
Tier 3 (any browser without mask-image support — Safari <3.1, IE):  border-radius rounded corner fallback
```

**Zero-Node check:** No. `mask-image` + inline SVG data-URIs require **zero tooling**. Hand-authored SVG paths are committed to `src/styles/theme.css` or a dedicated `src/styles/squircles.css` file. Tailwind CLI standalone binary compiles everything unchanged.

**Perf cost estimate:**
- `mask-image` with a static inline SVG data-URI is essentially free on modern GPUs — it's applied as a compositor pass on the element's layer. Similar cost to `border-radius` with `overflow: hidden`.
- Unlike `backdrop-filter`, there is no per-frame recomposition of background content.
- `corner-shape` (Chrome 139+) is also GPU-accelerated and does not have mask clipping side-effects — which is why it's the preferred progressive-enhancement layer when available.
- **Rough budget:** for 50+ squircle elements on a single viewport, no measurable jank on a mid-tier Android from 2022. The real perf cost is in the Liquid Glass layer (section B), not in the squircle layer.

**Integration points:**
- `src/styles/theme.css` — add `--squircle-*` token scale in `:root` and corresponding `@theme inline` entries so Tailwind generates utilities.
- `src/styles/squircles.css` (new file) — house the raw SVG data-URI mask definitions and the `@supports` progressive enhancement block. Imported into `src/styles/index.css` or directly into `src/styles/tailwind.css`.
- **Partials (`partials/header.html`, `footer.html`, `mobile-menu.html`, `sticky-bar.html`)** — replace `rounded-[2.5rem]`, `rounded-full`, `rounded-xl`, etc. with `squircle-xl`, `squircle-full`, `squircle-md` utility classes. Pre-commit byte-identity hook will enforce downstream propagation to all 6 generated pages.
- **Focus-visible rule in `theme.css` @layer base** — switch from `box-shadow` rings to `outline + outline-offset` (see Trade-off 2 above).

**What downstream executor needs:**
A list of the exact (radius-token, typical-width, typical-height) combinations used across all 6 pages so SVG paths can be pre-generated. This is a Phase scope item — expect ~8 radius tokens × 3 aspect-ratio buckets = ~24 pre-authored SVG strings.

---

### B. Apple Liquid Glass CSS

**Recommended approach:** **Multi-layer CSS composition** using the existing `backdrop-filter` primitives (already in use, already in theme.css as `--shadow-glass-*`) + inline `<svg>` filters for Chrome-only refraction + layered gradient pseudo-elements for specular highlights.

**Hard reality check:** Apple's *actual* Liquid Glass — as shipped in iOS 26 / macOS Tahoe 26 and documented at `developer.apple.com/documentation/TechnologyOverviews/liquid-glass` — uses native Metal shaders, real-time ray-traced refraction of the content behind the glass surface, specular highlights driven by the device orientation / pointer position, and adaptive contrast sensing from surrounding content. **None of this is achievable in CSS.** Our job is not to clone iOS. Our job is to deliver a web-native **interpretation** that feels of-a-piece with iOS 26 without pretending to be a shader.

The GOOD news: **~80% of the visual impression** can be achieved with CSS primitives that are already Baseline in 2026. The 20% gap is dynamic refraction (needs `backdrop-filter: url(#svgfilter)` — Chrome-only in 2026 per the LogRocket and kube.io research) and true specular physics (impossible in CSS).

#### Layer-by-layer breakdown

**Layer 1: Blur + saturation (the "glass" base)** — **Baseline, all browsers 2026.**

```css
.liquid-glass-regular {
  backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
  background: rgba(255, 255, 255, 0.55);
}
```

This is what the existing `partials/header.html` already uses (`backdrop-blur-[40px] backdrop-saturate-[150%] bg-white/30`). v4.0 extends this with **material tokens** matching Apple's taxonomy:

| Token | CSS | Use |
|-------|-----|-----|
| `--glass-ultrathin` | `backdrop-filter: blur(20px) saturate(180%) brightness(1.08); bg: rgba(255,255,255,0.4)` | Nav pills, overlays on content |
| `--glass-thin` | `backdrop-filter: blur(30px) saturate(180%); bg: rgba(255,255,255,0.5)` | Mobile menu, modals |
| `--glass-regular` | `backdrop-filter: blur(40px) saturate(180%) brightness(1.05); bg: rgba(255,255,255,0.55)` | Header, form container (default) |
| `--glass-thick` | `backdrop-filter: blur(60px) saturate(180%) brightness(1.08); bg: rgba(255,255,255,0.7)` | Hero glass panels, card surfaces |
| `--glass-chrome` | `backdrop-filter: blur(80px) saturate(200%) brightness(1.1); bg: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))` | Sticky elements, elevated surfaces needing highest legibility |

Ship these as `@theme inline` custom properties in `src/styles/theme.css`, generating Tailwind utilities (`bg-glass-regular`, `bg-glass-thick`, etc.).

**Layer 2: Edge lighting / inner stroke** — **Baseline, all browsers.**

Already present in theme.css as `--shadow-glass-inner`. v4.0 extends: **every glass surface** needs an inset top-highlight (`inset 0 1px 1px rgba(255,255,255,0.9)`) and a subtle inset bottom-shadow (`inset 0 -1px 1px rgba(0,0,0,0.05)`) to simulate the refraction bevel.

The existing `--shadow-glass-header` token (`inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1px 1px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.05)`) is the exact pattern — apply it universally.

**Layer 3: Specular highlights** — **Baseline via layered gradients / `::before` pseudo.**

The iOS 26 "shimmer" where light appears to cross the glass surface is faked via a `::before` pseudo-element with:

```css
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.6) 0%,
    rgba(255,255,255,0.0) 40%,
    rgba(255,255,255,0.0) 60%,
    rgba(255,255,255,0.3) 100%
  );
  mix-blend-mode: overlay; /* or 'plus-lighter' if supported */
  pointer-events: none;
  /* Masked to squircle shape — see section A */
}
```

For hover/tap interaction, the specular gradient can **animate via Motion 12.x** (`Motion.animate(el, { '--specular-x': [0, 1] }, { duration: 0.6 })`) — this is what makes it feel "liquid." No JS math required; Motion handles the tween.

**Layer 4: Refraction (Chrome-only, progressive enhancement)** — **Not Baseline.**

For Chrome/Edge users, we can layer an inline `<svg>` filter using `feTurbulence + feDisplacementMap` and reference it via `backdrop-filter: url(#liquid-refract)`:

```html
<svg width="0" height="0" style="position:absolute">
  <filter id="liquid-refract">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```

```css
@supports (backdrop-filter: url(#liquid-refract)) {
  /* Feature-detect AND brand-check via @supports selector — actually Chrome-only via runtime probe */
  .liquid-glass-thick[data-refract="true"] {
    backdrop-filter: url(#liquid-refract) blur(40px) saturate(180%);
  }
}
```

**Hard truth:** per the MDN bug tracker (WebKit bug 245510) and LogRocket research, **Safari and Firefox do not support `backdrop-filter: url(#svg-filter)` in 2026**. The `@supports` query above will not correctly gate Safari's fallback — use a small JS runtime probe in the existing vanilla JS file to set a `data-refract="true"` attribute on `<html>` if the browser is Chromium-based. **Kept as opt-in progressive enhancement, not a default.** Apple-device users (on Safari) get the blur-only look, which is what they get on iOS 25 and below anyway.

**Layer 5: Dark mode** — **`light-dark()` is Baseline since May 2024, widely available.**

The project already has `[data-theme="dark"]` attribute-based dark mode. v4.0 can additionally use `light-dark()` for new glass tokens:

```css
:root { color-scheme: light dark; }

.liquid-glass-thick {
  background: light-dark(
    rgba(255,255,255,0.7),
    rgba(20,24,32,0.6)
  );
}
```

Note: the existing v1.4 decision was **"dark mode disables backdrop-filter (glass-off) because of murky smear on navy #0F1923."** v4.0 supersedes this along with the GPU budget constraint — re-enable backdrop-filter in dark mode but **tune** the dark-mode tokens so the blur is subtler (e.g., `blur(30px)` instead of `blur(40px)`), and crank saturation higher to preserve color identity in the smear. **Phase-specific experimentation required — flag for PITFALLS.**

**Layer 6: Motion-driven liveliness** — Motion 12.x (already installed).

The existing Motion CDN is sufficient. Use:
- `Motion.inView(el, callback, { margin: "-10%" })` for scroll-triggered liquid reveal
- `Motion.animate(el, { backdropFilter: ... }, { type: 'spring', stiffness: 150, damping: 20 })` for hover/tap spring feel
- `Motion.scroll(Motion.animate(el, { '--glass-blur': ['20px', '60px'] }))` for scroll-linked blur progression

No version bump needed. Motion 12.x is stable; 12.37 adds ViewTimeline and hardware-accelerated scroll offsets, both nice-to-have. If we do bump, it's a URL swap in the `<script>` tag — zero build impact.

#### Browser support summary (Liquid Glass capabilities in 2026)

| Feature | Chrome | Safari | Firefox | Status |
|---------|--------|--------|---------|--------|
| `backdrop-filter: blur() saturate() brightness()` | ✅ | ✅ | ✅ | Baseline, universal |
| `backdrop-filter: url(#svg-filter)` | ✅ | ❌ WebKit bug 245510 | ❌ | Chrome-only — opt-in PE |
| `filter: url(#svg-filter)` on element | ✅ | ✅ | ✅ | Baseline (but not backdrop) |
| `light-dark()` | ✅ | ✅ | ✅ | Baseline (since May 2024) |
| `color-mix()` | ✅ | ✅ (16.2+) | ✅ | Baseline |
| `mix-blend-mode: plus-lighter` | ✅ | ✅ | ⚠️ 117+ | Near-Baseline |
| `CSS.paintWorklet` (Houdini) | ✅ | ❌ | ❌ | Chromium-only — **reject** |
| `@scroll-timeline` / scroll-driven animations (CSS) | ✅ 115+ | ⚠️ 26 partial | ❌ | Use Motion instead |
| View Transitions API | ✅ | ✅ 18+ | ⚠️ experimental | Nice-to-have, not core |

**Integration points:**
- `src/styles/theme.css` — add `--glass-*` token scale (5 materials), extend `--shadow-glass-*` coverage to all 5 materials.
- `partials/header.html`, `partials/mobile-menu.html`, `partials/sticky-bar.html` — swap existing `backdrop-blur-[40px]` / `bg-white/30` patterns with new `bg-glass-regular` utility.
- New HTML: add a single hidden `<svg>` with all shared filter definitions to each page's `<body>` via a new `partials/svg-defs.html` partial, spliced in by the existing splicer. Reference IDs from CSS via `backdrop-filter: url(#...)`.
- New file `src/styles/liquid-glass.css` — material tokens, pseudo-element specular layers, `@supports` progressive-enhancement blocks. Imported into `src/styles/tailwind.css` @import chain.
- New JS runtime helper in `js/main.js` (~10 lines) — probe `CSS.supports('backdrop-filter', 'url(#test)')` AND check `userAgent` for Chrome/Edge, set `data-refract="true"` on `<html>`.

**Zero-Node check:** ✅ All techniques are pure CSS, inline SVG, and vanilla JS. No new dependencies. Tailwind standalone binary compiles everything.

**Perf cost estimate (v4.0-relaxed budget, for the record):**

| Element type | Typical cost per frame | Budget viewport estimate |
|--------------|------------------------|---------------------------|
| `backdrop-filter: blur(40px) saturate(180%)` on single element | ~1–2ms on mid-2020 Android | fine |
| Same, 5 elements in viewport | ~5–10ms | noticeable but tolerable (still hitting 60fps most of the time) |
| Same, 10+ elements in viewport (hero + card grid + sticky bar + modal) | 15–25ms | **frame drops on budget Android** — 30–45 FPS |
| `backdrop-filter: url(#svg-filter)` (refraction) | +3–5ms per element | Chrome-only, so desktop mostly |
| `mix-blend-mode: overlay` on specular pseudos | +0.5ms each | negligible |

**On a 2024+ iPhone:** everything is free. 120Hz ProMotion holds.
**On a 2020 Samsung Galaxy A (dominant budget Android in KZ):** index.html with 6–8 visible glass surfaces in the hero viewport will drop to ~40–50 FPS. Scrolling past the initial viewport recovers to 60.

This matches the v4.0 Key Decision ("budget Android gets worse experience — accepted trade-off"). The key mitigation is **`will-change: backdrop-filter` only on elements that will actually animate** (the header on scroll, form on hover), NOT on static glass cards — `will-change` creates compositor layers that multiply cost.

**Animation-based mitigation:** `@media (prefers-reduced-motion: reduce)` (already in theme.css) should additionally downgrade `--glass-*` tokens to simpler `blur(0)` solid backgrounds. This gives vestibular-sensitive users AND legacy-hardware users an escape hatch. **Add this to the Phase scope — it's almost free to implement and doubles as a perf fallback.**

---

### C. Tailwind v4 Grid Utilities for 12/8/2-3

**Current version:** Tailwind CSS v4.2.2 (already pinned in the project via `make install-tailwind`). Latest stable as of 2026-04-09. **No version bump required.** v4.2.2 is sufficient for everything in section C; v4.1 added mask-* utilities which are useful for squircle mask compositing but not required (inline mask-image data-URIs work without them).

**Key v4 facts relevant to this milestone:**
- **Arbitrary grid column counts are native** — `grid-cols-8` works out of the box with zero config extension, zero `tailwind.config.js` (v4 uses CSS-first config via `@theme inline` which the project already uses).
- **Container queries are native** — `@container/main`, `@md:grid-cols-8` syntax works without the old `@tailwindcss/container-queries` plugin.
- **Subgrid** is Baseline (97% global support as of early 2026) — Chrome 117+, Firefox 71+, Safari 16+. **Usable without fallback** for nested card layouts where child grids need to align to parent tracks.
- **3D transforms** (Tailwind v4) — `rotate-x-*`, `rotate-y-*`, `perspective-*`, `translate-z-*` all native. Not critical for v4.0 but available if we want liquid-feel card hover tilts later.

**The 12/8/2-3 responsive grid pattern:**

```html
<!-- Page-level or section-level grid container -->
<div class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-[1200px] mx-auto">
  <!-- Children specify column spans per breakpoint -->
  <article class="col-span-2 md:col-span-4 lg:col-span-6">Card 1</article>
  <article class="col-span-2 md:col-span-4 lg:col-span-6">Card 2</article>
  <article class="col-span-2 md:col-span-8 lg:col-span-12">Full-width block</article>
</div>
```

**Breakpoint mapping** (Tailwind v4 defaults — already in use via existing `md:`/`lg:` prefixes):
- mobile (default, < 768px): **2 cols** (3-col is also valid for denser mobile layouts per the user's "2-3 cols" spec — use `grid-cols-3` selectively for icon rows, metric bars, flag grids)
- tablet (`md:`, 768px–1023px): **8 cols** (user-fixed convention)
- desktop (`lg:`, 1024px–1279px) and larger: **12 cols**

**Container max-width:** the existing project uses `max-w-7xl` (1280px) in `partials/header.html` and `max-w-[1200px]` in existing content sections. v4.0 should **standardize on `max-w-[1200px]`** (the v1.3 decision already set 1200px as the project convention). Add a new token `--container-content: 1200px` in theme.css + `@theme inline` → gives us `max-w-content` utility.

**Gap scale mapping to squircles/glass:**
- Mobile gap: 16px (`gap-4`)
- Tablet gap: 24px (`gap-6`)
- Desktop gap: 32px (`gap-8`)

These align with the existing spacing tokens. No new gap tokens needed.

**Subgrid pattern for nested card layouts:**

```html
<!-- Outer 12-col grid -->
<div class="grid grid-cols-12 gap-8">
  <!-- A card that spans 8 cols and wants its own internal grid aligned to the parent -->
  <article class="col-span-12 lg:col-span-8 grid grid-cols-subgrid gap-inherit">
    <h3 class="col-span-full">Card title</h3>
    <div class="col-span-4">Metric 1</div>
    <div class="col-span-4">Metric 2</div>
  </article>
</div>
```

**Subgrid is Baseline and safe to use without fallback** as of 2026. This unlocks the "everything on the grid" requirement — nested content can snap to the outer track without arbitrary widths.

**Container queries pattern (for partials that appear in varying-width contexts):**

```html
<!-- Wrap a card or sticky-bar in a container -->
<div class="@container/card">
  <article class="flex @md:grid @md:grid-cols-8 gap-4">
    ...
  </article>
</div>
```

Useful for making the `partials/sticky-bar.html` or mobile menu responsive to their own container rather than the viewport. Tailwind v4 syntax: `@[name]/[container-name]` and `@md:` for container-query breakpoints. Already usable in the project with zero config.

**What NOT to add (grid anti-recommendations):**
- **Bootstrap Grid / Foundation.** Heavy, opinionated, Tailwind already covers this.
- **`@tailwindcss/container-queries` plugin.** Obsolete — native in v4.
- **Custom `tailwind.config.js`.** Not needed for an 8-col grid. Tailwind v4 generates `grid-cols-8` and any arbitrary value (`grid-cols-[repeat(8,minmax(0,1fr))]`) natively.
- **CSS Grid "holy grail" layout libraries.** Pure overhead for a marketing site.

**Integration points:**
- `src/styles/theme.css` — add `--container-content: 1200px` token + `@theme inline --container-content` → generates `max-w-content`.
- **All 6 HTML pages** — wrap page content in `<main class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-content mx-auto">` (replacing current ad-hoc section wrappers).
- **Partials (`partials/header.html`, `footer.html`)** — already use `max-w-7xl` (1280px); audit and normalize to `max-w-content` (1200px) per project convention.
- **Pre-commit byte-identity hook** already handles partial→page propagation. No build-system changes.

**Zero-Node check:** ✅ Pure CSS utilities generated by Tailwind v4 standalone binary. No plugins, no config, no extensions.

**Perf cost:** CSS Grid is the cheapest layout primitive in the browser. Zero measurable overhead.

---

### D. Motion 12.x — What's Relevant for Liquid UI

**Current installed:** Motion 12.x (CDN). **Recommended:** stay on 12.x for this milestone; optionally bump to **12.37.0** if ViewTimeline + hardware-accelerated scroll offsets are useful for scroll-linked liquid morphs. Bump is zero-risk — CDN URL swap.

**Relevant APIs for v4.0:**

| Motion API | Use case |
|------------|----------|
| `Motion.animate(el, keyframes, options)` | Button specular highlight animation on hover (animate `--specular-x` custom property) |
| `Motion.inView(el, callback, { margin, amount })` | Trigger glass-morph reveal as sections enter viewport (replaces existing IntersectionObserver pattern — fewer lines) |
| `Motion.scroll(animateFn, { target, offset })` | Bind header blur intensity to scroll distance (existing header already has this on-scroll-blur pattern — Motion makes it declarative) |
| `Motion.animate(el, { ... }, { type: 'spring', stiffness, damping })` | Card hover lift with spring physics — use `type: 'spring'` with `stiffness: 150, damping: 20` for Apple-like feel |
| `Motion.hover(el, onStart, onEnd)` | Hover primitive that handles pointer enter/leave consistently |

**What we DON'T need:**
- Gesture API (`Motion.drag`, `whileDrag`) — not a touch app
- Layout animations (`Motion.layoutId`, `layoutAnchor`) — no shared-element transitions on a static landing
- View Transitions API (experimental in Motion) — not needed for this milestone; revisit if we add SPA-style navigation later

**Version bump decision:** **hold at 12.x (current)** unless the Phase implementation hits a specific blocker. Reasons:
1. Motion 12.x is production stable
2. 12.37.0 adds nothing we can't achieve with the current API
3. CDN version is cached in user browsers — bumping invalidates that cache
4. Zero-Node means no lockfile — version drift is a human discipline, not automated

**If we bump:** just update the `<script src="https://cdn.jsdelivr.net/npm/motion@12...">` URL in `partials/header.html` (or wherever the script tag lives). The byte-identity hook enforces propagation across all 6 pages.

**Zero-Node check:** ✅ Motion CDN = `<script>` tag = zero build tooling.

**Perf cost:** Motion 12.x uses the Web Animations API under the hood — ~15KB gzipped, GPU-accelerated tweens via native `Element.animate()`. Spring physics runs on JS main thread but at 60Hz uses <1ms per spring. Cheap.

---

### E. Fonts — SF Pro Stack Verification

**Current stack:**
```
--font-family-body: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-family-heading: 'SF Pro Rounded', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**iOS 26 / macOS Tahoe 26 findings:**
- **SF Pro Display and SF Pro Rounded remain the canonical system fonts** as of iOS 26. No replacement.
- **SF Pro Expanded** (internally "SF Wide") exists as a width variant alongside **SF Pro** (regular), **SF Pro Condensed**, and **SF Pro Compressed**. These are optical variants introduced in the SF family expansion (WWDC 2022, not iOS 26). **Not exposed via CSS `font-family` directly** — these are selectable in SwiftUI/UIKit via the `fontDesign` modifier, not via web CSS.
- iOS 26 introduced a **variable numeral font** for the Lock Screen timer with boxier regular-width numerals, similar to SF Compact. This is a SwiftUI feature, not exposed on the web.
- **There is no "SF Pro iOS 26" shipped for web use.** Apple does not ship SF Pro as a web font. The standard `-apple-system` / `BlinkMacSystemFont` fallback chain is still the canonical way to use SF Pro on the web, and it resolves to the current iOS 26 version automatically on Apple devices.

**Verdict:** **No changes to the current font stack.** The existing two `--font-family-*` tokens are canonical and current as of 2026-04-09.

**What NOT to add:**
- **Self-hosted SF Pro WOFF2** — violates Apple EULA (SF Pro is licensed only for use on Apple platforms or in Apple-native development contexts; the Apple Developer download at `developer.apple.com/fonts/` is specifically for iOS/macOS app design mockups, not for redistribution on the public web). **Legal risk, reject.**
- **Google Inter** — was used in pre-v2.0 project, removed in favor of SF Pro system stack for the reasons above. Don't re-introduce.
- **Manrope** — same, removed pre-v2.0.
- **`font-feature-settings` customizations** — Tailwind v4.2 added `font-features-*` utilities. Available if we want to enable specific OpenType features (small-caps, tabular numbers for metric displays), but not required for v4.0. Mentioned for completeness.

**Optional enhancement (not required):** add a `font-feature-settings: 'cv11' 1, 'ss01' 1` rule for specific numeric-heavy elements (e.g., phone number in header, statistics counters) to use the stylistic variants of SF Pro. These SF Pro feature tags are documented in Apple's SF Pro specimen PDF. Flag as a P3 enhancement — not core to the Liquid Design mandate.

**Zero-Node check:** ✅ System fonts require no download, no build tooling, no CSS changes.

---

### F. Zero-Node Constraint Check — Full Matrix

Every v4.0 addition, explicitly audited against the zero-Node runtime constraint.

| Addition | Requires Node at build? | Requires Node at runtime? | Notes |
|----------|-------------------------|---------------------------|-------|
| Squircle via `mask-image` data-URI | ❌ | ❌ | Hand-authored SVG paths committed to CSS file |
| Squircle via `corner-shape` (Chrome 139+) | ❌ | ❌ | Native CSS, progressive enhancement |
| Squircle via `figma-squircle` npm | ✅ BLOCKED | ✅ BLOCKED | **REJECTED** — violates constraint |
| Squircle via `smooth-corners` Houdini | ❌ | ❌ (CDN worklet) | **REJECTED** — Chromium-only, Safari/Firefox zero support |
| Liquid Glass `backdrop-filter: blur() saturate()` | ❌ | ❌ | Pure CSS, existing pattern |
| Liquid Glass `backdrop-filter: url(#svg-filter)` | ❌ | ❌ | Inline SVG in HTML, zero tooling. Chrome-only fallback gate via tiny JS probe |
| Specular highlights via `::before` + gradients | ❌ | ❌ | Pure CSS |
| `light-dark()` for dark mode glass | ❌ | ❌ | Native CSS, Baseline 2024 |
| Motion 12.x CDN (existing or 12.37 bump) | ❌ | ❌ | `<script>` tag |
| Tailwind v4.2.2 standalone binary (existing) | ❌ (binary, not Node) | ❌ | Already in pipeline |
| 12/8/2-3 grid via `grid-cols-*` utilities | ❌ | ❌ | Native Tailwind v4 |
| Subgrid in nested cards | ❌ | ❌ | Native CSS, Baseline |
| Container queries `@container` | ❌ | ❌ | Native Tailwind v4 |
| New `--glass-*`, `--squircle-*` tokens | ❌ | ❌ | CSS in theme.css |
| New `partials/svg-defs.html` for filter definitions | ❌ | ❌ | Splicer handles it via POSIX sh, existing pipeline |
| `outline` instead of `box-shadow` for focus ring | ❌ | ❌ | Pure CSS |
| JS refraction capability probe (~10 lines) | ❌ | ❌ | Vanilla ES5, inline in existing `js/main.js` |
| SF Pro system font stack | ❌ | ❌ | No change |
| New Tailwind v4.1+ `mask-*` utilities (optional) | ❌ | ❌ | Native |

**Overall:** ✅ **100% zero-Node compliant.** Not a single addition requires Node.js at build or runtime. The existing `make build` → `tailwindcss` standalone binary → POSIX-sh splicer pipeline is sufficient.

---

## Alternatives Considered (and explicitly rejected)

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Squircle | `mask-image` + inline SVG data-URI, progressive `corner-shape` | `figma-squircle` npm | Requires Node install; TypeScript source; needs bundler or runtime ResizeObserver for responsive mode. Node-free usage exists only with a CDN UMD build, which the package does not ship |
| Squircle | `mask-image` + data-URI | `smooth-corners` Houdini worklet | Chromium-only. Safari and Firefox have zero support and Apple's own users are on Safari. Would ship a broken experience to the project's target audience |
| Squircle | `mask-image` + data-URI | `clip-path` with SVG path | Valid alternative; slightly worse because `clip-path` also clips box-shadows AND requires element-relative coordinates per-size. `mask-image` with `mask-size: 100% 100%` scales automatically |
| Squircle | `mask-image` + `corner-shape` PE | SVG wrapper pattern (inline `<svg>` with `<path>` per element) | Works but pollutes HTML with one SVG per squircle element. `mask-image` keeps the SVG in CSS where it belongs |
| Liquid Glass | Multi-layer CSS + Chrome-only SVG filter PE | Pure WebGL liquid shader | Adds a WebGL runtime (~30KB), framework complexity, and a canvas layer. Not worth the visual delta over layered CSS for a marketing site |
| Liquid Glass | Multi-layer CSS | Pure glassmorphism `backdrop-blur` only | Works but leaves the "liquid" interpretation flat. Specular pseudo-elements + refraction (where supported) are the cheap step to "feels liquid" |
| Liquid Glass | Inline SVG defs in HTML | External `.svg` file with filter IDs | Safari additionally has a bug where external `filter: url("file.svg#id")` does not work (caniuse issue #3803). Inline defs sidestep this |
| Liquid Glass | `@supports` + runtime JS probe for refraction | `@supports (backdrop-filter: url(#x))` alone | `@supports` alone returns false positives in Safari for some URL forms — the runtime probe is a belt-and-braces safeguard |
| Grid | Native Tailwind v4 utilities | Custom grid helper CSS | Tailwind v4 generates everything natively. Custom CSS would be a layer of indirection for no benefit |
| Grid | `max-w-[1200px]` (or `max-w-content` token) | Tailwind `max-w-7xl` (1280px) | Project convention is 1200px (v1.3 decision). Normalize on this |
| Motion | Motion 12.x CDN (existing) | Anime.js v4 | Motion has better spring physics API, better scroll-timeline integration, and is already in the project |
| Motion | Motion 12.x CDN | GSAP | GSAP is paid for commercial use; Motion is MIT |
| Fonts | SF Pro system stack (existing) | Self-hosted SF Pro WOFF2 | Apple EULA does not permit redistribution on the web. Legal risk |
| Fonts | SF Pro system stack (existing) | Inter v4 variable | Project intentionally removed Inter in pre-v2.0 migration to align with Apple-device aesthetic. Reintroducing would fork the brand language |
| Reactivity | Vanilla JS + Motion | Alpine.js | Adds 15KB for <50 lines of reactive work. Project already has IIFE vanilla JS for mobile menu, accordion, form validation — no framework needed |
| Reactivity | Vanilla JS + Motion | htmx | htmx is for server-driven partials, not applicable to a static landing with one Directus POST endpoint |
| Build | Existing Tailwind v4.2.2 standalone binary | PostCSS + autoprefixer + cssnano | Standalone binary is sufficient and zero-config |
| Build | Existing POSIX-sh splicer + partials | Handlebars / EJS / Mustache templates | v3.2 key decision already rejected Node templating for the same reasons |

---

## Integration Map (What Lands Where)

| New asset | Lives in | Consumed by | Compiled via |
|-----------|----------|-------------|--------------|
| `--squircle-*` radius tokens (scale of 5) | `src/styles/theme.css` `:root` + `@theme inline` | All partials + pages via Tailwind utilities `squircle-sm/md/lg/xl/full` | `tailwindcss` CLI → `css/styles.css` |
| Pre-authored SVG squircle mask data-URIs (~24 variants) | `src/styles/squircles.css` (new) — imported from `src/styles/tailwind.css` | `.squircle-*` utility classes | Tailwind CLI |
| `corner-shape: superellipse(2)` PE block | Same `squircles.css`, inside `@supports (corner-shape: ...)` | Same utilities | Tailwind CLI |
| `--glass-*` material tokens (5 materials) | `src/styles/theme.css` `:root` + `@theme inline` | `bg-glass-thin/regular/thick/ultrathin/chrome` utilities | Tailwind CLI |
| `--shadow-glass-*` (extended — already partially exists) | `src/styles/theme.css` `@theme inline` | `shadow-glass-*` utilities | Tailwind CLI |
| Liquid Glass layered pseudo-elements + specular gradients | `src/styles/liquid-glass.css` (new) | `.liquid-glass` base class | Tailwind CLI via @import |
| Inline SVG `<filter>` definitions (refraction, turbulence) | `partials/svg-defs.html` (new) | Spliced into each of 6 pages' `<body>` top | POSIX-sh splicer (`scripts/build-pages.sh`) |
| `data-refract` capability probe (~10 LOC) | `js/main.js` (existing) | Added to `<html>` element at runtime; gates `.liquid-glass-thick[data-refract]` CSS rule | No build, vanilla JS |
| 12/8/2-3 grid wrapper + `max-w-content` token | `src/styles/theme.css` `--container-content: 1200px` | All 6 HTML pages wrap content in `<main class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-content mx-auto">` | Tailwind CLI |
| Focus-visible outline refactor (away from `box-shadow`) | `src/styles/theme.css` `@layer base` | All interactive elements | Tailwind CLI |
| `@media (prefers-reduced-motion: reduce)` glass downgrade | `src/styles/liquid-glass.css` | All glass utilities | Tailwind CLI |
| Liquid Glass motion helpers (hover spring, scroll-linked blur) | `js/main.js` (existing) via Motion 12.x CDN | Header (on scroll), buttons (on hover), cards (on inView) | No build |
| Updated `partials/header.html` | Existing path | All 6 pages via splicer | POSIX-sh splicer |
| Updated `partials/mobile-menu.html` | Existing path | All 6 pages via splicer | POSIX-sh splicer |
| Updated `partials/sticky-bar.html` | Existing path | All 6 pages via splicer | POSIX-sh splicer |
| Updated `partials/footer.html` | Existing path | All 6 pages via splicer | POSIX-sh splicer |

**Byte-identity pre-commit hook (v3.2)** enforces all partial→page propagation. No manual page edits — every chrome change lands via the splicer.

---

## Installation / Setup

**Good news:** the existing `make install-tailwind` + `make build` pipeline is sufficient. No new install steps.

**Expected Phase sequence** (for downstream roadmapper — not the full breakdown, just the stack-level checkpoints):

1. **Foundation tokens** — extend `theme.css` with `--squircle-*` + `--glass-*` scales, add `@theme inline` generation, verify Tailwind utilities compile.
2. **Squircle primitives** — author SVG mask data-URIs, create `squircles.css`, add `corner-shape` progressive-enhancement block, add shadow-wrap pattern documentation.
3. **Liquid Glass primitives** — create `liquid-glass.css` with material tokens, specular pseudo-elements, `@supports` refraction block. Add `partials/svg-defs.html`.
4. **Grid foundation** — add `--container-content` token, wrap all 6 pages in the 12/8/2-3 grid structure, audit existing `max-w-*` utilities.
5. **Partials migration** — update header, footer, mobile-menu, sticky-bar to use new squircle + glass utilities. Byte-identity hook propagates to all 6 pages.
6. **Page-specific migrations** — index, online-consultations, treatment-abroad, checkup, contacts, 404 — apply grid binding + squircle + glass to hero, cards, forms, illustrations.
7. **Motion integration** — wire Motion 12.x hover/scroll springs to new primitives, add `data-refract` JS probe.
8. **A11y / perf verification** — focus ring refactor, reduced-motion glass downgrade, manual budget-Android scroll test.

---

## Sources

**Tailwind CSS v4**
- [Tailwind CSS Releases (GitHub)](https://github.com/tailwindlabs/tailwindcss/releases) — v4.2.2 confirmed as latest (HIGH)
- [Tailwind CSS v4.1 release notes](https://tailwindcss.com/blog/tailwindcss-v4-1) — mask-* and text-shadow utilities (HIGH)
- [Tailwind CSS v4.0 intro](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, container queries native (HIGH)
- [Tailwind CSS v4 container queries article (SitePoint)](https://www.sitepoint.com/tailwind-css-v4-container-queries-modern-layouts/) — @container syntax (MEDIUM)

**Squircle / corner-shape**
- [MDN: corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) — Experimental, Limited availability status (HIGH)
- [MDN: corner-shape-value](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/corner-shape-value) — syntax reference (HIGH)
- [Chrome Platform Status: corner-shape feature](https://chromestatus.com/feature/5357329815699456) — Chrome 139+ shipped, no Firefox/Safari timeline (HIGH)
- [Smashing Magazine: Beyond border-radius (March 2026)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/) — production-readiness analysis (MEDIUM)
- [Frontend Masters: Understanding CSS corner-shape](https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse/) — keyword mappings, `superellipse(2)` = squircle (MEDIUM)
- [CSS-Tricks: superellipse() almanac](https://css-tricks.com/almanac/functions/s/superellipse/) — function syntax (MEDIUM)
- [figma-squircle npm](https://www.npmjs.com/package/figma-squircle) — package size 26.6 kB, vanilla JS but Node-install required (MEDIUM)
- [phamfoo/figma-squircle GitHub](https://github.com/phamfoo/figma-squircle) — getSvgPath API, TypeScript (MEDIUM)
- [wopian/smooth-corners](https://github.com/wopian/smooth-corners) — Houdini paint worklet, Chromium-only (HIGH)
- [Squircle.js blog: Squircles in Web Design](https://squircle.js.org/blog/squircles-in-web-design) — comparison of techniques (MEDIUM)

**Liquid Glass / Apple iOS 26**
- [Apple Developer: Liquid Glass overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass) — official doc (HIGH)
- [Apple Newsroom: New software design (June 2025)](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) — specular/refraction/adaptive coloring description (HIGH)
- [Wikipedia: Liquid Glass](https://en.wikipedia.org/wiki/Liquid_Glass) — platform coverage (MEDIUM)
- [LogRocket: How to create Liquid Glass effects with CSS and SVG](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/) — backdrop-filter + SVG technique, perf warnings, Chrome-only note (HIGH)
- [kube.io: Liquid Glass in the Browser — CSS + SVG](https://kube.io/blog/liquid-glass-css-svg/) — Snell's Law math, displacement map technique, Chrome-only (HIGH)
- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) — three-layer breakdown: highlight, shadow, illumination (MEDIUM)
- [nikdelvin/liquid-glass GitHub](https://github.com/nikdelvin/liquid-glass) — pixel-perfect recreation with feDisplacementMap + feSpecularLighting (MEDIUM)
- [Liquid Glass Swift/SwiftUI reference (Medium)](https://medium.com/@madebyluddy/overview-37b3685227aa) — material variants: regular, clear, identity (MEDIUM)

**Backdrop-filter SVG support**
- [WebKit Bug 245510: backdrop-filter: url(#svg-filter) does not work](https://bugs.webkit.org/show_bug.cgi?id=245510) — confirmed Safari limitation (HIGH)
- [MDN compat issue #24110: SVG filters not supported in Firefox or Safari](https://github.com/mdn/browser-compat-data/issues/24110) — confirmed cross-browser gap (HIGH)

**CSS primitives**
- [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark) — Baseline since May 2024 (HIGH)
- [Bram.us: light-dark() images update (March 2026)](https://www.bram.us/2026/03/19/more-easy-light-dark-mode-switching-light-dark-is-about-to-support-images/) — current state (MEDIUM)
- [Can I Use: CSS Subgrid](https://caniuse.com/css-subgrid) — 97% global support in 2026 (HIGH)
- [Can I Use: CSS Backdrop Filter](https://caniuse.com/css-backdrop-filter) — Baseline (HIGH)

**Motion**
- [Motion.dev](https://motion.dev/) — main docs (HIGH)
- [Motion changelog](https://motion.dev/changelog) — 12.37.0 latest as of March 16, 2026 (HIGH)
- [Motion spring docs](https://motion.dev/docs/spring) — spring API (HIGH)

**Fonts**
- [Apple Developer Fonts](https://developer.apple.com/fonts/) — SF Pro variants, EULA (HIGH)
- [San Francisco typeface (Wikipedia)](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface)) — variant history, iOS 26 numeral font note (MEDIUM)
- [Apple WWDC22: Meet the expanded San Francisco font family](https://developer.apple.com/videos/play/wwdc2022/110381/) — SF Pro Expanded exists but not for web (HIGH)

**Confidence summary**
- **HIGH confidence areas:** zero-Node feasibility, Tailwind v4 native capabilities, `mask-image` approach viability, Motion 12.x stability, SF Pro stack canonical status, backdrop-filter Baseline support, corner-shape Chrome-only status.
- **MEDIUM confidence areas:** exact perf cost on mid-tier Android (need real-device benchmarks in Phase scope), visual fidelity of CSS-only Liquid Glass vs. Apple's native (directional estimate only), optimal `superellipse(k)` value (recommended `k=2` but Apple's app icon n=5 may map differently — needs visual A/B in Phase).
- **LOW confidence areas:** none that block phase planning. The experimental `corner-shape` feature is explicitly scoped as progressive enhancement so its uncertainty does not affect the critical path.
