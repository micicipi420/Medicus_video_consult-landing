# Phase 55: Glass Material Variants & Hierarchy - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Three distinct glass materials exist (clear, fluted, regular) with a formalized 3-level hierarchy -- giving designers explicit choices for different UI contexts.

Current glass classes: .liquid-regular, .liquid-card (regular+padding), .liquid-btn-primary/secondary, .liquid-header-backdrop, .stats-glass. Phase 55 adds .liquid-clear and .liquid-fluted, and formalizes 3 hierarchy levels.

</domain>

<decisions>
## Implementation Decisions

### New Glass Variants
- `.liquid-clear` -- higher transparency + dimming layer for overlay contexts (modals, lightboxes). Visually distinct from .liquid-regular
- `.liquid-fluted` -- vertical streak patterns via repeating-linear-gradient. Textured glass distinct from regular blur

### 3-Level Glass Hierarchy
- Level 1: `.liquid-nav` (navigation) -- lightest blur, highest transparency. Currently `.liquid-header-backdrop` fills this role; formalize as `.liquid-nav`
- Level 2: `.liquid-regular` (standard cards) -- medium blur/opacity/shadow. Current default
- Level 3: `.liquid-clear` (overlay) -- highest transparency + dimming backdrop

### All Variants Must:
- Work in light and dark mode
- Inherit adaptive tinting from parent section (Phase 54)
- Be demonstrable in styleguide.html
- Pass make build

### Claude's Discretion
- Exact blur, opacity, shadow values per hierarchy level
- Whether `.liquid-nav` replaces `.liquid-header-backdrop` or aliases it
- Fluted glass stripe width, opacity, angle
- Whether clear glass dimming layer uses `::before`/`::after` or background layer
- Whether to apply new variants to any existing pages or just define them as available classes

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/liquid-glass.css` -- 550+ lines with mature glass system
- `.liquid-header-backdrop` -- existing nav-weight glass (line 328)
- `::before` (specular) and `::after` (glint border) pseudo-elements in use
- Adaptive tinting cascade (--liquid-tint-*) from Phase 54

### Established Patterns
- Glass elements follow: base material + overlay pseudo-elements + tint cascade
- Dark mode `.dark` overrides for all glass classes
- Reduced-motion, reduced-transparency, print fallbacks in Section 11
- Safari/Firefox fallback in Sections 12-13

### Integration Points
- `src/styles/liquid-glass.css` -- add new classes here
- `styleguide.html` -- add demo sections for new variants
- May need `make build` to rebuild pages if styleguide changes

</code_context>

<specifics>
## Specific Ideas

- GLAS-03 requires all 3 hierarchy levels to have DISTINCT blur, opacity, and shadow values visible in DevTools
- Keep `.liquid-regular` as the workhorse -- `.liquid-clear` and `.liquid-fluted` are for specific contexts
- `.liquid-fluted` should look like Apple's iOS fluted glass (vertical ribbed texture)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>
