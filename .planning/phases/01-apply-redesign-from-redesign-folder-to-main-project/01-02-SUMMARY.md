---
phase: 01-apply-redesign-from-redesign-folder-to-main-project
plan: 02
subsystem: ui
tags: [vanilla-js, motion, animations, form-submission, accordion, phone-mask, directus]

# Dependency graph
requires:
  - phase: none
    provides: standalone JS module (works with any HTML structure using expected selectors)
provides:
  - js/main.js with form submission, accordion, phone mask, spam protection, sticky header, mobile menu, smooth scroll, animated counters
  - js/animations.js with motion-powered entrance animations (fade-up, stagger, fade-left/right, scale-in, hero entrance, header spring)
affects: [01-03 (HTML page structure), 01-04, 01-05 (service pages)]

# Tech tracking
tech-stack:
  added: [motion@12 (CDN, standalone vanilla JS API)]
  patterns: [Motion global via CDN script tag, inView + animate for scroll-triggered entrances, JS-set initial hidden state for graceful degradation]

key-files:
  created: [js/animations.js]
  modified: [js/main.js]

key-decisions:
  - "Motion loaded via CDN global (not ES module) for maximum 45+ audience browser compatibility"
  - "Phone mask targets all input[type=tel] (not just #phone) to support multiple forms"
  - "Form validation uses .contact-form selector with per-form scoped validation for multi-form pages"
  - "Animation initial state set via JS (not CSS) to prevent flash of hidden content if CDN loads slowly"
  - "isSpamSubmission() now takes form parameter for multi-form support"
  - "Error state shows phone fallback number instead of silent success on fetch failure"

patterns-established:
  - "Multi-form pattern: querySelectorAll('.contact-form') with per-form validation rules"
  - "Animation trigger classes: .animate-fade-up, .animate-stagger, .animate-fade-left, .animate-fade-right, .animate-scale-in"
  - "Hero entrance on page load (not scroll) with staggered delays"
  - "prefers-reduced-motion guard at top of animations.js skips all setup"

requirements-completed: [ANIM-01, JS-01, JS-02]

# Metrics
duration: 3min
completed: 2026-04-04
---

# Phase 1 Plan 2: JavaScript Rewrite Summary

**Rewrote js/main.js for new HTML selectors and created js/animations.js with motion@12 CDN-powered entrance animations (fade-up, stagger, hero sequence, header spring)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T04:26:01Z
- **Completed:** 2026-04-04T04:28:48Z
- **Tasks:** 2
- **Files modified:** 2 (1 rewritten, 1 created)

## Accomplishments
- Rewrote js/main.js: preserved accordion, phone mask, spam protection, form submission to Directus; added sticky header (.header--scrolled), mobile menu overlay, smooth scroll; updated counters for .stat-card__number[data-target]; removed dark mode, old scroll animations, scroll progress, card tilt, sticky bar
- Created js/animations.js: motion-powered entrance animations using Motion global from CDN -- fade-up, staggered card entrance, hero sequence with 5 staggered elements + photos scale-in + floating badges, header spring entrance, fade-left/right, scale-in; prefers-reduced-motion guard; JS-set initial hidden state for graceful degradation

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite js/main.js for new HTML structure** - `0f1bfa7` (feat)
2. **Task 2: Create js/animations.js with motion-powered entrance animations** - `a51e4fc` (feat)

## Files Created/Modified
- `js/main.js` - Core JS: form submission (.contact-form), accordion (.faq__question), phone mask (input[type=tel]), spam protection, sticky header (.header--scrolled), mobile menu (.mobile-menu-overlay), smooth scroll, animated counters (.stat-card__number[data-target])
- `js/animations.js` - Motion-powered entrance animations: fade-up, stagger, fade-left/right, scale-in, hero entrance sequence, header spring entrance

## Decisions Made
- Used Motion global from CDN (`window.Motion`) instead of ES module import for maximum browser compatibility with 45+ target audience
- Phone mask now targets all `input[type="tel"]` elements (not just `#phone`) to support multiple forms on a page
- Form validation refactored to support multiple `.contact-form` instances via querySelectorAll + per-form scoped rules
- On fetch error, show error message with phone fallback (+7 701 532 24 78) instead of silently showing success -- better UX for real users while still silently succeeding for spam bots
- Animation initial hidden state set via JS (opacity:0, transform) rather than CSS classes -- prevents flash of hidden content if CDN script loads slowly; content remains visible by default if JS fails entirely
- isSpamSubmission() takes form parameter for per-form honeypot checking in multi-form scenarios

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Error state shows phone fallback instead of silent success**
- **Found during:** Task 1 (form submission rewrite)
- **Issue:** Plan specified error display with message, but original code showed success on error. Changed to show actual error with phone number fallback, which is better UX for real users. Spam bots still get silent success via the spam check.
- **Fix:** On fetch catch, re-enable submit button and display error message with phone number
- **Files modified:** js/main.js
- **Verification:** Code review confirms error path shows message, spam path shows success
- **Committed in:** 0f1bfa7

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Minor improvement to error handling UX. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- JS modules ready for HTML structure (plan 01-03)
- js/main.js expects: .header, .header__menu-btn, .mobile-menu-overlay, .contact-form, .form__submit, .form__success, .form__error, .faq__question, .stat-card__number[data-target], input[type="tel"]
- js/animations.js expects: .animate-fade-up, .animate-stagger, .animate-fade-left, .animate-fade-right, .animate-scale-in, .hero__badge, .hero__title, .hero__subtitle, .hero__buttons, .hero__trust, .hero__photos, .hero__floating-badge, .header
- motion@12 CDN script tag must appear BEFORE animations.js in HTML

## Self-Check: PASSED

- [x] js/main.js exists
- [x] js/animations.js exists
- [x] 01-02-SUMMARY.md exists
- [x] Commit 0f1bfa7 exists (Task 1)
- [x] Commit a51e4fc exists (Task 2)

---
*Phase: 01-apply-redesign-from-redesign-folder-to-main-project*
*Completed: 2026-04-04*
