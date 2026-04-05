---
type: quick
task: rewrite-index-html-main-page-copywriting
date: 2026-04-05
duration: 519s
key-files:
  modified:
    - index.html
    - css/styles.css
  source:
    - ~/Downloads/MedicusUnion_Main_Page_Copy.md
commits:
  - hash: b3cf635
    message: "feat: rewrite index.html with verbatim main page copywriting (11 sections)"
    files: [index.html, css/styles.css]
---

# Quick Task: Rewrite index.html with Main Page Copywriting

Complete rewrite of index.html content to match MedicusUnion_Main_Page_Copy.md verbatim -- all 11 sections + footer.

## What Changed

### SEO Meta
- Title: "MedicusUnion -- онлайн-консультации, лечение и чек-апы за рубежом | Казахстан"
- Description: verbatim from copywriting doc (Austrian platform, 43 clinics, 11 countries)

### Section 1: Hero
- Badge: "Австрийская медицинская компания с офисом в Казахстане"
- H1: "Европейские врачи, мировые клиники -- доступны из Казахстана"
- Subtitle: full MedicusUnion platform description
- CTA: "Обсудить мой случай бесплатно"
- Trust line: "MedicusUnion GmbH, Австрия ... 15+ лет опыта"

### Section 2: Three Service Cards
- H2: "Выберите, что вам нужно"
- Card 1: "Мнение зарубежного врача -- без перелёта" -> online-consultations.html
- Card 2: "Организуем лечение за границей -- под ключ" -> treatment-abroad.html
- Card 3: "Проверьте здоровье в клинике мирового уровня" -> checkup.html
- Each with full description, price line, and CTA button

### Section 3: Problem/Recognition
- H2: "Узнаёте свою ситуацию?"
- 4 cards: diagnosis uncertainty, treatment abroad, haven't checked, organizing for family

### Section 4: How It Works
- H2: "От обращения до результата -- 4 шага"
- Subtitle: "Вы занимаетесь здоровьем..."
- 4 step cards with full verbatim descriptions

### Section 5: Why MedicusUnion
- H2: "Чем мы отличаемся"
- 5 blocks: platform, 43 clinics, legal, data protection, continuity

### Section 6: Clinics
- H2: "Клиники, с которыми мы работаем"
- 8 country cards with REAL clinic names from doc
- Footer note about extended network

### Section 7: Platform
- H2: "Ваши документы, снимки и связь с врачом -- в одном месте"
- 5 bullet points, iOS/Android mention, ISO 27001/GDPR

### Section 8: Reviews
- H2: "Пациенты, которые прошли этот путь"
- 4 testimonials: Ренат, Жанна, Андрей, Арина -- all verbatim

### Section 9: FAQ
- H2: "Частые вопросы"
- 7 Q&A pairs: all verbatim from doc
- Uses .faq__item/.faq__question classes for accordion JS

### Section 10: Form
- H2: "Обсудите ваш случай -- бесплатно и без обязательств"
- Fields: Имя, Телефон, dropdown (4 options incl. "Не знаю -- помогите разобраться"), description
- Uses class="contact-form" for JS binding
- Under-form: "Мы перезвоним ... ISO 27001"

### Section 11: Final CTA
- H2: "Не откладывайте решение о здоровье"
- 2 buttons: "Обсудить мой случай" + "Позвонить: +7 701 532 24 78"
- Contact alternatives: email, WhatsApp, Telegram

### Footer
- Company: MedicusUnion GmbH, Bruno-Marek-Allee 20/50, 1020 Wien
- KZ entity: ТОО "MedicusUnion KZ", Алматы, Astana Hub
- Navigation: 7 links as specified
- App Store / Google Play buttons
- ISO 27001, GDPR badges

### Header/Navigation
- Updated nav links to match service pages (Консультации, Лечение, Чек-ап, О компании, Контакты)
- CTA button: "Обсудить случай" linking to #contact
- Mobile menu updated to match

### Sticky Bar
- Updated to link to #contact instead of contacts.html

## Technical Details
- Removed: stats section, guide section, pricing section, old "why us" section with collage, coordinator card
- Added: clinics section, platform section, reviews section (new sections from copywriting doc)
- Preserved: glass card patterns, mesh background, backdrop-blur, gradient text, FAQ accordion JS classes, form JS binding
- CSS rebuilt with `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None -- all content is verbatim from the copywriting document.

## Self-Check: PASSED
