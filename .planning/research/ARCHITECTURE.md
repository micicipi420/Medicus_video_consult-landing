# Architecture: Living Blob Liquid Glass Scene (v9.0)

**Domain:** Global animated background layer + glass UI rework on a Next.js App Router multi-page site
**Researched:** 2026-04-30
**Milestone:** v9.0 — Living Blob Liquid Glass Scene
**Confidence:** HIGH (verified against actual repo state — all referenced files inspected)

---

## Executive summary

The Living Blob is a **single, globally-mounted, fixed-position client component** that runs **one** pointermove listener and **one** rAF loop, writing four-to-five CSS custom properties (`--blob-x`, `--blob-y`, `--blob-heat`, `--blob-velocity`, `--blob-mode`) to `document.documentElement.style`. **Zero React state** for blob position. Existing glass utilities in `next/src/styles/liquid-glass.css` and component-level Tailwind classes consume those CSS vars passively (no React subscription). All four routes (`/`, `/treatment-abroad`, `/consultations`, `/checkup`) inherit the blob automatically because they share `next/src/app/layout.tsx`.

The pre-existing `MeshBackground.tsx` (3 static blurred circles + frosted overlay) is the thing being **replaced**. The prompt mentioned `LiquidBlobLayer.tsx` and `liquid-depth.css` but **neither file exists in the current repo** (verified via filesystem search) — they are not blockers and need not be deleted.

The dominant integration risk is **opacity inflation in 45 components**: every existing glass surface ships `bg-white/40` to `bg-white/75` (milky), which violates the v9.0 ТЗ ceiling of `rgba(255,255,255,0.16)`. The build order must therefore put the renderer first (so we can see the blob through reduced opacities) and then sweep components in tiers.

---

## 1. Mount point — global, in `layout.tsx`

**Decision:** Mount the blob renderer **once** in `next/src/app/layout.tsx`, not per-page.

**Rationale:**
- All four routes (`/`, `/treatment-abroad`, `/consultations`, `/checkup`) share the same root layout — verified by inspecting `app/{page,checkup/page,consultations/page,treatment-abroad/page}.tsx`. Each `page.tsx` returns only section components; chrome (Header, Footer, StickyBar, MeshBackground, SvgRefractionDefs) lives in `layout.tsx`.
- A per-page mount would re-create the listener and rAF loop on every client-side route transition, leak the previous listener if cleanup is imperfect, and produce a one-frame flash of "no blob" between routes.
- Mounting in `layout.tsx` means the blob persists across `next/link` navigations as a stable subtree (App Router preserves layout subtrees during route changes) — the blob never "blinks" between pages.

**SSR plan:**
- The renderer is a `'use client'` component. It must render a deterministic, empty-ish DOM during SSR (`<div class="living-blob-field" aria-hidden="true" />` plus the four sub-layer `<div>`s with seeded transforms) so server HTML and first-client-render HTML match (no hydration mismatch).
- Initial CSS-var values are seeded by an inline `<style>` on `:root` in `layout.tsx` (e.g. `--blob-x: 50vw; --blob-y: 50vh; --blob-heat: 0; --blob-velocity: 0; --blob-mode: ambient;`). This ensures glass surfaces have valid var values during the first paint, before the client component mounts and starts updating them.
- The `useEffect` inside the renderer attaches the pointermove listener and starts rAF only on the client — so SSR runs zero animation work.

**Hydration plan:**
- Server emits `<div class="living-blob-field" aria-hidden="true">` with four sub-layer children, all deterministic.
- Client hydrates the same DOM. After hydration, the renderer's `useEffect` (a) starts writing `:root` CSS vars on each rAF tick and (b) toggles `document.documentElement.dataset.blobMode` based on `pointer:coarse` and `prefers-reduced-motion` checks.
- `prefers-reduced-motion` and mobile checks happen inside `useEffect`, not during render — mode switches cause CSS-var/data-attribute updates only, not DOM reshape.

**Z-index contract (already partially in place):**
- `.living-blob-field`: `position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;`
- `<main>` already has `relative z-10` in `layout.tsx` line 55 — **no change needed**.
- `Header` is `fixed z-50` and `StickyBar` is `fixed z-50` — **no change needed**.
- `MeshBackground` currently sits at `z-0` and must be **removed or replaced** (see §8).

---

## 2. Single pointermove pipeline

**Decision:** Exactly one `pointermove` listener attached to `window`, exactly one rAF loop alive at a time. Both live inside the renderer component's `useEffect`.

**Pattern:**

```text
useEffect(mount):
  rawX = window.innerWidth / 2
  rawY = window.innerHeight / 2
  // smoothed targets, one per sub-layer, with different lerp factors
  coreX, bodyX, haloX = rawX  (and Y)
  heat = 0
  lastMoveTs = performance.now()
  lastSampleTs = lastMoveTs

  onPointerMove(e):
    rawX = e.clientX
    rawY = e.clientY
    velocity = distance(prev, raw) / dt   // for stretch/heat reset
    lastMoveTs = performance.now()

  rafTick(now):
    dt = now - lastSampleTs
    coreX = lerp(coreX, rawX, 0.18)        // core: snappy
    bodyX = lerp(bodyX, rawX, 0.08)        // body: viscous
    haloX = lerp(haloX, rawX, 0.04)        // halo: lazy
    idleMs = now - lastMoveTs
    heat   = clamp(idleMs / 2500, 0, 1)    // 0..1 over ~2.5s of stillness
    setCSSVar('--blob-x',        coreX + 'px')
    setCSSVar('--blob-y',        coreY + 'px')
    setCSSVar('--blob-body-x',   bodyX + 'px')
    setCSSVar('--blob-body-y',   bodyY + 'px')
    setCSSVar('--blob-halo-x',   haloX + 'px')
    setCSSVar('--blob-halo-y',   haloY + 'px')
    setCSSVar('--blob-heat',     heat.toFixed(3))
    setCSSVar('--blob-velocity', velocity.toFixed(3))
    raf = requestAnimationFrame(rafTick)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  raf = requestAnimationFrame(rafTick)

  cleanup:
    window.removeEventListener('pointermove', onPointerMove)
    cancelAnimationFrame(raf)
```

**Why `window`, not `document` or a child element:**
- `window` captures pointermove even when the cursor crosses scrollbars or hovers over fixed-positioned chrome; matches user expectation that the blob keeps moving until cursor truly leaves.
- `pointer-events: none` on `.living-blob-field` itself ensures the renderer never swallows clicks.

**How React components opt-in:**
Components do **not** subscribe via React. They consume the vars purely through CSS:

```css
.liquid-card {
  /* light leak: brightens when blob is near */
  background-image: radial-gradient(
    600px circle at var(--blob-x) var(--blob-y),
    rgba(53, 182, 120, calc(0.06 + 0.10 * var(--blob-heat))),
    transparent 60%
  );
}
```

The browser repaints affected layers automatically when `:root` vars change. **Zero React renders triggered**.

**Cleanup:**
- The renderer's `useEffect` returns a cleanup function that removes the listener and cancels rAF.
- React Strict Mode double-mount in dev is safe: cleanup unwires the first instance before the second mounts, so we never have two listeners.
- Page Visibility API: when `document.hidden`, the rAF loop pauses (browsers already throttle rAF to 0Hz on hidden tabs, but we should also explicitly skip work to avoid CPU on resume).

**Coexistence with `useSpecularHighlight`:** The repo already has `next/src/hooks/use-specular-highlight.ts` (used by `GlassInteraction.tsx`) writing per-element `--mouse-x`/`--mouse-y` for cursor-tracking specular highlights on individual glass cards. This is **per-element** and uses `mousemove` on the card itself (event-delegated, scoped). The new global blob renderer uses `--blob-x`/`--blob-y` on `:root`. **Different namespaces, both can run** — the per-element hook is opt-in (only fires when cursor is over that card), the blob renderer is always-on. Both should coexist for v9.0; consider consolidating in a future milestone.

---

## 3. State boundary — CSS vars only, optional `useBlobAware()` for measurement

**Hard rule:** Blob position, heat, and velocity are **not** React state. Storing them in `useState` would re-render every consumer 60×/s, which is exactly what the ТЗ §16 forbids ("нельзя обновлять React state на каждый pointermove").

**The boundary:**

| Concern | Where it lives | Why |
|---|---|---|
| `--blob-x`, `--blob-y` (current core position, px in viewport) | `:root` CSS var | 60Hz updates, GPU repaint only |
| `--blob-body-x/y`, `--blob-halo-x/y` (sub-layer positions) | `:root` CSS var | Same — no React subscribe |
| `--blob-heat` (0..1, idle accumulation) | `:root` CSS var | Read by `radial-gradient`, opacity, filter |
| `--blob-velocity` (px/ms or normalized 0..1) | `:root` CSS var | Read by stretch/blur modulation |
| `--blob-mode` (`cursor` / `ambient` / `static`) | `:root` CSS var **+** `<html data-blob-mode="…">` | CSS can't branch on a string-typed custom property without `@property + style()` queries. Mirror as `data-*` attribute for selectors; keep as CSS var for debugging |
| Whether dark mode is active | `[data-theme="dark"]` attribute (existing) | Already in repo |
| `prefers-reduced-motion` / `prefers-reduced-transparency` | `@media` queries in CSS | No JS branch needed for most rules |

**`useBlobAware()` — only when truly needed:**

This optional hook exists for the rare case where a single component needs **per-element reactive distance** to the blob (e.g. one premium card whose 3D tilt magnitude depends on how close the blob is). Plan:

```text
useBlobAware(ref) -> { distancePx, isUnderBlob }
  - subscribes to a single shared "blob bus" that emits at most every Nth rAF tick (throttled to ~30Hz)
  - reads element's bounding rect (cached, refreshed on resize)
  - computes distance from blob position to element center
  - returns React state — accepts the re-render cost intentionally
```

**Use sparingly.** Default path is "consume CSS vars from CSS only." `useBlobAware` is for one-off premium effects, max ~3 components on the whole site.

---

## 4. Component refactor map

Every glass surface in the repo currently uses `bg-white/40` to `bg-white/75` (milky), which **violates** the v9.0 ТЗ §9 ceiling of `rgba(255,255,255,0.16)`. Each component below must be re-tiered.

**Tier system (proposed CSS classes — see §5 for tokens):**

- **Tier 0 — Section frame** (`--glass-section-fill`, target `rgba(255,255,255,0.04..0.08)`, blur 24..40px desktop / 12px mobile)
- **Tier 1 — Card** (`--glass-card-fill`, target `rgba(255,255,255,0.08..0.12)`, blur 16..24px desktop / 12px mobile)
- **Tier 2 — Form / input field** (`--glass-form-fill`, target `rgba(255,255,255,0.12..0.16)`, sharper border)
- **Tier 3 — Button / control / nav** (`--glass-button-fill`, target `rgba(255,255,255,0.10..0.14)` + brighter inner highlight, sharpest)

**Per-component refactor table:**

| Component (modified file) | Current opacity | Current blur | Target tier | Notes |
|---|---|---|---|---|
| `next/src/components/layout/HeaderClient.tsx` | `bg-white/30` → `bg-white/50` (scrolled) | `40px` → `60px` | Tier 3 (chrome) | Reduce to `bg-white/14` rest, `bg-white/22` scrolled. Cap blur at 24px. Keep `shadow-glass-header`. |
| `next/src/components/layout/MobileMenu.tsx` (toggle button) | `bg-white/55` | `xl` (~24px) | Tier 3 | Reduce to `bg-white/16`, blur 20px. |
| `next/src/components/layout/MobileMenu.tsx` (dropdown panel) | `bg-white/68` | `80px` | Tier 0 | Reduce to `bg-white/14`, blur 24px (mobile budget cap 12px applies on small screens — needs media-query override). |
| `next/src/components/layout/StickyBar.tsx` | `bg-white/68` | `3xl` (~64px) | Tier 0 | Reduce to `bg-white/14`, blur ≤12px (mobile-only component). Keep `shadow-glass-lg`. |
| `next/src/components/sections/HeroHub.tsx` (frame card) | `bg-white/75` | `40px` | Tier 0 + accent | Reduce to `bg-white/16`. The "hero frame" is the densest legitimate glass on the page — give it the highest tier-0 ceiling. Keep `shadow-glass`. |
| `HeroHub.tsx` (control buttons row, `bg-white/15`) | `bg-white/15` | n/a | Tier 3 | Already in range; just verify against tokens. |
| `HeroHub.tsx` (badge `bg-white/40`) | `bg-white/40` | `20px` | Tier 3 | Reduce to `bg-white/14`. |
| `next/src/components/sections/StatsBar.tsx` (mobile wrapper) | `bg-white/60` | `2xl` (~40px) | Tier 0 | Reduce to `bg-white/08`, blur 24px desktop / 12px mobile. |
| `StatsBar.tsx` (desktop cards) | `bg-white/60` → `bg-white/70` (hover) | `2xl` | Tier 1 | Reduce to `bg-white/10` rest, `bg-white/14` hover, blur 20px. |
| `next/src/components/sections/ServicesGrid.tsx` (cards) | `bg-white/60` → `bg-white/70` (hover) | `2xl` | Tier 1 | Reduce to `bg-white/10` / `bg-white/14`. Keep `hover:-translate-y-0.5`. |
| `ServicesGrid.tsx` (badge inside card) | `bg-white/50` | `md` | Tier 3 | Reduce to `bg-white/14`. |
| `next/src/components/sections/ProcessSection.tsx` (steps) | check & port | check & port | Tier 1 | Same treatment as ServicesGrid cards. |
| `next/src/components/sections/FinalCTA.tsx` / `ContactSection.tsx` | check & port | check & port | Tier 0 | Section frame, low opacity, accept gradient CTA inside as opaque (CTA stays solid by ТЗ §13). |
| `next/src/components/sections/FAQSection.tsx` (accordion) | check & port | check & port | Tier 1 (closed) → Tier 2 (open) | Closed items low opacity; open item slightly denser for readability. |
| `next/src/components/sections/ContactForm.tsx` / `service/LeadFormSection.tsx` | check & port | check & port | Tier 2 (form), Tier 1 (frame) | Form fields keep `.squircle-sm`. Inputs use `--glass-form-fill` (~0.14) with a stronger inset highlight for legibility. |
| `next/src/components/layout/Footer.tsx` | check & port | check & port | Tier 0 | Reduce to `bg-white/06`. |
| `next/src/components/sections/{WhyUsSection,ClinicsSection,PlatformSection,ReviewsSection,ProblemSection,AdvantagesGrid,GuideGrid}.tsx` | various `bg-white/40..70` | `xl..3xl` | Tier 0 / Tier 1 (per cards) | Sweep in Phase 3 of build order. |
| `next/src/components/sections/checkup/*.tsx` (8 files) | various | various | Per-tier | `/checkup` route — sweep in same phase. |
| `next/src/components/sections/consultations/*.tsx` (8 files) | various | various | Per-tier | `/consultations` route. |
| `next/src/components/sections/treatment/*.tsx` (4 files) | various | various | Per-tier | `/treatment-abroad` route. |
| `next/src/components/sections/contacts/*.tsx` (2 files) | various | various | Per-tier | `/contacts` route. |
| `next/src/components/sections/service/{ServiceHero,FAQ,SocialProof}.tsx` | various | various | Per-tier | Shared service sub-pages. |
| `next/src/components/ui/{card,dialog,input,select,textarea,button,badge}.tsx` | various | various | Per-tier | shadcn primitives — touch carefully, they are reused everywhere. |
| `next/src/components/sections/HeroHub.tsx` (CTA button gradient) | gradient (opaque) | n/a | **stays opaque** | ТЗ §13: CTA must not disappear into glass. Keep `bg-gradient-to-r from-mu-blue to-mu-accent-blue`. |
| `next/src/components/layout/Header.tsx` (CTA "Обсудить случай") | gradient (opaque) | n/a | **stays opaque** | Same — CTA exception. |

**What stays unchanged on every component:**
- `.squircle-md` / `.squircle-lg` / `.squircle-xl` utilities (shape system is independent of glass tier).
- `shadow-glass*` shadow tokens (define depth — adjust values per tier in `liquid-glass.css`, don't remove shadows).
- `border border-glass-border` thin highlights (the bright edge is what makes glass *read* as glass at low opacity — keep it).
- All copy, all layout (grid, flex, gap), all responsive breakpoints, all `prefers-reduced-*` guards.

**What's removed:**
- `MeshBackground` rendered in `layout.tsx` line 9 — replace with `<LivingBlobField />` (see §8).
- `bg-mu-text-50` body background in `layout.tsx` line 50 — likely keep as fallback but the blob renderer's own gradient base-layer takes over visually.

---

## 5. CSS variable contract

**Blob runtime vars (set by renderer, read by everything else):**

| Var | Type / unit | Range | Set by | Read by |
|---|---|---|---|---|
| `--blob-x` | px (viewport) | `0..100vw` | rAF loop, every frame | `radial-gradient at`, `translate3d` of core layer |
| `--blob-y` | px (viewport) | `0..100vh` | rAF loop, every frame | same as above |
| `--blob-body-x` | px | viewport | rAF loop | `translate3d` of body layer |
| `--blob-body-y` | px | viewport | rAF loop | `translate3d` of body layer |
| `--blob-halo-x` | px | viewport | rAF loop | `translate3d` of halo layer |
| `--blob-halo-y` | px | viewport | rAF loop | `translate3d` of halo layer |
| `--blob-heat` | unitless number | `0..1` | rAF loop (idle accumulation) | core opacity, glint opacity, glass tint depth |
| `--blob-velocity` | unitless number | `0..1` (normalized) | rAF loop | body stretch (`scaleX`), halo lag, glint kill |
| `--blob-mode` | string | `cursor` \| `ambient` \| `static` | once per mode change | dev-mode debugging only — for behavior, use `<html data-blob-mode="…">` + attribute selectors |

**Glass tier tokens (proposed, define in `next/src/styles/liquid-glass.css`):**

| Token | Default | Mobile (≤768px) | Use |
|---|---|---|---|
| `--glass-section-fill` | `rgba(255, 255, 255, 0.06)` | `rgba(255, 255, 255, 0.10)` | Section frames (Tier 0). Slightly denser on mobile because there's no blur boost from cursor proximity. |
| `--glass-card-fill` | `rgba(255, 255, 255, 0.10)` | `rgba(255, 255, 255, 0.14)` | Cards, panels (Tier 1). |
| `--glass-form-fill` | `rgba(255, 255, 255, 0.14)` | `rgba(255, 255, 255, 0.18)` | Form fields, inputs (Tier 2). |
| `--glass-button-fill` | `rgba(255, 255, 255, 0.12)` | `rgba(255, 255, 255, 0.16)` | Nav, controls, secondary buttons (Tier 3). Primary CTAs stay opaque. |
| `--glass-section-blur` | `28px` | `12px` | mobile cap enforced. |
| `--glass-card-blur` | `20px` | `12px` | mobile cap enforced. |
| `--glass-form-blur` | `16px` | `10px` | |
| `--glass-button-blur` | `18px` | `12px` | |
| `--glass-edge-light` | `inset 0 1px 0 rgba(255, 255, 255, 0.65)` | unchanged | top inner highlight, the "glass" tell |
| `--glass-edge-bottom` | `inset 0 -1px 0 rgba(200, 210, 225, 0.18)` | unchanged | bottom darken |

**Existing tokens to retain unchanged:** `--liquid-blur-sm/md/lg/xl`, `--liquid-saturate`, `--liquid-brightness`, all `--mu-*` color tokens, all `--squircle-mask-*` tokens, all `shadow-glass*` tokens. The existing `--liquid-bg: rgba(255,255,255,0.42)` is **decommissioned** — replace its usages with the per-tier tokens above.

**Where to define:** the new `--glass-*-fill/blur` tokens and `--blob-*` seed values go in `next/src/app/globals.css` `:root { ... }` (the existing single source of truth). The `liquid-glass.css` utility classes are updated to consume the new tokens.

---

## 6. Build order

**Recommended order: Renderer first → glass redesign in tiers → polish & a11y last.** Justification: you cannot visually verify a transparent glass surface unless something with light is moving behind it. Building glass first means working blind.

**Phase 1 — Renderer + tokens (unblocks everything else)**
- New file: `next/src/components/effects/LivingBlobField.tsx` — the renderer (client component, sub-layers, rAF loop, mode detection).
- New file: `next/src/styles/blob.css` — keyframes for ambient mode, sub-layer base styles, `prefers-reduced-motion` and `prefers-reduced-transparency` handling.
- Modified: `next/src/app/layout.tsx` — replace `<MeshBackground />` with `<LivingBlobField />`. Add seed inline `<style>` for initial CSS vars.
- Modified: `next/src/app/globals.css` — add `--blob-*` seed defaults and `--glass-*-fill/blur` tokens at `:root`.
- Modified: `next/src/styles/liquid-glass.css` — `.living-blob-field` rule (fixed, z-0, pointer-events: none, overflow: hidden), and re-point existing `.liquid-regular`/`.liquid-card`/etc. rules to consume new `--glass-*` tokens (still leaving them functional with old visuals if transitional).
- New file (optional, for §3): `next/src/hooks/use-blob-aware.ts`.
- Deleted (or reduced to a stub for back-compat): `next/src/components/layout/MeshBackground.tsx`. See §8.

**Output of Phase 1:** Blob is alive on every page. Existing components still look milky-white (unchanged), but you can already eyeball that the blob *is* moving behind them.

**Phase 2 — Sweep chrome (Header, MobileMenu, StickyBar)**
- Modified: `HeaderClient.tsx`, `MobileMenu.tsx`, `StickyBar.tsx`. Drop opacity to Tier 0/3 levels per §4.
- Verify: the chrome is the *most visible* glass on the page (always in viewport). Get this right before sweeping sections.
- Verify mobile cap (≤12px blur) holds.

**Phase 3 — Sweep index sections (`/`)**
- Modified: every component in `next/src/components/sections/*.tsx` (12 files at section root).
- Order within phase: HeroHub → StatsBar → ServicesGrid → ProcessSection → ContactForm/ContactSection → FAQSection → FinalCTA → others.
- Reason for that order: top-of-page first (highest user value to verify), then form (highest legibility risk).

**Phase 4 — Sweep service routes**
- Modified: `next/src/components/sections/checkup/*` (8), `consultations/*` (8), `treatment/*` (4), `contacts/*` (2), `service/*` (3).
- Tokens already defined; this is mechanical class swapping.

**Phase 5 — Sweep UI primitives**
- Modified: `next/src/components/ui/{card,dialog,input,select,textarea}.tsx`.
- High-impact, high-blast-radius — do last so rest of page is stable when something breaks.

**Phase 6 — A11y and performance hardening**
- Verify `prefers-reduced-motion` → blob freezes to static ambient gradient (no rAF, no listener).
- Verify `prefers-reduced-transparency` → all glass becomes opaque surfaces; blob layer reduces to a faint static tint.
- Verify `prefers-contrast: more` → glass borders bump to ≥0.85 alpha, text contrast bumps to AAA.
- Verify dark mode (`[data-theme="dark"]`) → backdrop-filter disabled, blob fades to ~30% (or hidden), surfaces become opaque dark.
- Performance UAT: Chrome perf trace on desktop (target 60fps), DevTools throttled CPU + mid-range Android profile (target no scroll jank).
- Visual UAT against ТЗ §18 ten checklist scenarios.

**Why not parallel:** the renderer and the glass sweep share token namespace (`--glass-*`, `--blob-*`). Touching tokens in both directions concurrently produces merge conflicts and drift. Sequential is cleaner. The glass sweep itself within Phase 3-5 is parallelizable across multiple agents per route.

---

## 7. Cross-page consistency

All 4 routes (`/`, `/treatment-abroad`, `/consultations`, `/checkup`, plus `/contacts` and `/admin`) inherit `<LivingBlobField />` automatically because they share `next/src/app/layout.tsx`. **Zero duplication.** No per-route mount needed.

The blob's behavior is identical on every route. Per-route theming (e.g. tinting the blob blue on `/consultations`) would be a future enhancement — not in v9.0 scope. If needed, it would route through a CSS var override on a route-level wrapper class (e.g. `body[data-route="consultations"] { --blob-core: var(--mu-accent-blue); }`).

Client-side route transitions in App Router preserve the layout subtree, so the blob continues animating uninterrupted between pages — no listener teardown, no rAF restart, no flash. This is a key reason to prefer App Router layout-mount over a Pages Router approach.

---

## 8. Removal of unused components and stale references

**Searched the repo (verified):** `LiquidBlobLayer.tsx` and `liquid-depth.css` **do not exist** in this codebase. The prompt mentioned them as "currently unused" but they are not present. Nothing to remove.

**What does exist and conflicts:**

- `next/src/components/layout/MeshBackground.tsx` (17 lines) — the **current** background: 3 static `rounded-full bg-mu-*/30` blurred circles + a `bg-white/40 backdrop-blur-[40px]` frosted overlay. This is the visual *replacement target*. Recommended: **delete** the file and remove its import from `layout.tsx` line 9 and usage on line 53. The blob renderer fully supersedes it.
- `next/src/components/layout/SvgRefractionDefs.tsx` (referenced in `layout.tsx` line 8/52) — defines SVG `<filter>` definitions for refraction effects. Inspect before deleting; if unused by any glass surface, remove. If referenced by `liquid-glass.css` or a section component, **keep** — it's reusable infra and may be useful for blob refraction overlays.
- `next/src/components/motion/GlassInteraction.tsx` + `next/src/hooks/use-specular-highlight.ts` — currently writes per-element `--mouse-x`/`--mouse-y` for cursor-tracking specular highlights on individual glass cards. **Keep** — this is a *complementary* effect (per-card highlight), independent of the global blob, and useful even after v9.0 ships. It can coexist with the blob field.
- `next/src/styles/liquid-glass.css` — 1037 lines of utility classes. **Modify in-place** — re-point internal var refs from `--liquid-bg` (the milky 0.42) to the new `--glass-*-fill` tokens. Do not delete.

---

## 9. Data flow diagram

```text
┌────────────────────────────────────────────────────────────────────┐
│  USER DEVICE                                                       │
│                                                                    │
│   pointer / touch                                                  │
│        │                                                           │
│        ▼                                                           │
│   window.addEventListener('pointermove', …)                        │
│        │  (one listener, attached in LivingBlobField useEffect)    │
│        ▼                                                           │
│   rawX, rawY  ──► velocity, idleMs                                 │
│                                                                    │
│                        rAF loop (one)                              │
│                            │                                       │
│                            ▼                                       │
│                  lerp(coreXY, bodyXY, haloXY)                      │
│                  heat = clamp(idleMs / 2500, 0, 1)                 │
│                            │                                       │
│                            ▼                                       │
│           document.documentElement.style.setProperty(              │
│             '--blob-x' | '--blob-body-x' | '--blob-halo-x' |       │
│             '--blob-y' | '--blob-body-y' | '--blob-halo-y' |       │
│             '--blob-heat' | '--blob-velocity'                      │
│           )                                                        │
│                            │                                       │
│  ──────────────────────────┴───────────────────────────────────    │
│   (CSS vars on :root — no React state, no re-render)               │
│                            │                                       │
│   ┌────────────────────────┼────────────────────────┐              │
│   ▼                        ▼                        ▼              │
│  .living-blob-field   .liquid-card,          Components reading    │
│  sub-layers            .liquid-regular,        var(--blob-*) via   │
│  (core/body/halo/      .liquid-nav, …          radial-gradient,    │
│   glint) read           in liquid-glass.css     filter, opacity    │
│  --blob-*-x/y for       — already attached     in their own CSS    │
│  translate3d           to glass surfaces       (no re-render)      │
│   │                     site-wide               │                  │
│   │                                             │                  │
│   ▼                                             ▼                  │
│  GPU compositor paints transformed sub-layers  GPU repaints        │
│  + repaints glass surfaces with new gradient   affected layers     │
│  positions / heat-modulated opacity            only                │
│                                                                    │
│  Result: 60fps, no React renders, single source of truth on :root  │
└────────────────────────────────────────────────────────────────────┘
```

**Mobile branch (`pointer: coarse` or `(max-width: 768px)`):**
- No pointermove listener attached. rAF loop runs `--blob-mode = ambient`: blob position follows a slow, scripted Lissajous-style path (or pure CSS `@keyframes` with no JS at all).
- On `tap`: a one-shot CSS animation triggers a soft pulse (`@keyframes blob-pulse` on `:root`, removed after duration).
- Scroll performance is preserved because there's no per-frame JS competing with scroll.

**`prefers-reduced-motion: reduce` branch:**
- No listener, no rAF. CSS sets `--blob-x: 50vw; --blob-y: 38vh; --blob-heat: 0.4; --blob-velocity: 0;` once and forgets. Glass surfaces still light up; just no movement.

---

## 10. New vs modified files (Roadmapper checklist)

**New files:**

| Path | Type | Purpose |
|---|---|---|
| `next/src/components/effects/LivingBlobField.tsx` | client component | Renderer: sub-layers, listener, rAF loop |
| `next/src/styles/blob.css` | stylesheet | `.living-blob-field`, sub-layer styles, ambient keyframes, reduced-motion guards |
| `next/src/hooks/use-blob-aware.ts` | hook (optional) | Per-element distance subscription for premium effects |

**Modified files:**

| Path | Change |
|---|---|
| `next/src/app/layout.tsx` | Remove `MeshBackground` import + render; add `LivingBlobField` import + render; seed `--blob-*` defaults via inline `<style>` on `:root` |
| `next/src/app/globals.css` | Add `--blob-*` seed defaults; add `--glass-section-fill`, `--glass-card-fill`, `--glass-form-fill`, `--glass-button-fill`, matching blur tokens; deprecate (or repurpose) `--liquid-bg` |
| `next/src/styles/liquid-glass.css` | Re-point `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.liquid-btn-secondary`, `.liquid-header-backdrop` to consume new `--glass-*` tokens; add `radial-gradient` heat-leak rules driven by `--blob-x/y/heat`; tighten mobile blur cap |
| `next/src/components/layout/Header.tsx` | (no change — only chrome inside `HeaderClient` changes) |
| `next/src/components/layout/HeaderClient.tsx` | Reduce opacity, blur per Tier 3 |
| `next/src/components/layout/MobileMenu.tsx` | Reduce opacity (toggle + dropdown) |
| `next/src/components/layout/StickyBar.tsx` | Reduce opacity, cap blur 12px |
| `next/src/components/layout/Footer.tsx` | Reduce opacity to Tier 0 |
| `next/src/components/sections/HeroHub.tsx` | Reduce frame, badge, and pill opacities |
| `next/src/components/sections/StatsBar.tsx` | Reduce wrapper + card opacities |
| `next/src/components/sections/ServicesGrid.tsx` | Reduce card + badge opacities |
| `next/src/components/sections/ProcessSection.tsx` | Reduce step opacities |
| `next/src/components/sections/{ProblemSection,WhyUsSection,ClinicsSection,PlatformSection,ReviewsSection,FAQSection,ContactSection,ContactForm,FinalCTA,AdvantagesGrid,GuideGrid}.tsx` | Per-tier opacity sweep |
| `next/src/components/sections/checkup/*.tsx` (8) | Per-tier sweep |
| `next/src/components/sections/consultations/*.tsx` (8) | Per-tier sweep |
| `next/src/components/sections/treatment/*.tsx` (4) | Per-tier sweep |
| `next/src/components/sections/contacts/*.tsx` (2) | Per-tier sweep |
| `next/src/components/sections/service/{ServiceHero,FAQ,SocialProof,LeadFormSection}.tsx` | Per-tier sweep |
| `next/src/components/ui/{card,dialog,input,select,textarea}.tsx` | Per-tier sweep at primitive level |

**Deleted files:**

| Path | Reason |
|---|---|
| `next/src/components/layout/MeshBackground.tsx` | Replaced by `LivingBlobField` |

**Files NOT touched (keep as-is):**

- `next/src/components/layout/SvgRefractionDefs.tsx` (reusable infra; verify usage before removing)
- `next/src/components/motion/GlassInteraction.tsx` + `use-specular-highlight.ts` (per-element specular, complementary)
- `next/src/components/motion/{HeroEntrance,LazyMotionProvider,ScrollReveal}.tsx` (entrance animations, unrelated)
- `next/src/styles/squircles.css` (shape system, unrelated)
- All `next/src/lib/*` and `next/src/app/api/*`

---

## 11. Patterns to follow

### Pattern 1: Read CSS vars from CSS, never from JS

**What:** Every consumer of blob state reads `var(--blob-x)`, `var(--blob-heat)`, etc. directly in CSS — in `radial-gradient`, `translate3d`, `opacity`, `filter`. No React hook subscribes.

**When:** Default for all 45+ glass surfaces.

**Example:**
```css
.liquid-card {
  background-color: var(--glass-card-fill);
  backdrop-filter: blur(var(--glass-card-blur));
  background-image: radial-gradient(
    480px circle at var(--blob-x) var(--blob-y),
    rgba(53, 182, 120, calc(0.05 + 0.12 * var(--blob-heat))),
    transparent 55%
  );
}
```

### Pattern 2: Sub-layer transforms via `translate3d(var(--blob-*-x), var(--blob-*-y), 0)`

**What:** Each blob sub-layer (core, body, halo, glint) is a `<div>` inside `.living-blob-field` with its own `--blob-*-x/y` consumed via `transform: translate3d(...) translate(-50%, -50%)`.

**When:** Inside `LivingBlobField.tsx`'s rendered DOM only.

### Pattern 3: Mode switching via `data-blob-mode`

**What:** Renderer sets `document.documentElement.dataset.blobMode = 'cursor' | 'ambient' | 'static'`. CSS branches via attribute selector.

**Why not via CSS var:** CSS can't branch on string-typed custom properties without `@property` + `style()` queries (limited browser support).

---

## 12. Anti-patterns to avoid

### Anti-pattern 1: `useState` for blob position

**Why bad:** 60Hz `setState` triggers 60Hz React renders across the entire subtree. Kills perf, contradicts ТЗ §16 explicitly.
**Instead:** Write to `:root` style via `setProperty`. CSS does the rest.

### Anti-pattern 2: Per-page mount of `LivingBlobField`

**Why bad:** Re-creates listener and rAF on every route transition. Blob "blinks" between pages.
**Instead:** Mount in `app/layout.tsx` once. App Router preserves the subtree.

### Anti-pattern 3: Stacking glass-on-glass

**Why bad:** ТЗ + DESIGN.md hard rule: ≤2 glass elements per viewport. Stacked glass kills GPU on budget Android.
**Instead:** When a "card inside section" pattern appears, only the card is glass; the section is transparent (fill: 0 or near-0).

### Anti-pattern 4: Borders on glass

**Why bad:** DESIGN.md anti-pattern — `border` clips against `mask-image` squircles.
**Instead:** `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5)`.

### Anti-pattern 5: Forgetting `pointer-events: none` on `.living-blob-field`

**Why bad:** Renderer swallows clicks; CTAs become unclickable.
**Instead:** Set `pointer-events: none` on the field and every sub-layer. Listener is on `window`, not on the field.

### Anti-pattern 6: Heavy `filter: blur()` on the blob layer itself

**Why bad:** Stacking large blur on a fixed full-viewport element triggers full-screen recomposite per frame. ≥40fps drop common.
**Instead:** Use `radial-gradient` + soft alpha edges to fake the haze; reserve `backdrop-filter` for glass surfaces (which are smaller).

---

## 13. Scalability considerations

| Concern | Behaviour at desktop / 60fps target | Behaviour at low-end mobile / scroll target | Behaviour with 3+ glass surfaces in viewport |
|---|---|---|---|
| Listener count | 1 (window) | 0 (ambient mode skips listener) | unaffected |
| rAF loop count | 1 | 1 (ambient) or 0 (reduced motion) | unaffected |
| GPU layers | ~6 (4 sub-layers + chrome + body) | same, but with smaller blur radii | each glass surface is ~1 extra compositing layer |
| Per-frame writes to `:root` | 8 CSS vars × 60Hz = 480 var writes/s | 4 vars × 30Hz throttled | unaffected |
| Repaint cost | bounded to surfaces that read `--blob-*` (most glass surfaces) | bounded; smaller blur, less paint area | linear in glass count → enforce ≤2 per viewport rule |
| React renders triggered | 0 | 0 | 0 |

**Scaling triggers:**
- If blob proves expensive on >5 glass surfaces in viewport, the ≤2 budget rule (already in DESIGN.md) absorbs this.
- If `pointermove` event rate is too high (some trackpads emit at 250Hz), throttle internally inside the handler — store last sample only; rAF loop reads at 60Hz max.

---

## 14. Sources and verification

- **`design/LIQUID_GLASS_BLOB_TZ.md`** (read in full, 416 lines) — the v9.0 specification. All numerical opacity targets (0.04..0.16), heat timing (1.5–3s), sub-layer hierarchy (core/body/halo/glint), accessibility opt-outs, and performance constraints (single pointermove + rAF, transform/opacity only, ≤12px mobile blur) trace to this document. Confidence: HIGH.
- **`.planning/PROJECT.md`** — confirms v9.0 milestone is active, target features match ТЗ. Confidence: HIGH.
- **`DESIGN.md`** — confirms hard constraints: ≤2 glass per viewport, mobile blur ≤12px, `prefers-reduced-*` mandatory, dark mode disables `backdrop-filter`. Confidence: HIGH.
- **`CLAUDE.md`** — repo conventions: GSD workflow gating, brand color parity, design-contract two-rules. Confidence: HIGH.
- **Inspected actual repo state:**
  - `next/src/app/layout.tsx` (62 lines) — confirmed all routes share this layout; current children include `SvgRefractionDefs`, `MeshBackground`, `Header`, `LazyMotionProvider > main`, `Footer`, `StickyBar`.
  - `next/src/app/page.tsx` (68 lines) — confirmed top page composition.
  - `next/src/app/{checkup,consultations,treatment-abroad}/page.tsx` exist as separate route folders, all inherit root layout.
  - `next/src/components/layout/MeshBackground.tsx` (17 lines) — confirmed it's the static-blobs background being replaced.
  - `next/src/components/layout/HeaderClient.tsx` — confirmed current opacity/blur values.
  - `next/src/components/layout/{StickyBar,MobileMenu}.tsx` — confirmed current opacity values.
  - `next/src/components/sections/{HeroHub,StatsBar,ServicesGrid}.tsx` — confirmed current opacity values.
  - `next/src/components/motion/GlassInteraction.tsx` + `next/src/hooks/use-specular-highlight.ts` — confirmed existing per-element cursor-track infra (reusable, complementary, not the same as global blob).
  - `next/src/styles/liquid-glass.css` (1037 lines) — confirmed existing utilities (`.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.liquid-btn-{primary,secondary}`, `.liquid-header-backdrop`, `.glass-idle`) and current token state (`--liquid-bg: rgba(255,255,255,0.42)` — currently milky, must be replaced).
  - `next/src/app/globals.css` (689 lines) — confirmed `--liquid-blur-{sm,md,lg,xl}` already exists, brand color tokens already exist.
  - **Verified via filesystem search**: `LiquidBlobLayer.tsx` and `liquid-depth.css` **do not exist** in the repo. The prompt's mention of them was inaccurate.

Confidence: HIGH on all architectural claims. The single LOW-confidence point is the exact lerp factors (0.18 / 0.08 / 0.04) and heat timing constant (2500ms) — these are visual-tuning numbers, not architecture; they will be tuned in-browser per ТЗ §17 ("конкретные значения должны подбираться визуально на реальной странице").
