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
  if (heat > 0.6 || velocity < 50) {
    drawGlint(ctx, glint.x, glint.y, colors.glint);
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
  // Phase 96 BR-01: 4-stop feather to eliminate visible halo edge ring.
  // Old chain (3 stops at 0 / 0.7 / 1.0) produced a perceptible ring at the
  // 0.7 transition. New chain holds the inner color longer and adds a
  // mid-feather so the gradient reads as continuous alpha falloff at all
  // zoom levels.
  grad.addColorStop(0.00, haloColor);
  grad.addColorStop(0.35, haloColor);
  grad.addColorStop(0.65, edgeColor);
  grad.addColorStop(1.00, 'rgba(0,0,0,0)');
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
): void {
  const radius = 12;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, glintColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
