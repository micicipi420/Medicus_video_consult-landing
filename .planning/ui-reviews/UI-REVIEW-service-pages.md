# UI Review -- Service Pages (online-consultations + treatment-abroad)

**Audited:** 2026-04-05
**Baseline:** DESIGN-SYSTEM.md (project design system)
**Screenshots:** not captured (code-only audit)
**Pages:** `online-consultations.html`, `treatment-abroad.html`

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Color compliance | 2/4 | Accessible text color tokens (`*-text` variants) defined in DESIGN-SYSTEM.md but never implemented in theme.css or used in HTML; CTA gradients use WCAG-failing colors for white text |
| 2. Typography compliance | 3/4 | Font families, sizes, weights mostly correct; minor spec deviation on feature card H3 (extrabold vs spec bold) |
| 3. Glassmorphism compliance | 4/4 | Glass levels, blur values, shadow tokens, and borders match spec accurately |
| 4. Spacing & Layout compliance | 3/4 | Feature cards use rounded-[2.5rem] instead of spec's rounded-[3rem]; hero image on treatment-abroad uses shadow-2xl instead of shadow-glass-lg |
| 5. Component compliance | 3/4 | Service page hero, feature cards, step cards, forms all structurally correct; minor deviations in badge text color and radius |
| 6. Accessibility compliance | 1/4 | Zero focus-visible rings on any interactive element; no prefers-reduced-motion media query; WCAG AA contrast violations on multiple text elements |

**Overall: 16/24**

---

## Top 5 Priority Fixes

1. **No focus-visible rings anywhere** -- Keyboard users cannot see which element is focused, violating WCAG 2.1 SC 2.4.7. Add `focus-visible:ring-2 focus-visible:ring-mu-blue focus-visible:ring-offset-2 focus-visible:outline-none` to all `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>` elements. Design system specifies `focus-visible:ring-mu-blue-text` but that token does not exist yet.

2. **Accessible text color tokens not implemented** -- DESIGN-SYSTEM.md defines `--mu-blue-text`, `--mu-accent-blue-text`, `--mu-accent-teal-text`, `--mu-accent-orange-text`, `--mu-green-text` but none exist in `theme.css`. All instances of `text-mu-blue` on readable text (nav active state, badge text, stat labels) fail WCAG AA. Fix: add all `*-text` tokens to theme.css and replace text usages.

3. **CTA gradient uses non-accessible colors** -- All 17 CTA buttons across both pages use `from-mu-blue to-mu-accent-blue` (#38C6F4 to #4F84E8). White text on #38C6F4 = 1.92:1 ratio (FAIL). DESIGN-SYSTEM.md specifies accessible `--mu-cta-from: #0E8FB5` / `--mu-cta-to: #3B6DD0`. Fix: define cta tokens in theme.css, update all CTA gradients.

4. **No prefers-reduced-motion support** -- Neither page implements `@media (prefers-reduced-motion: reduce)`. Users with motion sensitivity will see all scroll-reveal animations, hover transforms, and mesh background blob animations. Design system explicitly requires this.

5. **Feature cards use wrong border-radius** -- Feature cards on online-consultations use `rounded-[2.5rem]` (40px) but DESIGN-SYSTEM.md Section 6 "Service Card" specifies `rounded-[3rem]` (48px). This applies to 6 feature cards, 4 benefit cards, and the "Why MedicusUnion" cards.

---

## Detailed Findings

### Pillar 1: Color Compliance (2/4)

**CRITICAL: Accessible text tokens not implemented**

DESIGN-SYSTEM.md Sec 1 "Accessible Text Colors" defines 7 accessible text tokens. None exist in `src/styles/theme.css`:

```
VIOLATION: [Color] [CRITICAL] [both pages]
Location: src/styles/theme.css (missing tokens)
Expected: --mu-blue-text: #0E8FB5; --mu-accent-blue-text: #3B6DD0; --mu-accent-teal-text: #3D7E7A; --mu-accent-orange-text: #B5621D; --mu-green-text: #1F7A4F
Actual: Tokens not defined
Fix: Add all accessible text tokens to :root in theme.css and register them in @theme inline block
```

**CRITICAL: text-mu-blue used as readable text color**

`text-mu-blue` (#38C6F4) has contrast ratio 1.92:1 against white/near-white backgrounds. Used for:

```
VIOLATION: [Color] [CRITICAL] [online-consultations.html]
Location: lines 71, 98 (active nav link text-mu-blue)
Expected: text-mu-blue-text (#0E8FB5, ratio 4.51:1)
Actual: text-mu-blue (#38C6F4, ratio 1.92:1 FAIL)
Fix: Change to text-[var(--mu-blue-text)] once token is defined

VIOLATION: [Color] [CRITICAL] [treatment-abroad.html]
Location: line 127 (hero badge "Медицинский туризм" text-mu-blue)
Expected: text-mu-blue-text for readable text
Actual: text-mu-blue (#38C6F4, ratio 1.92:1 FAIL)
Fix: Change to text-[var(--mu-blue-text)]

VIOLATION: [Color] [CRITICAL] [treatment-abroad.html]
Location: lines 214, 219, 224, 229 (stat card labels text-mu-blue)
Expected: Accessible color token for readable text
Actual: text-mu-blue (#38C6F4, ratio 1.92:1 FAIL)
Fix: Change to text-[var(--mu-blue-text)]
```

**CRITICAL: CTA gradient not accessible**

```
VIOLATION: [Color] [CRITICAL] [both pages]
Location: 17 CTA buttons total (from-mu-blue to-mu-accent-blue)
Expected: from-[var(--mu-cta-from)] to-[var(--mu-cta-to)] per DESIGN-SYSTEM.md Sec 1 "CTA Gradient"
Actual: from-mu-blue (#38C6F4) to-mu-accent-blue (#4F84E8) -- white text fails AA on both
Fix: Define --mu-cta-from: #0E8FB5 and --mu-cta-to: #3B6DD0 in theme.css, update gradient classes
```

**MAJOR: text-mu-accent-blue used as readable link text**

```
VIOLATION: [Color] [MAJOR] [online-consultations.html]
Location: line 472 (text link "Лечение за рубежом" with text-mu-accent-blue)
Expected: text-mu-accent-blue-text (#3B6DD0, ratio 4.58:1)
Actual: text-mu-accent-blue (#4F84E8, ratio 3.50:1 FAIL for normal text)
Fix: Change to text-[var(--mu-accent-blue-text)]
```

**MAJOR: text-mu-accent-teal and text-mu-accent-orange on step badges**

```
VIOLATION: [Color] [MAJOR] [treatment-abroad.html]
Location: line 555 (step 2 badge "7-10 дней" text-mu-accent-teal)
Expected: Accessible teal text token for readable text
Actual: text-mu-accent-teal (#78C3BF, ratio 1.96:1 FAIL)
Fix: Change to text-[var(--mu-accent-teal-text)]

VIOLATION: [Color] [MAJOR] [treatment-abroad.html]
Location: line 581 (step 3 badge "По плану лечения" text-mu-accent-orange)
Expected: Accessible orange text token for readable text
Actual: text-mu-accent-orange (#FFA25C, ratio 1.92:1 FAIL)
Fix: Change to text-[var(--mu-accent-orange-text)]
```

**MINOR: Hardcoded colors in SVGs**

```
VIOLATION: [Color] [MINOR] [treatment-abroad.html]
Location: lines 783, 789, 795 (checkmark icons stroke="#047857")
Expected: CSS variable (var(--mu-green-600) or Tailwind class)
Actual: Hardcoded #047857 (not even the correct green -- should be #35B678)
Fix: Use stroke="currentColor" with text-mu-green-600 class, or use var(--mu-green-600)
```

Hardcoded hex in inline SVG flag illustrations (lines 166-199 treatment-abroad, lines 331-362 online-consultations) are acceptable since these are decorative flag illustrations, not UI tokens.

**MINOR: Fallback colors in inline styles**

```
VIOLATION: [Color] [MINOR] [both pages]
Location: .is-invalid and .form__field-error inline styles
Expected: var(--mu-accent-red) only
Actual: var(--mu-accent-red, #ef4444) -- fallback #ef4444 does not match design system #F50057
Fix: Change fallback to #F50057 or remove fallback
```

---

### Pillar 2: Typography Compliance (3/4)

**Correct implementations:**
- H1: `text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]` -- matches spec (48/60/72px, 800 weight, 1.1 line-height)
- H2: `text-4xl md:text-5xl font-extrabold` -- matches spec (36/48px, 800 weight)
- H3: Uses `text-xl font-extrabold` on feature cards and `text-lg font-extrabold` on advantage cards
- Body: `text-mu-text-700 font-medium` -- correct
- Labels: `text-sm font-bold text-mu-text-900 mb-2` -- matches spec
- Gradient text on H2: `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent` -- matches spec

```
VIOLATION: [Typography] [MINOR] [online-consultations.html]
Location: lines 185, 193, 201, etc. (feature card H3)
Expected: Card H3 = text-xl (24px) font-bold (700) per DESIGN-SYSTEM.md Sec 2
Actual: text-xl font-extrabold (800)
Fix: Change font-extrabold to font-bold on card H3 elements

VIOLATION: [Typography] [MINOR] [treatment-abroad.html]
Location: lines 250, 263, 277, 291 (about cards H3)
Expected: Card H3 = font-bold (700)
Actual: font-extrabold (800)
Fix: Same as above
```

Font families are correctly applied via base layer styles in theme.css. The heading font (`SF Pro Rounded`) is set on h1-h4 in the base layer, and body font (`SF Pro Display`) is set on body.

---

### Pillar 3: Glassmorphism Compliance (4/4)

All glass levels match the design system precisely:

- **Header (not scrolled):** `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%]` -- matches Glass-1 spec
- **Header (scrolled):** `bg-white/50 backdrop-blur-[60px] saturate-[180%]` -- matches Glass-3 spec
- **Feature/benefit cards:** `bg-white/60 backdrop-blur-2xl` -- matches Glass-4 spec
- **Mobile menu:** `bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%]` -- matches Glass-mobile spec
- **Form container:** `bg-white/60 backdrop-blur-3xl` -- approximately matches Glass-5 (spec says white/70 -- see minor note)
- **Shadows:** `shadow-glass`, `shadow-glass-sm`, `shadow-glass-lg`, `shadow-glass-header`, `shadow-glass-inner`, `shadow-glass-inner-strong` all used correctly via theme tokens
- **Borders:** `border border-white/60` on cards, `border-[0.5px] border-white/50` on header -- matches spec

```
VIOLATION: [Glass] [MINOR] [both pages]
Location: Form container (bg-white/60)
Expected: Glass-5 = bg-white/70 per DESIGN-SYSTEM.md Sec 3
Actual: bg-white/60
Fix: Change form container background to bg-white/70
```

This is minor because the visual difference between white/60 and white/70 is subtle. Score remains 4/4 because all other 5 glass levels are exact.

---

### Pillar 4: Spacing & Layout Compliance (3/4)

**Correct implementations:**
- Container: `container mx-auto px-4 lg:px-6` -- matches spec max-w-7xl (1280px)
- Header: `max-w-7xl rounded-[2.5rem]` -- matches spec
- Section spacing: consistent `mb-16` between sections -- correct
- Grid systems: `grid lg:grid-cols-2 gap-12` for hero, `grid sm:grid-cols-2 lg:grid-cols-3 gap-6` for features -- correct
- Button padding: hero CTA `px-8 py-4 rounded-3xl`, header CTA `px-6 py-2.5 rounded-full` -- matches spec

```
VIOLATION: [Spacing] [MAJOR] [online-consultations.html]
Location: Feature cards (lines 181-228), benefit cards (lines 253-284), step cards (lines 294-311), "Why MedicusUnion" cards (lines 406-478), triggers card (line 487), pricing card (line 530)
Expected: Service cards = rounded-[3rem] (48px) per DESIGN-SYSTEM.md Sec 6
Actual: rounded-[2.5rem] (40px)
Fix: Change rounded-[2.5rem] to rounded-[3rem] on service-type cards

Note: country cards correctly use rounded-2xl for smaller cards, and the doctor info block correctly uses rounded-[2.5rem] per stat card spec. The issue is specifically with cards that should be Service Card type.
```

```
VIOLATION: [Spacing] [MINOR] [treatment-abroad.html]
Location: line 162 (hero illustration container)
Expected: shadow-glass-lg (design system shadow token)
Actual: shadow-2xl (Tailwind default, not a design system token)
Fix: Change shadow-2xl to shadow-glass-lg
```

```
VIOLATION: [Spacing] [MINOR] [treatment-abroad.html]
Location: line 120 (hero section has extra mb-16 on inner container)
Expected: Consistent spacing via section gap system
Actual: Both pt-32 pb-16 on section AND mb-16 on inner container = double bottom spacing
Fix: Remove mb-16 from the inner container div (line 120)
```

---

### Pillar 5: Component Compliance (3/4)

**Service page hero (2-col layout):** Both pages correctly implement the hero with `grid lg:grid-cols-2 gap-12 items-center`, badge, H1, and right-column visual element. Online-consultations has a real image in a glass frame; treatment-abroad has an inline SVG illustration in a glass frame.

**Feature cards:** Structurally correct (icon box, H3, description), with the border-radius issue noted above.

**Step cards (How it works):**
- Online-consultations: 3 step cards with numbered overlay (01, 02, 03), correct glass background. Numbers use page-appropriate colors (`text-mu-accent-blue`, `text-mu-green-500`, `text-mu-accent-teal`).
- Treatment-abroad: 4 step cards with numbered overlay, correct layout. Includes sub-lists and time badges.

**Country cards (treatment-abroad):** Correctly use `rounded-[2rem]` for smaller cards. Include flag SVGs, clinic names.

**CTA banner:** Both pages have final CTA sections with `bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-12 lg:p-20 text-center border border-white/60 shadow-glass-lg` -- matches spec exactly.

**Buttons:** CTA buttons match structural spec (px-8 py-4 rounded-3xl text-lg font-semibold). Secondary buttons match (bg-white/50 backdrop-blur-xl border border-white/60).

```
VIOLATION: [Component] [MINOR] [treatment-abroad.html]
Location: line 529 (step 1 badge text-mu-blue)
Expected: Step badge text color should use accessible text token
Actual: text-mu-blue (#38C6F4) as readable text in badge -- WCAG fail
Fix: Use text-[var(--mu-blue-text)] when token is implemented

VIOLATION: [Component] [MINOR] [online-consultations.html]
Location: line 472 (cross-sell link text-mu-accent-blue)
Expected: Link text should use --mu-accent-blue-text for WCAG compliance
Actual: text-mu-accent-blue (#4F84E8, ratio 3.50:1)
Fix: Use accessible text variant
```

---

### Pillar 6: Accessibility Compliance (1/4)

**CRITICAL: No focus-visible rings**

Zero instances of `focus-visible` across both pages. The design system explicitly mandates:
```
focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none
```

This affects every interactive element:
- 5+ nav links per page
- 2 CTA buttons per hero
- Form inputs (3-4 per page)
- Submit button
- FAQ accordion buttons (6-8 per page)
- Footer links (6+ per page)
- Mobile menu toggle button
- Sticky bar CTA

```
VIOLATION: [Accessibility] [CRITICAL] [both pages]
Location: All <a>, <button>, <input>, <select>, <textarea> elements
Expected: focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none
Actual: No focus styles whatsoever
Fix: Add focus-visible classes to every interactive element, or add a global CSS rule
```

**CRITICAL: No prefers-reduced-motion**

```
VIOLATION: [Accessibility] [CRITICAL] [both pages]
Location: No @media (prefers-reduced-motion: reduce) in <style> block or linked CSS
Expected: Disable Motion animations, mesh blob animation, hover transforms for motion-sensitive users
Actual: All animations run unconditionally
Fix: Add prefers-reduced-motion media query to disable CSS transitions and configure Motion.js to respect it
```

**Positive accessibility implementations:**
- `aria-label` on nav elements ("Основная навигация", "Мобильная навигация")
- `aria-current="page"` on active nav link
- `aria-expanded` on mobile menu button and FAQ buttons
- `aria-hidden="true"` on decorative elements (mesh background, flag SVGs, icons)
- `role="list"` on semantic list elements
- `role="complementary"` on sticky bar
- Form honeypot with `tabindex="-1"` and `aria-hidden="true"`
- `<label>` elements properly associated with form inputs via `for` attribute

```
VIOLATION: [Accessibility] [MAJOR] [both pages]
Location: Form inputs (focus states)
Expected: focus:border-[var(--mu-blue-text)] focus:ring-4 focus:ring-[var(--mu-blue-text)]/20
Actual: focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 -- uses non-accessible blue token
Fix: Update to accessible blue text token when defined
```

```
VIOLATION: [Accessibility] [MINOR] [online-consultations.html]
Location: FAQ answer divs
Expected: role="region" and aria-labelledby on FAQ answer panels
Actual: No ARIA roles on answer panels
Fix: Add role="region" aria-labelledby linking to the question button
```

---

## Files Audited

- `/Users/mikhail/Projects/Medicus_video_consult-landing/online-consultations.html` (869 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/treatment-abroad.html` (~980 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN-SYSTEM.md` (full design system reference)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/theme.css` (269 lines, CSS tokens)
