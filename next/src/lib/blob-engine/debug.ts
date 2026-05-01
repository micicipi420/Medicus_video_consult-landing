// next/src/lib/blob-engine/debug.ts
// v9.0 Phase 91 Plan 05 — Dev-only window.__blobDebug introspection surface (BLOB-12).
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
      startedAt: number;
      frameCount: number;
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
  startedAt: number;
  frameCount: number;
}

/**
 * Attach window.__blobDebug as a live getter that reads from the engine
 * state object passed by reference. Caller must invoke from a NODE_ENV
 * guard so prod bundles tree-shake this entirely.
 */
export function attachDebug(getSnapshot: () => DebugStateSnapshot): void {
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
        startedAt: s.startedAt,
        frameCount: s.frameCount,
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
