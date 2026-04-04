---
status: testing
phase: 01-apply-redesign-from-redesign-folder-to-main-project
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md, 01-06-SUMMARY.md, 01-07-SUMMARY.md]
started: 2026-04-04T04:30:00Z
updated: 2026-04-04T04:30:00Z
---

## Current Test

number: 1
name: Homepage loads with glassmorphism design
expected: |
  Open index.html — you see an animated mesh background with colored blobs, a floating glass header with "MedicusUnion" gradient logo, nav links (Услуги, Почему мы, Контакты), phone number, and "Оставить заявку" CTA button.
awaiting: user response

## Tests

### 1. Homepage loads with glassmorphism design
expected: Open index.html — you see an animated mesh background with colored blobs, a floating glass header with "MedicusUnion" gradient logo, nav links, phone number, and "Оставить заявку" CTA.
result: [pending]

### 2. Hero section with photo composition
expected: Below the header — a 2-column layout. Left: badge pill "Европейский стандарт медицины", large heading with gradient text "наш приоритет", subtitle, two CTA buttons, trust indicators. Right: overlapping doctor photos with floating badges (500+ doctors, 4.9/5 rating).
result: [pending]

### 3. Stats section with animated counters
expected: Scroll past hero — 4 glass cards appear showing numbers (43, 11, 500+, 15+). Numbers count up from zero when you scroll to them.
result: [pending]

### 4. Services section with 3 cards
expected: 3 service cards with images at top, icon overlays, badges (от 450 €, 100+ клиник, от $350), feature lists, and glass CTA buttons. Cards have hover lift effect.
result: [pending]

### 5. FAQ accordion
expected: 6 expandable FAQ items. Click a question — answer slides open with chevron rotation. Click again — closes.
result: [pending]

### 6. Contact form works
expected: Contact section shows coordinator "Айгерим" card on left. Right side has a glass form with name, phone, interest dropdown, description. Phone input applies mask. Submit button says "Отправить заявку".
result: [pending]

### 7. Navigation between pages
expected: Click "Онлайн-консультации" in footer → opens online-consultations.html with service-specific hero, features, steps. Click header "Оставить заявку" → opens contacts.html with centered form.
result: [pending]

### 8. Service pages content
expected: treatment-abroad.html shows country cards and included services. checkups.html shows 3 pricing programs (Basic $350, Expanded $800, Premium $2500). All pages have consistent header/footer.
result: [pending]

### 9. Mobile layout (375px)
expected: In Chrome DevTools at 375px: single-column layouts, hamburger menu button replaces nav, sticky bottom bar with phone + CTA visible at bottom of screen.
result: [pending]

### 10. Scroll header effect
expected: On scroll, the glass header gains slightly more opacity/blur. Header stays fixed at top throughout scrolling.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0
blocked: 0

## Gaps
