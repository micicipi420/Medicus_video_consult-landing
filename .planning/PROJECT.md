# MedicusUnion KZ Landing

## What This Is

Лендинг для medicusunion.kz — сервиса онлайн-консультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+, которые хотят получить второе мнение от врача из Германии, Израиля, Швейцарии и других стран. Конверсия: заявка на консультацию через форму.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Лендинг из 11 секций по ТЗ (Hero, Проблема, Что вы получите, Как это работает, Кто консультирует, Почему через нас, Когда нужна консультация, Стоимость, Форма заявки, FAQ, Финальный призыв + Footer)
- [ ] Mobile-first дизайн (ЦА 45+ заходит с телефона)
- [ ] Форма заявки: имя, телефон, специализация (дропдаун), описание случая (необязательно)
- [ ] Directus как бэкенд: приём и хранение заявок
- [ ] Брендбук: цвета #38C6F4, #35B678, #18212C; шрифт Inter/Manrope
- [ ] Спокойный, уверенный тон — медицинский сервис, не «акция»
- [ ] FAQ в формате аккордеон
- [ ] CTA-кнопки со скроллом к форме
- [ ] Адаптив: мобильная, планшетная, десктопная версии

### Out of Scope

- Казахский язык — только русский в v1
- Интеграция с AmoCRM — заменяем на Directus
- Медтуризм-лендинг — отдельный проект
- Оплата онлайн — заявка только на консультацию
- Профили врачей на лендинге — ссылка на medicusunion.com/doctors

## Context

- ТЗ: `/Users/mikhail/Downloads/medicusunion_kz_landing_final.md`
- Бренд MedicusUnion: международный медицинский сервис, Австрия + Казахстан
- Контакты: +7 701 532 24 78, kz@medicusunion.com
- Стоимость консультации: от 450€
- Основные специализации: онкология, кардиология, нейрохирургия, ортопедия, радиология, ЭКО
- Страны врачей: Германия, Израиль, Швейцария, Австрия, ОАЭ, Южная Корея, Турция
- Приложение MedicusUnion: App Store + Google Play
- Directus будет использоваться как headless CMS / admin panel для хранения заявок и в перспективе как замена AmoCRM

## Constraints

- **Stack**: HTML + CSS + JS (чистый, без фреймворков) — простота деплоя и поддержки
- **Backend**: Directus (self-hosted) — приём заявок с формы
- **Language**: Только русский
- **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст
- **Tone**: Спокойный, уверенный, медицинский — без маркетинговой агрессии

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| HTML/CSS/JS вместо фреймворка | Простота, скорость загрузки, лёгкий деплой | — Pending |
| Directus вместо AmoCRM | Данные на своих серверах, гибкость, перспектива CRM | — Pending |
| Только русский язык | Фокус ЦА в Казахстане говорит на русском, казахский позже | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-23 after initialization*
