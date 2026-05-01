# Quick Task 260429-u0x: Markdown housekeeping - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Task Boundary

Cleanup project-level markdown organization across 4 areas:
1. Resolve AGENTS.md vs CLAUDE.md duplication
2. Decide structure of .planning/milestones/ historical files
3. Relocate `.planning/v6.0-MILESTONE-AUDIT.md` to consistent location
4. Relocate `technical_integration_request.md` from repo root

</domain>

<decisions>
## Implementation Decisions

### AGENTS.md vs CLAUDE.md
- **Decision:** Keep both files; commit AGENTS.md.
- **Rationale:** They differ by exactly 1 line (profile-generator name: `generate-claude-profile` vs `generate-Codex-profile`). `AGENTS.md` is the emerging standard for non-Claude AI coding tools (OpenAI Codex, Cursor). Cross-tool compatibility wins over deduplication.
- **Action:** `git add AGENTS.md` and commit.

### .planning/milestones/ historical files
- **Decision (Claude's discretion, user said "сам реши"):** Keep in place. Do NOT move to a new `archive/` subdirectory.
- **Rationale:** `.planning/milestones/` already functions as the archive — the active milestone (v8.0) lives in `.planning/ROADMAP.md` / `REQUIREMENTS.md` at root. Adding `archive/milestones/` would be redundant nesting (`archive/milestones/v1.0-…` reads as "the milestones part of the archive of milestones"). The current convention is clean enough.
- **Action:** No move. Only fix the v6.0-MILESTONE-AUDIT.md anomaly (next decision).

### .planning/v6.0-MILESTONE-AUDIT.md location
- **Decision:** Move to `.planning/milestones/v6.0-MILESTONE-AUDIT.md`.
- **Rationale:** All other audit/roadmap/requirements files for past milestones live in `.planning/milestones/`. v6.0 is an outlier from before the directory existed — fix the inconsistency.
- **Action:** `git mv .planning/v6.0-MILESTONE-AUDIT.md .planning/milestones/v6.0-MILESTONE-AUDIT.md`.

### technical_integration_request.md
- **Decision:** Move to `docs/external/technical_integration_request.md`.
- **Rationale:** Important business document (proposal to MedicusUnion HQ Vienna for form integration). Not GSD-territory (so not `.planning/`). Not a one-off (delete is wrong). Create `docs/external/` for inter-office / vendor-facing docs.
- **Action:** `mkdir -p docs/external && git add docs/external/technical_integration_request.md`. (Source is currently untracked, so plain mv at filesystem level is sufficient before git add.)

### Claude's Discretion
- Atomic commits per area (4 commits) for clean history and reversibility.
- No changes to other markdown files in scope (research/*, STATE/PROJECT/ROADMAP/REQUIREMENTS/MILESTONES/DECISIONS, .continue-here.md hidden file).

</decisions>

<specifics>
## Specific Ideas

- AGENTS.md content was confirmed to differ from CLAUDE.md by 1 line (`generate-Codex-profile` vs `generate-claude-profile`). Both should remain divergent — they target different agents.
- v6.0-MILESTONE-AUDIT.md (4546 B) contains audit findings from milestone v6.0 (existing convention: `<version>-MILESTONE-AUDIT.md` in `milestones/`).

</specifics>

<canonical_refs>
## Canonical References

- `CLAUDE.md` (project root) — primary instructions for Claude Code
- AGENTS.md convention for cross-tool AI dev: emerging standard, used by OpenAI Codex, Cursor, and others (no formal RFC yet)

</canonical_refs>
