# Project Research Summary

**Project:** MedicusUnion KZ Landing v6.0 -- Next.js Migration
**Domain:** Medical landing page migration (vanilla HTML/CSS/JS to Next.js 15 + React)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Executive Summary

This project is a complete architectural migration of a 7-page medical consultation landing site from vanilla HTML/Tailwind CSS v4/vanilla JS + Directus CMS to Next.js 15 App Router + React 19 + shadcn/ui + Framer Motion + Drizzle ORM + PostgreSQL direct. The current codebase includes a sophisticated "Liquid Glass" design system (~1100 lines of custom CSS across three files) with backdrop-filter materials, SVG squircle masks, refraction filters, adaptive tinting, dark mode, and specular parallax effects. The migration path is well-documented: all four research areas converge on standard, battle-tested patterns with high confidence. The site's content is entirely static (SSG), with the only server-side runtime being form submissions to PostgreSQL.

The recommended approach is to migrate in five phases: (1) project scaffolding with CSS/tokens/dark-mode foundation, (2) static page content as Server Components, (3) client interactivity (form, accordion, scroll animations), (4) data layer replacement (Drizzle + PostgreSQL replacing Directus), and (5) Docker deployment. This ordering is dictated by dependency chains: CSS tokens must exist before glass components, glass components before animations, and the data layer is independent of UI rendering. The "client islands in a server sea" architecture pattern -- where most sections ship zero JS and only interactive leaves (form, accordion, counters, header scroll) are Client Components -- is critical for keeping bundle size manageable for the target audience (45+ demographic on budget Android devices in Kazakhstan).

The primary risks are concentrated in Phase 1 (CSS migration): three confirmed Turbopack/Webpack bugs affect backdrop-filter rendering, CSS import ordering, and dark mode FOUC. The glass design system is the highest-risk migration area because it depends on precise CSS cascade ordering, vendor prefix behavior, and SVG filter ID uniqueness -- all of which have documented pitfalls in the Next.js 15 ecosystem. Mitigation is straightforward: reverse vendor prefix order, use a single CSS entry point with explicit @import chain, and render SVG defs exactly once in the root layout. Framer Motion bundle bloat (34KB gzipped) is a secondary risk mitigated by using LazyMotion + m components and preferring CSS animations for simple effects.

## Key Findings

### Recommended Stack

The stack is Next.js 15.5.x (NOT 16 -- breaking changes add risk with zero benefit), React 19, TypeScript 5, Tailwind CSS v4 via @tailwindcss/postcss, and shadcn/ui for accessible base components. Next.js 16 is explicitly avoided because it removes synchronous request APIs, changes the caching model, and has incomplete ecosystem compatibility. Directus is fully replaced by Drizzle ORM + postgres.js driver talking to PostgreSQL 16 directly via Server Actions and API routes.

**Core technologies:**
- **Next.js 15.5.x (App Router):** Framework for SSG pages, Server Actions for form submission, standalone Docker output (~130MB image). Stable, security-patched, widest library compatibility.
- **Tailwind CSS v4 + @tailwindcss/postcss:** Existing @theme inline tokens, :root variables, .dark overrides, and glass @layer definitions transfer 1:1 with zero changes. PostCSS plugin replaces standalone CLI binary.
- **shadcn/ui:** CLI-installed, accessible React primitives (Accordion, Button, Input, Select, Form). Not an npm dependency -- copies source code into project. Tailwind v4 + React 19 compatible.
- **Framer Motion (motion 12.x):** Scroll-reveal, hero entrance, counter animations. Must use LazyMotion + m components to reduce bundle from 34KB to ~5KB. CSS animations preferred for simple effects.
- **Drizzle ORM + postgres.js:** Lightweight SQL-first ORM (7.4KB vs Prisma's 2MB). One table (submissions). Singleton connection pool with globalThis pattern for hot-reload safety.
- **Docker + Node.js 22 LTS:** Multi-stage standalone build. PostgreSQL 16-alpine. HOSTNAME="0.0.0.0" required or Docker networking fails silently.

### Expected Features

**Must have (table stakes):**
- All 7 pages with 1:1 content parity (SEO rankings preserved)
- Contact form with Server Action + Zod validation + phone mask (+7 format) + honeypot spam protection
- Sticky header with glass-on-scroll effect
- Mobile menu with backdrop-blur
- Dark mode with persistence (no FOUC)
- FAQ accordion (shadcn/ui Accordion)
- SEO metadata per page via static metadata export (NOT generateMetadata)
- JSON-LD structured data
- Responsive mobile-first layout
- Scroll-reveal animations
- Animated counters (stats sections)
- next/image for all images (automatic WebP/AVIF, lazy loading)

**Should have (differentiators):**
- 5 Liquid Glass material variants (CSS classes, zero JS cost)
- Squircle corners (3-tier CSS mask-image, NO @squircle-js/react dependency)
- Specular parallax on desktop (mouse tracking sets CSS custom properties)
- 3-tier SVG refraction filters (Chromium-only progressive enhancement)
- Adaptive section tinting (pure CSS cascade)
- Hero staggered entrance animation
- Staggered card grid animations

**Defer (post-migration):**
- Page transition animations (AnimatePresence + App Router has open bugs, GitHub #49279)
- Glass budget enforcement (disabled in production already; React reconciliation complicates observer logic)
- Custom SPA-like prefetching (Next.js Link handles this natively)
- Admin panel for submissions (use Drizzle Studio initially, build later)

### Architecture Approach

The architecture follows a "client islands in a server sea" pattern: the root layout renders shared chrome (Header, Footer, MobileMenu, StickyBar, SVG refraction defs), and each page composes section components that are Server Components by default. Only interactive leaf components (ContactForm, FAQ, AnimatedCounter, HeaderClient, GlassSpecular) carry the "use client" directive. This keeps 8 of 12 index page sections shipping zero JavaScript. All glass CSS remains in global files (liquid-glass.css, squircles.css) imported via a single globals.css entry point -- they are NOT converted to CSS Modules or component-scoped styles.

**Major components:**
1. **Root Layout (app/layout.tsx):** Replaces the build-pages.sh splicer. Renders once: Header, Footer, MobileMenu, StickyBar, SvgRefractionDefs. Persists across route changes (identical to current SPA router behavior).
2. **Section Components (components/sections/):** 15+ components (Hero, Stats, Services, Process, FAQ, ContactForm, etc.). Each page.tsx composes the sections it needs. Shared sections (ContactForm, FAQ, FinalCTA) are reused across 4-5 pages.
3. **Glass Components (components/glass/):** Thin React wrappers around CSS utility classes. LiquidCard, LiquidButton, SquircleWrapper. GlassProvider is the only Client Component (mouse specular tracking).
4. **Motion Wrappers (components/motion/):** "use client" thin wrappers (MotionDiv, ScrollReveal, AnimatedCounter) that allow Server Components to compose animated children without becoming Client Components themselves.
5. **Data Layer (lib/db/ + lib/actions/):** Drizzle schema for submissions table. Server Action for form submission. API route handler for potential external consumers. Singleton connection pool.

### Critical Pitfalls

1. **Turbopack strips backdrop-filter when -webkit- prefix comes first (GitHub #78302, OPEN).** All 6 glass material classes break in Chrome/Firefox during dev. Fix: reverse declaration order -- standard backdrop-filter BEFORE -webkit-backdrop-filter. Must be done in Phase 1 before any glass work.

2. **CSS import order diverges between Turbopack (dev) and Webpack (prod) (GitHub #79531, #79535).** Glass tokens may load after glass classes, producing transparent/broken elements. Fix: single CSS entry point with explicit @import chain in globals.css, "sideEffects": ["*.css"] in package.json, never import CSS from individual component files.

3. **Dark mode FOUC -- localStorage unreadable on server, cookies force dynamic rendering.** Users see a flash of light mode. Fix: middleware reads theme cookie and sets header; root layout reads header (or use next-themes inline script as pragmatic compromise). Default to light mode for the 45+ medical audience.

4. **Framer Motion adds 34KB gzipped to client bundle.** Current site is 64KB total. Fix: use LazyMotion + domAnimation features (reduces to ~5KB), use m.div not motion.div, prefer CSS animations for simple effects, isolate motion components at leaf level.

5. **Docker standalone output missing static assets and sharp binary.** Fonts, images, and next/image optimization all break silently. Fix: Dockerfile must explicitly COPY public/ and .next/static/, install sharp, use node:20-slim (not Alpine -- musl libc incompatibility with sharp).

## Implications for Roadmap

Based on research, the migration should follow 5 phases dictated by strict dependency ordering.

### Phase 1: Scaffolding + CSS Foundation + Dark Mode

**Rationale:** Everything depends on the CSS token system and Tailwind v4 PostCSS pipeline working correctly. Three critical pitfalls (#1 backdrop-filter, #2 import order, #4 dark mode FOUC) and two additional pitfalls (#8 fonts, #12 Tailwind @theme) all target this phase. Getting this wrong cascades into every subsequent phase.

**Delivers:** Next.js 15 project with working Tailwind v4 PostCSS, all glass tokens and materials rendering correctly, dark mode without FOUC, font loading, root layout with shared chrome (Header, Footer, MobileMenu, StickyBar, SvgRefractionDefs), static metadata pattern.

**Addresses (FEATURES.md):** Dark mode toggle with persistence, sticky header glass shell, responsive layout, SEO metadata, JSON-LD.

**Avoids (PITFALLS.md):** Pitfalls 1 (backdrop-filter), 2 (CSS import order), 3 (SVG filter IDs), 4 (dark mode FOUC), 8 (font config), 11 (metadata streaming), 12 (Tailwind @theme).

### Phase 2: Static Page Content Migration

**Rationale:** With CSS foundation proven, all 7 pages can be ported as Server Components. This is the highest volume of work (7 pages x 10-12 sections each) but the lowest risk per item -- it is mechanical content transfer from HTML to JSX. Starting with index.html (most complex) validates all patterns for remaining pages.

**Delivers:** All 7 pages rendering with 1:1 content parity, all glass cards and squircle elements visible, next/image for all images, per-page metadata.

**Addresses (FEATURES.md):** All 7 pages with content parity, responsive layout, coordinator card, gradient CTA buttons, section tinting, lucide-react icons, all static section components.

**Avoids (PITFALLS.md):** Pitfall 6 (squircle hydration warnings -- keep CSS-only approach, skip @squircle-js/react).

### Phase 3: Client Interactivity + Animations

**Rationale:** Client components depend on the page structure from Phase 2 existing as composition targets. Framer Motion bundle management (Pitfall 5) requires deliberate architecture -- this phase is where the "client island" pattern gets tested under real conditions.

**Delivers:** Working form (client-side validation only, no submission yet), FAQ accordion, header scroll detection, mobile menu toggle, theme toggle, scroll-reveal animations, hero entrance animation, animated counters, specular mouse tracking.

**Addresses (FEATURES.md):** FAQ accordion, smooth scroll, animated counters, scroll-reveal, hero staggered entrance, specular parallax, staggered card grid, prefers-reduced-motion guards.

**Avoids (PITFALLS.md):** Pitfall 5 (Framer Motion bundle -- use LazyMotion + m components, CSS for simple effects).

### Phase 4: Data Layer + Form Submission

**Rationale:** The data layer is independent of the UI rendering pipeline. It can be built after all pages and interactivity are working because form submission is a single POST endpoint. This phase replaces Directus entirely.

**Delivers:** Server Action for form submission, Zod validation, PostgreSQL direct writes via Drizzle ORM, API route handler, data migration from Directus, connection pooling.

**Addresses (FEATURES.md):** Contact form with validation, phone mask, honeypot + timing spam protection, form success/error states, form reuse across 5 pages via variant prop.

**Avoids (PITFALLS.md):** Pitfall 9 (progressive enhancement -- use action prop, not onSubmit; test with JS disabled), Pitfall 10 (connection exhaustion -- singleton pool + globalThis pattern).

### Phase 5: Docker Deployment

**Rationale:** Deployment depends on the complete application. Multi-stage Dockerfile, docker-compose.yml (Next.js + PostgreSQL), health checks, Nginx removal (Next.js serves everything).

**Delivers:** Production-ready Docker deployment, ~130MB image, PostgreSQL with persistent volume, health checks, SSL termination strategy.

**Avoids (PITFALLS.md):** Pitfall 7 (missing static assets and sharp in standalone -- explicit COPY steps, node:20-slim base image, sharp in outputFileTracingIncludes).

### Phase Ordering Rationale

- Phase 1 before all else: CSS tokens are consumed by every component. Three confirmed Turbopack/Webpack bugs must be addressed before any glass component work. Getting CSS wrong means debugging phantom rendering issues in every subsequent phase.
- Phase 2 before Phase 3: Client components wrap server-rendered content. The server-rendered sections must exist as composition targets before adding animation wrappers and interactive leaves.
- Phase 3 before Phase 4: Form interactivity (validation, phone mask, pending states) can be built and tested with a mock submission handler. This allows UI polish before wiring up the database.
- Phase 4 is independent: The data layer has no dependencies on animations or UI polish. It could theoretically be built in parallel with Phase 3, but serial ordering avoids context switching.
- Phase 5 last: Deployment integrates everything. Testing the Docker build validates the entire migration.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Turbopack backdrop-filter bug status (check GitHub #78302 for resolution before starting). Dark mode FOUC mitigation -- the middleware approach vs next-themes inline script tradeoff needs a concrete decision.
- **Phase 3:** Framer Motion bundle audit -- measure actual bundle impact of LazyMotion + domAnimation vs CSS-only animations. May need to drop Framer Motion entirely for some effects.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Mechanical content transfer from HTML to JSX. Well-documented, no research needed.
- **Phase 4:** Drizzle ORM + Server Actions is a documented Next.js 15 pattern with official examples. Connection pooling via globalThis is standard.
- **Phase 5:** Docker standalone is documented by Vercel with official example Dockerfile.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified via official docs and release notes. Next.js 15.5.x, Tailwind v4, shadcn/ui, Drizzle ORM are stable and well-documented. |
| Features | HIGH | Current codebase fully audited. Every feature mapped to a Next.js equivalent. Client/server boundaries explicitly defined for all 40+ components. |
| Architecture | HIGH | Standard Next.js App Router patterns. File structure, layout hierarchy, component boundaries, data flow all follow documented best practices. |
| Pitfalls | HIGH | 12 pitfalls identified with specific prevention strategies. Critical ones (Turbopack backdrop-filter, CSS import order) verified via confirmed GitHub issues. |

**Overall confidence:** HIGH

### Gaps to Address

- **liquid-glass-react (WebGL hero refraction):** Confidence is LOW. New library, Chrome/Edge only, unknown stability. Recommendation is to defer and keep CSS backdrop-filter as the universal approach. If WebGL refraction is desired for the hero, it should be a post-migration progressive enhancement experiment, not a migration blocker.
- **AnimatePresence with App Router:** GitHub issue #49279 documents ongoing bugs with page transition animations. Deferred to post-migration. If page transitions become a requirement, this needs dedicated spike research.
- **Budget Android performance:** backdrop-filter on glass elements with React re-renders on budget Android devices common in the KZ market has not been benchmarked. Needs real-device testing post-Phase 2.
- **Admin panel for submissions:** Directus admin UI is lost in the migration. Drizzle Studio covers development viewing. A production admin view (even a simple table behind auth) should be planned for a follow-up iteration.
- **SF Pro font licensing:** Current site uses Apple system fonts via local(). These only render on Apple devices. The 45+ KZ audience is predominantly Android. Decision needed: revert to Inter + Manrope (original brand fonts) or accept system font fallback. Research recommends reverting to Inter + Manrope with next/font/local and self-hosted WOFF2 for data sovereignty compliance.

## Sources

### Primary (HIGH confidence)
- [Next.js Deploying Docs](https://nextjs.org/docs/app/getting-started/deploying) -- standalone output, Docker
- [Next.js Upgrading to v15](https://nextjs.org/docs/app/guides/upgrading/version-15) -- breaking changes, React 19
- [Next.js Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16) -- why we skip 16
- [Next.js Docker Example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/README.md) -- official Dockerfile
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- boundary rules
- [Next.js: Forms Guide with Server Actions](https://nextjs.org/docs/app/guides/forms) -- form action pattern
- [Tailwind CSS v4 + Next.js Guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS setup
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) -- init, components.json
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) -- tw-animate-css, @theme inline
- [Drizzle ORM PostgreSQL Setup](https://orm.drizzle.team/docs/get-started-postgresql) -- drivers, connection
- [Motion Installation](https://motion.dev/docs/react-installation) -- motion/react import
- [Motion: Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) -- LazyMotion docs

### Secondary (MEDIUM confidence)
- [GitHub Issue #78302: backdrop-filter stripped by Turbopack](https://github.com/vercel/next.js/issues/78302) -- OPEN, confirmed
- [GitHub Issue #79531: CSS import order diverges dev/prod](https://github.com/vercel/next.js/issues/79531) -- confirmed
- [GitHub Issue #79535: Missing CSS styles after upgrading](https://github.com/vercel/next.js/issues/79535) -- confirmed
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) -- dark mode without FOUC
- [Drizzle + Next.js 15 Guide (Strapi blog)](https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project)
- [Framer Motion + Next.js Guide](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers)

### Tertiary (LOW confidence)
- [liquid-glass-react](https://github.com/rdev/liquid-glass-react) -- WebGL glass component, new library, unknown stability
- [AnimatePresence with App Router (GitHub #49279)](https://github.com/vercel/next.js/issues/49279) -- ongoing bugs, page transitions deferred
- [Metadata streaming controversy](https://neuralcovenant.com/2025/06/the-metadata-streaming-controversy-in-next.js-15.1-/) -- edge case, mitigated by static metadata export

---
*Research completed: 2026-04-10*
*Ready for roadmap: yes*
