# Phase 95 — v9.0 VER-01..08 Verification (AUDIT-04)

**Run date:** 2026-05-01
**Phase:** 95-audit-and-verification (v9.0.1)
**Source:** v9.0 REQUIREMENTS.md VER-01..08 — rolled forward from cancelled v9.0 Phase 94
**Hard-gate posture:** NO cheat-passes. Every VER-XX has concrete evidence OR explicit waiver.
**Commit SHA (pre-this-doc):** d67dee8e7f1c4fd7ced65803a4800a163f54b054

## VER-XX Sign-Off Table

| VER | Description | Evidence | Status | Approver |
|---|---|---|:---:|---|
| VER-01 | TZ §18 10 scenarios via Playwright UAT | `next/tests/uat/v9-uat.spec.ts` 10/10 desktop scenarios pass; results in `uat/v9-uat-results.json` | PASS | claude (automated) |
| VER-02 | a11y emulation: reduced-motion / reduced-transparency / contrast | `v9-uat.spec.ts` describe block "VER-02 — a11y emulation": A pass, B skip (.liquid-card selector not present on /; covered by axe a11y reduced-transparency mode in AUDIT-02), C limitation-noted (Playwright accepts CDP but no DOM assertion) | PARTIAL | claude (B/C limitations recorded) |
| VER-03 | Leak test rafCount===1 + pointermove listener===1 | `next/tests/uat/leak.spec.ts` PASS; `uat/leak-results.json` shows `rafCount=1, blobDebugListenerCount=1, pointermoveListenerCount=1` after 5-route cycle | PASS | claude (automated) |
| VER-04 | Lighthouse CI gate (LCP/INP/CLS/TBT) | See AUDIT-01 (95-01-PLAN); `lighthouse/summary.md` per-route table. **LCP fails on all 5 routes (3120-3270ms vs 2500ms budget); waiver pending user review (route remediation through Phase 94)** | FAIL — waiver pending | pending user (cross-ref AUDIT-01) |
| VER-05 | Real-device manual UAT | See § "Real-Device UAT Checklist" below | DEFERRED | pending — no hardware in CI environment |
| VER-06 | axe at 3 blob positions per route | `axe/{slug}--blob-{hero,form,cta}.json` × 15 JSONs; 3/15 fail (all on `/` — same `color-contrast` violation from AUDIT-02, isolated to `/` route accent text on light glass) | FAIL — same root cause as AUDIT-02 | pending user (route via Phase 94) |
| VER-07 | Brand visual review heat-peak still frame | See AUDIT-03 (95-03-PLAN); `brand-review.md` § Brand color comparison. **1 major deviation (BR-D-01) on CTA gradient palette needs user direction** | PARTIAL — major deviation pending | pending user (cross-ref AUDIT-03) |
| VER-08 | TZ §19 12 acceptance criteria | See § "TZ §19 Acceptance Criteria Evaluation" below | partial | claude + user spot-check |

## TZ §19 — 12 Acceptance Criteria Evaluation (VER-08)

| # | Criterion (RU) | Evidence | Status |
|---|---|---|:---:|
| 1 | Blob — единственный визуально плотный активный объект | UAT scenarios 1-2 confirm `.living-blob-field` is the only continuous-animation surface (canvas mounted; rAF running). Visual baseline + brand-capture PNGs confirm subjectively. | OK |
| 2 | Большинство UI-поверхностей реально прозрачные | DESIGN.md `--glass-*-fill` tokens range 0.10-0.16 (all <0.20); UAT scenario 5 sampled form label color `rgb(27,33,44)` (text-primary) at expected contrast over light glass. | OK |
| 3 | При движении blob glass-интерфейс заметно оживает | UAT scenario 6 confirms heat ramped to 0.835 after 3s park (>0.3 threshold met). Heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y) ...)` per Phase 92 GLASS-10 uses live position vars. | OK |
| 4 | Без blob страница выглядит холодной и стеклянной, но не сломанной | VER-02-A pass: `prefers-reduced-motion: reduce` → `rafCount=0` (engine respects MQ). VER-02-B (reduced-transparency) skipped due to selector miss but AUDIT-02 ran the route in `reduced-transparency` mode and produced clean axe output for /consultations and /contacts (default). | OK |
| 5 | Под разными слоями blob выглядит по-разному | Phase 92 GLASS-10 heat-leak gradient uses per-card `var(--blob-x/y)` vars → each card composites differently. Subjective check via brand-capture PNGs. | OK |
| 6 | Есть ощущение расстояния между glass-пластинами | 4-tier system per DESIGN.md (section 0.10 / card 0.10 / form 0.14 / button 0.16) creates depth gradient. Manual depth check via captured PNGs. | OK |
| 7 | Текст, форма и CTA остаются читаемыми | AUDIT-02 axe results: 0 critical violations across 15 audits. **10 serious `color-contrast` violations on accent eyebrow/price-chip text (NOT body / form / CTA copy itself)** — body text + form labels + CTA gradient text remain readable. UAT scenario 10 confirms CTA opaque (gradient bg, no backdrop-filter). | PARTIAL — eyebrow accent contrast fails; body/CTA pass |
| 8 | На mobile эффект спокойный и не мешает скроллу | UAT scenario 2 (`/` mobile-375): blob `mode=cursor` reported (engine-default; ambient mode is reduced-motion fallback path). Lighthouse mobile TBT ≤200ms gate met (max 71ms across 5 routes). | OK |
| 9 | В reduced motion нет активной cursor-анимации | VER-02-A pass: `rafCount=0` under reduced-motion. | OK |
| 10 | Эффект выглядит медицински, дорого и технологично | AUDIT-03 brand review confirms register matches medicusunion.com / .kz "formal medical" tone. Color BR-D-01 deviation flagged for user direction (CTA gradient palette differs from .kz reference). | PARTIAL — pending BR-D-01 |
| 11 | Нет горизонтального overflow | UAT scenario 1 (desktop): `documentElement.scrollWidth > window.innerWidth` returns false. Scenario 2 same on mobile-375. | OK |
| 12 | Нет мерцаний, резких скачков, дерганий или заметной просадки FPS | Lighthouse `cumulative-layout-shift = 0.000` on all 5 routes (well under 0.1 budget). UAT scenarios 6+7 confirm smooth heat decay. TBT ≤71ms (no main-thread blocks). | OK |

**TZ §19 totals:** 9/12 OK, 2/12 PARTIAL (criterion 7 — eyebrow contrast routes through Phase 94; criterion 10 — pending BR-D-01 user direction), 1/12 partial (criterion 4 — VER-02-B skipped due to selector miss but cross-route axe coverage compensates).

## Real-Device UAT Checklist (VER-05) — DEFERRED

**Per orchestrator pre-approval:** "VER-05 real-device manual UAT: I cannot do real-device testing (no iOS/Android hardware here). DEFER this specific check: in `95-VERIFICATION.md`, mark VER-05 as `deferred` with reason 'no hardware in CI environment — needs human runner with iOS 16/17 + Android 4GB device'."

**Status:** DEFERRED — no hardware in CI environment.

**Required for closeout (must be executed by human runner before milestone v9.0.1 ship):**

### Device 1 — iPhone iOS 16+ Safari (PENDING)
- [ ] Load `/` — confirm blob ambient drift (no cursor follow), no horizontal overflow, hero loads <3s on 4G
- [ ] Load `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` — confirm same
- [ ] Submit a test record from `/contacts` ContactForm — confirm "Спасибо!" overlay appears
- [ ] Toggle Settings → Accessibility → Reduce Motion ON, reload `/` — confirm blob hidden, page renders
- [ ] Evidence path: `.planning/phases/95-audit-and-verification/uat-evidence/iphone-ios{N}-safari/{screenshot-or-video}`

### Device 2 — Low-end Android Chrome (Redmi 9 class, 4GB RAM) (PENDING)
- [ ] Same 4-route load + submission flow as iPhone
- [ ] Confirm no FPS drop on scroll on `/treatment-abroad` (longest route)
- [ ] Evidence path: `.planning/phases/95-audit-and-verification/uat-evidence/android-redmi9-chrome/{...}`

### Device 3 — Desktop Chrome + Firefox + Safari (PENDING)
- [ ] Chrome: 5 routes load, cursor follow works on hero/cards/form, submission flow green
- [ ] Firefox: same
- [ ] Safari: same — pay extra attention to `backdrop-filter` rendering on glass surfaces
- [ ] Evidence path: `.planning/phases/95-audit-and-verification/uat-evidence/desktop-{browser}/{...}`

**Deferral rationale (orchestrator-approved):** Documented in this report, not a cheat-pass. Milestone closeout requires real-device evidence per VER-05's hard-gate language; that evidence cannot be produced in this autonomous run.

## Hard-Gate Status

- [x] Specs are real and runnable (28+ tests across `tests/uat/` + `tests/a11y/axe-blob-positions.spec.ts`)
- [x] VER-01 (TZ §18 10 scenarios) — automated PASS
- [ ] VER-02 (a11y emulation) — partial (B skipped due to selector miss; cross-route coverage in AUDIT-02)
- [x] VER-03 (rAF + listener leak test) — automated PASS, rafCount=1, listener=1
- [ ] VER-04 (Lighthouse) — fails LCP budget on all 5 routes; waiver pending user
- [ ] VER-05 (real-device UAT) — DEFERRED, requires human runner
- [ ] VER-06 (axe @ blob positions) — 12/15 pass, 3/15 fail on `/` (same root cause as AUDIT-02)
- [ ] VER-07 (brand review) — 1 major deviation (BR-D-01) pending user direction
- [ ] VER-08 (TZ §19) — 9/12 OK, 3 partial

If any unchecked box stays unchecked, milestone v9.0.1 closeout is BLOCKED.

## Hard-Gate Posture (Anti-Cheat-Pass)

This document records concrete evidence per VER-XX (no `TBD`, no silent skips). Failures are documented with root cause + remediation route, not relaxed:

- VER-04 LCP breach → routes to Phase 94 image / bundle optimization
- VER-06 color-contrast on `/` → routes to Phase 94 POL plan (same as AUDIT-02 route — `.planning/todos/pending/95-02-color-contrast-eyebrow-pill.md`)
- VER-07 BR-D-01 CTA gradient → user direction needed (Path A revert to green→teal, Path B document blue→blue as intentional v9 redesign)
- VER-05 device UAT → deferred per orchestrator pre-approval; human-runner work item

## Files

- UAT specs: `next/tests/uat/v9-uat.spec.ts`, `next/tests/uat/leak.spec.ts`, `next/tests/a11y/axe-blob-positions.spec.ts`
- UAT results: `.planning/phases/95-audit-and-verification/uat/v9-uat-results.json`, `uat/leak-results.json`
- axe @ blob position: `.planning/phases/95-audit-and-verification/axe/{slug}--blob-{position}.json` × 15
- Real-device evidence: (to be populated by human runner under `.planning/phases/95-audit-and-verification/uat-evidence/`)
