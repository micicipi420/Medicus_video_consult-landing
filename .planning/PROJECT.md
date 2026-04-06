# MedicusUnion KZ Landing

## What This Is

Лендинг для medicusunion.kz — сервис онлайн-видеоконсультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму. Полностью рабочий лендинг с 11 секциями, формой заявки, Directus-бэкендом, SVG-иконками, анимациями, SEO-оптимизацией, sticky-навигацией, и визуальной полировкой второго уровня.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Current State

**Shipped:** v3.0 SEO, Performance & Polish (2026-04-06)
**Codebase:** ~4,714 LOC (4,370 HTML + 344 CSS) + JS, 5 production pages + 404
**Stack:** HTML + Tailwind CSS v4 (CLI standalone) + vanilla JS + Motion CDN, Directus 11 + PostgreSQL 16 via Docker

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

- ✓ Service-page копирайт rewrite по копирайтинг-документам (online-consultations, treatment-abroad, checkup) — v2.0
- ✓ Pixel-perfect Tailwind v4 миграция из Redesign TSX-прототипа — v2.0
- ✓ Migrate-to-Tailwind-CSS-v4: standalone CLI binary, theme.css токены — v2.0

- ✓ Branded 404.html с gradient "404", «Страница не найдена» и кнопкой «На главную» — v3.0
- ✓ Консистентный header/footer/mobile-menu/sticky-bar на всех 6 страницах — v3.0
- ✓ Honeypot spam protection на всех формах — v3.0
- ✓ FAQ accordions работают корректно на всех страницах — v3.0
- ✓ Все CTA-ссылки проверены и ведут на правильные страницы — v3.0
- ✓ Уникальные title + meta description на каждой странице из копирайтинг-документов — v3.0
- ✓ Open Graph теги (og:title/description/url/type/image) на каждой странице — v3.0
- ✓ Canonical URLs на каждой странице — v3.0
- ✓ Schema.org MedicalBusiness JSON-LD на index.html — v3.0
- ✓ 11 Unsplash изображений → локальные WebP (660KB → 283KB, -57%) — v3.0
- ✓ Lazy loading + width/height на всех below-fold изображениях (CLS prevention) — v3.0
- ✓ Preload критичных ресурсов (CSS, шрифты, hero images) в head — v3.0
- ✓ Motion CDN + JS scripts с defer — v3.0
- ✓ Tailwind CSS минифицирован через --minify — v3.0
- ✓ WCAG AA accessible color tokens (7 text + 2 CTA gradient) в theme.css :root и @theme inline — v3.0
- ✓ Neutral text tokens обновлены: --mu-text-700 (5.89:1), --mu-text-500 (4.50:1) — v3.0
- ✓ Focus-visible keyboard ring на всех интерактивных элементах — v3.0
- ✓ Accessible CTA gradient (from-mu-cta-from → to-mu-cta-to) на 77 кнопках — v3.0
- ✓ Bright accent colors на readable text заменены на *-text варианты (88 hover states, 62 text elements) — v3.0
- ✓ ARIA role="alert" aria-live="polite" на 20 form error containers — v3.0
- ✓ @media (prefers-reduced-motion: reduce) отключает анимации и transitions — v3.0
- ✓ Glass-5 form containers (bg-white/70 + shadow-form-inset) на всех 6 страницах — v3.0
- ✓ Russian typography polish: nbsp binding для subject+verb pairs, orphan prevention, responsive br на hero headings — v3.0

### Active

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

## Next Milestone: v3.1 Design Polish & Audit Fixes (planning)

**Source:** `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` — full-site 6-pillar audit (2026-04-06, score 17/24)

**Top focus areas:**
- 🔴 Mobile sticky-bar overlap (main padding-bottom on all 5 pages)
- 🔴 Data drift unification (Vienna address, ТОО name spelling — credibility blocker)
- 🔴 H1 overflow on `checkup.html` 1024–1440px (gradient phrase clips behind hero image)
- 🟡 Cross-cutting visual consistency findings (8 items)
- 🔵 Per-page polish (24 items catalogued, ROI-ranked)

## Shipped: v3.0 SEO, Performance & Polish (2026-04-06)
- 4 phases (29-32), 7 plans, 24 requirements
- 404 page + cross-page consistency, full SEO + Schema.org, local WebP + lazy loading + preload, WCAG AA tokens + focus-visible + ARIA + reduced-motion

## Shipped: v2.0 Service Pages Copywriting Rewrite (2026-04-05)
- 4 страницы переписаны по копирайтинг-документам (35 requirements)
- Pixel-perfect Tailwind из Redesign TSX

## Context

- Shipped v1.0 redesign with 5 pages, Tailwind CSS v4, Motion CDN animations
- Stack: HTML + Tailwind CSS v4 (CLI standalone) + JS, Directus 11 + PostgreSQL 16 via Docker
- SF Pro Display/Rounded system fonts with fallback chain
- Tailwind CLI standalone binary for CSS compilation
- v1.0: 36 requirements, 10 phases, 24 plans
- v1.1: 12 requirements, 4 phases, 5 plans
- v1.2: 9 requirements, 2 phases, 2 plans — brand visual alignment with medicusunion.com
- v1.3: 10 requirements, 3 phases, 3 plans — KZ design alignment with medicusunion.kz
- v1.4: 13 requirements, 4 phases, 6 plans — 2025 visual redesign (dark mode, glassmorphism, bold typography, micro-animations)
- v2.0: 35 requirements, 4 phases (25-28), 8 plans — Tailwind v4 migration + service pages copywriting rewrite (online-consultations, treatment-abroad, checkup, contacts)
- v3.0: 24 requirements, 4 phases (29-32), 7 plans — 404 page + cross-page consistency, full SEO + Schema.org, local WebP + lazy loading + preload, WCAG AA accessible tokens + focus-visible + ARIA + prefers-reduced-motion
- Бренд MedicusUnion: международный медицинский сервис, Австрия + Казахстан
- Контакты: +7 701 532 24 78, kz@medicusunion.com
- Стоимость консультации: от 450€

## Constraints

- **Stack**: HTML + Tailwind CSS v4 (CLI standalone) + JS — Tailwind для pixel-perfect match с Redesign прототипом
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
| Gradient CTA (#1AC67E→#0D9DB5) + opacity hover | Matches medicusunion.kz exactly; opacity hover avoids gradient direction reversal | ✓ Good — v1.3 |
| Flat card design (no box-shadow) | Aligns with medicusunion.kz reference — cleaner, lighter feel for medical context | ✓ Good — v1.3 |
| Mint badge palette as CSS tokens | Reusable tokens (#d0fae4/#007955) decouple badge style from primary palette | ✓ Good — v1.3 |
| [data-theme="dark"] attribute selector for dark mode | CSS token cascade, no class juggling, ES5-compatible JS toggle | ✓ Good — v1.4 |
| Default-light policy; prefers-color-scheme as first-visit hint only | ЦА 45+ associates light interface with medical authority | ✓ Good — v1.4 |
| Max 2 glass elements per viewport; blur ≤12px | GPU budget constraint for budget Android devices dominant in KZ market | ✓ Good — v1.4 |
| Dark mode disables backdrop-filter (glass-off) | Murky smear on navy #0F1923; opaque surface better on dark backgrounds | ✓ Good — v1.4 |
| translateY(20px) not 40px+ for scroll-reveal | 20px is within safe vestibular parameters for 45+ audience | ✓ Good — v1.4 |
| prefers-reduced-motion: transform: none, not just duration:0 | Duration-zero still causes snap from offset — explicit reset prevents any motion | ✓ Good — v1.4 |
| Tailwind CSS v4 standalone CLI binary | Pixel-perfect parity with Redesign/ TSX prototype, no Node.js runtime, single executable for CI/deploy | ✓ Good — v2.0 |
| Service-page rewrite from копирайтинг-документы first, then code | Locks brand voice and conversion framing before HTML — prevents cosmetic-only refactors | ✓ Good — v2.0 |
| Local WebP over Unsplash CDN | Data sovereignty (medical imagery), -57% bytes, no third-party SLA risk on KZ 3G/4G | ✓ Good — v3.0 |
| Schema.org MedicalBusiness JSON-LD on index only | Single source of truth — service pages aren't separate businesses | ✓ Good — v3.0 |
| Two-token CTA gradient (mu-cta-from / mu-cta-to) | Allows accessible-contrast variant without breaking visual brand identity | ✓ Good — v3.0 |
| Global focus-visible CSS rule (not per-component) | Single override propagates to all 6 pages without component churn | ✓ Good — v3.0 |
| nbsp binding for Russian subject+verb pairs (rather than CSS only) | CSS `text-wrap: balance` is unreliable for Cyrillic; explicit nbsp guarantees orphan prevention across browsers | ✓ Good — v3.0 |
| Responsive `<br class="md:hidden">` for hero headings | Lets Russian compound phrases break correctly on mobile without JS | ✓ Good — v3.0 |

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
*Last updated: 2026-04-06 after v3.0 milestone completion*
