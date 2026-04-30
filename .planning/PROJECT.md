# MedicusUnion KZ

## What This Is

Сайт **medicusunion.kz** — многостраничный hub для жителей Казахстана, обеспечивающий доступ к европейской и азиатской медицине через **три сервиса**:

1. **Treatment abroad** (`/treatment-abroad`) — **главный оффер**. Лечение за рубежом под ключ: подбор клиники, документы, перевод, логистика, сопровождение. Спектр: онкология, кардиология, неврология, ортопедия, офтальмология, пластическая хирургия, стоматология, ЭКО, детская медицина. **43 клиники, 11 стран.**
2. **Checkup abroad** (`/checkup`) — комплексное обследование за 1–2 дня в Samsung Medical Center и Severance Hospital (Корея), клиниках Стамбула (Турция). Под ключ: виза, трансфер, переводчик, сопровождение. От **$350**. Включает **B2B-направление** (корпоративные чек-апы).
3. **Online consultations** (`/consultations`) — видеоконсультация с европейским врачом, второе мнение по диагнозу, перевод документов, письменное заключение. От **450€**, за 5 дней.

Index-страница (`/`) — hub, представляющий все три сервиса. Treatment abroad и checkup физически возят пациента за границу; consultations — entry point с низким коммитментом, ведущий к двум более дорогим сервисам.

Бэкенд на Directus — приём и хранение заявок со всех форм, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить доступ к европейской и азиатской медицине — от консультации онлайн до полного лечения за рубежом под ключ, — и оставляет заявку.

## Current State

**Shipped:** v1.4 2025 Visual Redesign (2026-03-24)
**Codebase:** ~3,152 LOC (762 HTML + 1,900 CSS + 490 JS)
**Stack:** Vanilla HTML + CSS + JS, Directus 11 + PostgreSQL 16 via Docker

## Requirements

### Validated

- ✓ Сайт из 11 секций по ТЗ — v1.0
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

- ✓ Градиентные CTA кнопки (green→teal, #1AC67E→#0D9DB5) — v1.3
- ✓ CTA border-radius 16px вместо pill-shape 100px — v1.3
- ✓ Белый hero-фон (#ffffff) вместо кремового — v1.3
- ✓ Контейнер 1200px — v1.3
- ✓ border-radius карточек 30px (с 20px) — v1.3
- ✓ Flat design карточек — убраны все box-shadow — v1.3
- ✓ Мятные бейджи (#d0fae4) с текстом #007955 — v1.3
- ✓ Навигация: белый фон, высота 76px на desktop — v1.3
- ✓ CSS-токен --gradient-cta для gradient CTA — v1.3
- ✓ CSS-токены --color-badge-bg / --color-badge-text — v1.3

- ✓ Dark mode с переключателем в навигации (localStorage, prefers-color-scheme hint, FOUC-free) — v1.4
- ✓ Bold display typography: h1 clamp(40px→56px)/800, h2 clamp(28px→44px)/800, text-wrap: balance — v1.4
- ✓ Glassmorphism: hero gradient mesh, frosted header on scroll, .card--glass на pricing; @supports fallback; ≤2 glass elements — v1.4
- ✓ Micro-animations: scroll-reveal translateY(20px)/0.4s, button :active scale(0.97)/100ms, prefers-reduced-motion guard — v1.4

### Active

## Current Milestone: v8.1 Propagation & Loose Ends

**Goal:** Распространить визуальный язык v8.0 (chrome, glass, типографика) с index-страницы на остальные страницы сайта, закрыть оставшиеся хвосты v8.0 (плейсхолдеры контента, lint warnings, неиспользуемые файлы) и провести финальное закрытие milestone (live a11y UAT, stash triage, archival).

**Target features:**
- Сервисные страницы (`/checkup`, `/consultations`, `/treatment-abroad`) на v8.0 chrome — header, ServiceHero, LeadFormSection
- Замена плейсхолдера "Dr. Ferdinand K. · Vienna" в HeroHub на on-team имя
- Восстановление координатор-присутствия в ContactSection (фото или дизайн-альтернатива)
- Чистка кода: 2 lint warnings, удаление/использование `LiquidBlobLayer.tsx` + `liquid-depth.css`, решение по research-docs rewrite
- Live UAT v8.0 a11y (7 браузерных проверок), triage `stash@{0}`, архивация v8.0 в `.planning/milestones/`

## Previous Milestone: v8.0 Index Page Redesign (Shipped 2026-04-30)

Index page redesign per the new mockup. 7 phases shipped:
- Phase 79: typography + mobile glass/motion budget tokens
- Phase 80: glass header chrome (HeaderClient, MobileMenu, StickyBar — HIG 44pt tap targets, ESC dismissal, iOS safe-area)
- Phase 81: hero video-call frame metaphor with name pill + live indicator + control row
- Phase 82: stats bar with icons + responsive-glass-nesting (mobile 1 wrapper / desktop 4 cards)
- Phase 83: 4-card services + 4-step process with desktop dotted connector
- Phase 84: blue-gradient CTA section with 3 trust signals (form preserved unmodified)
- Phase 85: a11y hardening — added missing prefers-contrast block + utility-class reduced-transparency coverage

### Out of Scope

- Казахский язык — только русский в v1
- Интеграция с AmoCRM — заменяем на Directus
- Оплата онлайн — заявка только, оплата через офис
- Профили врачей на сайте — ссылка на medicusunion.com/doctors
- Параллакс / тяжёлые анимации — ЦА 45+, предпочитаем простоту
- Чат-бот / live chat — медицинские вопросы через чат = ответственность
- Видео в hero — тяжёлый ресурс, ухудшает загрузку на мобильных
- A/B тестирование — требует серверную инфраструктуру, преждевременно

## Context

### Audience

- **Primary:** жители Казахстана 45+, ищущие доступ к европейской/азиатской медицине (для себя или близких).
- **Secondary B2B:** компании КЗ, заказывающие корпоративные чек-апы для сотрудников (направление checkup).

### Service offerings

- **Treatment abroad** — primary offer. Сеть: **43 клиники, 11 стран**. 15+ лет практики, 10 000+ пациентов, 500+ врачей-экспертов.
- **Checkup abroad** — Samsung Medical Center, Severance Hospital, клиники Стамбула. От $350. Включает B2B.
- **Online consultations** — 7 стран, 50+ врачей, 15+ специализаций. От 450€, за 5 дней.

### Stack history

- **v1.0–v5.0** (2026-03-23 → 2026-04-10): vanilla HTML + CSS + JS — простота деплоя.
- **v6.0+** (2026-04-11 → текущий): миграция на **Next.js + React + TypeScript + Tailwind**. Directus 11 + PostgreSQL 16 в Docker. Self-hosted Inter + Manrope (WOFF2).

### Milestone progression

- v1.0: 36 requirements, 10 phases, 24 plans
- v1.1: 12 requirements, 4 phases, 5 plans
- v1.2: 9 requirements, 2 phases, 2 plans — brand visual alignment with medicusunion.com
- v1.3: 10 requirements, 3 phases, 3 plans — KZ design alignment with medicusunion.kz
- v1.4: 13 requirements, 4 phases, 6 plans — 2025 visual redesign (dark mode, glassmorphism, bold typography, micro-animations)
- v6.1: 5 phases, 14 plans — New Design Port (Liquid Glass design system, squircles, service pages)
- Liquid Glass audit score: ~85% compliance with Apple guidelines. Main gaps: mobile blur budget, glass layer count, prefers-contrast, shimmer limits
- Бренд MedicusUnion: международный медицинский сервис, HQ в Vienna (Австрия), офис в Казахстане. Корневой проект: medicusunion.com.
- Контакты: +7 701 532 24 78, kz@medicusunion.com
- Цены: видеоконсультация от **450€**, чек-ап от **$350**, лечение под ключ — индивидуальная смета.

### Known TODOs

- На страницах `/treatment-abroad` и `/consultations` цифры сети расходятся с canonical (43 клиник / 11 стран). На treatment-abroad сейчас стоит «100+ клиник / 6 стран», на consultations — «7 стран». Адресовать в отдельном copy-полировочном таске.

## Constraints

- **Stack**: Next.js + React + TypeScript + Tailwind (с v6.0). Vanilla HTML/CSS/JS — историческая база v1.0–v5.0.
- **Backend**: Directus 11 + PostgreSQL 16 (self-hosted в Docker) — приём заявок со всех форм.
- **Language**: Только русский.
- **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст. Mobile blur ≤12px, ≤2 glass elements per viewport.
- **Tone**: Спокойный, уверенный, медицинский — без маркетинговой агрессии.

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
| Gradient CTA (#1AC67E→#0D9DB5) + opacity hover | Matches medicusunion.kz exactly; opacity hover avoids gradient direction reversal | ✓ Good — v1.3 |
| Flat card design (no box-shadow) | Aligns with medicusunion.kz reference — cleaner, lighter feel for medical context | ✓ Good — v1.3 |
| Mint badge palette as CSS tokens | Reusable tokens (#d0fae4/#007955) decouple badge style from primary palette | ✓ Good — v1.3 |
| [data-theme="dark"] attribute selector for dark mode | CSS token cascade, no class juggling, ES5-compatible JS toggle | ✓ Good — v1.4 |
| Default-light policy; prefers-color-scheme as first-visit hint only | ЦА 45+ associates light interface with medical authority | ✓ Good — v1.4 |
| Max 2 glass elements per viewport; blur ≤12px | GPU budget constraint for budget Android devices dominant in KZ market | ✓ Good — v1.4 |
| Dark mode disables backdrop-filter (glass-off) | Murky smear on navy #0F1923; opaque surface better on dark backgrounds | ✓ Good — v1.4 |
| translateY(20px) not 40px+ for scroll-reveal | 20px is within safe vestibular parameters for 45+ audience | ✓ Good — v1.4 |
| prefers-reduced-motion: transform: none, not just duration:0 | Duration-zero still causes snap from offset — explicit reset prevents any motion | ✓ Good — v1.4 |

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
*Last updated: 2026-04-23 after v8.0 milestone start*
