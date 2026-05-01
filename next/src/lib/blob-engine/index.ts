// next/src/lib/blob-engine/index.ts
// v9.0 Phase 91 Plan 04 — Module singleton + rAF loop + pointer + Page Visibility + 5 mode branches.
// Plan 03 ships physics; Plan 04 ships modes (cursor / ambient / static / hidden / dark).

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
  applyTapPulse,
  TAP_PULSE_RATE_LIMIT_MS,
  type DwellSample,
  type PointerRef,
} from './physics';
import {
  resolveMode,
  setHtmlBlobMode,
  attachModeListeners,
  isPointerOutsideWindow,
  isInteractiveTarget,
  type BlobMode,
  type ModeListenerHandles,
} from './modes';
import {
  lissajousTarget,
  leaveWindowDecayTarget,
  LEAVE_DECAY_MS,
} from './lissajous';
import { attachDebug, detachDebug } from './debug';

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
  glint: LayerPos;
  heat: number;
  velocity: number;
  mode: BlobMode;
  startedAt: number;
  frameCount: number;
  maxAngularSeparation: number;
  dwellSamples: DwellSample[];
  lastFrameAt: number;
  lastTapAt: number;
  pointerInWindow: boolean;
  pointerLeftAt: number | null;
  lastPointerInWindow: { x: number; y: number };
  scrollPaused: boolean;
  lastScrollAt: number;
  lissajousFrozenTime: number | null;
  modeHandles: ModeListenerHandles | null;
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
    glint: { ...initial },
    heat: 0,
    velocity: 0,
    mode: 'cursor',
    startedAt: performance.now(),
    frameCount: 0,
    maxAngularSeparation: 0,
    dwellSamples: [],
    lastFrameAt: performance.now(),
    lastTapAt: 0,
    pointerInWindow: true,
    pointerLeftAt: null,
    lastPointerInWindow: { ...initial },
    scrollPaused: false,
    lastScrollAt: 0,
    lissajousFrozenTime: null,
    modeHandles: null,
  };

  attachListeners(state);

  // Mode resolution + listeners.
  const recomputeMode = () => {
    if (!state) return;
    const newMode = resolveMode({
      prefersReducedTransparency: state.modeHandles?.mqlTransparency.matches ?? false,
      prefersReducedMotion: state.modeHandles?.mqlMotion.matches ?? false,
      isDarkTheme: document.documentElement.dataset.theme === 'dark',
      isCoarseNoHover: state.modeHandles?.mqlPointer.matches ?? false,
      pointerInWindow: state.pointerInWindow,
      pointerLeftAt: state.pointerLeftAt,
      now: performance.now(),
    });
    if (newMode !== state.mode) {
      const prev = state.mode;
      state.mode = newMode;
      setHtmlBlobMode(newMode);
      // rAF gate for static/hidden modes (BLOB-07/08).
      const wasAnimating = prev === 'cursor' || prev === 'ambient' || prev === 'dark';
      const isAnimating = newMode === 'cursor' || newMode === 'ambient' || newMode === 'dark';
      if (wasAnimating && !isAnimating) {
        if (state.rafId !== null) cancelAnimationFrame(state.rafId);
        state.rafId = null;
      } else if (!wasAnimating && isAnimating) {
        if (state.rafId === null) state.rafId = requestAnimationFrame(loop);
      }
    }
  };

  const onPointerOut = (e: PointerEvent) => {
    if (!state) return;
    if (!isPointerOutsideWindow(e)) return;
    state.pointerInWindow = false;
    state.pointerLeftAt = performance.now();
    state.lastPointerInWindow = { x: state.pointer.x, y: state.pointer.y };
    recomputeMode();
  };

  const onPointerOver = (e: PointerEvent) => {
    if (!state) return;
    if (e.pointerType === 'touch') return;
    state.pointerInWindow = true;
    state.pointerLeftAt = null;
    recomputeMode();
  };

  state.modeHandles = attachModeListeners(state.abort, recomputeMode, onPointerOut, onPointerOver);

  // Dev-only debug surface (BLOB-12 + Phase 96 BR-02). Tree-shaken in prod via NODE_ENV guard.
  if (process.env.NODE_ENV !== 'production') {
    attachDebug(
      () => {
        if (!state) {
          return {
            rafId: null,
            abort: null,
            mode: 'unstarted',
            pointer: { x: 0, y: 0 },
            heat: 0,
            velocity: 0,
            startedAt: 0,
            frameCount: 0,
            core: { x: 0, y: 0 },
            body: { x: 0, y: 0 },
            halo: { x: 0, y: 0 },
            glint: { x: 0, y: 0 },
            maxAngularSeparation: 0,
          };
        }
        return {
          rafId: state.rafId,
          abort: state.abort,
          mode: state.mode,
          pointer: { x: state.pointer.x, y: state.pointer.y },
          heat: state.heat,
          velocity: state.velocity,
          startedAt: state.startedAt,
          frameCount: state.frameCount,
          core: { x: state.core.x, y: state.core.y },
          body: { x: state.body.x, y: state.body.y },
          halo: { x: state.halo.x, y: state.halo.y },
          glint: { x: state.glint.x, y: state.glint.y },
          maxAngularSeparation: state.maxAngularSeparation,
        };
      },
      () => { if (state) state.maxAngularSeparation = 0; },
    );
  }

  // Initial mode read.
  recomputeMode();

  opts.parent.dataset.engineActive = 'true';
  setHtmlBlobMode(state.mode);

  // Mobile-only listeners (always attached — selector check filters interactive targets).
  attachMobileListeners(state);

  // BLOB-07/08: skip rAF schedule when initial mode is static/hidden.
  if (state.mode !== 'static' && state.mode !== 'hidden') {
    state.rafId = requestAnimationFrame(loop);
  }

  return makeStopFn();
}

function makeStopFn(): () => void {
  return () => {
    if (!state) return;
    state.refcount--;
    if (state.refcount > 0) return;
    if (state.rafId !== null) cancelAnimationFrame(state.rafId);
    state.abort.abort();
    if (state.modeHandles?.themeObserver) {
      state.modeHandles.themeObserver.disconnect();
    }
    state.modeHandles = null;
    if (process.env.NODE_ENV !== 'production') {
      detachDebug();
    }
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
    } else if (state.rafId === null && state.mode !== 'static' && state.mode !== 'hidden') {
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

function attachMobileListeners(s: EngineState): void {
  const signal = s.abort.signal;

  // Decision K: scroll-pause for mobile Lissajous.
  let scrollResumeTimer = 0;
  window.addEventListener('scroll', () => {
    if (!state) return;
    const now = performance.now();
    if (!state.scrollPaused) {
      // Freeze Lissajous time at scroll start; resume from this point per Decision K.
      state.lissajousFrozenTime = now;
    }
    state.scrollPaused = true;
    state.lastScrollAt = now;
    if (scrollResumeTimer) window.clearTimeout(scrollResumeTimer);
    scrollResumeTimer = window.setTimeout(() => {
      if (!state) return;
      state.scrollPaused = false;
      state.lissajousFrozenTime = null;
    }, 250);
  }, { passive: true, signal });

  // Decision F: tap-pulse on touch background only.
  window.addEventListener('pointerdown', (e: PointerEvent) => {
    if (!state) return;
    if (e.pointerType !== 'touch') return;
    if (state.mode === 'static' || state.mode === 'hidden') return;
    // Reject if interactive target.
    if (isInteractiveTarget(e.target)) return;
    // Reject if scroll within last 200ms.
    const now = performance.now();
    if (now - state.lastScrollAt < 200) return;
    // Rate limit: 1 per 600ms.
    if (now - state.lastTapAt < TAP_PULSE_RATE_LIMIT_MS) return;
    state.lastTapAt = now;
    state.heat = applyTapPulse(); // 0.7 — decays organically via updateHeat next frame.
  }, { passive: true, signal });
}

function loop(): void {
  if (!state) return;

  const now = performance.now();
  const deltaTime = now - state.lastFrameAt;
  state.lastFrameAt = now;

  // Mode-dependent target.
  let target: { x: number; y: number };
  if (state.mode === 'cursor') {
    target = { x: state.pointer.x, y: state.pointer.y };
  } else if (state.mode === 'ambient' && state.pointerLeftAt !== null && (now - state.pointerLeftAt) <= LEAVE_DECAY_MS) {
    // Pointer-leave-window decay (Decision J).
    target = leaveWindowDecayTarget(now, state.pointerLeftAt, state.lastPointerInWindow, state.viewport.width, state.viewport.height);
  } else if (state.mode === 'ambient' || state.mode === 'dark') {
    target = lissajousTarget(now, state.viewport.width, state.viewport.height, state.scrollPaused, state.lissajousFrozenTime);
  } else {
    // 'static' / 'hidden' — should not be in loop (rAF not scheduled), but guard anyway.
    return;
  }

  updateLayers(state.core, state.body, state.halo, state.glint, target);

  // Phase 96 BR-02: rolling max angular separation across the 4 sublayers.
  // 6 hypot calls/frame ~ <100ns total at 60fps; well within budget.
  const dist = (a: LayerPos, b: LayerPos) => Math.hypot(a.x - b.x, a.y - b.y);
  const sep = Math.max(
    dist(state.core, state.body),
    dist(state.core, state.halo),
    dist(state.core, state.glint),
    dist(state.body, state.halo),
    dist(state.body, state.glint),
    dist(state.halo, state.glint),
  );
  if (sep > state.maxAngularSeparation) state.maxAngularSeparation = sep;

  // Velocity (Decision D — low-pass α=0.15).
  state.velocity = updateVelocity(state.pointer, state.velocity, now);

  // Heat (Decision E). Decision H: dark mode keeps heat permanently 0 (calm state).
  const motionEnabled = state.mode === 'cursor' || state.mode === 'ambient';
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
  root.setProperty('--blob-glint-x', `${state.glint.x}px`);
  root.setProperty('--blob-glint-y', `${state.glint.y}px`);
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
    glint: state.glint,
    heat: state.heat,
    velocity: state.velocity,
  };
  drawFrame(drawState);

  state.frameCount++;
  state.rafId = requestAnimationFrame(loop);
}
