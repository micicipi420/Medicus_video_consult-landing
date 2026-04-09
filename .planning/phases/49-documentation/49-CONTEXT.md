# Phase 49: Documentation - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Documentation phase — documents the v4.0 design system for contributors

<domain>
## Phase Boundary

docs/DESIGN-SYSTEM.md documents the complete v4.0 design system. styleguide.html is a live reference page proving the 7th-page invariant (new page can be authored using only documented components + splicer pipeline).

</domain>

<decisions>
## Implementation Decisions

### DESIGN-SYSTEM.md (DOCS-01, locked by REQUIREMENTS)
- Shadow-wrap idiom documentation
- Class inventory (all squircle-*, liquid-*, stats-glass, shimmer-sweep, scroll-fade-* classes)
- Token scale (grid, squircle, liquid, motion tokens)
- Anti-patterns (what NOT to do)
- Russian typography rules (nbsp bindings, orphan prevention)
- Protected files list (files that must not be modified)
- Scope creep guards (what's out of scope for future work)

### styleguide.html (DOCS-02)
- Live visual reference page with ALL design system components
- Glass cards, squircle masks, typography scale, button variants, form elements
- Proves 7th-page invariant: authored using only documented components + splicer pipeline
- Uses BUILD markers, spliced by build-pages.sh like all other pages
- Not a production endpoint — dev reference only

### Claude's Discretion
- Documentation organization and section ordering
- styleguide.html page layout and section grouping
- Whether to include dark mode toggle demo in styleguide
- Level of code examples in docs

</decisions>

<code_context>
## Existing Code Insights

### What to Document
- src/styles/theme.css — all tokens (grid, squircle, liquid, motion, color, vertical rhythm)
- src/styles/squircles.css — 4 squircle classes + shadow-wrap pattern (already documented in file header)
- src/styles/liquid-glass.css — 9 class groups + print + reduced-motion (already documented in file header)
- partials/ — 5 partials (header, footer, mobile-menu, sticky-bar, svg-defs)
- scripts/build-pages.sh — splicer with BUILD markers

### Existing docs/
- docs/BUILD.md — contributor build reference (v3.2)

### 7th-page invariant (v3.2)
- Already proven: new pages need only body + BUILD markers
- styleguide.html proves this again with v4.0 components

</code_context>

<specifics>
## Specific Ideas

The file header comments in squircles.css and liquid-glass.css already contain significant documentation (shadow-wrap pattern, anti-patterns). DESIGN-SYSTEM.md should reference these rather than duplicate.

</specifics>

<deferred>
## Deferred Ideas

- styleguide.html as production page with routing — v4.0 ships it as dev reference only

</deferred>
