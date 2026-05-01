'use client';

import { useEffect, useRef } from 'react';
import { startBlobEngine } from '@/lib/blob-engine';

/**
 * v9.0 Phase 91 — Living Blob React shell.
 *
 * Mounts a single <canvas class="blob-canvas"> as a sibling of the four
 * Phase 90 .blob-sublayer divs (5th child of .living-blob-field).
 * Engine lifecycle is owned by `lib/blob-engine` — this component only
 * provides the canvas DOM node and forwards mount/unmount to the engine.
 *
 * Rules:
 * - No React state. No re-renders triggered by pointer events.
 * - Empty dep array; engine singleton refcount in Plan 02 handles
 *   Strict Mode double-invoke safely.
 * - aria-hidden defensive (parent .living-blob-field already has it).
 * - touch-action: none prevents browser default touch gestures from
 *   intercepting tap-pulse detection (mobile branch — Plan 04).
 */
export function LivingBlobField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const stop = startBlobEngine({ canvas, parent });
    return stop;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="blob-canvas"
      aria-hidden="true"
      style={{ touchAction: 'none' }}
    />
  );
}
