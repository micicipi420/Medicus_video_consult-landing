# Roadmap: MedicusUnion KZ Landing

## Milestones

- v1.0 MedicusUnion KZ Landing -- Phases 1-10 (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- Phases 11-14 (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- Phases 15-16 (shipped 2026-03-23)
- v1.3 KZ Design Alignment -- Phases 17-19 (shipped 2026-03-23)
- ✅ v1.4 2025 Visual Redesign -- Phases 20-23 (shipped 2026-03-24)

## Phases

<details>
<summary>v1.0 MedicusUnion KZ Landing (Phases 1-10) -- SHIPPED 2026-03-23</summary>

- [x] Phase 1: Foundation & Design System (2/2 plans) -- completed 2026-03-23
- [x] Phase 2: Hero & Problem Sections (2/2 plans) -- completed 2026-03-23
- [x] Phase 3: Value & Process Sections (2/2 plans) -- completed 2026-03-23
- [x] Phase 4: Trust & Authority Sections (2/2 plans) -- completed 2026-03-23
- [x] Phase 5: Pricing, FAQ, Final CTA & Footer (3/3 plans) -- completed 2026-03-23
- [x] Phase 6: Navigation & Mobile Interaction (3/3 plans) -- completed 2026-03-23
- [x] Phase 7: Lead Capture Form (3/3 plans) -- completed 2026-03-23
- [x] Phase 8: Directus Backend & Integration (2/2 plans) -- completed 2026-03-23
- [x] Phase 9: Performance & SEO (2/2 plans) -- completed 2026-03-23
- [x] Phase 10: Visual Design Enhancement (4/4 plans) -- completed 2026-03-23

</details>

Full details: `.planning/milestones/v1.0-ROADMAP.md`
Requirements: `.planning/milestones/v1.0-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

<details>
<summary>v1.1 Visual Polish & Conversion Boost (Phases 11-14) -- SHIPPED 2026-03-23</summary>

- [x] Phase 11: Hero & First Impression (1/1 plan) -- completed 2026-03-23
- [x] Phase 12: Sticky Navigation (1/1 plan) -- completed 2026-03-23
- [x] Phase 13: Section Layout & Contrast (2/2 plans) -- completed 2026-03-23
- [x] Phase 14: Visual Consistency (1/1 plan) -- completed 2026-03-23

</details>

Full details: `.planning/milestones/v1.1-ROADMAP.md`
Requirements: `.planning/milestones/v1.1-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.1-MILESTONE-AUDIT.md`

<details>
<summary>v1.2 Brand Visual Alignment (Phases 15-16) -- SHIPPED 2026-03-23</summary>

- [x] Phase 15: Design Tokens, Buttons & Hero (1/1 plan) -- completed 2026-03-23
- [x] Phase 16: Cards & Spacing (1/1 plan) -- completed 2026-03-23

</details>

Full details: `.planning/milestones/v1.2-ROADMAP.md`
Requirements: `.planning/milestones/v1.2-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.2-MILESTONE-AUDIT.md`

<details>
<summary>v1.3 KZ Design Alignment (Phases 17-19) -- SHIPPED 2026-03-23</summary>

- [x] Phase 17: Design Tokens, Gradient Buttons & Layout (1/1 plan) -- completed 2026-03-23
- [x] Phase 18: Cards, Badges & Navigation (1/1 plan) -- completed 2026-03-23
- [x] Phase 19: v1.3 Cleanup (1/1 plan) -- completed 2026-03-23

</details>

Full details: `.planning/milestones/v1.3-ROADMAP.md`
Requirements: `.planning/milestones/v1.3-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.3-MILESTONE-AUDIT.md`

<details>
<summary>✅ v1.4 2025 Visual Redesign (Phases 20-23) -- SHIPPED 2026-03-24</summary>

- [x] **Phase 20: Dark Mode Token Infrastructure** -- DM-01, DM-02, DM-03, DM-04 (completed 2026-03-24)
- [x] **Phase 21: Bold Typography Scale** -- TYPO-01, TYPO-02 (completed 2026-03-24)
- [x] **Phase 22: Glassmorphism** -- GLASS-01, GLASS-02, GLASS-03, GLASS-04 (completed 2026-03-24)
- [x] **Phase 23: Micro-Animations Enhancement** -- ANIM-01, ANIM-02, ANIM-03 (completed 2026-03-24)

### Phase 20: Dark Mode Token Infrastructure
**Goal:** Lay the complete CSS and JS foundation for dark mode. All existing components auto-update via the token cascade. No visual change in light mode. All dark token pairs pass contrast audit before any component styling proceeds.
**Depends on:** Phase 19
**Requirements:** DM-01, DM-02, DM-03, DM-04
**Success Criteria** (what must be TRUE when this phase completes):
  1. User can toggle dark mode from the sticky navigation — button is visible at all scroll positions, has text label, meets 44px touch target
  2. Dark mode persists across page reload — closing and reopening the page restores the previously chosen theme
  3. Hard-refresh with OS dark preference and no localStorage entry shows light mode (default-light policy holds)
  4. Hard-refresh with saved dark preference shows dark mode immediately with no white flash (FOUC eliminated)
  5. Every color token pair in `[data-theme="dark"]` has been checked against WCAG AA contrast (≥4.5:1); body text pairs target AAA (≥7:1)
**Plans:** 2/2 plans complete
Plans:
- [x] 20-01-PLAN.md — CSS token infrastructure: [data-theme="dark"] block, glass tokens, FOUC script, toggle button HTML
- [x] 20-02-PLAN.md — JS initDarkMode() wiring, localStorage persistence, contrast audit checkpoint
**Context:** `.planning/phases/20-dark-mode-token-infrastructure/20-CONTEXT.md`

### Phase 21: Bold Typography Scale
**Goal:** Increase heading visual weight to display-scale 2025 standards. Every headline readable and correctly broken at 320px and 390px before this phase closes.
**Depends on:** Phase 20
**Requirements:** TYPO-01, TYPO-02
**Success Criteria** (what must be TRUE when this phase completes):
  1. The hero heading is visibly larger and bolder than in v1.3 — no single-word orphan lines at 390px
  2. All h1 and h2 headings scale fluidly between desktop and mobile without overflow or layout shift
  3. Bold headings are legible in both light and dark mode — no contrast regressions
**Plans:** 1/1 plans complete
Plans:
- [x] 21-01-PLAN.md — Heading token update (TYPO-01 + TYPO-02) + visual verification checkpoint
**Context:** `.planning/phases/21-bold-typography-scale/21-CONTEXT.md`

### Phase 22: Glassmorphism
**Goal:** Apply selective glass effects to the sticky header and pricing card. Hero section gains gradient mesh background as the visual layer required for glass to function. Maximum 2 glass elements visible in any viewport.
**Depends on:** Phase 20, Phase 21
**Requirements:** GLASS-01, GLASS-02, GLASS-03, GLASS-04
**Success Criteria** (what must be TRUE when this phase completes):
  1. Scrolling past the hero reveals a frosted glass header — page content is visible through a translucent header
  2. The pricing card has a glass surface — sits visibly over the gradient pricing section background
  3. On a browser with `backdrop-filter` disabled, the header and pricing card show solid opaque fallback colors
  4. Scrolling through the page with Chrome DevTools 4x CPU throttle shows no frame drops below 50fps
**Plans:** 2/2 plans complete
Plans:
- [x] 22-01-PLAN.md — CSS glassmorphism: hero gradient mesh, header glass, pricing gradient, .card--glass modifier, @supports fallbacks, dark mode overrides; HTML card--glass wiring
- [x] 22-02-PLAN.md — Visual + performance verification checkpoint: 7-check sign-off including mandatory 4x CPU throttle FPS gate
**Context:** `.planning/phases/22-glassmorphism/22-CONTEXT.md`

### Phase 23: Micro-Animations Enhancement
**Goal:** Extend scroll reveal with a vertical slide component, add tactile button active feedback, and confirm the global prefers-reduced-motion guard covers all new transforms. Total animation types on page stays at ≤5.
**Depends on:** Phase 20, Phase 21, Phase 22
**Requirements:** ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (what must be TRUE when this phase completes):
  1. Scroll-reveal elements slide up from 20px while fading in — visibly more dynamic than the v1.3 opacity-only fade
  2. Pressing and holding a CTA button shows a subtle scale-down (scale 0.97) — confirms the click registered
  3. With OS prefers-reduced-motion enabled, no animations are visible — elements appear at their final position immediately
  4. After waiting 10 seconds on the loaded page without interaction, nothing on the page is moving
**Plans:** 1/1 plans complete
Plans:
- [x] 23-01-PLAN.md — CSS animation updates: scroll-reveal translateY(20px), button active scale(0.97), reduced-motion guard, stagger fix + visual verification checkpoint
**Context:** `.planning/phases/23-micro-animations-enhancement/23-CONTEXT.md`

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 20. Dark Mode Token Infrastructure | 2/2 | Complete    | 2026-03-24 |
| 21. Bold Typography Scale | 1/1 | Complete    | 2026-03-24 |
| 22. Glassmorphism | 2/2 | Complete    | 2026-03-24 |
| 23. Micro-Animations Enhancement | 1/1 | Complete    | 2026-03-24 |

</details>

Full details: `.planning/milestones/v1.4-ROADMAP.md`
Requirements: `.planning/milestones/v1.4-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.4-MILESTONE-AUDIT.md`

### Phase 24: Liquid Glass Enhancement -- SHIPPED 2026-03-25

**Goal:** Expand glassmorphism from Phase 22 (2 elements) to full iOS 26 liquid glass treatment across the page. Three new glass surfaces (sticky bar, form wrapper, social proof stats), glass intensity upgraded site-wide (blur 20px, 60% opacity, green tint, specular highlight), dark mode glass enabled everywhere, gradient mesh backgrounds added to benefits and lead-form sections.
**Requirements**: D-01 through D-17 (17/17 verified)
**Depends on:** Phase 23
**Plans:** 2 plans

Plans:
- [x] 24-01-PLAN.md — Glass token upgrade (blur/opacity/tint), specular highlights, dark mode glass reversal, gradient mesh backgrounds
- [x] 24-02-PLAN.md — New glass elements (sticky bar, form wrapper, social proof), HTML class wiring, glass enter animation

### Phase 1: Apply Redesign from Redesign folder to main project

**Goal:** Migrate the visual design, layout, content structure, and interaction patterns from the Redesign/ folder (React + Tailwind + Framer Motion prototype) into the main vanilla HTML/CSS/JS project. Replace the current single-page landing with a 5-page static site using the redesign's glassmorphism visual language, new color palette (mu-blue, mu-green, accent colors), SF Pro system fonts, Lucide SVG icons, motion-powered animations, and 3-service content model (online consultations, treatment abroad, checkups). Preserve existing form submission to Directus, FAQ accordion, and phone mask functionality.
**Requirements**: TOKENS-01, TOKENS-02, TOKENS-03, TOKENS-04, ANIM-01, ANIM-02, ANIM-03, JS-01, JS-02, LAYOUT-01, LAYOUT-02, HERO-01, STATS-01, SERVICES-01, GUIDE-01, WHYUS-01, CONTACT-01, CTA-01, FOOTER-01, FAQ-01, PRICING-01, PAGE-01, PAGE-02, PAGE-03, PAGE-04, NAV-01, CLEANUP-01
**Depends on:** Phase 24
**Plans:** 7 plans

Plans:
- [x] 01-01-PLAN.md — Complete CSS rewrite: design tokens, glass components, buttons, section-specific styles, animation keyframes
- [x] 01-02-PLAN.md — JS rewrite: main.js (form, accordion, phone mask, header, mobile menu) + animations.js (motion-powered entrance animations)
- [x] 01-03-PLAN.md — index.html top half: head, header, mesh bg, hero, stats, services, guide sections
- [x] 01-04-PLAN.md — index.html bottom half: WhyUs, contact form, FAQ, pricing, CTA, footer, sticky bar
- [x] 01-05-PLAN.md — Service pages: online-consultations.html + treatment-abroad.html
- [x] 01-06-PLAN.md — Service pages: checkups.html + contacts.html
- [x] 01-07-PLAN.md — Link audit, old file cleanup, visual verification checkpoint

### Phase 25: Migrate to Tailwind CSS v4

**Goal:** Replace hand-written vanilla css/styles.css with Tailwind CSS v4 utility classes copied from the Redesign/ TSX components. Set up Tailwind CLI standalone binary for CSS compilation. Copy theme tokens from Redesign/src/styles/ as the Tailwind theme config. Rewrite all 5 HTML pages' class attributes to use Tailwind utilities matching the Redesign source 1:1. Delete old css/styles.css. Result: pixel-perfect visual match with the React+Tailwind Redesign prototype.
**Requirements**: TW-SETUP, TW-THEME, TW-INDEX-TOP, TW-INDEX-BOTTOM, TW-SERVICE-PAGES, TW-CONTACTS-PAGE, TW-BUILD, TW-CLEANUP, TW-VERIFY
**Depends on:** Phase 1
**Success Criteria** (what must be TRUE when this phase completes):
  1. Tailwind CLI standalone binary compiles src/styles/tailwind.css to css/styles.css without errors
  2. All 5 HTML pages use Tailwind utility classes from Redesign TSX components (not hand-written BEM CSS)
  3. All JS functionality works: header scroll, mobile menu, FAQ accordion, form submission, counter animations
  4. Visual output matches the Redesign React+Tailwind prototype
  5. Old hand-written css/styles.css content is gone, replaced by Tailwind compiled output
**Plans:** 5 plans

Plans:
- [ ] 25-01-PLAN.md — Tailwind CLI setup: download binary, create src/styles/ with theme.css, tailwind.css, fonts.css from Redesign
- [ ] 25-02-PLAN.md — index.html top half: mesh bg, header, hero, stats, services, guide Tailwind class migration
- [ ] 25-03-PLAN.md — index.html bottom half: WhyUs, contact, FAQ, CTA, footer Tailwind class migration
- [ ] 25-04-PLAN.md — Service pages: all 4 non-index pages Tailwind class migration
- [ ] 25-05-PLAN.md — Build, JS selector audit, cleanup, visual verification checkpoint
