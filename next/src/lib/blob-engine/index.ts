// next/src/lib/blob-engine/index.ts
// Phase 91 Plan 01 — STUB. Real singleton + rAF + listeners land in Plan 02.

export interface StartBlobEngineOpts {
  canvas: HTMLCanvasElement;
  parent: HTMLElement;
}

export function startBlobEngine(opts: StartBlobEngineOpts): () => void {
  const { canvas, parent } = opts;

  // Decision M — graceful degradation on Canvas 2D failure.
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // eslint-disable-next-line no-console
    console.warn('[blob] Canvas 2D unavailable — falling back to static CSS');
    document.documentElement.setAttribute('data-blob-mode', 'static');
    return () => {};
  }

  // Plan 01 stub: flip data-engine-active and set initial mode.
  // Plan 02 will replace this with full singleton state, refcount,
  // AbortController, rAF loop, pointer listener, and matchMedia branches.
  parent.dataset.engineActive = 'true';
  document.documentElement.setAttribute('data-blob-mode', 'cursor');

  return () => {
    parent.dataset.engineActive = 'false';
    document.documentElement.removeAttribute('data-blob-mode');
  };
}
