// next/src/lib/blob-engine/modes.ts
// v9.0 Phase 91 Plan 04 — Mode resolver + media-query / theme listeners.
// Decision G priority chain. Decision F tap-pulse interactive exclusion.

import { LEAVE_DECAY_MS } from './lissajous';

export type BlobMode = 'cursor' | 'ambient' | 'static' | 'hidden' | 'dark';

export interface ResolveModeOpts {
  prefersReducedTransparency: boolean;
  prefersReducedMotion: boolean;
  isDarkTheme: boolean;
  isCoarseNoHover: boolean;
  pointerInWindow: boolean;
  pointerLeftAt: number | null;
  now: number;
}

/** Decision G — priority chain (highest priority wins). */
export function resolveMode(opts: ResolveModeOpts): BlobMode {
  if (opts.prefersReducedTransparency) return 'hidden';
  if (opts.prefersReducedMotion) return 'static';
  if (opts.isDarkTheme) return 'dark';
  if (opts.isCoarseNoHover) return 'ambient';
  if (
    !opts.pointerInWindow &&
    opts.pointerLeftAt !== null &&
    (opts.now - opts.pointerLeftAt) > LEAVE_DECAY_MS
  ) {
    return 'ambient';
  }
  return 'cursor';
}

/** Sole writer of <html data-blob-mode>. */
export function setHtmlBlobMode(mode: BlobMode): void {
  document.documentElement.setAttribute('data-blob-mode', mode);
}

/** Defensive window-leave check per Decision J + RESEARCH §6. */
export function isPointerOutsideWindow(e: PointerEvent): boolean {
  // Touch devices fire pointerout on tap-end; ignore those.
  if (e.pointerType === 'touch') return false;
  // iframe enter: relatedTarget references iframe element, NOT null — not a true window-leave.
  if (e.relatedTarget !== null) return false;
  return true;
}

/** Interactive selector for tap-pulse exclusion (Decision F). */
const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';

/** Returns true if the event target (or any ancestor) is interactive — reject tap-pulse. */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(INTERACTIVE_SELECTOR) !== null;
}

export interface ModeListenerHandles {
  mqlMotion: MediaQueryList;
  mqlTransparency: MediaQueryList;
  mqlPointer: MediaQueryList;
  themeObserver: MutationObserver;
}

/**
 * Attach all mode-related listeners.
 * - matchMedia: reduced-motion, reduced-transparency, (pointer: coarse) and (hover: none) — all via abort.signal
 * - MutationObserver on <html data-theme> — disconnected by caller on teardown (returned in handles)
 * - window pointerout / pointerover — via abort.signal
 *
 * Returns the matchMedia handles so the caller can read .matches in resolveMode each frame.
 */
export function attachModeListeners(
  abort: AbortController,
  onChange: () => void,
  onPointerOut: (e: PointerEvent) => void,
  onPointerOver: (e: PointerEvent) => void,
): ModeListenerHandles {
  const signal = abort.signal;

  const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  mqlMotion.addEventListener('change', onChange, { signal });

  const mqlTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
  mqlTransparency.addEventListener('change', onChange, { signal });

  const mqlPointer = window.matchMedia('(pointer: coarse) and (hover: none)');
  mqlPointer.addEventListener('change', onChange, { signal });

  window.addEventListener('pointerout', onPointerOut, { signal });
  window.addEventListener('pointerover', onPointerOver, { signal });

  const themeObserver = new MutationObserver(onChange);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return { mqlMotion, mqlTransparency, mqlPointer, themeObserver };
}
