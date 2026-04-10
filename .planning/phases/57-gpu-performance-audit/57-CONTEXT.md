# Phase 57: GPU Performance Audit - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure/audit phase — discuss skipped)

<domain>
## Phase Boundary

Glass rendering stays within a strict GPU budget -- no more than 6 simultaneous backdrop-filter elements per viewport, and will-change is applied only where it measurably helps.

This is an audit + fix phase: inspect current state, identify violations, apply targeted fixes.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — audit phase. Use ROADMAP success criteria and codebase state to guide fixes.

Key constraints from REQUIREMENTS.md:
- PERF-01: Max 6 backdrop-filter elements simultaneously visible in any viewport
- PERF-02: will-change only on animated glass elements, removed from static

</decisions>

<code_context>
## Existing Code Insights

- `src/styles/liquid-glass.css` has 65 backdrop-filter references (many are fallbacks/dark mode variants)
- Comment at line 49: "NEVER use will-change: backdrop-filter on static cards"
- No `will-change` declarations currently in any CSS file (good baseline)
- Glass classes: .liquid-regular, .liquid-card, .liquid-nav, .liquid-clear, .liquid-fluted, .stats-glass, .liquid-header-backdrop, .liquid-btn-secondary

</code_context>

<specifics>
## Specific Ideas

- PERF-01 may require viewport analysis — at certain scroll positions, how many glass elements are simultaneously visible?
- If >6 backdrop-filter elements visible simultaneously, may need to conditionally disable backdrop-filter on lower-priority elements or reduce to opacity-only
- PERF-02 is likely already satisfied since no will-change exists — but need to ADD will-change to animated elements (hover/specular)

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
