# Phase 47: Index Page - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Frontend migration — highest-complexity page (13 sections)

<domain>
## Phase Boundary

index.html (the highest-complexity page with 13 sections) is fully migrated to v4.0 design language, and the responsive grid system is verified working on all 6 pages (with index being the hardest case).

</domain>

<decisions>
## Implementation Decisions

### index.html Migration (MIGRATE-06)
- Full grid + liquid + squircle treatment on all 13 sections
- Floating hero cards + z-index map compatibility
- Mesh-bg blob compatibility with glass surfaces
- Icon chip rotate-vs-squircle resolved
- Stats bar uses .stats-glass grouped backdrop (DIFF-02)
- Hero CTA gets .shimmer-sweep (DIFF-01)

### Grid System (GRID-01 applied, GRID-02 verified)
- 12-col desktop / 8-col tablet / 2-3 col mobile
- max-w-[1200px] (NOT max-w-content)
- Text cards minimum 4 columns on tablet (GRID-02)

### Migration Pattern (proven in Phases 45-46)
- max-w-[1200px] grid wrappers
- 12-col responsive grid
- liquid-card-wrap + liquid-card squircle-* for cards with shadows
- liquid-regular squircle-* for inline glass surfaces
- liquid-btn-primary squircle-md for CTA buttons
- Form inputs: squircle-md only (no nested glass)

### Claude's Discretion
- Exact column spans per section
- Floating hero card z-index arrangement with glass
- Mesh-bg blob interaction with liquid surfaces
- Icon treatment: squircle-md on icon containers vs. rotate preservation
- Section-specific glass intensity (which sections get glass vs. plain)

</decisions>

<code_context>
## Existing Code Insights

### Phase 45-46 Proven Pattern
- contacts.html: 12-col grid + shadow-wrap cards + squircle inputs
- checkup.html: 38 cards wrapped, stats-glass, 380 nbsp preserved
- online-consultations.html: 110 squircle classes, 66 liquid-card
- treatment-abroad.html: 95 squircle, 61 liquid-card

### index.html Complexity
- 13 sections (most of any page)
- Floating hero cards with absolute positioning
- Mesh-bg gradient blobs in background
- Stats/social-proof counter section
- Multiple card layouts (benefits, countries, how-it-works, doctors)

### Protected Legacy
- All &nbsp; entities
- <br class="md:hidden"> in hero headings
- Honeypot inputs
- ARIA attributes
- SEO metadata, JSON-LD
- Form validation infrastructure

</code_context>

<specifics>
## Specific Ideas

index.html is the final page migration. After this, all 6 pages use v4.0 design language.

</specifics>

<deferred>
## Deferred Ideas

None — full migration in scope.

</deferred>
