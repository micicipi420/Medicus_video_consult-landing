# Phase 3: Value & Process Sections - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build sections 3 and 4 from ТЗ: «Что вы получите за одну консультацию» (4 benefit cards) and «Три шага до мнения европейского врача» (3 process steps). These sections show concrete value and simplicity of the process.

</domain>

<decisions>
## Implementation Decisions

### Section: Что вы получите (4 cards)
- Heading: «Что вы получите за одну консультацию»
- Card 1: «Второе мнение по вашему диагнозу» — Врач изучит ваши документы до встречи и даст оценку вашего случая. Не общие слова, а конкретное заключение по вашим анализам и снимкам.
- Card 2: «Понятный план действий» — Что делать дальше: какие обследования пройти, какое лечение рекомендуется, какие есть варианты. Вы уходите с консультации с ясностью, а не с новыми вопросами.
- Card 3: «Письменное заключение» — После консультации вы получите документ с рекомендациями врача. Его можно показать своему лечащему врачу или использовать для принятия решения.
- Card 4: «Ответы на ваши вопросы» — Консультация — это не монолог врача. Вы задаёте вопросы, врач отвечает. Переводчик обеспечивает полное понимание.
- Layout: 2x2 grid on desktop, single column on mobile
- Each card with icon placeholder area, title, description

### Section: Как это работает (3 steps)
- Heading: «Три шага до мнения европейского врача»
- Step 01: «Загрузите документы» — Снимки, анализы, заключения — в любом формате, на любом языке. Мы переведём всё сами и подготовим для врача.
- Step 02: «Врач изучает ваш случай» — Специалист готовится к встрече: изучает документы, снимки, историю болезни. На консультации он уже в курсе вашего случая.
- Step 03: «Видеоконсультация» — Встреча по видео с переводчиком. Врач даёт оценку, отвечает на вопросы. После — письменное заключение в личном кабинете.
- Layout: horizontal steps with numbers on desktop, vertical stack on mobile
- Visual step numbers: 01, 02, 03 styled prominently

### Claude's Discretion
- Icon/emoji choices for benefit cards
- Step number visual styling (circles, large numerals, etc.)
- Exact card spacing and padding
- Background color alternation between sections

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- .card, .card__title, .card__text BEM classes from Phase 1
- .section, .section--dark, .container layout classes
- CSS grid/flexbox patterns established

### Established Patterns
- BEM naming, mobile-first, CSS custom properties
- Section alternation: white/light backgrounds

### Integration Points
- Add sections after Problem section in index.html
- Use existing card component styles, extend as needed

</code_context>

<specifics>
## Specific Ideas

- All text is exact from ТЗ — use verbatim
- Key differentiator to emphasize: doctor studies documents BEFORE consultation
- 450€ = not "15 minutes of video" but a full case review with written conclusion

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
