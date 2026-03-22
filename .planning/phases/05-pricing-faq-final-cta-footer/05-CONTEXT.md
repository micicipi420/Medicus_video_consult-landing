# Phase 5: Pricing, FAQ, Final CTA & Footer - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build sections 8-11 from ТЗ + Footer: «Стоимость» (pricing), «FAQ» (accordion), «Финальный призыв» (final CTA), and Footer with contacts. These are the closing sections that handle objections and drive conversion.

</domain>

<decisions>
## Implementation Decisions

### Section: Стоимость (STRUC-09)
- Heading: «Прозрачная цена, никаких сюрпризов»
- Text: Стоимость зависит от специализации врача и сложности случая. Вы узнаете точную цену до оплаты.
- Price: «от 450€» — видеоконсультация
- Included list:
  - Перевод ваших медицинских документов
  - Подготовка врача к консультации (изучение вашего кейса)
  - Видеовстреча с переводчиком
  - Письменное заключение врача
  - Доступ к личному кабинету

### Section: FAQ (STRUC-10, NAV-04)
- 6 questions as accordion (expand/collapse on click):
  1. «Как проходит консультация технически?» — Видеозвонок через приложение MedicusUnion. Работает на телефоне, планшете и компьютере. Нужен только интернет.
  2. «Сколько длится консультация?» — Обычно 30–60 минут. Врач не торопится — это не поликлиника с 10-минутным приёмом.
  3. «А если я не говорю по-английски?» — Не нужно. Мы обеспечиваем перевод во время консультации. Документы тоже переводим сами.
  4. «Можно показать заключение своему врачу?» — Конечно. Вы получите письменное заключение — его можно скачать, распечатать, показать любому врачу.
  5. «Консультация обязывает к лечению?» — Нет. Это ваше решение. Консультация даёт информацию для принятия решения, а не обязательство.
  6. «Можно выбрать конкретного врача?» — Да. Вы можете выбрать врача на платформе сами, или мы подберём подходящего специалиста под ваш случай.
- Accordion: vanilla JS, click to toggle, one open at a time
- Touch-friendly tap targets (48px+ height for question headers)

### Section: Финальный призыв (STRUC-11)
- Heading: «Не откладывайте решение»
- Text: Второе мнение — это не роскошь, а возможность принять правильное решение. От 450€, за 5 дней, из дома.
- Button 1: «Получить консультацию» (scrolls to form)
- Button 2: «Оставить заявку» (scrolls to form)

### Footer (STRUC-12)
- Company: MedicusUnion — международный медицинский сервис. Австрия · Казахстан
- Phone: +7 701 532 24 78 (click-to-call)
- Email: kz@medicusunion.com (mailto link)
- App links: App Store · Google Play (placeholder links)
- Legal/copyright line

### Claude's Discretion
- Pricing section layout (card vs. clean list)
- Accordion animation (CSS transitions vs. instant)
- Footer column layout
- Icon choices for pricing included items

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- .card component, .button, .section, .container from Phase 1
- No JS files exist yet — this phase creates the first JS (accordion)

### Integration Points
- Add sections after Scenarios section in index.html
- Create js/main.js for accordion functionality
- Link script in index.html

</code_context>

<specifics>
## Specific Ideas

- FAQ accordion is the first JavaScript on the page
- Keep JS minimal — vanilla, no libraries
- Accordion should work without JS (all answers visible) for accessibility
- Price in hero CTA and pricing section should be consistent: от 450€

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
