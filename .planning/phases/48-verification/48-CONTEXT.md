# Phase 48: Verification - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Audit/verification phase — validates v4.0 visual upgrade didn't regress baselines

<domain>
## Phase Boundary

All 6 pages pass accessibility, performance, and reduced-motion audits. Confirms v4.0 visual upgrade preserved WCAG AA and usability baseline from v3.0-v3.2. May produce code fixes for any regressions found.

</domain>

<decisions>
## Implementation Decisions

### WCAG AA Contrast Audit (VERIFY-01)
- Manual pixel-sampling of text over glass surfaces in light AND dark mode
- All 6 pages checked
- Contrast ratio >= 4.5:1 required
- Fix any failures by adjusting glass tint opacity or text color tokens

### Keyboard Tab Order (VERIFY-02)
- Tab through all interactive elements on all 6 pages
- Focus-visible outline must be visible (outline, not box-shadow — Phase 41)
- Focus ring must not be clipped by squircle mask-image (Phase 41 guarantee)

### Budget Android FPS (VERIFY-03)
- Scroll FPS >= 30 on Samsung Galaxy A32/A52 or Xiaomi Redmi Note 10
- This requires a physical device or emulator
- If device unavailable: document as deferred with mitigation strategy

### Reduced Motion (VERIFY-04)
- prefers-reduced-motion: reduce disables shimmer, spring, specular animations
- Static glass appearance preserved (backdrop-filter still applies)
- Verify via Chrome DevTools "Emulate CSS media feature prefers-reduced-motion"

### Claude's Discretion
- Exact testing methodology (DevTools audit vs. manual inspection)
- Whether to create automated test scripts or manual checklist
- Priority order of pages to test
- Whether to fix issues inline or create gap closure plans

</decisions>

<code_context>
## Existing Code Insights

### What's Being Verified
- Phase 41: tokens + focus-visible ring (outline, not box-shadow)
- Phase 42: squircle mask-image classes
- Phase 43: liquid glass materials, dark mode, print, reduced-motion guards
- Phase 44: chrome partials with glass/squircle
- Phase 45-47: all 6 pages migrated to v4.0

### Deferred Human Verification Items (from Phases 41-47)
- Phase 41: focus-visible ring visual, dark mode token cascade
- Phase 43: dark mode glass, shimmer hover, refraction probe, print stylesheet
- Phase 44: glass header/footer/mobile-menu/sticky-bar visual
- Phase 45: glass card rendering, form stacking context, dark mode, focus-visible on squircle inputs
- Phase 46: glass rendering, dark mode legibility, tablet text overflow
- Phase 47: visual migration quality, dark mode, DIFF-01/02/03 visibility

</code_context>

<specifics>
## Specific Ideas

This phase consolidates all deferred human verification from Phases 41-47 into a single comprehensive audit.

</specifics>

<deferred>
## Deferred Ideas

- Budget Android graceful degradation tier (deferred to v4.1 unless FPS < 30)

</deferred>
