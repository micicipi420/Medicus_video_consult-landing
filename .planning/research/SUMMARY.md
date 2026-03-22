# Project Research Summary

**Project:** MedicusUnion KZ Landing
**Domain:** Medical second-opinion consultation landing page (telemedicine lead generation)
**Researched:** 2026-03-23
**Confidence:** HIGH

## Executive Summary

MedicusUnion KZ is a single-page marketing and lead-generation site for a premium medical second-opinion service targeting Russian-speaking patients in Kazakhstan, aged 45+, at a price point of 450+ EUR per consultation. Research confirms that the optimal build approach is a deliberately simple one: pure HTML/CSS/JS (no frameworks, no bundler), a Directus 11 headless CMS on Docker for form submission storage, PostgreSQL as the backing database, and Nginx as the reverse proxy and static file server. This stack satisfies the stated project constraints, performs well on variable Kazakh mobile networks, and hands a functional admin panel to non-technical staff without custom backend development.

The recommended approach treats the landing page as a conversion funnel with one goal: capturing a qualified lead via a short 4-field form. Every section — hero, problem framing, "how it works," doctor credentials, pricing, FAQ, and final CTA — exists solely to reduce the user's anxiety and skepticism before they reach that form. Research from healthcare UX literature consistently shows that for a 45+ audience making high-stakes health decisions, trust signals and phone-first contact patterns outperform complex digital-native interactions. The page must be mobile-first by design, not as an afterthought, with 18px minimum body text, 48px minimum touch targets, and a persistent sticky CTA bar on mobile.

The primary risks are operational and UX-related rather than technical. Misconfigured Directus permissions could expose patient data, and this must be locked down before the form goes live. CORS must be configured before integration testing. The 45+ audience will abandon immediately if the phone field is frustrating or the page is slow — these are not edge cases but central conversion requirements. The tech stack has no real uncertainty; all recommended components are well-documented and production-proven.

## Key Findings

### Recommended Stack

The entire frontend is plain HTML5, vanilla CSS with custom properties, and vanilla ES6+ JavaScript using native ES modules — no build tooling, no framework, no bundler. This is both a stated project constraint and the correct technical choice for a single marketing page: it yields the smallest possible payload, requires no `npm install`, and eliminates a category of infrastructure complexity. Backend is Directus 11.14.1 (pinned version) on Docker Compose with PostgreSQL 16 as the datastore. Nginx handles SSL termination, static file serving, and reverse-proxies `/api/*` to Directus. Fonts (Inter + Manrope) must be self-hosted as WOFF2 for performance and privacy on Kazakh networks.

**Core technologies:**
- HTML5 + Vanilla CSS (custom properties, Grid, Flexbox): page structure and styling — no frameworks per project constraint; modern CSS is fully sufficient for 11 sections on one page
- Vanilla JS ES6+ (Fetch API, ES modules): form submission, accordion, smooth scroll, phone masking — no jQuery, no Axios, no Alpine.js; 4 modules totaling under 10KB
- Directus 11.14.1: headless CMS and form submission backend — project requirement; GUI admin panel for non-technical staff; no custom backend code needed
- PostgreSQL 16: database for Directus — production-grade, Directus's best-supported database; SQLite only for local dev
- Docker Compose: orchestrates Directus + PostgreSQL — single `docker compose up` deploys the entire backend
- Nginx: reverse proxy, static file server, SSL termination — serves landing page and proxies `/api/*` to Directus

### Expected Features

Research identifies a clear MVP scope defined by the 11-section brief. All P1 features are low-to-medium complexity and can be built without third-party services. The form is the single conversion point — all other sections exist to reduce friction before it.

**Must have (table stakes) — launch blockers:**
- Hero section with clear value proposition ("European doctor opinion without leaving home") — 3-second user decision
- Prominent click-to-call phone number (+7 701 532 24 78) in sticky header — 45+ audience trusts phone 10-15x more than forms
- Mobile-first responsive layout (touch targets 48px+, 18px+ body text) — primary audience on mid-range Android
- "How it works" step-by-step section — medical process is unfamiliar; uncertainty causes abandonment
- Doctor credentials section with country flags and institutional signals — legitimacy for a 450 EUR purchase
- Transparent pricing display ("от 450 EUR", what is included) — hidden pricing destroys trust and leads quality
- Lead capture form (name, phone, specialization, optional description — 4 fields max) — sole conversion mechanism
- FAQ accordion (8-12 questions addressing real objections) — objection handling before the form
- SSL + privacy policy link near form — legally required in Kazakhstan; table stakes for medical data
- Page performance under 3 seconds on 3G — every second reduces conversions by 7%; KZ mobile networks are variable
- Directus backend integration for form submissions — the core data capture mechanism

**Should have (competitive differentiators) — add within weeks post-launch:**
- Sticky mobile CTA bar (phone + form scroll button) — A/B tests show 55% CTA click increase
- Problem/scenario section ("When you need a second opinion") — emotional resonance over generic service lists
- Micro-copy reassurance near form submit ("We'll call within 2 hours") — reduces form abandonment at the decision point
- Specialty-specific cards that pre-select the form dropdown — helps users self-qualify
- WhatsApp/Telegram contact buttons — dominant messenger channels for 45+ KZ audience
- Yandex.Metrica / analytics with form submission as a goal event — baseline conversion data
- Schema.org structured data (MedicalOrganization, FAQPage) — SEO

**Defer (v2+):**
- Kazakh language version — defer until Russian version conversion is validated
- Patient testimonials section — defer until real testimonials are collected
- Document upload in form — adds medical data handling complexity; not needed for lead capture
- Online scheduling (calendar integration) — significant complexity; sales team handles scheduling offline

**Anti-features to explicitly avoid:**
- Live chat / chatbot: 45+ audience distrusts bots; medical liability risk; prominent phone + WhatsApp is the correct substitute
- Multi-step wizard form: 4 fields do not warrant a wizard; increases anxiety without benefit
- Countdown timers / urgency tactics: fundamentally incompatible with medical brand tone
- Parallax scrolling / heavy animations: motion sickness risk for older users; WCAG `prefers-reduced-motion` concern; slow on budget Android

### Architecture Approach

The architecture is a two-tier static/API split: Nginx serves the landing page as static files and reverse-proxies all `/api/*` requests to Directus running on port 8055. The landing page is a single `index.html` with 11 anchored sections. CSS is organized into 5 files by concern (variables, base, sections, components, responsive) using BEM naming conventions. JavaScript is 4 native ES modules (form, accordion, scroll, navigation) imported via `type="module"`. All assets — including Inter and Manrope fonts — are self-hosted. The Directus collection is named `consultation_requests` with 8 fields; the public role has create-only access to 5 writable fields; `status` defaults to `new` server-side and is not writable by the public.

**Major components:**
1. Static site (HTML/CSS/JS) — renders 11 sections, handles form validation and async submission via Fetch API, runs FAQ accordion, smooth scroll, and mobile navigation
2. Nginx — serves static files with 30-day cache headers, proxies `/api/*` to Directus, terminates SSL, applies rate limiting on the API location block
3. Directus 11 — exposes REST API for form submissions, provides admin panel for leads management, enforces schema validation server-side, supports future Flows for email notifications
4. PostgreSQL 16 — persists all consultation requests; only Directus communicates with it directly

**Build order from ARCHITECTURE.md:**
- Phase 1: Full static landing page (HTML structure → CSS → JS interactions, no backend)
- Phase 2: Directus backend (Docker Compose → collection schema → permissions → form.js wired to API)
- Phase 3: Production deployment (Nginx config → SSL → DNS → rate limiting → security headers)

### Critical Pitfalls

1. **Directus permissions misconfiguration exposes patient data** — use a dedicated "website" role with static token (NOT the Public role); grant create-only on `consultation_requests`; limit writable fields to name/phone/specialization/description/source_page; verify by attempting GET on the endpoint with the website token and confirming 403. Must be done before the form is connected.

2. **Tiny touch targets and small text kill 45+ mobile conversion** — enforce 18px minimum body text, 48px minimum touch targets, and 12px spacing between tappable elements in the base CSS from day one; do not use `user-scalable=no` or `maximum-scale=1` in the viewport meta; test on a physical mid-range Android (Samsung A-series), not a high-end device.

3. **Phone field friction causes form abandonment** — use `<input type="tel">` (triggers numeric keyboard on mobile); pre-fill the `+7` prefix as a non-editable visual label; accept any spacing/dash format and strip non-digits; validate only that the result is 11 digits starting with 7; show error messages in plain Russian.

4. **CORS blocks form submission in production** — configure `CORS_ENABLED=true`, `CORS_ORIGIN=https://medicusunion.kz`, `CORS_METHODS=GET,POST` in the Directus `.env` before integration testing; do NOT use `CORS_ORIGIN=*`; test the form from the actual deployed domain, not localhost.

5. **No spam protection floods the submissions collection** — add a CSS-hidden honeypot field; implement Directus rate limiting (`RATE_LIMITER_POINTS=5`, `RATE_LIMITER_DURATION=60`); consider a simple Russian-language math CAPTCHA instead of reCAPTCHA v2, which is hostile to older users and may be slow in Kazakhstan.

6. **Missing trust signals produce near-zero conversion** — a 450 EUR medical service from an unknown (to the visitor) brand requires concrete evidence: specific doctor credentials with country flags, real patient testimonials in Russian, partner hospital logos, Austrian legal entity details, and Kazakhstan contact information. This content must be in the initial build, not added post-launch.

## Implications for Roadmap

Based on research, the architecture's own build-order rationale (static page first, backend second, deployment third) is the correct phase structure. There are no component dependencies that invert this order.

### Phase 1: Static Landing Page

**Rationale:** The static page is the core deliverable with zero backend dependencies. It can be designed, reviewed, content-checked, and iterated entirely without Docker running. Building it first keeps the feedback loop tight and defers infrastructure complexity.

**Delivers:** A fully functional, visually complete, mobile-responsive landing page with all 11 sections, readable on any device. Form UI is built but submits nowhere yet (or shows a success mock).

**Addresses (from FEATURES.md):** Hero, problem section, "how it works," doctor credentials, advantages, pricing, FAQ accordion, final CTA, footer, sticky mobile CTA bar, click-to-call phone number. All P1 table-stakes features except Directus integration.

**Avoids (from PITFALLS.md):** Touch target and typography pitfalls must be baked into base CSS from day one (not retrofitted). Trust signals must be in the initial content structure. Image optimization (WebP, lazy loading, sub-200KB hero) must be addressed during asset preparation — not as a post-launch audit.

**Research flag:** No additional research needed. This is well-documented static HTML/CSS/JS development. BEM + custom properties is a proven pattern with extensive documentation.

### Phase 2: Directus Backend and Form Integration

**Rationale:** Backend is layered on top of the completed static page. This phase has the most security-sensitive work (permissions, CORS, rate limiting) and must not be rushed.

**Delivers:** Form submissions captured in Directus. Admin panel operational for the MedicusUnion team to view, filter, and update leads. Email notification on new submissions via Directus Flows.

**Addresses (from FEATURES.md):** Directus backend integration (P1 requirement). Spam protection (honeypot + rate limiter). Privacy policy link near form (legally required in Kazakhstan).

**Avoids (from PITFALLS.md):** Directus permissions misconfiguration (dedicated role, not Public role; create-only; GET returns 403). CORS configuration done before integration testing. Phone field implementation with `type="tel"`, `+7` prefix, and Russian-language validation messages. Form feedback states (loading indicator, success message, error with fallback phone number). Duplicate submission prevention (disable submit button after click).

**Research flag:** No additional research needed. Directus permissions and CORS configuration are well-documented in official Directus docs.

### Phase 3: Production Deployment and Hardening

**Rationale:** Production configuration is last because it only matters when going live. Security headers, SSL, rate limiting, and DNS are meaningless until the previous phases are validated.

**Delivers:** Live site at medicusunion.kz with HTTPS, Nginx serving static files and proxying API, PostgreSQL with backup strategy, Directus admin on a restricted subdomain or behind IP whitelist.

**Addresses (from FEATURES.md):** SSL/security indicators (HTTPS mandatory; visual "data is secure" note near form). Analytics integration (Yandex.Metrica with form submission goal event).

**Avoids (from PITFALLS.md):** No HTTPS = "Not Secure" warning destroys medical service credibility. Directus admin panel must not be exposed on the public domain without IP restriction. `DIRECTUS_SECRET` must be a strong random value generated before first deployment. Content Security Policy headers needed to restrict script sources.

**Research flag:** No additional research needed for Nginx + Let's Encrypt + Docker deployment. Standard configuration, well-documented. Kazakhstan-specific data protection law (Personal Data Law No. 94-V) may need a brief legal review before launch — the "описание случая" field could be classified as medical personal data requiring specific handling.

### Post-Launch Iteration (v1.x)

**Rationale:** These features require baseline conversion data or confirmed real-world assets before they are meaningful.

**Delivers:** Conversion optimization, messenger contact options, animated statistics with real numbers, specialty-specific URL parameters for paid campaigns, structured data for SEO.

**Addresses (from FEATURES.md):** All P2 features. WhatsApp/Telegram buttons, animated statistics counters, Schema.org structured data, A/B testing on CTA copy.

**Research flag:** No deep research needed. All patterns are straightforward. Kazakh language version (if pursued) would need dedicated research and content strategy.

### Phase Ordering Rationale

- Static page first because it has zero backend dependencies and is the core product — the form backend is an enhancement, not a prerequisite for building or reviewing the page design.
- Backend second because form submission logic depends on the form UI existing, and permissions/CORS must be configured before any cross-origin testing.
- Deployment third because SSL, DNS, and Nginx configuration are infrastructure concerns that only matter at go-live.
- Post-launch iteration is correctly deferred because WhatsApp buttons, animated counters, and analytics goals require real traffic and confirmed content to be meaningful.

### Research Flags

Phases with well-documented patterns (no `/gsd:research-phase` needed):
- **Phase 1 (Static Landing Page):** Standard HTML/CSS/JS. BEM naming, mobile-first media queries, and vanilla ES modules are all fully documented with no ambiguity.
- **Phase 2 (Directus Backend):** Directus permissions, CORS, Docker Compose, and the Items API are documented in official Directus docs. The pattern is straightforward.
- **Phase 3 (Production Deployment):** Nginx + Certbot + Docker is a canonical pattern with extensive community documentation.

Phases that may need targeted research or expert input:
- **Phase 3 (Kazakhstan legal compliance):** The "описание случая" field may constitute medical personal data under Kazakhstan Personal Data Law No. 94-V. A brief legal review (or consultation with the client's legal contact) is recommended before go-live, not a deep research sprint.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are project-specified or the direct recommended implementation of those specifications. Official Directus docs, Docker Hub, and MDN confirm all details. |
| Features | HIGH | Healthcare UX research is extensive and consistent. Feature set is directly informed by the 11-section brief in PROJECT.md plus established healthcare conversion patterns. |
| Architecture | HIGH | Two-tier static/API pattern is canonical for this use case. Directus + PostgreSQL + Nginx is the recommended self-hosted Directus deployment per official docs. |
| Pitfalls | HIGH | All pitfalls are documented in Directus GitHub issues, official security docs, Nielsen Norman Group usability research, and Kazakhstan network statistics. No speculation. |

**Overall confidence:** HIGH

### Gaps to Address

- **Real content for trust signals:** Doctor credentials, partner hospital logos, patient testimonials, and Austrian/KZ legal entity details must come from the MedicusUnion team. The page structure is defined, but the specific content cannot be fabricated. This is a content dependency, not a technical one — flag it with the client at project kickoff.
- **Real statistics for social proof:** The "3,200+ consultations", "27 countries", "98% recommend" numbers (or whatever the real figures are) must be confirmed as accurate before publishing. This is a client data dependency.
- **Kazakhstan Personal Data Law compliance:** The optional "описание случая" field may require specific handling (at-rest encryption, data retention policy, user consent wording). Needs legal review, not research. Low risk to defer until late Phase 3.
- **Analytics platform selection:** Both Google Analytics and Yandex.Metrica are viable. Yandex.Metrica is more common in Kazakhstan and has better CIS market support but has data-sovereignty implications of its own. Client should confirm preference before Phase 3 analytics integration.

## Sources

### Primary (HIGH confidence)
- [Directus Official Docs: Create a Project](https://directus.io/docs/getting-started/create-a-project) — Directus 11 Docker Compose setup
- [Directus Official Docs: Access Control](https://directus.io/docs/guides/auth/access-control) — Public role permissions, create-only configuration
- [Directus Official Docs: Items API](https://directus.io/docs/api/items) — POST /items/{collection} endpoint
- [Directus Official Docs: Security Limits](https://directus.io/docs/configuration/security-limits) — rate limiting configuration
- [Directus GitHub: docker-compose.yml](https://github.com/directus/directus/blob/main/docker-compose.yml) — official reference compose file
- [Nielsen Norman Group: Usability for Senior Citizens](https://www.nngroup.com/articles/usability-for-senior-citizens/) — 45+ UX requirements
- [W3C WAI: Developing Websites for Older People](https://www.w3.org/WAI/older-users/developing/) — accessibility patterns for aging users
- [PMC: Design Considerations for Mobile Health Apps Targeting Older Adults](https://pmc.ncbi.nlm.nih.gov/articles/PMC8837196/) — healthcare mobile UX research

### Secondary (MEDIUM confidence)
- [Landingi: Healthcare Landing Page Best Practices](https://landingi.com/landing-page/healthcare-best-practices/) — conversion patterns
- [FetchFunnel: Conversion Rate Optimization for Healthcare 2025](https://www.fetchfunnel.com/conversion-rate-optimization-for-healthcare/) — click-to-call statistics
- [Sequence Health: High Conversion Landing Page for Medical Sites](https://www.sequencehealth.com/how-to-craft-a-high-conversion-landing-page-for-your-medical-practice) — form length recommendations
- [Invoca: Landing Pages that Drive Click-to-Call](https://www.invoca.com/blog/7-awesome-examples-of-landing-pages-that-drive-click-to-call) — phone CTA placement
- [AB Tasty: Mobile Stick-to-Scroll CTA](https://www.abtasty.com/blog/mobile-stick-to-scroll/) — sticky CTA bar lift data
- [Directus CORS Issues - GitHub #20577](https://github.com/directus/directus/issues/20577) — CORS pitfall documentation
- [SpeedGEO: Kazakhstan Internet Speed Statistics](https://www.speedgeo.net/statistics/kazakhstan) — network performance context
- [BEM Methodology](https://getbem.com/introduction/) — CSS naming convention

### Tertiary (LOW confidence)
- [Smashing Magazine: CSS Cascade Layers vs BEM vs Utility Classes](https://www.smashingmagazine.com/2025/06/css-cascade-layers-bem-utility-classes-specificity-control/) — CSS architecture tradeoffs (2025 article; patterns may continue to evolve)

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
