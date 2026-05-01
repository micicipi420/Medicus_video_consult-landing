// next/src/lib/blob-engine/debug.ts
// v9.0 Phase 91 Plan 05 — Dev-only window.__blobDebug introspection surface (BLOB-12).
// v9.0.1 Phase 96 Plan 02 — Extended with per-layer positions + maxAngularSeparation
// (BR-02 verification surface for Playwright fast-cursor sweep).
// Wrapped in process.env.NODE_ENV !== 'production' so Next.js webpack DefinePlugin
// tree-shakes this module's side effects out of production bundles entirely.
// Phase 94 Playwright leak assertion target: window.__blobDebug.rafCount === 1
// after 5-route navigation cycle.

declare global {
  interface Window {
    __blobDebug?: {
      rafCount: number;
      listenerCount: number;
      mode: string;
      pointer: { x: number; y: number };
      heat: number;
      velocity: number;
      velocityLP: { vx: number; vy: number };
      startedAt: number;
      frameCount: number;
      core: { x: number; y: number };
      body: { x: number; y: number };
      halo: { x: number; y: number };
      glint: { x: number; y: number };
      maxAngularSeparation: number;
      resetMaxSeparation: () => void;
    };
  }
}

/**
 * Minimal slice of EngineState needed by debug. Defining locally rather than
 * importing keeps debug.ts decoupled from index.ts internal types.
 */
export interface DebugStateSnapshot {
  rafId: number | null;
  abort: AbortController | null;
  mode: string;
  pointer: { x: number; y: number };
  heat: number;
  velocity: number;
  velocityLP: { vx: number; vy: number };
  startedAt: number;
  frameCount: number;
  core: { x: number; y: number };
  body: { x: number; y: number };
  halo: { x: number; y: number };
  glint: { x: number; y: number };
  maxAngularSeparation: number;
}

/**
 * Attach window.__blobDebug as a live getter that reads from the engine
 * state object passed by reference. Caller must invoke from a NODE_ENV
 * guard so prod bundles tree-shake this entirely.
 *
 * `resetMaxSeparation` is exposed as a callable so Playwright can zero the
 * rolling window before driving cursor input.
 */
export function attachDebug(
  getSnapshot: () => DebugStateSnapshot,
  resetMaxSeparation: () => void,
): void {
  if (process.env.NODE_ENV === 'production') return;
  Object.defineProperty(window, '__blobDebug', {
    configurable: true,
    get() {
      const s = getSnapshot();
      return {
        rafCount: s.rafId !== null ? 1 : 0,
        listenerCount: s.abort && !s.abort.signal.aborted ? 1 : 0,
        mode: s.mode,
        pointer: { x: s.pointer.x, y: s.pointer.y },
        heat: s.heat,
        velocity: s.velocity,
        velocityLP: { vx: s.velocityLP.vx, vy: s.velocityLP.vy },
        startedAt: s.startedAt,
        frameCount: s.frameCount,
        core: { x: s.core.x, y: s.core.y },
        body: { x: s.body.x, y: s.body.y },
        halo: { x: s.halo.x, y: s.halo.y },
        glint: { x: s.glint.x, y: s.glint.y },
        maxAngularSeparation: s.maxAngularSeparation,
        resetMaxSeparation,
      };
    },
  });
}

/** Detach on engine teardown — symmetric with attachDebug. */
export function detachDebug(): void {
  if (process.env.NODE_ENV === 'production') return;
  try {
    delete window.__blobDebug;
  } catch {
    // Some browsers throw on delete of non-configurable; ignore.
  }
}
