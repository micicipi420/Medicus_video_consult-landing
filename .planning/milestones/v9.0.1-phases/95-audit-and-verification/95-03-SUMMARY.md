# 95-03 — AUDIT-03 Brand Review Summary

**Status:** partial — major deviation needs user direction
**Run date:** 2026-05-01
**Tool:** Playwright capture + computed-styles extraction + DESIGN.md token comparison

## Reference + Local Captures

7 PNGs committed (2 reference + 5 local at desktop 1280×800). 1 computed-styles.json with 6 contexts (2 reference sites + 4 local routes; /contacts skipped since the form is below the hero fold and not the brand-defining surface).

## Deviation Counts

| Axis | match | minor | accepted-divergence | should-fix | major |
|------|------:|------:|--------------------:|-----------:|------:|
| color      | 4 | 1 | 0 | 0 | **1** |
| typography | 3 | 0 | 2 | 0 | 0 |
| tone       | 3 | 0 | 0 | 0 | 0 |
| **TOTAL**  | 10 | 1 | 2 | 0 | **1** |

## Hard-Gate Status

- [x] No `should-fix` deviations
- [x] All non-major deviations auto-approved per Phase 95 orchestrator pre-approval (typography is intentional brand uplift; color minor is documentation alias clarification)
- [ ] **BR-D-01 (major) needs user direction**: local CTA gradient = `#38C6F4 → #4F84E8` (brand-blue → accent-blue); medicusunion.kz reference = `#1AC67E → #0D9DB5` (DESIGN.md `cta-gradient-from/to`). Two remediation paths offered in `brand-review.md` § 6.

## Tone Verdict

`/checkup`, `/consultations`, `/treatment-abroad` — formal-medical register matches reference. CLAUDE.md tone constraint honored. **No tone deviations.**

## File Inventory

- 7 PNGs (2 reference + 5 local)
- 1 computed-styles.json
- 1 brand-review.md
- 1 capture spec (next/tests/brand/brand-capture.spec.ts)

## Open Items

- [ ] **User direction needed on BR-D-01:** Path A (revert local CTAs to green→teal `cta-gradient-from/to`) OR Path B (record blue→blue as intentional v9 redesign in DESIGN.md + Key Decision)
- [ ] Once user picks a path, either fix the CTA gradient OR update DESIGN.md tokens; re-run brand-capture to confirm
