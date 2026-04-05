---
phase: 30-seo-optimization
plan: 01
subsystem: seo
tags: [og-image, schema-org, json-ld, canonical, open-graph, structured-data]

# Dependency graph
requires:
  - phase: 26-multipage-content
    provides: "All 5 pages with unique titles, descriptions, and basic OG tags"
  - phase: 29-ux-polish
    provides: "404.html page, normalized CSS across all pages"
provides:
  - "Complete OG tags (including og:image) on all 5 pages"
  - "Clean canonical URLs on all pages (contacts.html fixed)"
  - "Schema.org MedicalBusiness JSON-LD on index.html"
affects: [31-performance, seo-audit, social-sharing]

# Tech tracking
tech-stack:
  added: [Schema.org JSON-LD]
  patterns: [og:image with width/height/alt on all pages, clean canonical URLs without .html extension]

key-files:
  created: []
  modified:
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html

key-decisions:
  - "Removed iso6523Code field from JSON-LD: iso6523Code is for organization identifiers (ICD codes), not certifications like ISO 27001"
  - "Used single og-cover.jpg for all pages: page-specific OG images deferred to Phase 31 (Performance) when image pipeline exists"
  - "OG image URL references planned path /images/og-cover.jpg before file exists: markup is correct now, asset created in Phase 31"

patterns-established:
  - "OG image pattern: og:image + og:image:width (1200) + og:image:height (630) + og:image:alt on every page"
  - "Clean canonical URLs: all pages use URLs without .html extension"

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05]

# Metrics
duration: 2min
completed: 2026-04-05
---

# Phase 30 Plan 01: SEO Meta & Structured Data Summary

**Complete OG tags with og:image on all 5 pages, clean canonical URLs, and Schema.org MedicalBusiness JSON-LD on index.html**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-05T07:47:28Z
- **Completed:** 2026-04-05T07:49:18Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added og:image, og:image:width, og:image:height, og:image:alt meta tags to all 5 pages (index, online-consultations, treatment-abroad, checkup, contacts)
- Fixed contacts.html canonical and og:url from /contacts.html to /contacts (clean URL consistency)
- Added MedicalBusiness JSON-LD to index.html with company info, 2 addresses (KZ + AT), parent organization, 5 medical specialties, and 3 service offers

## Task Commits

Each task was committed atomically:

1. **Task 1: Add og:image to all 5 pages and fix contacts.html URLs** - `ce206b5` (feat)
2. **Task 2: Add Schema.org JSON-LD structured data to index.html** - `8f638bb` (feat)

**Plan metadata:** `6cedf5f` (docs: complete plan)

## Files Created/Modified
- `index.html` - Added og:image meta tags + MedicalBusiness JSON-LD script
- `online-consultations.html` - Added og:image meta tags
- `treatment-abroad.html` - Added og:image meta tags
- `checkup.html` - Added og:image meta tags
- `contacts.html` - Added og:image meta tags + fixed canonical and og:url to clean URLs

## Decisions Made
- Removed `iso6523Code: "ISO 27001"` from JSON-LD: the iso6523Code property is for organization identifier codes (ICD), not certifications. ISO 27001 is already mentioned in page content and JSON-LD description.
- Used shared og-cover.jpg for all pages since page-specific OG images do not exist yet. The actual image file will be created in Phase 31 (Performance). Meta tags reference the planned URL now.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed incorrect iso6523Code from JSON-LD**
- **Found during:** Task 2 (Schema.org JSON-LD)
- **Issue:** Plan specified `"iso6523Code": "ISO 27001"` but iso6523Code is for International Code Designator organization identifiers, not certification references. Using it with "ISO 27001" is semantically incorrect and would confuse structured data validators.
- **Fix:** Removed the iso6523Code field entirely. ISO 27001 certification is already referenced in the description field and page content.
- **Files modified:** index.html
- **Verification:** JSON-LD validates as valid JSON, no semantic errors
- **Committed in:** 8f638bb (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minimal. Removed one semantically incorrect field. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
- `og:image` references `https://medicusunion.kz/images/og-cover.jpg` which does not exist yet as a file. This is intentional -- the image asset will be created in Phase 31 (Performance) when the image optimization pipeline is set up. The meta tags are correctly in place for when the asset exists.

## Next Phase Readiness
- All SEO meta tags complete across all 5 pages
- JSON-LD structured data ready for Google Rich Results testing
- og-cover.jpg image file needed (Phase 31 responsibility)
- Ready for Phase 31 (Performance optimization)

## Self-Check: PASSED

All 5 HTML files exist and contain expected changes. Both task commits (ce206b5, 8f638bb) verified in git log. SUMMARY.md created successfully.

---
*Phase: 30-seo-optimization*
*Completed: 2026-04-05*
