# Phase 32: Design System Compliance — Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Bring all 6 HTML pages (index, online-consultations, treatment-abroad, checkup, contacts, 404) into full compliance with DESIGN-SYSTEM.md. Specifically: implement missing accessible color tokens in theme.css, replace WCAG-failing text colors across all pages, add focus-visible keyboard navigation, fix CTA gradient contrast, and add accessibility extras (ARIA, reduced-motion, glass-5 level).

Source of truth: `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` (audit from 2026-04-05) + `DESIGN-SYSTEM.md`

</domain>

<decisions>
## Implementation Decisions

### Focus-Visible Strategy
- Global CSS rule in `@layer base` targeting `a, button, input, select, textarea` — single rule, zero HTML changes
- Use `#0E8FB5` (the `--mu-blue-text` value) directly in the CSS rule via the new token

### Color Token Migration
- Update existing `--mu-text-700` in-place from #63687A to #4A4E5C (affects all usages site-wide — intended)
- Update existing `--mu-text-500` in-place from #A4A8B5 to #6B6F80 (affects all usages site-wide — intended)
- Add new `--mu-cta-from`/`--mu-cta-to` tokens, then find-replace all CTA gradient classes from `from-mu-blue to-mu-accent-blue` to `from-mu-cta-from to-mu-cta-to`
- Grep & replace bright accent colors on readable text: `text-mu-blue` → `text-mu-blue-text`, `text-mu-accent-blue` → `text-mu-accent-blue-text`, etc. Keep bright originals on icons and backgrounds.

### Accessibility Extras
- Add `role="alert" aria-live="polite"` to all `.form__field-error` spans and `.form__error` divs
- Add CSS `@media (prefers-reduced-motion: reduce)` rule to theme.css
- Fix form container glass level from `bg-white/60` to `bg-white/70` (Glass-5 spec)

### Claude's Discretion
- Exact grep patterns for identifying text-vs-icon usages of bright colors
- Order of file edits (theme.css first, then HTML pages)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/theme.css` — central `:root` and `@theme inline` blocks where all tokens live
- All 6 HTML pages share identical header/footer/nav structure (SPA-like router in main.js)
- Glass shadow tokens already defined: `--shadow-glass-sm`, `--shadow-glass`, `--shadow-glass-lg`, etc.

### Established Patterns
- CSS custom properties in `:root {}` → mapped to Tailwind via `@theme inline { --color-X: var(--X) }`
- Pages use Tailwind utility classes exclusively (no inline styles for colors)
- Form structure: `.form__field-error` spans, `.form__error` div for validation messages

### Integration Points
- `src/styles/theme.css` → compiled to `css/styles.css` via Tailwind CLI
- After theme.css changes, `css/styles.css` must be recompiled
- All 6 HTML pages reference `css/styles.css`

</code_context>

<specifics>
## Specific Ideas

Full fix list from UI-REVIEW-FULL-SITE.md (13 items, prioritized):

1. Add 7 accessible text tokens + 2 CTA tokens to theme.css (:root + @theme inline)
2. Update --mu-text-700 to #4A4E5C, --mu-text-500 to #6B6F80
3. Replace CTA gradient `from-mu-blue to-mu-accent-blue` → `from-mu-cta-from to-mu-cta-to` (~25 buttons)
4. Replace bright accent text colors with `*-text` variants (~50 class changes)
5. Replace `hover:text-mu-blue` with `hover:text-mu-blue-text` (~30 hover classes)
6. Global focus-visible CSS rule in @layer base
7. CSS `@media (prefers-reduced-motion: reduce)` rule
8. Add `role="alert" aria-live="polite"` to form error containers (~20 spans)
9. Fix form container bg-white/60 → bg-white/70

</specifics>

<deferred>
## Deferred Ideas

- Feature card border-radius fix (rounded-[2.5rem] → rounded-[3rem]) on online-consultations — minor, not a design system token issue
- Coordinator card sizing (p-8→p-6, w-28→w-32) on contacts — component-specific, not systemic
- H2 size standardization on index.html — typography, not accessibility-critical
- Hero image shadow token fix on treatment-abroad — single element

</deferred>
