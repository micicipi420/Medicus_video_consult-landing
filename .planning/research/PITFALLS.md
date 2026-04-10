# Domain Pitfalls: Next.js 15 Migration of Liquid Glass Landing Page

**Domain:** Migrating a production static landing page with advanced glass effects (backdrop-filter, SVG refraction filters, squircle mask-image, adaptive tinting, dark mode) from vanilla HTML/Tailwind CSS v4 to Next.js 15 + React + App Router
**Researched:** 2026-04-10
**Confidence:** HIGH for Turbopack/CSS bugs (verified via official GitHub issues #78302, #79531, #79535); HIGH for Framer Motion bundle (verified via official motion.dev docs); MEDIUM for SVG filter hydration (multiple credible sources but no exact replication of this project's filter set); HIGH for Docker standalone (verified via official Next.js docs); HIGH for dark mode FOUC (verified via next-themes + Next.js discussions)

---

## Critical Pitfalls

Mistakes that cause visual breakage, production failures, or require architectural rework.

---

### Pitfall 1: Turbopack Strips backdrop-filter When -webkit- Prefix Comes First

**What goes wrong:**
In Next.js 15.3.0+ with Turbopack (`next dev --turbo`), when `-webkit-backdrop-filter` is declared before the standard `backdrop-filter` in CSS, Turbopack's CSS processing silently drops the standard `backdrop-filter` declaration. Every glass element renders with zero blur/saturate/brightness in Chrome and Firefox during development.

**Why it happens:**
Turbopack's CSS parser (LightningCSS-based) mishandles the vendor-prefixed + unprefixed property pair ordering. It treats the `-webkit-` line as the canonical declaration and removes the unprefixed line as a "duplicate." This is the opposite of how browsers interpret cascade -- browsers use the LAST matching declaration.

**Consequences:**
All 6 glass material classes in `liquid-glass.css` use the pattern `-webkit-backdrop-filter` (hardcoded fallback) followed by `-webkit-backdrop-filter` (var-based) followed by `backdrop-filter` (var-based). Turbopack will strip the third line, breaking glass in Chrome/Firefox during dev. Production builds (Webpack) may render correctly, creating a dev/prod visual mismatch that delays bug discovery.

**Detection:**
Glass elements appear as plain semi-transparent boxes (no blur, no saturate) in Chrome during `next dev --turbo`. Safari may still work because it reads `-webkit-backdrop-filter`.

**Prevention:**
1. **Reverse the declaration order** in all glass classes: place `backdrop-filter` BEFORE `-webkit-backdrop-filter`:
   ```css
   /* Standard first -- Turbopack keeps it */
   backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
   /* Safari fallback: hardcoded values, then var-based override */
   -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);
   -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
   ```
2. **Pin Next.js version** to a known-good release and test with Turbopack before upgrading. This is a confirmed open bug ([GitHub #78302](https://github.com/vercel/next.js/issues/78302), status: OPEN as of 2026-04-10).
3. **Add a visual regression test** (Playwright screenshot comparison) that runs in both Turbopack dev and Webpack prod modes to catch glass rendering differences.

**Affected files:** `src/styles/liquid-glass.css` lines 88-90, 121-122, 152-154, 200-202, 246-248, 319-321, 360-362, 473-476 (every `.liquid-*` class).

**Phase:** Must be addressed in Phase 1 (CSS migration) before any glass component work begins.

**Sources:**
- [GitHub Issue #78302: CSS backdrop-filter property disappear in Next.js 15.3.0/15.3.1 dev mode with Turbopack](https://github.com/vercel/next.js/issues/78302)

---

### Pitfall 2: CSS Import Order Diverges Between Turbopack (dev) and Webpack (prod)

**What goes wrong:**
Turbopack follows JavaScript import order to determine CSS concatenation order. Webpack sometimes ignores import order when it infers a module is side-effect-free. The current project imports CSS in a specific cascade: `fonts.css` -> `tailwindcss` -> `theme.css` -> `squircles.css` -> `liquid-glass.css`. If Webpack reorders these, glass token overrides in `theme.css` may load AFTER `liquid-glass.css`, or `squircles.css` mask overrides from `@supports (corner-shape: squircle)` may not cascade correctly.

**Why it happens:**
Turbopack and Webpack use different heuristics for CSS ordering. Turbopack strictly follows JS import graph order. Webpack may reorder CSS from modules it considers side-effect-free (no explicit `sideEffects: true` in package.json or no export-only modules).

**Consequences:**
Glass tokens defined in `:root` (theme.css) may not be available when `liquid-glass.css` is parsed, causing fallback to browser defaults (transparent backgrounds, zero blur). Squircle `@supports` progressive enhancement block may be overridden by base styles if load order flips.

**Detection:**
- Glass cards appear transparent/broken in production but work in dev, or vice versa
- `@supports (corner-shape: squircle)` styles don't apply even in Chrome 139+
- Dark mode glass tokens show light-mode values

**Prevention:**
1. Mark CSS files as having side effects in `package.json`:
   ```json
   {
     "sideEffects": ["*.css"]
   }
   ```
2. Use a single CSS entry point (`globals.css`) with explicit `@import` ordering instead of JS-level imports. In Next.js App Router, import ONLY `globals.css` from `app/layout.tsx`:
   ```tsx
   // app/layout.tsx
   import '@/styles/globals.css'; // Single entry point
   ```
   Where `globals.css` contains the same `@import` chain as current `tailwind.css`:
   ```css
   @import './fonts.css';
   @import 'tailwindcss' source(none);
   @source '../app/**/*.{tsx,ts}';
   @import './theme.css';
   @import './squircles.css';
   @import './liquid-glass.css';
   ```
3. **Never import CSS from individual component files** -- all glass/squircle/theme CSS must flow through the single entry point to guarantee order.
4. Test production build (`next build && next start`) against dev (`next dev --turbo`) visually after every CSS structure change.

**Phase:** Phase 1 (CSS migration). This is the very first thing to set up.

**Sources:**
- [GitHub Issue #79531: CSS import order differs between dev turbopack and prod webpack](https://github.com/vercel/next.js/issues/79531)
- [GitHub Issue #79535: Missing CSS styles after upgrading from 15.2.x to 15.3.x](https://github.com/vercel/next.js/issues/79535)

---

### Pitfall 3: SVG Filter IDs Break When Multiple Instances Render on Same Page

**What goes wrong:**
The current `partials/svg-defs.html` defines three SVG filters (`liquid-refract-sm`, `liquid-refract-md`, `liquid-refract-lg`) that are referenced by CSS via `url(#liquid-refract-md)`. In React, if this SVG defs block is rendered by a component that mounts multiple times (e.g., in a shared layout + individual page), the DOM will contain duplicate `id` attributes. The browser resolves `url(#liquid-refract-md)` to the FIRST matching ID, which may be inside an unmounted or stale component tree.

**Why it happens:**
React renders components to a virtual DOM that maps to real DOM nodes. Unlike raw HTML where you control exactly one `<svg>` defs block, a React component containing the SVG defs can be instantiated multiple times if included in a shared layout component or rendered in both server and client passes.

**Consequences:**
- Refraction filters reference stale or wrong SVG filter definitions
- On route transitions (App Router soft navigation), the referenced filter ID may point to a removed DOM node, causing refraction to silently disappear
- React strict mode (development) double-renders components, creating temporary duplicate IDs

**Detection:**
Refraction effects work on initial load but break after client-side navigation, or work on some pages but not others.

**Prevention:**
1. **Render SVG defs exactly once** in the root layout (`app/layout.tsx`), outside any component that re-renders:
   ```tsx
   // app/layout.tsx
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <SvgDefs /> {/* Render ONCE at the root */}
           {children}
         </body>
       </html>
     );
   }
   ```
2. **Use a dedicated `SvgDefs` component** with the SVG filter definitions written as JSX (not `dangerouslySetInnerHTML`). React's JSX natively supports SVG filter elements:
   ```tsx
   // components/svg-defs.tsx
   export function SvgDefs() {
     return (
       <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
         <defs>
           <filter id="liquid-refract-sm" colorInterpolationFilters="sRGB">
             <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={1} seed={92} result="noise" />
             <feGaussianBlur in="noise" stdDeviation={1} result="blurred" />
             <feDisplacementMap in="SourceGraphic" in2="blurred" scale={0} xChannelSelector="R" yChannelSelector="G" />
           </filter>
           {/* ... md, lg filters ... */}
         </defs>
       </svg>
     );
   }
   ```
3. **Note the JSX attribute differences from HTML:**
   - `color-interpolation-filters` becomes `colorInterpolationFilters`
   - Numeric attributes (`numOctaves`, `seed`, `scale`, `stdDeviation`) can be passed as numbers: `numOctaves={1}`
   - `baseFrequency`, `numOctaves`, `stdDeviation`, `xChannelSelector`, `yChannelSelector` are NOT camelCased -- they already use camelCase in the SVG spec and React passes them through as-is
   - Do NOT use `dangerouslySetInnerHTML` for this -- JSX handles SVG filter elements natively

**Phase:** Phase 2 (component extraction). Critical to get right before any glass component uses refraction.

**Sources:**
- [React DOM Components: SVG support](https://react.dev/reference/react-dom/components)
- Current codebase: `partials/svg-defs.html`

---

### Pitfall 4: Dark Mode FOUC -- localStorage Unreadable on Server, Cookies Force Dynamic Rendering

**What goes wrong:**
The current codebase uses `localStorage` to persist theme preference and a `[data-theme="dark"]` attribute selector. In Next.js with SSR/SSG, `localStorage` is unavailable on the server. The server renders light mode HTML. When JS hydrates on the client, it reads `localStorage`, discovers dark mode, and switches -- causing a visible flash of light-to-dark (FOUC). The current system uses `@custom-variant dark (&:is(.dark *))` in Tailwind, meaning the `.dark` class on an ancestor drives all dark styles.

**Why it happens:**
Server Components and Static Generation both execute without `window` or `localStorage`. They can only read cookies (via `next/headers`). But using `cookies()` in a layout opts the ENTIRE route into dynamic rendering, disabling static generation and Partial Pre-Rendering for every page under that layout. For a landing page that should be statically generated for performance, this is a significant tradeoff.

**Consequences:**
- **Option A (localStorage only):** Every page load flashes light mode for 50-200ms before JS applies dark class. For CA 45+, this is jarring and feels broken.
- **Option B (cookies in layout):** Zero FOUC, but the entire site becomes dynamically rendered. TTFB increases. No ISR/SSG benefits. CDN caching becomes complex.
- **Option C (next-themes):** Injects a blocking `<script>` tag that reads localStorage before paint. Works, but adds a render-blocking script that Lighthouse flags, and does not work with streaming SSR.

**Detection:**
Flash of white background and light-colored text on page load for users who have dark mode enabled.

**Prevention:**
Use the **middleware + cookie approach** (best balance for this project):
1. **Theme toggle sets both localStorage AND a cookie:**
   ```tsx
   function setTheme(theme: 'light' | 'dark') {
     document.documentElement.classList.toggle('dark', theme === 'dark');
     localStorage.setItem('theme', theme);
     document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
   }
   ```
2. **Middleware reads the cookie and sets a request header:**
   ```tsx
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   
   export function middleware(request: NextRequest) {
     const theme = request.cookies.get('theme')?.value || 'light';
     const response = NextResponse.next();
     response.headers.set('x-theme', theme);
     return response;
   }
   ```
3. **Root layout reads the header (NOT cookies()) to stay static:**
   ```tsx
   // app/layout.tsx
   import { headers } from 'next/headers';
   
   export default async function RootLayout({ children }) {
     const headersList = await headers();
     const theme = headersList.get('x-theme') || 'light';
     return (
       <html className={theme === 'dark' ? 'dark' : ''}>
         <body>{children}</body>
       </html>
     );
   }
   ```
   **IMPORTANT:** Using `headers()` still opts into dynamic rendering. For a fully static approach with zero FOUC, consider the inline script approach from next-themes as a pragmatic compromise, since this is a landing page where SEO matters more than perfect streaming SSR.

4. **Default to light mode** (current behavior, validated for CA 45+ who associate light with medical authority per PROJECT.md Key Decision).

**Affected config:** `@custom-variant dark (&:is(.dark *))` in `theme.css` must become `@custom-variant dark (&:is(.dark *))` (already compatible) or use Tailwind's `darkMode: 'selector'` if using Tailwind config file.

**Phase:** Phase 1 (project scaffolding). Theme infrastructure must be in place before any component renders dark-mode-aware glass tokens.

**Sources:**
- [Next.js Discussion #53063: Implementing light/dark mode with app router + RSC](https://github.com/vercel/next.js/discussions/53063)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- Current codebase: `theme.css` line 1: `@custom-variant dark (&:is(.dark *))`

---

### Pitfall 5: Framer Motion Adds 34KB to Client Bundle -- Breaks Lightweight Landing Page Goal

**What goes wrong:**
The current landing page is ~64KB total (HTML + CSS + JS). Importing `motion` from `framer-motion` (now `motion` package) adds a minimum of 34KB gzipped to the client JavaScript bundle. With the "use client" directive required for every component using motion, entire component subtrees get excluded from Server Component benefits, inflating the JS sent to the client.

**Why it happens:**
Framer Motion's declarative API (`animate`, `variants`, `layout`, `drag`, `whileHover`, `whileTap`) is not tree-shakeable because the props-driven design means the bundler cannot statically analyze which features are used. The `motion.div` component includes the full animation engine regardless of which props you pass.

**Consequences:**
- Bundle size balloons from ~64KB total to 100KB+ for JS alone
- Every component using `motion.*` must be a Client Component (`"use client"`)
- Client Components cannot use `async/await`, `cookies()`, `headers()`, or other server-only APIs
- The "use client" boundary propagates: a parent using `motion.div` forces all children to be client components too
- For CA 45+ on budget Android devices common in KZ market, the extra JS parsing time is significant

**Detection:**
Run `npx @next/bundle-analyzer` and check the client bundle. Any chunk containing `framer-motion` or `motion` will be 30KB+.

**Prevention:**
1. **Use `LazyMotion` + `m` component** to reduce initial bundle to ~5KB:
   ```tsx
   // app/providers.tsx
   'use client';
   import { LazyMotion, domAnimation } from 'framer-motion';
   
   export function AnimationProvider({ children }: { children: React.ReactNode }) {
     return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
   }
   ```
   Then use `m.div` instead of `motion.div` in all components:
   ```tsx
   import { m } from 'framer-motion';
   // NOT: import { motion } from 'framer-motion';
   ```
2. **CRITICAL: Never render `motion.*` inside `LazyMotion`** -- this breaks tree shaking. Always use `m.*` when LazyMotion is the provider.
3. **Prefer CSS animations for simple effects.** The current codebase already has:
   - Shimmer sweep (`@keyframes glint` in liquid-glass.css) -- keep as CSS
   - Scroll-reveal (`translateY(20px)/0.4s`) -- use `@starting-style` or Intersection Observer + CSS transitions instead of Framer Motion
   - Button `:active scale(0.97)` -- pure CSS, no JS needed
   - FAQ accordion -- CSS `max-height` transition, no Framer Motion needed
4. **Reserve Framer Motion for interactions that CSS cannot do:**
   - Layout animations (`layoutId` for shared element transitions between routes)
   - Gesture-driven animations (drag, pinch)
   - Spring physics (if CSS `linear()` easing is insufficient)
   - Exit animations (`AnimatePresence`)
5. **Isolate motion components** at the leaf level, not the layout level:
   ```tsx
   // GOOD: Small client component island
   // components/animated-card.tsx
   'use client';
   import { m } from 'framer-motion';
   export function AnimatedCard({ children }) { /* ... */ }
   
   // BAD: Entire section is a client component
   // components/services-section.tsx
   'use client'; // Forces ALL children to be client-rendered
   import { motion } from 'framer-motion';
   ```

**Phase:** Phase 3 (animation migration). Must audit every current animation and decide CSS vs Framer Motion before writing any animation code.

**Sources:**
- [Reduce bundle size of Framer Motion](https://motion.dev/docs/react-reduce-bundle-size)
- [Framer Motion: Complete React & Next.js Guide 2026](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers)
- Current codebase: PROJECT.md states total size is ~64KB

---

## Moderate Pitfalls

Issues that cause significant debugging time or visual regressions but are recoverable without architectural rework.

---

### Pitfall 6: Squircle mask-image SVG Data URIs Cause Hydration Warnings

**What goes wrong:**
The current squircle system uses CSS custom properties containing inline SVG data URIs (e.g., `--squircle-mask-md: url("data:image/svg+xml,<svg ...>")`). These long data URIs contain characters that React's HTML serializer and the browser may encode differently during SSR vs client hydration. Specifically, the `<`, `>`, and `'` characters in the SVG data URI may be entity-encoded differently by the server (Node.js) and the browser's HTML parser, causing React to log hydration mismatch warnings.

**Why it happens:**
React 18+ performs strict hydration checking. When the server renders a `style` attribute or CSS custom property containing `url("data:image/svg+xml,<svg ...")`, Node.js's HTML serializer may encode angle brackets as `&lt;`/`&gt;`. The browser then decodes these during parsing, producing different innerHTML than what React expects during hydration comparison.

**Consequences:**
- Console floods with hydration mismatch warnings in development
- React may discard server-rendered markup and re-render client-side (performance hit)
- In React 19 (used by Next.js 15), hydration errors are more prominent and visible

**Detection:**
Console warnings: "Text content did not match" or "Hydration failed because the initial UI does not match what was rendered on the server."

**Prevention:**
1. **Keep squircle masks in CSS files, NOT in JSX inline styles.** The current approach of defining `--squircle-mask-*` in `theme.css` via `@theme inline` and consuming via `.squircle-*` utility classes in `squircles.css` is already correct. Do NOT move these to React inline styles.
2. **If using `@squircle-js/react`** (as mentioned in PROJECT.md target features): this library uses JavaScript to compute mask paths at runtime. It provides a `SquircleNoScript` component for SSR fallback. Wrap squircle components with `suppressHydrationWarning` if client-computed paths differ from server fallback:
   ```tsx
   <div suppressHydrationWarning className="squircle-wrapper">
     <Squircle cornerRadius={24} cornerSmoothing={0.6}>
       {children}
     </Squircle>
   </div>
   ```
3. **Recommended approach for this project:** Keep the current CSS-only squircle system (`mask-image` + `@supports (corner-shape: squircle)` PE) rather than adding `@squircle-js/react`. The CSS approach has zero hydration risk, zero JS cost, and already works across the three-tier degradation path. The React library adds JS dependency for something CSS handles.

**Phase:** Phase 2 (component extraction). Decision needed: CSS squircles (keep) vs @squircle-js/react (adds complexity).

**Sources:**
- [Next.js: Text content does not match server-rendered HTML](https://nextjs.org/docs/messages/react-hydration-error)
- Current codebase: `theme.css` lines 93-96, `squircles.css` lines 56-148

---

### Pitfall 7: Docker Standalone Output Missing Static Assets and Sharp Binary

**What goes wrong:**
Two compounding issues with `output: 'standalone'` in Next.js Docker deployments:

**Issue A:** The standalone output does NOT copy the `public/` folder or `.next/static/` folder. If you only copy `.next/standalone/` into your Docker image, all static assets (images, fonts, favicons) return 404 in production.

**Issue B:** The `sharp` package (required for `next/image` optimization) is not included in standalone output by default. If you use `<Image>` components (which you should for WebP/AVIF conversion), the image optimization endpoint crashes with "sharp is required to be installed in standalone mode."

**Issue C:** Sharp's native binaries are platform-specific. If you build on macOS (arm64) and deploy to Linux Docker (x64), the sharp binary is for the wrong platform.

**Why it happens:**
Standalone mode is designed for minimal deployment footprint. It intentionally excludes static files (expected to be served by CDN/Nginx) and optional native dependencies. This is documented but consistently missed in Docker configurations.

**Consequences:**
- All self-hosted Inter/Manrope fonts return 404 (currently in `fonts/` directory)
- Hero illustrations and SVG icons don't load
- `next/image` optimization fails, serving unoptimized images or crashing
- Production deploy appears to work (server starts) but pages are visually broken

**Detection:**
- 404 errors in browser DevTools for font files, images, and static JS chunks
- Console error: "sharp is required to be installed in standalone mode"
- Pages load with system fonts instead of Inter/Manrope

**Prevention:**
1. **Dockerfile must explicitly copy static assets:**
   ```dockerfile
   FROM node:20-slim AS runner
   WORKDIR /app
   
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   COPY --from=builder /app/public ./public
   
   # NOT Alpine! Sharp has issues with Alpine musl libc
   ENV NODE_ENV=production
   ENV PORT=3000
   ENV HOSTNAME="0.0.0.0"
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```
2. **Install sharp explicitly and configure file tracing:**
   ```bash
   npm install sharp
   ```
   In `next.config.ts`:
   ```ts
   const nextConfig = {
     output: 'standalone',
     experimental: {
       outputFileTracingIncludes: {
         '/*': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
       },
     },
   };
   ```
3. **Use `node:20-slim` (Debian), NOT `node:20-alpine`** -- Sharp's native binaries have known compatibility issues with Alpine's musl libc.
4. **Build inside Docker** (multi-stage) to ensure sharp compiles for the target architecture:
   ```dockerfile
   FROM node:20-slim AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   ```

**Phase:** Phase 5 (Docker/deployment). Should be set up early as a deployment skeleton.

**Sources:**
- [Next.js: output standalone docs](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output)
- [Next.js: Sharp Missing In Production](https://nextjs.org/docs/messages/sharp-missing-in-production)
- [Next.js 15 Standalone Mode & Docker Optimization](https://javascript.plainenglish.io/next-js-15-self-hosting-with-docker-complete-guide-0826e15236da)

---

### Pitfall 8: next/font/local Configuration Does Not Accept System Font local() Sources

**What goes wrong:**
The current project uses `local()` sources in `@font-face` to reference system-installed SF Pro Display and SF Pro Rounded (Apple system fonts). `next/font/local` requires actual font files (`.woff2`, `.ttf`, `.otf`) in the project -- it cannot reference system-installed fonts via `local()` source descriptors. Attempting to use `next/font/local` without providing font files will fail at build time.

**Why it happens:**
`next/font/local` optimizes font delivery by hashing, subsetting, and preloading font files. It needs actual binary font files to process. The current `fonts.css` only uses `local('SF Pro Display')` which tells the browser "use the system font if installed, otherwise skip." This is a fundamentally different approach.

**Consequences:**
- Build error: `next/font/local` cannot find font file
- If bypassed by keeping raw `@font-face` in CSS, you lose `next/font`'s automatic font-display optimization, CSS variable injection, and preload hints
- Users without Apple devices (most of the KZ market, which is Android-dominated) see fallback system fonts with no custom font at all

**Detection:**
Build-time error from `next/font/local`, or visual inspection showing system sans-serif instead of branded font on non-Apple devices.

**Prevention:**
1. **Decision required: keep SF Pro as system-font-only, or bundle actual WOFF2 files?**
   - SF Pro is Apple-proprietary. You CANNOT legally bundle SF Pro WOFF2 files for web distribution unless serving to Apple devices only.
   - PROJECT.md history shows Inter + Manrope were the original brand fonts. SF Pro was introduced later.
2. **Recommended approach: revert to Inter + Manrope with `next/font/google` or `next/font/local`:**
   ```tsx
   // app/layout.tsx
   import { Inter, Manrope } from 'next/font/google';
   
   const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });
   const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-heading' });
   
   export default function RootLayout({ children }) {
     return (
       <html className={`${inter.variable} ${manrope.variable}`}>
         <body>{children}</body>
       </html>
     );
   }
   ```
   Or for self-hosted (recommended for data sovereignty compliance per PROJECT.md):
   ```tsx
   import localFont from 'next/font/local';
   
   const inter = localFont({
     src: './fonts/Inter-Variable.woff2',
     variable: '--font-body',
     display: 'swap',
   });
   ```
3. **Include `cyrillic` subset** -- the site is Russian-only. Missing Cyrillic subset means Cyrillic characters fall back to system font.
4. **Update CSS tokens:** Replace `--font-family-body: 'SF Pro Display'` with `--font-family-body: var(--font-body)` to consume the CSS variable injected by `next/font`.

**Phase:** Phase 1 (project scaffolding). Fonts must be configured before any component work.

**Sources:**
- [Next.js Font Optimization docs](https://nextjs.org/docs/app/getting-started/fonts)
- [Fonts in Next.js (2026): next/font patterns, performance, and production pitfalls](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/)
- Current codebase: `src/styles/fonts.css`

---

### Pitfall 9: Server Actions Form Validation Loses Progressive Enhancement Without Careful Architecture

**What goes wrong:**
The current form uses vanilla JS `fetch()` with client-side honeypot + timing-based spam protection. When migrating to Server Actions, developers commonly wire up the form with `useActionState` + Zod validation and assume progressive enhancement "just works." But several patterns break progressive enhancement (form works without JS):

1. Using `onClick` handlers instead of `action` prop on `<form>`
2. Using `event.preventDefault()` anywhere in the submit chain
3. Relying on client-side state for form field values (controlled inputs)
4. Not providing a `name` attribute on form fields (Server Actions read FormData)

**Why it happens:**
React 19's Server Actions are progressively enhanced by default ONLY when used correctly: `<form action={serverAction}>`. Any deviation (like wrapping in `useTransition` with manual `event.preventDefault()`, or using a submit button with an `onClick`) breaks the native form POST fallback.

**Consequences:**
- Form appears to work during development (JS always loaded) but fails in production when:
  - JS bundle hasn't loaded yet (user clicks submit during hydration)
  - JS fails to load (network error, ad blocker)
  - User has JS disabled
- Honeypot spam protection (hidden field) still works with Server Actions
- Timing-based spam protection (client-side timestamp) breaks without JS -- needs server-side alternative

**Detection:**
Disable JavaScript in browser DevTools and attempt to submit the form. If nothing happens, progressive enhancement is broken.

**Prevention:**
1. **Use the `action` prop pattern, not `onSubmit`:**
   ```tsx
   // GOOD: Progressive enhancement works
   <form action={submitConsultation}>
     <input name="name" required />
     <input name="phone" required type="tel" />
     <select name="specialization" required>{/* options */}</select>
     <textarea name="description" />
     <input type="hidden" name="honeypot" value="" />
     <button type="submit">Submit</button>
   </form>
   ```
2. **Validate with Zod on the server AND use HTML validation attributes on the client:**
   ```tsx
   // actions/submit-consultation.ts
   'use server';
   import { z } from 'zod';
   
   const schema = z.object({
     name: z.string().min(2),
     phone: z.string().regex(/^\+7\d{10}$/),
     specialization: z.enum(['oncology', 'cardiology', ...]),
     description: z.string().optional(),
     honeypot: z.literal(''), // Must be empty
   });
   ```
3. **Replace timing-based spam protection** with a server-side approach:
   - Include a hidden timestamp field set by JS on page load
   - Server Action checks: if timestamp is missing (no JS), allow submission but flag for manual review
   - If timestamp is present, check minimum elapsed time (e.g., >3 seconds)
4. **Use `useActionState` for pending state display** (shows loading indicator WITH JS, degrades gracefully WITHOUT JS):
   ```tsx
   'use client';
   import { useActionState } from 'react';
   
   function ConsultationForm() {
     const [state, formAction, isPending] = useActionState(submitConsultation, initialState);
     return (
       <form action={formAction}>
         {/* fields */}
         <button type="submit" disabled={isPending}>
           {isPending ? 'Sending...' : 'Submit'}
         </button>
       </form>
     );
   }
   ```

**Phase:** Phase 4 (form migration). High-impact for conversion -- must be tested with JS disabled.

**Sources:**
- [Next.js: How to create forms with Server Actions](https://nextjs.org/docs/app/guides/forms)
- [Mastering forms in Next.js 15 and React 19](https://engineering.udacity.com/mastering-forms-in-next-js-15-and-react-19-e3d2d783946b)
- Current codebase: PROJECT.md constraint -- form is the primary conversion mechanism

---

### Pitfall 10: PostgreSQL Connection Exhaustion in Serverless-Style API Routes

**What goes wrong:**
Next.js API routes (and Server Actions) run in a serverless-like model even in self-hosted mode: each request may spawn a new handler. Without connection pooling, each API route invocation opens a new PostgreSQL connection. Under moderate traffic (e.g., multiple concurrent form submissions), PostgreSQL hits its `max_connections` limit (default: 100) and begins rejecting connections.

**Why it happens:**
The current Directus-based setup handles connection pooling internally. When replacing Directus with direct PostgreSQL access via `pg` or Prisma, connection management becomes the application's responsibility. Next.js does not provide built-in connection pooling.

**Consequences:**
- Form submissions fail intermittently under load: "too many connections for role"
- Connection exhaustion cascades: one failed connection attempt holds a slot, making subsequent attempts fail faster
- PostgreSQL performance degrades even before hitting the hard limit (each idle connection consumes ~5-10MB RAM)

**Detection:**
PostgreSQL logs: `FATAL: too many connections for role "xxx"`. Intermittent 500 errors on form submission endpoint.

**Prevention:**
1. **Use a singleton connection pool pattern:**
   ```tsx
   // lib/db.ts
   import { Pool } from 'pg';
   
   const globalForDb = globalThis as unknown as { pool: Pool };
   
   export const pool = globalForDb.pool ?? new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 10, // Max pool size
     idleTimeoutMillis: 30000,
   });
   
   if (process.env.NODE_ENV !== 'production') {
     globalForDb.pool = pool;
   }
   ```
   The `globalThis` pattern prevents creating a new pool on every hot reload in development.

2. **If using Prisma:**
   ```tsx
   // lib/prisma.ts
   import { PrismaClient } from '@prisma/client';
   
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
   
   export const prisma = globalForPrisma.prisma ?? new PrismaClient();
   
   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma;
   }
   ```

3. **Add PgBouncer in Docker Compose** for production:
   ```yaml
   services:
     pgbouncer:
       image: edoburu/pgbouncer:latest
       environment:
         DATABASE_URL: postgres://user:pass@postgres:5432/medicus
         POOL_MODE: transaction
         MAX_CLIENT_CONN: 200
         DEFAULT_POOL_SIZE: 20
       ports:
         - "6432:6432"
   ```
   Point the Next.js app at PgBouncer (port 6432) instead of PostgreSQL directly.

4. **Do NOT use Edge Runtime** for database-connected routes. Edge Runtime cannot use `pg` native module or Prisma's query engine. Keep API routes on Node.js runtime:
   ```tsx
   // app/api/submissions/route.ts
   export const runtime = 'nodejs'; // Explicit -- do NOT use 'edge'
   ```

**Phase:** Phase 4 (API routes / database). Must be configured before any database-connected endpoint goes live.

**Sources:**
- [PgBouncer: Database Connection Pooling](https://dev.to/whoffagents/pgbouncer-database-connection-pooling-that-actually-scales-4ek4)
- [Scaling PostgreSQL with PgBouncer: Complete 2026 Guide](https://www.tamiltech.in/article/scaling-postgresql-connections-with-pgbouncer-the-complete-guide-for-2026)

---

## Minor Pitfalls

Issues that cause confusion or wasted time but are quickly fixable.

---

### Pitfall 11: Metadata Streaming Places OG Tags Outside `<head>` on Client Navigation

**What goes wrong:**
Next.js 15.1+ uses metadata streaming, which can cause `<meta>` tags (including Open Graph tags critical for social sharing) to render inside `<body>` instead of `<head>` during client-side navigation. Initial SSR renders metadata correctly in `<head>`, but after a soft navigation via `<Link>`, metadata may migrate.

**Why it happens:**
Streaming SSR sends the `<head>` content before the page component resolves. When `generateMetadata` is async (e.g., fetching data), the metadata may arrive after the `<head>` has already been flushed to the client. On client navigation, React reconciles metadata differently than on initial load.

**Consequences:**
- Social sharing previews (WhatsApp, Telegram -- primary sharing channels for KZ audience) may show incorrect or missing OG data if the share URL is a client-navigated page
- SEO crawlers that execute JS may index metadata from the wrong location
- Lighthouse SEO audit may flag missing meta tags

**Prevention:**
1. **Use static `metadata` export (not `generateMetadata`) for all pages** -- this landing site has no dynamic content that requires async metadata resolution:
   ```tsx
   // app/page.tsx
   import type { Metadata } from 'next';
   
   export const metadata: Metadata = {
     title: 'MedicusUnion KZ - Online Consultations with European Doctors',
     description: 'Get a second opinion from doctors in Germany, Israel, Switzerland...',
     openGraph: {
       title: 'MedicusUnion KZ',
       description: '...',
       images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
     },
   };
   ```
2. **Do NOT use `generateMetadata` unless you genuinely need dynamic data** (e.g., CMS-driven page titles). For a static landing page, the static export is always correct.
3. **Test social sharing** with the actual production URL using Facebook Sharing Debugger and Telegram's link preview by pasting the URL.

**Phase:** Phase 1 (scaffolding). Set up correct metadata pattern from the start.

**Sources:**
- [The metadata streaming controversy in Next.js 15.1+](https://neuralcovenant.com/2025/06/the-metadata-streaming-controversy-in-next.js-15.1-/)
- [Next.js: generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

### Pitfall 12: Tailwind v4 @theme inline Tokens May Not Survive Next.js PostCSS Pipeline Without Explicit Configuration

**What goes wrong:**
The current project uses Tailwind v4's `@theme inline` directive in `theme.css` to register 60+ custom design tokens (colors, shadows, spacing, squircle masks). When migrating to Next.js, the PostCSS pipeline may process CSS differently than the current standalone Tailwind CLI build. If Tailwind v4 is not correctly configured as the PostCSS plugin, `@theme inline`, `@custom-variant`, and `@source` directives may be passed through as raw text (unprocessed), causing all utility classes to be missing.

**Why it happens:**
Next.js has its own PostCSS pipeline. Tailwind v4 can run as either a standalone CLI or a PostCSS plugin. If `postcss.config.js` is missing or misconfigured, Next.js uses its default PostCSS setup which does not include Tailwind v4. Unlike Tailwind v3 which required explicit `tailwindcss` in PostCSS config, Tailwind v4 auto-detects but only when properly installed.

**Consequences:**
- Zero Tailwind utility classes render -- all `bg-mu-green-50`, `text-mu-text-900`, etc. produce no CSS
- Glass shadow tokens (`--shadow-glass-*`), squircle mask tokens (`--squircle-mask-*`), and spacing tokens don't exist
- The page appears completely unstyled or only has base HTML styling

**Detection:**
- Page renders with default browser styles (Times New Roman, no colors, no spacing)
- Browser DevTools shows no Tailwind-generated CSS rules
- Build warnings about unrecognized CSS at-rules (`@theme`, `@custom-variant`, `@source`)

**Prevention:**
1. **Install Tailwind v4 as a PostCSS plugin for Next.js:**
   ```bash
   npm install tailwindcss@latest @tailwindcss/postcss
   ```
2. **Create `postcss.config.mjs`:**
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
     },
   };
   ```
3. **Update `@source` directive** in the CSS entry point to scan `.tsx` files instead of `.html`:
   ```css
   /* Current: */
   @source '../../*.html';
   /* Migration: */
   @source '../app/**/*.{tsx,ts}';
   @source '../components/**/*.{tsx,ts}';
   ```
4. **Verify by checking the rendered page** for any Tailwind utility class applying correctly (e.g., `bg-background` should produce a white background).

**Phase:** Phase 1 (project scaffolding). This blocks everything -- no styling works without it.

**Sources:**
- [Tailwind CSS v4 docs: PostCSS plugin](https://tailwindcss.com/docs/installation/using-postcss)
- Current codebase: `src/styles/tailwind.css`, `src/styles/theme.css`

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation | Severity |
|-------|---------------|------------|----------|
| Phase 1: Scaffolding | Tailwind v4 @theme not processed (Pitfall 12) | Verify PostCSS config FIRST before any other work | BLOCKER |
| Phase 1: Scaffolding | CSS import order diverges dev/prod (Pitfall 2) | Single CSS entry point, `sideEffects: ["*.css"]` | HIGH |
| Phase 1: Scaffolding | Dark mode FOUC (Pitfall 4) | Middleware + cookie, or next-themes with inline script | HIGH |
| Phase 1: Scaffolding | Font configuration failure (Pitfall 8) | next/font/local with actual WOFF2 files, not local() sources | HIGH |
| Phase 1: Scaffolding | Metadata placement (Pitfall 11) | Static metadata export, not generateMetadata | MEDIUM |
| Phase 2: Components | backdrop-filter stripped by Turbopack (Pitfall 1) | Reverse declaration order: standard before -webkit- | HIGH |
| Phase 2: Components | SVG filter ID conflicts (Pitfall 3) | Single SvgDefs component in root layout | HIGH |
| Phase 2: Components | Squircle hydration warnings (Pitfall 6) | Keep CSS-only squircles, avoid @squircle-js/react | MEDIUM |
| Phase 3: Animations | Framer Motion bundle bloat (Pitfall 5) | LazyMotion + m components, CSS for simple animations | HIGH |
| Phase 4: Forms/API | Form progressive enhancement broken (Pitfall 9) | form action={}, not onSubmit; test with JS disabled | HIGH |
| Phase 4: Forms/API | PostgreSQL connection exhaustion (Pitfall 10) | Singleton pool + PgBouncer in Docker Compose | HIGH |
| Phase 5: Deployment | Docker missing static assets / sharp (Pitfall 7) | Explicit COPY for public/ and .next/static/, install sharp, use node:20-slim | HIGH |

---

## Cross-Cutting Concerns

### Glass Effects Are the Highest-Risk Migration Area

The glass design system (`liquid-glass.css` at 568 lines, `squircles.css` at 148 lines, `theme.css` at 418 lines) represents the most fragile part of the migration. Three separate pitfalls (#1, #2, #6) directly affect glass rendering. The glass system relies on:

1. **CSS custom property cascade** (theme.css -> liquid-glass.css) -- broken by import order divergence
2. **Vendor prefix ordering** (-webkit-backdrop-filter before backdrop-filter) -- broken by Turbopack
3. **SVG data URI mask-image** -- potential hydration serialization differences
4. **SVG filter ID references** -- broken by React component instantiation model
5. **`::before`/`::after` pseudo-elements** for specular highlights, glint borders, fluted textures -- these render correctly in React but need explicit `content: ''` (CSS handles this, not JSX)

**Recommendation:** Migrate glass CSS files AS-IS (no rewrite to Tailwind utilities) and wrap in a visual regression test suite before touching any glass-related code. The glass CSS is 100% framework-agnostic -- it works identically whether consumed by HTML or React.

### The "use client" Boundary Tax

Every component that uses Framer Motion, dark mode toggle, form state, or any browser API must be marked `"use client"`. This creates a "boundary tax" where Server Component benefits (zero JS shipped, direct database access, streaming) are lost for that subtree. For a landing page where the entire visible content is interactive (glass hover effects, scroll animations, accordion, form), the risk is that EVERYTHING becomes a Client Component, making the Next.js migration a net negative for performance.

**Mitigation:** Design the component tree so that content-heavy sections (text, images, static glass cards) are Server Components, and only interactive leaves (animated cards, theme toggle, form) are Client Components. This requires explicit architectural planning BEFORE component extraction.

---

## Sources

- [GitHub Issue #78302: CSS backdrop-filter disappears in Next.js 15.3.0/15.3.1 with Turbopack](https://github.com/vercel/next.js/issues/78302) -- OPEN, confirmed by Turbopack team
- [GitHub Issue #79531: CSS import order differs between dev turbopack and prod webpack](https://github.com/vercel/next.js/issues/79531) -- confirmed
- [GitHub Issue #79535: Missing CSS styles after upgrading from 15.2.x to 15.3.x](https://github.com/vercel/next.js/issues/79535)
- [GitHub PR #13997: Always generate -webkit-backdrop-filter property](https://github.com/tailwindlabs/tailwindcss/pull/13997) -- Tailwind v4 fix
- [Motion.dev: Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) -- official LazyMotion docs
- [Next.js: Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/local and next/font/google
- [Next.js: Output Standalone](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output) -- Docker standalone docs
- [Next.js: Sharp Missing In Production](https://nextjs.org/docs/messages/sharp-missing-in-production)
- [Next.js: Server Actions and Forms](https://nextjs.org/docs/app/guides/forms)
- [Next.js: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: Hydration Error Messages](https://nextjs.org/docs/messages/react-hydration-error)
- [next-themes GitHub: Perfect Next.js dark mode](https://github.com/pacocoursey/next-themes)
- [Next.js Discussion #53063: Dark mode with App Router + RSC](https://github.com/vercel/next.js/discussions/53063)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Framer Motion: Complete React & Next.js Guide 2026](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers)
- [Next.js 15 Standalone Mode & Docker Optimization](https://javascript.plainenglish.io/next-js-15-self-hosting-with-docker-complete-guide-0826e15236da)
- [Fonts in Next.js (2026): next/font patterns and production pitfalls](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/)
- [The metadata streaming controversy in Next.js 15.1+](https://neuralcovenant.com/2025/06/the-metadata-streaming-controversy-in-next.js-15.1-/)
