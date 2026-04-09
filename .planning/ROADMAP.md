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
- **v4.0 Liquid Design System -- Phases 41-49 (active, started 2026-04-09)**

## Phases

### v4.0 Liquid Design System (active)

- [ ] **Phase 41: Foundation Tokens** - theme.css extension: grid/squircle/liquid/motion tokens, focus-visible migration to outline, dark selector audit
- [ ] **Phase 42: Squircle Primitives** - squircles.css with 4 SVG mask data-URIs, @supports corner-shape PE, shadow-wrap pattern
- [ ] **Phase 43: Liquid Glass Primitives** - liquid-glass.css with Regular material, dark recipe, print fallback, refraction PE, reduced-motion extension, shimmer/stats/scroll-edge differentiators
- [ ] **Phase 44: Chrome Partials Upgrade** - SVG defs partial + 4 chrome partials restyled with glass/squircle/grid; atomic commit under byte-identity gate
- [ ] **Phase 45: Simple Pages (404 + Contacts)** - Grid/squircle/liquid migration on simplest pages; canary for stacking contexts and protected legacy
- [ ] **Phase 46: Service Pages** - checkup + online-consultations + treatment-abroad migration; 3 parallelizable streams
- [ ] **Phase 47: Index Page** - Full grid/liquid/squircle treatment on 13-section index; floating cards, z-index map, mesh-bg compatibility
- [ ] **Phase 48: Verification** - WCAG AA contrast on glass, keyboard tab order, budget Android FPS, reduced-motion visual audit
- [ ] **Phase 49: Documentation** - DESIGN-SYSTEM.md + styleguide.html live reference page

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

### Phase 41: Foundation Tokens
**Goal**: All design tokens for v4.0 exist in theme.css, and the focus-visible ring mechanism is safe for mask-image elements -- so that Phases 42-49 can reference tokens without back-patching theme.css
**Depends on**: Nothing (first v4.0 phase; v3.2 build pipeline is prerequisite infrastructure)
**Requirements**: GRID-01 (token infrastructure only -- grid classes applied in Phases 45-47), SQUIRCLE-03
**Success Criteria** (what must be TRUE):
  1. theme.css contains grid tokens (--container-max-content: 1200px as @theme inline, gutter tokens for 16/24/32px) and max-w-content utility resolves in Tailwind CSS build output
  2. theme.css contains squircle tokens (4 mask data-URI references: md/lg/xl/full), liquid glass tokens (light recipe: --liquid-bg, --liquid-blur-md, --liquid-saturate, --liquid-brightness, rim shadows), and motion tokens (--ease-liquid, --dur-press, --dur-hover, --dur-sheet)
  3. Dark-mode glass tokens exist under the correct selector (.dark or [data-theme="dark"] -- whichever js/main.js toggle actually sets), with tuned dark recipe values (rgba(30,40,60,0.45) base, blur 28px, saturate 160%, brightness 115%)
  4. Focus-visible ring uses outline: 2px solid var(--mu-blue-text); outline-offset: 3px instead of box-shadow -- verified by inspecting a focused button in browser DevTools and confirming outline renders outside any mask-image clip boundary
  5. make build exits 0 and byte-identity check passes; no HTML files are modified in this phase
**Plans**: 2 plans
Plans:
- [x] 41-01-PLAN.md — Add v4.0 token blocks (grid, squircle masks, liquid glass, motion) to theme.css
- [x] 41-02-PLAN.md — Refactor focus-visible ring from box-shadow to outline
**UI hint**: yes

### Phase 42: Squircle Primitives
**Goal**: A complete squircle utility system exists as reusable CSS classes, so that any element can be given a superellipse shape by adding a single class
**Depends on**: Phase 41 (focus-visible must be outline-based before any mask-image is applied; squircle tokens must exist in theme.css)
**Requirements**: SQUIRCLE-01, SQUIRCLE-02, SQUIRCLE-04
**Success Criteria** (what must be TRUE):
  1. src/styles/squircles.css exists with .squircle-md, .squircle-lg, .squircle-xl, .squircle-full classes, each applying mask-image with an inline SVG data-URI superellipse path and mask-size: 100% 100%
  2. Chrome 139+ users see native corner-shape: superellipse(2) via @supports (corner-shape: superellipse(2)) block that removes the mask and applies native rendering
  3. Browsers without mask-image support gracefully fall back to standard border-radius (verified via @supports not (mask-image: url(...)) or absence of mask)
  4. Shadow-wrap pattern documented and testable: an element with .squircle-lg inside a wrapper div renders box-shadow on the wrapper (outside the mask) while the inner element carries the squircle clip -- visible in browser DevTools
  5. make build exits 0; Tailwind CSS output includes squircle classes; no HTML pages are modified yet
**Plans**: 1 plan
Plans:
- [x] 42-01-PLAN.md — Squircle utility classes, three-tier PE, shadow-wrap docs, build verification

### Phase 43: Liquid Glass Primitives
**Goal**: A complete Liquid Glass material system and distinctive components exist as reusable CSS/JS, so that any surface can be given glass treatment and the 3 differentiator effects (shimmer, grouped stats, scroll-edge fade) are ready to apply
**Depends on**: Phase 41 (liquid tokens and dark selector must be resolved); can run parallel with Phase 42 after Phase 41
**Requirements**: LIQUID-01, LIQUID-02, LIQUID-03, LIQUID-04, LIQUID-05, LIQUID-06, LIQUID-07, DIFF-01, DIFF-02, DIFF-03
**Success Criteria** (what must be TRUE):
  1. src/styles/liquid-glass.css exists with .liquid-regular class applying backdrop-filter: blur + saturate + brightness with tint overlay and rim lighting (asymmetric inset shadow top + bottom) -- visible on a test element placed over colored content
  2. Dark mode (toggling to dark) shows glass surfaces with the tuned dark recipe (dark tint, increased blur/saturate/brightness) -- no "murky navy smear" (the v1.4 failure mode)
  3. Primary CTA retains gradient fill (green-to-teal) with specular edge treatment (not clear glass); secondary/tertiary buttons use .liquid-regular glass with semibold label, hover brightening, press scale(0.97), and icon+arrow affordance
  4. Print stylesheet renders glass surfaces as opaque with border; reduced-motion disables specular shimmer and spring animations while keeping static glass appearance; shimmer sweep (DIFF-01), grouped stats backdrop (DIFF-02), and scroll-edge fade (DIFF-03) classes exist and are testable
  5. Chrome 139+ users with JS enabled see refraction effect (SVG feTurbulence + feDisplacementMap) via html[data-refract] attribute set by ~10 LOC JS probe; Safari/Firefox show blur-only glass
**Plans**: 2 plans
Plans:
- [x] 43-01-PLAN.md — Create liquid-glass.css with all glass material and differentiator CSS classes
- [x] 43-02-PLAN.md — Add refraction JS probe to main.js + visual verification checkpoint
**UI hint**: yes

### Phase 44: Chrome Partials Upgrade
**Goal**: All 4 shared chrome partials and the new SVG defs partial use glass/squircle/grid styling, so that every page inherits the v4.0 visual language through the existing splicer pipeline with zero per-page chrome edits
**Depends on**: Phase 42 + Phase 43 (squircle and liquid classes must exist before chrome references them)
**Requirements**: CHROME-01, CHROME-02
**Success Criteria** (what must be TRUE):
  1. partials/svg-defs.html exists with hidden SVG defs containing filter id="liquid-refract", and scripts/build-pages.sh line 19 includes svg-defs in the PARTIALS list
  2. All 6 HTML pages contain BUILD:svg-defs / /BUILD:svg-defs marker pairs, and make build splices the SVG defs partial into every page
  3. partials/header.html uses .liquid-nav glass treatment + squircle radius + max-w-content grid alignment; partials/footer.html, partials/mobile-menu.html, partials/sticky-bar.html each use appropriate glass/squircle classes
  4. make build exits 0 and byte-identity check passes -- the atomic commit includes both the new partial and all 6 page marker insertions
  5. Opening any of the 6 pages in browser shows glass-styled header, footer, mobile menu, and sticky bar with no visual regression in existing content areas
**Plans**: 2 plans
Plans:
- [ ] 44-01-PLAN.md — SVG defs partial + splicer integration + BUILD markers on all 6 pages
- [ ] 44-02-PLAN.md — Upgrade 4 chrome partials with glass/squircle classes + header scroll state token overrides
**UI hint**: yes

### Phase 45: Simple Pages (404 + Contacts)
**Goal**: 404.html and contacts.html are fully migrated to the v4.0 design language (grid + squircle + liquid glass), serving as canary deployments that validate stacking contexts, protected legacy items, and the migration pattern before tackling complex pages
**Depends on**: Phase 44 (chrome must be upgraded before page migrations -- partials propagate the new visual language)
**Requirements**: MIGRATE-01, MIGRATE-02
**Success Criteria** (what must be TRUE):
  1. 404.html uses grid wrapper with max-w-content, squircle CTA button, and liquid card surface -- visually distinct from v3.2 flat design when viewed side-by-side
  2. contacts.html uses grid wrapper, liquid glass form container, squircle inputs/select, and glass contact info card -- form submission still works (Directus POST returns 200)
  3. Protected legacy preserved on both pages: nbsp count unchanged (grep -c '&nbsp;'), ARIA attribute count unchanged (grep -c 'role="alert"\|aria-live'), head metadata diff is append-only, honeypot field present, zero text-wrap: balance instances
  4. Stacking contexts validated: form success overlay renders above glass surfaces; dark mode toggle produces correct glass appearance on both pages; no z-index collisions visible
  5. make build exits 0 and byte-identity check passes
**Plans**: 2 plans
Plans:
- [ ] 45-01-PLAN.md — TBD
- [ ] 45-02-PLAN.md — TBD
**UI hint**: yes

### Phase 46: Service Pages
**Goal**: checkup.html, online-consultations.html, and treatment-abroad.html are fully migrated to v4.0 design language, proving the grid/squircle/liquid pattern at moderate complexity across 3 independent page structures
**Depends on**: Phase 45 (simple pages validate patterns before service pages)
**Requirements**: MIGRATE-03, MIGRATE-04, MIGRATE-05
**Success Criteria** (what must be TRUE):
  1. checkup.html uses grid + squircle on program/stats/B2B/form cards + liquid surfaces; whitespace-nowrap span on "za 1-2 dnya" preserved; nbsp bindings preserved; stat bar uses grouped glass backdrop (DIFF-02 surface applied here)
  2. online-consultations.html uses grid + squircle on doctor/pricing/trigger cards + liquid surfaces; pricing card badge and gradient CTA intact
  3. treatment-abroad.html uses grid + squircle on clinic/step/review cards + liquid surfaces; review cards with glass treatment
  4. Per-page migration gates pass on all 3 pages: nbsp count preserved, ARIA attribute count preserved, head metadata append-only, honeypot field present, text-wrap: balance count = 0
  5. make build exits 0 and byte-identity check passes; all 3 pages render correctly in light and dark mode
**Plans**: 2 plans
Plans:
- [ ] 46-01-PLAN.md — TBD
- [ ] 46-02-PLAN.md — TBD
**UI hint**: yes

### Phase 47: Index Page
**Goal**: index.html (the highest-complexity page with 13 sections) is fully migrated to v4.0 design language, and the responsive grid system is verified working on all 6 pages (with index being the hardest case)
**Depends on**: Phase 46 (service pages prove patterns at scale before index)
**Requirements**: MIGRATE-06, GRID-02
**Success Criteria** (what must be TRUE):
  1. index.html uses full grid + liquid + squircle treatment across all 13 sections, including floating hero cards with correct z-index layering, glass stat bar, service cards, pricing, FAQ, form, and CTA sections
  2. Mesh-bg blob compatibility maintained -- blobs render behind glass surfaces without visual artifacts; icon chip rotate-vs-squircle resolved (either rotation dropped or squircle skipped on rotated chips)
  3. GRID-02 verified: text-bearing cards occupy minimum 4 columns on tablet breakpoint (8-col) across ALL 6 pages -- Russian compound words do not overflow card boundaries at 768px viewport
  4. Hero CTA has shimmer sweep animation on hover (DIFF-01 surface applied); scroll-edge fade (DIFF-03) visible at chrome/content overlap boundaries
  5. Per-page migration gates pass: nbsp count preserved, ARIA attribute count preserved, head metadata append-only, honeypot field present, text-wrap: balance count = 0; make build exits 0 and byte-identity check passes
**Plans**: 2 plans
Plans:
- [ ] 47-01-PLAN.md — TBD
- [ ] 47-02-PLAN.md — TBD
**UI hint**: yes

### Phase 48: Verification
**Goal**: All 6 pages pass accessibility, performance, and reduced-motion audits -- confirming that the v4.0 visual upgrade did not regress the WCAG AA and usability baseline established in v3.0-v3.2
**Depends on**: Phase 47 (all pages must be migrated before verification audit)
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04
**Success Criteria** (what must be TRUE):
  1. WCAG AA contrast (>= 4.5:1) manually verified on all text over glass surfaces in both light and dark mode across all 6 pages -- pixel-sampled, not just declared-color checked
  2. Keyboard tab order is correct and focus-visible outline (outline, not box-shadow) is visible on all interactive elements across all 6 pages -- verified by tabbing through each page start-to-finish
  3. Budget Android device (Samsung Galaxy A32/A52 or Xiaomi Redmi Note 10) achieves scroll FPS >= 30 on index.html (the heaviest page) -- measured on a real physical device, not DevTools throttle
  4. Toggling prefers-reduced-motion: reduce in browser settings disables specular shimmer, spring animations, and refraction effect while showing static glass appearance -- visually verified on at least 2 pages
**Plans**: 2 plans
Plans:
- [ ] 48-01-PLAN.md — TBD
- [ ] 48-02-PLAN.md — TBD

### Phase 49: Documentation
**Goal**: The v4.0 design system is documented for future contributors, and a live styleguide page proves the 7th-page invariant (a new page can be authored using only documented components and the splicer pipeline)
**Depends on**: Phase 47 (all pages migrated; docs reference final class names and patterns); can partially overlap with Phase 48
**Requirements**: DOCS-01, DOCS-02
**Success Criteria** (what must be TRUE):
  1. docs/DESIGN-SYSTEM.md exists and documents: shadow-wrap idiom with code examples, complete class inventory (.squircle-*, .liquid-*), token scale (grid/squircle/liquid/motion), anti-patterns list, Russian typography rules (nbsp binding, orphan prevention, whitespace-nowrap), protected files list, and scope creep guards
  2. styleguide.html exists as a live visual reference page showing all design system components: glass cards (light + dark), squircle mask variants (md/lg/xl/full), typography scale, button variants (primary gradient, secondary glass, icon), form elements (input, select, textarea), badge/chip -- all rendered with real CSS, not screenshots
  3. styleguide.html builds correctly via make build (proving the 7th-page invariant -- splicer handles a new page with only body content + BUILD markers, zero chrome duplication)
**Plans**: 2 plans
Plans:
- [ ] 49-01-PLAN.md — TBD
- [ ] 49-02-PLAN.md — TBD
**UI hint**: yes

## Progress

### v4.0 Liquid Design System

**Execution Order:**
Phases execute in numeric order: 41 -> 42 -> 43 -> 44 -> 45 -> 46 -> 47 -> 48 -> 49.
Phases 42 and 43 may execute in parallel after Phase 41 completes (no cross-dependency).
Phases 48 and 49 may partially overlap (docs can start during verification).

**Universal gate after every phase:** make build exits 0 + byte-identity check passes.

**Per-page migration gates (Phases 45-47):**
- nbsp count preserved (grep -c '&nbsp;')
- ARIA attribute count preserved (grep -c 'role="alert"\|aria-live')
- Head metadata diff is append-only
- Honeypot field preserved
- text-wrap: balance count remains zero

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 41. Foundation Tokens | 2/2 | Complete    | 2026-04-09 |
| 42. Squircle Primitives | 1/1 | Complete    | 2026-04-09 |
| 43. Liquid Glass Primitives | 2/2 | Complete    | 2026-04-09 |
| 44. Chrome Partials Upgrade | 0/2 | Planning complete | - |
| 45. Simple Pages (404 + Contacts) | 0/TBD | Not started | - |
| 46. Service Pages | 0/TBD | Not started | - |
| 47. Index Page | 0/TBD | Not started | - |
| 48. Verification | 0/TBD | Not started | - |
| 49. Documentation | 0/TBD | Not started | - |
