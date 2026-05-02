// next/src/lib/blob-engine/particle-renderer.ts
// SPIKE — particle-based blob renderer (cloud + heart morph).
// Throwaway-quality. Lives only at /spike/particle-blob. Does NOT touch
// canvas-renderer.ts / physics.ts / LivingBlobField.tsx. Read SPIKE.md.
//
// Decisions locked by spike brief:
//   #5 Canvas 2D, no WebGL.
//   #6 800 particles default, tunable via __particleBlobDebug.
//   #7 Spring-attractor physics with cursor force field.
//   #8 Heart parametric: x=16sin³t, y=-(13cost - 5cos2t - 2cos3t - cos4t).
//   #9 Pulse 1.2s (~70bpm), scale 1.0→1.06 (heart only).
//   B  DPR cap 2 (consistency with canvas-renderer.ts).

export type Morph = 'cloud' | 'heart';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  // each particle owns two anchor points (cloud target + heart target),
  // plus a per-particle drift seed used by the cloud form to feel alive.
  cloudAx: number; cloudAy: number;
  heartAx: number; heartAy: number;
  driftSeed: number;
  // tint variation 0..1 picks a color from the blob palette
  tint: number;
}

interface DebugApi {
  particleCount: number;
  fps: number;
  currentMorph: Morph;
  morphProgress: number; // 0..1 (1 = fully on target)
  setParticleCount: (n: number) => void;
  forceMorph: (form: Morph) => void;
}

declare global {
  interface Window {
    __particleBlobDebug?: DebugApi;
  }
}

interface PaletteRGB {
  core: [number, number, number];
  hot: [number, number, number];
  halo: [number, number, number];
  edge: [number, number, number];
}

function parseColor(raw: string, fallback: [number, number, number]): [number, number, number] {
  const s = raw.trim();
  if (!s) return fallback;
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    const n = parseInt(hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/(\d+(?:\.\d+)?)/g);
  if (!m || m.length < 3) return fallback;
  return [+m[0], +m[1], +m[2]];
}

function readPalette(): PaletteRGB {
  if (typeof window === 'undefined') {
    return {
      core: [53, 182, 120],
      hot: [79, 224, 152],
      halo: [98, 221, 177],
      edge: [125, 205, 255],
    };
  }
  const cs = getComputedStyle(document.documentElement);
  return {
    core: parseColor(cs.getPropertyValue('--blob-core'), [53, 182, 120]),
    hot: parseColor(cs.getPropertyValue('--blob-hot'), [79, 224, 152]),
    halo: parseColor(cs.getPropertyValue('--blob-halo'), [98, 221, 177]),
    edge: parseColor(cs.getPropertyValue('--blob-edge'), [125, 205, 255]),
  };
}

/** Heart parametric (Decision #8). t in [0, 2π]. Returns unit-ish coords. */
function heartPoint(t: number): { x: number; y: number } {
  const x = 16 * Math.sin(t) ** 3;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y };
}

/** Generate N heart anchor points sampled uniformly in t plus interior fill. */
function generateHeartAnchors(n: number, cx: number, cy: number, scale: number): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  // 60% on the boundary curve, 40% interior fill (random barycentric-ish).
  const boundaryCount = Math.floor(n * 0.6);
  const interiorCount = n - boundaryCount;
  for (let i = 0; i < boundaryCount; i++) {
    const t = (i / boundaryCount) * Math.PI * 2;
    const p = heartPoint(t);
    out.push({ x: cx + p.x * scale, y: cy + p.y * scale });
  }
  // Interior: scale heart point inward by a random factor < 1.
  for (let i = 0; i < interiorCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.85;
    const p = heartPoint(t);
    out.push({ x: cx + p.x * scale * r, y: cy + p.y * scale * r });
  }
  return out;
}

/** Generate N cloud anchors: Gaussian-ish blob centered at (cx, cy). */
function generateCloudAnchors(n: number, cx: number, cy: number, radius: number): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller for Gaussian distribution → soft blob shape, no hard edge.
    const u1 = Math.random() || 1e-6;
    const u2 = Math.random();
    const r = Math.sqrt(-2 * Math.log(u1)) * radius * 0.45;
    const theta = 2 * Math.PI * u2;
    out.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
  }
  return out;
}

export class ParticleEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private rafId: number | null = null;
  private running = false;

  private width = 0;
  private height = 0;
  private dpr = 1;

  private morph: Morph = 'cloud';
  // Smooth interpolation between forms (0 = cloud, 1 = heart). Tweens over ~600ms.
  private morphMix = 0;
  private morphTarget = 0;
  private morphSpeed = 1 / 600; // per ms → reaches target in ~600ms

  private cursorX = -9999;
  private cursorY = -9999;
  private hasCursor = false;

  private lastFrameTime = 0;
  private fpsSamples: number[] = [];
  private fps = 0;

  private palette: PaletteRGB = readPalette();

  // Particle count tunable. Re-init particles on change.
  private particleCount = 800;

  private resizeHandler = () => this.handleResize();
  private pointerHandler = (e: PointerEvent) => {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
    this.hasCursor = true;
  };
  private leaveHandler = () => {
    this.hasCursor = false;
  };

  start(canvas: HTMLCanvasElement): void {
    if (this.running) return;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.palette = readPalette();
    this.handleResize();
    this.initParticles();
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('pointermove', this.pointerHandler, { passive: true });
    window.addEventListener('pointerleave', this.leaveHandler, { passive: true });
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
    window.removeEventListener('pointermove', this.pointerHandler);
    window.removeEventListener('pointerleave', this.leaveHandler);
    if (typeof window !== 'undefined' && window.__particleBlobDebug) {
      delete window.__particleBlobDebug;
    }
  }

  morphTo(form: Morph): void {
    this.morph = form;
    this.morphTarget = form === 'heart' ? 1 : 0;
  }

  setCursor(x: number, y: number): void {
    this.cursorX = x;
    this.cursorY = y;
    this.hasCursor = true;
  }

  private exposeDebug(): void {
    if (typeof window === 'undefined') return;
    window.__particleBlobDebug = {
      particleCount: this.particleCount,
      fps: 0,
      currentMorph: this.morph,
      morphProgress: this.morphMix,
      setParticleCount: (n: number) => {
        const clamped = Math.max(50, Math.min(3000, Math.floor(n)));
        this.particleCount = clamped;
        this.initParticles();
        if (window.__particleBlobDebug) window.__particleBlobDebug.particleCount = clamped;
      },
      forceMorph: (form: Morph) => this.morphTo(form),
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
    if (this.particles.length) this.regenerateAnchors();
  }

  private initParticles(): void {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const cloudR = Math.min(this.width, this.height) * 0.32;
    const heartScale = Math.min(this.width, this.height) * 0.022; // ~22 → ~352px tall heart on 1080p

    const cloudAnchors = generateCloudAnchors(this.particleCount, cx, cy, cloudR);
    const heartAnchors = generateHeartAnchors(this.particleCount, cx, cy, heartScale);

    this.particles = new Array(this.particleCount);
    for (let i = 0; i < this.particleCount; i++) {
      const c = cloudAnchors[i];
      const h = heartAnchors[i];
      this.particles[i] = {
        x: c.x, y: c.y,
        vx: 0, vy: 0,
        cloudAx: c.x, cloudAy: c.y,
        heartAx: h.x, heartAy: h.y,
        driftSeed: Math.random() * Math.PI * 2,
        tint: Math.random(),
      };
    }
  }

  private regenerateAnchors(): void {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const cloudR = Math.min(this.width, this.height) * 0.32;
    const heartScale = Math.min(this.width, this.height) * 0.022;

    const cloudAnchors = generateCloudAnchors(this.particles.length, cx, cy, cloudR);
    const heartAnchors = generateHeartAnchors(this.particles.length, cx, cy, heartScale);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].cloudAx = cloudAnchors[i].x;
      this.particles[i].cloudAy = cloudAnchors[i].y;
      this.particles[i].heartAx = heartAnchors[i].x;
      this.particles[i].heartAy = heartAnchors[i].y;
    }
  }

  private loop = (): void => {
    if (!this.running || !this.ctx) return;
    const now = performance.now();
    const dt = Math.min(33, now - this.lastFrameTime); // clamp dt to 33ms (~30fps floor)
    this.lastFrameTime = now;

    // FPS rolling avg (last 30 frames).
    if (dt > 0) {
      const inst = 1000 / dt;
      this.fpsSamples.push(inst);
      if (this.fpsSamples.length > 30) this.fpsSamples.shift();
      this.fps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    }

    // Tween morphMix toward morphTarget.
    const morphDir = Math.sign(this.morphTarget - this.morphMix);
    if (morphDir !== 0) {
      this.morphMix += morphDir * dt * this.morphSpeed;
      if (morphDir > 0 && this.morphMix > this.morphTarget) this.morphMix = this.morphTarget;
      if (morphDir < 0 && this.morphMix < this.morphTarget) this.morphMix = this.morphTarget;
    }

    // Pulse — only meaningful in heart form. (1.2s / ~70bpm; scale 1.0..1.06.)
    const pulsePhase = (now % 1200) / 1200;
    // sharp systole, slow diastole — sin²(πphase) gives a single soft hump per cycle
    const pulseScale = 1 + 0.06 * Math.sin(Math.PI * pulsePhase) ** 2 * this.morphMix;

    this.update(dt, now, pulseScale);
    this.render();

    if (typeof window !== 'undefined' && window.__particleBlobDebug) {
      window.__particleBlobDebug.fps = Math.round(this.fps);
      window.__particleBlobDebug.currentMorph = this.morph;
      window.__particleBlobDebug.morphProgress = this.morphMix;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, now: number, pulseScale: number): void {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const stiffness = 0.0085;     // per ms — spring tension toward target
    const damping = 0.88;         // per-frame velocity retention
    const cursorRadius = 180;     // px — cursor force-field radius
    const cursorRadiusSq = cursorRadius * cursorRadius;
    const cursorForce = 0.45;     // peak repulsion strength
    const driftAmp = 1.4;         // px — cloud drift amplitude (subtle wobble)

    const ps = this.particles;
    const len = ps.length;
    const mix = this.morphMix;
    const invMix = 1 - mix;

    // Drift slow-time for cloud anchors — phases per particle make it feel alive.
    const driftT = now * 0.0008;

    for (let i = 0; i < len; i++) {
      const p = ps[i];

      // Per-particle slow drift on cloud anchors — keeps cloud breathing.
      const drift = invMix * driftAmp;
      const cax = p.cloudAx + Math.sin(driftT + p.driftSeed) * drift;
      const cay = p.cloudAy + Math.cos(driftT * 1.13 + p.driftSeed) * drift;

      // Heart anchors get pulsed (scale around heart center = canvas center).
      const hax = cx + (p.heartAx - cx) * pulseScale;
      const hay = cy + (p.heartAy - cy) * pulseScale;

      // Linear blend between forms for the spring target.
      const tx = cax * invMix + hax * mix;
      const ty = cay * invMix + hay * mix;

      // Spring force toward target.
      let fx = (tx - p.x) * stiffness * dt;
      let fy = (ty - p.y) * stiffness * dt;

      // Cursor repulsion — only if close enough. Dist² avoids sqrt in inner loop.
      if (this.hasCursor) {
        const dx = p.x - this.cursorX;
        const dy = p.y - this.cursorY;
        const distSq = dx * dx + dy * dy;
        if (distSq < cursorRadiusSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / cursorRadius;
          const inv = 1 / dist;
          const strength = cursorForce * falloff * falloff * dt;
          fx += dx * inv * strength;
          fy += dy * inv * strength;
        }
      }

      p.vx = (p.vx + fx) * damping;
      p.vy = (p.vy + fy) * damping;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  private render(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // Two-pass: (1) screen-blended additive halo glow, (2) solid core dots on top.
    // Pass 1 — soft halos with screen blend (cheaper than per-particle radial gradients).
    ctx.globalCompositeOperation = 'screen';
    const halo = this.palette.halo;
    const edge = this.palette.edge;
    const ps = this.particles;
    const len = ps.length;

    for (let i = 0; i < len; i++) {
      const p = ps[i];
      // Tint mixes halo↔edge based on per-particle tint seed.
      const t = p.tint;
      const r = halo[0] * (1 - t) + edge[0] * t;
      const g = halo[1] * (1 - t) + edge[1] * t;
      const b = halo[2] * (1 - t) + edge[2] * t;
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},0.18)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pass 2 — bright cores on top.
    ctx.globalCompositeOperation = 'source-over';
    const core = this.palette.core;
    const hot = this.palette.hot;
    for (let i = 0; i < len; i++) {
      const p = ps[i];
      const t = p.tint;
      const r = core[0] * (1 - t) + hot[0] * t;
      const g = core[1] * (1 - t) + hot[1] * t;
      const b = core[2] * (1 - t) + hot[2] * t;
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},0.85)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
