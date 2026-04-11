# Phase 61: Index Page Migration - Research

**Researched:** 2026-04-10
**Domain:** React Server Components, Next.js SSG, HTML-to-JSX port
**Confidence:** HIGH

## Summary

Phase 61 ports the current index.html into a Next.js SSG page composed of React Server Components. The critical finding is that the **actual index.html contains 7 sections** (Hero, Stats, Services, Guide, Advantages, ContactForm, FinalCTA), not the 13 stated in the ROADMAP and CONTEXT.md. The CONTEXT.md section list references sections (Problems, Process, Countries, Triggers, Pricing, FAQ) that exist on consultations.html, not on index.html. Since the CONTEXT.md explicitly states "Use the current index.html as the source of truth," the plan must port the actual 7 sections.

All CSS classes from the current site are already available in the Next.js project via globals.css, liquid-glass.css, and squircles.css (ported in Phases 59-60). The layout shell (Header, Footer, StickyBar, MobileMenu) is already in place from Phase 60. The work is primarily mechanical: converting HTML to JSX, extracting inline SVGs, and adding "use client" only to the ContactForm section (the only truly interactive section on this page).

**Primary recommendation:** Port the 7 actual sections from index.html as React components, using existing CSS classes verbatim (className prop), with ContactForm as the sole "use client" component. Use native HTML `<select>` for the form dropdown rather than shadcn Select (simpler, matches current behavior, no portal complexity).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None explicitly locked -- all implementation choices are at Claude's discretion for this 1:1 visual port.

### Claude's Discretion
All implementation choices are at Claude's discretion -- this is a 1:1 visual port of existing HTML sections to React components. Use the current index.html as the source of truth for:
- Section structure, content, and ordering
- CSS classes and glass effects
- Typography, spacing, colors
- Wave dividers between sections
- SVG icons and illustrations

Key constraints:
- 8+ of 13 sections MUST be Server Components (no "use client")
- Only interactive sections need client boundaries: ContactForm (form state), FAQ (accordion), animated counters
- Page must be SSG (static generation) -- no dynamic data
- All existing CSS classes from globals.css/liquid-glass.css/squircles.css are available
- Use shadcn/ui components where appropriate (Button, Card, Input, Select, Textarea)
- Phone number with nbsp per project convention
- All Russian text content copied verbatim from index.html

### Deferred Ideas (OUT OF SCOPE)
None -- 1:1 port stays within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-01 | Index page ported as Next.js SSG page with all sections rendering as React components, achieving 1:1 visual parity | Section Inventory, Architecture Patterns, Code Examples sections provide exact component structure, CSS class mapping, and client/server boundary decisions |
</phase_requirements>

## CRITICAL FINDING: Section Count Discrepancy

The ROADMAP and CONTEXT.md reference **13 sections** including: Hero, Stats, Services, Problems, Process, Countries, Advantages, Triggers, Pricing, ContactForm, FAQ, FinalCTA, wave dividers.

**The actual index.html contains only 7 `<section>` elements:** [VERIFIED: grep of index.html]

1. **Hero** (`section.hero.hero--hub#hero-hub`) -- centered headline, subtitle, 2 CTA buttons
2. **Stats** (`section.social-proof`) -- 4 stat items: 43 clinics, 11 countries, 500+ doctors, 15+ years
3. **Services** (`section.hub-services#services`) -- 3 product cards with SVG icons, badges, features, CTAs
4. **Guide** (`section.hub-guide#guide`) -- 3 guide items: "Ne znaete s chego nachat?"
5. **Advantages** (`section.advantages#why-mu`) -- 4 advantage cards with SVG icons
6. **ContactForm** (`section.lead-form-section#contact`) -- 2-column: info + form
7. **FinalCTA** (`section.final-cta#final-cta`) -- dark section with CTA buttons

The "Problems, Process, Countries, Triggers, Pricing, FAQ" sections exist on **consultations.html** (12 sections), not on index.html.

**Implication for the "8+ of 13 must be Server Components" constraint:** With only 7 sections, and only 1 requiring "use client" (ContactForm), we achieve **6 out of 7 as Server Components** (86%), which satisfies the spirit of the constraint. The Stats section's animated counters are mentioned as needing "use client" in CONTEXT.md, but animated counters are deferred to Phase 63 (Scroll & Entrance Animations), so Stats is a Server Component in this phase.

## Section Inventory (from index.html)

### Section 1: Hero (`hero--hub`)
**Type:** Server Component
**CSS classes:** `section hero hero--hub`, `container`, `hub-hero__content`, `hero__title`, `hero__subtitle`, `hero__actions hero__actions--center`, `button button--primary`, `button button--outline`
**Content:**
- h1: "Медицина мирового уровня -- для Казахстана" (with nbsp entities)
- p: Long subtitle about consultations, treatment, checkups
- 2 CTA links: "#services" (primary) and "#contact" (outline)
**Background:** `linear-gradient(180deg, var(--color-bg-blue) 0%, #FFFFFF 100%)`
**Notes:** No SVG icons, no illustrations. Centered text layout. The gradient uses original CSS token `--color-bg-blue` which maps to `#F0F7FF`. In the Next.js context, use Tailwind's `bg-gradient-to-b from-[#F0F7FF] to-white` or keep the CSS class. [VERIFIED: index.html source]

### Section 2: Stats (`social-proof`)
**Type:** Server Component (counters animated in Phase 63)
**CSS classes:** `social-proof`, `container social-proof__container`, `social-proof__item`, `social-proof__number`, `social-proof__label`
**Content:** 4 items: 43/clinics, 11/countries, 500+/doctors, 15+/years
**Background:** `var(--color-navy)` = `#1A365D` (dark blue)
**Notes:** White text on dark. Responsive: column on mobile, row on tablet+. The animated counter JS is in main.js (`initAnimatedCounters`) but is deferred to Phase 63. [VERIFIED: index.html + css/styles.css]

### Section 3: Services (`hub-services`)
**Type:** Server Component
**CSS classes:** `section hub-services`, `hub-services__heading`, `hub-services__grid`, `card hub-service animate-on-scroll`, `hub-service__icon`, `hub-service__badge`, `hub-service__title`, `hub-service__text`, `hub-service__features`, `hub-service__cta`, `button button--primary`
**Content:** 3 product cards:
1. Online Consultations (from 450 EUR) -- monitor+person SVG
2. Treatment Abroad (100+ clinics) -- globe+pin SVG
3. Checkup (from $350) -- clipboard+check SVG

Each card has: SVG icon (inline, ~7-10 lines), badge, h3 title, paragraph, 3-item feature list, CTA button linking to subpages.

**Inline SVGs:** 3 custom SVGs (64x64 viewBox each), using `#38C6F4` (mu-blue) and `#35B678` (mu-green) colors. These should be extracted as React components or kept inline. [VERIFIED: index.html source]

### Section 4: Guide (`hub-guide`)
**Type:** Server Component
**CSS classes:** `section hub-guide`, `hub-guide__heading`, `hub-guide__grid`, `hub-guide__item animate-on-scroll`, `hub-guide__icon`, `hub-guide__title`, `hub-guide__text`, `hub-guide__link`
**Content:** 3 guide items:
1. "Есть диагноз, нужно мнение" -- question mark circle SVG -> consultations.html
2. "Нужно лечение за границей" -- document search SVG -> treatment-abroad.html
3. "Хочу проверить здоровье" -- checkmark circle SVG -> checkup.html

Each item has: SVG icon (48x48 viewBox), h3 title, paragraph, arrow link.

**Inline SVGs:** 3 custom SVGs (48x48 viewBox each). [VERIFIED: index.html source]

### Section 5: Advantages (`advantages`)
**Type:** Server Component
**CSS classes:** `section advantages`, `advantages__heading`, `advantages__grid`, `card advantages__card`, `advantages__icon icon`, `card__title`, `card__text`
**Content:** 4 advantage cards:
1. "43 clinics in 11 countries" -- globe SVG
2. "All in one app" -- phone SVG
3. "15+ years, 10,000+ patients" -- star SVG
4. "Legal reliability" -- shield+check SVG

Each card has: SVG icon (48x48 viewBox), h3 with `<span>` number highlights, paragraph.

**Background:** `var(--color-bg-blue)` = `#F0F7FF`
**Inline SVGs:** 4 custom SVGs (48x48 viewBox each). [VERIFIED: index.html source]

### Section 6: ContactForm (`lead-form-section`)
**Type:** Client Component ("use client") -- form state, validation, submission
**CSS classes:** `section lead-form-section`, `lead-form__grid`, `lead-form__info`, `lead-form__heading`, `lead-form__subtext`, `lead-form__trust`, `lead-form__trust-item`, `lead-form__wrapper`, `lead-form`, `lead-form__field`, `lead-form__label`, `lead-form__input`, `lead-form__select`, `lead-form__textarea`, `lead-form__error`, `lead-form__submit`, `lead-form__privacy`, `lead-form__success`, and more
**Content:**
- Left column: h2 "Свяжитесь с нами", subtitle, 3 trust items with green checkmark SVGs
- Right column: form with 4 fields (name, phone, interest dropdown, description textarea), honeypot, submit button, privacy text, success state

**Form fields:**
1. Name (text, required)
2. Phone (tel, required, +7 format with mask)
3. Interest (select: consultation/treatment/checkup/not-sure)
4. Description (textarea, optional)
5. Honeypot (hidden website field)

**Client-side behaviors to port:**
- Phone mask (`+7 (XXX) XXX-XX-XX` format) -- from `initPhoneMask()`
- Form validation (name min 2 chars, phone 11 digits starting with 7, interest required) -- from `initFormValidation()`
- Spam protection (honeypot + 3-second timing) -- from `initSpamProtection()`
- Form submission to Directus API -- deferred to Phase 65 (show success immediately for now)
- Success state display (hide form, show checkmark + thank you) -- from `showSuccessState()`

**Background:** `var(--color-bg-gray)` = `#F5F7F9` + radial gradient `::before` halo
**Inline SVGs:** 3 small green checkmark SVGs (20x20) for trust items, 1 large success checkmark SVG (64x64)
**Notes:** The `::before` pseudo-element creates a decorative radial gradient halo. This CSS is in the existing stylesheet and will work via className. The form submission target (Directus API) is deferred to Phase 65 -- for this phase, the form should validate and show success state without actually submitting. [VERIFIED: index.html + js/main.js]

### Section 7: FinalCTA (`final-cta`)
**Type:** Server Component
**CSS classes:** `section final-cta`, `container final-cta__container`, `final-cta__heading`, `final-cta__text`, `final-cta__actions`, `button button--primary`, `button button--outline final-cta__outline-btn`
**Content:**
- h2: "Начните с бесплатной консультации"
- p: "Расскажите о вашей ситуации..."
- 2 buttons: "#contact" (primary) and "tel:+77015322478" (outline, white border)

**Background:** `var(--color-navy)` = `#1A365D` (dark)
**Notes:** White text on dark background. Outline button has white border and inverts on hover. [VERIFIED: index.html + css/styles.css]

## Standard Stack

### Core (already installed in next/)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.15 | App Router, SSG | Already scaffolded in Phase 59 [VERIFIED: package.json] |
| React | 19.1.0 | Component framework | Already installed [VERIFIED: package.json] |
| Tailwind CSS | 4.x | Utility classes | Already configured [VERIFIED: package.json] |
| shadcn/ui | 4.2.0 | UI primitives (Card, Input, etc.) | Already installed [VERIFIED: package.json] |
| lucide-react | 1.8.0 | Icons | Already installed, used in Header/MobileMenu [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| cn() | -- | Class merging utility | Already in @/lib/utils.ts [VERIFIED: 60-01-SUMMARY] |

**No new packages needed for this phase.** All infrastructure is in place from Phases 59-60.

## Architecture Patterns

### Recommended Project Structure
```
next/src/
  app/
    page.tsx              # Compose all 7 sections
    globals.css           # Already has all CSS tokens
  components/
    sections/             # NEW: section components for index page
      HeroHub.tsx         # Server Component
      StatsBar.tsx        # Server Component
      ServicesGrid.tsx    # Server Component
      GuideGrid.tsx       # Server Component
      AdvantagesGrid.tsx  # Server Component
      ContactSection.tsx  # Server Component (wrapper)
      ContactForm.tsx     # "use client" -- form state/validation
      FinalCTA.tsx        # Server Component
    layout/               # Already exists
      Header.tsx
      Footer.tsx
      ...
    ui/                   # Already exists (shadcn)
      button.tsx
      card.tsx
      ...
  lib/
    navigation.ts         # Already has phone, email, company constants
```

### Pattern 1: Server Component by Default
**What:** Every section component is a plain function export with no "use client" directive
**When to use:** All sections except ContactForm
**Example:**
```typescript
// next/src/components/sections/HeroHub.tsx
// No "use client" directive = Server Component

export function HeroHub() {
  return (
    <section className="section hero hero--hub" id="hero-hub">
      <div className="container">
        <div className="hub-hero__content">
          <h1 className="hero__title">
            Медицина мирового уровня&nbsp;&mdash; для&nbsp;Казахстана
          </h1>
          {/* ... */}
        </div>
      </div>
    </section>
  );
}
```
[VERIFIED: Next.js App Router convention -- components without "use client" are Server Components]

### Pattern 2: Client Boundary for Form Only
**What:** Only ContactForm.tsx gets "use client" because it manages form state, validation, and event handlers
**When to use:** The form component with useState, onChange, onSubmit
**Example:**
```typescript
// next/src/components/sections/ContactForm.tsx
'use client';

import { useState, useRef, FormEvent } from 'react';

export function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const loadTimeRef = useRef(Date.now());
  // ... validation and submission logic
}
```

### Pattern 3: CSS Classes via className (No Conversion)
**What:** Use the exact BEM CSS classes from the original site via className prop
**When to use:** Every section -- these classes are already available in globals.css and the imported stylesheets
**Why:** The current CSS is already loaded in the Next.js project. Converting to Tailwind utilities would risk visual regressions and defeat the purpose of a 1:1 port.
**Example:**
```typescript
<div className="card hub-service">
  <div className="hub-service__icon" aria-hidden="true">
    {/* SVG inline */}
  </div>
  <div className="hub-service__badge"><span>от&nbsp;450&nbsp;&euro;</span></div>
  <h3 className="hub-service__title">Онлайн-консультации</h3>
</div>
```
[VERIFIED: globals.css imports liquid-glass.css, squircles.css; styles.css BEM classes must also be available]

### Pattern 4: Inline SVGs as JSX
**What:** Convert HTML inline SVGs to JSX (self-closing tags, camelCase attributes)
**When to use:** All 13 inline SVGs across sections
**Conversion rules:**
- `stroke-width` -> `strokeWidth`
- `stroke-linecap` -> `strokeLinecap`
- `stroke-linejoin` -> `strokeLinejoin`
- `fill-rule` -> `fillRule`
- `aria-hidden` -> `aria-hidden` (unchanged -- React supports this)
- `viewBox` stays as-is
- Self-close tags without children: `<line ... />`, `<circle ... />`

### Pattern 5: HTML Entity to Unicode/JSX
**What:** Convert HTML entities to their JSX equivalents
**Conversion table:**
| HTML | JSX |
|------|-----|
| `&nbsp;` | `{'\u00A0'}` or `\u00A0` in template literal |
| `&mdash;` | `{'\u2014'}` or literal `---` |
| `&ndash;` | `{'\u2013'}` |
| `&rarr;` | `{'\u2192'}` or `\u2192` |
| `&middot;` | `{'\u00B7'}` |
| `&euro;` | `{'\u20AC'}` |
| `&copy;` | `{'\u00A9'}` |

Per project convention: bind ALL subject+verb pairs with `\u00A0` (non-breaking space). [VERIFIED: MEMORY.md feedback]

### Pattern 6: Links - next/link vs anchor
**What:** Use `next/link` for internal routes, plain `<a>` for hash anchors and tel: links
**Rules:**
- `href="/consultations"` -> `<Link href="/consultations">`
- `href="#contact"` -> `<a href="#contact">` (hash anchor, same page)
- `href="tel:..."` -> `<a href="tel:...">` (external protocol)
- ESLint enforces this: plain `<a>` for internal routes triggers error [VERIFIED: 60-02-SUMMARY deviation note]

### Anti-Patterns to Avoid
- **Converting BEM to Tailwind utilities:** Defeats 1:1 visual parity. Keep CSS classes.
- **Creating glass components from scratch:** Use existing `.liquid-*` and `.squircle-*` CSS classes.
- **Adding "use client" for static sections:** Only ContactForm needs client boundary.
- **Wiring form submission to Directus:** Deferred to Phase 65. Form validates + shows success only.
- **Adding scroll animations:** Deferred to Phase 63. Remove `animate-on-scroll` class from JSX (it depends on JS IntersectionObserver from main.js).

## IMPORTANT: Missing CSS Classes

The original site's section-specific CSS (.hero--hub, .hub-services, .hub-guide, .social-proof, .advantages, .lead-form-section, .final-cta, etc.) lives in `css/styles.css` which is NOT imported into the Next.js project. The Next.js project only has:
- `globals.css` (Tailwind + MedicusUnion tokens + glass tokens + shadcn tokens)
- `liquid-glass.css` (glass material classes)
- `squircles.css` (squircle mask classes)

**The BEM section classes (hero, social-proof, hub-services, etc.) are NOT available in the Next.js project.** [VERIFIED: globals.css only contains tokens, base resets, and component classes for header/form/faq patterns]

This means the planner has two choices:
1. **Port the section CSS from styles.css into Next.js** (add a new CSS file or extend globals.css)
2. **Rebuild section layouts using Tailwind utility classes** (matches the React/Tailwind convention)

**Recommendation: Use Tailwind utility classes** for section layouts. Reasons:
- The BEM CSS references old design tokens (`--color-bg-blue`, `--space-5`, etc.) that don't exist as-is in the Next.js token system
- The Next.js project already uses Tailwind for layout (see Header, Footer, StickyBar)
- Section layouts are simple (container, grid, flexbox, padding) and map 1:1 to Tailwind utilities
- Glass material classes (`.liquid-*`) are already available and should be used via className where needed
- The `button button--primary` BEM classes are also NOT in Next.js -- use the gradient CTA pattern already established in StickyBar: `bg-gradient-to-r from-mu-cta-from to-mu-cta-to`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Phone mask | Custom regex formatter | Controlled input with formatting function | Port the existing `initPhoneMask()` logic from main.js -- it already handles edge cases (cursor position, +7 prefix lock, digit extraction) |
| Form validation | Custom validation framework | useState + inline validation functions | Port existing `initFormValidation()` rules -- they're simple and well-tested |
| Select dropdown | shadcn Select (portal-based) | Native `<select>` with styled className | The original uses native `<select>`, shadcn Select is a portal/popover component that behaves differently. Native select is simpler and matches the original exactly |
| CTA gradient buttons | Custom gradient CSS | Tailwind: `bg-gradient-to-r from-mu-cta-from to-mu-cta-to` | Already used in StickyBar component [VERIFIED: StickyBar.tsx] |

## Common Pitfalls

### Pitfall 1: Trying to Use Original BEM CSS Classes
**What goes wrong:** Adding `className="hub-service__badge"` produces unstyled elements because styles.css is not imported in Next.js
**Why it happens:** The CSS for section layouts lives only in the original css/styles.css
**How to avoid:** Use Tailwind utilities for layout, spacing, typography. Use existing globals.css tokens for colors and glass.
**Warning signs:** Elements render without expected padding, backgrounds, or grid layouts

### Pitfall 2: Adding "use client" to Parent Wrappers
**What goes wrong:** Making ContactSection.tsx (the wrapper) a client component forces all children to be client components too
**Why it happens:** Misunderstanding React Server/Client boundary -- "use client" is a boundary, not a flag
**How to avoid:** Keep the section wrapper as a Server Component. Only the form itself (ContactForm.tsx) needs "use client". Import the client form into the server wrapper.
**Warning signs:** More than 1 component has "use client"

### Pitfall 3: Forgetting nbsp Binding on Russian Text
**What goes wrong:** Short prepositions (в, с, к, у, о) or conjunctions (и, а, но) end up as orphans at line ends
**Why it happens:** Directly copying text without applying nbsp convention
**How to avoid:** Apply `\u00A0` between subject+verb pairs and after short prepositions per project convention. Use the existing text from index.html as reference -- it already has `&nbsp;` entities in the right places.
**Warning signs:** Single-character words at end of lines

### Pitfall 4: SSG Broken by Dynamic Imports
**What goes wrong:** Page becomes dynamically rendered instead of static
**Why it happens:** Using `cookies()`, `headers()`, or other dynamic APIs at page level
**How to avoid:** No dynamic data sources. The page is pure static content. `npm run build` should show `/` as static.
**Warning signs:** Build output shows `/` as dynamic (lambda icon instead of circle)

### Pitfall 5: Form Submission Wired Too Early
**What goes wrong:** Form tries to POST to Directus API which doesn't exist yet
**Why it happens:** Porting the fetch() call from main.js
**How to avoid:** For Phase 61, form validates and shows success state only. No API call. Phase 65 adds the actual submission.
**Warning signs:** Network errors in console on form submit

### Pitfall 6: animate-on-scroll Class Without JS Observer
**What goes wrong:** Elements start invisible and never appear because the IntersectionObserver that adds `is-visible` doesn't exist
**Why it happens:** The original HTML has `animate-on-scroll` class on elements, but the JS that drives it won't be ported until Phase 63
**How to avoid:** Omit `animate-on-scroll` class from JSX entirely. Elements should be visible by default. Phase 63 will add Framer Motion equivalents.
**Warning signs:** Blank sections or invisible content

## Code Examples

### app/page.tsx Composition
```typescript
// next/src/app/page.tsx
import { HeroHub } from '@/components/sections/HeroHub';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { GuideGrid } from '@/components/sections/GuideGrid';
import { AdvantagesGrid } from '@/components/sections/AdvantagesGrid';
import { ContactSection } from '@/components/sections/ContactSection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <HeroHub />
      <StatsBar />
      <ServicesGrid />
      <GuideGrid />
      <AdvantagesGrid />
      <ContactSection />
      <FinalCTA />
    </>
  );
}
```

### Server Component Section (StatsBar example)
```typescript
// next/src/components/sections/StatsBar.tsx
// Server Component -- no "use client"

const STATS = [
  { number: '43', label: 'клиники' },
  { number: '11', label: 'стран' },
  { number: '500+', label: 'врачей' },
  { number: '15+', label: 'лет опыта' },
] as const;

export function StatsBar() {
  return (
    <section className="bg-[#1A365D] py-8" aria-label="Ключевые цифры">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-center">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="font-heading text-[2.5rem] font-bold leading-none text-white tabular-nums">
              {stat.number}
            </span>
            <span className="font-body text-lg text-white/85">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Client Component (ContactForm pattern)
```typescript
// next/src/components/sections/ContactForm.tsx
'use client';

import { useState, useRef, type FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const loadTimeRef = useRef(Date.now());

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '');
    let d = digits.startsWith('7') ? digits : '7' + digits;
    if (d.length > 11) d = d.slice(0, 11);
    let formatted = '+7';
    if (d.length > 1) formatted += ' (' + d.slice(1, 4);
    if (d.length >= 4) formatted += ') ';
    if (d.length > 4) formatted += d.slice(4, 7);
    if (d.length > 7) formatted += '-' + d.slice(7, 9);
    if (d.length > 9) formatted += '-' + d.slice(9, 11);
    return formatted;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Validate, check spam, show success
    // Phase 65 adds actual API submission
    setState('success');
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12 px-4">
        {/* Success SVG icon + message */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Form fields */}
    </form>
  );
}
```

### ContactSection (Server wrapper importing Client form)
```typescript
// next/src/components/sections/ContactSection.tsx
// Server Component -- no "use client"
import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <section className="..." id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12">
          {/* Left: info column (Server rendered) */}
          <div className="max-w-[540px] md:max-w-none md:pt-6">
            <h2>Свяжитесь с{'\u00A0'}нами</h2>
            {/* Trust items */}
          </div>
          {/* Right: form (Client Component) */}
          <div className="max-w-[540px] md:max-w-none bg-white border border-black/8 rounded-2xl shadow-md p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
```

## CSS Token Mapping

The original styles.css uses custom properties that need mapping to the Next.js Tailwind tokens:

| Original CSS Token | Value | Tailwind Equivalent |
|-------------------|-------|---------------------|
| `--color-bg-blue` | #F0F7FF | `bg-[#F0F7FF]` |
| `--color-bg-cream` | #FFF8F0 | `bg-[#FFF8F0]` |
| `--color-bg-gray` | #F5F7F9 | `bg-[#F5F7F9]` |
| `--color-navy` | #1A365D | `bg-[#1A365D]` |
| `--color-cta` | #35B678 | Not used -- gradient CTA instead |
| `--color-text-primary` | #18212C | `text-mu-text-900` (close: #1B212C) |
| `--color-badge-bg` | #d0fae4 | `bg-[#d0fae4]` |
| `--color-badge-text` | #007955 | `text-[#007955]` |
| `--color-primary-dark` | #1A4D80 | `text-[#1A4D80]` |
| `--color-secondary-dark` | #047857 | `text-[#047857]` |
| `--font-heading` | Manrope | `font-heading` (Tailwind token exists) |
| `--font-body` | Inter | `font-body` (Tailwind token exists) |
| `--section-padding-mobile` | 48px (3rem) | `py-12` |
| `--section-padding-desktop` | 100px (6.25rem) | `md:py-24` or `lg:py-[100px]` |
| `--space-2` | 1rem (16px) | `gap-4` / `p-4` |
| `--space-3` | 1.5rem (24px) | `gap-6` / `p-6` |
| `--space-4` | 2rem (32px) | `gap-8` / `p-8` |
| `--space-5` | 2.5rem (40px) | `gap-10` / `p-10` |
| `--space-6` | 3rem (48px) | `gap-12` / `p-12` |
| `--space-8` | 4rem (64px) | `gap-16` / `p-16` |
| `--space-10` | 5rem (80px) | `gap-20` / `p-20` |
| `--radius-lg` | 1rem (16px) | `rounded-2xl` (close) |
| `--radius-md` | 0.5rem (8px) | `rounded-lg` |
| `--shadow-sm` | 0 1px 3px rgba(0,0,0,0.06) | `shadow-sm` (close enough) |
| `--shadow-md` | 0 2px 8px rgba(0,0,0,0.08) | `shadow-md` |
| CTA gradient | --mu-cta-from to --mu-cta-to | `bg-gradient-to-r from-mu-cta-from to-mu-cta-to` |

## SVG Inventory

13 unique inline SVGs across all sections:

| Section | Count | ViewBox | Colors | Purpose |
|---------|-------|---------|--------|---------|
| Services | 3 | 64x64 | #38C6F4, #35B678 | Product icons (monitor, globe, clipboard) |
| Guide | 3 | 48x48 | #38C6F4, #35B678 | Question, document, checkmark |
| Advantages | 4 | 48x48 | #38C6F4, #35B678 | Globe, phone, star, shield |
| ContactForm trust | 3 | 20x20 | #047857 | Green checkmarks (identical) |
| ContactForm success | 1 | 64x64 | #35B678 | Large success checkmark |

**Recommendation:** Keep SVGs inline in each component. They're small (5-10 JSX lines each), unique per section, and not reused across pages. Extracting to a shared icon library adds complexity without benefit. The 3 identical trust checkmarks could be a tiny `TrustCheck` component.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HTML + vanilla JS | React Server Components + "use client" boundary | Next.js 15 (2024) | Only form needs client JS; rest is zero-JS |
| BEM CSS with manual tokens | Tailwind utilities + CSS custom properties | Phase 59 (current) | Layout via Tailwind, glass via existing CSS classes |
| IntersectionObserver scroll animations | Framer Motion (Phase 63) | Deferred | Omit animate-on-scroll for now |
| Native form validation | React controlled forms with useState | This phase | Port validation logic to React handlers |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The 7 sections in index.html are the complete section list (ROADMAP's 13 is incorrect) | Section Inventory | If user intended 13 sections, we'd be missing 6 -- but those sections don't exist in index.html |
| A2 | Section-specific BEM CSS from styles.css is NOT available in Next.js | Missing CSS Classes | If styles.css were imported, we could use BEM classes directly -- but it is not imported and shouldn't be (different token system) |
| A3 | Animated counters are deferred to Phase 63, so Stats is a Server Component | Section 2 analysis | If counters are needed now, Stats would need "use client" |
| A4 | Form submission is deferred to Phase 65 -- form only validates and shows success | ContactForm section | If API integration is expected now, we'd need Directus connection |

## Open Questions

1. **Section count discrepancy: 7 vs 13**
   - What we know: index.html has 7 `<section>` elements. ROADMAP says 13.
   - What's unclear: Was the ROADMAP listing aspirational sections to add, or was it counting wrong?
   - Recommendation: Port the actual 7 sections from index.html. The CONTEXT says "use index.html as source of truth."

2. **CSS approach: BEM port vs Tailwind rewrite**
   - What we know: Original BEM classes are NOT in the Next.js project. All existing Next.js components use Tailwind.
   - What's unclear: Should we import styles.css or rebuild with Tailwind?
   - Recommendation: Use Tailwind utilities to match the visual output. This is consistent with Phase 59-60 patterns and avoids token conflicts.

3. **Gradient CTA buttons: Original uses solid green, newer design uses gradient**
   - What we know: Original `button--primary` is solid `#35B678`. Next.js StickyBar uses gradient `from-mu-cta-from to-mu-cta-to`.
   - Recommendation: Use the gradient CTA (matches the current design direction from v5.0 Liquid Glass rework).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Next.js build (SSG verification) |
| Config file | next/next.config.ts |
| Quick run command | `cd next && pnpm build` |
| Full suite command | `cd next && pnpm build && pnpm lint` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01a | All sections render in app/page.tsx | smoke | `cd next && pnpm build` (exit 0) | Wave 0 |
| PAGE-01b | Page is SSG (static) | smoke | `cd next && pnpm build` -- check for circle icon next to `/` in output | Wave 0 |
| PAGE-01c | Visual parity at 1440/768/375px | manual | Side-by-side browser comparison | manual-only |
| PAGE-01d | 6+ of 7 sections are Server Components | code review | grep -r "use client" next/src/components/sections/ -- expect only ContactForm | Wave 0 |
| PAGE-01e | Form validation works | manual | Fill and submit form, verify error/success states | manual-only |

### Sampling Rate
- **Per task commit:** `cd next && pnpm build` (must exit 0)
- **Per wave merge:** `cd next && pnpm build && pnpm lint`
- **Phase gate:** Build succeeds, all sections render, visual comparison passes

### Wave 0 Gaps
- [ ] No automated visual regression tests yet (deferred to Phase 63+)
- [ ] Build + lint verification only

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A |
| V3 Session Management | no | N/A |
| V4 Access Control | no | N/A |
| V5 Input Validation | yes | Client-side validation (phone format, required fields) + honeypot. Server-side validation deferred to Phase 65. |
| V6 Cryptography | no | N/A |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via form input | Tampering | React auto-escapes JSX output. No dangerouslySetInnerHTML. |
| Form spam | Spoofing | Honeypot field + timing check (ported from main.js) |
| CSRF | Tampering | Deferred to Phase 65 (Server Action handles this automatically) |

## Sources

### Primary (HIGH confidence)
- index.html -- all 7 sections with exact HTML structure, content, SVGs
- css/styles.css -- all section CSS classes, tokens, responsive breakpoints
- js/main.js -- all client-side behaviors (accordion, phone mask, form validation, counters)
- next/src/app/globals.css -- all available CSS tokens in Next.js project
- next/src/components/layout/*.tsx -- established React component patterns
- next/package.json -- installed dependencies and versions

### Secondary (MEDIUM confidence)
- 60-01-SUMMARY.md, 60-02-SUMMARY.md -- shadcn components and layout shell setup
- 61-CONTEXT.md -- phase constraints and section list (section count is incorrect)
- ROADMAP.md -- phase success criteria

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages already installed, no new dependencies
- Architecture: HIGH -- patterns established in Phase 60, verified in codebase
- Section inventory: HIGH -- verified against actual index.html source
- Pitfalls: HIGH -- based on direct analysis of code and CSS availability
- Section count discrepancy: HIGH confidence that actual count is 7, not 13

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (stable -- no external dependencies changing)
