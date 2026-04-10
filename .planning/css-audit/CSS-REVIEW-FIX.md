---
phase: css-audit
fixed_at: 2026-04-09T18:30:40Z
review_path: .planning/css-audit/CSS-REVIEW.md
iteration: 1
findings_in_scope: 9
fixed: 9
skipped: 0
status: all_fixed
---

# CSS Audit: Code Review Fix Report

**Fixed at:** 2026-04-09T18:30:40Z
**Source review:** .planning/css-audit/CSS-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 9 (1 Critical, 8 Warning)
- Fixed: 9
- Skipped: 0

## Fixed Issues

### CR-01: `border` applied to squircle-masked elements (anti-pattern violation)

**Files modified:** `src/styles/theme.css`, `index.html`
**Commit:** c7b7df9
**Applied fix:** Added `.border-inset-glass` utility class in `src/styles/theme.css` (`@layer utilities`) that uses `box-shadow: inset 0 0 0 1px var(--color-glass-border)` instead of CSS border. Replaced all 20 occurrences of `border border-glass-border` with `border-inset-glass` in `index.html` on elements with `squircle-md` or `squircle-full` classes. checkup.html and contacts.html had no occurrences of this pattern.

### WR-01: Duplicate green token values -- `--mu-green-200` and `--mu-green-300` identical

**Files modified:** `src/styles/theme.css`
**Commit:** e08f698
**Applied fix:** Changed `--mu-green-200` from `#A6EECB` to `#B8F2D6` (lighter), keeping `--mu-green-300` at `#A6EECB`. The ramp now has distinct adjacent steps.

### WR-02: `--mu-green-600` and `--mu-green-900` identical, non-monotonic ramp

**Files modified:** `src/styles/theme.css`
**Commit:** e08f698 (combined with WR-01)
**Applied fix:** Changed `--mu-green-700` from `#4BCA8C` to `#2D9E68` (darker than 600) and `--mu-green-900` from `#35B678` to `#1A6B42` (darkest). The green ramp is now monotonically darkening from 50 through 900. Status: fixed: requires human verification (color values chosen for monotonic progression but visual palette approval needed).

### WR-03: Inconsistent form shadow tokens across pages

**Files modified:** `index.html`, `checkup.html`
**Commit:** 728fa39
**Applied fix:** Replaced `shadow-glass-inner` with `shadow-form-inset` on all form inputs (input, select, textarea) in index.html (4 elements) and checkup.html (4 elements). contacts.html already used `shadow-form-inset`. All 3 pages now use the same purpose-built form shadow token.

### WR-04: `--container-content` defined twice in theme.css

**Files modified:** `src/styles/theme.css`
**Commit:** 9dfaa56
**Applied fix:** Removed `--container-content: 1200px` from the `:root` block. The `@theme inline` declaration at line 301 remains as the single source of truth, generating both the CSS custom property and the `max-w-content` Tailwind utility.

### WR-05: `--squircle-mask-full: none` is semantically misleading

**Files modified:** `src/styles/theme.css`
**Commit:** 368179b
**Applied fix:** Removed the `--squircle-mask-full: none` token declaration. Updated the comment to note that full squircles use `border-radius: 50%` with no mask token needed.

### WR-06: Hardcoded rgba shadow values in liquid-glass.css

**Files modified:** `src/styles/liquid-glass.css`
**Commit:** 3e01cec
**Applied fix:** Replaced hardcoded `0 8px 24px rgba(20, 30, 60, 0.12)` in `.liquid-regular` and `0 16px 40px rgba(20, 30, 60, 0.16)` in `.liquid-card` and `.stats-glass` with `var(--liquid-shadow-outer)`. All three classes now use the token, ensuring dark mode overrides apply correctly.

### WR-07: Inline `<style>` blocks duplicated across all 3 HTML files

**Files modified:** `src/styles/theme.css`, `index.html`, `checkup.html`, `contacts.html`
**Commit:** 04e1c45
**Applied fix:** Moved all shared component styles (`.header--scrolled`, `.mobile-menu-overlay`, `.is-invalid`, `.faq__answer`, `.form__success`, `.form__error`, `.form__field-error`, `.visually-hidden`, `a[aria-current="page"]`) into `src/styles/theme.css` under a new `@layer components` section. Removed the inline `<style>` blocks from all 3 HTML files. The superset of rules from index.html/checkup.html was used (includes FAQ accordion rules that contacts.html lacked).

### WR-08: Redundant `border: none` in liquid-glass classes

**Files modified:** `src/styles/liquid-glass.css`
**Commit:** 26aa767
**Applied fix:** Removed `border: none` from `.liquid-regular`, `.liquid-card`, `.liquid-btn-secondary`, and `.stats-glass`. Added a clarifying comment on `.liquid-regular` referencing the `.border-inset-glass` utility and squircles.css anti-pattern docs. The print stylesheet `border: 1px solid #ccc !important` was intentionally preserved.

## Skipped Issues

None -- all findings were fixed.

---

_Fixed: 2026-04-09T18:30:40Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
