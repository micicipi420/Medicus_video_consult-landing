# Milestones

## v3.1 Site Foundation & Audit Fixes (Shipped: 2026-04-07)

**Phases completed:** 6 phases (33–38), 44/52 requirements delivered, 7 deferred to v3.2 Phase 36b, 1 manual verification gate pending (RHYTHM-10)

**Key accomplishments:**

- Data unification gate passed: Vienna address canonical (`Billrothstrasse 78`), ТОО «MedicusUnion KZ» (no space), Алматы (not Астана), Bruno-Marek-Allee drift eliminated
- Mobile sticky-bar overlap fixed site-wide with `calc(7rem+env(safe-area-inset-bottom))` for iPhone X+ home indicator safety
- treatment-abroad.html restored from 14/24 audit score: 20 hardcoded hex strokes → `currentColor` tokens, 3 typewriter dashes → en-dashes, hero photo swapped from inappropriate syringe close-up to medical-team composition, stat bar icon-less pattern matching index.html
- checkup.html H1 overflow fixed via typography-only (`<br class="hidden lg:block">`) — NO min-h touched per cross-phase constraint
- Form UX upgraded for 45+ audience across all 5 forms: native `:user-valid` CSS (blur-aware), blur-first validation timing, `aria-invalid` transitions, `max-w-[280px]` error containers, gender-neutral copy ("Помогите выбрать" not "Не определился")
- Chrome drift eliminated across 5 pages: BEM classes normalized, canonical footer/header/sticky-bar structure, `aria-current="page"` baked in static HTML for each page's own nav link, event delegation for mobile menu, bfcache `pageshow` listener
- Site metadata: `sitemap.xml` (5 URLs, NO 404, NO changefreq/priority), Yandex-safe `robots.txt` (does NOT block /css/ /js/), canonical URL audit confirmed 0 drift, 404.html H1 upgraded + body copy rewritten, meta descriptions trimmed to 150–160 chars, 10 circle-flags SVGs vendored to `img/flags/` (~6KB)
- Vertical rhythm system (research-first): canonical `svh`-based hero tokens (rich/medium/compact content-density tiers) in `theme.css :root` + `@theme inline` — smoke test caught Tailwind v4's `--min-height-*` key pattern (not `--height-*`), prevented broken bulk migration. `<body class="min-h-screen">` removed across 6 pages. `scroll-margin-top: 6rem` + `prefers-reduced-motion` guards. Counter animations cached via `sessionStorage` to avoid SPA-nav re-run.
- Deferred to v3.2 Phase 36b: `partials/` extraction, `scripts/build-pages.sh`, `build.sh`, `netlify.toml [build] command`, Netlify deploy smoke-test (prerequisite: user triggers test deploy with checked-in 76 MB `tailwindcss` binary)

---

## v3.0 SEO, Performance & Polish (Shipped: 2026-04-06)

**Phases completed:** 4 phases, 7 plans, 13 tasks

**Key accomplishments:**

- Branded 404 error page with gradient heading, shared site shell (header, footer, mesh, sticky bar), and home navigation link
- Normalized header/footer classes, added missing scripts to checkup.html, fixed footer service links, and verified honeypot + FAQ across all pages
- Complete OG tags with og:image on all 5 pages, clean canonical URLs, and Schema.org MedicalBusiness JSON-LD on index.html
- Downloaded 11 Unsplash images, converted to local WebP (283KB total vs 660KB JPEG), added lazy loading and CLS-preventing dimensions across 3 HTML files
- Preload hints for CSS and hero images on all pages, defer on all scripts, Tailwind CSS rebuilt with minification
- WCAG AA color tokens, focus-visible keyboard ring, and prefers-reduced-motion rule added to theme.css -- foundation for design system compliance across all pages
- WCAG AA color contrast on 77 CTA buttons, 88 hover states, 62 text elements; ARIA live regions on 20 form errors; Glass-5 form containers across all 6 pages

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
