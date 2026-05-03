# Spike v3: Glass Edge Light-Bending — Blinn-Phong Sweet-Spot + Tunable Displacement

**Date:** 2026-04-30
**Duration:** ~45 min
**Verdict:** GO-WITH-CAVEATS

## What was built

- New `LightBendingEngine` (`next/src/lib/effects/light-bending-renderer.ts`) — keeps ~70% of `ScintillationEngine`: rounded-rect perimeter sampler, two-pass render, single rAF, DPR cap 2, CSS-var blob coupling, a11y branches.
- Per-particle Blinn-Phong specular: `H = normalize(L + V)` with `V = (0,0,1)`, `intensity = max(0, dot(N,H) / 0.7071)^shininess`.
- Two displacement components driven by intensity: outward normal bulge (`NORMAL_MAX_PX = 18`) + tangential flock toward bucket sweet-spot (`TANGENT_MAX_PX = 8`), per-frame lerped (k=0.18).
- Sweet-spot per surface = bucket-local argmax of intensity. All other particles' tangent vector signed toward sweet-spot via shortest-path in u-space.
- Test harness with 4 surfaces, live sliders, comparison links to `/spike/particle-blob` and `/spike/glass-scintillation`.

## How it feels

(Subjective from headless screenshots + math review — operator should validate live.)

The bright cluster locks to the screen-space side closest to the cursor and slides smoothly along the perimeter when the cursor moves. Combined with the outward normal bulge it reads as **light leaking through the edge** rather than "lights toggling" (v2 brightness-only). Tangential flock makes the cluster feel like a coherent specular highlight, not 24 independent dust motes — which is the optical signature requested.

Compared to `/spike/particle-blob`'s cursor-displacement: that spike pushed an entire cloud away from the cursor (interior repulsion). v3 instead moves a thin band of edge particles toward the cursor (perimeter attraction). Different geometry, related visual rhythm. v3 is closer to what real edge refraction looks like: localized brightening at the apparent source of glance light.

## Slider exploration

| normalStrength | tangentStrength | shininess | Feel |
|---|---|---|---|
| 0.0 | 0.0 | 16 | == v2 brightness-only. Particles pulse but don't move. |
| 0.5 | 0.5 | 16 | **default — best balance**. Visible bulge + clear flock. |
| 1.0 | 0.0 | 16 | Pure outward bulge. Reads as glass "swelling" at light source. Less elegant. |
| 0.0 | 1.0 | 16 | Pure tangential flock. Particles slide along edge but don't pop out. Subtle. |
| 1.0 | 1.0 | 32 | Tightest sweet-spot, maximal bulge+flock. Most dramatic but borderline showy. |
| 1.0 | 1.0 | 8 | Broad sweet-spot, diffuse glow. Reads as "soft area light" — softer, less crisp. |

**Best-feeling combo (recommend operator confirm):** `normalStrength=0.5, tangentStrength=0.5, shininess=16`. This is the brief's default — the tangent flock alone makes it feel like specular drift; the normal bulge alone would feel inflatable. The mix communicates light bending without the visual noise of either extreme.

## Sweet-spot tracking

- Sweet-spot smoothly slides along edge as blob moves: **yes** (verified in headless: sweetSpotIndex changes from 0→4→7→21 across cursor positions).
- Visual fidelity to "light flowing around corner": estimated **7/10** from screenshots — the tangent flock creates a coherent localized cluster; the outward bulge reinforces "this is where light is escaping". Caveat: with only 24 particles per surface, the cluster has visible discreteness on close inspection. Bumping to 36 helps continuity at modest perf cost.

## Performance

| Surfaces × Particles | FPS (headless chromium, capped ~40) | Notes |
|---|---|---|
| 4 × 24 (default) | 40-41 steady | identical to scintillation v2 |
| 4 × 36 | 40-41 steady | no degradation |
| 4 × 40 | 40-41 steady | no degradation |

Headless chromium on this host caps animation at ~40fps regardless of workload — not a real performance test. The flatness across 96 → 160 particles strongly suggests the engine is not CPU-bound at these counts; on real desktop hardware (no rAF cap) this should hit 60fps comfortably with margin. The hot loop is two passes of `len * 4` arc/fillStyle calls — same shape as v2 which was demonstrated 60fps.

Operator should run on bare metal: `PORT=3222 pnpm --dir next dev`, open DevTools → Performance, record 5s with cursor moving across surfaces, confirm 60fps.

## Reuse vs new code

**Reused from glass-scintillation (~70%):**
- `pointOnRoundedRect` perimeter sampler (extended to also return CCW tangent vector)
- `perimeterOf`
- `readBlobPosition`, `readBlobCoreColor`, `parseHex`, `parsePxLike`
- Surface bucket layout, ResizeObserver/MutationObserver mount
- Two-pass render (atmosphere screen-blend halo + source-over bright cores)
- DPR cap 2, single rAF, `prefers-reduced-{motion,transparency}` branches, forceMount escape hatch
- sin²(πφ) heartbeat micro-pulse trick

**Reused from particle-blob (~5%):**
- Damped lerp pattern (k×(target − current) per frame); simpler than the spike's spring physics because the target is already an analytical solve, not a force balance.

**New for v3 (~25%):**
- Per-particle Blinn-Phong intensity solve with renormalized response (the brief's `dot(N,H)^shininess` peaks at `0.707^shininess` because `N` is in-plane, so I divide by sqrt(2)/2 before pow; without this fix, `peakIntensity` was stuck at 0.004 and displacement was invisible).
- Per-bucket sweet-spot (argmax) and signed-shortest-path tangent direction in u-space.
- Two displacement components: outward normal + tangential flock, both intensity-scaled.
- Stable anchors (no perimeter drift, unlike v2) — sweet-spot is the moving thing.
- Heartbeat micro-pulse gated by intensity > 0.4 so breathing is localized to bright cluster.

## Recommendation

**GO-WITH-CAVEATS** for promoting to a production-candidate phase, on these conditions:

1. **Operator confirms the visual on real hardware.** Headless probe verified the math is sound (peakIntensity reaches ~1 near edges, sweet-spot index updates correctly per cursor position) but subjective "feel" needs human eyes.
2. **Default sliders pin at 0.5/0.5/16** unless operator's hands-on session converges elsewhere. Anything higher tips toward gimmick.
3. **Mobile blur ≤12px constraint is N/A here** (effect runs over existing glass surfaces, doesn't add filter cost), but if particle count goes up, profile mobile separately.
4. The Blinn-Phong renormalization (the `× sqrt(2)` before `pow`) is a non-obvious fix; this should be called out in any production port — naïve copy of the brief's math will produce a dead-looking effect.

**NO-GO if:** operator's live test shows the cluster jumps discretely between particles (rather than gliding) at 24 particles/surface — would force 36+ as the floor. Or if the outward bulge over a backdrop-filter surface causes flicker (not seen in headless but DPR/compositor edge case worth checking).

## Files

- `next/src/lib/effects/light-bending-renderer.ts` — engine (LightBendingEngine class, Blinn-Phong solve, displacement targets, lerp, render).
- `next/src/components/effects/GlassLightBendingField.tsx` — React mount with singleton + refcount + ResizeObserver + a11y branches + `forceMount` escape hatch.
- `next/src/app/spike/glass-light-bending/page.tsx` — test harness with 4 glass surfaces, side-by-side ON/OFF compare, floating dev panel with 4 sliders + reset button.
- `.planning/spikes/glass-light-bending/SPIKE.md` — this report.

## Test it yourself

```bash
PORT=3222 pnpm --dir next dev
# → http://localhost:3222/spike/glass-light-bending
# Move cursor around glass surfaces; the bright cluster should slide along
# the nearest edge. Use the floating dev panel sliders to dial the feel.
# Use links at top of hero to A/B against /spike/particle-blob and
# /spike/glass-scintillation.
```

## Build & lint

```
pnpm --dir next build  # ✓ Compiled successfully in 8.6s
pnpm --dir next lint   # ✓ 0 errors, 4 pre-existing warnings unchanged
```
