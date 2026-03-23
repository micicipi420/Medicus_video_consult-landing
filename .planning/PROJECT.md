# MedicusUnion KZ Landing

## What This Is

Лендинг для medicusunion.kz — сервис онлайн-видеоконсультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму. Полностью рабочий лендинг с 11 секциями, формой заявки, Directus-бэкендом, SVG-иконками, анимациями, SEO-оптимизацией, sticky-навигацией, и визуальной полировкой второго уровня.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Current State

**Shipped:** v1.2 Brand Visual Alignment (2026-03-23)
**Codebase:** ~2,890 LOC (762 HTML + 1,637 CSS + 488 JS)
**Stack:** Vanilla HTML + CSS + JS, Directus 11 + PostgreSQL 16 via Docker

## Requirements

### Validated

- ✓ Лендинг из 11 секций по ТЗ — v1.0
- ✓ Mobile-first дизайн (ЦА 45+) — v1.0
- ✓ Форма заявки с валидацией и спам-защитой — v1.0
- ✓ Directus как бэкенд: приём и хранение заявок — v1.0
- ✓ Брендбук: цвета, шрифты Inter/Manrope self-hosted — v1.0
- ✓ FAQ аккордеон со smooth-анимацией — v1.0
- ✓ CTA-кнопки со скроллом к форме — v1.0
- ✓ Sticky mobile bar с click-to-call — v1.0
- ✓ SEO: meta tags, Open Graph, semantic HTML — v1.0
- ✓ SVG-иконки, scroll-анимации, wave-разделители — v1.0
- ✓ Hero с реальной медицинской иллюстрацией и увеличенными CTA — v1.1
- ✓ Social proof блок с ключевыми числами — v1.1
- ✓ Sticky header с навигацией по секциям — v1.1
- ✓ Чередующиеся фоны секций и усиленные wave-разделители — v1.1
- ✓ Центрированная pricing-карточка с badge — v1.1
- ✓ Двухколоночный layout формы с trust signals — v1.1
- ✓ SVG-флаги стран вместо emoji — v1.1
- ✓ Компактная секция «Знакомо?» с иконками — v1.1

- ✓ Pill-shape кнопки (border-radius: 100px) — v1.2
- ✓ Зелёный primary CTA (#35B678) с hover #25A467 — v1.2
- ✓ Тёплый кремовый hero-фон (#fffbf4) — v1.2
- ✓ Карточки с border-radius 20px и лёгкими тенями — v1.2
- ✓ Hover карточек translateY(-2px) вместо scale — v1.2
- ✓ Секционные отступы 100px на desktop — v1.2
- ✓ CSS-токены --color-cta / --color-cta-hover для green CTA — v1.2

### Active

## Current Milestone: v1.3 KZ Design Alignment

**Goal:** Привести дизайн лендинга в соответствие с medicusunion.kz — градиентные кнопки, увеличенный radius карточек, белый hero, убрать тени, обновить навигацию.

**Target features:**
- Градиентные CTA кнопки (green→teal) вместо solid green, radius 14-16px вместо pill
- Увеличенный border-radius карточек до 30px
- Белый hero-фон (#ffffff) вместо кремового
- Убрать все тени с карточек
- Навигация: белый фон, 76px высота
- Мятные бейджи (#d0fae4) с текстом #007955
- Контейнер 1200px

### Out of Scope

- Казахский язык — только русский в v1
- Интеграция с AmoCRM — заменяем на Directus
- Медтуризм-лендинг — отдельный проект
- Оплата онлайн — заявка только на консультацию
- Профили врачей на лендинге — ссылка на medicusunion.com/doctors
- Параллакс / тяжёлые анимации — ЦА 45+, предпочитаем простоту
- Чат-бот / live chat — медицинские вопросы через чат = ответственность
- Видео в hero — тяжёлый ресурс, ухудшает загрузку на мобильных
- A/B тестирование — требует серверную инфраструктуру, преждевременно

## Context

- Shipped v1.1 with 2,905 LOC (HTML 762 + CSS 1,655 + JS 488)
- Stack: Vanilla HTML + CSS + JS, Directus 11 + PostgreSQL 16 via Docker
- Self-hosted Inter + Manrope variable fonts (WOFF2)
- No build tools, no frameworks, no external dependencies
- v1.0: 36 requirements, 10 phases, 24 plans
- v1.1: 12 requirements, 4 phases, 5 plans
- v1.2: 9 requirements, 2 phases, 2 plans — brand visual alignment with medicusunion.com
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
| Inline SVG icons (not sprite) | Простота, нет доп. HTTP запросов, кастомизация цветов | ✓ Good — 19 duotone icons + 7 flags |
| Honeypot + timing for spam | Невидимо для пользователя, без CAPTCHA | ✓ Good — UX-friendly spam protection |
| Duotone SVG for hero illustration | Consistent with existing icon style | ✓ Good — v1.1 |
| Position: sticky for header | Native CSS, no JS positioning needed | ✓ Good — v1.1 |
| 80px double-curve wave dividers | Stronger visual separation between sections | ✓ Good — v1.1 |
| Separate --color-cta from --color-primary | Green CTA for buttons, cyan for accents — visual variety | ✓ Good — v1.2 |
| Card translateY(-2px) hover | Subtler than scale, matches medicusunion.com | ✓ Good — v1.2 |
| Lighter rgba(16,24,40) shadow palette | Nearly flat rest-state, airy modern feel | ✓ Good — v1.2 |

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
*Last updated: 2026-03-23 after v1.3 milestone start*
