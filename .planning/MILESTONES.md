# Milestones

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
