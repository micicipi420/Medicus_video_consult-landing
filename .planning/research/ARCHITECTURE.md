# Architecture Patterns: v6.0 Next.js Stack Migration

**Domain:** Static multi-page medical landing site migrating to Next.js 15 App Router
**Researched:** 2026-04-10
**Milestone:** v6.0 -- Rewrite vanilla HTML/CSS/JS to Next.js + React + Tailwind CSS + shadcn/ui + Framer Motion, replace Directus with Next.js API routes + Drizzle + PostgreSQL, Docker self-host
**Overall Confidence:** HIGH (well-documented migration path, standard patterns, existing codebase fully audited)

---

## 1. Current Architecture Snapshot

### File Map (source of truth)

```
Root
  index.html                 # Home (1187 LOC, 11 sections)
  online-consultations.html  # Consultations (931 LOC, 11 sections)
  treatment-abroad.html      # Treatment (1027 LOC)
  checkup.html               # Check-up (835 LOC)
  contacts.html              # Contacts (354 LOC, 2 sections)
  404.html                   # Error page (234 LOC)
  styleguide.html            # Design system reference (1008 LOC)

partials/
  header.html      # 26 LOC -- nav, logo, CTA, hamburger, 11 template tokens
  footer.html      # 61 LOC -- links, contacts, copyright
  mobile-menu.html # 18 LOC -- overlay nav with 4 template tokens
  sticky-bar.html  #  6 LOC -- mobile CTA bar
  svg-defs.html    # 21 LOC -- refraction SVG filters (3 tiers)

src/styles/
  tailwind.css     # Entry: @import chain (fonts, tailwind, theme, squircles, liquid-glass)
  fonts.css        # SF Pro Display + Rounded (local-only @font-face)
  theme.css        # ~300 LOC: :root tokens (50+ --liquid-*, --mu-*), .dark cascade, @theme inline, @layer base/utilities/components
  squircles.css    # ~150 LOC: 3-tier mask-image SVG squircles + corner-shape: squircle PE
  liquid-glass.css # ~400 LOC: 6 material classes, buttons, shimmer, section tints, refraction, reduced-motion

js/
  main.js          # 704 LOC IIFE: form, accordion, header scroll, mobile menu, phone mask, glass budget, refraction probe, mouse specular, animated counters
  animations.js    # ~120 LOC: Motion CDN entrance animations (fade-up, stagger, hero, header)
  router.js        # 464 LOC: SPA-like client router (fetch+swap <main>, update meta, prefetch)

Build:
  Makefile         # Canonical: tailwindcss CLI + build-pages.sh splicer
  scripts/build-pages.sh  # POSIX splicer: 5 partials x 7 pages, 11 template tokens per page
  tailwindcss      # Standalone binary v4.2.2 (no Node.js)

Backend:
  docker-compose.yml  # PostgreSQL 16 + Directus 11 (CORS configured)
  .env.example        # DB credentials, Directus secrets, CORS origins
```

### Mapping Primitives

| Current Concept | Role | Next.js Equivalent |
|----------------|------|-------------------|
| `partials/header.html` + template tokens | Shared header with per-page CTA/nav state | `components/layout/Header.tsx` + `usePathname()` |
| `partials/footer.html` | Shared footer | `components/layout/Footer.tsx` in root layout |
| `partials/mobile-menu.html` | Mobile nav overlay | `components/layout/MobileMenu.tsx` (client component) |
| `partials/sticky-bar.html` | Mobile sticky CTA | `components/layout/StickyBar.tsx` (client component) |
| `partials/svg-defs.html` | Global SVG filter defs | `components/svg/RefractionFilters.tsx` in root layout |
| `scripts/build-pages.sh` splicer | Chrome injection + token substitution | **Eliminated** -- Next.js layouts handle this natively |
| `js/router.js` SPA router | Client-side page transitions | **Eliminated** -- Next.js App Router handles this natively |
| `js/main.js` IIFE | All client-side behaviors | Split into individual React hooks and components |
| `js/animations.js` Motion CDN | Entrance animations | Framer Motion components (client-side) |
| `<!-- BUILD:vars -->` per page | CTA_HREF, CTA_LABEL, CURRENT_PAGE | Page-level metadata + route params |
| `Makefile` / tailwindcss binary | CSS build | `@tailwindcss/postcss` plugin in Next.js build pipeline |

---

## 2. Recommended Next.js File Structure

### Directory Tree

```
src/
  app/
    layout.tsx                  # Root layout: <html>, <body>, fonts, global providers
    globals.css                 # Tailwind entry + theme tokens + glass CSS
    page.tsx                    # / (index) -- SSG
    not-found.tsx               # 404 page
    online-consultations/
      page.tsx                  # /online-consultations -- SSG
    treatment-abroad/
      page.tsx                  # /treatment-abroad -- SSG
    checkup/
      page.tsx                  # /checkup -- SSG
    contacts/
      page.tsx                  # /contacts -- SSG
    styleguide/
      page.tsx                  # /styleguide -- SSG (dev only, exclude in prod)
    api/
      submissions/
        route.ts                # POST /api/submissions -- form handler
      health/
        route.ts                # GET /api/health -- Docker health check

  components/
    layout/
      Header.tsx                # Server component shell + client interactivity
      HeaderClient.tsx          # "use client" -- scroll state, mobile toggle
      Footer.tsx                # Server component
      MobileMenu.tsx            # "use client" -- overlay state, body lock
      StickyBar.tsx             # "use client" -- mobile CTA bar
      Navigation.tsx            # Server component -- nav links with active state via usePathname wrapper
    sections/
      Hero.tsx                  # Per-page hero (parameterized)
      Stats.tsx                 # Animated counters
      Services.tsx              # Service cards grid
      Problem.tsx               # "Znakomo?" section
      Process.tsx               # How-it-works steps
      WhyUs.tsx                 # Trust signals / advantages
      Clinics.tsx               # Partner clinics grid
      Platform.tsx              # Platform features
      Reviews.tsx               # Testimonials
      FAQ.tsx                   # Accordion (client component)
      ContactForm.tsx           # Form with validation (client component)
      FinalCTA.tsx              # Bottom CTA banner
      Pricing.tsx               # Pricing card
      Doctors.tsx               # Doctor profiles
    ui/                         # shadcn/ui primitives (installed via CLI)
      button.tsx
      card.tsx
      accordion.tsx
      input.tsx
      select.tsx
      badge.tsx
      ...
    glass/
      LiquidCard.tsx            # Glass card wrapper (applies squircle + liquid-card classes)
      LiquidButton.tsx          # Primary/secondary glass buttons
      SquircleWrapper.tsx       # Squircle mask utility component
      GlassProvider.tsx         # "use client" -- mouse specular tracking, glass budget
    motion/
      MotionDiv.tsx             # "use client" -- Framer Motion wrapper for server components
      MotionSection.tsx         # "use client" -- Section entrance animation
      ScrollReveal.tsx          # "use client" -- InView-triggered reveal
      AnimatedCounter.tsx       # "use client" -- Counter with Framer Motion
    svg/
      RefractionFilters.tsx     # SVG defs for refraction (server component, inline in layout)
      icons/                    # Individual icon components (flags, medical icons)

  lib/
    db/
      index.ts                  # Drizzle client singleton
      schema.ts                 # Drizzle table definitions (submissions, etc.)
      migrations/               # Drizzle Kit migration SQL files
    actions/
      submit-form.ts            # Server Action: form submission
    utils.ts                    # cn() helper, formatPhone(), etc.
    constants.ts                # API URLs, specialization list, phone number
    metadata.ts                 # Shared metadata generator for pages

  hooks/
    use-scroll-state.ts         # Header scroll detection
    use-phone-mask.ts           # Phone input formatting
    use-spam-protection.ts      # Honeypot + timing check
    use-form-validation.ts      # Field validation with Russian error messages

  styles/
    liquid-glass.css            # Glass material classes (imported in globals.css)
    squircles.css               # Squircle mask utilities (imported in globals.css)

  types/
    index.ts                    # Shared TypeScript types

public/
  fonts/                        # SF Pro Display/Rounded WOFF2 (if self-hosting)
  img/                          # All .webp images (hero, flags, doctors, etc.)
  favicon.ico
  favicon.svg
  apple-touch-icon.png
  site.webmanifest

next.config.ts                  # output: "standalone", image config
postcss.config.mjs              # @tailwindcss/postcss
drizzle.config.ts               # Drizzle Kit config
docker-compose.yml              # Next.js + PostgreSQL
Dockerfile                      # Multi-stage standalone build
.env.example                    # DATABASE_URL, NEXT_PUBLIC_* vars
```

### Rationale for Key Decisions

**`src/` directory:** Separates application code from config files. Standard for Next.js 15 projects. All app code lives under `src/`, configs (next.config.ts, docker-compose.yml, etc.) at root.

**Flat route structure (no route groups):** This is a 6-page marketing site, not a SaaS app. Route groups `(marketing)` add indirection with zero benefit. Each page is a direct folder under `app/`.

**`components/sections/` for page sections:** Each of the 11 index.html sections becomes a standalone component. Pages compose these sections. Other pages reuse shared sections (FAQ, ContactForm, FinalCTA).

**`components/glass/` for design system:** Isolates the Liquid Glass design system components. These wrap shadcn/ui primitives with glass material classes, squircle shapes, and specular effects.

**`components/motion/` for animation wrappers:** Framer Motion requires `"use client"`. Thin wrappers allow server components to compose animated elements without becoming client components themselves.

**`styles/` for glass CSS:** The liquid-glass.css and squircles.css files are **global CSS** because they define utility classes used across all components via className strings. They cannot be CSS Modules. They are imported in `globals.css` alongside Tailwind.

---

## 3. App Router Layout Hierarchy

### Root Layout (src/app/layout.tsx)

The root layout replaces the shared chrome currently injected by build-pages.sh.

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { StickyBar } from '@/components/layout/StickyBar'
import { RefractionFilters } from '@/components/svg/RefractionFilters'
import { GlassProvider } from '@/components/glass/GlassProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | MedicusUnion',
    default: 'MedicusUnion -- онлайн-консультации, лечение и чек-апы за рубежом | Казахстан',
  },
  // ... shared meta
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="relative bg-mu-text-50 selection:bg-mu-blue/30 selection:text-mu-text-900 overflow-x-clip">
        <RefractionFilters />
        <a href="#page-content" className="sr-only focus:not-sr-only ...">
          Перейти к&nbsp;содержимому
        </a>
        <Header />
        <MobileMenu />
        <GlassProvider>
          <main id="page-content" className="relative z-10 flex flex-col gap-8 md:gap-16 pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-8">
            {children}
          </main>
        </GlassProvider>
        <Footer />
        <StickyBar />
      </body>
    </html>
  )
}
```

### How This Replaces the Splicer

| Splicer Feature | Layout Equivalent |
|-----------------|-------------------|
| `<!-- BUILD:header -->` injection | `<Header />` component in root layout |
| `<!-- BUILD:footer -->` injection | `<Footer />` component in root layout |
| `<!-- BUILD:mobile-menu -->` injection | `<MobileMenu />` component in root layout |
| `<!-- BUILD:sticky-bar -->` injection | `<StickyBar />` component in root layout |
| `<!-- BUILD:svg-defs -->` injection | `<RefractionFilters />` component in root layout |
| `{{CTA_HREF}}` / `{{CTA_LABEL}}` per page | Per-page props or route-aware logic in Header |
| `{{CURRENT_PAGE}}` for nav active state | `usePathname()` in a client wrapper inside Navigation |
| `{{NAV_HEADER_*}}` / `{{NAV_MOBILE_*}}` | Computed from `usePathname()` match |
| `{{LOGO_ARIA_CURRENT}}` for index | `pathname === '/'` check |

### Per-Page CTA Customization

The splicer currently injects different CTA_HREF per page (e.g., `#contact` on index, `#consultation-form` on online-consultations, `#contact-section` on contacts). In Next.js, the Header component reads this from a route config:

```typescript
// src/lib/constants.ts
export const PAGE_CTA: Record<string, { href: string; label: string }> = {
  '/': { href: '#contact', label: 'Оставить заявку' },
  '/online-consultations': { href: '#consultation-form', label: 'Оставить заявку' },
  '/treatment-abroad': { href: '#treatment-form', label: 'Оставить заявку' },
  '/checkup': { href: '#checkup-form', label: 'Оставить заявку' },
  '/contacts': { href: '#contact-section', label: 'Оставить заявку' },
}
```

The Header client wrapper reads `usePathname()` and looks up the CTA config. This eliminates all 11 template tokens from the splicer.

### Layout Persistence

Next.js App Router layouts **do not re-render** on route change. The `<Header />`, `<Footer />`, `<MobileMenu />`, and `<StickyBar />` components persist across page navigations -- identical behavior to the current SPA router that keeps these elements persistent and only swaps `<main>`. The custom router.js becomes unnecessary.

---

## 4. CSS Organization

### globals.css (replaces src/styles/tailwind.css)

```css
/* src/app/globals.css */
@import 'tailwindcss';

/* Design system layers */
@import '../styles/liquid-glass.css';
@import '../styles/squircles.css';

/* Theme tokens -- replaces src/styles/theme.css */
@custom-variant dark (&:is(.dark *));

:root {
  /* All existing --mu-*, --liquid-*, --squircle-mask-* tokens */
  /* Copy verbatim from current theme.css */
}

.dark {
  /* All existing dark mode token overrides */
}

@theme inline {
  /* All existing Tailwind theme extensions */
}

@layer base { /* ... existing base styles ... */ }
@layer components { /* ... existing component styles ... */ }
@layer utilities { /* ... existing utility styles ... */ }
```

### Where Glass CSS Lives: Global, Not Component-Scoped

**Decision: liquid-glass.css and squircles.css remain global CSS files imported in globals.css.**

Rationale:
1. Glass classes (`.liquid-card`, `.liquid-nav`, `.squircle-lg`) are used via `className` across 20+ components. They are design system utilities, not component-specific styles.
2. CSS custom properties (`--liquid-bg`, `--liquid-blur-md`) must cascade from `:root` / `.dark` -- they cannot be scoped to a CSS Module.
3. The `@supports (corner-shape: squircle)` progressive enhancement block applies globally.
4. `backdrop-filter` interactions (stacking contexts, compositing) require global awareness.
5. Tailwind v4's `@theme inline` already integrates these tokens into the utility system.

The glass files are **not** converted to CSS Modules or Tailwind plugin. They stay as plain CSS files imported alongside Tailwind -- identical to how shadcn/ui's own globals work.

### Font Strategy

Current: SF Pro Display + Rounded via `local()` only (system font on Apple devices, generic sans fallback elsewhere).

For Next.js, keep the same strategy. Use `next/font/local` if self-hosting WOFF2 files, otherwise maintain the `local()` fallback chain:

```typescript
// src/app/layout.tsx
// Option A: If we self-host font files
import localFont from 'next/font/local'
const sfPro = localFont({
  src: [{ path: '../fonts/SFProDisplay-Regular.woff2', weight: '400' }, ...],
  variable: '--font-family-body',
})

// Option B: Keep current local() approach (simpler, Apple-only with fallback)
// No next/font needed -- fonts.css handles it via @font-face with local() src
```

**Recommendation:** Keep Option B (current approach) initially. The fonts.css file works as-is. Only switch to next/font/local if self-hosting WOFF2 files for cross-platform consistency.

---

## 5. Component Boundaries: Server vs Client

### Server Components (default)

| Component | Why Server |
|-----------|-----------|
| `Header.tsx` (shell) | Static markup, no interactivity in the shell |
| `Footer.tsx` | Fully static content |
| `Navigation.tsx` | Static link rendering (active state delegated to client wrapper) |
| `RefractionFilters.tsx` | Static SVG, no JS needed |
| All section components (Hero, Services, etc.) | Static content, rendered at build time |
| `LiquidCard.tsx` | Just applies CSS classes, no JS |
| `SquircleWrapper.tsx` | Just applies CSS classes, no JS |
| Page files (`page.tsx`) | Static pages, SSG |

### Client Components ("use client")

| Component | Why Client | Current JS Equivalent |
|-----------|-----------|----------------------|
| `HeaderClient.tsx` | Scroll event listener for `.header--scrolled` | `initStickyHeader()` |
| `MobileMenu.tsx` | Toggle state, body scroll lock | `initMobileMenu()` |
| `StickyBar.tsx` | Visibility state, click handling | Part of mobile menu logic |
| `FAQ.tsx` (accordion) | Open/close state, aria-expanded | `initAccordion()` |
| `ContactForm.tsx` | Form state, validation, submission | `initFormValidation()`, `initPhoneMask()`, `initSpamProtection()` |
| `AnimatedCounter.tsx` | IntersectionObserver, animation | `initAnimatedCounters()` |
| `GlassProvider.tsx` | Mouse tracking for specular, glass budget | `initMouseSpecular()`, `initGlassBudget()` |
| `ScrollReveal.tsx` | Framer Motion inView animation | `animations.js` |
| `MotionDiv.tsx` / `MotionSection.tsx` | Framer Motion wrappers | `animations.js` |

### The Server/Client Split Pattern

Server components render section HTML with glass CSS classes. Client components handle interactivity. Example:

```
<Hero>                           ← Server Component (static HTML + glass classes)
  <MotionSection>                ← Client Component (entrance animation wrapper)
    <h1 className="...">...</h1> ← Static content from server
    <LiquidCard>                 ← Server Component (applies liquid-card class)
      <AnimatedCounter />        ← Client Component (counter animation)
    </LiquidCard>
  </MotionSection>
</Hero>
```

This pattern keeps the component tree mostly server-rendered with thin client islands for interactivity -- matching Next.js 15's "server-first" philosophy.

---

## 6. Data Layer: Drizzle ORM + PostgreSQL

### Why Drizzle Over Prisma

| Criterion | Drizzle | Prisma |
|-----------|---------|--------|
| Bundle size | ~7.4 KB gzip | ~2 MB (engine binary) |
| Cold start | Negligible | 200-500ms (Rust engine init) |
| Docker image size | Minimal impact | Adds ~15 MB for engine |
| SQL control | Direct SQL-like API | Abstract query builder |
| Schema definition | TypeScript code-first | .prisma schema file |
| Migration workflow | SQL files via drizzle-kit | prisma migrate |
| Self-hosted fit | Better (no engine binary in Docker) | Works but heavier |

**Decision: Use Drizzle ORM** because this project is self-hosted Docker (not Vercel), has exactly one table (submissions), and the smaller bundle/image size matters for a medical landing page that must load fast.

### Schema (replaces Directus collection)

```typescript
// src/lib/db/schema.ts
import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
```

### Database Connection

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client, { schema })
```

### Form Submission: Server Action (replaces Directus POST)

```typescript
// src/lib/actions/submit-form.ts
'use server'

import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'

export async function submitConsultation(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const specialization = formData.get('specialization') as string
  const description = formData.get('description') as string | null

  // Server-side validation
  if (!name || name.trim().length < 2) throw new Error('Invalid name')
  if (!phone || phone.replace(/\D/g, '').length !== 11) throw new Error('Invalid phone')
  if (!specialization) throw new Error('Invalid specialization')

  await db.insert(submissions).values({
    name: name.trim(),
    phone: phone.trim(),
    specialization,
    description: description?.trim() || null,
    status: 'new',
  })

  return { success: true }
}
```

### API Route Handler (for external consumers, webhooks)

```typescript
// src/app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate + insert (same as server action)
  await db.insert(submissions).values({
    name: body.name,
    phone: body.phone,
    specialization: body.specialization,
    description: body.description || null,
    status: 'new',
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
```

### Migration from Directus

The Directus `consultation_requests` collection maps 1:1 to the Drizzle `submissions` table. Migration steps:

1. Export existing data from Directus PostgreSQL: `pg_dump -t consultation_requests`
2. Create Drizzle schema and run `drizzle-kit push` to create the new table
3. Import data with column mapping (Directus uses `date_created`, Drizzle uses `created_at`)
4. Switch the form endpoint from `https://api.medicusunion.kz/items/consultation_requests` to `/api/submissions` (or use the server action directly)
5. Remove Directus from docker-compose.yml

**Important:** The Directus admin UI for viewing submissions is lost. Phase 2 of v6.0 should include a simple admin page (behind auth) or use a tool like Drizzle Studio for data viewing.

---

## 7. Docker Configuration

### docker-compose.yml (replaces current Directus stack)

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "${PORT:-3000}:3000"
    depends_on:
      database:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER:-medicus}:${DB_PASSWORD:-medicus}@database:5432/${DB_DATABASE:-medicus}
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  database:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${DB_USER:-medicus}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-medicus}
      POSTGRES_DB: ${DB_DATABASE:-medicus}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-medicus}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Dockerfile (multi-stage standalone build)

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
```

### next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Images are all local .webp files, no external domains needed
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
}

export default nextConfig
```

### What Changes from Current Docker Setup

| Aspect | Current (Directus) | New (Next.js) |
|--------|-------------------|--------------|
| Services | `database` + `directus` | `database` + `app` |
| App image | `directus/directus:11` (pre-built) | Custom multi-stage build |
| App port | 8055 | 3000 |
| Reverse proxy | nginx (separate, serves static + proxies /api) | Next.js serves everything (static + API) |
| CORS config | Directus env vars | Not needed (same-origin, server actions) |
| Admin UI | Directus admin panel | None initially (use Drizzle Studio or build later) |
| Volumes | pgdata + uploads + extensions | pgdata only |
| Build time | None (pre-built image) | ~60-90s (Next.js build) |
| Image size | ~400 MB (Directus) | ~120-150 MB (standalone) |

**nginx is eliminated.** Next.js standalone serves both static assets and API routes on a single port. For production SSL termination, use a cloud load balancer or add an nginx/Caddy reverse proxy in front.

---

## 8. Build Pipeline Migration

### Current Pipeline

```
Makefile → tailwindcss CLI binary → css/styles.css
         → scripts/build-pages.sh → splice partials into 7 HTML pages
```

### New Pipeline

```
npm run dev   → next dev (Tailwind via PostCSS, hot reload, API routes)
npm run build → next build (SSG pages, standalone output, Tailwind compiled)
npm run start → node .next/standalone/server.js
```

### postcss.config.mjs

```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### What Gets Eliminated

| Old Artifact | Status |
|-------------|--------|
| `Makefile` | Removed -- `npm run build` replaces it |
| `scripts/build-pages.sh` | Removed -- Next.js layouts replace splicer |
| `tailwindcss` binary | Removed -- `@tailwindcss/postcss` in build pipeline |
| `css/styles.css` (compiled output) | Removed -- Next.js handles CSS compilation |
| `js/router.js` | Removed -- Next.js App Router replaces it |
| `js/main.js` IIFE | Decomposed into React hooks and components |
| `js/animations.js` + Motion CDN | Replaced by Framer Motion npm package |
| `partials/` directory | Removed -- React components in `components/layout/` |

---

## 9. Page-by-Page Migration Map

### index.html (Home)

```
src/app/page.tsx
  ├── Hero section (unique to index)
  ├── Stats section (counter animation)
  ├── Services section (3 card grid)
  ├── Problem section ("Znakomo?")
  ├── Process section (4 steps)
  ├── WhyUs section (trust signals)
  ├── Clinics section (partner grid)
  ├── Platform section (features)
  ├── Reviews section (testimonials)
  ├── FAQ section (accordion)
  ├── ContactForm section
  └── FinalCTA section
```

### online-consultations.html

```
src/app/online-consultations/page.tsx
  ├── Hero section (consultations variant)
  ├── Features section
  ├── Problem section
  ├── Benefits section
  ├── Process section
  ├── Doctors section
  ├── WhyMedicusUnion section
  ├── Triggers section
  ├── Pricing section
  ├── ContactForm section (reused component)
  ├── FAQ section (reused component, different questions)
  └── FinalCTA section (reused component)
```

### treatment-abroad.html, checkup.html

Same pattern: unique hero + unique sections + reused ContactForm + FAQ + FinalCTA.

### contacts.html

```
src/app/contacts/page.tsx
  ├── Contact info section (addresses, phone, email)
  └── ContactForm section (reused component)
```

### 404.html

```
src/app/not-found.tsx
  └── Error page with CTA back to home
```

### Shared Section Reuse Matrix

| Section Component | index | consultations | treatment | checkup | contacts |
|-------------------|-------|---------------|-----------|---------|----------|
| Hero | unique | unique | unique | unique | -- |
| ContactForm | Y | Y | Y | Y | Y |
| FAQ | Y | Y | Y | Y | -- |
| FinalCTA | Y | Y | Y | Y | -- |
| Stats | Y | -- | -- | -- | -- |
| Services | Y | -- | -- | -- | -- |
| Pricing | -- | Y | Y | Y | -- |

---

## 10. Data Flow Diagram

```
Browser                    Next.js Server                  PostgreSQL
  │                             │                              │
  ├── GET /                     │                              │
  │   ← SSG HTML + CSS + JS ───┤                              │
  │                             │                              │
  ├── Form submit ──────────────┤                              │
  │   (Server Action or         │                              │
  │    POST /api/submissions)   │                              │
  │                             ├── INSERT INTO submissions ───┤
  │                             │   ← OK ──────────────────────┤
  │   ← { success: true } ─────┤                              │
  │                             │                              │
  ├── Client-side only:         │                              │
  │   - Scroll animations       │                              │
  │   - Mouse specular          │                              │
  │   - Form validation         │                              │
  │   - Phone mask              │                              │
  │   - Accordion toggle        │                              │
  │   - Mobile menu             │                              │
  │   - Counter animation       │                              │
```

### SSG vs SSR Decision

**All pages are statically generated (SSG).** None of the pages need per-request data from the database. The form submission is a client-side action. Use `export const dynamic = 'force-static'` or simply rely on Next.js 15's default static rendering for pages with no dynamic data.

The only server-side runtime work is the `POST /api/submissions` route handler (or server action), which runs on demand.

---

## 11. Integration Points: Old-to-New Mapping

### Critical Integration Points

| # | Old Code | New Code | Risk |
|---|----------|----------|------|
| 1 | `fetch(API_URL, { method: 'POST' })` → Directus | Server Action or Route Handler → Drizzle → PostgreSQL | LOW -- straightforward replacement |
| 2 | Template tokens (`{{CTA_HREF}}`, etc.) | `usePathname()` + constants map | LOW -- simpler, no build step |
| 3 | `initStickyHeader()` scroll listener | `useScrollState()` hook in HeaderClient | LOW -- direct translation |
| 4 | `initMobileMenu()` DOM manipulation | React state in MobileMenu component | LOW -- cleaner with React state |
| 5 | `initAccordion()` toggle logic | shadcn/ui Accordion or custom FAQ component | LOW -- well-understood pattern |
| 6 | `initPhoneMask()` input formatting | `usePhoneMask()` hook | LOW -- direct translation |
| 7 | `initFormValidation()` imperative | React Hook Form or custom validation hook | LOW |
| 8 | Motion CDN animations | Framer Motion npm | MEDIUM -- API differences |
| 9 | Glass budget IntersectionObserver | GlassProvider context + IntersectionObserver | MEDIUM -- React lifecycle management |
| 10 | Mouse specular tracking | GlassProvider context + mousemove | LOW -- same approach, React wrapper |
| 11 | Refraction probe (`data-refract` attribute) | Client-side effect in GlassProvider | LOW |
| 12 | `@font-face` local() chain | Keep as-is in globals.css OR next/font/local | LOW |
| 13 | Schema.org JSON-LD | Next.js `metadata` API + `generateMetadata()` | LOW |
| 14 | `og:*` meta tags per page | `generateMetadata()` per page.tsx | LOW |
| 15 | `link[rel=canonical]` per page | `metadata.alternates.canonical` | LOW |

### No Orphaned Features

Every feature in the current codebase has a mapped destination:

- Splicer → Layout components
- Router → App Router
- Form submission → Server Action + Drizzle
- All 10 JS init functions → React hooks/components
- All CSS → globals.css imports
- All images → public/img/
- All meta tags → Next.js metadata API
- Schema.org JSON-LD → Next.js metadata API
- bfcache handler → Not needed (App Router handles)
- Prefetch → Built-in Next.js `<Link>` prefetching
- Page cache → SSG static files

---

## 12. Anti-Patterns to Avoid

### Anti-Pattern 1: Making Everything a Client Component
**What:** Adding `"use client"` to section components because they have Tailwind classes
**Why bad:** Bloats JS bundle, defeats SSG optimization, slower page load
**Instead:** Only mark components that genuinely need browser APIs (event listeners, state, effects) as client components. Glass CSS classes work in server components.

### Anti-Pattern 2: CSS Modules for Glass Styles
**What:** Converting liquid-glass.css to .module.css files
**Why bad:** Glass classes are utilities applied via className across many components. CSS Modules scope class names, breaking the utility pattern. Token cascade from :root breaks.
**Instead:** Keep as global CSS imported in globals.css.

### Anti-Pattern 3: Wrapping Directus with an ORM
**What:** Keeping Directus and adding Prisma/Drizzle on top
**Why bad:** Two databases, two ORMs, redundant complexity for one table
**Instead:** Replace Directus entirely. One PostgreSQL, one Drizzle schema.

### Anti-Pattern 4: Recreating the SPA Router
**What:** Building custom page transition animations that fight App Router
**Why bad:** Next.js handles route transitions. Custom animation layers create hydration mismatches and navigation bugs.
**Instead:** Use Framer Motion `AnimatePresence` with layout animations if smooth transitions are needed, but start without them.

### Anti-Pattern 5: Over-Abstracting Components
**What:** Creating a generic `<Section>` component that takes 20 props
**Why bad:** Each section has unique layout, content, and structure. Generic components become prop soup.
**Instead:** Each section is its own component. Shared patterns (container width, padding) are Tailwind utility classes.

### Anti-Pattern 6: Server Actions for Read Operations
**What:** Using server actions to fetch page data
**Why bad:** All pages are static content -- no data fetching needed at request time
**Instead:** Hardcode content in components (it is a marketing site). Consider a CMS later if content updates become frequent.

---

## 13. Scalability Considerations

| Concern | Current (6 pages) | At 20 pages | At 50+ pages |
|---------|-------------------|-------------|-------------|
| Page content | Hardcoded in components | Still hardcoded (acceptable) | Extract to CMS/MDX |
| Form submissions | Single table | Single table (fine) | Partition by date |
| Build time | ~5s (Tailwind + splicer) | ~20s (Next.js SSG) | ~60s (still fine) |
| Docker image | ~120 MB | ~120 MB (unchanged) | ~130 MB |
| Admin panel | None (Drizzle Studio) | Build basic /admin | Full admin dashboard |

---

## 14. Migration Phasing Recommendation

### Phase 1: Scaffold + Layout + CSS (no content)
- Create Next.js project with Tailwind v4
- Port globals.css (theme.css + liquid-glass.css + squircles.css)
- Build root layout with Header, Footer, MobileMenu, StickyBar
- Verify glass rendering matches current site
- **Validation:** Side-by-side screenshot comparison

### Phase 2: Page Content Migration
- Port each page's sections as React components
- Start with index.html (most complex, validates all patterns)
- Port remaining 5 pages
- **Validation:** All 6 pages render identically to current site

### Phase 3: Client Interactivity
- Port form validation, phone mask, spam protection
- Port accordion, scroll animations, counter
- Port mouse specular, glass budget, refraction probe
- Replace Motion CDN with Framer Motion
- **Validation:** All interactive features work

### Phase 4: Data Layer
- Set up Drizzle + PostgreSQL
- Create submissions schema and migration
- Implement server action for form submission
- Implement API route handler
- Migrate existing Directus data
- **Validation:** Form submissions stored in PostgreSQL

### Phase 5: Docker + Deploy
- Create Dockerfile (multi-stage standalone)
- Update docker-compose.yml
- Test health checks
- Deploy to production
- **Validation:** Site live on medicusunion.kz

---

## Sources

- [Next.js Official: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) -- File conventions for App Router
- [Next.js Official: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) -- Layout hierarchy and persistence
- [Next.js Official: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) -- API route pattern
- [Next.js Official: Deploying](https://nextjs.org/docs/app/getting-started/deploying) -- Standalone output + Docker
- [Next.js Official: CSS](https://nextjs.org/docs/app/getting-started/css) -- Global CSS and Tailwind integration
- [Next.js Docker Example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/README.md) -- Official multi-stage Dockerfile
- [Tailwind CSS v4 + Next.js Guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS plugin setup
- [shadcn/ui: Tailwind v4 Setup](https://ui.shadcn.com/docs/tailwind-v4) -- CSS variables and theme inline
- [shadcn/ui: Next.js Installation](https://ui.shadcn.com/docs/installation/next) -- Component installation
- [Drizzle ORM + PostgreSQL + Next.js 15](https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project) -- Schema, connection, server actions
- [Drizzle ORM Docs: Neon + Next.js Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon) -- Official tutorial
- [Drizzle vs Prisma 2026 Comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma) -- Bundle size, performance, DX
- [Framer Motion + Next.js Server Components](https://www.hemantasundaray.com/blog/use-framer-motion-with-nextjs-server-components) -- "use client" wrapper pattern
- [Motion: React motion component](https://motion.dev/docs/react-motion-component) -- Official Motion/Framer docs
- [Next.js 15 Standalone Docker Optimization](https://javascript.plainenglish.io/next-js-15-self-hosting-with-docker-complete-guide-0826e15236da) -- Image size optimization
- [squircle.js.org](https://squircle.js.org/) -- @squircle-js/react documentation
