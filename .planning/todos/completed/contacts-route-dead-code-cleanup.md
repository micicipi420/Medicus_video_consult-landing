---
title: Clean up /contacts dead-code (4 files unimported)
created: 2026-04-30
priority: low
context: Phase 93 research surfaced dead code
---

## Status

Superseded by `.planning/phases/94-polish-and-hygiene/94-02-PLAN.md` (executed in v9.0.1).

# Clean up `next/src/components/sections/contacts/*` dead code

Phase 93 research (`93-RESEARCH.md`) confirmed: `next/src/app/contacts/page.tsx` imports zero files from the `next/src/components/sections/contacts/` subtree. Four files existed there but were never rendered.

User confirmed (2026-04-30): treat as dead-code, delete OUTSIDE Phase 93 scope. Phase 93 sweeps `/contacts/page.tsx` against whatever it actually renders.

## Action

1. List the 4 unimported files in `next/src/components/sections/contacts/` (excluding the rendered page.tsx route at `next/src/app/contacts/page.tsx`).
2. Confirm none are referenced anywhere (grep across `next/src/`).
3. Delete via single commit: `chore: remove dead /contacts/* files (unrendered since v8.0)`.

## Defer until

After Phase 93 ships. Avoid mixing scope.
