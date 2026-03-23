# Phase 14: Visual Consistency - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace emoji country flags with inline SVG flags and redesign "Знакомо?" section with icon-based compact layout.

</domain>

<decisions>
## Implementation Decisions

### SVG Country Flags
- Replace 7 emoji flags (🇩🇪 🇮🇱 🇨🇭 🇦🇹 🇦🇪 🇰🇷 🇹🇷) with simple inline SVG rectangles
- Each flag: simplified 2-3 color horizontal/vertical stripes matching real flag colors
- Size: 48x32px (consistent with card icon area)
- No external files — keep inline SVG pattern from v1.0

### Compact "Знакомо?" Section
- Replace 3 bordered-left text blocks with icon + text cards in a horizontal row
- Each card: duotone SVG icon (consistent with existing 19 icons) + bold headline + description
- Icons: 🔍 diagnosis uncertainty → magnifying glass icon, ✈️ foreign doctors → globe/plane icon, ⏰ time pressure → clock icon
- Grid: 3 columns on desktop, single column on mobile
- More compact vertical spacing than current layout

### Claude's Discretion
- Exact SVG flag simplification level (2-3 stripes vs more detailed)
- Icon compositions for "Знакомо?" cards
- Card padding and spacing

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 19 existing duotone SVG icons in `#38C6F4` / `rgba(56,198,244,0.08)` palette
- `.card` BEM component reusable for "Знакомо?" cards
- `.doctors__grid` for country cards layout
- Existing `.problem` section with `.problem__item` blocks

### Established Patterns
- Inline SVG, no external files
- Duotone: `stroke="#38C6F4"`, `fill="rgba(56,198,244,0.08)"`
- BEM naming consistent

### Integration Points
- Country flags in `.doctors__grid` > `.card` elements
- "Знакомо?" is `<section class="section problem" id="problem">`
- Existing `.problem__item` with blue left border

</code_context>

<specifics>
## Specific Ideas

- Keep flag aspect ratio 3:2 for realistic proportions
- "Знакомо?" icons should match the visual weight of benefit card icons

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
