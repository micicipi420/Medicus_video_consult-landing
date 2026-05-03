// next/src/lib/effects/light-bending-renderer.ts
// SPIKE v3 — light bending around glass corners. Edge-anchored particles
// displaced toward a Blinn-Phong specular sweet-spot computed from the
// radial blob's position. Throwaway-quality. Lives only at
// /spike/glass-light-bending. Does NOT touch canvas-renderer.ts /
// physics.ts / LivingBlobField.tsx / production routes.
// Read .planning/spikes/glass-light-bending/SPIKE.md.
//
// Reuse from spike/glass-scintillation:
//   - rounded-rect perimeter sampler (pointOnRoundedRect)
//   - perimeterOf
//   - readBlobPosition + readBlobCoreColor (CSS var coupling)
//   - smoothstep, parsePxLike, parseHex
//   - SurfaceDescriptor / SurfaceBucket / two-pass render shape
//   - sin²(πφ) heartbeat micro-pulse trick
//
// Reuse from spike/particle-blob:
//   - Per-particle damped lerp (we use k=0.18 toward target, similar in
//     spirit to that spike's spring dynamics but simpler since the target
//     is already the answer of the Blinn-Phong solve, not a force balance).
//
// New for v3:
//   - Blinn-Phong specular intensity per particle:
//       L = normalize(B - P), V = (0,0,1), H = normalize(L + V)
//       I = max(0, dot(N3, H))^shininess    where N3 = (Nx, Ny, 0)
//   - Two displacement components driven by intensity:
//       dispNormal  = I * normalStrength  * NORMAL_MAX_PX  * (Nx, Ny)
//       dispTangent = I * tangentStrength * TANGENT_MAX_PX * tangentTowardSweetSpot
//   - Sweet-spot = the highest-intensity particle in each surface bucket;
//     all other particles in that bucket flock tangentially toward it
//     along the rounded-rect perimeter (signed shortest path in u-space).
//   - Brightness modulation driven by intensity (white → green tint).
//   - Heartbeat micro-pulse only for particles with intensity > 0.4 so the
//     breathing reads as localised at the bright cluster, not surface-wide.

const NORMAL_MAX_PX = 18;   // max outward bulge in pixels at I = 1
const TANGENT_MAX_PX = 8;   // max tangential slide along perimeter at I = 1
const LERP_K = 0.18;        // per-frame interpolation factor toward target
const PULSE_PERIOD_MS = 1400;
const DEFAULT_SHININESS = 16;
const DEFAULT_PARTICLES_PER_SURFACE = 24;

export interface SurfaceDescriptor {
  id: string;
  bounds: DOMRect | { left: number; top: number; width: number; height: number };
  cornerRadius: number;
}

interface BrandColor { r: number; g: number; b: number }

function parseHex(raw: string, fallback: BrandColor): BrandColor {
  const s = raw.trim();
  if (!s.startsWith('#')) return fallback;
  const hex = s.slice(1);
  const expanded = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  const n = parseInt(expanded, 16);
  if (!isFinite(n)) return fallback;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function readBlobCoreColor(): BrandColor {
  if (typeof window === 'undefined') return { r: 53, g: 182, b: 120 };
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--blob-core');
  return parseHex(raw, { r: 53, g: 182, b: 120 });
}

function parsePxLike(raw: string, fallback: number): number {
  if (!raw) return fallback;
  const num = parseFloat(raw);
  if (!isFinite(num)) return fallback;
  if (raw.endsWith('vw')) return (num / 100) * window.innerWidth;
  if (raw.endsWith('vh')) return (num / 100) * window.innerHeight;
  return num;
}

function readBlobPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  const cs = getComputedStyle(document.documentElement);
  const xRaw = cs.getPropertyValue('--blob-x').trim();
  const yRaw = cs.getPropertyValue('--blob-y').trim();
  const x = parsePxLike(xRaw, window.innerWidth * 0.5);
  const y = parsePxLike(yRaw, window.innerHeight * 0.5);
  return { x, y };
}

/**
 * Map perimeter parameter u in [0, 1) to (x, y, outward-normal, tangent-CCW)
 * on a rounded rect. Tangent is the CCW tangent unit vector; CW = -tangent.
 * The 8 segments: top edge, top-right arc, right edge, bottom-right arc,
 * bottom edge (reversed in x), bottom-left arc, left edge (reversed in y),
 * top-left arc.
 */
function pointOnRoundedRect(
  u: number,
  left: number,
  top: number,
  width: number,
  height: number,
  r: number,
): { x: number; y: number; nx: number; ny: number; tx: number; ty: number } {
  const rr = Math.min(r, Math.min(width, height) / 2);
  const sLine = Math.PI * rr / 2;
  const wInner = width - 2 * rr;
  const hInner = height - 2 * rr;
  const total = 2 * wInner + 2 * hInner + 4 * sLine;
  const target = u * total;

  let acc = 0;
  // Top edge: tangent (1, 0) (we walk CCW = top-edge-rightward)
  if (target < acc + wInner) {
    const t = target - acc;
    return { x: left + rr + t, y: top, nx: 0, ny: -1, tx: 1, ty: 0 };
  }
  acc += wInner;
  // Top-right arc: angle -π/2 → 0; tangent = (-sin(ang), cos(ang))
  if (target < acc + sLine) {
    const t = (target - acc) / sLine;
    const ang = -Math.PI / 2 + t * (Math.PI / 2);
    const cx = left + width - rr;
    const cy = top + rr;
    const nx = Math.cos(ang); const ny = Math.sin(ang);
    return { x: cx + nx * rr, y: cy + ny * rr, nx, ny, tx: -ny, ty: nx };
  }
  acc += sLine;
  // Right edge: tangent (0, 1)
  if (target < acc + hInner) {
    const t = target - acc;
    return { x: left + width, y: top + rr + t, nx: 1, ny: 0, tx: 0, ty: 1 };
  }
  acc += hInner;
  // Bottom-right arc: 0 → π/2
  if (target < acc + sLine) {
    const t = (target - acc) / sLine;
    const ang = t * (Math.PI / 2);
    const cx = left + width - rr;
    const cy = top + height - rr;
    const nx = Math.cos(ang); const ny = Math.sin(ang);
    return { x: cx + nx * rr, y: cy + ny * rr, nx, ny, tx: -ny, ty: nx };
  }
  acc += sLine;
  // Bottom edge (reversed in x): tangent (-1, 0)
  if (target < acc + wInner) {
    const t = target - acc;
    return { x: left + rr + wInner - t, y: top + height, nx: 0, ny: 1, tx: -1, ty: 0 };
  }
  acc += wInner;
  // Bottom-left arc: π/2 → π
  if (target < acc + sLine) {
    const t = (target - acc) / sLine;
    const ang = Math.PI / 2 + t * (Math.PI / 2);
    const cx = left + rr;
    const cy = top + height - rr;
    const nx = Math.cos(ang); const ny = Math.sin(ang);
    return { x: cx + nx * rr, y: cy + ny * rr, nx, ny, tx: -ny, ty: nx };
  }
  acc += sLine;
  // Left edge (reversed in y): tangent (0, -1)
  if (target < acc + hInner) {
    const t = target - acc;
    return { x: left, y: top + rr + hInner - t, nx: -1, ny: 0, tx: 0, ty: -1 };
  }
  acc += hInner;
  // Top-left arc: π → 3π/2
  const t = (target - acc) / sLine;
  const ang = Math.PI + t * (Math.PI / 2);
  const cx = left + rr;
  const cy = top + rr;
  const nx = Math.cos(ang); const ny = Math.sin(ang);
  return { x: cx + nx * rr, y: cy + ny * rr, nx, ny, tx: -ny, ty: nx };
}

function perimeterOf(width: number, height: number, r: number): number {
  const rr = Math.min(r, Math.min(width, height) / 2);
  const wInner = width - 2 * rr;
  const hInner = height - 2 * rr;
  return 2 * wInner + 2 * hInner + 2 * Math.PI * rr;
}

interface LBParticle {
  /** Stable anchor along perimeter [0, 1). Does NOT drift in v3 — sweet-spot moves, anchors stay put. */
  perimeterU: number;
  /** Anchor x/y (recomputed on resize). */
  anchorX: number;
  anchorY: number;
  /** Outward unit normal at anchor. */
  normalX: number;
  normalY: number;
  /** CCW tangent unit at anchor. */
  tangentX: number;
  tangentY: number;
  /** Phase for heartbeat micro-pulse. */
  phase: number;
  /** Per-frame computed Blinn-Phong intensity 0..1. */
  intensity: number;
  /** Smoothed rendered position. */
  currentX: number;
  currentY: number;
}

interface SurfaceBucket {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  cornerRadius: number;
  perimeter: number;
  particles: LBParticle[];
}

interface DebugApi {
  surfaceCount: number;
  particleCount: number;
  fps: number;
  blobPos: { x: number; y: number };
  peakIntensity: number;
  /** Index of the brightest particle in the FIRST surface (for diagnostics). */
  sweetSpotIndex: number;
  enabled: boolean;
  normalStrength: number;
  tangentStrength: number;
  shininess: number;
  particlesPerSurface: number;
  setEnabled: (on: boolean) => void;
  setNormalStrength: (v: number) => void;
  setTangentStrength: (v: number) => void;
  setShininess: (v: number) => void;
  setParticlesPerSurface: (n: number) => void;
}

declare global {
  interface Window {
    __lightBendingDebug?: DebugApi;
  }
}

export class LightBendingEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private buckets: SurfaceBucket[] = [];
  private rafId: number | null = null;
  private running = false;

  private width = 0;
  private height = 0;
  private dpr = 1;

  private lastFrameTime = 0;
  private fpsSamples: number[] = [];
  private fps = 0;

  private brandGreen: BrandColor = { r: 53, g: 182, b: 120 };
  private blobPos = { x: 0, y: 0 };
  private peakIntensity = 0;
  private firstSurfaceSweetSpotIdx = -1;

  private enabled = true;
  private reducedMotion = false;
  private staticRendered = false;

  // Tunable sliders.
  private normalStrength = 0.5;
  private tangentStrength = 0.5;
  private shininess = DEFAULT_SHININESS;
  private particlesPerSurface = DEFAULT_PARTICLES_PER_SURFACE;

  /** Cached surface descriptors so we can rebuild particle arrays on slider change. */
  private lastDescriptors: SurfaceDescriptor[] = [];

  private resizeHandler = () => this.handleResize();

  start(canvas: HTMLCanvasElement, surfaces: SurfaceDescriptor[]): void {
    if (this.running) return;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.brandGreen = readBlobCoreColor();
    if (typeof window !== 'undefined') {
      this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    }
    this.handleResize();
    this.updateSurfaces(surfaces);
    window.addEventListener('resize', this.resizeHandler);
    this.running = true;
    this.lastFrameTime = performance.now();
    this.exposeDebug();
    this.loop();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    window.removeEventListener('resize', this.resizeHandler);
    if (typeof window !== 'undefined' && window.__lightBendingDebug) {
      delete window.__lightBendingDebug;
    }
  }

  updateSurfaces(surfaces: SurfaceDescriptor[]): void {
    this.lastDescriptors = surfaces;
    const next: SurfaceBucket[] = [];
    for (const s of surfaces) {
      const b = s.bounds;
      const width = b.width;
      const height = b.height;
      if (width <= 0 || height <= 0) continue;
      const cornerRadius = Math.max(0, s.cornerRadius || 12);
      const perimeter = perimeterOf(width, height, cornerRadius);

      const existing = this.buckets.find(bk => bk.id === s.id);
      const particles: LBParticle[] = [];
      for (let i = 0; i < this.particlesPerSurface; i++) {
        const prev = existing?.particles[i];
        // Stable uniform sampling — anchors don't drift in v3.
        const baseU = i / this.particlesPerSurface;
        const pt = pointOnRoundedRect(baseU, b.left, b.top, width, height, cornerRadius);
        if (prev) {
          particles.push({
            perimeterU: baseU,
            anchorX: pt.x,
            anchorY: pt.y,
            normalX: pt.nx,
            normalY: pt.ny,
            tangentX: pt.tx,
            tangentY: pt.ty,
            phase: prev.phase,
            intensity: 0,
            currentX: prev.currentX,
            currentY: prev.currentY,
          });
        } else {
          particles.push({
            perimeterU: baseU,
            anchorX: pt.x,
            anchorY: pt.y,
            normalX: pt.nx,
            normalY: pt.ny,
            tangentX: pt.tx,
            tangentY: pt.ty,
            phase: Math.random(),
            intensity: 0,
            currentX: pt.x,
            currentY: pt.y,
          });
        }
      }
      next.push({
        id: s.id,
        left: b.left,
        top: b.top,
        width,
        height,
        cornerRadius,
        perimeter,
        particles,
      });
    }
    this.buckets = next;
    this.staticRendered = false;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on && this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.staticRendered = false;
    }
  }

  setNormalStrength(v: number): void {
    this.normalStrength = Math.max(0, Math.min(1, v));
  }

  setTangentStrength(v: number): void {
    this.tangentStrength = Math.max(0, Math.min(1, v));
  }

  setShininess(v: number): void {
    this.shininess = Math.max(2, Math.min(128, v));
  }

  setParticlesPerSurface(n: number): void {
    const clamped = Math.max(4, Math.min(80, Math.floor(n)));
    if (clamped === this.particlesPerSurface) return;
    this.particlesPerSurface = clamped;
    // Force full rebuild — particle counts are baked into the bucket arrays.
    this.buckets = [];
    this.updateSurfaces(this.lastDescriptors);
  }

  private exposeDebug(): void {
    if (typeof window === 'undefined') return;
    window.__lightBendingDebug = {
      surfaceCount: this.buckets.length,
      particleCount: this.buckets.length * this.particlesPerSurface,
      fps: 0,
      blobPos: this.blobPos,
      peakIntensity: 0,
      sweetSpotIndex: -1,
      enabled: this.enabled,
      normalStrength: this.normalStrength,
      tangentStrength: this.tangentStrength,
      shininess: this.shininess,
      particlesPerSurface: this.particlesPerSurface,
      setEnabled: (on: boolean) => this.setEnabled(on),
      setNormalStrength: (v: number) => this.setNormalStrength(v),
      setTangentStrength: (v: number) => this.setTangentStrength(v),
      setShininess: (v: number) => this.setShininess(v),
      setParticlesPerSurface: (n: number) => this.setParticlesPerSurface(n),
    };
  }

  private handleResize(): void {
    if (!this.canvas || !this.ctx) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.staticRendered = false;
  }

  private loop = (): void => {
    if (!this.running || !this.ctx) return;
    const now = performance.now();
    const dt = Math.min(33, now - this.lastFrameTime);
    this.lastFrameTime = now;

    if (dt > 0) {
      const inst = 1000 / dt;
      this.fpsSamples.push(inst);
      if (this.fpsSamples.length > 30) this.fpsSamples.shift();
      this.fps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    }

    if (this.enabled) {
      if (this.reducedMotion) {
        if (!this.staticRendered) {
          this.advance(now, /*snap*/ true);
          this.render(now);
          this.staticRendered = true;
        }
      } else {
        this.advance(now, /*snap*/ false);
        this.render(now);
      }
    }

    if (typeof window !== 'undefined' && window.__lightBendingDebug) {
      const d = window.__lightBendingDebug;
      d.fps = Math.round(this.fps);
      d.surfaceCount = this.buckets.length;
      d.particleCount = this.buckets.length * this.particlesPerSurface;
      d.blobPos = this.blobPos;
      d.peakIntensity = this.peakIntensity;
      d.sweetSpotIndex = this.firstSurfaceSweetSpotIdx;
      d.enabled = this.enabled;
      d.normalStrength = this.normalStrength;
      d.tangentStrength = this.tangentStrength;
      d.shininess = this.shininess;
      d.particlesPerSurface = this.particlesPerSurface;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  /**
   * Per-frame Blinn-Phong solve, sweet-spot pick, target compute, lerp.
   * `snap` skips the lerp (used for reduced-motion first frame).
   */
  private advance(now: number, snap: boolean): void {
    this.blobPos = readBlobPosition();
    const bx = this.blobPos.x;
    const by = this.blobPos.y;
    const shininess = this.shininess;

    let globalPeak = 0;
    let firstSurfaceBest = -1;

    for (let bIdx = 0; bIdx < this.buckets.length; bIdx++) {
      const bucket = this.buckets[bIdx];
      const ps = bucket.particles;

      // Pass A — compute intensity for each particle in the bucket; track max.
      let bestIdx = 0;
      let bestI = -1;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        // L = normalize(B - P). Working in screen space; particle anchor used (cheaper than lerped pos).
        const lx = bx - p.anchorX;
        const ly = by - p.anchorY;
        const llen = Math.sqrt(lx * lx + ly * ly) || 1;
        const lxn = lx / llen;
        const lyn = ly / llen;
        // V = (0, 0, 1). H = normalize(L + V) = normalize((lxn, lyn, 1)).
        const hMag = Math.sqrt(lxn * lxn + lyn * lyn + 1);
        const hx = lxn / hMag;
        const hy = lyn / hMag;
        const hz = 1 / hMag;
        // dot(N3, H) where N3 = (Nx, Ny, 0). Since N has zero z-component
        // and H always has hz > 0, dot(N, H) maxes at sqrt(2)/2 ≈ 0.7071
        // (when N is parallel to L's in-plane direction). We renormalize by
        // that ceiling so a fully-aligned particle reaches intensity = 1 at
        // any shininess. Without this, ndoth^16 would peak at ~0.004 and
        // the displacement effect would be invisible.
        const ndoth = p.normalX * hx + p.normalY * hy;
        const ndothNorm = ndoth > 0 ? ndoth * 1.41421356 : 0; // ÷ (sqrt(2)/2) = × sqrt(2)
        const clamped = ndothNorm > 1 ? 1 : ndothNorm;
        const intensity = Math.pow(clamped, shininess);
        void hz; // hz unused after normalization (it's part of H but cancels in our 2D-N case)
        p.intensity = intensity;
        if (intensity > bestI) {
          bestI = intensity;
          bestIdx = i;
        }
      }

      if (bIdx === 0) firstSurfaceBest = bestIdx;
      if (bestI > globalPeak) globalPeak = bestI;

      // Pass B — compute target position for each particle, lerp toward it.
      const sweet = ps[bestIdx];
      const sweetU = sweet.perimeterU;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        // Tangent direction biases TOWARD sweet-spot anchor along perimeter
        // (signed shortest-path in u-space, accounting for wrap at 0/1).
        let du = sweetU - p.perimeterU;
        if (du > 0.5) du -= 1;
        else if (du < -0.5) du += 1;
        // Sign: positive du → walk CCW toward sweet (tangent direction).
        const tangentSign = du === 0 ? 0 : (du > 0 ? 1 : -1);

        const I = p.intensity;
        // Normal displacement: outward bulge proportional to intensity.
        const dnx = I * this.normalStrength * NORMAL_MAX_PX * p.normalX;
        const dny = I * this.normalStrength * NORMAL_MAX_PX * p.normalY;
        // Tangential flock toward sweet-spot. Magnitude scales with own intensity
        // so dim particles barely move; bright particles flock to the cluster.
        const tMag = I * this.tangentStrength * TANGENT_MAX_PX * tangentSign;
        const dtx = tMag * p.tangentX;
        const dty = tMag * p.tangentY;

        const targetX = p.anchorX + dnx + dtx;
        const targetY = p.anchorY + dny + dty;

        if (snap) {
          p.currentX = targetX;
          p.currentY = targetY;
        } else {
          p.currentX += (targetX - p.currentX) * LERP_K;
          p.currentY += (targetY - p.currentY) * LERP_K;
        }
      }
    }

    this.peakIntensity = globalPeak;
    this.firstSurfaceSweetSpotIdx = firstSurfaceBest;

    // Heartbeat phase advance — referenced by render().
    void now;
  }

  private render(now: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const greenR = this.brandGreen.r;
    const greenG = this.brandGreen.g;
    const greenB = this.brandGreen.b;

    const pulseT = (now % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;

    // Pass 1 — soft halos via screen blend.
    ctx.globalCompositeOperation = 'screen';
    for (const bucket of this.buckets) {
      for (const p of bucket.particles) {
        const I = p.intensity;
        // Heartbeat ONLY on bright particles so breathing reads localised.
        let pulseBoost = 0;
        if (I > 0.4) {
          const ph = (pulseT + p.phase) % 1;
          pulseBoost = Math.sin(Math.PI * ph) ** 2 * 0.15; // 0..0.15 boost
        }
        const brightness = Math.min(1, 0.18 + 0.82 * I + pulseBoost);

        // Tint blends white → blob green as intensity rises.
        const tintT = Math.max(0, Math.min(1, (I - 0.2) / 0.6));
        const r = Math.round(255 * (1 - tintT) + greenR * tintT);
        const g = Math.round(255 * (1 - tintT) + greenG * tintT);
        const b = Math.round(255 * (1 - tintT) + greenB * tintT);

        const haloAlpha = 0.08 + 0.10 * brightness;
        ctx.fillStyle = `rgba(${r},${g},${b},${haloAlpha})`;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Pass 2 — bright cores.
    ctx.globalCompositeOperation = 'source-over';
    for (const bucket of this.buckets) {
      for (const p of bucket.particles) {
        const I = p.intensity;
        let pulseBoost = 0;
        if (I > 0.4) {
          const ph = (pulseT + p.phase) % 1;
          pulseBoost = Math.sin(Math.PI * ph) ** 2 * 0.15;
        }
        const brightness = Math.min(1, 0.18 + 0.82 * I + pulseBoost);

        const tintT = Math.max(0, Math.min(1, (I - 0.2) / 0.6));
        const r = Math.round(255 * (1 - tintT) + greenR * tintT);
        const g = Math.round(255 * (1 - tintT) + greenG * tintT);
        const b = Math.round(255 * (1 - tintT) + greenB * tintT);

        const coreAlpha = 0.6 + 0.35 * brightness;
        ctx.fillStyle = `rgba(${r},${g},${b},${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
