# Requirements: MedicusUnion KZ — Milestone v3.2

**Defined:** 2026-04-08
**Milestone:** v3.2 Build Pipeline & Chrome Partials
**Core Value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.

**Goal:** Eliminate chrome drift at the source by extracting shared HTML partials and wiring a byte-identity build pipeline, then knock out 3 residual cosmetic fixes from v3.1 UX validation.

## v3.2 Requirements

### Build Infrastructure

7 of these 8 are carried over from v3.1 Phase 36, where they were explicitly deferred to "Phase 36b in v3.2." The original IDs are preserved for cross-milestone traceability.

- [ ] **LAYOUT-01** _(deferred from v3.1)_: `partials/` directory exists at repo root containing `header.html`, `footer.html`, `sticky-bar.html`, `mobile-menu.html` as the single source of truth for shared chrome
- [ ] **LAYOUT-02** _(deferred from v3.1)_: `scripts/build-pages.sh` is a shell-based marker splicer that reads `<!-- BUILD:partial-name -->` … `<!-- /BUILD:partial-name -->` blocks in HTML pages and replaces their contents with the current partial file
- [ ] **LAYOUT-03** _(deferred from v3.1)_: `build.sh` at the repo root is the top-level orchestrator (runs `tailwindcss` build, then `scripts/build-pages.sh`)
- [ ] **LAYOUT-04** _(deferred from v3.1, refined)_: `Makefile` with a `make build` target is the canonical entry point. Make is the source of truth; `./build.sh` is a thin delegator to `make build`
- [ ] **LAYOUT-05** _(deferred from v3.1)_: BUILD markers are present in all 6 HTML pages (`index`, `online-consultations`, `treatment-abroad`, `checkup`, `contacts`, `404`) at every shared-chrome insertion point
- [ ] **LAYOUT-11** _(deferred from v3.1)_: 7th-page 0-edit invariant is verified — adding a new page requires only authoring page-specific body content plus BUILD markers, with zero duplicated chrome
- [ ] **LAYOUT-12** _(deferred from v3.1)_: Byte-identity smoke test — running `./build.sh` (or `make build`) on a clean checkout produces HTML byte-for-byte identical to the current committed 6 pages (zero drift)
- [ ] **LAYOUT-13** _(new v3.2)_: Pre-commit hook (`scripts/hooks/pre-commit`) calls `make build` before every commit. Contributors install it once per clone via a documented one-liner (e.g. `ln -s ../../scripts/hooks/pre-commit .git/hooks/pre-commit`). README documents the install step

### Cosmetic Cleanup

Residual items from v3.1 Phase 38.1 Playwright UX validation that were not blockers for v3.1 sign-off but are low-cost to close.

- [ ] **COSMETIC-01**: 404.html H1 fits within viewport at 320px width (currently ~25px over — safety net clips it, but underlying sizing should be corrected)
- [ ] **COSMETIC-02**: `/favicon.ico` returns HTTP 200 on every deployed path (silences the browser console 404 that currently fires on first load)
- [ ] **COSMETIC-03**: checkup.html H1 "за 1–2 дня" does not break mid-phrase between "за 1–" and "2 дня" — either bind the numeric range with nbsp, use a non-breaking hyphen variant, or restructure the markup so the break lands elsewhere

## Future Requirements (deferred to v3.3+)

Nothing currently deferred. v3.2 closes v3.1's known-open items cleanly.

## Out of Scope

| Exclusion | Reason |
|-----------|--------|
| Node.js-based templating engines (Handlebars, Mustache, Nunjucks, EJS) | Would require Node runtime; repo is deliberately zero-Node at runtime. `tailwindcss` standalone binary is the only tooling dependency. Shell-based marker splicing is sufficient for 4 chrome partials |
| Replacing the committed `tailwindcss` binary | Out of scope; binary stays committed and runs locally only during dev |
| CI step for build enforcement | Pre-commit hook covers the drift-prevention goal. CI enforcement can be added in v3.3+ if collaboration scales beyond solo dev |
| Auto-install pre-commit hook via `npm postinstall` or equivalent | No `package.json`, no `npm` in repo. Manual one-time install is acceptable for current contributor count |
| Extraction of non-chrome partials (CTAs, mesh-bg decorations, hero shells) | Scope creep. v3.2 is header/footer/sticky-bar/mobile-menu only; other duplication can be addressed when it starts causing actual drift incidents |
| Renaming or restructuring existing file paths | Out of scope. Build pipeline must be a pure additive layer that does not move or rename existing assets |
| Extending build pipeline to handle JS bundling, CSS minification beyond tailwind, or image optimization | Out of scope. v3.2's build = tailwind + marker splice. Nothing else |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 39 | Pending |
| LAYOUT-02 | Phase 39 | Pending |
| LAYOUT-03 | Phase 39 | Pending |
| LAYOUT-04 | Phase 39 | Pending |
| LAYOUT-05 | Phase 39 | Pending |
| LAYOUT-11 | Phase 39 | Pending |
| LAYOUT-12 | Phase 39 | Pending |
| LAYOUT-13 | Phase 39 | Pending |
| COSMETIC-01 | Phase 40 | Pending |
| COSMETIC-02 | Phase 40 | Pending |
| COSMETIC-03 | Phase 40 | Pending |

**Coverage:**
- v3.2 requirements: 11 total
- Mapped to phases: 11 (Phase 39: 8 LAYOUT reqs; Phase 40: 3 COSMETIC reqs)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 — traceability filled by roadmapper (v3.2 Phases 39, 40)*
