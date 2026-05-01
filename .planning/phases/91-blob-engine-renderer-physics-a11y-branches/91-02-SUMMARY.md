---
phase: 91-blob-engine-renderer-physics-a11y-branches
plan: 02
subsystem: engine
tags: [singleton, raf, pointermove, page-visibility, canvas-2d, blob-engine, v9.0, living-blob]

# Dependency graph
requires:
  - phase: 91-blob-engine-renderer-physics-a11y-branches
    provides: "Plan 01 — canvas mounted as 5th child of .living-blob-field; stub engine; blob.css canvas visibility rules"
provides:
  - "Module singleton EngineState with refcount + AbortController + rAF loop + pointer listener + visibilitychange + resize handler"
  - "canvas-renderer.ts pure draw module — resizeCanvas (DPR cap 2), readColors, drawFrame orchestrator, 4 sublayer helpers using createRadialGradient"
  - "8 CSS vars written to :root each frame via documentElement.style.setProperty"
  - "TZ §17 lerp factors locked: LERP_CORE=0.18, LERP_BODY=0.08, LERP_HALO=0.04"
  - "Page Visibility integration — rAF cancelled on document.hidden, restored on visible"
  - "Decision M canvas-init failure graceful fallback (console.warn + data-blob-mode='static' + no-op cleanup)"
affects: [phase-91-plan-03, phase-91-plan-04, phase-91-plan-05, phase-92-glass-heat-leak]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Module singleton via top-level let state: EngineState | null"
    - "Refcount idiom: if (state) { state.refcount++; return makeStopFn(); } else initialize"
    - "AbortController.signal passed to ALL addEventListener calls — atomic teardown"
    - "Pointer-ref-write + rAF-read coalescing pattern (lifted from useSpecularHighlight.ts hook scope to module scope)"
    - "DPR cap 2 via Math.min(window.devicePixelRatio || 1, 2) for canvas backing store"
    - "Cached color tokens via getComputedStyle — read once, re-read on theme change (Plan 04 hook)"

key-files:
  created:
    - "next/src/lib/blob-engine/canvas-renderer.ts (Canvas 2D draw module — 129 lines)"
  modified:
    - "next/src/lib/blob-engine/index.ts (stub → full singleton — 186 lines added, 10 removed; net +176)"
  deleted: []

key-decisions:
  - "Lerp helper inlined in index.ts for Plan 02; Plan 03 will lift to physics.ts and remove the inline definition"
  - "state.mode hardcoded to literal 'cursor' type in Plan 02; Plan 04 widens to BlobMode union (forward-compat field)"
  - "Heat/velocity stubbed at 0 in Plan 02; Plan 03 wires real math via updateHeat() and updateVelocity() called between lerp block and CSS-var-write block"
  - "Resize debounce 250ms (chosen for legibility of viewport changes; 100ms would also be fine)"
  - "Visibility resume preserves last frame (no clearRect) to avoid flash"

patterns-established:
  - "Engine module exports a single startBlobEngine API; component (LivingBlobField.tsx) is thin React shell calling it in useEffect"
  - "All listener attaches use { signal: abort.signal } so abort.abort() removes them atomically"
  - "Pointer event handler is ≤4 lines — only mutates pointer ref; all math in rAF body (PITFALLS 1.4)"

requirements-completed: [BLOB-02, BLOB-03, BLOB-11]

# Metrics
duration: ~5min
completed: 2026-04-30
---

# Phase 91 Plan 02 Summary — Engine Singleton + rAF + Renderer + Page Visibility

**Module singleton with refcount + AbortController shipped; single rAF loop draws 4 Canvas 2D sublayers each frame; pointermove listener and Page Visibility handler attached via AbortController.signal; 8 CSS vars written to :root each frame; LERP factors LOCKED per TZ §17.**

## Final EngineState shape

Plans 03 + 04 will EXTEND this interface (add velocity tracker fields, mode union, motionEnabled flag, scrollPaused, dwellMs):

```ts
interface EngineState {
  refcount: number;
  rafId: number | null;
  abort: AbortController;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  parent: HTMLElement;
  colors: BlobColors;
  viewport: { width: number; height: number };
  pointer: PointerRef;            // { x, y, lastX, lastY, lastT }
  core: LayerPos;                 // { x, y } in CSS px, lerped each frame
  body: LayerPos;
  halo: LayerPos;
  heat: number;                   // Plan 03 makes real
  velocity: number;               // Plan 03 makes real
  mode: 'cursor';                 // Plan 04 widens
  startedAt: number;
  frameCount: number;
}
```

## Locked Constants (verbatim — DO NOT MODIFY without phase replan)

```ts
const LERP_CORE = 0.18;   // TZ §17 — core catches up fastest
const LERP_BODY = 0.08;   // TZ §17 — body trails noticeably
const LERP_HALO = 0.04;   // TZ §17 — halo most viscous
```

DPR cap (Decision B): `Math.min(window.devicePixelRatio || 1, 2)` in `resizeCanvas`.

Resize debounce: 250ms (chosen value within typical 100-300ms range).

## Stubs Plans 03 + 04 will replace

| Stub | Plan owner | Replacement |
|------|------------|-------------|
| `state.heat = 0` (always) | 91-03 | `updateHeat(state, deltaTime, motionEnabled)` math from physics.ts |
| `state.velocity = 0` (always) | 91-03 | `updateVelocity(state, performance.now())` low-pass filter from physics.ts |
| Inline `lerp` helper | 91-03 | `import { lerp } from './physics'`; remove inline definition |
| `state.mode = 'cursor'` hardcoded | 91-04 | `resolveMode()` from modes.ts; widens type to `BlobMode` union |
| Pointer position used as lerp target unconditionally | 91-04 | Mode-dependent target via `getTargetPosition(state)` (cursor/Lissajous/static) |
| No matchMedia listeners | 91-04 | `attachModeListeners(state)` adds 3× matchMedia + MutationObserver + pointerout/pointerover |
| No mobile tap-pulse | 91-04 | `attachMobileListeners(state)` |
| No scroll-pause | 91-04 | scroll listener with 250ms debounce |
| No dark-theme dimming hook | 91-04 | mode resolver re-reads colors on theme change |

## Acceptance Criteria — All Pass

| Gate | Result |
|------|--------|
| Single pointermove listener in `next/src/lib/blob-engine/` | ✓ 1 |
| `requestAnimationFrame(` count in `index.ts` | ✓ 3 (init + visibility resume + loop tail) |
| `requestAnimationFrame(` count in `canvas-renderer.ts` | ✓ 0 |
| `LERP_CORE = 0.18` literal | ✓ match |
| `LERP_BODY = 0.08` literal | ✓ match |
| `LERP_HALO = 0.04` literal | ✓ match |
| `passive: true` on pointermove (line 137) | ✓ confirmed |
| `documentElement.style.setProperty` count | ✓ 8 (8 CSS vars) |
| `refcount` references | ✓ 6 |
| `AbortController` references | ✓ 2 |
| `visibilitychange` references | ✓ 1 |
| `cancelAnimationFrame` references | ✓ 2 |
| Layout-prop reads (`getBoundingClientRect/offsetWidth/offsetHeight`) | ✓ 0 |
| React hooks (useState/useReducer/useRef/useEffect/useLayoutEffect) | ✓ 0 |
| `cd next && pnpm build` | ✓ exit 0, 11/11 routes, zero new warnings |
| Frozen ranges (liquid-glass.css, globals.css, useSpecularHighlight.ts, SvgRefractionDefs.tsx, DESIGN.md, blob.css, layout.tsx, package.json, pnpm-lock.yaml) | ✓ all byte-equivalent |
| TypeScript clean | ✓ no errors |

## Threat Model Coverage

- **T-91-01 (cross-route rAF leak):** mitigated. Module singleton refcount + RootLayout-never-unmounts means refcount stays at 1 across navigations; manual gate verifies via runtime listener count.
- **T-91-02 (Strict Mode double-bind):** mitigated. Refcount sequence 0→1→0→1 absorbs Strict Mode's setup→cleanup→setup cycle; AbortController.abort() is idempotent.
- **T-91-05 (console pollution):** accepted. One `console.warn` line in Decision M canvas-failure path; eslint-disable pinned to that line. Build remains warning-free.

T-91-03 (CTA tap-pulse exclusion) and T-91-04 (a11y branch attestation) are Plan 04 territory.

## Pending Orchestrator Attestation

Manual checkpoint Task 3 — orchestrator (main Claude session, not sub-agent) will Playwright-verify after all 5 plans ship. Diagnostic data needed:

1. `cd next && pnpm dev` — open `http://localhost:3000/` in Playwright
2. Confirm cursor-follow visual: blob green gradient follows pointer with visible viscous lag
3. DevTools/Playwright assertion: `getComputedStyle(document.documentElement).getPropertyValue('--blob-x')` updates in real time
4. After 5-route navigation cycle (`/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`): listener count = 1 and rAF count = 1 (Plan 05 codifies via `__blobDebug.rafCount`)
5. Page Visibility: switch tab away/return — frame count increments after return only
6. Resize: viewport change re-sizes canvas backing store after ~250ms debounce
7. Decision M: simulate `getContext('2d') === null` → console.warn + `data-blob-mode='static'` + sublayers visible
8. Frozen files unchanged

Orchestrator will run all 7 checks via Playwright in a single batch after Wave 5 completes.

## Forward Contract for Plan 03

Plan 03 (physics.ts + heat/velocity wiring) replaces these stubs in index.ts:

1. `state.heat = 0` and `state.velocity = 0` initial values stay (correct initial state)
2. Inline `lerp` function — Plan 03 lifts to `physics.ts`, removes inline definition, adds `import { lerp } from './physics'`
3. Insert calls in `loop()` BETWEEN the lerp block (lines ~159-164) and the CSS-var write block (lines ~170-178):
   ```ts
   const now = performance.now();
   updateVelocity(state, now);
   updateHeat(state, now /* deltaTime computed inside */, /* motionEnabled = */ true);
   ```
4. Add fields to `EngineState`: `dwellStart: number`, `lastFrameAt: number` (for deltaTime)
5. New constants imported from physics.ts: DWELL_THRESHOLD=30, DWELL_WINDOW=250, HEAT_RAMP_MS=2000, HEAT_DECAY_MS=800, HEAT_PEAK_LUMINANCE_MULT=1.4, HEAT_PEAK_SCALE_MULT=1.4, VELOCITY_ALPHA=0.15

Plan 04 then layers mode resolution + Lissajous + a11y branches on top of Plan 03's real physics.

## Files Touched

- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/canvas-renderer.ts` (NEW, 129 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/index.ts` (REWRITTEN, +186/-10 net +176)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/91-blob-engine-renderer-physics-a11y-branches/91-02-SUMMARY.md` (NEW — this file)
