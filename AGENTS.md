<!-- GSD:project-start source:PROJECT.md -->
## Project

**MedicusUnion KZ**

Сайт medicusunion.kz — сервиса онлайн-консультаций с европейскими врачами. Целевая аудитория: жители Казахстана 45+, которые хотят получить второе мнение от врача из Германии, Израиля, Швейцарии и других стран. Конверсия: заявка на консультацию через форму.

Бэкенд на Directus — приём и хранение заявок с формы, с перспективой замены AmoCRM на собственную CRM.

**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

### Constraints

- **Stack**: HTML + CSS + JS (чистый, без фреймворков) — простота деплоя и поддержки
- **Backend**: Directus (self-hosted) — приём заявок с формы
- **Language**: Только русский
- **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст
- **Tone**: Спокойный, уверенный, медицинский — без маркетинговой агрессии
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Frontend (Static Multi-Page Site)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| HTML5 | Current | Page structure | Semantic HTML for accessibility and SEO; no build step needed | HIGH |
| Vanilla CSS | Current | Styling | Project constraint: no frameworks. Modern CSS (custom properties, grid, flexbox) covers all needs for a multi-page site | HIGH |
| Vanilla JS (ES6+) | Current | Form handling, UI interactions | No framework overhead for a single page with one form and a few interactions (accordion, smooth scroll) | HIGH |
### Backend / CMS
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Directus | 11.14.1 | Headless CMS, form submission storage | Project requirement. Self-hosted, GUI admin panel for non-technical staff to view submissions. Future CRM potential | HIGH |
| PostgreSQL | 16 | Database for Directus | Production-grade, recommended by Directus for anything beyond dev. SQLite is fine for dev only | HIGH |
### Infrastructure
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Docker + Docker Compose | Latest | Directus + PostgreSQL orchestration | Single `docker compose up` deploys the entire backend. Reproducible, portable | HIGH |
| Nginx | Latest | Reverse proxy, static file serving | Serves the site HTML/CSS/JS and proxies `/api` to Directus. SSL termination | HIGH |
### Supporting Tools (Development)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `html-minifier-terser` | Minify HTML for production | Build/deploy step |
| `clean-css-cli` | Minify CSS for production | Build/deploy step |
| `terser` | Minify JS for production | Build/deploy step |
| `sharp-cli` or `squoosh-cli` | Convert images to WebP/AVIF | Asset preparation |
## CSS Approach: Vanilla CSS with Custom Properties
### Rationale
### CSS Architecture for This Project
### What NOT to Use
| Do Not Use | Why |
|------------|-----|
| Tailwind CSS | Overkill for one page; requires build tooling; violates project constraint |
| Bootstrap | Heavy bundle; opinionated component styles fight custom brand design |
| CSS-in-JS | No JS framework to host it; irrelevant for static HTML |
| Sass/SCSS | CSS custom properties replace variables; nesting now native in CSS; adds build step for marginal benefit |
| Container queries | Incomplete Firefox support; media queries are simpler and sufficient for a site with known breakpoints |
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
| Any SPA framework (React, Vue, Svelte) | This is a static marketing site, not an application |
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
| Inter | Google Fonts or self-hosted | Body text | PROJECT.md brand spec. Excellent readability at all sizes |
| Manrope | Google Fonts or self-hosted | Headings | PROJECT.md brand spec. Clean geometric sans-serif |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| CSS | Vanilla CSS + custom properties | Tailwind CSS | Build tooling overhead; project constraint says no frameworks; one page does not benefit from utility classes |
| CSS | Vanilla CSS + custom properties | Bootstrap 5 | Heavy (22KB min CSS); fights custom brand design; adds classes for components we can build in 30 lines |
| CSS | Vanilla CSS + custom properties | Sass/SCSS | Nesting is now native CSS; variables replaced by custom properties; adds build step for near-zero benefit |
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
> This section is managed by `generate-Codex-profile` -- do not edit manually.
<!-- GSD:profile-end -->
