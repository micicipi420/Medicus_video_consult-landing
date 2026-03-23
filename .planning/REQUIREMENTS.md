# Requirements: MedicusUnion KZ Landing

**Defined:** 2026-03-23
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.

## v1.3 Requirements

Requirements for KZ design alignment with medicusunion.kz. Each maps to roadmap phases.

### Buttons & CTA

- [ ] **BTN-04**: CTA кнопки имеют градиентный фон green→teal (#1AC67E → #0D9DB5) вместо solid green
- [ ] **BTN-05**: Border-radius кнопок 16px вместо pill-shape 100px
- [ ] **BTN-06**: Hover-состояние CTA — opacity transition или shift к #00c08e

### Cards & Components

- [ ] **CARD-04**: Border-radius карточек увеличен до 30px (с 20px)
- [ ] **CARD-05**: Тени карточек полностью убраны — flat design без box-shadow
- [ ] **CARD-06**: Мятные бейджи (#d0fae4) с текстом #007955 для меток и тегов

### Layout & Spacing

- [ ] **LAYOUT-01**: Контейнер расширен до max-width 1200px
- [ ] **LAYOUT-02**: Hero-фон белый (#ffffff) вместо кремового (#fffbf4)

### Navigation

- [ ] **NAV-01**: Навигация с белым фоном и высотой 76px на desktop

### Design Tokens

- [ ] **TOKEN-02**: CSS-градиент токен для CTA (--gradient-cta) и обновлённые цветовые переменные

## v2 Requirements

Deferred to future release.

- **LANG-01**: Казахский язык (двуязычный лендинг)
- **ANALYTICS-01**: Интеграция с системой аналитики (Яндекс.Метрика / GA)
- **NOTIF-01**: Email-уведомления при новой заявке через Directus Flows

## Out of Scope

| Feature | Reason |
|---------|--------|
| Шрифт TildaSans | medicusunion.kz использует шрифт Tilda (проприетарный), мы сохраняем Inter/Manrope |
| Полная структура страницы с .kz | Копируем только визуальные паттерны, не контент и layout секций |
| Tilda page builder | Наш стек — vanilla HTML/CSS/JS, копируем стиль, не платформу |
| Форма как на .kz (name/phone/email/messenger) | Наша форма уже работает с Directus, сохраняем текущие поля |
| Секции 646-758px высотой | Фиксированная высота секций не подходит для responsive design |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-02 | TBD | Pending |
| BTN-04 | TBD | Pending |
| BTN-05 | TBD | Pending |
| BTN-06 | TBD | Pending |
| CARD-04 | TBD | Pending |
| CARD-05 | TBD | Pending |
| CARD-06 | TBD | Pending |
| LAYOUT-01 | TBD | Pending |
| LAYOUT-02 | TBD | Pending |
| NAV-01 | TBD | Pending |

**Coverage:**
- v1.3 requirements: 10 total
- Mapped to phases: 0
- Unmapped: 10

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after initial definition*
