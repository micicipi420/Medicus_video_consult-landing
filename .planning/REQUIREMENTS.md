# Requirements: MedicusUnion KZ

**Defined:** 2026-04-13
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.

## v8.0 Requirements

Requirements for Index Page Redesign milestone. Each maps to roadmap phases.

### Hero (Video Call Frame)

- [x] **HERO-01**: Hero shows doctor photo framed as a video-call window (not a flat portrait)
- [x] **HERO-02**: Video-call frame displays mic, camera, and hangup control buttons (visual only, non-functional)
- [x] **HERO-03**: HD badge is visible on the video-call frame
- [x] **HERO-04**: Hero displays two CTAs (primary: заявка на консультацию; secondary: learn more / scroll)
- [x] **HERO-05**: Hero layout is mobile-first, readable for ЦА 45+, and preserves 3-second value comprehension

### Stats Bar

- [x] **STATS-01**: Stats section presents 4 metrics, each with an icon, in glass-style cards
- [x] **STATS-02**: Stats bar sits directly below hero as an at-a-glance credibility strip

### Services ("Мы помогаем на каждом этапе")

- [x] **SVC-01**: Services section shows 4 service cards with icons in glass style
- [x] **SVC-02**: Each card has an icon, title, and short scannable description
- [x] **SVC-03**: Cards link to their respective service pages without regression

### Process ("Как это работает")

- [x] **PROC-01**: Process section shows 4 numbered steps, each with an icon
- [x] **PROC-02**: Steps are visually connected by dotted connector lines on desktop
- [x] **PROC-03**: On mobile the dotted connectors collapse to a vertical variant or are hidden without breaking layout

### CTA Form

- [x] **FORM-01**: Final CTA section uses a blue gradient background behind the form
- [x] **FORM-02**: Form includes trust signals (privacy, response time, europe-based doctors)
- [x] **FORM-03**: Form submits to existing Directus endpoint without regression

### Header

- [x] **HDR-01**: Header uses updated glass style aligned with new design direction
- [x] **HDR-02**: Navigation links to all existing sections/pages without regression
- [x] **HDR-03**: Mobile header behavior (menu toggle, sticky positioning) preserved

### Visual System

- [x] **VIS-01**: Glassmorphism strengthened across index page per mockup
- [x] **VIS-02**: Typography updated to modern scale used in new design direction
- [x] **VIS-03**: Mobile budget respected (≤2 glass elements/viewport, blur ≤12px, ЦА 45+ simplicity)
- [x] **VIS-04**: Existing accessibility guarantees preserved (prefers-contrast, prefers-reduced-transparency, prefers-reduced-motion, focus-visible, 44×44 touch targets)

## v8.1 Requirements

Loose ends from v8.0 + propagation of v8.0 design language to service pages.

### Service Page Propagation (Phase 86)

- [ ] **PROP-01**: `/checkup`, `/consultations`, and `/treatment-abroad` adopt the v8.0 glass-header chrome and consume the same Phase 79 typography + motion + mobile-blur tokens
- [ ] **PROP-02**: Service-page hero (`ServiceHero`) and lead-capture form (`LeadFormSection`) match the v8.0 chrome language — scoped transitions, ≥44pt tap targets, mobile-budget compliant
- [ ] **PROP-03**: Service-page submission paths still reach the existing Directus endpoint — no regression in form behavior

### Real Content (Phase 87)

- [ ] **CNT-01**: HeroHub video-call frame uses a real on-team doctor name (or culturally-appropriate stable placeholder), not "Dr. Ferdinand K. · Vienna"
- [ ] **CNT-02**: ContactSection has a coordinator presence (real photo or designed visual element) — coordinator was removed in Phase 84 to drop the Unsplash dependency

### Code Hygiene (Phase 88)

- [ ] **HYG-01**: Zero lint warnings on `pnpm build` for v8.0/v8.1 components
- [ ] **HYG-02**: Decide fate of `next/src/components/layout/LiquidBlobLayer.tsx` and `next/src/styles/liquid-depth.css` — either wire them in (with a phase plan) or remove them
- [ ] **HYG-03**: `.planning/research/{ARCHITECTURE,FEATURES,PITFALLS,STACK}.md` stash rewrites are either applied or explicitly discarded — no half-applied research drift

### Milestone Closeout (Phase 89)

- [ ] **CLO-01**: `stash@{0}` resolved — anything still relevant cherry-picked into a tracked commit; the stash entry dropped
- [ ] **CLO-02**: Phase 85 live a11y UAT executed against running dev server (7 browser-only checks documented in `85-VERIFICATION.md`)
- [ ] **CLO-03**: `/gsd-cleanup` archives v8.0 phase directories into `.planning/milestones/v8.0-phases`

## v9.0 Requirements

**Living Blob Liquid Glass Scene.** Single cursor-following green blob beneath UI as the only opaque object on the page; entire UI becomes transparent glass that reacts to the blob. Source: `design/LIQUID_GLASS_BLOB_TZ.md` (20 sections, 12 acceptance criteria). Synthesized in `.planning/research/SUMMARY.md`.

**REQ-ID namespaces:** `FND-*` (foundation), `BLOB-*` (engine), `GLASS-*` (chrome + index sweep), `ROUTE-*` (per-page propagation), `VER-*` (verification). Distinct from v8.1 `PROP-*` and v8.0 `FORM-*`.

### Foundation: Tokens, A11y Wiring, DOM Skeleton

- [x] **FND-01**: New blob palette tokens registered in `DESIGN.md` YAML and `next/src/app/globals.css` — `--blob-core: #35B678`, `--blob-hot: #4FE098`, `--blob-halo: rgba(98,221,177,0.5)`, `--blob-edge: rgba(125,205,255,0.18)`, `--blob-glint: rgba(255,255,255,0.65)`
- [x] **FND-02**: Glass tier tokens defined for 4 surface depths — `--glass-{section,card,form,button}-{fill,blur}` with desktop and mobile values; mobile blur values ≤12px (Phase 79 cap honored)
- [ ] **FND-03**: A11y `@layer` block in `liquid-glass.css` enumerates every glass class name (current + new) under `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast: more` — single source of truth
- [ ] **FND-04**: z-index contract documented in `DESIGN.md` — blob-field `z-0`, main content `z-1..10`, sticky/header `z-50+`, modals `z-100+`
- [ ] **FND-05**: CTA opaque-forever rule + v9.0 anti-pattern appendix added to `DESIGN.md` (no trails, no particles, no `mix-blend-mode` on glass, no animated `backdrop-filter`, no green tint on cards, no parallax)
- [ ] **FND-06**: `<div class="living-blob-field" aria-hidden="true">` skeleton mounted in `next/src/app/layout.tsx` with seeded `:root` CSS vars; `MeshBackground.tsx` removed
- [ ] **FND-07**: Key Decision logged in `PROJECT.md` for `--blob-hot: #4FE098` (new brand color); approved against `medicusunion.com` reference before BLOB phase begins

### Blob Engine: Renderer, Physics, A11y Branches

- [ ] **BLOB-01**: `LivingBlobField.tsx` shipped as `'use client'` + `dynamic({ ssr: false })`; Canvas 2D renderer with 4 sublayers (core, body, halo, glint) inside a single `position: fixed; inset: 0; z-index: 0; pointer-events: none` element
- [ ] **BLOB-02**: Single `pointermove` listener on `window` (`{ passive: true }`) + single `requestAnimationFrame` loop; lerp factors per sublayer (core ~0.18, body ~0.08, halo ~0.04); writes runtime CSS vars (`--blob-x/y`, `--blob-body-x/y`, `--blob-halo-x/y`, `--blob-heat`, `--blob-velocity`) to `document.documentElement` each frame; zero React state on pointer move
- [ ] **BLOB-03**: Singleton engine guard — `start()` is a no-op if already started; `useEffect` cleanup cancels rAF and removes listener; survives Strict Mode double-invocation and App Router route changes without leak
- [ ] **BLOB-04**: Heat accumulator on cursor dwell — ramps over 1.5–3s, decays smoothly over ≥600ms when motion resumes, peak luminance/scale delta ≤1.4×; disabled under `prefers-reduced-motion`
- [ ] **BLOB-05**: Velocity-driven shape stretch along motion direction; halo lags more than core; on stop, blob recollects without snap
- [ ] **BLOB-06**: Mobile branch (`(pointer: coarse) and (hover: none)`) — no pointer/touch follow; autonomous Lissajous ambient drift (period ≥12s); tap-pulse ≤400ms only on background (taps not in interactive elements), rate-limited 1 per 600ms; pauses during scroll
- [ ] **BLOB-07**: `prefers-reduced-motion: reduce` branch — no listener, no rAF, CSS-driven static ambient gradient only
- [ ] **BLOB-08**: `prefers-reduced-transparency: reduce` branch — blob hidden, glass surfaces switch to opaque fallbacks via existing `@layer` wiring
- [ ] **BLOB-09**: Dark theme (`[data-theme="dark"]`) — blob opacity ≤0.35, saturation ≤0.7, follow disabled (ambient drift only); existing `backdrop-filter: none` on glass preserved
- [ ] **BLOB-10**: Pointer-leave-window — smooth decay to last position then ambient drift; no snap-disappear; `data-blob-mode` attribute on `<html>` reflects current mode (cursor / ambient / static)
- [ ] **BLOB-11**: Page Visibility API integration — rAF stops when `document.hidden`, restarts on visible
- [ ] **BLOB-12**: Dev-only `window.__blobDebug.rafCount` exposed for Playwright leak assertions

### Glass UI Rework: Chrome + Index Sections

- [ ] **GLASS-01**: `HeaderClient`, `MobileMenu`, `StickyBar` reworked to v9.0 glass tiers; mobile blur cap (≤12px) preserved; HIG 44pt tap targets and ESC dismissal preserved
- [ ] **GLASS-02**: `HeroHub` frame on Tier 0 fill (≤0.16); CTA gradient stays fully opaque, never receives `backdrop-filter`
- [ ] **GLASS-03**: `StatsBar` — wrapper Tier 0, cards Tier 1 / hover Tier 2; respects responsive-glass-nesting (mobile 1 wrapper / desktop 4 cards) from Phase 82
- [ ] **GLASS-04**: `ServicesGrid` — cards Tier 1 / hover Tier 2; ≤2 glass siblings per viewport rule respected
- [ ] **GLASS-05**: `ProcessSection`, `ProblemSection`, `WhyUsSection`, `ClinicsSection`, `PlatformSection`, `ReviewsSection` — per-tier sweep aligned with new tokens
- [ ] **GLASS-06**: `FAQSection` — closed Tier 1, open Tier 2; smooth-anim accordion preserved
- [ ] **GLASS-07**: `ContactForm` + `ContactSection` — form panel uses `--glass-form-fill` (≥0.16 floor; escalate to 0.30 if WCAG AA fails); labels promoted from `text-muted` to `text-primary`; inputs `bg-white` opaque, NOT glass; localized blob dimming when blob centroid enters form bounds
- [ ] **GLASS-08**: `FinalCTA` — Tier 0 frame; CTA opaque, gradient unchanged
- [ ] **GLASS-09**: `Footer` — Tier 0 fill
- [ ] **GLASS-10**: `liquid-glass.css` utility classes re-pointed from `--liquid-bg: rgba(255,255,255,0.42)` and similar to new tier tokens; heat-leak `radial-gradient` rules added to `.liquid-card` / `.liquid-regular` so glass surfaces optically respond to blob position

### Per-Page Propagation: Sub-Routes

- [ ] **ROUTE-01**: `/checkup` section components (8 files in `next/src/components/sections/checkup/`) — per-tier sweep
- [ ] **ROUTE-02**: `/consultations` section components (8 files in `next/src/components/sections/consultations/`) — per-tier sweep
- [ ] **ROUTE-03**: `/treatment-abroad` section components (4 files in `next/src/components/sections/treatment/`) — per-tier sweep
- [ ] **ROUTE-04**: `/contacts` section components (2 files in `next/src/components/sections/contacts/`) — per-tier sweep
- [ ] **ROUTE-05**: Service-page primitives (`ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection` in `next/src/components/sections/service/`) — `LeadFormSection` receives same form-safety treatment as `ContactForm` (≥0.16 alpha, opaque inputs)
- [ ] **ROUTE-06**: shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea` in `next/src/components/ui/`) updated last (highest blast-radius)
- [ ] **ROUTE-07**: Per-route Playwright screenshot diff vs pre-v9.0 baseline before each route is signed off; form/CTA regions must be visually stable (blob area masked)

### Verification: UAT, Performance, A11y, Brand Review

- [ ] **VER-01**: Playwright UAT covers all 10 TZ §18 browser scenarios (desktop hero, mobile hero, cursor through hero/cards/form, 3s dwell, leave block, leave window, reduced motion, CTA/form readability)
- [ ] **VER-02**: Playwright a11y emulation tests for `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` — assert blob hidden / glass opaque / luminance dampened
- [ ] **VER-03**: Playwright leak test — navigate `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/` and assert `window.__blobDebug.rafCount === 1` and pointermove listener count === 1
- [ ] **VER-04**: Lighthouse CI gate configured with mobile-throttled budgets — LCP ≤2500ms, INP ≤200ms, CLS ≤0.1, TBT ≤200ms; PRs failing >10% regression vs baseline are blocked
- [ ] **VER-05**: Real-device manual UAT signed off (NO cheat-pass): (a) iPhone iOS 16 or 17 Safari, (b) low-end Android 4GB RAM (Redmi 9-class or similar), (c) desktop Chrome + Firefox + Safari — each with checklist + screenshot/video attachment in phase report
- [ ] **VER-06**: axe-core / Pa11y run against each route with blob parked in 3+ representative positions per page (under hero, under form, under CTA); zero new violations introduced
- [ ] **VER-07**: Brand visual review — render heat-peak still frame side-by-side with `medicusunion.com` and `medicusunion.com/.kz` references; pull saturation/opacity back if frame reads as fitness/gaming
- [ ] **VER-08**: All 12 TZ §19 acceptance criteria verified and recorded in phase report



Requirements for UI/UX Design Excellence milestone. Each maps to roadmap phases.

### Accessibility

- [x] **ACC-01**: Site responds to `prefers-contrast: more` with solid backgrounds and increased text contrast on all glass surfaces — *cheat-pass 2026-04-30; CSS block shipped Phase 85, NOT verified under live OS toggle. See `.planning/phases/89-milestone-closeout/89-VERIFICATION.md` § Cheat-pass record.*
- [x] **ACC-02**: Site responds to `prefers-reduced-transparency: reduce` with opaque fallbacks for all glass elements — *cheat-pass 2026-04-30; CSS block shipped Phase 85, NOT verified under live OS toggle.*
- [x] **ACC-03**: All text on glass surfaces passes WCAG 2.2 AA contrast (4.5:1 body, 3:1 large) against worst-case composite background — *cheat-pass 2026-04-30; NOT measured in DevTools.*
- [x] **ACC-04**: All interactive elements have visible `:focus-visible` indicators with sufficient contrast — *cheat-pass 2026-04-30; rules declared in `globals.css:366-386`, NOT walked via Tab key.*
- [x] **ACC-05**: All touch targets meet 44x44px minimum size on mobile viewports — *Playwright-verified for header toggle (44×44 confirmed); other elements cheat-passed without per-element measurement.*

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
| HERO-01 | Phase 81 | Complete |
| HERO-02 | Phase 81 | Complete |
| HERO-03 | Phase 81 | Complete |
| HERO-04 | Phase 81 | Complete |
| HERO-05 | Phase 81 | Complete |
| STATS-01 | Phase 82 | Complete |
| STATS-02 | Phase 82 | Complete |
| SVC-01 | Phase 83 | Complete |
| SVC-02 | Phase 83 | Complete |
| SVC-03 | Phase 83 | Complete |
| PROC-01 | Phase 83 | Complete |
| PROC-02 | Phase 83 | Complete |
| PROC-03 | Phase 83 | Complete |
| FORM-01 | Phase 84 | Complete |
| FORM-02 | Phase 84 | Complete |
| FORM-03 | Phase 84 | Complete |
| VIS-01 | Phase 85 | Complete |
| VIS-04 | Phase 85 | Complete |

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

### v9.0 Living Blob Liquid Glass Scene (Phases 90-94)

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 90 | Complete |
| FND-02 | Phase 90 | Complete |
| FND-03 | Phase 90 | Pending |
| FND-04 | Phase 90 | Pending |
| FND-05 | Phase 90 | Pending |
| FND-06 | Phase 90 | Pending |
| FND-07 | Phase 90 | Pending |
| BLOB-01 | Phase 91 | Pending |
| BLOB-02 | Phase 91 | Pending |
| BLOB-03 | Phase 91 | Pending |
| BLOB-04 | Phase 91 | Pending |
| BLOB-05 | Phase 91 | Pending |
| BLOB-06 | Phase 91 | Pending |
| BLOB-07 | Phase 91 | Pending |
| BLOB-08 | Phase 91 | Pending |
| BLOB-09 | Phase 91 | Pending |
| BLOB-10 | Phase 91 | Pending |
| BLOB-11 | Phase 91 | Pending |
| BLOB-12 | Phase 91 | Pending |
| GLASS-01 | Phase 92 | Pending |
| GLASS-02 | Phase 92 | Pending |
| GLASS-03 | Phase 92 | Pending |
| GLASS-04 | Phase 92 | Pending |
| GLASS-05 | Phase 92 | Pending |
| GLASS-06 | Phase 92 | Pending |
| GLASS-07 | Phase 92 | Pending |
| GLASS-08 | Phase 92 | Pending |
| GLASS-09 | Phase 92 | Pending |
| GLASS-10 | Phase 92 | Pending |
| ROUTE-01 | Phase 93 | Pending |
| ROUTE-02 | Phase 93 | Pending |
| ROUTE-03 | Phase 93 | Pending |
| ROUTE-04 | Phase 93 | Pending |
| ROUTE-05 | Phase 93 | Pending |
| ROUTE-06 | Phase 93 | Pending |
| ROUTE-07 | Phase 93 | Pending |
| VER-01 | Phase 94 | Pending |
| VER-02 | Phase 94 | Pending |
| VER-03 | Phase 94 | Pending |
| VER-04 | Phase 94 | Pending |
| VER-05 | Phase 94 | Pending |
| VER-06 | Phase 94 | Pending |
| VER-07 | Phase 94 | Pending |
| VER-08 | Phase 94 | Pending |

**v9.0 Coverage:**
- v9.0 requirements: 44 total
- Pending: 44
- Mapped to phases: 44
- Unmapped: 0

**Phase distribution:**
- Phase 90 (Foundation): 7 (FND-01..07)
- Phase 91 (Blob Engine): 12 (BLOB-01..12)
- Phase 92 (Glass Index + Chrome): 10 (GLASS-01..10)
- Phase 93 (Per-Page Propagation): 7 (ROUTE-01..07)
- Phase 94 (Verification): 8 (VER-01..08)
---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-30 after v9.0 milestone start (Living Blob Liquid Glass Scene)*
