# 95-02 — AUDIT-02 axe-core a11y Audit Summary

**Status:** complete with hard-gate breach documented (routes to Phase 94)
**Run date:** 2026-05-01
**Tool:** @axe-core/playwright v4.11.3 + axe-core v4.11.4

## Audit matrix

5 routes × 3 a11y emulation modes = 15 audits. All 15 JSON reports written under `.planning/phases/95-audit-and-verification/axe/`.

## Hard-Gate Status

- Critical violations (across 15 audits): **0** — PASS
- Serious violations (across 15 audits): **10** — FAIL (single rule: `color-contrast`)
- Moderate violations: 0
- Minor violations: 0

Evidence: `grep -c '"impact": "serious"' .planning/phases/95-audit-and-verification/axe/*.json` aggregates to 10.

## Routes by status

| Route | Status |
|-------|--------|
| `/` | 3/3 modes serious-violation (eyebrow + price-chip accent contrast) |
| `/checkup` | 3/3 modes serious-violation (eyebrow `text-mu-blue` 1.92:1) |
| `/consultations` | 0/3 — clean |
| `/treatment-abroad` | 3/3 modes serious-violation (same as /checkup eyebrow) |
| `/contacts` | 1/3 modes (reduced-transparency only — opaque-bg surfaces "(необязательно)" label below 4.5:1) |

## Disposition

Single violation rule (`color-contrast`) on accent-color secondary text against light glass surfaces. Per orchestrator brief, Phase 95 does NOT fix POL-01..05 issues — remediation routes through Phase 94 plans. Follow-up todo filed: `.planning/todos/pending/95-02-color-contrast-eyebrow-pill.md`.

## File Inventory

- 1 spec: `next/tests/a11y/axe.spec.ts` (30 test invocations × 2 projects, 15 desktop tests run)
- 15 JSON audit reports under `.planning/phases/95-audit-and-verification/axe/`
- 1 summary.md
- 1 follow-up todo

## Open Items

- [ ] Phase 94 POL plan addressing accent-color contrast on light glass (eyebrow pills, secondary text labels)
- [ ] After Phase 94 lands: re-run axe spec; gate must pass 0/0 serious before milestone closeout
