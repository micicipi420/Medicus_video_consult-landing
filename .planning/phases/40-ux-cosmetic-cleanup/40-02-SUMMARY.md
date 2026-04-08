---
phase: 40-ux-cosmetic-cleanup
plan: 02
subsystem: ui
tags: [favicon, web-manifest, pwa-basics, brand-assets, head-elements, supply-chain-hygiene, pillow]

# Dependency graph
requires:
  - phase: 40-ux-cosmetic-cleanup
    provides: "Wave 1 (40-01, 40-03) closed COSMETIC-01 and COSMETIC-03 against the same `<body>` regions of 404.html and checkup.html that this plan touches in `<head>` — sequencing eliminates merge-conflict risk on those two shared files"
  - phase: 39-partials-extraction-build-pipeline
    provides: "make build canonical entry, byte-identity gate via splicer + pre-commit hook (no-op on `<head>` edits because all 4 chrome partial regions are inside `<body>`)"
provides:
  - "favicon.ico (multi-size 16/32/48), favicon.svg (hand-drawn brand-gradient mark), apple-touch-icon.png (180×180), site.webmanifest at repo root"
  - "4 favicon `<link>` tags wired into `<head>` of all 6 HTML pages (24 total link tags) immediately after `<meta name=\"theme-color\">`"
  - "Pattern: Pillow-as-fallback-for-ImageMagick for one-shot raster pipeline tasks (PNG → multi-size ICO + padded square downscale) — Pillow is dev-only and discardable, NOT a runtime dependency"
affects: [40-04 phase verifier, milestone-v3.2-completion, future-pwa-work (deferred), supply-chain-audit-trail (SHA256 of source PNG recorded for regeneration auditability)]

# Tech tracking
tech-stack:
  added:
    - name: "Python Pillow 11.3.0 (already installed system-wide)"
      role: "dev-only one-shot raster pipeline (PNG → multi-size ICO, PNG → padded 180×180 square)"
      runtime: false
      justification: "Plan specified ImageMagick; ImageMagick was not installed on the system. Pillow was already present and equivalent for the operations required (Image.save(format='ICO', sizes=[(16,16),(32,32),(48,48)]) produces a real Windows ICO with 3 frames, not a renamed PNG). Pillow is part of Python — no new runtime dependency for the static HTML pages, and can be uninstalled after this plan without affecting the site."
  patterns:
    - "Hand-drawn favicon.svg in brand gradient as a separate vector deliverable, not inlined in HTML (D-04 idiom). Lets browsers prefer the vector at high-DPI without bloating page byte budget."
    - "4-link favicon set ordering: icon[ico, sizes=any] first as universal fallback, icon[svg+xml] second for modern browsers, apple-touch-icon third for iOS, manifest fourth for PWA-aware browsers"
    - "Insertion-by-anchor pattern for `<head>` edits across N pages: anchor on a unique meta tag that exists verbatim on every page (`<meta name=\"theme-color\" content=\"#38C6F4\">`) to make the edit byte-identical and trivially auditable"

key-files:
  created:
    - favicon.ico
    - favicon.svg
    - apple-touch-icon.png
    - site.webmanifest
    - .planning/phases/40-ux-cosmetic-cleanup/40-02-SUMMARY.md
  modified:
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html
    - 404.html

key-decisions:
  - "D-02 (locked in 40-CONTEXT.md): full 4-asset favicon set + 4 link tags on all 6 pages — executed verbatim"
  - "D-03 (locked in 40-CONTEXT.md): production raster source downloaded once from Tilda CDN, processed into derivatives, source PNG deleted from /tmp (only derivatives committed) — SHA256 d415b5c10f7f8a1805f3a4b1ea84b8691e84baa62edf928d3a85f478235dfd77 recorded for regeneration auditability"
  - "D-04 (locked in 40-CONTEXT.md): hand-drawn SVG with brand gradient #1AC67E → #0D9DB5 in a single 64×64 viewBox file, ≤2KB (actual: 698 bytes)"
  - "Asset location: repo root (NOT a /icons/ subdirectory) — matches browser auto-request conventions and CONTEXT.md 'Claude's Discretion' default"
  - "Tooling deviation: Pillow 11.3.0 substituted for ImageMagick (not installed). Pillow is dev-only, equivalent for the operations required, and not a runtime dependency."
  - "apple-touch-icon background: white. Source PNG is 494×505 (non-square, transparent background). Padded to a 505×505 white square first, then LANCZOS-downscaled to 180×180. White was chosen because iOS applies a rounded-rect mask automatically — white edges sit invisibly under the mask."
  - "site.webmanifest theme_color: #1AC67E (mu-cta-from gradient endpoint, brand green) — matches the SVG gradient start stop and the existing CTA button gradient identity"

patterns-established:
  - "Pillow as a one-shot dev-only substitute for ImageMagick when only PNG→ICO and PNG→PNG resize are needed. Documented in this SUMMARY as a deviation."
  - "Anchor-based `<head>` edit pattern: insert favicon link tags immediately after a known unique meta tag (`<meta name=\"theme-color\">`) instead of by line number or by file structure analysis."

requirements-completed: [COSMETIC-02]

# Metrics
duration: 7m58s
completed: 2026-04-08
---

# Phase 40 Plan 02: Favicon Full Set Summary

**Generated favicon.ico (multi-size 16/32/48), favicon.svg (hand-drawn brand-gradient mark), apple-touch-icon.png (180×180), and site.webmanifest at repo root from production Tilda raster source via Python Pillow 11.3.0 (one-shot dev fallback for ImageMagick), then wired 24 favicon `<link>` tags (4 per page × 6 pages) into `<head>` immediately after `<meta name="theme-color">` — `make build` exits 0, partials/ clean, no chrome drift.**

## Performance

- **Duration:** 7m58s
- **Started:** 2026-04-08T13:04:36Z
- **Completed:** 2026-04-08T13:12:34Z (Tasks 1 + 2; Task 3 is the human-verify Playwright MCP checkpoint)
- **Tasks:** 2 of 3 (Task 3 awaits Playwright MCP verification owned by orchestrator/verifier)
- **Files modified:** 6 HTML pages
- **Files created:** 4 asset files + this SUMMARY

## Goal Restatement

Close **COSMETIC-02**: ship a complete favicon set (ico + svg + apple-touch-icon + webmanifest) at the repo root and add the 4 corresponding `<link>` tags to the `<head>` of all 6 HTML pages so `/favicon.ico` returns HTTP 200 on every deployed path and the browser console is silent on first load. The site previously had no favicon assets — browsers auto-requested `/favicon.ico` on every page load and 404'd, producing the documented residual UX item from v3.1 Phase 38.1. The user explicitly wanted brand-consistent assets sourced from the production medicusunion.kz favicon (NOT a from-scratch design).

## Accomplishments

- 4 favicon asset files created at repo root and committed atomically (Task 1)
- favicon.ico is a real multi-size ICO with 3 frames (16x16, 32x32, 48x48), generated via Pillow's `Image.save(format='ICO', sizes=[...])` API — verified via both `file` and Pillow's ICO header parser
- favicon.svg is hand-drawn (NOT a pixel-perfect tracing of the production PNG), uses the brand gradient `#1AC67E → #0D9DB5` (mu-cta-from → mu-cta-to), 698 bytes (well under the 2048-byte limit), single root `<svg>` with `viewBox="0 0 64 64"` for crisp rendering at any size
- apple-touch-icon.png is 180×180, generated by padding the non-square 494×505 source to a 505×505 white square first, then LANCZOS-downscaling — preserves the production mark centered without stretching aspect ratio
- site.webmanifest is valid JSON with name, short_name, lang ru-KZ, start_url /, display browser, theme_color #1AC67E, background_color #ffffff, and a 3-entry icons[] array (ico + svg + apple-touch-icon)
- Source PNG SHA256 `d415b5c10f7f8a1805f3a4b1ea84b8691e84baa62edf928d3a85f478235dfd77` recorded for supply-chain audit trail (per `<threat_model>` T-40-02 mitigation)
- /tmp/medicus-favicon-source.png deleted after derivatives generated — only the 4 inspectable derivatives are committed
- 4 favicon `<link>` tags wired into `<head>` of all 6 HTML pages (Task 2): 24 link tags total, byte-identical across pages, inserted immediately after the unique anchor `<meta name="theme-color" content="#38C6F4">`
- `make build` exits 0; `git diff --quiet -- partials/` clean; the splicer is a no-op on `<head>` edits because all 4 chrome partial regions are inside `<body>` — Phase 39-03 byte-identity gate intact
- Pre-commit hook bypassed via `--no-verify` per the parallel-execution wave protocol from Wave 1 (the orchestrator validates hooks once after the worktree merges)

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate 4 favicon assets at repo root** — `fb50bf9` (feat) — 4 new files (favicon.ico, favicon.svg, apple-touch-icon.png, site.webmanifest), 25 insertions
2. **Task 2: Wire 4 favicon link tags into `<head>` of all 6 HTML pages** — `de45a78` (feat) — 6 modified files, 25 line insertions (4 per page in 5 of the 6 files; 5 in treatment-abroad.html which preserves an existing blank-line separator between `<meta name="theme-color">` and the next link block)
3. **Task 3: Playwright MCP + curl verification (D-06)** — *pending human-verify checkpoint, owned by orchestrator/verifier*

## Files Created

### favicon.ico — 6003 bytes

- Format: real Windows ICO multi-size (16x16, 32x32, 48x48)
- Generated via Pillow `Image.save('favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)])` from a 256×256 LANCZOS-resized intermediate of the white-padded square source
- `file favicon.ico` output: `MS Windows icon resource - 3 icons, 16x16 with PNG image data, 16 x 16, 8-bit/color RGBA, non-interlaced, 32 bits/pixel, 32x32 with PNG image data, 32 x 32, 8-bit/color RGBA, non-interlaced, 32 bits/pixel`
- Note: `file` truncates its output after listing the first 2 sub-images; the 48x48 frame **is** present but does not appear in the truncated text. Verified independently via Pillow:
  ```
  >>> Image.open('favicon.ico').info['sizes']
  {(16, 16), (32, 32), (48, 48)}
  ```
  All 3 frames load successfully (`mode=RGBA` for each).

### favicon.svg — 698 bytes

- Format: SVG Scalable Vector Graphics image
- Single root `<svg viewBox="0 0 64 64">` with one `<linearGradient>` (`#1AC67E` → `#0D9DB5`), one rounded-square `<rect rx="14">` background, and two stroked `<path>` elements approximating the interlocking-curve silhouette of the production PNG
- Hand-drawn (NOT a pixel-perfect tracing) per D-04 — visually consistent silhouette in vector form
- Both gradient stop colors present (`grep -c '#1AC67E' favicon.svg` → 1, `grep -c '#0D9DB5' favicon.svg` → 1)
- 698 bytes is 34% of the 2048-byte target ceiling

### apple-touch-icon.png — 17195 bytes

- Format: PNG image data, 180 x 180, 8-bit/color RGBA, non-interlaced
- Source: 494×505 RGBA production PNG (non-square)
- Pipeline: pad to 505×505 white-background square (offset center) → LANCZOS-downscale to 180×180 → save with `optimize=True` and stripped metadata via fresh-canvas paste
- Background: white (per CONTEXT.md "Claude's Discretion" — iOS rounded-rect mask makes white edges invisible)

### site.webmanifest — 539 bytes

```json
{
  "name": "MedicusUnion KZ — онлайн-консультации, лечение и чек-апы за рубежом",
  "short_name": "MedicusUnion",
  "lang": "ru-KZ",
  "start_url": "/",
  "display": "browser",
  "theme_color": "#1AC67E",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/favicon.ico",          "sizes": "16x16 32x32 48x48", "type": "image/vnd.microsoft.icon" },
    { "src": "/favicon.svg",          "sizes": "any",               "type": "image/svg+xml" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180",           "type": "image/png" }
  ]
}
```

- `python3 -c 'import json; json.load(open("site.webmanifest"))'` exits 0 (valid JSON)
- `display: "browser"` is intentional — full PWA install behavior is explicitly out of scope per CONTEXT.md "Out of scope" (no offline mode, no install prompt)
- `theme_color: #1AC67E` matches the SVG gradient start stop and the brand CTA gradient identity

## Files Modified (6 HTML pages)

The same 4 lines (or 5 in `treatment-abroad.html`, which preserves a blank-line separator) were inserted into `<head>` immediately after the unique anchor `<meta name="theme-color" content="#38C6F4">`:

```html
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
```

| File | theme-color line (verified) | Insertion landed at | Lines added |
|------|-----------------------------|---------------------|-------------|
| index.html              | 19 | 20-23 | 4 |
| online-consultations.html | 22 | 23-26 | 4 |
| treatment-abroad.html   | 26 | 28-31 (preserves blank line at 27) | 5 |
| checkup.html            | 19 | 20-23 | 4 |
| contacts.html           | 19 | 20-23 | 4 |
| 404.html                |  9 | 10-13 | 4 |

**Total HTML insertions:** 25 lines across 6 files (`git diff --stat -- '*.html'` → `6 files changed, 25 insertions(+)`)

## Diff Applied (representative — index.html)

```diff
diff --git a/index.html b/index.html
@@ -19,6 +19,10 @@
   <meta name="theme-color" content="#38C6F4">
+  <link rel="icon" href="/favicon.ico" sizes="any">
+  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
+  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
+  <link rel="manifest" href="/site.webmanifest">
   <link rel="preload" href="css/styles.css" as="style">
```

The same 4-line block lands in the same position (after `theme-color`, before the next existing `<link>` line) in all 6 files.

## Acceptance Criteria — Task 1

| # | Criterion | Result |
|---|-----------|--------|
| 1 | `test -f favicon.ico` exits 0 | PASS |
| 2 | `test -f favicon.svg` exits 0 | PASS |
| 3 | `test -f apple-touch-icon.png` exits 0 | PASS |
| 4 | `test -f site.webmanifest` exits 0 | PASS |
| 5 | `file favicon.ico \| grep -q 'MS Windows icon resource'` returns 0 (real ICO format) | PASS |
| 6 | `file favicon.ico \| grep -q '16x16'` returns 0 | PASS |
| 7 | `file favicon.ico \| grep -q '32x32'` returns 0 | PASS |
| 8 | 48x48 frame present in favicon.ico | PASS (verified via `Image.open('favicon.ico').info['sizes']` returning `{(16,16),(32,32),(48,48)}`; `file` command truncates its output after listing 2 sub-images and does NOT print '48x48' in the truncated text — see "Deviations from Plan" for the methodology adjustment) |
| 9 | `file apple-touch-icon.png \| grep -q '180 x 180'` returns 0 | PASS |
| 10 | `wc -c < favicon.svg` returns ≤ 2048 | PASS (698 bytes) |
| 11 | `grep -q '<svg' favicon.svg` returns 0 | PASS |
| 12 | `grep -q '#1AC67E' favicon.svg` returns 0 | PASS |
| 13 | `grep -q '#0D9DB5' favicon.svg` returns 0 | PASS |
| 14 | `grep -q '"name"' site.webmanifest` returns 0 | PASS |
| 15 | `grep -q '"theme_color": "#1AC67E"' site.webmanifest` returns 0 | PASS |
| 16 | `grep -q '"background_color": "#ffffff"' site.webmanifest` returns 0 | PASS |
| 17 | `grep -q '"lang": "ru-KZ"' site.webmanifest` returns 0 | PASS |
| 18 | `grep -c '"src": "/favicon.ico"\|"src": "/favicon.svg"\|"src": "/apple-touch-icon.png"' site.webmanifest` returns 3 | PASS (3) |
| 19 | `python3 -c 'import json; json.load(open("site.webmanifest"))'` exits 0 | PASS |
| 20 | `test ! -f /tmp/medicus-favicon-source.png` exits 0 (temporary download removed) | PASS |
| 21 | SHA256 of source PNG recorded in SUMMARY (supply-chain hygiene per `<threat_model>` T-40-02) | PASS (`d415b5c10f7f8a1805f3a4b1ea84b8691e84baa62edf928d3a85f478235dfd77`) |

## Acceptance Criteria — Task 2

| # | Criterion | Result |
|---|-----------|--------|
| 1 | All 4 favicon link tags present in index.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 2 | All 4 favicon link tags present in online-consultations.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 3 | All 4 favicon link tags present in treatment-abroad.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 4 | All 4 favicon link tags present in checkup.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 5 | All 4 favicon link tags present in contacts.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 6 | All 4 favicon link tags present in 404.html | PASS (ico=1, svg=1, apple=1, manifest=1) |
| 7 | `grep -l 'rel="manifest" href="/site.webmanifest"' *.html \| wc -l` returns `6` | PASS (6) |
| 8 | `grep -A 3 '<meta name="theme-color"' {file} \| grep -q 'rel="icon" href="/favicon.ico"'` for all 6 (adjacency: 4 favicon tags follow theme-color directly; treatment-abroad uses `-A 5` because it preserves a blank line between theme-color and the favicon block) | PASS for all 6 files |
| 9 | `git diff --quiet -- partials/` returns 0 (chrome partials untouched) | PASS |
| 10 | `make build` exits 0 (Phase 39-03 byte-identity gate passes) | PASS (`make exit: 0`) |
| 11 | `git diff --quiet -- '*.html'` after `make build` (no chrome drift introduced by the build) | PASS (only the deliberate 6-file edits; no other HTML drift) |
| 12 | `git diff --stat` shows exactly 6 modified HTML files plus 4 new asset files (committed in the prior task) | PASS |

**Pre-commit hook note:** Per the Wave 1 / Wave 2 parallel-execution protocol from earlier in this phase, both Task 1 and Task 2 commits were created with `--no-verify`. The orchestrator runs the pre-commit hook once after the worktree merges into `feat/v3.1`, at which point it will independently re-run `make build` and `git diff --quiet -- partials/` against the merged tree. Both pass against this worktree (verified inline above), so the orchestrator's hook check is expected to pass against the merge commit.

## Decisions Made

- **Followed all 3 locked decisions D-02, D-03, D-04 from 40-CONTEXT.md verbatim** for the asset set scope, the production raster source, and the hand-drawn SVG in brand gradient.
- **Followed CONTEXT.md "Claude's Discretion" defaults** for asset location (repo root, not /icons/ subdirectory), apple-touch-icon background (white — invisible under iOS rounded-rect mask), and the minimum site.webmanifest field set (added `lang: "ru-KZ"` and listed 3 icons explicitly).
- **Deviation from Step 1.1 ImageMagick tooling: substituted Python Pillow 11.3.0** — see "Deviations from Plan" below. ImageMagick was not installed; Pillow was already present and equivalent for the operations needed; orchestrator pre-authorized this swap in the executor prompt.
- **No new architectural decisions arose during execution.**

## Deviations from Plan

### 1. [Tooling Deviation - Pre-authorized] Pillow substituted for ImageMagick

**Found during:** Task 1, Step 1.1 (verify ImageMagick installed)

**Issue:** The plan's Step 1.1 referenced ImageMagick (`magick` / `convert`), but neither command was available on the system. The plan offered https://realfavicongenerator.net/ as a manual fallback, but the orchestrator's executor prompt explicitly authorized **Python Pillow 11.3.0** (already installed system-wide) as a documented in-process deviation, with sample code for the equivalent operations.

**Justification:** Pillow can perform every operation the plan specified for ImageMagick:
- Read the downloaded PNG
- Write a multi-size `.ico` file via `Image.save('favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)])` — produces a real Windows ICO format file with 3 frames, NOT a renamed PNG (verified via Pillow's own ICO header parser, which lists `info['sizes'] = {(16,16),(32,32),(48,48)}` and successfully loads each frame at `mode=RGBA`)
- Pad a non-square source to a square with a background color (`Image.new('RGBA', (max_dim, max_dim), (255,255,255,255))` then `paste(src, offset, src)`)
- LANCZOS-downscale to 180×180
- Strip metadata by saving via a fresh canvas

Pillow is part of Python — the static HTML pages do not require any Python tooling to serve or render. Pillow is dev-only, used once during this plan, and can be uninstalled without affecting the site. **NOT a runtime dependency.**

**Files affected:** favicon.ico, apple-touch-icon.png (the two raster derivatives — favicon.svg and site.webmanifest were hand-written and Pillow was not involved in those)

**Commit:** fb50bf9

### 2. [Methodology Deviation - Cosmetic] `file favicon.ico | grep -q '48x48'` substituted with Pillow ICO header parse

**Found during:** Task 1 acceptance criterion verification

**Issue:** The plan listed `file favicon.ico | grep -q '48x48'` as one of the acceptance criteria asserting all 3 frames are present in the multi-size ICO. The `file` command on macOS truncates its output after listing the first 2 sub-images of an ICO, regardless of how many frames are actually present. So even though favicon.ico contains a valid 48x48 frame, the `file` command's truncated text does not contain the substring `48x48`, and the plan's grep would falsely fail.

**Verification substitution:** Pillow's own ICO header parser was used as the definitive multi-frame check:

```python
>>> from PIL import Image
>>> ico = Image.open('favicon.ico')
>>> ico.format
'ICO'
>>> sorted(ico.info['sizes'])
[(16, 16), (32, 32), (48, 48)]
>>> for sz in sorted(ico.info['sizes']):
...     ico.size = sz
...     ico.load()
...     print(sz, ico.mode)
(16, 16) RGBA
(32, 32) RGBA
(48, 48) RGBA
```

All 3 frames are present, all 3 load successfully at `mode=RGBA`. The `file` command output truncation is purely cosmetic — the underlying ICO is correct.

**No code change.** The favicon.ico was generated correctly on the first attempt; only the assertion methodology required substitution.

### 3. [Cosmetic Markup Deviation] treatment-abroad.html preserves a blank-line separator

**Found during:** Task 2

**Issue:** `treatment-abroad.html` is the only one of the 6 HTML pages that has a blank line between `<meta name="theme-color">` and the next `<link>` line (it follows a `<!-- Theme Color -->` HTML comment style with a blank line below). The plan's "OLD/NEW" anchor pattern was generic and would have produced 4 inserted lines like the other 5 files, but preserving the existing blank-line separator is the cleaner edit.

**Resolution:** The Edit operation on treatment-abroad.html targets the larger anchor `<meta name="theme-color" content="#38C6F4">\n\n  <link rel="preload" ...>` and replaces it with `<meta ...>\n  <link rel="icon" ...>\n  <link ...>\n  <link ...>\n  <link rel="manifest" ...>\n\n  <link rel="preload" ...>`. The blank line is preserved — the favicon block lands immediately after `theme-color` and immediately before the existing blank line. Adjacency check (`grep -A 5 '<meta name="theme-color"' treatment-abroad.html | grep -q 'rel="icon" href="/favicon.ico"'`) passes.

**Net effect:** treatment-abroad.html shows 5 line insertions in `git diff --stat` instead of 4 (the 5th is a blank-line repositioning). Total HTML insertions across all 6 files: 25 (4 × 5 + 5 × 1).

## Issues Encountered

- **Worktree branch base mismatch (resolved at start):** The worktree branch was at commit `8ba4986` (a stale main-line PR merge from before Wave 1) instead of the expected base `fd8b798` (Wave 1 verification commit). Resolved per the orchestrator's `<worktree_branch_check>` protocol via `git reset --hard fd8b798ff19c82bff91e4213edff12b2d699faa4` before any other work. Working tree was clean at the time of reset, no work lost. After reset, all Wave 1 changes (404.html text-3xl, checkup.html whitespace-nowrap span, 40-01/40-03 SUMMARYs, ROADMAP markers) were verified present in the base.
- **Tailwind binary download on first build:** When `make build` was run for the first time in this fresh worktree, the Makefile install step downloaded the Tailwind CLI v4.2.2 binary (~73MB) into a worktree-local cache directory. This is a one-time setup cost on a fresh clone — the binary is cached in a `.gitignore`'d location and was NOT committed. Subsequent builds in this worktree are instant.

## Threat Surface Scan

No new threat surface introduced beyond what the plan's `<threat_model>` already declared and mitigated:

- **T-40-02 (Tampering / Supply Chain — Tilda CDN PNG download):** Mitigated as planned. (a) HTTPS-only download via `curl -sSfL` with explicit `https://` scheme — verified. (b) SHA256 of downloaded PNG recorded in this SUMMARY (`d415b5c10f7f8a1805f3a4b1ea84b8691e84baa62edf928d3a85f478235dfd77`) for future regeneration auditability. (c) PNG processed into derivative assets and discarded — only the inspectable derivatives are committed.
- **T-40-03 (Information Disclosure — site.webmanifest):** Accept disposition unchanged. site.webmanifest is a static JSON file with no scripting, no user data, no auth tokens.
- **T-40-04 (Spoofing / Phishing — favicon.svg):** Accept disposition unchanged. favicon.svg contains no `<script>` element, no event handlers, no external URL references — verified by inspection (only `<defs>`, `<linearGradient>`, `<rect>`, `<path>`, `<stop>` elements).
- **T-40-05 (Denial of Service — favicon endpoint):** Accept disposition unchanged. Static files served by static host with no application-layer logic.

No new flags. No additional surface introduced.

## Verification Results — Task 3 (Playwright MCP + curl)

**Status: PENDING** — owned by orchestrator/verifier per Wave 2 protocol. The executor does NOT run Playwright MCP verification in the worktree; the orchestrator merges this worktree into `feat/v3.1`, starts a local static server, and runs the curl/Playwright assertions against the merged tree.

The verification protocol the orchestrator will run (per plan Task 3 `<how-to-verify>`):

### Step A — curl assertions (favicon endpoints serve 200 with correct content-type)

```sh
python3 -m http.server 8000 &
curl -sI http://localhost:8000/favicon.ico         | head -3
curl -sI http://localhost:8000/favicon.svg         | head -3
curl -sI http://localhost:8000/apple-touch-icon.png | head -3
curl -sI http://localhost:8000/site.webmanifest    | head -3
```

Required: HTTP 200 on all 4 endpoints with `Content-Type: image/vnd.microsoft.icon` (or `image/x-icon`), `image/svg+xml`, `image/png`, and (any 200 for site.webmanifest — Python's basic server may report `application/octet-stream`; real Nginx deploys configure the proper MIME map).

### Step B — Playwright MCP browser_console_messages on all 6 pages (zero favicon-related 404s)

For each of the 6 pages: navigate via `mcp__playwright__browser_navigate` to `http://localhost:8000/{page}.html`, run `mcp__playwright__browser_console_messages`, and assert zero entries match `favicon|404|Failed to load resource.*\.ico`.

### Step C — Playwright MCP browser_evaluate DOM query on all 6 pages (4 link tags parsed)

```js
() => ({
  icon_ico:    !!document.querySelector('link[rel="icon"][href="/favicon.ico"]'),
  icon_svg:    !!document.querySelector('link[rel="icon"][href="/favicon.svg"]'),
  apple_touch: !!document.querySelector('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]'),
  manifest:    !!document.querySelector('link[rel="manifest"][href="/site.webmanifest"]')
})
```

Required: all 4 properties === true on every one of the 6 pages.

### Step D — GitHub Pages live-URL curl after deploy

```sh
curl -sI https://micicipi420.github.io/Medicus_video_consult-landing/favicon.ico | head -3
```

Required: HTTP 200 with image content-type, after the GitHub Pages build completes for the merged commit on `feat/v3.1`.

**On verifier completion:** the SUMMARY's "Verification Results" section will be updated in-place by the orchestrator with the actual curl headers, console-message counts, DOM-query results table, and live-URL verification — same pattern as Wave 1's 40-01-SUMMARY.md and 40-03-SUMMARY.md.

## User Setup Required

None — no external service configuration required. Pillow was already installed system-wide (verified via `python3 -c 'from PIL import Image; print(Image.__version__)'` returning `11.3.0`), and Pillow is NOT a runtime dependency. The static HTML pages do not require any Python tooling to serve or render.

## Next Phase Readiness

- 4 favicon assets are at the repo root and the 4 link tags are wired into the head of all 6 HTML pages
- `make build` exits 0; partials clean; no chrome drift
- Wave 2 of Phase 40 is complete pending Task 3 (Playwright MCP verification by orchestrator)
- After the orchestrator merges this worktree, runs verification, and confirms zero favicon-related console errors on all 6 pages, Phase 40 Plan 04 (verifier) can run
- After Plan 04 completes, milestone v3.2 is ready for `/gsd-complete-milestone`

## Self-Check: PASSED

All claimed artifacts verified before returning checkpoint to the orchestrator:

| Claim | Result |
|-------|--------|
| `favicon.ico` exists at repo root | FOUND |
| `favicon.svg` exists at repo root | FOUND |
| `apple-touch-icon.png` exists at repo root | FOUND |
| `site.webmanifest` exists at repo root | FOUND |
| `.planning/phases/40-ux-cosmetic-cleanup/40-02-SUMMARY.md` exists | FOUND |
| Task 1 commit `fb50bf9` reachable in `git log` | FOUND |
| Task 2 commit `de45a78` reachable in `git log` | FOUND |
| `file favicon.ico` reports `MS Windows icon resource` | PASS |
| Pillow ICO parse confirms 3 frames {(16,16),(32,32),(48,48)} | PASS |
| `file apple-touch-icon.png` reports `180 x 180` | PASS |
| `wc -c < favicon.svg` ≤ 2048 (actual: 698) | PASS |
| `python3 -c 'import json; json.load(open("site.webmanifest"))'` exits 0 | PASS |
| `grep -c '<link rel="icon" href="/favicon.ico" sizes="any">' *.html` returns 1 per file × 6 | PASS |
| `grep -l 'rel="manifest" href="/site.webmanifest"' *.html \| wc -l` returns 6 | PASS |
| `make build` exits 0 | PASS |
| `git diff --quiet -- partials/` returns 0 (chrome clean) | PASS |
| `/tmp/medicus-favicon-source.png` does not exist (temporary download removed) | PASS |

---
*Phase: 40-ux-cosmetic-cleanup*
*Plan: 02*
*Tasks 1-2 completed: 2026-04-08*
*Task 3 status: awaiting human-verify checkpoint (Playwright MCP — orchestrator-owned)*
