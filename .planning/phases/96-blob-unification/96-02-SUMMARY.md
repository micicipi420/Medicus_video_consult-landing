# Plan 96-02 Summary — Correlated motion (BR-02)

**Status:** PARTIAL (parametric tuning did not reach the 8px ceiling under
1500ms diagonal sweep — escalation path documented below)
**Wave:** 2
**Date:** 2026-05-01

## What changed

### LERP cluster tuning (`physics.ts`)

| Layer | Before | After  | Ratio (vs core) before | Ratio after |
|-------|--------|--------|------------------------|-------------|
| core  | 0.18   | 0.20   | 1.0×                   | 1.0×        |
| body  | 0.08   | 0.18   | 2.25× spread           | 1.11×       |
| halo  | 0.04   | 0.16   | 4.50× spread           | 1.25×       |
| glint | (none — locked to core) | 0.22 | n/a | 1.10× lead |

`updateLayers` signature extended: now accepts a 4th `glint: LayerPos` and
applies `LERP_GLINT` to it. Glint was previously hard-locked to `core.x/y`
in the renderer.

### Debug instrumentation (`debug.ts`)

`window.__blobDebug` (dev-only, NODE_ENV-guarded) now exposes:

- `core`, `body`, `halo`, `glint` — `{x, y}` snapshots per frame
- `maxAngularSeparation: number` — rolling max pairwise distance across 4
  sublayers (6 pairs)
- `resetMaxSeparation: () => void` — Playwright zeros this before each sweep

`attachDebug()` signature changed: takes a 2nd argument `resetMaxSeparation`.

### Engine wiring (`index.ts`, `canvas-renderer.ts`, `globals.css`)

- `EngineState`: + `glint: LayerPos` and `maxAngularSeparation: number`
- `loop()`: passes glint to `updateLayers`; computes 6-hypot pairwise max
  separation per frame; updates rolling max
- CSS-var writes: `--blob-glint-x` / `--blob-glint-y` per frame
- `globals.css`: defaults `--blob-glint-x: 50vw; --blob-glint-y: 50vh;`
  added right after `--blob-halo-y`
- `DrawState`: + `glint: LayerPos`
- `drawFrame`: reads `glint.x/y` for `drawGlint` (was `core.x/y`)

## Playwright verification

`next/tests/e2e/blob-correlated-motion.spec.ts` — drives a 1500ms diagonal
sweep across the 1280x800 viewport at ~918 px/s (60 mouse moves at 50ms
intervals — 30 forward, 30 reverse), then reads
`window.__blobDebug.maxAngularSeparation`.

### Result

```
[BR-02] maxAngularSeparation under 1500ms diagonal sweep: 88.83px
Expected: <= 8
Received: 88.83
```

Result: **88.83px max separation under fast sweep** — 11x the 8px ceiling.

## Why parametric tuning fell short

Lerp-only following has a steady-state lag distance per layer of
`v_per_frame * (1 - k) / k` against a target moving at constant velocity.
At ~24 px/frame (1500 px/s ÷ 60fps):

- core (k=0.20):  24 × (1 − 0.20) / 0.20 ≈ 96px lag
- halo (k=0.16):  24 × (1 − 0.16) / 0.16 ≈ 126px lag
- glint (k=0.22): 24 × (1 − 0.22) / 0.22 ≈ 85px lag
- Δ(core, halo) ≈ 30px steady-state, transients much higher

The "1.25× ratio" intuition assumed the LERP ratio translates linearly to
distance ratio, but lag distance is `(1 − k)/k` which is nonlinear: 0.20 →
4.0 lag-units, 0.16 → 5.25 lag-units. The 31% lag gap, multiplied by 24
px/frame at peak velocity, produces tens of pixels of separation.

To hit ≤ 8px under 1500 px/s with simple lerp:
- All layers k ≥ 0.6 — collapses the trail entirely (no organic feel)
- Or: lower the ceiling to a slower sweep (e.g. ≤ 300 px/s)
- Or: structural change — share a single position and offset glint/halo
  via a fixed dx/dy rather than independent lerps

## Escalation per ROADMAP

Per the plan's pre-approved fallback ("If achieved max separation is >8px
despite these values, escalate"): mark **plan PARTIAL**, propose structural
change as a follow-up.

### Proposed follow-up (NOT done in this plan)

Option A — single shared lerped position with rendering offsets:
  - One shared `s.position: LayerPos` lerped with k=0.20
  - body/halo/glint render at `position.x ± dx_layer` where dx is a fixed
    micro-offset (e.g. 0–4px) computed from velocity direction
  - Pro: separation bounded by dx_layer, decoupled from speed
  - Con: loses the "trail" feel that gave organic life to the multi-lerp

Option B — relative offsets driven by a velocity-low-pass:
  - Keep core lerped (k=0.20)
  - body/halo/glint = core + offset_layer × (cap | velocity / VELOCITY_MAX)
  - cap_body = 6px, cap_halo = 8px, cap_glint = 4px
  - Pro: preserves organic feel at low velocity, caps separation at high

User decision required to pick A vs B; document in a fresh /gsd-debug 96
session before implementing.

## What works as designed

- Phase 95 visual baselines: 8/8 pass (blob is masked in `baseline.spec.ts`)
- Plan 96-01 halo feather snapshots: 2/2 pass (static-mode determinism)
- TypeScript build: clean (`pnpm tsc --noEmit`)
- `__blobDebug.glint` returns `{x, y}` in dev console
- `__blobDebug.maxAngularSeparation` is a live, growing number under motion
- `__blobDebug.resetMaxSeparation()` zeroes it
- Subjective feel under slow / normal cursor motion: noticeably more
  unified than 0.18/0.08/0.04 — the "halo lags way behind" sensation is
  gone for typical cursor speeds (≤ 600 px/s)

## Cross-browser notes

Chromium baseline only per playwright.config.ts. Safari / Firefox parity
inherited from Phase 95 cross-browser pass.

## Production tree-shake

`debug.ts` is wrapped in `process.env.NODE_ENV !== 'production'`. Next.js
DefinePlugin replaces this with `false` at build time → entire module is
dead code. Not re-verified in this plan since attach/detach guards are
unchanged from Phase 91 Plan 05.

## Files changed (committed)

- `next/src/lib/blob-engine/physics.ts`
- `next/src/lib/blob-engine/debug.ts`
- `next/src/lib/blob-engine/index.ts`
- `next/src/lib/blob-engine/canvas-renderer.ts`
- `next/src/app/globals.css`
- `next/tests/e2e/blob-correlated-motion.spec.ts` (new — currently failing
  by design at 88px > 8px ceiling)
