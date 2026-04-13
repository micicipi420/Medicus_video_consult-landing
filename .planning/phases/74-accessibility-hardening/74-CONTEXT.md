# Phase 74: Accessibility Hardening - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Users with high-contrast or reduced-transparency preferences see an adapted interface, and all glass surfaces pass WCAG AA contrast in worst-case composite scenarios.

Requirements: ACC-01 (prefers-contrast:more), ACC-02 (prefers-reduced-transparency), ACC-03 (worst-case contrast audit), ACC-04 (focus-visible), ACC-05 (touch targets 44px)

</domain>

<decisions>
## Implementation Decisions

### High Contrast Fallback Strategy
- Glass surfaces under prefers-contrast:more use tiered solid fills: white nav, light gray cards, darker stats bar — preserves visual hierarchy instead of flattening everything to white
- Only support prefers-contrast:more (not :less) — standard practice, covers real accessibility needs
- Override BOTH :root and .dark selectors within the prefers-contrast media query — prevents cascade regression where .dark specificity silently wins

### Focus Ring Design
- 3px solid outline with 2px offset in brand cyan (#38C6F4) for :focus-visible on all interactive elements — visible on both light and dark backgrounds
- Use :focus-visible only (not :focus) — avoids showing ring on mouse clicks, better UX for sighted users

### Glass Opacity & Testing
- Raise --liquid-bg to 0.55 for text-bearing glass surfaces — ensures worst-case WCAG AA compliance (4.5:1 body, 3:1 large text)
- Use manual pixel-sampling at scroll positions over each section background for worst-case contrast verification
- Touch target enforcement: CSS min-height/min-width: 44px on ALL buttons/links across all viewports (not mobile-only) with padding adjustment

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/styles/liquid-glass.css — Section 13 (prefers-reduced-motion), Section 14 (prefers-reduced-transparency) — follow same pattern for Section 14.5 (prefers-contrast)
- src/styles/theme.css — :root and .dark token declarations with new color-mix tokens from Phase 73
- css/styles.css — vanilla layer with [data-theme="dark"] selectors

### Established Patterns
- Media query sections are numbered sequentially in liquid-glass.css
- Accessibility queries follow pattern: override tokens, not individual selectors
- Two dark mode selectors: .dark (design system) vs [data-theme="dark"] (vanilla)

### Integration Points
- prefers-contrast goes in liquid-glass.css Section 14.5
- Focus rings go in theme.css @layer utilities or css/styles.css
- Touch targets apply to all button/a elements across 4 HTML pages

</code_context>

<specifics>
## Specific Ideas

- Research notes: Apple's own Liquid Glass failed AppleVis accessibility review for not responding to high-contrast mode (March 2026)
- prefers-contrast:more has 94.59% global browser coverage (Baseline)
- Opacity floor 0.55 is research-recommended minimum for text-bearing glass
- Must test all 4 state combinations: light/dark x normal/high-contrast

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>
