# Phase 73: Token Foundation - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Glass tokens derive from a systematic color-mix pipeline instead of hardcoded rgba -- enabling all downstream phases to manipulate glass colors programmatically.

Requirements: TOK-01 (color-mix migration), TOK-02 (light-dark() for dark mode)

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from research:
- All changes extend existing files (theme.css, liquid-glass.css) -- no new CSS files
- Safari -webkit-backdrop-filter requires hardcoded fallback values (cannot use CSS vars)
- Two dark mode selectors coexist: .dark (design system) and [data-theme="dark"] (vanilla) -- use correct one per file
- color-mix(in oklch) has 95%+ browser support in KZ (Chrome 117+, Safari 16.2+, Firefox 113+)
- light-dark() has 93%+ support (Chrome 123+, Safari 17.5+, Firefox 120+)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/styles/theme.css -- :root token declarations, .dark overrides (~50+ glass tokens)
- src/styles/liquid-glass.css -- glass material classes using var() references
- css/styles.css -- vanilla version with [data-theme="dark"] selectors

### Established Patterns
- CSS custom properties cascade from :root through .dark overrides
- Glass tokens: --liquid-bg, --liquid-nav-bg, --liquid-clear-bg, --liquid-blur-*, --liquid-saturate, --liquid-brightness
- ~30 hardcoded rgba values to migrate to color-mix derivations

### Integration Points
- All glass classes reference tokens from theme.css via var()
- Safari fallback lines in liquid-glass.css must remain hardcoded
- Print stylesheet must continue working after migration

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- infrastructure phase. Refer to ROADMAP phase description and success criteria.

Research recommends: start with base colors, derive glass opacities via color-mix(in oklch, white/black, percentage), use light-dark() for automatic dark/light switching where browser supports it.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>
