# Phase 6: Navigation & Mobile Interaction - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Cross-cutting navigation and mobile interaction: verify all 11 sections present in order (STRUC-01), full responsive verification (UX-01), smooth scroll for CTA buttons (NAV-01), sticky mobile CTA bar (NAV-02), and click-to-call phone in header/sticky/footer (NAV-03).

</domain>

<decisions>
## Implementation Decisions

### All Sections Present (STRUC-01)
- Verify all 11 sections exist in correct order: Hero, Problem, Benefits, Process, Doctors, Advantages, Scenarios, Pricing, Form (placeholder), FAQ, Final CTA + Footer

### Responsive Verification (UX-01)
- Full responsive check: mobile (375px), tablet (768px), desktop (1024px+)
- All sections must render correctly at each breakpoint
- No horizontal overflow, no text truncation, no overlapping elements

### Smooth Scroll (NAV-01)
- All CTA buttons with href="#form" scroll smoothly to form section
- Add CSS `scroll-behavior: smooth` to html element
- Also scroll-behavior for any other anchor links

### Sticky Mobile CTA Bar (NAV-02)
- Fixed bottom bar on mobile only (hidden on desktop 1024px+)
- Contains: phone number (click-to-call) + «Оставить заявку» button
- Semi-transparent background, doesn't obscure too much content
- Hides when form section is in viewport (optional JS enhancement)
- 48px+ touch targets

### Click-to-Call Phone (NAV-03)
- Phone: +7 701 532 24 78 with tel: link
- Present in: header area (top of page), sticky mobile bar, footer
- Header phone: visible on all viewports

### Claude's Discretion
- Header design (minimal — logo/phone, or more structured)
- Sticky bar opacity and blur effect
- Whether to add a simple top navigation
- Transition animation for sticky bar hide/show

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- All 11 sections built in phases 2-5
- js/main.js exists with accordion logic — extend with scroll and sticky bar
- Footer already has phone number with tel: link

### Integration Points
- Add header element before main content
- Add sticky bar fixed element
- Extend js/main.js with smooth scroll and IntersectionObserver for sticky bar
- Add scroll-behavior: smooth to html in CSS

</code_context>

<specifics>
## Specific Ideas

- Keep header minimal — phone + maybe logo text, not a full navbar
- Sticky bar is critical for mobile conversion (45+ audience)
- Form section doesn't exist yet (Phase 7) — use placeholder anchor #form

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
