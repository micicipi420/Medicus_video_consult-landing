// next/src/lib/blob-engine/index.ts
// v9.0 Phase 91 Plan 02 — Module singleton + rAF loop + pointer listener + Page Visibility.
// Physics stubs (heat=0, velocity=0) replaced by Plan 03; mode resolver hardcoded to 'cursor' (Plan 04 generalises).

import {
  resizeCanvas,
  drawFrame,
  readColors,
  type BlobColors,
  type DrawState,
  type LayerPos,
} from './canvas-renderer';
import {
  updateLayers,
  updateVelocity,
  updateHeat,
  type DwellSample,
  type PointerRef,
} from './physics';

interface EngineState {
  refcount: number;
  rafId: number | null;
  abort: AbortController;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  parent: HTMLElement;
  colors: BlobColors;
  viewport: { width: number; height: number };
  pointer: PointerRef;
  core: LayerPos;
  body: LayerPos;
  halo: LayerPos;
  heat: number;                 // Plan 03 makes real (was 0 in Plan 02)
  velocity: number;             // Plan 03 makes real (was 0 in Plan 02)
  mode: 'cursor';               // Plan 04 widens to BlobMode union
  startedAt: number;
  frameCount: number;
  dwellSamples: DwellSample[];  // Decision E — pruned to DWELL_WINDOW (250ms)
  lastFrameAt: number;          // for deltaTime in updateHeat
  lastTapAt: number;            // Plan 04 mobile tap-pulse rate-limit (Plan 03 inits to 0)
}

let state: EngineState | null = null;

export interface StartBlobEngineOpts {
  canvas: HTMLCanvasElement;
  parent: HTMLElement;
}

export function startBlobEngine(opts: StartBlobEngineOpts): () => void {
  // Singleton refcount: Strict Mode + multi-instance safe.
  if (state) {
    state.refcount++;
    return makeStopFn();
  }

  const ctx = opts.canvas.getContext('2d');
  if (!ctx) {
    // Decision M — graceful degradation; no listeners, no rAF, sublayers stay visible.
    // eslint-disable-next-line no-console
    console.warn('[blob] Canvas 2D unavailable — falling back to static CSS');
    document.documentElement.setAttribute('data-blob-mode', 'static');
    return () => {};
  }

  const abort = new AbortController();
  const initial = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  state = {
    refcount: 1,
    rafId: null,
    abort,
    canvas: opts.canvas,
    ctx,
    parent: opts.parent,
    colors: readColors(),
    viewport: resizeCanvas(opts.canvas, ctx),
    pointer: {
      x: initial.x,
      y: initial.y,
      lastX: initial.x,
      lastY: initial.y,
      lastT: performance.now(),
    },
    core: { ...initial },
    body: { ...initial },
    halo: { ...initial },
    heat: 0,
    velocity: 0,
    mode: 'cursor',
    startedAt: performance.now(),
    frameCount: 0,
    dwellSamples: [],
    lastFrameAt: performance.now(),
    lastTapAt: 0,
  };

  attachListeners(state);
  opts.parent.dataset.engineActive = 'true';
  document.documentElement.setAttribute('data-blob-mode', state.mode);
  state.rafId = requestAnimationFrame(loop);

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

function attachListeners(s: EngineState): void {
  const signal = s.abort.signal;

  // Single pointermove listener — passive (PITFALLS 1.4) — handler is ≤4 lines.
  window.addEventListener('pointermove', (e: PointerEvent) => {
    const now = performance.now();
    s.pointer.lastX = s.pointer.x;
    s.pointer.lastY = s.pointer.y;
    s.pointer.lastT = now;
    s.pointer.x = e.clientX;
    s.pointer.y = e.clientY;
  }, { passive: true, signal });

  // Page Visibility — pause/resume rAF (BLOB-11).
  document.addEventListener('visibilitychange', () => {
    if (!state) return;
    if (document.hidden) {
      if (state.rafId !== null) cancelAnimationFrame(state.rafId);
      state.rafId = null;
      // Last frame stays painted; no clear, no flash on resume.
    } else if (state.rafId === null) {
      state.rafId = requestAnimationFrame(loop);
    }
  }, { signal });

  // Debounced resize — recompute viewport + re-size canvas backing store.
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    if (!state) return;
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!state) return;
      state.viewport = resizeCanvas(state.canvas, state.ctx);
    }, 250);
  }, { passive: true, signal });
}

function loop(): void {
  if (!state) return;

  const now = performance.now();
  const deltaTime = now - state.lastFrameAt;
  state.lastFrameAt = now;

  // Lerp targets — Plan 03 hardcodes pointer; Plan 04 introduces mode-dependent target selection.
  const target = { x: state.pointer.x, y: state.pointer.y };

  updateLayers(state.core, state.body, state.halo, target);

  // Velocity (Decision D — low-pass α=0.15).
  state.velocity = updateVelocity(state.pointer, state.velocity, now);

  // Heat (Decision E). motionEnabled=true in Plan 03 (cursor mode only);
  // Plan 04 will gate this on mode === 'cursor' (NOT 'static'/'hidden'/'dark').
  const motionEnabled = true;
  state.heat = updateHeat(
    state.heat,
    state.pointer,
    state.dwellSamples,
    now,
    deltaTime,
    motionEnabled,
  );

  // Write 8 CSS vars to :root each frame.
  const root = document.documentElement.style;
  root.setProperty('--blob-x', `${state.core.x}px`);
  root.setProperty('--blob-y', `${state.core.y}px`);
  root.setProperty('--blob-body-x', `${state.body.x}px`);
  root.setProperty('--blob-body-y', `${state.body.y}px`);
  root.setProperty('--blob-halo-x', `${state.halo.x}px`);
  root.setProperty('--blob-halo-y', `${state.halo.y}px`);
  root.setProperty('--blob-heat', `${state.heat}`);
  root.setProperty('--blob-velocity', `${state.velocity}`);

  // Paint canvas.
  const drawState: DrawState = {
    ctx: state.ctx,
    width: state.viewport.width,
    height: state.viewport.height,
    colors: state.colors,
    core: state.core,
    body: state.body,
    halo: state.halo,
    heat: state.heat,
    velocity: state.velocity,
  };
  drawFrame(drawState);

  state.frameCount++;
  state.rafId = requestAnimationFrame(loop);
}
