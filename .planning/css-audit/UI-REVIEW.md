---
type: ui-review
scope: full-site
pages:
  - index.html
  - checkup.html
  - contacts.html
overall_score: 20/24
pillars:
  copywriting: 4/4
  visuals: 3/4
  color: 3/4
  typography: 3/4
  spacing: 4/4
  experience_design: 3/4
total_findings: 18
---

# Full Site -- UI Review

**Audited:** 2026-04-09
**Baseline:** Abstract 6-pillar standards + project context (CA 45+, medical, Russian-only)
**Screenshots:** Captured -- index.html, checkup.html, contacts.html at 1440px, 768px, 375px viewports (see `.planning/ui-reviews/full-20260409-231532/`)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Excellent Russian copy with thorough &amp;nbsp; usage, specific CTAs, no generic labels |
| 2. Visuals | 3/4 | Strong glass design system, but hero image positioning clips content on checkup.html at viewport height |
| 3. Color | 3/4 | Well-structured token system with accessible text variants, minor hardcoded fallback values in inline styles |
| 4. Typography | 3/4 | Good responsive scaling for 45+ audience, but missing text-wrap: balance in production CSS |
| 5. Spacing | 4/4 | Consistent use of design tokens for section rhythm, no arbitrary spacing values detected |
| 6. Experience Design | 3/4 | Solid form UX with validation, loading state, and error handling; missing scroll-behavior: smooth in production |

**Overall: 20/24**

---

## Top 3 Priority Fixes

1. **checkup.html hero viewport clipping** -- On initial page load at 1440x900, the hero image dominates the viewport and the heading text is partially obscured by the header. The `min-h-section-hero-medium` (clamp 500px-700px) combined with the image being on the right column pushes critical content below fold on shorter viewports. **Fix:** Reduce hero image height from `lg:h-[500px]` to `lg:h-[420px]` at checkup.html:184, or switch from `min-h-section-hero-medium` to `min-h-section-hero-compact` at checkup.html:138.

2. **No text-wrap: balance in production CSS** -- Headings in Russian are prone to orphan lines (single short word on the last line). The worktree copies show `text-wrap: balance` was added to heading rules, but the production `css/styles.css` does not contain it. Long section headings like "Klinics, s kotorymi my rabotaem" will produce uneven line breaks. **Fix:** Add `text-wrap: balance` to h1, h2, h3 rules in `src/styles/theme.css` base layer (lines 346-370).

3. **No scroll-behavior: smooth in production** -- Anchor links (#contact, #programs-korea, etc.) jump abruptly instead of smooth-scrolling. The project uses anchor navigation heavily for CTAs. **Fix:** Add `html { scroll-behavior: smooth; }` to `src/styles/theme.css` base layer after the existing `html` rule at line 337. The existing `prefers-reduced-motion` guard at line 421 already covers the accessibility fallback.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

The copywriting is excellent throughout all three pages. Every CTA is specific and action-oriented -- no generic "Submit" or "Click Here" labels were found.

**Strengths:**
- **CTAs are specific and varied per context:**
  - index.html: "Obsudit' moj sluchaj besplatno" (primary), "Ostavit' zayavku" (secondary)
  - checkup.html: "Podobrat' programmu" (primary), "Smotret' programmy" (secondary)
  - contacts.html: "Otpravit' zayavku" (submit), "Ostavit' zayavku" (header)
- **Extensive &amp;nbsp; usage:** 84 instances in index.html, 127 in checkup.html, 19 in contacts.html. Subject+verb pairs are consistently bound (e.g., `my&nbsp;bereom`, `vam&nbsp;ostaetsya`).
- **Tone is calm and medical:** No exclamation marks in body copy, no marketing hyperbole. Phrases like "besplatno i bez obyazatel'stv" (free and without obligations) build trust.
- **Empty/error states are covered:**
  - Form success: "Spasibo! My svyazhemsya s vami v techenie 24 chasov."
  - Form error: Full Russian message with phone fallback (js/main.js:461-464)
  - Field-level validation with specific messages (js/main.js:255-340)

**Minor observations (not deductions):**
- FAQ questions use an informal but respectful tone appropriate for 45+ audience
- Price display uses proper currency formatting with &amp;nbsp; (e.g., "ot&nbsp;450&nbsp;euro")
- The "Ostavit' zayavku" label appears in both hero secondary CTA and header CTA on index.html -- acceptable since they target the same anchor

### Pillar 2: Visuals (3/4)

The Liquid Glass design system creates a cohesive, premium visual language. Squircle masks, glass materials, and gradient accents are applied consistently. However, there are minor layout issues.

**Strengths:**
- **Consistent glass treatment:** Every card uses `liquid-card` + `squircle-xl` pattern. The shadow-wrap pattern (documented in liquid-glass.css) is followed correctly.
- **Hero composition on index.html:** Photo collage with floating glass badges (43 clinics, 15+ years) creates clear focal point and visual depth.
- **Icon consistency:** All icons use Lucide (24x24 or 20x20), consistent stroke-width=2, same viewBox. No mixed icon sets.
- **Image quality:** WebP format throughout, proper width/height attributes for CLS prevention, lazy loading on non-hero images.
- **Dark mode support:** Full token cascade in theme.css (.dark selector), glass recipes adjusted for dark backgrounds.
- **Print stylesheet:** Comprehensive -- glass surfaces become opaque white, squircle masks removed, shimmer hidden.

**Issues:**
- **VISUAL-01:** checkup.html hero layout -- at 1440x900 viewport, the hero image (400px on md, 500px on lg) combined with `min-h-section-hero-medium` pushes the hero heading partially behind the fixed header. The header is ~80px tall and `pt-section-pt` is 8rem (128px), but the total hero content including the image exceeds comfortable viewport height. [checkup.html:138, 177-188]
- **VISUAL-02:** `scroll-fade-top` class is applied to `<main>` only on index.html (line 220), not on checkup.html or contacts.html. This creates inconsistent top-edge treatment across pages.
- **VISUAL-03:** Footer on contacts.html appears at bottom of a short page (only 2 sections), which may leave the footer floating mid-page on tall desktop viewports. The `min-h-section-hero-compact` on main (contacts.html:131) partially mitigates this.

### Pillar 3: Color (3/4)

The color system is well-architected with semantic tokens and accessible text variants. WCAG AA compliance was explicitly addressed in theme.css comments.

**Strengths:**
- **Accessible text variants:** Dedicated `--mu-blue-text: #0B7A9A` (4.76:1 ratio on #FBFBFB), `--mu-green-text: #1F7A4F`, `--mu-accent-blue-text: #3B6DD0` -- all documented with contrast ratios. [theme.css:42-46]
- **Token-based colors:** All color usage in HTML goes through Tailwind token classes (`text-mu-text-700`, `bg-mu-green-50`, etc.). No direct hex values in component markup.
- **CTA gradient consistency:** `from-mu-cta-from to-mu-cta-to` gradient used uniformly across all primary buttons on all three pages.
- **Section tint system:** Alternating `.section-tint-cool`, `.section-tint-warm`, `.section-tint-mint` backgrounds give glass cards something to blur against. Suppressed in dark mode.
- **60/30/10 split:** Background (~60%) is `mu-text-50` (#FBFBFB) with glass overlays. Text (~30%) uses `mu-text-700` and `mu-text-900`. Accent (~10%) is the blue gradient CTA and occasional colored icons/badges.

**Issues:**
- **COLOR-01:** Hardcoded `#ef4444` appears as CSS fallback in inline `<style>` blocks for `.is-invalid` and `.form__field-error` on all three pages. While this is a fallback for when CSS custom properties fail, the value doesn't match the token `--mu-accent-red: #F50057`. This means the fallback and token colors would differ. [index.html:45-53, checkup.html:45-53, contacts.html:45-53]
- **COLOR-02:** Inline SVG icons use `stroke="var(--mu-green-600)"` and `stroke="var(--mu-blue)"` directly in HTML attributes (e.g., index.html:826, contacts.html:214). While functional, these bypass the Tailwind token layer and would not respond to a potential theme change.
- **COLOR-03:** The `section-tint-*` gradient backgrounds use raw rgba() values rather than token references (liquid-glass.css:262-287). These are by design (very subtle 3-5% opacity tints), but should be noted for consistency tracking.

### Pillar 4: Typography (3/4)

Font sizes are well-scaled for the 45+ audience with responsive clamp values. The heading hierarchy is clear and consistent.

**Strengths:**
- **Base size 16px:** Set via `--font-size: 16px` in theme.css:4. Appropriate for 45+ readability.
- **Heading scale:** h1 uses `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` -- scaling from ~36px to ~72px. This is generous and appropriate for 45+ audience.
- **Font weight hierarchy:** Clear distinction between extrabold (headings), bold (subheadings/labels), medium (body), normal (input text). Consistent across all pages.
- **SF Pro Display / SF Pro Rounded:** Correct system font stack with fallbacks. Font-display: swap prevents FOIT. [fonts.css:1-17]
- **Line height:** All headings use `leading-[1.1]` or `leading-snug`, body text uses `leading-relaxed`. Appropriate for readability.
- **Tracking:** `-tight` applied to headings and nav links, creating appropriate visual density.

**Issues:**
- **TYPO-01:** `text-wrap: balance` is NOT present in the production `css/styles.css`. It exists in agent worktree copies but was never merged. Russian headings with long words will produce uneven line breaks, particularly on mid-width viewports. [css/styles.css -- missing]
- **TYPO-02:** Body text uses `text-mu-text-700` (color #4A4E5C on #FBFBFB background). While this passes WCAG AA (contrast ~7.3:1), some body paragraphs at `font-medium` (500 weight) could benefit from `font-normal` (400) for better readability in long-form content like FAQ answers and service descriptions.
- **TYPO-03:** The stat numbers use `text-5xl md:text-6xl font-extrabold` which is very large (48-60px). While impactful, on mobile (375px) the `text-5xl` (48px) stat numbers in a 2-column grid may crowd the labels. [index.html:302-316]

### Pillar 5: Spacing (4/4)

Spacing is highly systematic, using design tokens and Tailwind utilities consistently.

**Strengths:**
- **Section rhythm tokens:** `--section-pt: 8rem`, `--section-pt-lg: 10rem`, `--section-pb: 4rem` applied via Tailwind utilities `pt-section-pt`, `pb-section-pb`. All sections use `py-16` (4rem) consistently. [theme.css:56-58]
- **Hero height tokens:** Three tiers -- `section-h-hero-rich` (560-760px), `section-h-hero-medium` (500-700px), `section-h-hero-compact` (440-580px). Index uses rich, checkup uses medium, contacts uses compact. [theme.css:53-55]
- **Grid system:** Consistent `max-w-[1400px] mx-auto px-4 lg:px-6` container pattern on all pages. 12-column grid with `gap-y-8 md:gap-8` or `gap-6`.
- **Card internal spacing:** All liquid-card elements use `p-8` (2rem) consistently. Service cards add `pt-4` for image-to-content transition.
- **Gutter tokens:** `--grid-gutter-mobile: 16px`, `--grid-gutter-tablet: 24px`, `--grid-gutter-desktop: 32px` defined but applied via `px-4 lg:px-6` (16px / 24px). Close match.
- **No arbitrary spacing values:** No `[Npx]` or `[Nrem]` spacing values detected in component spacing -- all use Tailwind scale.
- **Scroll margin:** `scroll-margin-top: 6rem` on all `section[id]` elements prevents header overlap on anchor navigation. [theme.css:404-410]

**Minor observations (not deductions):**
- Mobile CTA bar uses `p-3` (12px padding) -- adequate touch target when combined with button `py-3` (12px).
- Footer uses `p-12` (3rem) -- generous, appropriate for the glass card wrapper.

### Pillar 6: Experience Design (3/4)

Form UX is well-implemented with loading states, validation, and error handling. Navigation patterns are solid. A few accessibility gaps remain.

**Strengths:**
- **Form validation:** Client-side validation with Russian error messages, field-level errors with `role="alert" aria-live="polite"`. Fields marked `is-invalid` get `aria-invalid="true"`. [js/main.js:255-467]
- **Loading state:** Submit button shows "Otpravka..." and is disabled during submission. Button has `disabled:opacity-50 disabled:cursor-not-allowed` classes. [js/main.js:431-438]
- **Error recovery:** On API failure, submit button re-enables with original text, error message includes phone fallback number. [js/main.js:455-465]
- **Success state:** Form hides, success overlay appears with glass backdrop, checkmark icon, and confirmation message. [index.html:1072-1081]
- **Honeypot spam protection:** Hidden `website` field with `tabindex="-1"`. Spam submissions silently show success. [contacts.html:280-283]
- **Skip-to-content link:** `sr-only focus:not-sr-only` pattern on all three pages. [index.html:148]
- **ARIA attributes:** 44 ARIA attributes in index.html, 74 in checkup.html, 28 in contacts.html. Decorative SVGs have `aria-hidden="true"`. FAQ buttons have `aria-expanded`. Form errors have `aria-live="polite"`.
- **Focus-visible styles:** Global rule for all interactive elements with `outline: 2px solid var(--mu-blue-text); outline-offset: 3px`. [theme.css:318-329]
- **Mobile touch targets:** Mobile menu links use `px-4 py-3` (48px+ effective height). Mobile CTA bar button uses `px-6 py-3`. Form inputs use `px-5 py-4` (64px+ height). All meet 44px minimum.
- **Sticky mobile CTA bar:** Fixed bottom bar with phone + CTA on contacts.html, with `safe-area-inset-bottom` handling. [contacts.html:371-377]
- **Reduced motion:** Comprehensive guard in theme.css (lines 414-430) + liquid-glass.css (lines 305-320). Zeros all animation durations, removes shimmer, reduces blur.

**Issues:**
- **EXP-01:** No `scroll-behavior: smooth` in the production stylesheet. Clicking CTA buttons that anchor to `#contact`, `#programs-korea`, etc. causes an abrupt jump. The `prefers-reduced-motion` guard exists for the accessibility override, but the smooth scrolling itself was never added.
- **EXP-02:** The mobile menu overlay (`.mobile-menu-overlay`) starts as `display: none` and toggles to `display: block` via `.is-open`. This is a hard show/hide with no transition animation, which feels jarring compared to the otherwise polished glass aesthetic. Adding a fade + slide-down transition would improve perceived quality.
- **EXP-03:** FAQ accordion uses `max-height: 0` to `max-height: 500px` transition. This creates an uneven animation speed -- short answers open too slowly (500px headroom), and the 500px cap could clip very long answers. A more robust solution would use `grid-template-rows: 0fr` to `1fr` pattern or dynamic max-height calculation.
- **EXP-04:** The `select` element for "Chto vas interesuet" uses `appearance-none` but has no custom dropdown arrow indicator, making it look like a text input until the user interacts with it. [contacts.html:264, index.html:1099]
- **EXP-05:** Animated counters on checkup.html stat section start at "0" and count up on viewport intersection (checkup.html:201). If JS fails to load, users see "0" for all stats instead of the actual values. Consider using the real value as default text content with data-target for enhancement.

---

## Files Audited

**HTML:**
- `index.html` (1262 lines) -- main landing page, 11 sections + header/footer
- `checkup.html` (898 lines) -- checkup service page, 8 sections + header/footer
- `contacts.html` (384 lines) -- contacts/form page, 2 sections + header/footer

**CSS:**
- `src/styles/theme.css` (431 lines) -- design tokens, base styles, focus/motion guards
- `src/styles/fonts.css` (17 lines) -- SF Pro Display/Rounded font-face declarations
- `src/styles/liquid-glass.css` (321 lines) -- glass material primitives
- `src/styles/squircles.css` (125 lines) -- squircle mask utilities
- `css/styles.css` (compiled Tailwind v4.2.2 output)

**JS (referenced for Experience Design pillar):**
- `js/main.js` -- form handling, validation, counters
- `js/router.js` -- SPA-style navigation
- `js/animations.js` -- scroll-triggered animations

**Screenshots captured:**
- `.planning/ui-reviews/full-20260409-231532/index-desktop.png` (1440x900)
- `.planning/ui-reviews/full-20260409-231532/index-mobile.png` (375x812)
- `.planning/ui-reviews/full-20260409-231532/index-tablet.png` (768x1024)
- `.planning/ui-reviews/full-20260409-231532/checkup-desktop.png` (1440x900)
- `.planning/ui-reviews/full-20260409-231532/checkup-mobile.png` (375x812)
- `.planning/ui-reviews/full-20260409-231532/contacts-desktop.png` (1440x900)
- `.planning/ui-reviews/full-20260409-231532/contacts-mobile.png` (375x812)
- Full-page captures for all three pages at 1440px
