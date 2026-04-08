# Phase 38: Vertical Rhythm & Section Sizing - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning — RESEARCH-FIRST (draft tokens in research/SUMMARY.md)
**Mode:** Final phase of v3.1

<domain>
## Phase Boundary

Eliminate the 4-strategy hero-class drift across pages by introducing `svh`-based hero tokens (rich/medium/compact tiers) in `theme.css`, replacing `<body class="min-h-screen">` with a page-shell flex wrapper, and migrating all 5 production pages to content-density-tier tokens. Verified empirically across 9 viewports (320-1920).

</domain>

<decisions>
## Implementation Decisions

### Mandatory prerequisite spike: Tailwind v4 token-to-utility smoke test (RHYTHM-03)

BEFORE any markup migration:
1. Add a single test token to `src/styles/theme.css`:
   - In `:root`: `--section-h-test: 50svh;`
   - In `@theme inline`: `--height-section-test: var(--section-h-test);`
2. Rebuild CSS: `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`
3. Verify the utility class generates: `grep '\.min-h-section-test\|\.h-section-test' css/styles.css`
4. If utility is present → tokens work, proceed with bulk migration
5. If utility is missing → debug token syntax; possible causes: incorrect `@theme inline` naming, Tailwind version mismatch. Do NOT proceed with migration until resolved.
6. After verification, remove the test token + rebuild.

### Canonical token values (from research/SUMMARY.md, MEDIUM confidence — verify empirically)

**`:root` additions:**
```css
--section-h-hero-rich: clamp(560px, 75svh, 760px);   /* index, online-consultations */
--section-h-hero-medium: clamp(500px, 65svh, 700px); /* treatment-abroad, checkup */
--section-h-hero-compact: clamp(440px, 55svh, 580px); /* contacts, 404 */
--section-pt: 8rem;     /* current pt-32 */
--section-pt-lg: 10rem; /* current lg:pt-40 */
--section-pb: 4rem;     /* current pb-16 */
```

**`@theme inline` additions:**
```css
--height-section-hero-rich: var(--section-h-hero-rich);
--height-section-hero-medium: var(--section-h-hero-medium);
--height-section-hero-compact: var(--section-h-hero-compact);
--spacing-section-pt: var(--section-pt);
--spacing-section-pt-lg: var(--section-pt-lg);
--spacing-section-pb: var(--section-pb);
```

Follows existing `--mu-*` → `--color-mu-*` two-layer pattern (verified at theme.css:3 + :128).

### Hero → token mapping (content-density tiers)

- **Rich tier** (rich hero content, illustration, stats): `index.html`, `online-consultations.html`
- **Medium tier** (page-specific content, moderate density): `treatment-abroad.html`, `checkup.html`
- **Compact tier** (minimal content like contacts form, 404): `contacts.html`, `404.html`

Each hero section class changes:
- **Before (varies):** `min-h-screen pt-32 pb-16 lg:pt-40` OR `min-h-[80vh] pt-32 pb-16 lg:pt-40` OR just `pt-32 pb-16`
- **After (rich):** `min-h-section-hero-rich pt-section-pt pb-section-pb lg:pt-section-pt-lg`
- **After (medium):** `min-h-section-hero-medium pt-section-pt pb-section-pb lg:pt-section-pt-lg`
- **After (compact):** `min-h-section-hero-compact pt-section-pt pb-section-pb lg:pt-section-pt-lg`

### Body `<body class="min-h-screen">` → page-shell flex wrapper (CRIT-08, MOD-24)

Current on all 6 pages: `<body class="relative min-h-screen bg-mu-text-50 selection:bg-mu-blue/30 selection:text-mu-text-900 overflow-x-hidden">`

Change to:
```html
<body class="relative bg-mu-text-50 selection:bg-mu-blue/30 selection:text-mu-text-900 overflow-x-hidden">
  <div class="page-shell flex flex-col min-h-[100dvh]">
    <!-- everything that was previously direct children of body -->
  </div>
</body>
```

AND:
- The `<header>` stays inside the page-shell div (currently is, via `position: fixed`)
- The `<main id="page-content" class="flex-1 ...">` gets `flex-1` added
- The `<footer>` stays inside the page-shell div
- The `<div id="sticky-bar">` stays inside the page-shell div (position: fixed)

Alternative simpler approach: Just remove `min-h-screen` from body (no wrapper div). The page content already sizes itself naturally; removing body's min-h eliminates the body-hero height competition. Footer still visually works because it's always at the bottom of content.

**Recommended:** Start with simpler approach (remove `min-h-screen` from body, no wrapper div). If viewport verification shows issues (footer floating), switch to the flex-wrapper approach.

### Smooth-scroll anchor + reduced-motion (RHYTHM-06, RHYTHM-07)

Add to `src/styles/theme.css` (at `@layer base` or inline in `:root` context):

```css
section[id], h1[id], h2[id], h3[id] {
  scroll-margin-top: 6rem; /* ~96px, matches header height */
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### Scroll-reveal rootMargin (RHYTHM-08)

Find `animations.js` or wherever Motion `inView` is called. Change default rootMargin to `'-100px 0px -100px 0px'` so animations fire when content is genuinely visible.

### Cyrillic typography (RHYTHM-09)

Verify existing hero H1 max-widths. If any use `max-w-none` or no max-width, add `max-w-[55ch]` for Russian text density. Visual-only; no behavioral change.

### Viewport verification (RHYTHM-10)

Manual visual check across 320, 360, 390, 412, 768, 1024, 1280, 1440, 1920. Document result in SUMMARY.md. Note: browser devtools can simulate; no Playwright automation available in this project.

### Counter animation sessionStorage (RHYTHM-12)

Find the counter animation init (likely in `js/main.js` around line 457 per prior research). Wrap the animation logic to check `sessionStorage.getItem('counters-animated') === '1'` before running. After running, set it. This prevents re-animation on SPA navigation.

### Claude's Discretion
- Whether to use flex page-shell wrapper vs simple body min-h-screen removal — decide after viewport check
- Exact `scroll-margin-top` value (6rem matches header) — tune if needed
- Whether RHYTHM-09 max-w-[55ch] applies to H1 only or also subtitle — hero-specific decision

</decisions>

<code_context>
## Existing Code Insights

### Files touched
- `src/styles/theme.css` — add tokens to `:root` and `@theme inline`, plus `@layer base` for scroll-margin
- `css/styles.css` — regenerated via Tailwind CLI rebuild
- All 6 HTML files — body class change, hero section class change
- `js/main.js` — counter animation sessionStorage (RHYTHM-12)
- `js/animations.js` — scroll-reveal rootMargin (RHYTHM-08)

### Reusable patterns
- theme.css `:root` + `@theme inline` two-layer pattern is the project convention (verified)
- `--mu-green-600`, `--mu-blue-text`, etc. tokens already exist — use them if needed

### Reality checks
- `js/router.js` swaps `#page-content` on SPA nav — `flex-1` must remain on the page-content element via the canonical normalized pages
- Hero classes on online-consultations.html and treatment-abroad.html do NOT have min-h at all (use just `pt-32 pb-16`) — these pages need min-h added during migration
- 404.html has `min-h-[80vh]` on `<main>` not on a hero section — may need special handling in the page-shell wrapper

</code_context>

<specifics>
## Specific Ideas

- SMOKE TEST FIRST — no bulk migration without token-to-utility verification
- Use `svh` exclusively for hero heights (CRIT-07)
- Use `100dvh` on the page-shell wrapper (it's the outer container that should match visible viewport)
- Content-density tiers must match actual page content — rich/medium/compact per PROJECT.md hero classification

</specifics>

<deferred>
## Deferred Ideas

- Full Playwright-based viewport regression test (not available in this project)
- Per-section rhythm tokens beyond hero (Phase 38 focuses on hero + page-shell; other sections keep their existing padding)
- Responsive max-width tokens for Russian text (RHYTHM-09 is manual per page)

</deferred>
