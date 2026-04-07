---
phase: 38
plan: 1
subsystem: css-layout
tags: [vertical-rhythm, hero-sizing, tailwind-tokens, svh, scroll-margin, animations]
dependency_graph:
  requires: [phase-36-layout-primitives, phase-37-metadata]
  provides: [hero-min-height-tokens, section-spacing-tokens, scroll-anchor-offsets, rhythm-system]
  affects: [index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, 404.html, theme.css, animations.js, main.js]
tech_stack:
  added: []
  patterns: [tailwind-v4-min-height-tokens, svh-hero-heights, content-density-tiers, es5-sessionstorage-guard]
key_files:
  created: [.planning/phases/38-vertical-rhythm-section-sizing/38-SUMMARY.md]
  modified:
    - src/styles/theme.css
    - css/styles.css
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html
    - 404.html
    - js/animations.js
    - js/main.js
decisions:
  - "Tailwind v4 uses --min-height-* (not --height-*) to generate min-h-* utilities — confirmed via smoke test"
  - "Simpler body approach: remove min-h-screen from body only (no page-shell flex wrapper)"
  - "RHYTHM-07 already satisfied: existing prefers-reduced-motion block includes scroll-behavior: auto !important"
  - "RHYTHM-09: online-consultations and treatment-abroad H1s added max-w-[55ch]; others already constrained by parent containers"
metrics:
  duration: 85min
  completed: 2026-04-07
  tasks_completed: 9
  files_modified: 10
---

# Phase 38 Plan 1: Vertical Rhythm & Section Sizing Summary

**One-liner:** `svh`-based hero tokens (rich/medium/compact tiers) with `--min-height-*` Tailwind v4 pattern, migrated across all 6 pages, with scroll-margin, rootMargin, and counter session cache.

---

## Smoke Test Result — CRITICAL GATE (RHYTHM-03)

**Result: PASSED** (with key pattern correction)

**Finding:** The plan specified `--height-section-*` in `@theme inline`. Smoke test revealed this does NOT generate `min-h-*` utilities in Tailwind v4.

**Correct pattern confirmed:**
- `--min-height-section-X` in `@theme inline` → generates `.min-h-section-X` utility ✓
- `--spacing-section-X` in `@theme inline` → generates `.pt-section-X`, `.pb-section-X` utilities ✓
- `--height-section-X` → generates NOTHING (incorrect, do not use)

All subsequent token additions use the confirmed `--min-height-*` pattern.

---

## RHYTHM Requirements Status

| REQ-ID | Description | Status |
|--------|-------------|--------|
| RHYTHM-01 | Vertical rhythm tokens in `:root` | DONE — 6 tokens added (3 hero clamps + 3 spacing) |
| RHYTHM-02 | `@theme inline` re-exports | DONE — 6 tokens using `--min-height-*` and `--spacing-*` |
| RHYTHM-03 | Smoke test before migration | DONE — Passed with key pattern correction |
| RHYTHM-04 | Remove `body min-h-screen` | DONE — All 6 pages |
| RHYTHM-05 | Hero classes → content-density tiers | DONE — All 5 content pages + 404 |
| RHYTHM-06 | `scroll-margin-top: 6rem` on anchored elements | DONE — `@layer base` in theme.css |
| RHYTHM-07 | `prefers-reduced-motion: reduce` + scroll-behavior: auto | DONE — Already existed in theme.css global block |
| RHYTHM-08 | Scroll-reveal rootMargin | DONE — All 5 Motion `inView()` calls updated |
| RHYTHM-09 | Cyrillic hero H1 max-width | DONE — max-w-[55ch] added to 2 unconstrained H1s |
| RHYTHM-10 | Viewport verification (320–1920) | DEFERRED — see below |
| RHYTHM-11 | Post-migration gate: zero ad-hoc min-h-[ | DONE — Grep gate passed |
| RHYTHM-12 | Counter animation sessionStorage cache | DONE — ES5-compatible guard in main.js |

---

## Token Additions

### `:root` (src/styles/theme.css)

```css
--section-h-hero-rich:    clamp(560px, 75svh, 760px);   /* index, online-consultations */
--section-h-hero-medium:  clamp(500px, 65svh, 700px);   /* treatment-abroad, checkup */
--section-h-hero-compact: clamp(440px, 55svh, 580px);   /* contacts, 404 */
--section-pt:    8rem;    /* replaces pt-32 */
--section-pt-lg: 10rem;   /* replaces lg:pt-40 */
--section-pb:    4rem;    /* replaces pb-16 */
```

### `@theme inline` (src/styles/theme.css)

```css
/* Tailwind v4 confirmed pattern: --min-height-X → .min-h-X */
--min-height-section-hero-rich: var(--section-h-hero-rich);
--min-height-section-hero-medium: var(--section-h-hero-medium);
--min-height-section-hero-compact: var(--section-h-hero-compact);
--spacing-section-pt: var(--section-pt);
--spacing-section-pt-lg: var(--section-pt-lg);
--spacing-section-pb: var(--section-pb);
```

---

## Hero Tier Assignments (5 pages + 404)

| Page | Tier | Token | Before |
|------|------|-------|--------|
| index.html | Rich | `min-h-section-hero-rich` | `min-h-screen` |
| online-consultations.html | Rich | `min-h-section-hero-rich` | none (pt-32 pb-16 only) |
| treatment-abroad.html | Medium | `min-h-section-hero-medium` | none (pt-32 pb-16 only) |
| checkup.html | Medium | `min-h-section-hero-medium` | `min-h-[80vh]` |
| contacts.html | Compact | `min-h-section-hero-compact` | none (main had no min-h) |
| 404.html | Compact | `min-h-section-hero-compact` | `min-h-[80vh]` |

**contacts.html special handling:** Mobile sticky-bar safe-area padding `pb-[calc(7rem+env(safe-area-inset-bottom))]` preserved; `lg:pb-section-pb` used for desktop. This is intentional per AUDIT-01 requirement.

---

## Post-Migration Gate (RHYTHM-11)

```bash
grep -n 'min-h-\[' index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html
# → (no output) GATE PASSED
```

Zero ad-hoc `min-h-[` values remain in any hero/main section across all 6 pages.

---

## Scroll-Reveal rootMargin (RHYTHM-08)

**File:** `js/animations.js`

**Motion API note:** Motion standalone uses `margin` (not `rootMargin`) in `inView()` options. Updated all 5 calls:

- Line 47: `.animate-fade-up` inView
- Line 67: `.animate-stagger` inView
- Line 146: `.animate-fade-left` inView
- Line 160: `.animate-fade-right` inView
- Line 174: `.animate-scale-in` inView

Change: `{ amount: 0.2 }` → `{ amount: 0.2, margin: '-100px 0px -100px 0px' }`

---

## Counter Animation Session Cache (RHYTHM-12)

**File:** `js/main.js`, function `initAnimatedCounters()` (line 478)

ES5-compatible implementation:
- Guard at function entry: `if (sessionStorage.getItem('counters-animated') === '1') return;`
- Flag set before observer fires (avoids race condition on SPA re-init)
- `typeof sessionStorage !== 'undefined'` guard for safety
- No `const`/`let`, no arrow functions — ES5 strict compliant

---

## RHYTHM-10: Viewport Verification — DEFERRED

Cannot be automated without Playwright (not available in this project). Must be verified manually in browser devtools before calling Phase 38 "truly complete."

**Required viewports:**
`320, 360, 390, 412, 768, 1024, 1280, 1440, 1920`

**What to check per viewport on each of 5 pages:**
1. Hero section fills appropriate visual space (not "swimming" on tall viewport, not cramped on small)
2. No section feels empty — content should vertically center correctly
3. No footer floating on short-content pages
4. Sticky header not obscuring anchor-linked headings (scroll-margin-top: 6rem)

**Android KZ market note:** 360px and 412px included specifically for Казахстан Android Chrome users (per MIN-09).

---

## Deviations from Plan

### Auto-corrected Issues

**1. [Rule 1 - Bug] Wrong @theme inline key pattern (`--height-*` → `--min-height-*`)**
- **Found during:** Mandatory smoke test (RHYTHM-03)
- **Issue:** Plan specified `--height-section-*` keys in `@theme inline`. Tailwind v4 does NOT generate `min-h-*` utilities from `--height-*` keys. Only `--min-height-*` generates `min-h-*`.
- **Fix:** Used `--min-height-section-*` for all hero height tokens; `--spacing-section-*` confirmed correct for pt/pb tokens
- **Files modified:** `src/styles/theme.css`
- **Commit:** c2388e3

**2. [Rule 2 - Already satisfied] RHYTHM-07 reduced-motion scroll-behavior**
- **Found during:** Task 2 review
- **Issue:** RHYTHM-07 calls for `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`. The existing `theme.css` already has a `prefers-reduced-motion` block that sets `scroll-behavior: auto !important` on `*` (covers `html` element).
- **Fix:** Added comment noting existing coverage; no duplicate rule added
- **Files modified:** `src/styles/theme.css` (comment only)

**3. [Rule 2 - Extra] RHYTHM-09 applied to 2 pages not 0**
- **Found during:** Task 6 review
- **Issue:** Plan said "if any are unconstrained, add max-w-[55ch]". online-consultations.html and treatment-abroad.html hero H1s had unconstrained `<div>` parents (vs index.html's `max-w-2xl` div).
- **Fix:** Added `max-w-[55ch]` to those 2 H1 elements
- **Files modified:** `online-consultations.html`, `treatment-abroad.html`
- **Commit:** 019acdd

**4. [Discretion] contacts.html compact tier on `<main>` (not a `<section>`)**
- **Decision:** contacts.html has no hero `<section>` — its hero content is directly in `<main id="page-content">`. Applied compact tier to `<main>` as specified in task description for 404.html pattern. Mobile safe-area bottom padding preserved per AUDIT-01.

---

## Commits

| Hash | Message | RHYTHM |
|------|---------|--------|
| c2388e3 | feat(38): canonical vertical rhythm tokens + scroll-margin | RHYTHM-01, 02, 06, 07 |
| 198f1d8 | refactor(38): remove body min-h-screen across 6 pages | RHYTHM-04 |
| e74fc79 | refactor(38): migrate hero classes to content-density tiers | RHYTHM-05, 11 |
| 636bb4c | fix(38): scroll-reveal rootMargin for later trigger | RHYTHM-08 |
| 696f9da | feat(38): counter animation session cache | RHYTHM-12 |
| 019acdd | fix(38): Cyrillic hero H1 max-w-[55ch] for line length | RHYTHM-09 |

---

## Known Stubs

None. All tokens are wired to real CSS values (`svh` clamps, `rem` spacing). No placeholder or hardcoded empty values.

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary changes introduced. CSS-only and JS-only changes with no data flow impact.

## Self-Check

Files created/modified:
- src/styles/theme.css: rhythm tokens + scroll-margin @layer base
- css/styles.css: recompiled with all 5+ rhythm utilities confirmed present
- index.html: body class + hero section migrated
- online-consultations.html: body + hero + H1 max-w
- treatment-abroad.html: body + hero + H1 max-w
- checkup.html: body + hero migrated
- contacts.html: body + main migrated
- 404.html: body + main migrated
- js/animations.js: 5x inView margin option
- js/main.js: sessionStorage guard in initAnimatedCounters

Commits (6 feat/refactor/fix commits + this summary commit):
- c2388e3, 198f1d8, e74fc79, 636bb4c, 696f9da, 019acdd

## Self-Check: PASSED
