# Feature Research: v1.4 Visual Redesign

**Domain:** Medical consultation landing page — 2025 visual redesign (glassmorphism, dark mode, bold typography, micro-animations)
**Researched:** 2026-03-24
**Confidence:** HIGH (CSS/browser specs from MDN), MEDIUM (UX patterns for 45+ audience from research literature), LOW where flagged
**Scope:** This document covers ONLY new visual features for v1.4. For core landing page features (11 sections, form, Directus), see the original feature research (committed with v1.0).

---

## Research Context

The landing page has 11 sections, ~1,640 lines of CSS with a full CSS custom property token system, vanilla JS ES5, IntersectionObserver scroll animations, and self-hosted Inter/Manrope variable fonts. The v1.4 milestone adds a visual layer on top of a working, validated structure. The audience constraint — Kazakhstan residents 45+, medical service, 450 EUR price point — is the most important filter for every visual decision in this document.

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are visual features that, in 2025, users expect from any premium landing page. Missing them does not break functionality but signals "old-looking website" to users evaluating a 450 EUR medical service on trust.

| Feature | Why Expected | Complexity | Dependency on Existing System | Notes |
|---------|--------------|------------|-------------------------------|-------|
| Dark mode toggle | Operating systems default to dark mode; users with dark mode active who land on a bright page get visual discomfort; 45+ users with photosensitivity especially benefit from a working toggle | MEDIUM | Requires new CSS token layer; `[data-theme="dark"]` selector + localStorage | `prefers-color-scheme` media query is Baseline since 2020 (MDN-confirmed). Toggle must be in sticky nav (already exists). localStorage persistence across sessions is essential for repeat visitors. |
| Smooth theme transition | Instant flash from light to dark feels broken; a 300ms fade on background and text colors is expected | LOW | Adds `transition` on `:root` color tokens | Gate with `prefers-reduced-motion: reduce`. Zero duration when motion is reduced. |
| Legible text in dark mode | Dark mode that reduces contrast below WCAG AA breaks accessibility for the exact users who enabled dark mode for comfort | LOW | Requires carefully chosen dark-mode token values | White text on pure black (#000) causes halation for some users (MEDIUM confidence, ophthalmology UX literature). Use near-black (#18212C) backgrounds and off-white (#E8EFF6) text rather than pure values. |
| Visible interactive states | Buttons, links, and cards must have clear hover/focus states that work in both themes | LOW | Extend existing `--transition-fast` and `--transition-normal` tokens | Already have `translateY(-2px)` hover on cards. Focus rings must remain visible in dark mode. WCAG 2.1 SC 1.4.11 requires 3:1 non-text contrast ratio for focus indicators. |

### Differentiators (Competitive Advantage)

Visual features that elevate MedicusUnion KZ above typical medical landing pages while staying within the calm, trustworthy brand tone and the 45+ audience's cognitive tolerance.

| Feature | Value Proposition | Complexity | Dependency on Existing System | Notes |
|---------|-------------------|------------|-------------------------------|-------|
| Glassmorphism cards (selective) | On light mode, frosted-glass cards over gradient or mesh backgrounds signal "premium, modern, European" — matches the brand promise of accessing international medicine | MEDIUM | Requires gradient background behind card (cannot glass over plain white); `backdrop-filter: blur()` on card; semi-transparent card background | `backdrop-filter` is Baseline 2024 (MDN-confirmed: September 2024). Must provide solid-color fallback for users on older browsers (Android WebView pre-2024, older iOS Safari). Apply ONLY to 2-3 hero/stats/pricing cards — not all 11 sections. Too much glassmorphism reads as design student portfolio, not medical authority. |
| Dark mode with dual-purpose medical rationale | Dark mode is not just a visual trend — for patients researching medical conditions late at night (very common behavior), dark mode reduces eye strain during reading. This is a genuine user benefit, not decoration | MEDIUM | Full CSS token system rewrite with `[data-theme="dark"]` parallel token set | Dark mode enhances trust when marketed with medical rationale: "Режим для комфортного чтения в любое время". Position as care for the user, not just trendy feature. |
| Bold display headings | Increasing h1/h2 size to 48-56px (from current 36-32px) with font-weight 800 creates visual hierarchy that immediately anchors a 45+ user reading at arm's length or on a phone | LOW | Manrope Variable already loaded (weights 200-800); only token values change; must verify line-height remains readable at display sizes | Research: display text above 48px requires line-height 1.1 max (tighter than current 1.2 for headings). At 56px, 1.1 or even 1.05 works. Must add responsive scaling via `clamp()` so 56px desktop does not become illegible on 360px screens. |
| Micro-animation: scroll fade-in (enhanced) | The existing IntersectionObserver fade-in is functional but basic (opacity only). Adding a subtle vertical shift (20px → 0) makes reveals feel polished without the performance cost of heavy animations | LOW | Already have `animate-on-scroll` + `is-visible` classes; add `transform: translateY(20px)` to initial state and `transform: translateY(0)` to visible state | Duration 400ms ease-out. Stagger already in place (100ms per grid child). Gate everything behind `prefers-reduced-motion: reduce` — already done in the codebase, but ensure transform is also removed, not just opacity. |
| Micro-animation: button interaction depth | Adding a subtle `scale(0.97)` on CTA button `:active` state gives tactile click feedback, which is especially reassuring for older users who may not be sure if they "clicked properly" | LOW | Extend existing `.btn` styles; `active` state is not currently styled | Duration 100ms. Do not use on links — only on submit buttons and CTA buttons. Feels physically responsive. |
| CSS gradient mesh / subtle hero background | A soft color mesh or radial gradient behind the hero (blues and teals matching brand palette) provides depth without images and makes glassmorphism cards legible if applied to the hero area | LOW | New background on `.hero` section only; CSS `radial-gradient` layering | No image files needed. Pure CSS. Degrades gracefully. Dark mode variant should use deeper, darker gradients (deep navy + dark teal). |

### Anti-Features (Commonly Requested, Often Problematic)

Visual features that look impressive in design portfolios but actively harm conversion and trust for a 45+ medical audience.

| Feature | Why Requested | Why Problematic for This Project | Alternative |
|---------|---------------|----------------------------------|-------------|
| Full-page glassmorphism (every section) | "Looks premium, modern, Apple-inspired" | Requires a visually complex, busy background to work — glass over flat white looks broken and muddy. Applying to all 11 sections creates visual noise that disorients older readers trying to scan text. Medical trust requires text legibility above all. | Apply glassmorphism ONLY to 2-3 specific cards where a gradient background is already present (hero stats, pricing card). Flat clean background = flat clean cards everywhere else. |
| Parallax scroll effects | "Creates depth and premium feel" | Explicitly listed as Out of Scope in PROJECT.md. Causes motion sickness in older users. Triggers `prefers-reduced-motion`. Slows scroll performance on mid-range Android (common in KZ). Performance-wise, `will-change: transform` on multiple elements degrades composite layers on GPU-limited devices. | Subtle opacity fade-in on scroll (already implemented). No transform-based parallax. |
| Dark mode ONLY (no light mode) | "Dark is more premium in 2025" | Target audience spends significant daytime hours on the internet. Medical content with white/teal brand colors reads better on light backgrounds in daylight. Forcing dark mode removes user agency — the exact opposite of the care-oriented brand positioning. | Default to light mode. Toggle for dark. Respect `prefers-color-scheme` as initial state. |
| Auto-playing theme based on time of day | "Smart UX: dark at night, light during day" | Requires JS timer logic. Feels intrusive and surprising. The user's OS dark mode setting already expresses their preference — override it only via explicit toggle. Multiple systems fighting over the theme creates flash of wrong theme on load. | Respect `prefers-color-scheme` on first load. localStorage preference on subsequent visits. Explicit toggle for manual override. |
| CSS scroll-driven animations (animation-timeline) | "Latest CSS feature, no JS needed" | `animation-timeline` is explicitly NOT Baseline (MDN-confirmed: limited availability). Firefox support is limited as of 2026. The target audience includes users on older browsers. Using it without heavy fallback code adds complexity with zero benefit over the working IntersectionObserver implementation already in place. | Keep IntersectionObserver scroll animations. They work universally, are already implemented, and are well-tested in the codebase. |
| Video backgrounds or animated gradients | "Dynamic, modern, energetic" | VIDEO in hero is explicitly Out of Scope in PROJECT.md (bandwidth on mobile). Animated gradients (using CSS `@keyframes` on background-position) run continuously and cannot be disabled without JS. They violate the spirit of `prefers-reduced-motion` even when the user hasn't set the preference. For 45+ users, moving backgrounds while they are trying to read text creates cognitive overload. | Static gradient mesh or hero illustration. Motion only on user interaction (hover) or scroll-triggered (IntersectionObserver, one-shot). |
| White text on dark gradient cards | "Bold, modern, editorial" | The existing text color system (dark `#18212C` on light backgrounds) achieves 16.24:1 contrast. Switching to white text on colored gradient backgrounds requires extreme care — many gradient midpoints fall below 4.5:1 WCAG AA. The 45+ audience is the most vulnerable to contrast failures. Medical text (specializations, prices, process steps) must NEVER fall below AA compliance. | If using glassmorphism, ensure the backdrop is dark enough OR text is dark. Test every text/background combination. Light-on-dark only where the dark background is uniform enough to guarantee contrast. |
| Heavy box shadows on glassmorphism cards | "Makes glass look more realistic and elevated" | Heavy shadows on already-complex backgrounds create visual mud. The existing design moved to flat cards (v1.3 decision: `box-shadow` removed). Glassmorphism itself provides depth signal via blur — adding heavy shadows on top is double depth signaling and creates visual clutter for 45+ users. | `backdrop-filter: blur(20px)` + thin 1px `border: rgba(255,255,255,0.2)` outline provides sufficient glass depth. No heavy box-shadow on glass cards. |
| Dark mode with pure black background (#000000) | "True OLED dark mode" | Pure black backgrounds cause halation (bright halos around white text) for many users with astigmatism — prevalence increases significantly at 45+. Pure black can also cause eye fatigue during extended reading. | Use `#0F1923` or `#15202B` (near-black with slight blue/dark teal tint matching brand) as dark mode background. Softer on eyes, still clearly "dark mode". |

---

## Feature Dependencies

```
[Dark Mode Toggle (nav button)]
    └──writes-to──> [localStorage "theme"]
    └──sets-attribute──> [document.documentElement data-theme="dark"]
                             └──activates──> [CSS [data-theme="dark"] token block]
                                                └──overrides──> [:root light token values]

[Glassmorphism Cards]
    └──requires──> [Gradient/Mesh Background behind card]
    └──requires──> [backdrop-filter browser support OR solid fallback]
    └──degrades-to──> [Flat card with border on older browsers]

[Dark Mode] ──conflicts-with──> [Glassmorphism (light mode only)]
    └── In dark mode: replace glass effect with opaque dark card (#1E2C3A)
        Glass over dark background renders poorly — the blur has nothing visually
        interesting to filter

[Bold Display Typography]
    └──requires-validation-with──> [Manrope Variable font weight 800]
    └──requires-responsive-scaling-via──> [clamp() for font-size]
    └──requires-line-height-adjustment-at-display-sizes]

[Micro-animations (enhanced)]
    └──gates-on──> [prefers-reduced-motion: no-preference]
    └──extends──> [existing .animate-on-scroll / .is-visible system]
    └──no-conflict-with──> [Dark Mode] (purely visual layer, theme-independent)

[Theme Transition (CSS)]
    └──requires──> [transition property on :root OR body]
    └──conflicts-with──> [FOUC prevention]
        └── solution: add data-theme to <html> synchronously before paint (inline script
            reading localStorage, runs before CSS loads)
```

### Dependency Notes

- **Dark mode requires a synchronous inline script in `<head>`** to read localStorage before the first paint. Without it, users with a saved dark preference see a flash of light mode before JS loads. This is a critical implementation detail, not an optional optimization. The script must be `<script>` (not `type="module"`) to run synchronously.

- **Glassmorphism is incompatible with dark mode** applied to the same element. In dark mode, glass effect over dark backgrounds looks muddy and loses its visual purpose. The CSS must conditionally disable `backdrop-filter` on glass cards when `[data-theme="dark"]` is active and replace with a solid semi-dark card style.

- **Bold display typography requires `clamp()` responsive sizing** — a heading scaled to 56px on desktop becomes 56px on a 375px screen if only a fixed value is set. This is a regression risk for the 45+ mobile audience. Minimum readable size must be explicitly defined in the clamp lower bound (40px minimum for h1, 28px minimum for h2 at 375px width).

- **Enhanced micro-animations must not conflict with existing stagger system** — the existing `stagger-children` + `animate-on-scroll` + `is-visible` system works. Adding `transform: translateY(20px)` to the initial state of `.animate-on-scroll` must also be guarded by `prefers-reduced-motion` in the existing media query block (line 182-189 in styles.css). Check that the existing block removes `transform` not just `animation-duration`.

---

## MVP Definition (for v1.4 milestone)

### Launch With (v1.4)

Minimum feature set to constitute a visual redesign that meets the milestone goal.

- [ ] Dark mode toggle in navigation — the anchor feature of the redesign; all other features enhance light/dark
- [ ] CSS token expansion with `[data-theme="dark"]` parallel token set — prerequisite for all dark mode styling
- [ ] FOUC-prevention inline script for localStorage theme persistence — without this, dark mode toggle is broken for return visitors
- [ ] Bold display typography: h1 56px/800w, h2 44px/800w with `clamp()` responsive scaling — higher-impact, lower-risk than glassmorphism
- [ ] Enhanced scroll animations: `translateY(20px → 0)` on `.animate-on-scroll` — extends existing system, low risk
- [ ] Button `:active` micro-interaction: `scale(0.97)` on CTA buttons — tactile feedback, 100ms, tiny scope
- [ ] Hero section gradient mesh background — enables glassmorphism on hero stats and provides visual richness
- [ ] Glassmorphism on hero stats block and pricing card only (2 elements maximum) — selective, high-impact, avoids over-application
- [ ] Smooth theme transition: 300ms fade on color tokens (disabled under `prefers-reduced-motion`) — polish

### Add After Validation (v1.4.x)

- [ ] Glassmorphism on nav bar in light mode (frosted header) — evaluate after seeing hero glass in production; depends on visual coherence
- [ ] Card hover micro-interaction refinement — existing `translateY(-2px)` works; evaluate adding a subtle shadow increase on hover for depth in light mode
- [ ] Dark mode color refinement pass — real-device testing on OLED and LCD screens at 45+ typical distances

### Defer to v2+

- [ ] CSS scroll-driven animations (animation-timeline + view()) — NOT Baseline, Firefox gap; defer until widely supported
- [ ] View Transitions API for theme switch animation — interesting but adds complexity for marginal gain; not worth testing on this audience
- [ ] @starting-style entrance animations for dynamic content — Baseline 2024 but this page has no dynamic DOM insertion patterns

---

## Feature Prioritization Matrix (v1.4 scope only)

| Feature | User Value | Implementation Cost | Priority | Risk for 45+ Audience |
|---------|------------|---------------------|----------|-----------------------|
| Dark mode toggle + tokens | HIGH | MEDIUM | P1 | LOW — pure user benefit, opt-in |
| Bold display typography (h1/h2) | HIGH | LOW | P1 | LOW — increases readability |
| FOUC prevention inline script | HIGH (retention) | LOW | P1 | LOW — invisible to user when working |
| Enhanced scroll animations | MEDIUM | LOW | P1 | LOW — `prefers-reduced-motion` already gated |
| Hero gradient mesh background | MEDIUM | LOW | P1 | LOW — static, no motion |
| Glassmorphism on hero stats + pricing (2 elements) | MEDIUM | MEDIUM | P1 | LOW if applied selectively with proper contrast |
| Button `:active` scale micro-interaction | MEDIUM | LOW | P1 | LOW — 100ms, tactile, not disorienting |
| Smooth theme transition | LOW | LOW | P2 | LOW — gated under prefers-reduced-motion |
| Nav bar glassmorphism | LOW | LOW | P2 | LOW if contrast maintained |
| Dark mode OLED refinement | LOW | LOW | P3 | MEDIUM — requires physical device testing |

**Priority key:**
- P1: In v1.4 initial release
- P2: In v1.4 follow-up patch after review
- P3: Future milestone

---

## Domain-Specific Research Findings

### 1. Glassmorphism / Liquid Glass in 2025

**What it actually requires (not what tutorials show):**

Glassmorphism requires THREE things simultaneously to work: (a) `backdrop-filter: blur(Npx)` on the element, (b) a semi-transparent background on the element (e.g., `rgba(255,255,255,0.15)`), and (c) a visually complex background BEHIND the element (a gradient, mesh, image, or blur-able content). Without (c), the glass effect is invisible — there is nothing to blur through.

**Browser support:** `backdrop-filter` is Baseline 2024 (newly available since September 2024, per MDN). Works across Chrome/Edge/Safari/Firefox latest. Older devices (pre-2024 Android WebView, very old iOS Safari) may not support it. Provide fallback: `@supports not (backdrop-filter: blur(1px)) { .glass { background: rgba(255,255,255,0.9); } }`.

**Blur value guidance (confidence: MEDIUM, from design community patterns):**
- `blur(8px)` — subtle, barely noticeable, appropriate for nav bars
- `blur(16-20px)` — the sweet spot for cards; clearly glassy without heavy performance cost
- `blur(40px+)` — heavy, used in Apple-style "liquid glass"; GPU-intensive on mobile; avoid

**Background needed:**
- For light mode: radial gradient with brand colors (teal #38C6F4, green #1AC67E) at 10-15% opacity on white creates sufficient visual complexity. This is the recommended approach — pure CSS, no images.
- For dark mode: disable the glass effect entirely. Replace with opaque dark card. Glass on dark backgrounds renders as a murky smear.

**Performance:** `backdrop-filter` creates a new composite layer and forces GPU compositing. On mid-range Android (common in KZ), more than 3-4 glass elements visible simultaneously can cause scroll jank. Limit to 2 glass elements per viewport.

**Confidence:** HIGH for browser support facts (MDN-verified). MEDIUM for visual guidance (design community patterns, not official standards).

### 2. Dark Mode UX for Medical/Health 45+ Audience

**Key findings from UX literature and WCAG (MEDIUM confidence overall):**

Dark mode reduces blue light emission, which benefits evening/night reading. For 45+ users with presbyopia or early cataracts (both increase with age), reduced glare from a dark background can reduce eyestrain during extended reading sessions — precisely the behavior of a patient researching a medical consultation late at night.

**What DOES work for 45+:**
- Near-black background with slight color tint (not pure black) — e.g., `#0F1923` or `#15202B`. Pure `#000000` creates halation around light text for astigmatic users (HIGH prevalence at 45+).
- Off-white text (e.g., `#E8EFF6`) rather than pure `#FFFFFF`. Reduces contrast harshness.
- Reduced contrast differential in dark mode is acceptable and often preferable — WCAG AA (4.5:1) is the floor, not the ceiling; going much higher than 7:1 in dark mode can cause eye strain for 45+ users.
- Semantic color preservation: the green CTA (`#1AC67E`) should become slightly desaturated and brighter in dark mode to maintain the same visual "call to action" weight without burning on a dark background.

**What to AVOID:**
- Red/orange accent colors for errors or warnings in dark mode — these produce strong blue-light contrast that is especially uncomfortable for older eyes.
- Images that were optimized for light backgrounds look washed-out in dark mode. Any white-bg photos/illustrations need dark-mode-specific treatment or a dark overlay.
- The existing SVG hero illustration uses duotone colors — in dark mode it must either be recolored via CSS `filter` or inverted intelligently.

**Toggle positioning:** The 45+ audience needs to be able to FIND the toggle. Place it in the sticky navigation, with a recognizable sun/moon icon (not just a label), at a minimum 44x44px touch target. Label it "Тёмная тема" as a tooltip/aria-label for accessibility.

**Confidence:** MEDIUM. Derived from WCAG 2.1 spec, NNGroup's dark mode research, and ophthalmology UX literature. No Kazakhstan-specific study found.

### 3. Bold/Display Typography on Health Landing Pages

**Current state:** h1: 2.25rem (36px), h2: 2rem (32px), font-weight: 700. Manrope Variable loaded with weights 200-800.

**Research finding:** The "bold editorial" trend in 2025 (Vercel, Linear, Stripe landing pages) uses 700-800 weight at 56-72px for h1. For a medical landing page targeting 45+, 56px/800w h1 is the appropriate ceiling — bolder than current, but not the extreme 80px+ editorial style that would feel out of place on a medical site.

**Recommended scale:**
- h1: `clamp(40px, 5vw, 56px)`, font-weight: 800
- h2: `clamp(28px, 3.5vw, 44px)`, font-weight: 800
- h3: `clamp(22px, 2.5vw, 32px)`, font-weight: 700 (unchanged category, bump value)
- Body: 18px (unchanged — already correct for 45+)

**Line height for display sizes:** At 48px+, line-height of 1.2 (current) begins to feel spacious. The display-text convention is 1.0-1.15. For Cyrillic text, 1.1 works well at 48px+ without letters touching ascenders/descenders.

**Color:** In light mode, h1/h2 in `#18212C` (current `--color-text-primary`, 16.24:1 contrast) is correct. Avoid colored headings (teal/green) for body headings — acceptable for section labels or badges but not for multi-word headings where scanning is needed by older users.

**Dark mode:** h1/h2 in `#E8EFF6` on `#0F1923` maintains approximately 12:1 contrast — well above WCAG AAA, appropriate for the audience.

**Confidence:** MEDIUM for the specific size recommendations (design community consensus, not a clinical standard). HIGH for the clamp() technique and Manrope Variable weight availability.

### 4. Micro-Animations: What Works for 45+ Audience

**Core principle:** For 45+ medical audience, animations must CONFIRM, not ENTERTAIN. Every animation should make the user more confident in what is happening, not add visual complexity.

**Recommended animations (all gated by `prefers-reduced-motion: reduce`):**

| Animation | Element | Duration | Easing | Why It Helps 45+ |
|-----------|---------|---------|--------|------------------|
| Fade + slide-up on scroll reveal | Cards, section headings | 400ms | ease-out | Shows content is loading/appearing in a natural direction; confirms the page is interactive |
| Scale-down on button active | CTA buttons | 100ms | ease | Confirms the tap/click registered — critical for users uncertain about touch inputs |
| Color change on input focus | Form fields | 150ms | ease | Confirms which field is active — visual affordance for users less familiar with digital forms |
| Accordion expand/collapse | FAQ items | 250ms | ease-in-out | Already implemented; confirms action and shows content relationship |
| Theme fade transition | Background + text colors | 300ms | ease | Smooth transition confirms the toggle worked and shows the theme shift is intentional |
| Nav underline on hover | Navigation links | 150ms | ease | Hover state affordance |

**Timing guidance:**
- 100ms: tactile feedback (button active, checkbox tick)
- 150-250ms: hover states, focus transitions
- 300-400ms: scroll reveals, theme transitions
- 500ms+: transitions that feel "laggy" for this audience — avoid

**What NOT to animate for 45+:**
- Numbers counting up (counters) — visually noisy, can be disorienting for users with any cognitive variation
- Typing effects — patronizing, adds perceived wait time
- Floating/bouncing elements — constant motion in peripheral vision is tiring; more so for older users
- Hover-triggered transforms on text — reading-in-progress should not be visually disrupted

**Stagger timing:** The existing 100ms-per-child stagger on grid cards is correct. Increase the stagger to 120ms for the 45+ audience — slightly slower is more reassuring than slightly faster.

**`prefers-reduced-motion` implementation:** The existing codebase already gates animations with `prefers-reduced-motion: reduce` at lines 182-189 (styles.css) and in `initScrollAnimations()` (main.js). Ensure that any new `transform: translateY()` animations added in v1.4 are also suppressed. The existing block sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` globally — but `transform` changes applied via class addition (`.is-visible`) also need to reset the transform via `transform: none` in the reduced-motion block, not just duration-zero it.

**Confidence:** HIGH for timing values and `prefers-reduced-motion` implementation (web standards). MEDIUM for the 45+-specific behavioral notes (UX literature, not clinical research).

---

## Accessibility Requirements (Non-Negotiable for v1.4)

These are not features — they are prerequisites that all v1.4 features must satisfy:

1. **WCAG AA contrast in ALL states:** Light mode, dark mode, hover state, focus state, button active state, glassmorphism cards, gradient backgrounds. Every text/background combination must achieve 4.5:1 minimum. Use a contrast checker on every new token pair.

2. **`prefers-reduced-motion: reduce` compliance:** ALL new animations (scroll reveal enhancement, button scale, theme transition) must produce no transform or opacity transition under reduced motion. Not just duration-zero — the start and end state must be identical (no visual change).

3. **Dark mode toggle keyboard accessible:** The toggle button must have `role="button"` or be a `<button>`, must have `aria-pressed="true/false"` state, and must be focusable with visible focus ring in both themes.

4. **No contrast regression from glassmorphism:** Glass cards must maintain text contrast against the blurred background. Test with `backdrop-filter: blur(0)` disabled (fallback state) and with blur active. If any blur midpoint creates a light zone under dark text, increase text shadow or adjust glass opacity.

5. **Touch targets remain 48x48px minimum:** The dark mode toggle, navigation links, and any new interactive elements must meet this. Do not reduce touch target size for visual design reasons.

---

## Implementation Notes for the Existing CSS Architecture

The current CSS uses a single `:root` token block. The recommended implementation for dark mode is:

```css
/* Existing :root = light mode (unchanged) */
:root { --color-background: #ffffff; ... }

/* Dark mode override */
[data-theme="dark"] {
  --color-background: #0F1923;
  --color-text-primary: #E8EFF6;
  /* ... all tokens that change in dark mode */
}

/* System preference (no saved preference) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-background: #0F1923;
    /* ... */
  }
}
```

The `color-scheme` property should be declared:
```css
:root { color-scheme: light dark; }
[data-theme="dark"] { color-scheme: dark; }
```

This ensures browser-native form controls and scrollbars adapt to the active theme.

The FOUC-prevention inline script (synchronous, in `<head>`, before CSS `<link>`):
```html
<script>
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

This must run synchronously (not `type="module"`, not `defer`, not `async`).

---

## Sources

### Confirmed (HIGH confidence — primary sources)

- MDN Web Docs: `backdrop-filter` — Baseline 2024, confirmed September 2024 availability
- MDN Web Docs: `animation-timeline` — confirmed NOT Baseline, limited availability as of research date
- MDN Web Docs: `prefers-reduced-motion` — Baseline Widely Available since January 2020
- MDN Web Docs: `prefers-color-scheme` — Baseline Widely Available since January 2020
- MDN Web Docs: `color-scheme` property — Baseline Widely Available since January 2022
- MDN Web Docs: `@starting-style` — Baseline 2024, available since August 2024 (not used in v1.4)
- MedicusUnion KZ codebase: styles.css `:root` token block, existing animation implementation, `prefers-reduced-motion` gate at lines 182-189
- PROJECT.md: 45+ audience constraint, mobile-first constraint, "без маркетинговой агрессии" tone, Out of Scope list (parallax, video, heavy animations)

### Referenced (MEDIUM confidence — design and UX literature)

- W3C WAI: Developing Websites for Older People — accessibility patterns for aging users
- WCAG 2.1 SC 1.4.3 (Contrast Minimum), 1.4.11 (Non-text Contrast) — accessibility standards
- Nielsen Norman Group: Dark Mode Research — dark mode UX patterns and reading research
- Web.dev + Chrome for Developers: CSS glassmorphism and backdrop-filter usage patterns
- Design community consensus on 2025 display typography scales (Vercel, Stripe, Linear landing pages) — LOW individual source confidence, MEDIUM as converging consensus

### Not Found / Unable to Verify

- Kazakhstan-specific data on 45+ user dark mode preference rates — no authoritative source found; relied on general aging UX literature
- Clinical ophthalmology studies on web dark mode for presbyopic users — mentioned in design literature but primary clinical sources not located; halation claim is MEDIUM confidence

---

*Feature research for: MedicusUnion KZ Landing — v1.4 Visual Redesign*
*Researched: 2026-03-24*
*Downstream consumer: v1.4 roadmap phase planning*
