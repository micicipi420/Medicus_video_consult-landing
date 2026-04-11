---
gsd_state_version: 1.0
milestone: v6.0
milestone_name: Next.js Stack Migration
status: executing
stopped_at: v6.0 roadmap created with 9 phases (59-67)
last_updated: "2026-04-11T06:43:39.811Z"
last_activity: 2026-04-11
progress:
  total_phases: 9
  completed_phases: 4
  total_plans: 5
  completed_plans: 4
  percent: 80
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-10)

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.
**Current focus:** Phase 59 — Next.js Scaffold & CSS Foundation

## Current Position

Phase: 67
Plan: Not started
Status: Executing Phase 59
Last activity: 2026-04-11

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 8 (v6.0)
- Average duration: --
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 60 | 2 | - | - |
| 61 | 2 | - | - |
| 64 | 1 | - | - |
| 65 | 1 | - | - |
| 66 | 0 | - | - |

**Recent Trend:**

- Last 5 plans: --
- Trend: --

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v6.0 research]: Drizzle ORM over Prisma (7KB vs 2MB) for single-table use case
- [v6.0 research]: Turbopack has open backdrop-filter bug (#78302) -- use Webpack for production
- [v6.0 research]: Glass CSS stays global (not component-scoped) -- single globals.css @import chain
- [v6.0 research]: Skip @squircle-js/react -- CSS squircles sufficient
- [v6.0 research]: Next.js 15.5.x (NOT 16) -- breaking changes, zero benefit
- [v6.0 research]: LazyMotion + m components to keep Framer Motion under 8KB gzipped
- [v6.0 research]: backdrop-filter standard-first, -webkit- second (Turbopack fix)

### Pending Todos

None yet.

### Blockers/Concerns

- Turbopack backdrop-filter bug (#78302) -- OPEN, must use Webpack for prod
- CSS import order divergence dev/prod (#79531, #79535) -- mitigated by single entry point
- Dark mode FOUC -- deferred to v6.1 (middleware approach)
- Kazakhstan Personal Data Law (No. 94-V) may affect form field -- legal review before go-live

## Session Continuity

Last session: 2026-04-10
Stopped at: v6.0 roadmap created with 9 phases (59-67)
Resume file: None
