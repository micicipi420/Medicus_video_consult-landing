# Research Synthesis — v3.1 Site Foundation & Audit Fixes

> [!NOTE]
> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.

**Project:** MedicusUnion KZ
**Mode:** Subsequent milestone — ecosystem research
**Synthesized:** 2026-04-07
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Confidence:** HIGH for architectural decisions; MEDIUM for specific numeric values (clamp floor/ceiling, benchmark vh values)

---

## Executive Summary

MedicusUnion KZ v3.1 builds on a structurally sound v3.0 codebase with two goals: ship 14 audit fixes and establish shared layout primitives + a researched vertical-rhythm system. Research uncovered **six inherited assumptions that must be corrected** before any phase work begins.

**The most critical finding:** a 465-line SPA client router (`js/router.js`) already ships in production and already swaps `#page-content`, `#footer`, and `#sticky-bar` on every navigation. Phase 36 is therefore a **source-level deduplication task**, not a runtime injection task. A second injection layer would fight the router.

**The most important architectural correction:** STACK.md's nginx SSI recommendation is **invalid** for this deploy target. Verified in `.netlify/netlify.toml` — deploy target is Netlify, which does not support SSI. The correct approach is **build-time shell-script splice** wired into `[build] command = "./build.sh"` in `netlify.toml`. ARCHITECTURE.md and PITFALLS.md both converge on this.

---

## Critical Corrections to PROJECT.md (6 facts)

| # | Fact | Phase Impact |
|---|------|--------------|
| 1 | `js/router.js` (465 lines) exists — swaps `#page-content`, `#footer`, `#sticky-bar` | Phase 36 = source-level dedup, NOT runtime injection |
| 2 | "v1.4 dark mode shipped" is stale — no toggle script, `.dark` overrides in `theme.css:91-126` are dead code | v3.1 must not touch dark mode |
| 3 | No build pipeline exists — no Makefile, no `package.json`, 76 MB `tailwindcss` binary checked into git | Phase 36 introduces the FIRST build script |
| 4 | Hero classes drift catastrophically: `min-h-screen` / `min-h-[80vh]` / none — four strategies on five pages | Exactly the Phase 38 problem statement |
| 5 | Hero must use `svh`, NOT `vh` (clips iOS Safari URL bar), NOT `dvh` (mid-scroll layout jump hostile to 45+) | Hard constraint on all Phase 38 token values |
| 6 | Recommended execution order is non-numerical: 33 → 34 → 36 → 37 → 38 → 35 | Phase 35 checkup H1 fix = typography-only (no `min-h`), OR ship after Phase 38 |

---

## Key Recommendations

| Capability | Choice | Why | Source |
|------------|--------|-----|--------|
| Partials | Build-time shell splice (`scripts/build-pages.sh` + `build.sh` + `[build] command` in `netlify.toml`) | Router exists; Netlify deploy; nginx SSI not supported | ARCH + PITFALLS override STACK |
| Vertical rhythm | `svh` tokens in `theme.css :root` + `@theme inline`, three content-density tiers | iOS URL bar; vestibular-safe; 45+ audience dvh ban | ARCH + FEATURES + PITFALLS converge |
| Form valid-state | `:user-valid` CSS pseudo + extend existing IIFE pattern in `js/main.js` | Native, no flicker, Russian error messages preserved | STACK + FEATURES converge |
| Sitemap | Hand-written allowlist (5 pages, NOT 404, no `<changefreq>` or `<priority>`) | 6 URLs below tooling threshold; Google ignores both fields | STACK + FEATURES + PITFALLS converge |
| Flag icons | `circle-flags` vendored (7 SVGs: de/at/ch/fr/it/es/il to `img/flags/`) | MIT, ~14KB total inlined, matches rounded aesthetic | STACK + FEATURES converge |
| REJECTED: nginx SSI | Build-time splice instead | Netlify does not support SSI; also breaks `file://` preview | ARCH + PITFALLS |
| REJECTED: Runtime fetch+inject | Build-time splice instead | Fights existing router.js swap contract; FOUC; Yandex SEO risk | ARCH + PITFALLS |
| REJECTED: Constraint Validation API rewrite | Extend existing rules-object pattern | Would risk OS-localized error messages instead of Russian | STACK + FEATURES converge |

---

## Vertical Rhythm Token Values (Phase 38 input — MEDIUM confidence, verify empirically)

```css
:root {
  --section-h-hero-rich:    clamp(560px, 75svh, 760px);   /* index, online-consultations */
  --section-h-hero-medium:  clamp(500px, 65svh, 700px);   /* treatment-abroad, checkup */
  --section-h-hero-compact: clamp(440px, 55svh, 580px);   /* contacts, 404 */
  --section-pt:    8rem;    /* current pt-32 */
  --section-pt-lg: 10rem;   /* current lg:pt-40 */
  --section-pb:    4rem;    /* current pb-16 */
}

@theme inline {
  --height-section-hero-rich:    var(--section-h-hero-rich);
  --height-section-hero-medium:  var(--section-h-hero-medium);
  --height-section-hero-compact: var(--section-h-hero-compact);
  --spacing-section-pt:          var(--section-pt);
  --spacing-section-pt-lg:       var(--section-pt-lg);
  --spacing-section-pb:          var(--section-pb);
}
```

Follows the existing `--mu-*` → `@theme inline` two-layer pattern. Smoke-test required: does `--height-section-hero-rich` generate `min-h-section-hero-rich`? 30-minute spike before Phase 38 bulk migration.

**Body structure change (CRIT-08):** Replace `<body class="min-h-screen">` with page-shell flex pattern:
```html
<body>
  <div class="page-shell flex flex-col min-h-[100dvh]">
    <header>...</header>
    <main class="flex-1">...</main>
    <footer>...</footer>
  </div>
</body>
```

---

## Recommended Phase Execution Sequence

```
1. Phase 33 — Audit Quick Wins          (no deps, fast, unblocks 36 hard gate)
2. Phase 34 — Treatment Abroad          (soft dep on 33 for Vienna address correctness)
3. Phase 36 — Shared Layout Primitives  (HARD dep: 33 must merge first; HIGHEST RISK)
4. Phase 37 — Site Metadata & Hygiene   (dep on 36 for stable canonical partial)
5. Phase 38 — Vertical Rhythm & Sizing  (dep on 36; owns ALL min-h tokens)
6. Phase 35 — Checkup + Form UX         (dep on 38 so H1 fix uses tokens)
```

**Note:** This is NOT numerical order. Rationale:
- Phase 36 must ship after Phase 33 so data unification is canonical before footer extraction
- Phase 38 must ship before Phase 35 so checkup H1 fix uses tokens (not throwaway `min-h`)
- If strict numerical order (33→34→35→36→37→38) is mandated, Phase 35's checkup H1 fix becomes typography-only (responsive `<br>`, gradient phrase swap) — DO NOT touch `min-h`

**Phase 36 sub-commit strategy** (HIGHEST RISK):
1. Introduce `partials/` + `scripts/build-pages.sh` + `build.sh`, verify output byte-identical, smoke-test router
2. Remove inlined chrome from source files (markers replace it)
3. Add `[build] command = "./build.sh"` to `netlify.toml`
4. Smoke-test deploy before merging

---

## Critical Pitfalls (top 5)

- **CRIT-01** — Don't add a second injection layer fighting `router.js`. Build-time splice only.
- **CRIT-02** — Phase 33 data unification MUST merge before Phase 36 extraction. Gate: `git grep 'ТОО «'` shows 1 unique match.
- **CRIT-06** — Yandex doesn't reliably read JS-injected JSON-LD. Keep `MedicalBusiness` schema in static inline HTML, never in partials.
- **CRIT-07** — Hero must use `svh`, not `vh` (clips iOS URL bar), not `dvh` (mid-scroll layout jump hostile to vestibular-sensitive 45+).
- **CRIT-08** — `<body>` must not have `min-h-screen`. Replace with page-shell flex pattern.

**Full pitfall inventory:** 10 CRIT + 24 MOD + 10 MIN in `.planning/research/PITFALLS.md`.

---

## Cross-Phase Ordering Constraints (HARD chain)

```
Phase 33 (data unification)
   │  must merge before
   ▼
Phase 36 (partial extraction)
   │  must merge before
   ▼
Phase 37 (sitemap + canonical audit)

Phase 35 (form UX + checkup H1)  ──── must NOT touch hero min-h ──┐
                                                                  │
Phase 38 (vertical rhythm — last, owns ALL min-h tokens) ◄────────┘

Phase 34 (Treatment Abroad)
   │  internal ordering: stat bar BEFORE hero photo (MOD-23)
```

---

## Pre-Phase-Start Grep Gates

**Before Phase 36:**
```bash
# Footers must be byte-identical for extracted regions
diff <(sed -n '/<footer/,/<\/footer>/p' index.html) <(sed -n '/<footer/,/<\/footer>/p' contacts.html)

# Data canonical
grep -h 'Wien\|Vienna' *.html | sort -u | wc -l  # Should be 1
grep -h 'ТОО «' *.html | sort -u | wc -l         # Should be 1
```

**Before Phase 37:**
```bash
grep -h 'rel="canonical"' *.html | grep -o 'href="[^"]*"' | sort -u  # 6 URLs, same scheme
ls partials/footer.html partials/header.html partials/sticky-bar.html
```

**Before Phase 38:**
```bash
# No new ad-hoc min-h values added
git diff main..HEAD -- '*.html' | grep -E 'min-h-\[' | grep -v 'min-h-screen'
```

---

## Open Verification Items

Must be resolved before the relevant phase freezes scope:

1. **Yandex JSON-LD JS-execution behavior 2026** — pivot for CRIT-06. 30-min spike in Yandex Webmaster before Phase 36.
2. **Netlify build with checked-in 76 MB tailwindcss binary** — smoke-test deploy before Phase 36 merges. 1-hour spike.
3. **Tailwind v4 token-to-utility smoke test** — does `--height-section-hero-rich` generate `min-h-section-hero-rich`? 30-min spike before Phase 38 bulk migration.
4. **`circle-flags` exact current version and package size** — `npm view circle-flags version` before Phase 37 vendoring.
5. **`svh` coverage on KZ Android Chrome 108+** — caniuse check before Phase 38 ships.

---

## Research Flags

**Needs `/gsd-research-phase` at plan-phase time:** Phase 38 — clamp values are derived, not benchmarked. Plan should include empirical verification on 6 viewports (320/390/768/1024/1440/1920) and a manual competitor screenshot pass on 2–3 medical landing sites before bulk migration.

**Standard patterns (skip research-phase):** Phases 33, 34, 35, 36, 37 — all architecturally specified, well-documented patterns, no additional research needed.

---

## Ready for Requirements

REQUIREMENTS.md should reference these recommendations by name — no re-derivation needed. The 6-phase numerical structure is locked, and each phase has:
- Clear architectural approach (built-time splice, svh tokens, :user-valid, hand-written sitemap, vendored flags)
- Concrete acceptance criteria (grep gates, byte-identity checks)
- Cross-phase ordering constraints (HARD chain above)
- Open verification items (flagged for plan-phase spikes)
