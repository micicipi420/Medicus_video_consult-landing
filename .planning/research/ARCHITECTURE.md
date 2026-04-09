# Architecture Research — v4.0 Liquid Design System

**Project:** MedicusUnion KZ (existing multi-page landing — v4.0 milestone)
**Researched:** 2026-04-09
**Domain:** Static multi-page marketing site + Tailwind v4 CSS tokens + POSIX-sh partial splicer + vanilla JS
**Overall confidence:** HIGH on integration points (existing architecture is well understood and fully documented in v3.2 ship notes), MEDIUM on class-naming convention (defensible pick, not the only valid option), LOW on none.

This document answers: **"How do grid foundations, squircle primitives, and Liquid Glass material tokens integrate into the existing MedicusUnion KZ architecture with minimum churn and clean layering?"** It is goal-backward — the end state is "all 6 pages speak the new language" — and walks back to foundations.

It builds on (does not duplicate):
- `.planning/research/STACK.md` — `mask-image + data-URI` squircle default, `corner-shape` progressive enhancement, multi-layer CSS Liquid Glass, 12/8/2-3 via pure Tailwind v4, zero-Node compliance, focus-visible must move from `box-shadow` to `outline`, shadow-wrap pattern requirement
- `.planning/research/FEATURES.md` — 14 TABLE-STAKES components mapped to existing surfaces, two-variant material taxonomy (Regular + Clear, Clear is anti-feature), dark-mode reversed (v1.4 "glass-off" → v4.0 "tuned dark recipe"), per-page migration complexity order (404 → contacts → checkup → online → treatment-abroad → index)

---

## Executive Summary

**The architecture does not need a rewrite. It needs two new CSS files, one new HTML partial, a targeted extension of `theme.css`, and a focused set of class additions.** The existing layering (entry at `src/styles/tailwind.css`, tokens in `theme.css`, base styles in `index.css`, chrome in `partials/*.html`, splicer at `scripts/build-pages.sh`, byte-identity pre-commit hook) already has the correct shape for a design-system milestone. v4.0 threads through it — it does not fork it.

**Three concrete file additions, one file extension, one partial addition:**

1. **`src/styles/squircles.css`** (NEW) — squircle radius scale, mask data-URIs, `corner-shape` progressive-enhancement block, shadow-wrap helper utilities, focus-visible outline override
2. **`src/styles/liquid-glass.css`** (NEW) — Regular material tokens (light + dark), rim lighting, specular pseudo-elements, edge-glow recipes, `@supports`-gated refraction block
3. **`partials/svg-defs.html`** (NEW) — inline `<svg>` filter definitions (turbulence, displacement-map) referenced by `backdrop-filter: url(#…)`, spliced once per page via a new BUILD marker
4. **`src/styles/theme.css`** (EXTENDED, not rewritten) — adds `--container-content`, squircle `--squircle-*` tokens, Liquid Glass `--liquid-*` tokens, motion `--ease-liquid*` and `--dur-*` tokens, all bridged into `@theme inline` where Tailwind utilities are needed
5. **`scripts/build-pages.sh`** (EXTENDED by one partial) — new `svg-defs` added to `PARTIALS` list, one new case in the awk splice loop. Zero vocabulary change for the 11 existing BUILD:vars tokens

**One class-naming convention**, picked and defended in (C): **BEM-like `.liquid-*` semantic classes hand-authored in the new CSS files, side by side with raw Tailwind utilities in HTML**. Not a Tailwind plugin, not data attributes, not a custom `@layer components` namespace. The reasons are in section (C.1) and (C.2).

**Migration order** (expanded in G): tokens → primitives → chrome partials → simple pages (404, contacts) → service pages (checkup, online, treatment-abroad) → index → a11y/perf verify → docs. This is driven by two hard constraints: (1) tokens must land before utilities are referenced, (2) the byte-identity hook forbids chrome drift, so chrome partials must be correct before any page migration.

**Nothing existing is touched destructively.** The partials system, splicer, byte-identity gate, vertical rhythm tokens, WCAG AA tokens, Russian typography nbsp bindings, and `@media (prefers-reduced-motion: reduce)` guard all survive v4.0 intact.

---

## (A) CSS Token Architecture

### A.1 Where each token category lives

The existing layering in `src/styles/tailwind.css` is:

```css
@import './fonts.css';
@import 'tailwindcss' source(none);
@source '../../*.html';
@import './theme.css';
```

This is load-bearing: `theme.css` is imported **after** Tailwind's own `@import 'tailwindcss'` so that the project's `@theme inline` block and `@layer base` rules land on top of Tailwind's defaults. v4.0 must preserve this order — the new imports slot **after** `theme.css`, not before Tailwind.

**v4.0 final import order** (concrete proposal for `src/styles/tailwind.css`):

```css
@import './fonts.css';             /* 1. custom @font-face if any — existing */
@import 'tailwindcss' source(none); /* 2. Tailwind engine — existing */
@source '../../*.html';             /* 3. Content scan — existing */
@import './theme.css';              /* 4. Tokens, @theme inline, @layer base — existing, extended */
@import './squircles.css';          /* 5. NEW — squircle masks, @supports corner-shape, shadow-wrap */
@import './liquid-glass.css';       /* 6. NEW — material recipes, specular, dark-mode variants */
```

**Why this order matters for the cascade:**
- `theme.css` declares `--squircle-*` and `--liquid-*` custom properties in `:root` → `squircles.css` and `liquid-glass.css` reference them as `var(--squircle-lg)` / `var(--liquid-blur-md)`. The declaration **must precede** the consumption.
- `squircles.css` before `liquid-glass.css` because Liquid Glass surface classes (`.liquid-card`) compose with squircle utilities (`.squircle-lg`). If the squircle classes don't exist yet in the cascade when Liquid Glass rules are declared, the `.liquid-card.squircle-lg { ... }` compound selectors in `liquid-glass.css` would specificity-lose to anything squircle declared later. In practice both files only declare single-class rules, but the ordering rule ("depend-on before depend-consumers") is cheaper to honor than to reason about.
- `@layer base` rules in `theme.css` (focus-visible, section scroll-margin, reduced-motion guard) still win against the two new files because both new files use plain `.liquid-*` / `.squircle-*` selectors at the root level (no `@layer` declaration), which in Tailwind v4's layer model sit **above** `@layer base`. **This preserves the reduced-motion kill-switch behavior** — the `@media` guard still reaches into the new files and zeroes their transitions.

### A.2 Token category → file mapping

| Category | File | Scope |
|---|---|---|
| Grid foundation (`--container-content`, gutters, column hints) | `theme.css` `:root` + `@theme inline` | Tailwind v4 already generates `grid-cols-N` and `gap-N` natively — no token ceremony needed for the grid itself. Only the max-width constant needs a token because it's used across 6 pages and deserves central control |
| Squircle radius scale (`--squircle-sm/md/lg/xl/full`) | `theme.css` `:root` + `@theme inline` | Bridged into Tailwind via `@theme inline --radius-squircle-*` so `rounded-squircle-lg` becomes a utility. Also exposed as raw CSS custom properties for use inside `squircles.css` |
| Squircle mask data-URIs (`--squircle-mask-*`) | `squircles.css` `:root` | NOT bridged into `@theme inline` — they are implementation details of the `.squircle-*` classes, not Tailwind utilities. Separating them keeps `theme.css` readable (data-URIs are long strings) |
| Squircle utility classes (`.squircle-sm` etc.) | `squircles.css` | Plain class selectors, no `@layer` declaration |
| Shadow-wrap pattern helper | `squircles.css` | Documented as a two-element idiom — see (C.3) — not as a single wrapper class. Optional sugar class `.squircle-shadow-wrap` if the pattern becomes ubiquitous |
| Liquid Glass material tokens (`--liquid-bg`, `--liquid-blur-*`, `--liquid-saturate`, `--liquid-brightness`, edge-glow tokens) | `theme.css` `:root` | Live in `theme.css` so that **dark-mode cascade** — `[data-theme="dark"] { --liquid-bg: ...; }` — can override them cleanly in one place. **Do not bridge to `@theme inline`** (they are material recipes, not atomic design tokens — see A.3) |
| Liquid Glass semantic classes (`.liquid-regular`, `.liquid-rim`, `.liquid-card`, `.liquid-btn-primary`, `.liquid-input`, etc.) | `liquid-glass.css` | Plain class selectors |
| Specular / rim / edge-glow pseudo-element recipes | `liquid-glass.css` | `::before` and `::after` on base `.liquid-*` classes. Scoped to avoid conflict with existing `::before` usage — audit done in (D.5) |
| Motion tokens (`--ease-liquid`, `--dur-press`, `--dur-hover`, `--dur-sheet`) | `theme.css` `:root` + `@media (prefers-reduced-motion: reduce)` override | Co-located with the existing reduced-motion guard so both light and dark mode inherit the same zeroing behavior |
| Dark-mode variants of all of the above | `theme.css` `[data-theme="dark"]` cascade block (or extension of `.dark` block — see A.4) | Single source of truth for dark mode |

### A.3 Why material tokens are NOT all bridged to `@theme inline`

Tailwind v4's `@theme inline` is for **atomic** design tokens that generate **utility classes** — one token → one utility → one CSS property application. `--color-mu-blue` → `bg-mu-blue` / `text-mu-blue` / `border-mu-blue`. This maps cleanly.

Liquid Glass material tokens are **recipes**, not atoms: `--liquid-blur-md` is consumed inside a `backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness))` expression. There is no sensible Tailwind utility for "a blur radius atom inside a backdrop-filter recipe" — Tailwind v4 has `backdrop-blur-md` but it generates a fixed `backdrop-filter: blur(12px)`, not a custom-property expression.

**The rule for v4.0:**
- **Bridge to `@theme inline`** when Tailwind should generate a utility class (colors, radii, gaps, container max-width, shadows). This is what `theme.css` already does for brand colors and glass shadows.
- **Keep in `:root` only** when the token is consumed inside a hand-authored CSS rule (material recipes, mask data-URIs, rim gradients). These become `var(...)` references inside `squircles.css` and `liquid-glass.css`.

The two bridged new categories are (1) squircle radius scale (via `--radius-squircle-*`) and (2) container max-width (via `--container-content`). Everything else lives in raw `:root`.

### A.4 Dark-mode cascade integration

Existing project uses `.dark` class on `<html>` for dark mode (see `theme.css` line 99: `.dark { --background: ...; }`). The orchestrator prompt references `[data-theme="dark"]` — both are in use in the FEATURES research recipe. **Architecture decision: keep `.dark` for v4.0** (the existing convention) and only add `[data-theme="dark"]` if a Phase-level decision reconciles them. This is an existing-architecture compatibility choice, not a v4.0 design choice.

**Concrete dark-mode block in `theme.css`** (extension — placed after the existing `.dark { ... }` block at line 99-134):

```css
.dark {
  /* existing oklch color overrides preserved — lines 99-134 */

  /* v4.0: Liquid Glass material tokens — dark recipe */
  --liquid-bg: rgba(30, 40, 60, 0.45);
  --liquid-blur-sm: 18px;
  --liquid-blur-md: 28px;
  --liquid-blur-lg: 44px;
  --liquid-blur-xl: 64px;
  --liquid-saturate: 160%;
  --liquid-brightness: 115%;
  --liquid-border-top: rgba(255, 255, 255, 0.25);
  --liquid-border-bottom: rgba(0, 0, 0, 0.4);
  --liquid-shadow-outer: 0 16px 40px rgba(0, 0, 0, 0.45);
  --liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  --liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.3);

  /* v4.0: reverse v1.4 "glass-off in dark mode" decision */
  /* Nothing to do here — because --liquid-bg etc. now have real dark values,
     the .liquid-regular class will produce working glass in dark mode without
     any class-level conditional. The cascade handles it. */
}
```

The light-mode values live in `:root`. The dark cascade re-declares the same custom properties. All `.liquid-*` classes reference `var(--liquid-bg)` etc. and automatically pick up the right recipe based on `<html class="dark">` state.

**Important:** the existing `:root` already has a `--mu-blue` → `[data-theme="dark"]` implicit expectation, but the `.dark` selector is used. **This is an existing inconsistency — not a v4.0 problem** — but we should flag it for the dark-mode toggle phase to audit.

---

## (B) Grid Foundation — Concrete Layout

### B.1 Token additions in `theme.css`

**Raw `:root`:**

```css
:root {
  /* existing tokens unchanged */

  /* v4.0: Grid foundation */
  --container-content: 1200px;            /* canonical max-width, v1.3 decision */
  --grid-gutter-mobile: 16px;             /* gap at < 640px */
  --grid-gutter-tablet: 24px;             /* gap at md: (≥ 640px) */
  --grid-gutter-desktop: 32px;            /* gap at lg: (≥ 1024px) */
}
```

**`@theme inline` bridge** (generates Tailwind utilities):

```css
@theme inline {
  /* existing tokens unchanged */

  /* v4.0: Grid foundation — bridged for utility generation */
  --container-max-content: var(--container-content);  /* → .max-w-content */
  --spacing-gutter-mobile: var(--grid-gutter-mobile);  /* → .gap-gutter-mobile if used */
  --spacing-gutter-tablet: var(--grid-gutter-tablet);  /* → .gap-gutter-tablet */
  --spacing-gutter-desktop: var(--grid-gutter-desktop); /* → .gap-gutter-desktop */
}
```

In practice the HTML will use Tailwind's native `gap-4 md:gap-6 lg:gap-8` (which is 16/24/32px) directly without needing the named tokens — the named gutter tokens are mainly useful as documentation and as a hedge against future gutter changes.

### B.2 Column counts — explicit utilities, no plugin

Tailwind v4 natively supports `grid-cols-2`, `grid-cols-8`, `grid-cols-12`. **No config extension, no `tailwind.config.js`** — the project has no such file today, and v4's CSS-first config via `@theme inline` is already in use. Confirmed from STACK.md section C and Tailwind v4 release notes.

**The canonical grid class triplet:**

```
grid-cols-2 md:grid-cols-8 lg:grid-cols-12
```

Breakpoints: `md:` = 768px (existing Tailwind default, already in use across partials/pages), `lg:` = 1024px (existing). The 8-col tablet decision maps to `md:grid-cols-8`. The 12-col desktop maps to `lg:grid-cols-12`. The 2-col mobile is the default (before `md:`). For dense mobile layouts (icon rows, stat bars, flag grids), escalate to `grid-cols-3` selectively — this is the "2-3 cols mobile" clause from the requirement.

### B.3 Body structure — single `<main>` grid, not per-section

**Recommended pattern:** one `<main class="liquid-grid">` per page, not per-section. Sections inside `<main>` each span full-width (`col-span-2 md:col-span-8 lg:col-span-12`) and internally establish their own nested grid where needed (via `grid grid-cols-subgrid` — subgrid is Baseline in 2026, confirmed in STACK.md).

**Why one top-level grid, not per-section:**
1. **Consistent gutter cadence** — a single grid context guarantees sections share gutters and column alignment.
2. **Subgrid composability** — nested card grids inside sections can align to the outer tracks via `grid-cols-subgrid` without arbitrary column widths.
3. **Single edit point** — if the column count changes in the future, one class changes, not 50 sections × 6 pages.
4. **Byte-identity simplicity** — page-level grid markup is a per-page concern (not chrome), so it doesn't intersect the splicer or byte-identity gate.

**Proposed body skeleton** (example for `index.html`):

```html
<body class="bg-mu-bg text-mu-text-900">
<!-- BUILD:vars CTA_HREF=#contact CTA_LABEL="Оставить заявку" CURRENT_PAGE=index -->

<!-- BUILD:svg-defs -->
<!-- /BUILD:svg-defs -->    <!-- NEW partial, see E.1 -->

<!-- BUILD:header -->
<!-- /BUILD:header -->      <!-- existing partial — chrome is fixed-position, not in the grid -->

<!-- BUILD:mobile-menu -->
<!-- /BUILD:mobile-menu -->

<main class="liquid-grid grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-content mx-auto px-4 md:px-6 lg:px-8">

  <section class="hero col-span-2 md:col-span-8 lg:col-span-12">
    <!-- hero content — may have its own nested subgrid -->
  </section>

  <section class="services col-span-2 md:col-span-8 lg:col-span-12 grid grid-cols-subgrid gap-inherit">
    <article class="service-card col-span-2 md:col-span-4 lg:col-span-3"> ... </article>
    <article class="service-card col-span-2 md:col-span-4 lg:col-span-3"> ... </article>
    <article class="service-card col-span-2 md:col-span-4 lg:col-span-3"> ... </article>
    <article class="service-card col-span-2 md:col-span-4 lg:col-span-3"> ... </article>
  </section>

  <!-- more sections... -->
</main>

<!-- BUILD:footer -->
<!-- /BUILD:footer -->      <!-- footer sits outside the grid; it's full-bleed chrome -->

<!-- BUILD:sticky-bar -->
<!-- /BUILD:sticky-bar -->

<script defer src="js/main.js"></script>
</body>
```

**Chrome is NOT inside `<main>`:** the header is `position: fixed`, the sticky bar is `position: fixed`, the footer is full-bleed visually and sits below the grid. Putting them inside `<main>` would fight the grid cadence. This is consistent with the existing page structure — chrome is already outside `<main>` in v3.2.

### B.4 Container max-width — 1200px stays, partials audit needed

Per STACK.md section C and per the v1.3 project decision, the content max-width is **1200px**. However, `partials/header.html` line 1 currently uses `max-w-7xl` (1280px). This is a pre-existing drift from the v1.3 decision, not a v4.0 regression.

**v4.0 action:** when updating `partials/header.html` during the Chrome phase (G.3), change `max-w-7xl` → `max-w-content`. The byte-identity hook will propagate the change to all 6 pages in one commit. Same for `partials/footer.html` and any other partial using `max-w-7xl`.

**The `max-w-content` utility** is generated automatically from the `--container-max-content` token in `@theme inline` (see B.1). No new CSS required — just the token bridge.

### B.5 Gap strategy — CSS `gap`, never margin

Tailwind v4's native `gap-N` utility emits `gap: ...px`. On CSS Grid, `gap` is the canonical way to space columns and rows. **Do not use margin** on grid children to create gutters — it breaks subgrid inheritance and makes `grid-cols-subgrid gap-inherit` not do what you want.

**Tailwind gap classes used:** `gap-4 md:gap-6 lg:gap-8` = 16px / 24px / 32px. These match the `--grid-gutter-*` tokens in B.1 but are simpler to read in HTML.

### B.6 Container queries — subgrid already solves most cases

Tailwind v4 ships container queries natively (`@container/name`, `@md:grid-cols-8`). Useful for `partials/sticky-bar.html` and `partials/mobile-menu.html` where the container width is known locally (fixed-position chrome) and not tied to the viewport.

**Recommendation:** use container queries **only** inside partials that are fixed-position chrome and whose layout should respond to their own container. The mobile menu drawer is a good candidate — its width is viewport-minus-padding, and it already uses `@container` would help. But this is an optimization, not a requirement. **Defer to Phase-level decision.** The grid foundation phase does not need to pre-commit to container query patterns.

### B.7 Integration risks (grid foundation)

| Risk | Blast radius | Mitigation |
|---|---|---|
| Existing pages wrap content in ad-hoc `<section>` + `.container` divs, not `<main>` grid | 6 pages | Migration of `<main>` grid wrapper happens page-by-page during Chrome/Simple-Page/Service-Page phases. Do not attempt a mass rename — do it per page, test visually each time |
| `partials/header.html` uses `max-w-7xl` (1280px), not `max-w-content` (1200px) | 1 partial → 6 pages | Single edit during Chrome phase; byte-identity hook will force propagation |
| Existing `.container` class from old CSS (if any) may collide with Tailwind's `container` utility | Unknown until audit | Grep for `class="container` before Phase to catch collisions |
| Subgrid support — confirmed Baseline in 2026, but verify with real browser test before betting | 6 pages | Add a subgrid smoke test to the first grid-using page (contacts.html recommended — smallest surface) |
| `col-span-*` + `text-wrap: balance` on Russian headings may produce unexpected breaks at 8-col tablet width with long Cyrillic words | Headings in 6 pages | FEATURES.md F.4 flagged this: at tablet 8-col, cards should be 4-col minimum. Document as a convention in DESIGN-SYSTEM.md |

---

## (C) Squircle Primitives — Class Strategy

### C.1 Naming convention: **semantic class + Tailwind utility side-by-side**

**Picked:** hand-authored `.squircle-*` classes in `src/styles/squircles.css`, applied alongside raw Tailwind utilities in HTML. Example: `<article class="service-card squircle-lg backdrop-blur-[40px] p-6">`.

**Alternatives considered and rejected:**

| Option | Why rejected |
|---|---|
| **Tailwind plugin** (`squircle-md` generated by a plugin file) | Requires `tailwind.config.js` — the project deliberately has no config file and uses CSS-first `@theme inline` only. Adding a plugin is a pattern fork. Also: plugins require Node for their test harness, which fights the zero-Node constraint |
| **Data attributes** (`data-squircle="md"`) | Attribute selectors (`[data-squircle="md"]`) have higher specificity than single classes, which complicates override. Also loses the Tailwind grep-ability of class-based styling — a contributor searching `.squircle-` finds nothing |
| **Custom `@layer components` namespace** (`@layer components { .liquid-squircle-md { ... } }`) | `@layer components` is valuable for *reusable patterns* but v4.0 squircles are primitives, not component patterns. Also: Tailwind v4's layer order puts `@layer components` between `base` and `utilities`, which is fine, but naming everything `liquid-squircle-*` doubles the class-name length for no semantic gain over `squircle-*` |
| **BEM modifiers** (`.squircle__mask`, `.squircle--lg`) | The `--lg` modifier is fine, but the double-underscore child is overkill for a single-element primitive. Squircles don't have internal structure |

**Defense:** plain class selectors keep the mental model as close as possible to the existing Tailwind-heavy codebase. A reader of a v4.0 HTML element sees:
```html
<button class="squircle-md liquid-btn-primary px-6 py-3 text-white">
```
…and immediately understands: "this is a squircle at the md scale + liquid primary button style + Tailwind padding and text utilities." No vocabulary fork, no extra layer of indirection.

### C.2 Radius scale — semantic names, not numeric

**Picked:** `--squircle-sm` / `--squircle-md` / `--squircle-lg` / `--squircle-xl` / `--squircle-full` (semantic), not `--squircle-8` / `--squircle-16` etc. (numeric).

**Why semantic:**
- Matches the existing `--radius-sm/md/lg/xl` convention in `theme.css` lines 206-209 (Tailwind v4 radius tokens).
- Decouples the name from the value. If the md value changes from 16px to 18px in a future phase, `.squircle-md` remains the canonical name and no HTML edits are required.
- ЦА 45+ developers (and future contributors) find "md" more discoverable than "16" — matches existing Tailwind utility conventions.

**Concrete scale** (proposed values from STACK.md and FEATURES.md):

| Token | Value | Use cases |
|---|---|---|
| `--squircle-sm` | 8px | Badges, small chips, flag icons |
| `--squircle-md` | 16px | Text inputs, secondary buttons, icon buttons |
| `--squircle-lg` | 24px | Cards (service, clinic, review, pricing, value-prop) |
| `--squircle-xl` | 40px | Form container, hero overlay panels, mobile menu drawer, sticky header |
| `--squircle-full` | 9999px | Pills, avatars, circular icon buttons |

These are the values from STACK.md section A. The planner can tune them during the Foundation phase after visual review — the naming locks; the values can slip.

### C.3 Shadow-wrap pattern — two-element idiom, documented, not wrapped in sugar class

The shadow-wrap pattern (STACK.md trade-off 1 in section A) is required because `mask-image` clips `box-shadow`, `border`, and `outline` against the mask silhouette. A naive `.squircle-md { mask-image: ...; box-shadow: ...; }` produces a squircle with **no visible shadow**.

**The idiom:**

```html
<div class="liquid-card-wrap">          <!-- outer: carries shadow, no mask -->
  <div class="liquid-card squircle-lg">  <!-- inner: carries mask, no shadow -->
    <!-- card content -->
  </div>
</div>
```

```css
/* In liquid-glass.css */
.liquid-card-wrap {
  box-shadow: var(--liquid-shadow-outer);
  border-radius: var(--squircle-lg);  /* cheap fallback for shadow silhouette */
}
.liquid-card {
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  box-shadow: var(--liquid-shadow-inset-top), var(--liquid-shadow-inset-bottom);  /* insets are OK — they clip inside */
  /* The .squircle-lg on the element handles the mask */
}
```

**Why not wrap this in a single sugar class `.squircle-shadow-wrap`?**
- A single class cannot style the outer element — it needs an element to exist. The shadow-wrap is fundamentally a two-element pattern.
- Adding a JS runtime helper that inserts a wrapper div would add JS, fight the byte-identity gate (runtime DOM mutation ≠ compiled HTML), and violate the minimum-change principle.
- Document the idiom in `docs/DESIGN-SYSTEM.md` as a project convention. Call out the 4 surfaces where it matters: form container, cards, buttons, hero glass panels.

**Which surfaces need shadow-wrap and which don't:**

| Surface | Has box-shadow? | Needs wrap? |
|---|---|---|
| Service card (`.liquid-card`) | Yes (outer drop shadow) | ✅ YES |
| Form container | Yes (`--shadow-form-inset` exists) | Inset shadow — inset shadows are NOT clipped by mask-image. **No wrap needed** |
| Primary CTA button (`.liquid-btn-primary`) | Yes (colored glow shadow) | ✅ YES |
| Secondary button | Subtle outer shadow | ✅ YES (marginal — could accept no shadow as degradation) |
| Text input | Only inset shadow (`form-inset`) | **No wrap needed** — inset is safe |
| Icon button | No outer shadow, just rim | **No wrap needed** |
| Header (chrome) | Yes (`--shadow-glass-header`) | ✅ YES, **but** existing header doesn't use mask-image — header stays on `rounded-[2.5rem]` + box-shadow. Squircle on chrome is a v4.0 nice-to-have, not a hard requirement |
| Badge / pill | No outer shadow | **No wrap needed** |

**Implication:** the shadow-wrap pattern applies to ~3 surface types (cards, primary buttons, secondary buttons). Everything else either uses inset shadows (safe) or has no shadow. This bounds the migration complexity.

### C.4 Focus-visible migration — single override in `theme.css @layer base`

**Current (theme.css lines 252-261):**

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text);
}
```

This **will be clipped** by `mask-image` on squircle elements (STACK.md trade-off 2). The fix is to switch to `outline + outline-offset`:

**v4.0 replacement:**

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--mu-blue-text);
  outline-offset: 3px;
  box-shadow: none;  /* explicit reset in case of element-level box-shadow focus override elsewhere */
}
```

**Outline + `outline-offset` is not clipped by `mask-image`** because outline is painted outside the element's mask. This is the fix.

**Integration:** the change lives in a single block in `theme.css` `@layer base`. One edit, all 6 pages inherit. This is the "single global focus-visible rule" pattern already established in v3.0 (see PROJECT.md Key Decision "Global focus-visible CSS rule (not per-component)").

**A11y verification required:** during the Foundation phase, run keyboard-tab through all 6 pages and verify the outline ring is visible on every interactive element. WCAG AA requires minimum 3:1 contrast between the ring and the adjacent background. `var(--mu-blue-text) = #0E8FB5` against white is ~4.6:1 (passes). Against glass surfaces with saturate(180%) bloom — needs visual check, flag in PITFALLS.

### C.5 Composition with Liquid Glass — class order + cascade

**Typical card element:**
```html
<article class="liquid-card liquid-rim squircle-lg bg-glass-regular">
  ...
</article>
```

**Cascade order in the compiled CSS:**
1. `.liquid-card` → `liquid-glass.css` → sets `background`, `backdrop-filter`, `box-shadow` inset recipes
2. `.liquid-rim` → `liquid-glass.css` → adds asymmetric rim lighting
3. `.squircle-lg` → `squircles.css` → sets `border-radius` + `mask-image`
4. `.bg-glass-regular` → Tailwind-generated from `@theme inline` → may or may not conflict (see A.3 — we recommend NOT generating `bg-glass-*` utilities, so this class would not exist; `.liquid-card` is the canonical background source)

**All three v4.0 classes have the same specificity (single-class selector)** — so later-loaded classes win. File order in `tailwind.css` therefore matters: `squircles.css` is loaded before `liquid-glass.css`, so `.liquid-card` would win over `.squircle-lg` on any shared properties (which are none — they target orthogonal properties: squircle = border-radius/mask-image, liquid = background/backdrop-filter/box-shadow).

**The rule to document in DESIGN-SYSTEM.md:**
> Squircle classes and Liquid Glass classes are **orthogonal** — they style different property spaces and do not conflict. You can mix them freely: `class="liquid-card squircle-lg"` does what you expect.

### C.6 `squircles.css` — concrete file outline

```css
/*
 * src/styles/squircles.css
 *
 * Squircle primitives for MedicusUnion KZ v4.0 Liquid Design System.
 *
 * Uses mask-image + inline SVG data-URI as the production default (works
 * in Chrome, Safari, Firefox, Edge from 2022+). Progressive enhancement
 * via corner-shape: superellipse(2) for Chrome 139+ (August 2025+).
 *
 * Companion: liquid-glass.css (material recipes).
 * Tokens declared in: theme.css :root + @theme inline.
 *
 * Shadow-wrap pattern — see docs/DESIGN-SYSTEM.md section "Shadow-wrap idiom".
 */

/* SVG mask data-URIs — hand-authored per radius, reused across elements */
:root {
  --squircle-mask-sm:  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='...' fill='black'/></svg>");
  --squircle-mask-md:  url("...");
  --squircle-mask-lg:  url("...");
  --squircle-mask-xl:  url("...");
  --squircle-mask-full: url("..."); /* full = 50% ellipse */
}

/* Utility classes */
.squircle-sm { border-radius: var(--squircle-sm); -webkit-mask-image: var(--squircle-mask-sm); mask-image: var(--squircle-mask-sm); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
.squircle-md { border-radius: var(--squircle-md); -webkit-mask-image: var(--squircle-mask-md); mask-image: var(--squircle-mask-md); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
.squircle-lg { border-radius: var(--squircle-lg); -webkit-mask-image: var(--squircle-mask-lg); mask-image: var(--squircle-mask-lg); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
.squircle-xl { border-radius: var(--squircle-xl); -webkit-mask-image: var(--squircle-mask-xl); mask-image: var(--squircle-mask-xl); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
.squircle-full { border-radius: 9999px; -webkit-mask-image: var(--squircle-mask-full); mask-image: var(--squircle-mask-full); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }

/* Progressive enhancement — Chrome 139+ */
@supports (corner-shape: superellipse(2)) {
  .squircle-sm, .squircle-md, .squircle-lg, .squircle-xl, .squircle-full {
    -webkit-mask-image: none;
            mask-image: none;
    corner-shape: superellipse(2);
  }
}

/* Reduced-motion: no squircle change, but the companion @media in theme.css
   zeroes transitions across the file via the existing guard. */
```

**File size estimate:** ~60 lines of declarations + 5 data-URI strings (~2-4 kB each when inline) = ~10-20 kB source, ~5-10 kB after Tailwind CLI minify. Acceptable.

### C.7 Risks (squircle primitives)

| Risk | Blast radius | Mitigation |
|---|---|---|
| `mask-image` clips existing `box-shadow` focus rings | Every interactive element | Focus-visible migration (C.4) — already planned |
| `mask-image` clips `border: 1px solid ...` on cards | Card borders across 6 pages | Move borders into `box-shadow: inset 0 0 0 1px` (which is clipped as well — use the rim-lighting inset pattern from `.liquid-rim` instead) OR wrap in the shadow-wrap idiom |
| SVG mask data-URI not byte-identical across machines | Byte-identity hook fails | SVG strings are committed as plain text literals in `squircles.css`. No generation step. Reproducible |
| Long SVG data-URI strings bloat the compiled CSS | `css/styles.css` size | With 5 mask variants at ~2 kB each uncompressed, total bloat ~10 kB. Tailwind `--minify` compresses to ~5 kB. Acceptable — the project is not bandwidth-constrained |
| `corner-shape: superellipse(2)` not supported in Safari/Firefox | 40% of users | The `mask-image` is the production default; `corner-shape` is only the PE layer. No breakage |
| Hero image + squircle = photo cropped to squircle | Hero illustration | The hero SVG illustration (not photo) is inside a squircle container. Test at Phase-level — if the SVG has transparent bleed, it may look wrong |

---

## (D) Liquid Glass Primitives — Class Strategy

### D.1 Class inventory (final list)

**Picked classes** (to be declared in `liquid-glass.css`):

| Class | Scope | Replaces / Upgrades |
|---|---|---|
| `.liquid-regular` | Base material (Apple "Regular" variant) — background, backdrop-filter, inset shadows | Existing `.card--glass`, ad-hoc `bg-white/50 backdrop-blur-md` patterns |
| `.liquid-rim` | Asymmetric rim lighting (top bright, bottom dim) — modifier, pairs with `.liquid-regular` | Existing `--shadow-glass-header` pattern |
| `.liquid-shimmer` | Optional hover shimmer pseudo-element sweep | New — not currently present |
| `.liquid-card` | Card surface (extends `.liquid-regular` with card-specific padding, border treatment) | Existing `.card--glass` — superseded |
| `.liquid-card-wrap` | Shadow-wrap outer wrapper — see C.3 | New — pattern for shadow + squircle composition |
| `.liquid-btn-primary` | Tinted gradient CTA with specular edge (keeps existing green→teal gradient) | Existing `.bg-gradient-to-r from-mu-cta-from to-mu-cta-to` → wrapped in semantic class |
| `.liquid-btn-secondary` | Regular glass secondary button | Existing secondary buttons using `bg-white/50 backdrop-blur-xl border-white/50` |
| `.liquid-btn-icon` | Circular glass icon button | Existing mobile-menu trigger, dark-mode toggle, phone-icon buttons |
| `.liquid-input` | Text input / textarea glass field | Existing form inputs with ad-hoc Tailwind bg+backdrop classes |
| `.liquid-select` | Select trigger (glass), option list stays native | Same pattern as input |
| `.liquid-badge` | Small glass chip | Existing `.bg-mu-green-50` badges etc. — reskinned |
| `.liquid-nav` | Nav bar style (applied inside `partials/header.html` to the `<header>` element) | Existing header classes |
| `.liquid-header` | Alias or alternative — to be decided at Phase time | — |
| `.liquid-sheet` | Mobile menu drawer material | Existing mobile menu ad-hoc classes |
| `.liquid-sticky-bar` | Sticky mobile bar capsule material | Existing sticky bar ad-hoc classes |
| `.liquid-alert` | Form success overlay | Existing `.form__success` pattern |
| `.liquid-grid` | OPTIONAL — page-level grid wrapper marker class | Only for CSS hook if needed; grid is a Tailwind-native utility chain |

**NOT declared:** `.liquid-clear`. FEATURES.md (B.2) identified Clear as anti-feature for the medical context. Omit it from the CSS entirely so no one can accidentally apply it.

### D.2 Class nesting — card inside regular panel

**Question:** if a `.liquid-card` sits inside a `.liquid-regular` panel (e.g. a pricing card inside the form container), do specular highlights stack, or reset?

**Answer:** they stack, and that's visually correct. Apple's iOS 26 Liquid Glass does the same — a card on a panel shows rim lighting for both surfaces, which reads as "two glass layers." The pseudo-elements don't conflict because each class declares its own `::before` and `::after`.

**Exception:** if nesting produces visible "double-rim" (two bright edges where one panel sits directly on another with no content between them), fix at Phase level by adding a `.liquid-card--on-panel { ::before { display: none; } }` modifier. This is a v4.0 P3 polish, not a foundational concern.

### D.3 Pseudo-element usage audit

**Concern from the orchestrator prompt:** "does `::before` / `::after` usage conflict with existing pseudo usage on those elements?"

**Audit:**
- `partials/header.html` — no `::before`/`::after` on the header element itself. Safe.
- `partials/footer.html` — no pseudo usage on top-level elements. Safe.
- `partials/sticky-bar.html` — no pseudo usage. Safe.
- `partials/mobile-menu.html` — no pseudo usage. Safe.
- Existing `.card--glass` class (if present in theme.css) — not declared in theme.css per grep; likely ad-hoc Tailwind classes. Safe.
- Form `.form__success` — likely positioned overlay with no pseudo. Safe.

**Conclusion:** the existing codebase does not use `::before`/`::after` on chrome elements or card elements. v4.0 can introduce pseudos freely. Flag as a PITFALL: if any future component declares a `::before` (e.g. a tooltip arrow), it must not also be `.liquid-regular` or the specular pseudo will collide.

### D.4 Migration of `.card--glass` — run parallel, then rename

**Strategy:**
- v4.0 does **not** rename `.card--glass` in place. Instead, declare `.liquid-card` as the new vocabulary and migrate HTML element-by-element during page migrations.
- During the Chrome and page phases, when a card is touched, swap `class="card--glass ..."` → `class="liquid-card squircle-lg liquid-rim ..."`.
- After all pages migrate, audit for residual `.card--glass` usage (grep) and either delete the class from wherever it's declared or declare it as an alias: `.card--glass { /* alias - migrate to .liquid-card */ }`.
- **Hard rule:** do not delete `.card--glass` in the same phase that adds `.liquid-card`. Run them in parallel until all HTML migrates.

**Why parallel:** reduces the blast radius of any single commit. A commit that adds `.liquid-card` doesn't touch the 6 pages at all. A commit that migrates `checkup.html` only touches that page and doesn't risk breaking other pages.

### D.5 Dark-mode re-enablement — where the recipe lives

**The v1.4 decision was to disable `backdrop-filter` in dark mode** (key decision in PROJECT.md line 221: "Dark mode disables backdrop-filter (glass-off)"). FEATURES.md section G.2 reverses this: v4.0 re-enables glass in dark mode with a tuned recipe (higher base opacity, dimmer rim, higher saturate).

**Location of the dark recipe:** in `theme.css` inside the `.dark` block (existing cascade entry point). The concrete block is shown in A.4. The `.liquid-regular`, `.liquid-card`, etc. classes reference `var(--liquid-bg)`, `var(--liquid-blur-md)`, etc., so they automatically inherit the dark values when `<html class="dark">` is active.

**PROJECT.md update required:** at v4.0 kickoff, log a new Key Decision reversing the v1.4 "glass-off" constraint. This is captured as a roadmap requirement.

**WCAG AA re-audit required:** FEATURES.md G.4 flags this. Glass recipes shift the effective background under text — contrast ratios must be re-measured. Add to the verification phase (G.6).

### D.6 `liquid-glass.css` — concrete file outline

```css
/*
 * src/styles/liquid-glass.css
 *
 * Apple Liquid Glass material recipes for MedicusUnion KZ v4.0.
 *
 * Two-variant Apple taxonomy: Regular only (Clear is anti-feature for medical).
 * Material recipes use CSS custom properties declared in theme.css so that
 * .dark cascade overrides pick up dark-mode tuning automatically.
 *
 * Companion: squircles.css (shape primitives).
 * Tokens declared in: theme.css :root and .dark cascade.
 */

/* === Base material === */
.liquid-regular {
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  border-top: 1px solid var(--liquid-border-top);
  border-bottom: 1px solid var(--liquid-border-bottom);
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom);
  /* Outer shadow lives on .liquid-card-wrap when squircle mask is applied */
}

/* === Rim lighting === */
.liquid-rim {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),     /* top bright */
    inset 0 -1px 0 rgba(0, 0, 0, 0.08),          /* bottom dim */
    inset 1px 0 0 rgba(255, 255, 255, 0.3),     /* left mid */
    inset -1px 0 0 rgba(0, 0, 0, 0.04);          /* right mid */
}

/* === Card (wraps material + padding + rim) === */
.liquid-card {
  /* extends .liquid-regular via class composition in HTML */
  padding: 1.5rem;
}
.liquid-card-wrap {
  box-shadow: var(--liquid-shadow-outer);
}

/* === Buttons === */
.liquid-btn-primary {
  background: linear-gradient(to right, var(--mu-cta-from), var(--mu-cta-to));
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  box-shadow:
    0 16px 32px rgba(26, 198, 126, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  transition: transform var(--dur-press) var(--ease-liquid),
              box-shadow var(--dur-press) var(--ease-liquid);
}
.liquid-btn-primary:hover {
  box-shadow:
    0 20px 40px rgba(26, 198, 126, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}
.liquid-btn-primary:active { transform: scale(0.97); }

.liquid-btn-secondary {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
  color: var(--mu-text-900);
  font-weight: 600;
  padding: 1rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  /* remainder... */
}

/* === Shimmer (DIFFERENTIATOR, hero CTA only) === */
.liquid-shimmer { position: relative; overflow: hidden; }
.liquid-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
  pointer-events: none;
}
.liquid-shimmer:hover::before { transform: translateX(100%); }

/* === Dark mode — handled by theme.css .dark cascade overriding --liquid-* tokens === */
/* No explicit [data-theme="dark"] selectors in this file. */

/* === Refraction (Chrome-only PE, gated by runtime JS probe) === */
html[data-refract="true"] .liquid-card,
html[data-refract="true"] .liquid-btn-primary {
  backdrop-filter: url(#liquid-refract) blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
  -webkit-backdrop-filter: url(#liquid-refract) blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate));
}

/* === Reduced-motion — inherited from theme.css @media guard === */
/* The existing @media (prefers-reduced-motion: reduce) rule in theme.css
   zeroes all animation-duration and transition-duration across the document.
   No additional rules needed here. */

/* === Additional downgrade for reduced-motion: simpler blur === */
@media (prefers-reduced-motion: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-btn-secondary {
    backdrop-filter: blur(8px);  /* reduced, not zero — still needs some translucency */
    -webkit-backdrop-filter: blur(8px);
  }
  .liquid-shimmer::before { display: none; }
}
```

**File size:** ~150 lines of CSS, ~8-12 kB source, ~4-6 kB minified.

### D.7 Risks (Liquid Glass primitives)

| Risk | Blast radius | Mitigation |
|---|---|---|
| Dark-mode glass recipe visually fails (the v1.4 "murky smear on navy") | All pages in dark mode | Phase-level visual validation on all 6 pages with `html.dark` before the verification phase ends. Have a fallback: if a surface looks bad, downgrade that specific surface to opaque in dark mode via `.dark .liquid-specific { backdrop-filter: none; background: solid; }` |
| Specular pseudo-element interferes with `.form__success` overlay | Form success state, 5 pages | Audit `.form__success` in an isolated Phase task before declaring pseudos on `.liquid-alert` |
| Perf drop on budget Android (FEATURES.md G — accepted trade-off) | Scroll performance on low-end devices | Accepted per v4.0 Key Decision. Measure post-ship, don't pre-optimize |
| Refraction SVG filter ID collision with existing SVG icon IDs | All pages | Namespace the filter ID: `id="liquid-refract"`, not `id="refract"`. Single-use ID |

---

## (E) Partials Strategy

### E.1 New partial: `partials/svg-defs.html`

**Why needed:** the Liquid Glass refraction layer (STACK.md section B, Layer 4) references an inline `<svg>` `<filter>` via `backdrop-filter: url(#liquid-refract)`. The filter must be present in the DOM of every page for the URL reference to resolve. Inline `<svg>` blocks are the safe cross-browser approach (external `.svg` files have a Safari bug — STACK.md Alternatives table).

**File contents:**

```html
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <filter id="liquid-refract">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4"/>
        <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <!-- Future: additional filter definitions for other liquid effects -->
    </defs>
  </svg>
```

**Splicer integration — one-line change in `scripts/build-pages.sh`:**

Line 19 becomes:
```sh
PARTIALS="header footer sticky-bar mobile-menu svg-defs"
```

That's the entire splicer change. The existing awk block at lines 214-237 already handles any partial name in `$PARTIALS` — no vocabulary change, no new tokens (`svg-defs.html` has no `{{...}}` placeholders), no new BUILD:vars keys.

**BUILD marker added to every page** (one edit per page, but can be scripted as a mass-add in a single foundation Phase task):

```html
<!-- BUILD:svg-defs -->
<!-- /BUILD:svg-defs -->
```

**Recommended placement:** directly after `<body>` opens and before `BUILD:header`, so the filter definitions are in the DOM before any element that references them. Example:

```html
<body class="...">
<!-- BUILD:vars ... -->

<!-- BUILD:svg-defs -->
<!-- /BUILD:svg-defs -->

<!-- BUILD:header -->
<!-- /BUILD:header -->
```

**Byte-identity hook compatibility:** the hook runs `make build` then `git diff --quiet '*.html'`. Adding a new partial that splices fresh content will cause a diff on first run — this is expected and is committed alongside the partial file itself. After that initial commit, the byte-identity invariant holds.

### E.2 Should `<head>` be extracted to a partial?

**Recommendation: NO for v4.0.** Reasoning:
- Each page has a **unique** `<head>`: title, meta description, Open Graph tags, canonical URL, Schema.org JSON-LD (index only), preload hints for per-page hero images. Extracting to a partial would require either:
  - A massive new BUILD:vars vocabulary (title, description, og_image, canonical, etc.) → doubles the token count, increases splicer complexity
  - A partial with per-page placeholder blocks → same problem, different syntax
- The current `<head>` drift is already well-managed (v3.0 SEO phase unified it). Adding partial complexity for little gain.
- **Single load-bearing shared piece in `<head>`:** the `<link rel="stylesheet" href="css/styles.css">` line. This is trivial to keep consistent without a partial.

**Deferred (v4.1+):** if a future page adds complex `<head>` consistency requirements (e.g. shared preload hints for Liquid Glass SVG filters), revisit. For v4.0, leave `<head>` per-page.

### E.3 Should hero sections be extracted to per-page hero partials?

**Recommendation: NO.** Heroes are per-page unique — content, illustration, messaging, CTA target, H1 wording. A hero partial would be a collection of 6 partials that each apply to one page, which is the same as not having a partial. Over-engineering.

**The page-level grid wrapper (B.3)** is the canonical way to share structural conventions across pages — not a partial. Every page uses the same `<main class="liquid-grid grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 ...">` skeleton directly.

### E.4 Should we add `partials/liquid-surfaces.html` containing reusable glass components?

**Recommendation: NO.** Apply glass vocabulary via CSS classes, not HTML fragments. A partial of "reusable glass card HTML" would:
- Duplicate markup across pages → fights DRY
- Force the splicer to handle multi-instance partial expansion (current splicer is one-per-page) → splicer rewrite
- Collide with the byte-identity hook (if a component appears N times, N expansions must match)

**The class layer handles reusability.** A contributor writing a new card writes `<article class="liquid-card squircle-lg liquid-rim">content</article>` and that's the pattern.

**Partials are for chrome**, not for content components. This is already the v3.2 convention and should not be relaxed.

### E.5 BUILD marker vocabulary changes — zero

The existing 11 tokens (CTA_HREF, CTA_LABEL, CURRENT_PAGE, LOGO_ARIA_CURRENT, NAV_HEADER_×4, NAV_MOBILE_×4) are sufficient for v4.0. No new tokens are needed because:
- `svg-defs.html` has no per-page variables
- Grid wrapping is page-level, not chrome
- Liquid Glass classes are applied inside existing partials (header, mobile-menu, sticky-bar, footer) without new substitutions — just class-list edits

**One new partial name** (`svg-defs`) is added to the `PARTIALS` shell variable. That's the entire splicer vocabulary extension.

### E.6 Byte-identity hook scaling

The hook runs `make build` then `git diff --quiet '*.html'`. Adding one new partial:
- **Build-time cost:** ~50 ms extra for the fifth splicer loop iteration. Negligible.
- **Diff-time cost:** zero (diff only looks at HTML output, not count of partials).
- **Determinism:** `svg-defs.html` is a static file with no tokens, so expanded output is byte-identical across machines.

**The hook scales trivially** to additional partials. Verified by reading `scripts/build-pages.sh` lines 185-241 (the per-partial loop is N-independent).

---

## (F) File Layout Proposal

### F.1 Complete file tree after v4.0

```
src/styles/
├── tailwind.css          (EXTENDED — import order updated to include new files)
├── theme.css             (EXTENDED — added squircle tokens, liquid glass tokens, motion tokens,
│                          grid max-width token, focus-visible refactor in @layer base,
│                          dark-mode cascade extended with liquid tokens)
├── squircles.css         (NEW — squircle mask data-URIs, radius scale utility classes,
│                          @supports corner-shape progressive enhancement,
│                          reduced-motion fallback inherited from theme.css)
├── liquid-glass.css      (NEW — Regular material recipe, rim lighting, shimmer pseudo,
│                          .liquid-card, .liquid-btn-primary, .liquid-btn-secondary,
│                          .liquid-btn-icon, .liquid-input, .liquid-badge, .liquid-nav,
│                          .liquid-sheet, .liquid-sticky-bar, .liquid-alert,
│                          @supports refraction PE block,
│                          @media reduced-motion blur downgrade)
├── fonts.css             (UNCHANGED — existing)
└── index.css             (UNCHANGED — reference-only file from Redesign prototype)

partials/
├── header.html           (EDITED — class-list updates to use .liquid-nav, squircle-full on logo,
│                          squircle-xl on header pill, squircle-md on phone button, etc.
│                          max-w-7xl → max-w-content)
├── footer.html           (EDITED — class-list updates for liquid treatment)
├── mobile-menu.html      (EDITED — class-list updates to use .liquid-sheet, squircle-xl, etc.)
├── sticky-bar.html       (EDITED — class-list updates to use .liquid-sticky-bar, squircle-full)
└── svg-defs.html         (NEW — <svg><defs><filter id="liquid-refract">...</filter></defs></svg>)

scripts/
├── build-pages.sh        (EDITED — PARTIALS="header footer sticky-bar mobile-menu svg-defs",
│                          one line change at line 19)
└── hooks/
    └── pre-commit        (UNCHANGED — byte-identity gate still works)

docs/
├── BUILD.md              (EDITED — add svg-defs to the partials table, add shadow-wrap note)
└── DESIGN-SYSTEM.md      (NEW — see H)

styleguide.html           (NEW, OPTIONAL — see H.3; may ship in v4.0 docs phase or defer to v4.1)

js/
├── main.js               (EDITED — add ~10 LOC data-refract capability probe on <html>)
├── animations.js         (UNCHANGED unless post-phase decision adds Motion spring hooks)
└── router.js             (UNCHANGED)

Makefile                  (EDITED — no target changes; PAGES list unchanged)

index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, 404.html
(EDITED — add <!-- BUILD:svg-defs --><!-- /BUILD:svg-defs --> marker block to each page,
 migrate <main> to liquid-grid wrapper, reskin hero/cards/form/CTA with liquid + squircle classes)
```

### F.2 What NOT to change

**Hard protection list** — downstream planner must not touch these without explicit user sign-off:

1. **`scripts/hooks/pre-commit`** — the byte-identity gate. Don't modify.
2. **`scripts/build-pages.sh` Step 1-3 logic (lines 59-169)** — BUILD:vars parsing and derived token computation. The only safe change is adding `svg-defs` to the `PARTIALS` variable at line 19.
3. **Vertical rhythm tokens in `theme.css`** (`--section-h-*`, `--min-height-section-hero-*`, `--spacing-section-*`) — these are v3.1 Phase 38 work. Don't touch. v4.0 grid foundation coexists with vertical rhythm, it doesn't replace it.
4. **WCAG AA accessible text tokens** (`--mu-blue-text`, `--mu-accent-*-text`, `--mu-green-text`, `--mu-cta-from`, `--mu-cta-to`) — v3.0 accessibility work. The focus-visible rule IS being refactored (C.4) but the contrast values are not.
5. **Honeypot spam protection** in forms — v3.0 LAYOUT work. Untouched.
6. **SEO metadata** (title, meta description, og tags, canonical) — v3.0 work. Untouched.
7. **Existing `:root` tokens** — only additions, never deletes. Tailwind utilities generated from them may still be in use.
8. **Makefile targets and `$(PAGES)` list** — no changes needed unless a new page is added.
9. **`partials/` file set of 4 existing chrome partials** — their *content* is edited (class-list updates), but they remain the canonical partials. A 5th partial (`svg-defs.html`) is added.
10. **POSIX-sh compatibility** — no bash-isms introduced in `build-pages.sh`. The existing `set -eu` + POSIX-only idiom is preserved.
11. **Byte-identity invariant** — after `make build`, the working tree must be clean. Every phase commits both partial changes and regenerated pages together.

### F.3 Why separate `squircles.css` and `liquid-glass.css` instead of one `v4.css` file

- **Separation of concerns:** squircles style the shape space (border-radius, mask-image). Liquid Glass styles the material space (background, backdrop-filter, shadow, border). Mixing them in one file reduces readability.
- **Independent evolution:** a future phase that tunes the squircle radius scale touches only `squircles.css`. A phase that re-tunes the dark-mode recipe touches only `theme.css` and/or `liquid-glass.css`. Smaller blast radius per edit.
- **File size:** both files minify to ~5-10 kB each. Combined would be ~15-20 kB. Tailwind's CLI concatenates everything into `css/styles.css` anyway, so browser-side file count is unchanged.

### F.4 Why NOT extend `index.css`

`index.css` is a reference-only file from the Redesign React prototype (see its header comment: "reference file (not used as build entry point)"). Adding v4.0 rules to it would be confusing — it's not imported into the build chain. Leave it alone.

---

## (G) Migration Order

### G.1 Phase sequence (goal-backward — end state: 6 pages speak v4.0)

```
Phase 1: Foundation tokens
  ├─ Extend theme.css with --squircle-* tokens + @theme inline bridge
  ├─ Extend theme.css with --liquid-* material tokens (light + dark)
  ├─ Extend theme.css with --ease-liquid*, --dur-* motion tokens
  ├─ Extend theme.css with --container-content grid token
  ├─ Extend theme.css dark cascade with v4.0 dark recipe tokens
  ├─ Refactor @layer base focus-visible: box-shadow → outline
  └─ GATE: make build passes, byte-identity hook passes, no visual change expected

Phase 2: Squircle primitives
  ├─ Create src/styles/squircles.css with mask data-URIs + utility classes
  ├─ Update src/styles/tailwind.css import order to include squircles.css
  ├─ Hand-author 5 SVG mask data-URIs (sm/md/lg/xl/full)
  ├─ Add @supports corner-shape PE block
  ├─ Smoke-test: apply .squircle-lg to a test div on a dev page, verify in Chrome + Safari
  └─ GATE: make build passes, Tailwind compiles, byte-identity hook passes, smoke-test passes visually

Phase 3: Liquid Glass primitives
  ├─ Create src/styles/liquid-glass.css with .liquid-regular, .liquid-rim, .liquid-card,
  │  .liquid-btn-primary/secondary/icon, .liquid-input, .liquid-badge, .liquid-nav,
  │  .liquid-sheet, .liquid-sticky-bar, .liquid-alert, .liquid-shimmer
  ├─ Update src/styles/tailwind.css import order to include liquid-glass.css
  ├─ Declare @supports refraction PE block (gated by html[data-refract] runtime probe)
  ├─ Declare reduced-motion blur downgrade
  ├─ Add ~10 LOC refraction capability probe to js/main.js (sets html[data-refract])
  ├─ Smoke-test: apply .liquid-card to a test div on a dev page, verify in Chrome + Safari + Firefox
  └─ GATE: make build passes, byte-identity hook passes, WCAG AA spot check on test div

Phase 4: SVG defs partial + chrome partials upgrade
  ├─ Create partials/svg-defs.html with <svg><defs><filter id="liquid-refract">...
  ├─ Add "svg-defs" to PARTIALS variable in scripts/build-pages.sh (line 19)
  ├─ Add <!-- BUILD:svg-defs --><!-- /BUILD:svg-defs --> marker block to each of 6 pages
  ├─ Upgrade partials/header.html — replace rounded-*, bg-white/*, backdrop-blur-* with
  │  .liquid-nav + squircle-xl + max-w-content
  ├─ Upgrade partials/footer.html
  ├─ Upgrade partials/mobile-menu.html — .liquid-sheet + squircle-xl + squircle-full on buttons
  ├─ Upgrade partials/sticky-bar.html — .liquid-sticky-bar + squircle-full
  ├─ Run make build — byte-identity hook will show drift (expected, first run)
  ├─ Commit partials + regenerated pages atomically
  └─ GATE: make build passes, byte-identity hook passes on second run (stable), visual review
          of header/footer/sticky-bar/mobile-menu on all 6 pages

Phase 5: Simple pages — 404.html + contacts.html
  ├─ 404.html: wrap content in <main class="liquid-grid">, apply .liquid-btn-primary to CTA,
  │  apply squircle-xl to 404 illustration container
  ├─ contacts.html: wrap content in <main class="liquid-grid">, apply .liquid-card to contact info card,
  │  apply .liquid-input to form fields, apply .liquid-btn-primary to submit, apply squircle-lg to card,
  │  squircle-md to inputs, squircle-full to submit button
  ├─ Run make build — only 2 pages touched
  ├─ Visual review on Chrome + Safari
  └─ GATE: pages render, forms submit, WCAG AA contrast spot-check on glass card

Phase 6: Service pages — checkup.html, online-consultations.html, treatment-abroad.html
  ├─ Can be parallelized (3 independent pages)
  ├─ Each page: wrap <main>, apply liquid-card to all cards, liquid-input to forms,
  │  liquid-btn-primary to CTAs, squircle-* per card/form/button
  ├─ Preserve hero SVG illustrations inside squircle-xl containers
  ├─ Preserve FAQ accordion behavior (no JS change)
  ├─ Preserve honeypot + form validation JS (no JS change)
  └─ GATE: all 3 pages render, forms work, WCAG AA spot-check

Phase 7: Index page
  ├─ Highest complexity — 13 sections, hero + 4 service cards + 3 clinic cards + 3 review cards +
  │  7 FAQ items + form
  ├─ Wrap <main> in liquid-grid
  ├─ Apply liquid-card to every card
  ├─ Apply liquid-input to form fields
  ├─ Apply liquid-btn-primary to CTAs, liquid-btn-secondary to "Подробнее"
  ├─ Apply squircle-lg to cards, squircle-xl to hero illustration, squircle-md to inputs,
  │  squircle-full to pill CTAs and avatars
  ├─ Apply .liquid-shimmer to hero primary CTA only (FEATURES.md cognitive load audit —
  │  differentiator effect limited to hero CTA)
  └─ GATE: full page renders, form submits, scroll performance spot-check on mid-tier Android

Phase 8: A11y + perf verification
  ├─ Keyboard tab through all 6 pages — verify outline focus ring visible on every interactive
  ├─ WCAG AA contrast audit on all 6 pages (light mode): run automated tool (axe-core or similar)
  ├─ WCAG AA contrast audit on all 6 pages (dark mode): same
  ├─ Verify @media (prefers-reduced-motion: reduce) zeroes transitions on test device
  ├─ Verify backdrop-filter blur downgrade to 8px in reduced-motion
  ├─ Scroll perf check on budget Android (30+ FPS target) — accepted degradation per v4.0 key decision
  ├─ Browser console silent on first load of all 6 pages (existing v3.2 baseline)
  └─ GATE: all checks pass or have documented accepted regressions

Phase 9: Docs — DESIGN-SYSTEM.md + optional styleguide.html
  ├─ Write docs/DESIGN-SYSTEM.md per outline in (H)
  ├─ Document shadow-wrap idiom, class inventory, token scale, migration guide for future contributors
  ├─ OPTIONAL: create styleguide.html with live examples of every primitive
  ├─ Update docs/BUILD.md to reference svg-defs partial and new CSS files
  └─ GATE: docs render, links valid, fresh contributor can find the primitives by reading alone
```

### G.2 Parallelizable phases

- **Phase 6 (service pages)** — checkup, online, treatment-abroad can be split across 3 parallel work streams if staffing allows. They share chrome (already done in Phase 4) and share primitives (already done in Phases 2-3), so there's no coupling between the three page migrations.
- **Phase 9 (docs)** — can run in parallel with Phase 8 if docs don't depend on verification results. The "what to document" is known at the end of Phase 7.
- **Everything else is sequential.** Foundations must land before primitives (classes reference tokens). Primitives must land before partials (classes are applied in HTML). Partials must land before simple pages (page grid wrappers live alongside already-upgraded chrome). Simple pages before service pages (practice before complex). Service pages before index (low-risk before high-risk).

### G.3 Dependency flow diagram

```
Foundation tokens (theme.css extensions)
   │
   ├─► Squircle primitives (squircles.css)
   │     │
   │     └─► Chrome partials upgrade (header, footer, mobile-menu, sticky-bar)
   │                                        │
   └─► Liquid Glass primitives              │
       (liquid-glass.css)                    │
          │                                  │
          ├─► SVG defs partial               │
          │   (new partial, splicer one-liner)│
          │                                  │
          └─► ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
                                              │
                                              ▼
                                   Simple pages (404, contacts)
                                              │
                                              ▼
                               Service pages (checkup, online, treatment-abroad)
                                              │          │          │
                                              └──────────┴──────────┘
                                                         │
                                                         ▼
                                                   Index page
                                                         │
                                                         ▼
                                             A11y + perf verification
                                                         │
                                                         ▼
                                      Docs (DESIGN-SYSTEM.md + optional styleguide.html)
```

### G.4 Cross-phase gates

| Gate | After phase | Criterion |
|---|---|---|
| **Build passes** | Every phase | `make build` exits 0 |
| **Byte-identity** | Every phase | `make check` exits 0 (rebuild produces no diff) |
| **Token smoke** | 1 | `css/styles.css` contains generated utilities for `--container-max-content`, `--radius-squircle-lg` |
| **Squircle smoke** | 2 | Test element with `.squircle-lg` visually looks squircle in Chrome + Safari |
| **Glass smoke** | 3 | Test element with `.liquid-card` produces visible blur in Chrome + Safari + Firefox |
| **Chrome visual** | 4 | Header, footer, mobile menu, sticky bar look v4.0 on all 6 pages |
| **Form functional** | 5-7 | Form submits successfully on every migrated page (Directus POST succeeds) |
| **WCAG AA** | 8 | axe-core reports zero contrast failures in light and dark mode |
| **Perf budget** | 8 | Scroll on budget Android stays ≥30 FPS (accepted degradation from v1.4 60 FPS) |
| **Docs findable** | 9 | A contributor finds the squircle class list, glass class list, and shadow-wrap idiom by reading docs/DESIGN-SYSTEM.md alone |

### G.5 Goal-backward sanity check

End state: all 6 pages render with v4.0 language. Working backward:
- That requires all 6 pages to reference `.liquid-*` + `.squircle-*` classes in HTML. → Phases 5-7 touch each page.
- That requires the classes to exist in compiled CSS. → Phases 2-3 create the CSS files.
- That requires chrome partials to be updated once so all 6 pages inherit the upgrades. → Phase 4 updates partials.
- That requires the tokens referenced by `.liquid-*` / `.squircle-*` to exist. → Phase 1 adds tokens.
- That requires the import order in `tailwind.css` to include the new files. → Phase 1-3 update import order.

**Every link in the chain has a single responsible phase**, and every phase has a clear gate. No cross-phase dependencies are unaccounted for.

---

## (H) Design System Documentation

### H.1 `docs/DESIGN-SYSTEM.md` outline

```markdown
# MedicusUnion KZ — Design System

**Version:** v4.0 Liquid Design System
**Last updated:** [date]

## 1. Introduction
- What this document covers (tokens, primitives, patterns, migration guide)
- Who it's for (contributors, reviewers, future maintainers)
- Related files (CLAUDE.md, docs/BUILD.md, .planning/PROJECT.md)

## 2. Design Principles
- Two-variant material taxonomy (Regular only, Clear is anti-feature for medical)
- Universal squircle replacement (no rounded rectangles)
- 12/8/2-3 responsive grid
- Light-first, dark-mode supported
- WCAG AA baseline (no exceptions)
- Perf budget relaxed for visual language, re-evaluated post-ship

## 3. Token Reference
### 3.1 Colors (unchanged from v3.0 WCAG AA set)
- Table of brand colors + accessible variants
### 3.2 Typography
- SF Pro system font stack
- Heading scale (existing clamp() tokens)
- Body size scale
### 3.3 Spacing (existing vertical rhythm tokens)
- `--section-h-hero-*`
- `--section-pt/pt-lg/pb`
### 3.4 Grid
- `--container-content: 1200px`
- 12/8/2-3 column counts
- Gutter values
### 3.5 Squircle
- `--squircle-sm/md/lg/xl/full` → values + use cases
### 3.6 Liquid Glass material
- `--liquid-bg`, `--liquid-blur-*`, `--liquid-saturate`, `--liquid-brightness`
- Dark-mode overrides
### 3.7 Motion
- `--ease-liquid`, `--ease-liquid-out`
- `--dur-press/hover/sheet/reveal`

## 4. Primitives Reference
### 4.1 Squircles
- `.squircle-sm / md / lg / xl / full` — when to use each
- How to apply: just add the class, alongside any Tailwind utilities
- Shadow-wrap idiom (critical section — see 5.1)
### 4.2 Liquid Glass classes
- `.liquid-regular` — base material
- `.liquid-rim` — edge lighting modifier
- `.liquid-card`, `.liquid-btn-primary`, `.liquid-btn-secondary`, `.liquid-btn-icon`
- `.liquid-input`, `.liquid-badge`, `.liquid-nav`, `.liquid-sheet`, `.liquid-sticky-bar`, `.liquid-alert`
- `.liquid-shimmer` — differentiator, use on hero CTA only
- For each: purpose, HTML example, screenshot (if styleguide.html exists)

## 5. Patterns and Conventions
### 5.1 Shadow-wrap idiom (critical — read first)
- Why mask-image clips shadows
- The two-element pattern with HTML example
- Which surfaces need it (cards, primary buttons, secondary buttons)
- Which surfaces don't (inputs, icons, badges)
### 5.2 Focus-visible: outline not box-shadow
- Why the project moved from `box-shadow` to `outline` in v4.0
- Tab-through expectation on interactive elements
- Contrast requirement
### 5.3 Grid composition
- `<main class="liquid-grid">` wrapper per page
- Section-level column spans
- Nested subgrid for card rows
- When to use grid-cols-3 for mobile (icon rows, stats, flags)
### 5.4 Russian typography rules
- nbsp bindings (subject+verb pairs)
- Responsive `<br class="md:hidden">` for hero headings
- 4-col minimum card width at tablet to prevent long-word breaks
### 5.5 Reduced-motion handling
- How prefers-reduced-motion guards zero transitions
- How the glass blur downgrade to 8px works
- What contributors should NOT do (don't declare durations outside token system)

## 6. Dark Mode
- How the .dark cascade works (CSS custom property overrides)
- The v4.0 reversal of v1.4's "glass-off" decision
- Dark-mode recipe rationale (higher opacity, higher brightness, lower saturate)
- Things to check when adding a new surface (contrast in both modes)

## 7. Migration Guide
- How to add a new page (reference BUILD.md for chrome setup)
- How to apply v4.0 classes to a new card/button/input
- What to NOT touch (the Protection List from F.2)

## 8. Anti-Patterns
- Don't use .liquid-clear (not declared, not allowed)
- Don't declare new material recipes outside liquid-glass.css
- Don't use box-shadow on focus rings
- Don't apply squircle-* to an element with outer box-shadow unless wrapped
- Don't introduce scroll-linked parallax
- Don't introduce JS-driven dynamic glass tint following pointer on every card (hero CTA only)

## 9. References
- .planning/research/STACK.md — technical decisions and alternatives rejected
- .planning/research/FEATURES.md — component inventory, recipes, per-page matrix
- .planning/research/ARCHITECTURE.md — this file (integration plan)
- .planning/PROJECT.md — milestone context and key decisions
- Apple Developer: Liquid Glass overview
```

### H.2 Token documentation format — tables, no screenshots in markdown

**Recommendation:** use markdown tables with value + use case + visual ASCII example where possible. Screenshots bloat the repo and go stale.

Example table format for squircle tokens:

```markdown
| Token | Value | Border-radius fallback | Primary use | Secondary use |
|---|---|---|---|---|
| `--squircle-sm` | 8px | 8px | Badges | Small chips |
| `--squircle-md` | 16px | 16px | Inputs, icon buttons | Secondary buttons |
| ... |
```

Visual preview lives in the optional `styleguide.html`. Markdown stays text-only for git-diffability.

### H.3 `styleguide.html` — optional but recommended

**Recommendation:** ship it. Here's the logic:

**Pro:** A single page at `styleguide.html` (or `docs/styleguide.html`) that renders every primitive in light and dark mode with HTML snippets visible is dramatically more useful than markdown alone for visual designers and for validating the token scale. A contributor can visually diff "did I break a primitive" by comparing styleguide.html before and after.

**Con:** It's a 7th HTML page, which means:
- It participates in the partials system (adds header/footer/mobile-menu/sticky-bar via BUILD markers) — this is how the v3.2 "7th-page 0-edit invariant" is demonstrated, and is actually a *benefit* (the styleguide proves the invariant works).
- Byte-identity hook runs on it.
- It adds ~1 kB to the build time.

**Verdict:** the benefits outweigh the costs. It's a low-cost contributor aid that also validates the 7th-page invariant. Ship it in Phase 9.

**`styleguide.html` outline:**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <title>Styleguide — MedicusUnion KZ v4.0</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<!-- BUILD:vars CTA_HREF=#grid CTA_LABEL="К сетке" CURRENT_PAGE=contacts -->
<!-- BUILD:svg-defs --><!-- /BUILD:svg-defs -->
<!-- BUILD:header --><!-- /BUILD:header -->
<!-- BUILD:mobile-menu --><!-- /BUILD:mobile-menu -->

<main class="liquid-grid grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-content mx-auto px-4 md:px-6 lg:px-8 py-16">

  <section id="grid" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>12/8/2-3 grid</h2>
    <!-- visual column ruler — 12 colored divs showing columns -->
  </section>

  <section id="squircles" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Squircles</h2>
    <!-- 5 example boxes: sm, md, lg, xl, full, each with its label and value -->
  </section>

  <section id="liquid-glass" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Liquid Glass materials</h2>
    <!-- .liquid-regular card, .liquid-rim, .liquid-card, .liquid-btn-primary, etc. -->
  </section>

  <section id="buttons" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Buttons</h2>
    <!-- primary, secondary, icon, disabled states -->
  </section>

  <section id="form" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Form</h2>
    <!-- example form with liquid-input, liquid-select, liquid-btn-primary -->
  </section>

  <section id="motion" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Motion</h2>
    <!-- buttons that hover-lift / press-scale, documenting the token names -->
  </section>

  <section id="dark-mode" class="col-span-2 md:col-span-8 lg:col-span-12">
    <h2>Dark Mode</h2>
    <!-- preview with forced .dark class on a wrapper, showing same surfaces in dark -->
  </section>

</main>

<!-- BUILD:footer --><!-- /BUILD:footer -->
<!-- BUILD:sticky-bar --><!-- /BUILD:sticky-bar -->
<script defer src="js/main.js"></script>
</body>
</html>
```

**Add to Makefile `PAGES` list:** `PAGES := ... styleguide.html` so the splicer processes it.

### H.4 Contributor onboarding flow (what a new dev reads)

1. `CLAUDE.md` — stack overview, constraints, conventions
2. `docs/BUILD.md` — how to build, partial system, byte-identity hook
3. `docs/DESIGN-SYSTEM.md` — v4.0 tokens + primitives + patterns + anti-patterns
4. `styleguide.html` (live, in the browser) — visual reference for every primitive
5. `.planning/PROJECT.md` — milestone history and key decisions

This reading order gets a new contributor productive in under 30 minutes. Document this explicitly at the top of `DESIGN-SYSTEM.md` as the "Read these in order" list.

---

## (I) Byte-Identity Hook Compatibility

### I.1 New CSS files — reproducible compilation

**Check:** do new CSS files compile into the same `css/styles.css` across contributor machines?

- **Tailwind CLI standalone binary** is pinned at v4.2.2 via `make install-tailwind` (see docs/BUILD.md "Quick start"). The binary is byte-identical across machines (same SHA256 download).
- **Input files** (`squircles.css`, `liquid-glass.css`, `theme.css`) are plain text committed to git. Byte-identical across machines.
- **Tailwind's compilation algorithm** is deterministic given the same input + same binary version. No environment-dependent source resolution.
- **The `--minify` flag** in `make build` runs a deterministic minifier (Lightning CSS under the hood in Tailwind v4). Also deterministic.

**Conclusion:** ✅ Reproducible. Two contributors running `make build` on the same commit produce identical `css/styles.css`.

### I.2 New partials — splicer handles them reproducibly

- `svg-defs.html` is a static file with no `{{...}}` token substitutions.
- The splicer's awk block (lines 214-237) is a deterministic line-based substitution.
- Spliced output depends only on (input HTML, partial file, BUILD:vars tokens). All reproducible.

**Conclusion:** ✅ Reproducible.

### I.3 SVG data-URIs — byte-identical across machines

**Check:** are SVG mask data-URIs reproducible?

- They are **hand-authored** as literal strings in `squircles.css` — not generated at build time. No generator, no drift.
- The `url("data:image/svg+xml;utf8,<svg ...>")` format is well-defined; spaces are literal, not URL-encoded. Byte-identical.
- **Caveat:** if a contributor edits the SVG path coordinates, the data-URI changes. This is a **feature** — changes are explicit and reviewed. Git diffs will show the full data-URI on any edit, which is loud but correct.

**Conclusion:** ✅ Reproducible.

### I.4 Tailwind v4 `@theme inline` order sensitivity

**Check:** does token order in `@theme inline` matter for Tailwind v4's output?

**From Tailwind v4 docs (via STACK.md verification):** within `@theme inline`, tokens are resolved at generation time in the order they are declared. For **forward references** between tokens, order matters:

```css
@theme inline {
  --color-foo: red;
  --color-bar: var(--color-foo);  /* works — --color-foo is already resolved */
}
```

```css
@theme inline {
  --color-bar: var(--color-foo);  /* BROKEN — --color-foo not yet declared */
  --color-foo: red;
}
```

**For v4.0 additions:** none of the new tokens forward-reference other new tokens. `--container-max-content` references `--container-content` declared in `:root` before `@theme inline` starts (safe). `--radius-squircle-lg` references `--squircle-lg` similarly.

**Safe pattern for v4.0:**
1. Declare all raw values in `:root` (no cross-references in :root either, or carefully ordered if needed).
2. In `@theme inline`, bridge `:root` values to Tailwind-namespaced tokens. Since `:root` is fully parsed before `@theme inline` runs, the order within `@theme inline` doesn't matter for these references.

**Conclusion:** ✅ Order-independent for the pattern we use. No risk.

### I.5 Pre-commit hook stress test (conceptual)

The hook runs:
1. `make build` → compiles Tailwind, runs splicer on 6 (or 7 if styleguide ships) pages
2. `git diff --quiet '*.html'` → asserts no HTML drift

For v4.0:
- Tailwind compile time: ~1-2 seconds (existing)
- Splicer time: ~200ms for 5 partials × 6 pages = 30 iterations. Current time is ~150ms for 4 × 6; adding one partial adds ~40ms. Total hook overhead: ~2 seconds. Acceptable for a commit.
- `git diff --quiet` is O(tracked file size). Unchanged.

**The hook does not need modification.** It handles arbitrarily many partials because the `PARTIALS` variable in the splicer is a POSIX-sh word list and the hook just invokes the splicer via `make build`.

---

## (J) JS Layer

### J.1 Changes required

**Minimum:** add ~10 LOC to `js/main.js` for the refraction capability probe. That's it.

```js
// In js/main.js IIFE
(function () {
  // Liquid Glass refraction probe — sets data-refract on <html>
  // if the browser supports backdrop-filter: url(#svg-filter).
  // Safari and Firefox currently do NOT; only Chromium does.
  var supportsRefraction = false;
  if (window.CSS && window.CSS.supports) {
    // Belt-and-braces: check both the CSS support AND UA (Safari returns true
    // for CSS.supports but the filter doesn't actually render).
    var cssOK = CSS.supports('backdrop-filter', 'url(#test)');
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    supportsRefraction = cssOK && !isSafari && !isFirefox;
  }
  if (supportsRefraction) {
    document.documentElement.setAttribute('data-refract', 'true');
  }
})();
```

**Placement:** inside the existing IIFE pattern in `js/main.js`. Runs once on load, sets the attribute before CSS paint.

### J.2 Changes NOT required

- **`dark-mode.js`** (if it exists as a separate file, otherwise inside `main.js`): the v4.0 dark-mode recipe lives in `theme.css` cascade. The existing JS toggle just flips the class on `<html>`. No JS change.
- **`animations.js`**: the existing Motion CDN usage is preserved. Optional upgrade: add scroll-linked blur progression on header using `Motion.scroll()`. This is a Phase 8 enhancement if desired — not required for v4.0 to ship.
- **Scroll-linked blur on header**: FEATURES.md suggested this. The existing header already uses a static `backdrop-blur-[40px]`. Making it dynamic requires Motion's `scroll()` API, ~15 LOC. **Recommendation: defer to v4.1.** The static blur is sufficient for v4.0's visual goals, and adding a scroll listener adds cognitive load for contributors.
- **Mouse-follow specular**: FEATURES.md (C.3) described as DIFFERENTIATOR. Recommendation: **skip for v4.0** per cognitive load audit (H.4 of FEATURES.md). Can ship in v4.1 if post-release user testing requests it.
- **IntersectionObserver + scroll-reveal**: existing pattern from v1.4 continues to work. No change.

### J.3 Minimum change principle — honored

v4.0 adds **exactly 10-15 lines of vanilla JS** (the refraction probe) and touches **exactly one file** (`js/main.js`). No new JS files. No Motion API changes. No new event listeners beyond the single `DOMContentLoaded` that already exists.

---

## Risk Summary — Top 5 for Downstream Planner

Collected from all sections, ranked by blast radius × likelihood.

| Rank | Risk | Section | Mitigation |
|---|---|---|---|
| 1 | Mask-image clips focus ring, borders, and outer shadows — existing interactive elements visually break if migration skips focus-visible refactor | C.4, C.7 | Foundation phase (1) MUST include the focus-visible refactor before squircles land. Gate: verify tab-through on a test page after phase 1 |
| 2 | Dark-mode glass recipe may produce the same "murky smear on navy" as v1.4 despite tuning | D.7, A.4 | Phase 8 verification includes visual review of all 6 pages in dark mode. Have a documented fallback: if a specific surface looks bad, downgrade it with `.dark .liquid-specific { backdrop-filter: none; }` on a per-surface basis |
| 3 | Byte-identity hook drift during Phase 4 (first chrome partial upgrade) — contributors may miss that `make build` needs to be run twice (once for partial expansion, once to verify stability) | E.6, I.5 | Document in DESIGN-SYSTEM.md migration guide. Phase 4 commit message should explicitly say "partial upgraded + regenerated pages committed atomically" |
| 4 | Budget Android scroll perf drops below 30 FPS on index.html with 10+ glass surfaces in the hero viewport | D.7 | Accepted per v4.0 Key Decision (PROJECT.md line 243). If measurement exceeds threshold post-ship, open v4.x milestone for graceful degradation |
| 5 | `corner-shape: superellipse(2)` may render differently from the mask-image SVG path in a visually noticeable way — Chrome users see one shape, Safari users see another | STACK.md section A | Phase 2 smoke test must visually compare the same element in both browsers. If mismatch is noticeable, tune SVG path coefficients to match `corner-shape(2)` output |

---

## Integration Map (downstream consumer digest)

| Asset | Lives in | Phase | Consumed by | Modifies existing? |
|---|---|---|---|---|
| `--squircle-*` tokens (raw) | `theme.css :root` (NEW block) | 1 | `squircles.css` classes | No — addition |
| `--radius-squircle-*` bridge | `theme.css @theme inline` (NEW entries) | 1 | Tailwind `rounded-squircle-*` utilities | No — addition |
| `--liquid-*` material tokens | `theme.css :root` (NEW block) + `theme.css .dark` (NEW extension) | 1 | `liquid-glass.css` classes | No — addition |
| `--ease-liquid*` / `--dur-*` motion tokens | `theme.css :root` (NEW block) + reduced-motion override | 1 | `liquid-glass.css` transitions | No — addition |
| `--container-content` grid token | `theme.css :root` + `@theme inline` | 1 | `max-w-content` utility in pages | No — addition |
| Focus-visible refactor | `theme.css @layer base` (EDIT lines 252-261) | 1 | All interactive elements | YES — refactor, same visual intent |
| Squircle mask data-URIs | `squircles.css :root` (NEW file) | 2 | `.squircle-*` class rules | No — new file |
| `.squircle-*` classes | `squircles.css` (NEW file) | 2 | HTML class attributes in phases 4-7 | No — new file |
| `@supports corner-shape` PE block | `squircles.css` (NEW file) | 2 | `.squircle-*` classes | No — new file |
| `.liquid-*` classes (14 total) | `liquid-glass.css` (NEW file) | 3 | HTML class attributes in phases 4-7 | No — new file |
| `@supports` refraction block | `liquid-glass.css` (NEW file) | 3 | `html[data-refract]` gated | No — new file |
| Reduced-motion blur downgrade | `liquid-glass.css` (NEW file) | 3 | All glass classes | No — new file |
| Refraction JS probe | `js/main.js` (EDIT, +10 LOC) | 3 | `<html data-refract>` | YES — additive |
| `svg-defs.html` partial | `partials/svg-defs.html` (NEW) | 4 | Referenced by `backdrop-filter: url(#liquid-refract)` | No — new file |
| `PARTIALS` var extension | `scripts/build-pages.sh` line 19 (EDIT) | 4 | Splicer loop | YES — one word added |
| `BUILD:svg-defs` marker blocks | All 6 (or 7 with styleguide) pages (EDIT) | 4 | Splicer | YES — additive |
| Chrome partials class-list updates | `partials/{header,footer,mobile-menu,sticky-bar}.html` (EDIT) | 4 | All 6 pages via splicer | YES — class lists edited |
| `<main class="liquid-grid">` wrapper | Each of 6 pages (EDIT) | 5-7 | Page content | YES — structural |
| Page content migration to `.liquid-*` + `.squircle-*` | Each of 6 pages (EDIT) | 5-7 | Individual cards, buttons, inputs | YES — class swaps |
| `docs/DESIGN-SYSTEM.md` | `docs/DESIGN-SYSTEM.md` (NEW) | 9 | Contributors | No — new file |
| `styleguide.html` (optional) | `styleguide.html` (NEW at repo root) | 9 | Contributors, visual QA | No — new file |
| `docs/BUILD.md` updates | `docs/BUILD.md` (EDIT — add svg-defs partial to the table, add pointer to DESIGN-SYSTEM.md) | 9 | Contributors | YES — additive |

---

## Sources

Direct reads (primary):
- `.planning/PROJECT.md` — project state, constraints, v4.0 kickoff decisions, key decisions log (PROJECT.md r1)
- `.planning/research/STACK.md` — technical feasibility of squircle/liquid glass/grid, library choices, zero-Node audit, integration map (STACK.md r2, r5)
- `.planning/research/FEATURES.md` — component inventory, material taxonomy, per-page matrix, dependency map, critical recipes (FEATURES.md r3, r4)
- `CLAUDE.md` — project CLAUDE profile (in context)
- `src/styles/theme.css` — existing token layout, @theme inline structure, @layer base rules (r6)
- `src/styles/tailwind.css` — import order and entry point structure (r7)
- `src/styles/index.css` — confirms it's a reference-only file, not in build chain (r7)
- `scripts/build-pages.sh` — splicer behavior, PARTIALS list, awk loop (r8)
- `partials/header.html` — current chrome HTML structure and class usage (r9)
- `partials/mobile-menu.html` — mobile drawer structure (r15)
- `partials/sticky-bar.html` — sticky bar structure (r14)
- `docs/BUILD.md` — byte-identity hook behavior, per-page BUILD:vars vocabulary, 7th-page invariant (r10)

Indirect references (cited from the above primary reads):
- STACK.md's sources — Apple developer docs, MDN corner-shape, LogRocket Liquid Glass CSS, kube.io displacement map analysis, Chrome Platform Status, Tailwind v4 release notes
- FEATURES.md's sources — Apple Newsroom Liquid Glass announcement, CSS-Tricks getting clarity, conorluddy/LiquidGlassReference, Smashing Magazine corner-shape guide

**Confidence:** HIGH on integration points (derived from direct file reads and verified research), MEDIUM on class-naming convention (defensible pick, alternatives exist), HIGH on migration order (constrained by hard dependencies), HIGH on byte-identity compatibility (verified by reading `scripts/build-pages.sh` and `docs/BUILD.md`).

---

*Architecture research for: v4.0 Liquid Design System integration into existing MedicusUnion KZ stack*
*Researched: 2026-04-09*
