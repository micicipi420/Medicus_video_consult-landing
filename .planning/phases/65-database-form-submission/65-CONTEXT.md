# Phase 65: Database & Form Submission - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase)

<domain>
## Phase Boundary

The contact form submits to PostgreSQL via a Next.js Server Action, replacing Directus entirely — with the same validation and spam protection as the current site.

Requirements: DATA-01, DATA-02

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
- Drizzle ORM for submissions table (per v6.0 research)
- Next.js Server Action for form submission
- Zod validation matching current form rules
- Honeypot + timing spam protection
- PostgreSQL connection via environment variables
- Schema: name, phone, specialization, description, status, date_created
</decisions>

<code_context>
## Existing Code Insights
- next/src/components/sections/ContactForm.tsx: existing form with client-side validation
- Drizzle ORM recommended in v6.0 research (7KB vs Prisma 2MB)
</code_context>

<specifics>
No specific requirements beyond success criteria.
</specifics>

<deferred>
None.
</deferred>
