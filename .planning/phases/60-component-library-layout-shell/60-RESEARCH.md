# Phase 60: Component Library & Layout Shell - Research

**Researched:** 2026-04-11
**Domain:** shadcn/ui initialization, React layout components, Server/Client Component boundaries
**Confidence:** HIGH

## Summary

Phase 60 ports the existing HTML header, footer, mobile menu, sticky bar, and SVG refraction defs into React components within the Next.js root layout, and initializes shadcn/ui as the component library. The codebase from Phase 59 provides a complete Next.js 15 App Router project with all CSS tokens and glass materials already working. The key challenge is correctly splitting Server and Client Component boundaries -- only the header scroll detection, mobile menu toggle, and sticky bar visibility logic require `"use client"` directives.

The existing production HTML is minimal and well-structured: header (brand + nav + phone), footer (brand + contacts + nav + legal), sticky bar (phone + CTA), and SVG refraction filter defs. There is no mobile menu or hamburger button in the current production HTML -- the desktop nav is hidden on mobile via `display: none`, and the sticky bar serves as the mobile CTA. The `mobile-menu-overlay` CSS class exists in globals.css and worktree CSS but there is no corresponding HTML element in the shipped pages. The CONTEXT.md decision to create a MobileMenu component is adding new functionality.

**Primary recommendation:** Initialize shadcn/ui with `npx shadcn@latest init`, create layout components in `src/components/layout/`, and use a thin Client Component wrapper pattern where the Header Server Component renders all HTML but a `HeaderClient` sub-component handles scroll detection and class toggling.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Header as Server Component with a `"use client"` sub-component for glass-on-scroll effect -- keeps SSR fast
- Mobile menu state managed via useState in a `"use client"` MobileMenu component -- simple, local state
- Navigation links hardcoded as array in header component -- matches current static site pattern
- Component files in `src/components/layout/{Header,Footer,MobileMenu,StickyBar}.tsx` -- grouped by role
- Scroll detection via `useEffect` + `window.scrollY > 10` with `requestAnimationFrame` throttle -- matches current JS
- Toggle `.liquid-nav` className on scroll -- reuses existing CSS class from liquid-glass.css
- Fixed header height: 76px desktop / 64px mobile -- matches current production
- Global `<SvgRefractionDefs>` component rendered in root layout -- matches current svg-defs.html approach
- lucide-react for standard icons + custom SVG components for brand-specific (logo, flags)
- Phone number formatting with `\u00A0` (nbsp) between digits per project convention

### Claude's Discretion
- Exact shadcn/ui component configuration and theming
- Footer section content layout details
- Hamburger menu animation specifics

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCAF-03 | shadcn/ui initialized with base components (Button, Card, Input, Select, Textarea, Dialog) | Standard Stack section: shadcn CLI v4, exact init command, components.json config, Tailwind v4 compatibility confirmed |
| SCAF-05 | Root layout contains header, footer, mobile-menu, sticky-bar, svg-defs as React components (replacing splicer partials) | Architecture Patterns section: full HTML structure for each component extracted, Server/Client boundary mapping, root layout composition pattern |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack**: Next.js 15 App Router + TypeScript + Tailwind CSS v4 (v6.0 migration from vanilla HTML)
- **Language**: Only Russian (all UI text in Russian)
- **Design**: Mobile-first, target audience 45+ -- large fonts, clear navigation, high contrast
- **Tone**: Calm, confident, medical -- no aggressive marketing
- **nbsp convention**: Bind ALL subject+verb pairs with `\u00A0` to prevent line breaks; first line before break must have 2+ words AND 10+ chars

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn (CLI) | 4.2.0 | Component library initialization and management | [VERIFIED: npm registry] Official CLI for shadcn/ui; v4 supports Tailwind v4 natively |
| lucide-react | 1.8.0 | Standard icon library | [VERIFIED: npm registry] Default icon library for shadcn/ui; tree-shakeable |
| class-variance-authority | 0.7.1 | Component variant management | [VERIFIED: npm registry] Required by shadcn/ui Button and other variant-based components |
| clsx | 2.1.1 | Conditional className merging | [VERIFIED: npm registry] Required by shadcn/ui cn() utility |
| tailwind-merge | 3.5.0 | Tailwind class deduplication | [VERIFIED: npm registry] Required by shadcn/ui cn() utility for conflict resolution |

### Already Installed (from Phase 59)

| Library | Version | Purpose |
|---------|---------|---------|
| next | 15.5.15 | App Router framework |
| react | 19.1.0 | UI library |
| tailwindcss | ^4 | Styling via @tailwindcss/postcss |
| tw-animate-css | ^1.4.0 | Animation utilities |

### Installation

```bash
cd next

# 1. Initialize shadcn/ui (interactive CLI)
npx shadcn@latest init

# 2. Add required base components
npx shadcn@latest add button card input select textarea dialog

# 3. Add icon library (auto-installed by shadcn if not present)
npm install lucide-react
```

**shadcn init configuration for this project:**

| Prompt | Value | Reason |
|--------|-------|--------|
| Style | new-york | Only style available in CLI v4 [CITED: ui.shadcn.com/docs/changelog/2026-03-cli-v4] |
| Base color | neutral | Neutral grays work with the existing MedicusUnion brand palette |
| CSS file | src/app/globals.css | Already exists from Phase 59 |
| CSS variables | yes | Already using CSS custom properties extensively |
| Tailwind config | (blank) | Tailwind v4 -- no config file needed [CITED: ui.shadcn.com/docs/tailwind-v4] |
| Components path | @/components/ui | Standard shadcn convention; tsconfig alias `@/*` maps to `./src/*` |
| RSC | true | Next.js App Router uses React Server Components |
| TSX | true | Project uses TypeScript |

**Expected components.json:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**CRITICAL: shadcn init will modify globals.css.** The CLI adds CSS variables for shadcn's color tokens (--background, --foreground, --primary, etc.) and the @theme inline block. Phase 59 already ported these tokens into globals.css. The init may try to overwrite them. **After running `npx shadcn@latest init`, verify that the existing MedicusUnion tokens (--mu-*, --liquid-*, --section-*, glass hierarchy) are preserved.** If overwritten, restore from git and merge manually. [ASSUMED -- shadcn CLI behavior with existing tokens needs verification at init time]

## Architecture Patterns

### Recommended Project Structure

```
next/src/
  app/
    layout.tsx           # Root layout -- renders Header, Footer, StickyBar, SvgRefractionDefs
    page.tsx             # Index page (Phase 61)
    globals.css          # Existing: all tokens, glass CSS, Tailwind
  components/
    layout/
      Header.tsx         # Server Component shell
      HeaderClient.tsx   # "use client" -- scroll detection, glass toggle
      Footer.tsx         # Server Component (pure HTML, no interactivity)
      MobileMenu.tsx     # "use client" -- useState for open/close
      StickyBar.tsx      # "use client" -- IntersectionObserver visibility
      SvgRefractionDefs.tsx  # Server Component -- static SVG filter definitions
    ui/                  # shadcn/ui components (auto-generated)
      button.tsx
      card.tsx
      input.tsx
      select.tsx
      textarea.tsx
      dialog.tsx
  lib/
    utils.ts             # cn() utility (auto-generated by shadcn init)
  hooks/
    use-scroll-position.ts  # Custom hook for scroll detection (shared by Header + StickyBar)
  fonts/                 # Existing: Inter + Manrope woff2 files
  styles/
    liquid-glass.css     # Existing: glass material classes
    squircles.css        # Existing: squircle mask utilities
```

### Pattern 1: Server Component Shell + Client Sub-Component

**What:** The Header is a Server Component that renders all static HTML (brand, nav links, phone number). A `HeaderClient` child component handles the scroll-triggered glass effect.

**When to use:** When a component has mostly static content but needs a small interactive behavior.

**Example:**

```typescript
// src/components/layout/Header.tsx (Server Component -- no "use client")
import { HeaderClient } from './HeaderClient';

const NAV_LINKS = [
  { href: '/consultations', label: 'Консультации' },
  { href: '/treatment-abroad', label: 'Лечение' },
  { href: '/checkup', label: 'Чек-ап' },
  { href: '#contact', label: 'Контакты' },
] as const;

export function Header() {
  return (
    <HeaderClient>
      <div className="container flex items-center justify-between">
        <a href="/" className="font-heading text-lg font-bold text-mu-text-900">
          MedicusUnion
        </a>
        <nav className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}
               className="text-sm text-mu-text-500 hover:text-mu-blue transition-colors whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="tel:+77015322478"
           className="font-heading text-base font-semibold text-mu-blue-text">
          +7{'\u00A0'}701{'\u00A0'}532{'\u00A0'}24{'\u00A0'}78
        </a>
      </div>
    </HeaderClient>
  );
}
```

```typescript
// src/components/layout/HeaderClient.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function HeaderClient({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        isScrolled ? 'liquid-nav header--scrolled' : 'bg-white'
      }`}
      style={{ height: 'var(--header-height, 76px)' }}
    >
      {children}
    </header>
  );
}
```

[VERIFIED: Next.js App Router docs -- Server Components can pass children to Client Components]

### Pattern 2: Mobile Menu as Standalone Client Component

**What:** MobileMenu is a fully client-side component managing open/close state with useState. It renders as an overlay with backdrop-blur.

**When to use:** Components where ALL content is interactive.

**Example:**

```typescript
// src/components/layout/MobileMenu.tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/consultations', label: 'Консультации' },
  { href: '/treatment-abroad', label: 'Лечение' },
  { href: '/checkup', label: 'Чек-ап' },
  { href: '#contact', label: 'Контакты' },
] as const;

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        className="p-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed top-16 left-4 right-4 z-50 rounded-xl bg-white/90 backdrop-blur-lg p-6 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-mu-text-900 hover:bg-white/40"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
```

### Pattern 3: SVG Refraction Defs as Server Component

**What:** A zero-visual Server Component that renders the SVG filter definitions needed by the glass refraction CSS.

**When to use:** Global SVG defs that must exist in the DOM for CSS `url(#filter-id)` references.

**Example:**

```typescript
// src/components/layout/SvgRefractionDefs.tsx (Server Component)
export function SvgRefractionDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="liquid-refract-sm" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={1} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={1} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-refract-md" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={18} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-refract-lg" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={3} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
```

[VERIFIED: git show e13da0a^:partials/svg-defs.html -- exact filter values extracted from deleted partial]

### Pattern 4: Root Layout Composition

**What:** The root layout renders all chrome components, wrapping `{children}` between header and footer.

**Example:**

```typescript
// src/app/layout.tsx (updated)
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyBar } from '@/components/layout/StickyBar';
import { SvgRefractionDefs } from '@/components/layout/SvgRefractionDefs';
// ... existing font + globals.css imports ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="relative bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        <SvgRefractionDefs />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}
```

### Anti-Patterns to Avoid

- **Making Header entirely a Client Component:** The header has static nav links and brand text. Only the scroll detection is interactive. Making the whole header `"use client"` sends all its code to the client bundle unnecessarily.
- **Using `next/link` for hash anchors:** `<Link href="#contact">` causes a full navigation in App Router. Use plain `<a href="#contact">` for same-page hash links. [ASSUMED -- verify Next.js Link behavior with hash-only hrefs]
- **Duplicating nav links array:** Define NAV_LINKS once and import it in Header, MobileMenu, and Footer. Do not hardcode the array in each component separately.
- **Applying `liquid-nav` class permanently:** The `.liquid-nav` class must only be added when scrolled (not at top). The header at top of page should have a transparent/white background -- glass effect activates on scroll.
- **Forgetting `data-refract="true"` on html:** The SVG refraction filters in CSS are gated by `html[data-refract="true"]`. Without this attribute, the `url(#liquid-refract-*)` filter references in `backdrop-filter` are inactive. If refraction is desired, the `<html>` element needs `data-refract="true"`. Currently NO production page sets this attribute -- refraction is not active. The planner should decide whether to enable it or leave it inactive as in production.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon library | Custom SVG icon components | lucide-react | 1000+ icons, tree-shakeable, shadcn/ui default |
| Class merging | Manual string concatenation | cn() from @/lib/utils (clsx + tailwind-merge) | Handles Tailwind class conflicts correctly |
| Component variants | if/else chains for style variants | class-variance-authority (cva) | Type-safe variant API, used by shadcn Button |
| Scroll detection | Raw useEffect in every component | Custom `useScrollPosition` hook | Shared between Header and StickyBar; single scroll listener |

## Common Pitfalls

### Pitfall 1: shadcn init overwrites globals.css tokens

**What goes wrong:** Running `npx shadcn@latest init` may overwrite or reorder the existing globals.css that Phase 59 carefully constructed with all MedicusUnion tokens, glass CSS imports, and Tailwind theme mappings.
**Why it happens:** shadcn CLI generates its own CSS variable block and @theme inline section.
**How to avoid:** Before running init, commit all current changes. After init, immediately diff globals.css. If MedicusUnion tokens (--mu-*, --liquid-*, --section-*, glass hierarchy tokens in @theme inline) are removed, restore them from git and merge the shadcn additions.
**Warning signs:** Missing glass effects after init; missing brand colors; build errors about undefined CSS variables.

### Pitfall 2: Header glass class conflict with Tailwind

**What goes wrong:** The `.liquid-nav` class from liquid-glass.css applies backdrop-filter. If Tailwind utility classes like `bg-white` are also applied, specificity conflicts cause the glass background to be overridden.
**Why it happens:** Tailwind utility classes and glass CSS classes both set `background`. The last one in source order wins.
**How to avoid:** When the header is scrolled (glass active), do NOT apply `bg-white`. Toggle between two states: `bg-white` (not scrolled) and `liquid-nav header--scrolled` (scrolled). Use conditional className, not both simultaneously.
**Warning signs:** White background visible behind glass blur; glass effect invisible despite class being applied.

### Pitfall 3: Mobile menu body scroll lock missing

**What goes wrong:** When the mobile menu overlay opens, the page behind it remains scrollable.
**Why it happens:** The overlay is `position: fixed` but the body still accepts scroll events.
**How to avoid:** When menu opens, add `overflow: hidden` to `document.body`. Remove it when menu closes. Use a useEffect cleanup to ensure it's always removed.
**Warning signs:** Page scrolling visible behind the translucent overlay.

### Pitfall 4: StickyBar shows on desktop

**What goes wrong:** The sticky mobile CTA bar renders on desktop viewports where it's not needed.
**Why it happens:** Forgetting to add the `md:hidden` or equivalent mobile-only class.
**How to avoid:** The StickyBar component wrapper must include a responsive visibility class. Current production CSS doesn't have an explicit desktop hide -- but the bar is visually designed for mobile only. Add `lg:hidden` or equivalent.
**Warning signs:** Extra bar at bottom of desktop viewport.

### Pitfall 5: SVG filter IDs not unique in DOM

**What goes wrong:** If SvgRefractionDefs is rendered multiple times (e.g., in layout AND in a page), duplicate `id="liquid-refract-sm"` elements cause browser confusion about which filter to reference.
**Why it happens:** React layout remounting or accidental double-render.
**How to avoid:** Render SvgRefractionDefs exactly ONCE in root layout.tsx, not in any page or section component.
**Warning signs:** Glass refraction rendering incorrectly or inconsistently; console warnings about duplicate IDs.

### Pitfall 6: Hydration mismatch from scroll state

**What goes wrong:** If the HeaderClient component tries to read `window.scrollY` during SSR or initial render, the server renders "not scrolled" but the client might initialize with scrollY > 0 (if the page was loaded mid-scroll, e.g., via back button).
**Why it happens:** Server has no scroll position; client initializes with current scroll position.
**How to avoid:** Initialize `isScrolled` as `false`. The first scroll event will correct it. This brief visual flash is acceptable and matches standard practice.
**Warning signs:** Console hydration mismatch warnings; brief flash of wrong header state on page load.

## Code Examples

### Existing HTML Structures to Port

**Header (from index.html lines 32-45):**

```html
<header class="site-header" id="header">
  <div class="container site-header__container">
    <a href="index.html" class="site-header__brand-link">
      <span class="site-header__brand">MedicusUnion</span>
    </a>
    <nav class="site-header__nav">
      <a href="consultations.html" class="site-header__link">Консультации</a>
      <a href="treatment-abroad.html" class="site-header__link">Лечение</a>
      <a href="checkup.html" class="site-header__link">Чек-ап</a>
      <a href="#contact" class="site-header__link">Контакты</a>
    </nav>
    <a href="tel:+77015322478" class="site-header__phone">+7&nbsp;701&nbsp;532&nbsp;24&nbsp;78</a>
  </div>
</header>
```

[VERIFIED: codebase index.html lines 32-45]

**Footer (from index.html lines 359-384):**

```html
<footer class="footer" id="footer">
  <div class="container footer__container">
    <div class="footer__main">
      <div class="footer__company">
        <p class="footer__brand">MedicusUnion</p>
        <p class="footer__tagline">Международный медицинский сервис. Австрия&nbsp;&middot;&nbsp;Казахстан</p>
      </div>
      <div class="footer__contacts">
        <p class="footer__contact-item">
          <a href="tel:+77015322478" class="footer__link">+7&nbsp;701&nbsp;532&nbsp;24&nbsp;78</a>
        </p>
        <p class="footer__contact-item">
          <a href="mailto:kz@medicusunion.com" class="footer__link">kz@medicusunion.com</a>
        </p>
      </div>
      <div class="footer__nav">
        <a href="consultations.html" class="footer__link">Онлайн-консультации</a>
        <a href="treatment-abroad.html" class="footer__link">Лечение за&nbsp;рубежом</a>
        <a href="checkup.html" class="footer__link">Чек-ап за&nbsp;рубежом</a>
      </div>
    </div>
    <div class="footer__legal">
      <p>&copy;&nbsp;2026 MedicusUnion. Все права защищены.</p>
    </div>
  </div>
</footer>
```

[VERIFIED: codebase index.html lines 359-384]

**Sticky Bar (from index.html lines 387-392):**

```html
<div class="sticky-bar" id="sticky-bar" role="complementary" aria-label="Quick actions">
  <div class="container sticky-bar__container">
    <a href="tel:+77015322478" class="sticky-bar__phone" aria-label="Позвонить +7 701 532 24 78">
      +7&nbsp;701&nbsp;532&nbsp;24&nbsp;78
    </a>
    <a href="#contact" class="button button--primary sticky-bar__cta">Оставить заявку</a>
  </div>
</div>
```

[VERIFIED: codebase index.html lines 387-392]

**SVG Refraction Defs (from deleted partials/svg-defs.html):**

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="liquid-refract-sm" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="92" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="1" result="blurred"/>
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="0" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="liquid-refract-md" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="92" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="2" result="blurred"/>
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="18" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="liquid-refract-lg" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="92" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="3" result="blurred"/>
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="12" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

[VERIFIED: git show e13da0a^:partials/svg-defs.html]

### Scroll Detection Hook

```typescript
// src/hooks/use-scroll-position.ts
'use client';

import { useEffect, useState } from 'react';

export function useScrolled(threshold = 10) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check initial position (back button, mid-page reload)
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}
```

### Existing Scroll Detection in JS (production reference)

```javascript
// From js/main.js lines 464-475
function initStickyHeader() {
  var header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}
```

[VERIFIED: codebase js/main.js lines 464-475]

Note: Production uses `scrollY > 0`. CONTEXT.md specifies `scrollY > 10`. Use 10 as the threshold per user decision.

### Header Glass CSS Classes (already in globals.css)

```css
/* From globals.css @layer components */
.header--scrolled {
  --liquid-bg: rgba(255, 255, 255, 0.45);
  --liquid-blur-md: 60px;
  --liquid-saturate: 200%;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.dark .header--scrolled {
  --liquid-bg: rgba(30, 40, 60, 0.6);
  --liquid-blur-md: 60px;
  --liquid-saturate: 200%;
}
```

[VERIFIED: codebase next/src/app/globals.css lines 385-396]

The `.liquid-nav` class is defined in `liquid-glass.css` and provides the full glass material (backdrop-filter, blur, saturate, brightness, inset shadows). The `.header--scrolled` class overrides specific token values to make the glass more opaque and blurry when scrolled.

### Server/Client Component Boundary Map

| Component | Type | Why |
|-----------|------|-----|
| Header (shell) | Server | Static HTML: brand, nav links, phone -- no JS needed |
| HeaderClient | Client | `useEffect` for scroll detection, `useState` for isScrolled |
| MobileMenu | Client | `useState` for open/close, onClick handlers, body scroll lock |
| Footer | Server | Pure static HTML -- brand, contacts, nav, legal text |
| StickyBar | Client | `IntersectionObserver` for visibility, hide when form section visible |
| SvgRefractionDefs | Server | Static SVG -- no interactivity |
| Root layout.tsx | Server | Composition only -- wraps children with chrome |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| shadcn CLI v3 (default style) | shadcn CLI v4 (new-york only) | March 2026 | `default` style deprecated; use `new-york` |
| Tailwind config file for shadcn | @theme inline (Tailwind v4) | Late 2024 | `tailwind.config` field blank in components.json |
| React.forwardRef in components | `ref` as regular prop (React 19) | React 19, 2024 | shadcn components may still use forwardRef for compat |
| Radix UI separate packages | Unified @radix-ui package | February 2026 [CITED: ui.shadcn.com/docs/changelog/2026-02-radix-ui] | Single dependency instead of per-component packages |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | shadcn init preserves existing globals.css tokens (may need manual merge) | Standard Stack | Medium -- if tokens overwritten, glass effects break; fixable with git restore + merge |
| A2 | `next/link` with hash-only href may cause full navigation | Anti-Patterns | Low -- if wrong, Link works fine; if right, use `<a>` instead |
| A3 | `data-refract="true"` is needed on `<html>` to activate SVG refraction filters | Anti-Patterns | Low -- refraction is not active in production currently; optional enhancement |

## Open Questions

1. **Mobile menu: new feature or port?**
   - What we know: The current production HTML has NO mobile menu or hamburger button. The CSS class `.mobile-menu-overlay` exists but no corresponding HTML element is rendered. The CONTEXT.md says to create a MobileMenu component.
   - What's unclear: Should the mobile menu contain the same 4 nav links as the desktop header? Should it include the phone number?
   - Recommendation: Port the desktop nav links into the mobile menu. Include phone number as a call button. This is standard practice and the CONTEXT.md explicitly requests it.

2. **SVG refraction: enable or leave inactive?**
   - What we know: No production page sets `data-refract="true"` on `<html>`. The CSS rules for refraction are gated behind this attribute. The SvgRefractionDefs component will render the filter elements.
   - What's unclear: Should Phase 60 also add `data-refract="true"` to the `<html>` element in layout.tsx to activate the refraction effect?
   - Recommendation: Render the SvgRefractionDefs for future use, but do NOT set `data-refract="true"` by default. Refraction activation is a separate visual decision (potentially Phase 64 or later).

3. **Footer nav links: match index.html or use Next.js Link?**
   - What we know: Footer nav currently links to `consultations.html`, `treatment-abroad.html`, `checkup.html`. In Next.js, these will be `/consultations`, `/treatment-abroad`, `/checkup` -- but those pages don't exist yet (Phase 62+).
   - What's unclear: Should footer links point to future routes or current HTML pages?
   - Recommendation: Use the future Next.js routes (`/consultations`, etc.) since these are internal links that will exist by the time the site ships. They'll return 404 during development but will work once Phase 62 creates those pages.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Next.js built-in build verification |
| Config file | next/next.config.ts |
| Quick run command | `cd next && npm run build` |
| Full suite command | `cd next && npm run build && npm run start` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCAF-03 | shadcn/ui components importable | build | `cd next && npm run build` | N/A (build) |
| SCAF-05 | Layout renders Header/Footer/StickyBar/SvgRefractionDefs | build + manual | `cd next && npm run build` + visual check | N/A |

### Sampling Rate

- **Per task commit:** `cd next && npm run build`
- **Per wave merge:** `cd next && npm run build && npm run start` + visual check at 1440px and 375px
- **Phase gate:** Full build green + visual verification of header glass scroll effect + mobile menu open/close

### Wave 0 Gaps

None -- no test framework needed beyond Next.js build verification and visual check. Phase 60 components are layout chrome whose correctness is visual (glass effect renders, mobile menu opens, footer shows). Automated visual regression testing is out of scope for v6.0.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A -- no auth in layout chrome |
| V3 Session Management | no | N/A |
| V4 Access Control | no | N/A |
| V5 Input Validation | no | No form inputs in layout chrome (form is Phase 65) |
| V6 Cryptography | no | N/A |

No security concerns in Phase 60. Layout chrome components are pure presentational -- no user input, no data processing, no authentication.

## Sources

### Primary (HIGH confidence)

- Codebase: `index.html` lines 32-45 (header), 359-384 (footer), 387-392 (sticky bar) -- exact HTML structure audited
- Codebase: `js/main.js` lines 464-475 -- scroll detection logic audited
- Codebase: `next/src/app/globals.css` -- existing token pipeline, glass CSS imports, header--scrolled class verified
- Codebase: `next/src/styles/liquid-glass.css` -- `.liquid-nav` class definition verified
- Git history: `git show e13da0a^:partials/svg-defs.html` -- SVG refraction filter definitions recovered
- npm registry: shadcn@4.2.0, lucide-react@1.8.0, class-variance-authority@0.7.1, clsx@2.1.1, tailwind-merge@3.5.0 -- versions verified

### Secondary (MEDIUM confidence)

- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) -- @theme inline configuration, CSS variable structure
- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next) -- CLI init process, component import pattern
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json) -- configuration schema for Tailwind v4
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- new-york style, presets, info command

### Tertiary (LOW confidence)

- WebSearch: shadcn/ui with React 19 peer dependency notes (may need `--legacy-peer-deps` with npm) -- needs verification at install time

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified on npm, shadcn/ui Tailwind v4 docs confirm compatibility
- Architecture: HIGH -- Server/Client boundaries well-documented in Next.js App Router docs; existing HTML structure audited line-by-line
- Pitfalls: MEDIUM -- shadcn init behavior with existing globals.css is the main uncertainty; mitigated by git commit + restore strategy

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (30 days -- stable libraries, no fast-moving concerns)
