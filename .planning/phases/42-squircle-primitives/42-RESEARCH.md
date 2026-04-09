# Phase 42: Squircle Primitives - Research

**Researched:** 2026-04-09
**Domain:** CSS mask-image SVG data-URI squircle system + corner-shape progressive enhancement
**Confidence:** HIGH

## Summary

Phase 42 creates a complete squircle utility system as reusable CSS classes in a new `src/styles/squircles.css` file. The technique is locked: SVG `mask-image` data-URI as production default, with `@supports (corner-shape: superellipse(2))` progressive enhancement for Chrome 139+, and inherent `border-radius` graceful fallback for ancient browsers. No HTML pages are modified -- this phase produces CSS primitives only.

Phase 41 already committed the hard prerequisites: (1) focus-visible refactored from `box-shadow` to `outline + outline-offset` in theme.css (lines 311-321), safe for mask clipping; (2) three SVG data-URI mask tokens (`--squircle-mask-md`, `--squircle-mask-lg`, `--squircle-mask-xl`) and `--squircle-mask-full: none` in theme.css `:root` (lines 108-113). Phase 42 needs to add the radius value tokens, create the utility classes, wire the `@import`, author the `@supports` progressive enhancement block, and document the shadow-wrap pattern.

**Primary recommendation:** Create `src/styles/squircles.css` with 4 utility classes (.squircle-md, .squircle-lg, .squircle-xl, .squircle-full), each setting `border-radius` + `mask-image` + `mask-size: 100% 100%`, plus a single `@supports (corner-shape: superellipse(2))` block that strips the mask and applies native rendering. Add `@import './squircles.css'` to `tailwind.css` between theme.css and any future liquid-glass.css.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SVG mask-image data-URI as production default (cross-browser)
- @supports (corner-shape: superellipse(2)) PE for Chrome 139+ removes mask, applies native rendering
- Graceful fallback to standard border-radius for browsers without mask-image
- Superellipse formula: n=5 (Apple standard), or corner-shape k=2
- Variant scale: .squircle-md (16px), .squircle-lg (24px), .squircle-xl (40px), .squircle-full (9999px)
- Shadow-wrap pattern: outer wrapper carries box-shadow, inner element carries mask
- Dedicated file: src/styles/squircles.css
- Uses Phase 41 tokens (--squircle-mask-md/lg/xl from theme.css)

### Claude's Discretion
- SVG path point resolution (64 vs 128 points per quadrant -- optimize for file size <3KB per path)
- Exact CSS import mechanism (Tailwind @source vs @import)
- Whether to include a .squircle-shadow-wrap utility or document as HTML pattern only
- Transition behavior for squircle classes (whether to include will-change hints)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SQUIRCLE-01 | All border-radius elements replaced with superellipse -- 4 variant scale: md/lg/xl/full | Utility class system in squircles.css provides the 4 variants. HTML replacement is Phase 44-47 scope; Phase 42 creates the classes only |
| SQUIRCLE-02 | Chrome 139+ sees native corner-shape via @supports PE; others get mask-image SVG; without mask-image get border-radius | Three-tier degradation chain implemented via CSS cascade + @supports block |
| SQUIRCLE-04 | Shadow-wrap pattern: outer wrapper has shadow, inner element has mask | Documented pattern in squircles.css comments + tested via DevTools inspection |
</phase_requirements>

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Tailwind CSS | v4.2.2 | CSS compilation via standalone CLI | Already pinned in project via `make install-tailwind`. Compiles squircles.css as part of the import chain [VERIFIED: Makefile line 10] |
| CSS mask-image | Baseline 2023 | Squircle shape via SVG data-URI mask | 96.73% global support. Chrome 120+, Firefox 53+, Safari 15.4+, Edge 120+ [VERIFIED: caniuse.com/css-masks] |
| CSS corner-shape | Experimental | Native superellipse for Chrome 139+ | Progressive enhancement only. Chrome/Edge 139+ only. Zero Safari/Firefox support [VERIFIED: MDN corner-shape docs] |
| SVG data-URI | N/A | Inline superellipse path in CSS | Zero-tooling approach. Hand-authored SVG strings committed as literal text [VERIFIED: STACK.md research] |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| @supports CSS at-rule | Baseline | Feature detection for corner-shape PE | Wrap corner-shape declarations for Chrome 139+ detection |
| -webkit-mask-image | Legacy prefix | Safari compatibility | Always pair with unprefixed mask-image for Safari <15.4 partial support [CITED: caniuse.com/css-masks] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG mask-image data-URI | figma-squircle npm | Requires Node.js install, breaks zero-Node constraint [VERIFIED: STACK.md] |
| SVG mask-image data-URI | Houdini smooth-corners worklet | Chromium-only, no Safari/Firefox -- unusable for Apple design aesthetic targeting [VERIFIED: STACK.md] |
| SVG mask-image data-URI | clip-path with SVG path | Also clips box-shadows AND requires element-relative coordinates per size. mask-image with mask-size: 100% 100% scales automatically [VERIFIED: STACK.md] |
| Hand-authored SVG paths | SVG wrapper pattern (inline `<svg>` per element) | Pollutes HTML; mask-image keeps SVG in CSS where it belongs [VERIFIED: STACK.md] |

**Installation:**
No installation needed. All tools already present in the project.

## Architecture Patterns

### Recommended Project Structure
```
src/styles/
  fonts.css              (existing -- font declarations)
  tailwind.css           (existing -- entry point, add @import './squircles.css')
  theme.css              (existing -- contains --squircle-mask-* data-URIs from Phase 41)
  squircles.css          (NEW -- squircle utility classes, @supports PE, shadow-wrap docs)
  index.css              (existing -- reference only, not build entry)
css/
  styles.css             (compiled output from `make build`)
```

### Pattern 1: Tailwind CSS Import Chain (Correct Order)
**What:** The import order in tailwind.css determines CSS cascade precedence. squircles.css must load after theme.css (so it can reference `var(--squircle-mask-*)` tokens) and before any future liquid-glass.css.
**When to use:** Always -- this is the project's CSS architecture convention.
**Example:**
```css
/* src/styles/tailwind.css -- updated import chain */
@import './fonts.css';
@import 'tailwindcss' source(none);
@source '../../*.html';
@import './theme.css';
@import './squircles.css';    /* NEW -- after theme.css, before liquid-glass.css */
```
[VERIFIED: ARCHITECTURE.md lines 55-63 specifies this exact order]

### Pattern 2: Squircle Utility Class Structure
**What:** Each `.squircle-*` class sets three orthogonal properties: border-radius (fallback), mask-image (production shape), mask-size (scaling).
**When to use:** Applied to any element needing superellipse shape.
**Example:**
```css
/* Source: ARCHITECTURE.md C.6 + STACK.md section A */
.squircle-md {
  border-radius: 16px;                              /* Tier 3 fallback */
  -webkit-mask-image: var(--squircle-mask-md);       /* Safari compat */
          mask-image: var(--squircle-mask-md);        /* Tier 2 production */
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}
```
[VERIFIED: ARCHITECTURE.md C.6 lines 441-445]

### Pattern 3: Three-Tier Progressive Enhancement
**What:** CSS cascade naturally provides three rendering tiers without explicit @supports for mask-image.
**When to use:** All squircle classes follow this pattern.
**Example:**
```css
/* Tier 2 (default): mask-image + border-radius */
.squircle-lg {
  border-radius: 24px;
  -webkit-mask-image: var(--squircle-mask-lg);
          mask-image: var(--squircle-mask-lg);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

/* Tier 1: Chrome 139+ native */
@supports (corner-shape: superellipse(2)) {
  .squircle-md, .squircle-lg, .squircle-xl, .squircle-full {
    -webkit-mask-image: none;
            mask-image: none;
    corner-shape: superellipse(2);
  }
}

/* Tier 3: no @supports not block needed.
   Browsers without mask-image simply ignore the mask properties
   and keep the border-radius. The fallback is inherent in the cascade. */
```
[VERIFIED: MDN @supports docs; STACK.md degradation chain lines 99-105]

### Pattern 4: Shadow-Wrap Two-Element Idiom
**What:** Outer wrapper carries box-shadow (outside mask), inner element carries squircle mask (clips content). Required because mask-image clips box-shadow.
**When to use:** Any squircle element that needs an outer drop shadow (cards, primary/secondary buttons). NOT needed for elements with only inset shadows (form containers) or no shadow (badges, chips).
**Example:**
```html
<!-- Source: ARCHITECTURE.md C.3 -->
<div class="liquid-card-wrap">          <!-- outer: shadow, border-radius match, no mask -->
  <div class="liquid-card squircle-lg">  <!-- inner: mask, no outer shadow -->
    <!-- card content -->
  </div>
</div>
```
```css
/* The outer wrapper gets matching border-radius for shadow silhouette */
.liquid-card-wrap {
  box-shadow: var(--liquid-shadow-outer);
  border-radius: 24px;  /* matches --squircle-lg for shadow silhouette */
}
```
[VERIFIED: ARCHITECTURE.md C.3 lines 304-350]

### Anti-Patterns to Avoid
- **Applying box-shadow AND mask-image to the same element:** Shadow will be clipped to the mask silhouette, rendering as two thin arcs instead of a continuous shadow. Use shadow-wrap pattern. [VERIFIED: STACK.md trade-off 1]
- **Applying border to a squircle element:** Borders are clipped by mask-image. Use `box-shadow: inset 0 0 0 1px <color>` instead (inset shadows render inside the mask). [VERIFIED: ARCHITECTURE.md C.7]
- **Applying squircle to rotating elements:** `mask-image` distorts during CSS `transform: rotate()`. Elements with `group-hover:rotate-*` should keep `border-radius` or drop the rotation. [VERIFIED: PITFALLS.md H2]
- **Adding will-change: backdrop-filter:** Research anti-recommendation -- multiplies compositor layer cost, makes perf worse. [VERIFIED: PITFALLS.md monitoring table]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Superellipse path generation | Runtime JS path calculator | Pre-authored SVG data-URIs in theme.css | Phase 41 already committed the paths. Zero runtime cost, zero Node dependency [VERIFIED: theme.css lines 109-113] |
| Responsive squircle scaling | ResizeObserver + dynamic path recalc | `preserveAspectRatio="none"` + `mask-size: 100% 100%` | SVG stretches to any element size. Already used in Phase 41 paths [VERIFIED: theme.css data-URIs contain preserveAspectRatio='none'] |
| Browser feature detection | JS feature probe | CSS @supports | Native CSS, zero JS, instant evaluation [VERIFIED: MDN @supports] |
| Focus ring on squircle elements | Custom focus ring implementation | Phase 41's outline-based focus-visible | Already refactored in theme.css lines 311-321 [VERIFIED: theme.css] |

**Key insight:** The heavy lifting (SVG path generation, focus-visible refactor) was already done in Phase 41. Phase 42 is primarily wiring -- referencing existing tokens and creating utility classes.

## Common Pitfalls

### Pitfall 1: Missing -webkit- prefix for Safari
**What goes wrong:** Safari versions before 15.4 only support `-webkit-mask-image`, not the unprefixed `mask-image`. Omitting the prefix means Safari 14-15.3 users see border-radius fallback instead of the squircle.
**Why it happens:** Developer tests in Chrome (supports unprefixed), forgets Safari prefix.
**How to avoid:** Every `mask-image` declaration MUST be paired with `-webkit-mask-image`. Same for `mask-size`.
**Warning signs:** Squircle looks like a regular rounded rectangle in Safari but works in Chrome.
[VERIFIED: caniuse.com/css-masks -- "-webkit-" prefix needed for older WebKit]

### Pitfall 2: Forgetting mask-size: 100% 100%
**What goes wrong:** Without `mask-size: 100% 100%`, the SVG mask renders at its intrinsic size (100x100 viewBox = 100px x 100px) and tiles or clips instead of stretching to cover the element.
**Why it happens:** `mask-size` defaults to `auto`, which uses the SVG's intrinsic dimensions.
**How to avoid:** Always pair `mask-image` with `mask-size: 100% 100%`.
**Warning signs:** Squircle appears as a tiny 100px shape in the top-left corner of the element, possibly repeating.
[VERIFIED: MDN mask-size docs; STACK.md section A trade-off 4]

### Pitfall 3: @supports block must use the keyword `squircle` correctly
**What goes wrong:** `@supports (corner-shape: squircle)` is a valid shorthand keyword for `superellipse(2)` per MDN. Using the wrong syntax causes the @supports block to never match.
**Why it happens:** Confusing the keyword `squircle` (MDN-documented shorthand) with the function `superellipse(2)`.
**How to avoid:** Use `@supports (corner-shape: superellipse(2))` as specified in CONTEXT.md. Both `squircle` keyword and `superellipse(2)` are valid per MDN, but `superellipse(2)` is more explicit and matches the CONTEXT decision.
**Warning signs:** Chrome 139+ still renders the mask-image version instead of native corner-shape.
[VERIFIED: MDN corner-shape -- squircle = superellipse(2)]

### Pitfall 4: .squircle-full applies unnecessary mask to circular elements
**What goes wrong:** At `border-radius: 9999px`, a squircle is visually identical to a circle. Applying a mask-image adds complexity and file size for zero visual benefit.
**Why it happens:** Literal interpretation of "universal squircle" mandate.
**How to avoid:** `.squircle-full` should use `border-radius: 9999px` only, with `mask-image: none` (or reference `--squircle-mask-full: none` from theme.css). No SVG mask needed.
**Warning signs:** Unnecessary data-URI bloat; circle looks identical with and without mask.
[VERIFIED: PITFALLS.md M1 lines 628-641; CONTEXT.md explicitly sets --squircle-mask-full to none]

### Pitfall 5: Data-URI count bloat
**What goes wrong:** Creating per-element or per-aspect-ratio SVG masks inflates CSS file size beyond budget.
**Why it happens:** Over-engineering for edge cases.
**How to avoid:** Cap at 3 data-URI masks (md, lg, xl). Full uses no mask. The `preserveAspectRatio="none"` + `mask-size: 100% 100%` approach stretches a single path to any element dimensions.
**Warning signs:** `squircles.css` has more than 4 data-URI references (3 masks + 1 "none").
[VERIFIED: PITFALLS.md H7 lines 503-523; theme.css ships exactly 3 data-URIs + 1 none]

### Pitfall 6: :user-valid border indicator clipped by mask
**What goes wrong:** Form inputs with squircle mask lose the 3px green left-border valid-state indicator because mask-image clips borders.
**Why it happens:** Same root cause as shadow clipping -- mask-image clips everything outside the mask silhouette.
**How to avoid:** This is a Phase 44-47 concern (when squircle is applied to inputs), but document now: use `box-shadow: inset 3px 0 0 var(--mu-green-600)` instead of `border-left` for valid-state indicators on squircle inputs.
**Warning signs:** Green validation bar appears on non-squircled inputs but not on squircled ones.
[VERIFIED: PITFALLS.md M4 lines 728-753]

## Code Examples

### Complete squircles.css File Structure
```css
/* Source: ARCHITECTURE.md C.6, adapted for Phase 42 scope */

/*
 * src/styles/squircles.css
 *
 * Squircle primitives for MedicusUnion KZ v4.0 Liquid Design System.
 *
 * Uses mask-image + inline SVG data-URI as the production default.
 * Progressive enhancement via corner-shape: superellipse(2) for Chrome 139+.
 *
 * Three-tier degradation:
 *   Tier 1 (Chrome 139+): corner-shape: superellipse(2) -- native, GPU-accelerated
 *   Tier 2 (Safari 17+, Firefox 120+, Chrome <139): mask-image SVG -- production default
 *   Tier 3 (no mask-image support): border-radius rounded corner fallback
 *
 * Shadow-wrap pattern:
 *   mask-image clips box-shadow. For elements needing outer shadows,
 *   use a wrapper div for the shadow and the inner element for the mask:
 *     <div class="[shadow-class]">           <!-- outer: shadow, matching border-radius -->
 *       <div class="squircle-lg [content]">  <!-- inner: mask, no outer shadow -->
 *     </div>
 *
 * Tokens declared in: theme.css :root (--squircle-mask-md/lg/xl/full)
 */

/* ------------------------------------------------
   Utility classes
   ------------------------------------------------ */

.squircle-md {
  border-radius: 16px;
  -webkit-mask-image: var(--squircle-mask-md);
          mask-image: var(--squircle-mask-md);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

.squircle-lg {
  border-radius: 24px;
  -webkit-mask-image: var(--squircle-mask-lg);
          mask-image: var(--squircle-mask-lg);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

.squircle-xl {
  border-radius: 40px;
  -webkit-mask-image: var(--squircle-mask-xl);
          mask-image: var(--squircle-mask-xl);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

.squircle-full {
  border-radius: 9999px;
  /* No mask needed -- at full radius, squircle = circle.
     --squircle-mask-full is 'none' in theme.css. */
}

/* ------------------------------------------------
   Progressive enhancement -- Chrome 139+
   Native corner-shape removes mask overhead
   ------------------------------------------------ */

@supports (corner-shape: superellipse(2)) {
  .squircle-md,
  .squircle-lg,
  .squircle-xl,
  .squircle-full {
    -webkit-mask-image: none;
            mask-image: none;
    corner-shape: superellipse(2);
  }
}
```

### Updated tailwind.css Import
```css
/* src/styles/tailwind.css */
@import './fonts.css';
@import 'tailwindcss' source(none);
@source '../../*.html';
@import './theme.css';
@import './squircles.css';    /* Phase 42: squircle primitives */
```

### Shadow-Wrap HTML Pattern (for documentation)
```html
<!-- Cards with outer drop shadow -->
<div class="liquid-card-wrap">
  <article class="liquid-card squircle-lg">
    <!-- card content -->
  </article>
</div>

<!-- Buttons with colored glow shadow -->
<div class="btn-shadow-wrap">
  <button class="squircle-md liquid-btn-primary px-6 py-3 text-white">
    Submit
  </button>
</div>

<!-- Elements with ONLY inset shadows -- NO wrap needed -->
<form class="squircle-xl">
  <!-- form fields -- inset shadows are safe inside mask -->
</form>

<!-- Badges, chips, pills -- no shadow, no wrap needed -->
<span class="squircle-md bg-mu-green-50 px-3 py-1 text-sm">Badge</span>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `border-radius` only | `mask-image` SVG data-URI + `corner-shape` PE | Chrome 139 (Aug 2025) enabled PE layer | Superellipse is now achievable natively in Chrome; mask-image remains cross-browser production default |
| figma-squircle npm (JS runtime) | Static SVG data-URI in CSS | Project decision (v4.0 zero-Node) | No JS dependency, no ResizeObserver overhead, no build tooling |
| Houdini paint worklet | mask-image + corner-shape PE | Safari/Firefox never shipped Houdini paint | mask-image has 96.73% support vs. Houdini's Chromium-only |
| `corner-shape: squircle` keyword | `corner-shape: superellipse(2)` function | CSS specification (2025-2026) | Both are valid; `superellipse(2)` is more explicit. `squircle` keyword = exact alias [VERIFIED: MDN] |

**Deprecated/outdated:**
- `smooth-corners` Houdini worklet: Chromium-only, privacy-restricted on `<a>` elements, not shipping in Safari/Firefox [VERIFIED: STACK.md]
- `clip-path` with SVG path: Valid but clips box-shadows AND requires element-relative coordinates per size, making it worse than mask-image for responsive elements [VERIFIED: STACK.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `.squircle-full` with only `border-radius: 9999px` (no mask) is visually identical to a masked squircle at full radius | Code Examples | If n=5 superellipse at 50% radius differs from a circle, .squircle-full would look different from other squircle variants. Risk: LOW -- mathematically, superellipse collapses to circle at full radius [ASSUMED based on math] |
| A2 | Tailwind v4 CLI will include the `.squircle-*` classes in compiled output even though they are plain CSS classes (not @utility) imported via @import | Architecture Patterns | If Tailwind CLI tree-shakes @imported plain classes not found in HTML source, classes would be missing from output. Risk: MEDIUM -- needs build verification [ASSUMED -- should be verified by building] |

**Mitigation for A2:** The `make build` gate (Success Criterion 5) will immediately surface this. If Tailwind tree-shakes the classes, wrap them in `@layer components { }` or use `@utility` directives.

## Open Questions

1. **Will Tailwind CLI include plain CSS classes from @imported files in the output?**
   - What we know: Tailwind v4 with `source(none)` + `@source '../../*.html'` only scans HTML files for class usage. Classes defined in @imported CSS files via plain selectors (not @utility) may or may not be included.
   - What's unclear: Whether `.squircle-md` defined in squircles.css will appear in css/styles.css without any HTML file referencing it.
   - Recommendation: Test immediately after creating squircles.css. If classes are missing, wrap in `@layer components { }` which Tailwind always includes. This is a Wave 0 verification task.

2. **Shadow-wrap: utility class or documentation-only pattern?**
   - What we know: CONTEXT.md lists this as Claude's discretion. ARCHITECTURE.md C.3 argues against a sugar class because "a single class cannot style the outer element."
   - What's unclear: Whether a `.squircle-shadow-wrap` class on the outer element (setting only border-radius + shadow) would be useful for downstream phases.
   - Recommendation: Document as HTML pattern only (per ARCHITECTURE.md recommendation). The outer wrapper's shadow varies by surface type (card shadow vs. button glow vs. header shadow), so a single class would be too generic. Phase 43 (Liquid Glass) will define surface-specific wrapper classes like `.liquid-card-wrap`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser inspection + `make build` exit code |
| Config file | Makefile (line 63-68) |
| Quick run command | `make build` |
| Full suite command | `make check` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SQUIRCLE-01 | 4 squircle utility classes exist in compiled CSS | smoke | `make build && grep -c 'squircle-' css/styles.css` | N/A (grep) |
| SQUIRCLE-02 (Tier 1) | @supports corner-shape block present in compiled CSS | smoke | `grep 'corner-shape' css/styles.css` | N/A (grep) |
| SQUIRCLE-02 (Tier 2) | mask-image declarations present | smoke | `grep 'mask-image' css/styles.css` | N/A (grep) |
| SQUIRCLE-02 (Tier 3) | border-radius fallback present | smoke | `grep 'border-radius' css/styles.css` (within squircle context) | N/A (grep) |
| SQUIRCLE-04 | Shadow-wrap pattern documented | manual | Read squircles.css header comment | N/A |

### Sampling Rate
- **Per task commit:** `make build` (exit 0 = pass)
- **Per wave merge:** `make check` (build + byte-identity gate)
- **Phase gate:** Full `make check` + grep verification of compiled output

### Wave 0 Gaps
- [ ] Verify `@import './squircles.css'` in tailwind.css produces class output in css/styles.css
- [ ] If classes are tree-shaken: wrap in `@layer components { }` as fallback strategy

## Security Domain

Not applicable to this phase. Phase 42 is pure CSS styling primitives with no user input handling, no authentication, no data flow. Security enforcement is irrelevant for static CSS utility class creation.

## Sources

### Primary (HIGH confidence)
- [theme.css inspection] - Confirmed Phase 41 tokens: --squircle-mask-md/lg/xl data-URIs (lines 109-111), --squircle-mask-full: none (line 113), focus-visible outline refactor (lines 311-321)
- [ARCHITECTURE.md C.3, C.6] - Shadow-wrap idiom, squircles.css file outline, class structure, import order
- [STACK.md section A] - mask-image technique selection, figma-squircle rejection, degradation chain, perf budget
- [PITFALLS.md C1, H1, H2, H7, M1, M4, M5] - Focus ring clipping, hover jitter, rotate distortion, data-URI bloat, circle equivalence, border clipping, small-radius futility
- [MDN corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) - Experimental status, Chrome 139+ only, @supports syntax, keyword aliases
- [MDN superellipse()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/superellipse) - Function syntax, superellipse(2) = squircle

### Secondary (MEDIUM confidence)
- [Can I Use: CSS Masks](https://caniuse.com/css-masks) - 96.73% global support, Chrome 120+, Firefox 53+, Safari 15.4+, -webkit- prefix history
- [Smashing Magazine: Beyond border-radius (March 2026)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/) - corner-shape production readiness analysis
- [Frontend Masters: CSS corner-shape](https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse/) - superellipse(2) = squircle mapping
- [Chrome Platform Status](https://chromestatus.com/feature/5357329815699456) - Chrome 139 ship status

### Tertiary (LOW confidence)
- None -- all claims verified against primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All technologies are already in the project or are well-documented CSS standards
- Architecture: HIGH - File structure, import order, and class patterns are specified in ARCHITECTURE.md with concrete code outlines
- Pitfalls: HIGH - Exhaustively documented in PITFALLS.md with mitigations; Phase 41 already resolved the critical focus-visible blocker

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- CSS standards and mask-image support are mature; corner-shape PE is experimental but explicitly scoped as enhancement-only)
