# MedicusUnion KZ Landing

## What This Is

Лендинг для medicusunion.kz — сервис онлайн-видеоконсультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму. Полностью рабочий лендинг с 11 секциями, формой заявки, Directus-бэкендом, SVG-иконками, анимациями и SEO-оптимизацией.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Requirements

### Validated

- ✓ Лендинг из 11 секций по ТЗ — v1.0 (STRUC-01..12)
- ✓ Mobile-first дизайн (ЦА 45+) — v1.0 (UX-01..07)
- ✓ Форма заявки с валидацией и спам-защитой — v1.0 (FORM-01..07)
- ✓ Directus как бэкенд: приём и хранение заявок — v1.0 (BACK-01..05)
- ✓ Брендбук: цвета, шрифты Inter/Manrope self-hosted — v1.0 (UX-04, UX-05)
- ✓ FAQ аккордеон со smooth-анимацией — v1.0 (NAV-04)
- ✓ CTA-кнопки со скроллом к форме — v1.0 (NAV-01)
- ✓ Sticky mobile bar с click-to-call — v1.0 (NAV-02, NAV-03)
- ✓ SEO: meta tags, Open Graph, semantic HTML — v1.0 (PERF-01..04)
- ✓ SVG-иконки, scroll-анимации, wave-разделители — v1.0 (Phase 10)

### Active

(Next milestone requirements to be defined via `/gsd:new-milestone`)

### Out of Scope

- Казахский язык — только русский в v1
- Интеграция с AmoCRM — заменяем на Directus
- Медтуризм-лендинг — отдельный проект
- Оплата онлайн — заявка только на консультацию
- Профили врачей на лендинге — ссылка на medicusunion.com/doctors
- Параллакс / тяжёлые анимации — ЦА 45+, предпочитаем простоту
- Чат-бот / live chat — медицинские вопросы через чат = ответственность

## Context

- Shipped v1.0 with 2,554 LOC (HTML 625 + CSS 1,461 + JS 468)
- Stack: Vanilla HTML + CSS + JS, Directus 11 + PostgreSQL 16 via Docker
- Self-hosted Inter + Manrope variable fonts (WOFF2)
- No build tools, no frameworks, no external dependencies
- All 36 requirements satisfied, 10 phases, 24 plans
- Бренд MedicusUnion: международный медицинский сервис, Австрия + Казахстан
- Контакты: +7 701 532 24 78, kz@medicusunion.com
- Стоимость консультации: от 450€

## Constraints

- **Stack**: HTML + CSS + JS (чистый, без фреймворков) — простота деплоя и поддержки
- **Backend**: Directus (self-hosted) — приём заявок с формы
- **Language**: Только русский
- **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст
- **Tone**: Спокойный, уверенный, медицинский — без маркетинговой агрессии

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| HTML/CSS/JS вместо фреймворка | Простота, скорость загрузки, лёгкий деплой | ✓ Good — 64KB total, no build step |
| Directus вместо AmoCRM | Данные на своих серверах, гибкость, перспектива CRM | ✓ Good — Docker setup works |
| Только русский язык | Фокус ЦА в Казахстане говорит на русском, казахский позже | ✓ Good — deferred to v2 |
| Self-hosted WOFF2 fonts | Быстрая загрузка, нет зависимости от Google CDN | ✓ Good — preloaded, no FOIT |
| ES5 syntax for JS | ЦА 45+ может использовать старые браузеры | ✓ Good — universal compat |
| IIFE pattern for JS | Избегаем загрязнения global scope | ✓ Good — clean isolation |
| BEM naming for CSS | Предсказуемые стили, нет конфликтов | ✓ Good — consistent across 11 sections |
| IntersectionObserver for animations | Производительность лучше чем scroll events | ✓ Good — with graceful fallback |
| Inline SVG icons (not sprite) | Простота, нет доп. HTTP запросов, кастомизация цветов | ✓ Good — 19 duotone icons |
| Honeypot + timing for spam | Невидимо для пользователя, без CAPTCHA | ✓ Good — UX-friendly spam protection |

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
*Last updated: 2026-03-23 after v1.0 milestone*
