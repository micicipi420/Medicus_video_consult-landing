# Phase 71: Index Interactive Sections - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

The bottom of the index page completes the conversion funnel -- social proof from reviews, FAQ answering objections, a working contact form, and a final call-to-action. Source of truth: feat/new-design branch at commit d450232.

</domain>

<decisions>
## Implementation Decisions

### ReviewsSection (SEC-08)
- New component: patient reviews/testimonials
- Glass card styling consistent with design language
- Content from source HTML feat/new-design

### FAQSection (SEC-09)
- Accordion component with smooth expand/collapse
- Client component ('use client') for interactivity
- Questions and answers from source HTML

### ContactSection (SEC-10)
- Rewrite existing ContactSection.tsx and ContactForm.tsx
- Integrate with existing submitContactForm (Directus backend)
- Glass card styling, form validation preserved
- id="contact" for CTA anchor targets

### FinalCTA (SEC-11)
- Rewrite existing FinalCTA.tsx
- "Не откладывайте решение о здоровье" with two CTA buttons
- Glass styling consistent with design

### Claude's Discretion
- FAQ animation timing and easing
- Review card carousel vs static grid
- Form field layout (1 vs 2 columns)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- ContactSection.tsx + ContactForm.tsx -- existing form with Directus integration
- FinalCTA.tsx -- existing final CTA
- Phase 68 glass tokens and patterns

### Integration Points
- page.tsx -- renders sections, needs new imports
- Directus form submission API -- must preserve existing integration

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond matching source HTML and preserving form functionality.

</specifics>

<deferred>
## Deferred Ideas

- motion.js animations -- after all sections ported

</deferred>
