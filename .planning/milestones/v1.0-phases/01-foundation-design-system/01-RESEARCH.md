# Phase 1: Foundation & Design System - Research

**Researched:** 2026-03-23
**Domain:** CSS architecture, self-hosted fonts, design tokens, responsive foundation
**Confidence:** HIGH

## Summary

This phase establishes the CSS design system, self-hosted typography, and base HTML structure for a Russian-language medical landing page targeting users aged 45+. The stack is pure HTML/CSS/JS with no build tooling -- all design tokens live in CSS custom properties, fonts are self-hosted WOFF2 variable files, and the layout uses mobile-first media queries with BEM naming.

A critical finding: the brand colors #38C6F4 (blue) and #35B678 (green) fail WCAG AA contrast on white backgrounds (ratios of 1.99:1 and 2.59:1 respectively). These colors work well as button backgrounds with dark text (#18212C), or as accents on dark backgrounds, but must never be used as text color on light backgrounds. The design system must encode this constraint in its token naming and usage documentation.

**Primary recommendation:** Build a single `styles.css` with CSS custom properties as design tokens, BEM class naming, mobile-first breakpoints, and self-hosted Inter + Manrope variable WOFF2 fonts with latin + cyrillic subsets. Use `font-display: swap` and `<link rel="preload">` for optimal font loading.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- BEM naming convention for CSS classes
- CSS custom properties for all design tokens (colors, spacing, typography, breakpoints)
- Mobile-first media queries: base styles for mobile, min-width breakpoints for tablet (768px) and desktop (1024px)
- Single CSS file `styles.css` with logical sections via comments
- Self-host Inter (body) and Manrope (headings) as WOFF2
- Body text: 18px minimum (1.125rem), Headings: 28-36px (1.75rem - 2.25rem)
- Line height: 1.6 body, 1.2 headings
- Primary: #38C6F4, Secondary: #35B678, Dark: #18212C, Light: #F8FAFB, #FFFFFF
- 8px grid system (0.5rem increments)
- Container max-width: 1200px centered
- Section padding: 80px vertical (desktop), 48px (mobile)
- CSS Grid for layouts, Flexbox for component alignment

### Claude's Discretion
All detailed implementation choices (exact spacing values, transition durations, shadow values) are at Claude's discretion -- pure infrastructure phase.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UX-02 | Body text min 18px, headings 28-36px (audience 45+) | Typography token system with rem-based sizing; verified readable at these sizes |
| UX-03 | Touch targets min 48x48px on mobile | Base button/link styles with min-height/min-width 48px and appropriate padding |
| UX-04 | Color scheme per brandbook: #38C6F4, #35B678, #18212C | Full color token system; WCAG contrast analysis completed with usage constraints |
| UX-05 | Fonts Inter + Manrope, self-hosted WOFF2 | Variable WOFF2 files with cyrillic subset; font-face declarations; preload strategy |
| UX-07 | High contrast text on backgrounds (WCAG AA minimum) | Contrast ratios verified; safe/unsafe pairings documented; darker accent variants identified |
</phase_requirements>

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| HTML5 | Current | Base document structure | Semantic elements for accessibility and SEO |
| Vanilla CSS | Current | All styling, design tokens | Project constraint: no frameworks. Custom properties cover token needs |
| Inter | v4.1 (variable) | Body text font | Brandbook spec. Excellent readability, full cyrillic support |
| Manrope | v4.5 (variable) | Heading font | Brandbook spec. Clean geometric sans-serif, cyrillic support |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| google-webfonts-helper | Download WOFF2 files with subset selection | One-time font file preparation |
| WebAIM Contrast Checker | Verify color pairings meet WCAG AA | During token definition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Variable WOFF2 | Static weight WOFF2 files | Variable = 1 file per font vs 4-6 files; variable is smaller total but slightly larger single file. Variable is better here (fewer requests, weight flexibility) |
| BEM | Utility classes | BEM is self-documenting without tooling; utility classes need Tailwind/build step |
| CSS custom properties | Sass variables | Custom properties cascade and can be overridden per-context; Sass adds build step for zero benefit on this project |

## Architecture Patterns

### Recommended Project Structure
```
/
├── index.html              # Main landing page
├── css/
│   └── styles.css          # Single CSS file with all design system + component styles
├── js/
│   └── main.js             # All JS (form, accordion, smooth scroll) -- later phases
└── assets/
    └── fonts/
        ├── inter-cyrillic-wght-normal.woff2
        ├── inter-latin-wght-normal.woff2
        ├── manrope-cyrillic-wght-normal.woff2
        └── manrope-latin-wght-normal.woff2
```

### Pattern 1: CSS Custom Properties as Design Tokens
**What:** All design values (colors, spacing, typography, breakpoints) defined as CSS custom properties on `:root`
**When to use:** Always -- every style rule references tokens, never hardcoded values

```css
:root {
  /* Colors - Primary */
  --color-primary: #38C6F4;
  --color-secondary: #35B678;
  --color-dark: #18212C;
  --color-light: #F8FAFB;
  --color-white: #FFFFFF;

  /* Colors - Text (WCAG AA safe on light backgrounds) */
  --color-text-primary: #18212C;       /* 16.24:1 on white -- PASS */
  --color-text-on-dark: #FFFFFF;       /* 16.24:1 on dark -- PASS */
  --color-text-on-primary: #18212C;    /* 8.16:1 on blue -- PASS */
  --color-text-on-secondary: #18212C;  /* 6.28:1 on green -- PASS */

  /* Typography */
  --font-body: 'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Manrope Variable', 'Manrope', system-ui, -apple-system, sans-serif;
  --font-size-base: 1.125rem;    /* 18px */
  --font-size-sm: 1rem;          /* 16px */
  --font-size-lg: 1.25rem;       /* 20px */
  --font-size-h1: 2.25rem;       /* 36px */
  --font-size-h2: 2rem;          /* 32px */
  --font-size-h3: 1.75rem;       /* 28px */
  --line-height-body: 1.6;
  --line-height-heading: 1.2;

  /* Spacing (8px grid) */
  --space-1: 0.5rem;   /* 8px */
  --space-2: 1rem;     /* 16px */
  --space-3: 1.5rem;   /* 24px */
  --space-4: 2rem;     /* 32px */
  --space-5: 2.5rem;   /* 40px */
  --space-6: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-10: 5rem;    /* 80px */

  /* Layout */
  --container-max: 1200px;
  --section-padding-mobile: var(--space-6);   /* 48px */
  --section-padding-desktop: var(--space-10); /* 80px */

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(24, 33, 44, 0.06);
  --shadow-md: 0 4px 12px rgba(24, 33, 44, 0.08);
  --shadow-lg: 0 8px 24px rgba(24, 33, 44, 0.12);

  /* Border radius */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-full: 9999px;
}
```

### Pattern 2: BEM Naming Convention
**What:** Block__Element--Modifier class naming for all components
**When to use:** Every CSS class in the project

```css
/* Block */
.section { }

/* Element */
.section__title { }
.section__content { }

/* Modifier */
.section--dark { }
.section--compact { }

/* Component example */
.card { }
.card__icon { }
.card__title { }
.card__text { }
.card--highlighted { }
```

### Pattern 3: Mobile-First Responsive
**What:** Base styles target mobile; min-width queries add tablet/desktop overrides
**When to use:** All layout and sizing rules

```css
/* Base: mobile */
.section {
  padding: var(--section-padding-mobile) var(--space-2);
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .section {
    padding: var(--section-padding-mobile) var(--space-4);
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .section {
    padding: var(--section-padding-desktop) var(--space-4);
  }
}
```

### Pattern 4: Font Loading Strategy
**What:** Self-hosted variable WOFF2 with preload and font-display: swap
**When to use:** Font declarations at top of styles.css

```css
/* Inter Variable - Latin */
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('../assets/fonts/inter-latin-wght-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Inter Variable - Cyrillic */
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('../assets/fonts/inter-cyrillic-wght-normal.woff2') format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* Manrope Variable - Latin */
@font-face {
  font-family: 'Manrope Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 800;
  src: url('../assets/fonts/manrope-latin-wght-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Manrope Variable - Cyrillic */
@font-face {
  font-family: 'Manrope Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 800;
  src: url('../assets/fonts/manrope-cyrillic-wght-normal.woff2') format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

HTML preload in `<head>`:
```html
<!-- Preload critical fonts (cyrillic first -- primary content language) -->
<link rel="preload" href="assets/fonts/inter-cyrillic-wght-normal.woff2"
      as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/manrope-cyrillic-wght-normal.woff2"
      as="font" type="font/woff2" crossorigin>
```

Note: The `crossorigin` attribute is required for font preloads even when self-hosted -- fonts are always fetched as CORS resources.

### Pattern 5: CSS File Organization
**What:** Single styles.css organized by logical sections with comment headers
**When to use:** Always -- file grows across phases but stays organized

```css
/* ==========================================================================
   1. FONTS
   ========================================================================== */

/* ==========================================================================
   2. DESIGN TOKENS (Custom Properties)
   ========================================================================== */

/* ==========================================================================
   3. RESET & BASE
   ========================================================================== */

/* ==========================================================================
   4. TYPOGRAPHY
   ========================================================================== */

/* ==========================================================================
   5. LAYOUT (Container, Grid, Section)
   ========================================================================== */

/* ==========================================================================
   6. COMPONENTS (Buttons, Cards, etc.)
   ========================================================================== */

/* ==========================================================================
   7. SECTIONS (Hero, Problem, etc.) -- added in later phases
   ========================================================================== */

/* ==========================================================================
   8. UTILITIES
   ========================================================================== */

/* ==========================================================================
   9. MEDIA QUERIES
   ========================================================================== */
```

### Anti-Patterns to Avoid
- **Color tokens without usage context:** Do NOT create `--color-blue` and let developers guess where it is safe. Always pair with `--color-text-on-*` tokens that encode WCAG-safe pairings.
- **px-based font sizes:** Use rem throughout. The user decision specifies rem-based sizing. Never hardcode px for text.
- **max-width media queries:** The project uses mobile-first (min-width). Never mix max-width queries in -- it creates cascade conflicts.
- **Nesting media queries inside component rules:** Keep media queries in a dedicated section at the end of styles.css for maintainability in a single-file architecture.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS reset | Custom reset from scratch | Modern CSS reset (Andy Bell's or Josh Comeau's) | Edge cases across browsers are deceptively complex; proven resets handle them |
| Font subsetting | Manual pyftsubset commands | google-webfonts-helper or Fontsource pre-built subsets | Pre-built cyrillic+latin subsets are already optimized |
| Contrast checking | Mental math on hex values | Programmatic verification or WebAIM checker | Human judgment of contrast is unreliable; the math is precise |
| System font fallback stack | Guessing fallback fonts | Standard system font stack: `system-ui, -apple-system, sans-serif` | Well-established cross-platform fallback chain |

**Key insight:** For a no-build-tooling project, use pre-built font files from Fontsource or google-webfonts-helper rather than running subsetting tools. The variable WOFF2 files with cyrillic subset are already optimized and ready to self-host.

## Common Pitfalls

### Pitfall 1: Brand Colors Used as Text on White
**What goes wrong:** #38C6F4 (blue) and #35B678 (green) used as link or text color on white/light backgrounds -- fails WCAG AA.
**Why it happens:** Colors look visually distinct but have poor luminance contrast (1.99:1 and 2.59:1 respectively).
**How to avoid:** Encode the constraint in token naming. Use `--color-primary` only for backgrounds or decorative elements. For text that must be colored, use darker variants: `--color-primary-dark: #0E7490` (5.36:1 on white, PASS) or `--color-secondary-dark: #047857` (5.48:1 on white, PASS).
**Warning signs:** Any CSS rule that sets `color: var(--color-primary)` on a light background element.

### Pitfall 2: Missing Cyrillic Subset
**What goes wrong:** Font files downloaded without cyrillic subset -- Russian text renders in fallback system font.
**Why it happens:** Default downloads often include only latin subset.
**How to avoid:** Always download both latin AND cyrillic subsets. Use `unicode-range` in @font-face to load cyrillic only when needed (as shown in Pattern 4). Test with actual Russian text immediately.
**Warning signs:** Font file under 20KB (likely missing subsets). Russian characters appearing in a different typeface.

### Pitfall 3: Font Preload Without crossorigin
**What goes wrong:** Preloaded font file gets fetched twice -- once by preload (anonymous CORS), once by CSS (also CORS). Without matching `crossorigin` attribute, browser treats them as different requests.
**Why it happens:** Fonts are always CORS resources regardless of same-origin status.
**How to avoid:** Always include `crossorigin` (no value needed) on `<link rel="preload" as="font">`.
**Warning signs:** Network tab shows the same font file loaded twice.

### Pitfall 4: rem Sizing Without html Font Size Reset
**What goes wrong:** rem values drift from expected pixel equivalents because browser default font-size varies or user has changed it.
**Why it happens:** rem is relative to root font-size which defaults to 16px but is not guaranteed.
**How to avoid:** Set `html { font-size: 100%; }` (not a px value -- respect user preferences for accessibility). Then calculate all rem values based on 16px = 1rem. This is especially important for the 45+ audience who may have increased their browser font size.
**Warning signs:** Layout looks different across browsers or when testing with browser zoom.

### Pitfall 5: Forgetting Touch Target Sizes
**What goes wrong:** Buttons and links are visually large but actual clickable area is smaller than 48x48px due to tight padding.
**Why it happens:** Developers focus on visual size, not interaction area.
**How to avoid:** Set `min-height: 48px; min-width: 48px;` on all interactive elements in base styles. Use padding (not just font-size) to reach the target. For inline links, consider increasing line-height or adding padding.
**Warning signs:** Mobile testing shows difficulty tapping buttons/links accurately.

## Code Examples

### Base HTML Structure (index.html skeleton)
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Preload critical fonts -->
  <link rel="preload" href="assets/fonts/inter-cyrillic-wght-normal.woff2"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/manrope-cyrillic-wght-normal.woff2"
        as="font" type="font/woff2" crossorigin>

  <title>MedicusUnion KZ</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Sections added in phases 2-5 -->
  <!-- JS added in phases 6-7 -->
</body>
</html>
```

### Modern CSS Reset (adapted from Andy Bell)
```css
/* Box sizing */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Remove default margins */
body, h1, h2, h3, h4, p, figure, blockquote, dl, dd {
  margin: 0;
}

/* Remove list styles on ul/ol with role="list" */
ul[role="list"], ol[role="list"] {
  list-style: none;
  padding: 0;
}

/* Core body defaults */
html {
  font-size: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: var(--line-height-body);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Images */
img, picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for form elements */
input, button, textarea, select {
  font: inherit;
}

/* Remove animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Base Button Component
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;           /* UX-03: touch target */
  min-width: 48px;            /* UX-03: touch target */
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-heading);
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-normal),
              transform var(--transition-fast);
}

.button:active {
  transform: scale(0.98);
}

.button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);  /* dark text on blue -- 8.16:1 PASS */
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-on-secondary); /* dark text on green -- 6.28:1 PASS */
}
```

### Container and Section Base
```css
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-2);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-4);
  }
}

.section {
  padding-block: var(--section-padding-mobile);
}

@media (min-width: 1024px) {
  .section {
    padding-block: var(--section-padding-desktop);
  }
}

.section--dark {
  background-color: var(--color-dark);
  color: var(--color-text-on-dark);
}
```

## WCAG AA Contrast Verification Results

Verified programmatically on 2026-03-23:

| Combination | Ratio | AA Normal (4.5:1) | AA Large (3:1) |
|-------------|------:|:------------------:|:--------------:|
| #18212C on #FFFFFF | 16.24 | PASS | PASS |
| #18212C on #F8FAFB | 15.52 | PASS | PASS |
| #38C6F4 on #FFFFFF | 1.99 | FAIL | FAIL |
| #38C6F4 on #18212C | 8.16 | PASS | PASS |
| #35B678 on #FFFFFF | 2.59 | FAIL | FAIL |
| #35B678 on #18212C | 6.28 | PASS | PASS |
| #FFFFFF on #38C6F4 | 1.99 | FAIL | FAIL |
| #FFFFFF on #35B678 | 2.59 | FAIL | FAIL |
| #FFFFFF on #18212C | 16.24 | PASS | PASS |

**Safe pairings for text:**
- Dark text (#18212C) on any light background -- always safe
- White text on dark background (#18212C) -- always safe
- Dark text on blue (#38C6F4) button backgrounds -- safe
- Dark text on green (#35B678) button backgrounds -- safe

**Unsafe pairings (never use for text):**
- Blue or green text on white/light backgrounds
- White text on blue or green backgrounds

**Darker accent variants for text on white (if needed in later phases):**
- `--color-primary-dark: #0E7490` -- 5.36:1 on white (PASS AA normal)
- `--color-secondary-dark: #047857` -- 5.48:1 on white (PASS AA normal)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Multiple static WOFF2 weight files | Single variable WOFF2 file | 2023+ (broad browser support) | Fewer HTTP requests, smaller total size, continuous weight control |
| Google Fonts CDN | Self-hosted WOFF2 | 2022+ (post Chrome partitioning) | Chrome partitioned cache means CDN fonts no longer shared across sites; self-hosting is faster |
| Sass/LESS variables | CSS custom properties | 2020+ | No build step, runtime overridable, cascade-aware |
| normalize.css | Modern CSS reset | 2023+ | Lighter, more opinionated, works with modern browser defaults |
| font-display: optional | font-display: swap | Ongoing | swap better for CLS when fonts load quickly (self-hosted); optional better for slow CDN fonts |

**Deprecated/outdated:**
- Google Fonts CDN for performance: Chrome cache partitioning (2020) eliminated the shared-cache benefit. Self-hosting is now faster.
- WOFF1 format: All modern browsers support WOFF2. No need for WOFF1 fallback.
- `-webkit-` prefixes for flexbox/grid: No longer needed in any supported browser.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no JS framework = no unit tests for CSS) |
| Config file | none -- Wave 0 creates checklist |
| Quick run command | Open `index.html` in browser, inspect with DevTools |
| Full suite command | Manual checklist verification across viewports |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UX-02 | Body text >= 18px, headings 28-36px | manual | DevTools computed styles inspection | N/A |
| UX-03 | Touch targets >= 48x48px | manual | DevTools element sizing inspection on mobile viewport | N/A |
| UX-04 | Brand colors match #38C6F4, #35B678, #18212C | manual | DevTools computed color values | N/A |
| UX-05 | Inter + Manrope load as self-hosted WOFF2 | manual | DevTools Network tab: verify font files load from /assets/fonts/ | N/A |
| UX-07 | Text contrast >= 4.5:1 (AA normal) | manual | DevTools accessibility audit / Lighthouse | N/A |

### Sampling Rate
- **Per task commit:** Open index.html, verify no visual regressions
- **Per wave merge:** Full viewport sweep (320px, 768px, 1024px, 1440px)
- **Phase gate:** All 5 requirements manually verified with DevTools evidence

### Wave 0 Gaps
None -- this is a CSS/HTML phase with no testable JS. Validation is visual inspection and DevTools verification. A Lighthouse accessibility audit at phase gate will catch contrast issues programmatically.

## Open Questions

1. **Exact variable font file names from Fontsource/google-webfonts-helper**
   - What we know: Files follow pattern `{font}-{subset}-wght-normal.woff2`; both fonts support cyrillic subset in variable WOFF2
   - What is unclear: Exact unicode-range values may differ slightly between sources
   - Recommendation: Download from Fontsource npm package or google-webfonts-helper; verify file names match @font-face src paths. Use Fontsource unicode-range values as reference.

2. **Inter font version: 4.0 vs 4.1**
   - What we know: v4.1 is latest on GitHub (rsms/inter); includes hinted WOFF files
   - What is unclear: Whether google-webfonts-helper or Fontsource has updated to 4.1
   - Recommendation: Download directly from GitHub releases if Fontsource lags. Variable WOFF2 API is stable across minor versions.

## Sources

### Primary (HIGH confidence)
- WCAG 2.1 Understanding SC 1.4.3 (https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) -- contrast ratio requirements: 4.5:1 normal text, 3:1 large text
- Fontsource Inter (https://fontsource.org/fonts/inter/install) -- variable font, subsets (cyrillic confirmed), weight range 100-900
- Fontsource Manrope (https://fontsource.org/fonts/manrope/install) -- variable font, subsets (cyrillic confirmed), weight range 200-800
- web.dev font best practices (https://web.dev/articles/font-best-practices) -- font-display, preload, crossorigin requirement
- rsms/inter GitHub (https://github.com/rsms/inter) -- Inter v4.1, official source

### Secondary (MEDIUM confidence)
- Google Webfonts Helper (https://gwfh.mranftl.com) -- WOFF2 download with subset selection (SPA did not render for verification)
- web.dev optimize webfonts (https://web.dev/articles/optimize-webfont-loading) -- preload strategy, font-display values

### Tertiary (LOW confidence)
- Exact file sizes for variable WOFF2 subsets -- not verified, estimate ~50-80KB per font (both subsets combined)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- pure HTML/CSS, no version dependencies, well-established patterns
- Architecture: HIGH -- BEM + custom properties + mobile-first is mainstream, well-documented
- Pitfalls: HIGH -- contrast ratios verified programmatically, font loading issues well-documented
- Font files: MEDIUM -- exact file names and unicode-ranges need verification during download

**Research date:** 2026-03-23
**Valid until:** 2026-06-23 (stable domain -- CSS fundamentals and font formats do not change rapidly)
