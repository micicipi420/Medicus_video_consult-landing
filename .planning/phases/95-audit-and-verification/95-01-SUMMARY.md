# 95-01 — AUDIT-01 Lighthouse CI Summary

**Status:** complete with breach documented (waiver pending user review)
**Run date:** 2026-05-01
**Tool:** @lhci/cli v0.15.1

## Routes audited (5)

| Route | LCP (ms) | TBT (ms) | CLS | Performance | Pass? |
|-------|---------:|---------:|----:|------------:|:------|
| /                  | 3206 | 40 | 0.000 | 93/100 | LCP fail |
| /checkup           | 3267 | 42 | 0.000 | 92/100 | LCP fail |
| /consultations     | 3126 | 71 | 0.000 | 93/100 | LCP fail |
| /treatment-abroad  | 3270 | 58 | 0.000 | 92/100 | LCP fail |
| /contacts          | 3120 | 57 | 0.000 | 94/100 | LCP fail |

## Hard-Gate Status

- LCP budget (≤2500ms): FAIL on all 5 routes (range 3120-3270ms, ~25-31% over budget)
- TBT budget (≤200ms): PASS on all 5 routes (max 71ms)
- CLS budget (≤0.1): PASS on all 5 routes (0.000)
- INP budget: not measurable in synthetic Lighthouse (TBT used as proxy per AUDIT-01 spec)

**Waiver status:** 1 waiver template authored in `lighthouse/summary.md` covering all 5 LCP breaches. Recommendation: `accepted-with-mitigation` routed to Phase 94 image optimization + bundle hygiene plans. **User sign-off required before milestone v9.0.1 closeout.**

## File Inventory

- 5 HTML reports (`{slug}.report.html`)
- 5 JSON reports (`{slug}.report.json`)
- 1 summary.md
- 1 lighthouserc.json (next/lighthouserc.json)

## Config Note (deviation from plan)

Plan called for `settings.preset: "mobile"` but LHCI CLI does not accept "mobile" as a preset value (valid: `perf`, `experimental`, `desktop`). Replaced with explicit `formFactor: "mobile"` + Moto G4 `screenEmulation` + slow-4G throttling. Equivalent mobile-throttled audit; documented in `lighthouse/summary.md`.

## Open Items

- [ ] User waiver approval for 5-route LCP breach (current state: pending user review)
- [ ] After Phase 94 lands: re-run lhci autorun and verify LCP regression closed
