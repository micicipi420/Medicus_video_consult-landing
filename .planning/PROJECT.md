# MedicusUnion KZ Landing

## What This Is

Лендинг для medicusunion.kz — сервис онлайн-видеоконсультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму. Полностью рабочий лендинг с 11 секциями, формой заявки, Directus-бэкендом, SVG-иконками, анимациями, SEO-оптимизацией, sticky-навигацией, и визуальной полировкой второго уровня.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Current State

**Shipped:** v1.1 Visual Polish & Conversion Boost (2026-03-23)
**Codebase:** 2,905 LOC (762 HTML + 1,655 CSS + 488 JS)
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

### Active

## Current Milestone: v1.2 Brand Visual Alignment

**Goal:** Привести визуальный дизайн лендинга в соответствие с основным сайтом medicusunion.com — единый бренд-стиль кнопок, карточек, цветов и отступов.

**Target features:**
- Pill-shape кнопки (border-radius: 100px) как на основном сайте
- Зелёный primary CTA (#35B678) — основной цвет бренда MedicusUnion
- Увеличенный border-radius карточек (20px) для современного вида
- Тёплый кремовый hero-фон (#fffbf4) вместо холодного голубого
- Hover карточек: translateY(-2px) вместо scale — как на основном сайте
- Увеличенные секционные отступы (100px desktop) — больше воздуха
- Более лёгкие тени карточек — ближе к стилю основного сайта

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
*Last updated: 2026-03-23 after v1.2 milestone start*
