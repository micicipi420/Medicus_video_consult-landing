---
phase: 66-admin-panel
plan: 01
subsystem: admin
tags: [admin, submissions, table, filters, shadcn]
dependency_graph:
  requires: [65-01]
  provides: [admin-panel, submissions-view]
  affects: [next/src/app/admin/]
tech_stack:
  added: [shadcn/ui-table, shadcn/ui-badge]
  patterns: [server-component-data-fetch, client-side-filtering, force-dynamic]
key_files:
  created:
    - next/src/components/ui/table.tsx
    - next/src/components/ui/badge.tsx
    - next/src/app/admin/page.tsx
    - next/src/app/admin/submissions-table.tsx
  modified: []
decisions:
  - "Plain HTML select for status filter instead of shadcn Select (avoids @base-ui/react portal complexity for a simple dropdown)"
  - "Client-side filtering on pre-fetched data (no user input reaches DB query, mitigates T-66-03)"
  - "Graceful DB error handling in Server Component with try/catch (build passes without PostgreSQL)"
metrics:
  duration: ~4min
  completed: 2026-04-10
---

# Phase 66 Plan 01: Admin Panel -- Submissions Table Summary

Server-rendered admin page at /admin with Drizzle DB query, shadcn/ui Table+Badge, and client-side status/date filters -- no authentication per v6.0 scope.

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Install shadcn/ui Table + Badge, create admin page with DB query | `ed9aeeb` | Added table.tsx, badge.tsx; created page.tsx with force-dynamic, Drizzle query, SubmissionRow type, error handling |
| 2 | Create SubmissionsTable client component with status and date filters | `b7d3667` | Full client component with status dropdown, date range, reset, Badge variants, empty states, responsive scroll |

## Implementation Details

### Admin Page (Server Component)
- `force-dynamic` export ensures fresh DB query on every request
- Drizzle query: `db.select().from(submissions).orderBy(desc(submissions.dateCreated))`
- Try/catch wraps DB call -- graceful error banner when PostgreSQL is unavailable
- `robots: { index: false }` prevents search engine indexing (T-66-01 mitigation)
- Exports `SubmissionRow` type consumed by client component

### SubmissionsTable (Client Component)
- Three filter controls: status select (all/new/contacted/completed), date-from, date-to
- `useMemo` filtering with inclusive end-of-day logic for dateTo
- Reset button appears only when filters are active
- Filtered count shown when filters reduce the result set
- Badge variants: `default` (new), `secondary` (contacted), `outline` (completed)
- Empty state distinguishes "no submissions" from "no filter matches"
- Wrapped in `overflow-x-auto rounded-md border` for mobile horizontal scroll
- Russian locale date formatting via `toLocaleDateString('ru-RU')`

## Verification Results

- `npx tsc --noEmit` -- zero errors
- `npm run build` -- succeeds, /admin shown as dynamic route (f)
- Build output: `/admin` at 4.05 kB client JS

## Deviations from Plan

None -- plan executed exactly as written.

## Self-Check: PASSED

All 5 files verified present. Both commit hashes (ed9aeeb, b7d3667) found in git log.
