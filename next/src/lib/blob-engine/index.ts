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

// LOCKED: TZ §17 lerp factors — DO NOT modify without phase replan.
const LERP_CORE = 0.18;
const LERP_BODY = 0.08;
const LERP_HALO = 0.04;

interface PointerRef {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  lastT: number;
}

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
  heat: number;     // Plan 03 makes this real; Plan 02 holds 0
  velocity: number; // Plan 03 makes this real; Plan 02 holds 0
  mode: 'cursor';   // Plan 04 widens to BlobMode union
  startedAt: number;
  frameCount: number;
}

let state: EngineState | null = null;

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

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

  // Lerp targets: Plan 02 hardcodes pointer as the target (cursor mode only).
  const targetX = state.pointer.x;
  const targetY = state.pointer.y;

  state.core.x = lerp(state.core.x, targetX, LERP_CORE);
  state.core.y = lerp(state.core.y, targetY, LERP_CORE);
  state.body.x = lerp(state.body.x, targetX, LERP_BODY);
  state.body.y = lerp(state.body.y, targetY, LERP_BODY);
  state.halo.x = lerp(state.halo.x, targetX, LERP_HALO);
  state.halo.y = lerp(state.halo.y, targetY, LERP_HALO);

  // Plan 03 fills these in:
  // updateVelocity(state, performance.now());
  // updateHeat(state, deltaTime, motionEnabled);

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
