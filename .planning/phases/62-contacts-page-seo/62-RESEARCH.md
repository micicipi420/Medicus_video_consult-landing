# Phase 62: Contacts Page & SEO - Research

**Researched:** 2026-04-11
**Domain:** Next.js page migration + Metadata API
**Confidence:** HIGH

## Summary

Phase 62 ports contacts.html to a Next.js SSG page at `/contacts` and adds SEO metadata to both `/` and `/contacts` via Next.js Metadata API. The contacts page has a distinct structure from the index page: a centered hero section with glass badge, a 2-column layout (coordinator info + contact form), and no FinalCTA section. The ContactForm component from Phase 61 is directly reusable since it already uses the same field set (name, phone, interest, description) and options (consultation/treatment/checkup/not-sure) as contacts.html.

The SEO metadata implementation uses Next.js static `metadata` export objects -- not `generateMetadata` -- because both pages have fixed, known-at-build-time metadata. The existing layout.tsx already has a basic metadata export that needs to be restructured: site-wide shared metadata moves to layout.tsx (with `metadataBase` and title template), while page-specific metadata (title, description, OG tags, canonical) lives in each page.tsx file.

**Primary recommendation:** Create `app/contacts/page.tsx` with 3 new components (ContactsHero, CoordinatorCard, ContactMethodGrid), reuse ContactForm, and add static `metadata` exports to both pages matching the exact production meta tags from index.html and contacts.html.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None -- all implementation choices are at Claude's discretion for this phase (1:1 port + SEO metadata).

### Claude's Discretion
- Reuse ContactForm component from Phase 61
- Reuse FinalCTA component from Phase 61
- Port coordinator info cards from contacts.html
- Extract meta tags from index.html and contacts.html for Next.js Metadata API
- Use Next.js generateMetadata or static metadata export
- Both pages must be SSG (static generation)

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-02 | contacts.html ported as Next.js page with SSG, form and coordinator cards render with glass effects | Full content extraction from contacts.html complete; glass CSS classes available in liquid-glass.css; ContactForm reusable from Phase 61 |
| PAGE-03 | SEO metadata (title, description, Open Graph) for both pages via Next.js Metadata API | All meta tags extracted from both HTML files; Metadata type shape verified from next package types; static export pattern documented |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.15 | App Router, Metadata API, SSG | Already installed [VERIFIED: next/package.json] |
| react | 19.1.0 | Component rendering | Already installed [VERIFIED: next/package.json] |
| tailwindcss | ^4 | Utility classes for styling | Already installed [VERIFIED: next/package.json] |
| lucide-react | ^1.8.0 | SVG icons | Already installed [VERIFIED: next/package.json] |

### No New Packages Required
This phase uses only existing dependencies. No `npm install` needed.

## Architecture Patterns

### Contacts Page Structure (from contacts.html analysis)

The contacts page has this distinct structure:

```
/contacts
  +-- ContactsHero (centered hero with glass badge + title)
  +-- ContactsMain (2-column grid)
       +-- Left: CoordinatorCard + ContactMethodGrid + TrustBadges
       +-- Right: ContactForm (reused from Phase 61)
```

**Key difference from index page:** The contacts page does NOT use the FinalCTA section. Despite CONTEXT.md mentioning reusing FinalCTA, the actual contacts.html has no FinalCTA section -- it ends after the contact form area (before footer). [VERIFIED: contacts.html source]

### Recommended File Structure
```
next/src/
  app/
    layout.tsx              # UPDATE: add metadataBase, title template, shared OG
    page.tsx                # UPDATE: add page-level metadata export
    contacts/
      page.tsx              # NEW: contacts page with metadata export
  components/
    sections/
      ContactForm.tsx       # REUSE: unchanged
      ContactSection.tsx    # EXISTS: index-page version (different layout)
      contacts/
        ContactsHero.tsx    # NEW: centered hero with badge
        CoordinatorCard.tsx # NEW: coordinator avatar + bio
        ContactMethodGrid.tsx # NEW: 2x2 grid (phone, email, office, schedule)
        TrustBadges.tsx     # NEW: 4 trust badges row
```

### Pattern: Static Metadata Export

For SSG pages with fixed metadata, use static `metadata` export (not `generateMetadata`):

```typescript
// Source: next/node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  alternates: {
    canonical: '/contacts',  // resolved against metadataBase
  },
  openGraph: {
    type: 'website',
    title: 'Page Title',
    description: 'Page description',
    url: '/contacts',  // resolved against metadataBase
    siteName: 'MedicusUnion',
    locale: 'ru_RU',
  },
};
```
[VERIFIED: Next.js Metadata type definition from node_modules]

### Pattern: Metadata Merging (Layout + Page)

Next.js merges metadata from layout.tsx and page.tsx. Layout provides defaults; pages override specific fields. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]

```typescript
// layout.tsx -- shared site-wide metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://medicusunion.kz'),
  title: {
    default: 'MedicusUnion KZ',
    template: '%s -- MedicusUnion KZ',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'MedicusUnion',
  },
};

// page.tsx -- page-specific overrides
export const metadata: Metadata = {
  title: 'Медицина мирового уровня для Казахстана',
  // title renders as: "Медицина мирового уровня для Казахстана -- MedicusUnion KZ"
  // ...page-specific fields
};
```

### Pattern: Viewport Export (separate from metadata in Next.js 15)

`themeColor` is deprecated in the `Metadata` type -- use `Viewport` export instead:

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#38C6F4',
};
```
[VERIFIED: metadata-interface.d.ts shows themeColor marked @deprecated]

### Anti-Patterns to Avoid
- **Using `generateMetadata` for static pages:** Adds unnecessary async overhead. Both pages have fixed metadata -- use static export. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]
- **Duplicating metadata in layout and page:** Layout defines shared defaults (metadataBase, title.template, og.siteName, og.locale); pages only override what differs. Next.js merges them.
- **Hardcoding absolute URLs in page metadata:** Use `metadataBase` in layout.tsx and relative paths in pages. Next.js resolves them automatically.
- **Putting all contacts-page components in the top-level sections/ folder:** The contacts page has 4 unique components -- use a subfolder `sections/contacts/` to avoid clutter.

## Content Extraction: contacts.html

### Hero Section Content [VERIFIED: contacts.html lines 73-89]
- **Badge:** "Свяжитесь с нами" (with chat icon SVG)
- **H1:** "Контакты" (with text-gradient class)
- **Subtitle:** "Оставьте заявку или свяжитесь напрямую -- наш координатор ответит в течение 24 часов"

### Coordinator Card Content [VERIFIED: contacts.html lines 99-109]
- **Avatar:** Unsplash image URL `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?...&w=1080`
- **Name:** Айгерим
- **Title:** Старший медицинский координатор
- **Bio:** "Выслушаю вашу ситуацию и помогу выбрать оптимальное решение. Бесплатно и без обязательств."

### Contact Method Cards (2x2 grid) [VERIFIED: contacts.html lines 111-161]
| Card | Icon | Label | Value |
|------|------|-------|-------|
| Phone | phone SVG | Телефон | +7 701 532 24 78 (tel: link) |
| Email | mail SVG | Email | kz@medicusunion.com (mailto: link) |
| Office | map-pin SVG | Офис | Астана, Казахстан (text only) |
| Schedule | clock SVG | График | Пн--Пт 9:00--18:00 (text only) |

### Trust Badges [VERIFIED: contacts.html lines 164-193]
4 badges with green checkmark SVGs:
1. "На связи 24/7"
2. "ISO 27001"
3. "Astana Hub Resident"
4. "10 000+ пациентов"

### Form Section [VERIFIED: contacts.html lines 198-255]
- **Heading:** "Оставить заявку" (h2)
- **Fields:** Same as ContactForm.tsx (name, phone, interest select, description textarea, honeypot)
- **Select options:** Same as ContactForm.tsx (consultation, treatment, checkup, not-sure)
- **Submit button:** "Отправить заявку" with send icon
- **Privacy text:** "Мы перезвоним в течение 24 часов. Ваши данные защищены."
- **Success state:** Checkmark + "Спасибо!" + "Мы свяжемся с вами в течение 24 часов."

**Conclusion:** ContactForm.tsx from Phase 61 already implements this form identically. No changes needed.

### CSS Classes Used in contacts.html (not yet ported to Next.js)
| Class | Used For | Action |
|-------|----------|--------|
| `glass-badge` | Hero badge pill | Implement via Tailwind utilities |
| `text-gradient` | H1 gradient text | Implement via inline Tailwind gradient |
| `glass-card` | Contact method cards | Use `liquid-card` from liquid-glass.css (equivalent) |
| `coordinator-card` | Coordinator section | Build with Tailwind (avatar + text layout) |
| `contact__grid` | 2-column layout | Tailwind grid |
| `contact__trust-badge` | Trust badges | Tailwind flex layout |
| `form-wrapper` | Form container | Tailwind card wrapper (white bg, rounded, shadow) |
| `page-hero` | Hero section | Tailwind padding + centering |
| `mesh-bg` | Animated background blobs | Layout already handles background; skip for 1:1 port |

## Content Extraction: SEO Meta Tags

### index.html Meta Tags [VERIFIED: index.html head, lines 1-30]
```
title: "MedicusUnion KZ -- Медицина мирового уровня для Казахстана"
description: "Онлайн-консультации с европейскими врачами, лечение за рубежом, чек-ап в Samsung Medical Center и клиниках Стамбула. Организация под ключ."
og:type: "website"
og:locale: "ru_RU"
og:title: "MedicusUnion KZ -- Медицина мирового уровня для Казахстана"
og:description: "Онлайн-консультации с врачами Европы, лечение за рубежом, чек-ап в ведущих клиниках мира. 43 клиники, 11 стран, организация под ключ."
og:url: "https://medicusunion.kz"
og:site_name: "MedicusUnion"
canonical: "https://medicusunion.kz"
theme-color: "#38C6F4"
```

### contacts.html Meta Tags [VERIFIED: contacts.html head, lines 1-16]
```
title: "Контакты -- MedicusUnion KZ"
description: "Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов. Телефон: +7 701 532 24 78."
og:type: "website"
og:locale: "ru_RU"
og:title: "Контакты -- MedicusUnion KZ"
og:description: "Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов."
og:url: "https://medicusunion.kz/contacts.html"
og:site_name: "MedicusUnion"
canonical: "https://medicusunion.kz/contacts.html"
theme-color: "#38C6F4"
```

### Metadata Implementation Strategy

```typescript
// app/layout.tsx -- UPDATED metadata
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://medicusunion.kz'),
  title: {
    default: 'MedicusUnion KZ -- Медицина мирового уровня для Казахстана',
    template: '%s -- MedicusUnion KZ',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'MedicusUnion',
  },
};

export const viewport: Viewport = {
  themeColor: '#38C6F4',
};

// app/page.tsx -- index page metadata
export const metadata: Metadata = {
  title: {
    absolute: 'MedicusUnion KZ -- Медицина мирового уровня для Казахстана',
  },
  description: 'Онлайн-консультации с европейскими врачами, лечение за рубежом, чек-ап в Samsung Medical Center и клиниках Стамбула. Организация под ключ.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MedicusUnion KZ -- Медицина мирового уровня для Казахстана',
    description: 'Онлайн-консультации с врачами Европы, лечение за рубежом, чек-ап в ведущих клиниках мира. 43 клиники, 11 стран, организация под ключ.',
    url: '/',
  },
};

// app/contacts/page.tsx -- contacts page metadata
export const metadata: Metadata = {
  title: 'Контакты',  // renders as "Контакты -- MedicusUnion KZ" via template
  description: 'Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов. Телефон: +7 701 532 24 78.',
  alternates: {
    canonical: '/contacts',
  },
  openGraph: {
    title: 'Контакты -- MedicusUnion KZ',
    description: 'Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов.',
    url: '/contacts',
  },
};
```

**Note on canonical URL format:** The original HTML uses `/contacts.html` but Next.js routes use `/contacts`. The canonical should match the Next.js route (`/contacts`), not the old `.html` path. [ASSUMED]

**Note on title template:** The index page title format is "MedicusUnion KZ -- Медицина мирового уровня для Казахстана" (no template applied -- uses `absolute`). The contacts page title format is "Контакты -- MedicusUnion KZ" which matches the `template: '%s -- MedicusUnion KZ'` pattern perfectly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Meta tag generation | Manual `<meta>` tags in JSX | Next.js `export const metadata: Metadata` | Automatic dedup, merge, type safety, SSG support |
| SVG icons | Inline SVG strings | lucide-react components | Already installed, consistent sizing, tree-shakeable |
| Phone/email display | Hardcoded strings | Constants from `@/lib/navigation.ts` | Single source of truth (PHONE_NUMBER, EMAIL already defined) |
| Glass card styling | Custom CSS classes | `liquid-card` from liquid-glass.css | Already ported with full dark mode + accessibility support |

## Common Pitfalls

### Pitfall 1: Metadata Title Template vs Absolute
**What goes wrong:** Index page title gets wrapped in template ("MedicusUnion KZ -- ... -- MedicusUnion KZ").
**Why it happens:** Layout defines `title.template: '%s -- MedicusUnion KZ'` and page exports `title: 'string'` which gets templated.
**How to avoid:** Use `title: { absolute: '...' }` for the index page to bypass the template. Use plain string for contacts page.
**Warning signs:** Title has duplicate branding in `<title>` tag.

### Pitfall 2: Canonical URL Trailing Slash
**What goes wrong:** Canonical URL mismatch causes SEO issues.
**Why it happens:** Next.js `trailingSlash` config defaults to false, but `metadataBase` resolution may add/remove slashes inconsistently.
**How to avoid:** Use relative paths (`/contacts`) and let `metadataBase` handle the origin. Verify in build output.
**Warning signs:** `curl -s localhost:3000/contacts | grep canonical` shows unexpected URL.

### Pitfall 3: og:description vs meta description Mismatch
**What goes wrong:** The original HTML has DIFFERENT og:description and meta description for the index page.
**Why it happens:** meta description is more detailed; og:description is shorter for social previews.
**How to avoid:** Set `description` (for meta) and `openGraph.description` separately in the metadata object.
**Warning signs:** Checking page source shows identical description and og:description when they should differ.

### Pitfall 4: Contacts Page Navigation Link
**What goes wrong:** Navigation "Контакты" link points to `#contact` (anchor on index page) instead of `/contacts`.
**Why it happens:** Current navigation config in `@/lib/navigation.ts` defines contacts as `{ href: '#contact', label: 'Контакты' }`.
**How to avoid:** Update NAV_LINKS to use `href: '/contacts'` now that the contacts page exists as a route.
**Warning signs:** Clicking "Контакты" in header scrolls to form on index page instead of navigating to /contacts.

### Pitfall 5: Unsplash Image URL in Production
**What goes wrong:** Coordinator avatar loads from Unsplash CDN -- external dependency, potentially slow, may break.
**Why it happens:** Original HTML uses an Unsplash direct URL for the avatar.
**How to avoid:** Download the image to `public/images/` and use Next.js `<Image>` component for optimization. If keeping external URL, configure `images.remotePatterns` in next.config.ts.
**Warning signs:** Image fails to load, or Next.js Image component throws unregistered domain error.

## Code Examples

### Contacts Page Composition
```typescript
// Source: Pattern established in Phase 61 (app/page.tsx)
import type { Metadata } from 'next';
import { ContactsHero } from '@/components/sections/contacts/ContactsHero';
import { CoordinatorCard } from '@/components/sections/contacts/CoordinatorCard';
import { ContactMethodGrid } from '@/components/sections/contacts/ContactMethodGrid';
import { TrustBadges } from '@/components/sections/contacts/TrustBadges';
import { ContactForm } from '@/components/sections/ContactForm';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Оставьте заявку или свяжитесь напрямую...',
  // ...
};

export default function ContactsPage() {
  return (
    <>
      <ContactsHero />
      <section className="py-12 md:py-24" id="contact-section">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* Left: Info */}
            <div>
              <CoordinatorCard />
              <ContactMethodGrid />
              <TrustBadges />
            </div>
            {/* Right: Form */}
            <div className="bg-white border border-black/8 rounded-2xl shadow-md p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-mu-text-900 mb-6">
                Оставить заявку
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```
[VERIFIED: Pattern matches Phase 61 page.tsx composition]

### Glass Badge Component
```typescript
// Tailwind equivalent of .glass-badge from contacts.html
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
  bg-white/60 backdrop-blur-sm border border-white/80
  text-sm font-medium text-mu-text-700 shadow-glass-sm">
  <PhoneIcon className="w-4 h-4 text-mu-blue" />
  <span>Свяжитесь с нами</span>
</div>
```

### Contact Method Card (glass)
```typescript
// Tailwind equivalent of .glass-card from contacts.html
<div className="liquid-card rounded-[2rem] p-6">
  <div className="mb-3">
    <PhoneIcon className="w-5 h-5 text-mu-blue" />
  </div>
  <p className="text-sm text-mu-text-500 font-bold mb-1">Телефон</p>
  <a href="tel:+77015322478" className="text-mu-text-900 font-bold no-underline">
    +7 701 532 24 78
  </a>
</div>
```

## Navigation Update Required

The contacts page creation requires updating `@/lib/navigation.ts`:

```typescript
// Current (Phase 61):
{ href: '#contact', label: 'Контакты' }

// Updated (Phase 62):
{ href: '/contacts', label: 'Контакты' }
```
[VERIFIED: current navigation.ts uses '#contact']

## SSG Verification

Both pages must be statically generated. The `next.config.ts` has `output: 'standalone'` which still supports SSG -- pages without `force-dynamic` or dynamic data fetching are automatically statically rendered at build time. [VERIFIED: next.config.ts]

Verification command:
```bash
cd next && npm run build
# Check output for:
#   Route (app)    Size
#   /              ... (Static)
#   /contacts      ... (Static)
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (no test framework installed) |
| Config file | none |
| Quick run command | `cd next && npm run build` |
| Full suite command | `cd next && npm run build && npm run start` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-02 | /contacts renders with glass form + coordinator cards | manual | Visual comparison at 1440px and 375px | N/A |
| PAGE-03 | Both pages export correct metadata | smoke | `curl -s localhost:3000 \| grep '<meta'` and `curl -s localhost:3000/contacts \| grep '<meta'` | N/A |
| PAGE-02+03 | Both pages are SSG | smoke | `npm run build` output shows static pages | N/A |

### Wave 0 Gaps
None -- manual verification is appropriate for a visual port phase. Build output confirms SSG status.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Canonical URL should use `/contacts` not `/contacts.html` | SEO Meta Tags | Minor SEO impact if search engines have indexed the .html URL (unlikely since this is a new Next.js deployment) |
| A2 | FinalCTA is NOT used on contacts page (based on contacts.html source) | Architecture Patterns | Low -- CONTEXT.md mentions reusing FinalCTA but actual HTML doesn't include it |
| A3 | Mesh background (animated blobs) should be skipped in Next.js port | CSS Classes table | Low -- layout already provides background; mesh was decorative |

## Open Questions

1. **Coordinator avatar image source**
   - What we know: contacts.html uses an Unsplash URL for the coordinator photo
   - What's unclear: Should we download it to `public/` or keep the external URL?
   - Recommendation: Download to `public/images/coordinator-aigerim.jpg` and use Next.js `<Image>` for optimization. Add `images.remotePatterns` for Unsplash as fallback.

2. **FinalCTA on contacts page**
   - What we know: CONTEXT.md says "Reuse FinalCTA component from Phase 61" but contacts.html does NOT have a FinalCTA section
   - What's unclear: Was the CONTEXT.md intention to ADD FinalCTA (not present in original) or was it a mistake?
   - Recommendation: Follow the 1:1 port principle -- do NOT add FinalCTA since the original contacts.html doesn't have it. The CONTEXT.md entry was likely auto-generated and incorrect.

## Sources

### Primary (HIGH confidence)
- contacts.html source code (from worktree) -- full page structure, all content, all meta tags
- index.html head (main branch, `git show`) -- SEO meta tags for index page
- next/node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts -- Metadata type definition with examples
- next/src/components/sections/ContactForm.tsx -- existing form component (reusable)
- next/src/components/sections/ContactSection.tsx -- existing index-page contact section
- next/src/app/layout.tsx -- current layout metadata setup
- next/src/lib/navigation.ts -- navigation constants (PHONE_NUMBER, EMAIL)

### Secondary (MEDIUM confidence)
- [Next.js Metadata API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- static vs generateMetadata patterns
- [Next.js Metadata getting started](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- metadata merging behavior

### Tertiary (LOW confidence)
None -- all claims verified from source code or official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, everything already installed
- Architecture: HIGH -- patterns established in Phase 61, contacts.html fully extracted
- SEO metadata: HIGH -- exact meta tags extracted from source, Metadata type verified from package
- Pitfalls: HIGH -- based on verified code analysis (navigation link, title template, image URLs)

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (stable -- no external dependencies or fast-moving APIs)
