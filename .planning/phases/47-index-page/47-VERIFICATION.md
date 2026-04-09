---
phase: 47-index-page
verified: 2026-04-09T00:00:00Z
status: gaps_found
score: 4/5 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Hero CTA has shimmer sweep animation on hover (DIFF-01 surface applied); scroll-edge fade (DIFF-03) visible at chrome/content overlap boundaries"
    status: partial
    reason: "shimmer-sweep is applied to hero CTA (DIFF-01 satisfied). scroll-edge fade (DIFF-03) class exists in liquid-glass.css but is applied to zero HTML elements -- no page, no partial uses scroll-fade-top or scroll-fade-bottom anywhere in the codebase. SC-4 requires it to be 'visible at chrome/content overlap boundaries', not merely defined."
    artifacts:
      - path: "index.html"
        issue: "scroll-fade-top / scroll-fade-bottom class applied 0 times; grep returns no matches across all 6 HTML files and all partials"
      - path: "src/styles/liquid-glass.css"
        issue: "Classes are defined (lines 194-203) but never consumed"
    missing:
      - "Apply scroll-fade-bottom to the sticky header partial or header.html at the bottom edge where header overlaps page content"
      - "OR apply scroll-fade-top to a content section that scrolls under the chrome header"
      - "Verify at least one instance of scroll-fade-top or scroll-fade-bottom is visible in the rendered page"
human_verification:
  - test: "Open index.html in browser, scroll down slowly from the top"
    expected: "A gradient fade is visible at the top/bottom edge where chrome (sticky header or sticky-bar) overlaps content -- the content fades to transparent as it slides under the chrome element"
    why_human: "Visual effect depends on correct stacking context and z-index interaction between the chrome partial and page content; cannot be verified by grep or static analysis"
  - test: "Hover over the green primary CTA button in the hero section"
    expected: "A shimmer sweep animation (a glinting highlight) travels across the button surface on hover"
    why_human: "CSS ::before animation on hover state -- requires interactive browser inspection to confirm the shimmer-sweep pseudo-element transitions are rendering correctly"
  - test: "Open index.html in dark mode (toggle via header button or DevTools)"
    expected: "Glass surfaces (liquid-card, stats-glass, FAQ items, floating badges) show the dark glass recipe -- darker tint, higher blur -- with no 'murky navy smear' artifact"
    why_human: "Dark mode appearance depends on CSS variable cascade; requires visual inspection"
---

# Phase 47: Index Page Verification Report

**Phase Goal:** index.html (the highest-complexity page with 13 sections) is fully migrated to v4.0 design language, and the responsive grid system is verified working on all 6 pages (with index being the hardest case)
**Verified:** 2026-04-09
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| #   | Truth                                                                                                                                                             | Status          | Evidence                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | index.html uses full grid + liquid + squircle treatment across all 13 sections, including floating hero cards, glass stat bar, service/FAQ/form/CTA sections       | ✓ VERIFIED      | squircle=82, liquid-card=56, liquid-card-wrap=27, shimmer-sweep=1, stats-glass=1, grid-cols-12=8, max-w-[1200px]=13    |
| 2   | Mesh-bg blob compatibility maintained; icon chip rotate-vs-squircle resolved (squircle skipped on rotated chips)                                                  | ✓ VERIFIED      | Blobs at fixed z-0, main at z-10; 15 rotating chips all retain rounded-2xl/rounded-[1.5rem]; no squircle on any chip  |
| 3   | GRID-02 verified: text-bearing cards occupy minimum 4 columns on tablet across ALL 6 pages; no md:col-span-3 on text cards                                        | ✓ VERIFIED      | index=23, checkup=41, online=22, treatment=30, contacts=2 md:col-span- instances; 0 md:col-span-3 across all pages     |
| 4   | Hero CTA has shimmer sweep on hover (DIFF-01); scroll-edge fade (DIFF-03) visible at chrome/content overlap boundaries                                            | ✗ FAILED        | shimmer-sweep applied at line 242 (DIFF-01 satisfied). scroll-fade-top / scroll-fade-bottom: 0 matches across all HTML |
| 5   | Per-page migration gates pass: nbsp=83, ARIA counts correct, honeypot present, text-balance=0; make build exits 0                                                 | ✓ VERIFIED      | nbsp=83, visually-hidden=2, role="alert"=4, aria-live=4, contact-website=2, text-balance=0; make build exits 0        |

**Score:** 4/5 truths verified

### Required Artifacts

| Artifact           | Expected                                      | Status       | Details                                                                 |
| ------------------ | --------------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `index.html`       | All 13 sections migrated to v4.0 design language | ✓ VERIFIED   | 82 squircle-* uses, 56 liquid-card uses, zero v3.x rounded-[Xrem] in main |
| `css/styles.css`   | Rebuilt Tailwind output with v4.0 utility classes | ✓ VERIFIED   | make build exits 0; CSS includes all squircle, liquid, shimmer classes  |

### Key Link Verification

| From                          | To                              | Via                       | Status       | Details                                                            |
| ----------------------------- | ------------------------------- | ------------------------- | ------------ | ------------------------------------------------------------------ |
| index.html hero CTA           | liquid-glass.css .shimmer-sweep | class="shimmer-sweep"     | ✓ WIRED      | Line 242: `liquid-btn-primary squircle-md shimmer-sweep`           |
| index.html stats section      | liquid-glass.css .stats-glass   | class="stats-glass squircle-xl" | ✓ WIRED | Line 298: `<div class="stats-glass squircle-xl">`                 |
| index.html form section       | Form submission JS              | class="contact-form"      | ✓ WIRED      | 1 match for contact-form in form element                           |
| index.html FAQ section        | FAQ accordion JS                | class="faq__item"         | ✓ WIRED      | 7 faq__item elements (7 questions)                                 |
| liquid-glass.css .scroll-fade | index.html chrome overlap       | class="scroll-fade-*"     | ✗ NOT WIRED  | 0 uses of scroll-fade-top or scroll-fade-bottom in all 6 HTML files and all partials |

### Data-Flow Trace (Level 4)

Not applicable — this is a CSS migration phase. No data-fetching components modified; form submission JS wiring unchanged from prior phases.

### Behavioral Spot-Checks

| Behavior                                        | Command                                                           | Result | Status  |
| ----------------------------------------------- | ----------------------------------------------------------------- | ------ | ------- |
| make build exits 0                              | `make build`                                                      | 0      | ✓ PASS  |
| nbsp count = 83                                 | `grep -c '&nbsp;' index.html`                                     | 83     | ✓ PASS  |
| visually-hidden count = 2                       | `grep -c 'visually-hidden' index.html`                            | 2      | ✓ PASS  |
| role="alert" count = 4                          | `grep -c 'role="alert"' index.html`                               | 4      | ✓ PASS  |
| aria-live count = 4                             | `grep -c 'aria-live' index.html`                                  | 4      | ✓ PASS  |
| honeypot count = 2                              | `grep -c 'contact-website' index.html`                            | 2      | ✓ PASS  |
| text-balance count = 0                          | `grep -c 'text-balance' index.html`                               | 0      | ✓ PASS  |
| shimmer-sweep present                           | `grep -c 'shimmer-sweep' index.html`                              | 1      | ✓ PASS  |
| stats-glass present                             | `grep -c 'stats-glass' index.html`                                | 1      | ✓ PASS  |
| squircle classes >= 50                          | `grep -c 'squircle-' index.html`                                  | 82     | ✓ PASS  |
| liquid-card >= 30                               | `grep -c 'liquid-card' index.html`                                | 56     | ✓ PASS  |
| liquid-btn-primary >= 3                         | `grep -c 'liquid-btn-primary' index.html`                         | 3      | ✓ PASS  |
| liquid-btn-secondary >= 3                       | `grep -c 'liquid-btn-secondary' index.html`                       | 5      | ✓ PASS  |
| max-w-[1200px] >= 11                            | `grep -c 'max-w-\[1200px\]' index.html`                           | 13     | ✓ PASS  |
| grid-cols-12 >= 8                               | `grep -c 'grid-cols-12' index.html`                               | 8      | ✓ PASS  |
| group-hover:rotate-3 = 15 (no squircle on chips) | `grep -c 'group-hover:rotate-3' index.html`                      | 15     | ✓ PASS  |
| container mx-auto in main = 0                   | `sed -n '/<main/,/<\/main>/p' index.html \| grep -c 'container mx-auto'` | 0 | ✓ PASS |
| rounded-[3rem] in main = 0                      | `sed -n '/<main/,/<\/main>/p' index.html \| grep -c 'rounded-\[3rem\]'` | 0 | ✓ PASS |
| scroll-fade usage across all HTML               | `grep -rn 'scroll-fade' *.html partials/`                         | 0      | ✗ FAIL  |
| GRID-02: index md:col-span- >= 20               | `grep -c 'md:col-span-' index.html`                               | 23     | ✓ PASS  |
| GRID-02: checkup md:col-span- >= 38             | `grep -c 'md:col-span-' checkup.html`                             | 41     | ✓ PASS  |
| GRID-02: online md:col-span- >= 19              | `grep -c 'md:col-span-' online-consultations.html`                | 22     | ✓ PASS  |
| GRID-02: treatment md:col-span- >= 20           | `grep -c 'md:col-span-' treatment-abroad.html`                    | 30     | ✓ PASS  |
| GRID-02: contacts md:col-span- >= 2             | `grep -c 'md:col-span-' contacts.html`                            | 2      | ✓ PASS  |
| GRID-02: md:col-span-3 on text cards = 0        | `grep -rh 'md:col-span-3' *.html`                                 | 0      | ✓ PASS  |

### Requirements Coverage

| Requirement | Source Plan | Description                                                             | Status      | Evidence                                                                                               |
| ----------- | ----------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| MIGRATE-06  | 47-01, 47-02 | index.html full v4.0 migration (grid + liquid + squircle, all 13 sections) | ✓ SATISFIED | 82 squircle classes, 56 liquid-card uses, 0 v3.x rounded-[Xrem] in main, build passes                |
| GRID-02     | 47-02       | Text-bearing cards occupy min 4 columns on tablet breakpoint across all 6 pages | ✓ SATISFIED | All 6 pages verified: 0 md:col-span-3 on text cards; all pages meet minimum md:col-span counts       |

**Note on v4.0 REQUIREMENTS.md:** No standalone v4.0 REQUIREMENTS.md file exists. The IDs MIGRATE-06 and GRID-02 are defined only within ROADMAP.md Phase 47 section and referenced in plan frontmatter. The requirement definitions were verified against ROADMAP.md directly.

### Anti-Patterns Found

| File         | Pattern                          | Severity    | Impact                                                                                               |
| ------------ | -------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `index.html` | scroll-fade-top/bottom not applied | ✗ Blocker   | SC-4 requires DIFF-03 to be visible at chrome/content overlap boundaries; class is defined but unused |

No other anti-patterns found. No TODO/FIXME/placeholder comments. No empty implementations. No hardcoded empty data arrays. All card sections have substantive content.

### Human Verification Required

### 1. Scroll-Edge Fade Visibility (after gap is fixed)

**Test:** Apply scroll-fade-bottom to the sticky header or appropriate chrome element, then open index.html and scroll the page
**Expected:** Content fades out at the bottom edge of the header as it slides under the chrome element — a gradient mask-image fade is visible
**Why human:** CSS mask-image behavior at stacking context boundaries cannot be verified by static analysis; requires visual browser inspection

### 2. Shimmer-Sweep Animation

**Test:** Open index.html in browser, hover over the green "Получить консультацию" button in the hero section
**Expected:** A glinting highlight travels across the button from left to right on hover
**Why human:** CSS ::before pseudo-element animation requires interactive inspection; the class is applied (verified by grep) but animation quality and visibility depend on browser rendering

### 3. Dark Mode Glass Appearance

**Test:** Toggle dark mode via the header button, inspect glass surfaces (cards, FAQ items, stats bar, floating badges)
**Expected:** Glass surfaces show the dark recipe (dark tint, higher blur, no murky navy smear artifact)
**Why human:** Dark mode CSS cascade requires visual inspection; cannot be verified programmatically

## Gaps Summary

**1 gap blocking full goal achievement.**

**Root cause:** DIFF-03 (scroll-edge fade) was implemented as a CSS class in Phase 43 and listed as a Success Criterion for Phase 47, but was never applied to any HTML element during Phase 47 execution. The plans mention the class in the interfaces section (47-01-PLAN.md line 73) but neither plan's tasks include an instruction to apply it to any element. The class is defined, built into css/styles.css, but has zero consumers across all 6 pages and all partials.

**Scope of fix:** Small. Apply `scroll-fade-bottom` (or `scroll-fade-top`) to the appropriate element where chrome overlaps content. The likely candidate is the sticky bar partial or a section that scrolls under the fixed header. One or two elements need the class added. The CSS is already compiled and available.

**Everything else passes.** All 13 sections of index.html are fully migrated. All v3.x rounded-[Xrem] classes are removed from main. All protected legacy is preserved exactly. GRID-02 is verified across all 6 pages. The build is green. DIFF-01 (shimmer) and DIFF-02 (stats-glass) are both applied and wired.

---

_Verified: 2026-04-09_
_Verifier: Claude (gsd-verifier)_
