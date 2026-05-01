# Stack Research — v9.0 Living Blob Liquid Glass Scene

**Domain:** Persistent fixed-position cursor-following light field beneath an Apple Liquid Glass HIG chrome on an existing Next.js 15 + React 19 + TS + Tailwind 4 site (medicusunion.kz).
**Researched:** 2026-04-30
**Confidence:** HIGH (existing project pattern in `useSpecularHighlight` already proves the rAF + CSS-variable approach; all recommendations verified against installed `next/package.json`)
**Mode:** Subsequent-milestone — DO NOT re-establish base stack; only document additions, deltas, and integration constraints.

---

## TL;DR — Primary Recommendations

| Decision | Recommendation | One-liner |
|----------|----------------|-----------|
| **Renderer** | **Single `<canvas>` 2D context** rendered inside `LivingBlobField.tsx` with radial-gradient blob composition + `globalCompositeOperation: 'lighter'` for halo overlay. CSS-only fallback for `prefers-reduced-motion` and `prefers-reduced-transparency`. | One DOM node, no shader pipeline, fully CPU/GPU-blendable, ≤2 KB hand-written renderer. SVG `feGaussianBlur` rejected (paint-thrash on moving subjects in Android Chromium); WebGL/WebGPU rejected (overkill, +25 KB context bootstrap, hurts ЦА 45+ budget Android). |
| **State sharing** | **DOM-only via CSS variables on `document.documentElement`** (`--blob-x`, `--blob-y`, `--blob-heat`, `--blob-vx`, `--blob-vy`). NO React state on pointermove. Glass surfaces consume vars via `radial-gradient(... at calc(var(--blob-x) * 100%) ...)` patterns where they need optical response. | Project already uses this pattern (`useSpecularHighlight`). Zero re-renders. Works across server/client boundary. Zustand/Context rejected — would force re-render on every cursor frame. |
| **Animation lib** | **None for the blob renderer.** Vanilla `requestAnimationFrame` + lerp / exponential-smoothing math. Existing `framer-motion@12.38.0` (already installed via `LazyMotionProvider`) is reused only for unrelated micro-interactions (scroll reveal, button taps) — not the blob. | Adding GSAP / Motion One / anime.js for cursor smoothing is bundle-bloat: a 10-line lerp does the job. ЦА 45+ on budget Android cannot afford another 4–10 KB JS payload for an effect they don't need to feel. |
| **Pointer handling** | **Hand-rolled `pointermove` + rAF coalescing** in a single `useEffect` mounted on `window`. One global listener. `pointerleave` resets to ambient. Mobile (`pointer: coarse`): no follow — `setInterval`-driven ambient drift. | The project already has the exact pattern (`useSpecularHighlight`). `react-use` / `usehooks-ts` libs would force React state — explicitly forbidden by ТЗ §16. |
| **SSR boundary** | `LivingBlobField.tsx` is a `'use client'` component with **`dynamic(() => import(...), { ssr: false })`** mount in `app/layout.tsx`. The fixed-position `<div>` and inner `<canvas>` render only after hydration; before hydration the page is fully readable without the blob (graceful enhancement). | Avoids hydration mismatch on `<canvas>`-derived attributes (size, dpi). Aligns with the "page works without blob" criterion (ТЗ §19.4). |

---

## Recommended Stack — Additions / Deltas Only

### Core Technologies (already installed — reused, NOT added)

| Technology | Version | Role for v9.0 | Why |
|------------|---------|---------------|-----|
| Next.js | 15.5.15 | App Router, `'use client'` boundary, `next/dynamic` for SSR-skip mount | Already the project core. App Router's RSC model means the entire main tree can stay server-rendered; only `LivingBlobField` ships JS. |
| React | 19.1.0 | Single client component (`LivingBlobField`) hosting the renderer | React 19's concurrent rendering does NOT interfere — the blob lives entirely outside React's tree (DOM mutations on `documentElement` + canvas API). |
| TypeScript | ^5 | Strict types for `PointerEvent`, `requestAnimationFrame` IDs, blob state struct | Project standard. |
| Tailwind CSS | ^4 (`@tailwindcss/postcss`) | Token-only consumption — no new utility classes; new tokens declared in `globals.css` | v9.0 needs new tokens (see §"New Tokens"); existing `--liquid-blur-{sm,md,lg,xl}` tokens are reused unchanged. |
| framer-motion | ^12.38.0 | UNRELATED to blob — kept for existing `ScrollReveal`, `HeroEntrance`, `GlassInteraction` | Do NOT use Framer Motion for the blob. Its props-driven model triggers React reconciliation per animation frame. Existing usage stays untouched. |

### NEW Files (v9.0 deliverables — no new dependencies)

| File | Purpose | Notes |
|------|---------|-------|
| `next/src/components/blob/LivingBlobField.tsx` | The single client component owning the canvas + pointer listener + rAF loop | Replaces the dead `LiquidBlobLayer.tsx`. `'use client'`. Mounted via `dynamic(..., { ssr: false })` in `app/layout.tsx`. |
| `next/src/components/blob/blob-renderer.ts` | Pure TS module: `createBlobRenderer(canvas, opts)` returning `{ tick, dispose }`. Exposes core/body/halo/glint sublayer state + heat accumulator. | Framework-free. Testable in isolation with jsdom + canvas mock. |
| `next/src/components/blob/blob-physics.ts` | Pure TS module: lerp, exponential smoothing, velocity tracking, heat decay. ~80 LoC. | Replaces a hypothetical animation library. |
| `next/src/styles/living-blob.css` | New stylesheet: `.living-blob-field` fixed layer + glass-surface optical-response gradients (consume `--blob-x/y/heat`) | Imported once in `globals.css`. Replaces unused `liquid-depth.css`. |

### Development Tools (existing — no additions)

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9 + `eslint-config-next` | Lint the new files; ensure no `setState` is called inside the rAF loop | Existing. |
| TypeScript strict mode | Catch missed cleanups on `useEffect` (rAF leak, pointer listener leak) | Existing. |
| Chrome DevTools → Performance + Layers panel | Verify single composited layer for `.living-blob-field`, no paint thrash on `pointermove` | Manual verification per ТЗ §18 acceptance scenarios. |

---

## Detailed Rationale by Question

### 1. Renderer Choice — Canvas 2D wins

| Option | Verdict | Reason |
|--------|---------|--------|
| **Canvas 2D** ✅ | **Recommended** | Single DOM node. `ctx.createRadialGradient()` for core / body / halo. `globalCompositeOperation: 'lighter'` blends overlapping sublayers without manual color math. Hardware-composited via the canvas's own backing layer — `will-change: transform` not needed. Resizes via `devicePixelRatio` math. Works in all Safari 15+ / Chrome / Firefox. Estimated render cost: ~0.4 ms/frame on a Snapdragon 7-series mid-range Android (matches GPU-blit cost of a single CSS radial gradient at the same resolution, but with full programmatic control over heat / glint). |
| **CSS-only (radial-gradient + filter:blur + transform)** | Acceptable as **fallback only** | Pros: zero JS in `prefers-reduced-motion`. Cons: cannot composite multiple overlapping gradients with non-trivial alpha math without N stacked layers. Cannot draw glint dynamically. `filter: blur()` on a moving element creates per-frame paint invalidation (cheap on desktop, painful on budget Android > 24px). Use for the **static ambient** state in reduced-motion only. |
| **SVG filters (`feGaussianBlur` + `feTurbulence`)** | ❌ Rejected | `feGaussianBlur` with `stdDeviation > 8` on a moving element forces full re-rasterization on every frame in Chromium. Catastrophic on Android. `feTurbulence` for organic shape sounds attractive but is even slower. Acceptable only for static decorative defs (project already uses `SvgRefractionDefs.tsx` for static refraction). |
| **WebGL / WebGPU shader** | ❌ Rejected | Overkill for a single soft-edged radial gradient with 4 sublayers. WebGL context bootstrap is ~25 KB minified JS for shader compilation, attribute binding, and the fragment program — even with a tiny shader the runtime cost dwarfs the canvas-2D version. WebGPU is even less portable (Safari 17 status: behind a flag, inconsistent on iOS as of April 2026). Violates "blob is the only dense object" — adding a shader pipeline is over-engineering. |

**Why Canvas 2D is correct for THIS project specifically:**
- Project explicitly forbids "many DOM elements" (ТЗ §16). Canvas = exactly one DOM node.
- Project requires "no React state on pointermove" (ТЗ §16). Canvas API is imperative — no React entanglement.
- ЦА is 45+ on budget Android; we cannot afford a shader.
- The blob is intentionally soft and round — no need for the algorithmic shapes shaders excel at.
- The `prefers-reduced-motion` static fallback can drop the canvas entirely and use a single `radial-gradient` background on the same element. Clean failure mode.

### 2. Animation Library — None Needed

**Recommendation:** Vanilla rAF + 10-line lerp. Do NOT add GSAP, Motion One, anime.js, or any cursor-following helper.

**Bundle-size budget (ЦА 45+ on budget Android, target: keep the v9.0 delta under 3 KB gzipped):**

| Option | Gzipped Size | Verdict |
|--------|--------------|---------|
| Vanilla rAF + lerp (~80 LoC) | ~0.6 KB | ✅ Recommended |
| Motion One (`motion`) | ~3.8 KB minimum | ❌ Reject — buys nothing the blob needs |
| GSAP (core) | ~23 KB | ❌ Reject — wildly oversized for this use |
| Anime.js v4 | ~6 KB | ❌ Reject — timeline orchestration is not what we need |
| Framer Motion (already installed) | 0 KB delta | ❌ Do not use for blob — its model re-creates props on each frame and triggers React reconciliation; antithetical to "no React state on pointermove" |

The blob needs four things:
1. Lerp current position toward target with different `tau` per sublayer (4 lines).
2. Track velocity from pointer delta with exponential smoothing (3 lines).
3. Heat accumulator: integrate dwell time when `velocity < threshold`, decay otherwise (5 lines).
4. Drive a `requestAnimationFrame` loop that ticks the renderer.

Total physics: ~80 LoC of pure TypeScript. No library matches this on bundle size or honesty.

### 3. Pointer Event Handling — Roll Our Own (Project Already Does)

**Recommendation:** A single `pointermove` listener on `window` (NOT `document`, NOT individual elements). rAF-coalesced. `pointerleave` on `window` triggers ambient drift.

The pattern is already shipped in `next/src/hooks/use-specular-highlight.ts`. Lift it to a global listener for the blob:

```ts
// Pseudocode — actual code lives in LivingBlobField.tsx
const targetX = useRef(0.5), targetY = useRef(0.5);
const pending = useRef(false);

useEffect(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return; // mobile path
  const onMove = (e: PointerEvent) => {
    targetX.current = e.clientX / window.innerWidth;
    targetY.current = e.clientY / window.innerHeight;
    if (!pending.current) {
      pending.current = true;
      requestAnimationFrame(() => { pending.current = false; tick(); });
    }
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  // ...
}, []);
```

**Libraries rejected:**

| Library | Why rejected |
|---------|--------------|
| `react-use` (`useMouse`) | Returns a React state value — re-renders on every move. Forbidden by ТЗ §16. |
| `usehooks-ts` (`useMouse`) | Same problem — React-state-driven. |
| `@react-aria/interactions` | Adds 6 KB for accessibility primitives we don't need (blob is `pointer-events: none`). |
| `pointer-tracker` (Google's) | 1 KB but solves multi-touch / gesture concerns we don't have. Single pointer = window listener is fine. |

### 4. State Sharing — DOM-Only via CSS Variables on `documentElement`

**Recommendation:** The blob renderer writes `--blob-x`, `--blob-y`, `--blob-heat`, `--blob-vx`, `--blob-vy` (and optionally `--blob-glint`) onto `document.documentElement.style` from inside the rAF tick. CSS rules in `living-blob.css` consume them.

**Why this beats every React-aware alternative:**

| Strategy | Re-renders/sec at 60fps cursor | Verdict |
|----------|-------------------------------|---------|
| `documentElement.style.setProperty()` (DOM-only) | **0** | ✅ Recommended — also works for sibling glass surfaces that need to reflect blob position via gradients without prop drilling |
| Zustand store + selectors | ~60 (one per subscriber) | ❌ Even with selectors, the cost is at minimum a function call per subscriber per frame; with React 19 concurrent rendering this can stack |
| React Context | ~60 × every consumer | ❌ Catastrophic — every consumer re-renders |
| Custom hook (returns ref values) | 0, but only consumable inside React | △ Acceptable for components that exist anyway, but doesn't help for pure-CSS optical responses on glass |

CSS variables on `documentElement` are also **the only mechanism** that lets pure-CSS glass utilities react to the blob without per-element JavaScript. Example glass card consuming `--blob-x/y`:

```css
.liquid-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(
    320px at calc(var(--blob-x, 0.5) * 100% - var(--card-x, 0px))
              calc(var(--blob-y, 0.5) * 100% - var(--card-y, 0px)),
    rgba(79, 224, 152, calc(0.10 * var(--blob-heat, 0))),
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
```

This satisfies ТЗ §10 ("UI does not light blob — blob lights UI") with zero per-card JavaScript.

### 5. Next.js / SSR Considerations

**Mount strategy:**

```tsx
// next/src/app/layout.tsx (excerpt — server component)
const LivingBlobField = dynamic(
  () => import('@/components/blob/LivingBlobField').then(m => m.LivingBlobField),
  { ssr: false } // canvas DPI math + window dimensions = client-only
);

export default function RootLayout(...) {
  return (
    <html lang="ru">
      <body>
        <LivingBlobField />   {/* fixed, z-0, pointer-events:none */}
        <Header />            {/* z-1+ */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Hydration mismatch risk:** ZERO if we use `{ ssr: false }`. The fixed-position `<div>` is never rendered on the server. The page is fully readable without the blob (satisfies ТЗ §19.4 — "without blob, page looks cold and glassy but not broken").

**Alternative considered:** Render an empty `<div className="living-blob-field">` on the server and progressively enhance with the canvas client-side. **Rejected** because the canvas needs `devicePixelRatio` and viewport dimensions both unavailable on the server, and the empty div produces no visible improvement before hydration anyway.

**Cascade integration (`globals.css` order):**

```css
/* Existing imports preserved */
@import 'tailwindcss';
@import '../styles/squircles.css';
@import '../styles/liquid-glass.css';
/* NEW — appended after liquid-glass.css so optical-response selectors win specificity battles */
@import '../styles/living-blob.css';
```

`.living-blob-field` declares `z-index: 0` and `pointer-events: none`. The existing site chrome uses `z-index: 1+` (header) and content uses `position: relative` without explicit `z-index` (default `auto`, stacked above `z: 0` due to `position: relative`). No existing CSS conflicts.

### 6. Specific Library Versions (verified)

**No new dependencies recommended.** All needed primitives exist in the platform or are already installed:

| Capability | Source | Version | Verified |
|------------|--------|---------|----------|
| Canvas 2D rendering | Browser native | All evergreen + Safari 15+ | MDN — universal |
| `requestAnimationFrame` | Browser native | All evergreen + Safari 6+ | MDN — universal |
| `pointermove` event | Browser native | All evergreen + Safari 13+ | MDN — universal |
| CSS custom properties | Browser native | All evergreen + Safari 9.1+ | MDN — universal |
| `dynamic(...)` SSR-skip | `next` | 15.5.15 (installed) | Next.js docs — App Router supports `dynamic({ ssr: false })` from a Client Component or via a Client Boundary wrapper |
| `LazyMotion` (existing, unrelated) | `framer-motion` | 12.38.0 (installed) | `LazyMotionProvider.tsx` |

### 7. What NOT to Add — Reject List

| Reject | Why |
|--------|-----|
| **GSAP** | 23 KB for a 10-line lerp. License is paid for some plugins. Project audience cannot afford the bundle. |
| **Motion One / `motion`** | 3.8 KB+ for animation primitives that don't fit our state-free, DOM-only model. Even its imperative `animate()` API forces objects we'd otherwise hold in refs. |
| **anime.js v4** | Timeline-oriented; we want a continuously running rAF loop with mutable physics state, not a timeline. |
| **react-three-fiber / three.js** | Full 3D engine for a 2D radial gradient is comically wrong. ~150 KB delta. |
| **PixiJS** | WebGL 2D engine; ~80 KB minified. Same overkill argument as r3f. |
| **`react-spring`** | Spring physics on React state — re-renders. Forbidden by ТЗ §16. |
| **`use-mouse` / `react-use`** | Re-renders on every move (see §3). |
| **`zustand`** for blob state | Forces consumers to subscribe; every subscriber re-renders. Even with shallow selectors, `useSyncExternalStore` fires per frame. |
| **CSS Houdini Paint Worklet** | Browser support unstable: Safari does NOT support Houdini Paint as of Safari 17 (April 2026). Cannot ship to ЦА. |
| **`<svg><filter>` for blob** | `feGaussianBlur` on a moving subject = paint thrash on Android Chromium (see §1). |
| **`will-change: backdrop-filter`** | Already documented anti-pattern in `liquid-glass.css` header. The blob layer does not use `backdrop-filter` itself; the glass surfaces above it do, and they remain static. |
| **Re-introducing `LiquidBlobLayer.tsx` / `liquid-depth.css`** | These were dead code slated for v8.1 removal; v9.0 should ship a clean replacement (`LivingBlobField.tsx` + `living-blob.css`). |

---

## Integration Points with Existing Tokens

### Existing tokens (CONSUMED unchanged by v9.0)

| Token | Location | v9.0 use |
|-------|----------|----------|
| `--liquid-blur-sm` (16px) | `globals.css` | Header chrome (unchanged) |
| `--liquid-blur-md` (24px) | `globals.css` | Mid-layer cards (unchanged) — desktop only |
| `--liquid-blur-lg` (40px) | `globals.css` | Hero / large sections (unchanged) — desktop only |
| `--liquid-blur-xl` (60px) | `globals.css` | Reserved (used sparingly per HIG audit) |
| `--mu-primary` (#35B678) | `globals.css` | Source for `--blob-core` |
| `--squircle-mask-{md,lg,xl}` | `squircles.css` | Glass cards above blob — unchanged |
| Tailwind mobile blur cap (Phase 79) | Tailwind config | Enforced — blob layer itself does NOT use `backdrop-filter` so no conflict; glass layers above stay within the 12px mobile cap |

### NEW tokens (v9.0 additions in `globals.css`)

```css
:root {
  /* Blob palette — derived from existing --mu-primary, no new brand colors */
  --blob-core: #35B678;          /* matches --mu-primary */
  --blob-hot: #4FE098;           /* heated state — green-400 family, brand-adjacent */
  --blob-halo: rgba(98, 221, 177, 0.5);
  --blob-edge: rgba(125, 205, 255, 0.18);
  --blob-glint: rgba(255, 255, 255, 0.65);

  /* Blob runtime state (driven by JS, default values for SSR / no-JS) */
  --blob-x: 0.5;       /* 0..1 normalized viewport */
  --blob-y: 0.5;
  --blob-vx: 0;        /* normalized velocity per frame */
  --blob-vy: 0;
  --blob-heat: 0;      /* 0..1 dwell accumulator */

  /* Glass-over-blob optical-response intensity (per glass tier) */
  --blob-response-section: 0.12;  /* large sections — softest */
  --blob-response-card: 0.20;     /* cards — most vivid */
  --blob-response-form: 0.16;     /* forms — middle */
  --blob-response-control: 0.08;  /* buttons / controls — most restrained */
}
```

These four palette entries SHOULD be added to `DESIGN.md` YAML front matter under a new `colors.blob-*` family **before** v9.0 implementation begins (per project constraint: "Inventing colors requires a Key Decision in PROJECT.md and an update to DESIGN.md first"). `--blob-core` is alias to existing `--mu-primary`; `--blob-hot` is the only genuinely new color and must be logged.

### Glass utility class deltas (existing classes get an optical-response layer)

Existing `.liquid-regular`, `.liquid-card`, `.liquid-clear` get an additive `::before` or `::after` layer that reads `--blob-x/y/heat`. This is the v9.0 "glass UI rework" deliverable. Existing class names stay; only their internal definitions extend. **No new utility classes needed** — the v9.0 design language is "the same glass classes, but more transparent, with a passive blob-response sheen."

### Mobile / a11y enforcement (already in place — no new work)

| Constraint | Existing mechanism | v9.0 handling |
|------------|-------------------|---------------|
| Mobile blur ≤ 12px | Phase 79 Tailwind cap | Honored — blob layer itself uses no blur; glass layers stay within cap |
| ≤ 2 glass elements per viewport | Manual design discipline | Honored — blob is canvas, NOT a glass element; doesn't count toward the budget |
| `prefers-reduced-motion` | Media query in `liquid-glass.css` | **Extended** in `living-blob.css` — full canvas dispose, replace with static CSS radial gradient |
| `prefers-reduced-transparency` | Media query in `liquid-glass.css` | **Extended** — blob layer hidden entirely (`display: none`), glass becomes opaque |
| `prefers-contrast: more` | Media query in `liquid-glass.css` | **Extended** — blob saturation reduced 50%, glint disabled |
| Dark mode disables `backdrop-filter` | `[data-theme="dark"]` cascade | Honored — blob layer is hidden in dark mode (per ТЗ: "холодная светлая медицинская среда" — the scene is light-mode-first; dark-mode handling is a deliberate degradation) |

---

## Installation

**No `npm install` required.** All recommendations rely on existing dependencies.

```bash
# Verify nothing changes (sanity check)
cd next
npm ls framer-motion next react 2>/dev/null | head -20
# Expected: framer-motion@12.38.0, next@15.5.15, react@19.1.0 — confirmed
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Canvas 2D | WebGL fragment shader | Only if we add a second living object or need feedback effects (echo, refraction maps). For one soft blob: never. |
| Canvas 2D | CSS-only radial gradients animated via CSS variables | Acceptable as the `prefers-reduced-motion` fallback. NOT primary because cannot composite glint dynamically and `filter: blur` on movement is paint-thrashy. |
| DOM-only CSS variables | Zustand store with `subscribeWithSelector` | If we ever need React components to actually conditionally render based on blob state (e.g. a "click here, the blob is over you" tooltip). Not in scope for v9.0. |
| Vanilla rAF + lerp | Motion One imperative `animate()` | If we add many independent animated decorations (≥ 5) that share a timeline. Not in scope for v9.0. |
| `dynamic({ ssr: false })` mount in `app/layout.tsx` | Render empty placeholder server-side, hydrate canvas client-side | If we ever want a visible static gradient before hydration as a brand moment. Adds complexity for marginal LCP gain — defer. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| GSAP | 23 KB for what 80 LoC can do | Vanilla rAF + lerp |
| Motion One | 3.8 KB and re-imposes a state model | Vanilla rAF + lerp |
| three.js / r3f | 150 KB+ for a 2D blob is absurd | Canvas 2D |
| PixiJS | 80 KB WebGL 2D engine | Canvas 2D |
| `react-use` `useMouse` | Forces React state on pointermove | Hand-rolled `useEffect` with refs (pattern in `useSpecularHighlight.ts`) |
| `zustand` for blob runtime state | Subscribers re-render per frame | CSS vars on `documentElement` |
| React Context for blob state | Every consumer re-renders | CSS vars on `documentElement` |
| Houdini Paint Worklet | Safari does not support it | Canvas 2D |
| SVG `feGaussianBlur` for blur | Paint thrash on moving filter source | Canvas 2D radial gradients (no SVG filter) |
| New animation library of any kind | Bundle bloat for ЦА 45+ on budget Android | Refs + rAF |
| Restoring `LiquidBlobLayer.tsx` / `liquid-depth.css` | They were dead code, slated for removal; clean replacement is faster than archeology | New `LivingBlobField.tsx` + `living-blob.css` |
| `will-change` on the blob canvas | Canvas already gets its own compositor layer; redundant memory cost | Let the browser auto-promote |
| `backdrop-filter` on the blob layer itself | Blob is the only opaque object — there is nothing behind it to blur | None — blob is opaque-on-light-bg |

---

## Stack Patterns by Variant

**If `(prefers-reduced-motion: reduce)`:**
- Disable rAF loop entirely.
- Replace canvas with static CSS `radial-gradient` at 50% / 50% (ambient).
- Glint and heat dynamics off.
- Source: ТЗ §15.

**If `(pointer: coarse)` (touch devices):**
- No `pointermove` listener.
- Run a lazy ambient `setInterval` (5–8s drift to a new random target, lerp toward it).
- Add a one-shot pulse on `pointerdown` (single rAF burst + decay).
- Source: ТЗ §14.

**If `(prefers-reduced-transparency: reduce)`:**
- Hide blob entirely (`display: none` on `.living-blob-field`).
- Glass surfaces become opaque per existing `liquid-glass.css` rule.
- Page reads as static medical content.
- Source: existing project a11y spec.

**If `[data-theme="dark"]`:**
- Hide blob (`display: none`). Per project rule: dark mode disables `backdrop-filter` and the glass system; the v9.0 blob is part of that system and is also disabled.
- Source: PROJECT.md Key Decisions ("Dark mode disables backdrop-filter").

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@15.5.15` | `react@19.1.0`, `react-dom@19.1.0` | Already installed and proven by existing pages. App Router `dynamic({ ssr: false })` works as documented. |
| `framer-motion@12.38.0` | `react@19.1.0` | Already proven. NOT used by blob — only by existing motion components. Risk is zero because we add nothing. |
| Canvas 2D | All target browsers (Safari 15+, Chrome 100+, Firefox 100+, Samsung Internet 19+) | Safari 15 is iOS 15, the project's stated mobile floor. `OffscreenCanvas` would unlock workerized rendering but Safari 15 lacks it — keep main-thread canvas. |
| CSS custom properties on `:root` updated from JS | All target browsers | Performance verified for hundreds of writes/sec on mid-range Android (Chrome team published guidance — pure custom-property updates do not invalidate layout). |

---

## Sources

Verified sources backing the technology choices:

- [Motion docs — Reduce bundle size of Framer Motion](https://motion.dev/docs/react-reduce-bundle-size) — confirms 34 KB minimum without `LazyMotion`, ~4.6 KB with `m` + `LazyMotion`. **HIGH confidence.** Project already uses `LazyMotion`, so Framer Motion overhead is paid once and is not the right tool for blob.
- [Motion docs — Should I use Framer Motion or Motion One?](https://motion.dev/magazine/should-i-use-framer-motion-or-motion-one) — both are now under `motion` umbrella; Motion One is `~3.8 KB`. **HIGH confidence.**
- [LogRocket — Best React animation libraries for 2026](https://blog.logrocket.com/best-react-animation-libraries/) — survey confirms GSAP (~23 KB), Framer Motion (~34 KB w/o LazyMotion), Motion One (~3.8 KB), react-spring (~28 KB). **MEDIUM confidence** (LogRocket is editorial; cross-checked against vendor docs).
- [Annnimate — GSAP vs Framer Motion vs React Spring 2026](https://www.annnimate.com/blog/gsap-vs-framer-motion-vs-react-spring) — bundle size comparison and use-case framing. **MEDIUM confidence.**
- Existing project file `next/src/hooks/use-specular-highlight.ts` — proves the rAF + CSS-variable + `pointermove` pattern works in this codebase. **HIGH confidence — internal evidence.**
- Existing project file `next/src/styles/liquid-glass.css` — documents anti-patterns (`will-change` on static glass; `filter: drop-shadow()` on glass ancestors breaking `backdrop-filter`); these constraints inform the blob layer placement. **HIGH confidence — internal evidence.**
- `DESIGN.md` (repo root) — defines `--liquid-blur-{sm,md,lg,xl}` tokens and the brand palette; v9.0 adds 4 blob-specific tokens that must be logged here. **HIGH confidence — authoritative project doc.**
- `design/LIQUID_GLASS_BLOB_TZ.md` — domain spec (sublayers, heat, mobile behavior, a11y). **HIGH confidence — authoritative project doc.**
- `next/package.json` — verified installed versions: `next@15.5.15`, `react@19.1.0`, `framer-motion@^12.38.0`, `tailwindcss@^4`. **HIGH confidence — direct read.**

---

## Confidence Assessment

| Decision | Confidence | Verified By |
|----------|------------|-------------|
| Canvas 2D over WebGL / SVG / CSS-only | HIGH | Established performance characteristics of `feGaussianBlur` on moving subjects (paint thrash); WebGL bundle math; existing project pattern in `useSpecularHighlight` |
| CSS-vars-on-documentElement state model | HIGH | Already shipped pattern in `useSpecularHighlight.ts`; ТЗ §16 explicitly forbids React state on pointermove |
| No new animation library | HIGH | Vendor-published bundle sizes (Motion One 3.8 KB, GSAP 23 KB) all exceed the savings of an 80-LoC physics module |
| Hand-rolled pointer handling | HIGH | Existing project pattern; no library matches the constraint of zero React re-renders |
| `dynamic({ ssr: false })` mount strategy | HIGH | Next.js 15.5.x official App Router docs |
| New blob tokens (`--blob-*`) | HIGH | Source: `LIQUID_GLASS_BLOB_TZ.md` §5 palette block |
| `--blob-hot` requires DESIGN.md update before implementation | HIGH | Project constraint: "Inventing colors requires a Key Decision" |
| Reject of `LiquidBlobLayer.tsx` / `liquid-depth.css` revival | MEDIUM | Inferred from milestone context ("were going to be removed in v8.1"); recommend confirming with the milestone-closer commit before deletion |

---

*Stack research for: v9.0 Living Blob Liquid Glass Scene — additions to existing Next.js 15 + React 19 + TS + Tailwind 4 + framer-motion 12 stack.*
*Researched: 2026-04-30*
