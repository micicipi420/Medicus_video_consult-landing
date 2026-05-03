'use client';

import { useEffect, useRef } from 'react';
import { LightBendingEngine, type SurfaceDescriptor } from '@/lib/effects/light-bending-renderer';

/**
 * SPIKE — glass-light-bending React mount. Throwaway code; lives only at
 * /spike/glass-light-bending. Mirrors GlassScintillationField patterns:
 * singleton + refcount + ResizeObserver + MutationObserver + a11y branches
 * + forceMount escape hatch.
 *
 *   - prefers-reduced-motion → engine renders once, freezes positions
 *   - prefers-reduced-transparency → component returns null (unless forceMount)
 */

let engineSingleton: LightBendingEngine | null = null;
let engineRefcount = 0;

interface Props {
  /** Selector to scan the DOM for glass surfaces. Default: '[data-glass-light-bending]'. */
  selector?: string;
  /**
   * Spike-only escape hatch — bypass `prefers-reduced-transparency` for
   * visual evaluation. Production milestone must NOT pass this prop.
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

export function GlassLightBendingField({ selector = '[data-glass-light-bending]', forceMount = false }: Props) {
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

    const { elements, descriptors } = readSurfacesFromDOM(selector);

    if (!engineSingleton) {
      engineSingleton = new LightBendingEngine();
      engineSingleton.start(canvas, descriptors);
    } else {
      engineSingleton.updateSurfaces(descriptors);
    }
    engineRefcount++;

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
        zIndex: 1, // above radial blob (z=0), below page content (z>=10)
        pointerEvents: 'none',
        touchAction: 'none',
      }}
    />
  );
}
