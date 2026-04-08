# Phase 1: Apply Redesign from Redesign folder to main project - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the visual design, layout, content structure, and interaction patterns from the Redesign/ folder (React + Tailwind + Framer Motion app) into the main vanilla HTML/CSS/JS project. The redesign expands from a single video-consultation landing to a multi-service platform (online consultations, treatment abroad, checkups). The result should be a multi-page static site with the redesign's glassmorphism visual language, section structure, animations, and content — while preserving existing form submission (Directus backend) and accessibility for 45+ audience.

</domain>

<decisions>
## Implementation Decisions

### Section Structure & Content Scope
- Adopt 3-service model from redesign (online consultations, treatment abroad, checkups)
- Use redesign section lineup: Hero → Stats → Services → Guide → WhyUs → Contact → CTA → Footer
- Keep existing FAQ accordion and Pricing sections alongside redesign sections
- Create separate HTML pages per service (online-consultations.html, treatment-abroad.html, checkups.html) — multi-page structure

### Visual Design Language
- Adopt redesign color palette: mu-blue (#38C6F4), mu-green ramp, mu-accent-blue (#4F84E8), mu-accent-teal (#78C3BF), mu-accent-orange (#FFA25C), mu-accent-red (#F50057)
- Switch to SF Pro Display (body) / SF Pro Rounded (headings) — replacing Inter/Manrope
- Adopt 3rem (48px) border-radius for cards, 2.5rem for smaller elements
- Adopt redesign glass tokens: shadow-glass-sm, shadow-glass, shadow-glass-lg, shadow-glass-inner, border-glass, border-glass-strong
- White/60 glass backgrounds with backdrop-blur-2xl (40px)

### Animation & Interaction
- Use Framer Motion (motion standalone package) for animations — replaces current CSS + IntersectionObserver approach
- Port counter animation on stats section (43 clinics, 11 countries, 500+ doctors, 15+ years)
- Adopt hover transforms from redesign: translateY(-2px to -8px), scale(1.02-1.05), rotate(3-6deg) on icons
- Staggered entrance animations with delay per card

### Images & Assets
- Use redesign's Unsplash image URLs (doctors, hospitals, medical team)
- Inline Lucide SVG icons (copy SVG paths, no JS dependency)
- Adopt Hero photo composition: overlapping images with floating badges (500+ doctors, 4.9/5 rating)

### Claude's Discretion
- Exact responsive breakpoints and mobile adaptations
- CSS architecture (file organization for multi-page)
- Build tooling decisions if needed for Framer Motion bundling
- Dark mode adaptation of new design tokens
- Form validation and Directus integration wiring on new pages
- Preserving prefers-reduced-motion guards for all new animations

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Form submission JS (js/main.js) — Directus POST to /items/submissions
- Dark mode toggle (initDarkMode, applyTheme in js/main.js)
- FAQ accordion JS (initFAQ in js/main.js)
- Scroll-reveal IntersectionObserver (may be replaced by Framer Motion)
- Sticky header scroll handler

### Established Patterns
- CSS custom properties on :root for theming
- [data-theme='dark'] token cascade for dark mode
- @supports fallbacks for glassmorphism
- prefers-reduced-motion media query guards
- Mobile-first responsive design

### Integration Points
- Directus backend at configured API URL for form submissions
- localStorage for dark mode persistence
- FOUC prevention script in <head>
- Sticky mobile bar with click-to-call

</code_context>

<specifics>
## Specific Ideas

- Redesign components to port: Hero.tsx, Header.tsx, StatsSection.tsx, ServicesSection.tsx, GuideSection.tsx, WhyUsSection.tsx, ContactSection.tsx, CTASection.tsx, Footer.tsx
- Exact Unsplash image URLs are in the Redesign/ component files
- Phone number: +7 701 532 24 78, Email: kz@medicusunion.com
- Coordinator name: Айгерим (from ContactSection.tsx)
- Service pages from redesign routes: OnlineConsultationsPage, TreatmentAbroadPage, CheckupsPage, ContactsPage

</specifics>

<deferred>
## Deferred Ideas

- NotFoundPage (404) — can be added as a separate small task
- Full dark mode adaptation for new color tokens — may need its own phase
- SEO optimization for new multi-page structure (meta tags per page)
- Image optimization (WebP/AVIF conversion, self-hosting)

</deferred>
