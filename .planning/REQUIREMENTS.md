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
| ACC-01 | TBD | Pending |
| ACC-02 | TBD | Pending |
| ACC-03 | TBD | Pending |
| ACC-04 | TBD | Pending |
| ACC-05 | TBD | Pending |
| INT-01 | TBD | Pending |
| INT-02 | TBD | Pending |
| INT-03 | TBD | Pending |
| INT-04 | TBD | Pending |
| INT-05 | TBD | Pending |
| PERF-01 | TBD | Pending |
| PERF-02 | TBD | Pending |
| PERF-03 | TBD | Pending |
| PERF-04 | TBD | Pending |
| PERF-05 | TBD | Pending |
| TOK-01 | TBD | Pending |
| TOK-02 | TBD | Pending |
| TOK-03 | TBD | Pending |

**Coverage:**
- v7.0 requirements: 18 total
- Mapped to phases: 0
- Unmapped: 18

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after initial definition*
