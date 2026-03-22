# Architecture Patterns

**Domain:** Medical consultation landing page with Directus backend
**Researched:** 2026-03-23

## Recommended Architecture

Two-tier architecture: a **static front-end** (HTML/CSS/JS) served by Nginx, and a **Directus API backend** (Node.js + PostgreSQL) running in Docker. The landing page is a single `index.html` file with sectioned layout. Form submissions POST directly to the Directus REST API.

```
[Browser] ---> [Nginx]
                 |
                 +--- / (static files: HTML, CSS, JS, images)
                 |
                 +--- /api/* (reverse proxy) ---> [Directus :8055]
                                                      |
                                                      +--- [PostgreSQL]
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Static site (HTML/CSS/JS)** | Render 11 sections, form UI, accordion FAQ, smooth scroll, form validation | Directus API via fetch() |
| **Nginx** | Serve static files, reverse-proxy `/api/*` to Directus, SSL termination, gzip, caching headers | Static files (disk), Directus (HTTP) |
| **Directus** | REST API for form submissions, admin panel for viewing/managing leads, role-based access | PostgreSQL |
| **PostgreSQL** | Persist consultation requests, Directus system tables | Directus only |

### Data Flow

**Form submission (happy path):**

```
1. User fills form (name, phone, specialization, description)
2. JS validates client-side (required fields, phone format)
3. JS sends POST /api/items/consultation_requests
   - Content-Type: application/json
   - No auth token (public role has create-only permission)
4. Directus validates schema, inserts into PostgreSQL
5. Directus returns 200 with created item
6. JS shows success message, resets form
```

**Admin reviewing leads:**

```
1. Admin opens Directus admin panel (e.g., admin.medicusunion.kz)
2. Authenticates with email/password
3. Views consultation_requests collection
4. Filters by status, date, specialization
5. Updates status (new -> contacted -> completed)
```

## File Structure

```
/
+-- index.html                    # Single-page landing (all 11 sections)
+-- css/
|   +-- variables.css             # CSS custom properties (colors, fonts, spacing)
|   +-- base.css                  # Reset, typography, global styles
|   +-- sections.css              # All section-specific styles
|   +-- components.css            # Reusable: buttons, cards, accordion, form
|   +-- responsive.css            # Media queries (mobile-first breakpoints)
+-- js/
|   +-- main.js                   # Entry point, imports/initializes modules
|   +-- modules/
|       +-- form.js               # Form validation + Directus API submission
|       +-- accordion.js          # FAQ accordion behavior
|       +-- scroll.js             # Smooth scroll for CTA buttons
|       +-- navigation.js         # Mobile menu toggle, sticky header
+-- assets/
|   +-- images/                   # Optimized WebP + fallback PNG
|   +-- icons/                    # SVG icons (inline preferred)
|   +-- fonts/                    # Inter + Manrope (self-hosted WOFF2)
+-- docker/
|   +-- docker-compose.yml        # Directus + PostgreSQL + Nginx
|   +-- nginx/
|       +-- nginx.conf            # Server config with reverse proxy
|       +-- sites/
|           +-- landing.conf      # Site-specific: static + API proxy
+-- .env.example                  # Template for environment variables
```

**Why this structure:**
- **Single HTML file** -- landing page with 11 sections does not warrant a multi-page setup. Sections are anchored via `id` attributes for CTA scroll.
- **CSS split by concern, not by section** -- `variables.css` + `base.css` + `sections.css` + `components.css` + `responsive.css` keeps things maintainable without overcomplicating a single-page project. All imported via `<link>` tags (no build step needed).
- **JS modules** -- use native ES modules (`type="module"` on script tag). Each module handles one behavior. No bundler required for this scope.
- **Self-hosted fonts** -- critical for page speed; no external Google Fonts dependency. Target audience (45+, Kazakhstan) may have slow connections.

## CSS Architecture: BEM with Custom Properties

**Use BEM naming, not utility classes.** Rationale:

1. **No build step** -- Tailwind requires a build pipeline. BEM with vanilla CSS does not. Project constraint is pure HTML/CSS/JS.
2. **Readability for maintenance** -- BEM class names are self-documenting (`.hero__title`, `.form__input--error`). This project will be maintained by a small team.
3. **11 sections, not 100 components** -- utility-first shines in large component-based apps. A single landing page has limited scope where BEM stays clean.

**CSS Custom Properties for brand consistency:**

```css
/* variables.css */
:root {
  --color-primary: #38C6F4;
  --color-accent: #35B678;
  --color-dark: #18212C;
  --color-white: #FFFFFF;
  --color-gray-light: #F5F7FA;
  --color-text: #333333;

  --font-heading: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;

  --fs-h1: clamp(2rem, 5vw, 3.5rem);
  --fs-h2: clamp(1.5rem, 3vw, 2.5rem);
  --fs-body: clamp(1rem, 1.2vw, 1.125rem);
  --fs-body-large: clamp(1.125rem, 1.5vw, 1.25rem);

  --spacing-section: clamp(3rem, 8vw, 6rem);
  --max-width: 1200px;
  --border-radius: 12px;
}
```

**BEM convention for sections:**

```css
/* Example: hero section */
.hero { }
.hero__container { }
.hero__title { }
.hero__subtitle { }
.hero__cta { }

/* Example: form */
.form { }
.form__group { }
.form__label { }
.form__input { }
.form__input--error { }
.form__select { }
.form__button { }
.form__message { }
.form__message--success { }
.form__message--error { }
```

**Mobile-first breakpoints:**

```css
/* responsive.css */
/* Base: mobile (default) */
/* Tablet */
@media (min-width: 768px) { }
/* Desktop */
@media (min-width: 1024px) { }
/* Large desktop */
@media (min-width: 1280px) { }
```

## JavaScript Module Pattern

Use native ES modules. No bundler, no transpiler. Browser support for `type="module"` is universal in 2026.

```html
<!-- index.html -->
<script type="module" src="js/main.js"></script>
```

```javascript
// js/main.js
import { initForm } from './modules/form.js';
import { initAccordion } from './modules/accordion.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initNavigation } from './modules/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSmoothScroll();
  initAccordion();
  initForm();
});
```

```javascript
// js/modules/form.js
const API_URL = '/api/items/consultation_requests';

function validatePhone(phone) {
  // Kazakhstan phone: +7 7XX XXX XX XX
  return /^\+?7?\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.replace(/[\s\-()]/g, ''));
}

export function initForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // validate, collect FormData, POST to API_URL
    // show success/error message
  });
}
```

**Why no bundler:** The project has 4 JS modules totaling under 10KB. A bundler adds complexity with zero benefit at this scale. If the project grows (kazakh language, multiple pages), a simple Vite config can be added later without restructuring.

## Directus Data Model

### Collection: `consultation_requests`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID (auto) | Yes | Primary key |
| `status` | String (dropdown) | Yes | Default: `new`. Values: `new`, `contacted`, `in_progress`, `completed`, `cancelled` |
| `name` | String | Yes | Patient name |
| `phone` | String | Yes | Phone number with country code |
| `specialization` | String (dropdown) | Yes | Values: `oncology`, `cardiology`, `neurosurgery`, `orthopedics`, `radiology`, `ivf`, `other` |
| `description` | Text | No | Optional case description |
| `source_page` | String | No | Auto-filled: `medicusunion.kz` (for future multi-landing tracking) |
| `date_created` | Timestamp (auto) | Yes | Directus system field |
| `user_created` | UUID (auto) | No | Directus system field (null for public submissions) |

### Directus Permissions (Public Role)

| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| `consultation_requests` | YES (limited fields) | NO | NO | NO |

**Public role can only create items with these fields:** `name`, `phone`, `specialization`, `description`, `source_page`. The `status` field defaults to `new` and is NOT writable by public role -- only admins can change status. This prevents abuse.

### Field validation in Directus

- `name`: required, min length 2
- `phone`: required, regex pattern for international format
- `specialization`: required, must be one of allowed values

**Both client-side JS and Directus-side validation should exist.** Client-side for UX, server-side for security.

## Deployment Architecture

### Docker Compose Services

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: directus
      POSTGRES_USER: directus
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped

  directus:
    image: directus/directus:11
    ports:
      - "127.0.0.1:8055:8055"   # Only localhost, Nginx proxies
    volumes:
      - directus_uploads:/directus/uploads
    environment:
      DB_CLIENT: pg
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: directus
      DB_USER: directus
      DB_PASSWORD: ${DB_PASSWORD}
      SECRET: ${DIRECTUS_SECRET}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PUBLIC_URL: https://api.medicusunion.kz
    depends_on:
      - postgres
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/sites/:/etc/nginx/conf.d/:ro
      - ../:/var/www/landing:ro          # Static files
      - certbot_certs:/etc/letsencrypt:ro
    depends_on:
      - directus
    restart: unless-stopped

volumes:
  pgdata:
  directus_uploads:
  certbot_certs:
```

### Nginx Configuration (key parts)

```nginx
server {
    listen 443 ssl http2;
    server_name medicusunion.kz;

    root /var/www/landing;
    index index.html;

    # Static files with caching
    location / {
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API requests to Directus
    location /api/ {
        proxy_pass http://directus:8055/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Rate limit form submissions
        limit_req zone=api burst=5 nodelay;
    }

    # Block direct access to Directus admin from public domain
    location /api/admin/ {
        deny all;
    }

    # Assets caching
    location ~* \.(woff2|webp|png|jpg|svg|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Domain Strategy

| Domain | Purpose |
|--------|---------|
| `medicusunion.kz` | Landing page (static) + API proxy at `/api/*` |
| `admin.medicusunion.kz` (optional) | Directus admin panel (direct access, IP-restricted) |

## Patterns to Follow

### Pattern 1: Progressive Enhancement for Form
**What:** Form works with basic HTML first, JS enhances with validation and async submit.
**When:** Always for forms targeting 45+ audience who may have JS issues.
**Example:**
```html
<form id="consultation-form" action="/api/items/consultation_requests" method="POST">
  <!-- Fields here -->
  <button type="submit">Send request</button>
</form>
```
JS intercepts `submit`, prevents default, does async POST. If JS fails, the native form action still works (though the response will be JSON -- a reasonable fallback for a medical service landing page).

### Pattern 2: Section-Based Lazy Loading for Images
**What:** Use `loading="lazy"` on images below the fold.
**When:** All images except hero section.
**Why:** Page has 11 sections with potential imagery. Target audience may be on slow mobile connections in Kazakhstan.

### Pattern 3: API URL Abstraction
**What:** Define API base URL in one place (`js/config.js` or top of `main.js`).
**When:** From the start.
**Why:** When moving from development (localhost:8055) to production (/api), only one line changes.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Exposing Directus Admin on Public Domain
**What:** Making Directus admin panel accessible at `medicusunion.kz/admin`
**Why bad:** Exposes admin login page to the internet, increases attack surface for a medical data system.
**Instead:** Either restrict Directus admin to a separate subdomain with IP whitelisting, or block `/api/admin/` in Nginx and access admin only via SSH tunnel or VPN.

### Anti-Pattern 2: Storing Sensitive Data in Public Role
**What:** Allowing public role to read consultation_requests
**Why bad:** Anyone could scrape patient names, phones, medical info -- a privacy violation.
**Instead:** Public role gets CREATE-only permission. No read, no update, no delete.

### Anti-Pattern 3: Client-Side Only Validation
**What:** Relying solely on JavaScript for form validation without server-side rules.
**Why bad:** Trivially bypassed with curl or browser devtools. Leads to garbage data in DB.
**Instead:** Validate in JS for UX, validate in Directus field constraints for security.

### Anti-Pattern 4: Loading Fonts from Google CDN
**What:** Using `<link href="https://fonts.googleapis.com/...">` for Inter/Manrope.
**Why bad:** Extra DNS lookup, potential GDPR concern, slower load on Kazakhstan networks.
**Instead:** Self-host WOFF2 files in `assets/fonts/`, preload critical font weights.

## Scalability Considerations

| Concern | Current (MVP) | At 1K leads/month | At 10K leads/month |
|---------|---------------|---------------------|----------------------|
| **Database** | Single PostgreSQL in Docker | Same, add daily backups | Consider managed PostgreSQL (RDS equivalent) |
| **Static site** | Nginx serves files | Add CDN (Cloudflare) | Same |
| **Form spam** | Rate limiting in Nginx | Add honeypot field + rate limit | Add reCAPTCHA or Turnstile |
| **Directus** | Single container | Same | Consider Redis for caching |
| **Monitoring** | Docker logs | Add health checks | Add uptime monitoring (UptimeRobot) |
| **Localization** | Russian only | Add Kazakh (duplicate HTML sections with `lang` toggle) | Consider i18n library or Directus translations |

## Build Order (Dependencies)

The following sequence respects component dependencies:

```
Phase 1: Static Landing Page
  1. HTML structure (all 11 sections, semantic markup)
  2. CSS (variables -> base -> sections -> components -> responsive)
  3. JS navigation + scroll + accordion (no backend dependency)
  -- Deliverable: fully functional static page, form posts nowhere yet

Phase 2: Directus Backend
  4. Docker Compose setup (Postgres + Directus)
  5. Directus collection schema (consultation_requests)
  6. Public role permissions (create-only)
  7. Connect form.js to Directus API
  -- Deliverable: form submissions land in Directus

Phase 3: Production Deployment
  8. Nginx configuration (static + reverse proxy)
  9. SSL certificates (Let's Encrypt / Certbot)
  10. Domain DNS configuration
  11. Rate limiting, security headers
  -- Deliverable: live at medicusunion.kz
```

**Rationale:** The static page is the core deliverable and has zero backend dependencies. It can be reviewed, tested, and iterated on independently. Directus is layered on top. Production hardening is last because it only matters when going live.

## Sources

- [Directus Deployment Docs](https://directus.io/docs/self-hosting/deploying) -- HIGH confidence
- [Directus Access Control](https://directus.io/docs/guides/auth/access-control) -- HIGH confidence
- [Directus Docker Compose reference](https://github.com/directus/directus/blob/main/docker-compose.yml) -- HIGH confidence
- [Directus Docker + Nginx boilerplate](https://github.com/emidiotorre/directus-docker-compose) -- MEDIUM confidence
- [BEM methodology](https://getbem.com/introduction/) -- HIGH confidence
- [CSS Cascade Layers vs BEM vs Utility Classes (Smashing Magazine)](https://www.smashingmagazine.com/2025/06/css-cascade-layers-bem-utility-classes-specificity-control/) -- MEDIUM confidence
- [MDN: Dealing with files](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) -- HIGH confidence
