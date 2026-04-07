# UI Review -- checkup.html, contacts.html, 404.html

**Audited:** 2026-04-05
**Baseline:** DESIGN-SYSTEM.md (project design system)
**Screenshots:** not captured (code-only audit; dev server detected but CLI capture skipped)

---

## Pillar Scores

| Pillar | checkup.html | contacts.html | 404.html | Key Finding |
|--------|:---:|:---:|:---:|-------------|
| 1. Color Compliance | 2/4 | 2/4 | 2/4 | Accessible text tokens (`*-text` variants) NOT implemented in theme.css; all CTA gradients use WCAG-failing colors |
| 2. Typography Compliance | 3/4 | 3/4 | 4/4 | Badge text on contacts uses `text-mu-blue` (FAIL ratio 1.92:1) for readable text |
| 3. Glassmorphism Compliance | 4/4 | 4/4 | 4/4 | Excellent adherence to glass levels, blur, shadows, borders |
| 4. Spacing & Layout | 3/4 | 3/4 | 4/4 | Coordinator card avatar `w-28 h-28` vs spec `w-32 h-32`; coordinator `p-8` vs spec `p-6` |
| 5. Component Compliance | 3/4 | 3/4 | 4/4 | Contacts form uses hardcoded `shadow-[inset...]` instead of token; checkup stat colors use non-accessible variants |
| 6. Accessibility | 1/4 | 1/4 | 1/4 | ZERO `focus-visible` rings on any interactive element across all 3 pages |

**Overall: checkup 16/24 | contacts 16/24 | 404 19/24**

---

## Top 5 Priority Issues (Cross-page)

1. **CRITICAL: No `focus-visible` rings anywhere** -- Keyboard users cannot see which element is focused. Design system REQUIRES `focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none` on ALL interactive elements. Fix: add focus-visible classes to every `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>` across all 3 pages.

2. **CRITICAL: Accessible text color tokens not implemented in theme.css** -- DESIGN-SYSTEM.md defines `--mu-blue-text` (#0E8FB5), `--mu-green-text` (#1F7A4F), `--mu-accent-blue-text` (#3B6DD0), `--mu-cta-from`, `--mu-cta-to`, etc. NONE of these exist in `src/styles/theme.css` or `@theme inline`. Every page using `text-mu-blue` for readable text (nav active states, badge text, coordinator subtitle) fails WCAG AA at ratio 1.92:1. Fix: add all `*-text` tokens to `:root` and `@theme inline` in theme.css.

3. **CRITICAL: CTA gradient buttons use non-accessible colors** -- All CTA buttons use `from-mu-blue to-mu-accent-blue` (#38C6F4 to #4F84E8). White text on #38C6F4 has ratio 1.92:1 (FAIL). Design system specifies `from-[var(--mu-cta-from)] to-[var(--mu-cta-to)]` (#0E8FB5 to #3B6DD0, both PASS 4.5:1+). Fix: implement `--mu-cta-from`/`--mu-cta-to` tokens and update all CTA gradient classes.

4. **MAJOR: Stat card number colors use non-accessible originals (checkup.html)** -- Lines 198, 202, 206 use `text-mu-accent-teal`, `text-mu-accent-orange`, `text-mu-green-600`. Design system says stat numbers MUST use `*-text` accessible variants. These original colors all fail WCAG AA (ratios 1.96, 1.92, 2.50 respectively). Fix: use `text-mu-accent-teal-text`, `text-mu-accent-orange-text`, `text-mu-green-text` (once tokens are implemented).

5. **MAJOR: `text-mu-blue` used as readable text color in multiple places** -- Badge labels (contacts.html:114, checkup.html:124), coordinator subtitle (contacts.html:138), section subtitles (checkup.html:324, 422, 531). `--mu-blue` is #38C6F4 with ratio 1.92:1 on #FBFBFB (FAIL). Fix: replace with `text-mu-blue-text` (once token exists) for all readable text instances.

---

## Detailed Findings

### Pillar 1: Color Compliance (checkup 2/4, contacts 2/4, 404 2/4)

**VIOLATION: [Color] [CRITICAL] [ALL PAGES]**
Location: src/styles/theme.css -- entire file
Expected: `--mu-blue-text: #0E8FB5`, `--mu-green-text: #1F7A4F`, `--mu-accent-blue-text: #3B6DD0`, `--mu-accent-teal-text: #3D7E7A`, `--mu-accent-orange-text: #B5621D`, `--mu-cta-from: #0E8FB5`, `--mu-cta-to: #3B6DD0` defined in `:root` and mapped in `@theme inline`
Actual: None of these tokens exist in theme.css
Fix: Add all accessible text color tokens to `:root {}` block and add corresponding `--color-*` mappings to `@theme inline {}` block

**VIOLATION: [Color] [CRITICAL] [ALL PAGES]**
Location: All CTA buttons (e.g., checkup.html:136, 484, 572, 731, 756; contacts.html:76, 101, 249, 334; 404.html:112)
Expected: `bg-gradient-to-r from-[var(--mu-cta-from)] to-[var(--mu-cta-to)]` (white text ratio 4.5:1+)
Actual: `bg-gradient-to-r from-mu-blue to-mu-accent-blue` (white text ratio 1.92:1 to 3.22:1 -- FAIL)
Fix: Implement `--mu-cta-from`/`--mu-cta-to` tokens, then use `from-mu-cta-from to-mu-cta-to` in all CTA gradients

**VIOLATION: [Color] [MAJOR] [checkup.html]**
Location: checkup.html:198 (`text-mu-accent-teal`), :202 (`text-mu-accent-orange`), :206 (`text-mu-green-600`)
Expected: `text-mu-accent-teal-text`, `text-mu-accent-orange-text`, `text-mu-green-text` (accessible `*-text` variants, all 4.5:1+)
Actual: Original bright colors used for stat numbers (ratios 1.96, 1.92, 2.50 -- all FAIL AA for normal text)
Fix: Switch to `*-text` accessible variants. Note: these are extrabold 60px text (qualifies as "large text" under WCAG where 3:1 is sufficient), but even so `text-mu-accent-orange` at 1.92:1 still fails large text threshold.

**VIOLATION: [Color] [MAJOR] [contacts.html]**
Location: contacts.html:114 (`text-mu-blue` on badge label "Свяжитесь с нами"), :138 (`text-mu-blue` on "Старший медицинский координатор" -- small 14px text)
Expected: `text-mu-blue-text` (#0E8FB5, ratio 4.51:1)
Actual: `text-mu-blue` (#38C6F4, ratio 1.92:1 -- FAIL, especially at 14px font-bold)
Fix: Replace `text-mu-blue` with `text-mu-blue-text` for all readable text

**VIOLATION: [Color] [MAJOR] [checkup.html]**
Location: checkup.html:124 (`text-mu-blue` on badge "Чек-ап за рубежом"), :324, :422, :531 (`text-mu-blue` on section subtitles like "Samsung Medical Center...")
Expected: `text-mu-blue-text` for readable text (4.51:1)
Actual: `text-mu-blue` (1.92:1 FAIL)
Fix: Replace with `text-mu-blue-text`

**VIOLATION: [Color] [MINOR] [contacts.html]**
Location: contacts.html:216, 222, 228, 240 (form inputs)
Expected: `shadow-form-inset` or `shadow-glass-inner` (design system token)
Actual: `shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]` (hardcoded rgba)
Fix: Use `shadow-form-inset` token (once added to theme) or `shadow-glass-inner`

**GOOD:** All three pages use design system color tokens for backgrounds (`bg-mu-text-50`), text (`text-mu-text-900`, `text-mu-text-700`), and decorative elements. No hardcoded hex colors in class attributes. Gradient text (`bg-clip-text text-transparent`) usage is correct per spec (extrabold large text only).

### Pillar 2: Typography Compliance (checkup 3/4, contacts 3/4, 404 4/4)

**GOOD:** Font families correctly inherit from `@layer base` in theme.css. Heading hierarchy is correct:
- H1: `text-5xl md:text-6xl lg:text-7xl font-extrabold` (all pages with hero)
- H2: `text-4xl md:text-5xl font-extrabold` (section headings)
- H3: `text-xl font-extrabold` or `text-2xl font-extrabold` (card headings)
- Body: `text-mu-text-700 font-medium` (descriptions)
- 404.html: `text-8xl font-extrabold` for "404", `text-3xl font-extrabold` for H1 -- matches spec exactly

**VIOLATION: [Typography] [MINOR] [checkup.html]**
Location: checkup.html:324, 422, 531 (section subtitles)
Expected: `text-lg font-bold` for subtitle (per body large spec: 20px/500 or 18px/700)
Actual: `text-lg text-center mb-4` with `font-bold` -- acceptable but `text-mu-blue` color is the real problem (see Color pillar)
Fix: Color issue only (see above)

**VIOLATION: [Typography] [MINOR] [contacts.html]**
Location: contacts.html:150, 152 (contact card label "Телефон", "Email")
Expected: Label spec says `text-sm font-bold text-mu-text-900` -- but these are category labels
Actual: `text-sm text-mu-text-500 font-bold` -- uses `text-mu-text-500` which at the OLD value (#A4A8B5) fails WCAG AA. The design system redefines `--mu-text-500` to accessible #6B6F80 (4.50:1 PASS) but this is not implemented in theme.css (theme.css still has `--mu-text-500: #A4A8B5` which is 2.29:1 FAIL).
Fix: Update `--mu-text-500` in theme.css `:root` to `#6B6F80`

### Pillar 3: Glassmorphism Compliance (all 4/4)

**EXCELLENT across all pages.** Every glass level matches the design system:

- Header: `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%]` = Glass-1 (MATCH)
- Header scrolled: `bg-white/50 backdrop-blur-[60px] saturate-[180%]` = Glass-3 (MATCH)
- Mobile menu: `bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%]` = Glass-mobile (MATCH)
- Cards: `bg-white/60 backdrop-blur-2xl` = Glass-4 (MATCH)
- Form container: `bg-white/60 backdrop-blur-3xl` = Glass-5 (CLOSE -- spec says `white/70` for forms but `white/60` is used; minor deviation)
- Footer: `bg-white/60 backdrop-blur-3xl` = Glass-4/5 (MATCH)
- Shadows: `shadow-glass`, `shadow-glass-lg`, `shadow-glass-sm`, `shadow-glass-header`, `shadow-glass-inner`, `shadow-glass-inner-strong` all correctly applied
- Borders: `border border-white/60`, `border-[0.5px] border-white/50` (header) -- all correct

**VIOLATION: [Glassmorphism] [MINOR] [checkup.html, contacts.html]**
Location: Form container
Expected: `bg-white/70` (Glass-5 for form contact)
Actual: `bg-white/60` (Glass-4)
Fix: Change form wrapper `bg-white/60` to `bg-white/70`

### Pillar 4: Spacing & Layout Compliance (checkup 3/4, contacts 3/4, 404 4/4)

**GOOD:** Container `max-w-7xl mx-auto px-4 lg:px-6` used consistently across all pages. Section spacing `py-16` used consistently. Hero `pt-32 pb-16` with `lg:pt-40` on checkup.

**404.html:** `min-h-[80vh] flex items-center justify-center` with `pt-32 pb-16` -- matches spec exactly. Centered layout, correct max-width.

**VIOLATION: [Spacing] [MINOR] [contacts.html]**
Location: contacts.html:131 (coordinator card)
Expected: `p-6` (design system: Coordinator Card spec says `p-6`)
Actual: `p-8`
Fix: Change `p-8` to `p-6` on `.coordinator-card`

**VIOLATION: [Spacing] [MINOR] [contacts.html]**
Location: contacts.html:133 (coordinator avatar)
Expected: `w-32 h-32` (design system: Coordinator Card spec says `w-32 h-32 rounded-full border-4 border-white/60 shadow-glass-sm`)
Actual: `w-28 h-28`
Fix: Change `w-28 h-28` to `w-32 h-32`

**GOOD:** Border radius values match spec:
- Header: `rounded-[2.5rem]` = 40px (MATCH)
- Service/pricing cards: `rounded-[3rem]` = 48px (MATCH)
- Stat cards: `rounded-[2.5rem]` = 40px (MATCH)
- Contact method cards: `rounded-[2rem]` = 32px (MATCH)
- CTA buttons: `rounded-3xl` = 24px (MATCH)
- Header CTA: `rounded-full` (MATCH)
- Inputs: `rounded-2xl` = 16px (MATCH)
- Footer: `rounded-[3rem]` = 48px (MATCH)
- 404 CTA: `rounded-3xl` (MATCH)

**GOOD:** Grid systems correct:
- Contact method cards: `sm:grid-cols-2 gap-4` (MATCH)
- Stats: `grid-cols-2 lg:grid-cols-4 gap-6` (MATCH)
- Contact section: `lg:grid-cols-2 gap-12` (MATCH)
- Footer: `md:grid-cols-2 lg:grid-cols-4 gap-12` (MATCH)

### Pillar 5: Component Compliance (checkup 3/4, contacts 3/4, 404 4/4)

**checkup.html:**

**GOOD:** Pricing cards use `rounded-[3rem]` (MATCH). Popular/highlighted cards correctly use `border-mu-blue/40` with custom glow shadow and gradient badges (lines 347, 365, 476). Standard cards use glass badges with `text-mu-accent-blue` properly.

**VIOLATION: [Component] [MINOR] [checkup.html]**
Location: checkup.html:194 (stat card number)
Expected: `text-mu-accent-blue-text` (accessible #3B6DD0)
Actual: `text-mu-accent-blue` (#4F84E8, ratio 3.50:1 -- FAIL for normal, PASS for large bold at 60px)
Fix: For consistency with design system, use `text-mu-accent-blue-text`

**contacts.html:**

**GOOD:** Contact method cards: `rounded-[2rem]`, `p-6`, icon container `w-10 h-10 rounded-xl` (MATCH spec exactly). Grid `sm:grid-cols-2 gap-4` (MATCH). Form structure correct with proper labels, inputs, honeypot, success overlay.

**VIOLATION: [Component] [MINOR] [contacts.html]**
Location: contacts.html:216, 222, 228, 240 (form inputs)
Expected: `shadow-glass-inner` or `shadow-form-inset` (token-based)
Actual: `shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]` (hardcoded arbitrary value)
Fix: Add `--shadow-form-inset` to theme.css and use `shadow-form-inset` class. Note: checkup.html form (line 699) correctly uses `shadow-glass-inner` instead.

**404.html:**

**EXCELLENT:** All spec requirements met:
- "404" text: `text-8xl font-extrabold bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent` (MATCH)
- H1: `text-3xl font-extrabold` (MATCH)
- CTA: gradient primary with ArrowLeft icon, `rounded-3xl` (MATCH)
- Centered layout with `min-h-[80vh]` (MATCH)

### Pillar 6: Accessibility Compliance (all 1/4)

**VIOLATION: [Accessibility] [CRITICAL] [ALL PAGES]**
Location: Every `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>` across all 3 pages
Expected: `focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none` (design system mandatory requirement)
Actual: Zero `focus-visible` classes found on any interactive element in any of the 3 audited pages
Fix: Add focus-visible ring to ALL interactive elements. For links/buttons: `focus-visible:ring-2 focus-visible:ring-mu-blue/50 focus-visible:ring-offset-2 focus-visible:outline-none`. For form inputs: already have `focus:ring-4 focus:ring-mu-blue/20` which partially covers this, but `focus-visible` is the correct selector for keyboard-only indication.

**GOOD:** ARIA attributes present:
- `aria-hidden="true"` on decorative SVGs and mesh background (all pages)
- `aria-label` on nav elements, mobile menu button, sticky bar
- `aria-expanded="false"` on mobile menu button
- `aria-current="page"` on active nav link (checkup, contacts)
- `role="list"` on feature/checklist `<ul>` elements
- `role="complementary"` on sticky bar
- FAQ buttons have `aria-expanded` (checkup)

**GOOD:** `prefers-reduced-motion` is handled in JS (animations.js:26, main.js:452) but NOT in CSS. Design system recommends CSS-level `@media (prefers-reduced-motion: reduce)` as well.

**VIOLATION: [Accessibility] [MAJOR] [ALL PAGES]**
Location: All nav links, footer links, CTA links
Expected: `hover:text-mu-blue-text` (accessible #0E8FB5, ratio 4.51:1)
Actual: `hover:text-mu-blue` (non-accessible #38C6F4, ratio 1.92:1 -- unreadable on #FBFBFB)
Fix: Change all `hover:text-mu-blue` to `hover:text-mu-blue-text`

**VIOLATION: [Accessibility] [MINOR] [ALL PAGES]**
Location: CSS `@media (prefers-reduced-motion: reduce)` absent
Expected: CSS-level reduced-motion support for mesh background animations, CSS transitions
Actual: Only JS-level handling exists
Fix: Add `@media (prefers-reduced-motion: reduce) { .mesh-bg__blob { animation: none !important; } }` to theme.css or inline styles

---

## Files Audited

- `/Users/mikhail/Projects/Medicus_video_consult-landing/checkup.html` (full file, ~850 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/contacts.html` (full file, ~344 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/404.html` (full file, ~215 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/theme.css` (full file, 269 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN-SYSTEM.md` (full file, ~895 lines)

---

## Summary of Required Token Additions to theme.css

The following tokens are defined in DESIGN-SYSTEM.md but **missing** from `src/styles/theme.css`:

### In `:root {}` block:
```css
--mu-blue-text: #0E8FB5;
--mu-accent-blue-text: #3B6DD0;
--mu-accent-teal-text: #3D7E7A;
--mu-accent-orange-text: #B5621D;
--mu-green-text: #1F7A4F;
--mu-cta-from: #0E8FB5;
--mu-cta-to: #3B6DD0;
/* Also update existing: */
--mu-text-700: #4A4E5C;  /* currently #63687A, FAIL normal text */
--mu-text-500: #6B6F80;  /* currently #A4A8B5, FAIL even large text */
```

### In `@theme inline {}` block:
```css
--color-mu-blue-text: var(--mu-blue-text);
--color-mu-accent-blue-text: var(--mu-accent-blue-text);
--color-mu-accent-teal-text: var(--mu-accent-teal-text);
--color-mu-accent-orange-text: var(--mu-accent-orange-text);
--color-mu-green-text: var(--mu-green-text);
--color-mu-cta-from: var(--mu-cta-from);
--color-mu-cta-to: var(--mu-cta-to);
--shadow-form-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
```

Without these tokens, the accessible color system described in DESIGN-SYSTEM.md cannot be used in Tailwind utility classes.
