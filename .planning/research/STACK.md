# Technology Stack

**Project:** MedicusUnion KZ Landing
**Researched:** 2026-03-23

## Recommended Stack

### Frontend (Static Landing Page)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| HTML5 | Current | Page structure | Semantic HTML for accessibility and SEO; no build step needed | HIGH |
| Vanilla CSS | Current | Styling | Project constraint: no frameworks. Modern CSS (custom properties, grid, flexbox) covers all needs for a single landing page | HIGH |
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
| Nginx | Latest | Reverse proxy, static file serving | Serves the landing page HTML/CSS/JS and proxies `/api` to Directus. SSL termination | HIGH |

### Supporting Tools (Development)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `html-minifier-terser` | Minify HTML for production | Build/deploy step |
| `clean-css-cli` | Minify CSS for production | Build/deploy step |
| `terser` | Minify JS for production | Build/deploy step |
| `sharp-cli` or `squoosh-cli` | Convert images to WebP/AVIF | Asset preparation |

**Note:** These are optional CLI tools. For a single landing page, manual minification or a simple shell script is sufficient. No webpack/vite/bundler needed.

## CSS Approach: Vanilla CSS with Custom Properties

**Decision: Use vanilla CSS with custom properties (CSS variables), Grid, and Flexbox. No Tailwind, no Bootstrap.**

### Rationale

1. **Project constraint** -- PROJECT.md specifies "HTML + CSS + JS (no frameworks)"
2. **Single page** -- Tailwind and Bootstrap solve problems of scale (many pages, many developers). For 11 sections on one page, they add complexity without benefit
3. **Target audience 45+** -- needs large fonts, high contrast, simple layouts. CSS Grid handles this cleanly
4. **Performance** -- zero framework CSS = smallest possible payload. Critical for mobile users in Kazakhstan
5. **Modern CSS is sufficient** -- custom properties for the brand tokens (#38C6F4, #35B678, #18212C), `clamp()` for fluid typography, Grid for layout, `scroll-behavior: smooth` for CTA buttons

### CSS Architecture for This Project

```css
/* Design tokens via custom properties */
:root {
  --color-primary: #38C6F4;
  --color-secondary: #35B678;
  --color-dark: #18212C;
  --font-heading: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;
  --container-max: 1200px;
  --spacing-unit: 8px;
}

/* Mobile-first media queries */
/* Base styles = mobile (320px+) */
/* @media (min-width: 768px) = tablet */
/* @media (min-width: 1024px) = desktop */
```

### What NOT to Use

| Do Not Use | Why |
|------------|-----|
| Tailwind CSS | Overkill for one page; requires build tooling; violates project constraint |
| Bootstrap | Heavy bundle; opinionated component styles fight custom brand design |
| CSS-in-JS | No JS framework to host it; irrelevant for static HTML |
| Sass/SCSS | CSS custom properties replace variables; nesting now native in CSS; adds build step for marginal benefit |
| Container queries | Incomplete Firefox support; media queries are simpler and sufficient for a landing page with known breakpoints |

## JavaScript Approach: Vanilla ES6+ with Fetch API

**Decision: Plain JavaScript, no libraries, no build step.**

### What JS Needs to Do

1. **Form submission** via `fetch()` to Directus REST API
2. **Form validation** (client-side, before submission)
3. **FAQ accordion** (toggle open/close)
4. **Smooth scroll** to form section on CTA click
5. **Phone input masking** (Kazakh format +7 XXX XXX XX XX)

### Form Submission Pattern

```javascript
// POST to Directus Items API
async function submitForm(formData) {
  const response = await fetch('https://your-directus.example.com/items/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      specialization: formData.specialization,
      description: formData.description
    })
  });
  if (!response.ok) throw new Error('Submission failed');
  return response.json();
}
```

### Directus Authentication for Public Form

The form submits without user login. Two approaches:

1. **Public role with Create permission** (RECOMMENDED) -- In Directus admin: Settings > Access Control > Public Role > grant Create permission on the `submissions` collection. No token needed in frontend code. Restrict to Create only (no Read/Update/Delete).

2. **Static token** -- Create a Directus user with a static API token and limited permissions. Pass token in the `Authorization` header. Downside: token is visible in frontend JS source.

**Use approach 1.** It is cleaner and does not expose tokens in client code.

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

1. **Public policy** on `submissions` collection: Allow **Create** only
2. Use **field validation** in Directus to enforce required fields server-side
3. Use **custom permissions** to restrict which fields the public role can write to (prevent injection of `status` or `id`)

### Admin Workflow

Directus admin panel at `/admin` provides:
- Table view of all submissions
- Filter by status, date, specialization
- Export to CSV
- Future: email notifications via Directus Flows (built-in automation)

## Docker Compose: Production Configuration

```yaml
services:
  database:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: "directus"
      POSTGRES_PASSWORD: "${DB_PASSWORD}"
      POSTGRES_DB: "directus"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U directus"]
      interval: 10s
      timeout: 5s
      retries: 5

  directus:
    image: directus/directus:11.14.1
    restart: unless-stopped
    ports:
      - "8055:8055"
    depends_on:
      database:
        condition: service_healthy
    volumes:
      - directus_uploads:/directus/uploads
      - ./extensions:/directus/extensions
    environment:
      SECRET: "${DIRECTUS_SECRET}"
      DB_CLIENT: "pg"
      DB_HOST: "database"
      DB_PORT: "5432"
      DB_DATABASE: "directus"
      DB_USER: "directus"
      DB_PASSWORD: "${DB_PASSWORD}"
      ADMIN_EMAIL: "${ADMIN_EMAIL}"
      ADMIN_PASSWORD: "${ADMIN_PASSWORD}"
      PUBLIC_URL: "${PUBLIC_URL}"
      CORS_ENABLED: "true"
      CORS_ORIGIN: "${CORS_ORIGIN}"

volumes:
  db_data:
  directus_uploads:
```

### Required `.env` File

```bash
DB_PASSWORD=change-me-strong-password
DIRECTUS_SECRET=generate-with-openssl-rand-base64-32
ADMIN_EMAIL=admin@medicusunion.com
ADMIN_PASSWORD=change-me-strong-password
PUBLIC_URL=https://api.medicusunion.kz
CORS_ORIGIN=https://medicusunion.kz
```

### CORS Configuration

Since the landing page (medicusunion.kz) and Directus API (api.medicusunion.kz or same server on port 8055) are on different origins, CORS must be enabled. Set `CORS_ORIGIN` to the exact landing page domain. Do NOT use `"true"` (allows all origins) in production.

## Fonts

| Font | Source | Purpose | Why |
|------|--------|---------|-----|
| Inter | Google Fonts or self-hosted | Body text | PROJECT.md brand spec. Excellent readability at all sizes |
| Manrope | Google Fonts or self-hosted | Headings | PROJECT.md brand spec. Clean geometric sans-serif |

**Self-host fonts** (download WOFF2 files, serve locally) rather than loading from Google Fonts. Reasons:
1. GDPR/privacy -- no third-party requests
2. Performance -- eliminates DNS lookup and connection to fonts.googleapis.com
3. Reliability -- no external dependency

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

No `npm install` for the frontend -- it is plain HTML/CSS/JS files.

### Backend Setup

```bash
# 1. Clone/create project directory
mkdir medicusunion-backend && cd medicusunion-backend

# 2. Create docker-compose.yml (as above)
# 3. Create .env file (as above)

# 4. Start services
docker compose up -d

# 5. Access Directus admin
# Open http://localhost:8055 and log in with ADMIN_EMAIL/ADMIN_PASSWORD

# 6. Create 'submissions' collection via admin UI
# Add fields: name, phone, specialization, description, status

# 7. Configure public role permissions
# Settings > Access Control > Public > submissions > Enable Create
```

### Optional: Dev Minification Tools

```bash
# Only if you want automated minification
npm install -g html-minifier-terser clean-css-cli terser
```

## Sources

- [Directus Official Docs: Create a Project](https://directus.io/docs/getting-started/create-a-project) -- Directus 11.14.1 docker-compose reference
- [Directus Official Docs: Deploying](https://directus.io/docs/self-hosting/deploying) -- PostgreSQL docker-compose with environment variables
- [Directus Official Docs: Items API](https://directus.io/docs/api/items) -- POST /items/{collection} endpoint
- [Directus Official Docs: Access Control](https://directus.io/docs/guides/auth/access-control) -- Public role permissions configuration
- [Directus GitHub: docker-compose.yml](https://github.com/directus/directus/blob/main/docker-compose.yml) -- Official reference compose file
- [Can I Use: Container Queries](https://caniuse.com/css-container-queries) -- Browser support reference
- [Frontend Masters: Modern CSS 2025](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/) -- CSS custom properties, grid, modern features
