---
title: Clean up /contacts dead-code (4 files unimported)
created: 2026-04-30
priority: low
context: Phase 93 research surfaced dead code
---

# Clean up `next/src/app/contacts/*` dead code

Phase 93 research (`93-RESEARCH.md`) confirmed: `next/src/app/contacts/page.tsx` imports zero files from the `next/src/app/contacts/` subtree. Four files exist but are never rendered.

User confirmed (2026-04-30): treat as dead-code, delete OUTSIDE Phase 93 scope. Phase 93 sweeps `/contacts/page.tsx` against whatever it actually renders.

## Action

1. List the 4 unimported files in `next/src/app/contacts/` (excluding `page.tsx` itself).
2. Confirm none are referenced anywhere (grep across `next/src/`).
3. Delete via single commit: `chore: remove dead /contacts/* files (unrendered since v8.0)`.

## Defer until

After Phase 93 ships. Avoid mixing scope.
