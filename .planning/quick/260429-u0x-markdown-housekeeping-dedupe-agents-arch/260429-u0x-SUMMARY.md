---
quick_id: 260429-u0x
title: "Markdown housekeeping: dedupe AGENTS, archive milestones, relocate v6.0 audit, handle technical_integration_request"
status: complete
date: 2026-04-29
commit: c3346b1
---

# Summary: Markdown housekeeping

## Outcome

Project markdown organization tightened in 3 atomic commits (no destructive operations).

## Commits

| Hash | Subject |
|------|---------|
| `a23e725` | docs: commit AGENTS.md (cross-tool AI agent instructions) |
| `25888cb` | chore(planning): relocate v6.0 milestone audit to milestones/ |
| `c3346b1` | docs(external): add HQ Vienna integration proposal |

## Decisions applied (per CONTEXT.md)

| Area | Decision | Result |
|------|----------|--------|
| AGENTS.md vs CLAUDE.md | Keep both — they target different agents (Codex/Cursor vs Claude). Diff is 1 line (profile-generator name). | AGENTS.md committed at root alongside CLAUDE.md. |
| .planning/milestones/ historicals | Keep in place. `milestones/` is already the archive; active milestone (v8.0) lives at `.planning/` root. | No move. |
| v6.0-MILESTONE-AUDIT.md location | Relocate to milestones/ for consistency with v1.x/v6.1/v7.0 audits. | `git mv` preserves history. |
| technical_integration_request.md | Move out of root to `docs/external/` — it's an inter-office business document, not GSD territory. | Moved + committed. New `docs/external/` directory established. |

## Final markdown layout

```
./
├── AGENTS.md                 (committed, mirrors CLAUDE.md for non-Claude tools)
├── CLAUDE.md                 (project instructions for Claude Code)
├── docs/external/
│   └── technical_integration_request.md  (HQ Vienna integration proposal)
├── .planning/
│   ├── DECISIONS.md         ← active
│   ├── MILESTONES.md        ← active
│   ├── PROJECT.md           ← active
│   ├── REQUIREMENTS.md      ← active (v8.0)
│   ├── ROADMAP.md           ← active (v8.0)
│   ├── STATE.md             ← active
│   └── milestones/
│       ├── v1.0-{REQS,ROADMAP,AUDIT}.md
│       ├── v1.1-…
│       ├── v1.2-…
│       ├── v1.3-…
│       ├── v1.4-…
│       ├── v6.0-MILESTONE-AUDIT.md   ← relocated
│       ├── v6.1-…
│       └── v7.0-…
```

## Out of scope (untouched)

- `.planning/research/*.md` (4 modified files) — phase 79 WIP
- `.planning/.continue-here.md` (hidden checkpoint file)
- 12 modified files under `next/src/**` — phase 79 WIP
- 36 untracked screenshots and other non-markdown files

## Branch

All commits on `feat/v3.1` (single source of truth confirmed in quick task `260429-tuu`).
