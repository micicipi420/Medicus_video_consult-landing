# Phase 41: Foundation Tokens - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning
**Mode:** Infrastructure phase — grey areas skipped (all decisions spec'd in ROADMAP success criteria)

<domain>
## Phase Boundary

All design tokens for v4.0 exist in theme.css, and the focus-visible ring mechanism is safe for mask-image elements -- so that Phases 42-49 can reference tokens without back-patching theme.css. No HTML files modified in this phase.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key constraints from ROADMAP success criteria:

- Dark mode selector: `.dark` class (confirmed by codebase audit — `@custom-variant dark (&:is(.dark *));` in theme.css line 1, `.dark {}` block at line 99)
- Focus-visible: `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` replacing current `box-shadow: 0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)`
- Grid tokens: `--container-max-content: 1200px` as @theme inline, gutter tokens 16/24/32px
- Squircle tokens: 4 mask data-URI references (md/lg/xl/full) — SVG superellipse per STACK research
- Liquid glass tokens: light recipe (--liquid-bg, --liquid-blur-md, --liquid-saturate, --liquid-brightness, rim shadows)
- Dark glass tokens: under `.dark` selector (rgba(30,40,60,0.45) base, blur 28px, saturate 160%, brightness 115%)
- Motion tokens: --ease-liquid, --dur-press, --dur-hover, --dur-sheet
- `make build` must exit 0 and byte-identity check must pass

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/theme.css` — existing token file with `:root` vars, `.dark` overrides, `@theme inline` block, `@layer base` rules
- Glass shadow tokens already exist: `--shadow-glass-sm`, `--shadow-glass`, `--shadow-glass-lg`, `--shadow-glass-inner`, `--shadow-glass-header`
- Glass border tokens already exist: `--border-glass`, `--border-glass-strong`, `--color-glass-border`
- Vertical rhythm tokens exist: `--section-h-hero-*`, `--spacing-section-*`

### Established Patterns
- CSS custom properties in `:root`, dark overrides in `.dark {}`
- Tailwind v4 @theme inline block maps `--color-*` → utility classes
- `@layer base` for global element styles
- `@custom-variant dark (&:is(.dark *));` for dark mode variant

### Integration Points
- `src/styles/theme.css` is the single source of truth for all tokens
- `make build` runs Tailwind CLI which reads theme.css
- `scripts/hooks/pre-commit` enforces byte-identity on HTML pages
- Focus-visible rule at theme.css:252-261 needs refactoring from box-shadow to outline

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description, success criteria, and STACK research (`.planning/research/STACK.md`).

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
