# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the CSS foundation, design tokens, self-hosted fonts, and base HTML structure so all subsequent section phases render correctly on any device from day one. No content sections — only the design system scaffolding.

</domain>

<decisions>
## Implementation Decisions

### CSS Architecture
- Use BEM naming convention for CSS classes — self-documenting, no tooling required
- CSS custom properties for all design tokens (colors, spacing, typography, breakpoints)
- Mobile-first media queries: base styles for mobile, min-width breakpoints for tablet (768px) and desktop (1024px)
- Single CSS file `styles.css` with logical sections via comments

### Typography
- Self-host Inter (body) and Manrope (headings) as WOFF2 — no Google Fonts dependency
- Body text: 18px minimum (rem-based: 1.125rem)
- Headings: 28-36px range (1.75rem - 2.25rem)
- Line height: 1.6 for body, 1.2 for headings

### Color System
- Primary: #38C6F4 (blue — CTAs, accents)
- Secondary: #35B678 (green — success, trust)
- Dark: #18212C (text, backgrounds)
- Light backgrounds: #F8FAFB, #FFFFFF
- High contrast text on all backgrounds (WCAG AA)

### Spacing & Layout
- 8px grid system (0.5rem increments)
- Container max-width: 1200px, centered
- Section padding: 80px vertical (desktop), 48px (mobile)
- CSS Grid for layouts, Flexbox for component alignment

### Claude's Discretion
All detailed implementation choices (exact spacing values, transition durations, shadow values) are at Claude's discretion — pure infrastructure phase.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project

### Established Patterns
- None — first phase establishes all patterns

### Integration Points
- All subsequent phases (2-9) will build on this foundation
- Font files served from /assets/fonts/
- CSS loaded from /css/styles.css

</code_context>

<specifics>
## Specific Ideas

- Brand colors from MedicusUnion brandbook: #38C6F4, #35B678, #18212C
- Fonts: Inter + Manrope (per brandbook specification)
- Target audience 45+ requires larger text and touch targets
- Medical service tone: calm, confident, professional

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
