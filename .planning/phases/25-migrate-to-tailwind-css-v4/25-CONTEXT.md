# Phase 25: Migrate to Tailwind CSS v4 - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Replace the hand-written vanilla css/styles.css with Tailwind CSS v4 utility classes copied directly from the Redesign/ TSX components. Set up Tailwind CLI standalone binary for CSS compilation. Copy theme.css tokens from Redesign/src/styles/ as the Tailwind theme config. Rewrite all 5 HTML pages' class attributes to use Tailwind utilities matching the Redesign source 1:1. Remove old css/styles.css. Result: pixel-perfect visual match with the React+Tailwind Redesign prototype.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key reference files:

- **Redesign/src/styles/theme.css** — CSS tokens, @theme inline block, glass shadows, font families (COPY AS-IS)
- **Redesign/src/styles/tailwind.css** — Tailwind entry point with imports
- **Redesign/src/styles/index.css** — Base styles, @layer base overrides  
- **Redesign/src/styles/fonts.css** — Font face declarations (if any)
- **Redesign/src/app/components/*.tsx** — Tailwind classes for each section (COPY className strings)
- **Redesign/src/app/pages/*.tsx** — Tailwind classes for service pages

Approach: For each HTML section, find the corresponding TSX component, copy its Tailwind className strings verbatim into the HTML element's class attribute.

</decisions>

<code_context>
## Existing Code Insights

### Source Files (Redesign/)
- `Redesign/src/styles/theme.css` — 202 lines, full @theme inline with mu-* tokens, glass shadows, font families
- `Redesign/src/styles/tailwind.css` — 3 lines, entry point
- `Redesign/src/styles/index.css` — base styles
- `Redesign/src/app/components/Hero.tsx` — Hero section Tailwind classes
- `Redesign/src/app/components/Header.tsx` — Header + mobile menu classes
- `Redesign/src/app/components/StatsSection.tsx` — Stats grid classes
- `Redesign/src/app/components/ServicesSection.tsx` — Service cards classes
- `Redesign/src/app/components/GuideSection.tsx` — Guide cards classes
- `Redesign/src/app/components/WhyUsSection.tsx` — WhyUs advantages + collage classes
- `Redesign/src/app/components/ContactSection.tsx` — Contact form classes
- `Redesign/src/app/components/CTASection.tsx` — CTA section classes
- `Redesign/src/app/components/Footer.tsx` — Footer classes
- `Redesign/src/app/components/Layout.tsx` — Mesh background classes
- `Redesign/src/app/pages/OnlineConsultationsPage.tsx` — Service page classes
- `Redesign/src/app/pages/TreatmentAbroadPage.tsx` — Service page classes
- `Redesign/src/app/pages/CheckupsPage.tsx` — Service page classes
- `Redesign/src/app/pages/ContactsPage.tsx` — Contacts page classes

### Target Files (to modify)
- `index.html` — main page, all section classes to be replaced
- `online-consultations.html` — service page classes
- `treatment-abroad.html` — service page classes
- `checkups.html` — service page classes
- `contacts.html` — contacts page classes
- `css/styles.css` — to be DELETED (replaced by Tailwind output)
- `src/styles/` — NEW directory for Tailwind source files

### Preserved As-Is
- `js/main.js` — no changes needed (selectors reference ids/classes that stay the same)
- `js/animations.js` — no changes needed

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to Redesign/ source files as the single source of truth for all Tailwind class values.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
