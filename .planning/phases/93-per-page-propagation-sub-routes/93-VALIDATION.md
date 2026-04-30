---
phase: 93
slug: per-page-propagation-sub-routes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-30
---

# Phase 93 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x — INSTALLED IN WAVE 0 |
| **Build smoke** | `pnpm --dir next build` (existing — used between sweeps) |
| **Lint smoke** | `pnpm --dir next lint` (existing — used between sweeps) |
| **Config file** | `next/playwright.config.ts` (created Wave 0; desktop ≥1280px + mobile 375px projects) |
| **Quick run command** | `pnpm --dir next playwright test --project=visual-regression --grep "{route}"` |
| **Full suite command** | `pnpm --dir next playwright test` |
| **Estimated runtime** | ~30s smoke / ~3min full visual-diff suite (4 routes × 2 breakpoints) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --dir next build` + `pnpm --dir next lint` (Next.js native + ESLint smoke; both are existing infrastructure).
- **After every plan wave:** Run wave-relevant `pnpm --dir next playwright test --project=visual-regression --grep "<route|primitive>"` IF Wave 0 baseline is captured (Waves 1+).
- **Before `/gsd-verify-work`:** Full Playwright visual-regression suite must be green across all 4 sub-routes × 2 breakpoints; submission-path E2E (`pnpm --dir next playwright test --grep "submission-e2e"`) green.
- **Max feedback latency:** ~30s for build+lint between commits; ~3min for wave-end visual diff.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 93-00-01 | 00 | 0 | ROUTE-07 | — | Playwright deps installed; `playwright.config.ts` valid; `__blobDebug.setMode('static')` availability verified | infra | `pnpm --dir next playwright --version && pnpm --dir next playwright test --list` | ❌ W0 (creates file) | ⬜ pending |
| 93-00-02 | 00 | 0 | ROUTE-07 | — | Pre-Phase-93 baseline screenshots captured for 4 routes × 2 breakpoints; blob region masked; deterministic via static blob mode | infra | `pnpm --dir next playwright test --project=visual-regression --update-snapshots` | ❌ W0 (creates baseline images) | ⬜ pending |
| 93-01-01 | 01 | 1 | ROUTE-02 | — | `ServiceHero` swept to v9 tier tokens; build green; opaque CTA preserved | smoke | `pnpm --dir next build && pnpm --dir next lint` | ✅ | ⬜ pending |
| 93-01-02 | 01 | 1 | ROUTE-02 | — | `SocialProof` swept to v9 tier tokens; cards Tier 1 default; build green | smoke | `pnpm --dir next build && pnpm --dir next lint` | ✅ | ⬜ pending |
| 93-01-03 | 01 | 1 | ROUTE-02 | — | `FAQ` accordion swept to Archetype D (closed Tier 1, open hover Tier 2); smooth-anim preserved | smoke | `pnpm --dir next build && pnpm --dir next lint` | ✅ | ⬜ pending |
| 93-01-04 | 01 | 1 | ROUTE-02, ROUTE-03 | — | `LeadFormSection` flatten Tier 0 outer (Decision A); inner Tier 2 form-fill α=0.50; opaque inputs; promoted labels; **NO honeypot/timing carry-forward** (Decision C) | smoke | `pnpm --dir next build && pnpm --dir next lint` | ✅ | ⬜ pending |
| 93-02-01 | 02 | 2 | ROUTE-01 | — | `/checkup` (7 rendered files) swept to v9 tokens; opaque-CTA negative-grep zero matches; visual-diff vs baseline (non-blob region stable) | full | `pnpm --dir next build && pnpm --dir next playwright test --grep "checkup"` | ✅ | ⬜ pending |
| 93-02-02 | 02 | 2 | ROUTE-01 | — | `/consultations` (7 rendered files) swept; same gates as checkup | full | `pnpm --dir next build && pnpm --dir next playwright test --grep "consultations"` | ✅ | ⬜ pending |
| 93-02-03 | 02 | 2 | ROUTE-01 | — | `/treatment-abroad` (4 files) swept; same gates | full | `pnpm --dir next build && pnpm --dir next playwright test --grep "treatment-abroad"` | ✅ | ⬜ pending |
| 93-02-04 | 02 | 2 | ROUTE-01 | — | `/contacts` (page.tsx + actually-imported files) swept; dead-code (`contacts/*` 4 files) untouched per Decision F | full | `pnpm --dir next build && pnpm --dir next playwright test --grep "contacts"` | ✅ | ⬜ pending |
| 93-03-01 | 03 | 3 | ROUTE-06 | — | shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea`) — verify admin-only consumer (`admin/submissions-table.tsx`); future-proof note on `dialog.tsx` | full | `pnpm --dir next build && pnpm --dir next playwright test --grep "shadcn"` | ✅ | ⬜ pending |
| 93-03-02 | 03 | 3 | ROUTE-04, ROUTE-05 | — | Per-route Playwright visual-diff vs Wave 0 baseline across all 4 sub-routes × 2 breakpoints; no regression in non-blob regions | full | `pnpm --dir next playwright test --project=visual-regression` | ✅ | ⬜ pending |
| 93-03-03 | 03 | 3 | ROUTE-07 | T-93-07-01 (form submission integrity) | Submission-path E2E: submit one test record per route; confirm Directus arrival; cleanup test record | full | `pnpm --dir next playwright test --grep "submission-e2e"` | ❌ W0 (creates spec) | ⬜ pending |
| 93-03-04 | 03 | 3 | ROUTE-04, ROUTE-05, ROUTE-06, ROUTE-07 | — | DESIGN.md anti-pattern register: append "Do not propagate ContactForm honeypot/timing pattern without explicit anti-bot decision phase" | docs | `grep -q 'ContactForm honeypot/timing' DESIGN.md` | ❌ W0 (Wave 3 task) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `next/playwright.config.ts` — Playwright config with two projects: `desktop` (1280×800) + `mobile-375` (375×667). Outputs to `next/test-results/`.
- [ ] `next/tests/visual/baseline.spec.ts` — visual-regression spec with `.living-blob-field` mask + `__blobDebug.setMode('static')` setup; tests 4 routes × 2 breakpoints.
- [ ] `next/tests/e2e/submission.spec.ts` — submission-path E2E spec; submits 1 record per route; confirms Directus arrival via API; cleans up.
- [ ] `pnpm --dir next add -D @playwright/test` — install Playwright as dev dependency.
- [ ] `npx playwright install chromium` — install Chromium browser binary.
- [ ] Snapshot baseline capture (initial run with `--update-snapshots`) before Wave 1 begins.
- [ ] Verify `window.__blobDebug.setMode?.('static')` is available in dev build (Phase 91 deliverable). If not present, fall back to `page.emulateMedia({ reducedMotion: 'reduce' })`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real-device mobile blur cap (≤12px) on iOS / low-end Android — confirm BL-01 saturate-clobber severity does not visibly regress on sub-routes | ROUTE-01, ROUTE-02 | Playwright runs Chromium-only; Safari iOS + Android Chrome have device-specific filter pipeline behavior | Open `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` on real iOS 16+ Safari + Android Chrome on a mid-tier device; visually inspect chrome (HeaderClient/MobileMenu/StickyBar) saturation; compare against `/` baseline |
| WCAG AA empirical re-measurement on `LeadFormSection` body copy at gradient worst-case across all 3 routes that consume it | ROUTE-02 | Theoretical KD-v9-002 = 0.50 yields 4.60:1 worst-case for ContactSection's blue gradient; LeadFormSection sits over bare blob field (different background dynamics) — empirical reading needed per route | Open `/checkup`, `/consultations`, `/treatment-abroad` LeadFormSection in Chrome DevTools; use built-in contrast picker on body-copy elements (`.text-mu-text-700` lines); confirm ≥4.5:1 with blob parked at viewport corners (4 positions) |
| FAQ accordion smooth-anim interaction across sub-routes | ROUTE-02 | Hover-state dynamic; not reliably testable via Playwright snapshot | Open each sub-route's FAQ section; click multiple items; verify 300ms max-height transition + aria-expanded toggle + Tier 1 ↔ hover-Tier 2 ramp |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (Playwright install + config + baseline + E2E spec)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (build+lint smoke); < 3min (wave-end visual diff)
- [ ] `nyquist_compliant: true` set in frontmatter once Wave 0 ships

**Approval:** pending
