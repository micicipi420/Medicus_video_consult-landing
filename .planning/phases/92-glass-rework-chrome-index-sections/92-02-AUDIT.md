# Phase 92 Plan 02: CTA Invariant + FinalCTA Anti-Pattern Audit

**Type:** Read-only baseline audit
**Date:** 2026-04-30
**Purpose:** Lock the CTA opaque-forever invariant baseline and the FinalCTA `mix-blend-multiply` violation as the immutable reference for downstream Wave 2/3/4 sweeps (Plans 92-03..92-08). Every later plan's `<acceptance_criteria>` must grep against this baseline and fail loudly if a sweep accidentally pairs `backdrop-blur-*` / `backdrop-filter` with the brand CTA gradient on the same element.

---

## Section 1: CTA Invariant Grep Results

### Grep 1: `from-mu-blue to-mu-accent-blue` (current `/` route gradient)

Command:
```bash
grep -rn 'from-mu-blue to-mu-accent-blue' next/src/components/sections/ next/src/components/layout/
```

Verbatim output (annotated with scope):

| Match | Scope | Notes |
|-------|-------|-------|
| `next/src/components/layout/MobileMenu.tsx:94` | **IN-SCOPE (Phase 92)** | Drawer CTA |
| `next/src/components/layout/StickyBar.tsx:58` | **IN-SCOPE (Phase 92)** | Sticky-bar CTA |
| `next/src/components/layout/Header.tsx:14` | **IN-SCOPE (Phase 92)** — wordmark `bg-clip-text` (gradient text, not button surface) | Logo wordmark |
| `next/src/components/layout/Header.tsx:53` | **IN-SCOPE (Phase 92)** | Desktop header CTA button |
| `next/src/components/sections/service/ServiceHero.tsx:50` | OUT-OF-SCOPE (Phase 93) | service route |
| `next/src/components/sections/treatment/TreatmentReviews.tsx:6` | OUT-OF-SCOPE (Phase 93) | treatment route data literal |
| `next/src/components/sections/HeroHub.tsx:48` | **IN-SCOPE (Phase 92)** | Hero primary CTA |
| `next/src/components/sections/consultations/ConsultationPricing.tsx:28` | OUT-OF-SCOPE (Phase 93) | consultations route |
| `next/src/components/sections/consultations/ConsultationPricing.tsx:43` | OUT-OF-SCOPE (Phase 93) | consultations route |
| `next/src/components/sections/ContactForm.tsx:247` | **IN-SCOPE (Phase 92)** | ContactForm submit |
| `next/src/components/sections/FinalCTA.tsx:26` | **IN-SCOPE (Phase 92)** | FinalCTA primary CTA |
| `next/src/components/sections/ReviewsSection.tsx:12` | Phase 92 (decorative literal — not a CTA call-site) | data literal: `gradient: 'from-mu-blue to-mu-accent-blue'` consumed by review-card avatar/accent |
| `next/src/components/sections/ProcessSection.tsx:30` | Phase 92 (decorative literal — not a CTA call-site) | data literal: step-icon gradient |
| `next/src/components/sections/checkup/CheckupB2B.tsx:85` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:110` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:118` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:132` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupWhyUs.tsx:45` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProgramsKorea.tsx:17` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProgramsKorea.tsx:29` | OUT-OF-SCOPE (Phase 93) | checkup route |
| `next/src/components/sections/checkup/CheckupProcess.tsx:50` | OUT-OF-SCOPE (Phase 93) | checkup route |

### Grep 2: Legacy `from-mu-cta-from to-mu-cta-to` / `-v6` form

Command:
```bash
grep -rn 'from-mu-cta-from to-mu-cta-to\|from-mu-cta-from-v6 to-mu-cta-to-v6' next/src/components/sections/ next/src/components/layout/
```

Verbatim output: **No matches found.**

The legacy `-v6` token form is not used anywhere under `next/src/components/{sections,layout}`. All current CTAs use the `from-mu-blue to-mu-accent-blue` form. DESIGN.md still documents both forms as opaque-forever, so any future re-introduction must remain opaque.

---

### IN-SCOPE CTA Call-Sites (Phase 92 Baseline — VERBATIM)

The 5 IN-SCOPE CTA call-sites named by the plan plus the 2 IN-SCOPE Header.tsx surfaces. Each `className=` string below is the **immutable baseline** — Plans 92-03 through 92-08 must preserve every one verbatim, never adding `backdrop-blur-*` or `backdrop-filter` to the same className.

#### 1. `next/src/components/sections/HeroHub.tsx:48` — Hero primary CTA

```tsx
className="group flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-mu-blue/30 transition-[transform,box-shadow,filter] duration-200 hover:shadow-xl hover:shadow-mu-blue/40 active:scale-[0.98] sm:w-auto"
```

Backdrop tokens present: **none**. ✅

#### 2. `next/src/components/layout/MobileMenu.tsx:94` — Drawer CTA

```tsx
className="mt-4 block min-h-14 w-full rounded-2xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-6 py-4 text-center font-extrabold tracking-tight text-white shadow-lg transition-[transform,box-shadow,filter] duration-200 active:scale-[0.96]"
```

Backdrop tokens present: **none**. ✅

#### 3. `next/src/components/layout/StickyBar.tsx:58` — Sticky-bar CTA

```tsx
className="flex min-h-11 items-center rounded-xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-mu-blue/30 transition-[transform,box-shadow,filter] duration-200 active:scale-[0.96]"
```

Backdrop tokens present: **none**. ✅

#### 4. `next/src/components/sections/ContactForm.tsx:247` — ContactForm submit

```tsx
className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mu-blue to-mu-accent-blue py-4 text-lg font-extrabold text-white shadow-[0_20px_44px_color-mix(in_oklch,var(--color-mu-blue)_32%,transparent)] transition-[transform,box-shadow,filter,opacity] duration-200 hover:shadow-[0_24px_56px_color-mix(in_oklch,var(--color-mu-blue)_42%,transparent)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
```

Backdrop tokens present: **none**. ✅

#### 5. `next/src/components/sections/FinalCTA.tsx:26` — FinalCTA primary CTA

```tsx
className="w-full sm:w-auto bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 shadow-glass-inner hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
```

Backdrop tokens present: **none**. ✅

#### 6 (Header). `next/src/components/layout/Header.tsx:14` — Wordmark gradient text (bg-clip-text)

```tsx
className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent"
```

Backdrop tokens present: **none**. ✅
Note: This is gradient *text* (clip-text), not a button surface. Listed for completeness because Plan 92-03's chrome sweep may touch Header.tsx and must not regress.

#### 7 (Header). `next/src/components/layout/Header.tsx:53` — Desktop header CTA

```tsx
className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-2.5 rounded-full font-extrabold shadow-lg shadow-mu-blue/25 hover:shadow-xl hover:shadow-mu-blue/30 transition-shadow tracking-tight"
```

Backdrop tokens present: **none**. ✅

---

## Section 2: Negative-Grep Baseline (CTA NEVER Paired with Backdrop)

The cross-cutting verification grep from `92-PATTERNS.md` "Shared Patterns" section:

```bash
grep -rn 'backdrop-filter\|backdrop-blur' \
  next/src/components/sections/HeroHub.tsx \
  next/src/components/layout/MobileMenu.tsx \
  next/src/components/layout/StickyBar.tsx \
  next/src/components/sections/ContactForm.tsx \
  next/src/components/sections/FinalCTA.tsx \
  | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'
```

Actual output: `ZERO MATCHES` ✅

**Conclusion:** Baseline is clean. No CTA call-site in any of the 5 in-scope files combines a brand gradient with `backdrop-*`. The opaque-forever invariant is satisfied at audit time.

For reference, the following backdrop-only surfaces exist in the audited files (these are legitimate glass surfaces — badges, frame chrome, drawers, secondary CTAs — and are NOT CTA gradient targets):

- `HeroHub.tsx:15` — pill badge (`bg-white/40 backdrop-blur-[20px]`)
- `HeroHub.tsx:56` — secondary CTA glass (`bg-white/50 backdrop-blur-[20px]`)
- `HeroHub.tsx:94, 103, 115` — video-frame chrome pills (`bg-mu-text-900/55 backdrop-blur-md`)
- `HeroHub.tsx:139` — floating "43 clinics" badge (`bg-white/75 backdrop-blur-[40px]`)
- `MobileMenu.tsx:38, 47, 52` — toggle button, scrim, drawer (`backdrop-blur-{xl,sm,[80px]}`)
- `StickyBar.tsx:44` — bar container (`bg-white/68 backdrop-blur-3xl`)
- `ContactForm.tsx:111` — success overlay (`bg-white/82 backdrop-blur-3xl`)
- `ContactForm.tsx:128` — input base (`bg-white/50 backdrop-blur-md`)
- `FinalCTA.tsx:8` — section frame (`bg-white/60 backdrop-blur-3xl`)
- `FinalCTA.tsx:33` — phone (secondary) CTA (`bg-white/60 backdrop-blur-xl`)

Each of the above surfaces stays a glass/backdrop surface; none carries the brand CTA gradient. Plans 92-03..92-08 may freely modify these adjacent surfaces (per their respective archetypes), but must not migrate the CTA gradient onto them.

**Downstream gating:** Every Wave 2/3/4 plan (92-03..92-08) acceptance criterion that touches a CTA-bearing component MUST re-run this exact negative grep and assert `ZERO MATCHES`. A non-zero result is a hard regression — fail loudly and revert.

---

## Section 3: Header.tsx (Legacy) Rendered-Status Check

Commands and verbatim results:

```bash
grep -rn "from '@/components/layout/Header'" next/src/app/ next/src/components/
```
```
next/src/app/layout.tsx:5:import { Header } from '@/components/layout/Header';
```

```bash
grep -rn 'import.*Header[^C]' next/src/app/ next/src/components/
```
```
next/src/app/layout.tsx:5:import { Header } from '@/components/layout/Header';
```

### Conclusion: **RENDERED**

`next/src/app/layout.tsx:5` imports `Header` from `@/components/layout/Header` and renders it as the global app shell header. **`Header.tsx` is NOT dead code.**

**Implication for Plan 92-03 (chrome sweep):** Plan 92-03 must include `Header.tsx` in its chrome scope and apply Archetype A. Two CTA surfaces are present in the file:
- Line 14: wordmark `bg-clip-text` gradient (text, not button)
- Line 53: desktop CTA button (gradient-on-button — the canonical opaque CTA)

Both are listed in Section 1 as IN-SCOPE baselines. Plan 92-03 MUST preserve both verbatim.

---

## Section 4: FinalCTA `mix-blend-multiply` Violation Baseline

Verbatim source — `next/src/components/sections/FinalCTA.tsx` lines 10–18:

```tsx
            {/* Left Content */}
            <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
              {/* Decorative blur blob */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" aria-hidden="true" />

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-mu-text-900 mb-6 leading-tight drop-shadow-sm">
                Не{'\u00A0'}откладывайте решение о{'\u00A0'}здоровье
              </h2>
              <p className="text-xl text-mu-text-700 font-medium mb-10 leading-relaxed max-w-lg">
```

Offending element (line 14):
```tsx
<div className="absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" aria-hidden="true" />
```

> **Anti-pattern #8 violation present at `FinalCTA.tsx:14`.** Retirement deferred to Plan 92-08 (Wave 4). Plan 92-08 must either (a) remove the entire decorative `<div>` OR (b) drop only `mix-blend-multiply` and explicitly sanction the residual decorative blur with a Key Decision in `PROJECT.md`. Until Plan 92-08 ships, this violation is the single known anti-pattern in the audited Phase 92 chrome+index surface; no other component in the IN-SCOPE set (HeroHub, MobileMenu, StickyBar, ContactForm, Header) carries `mix-blend-*`.

For audit completeness, a wider grep confirms no other `mix-blend-*` usage in the IN-SCOPE files:
- `HeroHub.tsx`: no `mix-blend-*`
- `MobileMenu.tsx`: no `mix-blend-*`
- `StickyBar.tsx`: no `mix-blend-*`
- `ContactForm.tsx`: no `mix-blend-*`
- `Header.tsx`: no `mix-blend-*`
- `FinalCTA.tsx`: 1 occurrence (line 14, documented above)

---

## Section 5: Sign-off

```
AUDIT COMPLETE: 2026-04-30
Baseline locked. Plans 92-03 through 92-08 must:
- Preserve every IN-SCOPE CTA className verbatim (no backdrop-* added)
- Treat Header.tsx per Section 3 conclusion (RENDERED — Plan 92-03 chrome sweep applies)
- Plan 92-08 retires FinalCTA:14 mix-blend-multiply violation
```

### Downstream Plan Consumption Map

| Downstream plan | Consumes from this audit |
|-----------------|--------------------------|
| 92-03 (chrome sweep) | Section 1 (Header.tsx:14, Header.tsx:53, MobileMenu.tsx:94, StickyBar.tsx:58 baselines); Section 3 (Header is RENDERED — sweep applies) |
| 92-04 / 92-05 / 92-06 (index sections) | Section 1 (HeroHub.tsx:48, ContactForm.tsx:247 baselines); Section 2 negative-grep gate |
| 92-07 (cross-section verification) | Sections 1 + 2 — re-run on full IN-SCOPE set |
| 92-08 (mix-blend retirement) | Section 4 (offending `<div>` verbatim + retirement options) |

### Read-only Contract Verification

- Source files modified by this audit: **0** — `git status --porcelain next/src/` returns empty.
- Build status (post-audit): unchanged (no source touched).
