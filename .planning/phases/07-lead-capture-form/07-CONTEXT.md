# Phase 7: Lead Capture Form - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the form placeholder (Phase 6) with the actual lead capture form. 4 fields, phone mask, client-side validation, success state, honeypot spam protection. Form submits to Directus API (Phase 8 wires the actual backend — this phase creates the form UI and validation logic with a configurable endpoint).

</domain>

<decisions>
## Implementation Decisions

### Form Fields (FORM-01)
- Имя (text, required)
- Телефон (tel, required, with +7 prefix)
- Специализация (select dropdown, required)
- Кратко о вашем случае (textarea, optional)

### Phone Input (FORM-02)
- Pre-filled +7 prefix that stays visible
- Input mask: +7 (XXX) XXX-XX-XX
- Validates Kazakhstan phone numbers (11 digits total with +7)
- `type="tel"` for mobile numeric keyboard

### Specialization Dropdown (FORM-03)
- Options: Онкология, Кардиология, Нейрохирургия, Ортопедия, Радиология, ЭКО, Другое
- Default: empty with placeholder «Выберите специализацию»

### Validation (FORM-04)
- Client-side validation on submit
- Error messages in Russian under each invalid field
- Red border on invalid fields
- Messages: «Укажите ваше имя», «Укажите номер телефона», «Выберите специализацию»

### Success State (FORM-05)
- After successful submission: hide form, show success message
- Message: «Спасибо! Мы свяжемся с вами в течение 24 часов.»
- Green checkmark icon

### Micro-copy (FORM-06)
- Under form: «Мы перезвоним в течение 24 часов. Ваши данные защищены.»
- Near submit button: «Бесплатно и без обязательств»

### Spam Protection (FORM-07)
- Honeypot: hidden field that bots fill but humans don't
- Time-based check: form must be on page > 3 seconds before submit is valid
- Both checks in JS before submission

### Submit Button
- Text: «Отправить заявку»
- Uses .button--primary style
- Full width on mobile

### Claude's Discretion
- Phone mask implementation approach (input event vs library)
- Exact error styling (tooltip vs inline message)
- Success state animation
- Form layout (single column vs two-column on desktop)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- .button--primary from Phase 1
- .section, .container layout
- js/main.js with initAll() pattern — extend with form functions
- Form placeholder section exists with id="form"

### Integration Points
- Replace form placeholder content in index.html
- Add form validation and submission logic to js/main.js
- Form submits to configurable API_URL (set in Phase 8)

</code_context>

<specifics>
## Specific Ideas

- Form is the conversion point — everything on the page leads here
- Keep form simple: 4 fields max, no multi-step
- Phone is the primary contact channel for 45+ audience
- Form action URL will be configured in Phase 8 (Directus)

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
