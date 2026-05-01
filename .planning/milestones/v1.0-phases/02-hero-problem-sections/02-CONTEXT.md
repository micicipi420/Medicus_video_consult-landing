# Phase 2: Hero & Problem Sections - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the Hero and Problem sections of the site. Hero must grab attention in 3 seconds with the value proposition. Problem section creates emotional recognition ("this is about me"). Both sections use the design system from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- Headline: «Мнение немецкого врача — за 5 дней, без перелёта»
- Subheadline: «Видеоконсультация с европейским специалистом — на вашем языке, с переводом. Загрузите документы в приложение — мы переведём их, передадим врачу и организуем встречу.»
- Primary CTA button: «Получить консультацию — от 450€» (scrolls to form section)
- Secondary CTA: «Узнать, подходит ли мой случай» (scrolls to form section)
- Background: clean, calm — light gradient or solid light color, no heavy imagery
- Layout: text-left on desktop, stacked on mobile

### Problem Section
- Heading: «Знакомо?»
- Three short paragraphs per ТЗ:
  1. «Получили диагноз — и не уверены, что он правильный. Разные врачи говорят разное. Хочется услышать мнение врача, которому можно верить.»
  2. «Слышали, что за границей лечат лучше — но лететь дорого, долго и страшно. А вдруг можно получить ответ, не выходя из дома?»
  3. «Время идёт — а решение всё ещё не принято.»
- Calm, empathetic tone — not alarmist
- Visual: subtle separator or icon between paragraphs

### Design Approach
- Use BEM classes from Phase 1 design system
- Mobile-first: paragraphs stack, hero text full-width
- Brand colors for CTA buttons (primary blue #38C6F4 with dark text)
- No animations, parallax, or heavy JS — static confidence

### Claude's Discretion
- Exact spacing between hero and problem sections
- Whether to use background color variation between sections
- Icon or visual separator choices for problem section
- Exact responsive breakpoints for hero layout shift

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- css/styles.css: full design system with .button, .section, .container, .hero BEM classes
- index.html: base skeleton with font preloads (currently has demo content to replace)

### Established Patterns
- BEM naming: .block__element--modifier
- Mobile-first media queries: min-width 768px, 1024px
- CSS custom properties for all values
- .section, .section--dark for alternating backgrounds

### Integration Points
- Replace demo content in index.html with actual hero + problem sections
- Use existing .button--primary, .button--secondary classes
- Use .section, .container layout pattern

</code_context>

<specifics>
## Specific Ideas

- All text content is defined in ТЗ — use exact Russian copy
- Hero CTA buttons scroll to form (form doesn't exist yet — use #form anchor)
- Price in CTA button removes "how much?" anxiety immediately
- Problem section focuses on uncertainty and need for second opinion, NOT on traveling abroad

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
