---
phase: css-audit
reviewed: 2026-04-09T12:00:00Z
depth: deep
files_reviewed: 7
files_reviewed_list:
  - css/styles.css
  - src/styles/fonts.css
  - src/styles/index.css
  - src/styles/tailwind.css
  - src/styles/theme.css
  - src/styles/squircles.css
  - src/styles/liquid-glass.css
findings:
  critical: 1
  warning: 8
  info: 13
  total: 22
status: issues_found
---

# CSS Audit: Full Codebase Review

**Reviewed:** 2026-04-09
**Depth:** deep (cross-file analysis with HTML cross-referencing)
**Files Reviewed:** 7 CSS source files, cross-referenced against 3 HTML files (index.html, checkup.html, contacts.html)
**Status:** issues_found

## Summary

The CSS architecture is well-structured with a clear separation: `fonts.css` (font-face declarations), `tailwind.css` (entry point with imports), `theme.css` (tokens + base layer), `squircles.css` (shape primitives), and `liquid-glass.css` (glass material system). The `css/styles.css` file is a generated Tailwind output (minified, 1 line) -- not a source file.

The main concerns are: (1) a significant amount of dead token weight from a React/shadcn migration that is no longer used, (2) a duplicate green color token with identical values, (3) anti-pattern violations in HTML where `border` is applied to squircle-masked elements, and (4) inconsistent form shadow tokens across pages.

---

## Critical Issues

### CR-01: `border` applied to squircle-masked elements (anti-pattern violation)

**File:** `index.html:343`, `index.html:348`, `index.html:364`, `index.html:397`, `index.html:400`, `index.html:413` (and 20+ more occurrences)
**Issue:** The squircles.css file header explicitly documents the anti-pattern: "NEVER apply border to a squircle element. Borders are clipped by mask-image. Use box-shadow: inset 0 0 0 1px <color> instead." However, throughout all three HTML files, `border border-glass-border` is used on elements that also have `squircle-full` or `squircle-md` classes. The CSS class `border-glass-border` maps to `--color-glass-border` which is defined in theme.css, but the `border` shorthand combined with mask-image will produce clipped borders that render incorrectly -- they get cut off at the mask boundary edge instead of showing a clean border.

This affects ~20 checkmark circles in index.html (service card feature lists) and icon containers that use `border border-glass-border squircle-full` or `squircle-md`.

**Fix:** Replace `border border-glass-border` with an inset box-shadow utility on all squircle elements:
```html
<!-- Before -->
<div class="squircle-full border border-glass-border ...">

<!-- After -->
<div class="squircle-full shadow-[inset_0_0_0_1px_var(--color-glass-border)] ...">
```

Or define a utility class in theme.css:
```css
.border-inset-glass {
  box-shadow: inset 0 0 0 1px var(--color-glass-border);
}
```

---

## Warnings

### WR-01: Duplicate green token values -- `--mu-green-200` and `--mu-green-300` are identical

**File:** `src/styles/theme.css:15-16`
**Issue:** Both `--mu-green-200: #A6EECB` and `--mu-green-300: #A6EECB` have the exact same hex value. This defeats the purpose of a color ramp -- adjacent steps should be visually distinct. Either one is a copy-paste error or the ramp was not finalized.
**Fix:** Differentiate the values. Typical green-200 would be lighter than green-300:
```css
--mu-green-200: #B8F2D6; /* lighter */
--mu-green-300: #A6EECB; /* current value */
```

### WR-02: `--mu-green-600` and `--mu-green-900` have identical values

**File:** `src/styles/theme.css:19,21`
**Issue:** `--mu-green-600: #35B678` and `--mu-green-900: #35B678` are the same color. The 900 step should be the darkest in the ramp. Meanwhile `--mu-green-700: #4BCA8C` is actually *lighter* than green-600, making the ramp non-monotonic (600 darker than 700).
**Fix:** Fix the green ramp to be monotonically darkening:
```css
--mu-green-600: #35B678;
--mu-green-700: #2D9E68; /* darker than 600 */
--mu-green-900: #1A6B42; /* darkest */
```

### WR-03: Inconsistent form shadow tokens across pages

**File:** `contacts.html:252,258,264,276` vs `index.html:1087,1093,1099,1111` vs `checkup.html:746,752,758,769`
**Issue:** contacts.html form inputs use `shadow-form-inset` (Tailwind utility mapped to `--shadow-form-inset` token from theme.css), but index.html and checkup.html form inputs use `shadow-glass-inner` (a different token with different shadow values). Both are inset shadows but have different visual weights. This creates inconsistent form appearance across pages.
**Fix:** Standardize on one shadow token for all form inputs. `shadow-form-inset` appears purpose-built for forms -- use it everywhere:
```html
<!-- Standardize all form inputs to use shadow-form-inset -->
class="... shadow-form-inset"
```

### WR-04: `--container-content` defined twice in theme.css

**File:** `src/styles/theme.css:103,302`
**Issue:** `--container-content: 1200px` is declared in `:root` (line 103) and again in `@theme inline` (line 302). The `@theme inline` version creates a Tailwind utility (`max-w-content`), but the `:root` declaration is redundant since the `@theme inline` block also sets the custom property. The duplicate could cause confusion about which is the source of truth.
**Fix:** Remove the `:root` declaration at line 103 since the `@theme inline` block at line 302 handles both the custom property and the Tailwind utility generation.

### WR-05: `--squircle-mask-full: none` is semantically misleading

**File:** `src/styles/theme.css:116`
**Issue:** The token `--squircle-mask-full` is set to `none`, and the `.squircle-full` class in squircles.css does not use a mask at all (only `border-radius: 9999px`). Having a token set to `none` in the mask system is confusing -- it suggests a mask is applied when it is not. This token is never referenced in any CSS or HTML file.
**Fix:** Remove `--squircle-mask-full` from theme.css. It serves no purpose and adds confusion. The comment in squircles.css already documents the rationale.

### WR-06: Hardcoded rgba shadow values in liquid-glass.css duplicate token system

**File:** `src/styles/liquid-glass.css:65,82,161`
**Issue:** `.liquid-regular` uses `0 8px 24px rgba(20, 30, 60, 0.12)` as its outer shadow, while `.liquid-card` and `.stats-glass` use `0 16px 40px rgba(20, 30, 60, 0.16)`. These shadow values are hardcoded inline rather than using the `--liquid-shadow-outer` token defined in theme.css (`0 16px 40px rgba(20, 30, 60, 0.16)`). This means `.liquid-regular` has a different shadow intensity than what the token system defines, and dark mode overrides only affect `--liquid-shadow-outer` but not these hardcoded values.
**Fix:** Use the token in all classes, or create tiered tokens:
```css
.liquid-regular {
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom),
    var(--liquid-shadow-outer);
}
```

### WR-07: Inline `<style>` blocks duplicated across all 3 HTML files

**File:** `index.html:27-60`, `checkup.html:27-60`, `contacts.html:26-56`
**Issue:** ~30 lines of CSS are copy-pasted into the `<style>` tag of every HTML file: `.header--scrolled`, `.mobile-menu-overlay`, `.is-invalid`, `.faq__answer`, `.form__success`, `.form__error`, `.form__field-error`, `.visually-hidden`, and `a[aria-current="page"]`. This is a maintenance burden -- any change must be made in 3+ places. These styles should be in the shared CSS source files.
**Fix:** Move these shared component styles into `src/styles/theme.css` (inside `@layer base` or a new `@layer components`), then remove the inline `<style>` blocks from all HTML files.

### WR-08: `border: none` is redundant in liquid-glass classes

**File:** `src/styles/liquid-glass.css:61,78,129,158`
**Issue:** `.liquid-regular`, `.liquid-card`, `.liquid-btn-secondary`, and `.stats-glass` all include `border: none`. The `@layer base` rule in theme.css already sets `* { border-color: var(--border) }` via `@apply border-border`, but no border-width is set by default in the base layer. These `border: none` declarations are defensive but add noise -- and they will override any intentional border added via Tailwind utilities on these elements, which could be confusing.
**Fix:** This is low-priority but worth noting. If the intent is to explicitly prevent borders (since borders are clipped by squircle masks), add a comment explaining why. Otherwise, remove the redundant declarations.

---

## Info

### IN-01: Massive dead token weight from shadcn/React migration

**File:** `src/styles/theme.css:60-97,146-195,241-278`
**Issue:** The following token families are defined in both `:root` and `.dark` but are never referenced in any HTML file or CSS utility class across the entire codebase: `--popover`, `--popover-foreground`, `--chart-1` through `--chart-5`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`, `--switch-background`, `--input-background` (only used in contacts.html via `shadow-form-inset`). These appear to be leftovers from a React/shadcn-ui migration and add ~80 lines of unused CSS custom properties plus their `@theme inline` mappings.
**Fix:** Remove all unused shadcn tokens from `:root`, `.dark`, and `@theme inline`. This reduces theme.css by approximately 40%.

### IN-02: `--border-glass` and `--border-glass-strong` shorthand tokens are unused

**File:** `src/styles/theme.css:289-290`
**Issue:** `--border-glass: 1px solid rgba(255, 255, 255, 0.6)` and `--border-glass-strong: 1px solid rgba(255, 255, 255, 0.8)` are defined but never used in any CSS or HTML file. The HTML uses the Tailwind utility `border-glass-border` (mapped to `--color-glass-border`) instead. These shorthand tokens are orphaned.
**Fix:** Remove `--border-glass` and `--border-glass-strong` from `@theme inline`.

### IN-03: `--border-glass-color` and `--border-glass-strong-color` duplicate `--color-glass-border` tokens

**File:** `src/styles/theme.css:291-295`
**Issue:** Four border-related color tokens exist with overlapping purpose:
- `--border-glass-color: rgba(255, 255, 255, 0.6)` (line 291)
- `--border-glass-strong-color: rgba(255, 255, 255, 0.8)` (line 292)
- `--color-glass-border: rgba(255, 255, 255, 0.6)` (line 294)
- `--color-glass-border-strong: rgba(255, 255, 255, 0.8)` (line 295)

HTML only uses `border-glass-border` (from `--color-glass-border`). The `--border-glass-color` and `--border-glass-strong-color` tokens are never used.
**Fix:** Remove the duplicate `--border-glass-color` and `--border-glass-strong-color` tokens.

### IN-04: `shadow-glass-header` token defined but unused

**File:** `src/styles/theme.css:286`
**Issue:** `--shadow-glass-header` is defined in `@theme inline` but not used in any HTML file in the main codebase (only used in worktree copies that appear to be from a different branch).
**Fix:** Remove if not planned for future use. Can be re-added when needed.

### IN-05: `--mu-green-200`, `--mu-green-400` are defined but never used in HTML

**File:** `src/styles/theme.css:15,17`
**Issue:** These tokens are declared and bridged to `@theme inline` (`--color-mu-green-200`, `--color-mu-green-400`) but neither `bg-mu-green-200`, `text-mu-green-200`, `bg-mu-green-400`, nor `text-mu-green-400` appears in any HTML file. Similarly `--mu-green-900` (line 21) is never used in HTML.
**Fix:** Remove unused green ramp steps or document them as reserved for future use.

### IN-06: `index.css` is dead code

**File:** `src/styles/index.css:1-12`
**Issue:** The file explicitly states it is "not used as build entry point" and contains only a comment block. It serves no purpose -- `tailwind.css` is the actual entry point.
**Fix:** Delete `src/styles/index.css` or rename it to `index.css.bak` to prevent confusion.

### IN-07: `css/styles.css` is a generated file that should be .gitignore'd

**File:** `css/styles.css`
**Issue:** This is a minified Tailwind output file (1 line, ~27K tokens). It appears to be checked into version control. Generated output files should typically be in `.gitignore` and built during deployment, not committed.
**Fix:** Add `css/styles.css` to `.gitignore` and build it during CI/deploy. If there is no CI pipeline yet, keep it committed but add a comment in the file header.

### IN-08: `@custom-variant dark` uses class-based selector but no dark mode toggle exists

**File:** `src/styles/theme.css:1`
**Issue:** `@custom-variant dark (&:is(.dark *))` configures Tailwind dark mode to use a `.dark` class on a parent element. The `.dark` override block (lines 146-195) defines dark token values. However, none of the HTML files add or toggle a `.dark` class, and there is no JavaScript dark mode toggle visible in the codebase. The dark mode system is defined but not activatable by users.
**Fix:** This is likely intentional for future use. No action needed, but be aware that the `.dark` token overrides (including liquid glass dark recipe) are currently inert.

### IN-09: `max-w-content` utility defined but unused

**File:** `src/styles/theme.css:302`
**Issue:** `--container-content: 1200px` in `@theme inline` generates a `max-w-content` Tailwind utility, but all HTML files use `max-w-[1400px]` instead. The token and utility are unused.
**Fix:** Either update HTML to use `max-w-content` for consistency, or remove the token if 1400px is the intended max width.

### IN-10: `--spacing-gutter-*` tokens defined but unused

**File:** `src/styles/theme.css:303-305`
**Issue:** `--spacing-gutter-mobile`, `--spacing-gutter-tablet`, `--spacing-gutter-desktop` generate Tailwind spacing utilities (`px-gutter-mobile`, etc.) but none of these are used in any HTML file. All pages use hardcoded `px-4` and `lg:px-6`.
**Fix:** Either adopt the gutter tokens in HTML or remove them from the theme.

### IN-11: `--liquid-blur-sm` and `--liquid-blur-xl` tokens unused

**File:** `src/styles/theme.css:125,128`
**Issue:** The blur token ramp defines sm/md/lg/xl, but only md and lg are used in liquid-glass.css classes. The sm and xl tiers are defined in both light and dark mode but never referenced.
**Fix:** Remove unused tiers or document them as available for custom compositions.

### IN-12: Font family mismatch with CLAUDE.md spec

**File:** `src/styles/fonts.css:1-17`, `src/styles/theme.css:5-6`
**Issue:** CLAUDE.md specifies Inter (body) and Manrope (headings) as the project fonts. However, the actual implementation uses SF Pro Display (body) and SF Pro Rounded (headings). The fonts.css file only defines `@font-face` for SF Pro with `local()` sources (no web font URLs). This means the fonts will only work on macOS/iOS where SF Pro is a system font. On Windows, Linux, and Android, the fallback chain (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`) will kick in -- which is functional but differs from the design spec.
**Fix:** Update CLAUDE.md to reflect the actual SF Pro choice, or switch to Inter/Manrope with proper web font loading. If SF Pro is intentional (Apple-like design language), document the fallback behavior for non-Apple platforms.

### IN-13: `.liquid-card-wrap` is a no-op class used extensively in HTML

**File:** `src/styles/liquid-glass.css:90-92`, used in `index.html` (~30 times), `checkup.html` (~30 times), `contacts.html` (~10 times)
**Issue:** The `.liquid-card-wrap` class is explicitly marked as "no-op -- shadow now on .liquid-card via drop-shadow" and contains no CSS properties. Yet it wraps nearly every card in all three HTML files. The wrapper `<div>` elements add DOM weight with no visual effect.
**Fix:** Remove the `.liquid-card-wrap` wrapper divs from HTML during next refactor pass. Keep the CSS class definition as a no-op for backward compatibility until HTML is cleaned up.

---

_Reviewed: 2026-04-09_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
