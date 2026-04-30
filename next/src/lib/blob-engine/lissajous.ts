// next/src/lib/blob-engine/lissajous.ts
// v9.0 Phase 91 Plan 04 — Lissajous orbit math + window-leave decay.
// Constants per Decision F + J — LOCKED. Pure functions; no DOM access.

// --- Decision F: Lissajous orbit (mobile + ambient + dark) — LOCKED ---
export const LISSAJOUS_PERIOD_X = 17000;       // ms — prime-ish, avoids easy repetition
export const LISSAJOUS_PERIOD_Y = 23000;       // ms — relatively prime to PERIOD_X
export const LISSAJOUS_AMP_X = 0.30;           // ±30vw from center 50vw
export const LISSAJOUS_AMP_Y = 0.25;           // ±25vh from center 50vh
export const LISSAJOUS_PHASE_OFFSET = Math.PI / 2;

// --- Decision J: Pointer-leave-window decay — LOCKED ---
export const LEAVE_DECAY_MS = 800;

/**
 * Lissajous orbit at time `now` (ms since epoch — performance.now()).
 * `frozenTime` is set when scroll-paused: position freezes at the time of pause
 * and resumes from there (no catch-up jump per Decision K).
 */
export function lissajousTarget(
  now: number,
  vw: number,
  vh: number,
  scrollPaused: boolean,
  frozenTime: number | null,
): { x: number; y: number } {
  const t = (scrollPaused && frozenTime !== null) ? frozenTime : now;
  const x = 0.5 * vw + Math.sin(2 * Math.PI * t / LISSAJOUS_PERIOD_X) * LISSAJOUS_AMP_X * vw;
  const y = 0.5 * vh + Math.sin(2 * Math.PI * t / LISSAJOUS_PERIOD_Y + LISSAJOUS_PHASE_OFFSET) * LISSAJOUS_AMP_Y * vh;
  return { x, y };
}

/** ease-out cubic: 1 - (1 - p)^3 for p ∈ [0, 1]. */
function easeOutCubic(p: number): number {
  const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
  const inv = 1 - clamped;
  return 1 - inv * inv * inv;
}

/**
 * Window-leave decay (Decision J): for 800ms, blend from lastPointer to
 * Lissajous orbit using easeOutCubic. After 800ms: pure Lissajous.
 */
export function leaveWindowDecayTarget(
  now: number,
  decayStart: number,
  lastPointer: { x: number; y: number },
  vw: number,
  vh: number,
): { x: number; y: number } {
  const progress = (now - decayStart) / LEAVE_DECAY_MS;
  const eased = easeOutCubic(progress);
  const orbit = lissajousTarget(now, vw, vh, false, null);
  return {
    x: lastPointer.x + (orbit.x - lastPointer.x) * eased,
    y: lastPointer.y + (orbit.y - lastPointer.y) * eased,
  };
}
