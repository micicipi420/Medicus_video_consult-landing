# Phase 93: Per-Page Propagation — Sub-Routes — Pattern Map

**Mapped:** 2026-04-30
**Files analyzed:** 22 (4 service primitives + 7 checkup + 7 consultations + 4 treatment + 0 contacts-rendered + 5 shadcn verify) — all MODIFIED in scope, no new files
**Analogs found:** N/A — this phase is an in-place class swap. Phase 92's archetype catalogue (A–J) is **inherited verbatim**; Phase 93 introduces NO new archetypes.

> **Strategy:** Same Decision E (Phase 92): Tailwind class swap, NOT migration to `.liquid-*` utility classes. Replace each `bg-white/{N}` / `backdrop-blur-{value}` with `bg-[var(--glass-{tier}-fill)]` / `backdrop-blur-[var(--glass-{tier}-blur)]`. Borders (`border-white/N`, `border-glass-border*`) and shadows (`shadow-glass*`) stay. CTA gradients (`from-mu-blue to-mu-accent-blue`) NEVER touched. Text gradients (`bg-clip-text text-transparent`) NEVER touched.

---

## Inheritance Statement (Phase 92 → Phase 93)

The full archetype catalogue and tier-token resolution table are defined ONCE in `92-PATTERNS.md` and apply UNCHANGED to Phase 93:

- **Archetype A** (Chrome, Tier 0) — N/A in Phase 93 (chrome was Phase 92 territory; layout-mounted; inherited globally on every route).
- **Archetype B** (Section frame, Tier 0) — applies to: ServiceHero eyebrow + secondary CTA; ConsultationPricing frame + badge; ConsultationProblem panel; ConsultationScenarios panel; ConsultationDoctors outer panel + spec-pill container; CheckupB2B frames; CheckupProgramsKorea/Turkey badges + frames; TreatmentSteps section panels.
- **Archetype C** (Tier-1 hover-card → Tier-2 hover) — applies to: SocialProof grid; CheckupAdvantages 4 cards; CheckupProblem 3 cards; CheckupProcess 4 step cards; CheckupWhyUs 4 cards; CheckupProgramsKorea program cards; CheckupProgramsTurkey program cards; ConsultationAdvantages 5 cards; ConsultationBenefits 4 cards; ConsultationProcess 3 cards (already has `hover:bg-white/80`); ConsultationDoctors 7 doctor cards; TreatmentAboutUs 4 cards; TreatmentClinics 8 country cards; TreatmentReviews review cards; TreatmentSteps 4 step cards.
- **Archetype D** (Open-state-toggle, Tier 1 closed → Tier 2 hover) — applies to: `service/FAQ.tsx`.
- **Archetype E** (Responsive-glass-nesting) — N/A in Phase 93 (StatsBar pattern is index-only).
- **Archetype F** (Form panel + inputs, FORM-SAFETY) — applies to: `LeadFormSection` inner Tier 2 form panel with **KD-v9-002 α=0.50 inheritance**. Outer Tier 0 wrapper FLATTENED per Decision A (Phase 93 specific). `ContactForm` reused inside is FROZEN (Phase 92 already swept).
- **Archetype G** (Utility re-pointing) — N/A in Phase 93. `liquid-glass.css` already swept in Phase 92. Note: `next/src/components/sections/contacts/ContactMethodGrid.tsx` consumes `.liquid-card` but is dead code (not imported by `/contacts/page.tsx`) — skip per Decision F.
- **Archetype H** (Over-photo controls — NOT GLASS, preserve) — N/A in Phase 93 (no over-photo control bars in sub-routes).
- **Archetype I** (Anti-pattern `mix-blend-multiply` decoration) — N/A in Phase 93 (already retired from FinalCTA in Phase 92; no new occurrences in sub-route components per grep).
- **Archetype J** (CTA opaque-forever) — applies to: `ServiceHero.tsx:50` (primary CTA); `CheckupB2B.tsx:85` (CTA); `CheckupProgramsTurkey.tsx:132` (CTA); `ConsultationPricing.tsx:43` (CTA). Plus inherited frozen `ContactForm.tsx:247` reused inside LeadFormSection.

**Tier-token resolution table** (Phase 90, FROZEN — same values as Phase 92 §Tier-token resolution table):

| Token | Desktop | Mobile (≤768px) | Tailwind arbitrary form |
|-------|---------|-----------------|-------------------------|
| `--glass-section-fill` | rgba(255,255,255,0.06) | rgba(255,255,255,0.10) | `bg-[var(--glass-section-fill)]` |
| `--glass-section-blur` | 24px clamp | 12px clamp | `backdrop-blur-[var(--glass-section-blur)]` |
| `--glass-card-fill` | rgba(255,255,255,0.10) | rgba(255,255,255,0.14) | `bg-[var(--glass-card-fill)]` |
| `--glass-card-blur` | 20px clamp | 12px clamp | `backdrop-blur-[var(--glass-card-blur)]` |
| `--glass-form-fill` | **rgba(255,255,255,0.50)** (KD-v9-002) | resolves same desktop value | `bg-[var(--glass-form-fill)]` |
| `--glass-form-blur` | 18px clamp | 12px clamp | `backdrop-blur-[var(--glass-form-blur)]` |
| `--glass-button-fill` | rgba(255,255,255,0.12) | rgba(255,255,255,0.16) | `bg-[var(--glass-button-fill)]` |
| `--glass-button-blur` | 16px clamp | 12px clamp | `backdrop-blur-[var(--glass-button-blur)]` |

Hover-ramp template across Archetypes C, D, J→inner-glass-button: `hover:bg-[var(--glass-form-fill)]` (Tier-2 hover via form-fill token = same value Tier-2 surface uses statically).

---

## File Classification

| Wave | File | Role | Data Flow | Archetype(s) | Match Quality |
|------|------|------|-----------|--------------|---------------|
| 1 | `next/src/components/sections/service/ServiceHero.tsx` | hero component | request-response (CTA click) | B + B + J | exact (mirrors HeroHub.tsx Phase 92) |
| 1 | `next/src/components/sections/service/SocialProof.tsx` | stat grid | static | C | exact (mirrors StatsBar desktop card) |
| 1 | `next/src/components/sections/service/FAQ.tsx` | accordion | event-driven (click) | D | exact (mirrors FAQSection.tsx Phase 92) |
| 1 | `next/src/components/sections/service/LeadFormSection.tsx` | form wrapper | request-response (form submit) | F + nesting flattening (Decision A) | role-match (mirrors ContactSection.tsx Path A; Phase 93 deviation = flatten outer) |
| 2A | `next/src/app/checkup/page.tsx` | route shell | composition | (no glass surfaces; verify-only) | n/a |
| 2A | `next/src/components/sections/checkup/CheckupAdvantages.tsx` | card grid | static | C (4× cards + 4× decorative inner chips) | exact |
| 2A | `next/src/components/sections/checkup/CheckupB2B.tsx` | section panels + CTA | request-response | B (3 frames) + J (1 CTA at line 85) | exact |
| 2A | `next/src/components/sections/checkup/CheckupProblem.tsx` | card grid | static | C (3× cards + 3× decorative inner chips) | exact |
| 2A | `next/src/components/sections/checkup/CheckupProcess.tsx` | step cards | static | C (4× cards) | exact |
| 2A | `next/src/components/sections/checkup/CheckupProgramsKorea.tsx` | program cards (variant strings) | static | B (badge variant) + C (card variants) | exact |
| 2A | `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx` | B2B frame + program cards + CTA | request-response | B (frame + badge variants) + C (card variants) + J (CTA at line 132) | exact |
| 2A | `next/src/components/sections/checkup/CheckupWhyUs.tsx` | card grid | static | C (4× cards) | exact |
| 2B | `next/src/app/consultations/page.tsx` | route shell | composition | (no glass surfaces) | n/a |
| 2B | `next/src/components/sections/consultations/ConsultationAdvantages.tsx` | card grid | static | C (5× cards + 5× decorative inner chips) | exact |
| 2B | `next/src/components/sections/consultations/ConsultationBenefits.tsx` | card grid | static | C (4× cards + 4× decorative inner chips) | exact |
| 2B | `next/src/components/sections/consultations/ConsultationDoctors.tsx` | outer panel + 7 doctor cards + spec-pills + secondary CTA glass | static + click | B (outer + spec-pills container + secondary CTA glass) + C (7× doctor cards) + decorative pills | exact |
| 2B | `next/src/components/sections/consultations/ConsultationPricing.tsx` | frame + badge + CTA | request-response | B (frame + inner badge) + J (CTA at line 43) | exact |
| 2B | `next/src/components/sections/consultations/ConsultationProblem.tsx` | section panel | static | B (single panel) | exact |
| 2B | `next/src/components/sections/consultations/ConsultationProcess.tsx` | 3 cards (with `hover:bg-white/80`) | static | C (Tier 1 → Tier 2 hover ramp explicit) | exact |
| 2B | `next/src/components/sections/consultations/ConsultationScenarios.tsx` | section panel + checkmark chip | static | B (panel) + decorative inner | exact |
| 2C | `next/src/app/treatment-abroad/page.tsx` | route shell | composition | (no glass surfaces) | n/a |
| 2C | `next/src/components/sections/treatment/TreatmentAboutUs.tsx` | card grid | static | C (4× cards + 4× decorative inner chips) | exact |
| 2C | `next/src/components/sections/treatment/TreatmentClinics.tsx` | country card grid | static | C (8× cards) | exact |
| 2C | `next/src/components/sections/treatment/TreatmentReviews.tsx` | review card grid | static | C (review cards; data-driven `review.gradient` is decorative ribbon, NOT a CTA) | exact |
| 2C | `next/src/components/sections/treatment/TreatmentSteps.tsx` | step section panels | static | C (4× cards) | exact |
| 2D | `next/src/app/contacts/page.tsx` | route shell + inline hero `<section>` | composition | none — page-frame gradient `bg-gradient-to-b from-[#F0F7FF] to-white` is cosmetic page-frame, NOT glass-tier (preserve) | n/a (verify-only, no sweep) |
| 3 | `next/src/components/ui/card.tsx` | shadcn primitive | n/a | (admin-only consumer) | skip — Decision per RESEARCH §Discretion item 6 |
| 3 | `next/src/components/ui/dialog.tsx` | shadcn primitive (modal) | event-driven | future-proof note ONLY (no public consumer) | skip-with-doc — Pitfall 5 |
| 3 | `next/src/components/ui/input.tsx` | shadcn primitive | input | (admin-only) | skip |
| 3 | `next/src/components/ui/select.tsx` | shadcn primitive | input | (admin-only) | skip |
| 3 | `next/src/components/ui/textarea.tsx` | shadcn primitive | input | (admin-only) | skip |
| 3 | `next/src/app/admin/submissions-table.tsx` | admin route — only public-route consumer of shadcn | CRUD | (verify-only — admin route is private, not in v9.0 token migration scope) | n/a |

**Files with no analog needed:** None. Phase 92 archetype templates cover every Phase 93 target file.

---

## Pattern Assignments per File

For each file, the planner's task-action block should cite: **archetype letter** + **exact line numbers** + **exact before/after strings** drawn from `92-PATTERNS.md` §Archetype Templates.

### Wave 1 — Service Primitives

#### `next/src/components/sections/service/ServiceHero.tsx`

Mirrors HeroHub.tsx (Phase 92 plan 92-03) except no over-photo controls and no credibility badge — only eyebrow + primary CTA + secondary CTA glass.

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 35 (eyebrow pill) | B | `mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-2.5 shadow-glass-inner backdrop-blur-xl sm:px-5` | `mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/60 bg-[var(--glass-section-fill)] px-4 py-2.5 shadow-glass-inner backdrop-blur-[var(--glass-section-blur)] sm:px-5` |
| 50 (primary CTA gradient) | **J — NEVER SWEEP** | `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE — opaque-forever** |
| 73 (secondary CTA glass) | B | `w-full rounded-3xl border border-white/60 bg-white/50 px-8 py-4 ... shadow-glass backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-white/60 sm:w-auto` | `w-full rounded-3xl border border-white/60 bg-[var(--glass-section-fill)] px-8 py-4 ... shadow-glass backdrop-blur-[var(--glass-section-blur)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-[var(--glass-card-fill)] sm:w-auto` (hover ramps to Tier 1 — same call as HeroHub.tsx:56) |

#### `next/src/components/sections/service/SocialProof.tsx`

Mirrors `StatsBar` desktop cards (Archetype C). Single hover-state card pattern.

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 19 (stat card) | C | `relative group flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-glass hover:shadow-glass-lg hover:bg-white/70 transition-all duration-500 overflow-hidden` | `relative group flex flex-col items-center justify-center p-8 bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] border border-white/60 shadow-glass hover:shadow-glass-lg hover:bg-[var(--glass-form-fill)] transition-all duration-500 overflow-hidden` |

#### `next/src/components/sections/service/FAQ.tsx`

Mirrors `FAQSection` (Phase 92 plan 92-06). Archetype D closed-Tier-1 + button-hover Tier-2-ramp. Open-state visual = hover-ramp-while-open (simplest Phase 92 path).

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 44 (closed item wrapper) | D | `bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-glass overflow-hidden` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] border border-white/60 shadow-glass overflow-hidden` |
| 48 (button hover) | D | `w-full flex items-center justify-between p-6 text-left text-lg font-extrabold text-mu-text-900 cursor-pointer hover:bg-white/80 transition-colors` | `w-full flex items-center justify-between p-6 text-left text-lg font-extrabold text-mu-text-900 cursor-pointer hover:bg-[var(--glass-form-fill)] transition-colors` |
| 34 (heading text gradient) | TEXT GRADIENT — NEVER SWEEP | `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent` | **NO CHANGE — text-fill, not glass** |

#### `next/src/components/sections/service/LeadFormSection.tsx` (Decision A — flatten outer)

**Phase 93 deviation:** outer Tier 0 wrapper at line 47 is FLATTENED (drop the glass wrapper entirely). Inner Tier 2 form panel at line 72 inherits KD-v9-002 α=0.50.

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 19 (`GlassCheckmark` chip — decorative inner trust-item icon) | (decorative inner) | `w-6 h-6 bg-white/60 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center flex-shrink-0 shadow-glass-inner-strong` | `w-6 h-6 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] border border-white/60 rounded-full flex items-center justify-center flex-shrink-0 shadow-glass-inner-strong` (Tier 3 button-tier — decorative inner chip; standardizes blur to button token; same call as Footer phone-icon chip in Phase 92 plan 92-02) |
| 47 (outer Tier 0 wrapper — **FLATTEN**) | F + flattening | `<div className="rounded-[3.5rem] border border-white/60 bg-white/60 p-6 shadow-glass-lg backdrop-blur-3xl md:p-12">` | `<div className="rounded-[3.5rem] p-6 md:p-12">` (drop `border border-white/60`, drop `bg-white/60`, drop `shadow-glass-lg`, drop `backdrop-blur-3xl` — flatten to non-glass container; preserves rounded radius + padding) |
| 72 (inner Tier 2 form panel — KD-v9-002 α=0.50) | F | `rounded-[2.5rem] border border-white/60 bg-white/42 p-5 shadow-glass backdrop-blur-2xl sm:p-7 md:p-9` | `rounded-[2.5rem] border border-white/60 bg-[var(--glass-form-fill)] p-5 shadow-glass backdrop-blur-[var(--glass-form-blur)] sm:p-7 md:p-9` |
| (`<ContactForm />` import) | F (FROZEN) | (already swept Phase 92) | **NO CHANGE — Phase 92 territory; do not re-edit `ContactForm.tsx` or `ContactSection.tsx`** |

**Why flatten the outer:** anti-pattern #13 violated — outer Tier 0 + inner Tier 2 + nearby `<FAQ>` Tier 1 cards = 3+ glass on the same viewport at 1440px. Dropping outer aligns with Phase 92 ContactSection Path A behavior (single Tier 2 form panel, no outer glass framing). Mobile: prevents compounded `backdrop-filter` (clamp 12px outer + clamp 12px inner = 24px effective).

---

### Wave 2A — `/checkup` (7 files)

> Wave 2 sub-route plans MUST run the negative-grep gate (CTA invariant + text-gradient preservation grep, see §Shared Patterns) before sign-off.

#### `next/src/components/sections/checkup/CheckupAdvantages.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15, 28, 41, 54 (4× advantage cards — same pattern) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` (no `hover:bg-*` in source — optional `hover:bg-[var(--glass-form-fill)]` ADD by planner) |
| 16, 29, 42, 55 (4× decorative inner icon chips) | (decorative inner) | `w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` | `w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` (Tier 3 — decorative inner chip) |

#### `next/src/components/sections/checkup/CheckupB2B.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 48, 56, 67 (3× B2B section frames) | B | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |
| 85 (CTA gradient) | **J — NEVER SWEEP** | `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE — opaque-forever** |

#### `next/src/components/sections/checkup/CheckupProblem.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15, 28, 41 (3× problem cards) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |
| 16, 29, 42 (3× decorative inner chips) | (decorative inner) | `w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` | `w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` |

#### `next/src/components/sections/checkup/CheckupProcess.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 48 (step cards in `.map()`) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass text-center` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass text-center` |

#### `next/src/components/sections/checkup/CheckupProgramsKorea.tsx`

Variant-class strings (data-driven). Both default + highlighted variants get the same Archetype B/C swap.

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 13 (highlighted variant card) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-mu-blue/40 shadow-[...] flex flex-col${...}` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-mu-blue/40 shadow-[...] flex flex-col${...}` |
| 14 (default variant card) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col` |
| 18 (badge variant) | B | `inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4` | `inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4` |

#### `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 82 (B2B card frame) | B | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass mb-8` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass mb-8` |
| 103 (highlighted variant) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-mu-blue/40 shadow-[...] flex flex-col` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-mu-blue/40 shadow-[...] flex flex-col` |
| 104 (default variant) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col` |
| 111 (badge variant) | B | `inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4` | `inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4` |
| 132 (CTA gradient) | **J — NEVER SWEEP** | `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE — opaque-forever** |

#### `next/src/components/sections/checkup/CheckupWhyUs.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 43 (4× cards in `.map()`) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |

---

### Wave 2B — `/consultations` (7 files)

#### `next/src/components/sections/consultations/ConsultationAdvantages.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 14, 33, 52, 71, 90 (5× cards with hover) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` (note: line 90 has trailing `md:col-span-2 lg:col-span-1`) | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` (no `hover:bg-*` in source — optional `hover:bg-[var(--glass-form-fill)]` ADD by planner) |
| 17, 36, 55, 74, 93 (5× decorative inner brand-color icon chips) | (decorative — preserve brand color) | `w-14 h-14 bg-mu-blue/10` / `bg-mu-accent-teal-bg` / `bg-mu-accent-orange-bg` / `bg-mu-green-50` / `bg-mu-blue/10` `backdrop-blur-xl rounded-2xl ...` | Keep brand-color fill (`bg-mu-blue/10`, etc.); swap blur to `backdrop-blur-[var(--glass-button-blur)]`. Anti-pattern #5 NOT triggered — these are brand-color chips, not green-on-card violations. |

#### `next/src/components/sections/consultations/ConsultationBenefits.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 14, 27, 40, 53 (4× cards with hover) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` |
| 15, 28, 41, 54 (4× decorative brand-color chips) | (decorative — preserve brand color) | `w-14 h-14 bg-mu-blue/10` / `bg-mu-accent-teal-bg` / `bg-mu-green-50` / `bg-mu-accent-orange-bg` `backdrop-blur-xl rounded-2xl ...` | Keep brand-color fill; swap blur → `backdrop-blur-[var(--glass-button-blur)]`. |

#### `next/src/components/sections/consultations/ConsultationDoctors.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 30 (outer panel — Tier 0) | B | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-4xl mx-auto mb-12 space-y-4` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-4xl mx-auto mb-12 space-y-4` |
| 45, 58, 73, 86, 98, 113, 126 (7× doctor cards with hover) | C | `bg-white/60 backdrop-blur-2xl rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300` |
| 141 (spec-pills container — Tier 0) | B | `bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg max-w-4xl mx-auto mb-8` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-12 border border-white/60 shadow-glass-lg max-w-4xl mx-auto mb-8` |
| 145 (spec pills `.map()` — decorative inline-pills nested inside Tier 0 spec-pills container) | (decorative inner) | `bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full font-bold text-mu-text-900 shadow-glass-inner hover:bg-mu-green-50 hover:text-mu-green-700 transition-colors cursor-default` | `bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] border border-white/60 px-6 py-3 rounded-full font-bold text-mu-text-900 shadow-glass-inner hover:bg-mu-green-50 hover:text-mu-green-700 transition-colors cursor-default` (Tier 3 inner; preserve `hover:bg-mu-green-50` brand-tint hover — semantic hover, not glass-tier) |
| 156 (secondary CTA glass — bottom of section) | B | `inline-flex items-center gap-2 bg-white/50 backdrop-blur-xl text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-white/60 transition-all border border-white/60 text-lg` | `inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-[var(--glass-card-fill)] transition-all border border-white/60 text-lg` (mirrors HeroHub.tsx:56 secondary CTA) |

> **Anti-pattern #13 watch:** ConsultationDoctors stacks 3 glass tiers visible simultaneously on desktop (outer panel + 7 doctor cards + spec-pills container at viewport bottom). Phase 82 grandfathered exception applies (siblings of each other, not nested). Verify in Wave 2 in-browser tuning.

#### `next/src/components/sections/consultations/ConsultationPricing.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 21 (Tier 0 frame) | B | `bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-glass-lg max-w-xl mx-auto` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-glass-lg max-w-xl mx-auto` |
| 22 (inner badge) | B | `inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-glass-inner mb-6 text-sm font-bold text-mu-text-900` | `inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-white/60 px-5 py-2.5 rounded-full shadow-glass-inner mb-6 text-sm font-bold text-mu-text-900` |
| 43 (CTA gradient) | **J — NEVER SWEEP** | `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE — opaque-forever** |

#### `next/src/components/sections/consultations/ConsultationProblem.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 7 (single panel) | B | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto space-y-6` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto space-y-6` |

#### `next/src/components/sections/consultations/ConsultationProcess.tsx`

This file has explicit `hover:bg-white/80` — Archetype C with full Tier-1→Tier-2 ramp.

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 11, 22, 33 (3× cards with explicit hover ramp) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-[var(--glass-form-fill)] hover:border-white/80 hover:shadow-glass-lg transition-all duration-500` |

#### `next/src/components/sections/consultations/ConsultationScenarios.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 17 (panel) | B | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto` |
| 21 (decorative checkmark chip) | (decorative inner) | `flex-shrink-0 w-7 h-7 bg-white/60 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center shadow-glass-inner-strong mt-0.5` | `flex-shrink-0 w-7 h-7 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] border border-white/60 rounded-full flex items-center justify-center shadow-glass-inner-strong mt-0.5` (Tier 3 — same template as `LeadFormSection` GlassCheckmark line 19) |

---

### Wave 2C — `/treatment-abroad` (4 files)

#### `next/src/components/sections/treatment/TreatmentAboutUs.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15, 31, 49, 68 (4× cards) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |
| 16, 32, 50, 69 (4× decorative inner chips) | (decorative inner) | `w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` | `w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5` |

#### `next/src/components/sections/treatment/TreatmentClinics.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15, 32, 50, 66, 86, 105, 123, 142 (8× country cards — same string) | C | `bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass` |

#### `next/src/components/sections/treatment/TreatmentReviews.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 43 (review cards in `.map()`) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |
| (data-driven `review.gradient = 'from-mu-blue to-mu-accent-blue'`) | NOT a CTA — decorative ribbon/data accent | n/a | **NO CHANGE — gradient is part of review data record, used as decorative bar/accent, NOT a `<button>` or `<a>` CTA. Verify per-Wave-2 grep.** |

#### `next/src/components/sections/treatment/TreatmentSteps.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 18, 48, 78, 104 (4× step section panels) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass` |

---

### Wave 2D — `/contacts` (Decision F: ONE rendered file)

#### `next/src/app/contacts/page.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 23 (page-frame heading section) | (NOT glass — cosmetic page-frame gradient) | `pt-20 pb-12 lg:pt-[5rem] lg:pb-12 bg-gradient-to-b from-[#F0F7FF] to-white` | **NO CHANGE — preserve cosmetic vertical page-frame gradient. Not a glass surface; no `backdrop-filter`. Per Phase 92 ContactSection-line-26 Path A precedent (preserve non-glass gradient backdrops).** |
| `<LeadFormSection>` import | F (covered by Wave 1) | (Wave 1 already swept this primitive) | **NO CHANGE — `LeadFormSection` swept once in Wave 1 propagates here automatically** |

> **Decision F:** `next/src/app/contacts/{ContactsHero,ContactMethodGrid,CoordinatorCard,TrustBadges}.tsx` are NOT imported by `page.tsx`. Skip these 4 files in Phase 93. Cleanup todo at `.planning/todos/pending/contacts-route-dead-code-cleanup.md`.

---

### Wave 3 — shadcn primitives + admin route verification

#### `next/src/components/ui/card.tsx`

| Archetype | Action |
|-----------|--------|
| (admin-only consumer) | **SKIP — verify-only.** Public routes do not consume `<Card>`. Uses `bg-card` token (not `--glass-*`); leave as-is. |

#### `next/src/components/ui/dialog.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 34 (modal overlay — only public-impactful shadcn surface) | (future-proof note) | `fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0` | **SKIP-WITH-DOC.** No public consumer currently exists (research grep found only `admin/submissions-table.tsx`). When/if a public modal lands, swap to: `fixed inset-0 isolate z-50 bg-[var(--glass-section-fill)] duration-100 supports-backdrop-filter:backdrop-blur-[var(--glass-section-blur)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0` (Tier 0 token; the existing `bg-black/10` would let the v9.0 blob bleed through visibly). Phase 93 records this as a Pitfall-5 future-proofing note in SUMMARY. |

#### `next/src/components/ui/input.tsx` / `select.tsx` / `textarea.tsx`

| Archetype | Action |
|-----------|--------|
| (admin-only consumer; uses `bg-transparent` already) | **SKIP — verify-only.** No glass surfaces; no `backdrop-blur`; `bg-transparent` is already opaque-friendly per Phase 92 form-input-flatten precedent. |

#### `next/src/app/admin/submissions-table.tsx`

| Archetype | Action |
|-----------|--------|
| n/a (private admin route) | **VERIFY-ONLY.** Out-of-scope for v9.0 token migration (admin route is private; no blob field). Phase 93 confirms this is the only consumer of shadcn primitives, validating "shadcn = admin-only impact" assumption. |

---

## Shared Patterns (cross-cutting)

### CTA opaque-forever invariant (Archetype J)

**Source of truth:** DESIGN.md `## v9.0 Custom Rules` master list (Phase 90 frozen) + Phase 92 `92-PATTERNS.md` Shared Patterns.
**Apply to:** every Phase 93 plan (Wave 1 + Wave 2A/B/C/D).
**Phase 93 Archetype-J locations:**
- `ServiceHero.tsx:50` (primary CTA — Wave 1)
- `CheckupB2B.tsx:85` (Wave 2A)
- `CheckupProgramsTurkey.tsx:132` (Wave 2A)
- `ConsultationPricing.tsx:43` (Wave 2B)
- `ContactForm.tsx:247` (FROZEN — Phase 92 territory; reused inside `LeadFormSection`)

**Verification grep (every Wave 2 plan must run before sign-off):**
```bash
grep -rln "from-mu-blue to-mu-accent-blue" \
  next/src/components/sections/checkup/ \
  next/src/components/sections/consultations/ \
  next/src/components/sections/treatment/ \
  next/src/components/sections/service/ \
  | xargs -I {} grep -l "backdrop" {} 2>/dev/null
```
Expected: zero matches. Any line where a CTA gradient class appears within the same className string as `backdrop-blur-*` or `backdrop-filter` is a defect.

### Text-gradient preservation (NEVER SWEEP)

**Source:** Phase 93 RESEARCH §Pattern 3 + §Pitfall 2.
**Apply to:** every sub-route component containing heading gradients.

**Identification rule:**
- `bg-gradient-to-* + bg-clip-text + text-transparent` → TEXT FILL — NEVER swept.
- `bg-gradient-to-* + text-white + (px-N | rounded-N)` → CTA — Archetype J — NEVER swept.

**Verification grep (every Wave 2 plan must run before sign-off):**
```bash
grep -rn "bg-clip-text" \
  next/src/components/sections/checkup/ \
  next/src/components/sections/consultations/ \
  next/src/components/sections/treatment/ \
  next/src/components/sections/service/
```
Expected: every match is a heading text-gradient. Confirm visually via Wave 0 Playwright screenshot diff — heading text rendered with gradient color is the regression marker.

### Border + shadow tokens (NO CHANGE across all Phase 93 sweeps)

Same rule as Phase 92:
- `border-glass-border` / `border-glass-border-strong` / `border-white/N` — STAY (cosmetic + token-based)
- `shadow-glass`, `shadow-glass-lg`, `shadow-glass-sm`, `shadow-glass-inner`, `shadow-glass-inner-strong` — STAY (token-based)

### Mobile blur cap (≤12px, anti-pattern #12)

Same enforcement mechanism as Phase 92. Phase 90 token clamps already cap at 12px on mobile. Compliant by token consumption — the moment a sweep replaces `backdrop-blur-2xl` (40px hardcoded) with `backdrop-blur-[var(--glass-{tier}-blur)]`, mobile cap is automatic. **Anti-pattern flag:** any `backdrop-blur-[NNpx]` literal AFTER Phase 93 sweep is a regression.

### `≤2 glass siblings per viewport` rule (anti-pattern #13)

**At-risk sub-routes:**
1. **`LeadFormSection`** before flattening — outer Tier 0 + inner Tier 2 + adjacent FAQ Tier 1 = 3+ glass on viewport. **Resolved by Decision A** — flatten outer.
2. **`ConsultationDoctors`** — Tier 0 outer panel (line 30) + 7× Tier 1 doctor cards (lines 45–126) + Tier 0 spec-pills container (line 141) — three tiered surfaces visible simultaneously on desktop scroll. **Phase 82 grandfathered exception** applies (siblings of each other, not nested). Verify in-browser at Wave 2B.
3. **Multi-card sections** (ConsultationDoctors 7 cards, TreatmentClinics 8 cards) — sibling-not-nested scenarios — Phase 82 grandfathered exception.

### Anti-pattern enforcement gate (Decision H from Phase 92)

Apply to every Phase 93 Wave plan. Each plan MUST grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks. Specifically inherit Phase 92's enforcement:
- **#4** (fills > 0.16) — Tier 2 form panel at α=0.50 is sanctioned via KD-v9-002. All other tiers compliant via token consumption.
- **#5** (statically-painted green tint on cards) — sub-route brand-color icon chips (`bg-mu-blue/10`, `bg-mu-accent-teal-bg`, `bg-mu-accent-orange-bg`, `bg-mu-green-50`) are NOT violations (brand-color chips inside cards, not green-on-card surface).
- **#6** (animated `backdrop-filter`) — Wave 2 plans must verify no `transition-[...,backdrop-filter,...]` appears in swept classNames.
- **#8** (`mix-blend-mode` on glass) — grep verifies no new occurrences in sub-route files (Phase 92 retired the FinalCTA case).
- **#11** (`backdrop-filter` on `.living-blob-field`) — N/A; Phase 93 doesn't touch blob field.
- **#12** (mobile blur >12px) — token clamp enforces.
- **#13** (>2 glass layers per viewport) — see rule above; `LeadFormSection` flatten resolves the primary violation.
- **#14** (new glass class without `@a11y-layer-coverage` registration) — Decision E (class-swap, not new utility) means zero new classes. Compliant by no-op.
- **#15** (cheat-passing a11y) — every plan marks a11y rows "pending live-toggle (Phase 94)". Never "verified" until Phase 94.

### Wave 0 Playwright determinism (NEW — Phase 93 introduces)

**Source:** RESEARCH §Pattern 4 + Decision H.
**Apply to:** Wave 0 only.

Per-route screenshot baseline must:
1. Pin blob via `window.__blobDebug.setMode?.('static')` if available (Phase 91 dev surface) OR fallback `page.emulateMedia({ reducedMotion: 'reduce' })`.
2. Mask `.living-blob-field` region in `expect(page).toHaveScreenshot({ mask: [page.locator('.living-blob-field')] })`.
3. Run BEFORE Wave 1 commits (capture pre-Phase-93 baseline at HEAD of `feat/v3.1` post-Phase-92 merge).
4. Use desktop 1440×900 + mobile-375 (Pixel 5) viewports.

---

## No Analog Found / Special Cases

| File | Archetype | Special handling |
|------|-----------|------------------|
| `next/src/app/contacts/page.tsx` line 23 page-frame gradient | (NOT glass) | Cosmetic vertical gradient `bg-gradient-to-b from-[#F0F7FF] to-white`. NOT a glass surface, NOT a CTA. Preserve verbatim. Same precedent as Phase 92 ContactSection line 26 (Path A — non-glass gradient backdrop preserved). |
| `next/src/app/contacts/{ContactsHero,ContactMethodGrid,CoordinatorCard,TrustBadges}.tsx` | dead code | NOT imported by `page.tsx`. Skip entirely per Decision F. Cleanup separate post-Phase-93 todo. |
| `LeadFormSection.tsx:47` outer wrapper | flattening (Phase 93 deviation) | Decision A — outer Tier 0 wrapper is FLATTENED (not swept). Drop `bg-white/60 backdrop-blur-3xl border border-white/60 shadow-glass-lg` entirely; preserve `rounded-[3.5rem] p-6 md:p-12`. |
| `TreatmentReviews.tsx` `review.gradient` data field | NOT a CTA | Data-driven decorative ribbon `'from-mu-blue to-mu-accent-blue'` used as accent-bar fill, not a button/anchor. Preserve. Verify in Wave 2C grep. |
| `dialog.tsx:34` shadcn modal overlay | future-proof note (skip-with-doc) | No public consumer currently. Phase 93 SUMMARY records the swap recipe for future use; does NOT execute the swap (Decision: scope-bounded). |
| `admin/submissions-table.tsx` shadcn consumer | private admin route | Out-of-scope for v9.0 token migration. Verify-only that this is the SOLE shadcn consumer (validates assumption). |

---

## Plan-to-Archetype Cross-Reference

For planner consumption — each Phase 93 plan file references this map:

| Wave Plan (proposed) | Files Modified | Primary Archetypes | Phase 92 Plan Analog |
|----------------------|----------------|---------------------|----------------------|
| **93-00 Wave 0** (Playwright) | `next/playwright.config.ts` (NEW), `next/tests/route-baselines.spec.ts` (NEW), `next/package.json` (devDep) | n/a (test infrastructure) | n/a (new tier introduction) |
| **93-01 Wave 1** (service primitives) | `service/{ServiceHero,SocialProof,FAQ,LeadFormSection}.tsx` | B + C + D + F | 92-03 (HeroHub), 92-06 (FAQSection), 92-07 (ContactSection/Form) |
| **93-02 Wave 2A** (`/checkup`) | 7 checkup/* files | B + C + J | 92-04 + 92-05 (mid-section sweeps) |
| **93-03 Wave 2B** (`/consultations`) | 7 consultations/* files | B + C + J | 92-04 + 92-05 |
| **93-04 Wave 2C** (`/treatment-abroad`) | 4 treatment/* files | B + C | 92-04 + 92-05 |
| **93-05 Wave 2D** (`/contacts`) | `contacts/page.tsx` (verify-only) | n/a | n/a (no glass surface to sweep) |
| **93-06 Wave 3** (shadcn + admin verify) | `ui/dialog.tsx` (skip-with-doc), `admin/submissions-table.tsx` (verify) | (future-proof note) | n/a |
| **93-07 SUMMARY** (close-out + sweep audit + DESIGN.md anti-pattern append) | `DESIGN.md` (one new anti-pattern appended), Phase 93 SUMMARY.md | n/a | 92-08 (sweep-audit + anti-pattern append) |

---

## Metadata

**Analog search scope:**
- `next/src/components/sections/service/{ServiceHero,SocialProof,FAQ,LeadFormSection}.tsx` (4 files)
- `next/src/components/sections/checkup/*.tsx` (7 files)
- `next/src/components/sections/consultations/*.tsx` (7 files)
- `next/src/components/sections/treatment/*.tsx` (4 files)
- `next/src/app/contacts/page.tsx` + dead-code skip list
- `next/src/components/ui/{card,dialog,input,select,textarea}.tsx` (5 files — verify-only)
- Cross-reference: `92-PATTERNS.md` Archetypes A–J + Tier-token resolution table (FROZEN)

**Files inspected (read-only):** 22 sub-route + service-primitive files + 5 shadcn primitives + 4 page.tsx route shells + 8 Phase 92 reference docs

**Pattern extraction date:** 2026-04-30

**Phase 93 deviation summary (vs verbatim Phase 92 archetype reuse):**
1. **Decision A — `LeadFormSection.tsx:47` outer Tier 0 wrapper FLATTENED** (not swept) — eliminates anti-pattern #13 violation; aligns LeadFormSection with ContactSection Path A precedent. Inner Tier 2 form panel at line 72 inherits KD-v9-002 α=0.50.
2. **Decision F — `/contacts` dead-code skip** — 4 unimported files (`ContactsHero`, `ContactMethodGrid`, `CoordinatorCard`, `TrustBadges`) NOT swept. `/contacts/page.tsx` cosmetic page-frame gradient preserved (non-glass). Cleanup separate post-Phase-93 todo.
3. **Wave 0 NEW infrastructure** — Playwright install + per-route screenshot baseline (no Phase 92 analog).
4. **Wave 3 shadcn = SKIP-WITH-DOC** — research confirmed admin-only consumer; only `dialog.tsx:34` is potentially public-impactful. Future-proof recipe recorded; no actual sweep executed.

**Note on archetype reuse:** Archetypes B, C, F provide template strings used across 22+ files. Per-file action blocks should reference the archetype + cite line numbers; per-file tables above provide line-numbered exact swaps. The bulk of Phase 93 work is mechanical application of `bg-white/60 backdrop-blur-2xl` → `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` across cards, and `bg-white/60 backdrop-blur-3xl` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]` across section frames.

## PATTERN MAPPING COMPLETE
