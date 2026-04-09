---
phase: 42-squircle-primitives
reviewed: 2026-04-09T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/styles/squircles.css
  - src/styles/tailwind.css
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 42: Code Review Report

**Reviewed:** 2026-04-09
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Two files reviewed: `src/styles/squircles.css` (the squircle primitive classes) and `src/styles/tailwind.css` (the import entry point). The squircle implementation is well-structured and follows the documented three-tier degradation strategy correctly. Token references match what is declared in `theme.css`. The shadow-wrap pattern and anti-patterns are clearly documented.

Two warnings found — one correctness issue with the `@supports` block silently swallowing the `border-radius` fallback values, and one potential mask rendering issue on non-square aspect ratios. Three info items cover the `squircle-full` `border-radius` value, an undocumented `mask-repeat` omission, and the Tailwind entry file's lack of an index comment.

---

## Warnings

### WR-01: `@supports` block removes mask but preserves fallback `border-radius` — creates visual inconsistency

**File:** `src/styles/squircles.css:95-104`

**Issue:** Inside the `@supports (corner-shape: superellipse(2))` block, `mask-image: none` is correctly cleared, and `corner-shape: superellipse(2)` is applied. However, the base `border-radius` values from the tier-3 fallback rules (16px / 24px / 40px / 9999px) are still in effect — they are not reset to `0` or overridden. On Chrome 139+, the element now has *both* `corner-shape: superellipse(2)` AND a non-zero `border-radius`. The spec for `corner-shape` requires `border-radius` to define the *magnitude* of the superellipse curve, so keeping the fallback values is intentional and correct per the spec. However, this is not documented and is a silent coupling: if the fallback `border-radius` values are changed in the future for visual reasons (tier-3 adjustment), it will inadvertently reshape the tier-1 superellipse. The relationship must be explicit.

**Fix:** Add a comment in the `@supports` block making the dependency explicit:

```css
@supports (corner-shape: superellipse(2)) {
  /* border-radius from the base rule is intentionally preserved:
     corner-shape uses it as the curve magnitude for the superellipse.
     Changing base border-radius values will affect Tier 1 shape too. */
  .squircle-md,
  .squircle-lg,
  .squircle-xl,
  .squircle-full {
    -webkit-mask-image: none;
            mask-image: none;
    corner-shape: superellipse(2);
  }
}
```

---

### WR-02: `mask-size: 100% 100%` without explicit `mask-repeat: no-repeat` — mask may tile on some engines

**File:** `src/styles/squircles.css:64-65` (and parallel lines 72-73, 80-81)

**Issue:** `mask-size: 100% 100%` stretches the SVG mask to fill the element, which is the correct intent. However, the default value of `mask-repeat` is `repeat` in the CSS Masking spec. When `mask-size` exactly equals the element dimensions (100% 100%), tiling is harmless — but this is a fragile assumption. If any browser or rendering engine rounds fractional dimensions differently (e.g., sub-pixel sizing), a second tile can bleed in at the edge, producing a faint artifact line. Defensive CSS practice requires `mask-repeat: no-repeat` alongside `mask-size`.

**Fix:** Add `mask-repeat` to all three squircle size classes:

```css
.squircle-md {
  border-radius: 16px;
  -webkit-mask-image: var(--squircle-mask-md);
          mask-image: var(--squircle-mask-md);
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
}
```

Apply the same pattern to `.squircle-lg` and `.squircle-xl`.

---

## Info

### IN-01: `squircle-full` uses `border-radius: 9999px` but a circle requires `border-radius: 50%`

**File:** `src/styles/squircles.css:85`

**Issue:** The comment on line 87 states "at full radius, squircle = circle." For a true circle, `border-radius: 50%` is the semantically correct value — it adapts to any aspect ratio. `9999px` achieves a pill/stadium shape on wide elements (e.g., full-width buttons) but degrades to a circle only on square elements. If `.squircle-full` is ever used on a non-square element, the intent ("circle") breaks. This is a low risk given current usage patterns (likely avatar/icon), but worth aligning the code with the documented intent.

**Fix:** Change `border-radius: 9999px` to `border-radius: 50%` if the semantic intent is specifically "circle." Keep `9999px` (or document it as `pill`) if pill-shaped containers are in scope.

---

### IN-02: `tailwind.css` lacks an `@source` comment explaining the `source(none)` override

**File:** `src/styles/tailwind.css:2-3`

**Issue:** `@import 'tailwindcss' source(none)` disables Tailwind's automatic source detection, replaced by the explicit `@source '../../*.html'`. This is correct for a multi-page HTML site but the single-level glob (`*.html`) only matches HTML files at the project root — not files in subdirectories. If pages are ever organized into subdirectories (e.g., `pages/`), Tailwind will silently stop scanning them and utility classes will be purged from the output. There is no comment explaining the intentional scope.

**Fix:** Add a comment and consider whether a recursive glob is needed:

```css
/* Tailwind scans only root-level HTML files.
   If pages move to subdirectories, update to '../../**/*.html' */
@import 'tailwindcss' source(none);
@source '../../*.html';
```

---

### IN-03: Phase 42 import comment in `tailwind.css` ties a source-of-truth file to a planning phase number

**File:** `src/styles/tailwind.css:5`

**Issue:** The inline comment `/* Phase 42: squircle primitives */` next to the `@import './squircles.css'` line is a planning-phase reference embedded in a permanent source file. Phase numbers are ephemeral (planning artifacts); the source file will outlive the planning phase. Future maintainers will not have context for what "Phase 42" means without consulting planning docs.

**Fix:** Replace with a functional comment describing what the import provides:

```css
@import './squircles.css';  /* Squircle mask primitives (md, lg, xl, full) */
```

---

_Reviewed: 2026-04-09_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
