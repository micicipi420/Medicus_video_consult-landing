# Phase 64: Interactive Glass Animations - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (animation specs from ROADMAP)

<domain>
## Phase Boundary

Glass cards respond to user interaction with hover/press brightness shifts and a desktop specular highlight that follows the cursor.

Requirements: ANIM-03, ANIM-04

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All choices at Claude's discretion. Key constraints:
- Hover brightness shift on glass cards (200-300ms transition)
- Press/click darkens glass surface
- Desktop specular highlight tracks cursor via CSS custom properties
- prefers-reduced-motion disables parallax tracking but keeps static states
- Must work on liquid-regular, liquid-clear, liquid-fluted, liquid-nav
- Port initMouseSpecular from current js/main.js
- Use Framer Motion for hover/press states (already installed)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- js/main.js: initMouseSpecular function (cursor tracking + CSS custom property updates)
- Framer Motion already installed from Phase 63
- Glass CSS classes in liquid-glass.css already have brightness/opacity tokens

### Integration Points
- Glass card components on index and contacts pages
- May need a GlassCard wrapper component or hook

</code_context>

<specifics>
No specific requirements beyond success criteria.
</specifics>

<deferred>
None.
</deferred>
