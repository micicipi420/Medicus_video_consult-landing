# Phase 59: Next.js Scaffold & CSS Foundation - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

A working Next.js 15 project where all Liquid Glass CSS tokens and materials render identically to the current production site -- proving the CSS pipeline before any page content is ported.

Requirements: SCAF-01, SCAF-02, SCAF-04

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from v6.0 research:
- Next.js 15.5.x (not 16) — wider ecosystem compat
- Tailwind CSS v4 via @tailwindcss/postcss — replaces standalone CLI
- Glass CSS stays global (single globals.css @import chain)
- backdrop-filter standard-first, -webkit- second (Turbopack #78302)
- CSS import order: explicit @import chain + "sideEffects": ["*.css"] in package.json
- Skip @squircle-js/react — CSS squircles sufficient (keep as Tailwind @layer components)
- Turbopack has backdrop-filter bug — use Webpack for production

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/styles/tailwind.css — current entry point with @import chain (fonts, tailwind, theme, squircles, liquid-glass)
- src/styles/theme.css — ~300 LOC: :root tokens (50+ --liquid-*, --mu-*), .dark cascade, @theme inline
- src/styles/squircles.css — ~150 LOC: 3-tier mask-image SVG squircles + corner-shape PE
- src/styles/liquid-glass.css — ~400 LOC: 6 material classes, buttons, shimmer, section tints, refraction
- src/styles/fonts.css — SF Pro Display + Rounded local @font-face

### Established Patterns
- CSS custom properties for all design tokens (--liquid-*, --mu-*)
- @custom-variant dark (&:is(.dark *)) for dark mode
- @layer base/utilities/components structure in theme.css
- Explicit @import chain for deterministic CSS ordering

### Integration Points
- New Next.js project will be in the same repo (migration, not separate repo)
- CSS files port directly with minimal changes
- Font files in assets/ directory

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description, success criteria, and v6.0 research (STACK.md, ARCHITECTURE.md).

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
