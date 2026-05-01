# Phase 93: Per-Page Propagation — Sub-Routes — Research

**Researched:** 2026-04-30
**Domain:** Tailwind v4 arbitrary-value class sweep on Next.js App Router service-page sub-routes (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`); shared service primitives; shadcn/ui base primitives; Playwright per-route screenshot baseline (Wave 0 infrastructure).
**Confidence:** HIGH (codebase reality directly inspected; Phase 92 patterns already validated; Phase 92 archetype templates apply mechanically)

## Summary

Phase 93 is a **mechanical Tailwind class sweep** that ports the v9.0 4-tier glass system from `/` (Phase 92) onto 4 service-page sub-routes plus 4 shared service primitives. The work is structurally identical to Phase 92: replace `bg-white/{N}` and hardcoded `backdrop-blur-{x}` with `bg-[var(--glass-{tier}-fill)]` and `backdrop-blur-[var(--glass-{tier}-blur)]` arbitrary-value classes against Phase 90's frozen tier tokens. Phase 92's `92-PATTERNS.md` archetype templates (A–J) apply directly. **No new design decisions are needed for the pattern layer.**

**Three Phase 93–specific decisions DO need to be locked in `93-CONTEXT.md` before planning:**

1. **`LeadFormSection` form-safety strategy.** The shared `LeadFormSection` (`next/src/components/sections/service/LeadFormSection.tsx:47`) wraps `ContactForm` in a Tier 0 outer card AND a Tier 2 inner panel — DOUBLE glass nesting (line 47 outer `bg-white/60 backdrop-blur-3xl` + line 72 inner `bg-white/42 backdrop-blur-2xl`). Unlike `ContactSection` which sits over a vivid blue gradient (KD-v9-003 Path A), `LeadFormSection` sits **directly over the blob field** with no occluding gradient. Decision needed: (a) preserve double-nest with both layers swept to v9 tokens (will hit anti-pattern #13 `>2 glass siblings per viewport` because outer + inner + viewport-budget chrome compounds); (b) flatten to single-tier (drop outer, keep inner Tier 2 form panel — recommended); (c) flatten to single-tier (drop inner, keep outer as form-fill panel). KD-v9-002 α=0.50 inheritance applies to whichever panel becomes Tier 2.

2. **Per-route blob-dimming policy.** ContactSection's blue gradient occlusion (KD-v9-003) does NOT propagate. **Sub-route gradient context analysis (§Per-Route Gradient Context):** none of the 4 sub-routes have a colored gradient outer wrapper — every glass surface sits over the bare blob field. So either: (a) inherit the Phase 92 "no localized blob dimming" answer wholesale (simplest, matches `/` route behavior); (b) introduce localized dimming on `LeadFormSection` because it now sits directly over the blob and form-safety contract demands stable contrast (Decision B step 5 from Phase 92 originally specified this for ContactForm). **Recommendation A.** The KD-v9-002 α=0.50 form-fill on the inner panel is the contrast safety net; localized dimming would consume compositing budget for marginal gain.

3. **Anti-bot honeypot + 3s timing trap (BL-04 deferred).** `ContactForm` is the same component reused inside `LeadFormSection` — every sub-route will inherit the BL-04 fake-success behavior (lines 62–72 silently drop sub-3s and honeypot-tripped submissions). This is NOT a Phase 93 token-migration concern, but Phase 93 will multiply the blast-radius from 1 form (`ContactSection`) to 5 forms (4 sub-routes + ContactSection). Decision needed: tag in CONTEXT.md as "carry-forward — addressed in separate fix phase" OR escalate to product before Phase 93 ships.

**Primary recommendation:** Sequence as **3 waves with explicit Wave 0 for Playwright infrastructure**:
- **Wave 0 (FOUNDATION):** install Playwright + `@playwright/test`; capture pre-Phase-93 screenshot baseline of all 4 sub-routes at desktop (1440px) + mobile (375px); commit baseline PNGs to repo or external store. Without this, ROUTE-07 has no pass/fail criterion.
- **Wave 1 (SERVICE PRIMITIVES — first):** sweep `ServiceHero`, `SocialProof`, `FAQ`, `LeadFormSection` (in `next/src/components/sections/service/`). Done first because every sub-route page imports them; sweeping primitives once propagates to 3 of 4 routes automatically.
- **Wave 2 (SUB-ROUTE PARALLEL FAN-OUT):** 4 parallel agents, one per route — `/checkup` (7 files), `/consultations` (7 files), `/treatment-abroad` (4 files), `/contacts` (0 sub-route files — only inline `<section>` in page.tsx, see §Per-Route Inventory). All 4 routes are independent; no cross-route dependency. Per-route Playwright screenshot diff after each merges.
- **Wave 3 (shadcn primitives + verification):** sweep `next/src/components/ui/*` last per highest-blast-radius rule — but **finding: shadcn primitives are consumed by 0 public-facing routes** (only `next/src/app/admin/submissions-table.tsx` imports them, the admin-only Directus submissions viewer). ROUTE-06 work is therefore admin-route-only verification + a no-regression sanity check. This dramatically de-risks Wave 3.

**Five codebase realities the planner must build around:**

1. **REQUIREMENTS.md file counts are slightly stale.** ROADMAP says "8 files in checkup, 8 files in consultations, 4 in treatment, 2 in contacts." Reality: **checkup = 7 files** (not 8 — missing the 8th the spec implied), **consultations = 7 files** (not 8), **treatment = 4 files** (matches), **contacts = 4 files exist on disk but ContactsHero/ContactMethodGrid/CoordinatorCard/TrustBadges are DEAD CODE** — `next/src/app/contacts/page.tsx` doesn't import any of them. The contacts page is now a hand-rolled inline `<section>` + `<LeadFormSection>`. This needs an explicit decision in CONTEXT.md: sweep dead code anyway (defensive), or skip and propose dead-code removal in a separate quick task.

2. **`Header.tsx` IS the rendered chrome on all routes.** `next/src/app/layout.tsx:5` imports `Header` (not `HeaderClient`). `HeaderClient.tsx` is a child component of `Header.tsx`. Phase 92 swept BOTH but only `HeaderClient.tsx` had glass surfaces; `Header.tsx` was confirmed clean (verify-only no-op per `92-08-SWEEP-AUDIT.md`). Phase 93 chrome is global (mounted in layout) and doesn't need re-sweeping — Phase 92 already covers it for sub-routes.

3. **Sub-route components use the EXACT same `bg-white/60 backdrop-blur-2xl` archetype-C pattern** as Phase 92 cards. Grep confirmed — `bg-white/60 backdrop-blur-2xl rounded-[2.5rem]` appears in nearly every checkup/consultations/treatment section. Phase 92 archetype-C template (Tier 1 → Tier 2 hover via `--glass-form-fill`) applies verbatim. Total sweep occurrences: checkup 26, consultations 37, treatment 21, contacts 1 (only `ContactsHero.tsx` — dead code). About 85 class swaps total across 18 sub-route files, plus 3–4 service primitive files.

4. **Sub-route CTA gradients exist but are TEXT gradients, not button gradients.** The `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent` pattern (used for headings) is everywhere. These are NOT CTAs and must NOT be touched (text-fill, no glass interaction). Real CTAs (`btn-primary bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-... rounded-3xl`) appear in `CheckupB2B.tsx:85`, `CheckupProgramsTurkey.tsx:132`, `ConsultationPricing.tsx:43`, plus the primary CTA inside `ServiceHero.tsx:50`. All Archetype J — never sweep.

5. **Playwright is NOT installed.** `next/package.json` carries no `@playwright/test`, no `playwright` config, no `tests/` or `e2e/` directory exists. ROUTE-07 demands "Per-route Playwright screenshot diff captured against pre-v9.0 baseline." This is **Wave 0 infrastructure work** — install Playwright as a devDependency (project allows dev tools per CLAUDE.md "production npm dependencies forbidden, dev tools only for testing"), wire `next/playwright.config.ts`, capture baseline screenshots BEFORE any sweep work begins. The "pre-v9.0 baseline" referenced in ROADMAP does not currently exist — there is no committed git tag for it. Recommended interpretation: **"pre-Phase-93 baseline"** = current sub-route renders at the time Phase 93 Wave 0 captures them. The masking story (form/CTA stable; blob region masked) requires a deterministic blob-mode override (`window.__blobDebug.setMode?.('static')` from Phase 91) so screenshot diffs are reproducible.

## Architectural Responsibility Map

Phase 93 spans only the **Frontend (CSR/RSC + browser CSS)** tier, plus a one-time **Test-infrastructure** tier introduction (Playwright Wave 0). No API/backend/storage involvement — the form `submitContactForm` server action (`@/lib/db/actions`) is FROZEN.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Sub-route component class sweep | Browser (computed CSS) | RSC build (Tailwind v4 arbitrary-value generation) | Same as Phase 92 — token registered in `globals.css :root`, consumed at paint time |
| Service-primitive sweep (`ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection`) | Browser (paint pipeline) | RSC build | Single-edit sites that propagate to 3 of 4 sub-routes |
| shadcn primitive sweep (admin-only) | Browser | — | Admin route only; not in public flow |
| Playwright screenshot diff | Test-infrastructure (Wave 0) | CI eventually (Phase 94 territory) | New tier introduction for Phase 93; uses Phase 91 `__blobDebug` to deterministically pin blob position |
| Form-safety floor on `LeadFormSection` | Browser | — | Inherits KD-v9-002 α=0.50 from Phase 92; no new token |
| Directus form submission paths | API (Directus, FROZEN) | — | ROUTE-05 success criterion 5 ("submission paths still reach Directus") is a NO-CHANGE smoke check — `submitContactForm` server action is in a frozen module |

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROUTE-01 | `/checkup` section components — per-tier sweep | Inventory: `CheckupAdvantages`, `CheckupB2B`, `CheckupProblem`, `CheckupProcess`, `CheckupProgramsKorea`, `CheckupProgramsTurkey`, `CheckupWhyUs` (7 files; spec said 8). Total `bg-white/{N}` + `backdrop-blur` occurrences across 7 files = 26. All Archetype B (section pills) + Archetype C (cards) + Archetype J (2 CTAs in CheckupB2B + CheckupProgramsTurkey). |
| ROUTE-02 | `/consultations` section components — per-tier sweep | Inventory: `ConsultationAdvantages`, `ConsultationBenefits`, `ConsultationDoctors`, `ConsultationPricing`, `ConsultationProblem`, `ConsultationProcess`, `ConsultationScenarios` (7 files; spec said 8). Total = 37 occurrences. Includes a Tier 0 frame on `ConsultationPricing.tsx:21` (single panel) + 1 Archetype J CTA at line 43. |
| ROUTE-03 | `/treatment-abroad` section components — per-tier sweep | Inventory: `TreatmentAboutUs`, `TreatmentClinics`, `TreatmentReviews`, `TreatmentSteps` (4 files). Total = 21 occurrences. No Archetype J CTA (the route-level CTA is the shared `LeadFormSection` + `FinalCTA`). |
| ROUTE-04 | `/contacts` section components — per-tier sweep | Inventory: 4 files exist on disk (`ContactsHero`, `ContactMethodGrid`, `CoordinatorCard`, `TrustBadges`) but **NONE are imported by `/contacts/page.tsx`** — they are dead code. Page renders inline `<section>` (heading) + `<LeadFormSection>` only. Decision needed: sweep dead-code defensively, or skip + propose removal. Total occurrences in dead files = 1 (ContactsHero only). |
| ROUTE-05 | Service-page primitives swept; `LeadFormSection` form-safety mirrors `ContactForm` | Inventory: `ServiceHero.tsx` (line 35 eyebrow pill, line 50 Archetype J CTA, line 73 Archetype B secondary CTA glass); `FAQ.tsx` (line 44 Archetype D closed-state, line 48 hover); `SocialProof.tsx` (line 19 Archetype C card with hover); `LeadFormSection.tsx` (line 47 outer + line 72 inner — see Decision 1 above). Total occurrences across 4 primitive files = 5 unique surfaces + 1 CTA (Archetype J in ServiceHero). |
| ROUTE-06 | shadcn primitives updated last (highest blast-radius) | Inventory: `card`, `dialog`, `input`, `select`, `textarea`, `button`, `badge`, `table` (8 files). **Consumer count = 1** (only `next/src/app/admin/submissions-table.tsx`). Public routes do NOT consume shadcn; they use direct Tailwind. Blast-radius is therefore admin-only — significantly de-risked vs. the Roadmap's framing. Only `dialog.tsx:34` carries `backdrop-blur-xs` glass surface (modal overlay). `bg-card`, `bg-popover`, `bg-input/50` tokens consumed by shadcn primitives are project tokens, not v9 glass tokens — touching them is opt-in, not required. |
| ROUTE-07 | Per-route Playwright screenshot diff vs pre-v9.0 baseline; form/CTA stable; blob masked | Playwright NOT installed. Wave 0 must install + configure + capture baseline. "Pre-v9.0 baseline" is reinterpreted as "pre-Phase-93 baseline" (current state at Wave 0 capture time). Mask strategy: blob region (`<canvas class="blob-canvas">` → `position: fixed; inset: 0; z-index: 0`) gets `mask: { paths: [{ selector: '.living-blob-field' }] }` in Playwright `toHaveScreenshot()` config. Determinism via `window.__blobDebug.setMode?.('static')` before screenshot. |

## User Constraints (from CONTEXT.md)

> **NOTE TO PLANNER:** No `93-CONTEXT.md` exists yet at research time. Phase 93 needs a discuss-phase pass before plan-phase to lock the three open decisions surfaced in §Summary (1) `LeadFormSection` nesting strategy; (2) per-route blob-dimming policy; (3) BL-04 carry-forward stance; **plus one more decision from §Per-Route Inventory** — (4) `/contacts` dead-code disposition (sweep vs skip vs delete). Treat the items below as the **planner-facing transcript** the discuss-phase output should produce.

### Locked Decisions (from upstream Phase 92 — INHERITED, not re-discussed)

- **Phase 92 Decision A — Tier mapping:** Phase 93 inherits the same Tier 0 (section) / Tier 1 (card) / Tier 2 (form, hover ramp) / Tier 3 (button) assignments. Sub-route cards and section panels follow Archetype C / Archetype B mapping verbatim from `92-PATTERNS.md`.
- **Phase 92 Decision E — Tailwind class swap, NOT utility migration:** Phase 93 uses the same arbitrary-value pattern: `bg-[var(--glass-{tier}-fill)]` + `backdrop-blur-[var(--glass-{tier}-blur)]`. NOT migration to `.liquid-card` utility classes.
- **KD-v9-002 (locked 2026-04-30):** `--glass-form-fill` desktop = 0.50. Inherited by `LeadFormSection` (whichever panel becomes the Tier 2 form panel after Decision 1).
- **KD-v9-003 (locked 2026-04-30):** ContactSection Path A blue-gradient occlusion sanctions `localized blob dimming = N/A`. **Does NOT auto-propagate** — Phase 93 needs its own blob-dimming decision per §Summary item 2.
- **CTA opaque-forever rule (Phase 90 master list):** every sub-route CTA gradient (`bg-gradient-to-r from-mu-blue to-mu-accent-blue`) is Archetype J — NEVER swept. Verified grep target list in §Code Examples.
- **Frozen ranges from Phase 92 Decision I (still frozen):** `next/src/styles/blob.css`, `next/src/lib/blob-engine/*`, `next/src/app/globals.css` token blocks (KD-v9-002 single exception already taken — no further token escalation in Phase 93), `useSpecularHighlight.ts`, `SvgRefractionDefs.tsx`, `DESIGN.md`, `liquid-glass.css` `@a11y-layer-coverage` block.
- **Anti-pattern #4–#15 enforcement (Phase 92 Decision H):** Phase 93 plans MUST grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks. Specifically: #4 fills > 0.16 (Tier 2 mobile = 0.18 form-safety exception is sanctioned), #5 green tint on cards (heat-leak via `radial-gradient` is sanctioned only on `.liquid-card`/`.liquid-regular` utility consumers — sub-route components are class-swap, NOT utility, so heat-leak is delivered exclusively by `backdrop-filter` blurring the moving blob), #13 ≤2 glass per viewport.

### Claude's Discretion (Phase 93–specific)

These four items are NOT yet locked and should be the focus of `/gsd-discuss-phase 93`:

1. **`LeadFormSection` nesting strategy** (§Summary 1). Recommended: flatten outer wrapper, keep inner Tier 2 form panel. KD-v9-002 α=0.50 applies to inner panel.
2. **Per-route blob-dimming policy** (§Summary 2). Recommended: inherit Phase 92 "no localized blob dimming" answer wholesale.
3. **BL-04 (anti-bot fake-success) carry-forward** (§Summary 3). Recommended: tag as "carry-forward — addressed in separate fix phase" with a flag in 93-CONTEXT.md `<deferred>` block.
4. **`/contacts` dead-code disposition** (§Per-Route Inventory). Recommended: skip the 4 unused contacts/* files (do not sweep dead code) AND open a quick task to delete them post-Phase-93 — but check git history first to confirm they're truly orphaned vs. temporarily detached for redesign.
5. **Per-route screenshot baseline source** (§Standard Stack — Playwright). Recommended: capture at Wave 0 from current sub-route renders (interpret "pre-v9.0 baseline" as "pre-Phase-93 baseline"). Alternative: recover historical state from a git tag — feasible but heavyweight.
6. **shadcn `card.tsx` admin-route v9 token migration**: optional (admin route is private). Recommended: skip, leave `bg-card` token as-is. Sweep `dialog.tsx:34` ONLY because it's the only public-affecting shadcn surface (modals can be triggered from any route in principle, even though none currently are).

### Deferred Ideas (OUT OF SCOPE for Phase 93)

- **Lighthouse CI mobile-throttled gates** → Phase 94 HARD GATE (VER-04)
- **Real-device manual UAT (iPhone iOS, low-end Android, desktop tri-browser)** → Phase 94 HARD GATE (VER-05)
- **axe-core / Pa11y across 4 routes × 3 blob positions** → Phase 94 (VER-06)
- **Brand visual review vs medicusunion.com side-by-side** → Phase 94 (VER-07)
- **Playwright leak test across 5-route navigation cycle (`rafCount === 1`)** → Phase 94 (VER-03 — needs the Wave 0 Playwright infra Phase 93 ships, but the leak test itself is Phase 94)
- **BL-01 mobile filter-chain saturate clobber fix** — deferred Phase 92, NOT Phase 93 territory (per `92-REVIEW-FIX.md`); will land in a separate fix phase
- **`/contacts` dead-code deletion** — quick task post-Phase-93, NOT a Phase 93 task

## Project Constraints (from CLAUDE.md)

- **Stack:** Next.js + React + TypeScript + Tailwind v4. Phase 93 is React/Tailwind territory — same as Phase 92.
- **Language:** Russian-only copy. Phase 93 introduces zero new copy strings — preserve all existing nbsp-bound text (e.g., `MedicusUnion&nbsp;`, `за&nbsp;границей`, `Самый&nbsp;точный диагноз`).
- **Design:** Mobile-first, audience 45+, large type, high contrast, mobile blur ≤12px, ≤2 glass elements per viewport, dark-mode disables `backdrop-filter`. **Sub-route cards count toward the per-viewport budget the same way `/` route cards do** — service-page hero + 1 card grid often hits 2 simultaneously visible glass surfaces; multi-card sections (e.g., `ConsultationDoctors` with 7 doctor cards) regularly exceed 2-per-viewport on desktop scroll. This is a Phase-92-grandfathered exception per `92-PATTERNS.md` Sanctioned exception (4 services-on-desktop documented). Phase 93 inherits the exception.
- **Backend:** Directus 11 + PostgreSQL — frozen for Phase 93. Form submission paths verified by manual smoke test per route (ROUTE-05 success criterion 5).
- **Brand color parity:** No new colors introduced.
- **Apple Liquid Glass HIG compliance:** Mobile blur cap ≤12px enforced via Phase 90 token clamp; `prefers-reduced-{transparency,motion}` and `prefers-contrast: more` honored via Phase 92 BL-02 fix (token rewrite at `:root` propagates to all v9-token consumers including Phase 93 sub-route components — automatic coverage, no per-component a11y wiring needed).
- **GSD Workflow Enforcement:** `/gsd:execute-phase` is the entry point.
- **Russian-only copy + nbsp-binding** (from MEMORY): Phase 93 sweeps are class-only — preserve all nbsp text and React `{'\u00A0'}` JSX patterns verbatim.
- **No emojis** in writing.

## Standard Stack

### Core (already in repo — no installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4 | Class-based styling | Project standard; Phase 93 uses arbitrary-value classes per Phase 92 Decision E |
| Next.js App Router | 15.5.15 | RSC + CSR | Sub-route page.tsx files are RSC; `FAQ.tsx` is `'use client'`; `ContactForm.tsx` is `'use client'` |
| React | 19.1.0 | UI runtime | — |
| `lucide-react` | 1.8.0 | Icons | Frozen — no new icons |
| `framer-motion` | 12.38.0 | Used by `ScrollReveal` motion wrapper | Frozen |
| `@base-ui/react` | 1.3.0 | Headless primitives backing shadcn `Dialog`, `Input`, `Select` | Frozen |

### Wave 0 — NEW devDependency required

| Tool | Version | Purpose | Install command |
|------|---------|---------|-----------------|
| `@playwright/test` | latest stable (1.49+ as of 2026-04-30; verify `npm view @playwright/test version`) | Per-route screenshot diff (ROUTE-07); reuse for Phase 94 leak/UAT/a11y tests | `pnpm --dir next add -D @playwright/test` then `pnpm --dir next exec playwright install` |

[ASSUMED] Latest stable Playwright is 1.49+ as of 2026-04-30. **Verification required at Wave 0** — run `pnpm --dir next info @playwright/test version` and pin in `package.json`. The Roadmap's framing of "Per-route Playwright screenshot diff" is the standard `expect(page).toHaveScreenshot()` API which has stable behavior since Playwright 1.20.

### Sub-route component file inventory (every Phase 93 target with consumer count)

**`/checkup` (7 files, 26 sweep occurrences):**

| Component | File path | Sweep occurrences | Archetype |
|-----------|-----------|--------------------|-----------|
| `CheckupAdvantages` | `next/src/components/sections/checkup/CheckupAdvantages.tsx` | 8 | C (4 cards + 4 inner icon chips) |
| `CheckupB2B` | `next/src/components/sections/checkup/CheckupB2B.tsx` | 3 cards + **1 Archetype J CTA at line 85** | C + J |
| `CheckupProblem` | `next/src/components/sections/checkup/CheckupProblem.tsx` | 3 cards + 3 inner icon chips | C |
| `CheckupProcess` | `next/src/components/sections/checkup/CheckupProcess.tsx` | 1 card grid (4×) | C |
| `CheckupProgramsKorea` | `next/src/components/sections/checkup/CheckupProgramsKorea.tsx` | 3 (1 card class string + 1 badge variant + 1 highlighted variant) | B + C (variant-class strings) |
| `CheckupProgramsTurkey` | `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx` | 4 (B2B card frame + 2 program-card variants + 1 badge variant) + **1 Archetype J CTA at line 132** | B + C + J |
| `CheckupWhyUs` | `next/src/components/sections/checkup/CheckupWhyUs.tsx` | 1 card grid (4×) | C |

> **Spec discrepancy:** REQUIREMENTS.md ROUTE-01 says "8 files." Reality: 7 files on disk. The 8th file the spec implied does not exist. Treat the 7 as canonical inventory.

**`/consultations` (7 files, 37 sweep occurrences):**

| Component | File path | Sweep occurrences | Archetype |
|-----------|-----------|--------------------|-----------|
| `ConsultationAdvantages` | `…/consultations/ConsultationAdvantages.tsx` | 10 (5 cards + 5 inner icon chips) | C + decorative inner |
| `ConsultationBenefits` | `…/consultations/ConsultationBenefits.tsx` | 8 (4 cards + 4 inner icon chips) | C + decorative inner |
| `ConsultationDoctors` | `…/consultations/ConsultationDoctors.tsx` | 11 (1 outer panel + 7 doctor cards + 1 spec-pills container + 2 spec pills + 1 secondary CTA glass) | B + C + Archetype B (secondary CTA glass) |
| `ConsultationPricing` | `…/consultations/ConsultationPricing.tsx` | 2 (1 frame + 1 inner badge) + **1 Archetype J CTA at line 43** | B + J |
| `ConsultationProblem` | `…/consultations/ConsultationProblem.tsx` | 1 (single panel) | B |
| `ConsultationProcess` | `…/consultations/ConsultationProcess.tsx` | 3 cards (Tier 1 → Tier 2 hover) | C |
| `ConsultationScenarios` | `…/consultations/ConsultationScenarios.tsx` | 2 (1 panel + 1 inner checkmark chip) | B + decorative inner |

> **Spec discrepancy:** REQUIREMENTS.md ROUTE-02 says "8 files." Reality: 7 files on disk.

**`/treatment-abroad` (4 files, 21 sweep occurrences):**

| Component | File path | Sweep occurrences | Archetype |
|-----------|-----------|--------------------|-----------|
| `TreatmentAboutUs` | `…/treatment/TreatmentAboutUs.tsx` | 8 | C (counted at grep level; per-line breakdown deferred to plan phase) |
| `TreatmentClinics` | `…/treatment/TreatmentClinics.tsx` | 8 | C |
| `TreatmentReviews` | `…/treatment/TreatmentReviews.tsx` | 1 | (review card with `gradient: 'from-mu-blue to-mu-accent-blue'` driven by data — not a CTA) |
| `TreatmentSteps` | `…/treatment/TreatmentSteps.tsx` | 4 | B + C |

**`/contacts` (file inventory ≠ rendered inventory):**

| Component | File path | Imported by `/contacts/page.tsx`? | Disposition |
|-----------|-----------|------------------------------------|-------------|
| `ContactsHero` | `…/contacts/ContactsHero.tsx` | NO | DEAD CODE — 1 sweep occurrence, skip per Discretion item 4 |
| `ContactMethodGrid` | `…/contacts/ContactMethodGrid.tsx` | NO | DEAD CODE — uses `.liquid-card` utility (already covered by Phase 92 GLASS-10 utility re-pointing) |
| `CoordinatorCard` | `…/contacts/CoordinatorCard.tsx` | NO | DEAD CODE |
| `TrustBadges` | `…/contacts/TrustBadges.tsx` | NO | DEAD CODE |

**Actual `/contacts` rendered tree:**
- `next/src/app/contacts/page.tsx` lines 23–32: inline `<section>` heading panel — uses `bg-gradient-to-b from-[#F0F7FF] to-white` (cosmetic page-frame gradient, not glass-tier; no sweep needed)
- `LeadFormSection` (shared service primitive — covered by ROUTE-05)

> **Spec discrepancy:** REQUIREMENTS.md ROUTE-04 says "2 section files." Reality: 0 rendered section files; 4 dead-code files on disk. Without dead-code sweep decision (Discretion item 4), ROUTE-04 may be a no-op task.

**Service primitives (4 files, 5+1 sweep occurrences):**

| Component | File path | Sweep occurrences | Archetype |
|-----------|-----------|--------------------|-----------|
| `ServiceHero` | `…/service/ServiceHero.tsx` | line 35 (eyebrow pill — Archetype B) + line 73 (secondary CTA glass — Archetype B) + **line 50 Archetype J CTA** | B + B + J |
| `FAQ` | `…/service/FAQ.tsx` | line 44 (closed item wrapper — Archetype D Tier 1) + line 48 (button hover — Tier 2) | D |
| `SocialProof` | `…/service/SocialProof.tsx` | line 19 (card grid — Archetype C with hover) | C |
| `LeadFormSection` | `…/service/LeadFormSection.tsx` | **line 47 outer wrapper (Tier 0) + line 72 inner form panel (Tier 2 KD-v9-002 α=0.50)** + line 19 inner checkmark chip | F + nesting decision |

**shadcn primitives (8 files, public-impact ≈ 0):**

| Component | File path | Public route consumer? | Sweep needed? |
|-----------|-----------|------------------------|---------------|
| `card.tsx` | `next/src/components/ui/card.tsx` | NO (only admin) | Optional. Uses `bg-card` token. Skip recommended. |
| `dialog.tsx` | `…/ui/dialog.tsx` | NO (no public modal triggers) but capability exists | **Sweep `:34` `bg-black/10 ... supports-backdrop-filter:backdrop-blur-xs`** — modal overlay is the only glass surface. Use Tier 0 token if/when a public modal lands. |
| `input.tsx` | `…/ui/input.tsx` | NO (only admin) | Skip (uses `bg-transparent` — already opaque-friendly) |
| `select.tsx` | `…/ui/select.tsx` | NO (only admin) | Skip |
| `textarea.tsx` | `…/ui/textarea.tsx` | NO (only admin) | Skip |
| `button.tsx`, `badge.tsx`, `table.tsx` | `…/ui/{button,badge,table}.tsx` | NO (only admin) | Skip |

**Consumer grep verified:** `from '@/components/ui/(card\|dialog\|input\|select\|textarea\|button\|badge\|table)'` matches **only** `next/src/app/admin/submissions-table.tsx`. Public-facing routes do not import shadcn — the route components use direct Tailwind classes per Phase 92 Decision E.

### Per-Route Gradient Context Analysis

**Goal:** Determine whether each sub-route has a colored-gradient outer wrapper that occludes the blob (analogous to ContactSection's blue gradient → KD-v9-003) or sits directly over the blob field. This drives the per-route blob-dimming decision (§Summary item 2).

| Route | Page-level outer | Per-section gradient context | Blob occlusion? |
|-------|------------------|------------------------------|------------------|
| `/checkup` | None — `<>` fragment with `<ServiceHero>` first | No outer-wrapper colored gradients. ServiceHero has no background. SocialProof, all checkup sections, FAQ, LeadFormSection → all sit directly over the blob field. | NO occlusion — blob fully visible behind every glass surface |
| `/consultations` | None | Same as `/checkup` — no outer-wrapper gradient; all sections sit over the bare blob field. `ConsultationPricing` has its own internal panel framing but no gradient outer. | NO occlusion |
| `/treatment-abroad` | None | Same — no outer-wrapper gradient | NO occlusion |
| `/contacts` | `<section className="... bg-gradient-to-b from-[#F0F7FF] to-white">` (page.tsx:23) — but this is a SOFT vertical gradient (very pale blue → white), NOT a vivid blue. Plus `<LeadFormSection>` is OUTSIDE the gradient `<section>` (separate sibling) | LeadFormSection sits directly over blob field. | NO occlusion for LeadFormSection — gradient only wraps the heading hero |

**Conclusion:** ContactSection's KD-v9-003 architectural fact (blue gradient occludes blob) is **route-specific** and does NOT generalize. Phase 93 sub-routes have NO equivalent occluding gradient. Therefore:
- The "localized blob dimming" Decision B step 5 from Phase 92 (originally specced for ContactForm) IS architecturally meaningful for `LeadFormSection` (it sits over the blob), unlike `ContactSection` (it didn't, hence Path A).
- BUT: the KD-v9-002 α=0.50 form-fill on the inner panel is a strong contrast safety net — body copy contrast on a 0.50 white panel composited over the moving blob remains ≥4.5:1 across blob luminance (theoretical proof similar to PROJECT.md:189 KD-v9-002 derivation).
- **Recommendation (Discretion item 2):** inherit "no localized blob dimming" wholesale. Verify body-copy contrast on `LeadFormSection` body via Chrome DevTools contrast picker at Wave 1, with blob parked at heat=1 and blob centroid centered under form. If <4.5:1 → escalate `--glass-form-fill` per existing KD-v9-002 path (no new Key Decision needed; just verify token already at 0.50 is sufficient). Theoretical contrast at α=0.50 over the brightest blob luminance ≈ 4.6:1 (mirrors KD-v9-002 calc).

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Browser Document (any route)                     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  layout.tsx (FROZEN by Phase 90/92)                                │  │
│  │   ├─ <html data-blob-mode="..."> :root tokens (FROZEN)            │  │
│  │   ├─ <Header />            (Phase 92 swept; route-agnostic)       │  │
│  │   ├─ <main>{children}</main>  ← per-route page.tsx renders here    │  │
│  │   ├─ <Footer />           (Phase 92 swept; route-agnostic)        │  │
│  │   ├─ <StickyBar />        (Phase 92 swept; route-agnostic)        │  │
│  │   └─ <LivingBlobField />  (Phase 91 frozen)                        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              ▲                                           │
│                              │ var() reads                               │
│                              │                                           │
│  ┌───────────────────────────┴─────────────────────────────────────────┐ │
│  │  z-0  .living-blob-field (FROZEN — writes --blob-x/y/heat to :root)│ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │  z-1..10  PHASE 93 SWEEP TARGETS                                    │ │
│  │   ┌─────────────────────────────────────────────────────────────┐   │ │
│  │   │ /checkup page.tsx                                           │   │ │
│  │   │   ├─ ServiceHero          ← shared (Wave 1)                 │   │ │
│  │   │   ├─ SocialProof          ← shared (Wave 1)                 │   │ │
│  │   │   ├─ CheckupProblem · CheckupAdvantages · CheckupWhyUs ·    │   │ │
│  │   │   │   CheckupProgramsKorea · CheckupProgramsTurkey ·         │   │ │
│  │   │   │   CheckupProcess · CheckupB2B    ← Wave 2 agent A        │   │ │
│  │   │   ├─ FAQ                  ← shared (Wave 1)                 │   │ │
│  │   │   ├─ LeadFormSection      ← shared (Wave 1) ★KD-v9-002       │   │ │
│  │   │   └─ FinalCTA             ← Phase 92 already swept            │   │ │
│  │   ├─────────────────────────────────────────────────────────────┤   │ │
│  │   │ /consultations page.tsx (similar pattern, Wave 2 agent B)    │   │ │
│  │   │   7 ConsultationXxx components                                │   │ │
│  │   ├─────────────────────────────────────────────────────────────┤   │ │
│  │   │ /treatment-abroad page.tsx (Wave 2 agent C)                  │   │ │
│  │   │   4 TreatmentXxx components                                   │   │ │
│  │   ├─────────────────────────────────────────────────────────────┤   │ │
│  │   │ /contacts page.tsx (Wave 2 agent D — minimal)                │   │ │
│  │   │   inline <section> + LeadFormSection (already Wave 1)         │   │ │
│  │   │   contacts/* dead code — skip (Discretion item 4)             │   │ │
│  │   └─────────────────────────────────────────────────────────────┘   │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │  Wave 3: shadcn primitives (admin-only impact)                      │ │
│  │   - dialog.tsx:34 modal overlay → Tier 0 token                      │ │
│  │   - card/input/select/textarea — skip (use bg-card / bg-transparent)│ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Wave 0: Playwright infrastructure (new tier introduction)               │
│   - install @playwright/test                                             │
│   - playwright.config.ts: 4 routes × {desktop 1440px, mobile 375px}      │
│   - capture pre-Phase-93 baseline screenshots                            │
│   - Mask: { paths: [{ selector: '.living-blob-field' }] }                │
│   - Determinism: window.__blobDebug.setMode?.('static')                  │
│                                                                          │
│  Wave Verification: ROUTE-05 success-criterion-5 — submission smoke test │
│   - submitContactForm (FROZEN server action) reachable from each route   │
│   - manual Directus admin UI check after each route's LeadFormSection   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Pattern 1: Inherit Phase 92 Archetype Templates verbatim

**What:** All 5 archetypes (A=Chrome / B=Section frame / C=Tier-1 hover-card / D=Open-state-toggle / J=CTA opaque-forever) from `92-PATTERNS.md` apply unchanged to Phase 93 sub-route components.

**When to use:** Every Phase 93 class swap.

**Example (typical sub-route card — drawn from `CheckupProblem.tsx:15`):**

```tsx
// BEFORE (current state):
<div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">

// AFTER (Phase 93 archetype-C swap, no hover state on this particular card):
<div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
```

**Hover-state cards (e.g., `ConsultationProcess.tsx:11` — has `hover:bg-white/80`):**

```tsx
// BEFORE:
<div className="bg-white/60 backdrop-blur-2xl ... hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg ...">

// AFTER (Tier 1 → Tier 2 hover ramp via --glass-form-fill, per Phase 92 archetype C):
<div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] ... hover:bg-[var(--glass-form-fill)] hover:border-white/80 hover:shadow-glass-lg ...">
```

### Pattern 2: `LeadFormSection` Tier 2 form-safety with KD-v9-002 inheritance (RECOMMENDED — Discretion item 1, option b)

**What:** Flatten the double-nested glass on `LeadFormSection.tsx`. Drop the outer Tier 0 wrapper → keep the inner Tier 2 form panel.

**Where:** `next/src/components/sections/service/LeadFormSection.tsx` lines 47 + 72.

**Example:**

```tsx
// BEFORE (LeadFormSection.tsx:47 + 72 — double nesting):
<section className="container mx-auto mb-16 px-4 lg:px-6" id={id}>
  <div className="rounded-[3.5rem] border border-white/60 bg-white/60 p-6 shadow-glass-lg backdrop-blur-3xl md:p-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
      {/* … */}
      <div>
        <div className="rounded-[2.5rem] border border-white/60 bg-white/42 p-5 shadow-glass backdrop-blur-2xl sm:p-7 md:p-9">
          <ContactForm />
        </div>
      </div>
    </div>
  </div>
</section>

// AFTER (flatten outer, keep Tier 2 inner with KD-v9-002 α=0.50):
<section className="container mx-auto mb-16 px-4 lg:px-6" id={id}>
  <div className="rounded-[3.5rem] p-6 md:p-12">                               {/* outer: NO glass */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
      {/* … */}
      <div>
        <div className="rounded-[2.5rem] border border-white/60 bg-[var(--glass-form-fill)] p-5 shadow-glass backdrop-blur-[var(--glass-form-blur)] sm:p-7 md:p-9">
          <ContactForm />
        </div>
      </div>
    </div>
  </div>
</section>
```

**Why flatten:** anti-pattern #13 (≤2 glass siblings per viewport) is currently violated on every sub-route page that renders `LeadFormSection` — outer Tier 0 + inner Tier 2 + nearby `<FAQ>` Tier 1 cards = 3+ glass on the same viewport at 1440px. Dropping the outer eliminates the violation and aligns with Phase 92 ContactSection Path A behavior (a single Tier 2 form panel, no outer glass framing).

**Alternative: Discretion item 1 option (a)** — preserve double-nest, sweep both. Will hit anti-pattern #13 on every sub-route. Not recommended.

### Pattern 3: Sub-route TEXT gradient preservation (NEVER swept)

**What:** Distinguish heading TEXT gradients (`bg-gradient-to-r ... bg-clip-text text-transparent`) from CTA gradients. TEXT gradients are NOT glass surfaces and NEVER touched.

**Where:** Every sub-route section heading (e.g., `CheckupProblem.tsx:6`, `ConsultationBenefits.tsx:6`, `TreatmentAboutUs.tsx:5`, etc. — 17+ occurrences across sub-routes).

**Example (canonical pattern):**

```tsx
<span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
  Heading
</span>
```

**Identification rule:** A `bg-gradient-to-*` paired with `bg-clip-text text-transparent` is text-fill — never swept. A `bg-gradient-to-*` paired with `text-white px-... rounded-...` is a CTA — Archetype J, never swept (CTA opaque-forever).

### Pattern 4: Wave 0 Playwright per-route screenshot diff (NEW — Phase 93 introduces)

**What:** Capture pre-Phase-93 baseline screenshots before any sweep work begins. After each Wave 2 route ships, run Playwright to compare against baseline; flag form/CTA region diffs as failures, blob region as expected-different.

**File scaffold (proposed at `next/playwright.config.ts`):**

```ts
// Source: Playwright official docs — https://playwright.dev/docs/test-configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-375', use: { ...devices['Pixel 5'], viewport: { width: 375, height: 812 } } },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // forgive minor antialiasing
    },
  },
});
```

**Test file scaffold (proposed at `next/tests/route-baselines.spec.ts`):**

```ts
// Source: Playwright official docs — https://playwright.dev/docs/test-snapshots
import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/checkup', '/consultations', '/treatment-abroad', '/contacts'];

for (const route of ROUTES) {
  test(`${route} stable under static blob`, async ({ page }) => {
    await page.goto(route);
    // Determinism: pin blob to static mode so every run renders identically
    await page.evaluate(() => {
      // @ts-expect-error — Phase 91 dev-only debug surface
      window.__blobDebug?.setMode?.('static');
    });
    await page.waitForTimeout(500); // settle paint
    // Mask blob layer so blob-region differences don't fail screenshot comparison
    await expect(page).toHaveScreenshot({
      mask: [page.locator('.living-blob-field')],
      fullPage: true,
    });
  });
}
```

[CITED: Playwright docs — playwright.dev/docs/test-snapshots and playwright.dev/docs/test-configuration].

[ASSUMED] `window.__blobDebug.setMode` is the canonical hook — REQUIREMENTS.md BLOB-12 specifies `window.__blobDebug.rafCount` exists; the `setMode` method should exist alongside but Phase 91 implementation should be confirmed. If `setMode` doesn't exist, fallback: pre-render with `prefers-reduced-motion: reduce` emulation via Playwright `page.emulateMedia({ reducedMotion: 'reduce' })` — Phase 91 BLOB-07 sets blob to static under that media query.

### Anti-Patterns to Avoid

- **Sweeping text gradients** — `bg-clip-text text-transparent` is NEVER touched. The grep gate must distinguish CTA gradients from text gradients.
- **Swapping CTA gradients to glass tokens** — Archetype J inviolable. Phase 92's CTA invariant grep applies to Phase 93 file set (extended target list in §Code Examples).
- **Adding heat-leak `radial-gradient` rules to sub-route sections** — heat-leak lives on `.liquid-card` / `.liquid-regular` utility classes (Phase 92 GLASS-10, lines 178/344 in `liquid-glass.css`). Sub-route components are class-swap (Decision E), NOT utility-class consumers — do NOT add `radial-gradient(... at var(--blob-x) var(--blob-y) ...)` to individual TSX files. Heat-leak optical response is delivered via `backdrop-filter` blurring the moving blob field underneath (same answer as Phase 92 §No-Analog-Found note 6).
- **Re-sweeping Phase 92 components imported by sub-routes** — `<FinalCTA>` is imported by `/checkup/page.tsx:6`, `/consultations/page.tsx:13`, `/treatment-abroad/page.tsx:6`. Phase 92 already swept it; do NOT re-edit.
- **Re-sweeping shared chrome (`Header`, `Footer`, `StickyBar`, `MobileMenu`)** — global, mounted in `layout.tsx`, Phase 92 swept once. Phase 93 inherits.
- **Adding new tokens to `globals.css`** — Decision I freeze persists. KD-v9-002's α=0.50 is the ONLY token escalation taken; no further token escalation in Phase 93.
- **Modifying `liquid-glass.css`** — Phase 92 GLASS-10 swept all utility classes. Phase 93 has NO `liquid-glass.css` work (one exception: ContactMethodGrid uses `.liquid-card` utility but it's dead code — skip).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-route screenshot diff | Custom Puppeteer / canvas-diff scripts | Playwright `expect(page).toHaveScreenshot()` | Mature, maintained API; built-in mask support; deterministic; Phase 94 reuses for UAT |
| Blob-region masking | Manual cropping in image post-processing | Playwright `mask: [page.locator('.living-blob-field')]` | First-class API; renders mask-color over the masked region during comparison |
| Determinism pinning | Time-of-day / random-seed hacks | `window.__blobDebug.setMode?.('static')` (Phase 91 dev surface) OR `page.emulateMedia({ reducedMotion: 'reduce' })` | Phase 91 already exposes the debug hook; reduced-motion is a Playwright native API |
| Anti-bot honeypot logic | Custom client-side timing traps | Server-side rate-limiting + `suspectedBot: true` tagging | BL-04 carry-forward — out of scope for Phase 93 sweep but flag in CONTEXT.md |
| Form-safety fill calculation | Pixel-shader contrast math at runtime | KD-v9-002 frozen `--glass-form-fill: 0.50` | Theoretical-contrast computation already done in PROJECT.md:189; reuse |
| Anti-pattern #13 enforcement (≤2 glass per viewport) | Per-component layer-counting JS | Manual DevTools "Layers" panel inspection per route at Wave 2 verification | Same answer as Phase 92 — no programmatic gate |
| Per-route a11y scan (axe-core, Pa11y) | Phase 93 Playwright tests | DEFER to Phase 94 (VER-06) | Phase 93 stays scope-bounded — only screenshot diff |

**Key insight:** Phase 93 is a maintenance phase, not a creative one. Every architectural decision has already been made by Phase 90/91/92. The only NET-NEW work is (1) Wave 0 Playwright infrastructure, (2) two locked decisions in CONTEXT.md (`LeadFormSection` flatten + dead-code disposition), (3) one test of KD-v9-002 inheritance to `LeadFormSection`. Resist the urge to "improve" anything beyond mechanical class swaps.

## Runtime State Inventory

> Not applicable. Phase 93 is not a rename / refactor / migration phase — it is a class-swap sweep with no impact on stored data, live-service config, OS-registered state, secrets, or build artifacts.

**Verified:** No database keys, env var names, OS task descriptions, SOPS keys, or installed binaries reference any of the swept class strings or component file paths. Sub-routes share routing with the existing Next.js App Router (FROZEN) — no URL changes. Form submissions continue through `submitContactForm` server action (FROZEN module).

## Common Pitfalls

### Pitfall 1: `LeadFormSection` double-glass nesting compounds blur on mobile

**What goes wrong:** Current `LeadFormSection.tsx` has outer `bg-white/60 backdrop-blur-3xl` (line 47) WRAPPING inner `bg-white/42 backdrop-blur-2xl` (line 72). On mobile (<768px), the Phase 90 token clamp returns 12px for both, so blur compounds: rendered effective blur ≈ 24px on the form's children — text becomes muddier than intended. Plus anti-pattern #13 (≤2 glass per viewport).

**Why it happens:** `LeadFormSection` was designed pre-v9 with a "card-on-card" visual hierarchy. v9.0's "blob is the only opaque object" philosophy demands flatter glass.

**How to avoid:** Adopt Pattern 2 (flatten outer, keep Tier 2 inner — Discretion item 1 option b).

**Warning signs:** DevTools "Layers" panel shows nested `backdrop-filter` compositors on form children; mobile renders show form text noticeably softer than text on neighboring cards.

### Pitfall 2: Sweeping text gradients

**What goes wrong:** Naive grep-and-replace on `from-mu-blue` would touch the 17+ heading text-gradients across sub-routes, breaking every sub-route's visual identity.

**Why it happens:** Heading gradients use `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent` — superficially similar to CTA gradients.

**How to avoid:** Plans MUST enumerate exact line numbers per file. Generic grep-replace is forbidden. The 92-PATTERNS.md per-file table approach (cite archetype + line number + before/after string) ports directly to Phase 93.

**Warning signs:** A Playwright screenshot diff at Wave 2 shows section headings rendered with solid color instead of gradient text — the regression marker.

### Pitfall 3: Re-sweeping shared `<FinalCTA>` from sub-route plans

**What goes wrong:** Sub-route page.tsx files import `<FinalCTA>` (already-Phase-92-swept). A naive Phase 93 plan that "sweeps every component on `/checkup`" would re-edit FinalCTA.tsx — risk of merge conflicts with Phase 92's history and double-sweep regression.

**Why it happens:** The page.tsx import surface enumerates every component but doesn't distinguish "Phase 92 territory (shared globally-mounted chrome and shared sections)" from "Phase 93 territory (sub-route-specific sections + service primitives)."

**How to avoid:** CONTEXT.md must explicitly list "DO NOT re-edit" files — `FinalCTA.tsx`, `ContactForm.tsx`, `ContactSection.tsx`, all `next/src/components/layout/*.tsx`, `next/src/components/sections/{HeroHub,StatsBar,ServicesGrid,…}` (all 11 `/`-route Phase-92 components). The grep gate at Wave 2 verification should diff sub-route plans' modified-files list against the Phase 92 swept-files list and reject overlap.

**Warning signs:** `git log --diff-filter=M --since="2026-04-30" -- next/src/components/sections/FinalCTA.tsx` shows commits authored during Phase 93 (post-Phase-92 close).

### Pitfall 4: Playwright baseline drift between Wave 0 capture and Wave 2 comparison

**What goes wrong:** Wave 0 captures baseline at e.g. commit `T0`. Wave 2 work proceeds across several days; underlying environment changes (font caches, timezone, system color profile) cause non-deterministic pixel diffs even for unchanged regions.

**Why it happens:** Screenshot diff is sensitive to environment.

**How to avoid:** (a) Pin Playwright version in package.json; (b) Run Wave 0 capture and Wave 2 comparison on the same OS/Chromium version; (c) Use `maxDiffPixels: 100` tolerance (already in proposed config); (d) Phase 94 will run baseline-refresh in CI on a known-clean image.

**Warning signs:** Wave 2 comparisons fail on `/` route (which Wave 0 captured but Phase 93 doesn't touch) — indicates environment drift, not regression.

### Pitfall 5: shadcn `dialog.tsx:34` `backdrop-blur-xs` looks fine empty but breaks under blob

**What goes wrong:** Modal overlay currently `bg-black/10 supports-backdrop-filter:backdrop-blur-xs` (~4px Tailwind default). On a public route with a triggered modal, the v9.0 blob would visibly bleed through the 0.10 black overlay, making modal content compete with blob luminance.

**Why it happens:** shadcn defaults assume an opaque page background; v9.0 has a transparent page over a moving blob.

**How to avoid:** If/when a public modal lands (none currently), sweep `dialog.tsx:34` to use Tier 0 token (`bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`) OR introduce a stronger overlay (`bg-black/30 backdrop-blur-md`). For Phase 93 ROUTE-06, recommendation: leave shadcn alone (admin-only impact) and document in CONTEXT.md that any future public modal trigger MUST land alongside a `dialog.tsx` sweep.

**Warning signs:** Future feature work introduces a `<Dialog>` import in any public route component → triggers Phase 93's no-public-shadcn-impact assumption.

### Pitfall 6: BL-04 (anti-bot fake-success) blast-radius multiplication

**What goes wrong:** Phase 92's `ContactForm` has the BL-04 deferred bug — sub-3s legitimate submissions silently dropped while UI shows success. Phase 93 reuses `ContactForm` inside `LeadFormSection` on 4 sub-routes. After Phase 93, the bug surface area scales 5×.

**Why it happens:** `ContactForm` is the shared form component; `LeadFormSection` wraps it; sub-routes import LeadFormSection.

**How to avoid:** Phase 93 does NOT fix BL-04 (it's a Phase 92 deferred carry-forward). BUT 93-CONTEXT.md `<deferred>` block MUST flag the multiplication risk so the team is aware. Recommended companion: open a quick-task to address BL-04 before Phase 94 ships (Phase 94 real-device UAT will surface it on every route, not just `/`).

**Warning signs:** Phase 94 manual UAT records show "submitted form, saw success, no record in Directus admin" on multiple routes — confirms the multiplied surface area.

## Code Examples

### Sub-route card sweep (Archetype C with hover, drawn from `ConsultationBenefits.tsx:14`)

```tsx
// BEFORE:
<div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">

// AFTER (Tier 1 base; Tier 2 hover ramp via --glass-form-fill; cosmetic border + shadow stay):
<div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
```

Note: this card has no `hover:bg-*` in source — hover ramp is shadow + border-color only. Optional: add `hover:bg-[var(--glass-form-fill)]` per planner judgment to hit Tier 2 fill on hover (Phase 92 archetype-C template suggests it).

### Sub-route Tier 0 frame (Archetype B, drawn from `ConsultationPricing.tsx:21`)

```tsx
// BEFORE:
<div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-glass-lg max-w-xl mx-auto">

// AFTER:
<div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-glass-lg max-w-xl mx-auto">
```

### Sub-route inner-decorative chip (color-tinted — keep brand color, swap blur to button token)

```tsx
// BEFORE (e.g. ConsultationBenefits.tsx:15):
<div className="w-14 h-14 bg-mu-blue/10 backdrop-blur-xl rounded-2xl ...">

// AFTER (preserve brand color tint, standardize blur token):
<div className="w-14 h-14 bg-mu-blue/10 backdrop-blur-[var(--glass-button-blur)] rounded-2xl ...">
```

This is anti-pattern #5 SAFE because the green/blue/teal tint comes from brand palette tokens (`bg-mu-blue/10`, `bg-mu-accent-teal-bg`, `bg-mu-green-50`), not a static green-on-card violation. Phase 92 made the same call on `WhyUsSection.tsx`.

### Service primitive sweep (Archetype D — `FAQ.tsx`)

```tsx
// BEFORE (FAQ.tsx:44 closed item + :48 button):
<div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-glass overflow-hidden">
  <button className="... transition-colors hover:bg-white/80">

// AFTER (closed Tier 1 + button hover Tier 2):
<div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] border border-white/60 shadow-glass overflow-hidden">
  <button className="... transition-colors hover:bg-[var(--glass-form-fill)]">
```

Note: Phase 92's FAQSection has the same Archetype D pattern (with similar open-state choice) — `92-PATTERNS.md` Plan 92-06 row applies. Open-state Tier 2 fill via hover-ramp-while-open is the simplest approach; if open=Tier-2 is desired explicitly, use `data-state` or `aria-expanded:` Tailwind variant per planner judgment.

### CTA invariant grep (extended for Phase 93 file set)

```bash
# 0 expected — no CTA gradient should ever be paired with backdrop-filter:
grep -rln "from-mu-blue to-mu-accent-blue" \
  next/src/components/sections/checkup/ \
  next/src/components/sections/consultations/ \
  next/src/components/sections/treatment/ \
  next/src/components/sections/contacts/ \
  next/src/components/sections/service/ \
  | xargs -I {} grep -l "backdrop" {} 2>/dev/null

# All Archetype J CTAs accounted for (in Phase 93 scope):
# - ServiceHero.tsx:50 (primary CTA)
# - LeadFormSection: ContactForm.tsx:247 (already Phase 92 — frozen)
# - CheckupB2B.tsx:85
# - CheckupProgramsTurkey.tsx:132
# - ConsultationPricing.tsx:43
```

### Wave 0 — install Playwright

```bash
# 1. Install dev dependency
pnpm --dir next add -D @playwright/test

# 2. Install browser binaries (one-time)
pnpm --dir next exec playwright install chromium

# 3. Verify version
pnpm --dir next info @playwright/test version

# 4. Capture pre-Phase-93 baseline (run AGAINST current state, before any sweep)
pnpm --dir next exec playwright test --update-snapshots tests/route-baselines.spec.ts

# 5. Commit baseline PNGs (or store externally per repo policy)
git add next/tests/route-baselines.spec.ts-snapshots/
git commit -m "test(93): pre-Phase-93 Playwright screenshot baselines (ROUTE-07)"
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Build, dev server | ✓ (existing) | 20+ (per package.json types) | — |
| pnpm | Package manager | ✓ (existing) | latest | — |
| Next.js | App Router runtime | ✓ (existing) | 15.5.15 | — |
| Tailwind v4 | Class-based styling | ✓ (existing) | 4.x | — |
| Directus 11 | Form submission backend (smoke test only) | ✓ (existing — Docker) | 11.14.1 | — |
| Chromium browser | Playwright tests | INSTALL at Wave 0 | latest stable | — |
| `@playwright/test` | ROUTE-07 screenshot diff | **MISSING — INSTALL at Wave 0** | latest stable (1.49+) | None — ROUTE-07 cannot ship without it |
| Phase 91 `__blobDebug` runtime hook | Determinism in screenshots | EXISTS but `setMode` method should be confirmed (BLOB-12 spec) | dev build only | `page.emulateMedia({ reducedMotion: 'reduce' })` triggers Phase 91 BLOB-07 static branch — equivalent fallback |

**Missing dependencies with no fallback:** None — Playwright install path is straightforward.

**Missing dependencies with fallback:** `__blobDebug.setMode` — fallback to `prefers-reduced-motion: reduce` emulation if the method isn't available.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `@playwright/test` (NEW — Wave 0 install) for ROUTE-07; `pnpm build` (existing) for compile gate; manual DevTools recipes for sub-route legibility / WCAG / smoke tests (mirroring Phase 92 §Validation Architecture pattern) |
| Config file | `next/playwright.config.ts` — NEW at Wave 0 |
| Quick run command | `pnpm --dir next build && pnpm --dir next exec playwright test --project=desktop` |
| Full suite command | `pnpm --dir next build && pnpm --dir next exec playwright test` (desktop + mobile-375 projects, all 5 routes) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ROUTE-01 | `/checkup` 7 sub-route components swept; CTA invariant; pnpm build clean | grep audit + build | `pnpm --dir next build && grep -rn 'bg-white/[0-9]' next/src/components/sections/checkup/` (expect 0 unsanctioned) | ❌ Wave 0 (after install) |
| ROUTE-02 | `/consultations` 7 components swept | grep + build | same pattern, consultations/ path | ❌ Wave 0 |
| ROUTE-03 | `/treatment-abroad` 4 components swept | grep + build | treatment/ path | ❌ Wave 0 |
| ROUTE-04 | `/contacts` (NO-OP after dead-code decision OR sweep dead 4 files defensively) | grep + manual review | contacts/ path | ❌ Wave 0 |
| ROUTE-05 | Service primitives swept; LeadFormSection α=0.50 form-fill; pnpm build | grep + DevTools recipe | service/ path; manual recipe per Phase 92 Recipe 3 (WCAG body copy on form panel at heat=1) | ❌ Wave 0 |
| ROUTE-06 | shadcn primitives — admin-only impact verified; dialog.tsx if/when public modal lands | grep + manual admin smoke | `grep -rln "from '@/components/ui/" next/src/app/ next/src/components/` → expect ≤1 file | ❌ Wave 0 (verify-only) |
| ROUTE-07 | Per-route Playwright screenshot diff vs pre-Phase-93 baseline | Playwright | `pnpm --dir next exec playwright test` | ❌ Wave 0 (install + baseline + spec) |
| ROUTE-05 success criterion 5 (submission paths reach Directus) | Manual smoke per route — submit `LeadFormSection`, verify Directus admin record | manual-only | n/a (manual) | ✅ Directus admin UI exists |

### Sampling Rate

- **Per task commit:** `pnpm --dir next build` — catches arbitrary-value class syntax errors and TypeScript regressions. ~30–60s feedback latency.
- **Per wave merge:** `pnpm --dir next build` clean + per-route Playwright screenshot diff (`pnpm exec playwright test --project=desktop`). DevTools manual recipe on swept service primitives.
- **Phase gate (`/gsd-verify-work`):** Full Playwright suite (desktop + mobile-375); CTA grep audit clean across all sub-route files; LeadFormSection WCAG body copy ≥4.5:1 verified at worst-case blob position; manual Directus submission smoke from each route.

### Wave 0 Gaps

- [ ] `pnpm --dir next add -D @playwright/test` — install Playwright dev dependency
- [ ] `pnpm --dir next exec playwright install chromium` — install browser binaries
- [ ] `next/playwright.config.ts` — config (desktop 1440px + mobile 375px projects; webServer)
- [ ] `next/tests/route-baselines.spec.ts` — 5-route screenshot test scaffold with blob masking + `__blobDebug.setMode('static')` determinism
- [ ] Capture pre-Phase-93 baseline screenshots (`playwright test --update-snapshots`) at `T0`
- [ ] Commit baseline PNGs (or document external store)
- [ ] Confirm Phase 91 `window.__blobDebug.setMode` method exists; if not, use `page.emulateMedia({ reducedMotion: 'reduce' })` fallback
- [ ] DevTools recipe doc carried forward from Phase 92 Recipe 1–5; extend with route-specific entries

> **Note:** Wave 0 is a hard gate for ROUTE-07. Do NOT begin Wave 1 sweeps before baseline capture lands.

## Security Domain

> Not applicable in Phase 93 sense — Phase 93 is a CSS class sweep. ASVS categories that DO apply (V5 Input Validation on `ContactForm`) are inherited from Phase 92 work and frozen here.

| ASVS Category | Applies | Standard Control | Phase 93 Stance |
|---------------|---------|-----------------|------------------|
| V2 Authentication | NO | — | (admin route uses Directus auth — frozen) |
| V3 Session Management | NO | — | (frozen) |
| V4 Access Control | NO | — | (frozen) |
| V5 Input Validation | YES (inherited) | `zod` 4.3.6 (existing dep) on `submitContactForm` server action | Phase 93 inherits — `LeadFormSection` reuses `ContactForm`; no new validation surface added |
| V6 Cryptography | NO | — | (no new crypto) |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation | Phase 93 Stance |
|---------|--------|--------------------|------------------|
| BL-04 anti-bot honeypot fakes success on legitimate submissions (data-integrity) | Repudiation / Denial-of-service to legit users | Server-side rate-limiting + suspect tagging | Carry-forward Phase 92 deferred — Phase 93 multiplies blast-radius (4 routes vs 1); CONTEXT.md flag required |
| Form CSRF | Tampering | Next.js Server Actions provide built-in CSRF | Inherited — frozen |
| XSS via user-controlled form input | Tampering | React auto-escaping + zod validation | Inherited — frozen |

## Sources

### Primary (HIGH confidence)

- `next/src/app/{checkup,consultations,treatment-abroad,contacts}/page.tsx` — directly inspected for component composition + import lists
- `next/src/components/sections/{checkup,consultations,treatment,contacts,service}/*.tsx` — directly inspected (18 sub-route files + 4 service primitives)
- `next/src/components/ui/*.tsx` — directly inspected (8 shadcn primitives)
- `next/src/components/sections/ContactForm.tsx`, `next/src/app/layout.tsx` — directly inspected (frozen Phase 92)
- `next/package.json` — directly inspected (Playwright NOT installed; Next 15.5.15; React 19.1.0; Tailwind v4)
- `.planning/phases/92-glass-rework-chrome-index-sections/92-{CONTEXT,RESEARCH,PATTERNS,VALIDATION,VERIFICATION,REVIEW,REVIEW-FIX,08-SWEEP-AUDIT,HUMAN-UAT}.md` — directly inspected (Phase 92 patterns + decisions inherited)
- `.planning/{REQUIREMENTS,PROJECT,ROADMAP,STATE}.md` — directly inspected
- `./CLAUDE.md` — directly inspected (project constraints)

### Secondary (MEDIUM confidence)

- `Playwright official docs` — playwright.dev/docs/test-snapshots, playwright.dev/docs/test-configuration — referenced for screenshot diff API + masking + webServer config patterns. Public stable APIs since 1.20.

### Tertiary (LOW confidence — flagged for verification)

- [ASSUMED] Latest stable Playwright = 1.49+ — verify at Wave 0 with `pnpm info @playwright/test version`.
- [ASSUMED] Phase 91 `window.__blobDebug.setMode('static')` exists — REQUIREMENTS.md BLOB-12 specifies `rafCount` only; the `setMode` method is implied by phase-level debug-surface design but not explicitly enumerated. **Verify at Wave 0** by running `npm run dev` and inspecting `window.__blobDebug` in DevTools console. If absent, fall back to `page.emulateMedia({ reducedMotion: 'reduce' })`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Latest stable Playwright is 1.49+ as of 2026-04-30 | §Standard Stack — Wave 0 dep | Low — Wave 0 install will pick whatever stable is available; pin in package.json after install |
| A2 | `window.__blobDebug.setMode('static')` method exists in Phase 91's debug surface | §Pattern 4, §Code Examples Wave 0, §Wave 0 Gaps | Medium — if absent, fallback is `page.emulateMedia({ reducedMotion: 'reduce' })`. Either path delivers a static blob for screenshot determinism |
| A3 | "Pre-v9.0 baseline" in ROADMAP ROUTE-07 reinterprets as "pre-Phase-93 baseline" captured at Wave 0 | §Summary, §Architecture Patterns Wave 0 | Low — alternative interpretation (recover historical baseline from a v8.1 git tag) is heavier and the user delegated technical decisions to Claude |
| A4 | LeadFormSection α=0.50 form-fill sustains ≥4.5:1 body-copy contrast over the bare blob field at worst-case heat=1 | §Per-Route Gradient Context Analysis, §Pitfall 1 | Medium — KD-v9-002 derivation was for over-blue-gradient ContactSection; LeadFormSection sits over blob (different composite). Verify at Wave 1 with Chrome DevTools contrast picker; KD-v9-002 escalation path (raise α further) remains conditionally available if it fails |
| A5 | ROUTE-04 `/contacts` dead-code skip is acceptable per project conventions | §Per-Route Inventory, §Discretion | Low — dead code is verifiable in `git log` post-research; recommended quick-task for cleanup post-phase |
| A6 | shadcn primitive sweep is admin-only impact, public routes never trigger modals | §Pitfall 5, §Discretion item 6 | Low for current state; Medium for future feature work — if a public modal lands without a `dialog.tsx` sweep, blob will bleed through. Mitigation: CONTEXT.md note flagging future requirement |
| A7 | BL-04 multiplication is acceptable carry-forward if flagged in CONTEXT.md | §Pitfall 6, §Discretion item 3 | Medium — Phase 94 real-device UAT will surface BL-04 on multiplied surface area; CONTEXT.md `<deferred>` flag is the audit trail |
| A8 | REQUIREMENTS.md ROUTE-01/ROUTE-02/ROUTE-04 file counts are stale (says 8/8/2; reality 7/7/0-rendered) | §Phase Requirements, §Per-Route Inventory | Low — codebase reality is the source of truth; planner amends counts in plan-phase output |

## Open Questions

1. **Does `window.__blobDebug.setMode('static')` exist?** (Assumption A2)
   - What we know: Phase 91 BLOB-12 specifies `rafCount`; `data-blob-mode` HTML attribute already reflects state per BLOB-10. A `setMode` programmatic setter is plausible but not enumerated in REQUIREMENTS.md.
   - What's unclear: whether the dev surface includes a setter or is read-only.
   - Recommendation: Wave 0 first task — confirm in browser console; if absent, use `page.emulateMedia({ reducedMotion: 'reduce' })` fallback (Phase 91 BLOB-07 sets static under that media query).

2. **Is the `/contacts` dead code a recent detachment (mid-redesign) or a legacy artifact?** (§Per-Route Inventory)
   - What we know: 4 files exist on disk; `page.tsx` doesn't import them; git mtimes are 2026-04-11 (pre-v8.1).
   - What's unclear: whether the user wants the contacts page to be expanded back later (in which case dead code stays for reference) OR if these files are abandoned.
   - Recommendation: discuss-phase question for the user. Default if no answer: skip-and-flag for cleanup.

3. **Does Phase 93 need to extend the Phase 92 Decision H anti-pattern grep gate to include sub-route directories?**
   - What we know: Phase 92 plans grepped DESIGN.md `## v9.0 Anti-Patterns` per plan; the 15 anti-patterns are global.
   - What's unclear: whether any Phase 93 plan needs a custom grep beyond Phase 92's CTA-invariant grep.
   - Recommendation: extend the CTA-invariant grep to cover sub-route paths (provided in §Code Examples). No other extensions needed because token consumption inherits a11y coverage automatically (BL-02 fix at `:root` propagates).

4. **Should `LeadFormSection` flatten happen as a Phase-93 plan or be a Phase 92 retroactive amendment?** (Discretion item 1)
   - What we know: LeadFormSection is currently Phase 93 territory (per Phase 92 CONTEXT.md `<deferred>`).
   - What's unclear: whether amending Phase 92's `92-CONTEXT.md` to retroactively cover LeadFormSection would simplify Phase 93's scope.
   - Recommendation: keep in Phase 93 — Phase 92 has shipped (5/5 truths verified); reopening is heavier than amending Phase 93 plans.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — directly inspected 22 component files + Phase 92 archetype reuse + verified Phase 91 frozen surface
- Architecture: HIGH — patterns inherit Phase 92 verbatim; one new tier introduction (Playwright Wave 0) is well-scoped
- Pitfalls: HIGH — 6 specific pitfalls documented with codebase evidence (file/line references)
- Validation Architecture: MEDIUM — Playwright API references are CITED to docs, but `__blobDebug.setMode` (A2) needs Wave 0 verification
- Per-route gradient analysis: HIGH — directly inspected all 4 page.tsx files

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (rolling 30-day window — sub-route component file structure is stable; Phase 92 decisions are locked; Playwright API is stable since 1.20)

## RESEARCH COMPLETE

**Phase:** 93 — Per-Page Propagation — Sub-Routes
**Confidence:** HIGH

### Key Findings

- Phase 93 is mechanically Phase 92 archetypes (A–J) re-applied to 18 sub-route files + 4 shared service primitives. NO new design decisions for the pattern layer.
- 3 decisions need a `93-CONTEXT.md` discuss-phase pass: (1) `LeadFormSection` flatten strategy, (2) per-route blob-dimming policy (recommended: inherit Phase 92 "no localized dimming"), (3) BL-04 carry-forward handling. Plus a 4th: `/contacts` dead-code disposition.
- Playwright is NOT installed — Wave 0 must add it. ROUTE-07 cannot ship otherwise. Baseline interpretation: "pre-Phase-93," not "pre-v9.0."
- shadcn ROUTE-06 blast-radius is admin-only (1 consumer file). Significantly de-risked vs Roadmap framing.
- REQUIREMENTS.md ROUTE-01/02/04 file counts are stale: 7/7/0 actually rendered (spec said 8/8/2). Planner should amend.
- Sub-route gradient context: NO routes have ContactSection-style blue gradient occlusion. KD-v9-003 does NOT auto-propagate.

### File Created

`.planning/phases/93-per-page-propagation-sub-routes/93-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | All component files directly inspected; Phase 92 patterns directly reusable |
| Architecture | HIGH | Inherits Phase 92 verbatim + one new tier (Playwright) cleanly introduced |
| Pitfalls | HIGH | 6 pitfalls with codebase evidence (file/line) |
| Validation | MEDIUM | Playwright API cited; `__blobDebug.setMode` assumption (A2) needs Wave 0 verify |
| Per-route gradient analysis | HIGH | All 4 page.tsx files directly inspected |

### Open Questions

1. Does `window.__blobDebug.setMode('static')` method exist? (Wave 0 first task to verify; fallback exists)
2. Is `/contacts` dead-code a mid-redesign detachment or abandoned? (discuss-phase question)
3. Should `LeadFormSection` flatten land as Phase 93 plan or retroactive Phase 92 amendment? (recommended: keep in Phase 93)

### Ready for Planning

Research complete. **Recommended next step: `/gsd-discuss-phase 93`** to lock the 4 open decisions (LeadFormSection nesting, blob-dimming policy, BL-04 carry-forward, /contacts dead-code) before plan-phase. After CONTEXT.md is written, `/gsd-plan-phase 93` can decompose into Wave 0 (Playwright infra) → Wave 1 (service primitives) → Wave 2 (4 parallel sub-route sweeps) → Wave 3 (shadcn admin verification).
