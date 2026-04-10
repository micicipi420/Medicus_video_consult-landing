---
phase: 19
name: v1.3 Cleanup
status: context_captured
requirements: (gap closure — no new requirement IDs)
---

# Phase 19 Context

## Goal
Remove tech debt identified in v1.3 milestone audit: orphaned CSS token, pricing card shadow inconsistency, Phase 18 SUMMARY doc fix.

## Tasks

### Task 1: Remove orphaned --color-cta-hover-kz token
- In `:root` at css/styles.css, remove the line: `--color-cta-hover-kz: #00c08e;`
- This token was declared in Phase 17 but never consumed by any CSS selector
- The hover effect uses `opacity: 0.85` on `.button--primary:hover`, not this token
- Location: css/styles.css ~line 74

### Task 2: Remove .pricing__card box-shadow
- In css/styles.css, remove `box-shadow` from `.pricing__card`
- Current value: `box-shadow: 0 8px 32px rgba(56, 198, 244, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);`
- This extends CARD-05 flat design intent to the pricing card (it was out of scope in Phase 18 but is a visible inconsistency)
- Also check `.pricing__card:hover` if it exists and remove any hover shadow
- Location: css/styles.css ~line 854

### Task 3: Fix Phase 18 SUMMARY.md frontmatter
- Update `.planning/phases/18-cards-badges-navigation/18-01-SUMMARY.md`
- Set `requirements_completed` to: [CARD-04, CARD-05, CARD-06, NAV-01]
- This is a doc fix only — the requirements were actually completed, just not listed in frontmatter

## Files to Modify
- `css/styles.css` — Tasks 1 and 2
- `.planning/phases/18-cards-badges-navigation/18-01-SUMMARY.md` — Task 3
