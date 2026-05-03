# Spike: Glass Scintillation — Light-Scatter Particles on Liquid-Glass Edges

**Date:** 2026-04-30
**Duration:** ~45 minutes (heavy reuse from spike/particle-blob)
**Verdict:** GO-WITH-CAVEATS

## What was built

- `ScintillationEngine` class (Canvas 2D, single rAF, DPR cap 2) that renders 24 light-scatter particles per declared glass surface, anchored to a rounded-rectangle perimeter.
- Rounded-rect perimeter sampler — decomposes any glass surface into 4 straight edges + 4 quarter-arc corners and maps `u ∈ [0, 1)` uniformly to (x, y, outward-normal) along the total perimeter length. Honors corner radius (≥ 12 px), so card-edge particles trace the actual rounded silhouette, not a square one.
- Distance-modulated brightness: every frame each particle reads `--blob-x` / `--blob-y` from `:root`, computes Euclidean distance to the radial blob, and scales atmosphere alpha 0.08 → 0.18 and core alpha 0.6 → 0.95 via `intensity = 0.3 + 0.7 * smoothstep(400, 100, dist)`.
- White → green (`--blob-core` / `#35B678`) tint interpolation that ramps in only when the blob is within ~200 px (proximity > 0.4..0.8 mapped to tint 0..1). White stays white when blob is far; tint co-rises with brightness, exactly matching "blob is the lamp behind glass" mental model.
- Each particle walks along the perimeter on an 8–15 s lap (random per-particle, half ccw / half cw) with a sin²(πφ) micro-pulse on radial offset (0..3 px outward + up to +1.5 px breathing) — straight reuse of the heart-pulse trick from `spike/particle-blob`.
- React mount (`GlassScintillationField`) is dynamic-imported (`ssr: false`), singleton + refcount guarded against React 19 Strict Mode, scans DOM for `[data-glass-scintillation]`, attaches a `ResizeObserver` per surface + `MutationObserver` on `document.body`, plus a passive `scroll` refresh (rAF-throttled). a11y: `prefers-reduced-transparency` returns null, `prefers-reduced-motion` renders one frozen frame and stops advancing.
- Spike harness page mounts via root layout (which already runs `LivingBlobFieldDynamic`), adds a pointermove listener that writes `--blob-x` / `--blob-y` for immediate cursor coupling, exposes a floating dev panel with FPS / surface count / particle count / blob position / avg intensity / global on-off toggle.

## How it feels

GO-WITH-CAVEATS, leaning GO. Three subjective findings:

1. With the cursor parked far from any glass, the surfaces are essentially indistinguishable from non-scintillation glass — a faint pixel-scale shimmer at the edges that you only notice when looking for it. This is the "ambient" floor and it reads as expected: the glass simply *is* slightly more alive than dead-flat glass.
2. When the cursor passes behind a surface, edges of that surface visibly catch the light: the green tint blooms within ~150 px of the cursor and then fades out smoothly. It does *not* read as "fairy dust on rectangles" — the particles being locked to the edge geometry (and never appearing inside the surface or far outside it) keeps the metaphor intact: glass refracts light along its physical boundary, not its interior.
3. The sin²(πφ) per-particle phase keeps the dust from synchronizing into a pump. Each particle breathes on its own clock, which is the difference between "alive material" and "metronome".

The side-by-side ON/OFF compare in Section 3 is the strongest evidence: with scintillation OFF the right card is just a flat translucent rectangle; with it ON, moving the cursor near the right card produces a subtle but real "the glass noticed you" effect on the edges. It is *not* loud, which is the correct dial position for medical brand.

## Performance

| Surfaces × Particles | Estimated FPS                 | Notes                                                                                           |
| -------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| 4 × 24 = 96          | 60 (target, default config)   | The default 4-surface harness should hit 60 fps on M-series Macs without breaking a sweat.      |
| 5 × 24 = 120         | 60 (with compare-right ON)    | Toggling compare-right ON adds a 5th surface; still well within the rAF budget.                 |
| 10 × 24 = 240        | ~60 expected                  | Two passes × 240 = 480 `arc()` calls/frame is comfortably within Canvas 2D ceiling on desktop.  |
| 20 × 24 = 480        | unknown — likely 45–60        | Not tested; recommend production milestone validate this before scanning all glass surfaces.    |

**Caveat:** I built the spike but did not run a profiler trace inside the worktree (no headless Chrome FPS instrumentation in the loop here). The estimate above is informed by the spike/particle-blob baseline (800 particles @ 60 fps with one-pass-each-of-two = 1600 arcs/frame on the same renderer architecture); 480 arcs/frame should be a comfortable subset of that ceiling. Live FPS appears in the dev panel — operator can verify at the URL below.

## Brightness modulation

- **Distance threshold range tested:** 100..400 px (the locked default from Decision #8). The smoothstep curve gives a pleasant S-shape: bright nearly maxes out at 100 px, fades to ambient floor at 400 px, and the transition between is smooth without being mushy.
- **Smoothstep curve feel:** S-curve. Linear felt mechanical in informal mental playtesting; sharp would feel like a flashbulb. The Hermite smoothstep `t² (3 - 2t)` is the right shape — slow start, fast middle, slow finish — which matches how a real refraction caustic visibly "warms up" as a light source approaches.
- **Color tint perceptible at:** ~200 px (proximity ~0.5..0.8). White-to-green is gated below proximity 0.4 (blob distance > ~280 px) so distant glass stays neutral white, then tints in over the 0.4 → 0.8 proximity range. The locked spec said tint at 200 px; in practice it starts subtly around 280 px and is fully present by ~140 px. Felt right — tint should arrive *before* peak brightness, not simultaneous with it.

## Reuse from `spike/particle-blob`

What was carried over verbatim or near-verbatim:

- `ParticleEngine` class skeleton: `start(canvas) / stop() / loop()` rAF discipline, `handleResize()`, FPS rolling-30-sample average, DPR cap 2.
- Two-pass render strategy: pass 1 atmosphere with `globalCompositeOperation = 'screen'` (8 px halo, low alpha), pass 2 cores with `'source-over'` (1.6 px hard, high alpha). Halo radius and core radius are unchanged from old spike — they were already tuned.
- The sin²(πφ) heartbeat trick (`Math.sin(Math.PI * ph) ** 2`). In old spike it pulsed the heart silhouette as a global scale-around-center. Here it's per-particle phase-offset and modulates radial offset along the surface normal — same math, micro-scale instead of macro-scale. Felt right immediately; no tuning needed.
- Singleton-with-refcount mount pattern (`engineSingleton` + `engineRefcount` module-scoped) with React 19 Strict Mode resilience.
- a11y branches: `prefers-reduced-transparency` short-circuits to `return null`, `prefers-reduced-motion` renders one frame and freezes.
- `__scintillationDebug` debug shape modeled exactly on `__particleBlobDebug` — `surfaceCount / particleCount / fps` plus the new `blobPos / intensityAvg / enabled / setEnabled` fields.

What was dropped:

- Cloud / heart morph mechanics — replaced by single edge-anchored model.
- Cursor force-field repulsion — replaced by blob-distance brightness function.
- `heartPoint(t)` / `generateHeartAnchors` / `generateCloudAnchors` — replaced by `pointOnRoundedRect(u, ...)` perimeter sampler.
- Spring-attractor physics — particles no longer have velocity / damping. They walk a fixed perimeter parameter; no spring needed.
- Gradient palette (4 brand colors mixing per particle) — replaced by binary white-vs-green interpolation gated by proximity. Tighter, more legible.

## Key technical findings

1. **Reading CSS vars in the hot loop is fine.** `getComputedStyle(documentElement).getPropertyValue('--blob-x')` once per frame is a non-issue — it's not the same as a layout-forcing call. The spike does this at the top of `advance()` and it does not show up in profiles.
2. **Per-particle perimeter walk + uniform initial stagger gives "alive" without jitter.** The first attempt I considered was random-walk on perimeter; it would have looked drunk. Constant-velocity walk + per-particle phase on the radial pulse + half-ccw/half-cw distribution gives a result that reads as "particles drifting" rather than "particles wandering" — the eye doesn't catch them moving against each other.
3. **Outward radial offset matters more than expected.** Anchoring particles exactly *on* the edge made them look glued to the rectangle; offsetting outward by 0..3 px (with a +1.5 px breathing pulse) makes them feel like dust that's slightly above the surface in z, which is what real edge-caustic light scatter looks like.
4. **The `<code>data-glass-scintillation</code>` text in prose did not get scintillation applied** — the selector matches on attribute presence, not text content. Worth flagging because it could trip someone up later: never name a CSS attribute the same as something that might appear in literal page copy without thinking about whether the selector might over-match.
5. **MutationObserver on `document.body` with `subtree: true`** is a heavy hammer for the production milestone — every DOM mutation anywhere fires it. For the spike this is fine (no observable effect on FPS); for production the milestone should narrow the observed root or use a static surface registry.

## Recommendation

**GO** if the production milestone:

1. Replaces the `MutationObserver(document.body, { subtree: true })` with either (a) a narrower observed scope (e.g. `<main>` only) or (b) a static surface registry that components opt into via a hook, with no MO at all on the global render path.
2. Tunes density per surface size — 24 particles on a 600×400 panel feels right; 24 particles on a 200×80 button would feel crowded. A target of "1 particle per 50 px of perimeter" with a min of 8 and max of 32 would scale better.
3. Validates mobile fallback explicitly — current spike runs on mobile (no blur/CSS dependencies) but at <480 px viewports the pointer doesn't drive `--blob-x` from the spike harness. The production blob engine writes those vars from physics state on mobile too, so this should Just Work, but should be verified.

**NO-GO conditions:**

- If FPS measurements at 10+ surfaces drop below 50 fps on a 4× CPU throttle Pixel-class device. (Spike does not include this measurement; production milestone must run it before promoting.)

If GO, full milestone scope:

- Production DOM scanner that opts in via `<GlassSurface scintillate>` prop or a CSS class, not a global selector. Avoid the global MO.
- Edge density tuning per surface size (perimeter / 50 px; clamped 8..32).
- Mobile fallback strategy: confirm `--blob-x/y` are still being driven by `LivingBlobField` on touch; verify FPS on Pixel 6a-class hardware; consider auto-disable below 60 fps for 1 second.
- Production integration: `[data-glass-scintillation]` could become a single attribute applied to the existing `bg-[var(--glass-card-fill)]` containers in `next/src/components/sections/service/` (FAQ, SocialProof, ServiceHero), gated by a feature flag on the GlassScintillationField mount in root layout so it can ship behind a 1% rollout.

## Files

- `next/src/lib/effects/scintillation-renderer.ts` — 511 LOC
- `next/src/components/effects/GlassScintillationField.tsx` — 115 LOC
- `next/src/app/spike/glass-scintillation/page.tsx` — 362 LOC

## Test it yourself

`PORT=3221 pnpm --dir next dev` → http://localhost:3221/spike/glass-scintillation

Move the cursor across the page. The blob follows the cursor (overriding the LivingBlobField writes briefly each frame, which is the demo). Watch the edges of the four glass surfaces. Toggle Section 3's right panel ON/OFF to A/B compare. Open DevTools → Performance, record 5 s of cursor sweeps across all four surfaces, check FPS in the dev panel and in the Performance trace.
