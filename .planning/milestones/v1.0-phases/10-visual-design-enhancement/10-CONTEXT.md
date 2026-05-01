# Phase 10: Visual Design Enhancement - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Add visual richness to the existing site: hero imagery, SVG icons instead of emoji, scroll-triggered animations, decorative elements, gradient backgrounds, and card enhancements. All within vanilla HTML/CSS/JS — no build tools, no frameworks. Must respect 45+ audience (no aggressive motion) and prefers-reduced-motion.

</domain>

<decisions>
## Implementation Decisions

### Hero Section Visual Treatment
- **D-01:** Hero gets a subtle gradient background (brand blue → teal at ~15% opacity) instead of flat --color-light, creating visual depth without competing with text
- **D-02:** Add a decorative SVG illustration on the right side (desktop) — abstract medical motif: stethoscope/heart/cross line art in brand blue, NOT a stock photo of a doctor (avoids uncanny valley, stays lightweight)
- **D-03:** Illustration hides on mobile (text takes full width), appears at 768px+ as a 40% width column
- **D-04:** Add a subtle CSS dot-grid pattern overlay at low opacity (0.03) for texture on the hero background

### Icons: SVG Replacing Emoji
- **D-05:** Replace 26 emoji icons with inline SVG — consistent rendering across all browsers and devices (emoji render differently on Android vs iOS vs Windows)
- **D-06:** Icon style: **duotone** — primary stroke in brand blue (#38C6F4), fill at 10% opacity. Clean, medical-professional feel
- **D-07:** Country flags in the doctors section stay as emoji — they render well across platforms, are universally recognized, and SVG flags would be heavy
- **D-08:** Icons sized via CSS custom properties: --icon-size-sm (32px), --icon-size-md (48px), --icon-size-lg (64px)
- **D-09:** SVG icons embedded inline in HTML (not external sprite) — keeps it simple, no additional HTTP requests, easily customizable per-icon colors

### Scroll Animations & Micro-interactions
- **D-10:** Use IntersectionObserver-based **fade-in-up** animation for section content: elements start at opacity 0 + translateY(24px), animate to visible when 20% in viewport
- **D-11:** Animation timing: 600ms ease-out with staggered delay per child element (100ms per card in grids)
- **D-12:** **Minimal motion approach** for 45+ audience: no parallax, no sliding panels, no continuous animation. Just entrance animations that play once
- **D-13:** Respect `prefers-reduced-motion: reduce` — disable all scroll animations, show content immediately
- **D-14:** Button hover: subtle lift effect (translateY(-2px) + shadow increase), no color flash or bounce
- **D-15:** FAQ accordion: add height transition (currently show/hide is abrupt with hidden attribute — switch to max-height CSS transition)

### Visual Enrichment of Sections
- **D-16:** Section dividers: subtle **wave SVG** between alternating sections (light → white transitions), 60px height, using brand colors at 5% opacity
- **D-17:** Cards: add left-border accent (3px solid --color-primary) on hover, slight scale(1.02) on hover with shadow-lg
- **D-18:** Process steps: connect the 3 steps with a dashed line (CSS ::after pseudo-element) on desktop, hidden on mobile
- **D-19:** Pricing card: add a subtle pulse glow animation on the CTA button (brand blue shadow pulsing) — draws eye to the action, stops after 3 cycles
- **D-20:** Form section: add a soft radial gradient halo behind the form wrapper — draws attention without being loud
- **D-21:** Final CTA section: enhance dark background with a subtle gradient (dark → slightly lighter dark), not flat
- **D-22:** Add a thin gradient line (blue → green) under the header as a brand signature

### Claude's Discretion
- Exact SVG icon paths/designs for each of the ~15 unique icons needed
- Wave divider exact shape (sine wave, smooth curve, etc.)
- Animation easing curves and exact timing refinements
- Dot-grid pattern size and spacing
- Gradient exact stops and angles
- Hero illustration exact composition

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Prior phase context
- `.planning/phases/01-foundation-design-system/01-01-PLAN.md` — CSS design tokens, color system
- `.planning/REQUIREMENTS.md` — Out of Scope table explicitly excludes "Параллакс / тяжёлые анимации"
- `.planning/PROJECT.md` — Brand colors, 45+ audience constraint

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- CSS custom properties: full color/spacing/shadow/radius/transition tokens already defined
- `.visually-hidden` utility exists for a11y hiding
- `prefers-reduced-motion` media query already in reset
- IntersectionObserver already used in main.js (initStickyBar) — pattern established
- IIFE + ES5 syntax pattern established in main.js

### Established Patterns
- BEM naming convention throughout CSS
- Section alternates white/light backgrounds
- `.card` base component reused across benefits, doctors, advantages sections
- Mobile-first media queries at 768px and 1024px breakpoints

### Integration Points
- index.html: replace emoji HTML entities with inline `<svg>` elements
- css/styles.css: add animation classes, gradient backgrounds, wave dividers, enhanced hover states
- js/main.js: add initScrollAnimations() using IntersectionObserver, improve FAQ animation
- Hero section: restructure to 2-column layout on desktop (text + illustration)

</code_context>

<deferred>
## Deferred Ideas

- Animated statistics counters (CONT-01 in v2 requirements) — requires real data from client
- Lottie/JSON animations — adds dependency, not worth for one page
- Parallax effects — explicitly out of scope per REQUIREMENTS.md
- WebGL/canvas effects — overkill for target audience

</deferred>

---

*Phase: 10-visual-design-enhancement*
*Context gathered: 2026-03-23*
