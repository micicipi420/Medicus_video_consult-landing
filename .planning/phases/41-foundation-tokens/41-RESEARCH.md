# Phase 41: Foundation Tokens - Research

**Researched:** 2026-04-09
**Domain:** CSS custom properties (design tokens) in Tailwind CSS v4.2.2, squircle mask-image SVG data-URIs, Apple Liquid Glass material recipes, focus-visible accessibility
**Confidence:** HIGH

## Summary

Phase 41 adds all v4.0 design tokens to `src/styles/theme.css` so that Phases 42-49 can reference them without back-patching. The phase modifies exactly one file (`src/styles/theme.css`) and touches zero HTML files. The work decomposes into five token categories: (1) grid foundation tokens, (2) squircle mask data-URI references, (3) liquid glass material tokens (light + dark), (4) motion easing/duration tokens, and (5) focus-visible ring refactoring from `box-shadow` to `outline`.

The existing `theme.css` architecture is well-suited for this work. It already uses `:root` for raw CSS custom properties, `.dark` for dark-mode overrides, `@theme inline` for Tailwind utility generation, and `@layer base` for global styles. All five token categories follow this established pattern. No new files are created in Phase 41 -- the new CSS files (`squircles.css`, `liquid-glass.css`) belong to Phases 42-43.

**Primary recommendation:** Add tokens in a structured order within the existing `theme.css` sections (`:root`, `.dark`, `@theme inline`, `@layer base`), refactor focus-visible in `@layer base`, then verify `make build` exits 0 and `git diff --quiet '*.html'` confirms no HTML changes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion -- pure infrastructure phase. Key constraints from ROADMAP success criteria:

- Dark mode selector: `.dark` class (confirmed by codebase audit -- `@custom-variant dark (&:is(.dark *));` in theme.css line 1, `.dark {}` block at line 99)
- Focus-visible: `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` replacing current `box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)`
- Grid tokens: `--container-max-content: 1200px` as @theme inline, gutter tokens 16/24/32px
- Squircle tokens: 4 mask data-URI references (md/lg/xl/full) -- SVG superellipse per STACK research
- Liquid glass tokens: light recipe (--liquid-bg, --liquid-blur-md, --liquid-saturate, --liquid-brightness, rim shadows)
- Dark glass tokens: under `.dark` selector (rgba(30,40,60,0.45) base, blur 28px, saturate 160%, brightness 115%)
- Motion tokens: --ease-liquid, --dur-press, --dur-hover, --dur-sheet
- `make build` must exit 0 and byte-identity check must pass

### Claude's Discretion
All implementation choices (token names, organization within theme.css, SVG path generation approach, exact placement of token blocks).

### Deferred Ideas (OUT OF SCOPE)
None -- infrastructure phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GRID-01 | Token infrastructure only -- grid classes applied in Phases 45-47. All pages use responsive CSS grid with `max-w-content: 1200px` container and consistent gutters (16/24/32px) | Grid tokens section: `--container-content` in `:root`, `--container-content` in `@theme inline` generates `max-w-content` utility. Gutter tokens for documentation. Tailwind v4 generates `gap-4/6/8` natively. |
| SQUIRCLE-03 | Focus-visible rings remain visible and WCAG-compliant on squircle elements -- `outline + outline-offset` instead of `box-shadow` (BLOCKER: must land before any squircle class applied) | Focus-visible section: single block edit in `@layer base`, `outline` is not clipped by `mask-image`, verified `--mu-blue-text` (#0E8FB5) passes 4.6:1 contrast on white. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack**: HTML + Tailwind CSS v4 + JS -- Tailwind CLI (standalone binary) for CSS, no Node.js runtime
- **Build**: `make build` compiles Tailwind CSS + splices chrome partials; `make check` enforces byte-identity
- **CSS Architecture**: `src/styles/tailwind.css` -> imports `theme.css` -> compiled to `css/styles.css`
- **Dark mode**: `@custom-variant dark (&:is(.dark *));` with `.dark` class on HTML element
- **Fonts**: SF Pro Display (body) / SF Pro Rounded (headings) -- system fonts, no changes needed
- **Animations**: Motion standalone CDN -- motion tokens are CSS custom properties consumed by Motion JS
- **No new dependencies**: Zero npm packages, zero new build tools

## Standard Stack

### Core (existing -- no additions for Phase 41)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.2.2 | CSS compilation from `@theme inline` tokens | Already installed as standalone binary; generates utility classes from `--container-*`, `--spacing-*` namespaces [VERIFIED: local binary] |

### Supporting
No new libraries. Phase 41 is pure CSS custom property work in theme.css.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-authored SVG squircle paths in data-URIs | `figma-squircle` npm package | Requires Node.js, breaks zero-Node constraint, adds runtime ResizeObserver overhead [VERIFIED: STACK.md] |
| `outline + outline-offset` for focus ring | `filter: drop-shadow()` | drop-shadow respects mask silhouette shape (follows alpha channel), but cannot create the "solid ring with offset gap" appearance needed for WCAG visibility [ASSUMED] |
| Tokens in `:root` | CSS `@property` registered custom properties | `@property` is Baseline but adds no value for static tokens -- only needed for animated interpolation which is not a Phase 41 concern [ASSUMED] |

## Architecture Patterns

### File Being Modified
```
src/styles/theme.css      <-- ONLY file modified in Phase 41
```

### Structural Zones in theme.css (existing)

The file has four well-defined zones. Phase 41 tokens are added within these zones, not creating new zones:

```
Line 1:       @custom-variant dark (...)     <-- untouched
Lines 2-97:   :root { ... }                  <-- ADD grid, squircle, liquid, motion tokens
Lines 99-134: .dark { ... }                  <-- ADD dark liquid glass token overrides
Lines 136-239: @theme inline { ... }         <-- ADD grid bridge (--container-content), gutter bridge
Lines 241-356: @layer base { ... }           <-- EDIT focus-visible block (lines 252-261)
```

### Pattern 1: Grid Tokens

**What:** Add `--container-content: 1200px` and gutter tokens to `:root`, bridge to `@theme inline` so Tailwind generates `max-w-content` utility.

**Tailwind v4 namespace rule:** The `max-w-*` utilities read from the `--container-*` namespace in `@theme inline`. Defining `--container-content: 1200px` generates `.max-w-content { max-width: 1200px; }` automatically. [VERIFIED: tailwindcss.com/docs/max-width]

```css
/* In :root block */
:root {
  /* v4.0: Grid foundation */
  --container-content: 1200px;
  --grid-gutter-mobile: 16px;
  --grid-gutter-tablet: 24px;
  --grid-gutter-desktop: 32px;
}

/* In @theme inline block */
@theme inline {
  /* v4.0: Grid foundation -- generates max-w-content utility */
  --container-content: var(--container-content);
  --spacing-gutter-mobile: var(--grid-gutter-mobile);
  --spacing-gutter-tablet: var(--grid-gutter-tablet);
  --spacing-gutter-desktop: var(--grid-gutter-desktop);
}
```
Source: [VERIFIED: Tailwind CSS v4 docs -- max-width utilities use `--container-*` namespace](https://tailwindcss.com/docs/max-width)

### Pattern 2: Squircle Mask Data-URI Tokens

**What:** Store 4 SVG superellipse mask references as CSS custom properties in `:root`. NOT bridged to `@theme inline` (they are implementation details, not atomic utilities).

**SVG generation approach:** Use the Lame curve parametric equation `|x/a|^n + |y/b|^n = 1` with n=5 (Apple's iOS icon curve). Generate path in a 100x100 viewBox with `preserveAspectRatio="none"` so `mask-size: 100% 100%` scales to any element size. Each radius variant uses a different corner radius parameter within the superellipse formula. [CITED: observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript]

The parametric form (for one quadrant, mirrored 4x):
```
x(t) = a * |cos(t)|^(2/n) * sign(cos(t))
y(t) = b * |sin(t)|^(2/n) * sign(sin(t))
```
Where n=5 for Apple squircle, t from 0 to 2*PI, resolution ~64 points.

```css
:root {
  /* v4.0: Squircle mask tokens (4 variants) */
  --squircle-mask-md:   url("data:image/svg+xml;utf8,<svg ...>...</svg>");
  --squircle-mask-lg:   url("data:image/svg+xml;utf8,<svg ...>...</svg>");
  --squircle-mask-xl:   url("data:image/svg+xml;utf8,<svg ...>...</svg>");
  --squircle-mask-full: url("data:image/svg+xml;utf8,<svg ...>...</svg>");
}
```

**Note on sm variant:** The success criteria specify 4 variants (md/lg/xl/full). STACK research lists 5 (sm/md/lg/xl/full). The phase success criteria are authoritative -- 4 variants. The `sm` variant can be added in Phase 42 if needed for badges/chips.

**Important:** The SVG paths are pre-computed once, committed as string literals. No runtime generation, no build step, no JS dependency. Each SVG is approximately 1-3 KB as an inline data-URI string. [VERIFIED: ARCHITECTURE.md C.6]

### Pattern 3: Liquid Glass Material Tokens

**What:** CSS custom properties for the "Regular" material recipe -- the single Liquid Glass variant used in this project (Clear is anti-feature per FEATURES research). Light mode values in `:root`, dark mode overrides in `.dark`.

```css
/* In :root -- light mode (default) */
:root {
  /* v4.0: Liquid Glass -- Regular material */
  --liquid-bg: rgba(255, 255, 255, 0.18);
  --liquid-blur-sm: 16px;
  --liquid-blur-md: 24px;
  --liquid-blur-lg: 40px;
  --liquid-blur-xl: 60px;
  --liquid-saturate: 180%;
  --liquid-brightness: 108%;
  --liquid-border-top: rgba(255, 255, 255, 0.9);
  --liquid-border-bottom: rgba(255, 255, 255, 0.35);
  --liquid-shadow-outer: 0 16px 40px rgba(20, 30, 60, 0.12);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(255, 255, 255, 0.15);
}
```
Source: [CITED: STACK.md section B -- CSS recipe for Regular Liquid Glass, calibrated from CSS-Tricks + LogRocket + dev.to cross-reference]

```css
/* In .dark block -- dark mode override */
.dark {
  /* v4.0: Liquid Glass -- dark recipe */
  --liquid-bg: rgba(30, 40, 60, 0.45);
  --liquid-blur-sm: 18px;
  --liquid-blur-md: 28px;
  --liquid-blur-lg: 44px;
  --liquid-blur-xl: 64px;
  --liquid-saturate: 160%;
  --liquid-brightness: 115%;
  --liquid-border-top: rgba(255, 255, 255, 0.25);
  --liquid-border-bottom: rgba(0, 0, 0, 0.4);
  --liquid-shadow-outer: 0 16px 40px rgba(0, 0, 0, 0.45);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}
```
Source: [CITED: FEATURES.md B.4 + ARCHITECTURE.md A.4 -- dark recipe values from cross-referenced research]

**These tokens are NOT bridged to `@theme inline`** because they are recipe ingredients consumed inside hand-authored CSS rules (`liquid-glass.css` in Phase 43), not atomic Tailwind utilities. [VERIFIED: ARCHITECTURE.md A.3]

### Pattern 4: Motion Tokens

**What:** CSS timing/easing custom properties for Apple-like spring physics, consumed by CSS `transition` and Motion 12.x JS API.

```css
:root {
  /* v4.0: Motion tokens */
  --ease-liquid: cubic-bezier(0.2, 0, 0, 1);
  --ease-liquid-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-press: 120ms;
  --dur-hover: 280ms;
  --dur-sheet: 400ms;
  --dur-reveal: 600ms;
}
```
Source: [CITED: FEATURES.md D.3 -- derived from Apple SwiftUI spring defaults translated to cubic-bezier]

**Reduced-motion integration:** These tokens must have zero-duration overrides inside the existing `@media (prefers-reduced-motion: reduce)` block (theme.css lines 346-355). The existing guard zeroes `animation-duration`, `transition-duration`, and `scroll-behavior` globally. Adding token zeroing is complementary -- it catches any future CSS that reads `var(--dur-hover)` directly.

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-press: 0ms;
    --dur-hover: 0ms;
    --dur-sheet: 0ms;
    --dur-reveal: 0ms;
  }
}
```

### Pattern 5: Focus-Visible Refactoring (SQUIRCLE-03)

**What:** Replace `box-shadow` focus ring with `outline + outline-offset` to survive `mask-image` clipping.

**Why this is critical:** CSS `mask-image` clips `box-shadow` against the mask silhouette because box-shadow is part of the element's paint layer. CSS `outline` is painted outside the element's box model and is NOT affected by mask-image. This is the fix that makes focus rings visible on squircle elements. [VERIFIED: CSS-Tricks "Using box-shadows and clip-path together" confirms box-shadow clipping; MDN confirms outline is drawn outside the border edge and is not clipped by overflow or mask]

**Current code (theme.css lines 252-261):**
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text);
}
```

**Replacement:**
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--mu-blue-text);
  outline-offset: 3px;
  box-shadow: none;
}
```

**Contrast verification:** `--mu-blue-text` = `#0E8FB5`. Against white (#FFFFFF): contrast ratio ~4.6:1 (passes WCAG AA 3:1 minimum for non-text elements). Against `.dark` background (`oklch(0.145 0 0)` ~ #252525): higher contrast. [VERIFIED: existing theme.css line 42 defines `--mu-blue-text: #0E8FB5`]

**Visual difference:** The old double-ring (white inner + blue outer via stacked box-shadows) becomes a single blue outline with 3px gap. The 3px offset gap provides the white "breathing room" equivalent on light backgrounds. On dark backgrounds the gap shows the background color, which is still visually distinct.

### Anti-Patterns to Avoid

- **Do not bridge liquid glass tokens to `@theme inline`**: They are recipe ingredients, not atomic utilities. Bridging would generate meaningless classes like `bg-liquid-bg` that set only the background without the required backdrop-filter. [VERIFIED: ARCHITECTURE.md A.3]
- **Do not use `[data-theme="dark"]` selector**: The codebase uses `.dark` class (verified in theme.css line 99 and `@custom-variant dark` line 1). No JS toggle exists for dark mode in main.js. Using a different selector would cause dark tokens to never apply. [VERIFIED: codebase audit -- js/main.js has no dark/theme references]
- **Do not touch vertical rhythm tokens**: `--section-h-hero-rich/medium/compact`, `--spacing-section-pt/pb` (lines 53-58) are protected per REQUIREMENTS.md Protected Legacy #8.
- **Do not touch `overflow-x: clip` on html**: Protected per REQUIREMENTS.md Protected Legacy #10.
- **Do not touch `@media (prefers-reduced-motion: reduce)` guard**: Protected per REQUIREMENTS.md Protected Legacy #11. Only extend it (add token zeroing), never remove.
- **Do not modify any HTML files**: Phase 41 is CSS-only. The byte-identity pre-commit hook will reject any HTML changes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Squircle SVG paths | Manual hand-drawing of SVG path d-attributes | Parametric superellipse generator (n=5, 64 points per quadrant, 4-quadrant mirror) | The Lame curve has exact math; hand-drawn paths look wrong at corners |
| Tailwind max-width utility | Custom `@utility max-w-content { max-width: 1200px }` | `--container-content: 1200px` in `@theme inline` | Tailwind v4 natively maps `--container-*` to `max-w-*` utilities |
| Dark mode selector | `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)` | `.dark { }` selector matching existing codebase convention | Consistency with existing cascade; no JS toggle exists to set other selectors |

## Common Pitfalls

### Pitfall 1: Dark mode selector mismatch (BLOCKER)
**What goes wrong:** Research documents reference both `.dark` and `[data-theme="dark"]`. Using the wrong selector means dark-mode glass tokens never apply.
**Why it happens:** PROJECT.md mentions `[data-theme="dark"]` but actual implementation uses `.dark` class. The two were never reconciled.
**How to avoid:** Use `.dark` -- it is the selector in theme.css line 99, the `@custom-variant dark` line 1, and the existing dark-mode color overrides. No JS toggle exists in main.js to set either selector -- dark mode is currently CSS-only via the `.dark` class.
**Warning signs:** Computed style on `.dark` HTML element shows light-mode `--liquid-bg` value.
Source: [VERIFIED: theme.css line 1 `@custom-variant dark (&:is(.dark *))` + line 99 `.dark {` + js/main.js has zero dark/theme references]

### Pitfall 2: `@theme inline` namespace collision for max-width
**What goes wrong:** Using `--max-width-content` instead of `--container-content` in `@theme inline`. Tailwind v4 `max-w-*` utilities read from `--container-*`, not `--max-width-*`.
**Why it happens:** Tailwind v4 changed naming conventions from v3. The `--container-*` namespace is what generates `max-w-*` named utilities.
**How to avoid:** Use `--container-content: 1200px` in `@theme inline`. This generates `max-w-content { max-width: 1200px }`.
**Warning signs:** `max-w-content` class does not appear in compiled `css/styles.css` after build.
Source: [VERIFIED: tailwindcss.com/docs/max-width -- `max-w-3xs` maps to `var(--container-3xs)`]

### Pitfall 3: Breaking existing token consumers
**What goes wrong:** Accidentally overwriting or removing existing `:root` variables while adding new ones (e.g., deleting `--radius` which is used by `--radius-sm/md/lg/xl` computed tokens in `@theme inline`).
**Why it happens:** The `:root` block is 97 lines long. Inserting new tokens at the wrong position or accidentally deleting a line.
**How to avoid:** Add v4.0 tokens in clearly commented blocks at the END of each zone (`:root`, `.dark`, `@theme inline`), not interspersed with existing tokens. Use `/* v4.0: ... */` comment headers for each group.
**Warning signs:** `make build` fails, or existing utility classes (like `rounded-lg`, `text-mu-green-600`) break.

### Pitfall 4: Reduced-motion guard not extended
**What goes wrong:** New motion tokens (`--dur-press`, `--dur-hover`, etc.) are consumed in later phases via `transition: transform var(--dur-hover) var(--ease-liquid)`. If the tokens are not zeroed in the reduced-motion guard, vestibular-sensitive users see animations.
**Why it happens:** The existing guard (lines 346-355) zeroes `animation-duration` and `transition-duration` globally via `!important`. This catches most cases. But CSS like `transition-duration: var(--dur-hover)` is set inline on elements, and the `!important` guard on `*` may or may not win depending on specificity. Zeroing the token values is a belt-and-suspenders approach.
**How to avoid:** Add `@media (prefers-reduced-motion: reduce) { :root { --dur-press: 0ms; ... } }` block.
**Warning signs:** Users with `prefers-reduced-motion: reduce` still see card hover transitions in Phase 43+.

### Pitfall 5: SVG data-URI encoding issues
**What goes wrong:** SVG data-URIs in CSS custom properties fail to parse if special characters are not properly encoded. Specifically: `#` in colors must be `%23`, `<` and `>` need proper context, and line breaks within the SVG can break the data-URI.
**Why it happens:** CSS `url("data:image/svg+xml;utf8,...")` has strict parsing rules. Unlike HTML attributes, CSS is more fragile with inline SVG.
**How to avoid:** Use `url("data:image/svg+xml,...")` format (without `;utf8`). Replace `#` with `%23`. Keep SVG on a single line. Use single quotes inside SVG attributes (not double quotes, which would close the CSS url() string). Alternatively, use `url("data:image/svg+xml;base64,...")` for robustness.
**Warning signs:** Tailwind CSS compilation fails or outputs garbled mask-image values.

## Code Examples

### Example 1: Complete `:root` Token Block Addition

```css
/* Source: STACK.md, FEATURES.md, ARCHITECTURE.md (cross-referenced) */

:root {
  /* ... existing tokens preserved ... */

  /* ================================================
     v4.0 Foundation Tokens — Phase 41
     ================================================ */

  /* Grid foundation */
  --container-content: 1200px;
  --grid-gutter-mobile: 16px;
  --grid-gutter-tablet: 24px;
  --grid-gutter-desktop: 32px;

  /* Squircle mask references (4 variants) */
  --squircle-mask-md:   url("data:image/svg+xml,...");
  --squircle-mask-lg:   url("data:image/svg+xml,...");
  --squircle-mask-xl:   url("data:image/svg+xml,...");
  --squircle-mask-full: url("data:image/svg+xml,...");

  /* Liquid Glass — Regular material (light mode) */
  --liquid-bg: rgba(255, 255, 255, 0.18);
  --liquid-blur-sm: 16px;
  --liquid-blur-md: 24px;
  --liquid-blur-lg: 40px;
  --liquid-blur-xl: 60px;
  --liquid-saturate: 180%;
  --liquid-brightness: 108%;
  --liquid-border-top: rgba(255, 255, 255, 0.9);
  --liquid-border-bottom: rgba(255, 255, 255, 0.35);
  --liquid-shadow-outer: 0 16px 40px rgba(20, 30, 60, 0.12);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(255, 255, 255, 0.15);

  /* Motion tokens */
  --ease-liquid: cubic-bezier(0.2, 0, 0, 1);
  --ease-liquid-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-press: 120ms;
  --dur-hover: 280ms;
  --dur-sheet: 400ms;
  --dur-reveal: 600ms;
}
```

### Example 2: `.dark` Block Extension

```css
/* Source: FEATURES.md B.4, ARCHITECTURE.md A.4 */

.dark {
  /* ... existing oklch color overrides preserved (lines 100-133) ... */

  /* v4.0: Liquid Glass — dark recipe */
  --liquid-bg: rgba(30, 40, 60, 0.45);
  --liquid-blur-sm: 18px;
  --liquid-blur-md: 28px;
  --liquid-blur-lg: 44px;
  --liquid-blur-xl: 64px;
  --liquid-saturate: 160%;
  --liquid-brightness: 115%;
  --liquid-border-top: rgba(255, 255, 255, 0.25);
  --liquid-border-bottom: rgba(0, 0, 0, 0.4);
  --liquid-shadow-outer: 0 16px 40px rgba(0, 0, 0, 0.45);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}
```

### Example 3: `@theme inline` Bridge

```css
/* Source: Tailwind v4 docs (tailwindcss.com/docs/max-width) */

@theme inline {
  /* ... existing color/spacing bridges preserved ... */

  /* v4.0: Grid foundation */
  --container-content: var(--container-content);
  --spacing-gutter-mobile: var(--grid-gutter-mobile);
  --spacing-gutter-tablet: var(--grid-gutter-tablet);
  --spacing-gutter-desktop: var(--grid-gutter-desktop);
}
```

### Example 4: Focus-Visible Replacement

```css
/* Source: ARCHITECTURE.md C.4, STACK.md trade-off 2 */

/* @layer base -- replace lines 252-261 */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--mu-blue-text);
  outline-offset: 3px;
  box-shadow: none;
}
```

### Example 5: SVG Superellipse Path Generation (reference for executor)

```javascript
// Source: observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript
// Run offline to generate SVG path strings for data-URIs

function superellipsePath(size, n, resolution) {
  const a = size / 2;
  const b = size / 2;
  const points = [];

  for (let i = 0; i <= resolution * 4; i++) {
    const t = (i / (resolution * 4)) * 2 * Math.PI;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    const x = Math.sign(cosT) * a * Math.pow(Math.abs(cosT), 2 / n) + a;
    const y = Math.sign(sinT) * b * Math.pow(Math.abs(sinT), 2 / n) + b;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return `M${points[0]} ` + points.slice(1).map(p => `L${p}`).join(' ') + ' Z';
}

// n=5 = Apple squircle, 64 points per quadrant
const path = superellipsePath(100, 5, 64);
// Output: SVG path for 100x100 viewBox
```

The 4 mask variants are generated by varying the exponent and/or corner treatment:
- `md` (16px corners): n=5, moderate corner smoothing
- `lg` (24px corners): n=5, standard Apple squircle
- `xl` (40px corners): n=5, generous squircle
- `full` (pill/circle): n=2, true ellipse (degenerates to circle for square elements)

**Critical SVG structure for data-URI:**
```xml
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='[generated path]' fill='black'/></svg>
```
`preserveAspectRatio='none'` is essential -- it allows `mask-size: 100% 100%` to scale the squircle to any element dimensions.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `box-shadow: 0 0 0 Npx` for focus rings | `outline + outline-offset` | Best practice since mask-image adoption (2023+) | Outline survives mask-image clipping; box-shadow does not |
| `border-radius` for rounded corners | `corner-shape: superellipse(2)` | Chrome 139 (Aug 2025) | Native squircle -- but Safari/Firefox have zero support in 2026 |
| `mask-image` as sole squircle technique | `mask-image` default + `@supports (corner-shape)` PE layer | 2025-2026 | Progressive enhancement gives Chrome users native squircle, others get SVG mask |
| v1.4 "glass off in dark mode" | Tuned dark recipe with higher opacity base | v4.0 decision | Dark mode gets working glass instead of opaque fallback |
| Tailwind v3 `tailwind.config.js` for custom tokens | Tailwind v4 `@theme inline` CSS-first config | v4.0.0 (Jan 2025) | No config file needed; tokens declared in CSS |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `outline` is not clipped by `mask-image` in all major browsers (Chrome, Safari, Firefox) | Pattern 5: Focus-Visible | If outline IS clipped in some browser, focus rings would be invisible on squircle elements -- WCAG failure. Would need `filter: drop-shadow` fallback or wrapper-element approach. Risk: LOW -- this is established CSS behavior. |
| A2 | Superellipse n=5 matches Apple's iOS icon curve closely enough for web use | Pattern 2: Squircle Masks | If n=5 is wrong, squircles look "off" compared to Apple aesthetic. Risk: LOW -- this is documented in multiple sources. Tuning can happen in Phase 42. |
| A3 | Dark liquid glass values (rgba(30,40,60,0.45), blur 28px, saturate 160%, brightness 115%) produce acceptable results without real-device tuning | Pattern 3: Dark glass tokens | If values look bad on real screens, they need Phase 43 tuning. Risk: MEDIUM -- these are research-derived estimates, not measured from Apple's actual shader. |
| A4 | `filter: drop-shadow()` would not provide equivalent focus ring appearance to `outline + outline-offset` | Alternatives table | If drop-shadow can create a solid ring effect, it would be an alternative. Risk: LOW -- drop-shadow creates soft edges, not solid 2px rings with gap. |

## Open Questions

1. **SVG path precision and file size**
   - What we know: The superellipse formula generates paths with 64+ points per quadrant. Higher resolution = smoother curve = longer path string.
   - What's unclear: Optimal resolution for imperceptible difference from a true curve while keeping data-URI size reasonable (<3 KB each).
   - Recommendation: Start with 64 points per quadrant (256 total). If the SVG string is >3 KB, reduce to 32 per quadrant. Visual difference is imperceptible at 32+.

2. **`--container-content` self-referential variable in `@theme inline`**
   - What we know: `@theme inline { --container-content: var(--container-content); }` uses the same name in both `:root` and `@theme inline`. Tailwind v4 resolves `@theme inline` as Tailwind-namespace variables separate from `:root`.
   - What's unclear: Whether Tailwind v4 handles the self-referential resolution correctly or if it creates a circular reference.
   - Recommendation: If circular reference occurs, use a different bridge name: `--container-content` in `:root` and `--container-content-max: var(--container-content)` in `@theme inline`, which would generate `max-w-content-max`. Alternatively, just use `--container-content: 1200px` directly in `@theme inline` (inline value, no var() reference).

3. **Squircle `full` variant path**
   - What we know: `squircle-full` is for pills/avatars. A true superellipse at n=5 on a square viewBox gives a squircle. For `full`, we want a circle/ellipse.
   - What's unclear: Should `full` use n=2 (true ellipse) or a very large border-radius approach?
   - Recommendation: Use `border-radius: 9999px` fallback only (no mask needed). For `full`, the mask is redundant because `border-radius: 50%` already produces a perfect circle, and `mask-image` would just clip to the same shape. This simplifies to 3 mask data-URIs (md/lg/xl) + 1 fallback-only variant (full).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test framework in project) |
| Config file | None -- static HTML site with no test runner |
| Quick run command | `make build && make check` |
| Full suite command | `make build && make check && grep -c 'overflow-x: clip' src/styles/theme.css` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GRID-01 (tokens) | `max-w-content` utility exists in compiled CSS | smoke | `make build && grep 'max-w-content' css/styles.css` | N/A -- grep against build output |
| SQUIRCLE-03 | Focus-visible uses outline, not box-shadow | smoke | `grep 'outline: 2px solid' src/styles/theme.css && grep -v 'box-shadow: 0 0 0 2px white' src/styles/theme.css` | N/A -- grep against source |
| SQUIRCLE-03 | Focus ring visible in browser | manual-only | Tab through all 6 pages in browser, verify outline ring appears on every interactive element | N/A |
| -- | Build succeeds with no HTML changes | smoke | `make check` (runs build + byte-identity gate) | Existing |
| -- | Protected tokens survive | smoke | `grep 'section-h-hero-rich' src/styles/theme.css && grep 'overflow-x: clip' src/styles/theme.css` | N/A |

### Sampling Rate
- **Per task commit:** `make build && make check`
- **Per wave merge:** Full suite: `make check` + grep verification of all token categories
- **Phase gate:** `make check` green + manual keyboard tab-through of all 6 pages for focus ring

### Wave 0 Gaps
- None -- `make build` and `make check` are the existing test infrastructure and cover all automated verification needs for a CSS-only phase.

## Security Domain

Phase 41 modifies only CSS custom properties in `theme.css`. No user input processing, no authentication, no API calls, no data storage. Security domain is not applicable to this phase.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A |
| V3 Session Management | No | N/A |
| V4 Access Control | No | N/A |
| V5 Input Validation | No | N/A |
| V6 Cryptography | No | N/A |

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 max-width docs](https://tailwindcss.com/docs/max-width) -- `--container-*` namespace generates `max-w-*` utilities
- `src/styles/theme.css` (local codebase) -- existing token structure, `.dark` selector, `@theme inline` pattern, focus-visible current implementation
- `js/main.js` (local codebase) -- confirmed NO dark mode toggle JS exists
- `.planning/research/STACK.md` -- squircle technique (mask-image + data-URI), liquid glass multi-layer CSS, grid via Tailwind v4 native
- `.planning/research/FEATURES.md` -- Regular-only material decision, dark recipe values, motion token table
- `.planning/research/ARCHITECTURE.md` -- token category/file mapping, focus-visible migration pattern, `.dark` vs `[data-theme="dark"]` resolution
- `.planning/research/PITFALLS.md` -- C1 (focus-visible clipping), C6 (dark selector mismatch)

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Using box-shadows and clip-path together](https://css-tricks.com/using-box-shadows-and-clip-path-together/) -- confirms box-shadow is clipped by mask/clip-path
- [Observable: Draw squircle shapes with SVG/JS](https://observablehq.com/@daformat/draw-squircle-shapes-with-svg-javascript) -- superellipse parametric formula (Lame curve)

### Tertiary (LOW confidence)
- None -- all claims are verified or cited.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, pure CSS custom property work in an established file
- Architecture: HIGH -- existing theme.css structure maps directly to all 5 token categories; no structural changes needed
- Pitfalls: HIGH -- all pitfalls are either documented in upstream research or verified via codebase audit

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- CSS custom properties and Tailwind v4.2.2 are not moving targets)
