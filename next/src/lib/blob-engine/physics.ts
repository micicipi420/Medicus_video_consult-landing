// next/src/lib/blob-engine/physics.ts
// v9.0 Phase 91 Plan 03 — Pure-math physics for the blob engine.
// All exports are pure functions over EngineState fields; no DOM access, no listeners, no rAF.
// Constants are LOCKED per Decisions D, E, F (TZ §6, §7, §14, §17). Phase 92 may tune via in-browser session.

import type { LayerPos } from './canvas-renderer';

// --- TZ §17 lerp factors (Decision D) — LOCKED ---
export const LERP_CORE = 0.18;
export const LERP_BODY = 0.08;
export const LERP_HALO = 0.04;

// --- Velocity tracker (Decision D) — LOCKED ---
export const VELOCITY_ALPHA = 0.15;
export const VELOCITY_MAX = 1500;

// --- Heat accumulator (Decision E + TZ §7) — LOCKED ---
export const DWELL_THRESHOLD = 30;          // px — cursor moves <30px in DWELL_WINDOW = heating
export const DWELL_WINDOW = 250;            // ms
export const HEAT_RAMP_MS = 2000;           // 2.0s ramp to peak (within TZ 1.5-3s envelope)
export const HEAT_DECAY_MS = 800;           // 800ms decay (within TZ ≥600ms)
export const HEAT_PEAK_LUMINANCE_MULT = 1.4;
export const HEAT_PEAK_SCALE_MULT = 1.4;

// --- Tap-pulse (Decision F + TZ §14) — LOCKED ---
export const TAP_PULSE_HEAT = 0.7;
export const TAP_PULSE_DECAY_MS = 380;      // within TZ ≤400ms cap
export const TAP_PULSE_RATE_LIMIT_MS = 600; // 1 pulse per 600ms max

// --- Types ---
export interface DwellSample { x: number; y: number; t: number; }
export interface PointerRef {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  lastT: number;
}

/** Pure lerp — current toward target by factor. */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * Apply lerp factors per Decision D to all 3 visible sublayers.
 * Pure — mutates layer fields in place; no side effects.
 */
export function updateLayers(
  core: LayerPos,
  body: LayerPos,
  halo: LayerPos,
  target: { x: number; y: number },
): void {
  core.x = lerp(core.x, target.x, LERP_CORE);
  core.y = lerp(core.y, target.y, LERP_CORE);
  body.x = lerp(body.x, target.x, LERP_BODY);
  body.y = lerp(body.y, target.y, LERP_BODY);
  halo.x = lerp(halo.x, target.x, LERP_HALO);
  halo.y = lerp(halo.y, target.y, LERP_HALO);
}

/**
 * Velocity tracker (Decision D). Low-pass filter:
 *   velocity ← velocity * (1 - α) + newVelocity * α      (α = 0.15)
 *   newVelocity = sqrt(dx² + dy²) / dt, clamped [0, VELOCITY_MAX]
 *
 * Returns the new velocity (caller assigns to state.velocity).
 */
export function updateVelocity(
  pointer: PointerRef,
  previousVelocity: number,
  now: number,
): number {
  const dt = Math.max(now - pointer.lastT, 1); // ms; guard against 0
  const dx = pointer.x - pointer.lastX;
  const dy = pointer.y - pointer.lastY;
  const instantPxPerMs = Math.sqrt(dx * dx + dy * dy) / dt;
  const instantPxPerSec = Math.min(instantPxPerMs * 1000, VELOCITY_MAX);
  return previousVelocity * (1 - VELOCITY_ALPHA) + instantPxPerSec * VELOCITY_ALPHA;
}

/**
 * Heat accumulator (Decision E). Side-effects on `dwellSamples` array (prune + push).
 *
 * Algorithm:
 *   1. Push { x, y, t: now } onto dwellSamples; prune samples older than DWELL_WINDOW.
 *   2. Compute dwellDistance = max pairwise distance in remaining window.
 *   3. If !motionEnabled (reduced-motion or dark): heat = 0; return.
 *   4. If dwellDistance < DWELL_THRESHOLD: heat += (1 - heat) * (deltaTime / HEAT_RAMP_MS).
 *   5. Else: heat += (0 - heat) * (deltaTime / HEAT_DECAY_MS).
 *   6. Clamp [0, 1].
 *
 * Returns the new heat (caller assigns to state.heat).
 */
export function updateHeat(
  currentHeat: number,
  pointer: PointerRef,
  dwellSamples: DwellSample[],
  now: number,
  deltaTime: number,
  motionEnabled: boolean,
): number {
  // 1. Append + prune
  dwellSamples.push({ x: pointer.x, y: pointer.y, t: now });
  while (dwellSamples.length > 0 && (now - dwellSamples[0].t) > DWELL_WINDOW) {
    dwellSamples.shift();
  }

  // 3. Reduced-motion / dark mode: heat permanently 0 (BLOB-04 explicit).
  if (!motionEnabled) {
    return 0;
  }

  // 2. dwellDistance = max distance from oldest sample to newest, conservative.
  let dwellDistance = 0;
  if (dwellSamples.length >= 2) {
    const a = dwellSamples[0];
    for (let i = 1; i < dwellSamples.length; i++) {
      const b = dwellSamples[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > dwellDistance) dwellDistance = d;
    }
  }

  // 4 / 5. Ramp or decay.
  let next: number;
  if (dwellDistance < DWELL_THRESHOLD) {
    next = currentHeat + (1 - currentHeat) * (deltaTime / HEAT_RAMP_MS);
  } else {
    next = currentHeat + (0 - currentHeat) * (deltaTime / HEAT_DECAY_MS);
  }

  // 6. Clamp.
  if (next < 0) next = 0;
  if (next > 1) next = 1;
  return next;
}

/**
 * Tap-pulse trigger (Decision F mobile branch — used by Plan 04 modes.ts).
 * Pure: returns the heat value to set; caller does the rate-limit check using
 * lastTapAt before invoking.
 */
export function applyTapPulse(): number {
  return TAP_PULSE_HEAT;
}
