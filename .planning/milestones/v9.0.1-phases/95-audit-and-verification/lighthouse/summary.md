# AUDIT-01 — Lighthouse CI Summary

**Run date:** 2026-05-01
**Tool:** @lhci/cli v0.15.1 (lhci autorun)
**Form factor:** mobile (Moto G4 viewport 360×640, deviceScaleFactor 2, 4× CPU slowdown, slow 4G throttling 1638kbps / 150ms RTT)
**Number of runs per route:** 3 (representative/median run reported)
**Build:** production (`pnpm start --port 3101` against pre-built `next build`)
**Commit SHA:** 360196468bacd1918248a9bf127f3af20691f5e2

> Note: lighthouserc.json originally specified `preset: "mobile"` but the LHCI CLI rejected that value (valid presets: `perf`, `experimental`, `desktop`). Mobile is Lighthouse's default form factor; replaced the preset with explicit `formFactor: "mobile"` + Moto G4 `screenEmulation` + slow-4G `throttling` to match the AUDIT-01 spec. This produces equivalent mobile-throttled audits.

## Budget Gates (AUDIT-01 requirement)

| Metric | Budget | Source |
|--------|--------|--------|
| LCP    | ≤2500ms | AUDIT-01 |
| INP    | ≤200ms (TBT proxy in synthetic LH) | AUDIT-01 |
| CLS    | ≤0.1   | AUDIT-01 |
| TBT    | ≤200ms | AUDIT-01 |

## Per-Route Results (representative run)

| Route | LCP (ms) | TBT (ms) | CLS | FCP (ms) | TTI (ms) | Performance | Pass? |
|-------|---------:|---------:|----:|---------:|---------:|------------:|:------|
| /                  | 3206 | 40 | 0.000 | 1258 | 3327 | 93/100 | LCP fail |
| /checkup           | 3267 | 42 | 0.000 | 1217 | 3267 | 92/100 | LCP fail |
| /consultations     | 3126 | 71 | 0.000 | 1208 | 3272 | 93/100 | LCP fail |
| /treatment-abroad  | 3270 | 58 | 0.000 | 1208 | 3270 | 92/100 | LCP fail |
| /contacts          | 3120 | 57 | 0.000 | 1058 | 3120 | 94/100 | LCP fail |

LCP fails the 2500ms budget on all 5 routes (range: 3120ms — 3270ms, ~25-31% over budget). TBT and CLS pass on all 5 routes. Performance score 92-94/100 across the board.

All values extracted from `{slug}.report.json` → `audits['largest-contentful-paint'].numericValue` etc. Median selected from the LHCI manifest's `representative` flag across the 3 runs.

## Waivers — pending user review

### Waiver 1 — All 5 routes: LCP 3120-3270ms > 2500ms budget

**Rationale (proposed, pending user approval):** All 5 routes fail LCP by ~25-31%. Probable root causes:
- Hero hero-image loads (next/image with priority — likely the LCP element). Mobile slow-4G + 4× CPU throttle is harsh; FCP is 1058-1258ms (good), but the hero image then takes the LCP slot.
- This is the **un-polished v9.0 baseline** the audit explicitly targets per ROADMAP cross-phase note. Phase 94 (running in parallel worktree) has POL-01..05 plans that touch exactly this surface (hero image optimization + bundle-size hygiene).

**Mitigation route:** Phase 94 POL-NN plans address image optimization and route-segment lazy-loading. Re-run AUDIT-01 after Phase 94 lands; expected LCP improvement bringing routes under 2500ms.

**Approver:** pending user review

**Recommendation:** Mark as `accepted-with-mitigation` since (a) every route fails consistently (not a single-route regression), (b) the failure mode is well-understood (slow-4G mobile LCP for hero images), (c) Phase 94 has the remediation in flight, and (d) milestone v9.0.1's stated goal includes performance polish in Phase 94.

### TBT/CLS Pass

TBT (max 71ms on /consultations) and CLS (0.000 on every route) pass cleanly. No waivers needed for those metrics.

## Hard-Gate Status

- [ ] All 5 routes pass budgets — NOT MET: LCP fails on all 5 routes
- [ ] All breaches have explicit waivers approved by user — PENDING: 1 waiver template authored, awaiting user sign-off

If neither bullet is checked, milestone v9.0.1 closeout is BLOCKED.

## Hard-Gate Posture (Anti-Cheat-Pass)

This summary documents the LCP breach with concrete numerical evidence per route (no `TBD`, no rounding-to-pass, no skipped routes). The thresholds in `lighthouserc.json` were NOT relaxed. Remediation routes through Phase 94, not through silent threshold-loosening.

## Files

- `index.report.html` / `index.report.json`
- `checkup.report.html` / `checkup.report.json`
- `consultations.report.html` / `consultations.report.json`
- `treatment-abroad.report.html` / `treatment-abroad.report.json`
- `contacts.report.html` / `contacts.report.json`
- `summary.md` (this file)
