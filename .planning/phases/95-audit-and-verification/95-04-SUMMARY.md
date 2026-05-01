# 95-04 — AUDIT-04 v9.0 VER-01..08 Rollover Summary

**Status:** partial — VER-05 deferred (no hardware), VER-04/06/07 cross-reference failures from upstream audits, automated rows green
**Run date:** 2026-05-01

## Specs Created

| Spec | Test count | Result |
|------|-----------:|--------|
| `next/tests/uat/v9-uat.spec.ts` | 13 (10 TZ §18 + 3 VER-02) | 13/13 desktop pass (1 informational skip on VER-02-B due to selector) |
| `next/tests/uat/leak.spec.ts` | 1 | 1/1 pass (rafCount=1, listener=1) |
| `next/tests/a11y/axe-blob-positions.spec.ts` | 15 (5 routes × 3 positions) | 12/15 pass; 3/15 fail on `/` (same `color-contrast` root cause as AUDIT-02) |

## VER-XX Status Matrix

| VER | Status | Notes |
|-----|--------|-------|
| VER-01 | PASS | TZ §18 10/10 automated scenarios green |
| VER-02 | PARTIAL | A pass, B skip (no `.liquid-card` on `/` — covered by AUDIT-02 reduced-transparency mode), C limitation noted |
| VER-03 | PASS | rafCount=1, blobDebugListenerCount=1, pointermoveListenerCount=1 after 5-route cycle |
| VER-04 | FAIL | Cross-ref AUDIT-01: LCP fails 5/5 routes (3120-3270ms vs 2500ms budget); waiver pending user |
| VER-05 | DEFERRED | Per orchestrator pre-approval — no hardware in CI environment; needs human runner with iOS 16/17 + Android 4GB device + desktop 3 browsers |
| VER-06 | FAIL | 3/15 axe @ blob positions fail on `/` (same color-contrast issue as AUDIT-02; routes to Phase 94 POL plan) |
| VER-07 | PARTIAL | Cross-ref AUDIT-03: 1 major deviation (BR-D-01 CTA gradient palette) needs user direction |
| VER-08 | PARTIAL | TZ §19 12 criteria: 9 OK, 3 partial (criterion 7 eyebrow contrast, criterion 10 brand BR-D-01 pending, criterion 4 minor selector skip) |

## TZ §19 Acceptance Summary

- **OK:** 9/12 (criteria 1, 2, 3, 5, 6, 8, 9, 11, 12)
- **PARTIAL:** 3/12 (criteria 4, 7, 10 — see 95-VERIFICATION.md table)
- **FAIL:** 0/12

## Hard-Gate Status

Milestone v9.0.1 closeout is **BLOCKED** until:
- [ ] User waiver on VER-04 LCP breach (or Phase 94 lands LCP fix and AUDIT-01 re-runs green)
- [ ] User direction on VER-07 BR-D-01 (CTA gradient)
- [ ] Phase 94 lands color-contrast fix; AUDIT-02 + VER-06 re-run green
- [ ] Human runner executes VER-05 real-device UAT

## File Inventory

- 3 spec files (`tests/uat/v9-uat.spec.ts`, `tests/uat/leak.spec.ts`, `tests/a11y/axe-blob-positions.spec.ts`)
- 2 result JSONs (`uat/v9-uat-results.json`, `uat/leak-results.json`)
- 15 axe @ blob-position JSONs (`axe/{slug}--blob-{hero,form,cta}.json`)
- 1 verification doc (`95-VERIFICATION.md`)

## Open Items / Milestone Blockers

1. **VER-04 LCP waiver** — pending user (Phase 94 mitigation routed)
2. **VER-07 BR-D-01** — pending user direction on CTA gradient palette
3. **VER-05 device UAT** — pending human runner
4. **VER-06 / AUDIT-02 contrast** — Phase 94 POL plan to remediate; re-run will close gate
