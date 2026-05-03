// next/src/lib/effects/scintillation-renderer.ts
// SPIKE — light-scatter particles anchored to liquid-glass surface edges.
// Throwaway-quality. Lives only at /spike/glass-scintillation. Does NOT touch
// canvas-renderer.ts / physics.ts / LivingBlobField.tsx / production routes.
// Read .planning/spikes/glass-scintillation/SPIKE.md.
//
// Reuse from spike/particle-blob (git tag): ParticleEngine class skeleton,
// single rAF loop, DPR cap 2, two-pass render (atmosphere + bright cores),
// the sin²(πφ) heartbeat micro-pulse. Drop: cloud/heart morph, cursor
// force-field, parametric heart formula.
//
// Decisions locked by spike brief:
//   #1 Hybrid — subtle ambient always, intensity 0.3..1.0 with blob proximity.
//   #2 24 particles per surface, edge-anchored only. No interior fill.
//   #3 White (rgba 255 255 255 .6) base → green tint (--blob-core / #35B678)
//      when blob is within 200px of nearest particle. Smooth interpolation.
//   #6 Rounded-rectangle perimeter. Sample N points uniformly along total
//      perimeter length, with corner radius (≥12px) considered.
//   #7 Drift — anchor walks slowly along perimeter (period 8-15s per lap)
//      with sin²(πφ) micro-pulse on radial offset.
//   #8 intensity = 0.3 + 0.7 * smoothstep(400, 100, distToBlob).
//   #9 Blob position read from CSS vars --blob-x / --blob-y on :root.
//      No direct coupling to LivingBlobField.

export interface SurfaceDescriptor {
  id: string;
  bounds: DOMRect | { left: number; top: number; width: number; height: number };
  cornerRadius: number;
}

interface SurfaceParticle {
  /** Position along perimeter [0, 1). */
  perimeterPos: number;
  /** Speed (per ms) — perimeter laps. Negative = ccw. */
  perimeterSpeed: number;
  /** Phase offset for sin²(πφ) micro-pulse, 0..1. */
  phase: number;
  /** Per-particle slight radial offset normal to edge (px). Wobbles via micro-pulse. */
  radialOffsetBase: number;
  /** Cached frame x/y in CSS pixels. */
  x: number;
  y: number;
}

interface SurfaceBucket {
  id: string;
  /** Cached as plain numbers — DOMRect access in hot loop is expensive. */
  left: number;
  top: number;
  width: number;
  height: number;
  cornerRadius: number;
  /** Total perimeter length (for uniform sampling). */
  perimeter: number;
  particles: SurfaceParticle[];
}

interface DebugApi {
  surfaceCount: number;
  particleCount: number;
  fps: number;
  blobPos: { x: number; y: number };
  intensityAvg: number;
  enabled: boolean;
  setEnabled: (on: boolean) => void;
}

declare global {
  interface Window {
    __scintillationDebug?: DebugApi;
  }
}

interface BrandColor {
  r: number;
  g: number;
  b: number;
}

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

function readBlobPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  const cs = getComputedStyle(document.documentElement);
  const xRaw = cs.getPropertyValue('--blob-x').trim();
  const yRaw = cs.getPropertyValue('--blob-y').trim();
  const x = parsePxLike(xRaw, window.innerWidth * 0.5);
  const y = parsePxLike(yRaw, window.innerHeight * 0.5);
  return { x, y };
}

/** Parse `12px`, `50vw`, `50vh`, raw numbers. */
function parsePxLike(raw: string, fallback: number): number {
  if (!raw) return fallback;
  const num = parseFloat(raw);
  if (!isFinite(num)) return fallback;
  if (raw.endsWith('vw')) return (num / 100) * window.innerWidth;
  if (raw.endsWith('vh')) return (num / 100) * window.innerHeight;
  return num;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  // Standard smoothstep. edge0 > edge1 inverts (so this works for our 400→100 mapping).
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Map perimeter parameter u in [0, 1) to (x, y, normal) on a rounded rect.
 * The perimeter is decomposed into 8 segments: 4 straight edges + 4 corner arcs.
 * Returns position in absolute viewport coords + outward unit normal.
 */
function pointOnRoundedRect(
  u: number,
  left: number,
  top: number,
  width: number,
  height: number,
  r: number
): { x: number; y: number; nx: number; ny: number } {
  // Clamp r to half of min dimension.
  const rr = Math.min(r, Math.min(width, height) / 2);
  const sLine = Math.PI * rr / 2; // arc length of one quarter circle
  const wInner = width - 2 * rr;
  const hInner = height - 2 * rr;
  const total = 2 * wInner + 2 * hInner + 4 * sLine;
  const target = u * total;

  // Walk segments: top edge, top-right arc, right edge, bottom-right arc,
  // bottom edge (reversed), bottom-left arc, left edge (reversed), top-left arc.
  let acc = 0;

  // Top edge: (left+rr, top) → (left+rr+wInner, top), normal (0, -1)
  if (target < acc + wInner) {
    const t = target - acc;
    return { x: left + rr + t, y: top, nx: 0, ny: -1 };
  }
  acc += wInner;
  // Top-right arc: angle from -π/2 to 0 (i.e. 270° → 360°) around (left+width-rr, top+rr)
  if (target < acc + sLine) {
    const t = (target - acc) / sLine; // 0..1
    const ang = -Math.PI / 2 + t * (Math.PI / 2);
    const cx = left + width - rr;
    const cy = top + rr;
    return { x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, nx: Math.cos(ang), ny: Math.sin(ang) };
  }
  acc += sLine;
  // Right edge: (left+width, top+rr) → (left+width, top+rr+hInner), normal (1, 0)
  if (target < acc + hInner) {
    const t = target - acc;
    return { x: left + width, y: top + rr + t, nx: 1, ny: 0 };
  }
  acc += hInner;
  // Bottom-right arc: 0 → π/2
  if (target < acc + sLine) {
    const t = (target - acc) / sLine;
    const ang = t * (Math.PI / 2);
    const cx = left + width - rr;
    const cy = top + height - rr;
    return { x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, nx: Math.cos(ang), ny: Math.sin(ang) };
  }
  acc += sLine;
  // Bottom edge (reversed in x): (left+rr+wInner, top+height) → (left+rr, top+height), normal (0, 1)
  if (target < acc + wInner) {
    const t = target - acc;
    return { x: left + rr + wInner - t, y: top + height, nx: 0, ny: 1 };
  }
  acc += wInner;
  // Bottom-left arc: π/2 → π
  if (target < acc + sLine) {
    const t = (target - acc) / sLine;
    const ang = Math.PI / 2 + t * (Math.PI / 2);
    const cx = left + rr;
    const cy = top + height - rr;
    return { x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, nx: Math.cos(ang), ny: Math.sin(ang) };
  }
  acc += sLine;
  // Left edge (reversed): (left, top+rr+hInner) → (left, top+rr), normal (-1, 0)
  if (target < acc + hInner) {
    const t = target - acc;
    return { x: left, y: top + rr + hInner - t, nx: -1, ny: 0 };
  }
  acc += hInner;
  // Top-left arc: π → 3π/2
  const t = (target - acc) / sLine;
  const ang = Math.PI + t * (Math.PI / 2);
  const cx = left + rr;
  const cy = top + rr;
  return { x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, nx: Math.cos(ang), ny: Math.sin(ang) };
}

function perimeterOf(width: number, height: number, r: number): number {
  const rr = Math.min(r, Math.min(width, height) / 2);
  const wInner = width - 2 * rr;
  const hInner = height - 2 * rr;
  return 2 * wInner + 2 * hInner + 2 * Math.PI * rr;
}

const PARTICLES_PER_SURFACE = 24;

export class ScintillationEngine {
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
  private intensityAvg = 0;
  private blobPos = { x: 0, y: 0 };

  private enabled = true;
  private reducedMotion = false;
  private staticRendered = false;

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
    if (typeof window !== 'undefined' && window.__scintillationDebug) {
      delete window.__scintillationDebug;
    }
  }

  /** Replace the surface set. Called on initial mount + every ResizeObserver tick. */
  updateSurfaces(surfaces: SurfaceDescriptor[]): void {
    const next: SurfaceBucket[] = [];
    for (const s of surfaces) {
      const b = s.bounds;
      const width = b.width;
      const height = b.height;
      if (width <= 0 || height <= 0) continue;
      const cornerRadius = Math.max(0, s.cornerRadius || 12);
      const perimeter = perimeterOf(width, height, cornerRadius);

      // Try to preserve existing particle phase if same id, so resize doesn't
      // visually jump the scintillation.
      const existing = this.buckets.find(bk => bk.id === s.id);
      const particles: SurfaceParticle[] = [];
      for (let i = 0; i < PARTICLES_PER_SURFACE; i++) {
        const prev = existing?.particles[i];
        if (prev) {
          particles.push({
            perimeterPos: prev.perimeterPos,
            perimeterSpeed: prev.perimeterSpeed,
            phase: prev.phase,
            radialOffsetBase: prev.radialOffsetBase,
            x: 0,
            y: 0,
          });
        } else {
          // Stagger positions uniformly + small jitter.
          const jitter = (Math.random() - 0.5) * (1 / PARTICLES_PER_SURFACE) * 0.6;
          const baseU = i / PARTICLES_PER_SURFACE + jitter;
          // Period 8-15s per lap. Half ccw, half cw.
          const lapMs = 8000 + Math.random() * 7000;
          const dir = Math.random() < 0.5 ? -1 : 1;
          particles.push({
            perimeterPos: ((baseU % 1) + 1) % 1,
            perimeterSpeed: dir / lapMs,
            phase: Math.random(),
            // Outward normal offset 0..3px. Dust catches glance light slightly above the edge.
            radialOffsetBase: Math.random() * 3,
            x: 0,
            y: 0,
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

  private exposeDebug(): void {
    if (typeof window === 'undefined') return;
    window.__scintillationDebug = {
      surfaceCount: this.buckets.length,
      particleCount: this.buckets.length * PARTICLES_PER_SURFACE,
      fps: 0,
      blobPos: this.blobPos,
      intensityAvg: 0,
      enabled: this.enabled,
      setEnabled: (on: boolean) => this.setEnabled(on),
    };
  }

  private handleResize(): void {
    if (!this.canvas || !this.ctx) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // DPR cap 2 (consistency w/ canvas-renderer.ts)
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

    // FPS rolling avg (last 30 frames).
    if (dt > 0) {
      const inst = 1000 / dt;
      this.fpsSamples.push(inst);
      if (this.fpsSamples.length > 30) this.fpsSamples.shift();
      this.fps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    }

    if (this.enabled) {
      // Reduced-motion: render once with frozen positions and never advance.
      if (this.reducedMotion) {
        if (!this.staticRendered) {
          this.advance(0, now);
          this.render();
          this.staticRendered = true;
        }
      } else {
        this.advance(dt, now);
        this.render();
      }
    }

    if (typeof window !== 'undefined' && window.__scintillationDebug) {
      window.__scintillationDebug.fps = Math.round(this.fps);
      window.__scintillationDebug.surfaceCount = this.buckets.length;
      window.__scintillationDebug.particleCount = this.buckets.length * PARTICLES_PER_SURFACE;
      window.__scintillationDebug.blobPos = this.blobPos;
      window.__scintillationDebug.intensityAvg = this.intensityAvg;
      window.__scintillationDebug.enabled = this.enabled;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private advance(dt: number, now: number): void {
    // Read blob pos once per frame (single getComputedStyle call).
    this.blobPos = readBlobPosition();

    // sin²(πφ) micro-pulse — reused from spike/particle-blob heart pulse trick.
    // Period 1.4s feels like a slow breathing rhythm for glass surface; tied to
    // each particle's per-particle phase so they don't sync into a pump.
    const PULSE_PERIOD_MS = 1400;
    const pulseT = (now % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;

    for (const bucket of this.buckets) {
      for (const p of bucket.particles) {
        // Walk along perimeter.
        p.perimeterPos += p.perimeterSpeed * dt;
        p.perimeterPos -= Math.floor(p.perimeterPos); // wrap to [0,1)

        // sin²(πφ) per-particle micro-pulse on radial offset (0..1 → 0..1).
        const ph = (pulseT + p.phase) % 1;
        const pulse = Math.sin(Math.PI * ph) ** 2; // 0..1
        const radial = p.radialOffsetBase + pulse * 1.5; // 0..(base+1.5)px

        const pt = pointOnRoundedRect(
          p.perimeterPos,
          bucket.left,
          bucket.top,
          bucket.width,
          bucket.height,
          bucket.cornerRadius,
        );
        // Place particle slightly outside the edge along outward normal.
        p.x = pt.x + pt.nx * radial;
        p.y = pt.y + pt.ny * radial;
      }
    }
  }

  private render(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const bx = this.blobPos.x;
    const by = this.blobPos.y;
    const greenR = this.brandGreen.r;
    const greenG = this.brandGreen.g;
    const greenB = this.brandGreen.b;

    let intensitySum = 0;
    let intensityN = 0;

    // Pass 1 — soft halos with screen-blend (cheaper than per-particle gradients).
    ctx.globalCompositeOperation = 'screen';
    for (const bucket of this.buckets) {
      for (const p of bucket.particles) {
        // Distance to blob.
        const dx = p.x - bx;
        const dy = p.y - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Decision #8: 0.3 + 0.7 * smoothstep(400, 100, dist) → 1.0 at ≤100, 0.3 at ≥400.
        const proximity = smoothstep(400, 100, dist); // 0..1
        const intensity = 0.3 + 0.7 * proximity;
        intensitySum += intensity;
        intensityN++;

        // Decision #3: white base → green tint when within ~200px of nearest particle.
        // Use proximity itself as tint factor — feels right because tint co-rises
        // with brightness, exactly matching the "blob is the lamp behind glass" mental model.
        // Tint mostly visible when blob distance ≲ 200px (proximity > ~0.5).
        const tintT = Math.max(0, Math.min(1, (proximity - 0.4) / 0.4)); // 0 below 0.4, 1 above 0.8
        const r = Math.round(255 * (1 - tintT) + greenR * tintT);
        const g = Math.round(255 * (1 - tintT) + greenG * tintT);
        const b = Math.round(255 * (1 - tintT) + greenB * tintT);

        // Atmosphere alpha 0.08..0.18 (modulated).
        const haloAlpha = 0.08 + 0.10 * intensity;
        ctx.fillStyle = `rgba(${r},${g},${b},${haloAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Pass 2 — bright cores on top.
    ctx.globalCompositeOperation = 'source-over';
    for (const bucket of this.buckets) {
      for (const p of bucket.particles) {
        const dx = p.x - bx;
        const dy = p.y - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = smoothstep(400, 100, dist);
        const intensity = 0.3 + 0.7 * proximity;
        const tintT = Math.max(0, Math.min(1, (proximity - 0.4) / 0.4));
        const r = Math.round(255 * (1 - tintT) + greenR * tintT);
        const g = Math.round(255 * (1 - tintT) + greenG * tintT);
        const b = Math.round(255 * (1 - tintT) + greenB * tintT);

        const coreAlpha = 0.6 + 0.35 * intensity; // 0.6..0.95
        ctx.fillStyle = `rgba(${r},${g},${b},${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.intensityAvg = intensityN > 0 ? intensitySum / intensityN : 0;
  }
}
