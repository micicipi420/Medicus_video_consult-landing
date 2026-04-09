# Phase 45: Simple Pages (404 + Contacts) - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Frontend migration — decisions locked by ROADMAP + prior phases

<domain>
## Phase Boundary

404.html and contacts.html are fully migrated to v4.0 design language (grid + squircle + liquid glass). These are canary deployments validating stacking contexts, protected legacy items, and the migration pattern before complex pages. HTML pages ARE modified.

</domain>

<decisions>
## Implementation Decisions

### 404.html Migration (MIGRATE-01)
- Grid wrapper with max-w-content (1200px)
- Squircle CTA button (.squircle-md or .squircle-lg)
- Liquid card surface for the 404 message area
- Preserve: gradient "404" text, "Страница не найдена" heading, "На главную" CTA

### contacts.html Migration (MIGRATE-02)
- Grid wrapper with max-w-content
- Liquid form container (.liquid-card)
- Squircle inputs (.squircle-md on form inputs)
- Glass contact card for contact info section
- Preserve all Protected Legacy items (nbsp bindings, honeypot, ARIA, focus-visible, form validation)

### Migration Pattern
- Add grid wrapper divs where needed
- Replace border-radius classes with .squircle-* classes
- Add .liquid-card / .liquid-regular to surfaces
- Shadow-wrap pattern where needed (per squircles.css docs)
- Chrome already upgraded via Phase 44 partials — no chrome edits

### Claude's Discretion
- Exact grid column spans for each content section
- Which elements get squircle vs. stay with border-radius (very small elements like badges)
- Exact glass class on form container vs. contact info card
- Whether to add scroll-fade classes to any content areas

</decisions>

<code_context>
## Existing Code Insights

### Available Classes
- .squircle-md/lg/xl/full from Phase 42
- .liquid-regular, .liquid-card, .liquid-card-wrap from Phase 43
- .liquid-btn-primary, .liquid-btn-secondary from Phase 43
- max-w-content (1200px) from Phase 41 tokens via @theme inline
- Grid: grid-cols-2 md:grid-cols-8 lg:grid-cols-12 (Tailwind v4 native)

### Protected Legacy (MUST survive)
1. All &nbsp; entities in Russian content
2. <br class="md:hidden"> in hero headings
3. Honeypot hidden inputs on forms
4. role="alert" aria-live="polite" on form error containers
5. Per-page SEO metadata
6. Favicon link set
7. WCAG AA text tokens
8. html { overflow-x: clip }
9. @media (prefers-reduced-motion: reduce) guard
10. scroll-margin-top: 6rem on anchor targets
11. Byte-identity pre-commit hook

### Integration Points
- Chrome already glass/squircle via Phase 44 partials
- make build rebuilds after edits
- Pre-commit hook enforces byte-identity

</code_context>

<specifics>
## Specific Ideas

404.html is the simplest page (1 main section). contacts.html has a form + contact info. Both serve as canary tests for the migration pattern.

</specifics>

<deferred>
## Deferred Ideas

None — both pages fully in scope.

</deferred>
