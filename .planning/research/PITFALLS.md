# Domain Pitfalls: UI/UX Design Excellence on Existing Liquid Glass System

**Domain:** Adding accessibility, performance, and micro-interaction improvements to an existing Liquid Glass medical landing site (vanilla HTML/CSS/JS, audience 45+, Kazakhstan)
**Researched:** 2026-04-13
**Milestone:** v7.0 UI/UX Design Excellence
**Confidence:** HIGH (codebase-verified pitfalls cross-referenced with MDN specs, NN/g research, Apple WWDC 2025 materials, and WCAG 2.2 standards)

---

## Critical Pitfalls

Mistakes that cause visual regression, accessibility failure, or require reverting merged work.

---

### Pitfall 1: prefers-contrast:more Flattens the Entire Glass Visual Hierarchy

**Improvement area:** Accessibility -- adding `prefers-contrast:more` media query
**What goes wrong:**
Naively responding to `prefers-contrast:more` by making glass opaque (e.g., `background: white; backdrop-filter: none`) removes the visual depth cues that distinguish the three-tier glass hierarchy (nav < regular < clear). All glass surfaces become identical opaque white rectangles. The page loses its layering -- cards look identical to the header, the pricing section loses its elevated feel, and the visual rhythm collapses into a flat page. The user who requested high contrast gets a more readable but structurally confusing layout.

**Why it happens:**
Developers treat `prefers-contrast:more` as a binary switch -- glass on or glass off. They write one rule that kills all glassmorphism uniformly without preserving the hierarchy signals that glassmorphism was encoding (depth, grouping, elevation).

**Consequences:**
- Cards, header, and stats bar become visually indistinguishable
- Navigation loses its "sticky floating" affordance when it looks like every other white block
- Pricing card loses its "elevated primary action" visual weight
- Users who need high contrast get readability but lose wayfinding

**Prevention:**
1. Define a **contrast-safe hierarchy** that preserves depth without transparency:
   ```css
   @media (prefers-contrast: more) {
     /* Nav: lightest -- white with thin bottom border */
     .liquid-nav {
       background: white;
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       border-bottom: 2px solid var(--color-dark);
       box-shadow: none;
     }

     /* Cards: medium weight -- light gray fill with strong border */
     .liquid-card,
     .liquid-regular {
       background: #F5F7F9;
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       border: 2px solid rgba(0, 0, 0, 0.2);
       box-shadow: none;
     }

     /* Stats/pricing: heaviest -- darker fill or thicker border */
     .stats-glass {
       background: #EDF0F4;
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       border: 2px solid rgba(0, 0, 0, 0.3);
       box-shadow: none;
     }
   }
   ```
2. Remove ALL pseudo-element decorations (glint, specular rim, shimmer) under `prefers-contrast:more` -- they produce faint low-contrast visual noise.
3. Test with macOS "Increase Contrast" system setting (System Settings > Accessibility > Display > Increase contrast) which triggers the media query.
4. Also handle `prefers-reduced-transparency: reduce` -- currently Chrome/Edge only (as of early 2026), but this is the more semantically precise query for glass removal. Use both:
   ```css
   @media (prefers-contrast: more), (prefers-reduced-transparency: reduce) {
     /* ... opaque fallbacks ... */
   }
   ```
5. Verify the flattened layout still communicates section boundaries via borders, background color steps, or spacing rather than relying on glass depth cues.

**Detection (warning signs):**
- All glass classes share a single `backdrop-filter: none; background: white` override
- No border or background-color differentiation between nav, card, and stats in contrast mode
- Glint/shimmer pseudo-elements still rendering (faint white-on-white noise)
- Testing only in normal mode and assuming contrast mode "just works"

**Phase:** Address in the accessibility/prefers-contrast phase. Test immediately after implementing -- do not defer testing.

---

### Pitfall 2: Reducing Mobile Blur Below Identity Threshold

**Improvement area:** Performance -- reducing blur on mobile to stay within GPU budget
**What goes wrong:**
The current system uses `--liquid-blur-md: 24px` and `--liquid-blur-lg: 40px` (with hero sections hitting 60px via `--liquid-blur-xl`). Reducing these too aggressively on mobile (e.g., to 4-6px) makes glass surfaces look like slightly tinted transparent divs rather than frosted glass. The material loses its identity -- it no longer reads as "glass" and instead looks like a CSS bug (semi-transparent overlay with no visual purpose).

**Why it happens:**
Developers chase performance metrics (GPU memory, compositing layer count) and linearly scale blur down. They optimize for numbers without visual QA on actual mobile devices. The "glass identity threshold" is approximately 10-12px of blur -- below that, the frosting effect is too subtle to register as an intentional material.

**Consequences:**
- Cards look like semi-transparent overlays with no visual purpose
- Users perceive the design as broken or unfinished rather than intentionally translucent
- The visual language that communicates "premium medical service" is lost
- Dark mode glass (already harder to read) becomes completely ambiguous

**Prevention:**
1. Set a **minimum blur floor** of 10px on mobile. Never go below this regardless of performance pressure:
   ```css
   @media (max-width: 768px) {
     :root {
       --liquid-blur-sm: 10px;   /* was 16px */
       --liquid-blur-md: 14px;   /* was 24px */
       --liquid-blur-lg: 20px;   /* was 40px */
       --liquid-blur-xl: 20px;   /* was 60px -- capped, not scaled */
     }
   }
   ```
2. Compensate for reduced blur by **increasing background opacity** to maintain the frosted appearance:
   ```css
   @media (max-width: 768px) {
     :root {
       --liquid-bg: rgba(255, 255, 255, 0.55); /* was 0.42 */
     }
   }
   ```
3. **Remove glass entirely from non-essential surfaces** on mobile rather than degrading all surfaces. The priority is: header glass (keep) > pricing card (keep) > stat cards (remove) > section decorations (remove). Reducing the count of glass surfaces is better than making all glass worse.
4. Test on actual budget Android devices (Samsung Galaxy A13/A14, Xiaomi Redmi series) prevalent in Kazakhstan market. Chrome DevTools throttling does not accurately simulate GPU constraints.
5. If blur must go below 10px due to extreme device constraints, **switch to opaque material** rather than producing an ambiguous in-between state:
   ```css
   @media (max-width: 480px) and (prefers-reduced-motion: reduce) {
     .liquid-card,
     .liquid-regular {
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       background: rgba(255, 255, 255, 0.92);
       border: 1px solid rgba(0, 0, 0, 0.08);
     }
   }
   ```

**Detection (warning signs):**
- Blur values below 10px on any mobile breakpoint
- Background opacity not increased when blur is reduced (losing frosted appearance)
- Testing only in Chrome DevTools responsive mode without real device GPU testing
- All glass surfaces scaled uniformly instead of selectively removing non-essential ones

**Phase:** Performance optimization phase. Pair with glass layer count reduction (max 4 per viewport).

---

### Pitfall 3: filter:drop-shadow on Ancestors Breaks backdrop-filter (Known Regression Vector)

**Improvement area:** Visual polish -- adding shadow consistency or micro-interactions
**What goes wrong:**
During visual polish work, a developer adds `filter: drop-shadow()` to a parent element (section wrapper, card container, decorative element) that has glass children. The `filter` property creates a new backdrop root, which causes all `backdrop-filter` on descendant elements to silently stop working. Glass surfaces become plain semi-transparent rectangles with no blur. This is already documented in the codebase (commit ba29f8a, squircles.css anti-pattern docs) but is the single most likely regression during visual polish work.

**Why it happens:**
Per CSS Filter Effects spec, `filter` (including `drop-shadow()`) creates a containing block and a new stacking context that acts as a backdrop root. Child `backdrop-filter` elements sample from this new root (which contains only the parent's rendered output) rather than from the page behind them. The visual result: no blur, no frosted glass effect.

**Consequences:**
- All glass children of the affected ancestor lose their frosted appearance
- The failure is silent -- no console error, no broken layout, just missing blur
- May only be caught visually, and can slip through if testing on a white background (where missing blur is less obvious)
- Regressions are hard to trace because the cause (parent's filter) is far from the symptom (child's missing blur)

**Prevention:**
1. **Absolute rule: NEVER use `filter: drop-shadow()` on any element that has glass descendants.** Use `box-shadow` instead. This rule is already in the codebase docs but must be re-enforced in any visual polish phase.
2. Add a **CSS lint comment** at the top of any file that touches glass:
   ```css
   /* WARNING: filter: drop-shadow() on ancestors breaks backdrop-filter on glass children.
      Use box-shadow instead. See commit ba29f8a and squircles.css anti-pattern docs. */
   ```
3. Create a **visual regression test** that screenshots glass surfaces against a colorful background. On a white background, missing blur is invisible; against a gradient or image, it's immediately obvious.
4. If adding hover/focus effects to glass card containers, use `box-shadow` transitions only. Never transition `filter` properties on glass ancestors.
5. Search the entire CSS file for `filter:` usage before shipping any visual polish phase:
   ```bash
   grep -n "filter:" css/styles.css | grep -v "backdrop-filter" | grep -v "brightness" | grep -v "saturate"
   ```

**Detection (warning signs):**
- Any `filter:` property (especially `drop-shadow()`) on a wrapper/section/container element
- Glass children suddenly losing their frosted effect after a "visual polish" commit
- Hover effects on card wrappers using `filter` instead of `box-shadow`
- SVG filters applied to decorative parent elements

**Phase:** Must be enforced during EVERY phase that touches CSS, but especially visual polish and micro-interactions phases.

---

### Pitfall 4: Contrast Testing Tools Produce False Passes on Glass Surfaces

**Improvement area:** Accessibility -- worst-case contrast testing on translucent surfaces
**What goes wrong:**
Standard contrast checking tools (WebAIM Contrast Checker, Lighthouse audit, axe DevTools) evaluate contrast between the declared foreground color and the declared background color. On glass surfaces, the "background color" is not a single CSS value -- it is the visual composite of `backdrop-filter` blur, the semi-transparent `background` layer, any inset shadows, and whatever content sits behind the element. Tools report the contrast against `rgba(255, 255, 255, 0.42)` composited against white (the paint-order calculation), which yields a pass. In practice, when the glass scrolls over a dark section, the effective contrast drops below 4.5:1.

**Why it happens:**
Automated tools do static analysis of CSS declarations. They cannot evaluate the rendered pixel output of `backdrop-filter` composited against variable backgrounds. Even Polypane (which handles opacity) calculates against a single assumed parent background, not all possible scroll positions.

**Consequences:**
- Lighthouse reports 100% contrast compliance while real users on mobile see unreadable text
- WCAG AA/AAA violations that only manifest at specific scroll positions
- Legal risk for a medical service site in the EU accessibility compliance context (European Accessibility Act 2025)
- 45+ audience with age-related vision changes experiences reading difficulty that younger testers do not notice

**Prevention:**
1. **Manual worst-case testing protocol:**
   - Open each page in browser
   - Scroll glass elements over EVERY section background (white, cream, blue, gray, navy, gradient)
   - At each position, use browser DevTools color picker to sample the actual rendered pixel behind the text
   - Calculate contrast ratio of text color against that sampled pixel
   - The glass must pass 4.5:1 (AA body) at EVERY scroll position, not just the intended one
2. **Set minimum background opacity floor** that guarantees contrast regardless of backdrop:
   - For body text on glass: `background` opacity >= 0.55 in light mode, >= 0.65 in dark mode
   - Current `--liquid-bg: rgba(255, 255, 255, 0.42)` is below this threshold and will fail against dark backgrounds
3. **Polypane browser** is the only tool that accounts for opacity when calculating contrast. Use it as primary testing tool, but still manually verify against dark backgrounds that Polypane may not simulate.
4. Add a **semi-opaque safety layer** behind text content specifically:
   ```css
   .liquid-card__content {
     position: relative;
     z-index: 2; /* above glint/shimmer pseudo-elements */
     /* Optional: text shadow as last resort for readability */
   }
   ```
5. For the current codebase: `--liquid-bg` at `0.42` is designed for white/near-white section backgrounds. If glass cards ever appear over the navy section (`--color-navy: #1A365D`) or over gradient mesh backgrounds, the opacity MUST be increased locally or glass must not be used.

**Detection (warning signs):**
- Lighthouse reporting 100% contrast pass on pages with glassmorphism
- Contrast tested only against intended section background, not all scroll positions
- `--liquid-bg` opacity below 0.55 for surfaces containing body text
- No manual pixel-sampling done during accessibility audit

**Phase:** Must be completed as part of the accessibility phase. Cannot be deferred -- it blocks the claim of WCAG compliance.

---

## Moderate Pitfalls

### Pitfall 5: Scroll-Driven CSS Animations Conflicting with Existing IntersectionObserver

**Improvement area:** Micro-interactions -- adding scroll-driven animations alongside existing JS animations
**What goes wrong:**
The codebase uses IntersectionObserver to trigger `.is-visible` class additions for scroll-reveal animations (opacity + translateY transitions). Adding CSS `animation-timeline: scroll()` or `animation-timeline: view()` to the same elements creates a conflict: the CSS scroll-driven animation continuously overwrites the transform/opacity values that the JS-triggered transition is trying to set. The element either jitters between two animation states or the CSS scroll-driven animation wins and the JS-triggered entrance is ignored.

**Why it happens:**
CSS scroll-driven animations are live -- they continuously compute property values based on scroll position. JS-triggered class additions set a one-time transition from A to B. When both target the same properties (transform, opacity), the scroll-driven animation's continuous value overrides the discrete class-based transition.

**Prevention:**
1. **Never apply scroll-driven animations to elements that also use the `.animate-on-scroll` class.** These are two different animation paradigms that compete for the same properties.
2. **Choose one system per element:**
   - Entrance animations (fade-in once): keep IntersectionObserver + `.is-visible` class (the current system)
   - Scroll-linked animations (parallax, progress indicators, header shrink): use CSS `animation-timeline: scroll()`
3. **If adding scroll-driven animations to new elements**, use `@supports (animation-timeline: scroll())` for progressive enhancement with the existing IntersectionObserver system as fallback:
   ```css
   @supports (animation-timeline: view()) {
     .new-parallax-element {
       animation: parallax-shift linear both;
       animation-timeline: view();
       animation-range: entry 0% exit 100%;
     }
   }
   ```
   In JS, skip IntersectionObserver for elements that have scroll-driven animation support.
4. **Browser support reality (as of early 2026):**
   - Chrome/Edge 115+: full support
   - Safari 18+: supported
   - Firefox: behind flag, not production-ready
   - The Kazakhstan audience on budget Androids mostly uses Chrome, so support is good, but Firefox users need the IO fallback
5. **Stagger migration**: do not convert existing IntersectionObserver animations to scroll-driven animations in this milestone. Add scroll-driven animations only to NEW elements. Convert existing ones in a future milestone after Firefox ships support unflagged.

**Detection (warning signs):**
- Both `animation-timeline` and `.animate-on-scroll` class on the same element
- Elements jittering or snapping during scroll
- Entrance animations not playing (overridden by scroll-driven animation)
- No `@supports` gate around `animation-timeline` usage

**Phase:** Micro-interactions phase. Keep the systems separate and clearly documented.

---

### Pitfall 6: Simultaneous Shimmer/Glint Animations Exceeding CA 45+ Motion Budget

**Improvement area:** Micro-interactions -- existing glint animation runs on ALL `.liquid-card` elements simultaneously
**What goes wrong:**
The current codebase has `.liquid-card::before` with `animation: glint 6s linear infinite` on ALL liquid cards. When multiple cards are visible in the viewport simultaneously (e.g., 3-4 advantage cards on desktop, 2-3 on mobile), each runs its own glint animation. For the 45+ audience, multiple simultaneous motion sources in peripheral vision trigger vestibular discomfort. NN/g and vestibular research confirm that ~35% of adults over 40 have some motion sensitivity. The shimmer sweep (`.shimmer-sweep`) adds another animation source if used in the same viewport.

**Consequences:**
- Users with vestibular sensitivity experience discomfort or nausea
- Users with age-related vision changes find the constant subtle motion distracting
- The animations compete for attention rather than guiding focus
- `prefers-reduced-motion: reduce` handles the extreme case, but many users who find multiple animations uncomfortable have NOT enabled that system setting

**Prevention:**
1. **Limit to 1 animated glint per viewport.** Use IntersectionObserver to pause/play glint animations based on visibility, and only allow the first visible card to animate:
   ```javascript
   // Only one glint active at a time
   var activeGlint = null;
   var glintObserver = new IntersectionObserver(function(entries) {
     entries.forEach(function(entry) {
       if (entry.isIntersecting && !activeGlint) {
         entry.target.style.animationPlayState = 'running';
         activeGlint = entry.target;
       } else if (!entry.isIntersecting && activeGlint === entry.target) {
         entry.target.style.animationPlayState = 'paused';
         activeGlint = null;
       }
     });
   }, { threshold: 0.5 });
   ```
2. **Alternatively, remove infinite glint entirely.** Replace with a one-shot glint that plays once when the card enters the viewport (via IntersectionObserver), then stops. One sweep is a delightful entrance; infinite sweep is visual noise.
3. **Shimmer sweep: hero only.** The `.shimmer-sweep` class docstring already says "Max 1 per viewport" -- enforce this in code review.
4. Add `will-change: background-position` ONLY during the active animation, not as a permanent declaration (the current code has it permanent, which wastes GPU memory):
   ```css
   .liquid-card::before {
     /* Remove: will-change: background-position; */
   }
   .liquid-card.glint-active::before {
     will-change: background-position;
   }
   ```
5. For the `prefers-reduced-motion` audience: the current code already disables animations, which is correct. But consider adding a **middle ground** for users who want SOME motion but not ALL:
   ```css
   /* Reduce, don't eliminate: run glint once slowly instead of never */
   @media (prefers-reduced-motion: reduce) {
     .liquid-card::before {
       animation: none; /* existing -- full disable is correct for this audience */
     }
   }
   ```

**Detection (warning signs):**
- More than 1 element with active `animation: glint` visible simultaneously
- `will-change` declared statically on non-animating elements
- Shimmer sweep used on non-hero elements
- No IntersectionObserver gating on glint playback

**Phase:** Micro-interactions phase. This is a code change, not a new feature -- it modifies existing glint behavior.

---

### Pitfall 7: CSS Custom Property Cascade Regression When Adding prefers-contrast Overrides

**Improvement area:** Accessibility + dark mode -- modifying the CSS custom properties cascade
**What goes wrong:**
The Liquid Glass system relies on a token cascade: `:root` defines `--liquid-*` tokens, `.dark` overrides them, and individual components reference them via `var()`. Adding `@media (prefers-contrast: more)` rules that override these same tokens creates a three-way specificity conflict. The media query rules have the same specificity as `:root` but different source order. Depending on where the `@media` block is placed in the file, it may or may not override `.dark` class values.

Concrete scenario: you add `@media (prefers-contrast: more) { :root { --liquid-bg: white; } }`. In light mode this works. In dark mode, `.dark { --liquid-bg: rgba(30, 40, 60, 0.45); }` has higher specificity than `:root` inside the media query, so the dark-mode glass remains semi-transparent even when the user requested high contrast. The high-contrast override silently fails in dark mode.

**Why it happens:**
CSS custom property cascade follows normal specificity rules. `.dark` (class selector) beats `:root` (pseudo-class) in specificity. A media query does not increase specificity. Developers test in light mode, see it work, and ship without dark-mode testing.

**Prevention:**
1. **Override tokens on BOTH `:root` AND `.dark`** inside the media query:
   ```css
   @media (prefers-contrast: more) {
     :root {
       --liquid-bg: white;
       --liquid-blur-md: 0px;
       /* ... all light-mode high-contrast overrides ... */
     }
     .dark {
       --liquid-bg: #1a1a2e;
       --liquid-blur-md: 0px;
       /* ... all dark-mode high-contrast overrides ... */
     }
   }
   ```
2. **Test the matrix:** Light + normal contrast, Light + high contrast, Dark + normal contrast, Dark + high contrast. That is 4 states, not 2.
3. For the vanilla HTML/CSS site (styles.css), the dark mode was removed ("Dark mode removed -- light-only medical design for 45+ audience" at line 154). But the Liquid Glass design system in `src/styles/theme.css` has a `.dark` class. Ensure you know WHICH CSS file you are modifying and whether dark mode applies.
4. **Place media query overrides AFTER all theme blocks** in source order to maximize their cascade priority:
   ```css
   /* 1. :root tokens */
   /* 2. .dark tokens */
   /* 3. Component styles */
   /* 4. Media query overrides (last = highest source-order priority at same specificity) */
   @media (prefers-contrast: more) { ... }
   @media (prefers-reduced-transparency: reduce) { ... }
   @media (prefers-reduced-motion: reduce) { ... }
   ```
5. **Never override tokens on arbitrary selectors inside media queries.** Only override on `:root` and `.dark` (the same selectors that define them). Overriding on `.liquid-card` inside a media query will have higher specificity than intended and may cause issues when component styles change.

**Detection (warning signs):**
- `prefers-contrast` media query only overrides `:root`, not `.dark`
- High-contrast mode tested only in light theme
- Media query blocks placed before `.dark` block in source order
- Token overrides on component-level selectors inside media queries

**Phase:** Accessibility phase. Test all 4 theme/contrast combinations before shipping.

---

### Pitfall 8: Removing Glass Layers for Performance Breaks Layout Spacing and Visual Weight

**Improvement area:** Performance -- reducing the 5 simultaneous glass compositing layers to Apple's recommended max 4
**What goes wrong:**
The index page currently has 5 glass compositing layers visible simultaneously at certain scroll positions (per the audit). The "fix" is to remove `backdrop-filter` from some elements. But glass elements have padding, background fills, shadows, and borders calibrated for the translucent material. Removing `backdrop-filter` without adjusting the surrounding visual treatment produces an element that looks like it belongs to a different design system -- a plain white card among frosted glass cards.

Additionally, glass surfaces with `isolation: isolate` create stacking contexts. Removing the glass class may also remove `isolation: isolate`, changing the z-index stacking order and potentially causing elements to overlap incorrectly.

**Why it happens:**
Developers remove `backdrop-filter` and call it done. They do not consider that the glass material includes 5+ visual properties working together (background, backdrop-filter, box-shadow inset, specular rim, glint border). Removing one without adjusting the others leaves a visually inconsistent element.

**Prevention:**
1. **Create a `.liquid-card--solid` variant** that is visually consistent with glass cards but does not use `backdrop-filter`:
   ```css
   .liquid-card--solid {
     isolation: isolate;  /* preserve stacking context */
     position: relative;
     background: rgba(255, 255, 255, 0.92);
     box-shadow:
       inset 0 1px 0 rgba(255, 255, 255, 0.95),
       inset 0 -1px 0 rgba(200, 210, 225, 0.15),
       0 16px 40px rgba(20, 30, 60, 0.10); /* slightly reduced from glass */
     /* NO backdrop-filter */
     /* NO glint animation */
     /* NO specular rim */
   }
   ```
2. **Decide which surfaces to demote** based on hierarchy importance:
   - Header/nav: KEEP glass (always visible, defines brand identity)
   - Pricing card: KEEP glass (primary conversion element)
   - Advantage/benefit cards: DEMOTE to solid (multiple visible, biggest GPU cost)
   - Stats bar: EVALUATE -- single element but uses `--liquid-blur-lg` (40px), heavy
3. **Maintain `isolation: isolate`** on demoted elements to preserve stacking context behavior. Do not remove it just because backdrop-filter is removed.
4. **A/B test visually** -- render the page with glass and with solid variants side by side. The solid variant should look like a deliberate design choice, not a broken version of the glass variant.
5. **Use media queries for selective demotion** rather than removing glass globally:
   ```css
   @media (max-width: 768px) {
     .advantages__card.liquid-card {
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       background: rgba(255, 255, 255, 0.92);
     }
     .advantages__card.liquid-card::before {
       display: none; /* remove glint on solid card */
     }
   }
   ```

**Detection (warning signs):**
- `backdrop-filter: none` added without corresponding background/shadow adjustments
- Stacking context changes (elements overlapping) after glass removal
- Visual inconsistency between glass cards and "optimized" cards
- Glass removed globally instead of selectively per viewport size

**Phase:** Performance optimization phase. Create the solid variant first, test visually, then deploy.

---

## Minor Pitfalls

### Pitfall 9: Safari -webkit-backdrop-filter CSS Variable Bug Regression

**Improvement area:** Any CSS modification touching glass tokens
**What goes wrong:**
Safari ignores CSS custom properties inside `-webkit-backdrop-filter`. The codebase already has a mitigation (hardcoded fallback line before the var()-based line), but any CSS modification that reorders the declarations or removes the "duplicate" line (thinking it is redundant) breaks Safari glass rendering. This is a well-known bug, already documented at line 67-72 of liquid-glass.css, but CSS cleanup or minification can reintroduce it.

**Prevention:**
1. Never remove what looks like a "duplicate" `-webkit-backdrop-filter` declaration. The pattern is intentional:
   ```css
   -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%); /* Safari fallback */
   -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
   ```
   Safari uses the first (hardcoded) line; Chrome uses the second (var-based) line.
2. After ANY CSS minification or build step, verify Safari rendering.
3. Add a CSS comment on every instance: `/* Safari fallback -- do not remove */`

**Detection:** Glass surfaces appearing fully transparent (no blur) in Safari after a CSS change.

**Phase:** Enforced during every phase. Add to CSS review checklist.

---

### Pitfall 10: mask-image on Squircles Clips box-shadow and Borders

**Improvement area:** Visual polish -- adding borders or new shadow effects to glass cards
**What goes wrong:**
Squircle elements use `mask-image` (SVG data-URI) to achieve superellipse corners. Per CSS spec, `mask-image` clips ALL visual output of the element, including `box-shadow` and `border`. Adding a visible border to a squircle glass card produces a clipped border that only shows within the mask shape (correct curve) but with visible clipping artifacts at the anti-aliased mask edges. This is already documented in squircles.css anti-pattern section but is easy to forget during visual polish.

**Prevention:**
1. Use `box-shadow: inset 0 0 0 1px <color>` instead of `border` for squircle elements.
2. The `.border-inset-glass` utility class already exists in theme.css -- use it.
3. Chrome 139+ with `corner-shape: squircle` removes the mask-image entirely, making borders safe. But the site must work on pre-139 browsers, so the inset shadow pattern remains the production default.
4. Outer `box-shadow` IS clipped by mask-image but produces "visually acceptable" results per codebase docs. If perfectly unclipped outer shadows are needed, use the shadow-wrap pattern (a parent element with the shadow, child with the mask).

**Detection:** Borders appearing with jagged or clipped edges on card corners.

**Phase:** Visual polish phase. Reference squircles.css anti-pattern docs before adding any borders.

---

### Pitfall 11: prefers-reduced-motion: reduce Disabling Functional Transitions

**Improvement area:** Accessibility -- ensuring reduced motion does not break functional UI
**What goes wrong:**
The current global reduced-motion rule (line 208-215 of styles.css and line 402-418 of theme.css) applies `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` to ALL elements. This correctly removes decorative animations but also breaks functional transitions: FAQ accordion height transitions, form validation feedback, header scroll state changes, and sticky bar show/hide. These functional transitions become instant and jarring, which is paradoxically worse for users with vestibular sensitivity than a smooth 200ms transition.

**Prevention:**
1. **Distinguish decorative from functional motion:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     /* Decorative: kill entirely */
     .animate-on-scroll { opacity: 1; transform: none; transition: none; }
     .liquid-card::before { animation: none; } /* glint */
     .shimmer-sweep::before { display: none; }
     .pricing__card .button--primary { animation: none; } /* pulse */

     /* Functional: reduce but do not eliminate */
     .faq__answer { transition: max-height 150ms ease-out; } /* fast but smooth */
     .sticky-bar { transition: transform 100ms ease; }
     .header { transition: background-color 100ms ease, padding 100ms ease; }
   }
   ```
2. The WCAG 2.1 SC 2.3.3 (Animation from Interactions) guidance: "Motion animation triggered by interaction can be disabled" -- this means decorative and triggered animations, not functional state transitions that communicate UI state changes.
3. Test reduced-motion mode interactively: open the FAQ, submit the form, scroll past sections. Ensure the experience is smooth, not jarring.

**Detection:** FAQ accordion snapping open/closed instantly, header background changing without any transition, sticky bar appearing/disappearing abruptly.

**Phase:** Accessibility phase. Audit all transitions for decorative vs. functional classification.

---

### Pitfall 12: Stale will-change Declarations Wasting GPU Memory

**Improvement area:** Performance -- optimizing GPU resource usage
**What goes wrong:**
The codebase has `will-change: background-position` permanently on `.liquid-card::before` (the glint animation) and `will-change: filter, transform` on button hover states. Permanent `will-change` allocates GPU layers that are never released, even when the element is off-screen or not being interacted with. On a page with 10+ liquid cards, this means 10+ permanent GPU compositor layers just for the glint pseudo-elements.

**Prevention:**
1. Move `will-change` to the active state only:
   ```css
   .liquid-btn-primary:hover {
     filter: brightness(1.08);
     will-change: filter, transform; /* correct -- only during hover */
   }
   ```
   For glint: add/remove `will-change` via JS when the card enters/exits viewport, or remove it entirely (modern browsers can optimize `background-position` animations without hints).
2. The liquid-glass.css anti-pattern docs already state "NEVER use will-change: backdrop-filter on static cards" -- extend this principle to all static will-change declarations.
3. In total, aim for zero permanent `will-change` declarations in the CSS. Only add them dynamically via JS or on interactive pseudo-states.

**Detection:** Multiple compositor layers visible in Chrome DevTools Layers panel for off-screen elements.

**Phase:** Performance optimization phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| prefers-contrast:more implementation | Pitfall 1 (hierarchy flattening), Pitfall 7 (dark mode cascade regression) | Define contrast-safe hierarchy with differentiated opaque fills. Test all 4 theme/contrast states. |
| Mobile blur reduction | Pitfall 2 (losing glass identity), Pitfall 8 (layout breakage on layer removal) | Set 10px blur floor. Create solid variant class. Test on real budget Android. |
| Scroll-driven animations | Pitfall 5 (IO conflict) | Never mix animation-timeline with .animate-on-scroll on same element. Use @supports gate. |
| Contrast testing | Pitfall 4 (false passes from automated tools) | Manual pixel-sampling at every scroll position. Minimum bg opacity 0.55 for text-bearing glass. |
| Micro-interactions / glint polish | Pitfall 6 (simultaneous animations), Pitfall 3 (drop-shadow breaking glass) | Limit to 1 active glint per viewport. Never use filter:drop-shadow on glass ancestors. |
| CSS token / dark mode changes | Pitfall 7 (cascade regression), Pitfall 9 (Safari var bug) | Override both :root and .dark. Never remove "duplicate" -webkit-backdrop-filter lines. |
| Performance layer reduction | Pitfall 8 (visual inconsistency), Pitfall 12 (stale will-change) | Create .liquid-card--solid variant. Remove permanent will-change. |
| Visual polish (borders/shadows) | Pitfall 10 (mask-image clipping), Pitfall 3 (drop-shadow) | Use inset box-shadow for squircle borders. Use box-shadow instead of filter:drop-shadow. |
| Reduced motion audit | Pitfall 11 (functional transitions killed) | Classify transitions as decorative vs. functional. Reduce duration for functional, eliminate for decorative. |

---

## Sources

- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) -- spec behavior, stacking contexts
- [MDN: prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency) -- browser support (Chrome/Edge only as of early 2026)
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) -- animation-timeline spec and browser support
- [MDN: prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) -- media query spec
- [Josh W. Comeau: Next-level frosted glass with backdrop-filter](https://www.joshwcomeau.com/css/backdrop-filter/) -- double-height backdrop technique, Firefox bugs, Safari quirks
- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) -- Apple does not document layer limits or accessibility guidance
- [NN/g: Glassmorphism -- Definition and Best Practices](https://www.nngroup.com/articles/glassmorphism/) -- readability concerns, visual hierarchy
- [Axess Lab: Glassmorphism Meets Accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) -- WCAG requirements, prefers-reduced-transparency
- [Chrome for Developers: CSS scroll-triggered animations are coming](https://developer.chrome.com/blog/scroll-triggered-animations) -- Chrome 145 scroll-triggered (not scroll-driven) animations
- [Can I Use: animation-timeline scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) -- browser support tables
- [Can I Use: prefers-reduced-transparency](https://caniuse.com/wf-prefers-reduced-transparency) -- Chrome/Edge only
- [Mozilla Bug 1797051](https://bugzilla.mozilla.org/show_bug.cgi?id=1797051) -- parent filter:blur breaks child backdrop-filter
- [shadcn/ui Issue #327](https://github.com/shadcn-ui/ui/issues/327) -- backdrop-filter performance issues catalog
- [W3C: Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) -- decorative vs. functional motion
- [GSAP: Accessible Animation](https://gsap.com/resources/a11y/) -- motion sensitivity prevalence data (35% of adults 40+)
- [Polypane Contrast Checker](https://polypane.app/color-contrast/) -- only tool that handles opacity in contrast calculations
- Codebase: `src/styles/liquid-glass.css` -- anti-pattern documentation, shimmer limits, drop-shadow warning
- Codebase: `src/styles/squircles.css` -- mask-image + border/shadow anti-patterns, commit ba29f8a reference
- Codebase: `src/styles/theme.css` -- token cascade architecture, .dark overrides, Safari fallback strategy
- Codebase: `css/styles.css` -- current prefers-reduced-motion rules, IntersectionObserver animation system
