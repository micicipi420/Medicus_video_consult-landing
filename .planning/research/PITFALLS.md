# Pitfalls Research — v4.0 Liquid Design System

**Project:** MedicusUnion KZ (existing multi-page landing — v4.0 milestone)
**Domain:** Grid foundation + universal squircles + Apple Liquid Glass on an existing medical landing for ЦА 45+ with zero-Node build, byte-identity pre-commit hook, and WCAG AA baseline
**Researched:** 2026-04-09
**Confidence:** HIGH on integration pitfalls (existing architecture is fully documented in v3.2 ship notes), HIGH on technique-level pitfalls (STACK.md + FEATURES.md + ARCHITECTURE.md triangulated), MEDIUM on device-specific Android perf numbers (extrapolation from published backdrop-filter benchmarks, not measured on the exact Samsung A / Xiaomi Redmi models dominant in KZ)

## Scope and ground rules

This file is **not** a "web gotchas" catalogue. Every pitfall listed below is specific to **adding v4.0 on top of what v3.0–v3.2 already shipped**. Generic advice ("test on real devices") is only included when there is a MedicusUnion-specific way to do it or a known trap in the existing pipeline.

Existing research is treated as input, not duplicated:
- `STACK.md` — shadow-wrap pattern, `mask-image` clipping, focus-visible must move from `box-shadow` to `outline`, refraction is Chromium-only
- `FEATURES.md` — Clear variant is anti-feature, dark-mode glass must be re-enabled with tuned recipe, primary CTA stays gradient-filled, Russian long-word wrap flagged
- `ARCHITECTURE.md` — 9-phase migration order, hard protection list (`F.2`), class cascade order, `.dark` vs `[data-theme="dark"]` inconsistency, new `partials/svg-defs.html`

**Perf budget is relaxed per v4.0 Key Decision — this does not mean perf pitfalls are ignored. It means they are logged as known debt, measured post-ship, and gated at "≥30 FPS scroll on a representative budget Android" not "60 FPS everywhere."** Pitfalls that would break the site on budget Android (not merely degrade it) are still BLOCKERs.

## Severity rubric

| Severity | Meaning | Must gate phase? |
|---|---|---|
| **BLOCKER** | Breaks a shipped user-facing capability (form submission, nav, WCAG AA, byte-identity hook, focus visibility, mobile overflow). Regression from v3.x is not acceptable. | YES — phase cannot merge without explicit verification |
| **HIGH** | Significantly degrades UX on a target audience (ЦА 45+), medical trust context, legibility on low-end hardware, or creates measurable visual regression | YES — phase requirements include explicit mitigation |
| **MEDIUM** | Degrades polish on some devices or in some modes. Fixable at the next phase without rework. Not a ship-stopper | Flag in phase plan, verify in Phase 8 (a11y + perf) |
| **LOW** | Edge case, cosmetic, or affects a user segment smaller than ~5%. Documented as known limitation | Document in `docs/DESIGN-SYSTEM.md`, no phase action |

Phase numbers reference the 9-phase sequence from `ARCHITECTURE.md` G.1:

| # | Name |
|---|---|
| 1 | Foundation tokens |
| 2 | Squircle primitives |
| 3 | Liquid Glass primitives |
| 4 | SVG defs partial + chrome partials upgrade |
| 5 | Simple pages (404, contacts) |
| 6 | Service pages (checkup, online, treatment-abroad) |
| 7 | Index page |
| 8 | A11y + perf verification |
| 9 | Docs (DESIGN-SYSTEM.md + optional styleguide.html) |

---

## Critical Pitfalls (BLOCKER)

### Pitfall C1: Focus-visible ring disappears on every squircled element

**What goes wrong:**
The project's `@layer base` rule (`theme.css` lines 252–261) paints the keyboard focus ring as a double `box-shadow` (`0 0 0 2px white, 0 0 0 4px var(--mu-blue-text)`). The moment any interactive element receives `.squircle-*`, its `mask-image` clips the box-shadow against the squircle silhouette — the focus ring becomes **invisible** or appears as two thin arcs instead of a continuous rim.

For v4.0, the vocabulary explicitly targets `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>` with squircle classes. Every interactive element on every page would silently lose its keyboard focus indicator. This is a **WCAG 2.1 SC 2.4.7 failure** and a regression from v3.0's accessibility work.

**Why it happens:**
CSS `mask-image` paints the element through the mask shape; anything outside the mask (including `box-shadow`, `border`, `outline` in some rendering paths) is clipped away. Unlike `border-radius` + `overflow: hidden`, which clips the box but preserves outer shadows, `mask-image` treats the shape as a hard silhouette including for shadows.

Developers miss it during visual review because mouse users never see the focus ring. Only keyboard tab-through reveals the regression, and only a tester specifically checking each interactive element catches it.

**How to avoid:**
1. **Phase 1 Foundation tokens — gating requirement:** Refactor the `@layer base :focus-visible` block from `box-shadow` to `outline + outline-offset`. Exact replacement is in `ARCHITECTURE.md` C.4. This is a single-block edit in `theme.css`, zero-risk.
2. **Verify contrast:** `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` → `--mu-blue-text` is `#0E8FB5`, contrast 4.6:1 against white (passes AA), but it must also be verified against each Liquid Glass surface (form container, nav, mobile menu, card) because the effective background under the outline is translucent.
3. **Document as a project convention** in `docs/DESIGN-SYSTEM.md` section 5.2 "Focus-visible: outline not box-shadow" so future contributors do not revert to box-shadow thinking it "looks better."

**Warning signs:**
- Keyboard tab-through on any page shows "ghost" tab focus — focused element visibly responds (colors shift) but no ring is drawn.
- On squircled CTA buttons, you see two tiny arcs where the ring used to go.
- `outline: 0` anywhere in the Tailwind classlist on an interactive element (common Tailwind reset, sometimes duplicated inline).

**Phase to address:** **Phase 1 — BLOCKER. Phase 1 cannot merge until tab-through of all 6 pages (even pre-squircle) confirms the outline ring is visible on every interactive element.** This must land **before** Phase 2 introduces the first squircle class.

---

### Pitfall C2: Byte-identity pre-commit hook blocks every partial change after Phase 4

**What goes wrong:**
The v3.2 pre-commit hook (`scripts/hooks/pre-commit`) runs `make build` then `git diff --quiet '*.html'`. It is designed to refuse commits where partials were edited but pages were not regenerated. Phase 4 of v4.0 edits **four** chrome partials (`header`, `footer`, `mobile-menu`, `sticky-bar`) and **adds a fifth** (`svg-defs`), which triggers drift across all six generated pages plus the `PARTIALS` variable in `build-pages.sh`.

A contributor who stages only the partial and forgets to `make build` gets a hook rejection. A contributor who runs `make build` but stages only the partial (missing regenerated pages) gets a hook rejection. A contributor running `git commit -a` gets the right behavior but may be surprised by six `.html` files landing in the diff.

Worse: if any BUILD marker is mistyped (e.g. `<!-- BUILD:svg-defs -->` without the closing `<!-- /BUILD:svg-defs -->`, or the marker pair on a page that isn't listed in `PAGES`), the splicer silently skips that page and the hook passes — because the page is *still byte-identical to itself*, just unupdated. The regression only surfaces when visual review compares pages.

**Why it happens:**
The hook is a correctness gate, not a diff-minimizer. It rejects incomplete commits but does not teach contributors how to produce complete ones. The `svg-defs` partial is a new vocabulary addition (expanding `PARTIALS`) and is the first structural change to the splicer contract since v3.2 Phase 39.

**How to avoid:**
1. **Phase 4 plan must enumerate the full commit anatomy** before execution begins: (a) new `partials/svg-defs.html` file, (b) one-line `scripts/build-pages.sh` edit, (c) new `<!-- BUILD:svg-defs -->` marker pair in all 6 pages, (d) regenerated pages from `make build`, (e) 4 updated chrome partials with new Liquid classes, (f) regenerated pages again. One commit or split across two — but never a commit with (a)–(c) missing any of the marker pair additions.
2. **Add a `make check` run as the Phase 4 gate** — `make check` = `make build` + `git diff --quiet '*.html'`. Run it after staging but before committing. If it fails, re-stage. This is the same invariant the hook enforces, caught earlier.
3. **Update `docs/BUILD.md` during Phase 9** with the "new partial" runbook: (1) create partial, (2) add name to `PARTIALS`, (3) add BUILD marker pair to every page in `PAGES`, (4) `make build`, (5) stage everything. Future v4.1+ partial additions will follow this runbook.
4. **Add a splicer smoke test to Phase 4 gate:** `grep -c '<!-- BUILD:svg-defs -->' index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html` must return 6, not 5 or 4. Prevents "page missing marker, silently skipped" class of bug.

**Warning signs:**
- `make build` reports "applied svg-defs to 5 pages" not "applied to 6 pages" (check stdout).
- `git diff --stat` shows an uneven number of `.html` files touched by a partial change.
- Pre-commit hook fails on `git commit` with "chrome drift detected."
- Visual review of 404.html shows no `<svg><defs>` in the DOM but index.html does (or vice versa).

**Phase to address:** **Phase 4 — BLOCKER. Merge gate: byte-identity hook passes on a fresh rebuild, and `grep -c '<!-- BUILD:svg-defs -->' *.html` returns exactly one per page.**

---

### Pitfall C3: `html { overflow-x: clip }` safety net removed during refactor (v3.1 Phase 38.1 regression)

**What goes wrong:**
`theme.css` line 274 has `html { overflow-x: clip; }` — the v3.1 Phase 38.1 corrective fix for mobile viewport overflow from decorative absolute-positioned elements (hero mesh-bg blobs, floating badges, 320px breakpoint overflow on 404.html H1, checkup.html range binding). Removing it would reintroduce the mobile horizontal-scroll bug the fix was designed to prevent.

v4.0 will aggressively edit `theme.css @layer base`. A naive refactor that "tidies up" the base layer or consolidates CSS could delete this rule. Worse, v4.0 introduces **more** decorative absolute elements (specular pseudo-elements, SVG refraction filters positioned absolute) — exactly the class of element `overflow-x: clip` guards against.

**Why it happens:**
The rule is a protective workaround with no obvious consumer in the CSS. A contributor refactoring the base layer looks at it and thinks "this is suspicious, `overflow: clip` on html is unusual, maybe we should remove it and fix the root cause." The root cause is the hero mesh-bg blobs + floating cards, which still exist and still extend past viewport edges on mobile.

**How to avoid:**
1. **Add `overflow-x: clip` on `<html>` to the `F.2` Hard Protection List** (already in ARCHITECTURE.md but re-emphasized here). Downstream executors must not touch this rule.
2. **Phase 1 gate:** verify `overflow-x: clip` is still present in `theme.css` after foundation token work lands. Grep: `grep -c 'overflow-x: clip' src/styles/theme.css` must return 1.
3. **Phase 7 gate (index.html — the most complex page):** on a 320px wide viewport, verify no horizontal scroll. This is the page with the hero mesh-bg blobs (`fixed inset-0 ... w-[60vw] bg-mu-blue/30 blur-[120px]` etc. at lines 146–148) and the 4 floating hero info cards with `absolute -right-6 top-1/4` positioning.
4. **Any new Liquid Glass specular pseudo-element that uses `position: absolute`** must set `inset: 0` (bounded to parent), never use negative offsets that extend past parent, and must be applied only to elements whose parent has `overflow: hidden` or a squircle mask providing clipping.

**Warning signs:**
- On a 320px or 360px-wide emulator, content extends past viewport edge on any page.
- Swipe-left on mobile reveals blank space (mesh-bg blob leaked out).
- Chrome DevTools "Rendering" panel shows `overflow: visible` on `<html>` instead of `clip`.
- `position: absolute` element with `-right-N` or `-left-N` Tailwind class appears on any page without a clipping parent.

**Phase to address:** **Phase 1, 7 — BLOCKER. Phase 1 gate: rule still exists in theme.css. Phase 7 gate: 320px emulator check on index.html (most complex, most decorative elements).**

---

### Pitfall C4: Russian nbsp bindings destroyed during partial / page refactor

**What goes wrong:**
The v3.0 Russian typography polish bound subject+verb pairs, orphan prevention, and fragment groups with `&nbsp;`. Examples from checkup.html:
- `за&nbsp;рубежом` (preposition + noun binding)
- `Мы&nbsp;берём&nbsp;на&nbsp;себя` (chained nbsp for orphan prevention per user memory feedback)
- `ISO&nbsp;27001`, `43&nbsp;клиники`, `11&nbsp;стран` (number + unit binding)
- `<span class="whitespace-nowrap">за 1&ndash;2 дня</span>` (v3.2 COSMETIC-03 — Tailwind utility variant of binding)

Plus responsive `<br class="md:hidden">` in hero headings (v3.0 decision for Russian compound phrase breaking).

v4.0 page migrations will touch every page and every hero section. A bulk find/replace that targets `<h1 class="..."` without reading the inner HTML will nuke the nbsp bindings. A contributor copying hero markup from one page to another may strip the `&nbsp;` because "it looks like a typo." The user's auto-memory (`feedback_nbsp-subject-verb.md`, `feedback_nbsp-orphan-prevention.md`) contains explicit rules against this.

The checkup.html range binding `<span class="whitespace-nowrap">за 1&ndash;2 дня</span>` is especially fragile because it's one of the newest additions (v3.2 COSMETIC-03) and it's a span-level wrapper that could get normalized away during an aggressive class-list refactor.

**Why it happens:**
`&nbsp;` looks like HTML noise in Russian copy. Auto-formatters (Prettier for HTML, even if not in use, future IDE plugins) can normalize `&nbsp;` to space. Search-and-replace for `<h1 class=` to update classes is 100% likely during page migration and 100% likely to strip inner content if done with sed rather than a DOM-aware tool.

Worse — the squircle/liquid migration **moves** hero headings inside new grid wrappers and Liquid Glass containers. Cut-and-paste refactor is the high-risk operation.

**How to avoid:**
1. **Add a Phase 5–7 gate grep** (before merge): count `&nbsp;` occurrences in each migrated page. If the count drops vs. the pre-migration baseline, the migration stripped bindings. Baseline counts should be captured in the phase plan.
2. **Never use sed or regex replace on the page content** — use explicit class-list edits via a tool that preserves inner HTML. The existing `build-pages.sh` splicer only touches BUILD marker blocks; it does not touch inner section content, so the splicer is safe. The risk is in Phase 5–7 where page sections (hero, cards, form) are hand-edited.
3. **Pre-Phase-5 baseline capture:** `grep -c '&nbsp;' *.html` captured in phase plan, re-run at each phase gate, must not decrease.
4. **The v3.2 `whitespace-nowrap` range binding** is a real example of "don't touch this span's wrapper class even if refactoring to liquid vocabulary." Document this exception in `docs/DESIGN-SYSTEM.md` section 5.4.
5. **User's auto-memory rules are load-bearing:** subject+verb binding, orphan prevention (first line before break must have 2+ words AND 10+ chars, chain nbsp to push break later). Phase 5–7 executors must read `feedback_nbsp-subject-verb.md` and `feedback_nbsp-orphan-prevention.md` before touching any Russian content.

**Warning signs:**
- `grep -c '&nbsp;'` count drops on any page after migration.
- `whitespace-nowrap` class missing from the `<span>` around "за 1–2 дня" in checkup.html hero after migration.
- `<br class="md:hidden">` removed or replaced with unconditional `<br>` in any hero heading.
- Russian headings wrap with orphans (single words on last line) — visible on tablet width.
- Preposition ending a line ("за\nрубежом", "в\nведущих").

**Phase to address:** **Phase 5, 6, 7 — BLOCKER per page. Gate: nbsp count preserved, span wrappers preserved, `<br class="md:hidden">` preserved.**

---

### Pitfall C5: Schema.org JSON-LD, canonical URLs, meta descriptions, Open Graph tags silently deleted during refactor

**What goes wrong:**
v3.0 shipped per-page SEO metadata: unique `<title>`, `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">`, and Schema.org `MedicalBusiness` JSON-LD on `index.html` only. These sit in `<head>` and have no visual footprint — a page migration that refactors the body never touches them.

The risk is when a contributor "cleans up" `<head>` during the v4.0 migration — adding preload hints for new CSS files, adding a favicon reference (already shipped in v3.2), or refactoring the `<head>` skeleton. An aggressive cleanup could delete the JSON-LD block (long inline `<script type="application/ld+json">`) because it looks like "unused code."

The byte-identity hook does not protect `<head>` — it only enforces that partials propagate to pages. `<head>` is per-page and outside partials (see ARCHITECTURE.md E.2 — decision against extracting `<head>` to a partial).

**Why it happens:**
JSON-LD is verbose and looks like boilerplate to contributors who don't know it's load-bearing for SEO. Meta tags look repetitive across pages even though each is unique. A "quick tidy" can delete them.

**How to avoid:**
1. **`F.2` Hard Protection List addition:** Per-page `<head>` content (title, description, og:*, canonical, JSON-LD) is protected. Phase executors may **add** to `<head>` (preload hints, new stylesheet link) but may **not remove or replace** existing tags.
2. **Phase 5–7 gate per page:** after migration, verify `<title>`, `<meta name="description">`, canonical, and (for index.html) the JSON-LD script block are byte-identical to pre-migration. `diff <(grep -A1 '<title>\|<meta name="description"\|<link rel="canonical"\|<script type="application/ld+json"' before.html) <(... after.html)` or similar.
3. **Do not introduce `<head>` partial in v4.0** — ARCHITECTURE.md E.2 already decided against it. The decision protects against exactly this kind of regression.

**Warning signs:**
- `<title>` on any page becomes generic ("MedicusUnion KZ" instead of page-specific).
- `<meta name="description">` missing on any page.
- JSON-LD script block missing from index.html.
- Canonical URL missing or pointing to wrong page.
- SEO automated check (Google Search Console, post-deploy) reports missing metadata.

**Phase to address:** **Phase 5, 6, 7 — BLOCKER per page.** Gate: head content diff is append-only, never delete.

---

### Pitfall C6: `.dark` vs `[data-theme="dark"]` selector inconsistency causes dark-mode glass to silently fail

**What goes wrong:**
`theme.css` line 99 declares `.dark { ... }` as the dark-mode cascade entry point. The dark-mode toggle JS (per v1.4 Key Decision: "`[data-theme="dark"]` attribute selector for dark mode") **may** use the attribute form. Research-level inconsistency: PROJECT.md line 218 says `[data-theme="dark"]`, actual theme.css uses `.dark` class.

ARCHITECTURE.md A.4 flagged this as an existing inconsistency, not a v4.0 bug. But v4.0 is where it bites hardest: the new Liquid Glass dark recipe MUST live inside whichever selector wins, or else dark-mode glass reverts to the v1.4 "murky navy smear" failure because the custom properties never get overridden.

If Phase 1 places the new `--liquid-bg` / `--liquid-blur-*` dark overrides inside `[data-theme="dark"]` but the toggle JS sets `.dark`, dark mode users see **light-mode glass recipes on a dark background** — the worst possible combination, and exactly the v1.4 failure mode we are trying to fix.

**Why it happens:**
Two research documents disagree. The existing `.dark` cascade block is documented; the JS toggle's actual implementation needs a code-level audit. Without that audit, Phase 1 can ship with the wrong selector and the failure only surfaces when a user toggles dark mode in Phase 8 verification.

**How to avoid:**
1. **Phase 0 / Phase 1 prerequisite audit:** read `js/main.js` (or wherever the theme toggle lives) and grep for `classList.add('dark')` vs `setAttribute('data-theme'`. Document which is used. Log the answer in the Phase 1 plan as a declared assumption.
2. **Phase 1 decision gate:** all new dark-mode tokens live in the **same** selector as the existing `--background`, `--foreground`, `--card` overrides. Re-read `theme.css` line 99: it is `.dark`. Therefore v4.0 dark-mode tokens live inside `.dark { --liquid-bg: ...; }`. Do not introduce `[data-theme="dark"]` as a new selector unless Phase 1 explicitly unifies both.
3. **Reconciliation is out of scope for v4.0.** Fixing the PROJECT.md / implementation drift is a separate v4.1 concern. v4.0 uses `.dark` (the actual shipped selector) and logs the discrepancy as a known issue in Phase 9 docs.
4. **Phase 8 gate (dark-mode validation):** toggle dark mode on every page, visually verify glass is not the "murky navy smear" from v1.4. Run axe-core or manual contrast check.

**Warning signs:**
- Dark mode on any page shows glass surfaces identical to light mode (tokens not overriding).
- `<html class="dark">` appears in DOM but `getComputedStyle(.liquid-card).backdropFilter` returns light-mode blur value.
- FEATURES.md G.4 Infinum accessibility finding ("contrast ratios as low as 1.5:1") reproduces on our dark surfaces.

**Phase to address:** **Phase 1 — BLOCKER. Audit the actual toggle mechanism before writing any `.dark` or `[data-theme="dark"]` rules. Then Phase 8 — BLOCKER for verification.**

---

### Pitfall C7: Honeypot spam protection broken during form refactor

**What goes wrong:**
v3.0 shipped honeypot spam protection on all 6 forms. The pattern is a hidden `<input>` field that bots fill and real users don't — form submission checks this field is empty before forwarding to Directus. The hidden input has specific CSS (often `position: absolute; left: -9999px;` or a visually-hidden pattern):

```css
/* From contacts.html: */
/* Visually hidden (honeypot) */
```

v4.0 refactors form container styling to `.liquid-regular` + `.liquid-card` + `.squircle-xl` + `.liquid-input` on every field. A class-list migration that replaces `<form class="...">` wholesale could strip the honeypot's class or delete the hidden input entirely if the refactor is "rewrite from scratch" rather than "edit existing markup."

A working form that silently accepts spam is a **worse** regression than a broken form, because the break is invisible until Directus fills up with bot submissions.

**Why it happens:**
The honeypot is invisible by design. Visual review finds no regression. Functional review (submitting the form) succeeds. Only bot-submission monitoring or a specific test that asserts the honeypot field exists catches the loss.

**How to avoid:**
1. **Phase 5–7 gate per form:** before migration, capture a snapshot of `<form>` structure (field names, hidden fields, JS event bindings). After migration, diff the field structure — not the class lists. Honeypot field must still exist with the same `name` attribute.
2. **Do not rewrite forms from scratch.** Edit class-lists in place. The goal of the Liquid migration is class swaps, not markup changes. If a form needs a new wrapper div for shadow-wrap pattern (C.3 from ARCHITECTURE), the wrapper is added around existing markup, not replacing it.
3. **Post-Phase-8 verification:** submit a test form on every page with the honeypot field filled. The Directus submission must be **rejected** (client-side or server-side). If it's accepted, the honeypot is broken.
4. **`F.2` protection list addition:** honeypot field names and hidden-field CSS patterns are protected.

**Warning signs:**
- `grep -c 'name="_honey\|name="honeypot\|name="website\|sr-only' contacts.html` drops after migration (exact name depends on project implementation — the phase plan must record the actual honeypot field names before migration).
- Form submits successfully when honeypot field is manually filled (client-side JS check bypassed).
- Directus starts receiving bot submissions after deploy.

**Phase to address:** **Phase 5, 6, 7 — BLOCKER per form. Gate: honeypot field still exists, still hidden, still blocks bot submissions (test case).**

---

### Pitfall C8: ARIA live regions + screen reader announcements broken during form refactor

**What goes wrong:**
v3.0 added `role="alert"` and `aria-live="polite"` on 20 form error containers across the site. These fire when form validation fails ("Введите имя", "Неверный формат телефона") and are what screen-reader users hear. They are structural HTML, not CSS — so the visual Liquid migration doesn't need to touch them **if done correctly**.

The risk: a class-list migration that rewrites error container markup (e.g., replacing a `<div class="form__field-error">` wrapper with a `<span class="liquid-error">` inline element) can strip the ARIA attributes. A "while we're here" cleanup can decide the `role="alert"` is "unnecessary because we have aria-live" and delete one, breaking compatibility with screen readers that prefer one over the other.

Similarly, `.form__field-error` has a specific display-control pattern (`.is-invalid + .form__field-error { display: block; }` per contacts.html line 44–46). Renaming `.form__field-error` to `.liquid-error` breaks the CSS selector and errors never show.

**Why it happens:**
ARIA attributes are invisible to mouse/touch users. Visual review passes. Only a screen reader test or an explicit attribute-preservation check catches the loss. ЦА 45+ audience may include users with impaired vision who rely on screen readers.

**How to avoid:**
1. **`.form__field-error` and its state classes (`.is-invalid`) are on the `F.2` Hard Protection List.** Do not rename to `.liquid-error`. Add Liquid Glass visual styling **additively** via a new class (e.g., `<div class="form__field-error liquid-alert-inline">`), not by rename.
2. **Phase 5–7 gate per form:** `grep -c 'role="alert"\|aria-live' <page>.html` before and after migration must be identical.
3. **Phase 8 gate:** manual screen reader test on at least one form (VoiceOver on Safari is the canonical check — matches Apple-device-heavy ЦА). Trigger a validation error and verify announcement.
4. **Do not change the HTML semantic structure of error containers.** A `<div>` stays a `<div>`. An ARIA attribute stays.

**Warning signs:**
- `aria-live` or `role="alert"` attribute count drops in any page.
- Form validation errors do not appear on screen after migration (CSS selector broken by rename).
- `.form__field-error` class missing from any form error div.
- `.is-invalid` state class not toggled by validation JS (JS selector broken).

**Phase to address:** **Phase 5, 6, 7 — BLOCKER per form.**

---

### Pitfall C9: Vertical rhythm svh tokens conflict with Liquid grid wrapping (hero section collapses)

**What goes wrong:**
v3.1 Phase 38 shipped vertical rhythm tokens: `--section-h-hero-rich: clamp(560px, 75svh, 760px)` and content-density tiers (`rich`, `medium`, `compact`). These are applied as `min-h-section-hero-rich` Tailwind utilities on hero sections and ensure each hero has a calibrated minimum height for ЦА 45+ reading comfort.

v4.0 wraps every page in a `<main class="liquid-grid grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12">` wrapper (ARCHITECTURE.md B.3). The hero becomes `<section class="hero col-span-2 md:col-span-8 lg:col-span-12">` inside the grid.

The risk: CSS Grid's default behavior is to size children by content, not by their `min-height`. When a hero has `min-h-section-hero-rich` applied and is placed inside a grid context, the grid row may override the min-height if the grid is configured with explicit row tracks (`grid-template-rows: auto auto auto`). The hero would collapse to its content-only height, losing the vertical rhythm.

This is specifically a problem because:
1. The existing heroes use `min-h-[clamp(...)]` — grids may not respect it in all configurations.
2. svh units recalculate on mobile URL bar show/hide — combined with grid layout, the hero height may shift during scroll, breaking the vertical rhythm calculation.
3. ЦА 45+ benefit from the vertical rhythm; its loss is a regression from v3.1 work.

**Why it happens:**
Grid layout and `min-height` interact subtly. Implicit grid rows (no `grid-template-rows` declared) default to `auto` and do respect child `min-height`. Explicit rows may not. Most v4.0 code will use implicit rows, but any subgrid or explicit row declaration is a latent trap.

**How to avoid:**
1. **Phase 4 (grid wrapper introduction) and Phase 5–7 (per page) gate:** verify hero sections render at their `min-h-section-hero-rich/medium/compact` height on mobile, tablet, desktop viewports. Measure the hero bounding box.
2. **Document the rule in `docs/DESIGN-SYSTEM.md` section 5.3:** "Do not declare `grid-template-rows` on `.liquid-grid` — leave rows implicit so section children respect their `min-height` values."
3. **`F.2` Hard Protection List addition:** `--section-h-hero-*` tokens and their Tailwind min-h utilities are protected; they survive v4.0 intact.
4. **Phase 1 foundation token work must not touch the vertical rhythm tokens.** They live in the same `theme.css :root` block — fence them off visually with comments and do not edit them.

**Warning signs:**
- On any page, the hero section is noticeably shorter after the grid wrapper is added.
- `<section class="hero ...">` computed height in DevTools is less than the token value.
- Mobile URL bar show/hide causes the hero to jump (svh recalc + grid row recalc collide).
- Content below the hero starts too high relative to the fold.

**Phase to address:** **Phase 4 — BLOCKER for the first page to get the grid wrapper. Phase 5–7 — re-verify per page.**

---

## High-severity pitfalls (HIGH)

### Pitfall H1: `mask-image` + `transform: translateY(-2px)` hover clipping jitter on cards

**What goes wrong:**
The existing card hover pattern is `translateY(-2px)` (v1.2 Key Decision, still in use across service cards). When `.squircle-lg` is added to the same card, the mask silhouette is translated with the element — but the `mask-size: 100% 100%` calculation can trigger a re-rasterization of the mask at each frame of the hover transition. On Chromium, this is cheap (mask is GPU-composited). On WebKit (Safari), some versions re-rasterize the mask per transform frame, causing visible jitter: the squircle corners appear to "tremble" during the 280ms hover transition.

Cards are the highest-count surface in the migration (service cards on index, clinic cards on treatment-abroad, program cards on checkup, doctor cards on online-consultations). A jittery hover on every card is an immediate polish regression.

**Why it happens:**
Mask-image is a compositor-level effect. When the element transforms, the mask must follow. Most browsers cache the rasterized mask and just translate the cache — but some edge cases (older Safari, first-paint, reduced-motion contexts) force re-raster.

**How to avoid:**
1. **Use the shadow-wrap pattern (ARCHITECTURE.md C.3):** the outer `.liquid-card-wrap` has the transform and the shadow; the inner `.liquid-card.squircle-lg` has the mask and does not transform. The mask cache stays stable; only the outer (un-masked) element animates.
2. **Force GPU compositing on the transform layer:** add `will-change: transform` to `.liquid-card-wrap`. This promotes the element to its own compositor layer, preventing reflow of the child mask. Use sparingly — `will-change` has memory cost.
3. **Progressive enhancement via `corner-shape`:** on Chrome 139+, `corner-shape: superellipse(2)` does not use mask-image and does not have the re-raster issue. Safari users on the mask-image fallback get the jitter risk; Chrome users don't.
4. **Phase 3 gate (Liquid primitives smoke test):** test card hover on actual Safari (macOS Safari 17+, iOS Safari 17+). If jitter is visible, apply shadow-wrap universally to cards. If not, document as "Safari-only minor visual artifact" and move on.

**Warning signs:**
- Card hover looks "bouncy" or "shimmery" on Safari.
- Chrome DevTools Performance panel shows per-frame raster events on card hover.
- Safari Web Inspector "Layers" tab shows `.liquid-card` re-rasterizing each frame.

**Phase to address:** **Phase 3 (smoke test on real Safari) and Phase 6 (full migration).**

---

### Pitfall H2: Hero hover scale + rotate on icon chips → mask clip breaks mid-transform

**What goes wrong:**
`index.html` has icon chips inside service cards using `transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3` (e.g., line 329: `<div class="absolute top-4 right-4 w-12 h-12 bg-mu-blue/10 backdrop-blur-xl rounded-2xl ... group-hover:scale-110 group-hover:rotate-3">`). When the card is hovered, the icon chip scales up 10% and rotates 3 degrees.

If `.squircle-md` is applied to this icon chip, the `mask-image` silhouette is scaled and rotated with the transform. `mask-size: 100% 100%` (per ARCHITECTURE.md C.6) means the mask stretches with the element — but the rotation causes the mask corners to go out of alignment with the content bounds. Depending on browser, this can produce:
- Slight mis-aligned corners (Chrome, mostly correct)
- Clipped content at the rotated corners (Safari)
- Flicker during the transition (Firefox under some conditions)

Combined with `backdrop-blur-xl` on the same chip, the effect is a tiny, noisy, rotating squircle whose corners distort during hover. Not a showstopper, but a polish regression on one of the most visible interactive elements.

**Why it happens:**
SVG masks with `viewBox="0 0 100 100" preserveAspectRatio="none"` + `mask-size: 100% 100%` handle scale fine but rotation is computed independently of the mask — the mask doesn't "know" about the rotation, so the corners end up at their transformed position but the mask is painted in the un-rotated local space.

**How to avoid:**
1. **Do NOT apply squircle to elements that rotate.** Accept `rounded-2xl` as the fallback for elements using `group-hover:rotate-*`. Document in DESIGN-SYSTEM.md: "Squircles are for translation and scale, not rotation."
2. **Alternative: drop the rotation.** The 3-degree rotate is a v1.4 micro-animation for service cards. If design review during Phase 7 decides squircle is more important than the rotate, the rotate can be removed. ЦА 45+ research (v1.4) did not require the rotate — it was a polish addition.
3. **Phase 7 explicit decision:** for each `group-hover:rotate-*` instance on index.html, choose either (a) keep rotate + use `rounded-2xl` + lose squircle treatment on that specific chip, or (b) drop rotate + apply squircle. Document choice per element.
4. **Corner-shape escape hatch on Chrome:** `corner-shape: superellipse(2)` is a native property and respects rotation correctly. Chrome 139+ users get correct behavior for free; Safari/Firefox users see the fallback. If the element is important enough, this may be acceptable.

**Warning signs:**
- Service card icon chip has visible corner distortion on hover in Safari.
- Chrome DevTools "Rendering" panel shows mask repaint on every hover frame.
- Icon chip "snaps back" at end of hover transition.

**Phase to address:** **Phase 7 — HIGH. Explicit decision per rotating element.**

---

### Pitfall H3: Backdrop-filter stacking context z-index cascade breaks dropdown / mobile menu / form success overlay

**What goes wrong:**
`backdrop-filter` creates a new stacking context. When v4.0 applies `.liquid-regular` (which declares `backdrop-filter: blur(...)`) to more surfaces than v1.4 did — nav, mobile menu, sticky bar, form, cards, icon chips, badges — the z-index hierarchy becomes fragile.

Specific existing collisions to audit:
- **Mobile menu drawer:** currently `z-50` with `backdrop-blur-[80px]`. Must stack above the (also-blurred) header on scroll.
- **Form success overlay (`.form__success`):** line 971 in index.html has `absolute inset-0 bg-white/80 backdrop-blur-3xl z-20`. Must stack above the form fields (also blurred in v4.0). If the form container becomes `.liquid-regular` (new stacking context), the `z-20` inside it is now relative to the form container's own stacking context — success overlay may appear **behind** fields that previously sat behind it.
- **Hero floating info cards:** lines 254, 265 in index.html have `z-30` positioning over the hero illustration (`z-10`, `z-20`). Once all four elements are `.liquid-regular`, each creates its own stacking context and `z-30` inside the hero may not stack correctly relative to the nav (`z-50`).
- **Mesh-bg overlay:** `bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]` at hero (line 149) — currently blurs everything behind it. With more blurred surfaces above it, the composite gets muddy.

Every new backdrop-filter invocation is a new stacking context. The v4.0 migration will roughly triple the number of stacking contexts on index.html.

**Why it happens:**
Stacking contexts are counter-intuitive. `z-index: 100` inside a stacking context is not "above everything with z-index < 100" — it's "above siblings inside the parent stacking context." When you add a stacking context to the parent, the child z-index becomes local, not global.

**How to avoid:**
1. **Phase 3 (primitives) gate:** document the new stacking context map. For each existing z-index in the 6 pages, determine whether it's inside a new `.liquid-regular` container and whether the stacking order is preserved.
2. **Phase 5 (contacts.html) gate:** contacts.html is the simplest form page. Test form success overlay appearance. If it renders behind form fields, fix before moving to Phase 6.
3. **Convention:** if an overlay must escape its parent stacking context, hoist it out of the `.liquid-regular` container. Use a body-level portal pattern (append to `<body>` via JS on form submit). This is a departure from current implementation — flag as a Phase 5 decision.
4. **Alternative convention:** avoid nested `backdrop-filter`. If a parent is `.liquid-regular`, children with their own translucency use `background: rgba(...)` without `backdrop-filter` — they won't create a new stacking context and the parent's blur is sufficient.
5. **Phase 7 (index.html) explicit z-index audit:** map every `z-*` class on the page. Note which are inside Liquid Glass containers and which are outside. Adjust as needed.

**Warning signs:**
- Form success overlay appears behind form fields (should be on top).
- Mobile menu drawer appears behind header.
- Hero floating info cards disappear behind hero illustration.
- Dark-mode theme toggle dropdown (if added later) appears behind nav.

**Phase to address:** **Phase 3 (map contexts), Phase 5 (contacts.html as canary), Phase 7 (index.html full audit).**

---

### Pitfall H4: WCAG AA contrast fails over non-uniform glass backgrounds

**What goes wrong:**
v3.0 shipped accessible text tokens (`--mu-text-700 = #4A4E5C` @ 5.89:1 on `#FBFBFB`, `--mu-text-500 = #6B6F80` @ 4.50:1). These contrast ratios assume a uniform white-ish background. v4.0 Liquid Glass surfaces are **translucent** — the effective background under text shifts with whatever is behind the glass surface. A form input on the page background (white) might hit 4.50:1; the same input over the hero mesh-bg blobs (cyan, teal, mint) drops below 4.5:1.

The specific FEATURES.md finding (G.4, citing Infinum): iOS 26 beta measured contrast ratios as low as 1.5:1 over non-uniform backdrops.

Our failure modes:
- **Hero form area on index.html:** the mesh-bg blobs create a gradient from navy/cyan (top) to mint/green (bottom). A `.liquid-input` over this gradient has variable effective background.
- **Sticky mobile bar over content:** the sticky bar is the last element painted on every scroll position; its glass background is whatever is currently under it. Contrast varies with scroll position.
- **Mobile menu drawer over content:** same issue — content scrolled behind the drawer varies.
- **Dark mode:** even worse. Dark glass over photos / dark gradients / reviews with portrait photos.

**Why it happens:**
Automated WCAG AA checkers (axe-core) measure contrast against the **declared** background color. They cannot measure effective background through a `backdrop-filter: blur()`. The tool reports "pass" while real users see "fail."

**How to avoid:**
1. **Token adjustment for glass surfaces:** for text on `.liquid-regular`, `.liquid-card`, `.liquid-input`, use `--mu-text-900 = #1B212C` (higher contrast) not `--mu-text-500 = #6B6F80`. Document in DESIGN-SYSTEM.md: "On Liquid Glass surfaces, use `text-mu-text-900` for body, `text-mu-text-700` for labels, avoid `text-mu-text-500`."
2. **Font-weight bump on glass (FEATURES.md F.2):** body text on glass should be `font-semibold` (600) not `font-medium` (500). Thicker strokes improve legibility over variable backdrop.
3. **Phase 8 gate: manual contrast check on real rendered pages** (not just the tokens). Pick the worst-case spots — form input over mesh-bg, sticky bar over card grid, mobile menu over hero — and measure contrast with a pixel-sampling tool (Colour Contrast Analyser or similar). This is not automated; it requires human review at the Phase 8 gate.
4. **Guardrail token:** if the worst-case drops below 4.5:1, add an opaque fallback background to that specific surface. `.liquid-input { background: rgba(255,255,255,0.85); }` instead of `0.5` — loses some "glass" but guarantees contrast.
5. **`.liquid-text-safety` escape-hatch** (FEATURES.md F.3): `text-shadow: 0 1px 0 rgba(0,0,0,0.08)` on specific elements where contrast is marginal. Use only as a last resort.

**Warning signs:**
- Text on any glass surface looks "washed out" or hard to read against a colored background.
- Colour Contrast Analyser pixel-sample reports < 4.5:1 on any body text.
- ЦА 45+ user testing (if possible) reports difficulty reading form labels or nav items.

**Phase to address:** **Phase 3 (primitive recipe contrast pre-check), Phase 8 (full manual audit).** — HIGH because WCAG AA is a project baseline (v3.0 decision), not optional.

---

### Pitfall H5: Dark-mode re-enabled glass produces v1.4 "murky navy smear" because of wrong dark recipe

**What goes wrong:**
v1.4 Key Decision: "Dark mode disables backdrop-filter (glass-off) — murky smear on navy `#0F1923`." v4.0 reverses this decision (per FEATURES.md G.2) with a tuned recipe: `--liquid-bg: rgba(30,40,60,0.45)` (dark base), `--liquid-blur: 28px`, `--liquid-saturate: 160%`, `--liquid-brightness: 115%`, and an adjusted rim lighting scheme.

The recipe is triangulated from community sources (dev.to, CSS-Tricks, kube.io) — not measured on MedicusUnion's actual dark-mode pages. The v1.4 failure suggests dark-mode glass is surprisingly hard to tune. The recipe may reproduce the failure under one or more of these conditions:

- **Content behind the glass is near-black** (e.g., a photo or illustration with lots of dark pixels). Dark glass + dark content = mud.
- **Blur radius too high** pulls pixels from too far away; on dark content, the average is near-black and the glass looks opaque.
- **Saturate too high** over-amplifies color noise in dark photos (JPEG artifacts, compression banding).
- **Brightness too high** washes the darks to mid-grey, losing content identity.

**Why it happens:**
FEATURES.md G.3 flagged that photos under dark glass are a known mud-producer. The recipe values are best-guess, not measured. The proper approach is to prototype and tune; the research phase can identify the trap but not pre-solve it.

**How to avoid:**
1. **Phase 3 explicit tuning subtask:** build a test page with `.liquid-card` on dark mode, with varied backgrounds (solid dark, gradient, photo, mesh-bg). Visually tune `--liquid-blur-*`, `--liquid-saturate`, `--liquid-brightness` until the glass reads as glass on all content types. Document final values with notes on what was tried.
2. **Per-surface override escape hatch:** if a specific surface fails (e.g., hero in dark mode), allow `.dark .liquid-card--on-hero { backdrop-filter: none; background: #1a1f2e; }` as a surgical opt-out. Document in DESIGN-SYSTEM.md as "Dark-mode glass off — last resort."
3. **Photos get overlay, not just glass:** per FEATURES.md G.3, dark-mode photos under glass chrome should have `rgba(0,0,0,0.35)` overlay before the glass layer. Apply to clinic cards and review cards on treatment-abroad / online-consultations pages.
4. **Phase 8 gate: dark-mode visual review on every page.** If any surface looks like v1.4 "murky smear," iterate before Phase 9. Budget two days for dark-mode tuning in Phase 8.
5. **Key Decision log update:** at v4.0 ship, PROJECT.md records "v4.0 re-enables dark glass with tuned recipe" as a new decision, superseding the v1.4 "glass-off" decision. If Phase 8 tuning fails, the decision may instead say "v4.0 keeps dark-mode glass-off, tuned recipes deferred to v4.1" — that is acceptable.

**Warning signs:**
- Dark-mode screenshot on any page shows glass surfaces as opaque dark patches.
- Content behind glass is unreadable (photos become black squares).
- Glass surfaces in dark mode look visually identical to `background: var(--mu-text-900)` (no translucency visible).

**Phase to address:** **Phase 3 (tuning), Phase 8 (full visual audit). HIGH risk — dark-mode failure is a public regression from v1.4 "at least it works, even if boring."**

---

### Pitfall H6: 8-column tablet grid + Russian long compounds → ugly hyphenation / overflow on 2-col cards

**What goes wrong:**
The 8-col tablet convention produces 4-col-wide cards (2-up) or 2-col-wide cards (4-up). A 2-col-wide card at tablet width (e.g., 768px viewport, `grid-cols-8 gap-6`, card spans 2 cols) is roughly 176px wide. Russian compounds like `высококвалифицированный` (22 chars), `международный` (13 chars), `стоматологический` (17 chars), `многопрофильный` (15 chars) don't fit in 176px at `text-base` (16px) — minimum ~200-220px.

Three bad outcomes:
- **Overflow:** the word pushes the card wider than its grid cell, breaking the 8-col alignment.
- **Hyphenation:** if `hyphens: auto` + `lang="ru"` is set (v3.0 typography pass), Russian words hyphenate at arbitrary points. Cyrillic hyphenation dictionaries for browsers are incomplete; the break can happen mid-root ("стома-тологический") which reads badly.
- **Text-wrap: balance failure:** `text-wrap: balance` on headings is unreliable for Cyrillic (v3.0 decision) — balance algorithm may not find a good break point and produce an awkward wrap.

FEATURES.md F.4 flagged this and recommended "tablet cards should be 4-col minimum (2-up), not 2-col (4-up)" — this is the mitigation, but it must be enforced per card layout.

**Why it happens:**
Tailwind's flexible grid lets contributors write `col-span-2` without thinking about content width. Russian compound words are significantly longer than English equivalents for similar semantic density (roughly +30% character count). Design mockups often use English placeholder text and miss the problem.

**How to avoid:**
1. **Document in DESIGN-SYSTEM.md section 5.3 / 5.4:** "At `md:` (tablet, 8-col), card children use `md:col-span-4` minimum (2 cards per row). Do not use `md:col-span-2` for text-bearing cards; only icon chips / stats / flags can use col-span-2."
2. **Phase 6–7 per-card audit:** for each card row, verify `md:col-span-4` (or larger) is used. `md:col-span-2` is only acceptable for non-text card content (icons, stats, flags).
3. **Preserve v3.0 Russian typography rules:**
   - `hyphens: auto` + `lang="ru"` (verify still in place — v3.0 shipped this globally)
   - Do NOT use `text-wrap: balance` on Cyrillic headings (v3.0 decision)
   - nbsp binding for subject+verb pairs preserved (Pitfall C4)
4. **Use `break-words` Tailwind utility** as a soft safety net on text content — forces long words to break mid-word rather than overflow. Visual regression (ugly break) but better than layout regression (overflow).
5. **Phase 7 (index.html) smoke test:** screenshot service cards on 768px viewport. Verify no overflow, no mid-root hyphenation, no ugly wraps.

**Warning signs:**
- Card content overflows its grid cell on tablet viewport.
- Hyphenation appears mid-root in Russian words.
- Horizontal scroll on tablet viewport (despite `overflow-x: clip` safety net — clip hides the overflow but the layout is still broken).
- Headings wrap with orphan words.

**Phase to address:** **Phase 6, 7 — HIGH. Gate per page: all text-bearing cards use `md:col-span-4` or larger.**

---

### Pitfall H7: Long data-URI SVG masks bloat `css/styles.css` past reasonable mobile budget

**What goes wrong:**
ARCHITECTURE.md C.7 estimates "~5 mask variants at ~2 kB each uncompressed, total bloat ~10 kB" — but that's for **one aspect ratio bucket per radius**. STACK.md A notes that squircle mask SVG paths are aspect-ratio-specific, and if the project uses more than one aspect ratio (buttons are wider than tall, icon chips are square, form inputs are much wider than tall), we may need multiple mask variants per radius.

If we ship 5 radii × 3 aspect ratios = 15 masks × 2 kB each = 30 kB source, ~15 kB minified. Still acceptable, but approaching the budget that matters for KZ 3G/4G mobile users.

Worse case: if a contributor hand-authors a per-element mask (e.g., a specific `width × height × radius` combo for a hero illustration container), the file grows linearly. At ~50 unique masks, `css/styles.css` adds ~100 kB — noticeable load-time hit on mobile.

Compounding: Tailwind CLI `--minify` compresses data-URIs by removing whitespace but does not re-encode the SVG. The saved bytes are limited.

**Why it happens:**
Data-URIs are verbose because they escape SVG as URL-encoded XML. Each mask is effectively a string of XML text embedded in CSS. The compression ratio is poor.

**How to avoid:**
1. **Phase 2 cap: 5 mask variants total.** One per radius token (sm/md/lg/xl/full). Use `preserveAspectRatio="none"` + `mask-size: 100% 100%` to stretch a single unit-square mask across any aspect ratio. The stretch produces slight corner asymmetry at extreme aspect ratios (very long thin buttons) but is visually acceptable — per STACK.md A, "visible artifact only at extreme aspect ratios, which this project does not use."
2. **Document in DESIGN-SYSTEM.md:** "Squircle masks are a **fixed set of 5**. Do not hand-author per-element masks. If a specific shape needs a unique treatment, use `clip-path` on that element only, do not pollute the global mask token scale."
3. **Phase 2 gate:** `grep -c 'data:image/svg+xml' src/styles/squircles.css` must return ≤ 5. More = scope creep; reject.
4. **Phase 8 gate (perf):** measure `css/styles.css` size. If > 80 kB minified (current baseline + v4.0 overhead), investigate; if > 120 kB, block ship. Current `css/styles.css` size must be captured at Phase 1 baseline for comparison.
5. **Progressive enhancement on Chrome 139+:** `corner-shape: superellipse(2)` is zero-byte. Chrome users see a 0 kB squircle. Only the mask fallback for Safari/Firefox/older Chrome ships the data-URIs. This is already the STACK.md plan — reinforce in docs.

**Warning signs:**
- `css/styles.css` size grows > 2x between v3.2 and v4.0 ship.
- `squircles.css` > 20 kB source.
- Contributor PR adds a new data-URI mask string "for just this one element."
- Load time on KZ 3G/4G test regresses by > 500 ms.

**Phase to address:** **Phase 2 (cap enforcement), Phase 8 (measurement).**

---

### Pitfall H8: `backdrop-filter: blur()` drops budget Android scroll FPS below usable threshold

**What goes wrong:**
v4.0 Key Decision accepted "worse experience on budget Android" as a trade-off. But "worse" has a threshold: below ~20 FPS, scroll becomes actively painful (visible stutter, touch lag, dropped frames). Budget Android = Samsung Galaxy A-series (2020–2022, Mali-G52, Adreno 610 class GPUs) and Xiaomi Redmi (similar). These devices dominate the ЦА 45+ KZ market.

STACK.md B estimates: "on a 2020 Samsung Galaxy A, index.html with 6–8 visible glass surfaces in the hero viewport will drop to ~40–50 FPS. Scrolling past the initial viewport recovers to 60." But that estimate is for the specified 6-8 surfaces. v4.0 applies glass to **every** surface: nav, mobile menu, sticky bar, hero, 4 floating info cards, 4 service cards, FAQ items, form, CTA — that's ~30 glass surfaces across the viewport during a scroll.

At 30 surfaces, the estimated per-frame cost is 15-25ms just for backdrop-filter composition. Combined with squircle mask-image, JS animation (Motion), and the mesh-bg blob compositing — frame budget at 60 FPS is 16.6ms. We're over budget.

**Why it happens:**
Each `backdrop-filter` invocation samples the pixels behind the element and applies a blur kernel. For a 40px blur, the kernel samples ~80×80 pixels per output pixel. For 30 elements on a 1080p viewport at 60 FPS, that's millions of samples per frame. Budget GPUs can't keep up.

`will-change: backdrop-filter` is sometimes proposed as a fix but actually makes it worse (STACK.md section B warns explicitly): promoting every glass element to its own compositor layer multiplies memory and rasterization cost.

**How to avoid:**
1. **Phase 8 is a measurement gate, not an optimization gate.** v4.0 accepts perf degradation per Key Decision — but measures it. Acquire a representative budget Android device (Samsung Galaxy A32, A52, or Xiaomi Redmi Note 10 series). Measure scroll FPS on index.html.
2. **Threshold: ≥ 30 FPS during scroll.** Below 30 FPS triggers an investigation and potential mitigation. Above 30 is "accepted trade-off per Key Decision." Above 45 is "hooray, budget concerns overblown."
3. **Mitigations if below threshold:**
   - **Limit visible glass surfaces per viewport.** Specifically: during scroll, not every card must be glass at the same time. Can we degrade cards below the fold to `backdrop-filter: none`? Technically yes via `@media` on device capability — hard but possible.
   - **Reduce blur radius on mobile.** `@media (max-width: 640px) { .liquid-card { --liquid-blur-md: 12px; } }` — mobile gets v1.4-level blur. Still "glass" but cheap.
   - **`prefers-reduced-motion` blur downgrade** (already in ARCHITECTURE.md D.6) — doubles as a perf escape hatch.
   - **Disable backdrop-filter on specific non-critical surfaces.** Icon chips inside cards don't need their own blur; they can inherit the card's blur via `background: transparent`. Saves per-element cost.
4. **Do NOT use `will-change: backdrop-filter`** — it makes things worse. Document in DESIGN-SYSTEM.md anti-pattern.
5. **Phase 8 measurement protocol:** (a) load index.html on budget Android; (b) scroll from top to bottom at a natural pace; (c) Chrome DevTools remote debugging → Performance panel → capture; (d) read scroll FPS histogram; (e) if min FPS < 30, investigate mitigation.

**Warning signs:**
- Scroll on budget Android looks stuttery to the naked eye.
- Chrome DevTools Performance tab reports "Main thread > 16ms per frame" with paint/composite as the largest segment.
- Tapping a card has > 150ms delay before press animation fires.
- Form scroll-to on submit is visibly slow.

**Phase to address:** **Phase 8 — HIGH. Measurement gate, not optimization gate. Mitigations are optional per Key Decision.**

---

### Pitfall H9: Translucent secondary CTA looks like decoration, not button, to ЦА 45+

**What goes wrong:**
FEATURES.md H.3 and H.4 identified this as the "cognitive load audit" concern: a Liquid Glass secondary button (`backdrop-filter: blur()` + `rgba(255,255,255,0.5)` + squircle + rim lighting) reads as "decorative chrome" to users who are not familiar with iOS 26 design language. ЦА 45+ in KZ are likely on Android and Windows — they have never encountered Liquid Glass before. The visual convention of "this translucent thing is a button" is learned, not innate.

Primary CTA is safe because FEATURES.md H.3 locked in "primary CTA stays gradient-filled (green→teal)" — that is the load-bearing "this is definitely a button" signal. But **secondary** CTAs ("Подробнее", "Как это работает", hero secondary button, card action buttons) become Liquid Glass in v4.0. Risk: ЦА 45+ users don't recognize them as clickable.

Consequence: reduced engagement with secondary CTAs → reduced page depth → reduced conversions at the form (which is 2-3 clicks down from the hero).

**Why it happens:**
Glass morphism is a post-2020 design trend. Users who haven't used iOS since iOS 15 (many ЦА 45+ on Android) don't have a mental model for "translucent panel = clickable." The cue that says "button" for older users is **fill + border + distinct-from-background**. Glass buttons are none of those (they are fill-by-backdrop, subtle border, intentionally-blended).

**How to avoid:**
1. **Affordance reinforcement on secondary buttons:**
   - Keep the 1px white border (`border: 1px solid rgba(255,255,255,0.7)`) — it's thin but distinct.
   - Add a subtle text weight bump: `font-semibold` (600) not `font-medium` (500). Weightier text signals "interactive label."
   - Retain the existing press scale `transform: scale(0.97)` on `:active`. Tactile feedback is the strongest "this is a button" signal for ЦА 45+.
2. **Hover state MUST be obvious.** On hover, `.liquid-btn-secondary` background goes from `rgba(255,255,255,0.5)` to `rgba(255,255,255,0.7)` — a clear brightening. Do not skip this.
3. **Shimmer on hover only for primary CTA (per FEATURES.md H.4).** Do not add shimmer to secondary buttons. Shimmer is a differentiator, not table stakes.
4. **Icon inside the button where possible.** "Подробнее →" with the arrow icon is more button-like than "Подробнее" alone. Where v3.0 already has icons, preserve them.
5. **Phase 8 UX smoke test (if possible):** show the redesigned index.html to a non-technical 45+ user. Ask "what on this page can I click?" If they miss secondary CTAs, iterate.
6. **Fallback:** if user testing reveals secondary CTAs are invisible, downgrade them to a **bordered** style — less glassy, more explicit button chrome. This is a design fallback, not a technical pitfall.

**Warning signs:**
- Non-technical review says "where's the 'learn more' button?" pointing to a visible glass button.
- Post-ship analytics show click-through on secondary CTAs is below v3.2 baseline.
- Hover on secondary button doesn't produce a visibly different state.

**Phase to address:** **Phase 3 (design primitives), Phase 8 (user smoke test).** — HIGH because secondary CTA engagement is directly tied to conversion funnel.

---

### Pitfall H10: `text-wrap: balance` re-introduced during refactor despite v3.0 rejection

**What goes wrong:**
v3.0 decision: `text-wrap: balance` is unreliable for Cyrillic headings, so subject+verb binding is done with explicit `&nbsp;`. v4.0 refactoring hero headings is tempted to "use modern CSS" — `text-wrap: balance` on all h1/h2 to get nice wrap behavior — because it's a 2024+ feature and feels like the "right" way.

This silently breaks on Russian content: balance algorithm produces worse wrap points than the deliberate `&nbsp;` bindings, and the `&nbsp;` bindings remain (contributor thinks balance will handle it). Result: a mix of explicit nbsp + balance that produces inconsistent wrap behavior and occasionally breaks a binding the nbsp was enforcing.

**Why it happens:**
`text-wrap: balance` is widely recommended in 2026 web-dev content for English headlines. Cyrillic-specific warnings are rare. A contributor unfamiliar with the Russian-typography context sees "best practice" and applies it.

**How to avoid:**
1. **Explicit anti-pattern in DESIGN-SYSTEM.md section 8:** "Do not use `text-wrap: balance` on any element containing Russian text. The v3.0 decision stands — `&nbsp;` bindings are the solution."
2. **Phase 5–7 gate grep:** `grep 'text-wrap:\?balance\|text-wrap-balance\|text-balance' *.html src/styles/*.css` must return zero.
3. **Tailwind utility `text-balance` is tempting** (Tailwind v4 adds it). Document explicit rejection — the whole `text-wrap` family is off-limits for Cyrillic body content.
4. **`text-wrap: pretty` is also suspect for Cyrillic** — not as widely tested as balance, but same underlying issue. Also rejected.

**Warning signs:**
- `text-balance` or `text-wrap: balance` appears in any file during Phase 5–7.
- Heading wraps inconsistently across page reloads (balance is non-deterministic in some implementations).
- A subject+verb binding that was enforced by `&nbsp;` now allows a break (balance overrode the binding).

**Phase to address:** **Phase 5, 6, 7 — HIGH. Anti-pattern grep at each phase gate.**

---

## Medium pitfalls

### Pitfall M1: Photo avatars in testimonials get squircle treatment, look wrong

**What goes wrong:**
Circle-flag SVGs (vendored in v3.1 for country flags) and photo avatars (in review cards, doctor cards) are currently `rounded-full`. v4.0's "universal squircle replacement" mandate says "abosolutely all" including avatars and flags. But:

- **Circular flags** have visual conventions — SVG flags are designed to sit in perfect circles (designed that way by the `circle-flags` library). Forcing them into a squircle mask distorts the flag graphic at the corners.
- **Photo avatars** are square-ish photos cropped to a circle. A squircle crop exposes slightly more of the corners, revealing background or chin/forehead clipping artifacts that were hidden by the circle.

FEATURES.md didn't explicitly rule on avatars and flags — the universal mandate would apply them, but the visual result may be worse than the pre-v4.0 circles.

**Why it happens:**
"Universal squircle" is a design mandate from user. Taking it literally is tempting; pushing back is uncomfortable. But the visual result is the truth.

**How to avoid:**
1. **Phase 2 or Phase 3 explicit scope decision:** `.squircle-full` for circular elements is **visually identical** to `rounded-full` — a squircle with radius = 50% is a circle. There is no "squircle avatar" — the superellipse formula collapses to a circle at full-radius. Therefore flags and avatars get `.squircle-full` but look identical to v3.2.
2. **Document in DESIGN-SYSTEM.md section 4.1:** "`.squircle-full` = circle (no visual difference from `rounded-full`). Use on pills, avatars, icon buttons. The class is provided for vocabulary consistency, not visual change."
3. **No per-element exception needed.** The mandate "universal squircle" is satisfied by `.squircle-full` on circular elements without any visual regression.

**Warning signs:**
- Review team asks "the avatars look different now — is that intentional?"
- Flags appear to have a subtle distortion at the corners.
- Photos show previously-hidden content (background leakage).

**Phase to address:** **Phase 2 (squircle scale decision), Phase 9 (documentation).**

---

### Pitfall M2: Mesh-bg blob decorative elements conflict with Liquid Glass backdrop composition

**What goes wrong:**
`index.html` hero has 3 `mesh-bg__blob` decorative absolute divs (lines 146–148): `w-[60vw] h-[60vw] rounded-full bg-mu-blue/30 blur-[120px]` etc. Plus a white overlay with its own blur (line 149). These are already "glass" in a loose sense — blurred gradient shapes.

v4.0 adds Liquid Glass on top: hero illustration container becomes `.liquid-card`, floating info cards become `.liquid-card`, etc. The composite becomes:
- Background layer: mesh-bg blobs with `blur(120px)` and `mix-blend-multiply`.
- Overlay layer: white 40% with `backdrop-filter: blur(40px)` (existing).
- Content layer: hero illustration with `.liquid-card` + `.squircle-xl`.
- Floating info cards: `.liquid-card` + `.squircle-lg`.

The layered blur cost is measurable: 120px blur on 3 blobs + 40px backdrop-filter on overlay + 24px backdrop-filter on each liquid card. The overall composite may look "muddy" — too much blur, not enough contrast.

Worse: the mesh-bg blobs use `mix-blend-multiply`, which interacts badly with some backdrop-filter implementations. On Safari, mix-blend-multiply over a backdrop-filter can produce unexpected dark artifacts.

**Why it happens:**
Each layer of blur was designed independently. v1.4 shipped the mesh-bg; v4.0 adds the Liquid Glass. The composite is emergent.

**How to avoid:**
1. **Phase 7 decision per blob:** either (a) keep mesh-bg as-is and accept the muddy composite, (b) reduce mesh-bg blur from 120px to 60px (still visible as gradient, less GPU cost), (c) remove mesh-bg entirely in favor of Liquid Glass-driven backdrop.
2. **Recommendation: option (b) — halve the blur.** The mesh-bg adds color richness that pure Liquid Glass doesn't provide; removing it flattens the hero. But 120px is overkill when there's already 40px overlay blur on top.
3. **Test on Safari for mix-blend-multiply artifacts.** If dark patches appear, replace with `mix-blend-mode: normal` and accept slightly flatter blob colors.
4. **Phase 7 gate:** visual review of index.html hero on Chrome, Safari, Firefox. Composite must not be "muddy" — content behind glass layers must still be visible.

**Warning signs:**
- Hero composite looks darker/muddier than v3.2 reference screenshots.
- Safari shows dark patches where mesh-bg blobs overlap liquid cards.
- Scroll FPS drops during hero-in-view (cost of composite).

**Phase to address:** **Phase 7 — MEDIUM. Explicit decision per blob.**

---

### Pitfall M3: Print stylesheet shows blank rectangles where glass should be

**What goes wrong:**
`backdrop-filter` and `mask-image` are both unreliable in print media across browsers. Chrome and Safari may print glass surfaces as transparent (no background visible), white (opaque fallback), or grey (partial rendering). Masks may print as solid rectangles (no shape) or as the mask silhouette with no fill.

Users printing a contact page (doctor's office staff printing patient-facing details, an older user printing directions) get a broken-looking print.

MedicusUnion KZ does not currently have a print stylesheet (no `@media print` rules in `theme.css` based on grep). Printing falls through to the screen styles, which in v4.0 = glass surfaces.

**Why it happens:**
Print is an afterthought. v4.0 adds many more backdrop-filter surfaces than v1.4, making the print regression more visible. Older users are more likely to print.

**How to avoid:**
1. **Add a minimal `@media print` block in `theme.css @layer base`:**
   ```css
   @media print {
     * {
       backdrop-filter: none !important;
       -webkit-backdrop-filter: none !important;
       mask-image: none !important;
       -webkit-mask-image: none !important;
       box-shadow: none !important;
     }
     .liquid-regular, .liquid-card, .liquid-btn-primary, .liquid-btn-secondary,
     .liquid-input, .liquid-nav, .liquid-sheet, .liquid-sticky-bar {
       background: white !important;
       color: black !important;
       border: 1px solid #ccc !important;
     }
   }
   ```
2. **Hide decorative elements when printing:** mesh-bg blobs, floating info cards, shimmer pseudos. Use `.print-hidden` utility.
3. **Phase 3 or Phase 9 cheap win:** implement the `@media print` block once, shared across all pages.
4. **Phase 8 gate:** print `contacts.html` (most likely to be printed) from Chrome and Safari. Verify text is readable.

**Warning signs:**
- Print preview shows blank rectangles, grey boxes, or missing text on any page.
- Browser console shows `backdrop-filter` warnings during print.

**Phase to address:** **Phase 3 or Phase 9 — MEDIUM. Low implementation cost, high regression prevention.**

---

### Pitfall M4: `:user-valid` left-border indicator clipped by squircle mask

**What goes wrong:**
`theme.css` lines 324–331 shipped the native `:user-valid` green left-border feedback:
```css
.contact-form input:user-valid,
.contact-form select:user-valid,
.contact-form textarea:user-valid {
  border-left: 3px solid var(--mu-green-600);
}
```

This is a valid-state visual cue — after a field loses focus with valid content, it gets a 3px green left border. v4.0 applies `.squircle-md` to form inputs. The mask clips the border to the squircle silhouette → left border disappears or becomes a tiny green arc near the top-left corner. The validation feedback is silently lost.

**Why it happens:**
Border + mask-image incompatibility is the same root issue as C1 (focus ring) — `mask-image` clips everything outside the mask silhouette, including borders declared on the element.

**How to avoid:**
1. **Move the valid-state indicator from `border-left` to `box-shadow: inset 3px 0 0 var(--mu-green-600)`** — inset box-shadows are NOT clipped by mask-image (they are painted inside the mask space). Same visual result, mask-compatible.
2. **Alternative: use an `::after` pseudo-element** positioned absolute as a 3px colored bar. More code but more explicit.
3. **Phase 5 gate per form:** validate a field, verify the green indicator appears. If not, the border got clipped — switch to inset box-shadow.
4. **Document in DESIGN-SYSTEM.md section 5.1 (shadow-wrap / mask compatibility):** "Borders (1px, 2px, 3px solid) on squircle elements are clipped. Use inset box-shadow instead."

**Warning signs:**
- Filling a form field and tabbing away shows no green indicator on valid fields (v3.0 shipped this — if missing, regression).
- Green bar visible on non-squircled inputs but not squircled ones.
- Form validation still works (JS-level) but visual feedback is missing.

**Phase to address:** **Phase 3 (primitive `.liquid-input`), Phase 5 (contacts.html validation gate).**

---

### Pitfall M5: Small-radius squircle is visually indistinguishable from rounded rectangle — wasted complexity

**What goes wrong:**
At `--squircle-sm = 8px`, the difference between a squircle and a rounded rectangle is visually imperceptible. You have to compare at 3x zoom to see the curvature difference. Shipping a mask-image + SVG data-URI for 8px radius is cost (file size, mask computation, complexity) with zero visual return.

Existing `--radius-sm` in theme.css is `calc(var(--radius) - 4px) = 6px` — below the squircle-visibility threshold. `--radius-md = calc(var(--radius) - 2px) = 8px` — at threshold. Only `--radius-lg = 10px` and above benefit visibly from squircle treatment.

**Why it happens:**
The "universal squircle" mandate is strong. Taking it literally means shipping squircle-sm. But it's cosmetic wasted effort.

**How to avoid:**
1. **Phase 2 decision: `.squircle-sm` exists as a vocabulary class but uses only `border-radius: 8px`, no mask-image.** At 8px, the squircle shape is imperceptible, so shipping the mask is wasted. `corner-shape: superellipse(2)` progressive enhancement is also a no-op at small radii.
2. **Document in DESIGN-SYSTEM.md section 4.1:** "`.squircle-sm` (8px) is effectively a rounded rectangle and does not ship a mask. Use for badges, chips, flag icons where the visual difference wouldn't be noticed. Upgrade to `.squircle-md` (16px) or larger if squircle character matters."
3. **Save file size:** skip the 8px data-URI, ship only 4 variants (md/lg/xl/full). Phase 2 gate: `squircles.css` ships 4 data-URIs, not 5.

**Warning signs:**
- A/B visual review at Phase 8 shows no observable difference between 8px squircle and 8px rounded rectangle.
- A contributor hand-authors a tiny SVG mask for a small element thinking it matters.

**Phase to address:** **Phase 2 — MEDIUM. Scope trim.**

---

### Pitfall M6: Hero SVG illustrations rendered inside squircle container expose transparent bleed

**What goes wrong:**
v2.0 ships duotone SVG hero illustrations (e.g., `online-consultations.html` hero, `index.html` hero). These SVGs often have transparent bleed areas (padding around the main shape) or rectangle backgrounds filled with the container color. When placed inside a `.squircle-xl` container, the SVG renders up to its own bounding box, not the squircle silhouette.

Two failure modes:
- **Transparent SVG over a light container:** the mask clips the container but the SVG extends past the mask silhouette, rendering in the "clipped" zone as if the mask weren't there. Visually: SVG bleeds out of the squircle.
- **SVG with a rectangular background fill:** the fill is clipped by the mask, but the clipping may show the original rectangle corners poking out (if the fill is opaque and the mask is applied to a parent).

**Why it happens:**
`mask-image` on a parent container clips the parent's painted box, not its children. SVG children paint in their own coordinate space; if the SVG's bounding box extends past the parent's mask silhouette, the SVG is visible in the clipped zone.

**How to avoid:**
1. **Ensure the SVG illustration is sized to fit inside the squircle, not at the edges.** Add padding to the container: `.hero-illustration-wrap { padding: 2rem; }` so the SVG occupies the safe interior of the squircle.
2. **Alternative: apply `.squircle-xl` to the SVG itself, not the container.** SVGs can be mask-image targets directly.
3. **Phase 7 explicit per-illustration check:** for each hero SVG on 6 pages, verify rendering inside the squircle container. No bleed, no corner artifacts.
4. **Fallback: use `clip-path` instead of `mask-image` for the illustration container.** `clip-path` clips the entire subtree, including SVG children, whereas `mask-image` only clips the element's own paint.

**Warning signs:**
- SVG illustration has visible corners poking out of the squircle container.
- At hover (container transform), the SVG shifts relative to the squircle — indicates the mask is on the container and the SVG is positioned independently.

**Phase to address:** **Phase 7 — MEDIUM. Per-illustration verification.**

---

### Pitfall M7: Liquid Glass shimmer on hover is vestibular trigger for 45+ users

**What goes wrong:**
FEATURES.md C.2 shipped `.liquid-shimmer` as a differentiator: a 800ms linear-gradient sweep on `::before` pseudo-element on hover. FEATURES.md H.4 limited it to "hero CTA only" — but v4.0 executors may miss that limit and apply it to cards, secondary buttons, nav items, etc.

Shimmer motion on a 45+ audience is a known vestibular trigger: scrolling the eye across a moving glint on every hover creates motion-sickness symptoms in users with vestibular sensitivity (estimated 15-20% of 45+ population). The effect is subtle for each instance but cumulative across a page visit.

**Why it happens:**
Shimmer is cute. The Apple aesthetic emphasizes "Liquid" motion and subtle animation. A contributor implementing the v4.0 design naturally wants to apply shimmer everywhere glass exists.

**How to avoid:**
1. **DESIGN-SYSTEM.md section 8 anti-pattern:** "Shimmer is for hero primary CTA only. Do not apply to cards, secondary buttons, nav, inputs, or any other surface."
2. **`.liquid-shimmer` documented with usage limit** in DESIGN-SYSTEM.md section 4.2: "Apply to hero primary CTA on each page. Nowhere else."
3. **Phase 3 gate grep:** `grep -c 'liquid-shimmer' *.html` must return ≤ 6 after Phase 7 (one per page).
4. **`prefers-reduced-motion` guard on shimmer is non-negotiable** — already in FEATURES.md C.2. Verify in Phase 3 smoke test.
5. **The reduced-motion downgrade blur to 8px (ARCHITECTURE.md D.6)** applies here too: shimmer `::before { display: none; }` in reduced-motion mode.

**Warning signs:**
- `liquid-shimmer` class on any element that is not `hero__cta-primary` or similar hero-scoped.
- Reduced-motion users still see shimmer (missing `@media` guard).
- Post-ship user feedback mentions "flashing" or "blinking" on the page (misreading shimmer).

**Phase to address:** **Phase 3 (convention), Phase 7 (application audit), Phase 8 (reduced-motion verification).**

---

### Pitfall M8: New Liquid Glass classes collide with existing `.card--glass` during parallel-run migration

**What goes wrong:**
ARCHITECTURE.md D.4 prescribes parallel run: keep `.card--glass` existing, introduce `.liquid-card`, migrate element-by-element, delete `.card--glass` only after all HTML migrates. During the parallel phase, both classes exist and an element may end up with both (`class="card--glass liquid-card ..."`), producing double backdrop-filter, double shadow, potentially z-index surprises.

**Why it happens:**
A contributor editing an element adds `liquid-card` but forgets to remove `card--glass`. Or vice versa. Or a search-and-replace misses the element.

**How to avoid:**
1. **Phase 5–7 per-page grep check:** `grep -o 'card--glass' <page>.html | wc -l` after migration. If > 0, either fully migrate or fully revert — no partial state.
2. **Phase 7 final gate:** `grep -rn 'card--glass' *.html src/styles/` must return zero. If zero, delete the `.card--glass` CSS (if it exists in any file).
3. **Alternative: make `.card--glass` an alias of `.liquid-card` during migration.** Declare in `liquid-glass.css`: `.card--glass { @extend .liquid-card; }` or simple duplication. Both classes produce the same visual. Contributors can migrate at leisure.
4. **Recommend alias approach** — lower risk, no partial states possible, migration is cosmetic vocabulary update, not functional rewrite.

**Warning signs:**
- An element with both `card--glass` and `liquid-card` visible in DOM.
- Doubled shadow, doubled blur on a specific card.
- `grep card--glass` returns results after Phase 7.

**Phase to address:** **Phase 5, 6, 7 — MEDIUM. Alias pattern or strict audit.**

---

## Low pitfalls / known limitations

### Pitfall L1: Refraction (`feDisplacementMap` via `backdrop-filter: url(#...)`) is Chromium-only

**What goes wrong:**
The SVG refraction effect (ARCHITECTURE.md E.1 svg-defs partial) works only in Chromium. Safari and Firefox show the base glass without refraction. Apple-device users (on Safari) see less visual polish than the design intended.

This is a known limitation accepted in STACK.md and FEATURES.md. Not a pitfall in the "regression" sense but worth documenting.

**How to avoid:**
1. **Runtime JS probe sets `html[data-refract="true"]`** only on Chromium browsers. Safari gets no `data-refract` attribute, CSS rule gated by `html[data-refract="true"]` doesn't match, refraction is not attempted.
2. **Document in DESIGN-SYSTEM.md:** "Refraction is a Chromium-only enhancement. Safari and Firefox users see the base Liquid Glass layer without warp. This is intentional — Apple's native Liquid Glass is only achievable with native Metal shaders, not web tech."
3. **Do not apologize for this in the UI.** No banner, no "upgrade to Chrome" nudge. Apple users get the Apple aesthetic baseline (blur + rim + specular); Chromium users get a bonus layer.

**Phase to address:** **Phase 3, Phase 9. LOW.**

---

### Pitfall L2: `corner-shape: superellipse(2)` is Chrome 139+ progressive enhancement only

**What goes wrong:**
Same shape as L1 but for the squircle layer. Chrome 139+ gets native superellipse; everyone else gets mask-image fallback. STACK.md confirms this is accepted.

**How to avoid:**
- Accept as known limitation.
- Mask-image fallback is "good enough" per Smashing Magazine 2026 analysis.
- Document in DESIGN-SYSTEM.md.

**Phase to address:** **Phase 2, Phase 9. LOW.**

---

### Pitfall L3: SF Pro system font rendering differs on non-Apple devices

**What goes wrong:**
ЦА 45+ in KZ are predominantly on Android (Samsung, Xiaomi) and Windows (desktop). SF Pro is Apple-only. The fallback chain `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto` resolves to Roboto (Android) or Segoe UI (Windows). These fonts have different letterform metrics from SF Pro — squircle buttons look slightly different, text alignment shifts by ~1-2px, line heights vary.

Not a regression — this has been the case since v2.0. But v4.0's tighter polish standards make the difference more noticeable.

**How to avoid:**
- Accept as known limitation.
- Do not attempt to ship SF Pro web font (EULA prohibits, STACK.md E).
- Spot-check on a Windows Chrome browser (Segoe UI) and an Android Chrome browser (Roboto) during Phase 8.

**Phase to address:** **Phase 8. LOW.**

---

### Pitfall L4: Liquid Glass is trendy — 3-year lifespan risk

**What goes wrong:**
Apple's previous design languages (flat/Material 2013–2018, "Big Sur" rounded 2020–2025) had ~5-year lifespans. iOS 26 Liquid Glass (shipped 2025) will likely dominate 2025–2030. Sites built in the first 18 months look dated by year 4. MedicusUnion's medical trust context amplifies the risk — looking dated is worse than looking plain.

**How to avoid:**
1. **Accept as known tradeoff.** v4.0 is a visual bet on 2026–2029 relevance.
2. **Keep the brand fundamentals (gradient CTA, green→teal identity, SF Pro, bold typography) as the constant layer.** Liquid Glass is the decorative layer on top. In 3 years, a "v5.0 post-Liquid" milestone can swap the decorative layer without touching brand.
3. **Component primitives are replaceable.** `.liquid-card` can become `.flat-card` in a future milestone with a single CSS file swap. The HTML class markup is the abstraction.

**Phase to address:** **Post-ship concern. LOW.**

---

### Pitfall L5: medicusunion.com (Austria parent) uses different visual language — brand cross-link tension

**What goes wrong:**
The Kazakhstan landing (this project) is visually different from the Austria parent site. A user clicking through to `medicusunion.com/doctors` sees a different design language. Brand consistency tension.

**How to avoid:**
1. **Out of scope for v4.0.** The Austria parent is a separate product with separate ownership.
2. **Cross-link should be visibly distinct** — user expects "this is the Austrian parent, different site." Don't make it look deceptively similar.
3. **Brand equity (logo, colors, CTA gradient) is preserved** — cross-link users see familiar logo even if the surrounding design differs.

**Phase to address:** **Post-ship / v4.1+. LOW.**

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|---|---|---|---|
| Inline a unique SVG mask per-element for a "just this one" card | Exact fit for the element | Data-URI bloat, one-off classes, mask scale creep | Never. Use the 4-variant token set and accept minor corner stretch |
| Use `will-change: backdrop-filter` to "fix" jank | Promotes element to GPU layer | Multiplies memory and rasterization cost; makes things worse | Never. Use `will-change: transform` on shadow-wrap outer only |
| Skip the shadow-wrap pattern for "just this one card" | One less element in HTML | Box-shadow disappears or renders mis-aligned | Only for elements with no outer shadow (icon chips, badges) |
| Reintroduce `text-wrap: balance` on Russian headings "because it's modern CSS" | Nicer English wrap | Cyrillic wraps worse; breaks nbsp bindings | Never for Cyrillic content |
| Put `<head>` metadata into a partial | DRY | Massive BUILD:vars vocabulary; splicer complexity; SEO regression risk | Never in v4.0. Reconsider in v5.0 if `<head>` gains more shared content |
| Delete `.card--glass` before all HTML migrates | Clean vocabulary | Broken pages during partial migration | Never. Alias pattern is safer |
| Use `backdrop-filter` inside `backdrop-filter` (nested glass) | "Layer depth" | Nested stacking contexts, z-index surprises, doubled perf cost | Only if absolutely necessary; prefer flat glass with rim lighting for depth |
| Scroll-linked parallax because "apple.com does it" | Cosmetic polish | Vestibular triggers for ЦА 45+; PROJECT.md out-of-scope; accepted rejection | Never |

---

## Performance Traps

| Trap | How you notice | How to avoid | Scale threshold |
|---|---|---|---|
| Too many glass surfaces in viewport drop scroll FPS | Chrome DevTools Performance panel shows > 16ms per frame | Limit visible glass per viewport; reduce mobile blur radius | > 10 glass surfaces in viewport on budget Android |
| CSS file size from data-URI mask bloat slows first paint | `css/styles.css` > 80 kB minified | Cap squircle variants at 4; reject per-element masks | `css/styles.css` > 120 kB = block ship |
| `mask-image` re-raster on hover transform | Card hover looks jittery on Safari | Shadow-wrap pattern; `will-change: transform` on outer | Any visible jitter = fix |
| Refraction SVG filter on multiple elements | Chrome Performance panel reports "SVG filter cost" > 5ms | Limit refraction to hero CTA or pricing card (2 surfaces per page max) | > 5 elements with refraction |
| Mesh-bg blob blur + liquid glass composite | Hero FPS drops specifically when blobs + glass overlap | Reduce mesh-bg blob blur from 120px → 60px | Hero FPS < 30 |
| Shimmer animation on every surface | Noticeable scroll lag on Safari iOS 16+ | Shimmer only on hero CTA | > 1 shimmer per viewport |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---|---|---|
| Honeypot field stripped during form refactor | Directus fills with bot submissions, staff wastes time filtering, lost form submissions cost conversion revenue | Pitfall C7 enforcement: honeypot field on F.2 protection list, Phase 5–7 gate tests |
| ARIA live region removed, screen readers silent | WCAG 2.1 SC 4.1.3 failure; accessibility regression; potential legal exposure (EU accessibility directive applicable via Austria parent) | Pitfall C8 enforcement; Phase 8 VoiceOver test |
| Schema.org JSON-LD deleted from index.html | Rich results lost in Google Search; -5-15% organic CTR | Pitfall C5 enforcement; per-page head-content diff check |
| Canonical URL wrong / missing after page migration | Duplicate content penalty (especially if `www` vs non-www inconsistency) | Pitfall C5 enforcement; canonical audit at Phase 5-7 gate |
| Directus API endpoint or POST URL hardcoded visibility | Spam volume increase if endpoint exposed | Preserve existing v3.0 obfuscation; do not leak Directus URL in new JS code |
| Glass surface over form masking phishing-style deception | If a malicious script injects content, glass backdrop may hide attacker UI chrome | Not a v4.0-specific risk; same CSP as v3.0 applies |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---|---|---|
| Secondary glass CTA reads as decoration | ЦА 45+ misses it, reduced engagement, fewer page depths | Pitfall H9 mitigations: font-semibold, visible hover, press scale, icon + arrow |
| Shimmer everywhere | Vestibular triggers, reduced-motion bypassed, "flashing page" impression | Pitfall M7: shimmer hero CTA only |
| Dark-mode glass unreadable | Accessibility failure, toggle becomes unusable | Pitfall H5: tuned recipe + per-surface fallbacks |
| Scroll FPS < 20 on budget Android | Touch lag, scroll stutter, form scroll-to feels slow | Pitfall H8: measure, mitigate below threshold only |
| Keyboard focus invisible on squircled buttons | Keyboard-only users lose orientation, WCAG 2.4.7 failure | Pitfall C1: outline not box-shadow |
| Click-to-call sticky bar becomes "decoration chrome" | Phone CTA lost visibility, reduced calls | Sticky bar primary CTA stays gradient-filled, phone icon stays high-contrast |
| Form inputs on glass lack focus contrast | User unsure which field is focused, data-entry errors | `.liquid-input:focus` has explicit `box-shadow` ring matching focus-visible contrast |
| Russian long words overflow tablet glass cards | Ugly layout, horizontal scroll in some cases | Pitfall H6: `md:col-span-4` minimum for text cards |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Focus-visible ring:** Often missing outline contrast on glass surfaces — verify keyboard tab-through on all 6 pages, light AND dark mode
- [ ] **Honeypot spam field:** Often stripped during form refactor — `grep` for honeypot field name, test submission with field filled
- [ ] **ARIA live regions:** Often class-renamed losing `role="alert"` — `grep -c 'role="alert"\|aria-live'` before and after migration
- [ ] **nbsp bindings:** Often lost during bulk class replacement — `grep -c '&nbsp;'` count must not decrease
- [ ] **Schema.org JSON-LD:** Often deleted in head cleanup — byte-identical check on index.html `<script type="application/ld+json">`
- [ ] **`<br class="md:hidden">` in hero headings:** Often removed as "unneeded" — verify hero wrap behavior on mobile
- [ ] **Canonical URLs, meta descriptions, og tags:** Often lost in head refactor — per-page head content diff check
- [ ] **v3.2 whitespace-nowrap range binding:** Often normalized away — verify `<span class="whitespace-nowrap">за 1–2 дня</span>` in checkup.html hero
- [ ] **`overflow-x: clip` on `<html>`:** Often removed in base CSS refactor — `grep` check in theme.css
- [ ] **`:user-valid` left-border visual:** Often clipped by squircle mask silently — validate a field, verify green indicator appears
- [ ] **`hyphens: auto` + `lang="ru"`:** Verify still applied globally
- [ ] **Mobile menu z-index above header:** Visually test mobile menu open with scrolled page
- [ ] **Form success overlay above form fields:** Fill form, submit, verify overlay is visible (not behind fields)
- [ ] **Dark-mode glass not "murky navy smear":** Toggle dark mode on every page, visual review
- [ ] **Scroll FPS on budget Android ≥ 30:** Measure on real device, not just Chrome DevTools throttling
- [ ] **`.card--glass` fully migrated to `.liquid-card`:** `grep -rn 'card--glass'` returns zero
- [ ] **`.liquid-shimmer` only on hero CTAs:** `grep -c 'liquid-shimmer' *.html` ≤ 6 (one per page max)
- [ ] **Print stylesheet:** Print contacts.html from Chrome and Safari, verify readable
- [ ] **Reduced-motion downgrade:** DevTools emulate reduced-motion, verify blur drops to 8px and shimmer hides

---

## Protected Files List

Files and rules that must survive v4.0 intact. Restated here (additive to `ARCHITECTURE.md F.2`) because this list is load-bearing for every phase plan:

1. **`scripts/hooks/pre-commit`** — byte-identity gate. Untouchable.
2. **`scripts/build-pages.sh` lines 59–169** — BUILD:vars parsing. Only safe change: add `svg-defs` to `PARTIALS` at line 19.
3. **`theme.css` vertical rhythm tokens** — `--section-h-hero-*`, `--section-pt*`, `--section-pb` (v3.1 Phase 38 work).
4. **`theme.css` WCAG AA text tokens** — `--mu-blue-text`, `--mu-accent-*-text`, `--mu-green-text`, `--mu-cta-from`, `--mu-cta-to`, `--mu-text-700`, `--mu-text-500`, `--mu-text-900` (v3.0 work). **Contrast ratios may not be decreased.**
5. **`theme.css` line 274 `html { overflow-x: clip }`** — v3.1 Phase 38.1 mobile overflow safety net.
6. **`theme.css` `:user-valid` border-left rule (lines 324–331)** — v3.0 form validation feedback. **MUST migrate to inset box-shadow for mask compatibility** (Pitfall M4).
7. **`theme.css` `scroll-margin-top: 6rem` on section/h1/h2/h3 (RHYTHM-06)** — anchor scroll offset.
8. **`theme.css` `@media (prefers-reduced-motion: reduce)` block** — accessibility. v4.0 may **extend** (add blur downgrade) but not remove.
9. **Honeypot fields** on all forms — spam protection. Field names, visually-hidden CSS pattern.
10. **ARIA attributes** — `role="alert"`, `aria-live="polite"` on all form error containers.
11. **`<br class="md:hidden">`** in hero headings — Russian typography.
12. **All `&nbsp;` entities** in Russian content — subject+verb bindings, orphan prevention, numeric range bindings.
13. **`<span class="whitespace-nowrap">за 1–2 дня</span>`** in checkup.html hero — v3.2 COSMETIC-03.
14. **`<title>`, `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">`** on every page — unique per page, SEO load-bearing.
15. **Schema.org `MedicalBusiness` JSON-LD** in index.html `<head>` — rich results.
16. **Favicon link set** (4 `<link>` tags per page) — v3.2 COSMETIC-02.
17. **Directus submission URL and field naming** — backend contract; do not refactor without coordination.
18. **Browser console silent baseline** — v3.2 invariant. After every phase: open each of 6 pages, verify console has zero errors/warnings on first load.

---

## Scope Creep Guards

"While we're here" temptations during the v4.0 refactor. Explicit no-gos.

| Temptation | Why tempting | Why no | Alternative |
|---|---|---|---|
| Redesign copy for "more Apple tone" | Refactoring pages anyway | Copywriting is locked per v2.0 decision (rewrite from копирайтинг-документы first, then code) | Defer to v4.1 or later |
| Replace SF Pro with Inter variable font | "Better cross-platform rendering" | v2.0 removed Inter deliberately for Apple aesthetic; re-adding would fork the brand | Accept Windows/Android rendering |
| Add language toggle (ru/kz) | "Kazakhstan — why not add Kazakh?" | PROJECT.md out-of-scope: только русский в v1+ | Defer to v2+ Kazakh milestone |
| Replace Directus with something "modern" | Form refactor anyway | v1.0 Key Decision; Directus is canonical backend | Defer forever |
| Add chat bot / live chat | "iOS-like conversational UI fits Liquid" | PROJECT.md out-of-scope (medical responsibility) | Defer forever |
| Redesign icon set | "Icons look dated next to Liquid" | Duotone SVG icons are part of brand equity (v1.0) | Keep existing icons; apply Liquid styling around them |
| Add scroll-linked parallax "like apple.com" | Would look impressive | ЦА 45+ vestibular concern; PROJECT.md out-of-scope | Static hero with gradient mesh |
| Add View Transitions API for navigation | "Modern SPA-like transitions" | No SPA; static multi-page; adds complexity for zero measurable benefit | Native page navigation |
| Introduce CSS `@container queries` everywhere | New Tailwind v4 capability | Tailwind v4 subgrid already solves the layout cases we have | Use container queries only in fixed-position chrome (mobile menu, sticky bar) — narrow scope |
| Add dark-mode glass tinted variants (green, blue) | Apple's interactive tinting | Adds complexity, not in FEATURES.md scope | Defer to v4.1 |
| Refactor class names from `.card` to `.article-card`, etc. | "Better semantics" | HTML class-rename churn; byte-identity hook will fire; scope creep | Keep existing names; add `.liquid-*` additively |
| Extract `<head>` to partial | "DRY principle" | ARCHITECTURE.md E.2 explicitly rejected; massive BUILD:vars vocabulary cost | Keep per-page heads |
| Swap Tailwind for Lightning CSS / plain CSS | "Eliminate the build tool" | Tailwind v4.2.2 is pinned, works, known. Swapping is not a v4.0 goal | Stay on Tailwind v4 |
| Add Playwright regression tests | "We always deferred testing" | Valid improvement but not a v4.0 goal — testing infrastructure is its own milestone | Defer to v4.1 Testing Infra |
| Add analytics / telemetry for perf monitoring | "Need data for post-ship perf decisions" | Privacy implications; not scoped; not zero-Node friendly | Manual measurement in Phase 8; defer telemetry to v5.0 |

**Rule of thumb:** if the change is not explicitly in the v4.0 milestone requirements (Grid + Squircles + Liquid Glass + Design system docs), it does not land in v4.0. Log the idea as a candidate for v4.1+ in PROJECT.md Active requirements.

---

## Phase-Specific Warnings

Specific pitfalls mapped to each phase of the 9-phase migration.

| Phase | Most likely to bite | Mitigation owner |
|---|---|---|
| **1 Foundation tokens** | C1 (focus-visible), C3 (overflow-x clip), C6 (dark selector), C9 (vertical rhythm), H4 (WCAG on glass token defaults) | Phase plan declares audit of `.dark` vs `[data-theme="dark"]` and commits to one. Refactor focus-visible to outline. Do not touch vertical rhythm or overflow-x clip rules. |
| **2 Squircle primitives** | H7 (data-URI bloat), M5 (tiny radii pointless), H1 (mask + hover), M4 (`:user-valid` border clipping) | Cap at 4 mask data-URIs; document shadow-wrap idiom; switch `:user-valid` to inset box-shadow. |
| **3 Liquid Glass primitives** | H3 (stacking contexts), H4 (WCAG), H5 (dark recipe), M3 (print), M7 (shimmer scope), H9 (secondary CTA affordance) | Document stacking context map; tune dark recipe on test fixtures; add `@media print`; constrain `.liquid-shimmer` to hero-only class. |
| **4 SVG defs partial + chrome partials** | C2 (byte-identity hook), C9 (vertical rhythm lost to grid) | Full commit anatomy enumerated in plan; `make check` before commit; verify hero min-height preserved after grid wrap. |
| **5 Simple pages (404, contacts)** | C4 (nbsp), C5 (head metadata), C7 (honeypot), C8 (ARIA), H3 (form success z-index), H10 (text-wrap: balance), M4 (:user-valid) | Baseline capture before migration; gate grep for nbsp/ARIA/meta; validate form submission path; canary for stacking context issues. |
| **6 Service pages (checkup, online, treatment-abroad)** | C4 (nbsp), C5 (head), C7 (honeypot), C8 (ARIA), H6 (Russian compounds), M6 (hero SVG bleed), M8 (card--glass collision), H10 (text-wrap) | Same gates as Phase 5, per page. Russian long-word audit. Hero illustration check. |
| **7 Index page** | C4 (nbsp), C5 (head), C7 (honeypot), C8 (ARIA), H3 (z-index full audit), H6 (Russian), H2 (rotate+squircle), M2 (mesh-bg composite), M8 (card--glass), H10 (text-wrap) | Per-card audit; rotate-vs-squircle decision per chip; full z-index map; mesh-bg blob blur decision. |
| **8 A11y + perf verification** | H4 (manual contrast audit), H5 (dark-mode visual), H8 (scroll FPS), H9 (secondary CTA UX smoke) | Manual contrast check; dark-mode visual review; budget Android FPS measurement; informal ЦА 45+ smoke test if possible. |
| **9 Docs** | None functional — but documentation gaps propagate to v4.1+ | DESIGN-SYSTEM.md must document: shadow-wrap idiom, focus-visible outline pattern, anti-pattern list, Russian typography rules, protected file list, scope creep guard. |

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---|---|---|
| C1 Focus-visible lost on squircles | LOW | Edit `theme.css @layer base :focus-visible` block: `outline + outline-offset`, `box-shadow: none`. Test keyboard tab. Single-file fix. |
| C2 Byte-identity hook blocks commit | LOW | Run `make build`, re-stage all `.html` files, retry commit. If stuck, check `git status` for missing BUILD markers. |
| C3 Mobile overflow returns after refactor | LOW | Re-add `html { overflow-x: clip }` to `theme.css @layer base`. Grep to verify. |
| C4 nbsp bindings lost on a page | MEDIUM | Git diff vs previous commit, copy nbsp entities back from old version. Re-run orphan prevention visual check. |
| C5 SEO metadata lost | LOW | Git diff vs previous commit, restore head content. Verify with automated SEO checker. |
| C6 Dark-mode glass fails (wrong selector) | LOW | Change selector in `theme.css` from `[data-theme="dark"]` to `.dark` (or vice versa, matching the actual JS toggle). Re-test. |
| C7 Honeypot lost | LOW (if caught in Phase gate), HIGH (if caught post-ship after bot volume spike) | Restore hidden field; verify JS validation still checks it; clean up Directus bot submissions. |
| C8 ARIA live region lost | LOW (if caught in Phase gate), MEDIUM (if caught post-ship) | Restore `role="alert"` and `aria-live` attributes. Screen-reader test. |
| C9 Hero vertical rhythm collapsed by grid | LOW | Remove `grid-template-rows` declaration on `.liquid-grid` (if added). Hero min-height should work in implicit rows. |
| H1 Card hover jitter on Safari | MEDIUM | Apply shadow-wrap pattern universally on cards. May require HTML restructure for ~4 card types. |
| H3 Stacking context broken (form success overlay) | MEDIUM | Hoist overlay out of form container via JS portal, or remove `backdrop-filter` from form container. |
| H4 WCAG contrast failures on glass | MEDIUM | Tune specific surface's background opacity from 0.5 to 0.85 (less glass, more contrast). Per-surface override. |
| H5 Dark-mode glass "murky smear" | MEDIUM-HIGH | Tune `--liquid-bg` to higher opacity and `--liquid-brightness` higher. If still fails, per-surface `backdrop-filter: none` fallback. Worst case: revert dark-mode glass to v1.4 "glass-off" behavior for v4.0 ship and defer to v4.1. |
| H6 Russian long-word overflow on tablet | LOW | Change card class from `md:col-span-2` to `md:col-span-4` per card row. |
| H7 CSS file bloat | LOW | Trim squircle mask variants, remove per-element masks. |
| H8 Scroll FPS < 30 on budget Android | MEDIUM-HIGH | Reduce blur radius on mobile via `@media`. Disable backdrop-filter on non-critical surfaces (icon chips, badges). As last resort: restore v1.4 "max 2 glass per viewport" constraint for mobile only. |
| H9 Secondary CTA invisible to ЦА 45+ | MEDIUM | Strengthen border, bump font-weight, add icon. Worst case: downgrade to flat bordered style. |
| H10 text-wrap: balance reintroduced | LOW | Grep, remove, audit headings for nbsp binding integrity. |
| M1–M8 | LOW to MEDIUM | Per-pitfall mitigations documented in each section. |

---

## Pitfall-to-Phase Mapping (summary table)

| Pitfall | Severity | Prevention Phase | Verification Gate |
|---|---|---|---|
| C1 Focus ring clipped by mask | BLOCKER | 1 | Keyboard tab-through on all 6 pages before Phase 2 starts |
| C2 Byte-identity hook blocks partial change | BLOCKER | 4 | `make check` passes; grep BUILD markers on 6 pages |
| C3 `overflow-x: clip` removed | BLOCKER | 1, 7 | grep for rule in theme.css; 320px viewport test on index.html |
| C4 nbsp bindings destroyed | BLOCKER | 5, 6, 7 | `grep -c '&nbsp;'` per page not decreasing |
| C5 SEO metadata deleted | BLOCKER | 5, 6, 7 | Head content diff per page shows only additions |
| C6 `.dark` vs `[data-theme="dark"]` drift | BLOCKER | 1 | Audit actual JS toggle; commit to one selector |
| C7 Honeypot stripped | BLOCKER | 5, 6, 7 | grep honeypot field; manual bot submission test |
| C8 ARIA live region stripped | BLOCKER | 5, 6, 7 | grep `role="alert"`/`aria-live` count preserved |
| C9 Hero vertical rhythm collapsed by grid | BLOCKER | 4, 5–7 | Measure hero min-height per page post-migration |
| H1 Hover translateY + mask jitter | HIGH | 3, 6 | Safari hover smoke test |
| H2 Scale/rotate on squircle icons | HIGH | 7 | Per-chip decision logged |
| H3 Stacking context cascade breaks | HIGH | 3, 5, 7 | Form success overlay test; stacking map document |
| H4 WCAG contrast on glass | HIGH | 3, 8 | Manual contrast check on worst-case surfaces |
| H5 Dark-mode glass "murky smear" | HIGH | 3, 8 | Tuning subtask; full 6-page dark-mode visual review |
| H6 Russian long-word overflow | HIGH | 6, 7 | Tablet viewport screenshot per card row |
| H7 Data-URI mask bloat | HIGH | 2, 8 | `squircles.css` data-URI count ≤ 4; `css/styles.css` size check |
| H8 Budget Android scroll FPS | HIGH | 8 | Real-device measurement; threshold ≥ 30 FPS |
| H9 Secondary CTA affordance lost | HIGH | 3, 8 | Design review + informal ЦА 45+ smoke test |
| H10 `text-wrap: balance` reintroduced | HIGH | 5, 6, 7 | grep `text-wrap: balance` returns zero |
| M1 Squircle on circle flags/avatars | MEDIUM | 2, 9 | `.squircle-full` documented = `rounded-full` equivalent |
| M2 Mesh-bg + glass composite muddy | MEDIUM | 7 | Cross-browser hero visual review |
| M3 Print stylesheet missing | MEDIUM | 3 or 9 | `@media print` block in theme.css; print contacts.html test |
| M4 `:user-valid` border clipped | MEDIUM | 3, 5 | Inset box-shadow migration; green indicator visible test |
| M5 Small squircle wasted complexity | MEDIUM | 2 | 4-variant cap instead of 5 |
| M6 Hero SVG bleed past squircle | MEDIUM | 7 | Per-illustration visual check |
| M7 Shimmer scope creep | MEDIUM | 3, 7 | grep shimmer class usage ≤ 6 |
| M8 `.card--glass` + `.liquid-card` collision | MEDIUM | 5, 6, 7 | Alias pattern or full grep audit |
| L1 Refraction Chromium-only | LOW | 3, 9 | Documented limitation |
| L2 `corner-shape` Chrome-only | LOW | 2, 9 | Documented limitation |
| L3 SF Pro non-Apple rendering | LOW | 8 | Spot check on Windows/Android |
| L4 Liquid Glass trend lifespan | LOW | Post-ship | Accept; component layer is replaceable |
| L5 Brand disconnect with Austria parent | LOW | Post-ship | Out of scope |

---

## Sources

**Pitfalls derived from:**
- `.planning/research/STACK.md` — mask-image clipping trade-offs (A), backdrop-filter browser support (B), shadow-wrap pattern requirement, focus-visible outline migration, perf cost table (B), Alternatives table; key findings: `figma-squircle` rejected, `mask-image` default, `corner-shape` progressive enhancement, refraction Chromium-only
- `.planning/research/FEATURES.md` — anti-features (A.7, H.1, H.2), medical landing filter (H), Russian typography F.4, dark-mode recipe G, cognitive load audit H.4, shimmer scope H.4, Infinum accessibility findings G.4, material taxonomy B.1 (Clear rejected)
- `.planning/research/ARCHITECTURE.md` — 9-phase migration order G.1, Hard Protection List F.2, class cascade order C.5, shadow-wrap idiom C.3, `.dark` vs `[data-theme="dark"]` inconsistency A.4, byte-identity hook implications E.6, svg-defs partial additions E.1
- `.planning/PROJECT.md` — v1.0–v3.2 Key Decisions, Out of Scope list, ЦА 45+ constraints, v1.4 GPU budget relaxation rationale, v4.0 milestone scope
- `CLAUDE.md` — stack constraints, language, design principles, no-go list
- `src/styles/theme.css` — actual `.dark` cascade, vertical rhythm tokens, WCAG AA tokens, focus-visible box-shadow implementation, overflow-x clip rule, :user-valid border, @media reduced-motion
- `index.html` — real mesh-bg blob structure (lines 145–149), 4 floating hero info cards with multiple unique radii, service card icon chip rotate+scale hover, form success overlay z-20, multiple `rounded-[2rem]`/`rounded-[2.5rem]`/`rounded-[3rem]` instances
- `checkup.html` — `<span class="whitespace-nowrap">за 1–2 дня</span>` binding, heavy nbsp bindings, brand gradient spans
- `contacts.html` — form structure with `.form__field-error`, `.is-invalid`, honeypot comment, ARIA form patterns
- User auto-memory (`feedback_nbsp-subject-verb.md`, `feedback_nbsp-orphan-prevention.md`, `feedback_design-taste.md`) — Russian typography rules, design taste principles

**Key inherited sources from prior research:**
- Apple Developer: Liquid Glass documentation
- MDN: `backdrop-filter`, `mask-image`, `corner-shape`, `:focus-visible`, `text-wrap: balance`
- CSS-Tricks, LogRocket, Smashing Magazine 2026 — technique analyses
- Infinum — iOS 26 Liquid Glass accessibility critique
- WebKit Bug 245510 — Safari backdrop-filter SVG filter limitation

---

*Pitfalls research for: MedicusUnion KZ v4.0 Liquid Design System*
*Researched: 2026-04-09*
*Downstream consumers: SUMMARY.md (risk matrix), gsd-roadmapper (phase requirements), gsd-plan-phase (task breakdown watch-outs), gsd-executor (concrete mitigations), code review agents (audit checklist)*
