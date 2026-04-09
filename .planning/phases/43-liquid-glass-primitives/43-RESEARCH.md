# Phase 43: Liquid Glass Primitives - Research

**Researched:** 2026-04-09
**Domain:** CSS Liquid Glass materials, SVG refraction filters, differentiator animations (shimmer, grouped stats, scroll-edge fade)
**Confidence:** HIGH

## Summary

Phase 43 creates the complete Liquid Glass material system as reusable CSS classes in `src/styles/liquid-glass.css` and a small JS refraction probe. All Phase 41 foundation tokens are already in `theme.css` (verified: `--liquid-bg`, `--liquid-blur-*`, `--liquid-saturate`, `--liquid-brightness`, rim shadow tokens, motion tokens, dark-mode overrides under `.dark`). Phase 42's `squircles.css` establishes the exact file pattern to follow -- utility classes, no `@layer` declaration, progressive enhancement via `@supports`.

The phase produces CSS-only primitives. No HTML pages are modified. The three differentiator effects (shimmer sweep, grouped stats backdrop, scroll-edge fade) are delivered as classes ready to be applied in Phases 44-47.

**Primary recommendation:** Follow the ARCHITECTURE.md D.6 concrete file outline for `liquid-glass.css`, consuming Phase 41 tokens via `var()` references. Gate the refraction SVG filter behind a ~10 LOC JS probe setting `html[data-refract]`. Add `@media print` and extend `@media (prefers-reduced-motion: reduce)` within the same file.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Glass Material -- Regular Variant (LIQUID-01): backdrop-filter: blur(24px) saturate(180%) brightness(108%), tint rgba(255,255,255,0.18), asymmetric rim lighting, single .liquid-regular class, no Clear variant
- Dark Mode Glass (LIQUID-02): .dark recipe rgba(30,40,60,0.45), blur 28px, saturate 160%, brightness 115%, reversed rim
- Primary CTA (LIQUID-03): Keeps gradient fill, adds specular edge, NOT clear glass
- Secondary/Tertiary Buttons (LIQUID-04): .liquid-regular glass, font-semibold, hover brightening, press scale(0.97), .btn-glass class
- Refraction Effect (LIQUID-05): SVG feTurbulence + feDisplacementMap, Chrome 139+ via JS probe, html[data-refract]
- Print Stylesheet (LIQUID-06): @media print glass as opaque white + 1px border
- Reduced Motion (LIQUID-07): @media prefers-reduced-motion: reduce disables shimmer/spring, keeps static glass
- Shimmer Sweep DIFF-01: Hero primary CTA only, max 1 per viewport, CSS @keyframes, reduced-motion disabled
- Grouped Stats Backdrop DIFF-02: 4 stat cards in single liquid glass surface
- Scroll-Edge Fade DIFF-03: CSS mask-image gradient fade, utility class

### Claude's Discretion
- Exact CSS class names beyond .liquid-regular (e.g., .liquid-cta, .btn-glass, .shimmer-sweep, .stats-glass, .scroll-fade)
- CSS file structure (single liquid-glass.css or split)
- Refraction JS probe implementation details
- Shimmer animation timing/easing
- Whether to use CSS custom properties for animation params
- Grouped stats: single background element vs CSS container approach

### Deferred Ideas (OUT OF SCOPE)
- Tinted glass variants (green, blue) -- deferred to v4.1+
- Scroll-linked header blur progression
- Cursor-follow specular highlight
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LIQUID-01 | Glass surfaces use Regular material (backdrop-filter + tint + rim lighting) | FEATURES B.3 recipe verified, theme.css tokens confirmed present, ARCHITECTURE D.6 file outline provides concrete CSS |
| LIQUID-02 | Dark mode shows glass with tuned dark recipe | theme.css .dark block already has overridden --liquid-* tokens; liquid-glass.css classes auto-inherit dark values via var() |
| LIQUID-03 | Primary CTA keeps gradient fill with specular edge | ARCHITECTURE D.6 .liquid-btn-primary recipe; gradient from --mu-cta-from/--mu-cta-to; specular via inset shadows |
| LIQUID-04 | Secondary/tertiary buttons use Regular glass | ARCHITECTURE D.6 .liquid-btn-secondary recipe; btn-glass utility for shared button glass pattern |
| LIQUID-05 | Chrome 139+ see refraction via JS probe + html[data-refract] | STACK.md Layer 4 SVG filter code; MDN confirms backdrop-filter: url() is Chrome-only; JS probe pattern documented |
| LIQUID-06 | Print stylesheet renders glass as opaque | PITFALLS M3 provides exact @media print block; no existing print styles in project (verified by grep) |
| LIQUID-07 | Reduced-motion disables shimmer/spring | theme.css already has global reduced-motion guard; liquid-glass.css adds shimmer::before display:none + blur downgrade to 8px |
| DIFF-01 | Shimmer sweep on hero CTA hover | FEATURES C.2 provides exact CSS; PITFALLS M7 constrains to hero-only; reduced-motion guard required |
| DIFF-02 | Grouped stats backdrop | FEATURES A.2 grouped container pattern; single .stats-glass class wrapping 4 stat cards |
| DIFF-03 | Scroll-edge fade | FEATURES A.3 scroll-edge effect; CSS mask-image linear-gradient technique verified via web search |
</phase_requirements>

## Standard Stack

### Core

No new libraries or dependencies. This phase is pure CSS + ~10 lines vanilla JS.

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| CSS Custom Properties (var()) | Baseline | Token consumption from theme.css | All --liquid-* tokens declared in Phase 41; glass classes reference via var() for automatic dark-mode cascade |
| CSS backdrop-filter | Baseline since 2022 | Glass blur + saturate + brightness | Universal browser support (Chrome, Safari, Firefox); core of Liquid Glass material |
| CSS mask-image + linear-gradient | Baseline | Scroll-edge fade effect | Cross-browser gradient masking for DIFF-03 |
| SVG feTurbulence + feDisplacementMap | Inline SVG filter | Refraction distortion | Chrome-only via backdrop-filter: url(); Safari/Firefox get blur-only fallback |
| Vanilla JS (ES5 IIFE) | Current | Refraction probe | ~10 LOC, sets html[data-refract] attribute |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG filter for refraction | CSS Houdini paint worklet | Chromium-only, disabled on `<a>` elements, Safari zero support -- rejected |
| Pure CSS shimmer (@keyframes) | Motion 12.x spring animation | Motion overkill for a simple translateX sweep; CSS is simpler and zero-JS |
| mask-image for scroll-edge fade | JavaScript scroll-linked opacity | CSS mask-image is GPU-composited, no JS overhead, Baseline support |

## Architecture Patterns

### File Structure (single new CSS file + JS addition)

```
src/styles/
  tailwind.css          -- import chain (add liquid-glass.css after squircles.css)
  theme.css             -- Phase 41 tokens (already present, no edits this phase)
  squircles.css         -- Phase 42 primitives (pattern to follow)
  liquid-glass.css      -- NEW: all glass material classes
js/
  main.js               -- ADD: refraction probe function (~10 LOC)
```

### Import Order in tailwind.css (verified from current file)

```css
@import './fonts.css';
@import 'tailwindcss' source(none);
@source '../../*.html';
@import './theme.css';
@import './squircles.css';    /* Phase 42: squircle primitives */
@import './liquid-glass.css'; /* Phase 43: liquid glass primitives -- NEW */
```

[VERIFIED: src/styles/tailwind.css current content] -- squircles.css is already imported; liquid-glass.css slots after it per ARCHITECTURE.md A.1 ordering rationale.

### Pattern 1: Glass Material Class (.liquid-regular)

**What:** Single class applying the complete Regular glass recipe using Phase 41 tokens.
**When to use:** Any surface that should appear as translucent glass.

```css
/* Source: FEATURES.md B.3 + ARCHITECTURE.md D.6 */
.liquid-regular {
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  border-top: 1px solid var(--liquid-border-top);
  border-bottom: 1px solid var(--liquid-border-bottom);
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom);
}
```

Dark mode is automatic -- `.dark` cascade in theme.css overrides all `--liquid-*` variables. No explicit dark selectors needed in liquid-glass.css. [VERIFIED: theme.css lines 174-186 contain .dark overrides for all liquid tokens]

### Pattern 2: Shadow-Wrap Idiom (from Phase 42)

**What:** Outer wrapper carries box-shadow; inner element carries mask + glass. Required because mask-image clips box-shadow.
**When to use:** Any glass card or button that needs outer shadow AND squircle mask.

```html
<!-- Source: squircles.css file header comment -->
<div class="liquid-card-wrap">              <!-- outer: shadow -->
  <article class="squircle-lg liquid-card"> <!-- inner: mask + glass -->
    <!-- content -->
  </article>
</div>
```

```css
.liquid-card-wrap {
  box-shadow: var(--liquid-shadow-outer);
}
```

[VERIFIED: squircles.css lines 21-31 document this pattern with code examples]

### Pattern 3: Refraction Progressive Enhancement

**What:** JS probe detects Chrome support for `backdrop-filter: url()`, sets HTML attribute; CSS selectors gate refraction.
**When to use:** Applied once at page load; CSS classes respond to the attribute.

```js
/* Source: STACK.md lines 202-210, 257 */
(function() {
  'use strict';
  // Probe: CSS.supports for backdrop-filter with SVG url() reference
  // Only Chromium browsers support this as of 2026
  if (typeof CSS !== 'undefined' && CSS.supports &&
      CSS.supports('backdrop-filter', 'url(#test) blur(1px)')) {
    document.documentElement.setAttribute('data-refract', 'true');
  }
})();
```

```css
/* Gate refraction to Chrome-only via attribute set by JS probe */
html[data-refract="true"] .liquid-regular {
  backdrop-filter: url(#liquid-refract) blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
  -webkit-backdrop-filter: url(#liquid-refract) blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
}
```

[VERIFIED: MDN browser-compat-data issue #24110 confirms SVG filters not supported in Firefox or Safari backdrop-filter] [CITED: https://github.com/mdn/browser-compat-data/issues/24110]

### Pattern 4: Shimmer Sweep (DIFF-01)

**What:** CSS-only hover animation on hero CTA -- gradient sweep via ::before pseudo-element.
**When to use:** Hero primary CTA only. Max 1 per viewport.

```css
/* Source: FEATURES.md C.2 */
.shimmer-sweep {
  position: relative;
  overflow: hidden;
}
.shimmer-sweep::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
  pointer-events: none;
}
.shimmer-sweep:hover::before {
  transform: translateX(100%);
}
@media (prefers-reduced-motion: reduce) {
  .shimmer-sweep::before { display: none; }
}
```

### Pattern 5: Scroll-Edge Fade (DIFF-03)

**What:** CSS mask-image gradient creating soft fade at content/chrome overlap.
**When to use:** Top of main content (where header overlaps) and bottom (where sticky bar overlaps).

```css
/* Source: web search + FEATURES.md A.3 */
.scroll-fade-top {
  mask-image: linear-gradient(to bottom, transparent 0%, black 80px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px);
}
.scroll-fade-bottom {
  mask-image: linear-gradient(to top, transparent 0%, black 80px);
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 80px);
}
```

[VERIFIED: mask-image with linear-gradient is Baseline -- MDN confirms universal support] [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image]

### Pattern 6: Grouped Stats Backdrop (DIFF-02)

**What:** Single glass surface behind multiple stat cards, creating a unified group.
**When to use:** Stats bars on index.html and checkup.html (4 stat cards).

```css
.stats-glass {
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-lg)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-lg)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  border-top: 1px solid var(--liquid-border-top);
  border-bottom: 1px solid var(--liquid-border-bottom);
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom);
  padding: 1.5rem;
}
```

Uses `--liquid-blur-lg` (40px) instead of `--liquid-blur-md` (24px) because it is a large surface grouping multiple elements. Dark mode automatic via token cascade.

### Anti-Patterns to Avoid

- **NEVER apply `will-change: backdrop-filter` to static glass cards.** Creates compositor layers that multiply GPU cost. Only on elements that will actually animate (header on scroll, buttons on hover). [VERIFIED: REQUIREMENTS.md Out of Scope explicitly lists this]
- **NEVER nest glass inside glass.** Doubled compositor cost, z-index chaos. REQUIREMENTS.md Out of Scope. [VERIFIED: REQUIREMENTS.md Out of Scope]
- **NEVER apply shimmer to anything other than hero CTA.** Max 1 per viewport. [VERIFIED: DIFF-01 requirement + PITFALLS M7]
- **NEVER use `border` on glass elements with squircle mask.** Borders are clipped by mask-image. Use `box-shadow: inset 0 0 0 1px <color>` instead. [VERIFIED: squircles.css anti-patterns comment]
- **NEVER use box-shadow AND mask-image on the same element.** Use shadow-wrap pattern. [VERIFIED: squircles.css lines 44-49]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glass material recipe | Individual backdrop-filter per element | .liquid-regular class consuming --liquid-* tokens | Token cascade gives automatic dark-mode, consistent recipe across all surfaces |
| Refraction detection | Complex UA string parsing | CSS.supports('backdrop-filter', 'url(#test) blur(1px)') probe | Feature detection is robust; UA parsing is fragile and breaks on updates |
| Shimmer animation | JS-driven animation on hover | CSS ::before + transition: transform | Pure CSS is simpler, respects reduced-motion, no JS overhead |
| Print glass fallback | Per-element print overrides | Single @media print block with !important | One block covers all glass surfaces; maintainable |
| Scroll-edge fade | JS scroll-linked opacity | CSS mask-image: linear-gradient() | GPU-composited, zero JS, Baseline support |

## Common Pitfalls

### Pitfall 1: Stacking Context Cascade Breaks (PITFALLS H3)
**What goes wrong:** backdrop-filter creates a new stacking context. Overlays (form success, mobile menu) may appear behind elements that should be below them.
**Why it happens:** z-index becomes local to the stacking context, not global.
**How to avoid:** Document stacking context map in this phase. Avoid nested backdrop-filter. Form success overlay must escape parent stacking context.
**Warning signs:** Form success overlay appears behind form fields; mobile menu behind header.

### Pitfall 2: WCAG AA Contrast Over Glass (PITFALLS H4)
**What goes wrong:** Text contrast drops below 4.5:1 over non-uniform backgrounds (mesh-bg, photos).
**Why it happens:** Automated checkers measure declared background, not effective background through glass.
**How to avoid:** Use --mu-text-900 on glass surfaces (not --mu-text-500). Font-semibold (600) for body text on glass. Pre-check contrast on varied backgrounds.
**Warning signs:** Text on glass looks washed out; pixel-sampling tools report < 4.5:1.

### Pitfall 3: Dark-Mode "Murky Navy Smear" (PITFALLS H5)
**What goes wrong:** v1.4 disabled glass in dark mode because blur on #0F1923 looked muddy. v4.0 re-enables it.
**Why it happens:** Wrong base tint or insufficient brightness/saturate tuning on dark backgrounds.
**How to avoid:** Phase 41 tokens use tuned dark recipe (rgba(30,40,60,0.45), blur 28px, saturate 160%, brightness 115%). Build test fixture to verify visually on varied dark backgrounds.
**Warning signs:** Glass surfaces look grey/muddy in dark mode instead of translucent.

### Pitfall 4: Shimmer Vestibular Trigger (PITFALLS M7)
**What goes wrong:** Shimmer animation triggers vestibular discomfort in 45+ users.
**Why it happens:** Moving gradient at 800ms creates flashing effect if applied to multiple surfaces.
**How to avoid:** Constrain to hero CTA only (max 1 per viewport). Reduced-motion guard disables shimmer entirely. Document usage limit.
**Warning signs:** liquid-shimmer/shimmer-sweep class on non-hero elements.

### Pitfall 5: Print Shows Blank Rectangles (PITFALLS M3)
**What goes wrong:** backdrop-filter and mask-image render unreliably in print.
**Why it happens:** No @media print rules exist in the project (verified by grep).
**How to avoid:** Add @media print block that sets glass surfaces to opaque white + 1px border, disables mask-image and backdrop-filter.
**Warning signs:** Print preview shows blank/grey boxes where glass surfaces should be.

### Pitfall 6: ::before Pseudo-Element Collision
**What goes wrong:** Shimmer uses ::before on CTA buttons; existing or future pseudo-elements conflict.
**Why it happens:** An element can only have one ::before and one ::after.
**How to avoid:** Audit existing ::before usage on CTA elements. The shimmer class (.shimmer-sweep) requires the element to not have its own ::before. If conflict exists, use ::after for shimmer instead. Currently theme.css only uses ::before/::after in the global reduced-motion wildcard selector -- no conflicts. [VERIFIED: grep of src/styles/ shows only theme.css:408-409 uses ::before/::after]
**Warning signs:** Shimmer overrides another visual pseudo-element on the same button.

## Code Examples

### Complete liquid-glass.css File Structure

```css
/*
 * src/styles/liquid-glass.css
 *
 * Liquid Glass material recipes for MedicusUnion KZ v4.0.
 *
 * Single-variant: Regular only (Clear is anti-feature for medical ЦА 45+).
 * Tokens declared in: theme.css :root and .dark cascade.
 * Companion: squircles.css (shape primitives).
 *
 * Dark mode: automatic via --liquid-* token cascade in theme.css .dark block.
 * No explicit .dark selectors in this file.
 *
 * Pattern: squircles.css (same structure -- utility classes, no @layer).
 */

/* === Base material === */
.liquid-regular { /* ... backdrop-filter recipe ... */ }

/* === Card === */
.liquid-card { /* extends .liquid-regular via composition in HTML */ }
.liquid-card-wrap { /* outer shadow wrapper */ }

/* === Buttons === */
.liquid-btn-primary { /* gradient CTA with specular edge */ }
.liquid-btn-secondary { /* glass secondary with hover brightening */ }

/* === Grouped stats backdrop (DIFF-02) === */
.stats-glass { /* large-surface glass for stat card grouping */ }

/* === Shimmer sweep (DIFF-01) === */
.shimmer-sweep { /* hero CTA only, max 1 per viewport */ }

/* === Scroll-edge fade (DIFF-03) === */
.scroll-fade-top { /* mask-image gradient fade at top */ }
.scroll-fade-bottom { /* mask-image gradient fade at bottom */ }

/* === Refraction (Chrome-only PE) === */
html[data-refract="true"] .liquid-regular,
html[data-refract="true"] .liquid-btn-primary { /* ... url(#liquid-refract) ... */ }

/* === Print === */
@media print { /* glass as opaque + border */ }

/* === Reduced-motion === */
@media (prefers-reduced-motion: reduce) { /* shimmer off, blur downgrade to 8px */ }
```

### Refraction JS Probe (for js/main.js)

```js
/* Source: STACK.md line 257 */
/**
 * Refraction Probe
 * Detects Chrome/Edge support for backdrop-filter: url(#svg-filter)
 * Sets html[data-refract="true"] when supported.
 * ~10 LOC, no dependencies.
 */
function initRefractionProbe() {
  if (typeof CSS !== 'undefined' && CSS.supports &&
      CSS.supports('backdrop-filter', 'url(#test) blur(1px)')) {
    document.documentElement.setAttribute('data-refract', 'true');
  }
}
```

This function should be added to the `initAll()` chain in main.js and to `window.MU` for SPA router access.

### Print Stylesheet Block

```css
/* Source: PITFALLS.md M3 */
@media print {
  .liquid-regular,
  .liquid-card,
  .liquid-btn-primary,
  .liquid-btn-secondary,
  .stats-glass {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: white !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
  .shimmer-sweep::before {
    display: none !important;
  }
  .scroll-fade-top,
  .scroll-fade-bottom {
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
}
```

### Reduced-Motion Block

```css
/* Source: ARCHITECTURE.md D.6 lines 652-661 */
@media (prefers-reduced-motion: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-btn-secondary,
  .stats-glass {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .shimmer-sweep::before {
    display: none;
  }
}
```

Note: the global reduced-motion guard in theme.css (lines 406-422) already zeroes all animation-duration and transition-duration via `*`, `*::before`, `*::after` selectors. The liquid-glass.css block adds glass-specific downgrade (blur to 8px) and explicit shimmer removal.

## Class Inventory (Recommended Names)

| Class | Purpose | Requirement |
|-------|---------|-------------|
| `.liquid-regular` | Base glass material (backdrop-filter + tint + rim) | LIQUID-01 |
| `.liquid-card` | Glass card surface (extends .liquid-regular via composition + padding) | LIQUID-01 |
| `.liquid-card-wrap` | Outer shadow wrapper for glass cards with squircle mask | LIQUID-01 |
| `.liquid-btn-primary` | Gradient CTA with specular edge treatment | LIQUID-03 |
| `.liquid-btn-secondary` | Glass secondary button with hover/press states | LIQUID-04 |
| `.stats-glass` | Grouped stats backdrop (large surface, blur-lg) | DIFF-02 |
| `.shimmer-sweep` | Hover shimmer animation (hero CTA only) | DIFF-01 |
| `.scroll-fade-top` | Mask-image fade at top edge | DIFF-03 |
| `.scroll-fade-bottom` | Mask-image fade at bottom edge | DIFF-03 |

## State of the Art

| Old Approach (v1.4) | Current Approach (v4.0) | When Changed | Impact |
|---------------------|------------------------|--------------|--------|
| Max 2 glass surfaces, blur <= 12px | Relaxed GPU budget, blur 24-60px | v4.0 kickoff decision | All surfaces can be glass; richer visual |
| Dark mode disables glass (glass-off) | Tuned dark recipe re-enables glass | v4.0 FEATURES B.4 | Dark mode gets real translucency |
| Per-element backdrop-filter inline | Tokenized via --liquid-* vars + .liquid-regular class | Phase 41 tokens + Phase 43 classes | Consistent, dark-mode-responsive, maintainable |
| No refraction | SVG filter refraction for Chrome 139+ | v4.0 STACK Layer 4 | Progressive enhancement for Chromium users |
| No print consideration | @media print opaque fallback | Phase 43 LIQUID-06 | Clean print output for 45+ audience |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | CSS.supports('backdrop-filter', 'url(#test) blur(1px)') returns true only in Chromium browsers | Architecture Pattern 3 | Refraction could apply on browsers that don't render it correctly; fallback to UA check |
| A2 | Dark recipe values (rgba(30,40,60,0.45), blur 28px, saturate 160%, brightness 115%) will look good on actual content | Common Pitfalls 3 | Visual tuning needed; values are from FEATURES research triangulation, not tested on live pages |
| A3 | Shimmer 800ms transition timing feels right for hover interaction | Pattern 4 | Timing may need tuning; 600-1000ms range is reasonable |

## Open Questions

1. **Shimmer: transition vs @keyframes?**
   - What we know: FEATURES C.2 uses `transition: transform 0.8s ease` on hover. CONTEXT.md mentions `@keyframes sweep`.
   - What's unclear: Whether to use transition (simpler, hover-only) or @keyframes (more control, could auto-play).
   - Recommendation: Use transition approach (hover-trigger only). @keyframes would loop/auto-play which violates "max 1 per viewport" constraint. FEATURES C.2 transition approach is correct.

2. **Scroll-fade intensity (80px or configurable)?**
   - What we know: Scroll-edge fade needs to match header height (~64-80px) and sticky bar height.
   - What's unclear: Exact pixel values for fade gradient.
   - Recommendation: Use CSS custom properties (`--scroll-fade-size: 80px`) so later phases can tune to match chrome heights. Keep in liquid-glass.css, not theme.css (implementation detail).

3. **Stacking context documentation format?**
   - What we know: PITFALLS H3 requires documenting the stacking context map.
   - What's unclear: Where to document it (comment in CSS, separate doc, or defer to Phase 44).
   - Recommendation: Add as a comment block at the top of liquid-glass.css noting that backdrop-filter creates stacking contexts. Detailed per-page audit deferred to Phases 44-47 when classes are applied to actual HTML.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified). This phase is pure CSS + vanilla JS additions to existing files. The Tailwind CLI standalone binary (already installed) compiles the new CSS. No new tools, services, or runtimes needed.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual browser inspection (no automated test framework for CSS visual output) |
| Config file | none |
| Quick run command | `make build && open index.html` (compile CSS, visual inspect) |
| Full suite command | Manual: open each page in Chrome + Safari, light + dark mode, check glass rendering |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LIQUID-01 | .liquid-regular class applies glass recipe | smoke | `grep -c 'liquid-regular' src/styles/liquid-glass.css` -- class exists | Wave 0 |
| LIQUID-02 | Dark mode glass uses tuned recipe | manual | Open page with .dark class, inspect computed backdrop-filter | N/A |
| LIQUID-03 | Primary CTA retains gradient, has specular edge | manual | Inspect .liquid-btn-primary computed styles | N/A |
| LIQUID-04 | Secondary button uses glass + hover/press | manual | Hover/click .liquid-btn-secondary, verify brightening + scale | N/A |
| LIQUID-05 | Chrome sees refraction effect | smoke | `grep -c 'data-refract' js/main.js src/styles/liquid-glass.css` -- probe + CSS rule exist | Wave 0 |
| LIQUID-06 | Print renders glass as opaque | smoke | `grep -c '@media print' src/styles/liquid-glass.css` -- block exists | Wave 0 |
| LIQUID-07 | Reduced-motion disables shimmer, keeps static glass | smoke | `grep -c 'prefers-reduced-motion' src/styles/liquid-glass.css` -- block exists | Wave 0 |
| DIFF-01 | Shimmer sweep class exists with reduced-motion guard | smoke | `grep -c 'shimmer-sweep' src/styles/liquid-glass.css` | Wave 0 |
| DIFF-02 | Grouped stats glass class exists | smoke | `grep -c 'stats-glass' src/styles/liquid-glass.css` | Wave 0 |
| DIFF-03 | Scroll-edge fade classes exist | smoke | `grep -c 'scroll-fade' src/styles/liquid-glass.css` | Wave 0 |

### Sampling Rate
- **Per task commit:** `make build` (CSS compiles without error)
- **Per wave merge:** Visual inspection of glass classes in browser DevTools
- **Phase gate:** All 10 requirement IDs have corresponding classes in liquid-glass.css; CSS compiles; grep checks pass

### Wave 0 Gaps
- None -- no automated test framework needed for this CSS primitives phase. Verification is structural (grep for class names) and visual (browser inspection deferred to Phases 44-47 when classes are applied to HTML).

## Security Domain

No security-relevant ASVS categories apply to this phase. It is a pure CSS/JS visual primitives phase with no authentication, session management, data handling, or cryptography. The refraction JS probe reads only `CSS.supports()` and sets a DOM attribute -- no user data, no network calls, no storage.

## Project Constraints (from CLAUDE.md)

- **Stack**: HTML + Tailwind CSS v4 + JS -- no Node.js runtime. Tailwind CLI standalone binary only. [VERIFIED: no new deps in this phase]
- **Zero-framework JS**: Vanilla ES6+ IIFE pattern. No Alpine.js, no npm packages. [VERIFIED: refraction probe is ~10 LOC vanilla JS]
- **Design source**: Redesign/ folder is visual reference. [N/A: this phase creates primitives, not page layouts]
- **Language**: Russian only. [N/A: no text content in CSS primitives]
- **Animations**: Motion standalone CDN for scroll-reveal; CSS for shimmer. [VERIFIED: shimmer is pure CSS, no Motion needed]
- **Reduced motion**: Must extend existing guard, never remove. [VERIFIED: theme.css lines 406-422 preserved]
- **Tone**: Calm, confident, medical. [Guides shimmer restraint -- hero CTA only]
- **GSD Workflow**: All changes through GSD commands. [Followed]

## Sources

### Primary (HIGH confidence)
- `src/styles/theme.css` -- Phase 41 tokens verified present (lines 115-136 light, 174-186 dark)
- `src/styles/squircles.css` -- Phase 42 pattern verified (file structure, @supports, shadow-wrap)
- `src/styles/tailwind.css` -- Import chain verified (line 5: squircles.css already imported)
- `.planning/research/FEATURES.md` B.3, B.4, C.1, C.2 -- Glass recipes, shimmer CSS
- `.planning/research/ARCHITECTURE.md` D.6 -- Concrete liquid-glass.css file outline
- `.planning/research/PITFALLS.md` H3, H4, H5, M3, M7 -- Phase 3-specific pitfalls

### Secondary (MEDIUM confidence)
- [MDN browser-compat-data issue #24110](https://github.com/mdn/browser-compat-data/issues/24110) -- SVG filters not supported in Firefox/Safari backdrop-filter
- [MDN mask-image docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image) -- Baseline support for mask-image with linear-gradient
- [PQINA: Fade out overflow using CSS mask-image](https://pqina.nl/blog/fade-out-overflow-using-css-mask-image/) -- Scroll-edge fade implementation pattern

### Tertiary (LOW confidence)
- `.planning/research/STACK.md` line 257 -- JS probe uses CSS.supports which may have false positive edge cases in non-Chromium browsers [flagged as A1 in Assumptions Log]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- pure CSS + vanilla JS, no new dependencies, all tokens verified present
- Architecture: HIGH -- ARCHITECTURE.md D.6 provides concrete file outline; squircles.css establishes proven pattern
- Pitfalls: HIGH -- PITFALLS.md comprehensively catalogues Phase 3-specific risks with mitigations
- Differentiator effects: MEDIUM -- shimmer and scroll-fade are well-documented CSS patterns; grouped stats is straightforward but exact styling needs visual tuning

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- pure CSS techniques, no fast-moving dependencies)
