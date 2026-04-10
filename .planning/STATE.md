---
gsd_state_version: 1.0
milestone: v6.0
milestone_name: Next.js Stack Migration
status: Defining requirements
stopped_at: Milestone v6.0 started
last_updated: "2026-04-10T21:00:00.000Z"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-10)

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.
**Current focus:** v6.0 Next.js Stack Migration — defining requirements

## Current Position

Phase: Not started (defining requirements)
Plan: —

## Performance Metrics

**Velocity:**

- Total plans completed: 9
- Average duration: --
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 17 | 0/TBD | - | - |
| 18 | 0/TBD | - | - |
| Phase 17 P01 | 2min | 2 tasks | 1 files |
| Phase 18 P01 | 8 | 3 tasks | 1 files |
| Phase 19-v1-3-cleanup P01 | 2 | 3 tasks | 2 files |
| Phase 20 P01 | 2 | 2 tasks | 2 files |
| Phase 20 P02 | 10 | 2 tasks | 2 files |
| Phase 21 P01 | 15 | 2 tasks | 1 files |
| Phase 22 P01 | 2 | 3 tasks | 2 files |
| Phase 51 P02 | 227 | 1 tasks | 2 files |
| 52 | 2 | - | - |
| 53 | 1 | - | - |
| 54 | 1 | - | - |
| 55 | 1 | - | - |
| 56 | 1 | - | - |
| 57 | 2 | - | - |
| 58 | 1 | - | - |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v1.2]: Separate --color-cta from --color-primary (green CTA, cyan accents)
- [v1.3]: Gradient CTA replaces solid green -- align with medicusunion.kz
- [Phase 17]: Opacity hover (0.85) for gradient CTA compatibility
- [Phase 18]: Flat card design (no shadows) matches medicusunion.kz reference — removed all card box-shadows
- [Phase 18]: Mint badge palette (#d0fae4 bg / #007955 text) as CSS custom properties for pricing badge
- [Phase 19-v1-3-cleanup]: Removed --color-cta-hover-kz token declared in Phase 17 but never used — hover relies on opacity: 0.85
- [Phase 19-v1-3-cleanup]: Removed box-shadow from .pricing__card to complete flat design intent missed in Phase 18
- [Phase 20]: navy #0F1923 as dark mode base — avoids pure black halation for astigmatic 45+ users
- [Phase 20]: [data-theme='dark'] redefines exact same --color-* token names — never parallel names like --color-white-dark; all component CSS auto-updates via cascade
- [Phase 20]: Default-light policy (DM-04): @media prefers-color-scheme scoped to :root:not([data-theme='light']) — OS dark is hint-only, explicit toggle always wins
- [Phase 20]: initDarkMode() placed last in initAll() so all other UI is initialised before theme state reconciliation
- [Phase 20]: applyTheme() as single side-effect function ensures aria-pressed, icon, and localStorage always stay in sync
- [Phase 20]: .hero hardcoded background: #ffffff replaced with var(--color-white) — token cascade must be uninterrupted for dark mode
- [Phase 21]: h1/h2 weight 800 (Manrope Variable), h3 stays 700; --line-height-display: 1.1 added for display-scale headings; text-wrap: balance on all h1/h2/h3 prevents Cyrillic orphan lines
- [Phase 22]: @supports not pattern chosen over JS feature detection — pure CSS, no runtime overhead
- [Phase 22]: Dark mode disables backdrop-filter on all glass elements — avoids murky smear on navy #0F1923 base
- [Phase 22]: --glass-bg raised from 0.65 to 0.75 to meet REQUIREMENTS.md 75% opacity floor for header legibility
- [Phase 51]: Shadow-wrap is CANONICAL pattern; drop-shadow prohibited on glass ancestors (commit ba29f8a)

### Roadmap Evolution

- Phase 24 added: Liquid Glass Enhancement

### Blockers/Concerns

- Real content needed from client: doctor credentials, hospital logos, statistics, legal entity details
- Kazakhstan Personal Data Law (No. 94-V) may affect form field -- legal review before go-live

## Session Continuity

Last session: 2026-04-10T08:35:01.993Z
Stopped at: Completed 51-02-PLAN.md
Resume file: None
