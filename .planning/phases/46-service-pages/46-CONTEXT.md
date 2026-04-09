# Phase 46: Service Pages - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Frontend migration — follows Phase 45 migration pattern

<domain>
## Phase Boundary

checkup.html, online-consultations.html, and treatment-abroad.html are fully migrated to v4.0 design language (grid + squircle + liquid glass), proving the pattern at moderate complexity across 3 independent page structures.

</domain>

<decisions>
## Implementation Decisions

### checkup.html Migration (MIGRATE-03)
- Grid + squircle on program/stats/B2B/form cards + liquid surfaces
- whitespace-nowrap "за 1–2 дня" MUST be preserved (Protected Legacy)
- nbsp bindings MUST be preserved

### online-consultations.html Migration (MIGRATE-04)
- Grid + squircle on doctor/pricing/trigger cards + liquid surfaces

### treatment-abroad.html Migration (MIGRATE-05)
- Grid + squircle on clinic/step/review cards + liquid surfaces

### Migration Pattern (proven in Phase 45)
- max-w-[1200px] grid wrappers (NOT max-w-content — token doesn't work)
- 12-col responsive grid: grid-cols-1 md:grid-cols-8 lg:grid-cols-12
- liquid-card-wrap + liquid-card squircle-* for cards with outer shadows
- liquid-regular squircle-* for surfaces without outer shadows
- liquid-btn-primary squircle-md for CTA buttons
- Form inputs: squircle-md replacing rounded-* (keep existing bg/blur — no nested glass)
- Chrome already upgraded via Phase 44 — no chrome edits

### Claude's Discretion
- Exact column spans per section (follow 45 pattern: content-heavy sections get wider columns)
- Which card elements get shadow-wrap vs. inline glass
- Stats bar treatment (grouped glass .stats-glass or individual cards)
- Step/process cards: numbered sequence layout approach

</decisions>

<code_context>
## Existing Code Insights

### Phase 45 Migration Pattern (proven canary)
- 404.html: grid wrapper + liquid-card squircle-xl + liquid-btn-primary squircle-md
- contacts.html: 12-col grid + shadow-wrap on cards/form + squircle inputs + badges

### Protected Legacy (MUST survive on ALL 3 pages)
- All &nbsp; entities
- <br class="md:hidden"> in hero headings
- whitespace-nowrap spans (especially checkup "за 1–2 дня")
- Honeypot inputs on forms
- role="alert" aria-live="polite" on form error containers
- Per-page SEO metadata
- All form validation infrastructure

### Integration Points
- 3 independent pages — can run in parallel (no file overlap)
- make build rebuilds after edits
- Pre-commit hook enforces byte-identity

</code_context>

<specifics>
## Specific Ideas

Follow Phase 45 pattern exactly. Each page is independent and can be a separate plan.

</specifics>

<deferred>
## Deferred Ideas

None — all 3 pages fully in scope.

</deferred>
