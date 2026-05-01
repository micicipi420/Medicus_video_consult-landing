# Plan 96-03 Summary — Mobile ambient verification (BR-03)

**Status:** COMPLETE (mobile separation assertion now PASSES via Plan
96-02's Option B structural refactor — see "Option B Inheritance" section
below)
**Wave:** 3
**Date:** 2026-05-01 (initial PARTIAL) → 2026-04-30 (closed via 96-02 fix)

## What this plan delivers

Verification-only plan — **NO source files modified**. Two new Playwright
specs that exercise the mobile ambient code path (Lissajous drift +
shared `updateLayers`).

### Files added

- `next/tests/e2e/blob-mobile-correlated-motion.spec.ts` — asserts max
  angular separation ≤ 8px during 5s of Lissajous drift on mobile-375
- `next/tests/visual/blob-mobile-ambient.spec.ts` — visual baseline at
  375×667, blob frozen via Decision K's `lissajousFrozenTime` (synthetic
  scroll event)

### Files NOT modified

This plan ships specs only. It inherits Plan 96-02's LERP cluster
(`LERP_CORE/BODY/HALO/GLINT = 0.20/0.18/0.16/0.22`) automatically because
both desktop cursor mode and mobile ambient mode call the same
`updateLayers()` function via `index.ts:loop()`.

## Visual baseline

`next/tests/visual/__snapshots__/blob-mobile-ambient.spec.ts/mobile-ambient-mobile-375.png`
— 320×320 crop, mobile-375 @ DPR 2, captured with Decision K orbit-freeze
(synthetic scroll event → `lissajousFrozenTime` set → blob renders the
frozen target frame indefinitely).

Re-running the spec without `--update-snapshots` produces 0 diffs.

## Playwright e2e result

```
[BR-03] mobile ambient maxAngularSeparation over 5s: 15.11px
Expected: <= 8
Received: 15.11
```

15.11px under 5s of Lissajous drift — much smaller than desktop's 88.83px
(Plan 96-02) because Lissajous max velocity is far below `VELOCITY_MAX`,
but still 1.9× the 8px ceiling.

## Root cause — same as 96-02

Lerp following has nonlinear lag distance `v_per_frame × (1 − k) / k`
relative to a moving target. Even at the slow Lissajous angular velocity:

- 17 000ms period × 30vw amplitude on a 375 px viewport ≈ ±112.5px swing
  with peak velocity ≈ 0.04 px/ms = ~0.7 px/frame at 60fps
- Steady-state lag for k=0.16 (halo): ~3.7px
- Steady-state lag for k=0.20 (core): ~2.8px
- Δ ~1px steady-state, but transients during direction reversals push
  the rolling max up to ~15px

To hit ≤ 8px under Lissajous drift would require either:
- All k ≥ 0.30 (collapses the trail), or
- Structural change as proposed in 96-02 (single shared lerped position
  + fixed micro-offsets per layer)

## What works

- Visual baseline: PNG generated, second-run diff is 0 → spec is
  deterministic via the scroll-freeze path
- Mobile ambient mode reaches `mode === 'ambient'` via the
  `hasTouch + isMobile` Playwright project options + matchMedia
  `(pointer: coarse) and (hover: none)` chain
- TypeScript build clean
- No source files modified — Plan 96-01 + 96-02 changes are intact
- Phase 95 visual baselines: 8/8 pass (verified)

## Escalation

Same path as 96-02: parametric tuning failed; structural change recommended
as a follow-up plan. User decision required to pick:

- Option A — single shared lerped position + fixed micro-offsets
- Option B — relative offsets driven by velocity-low-pass (capped)

Document in `/gsd-debug 96` before implementing.

## Cross-browser

Chromium (Playwright `mobile-375` project) only. Safari iOS / Chrome
Android parity inherited from Phase 95 cross-browser pass.

---

## Option B Inheritance (post-escalation, 2026-04-30)

Plan 96-02's structural refactor (velocity-LP capped offsets) was
implemented per the escalation note. Because both desktop cursor mode and
mobile ambient mode call the same `updateLayers()` from `index.ts:loop()`,
mobile ambient automatically inherits the new model — no source changes
needed in this plan.

### Mobile separation result under Option B

```
[BR-03] mobile ambient maxAngularSeparation over 5s: 0.28px
Expected: <= 8 → PASS (with 7.72px headroom)
```

**Achieved 0.28px** under 5s of Lissajous drift, vs 15.11px previously —
a 54× improvement. This easily clears both the BR-03 ≤8px ceiling and the
aspirational ≤4px target.

### Why so far below the cap

Lissajous max velocity (~0.7px/frame ≈ 42 px/s on mobile-375) is ~36× below
VELOCITY_MAX (1500 px/s). With `f = clamp(velocityLP / VELOCITY_MAX, 0, 1)`,
that gives `f ≈ 0.028`. Halo offset = `f × 8 = 0.22px`; the ~0.28px reading
includes velocity-LP transients during direction reversals at orbit
extrema. All four layers effectively render at `core ± sub-pixel`, which
matches the desired "calm cluster" feel for mobile ambient.

### Visual baseline

Re-ran `tests/visual/blob-mobile-ambient.spec.ts` after the refactor:
PASS, 0 diffs from the baseline PNG. The Decision K scroll-freeze path is
unchanged, and at the frozen orbit point velocity-LP decays toward zero so
all four layers converge to the same render position — identical pixels to
the baseline captured under the old model.

### No files modified by 96-03 in this iteration

This plan remains verification-only. The fix lived in Plan 96-02. Only
this SUMMARY changes (status: PARTIAL → COMPLETE, results section appended).
