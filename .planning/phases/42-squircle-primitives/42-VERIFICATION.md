---
phase: 42-squircle-primitives
verified: 2026-04-09T00:00:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
---

# Phase 42: Squircle Primitives Verification Report

**Phase Goal:** A complete squircle utility system exists as reusable CSS classes, so that any element can be given a superellipse shape by adding a single class
**Verified:** 2026-04-09
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Any element can be given a superellipse shape by adding a single .squircle-* class | VERIFIED | squircles.css contains 4 standalone utility classes: .squircle-md, .squircle-lg, .squircle-xl, .squircle-full — each self-contained with border-radius + mask declarations, no wrapper required to apply shape |
| 2 | Chrome 139+ users see native corner-shape rendering (no mask overhead) | VERIFIED | @supports (corner-shape: superellipse(2)) block at squircles.css lines 95-104 strips mask-image and applies corner-shape: superellipse(2) for all 4 variants; compiled into css/styles.css (grep confirms 2 corner-shape occurrences) |
| 3 | Browsers without mask-image support see standard border-radius (no breakage) | VERIFIED | Each class declares border-radius before mask-image — graceful fallback is structurally guaranteed. Tier-3 browsers that do not support mask-image will apply only the border-radius declaration |
| 4 | Shadow-wrap pattern is documented as a project convention for outer shadows on squircle elements | VERIFIED | squircles.css header comment (lines 13-53) documents the full shadow-wrap pattern: explains mask clips box-shadow, provides card and button HTML examples, covers inset-safe case, badge/no-shadow case, and 3 anti-patterns including box-shadow+mask-image on same element and border on squircle elements |
| 5 | Build pipeline compiles squircle classes into css/styles.css | VERIFIED | css/styles.css contains all 4 class names (.squircle-md, .squircle-lg, .squircle-xl, .squircle-full — 2 occurrences each in minified output), plus mask-image (14 occurrences) and corner-shape (2 occurrences); plain CSS in @imported files survives Tailwind v4.2.2 JIT without @layer wrapper |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/styles/squircles.css` | 4 squircle utility classes + @supports PE + shadow-wrap docs | VERIFIED | File exists, 105 lines; 4 classes with 5 declarations each (md/lg/xl); squircle-full border-radius only; @supports block lines 95-104; full shadow-wrap documentation in header |
| `src/styles/tailwind.css` | Import chain includes squircles.css | VERIFIED | Line 5: `@import './squircles.css';    /* Phase 42: squircle primitives */` — placed after @import './theme.css' as specified |
| `css/styles.css` | Compiled output with squircle classes | VERIFIED | All 4 class names present, mask-image declarations present, corner-shape present in minified output |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/styles/squircles.css` | `src/styles/theme.css` | var(--squircle-mask-md/lg/xl) token references | VERIFIED | squircles.css lines 62-63, 70-71, 78-79 reference var(--squircle-mask-md), var(--squircle-mask-lg), var(--squircle-mask-xl); tokens are defined in theme.css lines 109-111 as inline SVG data-URIs; --squircle-mask-full is 'none' per theme.css line 113 |
| `src/styles/tailwind.css` | `src/styles/squircles.css` | @import './squircles.css' | VERIFIED | tailwind.css line 5 contains the import; it follows theme.css import on line 4 as required |

### Data-Flow Trace (Level 4)

Not applicable. Phase 42 is pure CSS utility class creation — no components that render dynamic data from a store or API.

### Behavioral Spot-Checks

Step 7b: SKIPPED. This phase produces CSS files only — no runnable entry points (no JS modules, no API routes, no CLI tools).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SQUIRCLE-01 | 42-01-PLAN.md | All elements with border-radius replaced by superellipse shape — 4 variant scale: md/lg/xl/full | SATISFIED (primitives ready) | 4 utility classes exist and compile; application to all elements is addressed in Phases 44-47 per REQUIREMENTS.md traceability table |
| SQUIRCLE-02 | 42-01-PLAN.md | Chrome 139+ sees native corner-shape via @supports PE; others get mask-image SVG; without mask-image gets border-radius | SATISFIED | @supports block verified in source and compiled output; three-tier degradation documented and structurally enforced |
| SQUIRCLE-04 | 42-01-PLAN.md | Card/button shadows render correctly outside squircle mask (shadow-wrap pattern) | SATISFIED | Shadow-wrap pattern documented in file header with card and button HTML examples, anti-pattern warning, inset-safe and no-wrap cases |

**SQUIRCLE-03 is NOT claimed by this phase.** REQUIREMENTS.md traceability maps SQUIRCLE-03 (focus-visible rings WCAG-compliant on squircle elements) to Phase 41. This requirement is out of scope for Phase 42 and is not assessed here.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

No stubs, placeholders, empty implementations, or hardcoded empty data found. squircles.css is fully substantive. The SUMMARY-claimed commit hashes (286cd5f, 2162a5c) were not verified programmatically, but the artifacts they describe were verified directly in the codebase.

### Human Verification Required

None. All must-haves are verifiable programmatically for a CSS-only primitive phase.

### Gaps Summary

No gaps. All 5 must-have truths verified, all 3 artifacts exist and are substantive and wired, both key links confirmed, all 3 requirement IDs covered.

Note on SQUIRCLE-01 scope: The requirement text says "all border-radius elements are replaced" — that full replacement is intentionally deferred to Phases 44-47 per the REQUIREMENTS.md traceability table, which maps SQUIRCLE-01 to Phase 42 only for the CSS primitives layer. The primitive classes created in this phase are a necessary precondition for that full replacement. This is not a gap.

---

_Verified: 2026-04-09_
_Verifier: Claude (gsd-verifier)_
