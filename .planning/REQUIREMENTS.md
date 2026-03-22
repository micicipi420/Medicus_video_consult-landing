# Requirements: MedicusUnion KZ Landing

**Defined:** 2026-03-23
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Structure & Content

- [ ] **STRUC-01**: Лендинг содержит все 11 секций по ТЗ: Hero, Проблема, Что вы получите, Как это работает, Кто консультирует, Почему через нас, Когда нужна консультация, Стоимость, Форма заявки, FAQ, Финальный призыв + Footer
- [ ] **STRUC-02**: Hero-секция с заголовком «Мнение немецкого врача — за 5 дней, без перелёта», подзаголовком и CTA-кнопкой «Получить консультацию — от 450€»
- [ ] **STRUC-03**: Секция «Проблема» с тремя короткими абзацами — триггер узнавания
- [ ] **STRUC-04**: Секция «Что вы получите» — 4 карточки: второе мнение, план действий, письменное заключение, ответы на вопросы
- [ ] **STRUC-05**: Секция «Как это работает» — 3 шага: загрузка документов, изучение врачом, видеоконсультация
- [ ] **STRUC-06**: Секция «Кто консультирует» — врачи из 7 стран, специализации, ссылка на medicusunion.com/doctors
- [ ] **STRUC-07**: Секция «Почему через нас» — 4 карточки преимуществ: перевод документов, перевод на консультации, приложение, организация лечения
- [ ] **STRUC-08**: Секция «Когда нужна консультация» — 5 сценариев-триггеров с чекбоксами/иконками
- [ ] **STRUC-09**: Секция «Стоимость» — от 450€, список включённого в стоимость
- [ ] **STRUC-10**: Секция FAQ — аккордеон, 6 вопросов-ответов по ТЗ
- [ ] **STRUC-11**: Секция «Финальный призыв» — заголовок + 2 CTA-кнопки
- [ ] **STRUC-12**: Footer — контакты, телефон, email, ссылки App Store / Google Play, юридическая информация

### Design & UX

- [ ] **UX-01**: Mobile-first адаптивный дизайн (мобильная, планшетная, десктоп версии)
- [ ] **UX-02**: Шрифт тела текста минимум 18px, заголовки 28-36px (ЦА 45+)
- [ ] **UX-03**: Touch targets минимум 48x48px на мобильных
- [ ] **UX-04**: Цветовая схема по брендбуку: #38C6F4 (голубой), #35B678 (зелёный), #18212C (тёмный)
- [ ] **UX-05**: Шрифты Inter + Manrope, self-hosted WOFF2
- [ ] **UX-06**: Спокойный уверенный тон — без агрессивного маркетинга, без countdown-таймеров
- [ ] **UX-07**: Высокий контраст текста на фоне (WCAG AA минимум)

### Navigation & Interaction

- [ ] **NAV-01**: CTA-кнопки скроллят к секции формы (smooth scroll)
- [ ] **NAV-02**: Sticky mobile CTA bar — кнопка «Оставить заявку» + телефон видны при скролле
- [ ] **NAV-03**: Click-to-call телефон (+7 701 532 24 78) в хедере, sticky bar и футере
- [ ] **NAV-04**: FAQ реализован как аккордеон (раскрытие/свёртывание по клику)

### Form

- [ ] **FORM-01**: Форма заявки с полями: Имя, Телефон, Специализация (дропдаун), Описание случая (необязательно)
- [ ] **FORM-02**: Телефон с предзаполненным +7, маска ввода, валидация казахстанского номера
- [ ] **FORM-03**: Дропдаун специализаций: онкология, кардиология, нейрохирургия, ортопедия, радиология, ЭКО, другое
- [ ] **FORM-04**: Клиентская валидация полей с сообщениями об ошибках на русском
- [ ] **FORM-05**: Состояние успеха после отправки: «Спасибо, мы перезвоним в течение 24 часов»
- [ ] **FORM-06**: Микрокопии рядом с формой: «Бесплатно и без обязательств», «Ваши данные защищены»
- [ ] **FORM-07**: Защита от спама: honeypot-поле + проверка времени заполнения

### Backend (Directus)

- [ ] **BACK-01**: Directus 11 развёрнут через Docker Compose с PostgreSQL 16
- [ ] **BACK-02**: Коллекция `consultation_requests` с полями: name, phone, specialty, description, created_at, status
- [ ] **BACK-03**: Публичная роль с create-only доступом к коллекции заявок (read/update/delete запрещены)
- [ ] **BACK-04**: CORS настроен для продакшн-домена
- [ ] **BACK-05**: Форма отправляет данные на Directus REST API (`POST /items/consultation_requests`)

### Performance & SEO

- [ ] **PERF-01**: Загрузка страницы < 3 секунд на 3G
- [ ] **PERF-02**: Изображения в WebP с fallback, lazy-loading для below-fold контента
- [ ] **PERF-03**: Meta-теги: title, description, Open Graph для шеринга
- [ ] **PERF-04**: Семантический HTML: правильные heading levels, landmark regions, alt-тексты

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics & Tracking

- **ANLT-01**: Yandex.Metrica или Google Analytics с целями на отправку формы
- **ANLT-02**: UTM-метки на кнопках App Store / Google Play

### Content Enhancements

- **CONT-01**: Анимированные счётчики статистики (количество консультаций, стран, врачей)
- **CONT-02**: Текстовые отзывы пациентов (требуют реального контента от клиента)
- **CONT-03**: Schema.org MedicalOrganization markup

### Communication

- **COMM-01**: WhatsApp / Telegram кнопки для связи
- **COMM-02**: Email-уведомления при новой заявке (Directus Flows + SMTP)

### Localization

- **LOC-01**: Казахский язык — переключатель в шапке

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Онлайн-оплата | 450€ не импульсная покупка, нужен человеческий контакт. PCI compliance = огромная сложность |
| Профили врачей на лендинге | Создаёт burden по обновлению. Ссылка на medicusunion.com/doctors |
| Чат-бот / live chat | 45+ не доверяют ботам. Медицинские вопросы через чат — ответственность |
| Multi-step wizard форма | 4 поля не требуют визарда. Добавляет тревогу и сложность |
| Видео-отзывы | Медленная загрузка на мобильном, требуют продакшн-качества |
| Параллакс / тяжёлые анимации | Вызывают укачивание у 45+, замедляют загрузку |
| Интеграция с AmoCRM | Заменяем на Directus |
| Казахский язык в v1 | Фокус на русскоязычную аудиторию, казахский позже |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STRUC-01 | Phase 6: Navigation & Mobile Interaction | Pending |
| STRUC-02 | Phase 2: Hero & Problem Sections | Pending |
| STRUC-03 | Phase 2: Hero & Problem Sections | Pending |
| STRUC-04 | Phase 3: Value & Process Sections | Pending |
| STRUC-05 | Phase 3: Value & Process Sections | Pending |
| STRUC-06 | Phase 4: Trust & Authority Sections | Pending |
| STRUC-07 | Phase 4: Trust & Authority Sections | Pending |
| STRUC-08 | Phase 4: Trust & Authority Sections | Pending |
| STRUC-09 | Phase 5: Pricing, FAQ, Final CTA & Footer | Pending |
| STRUC-10 | Phase 5: Pricing, FAQ, Final CTA & Footer | Pending |
| STRUC-11 | Phase 5: Pricing, FAQ, Final CTA & Footer | Pending |
| STRUC-12 | Phase 5: Pricing, FAQ, Final CTA & Footer | Pending |
| UX-01 | Phase 6: Navigation & Mobile Interaction | Pending |
| UX-02 | Phase 1: Foundation & Design System | Pending |
| UX-03 | Phase 1: Foundation & Design System | Pending |
| UX-04 | Phase 1: Foundation & Design System | Pending |
| UX-05 | Phase 1: Foundation & Design System | Pending |
| UX-06 | Phase 2: Hero & Problem Sections | Pending |
| UX-07 | Phase 1: Foundation & Design System | Pending |
| NAV-01 | Phase 6: Navigation & Mobile Interaction | Pending |
| NAV-02 | Phase 6: Navigation & Mobile Interaction | Pending |
| NAV-03 | Phase 6: Navigation & Mobile Interaction | Pending |
| NAV-04 | Phase 5: Pricing, FAQ, Final CTA & Footer | Pending |
| FORM-01 | Phase 7: Lead Capture Form | Pending |
| FORM-02 | Phase 7: Lead Capture Form | Pending |
| FORM-03 | Phase 7: Lead Capture Form | Pending |
| FORM-04 | Phase 7: Lead Capture Form | Pending |
| FORM-05 | Phase 7: Lead Capture Form | Pending |
| FORM-06 | Phase 7: Lead Capture Form | Pending |
| FORM-07 | Phase 7: Lead Capture Form | Pending |
| BACK-01 | Phase 8: Directus Backend & Integration | Pending |
| BACK-02 | Phase 8: Directus Backend & Integration | Pending |
| BACK-03 | Phase 8: Directus Backend & Integration | Pending |
| BACK-04 | Phase 8: Directus Backend & Integration | Pending |
| BACK-05 | Phase 8: Directus Backend & Integration | Pending |
| PERF-01 | Phase 9: Performance & SEO | Pending |
| PERF-02 | Phase 9: Performance & SEO | Pending |
| PERF-03 | Phase 9: Performance & SEO | Pending |
| PERF-04 | Phase 9: Performance & SEO | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
