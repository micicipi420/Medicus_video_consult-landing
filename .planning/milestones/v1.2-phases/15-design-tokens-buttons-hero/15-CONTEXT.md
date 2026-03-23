# Phase 15: Design Tokens, Buttons & Hero - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Update CSS design tokens, button styles, and hero background to match medicusunion.com brand. Buttons become pill-shape with green primary CTA, hero gets warm cream background.

</domain>

<decisions>
## Implementation Decisions

### Color Token Strategy
- Add `--color-cta: #35B678` and `--color-cta-hover: #25A467` tokens for CTA buttons — keep `--color-primary` (#38C6F4) for accents (icons, links, duotone SVGs)
- Primary CTA text color: white (#fff) — matches medicusunion.com style (3.66:1 contrast, AA for large text at 20px)
- Remove `.button--secondary` (green) class — it becomes redundant when primary CTA switches to green. Outline button remains as secondary action.

### Hero Background
- Replace gradient (`#e0f4fb → #f0fdf9 → white`) with flat `#fffbf4` (warm cream) — matches medicusunion.com hero exactly
- Remove dot-grid texture overlay (`::before` pseudo-element) — medicusunion.com uses clean backgrounds without texture patterns

### Button Details
- All buttons get `border-radius: 100px` (pill-shape) — both primary and outline variants
- Outline button keeps dark border (`#18212C`) — good contrast, matches current design
- Update pricing CTA pulse-glow animation from cyan to green (`#35B678`) to match new CTA color

### Claude's Discretion
- Exact transition values for button hover states
- Whether to update `--color-primary-dark` references that may cascade from the green change
- Social proof bar color — keep `--color-primary-dark` (#0E7490) or adjust

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `:root` design tokens at css/styles.css lines 53-117
- `.button` base class at line 254 with `border-radius: var(--radius-md)` (8px)
- `.button--primary` at line 275 with `background-color: var(--color-primary)`
- `.button--outline` at line 488 with `border: 2px solid var(--color-dark)`
- `.hero` background gradient at line 426
- `.hero::before` dot-grid texture at line 431

### Established Patterns
- CSS custom properties for all design tokens
- BEM naming for components
- Mobile-first responsive breakpoints at 768px and 1024px

### Integration Points
- `.button--primary` used in hero CTA, pricing CTA, form submit, final-cta section, sticky bottom bar
- `.button--secondary` used in some CTAs (to be removed)
- `.hero` gradient affects hero section visual weight
- Pricing CTA pulse animation references `--color-primary`

</code_context>

<specifics>
## Specific Ideas

- medicusunion.com button: `border-radius: 100px`, `min-height: 48px`, `padding-inline: 16px`, `font-weight: 700`
- medicusunion.com hero background: flat `#fffbf4`
- medicusunion.com primary CTA: `#35B678` bg, white text, hover `#25A467`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
