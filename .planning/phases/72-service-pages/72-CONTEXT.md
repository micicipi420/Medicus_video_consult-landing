# Phase 72: Service Pages - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

All three service pages reflect the new design language -- visitors navigating to consultations, treatment abroad, or checkup see content and styling consistent with the redesigned index page. Source of truth: feat/new-design branch service page HTML files.

</domain>

<decisions>
## Implementation Decisions

### General Approach
- Rewrite all service page section components to match new glass design language
- Use shared patterns from index sections (glass cards, gradient titles, accent colors)
- Preserve page structure and content, update only styling
- Source: feat/new-design:online-consultations.html, treatment-abroad.html, checkup.html

### Consultations Page (SRV-01)
- 7 section components to restyle with glass design
- Reuse ContactSection and FinalCTA from Phase 71

### Treatment Abroad Page (SRV-02)
- 4 section components to restyle with glass design
- Reuse ContactSection and FinalCTA from Phase 71

### Checkup Page (SRV-03)
- 7 section components to restyle with glass design
- Reuse ContactSection and FinalCTA from Phase 71

### Claude's Discretion
- Component consolidation where sections are very similar across pages
- Image replacement strategy (local vs existing)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- All Phase 68-71 glass patterns (tokens, cards, typography)
- ContactSection + FinalCTA already restyled in Phase 71
- lucide-react icons

### Integration Points
- Service page page.tsx files render their section components
- Shared layout with Header/Footer from Phase 68

</code_context>

<specifics>
## Specific Ideas

Match new design HTML for each service page exactly.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
