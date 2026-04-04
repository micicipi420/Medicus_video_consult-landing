<!-- GSD:project-start source:PROJECT.md -->
## Project

**MedicusUnion KZ Landing**

Многостраничный сайт для medicusunion.kz — сервиса онлайн-консультаций с европейскими врачами, лечения за рубежом и чек-апов. Целевая аудитория: жители Казахстана 45+. Конверсия: заявка на консультацию через форму.

5 страниц: index.html (главная), online-consultations.html, treatment-abroad.html, checkups.html, contacts.html.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

### Constraints

- **Stack**: HTML + Tailwind CSS v4 + JS — Tailwind CLI (standalone binary) для сборки CSS, без Node.js в рантайме
- **Design source**: Redesign/ папка содержит React+Tailwind прототип — эталон для визуала. HTML-страницы должны быть pixel-perfect с прототипом
- **Backend**: Directus (self-hosted) — приём заявок с формы
- **Language**: Только русский
- **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст
- **Fonts**: SF Pro Display (body) / SF Pro Rounded (headings) — системные шрифты Apple с fallback chain
- **Animations**: Motion standalone CDN (window.Motion) — scroll-reveal, counters, hover transforms
- **Tone**: Спокойный, уверенный, медицинский — без маркетинговой агрессии
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Frontend (Multi-page Static Site)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| HTML5 | Current | Page structure | Semantic HTML for accessibility and SEO across 5 pages | HIGH |
| Tailwind CSS | v4 | Styling | Redesign prototype built on Tailwind — using same utility classes guarantees pixel-perfect match. Tailwind CLI standalone binary, no Node.js runtime needed | HIGH |
| Vanilla JS (ES6+) | Current | Form handling, UI interactions | Form submission, accordion, phone mask, counters, sticky header, mobile menu | HIGH |
| Motion (standalone CDN) | 12.x | Scroll-reveal animations | Vanilla JS API from Framer Motion team — inView, animate, spring physics. No React dependency | HIGH |
### Backend / CMS
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Directus | 11.14.1 | Headless CMS, form submission storage | Project requirement. Self-hosted, GUI admin panel for non-technical staff to view submissions. Future CRM potential | HIGH |
| PostgreSQL | 16 | Database for Directus | Production-grade, recommended by Directus for anything beyond dev. SQLite is fine for dev only | HIGH |
### Infrastructure
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Docker + Docker Compose | Latest | Directus + PostgreSQL orchestration | Single `docker compose up` deploys the entire backend. Reproducible, portable | HIGH |
| Nginx | Latest | Reverse proxy, static file serving | Serves the landing page HTML/CSS/JS and proxies `/api` to Directus. SSL termination | HIGH |
### Supporting Tools (Development)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `html-minifier-terser` | Minify HTML for production | Build/deploy step |
| `clean-css-cli` | Minify CSS for production | Build/deploy step |
| `terser` | Minify JS for production | Build/deploy step |
| `sharp-cli` or `squoosh-cli` | Convert images to WebP/AVIF | Asset preparation |
## CSS Approach: Tailwind CSS v4 with Custom Theme
### Rationale
Redesign prototype (Redesign/ folder) is built on Tailwind v4. Using the same utility classes in HTML pages guarantees pixel-perfect match. Tailwind CLI standalone binary compiles CSS without Node.js.
### CSS Architecture for This Project
- `src/styles/tailwind.css` — Tailwind entry (imports)
- `src/styles/theme.css` — Custom tokens (@theme inline), brand colors, glass shadows, font families
- `src/styles/index.css` — Base styles, @layer base overrides
- `css/styles.css` — Compiled output (from `tailwindcss` CLI)
### What NOT to Use
| Do Not Use | Why |
|------------|-----|
| Bootstrap | Heavy bundle; opinionated component styles fight glassmorphism design |
| CSS-in-JS | No JS framework to host it; irrelevant for static HTML |
| Sass/SCSS | Tailwind handles everything; adding Sass is redundant |
| PostCSS (full pipeline) | Tailwind CLI standalone is sufficient; no need for PostCSS config |
## JavaScript Approach: Vanilla ES6+ with Fetch API
### What JS Needs to Do
### Form Submission Pattern
### Directus Authentication for Public Form
### What NOT to Use
| Do Not Use | Why |
|------------|-----|
| jQuery | Dead weight; `fetch()` and `querySelector()` replace it entirely |
| Axios | `fetch()` is native and sufficient for one POST endpoint |
| Alpine.js | Tempting for accordion/reactivity, but adds a dependency for 20 lines of vanilla JS |
| Any SPA framework (React, Vue, Svelte) | This is a static marketing page, not an application |
| `@directus/sdk` | Pulls in a full SDK for one `fetch` call. Unnecessary |
## Directus Setup for Form Submissions
### Collection Schema: `submissions`
| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | UUID (auto) | -- | auto | Primary key |
| `name` | String | Input | Yes | Applicant name |
| `phone` | String | Input | Yes | +7 format |
| `specialization` | String | Dropdown | Yes | Predefined list: oncology, cardiology, neurosurgery, orthopedics, radiology, IVF |
| `description` | Text | Textarea | No | Case description (optional) |
| `date_created` | Timestamp | Datetime | auto | Directus system field |
| `status` | String | Dropdown | auto | Default: "new". For future CRM workflow: new/contacted/completed |
### Permissions Configuration
### Admin Workflow
- Table view of all submissions
- Filter by status, date, specialization
- Export to CSV
- Future: email notifications via Directus Flows (built-in automation)
## Docker Compose: Production Configuration
### Required `.env` File
### CORS Configuration
## Fonts
| Font | Source | Purpose | Why |
|------|--------|---------|-----|
| SF Pro Display | System font (Apple) | Body text | Redesign spec. System font = zero download, native rendering |
| SF Pro Rounded | System font (Apple) | Headings | Redesign spec. Rounded letterforms for friendly medical tone |
| -apple-system, BlinkMacSystemFont, Segoe UI, Roboto | Fallback chain | Non-Apple devices | Standard system font stack for cross-platform |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| CSS | Tailwind CSS v4 (CLI standalone) | Vanilla CSS | Redesign prototype is Tailwind — vanilla CSS translation introduced visual bugs; Tailwind gives pixel-perfect match |
| CSS | Tailwind CSS v4 (CLI standalone) | Bootstrap 5 | Heavy (22KB min CSS); fights glassmorphism design |
| CSS | Tailwind CSS v4 (CLI standalone) | Sass/SCSS | Tailwind handles design tokens, responsive, and utilities; Sass is redundant |
| JS | Vanilla fetch() | @directus/sdk | Full SDK package for a single POST call; unnecessary dependency |
| JS | Vanilla JS | Alpine.js | Adds 15KB for accordion and form that need ~50 lines of vanilla JS |
| Database | PostgreSQL 16 | SQLite | Not suitable for production with concurrent writes; no proper backup tooling |
| Database | PostgreSQL 16 | MySQL 8 | PostgreSQL is Directus's best-supported database; PostGIS available if needed later |
| CMS | Directus 11.14.1 | Strapi | Project decision already made; Directus has better admin UI for non-technical users |
| Hosting | Docker Compose | Cloud PaaS | Self-hosted requirement for data sovereignty (medical data in KZ) |
## Installation / Setup
### Backend Setup
# 1. Clone/create project directory
# 2. Create docker-compose.yml (as above)
# 3. Create .env file (as above)
# 4. Start services
# 5. Access Directus admin
# Open http://localhost:8055 and log in with ADMIN_EMAIL/ADMIN_PASSWORD
# 6. Create 'submissions' collection via admin UI
# Add fields: name, phone, specialization, description, status
# 7. Configure public role permissions
# Settings > Access Control > Public > submissions > Enable Create
### Optional: Dev Minification Tools
# Only if you want automated minification
## Sources
- [Directus Official Docs: Create a Project](https://directus.io/docs/getting-started/create-a-project) -- Directus 11.14.1 docker-compose reference
- [Directus Official Docs: Deploying](https://directus.io/docs/self-hosting/deploying) -- PostgreSQL docker-compose with environment variables
- [Directus Official Docs: Items API](https://directus.io/docs/api/items) -- POST /items/{collection} endpoint
- [Directus Official Docs: Access Control](https://directus.io/docs/guides/auth/access-control) -- Public role permissions configuration
- [Directus GitHub: docker-compose.yml](https://github.com/directus/directus/blob/main/docker-compose.yml) -- Official reference compose file
- [Can I Use: Container Queries](https://caniuse.com/css-container-queries) -- Browser support reference
- [Frontend Masters: Modern CSS 2025](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/) -- CSS custom properties, grid, modern features
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
