# Phase 35: Checkup Fix + Form UX Polish - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Auto-generated (concrete, phase is architecturally safe)

<domain>
## Phase Boundary

Fix `checkup.html` H1 overflow at 1024–1440px via typography-only changes (responsive `<br>`), adjust H2 hierarchy, replace gender-specific form copy, and upgrade form UX across all 5 forms: native `:user-valid` CSS feedback + blur-first validation timing + ≤30-char Russian error messages. Zero `min-h` touches on hero (Phase 38 owns that).

</domain>

<decisions>
## Implementation Decisions

### CHKPOL-01 Checkup H1 overflow fix (typography-only)
- **Current (verified at checkup.html:128-132):**
  ```html
  <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
    <span class="text-mu-text-900">Проверьте здоровье в&nbsp;</span>
    <span class="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">Samsung&nbsp;Medical&nbsp;Center и&nbsp;Severance&nbsp;Hospital</span>
    <span class="text-mu-text-900">&nbsp;&mdash;&nbsp;за&nbsp;1&ndash;2&nbsp;дня</span>
  </h1>
  ```
- **Fix:** Insert responsive `<br class="hidden md:block">` after "в&nbsp;" to force the gradient phrase onto its own line at desktop widths. Mobile (below md) continues to wrap naturally.
- **Do NOT** touch `min-h`, `text-*xl` classes, or `leading-[1.1]` — they belong to the hero sizing system (Phase 38 ownership).

### CHKPOL-02 Form H2 hierarchy — SCOPE CHECK NEEDED
- Plan mentions `text-4xl md:text-5xl` → `text-3xl md:text-4xl` on checkup form H2
- Verify during execution whether the form H2 actually uses these classes (may already be different)

### CHKPOL-03 Gender-neutral form copy
- **Verified at checkup.html:691:** `<option value="not-sure">Не определился</option>`
- **Fix:** `<option value="not-sure">Пока не выбрал(а)</option>` OR `Помогите выбрать` (shorter, gender-free noun phrase)
- **Recommended:** `Помогите выбрать` — clearer call-to-action, naturally gender-free
- **Site-wide audit:** Grep all HTML files for `-лся\b|-ил\b|-ал\b` past-tense forms in form option/placeholder/button text. Fix any additional hits.

### CHKPOL-04 `:user-valid` visual feedback across all 5 forms
- **Native CSS pseudo-class** (Baseline 2023): `input:user-valid { ... }` fires only after blur or submit, not on every input. Zero JS changes needed for the trigger.
- **Visual treatment:** Green left border (NOT checkmark icon per MOD-05 — avoid "submitted" misread)
- **Proposed CSS rule** (add to `src/styles/index.css` or inline in theme.css):
  ```css
  .contact-form input:user-valid,
  .contact-form select:user-valid,
  .contact-form textarea:user-valid {
    border-left: 3px solid var(--mu-green-600);
    transition: border-color 200ms ease-out;
  }
  ```
- **Do NOT** use `:valid` alone — that triggers on every input keystroke, causing flicker.

### CHKPOL-05 Blur-first validation timing
- **Current pattern (verified js/main.js:351-358):** Event listener fires on `input`/`change`, calls `clearFieldError(key)`. No validation trigger — only cleared on input.
- **Fix:** Change the per-field listener to:
  - On `blur` → run rule.validate(), if invalid call showFieldError; set `dataset.touched = '1'`
  - On `input` → if `dataset.touched` is set AND field now passes, call `clearFieldError`; else do nothing
- **Form-level submit validation (line 375) stays as-is.**

### CHKPOL-06 Phone mask blur-only
- Phone rule at js/main.js:278-288 already uses `validate` function that checks 11 digits starting with 7.
- Under the new blur-first pattern (CHKPOL-05), phone will naturally only show error on blur. No additional work needed beyond CHKPOL-05.

### CHKPOL-07 Russian error messages ≤30 chars + container width
- **Current error messages (verified js/main.js:270, 282, 295):**
  - `"Укажите ваше имя"` (16 chars) ✓
  - `"Укажите номер телефона"` (22 chars) ✓
  - `"Выберите вариант"` (16 chars) ✓
- All already under 30 chars. No content changes needed.
- **Container width cap:** Add `max-w-[280px]` class to `.form__field-error` span elements in all 5 forms. Grep to find all instances.

### CHKPOL-08 SR-only success + aria-live transitions
- Add `<span class="sr-only" data-valid-label>поле заполнено</span>` next to each `.form__field-error` in each form
- Modify showFieldError/clearFieldError + new showFieldValid/clearFieldValid to toggle `aria-invalid` attribute on the field
- aria-live region stays at error container; only fires on transition events (valid→invalid OR invalid→valid), not on every keystroke

### Claude's Discretion
- Exact `<br>` breakpoint for CHKPOL-01 (`hidden md:block` vs `hidden lg:block`) — pick based on visual verification during execution
- Whether to split PLAN into multiple files (HTML fixes vs JS changes vs CSS addition)
- Form error container `max-w-[280px]` exact Tailwind class (already using arbitrary value syntax per project convention)

</decisions>

<code_context>
## Existing Code Insights

### Files touched
- `checkup.html` — H1 (line 128-132), form H2 (TBD), gender-neutral option (line 691), form error spans
- `index.html` — form error spans
- `online-consultations.html` — form error spans
- `treatment-abroad.html` — form error spans
- `contacts.html` — form error spans
- `js/main.js` — `initFormValidation()` function (lines 254-430), new valid-state functions, blur-first timing
- `src/styles/theme.css` OR `src/styles/index.css` — `:user-valid` CSS rule
- Build: requires `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify` rebuild after theme.css change

### Reusable patterns
- `.is-invalid` class already exists with error styling (check theme.css or index.css for the rule)
- `.form__field-error` span already wrapped per field
- v3.0 `role="alert" aria-live="polite"` on error containers
- ES5 IIFE pattern strict — no arrow functions, no `let/const`, no template literals (per CLAUDE.md constraint)

### Reality checks
- Site has a `js/router.js` SPA router that reinits JS per page navigation. `initFormValidation` is called via `MU.reinitPageContent` per router.js:277. Any new init code must be idempotent.

</code_context>

<specifics>
## Specific Ideas

- Use `:user-valid` (Baseline 2023) over custom blur-tracking where possible — native is simpler
- Single CSS rule can cover all 5 forms via `.contact-form` selector
- Gender-neutral "Помогите выбрать" is more actionable than "Пока не выбрал(а)"

</specifics>

<deferred>
## Deferred Ideas

- Phone input mask library (current regex approach works)
- Multi-step form wizard (post-v3.1)
- Submit button loading spinner (already has text swap)

</deferred>
