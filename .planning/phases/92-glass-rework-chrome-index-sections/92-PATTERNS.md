# Phase 92: Glass Rework — Chrome + Index Sections — Pattern Map

**Mapped:** 2026-04-30
**Files analyzed:** 18 (4 chrome + 11 index sections + 2 form + 1 utility CSS) — all MODIFIED, no new files
**Analogs found:** N/A — this phase is an in-place class swap; the "analogs" are the components themselves at the BEFORE state versus the locked AFTER token strings from CONTEXT/RESEARCH/UI-SPEC

> **Strategy** (Decision E, LOCKED): Tailwind class swap, NOT migration to `.liquid-*` utility classes. Replace each `bg-white/{N}` / `backdrop-blur-{value}` with `bg-[var(--glass-{tier}-fill)]` / `backdrop-blur-[var(--glass-{tier}-blur)]`. Borders (`border-glass-border*`) and shadows (`shadow-glass*`) stay — already token-based. CTA gradients (`from-mu-blue to-mu-accent-blue`, `from-mu-cta-from to-mu-cta-to`) NEVER touched. Inputs flatten to `bg-white` opaque.

---

## Archetype Classification

Each modified file falls into one of seven archetypes. Class-swap templates are defined ONCE per archetype (§Archetype Templates), then per-file `<action>` blocks reference the archetype + provide exact line + exact before/after string.

| Archetype | Default tier | Hover tier | Heat-leak | Files |
|-----------|-------------|-----------|-----------|-------|
| **A. Chrome (Tier 0, sticky/persistent)** | Tier 0 | n/a | none | `HeaderClient.tsx`, `MobileMenu.tsx` (drawer + burger), `StickyBar.tsx`, `Footer.tsx` |
| **B. Section frame (Tier 0 wrapper)** | Tier 0 | n/a | weak (α 0.04 — via `.liquid-regular` only; arbitrary-value sweeps inherit through `backdrop-filter` on blob field) | `HeroHub.tsx` (pill, secondary CTA frame, credibility badge), `PlatformSection.tsx` (single panel), `FinalCTA.tsx` (frame), `WhyUsSection.tsx` (image frames + section pill) |
| **C. Tier-1 hover-card (clickable)** | Tier 1 | Tier 2 (hover ramp) | medium (α 0.06 if utility-applied) | `ServicesGrid.tsx` (4 cards), `ProcessSection.tsx` (4 step cards), `ProblemSection.tsx` (cards), `ClinicsSection.tsx` (country cards), `ReviewsSection.tsx` (review cards), `StatsBar.tsx` (desktop 4 cards) |
| **D. Open-state-toggle (Tier-1 closed → Tier-2 open)** | Tier 1 | Tier 2 (open) | weak→medium | `FAQSection.tsx` (closed item; hover-bg on button) |
| **E. Responsive-glass-nesting (Phase 82 — preserve)** | mobile Tier 0 wrapper / desktop transparent | desktop Tier 1 cards | n/a on wrapper, medium on desktop cards | `StatsBar.tsx` mobile wrapper |
| **F. Form panel + inputs (FORM-SAFETY GLASS-07)** | Tier 2 form (`--glass-form-fill`, ≥0.16 floor; KD-v9-002 escalation to 0.30 if WCAG fails) | n/a | suppressed | `ContactForm.tsx` (panel via `ContactSection`, input template, success overlay PRESERVED OPAQUE), `ContactSection.tsx` (form wrapper) |
| **G. Utility re-pointing (CSS internals)** | per Decision D table | n/a | already shipped commit 9c93b9f for `.liquid-card` (α 0.06) and `.liquid-regular` (α 0.04) | `liquid-glass.css` |
| **H. Over-photo controls (NOT GLASS — preserve)** | hardcoded `bg-mu-text-900/55 backdrop-blur-md` | n/a | none | `HeroHub.tsx` lines 94, 103, 115 (doctor name pill, live indicator, video controls) — DO NOT SWEEP |
| **I. Anti-pattern flag — `mix-blend-multiply` decoration** | `bg-mu-blue/30 ... mix-blend-multiply` | n/a | n/a | `FinalCTA.tsx` line 14 — flag retirement in 92-08 |
| **J. CTA opaque-forever (NEVER SWEEP)** | gradient | gradient | none | `HeroHub.tsx` line 48, `MobileMenu.tsx` line 94, `StickyBar.tsx` line 58, `ContactForm.tsx` line 247, `FinalCTA.tsx` line 26 |

---

## Archetype Templates (BEFORE → AFTER)

These are the ONLY class-substitution patterns Phase 92 plans should reference. Each per-file action block in the planner output should cite the archetype letter + provide exact line numbers + exact strings using these tokens.

### Tier-token resolution table (Phase 90, FROZEN)

| Token | Desktop value | Mobile value (≤768px) | Tailwind arbitrary form |
|-------|---------------|------------------------|--------------------------|
| `--glass-section-fill` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.10)` | `bg-[var(--glass-section-fill)]` |
| `--glass-section-blur` | `24px` clamp | `12px` clamp | `backdrop-blur-[var(--glass-section-blur)]` |
| `--glass-card-fill` | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.14)` | `bg-[var(--glass-card-fill)]` |
| `--glass-card-blur` | `20px` clamp | `12px` clamp | `backdrop-blur-[var(--glass-card-blur)]` |
| `--glass-form-fill` | `rgba(255,255,255,0.14)` | `rgba(255,255,255,0.18)` | `bg-[var(--glass-form-fill)]` |
| `--glass-form-blur` | `18px` clamp | `12px` clamp | `backdrop-blur-[var(--glass-form-blur)]` |
| `--glass-button-fill` | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.16)` | `bg-[var(--glass-button-fill)]` |
| `--glass-button-blur` | `16px` clamp | `12px` clamp | `backdrop-blur-[var(--glass-button-blur)]` |

### Archetype A: Chrome (Tier 0)

**BEFORE-pattern:** `bg-white/{30..68}` + `backdrop-blur-{[40px]|[60px]|[80px]|2xl|3xl|xl}` + sometimes `backdrop-saturate-[150%..200%]`.
**AFTER-pattern:** `bg-[var(--glass-section-fill)]` + `backdrop-blur-[var(--glass-section-blur)]`. **Drop hardcoded `backdrop-saturate-*`** — saturate is already baked into the blur token's CSS-side cascade (Phase 90 token already includes it) OR keep saturate as cosmetic if the token isn't bundling it (verify per file in 92-02).
**Borders/shadows:** `border-white/{N}` may stay (cosmetic), `shadow-glass*` stays (token-based).

### Archetype B: Section frame (Tier 0)

**BEFORE-pattern:** `bg-white/{40..75}` + `backdrop-blur-{[20px]|[40px]|xl|2xl|3xl}`.
**AFTER-pattern:** `bg-[var(--glass-section-fill)]` + `backdrop-blur-[var(--glass-section-blur)]`.

### Archetype C: Tier-1 hover-card

**BEFORE-pattern:** `bg-white/{60..65} backdrop-blur-2xl ... hover:bg-white/{70..80}` (often with `hover:shadow-glass-lg hover:border-glass-border-strong`).
**AFTER-pattern:** `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] ... hover:bg-[var(--glass-form-fill)]` (hover ramp consumes the form-fill token = 0.14/0.18 — same value used by Tier-2 hover surface). `hover:shadow-glass-lg` and `hover:border-glass-border-strong` STAY.

### Archetype D: Open-state-toggle (FAQ accordion)

**BEFORE-pattern:**
- closed item wrapper: `bg-white/60 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden`
- hover on button (closed): `hover:bg-white/80`
**AFTER-pattern:**
- closed item wrapper: `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden`
- hover on button (closed): `hover:bg-[var(--glass-form-fill)]` (Tier 2 hover via form-fill token)
- (open state: same wrapper class, the `aria-expanded={isOpen}` + `max-h-[500px]` transition already does the visual reveal — no additional bg-class swap needed unless we want OPEN to read at a higher tier; planner's call in 92-06 — Decision A says open=Tier 2 so prefer `aria-expanded:bg-[var(--glass-form-fill)]` arbitrary variant if Tailwind v4 supports it, OTHERWISE add a `data-state="open"` attribute and a CSS rule, OTHERWISE leave hover-only and document as "open visual ramp delivered by hover-on-button retained while open").

### Archetype E: Responsive-glass-nesting (StatsBar — Phase 82, preserve)

**BEFORE-pattern (StatsBar.tsx line 49, mobile wrapper):**
```tsx
className="rounded-[2rem] border border-glass-border bg-white/60 p-4 shadow-glass backdrop-blur-2xl sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"
```
**AFTER-pattern (preserve mobile-1-wrapper / desktop-transparent switch):**
```tsx
className="rounded-[2rem] border border-glass-border bg-[var(--glass-section-fill)] p-4 shadow-glass backdrop-blur-[var(--glass-section-blur)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"
```

**BEFORE-pattern (StatsBar.tsx line 56, desktop card per stat):**
```tsx
className="group relative ... sm:rounded-[2.5rem] sm:border sm:border-glass-border sm:bg-white/60 sm:p-7 sm:shadow-glass sm:backdrop-blur-2xl sm:transition-[...] sm:hover:bg-white/70 sm:hover:border-glass-border-strong sm:hover:shadow-glass-lg"
```
**AFTER-pattern (Tier 1 → Tier 2 hover, sm-prefixed):**
```tsx
className="group relative ... sm:rounded-[2.5rem] sm:border sm:border-glass-border sm:bg-[var(--glass-card-fill)] sm:p-7 sm:shadow-glass sm:backdrop-blur-[var(--glass-card-blur)] sm:transition-[...] sm:hover:bg-[var(--glass-form-fill)] sm:hover:border-glass-border-strong sm:hover:shadow-glass-lg"
```

### Archetype F: Form panel + inputs (FORM-SAFETY)

**BEFORE-pattern (ContactSection.tsx line 120, form wrapper — currently OPAQUE white):**
```tsx
<div className="rounded-[2rem] border border-white/40 bg-white p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
  <ContactForm />
</div>
```
**AFTER-pattern (Tier 2 form-fill, ≥0.16 floor; KD-v9-002 escalation path):**
```tsx
<div className="rounded-[2rem] border border-white/40 bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
  <ContactForm />
</div>
```
**Note:** This is a ~6× DROP in opacity (1.00 → 0.14 desktop). WCAG AA contrast on body copy must be measured at heat=0 worst-case AND heat=1 worst-case; if either fails, escalate `--glass-form-fill` to 0.30 and log `KD-v9-002` in PROJECT.md (Decision G — auto-decided).

**BEFORE-pattern (ContactForm.tsx line 128, input template):**
```ts
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-md focus:bg-white/72 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner';
```
**AFTER-pattern (inputs OPAQUE, drop blur entirely):**
```ts
const inputBase = 'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner';
```
**Diff details:**
- Drop `bg-white/50` → `bg-white`
- Drop `backdrop-blur-md`
- Drop `focus:bg-white/72` (no transparency animation on focus — anti-pattern: animated transparency)
- Keep `focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20` (outline OUTSIDE the input box, no fill change)
- Drop `background-color` from `transition-[...]` (no longer animates)

**BEFORE-pattern (ContactForm.tsx line 111, success overlay — PRESERVE OPAQUE):**
```tsx
<div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[inherit] bg-white/82 p-8 text-center shadow-glass-lg backdrop-blur-3xl">
```
**AFTER-pattern:** **NO CHANGE**. UI-SPEC explicitly preserves this opaque-leaning overlay. Document as deliberate exception in 92-07.

**Labels (ContactForm.tsx lines 137, 159, 182, 207):** already promoted to `text-mu-text-900 font-bold` — verify-only, no change needed.

### Archetype G: Utility re-pointing (Decision D table)

| Utility | File | Line(s) | BEFORE | AFTER |
|---------|------|---------|--------|-------|
| `.liquid-regular` | `liquid-glass.css` | 185, 186, 193, 195 | `var(--liquid-bg)` (×2 in `linear-gradient`); `blur(var(--liquid-blur-md))` | `var(--glass-section-fill)` (×2); `blur(var(--glass-section-blur))` |
| `.liquid-regular` heat-leak | `liquid-glass.css` | 178–182 | (already shipped commit 9c93b9f, α 0.04) | **NO CHANGE — preserve** |
| `.liquid-card` | `liquid-glass.css` | 350, 351, 358, 360 | `var(--liquid-bg)` (×2); `blur(var(--liquid-blur-md))` | `var(--glass-card-fill)` (×2); `blur(var(--glass-card-blur))` |
| `.liquid-card` heat-leak | `liquid-glass.css` | 343–347 | (already shipped commit 9c93b9f, α 0.06) | **NO CHANGE — preserve** |
| `.liquid-nav` | `liquid-glass.css` | 217, 218, 225, 227 | `var(--liquid-nav-bg)` (×2); `blur(var(--liquid-nav-blur))` | `var(--glass-section-fill)` (×2); `blur(var(--glass-section-blur))` |
| `.liquid-clear` | `liquid-glass.css` | 243+ | `var(--liquid-clear-bg)` | **NO CHANGE** (special-purpose modal/overlay material — Decision D row 4) |
| `.liquid-fluted` | `liquid-glass.css` | 286+ | `var(--liquid-bg)` (with fluted streaks) | **NO CHANGE** (special-purpose texture — Decision D row 5) |
| `.liquid-btn-primary` | `liquid-glass.css` | 393–403 | gradient `linear-gradient(135deg, var(--mu-cta-from), var(--mu-cta-to))` | **NO CHANGE — CTA opaque-forever** |
| `.liquid-btn-secondary` | `liquid-glass.css` | 423, 424, 431, 433 | `var(--liquid-bg)` (×2); `blur(var(--liquid-blur-md))` | `var(--glass-button-fill)` (×2); `blur(var(--glass-button-blur))` |
| `.stats-glass` | `liquid-glass.css` | 464, 465, 472, 474 | `var(--liquid-bg)` (×2); `blur(var(--liquid-blur-lg))` | `var(--glass-card-fill)` (×2); `blur(var(--glass-card-blur))` |
| `.liquid-header-backdrop` | `liquid-glass.css` | 581+ | hardcoded `blur(20px)` (Josh-Comeau extended pattern) | Decision D table says "leave or migrate per executor judgment" — **prefer leave**, flag in 92-01 if migration is trivial |
| `@a11y-layer-coverage` block | `liquid-glass.css` | 79–157 | (Phase 90 frozen) | **NO CHANGE — Decision I freeze** |

`--liquid-*` legacy vars STAY in `globals.css` (defensive; Decision D row 9).

---

## Pattern Assignments per File

For each file, the planner's task-action block should cite: **archetype letter** + **exact line numbers** + **exact before/after strings** drawn from §Archetype Templates.

### Plan 92-01 — Wave 1 — `liquid-glass.css`

**Archetype G** (utility re-pointing). Per Decision D table above (4 utility classes touched: `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-btn-secondary`, `.stats-glass`). Heat-leak rules at lines 178–182 (α 0.04) and 343–347 (α 0.06) preserved verbatim. `@a11y-layer-coverage` block (lines 79–157) NOT touched.

### Plan 92-02 — Wave 2 — Chrome (4 files, all Archetype A)

#### `next/src/components/layout/HeaderClient.tsx`

| Line | BEFORE | AFTER |
|------|--------|-------|
| 17 (default state) | `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[150%] py-5` (saturate stays — cosmetic; remove only if visual regression-free) |
| 19 (scrolled state, in `cn()` conditional) | `'bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] py-3'` | `'bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[180%] py-3'` (saturate stays per same caveat) |
| 12 (transition list) | `'transition-[padding,background-color,box-shadow,backdrop-filter] duration-300 ...'` | **NO CHANGE** — but note anti-pattern #6 risk: `backdrop-filter` is in the transition list. If sweep keeps the same blur token in both states (no scrolled differentiation), drop `backdrop-filter` from the transition list. Otherwise keep (states differ via `backdrop-saturate`, not blur token, and saturation transitions are not anti-pattern #6). Planner judgment in 92-02. |
| 14 | `shadow-glass-header` | **NO CHANGE** (token-based) |
| 13 | `border-[0.5px] border-white/50` | **NO CHANGE** (cosmetic border) |

#### `next/src/components/layout/MobileMenu.tsx`

| Line | BEFORE | AFTER |
|------|--------|-------|
| 38 (burger button) | `flex h-11 w-11 ... border border-white/55 bg-white/55 ... shadow-glass-sm backdrop-blur-xl backdrop-saturate-[180%] transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.96] lg:hidden` | `flex h-11 w-11 ... border border-white/55 bg-[var(--glass-section-fill)] ... shadow-glass-sm backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[180%] transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.96] lg:hidden` (preserve `h-11 w-11` = 44pt HIG tap target) |
| 47 (overlay backdrop) | `absolute inset-0 bg-mu-text-900/35 backdrop-blur-sm` | **NO CHANGE** — backdrop overlay is dark dimmer, not glass-tier; preserve |
| 52 (drawer nav panel) | `... border-[0.5px] border-white/55 bg-white/68 shadow-glass-lg backdrop-blur-[80px] backdrop-saturate-[200%]` | `... border-[0.5px] border-white/55 bg-[var(--glass-section-fill)] shadow-glass-lg backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[200%]` |
| 60, 69, 82 (nav-link hover) | `hover:bg-white/45` | **NO CHANGE** (interactive hover on transparent strip — leave, OR migrate to `hover:bg-[var(--glass-button-fill)]` if visual regression — planner's call) |
| 77 (divider) | `h-[0.5px] bg-white/40 my-2` | **NO CHANGE** (decorative line, not glass surface) |
| 94 (CTA gradient — **Archetype J, NEVER SWEEP**) | `bg-gradient-to-r from-mu-blue to-mu-accent-blue` | **NO CHANGE — opaque-forever** |

#### `next/src/components/layout/StickyBar.tsx`

| Line | BEFORE | AFTER |
|------|--------|-------|
| 44 (wrapper) | `fixed ... rounded-2xl border border-white/60 bg-white/68 p-3 shadow-glass-lg backdrop-blur-3xl transition-transform duration-300 lg:hidden ${isHidden ? 'translate-y-...' : ''}` | `fixed ... rounded-2xl border border-white/60 bg-[var(--glass-section-fill)] p-3 shadow-glass-lg backdrop-blur-[var(--glass-section-blur)] transition-transform duration-300 lg:hidden ${isHidden ? 'translate-y-...' : ''}` |
| 58 (CTA gradient — **Archetype J**) | `bg-gradient-to-r from-mu-blue to-mu-accent-blue` | **NO CHANGE — opaque-forever** |

#### `next/src/components/layout/Footer.tsx`

| Line | BEFORE | AFTER |
|------|--------|-------|
| 18 (outer glass card) | `bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-12 border border-white/60 shadow-glass-lg` |
| 89 (phone icon chip) | `bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong` | `bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong` (Tier 3 — small decorative inner chip) |
| 100 (mail icon chip) | (identical to line 89) | (identical AFTER) |

### Plan 92-03 — Wave 2 — Hero + Stats

#### `next/src/components/sections/HeroHub.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15 | B (pill badge) | `mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-glass-border bg-white/40 px-4 py-2.5 shadow-glass-sm backdrop-blur-[20px] sm:px-5` | `... bg-[var(--glass-section-fill)] ... backdrop-blur-[var(--glass-section-blur)] ...` |
| 48 | **J — CTA, NEVER SWEEP** | `bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE** |
| 56 | B (secondary CTA glass) | `... border border-glass-border bg-white/50 ... shadow-glass backdrop-blur-[20px] transition-[...] duration-200 hover:bg-white/60 sm:w-auto` | `... border border-glass-border bg-[var(--glass-section-fill)] ... shadow-glass backdrop-blur-[var(--glass-section-blur)] transition-[...] duration-200 hover:bg-[var(--glass-card-fill)] sm:w-auto` (per UI-SPEC: secondary CTA hover ramps to Tier 1) |
| 94, 103, 115 | **H — over-photo controls, PRESERVE** | `... bg-mu-text-900/55 px-... backdrop-blur-md ...` | **NO CHANGE — NOT GLASS, dark surface over photo** |
| 139 | C? B? (credibility badge — Decision A: "Tier 1 — cards-style") | `... border border-glass-border-strong bg-white/75 p-3 shadow-glass backdrop-blur-[40px] ...` | `... border border-glass-border-strong bg-[var(--glass-card-fill)] p-3 shadow-glass backdrop-blur-[var(--glass-card-blur)] ...` (Tier 1 per CONTEXT.md Decision A row 2) |

#### `next/src/components/sections/StatsBar.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 49 | E (responsive-glass-nesting — mobile wrapper) | (see Archetype E template above) | (see Archetype E template above) |
| 56 | E + C (desktop card with hover) | (see Archetype E template above) | (see Archetype E template above) |
| 59 | (icon chip — `${stat.iconBg} ${stat.iconText}`) | **NO CHANGE** — color-tinted decorative chips already use brand-color tokens (`bg-mu-accent-blue/12`, etc.); not glass-tier |

### Plan 92-04 — Wave 2 — Mid sections part 1

#### `next/src/components/sections/ServicesGrid.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 80 (section pill) | B | `... border border-glass-border bg-white/40 px-5 py-2.5 shadow-glass-inner backdrop-blur-xl` | `... border border-glass-border bg-[var(--glass-section-fill)] px-5 py-2.5 shadow-glass-inner backdrop-blur-[var(--glass-section-blur)]` |
| 104 (card) | C | `group flex h-full flex-col rounded-[2rem] border border-glass-border bg-white/60 p-6 shadow-glass backdrop-blur-2xl transition-[...] duration-300 hover:-translate-y-0.5 hover:border-glass-border-strong hover:bg-white/70 hover:shadow-glass-lg sm:p-7` | `group flex h-full flex-col rounded-[2rem] border border-glass-border bg-[var(--glass-card-fill)] p-6 shadow-glass backdrop-blur-[var(--glass-card-blur)] transition-[...] duration-300 hover:-translate-y-0.5 hover:border-glass-border-strong hover:bg-[var(--glass-form-fill)] hover:shadow-glass-lg sm:p-7` |
| 115 (nested price badge — **anti-pattern #13 risk: ≤2 layers per viewport**) | (decorative inner) | `... border border-glass-border bg-white/50 px-3 py-1 shadow-sm backdrop-blur-md` | **OPTION A:** `... border border-glass-border bg-[var(--glass-button-fill)] px-3 py-1 shadow-sm backdrop-blur-[var(--glass-button-blur)]` (Tier 3 inner). **OPTION B:** drop `backdrop-blur-md` entirely (decorative tag pills don't need their own blur — collapses nesting from 2→1 per card). **Recommendation:** Option B; flag for in-browser tuning in 92-04. |

#### `next/src/components/sections/ProcessSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 107 (step card) | C | `group relative flex h-full flex-col rounded-[2rem] border border-glass-border bg-white/65 p-6 shadow-glass backdrop-blur-2xl transition-[...] duration-300 hover:border-glass-border-strong hover:shadow-glass-lg sm:p-7` | `group relative flex h-full flex-col rounded-[2rem] border border-glass-border bg-[var(--glass-card-fill)] p-6 shadow-glass backdrop-blur-[var(--glass-card-blur)] transition-[...] duration-300 hover:border-glass-border-strong hover:shadow-glass-lg sm:p-7` (note: card has no `hover:bg-*` — hover ramp here is shadow + border-color only; LEAVE or ADD `hover:bg-[var(--glass-form-fill)]` per planner judgment) |
| 117 (inner icon chip — Tier 3-equivalent) | (decorative inner) | `flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border bg-white/55 text-mu-text-700 backdrop-blur-md` | `... bg-[var(--glass-button-fill)] ... backdrop-blur-[var(--glass-button-blur)]` |

#### `next/src/components/sections/ProblemSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 102 (problem card) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 h-full flex flex-col overflow-hidden p-3` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 h-full flex flex-col overflow-hidden p-3` (hover bg-ramp can be added by planner; see ServicesGrid pattern) |
| 105 (inner icon chip) | (decorative — color-tinted via `${card.iconBg}`) | `w-14 h-14 ${card.iconBg} backdrop-blur-xl rounded-2xl ...` | **PARTIAL:** keep `${card.iconBg}` (brand color tint), drop or migrate `backdrop-blur-xl` → `backdrop-blur-[var(--glass-button-blur)]` to standardize. Anti-pattern #5 (statically painted green tint) is NOT triggered here because `${card.iconBg}` is brand color from data, not green-on-card surface. |

### Plan 92-05 — Wave 2 — Mid sections part 2

#### `next/src/components/sections/WhyUsSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 13 (section pill) | B | `inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-glass-border px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6` | `... bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border ...` |
| 28, 45, 62, 79 (advantage icon chips) | (decorative — color-tinted: `bg-mu-blue/10`, `bg-mu-accent-teal-bg`, `bg-mu-accent-orange-bg`, `bg-mu-green-50`) | `w-16 h-16 ${color} backdrop-blur-xl rounded-[1.5rem] flex ... shadow-glass-sm border border-glass-border ...` | Keep brand-color fills; replace `backdrop-blur-xl` → `backdrop-blur-[var(--glass-button-blur)]` for consistency (anti-pattern #5: NOT triggered — these are brand-color icon chips, not green tint on cards) |
| 99, 102, 107 (image frames) | B | `h-{64,80} rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl bg-white/20` | `h-{64,80} rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-[var(--glass-section-blur)] bg-[var(--glass-section-fill)]` |
| 110 (stat card) | C? B? (no hover state — Decision A: "Tier 1 stat card") | `h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border border-white/60 bg-white/40 backdrop-blur-2xl p-8 flex flex-col justify-center shadow-glass-inner` | `h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border border-white/60 bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] p-8 flex flex-col justify-center shadow-glass-inner` |

#### `next/src/components/sections/ClinicsSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 130 (country card) | C | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300` (no `hover:bg-*` in source — hover ramp is shadow+border only, optional `hover:bg-[var(--glass-form-fill)]` ADD by planner) |

#### `next/src/components/sections/PlatformSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 15 (single panel) | B | `bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-glass-border shadow-glass max-w-3xl mx-auto` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-8 md:p-12 border border-glass-border shadow-glass max-w-3xl mx-auto` |

#### `next/src/components/sections/ReviewsSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 77 (review card) | C | `bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300` |

### Plan 92-06 — Wave 3 — `FAQSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 115 (closed item wrapper) | D (closed Tier 1) | `bg-white/60 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden` | `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden` |
| 119 (button hover) | D (Tier-2 hover ramp) | `w-full text-left px-6 py-5 font-bold text-mu-text-900 flex items-center justify-between transition-colors hover:bg-white/80` | `w-full text-left px-6 py-5 font-bold text-mu-text-900 flex items-center justify-between transition-colors hover:bg-[var(--glass-form-fill)]` |
| 141 (max-height transition wrapper) | (preserved Phase 71 accordion) | `overflow-hidden transition-[max-height] duration-300 ease-in-out ...` | **NO CHANGE — preserve smooth-anim accordion** |
| Open-state Tier-2 fill (Decision A: open=Tier 2) | D | n/a — current code ramps via hover only | Planner choice in 92-06: (a) accept hover-ramp-while-open as the visual cue, OR (b) add `aria-expanded:bg-[var(--glass-form-fill)]` arbitrary variant if Tailwind v4 `aria-*` modifier supports it, OR (c) add `data-state="open"` + a CSS rule. **Document the choice** in the plan. |

### Plan 92-07 — Wave 3 — Form FORM-SAFETY

#### `next/src/components/sections/ContactSection.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 26 (outer section gradient) | (special — NOT glass-tier; Decision A says Tier 0 BUT current is `bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue py-...`) | `relative z-10 overflow-hidden bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue py-16 sm:py-20 lg:py-24` | **PATH A (recommended per RESEARCH §Pitfall 2):** **NO CHANGE** — preserve blue gradient backdrop; flag that "localized blob dimming" (Decision B step 5) becomes a no-op because form sits over opaque blue rectangle, not page blob field. **PATH B:** drop the gradient → expose blob → enables Decision B step 5. Higher visual change; needs explicit Key Decision. **Recommendation Path A.** |
| 35 (decorative blur inside section) | (decorative) | `absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-white/15 blur-[120px]` | **NO CHANGE** (decorative blur, not glass-tier) |
| 36 (decorative blur — green) | (decorative) | `absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-mu-green-500/25 blur-[120px]` | **NO CHANGE** |
| 60, 83 (trust signal cards over the blue gradient — NOT page blob) | (over-gradient chrome) | `flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md` | Path A keeps these; could migrate to `bg-[var(--glass-button-fill)]` for parity, but they're over a vivid blue gradient where 0.10 white reads differently than over the blob — **planner judgment in 92-07.** Recommendation: leave as-is (stylistic match to white-on-blue contract). |
| 63 (icon bg over gradient) | (decorative) | `bg-white/20` | **NO CHANGE** |
| 120 (form panel wrapper) | F | `rounded-[2rem] border border-white/40 bg-white p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8` | `rounded-[2rem] border border-white/40 bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8` (see Archetype F note: 1.00 → 0.14 desktop drop; WCAG measurement gates KD-v9-002 escalation to 0.30) |

#### `next/src/components/sections/ContactForm.tsx`

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 111 (success overlay) | F (PRESERVE OPAQUE) | `absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[inherit] bg-white/82 p-8 text-center shadow-glass-lg backdrop-blur-3xl` | **NO CHANGE — preserve opaque-leaning success overlay** (UI-SPEC explicit) |
| 112 (success icon disc) | F | `mb-6 flex h-24 w-24 ... rounded-full border border-white/70 bg-white/80 shadow-glass-sm` | **NO CHANGE** (decorative inner; opaque-leaning matches success-overlay context) |
| 128 (input template — `inputBase`) | F (inputs OPAQUE) | `'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-md focus:bg-white/72 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner'` | `'w-full min-h-14 px-5 py-4 rounded-2xl border bg-white focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner'` (see Archetype F template diff) |
| 137, 159, 182, 207 (labels) | F (verify-only) | `block text-sm font-bold text-mu-text-900 mb-2` | **NO CHANGE — already promoted** (Decision B step 2 verify-only) |
| 247 (submit gradient — **Archetype J, NEVER SWEEP**) | J | `... rounded-2xl bg-gradient-to-r from-mu-blue to-mu-accent-blue ...` | **NO CHANGE — opaque-forever** |

### Plan 92-08 — Wave 4 — `FinalCTA.tsx` + verification

| Line | Archetype | BEFORE | AFTER |
|------|-----------|--------|-------|
| 8 (frame) | B | `bg-white/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong` | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong` |
| 14 (decorative blob with **`mix-blend-multiply` — Archetype I, anti-pattern #8**) | I | `absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply` | **RECOMMENDED: REMOVE entire decorative `<div>` element** (UI-SPEC 92-08 flag — let heat-leak handle ambient). **ALTERNATIVE: drop `mix-blend-multiply` only, keep the rest** (still anti-pattern but #8 retired). **Plan 92-08 must explicitly resolve this — log Key Decision if sanctioning.** |
| 26 (CTA gradient — **Archetype J**) | J | `bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl ...` | **NO CHANGE — opaque-forever** |
| 33 (phone CTA glass — Tier 3 secondary glass button) | B / Tier 3 | `w-full sm:w-auto bg-white/60 backdrop-blur-xl text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-white/80 transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg` | `w-full sm:w-auto bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-[var(--glass-form-fill)] transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg` (Tier 3 default → Tier 2 hover ramp via form-fill token) |
| 59 (image gradient overlay) | (decorative) | `absolute inset-0 bg-gradient-to-r from-white/60 to-transparent w-1/3` | **NO CHANGE** (image-overlay gradient, not glass surface) |

---

## Shared Patterns (cross-cutting)

### CTA opaque-forever invariant (Archetype J)

**Source of truth:** DESIGN.md `## v9.0 Custom Rules` master list (Phase 90 frozen).
**Apply to:** every plan (92-02 through 92-08).
**Locations:** `HeroHub.tsx:48`, `MobileMenu.tsx:94`, `StickyBar.tsx:58`, `ContactForm.tsx:247`, `FinalCTA.tsx:26`.

**Verification grep (every plan must run before sign-off):**
```bash
grep -rn 'backdrop-filter\|backdrop-blur' next/src/components/sections/HeroHub.tsx \
  next/src/components/layout/MobileMenu.tsx \
  next/src/components/layout/StickyBar.tsx \
  next/src/components/sections/ContactForm.tsx \
  next/src/components/sections/FinalCTA.tsx \
  | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'
```
Expected: zero matches. Any line where a gradient class appears within the same className string as `backdrop-blur-*` is a defect.

### Border + shadow tokens (NO CHANGE across all sweeps)

**Apply to:** all archetypes A–F.
- `border-glass-border` / `border-glass-border-strong` — STAY (Phase 73 era token-based)
- `shadow-glass`, `shadow-glass-lg`, `shadow-glass-sm`, `shadow-glass-inner`, `shadow-glass-inner-strong`, `shadow-glass-header` — STAY (token-based)

### Mobile blur cap (≤12px, anti-pattern #12)

**Source:** Phase 90/91 — `--glass-{tier}-blur` tokens already clamp to 12px on mobile via `clamp(12px, fluid-vw, ceiling)`. Compliant by token consumption — the moment a sweep replaces `backdrop-blur-2xl` (40px hardcoded) with `backdrop-blur-[var(--glass-{tier}-blur)]`, mobile cap is automatic.
**Anti-pattern flag:** if a planner ever writes `backdrop-blur-[40px]` or any hardcoded numeric blur AFTER Phase 92 sweep, that's a regression. Use only token references.

### `≤2 glass siblings per viewport` rule (anti-pattern #13)

**Apply to:** ServicesGrid.tsx (line 115 nested badge inside Tier-1 card — at-risk), MobileMenu.tsx (drawer + backdrop — borderline), StatsBar.tsx (Phase 82 nesting — preserved).
**Rule:** count glass surfaces visible simultaneously per viewport.
**Sanctioned exceptions:**
1. ServicesGrid 4-cards-on-desktop (Phase 82 documented exception — cards count as siblings of each other, not of an enclosing glass; verify in Phase 94).
2. MobileMenu drawer + dark dimmer backdrop — backdrop is `bg-mu-text-900/35 backdrop-blur-sm` (dark, not white-glass-tier; counts as 1 dimmer, not 1 glass).

### Anti-pattern enforcement gate (Decision H)

**Apply to:** every plan 92-NN. Each plan MUST grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks. Specific blocks to assert in plan tasks:
- **#4** (fills > 0.16) — token consumption ensures compliance for Tier 0/1; Tier 3 button = exact 0.16 mobile is the only non-form 0.16 occurrence; Tier 2 form panel ≤ 0.18 mobile (form-safety exception family) escalatable to 0.30 only via `KD-v9-002`.
- **#5** (statically-painted green tint on cards) — heat-leak `radial-gradient` is allowed (blob-position-driven, gated by `--blob-heat`); brand-color icon chips (`bg-mu-blue/10`, etc.) are NOT green-tint-on-card violations (they're brand-color icon backgrounds inside cards).
- **#6** (animated `backdrop-filter`) — HeaderClient.tsx line 12 has `transition-[...,backdrop-filter,...]` — flag for review in 92-02 (saturation transition is tolerable; blur-token transition only if values differ between scroll states).
- **#8** (`mix-blend-mode` on glass) — FinalCTA.tsx line 14 currently violates; retire in 92-08.
- **#11** (`backdrop-filter` on `.living-blob-field`) — Phase 92 doesn't touch blob-field. Compliant by no-op.
- **#12** (mobile blur >12px) — token consumption enforces. Compliant.
- **#13** (>2 glass layers per viewport) — see rule above.
- **#14** (new glass class without `@a11y-layer-coverage` registration) — Decision E (class-swap, not new utility) means zero new classes. Compliant by no-op.
- **#15** (cheat-passing a11y) — every plan marks a11y rows "pending live-toggle (Phase 94)". Never "verified" until Phase 94.

---

## No Analog Found / Special Cases

| File | Archetype | Special handling |
|------|-----------|------------------|
| `next/src/components/layout/Header.tsx` (legacy) | (verify-rendered first) | RESEARCH §Pitfall 4 flags this as possibly dead code. Plan 92-02 first task: `grep -r "from '@/components/layout/Header'" next/src/app/` to determine if rendered. If rendered, apply Archetype A. If not rendered, document as dead-code skip in 92-02 plan notes. |
| ContactSection blue-gradient backdrop (line 26) | (Path A vs Path B decision) | RESEARCH §Pitfall 2: form panel does NOT sit over page blob — it sits over an opaque blue rectangle. "Localized blob dimming" (Decision B step 5) becomes architecturally moot. **Recommended Path A:** preserve gradient, document dimming as n/a, still execute form-fill swap + WCAG measurement. Path B (drop gradient) requires Key Decision. |
| ContactForm success overlay (line 111) | F (PRESERVE OPAQUE) | UI-SPEC explicit "preserve `bg-white/82`" — sweep is NOT applied here. Document as deliberate exception in 92-07. |
| HeroHub over-photo controls (lines 94, 103, 115) | H (NOT GLASS) | Hardcoded `bg-mu-text-900/55 backdrop-blur-md` over a photo. NOT glass-tier; UI-SPEC and CONTEXT.md both call this out as preserve-as-is. |
| Heat-leak radial-gradient on `/`-route components | (Pitfall 1 — pattern gap) | RESEARCH §Pitfall 1: Decision E (class-swap) means index components don't use `.liquid-card` utility; heat-leak radial-gradient applies only to surfaces using `.liquid-card`/`.liquid-regular` utility classes. On `/` route, optical blob response is delivered solely by `backdrop-filter` blurring the moving blob underneath. Plan 92-08 verification recipe must distinguish the two mechanisms; success criterion (5) is met by `backdrop-filter`-driven response, not radial-gradient layer presence on swept components. |

---

## Metadata

**Analog search scope:**
- `next/src/components/layout/{HeaderClient,MobileMenu,StickyBar,Footer,Header}.tsx`
- `next/src/components/sections/*.tsx` (12 files: HeroHub, StatsBar, ServicesGrid, ProcessSection, ProblemSection, WhyUsSection, ClinicsSection, PlatformSection, ReviewsSection, FAQSection, FinalCTA, ContactSection, ContactForm)
- `next/src/styles/liquid-glass.css` (lines 170–478 inspected; lines 79–157 `@a11y-layer-coverage` block FROZEN)
- Decision D table from CONTEXT.md
- UI-SPEC per-component tier assignment + interaction state matrix

**Files inspected (read-only):** 18

**Pattern extraction date:** 2026-04-30

**Note on archetype reuse:** archetypes B, C, F provide template strings used across 4–6 files each. Per-file action blocks should reference the archetype rather than re-state the template. Per-file tables above provide line-numbered exact swaps.

## PATTERN MAPPING COMPLETE
