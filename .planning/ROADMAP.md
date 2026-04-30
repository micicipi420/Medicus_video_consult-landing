# Roadmap: MedicusUnion KZ

## Milestones

- v1.0 MedicusUnion KZ Landing -- Phases 1-10 (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- Phases 11-14 (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- Phases 15-16 (shipped 2026-03-23)
- v1.3 KZ Design Alignment -- Phases 17-19 (shipped 2026-03-23)
- v1.4 2025 Visual Redesign -- Phases 20-23 (shipped 2026-03-24)
- v2.0 Service Pages Copywriting Rewrite -- Phases 26-28 (shipped 2026-04-05)
- v3.0 SEO, Performance & Polish -- Phases 29-32 (shipped 2026-04-06)
- v3.1 Site Foundation & Audit Fixes -- Phases 33-38 + 38.1 (shipped 2026-04-08)
- v3.2 Build Pipeline & Chrome Partials -- Phases 39-40 (shipped 2026-04-08)
- v4.0 Liquid Design System -- Phases 41-49 (shipped 2026-04-09)
- v5.0 Full Liquid Glass Rework -- Phases 51-58 (shipped 2026-04-10)
- v6.0 Next.js Stack Migration -- Phases 59-67.1 (shipped 2026-04-11)
- v6.1 New Design Port -- Phases 68-72 (shipped 2026-04-12)
- v7.0 UI/UX Design Excellence -- Phases 73-78 (shipped 2026-04-14)
- v8.0 Index Page Redesign -- Phases 79-85 (shipped 2026-04-30)
- v8.1 Propagation & Loose Ends -- Phases 86-89 (shipped 2026-04-30)
- v9.0 Living Blob Liquid Glass Scene -- Phases 90-94 (in progress)

## Phases

### v9.0 Living Blob Liquid Glass Scene (In Progress)

Source TZ: `design/LIQUID_GLASS_BLOB_TZ.md` (20 sections, 12 acceptance criteria). Synthesized: `.planning/research/SUMMARY.md`. **Phase ordering is non-negotiable: Foundation → Engine → Glass is sequential because glass transparency cannot be verified without a live blob.**

- [ ] **Phase 90: Foundation — Tokens, A11y Wiring, DOM Skeleton** — Register `--blob-*` palette + 4-tier `--glass-*` tokens in DESIGN.md YAML and `globals.css`; single-source `@layer` a11y block in `liquid-glass.css`; mount `<div class="living-blob-field">` skeleton in `layout.tsx`; remove `MeshBackground.tsx`; document z-index contract + CTA opaque-forever rule + v9.0 anti-patterns; log `--blob-hot: #4FE098` Key Decision. **No visible change** — page renders identically to v8.1.
- [ ] **Phase 91: Blob Engine — Renderer, Physics, A11y Branches** — `LivingBlobField.tsx` with Canvas 2D renderer (4 sublayers: core/body/halo/glint), single `pointermove` listener + single rAF loop, lerp-driven viscous follow, heat accumulator (1.5–3s dwell ramp, ≥600ms decay), velocity-driven shape stretch, mode branches (mobile ambient Lissajous / `prefers-reduced-motion` static / `prefers-reduced-transparency` hidden / dark theme dimmed), Page Visibility pause, dev-only `__blobDebug.rafCount`, singleton-guard against React Strict Mode + App Router leaks.
- [ ] **Phase 92: Glass Rework — Chrome + Index Sections** — Opacity sweep on `/` route components (HeroHub, StatsBar, ServicesGrid, ProcessSection, ProblemSection, WhyUsSection, ClinicsSection, PlatformSection, ReviewsSection, FAQSection, ContactForm, ContactSection, FinalCTA, Footer) + always-visible chrome (HeaderClient, MobileMenu, StickyBar). Repoint `liquid-glass.css` utilities to new tier tokens; add heat-leak `radial-gradient` rules. Form-safety floor (≥0.16 → 0.30 if WCAG AA fails) + opaque CTA enforced. Mobile blur ≤12px preserved.
- [ ] **Phase 93: Per-Page Propagation — Sub-Routes** — Apply validated tier patterns to `/checkup` (8 files), `/consultations` (8 files), `/treatment-abroad` (4 files), `/contacts` (2 files); service primitives (`ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection` — same form-safety as `ContactForm`); shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea`) updated last (highest blast-radius). Per-route Playwright screenshot diff vs pre-v9.0 baseline.
- [ ] **Phase 94: Verification — UAT, Performance, A11y, Brand Review** — Playwright UAT (10 TZ §18 scenarios), a11y emulation (3 MQ prefs), leak test (`rafCount === 1` after 5 nav), Lighthouse CI gate (LCP ≤2500 / INP ≤200 / CLS ≤0.1 / TBT ≤200, mobile throttled), axe-core / Pa11y across 4 routes × 3 blob positions, real-device manual UAT (HARD GATE — iOS 16/17 Safari + low-end Android 4GB + desktop Chrome/Firefox/Safari, NO cheat-pass), brand visual review vs medicusunion.com, all 12 TZ §19 acceptance criteria signed off.

### v8.1 Propagation & Loose Ends (Shipped 2026-04-30)

<details>
<summary>v8.1 detail</summary>

- [x] **Phase 86: Service Pages v8.0 Propagation** - Apply Phase 80–84 design language to `/checkup`, `/consultations`, `/treatment-abroad`
- [x] **Phase 87: Real Content** - Replace HeroHub placeholder; restore coordinator presence on ContactSection
- [x] **Phase 88: Code Hygiene** - Fix lint warnings; decide `LiquidBlobLayer.tsx` + `liquid-depth.css` fate; resolve research stash
- [x] **Phase 89: Milestone Closeout** - Stash@{0} triage; live a11y UAT; archive v8.0 phase directories

</details>

<details>
<summary>v8.0 Index Page Redesign (Phases 79-85) -- SHIPPED 2026-04-30</summary>

- [x] Phase 79: Visual Foundation (Typography & Mobile Budget) (1/1 plan) -- completed 2026-04-29
- [x] Phase 80: Glass Header Chrome (1/1 plan) -- completed 2026-04-30
- [x] Phase 81: Hero Video-Call Frame (1/1 plan) -- completed 2026-04-30
- [x] Phase 82: Stats Bar (1/1 plan) -- completed 2026-04-30
- [x] Phase 83: Services & Process Sections (1/1 plan) -- completed 2026-04-30
- [x] Phase 84: CTA Form on Blue Gradient (1/1 plan) -- completed 2026-04-30
- [x] Phase 85: Glass Hardening & Accessibility Verification (1/1 plan) -- completed 2026-04-30 (status: human_needed for live UAT — tracked in Phase 89)

</details>

<details>
<summary>v7.0 UI/UX Design Excellence (Phases 73-78) -- SHIPPED 2026-04-14</summary>

- [x] Phase 73: Token Foundation (2/2 plans) -- completed 2026-04-13
- [x] Phase 74: Accessibility Hardening (2/2 plans) -- completed 2026-04-13
- [x] Phase 74.1: Integration Cleanup & Verification (2/2 plans) -- completed 2026-04-14
- [x] Phase 75: Mobile Performance Budget (2/2 plans) -- completed 2026-04-14
- [x] Phase 76: Interaction Polish (2/2 plans) -- completed 2026-04-14
- [x] Phase 77: Progressive Enhancement (1/1 plan) -- completed 2026-04-14
- [x] Phase 78: Token Verification & Visual Regression (1/1 plan) -- completed 2026-04-14

</details>

<details>
<summary>v6.1 New Design Port (Phases 68-72) -- SHIPPED 2026-04-12</summary>

- [x] Phase 68: Design Tokens & Layout Chrome (3/3 plans) -- completed 2026-04-12
- [x] Phase 69: Hero & Above-the-Fold Sections (2/2 plans) -- completed 2026-04-12
- [x] Phase 70: Index Content Sections (3/3 plans) -- completed 2026-04-12
- [x] Phase 71: Index Interactive Sections (2/2 plans) -- completed 2026-04-12
- [x] Phase 72: Service Pages (4/4 plans) -- completed 2026-04-12

</details>

<details>
<summary>v6.0 Next.js Stack Migration (Phases 59-67.1) -- SHIPPED 2026-04-11</summary>

- [x] Phase 59: Next.js Scaffold & CSS Foundation (2/2 plans) -- completed 2026-04-10
- [x] Phase 60: Component Library & Layout Shell (2/2 plans) -- completed 2026-04-11
- [x] Phase 61: Index Page Migration (2/2 plans) -- completed 2026-04-11
- [x] Phase 62: Contacts Page & SEO (1/1 plan) -- completed 2026-04-11
- [x] Phase 63: Scroll & Entrance Animations (1/1 plan) -- completed 2026-04-11
- [x] Phase 64: Interactive Glass Animations (1/1 plan) -- completed 2026-04-11
- [x] Phase 65: Database & Form Submission (1/1 plan) -- completed 2026-04-11
- [x] Phase 66: Admin Panel (1/1 plan) -- completed 2026-04-11
- [x] Phase 67: Docker Deployment (1/1 plan) -- completed 2026-04-11
- [x] Phase 67.1: Visual Parity Rework (6/6 plans) -- completed 2026-04-11

Full details: `.planning/milestones/v6.0-ROADMAP.md`

</details>

<details>
<summary>v5.0 Full Liquid Glass Rework (Phases 51-58) -- SHIPPED 2026-04-10</summary>

- [x] Phase 51: Cross-Browser Hardening (2/2 plans) -- completed 2026-04-10
- [x] Phase 52: Token Foundation & Dead Code Cleanup (2/2 plans) -- completed 2026-04-10
- [x] Phase 53: SVG Refraction Tuning (1/1 plan) -- completed 2026-04-10
- [x] Phase 54: Adaptive Tinting (1/1 plan) -- completed 2026-04-10
- [x] Phase 55: Glass Material Variants & Hierarchy (1/1 plan) -- completed 2026-04-10
- [x] Phase 56: Specular Physics & Interaction States (1/1 plan) -- completed 2026-04-10
- [x] Phase 57: GPU Performance Audit (2/2 plans) -- completed 2026-04-10
- [x] Phase 58: Design System Docs & Print (1/1 plan) -- completed 2026-04-10

Full details: `.planning/milestones/v5.0-ROADMAP.md`

</details>

<details>
<summary>v4.0 Liquid Design System (Phases 41-49) -- SHIPPED 2026-04-09</summary>

- [x] Phase 41: Foundation Tokens (2/2 plans) -- completed 2026-04-09
- [x] Phase 42: Squircle Primitives (1/1 plan) -- completed 2026-04-09
- [x] Phase 43: Liquid Glass Primitives (2/2 plans) -- completed 2026-04-09
- [x] Phase 44: Chrome Partials Upgrade (2/2 plans) -- completed 2026-04-09
- [x] Phase 45: Simple Pages (2/2 plans) -- completed 2026-04-09
- [x] Phase 46: Service Pages (0/TBD) -- completed 2026-04-09
- [x] Phase 47: Index Page (2/2 plans) -- completed 2026-04-09
- [x] Phase 48: Verification (2/2 plans) -- completed 2026-04-09
- [x] Phase 49: Documentation (2/2 plans) -- completed 2026-04-09

Full details: `.planning/milestones/v4.0-ROADMAP.md`

</details>

<details>
<summary>v3.2 Build Pipeline & Chrome Partials (Phases 39-40) -- SHIPPED 2026-04-08</summary>

- [x] Phase 39: Partials Extraction & Build Pipeline (3/3 plans) -- completed 2026-04-08
- [x] Phase 40: UX Cosmetic Cleanup (3/3 plans) -- completed 2026-04-08

Full details: `.planning/milestones/v3.2-ROADMAP.md`
Requirements: `.planning/milestones/v3.2-REQUIREMENTS.md`

</details>

<details>
<summary>v3.1 Site Foundation & Audit Fixes (Phases 33-38 + 38.1) -- SHIPPED 2026-04-08</summary>

- [x] Phase 33: Audit Quick Wins (1/1 plan) -- completed 2026-04-07
- [x] Phase 34: Treatment Abroad Overhaul (1/1 plan) -- completed 2026-04-07
- [x] Phase 35: Checkup Fix + Form UX Polish -- completed 2026-04-07
- [x] Phase 36a: Shared Layout Primitives -- completed 2026-04-07
- [x] Phase 37: Site Metadata & Hygiene -- completed 2026-04-07
- [x] Phase 38: Vertical Rhythm & Section Sizing -- completed 2026-04-07
- [x] Phase 38.1: Mobile viewport overflow + checkup H1 fix (corrective) -- completed 2026-04-08

Full details: `.planning/milestones/v3.1-ROADMAP.md`
Requirements: `.planning/milestones/v3.1-REQUIREMENTS.md`
Audit: `.planning/milestones/v3.1-MILESTONE-AUDIT.md`

</details>

<details>
<summary>v3.0 SEO, Performance & Polish (Phases 29-32) -- SHIPPED 2026-04-06</summary>

- [x] Phase 29: 404 Page & UI Polish (2/2 plans) -- completed 2026-04-05
- [x] Phase 30: SEO Optimization (1/1 plan) -- completed 2026-04-05
- [x] Phase 31: Performance Optimization (2/2 plans) -- completed 2026-04-05
- [x] Phase 32: Design System Compliance (2/2 plans) -- completed 2026-04-06

Full details: `.planning/milestones/v3.0-ROADMAP.md`
Requirements: `.planning/milestones/v3.0-REQUIREMENTS.md`
Audit: `.planning/milestones/v3.0-MILESTONE-AUDIT.md`

</details>

<details>
<summary>Earlier milestones (v1.0-v2.0) -- SHIPPED</summary>

- v1.0 MedicusUnion KZ Landing -- 10 phases, 24 plans (shipped 2026-03-23)
- v1.1 Visual Polish & Conversion Boost -- 4 phases, 5 plans (shipped 2026-03-23)
- v1.2 Brand Visual Alignment -- 2 phases, 2 plans (shipped 2026-03-23)
- v1.3 KZ Design Alignment -- 3 phases, 3 plans (shipped 2026-03-23)
- v1.4 2025 Visual Redesign -- 4 phases, 6 plans (shipped 2026-03-24)
- v2.0 Service Pages Copywriting Rewrite -- 4 phases, 8 plans (shipped 2026-04-05)

See `.planning/milestones/` for full details per milestone.

</details>

## Phase Details

### Phase 90: Foundation — Tokens, A11y Wiring, DOM Skeleton
**Goal**: Establish the token system, a11y contract, and DOM skeleton every later v9.0 phase builds on. Page renders identically to v8.1 — zero visible change. Outcome unblocks Phase 91 (renderer needs runtime CSS vars and `--blob-*` palette to write into) and Phase 92 (glass tier tokens must exist for opacity sweep).
**Depends on**: Nothing (first v9.0 phase; v8.1 shipped 2026-04-30)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07
**Success Criteria** (what must be TRUE):
  1. `DESIGN.md` YAML registers all `--blob-*` palette tokens (`core: #35B678`, `hot: #4FE098`, `halo: rgba(98,221,177,0.5)`, `edge: rgba(125,205,255,0.18)`, `glint: rgba(255,255,255,0.65)`) and all 4 `--glass-{section,card,form,button}-{fill,blur}` tier tokens with desktop and mobile values; `globals.css` mirrors them; mobile `--glass-*-blur` values all ≤12px (Phase 79 cap honored).
  2. `liquid-glass.css` contains a single `@layer` block enumerating every glass class name (current + new) under `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast: more` — single source of truth for all a11y branches; verified to cover all classes via grep.
  3. `<div class="living-blob-field" aria-hidden="true">` skeleton mounted in `next/src/app/layout.tsx` with 4 static sublayer children; `:root` seeded server-side via inline `<style>` with `--blob-x: 50vw; --blob-y: 50vh; --blob-heat: 0`; `MeshBackground.tsx` deleted from repo and removed from layout.
  4. `DESIGN.md` documents the z-index contract (blob-field `z-0`, main `z-1..10`, header/sticky `z-50+`, modals `z-100+`), the CTA opaque-forever rule, and the v9.0 anti-patterns appendix (no trails/particles/`mix-blend-mode` on glass/animated `backdrop-filter`/green tint on cards/parallax).
  5. Key Decision logged in `PROJECT.md` for `--blob-hot: #4FE098` after a brand approval session vs `medicusunion.com`; index `/` renders identically to v8.1 baseline (visual diff = 0 outside the blob area).
**Plans**: 5 plans

Plans:
- [x] 90-01-PLAN.md — Token registration: --blob-* palette + 4-tier --glass-* tokens in DESIGN.md YAML and globals.css :root
- [x] 90-02-PLAN.md — A11y @a11y-layer-coverage block in liquid-glass.css; new blob.css with sublayer base styles
- [x] 90-03-PLAN.md — DESIGN.md doc edits: antiPatterns: YAML (15) + ## v9.0 Custom Rules (z-index + CTA opaque-forever) + ## v9.0 Anti-Patterns body
- [x] 90-04-PLAN.md — layout.tsx skeleton: inline <style> seed + .living-blob-field; hard-delete MeshBackground.tsx; 5-route smoke
- [x] 90-05-PLAN.md — KD-v9-001 row in PROJECT.md + /test-glass comparison swatch (--mu-primary / --blob-hot / medicusunion.kz ref)
**UI hint**: yes

### Phase 91: Blob Engine — Renderer, Physics, A11y Branches
**Goal**: Blob is alive. On desktop with motion, blob viscously follows the cursor across 4 sublayers and accumulates heat on dwell. On mobile and reduced-motion environments, alternative branches engage cleanly. Zero React renders per pointer move; no rAF/listener leaks across route navigation; `data-blob-mode` reflects current state.
**Depends on**: Phase 90 (blob palette tokens + DOM skeleton + a11y `@layer` block must exist before renderer can write to them or branch on them)
**Requirements**: BLOB-01, BLOB-02, BLOB-03, BLOB-04, BLOB-05, BLOB-06, BLOB-07, BLOB-08, BLOB-09, BLOB-10, BLOB-11, BLOB-12
**Success Criteria** (what must be TRUE):
  1. On desktop with `(pointer: fine)` and motion enabled, moving the cursor moves the blob with viscous lag — core (~lerp 0.18) snappier than body (~0.08) snappier than halo (~0.04); velocity-driven shape stretch along motion direction; pointer-leave-window decays smoothly to last position then ambient drift (no snap-disappear).
  2. Cursor dwell ≥1.5s ramps `--blob-heat` over 1.5–3s with peak luminance/scale delta ≤1.4×; resuming motion decays heat smoothly over ≥600ms with no jump; heat disabled under `prefers-reduced-motion: reduce`.
  3. On `(pointer: coarse) and (hover: none)` viewports, blob performs autonomous Lissajous drift (period ≥12s) with no pointer/touch follow; tap on background pulses ≤400ms (rate-limited 1 per 600ms), only when tap is not on an interactive element; blob pauses during scroll.
  4. Under `prefers-reduced-motion: reduce`, no `pointermove` listener, no rAF, blob is a static CSS gradient. Under `prefers-reduced-transparency: reduce`, blob `display: none` and glass surfaces switch to opaque fallbacks. In `[data-theme="dark"]`, blob opacity ≤0.35, saturation ≤0.7, follow disabled (ambient drift only); existing `backdrop-filter: none` on dark glass preserved.
  5. After 5 route navigations (`/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`), `window.__blobDebug.rafCount === 1` and pointermove listener count === 1 (singleton-guarded against React Strict Mode double-invocation and App Router cleanup); `data-blob-mode` attribute on `<html>` correctly reflects current mode (cursor / ambient / static); rAF stops when `document.hidden` and restarts on visible.
**Plans**: 5 plans

Plans:
- [x] 91-01-PLAN.md — Skeleton + canvas mount: LivingBlobField.tsx + .blob-canvas CSS + layout.tsx wiring + stub engine entrypoint (BLOB-01)
- [ ] 91-02-PLAN.md — Engine singleton: refcount + AbortController + single rAF + single pointermove + Page Visibility + Canvas 2D 4-sublayer renderer (BLOB-02, BLOB-03, BLOB-11)
- [ ] 91-03-PLAN.md — Physics: heat accumulator + velocity tracker + 14 LOCKED constants in physics.ts (BLOB-04, BLOB-05)
- [ ] 91-04-PLAN.md — Mode resolver + Lissajous + a11y branches + tap-pulse + dark theme dimming + manual a11y attestation (BLOB-06, BLOB-07, BLOB-08, BLOB-09, BLOB-10)
- [ ] 91-05-PLAN.md — Dev __blobDebug surface (NODE_ENV-gated, tree-shaken in prod) + final phase verification (BLOB-12)
**UI hint**: yes

### Phase 92: Glass Rework — Chrome + Index Sections
**Goal**: All `/` route components and always-visible chrome (Header, MobileMenu, StickyBar, Footer) sweep to v9.0 4-tier glass system. Forms remain WCAG AA-readable; CTAs stay fully opaque; mobile blur cap ≤12px preserved; glass surfaces optically respond to blob position via heat-leak gradients. Live blob from Phase 91 enables visual verification of every transparency choice.
**Depends on**: Phase 91 (live blob required to visually verify glass transparency; in-browser tuning sessions for lerp factors and heat timing land at this boundary)
**Requirements**: GLASS-01, GLASS-02, GLASS-03, GLASS-04, GLASS-05, GLASS-06, GLASS-07, GLASS-08, GLASS-09, GLASS-10
**Success Criteria** (what must be TRUE):
  1. `HeaderClient`, `MobileMenu`, `StickyBar`, `Footer` swept to v9.0 tiers (Tier 0 fill ≤0.16); HIG 44pt tap targets and ESC dismissal preserved; mobile blur ≤12px verified per component via DevTools.
  2. All `/` route sections (`HeroHub`, `StatsBar`, `ServicesGrid`, `ProcessSection`, `ProblemSection`, `WhyUsSection`, `ClinicsSection`, `PlatformSection`, `ReviewsSection`, `FAQSection`, `FinalCTA`) show transparent glass per token map (cards Tier 1 ~0.10 / hover Tier 2 ~0.14); `≤2 glass siblings per viewport` rule respected; responsive-glass-nesting from Phase 82 preserved on `StatsBar` (mobile 1 wrapper / desktop 4 cards); `FAQSection` closed Tier 1, open Tier 2 with smooth-anim accordion preserved.
  3. `ContactForm` + `ContactSection` form panel uses default `--glass-form-fill` (0.14 per `globals.css:249`; escalated to 0.30 with logged Key Decision `KD-v9-002` in PROJECT.md if WCAG AA fails); labels promoted from `text-muted` to `text-primary`; inputs `bg-white` opaque (NOT glass); localized blob dimming **(deferred under `KD-v9-003` — Path A; blue-gradient ContactSection wrapper occludes the blob, dimming is architecturally moot — see `92-CONTEXT.md`)**; body copy contrast ≥4.5:1 and large text ≥3:1 verified with blob parked at worst-case position.
  4. CTA buttons (gradient `#1AC67E → #0D9DB5`) verified opaque at all blob positions — no `backdrop-filter` ever applied, never glass-styled (grep on every CTA component); `FinalCTA` Tier 0 frame with opaque CTA preserved; gradient unchanged from v8.0.
  5. `liquid-glass.css` utilities re-pointed from `--liquid-bg: rgba(255,255,255,0.42)` and similar legacy values to new `--glass-*` tier tokens; heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` rules added to `.liquid-card` and `.liquid-regular` so glass surfaces optically respond to blob position; visual confirmation of optical response.
**Plans**: 8 plans

Plans:
- [x] 92-01-PLAN.md — liquid-glass.css utility re-pointing to v9.0 tier tokens; heat-leak rules verified preserved (GLASS-10)
- [x] 92-02-PLAN.md — CTA invariant + Header.tsx render-status + FinalCTA mix-blend-multiply baseline AUDIT (read-only)
- [x] 92-03-PLAN.md — Chrome sweep (HeaderClient, MobileMenu, StickyBar, Footer) to Tier 0; HIG 44pt + ESC preserved (GLASS-01, GLASS-09)
- [x] 92-04-PLAN.md — HeroHub + StatsBar + ServicesGrid sweep; preserve Phase 82 responsive nesting + over-photo controls (GLASS-02, GLASS-03, GLASS-04)
- [x] 92-05-PLAN.md — Mid sections sweep: Process, Problem, WhyUs, Clinics, Platform, Reviews (GLASS-05)
- [x] 92-06-PLAN.md — FAQSection accordion (D archetype) + FinalCTA frame/phone CTA sweep (GLASS-06, GLASS-08 partial)
- [x] 92-07-PLAN.md — ContactForm + ContactSection FORM-SAFETY: Tier 2 panel, opaque inputs, WCAG measurement, conditional KD-v9-002 escalation (GLASS-07)
- [x] 92-08-PLAN.md — FinalCTA mix-blend-multiply retirement + Header.tsx legacy handling + phase-gate SWEEP-AUDIT (GLASS-08)
**UI hint**: yes

### Phase 93: Per-Page Propagation — Sub-Routes
**Goal**: Service pages (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`) and shared primitives match the v9.0 visual register established on `/`. Mechanical class sweeps against finalized tokens; per-route screenshot diffs guard against visual regression in non-blob regions.
**Depends on**: Phase 92 (`liquid-glass.css` utilities, `--glass-*` tokens, and form-safety treatment must be finalized — sub-routes consume them; shadcn primitives done last because of highest blast-radius)
**Requirements**: ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, ROUTE-05, ROUTE-06, ROUTE-07
**Success Criteria** (what must be TRUE):
  1. `/checkup` (8 section files), `/consultations` (8 section files), `/treatment-abroad` (4 section files), `/contacts` (2 section files) all show same 4-tier glass behavior as `/`; visible chrome (header/sticky/footer) consistent across routes (blob is shared global layer mounted in `layout.tsx`).
  2. Service-page primitives (`ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection`) swept to tiers; `LeadFormSection` receives identical form-safety treatment as `ContactForm` from Phase 92 (≥0.16 alpha floor, `text-primary` labels, opaque `bg-white` inputs, localized blob dimming when blob enters bounds).
  3. shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea` in `next/src/components/ui/`) updated last and verified across all consumer call-sites; no surprise regressions in modals, dropdowns, or form fields anywhere in the app.
  4. Per-route Playwright screenshot diff captured against pre-v9.0 baseline before each route is signed off; form/CTA regions visually stable (blob area masked); no visual regression in non-blob regions.
  5. Service-page submission paths still reach Directus endpoint without regression on every route — verified by submitting test record from each page and confirming arrival in admin UI.
**Plans**: TBD
**UI hint**: yes

### Phase 94: Verification — UAT, Performance, A11y, Brand Review
**Goal**: All 12 TZ §19 acceptance criteria verified, Lighthouse mobile budgets met, real-device sign-off across iOS + low-end Android + 3 desktop browsers, axe-core clean, brand-aligned with medicusunion.com. **HARD GATE — no cheat-pass.** Phase 89 history (cheat-pass on a11y) makes this gate explicit: nothing ships to production without all checklist items signed off with concrete evidence.
**Depends on**: Phase 93 (verification spans all routes + all glass + blob engine; nothing earlier is shippable until verification clears)
**Requirements**: VER-01, VER-02, VER-03, VER-04, VER-05, VER-06, VER-07, VER-08
**Success Criteria** (what must be TRUE):
  1. Playwright UAT covers all 10 TZ §18 browser scenarios (desktop hero, mobile hero, cursor through hero/cards/form, 3s dwell, leave block, leave window, reduced motion, CTA/form readability) and passes on CI; a11y emulation tests for `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` assert blob hidden / glass opaque / luminance dampened correctly.
  2. Playwright leak test passes — `window.__blobDebug.rafCount === 1` and `pointermove` listener count === 1 after route cycle `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`.
  3. Lighthouse CI gate green on mobile-throttled budgets — LCP ≤2500ms, INP ≤200ms, CLS ≤0.1, TBT ≤200ms; PRs failing >10% regression vs baseline are blocked; axe-core / Pa11y zero new violations across all 4 routes with blob parked in 3+ representative positions per page (under hero, under form, under CTA).
  4. Real-device manual UAT signed off with screenshot/video evidence in phase report — (a) iPhone iOS 16 or 17 Safari, (b) low-end Android 4GB RAM (Redmi 9-class or similar), (c) desktop Chrome + Firefox + Safari. **NO cheat-pass** — phase is blocked without artifacts attached.
  5. Brand visual review complete (heat-peak still frame side-by-side with `medicusunion.com` and `medicusunion.com/.kz`; saturation pulled back if frame reads as fitness/gaming); all 12 TZ §19 acceptance criteria recorded as pass in phase report with concrete evidence per criterion.
**Plans**: TBD
**UI hint**: yes

<details>
<summary>v8.0 Phase Details (Phases 79-85) -- SHIPPED 2026-04-30</summary>

### Phase 79: Visual Foundation (Typography & Mobile Budget)
**Goal**: Establish the modern type scale and responsive glass/motion budget tokens that every subsequent v8.0 phase will consume -- nothing downstream ships without this foundation
**Depends on**: Nothing (first v8.0 phase; builds on shipped v7.0 token system)
**Requirements**: VIS-02, VIS-03
**Success Criteria** (what must be TRUE):
  1. Headings across the index page render with the updated modern type scale from the mockup -- display sizes, weights, and letter-spacing match at 375px and 1440px
  2. Glass tokens expose a mobile variant so no viewport below 768px composites more than 2 glass elements at once and blur values stay ≤12px
  3. A reader aged 45+ on mobile can still read body copy without zoom -- minimum body size ≥17px and line-height ≥1.5
  4. Existing v7.0 accessibility guarantees (prefers-reduced-motion, prefers-contrast, light-dark()) still pass on a token-only regression check
**Plans**: TBD
**UI hint**: yes

### Phase 80: Glass Header Chrome
**Goal**: Ship the updated glass-style header so every page (starting with index) wears the new design language and users still reach every existing section/page
**Depends on**: Phase 79 (consumes new typography + glass tokens)
**Requirements**: HDR-01, HDR-02, HDR-03
**Success Criteria** (what must be TRUE):
  1. Header renders with the new glass treatment aligned to the mockup -- visually distinct from the pre-v8.0 header on both light and dark themes
  2. Every navigation link that existed before v8.0 still navigates to the same section or page -- zero broken links, zero missing entries
  3. On a 375px viewport the mobile menu toggle opens/closes the nav, the header stays sticky on scroll, and no layout shift occurs when the glass effect activates
  4. Header respects `prefers-reduced-transparency` and `prefers-contrast: more` -- opaque fallback renders cleanly
**Plans**: TBD
**UI hint**: yes

### Phase 81: Hero Video-Call Frame
**Goal**: Replace the hero with a doctor photo framed as a video-call window so the 3-second value comprehension becomes "this is a real video consultation with a European doctor"
**Depends on**: Phase 79 (typography), Phase 80 (header chrome sits above hero)
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05
**Success Criteria** (what must be TRUE):
  1. Hero shows a doctor photo clearly framed as a video-call window (rounded frame, call UI chrome) -- a first-time visitor recognizes it as a call, not a flat portrait
  2. Mic, camera, and hangup control buttons are visible on the video-call frame (visual only; they do not need to function)
  3. An HD badge is visible on the video-call frame
  4. Two CTAs are present in the hero -- a primary that scrolls to or opens the consultation request form, and a secondary that scrolls to more info
  5. On a 375px viewport the hero remains readable for ЦА 45+ -- headline ≥32px, CTAs ≥44px touch target, no horizontal scroll
**Plans**: TBD
**UI hint**: yes

### Phase 82: Stats Bar
**Goal**: Give the visitor an at-a-glance credibility strip immediately below the hero so trust is established before they scroll into content
**Depends on**: Phase 79 (tokens), Phase 81 (hero placement)
**Requirements**: STATS-01, STATS-02
**Success Criteria** (what must be TRUE):
  1. A stats section renders directly below the hero containing exactly 4 metrics, each with its own icon, in glass-style cards
  2. The stats bar reads as an "at-a-glance" strip -- all 4 cards visible together at 1440px, stacked or 2x2 at 375px without wrapping into an awkward layout
  3. Stats bar stays within the mobile glass budget established in Phase 79 (counting the header, no more than 2 glass layers simultaneously visible on mobile)
**Plans**: TBD
**UI hint**: yes

### Phase 83: Services & Process Sections
**Goal**: Replace the mid-page content sections ("Мы помогаем на каждом этапе" and "Как это работает") with the new glass service cards and dotted-connector numbered steps from the mockup
**Depends on**: Phase 79 (tokens + typography)
**Requirements**: SVC-01, SVC-02, SVC-03, PROC-01, PROC-02, PROC-03
**Success Criteria** (what must be TRUE):
  1. "Мы помогаем на каждом этапе" renders exactly 4 glass-style service cards, each with an icon, title, and a short scannable description
  2. Every service card links to its existing service page -- clicking any card lands on the same destination as before v8.0 (no 404, no redirect loop)
  3. "Как это работает" renders exactly 4 numbered steps, each with an icon, visually connected by dotted connector lines on desktop (≥768px)
  4. On mobile (<768px) the dotted connectors either collapse to a vertical connector or disappear entirely -- the step layout never breaks, overlaps, or overflows the viewport
**Plans**: TBD
**UI hint**: yes

### Phase 84: CTA Form on Blue Gradient
**Goal**: Wrap the existing consultation request form in the new blue-gradient CTA section with trust signals so the final conversion moment matches the mockup without breaking any existing submission behaviour
**Depends on**: Phase 79 (tokens), Phase 80 (header parity for form page)
**Requirements**: FORM-01, FORM-02, FORM-03
**Success Criteria** (what must be TRUE):
  1. The final CTA section on the index page renders the form over a blue gradient background matching the mockup
  2. Visible trust signals accompany the form covering privacy, response time, and Europe-based doctors -- user can see all three without interacting
  3. Submitting the form still creates a record in Directus exactly as before v8.0 -- same endpoint, same fields, same success/error UX, no regression detected in dev tools network tab
**Plans**: TBD
**UI hint**: yes

### Phase 85: Glass Hardening & Accessibility Verification
**Goal**: Confirm that the full new index page meets the mockup's glassmorphism intensity while keeping every v7.0 accessibility guarantee intact -- the milestone cannot ship without this check
**Depends on**: Phase 80, 81, 82, 83, 84 (every visual change must land first)
**Requirements**: VIS-01, VIS-04
**Success Criteria** (what must be TRUE):
  1. Glassmorphism across the index page is visibly strengthened vs pre-v8.0 in a side-by-side screenshot at 1440px and 375px -- matches the mockup's intensity on hero frame, stats, services, and form container
  2. With `prefers-contrast: more` enabled the index page switches to solid surfaces and all text passes WCAG 2.2 AA (4.5:1 body, 3:1 large) against its worst-case composite background
  3. With `prefers-reduced-transparency: reduce` enabled every glass surface on the index becomes fully opaque -- zero transparency visible
  4. With `prefers-reduced-motion: reduce` enabled no motion occurs on the index page -- hero, stats, services, process, and form all render in their final position immediately
  5. Tab order through the new index page shows a visible `:focus-visible` ring on every interactive element, and all buttons/tappable elements measure ≥44×44px on a 375px viewport
**Plans**: TBD
**UI hint**: yes

</details>

## Progress

### v9.0 Living Blob Liquid Glass Scene

**Execution Order:**
90 -> 91 -> 92 -> 93 -> 94
Sequential. Phase ordering is non-negotiable: glass transparency cannot be verified without a live blob (Foundation → Engine → Glass).
Phase 90 (Foundation) is the contract every later phase consumes — tokens + a11y `@layer` + DOM skeleton.
Phase 91 (Engine) makes the blob alive across all mode branches.
Phase 92 (Glass Index + Chrome) sweeps `/` + always-visible chrome with live blob behind it.
Phase 93 (Sub-Routes) propagates validated patterns mechanically.
Phase 94 (Verification) is a HARD GATE — no cheat-pass. Real-device UAT, Lighthouse, axe-core, brand review, all 12 TZ §19 criteria.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 90. Foundation — Tokens, A11y Wiring, DOM Skeleton | 5/5 | Complete   | 2026-04-30 |
| 91. Blob Engine — Renderer, Physics, A11y Branches | 0/0 | Not started | — |
| 92. Glass Rework — Chrome + Index Sections | 8/8 | Complete    | 2026-04-30 |
| 93. Per-Page Propagation — Sub-Routes | 6/8 | In Progress|  |
| 94. Verification — UAT, Performance, A11y, Brand Review | 0/0 | Not started | — |

### v8.0 Index Page Redesign

**Execution Order:**
79 -> 80 -> 81 -> 82 -> 83 -> 84 -> 85
Phase 79 is the foundation -- all other phases consume its tokens.
Phase 80 ships next because the header is visible on every page and unblocks per-page visual parity.
Phase 85 is a verification phase and must be last.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 79. Visual Foundation (Typography & Mobile Budget) | 1/1 | Complete    | 2026-04-29 |
| 80. Glass Header Chrome | 1/1 | Complete    | 2026-04-30 |
| 81. Hero Video-Call Frame | 1/1 | Complete    | 2026-04-30 |
| 82. Stats Bar | 1/1 | Complete    | 2026-04-30 |
| 83. Services & Process Sections | 1/1 | Complete    | 2026-04-30 |
| 84. CTA Form on Blue Gradient | 1/1 | Complete    | 2026-04-30 |
| 85. Glass Hardening & Accessibility Verification | 1/1 | Complete    | 2026-04-30 |

### v7.0 UI/UX Design Excellence

**Execution Order:**
73 -> 74 -> 74.1 -> 75 -> 76 -> 77 -> 78
Phase 74.1 must complete before 75 (integration fixes affect downstream).
Phase 77 depends on Phase 76. Phase 78 depends on Phases 74.1 + 75.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 73. Token Foundation | 2/2 | Complete (human_needed) | 2026-04-13 |
| 74. Accessibility Hardening | 2/2 | Code complete | 2026-04-13 |
| 74.1. Integration Cleanup & Verification | 2/2 | Complete    | 2026-04-14 |
| 75. Mobile Performance Budget | 2/2 | Complete    | 2026-04-14 |
| 76. Interaction Polish | 2/2 | Complete    | 2026-04-14 |
| 77. Progressive Enhancement | 1/1 | Complete    | 2026-04-14 |
| 78. Token Verification & Visual Regression | 1/1 | Complete    | 2026-04-14 |
