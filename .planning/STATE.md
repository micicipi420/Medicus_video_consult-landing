---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: Liquid Design System
status: defining_requirements
stopped_at: Milestone v4.0 kickoff — defining requirements
last_updated: "2026-04-09T00:00:00.000Z"
last_activity: 2026-04-09
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (evolved 2026-04-09 at v4.0 milestone kickoff)

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома — и оставляет заявку.
**Current focus:** Milestone v4.0 Liquid Design System — responsive grid + universal squircles + Apple Liquid Design language

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-09 — Milestone v4.0 started

Progress: [░░░░░░░░░░] 0% (phases/plans TBD by roadmapper after requirements)

## Performance Metrics

**Velocity (historical across all milestones):**

- v3.2: 2 phases, 6 plans, 1 day — clean ship (zero plan revisions)
- v3.1: 7 phases (33–38 + 38.1 corrective), 45/52 reqs (7 deferred to v3.2)
- v3.0: 4 phases (29–32), 7 plans, 24 reqs
- v2.0: 4 phases (25–28), 8 plans, 35 reqs
- v1.4: 4 phases, 6 plans, 13 reqs
- v1.3: 3 phases, 3 plans, 10 reqs
- v1.2: 2 phases, 2 plans, 9 reqs
- v1.1: 4 phases, 5 plans, 12 reqs
- v1.0: 10 phases, 24 plans, 36 reqs

**v4.0:** No data yet — phases/plans determined by roadmapper post-requirements.

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v4.0 kickoff 2026-04-09]: Major version bump — Liquid Design System pivot is a fundamental visual language overhaul, not a refinement
- [v4.0 kickoff 2026-04-09]: Supersedes v1.4 "max 2 glass elements, blur ≤12px" GPU budget — relaxed everywhere, conscious trade-off in favor of visual bar over budget Android performance. Revisit policy: v4.x minor milestone if post-ship FPS < 30 on real devices
- [v4.0 kickoff 2026-04-09]: Universal squircle replacement — ALL rounded rectangles become superellipse shapes; implementation technique TBD in research phase
- [v4.0 kickoff 2026-04-09]: 12/8/2-3 responsive grid — 12-col desktop, 8-col tablet (intentional, not 6/12), 2-3 col mobile; all elements bound to grid across 6 pages
- [v4.0 kickoff 2026-04-09]: Research references — iOS 26 / macOS Tahoe (Liquid Glass OS), apple.com marketing, Apple HIG, Linear/Vercel/Stripe (web Apple-idiom)
- [v3.2 close]: Byte-identity build pipeline + chrome partials shipped — v4.0 leverages this infrastructure for multi-page design migration
- [v3.2 close]: Pre-commit hook enforces byte-identity gate — any v4.0 chrome change lands via partials, not per-page edits

### Pending Todos

None yet.

### Blockers/Concerns

- **Squircle implementation technique unknown** — CSS `corner-shape` is experimental with limited browser support, SVG clipPath / CSS `mask-image` are fallbacks with trade-offs (anti-aliasing, performance, a11y semantics). Research phase must benchmark compat + visual fidelity on real browsers (Safari 18, Chrome 130+, Firefox) and pick a strategy before planning.
- **Apple Liquid Glass web patterns are thin** — iOS 26 (2025/2026) is young; inventory of proven web adaptations doesn't exist yet. Research phase must gather actual implementations (WebKit demos, dev blogs, Apple HIG updates), not just marketing screenshots.
- **ЦА 45+ on budget Android** — relaxed perf budget is a known risk. Post-ship telemetry should watch for FPS degradation reports; v4.x minor milestone may be needed for graceful degradation if reality bites. Accepted trade-off at kickoff.
- **8-column tablet grid is unusual** (6 or 12 are more common) — confirmed intentional at milestone kickoff, retained as project convention. No challenge during planning.
- **Scope is large** — v4.0 touches every component on every page. Risk of phase bloat and plan sprawl. Roadmapper should lean toward narrow foundation-first phases (grid, then squircles, then Liquid tokens) before page-by-page migration.

## Session Continuity

Last session: 2026-04-09
Stopped at: Milestone v4.0 kickoff — PROJECT.md + STATE.md updated, awaiting research decision
Next command: Research prompt → REQUIREMENTS.md → gsd-roadmapper
