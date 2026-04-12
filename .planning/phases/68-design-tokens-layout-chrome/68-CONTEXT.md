# Phase 68: Design Tokens & Layout Chrome - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

The application's visual foundation matches the new design -- updated color palette, typography scale, and all persistent layout elements (header, footer, sticky bar, mobile menu) reflect the new design language. Source of truth: feat/new-design branch at commit d450232.

</domain>

<decisions>
## Implementation Decisions

### Glassmorphism Approach
- Use existing liquid-glass.css classes for all glass effects — already imported in globals.css, maintains v6.0 decision (glass CSS stays global)
- Implement animated mesh background as layout component (MeshBackground.tsx) — easy to toggle per page, SSR-friendly
- Header glass transition via JS state in HeaderClient — already has scroll detection pattern, add glass class on scroll
- Keep Webpack for dev+prod — Turbopack backdrop-filter bug #78302 still unresolved

### Navigation Structure
- Add "О компании" as 5th nav link — anchor #why-us on index, smart link on other pages
- Switch desktop nav breakpoint from md (768px) to lg (1024px) — more room for 5 links + phone + CTA
- Add gradient CTA button "Обсудить случай" to desktop header — matches new design, drives conversions
- Logo as gradient text (from-mu-blue to-mu-accent-blue) — matches new design exactly

### Footer Redesign
- Switch from dark #1A365D to glass card on light background — white/60 backdrop-blur, matches new design
- 4-column layout: Company, Services, Navigation, Contacts — matches new design exactly
- Include legal entities (MedicusUnion GmbH + ТОО MedicusUnion KZ) — builds trust with ЦА 45+
- Skip App Store / Google Play badges — no live apps to link to

### Design Token Migration
- Keep CSS custom properties + use Tailwind theme extension — current --mu-* tokens work, Tailwind v4 reads them
- Add glass shadow utilities (shadow-glass-header, shadow-glass-lg, shadow-glass-inner-strong)
- StickyBar: #contact on index, smart fallback to /contacts on service pages
- Remove dark mode tokens and [data-theme="dark"] from globals.css — new design has no dark mode

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `liquid-glass.css` — glass effect classes already available
- `HeaderClient.tsx` — scroll detection and state management
- `MobileMenu.tsx` — body scroll lock, overlay pattern
- `StickyBar.tsx` — IntersectionObserver hide-on-contact logic
- `navigation.ts` — centralized nav links, phone, email constants

### Established Patterns
- Tailwind v4 with CSS custom properties in globals.css
- Server components (Header, Footer) wrapping client components (HeaderClient, MobileMenu, StickyBar)
- `@/lib/navigation` as single source for link data
- lucide-react for icons

### Integration Points
- `globals.css` — design tokens, imports liquid-glass.css
- `layout.tsx` — renders Header, Footer, StickyBar
- `navigation.ts` — add 5th link "О компании" here
- `next.config.ts` — Webpack config for backdrop-filter

</code_context>

<specifics>
## Specific Ideas

- Header must match floating glass pill style: `fixed top-4 left-4 right-4 rounded-[2.5rem]` with glass background
- Footer uses glass card container: `bg-white/60 backdrop-blur-3xl rounded-[3rem]` inside light section
- Mobile menu uses glass overlay: `bg-white/60 backdrop-blur-[80px]` rounded-3xl panel
- StickyBar uses glass: `bg-white/60 backdrop-blur-3xl rounded-2xl` with gradient CTA
- Mesh background: 3 gradient blobs (mu-blue/30, mu-green-300/20, mu-accent-blue/15) with white/40 frosted overlay
- ISO 27001 / GDPR / Astana Hub badges in footer bottom bar

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
