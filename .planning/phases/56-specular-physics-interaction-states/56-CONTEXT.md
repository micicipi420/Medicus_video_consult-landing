# Phase 56: Specular Physics & Interaction States - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Glass surfaces respond to cursor position with a subtle specular highlight shift, and all glass elements have consistent hover/press/focus interaction states.

Existing: `initMouseSpecular()` in js/main.js already tracks mouse position for `.liquid-card` elements via `--mouse-x`/`--mouse-y`. Phase 56 extends this to ALL glass classes and adds unified hover/press/focus states.

</domain>

<decisions>
## Implementation Decisions

### Specular Parallax Extension
- Extend `initMouseSpecular()` to target all glass classes: `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.stats-glass`
- Keep touch-primary and reduced-motion guards intact
- Specular highlight via `::after` radial-gradient already exists for `.liquid-card` -- extend pattern to other glass classes

### Unified Interaction States
- **Hover:** Brighten glass surface subtly (filter: brightness(1.05) or similar)
- **Press/Active:** Darken surface (filter: brightness(0.95) or scale(0.97))
- **Focus-visible:** Clear ring meeting WCAG AA (outline-based, per Phase 41 migration)
- Transitions: 200-300ms smooth
- Applied consistently across ALL glass variants (regular, card, clear, fluted, nav)

### Reduced Motion
- prefers-reduced-motion disables specular parallax (mouse tracking) but keeps static states (hover brightness, press darken, focus ring)

### Claude's Discretion
- Exact brightness values for hover/active states
- Whether specular on non-card glass uses same `::after` pattern or background layer
- Transition timing function (ease-out vs ease-liquid)
- Whether `.liquid-header-backdrop` (nav) gets hover effects (probably not -- it's a backdrop, not interactive)
- Focus ring color and offset values

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `js/main.js` `initMouseSpecular()` -- mouse tracking for cards (lines 547-562)
- `src/styles/liquid-glass.css` -- `.liquid-card::after` radial-gradient specular (lines 429+)
- Button hover/active states exist as reference pattern (lines 288-328)
- Motion tokens: `--dur-hover`, `--dur-press`, `--ease-liquid`

### Established Patterns
- `::after` used for specular on cards, `::before` for tint/effects
- Touch detection via `(pointer: coarse)` media query
- Reduced-motion check via JS `matchMedia`

### Integration Points
- `js/main.js` -- extend initMouseSpecular() selector
- `src/styles/liquid-glass.css` -- add hover/active/focus-visible rules
- No HTML changes needed

</code_context>

<specifics>
## Specific Ideas

- VFEX-02: specular follows cursor OUTSIDE the card (near but not on it) -- current implementation follows inside
- VFEX-03: must work on all 4 variants consistently

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
