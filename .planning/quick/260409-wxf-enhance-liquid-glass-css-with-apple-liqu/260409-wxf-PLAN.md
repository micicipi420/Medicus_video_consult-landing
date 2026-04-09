---
phase: quick
plan: 260409-wxf
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/squircles.css
  - src/styles/liquid-glass.css
  - css/styles.css
autonomous: true
requirements: []
must_haves:
  truths:
    - "Chrome 139+ uses native corner-shape: squircle with correct per-class border-radius instead of SVG masks"
    - "Older browsers still render squircle shapes via SVG mask-image fallback"
    - "Glass cards have isolation: isolate for explicit stacking context control"
    - "Liquid-card has a subtle specular highlight on top-left corner via ::after"
    - "Users with prefers-reduced-transparency get opaque backgrounds and no backdrop-filter"
    - "Browsers without backdrop-filter support get a solid semi-transparent fallback"
    - "Dark mode suppresses or reduces the specular highlight"
  artifacts:
    - path: "src/styles/squircles.css"
      provides: "Progressive enhancement @supports block with corner-shape: squircle"
      contains: "corner-shape: squircle"
    - path: "src/styles/liquid-glass.css"
      provides: "Specular highlights, isolation, and accessibility fallbacks"
      contains: "prefers-reduced-transparency"
    - path: "css/styles.css"
      provides: "Rebuilt Tailwind output with all CSS changes"
  key_links:
    - from: "src/styles/squircles.css"
      to: "css/styles.css"
      via: "Tailwind CLI build"
      pattern: "corner-shape.*squircle"
    - from: "src/styles/liquid-glass.css"
      to: "css/styles.css"
      via: "Tailwind CLI build"
      pattern: "prefers-reduced-transparency"
---

<objective>
Apply 5 Apple Liquid Glass research improvements to the existing CSS system: native squircle progressive enhancement, specular highlights with stacking isolation, and accessibility fallbacks for reduced transparency and missing backdrop-filter support.

Purpose: Bring the liquid glass implementation closer to Apple's reference quality while improving accessibility for users who need reduced transparency or lack backdrop-filter support.
Output: Updated squircles.css, liquid-glass.css, and rebuilt css/styles.css.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/styles/squircles.css
@src/styles/liquid-glass.css
@src/styles/theme.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Progressive enhancement -- native corner-shape: squircle in squircles.css</name>
  <files>src/styles/squircles.css</files>
  <action>
Replace the existing `@supports (corner-shape: superellipse(2))` block (lines 115-124) with a new `@supports (corner-shape: squircle)` block. The `corner-shape: squircle` syntax is the simpler CSS alias that Chrome 139+ supports. The new block must target each squircle class individually with per-class border-radius values matching the SVG superellipse corner percentages from theme.css comments (md=6%, lg=7%, xl=8%).

For each of `.squircle-md`, `.squircle-lg`, `.squircle-xl`:
- Remove `-webkit-mask-image` and `mask-image` (set to `none`)
- Remove `-webkit-mask-size` and `mask-size` (set to `initial` or `unset`)
- Remove `-webkit-mask-repeat` and `mask-repeat` (set to `initial` or `unset`)
- Set `corner-shape: squircle`
- Set `border-radius` to the matching percentage: `6%` for md, `7%` for lg, `8%` for xl

For `.squircle-full`:
- Keep as-is inside the block (already `border-radius: 9999px`, no mask to remove)

Keep the existing SVG mask-image rules as the default (Tier 2 fallback) -- they remain untouched outside the `@supports` block.

Update the file's header comment: change "Progressive enhancement via corner-shape: superellipse(2)" to "Progressive enhancement via corner-shape: squircle".
  </action>
  <verify>
    <automated>grep -c "corner-shape: squircle" src/styles/squircles.css | grep -q "^[1-9]" && grep -c "border-radius: 6%" src/styles/squircles.css | grep -q "^[1-9]" && grep -c "border-radius: 7%" src/styles/squircles.css | grep -q "^[1-9]" && grep -c "border-radius: 8%" src/styles/squircles.css | grep -q "^[1-9]" && grep -c "mask-image: none" src/styles/squircles.css | grep -q "^[1-9]" && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>
- @supports block uses `corner-shape: squircle` (not superellipse(2))
- Each class has per-class border-radius: md=6%, lg=7%, xl=8%
- mask-image, mask-size, mask-repeat all removed (set to none/initial) inside @supports
- SVG mask fallback rules outside @supports remain untouched
- File header comment updated
  </done>
</task>

<task type="auto">
  <name>Task 2: Specular highlight + isolation in liquid-glass.css</name>
  <files>src/styles/liquid-glass.css</files>
  <action>
**Part A -- isolation: isolate**

Add `isolation: isolate;` to each of these selectors (add as the first property in each rule block, before `background`):
- `.liquid-regular` (Section 1)
- `.liquid-card` (Section 2)
- `.liquid-btn-secondary` (Section 3)
- `.stats-glass` (Section 4)

This creates explicit stacking contexts, giving precise z-index control for the ::after pseudo-element and preventing backdrop-filter bleed.

**Part B -- Specular highlight ::after on .liquid-card**

Add a new rule after the `.liquid-card` block (but before `.liquid-card-wrap`). Create `.liquid-card::after` with:
```css
.liquid-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 60% 50% at 25% 15%,
    rgba(255, 255, 255, 0.12),
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}
```

This simulates light catching the top-left corner of the glass surface. Max alpha is 0.12 -- subtle for the 45+ medical audience.

**Part C -- Dark mode suppression**

Add after Section 9 (section tints dark mode block), before Section 10 (reduced motion). Place it in the existing dark mode area:
```css
.dark .liquid-card::after {
  opacity: 0.4;
}
```

This reduces the specular highlight to near-invisible in dark mode where it would look unnatural against navy backgrounds.

**Important:** The `.liquid-card` rule itself does NOT have `position: relative` currently. Add `position: relative;` to `.liquid-card` so the `::after` pseudo-element anchors correctly. Place it before `background`.
  </action>
  <verify>
    <automated>grep -c "isolation: isolate" src/styles/liquid-glass.css | grep -q "^[4-9]" && grep -c "liquid-card::after" src/styles/liquid-glass.css | grep -q "^[1-9]" && grep -c "position: relative" src/styles/liquid-glass.css | grep -q "^[1-9]" && grep "dark.*liquid-card::after" src/styles/liquid-glass.css | grep -q "opacity" && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>
- isolation: isolate present on .liquid-regular, .liquid-card, .liquid-btn-secondary, .stats-glass (4 instances)
- .liquid-card has position: relative
- .liquid-card::after creates radial-gradient specular highlight at top-left, alpha max 0.12
- .dark .liquid-card::after reduces opacity to 0.4
- pointer-events: none prevents highlight from blocking clicks
  </done>
</task>

<task type="auto">
  <name>Task 3: Accessibility fallbacks + Tailwind rebuild</name>
  <files>src/styles/liquid-glass.css, css/styles.css</files>
  <action>
**Part A -- @media (prefers-reduced-transparency: reduce)**

Add a new Section 11 after Section 10 (reduced motion) in liquid-glass.css:
```css
/* ================================================
   Section 11 -- Reduced transparency
   For users who prefer less transparency (e.g., macOS
   "Reduce transparency" setting). Increases background
   opacity and disables backdrop-filter.
   ================================================ */

@media (prefers-reduced-transparency: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-btn-secondary,
  .stats-glass,
  html[data-refract="true"] .liquid-regular,
  html[data-refract="true"] .liquid-card,
  html[data-refract="true"] .stats-glass {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .dark .liquid-regular,
  .dark .liquid-card,
  .dark .liquid-btn-secondary,
  .dark .stats-glass {
    background: rgba(30, 40, 60, 0.85);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .liquid-card::after {
    display: none;
  }
}
```

**Part B -- @supports not (backdrop-filter: blur(1px))**

Add as Section 12, after Section 11:
```css
/* ================================================
   Section 12 -- No backdrop-filter support (~3%)
   Solid semi-transparent background fallback for
   browsers without backdrop-filter support.
   ================================================ */

@supports not (backdrop-filter: blur(1px)) {
  .liquid-regular,
  .liquid-card,
  .liquid-btn-secondary,
  .stats-glass {
    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: none;
  }

  .dark .liquid-regular,
  .dark .liquid-card,
  .dark .liquid-btn-secondary,
  .dark .stats-glass {
    background: rgba(30, 40, 60, 0.85);
    -webkit-backdrop-filter: none;
  }
}
```

**Part C -- Tailwind rebuild**

Run: `npx @tailwindcss/cli -i src/styles/tailwind.css -o css/styles.css --minify`

This rebuilds the compiled output with all CSS changes from Tasks 1-3.
  </action>
  <verify>
    <automated>grep -c "prefers-reduced-transparency" src/styles/liquid-glass.css | grep -q "^[1-9]" && grep -c "backdrop-filter: blur(1px)" src/styles/liquid-glass.css | grep -q "^[1-9]" && grep -c "Section 11" src/styles/liquid-glass.css | grep -q "^[1-9]" && grep -c "Section 12" src/styles/liquid-glass.css | grep -q "^[1-9]" && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>
- Section 11 (prefers-reduced-transparency) increases bg to 0.85 alpha, disables backdrop-filter for light and dark mode
- Section 12 (@supports not backdrop-filter) provides solid fallback for ~3% without support
- Both sections are after Section 10 (reduced motion)
- Specular highlight hidden in reduced-transparency mode
- css/styles.css rebuilt via Tailwind CLI with all changes
  </done>
</task>

</tasks>

<verification>
1. grep for "corner-shape: squircle" in squircles.css -- must exist
2. grep for "isolation: isolate" in liquid-glass.css -- must appear 4 times
3. grep for "prefers-reduced-transparency" in liquid-glass.css -- must exist
4. grep for "@supports not (backdrop-filter" in liquid-glass.css -- must exist
5. grep for "liquid-card::after" in liquid-glass.css -- must exist
6. css/styles.css rebuild completes without errors
7. All three source files parse as valid CSS (no unclosed braces)
</verification>

<success_criteria>
- squircles.css @supports block uses corner-shape: squircle with per-class border-radius (6%/7%/8%)
- liquid-glass.css has isolation: isolate on 4 glass classes
- liquid-glass.css has .liquid-card::after specular highlight with max 0.12 alpha
- liquid-glass.css has dark mode opacity reduction for specular highlight
- liquid-glass.css has Section 11 (reduced transparency) and Section 12 (no backdrop-filter fallback)
- css/styles.css rebuilt successfully
</success_criteria>

<output>
After completion, create `.planning/quick/260409-wxf-enhance-liquid-glass-css-with-apple-liqu/260409-wxf-SUMMARY.md`
</output>
