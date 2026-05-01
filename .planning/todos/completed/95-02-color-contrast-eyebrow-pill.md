# color-contrast violation on eyebrow pills + accent-blue secondary text

**Source:** Phase 95 AUDIT-02 (.planning/phases/95-audit-and-verification/axe/summary.md)
**Severity:** WCAG 2.1 AA serious
**Routes affected:** /, /checkup, /treatment-abroad, /contacts (10 of 15 axe audits fail)
**Routes clean:** /consultations (all 3 modes), /contacts (default + reduced-motion)

## Concrete failures

- `/checkup`, `/treatment-abroad`: eyebrow pill `text-mu-blue (#38c6f4)` on light glass = **1.92:1** (severe; ≥4.5:1 required)
- `/`: eyebrow pill `text-mu-accent-blue (#4f84e8)` on `#fbfbfb` = 3.5:1; CTA price chip 3.53:1
- `/contacts` reduced-transparency: `.text-mu-text-500 (#727686)` "(необязательно)" = 4.47:1 (just under)

## Remediation hypothesis

Either darken accent tokens when used as foreground on light glass, OR reweight eyebrow chips to use `--mu-text-700` with subtle accent ring instead of accent-color text.

## Closes when

`pnpm --dir next exec playwright test --project=desktop tests/a11y/axe.spec.ts` exits 0 — 0 critical/serious violations across all 15 audits.

## Routes through

Phase 94 POL plans (Polish & Hygiene). Filed from Phase 95 audit baseline.
