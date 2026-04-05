# Requirements: v3.0 SEO, Performance & Polish

## 404 Page

- [ ] **404-01**: 404.html с gradient "404", текстом "Страница не найдена", кнопкой "На главную" (из Redesign NotFoundPage.tsx)
- [ ] **404-02**: Общий header/footer/mesh/scripts как на остальных страницах

## SEO

- [ ] **SEO-01**: Каждая страница имеет уникальный title из копирайтинг-документов
- [ ] **SEO-02**: Каждая страница имеет уникальный meta description из копирайтинг-документов
- [ ] **SEO-03**: Open Graph теги (og:title, og:description, og:url, og:type, og:image) на каждой странице
- [ ] **SEO-04**: Canonical URL на каждой странице
- [ ] **SEO-05**: Структурированные данные Schema.org (Organization, MedicalBusiness) в JSON-LD на главной

## Performance

- [ ] **PERF-01**: Unsplash изображения заменены на локальные WebP файлы с оптимизированным размером
- [ ] **PERF-02**: Lazy loading (loading="lazy") на всех изображениях ниже fold
- [ ] **PERF-03**: Preload критичных ресурсов (CSS, шрифты) в head
- [ ] **PERF-04**: Motion CDN скрипт загружается с defer/async
- [ ] **PERF-05**: CSS минифицирован через Tailwind --minify (уже есть)

## UI Polish

- [ ] **UI-01**: Консистентный header/footer/mobile-menu/sticky-bar на всех 5 страницах (+ 404)
- [ ] **UI-02**: Все формы имеют honeypot spam protection
- [ ] **UI-03**: Все FAQ аккордеоны работают корректно (открытие/закрытие)
- [ ] **UI-04**: Все CTA-кнопки ведут на правильные страницы (проверка всех ссылок)

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
| 404-01..02 | TBD | TBD | pending |
| SEO-01..05 | TBD | TBD | pending |
| PERF-01..05 | TBD | TBD | pending |
| UI-01..04 | TBD | TBD | pending |
