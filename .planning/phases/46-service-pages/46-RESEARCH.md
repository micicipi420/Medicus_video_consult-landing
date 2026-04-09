# Phase 46: Service Pages - Research

**Researched:** 2026-04-09
**Domain:** HTML migration -- liquid glass + squircle + 12-col grid on 3 service pages
**Confidence:** HIGH

## Summary

Phase 46 migrates the three service pages (checkup.html, online-consultations.html, treatment-abroad.html) from v3.x glass styling (manual `bg-white/60 backdrop-blur-2xl rounded-[Xrem] border border-white/60 shadow-glass`) to v4.0 Liquid Design System classes (`liquid-card`, `liquid-card-wrap`, `liquid-regular`, `squircle-*`, `liquid-btn-primary`, 12-col grid wrappers). This is the same migration pattern proven in Phase 45 on 404.html and contacts.html, now applied at moderate-to-high complexity across 12 sections per page.

All three pages share identical structural patterns: hero with 2-col grid, feature/benefit card grids, FAQ accordion sections, form sections with 2-col layout, and cross-sell CTA cards. The key differences are content-specific sections -- checkup has stats bar + 14 program cards + B2B section; online-consultations has doctor country cards + specialization badges + pricing card; treatment-abroad has stats bar + 8 clinic country cards + 4 step cards + review cards.

**Primary recommendation:** Create one plan per page. Each page is independent (no file overlap) and can execute in parallel. Follow the exact migration map from Phase 45 contacts.html -- the mapping table from 45-02-SUMMARY.md is the canonical reference for which old class pattern maps to which new class.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- checkup.html: Grid + squircle on program/stats/B2B/form cards + liquid surfaces; whitespace-nowrap "za 1-2 dnya" MUST be preserved (Protected Legacy); nbsp bindings MUST be preserved
- online-consultations.html: Grid + squircle on doctor/pricing/trigger cards + liquid surfaces
- treatment-abroad.html: Grid + squircle on clinic/step/review cards + liquid surfaces
- Migration Pattern: max-w-[1200px] grid wrappers (NOT max-w-content), 12-col responsive grid, liquid-card-wrap + shadow-wrap for cards, liquid-regular for surfaces without outer shadows, liquid-btn-primary squircle-md for CTA buttons, squircle-md replacing rounded-* on form inputs (keep existing bg/blur), Chrome already upgraded via Phase 44

### Claude's Discretion
- Exact column spans per section
- Which card elements get shadow-wrap vs. inline glass
- Stats bar treatment (grouped .stats-glass or individual cards)
- Step/process cards: numbered sequence layout approach

### Deferred Ideas (OUT OF SCOPE)
None -- all 3 pages fully in scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIGRATE-03 | checkup.html -- grid + squircle on program/stats/B2B/form cards + liquid surfaces; whitespace-nowrap preserved, nbsp preserved | Section inventory: 12 sections, ~46 rounded-[ elements, 380 nbsp entities, 1 whitespace-nowrap span, 36 CTA gradient instances, 4 form inputs, 19 rounded-2xl elements to replace |
| MIGRATE-04 | online-consultations.html -- grid + squircle on doctor/pricing/trigger cards + liquid surfaces | Section inventory: 12 sections, ~26 rounded-[ elements, 203 nbsp entities, 5 CTA gradient instances, 34 rounded-2xl elements (includes 7 country flag cards), 14 specialization badges |
| MIGRATE-05 | treatment-abroad.html -- grid + squircle on clinic/step/review cards + liquid surfaces | Section inventory: 11 sections, ~40 rounded-[ elements, 291 nbsp entities, 3 CTA gradient instances, 23 rounded-2xl elements, 8 clinic country cards, 4 step cards, 4 review cards |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Stack: HTML + Tailwind CSS v4 + JS -- Tailwind CLI standalone binary for CSS build
- Design: Mobile-first, target audience 45+, large fonts, high contrast
- Language: Russian only
- Animations: Motion standalone CDN
- No Alpine.js, jQuery, or SPA frameworks
- CSS: No Bootstrap, Sass, PostCSS pipeline -- Tailwind CLI handles everything
- `make build` rebuilds CSS after edits
- Pre-commit hook enforces byte-identity

## Architecture Patterns

### Section Inventory: checkup.html (MIGRATE-03)

12 sections in `<main>`:

| # | Section ID | Type | Card Count | Current Classes (to replace) |
|---|-----------|------|------------|------------------------------|
| 1 | hero-checkup | Hero 2-col + image | 1 badge, 2 CTA buttons, 1 image frame | `container mx-auto px-4 lg:px-6`, `rounded-full` badge, `rounded-3xl` buttons, `rounded-[3rem]` image |
| 2 | stats (aria-label) | Stats bar 2x2/4-col | 4 stat cards | `container mx-auto`, `rounded-[2.5rem]` cards with `bg-white/60 backdrop-blur-2xl border border-glass-border shadow-glass` |
| 3 | why-checkup | 3-col card grid | 3 cards + 3 icon boxes | `container mx-auto`, `rounded-[2.5rem]` cards, `rounded-2xl` icon boxes |
| 4 | why-abroad | 2x2 card grid | 4 cards + 4 icon boxes | Same pattern as #3 |
| 5 | why-us | 5-card grid | 5 cards (text-only) | Same pattern as #3 |
| 6 | programs-korea | 3-col program cards | 14 program cards + badges | `rounded-[3rem]` cards, `rounded-full` badges, 2 highlighted cards with `border-mu-blue/40` |
| 7 | programs-turkey | 3-col program cards + info block | 4 program cards + 1 info card | Same as #6 + `rounded-[2.5rem]` info card |
| 8 | how-it-works | 5-col steps | 5 step cards | `rounded-[2.5rem]` cards |
| 9 | b2b | 2-col + full-width card + CTA | 2 cards + 1 info card + 1 CTA button | `rounded-[2.5rem]` cards, `rounded-3xl` button |
| 10 | faq-checkup | FAQ accordion | 7 FAQ items | `rounded-2xl` items with `bg-white/60 backdrop-blur-2xl border border-glass-border shadow-glass-sm` |
| 11 | form-checkup | 2-col form | 1 form container + 4 inputs + 1 submit button | `rounded-[3rem]` container, `rounded-2xl` inputs/button |
| 12 | final-cta-checkup | Cross-sell CTA | 1 CTA card + 2 buttons | `rounded-[3.5rem]` card, `rounded-3xl` buttons |

### Section Inventory: online-consultations.html (MIGRATE-04)

12 sections in `<main>`:

| # | Section ID | Type | Card Count | Current Classes (to replace) |
|---|-----------|------|------------|------------------------------|
| 1 | hero | Hero 2-col + image | 1 badge, 2 CTA buttons, 1 image frame, 3 trust items | `container mx-auto`, `rounded-full` badge, `rounded-3xl` buttons, `rounded-[3rem]` image |
| 2 | features | 3x2 feature cards | 6 cards + 6 icon boxes | `container mx-auto`, `rounded-[2.5rem]` cards, `rounded-2xl` icon boxes |
| 3 | problem | Single content card | 1 large card | `rounded-[2.5rem]` card |
| 4 | benefits | 2x2 benefit cards | 4 cards + 4 icon boxes | Same as features |
| 5 | process | 3 step cards | 3 numbered cards | `rounded-[2.5rem]` cards |
| 6 | doctors | Country cards + spec badges + info card | 7 country cards + 14 spec badges + 1 info card + 1 spec container | `rounded-2xl` country cards, `rounded-full` badges, `rounded-[2.5rem]` info card, `rounded-[3rem]` spec container |
| 7 | why-medicusunion | 5-card grid (2-col layout each) | 5 cards + 5 icon boxes | `rounded-[2.5rem]` cards, `rounded-2xl` icon boxes |
| 8 | triggers | Single content card with checklist | 1 card + 5 check circles | `rounded-[2.5rem]` card, `rounded-full` circles |
| 9 | pricing | Pricing card | 1 card + 1 badge + 1 CTA button | `rounded-[3rem]` card, `rounded-full` badge, `rounded-2xl` button |
| 10 | consultation-form | 2-col form + trust badges | 1 form container + 4 inputs + 1 submit + 2 badges | `rounded-[3rem]` container, `rounded-2xl` inputs/button, `rounded-full` badges |
| 11 | faq | FAQ accordion | 6 FAQ items | `rounded-2xl` items |
| 12 | final-cta | Cross-sell CTA | 1 CTA card + 1 button | `rounded-[3.5rem]` card, `rounded-3xl` button |

### Section Inventory: treatment-abroad.html (MIGRATE-05)

11 sections in `<main>`:

| # | Section ID | Type | Card Count | Current Classes (to replace) |
|---|-----------|------|------------|------------------------------|
| 1 | hero-abroad | Hero 2-col + image | 1 badge, 2 CTA buttons, 1 image frame, 2 trust items | `container mx-auto`, `rounded-full` badge, `rounded-3xl` buttons, `rounded-[3rem]` image |
| 2 | (stats, aria-label) | Stats bar 2x2/4-col | 4 stat cards | `container mx-auto`, `rounded-[2rem]` cards |
| 3 | about-us | 2x2 card grid | 4 cards + 4 icon boxes | `rounded-[2.5rem]` cards, `rounded-2xl` icon boxes |
| 4 | platform | CTA content card + checklist | 1 large card + 5 check circles | `rounded-[3.5rem]` card, `rounded-full` circles |
| 5 | clinics | Country grid (2x4/4x2) | 8 country cards with flag images | `rounded-[2rem]` cards |
| 6 | included | 3x2 benefit cards | 6 cards + 6 icon boxes | `rounded-[2.5rem]` cards, `rounded-2xl` icon boxes |
| 7 | steps | 4-col step cards | 4 step cards + badges + sublists | `rounded-[2.5rem]` cards, `rounded-full` timing badges |
| 8 | reviews | 2x2 review cards | 4 review cards with avatar circles | `rounded-[2.5rem]` cards, `rounded-full` avatars |
| 9 | faq-abroad | FAQ accordion | 8 FAQ items | `rounded-2xl` items |
| 10 | form-abroad | 2-col form | 1 form container + 4 inputs + 1 submit | `rounded-[3rem]` container, `rounded-2xl` inputs/button |
| 11 | (cross-sell) | Cross-sell CTA | 1 CTA card + 1 button | `rounded-[3.5rem]` card, `rounded-3xl` button |

### Migration Map (from Phase 45 -- CANONICAL)

[VERIFIED: Phase 45-02-SUMMARY.md contacts.html migration]

| Element Type | Old Pattern | New Pattern |
|-------------|------------|-------------|
| Section wrapper | `container mx-auto px-4 lg:px-6` | `max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8` |
| Grid layout | `grid lg:grid-cols-2 gap-12` | `grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-8 lg:gap-12` |
| Hero badge | `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm shadow-glass-inner` | `liquid-regular squircle-full` |
| Large card surface | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass` | `liquid-card-wrap` > `liquid-card squircle-xl p-8` |
| Medium card surface | `bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass` | `liquid-card-wrap` > `liquid-card squircle-lg p-6` |
| Icon box | `bg-white/50 backdrop-blur-xl rounded-2xl ... border border-white/60` | `liquid-regular squircle-md` |
| Trust badge (pill) | `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm shadow-glass-inner` | `liquid-regular squircle-full` |
| Form container | `bg-white/70 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/60 ... shadow-glass-lg` | `liquid-card-wrap` > `liquid-card squircle-xl p-8 overflow-hidden` |
| Form input | `rounded-2xl` (keep bg/blur) | `squircle-md` (keep bg/blur) |
| Submit button | `bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white rounded-2xl shadow-lg shadow-mu-blue/30 hover:shadow-xl hover:shadow-mu-blue/40 transition-all` | `liquid-btn-primary squircle-md` |
| Primary CTA link | `bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white ... rounded-3xl font-semibold shadow-lg shadow-mu-blue/30` | `liquid-btn-primary squircle-md` |
| Secondary CTA link | `bg-white/50 backdrop-blur-xl text-mu-text-900 ... rounded-3xl font-semibold shadow-glass ... border border-white/60` | `liquid-btn-secondary squircle-md` |
| FAQ item | `bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-glass-sm` | `liquid-card-wrap` > `liquid-card squircle-md` (small surface, no outer shadow needed -- can use `liquid-regular squircle-md` instead) |
| CTA card (full-width) | `bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-12 ... border border-white/60 shadow-glass-lg` | `liquid-card-wrap` > `liquid-card squircle-xl p-12` |
| Avatar circle | `rounded-full` | `squircle-full` |
| Flag image circle | `rounded-full` | `squircle-full` |
| Image frame | `rounded-[3rem] overflow-hidden shadow-glass-lg border-[8px] border-white/40 bg-white/20` | `squircle-xl overflow-hidden` in `liquid-card-wrap` (or keep as decorative -- discretion) |

### Grid Column Span Recommendations

[ASSUMED -- based on Phase 45 contacts.html pattern and content density]

| Section Type | md (8-col) | lg (12-col) | Rationale |
|-------------|-----------|------------|-----------|
| Form sections (2-col) | 4 + 4 | 5 + 7 | Form needs more horizontal space (matches contacts.html) |
| Hero (2-col) | 8 (stack) | 6 + 6 | Equal split, hero image gets half |
| Stats bar | 4 + 4 (2x2) | 3+3+3+3 | 4 equal columns |
| Feature 3-col | 4+4 | 4+4+4 | Equal thirds |
| Feature 2-col | 4+4 | 6+6 | Equal halves |
| Country cards 4-col | 2+2+2+2 | 3+3+3+3 | Equal quarters |
| Step cards 4-col | 4+4 (2x2) | 3+3+3+3 | Equal quarters |
| Program cards 3-col | 4+4 | 4+4+4 | Equal thirds (handles pricing well) |

### Stats Bar Treatment Decision

[ASSUMED -- recommendation for Claude's discretion area]

DIFF-02 requires "grouped glass backdrop" for stats bar on index + checkup. The `.stats-glass` class is already available in liquid-glass.css with `--liquid-blur-lg (40px)`. **Recommendation:** Wrap the 4 stat cards in a single `.stats-glass squircle-xl` container, with the individual stat cards becoming transparent grid cells inside it (remove their individual `bg-white/60 backdrop-blur-2xl` and `shadow-glass`). This groups them visually into one surface.

For treatment-abroad stats: same pattern -- `.stats-glass squircle-xl` wrapper around 4 cells.

### Step Cards Layout

Step cards (treatment-abroad #steps, checkup #how-it-works, online-consultations #process) have numbered sequences. The existing layout works well. **Recommendation:** Keep `grid sm:grid-cols-2 lg:grid-cols-4` but update to 12-col: `grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12` with each step at `md:col-span-4 lg:col-span-3`. Apply `liquid-card-wrap` > `liquid-card squircle-xl` to each step. Keep the timing badges as `liquid-regular squircle-full`.

### Highlighted/Promoted Program Cards

checkup.html has 2 "featured" program cards with different styling:
- `border-mu-blue/40 shadow-[0_16px_48px_color-mix(...)]` + gradient badge
- These need special shadow-wrap treatment: the `liquid-card-wrap` gets a custom `shadow-[0_16px_48px_color-mix(...)]` instead of the standard `--liquid-shadow-outer`
- Badge: gradient `bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white` stays (not glass) -- it is the CTA affordance

### FAQ Section Pattern

All 3 pages have FAQ sections with accordion items using `rounded-2xl`. These are small, compact elements. **Recommendation:** Use `liquid-regular squircle-md` (not card-wrap -- no outer shadow needed on FAQ items, shadow-glass-sm is small enough to be handled by inset shadows). Keep `overflow-hidden` for the accordion animation.

### Specialization Badges (online-consultations.html)

14 specialization badges use `rounded-full` with glass styling. **Recommendation:** Replace with `liquid-regular squircle-full` to match the badge pattern from contacts.html.

## Protected Legacy Inventory

[VERIFIED: grep counts from codebase]

| Page | nbsp Count | whitespace-nowrap | br.md:hidden | Honeypot | role="alert" | aria-live |
|------|-----------|-------------------|--------------|----------|-------------|-----------|
| checkup.html | 380 | 1 ("za 1-2 dnya") | Present in hero | 2 | 4 | 4 |
| online-consultations.html | 203 | 0 | Present in hero | 2 | 4 | 4 |
| treatment-abroad.html | 291 | 0 | Present in hero | 2 | 4 | 4 |

**Critical checkup.html item:** `<span class="whitespace-nowrap">za 1-2 dnya</span>` at line 157. This MUST survive migration. It is inside the h1 hero heading and has no interaction with grid/glass changes (it is a text-level span). Verification: grep for `whitespace-nowrap` must return exactly 1 match in checkup.html.

## Common Pitfalls

### Pitfall 1: Forgetting shadow-wrap on card elements
**What goes wrong:** Applying `squircle-xl` directly to a card that also has `shadow-glass` -- the mask-image clips the shadow.
**Why it happens:** Copy-paste from old pattern that had both `shadow-glass` and `rounded-[2.5rem]` on the same div.
**How to avoid:** Always wrap cards that need outer shadow in `liquid-card-wrap` (outer shadow) > `liquid-card squircle-*` (inner glass + mask).
**Warning signs:** Shadows appearing as thin arcs instead of full blur.

### Pitfall 2: Highlighted program cards losing their custom shadow
**What goes wrong:** The 2 featured checkup program cards have `shadow-[0_16px_48px_color-mix(...)]` -- a brand accent shadow. Replacing with generic `liquid-card-wrap` loses this visual distinction.
**How to avoid:** On the outer `liquid-card-wrap`, add the custom shadow as an override: `liquid-card-wrap shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)]`. The inner element still gets `liquid-card squircle-xl`.
**Warning signs:** Featured cards look identical to regular cards.

### Pitfall 3: Nested glass on form inputs
**What goes wrong:** Adding `liquid-regular` or `liquid-card` to form inputs that already have `bg-white/50 backdrop-blur-md`.
**Why it happens:** Over-eager migration -- wanting to put glass on everything.
**How to avoid:** Per CONTEXT.md locked decision: form inputs only get `squircle-md` replacing `rounded-2xl`. Keep existing `bg-white/50 backdrop-blur-md` as-is. No liquid-* classes on inputs.
**Warning signs:** Double-blurred input backgrounds, unreadable placeholder text.

### Pitfall 4: nbsp entities destroyed by reformatting
**What goes wrong:** Auto-formatters or manual re-indenting breaks `&nbsp;` entities.
**Why it happens:** Editor or tool treats `&nbsp;` as whitespace and normalizes it.
**How to avoid:** Run `grep -c '&nbsp;' file.html` before and after migration -- counts must match exactly (380/203/291).
**Warning signs:** Post-migration nbsp count differs from baseline.

### Pitfall 5: Hero section containers nested incorrectly
**What goes wrong:** Hero sections use `container mx-auto px-4 lg:px-6` INSIDE a section that already has flex/min-h styling. Replacing the wrong container level breaks hero layout.
**Why it happens:** Hero sections have a different nesting pattern than body sections -- the section itself has flex/align styling, and the container is one level down.
**How to avoid:** Hero wrappers: replace only the inner `container mx-auto px-4 lg:px-6` div with `max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8`. Do NOT touch the section-level classes.
**Warning signs:** Hero section loses vertical centering or min-height.

### Pitfall 6: FAQ accordion overflow-hidden conflict with squircle mask
**What goes wrong:** FAQ items need `overflow-hidden` for the accordion expand/collapse animation. Adding `squircle-md` (which uses mask-image) might interact unexpectedly.
**Why it happens:** Both `overflow-hidden` and `mask-image` clip content, but via different mechanisms.
**How to avoid:** Test accordion expand/collapse after adding squircle-md. If the expanding answer content gets clipped by the mask, remove `squircle-md` from individual FAQ items and apply it only to the FAQ list container. Alternatively, use `liquid-regular squircle-md` without shadow-wrap (FAQ items have `shadow-glass-sm` which is inset-only).
**Warning signs:** FAQ answer text gets cut off when expanding.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card glass surface | Manual `bg-white/60 backdrop-blur-2xl border border-white/60 shadow-glass` | `liquid-card` class | Encapsulates 6 properties including dark mode tokens |
| Shadow + mask separation | `shadow-glass` on same element as `squircle-*` | `liquid-card-wrap` > `liquid-card squircle-*` pattern | Shadow gets clipped by mask otherwise |
| Button gradient + specular | Manual gradient + shadow + hover + active classes | `liquid-btn-primary squircle-md` | Encapsulates 8+ individual utility classes |
| Badge glass surface | Manual `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm shadow-glass-inner` | `liquid-regular squircle-full` | Encapsulates 6 properties |

## Code Examples

### Pattern 1: Standard Card Migration

**Before:**
```html
<div class="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
  <div class="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
    <!-- icon -->
  </div>
  <h3>Title</h3>
  <p>Text</p>
</div>
```

**After:**
```html
<div class="liquid-card-wrap">
  <div class="liquid-card squircle-xl p-8">
    <div class="w-14 h-14 liquid-regular squircle-md flex items-center justify-center text-mu-blue mb-5">
      <!-- icon -->
    </div>
    <h3>Title</h3>
    <p>Text</p>
  </div>
</div>
```

Source: [VERIFIED: Phase 45-02-SUMMARY.md contacts.html migration map]

### Pattern 2: Section Wrapper Migration

**Before:**
```html
<section class="container mx-auto px-4 lg:px-6 mb-16" id="features">
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

**After:**
```html
<section class="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 mb-16" id="features">
  <div class="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
```

With children cards getting `md:col-span-4 lg:col-span-4` for equal thirds.

Source: [VERIFIED: Phase 45-02-SUMMARY.md]

### Pattern 3: Form Section Migration

**Before:**
```html
<div class="form-wrapper bg-white/70 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/60 relative overflow-hidden shadow-glass-lg">
  <form>
    <input class="... rounded-2xl ...">
    <button class="... bg-gradient-to-r from-mu-cta-from to-mu-cta-to ... rounded-2xl ...">
  </form>
</div>
```

**After:**
```html
<div class="liquid-card-wrap">
  <div class="liquid-card squircle-xl p-8 relative overflow-hidden">
    <form>
      <input class="... squircle-md ...">
      <button class="liquid-btn-primary squircle-md w-full py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-8">
    </form>
  </div>
</div>
```

Source: [VERIFIED: Phase 45-02-SUMMARY.md contacts.html form migration]

### Pattern 4: Highlighted Program Card

**Before:**
```html
<div class="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-mu-blue/40 shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)]">
  <span class="... bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white ... rounded-full ...">
    <span class="text-sm font-bold">Executive on Cancer</span>
  </span>
```

**After:**
```html
<div class="liquid-card-wrap shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)]">
  <div class="liquid-card squircle-xl p-8 flex flex-col">
    <span class="... bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white squircle-full ... w-fit mb-4">
      <span class="text-sm font-bold">Executive on Cancer</span>
    </span>
```

Source: [ASSUMED -- extrapolation from shadow-wrap pattern + existing highlighted card styling]

### Pattern 5: Stats Bar with Grouped Glass

**Before:**
```html
<div class="stats__grid grid grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="stat-card ... bg-white/60 backdrop-blur-2xl rounded-[2.5rem] ... shadow-glass ...">
```

**After:**
```html
<div class="liquid-card-wrap">
  <div class="stats-glass squircle-xl">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div class="stat-card flex flex-col items-center justify-center p-8">
```

Source: [VERIFIED: .stats-glass class exists in liquid-glass.css with --liquid-blur-lg] [ASSUMED: grouped wrapper approach]

### Pattern 6: FAQ Item

**Before:**
```html
<div class="faq__item bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-glass-sm overflow-hidden">
  <button class="faq__question ..." type="button" aria-expanded="false">
```

**After:**
```html
<div class="faq__item liquid-regular squircle-md overflow-hidden">
  <button class="faq__question ..." type="button" aria-expanded="false">
```

Note: FAQ items use `shadow-glass-sm` (small/inset) -- no outer shadow that would need shadow-wrap. `liquid-regular` handles the glass material; `squircle-md` handles the shape.

Source: [ASSUMED -- based on FAQ items having only inset shadows]

## Verification Protocol Per Page

Each page migration MUST verify:

| Check | Command | Expected |
|-------|---------|----------|
| Build passes | `make build` | exit 0 |
| nbsp count preserved | `grep -o '&nbsp;' {file} \| wc -l` | checkup: 380, online: 203, treatment: 291 |
| whitespace-nowrap preserved | `grep -c 'whitespace-nowrap' checkup.html` | 1 |
| br.md:hidden preserved | `grep -c 'md:hidden' {file}` | >= 1 per page |
| Honeypot preserved | `grep -c 'visually-hidden' {file}` | 2 per page |
| role="alert" preserved | `grep -c 'role="alert"' {file}` | 4 per page |
| aria-live preserved | `grep -c 'aria-live' {file}` | 4 per page |
| No old rounded-[ in main | `sed -n '/<main/,/<\/main>/p' {file} \| grep -c 'rounded-\['` | 0 (all replaced) |
| No old rounded-2xl in main | `sed -n '/<main/,/<\/main>/p' {file} \| grep -c 'rounded-2xl'` | 0 (all replaced) |
| No old rounded-3xl in main | `sed -n '/<main/,/<\/main>/p' {file} \| grep -c 'rounded-3xl'` | 0 (all replaced) |
| squircle- present | `grep -c 'squircle-' {file}` | High count (depends on page) |
| liquid-card present | `grep -c 'liquid-card' {file}` | High count |
| liquid-btn-primary present | `grep -c 'liquid-btn-primary' {file}` | >= 1 |
| max-w-[1200px] present | `grep -c 'max-w-\[1200px\]' {file}` | >= count of container mx-auto replacements |
| grid-cols-12 present | `grep -c 'grid-cols-12' {file}` | >= 1 |
| container mx-auto in main | `sed -n '/<main/,/<\/main>/p' {file} \| grep -c 'container mx-auto'` | 0 (all replaced) |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Grid column spans (5+7 for forms, equal thirds for cards) | Architecture Patterns > Grid Column Spans | Low -- column spans are purely visual and easily adjusted if proportions look off |
| A2 | Stats bar should use .stats-glass grouped wrapper | Architecture Patterns > Stats Bar | Medium -- if individual stat cards look better, reverse to individual liquid-card-wrap pattern |
| A3 | FAQ items can use liquid-regular without shadow-wrap | Code Examples > FAQ Item | Low -- FAQ items have only inset shadows (shadow-glass-sm), no outer shadow to clip |
| A4 | Highlighted program card shadow override on liquid-card-wrap | Code Examples > Pattern 4 | Medium -- custom shadow on liquid-card-wrap may need specificity adjustment if it conflicts with --liquid-shadow-outer |
| A5 | Hero image frame treatment as squircle-xl in liquid-card-wrap | Architecture Patterns > Migration Map | Low -- image frames are decorative, any squircle variant will work |

## Open Questions

1. **FAQ accordion + squircle-md interaction**
   - What we know: FAQ items use overflow-hidden for accordion animation; squircle-md applies mask-image
   - What's unclear: Whether mask-image clips the dynamically expanding answer content
   - Recommendation: Test after migration. If clipped, remove squircle from individual items and apply only to the list container. Alternatively, use `liquid-regular` without squircle on FAQ items (the visual difference at 16px radius vs rounded-2xl is subtle).

2. **Stats bar grouped vs. individual treatment**
   - What we know: DIFF-02 requires grouped glass on stats bar (index + checkup). Treatment-abroad also has a stats bar.
   - What's unclear: Whether treatment-abroad stats should also get grouped treatment or individual cards
   - Recommendation: Apply grouped .stats-glass to all stats bars for consistency across pages.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test framework in project) |
| Config file | None -- static HTML site |
| Quick run command | `make build` |
| Full suite command | `make build` + manual nbsp/class counts via grep |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MIGRATE-03 | checkup.html uses grid + squircle + liquid classes | smoke | `make build && grep -c 'squircle-' checkup.html && grep -c 'liquid-card' checkup.html` | N/A |
| MIGRATE-03 | whitespace-nowrap preserved | smoke | `grep -c 'whitespace-nowrap' checkup.html` (expect 1) | N/A |
| MIGRATE-03 | nbsp count preserved | smoke | `grep -o '&nbsp;' checkup.html \| wc -l` (expect 380) | N/A |
| MIGRATE-04 | online-consultations.html uses grid + squircle + liquid classes | smoke | `make build && grep -c 'squircle-' online-consultations.html` | N/A |
| MIGRATE-05 | treatment-abroad.html uses grid + squircle + liquid classes | smoke | `make build && grep -c 'squircle-' treatment-abroad.html` | N/A |

### Sampling Rate
- **Per task commit:** `make build` (rebuilds Tailwind CSS)
- **Per wave merge:** Full grep verification suite (nbsp counts, class counts, protected legacy)
- **Phase gate:** All verification checks pass before marking complete

### Wave 0 Gaps
None -- no test framework needed. Verification is grep-based count comparison.

## Sources

### Primary (HIGH confidence)
- Phase 45-02-SUMMARY.md -- contacts.html migration map (canonical reference for class replacements)
- Phase 45-01-SUMMARY.md -- 404.html migration map (simpler canary)
- 46-CONTEXT.md -- locked decisions and Claude's discretion areas
- REQUIREMENTS.md -- MIGRATE-03/04/05 descriptions, Protected Legacy list
- src/styles/liquid-glass.css -- available glass classes (.liquid-regular, .liquid-card, .liquid-card-wrap, .liquid-btn-primary, .liquid-btn-secondary, .stats-glass)
- src/styles/squircles.css -- available squircle classes (.squircle-md, .squircle-lg, .squircle-xl, .squircle-full)
- checkup.html, online-consultations.html, treatment-abroad.html -- current page structure analysis

### Secondary (MEDIUM confidence)
None needed -- all sources are in-repo.

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all classes already exist and are proven in Phase 45
- Architecture: HIGH -- section-by-section inventory from codebase grep, migration map from Phase 45 summary
- Pitfalls: HIGH -- pitfalls identified from Phase 45 execution patterns and anti-pattern documentation in CSS files

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- no external dependencies, all CSS classes are locked)
