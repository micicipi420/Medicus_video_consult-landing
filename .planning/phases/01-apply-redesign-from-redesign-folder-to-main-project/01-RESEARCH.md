# Phase 1: Apply Redesign from Redesign folder to main project - Research

**Researched:** 2026-04-04
**Domain:** Static site migration (React+Tailwind -> Vanilla HTML/CSS/JS), glassmorphism, multi-page architecture
**Confidence:** HIGH

## Summary

This phase migrates a React + Tailwind + Framer Motion redesign prototype into the existing vanilla HTML/CSS/JS project. The migration is primarily a visual and structural overhaul: replacing the current color palette, typography, spacing, and component designs with the redesign's glassmorphism-based aesthetic while preserving the project's no-framework constraint.

The codebase transformation is substantial but well-defined. The current project has ~2670 lines of CSS, ~566 lines of JS, and 5 HTML files (index.html + 3 service pages + test page). These will be largely rewritten to match the Redesign's 11 component files, 5 page files, and theme system. The critical technical decision is how to handle animations: the CONTEXT.md locks Framer Motion (motion standalone package), which provides a vanilla JS API via CDN that replaces the current IntersectionObserver-based approach.

The existing Directus form submission, phone mask, spam protection, and FAQ accordion JavaScript must be preserved and integrated into the new design. The multi-page structure already partially exists (consultations.html, treatment-abroad.html, checkup.html) but file names and content must be aligned with the redesign's routes.

**Primary recommendation:** Execute as a full CSS rewrite + HTML restructure with incremental JS migration. Start with the design token layer (CSS custom properties), then build shared components (header, footer, mesh background), then page-by-page sections. Use motion package via CDN `<script>` tag for animations.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Adopt 3-service model from redesign (online consultations, treatment abroad, checkups)
- Use redesign section lineup: Hero -> Stats -> Services -> Guide -> WhyUs -> Contact -> CTA -> Footer
- Keep existing FAQ accordion and Pricing sections alongside redesign sections
- Create separate HTML pages per service (online-consultations.html, treatment-abroad.html, checkups.html) -- multi-page structure
- Adopt redesign color palette: mu-blue (#38C6F4), mu-green ramp, mu-accent-blue (#4F84E8), mu-accent-teal (#78C3BF), mu-accent-orange (#FFA25C), mu-accent-red (#F50057)
- Switch to SF Pro Display (body) / SF Pro Rounded (headings) -- replacing Inter/Manrope
- Adopt 3rem (48px) border-radius for cards, 2.5rem for smaller elements
- Adopt redesign glass tokens: shadow-glass-sm, shadow-glass, shadow-glass-lg, shadow-glass-inner, border-glass, border-glass-strong
- White/60 glass backgrounds with backdrop-blur-2xl (40px)
- Use Framer Motion (motion standalone package) for animations -- replaces current CSS + IntersectionObserver approach
- Port counter animation on stats section (43 clinics, 11 countries, 500+ doctors, 15+ years)
- Adopt hover transforms from redesign: translateY(-2px to -8px), scale(1.02-1.05), rotate(3-6deg) on icons
- Staggered entrance animations with delay per card
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

### Deferred Ideas (OUT OF SCOPE)
- NotFoundPage (404) -- can be added as a separate small task
- Full dark mode adaptation for new color tokens -- may need its own phase
- SEO optimization for new multi-page structure (meta tags per page)
- Image optimization (WebP/AVIF conversion, self-hosting)
</user_constraints>

## Project Constraints (from CLAUDE.md)

- **Stack**: HTML + CSS + JS (pure, no frameworks) -- simplicity of deploy and maintenance
- **Backend**: Directus (self-hosted) -- form submission storage
- **Language**: Russian only
- **Design**: Mobile-first, target audience 45+ -- large fonts, clear navigation, high contrast
- **Tone**: Calm, confident, medical -- no marketing aggression
- **Do Not Use**: Tailwind CSS, Bootstrap, CSS-in-JS, Sass/SCSS, jQuery, Axios, Alpine.js, any SPA framework, @directus/sdk

**Note on Framer Motion decision vs CLAUDE.md:** CLAUDE.md says "no frameworks" for JS. The user's CONTEXT.md explicitly overrides this by locking "Use Framer Motion (motion standalone package)." The motion standalone package is NOT a framework -- it is a 2.3-18kb animation utility library with a vanilla JS API. This is comparable to using a utility like Lodash and does not violate the spirit of "no SPA frameworks." The user decision takes precedence.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 | Current | Page structure | Semantic, no build step, multi-page static site |
| Vanilla CSS | Current | Styling, design tokens, glassmorphism | Project constraint, modern CSS (custom properties, grid, flexbox, clamp) |
| Vanilla JS (ES6+) | Current | Form handling, accordion, dark mode | Project constraint |
| motion (standalone) | 12.x (latest) | Entrance animations, scroll-triggered reveals, hover | User decision (CONTEXT.md). Vanilla JS API via CDN, no React dependency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lucide Icons | N/A (inline SVG) | Icons throughout the UI | Copy SVG path data directly from lucide.dev, no runtime JS |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion (CDN) | Pure CSS @keyframes + IntersectionObserver | User locked Framer Motion; vanilla CSS lacks spring physics, stagger orchestration, and the clean API |
| motion (CDN) | GSAP | Heavier, licensing concerns, user decided on motion |
| Lucide inline SVG | lucide-static npm | npm package is unnecessary for copy-pasting ~25 icon paths |

**Installation:**

No npm install needed. Load motion via CDN script tag:

```html
<!-- Option A: ES Module (preferred for modern browsers) -->
<script type="module">
  import { animate, inView, scroll } from "https://cdn.jsdelivr.net/npm/motion@12/+esm";
</script>

<!-- Option B: Global variable (wider compatibility for 45+ audience) -->
<script src="https://cdn.jsdelivr.net/npm/motion@12/dist/motion.js"></script>
<script>
  const { animate, inView, scroll } = Motion;
</script>
```

**Version note:** Pin to specific version (e.g. `motion@12.23.24`) in production to prevent CDN breakage.

### motion Package: Vanilla JS API

The key functions needed for this migration:

| Function | Size | Purpose | Replaces |
|----------|------|---------|----------|
| `animate(selector, keyframes, options)` | 2.3-18kb | Animate elements (opacity, transform, etc.) | CSS transition classes + `.is-visible` |
| `inView(selector, callback, options)` | 0.5kb | Trigger animations when elements enter viewport | Custom IntersectionObserver code |
| `scroll(callback)` | 5.1kb | Scroll-linked animations (header, parallax) | `window.addEventListener('scroll', ...)` |

## Architecture Patterns

### Recommended Project Structure

```
/
  index.html                    # Home page (main landing)
  online-consultations.html     # Service page 1
  treatment-abroad.html         # Service page 2
  checkups.html                 # Service page 3
  contacts.html                 # Contact/form page
  css/
    tokens.css                  # Design tokens (colors, spacing, typography, glass)
    base.css                    # Reset, body, typography, links
    components.css              # Reusable: buttons, cards, badges, glass surfaces, forms
    sections.css                # Section-specific: hero, stats, services, guide, whyus, contact, cta
    layout.css                  # Header, footer, mesh background, container, responsive
    pages.css                   # Page-specific overrides (service pages, contacts)
    animations.css              # @keyframes for mesh blobs, entrance states, hover
    utilities.css               # .visually-hidden, .text-center, etc.
    styles.css                  # Import file: @import all above in order
  js/
    main.js                     # Core: form, accordion, phone mask, spam protection, sticky bar
    animations.js               # motion-powered entrance animations, counters, hover effects
  assets/
    fonts/                      # (empty -- SF Pro is system font, no self-hosted fonts needed)
```

**Key architecture change:** Split the monolithic 2670-line `css/styles.css` into modular files using CSS `@import`. This is acceptable for a static site with no build step -- modern browsers handle `@import` well. For production, concatenation can be done manually or via `clean-css-cli`.

**Font change:** SF Pro Display/Rounded are Apple system fonts. No @font-face declarations needed. The fallback chain (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`) covers all platforms. **Remove the current Inter/Manrope woff2 font files and @font-face declarations.**

### Pattern 1: Glass Surface Component

**What:** Reusable glassmorphism card surface pattern
**When to use:** Every card, header, form wrapper, badge, footer in the new design

```css
/* Source: UI-SPEC Glass Surface Recipe */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: var(--border-glass);
  border-radius: var(--radius-3xl); /* 48px */
  box-shadow: var(--shadow-glass);
  transition: all 500ms ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.7);
  border: var(--border-glass-strong);
  box-shadow: var(--shadow-glass-lg);
  transform: translateY(-2px);
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

### Pattern 2: Animated Mesh Background (CSS-only)

**What:** Three colored blurred circles that animate slowly behind all content
**When to use:** Global, fixed position behind all pages

```css
/* Source: Layout.tsx mesh background */
.mesh-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.mesh-bg__blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(120px);
}

.mesh-bg__blob--1 {
  top: -10%;
  left: -10%;
  width: 60vw;
  height: 60vw;
  background: rgba(56, 198, 244, 0.3); /* mu-blue/30 */
  animation: meshBlob1 15s ease-in-out infinite;
}

@keyframes meshBlob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(80px, 40px) scale(1.1); }
}

.mesh-bg__overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
}
```

### Pattern 3: motion-powered Entrance Animations

**What:** Replace IntersectionObserver + CSS class toggling with motion's inView + animate
**When to use:** All section content that fades/slides in on scroll

```javascript
/* Source: motion.dev docs + Redesign component patterns */
import { animate, inView } from "https://cdn.jsdelivr.net/npm/motion@12/+esm";

// Fade-up entrance for sections
inView('.section-content', (element) => {
  animate(element, 
    { opacity: [0, 1], y: [30, 0] }, 
    { duration: 0.8, easing: 'ease-out' }
  );
}, { amount: 0.2 });

// Staggered card entrance
inView('.card-grid', (element) => {
  const cards = element.querySelectorAll('.glass-card');
  cards.forEach((card, i) => {
    animate(card,
      { opacity: [0, 1], y: [50, 0] },
      { duration: 0.8, delay: i * 0.1 }
    );
  });
}, { amount: 0.2 });
```

### Pattern 4: Multi-Page Shared Layout

**What:** Common header, footer, mesh background, and JS across all pages
**When to use:** Every HTML page includes the same boilerplate

```html
<!-- Shared head content for every page -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/styles.css">

<!-- Shared body structure -->
<div class="mesh-bg">...</div>
<header class="header">...</header>
<main class="main">
  <!-- Page-specific content -->
</main>
<footer class="footer">...</footer>

<script src="https://cdn.jsdelivr.net/npm/motion@12/dist/motion.js"></script>
<script src="js/main.js"></script>
<script src="js/animations.js"></script>
```

### Anti-Patterns to Avoid

- **Copying Tailwind classes into CSS:** Do NOT translate `bg-white/60 backdrop-blur-2xl rounded-[3rem]` into utility classes. Instead, create semantic classes like `.glass-card`, `.glass-header`, `.glass-badge`.
- **Translating React state to JS:** The Redesign uses `useState` for scroll detection, menu toggle, form state. These should be vanilla DOM manipulation (classList, event listeners), NOT attempted React patterns.
- **Importing motion/react:** The Redesign imports from `motion/react`. The vanilla project MUST import from `motion` (the standalone package) or via CDN. The `motion/react` path requires React.
- **Over-splitting pages:** Each service page has its own hero, features, steps, and CTA. Do NOT try to make these into shared "components" -- simply duplicate the HTML structure with different content per page. Static HTML duplication is acceptable and preferred over template complexity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | Custom IntersectionObserver + class toggling | `motion` inView() + animate() | 0.5kb, handles threshold, one-shot, cleanup automatically |
| Spring-physics animations | CSS cubic-bezier approximations | `motion` animate() with spring | Real spring physics feel vs faked easing |
| Counter animation | Custom requestAnimationFrame loop | Keep existing `initAnimatedCounters()` from main.js | Already works well, battle-tested, no need to rewrite |
| Phone input mask | Custom regex formatting | Keep existing `initPhoneMask()` from main.js | Already works, handles edge cases |
| Glassmorphism fallbacks | Manual feature detection | `@supports not (backdrop-filter: blur(1px))` | Pure CSS, no JS overhead |

**Key insight:** The existing JS in main.js (form submission, phone mask, spam protection, FAQ accordion, animated counters) is reusable as-is. The main changes are in HTML structure, CSS design tokens, and replacing the CSS-based scroll-reveal with motion-powered animations.

## Common Pitfalls

### Pitfall 1: SF Pro Font Not Available on Non-Apple Devices
**What goes wrong:** SF Pro Display/Rounded only ship with macOS/iOS. On Windows, Android, and Linux, text falls back to Segoe UI, Roboto, or Helvetica Neue respectively.
**Why it happens:** SF Pro is not a web font and cannot be legally self-hosted from Google Fonts.
**How to avoid:** Accept this. The UI-SPEC explicitly acknowledges this: "On Windows/Android/Linux the stack falls through to system-ui / Segoe UI / Roboto." Test on Windows/Android to verify the fallback looks acceptable. All these system fonts are excellent for body text. The visual difference is minor.
**Warning signs:** Typography looks different on team members' Windows machines.

### Pitfall 2: Backdrop-filter Performance on Mobile
**What goes wrong:** `backdrop-filter: blur(40px)` on multiple overlapping elements causes frame drops on older phones, especially with the animated mesh background behind everything.
**Why it happens:** Backdrop-filter is GPU-intensive. Stacking multiple blurred layers forces multiple GPU compositing passes.
**How to avoid:** 
1. Limit `backdrop-filter` to elements that truly need it (header, cards, NOT inner elements like feature checkmarks)
2. Use `will-change: backdrop-filter` sparingly
3. Reduce blur amount on mobile (e.g. `blur(20px)` instead of `blur(40px)`)
4. The mesh background overlay already has `backdrop-filter: blur(40px)` -- this means cards sitting above it don't need their own blur to look glassy, just semi-transparent backgrounds
**Warning signs:** Janky scrolling on mid-range Android phones (Samsung Galaxy A series, etc.)

### Pitfall 3: motion CDN Loading Delay
**What goes wrong:** Elements appear in their "before animation" state (opacity: 0, translated) before the motion script loads, causing a flash.
**Why it happens:** CDN script loads asynchronously, elements are rendered by browser before JS executes.
**How to avoid:** 
1. Set elements to their FINAL state in CSS (opacity: 1, no transform)
2. Have JS set initial hidden state after motion loads
3. OR use `<script>` without `defer`/`async` for motion (blocking but guarantees no flash)
4. Consider using the non-module global script for wider compatibility with 45+ audience browsers
**Warning signs:** Content flashes visible, then disappears, then animates in.

### Pitfall 4: File Naming Conflicts with Existing Pages
**What goes wrong:** Current pages are `consultations.html`, `checkup.html`. CONTEXT.md specifies `online-consultations.html`, `checkups.html` (plural). Links break if not all references are updated.
**Why it happens:** Partial rename -- some links point to old names, some to new.
**How to avoid:** Decide on final file names BEFORE writing any HTML. Update ALL internal links, header nav, footer nav, service card CTAs, and any hard-coded references simultaneously.
**Warning signs:** 404 errors when clicking nav links or card CTAs.

### Pitfall 5: Gradient Text Accessibility
**What goes wrong:** `background-clip: text` with gradient makes text invisible to some screen readers and fails accessibility checks.
**Why it happens:** Some browsers/screen readers don't properly handle text with `color: transparent` + gradient background.
**How to avoid:** Always pair gradient text with the correct semantic HTML (h1, h2). The gradient is decorative -- the text content is what matters. Ensure sufficient contrast at the darkest point of the gradient (#4F84E8 on white = 3.6:1, which only passes for large text 18px+). Section headings at display size (48px+) qualify as "large text."
**Warning signs:** Lighthouse accessibility audit flags low contrast on gradient text.

### Pitfall 6: CSS @import Performance
**What goes wrong:** Multiple `@import` statements in CSS create a waterfall of HTTP requests, slowing initial paint.
**Why it happens:** Each `@import` is a sequential network request.
**How to avoid:** 
1. For development: use @import for readability -- totally fine on localhost
2. For production: concatenate all CSS files into a single styles.css using `cat css/tokens.css css/base.css ... > css/styles.min.css` or `clean-css-cli`
3. Alternative: skip @import entirely, keep one file but with clear section comments (current approach works)
**Warning signs:** Slow first contentful paint on mobile networks.

## Code Examples

### Design Token Migration (tokens.css)

```css
/* Source: Redesign/src/styles/theme.css + UI-SPEC */
:root {
  /* Brand Colors */
  --mu-blue: #38C6F4;
  --mu-black: #010101;
  --mu-white: #FFFFFF;
  --mu-text-50: #FBFBFB;
  --mu-text-100: #F5F6F8;
  --mu-text-200: #D8DDE2;
  --mu-text-300: #C6C9D1;
  --mu-text-500: #A4A8B5;
  --mu-text-700: #63687A;
  --mu-text-900: #1B212C;
  --mu-green-50: #E4FAEF;
  --mu-green-100: #D3F8E4;
  --mu-green-500: #6FDEA9;
  --mu-green-600: #35B678;
  --mu-green-700: #4BCA8C;
  --mu-accent-blue: #4F84E8;
  --mu-accent-teal: #78C3BF;
  --mu-accent-teal-bg: #EBFAF9;
  --mu-accent-orange: #FFA25C;
  --mu-accent-orange-bg: #FFF5ED;
  --mu-accent-red: #F50057;
  --mu-accent-red-bg: #FFF0F5;

  /* Typography */
  --font-body: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-heading: 'SF Pro Rounded', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-display: clamp(3rem, 5vw + 1rem, 5rem);
  --font-size-subheading: clamp(1.5rem, 3vw + 0.5rem, 2rem);
  --font-size-body-lg: 1.125rem; /* 18px */
  --font-size-body: 1rem; /* 16px */

  /* Spacing (4px grid) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */

  /* Border Radius */
  --radius-sm: 0.5rem;    /* 8px */
  --radius-md: 1rem;      /* 16px */
  --radius-lg: 1.5rem;    /* 24px */
  --radius-xl: 2rem;      /* 32px */
  --radius-2xl: 2.5rem;   /* 40px */
  --radius-3xl: 3rem;     /* 48px */
  --radius-4xl: 3.5rem;   /* 56px */
  --radius-full: 9999px;

  /* Glass Shadows */
  --shadow-glass-sm: 0 4px 16px rgba(1,1,1,0.04), inset 0 1px 1px rgba(255,255,255,0.8);
  --shadow-glass: 0 8px 32px rgba(1,1,1,0.08), inset 0 1px 1px rgba(255,255,255,0.9);
  --shadow-glass-lg: 0 16px 48px rgba(1,1,1,0.12), inset 0 1px 1px rgba(255,255,255,0.95);
  --shadow-glass-inner: inset 0 1px 1px rgba(255,255,255,0.9);
  --shadow-glass-inner-strong: inset 0 1px 1px rgba(255,255,255,1);
  --shadow-glass-header: inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1px 1px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.05);

  /* Glass Borders */
  --border-glass: 1px solid rgba(255,255,255,0.6);
  --border-glass-strong: 1px solid rgba(255,255,255,0.8);

  /* Gradients */
  --gradient-brand: linear-gradient(to right, #38C6F4, #4F84E8);
  --gradient-text: linear-gradient(to right, #38C6F4, #4F84E8, #35B678);
  --gradient-cta-shadow: 0 16px 32px color-mix(in oklch, #38C6F4 30%, transparent);

  /* Layout */
  --container-max: 80rem; /* 1280px */

  /* Transitions */
  --transition-fast: 200ms ease;
  --transition-normal: 500ms ease;
}
```

### Gradient Text Pattern

```css
/* Source: Redesign Hero.tsx, section headings */
.text-gradient {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### CTA Button Pattern

```css
/* Source: Redesign Hero.tsx, CTASection.tsx */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--gradient-brand);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-3xl);
  font-family: var(--font-body);
  font-size: var(--font-size-body-lg);
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: var(--gradient-cta-shadow), var(--shadow-glass-inner);
  transition: all var(--transition-fast);
  min-height: 48px;
  text-decoration: none;
}

.btn-primary:hover {
  box-shadow: 0 20px 40px color-mix(in oklch, #38C6F4 40%, transparent), var(--shadow-glass-inner);
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: var(--mu-text-900);
  padding: 1rem 2rem;
  border-radius: var(--radius-3xl);
  font-family: var(--font-body);
  font-size: var(--font-size-body-lg);
  font-weight: 600;
  border: var(--border-glass);
  cursor: pointer;
  box-shadow: var(--shadow-glass);
  transition: all var(--transition-fast);
  min-height: 48px;
  text-decoration: none;
}
```

### Inline Lucide SVG Example

```html
<!-- Source: lucide.dev, ArrowRight icon used in CTAs -->
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
     fill="none" stroke="currentColor" stroke-width="2" 
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>
```

## State of the Art

| Old Approach (current project) | New Approach (redesign migration) | Impact |
|------|------|--------|
| Inter/Manrope self-hosted woff2 | SF Pro system font stack (no downloads) | Faster load, smaller payload, no @font-face |
| Solid backgrounds (#F5F7F9, #1A365D) | Glassmorphism (white/60, backdrop-blur) | Complete visual overhaul |
| CSS transitions + IntersectionObserver | motion library (animate, inView) | Smoother animations, less custom JS |
| Single-page with anchor links | Multi-page static HTML | Better for SEO, clearer navigation |
| 8px spacing grid | 4px spacing grid (from UI-SPEC) | More granular spacing control |
| Dark navy footer/CTA sections | Glass surfaces everywhere | Unified visual language |
| Custom SVG icons (hand-drawn) | Lucide inline SVG icons (standardized) | Consistent icon language, easier maintenance |
| 2-color palette (blue + green) | 6-accent palette (blue, green, teal, orange, accent-blue, red) | Richer visual hierarchy |

**Deprecated/outdated in current project:**
- All `[data-theme="dark"]` CSS rules -- dark mode is deferred
- Inter/Manrope @font-face declarations -- replaced by system fonts
- Section wave dividers (`.section-divider`) -- not in redesign
- Navy background sections (`.section--dark`, `.final-cta` navy) -- replaced by glass
- Old color tokens (`--color-primary: #2B6CB0`, `--color-dark: #18212C`, etc.) -- entirely new palette

## Component Migration Map

| Redesign Component | Current HTML | Action |
|-------------------|-------------|--------|
| Hero.tsx | `.hero--hub` in index.html | Rewrite: add image composition, floating badges, gradient text |
| Header.tsx | `.site-header` | Rewrite: glassmorphism header, mobile menu, floating pill shape |
| StatsSection.tsx | `.social-proof` | Rewrite: glass cards grid, colored numbers, hover glow |
| ServicesSection.tsx | `.hub-services` | Rewrite: image cards with inner padding, Lucide icons, glass CTA |
| GuideSection.tsx | `.hub-guide` | Rewrite: image cards, floating icons, dramatic hover |
| WhyUsSection.tsx | `.advantages` | Rewrite: 2-col layout with image collage, advantage cards |
| ContactSection.tsx | `.lead-form-section` | Rewrite: coordinator card, glass form, new layout |
| CTASection.tsx | `.final-cta` | Rewrite: glass wrapper, background glow, image |
| Footer.tsx | `.footer` | Rewrite: glass wrapper, 4-col grid, gradient logo |
| Layout.tsx (mesh bg) | N/A | New: fixed mesh background with 3 animated blobs |
| OnlineConsultationsPage.tsx | `consultations.html` | Rewrite content with redesign structure |
| TreatmentAbroadPage.tsx | `treatment-abroad.html` | Rewrite content with redesign structure |
| CheckupsPage.tsx | `checkup.html` -> `checkups.html` | Rename + rewrite |
| ContactsPage.tsx | N/A | New page: contacts.html |

## JS Function Preservation Map

| Current Function | Keep/Replace | Notes |
|-----------------|-------------|-------|
| `initAccordion()` | KEEP | Reuse as-is, FAQ section preserved per CONTEXT.md |
| `initSmoothScroll()` | KEEP | Reuse, update selectors for new section IDs |
| `initStickyBar()` | MODIFY | May need selector updates for new section IDs |
| `initScrollAnimations()` | REPLACE | Replace with motion inView() in animations.js |
| `initPhoneMask()` | KEEP | Reuse as-is on all pages with forms |
| `initSpamProtection()` | KEEP | Reuse as-is on all pages with forms |
| `initFormValidation()` | MODIFY | Update selectors for new form HTML structure, add to service pages |
| `initStickyHeader()` | REPLACE | New header has different scroll behavior (bg-opacity, blur, padding transition) |
| `initAnimatedCounters()` | MODIFY | Update selectors (`.social-proof__number` -> new class), keep animation logic |

## Open Questions

1. **CSS Architecture: One file or many?**
   - What we know: Current project uses a single 2670-line styles.css. Redesign introduces ~3x more CSS (glass surfaces, multi-page, mesh background, new components).
   - What's unclear: Whether splitting into multiple files with @import is worth the HTTP overhead vs. keeping one large file.
   - Recommendation: Use one large file with clear section comment headers (same pattern as current). Avoid @import waterfall. Plan for future concatenation with clean-css-cli.

2. **motion CDN vs inline script**
   - What we know: motion can be loaded via CDN as ESModule or global script. Target audience is 45+ (may use older browsers).
   - What's unclear: Whether to use ES module import (cleaner) or global `<script>` (wider compatibility).
   - Recommendation: Use the non-module global script (`<script src="...motion.js">`) for maximum compatibility. Keep animation code in a separate `animations.js` that reads from `window.Motion`.

3. **Sticky mobile bar fate**
   - What we know: Current project has a sticky mobile CTA bar at bottom. Redesign does not have one.
   - What's unclear: Whether to keep it for 45+ mobile usability or remove for cleaner redesign.
   - Recommendation: Keep the sticky bar -- it's a proven conversion element for mobile 45+ users. Style it with glass aesthetic to match the redesign.

4. **Form on every service page?**
   - What we know: Redesign has ContactSection on HomePage and a separate ContactsPage with full form. Service pages link to /contacts.
   - What's unclear: Whether service pages should embed the form inline (current pattern) or link to contacts.html.
   - Recommendation: Embed a compact form on each service page for conversion, plus full form on contacts.html. The existing form JS handles multiple forms dynamically.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework for static HTML/CSS/JS) |
| Config file | none |
| Quick run command | Open index.html in browser, verify layout |
| Full suite command | Check all 5 HTML pages in Chrome, Safari, Firefox at mobile/tablet/desktop widths |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VISUAL-01 | Glass tokens applied correctly | manual | Visual inspection in browser | N/A |
| VISUAL-02 | Mesh background animates behind content | manual | Open index.html, verify blobs move | N/A |
| LAYOUT-01 | Responsive layout at 3 breakpoints | manual | Chrome DevTools responsive mode | N/A |
| ANIM-01 | Entrance animations fire on scroll | manual | Scroll through page, verify fade-in | N/A |
| FORM-01 | Form submits to Directus | manual | Fill form, submit, check Directus admin | N/A |
| NAV-01 | All page links work correctly | manual | Click every nav link, verify no 404s | N/A |
| A11Y-01 | 44px touch targets, WCAG AA contrast | manual | Lighthouse audit | N/A |

### Sampling Rate
- **Per task commit:** Visual check in Chrome at 375px and 1440px widths
- **Per wave merge:** Full 5-page walkthrough in Chrome + Safari
- **Phase gate:** Full suite across Chrome, Safari, Firefox at mobile/tablet/desktop

### Wave 0 Gaps
- None -- no automated test infrastructure for static HTML/CSS/JS project. Manual testing is the standard for this stack.

## Sources

### Primary (HIGH confidence)
- Redesign/src/ source code -- all component TSX files examined directly
- css/styles.css -- current CSS fully analyzed (2670 lines)
- js/main.js -- current JS fully analyzed (566 lines)
- UI-SPEC (01-UI-SPEC.md) -- complete visual contract
- CONTEXT.md (01-CONTEXT.md) -- user decisions

### Secondary (MEDIUM confidence)
- [Motion documentation](https://motion.dev/docs) -- animate, inView, scroll APIs for vanilla JS
- [Motion quick-start](https://motion.dev/docs/quick-start) -- CDN installation methods
- [Motion inView docs](https://motion.dev/docs/inview) -- Intersection Observer wrapper API

### Tertiary (LOW confidence)
- CDN version pinning strategy (motion@12) -- verify latest stable version before implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- project constraint (vanilla HTML/CSS/JS) is clear; motion is user-locked
- Architecture: HIGH -- both source and target codebases fully examined; migration path is well-defined
- Pitfalls: HIGH -- based on direct analysis of glass blur performance, font availability, CDN loading patterns
- Animation migration: MEDIUM -- motion vanilla JS API is documented but untested in this specific project context

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (30 days -- stable technology domain, no fast-moving dependencies)
