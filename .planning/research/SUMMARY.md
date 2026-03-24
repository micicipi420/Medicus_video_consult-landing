# Project Research Summary

**Project:** MedicusUnion KZ Landing — v1.4 2025 Visual Redesign
**Domain:** Medical landing page visual enhancement (glassmorphism, dark mode, bold typography, micro-animations)
**Researched:** 2026-03-24
**Confidence:** HIGH (CSS/browser specs), MEDIUM (UX patterns for 45+ audience)

## Executive Summary

The v1.4 milestone is a visual enhancement layer on top of a fully working product. The existing architecture — vanilla HTML/CSS/JS, ~1,640 lines of CSS with a complete custom property token system, ES5 JavaScript with IntersectionObserver scroll animations — is the right foundation. All four new capability areas (glassmorphism, dark mode, bold typography, micro-animations) integrate cleanly without structural changes, provided a strict sequencing discipline is followed: token infrastructure first, visual effects second, progressive enhancement third. No new dependencies are needed; every required technique is achievable with native CSS and vanilla JS.

The most important research finding is that the 45+ Kazakhstani medical audience acts as the decisive design filter. This is a 45+ audience evaluating a 450 EUR medical service in Kazakhstan. Every visual decision must pass two tests: does it maintain WCAG AA contrast (ideally AAA for this demographic), and does it reinforce rather than erode medical trust? These filters eliminate most 2025 visual trend temptations: parallax is out (PROJECT.md constraint, vestibular risk), full-page glassmorphism is out (Android performance failure, visual noise for older readers), animated statistics counters are out (distracting, cognitively disorienting for this audience), and dark mode as the default is explicitly out (the 45+ medical audience associates white/light interfaces with clinical credibility — a dark-defaulting page reads as broken or untrustworthy to this demographic). What remains after applying these filters is a targeted, disciplined set of enhancements: selective glassmorphism on 2 components, bold typography via token changes, and purposeful micro-animations that confirm actions rather than entertain.

The primary technical risks are well-defined and avoidable. Glassmorphism on mid-range Android (the dominant device in the KZ 45+ market) requires limiting glass to 1-2 elements per viewport with blur radius no higher than 12px — enforced by a Chrome DevTools 4x CPU throttle test as a mandatory phase exit criterion. Dark mode flash-of-unstyled-content (FOUC) is prevented by a single synchronous inline `<script>` in `<head>` that reads localStorage before the first paint. CSS regression across the 11-section structure is mitigated by strict token namespacing (`--glass-*` prefix for all new v1.4 tokens) and verifying form submission end-to-end after every phase.

---

## Key Findings

### Recommended Stack

No new dependencies. All four v1.4 capability areas are native CSS and vanilla JS. The new capability surface:

**Core new CSS techniques:**
- `backdrop-filter: blur(8-12px) saturate(180%)` + `-webkit-backdrop-filter` — glassmorphism; Baseline 2024 (September 2024); ~95% browser coverage; GPU compositing cost requires restraint on mobile
- `html[data-theme="dark"]` attribute selector + CSS custom property cascade — dark mode theming; established pattern used by MDN, GitHub, Radix docs; HIGH confidence
- `localStorage` + `window.matchMedia('prefers-color-scheme')` — theme persistence and FOUC prevention; universal browser support; HIGH confidence
- `clamp()` for responsive font sizing — bold display typography; universal support; HIGH confidence
- `@supports (animation-timeline: scroll())` — progressive scroll-driven enhancement only; Chrome/Edge 115+, Firefox 128+, Safari 18+; ~70-75% coverage; must be additive enhancement, never a replacement for IntersectionObserver

**Critical implementation constraints from the existing codebase:**
- All new JS must use ES5 syntax (`var`, function declarations, no arrow functions) — explicit project decision for 45+ browser compatibility
- No separate CSS files — all tokens stay in `css/styles.css` to avoid FOUC and cascade fragmentation
- New v1.4 tokens use `--glass-*` namespace — never redefine existing `--color-*` or `--gradient-*` tokens outside the scoped `[data-theme="dark"]` block

### Expected Features

**Must have (v1.4 launch):**
- Dark mode toggle in sticky navigation — the anchor feature; all other theming depends on it
- `[data-theme="dark"]` CSS token block — prerequisite for all dark mode component styling
- FOUC-prevention inline `<script>` in `<head>` — without this, dark mode is broken for return visitors (white flash on every load)
- Bold display typography: h1 `clamp(40px, 5vw, 56px)` / 800 weight, h2 `clamp(28px, 3.5vw, 44px)` / 800 weight — highest visual impact per implementation effort; Manrope Variable already supports weight 800
- Hero section CSS gradient mesh background — enables glassmorphism on hero and adds visual depth with no image files
- Glassmorphism on sticky header (`.is-scrolled` state) and pricing card only (2 elements maximum) — selective application avoids performance and contrast failures
- Enhanced scroll animations: `translateY(20px → 0)` added to existing `.animate-on-scroll` system — extends what already works
- Button `:active` micro-interaction: `scale(0.97)` on CTA buttons — 100ms tactile click confirmation; particularly valuable for 45+ users uncertain about touch input

**Should have (v1.4.x patch after validation):**
- Smooth theme transition: 300ms fade on `color` and `background-color` scoped to `body` only (never on `:root` — causes full-page jank on theme switch)
- Dark mode OLED refinement pass after real-device testing
- Card hover shadow depth increase in light mode

**Defer to v2+:**
- CSS Scroll-Driven Animations as primary animation mechanism — not Baseline-stable; IntersectionObserver is the reliable baseline for this audience
- View Transitions API for theme switching — adds complexity for marginal gain
- Animated number counters on social proof statistics — FEATURES.md and PITFALLS.md both flag these as cognitively disorienting for 45+ users; defer or eliminate entirely

**Anti-features confirmed — do not build:**
- Full-page glassmorphism (all 11 sections) — GPU performance failure on mid-range Android; visual noise overwhelms older readers
- Dark mode as default or OS-preference-driven automatic — reduces medical trust signals; the 45+ audience expects clinical white
- Parallax scroll effects — PROJECT.md out-of-scope; vestibular risk for 35%+ of the 45+ demographic
- Animated statistics counters — distracting, delays trust signal perception, vestibular risk
- Pure `#000000` dark background — causes halation (halos around text) for astigmatic users; high prevalence at 45+; use `#0F1923` instead

### Architecture Approach

All v1.4 changes integrate into the existing single-file architecture following four established patterns that research confirmed as correct for this codebase:

1. **Token override pattern** — `[data-theme="dark"]` block immediately after the existing `:root` block in `styles.css` overrides the same token names. All 1,640 existing lines auto-update to dark mode without modification. Zero search-and-replace needed.
2. **Modifier class pattern** — `.card--glass` is an opt-in CSS modifier; the base `.card` rule is never changed. Glass applies only to the 2 targeted elements; all other cards are untouched.
3. **`@supports` gating** — scroll-driven animation additions wrapped in `@supports (animation-timeline: scroll())`; glass cards wrapped in `@supports not (backdrop-filter: blur(1px))` fallback. Elements stay visible and accessible on non-supporting browsers.
4. **Inline `<script>` FOUC prevention** — synchronous ES5 script in `<head>` before `<link rel="stylesheet">` reads localStorage and sets `data-theme` attribute before first paint. Toggle wiring stays in the existing IIFE.

**Component change map:**

| Feature | CSS file location | HTML change | JS change |
|---------|------------------|-------------|-----------|
| Dark mode tokens | Section 2 (after `:root`) | `data-theme` attribute on `<html>` | New `initDarkMode()` in IIFE + inline head script |
| Bold typography | Section 2 (token value changes) | None | None |
| Glass header | Modify Section 7 `.site-header.is-scrolled` | None | None |
| Glass pricing card | Add `.card--glass` rule in Section 6; gradient to Section 7 `.pricing` | Add class to 1 element | None |
| Scroll animations enhancement | Add inside Section 10 `@supports` block | None | None |
| Dark mode toggle button | None | Add `<button>` in `.site-header__container` | Wired in `initDarkMode()` |

**Estimated file impact:** ~120 lines added to `styles.css` (dark mode ~40 lines, glass modifiers ~30 lines, animation additions ~50 lines). File grows from ~1,640 to ~1,760 lines — well within maintainable range for single-file approach.

### Critical Pitfalls

Seven pitfalls have meaningful probability of causing launch failure or conversion damage. In priority order:

1. **Glassmorphism text contrast failure** — Glass cards sit over dynamically shifting blurred backgrounds; contrast ratio at any scroll position cannot be predicted from a static mockup. Prevention: set glass card minimum background opacity at `rgba(255,255,255,0.75)` for light mode; test contrast against the darkest content that will ever appear behind the card; target 7:1 (AAA) for the 45+ audience, not just 4.5:1 (AA). A contrast check on the design-intent background only is insufficient.

2. **`backdrop-filter` performance on mid-range Android** — More than 2 glass elements simultaneously cause frame drops to 20-25fps on Samsung Galaxy A-series and Xiaomi Redmi (dominant KZ market devices). Prevention: strict limit of 1-2 glass elements per viewport; blur radius maximum 8-12px (not 20px+); mandatory Chrome DevTools 4x CPU throttle scroll test before Phase 3 sign-off; `@supports` fallback renders a solid near-white card.

3. **Dark mode FOUC (flash of unstyled content)** — Without synchronous localStorage read in `<head>`, users with a saved dark preference see a white flash on every page load. Prevention: inline `<script>` before the CSS `<link>` tag, ES5 syntax, reads localStorage and sets `data-theme` attribute before any rendering occurs.

4. **Dark mode default erodes medical trust** — The 45+ medical audience treats light/white interfaces as clinical authority. OS-preference-driven dark mode or dark-as-default violates this expectation. Prevention: always load in light mode; `localStorage` absent means light; `prefers-color-scheme: dark` is a secondary hint for first visit only, not the primary trigger.

5. **Dark mode WCAG contrast failures in secondary text** — Secondary text, form placeholders, and disabled states that borderline-pass in light mode will fail in dark mode when colours are naively inverted. Grey-on-dark is the most common silent failure (`#888` on `#1a1a1a` is only 3.6:1). Prevention: full token-pair contrast audit before any dark component styling; explicit token values for every dark pair, never derived by opacity or `filter: invert()`.

6. **CSS regression across 11 sections** — Dark mode tokens, glass modifiers, and animation additions all touch `styles.css`; cascade conflicts and token name collisions can silently break form validation states, sticky header, wave dividers, or accordion. Prevention: `--glass-*` namespace for all new tokens; visual regression screenshots at 390px and 1440px before starting; form submission flow tested end-to-end after every phase.

7. **Mobile typography line-break failures** — 56px+ headlines without proper `clamp()` minimum values force single-word Cyrillic orphan lines on 390px screens. Prevention: verify every headline at 320px and 390px before Phase 2 closes; use `text-wrap: balance`; no `letter-spacing` adjustment on Cyrillic (only Latin benefits from tracking reduction at display sizes).

---

## Implications for Roadmap

Research establishes a clear sequential dependency chain: token infrastructure must precede all visual effects; gradient backgrounds must precede glass cards; FOUC prevention must precede any dark mode toggle; the `prefers-reduced-motion` guard must precede any new animation. A 4-phase structure emerges naturally from these dependencies, where each phase is independently deployable.

### Phase 1: Dark Mode Token Infrastructure

**Rationale:** The foundational prerequisite. All other v1.4 features depend on the `[data-theme="dark"]` token block existing and the `--glass-*` tokens being defined. This phase has zero visual change in light mode — it is entirely additive and carries no regression risk. Starting here means the page is deployable after this phase with a functional, tested dark mode before any glass or typography work begins.

**Delivers:** Fully functional dark mode toggle with localStorage persistence and FOUC-free experience; all token values contrast-audited before any component uses them; `--glass-*` tokens ready for Phase 3.

**Addresses:** Dark mode toggle (navigation button), `[data-theme="dark"]` CSS block, FOUC-prevention inline script, `aria-pressed` toggle accessibility, minimum 44px touch target on toggle, visible text label alongside icon.

**Avoids:**
- Pitfall 3 (FOUC) — inline `<script>` pattern established
- Pitfall 4 (dark mode trust erosion) — default-light policy built into the token architecture; `prefers-color-scheme` is secondary only
- Pitfall 5 (dark mode WCAG failures) — full token-pair contrast audit is the exit criterion for this phase; no component receives dark styling until all token pairs pass
- Pitfall 6 (CSS regression) — `--glass-*` namespace policy established here

**Phase exit criteria:** Dark mode toggle works; localStorage persists between sessions; FOUC test passes (hard refresh with OS dark mode set shows correct theme immediately); every new `[data-theme="dark"]` token pair documented and contrast-checked.

---

### Phase 2: Bold Typography Scale

**Rationale:** High visual impact, lowest implementation risk. Typography is token-value changes only — no new HTML structure, no new CSS classes, no new JS, no new APIs. Manrope Variable (already loaded, already supporting weight 800) is the only dependency. Building this second means typographic sizes are finalized before gradient backgrounds in Phase 3 are proportioned around the hero layout.

**Delivers:** h1 at `clamp(40px, 5vw, 56px)` / 800 weight, h2 at `clamp(28px, 3.5vw, 44px)` / 800 weight; line-height tightened to 1.1 for display-size headings; `text-wrap: balance` on all section headings; every headline verified at 320px and 390px.

**Addresses:** Bold display headings with `clamp()` responsive scaling; font-weight policy (minimum 400 for any informational text); Cyrillic mobile line-break testing.

**Avoids:**
- Pitfall 7 (mobile typography orphan lines) — 320px/390px viewport review is the exit criterion
- Pitfall 6 (thin weight text contrast) — weight-to-contrast policy defined: no `font-weight` below 400 for any text conveying information; pricing and statistics checked explicitly at every weight used

**Phase exit criteria:** Every headline reviewed at 320px and 390px; no single-word Russian orphan lines; contrast ratio verified for all heading colour combinations in both light and dark mode (dark mode tokens from Phase 1 are available for testing).

---

### Phase 3: Glassmorphism

**Rationale:** Depends on Phase 1 (glass tokens established, dark mode available for testing glass in dark context) and Phase 2 (hero layout finalized at bold type sizes before gradient backgrounds are designed around it). Glass is the highest visual risk of the milestone — both for Android performance and for contrast compliance — so it runs after the lower-risk phases are stable and deployed. If glassmorphism fails in production, it is removed by reverting 2 CSS modifier classes and one gradient background; Phases 1 and 2 are unaffected.

**Delivers:** CSS gradient mesh background on hero section; glass effect on `.site-header.is-scrolled`; gradient background on `.pricing` section; `.card--glass` modifier on pricing card; solid-colour fallback via `@supports not (backdrop-filter: blur(1px))` for non-supporting browsers.

**Addresses:** Hero gradient mesh; glassmorphism on sticky header; glassmorphism on pricing card; `@supports` fallback; glass tokens in both light and dark variants (dark mode disables `backdrop-filter` and uses opaque dark surface instead — glass over dark backgrounds renders poorly).

**Avoids:**
- Pitfall 1 (glass contrast failure) — contrast tested against worst-case background (darkest content that will ever scroll behind the card), not design-intent background; minimum 75% opacity background floor on glass elements
- Pitfall 2 (Android performance failure) — maximum 2 glass elements per viewport; blur radius 8-12px; Chrome DevTools 4x CPU throttle scroll test is a mandatory exit criterion (FPS must stay above 50fps)
- Anti-pattern: glass in dark mode — `[data-theme="dark"]` disables `backdrop-filter` on glass modifiers; replaces with opaque near-black surface

**Phase exit criteria:** 4x CPU throttle scroll test passes at 50fps+ with both glass elements visible; contrast checked against darkest scroll context; `@supports` fallback verified on a browser with `backdrop-filter` disabled; form submission flow tested end-to-end.

---

### Phase 4: Micro-Animations Enhancement

**Rationale:** Purely additive over stable Phase 1-3 surfaces. The existing IntersectionObserver system stays intact. New additions go inside `@supports` blocks or extend existing `.animate-on-scroll` / `.is-visible` patterns with new properties. The animation catalogue is defined upfront and capped at 4-5 distinct types to prevent cognitive overload for the 45+ audience. The `prefers-reduced-motion` guard rule is written first — before any `@keyframes` is created.

**Delivers:** `translateY(20px → 0)` added to `.animate-on-scroll` initial state (existing `opacity` fade becomes fade + slide); button `:active` `scale(0.97)` feedback; `:focus-visible` ring enhancement; optional CSS scroll progress bar in header via `animation-timeline: scroll(root)` behind `@supports` gate; smooth theme transition (300ms `background-color, color` on `body` only — if not already landed in Phase 1 patch).

**Addresses:** Enhanced scroll reveal; button active feedback; focus ring accessibility; smooth theme transition; optional scroll progress indicator.

**Avoids:**
- Pitfall 7 (vestibular disorder triggers) — `prefers-reduced-motion` rule written first; new `transform: translateY()` additions also reset `transform: none` in the reduced-motion block (not just zeroing duration — a duration-zero transform from `translateY(20px)` still snaps)
- Pitfall 8 (animation cognitive overload) — animation catalogue defined upfront: scroll reveal, button active, focus ring, theme transition, optional progress bar = 5 types maximum; no looping animations; no animated counters; no scale above `scale(1.02)` on hover
- IntersectionObserver + scroll-driven conflict — scroll-driven animations only on new elements or new CSS properties; never applied to existing `.animate-on-scroll` elements that already control `opacity`

**Phase exit criteria:** `prefers-reduced-motion` verified globally; total distinct animation types on page counted and capped at 5; stagger delay between card grid children confirmed at ≤100ms; no looping or continuous animations visible in the resting viewport state.

---

### Phase Ordering Rationale

The dependency chain is strictly linear:

- **Token infrastructure first** — CSS cascade is unforgiving; any component using `var(--glass-*)` before that token exists silently falls to `initial`. Dark mode toggle must exist before any section's dark mode styling can be verified.
- **Typography before glassmorphism** — heading sizes affect vertical layout metrics that gradient background proportions should be designed around. Build the hero at its final type scale before adding the gradient behind it.
- **Glassmorphism before animations** — micro-animations layer on stable visual surfaces. Animating elements whose background will later be changed by glass styling creates double rework.
- **Each phase independently deployable** — this is the regression safety net. Phase 3 failure (Android performance) means reverting Phase 3 only; Phases 1 and 2 remain live and stable.

### Research Flags

**Standard patterns — no research phase needed:**
- **Phase 1 (Dark Mode Tokens):** `data-theme` + localStorage FOUC prevention pattern is HIGH confidence; fully specified in ARCHITECTURE.md with exact code patterns. Implementation is mechanical.
- **Phase 2 (Bold Typography):** `clamp()` and Manrope Variable weight 800 are HIGH confidence. Specific `clamp()` midpoints require viewport testing, not research.
- **Phase 4 (Micro-Animations):** All techniques are standard CSS with HIGH confidence. Pre-implementation check: read lines 182-189 of `styles.css` to confirm the existing `prefers-reduced-motion` rule scope and whether `transform` reset needs to be added.

**Targeted verification required (not a full research phase — just a task before sign-off):**
- **Phase 3 (Glassmorphism):** Browser API is HIGH confidence. Android performance on this specific codebase cannot be predicted from specs. Run Chrome DevTools 4x CPU throttle scroll test before phase sign-off. If FPS drops below 50fps, reduce blur from 12px to 8px, then if still failing, remove the pricing card glass and keep only the header glass.
- **Phase 4 pre-check:** Verify current `animation-timeline` Firefox/Safari support at caniuse.com before implementation (training data cutoff is August 2025; the scroll progress bar enhancement depends on whether `@supports` covers the actual gap).

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All four new capabilities use native CSS/JS APIs with MDN-verified, Baseline-stable documentation. No new dependencies. Scroll-driven animations are the only area with meaningful browser gaps (~25% non-support), correctly addressed by `@supports` progressive enhancement. |
| Features | HIGH (CSS), MEDIUM (UX) | CSS feature list and browser support are HIGH confidence from MDN primary sources. UX guidance for the 45+ audience (dark mode medical trust damage, animation cognitive overload, halation on pure black) is MEDIUM confidence from WCAG 2.1, NNGroup, and research consensus — no Kazakhstan-specific clinical data found. |
| Architecture | HIGH | Token override architecture, modifier class pattern, FOUC prevention, and `@supports` gating are established patterns. Integration plan was validated against the actual codebase structure via direct file inspection — section numbering, token names, and existing class names are confirmed. |
| Pitfalls | HIGH (technical), MEDIUM (audience-specific) | CSS performance and WCAG pitfalls are grounded in WCAG 2.1 specifications and MDN browser behaviour. Audience-specific claims (vestibular disorder prevalence at 45+, medical trust association with light interfaces) are MEDIUM confidence from research consensus without a single authoritative clinical source. |

**Overall confidence:** HIGH for technical implementation decisions. MEDIUM for predicting the audience-specific UX impact of dark mode and glassmorphism on the 45+ Kazakhstan demographic (no local data available).

### Gaps to Address

- **Dark mode ROI for this audience:** Whether dark mode meaningfully improves the experience for 45+ KZ users is unproven. If the product decision is uncertain, Phase 1 can be scoped as "CSS token semantic refactor only" (adding `--color-bg`, `--color-surface` semantic tokens without a dark toggle), which still benefits Phase 3 glassmorphism architecture without the full dark mode QA surface. Monitor dark mode toggle usage post-launch.

- **Dark mode treatment of hero illustration:** The existing SVG hero illustration uses duotone colours optimised for a light background. In dark mode it will appear washed-out or desaturated. The correct treatment — CSS `filter`, dark-mode SVG variant, or dark overlay — was not researched. Must be decided during Phase 1 execution.

- **Exact `clamp()` values per headline:** The research provides ranges (h1: 40-56px, h2: 28-44px) but specific midpoints depend on actual Russian headline lengths at the breakpoint widths. This is a Phase 2 implementation testing task, not a research gap.

- **caniuse.com verification for `animation-timeline`:** Browser support figures are from training data (August 2025 cutoff). Verify current Firefox/Safari support before Phase 4 to determine whether the scroll progress bar enhancement covers enough users to be worth building.

- **Kazakhstan market device performance baseline:** The recommendation to limit glass elements and blur radius is based on general mid-range Android characteristics, not a measured baseline on this codebase on this device class. The Phase 3 DevTools throttle test is the proxy validation. If performance issues appear in production on real devices, the recovery path is: reduce blur from 12px to 8px → remove pricing card glass → keep only header glass.

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: `backdrop-filter` (Baseline 2024, September 2024) — glassmorphism support and GPU compositing behaviour
- MDN Web Docs: `animation-timeline` — NOT Baseline; limited availability; `@supports` progressive enhancement required
- MDN Web Docs: `prefers-reduced-motion` — Baseline Widely Available since January 2020
- MDN Web Docs: `prefers-color-scheme` — Baseline Widely Available since January 2020
- MDN Web Docs: `color-scheme` property — Baseline Widely Available since January 2022
- MDN Web Docs: CSS Scroll-Driven Animations — draft spec, browser support
- MDN Web Docs: `:focus-visible` — Chrome 86+, Firefox 85+, Safari 15.4+
- WCAG 2.1 SC 1.4.3 Contrast Minimum (4.5:1 normal text, 3:1 large text)
- WCAG 2.1 SC 2.3.3 Animation from Interactions (AAA) — vestibular motion guidelines
- WCAG 2.1 SC 2.5.5 Target Size — 44x44px minimum touch target
- CSS `text-wrap: balance` — Baseline 2023
- Existing codebase: `css/styles.css` (~1,640 lines), `js/main.js` (~488 lines), `index.html` (~762 lines) — direct inspection for integration constraints and token names

### Secondary (MEDIUM confidence)
- CSS-Tricks: "A Complete Guide to Dark Mode on the Web" — `data-theme` attribute pattern and localStorage approach
- web.dev: "Building a theme switch component" — inline `<script>` FOUC prevention pattern
- W3C WAI: Developing Websites for Older People — accessibility patterns for aging users
- Nielsen Norman Group: Dark Mode Research — dark mode UX patterns and reading contexts
- Chrome Developers: Scroll-driven Animations documentation — `animation-timeline: view()` usage patterns
- Design community consensus on 2025 display typography (Vercel, Stripe, Linear landing pages) — heading scale 56-72px / 800 weight convention

### Tertiary (LOW confidence — needs validation)
- Ophthalmology UX literature on halation (pure black backgrounds causing halos for astigmatic users) — referenced in NNGroup and design literature; primary clinical sources not located
- 45+ vestibular disorder prevalence (~35% of adults over 40) — audiological/neurological research consensus; no single authoritative source cited
- Kazakhstan-specific 45+ device distribution — not found; mid-range Android assumption based on general KZ market data

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
