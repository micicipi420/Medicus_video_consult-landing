# Requirements: MedicusUnion KZ Landing

**Defined:** 2026-03-23
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## v1.1 Requirements

Requirements for visual polish and conversion boost. Each maps to roadmap phases.

### Hero & First Screen

- [x] **HERO-01**: Hero-секция содержит реальную фотографию врача или качественную медицинскую иллюстрацию вместо абстрактного SVG
- [x] **HERO-02**: CTA-кнопки увеличены для ЦА 45+ (min-height 56px, font-size 18px)
- [x] **HERO-03**: Фон hero-секции визуально отделён от остальной страницы (gradient или контрастный цвет)

### Layout & Contrast

- [x] **LAYOUT-01**: Секции визуально чередуются (белый / светло-серый / accent фоны)
- [x] **LAYOUT-02**: Wave-разделители между секциями усилены (больше контраст, заметнее)
- [x] **LAYOUT-03**: Pricing-карточка центрирована на desktop с визуальным акцентом (тень, badge)
- [x] **LAYOUT-04**: Форма на desktop имеет двухколоночный layout (описание слева, форма справа) с фоновым контрастом

### Navigation

- [x] **NAV-01**: Header становится sticky при скролле
- [x] **NAV-02**: Header содержит навигационные ссылки на ключевые секции (Как это работает / Врачи / Цена / Заявка)

### Social Proof

- [x] **PROOF-01**: Блок с ключевыми числами (количество консультаций, врачей, стран) между hero и секцией «Знакомо?»

### Visual Consistency

- [ ] **VIS-01**: SVG-флаги стран вместо emoji в секции «Врачи»
- [ ] **VIS-02**: Секция «Знакомо?» компактнее — pain points с иконками вместо бордер-блоков

## v2 Requirements

Deferred to future release.

- **LANG-01**: Казахский язык (двуязычный лендинг)
- **ANALYTICS-01**: Интеграция с системой аналитики (Яндекс.Метрика / GA)
- **NOTIF-01**: Email-уведомления при новой заявке через Directus Flows

## Out of Scope

| Feature | Reason |
|---------|--------|
| Параллакс / тяжёлые анимации | ЦА 45+, предпочитаем простоту и производительность |
| Видео в hero | Тяжёлый ресурс, ухудшает загрузку на мобильных |
| A/B тестирование | Требует серверную инфраструктуру, преждевременно |
| Чат-бот / live chat | Медицинские вопросы через чат = ответственность |
| Профили врачей на лендинге | Ссылка на medicusunion.com/doctors |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 11 | Complete |
| HERO-02 | Phase 11 | Complete |
| HERO-03 | Phase 11 | Complete |
| LAYOUT-01 | Phase 13 | Complete |
| LAYOUT-02 | Phase 13 | Complete |
| LAYOUT-03 | Phase 13 | Complete |
| LAYOUT-04 | Phase 13 | Complete |
| NAV-01 | Phase 12 | Complete |
| NAV-02 | Phase 12 | Complete |
| PROOF-01 | Phase 11 | Complete |
| VIS-01 | Phase 14 | Pending |
| VIS-02 | Phase 14 | Pending |

**Coverage:**
- v1.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
