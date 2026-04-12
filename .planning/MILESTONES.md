# Milestones

## v6.1 New Design Port (Shipped: 2026-04-12)

**Phases completed:** 5 phases, 14 plans, 24 tasks

**Key accomplishments:**

- CSS design tokens updated (dark mode removed, green ramp added), navigation restructured with 5 links + footer arrays, MeshBackground gradient component layered behind z-10 content
- Floating glass pill header with gradient logo, 5 desktop nav links at lg breakpoint, phone icon, gradient CTA, and glass overlay mobile menu
- Glass card footer with 4-column layout (Company/Services/Navigation/Contacts), legal entities, trust badges, and floating glass StickyBar with smart anchor routing via usePathname
- Commit:
- Commit:
- Two React Server Components with glass morphism cards: 4 problem recognition cards with lucide-react icons and 4 numbered process step cards with gradient badges
- WhyUsSection with 4 advantage items, 3-photo collage, and ClinicsSection with 8 country clinic cards in glass grid
- PlatformSection with ISO/GDPR glass card and full 10-section index page wiring replacing GuideGrid/AdvantagesGrid
- ReviewsSection with 4 glass testimonial cards and FAQSection with 7-item accordion using max-height CSS transition
- Contact section with glass coordinator card and preserved Directus form submission, FinalCTA with 2-column glass card and doctor image, page.tsx wired with all 12 sections
- Commit:
- TreatmentAboutUs.tsx
- 1. [Rule 2 - Content] Turkey included items expanded

---

## v1.4 2025 Visual Redesign (Shipped: 2026-03-24)

**Phases completed:** 4 phases, 6 plans, 13 tasks

**Key accomplishments:**

- CSS [data-theme="dark"] token cascade with navy base, glass surface tokens, @media OS hint, FOUC-prevention ES5 script, and .theme-toggle button scaffold
- initDarkMode() function with localStorage persistence, aria-pressed management, icon switching, and WCAG AAA contrast verified for all dark token pairs
- Manrope Variable heading scale upgraded to display standards: h1 clamp(40px→56px)/800, h2 clamp(28px→44px)/800, text-wrap: balance on all headings — verified no Cyrillic orphan lines at 320px and 390px
- One-liner:
- One-liner:
- One-liner:

---

## v1.3 KZ Design Alignment (Shipped: 2026-03-23)

**Phases completed:** 3 phases, 3 plans, 5 tasks

**Key accomplishments:**

- Gradient CTA buttons (green-to-teal), 16px border-radius, opacity hover, white hero background, 1200px container verified
- One-liner:
- Removed orphaned CSS token (--color-cta-hover-kz), pricing card box-shadow, and fixed missing requirements_completed in Phase 18 SUMMARY — three tech-debt items closing out v1.3 cleanly.

---

## v1.2 Brand Visual Alignment (Shipped: 2026-03-23)

**Phases completed:** 2 phases, 2 plans, 4 tasks

**Key accomplishments:**

- Green pill-shape CTA buttons with --color-cta/#35B678 tokens and warm cream hero background (#fffbf4)
- Cards get 20px radius, lighter rgba(16,24,40) shadows, translateY hover lift, and 100px desktop section padding

---

## v1.0 MedicusUnion KZ Landing (Shipped: 2026-03-23)

**Phases completed:** 10 phases, 24 plans, 33 tasks

**Key accomplishments:**

- Self-hosted Inter + Manrope variable fonts with complete CSS design token system (colors, typography, 8px spacing grid, shadows) and mobile-first responsive foundation
- Demo page with typography, color swatches, buttons, cards, dark sections, and spacing grid -- all WCAG AA verified
- Hero section with Russian headline, subtitle, primary CTA (450 EUR pricing) and outline secondary CTA, replacing Phase 1 demo content
- Emotional recognition-trigger section with three empathetic paragraphs about diagnosis uncertainty, foreign doctor access, and time pressure -- BEM-styled with blue left-border accents
- 4 consultation value cards (second opinion, action plan, written conclusion, Q&A) in responsive 2x2 grid reusing existing card component
- 3-step "How It Works" section with numbered steps (upload docs, doctor reviews, video call) in responsive grid
- "Who Consults" section with 7 country flag cards, specialization list, and external link to medicusunion.com/doctors in responsive grid
- 4 advantage cards (why MedicusUnion) and 5 trigger scenarios (when you need consultation) with responsive grid and list layouts
- Pricing section with transparent price callout (from 450 EUR), 5 included-service checkmark items, and responsive card layout
- FAQ accordion section with 6 Russian-language Q&A items, vanilla JS toggle (one-open-at-a-time), plus/minus CSS icon animation, and no-JS fallback
- Final CTA section with dark background, 2 conversion buttons linking to #form, and responsive footer with tel:/mailto: links, App Store/Google Play placeholders, and copyright
- Fixed bottom bar on mobile with click-to-call phone and CTA button, auto-hiding near footer via IntersectionObserver
- Form placeholder section (id=form) added between pricing and FAQ; all 11 brief sections verified present in correct order with responsive layout
- All four PERF requirements verified: meta tags (OG, Twitter, canonical), semantic HTML (single h1, correct hierarchy, landmarks, labels), lightweight assets (64KB total), zero images
- Hero gradient background with dot-grid texture overlay and responsive 2-column layout with stethoscope SVG illustration
- Replaced 19 emoji icons with duotone inline SVG, added icon size tokens, card hover effects, and header gradient accent line
- Scroll-triggered fade-in-up animations with IntersectionObserver, smooth FAQ max-height accordion, button hover lift, and pricing CTA pulse glow -- all disabled under prefers-reduced-motion
- Wave SVG dividers between 8 section transitions, dashed process connectors on desktop, radial gradient form halo, and gradient CTA background

---

## v1.1 Visual Polish & Conversion Boost (Shipped: 2026-03-23)

**Phases completed:** 4 phases, 5 plans, 10 tasks
**Requirements:** 12/12 satisfied
**Files:** +427 lines, -76 lines across 3 files (2,905 LOC total)

**Key accomplishments:**

- Professional duotone doctor-at-laptop SVG illustration in hero section with enlarged 56px CTA buttons for 45+ audience
- Social proof numbers bar (7 countries, 50+ doctors, 15+ specializations) on dark teal background between hero and content
- Sticky header with desktop navigation links to 4 key sections and scroll shadow effect
- Alternating section backgrounds (white/light-gray) with enhanced 80px double-curve wave dividers and drop-shadow
- Centered pricing card with "Все включено" badge and two-column form layout with trust signals on desktop
- SVG country flags replacing emoji for cross-browser consistency and icon-based compact "Знакомо?" problem section

---
