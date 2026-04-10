# Technology Stack

**Project:** MedicusUnion KZ Landing — v1.4 2025 Visual Redesign
**Researched:** 2026-03-24
**Scope:** NEW capabilities only. Existing stack (Vanilla HTML/CSS/JS, Directus, Docker) is validated and not re-researched.

---

## What This Research Covers

Four new CSS/JS capability areas needed for milestone v1.4:

1. Liquid glass / glassmorphism via `backdrop-filter`
2. Dark mode toggle with `localStorage` and CSS custom properties
3. CSS Scroll-Driven Animations API as progressive enhancement
4. CSS micro-animation patterns for hover and state transitions

**What is NOT covered:** Backend, build tools, fonts, frameworks — all unchanged from v1.3.

---

## 1. Glassmorphism: `backdrop-filter` + CSS

### Technique

```css
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg); /* already 30px */
}
```

**Why this approach:**
- `backdrop-filter: blur()` is the single CSS property that creates the glass blur effect — no JS, no canvas, no SVG filter workaround needed
- `saturate(180%)` amplifies color behind glass, making the effect richer on medical imagery backgrounds
- `-webkit-backdrop-filter` is required for Safari 9–17 (pre-2024); Safari 18+ unprefixed works but the prefix costs zero bytes and has no downside
- `rgba()` background with low alpha (0.08–0.18) is the correct "liquid glass" palette — pure transparent has no color; pure opaque loses the glass effect
- Explicit `border: 1px solid rgba(255,255,255,0.2)` is required to visually define the glass boundary without a shadow

### Browser Support (as of mid-2025)

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 76+ | Full | Unprefixed |
| Edge 79+ | Full | Unprefixed |
| Firefox 103+ | Full | Enabled by default since FF103 (2022) |
| Safari 9+ | Full (prefixed) | `-webkit-` prefix required |
| iOS Safari 9+ | Full (prefixed) | `-webkit-` prefix required |
| Samsung Internet 12+ | Full | |
| **Global coverage** | ~95%+ | MEDIUM confidence — caniuse.com not accessible for verification |

**Confidence:** MEDIUM. Training data places global support at ~95% for mid-2025. Firefox lagged historically but has supported it since 2022. The `-webkit-` prefix covers all Safari versions in production use.

### Fallback Strategy

```css
/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}
```

`@supports` is the correct gate — avoids applying transparent background when blur is unavailable (which would produce illegible text).

### Integration with Existing Token System

New tokens to add to `:root`:

```css
:root {
  /* Glass surface tokens */
  --glass-bg-light: rgba(255, 255, 255, 0.12);
  --glass-bg-medium: rgba(255, 255, 255, 0.18);
  --glass-blur: blur(16px) saturate(180%);
  --glass-border: 1px solid rgba(255, 255, 255, 0.20);

  /* Dark mode glass (inverted) */
  --glass-bg-dark: rgba(24, 33, 44, 0.45);
  --glass-border-dark: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Performance note:** `backdrop-filter` triggers GPU compositing. On a landing page with 3–4 glass cards visible at once, this is safe. Do NOT apply it to elements that animate position/transform simultaneously (GPU layer cost doubles). Cards are static — fine.

### Medical Context Constraint

For the ЦА 45+ audience, glass cards must maintain WCAG AA text contrast. Rule: glass cards with `backdrop-filter` MUST have a minimum background opacity that keeps text at 4.5:1 contrast ratio. Use `rgba(255,255,255,0.85)` minimum for white cards with dark text, or a semi-opaque dark overlay for light text on glass. Pure "trendy" glass with 10% opacity fails contrast — avoid on text-heavy cards.

---

## 2. Dark Mode: `localStorage` Toggle + CSS Custom Properties

### Pattern

**CSS side — theme via class on `<html>`:**

```css
/* Light mode (default) — already in :root */
:root {
  --color-bg: #ffffff;
  --color-surface: #F8FAFB;
  --color-text-primary: #18212C;
  --color-text-muted: rgba(24, 33, 44, 0.55);
  --color-border: rgba(0, 0, 0, 0.08);
}

/* Dark mode — override tokens on html[data-theme="dark"] */
html[data-theme="dark"] {
  --color-bg: #0D1117;
  --color-surface: #161B22;
  --color-text-primary: #E6EDF3;
  --color-text-muted: rgba(230, 237, 243, 0.55);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-white: #161B22;       /* remaps white surfaces */
  --color-light: #1C2128;       /* remaps light sections */
}
```

**Why `data-theme` attribute over CSS class:**
- `html[data-theme="dark"]` is the current standard pattern (used by MDN, GitHub, Tailwind docs)
- A class like `.dark` works equally but attribute is semantically clearer and easier to query in JS
- Avoids class name collision with any BEM classes

**JS side — IIFE pattern (compatible with existing ES5 IIFE codebase):**

```javascript
(function () {
  'use strict';

  var STORAGE_KEY = 'mu-theme';
  var html = document.documentElement;
  var btn = document.getElementById('theme-toggle');

  // Apply saved preference immediately (avoids flash)
  // This <script> block runs inline in <head>, before render
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  // Toggle handler (attached after DOM ready)
  function init() {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      btn.setAttribute('aria-label',
        next === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
```

**Why inline `<script>` in `<head>` for theme detection:**
- The `localStorage` read and `applyTheme()` call MUST happen before first paint — otherwise users with a dark preference see a white flash (FOUC). Place this 8-line block as an inline `<script>` at the end of `<head>`, before the `</head>` tag.
- This is the same pattern used by every major dark mode implementation (MDN, GitHub, Radix docs)

**`prefers-color-scheme` media query fallback:**
- If no `localStorage` value, check `window.matchMedia('(prefers-color-scheme: dark)')` to honor OS preference on first visit
- Browser support: Chrome 76+, Firefox 67+, Safari 12.1+ — essentially universal

### Integration with Existing Tokens

The existing `:root` block has color tokens but they are NOT yet abstracted for dark mode (they reference hardcoded hex values like `--color-white: #FFFFFF`). The migration path:

1. Add semantic tokens (`--color-bg`, `--color-surface`, `--color-border`) to `:root`
2. Replace hardcoded hex in section backgrounds with semantic tokens
3. Keep brand colors (`--color-primary`, `--gradient-cta`) unchanged — they work in both modes
4. Remap `--color-white` in dark mode to a dark surface (this is the key trick that makes `background: var(--color-white)` sections flip automatically)

**Transition for theme switch (no flash):**

```css
/* Applied to body ONLY after initial load to prevent FOUC */
body.theme-transitions-ready {
  transition: background-color 300ms ease, color 300ms ease;
}
```

Add `document.body.classList.add('theme-transitions-ready')` in JS after the page loads (not inline in head).

### Confidence: HIGH

This is a well-established pattern with no ambiguity. `localStorage`, `matchMedia`, and CSS custom property cascading all have near-universal browser support.

---

## 3. CSS Scroll-Driven Animations API (2025)

### What It Is

The CSS Scroll-Driven Animations API (2023 spec, Chrome 115+) replaces IntersectionObserver-based JS animations with pure CSS. It links `@keyframes` animations to scroll position instead of time.

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fade-in-up linear both;
  animation-timeline: view();          /* ties to element's visibility */
  animation-range: entry 0% entry 40%; /* plays during entry phase */
}
```

**Why this technique:**
- Pure CSS, zero JS — no `IntersectionObserver` wiring, no class toggling
- Runs on the compositor thread — smoother than JS-driven animations
- `animation-timeline: view()` fires the animation as the element enters the viewport, exactly replicating current `IntersectionObserver` behavior

### Browser Support (as of mid-2025)

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 115+ | Full | Shipped July 2023 |
| Edge 115+ | Full | Chromium-based |
| Safari 18+ | Partial | `scroll-timeline` supported; `view()` / `animation-range` partial. Safari 17 = no support |
| Firefox 110+ | Partial | `scroll-timeline` supported; `view()` behind flag until FF 128 |
| **Global coverage** | ~70–75% | MEDIUM confidence — significant Safari/Firefox gaps remain |

**This is a progressive enhancement, not a replacement.** The existing `IntersectionObserver` animations MUST remain as the baseline. Scroll-driven CSS animations layer on top for supporting browsers.

### Progressive Enhancement Pattern

```css
/* Baseline: element starts visible (works everywhere) */
.section-card {
  opacity: 1;
  transform: none;
}

/* Enhancement: animate in for browsers that support scroll-driven animations */
@supports (animation-timeline: scroll()) {
  .section-card {
    opacity: 0;
    transform: translateY(24px);
    animation: fade-in-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }
}
```

**Why `@supports` gate is required:**
- Browsers without support see `opacity: 0` elements if the animation properties are applied unconditionally — content disappears permanently
- The `@supports` block ensures elements are visible by default, enhanced only when supported

**Conflict with existing IntersectionObserver:**
- The current JS adds `.is-visible` classes via IntersectionObserver to trigger CSS transitions
- With scroll-driven animations, the same element could animate twice (IO transition + CSS scroll animation)
- Resolution: in the `@supports` block, set `transition: none` to disable IO-triggered transitions on supported browsers, letting the CSS scroll animation take over cleanly

```css
@supports (animation-timeline: scroll()) {
  .scroll-animate {
    transition: none; /* disable IO-based transitions */
    animation: fade-in-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }
}
```

### Confidence: MEDIUM

Chrome/Edge support confirmed since 2023. Firefox and Safari gaps are real and documented. The `@supports` progressive enhancement pattern is the official W3C-recommended approach for partial support scenarios.

---

## 4. CSS Micro-Animation Patterns

### Hover State Transitions

Existing codebase already uses `transition: var(--transition-fast)` / `var(--transition-normal)`. Enhance with:

**Button hover — transform + shadow lift:**

```css
.btn {
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    opacity var(--transition-fast);
  will-change: transform; /* hint browser to promote layer */
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 198, 126, 0.35);
}

.btn:active {
  transform: translateY(0);
  box-shadow: none;
  transition-duration: 80ms; /* snappy click feedback */
}
```

**Card hover — existing `translateY(-2px)` is correct, add shadow token:**

```css
.card {
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Icon color shift on parent hover:**

```css
.feature-card .icon {
  transition: color var(--transition-normal);
  color: var(--color-primary-dark);
}

.feature-card:hover .icon {
  color: var(--color-primary);
}
```

### Focus State (Accessibility — required for ЦА 45+)

```css
/* Visible focus ring for keyboard/touch navigation */
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove focus ring for mouse clicks (browsers that support :focus-visible) */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Why `:focus-visible` over `:focus`:** Shows focus ring for keyboard users (ЦА 45+ often navigates with tab), hides it for mouse users who find the ring distracting. Chrome 86+, Firefox 85+, Safari 15.4+ — ~95% support.

### Form Field Micro-Animations

```css
.form__input {
  border: 2px solid rgba(24, 33, 44, 0.15);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(56, 198, 244, 0.15);
  outline: none;
}
```

**Ring glow on focus** replaces browser default outline — more polished, still accessible.

### Accordion Animation (existing)

Current implementation uses `max-height` transition. The modern alternative is `grid-template-rows`:

```css
/* Modern accordion — no fixed max-height needed */
.faq__answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-normal);
  overflow: hidden;
}

.faq__answer--open {
  grid-template-rows: 1fr;
}

.faq__answer > div { /* inner wrapper required */
  overflow: hidden;
}
```

**Why `grid-template-rows: 0fr → 1fr`:** Animates to/from natural content height without needing a fixed `max-height` value. Works in Chrome 57+, Firefox 55+, Safari 10.1+. The existing `max-height` approach works fine — this is an optional upgrade.

### `prefers-reduced-motion` (already handled — reinforce pattern)

The existing codebase already handles `prefers-reduced-motion`. Ensure all new animations follow the same pattern:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable ALL new animations and transitions */
  .glass-card,
  .btn,
  .card,
  .section-card {
    transition: none;
    animation: none;
  }
}
```

### Confidence: HIGH

These are stable, well-documented CSS properties. `transition`, `transform`, `:focus-visible`, and `@media (prefers-reduced-motion)` all have universal or near-universal support.

---

## New Token Additions Required

Add to the existing `:root` block in `css/styles.css`:

```css
:root {
  /* === NEW in v1.4 === */

  /* Glass tokens */
  --glass-bg: rgba(255, 255, 255, 0.12);
  --glass-bg-strong: rgba(255, 255, 255, 0.75);
  --glass-blur: blur(16px) saturate(180%);
  --glass-border: 1px solid rgba(255, 255, 255, 0.20);

  /* Semantic background tokens (dark mode migration) */
  --color-bg: var(--color-white);
  --color-surface: var(--color-light);
  --color-border: rgba(0, 0, 0, 0.08);

  /* Theme transition */
  --transition-theme: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

html[data-theme="dark"] {
  --color-bg: #0D1117;
  --color-surface: #161B22;
  --color-text-primary: #E6EDF3;
  --color-text-muted: rgba(230, 237, 243, 0.55);
  --color-white: #161B22;
  --color-light: #1C2128;
  --color-border: rgba(255, 255, 255, 0.08);

  /* Glass inverted */
  --glass-bg: rgba(13, 17, 23, 0.55);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);

  /* Shadows on dark — more prominent */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.5);
}
```

---

## What NOT to Add

| Rejected | Why |
|----------|-----|
| GSAP / Anime.js | External JS library for animations — violates no-dependency constraint; CSS transitions handle all needs |
| Framer Motion | React library — irrelevant |
| CSS `@layer` for theme | Adds complexity without benefit for a single file. `html[data-theme]` attribute override is simpler |
| `color-scheme` property alone | `color-scheme: dark light` changes scrollbars/inputs but does NOT change your brand colors — must use custom property override |
| `prefers-color-scheme` media query only | Doesn't allow user toggle — must combine with JS + localStorage |
| `animation-timeline: scroll()` (not `view()`) | `scroll()` animates relative to scroll container, not element visibility — `view()` is correct for "animate on enter viewport" |
| Canvas/WebGL glass effects | Heavy, unnecessary — `backdrop-filter` achieves the same visual with 3 CSS properties |
| JS-driven scroll position detection for animations | Replaced by CSS Scroll-Driven Animations for supported browsers; IntersectionObserver already handles fallback |

---

## Browser Support Summary Table

| Feature | Chrome | Firefox | Safari | iOS Safari | Confidence |
|---------|--------|---------|--------|------------|------------|
| `backdrop-filter` | 76+ | 103+ | 9+ (-webkit-) | 9+ (-webkit-) | MEDIUM |
| CSS custom properties | 49+ | 31+ | 9.1+ | 9.3+ | HIGH |
| `localStorage` | 4+ | 3.5+ | 4+ | 3.2+ | HIGH |
| `prefers-color-scheme` | 76+ | 67+ | 12.1+ | 12.2+ | HIGH |
| `:focus-visible` | 86+ | 85+ | 15.4+ | 15.4+ | HIGH |
| Scroll-Driven Animations | 115+ | 128+ | 18+ (partial) | 18+ | MEDIUM |
| `grid-template-rows` transition | 66+ | 66+ | 12.1+ | 12.2+ | HIGH |
| `@supports` | 28+ | 22+ | 9+ | 9+ | HIGH |
| `will-change` | 36+ | 36+ | 9.1+ | 9.3+ | HIGH |

**Coverage note:** Scroll-Driven Animations are the only feature with meaningful gaps (~25% non-support). All others are effectively universal (95%+). The `@supports` progressive enhancement pattern handles the gap correctly.

---

## Integration Checklist

Before implementation, verify these touchpoints with existing code:

1. **IntersectionObserver + Scroll-Driven conflict** — `.scroll-animate` JS class toggle must be disabled in `@supports (animation-timeline: scroll())` block
2. **Glass cards require a non-white background behind them** — sections using glass must have a gradient/image background, not `background: var(--color-bg)` (blur of white = white, no visible effect)
3. **Dark mode token migration** — global replace of `background: var(--color-white)` → `background: var(--color-bg)` in section rules, otherwise dark mode only affects text color
4. **Inline `<script>` for FOUC prevention** — theme detection JS must be in `<head>`, before stylesheet link. Order: `<link rel="stylesheet">` then `<script>` inline theme block
5. **`will-change: transform`** — add only to elements that actually animate; don't apply globally (wastes GPU memory)
6. **Test on iOS Safari** — `backdrop-filter` requires `-webkit-` prefix; test on real device, not just Chrome DevTools mobile emulation

---

## Sources

- MDN Web Docs: `backdrop-filter` — https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter (training data, August 2025 cutoff)
- MDN Web Docs: CSS Scroll-Driven Animations — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations (training data)
- MDN Web Docs: `prefers-color-scheme` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme (training data)
- MDN Web Docs: `:focus-visible` — https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible (training data)
- W3C CSS Scroll-driven Animations spec — https://drafts.csswg.org/scroll-animations-1/ (training data)
- Chrome Developers: Scroll-driven Animations — https://developer.chrome.com/docs/css-ui/scroll-driven-animations (training data)

**Confidence note:** All browser support figures are from training data (knowledge cutoff August 2025). No live caniuse.com or MDN verification was possible (WebFetch/WebSearch tools unavailable in this session). Flag for verification against caniuse.com before implementation if exact percentages matter for go/no-go decisions.
