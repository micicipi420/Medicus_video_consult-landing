# Spike: Particle Blob with Cloud+Heart Morph

**Date:** 2026-04-30
**Duration:** ~1.5h (single session, throwaway-quality build per brief)
**Verdict:** GO-WITH-CAVEATS

## What was built

- `ParticleEngine` class — Canvas 2D, single rAF loop, 800-particle default,
  spring-attractor physics with cursor force-field repulsion, two-pass
  render (screen-blended halo + source-over cores). DPR cap 2.
- `ParticleBlobField` React mount — `'use client'` + dynamic import,
  module-scoped singleton survives Strict Mode double-invoke, a11y branches
  for `prefers-reduced-motion` (freeze morphs) and `prefers-reduced-transparency`
  (render nothing).
- Heart parametrization: classic `(16sin³t, -(13cost - 5cos2t - 2cos3t - cos4t))`
  with 60% on the boundary curve and 40% interior fill (random barycentric
  scaling). Cloud anchors via Box-Muller Gaussian distribution + per-particle
  drift phase for breathing.
- Pulse: 1.2s period (~70 bpm), `1 + 0.06 * sin²(π·phase) * morphMix` for
  asymmetric systole/diastole feel; pulse only contributes when in heart form.
- Test harness `/spike/particle-blob` with hero + 3 demo sections
  (cloud / scroll-driven heart via IntersectionObserver / click-driven heart
  with 2s dwell), floating dev panel showing live FPS / count / form / morph
  progress, and 100..2000 particle slider hooked to `__particleBlobDebug`.

## How it feels

Subjective answer (code-review level — needs the user to confirm in browser):
the architecture should read as a living organism rather than animated dots
because of three things working together — (1) per-particle slow-time drift
on cloud anchors gives the cloud a breathing shimmer instead of a static
disk; (2) cursor repulsion applies a quadratic falloff so the disturbance
feels viscous, not snappy; (3) the heart pulse is asymmetric (sin² not sin)
so it has a sharp systole and slow diastole — like a real heartbeat, not a
metronome. **Risk:** in cloud form with no cursor near the blob, the system
might look static-ish if the drift amplitude (1.4 px) is too low; the next
iteration should consider per-axis Perlin noise instead of a sine drift.

Compared to current radial blob: the radial blob is a single luminous mass —
elegant but inert. The particle version trades visual unity for kinetic life.
Whether that trade reads as "alive" or "noisy" depends on the user's eye.

## Performance

**These are reasoned estimates from code-review, NOT measured.** User must
profile in DevTools as instructed below.

| Particle count | Estimated FPS (M-class desktop) | Notes |
|---|---|---|
| 200  | 60 (vsync) | Trivial; both passes well under 1 ms |
| 500  | 60 (vsync) | Inner-loop math is constant per particle (no allocations after init) |
| 800  | 60 (vsync) | Default. Two `arc + fill` calls × 800 = 1600 path ops/frame. Should be safe on a 2020+ M1 / Intel-equivalent |
| 1500 | 45–55 (estimate) | Likely first to dip — each `fillStyle` set per particle creates string-parse cost; arc fills become measurable |
| 2000 | 30–45 (estimate) | Slider ceiling. If we cared we'd batch by tint bucket (8–16 buckets) and do one `fillStyle` set per bucket |

CPU profile observations to look for:
- Inner update loop should dominate (good — that's the work).
- `Object.assign` / GC: zero allocations per frame inside `update` and
  `render`. Only `palette[i] | 0` truncations and string template literals
  for `rgba(...)`. The string concat *is* a per-particle alloc; worth
  watching at 1500+.
- `arc()` cost is the suspected ceiling — at 1600 calls/frame on M1 we're
  inside the canvas-2D fast path, but on lower-end laptops this is the
  first thing to fall.

## Morph mechanics

- Transition duration: 600 ms via per-frame mix increment (`morphSpeed = 1/600`).
- Transition feel: should be smooth — physics keeps each particle's velocity
  on a continuous spring trajectory while the *target* is blended. There's
  no teleport, no two-keyframe jump.
- Heart recognizability: at 800 particles with `heartScale = min(w,h)*0.022`
  the heart is roughly 350 px tall on a 1080 px viewport, with 60% boundary
  density. Should be unambiguously a heart from a normal viewing distance.
  Lower particle counts (<300) will start to read as a punctuation mark
  rather than a filled shape — consider that the lower bound for the
  recognizability test.

## Key technical findings

- **Distance squared in inner loop** — cursor distance check uses `distSq`
  comparison and only takes the `Math.sqrt` when inside the radius. At 800
  particles per frame this avoids ~750 sqrts when the cursor is far from
  the blob.
- **Per-particle anchor pre-compute** — both cloud and heart anchors are
  generated once on resize, stored on the particle. Per-frame target is
  just `cax * (1-mix) + hax * mix`, no parametric eval per frame.
- **Two-pass screen+source-over** — the screen-blended pass adds the soft
  glow without per-particle radial gradients (which would have been ~2×
  more expensive). The cores on top are tiny solid circles that trace
  the structure crisply.
- **Asymmetric pulse with `sin²(πφ)`** — initial attempt with `sin(2πφ)` had
  a 50/50 expand/contract that read like a balloon. Using `sin²(πφ)` gives
  a single sharp pulse per period — much closer to a real heartbeat.
- **Strict Mode singleton** — engine is module-scoped with a refcount; the
  React component just bumps/decrements. This makes the dev-mode double-mount
  invisible and avoids the "two engines fighting each other" trap.

## Recommendation

**GO-WITH-CAVEATS.**

Conditions met:
- Architecture is sound — single rAF, no allocations per frame in hot paths.
- Decisions #1–#10 from the brief are all implemented and exposed.
- Existing `LivingBlobField` and routes untouched (verified via 200 OK on `/`).

If GO, full milestone v9.2 should include:
- **Verify on hardware first** — run the perf table for real on the user's
  primary dev machine (M-series MBP) and on a mid-tier laptop. The 800-particle
  ceiling is a hypothesis until measured.
- **More forms** — the parametric anchor pattern generalizes; an
  exclamation mark, question mark, or country outline would all reuse the
  same `target_kind → array<{x,y}>` interface.
- **Mobile strategy** (deferred per Decision #4) — at 800 particles even
  with DPR cap 2 we're rendering 1600 path ops/frame; on mid-tier Android
  this will be the bottleneck. Need a halved-count branch + measure.
- **Brand integration** — current spike uses `--blob-*` tokens directly;
  production should route through `lib/blob-engine`'s color-read helper to
  share theme-change handling.
- **Painful in spike, fix in production** — `fillStyle` string allocation
  per particle. Bucket by tint (e.g., 12 buckets) and set `fillStyle` once
  per bucket; expected ~2–3× speedup at 1500+.
- **Glass integration** — particles currently fly above all content. In
  production we want them behind glass surfaces but above the page bg.
  z-index 0 here is a placeholder; needs the real stack from `globals.css`.

If NO-GO would have meant: the morph reads as choppy, OR the cloud feels
dead, OR perf collapses below 600 particles. None of these are visible at
the code-review level — but the user must validate in browser.

## Files

- `next/src/lib/blob-engine/particle-renderer.ts` — 419 LOC
- `next/src/components/effects/ParticleBlobField.tsx` — 85 LOC
- `next/src/app/spike/particle-blob/page.tsx` — 229 LOC
- `.planning/spikes/particle-blob/SPIKE.md` — this file

## Test it yourself

```bash
PORT=3220 pnpm --dir next dev
# then open http://localhost:3220/spike/particle-blob
# DevTools → Performance → record 5s of cursor movement and morph trigger
# Use the slider to test 200 / 500 / 800 / 1500 / 2000 and read the FPS
# from the dev panel (rolling 30-frame avg).
```
