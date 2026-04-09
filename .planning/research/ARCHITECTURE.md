# Architecture Patterns: v1.4 Visual Redesign Integration

**Domain:** Visual enhancement integration into existing vanilla CSS single-file architecture
**Researched:** 2026-03-24
**Milestone:** v1.4 — Dark mode, glassmorphism, bold typography, micro-animations

---

## Context: What We Are Working With

The existing codebase is a single-file architecture that is fully operational:

- `css/styles.css` — ~1,640 lines, 11 numbered sections, CSS custom properties at `:root`
- `index.html` — ~762 lines, single page, `<html lang="ru" class="no-js">`
- `js/main.js` — ~488 lines, IIFE pattern, ES5 syntax, IntersectionObserver for scroll animations

Key existing patterns that constrain integration:

1. All color references are already CSS tokens (`--color-*`, `--gradient-cta`, etc.)
2. Animation states use `.is-visible` / `.is-open` class toggles, not inline styles
3. JS uses `document.documentElement.classList` for the `no-js` toggle — the same mechanism dark mode will use
4. `prefers-reduced-motion` is already handled at the CSS level (section 10 of styles.css)
5. Section backgrounds alternate between `--color-white` (#ffffff) and `--color-light` (#F8FAFB) with one dark section (`.section--dark` using `--color-dark` #18212C)

---

## Question 1: Dark Mode Token Architecture

### The Strategy: `data-theme` Attribute on `<html>`

Do NOT use `@media (prefers-color-scheme: dark)` as the primary mechanism. The v1.4 requirement is a **user toggle** (stored in localStorage), not a system-automatic toggle. The correct pattern:

```
<html lang="ru" data-theme="light">    <!-- default -->
<html lang="ru" data-theme="dark">     <!-- after user toggle -->
```

**How to extend `:root` tokens without refactoring everything:**

Step 1 — Add dark-mode overrides as a second token block, scoped to `[data-theme="dark"]`. The existing `:root` block stays completely unchanged.

```css
/* In styles.css, immediately AFTER the existing :root block — insert new block */

[data-theme="dark"] {
  /* Backgrounds */
  --color-white:          #0F1923;   /* page background */
  --color-light:          #1A2533;   /* alternating section background */
  --color-dark:           #E8F4FF;   /* inverted: was dark text, now light */

  /* Text */
  --color-text-primary:   #E0ECF8;
  --color-text-on-dark:   #18212C;   /* inverted: text on "dark" (now light) sections */
  --color-text-muted:     rgba(224, 236, 248, 0.55);

  /* Interactive */
  --color-primary:        #5FD5F9;   /* brighter cyan for dark bg contrast */
  --color-primary-dark:   #38C6F4;   /* restore original as "dark variant" on dark bg */
  --color-secondary:      #3FCF88;
  --color-secondary-dark: #1AC67E;

  /* CTA remains gradient — works on both themes */
  /* --gradient-cta: unchanged */

  /* Badges */
  --color-badge-bg:       #0D3324;
  --color-badge-text:     #3FCF88;

  /* Shadows (less visible on dark bg — use glow instead) */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md:  0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg:  0 4px 20px rgba(0, 0, 0, 0.5);

  /* Glass surface tokens (new, dark mode only) */
  --glass-bg:             rgba(255, 255, 255, 0.06);
  --glass-border:         rgba(255, 255, 255, 0.12);
  --glass-blur:           blur(12px);
}
```

**Why this works without refactoring:** Every existing CSS rule that references `var(--color-white)`, `var(--color-text-primary)`, etc. automatically gets the dark value when `data-theme="dark"` is on `<html>`. Zero existing rules need to change.

**Light mode glass tokens (also add to `:root`):**

```css
:root {
  /* ... existing tokens ... */

  /* Glass surface tokens (light mode) */
  --glass-bg:             rgba(255, 255, 255, 0.65);
  --glass-border:         rgba(255, 255, 255, 0.9);
  --glass-blur:           blur(12px);
}
```

**Theme color meta tag:** Update to use JS — on dark mode activation, set:
```html
<meta name="theme-color" content="#0F1923">
```

### System Preference Respect (bonus — no extra code)

Add this at the END of the `[data-theme="dark"]` block:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* same token overrides as [data-theme="dark"] */
  }
}
```

This means: if no explicit choice has been made yet, follow the OS. Once the user clicks the toggle (localStorage sets `data-theme`), the explicit attribute wins.

### What NOT to do

- Do NOT use CSS variables with `-light` / `-dark` suffixes (e.g., `--color-white-dark`). This requires touching every existing rule.
- Do NOT use a `.dark` class on `<body>`. The `data-theme` attribute on `<html>` covers the full cascade including `<body>` default styles.
- Do NOT try to scope dark mode per-section. The token cascade handles it globally.

---

## Question 2: Glassmorphism — Where to Apply It

### Browser Support Note

`backdrop-filter: blur()` is supported in Chrome 76+, Firefox 70+, Safari 9+ (with `-webkit-` prefix). **Confidence: HIGH** (well-established by 2026). Must add `-webkit-backdrop-filter` alongside `backdrop-filter`. Always provide a solid fallback background for browsers that don't support it.

### Sections That Benefit Most

Glassmorphism only creates visual depth when there is something behind the glass element to blur. In the current page:

| Component | Current Background Behind | Glass Viable? | Priority |
|-----------|--------------------------|---------------|----------|
| `.pricing__card` | `.pricing` section (white/light) | Low contrast | MEDIUM — add gradient to section first |
| `.site-header` (scrolled) | Page content scrolling behind | YES | HIGH — header glass on scroll |
| Hero stat badges (social proof numbers) | Hero background | YES if hero gets gradient | HIGH |
| `.doctors__card` | `.doctors` section (light bg) | MEDIUM — subtle | LOW |
| `.lead-form__wrapper` | `.lead-form-section` with existing radial halo | YES | HIGH |
| FAQ items | Plain white — nothing behind | NO | Skip |
| `.final-cta` (dark section) | Gradient dark bg | YES — light glass | MEDIUM |
| Process step cards | White — nothing behind | NO unless bg changes | LOW |

**Recommended glass targets (in priority order):**

**1. Sticky header when scrolled (`.site-header.is-scrolled`)**
The `.is-scrolled` state already exists in JS. Currently adds `box-shadow`. Replace that with glass:

```css
/* MODIFY existing .site-header.is-scrolled */
.site-header.is-scrolled {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: none;  /* remove the old shadow */
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .site-header.is-scrolled {
    background: var(--color-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

**2. Pricing card**
The pricing section needs a gradient background first, then the card gets glass:

```css
/* ADD to pricing section */
.pricing {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
}

[data-theme="dark"] .pricing {
  background: linear-gradient(135deg, #0c1a2e 0%, #0f2137 50%, #0c1f18 100%);
}

/* ADD .pricing__card--glass modifier */
.pricing__card--glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}
```

**3. Lead form wrapper**
The form section already has a radial gradient halo (`.lead-form-section::before`). Glass the form wrapper:

```css
/* ADD .lead-form__wrapper--glass modifier */
.lead-form__wrapper--glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}
```

**4. Social proof stats on the hero (if hero gets gradient)**
If the hero background is changed to a gradient (part of bold typography redesign), the social proof numbers can float as glass pills.

### What NOT to glass

- FAQ items — no background content to blur, looks broken
- `.section--dark` text paragraphs — glass on text containers hurts readability for 45+ audience
- The sticky mobile bar at the bottom — always needs high contrast for CTA readability

### Glass Token Implementation Pattern

Use the `--glass-*` tokens established in `:root` and `[data-theme="dark"]`. Never hardcode `rgba(255,255,255,0.65)` directly in component rules — this breaks dark mode.

```css
/* Good */
.card--glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

/* Bad — hardcoded, breaks in dark mode */
.card--glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
}
```

---

## Question 3: Scroll-Driven Animations Alongside IntersectionObserver

### Browser Support Assessment

CSS Scroll-Driven Animations (`animation-timeline: scroll()`) — Chrome 115+, Edge 115+. **Firefox support was behind a flag until Firefox 129 (August 2024) where it shipped.** Safari support shipped in Safari 18 (September 2024). As of early 2026, baseline support is solid in modern browsers. **Confidence: MEDIUM** (confirmed in training data through mid-2025, assume stable in 2026).

The existing IntersectionObserver animations are **class-toggle based** (add `.is-visible` to trigger a CSS transition). Scroll-driven animations are **pure CSS keyframe** based. They do not conflict — they operate on different CSS properties through different mechanisms.

### How to Layer Without Conflict

**Rule 1: Don't touch existing `.animate-on-scroll` / `.is-visible` patterns.** The IntersectionObserver adds `.is-visible` which triggers a `transition`. Leave that intact. It works and has IE11-era compatibility.

**Rule 2: Use Scroll-Driven Animations only for NEW visual effects** that are additive, not replacements. Good candidates:

- Progress bar in the header (shows how far down the page you are)
- Parallax-style fade on section dividers (subtle opacity shift as you scroll past)
- Hero title scale effect that plays once as page loads and user begins scrolling

**Rule 3: Gate scroll-driven animations with `@supports`:**

```css
/* Only applies if browser supports scroll-driven animations */
@supports (animation-timeline: scroll()) {
  .scroll-progress {
    animation: grow-width linear;
    animation-timeline: scroll(root);
    animation-range: 0 100%;
  }

  @keyframes grow-width {
    from { width: 0%; }
    to { width: 100%; }
  }
}
```

**Rule 4: Respect existing `prefers-reduced-motion` — it already blanket-disables all animations.** The existing rule at section 10 of styles.css covers both transition-based AND keyframe-based animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This already handles CSS scroll-driven animations too. No change needed.

### Practical Scroll-Driven Additions for v1.4

| Effect | Mechanism | Where |
|--------|-----------|-------|
| Scroll progress bar in header | `animation-timeline: scroll(root)` on a 3px bar | Inside `.site-header` |
| Section background parallax | `animation-timeline: view()` on section `::before` pseudo-elements | Hero, social-proof |
| Counter number animation (social proof) | `animation-timeline: view()` — triggered when element enters viewport | `.social-proof__number` |

**The counter animation is particularly high-value:** The social proof section shows "200+ врачей", "15 стран", etc. Animating these numbers counting up as the section enters viewport is high-impact for ЦА 45+. The scroll-driven version is cleaner than IntersectionObserver for this because it ties the animation timing to viewport entry:

```css
@supports (animation-timeline: scroll()) {
  @keyframes count-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .social-proof__number {
    animation: count-up 0.4s ease-out both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}
```

Without `@supports`, `.social-proof__number` falls through to the existing IntersectionObserver pattern which already adds `animate-on-scroll` to section children.

### Interaction Between IntersectionObserver and Scroll-Driven Animations

No conflict exists because:
- IntersectionObserver mutates `.classList` → triggers CSS `transition`
- Scroll-driven animations are `@keyframe` based, no JS involvement
- They can both apply to the same element if needed (different properties)

The only case to watch: if IntersectionObserver adds `.is-visible` which changes `opacity: 0 → 1` via transition, AND a scroll-driven animation also animates `opacity`, the last applied wins. **Avoid targeting the same property with both mechanisms on the same element.**

---

## Question 4: Build Order (Minimum Risk Sequence)

Each step is independently deployable and does not break the step before it.

### Step 1: Dark Mode Token Infrastructure (Zero Visual Change)

**Risk: NONE — no existing styles change.**

- Add `--glass-bg`, `--glass-border`, `--glass-blur` to existing `:root` block
- Add `[data-theme="dark"] { ... }` block immediately after `:root`
- Add `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` at end
- Add `initDarkMode()` to `js/main.js` inside the existing IIFE (reads localStorage, sets `data-theme`, wires toggle button)
- Add dark mode toggle button to `index.html` (inside `.site-header__container`, after nav)

Deliverable: Fully functional dark mode toggle. All existing colors correct in both themes. No visual change in light mode.

### Step 2: Bold Typography Scale

**Risk: LOW — token changes, no structural changes.**

- Update font size tokens in `:root`: increase `--font-size-h1`, `--font-size-h2`, `--font-size-h3`
- Optionally add display heading variant: `--font-size-display: clamp(2.5rem, 5vw, 4rem)`
- Apply `--font-size-display` to `.hero__title` only (hero is the high-impact area)
- Increase font weight on headings from 700 to 800 (Manrope Variable supports 800)

Deliverable: Visually bolder hero and section headings. No structural HTML changes.

### Step 3: Glassmorphism (Header First, Then Cards)

**Risk: MEDIUM — modifies visual surface of 2-3 components.**

- **Header glass (lowest risk):** Modify `.site-header.is-scrolled` to use glass tokens. Add `@supports` fallback. Test in Firefox, Safari, Chrome.
- **Section gradient backgrounds:** Add gradient backgrounds to `.pricing` and `.lead-form-section` (the sections that will host glass cards). These sections currently have flat background colors, so this is purely additive.
- **Glass cards:** Add `.card--glass` modifier class to pricing card and form wrapper in HTML. Add CSS for the modifier. Do NOT change the base `.card` rule — glass is a modifier only.

Deliverable: Header glass effect on scroll, pricing card and form wrapper with glass surface. All other cards unchanged.

### Step 4: Micro-Animations Enhancement

**Risk: LOW — purely additive CSS, gated by `@supports`.**

- Add scroll progress bar to header (CSS only, no JS)
- Add social proof counter animation via scroll-driven API (inside `@supports` gate)
- Add hover micro-interactions: `scale(1.02)` on card hover (replace current `translateY(-2px)` — or add scale on top)
- Add `transition` on dark mode toggle (smooth color shift): add `transition: background-color 0.3s ease, color 0.3s ease` to `body`

**Important:** All scroll-driven additions go inside `@supports (animation-timeline: scroll())`. They are invisible to browsers that don't support it, and the existing IntersectionObserver animations remain the fallback.

Deliverable: Page feels noticeably more alive without any breaking changes to existing behavior.

---

## Component Boundaries for New Features

| New Feature | Where in CSS | Where in HTML | Where in JS | What to MODIFY vs ADD |
|-------------|-------------|----------------|-------------|----------------------|
| Dark mode tokens | After `:root` block | `<html data-theme>` attribute | New `initDarkMode()` in IIFE | ADD token block; MODIFY `<html>` tag |
| Glass header | Modify `.site-header.is-scrolled` | No change | No change | MODIFY existing rule |
| Glass card modifier | ADD `.card--glass` rule | ADD class to 2 elements | No change | ADD rule; MODIFY 2 HTML elements |
| Bold typography | Modify token values in `:root` | No change | No change | MODIFY token values |
| Scroll progress | ADD `.scroll-progress` in section 11 | ADD element in header | No change | ADD only |
| Scroll-driven animations | ADD inside `@supports` block in section 10 | No change | No change | ADD only |
| Dark mode toggle button | No change | ADD `<button>` in header | ADD `initDarkMode()` | ADD only |

---

## CSS File Organization for New Code

The existing `styles.css` uses numbered sections. New code for v1.4 goes:

```
Section 2 (Design Tokens)  → ADD glass tokens to :root, ADD [data-theme="dark"] block
Section 6 (Components)     → ADD .card--glass modifier
Section 7 (Sections)       → MODIFY .site-header.is-scrolled, ADD gradient to .pricing
Section 10 (Animations)    → ADD @supports block for scroll-driven animations
Section 11 (Decorative)    → ADD .scroll-progress element styles
```

Do NOT create a separate CSS file. The constraint is single-file delivery with no build step. Adding a separate `dark.css` or `glass.css` creates a sequencing problem (flash of unstyled content if the file loads late) and splits the token context.

**Size impact estimate:** Dark mode tokens ~40 lines, glass modifiers ~30 lines, animation additions ~50 lines. Total addition: ~120 lines bringing the file to ~1,760 lines. Well within maintainable range for a single-file approach.

---

## Patterns to Follow

### Pattern 1: Token Override Architecture for Themes

**What:** Define all theme variants as overrides of the same token names, not as parallel naming schemes.
**When:** Any theming feature.
**Why it works here:** All 1,640 existing lines already use `var(--color-*)`. No search-and-replace needed.

```css
:root { --color-white: #ffffff; }
[data-theme="dark"] { --color-white: #0F1923; }
/* Every rule using var(--color-white) now respects theme automatically */
```

### Pattern 2: Modifier Classes for Visual Variants (Never Change Base)

**What:** Add `.component--glass` as an opt-in modifier. Never modify the base `.card` rule to add glass.
**When:** Any time glass or visual variant applies to only some instances of a component.
**Why:** The card component is used in benefits, doctors, advantages, process steps. Only pricing and form get glass. Using a modifier keeps all other cards untouched.

### Pattern 3: `@supports` Gating for New CSS APIs

**What:** Wrap scroll-driven animations and advanced backdrop-filter effects in `@supports`.
**When:** Any CSS feature with partial browser support.
**Why:** The target audience (Kazakhstan, 45+) may be on older browsers or older Android WebViews. `@supports` provides the fallback naturally.

### Pattern 4: `initDarkMode()` Registration Pattern (JS)

**What:** Dark mode JS function reads localStorage, sets `data-theme` on `document.documentElement` before DOM paint to prevent flash.
**When:** Page load — must run before first paint.
**Why:** If `initDarkMode()` runs at DOMContentLoaded (as all other init functions do), there will be a flash of light mode. The fix: extract just the `data-theme` setter into an inline `<script>` in `<head>`, before the CSS link.

```html
<head>
  <!-- Run BEFORE CSS loads to prevent flash -->
  <script>
    (function() {
      var theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <link rel="stylesheet" href="css/styles.css">
</head>
```

The toggle button wiring and localStorage update can live in `initDarkMode()` inside the IIFE as normal. The inline script is only for the initial load state.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Creating Separate CSS Files for Dark Mode or Glass

**What goes wrong:** A `dark.css` or `glass.css` loaded via a separate `<link>` causes FOUC (flash of unstyled content) if JS toggles the class before the second stylesheet loads.
**Consequence:** User sees light mode for ~100ms before dark mode applies. Looks broken.
**Prevention:** Keep all tokens in the single `styles.css`. The inline `<script>` pattern in `<head>` prevents the flash.

### Anti-Pattern 2: Applying Glassmorphism Without Background Content

**What goes wrong:** Glass on elements that sit on a plain white background looks like a dirty semi-transparent rectangle.
**Consequence:** The visual effect is worse than a solid background, not better.
**Prevention:** Only apply glass where gradient, photo, or deep-color content exists behind the element. Add gradient backgrounds to sections first; apply glass to cards second.

### Anti-Pattern 3: Adding `transition` to `:root` Token Changes

**What goes wrong:** Adding `transition: all 0.3s` to `:root` to animate theme switches sounds appealing but creates performance issues — every CSS property on every element animates simultaneously.
**Consequence:** 1,640 lines of CSS all transition at once, causing jank especially on lower-end Android devices (ЦА 45+ may use budget phones).
**Prevention:** Add `transition: background-color 0.3s ease, color 0.3s ease` only to `body` and specific components that need smooth transitions (header, cards). Never on `:root`.

### Anti-Pattern 4: Using `animation-timeline: scroll()` for Elements That Already Have IntersectionObserver Animations

**What goes wrong:** If `.animate-on-scroll` elements get a scroll-driven animation that also controls `opacity` or `transform`, both mechanisms fire. The IntersectionObserver adds `.is-visible` (which overrides `opacity: 0 → 1`), but the scroll-driven animation may conflict by also trying to control opacity.
**Consequence:** Elements may flicker or snap to wrong state.
**Prevention:** Pick one mechanism per element. IntersectionObserver stays on existing elements. Scroll-driven animations go on NEW elements or new properties only.

### Anti-Pattern 5: ES6+ Syntax in the Dark Mode Toggle

**What goes wrong:** The existing JS uses ES5 throughout (decision logged in PROJECT.md: "ES5 syntax for JS — ЦА 45+ может использовать старые браузеры").
**Consequence:** Using `const`, arrow functions, template literals in the new `initDarkMode()` function creates inconsistency and may break on the same old browsers the rest of the code was written for.
**Prevention:** Write `initDarkMode()` in ES5. Use `var`, function declarations, string concatenation. The inline `<script>` in `<head>` must also use ES5.

---

## Confidence Assessment

| Topic | Confidence | Basis |
|-------|-----------|-------|
| `data-theme` dark mode token architecture | HIGH | Established pattern, CSS spec stable |
| `backdrop-filter` browser support | HIGH | Widely supported since 2020, confirmed through training data |
| CSS Scroll-Driven Animations browser support | MEDIUM | Chrome/Edge 115+ stable; Firefox 129 (Aug 2024) shipped; Safari 18 (Sep 2024) shipped — assumed stable in 2026 but not verified against current caniuse |
| IntersectionObserver + scroll-driven coexistence | HIGH | They operate on different mechanisms (class mutations vs pure CSS keyframes) |
| FOUC prevention with inline script | HIGH | Established pattern used by all major theming libraries |
| `@supports` gating | HIGH | CSS spec, widely supported |

---

## Sources

- MDN: CSS Custom Properties (`var()`) — token cascade behavior — HIGH confidence
- MDN: `backdrop-filter` — browser support table — HIGH confidence (as of Aug 2025)
- MDN: CSS Scroll-Driven Animations — `animation-timeline: scroll()` and `view()` — MEDIUM confidence (verify Firefox/Safari current support at caniuse.com before implementation)
- CSS-Tricks: "A Complete Guide to Dark Mode on the Web" — `data-theme` attribute pattern — HIGH confidence
- web.dev: "Building a theme switch component" — inline script FOUC prevention — HIGH confidence
- Existing codebase analysis: `css/styles.css`, `js/main.js`, `index.html` — direct inspection — HIGH confidence
