# Phase 13: Section Layout & Contrast - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve visual hierarchy: alternating section backgrounds, enhanced wave dividers, centered pricing card, and two-column form layout on desktop.

</domain>

<decisions>
## Implementation Decisions

### Alternating Backgrounds
- Establish clear pattern: white → light-gray (#f8fafb) → white → light-gray alternating
- Social proof (dark) already breaks the pattern — it acts as an accent separator
- Sections with `.section--dark` keep their existing dark background

### Wave Dividers
- Increase wave SVG height from current values (make more prominent)
- Slightly increase fill opacity for stronger visual separation
- Ensure waves match adjacent section background colors

### Pricing Card
- Center `.pricing__card` on desktop using `max-width: 520px; margin: 0 auto`
- Add visual emphasis: larger box-shadow, subtle border-left accent (#38C6F4)
- Add «Популярное» badge or accent line at top of card

### Form Two-Column Layout
- Desktop (≥ 768px): `.lead-form__wrapper` becomes `display: grid; grid-template-columns: 1fr 1fr`
- Left column: heading, description text, trust elements (privacy note, response time)
- Right column: form fields + submit button
- Background contrast: light-gray (#f8fafb) for the form section
- Mobile: single column (current layout preserved)

### Claude's Discretion
- Exact shadow values for pricing card
- Wave SVG exact dimensions
- Grid gap values for form layout

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.section` base class with padding
- Wave dividers already exist between sections (SVG in HTML)
- `.pricing__card` with existing border and padding
- `.lead-form__wrapper` wrapping form content

### Established Patterns
- BEM: `.pricing__card`, `.lead-form__wrapper`
- CSS custom properties for colors
- Existing alternating pattern: some sections use `--color-light` background

### Integration Points
- 11 sections need background color assignment
- Wave dividers embedded in HTML between sections
- Form section currently full-width single column

</code_context>

<specifics>
## Specific Ideas

- Form left column should emphasize: "Мы перезвоним в течение 24 часов", "Бесплатно и без обязательств", privacy note
- Pricing badge text: «Всё включено» or similar trust-building label

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
