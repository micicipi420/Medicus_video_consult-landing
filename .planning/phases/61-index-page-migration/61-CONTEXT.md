# Phase 61: Index Page Migration - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (1:1 port — no design decisions)

<domain>
## Phase Boundary

The index page is fully ported as a Next.js SSG page with all 13 sections rendering as React Server Components, achieving 1:1 visual parity with the current production site.

Requirements: PAGE-01

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — this is a 1:1 visual port of existing HTML sections to React components. Use the current index.html as the source of truth for:
- Section structure, content, and ordering
- CSS classes and glass effects
- Typography, spacing, colors
- Wave dividers between sections
- SVG icons and illustrations

Key constraints:
- 8+ of 13 sections MUST be Server Components (no "use client")
- Only interactive sections need client boundaries: ContactForm (form state), FAQ (accordion), animated counters
- Page must be SSG (static generation) — no dynamic data
- All existing CSS classes from globals.css/liquid-glass.css/squircles.css are available
- Use shadcn/ui components where appropriate (Button, Card, Input, Select, Textarea)
- Phone number with nbsp per project convention
- All Russian text content copied verbatim from index.html

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- index.html: 13 sections with all content, classes, and structure
- next/src/components/ui/: shadcn Button, Card, Input, Select, Textarea, Dialog
- next/src/app/globals.css: all theme tokens + glass CSS
- next/src/styles/liquid-glass.css: glass material classes
- next/src/styles/squircles.css: squircle masks

### Established Patterns
- Server Component by default, "use client" only when needed
- Glass classes applied via className (liquid-regular, liquid-card, etc.)
- Squircle masks via className (squircle-md, squircle-lg, etc.)
- next/link for internal routes, plain <a> for hash anchors and tel: links

### Integration Points
- next/src/app/page.tsx: compose all 13 sections
- next/src/components/sections/: new directory for section components
- Layout shell (header/footer) already in place from Phase 60

</code_context>

<specifics>
## Specific Ideas

Port sections in this order from index.html:
1. Hero (with gradient mesh background, headline, CTA buttons)
2. Stats (social proof numbers)
3. Services (3-column service cards)
4. Problems ("Znakomо?" section with icons)
5. Process (step-by-step process)
6. Countries (flags and country cards)
7. Advantages (feature cards)
8. Triggers (urgency/motivation section)
9. Pricing (glass pricing card with badge)
10. ContactForm (form with validation — "use client")
11. FAQ (accordion — "use client")
12. FinalCTA (dark section with CTA)
13. Wave dividers between sections as needed

</specifics>

<deferred>
## Deferred Ideas

None — 1:1 port stays within phase scope.

</deferred>
