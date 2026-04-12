# Phase 68: Design Tokens & Layout Chrome - Research

**Researched:** 2026-04-12
**Domain:** CSS design tokens, Next.js layout components, glassmorphism, Tailwind v4 theming
**Confidence:** HIGH

## Summary

Phase 68 transforms the visual foundation of the MedicusUnion KZ Next.js app from a solid-background, dark-footer design to a glassmorphism-based design language with animated mesh backgrounds. The work touches 6 files to modify (globals.css, navigation.ts, layout.tsx, Header.tsx, HeaderClient.tsx, MobileMenu.tsx), 2 files to rewrite (Footer.tsx, StickyBar.tsx), and 1 new file to create (MeshBackground.tsx).

The codebase is well-structured for this migration: Tailwind v4.2.2 with `@theme inline` in globals.css already maps CSS custom properties to Tailwind utilities, and the glass shadow tokens (`shadow-glass-*`) are already defined. The primary risks are: (1) removing production utility classes that ~55 section component references depend on, and (2) changing `--mu-text-700` and `--mu-text-500` token values which would affect contrast across the entire site. Both risks have clear mitigations documented below.

**Primary recommendation:** Keep production utility classes (`btn-primary`, `card-prod`, etc.) and old color tokens in globals.css until phases 69-72 update the section components that depend on them. Update only the layout chrome components and add new tokens; do not delete tokens that other components reference.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use existing liquid-glass.css classes for all glass effects -- already imported in globals.css, maintains v6.0 decision (glass CSS stays global)
- Implement animated mesh background as layout component (MeshBackground.tsx) -- easy to toggle per page, SSR-friendly
- Header glass transition via JS state in HeaderClient -- already has scroll detection pattern, add glass class on scroll
- Keep Webpack for dev+prod -- Turbopack backdrop-filter bug #78302 still unresolved
- Add "O kompanii" as 5th nav link -- anchor #why-us on index, smart link on other pages
- Switch desktop nav breakpoint from md (768px) to lg (1024px) -- more room for 5 links + phone + CTA
- Add gradient CTA button "Obsudit sluchay" to desktop header -- matches new design, drives conversions
- Logo as gradient text (from-mu-blue to-mu-accent-blue) -- matches new design exactly
- Switch footer from dark #1A365D to glass card on light background -- white/60 backdrop-blur, matches new design
- 4-column footer layout: Company, Services, Navigation, Contacts -- matches new design exactly
- Include legal entities (MedicusUnion GmbH + TOO MedicusUnion KZ) -- builds trust with target audience 45+
- Skip App Store / Google Play badges -- no live apps to link to
- Keep CSS custom properties + use Tailwind theme extension -- current --mu-* tokens work, Tailwind v4 reads them
- Add glass shadow utilities (shadow-glass-header, shadow-glass-lg, shadow-glass-inner-strong) -- already defined in @theme inline
- StickyBar: #contact on index, smart fallback to /contacts on service pages
- Remove dark mode tokens and [data-theme="dark"] from globals.css -- new design has no dark mode

### Claude's Discretion
None explicitly stated -- all decisions were locked in CONTEXT.md.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAY-03 | CSS design tokens updated in globals.css to match new design palette | Token migration strategy documented; diff between current and new design tokens mapped; production token retention strategy for backward compatibility |
| NAV-01 | Header displays 5 flat nav links matching new design style | Header.tsx update plan with exact classes from d450232; nav breakpoint change md->lg; CTA button addition; logo gradient |
| NAV-02 | MobileMenu updated to new navigation style | MobileMenu.tsx rewrite plan with glass panel classes from d450232; CTA button; phone link with icon |
| LAY-01 | Footer updated to new design style | Footer.tsx full rewrite plan; 4-column glass card layout from d450232; legal entities; trust badges |
| LAY-02 | StickyBar adapted with correct anchors on all pages | StickyBar.tsx rewrite with glass styling; usePathname for smart CTA routing; IntersectionObserver pattern preserved |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.15 | App framework | Already installed, App Router with server/client component split [VERIFIED: package.json] |
| Tailwind CSS | 4.2.2 | Utility-first CSS | Already installed, @theme inline for token mapping [VERIFIED: node_modules] |
| React | 19.1.0 | UI library | Already installed [VERIFIED: package.json] |
| lucide-react | ^1.8.0 | Icons | Already installed, used for Phone, Menu, X, Mail, Shield icons [VERIFIED: package.json] |
| clsx + tailwind-merge | ^2.1.1 / ^3.5.0 | Class merging | Already installed, cn() utility in lib/utils.ts [VERIFIED: codebase] |
| framer-motion | ^12.38.0 | Animations | Already installed but NOT needed for Phase 68 layout chrome [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/navigation | (bundled) | usePathname hook | StickyBar smart routing (index vs. service pages) |
| next/font/local | (bundled) | Inter + Manrope fonts | Already configured in layout.tsx |

**Installation:** No new packages needed for Phase 68.

## Architecture Patterns

### Recommended Project Structure
```
next/src/
  app/
    globals.css           # MODIFY: token updates, dark mode removal, add new tokens
    layout.tsx            # MODIFY: add MeshBackground, update body classes
  components/
    layout/
      MeshBackground.tsx  # NEW: animated mesh gradient background
      Header.tsx          # MODIFY: glass pill header, 5 nav links, CTA button
      HeaderClient.tsx    # MODIFY: glass classes, scroll transition
      MobileMenu.tsx      # MODIFY: glass panel, new nav style
      Footer.tsx          # REWRITE: glass card, 4-column layout
      StickyBar.tsx       # REWRITE: glass styling, smart anchor routing
  lib/
    navigation.ts         # MODIFY: add 5th link, footer nav links, update tagline
```

### Pattern 1: Server Component Wrapping Client Component (existing)
**What:** Server component (Header.tsx) renders static markup and wraps client component (HeaderClient.tsx) for interactivity.
**When to use:** When layout needs both SSR-rendered content and client-side behavior (scroll detection, menu toggle).
**Example:**
```typescript
// Header.tsx (server component) -- no 'use client'
export function Header() {
  return (
    <HeaderClient>
      {/* Static nav links rendered on server */}
    </HeaderClient>
  );
}

// HeaderClient.tsx (client component)
'use client';
export function HeaderClient({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled();
  return <header className={cn('...', isScrolled && 'header--scrolled')}>{children}</header>;
}
```
[VERIFIED: existing codebase pattern in Header.tsx + HeaderClient.tsx]

### Pattern 2: MeshBackground as Pure Presentational Component
**What:** Fixed-position decorative background rendered from layout.tsx, not interactive.
**When to use:** Full-page backgrounds that should be behind all content.
**Example:**
```typescript
// MeshBackground.tsx -- server component (no 'use client' needed)
export function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 3 gradient blobs + frosted overlay */}
    </div>
  );
}
```
[VERIFIED: matches d450232 HTML structure exactly]

### Pattern 3: Smart Anchor with usePathname
**What:** StickyBar CTA links to `#contact` on index page, `/contacts` on other pages.
**When to use:** When a component in layout.tsx needs page-aware behavior.
**Example:**
```typescript
'use client';
import { usePathname } from 'next/navigation';

export function StickyBar() {
  const pathname = usePathname();
  const ctaHref = pathname === '/' ? '#contact' : '/contacts';
  // ...
}
```
[VERIFIED: usePathname available in Next.js 15 App Router client components -- CITED: next.js docs]

### Anti-Patterns to Avoid
- **Deleting CSS classes still used by section components:** The `btn-primary`, `card-prod`, etc. classes are referenced in ~55 places across section components (phases 69-72). Removing them from globals.css would break those pages. Keep them until the components are migrated.
- **Changing --mu-text-700 token value:** The new design's theme.css uses `#63687A` (lighter), but the current `#4A4E5C` provides better WCAG contrast for the 45+ audience. The UI-SPEC explicitly uses the current values. Do not change these token values.
- **Using Turbopack for development:** Turbopack has an open backdrop-filter bug (#78302). The `next dev` script in package.json currently uses `--turbopack` flag. This must be addressed -- either the flag must be removed from the dev script, or Webpack must be explicitly configured. [VERIFIED: package.json shows `"dev": "next dev --turbopack"`]
- **Adding `will-change: backdrop-filter` on static glass elements:** Wastes GPU memory with no benefit for non-animated elements. [VERIFIED: liquid-glass.css anti-pattern documentation]
- **Using `filter: drop-shadow()` on glass ancestors:** Breaks backdrop-filter on children. [VERIFIED: liquid-glass.css documentation, commit ba29f8a]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection | Custom scroll event handler | `useScrolled` hook | Already exists at `hooks/use-scrolled.ts`, uses rAF throttling [VERIFIED: codebase] |
| Body scroll lock | Custom overflow toggling | Existing MobileMenu pattern | Already implements overflow:hidden toggle in useEffect [VERIFIED: MobileMenu.tsx] |
| Class merging | String concatenation | `cn()` from `lib/utils.ts` | Uses clsx + tailwind-merge for proper Tailwind class deduplication [VERIFIED: codebase] |
| Glass effects | Manual backdrop-filter styles | `liquid-glass.css` classes | Already defines glass hierarchy (liquid-regular, liquid-nav, etc.) [VERIFIED: codebase] |
| Icons | SVG inline or custom components | `lucide-react` | Already installed, provides Phone, Menu, X, Mail, Shield, Globe icons [VERIFIED: package.json] |
| Intersection observer | Custom visibility detection | Existing StickyBar pattern | Already implements IntersectionObserver for hide-on-contact [VERIFIED: StickyBar.tsx] |

## Common Pitfalls

### Pitfall 1: Turbopack Backdrop-Filter Bug
**What goes wrong:** The `next dev --turbopack` flag in package.json will cause all backdrop-filter/blur effects to not render during development.
**Why it happens:** Turbopack bug #78302 -- still open as of April 2026.
**How to avoid:** Either remove `--turbopack` from the dev script in package.json, or explicitly add `experimental: { turbo: false }` in next.config.ts. The CONTEXT.md locks the decision: "Keep Webpack for dev+prod."
**Warning signs:** Glass elements appear as solid white rectangles during `next dev`.
[VERIFIED: STATE.md documents this as active blocker; package.json currently has --turbopack flag]

### Pitfall 2: Premature Deletion of Production Utility Classes
**What goes wrong:** Removing `btn-primary`, `card-prod`, `container-prod`, `btn-outline`, `btn-hero`, `btn-outline-light`, `btn-sticky` from globals.css breaks ~55 references across section components.
**Why it happens:** The UI-SPEC says "Remove btn-primary, btn-outline, etc." but section components (phases 69-72) have not been migrated yet.
**How to avoid:** Mark these classes with a `/* DEPRECATED: remove when phases 69-72 migrate sections */` comment. Only delete in a later phase after all consumers are updated. The StickyBar.tsx in Phase 68 is the only layout component using `btn-primary btn-sticky` -- update that one reference.
**Warning signs:** Build succeeds but pages render with unstyled buttons and cards.
[VERIFIED: grep found ~55 references across section components]

### Pitfall 3: Token Value Divergence Between Branches
**What goes wrong:** The new design branch (feat/new-design) uses different `--mu-text-700` (#63687A) and `--mu-text-500` (#A4A8B5) values that are significantly lighter than the current values (#4A4E5C and #6B6F80).
**Why it happens:** The new design was built with a different contrast philosophy. The v6.0 app added WCAG-accessible text variants.
**How to avoid:** Follow the UI-SPEC which explicitly uses the current (darker) values. Do not blindly copy theme.css from feat/new-design. The CONTEXT.md says "current --mu-* tokens work."
**Warning signs:** Text becomes hard to read on white/60 glass surfaces.
[VERIFIED: direct comparison of theme.css values between branches]

### Pitfall 4: Dark Mode Removal Breaking Shadcn Components
**What goes wrong:** Removing the `.dark {}` block from globals.css may affect shadcn component theming if any component uses dark mode variants.
**Why it happens:** shadcn/ui generates components with dark: variants by default.
**How to avoid:** Remove the `.dark {}` block AND the `@custom-variant dark` line. Also remove dark overrides in `header--scrolled` class. Verify shadcn components (dialog, select, input) still render correctly -- they should, since the app never applies the `dark` class.
**Warning signs:** Flash of incorrect colors in dialog or form components.
[VERIFIED: globals.css has `.dark` block lines 207-266 and `dark .header--scrolled` at line 494]

### Pitfall 5: Fixed Header Occludes Content
**What goes wrong:** Switching from `sticky top-0` to `fixed top-4 left-4 right-4` means the header no longer occupies document flow. Content slides under it.
**Why it happens:** `sticky` reserves space in the layout; `fixed` does not.
**How to avoid:** Add `pt-28 lg:pt-32` (or similar) to `<main>` in layout.tsx to account for the floating header height. The new design source uses `pt-32 lg:pt-40` on the hero section, but layout.tsx's `<main>` wrapper should have a base padding-top to prevent the first section from being hidden.
**Warning signs:** First section text is hidden behind the glass header.
[VERIFIED: d450232 hero section uses `pt-32 pb-16 lg:pt-40` to compensate]

### Pitfall 6: Backdrop-Filter Stacking Context
**What goes wrong:** `backdrop-filter` creates an implicit stacking context. Adding glass effects to header, mobile menu, and sticky bar can cause z-index conflicts.
**Why it happens:** CSS spec -- elements with backdrop-filter become stacking context roots.
**How to avoid:** Ensure z-index hierarchy: MeshBackground z-0, main content z-10, mobile menu overlay z-40, header z-50, sticky bar z-50. This matches the d450232 HTML.
**Warning signs:** Mobile menu appears behind the header, or mesh background covers content.
[VERIFIED: d450232 uses z-0 mesh, z-10 main, z-40 mobile menu overlay, z-50 header and sticky bar]

## Code Examples

### Token Structure in globals.css (Tailwind v4 pattern)
```css
/* Source: current globals.css pattern -- verified in codebase */
:root {
  --mu-blue: #38C6F4;         /* CSS custom property */
}

@theme inline {
  --color-mu-blue: var(--mu-blue);   /* Maps to Tailwind: bg-mu-blue, text-mu-blue, etc. */
  --shadow-glass-header: ...;         /* Maps to Tailwind: shadow-glass-header */
}
```
[VERIFIED: globals.css lines 268-367]

### Header Glass Pill (from d450232 source of truth)
```html
<!-- Source: git show d450232:index.html header element -->
<header class="fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-7xl
  rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50
  shadow-glass-header bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5">
```
[VERIFIED: d450232 commit]

### Scroll State Toggle (existing pattern)
```typescript
// Source: HeaderClient.tsx -- verified in codebase
'use client';
import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/use-scrolled';

export function HeaderClient({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled();
  return (
    <header className={cn(
      'fixed z-50 ... bg-white/30 backdrop-blur-[40px] py-5 transition-all duration-500',
      isScrolled && 'bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] py-3'
    )}>
      {children}
    </header>
  );
}
```
[VERIFIED: existing hook at use-scrolled.ts + HeaderClient.tsx pattern]

### StickyBar Smart Routing
```typescript
// Source: pattern from Next.js App Router docs
'use client';
import { usePathname } from 'next/navigation';

export function StickyBar() {
  const pathname = usePathname();
  const ctaHref = pathname === '/' ? '#contact' : '/contacts';
  // ... rest of component
}
```
[ASSUMED: usePathname is the standard Next.js way; no alternative needed]

### MeshBackground Component
```typescript
// Source: d450232 index.html mesh background structure
export function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-mu-blue/30 mix-blend-multiply blur-[120px]" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-mu-green-300/20 mix-blend-multiply blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-mu-accent-blue/15 mix-blend-multiply blur-[120px]" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]" />
    </div>
  );
}
```
[VERIFIED: d450232 commit HTML]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 config file | Tailwind v4 @theme inline in CSS | v4.0 (2025) | Token definitions live in globals.css, not tailwind.config.* |
| bg-white solid header | bg-white/30 glass pill header | New design (2026) | Requires backdrop-filter, creates stacking context |
| Dark footer (#1A365D) | Glass card footer (white/60) | New design (2026) | Footer becomes transparent, needs mesh background behind it |
| 4 nav links at md breakpoint | 5 nav links at lg breakpoint | This phase | More horizontal space needed for 5 links + phone + CTA |
| sticky top-0 header | fixed top-4 left-4 right-4 | This phase | Header floats, content needs padding-top compensation |

**Deprecated/outdated:**
- `.dark {}` block in globals.css: new design has no dark mode -- remove entirely
- `@custom-variant dark`: line 12 of globals.css -- remove
- Production tokens (--font-size-*, --color-cta, --shadow-sm/md/lg, --radius-prod-*, --space-*, --section-padding-desktop): kept temporarily for backward compatibility but deprecated

## Critical Difference Map: Current vs. New Design

| Token | Current Value | New Design Value | Phase 68 Action | Reason |
|-------|--------------|------------------|-----------------|--------|
| --mu-text-700 | #4A4E5C | #63687A (lighter) | KEEP CURRENT | Better WCAG contrast for 45+ audience; UI-SPEC uses current |
| --mu-text-500 | #6B6F80 | #A4A8B5 (lighter) | KEEP CURRENT | Same reason |
| --mu-green-700 | #2D9E68 | #4BCA8C (lighter) | KEEP CURRENT | Preserve existing accessible greens |
| --mu-green-200 | (missing) | #A6EECB | ADD | Needed by new design for @theme inline mapping |
| --mu-green-400 | (missing) | #79E9B3 | ADD | Needed by new design for gradient stops |
| --mu-green-900 | (missing) | #35B678 | ADD | Alias for green-600, used in new design |

## File-by-File Change Inventory

| File | Change Type | Scope | Risk |
|------|------------|-------|------|
| `globals.css` | MODIFY | Remove .dark block, @custom-variant dark, dark .header--scrolled. Add missing green ramp tokens. Add body selection styles. Keep production utility classes. | MEDIUM -- large file, many sections |
| `navigation.ts` | MODIFY | Add 5th NAV_LINK, rewrite FOOTER_NAV_LINKS, update TAGLINE | LOW -- simple data changes |
| `layout.tsx` | MODIFY | Add MeshBackground import/render, update body classes, add main wrapper styles | LOW -- small structural change |
| `MeshBackground.tsx` | NEW | Create server component with 3 blobs + overlay | LOW -- pure presentational, no logic |
| `Header.tsx` | MODIFY | Glass pill styling, gradient logo, 5 nav links, phone+icon, CTA button, lg breakpoint | MEDIUM -- significant markup changes |
| `HeaderClient.tsx` | MODIFY | Switch from sticky to fixed, glass classes, scroll transition | LOW -- small class changes |
| `MobileMenu.tsx` | MODIFY | Glass panel, new nav style, divider, phone with icon, CTA button, lg breakpoint | MEDIUM -- significant markup changes |
| `Footer.tsx` | REWRITE | Complete rewrite: glass card, 4 columns, legal entities, trust badges | HIGH -- full component replacement |
| `StickyBar.tsx` | REWRITE | Glass styling, smart anchor routing with usePathname, updated CTA text | MEDIUM -- add usePathname, restyle |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed -- no test infrastructure in project |
| Config file | none |
| Quick run command | `cd next && npx next build` (type-check + build) |
| Full suite command | `cd next && npx next build` (same -- no tests) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAY-03 | CSS tokens reflect new design palette in DevTools | manual-only | Inspect in browser DevTools | N/A |
| NAV-01 | Header shows 5 flat nav links matching new design | manual-only | Visual inspection at 1440px | N/A |
| NAV-02 | MobileMenu opens with new style at 375px | manual-only | Visual inspection at 375px viewport | N/A |
| LAY-01 | Footer matches new design at 1440px and 375px | manual-only | Visual inspection | N/A |
| LAY-02 | StickyBar displays correctly with correct anchors | manual-only | Click CTA on index (goes to #contact) and on /consultations (goes to /contacts) | N/A |

### Sampling Rate
- **Per task commit:** `cd next && npx next build` (catches TypeScript errors and missing imports)
- **Per wave merge:** Same + manual visual check at 375px and 1440px
- **Phase gate:** Build succeeds, all 5 pages render without errors, visual comparison with d450232

### Wave 0 Gaps
- No test framework installed -- all validation is build-check + manual visual inspection
- This is acceptable for a CSS/layout phase with no business logic changes

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A |
| V3 Session Management | no | N/A |
| V4 Access Control | no | N/A |
| V5 Input Validation | no | N/A (no form changes in Phase 68) |
| V6 Cryptography | no | N/A |

Phase 68 is purely presentational CSS and layout component changes. No data flow, no form handling, no authentication. Security domain is not applicable.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | usePathname from next/navigation works in client components in Next.js 15.5.15 | Architecture Patterns, Code Examples | LOW -- well-documented Next.js API, easy to verify during implementation |
| A2 | Removing .dark {} and @custom-variant dark will not break shadcn components since dark class is never applied | Common Pitfalls | LOW -- app never applies dark class; verify during build |
| A3 | Production utility classes (btn-primary etc.) can be safely retained alongside new Tailwind classes without conflicts | Common Pitfalls | LOW -- they live in @layer components, won't conflict with utility classes |

## Open Questions

1. **Turbopack dev script flag**
   - What we know: package.json has `"dev": "next dev --turbopack"` which will break backdrop-filter during development
   - What's unclear: Whether to modify package.json (affects all developers) or add a separate script
   - Recommendation: Change `"dev"` script to `"next dev"` (Webpack). Optionally add `"dev:turbo": "next dev --turbopack"` for non-glass work. This should be the first task in the plan.

2. **Main element padding-top for fixed header**
   - What we know: d450232 uses per-section pt-32 on hero, but other sections don't have extra padding
   - What's unclear: Whether padding should be on `<main>` globally or only on the first section of each page
   - Recommendation: Add `pt-24` to `<main>` in layout.tsx as a baseline (covers ~96px for the header + top-4 offset). Individual pages can override with their own padding.

3. **Footer navigation links -- anchor vs. route**
   - What we know: d450232 footer uses `#clinics` and `#why-us` anchors. In Next.js, these only work on the index page.
   - What's unclear: Should footer links use `/#clinics` (route prefix) or just `/` for navigation from other pages?
   - Recommendation: Use `/#clinics` and `/#why-us` for footer links -- Next.js will navigate to index then scroll to anchor. Use full route paths (`/consultations`, `/contacts`) for other footer links.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified). Phase 68 is purely code/config changes within the existing Next.js project.

## Sources

### Primary (HIGH confidence)
- Codebase files: globals.css, Header.tsx, HeaderClient.tsx, MobileMenu.tsx, Footer.tsx, StickyBar.tsx, navigation.ts, layout.tsx, use-scrolled.ts, liquid-glass.css
- Git commit d450232 (feat/new-design branch): index.html header, footer, sticky bar, mesh background HTML
- Git commit d450232 (feat/new-design branch): src/styles/theme.css token definitions
- package.json: dependency versions (Next.js 15.5.15, Tailwind 4.2.2, React 19.1.0)
- STATE.md: Turbopack bug #78302, CSS import order issues
- 68-CONTEXT.md: all locked decisions
- 68-UI-SPEC.md: component inventory, glass material tokens, typography scale, color tokens

### Secondary (MEDIUM confidence)
- None needed -- all research based on codebase analysis

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all packages already installed, versions verified from node_modules
- Architecture: HIGH - all patterns verified from existing codebase and d450232 source
- Pitfalls: HIGH - all identified through codebase analysis (grep for class usage, token comparison)
- Token migration: HIGH - direct comparison of globals.css vs d450232 theme.css

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (stable -- no dependency changes expected)
