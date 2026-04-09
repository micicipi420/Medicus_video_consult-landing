# Research Summary — v4.0 Liquid Design System

**Project:** MedicusUnion KZ
**Milestone:** v4.0 Liquid Design System
**Researched:** 2026-04-09
**Overall confidence:** HIGH on integration points and technique choices, MEDIUM on specific numeric tuning values, LOW on budget-Android perf numbers (extrapolated, not measured)

---

## Executive Summary

- **Zero new dependencies, zero Node runtime changes.** Every v4.0 technique — squircles, Liquid Glass, 12/8/2-3 grid — works with the existing `tailwindcss` standalone binary + POSIX-sh splicer + vanilla JS stack. No npm packages, no Houdini worklets, no build-tool additions.
- **Two CSS files + one HTML partial + theme.css extension = the entire v4.0 infrastructure addition.** `src/styles/squircles.css` (NEW), `src/styles/liquid-glass.css` (NEW), `partials/svg-defs.html` (NEW), `src/styles/theme.css` (EXTENDED). The byte-identity pre-commit hook and splicer pipeline from v3.2 handle propagation automatically.
- **One material variant only: Regular.** iOS 26 has two variants (Regular, Clear). Clear is an anti-feature for our medical ЦА 45+ context (no adaptive legibility help, fails WCAG AA over photo backgrounds). The orchestrator prompt's "5 variants" refers to iOS 17 UIBlurEffect legacy styles — not iOS 26. iOS 26 has two; we use one.
- **Primary CTA stays gradient-filled.** Liquid Glass on secondary/tertiary buttons only. The green→teal gradient is the conversion-critical affordance; translucent primary CTAs are invisible to ЦА 45+ Android users unfamiliar with iOS glass conventions.
- **9 BLOCKERs must resolve before their phase can merge.** Focus-visible ring migration (C1), byte-identity hook compliance (C2), overflow-x clip safety net (C3), nbsp bindings (C4), SEO head content (C5), dark selector audit (C6), honeypot (C7), ARIA live regions (C8), vertical rhythm compatibility (C9). Each is a regression from v3.x if missed.

---

## Stack Decisions (canonical picks)

### Squircle technique

**Default (production):** `mask-image` with inline SVG data-URI, `mask-size: 100% 100%`, `preserveAspectRatio="none"`. Four variants only: md/lg/xl/full. Skip sm (8px is visually indistinguishable from `border-radius`; saves data-URI bloat).

**Progressive enhancement:** `corner-shape: superellipse(2)` inside `@supports (corner-shape: superellipse(2))` for Chrome 139+ (August 2025+). Wipes the mask; native GPU-accelerated; no clipping side effects.

**Fallback chain:**
```
Chrome 139+:          corner-shape: superellipse(2)   — native, no mask, no clipping issues
Safari/Firefox/Chrome <139:  mask-image SVG data-URI   — production default
Browsers without mask-image: border-radius              — graceful rounded rectangle
```

**Critical shadow-wrap pattern:** `mask-image` clips `box-shadow`, `border`, and `outline`. Outer drop-shadows must live on an un-masked wrapper div (`.liquid-card-wrap`). Applies to: cards, primary buttons, secondary buttons. Icon chips and badges are exempt (no outer shadow). Inset box-shadows are safe inside the mask.

**Focus-visible BLOCKER (Phase 1):** Current `@layer base` uses `box-shadow` for focus rings — clipped by `mask-image`, breaking WCAG 2.1 SC 2.4.7. Must change to `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` before any squircle class lands.

**CONFLICT resolved:** FEATURES.md Recipe 2 uses `corner-shape: squircle`; STACK.md uses `corner-shape: superellipse(2)`. These may be synonyms in the Chrome 139+ spec — executor must verify against current MDN at Phase 2 time. Either keyword works until proven otherwise.

### Liquid Glass materials

**Chosen:** one material (Regular), four blur scales (sm/md/lg/xl = 16/24/40/60px).

**Light-mode recipe (theme.css `:root`):**
```css
--liquid-bg: rgba(255, 255, 255, 0.18);
--liquid-blur-md: 24px;
--liquid-saturate: 180%;
--liquid-brightness: 108%;
--liquid-border-top: rgba(255, 255, 255, 0.9);
--liquid-shadow-outer: 0 16px 40px rgba(20, 30, 60, 0.12);
--liquid-shadow-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.9);
--liquid-shadow-inset-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
```

**Dark-mode recipe (theme.css `.dark` block — reverses v1.4 "glass-off" decision):**
```css
--liquid-bg: rgba(30, 40, 60, 0.45);  /* dark tint, not white tint */
--liquid-blur-md: 28px;
--liquid-saturate: 160%;
--liquid-brightness: 115%;
--liquid-border-top: rgba(255, 255, 255, 0.25);
```

**Dark-mode selector:** use `.dark` (the existing theme.css convention), not `[data-theme="dark"]`. PROJECT.md mentions `[data-theme="dark"]` but `theme.css` actually uses `.dark`. Phase 1 prerequisite: audit `js/main.js` to confirm which form the toggle JS uses before writing any new tokens.

**Refraction (Chrome-only PE):** inline SVG `feTurbulence + feDisplacementMap` in `partials/svg-defs.html`. JS probe sets `html[data-refract="true"]`. Safari/Firefox show blur-only glass. This is progressive enhancement, not a baseline requirement.

### Grid system

**Canonical class triplet:** `grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-content mx-auto`

| Breakpoint | Cols | Gutter | Max-width |
|---|---|---|---|
| Mobile (< 768px) | 2 (3 for icon/stat rows) | 16px | 100vw − 32px |
| Tablet (`md:`, 768px+) | 8 | 24px | 100vw − 48px |
| Desktop (`lg:`, 1024px+) | 12 | 32px | 1200px |

New token: `--container-max-content: 1200px` → `@theme inline` → `max-w-content` utility. No `tailwind.config.js` needed. Tailwind v4.2.2 generates `grid-cols-8` and `grid-cols-12` natively.

**Single `<main class="liquid-grid ...">` per page.** Sections span full width; internal layouts use `grid-cols-subgrid`. Subgrid is Baseline 2026 (Chrome 117+, Firefox 71+, Safari 16+).

**Tablet card minimum:** `md:col-span-4` for any text-bearing card. Russian compounds like `высококвалифицированный` don't fit in 176px (2-col at tablet).

### Motion library

**Stay on Motion 12.x CDN.** No version bump. Relevant APIs: `animate()` for spring hover, `inView()` for scroll-reveal, `scroll()` for header blur, `type: 'spring', stiffness: 150, damping: 20` for Apple-feel.

New motion tokens (theme.css):
- `--ease-liquid: cubic-bezier(0.2, 0, 0, 1)` — press, hover, sheet
- `--ease-liquid-out: cubic-bezier(0.16, 1, 0.3, 1)` — scroll-reveal
- `--dur-press: 120ms` / `--dur-hover: 280ms` / `--dur-sheet: 400ms`

### Font stack

**Unchanged.** SF Pro Display / SF Pro Rounded via `-apple-system, BlinkMacSystemFont` fallback. iOS 26 does not add a new SF Pro web variant. Self-hosting violates Apple EULA.

### Anti-recommendations (explicit)

| Do NOT use | Why |
|---|---|
| `figma-squircle` npm | Requires Node install; no precompiled CDN UMD |
| `smooth-corners` Houdini worklet | Safari/Firefox zero support; disabled on `<a href>` elements |
| `will-change: backdrop-filter` | Makes perf worse — multiplies compositor layer cost |
| `text-wrap: balance` on Cyrillic | v3.0 decision: unreliable; breaks nbsp bindings |
| Nested backdrop-filter (glass inside glass) | Nested stacking contexts; doubled perf cost; z-index chaos |
| `@tailwindcss/container-queries` plugin | Obsolete — native in Tailwind v4 |
| Alpine.js / htmx / Stimulus | Zero-framework policy |
| Clear material variant | No adaptive legibility for ЦА 45+; fails WCAG AA |

---

## Feature Landscape

### Table Stakes — 14 components

| Component | Surfaces | Complexity |
|---|---|---|
| Primary CTA (gradient + squircle + specular edge) | Hero + form submit, all 6 pages | Moderate |
| Secondary button (Regular glass) | "Подробнее", hero secondary, all pages | Moderate |
| Icon button (circular glass) | Menu trigger, dark toggle, phone — via partials | Trivial |
| Card (Regular glass + squircle-lg) | Service/clinic/review/pricing/FAQ cards | Moderate |
| Form container (panel glass) | Form shell on all 6 pages | Moderate |
| Text field + textarea | Name, phone, description on all forms | Moderate |
| Select trigger (glass) | Specialization dropdown on all forms | Moderate |
| Nav bar (Regular glass) | `partials/header.html` — propagates to 6 pages | Moderate |
| Sticky mobile bar (tab-bar analog) | `partials/sticky-bar.html` | Moderate |
| Mobile menu drawer (sheet glass) | `partials/mobile-menu.html` | Moderate |
| Squircle radius scale (md/lg/xl/full) | Every rounded element, all pages | Moderate |
| Responsive 12/8/2-3 grid | All 6 pages | Moderate |
| Form success overlay (alert glass) | `form__success` on all form pages | Trivial |
| Badge / chip (glass) | Hero badge, pricing badge, card badges | Trivial |

### Differentiators — 5 components

| Component | Surfaces | Complexity |
|---|---|---|
| Shimmer sweep on hover | Hero primary CTA only — max 1 per page | Moderate |
| Rim lighting (asymmetric inset shadow) | Every glass surface, pairs with `.liquid-regular` | Trivial |
| Scroll-edge fade at chrome overlap | Hero/sticky-bar boundaries | Moderate |
| Stats bar grouped glass backdrop | index.html + checkup.html | Moderate |
| `corner-shape` PE | Chrome 139+ enhancement layer | Trivial |

### Anti-Features — excluded

Clear material variant, cross-browser refraction, chromatic aberration, center specular cursor-follow, animated gradient mesh, shimmer beyond hero CTA, scroll-linked parallax, sidebar, context menu, command palette, page indicators, sliders, steppers, pickers.

### Per-page migration complexity

| Page | Complexity | Notes |
|---|---|---|
| 404.html | Trivial | Single CTA + partials |
| contacts.html | Trivial | Contact card + form + partials |
| checkup.html | Moderate | Program cards, stats, B2B, form |
| online-consultations.html | Moderate | Doctor/pricing/trigger cards, form |
| treatment-abroad.html | Moderate | Clinic + step + review cards, form |
| index.html | Complex | 13 sections, floating hero cards, most surfaces |

---

## Architecture Plan

### New files

| File | Purpose |
|---|---|
| `src/styles/squircles.css` | 4 SVG mask data-URIs, `.squircle-*` utility classes, `@supports corner-shape` PE |
| `src/styles/liquid-glass.css` | All `.liquid-*` semantic classes, `@media print` fallback, `@supports` refraction PE |
| `partials/svg-defs.html` | Hidden `<svg><defs><filter id="liquid-refract">` — spliced into all 6 pages |
| `docs/DESIGN-SYSTEM.md` | Shadow-wrap idiom, class inventory, token scale, anti-patterns, Russian typography rules |

### Modified files

| File | Change |
|---|---|
| `src/styles/tailwind.css` | Add `@import './squircles.css'` and `@import './liquid-glass.css'` after theme.css |
| `src/styles/theme.css` | Add squircle/liquid/motion tokens, `--container-content`, extend `.dark` block, refactor `:focus-visible`, extend reduced-motion block |
| `scripts/build-pages.sh` | Line 19: add `svg-defs` to PARTIALS — one-line change |
| `partials/header.html` | `.liquid-nav`, `.squircle-xl`, `max-w-7xl` → `max-w-content` |
| `partials/footer.html` | Liquid treatment, `max-w-7xl` → `max-w-content` |
| `partials/mobile-menu.html` | `.liquid-sheet`, `.squircle-xl`, `.squircle-full` on buttons |
| `partials/sticky-bar.html` | `.liquid-sticky-bar`, `.squircle-full` |
| `js/main.js` | ~10 LOC refraction JS probe → `html[data-refract="true"]` |
| All 6 HTML pages | `BUILD:svg-defs` marker block + `<main class="liquid-grid ...">` + card/form/button class migration |

### Protected files (must not be touched)

```
scripts/hooks/pre-commit                    — byte-identity gate
scripts/build-pages.sh lines 59-169        — only line 19 PARTIALS may change
theme.css vertical rhythm tokens            — --section-h-hero-*, --spacing-section-*
theme.css WCAG AA text tokens               — --mu-text-900/700/500, --mu-cta-from/to
theme.css line 274 overflow-x: clip        — mobile safety net
theme.css @media reduced-motion block      — extend only, never remove
Honeypot fields on all forms
ARIA role="alert" + aria-live on 20 error containers
<br class="md:hidden"> in hero headings
All &nbsp; entities in Russian content
<span class="whitespace-nowrap"> in checkup.html hero
Per-page <head>: title, meta, og, canonical, JSON-LD (index.html only)
Favicon link set (4 <link> per page)
```

### Phase build order with cross-phase gates

```
Phase 1: Foundation tokens (theme.css only, no HTML)
Phase 2: Squircle primitives (squircles.css, 4 SVG masks, @supports)
Phase 3: Liquid Glass primitives (liquid-glass.css, JS probe, dark recipe tuning)
Phase 4: SVG defs partial + chrome partials (atomic commit; byte-identity gate)
Phase 5: Simple pages — 404.html + contacts.html
Phase 6: Service pages — checkup, online-consultations, treatment-abroad (parallelizable)
Phase 7: Index page (highest complexity)
Phase 8: A11y + perf verification (keyboard, WCAG AA, dark-mode visual, budget Android FPS)
Phase 9: Docs (DESIGN-SYSTEM.md + optional styleguide.html)
```

Universal gate after every phase: `make build` exits 0 + `make check` (byte-identity) passes.

---

## Watch Out For (top 10 pitfalls)

### BLOCKERs

| # | Pitfall | Phase | Mitigation |
|---|---|---|---|
| C1 | **Focus ring disappears on squircled elements** — `box-shadow` ring clipped by `mask-image`, WCAG 2.1 failure | 1 | Refactor `:focus-visible` to `outline + outline-offset` in `theme.css @layer base` before Phase 2 |
| C2 | **Byte-identity hook blocks partial changes** — new `svg-defs` partial, incomplete commits rejected | 4 | Plan full commit anatomy; `make check` before commit; grep confirms all 6 pages have `BUILD:svg-defs` marker |
| C3 | **`overflow-x: clip` removed from theme.css** — reintroduces mobile horizontal-scroll from v3.1 | 1, 7 | Phase 1 gate: `grep -c 'overflow-x: clip' src/styles/theme.css` = 1; Phase 7: 320px viewport check |
| C4 | **Russian nbsp bindings destroyed during page edits** — `&nbsp;`, `whitespace-nowrap`, `<br class="md:hidden">` lost | 5-7 | Baseline `grep -c '&nbsp;' *.html` before migration; count must not decrease at each phase gate |
| C5 | **SEO head content deleted** — JSON-LD, og tags, canonical, meta description lost | 5-7 | Per-page head-content diff: additions only, never deletions |
| C6 | **Dark selector mismatch causes glass to silently fail** — `.dark` vs `[data-theme="dark"]` | 1 | Audit `js/main.js` before writing any dark tokens; use whichever the toggle JS actually sets |
| C7 | **Honeypot field stripped in form refactor** — invisible spam protection loss | 5-7 | Grep honeypot field name before/after; test bot-submission is rejected |
| C8 | **ARIA `role="alert"` removed** — screen reader announcements break | 5-7 | `grep -c 'role="alert"\|aria-live'` before/after must be identical |
| C9 | **Hero collapses inside grid wrapper** — grid may override `min-h-section-hero-*` svh tokens | 4 | Never declare explicit `grid-template-rows` on `.liquid-grid`; implicit rows respect `min-height` |

### HIGHs

| # | Pitfall | Phase | Mitigation |
|---|---|---|---|
| H3 | **Stacking contexts multiply with backdrop-filter** — form success overlay, floating hero cards render behind wrong layers | 3, 5, 7 | Use contacts.html as stacking context canary in Phase 5; full z-index map before Phase 7 |
| H4 | **WCAG AA fails over translucent backgrounds** — automated tools see declared color, not effective backdrop | 3, 8 | Use `--mu-text-900` on glass surfaces; manual pixel-sample contrast check in Phase 8 |
| H5 | **Dark-mode reproduces v1.4 "murky navy smear"** — recipe values are estimates | 3, 8 | Phase 3 tuning subtask on test fixtures; Phase 8 visual review on every page |
| H8 | **Budget Android FPS < 30** — 30+ glass surfaces exceed GPU budget | 8 | Measure on Samsung Galaxy A32/A52 or Xiaomi Redmi Note 10; mobile blur mitigation: `@media (max-width: 640px) { --liquid-blur-md: 12px }` |
| H9 | **Secondary glass CTA reads as decoration to ЦА 45+** | 3 | `font-semibold`; visible hover brightening; press `scale(0.97)`; icon + arrow label |

---

## Protected Legacy

What v3.0–v3.2 work must survive v4.0 intact:

1. nbsp bindings — subject+verb, orphan prevention, numeric ranges throughout all pages
2. `<br class="md:hidden">` — Russian compound phrase breaking in hero headings
3. `<span class="whitespace-nowrap">за 1–2 дня</span>` in checkup.html (v3.2 COSMETIC-03)
4. Honeypot hidden inputs on all 6 forms
5. `role="alert"` + `aria-live="polite"` on 20 form error containers
6. Per-page SEO metadata — `<title>`, `<meta name="description">`, og tags, canonical, JSON-LD on index.html
7. Favicon set (4 `<link>` per page)
8. Vertical rhythm tokens — `--section-h-hero-*`, `--section-pt*` (v3.1 Phase 38)
9. WCAG AA text tokens — contrast ratios must not decrease
10. `html { overflow-x: clip }` — v3.1 Phase 38.1 safety net
11. `@media (prefers-reduced-motion: reduce)` guard — extend only
12. `scroll-margin-top: 6rem` on anchor targets
13. Byte-identity pre-commit hook — untouchable

---

## Scope Creep Guards

| Temptation | Why no |
|---|---|
| Rewrite copy for "more Apple tone" | Copywriting locked per v2.0 (копирайтинг-документы first) |
| Replace SF Pro with Inter variable font | v2.0 intentionally removed Inter; EULA prohibits self-hosted SF Pro |
| Add Kazakh language toggle | PROJECT.md out-of-scope: только русский |
| Scroll-linked parallax "like apple.com" | ЦА 45+ vestibular concern; PROJECT.md explicit out-of-scope |
| Add Playwright regression tests | Valid, but its own milestone — not v4.0 |
| Extract `<head>` to a partial | Rejected in ARCHITECTURE.md E.2; massive BUILD:vars vocabulary cost |
| `text-wrap: balance` on Russian headings | v3.0 decision: unreliable for Cyrillic; breaks nbsp bindings |
| Dark-mode tinted glass variants (green, blue) | Adds complexity not in v4.0 scope |
| Refactor existing class names | Churn + byte-identity fires; add `.liquid-*` additively |
| Replace Directus backend | v1.0 Key Decision |
| View Transitions API navigation | Static multi-page; zero measurable benefit |
| Analytics / telemetry | Privacy implications; use manual Phase 8 measurement |

---

## Open Questions for Planning Phases

| Question | Where to resolve | Implication |
|---|---|---|
| **Dark mode selector: `.dark` or `[data-theme="dark"]`?** | Phase 1 prerequisite — grep `js/main.js` | All dark-mode glass tokens must be in the correct selector |
| **Budget Android test device selection** | Phase 8 planning | Must be a real 2020-2022 device (Samsung Galaxy A32/A52 or Xiaomi Redmi Note 10) |
| **Squircle k-value visual tuning** | Phase 2 smoke test | `superellipse(2)` is recommended; verify on our button + card sizes |
| **Dark-mode recipe numeric values** | Phase 3 tuning subtask | Research values are best-guess; 2-day tuning budget in Phase 8 |
| **`corner-shape: squircle` vs `superellipse(2)` syntax** | Phase 2 — re-check MDN at execution time | FEATURES.md and STACK.md disagree; may be synonyms in Chrome 139+ |
| **Rotate-vs-squircle for index.html icon chips** | Phase 7 per-chip decision | `group-hover:rotate-3` + `mask-image` distorts on Safari; drop rotate or skip squircle |
| **Mesh-bg blob blur reduction** | Phase 7 | Recommend 120px → 60px; confirm in visual review |
| **Squircle SVG path strings** | Phase 2 executor generates them | Research describes the math; actual `d=` paths for md/lg/xl/full must be hand-authored |

---

## Suggested Phase Structure

9-phase canonical sequence synthesized from all 4 researchers. Downstream roadmapper uses this as starting point.

| # | Phase | Rationale | Parallelizable? |
|---|---|---|---|
| 1 | Foundation tokens | theme.css extensions, focus-visible migration, dark selector audit — no HTML changes. All later phases depend on these tokens | No |
| 2 | Squircle primitives | squircles.css + SVG masks + @supports PE. Depends on Phase 1 tokens | No |
| 3 | Liquid Glass primitives | liquid-glass.css + print fallback + JS probe + dark recipe tuning. Depends on Phase 1; can run parallel with Phase 2 once Phase 1 is stable | Parallel with Phase 2 |
| 4 | SVG defs partial + chrome upgrade | New partial + 4 chrome partials restyled. Atomic commit. Depends on Phases 2+3 | No |
| 5 | Simple pages (404, contacts) | Canary for stacking contexts, nbsp, ARIA, honeypot. Depends on Phase 4 | No (build confidence) |
| 6 | Service pages (3 pages) | checkup, online-consultations, treatment-abroad. Each independent | Yes — 3 parallel streams |
| 7 | Index page | Most complex (13 sections, floating cards). Last — all patterns proven first | No |
| 8 | A11y + perf verification | Keyboard, WCAG AA, dark-mode visual, budget-Android FPS | No |
| 9 | Docs | DESIGN-SYSTEM.md + optional styleguide.html | Partial overlap with Phase 8 |

**Research flags (phases needing deeper work):**
- **Phase 3:** dark-mode recipe requires real-device tuning — not researchable in advance
- **Phase 7:** index.html needs z-index map before execution; stacking context risks are highest here
- **Phase 8:** requires real budget-Android hardware; DevTools throttle is insufficient for compositor cost

**Standard patterns (skip research-phase):**
- Phase 1: token extension in theme.css — established pattern from v2.0+
- Phase 2: squircle SVG masks — fully researched; path authoring is manual but documented
- Phase 4: partial update workflow — established v3.2 pattern; byte-identity hook proven
- Phase 9: documentation — write-only

---

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| Stack — squircle technique | HIGH | mask-image + corner-shape PE validated against MDN, Smashing Magazine 2026, Chrome Platform Status |
| Stack — Liquid Glass CSS recipe | HIGH (technique) / MEDIUM (numbers) | Multi-layer CSS approach confirmed by LogRocket, CSS-Tricks, kube.io; blur/opacity values are community estimates |
| Stack — grid system | HIGH | Tailwind v4.2.2 native grid confirmed; 8-col tablet is project decision, externally valid at 8 or 6 col per references |
| Stack — Motion 12.x | HIGH | Stable API, all referenced methods documented |
| Features — table stakes list | HIGH | 14 components mapped to existing surfaces; Apple component taxonomy confirmed via WWDC25 Session 219 |
| Features — material taxonomy | HIGH | "Regular only, Clear is anti-feature" — triangulated from Apple HIG + conorluddy reference + createwithswift |
| Architecture — file layout | HIGH | Existing codebase fully documented; minimal new-file footprint |
| Architecture — migration order | HIGH | 9-phase dependency graph validated across all 4 researchers |
| Pitfalls — C-series BLOCKERs | HIGH | All traceable to specific existing code; regression risks from v3.x behavior |
| Pitfalls — H-series | HIGH (identification) / MEDIUM (mitigation values) | Mitigation strategies sound; exact thresholds need real-device confirmation |
| Dark-mode recipe tuning | MEDIUM | v1.4 failure suggests dark glass is non-trivial; Phase 3 tuning subtask is mandatory |
| Budget Android perf | LOW | Estimated from published benchmarks; not measured on specific Samsung/Xiaomi models in KZ market |

**Overall: HIGH** on what to build and how. **MEDIUM** on specific recipe values requiring real-device tuning.

### Gaps to address

- **Dark-mode glass recipe:** Phase 3 tuning subtask mandatory; allow 2-day Phase 8 budget for dark-mode iteration
- **Budget Android FPS floor:** measure on real Samsung Galaxy A32/A52 or Xiaomi Redmi Note 10 in Phase 8
- **`corner-shape` keyword syntax:** re-check MDN at Phase 2 execution; `squircle` vs `superellipse(2)` may be synonyms
- **Squircle SVG path strings:** Phase 2 executor must generate 4 superellipse path `d=` values (md/lg/xl/full) — research describes the math, not the actual strings

---

## Sources (aggregated)

**HIGH confidence:**
- Apple Developer: Liquid Glass overview — official two-variant taxonomy
- Apple Newsroom (2025-06) — specular/refraction/adaptive descriptions
- MDN: corner-shape — Experimental, Chrome 139+ status confirmed
- Chrome Platform Status: corner-shape — shipped August 2025
- LogRocket: Liquid Glass effects with CSS and SVG — Chrome-only refraction confirmed
- kube.io: Liquid Glass in the Browser — displacement map + Chrome-only note
- Tailwind CSS v4.0/v4.1 release notes — container queries native, grid-cols-N native, v4.2.2 as latest
- conorluddy/LiquidGlassReference GitHub — two-variant confirmation

**MEDIUM confidence:**
- CSS-Tricks: Getting Clarity on Apple's Liquid Glass — three-layer breakdown
- Smashing Magazine: Beyond border-radius (March 2026) — squircle production readiness
- createwithswift.com — SwiftUI material API details
- Six Colors: macOS Tahoe review — Liquid Glass criticisms, accessibility concerns
- Infinum: iOS 26 accessibility — 1.5:1 contrast ratio finding on glass

---
*Research completed: 2026-04-09*
*Ready for roadmap: yes*
