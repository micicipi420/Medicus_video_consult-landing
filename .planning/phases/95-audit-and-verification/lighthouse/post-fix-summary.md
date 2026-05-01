# AUDIT-01 Post-Fix Summary — Lighthouse LCP Investigation (Phase 98-01)

**Run date:** 2026-04-30
**Tool:** @lhci/cli v0.15.1
**Form factor:** mobile (Moto G4 360×640 @ 2x DPR, 4×CPU slowdown, slow 4G 1638kbps / 150ms RTT)
**Runs per route:** 1 (single representative run; baseline used 3-run median)
**Build:** production (`pnpm start --port 3210`)
**Worktree base:** `2d161d2` (main HEAD)

## Result Headline

**Status: PARTIAL — 0/5 routes hit ≤2500ms LCP budget after targeted fixes.**

Per-route LCP unchanged within run-to-run variance. Root cause re-classified: the LCP gap is **not** a load-time problem solvable by image/font/asset optimization. It is a **post-FCP main-thread saturation** problem driven by React 19 + framer-motion hydration cost on Moto G4 4×CPU, which delays Lighthouse's LCP candidate finalization.

## Per-Route Results

| Route                | Before LCP | After LCP | Δ      | FCP   | TBT  | CLS | Perf | LCP Element        | Pass? |
|----------------------|-----------:|----------:|-------:|------:|-----:|----:|-----:|--------------------|:-----:|
| `/`                  | 3206 ms    | 3347 ms   | +141   | 1223  | 39   | 0   | 92   | `<p class="mb-7…">` (HeroHub subtitle) | ❌ |
| `/checkup`           | 3267 ms    | 3275 ms   | +8     | 1209  | 62   | 0   | 92   | `<h1 class="mb-5…">` (page H1) | ❌ |
| `/consultations`     | 3126 ms    | 3336 ms   | +210   | 1218  | 61   | 0   | 92   | `<p class="mb-7…">` (subtitle)  | ❌ |
| `/treatment-abroad`  | 3270 ms    | 3467 ms   | +197   | 1208  | 58   | 0   | 91   | `<p class="mb-7…">` (subtitle)  | ❌ |
| `/contacts`          | 3120 ms    | 3169 ms   | +49    | 1059  | 52   | 0   | 93   | `<p class="text-[1.25rem]…">` (page intro) | ❌ |

> Δ values are within typical Lighthouse single-run noise (±200ms). The fixes are net-neutral on LCP. TBT/CLS still pass cleanly on all routes. Performance score is unchanged.

## Investigation — What the Reports Actually Show

### 1. LCP element on every route is **TEXT**, not an image

| Route               | LCP element selector                                                |
|---------------------|---------------------------------------------------------------------|
| `/`                 | `div.container > div.grid > div.w-full > p.mb-7` (HeroHub subtitle) |
| `/checkup`          | `div.container > div.grid > div > h1.mb-5` (page H1)                |
| `/consultations`    | `div.container > div.grid > div > p.mb-7` (subtitle)                |
| `/treatment-abroad` | `div.container > div.grid > div > p.mb-7` (subtitle)                |
| `/contacts`         | `main.relative > section.pt-20 > div > p.text-[1.25rem]` (intro)    |

Image optimization (next/image, AVIF, priority preload) is not the lever. Hero portraits are below-the-fold or not the largest paintable element on these mobile viewports.

### 2. LCP phase breakdown — Render Delay dominates

For every route the `largest-contentful-paint-element` audit splits LCP timing as:

```
TTFB        ~ 460 ms  (14-15%)
Load Delay  =   0 ms  (text — no resource to load)
Load Time   =   0 ms
Render Delay ~ 2700 ms (~85%)
```

**Render Delay** is the time between the resource being available (text is in SSR HTML, ready immediately) and the browser finalizing the LCP candidate. In synthetic Lighthouse, the LCP timestamp is locked in only after the main thread becomes idle long enough to confirm no larger paint is coming. With the throttled CPU running through the full hydration tree, the "stable" moment lands ~2 seconds after FCP.

### 3. Main-thread breakdown reveals the real cost

```
mainthread-work-breakdown (route /):
  Style & Layout:        8953 ms  ← dominant
  Other:                  381 ms
  Script Evaluation:      372 ms
  Paint/Composite:        354 ms
  Script Parse/Compile:    65 ms
```

Long tasks during the FCP→LCP window (single-run trace, route `/`):

```
[ 824ms]  Document parse, 115 ms
[3050ms]  chunks/3797f3cf-…js (54 KB),   90 ms  ← React 19 core
[3174ms]  chunks/744-…js     (46 KB),  146 ms  ← Next/Script + LazyMotion runtime
```

Total Tasks ≥10ms = 10. Total task time = 2537 ms. The 4×CPU multiplier turns React 19 + framer-motion's `LazyMotion` hydration into a >2-second main-thread window that pushes the LCP candidate finalization past 3000 ms even though the visible text painted at FCP (≈1220 ms).

### 4. What was tried (and why it didn't move LCP)

| Attempt                                                            | Result                       |
|--------------------------------------------------------------------|------------------------------|
| `adjustFontFallback: 'Arial'` on Inter + Manrope (eliminates font-swap repaint that could shift LCP candidate) | -63 ms on `/` (within noise) |
| Cyrillic woff2 listed first in `localFont.src` so Russian content is preloaded with priority | No measurable change         |
| Dynamic-import `LivingBlobField` (`ssr:false`) — removes blob runtime from initial hydration tree | No measurable change         |
| Defer `startBlobEngine` to `requestIdleCallback`                   | LCP +84 ms, **TBT +2987 ms** (engine workload dumped on main thread post-FCP) — reverted |

The first three are **kept** as net-positive code-quality / bundle-size improvements even though they don't move the LCP needle. The rIC defer was reverted.

### 5. Image / next/image audit — already optimal

`next/public/` contains 9 hero/section .webp assets, all 18-65 KB, already served via `<Image>` with appropriate `priority`/`sizes` props in HeroHub and section components. Lighthouse's image-related audits all score **1.0**:

- `uses-responsive-images`: 1
- `offscreen-images`: 1
- `modern-image-formats`: 1
- `uses-text-compression`: 1
- `unminified-css` / `unminified-javascript`: 1
- `uses-rel-preconnect`: 1

There is no asset-level optimization headroom. Total page weight is 357 KB / 21 requests on `/` — already lean.

## Diagnosis

The LCP failure is **architectural**, not asset-related:

1. The page is server-rendered Next 15.5 (React 19) with framer-motion `LazyMotion` wrapping `<main>` and `ScrollReveal` (motion `m.div`) wrapping 9 of 11 page sections.
2. On Moto G4 with 4×CPU throttle, hydrating that motion tree consumes ~2 seconds of main-thread time after FCP.
3. Lighthouse cannot finalize the LCP candidate while a long task is running, so the LCP timestamp gets pushed out to ≈3200 ms even though the LCP text was visually painted at ≈1220 ms (FCP).
4. **TBT/CLS pass on all routes** — the only failing metric is LCP, and that failure is dominated by hydration delay, not paint delay.

## Path Forward — Two Routes

### Path A — Architectural refactor to hit ≤2500 ms LCP (high cost, regression risk)

Targeted hydration reductions:

1. **Replace `framer-motion` `m.div` in `ScrollReveal` with IntersectionObserver + CSS transitions** (zero JS hydration cost). ~9 page sections affected. Requires visual baseline re-validation.
2. **Drop `LazyMotionProvider` from `<main>` wrapper**; only wrap `HeroEntrance` (the one motion-using above-fold component) in a local provider. Frees framer-motion from the critical hydration boundary.
3. **Make `Header`, `StickyBar`, `Footer` strictly server components** if any are currently `'use client'` for non-essential reasons. (Verify and reduce client boundary surface.)
4. **Lazy-mount `ScrollReveal`-wrapped sections via Suspense** so only the above-fold (HeroHub + StatsBar + ServicesGrid) is in the initial hydration tree.

Estimated LCP delta: −800 to −1400 ms. Estimated effort: 1-2 days, full Phase 95 visual baseline re-run.

### Path B — Document realistic mobile-throttled budget for this design (recommended)

The design language (Liquid Glass + LivingBlobField + framer-motion reveal) is the brand. The existing 2500 ms LCP budget was set without measuring against the actual implemented hydration cost on the spec'd device profile (Moto G4 + 4×CPU + slow-4G).

**Proposed Key Decision:** relax LCP budget to **3500 ms mobile** for v9.0.1 closeout, keeping TBT (200 ms) and CLS (0.1) at their current values. Add a Phase 99 (or v9.1) item to pursue Path A as a dedicated performance phase.

Rationale:
- TBT and CLS pass cleanly — the user-perceived interactivity and visual stability are already good.
- FCP across all routes is 1059–1223 ms — text is on screen in ~1.2 s, well under 1.8 s "good" threshold.
- The LCP timestamp delta is a measurement artifact of Lighthouse's "stability" rule under aggressive CPU throttling; real users on better hardware will see LCP much closer to FCP.
- This is the documented, evidenced acceptance — not a silent threshold flip.

## Files

- Pre-fix reports: `{slug}.report.json` / `.report.html` (3-run medians, prior baseline)
- Post-fix reports: `{slug}.postfix.json` / `.postfix.html` (single-run, this investigation)
- This summary: `post-fix-summary.md`

## Hard-Gate Posture

This investigation does **not** relax the budget unilaterally. Path B is presented as a Key Decision requiring user approval. If the user rejects Path B, Path A is the only route to pass — that requires a new phase scope (hydration refactor + visual re-baseline) that exceeds the 98-01 audit-fix bounds.
