# Phase 91: Blob Engine — Pattern Map

**Mapped:** 2026-04-30
**Files analyzed:** 9 (7 NEW, 2 MODIFIED)
**Analogs found:** 5 / 9 (4 files have NO direct in-repo analog — Canvas 2D, AbortController, MutationObserver, module-level singleton patterns are introduced for the first time in this phase)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `next/src/components/effects/LivingBlobField.tsx` | TSX-effect-shell (`'use client'`, mounts canvas, calls singleton) | event-driven (mount/unmount lifecycle only) | `next/src/components/motion/GlassInteraction.tsx` | role-match (shell-+-hook-attach pattern; the analog is per-component-scoped while shell here is layout-mounted) |
| `next/src/lib/blob-engine/index.ts` | TS-singleton-module (refcount + AbortController + state owner) | event-driven (rAF tick + pointer + matchMedia) | `next/src/hooks/use-specular-highlight.ts` (lifted to module scope) | partial-match (same primitives — rAF, pointer listener, CSS-var write — but lifecycle is module-global, not React-hook) |
| `next/src/lib/blob-engine/canvas-renderer.ts` | TS-pure-render-fn (Canvas 2D draw orchestrator) | request-response (state in, ctx mutations out) | NONE — first Canvas 2D in repo | no analog (use RESEARCH.md §3 + MDN Canvas API) |
| `next/src/lib/blob-engine/physics.ts` | TS-pure-physics (lerp, heat, velocity) | transform (numbers → numbers) | NONE — pure-math module, no analog needed | no analog (use Decision D/E formulas verbatim) |
| `next/src/lib/blob-engine/lissajous.ts` | TS-pure-physics (orbit math + ease decay) | transform | NONE | no analog (use Decision F/J formulas verbatim) |
| `next/src/lib/blob-engine/modes.ts` | TS-pure-resolver + listener-attach (matchMedia + MutationObserver + AbortController glue) | event-driven (env-pref → mode) | `next/src/hooks/use-specular-highlight.ts` lines 28–35 (matchMedia gate snippet) | partial-match (same matchMedia API; PHASE 91 adds `.addEventListener('change', ...)` AND MutationObserver — the listener-style usage has no in-repo analog) |
| `next/src/lib/blob-engine/debug.ts` | TS-utility (NODE_ENV-gated window getter) | request-response (read state) | NONE — first dev-debug global in repo | no analog (use RESEARCH.md §7 NODE_ENV pattern) |
| `next/src/app/layout.tsx` (MODIFY) | TSX-layout (root layout edit — single insertion line) | n/a (declarative tree) | `next/src/app/layout.tsx` lines 53–58 itself (Phase 90 mounted the skeleton; Phase 91 only adds 5th sibling) | exact (same file; insert one line) |
| `next/src/styles/blob.css` (MODIFY) | CSS-canvas-rules (append-only) | n/a | `next/src/styles/blob.css` lines 62–63 (`data-engine-active` toggle pattern) | exact (same file; append-only) |

## Pattern Assignments

### `next/src/components/effects/LivingBlobField.tsx` (TSX-effect-shell)

**Analog:** `next/src/components/motion/GlassInteraction.tsx` (lines 1–4, 20–34) + `next/src/hooks/use-specular-highlight.ts` (lines 1–3, 23–25, 74–80 cleanup pattern).

**Imports / `'use client'` directive pattern** (`GlassInteraction.tsx` lines 1–4):
```tsx
'use client';

import { useRef } from 'react';
import { useSpecularHighlight } from '@/hooks/use-specular-highlight';
```

→ Phase 91 mirrors verbatim, swapping the hook for `startBlobEngine`:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { startBlobEngine } from '@/lib/blob-engine';
```

**Ref + attach pattern** (`GlassInteraction.tsx` lines 25–26):
```tsx
const ref = useRef<HTMLDivElement>(null);
useSpecularHighlight(ref);
```

→ Phase 91 generalizes — ref is for canvas, attach happens inside `useEffect` (not via custom hook) so cleanup function is returned:
```tsx
const canvasRef = useRef<HTMLCanvasElement | null>(null);
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;
  const stop = startBlobEngine({ canvas, parent });
  return stop;          // cleanup choreography
}, []);
```

**Cleanup-returns pattern** (from `use-specular-highlight.ts` lines 74–80):
```ts
return () => {
  el.removeEventListener('pointermove', onPointerMove);
  el.removeEventListener('pointerleave', onPointerLeave);
  if (pending.current) {
    cancelAnimationFrame(rafId.current);
  }
};
```

→ Phase 91 short-circuits this: `startBlobEngine` returns its own stop fn, so the `useEffect` cleanup is just `return stop;`. Listener teardown lives inside the engine module via `AbortController.abort()` (one-shot).

**Render output pattern** — no in-repo analog for `<canvas>`. Use RESEARCH.md §1 verbatim:
```tsx
return <canvas ref={canvasRef} className="blob-canvas" aria-hidden="true" style={{ touchAction: 'none' }} />;
```

**Executor cautions:**
- DO NOT add `useState` / `useReducer` (Pitfall 3.x — render-on-pointer-move).
- DO NOT change to `useLayoutEffect` (RESEARCH.md §1 explicitly prefers `useEffect` for SSR safety).
- DO NOT replicate `useSpecularHighlight` literally — that hook is component-scoped (one ref/listener pair per element). The blob engine is a module-level singleton; the shell merely refcounts into it.
- DO NOT add a separate `parentRef` — `canvas.parentElement` is the parent `.living-blob-field` div per Phase 90 contract.
- Keep dep array empty `[]` — Strict Mode double-invoke is handled by the engine's refcount, not by this component.

---

### `next/src/lib/blob-engine/index.ts` (TS-singleton-module)

**Analog:** `next/src/hooks/use-specular-highlight.ts` (entire file) — the proven rAF + pointer-listener + CSS-var-write combo. **Phase 91 lifts this to module scope.**

**rAF coalescing pattern** (`use-specular-highlight.ts` lines 19–21, 50–56):
```ts
const rafId = useRef<number>(0);
const pending = useRef(false);
const latestEvent = useRef<PointerEvent | null>(null);
// ...
const onPointerMove = (e: PointerEvent) => {
  latestEvent.current = e;
  if (!pending.current) {
    pending.current = true;
    rafId.current = requestAnimationFrame(updatePosition);
  }
};
```

→ Phase 91 lifts to module-state object (no `useRef` — plain closure variables):
```ts
let state: EngineState | null = null;   // module-level, not React-scoped
// pointer event handler writes lastX/lastY/x/y/lastT into state.pointer
// rAF loop reads state.pointer once per frame
```

**Pointer listener body — lift verbatim, but write to state ref instead of `latestEvent`** (RESEARCH.md §"Pattern: Pointer ref write + rAF read" lines 583–593):
```ts
window.addEventListener('pointermove', (e) => {
  s.pointer.lastX = s.pointer.x;
  s.pointer.lastY = s.pointer.y;
  s.pointer.lastT = performance.now();
  s.pointer.x = e.clientX;
  s.pointer.y = e.clientY;
}, { passive: true, signal: s.abort.signal });
```

Note the divergences from `useSpecularHighlight`:
- Listener target is `window`, NOT `el` (engine is global, not element-relative).
- Coordinates are `e.clientX/Y` raw px, NOT `(e.clientX - rect.left) / rect.width * 100` percentages (engine writes viewport-absolute pixels to `:root`, not element-relative percentages to `el.style`).
- `{ passive: true, signal: abort.signal }` — `useSpecularHighlight` uses `removeEventListener` in cleanup; engine uses `AbortController` for atomic teardown of ALL listeners.

**CSS-var-write pattern** (`use-specular-highlight.ts` lines 46–47):
```ts
el.style.setProperty('--mouse-x', mouseX + '%');
el.style.setProperty('--mouse-y', mouseY + '%');
```

→ Phase 91 writes to `document.documentElement.style` (`:root`) instead of element style, with px units, and writes ≥7 vars per frame:
```ts
const root = document.documentElement.style;
root.setProperty('--blob-x', state.layers.core.x + 'px');
root.setProperty('--blob-y', state.layers.core.y + 'px');
root.setProperty('--blob-body-x', state.layers.body.x + 'px');
root.setProperty('--blob-body-y', state.layers.body.y + 'px');
root.setProperty('--blob-halo-x', state.layers.halo.x + 'px');
root.setProperty('--blob-halo-y', state.layers.halo.y + 'px');
root.setProperty('--blob-heat', String(state.heat));
root.setProperty('--blob-velocity', String(state.velocity));
```

**Singleton + refcount + AbortController choreography** — NO in-repo analog. Use RESEARCH.md §"Pattern: Singleton with refcount + AbortController" lines 543–579 verbatim. Key shape:
```ts
let state: EngineState | null = null;

export function startBlobEngine(opts: { canvas: HTMLCanvasElement; parent: HTMLElement }): () => void {
  if (state) {
    state.refcount++;
    return makeStopFn();
  }
  const ctx = opts.canvas.getContext('2d');
  if (!ctx) {
    console.warn('[blob] Canvas 2D unavailable — falling back to static CSS');
    document.documentElement.setAttribute('data-blob-mode', 'static');
    return () => {};
  }
  const abort = new AbortController();
  state = initState(opts.canvas, ctx, opts.parent, abort);
  attachListeners(state);                                // all use { signal: abort.signal }
  state.rafId = requestAnimationFrame(loop);
  document.documentElement.setAttribute('data-blob-mode', state.mode);
  opts.parent.dataset.engineActive = 'true';
  state.refcount = 1;
  return makeStopFn();
}
```

**Page Visibility freeze pattern** — NO in-repo analog. Use RESEARCH.md §"Pattern: Page Visibility freeze" lines 614–624 verbatim. Listener attached via `{ signal: state.abort.signal }`.

**Executor cautions:**
- DO NOT use `useState` / React state inside the module — module-level `let state` only.
- DO NOT call `addEventListener` without `{ signal: state.abort.signal }` — the AbortController is the single teardown choreographer.
- DO NOT call `cancelAnimationFrame` on a null id; guard with `if (state.rafId !== null)`.
- DO NOT clear canvas in `visibilitychange` hidden branch — last frame stays painted to avoid flash on resume (RESEARCH.md §K).
- DO NOT modify `globals.css` or `liquid-glass.css` — engine writes runtime vars via `setProperty` only.

---

### `next/src/lib/blob-engine/canvas-renderer.ts` (TS-pure-render-fn)

**Analog:** NONE — first Canvas 2D usage in repo.

**Reference source:** RESEARCH.md §3 file inventory (lines 181–211), Decision B in CONTEXT.md (compositing rules, DPR cap, draw-call order).

**Constraint trace from existing static CSS** — the static-state radial gradients in `blob.css` lines 31, 40, 49, 58 set the visual baseline the canvas must approximate when active:
```css
.blob-core { background: radial-gradient(circle, var(--blob-core) 0%, transparent 70%); opacity: 0.18; }
.blob-body { background: radial-gradient(circle, var(--blob-halo) 0%, transparent 75%); opacity: 0.35; }
.blob-halo { background: radial-gradient(circle, var(--blob-edge) 0%, transparent 80%); opacity: 0.5; }
.blob-glint{ background: radial-gradient(circle, var(--blob-glint) 0%, transparent 60%); opacity: 0; }
```

→ Canvas equivalents (RESEARCH.md §3): `createRadialGradient(x, y, 0, x, y, radius)` with stop ramps that mirror these `transparent N%` falloffs. Reuse the `--blob-core`, `--blob-edge`, `--blob-halo`, `--blob-hot`, `--blob-glint` token names (read once via `getComputedStyle(documentElement).getPropertyValue(...)`, cache in state, re-read on `data-theme` MutationObserver tick).

**Executor cautions:**
- DPR capped at 2 (Decision B) — `Math.min(devicePixelRatio, 2)`.
- `globalCompositeOperation = 'screen'` for halo/body/core; restore to `'source-over'` before drawing glint and at frame end.
- DO NOT use `filter: blur()` on canvas — visual softness comes from gradient stop ramp + low alpha (Pitfall 1.1 — mobile blur cap).
- DO NOT call `getBoundingClientRect` inside `drawFrame` (Pitfall 1.3 — layout thrash). Cache `viewport: { w, h }` in state on init + on debounced `resize`.

---

### `next/src/lib/blob-engine/physics.ts` (TS-pure-physics)

**Analog:** NONE — pure math.

**Reference:** Decision D (lerp factors 0.18/0.08/0.04, velocity α=0.15, max 1500), Decision E (HEAT_RAMP_MS=2000, HEAT_DECAY_MS=800, DWELL_THRESHOLD=30, DWELL_WINDOW=250), RESEARCH.md §4 signatures.

**Constants block (export verbatim — Phase 92 may tune):**
```ts
export const LERP_CORE = 0.18;
export const LERP_BODY = 0.08;
export const LERP_HALO = 0.04;
export const VELOCITY_ALPHA = 0.15;
export const VELOCITY_MAX = 1500;
export const DWELL_THRESHOLD = 30;
export const DWELL_WINDOW = 250;
export const HEAT_RAMP_MS = 2000;
export const HEAT_DECAY_MS = 800;
// ...
```

**Lerp shape:**
```ts
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}
```

**Executor cautions:**
- Pure functions only — no DOM access, no `window`/`document` reads, no side effects.
- Heat MUST be 0 when `motionEnabled === false` (reduced-motion + dark-mode branches).
- Clamp heat to [0, 1] every frame; clamp velocity to [0, VELOCITY_MAX].
- DO NOT export mutable state from this module — physics functions take `state` as parameter and mutate it externally.

---

### `next/src/lib/blob-engine/lissajous.ts` (TS-pure-physics)

**Analog:** NONE — pure math.

**Reference:** Decision F (PERIOD_X=17000ms, PERIOD_Y=23000ms, AMP_X=0.30, AMP_Y=0.25, PHASE=π/2), Decision J (LEAVE_DECAY_MS=800, easeOutCubic), RESEARCH.md §5 signatures.

**Executor cautions:**
- All time inputs in ms; convert to seconds inside the function (`t = now / 1000`) for readable period constants.
- `easeOutCubic = 1 - (1 - p) ** 3` for leave-window decay.
- DO NOT read `window.innerWidth` here — `vw`/`vh` passed in as parameters (state-cached values from index.ts).

---

### `next/src/lib/blob-engine/modes.ts` (TS-pure-resolver + listener-attach)

**Analog (matchMedia gate):** `next/src/hooks/use-specular-highlight.ts` lines 27–35 — proven matchMedia READ pattern.

**Existing matchMedia READ pattern** (`use-specular-highlight.ts` lines 27–35):
```ts
// Gate: desktop pointer only (mouse / stylus)
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
if (!isFinePointer) return;

// Gate: respect reduced-motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
if (prefersReducedMotion) return;
```

→ Phase 91 generalizes this to a `resolveMode()` pure function that takes booleans as inputs (not directly calling `matchMedia` inside the resolver) so it stays unit-testable. The `index.ts` initialization reads `mql.matches` once and passes them in; the listener layer then re-invokes resolve on each `change` event.

**matchMedia LISTENER pattern** — NO in-repo analog (`useSpecularHighlight` only reads `.matches` once at hook-attach time). Use RESEARCH.md §"Pattern: matchMedia listener" lines 597–602 verbatim:
```ts
const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
mqlMotion.addEventListener('change', () => recomputeMode(state), { signal: state.abort.signal });
```

Three matchMedia listeners required (Decision G):
1. `(prefers-reduced-motion: reduce)`
2. `(prefers-reduced-transparency: reduce)`
3. `(pointer: coarse) and (hover: none)`

**MutationObserver pattern** — NO in-repo analog. Use RESEARCH.md §"Pattern: MutationObserver" lines 604–609 verbatim:
```ts
const observer = new MutationObserver(() => recomputeMode(state));
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
state.themeObserver = observer;            // disconnected in stop fn
```

**Executor cautions:**
- MutationObserver is NOT abortable via AbortController — track `state.themeObserver` separately and `disconnect()` it in `makeStopFn`.
- `resolveMode` MUST be idempotent — return the same mode for the same inputs; the index.ts caller checks `if (newMode !== state.mode)` before mutating `<html data-blob-mode>`.
- DO NOT swallow `pointerout` events with `pointerType === 'touch'` — those are tap-end events, not window-leave (RESEARCH.md §6 edge cases table).

---

### `next/src/lib/blob-engine/debug.ts` (TS-utility, NODE_ENV-gated)

**Analog:** NONE — first dev-only global in repo.

**Reference:** Decision L, RESEARCH.md §"Pattern: NODE_ENV-gated debug attachment" lines 627–645 verbatim.

**Executor cautions:**
- Wrap ALL `attachDebug` / `detachDebug` callsites in `if (process.env.NODE_ENV !== 'production') { ... }` literal guards (NOT a const indirection — webpack DefinePlugin needs the literal for tree-shaking).
- Use `Object.defineProperty(window, '__blobDebug', { configurable: true, get() { ... } })` so values are always-current — NOT a snapshot at attach time.
- TypeScript `declare global { interface Window { __blobDebug?: { ... } } }` for type safety.
- Verify tree-shake: `grep '__blobDebug' .next/static/chunks/*.js` after `pnpm build` returns 0 matches (RESEARCH.md §7).

---

### `next/src/app/layout.tsx` (TSX-layout, MODIFY)

**Analog:** the file itself, lines 53–58 (the existing `.living-blob-field` skeleton).

**Existing mount block** (`layout.tsx` lines 52–58):
```tsx
<SvgRefractionDefs />
<div className="living-blob-field" aria-hidden="true" data-engine-active="false">
  <div className="blob-sublayer blob-core" />
  <div className="blob-sublayer blob-body" />
  <div className="blob-sublayer blob-halo" />
  <div className="blob-sublayer blob-glint" />
</div>
```

**Phase 91 edit (RESEARCH.md §"File Modifications" lines 388–402):** add ONE import + ONE element:
```diff
+ import { LivingBlobField } from '@/components/effects/LivingBlobField';
  ...
   <SvgRefractionDefs />
   <div className="living-blob-field" aria-hidden="true" data-engine-active="false">
     <div className="blob-sublayer blob-core" />
     <div className="blob-sublayer blob-body" />
     <div className="blob-sublayer blob-halo" />
     <div className="blob-sublayer blob-glint" />
+    <LivingBlobField />
   </div>
```

**Executor cautions — frozen ranges (byte-equivalent required outside the insertion):**
- `<html lang="ru" className=...>` — frozen.
- `<body className="bg-mu-text-50 text-mu-text-900 overflow-x-clip">` — frozen.
- Inline `<style>` seed on line 51 — frozen (engine overwrites these vars at runtime; the seed defaults must remain for first paint + Decision M graceful degradation).
- `<SvgRefractionDefs />` order — frozen (must precede `.living-blob-field`).
- The 4 `<div className="blob-sublayer ..." />` siblings — frozen verbatim.
- `<Header />`, `<LazyMotionProvider>`, `<main>`, `<Footer />`, `<StickyBar />` ordering and props — frozen.
- Font declarations, `metadata`, `viewport` — frozen.
- The new `<LivingBlobField />` MUST be the 5th child INSIDE `.living-blob-field` (per Phase 90 contract — canvas as sibling to the 4 sublayer divs, NOT outside the container).

---

### `next/src/styles/blob.css` (CSS-canvas-rules, MODIFY append-only)

**Analog:** the file itself, lines 62–63 — the proven `data-engine-active` toggle pattern.

**Existing toggle pattern** (`blob.css` lines 62–63):
```css
/* Phase 91 handoff: when canvas mounts, divs hide. */
.living-blob-field[data-engine-active="true"] .blob-sublayer { display: none; }
```

**Phase 91 append (RESEARCH.md §"File Modifications" lines 408–428):**
```css
/* Phase 91 — canvas visibility contract */
.blob-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: none;          /* default hidden — engine flips data-engine-active=true on success */
  pointer-events: none;
}
.living-blob-field[data-engine-active="true"] .blob-canvas {
  display: block;
}

/* Phase 91 — dark mode dimming (Decision H) */
[data-theme="dark"] .living-blob-field[data-engine-active="true"] .blob-canvas {
  opacity: 0.30;
  filter: saturate(0.65);
}
```

**Executor cautions — frozen ranges (lines 1–79 byte-equivalent):**
- All comment block lines 1–10 — frozen.
- `.living-blob-field` rule (lines 12–19) — frozen (`position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; contain: layout paint`).
- `.blob-sublayer` base rule (lines 21–25) — frozen.
- `.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint` rules (lines 27–60) — frozen verbatim.
- The `data-engine-active="true"` sublayer-hide rule (line 63) — frozen.
- `@media (max-width: 767.98px)` mobile blur cap block (lines 66–70) — frozen.
- `@media (prefers-reduced-motion: reduce)` block (lines 73–76) — frozen.
- `@media (prefers-reduced-transparency: reduce)` block (lines 77–79) — frozen.
- Phase 91 ONLY appends — no inline edits, no rule deletions.
- DO NOT add `filter: blur()` to `.blob-canvas` (Pitfall 1.1).
- DO NOT add `will-change: ...` to `.blob-canvas` (Pitfall 1.8 — Canvas 2D self-promotes).

---

## Shared Patterns

### Pattern: rAF + pointer ref + CSS-var write
**Source:** `next/src/hooks/use-specular-highlight.ts` lines 17–82 (entire hook)
**Apply to:** `next/src/lib/blob-engine/index.ts` (lifted to module scope; pointer listener body, rAF schedule, CSS-var write)

**Key excerpt — pointer ref write** (lines 50–56):
```ts
const onPointerMove = (e: PointerEvent) => {
  latestEvent.current = e;
  if (!pending.current) {
    pending.current = true;
    rafId.current = requestAnimationFrame(updatePosition);
  }
};
```
→ Engine variant: write directly to `state.pointer.{x,y,lastX,lastY,lastT}` and let the always-running rAF loop read it (no `pending` flag — engine has a continuous rAF, not on-demand).

**Key excerpt — CSS-var write** (lines 46–47):
```ts
el.style.setProperty('--mouse-x', mouseX + '%');
el.style.setProperty('--mouse-y', mouseY + '%');
```
→ Engine variant: target is `document.documentElement.style` (`:root`), units are `'px'` (not `%`), namespace is `--blob-*` (not `--mouse-*` — KEEP NAMESPACES SEPARATE).

**Key excerpt — cleanup teardown** (lines 74–80):
```ts
return () => {
  el.removeEventListener('pointermove', onPointerMove);
  el.removeEventListener('pointerleave', onPointerLeave);
  if (pending.current) {
    cancelAnimationFrame(rafId.current);
  }
};
```
→ Engine variant: replaced by `state.abort.abort()` (one call clears all listeners) + `cancelAnimationFrame(state.rafId)`. The shell's `useEffect` cleanup just returns the engine's stop fn.

### Pattern: rAF throttle for scroll
**Source:** `next/src/hooks/use-scrolled.ts` lines 9–25
**Apply to:** `next/src/lib/blob-engine/index.ts` scroll listener (Decision K — mobile scroll-pause)

**Key excerpt** (lines 9–25):
```ts
let ticking = false;
const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > threshold);
      ticking = false;
    });
    ticking = true;
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
return () => window.removeEventListener('scroll', onScroll);
```
→ Engine variant: scroll handler just sets `state.scrollPaused = true; state.lastScrollAt = performance.now()` and a 250ms-debounced check in the rAF loop unsets it (NO `setState` — pure ref write). `{ passive: true, signal: state.abort.signal }` for the addEventListener.

### Pattern: `'use client'` shell + ref + side-effect attach
**Source:** `next/src/components/motion/GlassInteraction.tsx` lines 1–4, 25–26
**Apply to:** `next/src/components/effects/LivingBlobField.tsx`

**Key excerpt** (lines 1–4, 25–26):
```tsx
'use client';

import { useRef } from 'react';
import { useSpecularHighlight } from '@/hooks/use-specular-highlight';
// ...
const ref = useRef<HTMLDivElement>(null);
useSpecularHighlight(ref);
```
→ Phase 91 variant: ref is `HTMLCanvasElement`, attach happens inside `useEffect` (returns stop fn), NOT via custom hook.

### Pattern: `data-engine-active` toggle (Phase 90 contract — already in repo)
**Source:** `next/src/app/layout.tsx` line 53 (`data-engine-active="false"` default) + `next/src/styles/blob.css` line 63 (`[data-engine-active="true"] .blob-sublayer { display: none }`)
**Apply to:** `next/src/lib/blob-engine/index.ts` (engine flips this on successful start; flips back on full unmount/refcount=0).

The flip mechanism: `opts.parent.dataset.engineActive = 'true'` after rAF schedules; `'false'` in `makeStopFn` after `cancelAnimationFrame` + `abort.abort()`.

---

## No Analog Found

Files with no close match in the codebase (executor uses RESEARCH.md and CONTEXT.md decisions as sole reference):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `next/src/lib/blob-engine/canvas-renderer.ts` | TS-pure-render-fn | Canvas 2D | First Canvas 2D usage in repo. Use Decision B + RESEARCH.md §3. |
| `next/src/lib/blob-engine/physics.ts` | TS-pure-physics | transform | Pure math; constants from Decision D/E. No analog needed. |
| `next/src/lib/blob-engine/lissajous.ts` | TS-pure-physics | transform | Pure math; constants from Decision F/J. No analog needed. |
| `next/src/lib/blob-engine/debug.ts` | TS-utility | NODE_ENV gate | First dev-only global. Use RESEARCH.md §7 Object.defineProperty getter pattern. |
| `next/src/lib/blob-engine/modes.ts` partially | listener-attach | event-driven | matchMedia READ pattern exists in `useSpecularHighlight`; matchMedia LISTENER (`addEventListener('change')`), MutationObserver, AbortController patterns are NEW to repo. Use RESEARCH.md §"Code Examples" verbatim. |

---

## Frozen Files Reminder (executor MUST NOT modify)

| File | Reason |
|------|--------|
| `next/src/styles/liquid-glass.css` | Phase 92 territory |
| `next/src/app/globals.css` token blocks | Phase 90 finalized; engine writes via `setProperty`, NOT file edit |
| `next/src/hooks/use-specular-highlight.ts` | Orthogonal — `--mouse-x/y` namespace kept separate from `--blob-x/y`; reference-only |
| `next/src/components/layout/SvgRefractionDefs.tsx` | Frozen |
| `DESIGN.md` | Phase 90 finalized |
| `next/src/styles/blob.css` lines 1–79 | Append-only; existing rules byte-equivalent |
| `next/src/app/layout.tsx` outside the `<LivingBlobField />` insertion + new import | Mount order frozen; one new import + one new child only |

---

## Metadata

**Analog search scope:**
- `next/src/components/**/*.tsx`
- `next/src/hooks/**/*.ts`
- `next/src/lib/**/*.ts`
- `next/src/app/**/*.tsx`
- `next/src/styles/**/*.css`

**Searches executed:**
- `matchMedia` → 1 file (use-specular-highlight.ts)
- `MutationObserver` → 0 files (NEW pattern in Phase 91)
- `AbortController` → 0 files (NEW pattern in Phase 91)
- `getContext|createRadialGradient|requestAnimationFrame` → 2 files (use-specular-highlight.ts, use-scrolled.ts)
- `visibilitychange` → 0 files (NEW pattern in Phase 91)
- `'use client'` → 10 files (shell pattern broadly used)

**Pattern extraction date:** 2026-04-30
