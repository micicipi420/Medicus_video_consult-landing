# Phase 91 Context — Blob Engine: Renderer, Physics, A11y Branches

**Created:** 2026-04-30
**Milestone:** v9.0 Living Blob Liquid Glass Scene
**Mode:** discuss --auto (claude-decided — user delegated all technical decisions; "ты выбирай")
**Sequencing:** Builds directly on Phase 90 foundation. Unblocks Phase 92 (live blob required to visually verify glass transparency choices on `/`) and Phase 93 (Phase 92 patterns propagate after blob is alive).

## <domain>

Bring the blob to life. On desktop with motion, viscously follow the cursor across 4 sublayers and accumulate heat on dwell. On mobile and reduced-motion environments, alternative branches engage cleanly. Zero React renders per pointer move; no rAF/listener leaks across route navigation; `data-blob-mode` reflects current state.

Phase boundary (FIXED — no scope creep):
- ✅ `LivingBlobField.tsx` React shell + Canvas 2D renderer (4 sublayers via radial gradients)
- ✅ Singleton engine module (`lib/blob-engine/`) — single rAF, single pointermove listener, Strict-Mode + App-Router-leak-safe
- ✅ Lerp physics (core 0.18, body 0.08, halo 0.04) + velocity-driven shape stretch
- ✅ Heat accumulator (1.5-3s dwell ramp, ≥600ms decay, ≤1.4× peak delta)
- ✅ Mode branches: cursor (desktop fine pointer + motion-on), ambient (mobile / coarse pointer / pointer-out-of-window), static (`prefers-reduced-motion`), hidden (`prefers-reduced-transparency`), dark (`[data-theme="dark"]`)
- ✅ Page Visibility API integration (rAF pause/resume on tab hide)
- ✅ Tap-pulse on mobile (≤400ms, rate-limited 1 per 600ms, only on background, scroll-paused)
- ✅ Dev-only `window.__blobDebug` (rafCount, listenerCount, mode, pointer, heat)
- ✅ `data-blob-mode` attribute on `<html>` reflecting current mode
- ✅ Writes runtime CSS vars to `:root` each frame (`--blob-x/y`, `--blob-body-x/y`, `--blob-halo-x/y`, `--blob-heat`, `--blob-velocity`) — Phase 92 reads these for heat-leak gradients
- ❌ Heat-leak `radial-gradient` rules in `liquid-glass.css` (Phase 92)
- ❌ Glass component opacity sweep (Phase 92)
- ❌ Per-route propagation (Phase 93)
- ❌ Lighthouse / axe-core / Playwright UAT (Phase 94 HARD GATE)
- ❌ Real-device UAT (Phase 94 — needs physical iPhone + low-end Android)

## <canonical_refs>

**MANDATORY reads for downstream agents.** Full relative paths.

| Path | Why |
|------|-----|
| `design/LIQUID_GLASS_BLOB_TZ.md` | Primary spec — §5 (palette, sublayers), §6 (motion behavior, lerp asymmetry), §7 (heat accumulator timing), §14 (mobile branch), §15 (a11y branches), §16 (perf rules — single rAF, single listener, no layout writes, mobile blur cap), §17 (technical model — `position: fixed; inset: 0; z-index: 0; pointer-events: none` skeleton). **All numerical Phase 91 targets trace here.** |
| `.planning/REQUIREMENTS.md` (BLOB-01..12) | Locked requirements — Canvas 2D, single listener, lerp factors, heat timing, mode branches, leak guards, debug surface. |
| `.planning/research/SUMMARY.md` | Research synthesis — confirms zero new dependencies for engine; identifies `useSpecularHighlight.ts` as proven internal rAF + CSS-var + pointer-listener pattern (Phase 91 lifts to global scope). |
| `.planning/research/PITFALLS.md` | Top pitfalls (#1.1 mobile blur regression, #1.2 layout-prop animation, #1.3 layout thrash in rAF, #1.4 untrothled pointermove, #1.5 rAF leak across routes, #1.6 box-shadow compounding, #1.7 DOM bloat, #1.8 will-change overuse, #2.x a11y branches, #3.x React rerender). Phase 91 mitigates 1.1-1.8 + 2.x + 3.x at engine level. |
| `.planning/ROADMAP.md` (Phase 91 detail) | 5 success criteria — desktop cursor follow, heat accumulator, mobile Lissajous, a11y/dark branches, leak-free across 5 navigations. |
| `.planning/PROJECT.md` | Project constraints (mobile-first ЦА 45+, Russian only, Apple HIG Liquid Glass), KD-v9-001 approved 2026-04-30 (Phase 91 unblocked). |
| `DESIGN.md` (repo root) | Hard constraints (≤2 glass per viewport, mobile blur ≤12px, dark mode disables `backdrop-filter`, anti-pattern appendix entry #11 — no `backdrop-filter` on `.living-blob-field` itself). v9.0 Custom Rules section locked in Phase 90. |
| `.planning/phases/90-foundation-tokens-a11y-wiring-dom-skeleton/90-CONTEXT.md` | Phase 90 locked decisions — flat-sibling DOM shape, `data-engine-active="false" → "true"` handoff contract, inline `<style>` seed location, MeshBackground deletion. |
| `.planning/phases/90-foundation-tokens-a11y-wiring-dom-skeleton/90-04-SUMMARY.md` | What Phase 90 actually shipped — 4 sublayer divs as fallback static state, canvas mounts as 5th sibling. |
| `next/src/styles/blob.css` (Phase 90 created) | Existing static-state CSS for 4 sublayers + reduced-motion fallback + reduced-transparency hide. Phase 91 must **not** modify this — only consume the `data-engine-active` toggle contract. |
| `next/src/app/globals.css` (Phase 90 extended) | All `--blob-*` palette + runtime defaults registered. Phase 91 writes these via `style.setProperty` each frame. |
| `next/src/styles/liquid-glass.css` | A11y `@a11y-layer-coverage` block from Phase 90 already covers `.living-blob-field` and 4 sublayers. Phase 91 must **not** modify this file (frozen until Phase 92). |
| `next/src/app/layout.tsx` (Phase 90) | Mount site for `<LivingBlobField />` — replaces nothing, mounts as canvas sibling INSIDE the existing `.living-blob-field` skeleton. |
| `next/src/hooks/use-specular-highlight.ts` | **Reference pattern** — proven rAF + CSS-var + pointer-listener combination. Phase 91 lifts this approach to global scope (engine module instead of per-component hook). The hook itself stays UNTOUCHED — `--mouse-x/y` namespace is preserved (specular highlights and blob-position are separate concerns). |

## <prior_decisions>

**From Phase 90 (shipped 2026-04-30):**
- Flat-sibling DOM skeleton with `data-engine-active="false"` default. Phase 91 mounts `<canvas>` as 5th sibling and flips to `"true"` once renderer is running.
- Inline `<style>` seed in `<body>` first child seeds 8 runtime vars; Phase 91 overwrites them via `:root.style.setProperty(...)` each frame.
- Static-state CSS in `blob.css` shows 4 sublayer divs when `[data-engine-active="false"]`. Phase 91's job: keep this fallback intact and switch to canvas only when engine successfully starts.
- A11y `@a11y-layer-coverage` block enumerates `.living-blob-field` + 4 sublayers + a future `.blob-canvas` class (added in Phase 91 — but the block already accommodates it via wildcard `.blob-*` enumeration).

**From v8.1 Phase 89 (cheat-pass on a11y):**
- Live OS-toggle test required for `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`. Phase 91 verification (via Playwright in Phase 94) and manual smoke must actually flip OS settings — not just declare media query rules. **Phase 91 plans MUST include manual a11y attestation steps.**

**From v6.0 Phase 67.1 (App Router shared layout):**
- `<LivingBlobField />` mounted in `app/layout.tsx` is shared across all routes. Phase 91 leak guards MUST handle App Router navigation — same component instance survives across routes; `useEffect` cleanup ONLY fires on full unmount, NOT on route change. Singleton must withstand React Strict Mode double-invocation in dev.

**From v6.0 hook pattern:**
- `useSpecularHighlight.ts` already implements single-listener + single-rAF + CSS-var-write pattern at component scope. Phase 91 generalizes this to a module-level singleton because the blob is one global instance, not per-component.

## <decisions>

### Decision A: Engine architecture — module singleton, not React hook

**Locked: module-level singleton in `next/src/lib/blob-engine/index.ts`.**

Why: BLOB-03 mandates singleton survival across Strict Mode + App Router. A React hook can't enforce this — multiple component instances each call the hook and each starts its own rAF. A module-level singleton with refcount lets multiple `<LivingBlobField />` components all be no-ops after the first start.

Module API:
```ts
// next/src/lib/blob-engine/index.ts
export function startBlobEngine(): () => void;  // returns stop function
// Internal: refcount, single rAF id, single listener, internal mode resolver
```

Component shell (`<LivingBlobField />`) calls `startBlobEngine()` in `useEffect` and stores the returned stop function for cleanup. Cleanup on unmount decrements refcount; rAF/listener torn down when refcount hits 0.

### Decision B: Renderer technology — Canvas 2D radial gradients

**Locked: Canvas 2D with `createRadialGradient` per sublayer, painted into a single `<canvas>` element.**

Why:
1. BLOB-01 says Canvas 2D explicitly.
2. Canvas 2D radial gradients are GPU-accelerated in Chromium/WebKit and don't compound `backdrop-filter` cost.
3. SVG would require 4 `<filter>` definitions and re-rasterization; CSS multi-layer would require 4 nested `position: absolute` divs each animated via transform — DOM bloat per PITFALLS #1.7.
4. Canvas size matches viewport; on resize, canvas re-sized (debounced).

Rendering loop per frame:
1. Clear canvas with `ctx.clearRect`
2. Draw halo layer: `createRadialGradient` from `--blob-halo-x/y` with `--blob-halo` color, radius derived from heat (300px base + 100px·heat)
3. Draw body: stronger gradient at `--blob-body-x/y` with mix of `--blob-core` and `--blob-edge`, radius 200px + 50px·heat
4. Draw core: tightest gradient at `--blob-x/y`, mix of `--blob-core` and `--blob-hot` interpolated by `heat`, radius 80px + 30px·heat
5. Draw glint (only when heat > 0.6 OR velocity < 50px/s): tiny `--blob-glint` highlight with very small radius (12px), offset slightly toward cursor direction

Compositing: `ctx.globalCompositeOperation = 'screen'` for halo+body+core (additive light-bleed); 'source-over' for glint.

DPR: canvas backing store sized to `window.innerWidth × devicePixelRatio` (capped at 2 for perf on retina); CSS size matches viewport.

### Decision C: Singleton guard — module state + start/stop refcount

**Locked: module-level state object with refcount + AbortController for listener teardown.**

```ts
// Pseudocode pattern (planner expands)
let state: {
  rafId: number | null;
  refcount: number;
  abort: AbortController | null;
  // ...
} | null = null;

export function startBlobEngine(): () => void {
  if (!state) {
    state = initializeState();
    attachListener();
    scheduleFrame();
    setHtmlAttr('cursor');
  }
  state.refcount++;
  return () => {
    state.refcount--;
    if (state.refcount === 0) {
      cancelAnimationFrame(state.rafId);
      state.abort.abort();
      state = null;
      removeHtmlAttr();
    }
  };
}
```

Strict Mode: dev double-mount calls start twice → refcount=2; cleanup-then-mount sequence → refcount goes 2→1→2 → still no leak (rAF stays active, no orphaned scheduling).
App Router navigation: layout.tsx component never unmounts on route change → refcount stays at 1 across navigations → no rAF/listener accumulation.
Page visibility hide: `cancelAnimationFrame` but state preserved; on visible, scheduleFrame again. Refcount unchanged.

### Decision D: Lerp factors and physics math

**Locked per TZ §17 / BLOB-02 with explicit formulas:**

```
core: lerp 0.18  // catches up fastest
body: lerp 0.08  // visibly trails
halo: lerp 0.04  // most viscous
```

Each frame, for each layer:
```
layer.x += (targetX - layer.x) * lerp_factor;
layer.y += (targetY - layer.y) * lerp_factor;
```

Where `targetX/Y` is the pointer position in cursor mode, or the Lissajous orbit point in ambient mode.

Velocity tracking: low-pass filter with α=0.15 over `pointermove` events. `velocity = sqrt(dx² + dy²) / dt` clamped to [0, 1500] px/s.

Velocity-driven stretch (BLOB-05): in cursor mode, body and halo apply additional shape distortion. Body radius stretches by `1 + min(0.4, velocity/2000)` along motion direction; halo by `1 + min(0.6, velocity/1500)`. On `velocity < 30 px/s` for >150ms, decays back to circular over 400ms.

### Decision E: Heat accumulator math

**Locked per TZ §7 / BLOB-04:**

```
DWELL_THRESHOLD = 30          // px — cursor moves <30px in DWELL_WINDOW = heating
DWELL_WINDOW = 250            // ms
HEAT_RAMP_MS = 2000           // 2.0s linear ramp to peak (within TZ 1.5-3s envelope)
HEAT_PEAK = 1.0               // unitless 0..1
HEAT_DECAY_MS = 800           // 800ms decay (within TZ ≥600ms; chosen for "smooth" feel)
PEAK_LUMINANCE_MULT = 1.4     // TZ ceiling
PEAK_SCALE_MULT = 1.4         // TZ ceiling
```

Each frame:
1. Compute `dwellDistance` = max pointer movement in last DWELL_WINDOW ms
2. If `dwellDistance < DWELL_THRESHOLD`: `heat += (1 - heat) * (deltaTime / HEAT_RAMP_MS)` (linear toward 1.0)
3. Else (motion resumed): `heat += (0 - heat) * (deltaTime / HEAT_DECAY_MS)` (ease-out toward 0)
4. Clamp `heat ∈ [0, 1]`
5. Write to `:root --blob-heat`
6. Apply to renderer: core color = lerp(`--blob-core`, `--blob-hot`, heat); core radius *= 1 + 0.4·heat; opacity *= 1 + 0.4·heat

Heat **disabled** when `prefers-reduced-motion: reduce` (BLOB-04 explicit). In static mode, heat is permanently 0.

### Decision F: Mobile Lissajous parameters

**Locked: 2-axis Lissajous orbit with prime-ratio periods to avoid repeating patterns.**

```
PERIOD_X = 17000     // 17s — prime-ish, avoids easy repetition
PERIOD_Y = 23000     // 23s — relatively prime to PERIOD_X
AMPLITUDE_X = 0.30   // ±30vw from center 50vw
AMPLITUDE_Y = 0.25   // ±25vh from center 50vh
PHASE_OFFSET = π/2   // quarter-cycle offset between axes
```

Position formula:
```
t = performance.now() / 1000;
targetX = 0.5*vw + sin(2π·t/PERIOD_X) * AMPLITUDE_X * vw;
targetY = 0.5*vh + sin(2π·t/PERIOD_Y + PHASE_OFFSET) * AMPLITUDE_Y * vh;
```

This mode runs:
- On `(pointer: coarse) and (hover: none)` (mobile/touch — BLOB-06)
- When pointer is outside window (BLOB-10 — after 800ms decay from last position)
- In dark mode regardless of pointer (BLOB-09 — follow disabled)

Tap-pulse on mobile (BLOB-06):
- Listen on `pointerdown` + `pointerup` with `pointerType === 'touch'`
- Reject if event target matches interactive selector: `button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])`
- Reject if scroll happened within last 200ms (track via scroll listener)
- Reject if last accepted pulse was within 600ms (rate limit)
- On accept: heat → 0.7 instantly, decay over 380ms (within TZ ≤400ms cap)

### Decision G: Mode resolver and `data-blob-mode` attribute

**Locked priority order (highest priority wins):**

```
1. prefers-reduced-transparency: reduce → mode = 'hidden'  (canvas display:none, blob.css fallback also hidden)
2. prefers-reduced-motion: reduce         → mode = 'static' (canvas display:none, blob.css fallback shows static gradient)
3. [data-theme="dark"]                    → mode = 'dark'   (canvas visible, ambient Lissajous, opacity 0.30 saturation 0.65)
4. (pointer: coarse) and (hover: none)    → mode = 'ambient' (mobile — Lissajous + tap-pulse)
5. pointer outside window for >800ms      → mode = 'ambient' (decay then drift)
6. default                                → mode = 'cursor'  (desktop fine pointer, follow + heat)
```

Mode is set on `<html data-blob-mode="...">` imperatively by engine. Listeners:
- `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', recompute)`
- `matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', recompute)`
- `matchMedia('(pointer: coarse) and (hover: none)').addEventListener('change', recompute)`
- `MutationObserver` on `<html>` for `data-theme` attribute changes
- `pointerout` / `pointerover` on `window` for window-leave detection

Mode recompute is **idempotent** — if new mode equals current mode, no-op.

### Decision H: Dark mode dimming math

**Locked: opacity 0.30, saturation filter 0.65, ambient mode forced.**

```css
/* In blob.css — Phase 91 may add this rule */
.living-blob-field[data-engine-active="true"] .blob-canvas {
  /* default: opacity 1, no filter */
}
[data-theme="dark"] .living-blob-field[data-engine-active="true"] .blob-canvas {
  opacity: 0.30;
  filter: saturate(0.65);
}
```

(Phase 91 adds the `[data-theme="dark"]` rule. Mobile blur ≤12px cap from Phase 90 still applies; dark mode does NOT add blur on top.)

Engine logic in dark mode: `data-blob-mode="dark"` → ambient Lissajous (no pointer follow), heat **disabled** (heat permanently 0 — dark mode is a calm state, no excitement).

### Decision I: File structure

**Locked:**

```
next/src/
├── components/
│   └── effects/
│       └── LivingBlobField.tsx          (NEW — React shell, mounts canvas, calls startBlobEngine)
├── lib/
│   └── blob-engine/                     (NEW directory)
│       ├── index.ts                     (singleton API: startBlobEngine, internal state)
│       ├── canvas-renderer.ts           (Canvas 2D draw functions for 4 sublayers)
│       ├── physics.ts                   (lerp, heat accumulator, velocity tracker)
│       ├── lissajous.ts                 (mobile/ambient orbit math)
│       ├── modes.ts                     (mode resolver + matchMedia listeners + MutationObserver)
│       └── debug.ts                     (dev-only window.__blobDebug bindings)
├── styles/
│   └── blob.css                         (EDIT — add canvas visibility rules + dark dimming; preserve all Phase 90 static-state rules)
└── app/
    └── layout.tsx                       (EDIT — add <LivingBlobField /> import + render inside .living-blob-field skeleton AFTER 4 sublayer divs)
```

**Frozen — do NOT touch:**
- `next/src/styles/liquid-glass.css` (Phase 92 territory)
- `next/src/app/globals.css` token blocks (Phase 90 wrote these; engine writes vars via setProperty — does NOT modify the CSS file)
- `next/src/hooks/use-specular-highlight.ts` (orthogonal concern — `--mouse-x/y` namespace stays distinct from `--blob-x/y`)
- `next/src/components/layout/SvgRefractionDefs.tsx` (frozen)
- `DESIGN.md` (Phase 90 finalized; Phase 91 ships no doc changes — phase-91 anti-patterns already in DESIGN.md from Phase 90 entries #1, #2, #3, #11)

### Decision J: Pointer-leave-window decay

**Locked: 800ms ease-out cubic from last position to current Lissajous orbit point.**

On `pointerout` from window:
1. Capture `lastPointer = { x, y }` and `decayStart = now`
2. Set `data-blob-mode="ambient"` immediately (mode already changes; no waiting)
3. For 800ms: `target = lerp(lastPointer, lissajousAt(now), easeOutCubic((now - decayStart) / 800))`
4. After 800ms: pure Lissajous, no carryover

On `pointerover` re-entry: restore `data-blob-mode="cursor"` immediately, reset decay (cursor pickup is sharp — feels responsive).

### Decision K: Page Visibility + scroll handling

**Locked:**
- `document.addEventListener('visibilitychange', ...)`: when `hidden`, `cancelAnimationFrame(state.rafId)` and freeze (don't clear canvas — last frame stays painted to avoid flash on resume); when `visible`, `state.rafId = requestAnimationFrame(loop)`.
- Scroll handling (mobile only — BLOB-06 says "pauses during scroll"):
  - `window.addEventListener('scroll', ..., { passive: true })` debounced
  - On scroll: set `state.scrollPaused = true`, `lastScrollAt = now`
  - 250ms after last scroll event: `state.scrollPaused = false`
  - In Lissajous mode: when `scrollPaused`, freeze position (don't advance time); when resumed, continue from frozen time (no "catch-up" jump)

### Decision L: Debug interface

**Locked: dev-only `window.__blobDebug` exposed when `process.env.NODE_ENV !== 'production'`.**

Shape:
```ts
window.__blobDebug = {
  rafCount: number;        // 1 when engine running, 0 when stopped — Phase 94 Playwright assertion target
  listenerCount: number;   // pointermove listener count on window — also = 1 (Phase 94 target)
  mode: string;            // current data-blob-mode value
  pointer: { x: number, y: number };
  heat: number;            // 0..1
  velocity: number;        // px/s
  // Diagnostics
  startedAt: number;       // performance.now() when engine started
  frameCount: number;      // total frames rendered (debugging perf)
}
```

Production build: object NOT exposed (typeof window.__blobDebug === 'undefined' in prod). Tree-shaken via `if (process.env.NODE_ENV !== 'production')` guard.

### Decision M: Error boundary / canvas init failure

**Locked: silent degradation to static fallback.**

If `canvas.getContext('2d')` returns null (rare — locked-down browsers, hardware accel disabled):
1. Log `console.warn('[blob] Canvas 2D unavailable — falling back to static CSS')`
2. Don't mount canvas (keep `data-engine-active="false"` — blob.css static-state CSS shows the 4 sublayer divs)
3. Don't attach pointermove listener (no point)
4. Don't write CSS vars (defaults from inline `<style>` seed remain)
5. `<html data-blob-mode="static">`

User experience: identical to `prefers-reduced-motion` mode. Acceptable degradation.

### Folded scope clarifications

**Why Canvas 2D, not WebGL/OffscreenCanvas:**
- WebGL adds complexity (shader programs, context loss handling) for marginal visual gain on a slowly-moving radial gradient.
- OffscreenCanvas requires Workers; Safari 15 lacks support per CONTEXT.md `<deferred>` from Phase 90; deferred to v10+.
- Canvas 2D radial gradients are GPU-accelerated in Chromium/WebKit since 2018; sufficient for 60fps at viewport-level radial composites.

**Why module singleton, not Context provider:**
- Engine is a global side-effect (single rAF, single listener, single `<html data-blob-mode>` writer). Context provider would still need refcount logic; module state is simpler and avoids React-render dependence.
- Component is a thin shell that just calls `startBlobEngine()` in `useEffect` for lifecycle hookup.

**Why writing CSS vars to `:root` AND painting to canvas:**
- Canvas paints visible blob.
- CSS vars (`--blob-x/y`, `--blob-heat`) feed Phase 92's heat-leak `radial-gradient` rules in `liquid-glass.css` so glass surfaces respond optically to blob position. Same data, two consumers, single write each frame.

**Why canvas is mounted INSIDE `.living-blob-field`, not as a sibling of it:**
- Phase 90 contract: `data-engine-active="true"` → 4 sublayer divs hidden via `display: none`, canvas visible. Both states must be siblings of the SAME `.living-blob-field` container so the container's `position: fixed; inset: 0; z-index: 0` applies to both.
- Mount pattern: `<canvas className="blob-canvas">` as 5th sibling alongside `.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint`.

**`requestIdleCallback` is NOT used:**
- Visible animation loop must run at display rate; idle callback is for non-visual work. rAF only.

**Touch-action hint:**
- `<canvas>` element gets `style="touch-action: none"` to prevent browser default touch gestures from intercepting tap-pulse detection. Fallback divs already have `pointer-events: none`.

## <code_context>

**Reusable assets confirmed (Phase 90 shipped):**
- `<div class="living-blob-field" aria-hidden="true" data-engine-active="false">` skeleton in `layout.tsx` — Phase 91 mounts canvas inside.
- 4 sublayer divs (`.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint`) — Phase 91 keeps as fallback; CSS in `blob.css` already handles `data-engine-active="true" { display: none }` switch.
- All `--blob-*` palette tokens (5 colors + 8 runtime vars) registered in `globals.css :root`.
- A11y `@a11y-layer-coverage` block already covers `.living-blob-field` and `.blob-*` classes.
- Inline `<style>` seed in `<body>` provides first-paint defaults for runtime vars.

**Reference pattern:**
- `useSpecularHighlight.ts` — read for the proven rAF + pointer-listener + CSS-var-write technique. Phase 91 generalizes to module scope. `--mouse-x/y` (specular) and `--blob-x/y` (blob position) are SEPARATE namespaces — do not conflate.

**Confirmed non-existent (no removal needed):**
- No prior `LivingBlobField.tsx`
- No prior `lib/blob-engine/` directory
- No prior `__blobDebug` global

**Mount order in `layout.tsx` (v9.0 Phase 91 target):**
```jsx
<style>{seed}</style>
<SvgRefractionDefs />
<div className="living-blob-field" aria-hidden="true" data-engine-active="false">
  <div className="blob-sublayer blob-core" />
  <div className="blob-sublayer blob-body" />
  <div className="blob-sublayer blob-halo" />
  <div className="blob-sublayer blob-glint" />
  <LivingBlobField />  {/* NEW — Phase 91 mounts canvas as 5th sibling, flips data-engine-active=true on success */}
</div>
<Header />
<main>...</main>
<Footer />
<StickyBar />
```

`<LivingBlobField />` flips the parent's `data-engine-active` attribute on mount (engine started successfully) and back on unmount. Implementation detail: ref to parent div + setAttribute, OR use `useLayoutEffect` to mutate before paint.

## <deferred>

(Captured for future phases — NOT for Phase 91.)

- **Heat-leak `radial-gradient` rules in `liquid-glass.css`** — Phase 92 (consumes `--blob-x/y` + `--blob-heat` written by Phase 91 engine).
- **Glass component opacity sweep** — Phase 92.
- **Per-route propagation** (service pages, shadcn primitives) — Phase 93.
- **Playwright UAT, Lighthouse CI, axe-core, real-device** — Phase 94 HARD GATE.
- **OffscreenCanvas + Worker** — defer to v10+; Safari 15 lacks support.
- **Per-route blob color theming** — defer to v10+; brand parity disallows in v9.0.
- **WebGL renderer** — defer indefinitely; Canvas 2D is sufficient for Phase 91 motion budget.
- **Pointer prediction / extrapolation** — not needed; lerp already smooths input lag.
- **Multi-blob support** — TZ §1 single-protagonist rule; explicit anti-pattern #1 in DESIGN.md.

## <success_criteria>

Phase 91 ships when:

1. ✅ Desktop with `(pointer: fine)` and motion enabled: cursor moves blob viscously across 4 sublayers (core lerp 0.18, body 0.08, halo 0.04); velocity-driven shape stretch visible during fast movement; pointer-leave-window decays smoothly to ambient over 800ms.
2. ✅ Cursor dwell ≥250ms triggers heat ramp; reaches peak ~2.0s; peak luminance/scale delta ≤1.4×; resuming motion decays heat over 800ms with no jump; heat permanently 0 under `prefers-reduced-motion`.
3. ✅ On `(pointer: coarse) and (hover: none)`: autonomous Lissajous drift (PERIOD_X=17s, PERIOD_Y=23s) with no pointer/touch follow; tap on background pulses ≤380ms (rate-limited 1 per 600ms); blob pauses during scroll.
4. ✅ Mode branches: `prefers-reduced-motion: reduce` → no listener / no rAF / static CSS only; `prefers-reduced-transparency: reduce` → blob hidden; `[data-theme="dark"]` → opacity 0.30, saturation 0.65, follow disabled (ambient drift).
5. ✅ After 5 route navigations (`/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`), `window.__blobDebug.rafCount === 1` and `window.__blobDebug.listenerCount === 1` (singleton-guarded against Strict Mode + App Router); `data-blob-mode` attribute on `<html>` correctly reflects current mode (cursor / ambient / static / hidden / dark); rAF stops when `document.hidden` and restarts on visible.
6. ✅ Page renders without runtime errors on `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` in `pnpm dev`.
7. ✅ `pnpm build` passes with zero new warnings vs Phase 90 baseline.
8. ✅ No new dependencies in `package.json` or `pnpm-lock.yaml`.
9. ✅ Frozen ranges respected: `liquid-glass.css` byte-equivalent to Phase 90 baseline; `globals.css` byte-equivalent (engine writes vars via setProperty, not file edit); `useSpecularHighlight.ts` byte-equivalent.
10. ✅ All 12 BLOB-01..12 requirements marked complete in REQUIREMENTS.md.

---

*Discussed: 2026-04-30 — claude-decided mode (user delegated all technical decisions: "ты выбирай").*
*Next: `/gsd-plan-phase 91 --skip-ui` — generates PLAN.md with task breakdown.*
