---
gsd_state_version: 1.0
milestone: v3.2
milestone_name: Build Pipeline & Chrome Partials
status: planning
stopped_at: v3.2 milestone kickoff — defining requirements and roadmap
last_updated: "2026-04-08T06:15:00.000Z"
last_activity: 2026-04-08 — v3.2 milestone started, requirements being defined
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-08 at v3.2 milestone kickoff)

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.
**Current focus:** v3.2 Build Pipeline & Chrome Partials — extract shared HTML partials, wire byte-identity build pipeline (Makefile + pre-commit hook), knock out 3 residual cosmetic fixes from v3.1 UX validation.

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-08 — Milestone v3.2 started

Progress: [░░░░░░░░░░] 0% (v3.2, not yet scoped)

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: --
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

## Accumulated Context

| Phase 29-01 P01 | 2min | 1 tasks | 1 files |
| Phase 29 P02 | 3min | 2 tasks | 4 files |
| Phase 30 P01 | 2min | 2 tasks | 5 files |
| Phase 31 P01 | 5min | 2 tasks | 14 files |
| Phase 31 P02 | 2min | 2 tasks | 7 files |
| Phase 32 P01 | 1min | 2 tasks | 2 files |
| Phase 32 P02 | 6min | 2 tasks | 7 files |
| Phase 33 P33-01 | 45 | 7 tasks | 6 files |
| Phase 38 P1 | 525378 | 9 tasks | 10 files |

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Phase 28]: Removed all old design patterns from checkup.html (glass, orbs, dividers, dark mode) to match new clean medtech design
- [Phase 28]: Checkup page copywriting: verbatim text from copywriting doc, card titles expanded to full form
- [Phase 29]: Nav anchor links prefixed with index.html on 404 page; noindex/nofollow meta added to prevent indexing
- [Phase 29]: Normalized FAQ CSS to single .faq__item.is-open .faq__answer selector across all pages
- [Phase 29]: Fixed footer service links to use direct page file references instead of index.html#services anchors
- [Phase 30]: Removed iso6523Code from JSON-LD (incorrect semantic usage); used shared og-cover.jpg for all pages pending Phase 31 image pipeline
- [Phase 31]: Used cwebp (brew webp) instead of sips for WebP conversion -- sips on macOS does not support WebP output
- [Phase 31]: All images stored as local WebP in img/ with lazy loading on below-fold images and explicit dimensions for CLS prevention
- [Phase 31]: Applied preload/defer optimizations to all 6 HTML pages including 404.html; checkup.html had Motion CDN contrary to plan
- [Phase 32]: Used box-shadow for focus-visible ring (global CSS, zero HTML changes across all pages)
- [Phase 32]: Accessible text tokens use -text suffix (mu-blue-text vs mu-blue) to separate WCAG-safe text colors from bright icon/bg colors
- [Phase 32]: Icon containers and SVGs keep bright original colors; only text elements get *-text accessible variants for WCAG AA compliance
- [v3.1 roadmap]: Phase order locked numerically (33→34→35→36→37→38); Phase 35's CHKPOL-01 typography-only constraint resolves the cross-phase conflict with Phase 38 min-h ownership (CRIT-03)
- [v3.1 roadmap]: Phase 36 partials approach is build-time shell splice (NOT runtime fetch) — preserves existing js/router.js swap contract, deploy-target-agnostic, works with `file://` preview. Chosen over nginx SSI for preview compatibility.
- [Phase 33]: 404.html Vienna address fixed as Rule 2 deviation — was not in plan scope but had stale Bruno-Marek-Allee footer
- [Phase 33]: Gate 1/2 intent achieved despite count discrepancy: Wiener Privatklinik hospital name and HTML entity &laquo; make exact counts unachievable but all stale company refs are gone
- [Phase 38]: Tailwind v4 requires --min-height-* (not --height-*) to generate min-h-* utilities — confirmed via smoke test
- [Phase 38]: Body min-h-screen removal (simpler approach) chosen over page-shell flex wrapper — viewport verification to confirm

### Roadmap Evolution

- Phase 32 added: Design system compliance: accessible tokens, focus-visible, CTA gradient fix across all pages
- v3.1 expanded from 5 → 6 phases (Phase 38 added) after user flagged hero/section sizing as out-of-place across all 5 pages — research-first approach with svh tokens
- Phase 38.1 inserted after Phase 38: Mobile viewport overflow + checkup H1 fix (URGENT) — Playwright UX validation on 2026-04-08 uncovered 3 P0 regressions (5 of 6 pages horizontal-scroll at 375, checkup H1 gradient-span overflow at lg/mobile, 4 invalid SVG `rx` attributes). Blocks RHYTHM-10 closure and therefore v3.1 sign-off.

### Blockers/Concerns

- Real content needed from client: doctor credentials, hospital logos, statistics, legal entity details
- Kazakhstan Personal Data Law (No. 94-V) may affect form field -- legal review before go-live
- [Phase 36a]: contacts.html + checkup.html selected as canonical BEM reference (footer__*/header__* classes); index.html normalized up to match
- [Phase 36a]: index.html CTA href changed contacts.html → #contact (page's own form anchor); sticky-bar CTA same fix
- [Phase 36a]: Footer navigation column normalized to 2 links (Главная + Контакты) to enable Phase 36b single-source extraction
- [Phase 36a]: LAYOUT-07 verified no-op — router.js already calls updateActiveNav() on SPA nav; static baked aria-current covers first-load
- [Phase 36a]: Mobile menu toggleMenu() re-queries .header__menu-btn on each call for full router-swap robustness
- Phase 36 prerequisite spike: local `./build.sh` byte-identity verification — run build, `diff` against checked-in pages, confirm zero drift (Open Verification Item #2, rewritten 2026-04-07 after nginx pivot)
- Phase 38 prerequisite spike: Tailwind v4 token-to-utility smoke test (Open Verification Item #3)

## Session Continuity

Last session: 2026-04-08
Stopped at: v3.2 kickoff in progress — PROJECT.md updated, STATE.md reset, REQUIREMENTS.md + ROADMAP.md next
Next command: Defining requirements → spawning roadmapper for v3.2 phase structure
