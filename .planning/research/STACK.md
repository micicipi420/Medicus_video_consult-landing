# Technology Stack: Next.js Migration

**Project:** MedicusUnion KZ Landing v6.0
**Researched:** 2026-04-10
**Migration from:** Vanilla HTML + Tailwind CSS v4 (standalone CLI) + Vanilla JS + Directus 11
**Migration to:** Next.js + React + Tailwind CSS v4 + shadcn/ui + Motion + PostgreSQL direct

---

## Decision: Next.js 15 (not 16)

**Use Next.js 15.5.x (latest patch: ~15.5.15).**

Next.js 16 (16.2.2 LTS) is available but introduces breaking changes that add migration risk with no benefit for this project:
- Fully removes synchronous request API access (Next.js 15 has deprecation warnings but still works)
- Removes AMP support entirely (not used, but signals aggressive API churn)
- Changes caching to fully opt-in (different mental model, no benefit for a landing page)
- Turbopack as default bundler -- potential edge cases with custom PostCSS (Tailwind v4)

Next.js 15 is stable, battle-tested, has the widest ecosystem compatibility (shadcn/ui, Motion, Drizzle all verified on 15), and receives security patches. Upgrade to 16 later when the ecosystem is fully settled.

**Confidence: HIGH** -- verified via official docs, release notes, and ecosystem compatibility reports.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.5.x | Framework (App Router, SSR/SSG, API routes) | Stable, widest library compat, standalone Docker output, security patches active | HIGH |
| React | 19.x | UI runtime | Ships with Next.js 15; required by shadcn/ui and Motion 12 | HIGH |
| TypeScript | 5.x | Type safety | Next.js default; Drizzle ORM type inference requires it | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.x (~4.2) | Utility-first CSS | Already used in current project (standalone CLI); v4 is the default for shadcn/ui now; CSS-first config via `@theme` directive matches existing token architecture | HIGH |
| @tailwindcss/postcss | 4.x | PostCSS plugin for Next.js | Next.js uses PostCSS pipeline; replaces standalone CLI build | HIGH |
| tw-animate-css | latest | Animation utilities | Replaces deprecated `tailwindcss-animate`; required by shadcn/ui components (accordion, dialog) | HIGH |

### UI Components

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| shadcn/ui | latest (CLI) | Base component library | Not an npm package -- CLI copies components into `src/components/ui/`. Provides accessible, unstyled-by-default React components (Button, Card, Dialog, Accordion, Form, Input, Select, Textarea). Tailwind v4 + React 19 compatible | HIGH |
| class-variance-authority | 0.7.x | Component variant API | Dependency of shadcn/ui -- typed variant props for button sizes, card styles | HIGH |
| clsx + tailwind-merge | latest | Class merging | Dependency of shadcn/ui -- `cn()` utility for conditional + deduplicated Tailwind classes | HIGH |
| lucide-react | latest | Icons | Default icon library for shadcn/ui; tree-shakeable; replaces inline SVG icons | HIGH |

### Squircle Corners

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @squircle-js/react | 1.3.0 | Squircle corner rendering (React component) | 2.1kB gzipped; uses JS calculation for iOS-style superellipse corners; provides `<Squircle>` component with `cornerRadius` + `cornerSmoothing` props; SSR fallback via `<SquircleNoScript>` | MEDIUM |

**Integration strategy with existing squircle system:**

The current CSS mask-image SVG approach (in `squircles.css`) is highly optimized and already has 3-tier progressive enhancement (corner-shape: squircle for Chrome 139+, mask-image SVG for Safari/Firefox, border-radius fallback). `@squircle-js/react` uses a different approach (JS-calculated clip paths) that produces similar visual results but loses the mask-image optimization.

**Recommendation:** Keep the existing CSS squircle classes as Tailwind `@layer components` utilities and use them directly in React via className. Only use `@squircle-js/react` if you need squircles on dynamically-sized elements where the SVG mask approach distorts. The CSS approach is zero-JS, zero-bundle-cost, and already battle-tested.

```tsx
// PREFERRED: CSS class approach (zero JS cost)
<article className="squircle-lg liquid-card p-6">
  <h3>Card title</h3>
</article>

// FALLBACK: @squircle-js/react (for dynamic sizing edge cases only)
import { Squircle } from '@squircle-js/react';
<Squircle cornerRadius={24} cornerSmoothing={0.8} className="liquid-card p-6">
  <h3>Card title</h3>
</Squircle>
```

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| motion | 12.38.x | Mount/hover/scroll-reveal animations | Renamed from framer-motion; import from `motion/react`; no breaking changes in v12; supports React 19; 44kB gzipped but tree-shakeable | HIGH |

**Critical: SSR compatibility pattern.** Motion components require `"use client"` directive. Create a wrapper module:

```tsx
// src/components/motion/index.tsx
"use client";
export { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
```

Then import from `@/components/motion` in Server Components without marking the whole page as client.

**Motion tokens from existing CSS:** Map existing `--ease-liquid`, `--dur-hover`, etc. to Motion transition presets:

```tsx
// src/lib/motion-presets.ts
export const liquidTransition = {
  type: "tween" as const,
  ease: [0.2, 0, 0, 1], // matches --ease-liquid: cubic-bezier(0.2, 0, 0, 1)
  duration: 0.28,        // matches --dur-hover: 280ms
};

export const revealTransition = {
  type: "tween" as const,
  ease: [0.16, 1, 0.3, 1], // matches --ease-liquid-out
  duration: 0.6,             // matches --dur-reveal: 600ms
};

export const pressTransition = {
  type: "tween" as const,
  ease: [0.2, 0, 0, 1],
  duration: 0.12, // matches --dur-press: 120ms
};
```

### Glass Refraction (Hero)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| liquid-glass-react | latest | WebGL refraction effect for hero section | React component; 4 modes (standard, polar, prominent, shader); configurable displacement, blur, saturation, chromatic aberration; arbitrary children support | LOW |

**WARNING: This is a risky dependency.**

Assessment of liquid glass WebGL options:

1. **liquid-glass-react** (rdev) -- React component, npm installable, configurable. But: Chrome/Edge only for full displacement effect (Safari/Firefox show no displacement). New library with unknown stability.

2. **liquidGL** (naughtyduk) -- More mature, shared WebGL canvas, up to 30 elements. But: NO npm package (CDN script only), requires html2canvas, no React API, Safari unstable above 50% viewport.

3. **@specy/liquid-glass-react** -- Three.js powered, React wrapper. But: heavy dependency (Three.js is ~150kB gzipped), expensive initialization, position tracking limitations.

**Recommendation:** Start with pure CSS glass (current `liquid-glass.css` classes work identically in React via className). Add `liquid-glass-react` only for the hero refraction effect as progressive enhancement, with CSS `backdrop-filter` as the universal fallback. Do NOT make WebGL glass a hard dependency.

```tsx
// Hero glass: progressive enhancement
"use client";
import dynamic from 'next/dynamic';

const LiquidGlass = dynamic(
  () => import('liquid-glass-react').then(mod => mod.LiquidGlass),
  { ssr: false } // WebGL cannot render server-side
);

function HeroGlass({ children }: { children: React.ReactNode }) {
  return (
    <LiquidGlass
      mode="standard"
      displacementScale={50}
      blurAmount={0.05}
      saturation={140}
      cornerRadius={24}
      className="liquid-card" // CSS fallback styles
    >
      {children}
    </LiquidGlass>
  );
}
```

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Drizzle ORM | 0.45.x | Type-safe SQL query builder | Lightweight (no heavy runtime like Prisma); SQL-first; type inference from schema; works in Next.js Server Components and API routes without extra config | HIGH |
| drizzle-kit | latest | Schema migrations, studio | CLI tool for generating/running migrations, introspecting existing DB | HIGH |
| postgres (postgres.js) | latest | PostgreSQL driver | Faster than `pg` for prepared statements (Drizzle uses them by default); zero native dependencies; ESM-first; simpler API than `pg` | HIGH |

**Database connection pattern for Next.js:**

```tsx
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection pool for server-side queries.
// IMPORTANT: In Next.js dev mode, hot reload creates new connections.
// Use globalThis to preserve the client across reloads.
const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

const connectionString = process.env.DATABASE_URL!;

const client = globalForDb.pgClient ?? postgres(connectionString, {
  max: 10,               // connection pool size
  idle_timeout: 20,      // seconds
  connect_timeout: 10,   // seconds
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
```

**Schema migration from Directus `submissions` table:**

```tsx
// src/db/schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  specialization: text('specialization').notNull(),
  description: text('description'),
  status: text('status').default('new').notNull(),
  dateCreated: timestamp('date_created').defaultNow().notNull(),
});
```

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Docker + Docker Compose | latest | Container orchestration | Existing infrastructure; `output: "standalone"` produces minimal Next.js server image (~130MB vs ~1GB full) | HIGH |
| Node.js | 22.x LTS | Runtime | Next.js 15 requires Node.js 18.18+; 22.x LTS is production-stable through April 2027 | HIGH |
| Nginx | latest | Reverse proxy, SSL | Already in use; proxies to Next.js on port 3000 instead of serving static files | HIGH |

**Docker Compose structure (Next.js + PostgreSQL):**

```yaml
# docker-compose.yml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://${PG_USER}:${PG_PASSWORD}@db:5432/${PG_DATABASE}
      - NODE_ENV=production
      - HOSTNAME=0.0.0.0
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${PG_USER}
      POSTGRES_PASSWORD: ${PG_PASSWORD}
      POSTGRES_DB: ${PG_DATABASE}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${PG_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Multi-stage Dockerfile:**

```dockerfile
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && pnpm build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Fonts

| Technology | Approach | Purpose | Why | Confidence |
|------------|----------|---------|-----|------------|
| next/font/local | Built-in | Self-hosted font loading | Replaces manual @font-face; automatic `font-display: swap`, preload, no FOUT/FOIT; keeps fonts self-hosted (no Google CDN dependency) | HIGH |

**Current fonts to migrate:**

The current project uses SF Pro Display (body) and SF Pro Rounded (headings) via `local()` system font declarations. These are Apple system fonts -- they only work on macOS/iOS. For cross-platform rendering, the existing `fonts.css` falls through to `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto` etc.

The PROJECT.md references Inter and Manrope as the original brand fonts (self-hosted WOFF2). The current v5.0 switched to SF Pro, which is a system-font-only approach.

**Recommendation:** Use `next/font/local` with the existing WOFF2 files if Inter/Manrope are restored, or `next/font/local` with system font stack if keeping SF Pro:

```tsx
// src/app/fonts.ts
import localFont from 'next/font/local';

// Option A: Self-hosted Inter + Manrope (if WOFF2 files exist)
export const inter = localFont({
  src: '../fonts/inter-variable.woff2',
  variable: '--font-body',
  display: 'swap',
});

export const manrope = localFont({
  src: '../fonts/manrope-variable.woff2',
  variable: '--font-heading',
  display: 'swap',
});

// Option B: System font approach (current v5.0 behavior)
// Just set CSS variables in theme.css -- no next/font needed
```

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 3.x | Schema validation | Form validation in API routes + client; used by shadcn/ui Form component |
| @hookform/resolvers | latest | Connect zod to react-hook-form | Form validation bridge |
| react-hook-form | 7.x | Form state management | Contact form; shadcn/ui Form component is built on this |
| sharp | latest | Image optimization | Next.js `<Image>` uses it in production for on-the-fly resizing/WebP/AVIF |

---

## What NOT to Install

| Do Not Use | Why |
|------------|-----|
| Prisma | Heavy CLI, generates client code (~1.5MB), requires custom binary for Docker Alpine, slower cold starts. For 1 table (`submissions`), Drizzle is dramatically simpler |
| @directus/sdk | Directus is being removed entirely; PostgreSQL direct via Drizzle replaces it |
| tailwindcss-animate | Deprecated for Tailwind v4; replaced by tw-animate-css |
| framer-motion (package name) | Renamed to `motion`; `framer-motion` still works but is deprecated. Import from `motion/react` |
| Three.js / @specy/liquid-glass-react | 150kB+ for one hero effect; `liquid-glass-react` (rdev) achieves same visual at fraction of bundle cost |
| Alpine.js | Was used to avoid React; now React IS the framework |
| Any CSS-in-JS (styled-components, emotion) | Tailwind CSS handles all styling; CSS-in-JS adds runtime overhead and conflicts with RSC |
| next-themes | Overkill for a single theme toggle; 10 lines of custom code with `useEffect` + `localStorage` + `classList.toggle('dark')` suffice |
| @next/font (old package) | Renamed to `next/font` (built into Next.js); do not install separately |
| tRPC | Over-engineering for 1 API endpoint (form submission); plain Next.js API route + Drizzle is sufficient |
| NextAuth / Auth.js | No user authentication needed; this is a public landing page with a form |
| @tailwindcss/cli | Was used for standalone builds; Next.js uses @tailwindcss/postcss instead |

---

## Installation Commands

```bash
# Create Next.js 15 project
pnpm create next-app@15 medicusunion-kz \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack

cd medicusunion-kz

# Database
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit

# Animation
pnpm add motion

# UI components (shadcn/ui init -- sets up components.json, cn() utility)
pnpm dlx shadcn@latest init

# After init, add specific components as needed:
pnpm dlx shadcn@latest add button card accordion input select textarea form dialog

# Squircle (optional -- prefer CSS class approach first)
pnpm add @squircle-js/react

# Glass refraction hero (optional -- progressive enhancement only)
pnpm add liquid-glass-react

# Form validation
pnpm add zod react-hook-form @hookform/resolvers

# Image optimization (production)
pnpm add sharp
```

---

## Tailwind v4 Configuration: Token Migration

The existing `theme.css` already uses Tailwind v4's `@theme inline` directive with `--color-*`, `--spacing-*`, `--shadow-*` tokens. This is the exact format Tailwind v4 expects in Next.js.

**Migration approach:** Copy `theme.css` content into the Next.js project's global CSS file (e.g., `src/app/globals.css`) after the Tailwind import. The `@theme inline` block, `:root` variables, and `.dark` overrides transfer 1:1.

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

/* Existing tokens -- copy from src/styles/theme.css */
@custom-variant dark (&:is(.dark *));

:root {
  /* All existing --mu-*, --liquid-*, --ease-*, --dur-* tokens */
  /* ... (copy entire :root block from theme.css) ... */
}

.dark {
  /* ... (copy entire .dark block from theme.css) ... */
}

@theme inline {
  /* ... (copy entire @theme inline block from theme.css) ... */
}

/* Existing layer definitions -- copy from theme.css */
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }
```

**What changes in the migration:**
- `@import 'tailwindcss' source(none)` becomes `@import "tailwindcss"` (Next.js PostCSS handles source detection automatically)
- `@source '../../*.html'` is removed (Next.js scans `src/` automatically for class usage)
- `@import './fonts.css'` is removed (handled by `next/font/local`)

**What stays identical (zero changes):**
- All `@theme inline` token declarations
- All `:root` and `.dark` CSS custom properties
- All `@layer base/components/utilities` rules
- `squircles.css` classes (import as separate file)
- `liquid-glass.css` classes (import as separate file)

---

## next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  images: {
    formats: ['image/avif', 'image/webp'],
    // If serving images from external domains:
    // remotePatterns: [{ protocol: 'https', hostname: 'medicusunion.kz' }],
  },
};

export default nextConfig;
```

---

## postcss.config.mjs

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## Key Integration Points

### 1. shadcn/ui + Liquid Glass Design System

shadcn/ui components use CSS variables from `@theme inline` for colors, radius, shadows. The existing token system (`--background`, `--foreground`, `--card`, `--primary`, `--border`, `--radius`, etc.) is already shadcn/ui-compatible because it was set up following shadcn conventions.

Glass variants layer on TOP of shadcn base components via additional CSS classes:

```tsx
// A glass card = shadcn Card + liquid-glass CSS class + squircle CSS class
import { Card, CardContent } from "@/components/ui/card";

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="squircle-lg liquid-card border-inset-glass">
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

### 2. Motion + Next.js App Router

All Motion components are client-only. Strategy:

- **Page-level animations (route transitions):** Wrap `<AnimatePresence>` in a client layout component
- **Section-level animations (scroll reveal):** Use `useInView` hook in individual section client components
- **Micro-interactions (hover, press):** Apply `whileHover`, `whileTap` on interactive elements
- **Reduced motion:** Motion respects `prefers-reduced-motion` automatically when using `layout` prop; for custom animations, check `useReducedMotion()` hook

### 3. Drizzle + Next.js API Routes (replacing Directus)

```tsx
// src/app/api/submissions/route.ts
import { db } from '@/db';
import { submissions } from '@/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const submissionSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+7\d{10}$/),
  specialization: z.enum([
    'oncology', 'cardiology', 'neurosurgery',
    'orthopedics', 'radiology', 'ivf'
  ]),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [submission] = await db
    .insert(submissions)
    .values(parsed.data)
    .returning();

  return NextResponse.json({ id: submission.id }, { status: 201 });
}
```

### 4. Docker: Next.js Standalone + PostgreSQL

The standalone output produces `server.js` in `.next/standalone/` that includes only the used dependencies. Combined with the multi-stage Dockerfile above, the production image is ~130MB (vs ~1GB without standalone).

**Critical env vars:**
- `HOSTNAME="0.0.0.0"` -- Without this, Next.js binds to 127.0.0.1 and Docker networking fails (502 errors)
- `DATABASE_URL` -- Connection string for postgres.js driver
- `NODE_ENV=production` -- Enables Next.js production optimizations

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Framework version | Next.js 15.5.x | Next.js 16.2.x | Breaking changes (sync API removal, cache model change) add migration risk for zero benefit on a landing page; 15 gets security patches |
| ORM | Drizzle ORM | Prisma | Prisma generates a heavy client (~1.5MB), requires custom binary for Docker Alpine, slower cold starts; Drizzle is SQL-first and lighter for 1 table |
| PG driver | postgres (postgres.js) | pg (node-postgres) | postgres.js is ESM-native, zero native deps, simpler API; pg requires @types/pg and has callback-based API under the hood |
| Animation | motion 12.x | GSAP, anime.js | motion/react has first-class React integration (component props, layout animations, exit animations); GSAP/anime.js require manual DOM refs and cleanup |
| Glass refraction | liquid-glass-react | @specy/liquid-glass-react | @specy pulls in Three.js (~150kB); liquid-glass-react uses WebGL directly (~15kB); for one hero effect, smaller is better |
| Glass refraction | liquid-glass-react | liquidGL (naughtyduk) | No npm package; CDN-only script tag; no React API; requires html2canvas dependency; incompatible with React lifecycle |
| Squircle | CSS mask-image classes | @squircle-js/react | Existing CSS approach is zero-JS, 3-tier progressive enhancement; @squircle-js adds 2.1kB JS for equivalent visual result |
| Form handling | react-hook-form + zod | Server Actions only | react-hook-form gives client-side validation feedback (field-level errors, real-time); Server Actions alone require round-trip for validation |
| Themes | Custom 10-line hook | next-themes | One landing page, one toggle; next-themes adds package for what `classList.toggle('dark')` + localStorage does |
| Package manager | pnpm | npm / yarn | pnpm handles React 19 peer deps cleanly (no --legacy-peer-deps needed); strict node_modules structure prevents phantom dependencies |

---

## Sources

### Official Documentation (HIGH confidence)
- [Next.js Deploying Docs](https://nextjs.org/docs/app/getting-started/deploying) -- standalone output, Docker
- [Next.js Upgrading to v15](https://nextjs.org/docs/app/guides/upgrading/version-15) -- breaking changes, React 19
- [Next.js Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16) -- why we skip 16
- [Next.js Docker Example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/README.md) -- official Dockerfile
- [Tailwind CSS v4 + Next.js Guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS setup
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- @theme directive, CSS-first config
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) -- init, components.json
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) -- tw-animate-css, @theme inline
- [Drizzle ORM PostgreSQL Setup](https://orm.drizzle.team/docs/get-started-postgresql) -- drivers, connection
- [Motion Installation](https://motion.dev/docs/react-installation) -- motion/react import
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) -- framer-motion to motion migration

### npm Packages (MEDIUM confidence -- versions verified)
- [motion@12.38.0](https://www.npmjs.com/package/motion) -- latest as of 2026-03-16
- [drizzle-orm@0.45.2](https://www.npmjs.com/package/drizzle-orm) -- latest as of 2026-03-29
- [@squircle-js/react@1.3.0](https://www.npmjs.com/package/@squircle-js/react) -- latest as of 2026-02-03
- [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) -- shadcn/ui animation dependency

### GitHub Repositories (MEDIUM confidence)
- [liquid-glass-react](https://github.com/rdev/liquid-glass-react) -- React WebGL glass component
- [liquidGL](https://github.com/naughtyduk/liquidGL) -- Script-based WebGL glass (no npm)
- [@squircle-js/react](https://github.com/bring-shrubbery/squircle-js) -- React squircle component

### Community Resources (LOW confidence -- cross-referenced)
- [Drizzle + Next.js 15 Guide (Strapi blog)](https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project)
- [Next.js 15 vs 16 Comparison](https://www.descope.com/blog/post/nextjs15-vs-nextjs16)
- [Motion Complete Guide 2026](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers.html)
