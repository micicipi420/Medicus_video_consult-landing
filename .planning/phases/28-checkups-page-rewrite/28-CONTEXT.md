# Phase 28: Checkups Page Rewrite - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning
**Mode:** Auto-generated (copywriting document is the spec)

<domain>
## Phase Boundary

Complete rewrite of checkups.html to match the approved copywriting document. Replace current TSX-derived content with 10 sections including detailed Korea (7 programs) and Turkey (4 programs) pricing tiers, B2B block, and FAQ. Preserve Tailwind glassmorphism design, shared header/footer/scripts.

</domain>

<decisions>
## Implementation Decisions

### Locked by Copywriting Document
All content locked by: `/Users/mikhail/Downloads/MedicusUnion_Checkup_Page_Copy.md`
The executor MUST read this file and use its exact text verbatim.

### Claude's Discretion
- Tailwind class choices for pricing tables (reuse patterns from Phase 26)
- Program cards responsive layout for 7+ tiers
- B2B section design
- Icon choices

</decisions>

<code_context>
## Existing Code Insights

### Reusable from Phase 26
- Form pattern with Directus integration
- FAQ accordion pattern
- Section glass card patterns
- Shared header/footer/mesh/scripts

</code_context>

<specifics>
## Specific Ideas

10 sections per copywriting document:
1. Hero: "Проверьте здоровье в Samsung Medical Center и Severance Hospital"
2. Проблема: "Почему не стоит ждать симптомов" + 3 карточки
3. Почему за рубежом: 4 преимущества
4. Почему через MedicusUnion: 5 пунктов
5. Программы Корея: 7 комплексных + подростки + 6 узкоспециализированных
6. Программы Турция: 4 программы + что включено
7. Как работает: 5 шагов
8. B2B: корпоративные чек-апы (2 сценария)
9. FAQ: 7 вопросов
10. Финальный CTA + дисклеймер о ценах + SEO мета

</specifics>

<deferred>
## Deferred Ideas

- Детальный состав Silver/Gold/Platinum Турции (помечено TODO в документе)

</deferred>
