# Technology Stack: UI/UX Design Excellence Additions

**Project:** MedicusUnion KZ Landing -- v7.0 UI/UX Design Excellence
**Researched:** 2026-04-13
**Mode:** Ecosystem (additions to existing vanilla CSS/JS stack)
**Overall Confidence:** HIGH

---

## Target Browser Profile (Kazakhstan)

Before any feature recommendations, the target audience constrains everything.

| Browser | KZ Mobile Share | Engine | Key Constraint |
|---------|----------------|--------|----------------|
| Chrome Mobile | ~50% | Blink (Chromium 130+) | Primary target. Latest CSS features available |
| Safari Mobile | ~39% | WebKit | iOS users. Safari 17.5+ baseline realistic |
| Yandex Browser | ~5% | Blink (Chromium-based) | Follows Chrome support closely |
| Samsung Internet | ~3% | Blink (Chromium 130) | v29 stable, tracks Chrome ~2 versions behind |
| Opera/UC/Other | ~3% | Mixed | Negligible; progressive enhancement OK |

**Practical baseline:** Chrome 117+ / Safari 17.5+ / Firefox 121+ covers ~97% of KZ users.
**Source:** [StatCounter Kazakhstan Mobile Browser Share (March 2026)](https://gs.statcounter.com/browser-market-share/mobile/kazakhstan)
**Confidence:** HIGH

---

## Part 1: CSS Features to Adopt

### Tier 1 -- Use Now (Baseline, safe for KZ audience)

| Feature | Browser Support | Purpose for This Project | Integration Point | Confidence |
|---------|----------------|--------------------------|-------------------|------------|
| `color-mix(in oklch, ...)` | Chrome 111+ / Safari 16.2+ / Firefox 113+ / Edge 111+ -- Baseline Widely Available | Generate glass opacity variants, hover states, dark-mode tints from single brand token without hardcoding rgba values. Replace dozens of manual rgba() calculations in liquid-glass tokens | `theme.css` `:root` and `.dark` token blocks | HIGH |
| `light-dark()` | Chrome 123+ / Safari 17.5+ / Firefox 120+ -- Baseline Newly Available (Widely Available Nov 2026) | Simplify dark mode token declarations. Currently ~60 lines of `.dark {}` override block can become single-line `light-dark(lightVal, darkVal)` per token | `theme.css` -- could halve the dark mode override block | HIGH |
| `:has()` selector | Chrome 105+ / Safari 15.4+ / Firefox 121+ -- Baseline (Widely Available Jun 2026) | Parent-aware styling: style form containers based on validation state of children, style FAQ items based on open state, style cards based on content presence. Eliminates JS class-toggling for pure-CSS state reactions | `styles.css` component layer, liquid-glass.css card variants | HIGH |
| `text-wrap: balance` | Chrome 114+ / Safari 17.5+ / Firefox 121+ | Already partially used. Ensure all `h1`-`h3` elements use it for balanced line breaks. Critical for Russian text which has longer words | Already in codebase (v1.4). Verify comprehensive coverage on all heading elements | HIGH |
| `@starting-style` | Chrome 117+ / Safari 17.5+ / Firefox 129+ -- Baseline Newly Available | Animate glass elements from `display: none` to visible without JS timing hacks. Direct replacement for the FAQ accordion max-height hack and mobile menu overlay show/hide. Also enables smooth entry animations for form success/error messages | FAQ accordion `.faq__answer`, mobile menu `.mobile-menu-overlay`, form success/error messages | HIGH |
| `prefers-contrast: more` | Chrome 96+ / Safari 14.1+ / Firefox 101+ / Samsung 17+ -- ~95% global coverage | Critical for glass accessibility. When user requests increased contrast, increase `--liquid-bg` opacity, add solid borders, boost text shadows, reduce blur. Directly addresses Liquid Glass audit gap (currently 85% compliance) | New `@media (prefers-contrast: more)` block in theme.css | HIGH |
| `content-visibility: auto` | Chrome 85+ / Safari 18+ / Firefox 125+ -- Baseline 2025 | Skip rendering off-screen sections on initial load. With 11 sections + service pages, this is free performance. Must pair with `contain-intrinsic-size` to prevent scroll jump | Each `<section>` in page HTML, plus off-screen service page content | HIGH |
| Popover API (`popover` attribute) | Chrome 114+ / Firefox 125+ / Safari 17+ -- Baseline Widely Available | Replace custom tooltip/overlay JS with native popover for doctor specialty tooltips, info popovers. Built-in light dismiss, focus management, top-layer stacking | Future tooltip/info components. Not critical for existing features but valuable for new interactions | MEDIUM |

### Tier 2 -- Use with Progressive Enhancement (@supports gate required)

| Feature | Browser Support | Purpose for This Project | Risk | Confidence |
|---------|----------------|--------------------------|------|------------|
| CSS Scroll-Driven Animations (`animation-timeline: view()`) | Chrome 115+ / Safari 26+ (beta) / Firefox: flag only | Replace IntersectionObserver-based scroll-reveal with pure CSS. Lighter, declarative, GPU-composited. Current IO-based approach becomes the fallback for unsupported browsers | Firefox still requires flag as of Apr 2026. ~55% KZ coverage without fallback. Safari 26 not yet stable. **Use as enhancement only, keep IO as base** | MEDIUM |
| View Transitions API (same-document) | Chrome 111+ / Safari 18+ / Firefox 133+ -- Baseline Newly Available (Oct 2025) | Smooth page transitions when navigating between service pages (multi-page site). Cross-document: add `@view-transition { navigation: auto; }` CSS + `view-transition-name` on shared elements (header, hero) | Cross-document transitions need Chrome 126+. Safari 18 support confirmed. **Use for page navigation feel, with graceful degradation (hard reload in old browsers)** | MEDIUM |
| `interpolate-size: allow-keywords` | Chrome 129+ / Edge 129+ only (Chromium-only as of Apr 2026) | Animate `height: auto` natively for FAQ accordion instead of max-height hack. Would make `@starting-style`-based accordion trivial | **Chromium-only.** No Safari, no Firefox. ~55% KZ coverage. Not safe as primary approach. Keep as enhancement layer on top of `@starting-style` + max-height fallback | LOW |
| `text-wrap: pretty` | Chrome 117+ / Safari 26+ / No Firefox | Prevent orphans on last line of paragraphs. Russian medical text benefits. Graceful degradation: normal wrapping in Firefox | Firefox shows normal wrapping -- no visual breakage, just less optimal. Safe to ship | MEDIUM |
| CSS Anchor Positioning | Chrome 125+ / Safari 26+ / Firefox 147+ -- ~85% global | Declarative tooltip/popover positioning without JS offset calculations | Still in Working Draft. Safari 26 / Firefox 147 very recent. **Defer to Tier 1 Popover API for now** | LOW |

### Tier 3 -- Do NOT Use Yet

| Feature | Why Not |
|---------|---------|
| Container Queries (`@container`) | Already excluded in CLAUDE.md. Media queries sufficient for known breakpoints. Adds complexity without benefit for landing page fixed layouts |
| `@scope` | Chrome 118+ / Safari 17.4+ / Firefox: No. BEM naming already provides scope isolation in this codebase |
| `corner-shape: squircle` | Chrome 139+ only (Canary). Project already has SVG mask-based squircles working cross-browser. Not worth switching until Baseline |
| CSS Custom Highlight API | No clear use case for a medical landing page |
| `field-sizing: content` | Chromium-only. No Safari, no Firefox. Too limited for production |
| CSS Nesting (in styles.css) | NOT for css/styles.css (vanilla CSS, no build step). Already works in src/styles/ via Tailwind v4 processing. No migration needed |

---

## Part 2: Color and Contrast Tools for Glass Surfaces

Glass surfaces create the hardest contrast testing scenario: the background is semi-transparent and varies based on what is behind it. Standard WCAG 2.x ratio tools test static color pairs, not dynamic composited surfaces.

### Recommended Contrast Testing Strategy

| Tool/Method | Purpose | When to Use | Confidence |
|-------------|---------|-------------|------------|
| **APCA (apca-w3 npm)** | Perceptual contrast algorithm (WCAG 3.0 candidate). Better at evaluating readable vs. unreadable on semi-transparent surfaces because it accounts for font weight, size, and polarity (light-on-dark vs dark-on-light) | During development: test glass text contrast with worst-case background composites. Check both light and dark mode | HIGH |
| **Manual worst-case testing** | Screenshot glass card over lightest possible background AND darkest possible background, measure contrast of the resulting composite color | Every glass element must pass with the worst-case background behind it, not just the typical background | HIGH |
| **WebAIM Contrast Checker** | Quick WCAG 2.x AA verification for non-glass static elements (form fields, footer text, badges) | Standard text elements that are not on glass surfaces | HIGH |
| **Chrome DevTools contrast overlay** | Built into Elements inspector. Shows contrast ratio with AA/AAA pass/fail in real-time. Works with computed background (including backdrop-filter composites) | Live testing during development. The inspector shows the actual composited color behind glass, not just the declared background | HIGH |
| **`prefers-contrast: more` CSS** | CSS-only safety net: when user requests high contrast, increase glass opacity to 0.85+, add solid 1px borders, add text-shadow for readability | Ship as part of v7.0. This is the primary mitigation for glass accessibility | HIGH |

### APCA npm Package

```bash
npm install -D apca-w3
```

- **Package:** `apca-w3` v0.1.9 ([npm](https://www.npmjs.com/package/apca-w3))
- **API:** `apcaContrast(textColor, bgColor)` returns Lc value (0-106 scale)
- **Thresholds:** Lc 75+ for body text, Lc 60+ for large text, Lc 45+ for non-text UI
- **Note:** APCA is the proposed WCAG 3.0 method but WCAG 2.1 AA (4.5:1 / 3:1) remains the legal standard as of Apr 2026. Use APCA as a supplementary check, not a replacement for WCAG 2.x compliance
- **Confidence:** HIGH (tool works; MEDIUM on whether APCA will be ratified in WCAG 3.0)

### Glass-Specific Contrast Testing Protocol

1. **Compute worst-case composite:** For each glass element, identify the lightest and darkest possible background content that could appear behind it
2. **Calculate effective background:** `glass_opacity * glass_bg_color + (1 - glass_opacity) * worst_case_background`
3. **Test text contrast** against this effective background color using both WCAG 2.x ratio AND APCA Lc
4. **Test with `prefers-contrast: more`** active to verify the enhanced mode is sufficient
5. **Test with blur disabled** (slow devices skip backdrop-filter) -- text must be readable on the flat `--liquid-bg` color alone

---

## Part 3: Accessibility Testing Tools

### Recommended Dev Dependencies

| Tool | npm Package | Version | Purpose | Confidence |
|------|-------------|---------|---------|------------|
| **Lighthouse CLI** | `lighthouse` | 13.1.0 | Performance + accessibility audit from command line. Powered by axe-core. Run as CI check or manual audit. Requires Node 22 LTS+ | HIGH |
| **Pa11y** | `pa11y` | 8.x | CLI accessibility scanner with WCAG 2.2 AA/AAA standard selection. Different rule engine than Lighthouse (htmlcs by default, also supports axe runner) catches different issues. Use both for maximum coverage | HIGH |
| **axe-core** | `axe-core` | 4.11.2 | Programmatic accessibility engine. Can be injected into a page via a test script. 57% of WCAG issues caught automatically. Industry standard, zero false positives | HIGH |
| **@axe-core/cli** | `@axe-core/cli` | latest | Quick command-line wrapper for axe-core. `npx axe http://localhost:3000/` for instant results | HIGH |

### Installation

```bash
# Accessibility testing (dev only)
npm install -D lighthouse pa11y axe-core @axe-core/cli

# Contrast checking (dev only)
npm install -D apca-w3
```

### Usage Patterns

```bash
# Lighthouse: full audit (outputs HTML report)
npx lighthouse http://localhost:3000 --output=html --output-path=./audit.html

# Lighthouse: accessibility only, desktop preset
npx lighthouse http://localhost:3000 --only-categories=accessibility --preset=desktop

# Pa11y: WCAG 2.2 AA standard
npx pa11y http://localhost:3000 -s WCAG2AA

# Pa11y: all pages via config
npx pa11y-ci --config .pa11yci.json

# axe-core CLI: quick scan with specific rules
npx axe http://localhost:3000 --rules color-contrast,image-alt,label
```

### What Automated Tools Cannot Test (Manual Required)

Automated tools catch approximately 30-40% of WCAG issues. The following require manual testing:

- Focus order and keyboard navigation flow through all interactive elements
- Screen reader announcement correctness (VoiceOver on iOS for Safari audience)
- Glass surface text readability under varying dynamic backgrounds
- Touch target sizes on actual devices (45+ audience: 48px minimum recommended)
- Color-only information indicators (status badges, form validation)
- Meaningful link text (not "read more")
- Form error recovery flow end-to-end
- `prefers-contrast: more` visual rendering on real OS with the preference set

---

## Part 4: Performance Profiling Tools

| Tool | How to Access | Purpose | Confidence |
|------|---------------|---------|------------|
| **Lighthouse CLI** (same as above) | `npx lighthouse --only-categories=performance` | Lab performance metrics: LCP, CLS, TBT, INP. Throttled to simulate mid-tier mobile on 4G | HIGH |
| **Chrome DevTools Performance panel** | F12 > Performance | Record page load, identify long tasks, paint timing, GPU compositing layers. Essential for glass blur budget profiling | HIGH |
| **Chrome DevTools Layers panel** | F12 > More tools > Layers | Visualize compositing layers created by `backdrop-filter`. Each glass element creates a separate compositing layer. Use to verify glass-per-viewport budget (max 2) | HIGH |
| **Chrome DevTools Rendering tab** | F12 > More tools > Rendering | "Paint flashing" shows real-time repaint areas. "Layer borders" shows compositing boundaries. "Core Web Vitals" overlay shows LCP/CLS in-page | HIGH |
| **WebPageTest** | webpagetest.org | Real device testing with filmstrip comparison. Can test from locations closer to Kazakhstan (India/Singapore nodes) | HIGH |
| **CrUX API** | `https://chromeux.googleapis.com/v1/records:queryRecord` | Real user data from Chrome users visiting the site. Field metrics, not lab. Requires sufficient production traffic | MEDIUM (requires production traffic volume) |

### Glass-Specific Performance Checks

| Check | Tool | What to Look For |
|-------|------|-----------------|
| Compositing layer count | DevTools > Layers | Each `backdrop-filter` element = 1 GPU layer. Budget: max 2 visible glass layers per viewport |
| Blur budget on mobile | DevTools > Performance (CPU 4x slowdown) | `backdrop-filter: blur(24px)` is expensive. On budget Android, reduce to `blur(12px)` via media query |
| Paint area on scroll | DevTools > Rendering > Paint flashing | Glass elements behind sticky header cause continuous repaint of header area. `will-change: transform` on header only (not static cards) |
| Total GPU memory | DevTools > Performance > GPU | Monitor GPU memory during scroll. If it exceeds ~100MB on mobile, reduce glass layer count |
| CLS from content-visibility | DevTools > Performance > Layout Shift | If using `content-visibility: auto`, verify `contain-intrinsic-size` prevents layout shifts |

---

## Part 5: Animation Approach Decision

### Do NOT Add an Animation Library

The project constraint is vanilla CSS + JS with no frameworks. Animation libraries violate this constraint.

| Library | Why NOT |
|---------|---------|
| GSAP | 27KB+ min. Overkill for scroll-reveal and hover effects. Creates JS dependency for visual effects that CSS can handle natively |
| Motion One | 4KB. Lighter but still adds a dependency. CSS scroll-driven animations will replace its core use case |
| Lottie | Heavy runtime (50KB+). No complex animations needed. Target audience (45+) prefers subtle motion |
| Anime.js | 17KB. Same reasoning as GSAP -- the animations needed here are simple enough for CSS |

### Recommended Animation Stack (Pure CSS + Minimal JS)

| Animation Type | Current Approach | v7.0 Improvement |
|----------------|-----------------|-------------------|
| Scroll reveal (fade-in + translateY) | IntersectionObserver + class toggle | Keep IO as base. Add CSS `animation-timeline: view()` as progressive enhancement via `@supports` |
| FAQ accordion expand/collapse | `max-height` hack (0 to 500px) | `@starting-style` + `display: none` transition. `interpolate-size` as Chromium-only enhancement |
| Button press | `:active { scale(0.97) }` | Keep. Ensure using `transition: scale var(--dur-press) var(--ease-liquid)` token |
| Hover lift | `translateY(-2px)` | Keep. Ensure all interactive cards use consistent `--dur-hover` timing token |
| Page navigation | None (hard reload between pages) | Add `@view-transition { navigation: auto; }` for cross-page fade. Header gets `view-transition-name: header` for persistence across navigation |
| Mobile menu show/hide | `display: none` / `.is-open` class toggle | `@starting-style` entry animation + `transition-behavior: allow-discrete` for smooth open/close |
| Form success/error | `display: none` / `.is-visible` class toggle | Same `@starting-style` pattern for smooth appearance |
| Glass shimmer | `@keyframes shimmer-sweep` (existing) | Keep. Limit to 1 per viewport. Verify `prefers-reduced-motion` guard is in place |

---

## Part 6: Recommended color-mix() Migration Path

The most impactful CSS improvement for this project. Currently, `theme.css` has ~30 hardcoded rgba values for glass tokens. With `color-mix()`, these can derive from a few base colors.

### Before (current theme.css pattern)

```css
:root {
  --liquid-bg: rgba(255, 255, 255, 0.42);
  --liquid-border-top: rgba(220, 225, 235, 0.7);
  --liquid-shadow-outer: 0 16px 40px rgba(20, 30, 60, 0.16);
}
.dark {
  --liquid-bg: rgba(30, 40, 60, 0.45);
  --liquid-border-top: rgba(255, 255, 255, 0.25);
  --liquid-shadow-outer: 0 16px 40px rgba(0, 0, 0, 0.45);
}
```

### After (v7.0 with color-mix + light-dark)

```css
:root {
  --glass-base-light: oklch(100% 0 0);        /* white */
  --glass-base-dark: oklch(22% 0.02 260);      /* navy-grey */
  --glass-base: light-dark(var(--glass-base-light), var(--glass-base-dark));

  --liquid-bg: color-mix(in oklch, var(--glass-base) 42%, transparent);
  --liquid-border-top: light-dark(
    color-mix(in oklch, oklch(85% 0.01 260) 70%, transparent),
    color-mix(in oklch, white 25%, transparent)
  );
}
```

**Benefits:**
- Single source of truth for glass tinting
- Dark mode values derive automatically via `light-dark()`
- Changing brand color propagates through all glass surfaces
- Easier to create `prefers-contrast: more` variants (just increase mix percentages)

**Risk:** MEDIUM. This is a significant refactor of theme.css. Should be done as a dedicated phase with visual regression testing (screenshot comparison before/after).

---

## Part 7: Modern CSS Features Already In Use (Verify and Expand)

These features are already in the codebase. The v7.0 milestone should verify they are applied comprehensively.

| Feature | Current Status | v7.0 Action |
|---------|---------------|-------------|
| `text-wrap: balance` | Used on some headings (v1.4) | Audit ALL h1-h3 elements across all pages. Add to base heading styles in styles.css |
| `prefers-reduced-motion: reduce` | Global `*` override in theme.css | Already comprehensive. Verify `--dur-*` tokens are used everywhere (check for any hardcoded durations) |
| `clamp()` for fluid type | Used for h1, h2, h3 font sizes | Verify clamp ranges. Consider adding for body text on very large screens (cap at 20px) |
| `:user-valid` | Used for form validation green border | Expand: add `:user-invalid` styling for red error border without JS `.is-invalid` class toggling |
| `scroll-margin-top` | On sections/headings (RHYTHM-06) | Verify value (6rem) accounts for glass header height in both mobile and desktop after scrolled state |
| `overflow-x: clip` | On `html` element | Keep. Better than `overflow: hidden` for sticky positioning |
| CSS custom properties (50+ tokens) | Extensive token system in both css/styles.css and src/styles/theme.css | Good foundation. Expand with `color-mix()` derived tokens to reduce hardcoded rgba values |
| `:focus-visible` | Used for keyboard navigation ring | Already implemented. Verify all interactive elements covered (including glass buttons) |

---

## Summary: What to Install (Dev Dependencies)

```bash
npm install -D lighthouse pa11y axe-core @axe-core/cli apca-w3
```

Total added: 5 dev-only packages. Zero production dependencies. Zero runtime weight.

## Summary: CSS Features to Add (Zero Dependencies)

Priority order for implementation phases:

1. **`@media (prefers-contrast: more)`** -- Glass accessibility safety net. Do first.
2. **`content-visibility: auto`** -- Free performance for off-screen sections. Quick win.
3. **`@starting-style`** -- Entry animations for FAQ, menu, form messages. Replace JS timing hacks.
4. **`color-mix(in oklch, ...)`** -- Derive glass tokens from base colors. Biggest refactor, highest payoff.
5. **`light-dark()`** -- Simplify dark mode declarations. Pairs with color-mix refactor.
6. **`:has()` selector** -- Parent-aware styling for forms and cards. Replaces JS class toggles.
7. **`text-wrap: pretty`** -- Orphan prevention for body text. Progressive, no risk.
8. **`animation-timeline: view()`** -- CSS scroll-driven animations. Enhancement only, keep IO fallback.
9. **`@view-transition { navigation: auto }`** -- Cross-page transitions. Enhancement, graceful degradation.

## What NOT to Add

- No animation libraries (GSAP, Motion One, Lottie, Anime.js) -- violates vanilla constraint
- No CSS preprocessors (Sass, Less) -- native CSS covers all needs
- No CSS-in-JS -- no JS framework to host it
- No Container Queries -- media queries sufficient for known breakpoints
- No `@scope` -- BEM naming already provides scope isolation
- No `corner-shape: squircle` -- keep SVG mask approach until cross-browser Baseline
- No `interpolate-size` as primary approach -- Chromium-only, use as enhancement behind @supports
- No `field-sizing: content` -- Chromium-only, use JS resize fallback

---

## Sources

### Browser Support Data (Verified Apr 2026)
- [Can I Use: View Transitions (single-document)](https://caniuse.com/view-transitions)
- [Can I Use: CSS Anchor Positioning](https://caniuse.com/css-anchor-positioning)
- [Can I Use: prefers-contrast](https://caniuse.com/mdn-css_at-rules_media_prefers-contrast) -- Chrome 96+, Safari 14.1+, Firefox 101+, ~95% global
- [Can I Use: CSS Nesting](https://caniuse.com/css-nesting)
- [Can I Use: content-visibility](https://caniuse.com/css-content-visibility)
- [Can I Use: text-wrap: balance](https://caniuse.com/css-text-wrap-balance)
- [StatCounter: Mobile Browser Market Share Kazakhstan](https://gs.statcounter.com/browser-market-share/mobile/kazakhstan) -- Chrome 50%, Safari 39%, Yandex 5%, Samsung 3%

### Feature Documentation
- [MDN: CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [MDN: @starting-style](https://caniuse.com/mdn-css_at-rules_starting-style) -- Chrome 117+, Safari 17.5+, Firefox 129+
- [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark)
- [MDN: color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix)
- [MDN: content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)
- [MDN: prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [Chrome: Animate to height: auto](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)
- [Chrome: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [Chrome: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions)
- [WebKit: Scroll-driven animations guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)

### Tools (Versions Verified Apr 2026)
- [Lighthouse npm v13.1.0](https://www.npmjs.com/package/lighthouse)
- [Pa11y npm](https://www.npmjs.com/package/pa11y)
- [axe-core npm v4.11.2](https://www.npmjs.com/package/axe-core)
- [apca-w3 npm v0.1.9](https://www.npmjs.com/package/apca-w3)

### Glass Accessibility
- [Axess Lab: Glassmorphism Meets Accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/)
- [APCA Documentation](https://git.apcacontrast.com/documentation/APCAeasyIntro.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 3.0 Status and APCA 2026](https://web-accessibility-checker.com/en/blog/wcag-3-0-guide-2026-changes-prepare)

### CSS Ecosystem 2026
- [Modern CSS: What's New in CSS 2026](https://modern-css.com/whats-new-in-css-2026/)
- [LogRocket: CSS in 2026](https://blog.logrocket.com/css-in-2026/)
- [Nick Paolini: Modern CSS Toolkit 2026](https://www.nickpaolini.com/blog/modern-css-toolkit-2026)
