'use client';

import { useEffect, useRef } from 'react';
import { ParticleEngine, type Morph } from '@/lib/blob-engine/particle-renderer';

/**
 * SPIKE — particle blob React mount. Throwaway code; lives only at
 * /spike/particle-blob route. Singleton-guarded against React 19 Strict Mode
 * double-invoke. a11y branches per spike brief:
 *   - prefers-reduced-motion → static positions in current form
 *   - prefers-reduced-transparency → render NOTHING (component returns null)
 */

// Module-scoped engine — survives Strict Mode double mount.
let engineSingleton: ParticleEngine | null = null;
let engineRefcount = 0;

interface Props {
  initialMorph?: Morph;
  /** Imperative handle: parent can call setMorph(form). */
  onReady?: (api: { morphTo: (form: Morph) => void }) => void;
}

export function ParticleBlobField({ initialMorph = 'cloud', onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // a11y: skip mount entirely if user prefers reduced transparency.
  const skipRender = useRef(false);
  if (typeof window !== 'undefined' && skipRender.current === false) {
    skipRender.current = window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches ?? false;
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!engineSingleton) {
      engineSingleton = new ParticleEngine();
      engineSingleton.start(canvas);
    }
    engineSingleton.morphTo(initialMorph);
    engineRefcount++;

    // a11y: prefers-reduced-motion — we still mount but freeze morphs.
    // The engine's spring will settle and stay settled because we don't call morphTo.
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const api = {
      morphTo: (form: Morph) => {
        if (reducedMotion) return;
        engineSingleton?.morphTo(form);
      },
    };
    onReady?.(api);

    return () => {
      engineRefcount--;
      if (engineRefcount <= 0 && engineSingleton) {
        engineSingleton.stop();
        engineSingleton = null;
        engineRefcount = 0;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skipRender.current) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        touchAction: 'none',
      }}
    />
  );
}
