// next/src/lib/blob-engine/canvas-renderer.ts
// v9.0 Phase 91 Plan 02 — Canvas 2D radial-gradient renderer for 4 sublayers.
// Decision B: Canvas 2D, DPR cap 2, screen-blend halo+body+core, source-over glint.

export interface BlobColors {
  core: string;   // var(--blob-core)
  hot: string;    // var(--blob-hot)
  halo: string;   // var(--blob-halo)
  edge: string;   // var(--blob-edge)
  glint: string;  // var(--blob-glint)
}

export interface LayerPos { x: number; y: number; }

export interface DrawState {
  ctx: CanvasRenderingContext2D;
  width: number;        // CSS pixels
  height: number;       // CSS pixels
  colors: BlobColors;
  core: LayerPos;       // lerped layer positions in CSS px
  body: LayerPos;
  halo: LayerPos;
  glint: LayerPos;      // Phase 96 BR-02 — own lerped position, no longer locked to core
  heat: number;         // 0..1
  velocity: number;     // px/s — Plan 02 stub: 0; Plan 03 real value
}

/** DPR cap 2 per Decision B. Sets backing-store size and scales context. */
export function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): { width: number; height: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.scale(dpr, dpr);
  return { width, height };
}

/** Reads --blob-* tokens from :root computed style. Cache result; only re-read on theme change. */
export function readColors(): BlobColors {
  const cs = getComputedStyle(document.documentElement);
  return {
    core: cs.getPropertyValue('--blob-core').trim() || '#35B678',
    hot: cs.getPropertyValue('--blob-hot').trim() || '#4FE098',
    halo: cs.getPropertyValue('--blob-halo').trim() || 'rgba(98,221,177,0.5)',
    edge: cs.getPropertyValue('--blob-edge').trim() || 'rgba(125,205,255,0.18)',
    glint: cs.getPropertyValue('--blob-glint').trim() || 'rgba(255,255,255,0.65)',
  };
}

/** Frame draw orchestrator. Plan 02 paints with stub heat=0 + stub velocity=0. */
export function drawFrame(s: DrawState): void {
  const { ctx, width, height, colors, core, body, halo, glint, heat, velocity } = s;

  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'screen';

  drawHalo(ctx, halo.x, halo.y, heat, velocity, colors.halo, colors.edge);
  drawBody(ctx, body.x, body.y, heat, velocity, colors.core, colors.edge);
  drawCore(ctx, core.x, core.y, heat, colors.core, colors.hot);

  ctx.globalCompositeOperation = 'source-over';
  // Phase 96 follow-up: drop the `velocity < 50` trigger. The OR clause meant
  // the glint flashed on whenever the cursor was still — i.e. exactly when the
  // user's looking at the blob. That made the bright center read as an
  // unwanted "nipple" artefact at rest. Heat-only keeps glint as a true
  // specular highlight for warmed-up dwell states (heat ramps over 1.5–3s).
  if (heat > 0.6) {
    drawGlint(ctx, glint.x, glint.y, colors.glint, heat);
  }
}

function drawHalo(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  heat: number, velocity: number,
  haloColor: string, edgeColor: string,
): void {
  // Phase 96 BR-01: extended baseRadius from 300 -> 360 to give the outer
  // alpha falloff ~20% more room to die smoothly (max ~580px at full heat
  // + max velocity stretch).
  const baseRadius = 360 + 100 * heat;
  // Velocity-driven stretch — Plan 02 stub leaves velocity=0 so radius is base; Plan 03 makes this real.
  const radius = baseRadius * (1 + Math.min(0.6, velocity / 1500));
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  // Phase 96 follow-up: replace plateau-then-fade with monotonic exponential-
  // ish alpha decay. The previous 4-stop chain held haloColor solid through
  // 0.0–0.35 (a uniform plateau) and then ramped into edgeColor — the human
  // eye reads the plateau-to-ramp boundary as a perceptible ring. New chain
  // has 6 stops with continuously decreasing alpha across the full radius,
  // no plateau anywhere, so the gradient looks like a smooth glow without a
  // visible "stop" in it. Colors are computed manually because canvas
  // `addColorStop` can't easily multiply a parsed string's alpha — but the
  // halo (rgba α=0.5) and edge (rgba α=0.18) tokens give us the natural
  // bookends, and we hand-blend three intermediate steps.
  grad.addColorStop(0.00, haloColor);                       // halo @ α=0.50
  grad.addColorStop(0.20, 'rgba(98,221,177,0.36)');         // halo dimmed
  grad.addColorStop(0.40, 'rgba(110,213,205,0.24)');        // halo ↔ edge mix
  grad.addColorStop(0.60, edgeColor);                       // edge @ α=0.18
  grad.addColorStop(0.80, 'rgba(125,205,255,0.07)');        // edge fading
  grad.addColorStop(1.00, 'rgba(0,0,0,0)');                 // gone
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  heat: number, velocity: number,
  coreColor: string, edgeColor: string,
): void {
  const baseRadius = 200 + 50 * heat;
  const radius = baseRadius * (1 + Math.min(0.4, velocity / 2000));
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, coreColor);
  grad.addColorStop(0.6, edgeColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCore(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  heat: number,
  coreColor: string, hotColor: string,
): void {
  const radius = 80 + 30 * heat;
  // Heat shifts core color toward hot; gradient handles luminance bump organically.
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, heat > 0.5 ? hotColor : coreColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawGlint(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  glintColor: string,
  heat: number,
): void {
  // Phase 96 follow-up: glint was 12px hard radius with full α=0.65 at center
  // → read as a sharp "nipple" artefact. Now: 28px radius with heat-scaled
  // peak alpha and a soft 3-stop falloff so it blends as ambient sheen,
  // not a point light. Caller now only invokes when heat > 0.6, so peak
  // alpha (heat 0.6→1.0 maps to ~0.30→0.65 scale of glintColor's α=0.65)
  // and the 3-stop curve dies completely at the edge.
  const radius = 28;
  // Heat already > 0.6 at call site; remap 0.6..1.0 → 0..1 for soft ramp-in
  const heatNorm = Math.max(0, Math.min(1, (heat - 0.6) / 0.4));
  const alphaScale = 0.4 + 0.6 * heatNorm; // 0.4..1.0 of glintColor alpha
  const peak = glintColor.replace(/[\d.]+\)$/, `${(0.65 * alphaScale).toFixed(2)})`);
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0.0, peak);
  grad.addColorStop(0.5, glintColor.replace(/[\d.]+\)$/, `${(0.18 * alphaScale).toFixed(2)})`));
  grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
