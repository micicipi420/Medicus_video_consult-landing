# Phase 45: Simple Pages (404 + Contacts) - Research

**Researched:** 2026-04-09
**Domain:** HTML page migration -- applying v4.0 Liquid Design System (grid + squircle + liquid glass) to 404.html and contacts.html
**Confidence:** HIGH

## Summary

Phase 45 migrates the two simplest pages (404.html and contacts.html) to the v4.0 Liquid Design System visual language. These pages serve as canary deployments -- validating the migration pattern before tackling the complex pages in Phases 46-47.

404.html is minimal: a single centered `<main>` section with a gradient "404" text, heading, description paragraph, and "На главную" CTA button. The chrome (header, footer, mobile menu, sticky bar) is already upgraded via Phase 44 partials. The only work is on the `<main>` content area -- wrapping in a grid container, applying liquid card surface to the message block, and squircle treatment on the CTA button.

contacts.html is more complex: a hero badge+heading section, a 2-column layout with a coordinator card, 4 contact method cards (2x2), trust badges, and a full form with honeypot + ARIA validation. The existing styling uses v3-era glassmorphism (`bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-glass`) which must be replaced with v4.0 design system classes (`liquid-card squircle-lg`). Critical Protected Legacy items include 18+ `&nbsp;` entities, honeypot hidden input, `role="alert" aria-live="polite"` on 4 form error containers, and all form validation infrastructure.

**Primary recommendation:** Replace old glassmorphism inline classes with design system classes (`.liquid-card`, `.liquid-regular`, `.squircle-*`), wrap main content in `max-w-[1200px] mx-auto` grid containers, and use the shadow-wrap pattern where outer shadows are needed on squircle elements. Never touch chrome blocks (between `BUILD:` markers). Use `max-w-[1200px]` (Tailwind arbitrary value) for grid wrapper -- NOT `max-w-content` (the `--container-content` token generates container queries, not max-width utilities; review 41-REVIEW.md documented this bug and it remains unfixed).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 404.html: Grid wrapper with max-w-content (1200px), squircle CTA button (.squircle-md or .squircle-lg), liquid card surface for the 404 message area. Preserve: gradient "404" text, "Страница не найдена" heading, "На главную" CTA.
- contacts.html: Grid wrapper with max-w-content, liquid form container (.liquid-card), squircle inputs (.squircle-md on form inputs), glass contact card for contact info section. Preserve all Protected Legacy items (nbsp bindings, honeypot, ARIA, focus-visible, form validation).
- Migration pattern: Add grid wrapper divs where needed. Replace border-radius classes with .squircle-* classes. Add .liquid-card / .liquid-regular to surfaces. Shadow-wrap pattern where needed. Chrome already upgraded via Phase 44 partials -- no chrome edits.

### Claude's Discretion
- Exact grid column spans for each content section
- Which elements get squircle vs. stay with border-radius (very small elements like badges)
- Exact glass class on form container vs. contact info card
- Whether to add scroll-fade classes to any content areas

### Deferred Ideas (OUT OF SCOPE)
None -- both pages fully in scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIGRATE-01 | 404.html -- grid wrapper + squircle CTA + liquid card surfaces | Element-by-element analysis in Architecture Patterns: 404.html Migration Map. Available classes: `.liquid-card`, `.squircle-lg`, `.squircle-md`, `max-w-[1200px]` grid wrapper. Shadow-wrap pattern documented for CTA button. |
| MIGRATE-02 | contacts.html -- grid wrapper + liquid form container + squircle inputs + glass contact card | Element-by-element analysis in Architecture Patterns: contacts.html Migration Map. Old glassmorphism classes mapped to v4.0 replacements. Protected Legacy inventory identifies 4 form error containers, 1 honeypot, 18+ nbsp entities that must survive. |
</phase_requirements>

## Standard Stack

### Core (already in project -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.2.2 | Utility classes for grid, spacing, colors | Already installed as standalone binary `./tailwindcss`. Compiles via `make build`. [VERIFIED: Makefile line 10] |
| liquid-glass.css | v4.0 (project) | `.liquid-regular`, `.liquid-card`, `.liquid-card-wrap`, `.liquid-btn-primary` | Phase 43 deliverable, imported in tailwind.css. [VERIFIED: src/styles/liquid-glass.css] |
| squircles.css | v4.0 (project) | `.squircle-md`, `.squircle-lg`, `.squircle-xl`, `.squircle-full` | Phase 42 deliverable, imported in tailwind.css. [VERIFIED: src/styles/squircles.css] |
| theme.css | v4.0 (project) | `--liquid-*` tokens, `--squircle-mask-*` tokens, `--shadow-glass-*` tokens | Phase 41 deliverable. Tokens cascade into `.dark` automatically. [VERIFIED: src/styles/theme.css] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| build-pages.sh | Phase 39 | Chrome splicer -- regenerates BUILD: blocks | After any HTML edit, run `make build` to re-splice chrome partials. [VERIFIED: scripts/build-pages.sh] |

### Alternatives Considered
None. This phase uses only existing project infrastructure. No new libraries needed.

**Installation:** No installation needed -- all tools already present.

## Architecture Patterns

### Critical: max-w-[1200px] NOT max-w-content

The `--container-content: 1200px` token in `@theme inline` was intended to generate a `max-w-content` utility. However, Phase 41 review (41-REVIEW.md) identified that `--container-*` in Tailwind v4 generates **container query breakpoints**, not max-width utilities. The correct namespace would be `--max-width-content`. This bug was never fixed. [VERIFIED: 41-REVIEW.md lines 76-78, grep confirms no `--max-width-content` in theme.css]

Phase 44 chrome partials already use `max-w-[1200px]` (Tailwind arbitrary value) as the workaround. Phase 45 MUST use the same pattern for consistency. [VERIFIED: partials/header.html line 1 uses `max-w-[1200px]`]

### Pattern 1: Grid Wrapper (Page Content Container)

**What:** Wrap `<main>` content sections in a max-width container with responsive grid.
**When to use:** Every page content section outside chrome blocks.

```html
<!-- Source: architecture research + Phase 44 precedent -->
<main class="relative z-10 ...existing-padding-classes...">
  <div class="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
    <!-- Section content using grid -->
    <div class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
      ...
    </div>
  </div>
</main>
```

### Pattern 2: Liquid Card Surface (Non-interactive card)

**What:** Replace old `bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-glass` with design system classes.
**When to use:** Contact method cards, coordinator card, form container.

```html
<!-- OLD (v3 glassmorphism): -->
<div class="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass">

<!-- NEW (v4 liquid design): no outer shadow needed -->
<div class="liquid-card squircle-lg p-6">

<!-- NEW (v4 liquid design): outer shadow needed -->
<div class="liquid-card-wrap">
  <div class="liquid-card squircle-lg p-6">
    ...
  </div>
</div>
```

### Pattern 3: Squircle Form Inputs

**What:** Replace `rounded-2xl` on form inputs with `.squircle-md`.
**When to use:** All `<input>`, `<select>`, `<textarea>` elements.

```html
<!-- OLD: -->
<input class="... rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md ...">

<!-- NEW: squircle-md replaces rounded-2xl. Keep bg/border for input affordance. -->
<input class="... squircle-md border border-white/40 bg-white/50 backdrop-blur-md ...">
```

**Note on form inputs:** Form inputs use inset shadows (`shadow-form-inset`) which are SAFE inside squircle masks (per squircles.css docs -- "Inset shadows are safe inside mask, no wrap needed"). The `border` property IS clipped by mask-image, but for form inputs the visual effect is acceptable since the mask shape approximates the border shape. The anti-pattern warning about borders applies mainly to thick decorative borders, not 1px functional borders on inputs.

### Pattern 4: Squircle CTA Button with Shadow-Wrap

**What:** Replace `rounded-3xl` on CTA buttons with squircle + shadow-wrap for glow shadow.
**When to use:** The "На главную" CTA on 404.html, the "Отправить заявку" submit button on contacts.html.

```html
<!-- OLD: -->
<a class="bg-gradient-to-r from-mu-cta-from to-mu-cta-to text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 ...">

<!-- NEW with liquid-btn-primary (preferred -- uses specular edge treatment): -->
<a class="liquid-btn-primary squircle-md px-8 py-4 font-bold inline-flex items-center gap-2 ...">
```

**Note:** `.liquid-btn-primary` already includes `box-shadow` (specular edge inset shadows + outer glow). Since the inset shadows are safe inside mask, and the outer glow (small: `0 2px 8px`) is minor, the visual clipping from mask-image is acceptable for buttons. If a larger glow is needed, use shadow-wrap pattern. For the CTA buttons on these two pages, the `.liquid-btn-primary` class alone is sufficient.

### Pattern 5: Trust Badges -- Keep rounded-full (No Squircle)

**What:** Small pill-shaped badges should keep `rounded-full` (which is `squircle-full` = circle/pill, no mask needed).
**When to use:** Trust badges, glass badge on contacts hero.

```html
<!-- Badge: squircle-full is alias for rounded-full + no mask. Safe to use either. -->
<div class="squircle-full inline-flex items-center gap-2 ... px-5 py-2.5 text-sm font-bold">
```

Per SQUIRCLE-01, "all elements with border-radius replaced with superellipse." For pills/badges, `squircle-full` is functionally identical to `rounded-full` (no mask, just border-radius: 9999px). Using `squircle-full` signals design system adherence. But it is also acceptable to keep `rounded-full` since the visual output is identical.

### 404.html Migration Map

**Current structure (lines 123-138, excluding chrome):**
```
<main> (flex items-center justify-center, min-h-section-hero-compact)
  <div> (text-center max-w-lg mx-auto px-4)
    <div> gradient "404" text
    <h1> "Страница не найдена" (with &nbsp;)
    <p> description (with &nbsp;)
    <a> CTA "На главную" (rounded-3xl, shadow-lg)
  </div>
</main>
```

**Migration actions:**
1. **Outer container:** Change `max-w-lg` to `max-w-[1200px]` grid wrapper, but keep inner `max-w-lg` for content centering. The grid wrapper goes AROUND the centered content.
2. **Message card:** Wrap the 404 text + heading + description in a `liquid-card squircle-xl` surface.
3. **CTA button:** Replace `rounded-3xl shadow-lg shadow-mu-blue/30` with `liquid-btn-primary squircle-md`. Remove old shadow classes (liquid-btn-primary handles shadows).
4. **Preserve:** Gradient "404" text (`bg-gradient-to-r ... bg-clip-text text-transparent`), `&nbsp;` in h1 and p text, all existing text content.

**Elements NOT to squircle:** The gradient "404" text div has no border-radius currently -- no action needed.

### contacts.html Migration Map

**Current structure (lines 130-289, excluding chrome):**
```
<main> (min-h-section-hero-compact, padding)
  <section> (container mx-auto, hero)
    <div> (text-center max-w-3xl mx-auto)
      <div> glass-badge (rounded-full, bg-white/40 backdrop-blur-xl)
      <h1> gradient "Контакты"
      <p> description (with &nbsp;)
    </div>
  </section>

  <section> (container mx-auto, #contact-section)
    <div> (grid lg:grid-cols-2 gap-12)
      <!-- LEFT: Info Column -->
      <div> (.contact__info space-y-8)
        <div> coordinator-card (bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass)
          <div> avatar (rounded-full, w-28 h-28)
          <div> name + title + description
        </div>
        <div> 2x2 grid of contact method cards (sm:grid-cols-2)
          4x <div> (bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-glass)
            <div> icon box (w-10 h-10 bg-white/50 rounded-xl)
            <p> label
            <a>/<p> value
          </div>
        </div>
        <div> trust badges row (flex, 4x rounded-full pills)
      </div>

      <!-- RIGHT: Form -->
      <div> (.form-wrapper)
        <div> form container (bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-glass-lg)
          <div> success overlay (hidden)
          <h2> "Оставить заявку"
          <form> (novalidate)
            <div> name input (rounded-2xl, shadow-form-inset)
            <div> phone input (rounded-2xl, shadow-form-inset)
            <div> select interest (rounded-2xl, shadow-form-inset)
            <div> textarea description (rounded-2xl, shadow-form-inset)
            <div> honeypot (.visually-hidden)
            <button> submit (rounded-2xl, shadow-lg)
            <p> privacy text
            <div> form error (role="alert" aria-live="polite")
          </form>
        </div>
      </div>
    </div>
  </section>
</main>
```

**Migration actions by element:**

| Element | Old Classes | New Classes | Shadow-Wrap? | Notes |
|---------|-------------|-------------|--------------|-------|
| Hero section container | `container mx-auto px-4 lg:px-6` | `max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8` | No | Replace container with explicit max-width |
| Glass badge | `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm shadow-glass-inner` | `liquid-regular squircle-full px-5 py-2.5` or keep as-is | No | Small pill; squircle-full = rounded-full. Can add `liquid-regular` for consistency or keep old glass classes. Discretion area. |
| Contact section container | `container mx-auto px-4 lg:px-6` | `max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8` | No | Same grid wrapper pattern |
| 2-col grid | `grid lg:grid-cols-2 gap-12` | Keep as-is or convert to `grid grid-cols-1 lg:grid-cols-12 gap-8` with `lg:col-span-5` / `lg:col-span-7` | No | Discretion: keep simple 2-col or use 12-col grid |
| Coordinator card | `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-glass border border-white/60 shadow-glass-inner` | `liquid-card squircle-xl p-8` inside `liquid-card-wrap` | Yes (needs outer shadow) | Large card with visible shadow needs shadow-wrap |
| Avatar circle | `rounded-full overflow-hidden shadow-glass-sm border-4 border-white/60` | `squircle-full overflow-hidden` | No | Circle = squircle-full. Remove old shadow/border classes, or keep border for visual effect (border on squircle-full is safe since no mask applied). |
| Contact method cards (4x) | `bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass` | `liquid-card squircle-lg p-6` inside `liquid-card-wrap` | Yes (outer shadow desirable) | 4 identical cards in 2x2 grid |
| Icon boxes (4x) | `w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl border border-white/60` | `w-10 h-10 liquid-regular squircle-md` | No | Small icon container; inset-only shadows from liquid-regular are safe in mask |
| Trust badges (4x) | `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm shadow-glass-inner` | `liquid-regular squircle-full` | No | Pills; squircle-full = no mask; can add liquid-regular for consistent material |
| Form container | `bg-white/70 backdrop-blur-3xl rounded-[3rem] p-8 shadow-glass-lg border border-white/60 shadow-glass-inner` | `liquid-card squircle-xl p-8` inside `liquid-card-wrap` | Yes (large card needs outer shadow) | Main form wrapper |
| Form inputs (3x) | `rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md ... shadow-form-inset` | `squircle-md border border-white/40 bg-white/50 backdrop-blur-md ... shadow-form-inset` | No | Replace rounded-2xl with squircle-md. Keep bg/border/shadow-form-inset (inset safe in mask) |
| Select | Same as inputs | Same as inputs (+ `squircle-md`) | No | Same treatment |
| Textarea | Same as inputs | Same as inputs (+ `squircle-md`) | No | Same treatment |
| Submit button | `rounded-2xl shadow-lg shadow-mu-blue/30` | `liquid-btn-primary squircle-md` | No | liquid-btn-primary provides gradient + specular treatment |
| Honeypot | `.visually-hidden` | **DO NOT TOUCH** | -- | Protected Legacy |
| Form errors | `role="alert" aria-live="polite"` | **DO NOT TOUCH** | -- | Protected Legacy |

### Build Process After Edits

After modifying 404.html and contacts.html, run:
```bash
make build   # Compiles Tailwind CSS + splices chrome partials
make check   # Verifies byte-identity (no chrome drift)
```

The build process:
1. `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify` -- recompiles CSS with any new utility classes
2. `./scripts/build-pages.sh` -- re-splices chrome partials into all 6 pages

**Important:** Edits to the `<main>` content area (between chrome blocks) will NOT be affected by the splicer -- the splicer only replaces content between `<!-- BUILD:xxx -->` and `<!-- /BUILD:xxx -->` markers. Main content is safe to edit directly.

### Anti-Patterns to Avoid
- **Editing chrome blocks directly:** Content between `<!-- BUILD:header -->` and `<!-- /BUILD:header -->` (and other BUILD markers) is overwritten by `make build`. Edit `partials/*.html` instead. But Phase 45 should NOT edit partials -- chrome is already upgraded.
- **Nesting glass inside glass:** Never put `.liquid-card` inside `.liquid-card` or `.liquid-regular`. The form inputs use `backdrop-blur-md` which is technically a glass effect inside the liquid-card form container. This is acceptable because the inputs use a DIFFERENT blur level (not the full liquid-glass treatment) and don't use `.liquid-card` class.
- **Box-shadow + mask-image on same element:** Use shadow-wrap pattern. Apply `liquid-card-wrap` on outer div, `squircle-lg liquid-card` on inner div.
- **Using `max-w-content`:** This utility does not exist (token namespace bug). Use `max-w-[1200px]` instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glass material effect | Custom `backdrop-filter` + `bg-white/X` combos | `.liquid-card` or `.liquid-regular` | Includes rim lighting, dark mode cascade, print/reduced-motion overrides, refraction PE |
| Superellipse shape | Custom SVG mask or `border-radius` tweaks | `.squircle-md/lg/xl/full` | Three-tier degradation (Chrome 139+ native, mask-image, border-radius fallback) |
| Outer shadow on masked element | `box-shadow` on masked element (gets clipped) | `liquid-card-wrap` wrapper div | Shadow-wrap pattern: outer carries shadow, inner carries mask |
| Button hover/press states | Manual `hover:` and `active:` utilities | `.liquid-btn-primary` | Includes brightness filter, scale(0.97) press, specular edge treatment |

**Key insight:** Every visual effect in the old glassmorphism classes (bg-white/60, backdrop-blur-2xl, border border-white/60, shadow-glass, shadow-glass-inner) has been consolidated into `.liquid-card` + `.liquid-regular`. The old approach was 5-8 utility classes per element; the new approach is 1-2 design system classes.

## Common Pitfalls

### Pitfall 1: Chrome Block Contamination
**What goes wrong:** Editing HTML inside `<!-- BUILD:header -->` blocks, which gets overwritten on next `make build`.
**Why it happens:** Chrome blocks visually appear as regular HTML. Easy to edit by mistake.
**How to avoid:** Phase 45 touches ONLY `<main>` content area. Chrome is between BUILD markers. Never edit between markers.
**Warning signs:** `make check` fails with "chrome drift detected."

### Pitfall 2: Missing Shadow-Wrap on Cards
**What goes wrong:** Adding `.liquid-card squircle-lg` to a card that previously had outer shadow. The shadow gets clipped by mask-image, appearing as thin arcs.
**Why it happens:** Squircle mask clips everything including box-shadow.
**How to avoid:** Any element that needs a visible outer shadow MUST use the shadow-wrap pattern: `<div class="liquid-card-wrap"><div class="liquid-card squircle-lg">`.
**Warning signs:** Cards appear to have no shadow or have thin arc-shaped shadow fragments.

### Pitfall 3: Breaking nbsp Entities
**What goes wrong:** Accidentally removing or corrupting `&nbsp;` entities during find-and-replace of class attributes.
**Why it happens:** Bulk text replacements can affect content between tags, not just attributes.
**How to avoid:** Only modify `class="..."` attributes. Never use regex that matches across tag boundaries. Verify `&nbsp;` count before/after edit.
**Warning signs:** Text wrapping differently in Russian content; orphaned prepositions at line ends.

### Pitfall 4: Form Honeypot / ARIA Removal
**What goes wrong:** Removing the `visually-hidden` honeypot div or `role="alert" aria-live="polite"` attributes during cleanup.
**Why it happens:** These look like "dead code" during visual migration.
**How to avoid:** Never touch the honeypot div (lines 267-271 in contacts.html). Never touch `role="alert"` attributes on form error containers. Pre-flight check: grep for these patterns before and after.
**Warning signs:** Form spam increases (honeypot removed); screen readers don't announce form errors (ARIA removed).

### Pitfall 5: Nested Backdrop-Filter Conflict
**What goes wrong:** Form inputs already have `backdrop-blur-md` and sit inside a `liquid-card` form container which also has `backdrop-filter`. On Safari, nested backdrop-filter can cause rendering artifacts.
**Why it happens:** Multiple stacking contexts with backdrop-filter.
**How to avoid:** This is a known acceptable compromise. The form inputs' light blur (`backdrop-blur-md` = 12px) inside the card's heavier blur is visually acceptable. Do NOT add `.liquid-regular` or `.liquid-card` to the inputs themselves -- they are NOT glass surfaces, just styled form fields.
**Warning signs:** Inputs appear overly blurred or have visual artifacts on Safari.

### Pitfall 6: Using max-w-content
**What goes wrong:** Using `max-w-content` class which does not exist in the compiled CSS.
**Why it happens:** Planning documents reference it, but the Tailwind v4 token namespace is wrong (`--container-*` creates container queries, not max-width utilities).
**How to avoid:** Use `max-w-[1200px]` (Tailwind arbitrary value) everywhere. This is what Phase 44 chrome partials already use.
**Warning signs:** Elements have no max-width constraint; content stretches to full viewport width.

## Code Examples

### 404.html Main Content (Migrated)

```html
<!-- Source: analysis of 404.html lines 123-138 + v4.0 design system classes -->
<main id="page-content" class="relative z-10 pt-section-pt lg:pt-section-pt-lg pb-section-pb min-h-section-hero-compact flex items-center justify-center">
  <div class="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
    <div class="liquid-card-wrap max-w-lg mx-auto">
      <div class="liquid-card squircle-xl text-center p-8 md:p-12">
        <div class="text-8xl font-extrabold bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent mb-6">
          404
        </div>
        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4">Страница&nbsp;не&nbsp;найдена</h1>
        <p class="text-mu-text-700 font-medium mb-8">
          Эту страницу либо перенесли, либо&nbsp;она&nbsp;ещё не&nbsp;появилась. Откройте главную или&nbsp;напишите координатору.
        </p>
        <a href="index.html" class="liquid-btn-primary squircle-md px-8 py-4 font-bold inline-flex items-center gap-2 mx-auto">
          <svg ...>...</svg>
          На главную
        </a>
      </div>
    </div>
  </div>
</main>
```

### contacts.html Contact Method Card (Migrated)

```html
<!-- Source: analysis of contacts.html lines 170-176 + v4.0 design system classes -->
<div class="liquid-card-wrap">
  <div class="liquid-card squircle-lg p-6">
    <div class="w-10 h-10 liquid-regular squircle-md flex items-center justify-center text-mu-blue mb-3">
      <svg ...>...</svg>
    </div>
    <p class="text-sm text-mu-text-500 font-bold mb-1">Телефон</p>
    <a href="tel:+77015322478" class="text-mu-text-900 font-bold hover:text-mu-blue-text transition-colors">+7&nbsp;701&nbsp;532&nbsp;24&nbsp;78</a>
  </div>
</div>
```

### contacts.html Form Input (Migrated)

```html
<!-- Source: analysis of contacts.html line 240 + squircle replacement -->
<input type="text" id="contact-name" name="name"
  class="form__input w-full px-5 py-4 squircle-md border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-form-inset"
  placeholder="Например, Айгуль" required autocomplete="name">
```

## Protected Legacy Inventory

### 404.html Protected Items
| Item | Location | Count | Action |
|------|----------|-------|--------|
| `&nbsp;` entities | h1 (line 129), p (line 131), chrome blocks | 2 in main, 8+ in chrome | Preserve ALL -- only edit class attributes |
| SEO metadata | `<head>` lines 4-8 | 1 block | DO NOT TOUCH |
| Favicon links | `<head>` lines 10-13 | 4 links | DO NOT TOUCH |
| `overflow-x-clip` | `<body>` class | 1 | Preserve in body class |
| Chrome BUILD markers | Lines 52-62, 72-99, 101-121, 140-202, 204-211 | 5 pairs | DO NOT EDIT between markers |

### contacts.html Protected Items
| Item | Location | Count | Action |
|------|----------|-------|--------|
| `&nbsp;` entities | Throughout content + chrome | 18+ instances | Preserve ALL |
| Honeypot input | Lines 267-271 | 1 div | DO NOT TOUCH |
| `role="alert" aria-live="polite"` | Lines 241, 247, 259, 282 | 4 containers | DO NOT TOUCH |
| `.visually-hidden` style | `<style>` block line 53 | 1 rule | DO NOT TOUCH |
| `.is-invalid` / `.form__field-error` styles | `<style>` block lines 44-51 | CSS rules | DO NOT TOUCH |
| `form__success` / `form__error` styles | `<style>` block lines 47-48 | CSS rules | DO NOT TOUCH |
| SEO metadata + OG tags | `<head>` lines 6-18 | Full block | DO NOT TOUCH |
| Canonical URL | Line 18 | 1 link | DO NOT TOUCH |
| Favicon links | Lines 20-23 | 4 links | DO NOT TOUCH |
| `form novalidate` | Line 237 | 1 attr | Preserve |
| `autocomplete` attributes | Lines 240, 246 | 2 attrs | Preserve |
| `inputmode="numeric"` | Line 246 | 1 attr | Preserve |
| Chrome BUILD markers | 5 pairs | -- | DO NOT EDIT between markers |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification + shell commands |
| Config file | Makefile (build and check targets) |
| Quick run command | `make build` |
| Full suite command | `make check` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MIGRATE-01 | 404.html uses grid wrapper, squircle CTA, liquid card | smoke | `make build && grep -c 'squircle-' 404.html && grep -c 'liquid-card' 404.html` | N/A (grep) |
| MIGRATE-02 | contacts.html uses grid wrapper, liquid form, squircle inputs, glass card | smoke | `make build && grep -c 'squircle-' contacts.html && grep -c 'liquid-card' contacts.html` | N/A (grep) |
| MIGRATE-01/02 | Build passes, byte-identity check passes | integration | `make check` | Makefile exists |
| MIGRATE-01/02 | Protected Legacy preserved | smoke | `grep -c '&nbsp;' 404.html && grep -c 'visually-hidden' contacts.html && grep -c 'aria-live' contacts.html` | N/A (grep) |

### Sampling Rate
- **Per task commit:** `make build` (15 seconds)
- **Per wave merge:** `make check` (20 seconds)
- **Phase gate:** `make check` green + visual browser inspection of both pages

### Wave 0 Gaps
None -- existing build infrastructure covers all phase requirements.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A -- no auth changes |
| V3 Session Management | No | N/A -- no session changes |
| V4 Access Control | No | N/A -- no access changes |
| V5 Input Validation | No (existing preserved) | Honeypot and form validation preserved as Protected Legacy |
| V6 Cryptography | No | N/A -- no crypto changes |

This phase is CSS/HTML visual migration only. No server-side, API, or security-relevant code is modified. The honeypot anti-spam mechanism and ARIA form validation are explicitly preserved as Protected Legacy.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Form inputs with `backdrop-blur-md` inside `liquid-card` container are visually acceptable on Safari | Pitfall 5 | Visual artifacts on Safari; may need to remove input backdrop-blur |
| A2 | The small outer shadow from `liquid-btn-primary` is acceptable when clipped by `squircle-md` mask on CTA buttons | Pattern 4 | Shadow appears as thin arcs; would need shadow-wrap on CTA buttons |
| A3 | `border border-white/40` on squircle-md form inputs is visually acceptable despite mask-image clipping borders | Pattern 3 | Visible border gap at superellipse curves; would need `box-shadow: inset 0 0 0 1px` replacement |

## Open Questions

1. **Badge treatment: squircle-full + liquid-regular vs. keep old glass classes?**
   - What we know: Trust badges use `rounded-full` (pill shape). `squircle-full` is identical (no mask). Adding `liquid-regular` would make them use the design system material tokens.
   - What's unclear: Whether the subtle visual difference (liquid-regular has rim lighting that old `bg-white/40 backdrop-blur-xl border border-white/60 shadow-glass-inner` does not) is acceptable.
   - Recommendation: Use `liquid-regular squircle-full` for design system consistency. Claude's discretion area.

2. **2-column grid: keep `lg:grid-cols-2` or switch to 12-col grid?**
   - What we know: GRID-01 requires all pages use 12/8/2-3 responsive grid. Current contacts uses `grid lg:grid-cols-2`.
   - What's unclear: Whether the form/info layout benefits from 12-col granularity.
   - Recommendation: Use `grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12` outer grid, with `md:col-span-4 lg:col-span-5` for info and `md:col-span-4 lg:col-span-7` for form. This satisfies GRID-01 while maintaining the visual 2-column layout.

## Sources

### Primary (HIGH confidence)
- `src/styles/liquid-glass.css` -- full class inventory and shadow-wrap pattern docs [VERIFIED: read in session]
- `src/styles/squircles.css` -- squircle utility classes, anti-patterns, shadow-wrap docs [VERIFIED: read in session]
- `src/styles/theme.css` -- all token definitions including --liquid-*, --squircle-mask-*, --shadow-glass-* [VERIFIED: read in session]
- `404.html` -- complete current page structure (218 lines) [VERIFIED: read in session]
- `contacts.html` -- complete current page structure (371 lines) [VERIFIED: read in session]
- `partials/header.html` -- Phase 44 chrome pattern with `liquid-regular squircle-xl max-w-[1200px]` [VERIFIED: read in session]
- `Makefile` -- build pipeline: `make build` = tailwindcss + build-pages.sh [VERIFIED: read in session]
- `scripts/build-pages.sh` -- splicer: replaces between BUILD markers, preserves main content [VERIFIED: read in session]
- `.planning/phases/41-foundation-tokens/41-REVIEW.md` -- documents `--container-content` token bug (generates container queries, not max-width) [VERIFIED: read in session]

### Secondary (MEDIUM confidence)
- `.planning/phases/41-foundation-tokens/41-01-SUMMARY.md` -- confirms max-w-content JIT behavior and token correctness [VERIFIED: read in session]
- `.planning/research/ARCHITECTURE.md` -- canonical grid triplet and migration patterns [VERIFIED: read in session via grep]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools verified in project, no new dependencies
- Architecture: HIGH -- all patterns derived from reading actual CSS source files and Phase 44 precedent
- Pitfalls: HIGH -- identified from squircles.css/liquid-glass.css anti-pattern docs and build system analysis

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- no external dependencies, all project-internal)
