# Feature Landscape — v9.0 Living Blob Liquid Glass Scene

**Domain:** Marketing site cursor-light / liquid-glass scene (medical, ЦА 45+)
**Researched:** 2026-04-30
**Source ТЗ:** `design/LIQUID_GLASS_BLOB_TZ.md` (20 sections, 12 acceptance criteria)
**Overall confidence:** HIGH (TZ is unusually prescriptive; this doc taxonomizes its requirements + flags industry-baseline vs reach-mode features and anti-features)

---

## Reading Guide

This is a SUBSEQUENT-milestone research file. Most "feature" decisions are pre-specified in the TZ. The job here is to:

1. **Decompose the TZ into discrete features** so the requirements definer can scope each independently.
2. **Mark each feature** as TABLE STAKES (industry baseline / TZ-mandated), DIFFERENTIATOR (notable above baseline), or ANTI-FEATURE (rejected — explain why).
3. **Flag complexity** (S/M/L) and **dependencies** so the roadmapper can phase the work.
4. **Cite production references** so visual decisions can be calibrated against known-good implementations.

The 10 categories below match the user's question prompt 1:1.

---

## Production References (Calibration Targets)

| Site | Effect | What we borrow | What we reject |
|------|--------|----------------|----------------|
| `stripe.com` (hero) | Animated mesh gradient (FBM noise + sine UV warp via WebGL) | Living, non-repeating ambient motion; multiple color stops blended via screen/overlay | Their effect is **not cursor-driven** — it is autonomous. We only borrow the *autonomous-motion fallback* shape for our mobile ambient mode. |
| `apple.com/vision-pro` | Liquid-glass chrome, soft halos under glass plates | Halo behaviour under blurred plate; saturation lift for under-glass content | Apple's blob is video-baked, not interactive — not applicable to cursor follow. |
| `linear.app` (hero) | Subtle radial-gradient that follows scroll/cursor at very low intensity | Restraint: a single soft light source, never a "trail" effect | Linear is dark-mode; our default is light. Calibrate luminance, not shadow direction. |
| `arc.net` (legacy hero) | Multi-blob mesh with viscous follow + autonomous breathing | Layered inertia: smaller blob lags less than larger blob | Their palette is loud rainbow — for a medical brand we restrict to single-hue green family. |
| `paper.design`, `vercel.com/design` | Glass plates over a colored field; refraction-style edges | Inset highlights on borders, multi-tier blur per surface depth | Both are tech-tone; we soften saturation for medical context. |
| `awwwards.com` SOTD winners 2024–2025 (e.g. `lusion.co` work) | Pointer-leave-window decay; section-velocity coupling | Decay-to-last-position pattern; soft pulse on tap | Many winners use heavy WebGL — we stay on CSS+Canvas2D budget. |

Confidence: MEDIUM — pattern names verified against published implementations; exact tuning is brand-specific.

Sources:
- [Bram.us — How To create the Stripe Website Gradient Effect](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/)
- [Kevin Hufnagl — Stripe Website Gradient Effect](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/)
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

---

## Category 1 — Blob Renderer Behaviour

The single dense, alive object under the entire UI.

### Table Stakes (must-have)

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Fixed full-viewport layer** | `position: fixed; inset: 0; z-index: 0; pointer-events: none` (TZ §17) | S | Single DOM root for the whole field. |
| **4 sublayers: core / body / halo / glint** | Each its own paint primitive (radial-gradient or canvas circle), absolutely positioned, z-stacked (TZ §5) | M | Required for optical depth. Cannot be flattened into one element. |
| **Brand-locked palette** | `--blob-core: #35B678` / `--blob-hot: #4FE098` / `--blob-halo: rgba(98,221,177,0.5)` / `--blob-edge: rgba(125,205,255,0.18)` / `--blob-glint: rgba(255,255,255,0.65)` (TZ §5) | S | Tokenize in `globals.css` as `--blob-*`; no inline literals. |
| **Soft radial falloff per sublayer** | Each sublayer is a feathered radial gradient (no hard edges anywhere) | S | Use radial-gradient or canvas blur. |
| **Sublayer size hierarchy** | core ≪ body < halo (relative ratios approx 1 : 4 : 10); glint ≈ core | S | Will be visually tuned, but the scale is fixed. |
| **Open-space visibility tier** | Visible directly on page background — but mild, never an "agro пятно" (TZ §8) | S | Halo opacity ≤ ~0.5; core visible only when not occluded. |
| **Renders behind ALL chrome** | Header, main, footer all `z-index: 1` (TZ §17) | S | Cannot be partially behind one section and in front of another. |

### Differentiators (above-baseline reach)

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Velocity-driven shape stretch** | At high pointer speed, body and halo elongate along motion vector (TZ §6) | M | Animate `scaleX/scaleY` + rotate via transform; do NOT touch width/height (perf). |
| **Per-section visibility weighting** | Halo opacity reduced when blob is under header chrome ("сдержанная реакция, без визуального шума" — TZ §8) | M | Either via section-level CSS variable cascade or a region-aware opacity hook. |

### Anti-Features (REJECT)

| Anti-Feature | Why reject |
|--------------|------------|
| **More than 4 sublayers** | TZ explicitly enumerates 4. More layers ≠ better; each adds GPU cost and visual noise. |
| **Multiple blobs on screen simultaneously** | TZ §1 — "единственный плотный объект". Two blobs = two protagonists = no protagonist. |
| **Hard-edged or pixelated rendering** | Breaks the "subsurface light under glass" metaphor. |
| **WebGL/three.js shader implementation** | Bundle weight + WebGL fallback complexity. CSS radial gradients + `filter: blur()` get us the entire visual budget at a fraction of the cost. Reject WebGL unless a Phase 1 prototype proves CSS cannot meet the visual bar. |
| **Toxic/neon green** | TZ §5 — "медицинским, чистым и технологичным; нельзя в кислотный neon, gaming-эстетику или токсичный зеленый". |

---

## Category 2 — Cursor-Follow Physics

How the four sublayers chase the pointer.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Single `pointermove` listener + single `requestAnimationFrame` loop** | Per TZ §16. No per-element listeners, no React state updates per move. | M | Single source of truth for pointer; one rAF dispatches positions to all sublayers via CSS variables. |
| **Critically-damped (or exponential-smoothed) viscous follow** | core → fast, body → medium, halo → slow, glint → reactive to dwell (TZ §6) | M | Easing model: `pos += (target - pos) * k` per frame, with `k_core > k_body > k_halo`. Suggested starting points: `k_core ≈ 0.18`, `k_body ≈ 0.08`, `k_halo ≈ 0.035`. Tune visually. |
| **Max-speed clamp on each sublayer** | Prevents teleport across screen on fast flicks; preserves the "viscous" feel | S | Cap pixel-delta per frame per sublayer. |
| **Position publication via CSS variables on the field root** | `--blob-x`, `--blob-y`, `--core-x`, `--body-x`, etc. Sublayers read via `translate3d(var(--core-x), var(--core-y), 0)` | S | Avoids touching React state; rAF writes directly. |
| **Transform-only animation (no `top/left`)** | TZ §16 mandate | S | `translate3d` on a `will-change: transform` layer. |
| **Shape relaxation back to round on stop** | After motion ceases, sublayer offset gradients converge → shape returns to circle (TZ §6) | S | Falls out automatically from the exponential smoothing — no extra code if model is right. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Speed-coupled stretch matrix** | Stretch sublayers along velocity vector by a function of recent speed; `scale(1 + v*ε, 1 - v*ε*0.3)` | M | Rotate via `atan2(vy, vx)`. Looks "alive" rather than "lagging". |
| **Different inertia ratios for X and Y axes** | Optional polish — gives a subtle organic feel | M | Marginal; only if frame budget allows. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Spring physics with overshoot/oscillation** | Reads as "playful/gaming", not medical. TZ tone is спокойный, медицинский. |
| **Trail of N copies of the cursor** | TZ §14 explicitly forbids on mobile and the spirit applies on desktop too — "trail-эффект за пальцем" is rejected. |
| **Per-frame React state** (`useState(pos)` on `pointermove`) | TZ §16 explicit prohibition. Causes re-render storms. Use refs + rAF. |
| **Spring libraries (`react-spring`, `framer-motion` for the blob loop)** | Adds runtime overhead for an effect that fits in <50 lines of vanilla rAF. Framer Motion is fine elsewhere; not for the inner loop. |
| **Animating `box-shadow` per frame** | TZ §16 — "анимировать тяжелые box-shadow на десятках элементов" forbidden. |

Complexity overall: **MEDIUM**. The physics is a 30-line rAF loop; visual tuning is the long pole.

---

## Category 3 — Heat Accumulation (Dwell Response)

When the cursor lingers, the blob "fills up" — core brightens, body thickens, halo expands, glint appears.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Dwell detector** | Track recent pointer speed (e.g. moving average over last 200ms). When speed below threshold for 1.5–3s, increment a `heat` scalar [0..1]. (TZ §7) | M | One scalar per field, exposed as `--blob-heat`. |
| **Heat-driven sublayer modulation** | `core` opacity / brightness lerp from 1.0 → 1.15; `body` alpha lerp; `halo` `scale()` lerp 1.0 → 1.2; `glint` opacity 0 → ~0.6 (TZ §7) | M | Drive everything from a single `--blob-heat` custom property. |
| **Smooth ramp curve** | Ease-in-out (`smoothstep`-like), ~1.5s to reach max; not linear | S | Use `easeInOutCubic`-style on the heat integration. |
| **Decay on movement** | When pointer moves, heat decays back to 0 over ~600–900ms; smooth, no jump (TZ §7) | S | Exponential decay (`heat *= 0.96` per frame while moving). |
| **Max heat cap = 1.0** | Prevents over-saturation if user goes AFK | S | Clamp before publish. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Heat-affects-glass-saturation coupling** | When heat is high, glass elements above the blob region become slightly more saturated ("glass-слои над blob-ом становятся визуально сочнее" — TZ §7) | M | Optional polish. Implementable via `backdrop-filter: saturate(calc(140% + var(--blob-heat) * 30%))`. Test perf cost. |
| **Glint micro-shimmer at peak heat** | Glint sublayer gets a 2–3s `opacity` cycle when heat ≈ 1 | S | Must respect `prefers-reduced-motion`. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Heat triggers a "burst" / scale punch** | TZ §7 — "должен оставаться спокойным и медицинским". Bursts are gaming UX. |
| **Heat-driven color shift toward red/orange** | Brand parity violation. Green family only. |
| **Heat sound effect** | Out of TZ scope; would violate the "спокойный, медицинский" tone. |
| **Heat persists across page navigations** | Wasted complexity; reset on each route. |

Dependencies: **Cursor-Follow Physics (Cat 2)** — heat reads from the same speed signal.

---

## Category 4 — Glass UI Redesign (Opacity & Tier System)

The TZ's biggest content edit: existing glass surfaces must drop from ~0.6 fill toward 0.04–0.16, with explicit tiers per surface depth.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Four-tier opacity scale** | `0.04` (large sections / hero) / `0.08` (cards) / `0.12` (forms) / `0.16` (small controls / pills) (TZ §9) | S | Tokenize as `--glass-fill-section / -card / -form / -control`. |
| **Multi-layer composition per surface** | Every glass surface = transparent fill + backdrop-filter + thin light border + inset highlight + soft outer shadow + faint tint (TZ §9, §17) | M | Already partially in place via existing tokens; needs alpha rebalancing. |
| **Border via `box-shadow: inset`, not `border`** | DESIGN.md squircle anti-pattern (mask clips border) | S | Already enforced repo-wide. |
| **Inset highlight** | `inset 0 1px 0 rgba(255,255,255,0.65)` — top edge light catch (TZ §17 sample) | S | Already in shadow-glass token family. |
| **Composite outer shadow** | `0 24px 80px rgba(31,75,120,0.12)` — soft cool-tinted drop (TZ §17 sample) | S | Aligns with existing `shadow-glass` token. |
| **Existing v8 surfaces re-styled** | Header, hero card, stats bar, service cards, process steps, CTA section, form — every glass element re-tuned to the new opacity tiers | L | This is the brunt of the work. ~10 component files in `next/src/components/`. |
| **Section bg paint removal** | Sections must NOT have opaque/cream/white backgrounds. They become transparent glass plates over the blob. | M | DESIGN.md currently allows `bg-white/bg-cream/bg-blue/bg-gray` rotation — TZ supersedes this for v9. Log Key Decision in PROJECT.md. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Refraction-style edge overlay** | A subtle gradient overlay on glass borders that simulates light bending around the edge | M | Implementable as a `::before` pseudo with conic gradient. Bonus polish; not critical to the core effect. |
| **Per-component depth ID** | Each glass component declares its tier via a data attribute (`data-glass-tier="card"`) and CSS reads `--glass-fill-{tier}` | S | Cleaner than per-component literals. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Solid white card backgrounds** | TZ §9 explicit: "плотные белые карточки" forbidden. |
| **Milky/opaque fills above 0.16** | TZ §9: "значения выше должны использоваться осторожно... если glass-слой становится молочно-белым и перестает пропускать blob, это нарушение концепции". |
| **Green tint on cards** | TZ §9: "зеленая заливка поверх карточек" forbidden. The blob is the only green source. |
| **Flat (non-glass) sections** | TZ §9: "плоские секции без оптической глубины" forbidden. |
| **Background-image / pattern fills on glass surfaces** | Defeats the refraction metaphor and obscures the blob. |
| **Adding a 3rd persistent glass layer per viewport** | Already constrained to ≤2 by DESIGN.md mobile budget. v9 must NOT relax this. |

Complexity overall: **LARGE**. This category drives the bulk of the milestone's diff.

Dependencies: **DESIGN.md token update** must land before component edits begin.

---

## Category 5 — Optical Depth Hierarchy

Different glass elements must read as being at different distances from the user.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Per-tier blur scale** | sections (largest blur, e.g. `--liquid-blur-lg` 40px desktop / 12px mobile) → cards (~24px / 12px) → forms (~16px / 12px) → controls (~12px / off) (TZ §11) | S | Reuse existing `--liquid-blur-{sm,md,lg,xl}` tokens; map tier → token. |
| **Per-tier shadow scale** | Larger surfaces = wider, softer drop; smaller controls = tighter, sharper highlight (TZ §11) | S | Token-driven via `--shadow-glass-{section,card,form,control}`. |
| **Per-tier border sharpness** | Sections = subtle border; cards = visible border; controls = sharpest highlight (TZ §11) | S | Border alpha varies per tier (e.g. `0.35` → `0.5` → `0.65`). |
| **Air between tiers** | Section padding preserves vertical breathing room — must not collapse glass plates onto each other (TZ §11) | S | Existing spacing tokens; just verify no regressions. |
| **Mobile tier collapse rule** | On mobile, all tiers cap at 12px blur (DESIGN.md hard constraint) and reduce to ≤2 stacked layers | S | Already enforced; v9 tiers must not violate. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Differential blob appearance per tier** | The same blob looks different under each tier (TZ §10): open background = soft mass; large section = blurry / volumetric; card = "сочнее" from layer accumulation; form = depth without losing readability; controls = light optical response only | M | Falls out automatically from the blur/shadow tier system if tuned right. Verification matters more than novel code. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Uniform blur across all surfaces** | Kills depth perception. Everything reads at the same distance = "плоская молочная поверхность" (TZ §11). |
| **Animated blur values** | Animating `backdrop-filter` blur radius is GPU-poison on mobile and most desktop GPUs. |
| **Dynamic depth shifting on hover** | Looks gimmicky for a medical brand. Hover lift via `translateY(-2px)` (existing pattern) is sufficient. |

Complexity: **SMALL** if Cat 4 is done right (this category is mostly token-mapping); **MEDIUM** if hand-tuning per component.

Dependencies: **Glass UI Redesign (Cat 4)** must define tiers first.

---

## Category 6 — Mobile Ambient Mode

On touch devices, no cursor exists. Blob must be alive but autonomous.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Touch-detection branch** | Detect `(pointer: coarse)` or `matchMedia('(hover: none)')` → switch to ambient mode | S | One-time check at mount; no re-evaluation needed. |
| **Autonomous slow drift** | Blob center follows a slow Lissajous (or low-frequency Perlin / sine-cos pair) path (TZ §14) | M | Pure JS; period ~20–40s per axis; amplitude ~30–40% of viewport. |
| **No glint on mobile** | TZ §14 — "без резких glint" | S | Conditional: ambient mode skips glint sublayer. |
| **No high-frequency motion** | TZ §14 — "низкая частота движения" | S | Drift speed bounded; no rAF >30fps required. |
| **Tap pulse** | On `touchstart` / `pointerdown`, brief soft halo pulse (e.g. 600ms ease-out scale 1 → 1.15 → 1) at touch point (TZ §14) | M | One-shot animation; cannot accumulate trail. |
| **Scroll-priority budget** | Ambient must NEVER drop scroll fps. Pause ambient updates while user is actively scrolling. (TZ §14) | M | Listen to `scroll` with passive flag; throttle blob updates during scroll. |
| **Reduce sublayer count on mobile** | Optional: drop `glint` and reduce halo opacity. TZ implies this via "без агрессивного свечения". | S | Trivial conditional. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Tilt-driven drift (DeviceMotionEvent)** | iOS gyro could nudge ambient drift direction | M | Reject for v9 — adds permission prompts, weird UX on Android, not in TZ. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Trail effect following finger** | TZ §14 explicit ban: "нельзя превращать интерфейс в trail-эффект за пальцем". |
| **Per-frame backdrop-filter changes** | Kills mobile GPU. |
| **Tilt/gyroscope movement** | Permission prompts; cross-platform inconsistent; not in TZ; medical tone violation. |
| **Blur > 12px anywhere on mobile** | Project hard constraint, repo-wide. |

Complexity: **MEDIUM**. Ambient drift is a 20-line function; the harder part is correctly pausing on scroll.

Dependencies: **Blob Renderer (Cat 1)** for the underlying sublayers.

---

## Category 7 — A11y Modes (Reduced Motion, Reduced Transparency, Contrast)

The TZ is explicit about behaviour under each preference.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **`prefers-reduced-motion: reduce` → static ambient light** | Cursor-follow OFF, breathing OFF, glint OFF; blob becomes a **static centered ambient light** (TZ §15) | S | Branch in JS init: don't attach pointermove or rAF; render single static halo via CSS only. |
| **`prefers-reduced-transparency` → drop glass entirely** | Replace glass surfaces with opaque surfaces matching surrounding bg, AND drop the blob field (or hold it at very low opacity ≤0.15) | M | DESIGN.md baseline already does this for `backdrop-filter`. v9 extends: blob also dims/disables. The TZ implies blob remains as ambient light but glass is opaque — research-level call: **dim blob to ambient halo (~0.2 opacity), keep static**. |
| **`prefers-contrast: more` → dim halo, boost text** | Reduce blob halo opacity, increase glass border alpha to AAA-friendly, raise text contrast (TZ §15) | S | DESIGN.md already specifies behaviours; v9 adds halo damping. |
| **No CSS-only motion regressions** | All blob motion must be JS-gated by the media query (CSS `@media (prefers-reduced-motion: reduce)` is for layout/decorative only) | S | The JS initialiser checks the MQ. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Live MQ change handling** | If user toggles reduced-motion mid-session, blob loop should reconfigure without reload | M | Optional polish; uncommon UX but technically correct. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **`prefers-reduced-motion: reduce` → just `animation-duration: 0`** | DESIGN.md anti-pattern: snap-from-offset. Must explicitly reset transforms. |
| **Opt-out flags / cookie banners for motion** | OS-level preference is the contract. No app-level toggles for v9. |
| **Forcing the effect on regardless of preference** | Discrimination against vestibular/photosensitive users. Not negotiable. |

Complexity: **SMALL** if conditional branches are designed up front; **LARGE** if retrofitted late.

Dependencies: All renderer + physics code must read from a single "active mode" flag.

---

## Category 8 — Pointer-Leave-Window Behaviour

What happens when the user mouses out of the viewport entirely.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Detect leave** | `pointerleave` on document / window or `mouseleave` on `document.documentElement` | S | Both events; fallback chain. |
| **Decay to last position with relaxation** | Blob does not snap to center. It drifts toward last known position with reduced opacity over ~1–2s, then settles into a slow ambient drift | M | Effectively engages the mobile-ambient loop centered on last position. |
| **Halo dim** | Halo opacity dampens to ~50% of normal during "absent" mode | S | Adds subtle "sleep" cue. |
| **Re-enter resumes follow** | On `pointermove` after re-enter, smooth re-acquisition of cursor (no teleport) | S | Existing exponential smoothing handles this for free. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Slow drift after extended absence** | After ~5s of absence, blob enters mobile-ambient mode shape | S | Reuse mobile-ambient drift code path. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Blob snap-disappears on leave** | Reads as "broken" — TZ §6 spirit: motion should always be smooth. |
| **Blob teleports to viewport edge nearest cursor** | Gimmicky. |

Complexity: **SMALL**. Reuses cursor-follow + ambient code paths.

Dependencies: **Cursor-Follow Physics (Cat 2)** + **Mobile Ambient (Cat 6)**.

---

## Category 9 — Section / Scroll Transitions

How the blob participates in scroll.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Blob is fixed-positioned; scrolling does not move it relative to viewport** | TZ §17 — `position: fixed; inset: 0` | S | Falls out of position model. |
| **Glass surfaces re-reveal blob differently as they pass over it** | This is the central "blob looks different under different layers" effect (TZ §10) — produced automatically by scroll because different glass tiers pass over the fixed blob | S | No code; emerges from layout. |
| **Scroll does not pause cursor-follow on desktop** | Scrolling continues physics loop; rAF drives both | S | No-op: rAF doesn't care about scroll. |
| **Scroll DOES pause ambient updates on mobile** | Cat 6 already covers this | S | See Cat 6. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Scroll-velocity coupling (very subtle)** | Brief halo expansion proportional to scroll velocity; gives subliminal "the page is moving" cue | M | Optional polish. Very easy to over-do — would violate медицинский tone. **Recommend: SKIP for v9 baseline; revisit if shipping feels flat.** |
| **Cross-section ambient pulses** | Slow scheduled glint pulses when crossing section boundaries | M | Not in TZ. Reject — adds complexity for marginal payoff. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Parallax on the blob** | TZ §17 says fixed; PROJECT.md "Out of Scope" lists "Параллакс / тяжёлые анимации" for ЦА 45+. Hard reject. |
| **Section-scoped blob colors (e.g. teal in checkup section)** | Brand parity violation. The blob is the brand light source and must not change identity. |
| **Snap-scroll / scroll-jacking** | Anti-A11y; violates 45+ audience expectation of normal scroll. |

Complexity: **SMALL**. Mostly emergent from layout.

Dependencies: **Blob Renderer (Cat 1)**, **Mobile Ambient (Cat 6)**.

---

## Category 10 — Performance Characteristics

What "good" looks like at runtime.

### Table Stakes

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Desktop budget** | Stable 60fps on hero + scroll on a mid-tier 2020 laptop (TZ §16) | M | Verified via Chrome perf trace. |
| **Mobile budget** | No measurable scroll fps drop on a budget Android (Snapdragon 6xx-class). DESIGN.md: ≤12px blur, ≤2 stacked glass layers. | M | Verified on a real device, not emulator. |
| **Single rAF for blob + heat + ambient** | One loop dispatching all updates per frame (TZ §16) | S | Architectural up-front decision. |
| **Single `pointermove` listener** | TZ §16 | S | Architectural. |
| **Transform/opacity-only animation** | Per TZ §16 | S | No layout properties touched in any animation. |
| **`will-change: transform` on sublayers** | Hints the compositor | S | Set once at mount; do NOT toggle dynamically. |
| **`pointer-events: none` on the field** | TZ §17 | S | Otherwise blocks UI clicks. |
| **`prefers-reduced-motion` → minimal CPU** | Static render; no rAF (TZ §16) | S | See Cat 7. |

### Differentiators

| Feature | Spec | Complexity | Notes |
|---------|------|------------|-------|
| **Page-visibility-API pause** | When tab is hidden, pause rAF | S | One-line addition; nice-to-have for laptop battery. |
| **In-viewport observer for sublayer pausing** | Effectively unused since blob is fixed full-viewport — skip. | — | N/A here. |

### Anti-Features

| Anti-Feature | Why reject |
|--------------|------------|
| **Animated `box-shadow` on multiple elements** | TZ §16 explicit ban. |
| **Animated `backdrop-filter blur(N)` values** | GPU-poison on mobile. |
| **Per-frame React state** | TZ §16 ban — re-render storms. |
| **Animating layout properties** | `width/height/top/left/margin` per frame — forbidden. |
| **Many DOM nodes** | TZ §16 — "создавать много DOM-элементов" forbidden. The blob is ≤4 DOM nodes; do not balloon. |

Complexity: **MEDIUM**. Easy to write correctly; tedious to verify on real devices.

Dependencies: **All renderer/physics categories** must commit to the constraints.

---

## Cross-Category Dependency Graph

```
[Cat 1: Blob Renderer]
    │
    ├── used by ─→ [Cat 2: Cursor Physics]
    │                  │
    │                  ├── feeds ─→ [Cat 3: Heat Accumulation]
    │                  │
    │                  └── feeds ─→ [Cat 8: Pointer-Leave]
    │
    └── used by ─→ [Cat 6: Mobile Ambient]
                       │
                       └── used by ─→ [Cat 8] and [Cat 9]

[Cat 4: Glass UI Redesign] (independent — touches DESIGN.md + components)
    │
    └── enables ─→ [Cat 5: Optical Depth Hierarchy]

[Cat 7: A11y Modes] — gates [Cat 2], [Cat 3], [Cat 6] at runtime

[Cat 10: Performance] — cross-cutting; constrains [Cat 1, 2, 3, 6, 9]
```

**Critical path:** Cat 1 (renderer) → Cat 2 (physics) → Cat 3 (heat) blocks all behavioural polish. Cat 4 (glass redesign) is independent and can run in parallel — it is the **largest** content edit.

**A11y must be designed-in, not bolted-on:** Cat 7 must be settled before any cursor code lands.

---

## MVP Recommendation

If forced to ship a subset of v9, ship in this order:

1. **Cat 4 (Glass UI Redesign)** — biggest visual improvement and an independent foundation. The page can ship with this even before any blob exists, and would already feel different.
2. **Cat 1 (Blob Renderer) + Cat 5 (Optical Depth)** — gets the page to "blob exists, glass tiers correct", a publishable state.
3. **Cat 2 (Cursor Physics) + Cat 7 (A11y gating)** — adds interactivity, but A11y gates land simultaneously, not later.
4. **Cat 6 (Mobile Ambient)** — required for mobile parity before public launch.
5. **Cat 3 (Heat Accumulation)** — polish layer.
6. **Cat 8 (Pointer-Leave) + Cat 9 (Scroll polish)** — final polish.
7. **Cat 10 (Performance)** — verification gate before any release; not a discrete phase but a checklist applied across all phases.

**Defer / probable cut:** scroll-velocity coupling (Cat 9 differentiator) — high risk of looking gimmicky for the medical tone.

---

## Anti-Features Master List (consolidated)

Quick-reference rejection list for the requirements definer:

| # | Anti-feature | Reason |
|---|--------------|--------|
| 1 | Multiple blobs | Single protagonist |
| 2 | Toxic/neon green | Brand parity |
| 3 | WebGL implementation | Bundle weight; CSS sufficient |
| 4 | Spring oscillation / bounce | Tone violation |
| 5 | Cursor trail (N copies) | TZ §14 explicit |
| 6 | Per-frame React state | Perf violation |
| 7 | Animating `box-shadow` | Perf violation |
| 8 | Animating `backdrop-filter` blur | Perf violation |
| 9 | Solid-white card backgrounds | TZ §9 |
| 10 | Milky / opaque glass fills > 0.16 | TZ §9 |
| 11 | Green tint on cards | TZ §9 |
| 12 | Section-scoped blob color shift | Brand parity |
| 13 | Parallax / scroll-jacking | PROJECT.md out-of-scope |
| 14 | Snap-disappear on pointer leave | Tone violation |
| 15 | Tilt / gyroscope drift | Permission prompts; not in TZ |
| 16 | App-level motion toggle | OS prefs are the contract |
| 17 | Heat-driven color shift toward red/orange | Brand parity |
| 18 | Heat triggers a visual "burst" | Tone violation |
| 19 | More than 4 sublayers | Scope creep, perf cost |
| 20 | Heat sound effect | Tone violation, scope creep |
| 21 | Blur > 12px on mobile | DESIGN.md hard constraint |
| 22 | Stacking 3+ glass layers per viewport | DESIGN.md hard constraint |

---

## Phase-Specific Warnings (forwarded to PITFALLS.md)

- Glass UI Redesign (Cat 4) is a giant edit across ~10 component files — high merge-conflict risk. Recommend a single dedicated phase.
- Cat 7 (A11y) **must** be designed before Cat 2 (physics) lands — retrofit is harder than gate.
- Mobile real-device testing (Cat 6, Cat 10) cannot be skipped. Snapdragon 6xx-class is the calibration target.
- The 4-sublayer DOM is brittle — an extra sublayer "for richness" is the most likely scope-creep vector. Hard-cap at 4.

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Feature decomposition | HIGH | TZ is unusually prescriptive; categories map 1:1 |
| Table-stakes selection | HIGH | TZ enumerates them explicitly |
| Differentiator selection | MEDIUM | Judgement calls on which polish features pay off vs distract |
| Anti-feature selection | HIGH | TZ enumerates most of these, plus DESIGN.md and PROJECT.md hard constraints |
| Production-reference calibration | MEDIUM | Patterns named are real but specific tuning values are repo-internal |
| Mobile / a11y constraints | HIGH | Already encoded in DESIGN.md and PROJECT.md |

---

## Sources

- `/Users/mikhail/Projects/Medicus_video_consult-landing/design/LIQUID_GLASS_BLOB_TZ.md` — primary spec (20 sections, 12 acceptance criteria)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN.md` — Liquid Glass token + HIG compliance contract
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/PROJECT.md` — project state, constraints, out-of-scope list
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Bram.us — How To create the Stripe Website Gradient Effect](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/)
- [Kevin Hufnagl — How To: Create the Stripe Website Gradient Effect](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/)
