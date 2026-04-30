# Requirements: MedicusUnion KZ

**Defined:** 2026-04-13
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.

## v8.0 Requirements

Requirements for Index Page Redesign milestone. Each maps to roadmap phases.

### Hero (Video Call Frame)

- [ ] **HERO-01**: Hero shows doctor photo framed as a video-call window (not a flat portrait)
- [ ] **HERO-02**: Video-call frame displays mic, camera, and hangup control buttons (visual only, non-functional)
- [ ] **HERO-03**: HD badge is visible on the video-call frame
- [ ] **HERO-04**: Hero displays two CTAs (primary: заявка на консультацию; secondary: learn more / scroll)
- [ ] **HERO-05**: Hero layout is mobile-first, readable for ЦА 45+, and preserves 3-second value comprehension

### Stats Bar

- [ ] **STATS-01**: Stats section presents 4 metrics, each with an icon, in glass-style cards
- [ ] **STATS-02**: Stats bar sits directly below hero as an at-a-glance credibility strip

### Services ("Мы помогаем на каждом этапе")

- [ ] **SVC-01**: Services section shows 4 service cards with icons in glass style
- [ ] **SVC-02**: Each card has an icon, title, and short scannable description
- [ ] **SVC-03**: Cards link to their respective service pages without regression

### Process ("Как это работает")

- [ ] **PROC-01**: Process section shows 4 numbered steps, each with an icon
- [ ] **PROC-02**: Steps are visually connected by dotted connector lines on desktop
- [ ] **PROC-03**: On mobile the dotted connectors collapse to a vertical variant or are hidden without breaking layout

### CTA Form

- [ ] **FORM-01**: Final CTA section uses a blue gradient background behind the form
- [ ] **FORM-02**: Form includes trust signals (privacy, response time, europe-based doctors)
- [ ] **FORM-03**: Form submits to existing Directus endpoint without regression

### Header

- [x] **HDR-01**: Header uses updated glass style aligned with new design direction
- [x] **HDR-02**: Navigation links to all existing sections/pages without regression
- [x] **HDR-03**: Mobile header behavior (menu toggle, sticky positioning) preserved

### Visual System

- [ ] **VIS-01**: Glassmorphism strengthened across index page per mockup
- [x] **VIS-02**: Typography updated to modern scale used in new design direction
- [x] **VIS-03**: Mobile budget respected (≤2 glass elements/viewport, blur ≤12px, ЦА 45+ simplicity)
- [ ] **VIS-04**: Existing accessibility guarantees preserved (prefers-contrast, prefers-reduced-transparency, prefers-reduced-motion, focus-visible, 44×44 touch targets)

## v7.0 Requirements (Shipped 2026-04-14)

Requirements for UI/UX Design Excellence milestone. Each maps to roadmap phases.

### Accessibility

- [ ] **ACC-01**: Site responds to `prefers-contrast: more` with solid backgrounds and increased text contrast on all glass surfaces
- [ ] **ACC-02**: Site responds to `prefers-reduced-transparency: reduce` with opaque fallbacks for all glass elements
- [ ] **ACC-03**: All text on glass surfaces passes WCAG 2.2 AA contrast (4.5:1 body, 3:1 large) against worst-case composite background
- [ ] **ACC-04**: All interactive elements have visible `:focus-visible` indicators with sufficient contrast
- [ ] **ACC-05**: All touch targets meet 44x44px minimum size on mobile viewports

### Interactions

- [ ] **INT-01**: Cards have consistent hover, focus, and active states across all pages
- [ ] **INT-02**: Form submission shows loading state with disabled button and spinner
- [ ] **INT-03**: Glass surfaces have subtle brightness shift on hover (non-card elements)
- [ ] **INT-04**: `prefers-reduced-motion` fully gates ALL animations including glint, shimmer, and scroll-reveal
- [ ] **INT-05**: Text on glass surfaces has enhanced readability (text-shadow or raised opacity floor)

### Performance

- [ ] **PERF-01**: Mobile blur values reduced to safe range (14-20px) via responsive tokens
- [ ] **PERF-02**: Maximum 4 glass compositing layers visible per viewport on any page
- [ ] **PERF-03**: `content-visibility: auto` applied to below-fold sections for rendering performance
- [ ] **PERF-04**: Scroll-driven CSS animations as progressive enhancement (`@supports` gated) with IO fallback
- [ ] **PERF-05**: CSS scroll progress bar indicator via `animation-timeline: scroll()`

### Token Refactor

- [ ] **TOK-01**: Glass tokens migrated from hardcoded rgba to `color-mix(in oklch)` derivations
- [ ] **TOK-02**: Dark mode tokens use `light-dark()` function where supported
- [ ] **TOK-03**: Visual regression verified -- screenshot comparison before/after refactor

## Future Requirements

Deferred beyond v7.0.

### Progressive Enhancement

- **PROG-01**: Cross-document view transitions for app-like page navigation (Chrome-only, defer until Safari support)
- **PROG-02**: Skeleton loading states for dynamic content areas
- **PROG-03**: `interpolate-size` for accordion height animation (Chromium-only as of April 2026)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Animation libraries (GSAP, Motion One, Lottie) | Violates vanilla constraint; pure CSS handles all animation needs |
| Production npm dependencies | Zero-dep principle; dev tools only for testing |
| Full APCA migration | WCAG 3.0 not ratified; use APCA as supplement only |
| Device gyroscope-driven specular | Requires JS DeviceOrientation permission; overkill for medical site |
| New CSS files | Architecture research confirms all changes extend existing files |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

### v8.0 Index Page Redesign (Phases 79-85)

| Requirement | Phase | Status |
|-------------|-------|--------|
| VIS-02 | Phase 79 | Complete |
| VIS-03 | Phase 79 | Complete |
| HDR-01 | Phase 80 | Complete |
| HDR-02 | Phase 80 | Complete |
| HDR-03 | Phase 80 | Complete |
| HERO-01 | Phase 81 | Pending |
| HERO-02 | Phase 81 | Pending |
| HERO-03 | Phase 81 | Pending |
| HERO-04 | Phase 81 | Pending |
| HERO-05 | Phase 81 | Pending |
| STATS-01 | Phase 82 | Pending |
| STATS-02 | Phase 82 | Pending |
| SVC-01 | Phase 83 | Pending |
| SVC-02 | Phase 83 | Pending |
| SVC-03 | Phase 83 | Pending |
| PROC-01 | Phase 83 | Pending |
| PROC-02 | Phase 83 | Pending |
| PROC-03 | Phase 83 | Pending |
| FORM-01 | Phase 84 | Pending |
| FORM-02 | Phase 84 | Pending |
| FORM-03 | Phase 84 | Pending |
| VIS-01 | Phase 85 | Pending |
| VIS-04 | Phase 85 | Pending |

**v8.0 Coverage:**
- v8.0 requirements: 22 total
- Pending: 22
- Mapped to phases: 22
- Unmapped: 0

### v7.0 UI/UX Design Excellence (Phases 73-78) -- Shipped 2026-04-14

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOK-01 | Phase 73 | Satisfied |
| TOK-02 | Phase 73 | Satisfied |
| ACC-01 | Phase 74 + 74.1 (verify) | Partial — code done, needs verification |
| ACC-02 | Phase 74 + 74.1 (verify + production block) | Partial — needs css/styles.css block |
| ACC-03 | Phase 74 + 74.1 (verify) | Partial — code done, needs verification |
| ACC-04 | Phase 74 + 74.1 (verify + fix dead code) | Partial — code done, needs cleanup |
| ACC-05 | Phase 74 + 74.1 (verify) | Partial — code done, needs verification |
| PERF-01 | Phase 75 | Pending |
| PERF-02 | Phase 75 | Pending |
| PERF-03 | Phase 75 | Pending |
| INT-01 | Phase 76 | Pending |
| INT-02 | Phase 76 | Pending |
| INT-03 | Phase 76 | Pending |
| INT-04 | Phase 76 | Pending |
| INT-05 | Phase 76 | Pending |
| PERF-04 | Phase 77 | Pending |
| PERF-05 | Phase 77 | Pending |
| TOK-03 | Phase 78 | Pending |

**v7.0 Coverage:**
- v7.0 requirements: 18 total
- Satisfied: 2 (TOK-01, TOK-02)
- Partial: 5 (ACC-01..ACC-05 — code done, verification in Phase 74.1)
- Pending: 11 (Phases 75-78)
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-23 after v8.0 roadmap creation*
