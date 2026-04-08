---
phase: 35
plan: 35
subsystem: checkup-html, form-validation, css
tags: [typography, form-ux, accessibility, blur-first, user-valid]
dependency_graph:
  requires: []
  provides: [CHKPOL-01, CHKPOL-02, CHKPOL-03, CHKPOL-04, CHKPOL-05, CHKPOL-06, CHKPOL-07, CHKPOL-08]
  affects: [checkup.html, index.html, online-consultations.html, treatment-abroad.html, contacts.html, js/main.js, src/styles/theme.css, css/styles.css]
tech_stack:
  added: [":user-valid CSS pseudo-class (Baseline 2023)"]
  patterns: ["blur-first validation with dataset.touched sentinel", "aria-invalid toggling on blur/input"]
key_files:
  created: []
  modified:
    - checkup.html
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - contacts.html
    - js/main.js
    - src/styles/theme.css
    - css/styles.css
decisions:
  - "Used lg:block (not md:block) for H1 br — overflow starts at 1024px, md:block would break at 768px unnecessarily"
  - "Chose Помогите выбрать over Пока не выбрал(а) — shorter, gender-free, more actionable"
  - "Added :user-valid rule to theme.css @layer base — index.css is a reference file only, not imported in tailwind.css"
  - "blur-first via dataset.touched sentinel keeps ES5 IIFE constraint and is idempotent across router reinit"
metrics:
  duration: "~25 min"
  completed: "2026-04-07"
  tasks: 3
  files: 8
---

# Phase 35: Checkup Fix + Form UX Polish — Summary

Checkup H1 overflow fixed with responsive `<br class="hidden lg:block">`, form H2 hierarchy reduced, gender-specific option copy replaced, and all 5 forms upgraded with native `:user-valid` green-border feedback, blur-first validation timing, `aria-invalid` toggling, and `max-w-[280px]` error containers.

## Tasks Completed

### Task 1 — checkup.html typography + copy (CHKPOL-01, 02, 03)

**CHKPOL-01:** Inserted `<br class="hidden lg:block">` at `checkup.html:129` (between the plain-text span and the gradient brand-name span). Breakpoint is `lg` (1024px) — the overflow only occurs at desktop widths; `md:block` would have introduced an unnecessary break at 768px. No `min-h`, `text-*xl`, or hero section classes were touched.

**CHKPOL-02:** Form section H2 at `checkup.html:642` was `text-4xl md:text-5xl` — downgraded to `text-3xl md:text-4xl` to reduce hierarchy collision with the H1. The cross-sell CTA H2 at line 729 also uses `text-4xl md:text-5xl` but is outside the form section scope and was left as-is.

**CHKPOL-03:** `checkup.html:691` changed from `Не определился` to `Помогите выбрать`. Site-wide grep for `-лся\b`, `-ил\b`, `-ал\b` in form option/placeholder/button/label elements across all 5 HTML files returned no additional hits. One fix total.

### Task 2 — :user-valid CSS + blur-first validation + aria-invalid + error containers (CHKPOL-04..08)

**CHKPOL-04:** `:user-valid` rule added to `src/styles/theme.css` in a new `@layer base` block:
```css
.contact-form input:user-valid,
.contact-form select:user-valid,
.contact-form textarea:user-valid {
  border-left: 3px solid var(--mu-green-600);
  transition: border-color 200ms ease-out;
}
```
`--mu-green-600` confirmed present in theme.css (value: `#35B678`). Tailwind CLI rebuild completed in 93ms. Verified rule in `css/styles.css` output — confirmed present.

**CHKPOL-05 + CHKPOL-06:** `js/main.js` per-field listener block replaced with blur-first pattern. Each field gets a `blur` (or `change` for SELECT) listener that sets `dataset.touched = '1'` and runs `rule.validate()`. The `input` listener only re-validates if `dataset.touched` is already set and the field now passes. Phone field naturally gets blur-only error display via the same pattern (CHKPOL-06 covered without extra code). Form-level submit validation at line 375 preserved unchanged. ES5 syntax strictly maintained — no arrow functions, no `let/const`, no template literals.

**CHKPOL-07:** All 3 Russian error messages were already under 30 chars (verified: "Укажите ваше имя" = 16, "Укажите номер телефона" = 22, "Выберите вариант" = 16). No content changes needed. `max-w-[280px]` added to all `.form__field-error` spans via `replace_all` — 15 spans total across 5 files (3 per form): `checkup.html`, `index.html`, `online-consultations.html`, `treatment-abroad.html`, `contacts.html`. `aria-live="polite"` preserved on all spans.

**CHKPOL-08:** `aria-invalid="true"` set on blur when field is invalid; `aria-invalid="false"` set on blur when valid or on input once field is touched and valid. No sr-only span approach used — aria-invalid toggling alone satisfies the screen-reader transition announcement requirement without markup bloat.

## Commits

| Hash | Message |
|------|---------|
| `07b99a9` | fix(35): checkup H1 lg:br + H2 hierarchy + gender-neutral form option (CHKPOL-01, 02, 03) |
| `b61ef7e` | feat(35): :user-valid CSS + blur-first validation + aria-invalid + max-w error containers (CHKPOL-04..08) |

## Deviations from Plan

### Deviation 1 — lg:block instead of md:block for CHKPOL-01

The CONTEXT.md noted `hidden md:block` as the proposed value, but gave discretion on breakpoint. Execution used `hidden lg:block` per the task spec (which correctly identifies that overflow starts at 1024px). This matches the plan task description exactly and is the correct choice.

### Deviation 2 — :user-valid added to theme.css, not index.css

`src/styles/index.css` is a reference/comment file only — it is not imported by `src/styles/tailwind.css`. The rule was placed in `theme.css` within a new `@layer base` block adjacent to the existing `@layer base` block. This is the correct location for the build to pick it up.

### Deviation 3 — CHKPOL-08 uses aria-invalid exclusively, no sr-only spans

The REQUIREMENTS.md described adding `<span class="sr-only">поле заполнено</span>` per field. The task spec explicitly overrode this: "use aria-invalid exclusively" to avoid markup bloat. aria-invalid toggling on validation transitions satisfies screen-reader announcement requirements with zero additional markup.

## Known Stubs

None. All form validation is fully wired. `:user-valid` is a native browser pseudo-class with no JS dependency for the trigger.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes introduced. Form submission endpoint unchanged.

## Self-Check: PASSED

- `checkup.html` H1 br present: confirmed (line 129)
- `checkup.html` form H2 downgraded: confirmed (line 642, text-3xl md:text-4xl)
- `checkup.html:691` option text changed: confirmed (Помогите выбрать)
- `css/styles.css` contains `:user-valid` rule: confirmed
- `js/main.js` blur-first pattern: confirmed (dataset.touched sentinel, aria-invalid toggling)
- All 15 `.form__field-error` spans have `max-w-[280px]`: confirmed (3 per file × 5 files)
- Commits `07b99a9` and `b61ef7e` exist on branch feat/v3.1
