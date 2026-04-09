# Phase 43: Liquid Glass Primitives - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Technical phase — decisions locked by FEATURES/STACK/ARCHITECTURE research + REQUIREMENTS

<domain>
## Phase Boundary

A complete Liquid Glass material system and distinctive components exist as reusable CSS/JS classes in src/styles/liquid-glass.css and js/ files, so that any surface can be given glass treatment and the 3 differentiator effects (shimmer, grouped stats, scroll-edge fade) are ready to apply. No HTML pages modified — primitives only.

</domain>

<decisions>
## Implementation Decisions

### Glass Material — Regular Variant (LIQUID-01, locked by FEATURES research B.3)
- Light recipe: backdrop-filter: blur(24px) saturate(180%) brightness(108%)
- Tint overlay: background rgba(255,255,255,0.18) from Phase 41 --liquid-bg token
- Rim lighting: asymmetric inset shadow — bright top (1px white 0.9), dim bottom (1px black 0.05)
- Use Phase 41 liquid tokens (--liquid-blur-md, --liquid-saturate, --liquid-brightness, rim shadows)
- Single .liquid-regular class — no Clear variant (out of scope per REQUIREMENTS)

### Dark Mode Glass (LIQUID-02, locked by FEATURES research B.4)
- Dark recipe under .dark: rgba(30,40,60,0.45) base, blur 28px, saturate 160%, brightness 115%
- Reverses v1.4 "glass-off" decision — dark mode gets real glass
- Dark rim: dim top (1px white 0.15), bright bottom (1px white 0.08)
- Uses Phase 41 dark tokens under .dark {} selector

### Primary CTA (LIQUID-03, locked by REQUIREMENTS)
- Keeps gradient fill (green→teal from --mu-cta-from/--mu-cta-to)
- Adds specular edge treatment (thin inset highlight, not full glass)
- NOT clear glass — conversion affordance for ЦА 45+

### Secondary/Tertiary Buttons (LIQUID-04, locked by REQUIREMENTS)
- .liquid-regular glass material
- font-semibold label for readability
- Hover: brightening (increase brightness or saturate)
- Press: scale(0.97) with --dur-press transition
- Icon + arrow label for affordance ЦА 45+
- Button utility class: .btn-glass or similar

### Refraction Effect (LIQUID-05, locked by STACK research)
- SVG feTurbulence + feDisplacementMap inline filter
- Chrome 139+ only via JS probe (~10 LOC)
- Sets html[data-refract] attribute when supported
- CSS: @supports rule or [data-refract] selector applies refraction
- Safari/Firefox show blur-only glass (graceful degradation)

### Print Stylesheet (LIQUID-06)
- @media print: glass surfaces render as opaque white with 1px border
- No backdrop-filter in print

### Reduced Motion (LIQUID-07, locked by REQUIREMENTS)
- @media (prefers-reduced-motion: reduce): disables shimmer, spring animations
- Keeps static glass appearance (backdrop-filter still applies)
- Extends existing reduced-motion guard in theme.css

### Shimmer Sweep — DIFF-01 (locked by REQUIREMENTS)
- Hero primary CTA only — max 1 per viewport
- CSS @keyframes sweep animation on hover
- Reduced-motion: disabled

### Grouped Stats Backdrop — DIFF-02
- 4 stat cards in single liquid glass surface
- CSS class for grouped glass container

### Scroll-Edge Fade — DIFF-03
- CSS mask-image gradient fade at content/chrome overlap
- Applied via utility class

### Claude's Discretion
- Exact CSS class names beyond .liquid-regular (e.g., .liquid-cta, .btn-glass, .shimmer-sweep, .stats-glass, .scroll-fade)
- CSS file structure (single liquid-glass.css or split into sub-files)
- Refraction JS probe implementation details
- Shimmer animation timing/easing specifics
- Whether to use CSS custom properties for animation params
- Grouped stats: single background element vs. CSS container approach

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 41 tokens: --liquid-bg, --liquid-blur-md, --liquid-saturate, --liquid-brightness, rim shadow tokens, --ease-liquid, --dur-press/hover/sheet
- Phase 41 dark tokens: under .dark {} with tuned dark recipe values
- Phase 41 motion tokens: --dur-hover (280ms), --dur-press (100ms)
- Existing glass shadows in theme.css: --shadow-glass-sm/md/lg, --shadow-glass-inner
- Existing reduced-motion guard in theme.css

### Established Patterns
- @custom-variant dark (&:is(.dark *)); for dark mode
- @layer base for global styles
- @import chain in tailwind.css
- Phase 42 squircles.css as model for new CSS utility file

### Integration Points
- src/styles/tailwind.css — must import liquid-glass.css
- js/ directory — refraction probe JS
- Phase 44 chrome partials will reference glass classes
- Phase 45-47 pages will apply glass classes to elements

</code_context>

<specifics>
## Specific Ideas

- FEATURES research B.3 has exact CSS recipes for light/dark glass
- FEATURES research B.6 has refraction SVG filter code
- FEATURES research B.7 has shimmer animation CSS
- ARCHITECTURE research C.7 has file structure for liquid-glass.css

</specifics>

<deferred>
## Deferred Ideas

- Tinted glass variants (green, blue) — deferred to v4.1+ per REQUIREMENTS
- Scroll-linked header blur progression — deferred per ARCHITECTURE research
- Cursor-follow specular highlight — out of scope per REQUIREMENTS

</deferred>
