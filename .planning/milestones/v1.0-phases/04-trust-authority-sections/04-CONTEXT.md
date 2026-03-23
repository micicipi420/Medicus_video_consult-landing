# Phase 4: Trust & Authority Sections - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build sections 5, 6, 7 from ТЗ: «Кто консультирует» (doctors from 7 countries), «Почему через MedicusUnion» (4 advantages), «Когда имеет смысл получить второе мнение» (5 trigger scenarios). These sections build trust and authority.

</domain>

<decisions>
## Implementation Decisions

### Section: Кто консультирует (STRUC-06)
- Heading: «Врачи из Германии, Израиля, Швейцарии и ещё 4 стран»
- Text: На платформе MedicusUnion — врачи из клиник и медицинских университетов Германии, Израиля, Швейцарии, Австрии, ОАЭ, Южной Кореи и Турции.
- Specializations: онкология, кардиология, нейрохирургия, ортопедия, радиология, ЭКО и другие
- Each doctor profile note: специализация, опыт, клиника, языки консультации, стоимость
- Button: «Все врачи» links to medicusunion.com/doctors
- Show 3-4 placeholder doctor cards with country flags

### Section: Почему через MedicusUnion (STRUC-07)
- Heading: «Почему через MedicusUnion»
- Card 1: «Документы переведены и подготовлены» — Вы загружаете на русском — врач получает на своём языке. Не нужно искать переводчика медицинских документов.
- Card 2: «Перевод прямо во время консультации» — Вы говорите на русском, врач — на своём. Переводчик обеспечивает полное понимание — включая медицинскую терминологию.
- Card 3: «Всё в одном приложении» — Документы, расписание, видеозвонок, заключение врача — в личном кабинете. Ничего не потеряется, всё под рукой.
- Card 4: «Нужно больше — организуем» — Если после консультации нужно лечение за рубежом — мы организуем всё: клинику, документы, логистику, сопровождение. Но это уже следующий шаг.

### Section: Когда нужна консультация (STRUC-08)
- Heading: «Когда имеет смысл получить второе мнение»
- 5 scenarios with checkmark/icon:
  1. Вам поставили серьёзный диагноз и вы хотите убедиться, что он верный
  2. Разные врачи дают противоречивые рекомендации
  3. Нужно понять, какое лечение подходит именно вам
  4. Рассматриваете лечение за рубежом, но хотите сначала поговорить с врачом
  5. Хотите показать снимки или анализы специалисту узкого профиля

### Claude's Discretion
- Doctor card placeholder styling (photo placeholder, flag icons)
- Visual differentiation between sections (backgrounds)
- Checkmark/icon style for trigger scenarios
- Layout arrangements (grid vs list)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- .card BEM component from Phase 1
- .section, .container layout patterns
- .button for external link

### Integration Points
- Add after Process section in index.html

</code_context>

<specifics>
## Specific Ideas

- All text verbatim from ТЗ
- Doctor link goes to external: medicusunion.com/doctors
- Treatment abroad mentioned as possibility, not focus
- Each trigger scenario should feel like "да, это про меня"

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
