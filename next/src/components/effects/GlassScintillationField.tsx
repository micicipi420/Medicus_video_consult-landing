'use client';

import { useEffect, useRef } from 'react';
import { ScintillationEngine, type SurfaceDescriptor } from '@/lib/effects/scintillation-renderer';

/**
 * SPIKE — glass-scintillation React mount. Throwaway code; lives only at
 * /spike/glass-scintillation. Singleton-guarded against React 19 Strict Mode
 * double-invoke. a11y branches per spike brief:
 *   - prefers-reduced-motion → render once, freeze positions
 *   - prefers-reduced-transparency → render NOTHING (component returns null)
 *
 * Reuses the singleton+refcount pattern from spike/particle-blob mount.
 */

let engineSingleton: ScintillationEngine | null = null;
let engineRefcount = 0;

interface Props {
  /** Selector to scan the DOM for glass surfaces. Default: '[data-glass-scintillation]'. */
  selector?: string;
  /**
   * Spike-only escape hatch — bypass `prefers-reduced-transparency` for
   * visual evaluation when the user happens to have the OS-level Reduce
   * Transparency accessibility setting enabled. Production milestone must
   * NOT pass this prop (a11y compliance).
   */
  forceMount?: boolean;
}

function readSurfacesFromDOM(selector: string): { elements: HTMLElement[]; descriptors: SurfaceDescriptor[] } {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const descriptors = els.map((el, i) => {
    const rect = el.getBoundingClientRect();
    const csRadius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 12;
    return {
      id: el.id || `glass-${i}`,
      bounds: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      cornerRadius: csRadius,
    } satisfies SurfaceDescriptor;
  });
  return { elements: els, descriptors };
}

export function GlassScintillationField({ selector = '[data-glass-scintillation]', forceMount = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skipRender = useRef(false);

  if (typeof window !== 'undefined' && skipRender.current === false && !forceMount) {
    skipRender.current = window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches ?? false;
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!forceMount && window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Pull surfaces from DOM.
    const { elements, descriptors } = readSurfacesFromDOM(selector);

    if (!engineSingleton) {
      engineSingleton = new ScintillationEngine();
      engineSingleton.start(canvas, descriptors);
    } else {
      engineSingleton.updateSurfaces(descriptors);
    }
    engineRefcount++;

    // ResizeObserver — refresh bounds on layout change.
    let raf = 0;
    const refresh = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!engineSingleton) return;
        const { descriptors } = readSurfacesFromDOM(selector);
        engineSingleton.updateSurfaces(descriptors);
      });
    };
    const ro = new ResizeObserver(refresh);
    elements.forEach(el => ro.observe(el));
    window.addEventListener('scroll', refresh, { passive: true });

    // Live DOM additions/removals (defensive — spike harness is static, but
    // production milestone will need this).
    const mo = new MutationObserver(refresh);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', refresh);
      if (raf) cancelAnimationFrame(raf);
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
        // z=1 → above radial blob (z=0), below page content (z>=10). User content always wins.
        zIndex: 1,
        pointerEvents: 'none',
        touchAction: 'none',
      }}
    />
  );
}
