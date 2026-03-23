# Roadmap: MedicusUnion KZ Landing

## Milestones

- ✅ **v1.0 MedicusUnion KZ Landing** — Phases 1-10 (shipped 2026-03-23)
- 🚧 **v1.1 Visual Polish & Conversion Boost** — Phases 11-14 (in progress)

## Phases

<details>
<summary>✅ v1.0 MedicusUnion KZ Landing (Phases 1-10) — SHIPPED 2026-03-23</summary>

- [x] Phase 1: Foundation & Design System (2/2 plans) — completed 2026-03-23
- [x] Phase 2: Hero & Problem Sections (2/2 plans) — completed 2026-03-23
- [x] Phase 3: Value & Process Sections (2/2 plans) — completed 2026-03-23
- [x] Phase 4: Trust & Authority Sections (2/2 plans) — completed 2026-03-23
- [x] Phase 5: Pricing, FAQ, Final CTA & Footer (3/3 plans) — completed 2026-03-23
- [x] Phase 6: Navigation & Mobile Interaction (3/3 plans) — completed 2026-03-23
- [x] Phase 7: Lead Capture Form (3/3 plans) — completed 2026-03-23
- [x] Phase 8: Directus Backend & Integration (2/2 plans) — completed 2026-03-23
- [x] Phase 9: Performance & SEO (2/2 plans) — completed 2026-03-23
- [x] Phase 10: Visual Design Enhancement (4/4 plans) — completed 2026-03-23

</details>

Full details: `.planning/milestones/v1.0-ROADMAP.md`
Requirements: `.planning/milestones/v1.0-REQUIREMENTS.md`
Audit: `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

### 🚧 v1.1 Visual Polish & Conversion Boost (In Progress)

**Milestone Goal:** Improve visual quality and conversion elements based on v1.0 visual audit. Better first impression, clearer layout hierarchy, sticky navigation, and consistent visual language.

- [x] **Phase 11: Hero & First Impression** - Real hero image, enlarged CTAs, hero background contrast, and social proof numbers block (completed 2026-03-23)
- [ ] **Phase 12: Sticky Navigation** - Sticky header with section navigation links
- [ ] **Phase 13: Section Layout & Contrast** - Alternating section backgrounds, enhanced wave dividers, centered pricing card, two-column form layout
- [ ] **Phase 14: Visual Consistency** - SVG country flags and compact pain points section

## Phase Details

### Phase 11: Hero & First Impression
**Goal**: Visitor sees a professional, trust-building first screen with a real medical image, prominent CTAs, and key numbers -- all within the first viewport
**Depends on**: Phase 10 (v1.0 complete)
**Requirements**: HERO-01, HERO-02, HERO-03, PROOF-01
**Success Criteria** (what must be TRUE):
  1. Hero section displays a real photograph or high-quality medical illustration instead of the abstract SVG
  2. CTA buttons in the hero are visually large and easy to tap on mobile (min-height 56px, font-size 18px)
  3. Hero background is visually distinct from the rest of the page (gradient or contrasting color separates it)
  4. A social proof block with key numbers (consultations, doctors, countries) is visible between the hero and the "Знакомо?" section
**Plans:** 1/1 plans complete
Plans:
- [x] 11-01-PLAN.md — Hero SVG illustration, enhanced gradient, enlarged CTAs, social proof numbers bar

### Phase 12: Sticky Navigation
**Goal**: Visitor can navigate to any key section from anywhere on the page via a persistent header
**Depends on**: Phase 11
**Requirements**: NAV-01, NAV-02
**Success Criteria** (what must be TRUE):
  1. Header remains visible (sticky) when the user scrolls down the page
  2. Header contains navigation links to key sections (Как это работает / Врачи / Цена / Заявка)
  3. Clicking a navigation link smoothly scrolls to the corresponding section
**Plans**: 1 plan
Plans:
- [ ] 12-01-PLAN.md — Sticky header with desktop nav links and scroll shadow

### Phase 13: Section Layout & Contrast
**Goal**: Page sections have clear visual hierarchy with alternating backgrounds, enhanced dividers, and optimized layouts for pricing and form
**Depends on**: Phase 11
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04
**Success Criteria** (what must be TRUE):
  1. Sections alternate between white, light-gray, and accent background colors -- no two adjacent sections share the same background
  2. Wave dividers between sections are more prominent than v1.0 (higher contrast, more visible)
  3. Pricing card is centered on desktop with visual emphasis (shadow, badge, or border accent)
  4. Form section on desktop shows a two-column layout (description/context on the left, form fields on the right) with a contrasting background
**Plans**: TBD

### Phase 14: Visual Consistency
**Goal**: Visual details are polished -- country flags are proper SVGs and pain points section is compact with icons
**Depends on**: Phase 11
**Requirements**: VIS-01, VIS-02
**Success Criteria** (what must be TRUE):
  1. Country flags in the "Врачи" section are inline SVG flags instead of emoji characters
  2. "Знакомо?" section uses icon-based compact layout instead of bordered text blocks
  3. Both changes render consistently across Chrome, Safari, and Firefox on mobile and desktop
**Plans**: 1 plan
Plans:
- [ ] 14-01-PLAN.md — SVG country flags and icon-based compact problem section

## Progress

**Execution Order:** 11 → 12 → 13 → 14
(Phases 12, 13, 14 depend on Phase 11 but are independent of each other. Listed order is recommended but flexible.)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Design System | v1.0 | 2/2 | Complete | 2026-03-23 |
| 2. Hero & Problem Sections | v1.0 | 2/2 | Complete | 2026-03-23 |
| 3. Value & Process Sections | v1.0 | 2/2 | Complete | 2026-03-23 |
| 4. Trust & Authority Sections | v1.0 | 2/2 | Complete | 2026-03-23 |
| 5. Pricing, FAQ, Final CTA & Footer | v1.0 | 3/3 | Complete | 2026-03-23 |
| 6. Navigation & Mobile Interaction | v1.0 | 3/3 | Complete | 2026-03-23 |
| 7. Lead Capture Form | v1.0 | 3/3 | Complete | 2026-03-23 |
| 8. Directus Backend & Integration | v1.0 | 2/2 | Complete | 2026-03-23 |
| 9. Performance & SEO | v1.0 | 2/2 | Complete | 2026-03-23 |
| 10. Visual Design Enhancement | v1.0 | 4/4 | Complete | 2026-03-23 |
| 11. Hero & First Impression | v1.1 | 1/1 | Complete    | 2026-03-23 |
| 12. Sticky Navigation | v1.1 | 0/1 | Not started | - |
| 13. Section Layout & Contrast | v1.1 | 0/? | Not started | - |
| 14. Visual Consistency | v1.1 | 0/1 | Not started | - |
