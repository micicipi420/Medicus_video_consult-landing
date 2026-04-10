# Phase 60: Component Library & Layout Shell - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

The application shell is complete — shared chrome (header, footer, mobile menu, sticky bar, SVG defs) renders as React components in a root layout that persists across route changes. shadcn/ui initialized with base components.

Requirements: SCAF-03, SCAF-05

</domain>

<decisions>
## Implementation Decisions

### Component Architecture
- Header as Server Component with a `"use client"` sub-component for glass-on-scroll effect — keeps SSR fast
- Mobile menu state managed via useState in a `"use client"` MobileMenu component — simple, local state
- Navigation links hardcoded as array in header component — matches current static site pattern
- Component files in `src/components/layout/{Header,Footer,MobileMenu,StickyBar}.tsx` — grouped by role

### Glass Header Behavior
- Scroll detection via `useEffect` + `window.scrollY > 10` with `requestAnimationFrame` throttle — matches current JS
- Toggle `.liquid-nav` className on scroll — reuses existing CSS class from liquid-glass.css
- Fixed header height: 76px desktop / 64px mobile — matches current production

### SVG & Shared Assets
- Global `<SvgRefractionDefs>` component rendered in root layout — matches current svg-defs.html approach
- lucide-react for standard icons + custom SVG components for brand-specific (logo, flags)
- Phone number formatting with `\u00A0` (nbsp) between digits per project convention

### Claude's Discretion
- Exact shadcn/ui component configuration and theming
- Footer section content layout details
- Hamburger menu animation specifics

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- index.html header structure (lines 35-49): brand link, nav links, phone
- js/main.js: scroll detection IIFE, mobile menu toggle, header glass effect
- src/styles/liquid-glass.css: `.liquid-nav` glass material class
- next/src/app/layout.tsx: root layout already set up with fonts + lang=ru
- next/src/app/globals.css: all theme tokens + glass CSS imported

### Established Patterns
- Glass-on-scroll: add `.liquid-nav` class when `scrollY > 10`
- Mobile menu: overlay with backdrop-blur, close on link click
- Sticky bar: mobile-only CTA bar with click-to-call
- SVG refraction filters: 3-tier (subtle, medium, strong) defined as `<filter>` elements

### Integration Points
- Root layout (next/src/app/layout.tsx) wraps all pages — header/footer go here
- shadcn/ui components go in next/src/components/ui/
- Layout components in next/src/components/layout/

</code_context>

<specifics>
## Specific Ideas

- Port header HTML structure exactly from index.html (brand, nav links, phone)
- Port footer from index.html bottom section
- Mobile menu follows current overlay pattern with hamburger toggle
- StickyBar: mobile-only fixed bottom bar with phone CTA
- SVG defs: port current refraction filter SVGs as React component

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
