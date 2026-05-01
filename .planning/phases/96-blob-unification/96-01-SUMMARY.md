# Plan 96-01 Summary — Halo edge feathering (BR-01)

**Status:** complete
**Wave:** 1
**Date:** 2026-05-01

## What changed

Single-function edit in `next/src/lib/blob-engine/canvas-renderer.ts:drawHalo`:

### Before (3-stop hard transition)
```typescript
const baseRadius = 300 + 100 * heat;
const radius = baseRadius * (1 + Math.min(0.6, velocity / 1500));
const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
grad.addColorStop(0, haloColor);
grad.addColorStop(0.7, edgeColor);
grad.addColorStop(1, 'rgba(0,0,0,0)');
```

### After (4-stop feather + extended radius)
```typescript
// Phase 96 BR-01: extended baseRadius from 300 -> 360 to give the outer
// alpha falloff ~20% more room to die smoothly (max ~580px at full heat
// + max velocity stretch).
const baseRadius = 360 + 100 * heat;
const radius = baseRadius * (1 + Math.min(0.6, velocity / 1500));
const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
// Phase 96 BR-01: 4-stop feather to eliminate visible halo edge ring.
grad.addColorStop(0.00, haloColor);
grad.addColorStop(0.35, haloColor);
grad.addColorStop(0.65, edgeColor);
grad.addColorStop(1.00, 'rgba(0,0,0,0)');
```

Other layers (drawBody / drawCore / drawGlint / drawFrame / resizeCanvas /
readColors) are unchanged — verifiable via `git diff` showing drawHalo-only
delta.

## New tests

`next/tests/visual/blob-halo-feather.spec.ts` — 2 cases (desktop @ 2x zoom,
mobile-375). Uses `reducedMotion: 'reduce'` + explicit `page.emulateMedia` in
beforeEach to lock the engine into `'static'` mode (per Phase 93 finding F1:
`__blobDebug.setMode` is read-only, so the documented fallback is media
emulation).

Determinism note: each test gates on the project name via `test.skip` so the
desktop-cropped test does not run in the mobile-375 project and vice versa.

## Baselines committed

- `next/tests/visual/__snapshots__/blob-halo-feather.spec.ts/halo-feather-desktop-zoom2x-desktop.png` — 400×400 crop, desktop @ 2x zoom
- `next/tests/visual/__snapshots__/blob-halo-feather.spec.ts/halo-feather-mobile-mobile-375.png` — 320×320 crop, mobile-375 @ DPR 2

## Verification

- `pnpm tsc --noEmit` clean
- `pnpm exec playwright test visual/blob-halo-feather` — 2/2 pass (post-baseline)
- `pnpm exec playwright test visual/baseline` — 8/8 pass (Phase 95 baselines unaffected, blob is masked there)

## User-judgment notes

Subjective desktop-zoom verification deferred to user; baseline PNG captured
for reference. The 4-stop chain holds the inner color longer (0 -> 0.35 same
alpha) and inserts the edge token at the mid-feather (0.65) so the gradient
reads as continuous alpha falloff at any zoom level.

Cross-browser: Chromium baseline only per playwright.config.ts. Safari /
Firefox parity left for Phase 95 cross-browser pass.
