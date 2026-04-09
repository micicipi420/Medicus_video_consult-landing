---
phase: 40-ux-cosmetic-cleanup
status: passed
must_haves_verified: 3/3
requirements_covered: 3/3
verified: 2026-04-08T00:00:00Z
verifier: gsd-verifier
---

# Phase 40 Verification Report

## Goal

The 3 residual cosmetic items flagged by Phase 38.1's Playwright UX validation are closed at the source, so the mobile overflow safety net from v3.1 is no longer compensating for underlying sizing bugs and the browser console is silent on first load.

**Verified:** 2026-04-08
**Status:** passed
**Re-verification:** No — initial verification

## Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 404 H1 fits at 320px without relying on overflow-x: clip | VERIFIED | `text-3xl sm:text-5xl md:text-6xl lg:text-7xl` confirmed at 404.html line 114; Playwright: scrollWidth===clientWidth at all 4 viewports, overflow_px===0 |
| 2 | Favicon returns HTTP 200, zero console 404s on first load of all 6 pages | VERIFIED | All 4 assets exist at repo root; 4 link tags confirmed 1/1 per page across all 6 pages; curl 4/4 200; Playwright: 0 console errors on all 6 pages, 24/24 DOM assertions pass |
| 3 | Checkup H1 phrase "за 1–2 дня" never breaks mid-range across viewports 320/375/768/1024/1440/1920 | VERIFIED | `<span class="whitespace-nowrap">за 1&ndash;2 дня</span>` confirmed at checkup.html line 142; Playwright: client_rect_count===1 and white_space===nowrap at all 6 viewports |

**Score:** 3/3 truths verified

## Must-Haves

### 1. 404 H1 fits at 320px

**Status:** PASS

**Evidence:**

- `404.html` line 114 (verified by direct read): `<h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4">Страница&nbsp;не&nbsp;найдена</h1>` — class string matches D-01 exactly
- `grep -c 'text-3xl sm:text-5xl...' 404.html` returns 1; old `text-4xl` pattern returns 0
- Subject+verb nbsp binding `Страница&nbsp;не&nbsp;найдена` preserved verbatim: grep count = 1
- Exactly one `<h1 ` on the page: count = 1
- 40-01-SUMMARY.md Verification Results (Task 2, commit 2255867): 4 viewports (320, 375, 768, 1024) all PASS — scrollWidth===clientWidth, overflow_px===0, h1 fully visible, h1.textContent.trim()==="Страница не найдена"

### 2. Favicon returns 200

**Status:** PASS

**Evidence:**

- `favicon.ico` — 6003 bytes, real Windows ICO (MS Windows icon resource, 3 frames: 16x16/32x32/48x48 RGBA confirmed via Pillow)
- `favicon.svg` — 698 bytes, valid SVG with brand gradient (#1AC67E, #0D9DB5 both present); no `<script>` elements, no event handlers, supply-chain clean
- `apple-touch-icon.png` — 17195 bytes, 180x180 PNG RGBA
- `site.webmanifest` — 592 bytes, valid JSON (python3 parse exits 0); required fields: name, short_name, lang ru-KZ, start_url /, display browser, theme_color #1AC67E, background_color #ffffff, icons[] array with 3 entries
- All 6 HTML pages confirmed 4/4 link tags (1 each): `rel="icon" href="/favicon.ico"`, `rel="icon" type="image/svg+xml" href="/favicon.svg"`, `rel="apple-touch-icon" href="/apple-touch-icon.png"`, `rel="manifest" href="/site.webmanifest"` — verified by grep across index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, 404.html
- index.html lines 20-23 confirmed by direct read: 4 link tags immediately after `<meta name="theme-color" content="#38C6F4">`
- 40-02-SUMMARY.md Verification Results (Task 3): curl 4/4 endpoints HTTP 200; Playwright 0 console errors on all 6 pages; 24/24 DOM assertions pass (6 pages × 4 link tags)
- GitHub Pages live-URL curl is explicitly deferred post-deploy (Step D in SUMMARY) and does not gate phase completion

### 3. Checkup H1 phrase integrity

**Status:** PASS

**Evidence:**

- `checkup.html` line 142 (verified by direct read): `<span class="text-mu-text-900"> &mdash; <span class="whitespace-nowrap">за 1&ndash;2 дня</span></span>` — matches D-05 verbatim
- `grep -c` new fragment = 1; old fragment `за&nbsp;1&ndash;2&nbsp;дня` = 0 (fully removed)
- En-dash `&ndash;` count: 9 (unchanged from pre-edit — U+2013 preserved, not downgraded to hyphen-minus)
- Em-dash `&mdash;` count: 40 (unchanged — sentence-level separator outside nowrap span preserved)
- `whitespace-nowrap` count in checkup.html = 1 (one new occurrence, as specified)
- 40-03-SUMMARY.md Verification Results (Task 2, commit 2255867): 6 viewports (320, 375, 768, 1024, 1440, 1920) all PASS — client_rect_count===1 (definitive single-line check via Range.getClientRects), white_space===nowrap, text contains U+2013 (en-dash) at every viewport

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `404.html` | H1 class `text-3xl sm:text-5xl md:text-6xl lg:text-7xl` + nbsp binding | VERIFIED | Line 114 matches D-01 exactly; wired via Tailwind utility classes |
| `checkup.html` | Whitespace-nowrap span around "за 1&ndash;2 дня" | VERIFIED | Line 142 matches D-05 exactly; old entity-nbsp glue removed |
| `favicon.ico` | Multi-size Windows ICO (16/32/48) at repo root | VERIFIED | 6003 bytes, 3 RGBA frames confirmed |
| `favicon.svg` | Brand-gradient SVG, ≤2KB, no scripts | VERIFIED | 698 bytes, #1AC67E + #0D9DB5, no script elements |
| `apple-touch-icon.png` | 180x180 PNG at repo root | VERIFIED | 17195 bytes, 180x180 RGBA |
| `site.webmanifest` | Valid JSON, required fields, icons[] array | VERIFIED | 592 bytes, python3 JSON parse exits 0, all required fields present |
| All 6 HTML pages | 4 favicon link tags in `<head>` | VERIFIED | 24/24 link tags confirmed (1 per tag per page) |

## Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| 404.html H1 line 114 | Tailwind `text-3xl` mobile floor | utility class string | WIRED | Class string active; Tailwind v4.2.2 compiles the rule into css/styles.css |
| checkup.html line 142 inner span | Tailwind `whitespace-nowrap` | class attribute | WIRED | CSS rule `.whitespace-nowrap{white-space:nowrap}` present in css/styles.css (added by this phase's build) |
| All 6 HTML `<head>` | `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`, `/site.webmanifest` | `<link>` elements | WIRED | 4 link tags per page, inserted immediately after `<meta name="theme-color">` anchor |
| site.webmanifest `icons[]` | favicon asset files at repo root | JSON src paths | WIRED | 3 icons: /favicon.ico (16x16 32x32 48x48), /favicon.svg (any), /apple-touch-icon.png (180x180) |

## Regression Check

| Check | Result |
|-------|--------|
| `make build` exit code | 0 (Tailwind v4.2.2 compiled in ~22s; splicer updated all 6 pages; no chrome drift) |
| `./scripts/hooks/pre-commit` exit code | 0 ("byte-identity gate passed") |
| `git diff --quiet -- partials/` | Clean (chrome partials untouched) |
| `git diff --quiet -- '*.html'` after build | Clean (no drift introduced) |

Phase 39 byte-identity gate fully intact. All Phase 40 edits (H1 class swap on 404.html, whitespace-nowrap span on checkup.html, 4 favicon link tags on all 6 pages) are in `<body>` page-specific content or `<head>` regions — outside the 4 chrome partial regions bracketed by `<!-- BUILD:* -->` markers. The splicer is a no-op on all Phase 40 modifications.

## Data-Flow Trace (Level 4)

Not applicable — all three fixes are static HTML markup changes with no dynamic data rendering. No state variables, no API calls, no data sources to trace.

## Behavioral Spot-Checks

| Behavior | Method | Result | Status |
|----------|--------|--------|--------|
| 404 H1 mobile class is `text-3xl` | grep exact class string in 404.html | count=1 | PASS |
| Old `text-4xl` class removed | grep old class string in 404.html | count=0 | PASS |
| Checkup nowrap span present | grep new fragment in checkup.html | count=1 | PASS |
| En-dash U+2013 preserved | `grep -c '&ndash;' checkup.html` | count=9 (unchanged) | PASS |
| favicon.ico is real ICO format | file size 6003 bytes, 3-frame Pillow parse | confirmed | PASS |
| favicon.svg is supply-chain clean | grep `<script` | no match | PASS |
| site.webmanifest is valid JSON | python3 json.load() | exits 0 | PASS |
| All 6 pages have 4 favicon link tags | grep count per file per tag | 24/24 = 1 each | PASS |
| make build byte-identity gate | `make build` exit code | 0 | PASS |
| Pre-commit hook | `./scripts/hooks/pre-commit` exit code | 0 | PASS |

## Requirements Coverage

| REQ-ID | Description | Plan | Status | Evidence |
|--------|-------------|------|--------|----------|
| COSMETIC-01 | 404.html H1 fits within viewport at 320px width | 40-01 | COVERED | 404.html H1 uses `text-3xl` mobile class; Playwright 4-viewport pass confirmed in 40-01-SUMMARY |
| COSMETIC-02 | `/favicon.ico` returns HTTP 200 on every deployed path | 40-02 | COVERED | 4 favicon assets at repo root; 4 link tags in all 6 pages; curl 4/4 200; Playwright 0 console errors; 24/24 DOM assertions |
| COSMETIC-03 | checkup.html H1 "за 1–2 дня" does not break mid-phrase | 40-03 | COVERED | `whitespace-nowrap` span wraps full phrase; en-dash preserved; Playwright 6-viewport single-line confirmation |

All 3 COSMETIC requirements mapped to Phase 40 in REQUIREMENTS.md. All 3 covered by plans with confirmed implementation and Playwright verification results. REQUIREMENTS.md traceability table shows all 3 as "Pending" (the checkbox notation is pre-completion state from requirements authoring) — the actual implementation is complete and verified above.

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None found | — | — | — |

Code review (40-REVIEW.md, status: clean) confirms 0 blockers, 0 warnings. Two INFO notes are non-actionable: (1) intentional `theme_color` value difference between manifest (#1AC67E) and meta tag (#38C6F4) — documented design decision; (2) color token value mismatch in planning artifact only, no shipped code affected.

## Human Verification Items

None — all verification is machine-checkable for this phase.

One item is explicitly deferred post-deploy, not a gate:
- GitHub Pages live-URL curl (`https://micicipi420.github.io/Medicus_video_consult-landing/favicon.ico` → HTTP 200) — deferred until `feat/v3.1` is pushed to origin and GitHub Pages rebuilds. Documented as Step D in 40-02-SUMMARY.md. Does not block phase completion.

## Gaps

None — all must-haves verified against the current codebase.

## Summary

Phase 40 achieves its goal. All three residual cosmetic items from Phase 38.1's Playwright UX validation are closed at the source:

COSMETIC-01 is resolved: 404.html H1 uses `text-3xl` (30px) as the mobile base class, down from `text-4xl` (36px). The phrase "Страница&nbsp;не&nbsp;найдена" fits within a 320px viewport with zero horizontal overflow — confirmed by Playwright measurements showing `documentElement.scrollWidth === clientWidth` at 320, 375, 768, and 1024px. The `html { overflow-x: clip }` safety net from Phase 38.1 is no longer compensating for an underlying sizing bug on this page.

COSMETIC-02 is resolved: A complete 4-asset favicon set (favicon.ico with 3 ICO frames, favicon.svg with brand gradient, apple-touch-icon.png at 180x180, site.webmanifest with valid JSON) is present at repo root. All 6 HTML pages have the 4 corresponding link tags in `<head>`. Playwright verification confirms zero favicon-related console errors on first load of every page — the browser console is silent.

COSMETIC-03 is resolved: The checkup.html hero H1 phrase "за 1–2 дня" is wrapped in a `<span class="whitespace-nowrap">` span, replacing the fragile entity-nbsp glue that a browser could wrap at the en-dash. Playwright confirms `Range.getClientRects().length === 1` (single line) and `white-space: nowrap` (Tailwind class active) at all 6 viewports (320–1920px). The en-dash U+2013 is preserved verbatim.

The Phase 39 byte-identity gate remains fully intact: `make build` exits 0, the pre-commit hook exits 0 with "byte-identity gate passed", and `git diff --quiet -- partials/` is clean. Phase 40 is ready for milestone v3.2 close.

---

_Verified: 2026-04-08_
_Verifier: Claude (gsd-verifier)_
