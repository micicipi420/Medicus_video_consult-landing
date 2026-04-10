# Phase 51: Cross-Browser Hardening - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Glass elements render correctly across Safari, Firefox, and Chrome — eliminating the known Safari backdrop-filter var() bug and providing graceful Firefox fallbacks. Shadow-wrap pattern (.liquid-card-wrap) gets a single documented deprecation strategy.

Requirements: XBRO-01, XBRO-02, XBRO-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key research findings to apply:
- Safari ignores CSS custom properties inside `-webkit-backdrop-filter` — add hardcoded fallback values before var()-based declarations
- Firefox lacks SVG filter support in backdrop-filter — existing `html[data-refract="true"]` gating is correct
- Shadow-wrap pattern needs definitive resolution — .liquid-card-wrap DEPRECATED comment contradicts drop-shadow revert

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/styles/liquid-glass.css — all glass classes (.liquid-regular, .liquid-card, .liquid-btn-secondary, .stats-glass)
- src/styles/theme.css — --liquid-* token definitions in :root and .dark

### Established Patterns
- -webkit- prefix required for Safari backdrop-filter
- @supports blocks for progressive enhancement (squircles.css)
- html[data-refract="true"] attribute for Chromium-only features

### Integration Points
- All 7 HTML pages include glass elements via partials
- css/styles.css rebuilt via `npx @tailwindcss/cli`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
