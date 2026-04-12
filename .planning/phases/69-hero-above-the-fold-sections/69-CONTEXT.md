# Phase 69: Hero & Above-the-Fold Sections - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

A visitor landing on the index page sees the complete new above-the-fold experience -- doctor photo with floating badges, gradient headline, two CTA buttons, key stats, and service cards. Source of truth: feat/new-design branch at commit d450232.

</domain>

<decisions>
## Implementation Decisions

### Hero Section Layout
- Use local images in /public -- download and optimize from Unsplash URLs in source HTML, avoid external dependency
- Full photo composition: main doctor photo + secondary consultation photo, overlapping with glass borders + 2 floating glass badges (43 clinics, 15+ years)
- Trust indicator line below CTAs: "MedicusUnion GmbH, Австрия · ТОО в Казахстане · ISO 27001 · 43 клиники · 11 стран · 15+ лет опыта"
- Glass pill badge above headline: "Австрийская медицинская компания с офисом в Казахстане"

### Hero CTA Buttons
- Primary CTA: "Обсудить мой случай" (per REQUIREMENTS HERO-03) -- gradient from-mu-blue to-mu-accent-blue, scrolls to #contact
- Secondary CTA: "Узнать больше" (per REQUIREMENTS HERO-03) -- glass/white style, scrolls to #services section
- Both buttons rounded-3xl with lg text size

### Stats Section
- Glass cards with hover: bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass
- 4 stats: 43 клиники, 11 стран, 500+ врачей, 15+ лет
- Per-card accent colors: accent-blue, green, accent-blue, accent-teal
- Static number display (no count-up animation -- ЦА 45+, simplicity)
- Uppercase tracking-wider labels

### Services Section
- Local images in /public -- download and optimize from source HTML
- 3 service cards linking to service pages: /consultations, /treatment-abroad, /checkup
- Glass card styling consistent with stats and overall design language
- Cards show photo, title, description, and "Подробнее →" link

### Claude's Discretion
- Image optimization format (WebP/AVIF) and dimensions
- Exact responsive breakpoints for photo composition
- Service card description text length

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HeroHub.tsx` -- existing hero component to be rewritten
- `StatsBar.tsx` -- existing stats component to be rewritten
- `ServicesGrid.tsx` -- existing services component to be rewritten
- Phase 68 tokens in globals.css -- glass shadows, color palette, typography scale
- `navigation.ts` -- centralized constants

### Established Patterns
- Server components for static content (Hero, Stats, Services)
- Glass card pattern from Phase 68 (Footer glass card, Header glass pill)
- Tailwind v4 with CSS custom properties
- lucide-react for icons

### Integration Points
- `page.tsx` (index) -- renders Hero, Stats, Services sections
- `globals.css` -- design tokens from Phase 68
- `/public/` -- image assets directory

</code_context>

<specifics>
## Specific Ideas

- Hero headline: first line dark text "Европейские врачи, мировые клиники —", second line gradient "доступны из Казахстана"
- Hero responsive: text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold
- Photo composition: main image 85% w/h with rounded-[3rem], secondary 3/5 w 45% h with rounded-[2.5rem], overlapping
- Floating badges: glass bg-white/70 backdrop-blur-[40px] rounded-[2rem] with gradient icon backgrounds
- Stats: grid-cols-2 lg:grid-cols-4, text-5xl md:text-6xl font-extrabold numbers
- Services: glass cards with image at top, title, description, arrow link

</specifics>

<deferred>
## Deferred Ideas

- motion.js animations -- will be added after all sections are ported
- Count-up animation for stats -- deferred per simplicity decision

</deferred>
