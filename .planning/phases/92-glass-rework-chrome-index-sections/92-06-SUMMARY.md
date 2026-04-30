---
phase: 92-glass-rework-chrome-index-sections
plan: 06
subsystem: ui-glass-tokens
tags: [glass, tokens, faq, final-cta, tier-1, tier-0, tier-3, archetype-d, archetype-b, archetype-j]
requires:
  - 92-01-SUMMARY.md (token contract — globals.css `--glass-{section,card,form,button}-{fill,blur}`)
  - 92-03-SUMMARY.md (chrome sweep precedent — token consumption pattern)
  - 92-04-SUMMARY.md (above-fold sweep precedent — Tier 1 / Tier 2 hover pattern)
provides:
  - "FAQSection.tsx Tier 1 closed accordion items + Tier 2 hover ramp; smooth-anim accordion preserved"
  - "FinalCTA.tsx Tier 0 frame + Tier 3 phone CTA; primary CTA gradient (Archetype J) preserved; mix-blend-multiply still present (Plan 92-08 retires)"
affects:
  - "Wave 3 readiness for Plan 92-07 (form-safety contrast measurement) — FAQ/FinalCTA tier intensity locked, so form-panel choice unblocked"
  - "Wave 4 (Plan 92-08): mix-blend-multiply retirement at FinalCTA:14 still queued"
tech-stack:
  added: []
  patterns:
    - "Archetype D (open-state-toggle) — Tier 1 closed → Tier 2 hover ramp via form-fill token; option (a) hover-ramp-while-open chosen for open-state Tier 2 cue"
    - "Archetype B (Tier 0 section frame) — section-fill / section-blur token consumption"
    - "Archetype J (CTA opaque-forever) — primary CTA gradient untouched; CTA invariant negative-grep gate held"
    - "Tier 3 small button glass — button-fill / button-blur tokens with Tier 2 form-fill hover ramp"
key-files:
  created: []
  modified:
    - "next/src/components/sections/FAQSection.tsx (Tier 1 closed wrapper + Tier 2 hover via form-fill token)"
    - "next/src/components/sections/FinalCTA.tsx (Tier 0 frame + Tier 3 phone CTA glass; primary CTA + mix-blend-multiply blob untouched)"
decisions:
  - "FAQSection open-state Tier 2 ramp delivered via option (a) — hover-ramp-while-open as visual cue. Rationale: avoids Tailwind v4 aria-* arbitrary-variant uncertainty and avoids introducing data-state convention that would have to propagate to Phase 93 LeadFormSection. Keyboard focus styling carries the cue for non-mouse users. Documented per plan §Task 1 step 4."
  - "FinalCTA mix-blend-multiply decoration at line 14 deliberately deferred to Plan 92-08 (Wave 4). 92-02-AUDIT.md and the orchestrator-locked decomposition both attribute the retirement Key Decision to 92-08. Leaving it here keeps the retirement traceable as a single moment."
metrics:
  duration: "~6 minutes (token swap + 2 builds + verification)"
  completed: "2026-04-30"
  tasks_completed: 2
  files_modified: 2
  commits: 2
---

# Phase 92 Plan 06: FAQSection (Archetype D) + FinalCTA (Archetype B + J + Tier 3) Summary

Wave 3 token sweep — FAQ accordion (Tier 1 closed / Tier 2 hover) and FinalCTA frame + phone CTA — implemented in 2 surgical Tailwind class swaps; primary CTA gradient and mix-blend-multiply blob preserved verbatim per locked decomposition.

## Outcome

Both target components now consume Phase 90 glass tokens (`--glass-{section,card,form,button}-{fill,blur}`). FAQSection's CSS-only `transition-[max-height]` accordion (Phase 71 era) and `aria-expanded` a11y contract are intact. FinalCTA's primary `from-mu-blue → to-mu-accent-blue` gradient (Archetype J — opaque-forever) is untouched, and the `mix-blend-multiply` decorative blob at line 14 remains in place (deferred to Plan 92-08 retirement). `pnpm --dir next build` exits clean with no new lint warnings.

## What Was Built

### Task 1 — FAQSection.tsx (commit 9737a2c)

Two class swaps inside `FAQSection` accordion-item map (line 110+):

**Closed item wrapper (line 115):**
- BEFORE: `bg-white/60 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden`
- AFTER: `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden`

**Button hover (line 119):**
- BEFORE: `... transition-colors hover:bg-white/80`
- AFTER: `... transition-colors hover:bg-[var(--glass-form-fill)]`

**Preserved verbatim:**
- Line 141: `overflow-hidden transition-[max-height] duration-300 ease-in-out` (Phase 71 smooth-anim accordion).
- `aria-expanded={isOpen}` attribute on toggle button.
- ChevronDown SVG with `rotate-180` toggle.
- All Russian copy with `'\u00A0'` non-breaking spaces (subject+verb binding + orphan prevention per project memory).

**Open-state Tier 2 cue choice — option (a) hover-ramp-while-open:**
PATTERNS.md §Archetype D offered three options for ramping the open state to Tier 2:
- (a) Accept hover-ramp-while-open as the visual cue (chosen).
- (b) Add `aria-expanded:bg-[var(--glass-form-fill)]` arbitrary variant (Tailwind v4 support uncertain).
- (c) Add `data-state="open"` + a CSS rule (introduces a new convention that would have to propagate to Phase 93 LeadFormSection).

Rationale for (a): avoids Tailwind v4 unknowns, avoids new convention burden, and keyboard-focus styling already carries the open cue for non-mouse users. Functional difference is invisible to the 45+ KZ audience target.

### Task 2 — FinalCTA.tsx (commit 0713800)

Two class swaps inside the `FinalCTA` panel:

**Frame (line 8) — Archetype B:**
- BEFORE: `bg-white/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong`
- AFTER: `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong`

**Phone CTA (line 33) — Tier 3 default → Tier 2 hover:**
- BEFORE: `w-full sm:w-auto bg-white/60 backdrop-blur-xl text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-white/80 transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg`
- AFTER: `w-full sm:w-auto bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-[var(--glass-form-fill)] transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg`

**Untouched (intentional):**
- Line 14 — decorative blob `bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply`. Anti-pattern #8 violation explicitly deferred to Plan 92-08; 92-02-AUDIT.md and the locked decomposition assign that retirement Key Decision to Wave 4.
- Line 26 — primary CTA `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` (Archetype J — opaque-forever, no `backdrop-*` introduced).
- Line 59 — image gradient overlay `bg-gradient-to-r from-white/60 to-transparent w-1/3` (decorative image overlay, not glass surface).

## Verification

**Per-task acceptance grep results:**

| Check | File | Expected | Got |
|-------|------|----------|-----|
| `bg-white/60` removed | FAQSection | 0 | 0 |
| `hover:bg-white/80` removed | FAQSection | 0 | 0 |
| `bg-[var(--glass-card-fill)]` present | FAQSection | ≥1 | 1 |
| `backdrop-blur-[var(--glass-card-blur)]` present | FAQSection | ≥1 | 1 |
| `hover:bg-[var(--glass-form-fill)]` present | FAQSection | ≥1 | 1 |
| `backdrop-blur-2xl` removed | FAQSection | 0 | 0 |
| `transition-[max-height]` preserved | FAQSection | ≥1 | 1 |
| `aria-expanded` preserved | FAQSection | ≥1 | 1 |
| `bg-white/60` removed (≤1, line 59 may keep `from-white/60` gradient stop) | FinalCTA | ≤1 | 0 (line 59 uses `from-white/60`, not `bg-white/60`) |
| `backdrop-blur-3xl|xl` removed | FinalCTA | 0 | 0 |
| `bg-[var(--glass-section-fill)]` present (frame) | FinalCTA | ≥1 | 1 |
| `bg-[var(--glass-button-fill)]` present (phone CTA) | FinalCTA | ≥1 | 1 |
| `hover:bg-[var(--glass-form-fill)]` present | FinalCTA | ≥1 | 1 |
| `from-mu-blue to-mu-accent-blue` preserved (primary CTA) | FinalCTA | ≥1 | 1 |
| CTA invariant — gradient line has no `backdrop-*` | FinalCTA | 0 | 0 |
| `mix-blend-multiply` STILL present (deferred to 92-08) | FinalCTA | ≥1 | 1 |

**`&nbsp;` literal count baseline preservation:** 0 in both files (Russian copy uses JSX `'\u00A0'` literals, not `&nbsp;`). Pre-sweep and post-sweep both report 0 — no regression.

**Build:** `pnpm --dir next build` exits 0; static export of all 11 routes succeeds; only pre-existing eslint-disable warning in `src/lib/blob-engine/index.ts` (unrelated, out of scope).

**Cross-component CTA opaque-forever invariant** (PATTERNS.md §Shared Patterns):
```bash
grep -rn 'backdrop-filter\|backdrop-blur' \
  next/src/components/sections/HeroHub.tsx \
  next/src/components/layout/MobileMenu.tsx \
  next/src/components/layout/StickyBar.tsx \
  next/src/components/sections/ContactForm.tsx \
  next/src/components/sections/FinalCTA.tsx \
  | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'
```
Result: zero matches. Invariant holds.

## Decisions Made

1. **FAQSection open-state Tier 2 ramp = option (a) hover-ramp-while-open.** Avoids Tailwind v4 `aria-*` arbitrary-variant uncertainty and a `data-state` convention that would otherwise have to propagate to Phase 93 LeadFormSection. Keyboard focus styling carries the cue for non-mouse users; visual difference for mouse users is functionally adequate per 92-UI-SPEC.md.

2. **FinalCTA.tsx:14 `mix-blend-multiply` decoration left in place — deferred to Plan 92-08.** The orchestrator-locked decomposition assigns that Key Decision (remove element vs. drop the `mix-blend-multiply` class only vs. retire-and-replace with a heat-leak surface) to Wave 4. Documenting it as a deferred deviation here, not implementing.

## Deviations from Plan

None — plan executed exactly as written. Both tasks produced the planned class strings; primary CTA gradient and mix-blend-multiply blob preserved per the deferral rules.

## Threat Flags

None. The sweep introduced no new network endpoints, auth paths, file access patterns, or schema changes. All changes are CSS class strings inside existing presentational components; the form submission flow (`/api/leads`, `directus-fetch`) is untouched.

## Known Stubs

None. No empty arrays, placeholder text, or unwired components were introduced. All Russian copy and `'\u00A0'` non-breaking-space binding (subject+verb pairs + orphan prevention) is unchanged.

## Deferred Issues

1. **FinalCTA.tsx:14 `mix-blend-multiply` retirement** — owned by Plan 92-08 Wave 4. 92-02-AUDIT.md tracks the violation; 92-08 plan task explicitly retires it. No action needed in this plan.
2. **FAQ open-state Tier 2 explicit ramp (option (b) or (c))** — option (a) chosen as adequate; if Phase 94 visual-fidelity verification flags the open/closed visual difference as too subtle for the 45+ KZ audience, a follow-up surgical addition of `data-state="open"` + a CSS rule can be added in a `polish` plan. No regression risk.

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: next/src/components/sections/FAQSection.tsx
- FOUND: next/src/components/sections/FinalCTA.tsx
- FOUND: .planning/phases/92-glass-rework-chrome-index-sections/92-06-SUMMARY.md (this file)

**Commits verified to exist:**
- FOUND: 9737a2c — feat(92-06): FAQSection — Tier 1 closed / Tier 2 hover via tokens
- FOUND: 0713800 — feat(92-06): FinalCTA — Tier 0 frame + Tier 3 phone CTA via tokens

**Acceptance criteria:** All grep gates passed for both tasks; `pnpm --dir next build` exits 0; CTA opaque-forever invariant holds across HeroHub/MobileMenu/StickyBar/ContactForm/FinalCTA.
