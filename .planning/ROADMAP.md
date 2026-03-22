# Roadmap: MedicusUnion KZ Landing

## Overview

Build a high-converting landing page for medicusunion.kz that communicates "European doctor second opinion from home" within 3 seconds and captures consultation requests via a 4-field form backed by Directus. The build progresses from CSS foundation through content sections (top-to-bottom funnel order), then form UI, backend integration, and finally performance optimization. Each phase delivers a visually verifiable result.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Design System** - CSS variables, fonts, responsive grid, accessibility baselines
- [ ] **Phase 2: Hero & Problem Sections** - Above-the-fold hook and emotional trigger
- [ ] **Phase 3: Value & Process Sections** - What user gets and how it works
- [ ] **Phase 4: Trust & Authority Sections** - Doctor credentials, advantages, consultation scenarios
- [ ] **Phase 5: Pricing, FAQ, Final CTA & Footer** - Bottom-of-funnel content and closing sections
- [ ] **Phase 6: Navigation & Mobile Interaction** - Sticky bar, smooth scroll CTAs, click-to-call, full page assembly
- [ ] **Phase 7: Lead Capture Form** - Form UI, validation, phone masking, spam protection
- [ ] **Phase 8: Directus Backend & Integration** - Docker setup, collection schema, permissions, form-to-API wiring
- [ ] **Phase 9: Performance & SEO** - Image optimization, lazy loading, meta tags, semantic HTML audit

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: A solid CSS foundation exists so all subsequent sections render correctly on any device from day one
**Depends on**: Nothing (first phase)
**Requirements**: UX-02, UX-03, UX-04, UX-05, UX-07
**Success Criteria** (what must be TRUE):
  1. Page loads with Inter and Manrope fonts (self-hosted WOFF2, no external requests)
  2. CSS custom properties define brand colors (#38C6F4, #35B678, #18212C) and are used throughout
  3. Body text renders at minimum 18px, headings at 28-36px on all viewports
  4. All interactive elements have minimum 48x48px touch targets on mobile
  5. Text-to-background contrast passes WCAG AA on all color combinations used
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md -- Project scaffolding, font files, and CSS design system with all tokens
- [x] 01-02-PLAN.md -- Demo page for visual verification of typography, colors, and responsiveness

### Phase 2: Hero & Problem Sections
**Goal**: A visitor landing on the page immediately understands the service and feels emotionally recognized
**Depends on**: Phase 1
**Requirements**: STRUC-02, STRUC-03, UX-06
**Success Criteria** (what must be TRUE):
  1. Hero displays headline "Мнение немецкого врача -- за 5 дней, без перелёта" with subheading and CTA button
  2. CTA button text reads "Получить консультацию -- от 450 EUR" and is visually prominent
  3. Problem section presents three short recognition-trigger paragraphs in calm, confident medical tone
  4. Both sections render correctly on mobile (375px), tablet (768px), and desktop (1200px+)
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Hero section with headline, subheading, and CTA buttons
- [x] 02-02-PLAN.md — Problem section with recognition-trigger paragraphs

### Phase 3: Value & Process Sections
**Goal**: Visitor understands what they receive and how the consultation process works
**Depends on**: Phase 2
**Requirements**: STRUC-04, STRUC-05
**Success Criteria** (what must be TRUE):
  1. "What you get" section displays 4 cards: second opinion, action plan, written conclusion, Q&A answers
  2. "How it works" section displays 3 sequential steps: upload documents, doctor review, video consultation
  3. Both sections are responsive -- cards stack vertically on mobile, grid on desktop
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — "What you get" benefit cards section (4 cards, 2x2 grid)
- [x] 03-02-PLAN.md — "How it works" process steps section (3 numbered steps)

### Phase 4: Trust & Authority Sections
**Goal**: Visitor trusts that real, qualified European doctors will handle their case
**Depends on**: Phase 3
**Requirements**: STRUC-06, STRUC-07, STRUC-08
**Success Criteria** (what must be TRUE):
  1. "Who consults" section shows doctors from 7 countries with specializations and links to medicusunion.com/doctors
  2. "Why through us" section displays 4 advantage cards: document translation, consultation translation, app, treatment organization
  3. "When you need a consultation" section presents 5 scenario triggers with visual indicators (checkboxes/icons)
  4. All three sections render correctly across mobile, tablet, and desktop
**Plans**: 2 plans

Plans:
- [ ] 04-01: Doctor credentials section with country flags
- [ ] 04-02: Advantages and consultation scenarios sections

### Phase 5: Pricing, FAQ, Final CTA & Footer
**Goal**: Visitor has all remaining information and objection-handling needed to decide to submit the form
**Depends on**: Phase 4
**Requirements**: STRUC-09, STRUC-10, STRUC-11, STRUC-12, NAV-04
**Success Criteria** (what must be TRUE):
  1. Pricing section shows "от 450 EUR" with itemized list of what is included
  2. FAQ section has 6 questions in accordion format -- each expands/collapses on click, only one open at a time
  3. Final CTA section displays a headline with 2 CTA buttons
  4. Footer contains phone (+7 701 532 24 78), email (kz@medicusunion.com), App Store/Google Play links, and legal info
**Plans**: 2 plans

Plans:
- [ ] 05-01: Pricing section
- [ ] 05-02: FAQ accordion
- [ ] 05-03: Final CTA and footer

### Phase 6: Navigation & Mobile Interaction
**Goal**: All 11 sections work together as a cohesive page with smooth navigation and mobile-optimized interaction
**Depends on**: Phase 5
**Requirements**: STRUC-01, UX-01, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. All 11 sections from the brief are present and in correct order on a single page
  2. Every CTA button smooth-scrolls to the form section
  3. Sticky mobile bar shows "Оставить заявку" button and phone number, visible during scroll
  4. Phone number is click-to-call (tel: link) in header, sticky bar, and footer
  5. Page is fully responsive: mobile (375px), tablet (768px), desktop (1200px+) layouts verified
**Plans**: 2 plans

Plans:
- [ ] 06-01: Smooth scroll CTAs and click-to-call links
- [ ] 06-02: Sticky mobile CTA bar
- [ ] 06-03: Full page assembly and responsive verification

### Phase 7: Lead Capture Form
**Goal**: Visitor can fill out and submit a consultation request form with clear feedback
**Depends on**: Phase 6
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07
**Success Criteria** (what must be TRUE):
  1. Form displays 4 fields: name (text), phone (tel with +7 prefix), specialization (dropdown with 7 options), description (optional textarea)
  2. Phone field pre-fills +7, triggers numeric keyboard on mobile, and validates Kazakhstan number format (11 digits starting with 7)
  3. Client-side validation shows Russian-language error messages for required fields
  4. After successful submission, user sees "Спасибо, мы перезвоним в течение 24 часов" confirmation
  5. Micro-copies "Бесплатно и без обязательств" and "Ваши данные защищены" are visible near the form
  6. Honeypot field and submission timing check protect against spam bots
**Plans**: 2 plans

Plans:
- [ ] 07-01: Form markup, phone mask, and dropdown
- [ ] 07-02: Client-side validation and success/error states
- [ ] 07-03: Spam protection (honeypot and timing)

### Phase 8: Directus Backend & Integration
**Goal**: Form submissions are captured in Directus and viewable by the MedicusUnion team in the admin panel
**Depends on**: Phase 7
**Requirements**: BACK-01, BACK-02, BACK-03, BACK-04, BACK-05
**Success Criteria** (what must be TRUE):
  1. Directus 11 runs via Docker Compose with PostgreSQL 16 and starts with a single command
  2. Collection `consultation_requests` exists with fields: name, phone, specialty, description, created_at, status
  3. Public/website role has create-only access -- GET, PATCH, DELETE on the collection return 403
  4. CORS is configured for the production domain (not wildcard)
  5. Form submission from the landing page creates a new record visible in Directus admin panel
**Plans**: 2 plans

Plans:
- [ ] 08-01: Docker Compose with Directus and PostgreSQL
- [ ] 08-02: Collection schema and permissions
- [ ] 08-03: Form-to-API integration and CORS

### Phase 9: Performance & SEO
**Goal**: Page loads fast on slow mobile networks and is discoverable by search engines
**Depends on**: Phase 8
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Page loads in under 3 seconds on simulated 3G connection (Chrome DevTools throttling)
  2. All images are WebP with fallback, below-fold images use lazy loading
  3. Meta tags (title, description, Open Graph) are present and correct for social sharing
  4. HTML uses semantic elements: correct heading hierarchy, landmark regions (header, main, footer, nav), alt text on all images
**Plans**: 2 plans

Plans:
- [ ] 09-01: Image optimization and lazy loading
- [ ] 09-02: Meta tags, Open Graph, and semantic HTML audit
- [ ] 09-03: Performance testing and optimization

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 0/2 | Planning complete | - |
| 2. Hero & Problem Sections | 0/2 | Not started | - |
| 3. Value & Process Sections | 0/2 | Not started | - |
| 4. Trust & Authority Sections | 0/2 | Not started | - |
| 5. Pricing, FAQ, Final CTA & Footer | 0/3 | Not started | - |
| 6. Navigation & Mobile Interaction | 0/3 | Not started | - |
| 7. Lead Capture Form | 0/3 | Not started | - |
| 8. Directus Backend & Integration | 0/3 | Not started | - |
| 9. Performance & SEO | 0/3 | Not started | - |
