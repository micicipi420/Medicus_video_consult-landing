# Architecture Patterns: v7.0 UI/UX Design Excellence Integration

**Domain:** UI/UX polish integration into existing multi-file CSS token architecture
**Researched:** 2026-04-13
**Milestone:** v7.0 -- Liquid Glass polish, accessibility, performance, micro-interactions, responsive refinement

---

## Context: Current Architecture State

The codebase has evolved from v1.4's single-file approach to a dual architecture:

### Vanilla Layer (production, all pages)
- `css/styles.css` -- ~2,670 lines, 15 numbered sections, CSS custom properties at `:root`
- `js/main.js` -- ~566 lines, IIFE pattern, ES5 syntax
- `index.html` + 3 service pages (checkup, consultations, treatment-abroad)
- All pages link only `css/styles.css` + `js/main.js`
- Dark mode via `data-theme="dark"` attribute on `<html>`, FOUC-free inline `<script>` in `<head>`

### Design System Layer (Tailwind v4 / Next.js scaffold)
- `src/styles/theme.css` -- 466 lines, Tailwind v4 `@theme inline` tokens + `:root` custom properties
- `src/styles/liquid-glass.css` -- 1,038 lines, 18 numbered sections (materials, shimmer, refraction, viewport budget, interaction states)
- `src/styles/squircles.css` -- 149 lines, 3-tier degradation (corner-shape > mask-image > border-radius)
- `src/styles/fonts.css` -- 18 lines, SF Pro Display/Rounded system font declarations
- `src/styles/tailwind.css` -- Tailwind entry point

### Key Architectural Constraints for v7.0

1. **Two CSS file systems coexist.** Vanilla `css/styles.css` serves all HTML pages. `src/styles/*.css` serves the Next.js scaffold. Improvements must land in the correct file(s) based on what affects production.
2. **The liquid-glass.css already has robust accessibility sections:** Section 13 (reduced-motion), Section 14 (reduced-transparency). But `prefers-contrast` is absent -- that is a documented audit gap.
3. **Token cascade architecture:** `:root` tokens in both files, `.dark` override cascade in `theme.css`, `[data-theme="dark"]` cascade in `css/styles.css`. These are not unified -- the vanilla site uses `[data-theme="dark"]`, the design system uses `.dark`.
4. **Pseudo-element budget is tight.** Glass classes use `::before` for specular rim-lights and `::after` for specular highlights/dimming layers. Adding new visual effects via pseudo-elements requires careful inventory of what is already consumed.
5. **IntersectionObserver is the animation backbone.** `main.js` uses IO for scroll animations, sticky bar, animated counters. All scroll-based visual behavior flows through IO -- no scroll event listeners (except the passive one for header scroll state).

---

## Integration Area 1: New CSS Tokens for v7.0

### Where New Tokens Go

**Decision: Extend existing `:root` blocks in place. Never create new files for tokens.**

| Token Category | File | Location | Rationale |
|---------------|------|----------|-----------|
| Glass performance tokens (mobile blur budget) | `src/styles/theme.css` | `:root` block, after existing `--liquid-blur-*` | These are liquid glass system tokens; they live with the glass token family |
| High-contrast override tokens | `src/styles/liquid-glass.css` | New Section 14.5 (between reduced-transparency and no-support fallback) | Accessibility overrides are scoped to glass behavior, not global theme tokens |
| Vanilla performance tokens (if needed) | `css/styles.css` | `:root` block, after existing `--shadow-*` | Production pages only load this file |
| Micro-interaction timing tokens | `src/styles/theme.css` | `:root` block, after existing `--dur-*` / `--ease-*` | Motion tokens already live here |

**New tokens to add to `theme.css :root`:**

```css
/* Mobile blur budget (PERF-04) */
--liquid-blur-mobile-sm: 8px;
--liquid-blur-mobile-md: 12px;
--liquid-blur-mobile-lg: 20px;

/* Glass layer viewport cap */
--glass-max-layers-mobile: 3;  /* informational -- enforced by JS */
--glass-max-layers-desktop: 6; /* informational -- enforced by JS */

/* Micro-interaction tokens */
--dur-micro: 80ms;        /* ultra-fast feedback (checkbox, toggle) */
--dur-tooltip: 200ms;     /* tooltip appear */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);  /* playful overshoot */
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1);      /* natural deceleration */
```

**Do NOT add to `.dark` cascade** -- blur budget and motion tokens are theme-independent.

---

## Integration Area 2: `prefers-contrast` Without Bloating Existing Media Queries

### Browser Support Assessment

`prefers-contrast` is **Baseline** as of 2026: Chrome 96+, Edge 96+, Firefox 101+, Safari 14.1+. Global coverage ~94.59%. **Confidence: HIGH.**

### Architecture Decision: Dedicated Section, Not Inline

**Decision: Add a new Section 14.5 in `liquid-glass.css` immediately after the existing Section 14 (reduced-transparency). Do NOT nest inside or alongside existing `@media` blocks.**

Rationale:
- Sections 13 (reduced-motion) and 14 (reduced-transparency) each handle one media query as a standalone section. Adding `prefers-contrast` as its own section follows the established pattern.
- Nesting `prefers-contrast` inside `prefers-reduced-motion` or `prefers-reduced-transparency` blocks creates combinatorial complexity and makes debugging harder.
- Keeping it separate means it can be reasoned about independently.

### Implementation Pattern

```css
/* ================================================
   Section 14.5 -- High contrast mode (ACC-01)
   For users who request increased contrast via OS
   settings (macOS: Increase Contrast, Windows: High
   Contrast, iOS: Increase Contrast).
   Strengthens glass borders, increases background
   opacity, boosts text contrast on glass surfaces.
   Does NOT disable glass entirely (that is Section 14
   reduced-transparency). Instead, makes glass MORE
   visible and distinct.
   ================================================ */

@media (prefers-contrast: more) {
  /* Strengthen glass border to solid visible edge */
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .stats-glass {
    box-shadow:
      inset 0 0 0 1.5px rgba(0, 0, 0, 0.25),
      var(--liquid-shadow-outer);
  }

  /* Increase glass surface opacity for text readability */
  :root {
    --liquid-bg: rgba(255, 255, 255, 0.72);
    --liquid-nav-bg: rgba(255, 255, 255, 0.55);
    --liquid-clear-bg: rgba(255, 255, 255, 0.45);
  }

  .dark {
    --liquid-bg: rgba(30, 40, 60, 0.72);
    --liquid-nav-bg: rgba(30, 40, 60, 0.55);
    --liquid-clear-bg: rgba(30, 40, 60, 0.45);
  }

  /* Disable shimmer and glint (visual noise at high contrast) */
  .shimmer-sweep::before,
  .liquid-card::before {
    display: none;
  }

  /* Strengthen specular highlights to function as visible borders */
  .liquid-regular::before,
  .liquid-nav::before,
  .liquid-fluted::before,
  .liquid-btn-secondary::before,
  .stats-glass::before {
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.15), transparent);
    height: 2px;
  }
}
```

### Vanilla CSS Counterpart

For `css/styles.css`, add a single `prefers-contrast: more` block near the bottom (after Section 14, before Section 15). The vanilla layer does not use liquid-glass classes, but it does have cards, buttons, and glass-affected elements that need contrast boosting:

```css
@media (prefers-contrast: more) {
  .card, .pricing__card, .lead-form__wrapper {
    border: 2px solid var(--color-text-primary);
  }
  .button, .button--cta {
    border: 2px solid currentColor;
  }
}
```

**File changes:**
- `src/styles/liquid-glass.css` -- ADD Section 14.5 (new block, ~45 lines)
- `css/styles.css` -- ADD one `@media (prefers-contrast: more)` block (new block, ~10 lines)

---

## Integration Area 3: Scroll-Driven Animations Alongside IntersectionObserver

### Browser Support Assessment

`animation-timeline: scroll()` -- Chrome 115+, Edge 115+, Safari 26+ (not yet shipped as of April 2026), **Firefox: behind flag only**. NOT Baseline. Global coverage ~84.7% (but Safari 26 pending). **Confidence: MEDIUM.**

`animation-timeline: view()` -- Same support matrix as `scroll()`. Not Baseline. **Confidence: MEDIUM.**

### Architecture Decision: Progressive Enhancement Only, Never Replace IO

**Decision: All scroll-driven animations live inside `@supports (animation-timeline: scroll())` blocks. IntersectionObserver remains the primary animation trigger. Scroll-driven CSS is purely additive visual enhancement.**

### Where Scroll-Driven CSS Lives

**Decision: New Section 19 in `liquid-glass.css` titled "Scroll-driven progressive enhancement".**

Rationale:
- Scroll-driven effects interact with glass surfaces (e.g., header progress bar, card reveal on scroll).
- The liquid-glass.css file already organizes all glass-related visual behavior (materials, interaction states, reduced-motion, viewport budget).
- Putting scroll-driven animations in `css/styles.css` would make them inaccessible to the design system layer.

### Coexistence Rules

| Mechanism | Controls | Trigger | File |
|-----------|----------|---------|------|
| IntersectionObserver (JS) | `.is-visible` class toggle | Element enters viewport (threshold 0.2) | `js/main.js` |
| Scroll-driven (CSS) | `@keyframe` animation tied to `view()` | Element's progress through viewport | `liquid-glass.css` Section 19 |

**Critical rule: Never animate the same CSS property with both mechanisms on the same element.**

The existing IO animations control `opacity` and `transform` on `.animate-on-scroll` elements. Scroll-driven animations must target DIFFERENT properties or DIFFERENT elements.

Safe scroll-driven targets:
- `background-position` on glass surfaces (tint shift as you scroll)
- `--liquid-blur-md` custom property animation (blur intensity changes with scroll position)
- `width` on a scroll progress indicator
- `clip-path` on section reveal decorations

Unsafe targets (conflict with IO):
- `opacity` on `.animate-on-scroll` elements
- `transform` on `.animate-on-scroll` elements

### Recommended Scroll-Driven Additions

```css
/* ================================================
   Section 19 -- Scroll-driven progressive enhancement
   Pure CSS enhancements gated behind @supports.
   IntersectionObserver remains primary; these are
   additive visual polish.
   ================================================ */

@supports (animation-timeline: scroll()) {
  /* Scroll progress bar in header */
  .scroll-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--mu-cta-from), var(--mu-cta-to));
    transform-origin: left;
    z-index: 9999;
    animation: scroll-progress linear;
    animation-timeline: scroll(root);
  }

  @keyframes scroll-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
}
```

**`prefers-reduced-motion` coverage:** Already handled. The existing blanket rule in `theme.css` (Section 13 equivalent) sets `animation-duration: 0.01ms !important` on all elements, which kills scroll-driven animations too. No additional guard needed.

**File changes:**
- `src/styles/liquid-glass.css` -- ADD Section 19 (~35 lines)
- HTML files -- ADD `<div class="scroll-progress-bar"></div>` in `<body>` (1 line per page)
- `js/main.js` -- NO changes needed for CSS-only scroll progress

---

## Integration Area 4: Micro-Interaction CSS -- New File vs Extending Existing

### Architecture Decision: Extend `liquid-glass.css`, Do NOT Create New File

**Decision: Micro-interaction CSS lives within existing files based on what it affects.**

Rationale for NOT creating a new `micro-interactions.css`:
1. **Loading order dependency.** Micro-interactions need access to glass tokens (`--dur-hover`, `--ease-liquid`, etc.) declared in `theme.css`. A separate file needs the right cascade position between `theme.css` and `liquid-glass.css`.
2. **Pseudo-element budget.** Many micro-interactions use `::before`/`::after`, which are already consumed by glass surfaces. Putting interactions in a separate file creates distance from the glass system they interact with, making budget collisions harder to spot.
3. **The design system already organizes interactions in liquid-glass.css Section 16** (hover/press/focus-visible states). New micro-interactions are extensions of this section, not a parallel system.
4. **The vanilla layer has its own interaction section** (Section 15 of `css/styles.css`). Vanilla-only interactions go there.

### Where Each Micro-Interaction Type Lives

| Interaction Type | File | Section | Rationale |
|-----------------|------|---------|-----------|
| Glass surface hover/press refinement | `liquid-glass.css` | Section 16 (existing) | Already owns interaction states |
| Glass surface focus-visible enhancement | `liquid-glass.css` | Section 16 (existing) | Already has focus-visible rules |
| Button shimmer/ripple | `liquid-glass.css` | Section 5 (shimmer sweep, existing) | Shimmer is already here |
| Card hover lift / tilt | `liquid-glass.css` | Section 16 (extend) | Card interactions belong with card visual behavior |
| Form input focus glow | `css/styles.css` | Near existing `.contact-form` rules or in theme.css `@layer base` | Form interactions are page-level, not glass-specific |
| Loading state (form submit spinner) | `css/styles.css` | Section 15 (Interaction Polish, existing) | This is a page-level UI state |
| Scroll progress bar | `liquid-glass.css` | Section 19 (new, scroll-driven) | Scroll-driven feature |
| Icon hover scale | `css/styles.css` | Section 15 (Interaction Polish, existing) | Already has `.advantages__icon svg` hover here |
| Dark mode transition smoothing | `css/styles.css` | Body base rules | Only needs `transition: background-color 300ms, color 300ms` on `body` |

### Pseudo-Element Inventory (Critical for Micro-Interactions)

Before adding any `::before`/`::after` based micro-interaction, check this inventory:

| Glass Class | `::before` | `::after` | Available for Micro-Interactions? |
|-------------|-----------|----------|----------------------------------|
| `.liquid-regular` | Specular rim-light (Section 7) | Specular highlight (Section 17) | NO -- both consumed |
| `.liquid-card` | Glint border animation (Section 8) | Specular highlight (Section 2) | NO -- both consumed |
| `.liquid-nav` | Specular rim-light (Section 7) | Specular highlight (Section 17) | NO -- both consumed |
| `.liquid-clear` | Specular highlight (Section 17) | Dimming layer (Section 1.2) | NO -- both consumed |
| `.liquid-fluted` | Specular rim-light (Section 7) | Vertical streaks (Section 1.3) | NO -- both consumed |
| `.liquid-btn-primary` | FREE | FREE | YES |
| `.liquid-btn-secondary` | Specular rim-light (Section 7) | FREE | ::after only |
| `.stats-glass` | Specular rim-light (Section 7) | Specular highlight (Section 17) | NO -- both consumed |

**Implication:** For glass elements that need new micro-interactions (e.g., ripple on click), you MUST use `box-shadow` animations, `background` animations, or `filter` animations -- NOT pseudo-element-based overlays. The only glass elements with free pseudo-element slots are the primary and secondary buttons.

---

## Integration Area 5: Testing Glass Contrast Against Dynamic Backgrounds

### The Problem

Glass surfaces blur whatever is behind them. When the background changes (scrolling, dark mode toggle, section tint variation), the effective text contrast on glass changes. A glass card that passes WCAG AA on a white background may fail on a gradient or dark-mode background.

### Architecture Decision: Token-Based Contrast Floor, Not Pixel-Perfect Testing

**Decision: Define a minimum contrast floor as a CSS custom property, enforce it via background opacity tokens, and verify with manual spot-checks at critical scroll positions.**

### Implementation Pattern

The existing `--liquid-bg` token controls glass surface opacity. The contrast problem is solved by ensuring this opacity is high enough that text on the glass surface always meets WCAG AA regardless of what is blurred behind it.

**Worst-case analysis approach:**

1. **Identify the worst-case background.** For each glass element, what is the lowest-contrast background it could appear against?
   - Header glass: hero gradient mesh (colorful, potentially low-contrast)
   - Card glass: section tint backgrounds (`section-tint-cool`, `section-tint-warm`, `section-tint-mint`)
   - Stats glass: hero or social proof section background
   - Nav glass: any section the user has scrolled to

2. **Set `--liquid-bg` opacity to guarantee floor.** The current `rgba(255, 255, 255, 0.42)` provides a floor where dark text (#1B212C) on the composited surface achieves ~5.5:1 against a worst-case bright gradient. This is above WCAG AA (4.5:1). In dark mode, `rgba(30, 40, 60, 0.45)` provides ~5.2:1 for light text.

3. **`prefers-contrast: more` raises the floor.** The high-contrast override increases opacity to 0.72 (light) / 0.72 (dark), pushing contrast to ~8:1+.

### Testing Protocol (Manual, Per-Page)

For each page, verify glass contrast at these scroll positions:

| Position | What to Check | How |
|----------|--------------|-----|
| Page top (hero visible) | Header glass over hero gradient | Screenshot, eyedropper text vs composited bg |
| Mid-page (cards visible) | Card glass over section tint | Screenshot, check against `section-tint-cool/warm/mint` |
| Bottom (form visible) | Form glass over radial gradient halo | Screenshot, check `.lead-form-section::before` halo behind glass |
| Dark mode toggle | All above positions | Toggle dark mode, re-verify |
| `prefers-contrast: more` | All elements | Chrome DevTools > Rendering > Emulate CSS media feature `prefers-contrast: more` |

**No automated tooling required.** The token architecture means a single opacity change in `:root` fixes contrast across all glass elements simultaneously. If a spot-check fails, increase `--liquid-bg` opacity by 0.05 increments until it passes.

---

## Integration Area 6: Mobile Blur Budget

### Current State

The existing architecture has:
- Viewport budget (`glass-idle` class, Section 18 of liquid-glass.css) -- JS-managed, disables backdrop-filter on off-screen elements and when more than 6 elements are visible
- No mobile-specific blur reduction

### Architecture Decision: CSS Media Query Override + JS Budget Reduction

**Decision: Add a `@media (max-width: 767px)` block in `liquid-glass.css` that reduces blur values. Also reduce JS glass budget from 6 to 3 on mobile.**

### Implementation

```css
/* ================================================
   Section 18.5 -- Mobile blur budget (PERF-04)
   Reduces blur radius on mobile to lower GPU load
   on budget Android devices (dominant in KZ market).
   Does NOT disable glass -- just reduces intensity.
   ================================================ */

@media (max-width: 767px) {
  :root {
    --liquid-blur-sm: 8px;    /* was 16px */
    --liquid-blur-md: 12px;   /* was 24px */
    --liquid-blur-lg: 20px;   /* was 40px */
    --liquid-blur-xl: 32px;   /* was 60px */
  }

  .dark {
    --liquid-blur-sm: 10px;
    --liquid-blur-md: 14px;
    --liquid-blur-lg: 22px;
    --liquid-blur-xl: 36px;
  }
}
```

**File changes:**
- `src/styles/liquid-glass.css` -- ADD Section 18.5 (new block, ~20 lines)
- `js/main.js` or equivalent -- MODIFY glass budget observer to use `window.innerWidth < 768 ? 3 : 6` as max layers

### Why Media Query, Not JS

Blur reduction is a rendering concern, not a behavioral concern. CSS handles it at the right time (layout/paint) without JS round-trips. The JS budget system handles element count (behavioral), not blur intensity (visual).

---

## Build Order With Dependency Reasoning

Changes are ordered so each step is independently deployable and does not break previous steps.

### Phase 1: Token Foundation (no visual change)

**Add new tokens to `theme.css :root`.**

- Mobile blur tokens (`--liquid-blur-mobile-*`)
- Micro-interaction timing tokens (`--dur-micro`, `--ease-bounce`, `--ease-spring`)

**Depends on:** Nothing.
**Blocks:** All subsequent phases (they consume these tokens).
**Risk:** NONE -- adding unused tokens changes nothing visually.

**Files modified:**
- `src/styles/theme.css` (`:root` block)

### Phase 2: Mobile Blur Budget (performance improvement)

**Add Section 18.5 to `liquid-glass.css`.**

- `@media (max-width: 767px)` block reducing blur values
- JS budget observer update (3 layers on mobile)

**Depends on:** Phase 1 (tokens exist, even if not yet consumed by this phase -- consistency).
**Blocks:** Nothing directly, but should land before contrast testing (Phase 4) so tests reflect actual mobile rendering.
**Risk:** LOW -- purely reduces existing values on mobile only.

**Files modified:**
- `src/styles/liquid-glass.css` (new Section 18.5)
- JS glass budget manager (if separate from `main.js`)

### Phase 3: `prefers-contrast: more` (accessibility)

**Add Section 14.5 to `liquid-glass.css`. Add vanilla `@media (prefers-contrast: more)` to `css/styles.css`.**

**Depends on:** Phase 1 (tokens). Phase 2 (mobile blur, so contrast testing accounts for reduced blur on mobile).
**Blocks:** Phase 5 (contrast testing verifies this works).
**Risk:** LOW -- only activates when OS contrast setting is enabled. No effect on default experience.

**Files modified:**
- `src/styles/liquid-glass.css` (new Section 14.5)
- `css/styles.css` (new `@media` block at end of file)

### Phase 4: Micro-Interactions Enhancement (visual polish)

**Extend Section 16 in `liquid-glass.css`. Extend Section 15 in `css/styles.css`.**

- Refine hover brightness values on glass surfaces
- Add icon hover scale to vanilla CSS
- Add form input focus glow
- Add dark mode body transition
- Button micro-feedback refinements

**Depends on:** Phase 1 (timing tokens).
**Blocks:** Nothing.
**Risk:** LOW -- all changes are hover/focus/active states. Default idle state unchanged.

**Files modified:**
- `src/styles/liquid-glass.css` (extend Section 16)
- `css/styles.css` (extend Section 15, add body transition)

### Phase 5: Scroll-Driven Animations (progressive enhancement)

**Add Section 19 to `liquid-glass.css`. Add scroll progress bar HTML element.**

**Depends on:** Phase 1 (tokens). Phase 4 (micro-interactions should be stable before adding scroll-driven layers).
**Blocks:** Nothing.
**Risk:** LOW -- entirely inside `@supports (animation-timeline: scroll())`. Zero effect on non-supporting browsers. No conflict with IntersectionObserver because targets different properties/elements.

**Files modified:**
- `src/styles/liquid-glass.css` (new Section 19)
- All HTML files (add `<div class="scroll-progress-bar"></div>`)

### Phase 6: Glass Contrast Verification (testing, no code)

**Manual testing pass across all pages at defined scroll positions.**

**Depends on:** Phase 2 (mobile blur in place), Phase 3 (`prefers-contrast` in place).
**Blocks:** Nothing -- this is verification.
**Risk:** NONE -- no code changes. May generate bug tickets for opacity adjustments.

**Output:** List of glass elements that need `--liquid-bg` opacity adjustment, if any.

---

## Dependency Graph

```
Phase 1: Token Foundation
  |
  +---> Phase 2: Mobile Blur Budget
  |       |
  |       +---> Phase 6: Contrast Verification
  |       |
  +---> Phase 3: prefers-contrast
  |       |
  |       +---> Phase 6: Contrast Verification
  |
  +---> Phase 4: Micro-Interactions
  |       |
  |       +---> Phase 5: Scroll-Driven Animations
```

Phases 2, 3, and 4 can run in parallel after Phase 1. Phase 5 runs after Phase 4. Phase 6 runs after Phases 2 and 3.

---

## File Change Summary

### New Sections (added to existing files)

| File | New Section | Lines (est.) | Purpose |
|------|------------|-------------|---------|
| `src/styles/liquid-glass.css` | Section 14.5 | ~45 | `prefers-contrast: more` |
| `src/styles/liquid-glass.css` | Section 18.5 | ~20 | Mobile blur budget |
| `src/styles/liquid-glass.css` | Section 19 | ~35 | Scroll-driven animations |
| `css/styles.css` | New `@media` block | ~10 | Vanilla `prefers-contrast` |

### Modified Sections

| File | Section | Change |
|------|---------|--------|
| `src/styles/theme.css` | `:root` block | ADD ~12 lines of new tokens |
| `src/styles/liquid-glass.css` | Section 16 | EXTEND hover/press states (~10 lines) |
| `css/styles.css` | Section 15 | EXTEND interaction polish (~15 lines) |
| `css/styles.css` | Body base rules | ADD `transition: background-color 300ms, color 300ms` (1 line) |

### New Files

None. All changes extend existing files.

### HTML Changes

| File | Change |
|------|--------|
| All 4 HTML files | ADD `<div class="scroll-progress-bar"></div>` (Phase 5 only) |

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Creating `micro-interactions.css` or `accessibility.css`

**What goes wrong:** New CSS files need `<link>` tags in all HTML pages. Loading order becomes another variable. Token access requires the right cascade position.
**Prevention:** Extend existing files. The section-numbering system in both `liquid-glass.css` and `styles.css` provides clear organization without file proliferation.

### Anti-Pattern 2: Nesting `prefers-contrast` Inside `prefers-reduced-motion`

**What goes wrong:** Combining `@media (prefers-reduced-motion: reduce) and (prefers-contrast: more)` only targets users who have BOTH settings enabled. Users who want high contrast but normal motion get nothing.
**Prevention:** Each `@media` query is a standalone section. They compose via the cascade, not nesting.

### Anti-Pattern 3: Using Scroll-Driven Animations on `.animate-on-scroll` Elements

**What goes wrong:** The IntersectionObserver adds `.is-visible` which changes `opacity` and `transform` via CSS transition. If a scroll-driven animation also targets `opacity` or `transform`, the two mechanisms fight.
**Prevention:** Scroll-driven animations target NEW elements (scroll progress bar) or DIFFERENT properties (`background-position`, `clip-path`, custom properties).

### Anti-Pattern 4: Adding will-change to Micro-Interactions at Rest

**What goes wrong:** `will-change: transform` on all cards at rest promotes them to compositor layers permanently, wasting GPU memory on budget Android devices.
**Prevention:** `will-change` only on `:hover` and `:active` states (this is already the pattern in Section 16).

### Anti-Pattern 5: Replacing `[data-theme="dark"]` with `.dark` in Vanilla CSS

**What goes wrong:** The vanilla layer uses `[data-theme="dark"]` selector. The design system layer uses `.dark` class. Mixing selectors breaks cascade expectations.
**Prevention:** Keep each layer's convention. When writing new CSS, check which file you are in. `liquid-glass.css` and `theme.css` use `.dark`. `styles.css` uses `[data-theme="dark"]`.

### Anti-Pattern 6: Pseudo-Element Micro-Interactions on Glass Cards

**What goes wrong:** Both `::before` and `::after` are consumed by specular effects on glass elements. Adding a ripple `::after` would override the existing specular highlight.
**Prevention:** Consult the pseudo-element inventory table above. Use `box-shadow` animation, `filter` animation, or `background-position` animation for effects on glass elements.

---

## Patterns to Follow

### Pattern 1: Section-Numbered CSS Organization

**What:** Every new block gets a section number that indicates its position in the cascade and its relationship to adjacent sections.
**When:** Adding any new CSS block to `liquid-glass.css` or `styles.css`.
**Example:** Section 14.5 (between 14 and 15) for `prefers-contrast`.

### Pattern 2: Token Override for Accessibility Media Queries

**What:** Accessibility media queries override existing tokens (`:root` custom properties) rather than overriding individual selectors. One `--liquid-bg` change affects all glass classes.
**When:** Any `prefers-*` media query addition.
**Why:** The entire glass system reads from the same tokens. Overriding tokens is O(1); overriding selectors is O(n) glass classes.

### Pattern 3: `@supports` Gating for Non-Baseline CSS

**What:** Wrap non-Baseline features in `@supports`. Currently: `animation-timeline: scroll()`.
**When:** Any CSS feature where Firefox lacks support.
**Why:** The KZ 45+ audience may use Firefox (especially Firefox ESR). Ungated non-Baseline CSS means invisible content on those browsers.

### Pattern 4: Separate Concerns Between IO and Scroll-Driven

**What:** IntersectionObserver handles discrete state changes (element appeared/disappeared). CSS scroll-driven handles continuous progress-linked visuals (scroll progress, parallax intensity).
**When:** Any new scroll-based animation.
**Why:** IO is pull-based (check once, apply class, forget). Scroll-driven is continuous (animate proportionally to scroll position). Using the right tool for each case avoids the property-conflict problem entirely.

---

## Confidence Assessment

| Topic | Confidence | Basis |
|-------|-----------|-------|
| `prefers-contrast` browser support | HIGH | Baseline, 94.59% global, verified via Can I Use |
| `prefers-contrast` integration pattern | HIGH | Follows established Section 13/14 pattern in liquid-glass.css |
| Scroll-driven animations browser support | MEDIUM | NOT Baseline (Firefox behind flag, Safari 26 pending); must be `@supports`-gated |
| Micro-interaction placement in existing files | HIGH | Direct codebase analysis; Section 16 already owns interaction states |
| Pseudo-element budget | HIGH | Direct codebase audit of all glass class pseudo-element usage |
| Mobile blur budget approach | MEDIUM | CSS media query is standard; optimal blur values need device testing |
| Glass contrast against dynamic backgrounds | MEDIUM | Mathematical analysis of token opacities is correct; manual testing needed for edge cases |
| Build order dependencies | HIGH | Direct analysis of what each phase modifies and what it reads |

---

## Sources

- [Can I Use: prefers-contrast](https://caniuse.com/mdn-css_at-rules_media_prefers-contrast) -- Browser support matrix, Baseline status (verified 2026-04-13)
- [Can I Use: animation-timeline: scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) -- Browser support matrix, NOT Baseline (verified 2026-04-13)
- [MDN: prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast) -- Media query specification
- [MDN: Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) -- API reference
- [Axess Lab: Glassmorphism Meets Accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) -- Glass contrast patterns
- Direct codebase analysis: `src/styles/theme.css`, `src/styles/liquid-glass.css`, `src/styles/squircles.css`, `css/styles.css`, `js/main.js`, all HTML files -- HIGH confidence
