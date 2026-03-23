# Phase 12: Sticky Navigation - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Add sticky header behavior and section navigation links. Header becomes fixed on scroll with nav links to key sections.

</domain>

<decisions>
## Implementation Decisions

### Sticky Behavior
- Header gets `position: sticky; top: 0; z-index: 100` with subtle box-shadow on scroll
- JS adds `.is-scrolled` class to header when `scrollY > 0` for shadow toggle
- Smooth transition for shadow appearance

### Navigation Links
- Add nav links: «Как это работает» (#process), «Врачи» (#doctors), «Цена» (#pricing), «Заявка» (#form)
- Links placed between brand and phone number
- Hidden on mobile (< 768px) — sticky bar already handles mobile CTA
- On desktop: inline horizontal list, subtle font-weight/color

### Mobile
- Nav links hidden on mobile — header stays compact (brand + phone only)
- Existing sticky bottom bar handles mobile CTA navigation

### Claude's Discretion
- Nav link styling (font-size, color, hover state)
- Shadow intensity and transition timing
- Header background opacity on scroll (if desired)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.site-header` with `.site-header__container` (brand + phone)
- `initSmoothScroll()` already handles anchor links
- Existing section IDs: #process, #doctors, #pricing, #form

### Established Patterns
- BEM naming: `.site-header__nav`, `.site-header__link`
- Mobile-first CSS with 768px breakpoint
- ES5 syntax, IIFE pattern in main.js

### Integration Points
- Header is `<header class="site-header" id="header">`
- `initSmoothScroll()` handles `a[href^="#"]` — nav links will work automatically
- z-index must be above social proof bar and other elements

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard sticky nav implementation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
