# Phase 44: Chrome Partials Upgrade - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Frontend phase — decisions locked by ROADMAP success criteria + v3.2 build pipeline

<domain>
## Phase Boundary

All 4 shared chrome partials (header, footer, mobile-menu, sticky-bar) and a new SVG defs partial use glass/squircle/grid styling. Every page inherits v4.0 visual language through the existing splicer pipeline with zero per-page chrome edits. HTML pages ARE modified in this phase (via make build splicing).

</domain>

<decisions>
## Implementation Decisions

### SVG Defs Partial (CHROME-02, locked by success criteria)
- New file: partials/svg-defs.html with hidden SVG containing filter id="liquid-refract"
- feTurbulence + feDisplacementMap filter for Chrome refraction PE
- Script block for refraction probe initialization (calls initRefractionProbe from main.js)
- All 6 pages get BUILD:svg-defs marker pairs
- scripts/build-pages.sh updated to splice this partial

### Header Partial (CHROME-01)
- .liquid-nav glass treatment on scroll
- Squircle radius on nav elements
- max-w-content grid alignment (1200px container)
- Dark mode glass via token cascade

### Footer Partial (CHROME-01)
- Glass surface treatment
- Squircle radius on footer cards/elements
- Grid alignment

### Mobile Menu Partial (CHROME-01)
- Glass backdrop treatment
- Squircle radius on menu items

### Sticky Bar Partial (CHROME-01)
- Glass surface
- Squircle radius

### Build Pipeline (locked by v3.2 architecture)
- POSIX-sh + awk marker splicer (scripts/build-pages.sh)
- Byte-identity pre-commit hook must pass
- make build as canonical entry point
- Atomic commit: partial changes + build output together

### Claude's Discretion
- Exact glass class combinations on each partial element
- Whether header gets .liquid-regular or a specialized nav variant
- Grid container implementation details in partials
- SVG defs placement in HTML (likely right after body open)
- Whether refraction script is inline in svg-defs.html or calls window.MU.initRefractionProbe()

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 42: .squircle-md/lg/xl/full classes in squircles.css
- Phase 43: .liquid-regular, .liquid-card, .liquid-btn-*, .stats-glass classes in liquid-glass.css
- Phase 43: initRefractionProbe() in js/main.js
- Phase 41: All design tokens in theme.css
- v3.2: partials/{header,footer,sticky-bar,mobile-menu}.html
- v3.2: scripts/build-pages.sh with 11-token splicer
- v3.2: BUILD marker comment pairs in all 6 HTML pages

### Established Patterns
- BUILD:name / /BUILD:name markers in HTML
- POSIX-sh splicer replaces content between markers
- Byte-identity pre-commit hook enforces consistency
- make build canonical entry point

### Integration Points
- scripts/build-pages.sh — needs new BUILD:svg-defs splicer line
- All 6 HTML pages — need BUILD:svg-defs marker pairs added
- partials/ directory — new svg-defs.html + modified header/footer/sticky-bar/mobile-menu
- Protected Legacy items (nbsp bindings, honeypot, ARIA, focus-visible, etc.)

</code_context>

<specifics>
## Specific Ideas

- ARCHITECTURE research has file structure for chrome partials upgrade
- Protected Legacy list in REQUIREMENTS.md (13 items) must survive
- Shadow-wrap pattern documented in squircles.css for glass + squircle elements

</specifics>

<deferred>
## Deferred Ideas

None — all chrome upgrades are in scope.

</deferred>
