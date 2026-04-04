# Phase 26: Online Consultations Page Rewrite - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning
**Mode:** Auto-generated (copywriting document is the spec)

<domain>
## Phase Boundary

Complete rewrite of online-consultations.html to match the approved copywriting document. Replace current TSX-derived content with 11 sections from the original spec. Preserve Tailwind glassmorphism design, shared header/footer/scripts. Add inline form with Directus integration. Add FAQ accordion.

</domain>

<decisions>
## Implementation Decisions

### Locked by Copywriting Document
All content, section order, headings, CTA text, and FAQ questions are locked by the copywriting document at:
`/Users/mikhail/Downloads/medicusunion_kz_landing_final.md`

The executor MUST read this file and use its exact text verbatim.

### Claude's Discretion
- Tailwind class choices for new sections (use glassmorphism patterns from index.html)
- Responsive breakpoints and mobile layout
- Icon choices for section cards (use Lucide SVG inline)
- Form field HTML structure (match contacts.html pattern)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- index.html — header, footer, mesh bg, mobile menu, sticky bar, FAQ accordion pattern, contact form pattern
- js/main.js — form submission to Directus, FAQ accordion JS, phone mask
- js/animations.js — scroll-reveal, fade-up animations
- contacts.html — form layout with coordinator card (reuse pattern)

### Established Patterns
- Tailwind utility classes from Redesign TSX
- Glass cards: `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-glass`
- Section badges: `inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-glass-border px-5 py-2.5 rounded-full`
- Gradient text: `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent`

</code_context>

<specifics>
## Specific Ideas

The copywriting document defines 11 sections in this exact order:
1. Hero: "Мнение немецкого врача — за 5 дней, без перелёта"
2. Проблема: "Знакомо?" (3 абзаца)
3. Что вы получите: 4 карточки
4. Как это работает: 3 шага
5. Кто консультирует: врачи из 7 стран
6. Почему через MedicusUnion: 4 преимущества
7. Когда нужна консультация: 5 триггеров
8. Стоимость: от 450€, 5 пунктов
9. Форма заявки: имя, телефон, специализация, описание
10. FAQ: 6 вопросов
11. Финальный CTA: "Не откладывайте решение"

</specifics>

<deferred>
## Deferred Ideas

None — copywriting document covers full page scope.

</deferred>
