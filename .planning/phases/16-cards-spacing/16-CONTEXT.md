# Phase 16: Cards & Spacing - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Update card border-radius, hover effects, and shadows to match medicusunion.com style. Increase section padding for more visual breathing room.

</domain>

<decisions>
## Implementation Decisions

### Card Styling
- `border-radius: 20px` for all `.card` elements (up from 12px)
- Hover effect: `translateY(-2px)` replaces `scale(1.02)` — subtler, more professional
- Shadow: lighten to `0 1px 2px rgba(16, 24, 40, 0.05)` (rest) and `0 4px 6px -1px rgba(16, 24, 40, 0.1)` (hover) — matches medicusunion.com
- Keep `border-left: 3px solid transparent` → accent on hover (existing pattern, works with new radius)

### Section Spacing
- Desktop section padding: increase from 80px to 100px (`--section-padding-desktop: 6.25rem`)
- Mobile section padding: keep 48px (current value, appropriate for small screens)

### Claude's Discretion
- Whether pricing card needs separate border-radius treatment (already has special styling)
- Problem cards, doctors cards — ensure 20px radius applies consistently
- FAQ accordion items — may need radius adjustment if they use .card

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.card` base class at css/styles.css line 293 with `border-radius: var(--radius-lg)` (12px)
- `.card:hover` at line 303 with `transform: scale(1.02)`
- `--shadow-md: 0 4px 12px rgba(24, 33, 44, 0.08)` current card shadow
- `--section-padding-desktop: var(--space-10)` (80px)
- `--radius-lg: 0.75rem` (12px) used by cards

### Established Patterns
- CSS custom properties for radius and spacing
- Card hover transitions via `transition: transform var(--transition-normal), box-shadow var(--transition-normal)`

### Integration Points
- `.card` used by: benefits cards, doctors cards, advantage cards, scenario list items
- `.pricing__card` has its own shadow/border styling (Phase 13)
- `.problem__card` uses card-like styling
- Section padding affects all `.section` elements (11+ sections)

</code_context>

<specifics>
## Specific Ideas

- medicusunion.com cards: `border-radius: 20px`, `border: 1px solid var(--text-10)`, hover `translateY(-2px)` with `0 4px 6px -1px rgba(16,24,40,0.1)` shadow
- medicusunion.com section padding: 110px desktop — we use 100px as a closer match without being too spacious for our content density

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
