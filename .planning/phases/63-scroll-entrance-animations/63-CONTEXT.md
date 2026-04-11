# Phase 63: Scroll & Entrance Animations - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (animation specs from ROADMAP success criteria)

<domain>
## Phase Boundary

Pages feel alive with scroll-triggered reveal animations on all sections and a staggered hero entrance sequence — matching the current site's motion design.

Requirements: ANIM-01, ANIM-02

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion. Key constraints from v6.0 research:
- LazyMotion + domAnimation for tree-shaking (under 8KB gzipped)
- ScrollReveal wrapper component ("use client") wrapping Server Component sections
- translateY(20px) + opacity for scroll-reveal (per project 20px vestibular parameter)
- Hero stagger: heading → subtitle → CTA → cards, 100-150ms intervals
- prefers-reduced-motion: transform: none (not duration:0)
- Animation wrappers as thin client boundaries around server content
- Use `m` components (not `motion`) with LazyMotion for smaller bundle

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- js/animations.js: current Motion CDN entrance animations (fade-up, stagger, hero, header)
- All section components already created in next/src/components/sections/
- next/src/app/page.tsx: composition of all sections

### Established Patterns
- Current site uses IntersectionObserver for scroll-reveal
- translateY(20px) is the established reveal distance
- prefers-reduced-motion guard required

### Integration Points
- Wrap each section in page.tsx with ScrollReveal component
- Hero section gets special staggered entrance
- Animation components in next/src/components/motion/

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond success criteria.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
