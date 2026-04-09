---
phase: 41-foundation-tokens
verified: 2026-04-09T08:32:30Z
status: human_needed
score: 4/5
overrides_applied: 0
human_verification:
  - test: "Open any page (e.g., contacts.html) in browser, press Tab through interactive elements, confirm focus ring is a solid blue (#0E8FB5) outline with visible gap -- not a double box-shadow ring"
    expected: "Each focused element (button, link, input) shows a 2px solid blue outline with ~3px spacing gap between element edge and ring. No white inner ring artifact from old pattern."
    why_human: "CSS outline rendering, gap size, and absence of box-shadow artifact require visual confirmation -- DevTools computed styles should show outline: 2px solid rgb(14, 143, 181) and outline-offset: 3px with box-shadow: none"
  - test: "In browser DevTools, add class='dark' to the html element and check computed style of html/:root -- verify --liquid-bg changes to rgba(30, 40, 60, 0.45)"
    expected: "Dark mode overrides liquid glass tokens: --liquid-bg = rgba(30, 40, 60, 0.45), --liquid-blur-md = 28px, --liquid-saturate = 160%, --liquid-brightness = 115%"
    why_human: "Dark mode selector behavior (.dark class on html) and CSS custom property cascade must be verified in a running browser -- the .dark tokens exist in the code but cascade correctness requires runtime check"
---

# Phase 41: Foundation Tokens Verification Report

**Phase Goal:** All design tokens for v4.0 exist in theme.css, and the focus-visible ring mechanism is safe for mask-image elements -- so that Phases 42-49 can reference tokens without back-patching theme.css
**Verified:** 2026-04-09T08:32:30Z
**Status:** human_needed
**Re-verification:** No -- initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | theme.css contains grid tokens (--container-content: 1200px in @theme inline, gutter tokens 16/24/32px) and max-w-content utility resolves when used | VERIFIED (with note) | --container-content: 1200px at line 294 (inside @theme inline), gutter tokens at lines 103-106 (--grid-gutter-mobile/tablet/desktop) + @theme inline bridge at lines 295-297. Spot-check confirms max-w-content{max-width:1200px} generates when class is used in HTML. Not in css/styles.css because no HTML uses it yet (documented JIT behavior, deferred to Phases 45-47). |
| 2 | theme.css contains squircle tokens (4 mask data-URI variants), liquid glass tokens (light recipe + rim shadows), and motion tokens | VERIFIED | Squircle: --squircle-mask-md/lg/xl/full at lines 108-112 (3 SVG data-URIs + none for full). Liquid glass light: --liquid-bg rgba(255,255,255,0.18), --liquid-blur-md 24px, --liquid-saturate 180%, --liquid-brightness 108%, rim shadows at lines 114-126. Motion: --ease-liquid cubic-bezier(0.2,0,0,1), --dur-press 120ms, --dur-hover 280ms, --dur-sheet 400ms at lines 129-134. |
| 3 | Dark-mode glass tokens exist under .dark selector with rgba(30,40,60,0.45) base, blur 28px, saturate 160%, brightness 115% | VERIFIED | .dark block at lines 173-185: --liquid-bg rgba(30,40,60,0.45), --liquid-blur-md 28px, --liquid-saturate 160%, --liquid-brightness 115%. Dark selector matches @custom-variant dark declaration at line 0. |
| 4 | Focus-visible ring uses outline: 2px solid var(--mu-blue-text); outline-offset: 3px instead of box-shadow | VERIFIED | @layer base focus-visible rule at lines 311-321: outline: 2px solid var(--mu-blue-text), outline-offset: 3px, box-shadow: none. Old pattern (outline: none + box-shadow double-ring) is gone -- grep for "outline: none" and "box-shadow: 0 0 0 2px white" returns no matches. All 7 selectors (a, button, input, select, textarea, [role="button"], [tabindex]) preserved. |
| 5 | make build exits 0 and no HTML files modified | VERIFIED | make build completes successfully (6 pages processed, done). git diff --quiet '*.html' exits 0. Commits: 6fde560 (tokens), 1a80ee2 (focus-visible). |

**Score:** 4/5 truths verified (truth 1 technically verified but requires human confirmation of max-w-content JIT behavior acceptability; truths 4 needs human visual verification)

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|--------------|----------|
| 1 | max-w-content utility present in css/styles.css compiled output | Phases 45-47 | Phase 45 (MIGRATE-01), 46 (MIGRATE-03/04/05), 47 (MIGRATE-06) apply grid classes to HTML pages -- first use of max-w-content in HTML will trigger JIT generation. ROADMAP SC 1 intent ("utility resolves") is satisfied by token infrastructure; CSS output activation is downstream. |

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/styles/theme.css` | All v4.0 design tokens for grid, squircle, liquid glass, and motion | VERIFIED | File exists, 423 lines. All token categories present: grid (lines 101-106), squircle masks (lines 107-112), liquid glass light (lines 114-126), liquid glass dark (.dark block lines 173-185), motion (lines 128-134), reduced-motion zeroing (lines 416-421). Protected tokens intact: --section-h-hero-rich at line 52, overflow-x: clip at line 334. |
| `css/styles.css` | Compiled Tailwind CSS with max-w-content utility | PARTIAL | File exists and is freshly compiled (make build passes). max-w-content NOT present because no HTML consumer exists yet. Spot-check confirms the token IS correctly defined and generates the utility when used in HTML. This is expected Tailwind v4 JIT behavior. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| src/styles/theme.css :root | @theme inline | --container-content: 1200px literal (parallel declaration, no circular ref) | WIRED | Line 103: :root --container-content: 1200px. Line 294: @theme inline --container-content: 1200px (literal, not var()). Plan's circular-reference guard applied correctly. |
| src/styles/theme.css :root | .dark {} | Dark recipe overrides for --liquid-* tokens | WIRED | .dark block (lines 173-185) overrides all liquid glass tokens with dark recipe. --liquid-bg: rgba(30,40,60,0.45) confirmed at line 174. |
| src/styles/theme.css @layer base focus-visible rule | All interactive elements | CSS selector match on :focus-visible | WIRED | 7-selector rule at lines 311-317. outline: 2px solid var(--mu-blue-text) at line 318. outline-offset: 3px at line 319. box-shadow: none at line 320. |

---

## Data-Flow Trace (Level 4)

Not applicable. This phase produces only CSS token declarations -- no components, no data rendering, no state. All artifacts are infrastructure (CSS custom properties and @layer base rules).

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| max-w-content generates 1200px when used in HTML | Minimal Tailwind build with `<div class="max-w-content">` test file | `.max-w-content { max-width: 1200px; }` generated | PASS |
| make build exits 0 with all tokens present | `make build` | "done (6 pages processed)" | PASS |
| Old focus-visible double-ring pattern removed | grep for `outline: none` and `box-shadow: 0 0 0 2px white` | No matches in theme.css | PASS |
| Reduced-motion guard zeroes motion tokens | grep for `--dur-press: 0ms` inside @media block | Found at lines 417-420 inside @media (prefers-reduced-motion: reduce) | PASS |
| HTML files unchanged | `git diff --quiet '*.html'` | Exit 0, no HTML modifications | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| GRID-01 | 41-01-PLAN.md | Responsive CSS grid with max-w-content: 1200px container and gutters (token infrastructure only -- grid classes applied in Phases 45-47) | SATISFIED (token scope) | --container-content: 1200px in :root (line 103) and @theme inline (line 294). Gutter tokens --grid-gutter-mobile/tablet/desktop in :root (lines 104-106) with @theme inline bridge as --spacing-gutter-* (lines 295-297). Grid classes to HTML are Phase 45-47 scope per plan and REQUIREMENTS.md traceability table. |
| SQUIRCLE-03 | 41-02-PLAN.md | Focus-visible rings remain visible and WCAG-compliant on squircle elements -- outline + outline-offset instead of box-shadow (BLOCKER: must land before any squircle class applied) | SATISFIED | outline: 2px solid var(--mu-blue-text) + outline-offset: 3px + box-shadow: none in @layer base (lines 318-320). Old box-shadow double-ring removed. --mu-blue-text = #0E8FB5, contrast 4.6:1 on white (WCAG AA pass). Phase 42 can safely apply mask-image. |

**Orphaned requirements check:** REQUIREMENTS.md traceability table maps GRID-01 to "Phase 41 (tokens) + Phases 45-47 (applied)" and SQUIRCLE-03 to "Phase 41". Both are claimed by plans in this phase. No orphaned requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/styles/theme.css | 112 | `--squircle-mask-full: none` | Info | Intentional. Per plan spec: full variant uses border-radius: 50% instead of SVG mask. Comment at line 111 documents rationale. Not a stub -- it's the correct declared value. |

No blockers. No TODO/FIXME/placeholder markers found in modified files. No empty return stubs.

---

## Human Verification Required

### 1. Focus-Visible Ring Visual Appearance

**Test:** Open contacts.html in browser, press Tab key through interactive elements (inputs, buttons, links). Observe the focus ring.
**Expected:** Each focused element shows a solid blue (#0E8FB5) outline ring with visible gap (~3px) between the element border and the ring. Single ring -- no white inner ring artifact from the old double-ring pattern. DevTools computed styles on a focused element should show `outline: 2px solid rgb(14, 143, 181)`, `outline-offset: 3px`, `box-shadow: none`.
**Why human:** CSS outline rendering, gap size, and absence of box-shadow artifact require visual confirmation in a running browser. This is SQUIRCLE-03 's acceptance criterion.

### 2. Dark Mode Token Cascade

**Test:** In browser DevTools, select the `<html>` element, add `class="dark"` to it. Check computed styles on `<html>` or `<body>` for CSS custom property values.
**Expected:** After adding `dark` class: `--liquid-bg` shows `rgba(30, 40, 60, 0.45)`, `--liquid-blur-md` shows `28px`, `--liquid-saturate` shows `160%`, `--liquid-brightness` shows `115%`. These should differ from light mode values (`rgba(255, 255, 255, 0.18)`, `24px`, `180%`, `108%`).
**Why human:** CSS custom property cascade through the `.dark` class selector requires runtime verification -- while the declarations are present in code, the cascade priority and JS toggle mechanism (or lack thereof in this phase) must be confirmed to work as expected when the class is applied.

---

## Gaps Summary

No blocking gaps. All must-haves are verified at the code level. Phase goal is achieved: all design tokens for v4.0 are defined in theme.css, and the focus-visible ring mechanism uses outline (immune to mask-image clipping).

Two items require human verification before the phase can be fully closed:
1. Focus-visible ring visual appearance in browser (SQUIRCLE-03 final acceptance)
2. Dark mode token cascade via .dark class (runtime CSS cascade verification)

These are standard checkpoint:human-verify tasks already documented in Plans 41-01 and 41-02. The code is correct; human sign-off remains pending.

---

_Verified: 2026-04-09T08:32:30Z_
_Verifier: Claude (gsd-verifier)_
