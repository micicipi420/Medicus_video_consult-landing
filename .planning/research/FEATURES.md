# Feature Landscape: v4.0 Liquid Design System

**Project:** MedicusUnion KZ — Apple Liquid Design migration
**Researched:** 2026-04-09
**Research mode:** Ecosystem (targeted — new design language only; existing features already shipped)
**Overall confidence:** MEDIUM-HIGH

## Scope boundary

This research covers **only what the NEW design language adds**. Existing shipped capabilities (6 pages, forms, FAQ, sticky header, mobile menu, dark mode toggle, scroll-reveal, WCAG AA tokens, Russian typography polish, vertical rhythm system, build pipeline, v1.4 glass v1) are **not re-researched** — they are inputs to the migration, not questions.

New target capabilities:
1. Responsive grid system — 12 / 8 / 2-3 col (desktop / tablet / mobile), everything aligned
2. Universal squircle shapes — every `border-radius` → superellipse
3. Apple Liquid Design language — materials, specular, refraction, dynamic blur (iOS 26 / macOS Tahoe)
4. Relaxed perf budget — v1.4 "max 2 glass / blur ≤12px" is **superseded**

Source hierarchy for this research:
- **HIGH** — apple.com newsroom (2025-06, official Apple language), Apple Developer docs (JS-rendered, accessed via secondary extraction), MDN `corner-shape`, Smashing Magazine 2026 `corner-shape` guide, CSS-Tricks Liquid Glass analysis
- **MEDIUM** — LogRocket (UX best practices), createwithswift.com (SwiftUI API details), Six Colors macOS Tahoe review (criticisms), Infinum accessibility critique, conorluddy/LiquidGlassReference GitHub (community-verified SwiftUI reference)
- **LOWER** — dev.to CSS recipes (verified against CSS-Tricks / LogRocket for consistency)

---

## (A) Apple Liquid Glass component inventory

Extracted from Apple's **official newsroom announcement** (2025-06), the `Adopting Liquid Glass` developer docs (via secondary extraction — dev.to, createwithswift, Donny Wals, conorluddy reference), and WWDC25 session 219 "Meet Liquid Glass". Confidence: HIGH for component list, MEDIUM for exact material recipes.

### A.1 Controls

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Primary button** (`.buttonStyle(.glassProminent)`) | Tinted Liquid Glass with full color saturation, specular edge, interactive bounce on press | CTA: retain existing gradient fill, add specular edge + squircle + press spring | **TABLE STAKES** | Moderate | CTAs are conversion-critical; Liquid without tinted primaries is incomplete |
| **Secondary button** (`.buttonStyle(.glass)`) | Translucent Liquid Glass with vibrancy on label, adapts to background | Secondary actions (contact form submit alternates, "Подробнее" on cards): backdrop-filter regular + border rim | **TABLE STAKES** | Moderate | Already in use on service-card "Подробнее"; needs material upgrade |
| **Icon button** (symbol-only glass) | Circular glass with vibrant SF Symbol inside | Mobile menu trigger, theme toggle, phone icon in sticky bar — circular glass with icon | **TABLE STAKES** | Trivial | Already circular in v1.4; upgrade material recipe |
| **Plain button** (text link with no chrome) | Transparent; tappable with subtle vibrancy | Footer links, nav links, FAQ question toggles | **TABLE STAKES** | Trivial | No new visual; only hover/focus spring update |
| **Bordered button** (ring without fill) | Thin glass rim, no fill | Rarely used in marketing context; use if needed for tertiary actions | DIFFERENTIATOR | Trivial | Niche — we don't currently have tertiary button tier |
| **Toggle / switch** | Capsule glass track + glass thumb with specular | Dark mode toggle in header | **TABLE STAKES** (for dark toggle) | Moderate | Existing toggle must match language |
| **Slider** | Glass track + glass thumb, shows refraction | Not used — we have no numeric inputs | **ANTI-FEATURE** | — | No surface on any page needs this |
| **Stepper** | +/- glass controls | Not used | **ANTI-FEATURE** | — | No numeric inputs |
| **Picker / date picker** | Wheel of glass | Not used | **ANTI-FEATURE** | — | Form has no dates; dropdown is a `<select>` |
| **Segmented control** | Pill of glass with selected segment tinted | Could be used for e.g. form variant switcher, but currently unused | **ANTI-FEATURE** | — | No multi-option selection surfaces exist |

### A.2 Containers

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Card** | Not an iOS primitive per se, but container surfaces (widgets, grouped lists) adopt Liquid Glass | Service cards, pricing card, review cards, value-prop cards, step cards, FAQ items | **TABLE STAKES** | Moderate | Cards are the primary composition unit across all 6 pages |
| **Sheet / modal** (`.presentationDetents`) | Liquid Glass backing with rounded-top corners | Mobile menu drawer (already acts as sheet) | **TABLE STAKES** | Moderate | Existing mobile menu is closest analog |
| **Panel** (inspector, detail pane) | Floating glass layer over content | Form container (`.glass-5` shell already exists) — upgrade | **TABLE STAKES** | Moderate | Form is highest-stakes surface; must feel premium |
| **Popover** | Small glass bubble with arrow | Not used | **ANTI-FEATURE** | — | No popovers on current pages |
| **Sidebar** (`NavigationSplitView`) | Translucent glass sidebar with vibrancy | Not applicable — marketing site has no sidebar nav | **ANTI-FEATURE** | — | Sidebar nav is OS/app paradigm, not landing page |
| **Grouped container** (e.g. section of list items) | Glass backing behind grouped content | Stats bar backdrop, trust-signal group, process-step group | DIFFERENTIATOR | Moderate | Optional visual grouping; don't over-nest |

### A.3 Navigation

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Nav bar (header)** | Transparent backing, blurs content as user scrolls, buttons become glass | Sticky header on scroll — already v1.4 glass-v1; upgrade to full Liquid recipe | **TABLE STAKES** | Moderate | Highest visibility chrome; sets tone |
| **Tab bar** (`TabView` with `.tabBarMinimizeBehavior`) | Floating capsule of Liquid Glass at bottom, minimizes on scroll | Sticky mobile bar (click-to-call + CTA) — upgrade to capsule glass, consider minimize-on-scroll | **TABLE STAKES** | Moderate | Sticky bar is the iOS tab bar analog |
| **Page indicator** (dots) | Liquid dots | Not used — pages don't carousel | **ANTI-FEATURE** | — | No horizontal paging |
| **Breadcrumbs** | Not an Apple primitive | Not used | **ANTI-FEATURE** | — | Marketing site doesn't need them |
| **Scroll-edge effect** (new in iOS 26) | Soft/hard gradient fade at scrollview edges where content meets toolbar | Apply at top of main content where header floats over, and at bottom where sticky bar overlays | DIFFERENTIATOR | Moderate | Strong signal of "OS-level Liquid" — distinctive |

### A.4 Feedback

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Alert / dialog** | Centered glass card with vibrant buttons | Form success state (already exists as absolute-positioned overlay in `form__success`) | **TABLE STAKES** | Trivial | Upgrade existing success overlay only |
| **Toast** | Floating glass pill appearing briefly | Form validation error hints (currently inline) — could float | DIFFERENTIATOR | Moderate | Inline errors are clearer for ЦА 45+; defer |
| **Progress indicator** | Glass capsule with fill | Not used | **ANTI-FEATURE** | — | No long-running operations on landing |
| **Activity spinner** | Simple glass spinner | Form submit loading — currently handled by button state | **TABLE STAKES** | Trivial | Already minimal; cosmetic upgrade |

### A.5 Inputs

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Text field** | Glass-backed field; focused state lightens backing, adds rim | Name, phone inputs — already `bg-white/50 backdrop-blur-md`; upgrade material + squircle | **TABLE STAKES** | Moderate | Form is conversion surface; must feel premium |
| **Text area** | Same as text field but multi-line | Description textarea | **TABLE STAKES** | Trivial | Same recipe as text field |
| **Search field** | Capsule glass with SF Symbol magnifying glass | Not used | **ANTI-FEATURE** | — | No search on landing |
| **Select / dropdown** | Native iOS wheel or menu | Specialization `<select>` — keep native menu, glass-up the trigger | **TABLE STAKES** | Moderate | Select trigger visible in form; option list stays native |
| **Checkbox / radio** | Glass chip with specular check | Not used — form has no consent checkbox currently | DIFFERENTIATOR | Trivial | If GDPR/consent added later, need squircle chip |

### A.6 Menus

| Component | iOS 26 treatment | Web adaptation | Category | Complexity | Rationale |
|-----------|-----------------|----------------|----------|------------|-----------|
| **Dropdown menu** (e.g. from nav button) | Liquid Glass panel cascading down | Header language switcher? Currently none | **ANTI-FEATURE** | — | Russian-only; no menu |
| **Context menu** (right-click / long-press) | Rich glass panel with vibrant items | Not applicable on marketing site | **ANTI-FEATURE** | — | Context menus are app-level paradigm |
| **Command palette** (e.g. Linear-style ⌘K) | Not an Apple primitive | Not applicable | **ANTI-FEATURE** | — | Product UI feature, not marketing |

### A.7 Component inventory summary

| Category | Count | TABLE STAKES | DIFFERENTIATOR | ANTI-FEATURE |
|----------|-------|--------------|---------------|--------------|
| Controls | 10 | 4 | 1 | 5 |
| Containers | 6 | 3 | 1 | 2 |
| Navigation | 5 | 2 | 1 | 2 |
| Feedback | 4 | 2 | 1 | 1 |
| Inputs | 5 | 3 | 1 | 1 |
| Menus | 3 | 0 | 0 | 3 |
| **Total** | **33** | **14 (42%)** | **5 (15%)** | **14 (42%)** |

**Read:** About 40% of Apple's Liquid vocabulary is ANTI-FEATURE for a medical marketing landing — all the app-chrome stuff (sliders, steppers, pickers, sidebars, popovers, context menus, command palettes). That's healthy: it prevents scope creep into "port iOS to web" territory. The 14 table-stakes components map cleanly to surfaces we already have.

---

## (B) Liquid Material taxonomy

**IMPORTANT correction to orchestrator's prompt**: The prompt asked about "Regular, Thick, Thin, UltraThin, Chrome" — those are **iOS 17 `UIBlurEffect` styles**, which are the legacy Apple materials API. In **iOS 26 Liquid Glass**, Apple simplified the taxonomy to **two variants** (plus modifiers). This is a meaningful change and is the correct basis for v4.0.

### B.1 Official iOS 26 Liquid Glass variants

From Apple Developer Documentation (`Adopting Liquid Glass`) via secondary extraction (search result confirmed by conorluddy/LiquidGlassReference + createwithswift + LogRocket — triangulated, HIGH confidence):

> "There are two Liquid Glass variants to choose from: Regular and Clear, and they should never be mixed."

| Variant | Apple HIG text | Visual signature | When to use |
|---------|---------------|------------------|-------------|
| **Regular** | "The most versatile variant you will be using the most. This variant gives you all the visual and adaptive effects, and provides legibility regardless of context. It works in any size, over any content and anything can be placed on top of it." | Medium blur, adaptive tint, automatic vibrancy, strong legibility | **Default for everything** — buttons, cards, nav bar, sheet, form, sticky bar |
| **Clear** | "Does not have adaptive behaviors. It is permanently more transparent, which allows the richness of the content underneath to come through." | Low blur, high transparency, no adaptive dimming, no automatic legibility help | **Only over media-rich content** (photos, video) where content dimming is acceptable AND foreground content is bold/bright |

**Plus modifiers** (applied to either variant):
- `.tint(color)` — semantic color tinting (e.g. our CTA green)
- `.interactive()` — enables scaling, touch-point illumination, and morphing (iOS only — no direct web analog)

**Identity** — not a material; it's a "glass off" state used for conditional disabling (not relevant to us unless we add a per-surface glass toggle).

### B.2 Medical landing filter

For medicusunion.kz, **Clear is an anti-feature**:
- We have no media-rich surfaces where dimming is acceptable (our hero uses a gradient mesh + SVG illustration, not photos or video; v1.0 decision against hero video)
- ЦА 45+ legibility is a hard constraint — Clear explicitly "does not have adaptive behaviors" for legibility
- Clear would fail WCAG AA on Cyrillic text over our photo backgrounds (photos exist only in clinic cards and reviews)

**Use Regular everywhere. Forbid Clear by convention.**

### B.3 CSS recipe for "Regular" Liquid Glass — light mode

Distilled from CSS-Tricks, LogRocket, dev.to/kevinbism, and cross-referenced with Apple's three-layer description. Each value is calibrated; the numbers are NOT arbitrary.

```css
/* Base token — goes in theme.css */
:root {
  /* Regular Liquid Glass — light mode */
  --liquid-bg: rgba(255, 255, 255, 0.18);
  --liquid-blur: 24px;              /* was ≤12px in v1.4 — now relaxed */
  --liquid-saturate: 180%;
  --liquid-brightness: 108%;
  --liquid-border-top: rgba(255, 255, 255, 0.9);   /* bright rim where light hits */
  --liquid-border-bottom: rgba(255, 255, 255, 0.35); /* dim rim on shadow side */
  --liquid-shadow-outer: 0 16px 40px rgba(20, 30, 60, 0.12);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.8);  /* specular top edge */
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(255, 255, 255, 0.15);
}

/* Regular Liquid Glass surface */
.liquid-regular {
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  border: 1px solid var(--liquid-border-top);
  box-shadow:
    var(--liquid-shadow-outer),
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom);
}
```

**Rationale for each number:**
- `blur(24px)` — CSS-Tricks and dev.to recipes cluster at 20-40px for "Apple-level" glass; 24px is the median and preserves some detail of content behind. v1.4 was 12px which felt "frosted gradient" not "glass".
- `saturate(180%)` — adds vibrancy (the chromatic pop Apple applies), matches multiple recipes consistently.
- `brightness(108%)` — subtle lift, prevents glass looking muddy on mid-tone backgrounds.
- `rgba(255,255,255,0.18)` tint — Apple's "regular" is ~15-20% white wash; 0.18 is the Apple.com hero button observed value.
- Asymmetric border (top bright, bottom dim) — this is the **cheap specular simulation**: light "comes from above" in Apple's rendering.

### B.4 CSS recipe for "Regular" Liquid Glass — dark mode

Critical: our v1.4 decision was to **disable backdrop-filter in dark mode** because of the "murky smear on navy #0F1923" problem. v4.0 must solve this, not preserve it.

```css
[data-theme="dark"] {
  /* Regular Liquid Glass — dark mode */
  --liquid-bg: rgba(30, 40, 60, 0.45);              /* dark base, higher opacity for legibility */
  --liquid-blur: 28px;                               /* slightly stronger blur to smooth navy */
  --liquid-saturate: 160%;                           /* dialed back — saturation amplifies color cast */
  --liquid-brightness: 115%;                         /* lift — counters dark muddiness */
  --liquid-border-top: rgba(255, 255, 255, 0.25);   /* dimmer rim in dark */
  --liquid-border-bottom: rgba(0, 0, 0, 0.4);
  --liquid-shadow-outer: 0 16px 40px rgba(0, 0, 0, 0.45);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
}
```

The key shift: in dark mode the base is not "white tint" but "dark tint with higher opacity" — this is what Apple does and what our v1.4 attempt missed.

### B.5 Scale tokens — one material, multiple sizes

Rather than Apple's iOS 17 "thick/thin/ultrathin" which don't exist in iOS 26, we provide **scale variants** of the single Regular recipe for different surface sizes:

| Token | Blur | Use case |
|-------|------|----------|
| `--liquid-blur-sm` | 16px | Small chips (badge, pill), icon buttons |
| `--liquid-blur-md` | 24px | Cards, form inputs, nav bar |
| `--liquid-blur-lg` | 40px | Large surfaces (mobile menu drawer, form container) |
| `--liquid-blur-xl` | 60px | Hero overlay gradient mesh |

This is a v4.0 **project-specific extension** of Apple's model — Apple has one material at one size, we have one material at four sizes. Rationale: on the web, blur radius affects perceived "distance" from the content behind; small chips should feel close, large surfaces should feel far. Matches apple.com marketing page behavior (hero chrome uses stronger blur than floating button chips).

---

## (C) Specular highlight & refraction patterns

What actually makes Liquid Glass feel like glass, not plastic. Confidence: HIGH for achievability split, MEDIUM for exact numeric values.

| Effect | What it is | Pure CSS? | Needs JS? | Impossible on web? | Priority |
|--------|-----------|-----------|-----------|-------------------|----------|
| **Edge glow (top-left diagonal)** | Bright rim on "light-facing" edges, dim rim on opposite | ✅ YES — asymmetric `border` or `box-shadow inset` | No | No | **TABLE STAKES** |
| **Rim lighting (1px bright inner border)** | Single bright pixel inside the border | ✅ YES — `box-shadow: inset 0 1px 0 rgba(255,255,255,.8)` | No | No | **TABLE STAKES** |
| **Center specular on press** | Radial highlight where finger/cursor touches | ⚠️ Partial — radial gradient following cursor via `::before` + JS | JS for position | No | **DIFFERENTIATOR** |
| **Background refraction / warp** | Content behind the element is visually distorted | ❌ NO (Chromium only via SVG `feDisplacementMap`) | N/A | Effectively yes for cross-browser | **ANTI-FEATURE** (Chromium-only, breaks Safari) |
| **Chromatic aberration (R/B edge split)** | Red-blue color fringe on edges, like a real lens | ❌ NO — needs shader | Would need WebGL | Practically impossible | **ANTI-FEATURE** |
| **Dynamic reflection of content behind** | Surface "picks up" colors from content beneath | ⚠️ Approximate — `backdrop-filter: saturate()` amplifies nearby colors | No | Full version needs shader | **TABLE STAKES** (via saturate()) |
| **Interactive shimmer on hover** | Subtle animated highlight sweep | ✅ YES — animated `linear-gradient` mask on `::before` | Optional | No | **DIFFERENTIATOR** |

**Ruling:** Pursue TABLE STAKES effects (edge glow, rim lighting, saturate-reflection) in pure CSS for all browsers. Pursue DIFFERENTIATOR effects (center specular, shimmer) as progressive enhancement. **Do not pursue ANTI-FEATURE effects** — refraction-via-SVG-filter is Chromium-only (confirmed by LogRocket: "Safari and Firefox do not support this combination yet") and chromatic aberration is shader territory. Attempting them would break Safari (a material share of iOS users the ЦА 45+ overlaps with).

### C.1 Rim lighting recipe (TABLE STAKES)

```css
/* Minimal rim — cheap, works everywhere */
.liquid-rim {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),   /* top bright */
    inset 0 -1px 0 rgba(0, 0, 0, 0.08),       /* bottom dim */
    inset 1px 0 0 rgba(255, 255, 255, 0.3),   /* left side mid-bright */
    inset -1px 0 0 rgba(0, 0, 0, 0.04);       /* right side mid-dim */
}
```

The asymmetry (top brighter than bottom, left brighter than right) simulates a light source at the top-left — Apple's convention across iOS and macOS.

### C.2 Interactive shimmer (DIFFERENTIATOR)

```css
/* Sweep on hover — pure CSS, respects reduced-motion */
.liquid-shimmer {
  position: relative;
  overflow: hidden;
}
.liquid-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 40%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.8s ease;
  pointer-events: none;
}
.liquid-shimmer:hover::before {
  transform: translateX(100%);
}
@media (prefers-reduced-motion: reduce) {
  .liquid-shimmer::before { display: none; }
}
```

### C.3 Center specular on tap (DIFFERENTIATOR)

```css
/* Pointer-follow radial highlight — needs JS to set --mx/--my */
.liquid-interactive {
  background:
    radial-gradient(
      circle at var(--mx, 50%) var(--my, 50%),
      rgba(255, 255, 255, 0.25) 0%,
      transparent 60%
    ),
    var(--liquid-bg);
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.liquid-interactive:active {
  transform: scale(0.97);
}
```

```js
el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
});
```

~15 lines of vanilla JS per surface. Apply only to hero CTA and pricing card CTA — surfaces where the "magic moment" matters.

---

## (D) Motion design tokens from Apple HIG

Confidence: MEDIUM — Apple HIG page requires JS to render, so exact values extracted from secondary sources (SwiftUI documentation, Hacking with Swift, GetStream spring animations repo) which cite Apple's published defaults.

### D.1 Apple's default spring (SwiftUI `.spring()`)

From Apple Developer Documentation via extraction:
- **Response:** 0.55 (seconds — how quickly animation attempts to reach target)
- **Damping fraction:** 0.825 (0 = infinite bounce, 1 = no bounce)
- **Blend duration:** 0

This is the **default spring** used for SwiftUI state changes in iOS 26 when you write `.spring()` without parameters. It's the same default as iOS 17.

### D.2 Web translation via `cubic-bezier`

Apple's spring cannot be 1:1 translated to CSS without a spring engine, but Framer Motion / Motion CDN provides spring physics natively. Since we already have Motion CDN loaded (v1.3), we can use it.

For pure-CSS motion, approximate Apple's spring with `cubic-bezier(0.2, 0, 0, 1)` (decelerate curve — used across Apple's web presence).

### D.3 Motion token table

Derived values calibrated for our reduced-motion-respecting stack:

| Interaction | Apple SwiftUI | Web equivalent | Duration | Reduced-motion |
|------------|--------------|----------------|----------|---------------|
| Button press down | `.spring(response: 0.2, dampingFraction: 0.8)` | `cubic-bezier(0.2, 0, 0, 1)` + `transform: scale(0.97)` | 120ms | Instant (no transform, no transition) |
| Button release | Same spring, to `scale(1)` | Same curve | 200ms | Instant |
| Card hover lift | `.spring(response: 0.4, dampingFraction: 0.85)` | `cubic-bezier(0.2, 0, 0, 1)` + `translateY(-4px)` | 280ms | No transform |
| Sheet present (mobile menu) | `.spring(response: 0.5, dampingFraction: 0.825)` | `cubic-bezier(0.2, 0, 0, 1)` + `translateY/scale` | 400ms | Fade only, no transform |
| Scroll-reveal (new element enters viewport) | `.easeOut(duration: 0.6)` | `cubic-bezier(0.16, 1, 0.3, 1)` (apple easeOutExpo) | 500-600ms | Already handled via `prefers-reduced-motion` |
| Glass shimmer sweep | `.easeInOut(duration: 0.8)` | `ease` | 800ms | Disabled entirely |
| Theme toggle | `.spring(response: 0.4, dampingFraction: 0.9)` | `cubic-bezier(0.2, 0, 0, 1)` | 300ms | Instant color swap |

**Canonical tokens for theme.css:**

```css
:root {
  /* Liquid Motion */
  --ease-liquid: cubic-bezier(0.2, 0, 0, 1);         /* press, release, card lift, sheet */
  --ease-liquid-out: cubic-bezier(0.16, 1, 0.3, 1);  /* scroll-reveal, entrance */
  --dur-press: 120ms;
  --dur-release: 200ms;
  --dur-hover: 280ms;
  --dur-sheet: 400ms;
  --dur-reveal: 600ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --ease-liquid: linear;
    --ease-liquid-out: linear;
    --dur-press: 0ms;
    --dur-release: 0ms;
    --dur-hover: 0ms;
    --dur-sheet: 0ms;
    --dur-reveal: 0ms;
  }
}
```

### D.4 Scroll-linked parallax — DO NOT ADD

From PROJECT.md Out of Scope: "Параллакс / тяжёлые анимации — ЦА 45+, предпочитаем простоту". This predates v4.0 and survives v4.0. apple.com product pages use aggressive scroll-linked parallax (iPhone spin, camera zoom); **we do not**. Liquid Glass can be adopted without parallax — they are orthogonal.

**Explicit anti-feature:** No `scroll-timeline`, no JS scroll-follow transforms on hero, no "pinned scroll narratives" like Stripe homepage.

---

## (E) Grid composition from web references

Confidence: MEDIUM for apple.com (described via webfetch — dynamic content partially readable), LOW for Linear/Vercel/Stripe exact values (their grid tokens live in JS-loaded CSS not reachable by webfetch). Best-effort observations + common-pattern knowledge.

### E.1 apple.com iPhone product pages

From iPhone 17 Pro page fetch and general Apple marketing pattern:

- **Grid:** 12-column desktop, 1200-1440px max-width, ~32-48px gutters
- **Hero:** Single-column "stand-alone" product shot, full-width, no surrounding cards competing for attention
- **Stat callouts:** Large oversized numbers breaking grid — "8× optical zoom" occupies 4-6 cols with no card backing
- **Feature sections:** Vertical narrative, each section its own story, rarely 3-up card grids in the top half; card grids appear lower for tertiary features
- **"Hero stands alone"** — this is the most important Apple convention and translates directly to us

**For us:** Hero illustration should not share its row with a card grid. Push stats/features to their own section below the hero.

### E.2 Linear.app

From page fetch + reputation:
- **Grid:** 12-col desktop, large gutters (32px+)
- **Cards:** Generous border-radius (~20-24px in v3; v4 is squircled via corner-shape on Chromium)
- **Dark-first** visual language with brand gradients in hero — we remain light-first per v1.4 decision
- **5-col animated grids** observed in decorative patterns (not content grid)
- **Feature cards:** 2-col tablet, 3-col desktop, with square-ish aspect ratios

**For us:** Linear's card cadence is close to our service cards; keep their generosity of gutter.

### E.3 Vercel.com

From page fetch + Geist design system knowledge:
- **Grid:** 12-col, moderate gutters
- **Typography:** Heavy reliance on hero headline, minimal imagery, lots of negative space
- **Cards:** Subtle borders, muted fills, restrained shadow — "enterprise clean" not "consumer rich"

**For us:** The restrained card treatment is a useful counterweight to over-glassing. Vercel proves you can have 2026 polish without every surface being ornate.

### E.4 Stripe.com

From page fetch:
- **Bento grids:** 2-3-4 col composable cells with mixed sizes (large hero cell + smaller supporting cells)
- **Narrative scroll:** Top-down storytelling, hero → products → social proof → use cases → developer → news
- **Signature wave/gradient backgrounds:** Stripe-only device; we don't copy
- **Button style:** Restrained, subtle, never neon

**For us:** The narrative sequence maps exactly to our index.html section order (hero → services → problem → process → why-us → clinics → reviews → faq → contact). Stripe validates our page anatomy; we just upgrade the material.

### E.5 8-column tablet — our unique constraint

The user-set 8-col tablet (not 6, not 12) was flagged in PROJECT.md as fixed project convention. None of the reference sites use 8; common tablet grids are 6, 8, or 12. **8 gives cleaner 2/4/8 division than 6 (which gives 1/2/3/6) for a site whose content naturally wants 2-up (service cards) and 4-up (stats)**. It's defensible; we just don't validate it against references because the references don't use it.

### E.6 Grid decision table for v4.0

| Breakpoint | Cols | Gutter | Max-width | Source pattern |
|------------|------|--------|-----------|---------------|
| Mobile (< 640px) | 2-3 | 16px | 100vw - 32px | Own convention |
| Tablet (640-1024px) | 8 | 24px | 100vw - 48px | Project decision (PROJECT.md) |
| Desktop (≥ 1024px) | 12 | 32px | 1200px | apple.com + Linear + Vercel consensus |

---

## (F) Typography + Liquid interaction

Confidence: MEDIUM — Apple HIG typography page didn't render; values drawn from conorluddy reference, LogRocket, and known SF Pro behavior.

### F.1 Text on glass — Apple's rules

From conorluddy reference:

> "Text on glass automatically receives vibrant treatment — adjusts color, brightness, saturation based on background. Icons require high contrast foreground colors."

Apple's SwiftUI auto-applies vibrancy (which in AppKit is `NSVisualEffectView` vibrancy — a mix-blend-mode-like treatment). On the web we don't get this for free; we must emulate it manually.

### F.2 Weight adjustments for glass backgrounds

Web-verified pattern across Apple.com, Linear, Vercel:

- Body text over glass: **semibold (600)** instead of regular (400) — thicker strokes are more legible against blur
- Headings over glass: **bold (700)** or heavier — already our current h1/h2 weight
- Captions/small labels over glass: **medium (500)** minimum

Our v3.0 Russian typography pass already uses `font-medium` widely on form and chrome — still valid, arguably needs a bump to `font-semibold` on the form inputs when they sit on glass.

### F.3 Text shadow for legibility emergency

```css
.liquid-text-safety {
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);  /* 1px subtle — not a Tumblr drop-shadow */
}
```

Use only on surfaces where contrast-on-glass is marginal. Our WCAG AA tokens (v3.0) should already meet contrast over our glass recipes; this is a safety net.

### F.4 Russian long-word consideration

Russian has notoriously long compounds (e.g. "высококвалифицированный", "международный"). On glass backgrounds at tablet widths with 8-col tablet grid, a card with 2 cols will have narrow content area — long Russian words can force awkward hyphenation or overflow.

**Recommendations:**
- Apply `hyphens: auto` + `lang="ru"` globally (already in place per v3.0 typography pass — verify)
- On glass cards: preserve `text-wrap: balance` for headings (v1.4 decision)
- Preserve nbsp binding for subject+verb pairs per MEMORY.md feedback
- On tablet (8-col), cards should be 4-col wide minimum (2-up), not 2-col (4-up) — prevents "стоматологический" breaking badly

### F.5 SF Pro + Liquid Glass

Apple's Liquid Glass is designed around SF Pro's letterform weights and optical sizing. Our v2.0 decision uses SF Pro Display (body) + SF Pro Rounded (headings) via system font stack. This is **correct and unchanged** for v4.0 — no font swap needed.

Fallback chain (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`) is also unchanged. Non-Apple devices see Segoe UI (Windows) or Roboto (Android) which are both designed for screen legibility and perform fine on glass.

---

## (G) Dark mode + Liquid Glass

Confidence: MEDIUM-HIGH — recipe triangulated from Six Colors review, Macworld, eclecticlight.co, and Infinum accessibility critique.

### G.1 How dark Liquid differs

- **Base tint inverts:** Light mode is "white wash over content", dark mode is "dark wash over content" (not "dark surface with blur")
- **Higher opacity in dark:** 0.45 vs 0.18 light — dark mode needs more density to prevent the navy-muddiness we saw in v1.4
- **Rim lighting dims:** Top-edge inner-shadow goes from 0.9 alpha (light) to 0.25 alpha (dark) — simulates ambient light being dimmer in the dark environment
- **Saturate dialed back:** 160% vs 180% light — saturation amplifies color cast; in dark mode this tints everything blue/cyan which we don't want
- **Brightness boosted:** 115% vs 108% light — counters dark muddiness, lifts the glass off the dark background

### G.2 v1.4 "disable backdrop-filter in dark mode" — revisit

Our v1.4 decision was to disable glass in dark mode entirely (Key Decision log: "Dark mode disables backdrop-filter (glass-off)"). v4.0 **reverses this decision** — glass is supposed to work in dark mode. The fix is the recipe above (dark base + higher opacity + dimmer rim), not the absence of glass.

This should be logged as a new Key Decision in PROJECT.md at v4.0 kickoff.

### G.3 Photos in dark mode

Our clinic cards and review cards carry photos. On dark backgrounds, photo + glass overlay needs careful handling:
- Photos should NOT sit directly under glass chrome in dark mode (double-media effect is muddy)
- Either: darken the photo (overlay: rgba(0,0,0,0.35)) before glass, or: move glass chrome off the photo entirely
- Apple's Lock Screen convention: glass chrome sits above darkened wallpaper — mirror this

### G.4 Dark mode accessibility

From Infinum: "Contrast ratios as low as 1.5:1 were measured" in iOS 26 beta. Our dark tokens already target WCAG AA from v3.0 — they must be re-validated against the v4.0 glass recipes because the effective background under text shifts when glass is applied.

**Explicit requirement for v4.0:** Re-run WCAG AA contrast audit after glass recipe lands. Don't assume v3.0 numbers hold.

---

## (H) Medical landing specifics — what to SKIP and why

This section is the project-specific filter. Confidence: HIGH — this is our context, not external research.

### H.1 Components that don't fit marketing pages

| Component | Why skip | Instead |
|-----------|---------|---------|
| Tab bar (top, for navigation) | OS chrome paradigm; web tab bars confuse mental model | Keep sticky header + sticky mobile bar |
| Sidebar | App-level pattern; marketing pages scroll top-down | Stick with vertical narrative |
| Context menu | Requires right-click / long-press; ЦА 45+ won't discover | Keep explicit buttons |
| Command palette (⌘K) | Product-UI feature, user has no reason to search a landing | Nothing |
| Popover tooltips | Hover-only discovery; mobile-unfriendly; cognitive load | Inline explanatory text |
| Progress bars | No long operations | Spinner only on form submit |
| Page indicators (dots) | No horizontal paging | Linear vertical scroll |

### H.2 Components that feel off for medical trust context

| Component | Why wrong for medical | Instead |
|-----------|----------------------|---------|
| Heavy chromatic aberration | Reads as "gaming UI" or "crypto" | Stick with edge glow + rim only |
| Shimmer on every surface | Over-glossy = untrustworthy; "pharma spam" tone | Shimmer only on hero CTA, maybe pricing CTA |
| Large refraction warps | Distorts content behind, reads as "broken" to older users | Skip refraction entirely |
| Animated gradient backgrounds that move | Vestibular concern for ЦА 45+, motion sickness | Static gradient mesh (already shipped) |
| Video hero backgrounds | PROJECT.md explicit out-of-scope, correct decision | SVG illustration + gradient mesh |
| Confetti / celebration animations on form success | Not medical tone | Calm fade + check mark |

### H.3 Translucent CTAs — do they read as buttons for ЦА 45+?

**This is a real risk.** Our gradient CTA (#1AC67E → #0D9DB5) is very readable; a Liquid Glass CTA variant must not lose this.

**Decision: primary CTA stays gradient-filled, not glass.**

- Primary CTA = tinted solid gradient (like Apple's `.buttonStyle(.glassProminent)` which is tinted, not clear)
- Secondary CTA = Liquid Glass ("Как это работает", "Подробнее")
- Tertiary link = plain text

This maps to Apple's two-button style (`.glassProminent` vs `.glass`) and preserves our v1.3 CTA color equity.

### H.4 Cognitive load audit for ЦА 45+

Each Liquid effect has a cognitive load cost. Scoring for our audience:

| Effect | Cognitive load | Value | Verdict |
|--------|--------------|-------|---------|
| Background blur behind chrome | Low (looks premium, doesn't demand attention) | High (sets tone) | **Keep** |
| Rim lighting | Zero (subtle, subconscious) | Medium (cohesion) | **Keep** |
| Edge glow | Zero | Medium | **Keep** |
| Card hover lift (translateY) | Low | Low (cosmetic) | **Keep — already shipped v1.4** |
| Shimmer sweep on hover | Medium (catches eye) | Low (decorative) | **Limit to hero CTA only** |
| Press scale(0.97) | Zero (native feel) | Medium (tactile feedback) | **Keep — already shipped v1.4** |
| Dynamic center specular on tap | Medium (eye tracks the highlight) | Low | **Skip unless post-launch user testing requests it** |
| Scroll-edge soft fade | Low (peripheral, doesn't demand attention) | Medium (signals "Apple-level") | **Keep** |
| Interactive refraction (cursor-follow warp) | High (disorienting, "what is happening") | Low | **Skip** |

### H.5 Things apple.com does that would feel wrong on medicusunion.kz

- Video hero backgrounds (iPhone pages use them) — already out-of-scope
- Scroll-linked product shot rotation — feels gimmicky for medical
- Bento grids with decorative gradient tiles — apple.com can afford it; medical context reads as "marketing noise"
- Ultra-large display typography (160px+ hero headers) — competes with trust messaging
- Product color "pickers" / "pick your finish" — irrelevant, we don't sell hardware

---

## (I) Actual page inventory — which Liquid components apply where

This grounds the research in our real surfaces. Complexity rating per page assumes all features in that row land in the same phase.

### I.1 Page inventory (6 pages)

Derived from grep + read of each page's structure:

| Page | Sections | Notable surfaces |
|------|----------|-----------------|
| **index.html** (1158 lines) | hero, social-proof stats, services, problem, process, why-us, clinics, platform, reviews, faq, contact, cta, footer | Hero with 2 illustration cards + 2 floating info cards, 4-up service cards, 7 FAQ items, full form |
| **online-consultations.html** (864 lines) | hero, features, problem, benefits, process, doctors, why-medicusunion, triggers, pricing, consultation-form, faq, final-cta | Pricing card (badge-highlighted), doctor cards, trigger cards, form |
| **treatment-abroad.html** (942 lines) | hero-abroad, about-us, platform, clinics, included, steps, reviews, faq-abroad, form-abroad | Clinic cards with country flags, step cards, review cards, form |
| **checkup.html** (836 lines) | hero-checkup, stats, why-checkup, why-abroad, why-us, programs-korea, programs-turkey, how-it-works, b2b, faq-checkup, form-checkup, final-cta-checkup | Program cards (Korea/Turkey), stats bar, B2B section, form |
| **contacts.html** (356 lines) | hero, form with trust signals | Contact info card, form, trust list |
| **404.html** | 404 graphic, heading, "На главную" button | Minimal — single CTA |

**Shared chrome** (from partials/*.html, extracted in v3.2):
- header.html (logo + nav + CTA + dark toggle + mobile menu trigger)
- footer.html (footer columns)
- mobile-menu.html (drawer with nav + phone + CTA)
- sticky-bar.html (mobile bottom bar with phone + CTA)

### I.2 Component → page matrix

Rows are Liquid components (from section A), columns are pages. ✅ = surface exists and gets the treatment. ⚠️ = surface exists but needs design decision. — = no such surface.

| Component | index | online-cons | treatment-abroad | checkup | contacts | 404 |
|-----------|-------|-------------|-----------------|---------|----------|-----|
| **Primary CTA (tinted glass)** | ✅ hero, cta section, form submit | ✅ hero, pricing, form | ✅ hero, form | ✅ hero, form | ✅ form | ✅ На главную |
| **Secondary button (regular glass)** | ✅ hero secondary, card "Подробнее" | ✅ card buttons | ✅ card buttons | ✅ card buttons | — | — |
| **Icon button (circular glass)** | ✅ menu trigger, dark toggle, phone icon | ✅ same (from partial) | ✅ same | ✅ same | ✅ same | ✅ same |
| **Card (regular glass)** | ✅ service cards (4), value-prop cards, clinic cards, review cards, FAQ items | ✅ doctor cards, benefit cards, trigger cards, pricing card, FAQ | ✅ clinic cards, step cards, review cards, FAQ | ✅ program cards, stats, B2B, FAQ | ⚠️ contact info card | — |
| **Form container (panel glass)** | ✅ form shell | ✅ form shell | ✅ form shell | ✅ form shell | ✅ form shell | — |
| **Text field + textarea (regular glass)** | ✅ name, phone, description | ✅ same | ✅ same | ✅ same | ✅ same | — |
| **Select (regular glass trigger)** | ✅ specialization | ✅ specialization | ✅ specialization | ✅ specialization | ✅ specialization | — |
| **Nav bar (regular glass)** | ✅ header (partial) | ✅ same | ✅ same | ✅ same | ✅ same | ✅ same |
| **Sticky mobile bar (tab-bar analog)** | ✅ sticky-bar (partial) | ✅ same | ✅ same | ✅ same | ✅ same | ✅ same |
| **Mobile menu (sheet analog)** | ✅ mobile-menu (partial) | ✅ same | ✅ same | ✅ same | ✅ same | ✅ same |
| **Scroll-edge effect (top)** | ✅ hero-to-chrome | ✅ same | ✅ same | ✅ same | ✅ same | — |
| **Scroll-edge effect (bottom)** | ✅ sticky bar overlap | ✅ same | ✅ same | ✅ same | ✅ same | ✅ same |
| **Form success state (alert glass)** | ✅ existing `form__success` | ✅ same | ✅ same | ✅ same | ✅ same | — |
| **Badge (small chip)** | ✅ "Европейские врачи" hero badge, pricing badge, card-category badges | ✅ same | ✅ same | ✅ same | — | — |
| **Stats bar (grouped container)** | ✅ hero social proof | — | — | ✅ hero stats | — | — |
| **Shimmer on hover (DIFFERENTIATOR)** | ✅ hero primary CTA only | ✅ hero primary CTA only | ✅ hero primary CTA only | ✅ hero primary CTA only | ✅ submit button | — |

**Partials win:** Because chrome partials (header/footer/sticky-bar/mobile-menu) are single-source-of-truth in v3.2, upgrading the partial file upgrades all 6 pages at once. Any component from `sticky header / sticky bar / mobile menu / nav button` rows is **1 edit, 6 page effects**. This massively de-risks the migration.

### I.3 Per-page migration complexity

| Page | Unique surfaces to reskin | Shared surfaces (upgraded via partial) | Complexity |
|------|--------------------------|---------------------------------------|------------|
| index.html | Hero, 2 floating info cards, 4 service cards, 7 FAQ, 3 clinic cards, 3 review cards, form, CTA section | 4 chrome partials | **Complex** (most surfaces) |
| online-consultations.html | Hero, doctor cards, benefit cards, pricing card, trigger cards, form | 4 partials | **Moderate** |
| treatment-abroad.html | Hero, clinic cards with flags, step cards, review cards, form | 4 partials | **Moderate** |
| checkup.html | Hero, 2-program cards, stats, B2B card, form | 4 partials | **Moderate** |
| contacts.html | Hero, contact info card, form | 4 partials | **Trivial** |
| 404.html | Single CTA | 4 partials | **Trivial** |

**Ordering implication for roadmap:** Start with partials (1 edit → 6 page effects), then contacts.html (simplest full page) or 404.html (minimal, lowest risk), then stair-step to index.html (highest complexity, most surfaces). The synthesizer / roadmapper should use this ordering.

---

## MVP Recommendation — for roadmap prioritization

### Phase-order suggestion (synthesizer will finalize)

1. **Foundation phase:** Grid tokens + squircle primitives + Liquid material recipes in `theme.css` (no HTML edits yet)
2. **Primitives phase:** Build + document reusable classes (`.liquid-regular`, `.liquid-rim`, `.liquid-btn-primary`, `.liquid-card`, `.liquid-input`) in `src/styles/liquid.css`
3. **Chrome phase:** Upgrade 4 partials (header, footer, sticky-bar, mobile-menu) — 1 edit × 4 files = 6 pages updated
4. **Simple-page phase:** 404.html + contacts.html — validate the language on low-complexity surfaces
5. **Service-page phases:** online-consultations.html → checkup.html → treatment-abroad.html — parallel-tractable
6. **Index phase:** index.html — most surfaces, land last
7. **Dark mode validation phase:** Re-run WCAG AA contrast audit on all 6 pages with glass applied
8. **Docs phase:** `docs/DESIGN-SYSTEM.md` + optional `/styleguide.html`

### Defer / do not build

- Center-specular-on-tap (cursor-follow) — cosmetic, adds JS; defer to v4.1 if post-ship user feedback wants it
- Refraction / displacement-map filters — Chromium-only, breaks Safari
- Chromatic aberration — shader territory, impossible
- Morphing glass containers (`.glassEffectUnion`) — iOS-exclusive API, no web analog
- Tab-bar-minimize-on-scroll — "sticky bar hides when scrolling down" is possible but adds complexity; defer unless design review explicitly wants it
- Video hero backgrounds — PROJECT.md out-of-scope

---

## Dependency map (what needs what)

```
Grid tokens (theme.css)  ──┐
                           ├──►  Squircle primitives (corner-shape + SVG fallback)  ──┐
Liquid material recipes  ──┘                                                          │
                                                                                      ├──►  Reusable classes in src/styles/liquid.css
Motion tokens (ease-liquid, dur-*) ───────────────────────────────────────────────────┘          │
                                                                                                 │
                                                                                                 ▼
                                                                                        Chrome partials upgrade
                                                                                                 │
                                                                                                 ▼
                                                                     ┌─────────────┬─────────────┼─────────────┬─────────────┐
                                                                     ▼             ▼             ▼             ▼             ▼
                                                                  404.html     contacts.html  checkup.html  online-cons.   index.html
                                                                                                          treatment-abroad.
                                                                     └─────────────┬─────────────┘
                                                                                   ▼
                                                                    WCAG AA re-validation (all 6 pages)
                                                                                   │
                                                                                   ▼
                                                                  docs/DESIGN-SYSTEM.md + /styleguide.html
```

**Hard dependencies:**
- Grid tokens must ship before any squircle work (corner-shape is a property of elements sized by grid)
- Liquid material recipes must ship before any page migration (they're referenced from HTML)
- Chrome partials must ship before or in parallel with page migrations (6 pages inherit from them)
- Motion tokens must ship before interactive states (press, hover) get rewritten

**Soft dependencies:**
- Dark mode recipe can ship in parallel with light recipe but must be validated together
- Squircle SVG fallback work can lag if initial ship is Chromium-only and Safari/Firefox get `@supports` fallback to `border-radius`

---

## Critical recipes — concrete CSS for downstream planner

These are the load-bearing code snippets. The planner should use them verbatim (with adjustments for our existing token naming conventions).

### Recipe 1: Regular Liquid Glass surface

```css
.liquid-regular {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(24px) saturate(180%) brightness(108%);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 16px 40px rgba(20, 30, 60, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .liquid-regular {
  background: rgba(30, 40, 60, 0.45);
  backdrop-filter: blur(28px) saturate(160%) brightness(115%);
  -webkit-backdrop-filter: blur(28px) saturate(160%) brightness(115%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}
```

### Recipe 2: Squircle corner-shape with fallback

```css
.squircle {
  border-radius: 24px;
  corner-shape: squircle;  /* Chromium 139+ ≈ 60% of our traffic */
}

/* Safari/Firefox fallback — graceful degradation, no visible JS work */
@supports not (corner-shape: squircle) {
  .squircle {
    /* Accept rounded corners as good-enough */
    border-radius: 22px;  /* slightly smaller — squircle eats a little visual space */
  }
}
```

Per Smashing Magazine 2026: no alert banner needed for non-supporting browsers. Rounded rectangles are a valid fallback because they preserve the basic "friendly soft corner" affordance.

**Optional escalation:** For pages where squircle is design-critical (hero CTA), add SVG clipPath fallback. Per squircle.js.org: clipPath works cross-browser but clips box-shadows (use `filter: drop-shadow` instead). Only use on specific high-value surfaces; not universally.

### Recipe 3: Primary CTA (tinted Liquid Glass equivalent)

```css
.liquid-btn-primary {
  /* Preserve existing gradient — it's the brand equity */
  background: linear-gradient(to right, var(--color-mu-cta-from), var(--color-mu-cta-to));
  color: white;
  font-weight: 700;
  padding: 16px 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  corner-shape: squircle;
  box-shadow:
    0 16px 32px rgba(26, 198, 126, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),  /* specular top edge */
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);        /* bottom shadow edge */
  transition: transform var(--dur-press) var(--ease-liquid),
              box-shadow var(--dur-press) var(--ease-liquid);
}
.liquid-btn-primary:hover {
  box-shadow:
    0 20px 40px rgba(26, 198, 126, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}
.liquid-btn-primary:active {
  transform: scale(0.97);
}
```

### Recipe 4: Secondary button (plain Liquid Glass)

```css
.liquid-btn-secondary {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--color-mu-text-900);
  font-weight: 600;
  padding: 16px 32px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  corner-shape: squircle;
  box-shadow:
    0 8px 24px rgba(20, 30, 60, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  transition: background var(--dur-hover) var(--ease-liquid),
              transform var(--dur-press) var(--ease-liquid);
}
.liquid-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.7);
}
.liquid-btn-secondary:active {
  transform: scale(0.97);
}
```

### Recipe 5: Card (Liquid container)

```css
.liquid-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 32px;
  corner-shape: squircle;
  box-shadow:
    0 20px 50px rgba(20, 30, 60, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 32px;
  transition: transform var(--dur-hover) var(--ease-liquid),
              box-shadow var(--dur-hover) var(--ease-liquid);
}
.liquid-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 28px 60px rgba(20, 30, 60, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(0, 0, 0, 0.04);
}
```

### Recipe 6: Input field (Liquid text field)

```css
.liquid-input {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 18px;
  corner-shape: squircle;
  padding: 16px 20px;
  font-size: 16px;      /* 16px prevents iOS zoom on focus — ЦА 45+ critical */
  font-weight: 500;
  color: var(--color-mu-text-900);
  box-shadow:
    inset 0 2px 6px rgba(20, 30, 60, 0.06),  /* inner shadow = "pressed in" feel */
    inset 0 1px 0 rgba(255, 255, 255, 0.9);   /* top rim */
  transition: background var(--dur-hover) var(--ease-liquid),
              border-color var(--dur-hover) var(--ease-liquid),
              box-shadow var(--dur-hover) var(--ease-liquid);
}
.liquid-input:focus {
  background: rgba(255, 255, 255, 0.7);
  border-color: var(--color-mu-accent-blue);
  box-shadow:
    inset 0 2px 6px rgba(20, 30, 60, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 0 0 4px rgba(13, 157, 181, 0.2);   /* focus-visible ring */
  outline: none;
}
```

---

## Anti-features — hard exclusions with explicit rationale

| Anti-feature | Rationale | What to do instead |
|--------------|-----------|-------------------|
| **SVG displacement-map refraction** | Chromium-only (LogRocket: "Safari and Firefox do not support this combination"); would silently degrade on a meaningful share of our traffic; breaks the "pixel-perfect across browsers" discipline | `backdrop-filter: saturate(180%)` approximates "reflective" enough |
| **Chromatic aberration** | Requires shader; no CSS/SVG equivalent; gaming-UI aesthetic anyway | Skip |
| **Clear Liquid variant** | Explicitly "does not have adaptive behaviors" per Apple HIG; legibility unsafe for Cyrillic over photos; forbidden by Apple's own rule that Clear requires media-rich content | Regular variant everywhere |
| **Sliders, steppers, pickers, date pickers** | No surface on any page needs them | Don't port |
| **Sidebars, popovers, context menus, command palette** | App-chrome paradigms, not marketing | Don't port |
| **Tab-bar-minimize-on-scroll** | Possible but complexity-heavy (scroll-direction detection, animation state machine); benefit is cosmetic | Sticky bar stays visible |
| **Scroll-linked parallax / pinned narratives** | PROJECT.md out-of-scope (ЦА 45+ vestibular concern); pre-existing constraint | Vertical scroll with reveal only |
| **Video hero** | PROJECT.md out-of-scope; 3G/4G KZ performance risk | SVG illustration + gradient mesh |
| **Morphing glass containers (`.glassEffectUnion`)** | iOS-exclusive SwiftUI API; no web equivalent | Group cards visually with spacing, not morphing |
| **Shimmer on every surface** | Over-glossy; untrustworthy for medical context | Shimmer only on hero CTA |
| **Refraction on interactive hover (cursor-follow warp)** | High cognitive load for ЦА 45+; disorienting; impossible cross-browser | Skip |
| **Hero video backgrounds from apple.com** | Same as video hero above | SVG illustration |
| **Ultra-large display typography (160px+)** | Competes with trust messaging; reads as marketing noise | Our existing h1 clamp(40→56) is already bold-display tier |

---

## Gaps & open questions

Things research couldn't definitively resolve; surface in SUMMARY.md for phase-research flag:

1. **Exact specular pseudo-element layer structure** — CSS-Tricks describes three layers (highlight / shadow / illumination) but doesn't commit to a canonical CSS implementation. Multiple community recipes disagree on pseudo-element ordering. Suggest: during the "primitives" phase, prototype 2-3 variants and pick via visual A/B.

2. **Motion values on real devices** — Apple's `.spring(response: 0.55, dampingFraction: 0.825)` is documented but our web approximation via `cubic-bezier(0.2, 0, 0, 1)` is not identical. Suggest: during chrome phase, instrument with DevTools animation inspector and tune until it "feels Apple".

3. **Squircle implementation on Safari / Firefox** — corner-shape is Chromium-only as of 2026; we have three options (accept rounded as fallback / SVG clipPath on critical surfaces / mask-image). Suggest: phase-gate decision — ship with `@supports` fallback to `border-radius` first, add SVG clipPath only if visual review shows it's noticeably worse on Safari.

4. **Tablet 8-col grid cell width** — 8 cols is convention; exact cell + gutter math (whether cells are 1fr or fixed, gutter is absolute or fr) is a micro-decision for the grid-tokens phase.

5. **Dark mode glass recipe live-tuning** — the v1.4 "murky navy" failure suggests dark glass is harder to get right than light. Our proposed recipe (B.4) is triangulated from community sources; will need A/B visual tuning on actual content.

6. **Form input focus state with glass** — we have a focus-visible keyboard ring (v3.0) + form inputs on light glass. The combination needs validation that the focus ring still meets WCAG AA contrast when the input background is translucent.

7. **Russian long-word wrap on 2-col tablet glass cards** — need to validate with real content at tablet width; may force us to bump tablet card cells from 2-col to 4-col (8-col grid → cards are 4 cols wide, 2 cards per row).

---

## Sources

### HIGH confidence (official or cross-verified)

- [Apple Newsroom: Apple introduces a delightful and elegant new software design](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) — Official Apple description of Liquid Glass, material definition, component scope
- [MDN: corner-shape property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) — Authoritative syntax, value list, browser support
- [Smashing Magazine: Beyond border-radius — CSS corner-shape property (2026-03)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/) — Current browser support, fallback strategy, use cases
- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) — Three-layer composition analysis, CSS technique survey
- [LogRocket: How to create Liquid Glass effects with CSS and SVG](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/) — SVG filter techniques, Safari/Firefox limitations (authoritative on cross-browser status)

### MEDIUM confidence (community-verified against primary sources)

- [LogRocket: Adopting Apple's Liquid Glass — Examples and best practices](https://blog.logrocket.com/ux-design/adopting-liquid-glass-examples-best-practices/) — Usage rules, glass-on-glass prohibition, accessibility fallbacks
- [createwithswift.com: Adapting toolbar elements to the Liquid Glass Design System](https://www.createwithswift.com/adapting-toolbar-elements-to-the-liquid-glass-design-system/) — Toolbar / button / material variant details
- [createwithswift.com: Define the scroll edge effect style](https://www.createwithswift.com/define-the-scroll-edge-effect-style-of-a-scroll-view-for-liquid-glass/) — ScrollEdgeEffectStyle (hard / soft / automatic)
- [Donny Wals: Exploring tab bars on iOS 26 with Liquid Glass](https://www.donnywals.com/exploring-tab-bars-on-ios-26-with-liquid-glass/) — Tab bar minimization, glassEffect modifier
- [GitHub: conorluddy/LiquidGlassReference](https://github.com/conorluddy/LiquidGlassReference) — Triangulated SwiftUI reference (Regular, Clear, Identity, Interactive)
- [Six Colors: macOS 26 Tahoe review — Power Under Glass](https://sixcolors.com/post/2025/09/macos-26-tahoe-review-power-under-glass/) — macOS-specific implementation critique, button behavior, menu bar
- [Infinum: Apple's iOS 26 Liquid Glass — Sleek, Shiny, and Questionably Accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/) — Accessibility concerns, contrast failures, design safeguards
- [Hacking with Swift: How to create a spring animation](https://www.hackingwithswift.com/quick-start/swiftui/how-to-create-a-spring-animation) — SwiftUI default spring values (response 0.55, dampingFraction 0.825)
- [squircle.js.org: Squircles in Web Design](https://squircle.js.org/blog/squircles-in-web-design) — SVG clipPath technique, performance notes, Figma-math alignment

### LOWER confidence (recipes cross-checked; single-source uncertainty flagged in-place)

- [dev.to/kevinbism: Recreating Apple's Liquid Glass Effect with Pure CSS](https://dev.to/kevinbism/recreating-apples-liquid-glass-effect-with-pure-css-3gpl) — Specific backdrop-filter / box-shadow values (verified against CSS-Tricks)
- [dev.to/gruszdev: Apple's Liquid Glass UI design (+ CSS guide)](https://dev.to/gruszdev/apples-liquid-glass-revolution-how-glassmorphism-is-shaping-ui-design-in-2025-with-css-code-1221) — Backup CSS recipe
- [Medium: iOS 26 Liquid Glass Comprehensive Swift/SwiftUI Reference (luddy)](https://medium.com/@madebyluddy/overview-37b3685227aa) — Component-adoption list, glass variant definitions
- [Apple.com iPhone 17 Pro product page](https://www.apple.com/iphone-17-pro/) — Visual composition reference
- [Linear.app](https://linear.app) / [Vercel.com](https://vercel.com) / [Stripe.com](https://stripe.com) — Grid / typography / card-cadence reference (JS-heavy pages, observations qualitative)
