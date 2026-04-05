# Requirements: v3.0 SEO, Performance & Polish

## 404 Page

- [x] **404-01**: 404.html с gradient "404", текстом "Страница не найдена", кнопкой "На главную" (из Redesign NotFoundPage.tsx)
- [x] **404-02**: Общий header/footer/mesh/scripts как на остальных страницах

## SEO

- [x] **SEO-01**: Каждая страница имеет уникальный title из копирайтинг-документов
- [x] **SEO-02**: Каждая страница имеет уникальный meta description из копирайтинг-документов
- [x] **SEO-03**: Open Graph теги (og:title, og:description, og:url, og:type, og:image) на каждой странице
- [x] **SEO-04**: Canonical URL на каждой странице
- [x] **SEO-05**: Структурированные данные Schema.org (Organization, MedicalBusiness) в JSON-LD на главной

## Performance

- [x] **PERF-01**: Unsplash изображения заменены на локальные WebP файлы с оптимизированным размером
- [x] **PERF-02**: Lazy loading (loading="lazy") на всех изображениях ниже fold
- [x] **PERF-03**: Preload критичных ресурсов (CSS, шрифты) в head
- [x] **PERF-04**: Motion CDN скрипт загружается с defer/async
- [x] **PERF-05**: CSS минифицирован через Tailwind --minify (уже есть)

## UI Polish

- [x] **UI-01**: Консистентный header/footer/mobile-menu/sticky-bar на всех 5 страницах (+ 404)
- [x] **UI-02**: Все формы имеют honeypot spam protection
- [x] **UI-03**: Все FAQ аккордеоны работают корректно (открытие/закрытие)
- [x] **UI-04**: Все CTA-кнопки ведут на правильные страницы (проверка всех ссылок)

## Accessibility & Design System Compliance (Phase 32)

- [x] **A11Y-01**: Accessible text color tokens (--mu-blue-text, --mu-accent-blue-text, --mu-accent-teal-text, --mu-accent-orange-text, --mu-green-text) добавлены в theme.css :root и @theme inline
- [x] **A11Y-02**: Neutral text tokens обновлены до WCAG AA: --mu-text-700 (#4A4E5C, 5.89:1), --mu-text-500 (#6B6F80, 4.50:1)
- [x] **A11Y-03**: Focus-visible ring на всех интерактивных элементах (a, button, input, select, textarea) через глобальное CSS правило
- [x] **A11Y-04**: CTA gradient использует accessible цвета (from-mu-cta-from to-mu-cta-to, 4.5:1+ для белого текста)
- [x] **A11Y-05**: Яркие акцентные цвета на readable text заменены на *-text варианты (text-mu-blue-text, hover:text-mu-blue-text и т.д.)
- [x] **A11Y-06**: Form error containers имеют role="alert" aria-live="polite" для screen reader анонсов
- [x] **A11Y-07**: @media (prefers-reduced-motion: reduce) правило отключает анимации и переходы
- [x] **A11Y-08**: Form containers используют bg-white/70 (Glass-5 spec) и shadow-form-inset token

## Future Requirements

- Dark mode для всех страниц
- Казахский язык
- A/B тестирование
- Аналитика (GTM/GA4)

## Out of Scope

- Dark mode — требует отдельного milestone для полной адаптации 5+ страниц
- Интерактивная карта клиник — ждём данные от клиента
- Скриншоты платформы — ждём от клиента
- App Store / Google Play ссылки — ждём от клиента

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| 404-01 | Phase 29 | 29-01 | done |
| 404-02 | Phase 29 | 29-01 | done |
| SEO-01 | Phase 30 | 30-01 | done |
| SEO-02 | Phase 30 | 30-01 | done |
| SEO-03 | Phase 30 | 30-01 | done |
| SEO-04 | Phase 30 | 30-01 | done |
| SEO-05 | Phase 30 | 30-01 | done |
| PERF-01 | Phase 31 | 31-01 | done |
| PERF-02 | Phase 31 | 31-01 | done |
| PERF-03 | Phase 31 | 31-02 | done |
| PERF-04 | Phase 31 | 31-02 | done |
| PERF-05 | Phase 31 | 31-02 | done |
| UI-01 | Phase 29 | 29-02 | done |
| UI-02 | Phase 29 | 29-02 | done |
| UI-03 | Phase 29 | 29-02 | done |
| UI-04 | Phase 29 | 29-02 | done |
| A11Y-01 | Phase 32 | 32-01 | pending |
| A11Y-02 | Phase 32 | 32-01 | pending |
| A11Y-03 | Phase 32 | 32-01 | pending |
| A11Y-04 | Phase 32 | 32-02 | pending |
| A11Y-05 | Phase 32 | 32-02 | pending |
| A11Y-06 | Phase 32 | 32-02 | pending |
| A11Y-07 | Phase 32 | 32-01 | pending |
| A11Y-08 | Phase 32 | 32-02 | pending |
