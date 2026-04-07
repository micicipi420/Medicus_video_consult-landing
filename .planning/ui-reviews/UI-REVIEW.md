# UI Review -- index.html vs DESIGN-SYSTEM.md

**Audited:** 2026-04-05
**Baseline:** DESIGN-SYSTEM.md (project design system contract)
**Screenshots:** Not captured (audit is code-only per request scope)
**File audited:** `index.html` (1168 lines)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Color | 1/4 | Accessible text color tokens not implemented; 20+ WCAG AA failures |
| 2. Typography | 3/4 | Scale and weights mostly correct; H2 uses extrabold (800) where spec says 800 -- matches |
| 3. Glassmorphism | 4/4 | Glass levels applied correctly across all component types |
| 4. Spacing & Layout | 3/4 | Consistent spacing and grid; minor radius deviation in FAQ |
| 5. Components | 2/4 | CTA gradient uses wrong colors; focus-visible rings missing on all elements |
| 6. Accessibility | 1/4 | Zero focus-visible rings; no aria-live on error messages; no disabled states on non-submit elements |

**Overall: 14/24**

---

## Top 5 Issues

1. **Accessible text color tokens not implemented in theme.css or index.html** -- All text using `text-mu-accent-blue`, `text-mu-accent-teal`, `text-mu-accent-orange`, `text-mu-green-600`, `text-mu-blue` fails WCAG AA (ratios 1.92-3.50:1 vs required 4.5:1). Affects 30+ text instances including stat numbers, badge labels, price tags, link hover states, and inline number highlights. This is the single most impactful compliance gap.

2. **Zero focus-visible rings on any interactive element** -- Design system mandates `focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none` on ALL buttons, links, and form elements. Not a single element in index.html has focus-visible styles. Keyboard users cannot navigate the page.

3. **CTA gradient uses inaccessible original colors** -- All CTA buttons use `from-mu-blue to-mu-accent-blue` (#38C6F4 to #4F84E8) instead of the accessible `from-[var(--mu-cta-from)] to-[var(--mu-cta-to)]` (#0E8FB5 to #3B6DD0). White text on original gradient fails WCAG AA (ratio 1.92-3.22:1).

4. **theme.css missing all accessible color definitions** -- Tokens `--mu-blue-text`, `--mu-accent-blue-text`, `--mu-accent-teal-text`, `--mu-accent-orange-text`, `--mu-green-text`, `--mu-cta-from`, `--mu-cta-to` are specified in DESIGN-SYSTEM.md section 17 but do not exist in `src/styles/theme.css`. Also, `--mu-text-700` is still #63687A (3.75:1 FAIL) instead of specified #4A4E5C (5.89:1 PASS), and `--mu-text-500` is still #A4A8B5 (2.29:1 FAIL) instead of specified #6B6F80 (4.50:1 PASS).

5. **No aria-live on form error messages** -- Design system requires `role="alert" aria-live="polite"` on error messages. The form error spans (`.form__field-error`) and global error div (`.form__error`) have neither attribute.

---

## Detailed Findings

### Pillar 1: Color Compliance (1/4)

**CRITICAL -- Accessible Text Color Tokens Not Implemented**

The DESIGN-SYSTEM.md defines a complete set of WCAG AA-compliant text color alternatives (section "Accessible Text Colors") and mandates that original bright colors be used ONLY for icons, backgrounds, and decorative elements. None of these tokens exist in theme.css, and none are used in index.html.

```
VIOLATION: [Color] [CRITICAL]
Location: src/styles/theme.css (entire file)
Expected: Tokens --mu-blue-text (#0E8FB5), --mu-accent-blue-text (#3B6DD0),
          --mu-accent-teal-text (#3D7E7A), --mu-accent-orange-text (#B5621D),
          --mu-green-text (#1F7A4F), --mu-cta-from (#0E8FB5), --mu-cta-to (#3B6DD0)
          defined in :root and @theme inline
Actual: None of these tokens exist in theme.css
Fix: Add all accessible text tokens to :root and @theme inline blocks in theme.css
```

```
VIOLATION: [Color] [CRITICAL]
Location: line 29 (theme.css)
Expected: --mu-text-700: #4A4E5C (5.89:1 ratio, WCAG AA PASS)
Actual: --mu-text-700: #63687A (3.75:1 ratio, WCAG AA FAIL for normal text)
Fix: Update --mu-text-700 value to #4A4E5C
```

```
VIOLATION: [Color] [CRITICAL]
Location: theme.css line 28
Expected: --mu-text-500: #6B6F80 (4.50:1 ratio, WCAG AA PASS)
Actual: --mu-text-500: #A4A8B5 (2.29:1 ratio, WCAG AA FAIL)
Fix: Update --mu-text-500 value to #6B6F80
```

**Stat number text colors use bright originals as TEXT (not icons):**

```
VIOLATION: [Color] [CRITICAL]
Location: lines 279, 283, 287, 291
Expected: text-mu-accent-blue-text, text-mu-accent-teal-text,
          text-mu-accent-orange-text, text-mu-green-text (accessible variants)
Actual: text-mu-accent-blue (#4F84E8, 3.50:1 FAIL),
        text-mu-accent-teal (#78C3BF, 1.96:1 FAIL),
        text-mu-accent-orange (#FFA25C, 1.92:1 FAIL),
        text-mu-green-600 (#35B678, 2.50:1 FAIL)
Fix: Switch to *-text accessible variants. Note: stat numbers are large bold (60px extrabold)
     so 3:1 ratio threshold applies -- text-mu-accent-blue would pass at 3.50:1,
     but teal (1.96:1) and orange (1.92:1) still fail even large text threshold.
```

**Badge/chip text colors use bright originals:**

```
VIOLATION: [Color] [CRITICAL]
Location: lines 304, 332, 380, 426, 572, 676, 682, 688, 694, 700, 706, 712, 718
Expected: text-mu-accent-blue-text for "Наши Услуги" badge, price badges,
          clinic specialty labels. text-mu-accent-teal-text for treatment badge.
          text-mu-green-text for checkup badge, "О компании" badge.
Actual: text-mu-accent-blue (14px bold -- normal text, needs 4.5:1, has 3.50:1 FAIL),
        text-mu-accent-teal (14px bold, has 1.96:1 FAIL),
        text-mu-green-600 (14px bold, has 2.50:1 FAIL),
        text-mu-green-700 (14px bold, #4BCA8C -- approx 2.3:1 FAIL)
Fix: Replace with accessible *-text variants for all text instances
```

**Inline highlighted numbers in "Why Us" H3 headings:**

```
VIOLATION: [Color] [CRITICAL]
Location: lines 603, 615
Expected: text-mu-accent-teal-text, text-mu-accent-orange-text (accessible)
Actual: text-mu-accent-teal (#78C3BF), text-mu-accent-orange (#FFA25C)
Fix: Use *-text variants. These are 20px extrabold (large text) so 3:1 threshold,
     but both still fail (1.96:1 and 1.92:1)
```

**CTA gradient uses inaccessible colors for white text:**

```
VIOLATION: [Color] [CRITICAL]
Location: lines 167, 193, 221, 1013, 1046, 1159
Expected: from-[var(--mu-cta-from)] to-[var(--mu-cta-to)]
          (#0E8FB5 to #3B6DD0, both 4.5:1+ for white text)
Actual: from-mu-blue to-mu-accent-blue
        (#38C6F4 to #4F84E8, ratios 1.92:1 to 3.22:1 -- FAIL for white text)
Fix: Add --mu-cta-from and --mu-cta-to tokens to theme.css, then use
     from-mu-cta-from to-mu-cta-to (or from-[var(--mu-cta-from)] to-[var(--mu-cta-to)])
```

**Link hover states use bright blue:**

```
VIOLATION: [Color] [MAJOR]
Location: lines 154-158, 163, 1056, 1090-1104, 1113, 1121 (nav, footer, CTA links)
Expected: hover:text-mu-blue-text (accessible #0E8FB5)
Actual: hover:text-mu-blue (bright #38C6F4, 1.92:1 FAIL)
Fix: Change all hover:text-mu-blue to hover:text-mu-blue-text
```

**Coordinator role text uses bright blue:**

```
VIOLATION: [Color] [MAJOR]
Location: line 930
Expected: text-mu-blue-text (accessible)
Actual: text-mu-blue (#38C6F4, 1.92:1 on white/60 glass bg)
Fix: Change to text-mu-blue-text
```

**Minor: hardcoded colors in inline styles (acceptable with fallbacks):**

```
VIOLATION: [Color] [MINOR]
Location: lines 36, 44 (inline <style>)
Expected: Only CSS variables, no hardcoded hex
Actual: #ef4444 used as fallback in var(--mu-accent-red, #ef4444)
Fix: Acceptable as fallback pattern, but note #ef4444 differs from --mu-accent-red (#F50057)
```

**Text using `text-mu-blue` for readable content (not icons):**

```
VIOLATION: [Color] [MAJOR]
Location: line 1056 (CTA section links: email, WhatsApp, Telegram)
Expected: text-mu-blue-text for readable inline links
Actual: text-mu-blue (#38C6F4, 1.92:1 FAIL)
Fix: Use text-mu-blue-text
```

**Icon usage of bright colors (CORRECT -- no violation):**
Lines 208, 323, 340-352, 373, 419, 476, 488, 500, 512, 586, 598, 610, 622 -- using bright accent colors on SVG icons inside colored bg containers. This is explicitly allowed by the design system.


### Pillar 2: Typography Compliance (3/4)

**Hero H1 -- mostly correct:**
- Line 212: `text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] tracking-tight`
- Design system: Hero H1 96px (6rem = text-8xl at xl), weight 800 (extrabold), line-height 1.1, letter-spacing -2.4px
- `tracking-tight` = -0.025em = -2.4px at 96px. Matches.

```
VIOLATION: [Typography] [MINOR]
Location: line 212
Expected: tracking-[-2.4px] (explicit match to spec's -2.4px)
Actual: tracking-tight (-0.025em, which equals -2.4px at 96px but not at smaller breakpoints)
Fix: Minor -- tracking-tight is approximately correct at hero size. Could use tracking-[-0.025em]
     for precision, but current value is acceptable.
```

**Section H2 -- weight variation:**

```
VIOLATION: [Typography] [MINOR]
Location: line 466
Expected: font-extrabold (800) for all Section H2
Actual: font-bold (700) on "Узнаёте свою ситуацию?" H2
Fix: Change font-bold to font-extrabold on line 466
```

**H2 sizes -- spec says 60px desktop, implementation uses text-5xl (48px) on some:**

Most H2s use `text-4xl md:text-5xl` (36px base, 48px md) instead of spec's `text-5xl md:text-6xl` (48px base, 60px md). However, some H2s (lines 306, 574, 918) correctly use `text-5xl md:text-6xl`. This inconsistency suggests some sections were updated and others were not.

```
VIOLATION: [Typography] [MAJOR]
Location: lines 466, 528, 665, 730, 769, 826, 1042
Expected: text-5xl md:text-6xl (Section H2: 48px mobile, 60px desktop)
Actual: text-4xl md:text-5xl (36px mobile, 48px desktop)
Fix: Update all Section H2 elements to use text-5xl md:text-6xl consistently
```

**Card H3 -- correct:**
Lines 334, 382, 428: `text-2xl font-bold` = 24px, weight 700. Matches spec.

**Stat label -- correct:**
Lines 280, 284, 288, 292: `text-lg font-bold text-center uppercase tracking-wider text-mu-text-700`. Matches spec except text color (mu-text-700 itself is wrong value, see Color section).

**Body text -- correct:**
`text-xl text-mu-text-700 font-medium` for hero subtitle (line 218). Matches Body large spec (20px, 500 weight).

**Font families -- correct in base styles:**
theme.css correctly defines heading and body font families. Base layer applies them to h1-h4.


### Pillar 3: Glassmorphism Compliance (4/4)

All glass levels are correctly applied:

- **Glass-1** (light): Header non-scrolled -- `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%]` (line 148). Matches spec.
- **Glass-3** (standard): Header scrolled -- inline style `bg: rgba(255,255,255,0.5), backdrop-filter: blur(60px) saturate(180%)` (lines 26-28). Matches spec.
- **Glass-2** (medium): Badges/chips -- `bg-white/40 backdrop-blur-xl` (line 207, 303, 571, 950). Matches spec.
- **Glass-4** (dense): Service cards -- `bg-white/60 backdrop-blur-2xl` (lines 315, 368, 414). Matches spec.
- **Glass-5** (heavy): Form container -- `bg-white/60 backdrop-blur-3xl` (line 963). Close to spec (spec says white/70, implementation uses white/60).
- **Glass-mobile**: Mobile menu -- `bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%]` (line 181). Matches spec.

**Shadows -- correct:**
All components use design system shadow tokens: `shadow-glass-sm`, `shadow-glass`, `shadow-glass-lg`, `shadow-glass-header`, `shadow-glass-inner`, `shadow-glass-inner-strong`.

**Borders -- correct:**
`border-glass-border` and `border-glass-border-strong` used consistently for normal and hover states.

```
VIOLATION: [Glassmorphism] [MINOR]
Location: line 963 (form container)
Expected: bg-white/70 (Glass-5 per spec)
Actual: bg-white/60
Fix: Change to bg-white/70 for form container
```


### Pillar 4: Spacing & Layout Compliance (3/4)

**Container -- correct:**
All sections use `container mx-auto px-4 lg:px-6` with implied max-w-7xl (1280px from Tailwind defaults). Matches spec.

**Section spacing -- correct:**
- Hero: `pt-32 pb-16 lg:pt-40` (line 201). Matches spec.
- Stats: `py-12` (line 275). Matches spec.
- Standard sections: `py-16` (lines 299, 462, 525, 564, 662, 727, 766, 824, 912, 1032). Matches spec.

**Grid systems -- correct:**
- Services: `md:grid-cols-2 lg:grid-cols-3 gap-8` (line 312). Matches spec.
- Stats: `grid-cols-2 lg:grid-cols-4 gap-6` (line 277). Matches spec.
- Contact: `lg:grid-cols-2 gap-12` (line 914). Matches spec.
- Footer: `md:grid-cols-2 lg:grid-cols-4 gap-12` (line 1076). Matches spec.

**Border radius -- mostly correct:**
- Header: `rounded-[2.5rem]` = 40px (line 148). Matches spec.
- Service cards: `rounded-[3rem]` = 48px (line 315). Matches spec.
- Inner images: `rounded-[2rem]` = 32px (line 318). Matches spec.
- Stat cards: `rounded-[2.5rem]` = 40px (line 278). Matches spec.
- Footer: `rounded-[3rem]` = 48px (line 1075). Matches spec.
- Header CTA: `rounded-full` (line 167). Matches spec.
- CTA buttons: `rounded-3xl` = 24px (line 221). Matches spec.
- Inputs: `rounded-2xl` = 16px (line 980). Matches spec.

```
VIOLATION: [Spacing] [MINOR]
Location: lines 832-906 (FAQ items)
Expected: No specific FAQ radius in design system, but cards should use consistent radius.
          Problem/guide cards use rounded-[3rem] (48px).
Actual: FAQ items use rounded-2xl (16px)
Fix: This may be intentional for compact FAQ accordion items. Acceptable deviation.
```

```
VIOLATION: [Spacing] [MINOR]
Location: line 1159 (sticky mobile CTA bar)
Expected: CTA buttons should use rounded-3xl (24px) per spec
Actual: Container uses rounded-2xl, CTA button uses rounded-xl (12px)
Fix: Update sticky CTA button from rounded-xl to at least rounded-2xl or rounded-3xl
```


### Pillar 5: Component Compliance (2/4)

**Primary CTA buttons -- gradient color violation (see Color section) + weight issue:**

```
VIOLATION: [Components] [MAJOR]
Location: lines 221, 1046 (hero/page CTAs)
Expected: font-bold (per Primary CTA spec)
Actual: font-semibold (line 221), font-bold (line 1046)
Fix: Line 221 hero CTA should use font-bold instead of font-semibold
```

```
VIOLATION: [Components] [MAJOR]
Location: line 167 (header CTA)
Expected: Header CTA spec: px-6 py-2.5 rounded-full text-base font-semibold tracking-tight
Actual: Matches spec. No violation.
```

**Secondary (Ghost) buttons -- correct:**
Line 225: `bg-white/50 backdrop-blur-[20px] text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-white/60 transition-all border border-glass-border`
Spec says `font-bold` but implementation has `font-semibold`.

```
VIOLATION: [Components] [MINOR]
Location: line 225
Expected: font-bold (Secondary Ghost spec)
Actual: font-semibold
Fix: Change to font-bold
```

**Nav Links -- missing focus-visible:**

```
VIOLATION: [Components] [CRITICAL]
Location: lines 154-158 (desktop nav links)
Expected: focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2
          focus-visible:outline-none
Actual: No focus-visible styles at all
Fix: Add focus-visible ring classes to all nav links
```

**Card CTAs -- correct structure:**
Lines 358, 404, 450: `w-full bg-white/50 backdrop-blur-xl border border-glass-border text-mu-text-900 py-4 rounded-2xl font-bold shadow-glass-sm hover:bg-white/70 hover:shadow-glass`. Matches spec.

**Form inputs -- mostly correct but missing accessible focus color:**

```
VIOLATION: [Components] [MAJOR]
Location: lines 980, 986, 992, 1004 (form inputs)
Expected: focus:border-[var(--mu-blue-text)] focus:ring-4 focus:ring-[var(--mu-blue-text)]/20
Actual: focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20
Fix: Once mu-blue-text token is added to theme.css, update focus styles to use it
```

**Form labels -- correct:**
Lines 979, 985, 991, 1003: `text-sm font-bold text-mu-text-900 mb-2 block`. Matches spec.

**Coordinator card -- correct:**
Line 924: `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/60 shadow-glass`. Matches spec.


### Pillar 6: Accessibility Compliance (1/4)

**CRITICAL -- No focus-visible rings anywhere:**

```
VIOLATION: [Accessibility] [CRITICAL]
Location: Entire file (0 occurrences of focus-visible in 1168 lines)
Expected: focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2
          focus-visible:outline-none on ALL interactive elements:
          - Nav links (lines 154-158)
          - Header CTA (line 167)
          - Mobile menu button (line 171)
          - Hero CTAs (lines 221-227)
          - Card CTAs (lines 358, 404, 450)
          - FAQ buttons (lines 833-906)
          - Form inputs (lines 980-1004)
          - Form submit button (line 1013)
          - Footer links (lines 1090-1131)
          - Sticky bar links (lines 1158-1159)
Actual: Zero focus-visible styles on any element
Fix: Add focus-visible ring classes to every interactive element in index.html
```

**No aria-live on form error messages:**

```
VIOLATION: [Accessibility] [MAJOR]
Location: lines 981, 987, 999, 1022
Expected: role="alert" aria-live="polite" on error message containers
Actual: <span class="form__field-error" hidden></span> -- no ARIA attributes
Fix: Add role="alert" aria-live="polite" to all .form__field-error spans and .form__error div
```

**No disabled states on non-submit interactive elements:**

```
VIOLATION: [Accessibility] [MINOR]
Location: All buttons and links except submit button
Expected: disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          defined on all interactive elements (spec section 5)
Actual: Only the form submit button (line 1013) has disabled styles
Fix: Add disabled state classes to CTA links/buttons where applicable
```

**prefers-reduced-motion -- partially implemented:**
JS files (main.js:452, animations.js:26) check for `prefers-reduced-motion`. However, there is no CSS `@media (prefers-reduced-motion: reduce)` rule to handle CSS transitions/transforms on hover states. The mesh background blobs animate via CSS and would not be affected by JS-only checks.

```
VIOLATION: [Accessibility] [MAJOR]
Location: CSS (missing entirely)
Expected: @media (prefers-reduced-motion: reduce) { ... } in CSS
          to disable hover transitions, mesh blob animations, etc.
Actual: Only JS-level motion detection
Fix: Add CSS media query to disable transition/animation properties
```

**Positive findings:**
- `aria-label` on mobile menu button (line 171)
- `aria-hidden="true"` on decorative elements (mesh bg, icons)
- `aria-expanded` on mobile menu button and FAQ buttons
- Semantic HTML structure (header, main, footer, nav, section)
- `role="complementary"` on sticky bar with aria-label (line 1156)
- Honeypot field has `aria-hidden="true"` and `tabindex="-1"` (lines 1008-1011)

---

## Summary

The page has excellent glassmorphism implementation and solid structural/layout compliance with the design system. The critical gap is **accessibility through color contrast** -- the design system defined a complete set of accessible text color tokens, but none have been implemented in theme.css or used in index.html. This results in 20+ WCAG AA failures across stat numbers, badges, links, and CTA buttons.

The second critical gap is the **complete absence of focus-visible rings** on all interactive elements, making the page unusable for keyboard navigation.

**Immediate action items:**
1. Add all accessible color tokens to `src/styles/theme.css` (:root + @theme inline)
2. Update `--mu-text-700` to #4A4E5C and `--mu-text-500` to #6B6F80 in theme.css
3. Replace all text color classes with accessible variants in index.html
4. Switch CTA gradient from `from-mu-blue to-mu-accent-blue` to accessible CTA tokens
5. Add `focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none` to every interactive element
6. Add `role="alert" aria-live="polite"` to form error containers

---

## Files Audited

- `/Users/mikhail/Projects/Medicus_video_consult-landing/index.html` (1168 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/theme.css` (269 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN-SYSTEM.md` (design system contract)
