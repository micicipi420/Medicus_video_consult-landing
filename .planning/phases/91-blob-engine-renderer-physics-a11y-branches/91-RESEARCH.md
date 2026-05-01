# Phase 91: Blob Engine — Research

**Researched:** 2026-04-30
**Domain:** Canvas 2D animation engine, React 19 + Next.js 15 App Router lifecycle, accessibility media-query plumbing, runtime CSS-var IPC
**Confidence:** HIGH

## Summary

Phase 91 generalises the proven internal `useSpecularHighlight.ts` pattern (single-listener + single-rAF + CSS-var-write) to module scope, adds Canvas 2D rendering of 4 sublayers, and wires 5 a11y/theme branches with a singleton refcount that survives React 19 Strict Mode double-invocation and Next.js 15 App Router shared-layout navigation. All 13 architectural decisions (A–M) are locked in `91-CONTEXT.md`; this research focuses on the **executable mechanics** for each new file plus the validation strategy for the Nyquist gate.

Three external claims are verified in this session: (1) Next.js 15 App Router root layouts do not re-render on client-side navigation, so a global `useEffect` in a layout-mounted component runs cleanup only on full page load — confirmed by the official `layout.js` API reference. (2) React 19 Strict Mode runs `setup → cleanup → setup` once on dev mount, so any global side effect must be idempotent — confirmed by the official `<StrictMode>` reference. (3) `requestAnimationFrame` auto-pauses on `document.hidden` and auto-resumes on visible — confirmed by MDN Page Visibility API docs.

**Primary recommendation:** Implement `startBlobEngine()` as a module-singleton with refcount + `AbortController` (Decision A/C) — the React shell becomes a 25-line `useEffect` that calls `startBlobEngine()` and toggles `data-engine-active` on the parent ref. All physics math in `physics.ts` operates on a single mutable state object held in module closure; no React state, no Context. Validation Architecture lives entirely in static-grep + dev `__blobDebug` runtime spot-checks; Playwright is deferred to Phase 94.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Pointer tracking | Browser (window listener) | — | DOM event API only; module owns single listener (BLOB-02) |
| Frame loop | Browser (rAF) | — | Display-rate animation; one global rAF id (BLOB-02) |
| Physics math | Module closure | — | Pure functions; zero React touchpoints (BLOB-02) |
| Canvas paint | Browser (Canvas 2D ctx) | — | GPU-accelerated radial gradients; single `<canvas>` (BLOB-01) |
| CSS var publish | DOM (`:root.style.setProperty`) | — | Phase 92 consumes via CSS — pure browser IPC |
| Mode resolution | Module + matchMedia + MutationObserver | — | OS pref + theme attribute; no React subscription (BLOB-07/08/09/10) |
| React lifecycle hookup | React shell (`useEffect`) | — | Mount/unmount glue only; no rendering work (BLOB-03) |
| Dev introspection | `window.__blobDebug` (NODE_ENV-gated) | — | Tree-shaken in prod (BLOB-12) |

## Project Constraints (from CLAUDE.md)

- **Stack:** Next.js + React + TypeScript + Tailwind. The `next/` subproject confirmed `next@15.5.15`, `react@19.1.0`. Phase 91 ships zero new dependencies.
- **Language:** Russian only. Engine writes to attributes/CSS vars only — no user-facing strings.
- **Mobile blur cap ≤12px** (Phase 79 hard constraint, restated in Phase 90 `blob.css` and DESIGN.md). Canvas renderer must not exceed this.
- **Apple HIG Liquid Glass.** Engine is BEHIND glass, not glass itself — never apply `backdrop-filter` to `.living-blob-field` or `.blob-canvas`.
- **GSD Workflow Enforcement.** All Phase 91 file changes route through `/gsd:execute-phase` after PLAN.md ships.
- **Design Contract:** `--blob-*` tokens already registered in `DESIGN.md` YAML and `globals.css` lines 240–264. Phase 91 writes runtime values via `setProperty`; does NOT modify token files.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOB-01 | `LivingBlobField.tsx` `'use client'` + Canvas 2D 4 sublayers in `position: fixed; inset: 0; z-index: 0; pointer-events: none` | §1 file inventory (component shell), §3 createRadialGradient confirmation |
| BLOB-02 | Single `pointermove` (passive) + single rAF + lerp factors + `:root` var writes + zero React state | §1 `index.ts` API, §2 lifecycle, useSpecularHighlight reference pattern |
| BLOB-03 | Singleton guard against Strict Mode + App Router | §2 React 19 Strict Mode + Next.js 15 layout caching verified |
| BLOB-04 | Heat accumulator 1.5–3s ramp, ≥600ms decay, ≤1.4× peak; disabled under reduced-motion | Decision E formulas locked; physics.ts inventory |
| BLOB-05 | Velocity-driven shape stretch; halo lags more; recollects on stop | Decision D formulas; physics.ts low-pass filter α=0.15 |
| BLOB-06 | Mobile branch: Lissajous, tap-pulse ≤400ms rate-limited 1/600ms, scroll-pause | Decision F + K; lissajous.ts inventory |
| BLOB-07 | reduced-motion → no listener / no rAF / static CSS | §4 matchMedia API verified; modes.ts inventory |
| BLOB-08 | reduced-transparency → blob hidden, opaque fallback | Decision G priority chain; CSS already in blob.css |
| BLOB-09 | Dark theme → opacity 0.30, saturation 0.65, follow disabled | Decision H + Phase 90 `[data-theme="dark"]` rule path |
| BLOB-10 | Pointer-leave-window → 800ms decay then ambient; `data-blob-mode` reflects | Decision J; §6 pointerout edge cases |
| BLOB-11 | Page Visibility integration | §7 MDN-verified auto-pause/resume |
| BLOB-12 | Dev-only `window.__blobDebug.rafCount` for Phase 94 leak assertion | Decision L; debug.ts NODE_ENV guard |

## Standard Stack

### Core (zero new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.1.0 | Lifecycle hookup only | Already installed; `useEffect` cleanup is the only React touchpoint [VERIFIED: package.json line 26] |
| Next.js | 15.5.15 | App Router host | Already installed; layout caching is the navigation-leak vector to defend against [VERIFIED: package.json line 24] |
| TypeScript | ^5 | Engine type safety | Already installed [VERIFIED: package.json line 43] |

### Browser primitives (already specified in Decisions B, C, K)

| Primitive | Purpose | Notes |
|-----------|---------|-------|
| Canvas 2D `createRadialGradient` | Render 4 sublayers | GPU-accelerated in Chromium/WebKit per project research [CITED: Canvas API tutorial — perf details deferred to V phase] |
| `requestAnimationFrame` | Display-rate loop | Auto-paused on `document.hidden`, auto-resumes on visible [VERIFIED: MDN Page Visibility API] |
| `pointermove` / `pointerout` / `pointerover` | Pointer tracking + leave detection | `{ passive: true }` mandatory (PITFALLS 1.4) |
| `MediaQueryList.addEventListener('change', ...)` | A11y + pointer prefs | `addListener()` deprecated; `addEventListener` is current standard [VERIFIED: MDN MediaQueryList] |
| `MutationObserver` | Watch `<html data-theme>` | `{ attributes: true, attributeFilter: ['data-theme'] }` zero-cost when attribute idle [ASSUMED: well-documented MDN pattern; cost is observation only, not mutation] |
| `AbortController` | Listener teardown choreography | `{ signal: abort.signal }` removes all listeners atomically on `abort()` [ASSUMED: standard pattern; verified working in modern browsers] |
| Page Visibility API | Frame budget management | Combined with rAF auto-pause, sufficient for BLOB-11 [VERIFIED: MDN] |

### Reference Patterns (internal)

| Pattern | Source | How Phase 91 uses |
|---------|--------|-------------------|
| rAF + ref + pointer-listener + CSS-var write | `next/src/hooks/use-specular-highlight.ts` lines 17–82 | Lift to module scope; same coalescing strategy (write event to ref, read in rAF). Note: `useSpecularHighlight` operates on element-relative percentages; Phase 91 operates on viewport-absolute pixels written to `:root`. |
| Inline `<style>` seed for first-paint var defaults | `next/src/app/layout.tsx` line 51 (Phase 90) | Engine overwrites these on first frame; defaults remain valid if engine fails to start (Decision M graceful degradation) |
| `data-engine-active="false" → "true"` toggle | `next/src/styles/blob.css` line 63 | React shell owns the flip; static-state CSS handles fallback (Decision M) |

## Architecture Patterns

### Data Flow

```
window.pointermove (passive)
  ↓ writes to module-scope pointer ref
  ↓ (no React touchpoint, no DOM read)
rAF tick
  ↓ read pointer ref
  ↓ compute physics (lerp, heat, velocity, lissajous if ambient)
  ↓ write CSS vars to documentElement.style
  ↓ paint canvas (clearRect + 4 createRadialGradient calls)
  ↓ schedule next rAF
  ↓
Browser composites
  ↓ Phase 92 CSS reads --blob-x/y/heat for heat-leak gradients (NEXT phase)
```

### File Inventory (NEW — 7 files)

#### 1. `next/src/components/effects/LivingBlobField.tsx`
**Purpose:** React shell. Mounts `<canvas>` as 5th sibling inside `.living-blob-field`; on mount calls `startBlobEngine(canvasEl, parentEl)`; on unmount calls returned stop fn.

**Signature outline:**
```typescript
'use client';
import { useEffect, useRef } from 'react';
import { startBlobEngine } from '@/lib/blob-engine';

export function LivingBlobField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement; // the .living-blob-field div
    if (!parent) return;
    const stop = startBlobEngine({ canvas, parent });
    return stop;
  }, []);
  return <canvas ref={canvasRef} className="blob-canvas" aria-hidden="true" style={{ touchAction: 'none' }} />;
}
```

**Key choices:**
- `useEffect` not `useLayoutEffect`: SSR-safe; engine init is a side-effect, not a layout measurement (PITFALLS 8.1).
- Parent ref via `canvas.parentElement`: avoids needing a separate parent ref since `<LivingBlobField />` is mounted INSIDE `.living-blob-field` per Phase 90 contract.
- `aria-hidden="true"` on canvas: redundant with parent's `aria-hidden`, defensive.
- `touchAction: 'none'`: per CONTEXT.md folded scope clarification — prevents browser default touch gestures from intercepting tap-pulse detection.
- Empty dep array: engine starts once per mount; cleanup on full unmount only. Strict Mode dev double-invoke handled by singleton refcount in `index.ts`.

#### 2. `next/src/lib/blob-engine/index.ts`
**Purpose:** Module-singleton state + public `startBlobEngine` API.

**State shape:**
```typescript
interface EngineState {
  refcount: number;
  rafId: number | null;
  abort: AbortController | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  parent: HTMLElement;
  // physics
  pointer: { x: number; y: number; lastX: number; lastY: number; lastT: number };
  velocity: number;                        // px/s, low-pass filtered
  layers: { core: {x,y}, body: {x,y}, halo: {x,y} };
  heat: number;                            // 0..1
  lastHeatSampleAt: number;
  dwellSamples: Array<{ x: number; y: number; t: number }>;
  // mode
  mode: 'cursor' | 'ambient' | 'static' | 'hidden' | 'dark';
  pointerInWindow: boolean;
  pointerLeftAt: number | null;
  // mobile-specific
  scrollPaused: boolean;
  lastScrollAt: number;
  lastTapAt: number;
  // perf
  startedAt: number;
  frameCount: number;
}
```

**Public API (Decision A):**
```typescript
export function startBlobEngine(opts: { canvas: HTMLCanvasElement; parent: HTMLElement }): () => void;
```

**Behavior:**
- If `state === null`: initialize all fields, attach listeners via `AbortController.signal`, schedule first rAF, set `<html data-blob-mode="cursor">`, set `parent.dataset.engineActive = 'true'`. Then `state.refcount = 1`.
- If `state !== null` (Strict Mode double-invoke or another `<LivingBlobField />` mounted): `state.refcount += 1`; return no-op stop wrapper.
- Returned stop fn: `state.refcount -= 1`; if reaches 0, `cancelAnimationFrame(state.rafId)`, `state.abort.abort()`, `<html>` removeAttribute `data-blob-mode`, `parent.dataset.engineActive = 'false'`, `state = null`.
- Canvas init failure (Decision M): if `canvas.getContext('2d')` returns null, console.warn, set `<html data-blob-mode="static">`, do NOT flip `data-engine-active`, do NOT attach listeners, return inert stop fn.

**Imports the other modules:** `canvas-renderer`, `physics`, `lissajous`, `modes`, `debug`.

#### 3. `next/src/lib/blob-engine/canvas-renderer.ts`

**Function signatures:**
```typescript
export function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
// Sets backing store to innerWidth*DPR × innerHeight*DPR (DPR capped at 2 per Decision B).
// Sets ctx.scale(dpr, dpr) so subsequent draw calls are in CSS pixels.

export function drawFrame(state: EngineState): void;
// Orchestrator: clearRect → drawHalo → drawBody → drawCore → drawGlint (conditional).

function drawHalo(ctx, x, y, heat, edgeColor, haloColor): void;
// createRadialGradient(x, y, 0, x, y, 300 + 100*heat); stops at 0% halo, 70% edge, 100% transparent
// globalCompositeOperation = 'screen'

function drawBody(ctx, x, y, heat, coreColor, edgeColor): void;
// radius 200 + 50*heat; mix core/edge

function drawCore(ctx, x, y, heat, coreColor, hotColor): void;
// radius 80 + 30*heat; color = lerp(core, hot, heat); opacity = 1 + 0.4*heat (capped at 1.0 visually via gradient stop alpha)

function drawGlint(ctx, x, y, dir, glintColor): void;
// Tiny 12px radial; only when heat > 0.6 OR velocity < 50; offset slightly toward cursor direction
// globalCompositeOperation = 'source-over'
```

**Color reads:** `getComputedStyle(document.documentElement).getPropertyValue('--blob-core')` etc. Read ONCE on engine init; cache in state. Re-read on `data-theme` MutationObserver tick.

**Compositing:** `ctx.globalCompositeOperation = 'screen'` set before halo/body/core, restored to `'source-over'` for glint and at frame end.

**Resize handling:** debounced `window.resize` listener (250ms) calls `resizeCanvas`; clears canvas to redraw next frame.

#### 4. `next/src/lib/blob-engine/physics.ts`

**Function signatures:**
```typescript
export function lerp(current: number, target: number, factor: number): number;
// return current + (target - current) * factor

export function updateLayers(state: EngineState, target: { x: number; y: number }): void;
// Applies lerp factors per Decision D (core 0.18, body 0.08, halo 0.04).

export function updateVelocity(state: EngineState, now: number): void;
// Low-pass filter: velocity = velocity * (1 - α) + newVelocity * α, α = 0.15
// newVelocity = sqrt(dx² + dy²) / dt, clamped [0, 1500]

export function updateHeat(state: EngineState, deltaTime: number, motionEnabled: boolean): void;
// Per Decision E:
// 1. Append { x, y, t: now } to state.dwellSamples; prune samples older than DWELL_WINDOW (250ms)
// 2. Compute dwellDistance = max pairwise distance in window
// 3. If !motionEnabled (reduced-motion or dark mode): heat = 0; return
// 4. If dwellDistance < DWELL_THRESHOLD (30px): heat += (1 - heat) * (deltaTime / HEAT_RAMP_MS [2000])
// 5. Else: heat += (0 - heat) * (deltaTime / HEAT_DECAY_MS [800])
// 6. Clamp [0, 1]

export function applyTapPulse(state: EngineState, now: number): void;
// heat = 0.7; schedule decay over 380ms via timestamp; (decay handled organically by updateHeat returning to 0)
```

**Constants exported:**
```typescript
export const LERP_CORE = 0.18;
export const LERP_BODY = 0.08;
export const LERP_HALO = 0.04;
export const VELOCITY_ALPHA = 0.15;
export const VELOCITY_MAX = 1500;
export const DWELL_THRESHOLD = 30;
export const DWELL_WINDOW = 250;
export const HEAT_RAMP_MS = 2000;
export const HEAT_DECAY_MS = 800;
export const HEAT_PEAK_LUMINANCE_MULT = 1.4;
export const HEAT_PEAK_SCALE_MULT = 1.4;
export const TAP_PULSE_HEAT = 0.7;
export const TAP_PULSE_DECAY_MS = 380;
export const TAP_PULSE_RATE_LIMIT_MS = 600;
```

#### 5. `next/src/lib/blob-engine/lissajous.ts`

**Function signatures:**
```typescript
export function lissajousTarget(now: number, vw: number, vh: number, scrollPaused: boolean, frozenTime?: number): { x: number; y: number };
// Per Decision F:
// const t = (scrollPaused ? frozenTime : now) / 1000;
// x = 0.5*vw + sin(2π·t/17) * 0.30 * vw
// y = 0.5*vh + sin(2π·t/23 + π/2) * 0.25 * vh

export function leaveWindowDecayTarget(
  now: number,
  decayStart: number,
  lastPointer: { x: number; y: number },
  vw: number,
  vh: number,
): { x: number; y: number };
// Per Decision J:
// progress = clamp((now - decayStart) / 800, 0, 1)
// eased = easeOutCubic(progress) = 1 - (1-progress)^3
// orbit = lissajousTarget(now, vw, vh)
// x = lerp(lastPointer.x, orbit.x, eased)
// y = lerp(lastPointer.y, orbit.y, eased)
```

**Constants exported:**
```typescript
export const LISSAJOUS_PERIOD_X = 17000;
export const LISSAJOUS_PERIOD_Y = 23000;
export const LISSAJOUS_AMP_X = 0.30;
export const LISSAJOUS_AMP_Y = 0.25;
export const LISSAJOUS_PHASE_OFFSET = Math.PI / 2;
export const LEAVE_DECAY_MS = 800;
```

#### 6. `next/src/lib/blob-engine/modes.ts`

**Function signatures:**
```typescript
export type BlobMode = 'cursor' | 'ambient' | 'static' | 'hidden' | 'dark';

export function resolveMode(opts: {
  prefersReducedTransparency: boolean;
  prefersReducedMotion: boolean;
  isDarkTheme: boolean;
  isCoarsePointer: boolean;
  pointerInWindow: boolean;
  pointerLeftAt: number | null;
  now: number;
}): BlobMode;
// Priority chain per Decision G:
// 1. reduced-transparency → 'hidden'
// 2. reduced-motion → 'static'
// 3. dark theme → 'dark'
// 4. coarse + no-hover → 'ambient'
// 5. pointer outside >800ms → 'ambient'
// 6. default → 'cursor'

export function attachModeListeners(
  abort: AbortController,
  onChange: () => void,
): () => void;
// Returns disposer for tests but uses abort.signal for production teardown.
// Listeners attached via { signal: abort.signal }:
//   - matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', onChange, { signal })
//   - matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', onChange, { signal })
//   - matchMedia('(pointer: coarse) and (hover: none)').addEventListener('change', onChange, { signal })
//   - window.addEventListener('pointerout', ..., { signal })   // window-leave detection
//   - window.addEventListener('pointerover', ..., { signal })  // window-reentry
//   - MutationObserver (NOT abortable — track separately): observes <html> for data-theme attribute
//     observer.disconnect() called from index.ts cleanup

export function setHtmlBlobMode(mode: BlobMode): void;
// document.documentElement.setAttribute('data-blob-mode', mode);

export function isPointerOutsideWindow(e: PointerEvent): boolean;
// Defensive check (per research focus §6):
//   relatedTarget === null AND e.target === document (true window-leave)
//   - touch devices fire pointerout on tap-end; guard with e.pointerType !== 'touch'
//   - iframe enter: relatedTarget references iframe element, NOT null — correctly NOT a window-leave
```

**Pointer-leave-window edge cases (Research Focus §6):**
| Scenario | Behavior |
|----------|----------|
| Mouse leaves window via top edge | `pointerout` fires, `relatedTarget === null` → mark left, start 800ms decay |
| Mouse enters iframe inside page | `pointerout` fires, `relatedTarget !== null` (iframe element) → ignore, stay in cursor mode |
| Touch tap ends | `pointerout` fires with `pointerType === 'touch'` → ignore (mode resolver already prefers ambient on coarse pointer) |
| Pointer device switch (mouse → trackpad) | New `pointermove` resets `pointerInWindow=true`, mode flips back to cursor |
| Window blur without pointer move | `pointerout` not guaranteed to fire — accept; ambient drift kicks in eventually if user actually leaves |

#### 7. `next/src/lib/blob-engine/debug.ts`

**Function signatures:**
```typescript
declare global {
  interface Window {
    __blobDebug?: {
      rafCount: number;
      listenerCount: number;
      mode: string;
      pointer: { x: number; y: number };
      heat: number;
      velocity: number;
      startedAt: number;
      frameCount: number;
    };
  }
}

export function attachDebug(state: EngineState): void;
// if (process.env.NODE_ENV !== 'production') {
//   window.__blobDebug = { /* live getters proxied to state */ };
// }
// Implementation: define as Object.defineProperty getters so values are always-current.

export function detachDebug(): void;
// if (process.env.NODE_ENV !== 'production') delete window.__blobDebug;

export function bumpFrameCount(state: EngineState): void;
// state.frameCount++; only meaningful if debug attached
```

**Tree-shaking strategy:** All `attachDebug`/`detachDebug` callsites in `index.ts` MUST be wrapped in literal `if (process.env.NODE_ENV !== 'production') { ... }` so dead-code elimination removes them in prod. Next.js webpack inlines `process.env.NODE_ENV` at build time. Bundle verification in plan: `grep '__blobDebug' .next/static/chunks/*.js` after `pnpm build` should return zero matches.

### File Modifications (2 EDITS)

#### `next/src/app/layout.tsx`
Add 5th child inside `.living-blob-field`:

```diff
   <SvgRefractionDefs />
   <div className="living-blob-field" aria-hidden="true" data-engine-active="false">
     <div className="blob-sublayer blob-core" />
     <div className="blob-sublayer blob-body" />
     <div className="blob-sublayer blob-halo" />
     <div className="blob-sublayer blob-glint" />
+    <LivingBlobField />
   </div>
```

Add import at top:
```diff
+ import { LivingBlobField } from '@/components/effects/LivingBlobField';
```

**Frozen surfaces:** `<html lang="ru">`, `<body className>`, inline `<style>` seed (line 51), `<SvgRefractionDefs />` order, the 4 sublayer divs verbatim, `<Header />`, `<main>` z-10, `<Footer />`, `<StickyBar />`, font declarations, `metadata`, `viewport`. Exact byte match outside the LivingBlobField insertion required.

#### `next/src/styles/blob.css`
Append two rule sets (do NOT modify existing rules):

```css
/* Phase 91 — canvas visibility contract */
.blob-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: none;          /* default hidden — engine flips data-engine-active=true on success */
  pointer-events: none;
}
.living-blob-field[data-engine-active="true"] .blob-canvas {
  display: block;
}

/* Phase 91 — dark mode dimming (Decision H) */
[data-theme="dark"] .living-blob-field[data-engine-active="true"] .blob-canvas {
  opacity: 0.30;
  filter: saturate(0.65);
}
```

**Frozen surfaces in `blob.css`:** lines 1–79 byte-equivalent. Phase 91 only appends.

### Frozen Files (DO NOT TOUCH)

| File | Reason | Verification command |
|------|--------|---------------------|
| `next/src/styles/liquid-glass.css` | Phase 92 territory | `git diff HEAD -- next/src/styles/liquid-glass.css` returns empty |
| `next/src/app/globals.css` | Phase 90 token blocks frozen; engine writes via `setProperty`, not file edit | `git diff HEAD -- next/src/app/globals.css` returns empty |
| `next/src/hooks/use-specular-highlight.ts` | Orthogonal concern (`--mouse-x/y` namespace) | `git diff HEAD -- next/src/hooks/use-specular-highlight.ts` returns empty |
| `next/src/components/layout/SvgRefractionDefs.tsx` | Frozen | byte-equivalent |
| `DESIGN.md` | Phase 90 finalised v9.0 doc | byte-equivalent |
| `next/src/styles/blob.css` lines 1–79 | Phase 90 static-state CSS preserved | grep gates verify rule set unchanged |
| `next/src/app/layout.tsx` outside the LivingBlobField insertion | All Phase 90 mount order preserved | grep gates verify each non-touched line |

## Strict Mode + App Router Lifecycle Diagram

**Verified:** Next.js 15 App Router root layouts do NOT re-render on navigation [VERIFIED: official `layout.js` API reference, version 16.2.4, last updated 2026-04-10 — quoted: "Layouts do not rerender. They can be cached and reused to avoid unnecessary computation when navigating between pages."]. React 19 Strict Mode runs `setup → cleanup → setup` on dev mount [VERIFIED: official `<StrictMode>` reference — quoted: "React will also run one extra setup+cleanup cycle in development for every Effect."].

```
DEV (Strict Mode):
  initial mount → useEffect setup → startBlobEngine() → state created, refcount=1
                ↓
  Strict Mode cleanup → returned stop() → refcount=0 → state torn down, rAF cancelled
                ↓
  Strict Mode re-setup → useEffect setup → startBlobEngine() → state recreated, refcount=1
                ↓
  Stable: 1 rAF, 1 listener set, __blobDebug.rafCount === 1 ✓

DEV+PROD (App Router navigation /  →  /checkup):
  RootLayout NOT re-rendered → <LivingBlobField /> NOT remounted
  → useEffect cleanup NOT called → engine state stable → refcount=1 → __blobDebug.rafCount stays 1 ✓

DEV+PROD (full page reload):
  All state torn down by browser navigation → next mount goes through DEV path again

EDGE: hot module reload (HMR) in dev:
  React fast refresh may unmount/remount component → cleanup → setup
  Refcount choreography handles this identically to Strict Mode (refcount=1 → 0 → 1)
  Idempotent setup is the safety net.
```

**Failure mode without singleton refcount:**
- Strict Mode → 2 effects each calling start() → 2 module-level rAF schedules → stutter, listener-count=2 → BLOB-12 leak assertion fails.
- Refcount design: subsequent `startBlobEngine` calls when `state !== null` only bump refcount and return inert stop fn. Single rAF id, single listener set survives.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pointer event coalescing | Custom debounce/throttle | rAF coalescing (write event to ref, read in rAF) | useSpecularHighlight ships this; PITFALLS 1.4 — rAF is the natural display-rate clock |
| Listener teardown | Manual removeEventListener for each | `AbortController` + `{ signal }` on each `addEventListener` | One `abort.abort()` removes all atomically; eliminates partial-cleanup leak class |
| Velocity smoothing | Per-event accumulator | Low-pass filter α=0.15 over `pointermove` | TZ §6 + project Decision D; standard signal-processing pattern |
| Mode state machine | Custom enum + switch + listeners | `resolveMode` pure function called on any input change | Idempotent recompute; no event-order races |
| Theme attribute watching | Polling or custom event | `MutationObserver` with `attributeFilter: ['data-theme']` | Zero cost when idle; W3C standard |
| Tab visibility | rAF presence check | Page Visibility API + browser auto-pause | rAF auto-pauses on hidden, auto-resumes on visible [VERIFIED: MDN] — no need to schedule manually; just freeze last frame |
| Debug introspection | Custom dev panel | `window.__blobDebug` getters with NODE_ENV guard | Tree-shaken in prod; Playwright-readable in Phase 94 |
| Dev/prod separation | Custom build flag | `process.env.NODE_ENV !== 'production'` | Next.js inlines at build time; standard webpack DCE |

**Key insight:** Every Phase 91 module has a 10–80 LoC implementation with browser primitives. Adding any of GSAP / Motion One / use-mouse / Zustand / Context-for-blob would re-introduce the React-state-on-pointermove failure mode and add dependency surface for zero benefit.

## Common Pitfalls (filtered for Phase 91 engine code)

### Pitfall 1.1 — Mobile blur > 12px regression — HIGH
**What goes wrong:** Engine adds visual layers; if any subnode applies blur >12px on `(max-width: 767px)`, the Phase 79 hard cap is violated.
**Prevention:** Canvas 2D radial gradients use NO `filter: blur()`; visual blur is achieved via gradient stop ramp + low alpha. Append-only edits to `blob.css` MUST not introduce blur on `.blob-canvas`. Static-grep gate: `grep -E 'filter:[^;]*blur\((1[3-9]|[2-9][0-9])' next/src/styles/blob.css` returns 0 matches.
**Warning sign:** DevTools Layers panel shows >2 composited layers per viewport on 375px iPhone simulator.

### Pitfall 1.2 — Animating layout properties — HIGH
**What goes wrong:** Setting `top`/`left` on canvas or any blob node triggers layout/paint per frame.
**Prevention:** Canvas position is `position: absolute; inset: 0` (set ONCE in CSS). Per-frame writes touch only `ctx` (drawing API) and `document.documentElement.style.setProperty` for CSS vars. NEVER `style.top`/`style.left`.
**Warning sign:** Chrome DevTools Performance tab shows "Layout" entries inside the rAF region.

### Pitfall 1.3 — Layout thrash via geometry reads in rAF — HIGH
**What goes wrong:** `getBoundingClientRect()`, `offsetWidth`, `scrollY` inside the loop force synchronous layout.
**Prevention:** Cache `window.innerWidth/innerHeight` in `state.viewport` on engine init and on debounced `resize` only. NEVER call `getBoundingClientRect` in the rAF body. Pointer position read from `state.pointer` ref only.
**Warning sign:** "Forced reflow" warnings in DevTools console.

### Pitfall 1.4 — Untrottled pointermove — MED
**What goes wrong:** 120–240Hz device polling rate causes per-event work to dominate.
**Prevention:** `pointermove` handler is ≤3 lines: `pointer.lastX = pointer.x; pointer.x = e.clientX; pointer.y = e.clientY; pointer.lastT = now`. ALL physics computed in rAF reading the ref.
**Warning sign:** INP regression in field metrics (Phase 94 watch item).

### Pitfall 1.5 — rAF/listener leak across App Router navigation — HIGH
**What goes wrong:** Component remounts (Strict Mode, HMR, future route-group refactor) accumulate rAF callbacks and listeners.
**Prevention:** Module-singleton refcount + AbortController (Decision C). Verified by `__blobDebug.rafCount === 1` and `__blobDebug.listenerCount === 1` after navigation cycle.
**Warning sign:** `__blobDebug.rafCount > 1` after visiting 5 routes.

### Pitfall 1.7 — DOM bloat — MED
**What goes wrong:** Tempting to add per-section "amplifier" nodes.
**Prevention:** Total DOM inside `.living-blob-field` = 5 nodes (4 sublayer divs + 1 canvas). Phase 91 adds NO additional nodes. Static-grep gate: child-count of `.living-blob-field` in compiled HTML stays at 5.
**Warning sign:** DevTools Elements panel shows >5 children of `.living-blob-field`.

### Pitfall 1.8 — `will-change` overuse — MED
**What goes wrong:** GPU layer explosion on budget Android.
**Prevention:** Phase 90 already sets `will-change: auto` on `.blob-sublayer`. Phase 91 does NOT add `will-change` to `.blob-canvas` — Canvas 2D self-promotes to a compositor layer. Static-grep gate: `grep -c 'will-change' next/src/styles/blob.css` count must not exceed Phase 90 baseline.

### Pitfall 2.1 — Cursor-follow ignores reduced-motion — HIGH
**What goes wrong:** New code path bypasses Phase 85 wiring.
**Prevention:** `resolveMode()` checks `prefers-reduced-motion: reduce` first (priority 2 in Decision G); when matched, engine: (a) does NOT attach pointermove listener, (b) does NOT schedule rAF, (c) does NOT animate canvas, (d) sets `data-blob-mode="static"`, (e) sets `data-engine-active="false"` so `blob.css` static-state takes over. Defense in depth: `blob.css` line 73–75 already has a CSS guard from Phase 90.
**Verification:** Manual OS-toggle test required (Phase 89 cheat-pass record makes this explicit). Playwright Phase 94.

### Pitfall 2.4 — `prefers-reduced-transparency` bypass — HIGH
**Prevention:** `resolveMode()` priority 1 → mode='hidden' → `<canvas style="display:none">` via `data-engine-active="false"` and `[data-engine-active="false"] .blob-canvas { display: none }` rule. `blob.css` line 77–79 (Phase 90) already hides `.living-blob-field` entirely under reduced-transparency — that already covers the canvas.

### Pitfall 3.x — React rerender on pointer move — HIGH
**Prevention:** Engine module is OUTSIDE React tree. `LivingBlobField.tsx` renders ONCE (empty dep useEffect); pointer state lives in module closure, never in `useState`. Static-grep gate: `grep -E 'useState|useReducer' next/src/components/effects/LivingBlobField.tsx` returns 0 matches.

### Pitfall 8.3 — Listener double-binding under Strict Mode — HIGH
**Prevention:** Same as 1.5 — singleton refcount. AbortController ensures even partial cleanup doesn't leak: `abort()` is idempotent.

## Code Examples

### Pattern: Singleton with refcount + AbortController
```typescript
// Source: synthesised from Decision C + WHATWG AbortController spec + React 19 Strict Mode docs
let state: EngineState | null = null;

export function startBlobEngine(opts: { canvas: HTMLCanvasElement; parent: HTMLElement }): () => void {
  if (state) {
    state.refcount++;
    return makeStopFn();
  }
  const ctx = opts.canvas.getContext('2d');
  if (!ctx) {
    console.warn('[blob] Canvas 2D unavailable — falling back to static CSS');
    document.documentElement.setAttribute('data-blob-mode', 'static');
    return () => {};
  }
  const abort = new AbortController();
  state = initState(opts.canvas, ctx, opts.parent, abort);
  attachListeners(state);  // all use { signal: abort.signal }
  state.rafId = requestAnimationFrame(loop);
  document.documentElement.setAttribute('data-blob-mode', state.mode);
  opts.parent.dataset.engineActive = 'true';
  state.refcount = 1;
  return makeStopFn();
}

function makeStopFn(): () => void {
  return () => {
    if (!state) return;
    state.refcount--;
    if (state.refcount > 0) return;
    if (state.rafId !== null) cancelAnimationFrame(state.rafId);
    state.abort.abort();
    state.parent.dataset.engineActive = 'false';
    document.documentElement.removeAttribute('data-blob-mode');
    state = null;
  };
}
```

### Pattern: Pointer ref write + rAF read (lifted from useSpecularHighlight)
```typescript
// Source: next/src/hooks/use-specular-highlight.ts lines 50–56
function attachListeners(s: EngineState) {
  window.addEventListener('pointermove', (e) => {
    s.pointer.lastX = s.pointer.x;
    s.pointer.lastY = s.pointer.y;
    s.pointer.lastT = performance.now();
    s.pointer.x = e.clientX;
    s.pointer.y = e.clientY;
  }, { passive: true, signal: s.abort.signal });
}
```

### Pattern: matchMedia listener (verified API)
```typescript
// Source: MDN MediaQueryList — addEventListener('change', ...) is current standard
const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
mqlMotion.addEventListener('change', () => recomputeMode(state), { signal: state.abort.signal });
// Initial read: mqlMotion.matches
```

### Pattern: MutationObserver on `<html data-theme>`
```typescript
// Source: standard MDN MutationObserver pattern
const observer = new MutationObserver(() => recomputeMode(state));
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
state.themeObserver = observer;  // disconnected in stop fn
```

### Pattern: Page Visibility freeze without rAF re-schedule
```typescript
// Verified: rAF auto-pauses on hidden, auto-resumes on visible (MDN Page Visibility API)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state.rafId !== null) cancelAnimationFrame(state.rafId);
    state.rafId = null;
    // Last frame stays painted on canvas — no clear, no flash on resume.
  } else {
    if (state && state.rafId === null) state.rafId = requestAnimationFrame(loop);
  }
}, { signal: state.abort.signal });
```

### Pattern: NODE_ENV-gated debug attachment (tree-shakable)
```typescript
// Source: Next.js webpack DefinePlugin inlines NODE_ENV at build time
if (process.env.NODE_ENV !== 'production') {
  Object.defineProperty(window, '__blobDebug', {
    configurable: true,
    get() {
      return state ? {
        rafCount: state.rafId !== null ? 1 : 0,
        listenerCount: state.abort && !state.abort.signal.aborted ? 1 : 0,
        mode: state.mode,
        pointer: { x: state.pointer.x, y: state.pointer.y },
        heat: state.heat,
        velocity: state.velocity,
        startedAt: state.startedAt,
        frameCount: state.frameCount,
      } : { rafCount: 0, listenerCount: 0, mode: 'unstarted', pointer: { x: 0, y: 0 }, heat: 0, velocity: 0, startedAt: 0, frameCount: 0 };
    }
  });
}
```

## Phase 91 → 92 Boundary Contract

After Phase 91 ships, Phase 92 (heat-leak gradients in `liquid-glass.css`) consumes engine output via runtime CSS vars. The contract guarantees:

| Guarantee | Mechanism |
|-----------|-----------|
| `--blob-x`, `--blob-y` always defined on `:root` (px) | Inline `<style>` seed (Phase 90) sets defaults; engine overwrites each frame |
| `--blob-body-x/y`, `--blob-halo-x/y` always defined (px) | Same; engine writes per-layer lerped positions for parallax-feel heat-leak |
| `--blob-heat` ∈ [0, 1] | Decision E clamping; static branches set 0; dark branch sets 0 |
| `--blob-velocity` ∈ [0, 1500] | Decision D clamping |
| `<html data-blob-mode="cursor|ambient|static|hidden|dark">` set by engine | Phase 92 may branch glass rules on this attribute |
| Engine NEVER modifies `globals.css` token blocks | All writes via `documentElement.style.setProperty` |
| Engine NEVER modifies `liquid-glass.css` | Frozen — Phase 92 owns |
| Phase 92 tuning sessions can adjust LERP_*/heat constants | All physics constants exported from `physics.ts` and `lissajous.ts` for in-browser tuning per TZ §17 mandate |
| Engine survives Strict Mode + 5-route navigation cycle | refcount + AbortController choreography (BLOB-03) |

Phase 92 plans MUST NOT touch any file in `next/src/lib/blob-engine/` — engine internals stable.

## Validation Architecture

> Required by `workflow.nyquist_validation: true` in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Build-success + static-grep + dev-server runtime spot-check (no test runner installed; Phase 94 is the Playwright gate) |
| Config file | none — direct shell commands |
| Quick run command | `cd next && pnpm build` |
| Full suite command | `cd next && pnpm build && pnpm dev` (manual `__blobDebug` check) |

### Phase Requirements → Validation Map

| Req ID | Behavior | Validation Method | Exact Command/Check | Expected Pass |
|--------|----------|-------------------|---------------------|---------------|
| BLOB-01 | `LivingBlobField.tsx` ships as `'use client'` with Canvas 2D and proper position | static-grep | `grep -c "^'use client'" next/src/components/effects/LivingBlobField.tsx` | `1` |
| BLOB-01 | Canvas mounted as 5th sibling inside `.living-blob-field` | static-grep | `grep -A6 'data-engine-active="false"' next/src/app/layout.tsx \| grep -c 'LivingBlobField'` | `1` |
| BLOB-01 | `.blob-canvas` class CSS rules added to blob.css | static-grep | `grep -c '\.blob-canvas' next/src/styles/blob.css` | `≥3` (default, active-true, dark-theme rules) |
| BLOB-02 | Single `pointermove` listener — `addEventListener` for pointermove appears exactly once | static-grep | `grep -rE "addEventListener\(['\"]pointermove" next/src/lib/blob-engine \| wc -l` | `1` |
| BLOB-02 | Single `requestAnimationFrame` schedule loop — `requestAnimationFrame` appears in only `index.ts` (and visibilitychange handler in same file) | static-grep | `grep -rE "requestAnimationFrame\(" next/src/lib/blob-engine/ \| wc -l` | `≥1`, all in `index.ts` |
| BLOB-02 | Lerp factors match Decision D | static-grep | `grep -E 'LERP_CORE\s*=\s*0\.18' next/src/lib/blob-engine/physics.ts` | match |
| BLOB-02 | `{ passive: true }` on pointermove | static-grep | `grep -B2 -A2 "pointermove" next/src/lib/blob-engine/index.ts \| grep -c 'passive: true'` | `≥1` |
| BLOB-02 | Zero React state on pointer move | static-grep | `grep -E 'useState\\|useReducer' next/src/components/effects/LivingBlobField.tsx` | empty |
| BLOB-02 | CSS var writes in rAF | static-grep | `grep -c "documentElement.style.setProperty" next/src/lib/blob-engine/index.ts` | `≥5` (--blob-x, -y, body-x/y, halo-x/y, heat, velocity) |
| BLOB-03 | Singleton state + refcount | static-grep | `grep -c "refcount" next/src/lib/blob-engine/index.ts` | `≥3` (init, increment, decrement) |
| BLOB-03 | AbortController teardown | static-grep | `grep -c "AbortController" next/src/lib/blob-engine/index.ts` | `≥1` |
| BLOB-03 | Strict Mode survival | runtime spot-check | Open `pnpm dev`, navigate `/`; in DevTools console: `window.__blobDebug.rafCount` | `1` |
| BLOB-03 | App Router navigation leak-free | runtime spot-check | Navigate `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`; in DevTools console: `window.__blobDebug.rafCount` | `1` |
| BLOB-03 | Listener count stays at 1 | runtime spot-check | After above navigation, in DevTools: `window.__blobDebug.listenerCount` | `1` |
| BLOB-04 | Heat constants match Decision E | static-grep | `grep -E 'HEAT_RAMP_MS\s*=\s*2000' next/src/lib/blob-engine/physics.ts` AND `HEAT_DECAY_MS\s*=\s*800` AND `DWELL_THRESHOLD\s*=\s*30` AND `DWELL_WINDOW\s*=\s*250` | all match |
| BLOB-04 | Heat disabled under reduced-motion | static-grep | `grep -A5 'updateHeat' next/src/lib/blob-engine/physics.ts \| grep 'motionEnabled'` | match |
| BLOB-04 | Heat ramp visible on dwell | runtime visual smoke | Park cursor for 2s on `/`; in DevTools: `window.__blobDebug.heat` rises ~0→1 | `≥0.8` after 2s |
| BLOB-04 | Heat decay smooth on motion | runtime visual smoke | Resume motion after dwell; `window.__blobDebug.heat` returns to ~0 within 1s | `<0.1` after 1s |
| BLOB-05 | Velocity tracker present | static-grep | `grep -c 'updateVelocity' next/src/lib/blob-engine/physics.ts` | `≥1` |
| BLOB-05 | Low-pass filter constant | static-grep | `grep -E 'VELOCITY_ALPHA\s*=\s*0\.15' next/src/lib/blob-engine/physics.ts` | match |
| BLOB-05 | Velocity-driven stretch in renderer | static-grep | `grep -E 'velocity' next/src/lib/blob-engine/canvas-renderer.ts` | `≥1` reference |
| BLOB-06 | Lissajous periods match Decision F | static-grep | `grep -E 'LISSAJOUS_PERIOD_X\s*=\s*17000' AND `LISSAJOUS_PERIOD_Y\s*=\s*23000` next/src/lib/blob-engine/lissajous.ts | both match |
| BLOB-06 | Tap-pulse rate limit | static-grep | `grep -E 'TAP_PULSE_RATE_LIMIT_MS\s*=\s*600' next/src/lib/blob-engine/physics.ts` | match |
| BLOB-06 | Tap-pulse 380ms decay (≤400 cap) | static-grep | `grep -E 'TAP_PULSE_DECAY_MS\s*=\s*380' next/src/lib/blob-engine/physics.ts` | match |
| BLOB-06 | Interactive selector exclusion for tap-pulse | static-grep | `grep -E 'button.*input.*textarea' next/src/lib/blob-engine/index.ts` (or modes.ts) | match |
| BLOB-06 | Scroll-pause integration | static-grep | `grep -c "scrollPaused" next/src/lib/blob-engine/index.ts` | `≥2` |
| BLOB-06 | Mobile mode runtime smoke | runtime spot-check | DevTools device-mode iPhone; `window.__blobDebug.mode === 'ambient'` | match |
| BLOB-07 | Reduced-motion skips listener+rAF | static-grep | `grep -B2 -A6 "prefers-reduced-motion" next/src/lib/blob-engine/modes.ts \| grep -c "static"` | `≥1` |
| BLOB-07 | Reduced-motion live OS-toggle | manual a11y attestation | macOS System Settings → Accessibility → Reduce Motion: enable; reload `/`; verify no canvas paints, `<html data-blob-mode="static">`, static-state CSS sublayers visible | match |
| BLOB-08 | Reduced-transparency hides blob | static-grep | `grep -c "prefers-reduced-transparency" next/src/lib/blob-engine/modes.ts` | `≥1` |
| BLOB-08 | Reduced-transparency live OS-toggle | manual a11y attestation | Toggle OS pref; verify `.living-blob-field` not visible (Phase 90 CSS already does this); `<html data-blob-mode="hidden">` | match |
| BLOB-09 | Dark theme CSS rule added | static-grep | `grep -E '\\[data-theme="dark"\\].*\\.blob-canvas' next/src/styles/blob.css` | match |
| BLOB-09 | Dark theme opacity/saturation values | static-grep | `grep -E 'opacity:\s*0\.30' next/src/styles/blob.css` AND `saturate\(0\.65\)` | both match |
| BLOB-09 | Dark theme follow disabled | runtime spot-check | Set `<html data-theme="dark">` via DevTools; `__blobDebug.mode === 'dark'`; cursor movement does not change `--blob-x`/`--blob-y` | match |
| BLOB-10 | Pointer-leave 800ms decay | static-grep | `grep -E 'LEAVE_DECAY_MS\s*=\s*800' next/src/lib/blob-engine/lissajous.ts` | match |
| BLOB-10 | `data-blob-mode` attribute write | static-grep | `grep -c 'data-blob-mode' next/src/lib/blob-engine/modes.ts` | `≥1` |
| BLOB-10 | Pointer-leave runtime smoke | runtime spot-check | Move cursor outside browser window; observe `__blobDebug.mode` changes from `cursor` to `ambient` after ~800ms | match |
| BLOB-11 | Page Visibility integration | static-grep | `grep -c "visibilitychange" next/src/lib/blob-engine/index.ts` | `≥1` |
| BLOB-11 | rAF cancelled on hidden | static-grep | `grep -B2 -A8 "visibilitychange" next/src/lib/blob-engine/index.ts \| grep -c "cancelAnimationFrame"` | `≥1` |
| BLOB-11 | rAF restored on visible | runtime spot-check | Switch tab away, return; `__blobDebug.frameCount` increments after return | match |
| BLOB-12 | `__blobDebug` exposed in dev | runtime spot-check | `cd next && pnpm dev`; in DevTools console: `typeof window.__blobDebug` | `'object'` |
| BLOB-12 | `__blobDebug` NOT in prod bundle | static-grep on build output | `cd next && pnpm build && grep -r "__blobDebug" .next/static/chunks/*.js \| wc -l` | `0` |
| BLOB-12 | NODE_ENV guard present | static-grep | `grep -c "process.env.NODE_ENV" next/src/lib/blob-engine/debug.ts` | `≥1` |
| FROZEN | `liquid-glass.css` byte-equivalent | static-grep | `git diff HEAD -- next/src/styles/liquid-glass.css` | empty |
| FROZEN | `globals.css` token blocks unchanged | static-grep | `git diff HEAD -- next/src/app/globals.css` | empty |
| FROZEN | `useSpecularHighlight.ts` byte-equivalent | static-grep | `git diff HEAD -- next/src/hooks/use-specular-highlight.ts` | empty |
| FROZEN | `blob.css` lines 1–79 byte-equivalent | static-grep | `head -79 next/src/styles/blob.css \| diff - <(git show HEAD:next/src/styles/blob.css \| head -79)` | empty |
| BUILD | `pnpm build` zero new warnings vs Phase 90 baseline | build-success | `cd next && rm -rf .next && pnpm build 2>&1 \| tee /tmp/build-91.log; echo $?` | exit 0 |
| BUILD | All 11 routes generate | build-success | `grep -c "○ \|● \|◐ " /tmp/build-91.log` | match Phase 90 count |
| BUILD | No new dependencies | static-grep | `git diff HEAD -- next/package.json next/pnpm-lock.yaml` | empty |
| RUNTIME | All 5 routes render without errors | runtime spot-check | Visit `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` in `pnpm dev`; DevTools Console shows zero new errors vs Phase 90 baseline | match |

### Sampling Rate

- **Per task commit:** static-grep gates run inline in PLAN.md `<acceptance_criteria>` per task; `pnpm build` runs after each task that touches code (gates 1–8).
- **Per phase merge:** full grep + build + manual smoke per Validation Architecture table above.
- **Phase gate (`/gsd-verify-work`):** all rows green; manual a11y attestation logged in `91-VERIFICATION.md`.

### Wave 0 Gaps

- [ ] No automated test runner present in `next/` (no Jest, Vitest, Playwright); Phase 91 validation is exclusively static-grep + build-success + dev-server runtime spot-checks
- [ ] Playwright suite scaffolding deferred to Phase 94 (per `<deferred>` in CONTEXT.md)
- [ ] No framework install required — Phase 91 must remain zero-new-dep per success criterion 8

*(No code-side test gaps to fill: validation strategy is static + runtime spot-check.)*

## Manual A11y Attestation Steps (Phase 89 cheat-pass policy)

Phase 89 made manual OS-toggle attestation explicit. Phase 91 plans MUST include these steps:

1. **Reduced-motion (BLOB-07):**
   - macOS: System Settings → Accessibility → Display → Reduce motion → ON
   - Reload `/`; verify in DevTools Console: `document.documentElement.dataset.blobMode === 'static'`
   - Verify Elements panel: `.living-blob-field[data-engine-active="false"]` (engine never started in this mode)
   - Move cursor — confirm canvas does NOT paint
   - Toggle OFF → reload → confirm cursor follow returns

2. **Reduced-transparency (BLOB-08):**
   - macOS: System Settings → Accessibility → Display → Reduce transparency → ON
   - Reload `/`; verify `.living-blob-field` is `display: none` (Phase 90 CSS rule fires)
   - Verify `document.documentElement.dataset.blobMode === 'hidden'`
   - Toggle OFF → confirm blob returns

3. **Dark theme (BLOB-09):**
   - In DevTools, apply `<html data-theme="dark">` manually (no in-app dark toggle yet — verified by setAttribute)
   - Verify `__blobDebug.mode === 'dark'`
   - Verify canvas opacity 0.30, saturation 0.65 visually
   - Move cursor — verify `--blob-x` does NOT update (follow disabled in dark mode)

4. **Mobile (BLOB-06):**
   - DevTools → Device Mode → iPhone 13 (or any 375px coarse-pointer profile)
   - Reload `/`; verify `__blobDebug.mode === 'ambient'`
   - Verify `--blob-x`/`--blob-y` change autonomously (Lissajous orbit)
   - Tap on background — verify heat pulse via `__blobDebug.heat`
   - Tap on a `<button>` — verify NO heat pulse (interactive selector exclusion)
   - Scroll page — verify orbit position freezes during scroll, resumes after

Append findings to `91-VERIFICATION.md` with date + browser + OS + screenshot per branch.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `pnpm dev`, `pnpm build` | ✓ (assumed; v8.0/v8.1 milestones built successfully) | unspecified | — |
| pnpm | install + build | ✓ | unspecified | — |
| Next.js | App Router | ✓ | 15.5.15 [VERIFIED: package.json] | — |
| React | client component | ✓ | 19.1.0 [VERIFIED: package.json] | — |
| TypeScript | engine type safety | ✓ | ^5 [VERIFIED: package.json] | — |
| Modern browser | Canvas 2D, MediaQueryList, MutationObserver, Page Visibility, AbortController | ✓ | Evergreen Chrome/Safari/Firefox | Decision M graceful degradation if Canvas 2D returns null |
| OS prefs UI | Manual a11y attestation | ✓ on macOS/Windows | — | Manual visual smoke without OS toggle is acceptable for Phase 91; Phase 94 hard gate |

**No missing dependencies. No fallback path required other than Decision M canvas-init failure handling.**

## Security Domain

> Phase 91 introduces no auth, no input handling, no network calls, no user-generated content. ASVS scoring trivially low for this phase scope.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | n/a |
| V3 Session Management | no | n/a |
| V4 Access Control | no | n/a |
| V5 Input Validation | no | engine reads only `PointerEvent.clientX/Y` (browser-trusted), system pref MQs, OS-set theme attribute |
| V6 Cryptography | no | n/a |

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `window.__blobDebug` global in dev only | Information Disclosure | NODE_ENV guard ensures it's stripped from prod bundle (BLOB-12 + Validation Architecture grep gate) |
| `document.documentElement.style.setProperty` writes from engine | Tampering | Engine writes only to namespaced `--blob-*` vars; Phase 90 token blocks frozen — no override risk |
| `data-blob-mode` attribute on `<html>` | Tampering | Engine is sole writer; downstream CSS (Phase 92) is read-only consumer |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Canvas 2D radial gradients are GPU-accelerated in Chromium/WebKit at full-viewport scale 60fps with DPR≤2 | Standard Stack — Browser primitives | If Firefox or low-end Android stutters, mitigation is reduced halo radius / lower DPR cap; tuning is a Phase 92 in-browser session per TZ §17 mandate. Decision B locked in CONTEXT.md, so this is not re-litigated; Phase 94 measures and adjusts ambient mobile opacity if real-device fps degraded (already in STATE.md "Pending Key Decisions") |
| A2 | `MutationObserver` on `<html>` with `attributeFilter: ['data-theme']` has zero cost when attribute doesn't change | Standard Stack — Browser primitives | If observer cost surfaces as INP regression, mitigation is replacing with custom event from theme toggle; no production cost expected |
| A3 | `AbortController` `{ signal }` works on all event-target methods we use (matchMedia, window listeners) | Standard Stack | All target browsers support; if older Safari mismatched, fallback is manual `removeEventListener` per listener — adds 5 lines |
| A4 | `process.env.NODE_ENV` is inlined by Next.js webpack and tree-shakes the `__blobDebug` block | Code Examples — debug.ts | If somehow not stripped, manual verification gate (`grep -r "__blobDebug" .next/static/chunks/*.js`) catches it before phase ships |
| A5 | iOS Safari `pointerout` semantics match desktop for window-leave detection | Pointer-leave-window edge cases | If iOS doesn't fire `pointerout` on window blur, ambient mode still kicks in via the coarse-pointer mode-resolver path (priority 4 in Decision G), so behavior is correct even if leave-window detection is absent on touch |

**Risk summary:** Assumptions are low-impact and have well-known fallback paths. None require pre-implementation user confirmation; all are addressable in-phase or via the Phase 92 in-browser tuning session already on the Pending Key Decisions list (STATE.md).

## Open Questions

1. **Color value reads — getComputedStyle vs precomputed string?**
   - What we know: Canvas 2D `createRadialGradient` needs concrete CSS color strings, not custom-property names. `getComputedStyle(document.documentElement).getPropertyValue('--blob-core')` returns a string like `#35B678` or `rgb(53, 182, 120)`.
   - What's unclear: How often to re-read? Theme-attribute change is the only token-value-change vector in v9.0 (no token redefinition mid-session).
   - Recommendation: Read once on engine init, re-read on `data-theme` MutationObserver tick. Cache in `state.colors`. Document in `canvas-renderer.ts` jsdoc.

2. **rAF resume after long-hidden tab:**
   - What we know: rAF auto-pauses on hidden, auto-resumes on visible.
   - What's unclear: After hours hidden, does the first frame after resume have a stale `now` value that breaks Lissajous (`t = now / 1000` could jump)?
   - Recommendation: On visibilitychange resume, also reset `state.lissajousFrozenTime = performance.now()` so orbit continues from current time rather than from the moment-of-hide. Already covered by Decision K scroll-pause "no catch-up jump" pattern; same pattern applies to visibility resume.

3. **Strict Mode with React 19 — different from React 18?**
   - What we know: React 19 retains the `setup → cleanup → setup` Strict Mode pattern in dev [VERIFIED: official React 19 docs].
   - What's unclear: Any new behavior for refs across the cleanup-then-setup cycle?
   - Recommendation: Refcount design is robust to either pattern. No code change needed; document the verified behavior in implementation comments.

## Sources

### Primary (HIGH confidence)
- `next/src/hooks/use-specular-highlight.ts` (lines 17–82) — internal proven rAF + pointer-listener + CSS-var pattern; verbatim reference for module lift
- `next/src/app/layout.tsx` (Phase 90, line 51 + skeleton) — mount contract `<LivingBlobField />` plugs into
- `next/src/styles/blob.css` (Phase 90, lines 1–79) — static-state CSS Phase 91 must not break + dark-mode hook point
- `next/src/app/globals.css` (lines 240–264) — token registry verified frozen
- `next/package.json` — Next.js 15.5.15 + React 19.1.0 verified
- `.planning/phases/91-blob-engine-renderer-physics-a11y-branches/91-CONTEXT.md` — 13 locked decisions A–M
- `.planning/REQUIREMENTS.md` lines 99–110 — BLOB-01..12 source of truth
- `.planning/research/SUMMARY.md` (lines 22–66) — milestone research synthesis with `useSpecularHighlight` pattern confirmation
- `.planning/research/PITFALLS.md` (lines 19–340) — top pitfalls 1.1–1.8, 2.x, 3.x, 8.3
- `design/LIQUID_GLASS_BLOB_TZ.md` §5–7, §14–17 — physics, performance, a11y constraints
- [Next.js layout.js API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — verified: "Layouts do not rerender. They can be cached and reused"
- [React 19 `<StrictMode>`](https://react.dev/reference/react/StrictMode) — verified: "one extra setup+cleanup cycle in development for every Effect"
- [MDN MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) — verified: `addEventListener('change')` is the current standard; `addListener` deprecated for backward compatibility
- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — verified: rAF auto-pauses on hidden, auto-resumes on visible

### Secondary (MEDIUM confidence)
- [MDN createRadialGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) — API confirmed; performance details deferred to Phase 94 measurement
- [MDN MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) — `attributeFilter` standard pattern (well-documented but not re-verified this session)
- [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — `{ signal }` on `addEventListener` is widely supported

### Tertiary (LOW confidence — to be validated in Phase 94)
- Canvas 2D 60fps at viewport-scale on iOS Safari 16/17 + low-end Android (Decision B locked, but performance contingency in STATE.md "Pending Key Decisions" — mobile ambient opacity reduction if degraded)
- iOS Safari `pointerout` window-leave semantics on physical device — Phase 94 real-device UAT confirms

## Metadata

**Confidence breakdown:**
- File inventory + signatures: HIGH — all 7 new files have explicit signatures derived from Decisions A–M; no exploratory choices remain
- React lifecycle (Strict Mode + App Router): HIGH — verified against official docs this session
- Canvas 2D performance: MEDIUM — locked by Decision B in CONTEXT.md but real-device verification deferred to Phase 94 (acceptable per phase boundary)
- A11y branching: HIGH — Phase 90 CSS already covers two of three branches (reduced-motion, reduced-transparency); Phase 91 only adds JS-side mode resolver and dark-theme branch
- Validation Architecture: HIGH — every BLOB-NN has at least one static-grep gate; runtime spot-checks are dev-server-executable in <60s

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (30-day window — stable browser/framework targets)

## RESEARCH COMPLETE

Phase 91 research synthesises 13 locked decisions into a 7-file inventory + 2 file edits, with explicit signatures, frozen-range gates, and a 50+ row Validation Architecture mapping every BLOB-NN requirement to a static-grep, build-success, runtime spot-check, or manual a11y attestation step. Three external claims (Next.js 15 layout caching, React 19 Strict Mode, rAF/visibility behavior) were verified against official sources this session — confidence HIGH and ready for `/gsd-plan-phase 91`.
