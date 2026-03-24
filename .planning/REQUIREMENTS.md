# Requirements: MedicusUnion KZ Landing

**Defined:** 2026-03-24
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## v1.4 Requirements

2025 visual redesign: glassmorphism, dark mode, bold typography, micro-animations — filtered through 45+ medical audience constraints. All changes are additive; no structural changes to HTML sections or JS architecture.

### Dark Mode

- [x] **DM-01**: Кнопка переключения темы в sticky-навигации — `aria-pressed`, touch-target ≥44px, видимая текстовая метка рядом с иконкой
- [x] **DM-02**: CSS-блок `[data-theme="dark"]` с токенами для всех цветовых пар; все пары прошли контраст-аудит WCAG AA до применения в компонентах
- [x] **DM-03**: Inline `<script>` в `<head>` (ES5) для чтения localStorage перед первым рендером — устраняет FOUC при переходе между сессиями
- [x] **DM-04**: Тема по умолчанию — всегда светлая; `localStorage` управляет выбором; `prefers-color-scheme` — только подсказка при первом визите

### Typography

- [x] **TYPO-01**: h1 → `clamp(40px, 5vw, 56px)` / font-weight 800; h2 → `clamp(28px, 3.5vw, 44px)` / font-weight 800 (Manrope Variable уже загружен)
- [x] **TYPO-02**: `text-wrap: balance` на всех заголовках секций; отсутствие однословных «сирот» в кириллических заголовках на 320px и 390px

### Glassmorphism

- [x] **GLASS-01**: CSS gradient mesh фон в секции hero (реализует визуальный слой под стеклянными элементами)
- [x] **GLASS-02**: Glassmorphism на `.site-header.is-scrolled` — `backdrop-filter: blur(8-12px) saturate(180%)`, минимальная opacity фона 0.75
- [x] **GLASS-03**: Glassmorphism на pricing-карточке — CSS-модификатор `.card--glass`; не более 2 стеклянных элементов на viewport
- [x] **GLASS-04**: Fallback через `@supports not (backdrop-filter: blur(1px))` — сплошной цвет; тест прокрутки при 4x CPU throttle ≥50fps перед сдачей фазы

### Micro-Animations

- [ ] **ANIM-01**: `translateY(20px → 0)` добавлен к начальному состоянию `.animate-on-scroll` поверх существующего fade
- [ ] **ANIM-02**: Кнопки CTA — `:active { transform: scale(0.97) }` с 100ms transition для тактильного подтверждения клика
- [ ] **ANIM-03**: Глобальный guard `prefers-reduced-motion` покрывает все новые анимации (включая сброс `transform: none`, не только `duration: 0`); итого различных типов анимаций на странице ≤5

## v2+ Requirements

Deferred to future release.

- **LANG-01**: Казахский язык (двуязычный лендинг)
- **ANALYTICS-01**: Интеграция с системой аналитики (Яндекс.Метрика / GA)
- **NOTIF-01**: Email-уведомления при новой заявке через Directus Flows
- **GLASS-05**: Тёмная тема — отдельная SVG-версия hero-иллюстрации или CSS filter для duotone (отложено после Phase 1 UX-валидации)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Параллакс | PROJECT.md: явно вне скоупа; вестибулярный риск для 35%+ аудитории 45+ |
| Тёмная тема по умолчанию | Аудитория 45+ ассоциирует светлый интерфейс с медицинским авторитетом |
| Анимированные счётчики статистики | Когнитивная нагрузка; дезориентирующий эффект для целевой аудитории |
| Full-page glassmorphism | GPU-перегрузка на бюджетных Android (доминируют в KZ-рынке) |
| CSS `animation-timeline` как основной механизм | Не Baseline; IntersectionObserver — надёжный baseline для этой аудитории |
| Pure #000000 тёмный фон | Галация (гало вокруг текста) при астигматизме — высокая распространённость 45+ |
| View Transitions API | Дополнительная сложность при минимальном выигрыше |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DM-01 | Phase 20 | Complete |
| DM-02 | Phase 20 | Complete |
| DM-03 | Phase 20 | Complete |
| DM-04 | Phase 20 | Complete |
| TYPO-01 | Phase 21 | Complete |
| TYPO-02 | Phase 21 | Complete |
| GLASS-01 | Phase 22 | Complete |
| GLASS-02 | Phase 22 | Complete |
| GLASS-03 | Phase 22 | Complete |
| GLASS-04 | Phase 22 | Complete |
| ANIM-01 | Phase 23 | Pending |
| ANIM-02 | Phase 23 | Pending |
| ANIM-03 | Phase 23 | Pending |

**Coverage:**
- v1.4 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after roadmap creation*
