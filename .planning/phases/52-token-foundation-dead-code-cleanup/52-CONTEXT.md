# Phase 52: Token Foundation & Dead Code Cleanup - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

The CSS codebase is free of legacy dead weight -- unused tokens, wrapper div artifacts, and dead files are removed so that subsequent phases build on a clean foundation.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from REQUIREMENTS.md:
- CLEN-01: Remove shadcn/React legacy tokens (popover, chart, sidebar families)
- CLEN-02: Remove .liquid-card-wrap wrapper divs from HTML (70+ elements) and CSS class
- CLEN-03: Delete src/styles/index.css, remove unused green ramp tokens (--mu-green-200, -400, -900)

</decisions>

<code_context>
## Existing Code Insights

Codebase context will be gathered during plan-phase research.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
