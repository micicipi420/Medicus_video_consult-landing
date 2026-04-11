'use client';

import { useEffect, useRef } from 'react';

/**
 * Tracks pointer position over a glass element and updates
 * --mouse-x / --mouse-y CSS custom properties so the specular
 * radial-gradient (liquid-glass.css Section 17) follows the cursor.
 *
 * Gates:
 * - pointer: fine only (no tracking on touch devices)
 * - prefers-reduced-motion: reduce disables tracking (CSS freezes specular at 30%/0%)
 *
 * Uses requestAnimationFrame throttling to cap updates at ~60fps.
 */
export function useSpecularHighlight(
  ref: React.RefObject<HTMLElement | null>,
): void {
  const rafId = useRef<number>(0);
  const pending = useRef(false);
  const latestEvent = useRef<PointerEvent | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Gate: desktop pointer only (mouse / stylus)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // Gate: respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const updatePosition = () => {
      pending.current = false;
      const event = latestEvent.current;
      if (!event || !el) return;

      const rect = el.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((event.clientY - rect.top) / rect.height) * 100;

      el.style.setProperty('--mouse-x', mouseX + '%');
      el.style.setProperty('--mouse-y', mouseY + '%');
    };

    const onPointerMove = (e: PointerEvent) => {
      latestEvent.current = e;
      if (!pending.current) {
        pending.current = true;
        rafId.current = requestAnimationFrame(updatePosition);
      }
    };

    const onPointerLeave = () => {
      // Cancel any pending rAF
      if (pending.current) {
        cancelAnimationFrame(rafId.current);
        pending.current = false;
      }
      latestEvent.current = null;

      // Remove properties so CSS fallback (30%, 0%) kicks in
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
    };

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    return () => {
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      if (pending.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [ref]);
}
