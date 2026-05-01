# Phase 11: Hero & First Impression - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade the hero section with a professional medical SVG illustration, enlarged CTA buttons, enhanced gradient background, and add a social proof numbers block between hero and "Знакомо?" section.

</domain>

<decisions>
## Implementation Decisions

### Hero Image
- Replace abstract stethoscope SVG with a detailed duotone SVG illustration of a doctor at a laptop/video call (consistent with existing 19 duotone icon style)
- Keep illustration at ~40% width on desktop (right side), preserve current 2-column hero layout
- Illustration remains inline SVG (no external files, no HTTP requests — per v1.0 decision)

### Hero Background
- Enhance existing gradient: more saturated from `#e0f4fb` → white, keep dot-grid texture overlay
- Make hero visually distinct from the next section (clear boundary)

### CTA Buttons
- Increase to min-height: 56px, font-size: 18px, padding: 16px 32px
- Apply to both primary and outline hero buttons

### Social Proof Block
- 3 numbers: «7 стран», «50+ врачей», «15+ специализаций»
- Full-width horizontal bar between hero and "Знакомо?" section
- Dark accent background (#0e7490) with white text — creates visual separator
- Static numbers (no JS countUp animation — simplicity for 45+ audience)

### Mobile Adaptation
- Hide hero illustration on mobile (< 768px) — text + CTA take priority
- Social proof: vertical stack, centered numbers
- CTA buttons: full width (width: 100%), stacked vertically

### Claude's Discretion
- Exact SVG illustration composition and detail level
- Social proof typography sizes and spacing
- Transition between hero gradient and social proof dark bar

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 19 inline duotone SVG icons in `#38C6F4` / `rgba(56,198,244,0.08)` palette
- Hero section already has 2-column layout with `.hero__content` + `.hero__illustration`
- Existing `.hero` background gradient and dot-grid texture in CSS
- `.button--primary` and `.button--outline` button styles

### Established Patterns
- BEM naming: `.hero__*`, `.section`, `.container`
- CSS custom properties for colors: `--color-primary`, `--color-primary-dark`
- Mobile-first responsive with breakpoints at 768px and 1024px
- `animate-on-scroll` + `is-visible` for scroll animations

### Integration Points
- New social proof section goes between `<section id="hero">` and `<section id="problem">`
- Wave divider between hero and social proof may need adjustment
- Existing `initScrollAnimations()` in main.js targets section classes

</code_context>

<specifics>
## Specific Ideas

- Social proof numbers derived from actual site content: 7 countries listed, specializations listed, doctors referenced
- Dark bar (#0e7490) creates strong visual break between hero and content — acts as trust anchor

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
