---
phase: 93-per-page-propagation-sub-routes
plan: 01
subsystem: ui
tags: [tailwind, glass-tokens, react, nextjs, design-system, v9.0]

# Dependency graph
requires:
  - phase: 92-glass-rework-chrome-index-sections
    provides: 4-tier glass token contract (--glass-{section,card,form,button}-{fill,blur}), Archetypes A–J, KD-v9-002 α=0.50, CTA opaque-forever invariant, mobile blur ≤12px clamp
  - phase: 93-per-page-propagation-sub-routes/00
    provides: Playwright 1.59.1 + Chromium installed, 8-PNG visual baseline at next/tests/visual/__snapshots__/baseline.spec.ts/, blob exclusion via display:none addStyleTag, reducedMotion determinism strategy
provides:
  - v9.0 tokenized ServiceHero primitive (Archetype B for eyebrow + secondary CTA glass; Archetype J preserved on primary CTA)
  - v9.0 tokenized SocialProof stat-grid primitive (Archetype C with Tier-2 hover ramp)
  - v9.0 tokenized FAQ accordion primitive (Archetype D — closed Tier 1, button hover Tier 2)
  - v9.0 tokenized LeadFormSection form primitive (Decision A flatten outer Tier 0 + KD-v9-002 inner Tier 2 + Tier 3 GlassCheckmark chip)
  - Anti-pattern #13 cleared on LeadFormSection (exactly 2 backdrop-filter surfaces remain on the component: chip + inner panel)
  - Decision C honored — NO honeypot/timing/anti-bot pattern propagated (BL-04 stays deferred for separate triage)
affects: [93-02-checkup, 93-03-consultations, 93-04-treatment-abroad, 93-05-contacts, 93-07-close-out]

# Tech tracking
tech-stack:
  added: []  # No new deps; pure token-class swap inheriting Phase 90 globals.css :root
  patterns:
    - "Decision E (Phase 92) — Tailwind arbitrary-value class swap (bg-[var(--glass-{tier}-fill)]) instead of utility-class migration; ensures BL-02 a11y media-query fix in :root automatically covers every new surface"
    - "Decision A (Phase 93) — flatten outer Tier 0 wrapper when no occluding gradient exists, leaving inner Tier 2 form panel as the single glass surface (mirrors Phase 92 ContactSection Path A precedent)"
    - "Tier-2 hover-ramp template — hover:bg-[var(--glass-form-fill)] applied to Tier-1 cards (SocialProof, FAQ button)"
    - "Secondary-CTA hover-ramp template — hover:bg-[var(--glass-card-fill)] on Tier-0 secondary CTA glass (ServiceHero secondary CTA)"

key-files:
  created:
    - .planning/phases/93-per-page-propagation-sub-routes/93-01-SUMMARY.md
  modified:
    - next/src/components/sections/service/ServiceHero.tsx
    - next/src/components/sections/service/SocialProof.tsx
    - next/src/components/sections/service/FAQ.tsx
    - next/src/components/sections/service/LeadFormSection.tsx

key-decisions:
  - "Decision A executed verbatim — outer Tier 0 wrapper at LeadFormSection:47 flattened (drop bg-white/60, backdrop-blur-3xl, border-white/60, shadow-glass-lg; preserve rounded-[3.5rem] p-6 md:p-12 layout)"
  - "Decision C honored — no honeypot, no timing trap, no anti-bot instrumentation propagated to LeadFormSection; ContactForm.tsx left frozen (zero diff)"
  - "Decision E inherited — KD-v9-002 α=0.50 reaches LeadFormSection inner panel automatically via --glass-form-fill token consumption (alpha bump 0.42 → 0.50 deliberate)"
  - "ServiceHero.tsx:50 primary CTA gradient + FAQ.tsx:34 heading text gradient explicitly preserved (Archetype J + text-fill non-glass identification rule)"
  - "Visual-diff finding: Wave 0 Playwright suite passed all 8 tests after Wave 1 sweep — with .living-blob-field hidden via addStyleTag, the token swap is visually invariant within maxDiffPixelRatio:0.01 (1% tolerance). This confirms the token system produces near-identical pixel output over the bare page-frame; the deltas the plan anticipated will only surface when the live blob is in frame, captured by Plan 07's final regeneration."

patterns-established:
  - "Service-primitive sweep order — chip → outer flatten → inner panel for form-wrapping primitives like LeadFormSection (mirrors ContactSection Path A precedent)"
  - "Wave 1 visual-diff expectation — with blob hidden under reducedMotion+addStyleTag determinism, primitive token swap is sub-pixel; deltas surface only with live blob (deferred to Plan 07 regeneration)"

requirements-completed: [ROUTE-05]

# Metrics
duration: 5min
completed: 2026-04-30
---

# Phase 93 Plan 01: Service-Primitives Sweep Summary

**Four service primitives (ServiceHero, SocialProof, FAQ, LeadFormSection) swept to v9.0 4-tier glass tokens; Decision A flattened the LeadFormSection outer Tier 0 wrapper; primary CTA + FAQ text-gradient preserved verbatim; build + lint green; Wave 0 visual-diff passed (8/8) with blob masked.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-30T14:24:41Z
- **Completed:** 2026-04-30T14:29:41Z
- **Tasks:** 4 (3 sweep tasks + 1 close-out verification)
- **Files modified:** 4

## Accomplishments

- ServiceHero.tsx swept: eyebrow pill (line 35) + secondary CTA glass (line 73) → Tier 0 (--glass-section-fill / --glass-section-blur); secondary CTA hover ramps to Tier 1 (--glass-card-fill); primary CTA gradient at line 50 untouched per Archetype J.
- SocialProof.tsx swept: stat card (line 19) → Tier 1 (--glass-card-fill / --glass-card-blur); hover ramp → Tier 2 (--glass-form-fill).
- FAQ.tsx swept (Archetype D): closed item wrapper (line 44) → Tier 1; button hover (line 48) → Tier 2 ramp; heading text gradient (line 34) preserved as text-fill.
- LeadFormSection.tsx swept (Decision A flatten + KD-v9-002 inner): GlassCheckmark chip (line 19) → Tier 3 button; outer wrapper (line 47) flattened to layout-only; inner Tier 2 form panel (line 72) → --glass-form-fill (α=0.50 KD-v9-002) + --glass-form-blur.
- Anti-pattern #13 cleared on LeadFormSection — backdrop-blur count reduced from 3 (outer Tier 0 + inner Tier 2 + chip Tier 3) to 2 (chip + inner panel).
- CTA opaque-forever invariant verified across the entire `service/` directory — zero co-located backdrop-blur with `from-mu-blue to-mu-accent-blue`.
- ContactForm.tsx unchanged (Phase 92 territory frozen) — `git diff --stat` empty.
- Decision C honored — zero matches for honeypot/timing/antibot keywords in LeadFormSection.

## Task Commits

1. **Task 1: Sweep ServiceHero.tsx + SocialProof.tsx** — `e5e5e26` (feat)
2. **Task 2: Sweep FAQ.tsx (Archetype D)** — `50b1d43` (feat)
3. **Task 3: Sweep LeadFormSection.tsx (Decision A flatten + KD-v9-002 inner)** — `384dcaa` (feat)
4. **Task 4: Wave 1 close-out verification** — no source changes, verification only (no commit; results documented in this SUMMARY)

## Files Created/Modified

- `next/src/components/sections/service/ServiceHero.tsx` — eyebrow pill + secondary CTA glass tokenized; primary CTA gradient preserved
- `next/src/components/sections/service/SocialProof.tsx` — stat card tokenized to Tier 1 + Tier-2 hover ramp
- `next/src/components/sections/service/FAQ.tsx` — accordion Archetype D (closed Tier 1 + button hover Tier 2); text gradient preserved
- `next/src/components/sections/service/LeadFormSection.tsx` — flatten outer Tier 0 (Decision A); inner Tier 2 form (KD-v9-002); GlassCheckmark Tier 3
- `.planning/phases/93-per-page-propagation-sub-routes/93-01-SUMMARY.md` — this file

## Per-File Grep Counts (Acceptance Gates)

| Gate | File | Expected | Actual |
|------|------|----------|--------|
| `bg-white/[0-9]` residue | ServiceHero | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | SocialProof | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | FAQ | 0 | 0 ✅ |
| `bg-white/[0-9]` residue | LeadFormSection | 0 | 0 ✅ |
| `bg-[var(--glass-section-fill)]` count | ServiceHero | ≥2 | 2 ✅ |
| `bg-[var(--glass-card-fill)]` count | SocialProof | ≥1 | 1 ✅ |
| `bg-[var(--glass-card-fill)]` count | FAQ | ≥1 | 1 ✅ |
| `bg-[var(--glass-form-fill)]` count | LeadFormSection | ≥1 | 1 ✅ |
| `bg-[var(--glass-button-fill)]` count | LeadFormSection | ≥1 | 1 ✅ |
| `hover:bg-[var(--glass-form-fill)]` (Tier-2 hover ramp) | SocialProof | ≥1 | 1 ✅ |
| `hover:bg-[var(--glass-form-fill)]` (Tier-2 hover ramp) | FAQ | ≥1 | 1 ✅ |
| `bg-clip-text` (text-gradient preserved) | FAQ | ≥1 | 1 ✅ |
| `from-mu-blue to-mu-accent-blue` co-located w/ backdrop-blur (CTA invariant) | ServiceHero | 0 | 0 ✅ |
| Hardcoded `backdrop-blur-(xl\|2xl\|3xl\|md)` | all 4 files | 0 | 0 ✅ |
| `rounded-[3.5rem]` co-located w/ backdrop-blur (Decision A flatten verify) | LeadFormSection | 0 | 0 ✅ |
| `rounded-[3.5rem] p-6 md:p-12` (layout preserved) | LeadFormSection | ≥1 | 1 ✅ |
| `from '@/components/sections/ContactForm'` (import preserved) | LeadFormSection | ≥1 | 1 ✅ |
| `git diff --stat ContactForm.tsx` (frozen) | n/a | empty | empty ✅ |
| `(honeypot\|timing\|antibot\|anti-bot)` (Decision C) | LeadFormSection | 0 | 0 ✅ |
| `backdrop-blur\|backdrop-filter` count (anti-pattern #13) | LeadFormSection | ≤2 | 2 ✅ |
| `nbsp` baseline (Russian copy preserved) | all 4 files | 0 (unchanged) | 0 ✅ |

## Wave 0 Visual-Diff Status (per route)

`pnpm exec playwright test tests/visual --reporter=list` after Wave 1 sweep:

| Route | Project | Result |
|-------|---------|--------|
| /checkup | desktop (1280×800) | passed (3.2s) |
| /checkup | mobile-375 (375×667 @2x) | passed (3.1s) |
| /consultations | desktop | passed (2.5s) |
| /consultations | mobile-375 | passed (2.5s) |
| /treatment-abroad | desktop | passed (2.5s) |
| /treatment-abroad | mobile-375 | passed (2.5s) |
| /contacts | desktop | passed (2.6s) |
| /contacts | mobile-375 | passed (2.7s) |

**Total: 8/8 passed in 17.1s.**

**Interpretation:** The plan's runtime note anticipated diffs ("Wave 1 sweep WILL produce visual deltas; that is expected and acceptable"). However, with the Wave 0 determinism strategy (`.living-blob-field { display: none !important }` via `addStyleTag`) and `maxDiffPixelRatio: 0.01` tolerance, the token swap is visually invariant on the bare page-frame:

- The page-frame on every sub-route is `bg-gradient-to-b from-[#F0F7FF] to-white` (near-white). Composing `bg-white/0.60` over near-white versus `bg-[var(--glass-card-fill)]` (rgba(255,255,255,0.10)) over near-white yields a sub-pixel alpha difference.
- `backdrop-filter: blur(...)` over a hidden blob has no source pixels to blur, so blur-radius changes (24px → clamp 20px) produce no visible delta either.
- The KD-v9-002 alpha bump 0.42 → 0.50 on LeadFormSection inner panel is also sub-pixel under these conditions.

**This is a healthy outcome, not a missed regression.** The token contract IS the regression boundary; live-blob deltas are the expected user-visible change, and they remain captured by the Phase 91 blob field at runtime. Plan 07 owns the final baseline regeneration once all four routes ship and the live blob shows through. No baseline regenerated in this plan (`--update-snapshots` forbidden in Wave 1 per plan + 93-CONTEXT.md Decision I).

## Decisions Made

- **Decision A executed verbatim** at LeadFormSection:47 — flatten the outer Tier 0 wrapper (drop `bg-white/60 backdrop-blur-3xl border border-white/60 shadow-glass-lg`); preserve `rounded-[3.5rem] p-6 md:p-12`. Aligns LeadFormSection with Phase 92 ContactSection Path A precedent (single Tier-2 form panel, no outer glass framing).
- **Decision C honored** at LeadFormSection — zero anti-bot instrumentation propagated. ContactForm BL-04 stays deferred for a future explicit anti-bot decision phase.
- **Decision E (Phase 92) inherited** — class-swap (not utility migration) means every new class is a `bg-[var(--glass-*)]` token consumer, automatically covered by the BL-02 fix in `globals.css :root` under `prefers-reduced-transparency` and `prefers-contrast: more`.
- **Plan-level visual-diff calibration** — Wave 1's plan-runtime note anticipated visible diffs; in practice, the determinism strategy (blob hidden) makes the swap visually invariant. Recorded as a finding for downstream waves to inherit (Plan 07 will regenerate baseline once live-blob deltas surface from full route sweeps).

## Deviations from Plan

None — plan executed exactly as written.

The 4 acceptance-gate `nbsp` baseline assertions all returned 0 (unchanged), confirming Russian copy preservation. All grep gates listed in the plan's `<acceptance_criteria>` returned the expected counts. Build green, lint green (1 pre-existing unrelated warning in `next/src/lib/blob-engine/index.ts` line 85 — out of Plan 01 scope; logged as Phase 91 territory deferral).

**Total deviations:** 0
**Impact on plan:** Plan executed exactly as specified.

## Issues Encountered

None.

The Wave 0 Playwright suite passed all 8 tests after the Wave 1 sweep, which initially looked anomalous against the plan's expectation of diffs. Investigation (in this SUMMARY) confirms it is a correct outcome of the Wave 0 determinism strategy + tolerance band, not a missed regression. The ContactForm.tsx integration is intact, the import graph is intact (verified via `pnpm build` collecting and rendering all 11 routes including /checkup, /consultations, /treatment-abroad, /contacts that consume the swept primitives), and all per-file grep gates returned the expected counts.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Wave 2 ready:** All four service primitives now ship v9.0 tokens, propagating to /checkup, /consultations, /treatment-abroad (via ServiceHero/SocialProof/FAQ/LeadFormSection imports) and /contacts (via LeadFormSection import). Wave 2 plans (93-02 → 93-05) sweep the per-route inner section components against the Phase 92 archetype catalogue verbatim; primitives are stable. Wave 0 baseline is preserved unaltered for Plan 07 to consume.

**No blockers.**

## Self-Check: PASSED

**Created files exist:**
- FOUND: .planning/phases/93-per-page-propagation-sub-routes/93-01-SUMMARY.md (this file, just written)

**Commits exist in git log:**
- FOUND: e5e5e26 (Task 1 — ServiceHero + SocialProof)
- FOUND: 50b1d43 (Task 2 — FAQ)
- FOUND: 384dcaa (Task 3 — LeadFormSection)

**Files modified are tracked + committed:**
- next/src/components/sections/service/ServiceHero.tsx — committed in e5e5e26
- next/src/components/sections/service/SocialProof.tsx — committed in e5e5e26
- next/src/components/sections/service/FAQ.tsx — committed in 50b1d43
- next/src/components/sections/service/LeadFormSection.tsx — committed in 384dcaa

---
*Phase: 93-per-page-propagation-sub-routes*
*Completed: 2026-04-30*
