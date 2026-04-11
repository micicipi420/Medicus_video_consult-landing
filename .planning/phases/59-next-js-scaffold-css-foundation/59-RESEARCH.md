# Phase 59: Next.js Scaffold & CSS Foundation - Research

**Researched:** 2026-04-10
**Domain:** Next.js 15 project scaffolding + Liquid Glass CSS token migration via Tailwind CSS v4 PostCSS pipeline
**Confidence:** HIGH

## Summary

This phase creates a Next.js 15 App Router project and proves the CSS pipeline by rendering all Liquid Glass materials identically to the current production site. The migration path is well-documented: the existing CSS architecture (theme.css tokens, liquid-glass.css classes, squircles.css masks) transfers to Next.js with minimal changes. The primary risks are the Turbopack backdrop-filter stripping bug (#78302, still OPEN) and CSS import order divergence between Turbopack (dev) and Webpack (prod).

The current project already uses Tailwind CSS v4's `@theme inline` directive and `@import` chain -- the exact format Next.js expects via `@tailwindcss/postcss`. The font files (Inter + Manrope WOFF2) exist in `assets/fonts/` and should be loaded via `next/font/local`. The SF Pro Display/Rounded system-font-only `fonts.css` is NOT ported -- those are Apple-only `local()` declarations that don't work cross-platform.

**Primary recommendation:** Initialize via `pnpm create next-app@15` with TypeScript/Tailwind/ESLint/App Router/src-dir flags, then copy the three CSS files (theme.css content into globals.css, liquid-glass.css and squircles.css as separate imports) with one key change: reverse all backdrop-filter declaration order to standard-first, -webkit- second.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion -- pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from v6.0 research:
- Next.js 15.5.x (not 16) -- wider ecosystem compat
- Tailwind CSS v4 via @tailwindcss/postcss -- replaces standalone CLI
- Glass CSS stays global (single globals.css @import chain)
- backdrop-filter standard-first, -webkit- second (Turbopack #78302)
- CSS import order: explicit @import chain + "sideEffects": ["*.css"] in package.json
- Skip @squircle-js/react -- CSS squircles sufficient (keep as Tailwind @layer components)
- Turbopack has backdrop-filter bug -- use Webpack for production

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure phase.

### Deferred Ideas (OUT OF SCOPE)
None -- infrastructure phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCAF-01 | Next.js 15 App Router initialized with TypeScript, ESLint, Tailwind CSS v4 | Standard Stack section: exact packages, versions, create-next-app command, postcss.config.mjs |
| SCAF-02 | All CSS glass tokens migrated to Tailwind config and render identically | Architecture Patterns section: CSS Organization subsection with exact @import chain, token mapping, @theme inline migration |
| SCAF-04 | Glass CSS (liquid-glass.css, squircles.css) connected as global styles working via className on React components | Architecture Patterns section: globals.css structure, sideEffects config, test page pattern |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.15 | App Router framework | Latest 15.x patch; locked decision from v6.0 research; security patches active [VERIFIED: npm registry] |
| React | 19.x (ships with Next.js 15) | UI runtime | Peer dependency of Next.js 15.5.x [VERIFIED: npm registry peerDependencies] |
| TypeScript | 5.x | Type safety | Next.js default; configured by create-next-app [VERIFIED: npm registry -- 6.0.2 latest, but Next.js 15 ships with 5.x config] |
| Tailwind CSS | 4.2.2 | Utility-first CSS | Current production version; CSS-first config via @theme matches existing tokens [VERIFIED: npm registry] |
| @tailwindcss/postcss | 4.2.2 | PostCSS plugin for Next.js pipeline | Replaces standalone @tailwindcss/cli; locked decision [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tw-animate-css | 1.4.0 | Animation utilities for shadcn/ui | Replaces deprecated tailwindcss-animate; install now for future shadcn/ui init [VERIFIED: npm registry] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/postcss | @tailwindcss/cli (standalone) | CLI was used in current project; PostCSS plugin is required for Next.js build pipeline integration -- not optional |
| next/font/local | Manual @font-face in CSS | next/font/local provides automatic preload, font-display:swap, CSS variable injection; manual approach works but misses optimization |
| pnpm | npm | pnpm handles React 19 peer deps cleanly; strict node_modules structure; locked decision from v6.0 research |

**Installation:**

```bash
# Step 1: Create Next.js 15 project in a subdirectory (same repo)
pnpm create next-app@15 next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack

# Step 2: Enter project directory
cd next

# Step 3: Add tw-animate-css for future shadcn/ui compatibility
pnpm add tw-animate-css
```

**Version verification:** [VERIFIED: npm registry 2026-04-10]
- `next@15.5.15` -- latest 15.x patch
- `tailwindcss@4.2.2` -- latest v4
- `@tailwindcss/postcss@4.2.2` -- matches tailwindcss
- `tw-animate-css@1.4.0` -- latest
- `create-next-app@15.5.15` -- latest 15.x

## Architecture Patterns

### Recommended Project Structure

```
next/                          # Next.js project subdirectory (same repo)
  src/
    app/
      layout.tsx               # Root layout: html, body, fonts, globals.css import
      globals.css              # Single CSS entry: tailwind + theme tokens + glass + squircles
      page.tsx                 # Blank home page (scaffold only)
      test-glass/
        page.tsx               # Glass test page for visual verification (SCAF-04)
    styles/
      liquid-glass.css         # Ported from src/styles/liquid-glass.css (backdrop-filter order fixed)
      squircles.css            # Ported from src/styles/squircles.css (no changes)
    fonts/                     # Inter + Manrope WOFF2 files (copied from assets/fonts/)
  public/
    favicon.ico
  next.config.ts               # output: "standalone", images config
  postcss.config.mjs           # @tailwindcss/postcss only
  package.json                 # sideEffects: ["*.css"]
  tsconfig.json                # Generated by create-next-app
```

### Pattern 1: Single CSS Entry Point (globals.css)

**What:** All glass CSS flows through one file with explicit @import ordering. No CSS imports from component files.
**When to use:** Always -- this is the only safe pattern for deterministic CSS ordering between Turbopack (dev) and Webpack (prod).

```css
/* src/app/globals.css */

/* 1. Tailwind base -- automatic source detection in Next.js (no source(none)) */
@import "tailwindcss";

/* 2. Design system layers -- explicit order matters */
@import "../styles/liquid-glass.css";
@import "../styles/squircles.css";

/* 3. Dark mode variant */
@custom-variant dark (&:is(.dark *));

/* 4. Root tokens -- copy verbatim from current theme.css :root block */
:root {
  /* All --mu-*, --liquid-*, --squircle-mask-*, --ease-*, --dur-* tokens */
  /* ... (entire :root block from theme.css) ... */
}

/* 5. Dark mode overrides */
.dark {
  /* ... (entire .dark block from theme.css) ... */
}

/* 6. Tailwind theme extensions */
@theme inline {
  /* ... (entire @theme inline block from theme.css) ... */
}

/* 7. Layer definitions */
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }
```

**Source:** [VERIFIED: Tailwind CSS v4 Next.js guide -- tailwindcss.com/docs/guides/nextjs]

**Key migration changes from current tailwind.css:**
- `@import 'tailwindcss' source(none)` becomes `@import "tailwindcss"` -- Next.js PostCSS handles source detection automatically, scans `src/` for class usage [VERIFIED: STACK.md research + Tailwind docs]
- `@source '../../*.html'` is REMOVED -- Next.js scans .tsx files, not .html
- `@import './fonts.css'` is REMOVED -- replaced by `next/font/local` in layout.tsx

**What stays identical (zero changes):**
- All `@theme inline` token declarations
- All `:root` and `.dark` CSS custom properties
- All `@layer base/components/utilities` rules
- `@custom-variant dark (&:is(.dark *))` -- already compatible

### Pattern 2: backdrop-filter Standard-First Order

**What:** In all glass classes, place the standard `backdrop-filter` BEFORE `-webkit-backdrop-filter` to avoid Turbopack stripping bug.
**When to use:** Every glass class in liquid-glass.css.

```css
/* BEFORE (current production -- Turbopack strips line 3): */
-webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);
-webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));

/* AFTER (Next.js -- standard first, Turbopack keeps it): */
backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
-webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);
-webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
```

**Source:** [VERIFIED: GitHub Issue #78302 -- still OPEN as of 2026-04-10]

**Affected classes (all must be updated):**
- `.liquid-regular` (line 87-89)
- `.liquid-nav` (line 119-121)
- `.liquid-clear` (line 151-153)
- `.liquid-fluted` (line 200-202)
- `.liquid-card` (line 246-248)
- `.liquid-btn-secondary` (line 319-321)
- `.stats-glass` (line 360-362)
- `.liquid-header-backdrop` (line 473-474)
- All `html[data-refract="true"]` rules (lines 493-520)

### Pattern 3: Font Loading via next/font/local

**What:** Self-host Inter + Manrope variable WOFF2 files using next/font/local for automatic preloading and font-display:swap.
**When to use:** In layout.tsx for the root layout.

```typescript
// src/app/layout.tsx
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    { path: '../fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/inter-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-body',
  display: 'swap',
});

const manrope = localFont({
  src: [
    { path: '../fonts/manrope-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/manrope-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-heading',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Source:** [VERIFIED: next/font/local API -- nextjs.org/docs; font files confirmed in assets/fonts/]

**Critical note:** The current `fonts.css` uses SF Pro Display/Rounded via `local()` only (Apple system fonts). These do NOT port -- they are system-font-only declarations. The project has Inter + Manrope WOFF2 files in `assets/fonts/` which are the actual brand fonts from PROJECT.md. Use these via next/font/local. The `--font-family-body` and `--font-family-heading` CSS variables are already referenced throughout theme.css and work without changes once the font variable names match.

### Pattern 4: package.json sideEffects for CSS Ordering

**What:** Mark CSS files as having side effects to prevent Webpack from reordering them.
**When to use:** Always -- in the Next.js project's package.json.

```json
{
  "sideEffects": ["*.css"]
}
```

**Source:** [VERIFIED: GitHub Issue #79531 -- CSS import order differs between dev turbopack and prod webpack]

### Pattern 5: postcss.config.mjs

**What:** Minimal PostCSS config with only @tailwindcss/postcss.
**When to use:** Required at project root.

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Source:** [VERIFIED: tailwindcss.com/docs/guides/nextjs]

**Note:** Do NOT add postcss-import -- Tailwind v4 handles @import natively.

### Pattern 6: next.config.ts

**What:** Minimal Next.js config for scaffold phase.
**When to use:** Required at project root.

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',  // Required for future Docker deployment (DOCK-01)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
```

**Source:** [VERIFIED: STACK.md research + nextjs.org/docs/app/getting-started/deploying]

### Pattern 7: Glass Test Page for Visual Verification

**What:** A dedicated test page rendering all glass material classes for side-by-side comparison with production.
**When to use:** Phase 59 success criterion #3.

```tsx
// src/app/test-glass/page.tsx
export default function TestGlassPage() {
  return (
    <div className="min-h-screen bg-mu-text-50 p-8 space-y-8">
      <h1 className="text-2xl font-medium">Glass Materials Test</h1>

      {/* Background for backdrop-filter to blur against */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #38C6F4 0%, #6FDEA9 50%, #FFA25C 100%)' }}>
        <div className="p-8 space-y-6">
          <div className="squircle-lg liquid-regular p-6">
            <p>.liquid-regular</p>
          </div>
          <div className="squircle-lg liquid-card p-6">
            <p>.liquid-card</p>
          </div>
          <div className="squircle-lg liquid-clear p-6">
            <p>.liquid-clear</p>
          </div>
          <div className="squircle-lg liquid-fluted p-6">
            <p>.liquid-fluted</p>
          </div>
          <div className="liquid-nav p-4">
            <p>.liquid-nav</p>
          </div>
          <div className="squircle-md liquid-btn-primary px-6 py-3 inline-block">
            <span>.liquid-btn-primary</span>
          </div>
          <div className="squircle-md liquid-btn-secondary px-6 py-3 inline-block">
            <span>.liquid-btn-secondary</span>
          </div>
          <div className="squircle-xl stats-glass p-6">
            <p>.stats-glass</p>
          </div>
        </div>
      </div>

      {/* Squircle shapes test */}
      <div className="flex gap-4">
        <div className="squircle-md bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs">.squircle-md</div>
        <div className="squircle-lg bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs">.squircle-lg</div>
        <div className="squircle-xl bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs">.squircle-xl</div>
        <div className="squircle-full bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs">.squircle-full</div>
      </div>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Importing CSS from component files:** Never import liquid-glass.css or squircles.css from individual React components. All glass CSS must flow through globals.css single entry point.
- **Using `source(none)` in Next.js:** The current project uses `@import 'tailwindcss' source(none)` with explicit `@source` glob. In Next.js, automatic source detection scans `src/` -- remove both `source(none)` and `@source`.
- **Keeping fonts.css as-is:** The SF Pro `local()` declarations only work on Apple devices. Use next/font/local with the actual WOFF2 files instead.
- **Using Turbopack for production builds:** Turbopack has the backdrop-filter stripping bug (#78302). Always use Webpack for `next build`. Turbopack is fine for `next dev`.
- **Adding postcss-import plugin:** Tailwind v4 handles @import natively. Adding postcss-import causes double-processing and ordering issues.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font preloading | Manual `<link rel="preload">` + @font-face | `next/font/local` | Handles preload, font-display, CSS variable injection, FOUT prevention automatically |
| CSS source detection | `@source` globs in CSS | Tailwind v4 automatic detection | Next.js project structure is standard; auto-detection scans src/ correctly |
| CSS import chain | JS-level CSS imports in components | Single globals.css @import chain | Prevents Turbopack/Webpack ordering divergence (Issue #79531) |
| PostCSS import handling | postcss-import plugin | @tailwindcss/postcss built-in | Tailwind v4 handles @import natively; external plugin causes conflicts |

**Key insight:** The entire CSS migration is a file copy + one systematic find-and-replace (backdrop-filter order). The token architecture was already designed for Tailwind v4 -- no redesign needed.

## Common Pitfalls

### Pitfall 1: Turbopack Strips backdrop-filter (Standard After -webkit-)

**What goes wrong:** When `-webkit-backdrop-filter` appears BEFORE `backdrop-filter`, Turbopack's LightningCSS-based parser drops the standard declaration. All glass elements render with zero blur in Chrome/Firefox during `next dev --turbo`.
**Why it happens:** Turbopack treats the -webkit- line as canonical and removes the unprefixed line as "duplicate."
**How to avoid:** Reverse declaration order in ALL 9+ glass classes: `backdrop-filter` first, `-webkit-backdrop-filter` second. See Pattern 2 above.
**Warning signs:** Glass elements appear as plain semi-transparent boxes (no blur) in Chrome during dev.
**Source:** [VERIFIED: GitHub Issue #78302 -- still OPEN]

### Pitfall 2: CSS Import Order Diverges Between Dev and Prod

**What goes wrong:** Turbopack follows JS import order for CSS. Webpack may reorder CSS it considers side-effect-free. Glass tokens from theme.css may load AFTER liquid-glass.css in prod, breaking var() references.
**Why it happens:** Different bundler heuristics for CSS ordering.
**How to avoid:** (1) Use single globals.css entry with @import chain, (2) Add `"sideEffects": ["*.css"]` to package.json, (3) Never import CSS from component files.
**Warning signs:** Glass works in dev but breaks in `next build && next start`, or vice versa.
**Source:** [VERIFIED: GitHub Issues #79531, #79535]

### Pitfall 3: @theme inline vs @theme (non-inline)

**What goes wrong:** Using `@theme` (without `inline`) generates utility classes from the tokens but also emits CSS custom properties to `:root`. With `@theme inline`, the tokens become Tailwind utilities but do NOT emit redundant `:root` properties -- your explicit `:root {}` block handles that. Using the wrong variant causes token duplication or missing utilities.
**Why it happens:** Tailwind v4 has two @theme modes. The current project uses `@theme inline` specifically to avoid double-declaration.
**How to avoid:** Copy the existing `@theme inline` block exactly. Do not change to `@theme` without inline.
**Warning signs:** Duplicate CSS custom properties in DevTools, or Tailwind utilities like `bg-mu-blue` not resolving.
**Source:** [VERIFIED: tailwindcss.com/blog/tailwindcss-v4 -- @theme directive docs]

### Pitfall 4: SF Pro Font Declarations Don't Port

**What goes wrong:** Copying `fonts.css` as-is to Next.js. The `local()` font sources (SF Pro Display, SF Pro Rounded) only work on macOS/iOS. On Windows/Linux/Android, these fonts don't exist and the fallback chain kicks in, but the WOFF2 files are never loaded because there's no URL source.
**Why it happens:** The v5.0 project switched to SF Pro system fonts. The brand fonts (Inter + Manrope) have WOFF2 files in `assets/fonts/` but fonts.css doesn't reference them.
**How to avoid:** Use `next/font/local` with the Inter + Manrope WOFF2 files from `assets/fonts/`. Map to `--font-family-body` and `--font-family-heading` CSS variables. Do NOT port fonts.css.
**Warning signs:** Site renders with system fonts instead of Inter/Manrope on non-Apple devices.
**Source:** [VERIFIED: assets/fonts/ contains inter-*.woff2 and manrope-*.woff2]

### Pitfall 5: Missing --liquid-tint-* Default Tokens

**What goes wrong:** Glass classes reference `--liquid-tint-h`, `--liquid-tint-s`, `--liquid-tint-l`, `--liquid-tint-a` via `hsla()`. These are set by section tint classes (`.section-tint-cool`, etc.) but have defaults in `:root`. If the `:root` defaults are missed during copy, glass backgrounds break on untinted sections.
**Why it happens:** The tint tokens are at the bottom of theme.css (after line 596 in liquid-glass.css actually) and easy to miss during manual copy.
**How to avoid:** Copy the ENTIRE liquid-glass.css including Section 12/12.5 (tint consumption). Verify `:root` contains `--liquid-tint-h: 0; --liquid-tint-s: 0%; --liquid-tint-l: 50%; --liquid-tint-a: 0;`.
**Warning signs:** `hsla()` in glass backgrounds returns invalid color values.
**Source:** [VERIFIED: liquid-glass.css lines 596-598, theme.css does NOT contain these -- they're in liquid-glass.css Section 12]

## Code Examples

### Complete globals.css @import Chain

```css
/* src/app/globals.css -- Phase 59 scaffold */
@import "tailwindcss";
@import "tw-animate-css";

/* Design system layers -- MUST be after tailwindcss */
@import "../styles/liquid-glass.css";
@import "../styles/squircles.css";

/* === Theme tokens (from current src/styles/theme.css) === */
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --font-family-body: var(--font-family-body-next, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  --font-family-heading: var(--font-family-heading-next, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  /* ... rest of :root tokens (copy verbatim from theme.css) ... */
}

/* ... .dark, @theme inline, @layer blocks ... */
```

**Note:** The `--font-family-body` and `--font-family-heading` values are updated to reference Inter/Manrope (from WOFF2) instead of SF Pro (system-only). The `var(--font-family-body-next, ...)` pattern allows next/font/local to inject the font via CSS variable, with a CSS-only fallback chain.

### Root Layout with Fonts

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: [
    { path: '../fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/inter-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-body-next',
  display: 'swap',
});

const manrope = localFont({
  src: [
    { path: '../fonts/manrope-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/manrope-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-heading-next',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedicusUnion -- онлайн-консультации с европейскими врачами',
  description: 'Второе мнение от врачей Германии, Израиля, Швейцарии. Онлайн-консультация не выходя из дома.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="relative bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
```

### postcss.config.mjs

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
```

### package.json sideEffects

```json
{
  "sideEffects": ["*.css"]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v4 standalone CLI (`@tailwindcss/cli`) | `@tailwindcss/postcss` PostCSS plugin | Required for Next.js (CLI can't integrate with build pipeline) | Different build tooling, same CSS output |
| `source(none)` + explicit `@source` glob | Automatic source detection | Next.js scans src/ automatically | Remove source(none) and @source directives |
| SF Pro Display/Rounded via `local()` | Inter + Manrope via `next/font/local` WOFF2 | Brand fonts restored for cross-platform | Fonts work on all devices, not just Apple |
| `fonts.css` @font-face | `next/font/local` in layout.tsx | Next.js font optimization | Automatic preload, font-display:swap, no FOUT |
| Makefile + build-pages.sh splicer | Next.js App Router layouts | Next.js handles layouts natively | Entire build pipeline replaced |

**Deprecated/outdated:**
- `@tailwindcss/cli` -- not usable with Next.js PostCSS pipeline; use `@tailwindcss/postcss` instead
- `tailwindcss-animate` -- replaced by `tw-animate-css` for Tailwind v4 compatibility
- `postcss-import` -- Tailwind v4 handles @import natively; do not install

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `next/font/local` supports multiple `src` entries for latin + cyrillic subsets in a single font definition | Code Examples -- font loading | If not supported, need separate localFont calls per subset or a single combined WOFF2 |
| A2 | `@import "tw-animate-css"` works in the globals.css @import chain alongside Tailwind v4 | Code Examples -- globals.css | If ordering conflict, move tw-animate-css import position or defer to Phase 60 (shadcn/ui init) |
| A3 | Turbopack `next dev --turbo` flag is still the default in `create-next-app@15` generated scripts | Architecture -- dev server | If not default, explicitly add `--turbo` to scripts for dev speed |

## Open Questions

1. **next/font/local multi-subset src array**
   - What we know: next/font/local accepts `src` as an array of objects with `path`, `weight`, `style`. The Inter font has separate latin and cyrillic WOFF2 files.
   - What's unclear: Whether Next.js correctly handles multiple subset files in one localFont call, or if they need separate declarations.
   - Recommendation: Test during implementation. If multi-src fails, use two separate localFont calls and combine CSS variables.

2. **Turbopack backdrop-filter fix timeline**
   - What we know: Issue #78302 is OPEN as of 2026-04-10. The workaround (standard-first order) is confirmed effective.
   - What's unclear: Whether newer Next.js 15.5.x patches have silently fixed this.
   - Recommendation: Apply the workaround regardless. Test with both `next dev` (Turbopack) and `next build && next start` (Webpack) after CSS migration.

3. **create-next-app --turbopack flag behavior**
   - What we know: create-next-app@15 added a `--turbopack` flag that configures the dev script to use Turbopack.
   - What's unclear: Whether it's now the default or still opt-in in 15.5.15.
   - Recommendation: Use the flag explicitly. If the generated dev script lacks `--turbo`, add it manually.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime | Yes | 25.8.1 (v22+ LTS recommended) | Node 25.x works fine; Next.js 15 requires >= 18.18 |
| pnpm | Package manager | Yes | 10.33.0 | npm works but pnpm preferred for React 19 peer deps |
| Git | Version control | Yes | (system) | -- |

**Missing dependencies with no fallback:**
- None -- all required tools are available.

**Missing dependencies with fallback:**
- Node.js 25.x is ahead of recommended 22.x LTS, but Next.js 15.5.x supports it. No action needed.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual visual comparison + dev server smoke test |
| Config file | None (scaffold phase -- no automated test framework yet) |
| Quick run command | `cd next && pnpm dev` then open localhost:3000/test-glass |
| Full suite command | `cd next && pnpm build && pnpm start` then compare test-glass page to production |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCAF-01 | Next.js 15 dev server starts without errors | smoke | `cd next && pnpm build` (exit code 0) | Wave 0 |
| SCAF-02 | Glass tokens available as Tailwind utilities + CSS vars | manual | Inspect test-glass page in DevTools -- check computed styles | Wave 0 |
| SCAF-04 | Glass classes render identically to production | manual | Side-by-side screenshot: production vs localhost:3000/test-glass | Wave 0 |

### Sampling Rate
- **Per task commit:** `cd next && pnpm build` (must exit 0)
- **Per wave merge:** Full build + visual comparison of test-glass page
- **Phase gate:** `pnpm build` succeeds AND test-glass page matches production visual

### Wave 0 Gaps
- [ ] Test page: `src/app/test-glass/page.tsx` -- covers SCAF-02, SCAF-04
- [ ] Build verification: `pnpm build` exit code check
- [ ] No automated visual regression yet (Playwright screenshots deferred to Phase 63+)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A -- scaffold only, no user auth |
| V3 Session Management | No | N/A -- no sessions |
| V4 Access Control | No | N/A -- no protected routes |
| V5 Input Validation | No | N/A -- no form inputs in this phase |
| V6 Cryptography | No | N/A -- no crypto |

### Known Threat Patterns for Next.js Scaffold

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Exposed .env in Docker build | Information Disclosure | .dockerignore excludes .env; next.config.ts does not embed secrets |
| Telemetry data collection | Information Disclosure | `NEXT_TELEMETRY_DISABLED=1` in Dockerfile (already in STACK.md patterns) |

No active security concerns for this scaffold phase -- it creates a blank project with CSS only.

## Sources

### Primary (HIGH confidence)
- [npm registry: next@15.5.15] -- version verified 2026-04-10
- [npm registry: tailwindcss@4.2.2] -- version verified 2026-04-10
- [npm registry: @tailwindcss/postcss@4.2.2] -- version verified 2026-04-10
- [npm registry: tw-animate-css@1.4.0] -- version verified 2026-04-10
- [Tailwind CSS v4 Next.js Guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS setup, globals.css
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- @theme directive, @import handling
- [GitHub Issue #78302](https://github.com/vercel/next.js/issues/78302) -- Turbopack backdrop-filter bug, OPEN
- [GitHub Issue #79531](https://github.com/vercel/next.js/issues/79531) -- CSS import order dev/prod divergence
- [GitHub Issue #79535](https://github.com/vercel/next.js/issues/79535) -- Missing CSS styles after 15.3.x upgrade
- Codebase: src/styles/tailwind.css, theme.css, liquid-glass.css, squircles.css, fonts.css -- exact tokens and classes audited
- Codebase: assets/fonts/ -- Inter + Manrope WOFF2 files confirmed present
- Codebase: partials/svg-defs.html -- SVG refraction filter definitions audited

### Secondary (MEDIUM confidence)
- [v6.0 STACK.md research](/.planning/research/STACK.md) -- installation commands, migration approach
- [v6.0 ARCHITECTURE.md research](/.planning/research/ARCHITECTURE.md) -- file structure, CSS organization
- [v6.0 PITFALLS.md research](/.planning/research/PITFALLS.md) -- Turbopack, CSS ordering, font issues
- [Next.js CLI: create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) -- command flags

### Tertiary (LOW confidence)
- None -- all claims verified against primary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified against npm registry, locked decisions from v6.0 research
- Architecture: HIGH -- CSS files audited line-by-line, migration path is file copy + one systematic change
- Pitfalls: HIGH -- all 5 pitfalls verified against GitHub issues or codebase inspection

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (30 days -- stable stack, known bugs documented)
