# Phase 40: UX Cosmetic Cleanup — Context

**Gathered:** 2026-04-08
**Status:** Ready for planning
**Milestone:** v3.2 Build Pipeline & Chrome Partials

<domain>
## Phase Boundary

Close the 3 residual cosmetic items flagged by v3.1 Phase 38.1 Playwright UX validation at the source, so the mobile overflow safety net (`html { overflow-x: clip }`) is no longer compensating for underlying sizing bugs and the browser console is silent on first load.

**In scope (exactly these 3 fixes):**
- **COSMETIC-01** — 404.html H1 "Страница не найдена" fits within a 320px viewport without relying on `overflow-x: clip`
- **COSMETIC-02** — `/favicon.ico` returns HTTP 200 on every deployed path, zero console 404s on first load
- **COSMETIC-03** — checkup.html H1 phrase "за 1–2 дня" never breaks mid-range across any viewport width

**Out of scope (belongs in other phases):**
- Head-element extraction to a partial (scope creep — current partials pipeline covers chrome only)
- PWA features beyond basic site.webmanifest (no offline mode, no install prompt)
- Permanent Playwright test suite in repo (verification is ad-hoc via MCP tools; a persistent suite is its own phase if needed)
- Any additional UX audit findings discovered during Phase 40 — capture as deferred ideas
- Schema.org `logo` URL update (already correct — references external production URL)

</domain>

<decisions>
## Implementation Decisions

### COSMETIC-01: 404 H1 Mobile Sizing

- **D-01:** Change `404.html:110` H1 classes from `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` to `text-3xl sm:text-5xl md:text-6xl lg:text-7xl`. Single mobile step-down to 30px. Matches the existing Tailwind step-function pattern (no fluid clamp). Preserves the existing `Страница&nbsp;не&nbsp;найдена` nbsp binding — subject+verb nbsp rule stays intact. Expected outcome: phrase fits within 320px viewport width without relying on `html { overflow-x: clip }`.

### COSMETIC-02: Favicon Full Set

- **D-02:** Full icon set scope — `favicon.ico` + `favicon.svg` + `apple-touch-icon.png` (180×180) + `site.webmanifest`. All 4 files live at repo root (or in a dedicated `/icons/` subdirectory — planner's call, see "Claude's Discretion" below). 4 `<link>` tags added to the `<head>` of all 6 HTML pages: `rel="icon"` (ico), `rel="icon" type="image/svg+xml"` (svg), `rel="apple-touch-icon"` (png), `rel="manifest"`.

- **D-03:** Raster source — download the current production favicon PNG from `https://static.tildacdn.pro/tild6561-3034-4438-a235-376335643538/__2025-10-29_102930-.png` (verified 2026-04-08: returns HTTP 200, content-type `image/png`, last-modified 2025-10-29). This is the PNG actually served by medicusunion.kz via `<link rel="shortcut icon">`. Use it as the source of truth for raster variants: generate `favicon.ico` (multi-size 16/32/48) and `apple-touch-icon.png` (180×180, padded to square if the source is not 1:1). **The downloaded PNG must be committed as a permanent asset** — do not hotlink to the Tilda CDN at runtime.

- **D-04:** SVG variant — hand-draw `favicon.svg` to match the visual of the production PNG, using the brand gradient `#1AC67E → #0D9DB5` (the same `mu-cta-from → mu-cta-to` tokens used on CTA buttons and header logo). The SVG must be a separate deliverable (not embedded in HTML), small (~1-2KB), and visually consistent with the downloaded PNG — not a pixel-perfect tracing, but the same silhouette/symbol rendered cleanly in vector form.

### COSMETIC-03: Checkup H1 Range Binding

- **D-05:** Replace the current `checkup.html:138` fragment
  ```html
  <span class="text-mu-text-900"> &mdash; за&nbsp;1&ndash;2&nbsp;дня</span>
  ```
  with
  ```html
  <span class="text-mu-text-900"> &mdash; <span class="whitespace-nowrap">за 1&ndash;2 дня</span></span>
  ```
  Remove all entity-level nbsp inside this fragment — one Tailwind `whitespace-nowrap` span takes over. En-dash `&ndash;` (U+2013) is preserved — it's the correct typographic character for Russian numeric ranges. The entire "за 1–2 дня" phrase becomes a single unbreakable unit. It either sits on one line, or wraps as a whole to the next line — never splits mid-range.

### Verification Strategy (applies to all 3 fixes)

- **D-06:** Use Playwright MCP browser tools (`mcp__playwright__browser_navigate`, `browser_resize`, `browser_snapshot`, `browser_evaluate`) during the verify_phase_goal step. Snapshot and measure:
  - `404.html` at 320, 375, 768, 1024 — assert `documentElement.scrollWidth === clientWidth` (no horizontal overflow) and the H1 text is fully visible (no clipping)
  - `checkup.html` at 320, 375, 768, 1024, 1440, 1920 — assert the phrase "за 1–2 дня" is never split across lines (check via `getBoundingClientRect` or text-content range inspection)
  - `/favicon.ico` via `curl -sI` — assert HTTP 200, content-type `image/*`
  - Console messages via `browser_console_messages` — assert zero `favicon.ico` 404 entries on initial load of all 6 pages
- Results go into the plan SUMMARY.md and phase VERIFICATION.md. No permanent Playwright test files are committed — `.playwright-mcp/` stays in .gitignore. The executor/verifier runs these checks inline.

### Claude's Discretion

- **Plan granularity:** Planner decides whether to bundle all 3 fixes into one plan or split into 3 plans (e.g., wave-based). Recommendation: 3 small plans, one per COSMETIC, because they touch disjoint files and can be verified independently — but if the planner sees overlap or good reason to combine, that's fine.
- **Favicon file locations:** Root (`/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`, `/site.webmanifest`) vs subdirectory (`/icons/*`). Root is simpler and matches browser auto-request conventions. Either is acceptable — planner's call.
- **apple-touch-icon padding/background:** If the source PNG has transparency or isn't square, planner decides whether to center on white, use the brand gradient, or preserve transparency. iOS adds rounded-rect mask automatically — just ensure the content doesn't get clipped by the mask.
- **site.webmanifest fields:** At minimum `name`, `short_name`, `start_url: "/"`, `display: "browser"`, `theme_color` (use `#1AC67E` or `#0D9DB5` — brand gradient endpoint), `background_color: "#ffffff"`, `lang: "ru-KZ"`, `icons[]` array with all sizes. Planner adds optional fields if needed for validator compliance.
- **Tool for PNG → ICO conversion:** ImageMagick, sharp-cli, or online generator. Planner picks based on what's locally available.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/REQUIREMENTS.md` §"Cosmetic Cleanup" — COSMETIC-01, COSMETIC-02, COSMETIC-03 acceptance criteria (the 3 items Phase 40 closes)
- `.planning/ROADMAP.md` §"Phase 40: UX Cosmetic Cleanup" — goal, dependencies, and 3 numbered success criteria with viewport/measurement specifics

### Current codebase state
- `404.html:107-110` — 404 block with `text-8xl` "404" number + `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` H1 (the target of D-01)
- `checkup.html:133-139` — multi-span gradient H1 with `<br class="hidden lg:block">` and the breakable en-dash range (the target of D-05)
- `partials/header.html:3` — header logo is CSS-gradient text (`from-mu-cta-from to-mu-cta-to`), not an image — confirms there's no existing brand raster to reuse for favicon
- `src/styles/theme.css` — defines `mu-cta-from` (#1AC67E) and `mu-cta-to` (#0D9DB5) brand gradient tokens (for D-04 SVG gradient)

### External source for favicon
- `https://static.tildacdn.pro/tild6561-3034-4438-a235-376335643538/__2025-10-29_102930-.png` — production favicon PNG on Tilda CDN, served by `medicusunion.kz` via `<link rel="shortcut icon">` (verified 2026-04-08: HTTP 200, image/png, last-modified 2025-10-29). **Download once, commit, then reference locally — do not hotlink.**

### Verification history (what Phase 38.1 found)
- `.planning/milestones/v3.1-phases/38.1-mobile-viewport-overflow-checkup-h1-fix/` — v3.1 corrective phase that applied the `overflow-x: clip` safety net and documented these 3 residual items as deferred to v3.2
- `.planning/phases/39-partials-extraction-build-pipeline/39-02-SUMMARY.md` — Phase 39 Wave 2 chrome partial extraction. Phase 40 edits must NOT regress the LAYOUT-12 byte-identity gate — all edits here are in body/head regions outside the 4 extracted chrome partials, so the splicer is a no-op on the modified content. Pre-commit hook from Phase 39-03 will verify automatically.

### Typography conventions
- User memory `feedback_nbsp-subject-verb.md` — subject+verb nbsp binding is mandatory in Russian typography on this project (why D-01 preserves the existing `Страница&nbsp;не&nbsp;найдена` binding rather than removing it)
- User memory `feedback_nbsp-orphan-prevention.md` — orphan prevention on line wrap (first line ≥2 words AND ≥10 chars)
- En-dash (`–`, U+2013) is the canonical range separator in Russian typography — why D-05 keeps `&ndash;` and uses `whitespace-nowrap` CSS instead of downgrading to a hyphen

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Tailwind v4 step-function breakpoints** — `text-{size}`, `sm:text-{size}` etc. are used consistently across all 6 pages. D-01 follows this pattern instead of introducing `clamp()`.
- **Brand gradient tokens** — `mu-cta-from` (#1AC67E) and `mu-cta-to` (#0D9DB5) in `theme.css` are the canonical brand palette. Reused for favicon SVG (D-04) and manifest `theme_color`.
- **`.playwright-mcp/` dir already exists** — `.gitignore`d, used by MCP Playwright browser tools during ad-hoc sessions. Verification step (D-06) reuses this machinery without adding new infra.

### Established Patterns
- **Head elements are NOT in partials** — `partials/*.html` only covers the 4 chrome regions (header, footer, sticky-bar, mobile-menu). `<head>` is per-page. COSMETIC-02's `<link>` tags must be added to 6 HTML files directly (not to a partial).
- **6 HTML pages share identical structural regions** — when adding `<link>` tags for favicons, the same block of 4 lines goes into `<head>` of each of: index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, 404.html.

### Integration Points
- **Pre-commit hook from Phase 39-03** (`scripts/hooks/pre-commit`) runs `make build` on every commit and blocks commits that produce chrome drift. Phase 40 edits are outside partials, so the splicer is a no-op — the hook will pass cleanly. No changes to the hook itself.
- **GitHub Pages deploy** (live at `https://micicipi420.github.io/Medicus_video_consult-landing/`, building from `feat/v3.1` branch) will rebuild automatically on push. Verification should test the live URL after deploy, not just localhost, to confirm `/favicon.ico` actually serves 200 through the GitHub Pages pipeline.

</code_context>

<specifics>
## Specific Ideas

- **Production favicon is authoritative** — the user chose "стянуть с production" specifically because they want brand consistency with the parent medicusunion.kz site. Do not design a new icon from scratch.
- **Hand-drawn SVG is expected to match the PNG visually** — not pixel-perfect tracing, but the same silhouette / symbol rendered cleanly in vector form. The goal is "looks like the favicon on medicusunion.kz, but sharper at high-DPI and in the brand gradient".
- **`.ico` file is real ICO format, not PNG renamed** — browsers accept PNGs with .ico extension, but a proper multi-size ICO (16/32/48) is the correct deliverable. Use ImageMagick's `convert` or an equivalent tool.
- **Phase 40 is the final Phase of milestone v3.2** — after this, `/gsd-complete-milestone` closes v3.2 entirely.

</specifics>

<deferred>
## Deferred Ideas

- **Head-element partial extraction** — if the <head> gets more per-page variation over time, extract a `partials/head.html` with tokens. Not in v3.2 scope — the 4-tag addition here doesn't justify the structural change.
- **PWA install prompt + offline caching** — `site.webmanifest` enables the icon, but not the install experience. A real PWA (service worker, offline mode) is its own phase and belongs in a future "progressive enhancement" milestone if ever prioritized.
- **Permanent Playwright test suite** — if UX regressions keep showing up across milestones, consider adding `tests/ux.spec.js` + Playwright runner as a separate infrastructure phase. For now, ad-hoc MCP is enough because these 3 items are the only known regressions.
- **Old `phase32-regressions.md` debug session cleanup** — stale session from 2026-04-05 in `awaiting_human_verify` status. Not Phase 40 scope, but mentioned in progress check — close via `/gsd-debug` in a separate track.

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 40-ux-cosmetic-cleanup*
*Context gathered: 2026-04-08*
