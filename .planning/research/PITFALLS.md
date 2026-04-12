# Pitfalls Research

**Domain:** Visual redesign of medical website — glassmorphism, dark mode, bold typography, micro-animations (v1.4 milestone, 45+ audience, Kazakhstan)
**Researched:** 2026-03-24
**Confidence:** HIGH (glassmorphism/animation sourced from MDN verified specs; typography/dark-mode from established WCAG 2.1/2.2 patterns; audience-specific claims from established UX research consensus)

---

## Critical Pitfalls

### Pitfall 1: Glassmorphism Text Falls Below WCAG Contrast Minimum

**What goes wrong:**
Semi-transparent `backdrop-filter` cards place text over a dynamically shifting background. The contrast ratio between the text and the blurred background is not a fixed value — it changes depending on what content sits behind the card at that scroll position. A contrast-checker pass on a static mockup does not guarantee real-world compliance. Text that reads cleanly against a white hero background fails when the card scrolls over a dark image or gradient section.

**Why it happens:**
Designers measure contrast against the intended background colour. They do not account for the fact that the effective background of a glass card is the visual average of whatever pixels the blur kernel is averaging. When a colourful image or another card moves behind the glass, that average shifts unpredictably.

**How to avoid:**
- Apply a solid minimum-opacity fill underneath glass text. Use `background: rgba(255,255,255,0.75)` (light mode) or `rgba(18,18,18,0.80)` (dark mode) as a floor — not a decorative translucency of 20-30%.
- Test contrast using the *worst-case* background, not the design-intent background. Place the card over the darkest and lightest content it will ever scroll past.
- Guarantee WCAG AA minimum 4.5:1 for body text, 3:1 for large text (18px+ bold or 24px+ regular). For 45+ audience targeting, aim for 7:1 (AAA) for body text.
- Add a semi-opaque border (`border: 1px solid rgba(255,255,255,0.3)`) to visually separate the card from backgrounds — this is structural, not decorative.
- If a section has a complex image background, do not apply glassmorphism to cards within it. Use solid or near-solid cards instead.

**Warning signs:**
- Card background opacity below 0.6 in any context
- Contrast only checked against hero/default background, not all section contexts
- Text contrast ratio passing in Figma but failing in browser against real content

**Phase to address:**
Phase delivering glassmorphism cards — before any section applies glass styling.

---

### Pitfall 2: backdrop-filter Kills Performance on Mid-Range Android (Kazakhstan's Dominant Device)

**What goes wrong:**
`backdrop-filter: blur()` requires the browser to create a separate compositing layer and apply a per-frame GPU blur operation. On mid-range and budget Android phones (Samsung Galaxy A-series, Xiaomi Redmi, which dominate 45+ users in Kazakhstan), this causes visible frame drops (below 30fps) during scroll when multiple glass elements are visible simultaneously. The page feels broken, not premium.

**Why it happens:**
`backdrop-filter` was Baseline-stable as of September 2024, meaning it works in all modern browsers — but "works" means renders correctly, not performs well. The blur radius and number of simultaneously composited elements is the bottleneck, not browser support. A single hero glass card with `blur(20px)` is fine. Five card grid with `blur(20px)` each causes simultaneous layer compositing that overwhelms the mobile GPU.

**How to avoid:**
- Limit `backdrop-filter` to one or two focal elements (hero card, single CTA panel). Do not apply it to a grid of 4-6 cards.
- Use the minimum blur radius that achieves the visual effect: `blur(8px)` is usually sufficient; avoid `blur(20px)` or higher.
- Apply `will-change: transform` only to elements that are actually animating — do NOT apply it globally or to all glass cards as a performance "fix" (this creates layers for every element, making the problem worse).
- Provide `@supports` fallback: `@supports not (backdrop-filter: blur(1px)) { .glass-card { background: rgba(255,255,255,0.95); } }` — renders as a solid near-white card. Users on older devices get a clean, accessible fallback.
- Test on a real mid-range Android device or Chrome DevTools with CPU throttling set to 4x slowdown, GPU rasterization enabled. Look for frame drops in DevTools Performance panel during scroll.

**Warning signs:**
- Glass applied to entire card grids (doctors, services, pricing)
- `blur()` radius above 12px
- No `@supports` fallback for non-supporting browsers
- Testing only on MacBook or modern iPhone

**Phase to address:**
Phase delivering glassmorphism — define performance budget before implementation.

---

### Pitfall 3: Dark Mode Inverts Medical Trust Signals

**What goes wrong:**
Dark backgrounds psychologically signal entertainment, gaming, or technology products. Medical and healthcare contexts rely heavily on white/light backgrounds as a signal of clinical cleanliness, trustworthiness, and sterility. Users (especially 45+, who associate white-background interfaces with official, credible services) experience a subconscious reduction in trust when visiting a medical site in dark mode for the first time. Additionally, dark mode can make the site look like it is "off" or in an error state to users unfamiliar with the convention.

**Why it happens:**
Dark mode is a highly visible 2025 trend. Developers add it because it is technically interesting and peer-reviewed as "modern." The audience-specific implication for medical services is not investigated. The site's main competitor (medicusunion.com) uses a light theme.

**How to avoid:**
- Make light mode the default. Always. The site loads in light mode for all new visitors regardless of OS preference. This matches what a 45+ Kazakhstan user expects from a medical service.
- Dark mode should be an opt-in toggle, not an OS-preference-driven automatic switch. Use `data-theme="dark"` on `<html>` controlled by JS, not `@media (prefers-color-scheme: dark)` as the primary mechanism.
- Store the user choice in `localStorage`. On page load, read localStorage first; if absent, default to light. Never default to OS dark mode.
- In dark mode, keep medical imagery, trust badges, and doctor photos visible with appropriate contrast — do not make them appear dim or inactive.
- If dark mode is skipped entirely for v1.4, this is a defensible decision. Dark mode adds ~40-60 new CSS token pairs and doubles QA surface. For a conversion-focused medical site, the ROI is unclear for a 45+ audience.

**Warning signs:**
- `@media (prefers-color-scheme: dark)` used as the primary dark mode trigger without a localStorage override
- Dark mode active by default on first visit
- No audit of trust signals (testimonials, badges, logos) in dark mode context
- Medical imagery looks desaturated or dim in dark theme

**Phase to address:**
Phase delivering dark mode — establish default-light policy in the CSS token architecture before writing a single dark token.

---

### Pitfall 4: Dark Mode Fails WCAG Contrast — Especially for Secondary Text

**What goes wrong:**
Light mode WCAG contrast is checked at launch. Dark mode is added as an afterthought with approximate colour substitutions. Secondary text (descriptions, disclaimers, form labels) that was borderline-acceptable at 4.6:1 in light mode is not re-checked in dark mode, and the dark equivalents fail at 3.2:1. Disabled state colours, placeholder text, and icon fills are particularly likely to fail. For 45+ users with common age-related contrast sensitivity reduction, this means sections of the page become literally unreadable in dark mode.

**Why it happens:**
Dark mode colour tokens are derived by "inverting" or "darkening" the light palette without running each pair through a contrast checker. The assumption is that if light mode passes, dark mode will too. It does not — the mathematical relationship is non-linear.

**How to avoid:**
- Create a full colour token table for dark mode: for every light mode `color / background` pair, define and check the corresponding dark pair explicitly with a tool (contrast.tools, whocanuse.com, or browser DevTools accessibility panel).
- Minimum targets: Body text 7:1 (AAA) for 45+ audience. Large text 4.5:1 (AA). Secondary/label text 4.5:1 minimum.
- Placeholder text: WCAG requires 3:1, but 45+ users need 4.5:1 minimum. Do not use `rgba(255,255,255,0.4)` as placeholder in dark mode — it will fail.
- Grey-on-dark patterns are the most common failure: `#888888` text on `#1a1a1a` background is only 3.6:1.
- Lint CSS custom properties: define both `--color-text-secondary-light` and `--color-text-secondary-dark` explicitly, never `calc()` or percentage-lightness-shift a single variable.

**Warning signs:**
- Dark mode colours derived by opacity or filter: invert() rather than explicit token pairs
- Secondary/helper text not re-checked after dark mode implementation
- Placeholder colour in dark mode below 4.5:1 contrast
- No accessibility overlay or colour contrast audit run specifically on the dark mode state

**Phase to address:**
Phase delivering dark mode token system — run contrast audit before theming any component.

---

### Pitfall 5: Display Typography at 72px+ Triggers Line Length and Reflow Problems on Mobile

**What goes wrong:**
Bold display typography looks powerful in desktop mockups at 72-96px. On a 390px wide mobile screen, a 72px headline is three or four words wide, forcing single-word lines, breaking Russian hyphenation rules, and creating visual clutter. Cyrillic characters at very large sizes also expose font metric differences — Inter and Manrope's Cyrillic glyphs are tighter than their Latin equivalents, causing inconsistent optical weight across headline words that mix Latin (MedicusUnion brand name) and Cyrillic.

**Why it happens:**
Display typography is designed at 1440px desktop width. The typographic scale is not adjusted for mobile breakpoints. Responsive font sizing using `clamp()` is applied as a single rule without checking how each specific headline breaks at narrowest viewport.

**How to avoid:**
- Use `clamp()` with verified min/max values per heading level tested at 320px, 390px, and 768px. Example: `font-size: clamp(2rem, 8vw, 4.5rem)` — verify all three anchor points manually.
- Check every Russian headline at narrowest viewport for orphaned single words (a word alone on the last line). Adjust max-width or use `text-wrap: balance` (Baseline 2023, supported in all modern browsers) to prevent this.
- Keep body-level Russian text at 18-20px. Do not apply display scaling to any text that needs to be read in full — only to decorative headlines (hero tagline, section openers).
- For 45+ users: large type helps comprehension only when it does not break lines unexpectedly. A 45+ user reading a three-word fragment is not helped by large type — they are confused by the broken sentence.
- Use `letter-spacing: -0.02em` only on Latin headlines. Cyrillic at large sizes does not need tracking adjustment and can look awkward with tighter tracking.

**Warning signs:**
- Headlines tested only at 1440px during design
- Single Russian words appearing on their own line at 390px width
- Same `clamp()` values used across all heading levels without mobile review
- `font-size` above 4rem on mobile (`min` value in clamp above 3.5rem at 320px)

**Phase to address:**
Phase delivering typography system — review every headline variant at 320px and 390px before wider integration.

---

### Pitfall 6: Bold Typography Drops Below WCAG Contrast for Thin-Weight Numerals and Light Text Variants

**What goes wrong:**
The design uses a bold/light typographic contrast system: a 700-weight hero headline paired with 300-weight supporting descriptor text. The 300-weight text at any colour has lower effective contrast because thin strokes are perceived with less contrast than the same colour in 400-weight. For 45+ users, this creates readability failures even when the colour technically passes WCAG contrast ratios. WCAG 2.1 defines "large text" as 18pt (24px) or 14pt (18.67px) bold — 300-weight text at any size is treated as normal text and requires 4.5:1.

**Why it happens:**
Typography systems use font-weight as a hierarchy signal. Designers do not recalculate contrast ratios when changing weight — they assume the colour passes at all weights. Thin-weight Cyrillic numerals (like the "450€" price display) are common failure points.

**How to avoid:**
- Do not use font-weight below 400 for any text that conveys information. Use 400 as the minimum for body/descriptor text.
- For light-mode supporting text, ensure the colour passes 4.5:1 against its background regardless of weight.
- The pricing display (`от 450 EUR`) is the highest-stakes text on the page after the CTA button. Check its contrast at every weight used. If displayed in a glass card, check against worst-case background.
- If font-weight 300 is used purely decoratively (e.g., a large transparent watermark numeral), it must not convey required information.

**Warning signs:**
- Font-weight 300 used for any text containing price, specialisation, or call-to-action information
- Light descriptor text below `#767676` on white (fails 4.5:1)
- Pricing or statistics displayed in thin weight without contrast check

**Phase to address:**
Phase delivering typography system — establish weight-to-contrast policy as part of token definition.

---

### Pitfall 7: Micro-Animations Trigger Vestibular Disorders Without prefers-reduced-motion Guard

**What goes wrong:**
Scroll-driven animations (elements flying in from the sides), parallax-like effects, and continuous hover micro-animations all qualify as motion that can trigger nausea, dizziness, and vertigo in users with vestibular disorders. The WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions, Level AAA) requires providing an option to disable such motion. For a 45+ audience, the prevalence of balance disorders increases significantly with age — approximately 35% of adults over 40 experience some degree of vestibular dysfunction.

**Why it happens:**
Micro-animations are added to individual components without a global motion policy. The `prefers-reduced-motion` media query is either not implemented or applied only to a subset of animations. Scroll-driven animations using IntersectionObserver or CSS `animation-timeline` often have no reduced-motion variant because the developer thinks only "bouncing" animations are the problem. Any translating, scaling, or repositioning animation counts.

**How to avoid:**
- Establish a single global CSS rule at the top of the animation stylesheet: `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`. This is the nuclear option — all animation is neutralised for users who request it.
- For scroll-reveal animations (the existing IntersectionObserver pattern): in the reduced-motion branch, set elements to visible immediately without the translate/opacity animation. The content appears, just without motion.
- CSS scroll-driven animations (`animation-timeline: scroll()`) are not yet Baseline stable as of early 2026 — Firefox support is incomplete. Do not use them as primary animation mechanism. The existing IntersectionObserver pattern is more reliable and controllable.
- Replace translate-based entrances with opacity-only fades for micro-animations. An opacity fade from 0 to 1 is classified as non-vestibular motion and is acceptable even without reduced-motion guard (though still guard it).
- Button hover micro-animations: `transform: translateY(-2px)` is acceptable and the current pattern. Do not increase this or add simultaneous scale. `transform: scale(1.05)` on hover is a vestibular risk.

**Warning signs:**
- No `@media (prefers-reduced-motion)` block in CSS
- IntersectionObserver animations do not check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before applying motion classes
- Any animation using `transform: scale()`, `perspective()`, `rotate()`, or translate values above 10px
- Continuous animations (pulsing, rotating loading indicators) without a stop condition

**Phase to address:**
Phase delivering micro-animations — the reduced-motion guard must be the first rule written, before any animation is added.

---

### Pitfall 8: Micro-Animations Increase Cognitive Load and Reduce Trust on Medical Pages

**What goes wrong:**
Every animation on a page is a distraction event that consumes cognitive bandwidth. For 45+ users, who are already processing unfamiliar medical terminology and making high-stakes decisions about their health, unnecessary motion pulls attention away from the content they need to evaluate. On a medical website specifically, a playful or exuberant animation style (bouncing cards, celebratory micro-interactions, particle effects) triggers dissonance — the tone says "fun tech product" while the content says "serious medical consultation at 450 EUR." This dissonance reduces trust and increases abandonment.

**Why it happens:**
Micro-animations are added to improve "delight" and "engagement." These are valid goals for consumer apps. For medical services targeting older users making costly, high-stakes decisions, the calculus is different. No research supports the idea that scroll-in animations increase medical consultation conversion.

**How to avoid:**
- Restrict animations to functional purpose only: form feedback (submission spinner, success state fade), accordion expand/collapse, dark mode theme transition.
- Scroll-reveal animations (existing pattern) are acceptable at low intensity — opacity + 8px translateY over 400ms. They signal "this content is important and just appeared." Do not add stagger delays above 100ms between sibling elements or the page feels slow.
- Prohibit: parallax, floating/pulsing elements, animated counters on statistics (common on medical pages, but disorienting for older users), animated SVG illustrations.
- The theme transition animation (light→dark) must be short: 200-300ms. Do not use a "cinema" fade or sweeping wipe — it reads as the page malfunctioning.
- Keep the total animation budget: maximum 4-5 distinct animation types on the entire page. Each type should serve a clear UX function.

**Warning signs:**
- Animated counters on the "social proof" statistics section
- Stagger delay above 100ms applied to card grids
- Any looping or continuous animation visible in the viewport at rest
- Theme switch animation above 400ms duration

**Phase to address:**
Phase delivering micro-animations — define the animation catalogue (what will animate and why) before writing a single `@keyframes`.

---

### Pitfall 9: Dark Mode Toggle is Invisible or Inaccessible to 45+ Users

**What goes wrong:**
The dark mode toggle is implemented as a small sun/moon icon button in the navigation, styled to be visually subtle (to avoid "cluttering the nav"). For 45+ users with reduced visual acuity, a 24x24px icon button with no visible label is not discoverable. Users do not find it, do not know it exists, and if they accidentally trigger it, do not know how to undo it — the page appears "broken."

**Why it happens:**
Dark mode toggles are designed by developers who know they exist. The toggle is treated as a power-user feature and styled minimally. There is no user testing with 45+ users who have never encountered a theme toggle before.

**How to avoid:**
- The toggle must be minimum 44x44px tap target (WCAG 2.5.5), preferably 48x48px.
- Include a visible text label alongside the icon, at least on mobile: "Тёмная тема" or simply display the current state label: "Светлая / Тёмная". The icon alone is insufficient for this audience.
- The toggle state must be clearly visible — the current mode is communicated by icon + colour change, not icon position alone (switches are less intuitive than labelled buttons for older users).
- On first-time dark mode activation, show a brief toast or text feedback: "Тёмный режим включён" — confirms the action was intentional.
- Do not animate the toggle icon itself (rotating sun, morphing moon) — this is cognitive noise. A simple colour or label change is sufficient.
- Consider whether the 45+ Kazakhstan user actually benefits from dark mode. If not, defer the feature to v1.5 and focus the phase budget on typography and glass quality.

**Warning signs:**
- Toggle smaller than 44x44px
- Icon-only toggle with no text label
- No visible state indication of current theme
- Toggle placed in a position that overlaps with nav links on mobile

**Phase to address:**
Phase delivering dark mode toggle UI — defined as part of the navigation component work.

---

### Pitfall 10: Full Visual Redesign Breaks Existing Working CSS Without Regression Testing

**What goes wrong:**
The v1.4 redesign adds new CSS token layers (dark mode tokens, glass tokens, animation tokens) on top of the existing v1.3 CSS architecture (~1,640 lines). CSS specificity conflicts, cascade ordering issues, and token name collisions silently break existing components — form validation states lose their colours, the sticky mobile bar overlaps incorrectly, wave dividers misalign, or FAQ accordion animation conflicts with the new animation system. These breakages often appear only on specific mobile viewpoints or in specific scroll states, making them easy to miss in a desktop review.

**Why it happens:**
New CSS is added incrementally. Each phase works in isolation. The cumulative effect of adding glass styles + dark mode overrides + animation classes is not tested holistically. Token names added in v1.4 can shadow v1.3 tokens if both define a `--color-primary` variant.

**How to avoid:**
- Before starting v1.4 implementation, establish a visual regression baseline: screenshot every section at 390px and 1440px. Compare after each phase.
- Use a strict CSS token namespace for new v1.4 additions: `--glass-*`, `--dark-*`, `--anim-*`. Never override existing `--color-*` or `--spacing-*` tokens from v1.3.
- The dark mode override block should be scoped exclusively to `[data-theme="dark"]` selector. It must never apply to elements outside this scope.
- After every implementation phase, manually test: form submission flow (all states), FAQ accordion, sticky header on scroll, sticky mobile bar, wave dividers at section boundaries, CTA button states.
- The 11-section structure is the conversion funnel. Any phase that breaks the form, the CTAs, or the trust sections has broken the product's core purpose — treat this as a blocker, not a cosmetic issue.

**Warning signs:**
- New CSS token names that overlap with existing `--color-primary`, `--color-cta`, `--gradient-cta`
- No visual comparison run between v1.3 state and new state
- CSS added with `!important` to override existing styles (means specificity war started)
- No test of form submission after adding dark mode CSS

**Phase to address:**
Every v1.4 phase — regression testing is a success criterion for each phase, not a final QA step.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Apply `backdrop-filter` to all card components in one global rule | Fast implementation | Performance failures on mid-range Android; impossible to tune per-section | Never — apply selectively, per context |
| Use `@media (prefers-color-scheme: dark)` as the primary dark mode mechanism | No JS needed | Dark mode activates automatically, overriding the medical-trust default-light policy | Never for this project |
| Copy dark mode palette from a design system example without contrast-checking each pair | Fast palette creation | Silently failing WCAG contrast for 45+ audience in dark state | Never |
| Add `prefers-reduced-motion` only to the "obvious" animations (fly-in cards) | Appears compliant | Continuous animations, hover transforms, and theme transitions remain unguarded | Never — apply globally first, then refine |
| Skip visual regression screenshots between phases | Saves time | CSS cascade errors accumulate silently until a hard-to-diagnose breakage | Never during a full visual redesign |
| Use a 16px toggle icon for dark mode switch to "keep nav clean" | Cleaner nav visually | 45+ users cannot find or operate it; accessibility failure | Never — 44px minimum |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Multiple simultaneous `backdrop-filter` elements in viewport | Frame drops to 20-25fps during scroll on mid-range Android | Limit glass elements to 1-2 in any single viewport; test on 4x CPU throttle | Budget Android devices (Samsung A-series) under sustained scroll |
| CSS `animation-timeline: scroll()` without Firefox fallback | Animations absent for ~6% of desktop Firefox users; no error shown | Use IntersectionObserver as primary; scroll-driven CSS as progressive enhancement behind `@supports` | Firefox as of early 2026 |
| Dark mode CSS loaded synchronously before render | Flash of light mode on first dark-mode-preference visit (FOUC) | Read `localStorage` in a `<script>` in `<head>` before `<body>` renders; apply `data-theme` attribute immediately | Every dark-mode user on first visit |
| `will-change: transform` applied to all animated elements | Excessive GPU memory use; mobile browser crashes on low-RAM devices | Apply `will-change` only immediately before animation starts, remove after | Devices with 2GB RAM or less (budget Android) |
| Theme transition `transition: all 0.5s` on `<html>` or `<body>` | Every CSS property on every element transitions during theme switch; jank | Scope transitions to specific properties: `color, background-color, border-color` only | Any device during theme switch |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Glass cards with colourful background images visible through blur | Text unreadable; image is distorted to "noise" with no information value | Use glass only over solid or near-solid colour backgrounds; avoid glass over photo sections |
| Dark mode default with no visible toggle to return to light | 45+ user thinks page is broken, cannot recover, leaves | Default light, prominent toggle with text label, localStorage persistence |
| Bold hero headline breaks into 1-word lines on mobile | Reads as broken sentence fragments; 45+ user re-reads multiple times | `text-wrap: balance` on headlines; test at 320px and 390px; adjust clamp min value |
| Scroll-reveal animations delay content appearing (high stagger) | Users with reading disabilities or slow cognition miss content that has not animated in yet; feels slow | Stagger below 100ms; reduced-motion: content visible immediately |
| Animated statistics counter (numbers rolling up) in social proof section | Distracting, potentially vestibular; delays trust signal perception for 45+ users who need to read static numbers | Display numbers statically; no animation on trust/social-proof data |
| Dark mode desaturates the hero medical illustration | Illustration looks washed-out; medical credibility reduced | Either exclude the hero illustration from dark-mode colour treatment, or create a purpose-made dark-mode version |

---

## "Looks Done But Isn't" Checklist

- [ ] **Glass contrast:** Text contrast checked against worst-case background (darkest content behind card), not design-intent background
- [ ] **prefers-reduced-motion:** Global CSS rule present AND IntersectionObserver JS checks the media query before adding animation classes
- [ ] **Dark mode default:** `localStorage` read in `<head>` script; page loads in correct theme without flash (test in Chrome Incognito with OS dark preference)
- [ ] **Dark mode WCAG:** Every colour token pair (foreground/background) in dark mode passed through contrast checker — not just primary text
- [ ] **Glass performance:** Tested with Chrome DevTools CPU 4x throttle during scroll; frame rate stays above 50fps
- [ ] **Mobile typography:** Every headline reviewed at 390px viewport; no single-word orphaned lines in Russian
- [ ] **Dark mode toggle:** Toggle tap target measured at 44px minimum in DevTools
- [ ] **Existing functionality:** Form submission flow tested end-to-end after each visual change (submit → loading → success/error state)
- [ ] **CSS token namespace:** No v1.4 token names collide with existing v1.3 token names — grep for duplicates
- [ ] **Theme transition:** FOUC test — hard refresh in Chrome with OS dark mode; page should load in correct theme immediately

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Glass contrast failure discovered post-launch | LOW | Increase `background` opacity on glass element from 0.3 to 0.75; redeploy single CSS file |
| Vestibular complaints / reduced-motion not implemented | LOW | Add global `prefers-reduced-motion` rule to top of animations CSS; redeploy |
| Dark mode FOUC on first visit | LOW | Add `<script>` in `<head>` that reads localStorage and sets `data-theme` before body renders |
| Glass performance janking on mobile | MEDIUM | Remove `backdrop-filter` from grid cards; apply only to hero/CTA panel; redeploy |
| CSS token collision breaks existing components | MEDIUM | Namespace new tokens with v1.4 prefix; audit cascade order; test all 11 sections |
| Dark mode default activating for 45+ users expecting light | LOW-MEDIUM | Remove `prefers-color-scheme` media query trigger; add localStorage-only control; redeploy |
| Typography breakage on mobile (word orphans, overflow) | LOW | Adjust `clamp()` min value per heading level; add `text-wrap: balance`; test at 320px |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Glass contrast failure | Phase: Glassmorphism implementation | Contrast checker on every glass element against darkest and lightest context background |
| backdrop-filter performance on Android | Phase: Glassmorphism implementation | Chrome DevTools 4x CPU throttle scroll test; FPS stays above 50 |
| Dark mode reduces medical trust | Phase: Dark mode architecture | Dark mode is opt-in; default is light; confirmed by loading page without localStorage entry |
| Dark mode WCAG failures | Phase: Dark mode token system | Full token pair audit with contrast tool before any component receives dark tokens |
| Mobile typography orphans | Phase: Bold typography system | Every heading reviewed at 320px, 390px viewports |
| Light weight text contrast | Phase: Bold typography system | All text using font-weight < 400 checked against 4.5:1 minimum |
| No prefers-reduced-motion guard | Phase: Micro-animations | Global CSS rule present; JS IntersectionObserver checks media query |
| Animation cognitive overload | Phase: Micro-animations | Animation catalogue defined (max 4-5 types); no looping animations in viewport at rest |
| Dark mode toggle inaccessible | Phase: Dark mode UI | Toggle measured at 44px minimum; has visible text label; tested by a non-developer |
| CSS regression from layered changes | Every v1.4 phase | Screenshot comparison vs. v1.3 baseline; form submission flow tested after each phase |

---

## Sources

- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — vestibular disorders, animation categories, platform support (HIGH confidence)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) — manual toggle pattern, localStorage approach, FOUC prevention (HIGH confidence)
- [MDN: backdrop-filter — Baseline 2024](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) — support status, GPU compositing (HIGH confidence)
- [MDN: CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) — draft spec, incomplete Firefox support as of early 2026 (HIGH confidence)
- WCAG 2.1 SC 1.4.3 Contrast Minimum — 4.5:1 normal text, 3:1 large text (HIGH confidence — W3C specification)
- WCAG 2.1 SC 2.3.3 Animation from Interactions (AAA) — vestibular motion guidelines (HIGH confidence — W3C specification)
- WCAG 2.1 SC 2.5.5 Target Size — 44x44px minimum (HIGH confidence — W3C specification)
- WCAG 2.2 SC 2.5.8 Target Size Minimum — 24px minimum, 44px recommended (HIGH confidence — W3C specification)
- CSS `text-wrap: balance` — Baseline 2023, all modern browsers (HIGH confidence)
- Manrope/Inter Cyrillic optical characteristics — based on rendered behaviour in existing v1.3 codebase (MEDIUM confidence)
- 45+ vestibular disorder prevalence (~35% of adults over 40) — established audiological/neurological research consensus (MEDIUM confidence)
- Medical trust and background colour — UX research consensus on professional/clinical colour associations (MEDIUM confidence; no single authoritative source)

---
*Pitfalls research for: v1.4 Visual Redesign — glassmorphism, dark mode, bold typography, micro-animations on medical website (45+ audience)*
*Researched: 2026-03-24*
