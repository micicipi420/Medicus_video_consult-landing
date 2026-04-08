---
phase: 27-treatment-abroad-page-rewrite
plan: 01
subsystem: ui
tags: [html, copywriting, seo, landing-page, medical-tourism]

# Dependency graph
requires:
  - phase: 24-liquid-glass-enhancement
    provides: glass card patterns, design tokens, section layout
provides:
  - "Sections 1-4 of treatment-abroad.html with verbatim professional copywriting"
  - "SEO meta tags optimized for medical tourism keywords"
  - "3 comparison tables differentiating MedicusUnion from alternatives"
  - "4 for-whom scenario cards targeting patient decision points"
affects: [27-02, 27-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [comparison-table-component, for-whom-card-grid]

key-files:
  created: []
  modified: [treatment-abroad.html]

key-decisions:
  - "Reused .problem section pattern from consultations.html for for-whom cards"
  - "Comparison tables use BEM .comparison__cell--them/--us pattern for CSS styling hooks"
  - "Removed secondary outline CTA button from hero per copywriting (single CTA focus)"
  - "Social proof reduced from 4 items to 3 per copywriting document"
  - "Steps 3-4 omit duration span since copywriting provides no timeframe"

patterns-established:
  - "comparison__table: header + rows with --them/--us cell modifiers for visual contrast"
  - "Inline grid style on problem__content for 2-column card layout"

requirements-completed: [TREAT-01, TREAT-02, TREAT-03, TREAT-04]

# Metrics
duration: 5min
completed: 2026-04-04
---

# Phase 27 Plan 01: Treatment Abroad Sections 1-4 Summary

**Rewrote hero, for-whom cards, 4-step process, and 3 comparison tables with verbatim professional copywriting for medical tourism landing page**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-04T16:36:01Z
- **Completed:** 2026-04-04T16:40:35Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Hero section updated with new eyebrow, h1, subtitle, and single CTA -- all verbatim from copywriting document
- SEO meta tags (title, description, og:title, og:description) updated with medical tourism keywords
- 4 for-whom cards ("Узнаёте свою ситуацию?") with full scenario descriptions targeting patient decision points
- 4-step process ("От обращения до приёма у врача -- через 2-3 недели") with full paragraph descriptions
- 3 comparison tables (vs self-organization, vs Instagram agency, vs clinic international dept) with 16 total comparison rows
- Social proof bar updated to match copywriting: 15+ years, 10 000+ patients, geography coverage

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite Hero + Social Proof + For-Whom** - `39469ec` (feat)
2. **Task 2: Rewrite Steps + Add Comparison Tables** - `5432181` (feat)

## Files Created/Modified
- `treatment-abroad.html` - Sections 1-4 rewritten with verbatim copywriting; SEO meta updated; old About Us and Clinics sections replaced

## Decisions Made
- Reused `.problem` section pattern (from consultations.html) for the for-whom cards to maintain visual consistency
- Created new `.comparison` BEM component with `--them`/`--us` cell modifiers for visual styling hooks
- Used inline grid style on `.problem__content` for 2-column card layout (CSS for `.comparison` will be added in plan 02/03)
- Removed the secondary "Как это работает" outline button from hero -- copywriting specifies only one CTA
- Reduced social proof from 4 stat boxes to 3 items per copywriting document text
- Steps 3 and 4 omit the `<span class="steps__duration">` element since the copywriting provides no timeframe for these phases

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all sections contain final verbatim copywriting text. The comparison tables use basic BEM markup that will need CSS styling (expected -- handled by subsequent plans 02/03).

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Sections 1-4 complete with verbatim text
- Sections 5-10 (platform, clinics/geography, reviews, FAQ, form, footer) ready for plan 02
- Comparison section `.comparison__*` CSS classes need styling rules (plan 02/03 scope)
- For-whom cards inline grid style should ideally be moved to stylesheet (plan 02/03 scope)

## Self-Check: PASSED

- treatment-abroad.html: FOUND
- 27-01-SUMMARY.md: FOUND
- Commit 39469ec (Task 1): FOUND
- Commit 5432181 (Task 2): FOUND

---
*Phase: 27-treatment-abroad-page-rewrite*
*Completed: 2026-04-04*
