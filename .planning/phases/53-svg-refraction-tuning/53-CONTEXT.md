# Phase 53: SVG Refraction Tuning - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

The SVG refraction filter is calibrated per-element for optimal visual fidelity without excessive GPU cost -- displacement scale and noise frequency are tuned to each glass surface's size and context.

Currently a single filter (`#liquid-refract` in `partials/svg-defs.html`) with uniform parameters:
- `baseFrequency="0.008"` / `numOctaves="2"` / `scale="30"`
- Applied via `html[data-refract="true"]` gate to `.liquid-regular`, `.liquid-card`, `.stats-glass`
- Chrome-only (JS probe sets `data-refract="true"`)

Phase 53 differentiates these into 3+ size categories.

</domain>

<decisions>
## Implementation Decisions

### Differentiation Strategy
- Use multiple SVG filter definitions (e.g., `#liquid-refract-sm`, `#liquid-refract-md`, `#liquid-refract-lg`) rather than CSS custom properties for per-element tuning -- SVG filter parameters (`baseFrequency`, `scale`) cannot be set via CSS custom properties
- 3 size categories: small (badges/chips/nav items), medium (cards), large (hero/full-width sections)
- Small elements get minimal/zero refraction (avoid visual noise at small scale)
- Large elements get subtle refraction (text must remain legible through distortion)
- Medium elements (cards) keep current-ish values as baseline

### Claude's Discretion
- Exact `baseFrequency`, `numOctaves`, `scale` values per category -- Claude should calibrate based on visual readability and GPU impact
- Whether to add a 4th category or keep at 3
- Whether `stats-glass` maps to medium or large
- `feGaussianBlur stdDeviation` adjustments per category
- Whether to gate individual filters behind separate `data-refract` attributes or use a single gate

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `partials/svg-defs.html` -- single SVG filter definition, spliced into all 7 pages
- `src/styles/liquid-glass.css` Section 10 -- refraction progressive enhancement CSS
- `js/main.js` `initRefractionProbe()` -- Chromium feature detection

### Established Patterns
- SVG defs partial is included via build pipeline (`make build` / `build-pages.sh`)
- Refraction gated by `html[data-refract="true"]` attribute
- CSS references filter via `backdrop-filter: url(#liquid-refract) blur(...)`
- Dark mode has separate refraction block (reduced-motion also covered)

### Integration Points
- `partials/svg-defs.html` -- add new filter definitions here
- `src/styles/liquid-glass.css` Section 10 -- update CSS selectors to reference per-size filters
- No JS changes needed (probe stays the same, just enabling/disabling refraction globally)

</code_context>

<specifics>
## Specific Ideas

- PERF-03 requires GPU memory increase <10% vs baseline -- this constrains how aggressive large-surface refraction can be
- Current `scale="30"` is quite high -- may need to reduce for large surfaces where text legibility matters
- Small elements should probably skip refraction entirely (scale=0 or no filter reference)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>
