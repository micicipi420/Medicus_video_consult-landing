# Phase 42: Squircle Primitives - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Technical phase — decisions locked by STACK research + REQUIREMENTS

<domain>
## Phase Boundary

A complete squircle utility system exists as reusable CSS classes (.squircle-md, .squircle-lg, .squircle-xl, .squircle-full), so that any element can be given a superellipse shape by adding a single class. New file: src/styles/squircles.css. No HTML pages modified.

</domain>

<decisions>
## Implementation Decisions

### Squircle Technique (locked by STACK research)
- SVG mask-image data-URI as production default (cross-browser)
- @supports (corner-shape: superellipse(2)) PE for Chrome 139+ removes mask, applies native rendering
- Graceful fallback to standard border-radius for browsers without mask-image
- Superellipse formula: n=5 (Apple standard), or corner-shape k=2

### Variant Scale (locked by REQUIREMENTS SQUIRCLE-01)
- .squircle-md — buttons, inputs, badges (16px equivalent)
- .squircle-lg — cards (24px equivalent)
- .squircle-xl — hero containers, mobile menu (40px equivalent)
- .squircle-full — pills, avatars (border-radius: 9999px, no mask needed per Phase 41 research)

### Shadow-Wrap Pattern (locked by REQUIREMENTS SQUIRCLE-04)
- Shadows rendered outside mask via wrapper element
- Outer wrapper: box-shadow, no mask
- Inner element: mask-image squircle clip
- Document as project convention

### CSS Architecture
- Dedicated file: src/styles/squircles.css
- Imported via @import in src/styles/tailwind.css or @source directive
- Uses Phase 41 tokens (--squircle-mask-md/lg/xl from theme.css)

### Claude's Discretion
- SVG path point resolution (64 vs 128 points per quadrant — optimize for file size <3KB per path)
- Exact CSS import mechanism (Tailwind @source vs @import)
- Whether to include a .squircle-shadow-wrap utility or document as HTML pattern only
- Transition behavior for squircle classes (whether to include will-change hints)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 41 tokens in theme.css: --squircle-mask-md, --squircle-mask-lg, --squircle-mask-xl (SVG data-URIs already committed)
- --squircle-mask-full: none (no mask needed for pills/circles)
- Focus-visible ring already uses outline (not box-shadow) — safe for mask-image

### Established Patterns
- CSS architecture: src/styles/theme.css (tokens), src/styles/tailwind.css (entry point)
- @layer base for global element styles
- Tailwind v4 @theme inline for utility generation
- make build compiles via Tailwind CLI standalone

### Integration Points
- src/styles/tailwind.css — must import or reference squircles.css
- Phase 43 (Liquid Glass) will apply squircle classes to glass surfaces
- Phase 44-47 will apply squircle classes to page elements
- Compiled output: css/styles.css

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond ROADMAP spec — research comprehensively defines the technique.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
