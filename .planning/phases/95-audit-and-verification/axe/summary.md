# AUDIT-02 — axe-core a11y Audit Summary

**Run date:** 2026-05-01
**Tool:** @axe-core/playwright v4.11.3 (axe-core v4.11.4)
**Tags:** wcag2a, wcag2aa, wcag21aa, wcag22aa
**Routes:** /, /checkup, /consultations, /treatment-abroad, /contacts
**Modes:** default, reduced-motion, reduced-transparency
**Total audits:** 15 (desktop project, 1280×800)
**Commit SHA:** (see commit log for axe spec/run)

## Violation Counts by Route × Mode

| Route × Mode | Critical | Serious | Moderate | Minor |
|---|---:|---:|---:|---:|
| / × default | 0 | 1 | 0 | 0 |
| / × reduced-motion | 0 | 1 | 0 | 0 |
| / × reduced-transparency | 0 | 1 | 0 | 0 |
| /checkup × default | 0 | 1 | 0 | 0 |
| /checkup × reduced-motion | 0 | 1 | 0 | 0 |
| /checkup × reduced-transparency | 0 | 1 | 0 | 0 |
| /consultations × default | 0 | 0 | 0 | 0 |
| /consultations × reduced-motion | 0 | 0 | 0 | 0 |
| /consultations × reduced-transparency | 0 | 0 | 0 | 0 |
| /treatment-abroad × default | 0 | 1 | 0 | 0 |
| /treatment-abroad × reduced-motion | 0 | 1 | 0 | 0 |
| /treatment-abroad × reduced-transparency | 0 | 1 | 0 | 0 |
| /contacts × default | 0 | 0 | 0 | 0 |
| /contacts × reduced-motion | 0 | 0 | 0 | 0 |
| /contacts × reduced-transparency | 0 | 1 | 0 | 0 |
| **TOTALS (15 audits)** | **0** | **10** | **0** | **0** |

## Hard Gate

- [x] 0 critical violations across 15 audits
- [ ] 0 serious violations across 15 audits — **NOT MET: 10 occurrences of `color-contrast` across 4 routes × 3 modes (consultations clean; contacts clean except in reduced-transparency)**

Hard gate breach is DOCUMENTED, not waived. The axe spec assertion is strict (`expect(blocking).toEqual([])`) and was NOT relaxed. The 10-test failure is a real WCAG 2.1 AA breach surfaced by Phase 95's audit posture.

## Serious Violations — Disposition

### Violation 1 — `color-contrast` (impact: serious)

**Rule:** Elements must meet minimum color contrast ratio thresholds (WCAG 2.1 AA — 4.5:1 for normal text, 3:1 for large text)
**Help URL:** https://dequeuniversity.com/rules/axe/4.10/color-contrast

**Affected routes:**
- `/` (all 3 modes) — eyebrow pill "Наши Услуги" `text-mu-accent-blue (#4f84e8)` on `#fbfbfb` = 3.5:1 (fails ≥4.5:1); CTA "от 450 €" `text-mu-accent-blue` on `--glass-button-fill` = 3.53:1
- `/checkup` (all 3 modes) — eyebrow pill "Чек-ап за рубежом" `text-mu-blue (#38c6f4)` on `#fbfbfb` = **1.92:1** (severe; fails ≥4.5:1 by half)
- `/treatment-abroad` (all 3 modes) — eyebrow pill "Медицинский туризм" same 1.92:1
- `/contacts` (reduced-transparency only) — `.text-mu-text-500 (#727686)` "(необязательно)" label on `#fefefe` = 4.47:1 (just under 4.5:1; affected only when glass becomes opaque)

**Affected nodes (sample selectors):**
- `.text-xs` (eyebrow pill on /checkup, /treatment-abroad)
- `.text-mu-text-500` (optional-field label on /contacts)
- `.py-2\.5.px-5.shadow-glass-inner > .uppercase.tracking-wider.sm\:text-sm` (eyebrow on /)
- `.w-fit.py-1.bg-\[var\(--glass-button-fill\)\] > .text-mu-accent-blue.text-xs` (price chip on /)
- `.text-mu-green-700` (additional secondary-color contrast hits)

**Disposition:** **fix — routes to Phase 94 (POL-01..05)**

This is the v9.0 baseline color-contrast issue called out in the orchestrator brief ("eyebrow pill in mobile glass count" + brand-color secondary text on glass). Phase 95 is forbidden by the orchestrator brief from fixing POL-01..05 issues:

> "Phase 94 (Polish & Hygiene) is running in parallel. Audits in this phase will measure the un-polished v9.0 baseline (still has 7 SVG `rx` console errors, eyebrow pill in mobile glass count, etc.). That is acceptable for this milestone — the audits document the baseline; remediation routes through Phase 94 plans. Do NOT attempt to fix POL-01..05 issues from Phase 95 plans (out of scope)."

**Remediation route:**
- Phase 94 POL plan covering accent-color-on-glass contrast
- Likely fix: darken `--mu-accent-blue` (currently #4f84e8) and `--mu-blue` (currently #38c6f4) when used as foreground on light glass, or reweight eyebrow pills to use `--mu-text-700` with smaller chip-bg
- Re-run AUDIT-02 after Phase 94 POL plans land; 0/0 serious gate must pass before milestone v9.0.1 closeout

**Follow-up todo:** `.planning/todos/pending/95-02-color-contrast-eyebrow-pill.md` (filed below)

## Hard-Gate Posture (Anti-Cheat-Pass)

The spec uses a strict assertion (`expect(blocking).toEqual([])`); it was NOT relaxed with `.skip()`, `disableRules([...])`, or impact-filter loosening. The 10 failures are real WCAG 2.1 AA breaches recorded with concrete contrast ratios and selectors. Milestone closeout is BLOCKED on this gate until Phase 94 closes the violations.

## Files

| Route | default | reduced-motion | reduced-transparency |
|-------|---------|----------------|----------------------|
| /                 | [json](./index--default.json)             | [json](./index--reduced-motion.json)             | [json](./index--reduced-transparency.json) |
| /checkup          | [json](./checkup--default.json)           | [json](./checkup--reduced-motion.json)           | [json](./checkup--reduced-transparency.json) |
| /consultations    | [json](./consultations--default.json)     | [json](./consultations--reduced-motion.json)     | [json](./consultations--reduced-transparency.json) |
| /treatment-abroad | [json](./treatment-abroad--default.json)  | [json](./treatment-abroad--reduced-motion.json)  | [json](./treatment-abroad--reduced-transparency.json) |
| /contacts         | [json](./contacts--default.json)          | [json](./contacts--reduced-motion.json)          | [json](./contacts--reduced-transparency.json) |
