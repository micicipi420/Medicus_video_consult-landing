# Requirements: MedicusUnion KZ Landing

**Defined:** 2026-03-23
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.

## v1.2 Requirements

Requirements for brand visual alignment with medicusunion.com. Each maps to roadmap phases.

### Buttons & CTA

- [x] **BTN-01**: Все кнопки имеют pill-shape (border-radius: 100px) как на основном сайте
- [x] **BTN-02**: Primary CTA использует зелёный цвет бренда (#35B678) вместо голубого
- [x] **BTN-03**: Hover-состояние primary кнопки соответствует бренду (#25A467)

### Cards & Components

- [ ] **CARD-01**: Карточки имеют border-radius: 20px (вместо 12px)
- [ ] **CARD-02**: Hover-эффект карточек -- translateY(-2px) вместо scale(1.02)
- [ ] **CARD-03**: Тени карточек облегчены до уровня основного сайта

### Layout & Spacing

- [ ] **SPACE-01**: Секционные отступы увеличены до 100px на desktop
- [x] **SPACE-02**: Hero-фон заменён на тёплый кремовый (#fffbf4) как на основном сайте

### Design Tokens

- [x] **TOKEN-01**: CSS-переменные обновлены для согласованности с палитрой основного сайта (green primary CTA, warm background)

## v2 Requirements

Deferred to future release.

- **LANG-01**: Казахский язык (двуязычный лендинг)
- **ANALYTICS-01**: Интеграция с системой аналитики (Яндекс.Метрика / GA)
- **NOTIF-01**: Email-уведомления при новой заявке через Directus Flows

## Out of Scope

| Feature | Reason |
|---------|--------|
| Полная смена цветовой палитры на зелёную | Только primary CTA меняется на зелёный, остальные акценты (#38C6F4) остаются для визуального разнообразия |
| Смена шрифтов на только Inter | Manrope для заголовков -- осознанный выбор, отличающий лендинг от основного сайта |
| Копирование styled-components структуры | Основной сайт на React, наш -- vanilla HTML/CSS, копируем только визуальные паттерны |
| Добавление анимаций с основного сайта | ЦА 45+, предпочитаем простоту |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 | Phase 15 | Complete |
| BTN-01 | Phase 15 | Complete |
| BTN-02 | Phase 15 | Complete |
| BTN-03 | Phase 15 | Complete |
| SPACE-02 | Phase 15 | Complete |
| CARD-01 | Phase 16 | Pending |
| CARD-02 | Phase 16 | Pending |
| CARD-03 | Phase 16 | Pending |
| SPACE-01 | Phase 16 | Pending |

**Coverage:**
- v1.2 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
