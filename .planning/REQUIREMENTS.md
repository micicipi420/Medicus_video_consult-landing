# v6.0 Next.js Stack Migration — Requirements

**Milestone:** v6.0
**Created:** 2026-04-10
**Status:** Active

## Scaffold & Foundation

- [ ] **SCAF-01**: Next.js 15 App Router проект инициализирован с TypeScript, ESLint, Tailwind CSS v4
- [ ] **SCAF-02**: Все CSS glass-токены (liquid-bg, liquid-blur-*, liquid-saturate, liquid-brightness, shadow-*, tint-*) перенесены в Tailwind config и рендерятся идентично текущему сайту
- [ ] **SCAF-03**: shadcn/ui инициализирован с базовыми компонентами (Button, Card, Input, Select, Textarea, Dialog)
- [ ] **SCAF-04**: Glass CSS (liquid-glass.css, squircles.css) подключены как global styles и работают через className на React-компонентах
- [ ] **SCAF-05**: Root layout содержит header, footer, mobile-menu, sticky-bar, svg-defs как React-компоненты (замена splicer partials)

## Page Migration

- [ ] **PAGE-01**: index.html перенесён как Next.js page с SSG, все 13 секций отрендерены как React-компоненты с 1:1 визуальным соответствием
- [ ] **PAGE-02**: contacts.html перенесён как Next.js page с SSG, форма и карточки координатора рендерятся с glass-эффектами
- [ ] **PAGE-03**: SEO metadata (title, description, Open Graph) для обеих страниц через Next.js Metadata API

## Animations

- [ ] **ANIM-01**: Framer Motion подключен, scroll-reveal анимации (translateY + fade) работают на всех секциях index page
- [ ] **ANIM-02**: Hero entrance анимация (staggered fade-in заголовка, подзаголовка, CTA, карточек) через Framer Motion
- [ ] **ANIM-03**: Hover/press interaction states на glass-карточках через Framer Motion (brightness, scale)
- [ ] **ANIM-04**: Specular mouse-tracking highlight на liquid-card элементах (перенос initMouseSpecular)

## Backend & Data

- [ ] **DATA-01**: Drizzle ORM схема `submissions` таблицы соответствует текущей Directus коллекции (name, phone, specialization, description, status, date_created)
- [ ] **DATA-02**: Next.js Server Action для отправки формы с Zod валидацией и honeypot spam protection
- [ ] **DATA-03**: Базовая /admin страница для просмотра заявок (таблица с фильтрацией по статусу и дате)

## Deployment

- [ ] **DOCK-01**: Docker Compose конфигурация: Next.js standalone + PostgreSQL, работает через `docker compose up`
- [ ] **DOCK-02**: Multi-stage Dockerfile с корректным копированием public/ и .next/static/, node:20-slim base

## Future Requirements

- Dark mode с cookie-based FOUC prevention (middleware approach) — v6.1
- Остальные 5 страниц (online-consultations, treatment-abroad, checkup, 404, styleguide) — v6.1
- liquidGL WebGL refraction на hero — v6.2 (LOW confidence, нужно тестирование)
- Page transition анимации (AnimatePresence) — v6.2 (open Next.js bugs)
- Data migration script из Directus — v6.1
- Admin auth (login/password) — v6.1

## Out of Scope

- Казахский язык — только русский
- CRM функциональность — только просмотр заявок
- Онлайн-оплата — только заявка на консультацию
- Mobile app / PWA — web only
- @squircle-js/react — CSS squircles достаточно (research recommendation)
- Turbopack — используем Webpack для production (Turbopack backdrop-filter bug #78302)

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| SCAF-01 | TBD | Pending |
| SCAF-02 | TBD | Pending |
| SCAF-03 | TBD | Pending |
| SCAF-04 | TBD | Pending |
| SCAF-05 | TBD | Pending |
| PAGE-01 | TBD | Pending |
| PAGE-02 | TBD | Pending |
| PAGE-03 | TBD | Pending |
| ANIM-01 | TBD | Pending |
| ANIM-02 | TBD | Pending |
| ANIM-03 | TBD | Pending |
| ANIM-04 | TBD | Pending |
| DATA-01 | TBD | Pending |
| DATA-02 | TBD | Pending |
| DATA-03 | TBD | Pending |
| DOCK-01 | TBD | Pending |
| DOCK-02 | TBD | Pending |
