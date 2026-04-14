# Requirements: MedicusUnion KZ

**Defined:** 2026-04-13
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.

## v7.0 Requirements

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

**Coverage:**
- v7.0 requirements: 18 total
- Satisfied: 2 (TOK-01, TOK-02)
- Partial: 5 (ACC-01..ACC-05 — code done, verification in Phase 74.1)
- Pending: 11 (Phases 75-78)
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after roadmap creation*
