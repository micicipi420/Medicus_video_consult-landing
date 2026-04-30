# Phase 92: Glass Rework — Chrome + Index Sections — Research

**Researched:** 2026-04-30
**Domain:** Tailwind v4 arbitrary-value class swap + CSS custom-property consumption + Apple Liquid Glass HIG enforcement on a Next.js App Router static-render `/` route
**Confidence:** HIGH (codebase reality directly inspected; design contract is locked)

## Summary

Phase 92 is a **mechanical-but-careful Tailwind class sweep** across 4 chrome components and 11 `/`-route sections, plus a one-file CSS edit (`liquid-glass.css`) that re-points existing utility classes from legacy `--liquid-bg` rgba values to Phase 90's `--glass-{section,card,form,button}-{fill,blur}` tier tokens. The work is *not* research-heavy — every architectural decision is already locked in `92-CONTEXT.md` (Decisions A–I) and `92-UI-SPEC.md`. Research value comes from (a) verifying current code addresses, (b) flagging contradictions between the spec and reality, and (c) detailing the audit/verification toolchain.

**Key codebase realities the planner must build around:**

1. **Heat-leak rules already shipped** in commit 9c93b9f for `.liquid-card` (α 0.06) and `.liquid-regular` (α 0.04). Plan 92-01 verifies-and-extends, doesn't re-write.
2. **Index components use direct Tailwind classes**, not `.liquid-card` utility wrappers — `bg-white/{N}` and `backdrop-blur-{Npx|2xl|3xl}` are scattered through 11 section files. The CSS-utility re-pointing in Plan 92-01 affects almost nothing on `/` route directly; it matters for `Header.tsx` (legacy unused), `LeadFormSection`, `ContactMethodGrid` (Phase 93), and any service page.
3. **Engine writes `--blob-x/y` in pixels** (`${state.core.x}px`), not viewport units. The CSS fallback `var(--blob-x, 50vw)` is unit-mismatched but harmless because once the engine starts, the runtime value (`px`) overwrites the fallback. Heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y) ...)` works against the document coordinate space.
4. **CTA classes are inline** on `<a>`/`<button>` per component — no shared `<Button>` component exists. The grep for "no `backdrop-filter` on CTA" must run across every section file individually. Pattern: `bg-gradient-to-r from-mu-blue to-mu-accent-blue` is the canonical CTA marker (8 occurrences on `/` route).
5. **`ContactSection` panel is opaque white today** (`bg-white p-6`, line 120) — the form is NOT currently glass. Decision B's instructions to migrate to `bg-[var(--glass-form-fill)]` actually *reduces* opacity from 1.0 to ~0.14 desktop. This must be flagged: the move is "make the form readable on a transparent panel" and the escalation path (KD-v9-002 → 0.30) is the safety valve. Body copy contrast measurement is mandatory before sign-off.
6. **`ContactForm.tsx` lives inside `ContactSection.tsx` over a blue-gradient panel** (`bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue`), not over the page-wide blob. The "blob centroid enters form bounds" trigger from Decision B step 5 is therefore mostly theoretical for the *current* layout — the form is encased in an opaque white card on a vivid blue rectangle. Plan 92-07 may reconsider whether the gradient backdrop should change to allow the blob through, OR keep the gradient and skip the localized-dimming step. **Flag for in-browser tuning in 92-07.**
7. **`FinalCTA.tsx` carries `mix-blend-multiply` on its decorative `bg-mu-blue/30 blur-[100px]` blob (line 14)** — anti-pattern #8 hit. Plan 92-08 must retire this decoration or sanction it explicitly. UI-SPEC already flagged this.
8. **Header.tsx** (`next/src/components/layout/Header.tsx`) is a separate legacy file from `HeaderClient.tsx` and uses raw Tailwind gradients on the brand wordmark and a phone CTA. **Verify whether `Header.tsx` is still rendered** before scoping it — `layout.tsx` likely imports `HeaderClient`, not `Header`.

**Primary recommendation:** Sequence the 8 plans exactly per Decision F (Wave 1: utility re-point → Wave 2: 4 parallel component plans → Wave 3: form + accordion → Wave 4: FinalCTA + verification). Treat 92-01 as a 60-line CSS diff with grep verification, not a deep edit. Treat 92-07 as the only plan with significant uncertainty (form-safety + KD-v9-002 escalation flow). All other plans are mechanical class swaps with token-equivalence math.

## Architectural Responsibility Map

Phase 92 spans only the **Frontend (CSR/RSC + browser CSS)** tier. No API/backend/storage involvement.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Glass token consumption (Tailwind arbitrary values + CSS `var()`) | Browser (computed CSS) | RSC build (Tailwind v4 class generation) | Tokens registered in `globals.css :root`; consumed at paint time |
| Heat-leak gradient (`radial-gradient(... at var(--blob-x) var(--blob-y))`) | Browser (paint pipeline) | — | Pure CSS, runs every frame during repaint (no JS in the loop) |
| Blob position streaming (Phase 91, frozen) | Browser (rAF) | — | Engine writes `:root` style each frame; Phase 92 only reads via `var()` |
| CTA opacity invariant | RSC component output | Browser (verification) | Tailwind class strings — no runtime decision |
| Form-safety contrast verification | Browser DevTools / Playwright | — | Composite background measurement requires real paint |
| `prefers-reduced-{motion,transparency,contrast}` fallbacks | Browser (CSS @media) | — | Already wired in `liquid-glass.css` `@a11y-layer-coverage`; Phase 92 inherits |

**No tier misassignment risk:** Phase 92 is confined to a single tier by construction. The only cross-tier coupling is Phase 91's engine writing `--blob-*` runtime vars at `:root` — that coupling is one-way (Phase 92 reads, doesn't write).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GLASS-01 | HeaderClient + MobileMenu + StickyBar to v9.0 tiers; ≤12px mobile blur; HIG 44pt + ESC preserved | Component inventory (§Standard Stack); MobileMenu already has ESC handler (line 14); HeaderClient uses `bg-white/{30,50}` + `backdrop-blur-[40px|60px]` — direct token swap; tap target on MobileMenu burger is `h-11 w-11` = 44px (compliant) |
| GLASS-02 | HeroHub Tier 0 frame; CTA stays opaque, never receives backdrop-filter | HeroHub line 15 (pill badge `bg-white/40 backdrop-blur-[20px]`), line 56 (secondary CTA `bg-white/50 backdrop-blur-[20px]`), line 139 (credibility badge `bg-white/75 backdrop-blur-[40px]`); video-frame chrome at lines 94/103/115 is `bg-mu-text-900/55` over-photo controls — NOT glass-tier, preserve |
| GLASS-03 | StatsBar — wrapper Tier 0, cards Tier 1 / hover Tier 2; responsive nesting preserved | StatsBar line 49 (mobile wrapper `rounded-[2rem] bg-white/60 backdrop-blur-2xl sm:bg-transparent sm:backdrop-blur-none`), line 56 (per-card desktop `sm:bg-white/60 sm:backdrop-blur-2xl sm:hover:bg-white/70`); responsive switch is via Tailwind `sm:` variant — sweep both halves |
| GLASS-04 | ServicesGrid cards Tier 1 / hover Tier 2; ≤2 glass per viewport | ServicesGrid line 104 (`bg-white/60 backdrop-blur-2xl hover:bg-white/70`); line 80 section pill (`bg-white/40 backdrop-blur-xl`); line 115 nested badge (`bg-white/50 backdrop-blur-md` — risks ≤2-per-viewport) |
| GLASS-05 | Process/Problem/WhyUs/Clinics/Platform/Reviews per-tier sweep | Inventory in §Standard Stack — every section uses `bg-white/{40,60,65}` + `backdrop-blur-{xl,2xl,3xl}` |
| GLASS-06 | FAQSection — closed Tier 1, open Tier 2; smooth-anim accordion preserved | FAQSection.tsx is a `'use client'` component using `useState` + Tailwind `transition-[max-height]` (line 141 `max-h-0 → max-h-[500px]`); no animation library; accordion is CSS-only — preserve transition class |
| GLASS-07 | ContactForm form-safety — ≥0.16 floor, escalation to 0.30 if WCAG fails; labels promoted; inputs opaque; localized blob dimming | ContactForm line 128 input template (`bg-white/50 ... focus:bg-white/72`); labels already `text-mu-text-900 font-bold` (lines 137, 159, 182, 207) — UI-SPEC notes promotion is verify-only; ContactSection line 120 is `bg-white p-6` (current opaque); Decision B step 5 dimming pattern is **architecturally awkward against the existing blue-gradient backdrop** — see §Common Pitfalls |
| GLASS-08 | FinalCTA Tier 0 frame; CTA opaque; gradient unchanged | FinalCTA line 8 (`bg-white/60 backdrop-blur-3xl`); line 26 primary CTA gradient; line 33 phone CTA glass; **line 14 anti-pattern #8 violation** — `mix-blend-multiply` on decorative blob |
| GLASS-09 | Footer Tier 0 fill | Footer line 18 (`bg-white/60 backdrop-blur-3xl`); lines 89/100 inner contact icons (`bg-white/60 backdrop-blur-md`) |
| GLASS-10 | liquid-glass.css re-point + heat-leak preserved on `.liquid-card`/`.liquid-regular` | Heat-leak already shipped in commit 9c93b9f at lines 174–181 (`.liquid-regular` α 0.04) and lines 340–347 (`.liquid-card` α 0.06); Decision D table maps utility-class internals — see §Token Migration Map |

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Decision A:** Tier mapping per component (table in §Standard Stack and 92-CONTEXT.md). Each component's default tier and hover tier is fixed.
- **Decision B:** Form-safety treatment for ContactForm + ContactSection — `--glass-form-fill` floor, label promotion, opaque inputs, localized blob dimming, body copy ≥4.5:1 contrast.
- **Decision C:** Heat-leak `radial-gradient` formula — `radial-gradient(ellipse 600px 400px at var(--blob-x, 50vw) var(--blob-y, 50vh), hsla(150, 60%, 50%, calc(α * var(--blob-heat, 0))), transparent 70%)` with α=0.04 for `.liquid-regular` and α=0.06 for `.liquid-card`.
- **Decision D:** liquid-glass.css utility re-pointing per the table in §Token Migration Map. Legacy `--liquid-*` vars stay defined for defensive consumption.
- **Decision E:** Tailwind class swap — replace `bg-white/{N}` with `bg-[var(--glass-{tier}-fill)]` and `backdrop-blur-{value}` with `backdrop-blur-[var(--glass-{tier}-blur)]`. NOT a migration to `.liquid-*` utility classes.
- **Decision F:** 8 plans across 4 waves (table in §Wave-able Decomposition).
- **Decision G:** KD-v9-002 escalation — if Playwright WCAG measurement on ContactForm body copy < 4.5:1, escalate `--glass-form-fill` desktop value 0.10/0.14 → 0.30, log Key Decision; auto-decided per delegation.
- **Decision H:** Anti-pattern enforcement gate — every plan must grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks.
- **Decision I:** Frozen ranges (table in §Common Pitfalls). Do NOT modify `blob.css`, `blob-engine/*`, `globals.css` token blocks, `useSpecularHighlight.ts`, `SvgRefractionDefs.tsx`, `DESIGN.md`, service pages, shadcn primitives, or `liquid-glass.css` `@a11y-layer-coverage` block.

### Claude's Discretion

- Per-component judgment for ProblemSection / WhyUsSection / PlatformSection — Tier 0 section frame vs Tier 1 cards (Decision A row 6).
- Heat-leak intensity tuning ±25% during 92-08 verification (within token budget, no Key Decision).
- FinalCTA `mix-blend-multiply` decoration — retire vs sanction (UI-SPEC flags for 92-08).
- Whether ContactSection's blue-gradient backdrop should change for blob visibility (current architecture has the form panel sitting over a vivid blue rectangle, NOT the blob field — see §Common Pitfalls).

### Deferred Ideas (OUT OF SCOPE)

- Service-page propagation (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`) → Phase 93
- shadcn primitives (`next/src/components/ui/*`) → Phase 93
- LeadFormSection form-safety → Phase 93 (mirrors Phase 92 ContactForm treatment)
- Per-route Playwright screenshot diff → Phase 93
- Lighthouse CI mobile-throttled gates → Phase 94 (HARD GATE)
- Real-device manual UAT (iPhone iOS, low-end Android, desktop tri-browser) → Phase 94 (HARD GATE)
- axe-core / Pa11y across 4 routes × 3 blob positions → Phase 94
- Brand visual review vs medicusunion.com side-by-side → Phase 94

## Project Constraints (from CLAUDE.md)

These directives have the same authority as CONTEXT.md locked decisions:

- **Stack:** Next.js + React + TypeScript + Tailwind v4 (project at v9.0). Vanilla HTML/CSS/JS is the historical base only — Phase 92 is React/Tailwind territory.
- **Language:** Russian-only copy. Phase 92 introduces zero new copy strings — preserve all existing nbsp-bound text (e.g., `MedicusUnion&nbsp;`, `за&nbsp;границей`).
- **Design:** Mobile-first, audience 45+, large type, high contrast, mobile blur ≤12px, ≤2 glass elements per viewport, dark-mode disables `backdrop-filter`.
- **Backend:** Directus 11 + PostgreSQL — out of scope for Phase 92.
- **Brand color parity:** every color must trace to medicusunion.com or medicusunion.kz. Phase 92 introduces no new colors — only re-points opacity/blur tokens.
- **Apple Liquid Glass HIG compliance:** `--liquid-blur-*` token scale (16/24/40/60px) inherited; v9.0 `--glass-*-blur` tokens clamp mobile to 12px; `prefers-reduced-{transparency,motion}` and `prefers-contrast: more` MUST be honored; `@supports` fallbacks required.
- **GSD Workflow Enforcement:** `/gsd:execute-phase` must be the entry point for plan execution; no direct Edit/Write outside the workflow.
- **Russian-only copy + subject+verb nbsp binding** (from MEMORY): all subject+verb pairs in Russian text bound with `&nbsp;` to prevent line breaks. Phase 92 must not regress this — sweeps are class-only, not copy.
- **No emojis** in writing unless requested.

## Standard Stack

### Core (already in repo — no installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4 (project at `next/src/app/globals.css` `@theme inline` block) | Class-based styling | Project standard; Phase 92 uses arbitrary-value classes `bg-[var(...)]` and `backdrop-blur-[var(...)]` |
| Next.js App Router | 14+ | RSC + CSR | All sections are server components except FAQSection, ContactForm, MobileMenu, StickyBar, HeaderClient (all `'use client'`) |
| React | 18+ | UI runtime | — |
| `lucide-react` | already installed | Icons | Frozen — no new icons in Phase 92 |
| `clsx`/`cn` (`@/lib/utils`) | already installed | Conditional class composition | Used in HeaderClient |

### Supporting (CSS layer — already exists)

| File | Purpose | Phase 92 mutation |
|------|---------|-------------------|
| `next/src/app/globals.css` | Token registry (`--mu-*`, `--liquid-*`, `--glass-*`, `--blob-*`) | NONE (frozen — Decision I) |
| `next/src/styles/liquid-glass.css` (1149 lines) | Glass utility primitives | EDIT internals of `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.stats-glass`, `.liquid-btn-secondary` per Decision D; preserve `@a11y-layer-coverage` block (lines 79–157) |
| `next/src/styles/blob.css` | Blob-field renderer rules | NONE (frozen — Decision I) |
| `next/src/styles/squircles.css` | Continuous-corner mask scale | NONE (frozen) |

### Verification tooling (no install required for Phase 92; Phase 94 territory)

| Tool | Use in Phase 92 | Notes |
|------|----------------|-------|
| Chrome DevTools Computed-style + Color Picker | Per-component fill verification + WCAG measurement on ContactForm | Manual recipe in §Validation Architecture |
| `pnpm build` | Compile gate (Tailwind class generation; no broken arbitrary-value strings) | Run after each plan |
| `grep -rn 'backdrop-filter' next/src/components/sections/` after CTA sweep | CTA opacity invariant audit | Pattern in §Code Examples |
| Playwright (Phase 94 territory) | DOM `getComputedStyle()` per-component opacity check; WCAG contrast at heat=0/heat=1 | Phase 92 records baseline only |
| `prefers-reduced-*` toggle (real OS, not DevTools emulation) | a11y verification | Phase 94 hard gate; Phase 92 marks rows "pending live-toggle" |

### Component Inventory (every Phase 92 target with file path + current glass-related class line)

**Chrome (4 files in `next/src/components/layout/`):**

| Component | File path | Current glass class lines | Hover state? | Phase 92 target tier |
|-----------|-----------|---------------------------|--------------|----------------------|
| `HeaderClient` | `HeaderClient.tsx` | line 17 default `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%]`; line 19 scrolled `bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%]` | scroll-state swap (no `:hover`) | Tier 0 |
| `MobileMenu` (burger + drawer) | `MobileMenu.tsx` | line 38 burger `bg-white/55 backdrop-blur-xl backdrop-saturate-[180%]`; line 47 backdrop overlay `bg-mu-text-900/35 backdrop-blur-sm`; line 52 drawer `bg-white/68 backdrop-blur-[80px] backdrop-saturate-[200%]` | yes (line 60 `hover:bg-white/45`) | Tier 0 |
| `StickyBar` | `StickyBar.tsx` | line 44 `bg-white/68 backdrop-blur-3xl` | none (CTA inside is opaque) | Tier 0 |
| `Footer` | `Footer.tsx` | line 18 wrapper `bg-white/60 backdrop-blur-3xl`; lines 89, 100 inner contact icons `bg-white/60 backdrop-blur-md` | none | Tier 0 |
| `Header.tsx` (legacy?) | `Header.tsx` | line 53 phone CTA gradient (opaque); line 14 wordmark gradient (opaque) | — | **VERIFY whether rendered** |

**Index sections (11 files in `next/src/components/sections/`):**

| Component | File path | Current glass class line(s) | Hover state? | Tier (default → hover) |
|-----------|-----------|---------------------------|--------------|------------------------|
| `HeroHub` | `HeroHub.tsx` | line 15 pill `bg-white/40 backdrop-blur-[20px]`; line 56 secondary CTA `bg-white/50 backdrop-blur-[20px] hover:bg-white/60`; line 139 credibility badge `bg-white/75 backdrop-blur-[40px]`; lines 94/103/115 over-photo controls `bg-mu-text-900/55 backdrop-blur-md` (NOT glass — preserve) | yes on secondary CTA | Tier 0 frame; Tier 1 on credibility badge; over-photo chrome **preserved as-is** |
| `StatsBar` | `StatsBar.tsx` | line 49 mobile wrapper `bg-white/60 backdrop-blur-2xl sm:bg-transparent sm:backdrop-blur-none`; line 56 desktop card `sm:bg-white/60 sm:backdrop-blur-2xl sm:hover:bg-white/70` | yes desktop only (`sm:hover:bg-white/70`) | mobile wrapper Tier 0; desktop card Tier 1 → Tier 2 hover |
| `ServicesGrid` | `ServicesGrid.tsx` | line 80 pill `bg-white/40 backdrop-blur-xl`; line 104 card `bg-white/60 backdrop-blur-2xl hover:bg-white/70`; line 115 nested price badge `bg-white/50 backdrop-blur-md` | yes (line 104) | Tier 1 → Tier 2 hover; pill Tier 1 (decorative); nested badge — review for ≤2 glass nesting |
| `ProcessSection` | `ProcessSection.tsx` | line 107 card `bg-white/65 backdrop-blur-2xl`; line 117 inner icon chip `bg-white/55 backdrop-blur-md` | yes (line 107) | Tier 1 → Tier 2 hover; inner chip is decorative |
| `ProblemSection` | `ProblemSection.tsx` | line 102 card `bg-white/60 backdrop-blur-2xl`; line 105 inner icon `${card.iconBg} backdrop-blur-xl` | yes (line 102) | Tier 1 → Tier 2 hover (per Decision A judgment) |
| `WhyUsSection` | `WhyUsSection.tsx` | line 13 section pill `bg-white/40 backdrop-blur-xl`; lines 28/45/62/79 advantage icon chips `${color} backdrop-blur-xl`; lines 99/102/107 image frames `border-white/50 backdrop-blur-2xl bg-white/20`; line 110 stat card `bg-white/40 backdrop-blur-2xl` | none (decorative wrappers only) | Mixed: pill Tier 1, icon chips decorative-stay, image frames Tier 0, stat card Tier 1 |
| `ClinicsSection` | `ClinicsSection.tsx` | line 130 country card `bg-white/60 backdrop-blur-2xl hover:shadow-glass-lg` | yes | Tier 1 → Tier 2 hover; preserve flag SVG colors |
| `PlatformSection` | `PlatformSection.tsx` | line 15 single panel `bg-white/60 backdrop-blur-2xl` | none | Tier 0 (single full-width panel) |
| `ReviewsSection` | `ReviewsSection.tsx` | line 77 card `bg-white/60 backdrop-blur-2xl hover:shadow-glass-lg` | yes (shadow-only) | Tier 1 → Tier 2 hover |
| `FAQSection` | `FAQSection.tsx` | line 115 closed item `bg-white/60 backdrop-blur-2xl`; line 119 open-button `hover:bg-white/80` | yes | closed Tier 1, open Tier 2 (see §Common Pitfalls — open-state binding) |
| `FinalCTA` | `FinalCTA.tsx` | line 8 frame `bg-white/60 backdrop-blur-3xl`; **line 14 anti-pattern #8** `bg-mu-blue/30 ... mix-blend-multiply`; line 26 CTA gradient (opaque); line 33 phone CTA glass `bg-white/60 backdrop-blur-xl hover:bg-white/80` | yes (phone CTA only) | frame Tier 0; phone CTA Tier 3 → button-hover; **retire mix-blend-multiply** |

**Form (2 files):**

| Component | File path | Current glass class line(s) | Phase 92 target |
|-----------|-----------|---------------------------|-----------------|
| `ContactSection` | `ContactSection.tsx` | line 26 outer gradient `bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue` (NOT glass — preserve or replace per 92-07 judgment); lines 35/36 decorative blurs (preserve); lines 60/63/83 trust-signal cards `bg-white/10 backdrop-blur-md` (over the blue gradient, NOT page blob); line 120 form panel **`bg-white p-6` opaque** | Outer chrome: Decision A says Tier 0; in current layout the outer is gradient, not Tier 0 glass — flag for 92-07 judgment. Form panel: migrate from opaque white to Tier 2 form-fill |
| `ContactForm` | `ContactForm.tsx` | line 111 success-overlay `bg-white/82 backdrop-blur-3xl` (preserve opaque-leaning); line 128 input `bg-white/50 backdrop-blur-md focus:bg-white/72`; line 247 submit gradient (opaque) | inputs → `bg-white` opaque; submit unchanged; success overlay preserved |

**CTA grep targets (every component carrying `from-mu-blue to-mu-accent-blue` or `from-mu-cta-from-v6 to-mu-cta-to-v6`):**

| File | Line | Type |
|------|------|------|
| `HeroHub.tsx` | 48 | primary CTA |
| `MobileMenu.tsx` | 94 | drawer CTA |
| `StickyBar.tsx` | 58 | sticky-bar CTA |
| `ContactForm.tsx` | 247 | submit CTA |
| `FinalCTA.tsx` | 26 | primary CTA |
| `Header.tsx` | 53 | phone CTA (verify-rendered) |
| `service/ServiceHero.tsx` | 50 | (Phase 93 — out of scope) |
| `consultations/ConsultationPricing.tsx` | 43 | (Phase 93) |
| `checkup/CheckupB2B.tsx` | 85 | (Phase 93) |

Total **5 CTAs in Phase 92 scope** (excluding legacy Header.tsx). All currently use `bg-gradient-to-r from-mu-blue to-mu-accent-blue` Tailwind utility — these consume `--color-mu-blue` and `--color-mu-accent-blue` (NOT the v6 CTA gradient `--mu-cta-from`/`--mu-cta-to`). UI-SPEC notes a discrepancy: DESIGN.md `## v9.0 Custom Rules` master list mentions v6 gradient (`from-mu-cta-from-v6 to-mu-cta-to-v6`) but actual `/` route components use `from-mu-blue to-mu-accent-blue`. Both are opaque-forever; the grep must check both patterns.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind arbitrary-value classes (Decision E) | Migrate every section to `.liquid-card` / `.liquid-regular` utility wrappers | Larger code change; violates Decision E (locked); less granular per-component tier control |
| `radial-gradient(... at var(--blob-x) var(--blob-y) ...)` (Decision C, shipped) | JS-driven `style={{ backgroundImage: ... }}` per element | Per-frame React updates → anti-pattern #3 (per-frame React useState from pointer events) |
| ContactForm panel keeps current opaque white (current state) | Migrate to Tier 2 transparent (Decision B) | Locked — Decision B is the contract. The risk is contrast failure → KD-v9-002 escalation path exists |
| Retire `mix-blend-multiply` on FinalCTA (UI-SPEC recommendation) | Sanction it as branded decoration | Anti-pattern #8 violation if kept; recommendation is retire — flag in 92-08 |

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Browser Document                             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  <html data-blob-mode="cursor|ambient|static|hidden|dark">     │  │
│  │      :root style {                                             │  │
│  │        --blob-x: ${px};   ← written each frame by Phase 91      │  │
│  │        --blob-y: ${px};      engine (FROZEN)                    │  │
│  │        --blob-heat: 0..1;                                       │  │
│  │        --glass-section-fill: rgba(255,255,255,0.06);            │  │
│  │        --glass-card-fill:    rgba(255,255,255,0.10);            │  │
│  │        --glass-form-fill:    rgba(255,255,255,0.14);            │  │
│  │        --glass-button-fill:  rgba(255,255,255,0.12);            │  │
│  │        --glass-{tier}-blur:  clamp(12px, fluid, ceiling);       │  │
│  │      }                                                          │  │
│  │  </html>                                                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              ▲                                       │
│                              │ var() reads                           │
│                              │                                       │
│  ┌───────────────────────────┴────────────────────────────────────┐  │
│  │  z-0  .living-blob-field (Phase 91, FROZEN)                    │  │
│  │       Canvas 2D — 4 sublayers (core/body/halo/glint)           │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  z-1..10  <main> + glass surfaces                              │  │
│  │                                                                │  │
│  │   PHASE 92 SWEEP TARGETS (Tailwind class swap):                │  │
│  │   ┌──────────────────────────────────────────────────────┐     │  │
│  │   │ HeroHub (Tier 0 frame)                               │     │  │
│  │   │ StatsBar (Tier 0 mobile wrapper / Tier 1 desktop)    │     │  │
│  │   │ ServicesGrid (Tier 1 cards / Tier 2 hover)           │     │  │
│  │   │ ProcessSection · ProblemSection · WhyUsSection       │     │  │
│  │   │ ClinicsSection · PlatformSection · ReviewsSection    │     │  │
│  │   │ FAQSection (closed Tier 1 / open Tier 2)             │     │  │
│  │   │ ContactSection + ContactForm (FORM-SAFETY)           │     │  │
│  │   │ FinalCTA (Tier 0 frame; retire mix-blend-multiply)   │     │  │
│  │   │                                                      │     │  │
│  │   │ Each: bg-white/{N} → bg-[var(--glass-{tier}-fill)]   │     │  │
│  │   │       backdrop-blur-{x} → backdrop-blur-[var(...)]   │     │  │
│  │   └──────────────────────────────────────────────────────┘     │  │
│  │                                                                │  │
│  │   PHASE 92 CSS UTILITY EDIT (single file):                     │  │
│  │   ┌──────────────────────────────────────────────────────┐     │  │
│  │   │ liquid-glass.css                                     │     │  │
│  │   │   .liquid-regular (Tier 0)  · .liquid-card (Tier 1)  │     │  │
│  │   │   .liquid-nav (Tier 0)      · .stats-glass (Tier 1)  │     │  │
│  │   │   .liquid-btn-secondary (Tier 3)                     │     │  │
│  │   │                                                      │     │  │
│  │   │   Heat-leak rule SHIPPED commit 9c93b9f for          │     │  │
│  │   │   .liquid-card (α 0.06) and .liquid-regular (α 0.04) │     │  │
│  │   └──────────────────────────────────────────────────────┘     │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  z-50  HeaderClient · StickyBar · MobileMenu                   │  │
│  │        (sticky chrome — Tier 0)                                │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  z-100+  Modals (none in Phase 92 scope)                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  CTA invariant (verified by grep, NOT class swap):                  │
│    bg-gradient-to-r from-mu-blue to-mu-accent-blue                  │
│    → opaque, NEVER receives backdrop-filter, NEVER swept            │
└──────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure (no changes — verification only)

```
next/src/
├── app/
│   ├── globals.css         # FROZEN (token registry)
│   └── page.tsx            # imports 12 sections — read-only reference
├── styles/
│   ├── liquid-glass.css    # Plan 92-01 EDIT (Decision D table)
│   ├── blob.css            # FROZEN
│   └── squircles.css       # FROZEN
├── lib/
│   └── blob-engine/        # FROZEN
├── components/
│   ├── layout/             # Plan 92-02 EDIT (4 files)
│   ├── sections/           # Plans 92-03..08 EDIT (12 files in this folder + nested service/ subfolders FROZEN)
│   └── ui/                 # FROZEN (Phase 93 territory)
```

### Pattern 1: Tailwind arbitrary-value token consumption (Decision E)

**What:** Replace opacity-suffix and arbitrary-blur Tailwind utilities with `var()` arbitrary values.
**When to use:** Every section/chrome/card surface fill and blur in Phase 92 scope.
**Example:**

```tsx
// Source: 92-CONTEXT.md Decision E
// BEFORE (current ServicesGrid line 104):
<Link className="bg-white/60 backdrop-blur-2xl ... hover:bg-white/70">

// AFTER (Phase 92 sweep):
<Link className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] ... hover:bg-[var(--glass-form-fill)]">
```

Note: Tier 2 hover uses `--glass-form-fill` token (0.14 desktop / 0.18 mobile) — this is the same token name the form panel uses, but applied to a card-hover surface. UI-SPEC clarifies anti-pattern #4 (fills > 0.16) does NOT block this because Tier 2 hover on cards reads desktop 0.14 (under 0.16) and mobile 0.18 (the form-safety exception family).

### Pattern 2: Heat-leak gradient composition (Decision C, shipped commit 9c93b9f)

**What:** Compose `radial-gradient` as the FIRST `background-image` layer above the base fill.
**Where:** `.liquid-card` (α 0.06) and `.liquid-regular` (α 0.04) in `liquid-glass.css`.
**Example (current code, lines 174–192 of liquid-glass.css):**

```css
/* Source: liquid-glass.css commit 9c93b9f */
.liquid-regular {
  background:
    radial-gradient(
      ellipse 600px 400px at var(--blob-x, 50vw) var(--blob-y, 50vh),
      hsla(150, 60%, 50%, calc(0.04 * var(--blob-heat, 0))),
      transparent 70%
    ),
    linear-gradient(to bottom, var(--liquid-bg), var(--liquid-bg)),
    linear-gradient(to bottom, hsla(...), hsla(...));
  /* ... */
}
```

**Plan 92-01's job:** verify these rules survive any other edit, AND extend the same pattern to `.stats-glass` if Decision D's re-pointing implies it (UI-SPEC table maps `.stats-glass` to Tier 1 = `--glass-card-fill`, so heat-leak at α 0.06 is consistent). Per Decision E, components that don't use `.liquid-card` utility (most of `/` route) won't get heat-leak via the utility class — they get it via the page-wide blob's optical effect through their `backdrop-filter`. The radial-gradient *only* applies to surfaces that actually use `.liquid-card` or `.liquid-regular`.

**This is a contradiction the planner must understand:** §5 of the success criteria says "heat-leak `radial-gradient` rules added to `.liquid-card` + `.liquid-regular` so glass surfaces optically respond to blob position" — but the swept index components do NOT use `.liquid-card`. They use direct Tailwind classes (Decision E). So the heat-leak gradient applies through the wrapper `.liquid-card-wrap`-style consumers OR not at all on `/` route. The optical response on Phase 92's index sections comes from `backdrop-filter` blurring the blob behind, NOT from the `radial-gradient` layer. **Plan 92-08 verification recipe must distinguish these two mechanisms.**

### Pattern 3: Form-safety panel + opaque inputs (Decision B)

**What:** Translucent form panel + opaque inputs over a blur-influenced background.
**When:** ContactForm + ContactSection (Phase 92), LeadFormSection (Phase 93 territory).
**Example:**

```tsx
// Source: 92-CONTEXT.md Decision B + ContactForm.tsx line 128
// BEFORE:
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-md focus:bg-white/72 ...';

// AFTER:
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white focus:bg-white ...';
// Note: drop backdrop-blur-md (no glass on inputs) and the focus opacity ramp.
// Keep focus:ring-4 focus:ring-mu-blue/20 — outline is outside the box.

// ContactForm parent panel (currently ContactSection.tsx line 120 opaque white):
// BEFORE: <div className="rounded-[2rem] border border-white/40 bg-white p-6 ...">
// AFTER:  <div className="rounded-[2rem] border border-white/40 bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6 ...">
```

### Anti-Patterns to Avoid (already enumerated in DESIGN.md ## v9.0 Anti-Patterns)

- **#4 fills > 0.16:** never write `bg-white/{17..99}` arbitrary opacity for non-form surfaces. Tier 3 button at exactly 0.16 mobile is the single non-form exception.
- **#5 green tint statically painted on cards:** never write `bg-mu-green-{50,100}/...` directly on a card surface. Heat-leak gradient is allowed because it's blob-position-driven and gated by `--blob-heat`.
- **#6 animated `backdrop-filter` blur:** never `transition: backdrop-filter` or `transition-[backdrop-filter]`. Heat-leak is on `background-image`, NOT on `backdrop-filter` — compliant.
- **#8 `mix-blend-mode` on glass:** FinalCTA line 14 currently violates this — flag for retirement in 92-08.
- **#11 `backdrop-filter` on `.living-blob-field`:** Phase 92 doesn't touch blob-field — compliant by no-op.
- **#12 mobile blur > 12px:** all `--glass-*-blur` tokens clamp to 12px on mobile via `clamp(12px, fluid-vw, ceiling)`. Compliant by token consumption.
- **#13 > 2 glass layers per viewport:** ServicesGrid 4-cards-on-desktop is the documented Phase 82 exception. ServicesGrid line 115 nested price-badge `bg-white/50 backdrop-blur-md` inside a card may push to 2 layers — verify in 92-04. StatsBar Phase 82 mobile-1-wrapper / desktop-4-cards pattern is the reference implementation.
- **#14 new glass class without `@a11y-layer-coverage` registration:** Phase 92 adds NO new classes — Decision E is class swap, not new utility. Compliant by no-op.
- **#15 cheat-passing a11y verification:** Phase 92 plans must mark a11y rows "pending live-toggle (Phase 94)" — never "verified".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-frame React updates for blob position | `useEffect` + `setState` on pointer events | Phase 91 engine writing `:root` style + CSS `var()` | Per-frame React state regresses INP/LCP (anti-pattern #3, TZ §16) |
| Animated transparency/blur on hover | `transition: backdrop-filter` or framer-motion blur springs | Static `backdrop-filter` value + `filter: brightness()` ramp on hover | Anti-pattern #6 GPU-poisons mobile Safari |
| Custom WCAG contrast measurement | DIY contrast-ratio computation in JS | Chrome DevTools Color Picker or axe-core (Phase 94) | Composite-background contrast over a blur-affected surface is non-trivial; tool already exists |
| Custom accordion height animation | DIY ResizeObserver + height interpolation | Existing `transition-[max-height] duration-300` (FAQSection.tsx line 141) | Already shipped Phase 71-era pattern; no library needed |
| Localized blob dimming | Custom IntersectionObserver writing `--blob-dim` runtime var | EITHER an absolute-positioned `::after` dimmer on form panel (CSS-only, no engine touch) OR defer if the current ContactSection blue-gradient backdrop already isolates the form (likely the case — see §Common Pitfalls) | Engine modification is frozen (Decision I); CSS-only is sufficient if architecture review confirms the form isn't actually over the blob field |
| New CSS class for token consumption | Add `.glass-section`, `.glass-card`, etc. utility classes | Tailwind arbitrary-value `bg-[var(...)]` (Decision E) | New classes would require `@a11y-layer-coverage` registration (anti-pattern #14); class-swap pattern avoids it |

**Key insight:** Phase 92 is *not* an architecture project — it's a careful sweep over an architecture that's already in place. Hand-rolling new patterns (utility classes, animations, contrast tooling, dimming runtime vars) creates surface area for regressions; staying within Decision E + Decision C means the work fits the existing a11y wiring and the existing browser-fallback ladder.

## Common Pitfalls

### Pitfall 1: Heat-leak gradient is not visible on `/` route's swept components

**What goes wrong:** Plan 92-01 ships heat-leak rules on `.liquid-card` / `.liquid-regular`, but `/` route components use Decision E direct Tailwind classes — they never apply `.liquid-card`. The visual "blob warms cards" effect on `/` is delivered solely by `backdrop-filter` blurring the actual blob underneath, not by the radial-gradient layer.
**Why it happens:** Decision E (class swap, not migration to utility classes) and Decision C (heat-leak on utility classes) are independently correct but produce a gap where index components don't carry the radial-gradient. The success criterion (5) says "visual confirmation of optical response to blob movement" — this is satisfied by `backdrop-filter`'s natural blur of the moving blob, but a reviewer expecting the explicit radial-gradient response might mark it failed.
**How to avoid:** Plan 92-08 verification recipe must record TWO measurements per component: (a) `backdrop-filter` blur is reading the live `--blob-x/y` (composite repaint), (b) heat-leak `background-image` `radial-gradient` is OR is not present (only present on `.liquid-card`/`.liquid-regular` consumers — currently 0 components on `/` route after Decision E sweep). Document the dual mechanism in 92-08 verification report.
**Warning signs:** A "the blob doesn't warm the cards" complaint after sweep — the actual fix is to lift `--blob-heat` or to apply `.liquid-card` utility to a couple of representative cards (not in Decision E, but a tunable). Decide before 92-08 whether to amend Decision E for hero badge and one or two card families to inherit `.liquid-card`.

### Pitfall 2: ContactSection form panel does NOT sit over the page blob

**What goes wrong:** Decision B step 5 says "localized blob dimming when blob centroid `var(--blob-x/y)` enters form bounds." But ContactSection's outer wrapper (line 26) is `bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue py-16 …` — a full-bleed BLUE GRADIENT that visually occludes the blob field underneath. The `bg-white/10 backdrop-blur-md` trust-signal cards (lines 60, 83) are blurring the blue gradient, NOT the blob. The form panel (line 120 `bg-white p-6`) sits over the blue gradient, NOT over the blob field.
**Why it happens:** ContactSection was built in Phase 84 (v8.0 era) before the v9.0 blob existed. The blue gradient was the dominant background. Decision B was authored against an idealized layout where the blob is everywhere; the actual layout has an opaque blue rectangle covering it.
**How to avoid:** Plan 92-07 has two paths:
- **Path A (preserve current architecture):** Keep the blue gradient on ContactSection. Accept that "localized blob dimming" is a no-op because the blob isn't visible behind the form. Form-fill swap from `bg-white` → `bg-[var(--glass-form-fill)]` becomes the form sitting over the blue gradient — contrast measurement is over the blue gradient, not the blob. WCAG check is still required.
- **Path B (change architecture):** Drop the blue gradient on ContactSection, let the blob bleed through. Then localized dimming becomes meaningful and the form-fill swap works as designed. Higher visual change; needs design review.
- **Recommendation: Path A**, because (i) Decision I freezes service pages and (ii) Path B is a v9.0 design departure that should be a separate Key Decision. Path A is the conservative read of Decision B — the form-fill token swap and contrast verification still happen; the dimming step is documented as "n/a (panel is over a static gradient)" rather than implemented.
**Warning signs:** A plan that proposes implementing IntersectionObserver-driven dimming, OR that proposes touching `blob-engine/*` to compute distance-to-form (engine is frozen — Decision I).

### Pitfall 3: `bg-white/82` and `bg-white/68` are 0.82 and 0.68 respectively — over the 0.16 ceiling

**What goes wrong:** ContactForm.tsx line 111 (success overlay) uses `bg-white/82`, and `StickyBar.tsx` line 44 uses `bg-white/68`, and `MobileMenu.tsx` line 52 uses `bg-white/68`, and `Footer.tsx` line 18 uses `bg-white/60`, etc. None of these conform to v9.0 Tier 0 (0.06 desktop / 0.10 mobile) directly — most stay much higher. After Decision E sweep, every one of these becomes `bg-[var(--glass-section-fill)]` = 0.06/0.10. That is a ~6× drop in opacity. The mental model "Tier 0 = chrome stays mostly opaque" is wrong; v9.0 chrome is genuinely transparent.
**Why it happens:** v8.0 chrome was tuned at 0.6–0.8 fill on a white-ish backdrop; v9.0 expects a vivid blob behind glass and pulls chrome down to 0.06. The dramatic transparency is deliberate per TZ §9.
**How to avoid:** Plan 92-02 (chrome) and 92-08 (verification) must visually verify that chrome remains legible at 0.06–0.10 fill over the blob. Specifically:
- HeaderClient text contrast: nav links text vs. composite background at heat=0 (worst dark blob position).
- StickyBar phone number: `text-mu-text-900` over Tier 0 fill at all blob positions.
- Footer copy: small (`text-sm`) and very small (`text-xs`) text vs Tier 0 fill.
- Success-overlay (ContactForm line 111 `bg-white/82`): UI-SPEC says "preserve" — this is a deliberate exception to the sweep (NOT a Tier-0 swap). Document in 92-07.
**Warning signs:** A reviewer screenshots showing illegible header/footer text at heat=0; or a "header looks broken" complaint. Recovery: locally bump Tier 0 desktop fill to 0.10 (still under 0.16 ceiling) — within token-tuning budget, no Key Decision.

### Pitfall 4: `Header.tsx` may be dead code

**What goes wrong:** Two header files exist: `HeaderClient.tsx` (used by `app/layout.tsx`, via grep) and `Header.tsx` (legacy server wrapper). If `Header.tsx` is no longer rendered, sweeping its CTA gradient (line 53) is dead-code work — but missing it if it IS rendered means GLASS-01 fails.
**Why it happens:** Refactor history left two files; the planner can't tell from filesystem alone.
**How to avoid:** Plan 92-02 must `grep -rn 'from.*layout/Header' next/src/app/` before sweeping `Header.tsx`. If unimported, mark for deletion in a follow-up cleanup quick task; do NOT include in Phase 92 sweep. If imported, sweep CTA grep includes it.
**Warning signs:** `grep` shows `Header` is imported only from `HeaderClient.tsx` itself, OR no import at all — confirms dead code.

### Pitfall 5: WhyUsSection's image frames carry `backdrop-blur-2xl bg-white/20`

**What goes wrong:** WhyUsSection.tsx lines 99/102/107/110 wrap `<Image>` elements in `border-[6px] border-white/50 backdrop-blur-2xl bg-white/20`. These are decorative photo frames, NOT glass cards in the tier sense. Sweeping them to Tier 0/1 may break the image presentation (the `bg-white/20` is the visible-fill behind a translucent border — without it, the image edge looks unframed).
**Why it happens:** The frames use glass aesthetic without participating in the tier hierarchy.
**How to avoid:** Plan 92-05 (WhyUsSection) treats these frames as decorative and either (a) leaves them at current values OR (b) swaps to `bg-[var(--glass-section-fill)]` and visually verifies the photo border still reads. Default to leave-alone with a comment in the plan note: "image frames are decorative, not tier-bound; sweep skipped per per-component judgment (Decision A row 6)."
**Warning signs:** A reviewer says "the photos look unframed now" — recovery is to revert that section to `bg-white/20` and document as a sanctioned exception.

### Pitfall 6: `--blob-x/y` are written in `px`, but CSS fallback is `vw/vh` — different units

**What goes wrong:** `radial-gradient(... at var(--blob-x, 50vw) var(--blob-y, 50vh), ...)` uses `vw/vh` as fallback but the engine writes `px` at runtime. There's no actual computation conflict (each frame has either a px or a vw value, not both), but during pre-engine-start frames OR when the engine is in a fallback mode that doesn't write `--blob-x/y` ("static" or "hidden"), the gradient renders at 50vw/50vh — center of viewport.
**Why it happens:** Engine writes `${state.core.x}px` (line 359 of `next/src/lib/blob-engine/index.ts`); CSS fallback is `50vw` (chosen for graceful degradation when engine never starts).
**How to avoid:** No action required — this is intended behavior. But Plan 92-01 verification should explicitly note: "heat-leak gradient renders at viewport center pre-engine-start; this matches static/hidden mode behavior; no defect." Don't silently swap units.
**Warning signs:** A test that asserts heat-leak position via DOM inspection in `static` mode and finds `50vw 50vh` — that's correct, not a bug.

### Pitfall 7: ServicesGrid line 115 nested badge inside line 104 card → 2 glass layers stacked

**What goes wrong:** ServicesGrid has a `bg-white/60 backdrop-blur-2xl` card (line 104) containing a `bg-white/50 backdrop-blur-md` price badge (line 115). After sweep both become Tier 1 + Tier 3 glass = 2 stacked glass layers per card. With 4 cards visible per desktop viewport, that's 8 glass layers — way over the ≤2 per viewport rule.
**Why it happens:** The badge is decorative and was not authored against the budget.
**How to avoid:** Plan 92-04 either (a) drops the badge's `backdrop-blur-md` and keeps just `bg-white/50` as a flat decorative chip (simpler, recommended), OR (b) verifies the rule's "per viewport" interpretation (Phase 82 sanctioned 4 sibling cards at desktop — can a nested badge count differently?). Default to (a) — the price badge contrast goal is "stand out from card body," not "be a glass surface."
**Warning signs:** A `≤2 glass siblings per viewport` Playwright check (Phase 94) fails on `/` route specifically at the ServicesGrid scroll position.

### Pitfall 8: FAQSection open/closed state binding

**What goes wrong:** FAQSection.tsx line 115 carries the SAME class string regardless of open/closed state. The current code has only `bg-white/60 backdrop-blur-2xl` — the question button gets `hover:bg-white/80` (line 119). Decision A says closed Tier 1, open Tier 2. The state-bound class needs to be added during sweep.
**Why it happens:** The current accordion is closed/open-uniform; v9.0 wants the open state to lift fill.
**How to avoid:** Plan 92-06 swaps line 115 to:

```tsx
className={`backdrop-blur-[var(--glass-card-blur)] ${isOpen ? 'bg-[var(--glass-form-fill)]' : 'bg-[var(--glass-card-fill)]'} ...`}
```

The hover on the question button should ramp to Tier 2 also, so the rest state of the open item matches the hover state of the closed item. Preserve `transition-[max-height]` (line 141) — accordion expand/collapse animation is unchanged.
**Warning signs:** Open FAQ item visually identical to closed — sweep didn't bind to `isOpen`.

## Code Examples

Verified patterns drawn from current files (file paths absolute):

### Class swap example — ServicesGrid card (current → Phase 92)

```tsx
// Source: /Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/ServicesGrid.tsx line 104
// CURRENT:
<Link
  className="group flex h-full flex-col rounded-[2rem] border border-glass-border bg-white/60 p-6 shadow-glass backdrop-blur-2xl transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-glass-border-strong hover:bg-white/70 hover:shadow-glass-lg sm:p-7"
>

// PHASE 92 (Decision E sweep):
<Link
  className="group flex h-full flex-col rounded-[2rem] border border-glass-border bg-[var(--glass-card-fill)] p-6 shadow-glass backdrop-blur-[var(--glass-card-blur)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-glass-border-strong hover:bg-[var(--glass-form-fill)] hover:shadow-glass-lg sm:p-7"
>
```

Notes: `border-glass-border`, `shadow-glass`, `shadow-glass-lg`, `transition-*`, `duration-300`, layout, and CTA-related classes are UNCHANGED.

### CTA grep audit (every component, all CTA gradient variants)

```bash
# Source: 92-CONTEXT.md Decision H + DESIGN.md ## v9.0 Custom Rules CTA master list.
# Phase 92 plans run this BEFORE marking GLASS-02/04/07/08 complete.

# 1. Find all CTA gradient occurrences:
grep -rn "from-mu-blue to-mu-accent-blue\|from-mu-cta-from\|from-mu-cta-to-v6\|btn-primary\|liquid-btn-primary" \
  next/src/components/sections/ \
  next/src/components/layout/

# 2. For each match, verify NO backdrop-filter is anywhere on the same element:
# Bad pattern (regression):
#   bg-gradient-to-r from-mu-blue to-mu-accent-blue ... backdrop-blur-{anything}
# Bad pattern (regression):
#   bg-gradient-to-r ... bg-[var(--glass-{tier}-fill)]
# Good pattern:
#   bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white shadow-... transition-...

# 3. Phase 92 in-scope CTAs (5):
#    HeroHub.tsx:48, MobileMenu.tsx:94, StickyBar.tsx:58, ContactForm.tsx:247, FinalCTA.tsx:26
#    + maybe Header.tsx:53 (if rendered — see Pitfall 4)
```

### Heat-leak rule (already shipped, verify-only for Plan 92-01)

```css
/* Source: /Users/mikhail/Projects/Medicus_video_consult-landing/next/src/styles/liquid-glass.css commit 9c93b9f */
/* .liquid-card lines 340-347; .liquid-regular lines 174-181 */
.liquid-card {
  /* ... isolation, position ... */
  background:
    /* heat-leak (Phase 92 Decision C) */
    radial-gradient(
      ellipse 600px 400px at var(--blob-x, 50vw) var(--blob-y, 50vh),
      hsla(150, 60%, 50%, calc(0.06 * var(--blob-heat, 0))),
      transparent 70%
    ),
    /* base fill */
    linear-gradient(to bottom, var(--liquid-bg), var(--liquid-bg)),
    /* tint */
    linear-gradient(to bottom, hsla(...), hsla(...));
  /* ... backdrop-filter, box-shadow ... */
}
```

Plan 92-01 verifies (a) the rule is at the FIRST background-image layer, (b) the α multiplier matches Decision C (0.04 for `.liquid-regular`, 0.06 for `.liquid-card`), (c) the rule survives Decision D's re-pointing of `--liquid-bg` → `var(--glass-{tier}-fill)`.

### Form-safety panel sweep (ContactSection + ContactForm)

```tsx
// Source: /Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/ContactSection.tsx line 120
// CURRENT (opaque white panel):
<div className="rounded-[2rem] border border-white/40 bg-white p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
  <ContactForm />
</div>

// PHASE 92 Path A (preserve blue gradient backdrop, swap form-panel to Tier 2):
<div className="rounded-[2rem] border border-white/40 bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
  <ContactForm />
</div>

// Source: /Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/ContactForm.tsx line 128
// CURRENT (semi-transparent inputs):
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-md focus:bg-white/72 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner';

// PHASE 92 (opaque inputs per Decision B step 3):
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner';
// Removed: bg-white/50, backdrop-blur-md, focus:bg-white/72.
// Removed background-color from transition list (no longer animated).
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `bg-white/{42,60,68,82}` static fills | `bg-[var(--glass-{section,card,form,button}-fill)]` 4-tier tokens | Phase 90 (FND-02), Phase 92 sweep | Single source of truth; mobile-clamped blur |
| `backdrop-blur-{md,xl,2xl,3xl}` static blurs | `backdrop-blur-[var(--glass-{tier}-blur)]` token-clamped | Phase 90, Phase 92 sweep | Mobile auto-clamps to 12px |
| Static `MeshBackground` decorative gradient | `LivingBlobField` Canvas 2D + `--blob-x/y/heat` runtime | Phase 90 (FND-06: removed MeshBackground) + Phase 91 (engine) | Glass surfaces optically respond to cursor |
| `mix-blend-multiply` decorative blob (FinalCTA line 14) | retire in Plan 92-08 (anti-pattern #8) | Phase 92 | Removes unpredictable contrast |
| Per-frame React state for blob position | rAF + `setProperty('--blob-*', ...)` (Phase 91 engine, frozen) | Phase 91 | INP/LCP green |

**Deprecated/outdated:**
- `--liquid-bg: rgba(255,255,255,0.42)` — STAYS in `globals.css` for defensive consumption (Decision D explicitly preserves), but new components never reference it. Phase 92 re-points the utility class internals away from it.
- `MeshBackground.tsx` — DELETED in Phase 90 P04.
- `bg-white/{>0.16}` for surfaces under v9.0 sweep — replaced by `--glass-*-fill` ≤0.16 (cards) / 0.18 (form mobile / Tier 2 hover).

## Assumptions Log

All major claims in this research are sourced directly from files I read in this session. The following items are flagged for confirmation:

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Header.tsx` (vs `HeaderClient.tsx`) is dead code or rendered only in legacy paths | Pitfall 4, Component Inventory | Low — Plan 92-02 explicitly greps before sweeping; risk is missing GLASS-01 if Header.tsx IS rendered |
| A2 | Decision E components (most of `/` route) do NOT receive heat-leak `radial-gradient` because they don't use `.liquid-card` utility class — optical response comes from `backdrop-filter` blurring the live blob | Pitfall 1, Pattern 2 | Medium — if reviewer expects radial-gradient response specifically on every section, this is a contract clarification not a defect; document in 92-08 |
| A3 | ContactSection's blue gradient (line 26) blocks blob visibility behind the form, making "localized blob dimming" (Decision B step 5) effectively n/a in current architecture | Pitfall 2 | Medium — could surface in 92-07 review; Path A recommendation stays conservative; if reviewer rejects, escalate to design Key Decision |
| A4 | The `bg-gradient-to-r from-mu-blue to-mu-accent-blue` Tailwind utility (used by all 5 in-scope CTAs) consumes `--color-mu-blue` and `--color-mu-accent-blue` from `globals.css @theme inline`, NOT the v6 `--mu-cta-from`/`--mu-cta-to` tokens. CTA gradient color value differs from DESIGN.md's "v6 CTA gradient master list" wording | UI-SPEC notes; Standard Stack > CTA grep targets | Low — both tokens are opaque-forever; only impacts grep pattern selection |
| A5 | FAQSection's `transition-[max-height]` accordion animation pattern (line 141) is sufficient for "smooth-anim accordion preserved" wording in success criterion 2 — no library involved | Pitfall 8, Architecture Patterns | Low — visual review will catch any regression; 92-06 task is class-swap only, animation untouched |
| A6 | Token math: Tier 2 hover on cards using `--glass-form-fill` (0.14 desktop / 0.18 mobile) doesn't violate anti-pattern #4 because the desktop value is ≤0.16 and the mobile 0.18 falls under the FORM-SAFETY family exception (per UI-SPEC clarification) | Anti-Patterns to Avoid; Pattern 1 | Low — UI-SPEC explicitly addresses this; planner verifies |
| A7 | The 8 plans of Decision F are the right granularity (Wave 1 utility CSS / Wave 2 four parallel components / Wave 3 form + accordion / Wave 4 FinalCTA + verification) | Wave-able Decomposition | Low — already locked in CONTEXT.md Decision F |

## Open Questions

1. **Should Phase 92 amend Decision E to apply `.liquid-card` utility wrapper to a couple of representative section card families (ServicesGrid cards, ProcessSection steps, FAQSection items)?**
   - What we know: Decision E says "class swap, NOT utility migration." Heat-leak rules ship on `.liquid-card`. Index components don't use `.liquid-card`. Optical blob response on `/` comes from `backdrop-filter`, not from heat-leak `radial-gradient`.
   - What's unclear: Whether the project intends "every glass card optically warms when blob is behind" as a requirement (radial-gradient mechanism) or as a behavior (any optical response, including via `backdrop-filter`). Success criterion 5 says the rule must "make glass surfaces optically respond" — `backdrop-filter` does respond.
   - Recommendation: Treat as conservative — leave Decision E intact. Document the dual-mechanism in 92-08 verification. If the user wants explicit radial-gradient response on `/`, raise as a new Key Decision in a follow-up phase, not an amendment to Phase 92.

2. **For ContactSection (Pitfall 2), Path A or Path B?**
   - What we know: Current ContactSection has an opaque blue gradient that occludes the blob. Decision B's localized-dimming step is architecturally awkward against this layout.
   - What's unclear: Whether the user expects the form to sit over the blob (Path B = drop the blue gradient) or over the blue gradient (Path A = preserve, dimming becomes n/a).
   - Recommendation: Path A (preserve). Document as plan note in 92-07; flag for user attestation during 92-08 verification screenshots.

3. **`Header.tsx` — dead or alive?**
   - Recommendation: Plan 92-02 first task is `grep -rn "from.*layout/Header[^C]"` (excluding `HeaderClient`). If 0 imports, exclude from sweep. If >0, include CTA grep on it.

4. **FinalCTA `mix-blend-multiply` decoration — retire vs sanction?**
   - What we know: Anti-pattern #8 (DESIGN.md `## v9.0 Anti-Patterns`) bans `mix-blend-mode` on glass surfaces. FinalCTA line 14 has `mix-blend-multiply` on a decorative absolute-positioned blur blob INSIDE the glass frame.
   - Recommendation: Retire in Plan 92-08. The decorative blur was a v8.0 ornament; v9.0 has the page-wide living blob to provide ambient. Document decision in 92-08 plan note.

## Environment Availability

Phase 92 has no external dependencies beyond what's already installed:

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / pnpm | `pnpm build` compile gate | ✓ (project standard) | per `package.json` | — |
| Chrome DevTools | per-component opacity verification, Color Picker for WCAG | ✓ (any modern Chromium browser) | — | Firefox / Safari devtools as alternate |
| Tailwind v4 (already in repo) | arbitrary-value class generation | ✓ | v4 (per `globals.css @theme inline`) | — |
| Working Phase 91 blob engine | visual verification of heat-leak + transparent-glass legibility | ✓ (Phase 91 P01 code-complete per STATE.md) | — | If engine fails, glass swept to v9.0 will be visually verifiable against `static` fallback gradient |
| `prefers-reduced-*` toggles (real OS) | a11y verification | ✓ (macOS / iOS / Windows accessibility settings) | — | Phase 92 marks rows "pending live-toggle (Phase 94)" — Phase 94 hard gate |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none.

External Playwright / axe-core / Lighthouse CI tooling is Phase 94 territory — explicitly out of scope.

## Validation Architecture

> Project does not have `workflow.nyquist_validation` explicitly configured (`.planning/config.json` not yet inspected at this depth). Following the rule "absent or true = include," I include this section. If config sets it false, the section is informational only.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None for Phase 92 unit-test surface (visual sweep, not logic). `pnpm build` is the compile gate. Playwright DOM checks belong to Phase 94. |
| Config file | `next/package.json` `scripts.build`; no test runner registered (per repo state) |
| Quick run command | `pnpm build` (catches arbitrary-value class syntax errors and TS issues) |
| Full suite command | `pnpm build` + manual DevTools recipes per component |
| Phase gate | All 11 sections + 4 chrome + form panel + utility CSS swept; CTA grep audit clean; `pnpm build` clean; chrome legibility visually verified at heat=0 + heat=1; ContactForm body copy ≥4.5:1 (or KD-v9-002 logged) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GLASS-01 | Chrome at Tier 0 (≤0.16 effective fill); mobile blur ≤12px; HIG 44pt; ESC dismissal | DevTools computed-style + manual ESC test | `pnpm build && grep -rn 'bg-white/[0-9]' next/src/components/layout/` (expect 0 matches after sweep, EXCEPT preserved over-photo and decorative chips) | manual |
| GLASS-02 | HeroHub Tier 0 frame; CTA opaque, no `backdrop-filter` | DevTools + grep audit | `grep -B 0 -A 5 'from-mu-blue to-mu-accent-blue' next/src/components/sections/HeroHub.tsx \| grep -i 'backdrop'` (expect 0 matches) | manual |
| GLASS-03 | StatsBar mobile 1 wrapper / desktop 4 cards; cards Tier 1 / hover Tier 2 | Responsive DevTools at 375px (mobile) and 1440px (desktop) | manual viewport switch | manual |
| GLASS-04 | ServicesGrid Tier 1 / hover Tier 2; ≤2 glass siblings per viewport | Manual + DevTools layer count | DevTools "Layers" panel inspection | manual |
| GLASS-05 | Process/Problem/WhyUs/Clinics/Platform/Reviews per-tier sweep | DevTools per-component fill check | per-component visual + computed-style | manual |
| GLASS-06 | FAQSection closed Tier 1 / open Tier 2; accordion preserved | Click open; verify class-swap to Tier 2; verify max-height transition fires | manual click + DevTools computed-style on isOpen branch | manual |
| GLASS-07 | ContactForm form-fill ≥0.16 effective; labels promoted; inputs opaque; body contrast ≥4.5:1 | Color Picker on body copy at worst-case blob heat | Chrome DevTools Color Picker on `<p>` text vs composite background | manual |
| GLASS-08 | FinalCTA Tier 0 frame; CTA opaque; gradient unchanged; mix-blend-multiply retired | DevTools + grep | `grep -n 'mix-blend' next/src/components/sections/FinalCTA.tsx` (expect 0 matches after retire) | manual |
| GLASS-09 | Footer Tier 0 fill | DevTools computed-style on outer wrapper | manual | manual |
| GLASS-10 | liquid-glass.css re-pointed; heat-leak rules preserved on `.liquid-card`/`.liquid-regular` | Direct file inspection + DevTools on a `.liquid-card` consumer (note: only Phase 93 service pages and ContactMethodGrid use this utility) | `grep -A 30 '\.liquid-card\s*{' next/src/styles/liquid-glass.css \| grep 'radial-gradient.*blob'` (expect ≥1 match) | yes (rule shipped commit 9c93b9f) |

### Sampling Rate

- **Per task commit:** `pnpm build` — must be clean; visual smoke check on sweept component at desktop viewport.
- **Per wave merge:** `pnpm build` clean + DevTools mobile (375px) + desktop (1440px) verification of swept components; CTA grep audit clean.
- **Phase gate:** All 11 sections + 4 chrome + form panel + utility CSS swept; CTA grep audit clean; chrome legibility verified at heat=0 + heat=1; ContactForm WCAG measurement recorded; `pnpm build` clean; no `mix-blend-mode` on FinalCTA after Plan 92-08.

### Wave 0 Gaps

- [ ] **No Wave 0 gaps:** Phase 92 has no test infrastructure to set up. Existing `pnpm build` covers compile gate; visual verification is manual; Playwright is Phase 94 territory. **None — existing infrastructure covers all phase requirements.**

### DevTools Recipes (per-component verification)

**Recipe 1: Chrome legibility at heat=0**

1. Open `/` route in Chrome; force `static` blob mode by setting `window.__blobDebug.setMode?.('static')` in DevTools console (Phase 91 exposes debug helpers).
2. DevTools → Elements → select `<header>` → Computed → check `background-color` resolves to `rgba(255,255,255,0.06)` (or 0.10 mobile).
3. Select a nav link — Color Picker on text → composite background should still pass ≥4.5:1.
4. Repeat for Footer, StickyBar, MobileMenu drawer.

**Recipe 2: Heat-leak gradient liveness**

1. Move cursor to top-left of viewport.
2. DevTools → Elements → find a `.liquid-card` consumer (Phase 92 doesn't add new ones; Phase 93 service pages have them).
3. Computed → `background-image` should show `radial-gradient(... at <px>px <px>px ...)` matching cursor position.
4. Move cursor to bottom-right; verify the radial-gradient `at` coordinates update (Computed re-reads on inspection).

**Recipe 3: ContactForm WCAG measurement**

1. Open `/#contact`; ensure ContactSection is visible.
2. DevTools → Elements → select form `<p>` body copy.
3. Computed → Color Picker on text color → check contrast ratio with composite background.
4. Force blob to worst-case position via console `window.__blobDebug.setHeat(1.0)` (if exposed) and re-measure.
5. If <4.5:1 → trigger KD-v9-002 escalation: change `--glass-form-fill` desktop from 0.14 to 0.30, re-measure, log Key Decision in PROJECT.md.

**Recipe 4: Mobile blur cap verification**

1. DevTools → Toggle Device Toolbar → set viewport 375px width.
2. Select swept chrome component (HeaderClient).
3. Computed → `backdrop-filter` should resolve to `blur(12px)` exactly (clamp lower bound hits at narrow viewport).
4. Repeat for any tier-token component to confirm `clamp(12px, …)` lower bound activates.

**Recipe 5: CTA opacity invariant grep**

```bash
# Run from repo root; expect 0 matches:
grep -rn "from-mu-blue to-mu-accent-blue" next/src/components/sections/ next/src/components/layout/ \
  | xargs -I {} grep -l "backdrop" {} 2>/dev/null

# Run from repo root; verify all 5 in-scope CTAs are present:
grep -rln "from-mu-blue to-mu-accent-blue" next/src/components/sections/ next/src/components/layout/ \
  | grep -E "(HeroHub|MobileMenu|StickyBar|ContactForm|FinalCTA|HeaderClient)" \
  | sort -u
# Expected: 5 file matches (HeaderClient if Header.tsx is dead)
```

## Sources

### Primary (HIGH confidence)

- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/92-glass-rework-chrome-index-sections/92-CONTEXT.md` — locked Decisions A–I
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/92-glass-rework-chrome-index-sections/92-UI-SPEC.md` — visual contract per surface
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/REQUIREMENTS.md` — GLASS-01..10 locked
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/STATE.md` — Phase 91 P01 ship status; cheat-pass register
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN.md` — YAML glass tier tokens; ## v9.0 Custom Rules; ## v9.0 Anti-Patterns
- `/Users/mikhail/Projects/Medicus_video_consult-landing/CLAUDE.md` — project constraints
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/styles/liquid-glass.css` (1149 lines) — current utility CSS + Phase 92 commit 9c93b9f heat-leak rules
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/globals.css` lines 240–265 — `--glass-*` and `--blob-*` tokens
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/index.ts` lines 359–366 — engine writes `--blob-x/y/heat/velocity` in `px` units
- All component files inspected directly (paths in §Standard Stack > Component Inventory)

### Secondary (MEDIUM confidence)

- Visual reference screenshots `90-medicusunion-com.png`, `90-medicusunion-kz.png`, `91-blob-cursor-mode.png`, `91-blob-mobile-375.png` (referenced from git status; not opened in this session)
- Phase 90 Plan summaries (referenced via STATE.md trend table; not opened directly)

### Tertiary (LOW confidence)

- `design/LIQUID_GLASS_BLOB_TZ.md` (referenced from CONTEXT.md `<canonical_refs>`; not opened in this session — used transitively via UI-SPEC's quotation of TZ §9 / §10 / §11 / §13)

## Metadata

**Confidence breakdown:**

- Component inventory + current class lines: HIGH — every file read directly with line numbers cited.
- Token migration map (Decision D): HIGH — Decision D table in CONTEXT.md is the contract; verified against `globals.css` `--glass-*` registry and `liquid-glass.css` utility internals.
- Heat-leak gradient pattern: HIGH — already shipped commit 9c93b9f, verified in `liquid-glass.css` lines 174–192 and 340–365.
- CTA grep strategy: HIGH — all 5 in-scope CTAs identified by direct grep with line numbers.
- Form readability tooling: MEDIUM — Chrome DevTools Color Picker is the recommended manual recipe; Playwright + axe-core is Phase 94 territory; no in-session tool verification.
- Localized blob dimming: MEDIUM — Pitfall 2 surfaces an architectural awkwardness that needs design-level resolution; recommendation (Path A) is conservative.
- Mobile blur enforcement: HIGH — `clamp(12px, …)` enforced in token definition; verified per-component via DevTools recipe.
- ≤2 glass siblings per viewport audit: MEDIUM — manual viewport inspection; Phase 82 nesting pattern is established but ServicesGrid line 115 nested badge needs in-plan-92-04 review.
- FAQSection accordion: HIGH — CSS-only `transition-[max-height]`; no library involved.
- StatsBar responsive nesting: HIGH — Phase 82 pattern verified at line 49 / line 56.
- Wave decomposition: HIGH — Decision F is the contract; 8 plans / 4 waves; sequencing locked.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (stable phase contract; expires earlier if Decisions A–I or DESIGN.md anti-patterns change).
