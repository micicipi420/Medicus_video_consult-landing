# Roadmap: MedicusUnion KZ

## Milestones

- v1.0 MedicusUnion KZ Landing -- Phases 1-10 (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- Phases 11-14 (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- Phases 15-16 (shipped 2026-03-23)
- v1.3 KZ Design Alignment -- Phases 17-19 (shipped 2026-03-23)
- v1.4 2025 Visual Redesign -- Phases 20-23 (shipped 2026-03-24)
- v2.0 Service Pages Copywriting Rewrite -- Phases 26-28 (shipped 2026-04-05)
- v3.0 SEO, Performance & Polish -- Phases 29-32 (shipped 2026-04-06)
- v3.1 Site Foundation & Audit Fixes -- Phases 33-38 + 38.1 (shipped 2026-04-08)
- v3.2 Build Pipeline & Chrome Partials -- Phases 39-40 (shipped 2026-04-08)
- v4.0 Liquid Design System -- Phases 41-49 (shipped 2026-04-09)
- **v5.0 Full Liquid Glass Rework -- Phases 51-58 (active, started 2026-04-10)**

## Phases

### v5.0 Full Liquid Glass Rework (active)

- [x] **Phase 51: Cross-Browser Hardening** - Safari backdrop-filter fallback, Firefox opacity fallback, shadow-wrap deprecation strategy -- completed 2026-04-10
- [ ] **Phase 52: Token Foundation & Dead Code Cleanup** - Remove unused CSS tokens, eliminate .liquid-card-wrap wrappers, delete dead files
- [ ] **Phase 53: SVG Refraction Tuning** - Per-element displacement scale and noise calibration for visual fidelity vs GPU balance
- [ ] **Phase 54: Adaptive Tinting** - Glass elements inherit section tint color via CSS cascade
- [ ] **Phase 55: Glass Material Variants & Hierarchy** - Clear glass, fluted glass, and formalized 3-level glass hierarchy
- [ ] **Phase 56: Specular Physics & Interaction States** - Desktop parallax specular highlight and unified hover/press/focus states on glass
- [ ] **Phase 57: GPU Performance Audit** - Composite layer budget enforcement and will-change hygiene
- [ ] **Phase 58: Design System Docs & Print** - Styleguide update with all glass variants and print stylesheet coverage

<details>
<summary>v4.0 Liquid Design System (Phases 41-49) -- SHIPPED 2026-04-09</summary>

- [x] Phase 41: Foundation Tokens (2/2 plans) -- completed 2026-04-09
- [x] Phase 42: Squircle Primitives (1/1 plan) -- completed 2026-04-09
- [x] Phase 43: Liquid Glass Primitives (2/2 plans) -- completed 2026-04-09
- [x] Phase 44: Chrome Partials Upgrade (2/2 plans) -- completed 2026-04-09
- [x] Phase 45: Simple Pages (2/2 plans) -- completed 2026-04-09
- [x] Phase 46: Service Pages (0/TBD) -- completed 2026-04-09
- [x] Phase 47: Index Page (2/2 plans) -- completed 2026-04-09
- [x] Phase 48: Verification (2/2 plans) -- completed 2026-04-09
- [x] Phase 49: Documentation (2/2 plans) -- completed 2026-04-09

Full details: `.planning/milestones/v4.0-ROADMAP.md`

</details>

<details>
<summary>v3.2 Build Pipeline & Chrome Partials (Phases 39-40) -- SHIPPED 2026-04-08</summary>

- [x] Phase 39: Partials Extraction & Build Pipeline (3/3 plans) -- completed 2026-04-08
- [x] Phase 40: UX Cosmetic Cleanup (3/3 plans) -- completed 2026-04-08

Full details: `.planning/milestones/v3.2-ROADMAP.md`
Requirements: `.planning/milestones/v3.2-REQUIREMENTS.md`

</details>

<details>
<summary>v3.1 Site Foundation & Audit Fixes (Phases 33-38 + 38.1) -- SHIPPED 2026-04-08</summary>

- [x] Phase 33: Audit Quick Wins (1/1 plan) -- completed 2026-04-07
- [x] Phase 34: Treatment Abroad Overhaul (1/1 plan) -- completed 2026-04-07
- [x] Phase 35: Checkup Fix + Form UX Polish -- completed 2026-04-07
- [x] Phase 36a: Shared Layout Primitives -- completed 2026-04-07
- [x] Phase 37: Site Metadata & Hygiene -- completed 2026-04-07
- [x] Phase 38: Vertical Rhythm & Section Sizing -- completed 2026-04-07
- [x] Phase 38.1: Mobile viewport overflow + checkup H1 fix (corrective) -- completed 2026-04-08

Full details: `.planning/milestones/v3.1-ROADMAP.md`
Requirements: `.planning/milestones/v3.1-REQUIREMENTS.md`
Audit: `.planning/milestones/v3.1-MILESTONE-AUDIT.md`

</details>

<details>
<summary>v3.0 SEO, Performance & Polish (Phases 29-32) -- SHIPPED 2026-04-06</summary>

- [x] Phase 29: 404 Page & UI Polish (2/2 plans) -- completed 2026-04-05
- [x] Phase 30: SEO Optimization (1/1 plan) -- completed 2026-04-05
- [x] Phase 31: Performance Optimization (2/2 plans) -- completed 2026-04-05
- [x] Phase 32: Design System Compliance (2/2 plans) -- completed 2026-04-06

Full details: `.planning/milestones/v3.0-ROADMAP.md`
Requirements: `.planning/milestones/v3.0-REQUIREMENTS.md`
Audit: `.planning/milestones/v3.0-MILESTONE-AUDIT.md`

</details>

<details>
<summary>Earlier milestones (v1.0-v2.0) -- SHIPPED</summary>

- v1.0 MedicusUnion KZ Landing -- 10 phases, 24 plans (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- 4 phases, 5 plans (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- 2 phases, 2 plans (shipped 2026-03-23)
- v1.3 KZ Design Alignment -- 3 phases, 3 plans (shipped 2026-03-23)
- v1.4 2025 Visual Redesign -- 4 phases, 6 plans (shipped 2026-03-24)
- v2.0 Service Pages Copywriting Rewrite -- 4 phases, 8 plans (shipped 2026-04-05)

See `.planning/milestones/` for full details per milestone.

</details>

## Phase Details

### Phase 51: Cross-Browser Hardening
**Goal**: Glass elements render correctly across Safari, Firefox, and Chrome -- eliminating the known Safari backdrop-filter var() bug and providing graceful Firefox fallbacks
**Depends on**: Nothing (first v5.0 phase; builds on v4.0 shipped glass primitives)
**Requirements**: XBRO-01, XBRO-02, XBRO-03
**Success Criteria** (what must be TRUE):
  1. Safari users see glass surfaces with correct blur/saturation -- hardcoded fallback values precede var()-based declarations in all backdrop-filter rules, verified by toggling custom properties off in Safari Web Inspector
  2. Firefox users on versions without backdrop-filter support see glass elements rendered as opaque semi-transparent surfaces via opacity fallback -- no broken/invisible cards
  3. .liquid-card-wrap usage across the codebase has a single documented strategy: either all instances carry a deprecation comment pointing to the replacement pattern, or all instances are already replaced -- grep confirms zero contradictory comments
  4. make build exits 0 and all 7 pages render without visual regression in Chrome, Safari, and Firefox
**Plans**: 2/2 plans complete
Plans:
- [x] 51-01-PLAN.md — Safari/Firefox backdrop-filter fallbacks
- [x] 51-02-PLAN.md — Shadow-wrap documentation correction
**Context**: `.planning/phases/51-cross-browser-hardening/51-CONTEXT.md`
**Verification**: 8/9 (human_needed)
**UI hint**: yes

### Phase 52: Token Foundation & Dead Code Cleanup
**Goal**: The CSS codebase is free of legacy dead weight -- unused tokens, wrapper div artifacts, and dead files are removed so that subsequent phases build on a clean foundation
**Depends on**: Phase 51 (shadow-wrap deprecation strategy from XBRO-03 must be resolved before removing wrappers in CLEN-02)
**Requirements**: CLEN-01, CLEN-02, CLEN-03
**Success Criteria** (what must be TRUE):
  1. All shadcn/React legacy CSS tokens (popover, chart, sidebar families) are removed from theme.css -- grep for "popover\|chart-\|sidebar" returns zero matches in any CSS file
  2. All .liquid-card-wrap wrapper divs are removed from HTML across all 7 pages (70+ elements eliminated) and the .liquid-card-wrap CSS class is deleted -- grep confirms zero occurrences in both HTML and CSS
  3. src/styles/index.css is deleted; unused green ramp tokens (--mu-green-200, --mu-green-400, --mu-green-900) are removed from theme.css -- file system confirms deletion, grep confirms token removal
  4. make build exits 0, byte-identity check passes, and all 7 pages render identically to pre-cleanup state (visual regression check)
**Plans**: 2 plans
Plans:
- [x] 52-01-PLAN.md — Remove legacy tokens and dead CSS file
- [x] 52-02-PLAN.md — Remove liquid-card-wrap wrappers from HTML and CSS

### Phase 53: SVG Refraction Tuning
**Goal**: The SVG refraction filter is calibrated per-element for optimal visual fidelity without excessive GPU cost -- displacement scale and noise frequency are tuned to each glass surface's size and context
**Depends on**: Phase 52 (clean codebase without dead wrappers ensures refraction targets correct elements)
**Requirements**: PERF-03
**Success Criteria** (what must be TRUE):
  1. SVG feTurbulence baseFrequency and feDisplacementMap scale values are differentiated for at least 3 element size categories (small: badges/chips, medium: cards, large: hero/full-width) -- visible in SVG defs or CSS custom properties
  2. Large glass surfaces (hero, full-width sections) show subtle refraction distortion that reads as "glass" without distracting text behind -- text remains legible through the refraction layer
  3. Small glass elements (badges, nav items) have minimal or zero refraction to avoid visual noise at small scale
  4. Chrome DevTools Performance panel shows no increase in GPU memory usage exceeding 10% compared to pre-tuning baseline when scrolling through index.html
**Plans**: 1 plan
Plans:
- [x] 53-01-PLAN.md &mdash; Per-element SVG refraction filters and CSS wiring
**UI hint**: yes

### Phase 54: Adaptive Tinting
**Goal**: Glass elements automatically shift their tint color based on the section they sit in -- creating the characteristic Apple Liquid Glass effect where glass reflects its environment
**Depends on**: Phase 53 (refraction calibration must be complete before adding tinting layer that compounds visual complexity)
**Requirements**: VFEX-01
**Success Criteria** (what must be TRUE):
  1. Each major section sets --liquid-tint-* custom properties on its container, and glass elements within that section inherit the tint via CSS cascade -- no JavaScript required for tinting
  2. Glass cards in the hero section show a warm tint, glass cards in a teal/dark section show a cool tint, and glass cards in a neutral section show minimal tint -- visually distinguishable when scrolling through index.html
  3. Dark mode tinting adapts appropriately -- tint colors shift to complement the dark palette without producing muddy or low-contrast surfaces
  4. Tinting is achieved via background-gradient composite (not mix-blend-mode) as specified in VFEX-01 -- verified by inspecting computed styles in DevTools
**Plans**: 1 plan
Plans:
- [x] 54-01-PLAN.md &mdash; Adaptive tint properties and glass background composite
**UI hint**: yes

### Phase 55: Glass Material Variants & Hierarchy
**Goal**: Three distinct glass materials exist (clear, fluted, regular) with a formalized 3-level hierarchy -- giving designers explicit choices for different UI contexts
**Depends on**: Phase 54 (adaptive tinting must work before adding new glass variants that need to support tinting)
**Requirements**: GLAS-01, GLAS-02, GLAS-03
**Success Criteria** (what must be TRUE):
  1. .liquid-clear class exists and produces higher transparency with a dimming layer suitable for overlay contexts (modals, lightboxes) -- visually distinct from .liquid-regular when placed side by side
  2. .liquid-fluted class exists and produces vertical streak patterns via repeating-linear-gradient -- the "fluted glass" texture is visible and distinct from regular glass
  3. Glass hierarchy is formalized with 3 documented levels: .liquid-nav (navigation-weight: lightest blur, highest transparency), .liquid-regular (standard cards: medium blur/opacity/shadow), .liquid-clear (overlay: highest transparency + dimming) -- each level has distinct blur, opacity, and shadow values visible in DevTools
  4. All 3 variants work correctly in both light and dark mode, and all 3 inherit adaptive tinting from their parent section
  5. make build exits 0; styleguide.html can demonstrate all 3 variants side by side
**Plans**: 1 plan
Plans:
- [ ] 55-01-PLAN.md — Glass material variants, hierarchy tokens, and styleguide demos
**UI hint**: yes

### Phase 56: Specular Physics & Interaction States
**Goal**: Glass surfaces respond to cursor position with a subtle specular highlight shift, and all glass elements have consistent hover/press/focus interaction states
**Depends on**: Phase 55 (all glass variants must exist before applying interaction states across them)
**Requirements**: VFEX-02, VFEX-03
**Success Criteria** (what must be TRUE):
  1. On desktop, moving the cursor near (but outside) a glass card produces a soft specular highlight shift via CSS custom properties updated by lightweight JS -- the light "follows" the cursor direction
  2. Hover state on any glass element brightens the surface subtly; press/active state darkens it -- transitions are smooth (200-300ms)
  3. Focus-visible state on all glass elements shows a clear ring that meets WCAG AA visibility requirements -- verified by keyboard-tabbing through glass elements
  4. All interaction states (hover, press, focus) work consistently across .liquid-regular, .liquid-clear, .liquid-fluted, and .liquid-nav variants
  5. prefers-reduced-motion disables the specular parallax effect while keeping static interaction states (hover brightness, press darken, focus ring)
**Plans**: 1 plan
Plans:
- [ ] 53-01-PLAN.md &mdash; Per-element SVG refraction filters and CSS wiring
**UI hint**: yes

### Phase 57: GPU Performance Audit
**Goal**: Glass rendering stays within a strict GPU budget -- no more than 6 simultaneous backdrop-filter elements per viewport, and will-change is applied only where it measurably helps
**Depends on**: Phase 56 (all visual effects and variants must be in place before performance audit -- audit the final state, not an intermediate one)
**Requirements**: PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. At no scroll position on any of the 7 pages are more than 6 elements with active backdrop-filter simultaneously visible in the viewport -- verified by DevTools Layers panel inspection at multiple scroll positions
  2. will-change is present only on elements that animate (hover transitions, specular shift, shimmer) and absent from all static glass surfaces -- grep for will-change shows it on animation-related selectors only
  3. Chrome DevTools Performance recording of a full scroll through index.html shows zero long frames (>50ms) attributable to paint/composite operations on glass elements
  4. Budget Android proxy test (4x CPU throttle in DevTools) achieves scroll FPS >= 30 on index.html with all glass effects active
**Plans**: 1 plan
Plans:
- [ ] 53-01-PLAN.md &mdash; Per-element SVG refraction filters and CSS wiring

### Phase 58: Design System Docs & Print
**Goal**: The styleguide page documents all v5.0 glass variants with usage guidelines, and the print stylesheet covers every new variant with opaque fallback
**Depends on**: Phase 57 (all variants and effects must be finalized before documenting them)
**Requirements**: DOCS-01, DOCS-02
**Success Criteria** (what must be TRUE):
  1. styleguide.html shows all glass variants (.liquid-regular, .liquid-clear, .liquid-fluted, .liquid-nav) with live rendered examples, do/don't guidance, and hierarchy explanation
  2. styleguide.html demonstrates adaptive tinting by placing glass cards over different colored section backgrounds
  3. Print stylesheet renders all glass variants (fluted, clear, nav, regular) as opaque surfaces with visible borders -- verified by print preview in Chrome showing no transparent/broken cards
  4. make build exits 0; styleguide.html builds correctly via splicer pipeline
**Plans**: 1 plan
Plans:
- [ ] 53-01-PLAN.md &mdash; Per-element SVG refraction filters and CSS wiring
**UI hint**: yes

## Progress

### v5.0 Full Liquid Glass Rework

**Execution Order:**
Phases execute in numeric order: 51 -> 52 -> 53 -> 54 -> 55 -> 56 -> 57 -> 58.
Strictly linear -- each phase builds on the previous.

**Universal gate after every phase:** make build exits 0 + byte-identity check passes.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 51. Cross-Browser Hardening | 2/2 | Complete | 2026-04-10 |
| 52. Token Foundation & Dead Code Cleanup | 2/2 | Complete    | 2026-04-10 |
| 53. SVG Refraction Tuning | 1/1 | Complete    | 2026-04-10 |
| 54. Adaptive Tinting | 1/1 | Complete    | 2026-04-10 |
| 55. Glass Material Variants & Hierarchy | 0/1 | Planned | - |
| 56. Specular Physics & Interaction States | 0/TBD | Not started | - |
| 57. GPU Performance Audit | 0/TBD | Not started | - |
| 58. Design System Docs & Print | 0/TBD | Not started | - |
