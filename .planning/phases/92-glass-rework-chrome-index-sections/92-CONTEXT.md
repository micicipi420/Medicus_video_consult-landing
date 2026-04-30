# Phase 92 Context — Glass Rework: Chrome + Index Sections

**Created:** 2026-04-30
**Milestone:** v9.0 Living Blob Liquid Glass Scene
**Mode:** discuss --auto (claude-decided — user delegated all technical decisions)
**Sequencing:** Builds on Phase 91 (live blob writes `--blob-x/y/heat`). Unblocks Phase 93 (per-route propagation reuses Phase 92 patterns).

## <domain>

Sweep all `/` route components and always-visible chrome (Header, MobileMenu, StickyBar, Footer) to v9.0 4-tier glass system. Forms remain WCAG AA-readable; CTAs stay fully opaque (Phase 90 master list); mobile blur cap ≤12px preserved; glass surfaces optically respond to blob position via heat-leak `radial-gradient` rules. Live blob from Phase 91 enables visual verification of every transparency choice.

Phase boundary (FIXED — no scope creep):
- ✅ HeaderClient + MobileMenu + StickyBar + Footer chrome rework
- ✅ All 14 `/` route sections opacity sweep to 4-tier system
- ✅ ContactForm + ContactSection form-safety treatment (default `--glass-form-fill` 0.14 + KD-v9-002 escalation rule)
- ✅ Heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` on `.liquid-card` + `.liquid-regular`
- ✅ `liquid-glass.css` utility re-pointing from `--liquid-bg` legacy values to `--glass-*` tier tokens
- ✅ `data-blob-mode="dark"` glass fallback rules (preserve Phase 67.1 `backdrop-filter: none` on dark)
- ❌ Service-page propagation (Phase 93)
- ❌ shadcn primitives (Phase 93 — highest blast-radius, last)
- ❌ Playwright UAT, Lighthouse, axe-core (Phase 94)
- ❌ Real-device perf testing (Phase 94 HARD GATE)

## <canonical_refs>

| Path | Why |
|------|-----|
| `design/LIQUID_GLASS_BLOB_TZ.md` | §9 (alpha tiers 0.04/0.08/0.12/0.16), §10 (UI reaction to blob), §11 (depth hierarchy), §13 (CTA + forms WCAG AA) |
| `.planning/REQUIREMENTS.md` (GLASS-01..10) | Locked requirements |
| `.planning/research/PITFALLS.md` | #3.1 CTA disappear, #3.2 form readability collapse, #1.6 box-shadow compounding, #1.8 will-change overuse |
| `.planning/ROADMAP.md` (Phase 92) | 5 success criteria — chrome / sections / forms / CTAs / utilities re-point |
| `.planning/PROJECT.md` | KD-v9-001 approved 2026-04-30; CTA opaque-forever 7-component master list (Phase 90 DESIGN.md) |
| `DESIGN.md` (repo root) | v9.0 Custom Rules: z-index contract, CTA opaque-forever, 15 anti-patterns; YAML `glass:` 4-tier table from Phase 90 |
| `next/src/styles/liquid-glass.css` (1037 lines + 96 a11y block from Phase 90) | RECEIVES Phase 92 utility re-pointing + heat-leak rules |
| `next/src/app/globals.css` | `--glass-*` tier tokens registered in Phase 90; Phase 92 consumes via `var()` |
| `next/src/styles/blob.css` | Phase 90/91 ships `.living-blob-field`, `.blob-canvas`, dark dimming; Phase 92 must NOT modify (reads `--blob-x/y/heat` only) |
| `next/src/lib/blob-engine/` | Phase 91 engine writes `--blob-*` runtime vars. Frozen — Phase 92 only consumes. |
| `next/src/components/sections/HeroHub.tsx` | Direct Tailwind glass utilities (`bg-white/40`, `backdrop-blur-[20px]`, `border-glass-border`) — Phase 92 sweeps to v9.0 tokens |
| `next/src/components/sections/StatsBar.tsx` | Responsive-glass-nesting from Phase 82 (mobile 1 wrapper / desktop 4 cards) — preserve |
| `next/src/components/sections/ServicesGrid.tsx` | Cards Tier 1 / hover Tier 2 |
| `next/src/components/sections/ProcessSection.tsx`, `ProblemSection.tsx`, `WhyUsSection.tsx`, `ClinicsSection.tsx`, `PlatformSection.tsx`, `ReviewsSection.tsx`, `FAQSection.tsx` | Per-tier sweep |
| `next/src/components/sections/ContactForm.tsx`, `ContactSection.tsx` | FORM-SAFETY: `--glass-form-fill` default + label promotion + opaque inputs |
| `next/src/components/sections/FinalCTA.tsx` | Tier 0 frame + opaque CTA |
| `next/src/components/layout/HeaderClient.tsx`, `MobileMenu.tsx`, `StickyBar.tsx`, `Footer.tsx` | Chrome — Tier 0 (≤0.16) |

## <prior_decisions>

**From Phase 91 (shipped 2026-04-30):**
- Engine writes `--blob-x/y` (core position), `--blob-body-x/y`, `--blob-halo-x/y`, `--blob-heat`, `--blob-velocity` to `:root` each frame. Phase 92 reads these via `var()` in `radial-gradient`.
- Engine sets `<html data-blob-mode="...">` to one of `cursor/ambient/static/hidden/dark`. Phase 92 may use this attribute to gate heat-leak rules (e.g., disable in `dark` mode where `backdrop-filter: none` already wins).
- Mobile blur ≤12px enforced at engine-CSS layer. Phase 92 components must use only `--glass-*-blur` tokens (which clamp to 12px on mobile).

**From Phase 90:**
- 4-tier glass tokens registered: `--glass-section-{fill,blur}`, `--glass-card-{fill,blur}`, `--glass-form-{fill,blur}`, `--glass-button-{fill,blur}`.
  - Tier 0 (section): fill 0.06 desktop, blur clamp(12px, 2vw, 24px)
  - Tier 1 (card): fill 0.10 desktop, blur clamp(12px, 1.6vw, 20px)
  - Tier 2 (form): fill 0.14 desktop (single value; mobile resolves same), blur clamp(12px, 1.4vw, 18px)
  - Tier 3 (button): fill 0.12 desktop, blur clamp(12px, 1vw, 14px)
- CTA opaque-forever 7-component master list in DESIGN.md (Phase 90).
- 15 anti-patterns appendix in DESIGN.md — entry #4 (no fills > 0.16), #5 (no green tint on cards), #11 (no `backdrop-filter` on `.living-blob-field`), #14 (new glass class must be in `@a11y-layer-coverage`).

**From v8.0 Phase 82 (responsive-glass-nesting):**
- StatsBar mobile = 1 wrapper card (4 stats inside it transparent). Desktop = 4 individual glass cards. Phase 92 must preserve this responsive switch.

**From v6.0 Phase 67.1:**
- `[data-theme="dark"]` disables `backdrop-filter` globally. Phase 92 heat-leak rules must NOT add `backdrop-filter` in dark mode (existing rule preserved).

## <decisions>

### Decision A: Tier mapping per component (LOCKED)

Strict mapping aligned with TZ §9 + ROADMAP success criteria:

| Component | Default tier | Hover tier | Notes |
|-----------|-------------|-----------|-------|
| `HeroHub` frame | Tier 0 (section, fill ≤0.16) | — | CTA inside is opaque |
| `HeroHub` clinic count badge | Tier 0 | — | Decorative chrome |
| `HeroHub` HD/mic/cam controls overlay | hardcoded `bg-mu-text-900/55` | — | NOT glass — over-photo control bar; preserve current dark surface |
| `StatsBar` mobile wrapper | Tier 0 | — | Single wrapper card |
| `StatsBar` desktop cards | Tier 1 | Tier 2 | 4 individual cards |
| `ServicesGrid` cards | Tier 1 | Tier 2 | — |
| `ProcessSection`, `ProblemSection`, `WhyUsSection`, `ClinicsSection`, `PlatformSection`, `ReviewsSection` | Tier 1 cards or Tier 0 section | Tier 2 | Per-component judgment via in-browser tuning |
| `FAQSection` items | closed Tier 1 | open Tier 2 | Smooth-anim accordion preserved |
| `ContactForm` panel | Tier 2 form (`--glass-form-fill` default 0.14) | — | Inputs `bg-white` opaque, NOT glass |
| `ContactSection` chrome | Tier 0 | — | Encloses ContactForm |
| `FinalCTA` frame | Tier 0 | — | CTA opaque (gradient #1AC67E → #0D9DB5 unchanged) |
| `Footer` | Tier 0 | — | — |
| `HeaderClient` | Tier 0 | — | Sticky; backdrop-blur-2xl currently → use `--glass-section-blur` |
| `MobileMenu` | Tier 0 | — | Drawer — heavier blur acceptable, but capped by mobile token |
| `StickyBar` | Tier 0 | — | Bottom mobile sticky |

### Decision B: Form-safety treatment (GLASS-07 — LOCKED)

ContactForm + ContactSection + LeadFormSection (Phase 93):

1. **Panel fill:** start at `--glass-form-fill` (default 0.14 per globals.css). If WCAG AA contrast fails on body copy or labels at any blob position, escalate to 0.30 with **Key Decision logged in PROJECT.md** as `KD-v9-002`.
2. **Label color:** promote from `text-muted` to `text-primary` (or equivalent — current `mu-text-900` darker variant).
3. **Input fields:** `bg-white` (opaque), NOT glass. Existing `bg-white/50` → `bg-white` (or `--mu-surface-white` token).
4. **Localized blob dimming:** N/A under Path A (form sits over blue-gradient ContactSection wrapper which already occludes the blob). See KD-v9-003 below.
5. **Body copy contrast:** ≥4.5:1 with blob parked at worst-case position; large text ≥3:1.

### Decision C: Heat-leak `radial-gradient` rules (GLASS-10 — LOCKED)

Add to `.liquid-card` and `.liquid-regular` utility classes:

```css
.liquid-card,
.liquid-regular {
  background-image:
    radial-gradient(
      ellipse 600px 400px at var(--blob-x, 50vw) var(--blob-y, 50vh),
      hsla(150, 60%, 50%, calc(0.04 * var(--blob-heat, 0))),
      transparent 70%
    ),
    /* existing background layers preserved */;
}
```

Glass surfaces optically "warm up" where the blob is, peak intensity at heat=1.0. Disabled implicitly under reduced-transparency (existing `display: none` on `.living-blob-field`) and dark mode (existing `backdrop-filter: none`).

### Decision D: liquid-glass.css utility re-pointing (GLASS-10 — LOCKED)

Re-point existing utility classes from `--liquid-*` legacy variables to v9.0 tier tokens:

| Utility | Current var | New var |
|---------|-------------|---------|
| `.liquid-regular` | `--liquid-bg: rgba(255,255,255,0.42)` | `var(--glass-section-fill)` |
| `.liquid-card` | `--liquid-bg` (same) | `var(--glass-card-fill)` |
| `.liquid-clear` | `--liquid-bg-clear` | leave as-is (clear material is special-purpose) |
| `.liquid-fluted` | `--liquid-bg-fluted` | leave as-is |
| `.liquid-nav` | `--liquid-bg-nav` | `var(--glass-section-fill)` |
| `.stats-glass` | `--liquid-bg` | `var(--glass-card-fill)` |
| `.liquid-btn-primary` | (gradient — opaque) | NO CHANGE (CTA opaque-forever) |
| `.liquid-btn-secondary` | `--liquid-bg-button` | `var(--glass-button-fill)` |
| Backdrop-filter values | hardcoded `blur(24px)` etc. | tier-specific `var(--glass-{tier}-blur)` |

`--liquid-*` legacy vars STAY in `globals.css` for any consumers outside the swept utilities (defensive), but new v9.0 tokens are the canonical source.

### Decision E: Component sweep approach — Tailwind class swap, NOT utility migration

**Auto-decided:** Index components currently use direct Tailwind classes (`bg-white/40`, `backdrop-blur-[20px]`, `border-glass-border`), not `.liquid-card` utility classes. Phase 92 sweeps the **direct class values**, not the utility names.

Strategy:
1. Replace `bg-white/{N}` opacity classes with `bg-[var(--glass-{tier}-fill)]` arbitrary-value Tailwind classes
2. Replace hardcoded `backdrop-blur-[Npx]` with `backdrop-blur-[var(--glass-{tier}-blur)]`
3. `border-glass-border` and `border-glass-border-strong` stay (already token-based, Phase 73 era)
4. `shadow-glass`, `shadow-glass-lg`, `shadow-glass-sm` stay (token-based)
5. CTA gradient classes (`from-mu-cta-from-v6 to-mu-cta-to-v6`) NEVER touched (CTA opaque-forever)

Per-component PRs (split across waves), each verified visually before next ships.

### Decision F: Plan breakdown (8 plans, 4 waves)

Phase 92 is large. Decomposition:

| Plan | Wave | Scope                                                                  |
|------|------|------------------------------------------------------------------------|
| 92-01 | 1   | liquid-glass.css utility re-point + heat-leak verify                   |
| 92-02 | 1   | Read-only audit: CTA invariants + Header.tsx render status + FinalCTA mix-blend |
| 92-03 | 2   | Chrome sweep — HeaderClient + MobileMenu + StickyBar + Footer          |
| 92-04 | 2   | HeroHub + StatsBar + ServicesGrid                                       |
| 92-05 | 3   | Process / Problem / WhyUs / Clinics / Platform / Reviews                |
| 92-06 | 3   | FAQSection + FinalCTA frame                                             |
| 92-07 | 4   | ContactForm + ContactSection form-safety + WCAG                         |
| 92-08 | 4   | FinalCTA mix-blend retirement + Header dead-code + phase-gate sweep    |

> **Amended 2026-04-30 during plan-phase verification** — original Decision F predicted 8 plans / 4 waves with 92-02 as the chrome sweep at Wave 2; final plan layout shifted scope assignments forward by 1 step (audit became Wave 1 alongside utility CSS) so Wave 2 starts with no read dependency on still-pending audit results. Wave 3 absorbs the mid-section + FAQ/FinalCTA work originally projected for Wave 2; Wave 4 owns form-safety + final phase-gate sweep + mix-blend retirement.

Wave 1 (foundation + audit) → Wave 2 (chrome + hero/stats/services parallel) → Wave 3 (mid-sections + FAQ/FinalCTA frame) → Wave 4 (form-safety + phase-gate).

### Decision G: KD-v9-002 escalation flow

If Playwright (or DevTools manual) WCAG contrast measurement on ContactForm body copy returns < 4.5:1 with blob parked at worst-case position:
1. Escalate `--glass-form-fill` from 0.14 → 0.30 (or intermediate value)
2. Add `KD-v9-002` row to PROJECT.md Key Decisions: rationale, before/after contrast values, blob position screenshot
3. Status: `approved` (no further user gate — auto-decided per delegation)

### Decision H: Anti-pattern enforcement

Phase 92 plans MUST grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks. Specifically blocked:
- #4 fills > 0.16 (Tier 3 button is exception at exact 0.16; cards must be ≤0.12)
- #5 green tint on cards (heat-leak gradient is OK because it's blob-position-driven, not static green tint)
- #6 animated `backdrop-filter` (heat-leak gradient is on `background-image`, not `backdrop-filter`)
- #11 `backdrop-filter` on `.living-blob-field` (Phase 92 doesn't touch blob-field)
- #14 new glass class must be in `@a11y-layer-coverage` markers (Phase 92 doesn't add new classes — only re-points existing ones)

### Decision I: Frozen ranges (no Phase 92 modification)

- `next/src/styles/blob.css` — Phase 90/91 territory; Phase 92 consumes runtime vars only
- `next/src/lib/blob-engine/*` — Phase 91 territory
- `next/src/app/globals.css` token blocks — Phase 90 frozen (single exception: KD-v9-002 escalation may bump `--glass-form-fill` 0.14 → 0.30)
- `next/src/hooks/use-specular-highlight.ts` — orthogonal
- `next/src/components/layout/SvgRefractionDefs.tsx` — frozen
- `DESIGN.md` — Phase 90 finalized; Phase 92 doesn't add new tokens or anti-patterns
- All service-page components in `sections/{checkup,consultations,treatment,contacts}` — Phase 93 territory
- All `next/src/components/ui/` shadcn primitives — Phase 93 territory
- `liquid-glass.css` `@a11y-layer-coverage` block (lines 79-158 from Phase 90) — Phase 92 only edits utility class internals OUTSIDE that block

## <key_decisions>

### KD-v9-003: Localized blob dimming N/A under Path A (added 2026-04-30 during plan-phase verification)

**Decision:** GLASS-07 sub-clause "localized blob dimming when blob centroid enters form bounds" (Decision B step 4 / REQUIREMENTS.md GLASS-07) is **N/A under Path A** — the form sits over a blue-gradient ContactSection wrapper (`from-mu-blue via-mu-accent-blue to-mu-blue` at ContactSection.tsx:26) which already fully occludes the page-level blob field beneath it.

**Architectural fact:** Dimming a blob that is already invisible behind an opaque blue gradient is a moot operation. Adding a `mask-image` overlay or absolute-positioned dimmer would consume compositing budget for no visible effect.

**Decision: Path A — preserve blue gradient; mark sub-clause deferred.**

**Verification:** Plan 92-08 phase-gate SWEEP-AUDIT must include a screenshot confirming no visible blob bleeds through the form panel under any blob mode (cursor / static / ambient).

**Status:** approved (auto-decided per CONTEXT.md mode delegation; no further user gate).

**Cross-references:**
- REQUIREMENTS.md GLASS-07 — "localized blob dimming" sub-clause marked `(deferred under KD-v9-003 — Path A)`.
- ROADMAP.md Phase 92 Success Criterion 3 — same `(deferred under KD-v9-003)` qualifier.
- 92-RESEARCH.md §Pitfall 2 — Path A locked.
- 92-07-PLAN.md — explicit Path A note + SUMMARY documentation requirement.

## <code_context>

**Reusable assets:**
- All 14 index components in `next/src/components/sections/`
- 4 chrome components in `next/src/components/layout/`
- `liquid-glass.css` utility classes (1037 + 96 lines) — receive Phase 92 sweep + heat-leak rules
- Phase 91 `--blob-x/y/heat` runtime vars on `:root`
- Phase 90 `--glass-{tier}-{fill,blur}` tier tokens
- Phase 90 CTA opaque-forever master list in DESIGN.md
- v8.0 Phase 82 responsive-glass-nesting on StatsBar (preserve)

**Confirmed component-style approach:**
- Index components use direct Tailwind classes (`bg-white/40`, `backdrop-blur-[20px]`), not `.liquid-card` utility class wrappers
- Phase 92 sweeps the Tailwind class values, plus utility class internals in liquid-glass.css for any consumers (header backdrop, footer, etc.)

**Token consumption pattern:**
- Tailwind arbitrary value: `bg-[var(--glass-card-fill)]` and `backdrop-blur-[var(--glass-card-blur)]`
- Direct CSS in liquid-glass.css: `background: var(--glass-card-fill);` and `backdrop-filter: blur(var(--glass-card-blur));`

## <deferred>

(Future phases — NOT Phase 92.)

- **Service page propagation** (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`) — Phase 93
- **shadcn primitives** (card, dialog, input, select, textarea) — Phase 93
- **LeadFormSection form-safety** — Phase 93 (mirrors Phase 92 ContactForm treatment)
- **Per-route Playwright screenshot diff** — Phase 93
- **Lighthouse CI mobile-throttled gates** — Phase 94 HARD GATE
- **Real-device manual UAT** — Phase 94 HARD GATE
- **axe-core / Pa11y across 4 routes × 3 blob positions** — Phase 94
- **Brand visual review** — Phase 94

## <success_criteria>

Phase 92 ships when:

1. ✅ HeaderClient + MobileMenu + StickyBar + Footer at Tier 0 (≤0.16 fill); HIG 44pt tap targets preserved; mobile blur ≤12px verified
2. ✅ All 14 `/` route sections updated to v9.0 4-tier system (cards Tier 1 ≤0.12 / hover Tier 2 ≤0.16); ≤2 glass siblings per viewport rule respected; responsive-glass-nesting on StatsBar preserved
3. ✅ ContactForm uses `--glass-form-fill` (default 0.14; escalated to 0.30 with KD-v9-002 if WCAG AA fails); labels promoted to `text-primary`; inputs `bg-white` opaque; localized blob dimming deferred under KD-v9-003 (Path A — blue gradient occludes blob); body copy contrast ≥4.5:1
4. ✅ All CTAs verified opaque at all blob positions (grep on every CTA component; no `backdrop-filter`); FinalCTA Tier 0 frame; gradient unchanged
5. ✅ `liquid-glass.css` utilities re-pointed from `--liquid-bg` to `--glass-*` tier tokens; heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` rules added to `.liquid-card` + `.liquid-regular`; visual confirmation of optical response to blob movement
6. ✅ Page renders without runtime errors on `/`; `pnpm build` clean
7. ✅ No new dependencies
8. ✅ All 10 GLASS-NN requirements code-complete in REQUIREMENTS.md
9. ✅ Frozen ranges respected (blob.css, blob-engine/*, globals.css tokens [single exception: KD-v9-002 escalation], useSpecularHighlight.ts, SvgRefractionDefs.tsx, DESIGN.md, service pages, shadcn primitives)

---

*Discussed: 2026-04-30 — claude-decided mode (user delegated all technical decisions).*
*Amended: 2026-04-30 during plan-phase verification — Decision F table reconciled with actual 8-plan / 4-wave layout; KD-v9-003 added.*
*Next: `/gsd-plan-phase 92 --skip-ui` — generates 8 PLAN.md files.*
