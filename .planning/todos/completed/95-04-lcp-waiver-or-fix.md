---
title: LCP waiver or image/bundle perf fix (5 routes 3120-3270ms vs 2500ms budget)
created: 2026-05-01
priority: high
context: Phase 95 AUDIT-01 found all 5 routes fail Lighthouse mobile LCP budget
severity: major
---

# LCP fail across all 5 routes — Phase 95 AUDIT-01

`pnpm exec lhci autorun` (mobile-throttled, slow-4G + 4×CPU) measured LCP **3120–3270ms** on every public route — well over the 2500ms v9.0.1 budget.

| Route | LCP (ms) | TBT (ms) | CLS |
|---|---:|---:|---:|
| / | 3206 | 40 | 0.000 |
| /checkup | 3267 | 42 | 0.000 |
| /consultations | 3126 | 71 | 0.000 |
| /treatment-abroad | 3270 | 58 | 0.000 |
| /contacts | 3120 | 57 | 0.000 |

**TBT, CLS, INP all PASS.** Only LCP is the issue — image/bundle hygiene is the likely lever.

## Likely culprits (investigate before fixing)

1. **Hero photos** — `next/public/` likely has unoptimized JPGs. Check sizes, consider `next/image` (Image Optimization route), AVIF/WebP conversion.
2. **Above-the-fold blob renderer** — `LivingBlobField` is dynamic-imported but the boot may still block paint.
3. **Font loading** — Inter/Manrope self-hosted via `next/font` should be fast, but verify subset/display swap settings.
4. **Bundle size** — 1849-module compile suggests dependency bloat. Run `pnpm build --analyze` for treemap.
5. **Server response** — Vercel/Node SSR may be slow under throttling; check TTFB.

## Two paths

### Path A: Fix the LCP (recommended)

Spawn a focused phase (e.g. v9.0.2 Phase 98 — Performance Polish) with 2-3 plans:
- Plan 1: Image audit + `next/image` migration on hero photos (4 routes)
- Plan 2: Bundle audit + dynamic-import cleanup on heavy below-fold components
- Plan 3: Re-run Lighthouse, expect LCP <2500ms across all routes

### Path B: Document waiver

If LCP can't realistically hit 2500ms on this content (e.g., hero photos are non-negotiable), document the waiver in `95-VERIFICATION.md` with concrete rationale and a relaxed budget (e.g., LCP ≤3500ms with note "hero photo size required for medical-trust visual"). Per ROADMAP hard-gate posture: waiver requires explicit user sign-off.

## Recommendation

Path A — LCP 3120-3270ms is genuinely slow for users on mid-range mobile. Fix it in v9.0.2 before milestone closeout. Image optimization is well-trodden territory; should be 1-2 day investment.

## Defer until

User confirms Path A vs B. If A: spawn /gsd-plan-phase 98 with this todo as input.
