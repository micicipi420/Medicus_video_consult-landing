# Phase 62: Contacts Page & SEO - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (1:1 port + SEO metadata)

<domain>
## Phase Boundary

The contacts page is ported with glass form styling, and both pages have complete SEO metadata via Next.js Metadata API — matching current production meta tags.

Requirements: PAGE-02, PAGE-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — 1:1 port of contacts.html + SEO metadata extraction from existing HTML. Key points:
- Reuse ContactForm component from Phase 61
- Reuse FinalCTA component from Phase 61
- Port coordinator info cards from contacts.html
- Extract meta tags from index.html and contacts.html for Next.js Metadata API
- Use Next.js generateMetadata or static metadata export
- Both pages must be SSG (static generation)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- contacts.html: contacts page structure with coordinator cards and form
- index.html head: SEO meta tags (title, description, OG tags, canonical)
- next/src/components/sections/ContactForm.tsx: reusable form component
- next/src/components/sections/FinalCTA.tsx: reusable CTA section

### Integration Points
- next/src/app/contacts/page.tsx: new route
- next/src/app/page.tsx: add metadata export
- next/src/app/layout.tsx: shared metadata in root layout

</code_context>

<specifics>
## Specific Ideas

No specific requirements — straightforward port + metadata.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
