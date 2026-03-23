# Roadmap: MedicusUnion KZ Landing

## Milestones

- v1.0 MedicusUnion KZ Landing -- Phases 1-10 (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- Phases 11-14 (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- Phases 15-16 (in progress)

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

### v1.2 Brand Visual Alignment

**Milestone Goal:** Привести визуальный дизайн лендинга в соответствие с основным сайтом medicusunion.com -- единый бренд-стиль кнопок, карточек, цветов и отступов.

- [ ] **Phase 15: Design Tokens, Buttons & Hero** - CSS-переменные бренда, pill-shape кнопки с зелёным CTA, тёплый hero-фон
- [ ] **Phase 16: Cards & Spacing** - Скруглённые карточки с лёгкими тенями, увеличенные секционные отступы

## Phase Details

### Phase 15: Design Tokens, Buttons & Hero
**Goal**: Кнопки и цветовая палитра лендинга визуально совпадают с основным сайтом medicusunion.com
**Depends on**: Nothing (first phase of v1.2)
**Requirements**: TOKEN-01, BTN-01, BTN-02, BTN-03, SPACE-02
**Success Criteria** (what must be TRUE):
  1. CSS-переменные --color-primary и --color-primary-hover отражают зелёную палитру бренда (#35B678 / #25A467)
  2. Все кнопки на странице имеют pill-shape (border-radius: 100px) -- визуально идентичны кнопкам на medicusunion.com
  3. Primary CTA кнопки зелёного цвета (#35B678) с корректным hover-переходом (#25A467)
  4. Hero-секция имеет тёплый кремовый фон (#fffbf4) вместо холодного голубого градиента
**Plans:** 1 plan
Plans:
- [ ] 15-01-PLAN.md -- Design tokens, button pill-shape/green CTA, hero warm background

### Phase 16: Cards & Spacing
**Goal**: Карточки и отступы между секциями соответствуют современному воздушному стилю основного сайта
**Depends on**: Phase 15
**Requirements**: CARD-01, CARD-02, CARD-03, SPACE-01
**Success Criteria** (what must be TRUE):
  1. Все карточки имеют border-radius: 20px -- визуально мягче и современнее
  2. При наведении карточки приподнимаются (translateY(-2px)) вместо увеличения (scale) -- как на основном сайте
  3. Тени карточек стали легче и воздушнее, без тяжёлого визуального "веса"
  4. Секции на desktop имеют отступы 100px сверху и снизу -- больше визуального воздуха между блоками

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 15. Design Tokens, Buttons & Hero | v1.2 | 0/1 | Planned | - |
| 16. Cards & Spacing | v1.2 | 0/0 | Not started | - |
