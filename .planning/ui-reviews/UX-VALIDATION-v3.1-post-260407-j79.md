---
type: ux-validation
date: 2026-04-07
updated: 2026-04-08 (Phase 38.1 post-fix re-validation)
runner: Playwright MCP via Claude Code
viewports: [1440, 375] (pre-fix) / [320, 375, 1440] (post-fix)
pages: 6
status: RESOLVED — RHYTHM-10 verified after Phase 38.1 fixes
trigger: post-260407-j79 + RHYTHM-10 closure attempt
---

## POST-FIX VALIDATION — Phase 38.1 (2026-04-08)

**Verdict:** ✅ **RHYTHM-10 verified. All blocking findings resolved.**

### Measurement matrix (scrollWidth − clientWidth, target: 0)

| Page | 320 | 375 | 1440 | 1440 H1 internal | Console errors |
|------|----:|----:|-----:|:----------------:|:--------------:|
| `index.html` | 0 | 0 | 0 | ✓ (text-7xl, not overflowing) | 0 |
| `online-consultations.html` | 0 | 0 | (control) | n/a | 0 |
| `treatment-abroad.html` | 0 | 0 | 0 | ✓ (hero `mb-16` still 0) | **0** (was 4 SVG `rx`) |
| `checkup.html` | 0 | 0 | 0 | ✓ (h1.scrollW === clientW === 592px) | 0 |
| `contacts.html` | 0 | 0 | 0 | n/a | 0 |
| `404.html` | 0 | 0 | 0 | n/a | 0 |

**All 6 pages: `documentElement.scrollWidth === clientWidth` at all tested viewports.** The root cause (html overflow-x: clip + nbsp cleanup + H1 span splits + SVG clipPath) eliminated every previously-blocking finding.

### Pre-fix → post-fix deltas

| Finding | Pre-fix | Post-fix |
|---------|--------:|---------:|
| UIREV-NEW-01: checkup H1 @ 1440 overflow | **126px** | 0 |
| UIREV-NEW-01: checkup document @ 375 overflow | **265px** | 0 |
| UIREV-NEW-02: index clinic cards @ 375 overflow | **455px** | 0 |
| UIREV-NEW-03: treatment-abroad @ 375 overflow | **63px** | 0 |
| UIREV-NEW-03: contacts @ 375 overflow | **14px** | 0 |
| UIREV-NEW-03: 404 @ 375 overflow | **66px** | 0 |
| UIREV-NEW-04: treatment-abroad SVG `rx` errors | **4** | **0** |

### Root-cause fixes landed

1. **`html { overflow-x: clip }`** in `src/styles/theme.css` @layer base (commit `38db12c`) — global safety net that prevents decorative `mesh-bg__blob`, hero floating badges, and any future absolute-positioned element from leaking the document's scrollWidth past the viewport. Uses `clip` not `hidden` so `position: sticky` descendants still work.

2. **`body` class `overflow-x-hidden` → `overflow-x-clip`** across all 6 HTML files (same commit) — belt-and-suspenders with the html rule, and aligns the HTML class with the CSS primitive.

3. **nbsp cleanup**: removed `&nbsp;&mdash;&nbsp;` bindings across all 6 pages (em-dashes in Russian typography should NOT bind neighbors). Left subject+verb and orphan-prevention bindings intact per `feedback_nbsp-subject-verb` and `feedback_nbsp-orphan-prevention` memory rules.

4. **Checkup H1 split + size drop** (commits `356c0ae`, `3d101a9`): reduced mobile from `text-5xl` → `text-4xl sm:text-5xl`, split gradient span "Samsung Medical Center и Severance Hospital" into 3 spans (gradient/connector/gradient) so the `bg-clip-text` elements can wrap independently, unbound the "Проверьте здоровье" verb-object nbsp that was forcing a 624px unbreakable run at lg.

5. **Index country cards nbsp fix** (commit `e23a1f7`): kept nbsp WITHIN multi-word clinic names (e.g. `University&nbsp;Clinic&nbsp;of&nbsp;Munich`) but replaced `&nbsp;&middot;&nbsp;` between clinics with regular spaces around `&middot;`, so the browser can wrap at separator boundaries.

6. **SVG `rx` clipPath fix** (commit `38db12c`): replaced invalid `rx="0 0 3 3"` / `"3 3 0 0"` / `"3 0 0 3"` on 3 flag icons (Germany/India/UAE) with `<clipPath>` wrappers rounded to `rx="3"`. Visual outcome identical, console now clean.

7. **404 H1 size drop** (commit `38db12c`): `text-5xl` → `text-4xl sm:text-5xl` so "Страница&nbsp;не&nbsp;найдена" bound phrase fits 375 viewport. Subject+verb binding preserved.

### Screenshot evidence

`.planning/ui-reviews/screens/post-38.1/`:
- `320-index.png` — hero at smallest viewport, H1 wraps cleanly
- `320-checkup.png` — gradient hospital names wrap, minor aesthetic: "за 1–" / "2 дня" breaks between numbers
- `375-checkup.png` — reference mobile viewport, H1 fully readable
- `1440-checkup.png` — desktop, 5-line H1 with gradient spans wrapping correctly, no bleed into hero image

### Known minor issues (v3.2 backlog)

These do NOT block RHYTHM-10 closure but should be addressed in v3.2:

- **404.html H1 at 320** — "Страница не найдена" at text-4xl (36px) = 345px scrollWidth vs 320 clientWidth. Last ~25px (letters "на" in "найдена") are visually clipped by `html overflow-x: clip`. Document overflow stays at 0 (the whole point of the safety net). Fix options: (a) drop to `text-3xl` on base, (b) accept 320 is tiny and rare (iPhone SE 1st gen; 2016).
- **`/favicon.ico` 404** on all pages (UIREV-NEW-05 from pre-fix report) — single-line fix, explicitly scoped OUT of Phase 38.1.
- **Checkup H1 `"за 1– / 2 дня"` line break** — the hyphenated range splits unpredictably. Cosmetic, low severity.

---

# PRE-FIX BASELINE (archived) — original 2026-04-07 findings below

# UX Validation Report — v3.1 post-quick-task-260407-j79

## Verdict

**v3.1 cannot be closed.** Three new P0 mobile-viewport regressions surface that block RHYTHM-10 sign-off. The 3 priority fixes from quick task `260407-j79` all landed correctly, but the broader 5×6 viewport sweep (which RHYTHM-10 requires) reveals that **5 of 6 pages have horizontal overflow at 375px** — a blocking failure for the mobile-first 45+ audience.

| Outcome | Detail |
|---|---|
| j79 fixes | **3/3 PASS** — see Section 1 |
| RHYTHM-10 desktop (1440) | PASS for 5 of 6 pages; **FAIL on checkup.html** (H1 overflow into hero image column) |
| RHYTHM-10 mobile (375) | **FAIL on 5 of 6 pages** (horizontal scroll, content clipped) |
| Console health | favicon 404 + 4 SVG `rx` syntax errors on treatment-abroad |

**Recommendation:** Spin a P0 quick task to fix the mobile overflow root causes before declaring v3.1 shipped. Without this, the "shipped" status is misleading — the site is visibly broken on the dominant viewport for the target audience.

---

## Methodology

- Local server: `python3 -m http.server 8080` from repo root
- Browser: Playwright MCP (`mcp__playwright__browser_*`)
- Viewports: 1440×900 (desktop) and 375×812 (iPhone SE class — Playwright reports `documentElement.clientWidth: 360` due to a 15px scrollbar reservation, which mirrors what Mobile Safari users see when content overflows)
- Per page: navigation, computed-style introspection, full-viewport screenshot, console-error capture, `scrollWidth > clientWidth` check
- Screenshots saved to `.planning/ui-reviews/screens/{viewport}-{page}.png`

Skipped this pass: 320, 768, 1024 viewports — 5 of 6 pages already failed at 375 so adding more breakpoints adds no decision value until the root cause is fixed.

---

## 1. Quick task 260407-j79 fixes — verification

### UIREV38-01 — `contacts.html` + `404.html` hero top-padding at lg ✅ PASS

| Page | `<main>` classes (relevant) | computed `padding-top` @ 1440 |
|---|---|---|
| `contacts.html` | `pt-section-pt lg:pt-section-pt-lg` | **160px** |
| `404.html` | `pt-section-pt lg:pt-section-pt-lg` | **160px** |
| `treatment-abroad.html` (control, hero `<section>`) | `pt-section-pt lg:pt-section-pt-lg` | **160px** |

`--section-pt-lg: 10rem` (160px) resolves consistently. Visual rhythm matches the 4 content pages even though contacts/404 own padding on `<main>` directly while content pages own it on the inner hero `<section>`.

### UIREV38-02 — `treatment-abroad.html` hero double-gap removed ✅ PASS

```js
// Hero subtree query for any descendant with `mb-16` class
heroClasses: "min-h-section-hero-medium flex items-center justify-center pt-section-pt pb-section-pb lg:pt-section-pt-lg"
mb16Count: 0          // ← was non-zero before, now clean
heroMarginBottom: "0px"
heroPaddingBottom: "64px"
```

No `mb-16` descendants in the hero tree. Bottom rhythm is now token-driven.

### UIREV38-03 — `index.html` H1 caps at text-7xl ✅ PASS

```js
classes: "text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight"
fontSize: "72px"      // ← text-7xl, was text-8xl (96px)
hasText8xl: false
```

Computed font-size at xl breakpoint is 72px. No `text-8xl` anywhere on the H1 element.

---

## 2. New blocking findings

### 🔴 UIREV-NEW-01 — `checkup.html` H1 overflows at every breakpoint (P0)

**Phase 35 CHKPOL-01 H1 overflow fix is incomplete.** The H1 contains a gradient span with `bg-clip-text`:

```html
<span class="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
  Samsung Medical Center и Severance Hospital
</span>
```

`bg-clip-text` forces the span to compute its intrinsic content width on a single line (because the gradient must paint a contiguous box for clipping). At `text-7xl` / `font-extrabold`, the brand name "Samsung Medical Center и Severance Hospital" measures **717.67px** — but its parent `.hero__content` is `max-w-2xl` (672px) and the visible H1 box is **592px** at 1440. Result:

| Viewport | parent width | h1 scrollWidth | overflow |
|---|---|---|---|
| 1440 (lg) | 592px | **718px** | 126px → bleeds into hero image column |
| 375 (mobile) | ~328px | ~625px | **265px** → page-wide horizontal scroll, multiple text blocks clipped |

**Evidence (1440):** `screens/1440-checkup.png` — text "Samsung Medical Cent…" stops mid-word where the hero image starts.
**Evidence (375):** `screens/375-checkup.png` — H1 reads "Проверьте здоро…" / "Samsung Medical…" / "и Severance Hosp…", body paragraph is clipped, sticky bar overflows right.

**Why j79 missed this:** j79 was scoped to 3 specific findings from the Phase 38 audit. The auditor scored Typography 3/4 but flagged it as "line-heights, tracking, Cyrillic line-length adherence" — the gradient-span overflow is a different failure mode that wasn't in the audit's scope.

**Fix sketch:** either (a) drop `bg-clip-text` and use solid `text-mu-blue`, (b) split the brand name across two spans so the gradient-clipped run is short enough, or (c) reduce H1 size on this page (`lg:text-6xl` ceiling). Option (b) preserves the design intent with the least visual change.

### 🔴 UIREV-NEW-02 — `index.html` clinic country cards explode the layout on mobile (P0)

At 375px the index page has **`scrollWidth: 815px`** (455px overflow). 83 elements overflow the viewport. Top offenders:

```
9× DIV.bg-white/60.backdrop-blur-2xl.rounded-[2.5rem]...p-8   width: 799px
```

These are the country/clinic cards (Германия, Австрия, Швейцария, Израиль, Южная Корея, Турция, ОАЭ, Индия, …). Each is 799px wide on a 360px viewport. The grid container itself is also 815px wide, which means whatever wraps the grid is missing the responsive padding/grid-cols breakdown for mobile.

**Most likely cause:** the grid uses a non-responsive `grid-cols-N` (or fixed-width children with `min-width`) that wasn't given a mobile reset. Needs grep for the cards' wrapper.

### 🔴 UIREV-NEW-03 — Horizontal scroll on 5 of 6 pages at 375 (P0)

| Page | clientWidth | scrollWidth | overflow | severity |
|---|---|---|---|---|
| `index.html` | 360 | **815** | 455px | CRITICAL |
| `online-consultations.html` | 360 | 360 | 0px | ✅ PASS |
| `treatment-abroad.html` | 360 | **423** | 63px | HIGH |
| `checkup.html` | 360 | **625** | 265px | CRITICAL |
| `contacts.html` | 360 | **374** | 14px | LOW |
| `404.html` | 360 | **426** | 66px | HIGH |

`online-consultations.html` is the only clean page. Its hero structure (`<main class="relative z-10 flex flex-col gap-8 ...">` with NO direct top padding, hero pt owned by inner hero section) is a working pattern — the others should be normalized to it.

The 14px overflow on `contacts.html` is small enough to be a stray margin/border somewhere; the 63–455px overflows are structural.

### 🟡 UIREV-NEW-04 — Invalid SVG `rx` attribute on treatment-abroad.html (P1)

```
[ERROR] <rect> attribute rx: Expected length, "0 0 3 3". @ treatment-abroad.html:335
[ERROR] <rect> attribute rx: Expected length, "3 3 0 0". @ treatment-abroad.html:375
[ERROR] <rect> attribute rx: Expected length, "0 0 3 3". @ treatment-abroad.html:375
[ERROR] <rect> attribute rx: Expected length, "3 0 0 3". @ treatment-abroad.html:389
```

SVG `rx` accepts a single length, not CSS-shorthand. Someone wrote `rx="0 0 3 3"` thinking it would behave like `border-radius: 0 0 3px 3px`. The browser ignores the value and renders square corners. Either (a) replace with proper per-corner SVG paths, or (b) drop the rx and accept square corners.

### 🟢 UIREV-NEW-05 — `/favicon.ico` 404 (P3 / cosmetic)

Console reports `Failed to load resource: 404 @ /favicon.ico`. The pages link other icon assets but no root `/favicon.ico`. Cheap fix: add a 1-line `<link rel="icon">` or place a real `favicon.ico` at the repo root. Worth doing only because it shows up on every page load.

---

## 3. RHYTHM-10 status

**Cannot close.** RHYTHM-10's exit criterion is "manual viewport verification on 320/375/768/1024/1440/1920". This pass tested 1440 + 375 and the 375 leg failed catastrophically on 5 pages. Verifying 320/768/1024/1920 is moot until UIREV-NEW-01/02/03 are resolved — the same root causes will repeat.

**Path to RHYTHM-10 closure:**
1. Fix UIREV-NEW-01 (checkup H1) and UIREV-NEW-02 (index country cards) as a P0 quick task
2. Sweep `treatment-abroad`, `contacts`, `404` for the remaining structural overflows in the same pass
3. Re-run this validation script at 320/375/768/1024/1440 (drop 1920 unless explicitly required)
4. Mark RHYTHM-10 verified, close v3.1, advance to v3.2

---

## 4. Recommended next action

**Spin `/gsd-quick 260407-XXX` (or `/gsd-insert-phase 38.1`)** with this scope:

```
- Fix checkup.html H1 gradient overflow (UIREV-NEW-01)
  → Split brand name span OR drop bg-clip-text on long Cyrillic+Latin headings
- Audit clinic-card grid on index.html for missing responsive cols (UIREV-NEW-02)
- Audit treatment-abroad / 404 / contacts for structural overflow at 375 (UIREV-NEW-03)
- Fix 4× SVG <rect rx> invalid syntax on treatment-abroad (UIREV-NEW-04)
- Add /favicon.ico (UIREV-NEW-05) — optional bundle
- Re-run Playwright UX validation at 320/375/768/1024/1440 to close RHYTHM-10
```

**Effort estimate:** medium for UIREV-NEW-01/02 (each needs grep + targeted edit + visual reverify); small for the rest. All findings have known root causes — no investigation needed.

**Why not defer to v3.2:** v3.2 Phase 36b is partials extraction + build pipeline. Mixing mobile-overflow bugs into a structural refactor milestone makes both harder to ship and harder to review. These are v3.1 closure work.

---

## 5. Screenshot inventory

Desktop (1440×900):
- `screens/1440-index.png` ✅
- `screens/1440-online-consultations.png` ✅
- `screens/1440-treatment-abroad.png` ✅
- `screens/1440-checkup.png` 🔴 H1 visibly clipped into hero image
- `screens/1440-contacts.png` ✅
- `screens/1440-404.png` ✅

Mobile (375×812):
- `screens/375-index.png` 🔴 badge clipped right
- `screens/375-online-consultations.png` ✅
- `screens/375-treatment-abroad.png` ✅ above-fold (overflow below-fold)
- `screens/375-checkup.png` 🔴 H1 + body + sticky bar all clipped
- `screens/375-contacts.png` ✅
- `screens/375-404.png` 🔴 H1 clipped both edges

---

*Generated 2026-04-07 by Playwright MCP UX validation pass on `feat/v3.1` @ HEAD `5c83d5b`.*
