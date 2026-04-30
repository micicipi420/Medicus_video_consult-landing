---
phase: 91-blob-engine-renderer-physics-a11y-branches
plan: 03
subsystem: engine-physics
tags: [physics, heat-accumulator, velocity-tracker, lerp, blob-engine, v9.0, living-blob]

requires:
  - phase: 91-blob-engine-renderer-physics-a11y-branches
    provides: "Plan 02 — engine singleton + rAF loop + pointer ref + 8 CSS vars; heat/velocity stubbed at 0"
provides:
  - "physics.ts pure-math module: 14 LOCKED constants + 5 pure functions (lerp, updateLayers, updateVelocity, updateHeat, applyTapPulse)"
  - "Heat accumulator integrated into loop() — ramps over ~2s on cursor dwell, decays over ~800ms on motion resume"
  - "Velocity tracker integrated into loop() — low-pass filter α=0.15 yields smoothed px/s value 0..1500"
  - "EngineState extended: dwellSamples (pruned to 250ms window), lastFrameAt (deltaTime source), lastTapAt (Plan 04 mobile rate-limit seam)"
affects: [phase-91-plan-04, phase-91-plan-05, phase-92-glass-heat-leak]

tech-stack:
  added: []
  patterns:
    - "Pure-math module pattern — no DOM/window/performance access; all state passed via parameters"
    - "Low-pass velocity filter: velocity ← velocity*(1-α) + new*α with clamp [0, 1500]"
    - "Dwell-window heat accumulator: linear ramp toward 1 (deltaTime/RAMP_MS) when stillness detected; ease-out decay when motion (deltaTime/DECAY_MS)"
    - "Module-scope LOCKED constants exposed via export const for future Phase 92 in-browser tuning"

key-files:
  created:
    - "next/src/lib/blob-engine/physics.ts (153 lines)"
  modified:
    - "next/src/lib/blob-engine/index.ts (+34 lines net, removed inline LERP_*, added physics imports + EngineState fields + loop() rewrite)"
  deleted: []

key-decisions:
  - "motionEnabled hardcoded to true in Plan 03 — Plan 04 will replace with mode-resolved boolean (mode === 'cursor' || mode === 'ambient')"
  - "Dwell distance computed as max pairwise distance from oldest sample to subsequent samples — conservative; alternative (max distance over all pairs) would be O(n²) with no behavioural improvement at 60fps × 250ms window (≤15 samples)"
  - "Heat clamping is explicit { if (next < 0) next = 0; if (next > 1) next = 1 } — readable and inlineable"

requirements-completed: [BLOB-04, BLOB-05]

duration: ~10min (incl. resume from mid-edit context loss)
completed: 2026-04-30
---

# Phase 91 Plan 03 Summary — Physics Module + Engine Integration

**physics.ts shipped with all 14 LOCKED constants verbatim and 5 pure functions; index.ts loop() now invokes updateLayers + updateVelocity + updateHeat between target compute and CSS-var write; heat ramps on dwell, decays on motion, velocity tracks 0..1500 px/s with low-pass smoothing.**

## All 14 LOCKED Constants — Verbatim Confirmed

| Constant | Value | Source |
|----------|-------|--------|
| `LERP_CORE` | 0.18 | TZ §17 / Decision D |
| `LERP_BODY` | 0.08 | TZ §17 / Decision D |
| `LERP_HALO` | 0.04 | TZ §17 / Decision D |
| `VELOCITY_ALPHA` | 0.15 | Decision D |
| `VELOCITY_MAX` | 1500 | Decision D |
| `DWELL_THRESHOLD` | 30 | Decision E |
| `DWELL_WINDOW` | 250 | Decision E |
| `HEAT_RAMP_MS` | 2000 | Decision E (within TZ §7 1.5-3s envelope) |
| `HEAT_DECAY_MS` | 800 | Decision E (within TZ §7 ≥600ms) |
| `HEAT_PEAK_LUMINANCE_MULT` | 1.4 | TZ §7 ceiling |
| `HEAT_PEAK_SCALE_MULT` | 1.4 | TZ §7 ceiling |
| `TAP_PULSE_HEAT` | 0.7 | Decision F |
| `TAP_PULSE_DECAY_MS` | 380 | Decision F (within TZ §14 ≤400ms cap) |
| `TAP_PULSE_RATE_LIMIT_MS` | 600 | Decision F |

## Plan 03 motionEnabled Hardcode — Plan 04 Replacement Seam

`loop()` currently has:
```ts
const motionEnabled = true;
```

Plan 04 replaces with:
```ts
const motionEnabled = state.mode === 'cursor' || state.mode === 'ambient';
```

(`'static'`, `'hidden'`, `'dark'` modes all set `motionEnabled = false` so heat permanently 0.)

## Acceptance Criteria — All Pass

| Gate | Result |
|------|--------|
| `from './physics'` import | ✓ 1 |
| updateLayers/Velocity/Heat refs in index.ts | ✓ 7 |
| dwellSamples refs | ✓ 3 |
| lastFrameAt refs | ✓ 4 |
| deltaTime refs | ✓ 3 |
| Inline LERP_* constants in index.ts (should be 0) | ✓ 0 |
| Single pointermove listener | ✓ 1 |
| setProperty count | ✓ 8 |
| refcount references | ✓ 6 |
| AbortController | ✓ 2 |
| visibilitychange | ✓ 1 |
| Layout reads (getBoundingClientRect/offsetWidth/offsetHeight) | ✓ 0 |
| All 14 LOCKED constants verbatim in physics.ts | ✓ 14/14 |
| 5 export functions in physics.ts | ✓ 5 |
| DOM/window/perf refs in physics.ts (should be 0; comment word "window" excluded) | ✓ 0 (1 false positive in JSDoc) |
| `cd next && pnpm build` | ✓ exit 0, 11/11 routes |
| Frozen ranges (10 files) | ✓ all byte-equivalent |
| TypeScript clean | ✓ no errors |

## Threat Model — Plan 02 mitigations preserved; no new threats

- physics.ts is pure functions over plain values — cannot introduce attack surface
- Plan 02 T-91-01 (rAF leak) and T-91-02 (Strict Mode) mitigations carry forward unchanged

## Pending Orchestrator Attestation

Manual smoke gates (orchestrator runs via Playwright after Wave 5):
1. Park cursor 2s on `/` → `--blob-heat` ≥ 0.8 (BLOB-04 ramp)
2. Resume motion → `--blob-heat` < 0.1 within 1s (BLOB-04 decay)
3. Fast cursor sweep → `--blob-velocity` 200-1500 (BLOB-05 tracker)
4. Heat clamping: 10s+ dwell → heat ≤ 1.0 (no overshoot)
5. Plan 02 invariants preserved: single listener, single rAF, route navigation leak-free

## Forward Contract for Plan 04

Plan 04 (modes.ts + lissajous.ts + dark theme dimming + manual a11y attestation) replaces:

1. `motionEnabled = true` hardcode → `state.mode === 'cursor' || state.mode === 'ambient'`
2. `target = { x: state.pointer.x, y: state.pointer.y }` → mode-dependent target via `getTargetPosition(state)`:
   - `cursor` mode: pointer position
   - `ambient` mode: Lissajous orbit at `lissajousAt(now)`
   - Pointer-leave decay: `lerp(lastPointer, lissajousAt, easeOutCubic(decay))` for 800ms
3. Adds matchMedia listeners + MutationObserver + pointerout/pointerover for mode resolution
4. Adds mobile tap-pulse listeners (uses `state.lastTapAt` from Plan 03)
5. Adds scroll listener with 250ms debounce for mobile scroll-pause
6. Appends dark-theme dimming rule to `blob.css` (opacity 0.30, saturate 0.65, follow disabled)

The seam is `state.mode` (currently typed as `'cursor'` literal) — Plan 04 widens to union.

## Files Touched

- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/physics.ts` (NEW, 153 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/index.ts` (+188/-34 net +154)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/91-blob-engine-renderer-physics-a11y-branches/91-03-SUMMARY.md` (NEW)
