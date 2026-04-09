# MedicusUnion KZ

## What This Is

Многостраничный сайт medicusunion.kz — веб-представительство международного медицинского сервиса в Казахстане. 6 страниц (главная, онлайн-консультации, лечение за рубежом, чекапы, контакты, 404), форма заявки, Directus-бэкенд, полная SEO-оптимизация, WCAG AA доступность, дизайн-система на Tailwind v4. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

## Core Value

Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## Current State

**Shipped:** v3.2 Build Pipeline & Chrome Partials (2026-04-08) — latest
**In progress:** v4.0 Liquid Design System — questioning → research → requirements → roadmap (started 2026-04-09)
**Codebase:** 6 production pages + 404 with shared chrome extracted to `partials/*.html` (single source of truth via POSIX-sh splicer, byte-identity gate enforced at commit time by pre-commit hook), `make build` canonical entry point, `docs/BUILD.md` contributor reference, full favicon set (ico/svg/apple-touch-icon/webmanifest) with 4 `<link>` tags in every page, 404 H1 sized to fit 320px mobile at the source (not via `overflow-x: clip` safety net), checkup.html "за 1–2 дня" range bound as single `whitespace-nowrap` unit across all viewports, browser console silent on first load of all 6 pages, full SEO/a11y baseline, vertical rhythm token system, mobile-first overflow safety net
**Stack:** HTML + Tailwind CSS v4 (CLI standalone, pinned v4.2.2) + vanilla JS + Motion CDN, Directus 11 + PostgreSQL 16 via Docker, nginx deploy target

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

- ✓ Shared chrome extracted to partials/{header,footer,sticky-bar,mobile-menu}.html as single source of truth — v3.2 (LAYOUT-01/02/05)
- ✓ POSIX-sh + awk marker splicer (scripts/build-pages.sh) with 11-token substitution vocabulary — v3.2 (LAYOUT-02)
- ✓ make build canonical entry point + build.sh thin delegator + Makefile with 5 targets — v3.2 (LAYOUT-03/04)
- ✓ Byte-identity smoke test: rebuild produces 6 pages byte-for-byte, zero drift (LAYOUT-12) — v3.2
- ✓ 7th-page 0-edit invariant verified: new pages require only body + BUILD markers — v3.2 (LAYOUT-11)
- ✓ Pre-commit hook (scripts/hooks/pre-commit) enforces byte-identity gate on every commit — v3.2 (LAYOUT-13)
- ✓ 404.html H1 fits 320px viewport at the source (text-3xl mobile step-down) — v3.2 (COSMETIC-01)
- ✓ Full favicon set (ico/svg/apple-touch-icon/webmanifest) at repo root + 4 link tags in all 6 pages — v3.2 (COSMETIC-02)
- ✓ checkup.html "за 1–2 дня" numeric range bound as single whitespace-nowrap unit across all viewports — v3.2 (COSMETIC-03)

### Active

**v4.0 Liquid Design System** (requirements being defined):
- Responsive grid foundation — 12/8/2-3 col (desktop/tablet/mobile), все элементы на 6 страницах привязаны к сетке
- Squircle primitives — universal replacement всех border-radius на superellipse shapes (кнопки, карточки, инпуты, badge, nav, mobile menu, form, hero, avatars, flags)
- Liquid Design tokens & компоненты — specular highlights, refraction gradients, real-time blur, Liquid materials под Apple HIG iOS 26 / macOS Tahoe
- Design system документация — `docs/DESIGN-SYSTEM.md` + возможно визуальный reference styleguide page
- Page migration — новый визуальный язык применён ко всем 6 страницам через партиалы

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

## Current Milestone: v4.0 Liquid Design System

**Goal:** Переработать визуальный язык всех 6 страниц под Apple Liquid Design — responsive grid foundation, squircle primitives вместо всех rounded rectangles, Liquid Glass материалы/highlights/refraction во всех поверхностях, документированная дизайн-система.

**Target features:**
- **Grid foundation** — responsive 12/8/2-3 col система (desktop/tablet/mobile), CSS grid tokens в theme.css, все секции и элементы на всех 6 страницах привязаны к колонкам
- **Squircle primitives** — universal replacement всех border-radius на superellipse shapes. Кнопки (CTA/secondary/icon), карточки, инпуты, badge'и, nav pill, mobile menu, form container, hero-иллюстрации, photo-avatars, flag-иконки. Implementation technique TBD в research-фазе
- **Liquid Design tokens & компоненты** — specular highlights, refraction gradients, real-time/динамический blur, Liquid materials из Apple HIG iOS 26 / macOS Tahoe. Новые CSS tokens в theme.css + Tailwind `@theme inline`
- **Design system документация** — `docs/DESIGN-SYSTEM.md` + возможно визуальный reference styleguide page с инвентарём компонентов
- **Page migration** — применить новый визуальный язык ко всем 6 страницам (index, online-consultations, treatment-abroad, checkup, contacts, 404) через партиалы где возможно

**Key context:**
- **Perf budget relaxed:** v4.0 осознанно отменяет v1.4 constraint "max 2 glass elements per viewport, blur ≤12px". Budget Android (доминирующее устройство ЦА 45+ в KZ) получит worse experience — это сознательный trade-off в пользу визуальной планки. Полное обоснование залогировано в Key Decisions
- **References:** iOS 26 / macOS Tahoe (Liquid Glass OS), apple.com marketing, Apple HIG docs (developer.apple.com), Linear / Vercel / Stripe (web Apple-idiom adaptation)
- **Squircle implementation:** technique TBD в research-фазе — кандидаты: CSS `corner-shape` (experimental), SVG clipPath, CSS `mask-image`, или hybrid с graceful degradation. Research обязателен
- **Stack constraint:** zero-Node сохраняется — Tailwind v4 standalone CLI, vanilla JS, никаких фреймворков
- **Build pipeline:** v3.2 партиалы + POSIX-sh splicer + byte-identity pre-commit hook сохраняются и используются для multi-page миграции
- **Grid convention:** 8-col tablet (не 6, не 12) — подтверждено user intent на kickoff, зафиксировано как project convention

## Shipped: v3.2 Build Pipeline & Chrome Partials (2026-04-08)
- 2 phases (39, 40), 6 plans, 32 commits, 20 source files changed (+891/-69)
- Eliminated chrome drift at the source: `partials/{header,footer,sticky-bar,mobile-menu}.html` as single source of truth, POSIX-sh + awk marker splicer with 11-token substitution vocabulary, byte-identity gate proven and enforced at commit time by first-ever repo pre-commit hook
- `make build` canonical entry point + `build.sh` thin delegator + `docs/BUILD.md` contributor reference; Tailwind v4.2.2 pinned and auto-installed via `make install-tailwind` target
- UX cosmetic cleanup (residual items from v3.1 Phase 38.1 Playwright audit): 404.html H1 fits 320px at the source (not via overflow-x clip safety net), full favicon set (ico/svg/apple-touch-icon/webmanifest) with 4 `<link>` tags in every page, checkup.html "за 1–2 дня" wrapped in Tailwind `whitespace-nowrap` span — en-dash U+2013 preserved
- Browser console silent on first load of all 6 pages (previously: favicon 404 on 404.html); verified via curl + Playwright MCP DOM assertions

## Shipped: v3.1 Site Foundation & Audit Fixes (2026-04-08)
- 7 phases (33–38 + 38.1 corrective fix), 45/52 requirements delivered, 7 deferred to v3.2 Phase 36b
- 14 credibility audit fixes (data unification, sticky-bar, typography, stat bar, H1 em-dash)
- Shared layout chrome drift-normalized across 5 pages (partials extraction deferred to Phase 36b)
- Full site metadata hygiene (sitemap.xml, robots.txt, canonical audit, circle-flags vendored, 404 upgrade)
- Vertical rhythm & hero sizing system (svh-based tokens, content-density tiers)
- Phase 38.1 corrective: mobile viewport overflow safety net (`html { overflow-x: clip }`), nbsp cleanup, checkup H1 gradient-span split, 3 SVG clipPath fixes — RHYTHM-10 verified 2026-04-08

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
- v3.1: 45/52 requirements, 7 phases (33–38 + 38.1), vertical rhythm + credibility audit fixes + Phase 38.1 corrective (mobile overflow safety net) — 7 LAYOUT deferred to v3.2
- v3.2: 11 requirements (8 LAYOUT + 3 COSMETIC), 2 phases (39, 40), 6 plans — chrome partials extraction + POSIX-sh marker splicer + byte-identity pre-commit hook + UX cosmetic cleanup (404 H1 mobile, favicon full set, checkup H1 range binding)
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
| Renamed project "MedicusUnion KZ Landing" → "MedicusUnion KZ" at v3.1 kickoff | By v3.0 the product was 6 pages, full design system, SEO/a11y baseline — "landing" framing undersold the artifact and limited how future growth was scoped. Directory name kept unchanged to avoid breaking git/CI/bookmarks | Expected good — unblocks multi-page architecture thinking (v3.1) |
| Phase 38 vertical-rhythm system over ad-hoc `min-h` values | User identified hero + section heights as "out of place" across all 5 pages; picking numbers per-page produces drift. A researched canonical system (benchmarks, 45+ audience viewport considerations) + tokens is the only fix that survives future page additions | Expected good — prerequisite for v3.2+ page additions (v3.1) |
| POSIX-sh + awk marker splicer over Node templating (Handlebars/Mustache/EJS) | Repo is deliberately zero-Node at runtime; `tailwindcss` standalone binary is the only tooling dependency. Shell-based splicing is sufficient for 4 chrome partials and keeps the build footprint minimal | ✓ Good — v3.2 (Phase 39-02) |
| BUILD marker comment pairs (`<!-- BUILD:name -->` / `<!-- /BUILD:name -->`) in HTML pages | Markers are ordinary HTML comments: invisible to browsers, preserved by formatters, trivially grep-able, and the splicer is a context-free regex replacement. No new syntax for contributors to learn | ✓ Good — v3.2 (Phase 39-02) |
| Pre-commit hook as byte-identity gate (first git hook in repo) | Manual `make build` discipline is unreliable; the hook makes chrome drift impossible at commit time. Dual-mode install (regular clones + worktrees) via symlink keeps setup to a single one-liner per clone | ✓ Good — v3.2 (Phase 39-03) |
| Tailwind v4.2.2 binary pinned + auto-installed by `make install-tailwind` | Reproducible builds across contributor machines without requiring a package manager or manual download. Binary is in `.gitignore`; install target is idempotent | ✓ Good — v3.2 (Phase 39-03) |
| 404 H1 mobile step-down (`text-4xl` → `text-3xl`) over `clamp()` fluid sizing | Tailwind step-function is already the project's typography pattern; introducing `clamp()` for one H1 would be a pattern fork. The single-class change also preserves the subject+verb nbsp binding trivially | ✓ Good — v3.2 (Phase 40, COSMETIC-01) |
| Hand-download Tilda production PNG once, commit derivatives, forbid runtime hotlinking | Supply-chain hygiene: the downloaded PNG source is logged with SHA256 in the summary, derivatives (ico/apple-touch/svg) ship as permanent assets. No runtime dependency on Tilda CDN, no external URL in any `<link>` tag | ✓ Good — v3.2 (Phase 40, COSMETIC-02) |
| Python Pillow as ImageMagick fallback for one-shot raster pipeline | ImageMagick was not installed and adds a heavy dependency. Pillow 11.3.0 was already present, produces real multi-size ICO via `Image.save(sizes=[(16,16),(32,32),(48,48)])`, and is dev-only (not a runtime dep) | ✓ Good — v3.2 (Phase 40, COSMETIC-02) |
| Tailwind `whitespace-nowrap` span for Russian numeric range binding | Alternative was `&nbsp;` entity glue inside the fragment (fragile, hard to audit), or a `<span style="white-space:nowrap">` inline style (inconsistent with utility-first CSS). Tailwind class is auditable via grep, no stylesheet pollution, and the generated CSS rule emits only when used | ✓ Good — v3.2 (Phase 40, COSMETIC-03) |
| **v4.0 Liquid Design System pivot → Major version bump** | После v3.2 codebase в здоровом состоянии (chrome unified via партиалы, vertical rhythm tokens, WCAG AA, build pipeline + byte-identity hook). User (2026-04-09) запросил фундаментальный pivot визуального языка: grid foundation (12/8/2-3) + universal squircles (все rounded rectangles) + Apple Liquid Design tokens/components + design system docs. Scope — не minor refinement, а полная эволюция визуального паттерна. Major version bump честно отражает глубину работы и объём миграции | Expected good — v4.0 (milestone kickoff 2026-04-09) |
| **v4.0 supersedes v1.4 GPU budget constraint** — relax "max 2 glass elements per viewport, blur ≤12px" everywhere | Apple Liquid Glass (iOS 26 / macOS Tahoe) — real-time refraction, specular highlights, dynamic blur — несовместим с v1.4 лимитом. User (2026-04-09) принял осознанный trade-off: визуальная планка нового дизайн-языка приоритетнее производительности на budget Android. ЦА 45+ в KZ частично сидит на старом железе и получит worse experience — это **известный и принятый риск**. Revisit policy: если post-ship телеметрия покажет массовый FPS < 30 на реальных устройствах, открываем v4.x minor milestone с graceful degradation. До тех пор — полный Liquid Glass на всех viewport'ах | Expected neutral — v4.0 (milestone kickoff 2026-04-09) |
| **Universal squircle replacement — все rounded rectangles → superellipse** | User (2026-04-09) явно запросил "абсолютно всё" — кнопки, карточки, инпуты, badge, nav, mobile menu, form, hero, avatars, flags. Альтернатива (selective replacement — только primary surfaces) была отклонена: частичная замена ломает визуальную когерентность Liquid языка. Implementation technique TBD в research-фазе (CSS `corner-shape` экспериментальный, SVG clipPath / CSS mask / hybrid — кандидаты) | Expected good — v4.0 (milestone kickoff 2026-04-09) |
| **8-column tablet grid (не 6, не 12)** | User explicitly chose 8 columns for tablet breakpoint при 12 desktop / 2-3 mobile. 8 — необычный выбор (6 или 8 встречаются, 12 доминирует), но user intent фиксируется как project convention: не challenge, не normalize. Зафиксировано на milestone kickoff чтобы избежать дрейфа при planning/execution | Expected good — v4.0 (milestone kickoff 2026-04-09) |

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
*Last updated: 2026-04-09 — milestone v4.0 Liquid Design System kickoff (questioning → research → requirements → roadmap)*
