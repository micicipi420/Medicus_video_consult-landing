# Research Summary — v9.0 Living Blob Liquid Glass Scene

**Project:** MedicusUnion KZ (medicusunion.kz)
**Milestone:** v9.0 — Living Blob Liquid Glass Scene
**Researched:** 2026-04-30
**Supersedes:** stale v7.0 summary (2026-04-13)
**Confidence:** HIGH

---

## TL;DR

v9.0 transforms the existing milky-glass UI into a full liquid-glass scene where a single cursor-following green blob is the only opaque object on the page. Every glass surface must drop from the current `bg-white/40–75` range to the TZ-mandated `rgba(255,255,255,0.04–0.16)` tier system. The blob is a `<canvas>` 2D renderer — a single DOM node — driven by a vanilla `requestAnimationFrame` loop that writes five CSS custom properties to `:root`. No new dependencies. No React state on pointer move. Glass surfaces consume blob position passively via CSS `radial-gradient` rules. The dominant build risk is the glass opacity sweep across ~45 component files; it must be done after the blob is visible, not before.

The five highest-impact pitfalls: form readability collapse under transparent glass; CTA disappearing into green-on-green; mobile blur regression past 12px cap; accessibility media-query bypass on new code paths; and rAF/listener leaks under React Strict Mode.

Build order is non-negotiable: Foundation (tokens + a11y wiring) → Blob Engine → Glass rework per surface → Per-page propagation → Verification.

---

## Key Findings

### Recommended Stack

No new npm dependencies are required. The entire v9.0 implementation relies on browser primitives already available in the project's installed stack (Next.js 15.5.15, React 19.1.0, TypeScript, Tailwind 4, framer-motion 12.38.0).

The renderer is a Canvas 2D context inside `LivingBlobField.tsx` (`'use client'`, mounted via `next/dynamic({ ssr: false })` from `app/layout.tsx`). Blob position, heat, and velocity are published as CSS custom properties on `document.documentElement` — the same pattern already proven by `useSpecularHighlight.ts`. The physics module is ~80 lines of vanilla lerp math. Framer Motion is not used for the blob loop (it would trigger React reconciliation per frame); it remains in place for existing scroll-reveal and entrance animations only.

**New files (no new dependencies):**

| File | Type | Role |
|------|------|------|
| `next/src/components/effects/LivingBlobField.tsx` | new — client component | Canvas renderer, pointer listener, rAF loop, mode detection |
| `next/src/styles/blob.css` | new — stylesheet | Sub-layer base styles, ambient keyframes, reduced-motion guards |
| `next/src/hooks/use-blob-aware.ts` | new — optional hook | Per-element blob-distance for max 3 premium components |

**Modified files:**

| File | Change |
|------|--------|
| `next/src/app/layout.tsx` | Remove `MeshBackground`, add `LivingBlobField`, seed `:root` CSS vars |
| `next/src/app/globals.css` | Add `--blob-*` palette tokens and `--glass-*-fill/blur` tier tokens |
| `next/src/styles/liquid-glass.css` | Re-point `.liquid-*` utilities to new tokens; add heat-leak gradients |
| `next/src/components/layout/MeshBackground.tsx` | Delete — replaced by `LivingBlobField` |

**New CSS tokens required in `globals.css`:**

Blob palette: `--blob-core: #35B678` (alias of `--mu-primary`), `--blob-hot: #4FE098` (NEW color — requires Key Decision in PROJECT.md and DESIGN.md update before implementation begins), `--blob-halo: rgba(98,221,177,0.5)`, `--blob-edge: rgba(125,205,255,0.18)`, `--blob-glint: rgba(255,255,255,0.65)`.

Runtime vars written by the rAF loop: `--blob-x`, `--blob-y`, `--blob-body-x/y`, `--blob-halo-x/y`, `--blob-heat`, `--blob-velocity`.

Glass tier tokens: `--glass-section-fill` (0.06 desktop / 0.10 mobile), `--glass-card-fill` (0.10 / 0.14), `--glass-form-fill` (0.14 / 0.18), `--glass-button-fill` (0.12 / 0.16), plus matching `--glass-*-blur` vars with mobile cap at 12px.

**Existing pattern that confirms viability:** `next/src/hooks/use-specular-highlight.ts` already ships the rAF + CSS-variable + pointer-listener pattern. v9.0 lifts it to global scope. Confidence HIGH based on internal evidence, not theory.

**What NOT to add (reject list):**

| Reject | Why |
|--------|-----|
| GSAP | 23 KB for what 80 LoC of lerp does |
| Motion One | 3.8 KB; wrong model for a continuously-running rAF loop |
| three.js / r3f / PixiJS | 80–150 KB for a 2D radial gradient |
| `react-use` or `usehooks-ts` `useMouse` | Forces React state — re-renders on every move |
| Zustand / Context for blob state | Subscribers re-render per frame |
| SVG `feGaussianBlur` on moving subject | Paint thrash on Android Chromium |
| CSS Houdini Paint Worklet | Safari does not support |
| `will-change` on all glass cards | GPU OOM on budget Android |

### Expected Features

**Table stakes — TZ-mandated, non-negotiable:**

| Feature | TZ ref |
|---------|--------|
| Single fixed-position canvas blob, `z-index: 0`, `pointer-events: none` | §17 |
| 4 sublayers: core (snappy), body (viscous), halo (slow), glint (dwell-reactive) | §5 |
| Brand-locked palette: green family only, no neon, no gaming aesthetics | §5 |
| Viscous exponential-smoothed cursor follow, different `k` per sublayer | §6 |
| Velocity-driven shape stretch along motion vector | §6 |
| Heat accumulation: 1.5–3s dwell — core brightens, halo expands, glint appears | §7 |
| Heat decay on movement: smooth, 600ms minimum, no jump | §7 |
| Glass opacity tier system: 0.04 / 0.08 / 0.12 / 0.16 per surface depth | §9 |
| Every glass surface gets passive optical blob-response via CSS `radial-gradient` | §10 |
| Per-tier blur depth hierarchy (section wider blur, card medium, form tighter, control tightest) | §11 |
| Mobile: no pointer follow; autonomous slow drift; tap pulse; no scroll jank | §14 |
| `prefers-reduced-motion`: static ambient gradient, no rAF, no listener | §15 |
| `prefers-reduced-transparency`: blob hidden, glass becomes opaque | §15 |
| `prefers-contrast: more`: halo dimmed, text contrast verified WCAG AA minimum | §15 |
| CTA buttons always opaque, never glass | §13 |
| Text, form, and CTA readable at all blob positions | §12, §13 |
| Single `pointermove` listener, single rAF loop, transform/opacity-only animation | §16 |
| pointer-leave triggers smooth decay to last position + ambient drift, not snap-disappear | §6, §8 |

**Differentiators (should-have, above TZ minimum):**

| Feature | Notes |
|---------|-------|
| Per-section visibility weighting (header = restrained response) | Via CSS region-aware opacity; medium complexity |
| Heat-driven glass saturation lift via `backdrop-filter: saturate(...)` | Test perf cost before committing |
| Glint micro-shimmer cycle at peak heat | Must respect `prefers-reduced-motion` |
| Page Visibility API pause (tab hidden — rAF pauses) | 1-line addition; nice for laptop battery |
| `data-blob-mode` attribute on `<html>` for CSS branching | Cleaner than CSS var string branching |

**Anti-features — hard reject:**

| Anti-feature | Reason |
|--------------|--------|
| Multiple blobs | TZ §1: single protagonist rule |
| WebGL / three.js / PixiJS renderer | Bundle overkill; canvas 2D is sufficient |
| Spring physics with overshoot | Tone violation: not medical |
| Cursor trail (N copies) | TZ §14 explicit ban |
| Per-frame React `useState` | TZ §16 explicit ban |
| Solid-white / milky glass fills above 0.16 | TZ §9 |
| Green tint on cards | TZ §9 |
| Animated `backdrop-filter` blur values | GPU-poison on mobile |
| Animated `box-shadow` on dozens of elements | TZ §16 |
| Parallax | PROJECT.md out-of-scope; 45+ audience |
| Tilt / gyroscope drift | Permission prompts; not in TZ |
| Section-scoped blob color shift | Brand parity violation |
| Heat-driven color shift toward red or orange | Brand parity violation |
| `backdrop-filter` on the blob layer itself | Blob is behind glass, not glass itself |
| Blur above 12px on mobile | DESIGN.md hard constraint |
| 3+ glass layers per viewport | DESIGN.md hard constraint |

**Defer to v10+:**

- Scroll-velocity coupling (differentiator that risks medical tone)
- Per-route blob color theming
- Consolidating `useSpecularHighlight` into the global blob system
- `OffscreenCanvas` workerized rendering (Safari 15 lacks it)
- Tilt/gyroscope ambient (not in TZ, needs permission flow)

### Architecture Approach

The blob renderer is a globally-mounted singleton in `app/layout.tsx`, preserved across all App Router route transitions without teardown. It writes to `:root` CSS vars from inside a vanilla rAF loop. Zero React renders are triggered by blob state. Glass surfaces in `liquid-glass.css` consume blob position as passive CSS consumers via `radial-gradient(... at var(--blob-x) var(--blob-y), ...)`.

The key architectural insight: the CSS-variables-on-`documentElement` pattern is the only mechanism that lets pure-CSS glass utilities respond to the blob without per-element JavaScript or React subscriptions. It is already the project's own pattern (`useSpecularHighlight`).

**Key data flow:**

```
window pointermove
  → ref write (no React state)
    → rAF tick
      → lerp per sublayer (core 0.18, body 0.08, halo 0.04)
        → document.documentElement.style.setProperty(--blob-*)
          → browser CSS repaint on consumers
            → 0 React renders
```

**Component responsibilities:**

| Component | Responsibility |
|-----------|----------------|
| `LivingBlobField.tsx` | Canvas renderer, 1 pointer listener, 1 rAF loop, mode detection, CSS var writes |
| `blob.css` | Sub-layer styles, ambient keyframes, reduced-motion/transparency guards |
| `globals.css` | All token definitions: `--blob-*` palette, `--glass-*-fill/blur` tiers, runtime var seeds |
| `liquid-glass.css` | Glass utility classes re-pointed to new tier tokens + heat-leak gradients |
| `app/layout.tsx` | Mount point; replaces `MeshBackground`; seeds `:root` vars via inline `<style>` |
| ~45 component files | Opacity/blur class swaps to align with 4-tier system; CTA stays opaque |

**Mode branches:**

| Context | Behavior |
|---------|----------|
| `pointer: fine` + motion allowed | Full cursor-follow with heat accumulation |
| `pointer: coarse` | Autonomous Lissajous drift, tap pulse on background only, scroll-pause |
| `prefers-reduced-motion: reduce` | No listener, no rAF, static CSS ambient gradient |
| `prefers-reduced-transparency: reduce` | Blob `display: none`, glass becomes opaque |
| `[data-theme="dark"]` | Blob dimmed to ~35% opacity, follow disabled |

**SSR / hydration:** `dynamic({ ssr: false })` eliminates hydration mismatch. `:root` vars seeded server-side via inline `<style>` so glass surfaces have valid values during first paint.

**Confirmed repo state (all verified by filesystem inspection):**

- `LiquidBlobLayer.tsx` and `liquid-depth.css` do NOT exist in the repo — no removal needed
- `MeshBackground.tsx` IS the replacement target (17 lines, static blurred circles)
- `<main>` already has `relative z-10` in `layout.tsx` — no z-index conflict
- `GlassInteraction.tsx` + `useSpecularHighlight.ts` coexist safely (different namespace: `--mouse-x/y` vs `--blob-x/y`)

### Critical Pitfalls

Full detail in `.planning/research/PITFALLS.md`. Top 5 by conversion and stability impact:

**1. Form readability collapse (PITFALLS 3.2 + 9.1) — HIGH, conversion-critical.**
Dropping form glass to 0.04–0.08 with `text-muted` labels and a green blob bleeding through can push contrast below WCAG AA (4.5:1). Prevention: lock form panel to `--glass-form-fill` (0.16 minimum), promote labels from `text-muted` to `text-primary`, keep input chrome `bg-white` (opaque). Log as Key Decision in PROJECT.md before Phase G.

**2. CTA disappears into blob (PITFALLS 3.1) — HIGH, conversion-critical.**
The gradient CTA (`#1AC67E → #0D9DB5`) overlaps spectrally with `--blob-core (#35B678)`. When blob halo bleeds through a section containing a CTA, the result is green-on-green visual blur. Prevention: CTAs are always opaque, never receive `backdrop-filter`. Verify by grep on every CTA component.

**3. Mobile blur regression past 12px (PITFALLS 1.1) — HIGH, UX-critical.**
Phase 79 shipped the 12px cap. v9.0 adds a blob layer that could multiply mobile GPU cost. The blob layer itself uses no `backdrop-filter` (radial gradient + transform only), but glass rework must not relax the cap on any component. All `--glass-*-blur` mobile values must be 12px or less. Add CI lint rule.

**4. A11y media-query bypass on new code paths (PITFALLS 2.1, 2.4, 2.5, 11.1) — HIGH.**
Phase 85 wired `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast` for existing surfaces. `LivingBlobField` and any new glass classes are a fresh code path that can bypass that wiring. Prevention: use `@layer` with a single enumerated block covering all glass class names. Blob engine reads MQ at init and on `change`. Playwright tests must emulate all three preferences.

**5. rAF and listener leaks across route navigation (PITFALLS 1.5, 8.3) — HIGH, stability-critical.**
React Strict Mode double-invokes effects in dev. App Router keeps `layout.tsx` mounted across route changes. If the engine is not idempotent, two rAF loops accumulate and produce stutter. Prevention: singleton engine module with `start()` / `stop()` where `start()` is a no-op if already started; `useEffect` cleanup always calls both `cancelAnimationFrame` and `removeEventListener`; expose `window.__blobDebug.rafCount` in dev and assert == 1 in Playwright after 5 route navigations.

---

## Implications for Roadmap

### Phase 1: Foundation — Tokens, A11y Wiring, DOM Skeleton

**Rationale:** Nothing else can be verified without the token system and accessibility gates. The glass rework cannot be tuned visually until `--glass-*-fill/blur` tokens exist. The blob engine cannot be tested for reduced-motion compliance until the MQ wiring is defined. This phase ships no visible change — the page looks identical to v8.0 — but establishes the contract every subsequent phase builds on.

**Delivers:**
- DESIGN.md YAML updated with `colors.blob.*` tokens (required before any `--blob-hot` usage per brand-parity rule); Key Decision logged for `#4FE098`
- `globals.css`: `--blob-*` seed defaults and tier tokens; `--glass-section/card/form/button-fill/blur`; `--blob-response-*` intensity vars
- `liquid-glass.css`: `@layer` block enumerating all glass class names under all three a11y media queries (`prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more`)
- `layout.tsx`: `<div class="living-blob-field" aria-hidden="true">` with 4 static sub-layer children; seed `<style>:root{--blob-x:50vw;--blob-y:50vh;--blob-heat:0}</style>`; `MeshBackground` removed
- `blob.css`: sub-layer base styles, `prefers-reduced-motion` static-fallback CSS, `prefers-reduced-transparency` hide rule
- z-index contract documented in DESIGN.md (blob-field: 0, main: 1–10, header/sticky: 50+, modals: 100+)
- CTA opaque-forever rule added to DESIGN.md v9.0 custom section
- v9.0 anti-patterns appendix in DESIGN.md mirroring TZ §16 forbids list plus new discoveries

**Pitfalls addressed:** 2.1, 2.4, 2.5, 10.1, 10.2, 14.1, 14.2
**Research flag:** Standard patterns — all token values sourced directly from TZ §5, §9, §11, §17. No additional research needed.

---

### Phase 2: Blob Engine — Renderer, Physics, Mobile Ambient

**Rationale:** The renderer must exist before any glass opacity can be verified visually. Building glass first means working blind.

**Delivers:**
- `LivingBlobField.tsx`: `'use client'`, `dynamic({ ssr: false })`. Canvas 2D with 4 sublayers. Single `pointermove` listener on `window` (`{ passive: true }`). Single rAF loop with lerp per sublayer. Heat accumulator (`idleMs / 2500`, clamped 0..1). Writes 8 CSS vars to `:root` each frame.
- Singleton engine guard: `start()` no-op if already started; cleanup cancels rAF + removes listener
- Mobile branch (`pointer: coarse`): no listener; slow Lissajous ambient drift; tap pulse 400ms maximum on background only, rate-limited 1 per 600ms; scroll-pause via passive scroll listener
- `prefers-reduced-motion` branch: no listener, no rAF, CSS static ambient only
- `data-blob-mode` attribute on `<html>` updated on mode change
- `blob.css`: ambient drift `@keyframes`, reduced-motion static state
- Dev-only `window.__blobDebug.rafCount` for Playwright assertion
- Page Visibility API pause (hidden tab)

**Pitfalls addressed:** 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.3, 5.1, 5.2, 5.3, 8.1, 8.2, 8.3, 12.3, 12.4, 13.4
**Research flag:** Standard patterns. One LOW-confidence area: lerp factors and heat timing are TZ-informed starting points, not final values — must be tuned in-browser per TZ §17. Plan 1–2 visual iteration sessions after this phase ships.

---

### Phase 3: Glass Rework — Chrome and Index Sections

**Rationale:** Chrome (Header, MobileMenu, StickyBar, Footer) is always visible and establishes the visual register for the whole site. Complete chrome + index sections first for a fully verifiable baseline before sweeping sub-pages.

**Delivers:** Opacity sweep of all components visible on the `/` index route:

| Component | Current (approx) | Target |
|-----------|-----------------|--------|
| `HeaderClient.tsx` | `bg-white/30–50` | `bg-white/14` rest / `bg-white/22` scrolled, blur 24px max |
| `MobileMenu.tsx` dropdown | `bg-white/68`, 80px blur | `bg-white/14`, 24px desktop / 12px mobile |
| `StickyBar.tsx` | `bg-white/68`, `3xl` blur | `bg-white/14`, 12px max |
| `Footer.tsx` | varies | `bg-white/06`, Tier 0 |
| `HeroHub.tsx` frame | `bg-white/75` | `bg-white/16`, Tier 0; CTA gradient stays opaque |
| `StatsBar.tsx` | `bg-white/60–70` | wrapper `bg-white/08`, cards `bg-white/10` / hover `bg-white/14` |
| `ServicesGrid.tsx` | `bg-white/60–70` | cards `bg-white/10` / hover `bg-white/14` |
| `ProcessSection`, `ProblemSection`, `WhyUsSection`, `ClinicsSection`, `PlatformSection`, `ReviewsSection` | various | per-tier sweep |
| `FAQSection.tsx` | varies | closed Tier 1, open Tier 2 |
| `ContactForm.tsx`, `ContactSection.tsx` | varies | form panel `--glass-form-fill` (0.16 minimum), labels `text-primary`, inputs `bg-white` opaque |
| `FinalCTA.tsx` | varies | Tier 0 section frame; CTA opaque |

`liquid-glass.css` updated: all `.liquid-*` utility classes re-pointed to `--glass-*` tokens; deprecated `--liquid-bg: rgba(255,255,255,0.42)` replaced; heat-leak `radial-gradient` rules added to `.liquid-card` and `.liquid-regular`.

**Pitfalls addressed:** 3.1, 3.2, 3.3, 9.2, 9.3, 10.1, 10.2, 10.3
**Research flag:** No research needed — mechanical class swaps against defined tokens. Judgment call: if form contrast at 0.16 fails WCAG AA in testing, escalate form fill to 0.30 and log Key Decision.

---

### Phase 4: Per-Page Propagation — Sub-Routes

**Rationale:** All 4 routes share `layout.tsx` so the blob is already live on sub-pages after Phase 2. This phase applies Phase 3 patterns to service-specific components. Token and utility work is already done — mechanical class swapping with per-page visual verification.

**Delivers:**
- `next/src/components/sections/checkup/*.tsx` (8 files): per-tier sweep
- `next/src/components/sections/consultations/*.tsx` (8 files): per-tier sweep
- `next/src/components/sections/treatment/*.tsx` (4 files): per-tier sweep
- `next/src/components/sections/contacts/*.tsx` (2 files): per-tier sweep
- `next/src/components/sections/service/{ServiceHero,FAQ,SocialProof,LeadFormSection}.tsx` — `LeadFormSection` gets same form-safety treatment as `ContactForm`
- `next/src/components/ui/{card,dialog,input,select,textarea}.tsx` — shadcn primitives done last within this phase (highest blast-radius)

Each sub-route gets a visual diff vs pre-v9.0 screenshot baseline before marking done.

**Pitfalls addressed:** 9.1 (service-page form readability collapse)
**Research flag:** No research needed. Watch: shadcn primitives touch everything — do them last.

---

### Phase 5: Verification — UAT, Performance, A11y, Brand Review

**Rationale:** Verification is a gate, not an afterthought. Phase 89 history (cheat-pass on a11y) makes this a hard-gated phase. Nothing ships to production without all checklist items signed off.

**Delivers:**
- Playwright UAT: all 10 TZ §18 browser scenarios. Key assertions: blob transform changes on pointer move (assert value changed, not specific value); blob transform static under `prefers-reduced-motion`; `window.__blobDebug.rafCount === 1` after 5 route navigations; form + CTA screenshot regions stable vs pre-v9.0 baseline (blob area masked)
- A11y emulation tests: all three MQ preferences asserted in Playwright
- Lighthouse CI gate: LCP 2500ms max, INP 200ms max, CLS 0.1 max, TBT 200ms max (mobile throttled). Fail PR if regression > 10%
- Chrome DevTools performance trace: desktop 60fps on hero scroll; single composited layer for `.living-blob-field` confirmed in Layers panel
- Real-device manual UAT (hard gate, no trust-me pass): (a) iPhone iOS 16 or 17 Safari, (b) low-end Android 4GB RAM max (Redmi 9-class), (c) desktop Chrome + Firefox + Safari — each with signed-off checklist + screenshot or video attached to the phase report
- Firefox `backdrop-filter` stutter check — document any fallback threshold
- axe-core / Pa11y run against each route
- Brand visual review: still frame at heat-peak side-by-side with `medicusunion.com` — if it reads as a fitness app, saturation pulled back
- TZ §19 acceptance criteria checklist: all 12 criteria verified

**Pitfalls addressed:** 1.1, 2.1–2.5, 3.1–3.3, 6.1, 6.2, 6.3, 7.1, 7.2, 12.2, 15.1–15.3
**Research flag:** No research needed. Execution-heavy, checklist-driven. Contingency: if real-device testing reveals mobile fps still degraded despite the 12px blur cap and canvas renderer, reduce ambient blob opacity on mobile by 50% — a single CSS token change with no architectural impact.

---

### Phase Ordering Rationale

The ordering is dictated by one constraint: you cannot verify glass transparency until the blob exists behind it. Foundation → Engine → Glass is non-negotiable.

The glass sweep is split into Phases 3 and 4 (index vs sub-routes) for manageable PR size and blast-radius control, not for technical reasons. Within each phase, parallel execution across components is safe once tokens and `liquid-glass.css` utilities are finalized (different files, no merge conflicts).

A11y must be designed-in at Foundation (Phase 1), not retrofitted. The `@layer` block enumerating all glass class names is the mechanism. Adding a new glass class in Phase 3 without updating that block is the primary failure mode. Code review checklist item for every Phase 3/4 PR: any new CSS class beginning with `glass-` or `liquid-` must appear in the reduced-transparency `@layer` block.

### Research Flags

**Needs no additional research (standard patterns):**
- Phase 1 (Foundation): all token values are TZ-prescriptive
- Phase 2 (Engine): Canvas 2D + rAF + CSS vars is well-documented; internal `useSpecularHighlight` is the codebase proof-of-concept
- Phase 3/4 (Glass rework): mechanical class swaps against defined tokens
- Phase 5 (Verification): checklist execution

**Needs validation during execution (judgment calls, not research):**
- Visual tuning constants (lerp factors, heat timing 2500ms): calibrate in-browser per TZ §17 — not researchable up-front
- Form glass alpha floor: start at 0.16; escalate to 0.30 if body copy contrast fails testing
- Firefox `backdrop-filter` performance: if stutter observed, document the fallback blur-reduction threshold
- `--blob-hot: #4FE098` brand approval: one visual comparison session against `medicusunion.com` before Phase 2 begins

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies; all primitives verified in installed packages; `useSpecularHighlight.ts` proves the pattern ships in this codebase |
| Features | HIGH | TZ is unusually prescriptive (20 sections, 12 acceptance criteria); category decomposition maps 1:1 to TZ sections; anti-features are TZ-enumerated |
| Architecture | HIGH | All referenced files inspected in actual repo; `LiquidBlobLayer.tsx` / `liquid-depth.css` non-existence verified; `MeshBackground.tsx` confirmed as replacement target; z-index contract confirmed against `layout.tsx` line 55 |
| Pitfalls | HIGH | Grounded in Phase 79/85/89 project history + DESIGN.md hard constraints + well-documented WebKit/Blink behaviors |

**Overall confidence:** HIGH

### Gaps to Address

- **`--blob-hot` color approval.** `#4FE098` is a genuinely new brand color. It must be logged as a Key Decision in PROJECT.md and added to DESIGN.md YAML before Phase 2 begins. One visual comparison session against `medicusunion.com` will resolve whether the saturation reads as medical or neon.
- **Visual tuning constants.** Lerp factors (`k_core ~0.18`, `k_body ~0.08`, `k_halo ~0.04`) and heat timing (2500ms ramp, 600–900ms decay) are TZ-informed starting points. TZ §17 explicitly states they "must be chosen visually on a real page." Plan 1–2 in-browser tuning sessions after Phase 2 ships.
- **Form glass alpha floor.** 0.16 is the research recommendation, but the actual floor depends on the specific background visible behind each form. If axe-core testing reveals body copy drops below 4.5:1, escalate to 0.30 and log Key Decision.
- **Firefox performance threshold.** No Firefox-specific profiling done in research. If `backdrop-filter` combined with the blob causes stutter, the mitigation (reduced blur tier) is known but the trigger threshold must be established empirically in Phase 5.
- **`SvgRefractionDefs.tsx` usage map.** The file exists in `layout.tsx` and provides SVG filter definitions, but research did not map every component that consumes its filter IDs. Verify before Phase 3 touches components that may reference it.

---

## Sources

### Primary — HIGH confidence (direct project files, all inspected)

- `design/LIQUID_GLASS_BLOB_TZ.md` — primary spec (20 sections, 12 acceptance criteria). All numerical targets trace here.
- `DESIGN.md` (repo root) — hard constraints: 2 glass per viewport max, mobile blur 12px max, `prefers-reduced-*` mandatory, dark mode disables `backdrop-filter`, brand-color parity rule.
- `.planning/PROJECT.md` — v9.0 milestone active; project constraints; out-of-scope list.
- `next/src/hooks/use-specular-highlight.ts` — internal proof-of-concept for rAF + CSS-var + pointer-listener pattern.
- `next/src/styles/liquid-glass.css` (1037 lines) — existing utility class names, `--liquid-bg: rgba(255,255,255,0.42)` token (to be replaced), anti-patterns in header.
- `next/src/app/globals.css` (689 lines) — `--liquid-blur-{sm,md,lg,xl}` and brand color tokens already present.
- `next/src/app/layout.tsx` (62 lines) — all routes share this layout; `MeshBackground` is current background; z-index state.
- `next/src/components/layout/MeshBackground.tsx` — confirmed replacement target (17 lines).
- `next/package.json` — verified: `next@15.5.15`, `react@19.1.0`, `framer-motion@^12.38.0`, `tailwindcss@^4`.

### Secondary — HIGH confidence (official vendor documentation)

- [Next.js App Router — dynamic with ssr false](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading) — confirmed for App Router.
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials) — glass-surface composition model.
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion) — reduced-motion compliance.
- [MDN — Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) — browser support: all evergreen + Safari 15+.

### Secondary — MEDIUM confidence (editorial, cross-checked against vendor docs)

- [Bram.us — Stripe gradient effect](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/) — autonomous mesh gradient pattern; mobile ambient inspiration.
- [Motion docs — bundle size](https://motion.dev/docs/react-reduce-bundle-size) — confirms Motion One ~3.8 KB; Framer Motion ~34 KB without `LazyMotion`.
- [LogRocket — React animation libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) — bundle size survey for rejection rationale.

---

*Research completed: 2026-04-30*
*Supersedes: stale v7.0 SUMMARY.md (2026-04-13)*
*Ready for requirements definition: yes*
*Ready for roadmap: yes*
