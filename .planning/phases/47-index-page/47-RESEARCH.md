# Phase 47: Index Page - Research

**Researched:** 2026-04-09
**Domain:** Frontend migration -- HTML/CSS class replacement (Liquid Design System v4.0)
**Confidence:** HIGH

## Summary

index.html is the highest-complexity page in the site with 11 content sections inside `<main>` plus a stats bar between hero and services (13 total counting stats + the 11 numbered sections in comments). The page currently uses v3.x manual glass classes (87 backdrop-blur, 84 bg-white/, 69 border-glass, 46 rounded-[) that must be replaced with Liquid Design System primitives (liquid-card-wrap > liquid-card squircle-*, liquid-regular squircle-*, liquid-btn-primary/secondary squircle-md, stats-glass). Chrome partials (header, footer, mobile-menu, sticky-bar) are already migrated from Phase 44 and must NOT be touched.

The proven migration pattern from Phases 45-46 (checkup=102 squircle, online-consultations=110, treatment-abroad=95) applies directly. Index-specific challenges are: (1) floating hero cards with absolute positioning and z-10/z-20/z-30 stacking, (2) 15 icon chips with `group-hover:rotate-3` that conflict with squircle mask-image, (3) mesh-bg blobs at z-0 behind glass surfaces, (4) stats bar needing grouped stats-glass treatment (DIFF-02), and (5) hero CTA needing shimmer-sweep (DIFF-01). GRID-02 verification (text cards min 4 cols on tablet) must be checked across all 6 pages after migration.

**Primary recommendation:** Migrate all 11 main sections + stats bar using the Phase 46 proven pattern (liquid-card-wrap > liquid-card squircle-xl for cards, liquid-regular squircle-* for inline glass, liquid-btn-primary/secondary squircle-md for buttons, stats-glass squircle-xl for stats bar, max-w-[1200px] grid-cols-12 for layout). Resolve icon chip rotate conflict by keeping border-radius on rotating elements (squircle anti-pattern: never apply squircle to rotating elements). Apply shimmer-sweep to hero CTA only.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Full grid + liquid + squircle treatment on all 13 sections
- Floating hero cards + z-index map compatibility
- Mesh-bg blob compatibility with glass surfaces
- Icon chip rotate-vs-squircle resolved
- Stats bar uses .stats-glass grouped backdrop (DIFF-02)
- Hero CTA gets .shimmer-sweep (DIFF-01)
- 12-col desktop / 8-col tablet / 2-3 col mobile
- max-w-[1200px] (NOT max-w-content)
- Text cards minimum 4 columns on tablet (GRID-02)
- Proven Phase 45-46 migration pattern: liquid-card-wrap + liquid-card squircle-* for cards with shadows, liquid-regular squircle-* for inline glass, liquid-btn-primary squircle-md for CTA buttons, form inputs squircle-md only (no nested glass)

### Claude's Discretion
- Exact column spans per section
- Floating hero card z-index arrangement with glass
- Mesh-bg blob interaction with liquid surfaces
- Icon treatment: squircle-md on icon containers vs. rotate preservation
- Section-specific glass intensity (which sections get glass vs. plain)

### Deferred Ideas (OUT OF SCOPE)
None -- full migration in scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIGRATE-06 | index.html full grid + liquid + squircle treatment on all 13 sections, including floating hero cards, glass stat bar, service cards, pricing, FAQ, form, CTA | Section-by-section map below with exact class replacement patterns, z-index map, icon chip resolution, and per-section column spans |
| GRID-02 | Text-bearing cards occupy minimum 4 columns on tablet breakpoint (8-col) across ALL 6 pages; Russian compound words do not overflow at 768px | Grid span recommendations per section; already-migrated pages use md:col-span-4 consistently; index needs same treatment |
</phase_requirements>

## Standard Stack

No new libraries needed. This phase uses only existing CSS classes from the design system.

### Core (already in project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| liquid-glass.css | v4.0 (current) | Glass material primitives | Project design system -- liquid-card, liquid-regular, stats-glass, shimmer-sweep, liquid-btn-primary/secondary |
| squircles.css | v4.0 (current) | Squircle shape primitives | Project design system -- squircle-md/lg/xl/full with mask-image SVG |
| theme.css | v4.0 (current) | Design tokens | --liquid-*, --squircle-mask-*, grid tokens |
| Tailwind CSS | v4.2.2 | Utility classes | Built via standalone CLI binary |

### Installation
No new packages. `make build` compiles everything. [VERIFIED: Makefile in project root]

## Architecture Patterns

### Section Map: index.html (13 Sections)

All sections inside `<main>` that need migration. Chrome (header, footer, mobile-menu, sticky-bar) is already migrated via Phase 44 partials.

| # | Section ID | Comment Label | Cards/Elements | Current Container | Migration Target |
|---|-----------|---------------|----------------|-------------------|-----------------|
| 1 | #hero | SECTION 1: HERO | 2 hero images + 2 floating badges + badge pill + 2 CTA buttons | container mx-auto | max-w-[1200px] grid grid-cols-12 |
| S | (stats) | STATS SECTION | 4 stat cards in grid | container mx-auto, grid-cols-2 lg:grid-cols-4 | max-w-[1200px] stats-glass squircle-xl wrapper (DIFF-02) |
| 2 | #services | SECTION 2: SERVICE CARDS | 3 large service cards with images | container mx-auto, grid md:grid-cols-2 lg:grid-cols-3 | max-w-[1200px] grid grid-cols-12, cards = liquid-card-wrap > liquid-card squircle-xl |
| 3 | #problem | SECTION 3: PROBLEM | 4 problem recognition cards | container mx-auto, grid md:grid-cols-2 | max-w-[1200px] grid grid-cols-12, cards = liquid-card-wrap > liquid-card squircle-xl |
| 4 | #process | SECTION 4: HOW IT WORKS | 4 step cards | container mx-auto, grid md:2 lg:4 | max-w-[1200px] grid grid-cols-12, cards = liquid-card-wrap > liquid-card squircle-xl |
| 5 | #why-us | SECTION 5: WHY US | 4 advantage rows (icon + text) + 4 image collage | container mx-auto, grid lg:grid-cols-2 | max-w-[1200px] grid grid-cols-12, icon boxes = liquid-regular squircle-md |
| 6 | #clinics | SECTION 6: CLINICS | 8 country cards | container mx-auto, grid md:grid-cols-2 | max-w-[1200px] grid grid-cols-12, cards = liquid-card-wrap > liquid-card squircle-xl |
| 7 | #platform | SECTION 7: PLATFORM | 1 large info card | container mx-auto | max-w-[1200px] grid grid-cols-12, card = liquid-card-wrap > liquid-card squircle-xl |
| 8 | #reviews | SECTION 8: REVIEWS | 4 review cards | container mx-auto, grid md:grid-cols-2 | max-w-[1200px] grid grid-cols-12, cards = liquid-card-wrap > liquid-card squircle-xl |
| 9 | #faq | SECTION 9: FAQ | 7 accordion items | container mx-auto | max-w-[1200px], items = liquid-regular squircle-md overflow-hidden |
| 10 | #contact | SECTION 10: FORM | Form card + coordinator card + trust badges | container mx-auto, grid lg:grid-cols-2 | max-w-[1200px] grid grid-cols-12, form = liquid-card-wrap > liquid-card squircle-xl |
| 11 | #cta | SECTION 11: FINAL CTA | 1 large CTA card with image | container mx-auto | max-w-[1200px] grid grid-cols-12, card = liquid-card-wrap > liquid-card squircle-xl |

[VERIFIED: index.html source code grep]

### Recommended Column Spans Per Section

Based on Phase 46 proven patterns and GRID-02 (min 4 cols on tablet = md:col-span-4 on 8-col grid):

| Section | Desktop (12-col) | Tablet (8-col via md:) | Mobile | Notes |
|---------|------------------|----------------------|--------|-------|
| Hero | Left 7 + Right 5 | Full width stacked | Full | Hero image composition needs room |
| Stats | 4x col-span-3 | 4x md:col-span-4 (2x2 grid) | 2-col grid | Grouped stats-glass wrapper |
| Services (3 cards) | 3x col-span-4 | md:col-span-4 (wraps 2+1) | Full width | GRID-02: 4 cols min on tablet |
| Problem (4 cards) | 2x col-span-6 | md:col-span-4 (wraps 2+2) | Full width | GRID-02 compliant |
| How It Works (4 cards) | 4x col-span-3 | md:col-span-4 (wraps 2+2) | Full width | GRID-02 compliant |
| Why Us | Left content 7 + Right collage 5 | Full stacked | Full | Advantage icon rows are inline, not cards |
| Clinics (8 cards) | 2x col-span-6 | md:col-span-4 (wraps 2+2+2+2) | Full width | GRID-02 compliant |
| Platform (1 card) | col-span-12 max-w-3xl mx-auto | Full width | Full | Single centered card |
| Reviews (4 cards) | 2x col-span-6 | md:col-span-4 (wraps 2+2) | Full width | GRID-02 compliant |
| FAQ | col-span-12 max-w-3xl mx-auto | Full width | Full | Accordion items, not grid cards |
| Form | Left info 5 + Right form 7 (lg) | Full stacked | Full | Proven in checkup.html 46-01 |
| Final CTA | col-span-12 or lg:grid-cols-2 inside | Full width | Full | Image hidden on mobile |

[ASSUMED -- column spans are Claude's discretion per CONTEXT.md]

### Pattern 1: Card Migration (Shadow-Wrap)
**What:** Replace manual glass classes with liquid-card-wrap + liquid-card squircle-xl
**When to use:** Any card surface that needs outer shadow + glass + squircle mask
**Example:**
```html
<!-- BEFORE (v3.x) -->
<div class="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500">
  <!-- card content -->
</div>

<!-- AFTER (v4.0) -->
<div class="liquid-card-wrap">
  <div class="liquid-card squircle-xl">
    <!-- card content (keep hover transforms, keep flex/grid layout) -->
  </div>
</div>
```
[VERIFIED: squircles.css shadow-wrap pattern + Phase 46 SUMMARY]

### Pattern 2: Stats Bar (Grouped Glass -- DIFF-02)
**What:** Replace 4 individual stat glass cards with a single stats-glass squircle-xl wrapper
**When to use:** Stats/social-proof section only
**Example:**
```html
<!-- BEFORE (v3.x) -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass p-8">
    <!-- stat item -->
  </div>
  <!-- ... 3 more -->
</div>

<!-- AFTER (v4.0) -->
<div class="mx-auto max-w-[1200px] px-4 lg:px-6">
  <div class="stats-glass squircle-xl">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="flex flex-col items-center justify-center p-8">
        <!-- stat item -- NO individual glass, transparent within grouped surface -->
      </div>
      <!-- ... 3 more -->
    </div>
  </div>
</div>
```
[VERIFIED: checkup.html stats section pattern from 46-01-SUMMARY]

### Pattern 3: Hero CTA Shimmer (DIFF-01)
**What:** Add shimmer-sweep to hero primary CTA button only
**When to use:** Hero section primary CTA only (max 1 per viewport)
**Example:**
```html
<!-- Hero primary CTA -->
<a href="#contact" class="liquid-btn-primary squircle-md shimmer-sweep px-8 py-4 font-semibold text-lg ...">
  Обсудить мой случай бесплатно
  <svg ...></svg>
</a>
```
[VERIFIED: liquid-glass.css shimmer-sweep class -- max 1 per viewport per anti-pattern docs]

### Pattern 4: FAQ Accordion Items
**What:** Replace manual glass with liquid-regular squircle-md overflow-hidden
**When to use:** Accordion items (no shadow-wrap needed)
**Example:**
```html
<!-- BEFORE -->
<div class="faq__item bg-white/60 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden">

<!-- AFTER -->
<div class="faq__item liquid-regular squircle-md overflow-hidden">
```
[VERIFIED: checkup.html FAQ pattern from 46-01-SUMMARY]

### Pattern 5: Inline Glass (Badges, Trust Indicators)
**What:** Replace manual glass badges with liquid-regular squircle-full
**When to use:** Pill-shaped badges, trust indicators, small inline glass elements
**Example:**
```html
<!-- BEFORE -->
<div class="inline-flex items-center gap-2 bg-white/40 backdrop-blur-[20px] border border-glass-border px-5 py-2.5 rounded-full shadow-glass-sm">

<!-- AFTER -->
<div class="inline-flex items-center gap-2 liquid-regular squircle-full px-5 py-2.5">
```
[VERIFIED: existing chrome partials pattern]

### Pattern 6: Form Inputs (Squircle Only, No Glass)
**What:** Replace rounded-2xl on inputs/select/textarea with squircle-md
**When to use:** Form fields
**Example:**
```html
<!-- BEFORE -->
<input class="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md ...">

<!-- AFTER -->
<input class="w-full px-5 py-4 squircle-md border border-white/40 bg-white/50 backdrop-blur-md ...">
```
Note: Form inputs keep their bg-white/50 backdrop-blur-md -- only the rounding changes. No nested glass.
[VERIFIED: contacts.html form pattern from Phase 45]

### Z-Index Map

Current z-index usage in index.html (including chrome):

| z-value | Element | Purpose | Migration Impact |
|---------|---------|---------|-----------------|
| z-0 | Mesh-bg container | Background blobs | NO CHANGE -- stays behind everything |
| z-10 | `<main>` element | Main content stacking | NO CHANGE |
| z-10 | Most sections | Section-level stacking | NO CHANGE |
| z-10 | Hero main image | Primary photo | NO CHANGE |
| z-10 | Stat number text (relative z-10 within stat cards) | Text above shimmer overlays | REMOVED (stats become transparent cells) |
| z-20 | Stats section | Section floats above hero | NO CHANGE |
| z-20 | Hero secondary image | Overlapping photo | NO CHANGE |
| z-20 | Form success overlay | Above form glass | NO CHANGE |
| z-30 | Hero floating badges (2x) | Floating stat badges over images | NO CHANGE |
| z-40 | Mobile menu overlay | Above content | NO CHANGE (chrome) |
| z-50 | Header | Fixed nav | NO CHANGE (chrome) |
| z-50 | Sticky bar | Fixed bottom CTA | NO CHANGE (chrome) |
| -z-10 | CTA section decorative blob | Behind CTA content | NO CHANGE |

**Key insight:** backdrop-filter creates implicit stacking contexts. When liquid-card is applied to hero floating badges, each badge becomes a stacking context root. The existing z-10/z-20/z-30 layering in the hero section ALREADY handles this correctly -- the floating badges (z-30) are above both images (z-10, z-20). No z-index changes needed.

[VERIFIED: index.html source grep + liquid-glass.css stacking context note]

### Mesh-bg Blob Compatibility

The mesh-bg blobs (3 colored gradient circles with blur-[120px]) sit at z-0 in a `fixed inset-0` container. There is also a frost overlay (`bg-white/40 backdrop-blur-[40px]`) in the same container. All `<main>` content sits at z-10+.

**Compatibility with glass surfaces:** The mesh blobs provide the colored background that makes backdrop-filter glass surfaces look good -- they create the tinted blur effect. Adding liquid-card/liquid-regular to content cards will actually IMPROVE the visual result because the design system glass recipe (--liquid-bg, --liquid-blur-md, --liquid-saturate) is tuned for this exact scenario.

**No changes needed to mesh-bg.** It remains untouched.

[VERIFIED: index.html lines 160-165, mesh-bg at z-0 with frost overlay]

### Icon Chip Rotate Resolution

index.html has 15 icon chips with `group-hover:rotate-3` (hover rotation animation). From squircles.css anti-patterns:

> NEVER apply squircle to rotating elements. mask-image distorts during CSS transform: rotate(). Keep border-radius for those.

**Resolution:** Icon chips that rotate on hover keep their current `rounded-2xl` or `rounded-[1.5rem]` border-radius. Do NOT apply squircle-md to these elements. Apply squircle-md only to STATIC icon containers (if any exist without rotate).

Where these 15 rotating icons appear:
- Section 2 (Services): 3 floating icons in service card images -- `group-hover:rotate-3`
- Section 3 (Problem): 4 icon boxes -- `group-hover:rotate-3`
- Section 4 (How It Works): 4 step number boxes -- `group-hover:rotate-3`
- Section 5 (Why Us): 4 advantage icon boxes -- `group-hover:rotate-3`

**All 15 icon chips KEEP their border-radius. No squircle applied.** This is the correct resolution per the design system's own anti-pattern documentation.

[VERIFIED: squircles.css anti-pattern rule + grep count of 15 group-hover:rotate-3 in main]

### Anti-Patterns to Avoid
- **Nested glass:** NEVER put liquid-card inside liquid-card. Double backdrop-filter kills readability. [VERIFIED: liquid-glass.css]
- **Squircle on rotating elements:** mask-image distorts during CSS rotation transforms. [VERIFIED: squircles.css]
- **box-shadow + mask-image on same element:** Shadow gets clipped. Use shadow-wrap pattern. [VERIFIED: squircles.css]
- **Shimmer on non-hero elements:** Max 1 shimmer-sweep per viewport. [VERIFIED: liquid-glass.css]
- **border on masked glass:** Borders are clipped by mask-image. Use inset box-shadow instead. [VERIFIED: squircles.css]
- **Modifying chrome partials:** Header, footer, mobile-menu, sticky-bar are BUILD-spliced from partials/. Do NOT edit them in index.html -- changes are overwritten by `make build`. [VERIFIED: BUILD markers in source]
- **Using max-w-content:** Token does not work. Use max-w-[1200px] instead. [Per additional context directive]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glass material | Manual bg-white/60 + backdrop-blur + border | .liquid-card or .liquid-regular | Consistent recipe, dark mode auto, print/reduced-motion handled |
| Squircle shape | Manual rounded-[3rem] | .squircle-xl (.squircle-lg, .squircle-md) | Superellipse mask + PE for Chrome 139+ |
| Card shadows through mask | box-shadow on masked element | .liquid-card-wrap wrapper | Shadow gets clipped by mask-image without wrapper |
| Stats grouped glass | Individual card glass per stat | .stats-glass on wrapper | DIFF-02 specification: single grouped backdrop |
| CTA shimmer | Custom hover animation | .shimmer-sweep | Tuned for CA 45+ -- max 1 per viewport |
| Button material | Manual gradient + shadow | .liquid-btn-primary / .liquid-btn-secondary | Consistent press/hover states, specular edge |

## Common Pitfalls

### Pitfall 1: Forgetting liquid-card-wrap on cards with shadows
**What goes wrong:** Cards with squircle mask have their box-shadow clipped to mask silhouette, appearing as thin arcs instead of continuous shadow.
**Why it happens:** mask-image clips everything including box-shadow.
**How to avoid:** Every card that needs outer shadow must use the wrapper pattern: `<div class="liquid-card-wrap"><div class="liquid-card squircle-xl">`.
**Warning signs:** Cards with no visible shadow, or shadow that appears as thin lines at corners.

### Pitfall 2: Applying squircle to rotating icon chips
**What goes wrong:** mask-image distorts during CSS transform: rotate(), creating visual artifacts on hover.
**Why it happens:** The SVG mask is applied at rasterization time and does not re-compute during animation.
**How to avoid:** Keep border-radius on all 15 icon chips with group-hover:rotate-3.
**Warning signs:** Icon boxes that look distorted on hover.

### Pitfall 3: Editing chrome sections in index.html
**What goes wrong:** `make build` overwrites header/footer/mobile-menu/sticky-bar sections with partial content.
**Why it happens:** BUILD:header/footer/mobile-menu/sticky-bar markers define splicer zones.
**How to avoid:** Only edit content between `</main>` is the boundary. The chrome is managed by partials. Edit only within `<main>...</main>`.
**Warning signs:** Changes to header/footer disappearing after build.

### Pitfall 4: Stats bar -- individual glass on stat cells
**What goes wrong:** Using liquid-card on individual stat cells creates double glass if parent has stats-glass.
**Why it happens:** Nested backdrop-filter.
**How to avoid:** Stats bar uses ONE stats-glass squircle-xl wrapper. Individual stat cells are transparent (no glass, no backdrop-filter).
**Warning signs:** Stats section looking overly blurred or milky.

### Pitfall 5: Protected legacy deletion
**What goes wrong:** nbsp entities, ARIA attributes, honeypot fields, or br tags get removed during class replacement.
**Why it happens:** Overzealous find-and-replace or line deletion.
**How to avoid:** Count before and after: nbsp=83, visually-hidden=2, role="alert"=4, aria-live=4, honeypot=3 (contact-website references), br hidden md:block=1, text-wrap:balance=0.
**Warning signs:** Counts don't match after migration.

### Pitfall 6: Hero floating cards losing position
**What goes wrong:** Adding liquid-card-wrap to floating badges changes their absolute positioning.
**Why it happens:** The wrapper div takes the position and the inner element becomes relative.
**How to avoid:** Apply positioning classes (absolute, z-30, top/left/right) to the wrapper div, and glass + squircle to the inner element. Or: use liquid-regular squircle-lg on the badge directly (no shadow-wrap needed for small badges that can use inset shadows only).
**Warning signs:** Floating badges misaligned or stacked incorrectly.

## Code Examples

### Full Section Migration Example (Services Section)

```html
<!-- BEFORE -->
<section class="py-16 relative z-10" id="services">
  <div class="container mx-auto px-4 lg:px-6">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="relative group h-full flex flex-col">
        <div class="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 hover:-translate-y-2 h-full flex flex-col overflow-hidden">
          <!-- card content -->
        </div>
      </div>
    </div>
  </div>
</section>

<!-- AFTER -->
<section class="py-16 relative z-10" id="services">
  <div class="mx-auto max-w-[1200px] px-4 lg:px-6">
    <div class="grid grid-cols-12 gap-8">
      <div class="md:col-span-4 lg:col-span-4 relative group h-full flex flex-col">
        <div class="liquid-card-wrap h-full">
          <div class="liquid-card squircle-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col overflow-hidden">
            <!-- card content unchanged -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```
[VERIFIED: Phase 46 proven pattern]

### Hero Floating Badge Example

```html
<!-- BEFORE -->
<div class="absolute -right-6 top-1/4 bg-white/70 backdrop-blur-[40px] p-4 rounded-[2rem] shadow-glass border border-glass-border-strong z-30 flex items-center gap-4">

<!-- AFTER -- liquid-regular (no shadow-wrap needed for small badge with inset shadows) -->
<div class="absolute -right-6 top-1/4 liquid-regular squircle-lg p-4 z-30 flex items-center gap-4">
```
[ASSUMED -- exact treatment is Claude's discretion per CONTEXT.md]

### Stats Bar Migration Example

```html
<!-- BEFORE -->
<section class="relative py-12 z-20">
  <div class="container mx-auto px-4 lg:px-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="relative group flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass ...">
        <div class="text-5xl ...">43</div>
        <div class="text-mu-text-700 ...">клиники</div>
      </div>
      <!-- 3 more stat cards -->
    </div>
  </div>
</section>

<!-- AFTER -->
<section class="relative py-12 z-20">
  <div class="mx-auto max-w-[1200px] px-4 lg:px-6">
    <div class="stats-glass squircle-xl">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="flex flex-col items-center justify-center p-8">
          <div class="text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-sm text-mu-accent-blue-text">43</div>
          <div class="text-mu-text-700 font-bold text-lg text-center uppercase tracking-wider">клиники</div>
        </div>
        <!-- 3 more stat cells -- no individual glass -->
      </div>
    </div>
  </div>
</section>
```
[VERIFIED: checkup.html stats pattern from 46-01-SUMMARY]

## Protected Legacy Baseline Counts

These counts MUST be preserved after migration (verified before changes):

| Item | Count | Verification Command |
|------|-------|---------------------|
| `&nbsp;` entities | 83 | `grep -c '&nbsp;' index.html` |
| `visually-hidden` (honeypot) | 2 | `grep -c 'visually-hidden' index.html` |
| `role="alert"` | 4 | `grep -c 'role="alert"' index.html` |
| `aria-live` | 4 | `grep -c 'aria-live' index.html` |
| honeypot field (contact-website) | 3 references | `grep -c 'contact-website' index.html` |
| `br` hidden/block | 1 | `grep -c 'hidden md:block\|md:hidden' index.html` |
| `text-wrap: balance` | 0 (must remain 0) | `grep -c 'text-balance\|text-wrap.*balance' index.html` |

[VERIFIED: grep counts from index.html]

## GRID-02 Cross-Page Verification

GRID-02 requires text-bearing cards to occupy minimum 4 columns on tablet (768px) across ALL 6 pages. After index migration, a verification pass is needed:

| Page | md:col-span-4 Count | Status |
|------|---------------------|--------|
| checkup.html | 38 | Already migrated [VERIFIED] |
| online-consultations.html | 19 | Already migrated [VERIFIED] |
| treatment-abroad.html | 20 | Already migrated [VERIFIED] |
| contacts.html | 2 | Already migrated [VERIFIED] |
| 404.html | 0 (no grid cards) | N/A [VERIFIED] |
| index.html | 0 (pre-migration) | NEEDS MIGRATION |

After index migration, verify that all text-bearing card grids use md:col-span-4 (or wider) to ensure Russian compound words don't overflow at 768px.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | make build (Tailwind CLI + splicer pipeline) |
| Config file | Makefile |
| Quick run command | `make build` |
| Full suite command | `make build` + protected legacy grep checks |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MIGRATE-06 | index.html migrated to v4.0 | smoke | `make build && grep -c 'squircle-' index.html` | N/A (grep) |
| MIGRATE-06 | No old rounded-[/2xl/3xl in main | smoke | `sed -n '/<main/,/<\/main>/p' index.html \| grep -c 'rounded-\['` should be 0 | N/A |
| MIGRATE-06 | No container mx-auto in main | smoke | `sed -n '/<main/,/<\/main>/p' index.html \| grep -c 'container mx-auto'` should be 0 | N/A |
| MIGRATE-06 | Protected legacy preserved | unit | grep counts for nbsp, ARIA, honeypot | N/A |
| MIGRATE-06 | Stats bar uses stats-glass | smoke | `grep -c 'stats-glass' index.html` >= 1 | N/A |
| MIGRATE-06 | Shimmer on hero CTA | smoke | `grep -c 'shimmer-sweep' index.html` >= 1 | N/A |
| GRID-02 | Text cards min 4 cols | manual | Browser resize to 768px on all 6 pages | N/A |

### Sampling Rate
- **Per task commit:** `make build`
- **Per wave merge:** `make build` + full protected legacy grep suite
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
None -- existing build infrastructure covers all phase requirements.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Column spans recommended (hero 7+5, services 3x4, etc.) are optimal for content | Architecture Patterns | Low -- column spans are Claude's discretion per CONTEXT.md; visual verification catches issues |
| A2 | Hero floating badges use liquid-regular squircle-lg (no shadow-wrap) | Code Examples | Low -- if shadow is needed, add liquid-card-wrap wrapper with absolute positioning on wrapper |

## Open Questions

1. **Hero image frame treatment**
   - What we know: Main hero image has `rounded-[3rem]` with `border-[8px] border-white/40 backdrop-blur-3xl` and shadow. Secondary image similar.
   - What's unclear: Whether these should get squircle-xl treatment or keep rounded-[3rem] (they are not glass cards, they are image frames)
   - Recommendation: Apply squircle-xl to image frames for consistency. The images have overflow-hidden so mask clips correctly. No shadow-wrap needed if using inset shadows only.

2. **Why Us image collage (Section 5)**
   - What we know: 4 images in a 2x2 grid with `rounded-[3rem]` and `border-[6px] border-white/50`
   - What's unclear: Whether these decorative image containers should get liquid-card treatment
   - Recommendation: Apply squircle-xl to image frames for shape consistency. No glass needed (they are pure image containers, not text cards).

3. **CTA section (Section 11) inner decorative blob**
   - What we know: Has `bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply` decorative element
   - What's unclear: Whether this conflicts with glass surfaces
   - Recommendation: Keep as-is. It sits at -z-10 behind the content and provides visual depth through the glass. Same principle as mesh-bg blobs.

## Sources

### Primary (HIGH confidence)
- [liquid-glass.css] - All glass material classes, anti-patterns, shadow-wrap pattern, stacking context behavior
- [squircles.css] - All squircle classes, three-tier degradation, anti-pattern for rotating elements
- [index.html] - Full 1173-line source analysis with section mapping and class inventory
- [Phase 46-01-SUMMARY] - Proven migration pattern (checkup.html: 102 squircle, 44 liquid-card, 13 max-w-[1200px])
- [Phase 46-VERIFICATION] - Verification methodology and grep-based automated checks

### Secondary (MEDIUM confidence)
- [Phase 45 summaries] - 404 + contacts migration patterns (simpler pages)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all CSS classes verified in source files
- Architecture: HIGH - section map verified against index.html source, patterns proven in Phase 46
- Pitfalls: HIGH - all pitfalls derived from verified anti-pattern docs in CSS source files
- Column spans: MEDIUM - reasonable defaults based on Phase 46 patterns, but visual verification needed

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- CSS classes won't change mid-milestone)
