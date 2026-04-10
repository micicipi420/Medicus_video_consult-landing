# Feature Landscape: Next.js Migration

**Domain:** Medical landing page migration (vanilla HTML/CSS/JS -> Next.js 15 + React)
**Researched:** 2026-04-10
**Mode:** Component inventory, React migration mapping, client/server boundaries

## Current Page Inventory

| Page | Route (Next.js) | Sections | Has Form | Complexity |
|------|-----------------|----------|----------|------------|
| index.html | `/` | 12 (hero, stats, services, problem, process, why-us, clinics, platform, reviews, faq, contact, cta) | Yes | High |
| online-consultations.html | `/online-consultations` | 12 (hero, features, problem, benefits, process, doctors, why-medicusunion, triggers, pricing, form, faq, final-cta) | Yes | High |
| treatment-abroad.html | `/treatment-abroad` | 11 (hero, stats, about-us, platform, clinics, included, steps, reviews, faq, form, final-cta) | Yes | High |
| checkup.html | `/checkup` | 12 (hero, stats, why-checkup, why-abroad, why-us, korea-programs, turkey-programs, how-it-works, b2b, faq, form, final-cta) | Yes | High |
| contacts.html | `/contacts` | 2 (hero, contact-section with info+form) | Yes | Medium |
| 404.html | `not-found.tsx` | 1 (error card) | No | Low |
| styleguide.html | `/styleguide` (dev only) | N/A | No | Low |

---

## Table Stakes

Features users expect. Missing = product feels broken or incomplete.

| Feature | Why Expected | Complexity | Client/Server | Notes |
|---------|--------------|------------|----------------|-------|
| All 7 pages with 1:1 content parity | Users see the same site, SEO rankings preserved | Med | Server (pages) | App Router file-based routing replaces SPA router |
| Contact form with validation | Core conversion mechanism | Med | Client (form logic) + Server (action) | Server Action replaces fetch-to-Directus |
| Phone mask (+7 format) | KZ audience expects familiar input format | Low | Client | Custom hook or `@react-input/mask` |
| Honeypot + timing spam protection | Prevents bot submissions without CAPTCHA | Low | Server (validation) | Move to Server Action -- more secure server-side |
| Form success/error states | User feedback after submission | Low | Client | useActionState from React 19 |
| Sticky header with glass-on-scroll | Navigation present on all pages, brand identity | Med | Client (scroll detection) | useEffect + scroll listener in client component |
| Mobile menu with backdrop-blur | Mobile navigation access | Med | Client (toggle state) | useState for open/close, Framer Motion for animation |
| Dark mode toggle with persistence | Already shipped feature, users expect it | Med | Client (toggle) + Server (cookie read) | next-themes library, cookie-based for SSR no-flash |
| FAQ accordion | Standard UX pattern on all service pages | Low | Client (toggle state) | shadcn/ui Accordion component |
| Smooth scroll to anchor | CTA buttons scroll to form section | Low | Client | Native CSS `scroll-behavior: smooth` + `scrollIntoView` |
| SEO metadata per page | Each page has unique title, description, OG tags | Low | Server | Next.js `generateMetadata()` in each page.tsx |
| JSON-LD structured data | Medical business schema already implemented | Low | Server | `<script type="application/ld+json">` in layout or page |
| Responsive layout (mobile-first) | CA 45+ uses mobile predominantly in KZ | Low | Server (Tailwind) | Tailwind responsive classes carry over directly |
| Animated counters (stats) | Social proof section on index, treatment, checkup | Low | Client | IntersectionObserver via `whileInView` in Framer Motion |
| Scroll-reveal animations | Section entrance animations throughout all pages | Med | Client | Framer Motion `whileInView` replaces Motion CDN |
| Footer with navigation links | Standard site footer | Low | Server | Server Component, static content |
| Sticky mobile CTA bar | Mobile conversion element (click-to-call + CTA) | Low | Server + CSS | Can be Server Component with CSS `position: fixed` |
| aria-current on active nav link | Accessibility requirement | Low | Client | `usePathname()` in client nav component |

---

## Differentiators

Features that set the product apart. The Liquid Glass design system is the primary differentiator.

| Feature | Value Proposition | Complexity | Client/Server | Notes |
|---------|-------------------|------------|----------------|-------|
| Liquid Glass materials (5 variants) | Unique visual identity, premium medical feel | High | Mixed | CSS classes carry over; specular highlight needs client |
| Squircle corners (3 tiers) | Apple-quality border radius | Med | Server (CSS) + Client (PE) | SVG mask approach works in CSS; `corner-shape: squircle` PE via `@squircle-js/react` |
| Specular parallax (mouse tracking) | Glass surfaces feel alive, tactile | Med | Client | `onMouseMove` handler setting CSS custom properties |
| 3-tier SVG refraction filters | Chromium-only subtle glass distortion | Med | Server (SVG defs) + Client (probe) | SVG filters in layout, JS probe for `data-refract` attribute |
| Adaptive tinting (section-tint-*) | Glass colors shift per section context | Low | Server (CSS) | Pure CSS cascade via Tailwind `section-tint-cool/warm/mint` |
| Hero staggered entrance animation | Premium first impression, progressive reveal | Med | Client | Framer Motion variants with stagger delay |
| Staggered card grid animation | Cards appear one-by-one on scroll | Low | Client | Framer Motion staggerChildren |
| Page transition animations | SPA-like smooth navigation between pages | High | Client | Framer Motion `AnimatePresence` + Next.js layout |
| Coordinator card with photo | Personal touch, trust building | Low | Server | Static content, next/image component |
| Gradient CTA buttons | Brand identity (#1AC67E -> #0D9DB5) | Low | Server (CSS) | Tailwind gradient utilities |
| `prefers-reduced-motion` guards | Accessibility for vestibular disorders | Low | Client | Framer Motion built-in `reducedMotion` prop |

---

## Anti-Features

Features to explicitly NOT build during migration.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Custom SPA router | Next.js App Router handles navigation natively | Delete router.js entirely; use `<Link>` and file-based routing |
| Client-side page caching | Next.js has built-in caching (RSC payload, ISR) | Rely on Next.js cache, remove pageCache object |
| Manual DOM manipulation for animations | Anti-pattern in React; breaks reconciliation | Use Framer Motion declarative API |
| Global window.MU namespace | React components encapsulate their own state | Use React context, hooks, and props |
| IntersectionObserver for scroll-reveal | Redundant when Framer Motion has `whileInView` | Use `motion.div` with `whileInView` prop |
| Manual bfcache handling | Next.js handles navigation state internally | Remove `pageshow` listener |
| Inline SVG icons everywhere | Duplicated SVG markup across pages | Use `lucide-react` (same icons already used in current site) |
| Multiple `<script>` tags with CDN | Added external dependency, no tree-shaking | `motion` package via npm, tree-shakeable |
| Glass budget enforcement | Currently disabled in production; React re-renders complicate observer logic | Defer to post-migration performance audit |
| reinitPageContent() pattern | SPA router hack for re-initializing JS after DOM swap | React component lifecycle handles this naturally |

---

## React Component Hierarchy

### Layout Components (Server by default)

```
app/layout.tsx (RootLayout -- SERVER)
  |-- <html lang="ru" suppressHydrationWarning>
  |-- <ThemeProvider> (CLIENT -- next-themes wrapper)
  |     |-- <SvgRefractionDefs /> (SERVER -- hidden SVG filter definitions)
  |     |-- <Header /> (CLIENT -- scroll detection, mobile menu state)
  |     |     |-- <Logo /> (SERVER)
  |     |     |-- <DesktopNav /> (CLIENT -- usePathname for active link)
  |     |     |-- <HeaderActions /> (SERVER -- phone link, CTA button)
  |     |     |-- <MobileMenuButton /> (CLIENT -- toggle state)
  |     |-- <MobileMenu /> (CLIENT -- open/close state, backdrop-blur)
  |     |-- <main>{children}</main>
  |     |-- <Footer /> (SERVER -- static links, contact info)
  |     |-- <StickyMobileCTA /> (SERVER -- static HTML, CSS-only sticky)
```

### Page Components (Server by default)

```
app/page.tsx (Index -- SERVER)
  |-- <HeroSection /> (CLIENT -- entrance animations, floating badges)
  |     |-- <HeroBadge />
  |     |-- <HeroTitle />
  |     |-- <HeroButtons />
  |     |-- <HeroTrust />
  |     |-- <HeroPhotos />
  |-- <StatsSection /> (CLIENT -- animated counters)
  |     |-- <StatCard /> (CLIENT -- counter animation)
  |-- <ServicesSection /> (SERVER -- static cards)
  |     |-- <ServiceCard /> (SERVER -- glass card, static content)
  |-- <ProblemSection /> (SERVER)
  |-- <ProcessSection /> (SERVER)
  |     |-- <StepCard /> (SERVER)
  |-- <WhyUsSection /> (SERVER)
  |     |-- <AdvantageCard /> (SERVER)
  |-- <ClinicsSection /> (SERVER)
  |     |-- <ClinicCard /> (SERVER)
  |     |-- <CountryFlag /> (SERVER -- inline SVG)
  |-- <PlatformSection /> (SERVER)
  |-- <ReviewsSection /> (SERVER)
  |     |-- <ReviewCard /> (SERVER)
  |-- <FAQSection /> (CLIENT -- accordion state)
  |     |-- <FAQItem /> (CLIENT -- open/close toggle)
  |-- <ContactSection /> (contains client form)
  |     |-- <ContactInfo /> (SERVER)
  |     |-- <CoordinatorCard /> (SERVER)
  |     |-- <TrustBadges /> (SERVER)
  |     |-- <ContactForm /> (CLIENT -- validation, submission)
  |-- <CTASection /> (SERVER)
```

### Shared/Reusable Components

```
components/
  ui/                          (shadcn/ui base components)
    accordion.tsx              (CLIENT -- Radix UI primitive)
    button.tsx                 (SERVER -- unless onClick needed)
    input.tsx                  (CLIENT -- for controlled inputs)
    select.tsx                 (CLIENT -- Radix UI primitive)
    textarea.tsx               (CLIENT -- for controlled inputs)
    label.tsx                  (SERVER)

  glass/                       (Liquid Glass design system)
    liquid-regular.tsx         (SERVER -- CSS class + cn() wrapper)
    liquid-card.tsx            (CLIENT -- mouse specular on desktop)
    liquid-nav.tsx             (SERVER -- CSS class wrapper)
    liquid-clear.tsx           (SERVER -- CSS class wrapper)
    liquid-fluted.tsx          (SERVER -- CSS class wrapper)
    liquid-btn-primary.tsx     (SERVER -- gradient button)
    liquid-btn-secondary.tsx   (SERVER -- glass button)
    squircle.tsx               (SERVER -- mask-image CSS + corner-shape PE)
    glass-specular.tsx         (CLIENT -- mouse tracking wrapper for any glass element)

  sections/                    (Page section components)
    hero-section.tsx           (CLIENT -- animations)
    stats-section.tsx          (CLIENT -- animated counters)
    faq-section.tsx            (CLIENT -- accordion)
    contact-section.tsx        (mixed -- server wrapper, client form)
    cta-section.tsx            (SERVER)
    section-wrapper.tsx        (SERVER -- padding, max-width, tint class)

  layout/
    header.tsx                 (CLIENT)
    footer.tsx                 (SERVER)
    mobile-menu.tsx            (CLIENT)
    sticky-mobile-cta.tsx      (SERVER)
    svg-refraction-defs.tsx    (SERVER -- hidden SVG filter definitions)

  forms/
    contact-form.tsx           (CLIENT)
    phone-input.tsx            (CLIENT -- input mask)

  icons/
    index.tsx                  (Re-export from lucide-react)
```

---

## Client/Server Component Boundary Analysis

### Server Components (zero JS shipped to client)

These components render static HTML. They comprise the majority of the site.

| Component | Justification |
|-----------|---------------|
| All page.tsx files | Static content, SEO metadata via `generateMetadata()` |
| SectionWrapper | Applies `section-tint-*` classes, padding, max-width -- pure CSS |
| ServiceCard, ClinicCard, ReviewCard, StepCard | Static content with glass CSS classes |
| Footer | Static navigation links, contact info |
| StickyMobileCTA | CSS `position: fixed`, no JS interaction needed |
| CoordinatorCard | Static image + contact info |
| TrustBadges | Static badge pills |
| LiquidRegular, LiquidClear, LiquidFluted (without specular) | CSS-only glass materials |
| Squircle | SVG mask-image in CSS, `corner-shape` PE via `@supports` |
| SvgRefractionDefs | Hidden SVG `<defs>` block for backdrop-filter URL references |
| CTASection | Static content with gradient button |

### Client Components (require `"use client"`)

These components need browser APIs, state, or event handlers.

| Component | Why Client | Est. Bundle | Optimization |
|-----------|-----------|-------------|-------------|
| Header | `useEffect` for scroll detection (`window.scrollY > 20`), `useState` for `header--scrolled` class | ~2KB | Passive scroll listener; debounce unnecessary at 20px threshold |
| MobileMenu | `useState` for open/close, body scroll lock on open | ~3KB | Conditionally render content only when open |
| ContactForm | Form state, validation, `useActionState`, phone mask | ~8KB | Single client boundary for entire form; progressive enhancement |
| FAQSection | Accordion open/close state | ~2KB | Use shadcn/ui Accordion (Radix) -- no custom code needed |
| StatsSection | Animated counter needs IntersectionObserver or `whileInView` | ~3KB | Framer Motion `whileInView` with `once: true` |
| HeroSection | Staggered entrance animation on mount | ~4KB | Framer Motion variants; `initial`/`animate` pattern |
| GlassSpecular | `onMouseMove` on document to set `--mouse-x`/`--mouse-y` | ~1KB | Desktop only via `(pointer: fine)` media query check |
| ThemeToggle | Dark mode toggle button, `useTheme()` from next-themes | ~1KB | next-themes handles localStorage + cookie persistence |
| RefractionProbe | `CSS.supports()` check, sets `data-refract` on `<html>` | ~0.5KB | Single `useEffect` in layout, runs once |
| AnimateOnScroll | Thin wrapper providing Framer Motion `whileInView` to server children | ~1KB each | Minimal client surface -- receives server children as props |

### Boundary Strategy: "Client Islands in a Server Sea"

The governing principle: push `"use client"` as deep as possible in the component tree. Most section components are server-rendered; only interactive leaf components need client hydration.

**Pattern 1: Glass cards with specular highlight**
```
<ServiceCard>                    // SERVER -- renders glass CSS classes
  <GlassSpecularWrapper>         // CLIENT -- adds onMouseMove only on desktop
    {children}                   // SERVER children passed through as props
  </GlassSpecularWrapper>
</ServiceCard>
```

**Pattern 2: Sections with scroll-reveal animations**
```
<SectionWrapper tint="cool">    // SERVER -- padding, max-width, tint class
  <AnimateOnScroll>              // CLIENT -- Framer Motion whileInView
    <CardGrid>                   // SERVER -- grid layout
      <ServiceCard />            // SERVER -- static content
      <ServiceCard />            // SERVER
    </CardGrid>
  </AnimateOnScroll>
</SectionWrapper>
```

**Pattern 3: Sections that are entirely static**
```
<SectionWrapper tint="warm">    // SERVER
  <ProblemGrid>                 // SERVER -- static text + icons
    <ProblemItem />             // SERVER
    <ProblemItem />             // SERVER
  </ProblemGrid>
</SectionWrapper>
```

**Why this matters:** Index page has 12 sections. If every section is a Client Component, the entire page hydrates (~50KB+ JS). With this boundary strategy, only HeroSection, StatsSection, FAQSection, and ContactForm are client -- the other 8 sections ship zero JS.

---

## Form Handling: Server Actions vs Current fetch()

### Current Pattern (vanilla JS to Directus)
```javascript
fetch('https://api.medicusunion.kz/items/consultation_requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

### Target Pattern (Next.js Server Actions to PostgreSQL)

**Why Server Actions over API Routes:**
1. No separate API endpoint file to maintain -- action lives in `app/actions/`
2. Progressive enhancement -- form works even without JavaScript (HTML form post)
3. Spam validation moves entirely server-side (cannot be inspected/bypassed by bots)
4. Type safety end-to-end with TypeScript + Zod schema
5. `useActionState` (React 19) provides built-in pending and error state management
6. No CORS configuration needed -- same-origin by definition

**Recommended implementation:**

```typescript
// app/actions/submit-consultation.ts
'use server'

import { z } from 'zod'

const consultationSchema = z.object({
  name: z.string().min(2, 'Укажите ваше имя'),
  phone: z.string().regex(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Укажите номер телефона'),
  interest: z.enum(['consultation', 'treatment', 'checkup', 'not-sure'], {
    errorMap: () => ({ message: 'Выберите вариант' }),
  }),
  description: z.string().optional(),
})

type FormState = {
  success?: boolean
  errors?: Record<string, string[]>
  message?: string
} | null

export async function submitConsultation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Server-side honeypot check (invisible to client)
  if (formData.get('website')) {
    return { success: true } // fake success to not alert bots
  }

  // 2. Server-side timing check (cookie or hidden timestamp field)
  // Bot submitted faster than 3 seconds = spam

  // 3. Validate with Zod
  const parsed = consultationSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    interest: formData.get('interest'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  // 4. Insert into PostgreSQL directly
  try {
    await db.insert(consultationRequests).values({
      ...parsed.data,
      phone: parsed.data.phone.replace(/\D/g, ''), // store digits only
      status: 'new',
    })
    return { success: true }
  } catch (error) {
    return {
      message: 'Не удалось отправить заявку. Позвоните нам: +7 701 532 24 78',
    }
  }
}
```

```typescript
// components/forms/contact-form.tsx
'use client'

import { useActionState } from 'react'
import { submitConsultation } from '@/app/actions/submit-consultation'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitConsultation, null)

  if (state?.success) {
    return <SuccessOverlay />
  }

  return (
    <form action={formAction}>
      {/* Name input with client-side blur validation for UX */}
      {/* Phone input with mask */}
      {/* Interest select */}
      {/* Description textarea */}
      {/* Honeypot (hidden) */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Отправка...' : 'Отправить заявку'}
      </button>
      {state?.message && <ErrorMessage>{state.message}</ErrorMessage>}
    </form>
  )
}
```

### Form Validation Strategy

| Layer | Where | Library | Purpose |
|-------|-------|---------|---------|
| Field-level blur validation | Client | Custom logic or react-hook-form | Immediate UX feedback (blur-first, like current implementation) |
| Phone format masking | Client | `@react-input/mask` or custom hook | Input mask enforcement (+7 XXX XXX-XX-XX) |
| Schema validation | Server Action | Zod | Security, canonical validation, type safety |
| Honeypot check | Server Action | Custom | Field named "website" must be empty |
| Timing check | Server Action | Hidden timestamp or cookie | Submissions < 3 seconds after page load = spam |
| Return errors to client | Server -> Client | `useActionState` return value | Field-level errors displayed below inputs |

### Form Reuse Across Pages

The form appears on 5 of 7 pages. Each instance has slightly different fields (online-consultations has specialization dropdown, checkup has program dropdown, index has interest dropdown). The recommended pattern:

```
<ContactForm variant="index" />       // interest: consultation/treatment/checkup/not-sure
<ContactForm variant="consultations" /> // specialization: oncology/cardiology/...
<ContactForm variant="checkup" />      // program: korea-basic/korea-premium/turkey-basic/...
<ContactForm variant="treatment" />    // same as index
<ContactForm variant="contacts" />     // interest + additional fields
```

One Server Action with a discriminated union schema. One form component with conditional field rendering based on `variant` prop.

---

## Feature Dependencies

```
Header -> MobileMenu (toggle via shared state or context)
Header -> ThemeToggle (dark mode switch in header actions)
Layout -> RefractionProbe (sets data-refract on <html>, needed before glass renders)
Layout -> SvgRefractionDefs (SVG filter defs must be in DOM before glass elements)
Layout -> ThemeProvider (next-themes wrapper, must wrap all content)

ContactForm -> PhoneInput (mask component)
ContactForm -> Server Action (submission handler)
ContactForm -> Zod schema (validation)
ContactForm -> useActionState (pending/error state)

HeroSection -> Framer Motion (staggered entrance)
StatsSection -> Framer Motion (whileInView counter animation)
AnimateOnScroll -> Framer Motion (whileInView wrapper for any section)
FAQSection -> shadcn/ui Accordion (Radix primitives)

GlassSpecular -> All liquid-* CSS classes (wraps any glass element)
All Glass Components -> Tailwind config (liquid-* CSS custom properties in @layer)
All Glass Components -> Squircle CSS (mask-image SVG paths)
Dark Mode -> next-themes (ThemeProvider)
Dark Mode -> Tailwind `darkMode: 'class'` (current .dark class strategy)
Dark Mode -> All liquid-* dark token overrides in CSS
```

---

## MVP Recommendation (Migration Priority)

### Phase 1 -- Foundation (must work before anything else)
1. Next.js project scaffolding with App Router
2. `app/layout.tsx` with `<html>`, `<ThemeProvider>`, font loading (next/font), metadata
3. Tailwind CSS config with all liquid-* custom properties, section-tint tokens, squircle masks
4. All 5 liquid-* material CSS classes ported into Tailwind `@layer components`
5. Squircle CSS classes (SVG mask + `@supports corner-shape` progressive enhancement)
6. Dark mode via next-themes (class strategy, cookie-based, suppressHydrationWarning)
7. SvgRefractionDefs component (hidden SVG filter definitions)

### Phase 2 -- Pages with static content
8. All 7 pages with section content as Server Components
9. `generateMetadata()` for each page (title, description, OG, canonical)
10. JSON-LD structured data in layout or per-page
11. `next/image` for all images (WebP with width/height, lazy loading)
12. `next/font` for Inter + Manrope variable (self-hosted WOFF2)
13. Header (CLIENT) + Footer (SERVER) + StickyMobileCTA (SERVER)

### Phase 3 -- Client interactivity
14. ContactForm with Server Action + Zod + useActionState
15. PhoneInput mask component
16. FAQ accordion via shadcn/ui Accordion
17. Header scroll detection + mobile menu toggle
18. Theme toggle in header

### Phase 4 -- Animations and polish
19. Framer Motion scroll-reveal via AnimateOnScroll wrapper
20. Hero staggered entrance animation
21. Animated counter component for stats sections
22. Specular mouse tracking (GlassSpecular) -- desktop only
23. Refraction probe (useEffect in layout)
24. Staggered card grid animations

### Defer to post-migration
- **Page transition animations:** Complex with App Router layout system. Requires `AnimatePresence` wrapping `template.tsx` and exit animations on route change. Multiple open Next.js GitHub issues (e.g., #49279) about shared layout animation bugs. Ship without, add later when patterns stabilize.
- **Glass budget enforcement:** Currently disabled in production. React's reconciliation cycle makes IntersectionObserver-based budgeting less predictable. Re-evaluate after measuring real GPU performance.
- **Prefetch on idle:** Next.js `<Link>` already prefetches on viewport intersection. Remove custom `requestIdleCallback` prefetcher.

---

## Complexity Assessment for Roadmap

| Feature | Migration Complexity | Risk | Notes |
|---------|---------------------|------|-------|
| Liquid Glass CSS (all 5 materials) | Low | Low | CSS custom properties + classes port 1:1 into Tailwind @layer |
| Squircle masks | Low | Low | CSS mask-image is framework-agnostic; `@squircle-js/react` for PE is optional |
| Dark mode | Medium | Medium | Selector changes from `.dark` (already matching) + next-themes integration; must avoid FOUC with cookie strategy |
| Form + Server Action | Medium | Low | Well-documented Next.js 15 pattern; Zod schema replaces ad-hoc validation |
| Specular parallax | Medium | Low | Simple `onMouseMove` -> CSS custom properties; needs `(pointer: fine)` guard |
| SVG refraction filters | Medium | Medium | SVG `<defs>` must be in DOM before any glass element renders; place in layout.tsx as early child |
| Scroll-reveal animations | Low | Low | Framer Motion `whileInView` is simpler than current IntersectionObserver + Motion CDN |
| SPA router removal | None | None | Delete router.js; App Router replaces it entirely |
| Page transitions | High | High | `AnimatePresence` + Next.js App Router is notoriously tricky; defer |
| Content parity (7 pages x 12 sections) | High (volume) | Low (per-item risk) | Tedious but straightforward; biggest time investment of the migration |
| SEO metadata migration | Low | Low | `generateMetadata()` is cleaner than manual `<meta>` tags in each HTML file |
| Animated counters | Low | Low | Framer Motion `animate` + `whileInView` or `useMotionValue` |
| Phone input mask | Low | Low | `@react-input/mask` with `+7 (___) ___-__-__` pattern; one component reused across all forms |
| lucide-react icons | Low | Low | Same icon set already used via inline SVG; tree-shakeable imports |
| next/image optimization | Low | Low | Replace `<img>` with `<Image>` for automatic WebP/AVIF, srcset, lazy loading |
| next/font self-hosting | Low | Low | Replace `<link rel="preload">` with next/font Inter/Manrope; automatic self-hosting, zero CLS |

---

## Sources

### Official Documentation (HIGH confidence)
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- boundary rules, when to use each
- [Next.js: Forms Guide with Server Actions](https://nextjs.org/docs/app/guides/forms) -- form action pattern, useActionState
- [Next.js: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- per-page SEO metadata
- [next-themes](https://github.com/pacocoursey/next-themes) -- dark mode without flash, cookie-based persistence

### Libraries (HIGH confidence)
- [shadcn/ui](https://ui.shadcn.com/) -- Accordion, Input, Select, Button primitives
- [motion/react](https://motion.dev) -- current Framer Motion package name, `whileInView`, scroll animations
- [@react-input/mask](https://www.npmjs.com/package/@react-input/mask) -- React input masking
- [@squircle-js/react](https://www.npmjs.com/package/@squircle-js/react) -- squircle component for progressive enhancement
- [lucide-react](https://lucide.dev) -- same icon set currently used as inline SVG

### Community / Guides (MEDIUM confidence)
- [Framer Motion + Next.js App Router Guide](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers.html) -- client component setup, `whileInView` patterns
- [glasscn-ui](https://github.com/itsjavi/glasscn-ui) -- glassmorphism on shadcn/ui reference (validates approach, not a dependency)
- [CSS corner-shape (Smashing)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/) -- progressive enhancement path for squircles
- [Next.js Server Actions Guide (MakerKit)](https://makerkit.dev/blog/tutorials/nextjs-server-actions) -- complete form handling patterns

### Unverified / Needs Testing
- AnimatePresence with App Router layout -- [GitHub issue #49279](https://github.com/vercel/next.js/issues/49279) documents ongoing bugs; page transitions remain risky
- `corner-shape: squircle` browser support -- Chrome 139+ only as of 2026-04; not production-ready for cross-browser
- Performance of backdrop-filter on budget Android with React re-renders -- needs real-device benchmarking post-migration
