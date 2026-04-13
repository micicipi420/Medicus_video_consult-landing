# Feature Landscape: v7.0 UI/UX Design Excellence

**Domain:** Medical consultation website -- SOTA UI/UX polish on existing Liquid Glass design system
**Researched:** 2026-04-13
**Confidence:** HIGH (CSS specs from MDN/caniuse), MEDIUM (Apple HIG/WCAG guidance), LOW where flagged
**Scope:** Improvements BEYOND the current implementation. Does NOT re-document existing features.

---

## Research Context

The site ships a 4-tier Liquid Glass material hierarchy (nav, regular, clear, fluted) with squircle shapes, animated glint borders, specular highlights, dark mode, prefers-reduced-motion support, scroll-reveal animations via IntersectionObserver, section tints, and a print stylesheet. The vanilla HTML+CSS+JS static site targets Kazakhstan residents 45+ seeking medical consultation (from 450 EUR). The CSS spans ~2,670 lines (styles.css) plus liquid-glass.css, squircles.css, and theme.css in src/styles/. All pages share a single stylesheet.

**Existing implementation audit (from PROJECT.md):** ~85% Liquid Glass compliance. Known gaps: mobile blur budget, glass layer count per viewport, prefers-contrast, shimmer limits.

---

## Table Stakes

Features that SOTA glass-design websites in 2025-2026 implement as standard. Missing any of these creates a visible gap for visitors comparing the site to Apple ecosystem apps, modern medical platforms, or premium landing pages.

### ACC-01: `prefers-contrast: more` Fallback

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | Apple's Liquid Glass accessibility report card (March 2026, AppleVis) showed failing marks precisely because glass effects persisted when contrast settings were enabled. WCAG 2.2 SC 1.4.3 requires 4.5:1 for body text; on translucent surfaces the effective contrast is variable. Sites shipping glass WITHOUT a high-contrast fallback are now flagged in accessibility audits. |
| **Complexity** | LOW |
| **Current State** | NOT implemented. `prefers-contrast: more` is absent from styles.css and theme.css. |
| **Browser Support** | Chrome 96+, Firefox 101+, Safari 14.1+ -- 94.6% global coverage (HIGH confidence, caniuse). |
| **What to Build** | `@media (prefers-contrast: more)` block that: (1) replaces all `--liquid-bg` values with opaque equivalents (e.g. `rgba(255,255,255,0.95)`), (2) sets `backdrop-filter: none`, (3) adds `border: 2px solid var(--color-text-primary)` on glass surfaces, (4) increases `--liquid-shadow-outer` to a high-contrast equivalent, (5) forces `--liquid-border-top` and `--liquid-border-bottom` to fully opaque values. |
| **Dependency** | Overrides existing `--liquid-*` tokens in :root. No structural HTML changes. |
| **Measurable Criteria** | Before: no response to OS-level "Increase Contrast." After: all glass surfaces become opaque with visible borders, all text passes WCAG AAA (7:1) when high-contrast is enabled. |
| **Sources** | [prefers-contrast -- MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast), [AppleVis Liquid Glass Report](https://9to5mac.com/2026/03/18/liquid-glass-and-long-standing-bugs-push-apples-grades-down-in-visual-accessibility-report-card/) |

### ACC-02: `prefers-reduced-transparency` Fallback

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | Direct CSS-level signal from OS "Reduce Transparency" setting. Apple's HIG requires Liquid Glass to respond to this. Users who enable it (common at 45+ with visual impairments) expect translucent surfaces to become frostier/opaque. |
| **Complexity** | LOW |
| **Current State** | `prefers-reduced-transparency` is absent from all CSS files. The existing `prefers-reduced-motion` is handled, but transparency is not. |
| **Browser Support** | Chrome 118+, Edge 118+. Safari: NOT supported. Firefox: behind flag only. ~73% global coverage (MEDIUM confidence). Progressive enhancement -- does nothing in unsupported browsers. |
| **What to Build** | `@media (prefers-reduced-transparency: reduce)` block that: (1) increases `--liquid-bg` opacity from 0.42 to 0.85+, (2) reduces blur from 24px to 8px (less GPU load, frostier appearance), (3) does NOT disable blur entirely (Apple guidance: "frostier, not flat"). |
| **Dependency** | Token overrides only. No HTML changes. |
| **Measurable Criteria** | Before: no response to OS "Reduce Transparency." After: glass surfaces become significantly more opaque while retaining subtle depth cue. |
| **Sources** | [prefers-reduced-transparency -- MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency), [caniuse](https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency) |

### ACC-03: Worst-Case Contrast Testing on Glass Surfaces

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | WCAG 2.2 requires contrast against the WORST-CASE background behind translucent surfaces, not just the intended background. When a glass card scrolls over different section backgrounds (white, cream, blue-tint), the effective contrast changes. If any combination drops below 4.5:1 for body text, it fails. |
| **Complexity** | MEDIUM (audit + potential token adjustments) |
| **Current State** | Glass cards have semi-transparent backgrounds. Text contrast was tested against intended placement but NOT against all possible scroll positions. |
| **What to Build** | (1) Systematic audit: screenshot every glass card at every possible scroll position, measure contrast with a tool. (2) If any position fails: increase `--liquid-bg` opacity floor to guarantee minimum contrast, OR add a text-shadow safety net (`text-shadow: 0 0 8px rgba(255,255,255,0.8)`), OR both. (3) Document minimum safe opacity per tier. |
| **Dependency** | May require raising `--liquid-bg` from 0.42 to 0.50+ if audit reveals failures. |
| **Measurable Criteria** | Before: contrast untested at scroll midpoints. After: every text-on-glass combination passes WCAG AA (4.5:1) at all scroll positions. |

### INT-01: Complete Focus-Visible System for Glass Surfaces

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | Keyboard navigation is critical for 45+ users with motor disabilities. The existing theme.css has `:focus-visible` with `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` -- but this is only in the Tailwind/Next.js layer (`src/styles/theme.css`). The main `css/styles.css` serving the static pages has no custom `:focus-visible` at all beyond form inputs. |
| **Complexity** | LOW-MEDIUM |
| **Current State** | `styles.css` has `:focus` on `.lead-form__input` and `:focus-visible` on `.faq__question`. Buttons, cards, nav links, and the theme toggle have NO custom focus styles in the static site CSS. |
| **What to Build** | Global `:focus-visible` rule for all interactive elements: buttons, links, cards (if clickable), theme toggle. Style: `outline: 3px solid var(--color-primary); outline-offset: 3px; border-radius: var(--radius-sm)`. On glass surfaces: add `box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.4)` as secondary ring for visibility against translucent backgrounds. In dark mode: switch outline color to `#38C6F4` for visibility. |
| **Dependency** | CSS-only. Uses existing tokens. |
| **Measurable Criteria** | Before: keyboard tab through page shows browser-default or missing focus rings on most elements. After: every interactive element shows a visible, consistent focus ring in both light and dark mode, on and off glass surfaces. |
| **Sources** | [W3C Technique C45](https://www.w3.org/WAI/WCAG21/Techniques/css/C45), [focus-visible -- MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible) |

### INT-02: Hover/Focus/Active State Completeness for Cards

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | Cards are the primary content containers. Interactive cards (linking to service pages) need three distinct states: hover, focus, active. Currently `.card:hover` gets `box-shadow: var(--shadow-md)` and `.hub-service:hover` gets `translateY(-4px)`. But there is no `:focus-visible` on cards and no `:active` feedback on clickable cards. |
| **Complexity** | LOW |
| **Current State** | Hover exists (translateY + shadow). Focus and active states are missing on card-level elements. |
| **What to Build** | (1) `:focus-visible` on clickable cards matching INT-01 system. (2) `:active` state: `transform: scale(0.98)` for 100ms to provide tactile click confirmation (already used on buttons). (3) On glass cards (`liquid-card`): hover state should increase `filter: brightness(1.06)` rather than translateY -- glass surfaces should "brighten" on hover, matching Apple's Liquid Glass interaction model. |
| **Dependency** | Extends existing hover CSS. No HTML changes needed if cards are already links/buttons. |
| **Measurable Criteria** | Before: only hover state on cards. After: three distinct visual states (hover, focus, active) on all interactive cards. |

### INT-03: Form Submit Loading State

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | The consultation form submits to Directus API. During submission, the button shows no loading state -- user cannot tell if their click registered. For a medical service at 450 EUR, trust requires clear "submitting" feedback. Double-submission risk is real for 45+ users. |
| **Complexity** | LOW |
| **Current State** | Form JS sends fetch POST and shows success/error messages, but the button remains in its default state during the request. No disabled state, no spinner, no label change. |
| **What to Build** | (1) On submit: button gets `aria-disabled="true"`, label changes to "Отправка..." (2) CSS spinner via `border` animation on a `::after` pseudo-element. (3) Button returns to normal on success/error. (4) Spinner contrast must pass WCAG AA against button background (white spinner on gradient CTA). |
| **Dependency** | JS change in form submission handler + CSS for spinner. |
| **Measurable Criteria** | Before: button stays static during API call. After: button shows loading state within 100ms of click, prevents double-submit, restores on completion. |

### TYPO-01: Glass-on-Text Readability Enhancement

| Attribute | Detail |
|-----------|--------|
| **Why Expected** | Text on semi-transparent glass surfaces is the #1 Liquid Glass readability complaint (AppleVis, Six Colors, Infinum analysis). Current `--liquid-bg: rgba(255,255,255,0.42)` allows significant bleed-through that can reduce readability for 45+ users with presbyopia. |
| **Complexity** | LOW |
| **Current State** | Glass cards use 0.42 opacity background. No text-shadow safety net. No `paint-order` optimization. |
| **What to Build** | (1) Add subtle text-shadow on glass surfaces: `.liquid-card p, .liquid-card li { text-shadow: 0 0 12px rgba(255,255,255,0.6); }` for light mode, dark-mode equivalent with near-black shadow. (2) Consider raising `--liquid-bg` minimum from 0.42 to 0.48 for body text cards (not nav, which can stay lighter). (3) Evaluate `font-weight` bump from 400 to 450 for body text on glass (variable font supports fractional weights). |
| **Dependency** | Token adjustment + CSS text-shadow. |
| **Measurable Criteria** | Before: text on glass has variable readability depending on background. After: all body text on glass passes WCAG AA at all scroll positions with measurable contrast improvement. |

---

## Differentiators

Features that elevate the site beyond competitors and create a SOTA impression. Not expected, but valued by users and demonstrate design maturity.

### DIFF-01: Scroll-Driven Animations (Progressive Enhancement)

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | CSS `animation-timeline: scroll()` and `view()` run animations on the compositor thread -- zero JS, zero main-thread cost, 60fps guaranteed. Replacing current IntersectionObserver scroll-reveal with CSS scroll-driven animations makes reveals smoother and eliminates JS bundle weight for animation logic. |
| **Complexity** | MEDIUM |
| **Current State** | All scroll animations use IntersectionObserver in main.js (~70 lines). Works universally but runs on main thread. |
| **Browser Support** | Chrome 115+, Safari 26+, Edge 115+. Firefox: behind flag only. ~84.7% global coverage (HIGH confidence, caniuse). Safari 26 support is NEW (2025). |
| **What to Build** | `@supports (animation-timeline: view())` block with CSS-only scroll-reveal replacing the JS IntersectionObserver for supported browsers. The IntersectionObserver remains as fallback for Firefox/older browsers. Specific animations: (1) cards fade+slide on `view()` timeline, (2) section headings fade-in, (3) glass card scale entrance. Gate behind `prefers-reduced-motion: no-preference`. |
| **Dependency** | CSS addition. JS remains as fallback (no removal). Progressive enhancement -- no risk to existing functionality. |
| **Measurable Criteria** | Before: scroll animations run on main thread via JS. After: 85% of users get compositor-thread animations with zero JS cost. Firefox users see no change (existing behavior). |
| **NOTE:** This was an anti-feature in the v1.4 research (March 2026) due to limited support. Safari 26 support changes the calculus -- now viable as progressive enhancement. |
| **Sources** | [CSS Scroll-driven Animations -- MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [caniuse: animation-timeline](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) |

### DIFF-02: Scroll Progress Indicator Enhancement

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | The consultations.html already has a `.scroll-progress` element in the DOM. Enhancing it to use CSS `animation-timeline: scroll()` eliminates the JS scroll listener entirely for supported browsers. For long service pages, a progress indicator helps 45+ users maintain reading context. |
| **Complexity** | LOW |
| **Current State** | `.scroll-progress` div exists in HTML. Implementation unknown (may be JS-driven). |
| **What to Build** | CSS-only scroll progress bar using `animation-timeline: scroll()` with `@supports` gate. Solid-color fill matching `--color-primary`. Height: 3px. Position: fixed top. Fallback: existing JS implementation. |
| **Dependency** | Extends existing HTML element. CSS addition only. |
| **Measurable Criteria** | Before: JS-driven progress bar. After: CSS-only for 85% of users, JS fallback for rest. |

### DIFF-03: Glass Surface Hover Brightness (Apple Liquid Glass Model)

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | Apple's Liquid Glass interaction model brightens glass surfaces on hover rather than moving them (translateY). This feels more physically accurate -- glass catches more light when you approach it, not when you lift it. Differentiates from the generic card-hover-lift pattern used by every other site. |
| **Complexity** | LOW |
| **Current State** | Cards use `translateY(-4px)` on hover. Glass cards (liquid-card) use the same pattern. |
| **What to Build** | On `.liquid-card:hover` and `.liquid-regular:hover`: `filter: brightness(1.06) saturate(1.1)` instead of translateY. Keep translateY for non-glass `.card` elements. The glass-specific hover creates a "light gathering" effect. Transition: `var(--dur-hover) var(--ease-liquid)`. |
| **Dependency** | CSS change on existing selectors. |
| **Measurable Criteria** | Before: glass cards lift on hover (same as flat cards). After: glass cards brighten on hover (distinct interaction language). |

### DIFF-04: Reduced-Motion Deep Compliance

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | Current `prefers-reduced-motion` handling blankets `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms !important` globally. This is the "nuclear" approach -- it kills ALL transitions including color changes, opacity fades, and theme transitions. WCAG guidance distinguishes between MOTION (spatial displacement) and NON-MOTION transitions (color, opacity). The site should disable MOTION while preserving non-motion transitions for users who prefer reduced motion. |
| **Complexity** | MEDIUM |
| **Current State** | Global `prefers-reduced-motion: reduce` kills everything. The glint animation runs continuously (`animation: glint 6s linear infinite`) and has no reduced-motion gate. |
| **What to Build** | (1) Replace global `*` duration override with targeted selectors: disable `transform`, `translate`, `scale` transitions, and `@keyframes` that involve spatial movement. (2) PRESERVE `opacity`, `color`, `background-color`, `border-color`, `box-shadow` transitions (these are non-vestibular-triggering). (3) Stop the glint animation: `animation: none` for `.liquid-card::before` under reduced-motion. (4) Stop the shimmer sweep animation under reduced-motion. (5) Preserve theme toggle color transition (300ms background/color fade is not motion). |
| **Dependency** | Refactors existing `@media (prefers-reduced-motion: reduce)` blocks. |
| **Measurable Criteria** | Before: reduced-motion users see zero transitions (harsh snaps). After: reduced-motion users see smooth color/opacity changes but no spatial movement -- closer to WCAG intent. |

### DIFF-05: Skeleton Loading States for Form Section

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | If the form section is below the fold and loads via scroll-reveal, users on slow connections see a blank area before content appears. A CSS skeleton provides immediate visual structure. For 45+ users, this signals "content is coming" rather than "the page is broken." |
| **Complexity** | LOW-MEDIUM |
| **Current State** | No skeleton states anywhere. Content is static HTML -- loads immediately. Skeleton is most relevant if the form ever becomes dynamically loaded or if CLS optimization is needed. |
| **What to Build** | CSS-only skeleton placeholders using `linear-gradient` shimmer animation on placeholder divs. Apply to: form fields placeholder state (before user interacts), card grids during initial page paint if using lazy-loaded content. Skeleton colors: `--color-bg-gray` base, `--color-light` shimmer sweep. Respect `prefers-reduced-motion` (static gray blocks instead of animated shimmer). |
| **Dependency** | Requires HTML placeholder structure + CSS. |
| **Measurable Criteria** | Before: form area is blank during scroll-reveal fade-in. After: skeleton structure visible immediately, content fades in on top. |
| **NOTE:** LOW priority -- the site is static HTML, content loads fast. Skeleton is a polish item, not a UX necessity. |

### DIFF-06: Glass Layer Budget Enforcement (Mobile Performance)

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | `backdrop-filter` creates GPU composite layers. On budget Android devices (common in Kazakhstan), more than 2-3 glass elements visible simultaneously causes scroll jank. The current system has no enforcement mechanism -- a page with multiple glass cards can have 5+ glass layers in viewport on mobile. |
| **Complexity** | MEDIUM |
| **Current State** | PROJECT.md states "Max 2 glass elements per viewport" as a design rule, but no CSS or JS enforces it. On narrow mobile viewports, card grids may stack 3-4 glass cards in view. |
| **What to Build** | (1) Mobile-specific `@media (max-width: 767px)` override: reduce `--liquid-blur-md` from 24px to 12px. (2) On mobile, glass cards in grids (`.programs__grid .liquid-card`, `.hub-services__grid .liquid-card`) get `backdrop-filter: none; background: rgba(255,255,255,0.92);` -- opaque frosted appearance without GPU cost. Only hero glass and header glass retain actual backdrop-filter on mobile. (3) Optional: IntersectionObserver that adds/removes `backdrop-filter` class based on viewport visibility (only active glass layers are the ones in view). |
| **Dependency** | CSS media queries + possible JS optimization. |
| **Measurable Criteria** | Before: unlimited glass layers on mobile. After: max 2 active backdrop-filter layers in any viewport on mobile; Lighthouse performance score does not regress. |

### DIFF-07: Cross-Document View Transitions

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | The site has 4 pages (index, consultations, treatment-abroad, checkup). CSS Cross-Document View Transitions (CDVT) enable smooth page-to-page morphing with ZERO JavaScript. The header and nav persist visually while content cross-fades. Creates an app-like navigation feel that matches the Liquid Glass premium positioning. |
| **Complexity** | MEDIUM |
| **Browser Support** | Chrome 126+, Edge 126+. Safari/Firefox: NO support yet. Part of Interop 2026. Progressive enhancement only. |
| **Current State** | Page navigation is standard HTTP (full reload). |
| **What to Build** | (1) `@view-transition { navigation: auto; }` in CSS. (2) `view-transition-name` on shared elements: header, footer, and page title area. (3) `@supports (view-transition-name: *) { ... }` guard. (4) Custom `::view-transition-*` pseudo-element styling for cross-fade duration and easing matching `--ease-liquid`. (5) Respect `prefers-reduced-motion`: instant swap under reduced motion. |
| **Dependency** | CSS-only. No HTML changes beyond meta tag `<meta name="view-transition" content="same-origin">`. |
| **Measurable Criteria** | Before: hard page reload between pages. After: smooth cross-fade transition for Chrome/Edge users (~70% of traffic); no change for others. |
| **Sources** | [View Transition API -- MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) |

### DIFF-08: Touch Target Audit and Expansion

| Attribute | Detail |
|-----------|--------|
| **Value Proposition** | WCAG 2.2 SC 2.5.8 (Level AA) requires 24x24px minimum targets. Best practice for 45+ audience: 48x48px. The site has `min-height: 48px; min-width: 48px` on `.button`, but nav links, footer links, FAQ toggles, phone link, and theme toggle may not meet 48px in all viewport sizes. |
| **Complexity** | LOW |
| **Current State** | Buttons: 48px minimum. Nav links: no explicit min-height. FAQ question buttons: no explicit min-height. Theme toggle: present but size unverified. |
| **What to Build** | (1) Audit all interactive elements for minimum 48x48px touch target. (2) Add `min-height: 48px; min-width: 48px; display: inline-flex; align-items: center;` to: `.site-header__link`, `.faq__question`, `.theme-toggle`, `.footer__nav a`. (3) Use padding (not just min-height) to expand targets without affecting visual layout. |
| **Dependency** | CSS-only adjustments. |
| **Measurable Criteria** | Before: some interactive elements below 48px touch target. After: 100% of interactive elements meet 48x48px minimum. |
| **Sources** | [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), [All Accessible Touch Target Sizes](https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/) |

---

## Anti-Features

Features to explicitly NOT build. Commonly suggested but harmful for this project.

### ANTI-01: Parallax Scroll Effects on Glass Layers

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Parallax displacement on glass cards during scroll | Explicitly out of scope (PROJECT.md). `transform: translateZ()` on glass elements forces re-composition of backdrop-filter every frame. Causes scroll jank on budget Android. Vestibular trigger for 45+ users with motion sensitivity. | Use opacity-based scroll-reveal (existing) or CSS scroll-driven view() timeline (DIFF-01) for entrance animations only. No continuous scroll-linked displacement. |

### ANTI-02: Animated Gradient Mesh Backgrounds

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| `@keyframes` on `background-position` for moving gradient mesh behind glass | Runs continuously. Cannot be fully disabled by `prefers-reduced-motion` without JS. Continuous animation under glass surfaces creates visual "swimming" that disorients older readers. GPU cost of animated large-area gradients on mobile is significant. | Static gradient mesh (existing). If more visual interest is needed, use scroll-driven opacity change on the mesh (appears/intensifies as user scrolls into hero). |

### ANTI-03: Auto-Playing Shimmer on Multiple Cards

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Extending the existing `shimmer-sweep` animation to all glass cards | Current liquid-glass.css correctly limits shimmer to "hero CTA only, max 1 per viewport." Extending to all cards violates the principle. Multiple shimmers create a "disco" effect that is disorienting for 45+ users and cheapens the premium feel. AppleVis report specifically criticizes persistent animations on glass surfaces. | Keep shimmer on hero CTA only. For card interaction feedback, use the brightness hover effect (DIFF-03) instead. |

### ANTI-04: Heavy Box Shadows on Glass

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Adding `box-shadow: 0 20px 60px rgba(0,0,0,0.3)` to glass cards for "depth" | The glass system already provides depth via `backdrop-filter` blur + inset rim lights + subtle outer shadow. Adding heavy outer shadows over translucent backgrounds creates visual mud. The v1.3 design decision explicitly removed heavy shadows. Double depth signaling (blur + shadow) confuses the visual hierarchy. | Rely on existing `--liquid-shadow-outer` (16px 40px at 0.16 opacity). Adjust only if audit reveals insufficient depth cue on specific backgrounds. |

### ANTI-05: CSS Scroll-Snap for Section Navigation

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| `scroll-snap-type: y mandatory` on the page for section-by-section scrolling | Medical content needs continuous, unconstrained scrolling. 45+ users with motor control variations fight against scroll-snap. Mandatory snap interferes with reading flow and makes it impossible to position content at a comfortable reading point. | Free scrolling (existing). Sticky nav with section links for direct navigation. Scroll progress indicator (DIFF-02) for orientation. |

### ANTI-06: CSS Houdini / Paint Worklets for Glass Effects

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Using `CSS.paintWorklet` for custom glass/frost effects | Safari and Firefox do NOT support CSS Paint API. The entire project constraint is vanilla CSS without build tools. Paint worklets require registration JS. The existing `backdrop-filter` approach works across all browsers and is the standard solution. | Continue using `backdrop-filter` with `-webkit-` fallback (already implemented). |

---

## Feature Dependencies

```
[ACC-01: prefers-contrast] ──independent──> Token overrides only
[ACC-02: prefers-reduced-transparency] ──independent──> Token overrides only
[ACC-03: Worst-case contrast audit] ──may-require──> Raising --liquid-bg opacity
    ──feeds──> [TYPO-01: text readability] (audit informs needed opacity)

[INT-01: focus-visible system] ──independent──> CSS addition
[INT-02: card hover/focus/active] ──depends-on──> [INT-01] for consistent focus ring
[INT-03: form loading state] ──independent──> JS + CSS change

[DIFF-01: scroll-driven animations] ──independent──> @supports progressive enhancement
[DIFF-02: scroll progress CSS] ──depends-on──> [DIFF-01] uses same API
[DIFF-03: glass hover brightness] ──independent──> CSS change on existing selectors
[DIFF-04: reduced-motion refinement] ──conflicts-with──> Existing global * override
    ──must-be-done-carefully──> Refactors prefers-reduced-motion blocks in BOTH
    styles.css AND liquid-glass.css

[DIFF-06: mobile glass budget] ──depends-on──> [ACC-03] contrast audit
    (lowering blur changes effective contrast)

[DIFF-07: view transitions] ──independent──> CSS addition + meta tag
```

### Critical Ordering

1. **ACC-03 (contrast audit) must precede DIFF-06 (mobile blur budget)** -- reducing blur on mobile changes effective contrast of glass surfaces. Audit first, then set mobile blur floor.
2. **INT-01 (focus-visible) must precede INT-02 (card states)** -- card focus ring inherits from global system.
3. **DIFF-04 (reduced-motion refinement) requires careful refactoring** -- the global `*` override in both stylesheets must be replaced simultaneously to avoid inconsistency.

---

## MVP Recommendation

### Phase 1: Accessibility Foundation (Highest Priority)

Ship these first -- they address real accessibility gaps and Apple Liquid Glass compliance failures.

1. **ACC-01** `prefers-contrast: more` -- LOW complexity, major accessibility gap
2. **ACC-02** `prefers-reduced-transparency` -- LOW complexity, direct Apple HIG compliance
3. **ACC-03** Worst-case contrast audit -- MEDIUM complexity, informs all subsequent work
4. **INT-01** Focus-visible system -- LOW-MEDIUM complexity, keyboard accessibility gap
5. **DIFF-08** Touch target audit -- LOW complexity, WCAG 2.2 compliance

### Phase 2: Interaction Polish

6. **INT-02** Card hover/focus/active completeness
7. **INT-03** Form submit loading state
8. **DIFF-03** Glass hover brightness (Apple model)
9. **DIFF-04** Reduced-motion deep compliance

### Phase 3: Performance + Visual

10. **TYPO-01** Glass-on-text readability (informed by ACC-03 audit)
11. **DIFF-06** Mobile glass layer budget
12. **DIFF-01** Scroll-driven animations (progressive enhancement)
13. **DIFF-02** Scroll progress CSS enhancement

### Defer to v7.x or Later

14. **DIFF-05** Skeleton loading states -- site is static, fast; low urgency
15. **DIFF-07** Cross-document view transitions -- Chrome/Edge only; impressive but not critical

---

## Feature Prioritization Matrix

| ID | Feature | User Value | Impl Cost | Priority | Risk for 45+ |
|----|---------|------------|-----------|----------|---------------|
| ACC-01 | prefers-contrast fallback | HIGH | LOW | P0 | LOW (improves access) |
| ACC-02 | prefers-reduced-transparency | HIGH | LOW | P0 | LOW (improves access) |
| ACC-03 | Worst-case contrast audit | HIGH | MEDIUM | P0 | LOW (audit, not change) |
| INT-01 | Focus-visible system | HIGH | LOW | P0 | LOW (improves access) |
| DIFF-08 | Touch target audit | HIGH | LOW | P0 | LOW (improves access) |
| INT-02 | Card state completeness | MEDIUM | LOW | P1 | LOW |
| INT-03 | Form loading state | MEDIUM | LOW | P1 | LOW (prevents confusion) |
| DIFF-03 | Glass hover brightness | MEDIUM | LOW | P1 | LOW |
| DIFF-04 | Reduced-motion refinement | MEDIUM | MEDIUM | P1 | LOW (improves access) |
| TYPO-01 | Glass text readability | MEDIUM | LOW | P1 | LOW (improves readability) |
| DIFF-06 | Mobile glass budget | MEDIUM | MEDIUM | P2 | LOW (improves perf) |
| DIFF-01 | Scroll-driven animations | LOW | MEDIUM | P2 | LOW (progressive enh.) |
| DIFF-02 | Scroll progress CSS | LOW | LOW | P2 | LOW |
| DIFF-05 | Skeleton states | LOW | LOW-MED | P3 | LOW |
| DIFF-07 | View transitions | LOW | MEDIUM | P3 | LOW (progressive enh.) |

**Priority key:**
- P0: Must-have for v7.0 (accessibility compliance, Apple HIG gaps)
- P1: Should-have (interaction polish, readability improvement)
- P2: Nice-to-have (performance, progressive enhancement)
- P3: Defer (low urgency, limited browser support)

---

## Domain-Specific Research Findings

### 1. Apple Liquid Glass Accessibility Failures (Lessons for This Project)

**Confidence: HIGH (multiple verified sources)**

Apple's March 2026 AppleVis accessibility report card gave Liquid Glass failing marks in visual accessibility. Key criticisms directly applicable to this project:

- **Translucent surfaces persist even when "Increase Contrast" is enabled.** The site must respond to `prefers-contrast: more` by making glass surfaces opaque.
- **Thin interface elements on glass are hard to see.** The specular rim lights (1px `::before` pseudo-elements) may be invisible to low-vision users. Under high-contrast mode, these should thicken to 2px or be replaced with solid borders.
- **Animations continue under reduced motion.** The glint animation (`animation: glint 6s linear infinite`) is a continuous loop -- it must be stopped under `prefers-reduced-motion`, not just shortened.
- **Dark mode glass is especially problematic.** Apple's dark Liquid Glass received the harshest criticism. The project already disables glass in dark mode (replaced with opaque dark surfaces) -- this decision is validated by the Apple report.

### 2. WCAG 2.2 on Dynamic Backgrounds

**Confidence: HIGH (W3C specification)**

WCAG 2.2 SC 1.4.3 states contrast must be measured against the actual rendered appearance. For translucent surfaces, this means:
- Measure contrast when the glass surface is at its LIGHTEST (scrolled over a white section).
- Measure contrast when the glass surface is at its DARKEST (scrolled over a tinted section).
- The WORST measurement is what counts for compliance.
- If a glass card can appear over multiple backgrounds during scrolling, ALL positions must pass.

### 3. Scroll-Driven Animations Status (April 2026)

**Confidence: HIGH (MDN, caniuse verified)**

The landscape has changed significantly since the v1.4 research (March 2026):
- Safari 26 added support -- this was the missing piece.
- Chrome/Edge: full support since v115 (2023).
- Firefox: still behind flag (`layout.css.scroll-driven-animations.enabled`).
- Scroll-driven animations are part of Interop 2026 (Webkit confirmed).
- **Recommendation change:** Previously listed as anti-feature. Now viable as progressive enhancement with `@supports (animation-timeline: view())` gate. ~85% coverage.

### 4. Touch Target Research for 45+ Audience

**Confidence: MEDIUM (UX research, not clinical)**

University of Maryland research (2023): targets smaller than 44x44px have 3x higher error rates. Sites with proper target sizes see 28% reduction in touch errors. For 45+ users with reduced fine motor control, 48px minimum (Google Material Design recommendation) is appropriate. Apple HIG requires 44x44 points.

### 5. Typography on Glass for Older Adults

**Confidence: MEDIUM (ophthalmology UX literature)**

- Body text on semi-transparent backgrounds loses effective contrast. The background "noise" from blurred content behind glass reduces perceived readability even when measured contrast passes WCAG thresholds.
- **Recommended mitigation:** Subtle text-shadow creates a "halo" that stabilizes letter edges against variable backgrounds. Shadow color should match the glass surface (white halo for light mode, dark halo for dark mode).
- Font weight bump from 400 to 450 (or 500) on glass surfaces compensates for the reduced perceived contrast without making text look bold.
- Inter Variable supports fractional weights -- using `font-weight: 450` is possible.

---

## Sources

### Confirmed (HIGH confidence)
- [prefers-contrast -- MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast) -- 94.6% browser support
- [prefers-reduced-transparency -- MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency) -- ~73% support
- [animation-timeline: scroll() -- caniuse](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) -- 84.7% support
- [WCAG 2.2 SC 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WCAG 2.2 SC 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [W3C Technique C45: focus-visible](https://www.w3.org/WAI/WCAG21/Techniques/css/C45)
- [CSS Scroll-driven Animations -- MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [View Transition API -- MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Interop 2026 -- WebKit](https://webkit.org/blog/17818/announcing-interop-2026/)

### Referenced (MEDIUM confidence)
- [Liquid Glass accessibility criticism -- 9to5Mac/AppleVis](https://9to5mac.com/2026/03/18/liquid-glass-and-long-standing-bugs-push-apples-grades-down-in-visual-accessibility-report-card/)
- [Liquid Glass accessibility -- Infinum](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/)
- [Liquid Glass less transparency, more contrast -- Six Colors](https://sixcolors.com/post/2025/11/soaping-up-liquid-glass-less-transparency-more-contrast/)
- [Liquid Glass practical guidance -- Designed for Humans](https://designedforhumans.tech/blog/liquid-glass-smart-or-bad-for-accessibility)
- [Glassmorphism meets accessibility -- Axess Lab](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/)
- [Healthcare web design 2026 -- Adchitects](https://adchitects.co/blog/web-design-for-healthcare-best-practices-and-guidelines)
- [Typography for older adults -- PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9376262/)
- [Health Literacy Online -- ODPHP](https://odphp.health.gov/healthliteracyonline/design-easy-scanning/use-readable-font-thats-least-16-pixels)
- [Button states -- NN/g](https://www.nngroup.com/articles/button-states-communicate-interaction/)

### Not Found / Unable to Verify
- Kazakhstan-specific device fragmentation data (budget Android prevalence) -- relied on PROJECT.md assertion
- Clinical study on text readability degradation through translucent surfaces -- design literature only, no ophthalmology primary source
- Firefox scroll-driven animations timeline for unflagging -- no confirmed date

---

*Feature research for: MedicusUnion KZ -- v7.0 UI/UX Design Excellence*
*Researched: 2026-04-13*
*Downstream consumer: v7.0 roadmap phase planning*
