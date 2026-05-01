// next/src/lib/blob-engine/physics.ts
// v9.0 Phase 91 Plan 03 — Pure-math physics for the blob engine.
// All exports are pure functions over EngineState fields; no DOM access, no listeners, no rAF.
//
// v9.0.1 Phase 96 Plan 02 (Option B — structural refactor):
// Per-layer LERP cluster (LERP_BODY/HALO/GLINT) replaced by a velocity-low-pass
// capped-offset model. Only `core` lerps to the target. body/halo/glint render
// at `core - velUnit * f(velocity) * cap_layer`, which hard-bounds inter-layer
// separation to `cap_halo` = 8px regardless of cursor speed. Preserves organic
// trail at low velocity (f → 0 ⇒ all layers collapse to core); enforces the
// BR-02 ≤8px ceiling at high velocity (f saturates at 1).

import type { LayerPos } from './canvas-renderer';

// --- Phase 96 BR-02 Option B — capped offset model ---
// Only the core lerps to the target. body/halo/glint are computed offsets.
export const LERP_CORE = 0.20;

// Per-layer offset caps (px) — max trail distance behind core at peak velocity.
// halo at 8px is the BR-02 ceiling for the rolling max angular separation.
export const OFFSET_CAP_BODY = 6;
export const OFFSET_CAP_HALO = 8;
export const OFFSET_CAP_GLINT = 4;

// Velocity-LP smoothing α — used to damp instantaneous noise on the velocity
// vector so layer offsets don't jitter on a noisy pointer signal.
export const VELOCITY_LP_ALPHA = 0.15;

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

/**
 * Vector velocity-low-pass state. Kept on the engine so it persists across
 * frames; mutated in place by `updateVelocityVector`.
 */
export interface VelocityLPState {
  vx: number; // smoothed x-component, px/s
  vy: number; // smoothed y-component, px/s
}

/** Pure lerp — current toward target by factor. */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * Update the smoothed (low-pass) velocity vector from a per-frame core
 * position delta. Mutates `lp` in place.
 *
 * Filter: lp ← lp * (1 - α) + instant * α   (α = VELOCITY_LP_ALPHA = 0.15)
 *
 * Components are clamped to ±VELOCITY_MAX so a single noisy frame can't
 * push the smoothed magnitude beyond the saturation point of the offset
 * curve.
 */
export function updateVelocityVector(
  lp: VelocityLPState,
  prevX: number,
  prevY: number,
  currX: number,
  currY: number,
  deltaTimeMs: number,
): void {
  const dt = Math.max(deltaTimeMs, 1); // ms; guard against 0 / negative
  const instantVx = ((currX - prevX) / dt) * 1000; // px/s
  const instantVy = ((currY - prevY) / dt) * 1000;
  const clampedVx = Math.max(-VELOCITY_MAX, Math.min(VELOCITY_MAX, instantVx));
  const clampedVy = Math.max(-VELOCITY_MAX, Math.min(VELOCITY_MAX, instantVy));
  lp.vx = lp.vx * (1 - VELOCITY_LP_ALPHA) + clampedVx * VELOCITY_LP_ALPHA;
  lp.vy = lp.vy * (1 - VELOCITY_LP_ALPHA) + clampedVy * VELOCITY_LP_ALPHA;
}

/**
 * Apply Option B model to all 4 sublayers.
 *
 * - `core`: lerps to `target` with LERP_CORE (k = 0.20).
 * - `body / halo / glint`: rendered as `core - velUnit * f * cap_layer`,
 *   where:
 *     - `velUnit` = unit vector along the smoothed velocity LP
 *     - `f` = clamp(|velLP| / VELOCITY_MAX, 0, 1)
 *     - `cap_layer` is OFFSET_CAP_{BODY|HALO|GLINT}
 *   Sign is negative so layers trail BEHIND core in the direction the
 *   cursor came from (organic streamline).
 *
 * Inter-layer separation is hard-bounded: max pairwise distance equals
 * `cap_halo` = 8px regardless of velocity, satisfying BR-02. At low
 * velocity (f → 0) all three layers collapse to core, preserving the
 * "calm cluster" feel for slow cursor motion.
 *
 * Pure: mutates layer fields in place; no side effects.
 */
export function updateLayers(
  core: LayerPos,
  body: LayerPos,
  halo: LayerPos,
  glint: LayerPos,
  target: { x: number; y: number },
  velocityLP: VelocityLPState,
): void {
  // 1. Core lerps to target.
  core.x = lerp(core.x, target.x, LERP_CORE);
  core.y = lerp(core.y, target.y, LERP_CORE);

  // 2. Compute trail offset for body/halo/glint.
  const vMag = Math.hypot(velocityLP.vx, velocityLP.vy);
  let ux = 0;
  let uy = 0;
  let f = 0;
  if (vMag > 1e-3) {
    ux = velocityLP.vx / vMag;
    uy = velocityLP.vy / vMag;
    f = Math.min(vMag / VELOCITY_MAX, 1);
  }
  // Negative sign — trail BEHIND in direction of motion.
  body.x = core.x - ux * f * OFFSET_CAP_BODY;
  body.y = core.y - uy * f * OFFSET_CAP_BODY;
  halo.x = core.x - ux * f * OFFSET_CAP_HALO;
  halo.y = core.y - uy * f * OFFSET_CAP_HALO;
  glint.x = core.x - ux * f * OFFSET_CAP_GLINT;
  glint.y = core.y - uy * f * OFFSET_CAP_GLINT;
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
