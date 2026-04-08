---
phase: 40-ux-cosmetic-cleanup
status: clean
depth: standard
files_reviewed: 8
findings:
  blocker: 0
  warning: 0
  info: 2
reviewed: 2026-04-08
---

# Phase 40 Code Review

## Summary

All three cosmetic fixes are implemented correctly and match the phase plan artifacts exactly. The 404.html H1 class swap is clean and nbsp binding is preserved. The checkup.html whitespace-nowrap span uses plain spaces inside the span by explicit plan decision (entity-level nbsp inside the span were intentionally removed per 40-03-PLAN.md D-05). The favicon set is complete, the SVG is supply-chain clean, the manifest is valid JSON with all required fields, and the 4 link tags are byte-identical across all 6 HTML pages. No blockers, no warnings — two low-signal INFO notes recorded for traceability.

## Findings

### INFO: theme_color in manifest differs from meta theme-color

- **File:** `site.webmanifest` (`theme_color: "#1AC67E"`) vs all HTML pages (`<meta name="theme-color" content="#38C6F4">`)
- **Note:** Not a bug. The plan (40-02-PLAN.md line 276) explicitly specifies `#1AC67E` (brand green, the favicon SVG gradient start) for the manifest `theme_color`, while `#38C6F4` (mu-blue) is the existing per-page browser-chrome meta. The two values serve different purposes: one controls the OS home-screen/task-switcher chrome color (manifest), the other controls the browser address bar chrome (meta tag). The discrepancy is intentional and documented.

### INFO: context doc token value mismatch (non-actionable)

- **File:** `.planning/phases/40-ux-cosmetic-cleanup/40-CONTEXT.md` (canonical_refs section)
- **Note:** The context doc states `mu-cta-from (#1AC67E)` and `mu-cta-to (#0D9DB5)`. The actual `src/styles/theme.css` defines `mu-cta-from: #0E8FB5` and `mu-cta-to: #3B6DD0`. The color `#1AC67E` is the gradient start in the favicon SVG and corresponds to a different design-system green. The mismatch is in the planning artifact only — no shipped code is affected. The SVG gradient and manifest `theme_color` use `#1AC67E` as authorized by the plan, and this renders correctly. No code change required.

## Files Reviewed

- `404.html` — COSMETIC-01: H1 class changed `text-4xl` → `text-3xl` (mobile base). `Страница&nbsp;не&nbsp;найдена` subject+verb nbsp binding preserved verbatim. COSMETIC-02: 4 favicon link tags inserted after `<meta name="theme-color">` at lines 10–13.
- `checkup.html` — COSMETIC-03: `whitespace-nowrap` span wraps `за 1&ndash;2 дня`. En-dash `&ndash;` (U+2013) preserved. Inner nbsp entities intentionally removed per plan decision D-05 (span provides wrap prevention; nbsp inside is redundant and was explicitly called out for removal). COSMETIC-02: 4 favicon link tags at lines 20–23.
- `index.html` — COSMETIC-02: 4 favicon link tags at lines 20–23.
- `online-consultations.html` — COSMETIC-02: 4 favicon link tags at lines 23–26.
- `treatment-abroad.html` — COSMETIC-02: 4 favicon link tags at lines 28–31.
- `contacts.html` — COSMETIC-02: 4 favicon link tags at lines 20–23.
- `favicon.svg` — No `<script>` elements, no event handlers (`on*` attributes), no external URL references (only the standard SVG namespace declaration `http://www.w3.org/2000/svg`), no `xlink:href`, no `<use>`, no `<foreignObject>`. Pure geometry: `<rect>` + 2 `<path>` elements with a `<linearGradient>`. Supply-chain clean. File size ~698 bytes (well under the 2KB plan limit).
- `site.webmanifest` — Valid JSON. All required fields present: `name`, `short_name`, `start_url`, `display`, `icons[]`, `theme_color`, `background_color`. Project-specific `lang: "ru-KZ"` present. `display: "browser"` is intentional (no PWA install prompt, per CONTEXT.md out-of-scope decision). Icons array has 3 entries covering ico, svg, and png with correct MIME types and size declarations.
