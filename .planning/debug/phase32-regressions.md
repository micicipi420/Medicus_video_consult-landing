---
status: awaiting_human_verify
trigger: "Two regressions after Phase 32: SVG placeholders instead of real photos, FAQ accordion broken"
created: 2026-04-05T19:30:00Z
updated: 2026-04-05T20:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - FAQ CSS selector mismatch is the sole actionable regression
test: Fix applied to all 5 HTML files, awaiting human verification
expecting: FAQ accordion should expand/collapse on click
next_action: User verifies FAQ works on localhost:4000

## Symptoms

expected: Pages should show real WebP photos (loaded from img/ folder) and FAQ sections should expand/collapse on click
actual: SVG illustrations appear where photos should be, and FAQ accordion buttons don't toggle answers
errors: No error messages reported — visual regression + broken interactivity
reproduction: Visit any page on http://localhost:4000/ — check hero images and FAQ sections
started: After Phase 32 changes (commits 2661f0a and 9f0749d)

## Eliminated

- hypothesis: Phase 32 mass find-replace corrupted img tags or image sources
  evidence: git diff shows zero changes to img tags. All WebP files exist and are valid. index.html and online-consultations.html use real WebP photos in hero sections.
  timestamp: 2026-04-05T19:35:00Z

- hypothesis: Phase 32 changes broke JS selectors for FAQ
  evidence: Phase 32 did not change js/main.js. The .faq__question selector is correct in all HTML files. The JS code is unchanged from before Phase 32.
  timestamp: 2026-04-05T19:38:00Z

- hypothesis: SVG placeholder images are a Phase 32 regression
  evidence: treatment-abroad.html and checkup.html have ALWAYS used inline SVG illustrations in hero sections (verified via git show 2661f0a~1). These were never WebP photos. Not a Phase 32 regression — pre-existing design choice.
  timestamp: 2026-04-05T19:40:00Z

## Evidence

- timestamp: 2026-04-05T19:35:00Z
  checked: git diff of Phase 32 commits for img-related changes
  found: Zero changes to img tags, srcset, or image paths in any Phase 32 commit
  implication: Images are not affected by Phase 32

- timestamp: 2026-04-05T19:36:00Z
  checked: WebP files in img/ folder
  found: All 11 WebP files exist and are valid RIFF WebP images
  implication: Image files are intact

- timestamp: 2026-04-05T19:37:00Z
  checked: treatment-abroad.html and checkup.html hero sections
  found: Both use inline SVG illustrations (viewBox="0 0 400 400") not img tags. This was true before Phase 32.
  implication: SVG "placeholder" issue is pre-existing, not a regression

- timestamp: 2026-04-05T19:40:00Z
  checked: FAQ inline CSS in all pages
  found: All pages have `.faq__item.is-open .faq__answer { max-height: 500px; }` — expects is-open on PARENT .faq__item
  implication: CSS selector doesn't match JS behavior

- timestamp: 2026-04-05T19:42:00Z
  checked: JS initAccordion() in main.js
  found: JS adds/removes is-open on the ANSWER element (button.nextElementSibling), NOT on the parent .faq__item
  implication: CSS and JS are mismatched — accordion will never open

- timestamp: 2026-04-05T19:43:00Z
  checked: Original CSS at commit 3bef8f9 (Phase 10-03)
  found: Original rule was `.faq__answer.is-open { max-height: 500px; }` — class directly on answer element
  implication: Original CSS matched the JS correctly

- timestamp: 2026-04-05T19:44:00Z
  checked: Commit e697708 (Phase 25-05 Tailwind migration)
  found: CSS was migrated from external file to inline <style> and INCORRECTLY changed from `.faq__answer.is-open` to `.faq__item.is-open .faq__answer`
  implication: This is the root cause — introduced in Phase 25-05, not Phase 32

- timestamp: 2026-04-05T20:00:00Z
  checked: Current working tree state (uncommitted changes)
  found: Fix already applied to all 5 HTML files — `.faq__item.is-open .faq__answer` changed to `.faq__answer.is-open` in index.html, online-consultations.html, treatment-abroad.html, checkup.html, 404.html
  implication: Fix is complete and ready for verification

## Resolution

root_cause: |
  TWO ISSUES (one regression, one pre-existing):
  
  1. FAQ ACCORDION (REGRESSION from Phase 25-05, not Phase 32):
     In commit e697708, the FAQ CSS was migrated from external file to inline <style> blocks.
     During migration, the selector was incorrectly changed from `.faq__answer.is-open` to
     `.faq__item.is-open .faq__answer`. The JS in main.js adds `is-open` to the answer element
     directly (button.nextElementSibling), not to the parent .faq__item. This mismatch means
     the CSS max-height transition never triggers — answers stay at max-height: 0.
  
  2. SVG ILLUSTRATIONS (NOT A REGRESSION):
     treatment-abroad.html and checkup.html have always used inline SVG illustrations in their
     hero sections. These were built this way from the start — they never had WebP photos.
     index.html and online-consultations.html do use real WebP photos.

fix: Changed CSS selector from `.faq__item.is-open .faq__answer` to `.faq__answer.is-open` in all 5 HTML pages with inline FAQ styles
verification: Fix applied to working tree. JS adds is-open to .faq__answer elements directly; CSS now correctly targets .faq__answer.is-open for max-height transition.
files_changed:
  - index.html
  - online-consultations.html
  - treatment-abroad.html
  - checkup.html
  - 404.html
