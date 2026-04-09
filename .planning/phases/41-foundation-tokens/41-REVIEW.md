---
phase: 41-foundation-tokens
reviewed: 2026-04-09T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/styles/theme.css
  - css/styles.css
findings:
  critical: 0
  warning: 3
  info: 2
  total: 5
status: issues_found
---

# Phase 41: Code Review Report

**Reviewed:** 2026-04-09
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

`src/styles/theme.css` (422 lines) is the source; `css/styles.css` is the compiled Tailwind v4 output (single minified line, ~70 KB). No security issues. No logic crashes. Three actionable warnings in the token definitions: two in the green color scale (duplicate/inverted values) and one around a duplicate token declaration with a misleading comment. Two info-level items flag dead tokens and a confusing auto-generated class name.

The glassmorphism shadow utilities (`shadow-glass-*`), reduced-motion block, focus-visible styles, font-face declarations, and vertical rhythm tokens all compile and resolve correctly.

---

## Warnings

### WR-01: Green scale stops 200 and 300 share the same hex value

**File:** `src/styles/theme.css:15-16`
**Issue:** `--mu-green-200` and `--mu-green-300` are both `#A6EECB`. The distinction between these two stops is non-functional — any component that uses `-200` gets exactly the same color as `-300`. This is a latent confusion bug: a developer choosing a lighter shade will unknowingly get an identical result.

**Fix:**
```css
/* Assign a distinct lighter value to -200 */
--mu-green-200: #C3F4DA;   /* lighter than 300 */
--mu-green-300: #A6EECB;   /* unchanged */
```

---

### WR-02: Green scale inverted at 600/700/900 — two duplicate values, one lighter stop above a darker one

**File:** `src/styles/theme.css:19-21`
**Issue:** Three problems in the dark end of the green ramp:
- `--mu-green-600: #35B678` and `--mu-green-900: #35B678` are identical values — two stops resolve to the same color.
- `--mu-green-700: #4BCA8C` is **lighter** than `--mu-green-600: #35B678`, inverting the expected convention (higher number = darker/more saturated).

Any component relying on 700 being darker than 600 will render incorrectly. The 900 stop is entirely redundant.

**Fix:**
```css
/* Restore monotonic darkening: 600 < 700 < 900 */
--mu-green-600: #35B678;   /* mid-dark (unchanged) */
--mu-green-700: #2A9C65;   /* darker than 600 */
--mu-green-900: #1F7A4F;   /* darkest (can reuse --mu-green-text value) */
```
If the current `#4BCA8C` value is actually needed, assign it to a lower stop (e.g. `-500` or `-400`) where a lighter shade belongs.

---

### WR-03: `--container-content` declared twice; comment claims a utility that is never generated

**File:** `src/styles/theme.css:103` and `src/styles/theme.css:293-294`

**Issue — duplicate declaration:**
`--container-content: 1200px` is defined once in the raw `:root` block (line 103) and again inside `@theme inline` (line 294). The compiled output contains only one instance of `--container-content:1200px` in `:root`, meaning the two declarations silently collapse. The source of truth is ambiguous.

**Issue — incorrect comment:**
Line 293 reads `/* v4.0: Grid foundation -- generates max-w-content utility */`. This is wrong. In Tailwind v4, `--container-*` tokens inside `@theme inline` define **named container query breakpoints** (for `@container` queries), not `max-w-*` width utilities. Verified in compiled output: no `.max-w-content` class exists, and `1200px` does not appear as any `max-width` value.

To generate a `max-w-content` utility, the token must be placed under `--max-width-*` or `--width-*` in `@theme inline`.

**Fix:**
```css
/* Remove the raw :root declaration on line 103 (keep @theme inline as single source) */

/* In @theme inline — to generate .max-w-content: */
--max-width-content: 1200px;   /* replaces --container-content */

/* Keep --grid-gutter-* in :root or rename to --spacing-gutter-* directly in @theme */
```
If `@container content { ... }` queries are intended, keep `--container-content` but remove the duplicate `:root` declaration and correct the comment.

---

## Info

### IN-01: Four dead tokens in `@theme inline` never appear in compiled output

**File:** `src/styles/theme.css:281-284`

**Issue:** These four tokens are inside `@theme inline` but Tailwind v4 does not recognize the `border-glass` and `border-glass-strong` namespaces for utility generation. None of them appear anywhere in `css/styles.css` — not in `:root`, not as utilities.

```css
--border-glass: 1px solid rgba(255, 255, 255, 0.6);         /* dead */
--border-glass-strong: 1px solid rgba(255, 255, 255, 0.8);  /* dead */
--border-glass-color: rgba(255, 255, 255, 0.6);             /* dead */
--border-glass-strong-color: rgba(255, 255, 255, 0.8);      /* dead */
```

The active tokens serving the same purpose are `--color-glass-border` and `--color-glass-border-strong` on lines 286-287, which correctly generate `.border-glass-border` and `.border-glass-border-strong` utilities.

**Fix:** Remove lines 281-284 entirely. They add noise and may mislead a developer into thinking `var(--border-glass)` is available as a CSS variable in HTML.

---

### IN-02: Auto-generated class name `border-glass-border` is redundant

**File:** `src/styles/theme.css:286-287`

**Issue:** `--color-glass-border` in `@theme inline` generates the utility class `.border-glass-border`. The double-word "border-border" is a naming smell. Confirmed in compiled output:

```css
.border-glass-border { border-color: #fff9 }
.border-glass-border-strong { border-color: #fffc }
```

**Fix:** Rename the tokens to avoid the redundancy:
```css
/* Option A — results in .border-glass and .border-glass-strong */
--color-glass: rgba(255, 255, 255, 0.6);
--color-glass-strong: rgba(255, 255, 255, 0.8);

/* Option B — results in .border-glass-white and .border-glass-white-strong */
--color-glass-white: rgba(255, 255, 255, 0.6);
--color-glass-white-strong: rgba(255, 255, 255, 0.8);
```
Note: renaming will break any HTML already using `.border-glass-border` (confirmed used in `contacts.html` and other pages), so do a project-wide find-and-replace at the same time.

---

_Reviewed: 2026-04-09_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
