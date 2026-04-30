---
gsd_state_version: 1.0
milestone: v8.1
milestone_name: Propagation & Loose Ends
status: milestone_complete
stopped_at: v8.1 roadmap created -- ready to plan Phase 86
last_updated: "2026-04-30T00:00:00.000Z"
last_activity: 2026-04-30 -- v8.0 shipped, v8.1 milestone created
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 0
  completed_plans: 0
  percent: 25
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-23)

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.
**Current focus:** Phase 86 — service-pages-v8-propagation

## Current Position

Phase: 86
Plan: Not started
Status: Milestone complete
Last activity: 2026-04-30

Progress: [░░░░░░░░░░] 0% (0/4 phases)

## Performance Metrics

**Velocity:**

- Total plans completed: 16 (v7.0)
- Average duration: --
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 74.1 | 2 | - | - |
| 75 | 2 | - | - |
| 76 | 2 | - | - |
| 77 | 1 | - | - |
| 78 | 1 | - | - |
| 79 | 1 | - | - |
| 80 | 1 | - | - |
| 81 | 1 | - | - |
| 82 | 1 | - | - |
| 83 | 1 | - | - |
| 84 | 1 | - | - |
| 85 | 1 | - | - |
| 86 | 1 | - | - |

**Recent Trend:**

- Last 5 plans: --
- Trend: --

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v6.0]: Glass CSS stays global (not component-scoped) -- single globals.css @import chain
- [v6.1]: New design source of truth is vanilla HTML at commit d450232 on feat/new-design branch
- [v7.0]: 6 phases derived from 18 requirements; Phases 74/75/76 parallelizable after 73
- [v8.0]: 7 phases derived from 22 requirements; Phase 79 (foundation) unblocks all others; Phase 85 (verification) must ship last
- [v8.1]: 4 phases capturing v8.0 loose ends — service-page propagation, content placeholders, code hygiene, milestone closeout

### Pending Todos

- Phase 89/CLO-02: Live a11y UAT for v8.0 — execute 7 browser-only checks from `.planning/phases/85-glass-hardening-accessibility-verification/85-VERIFICATION.md` against running dev server
- Phase 89/CLO-01: Triage `stash@{0}` — cherry-pick remaining value, drop entry once consumed
- `.mcp.json` is untracked and may be personal MCP config; user decides track vs ignore

### Blockers/Concerns

- Turbopack backdrop-filter bug (#78302) -- OPEN, must use Webpack for prod
- CSS import order divergence dev/prod (#79531, #79535) -- mitigated by single entry point
- v8.1 service pages must respect Phase 79 mobile glass budget (≤2 layers / ≤12px blur on <768px)
- 2 pre-existing lint warnings on build (PHONE_NUMBER unused, variant unused) — tracked under HYG-01

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260413-0ie | Remove landing references -- project is a multi-page site | 2026-04-13 | 92c3388 | [260413-0ie-remove-landing-references](./quick/260413-0ie-remove-landing-references-project-is-a-m/) |
| 260429-tuu | Repo cleanup: consolidate в feat/v3.1 | 2026-04-29 | de9084e | [260429-tuu-repo-cleanup-consolidate-feat-v3-1](./quick/260429-tuu-repo-cleanup-consolidate-feat-v3-1/) |
| 260429-u0x | Markdown housekeeping: dedupe AGENTS, archive milestones, relocate v6.0 audit, handle technical_integration_request | 2026-04-29 | c3346b1 | [260429-u0x-markdown-housekeeping-dedupe-agents-arch](./quick/260429-u0x-markdown-housekeeping-dedupe-agents-arch/) |
| 260429-uus | Design system docs alignment: PROJECT.md services + DESIGN.md per Google spec + CLAUDE.md sync | 2026-04-29 | 2fa86b5 | [260429-uus-design-system-docs-alignment-project-md-](./quick/260429-uus-design-system-docs-alignment-project-md-/) |

## Session Continuity

Last session: 2026-04-30
Stopped at: v8.1 roadmap created -- ready to plan Phase 86
Resume file: None
