---
title: Real-device manual UAT (VER-05) — needs human runner with hardware
created: 2026-05-01
priority: medium
context: Phase 95 AUDIT-04 deferred VER-05 because no hardware in CI/agent environment
severity: minor
---

# VER-05 real-device UAT — deferred from Phase 95

The original v9.0 Phase 94 plan included a HARD GATE for real-device manual UAT:
- (a) iPhone iOS 16 or 17 Safari
- (b) low-end Android 4GB RAM (Redmi 9-class or similar)
- (c) desktop Chrome + Firefox + Safari

Phase 95 AUDIT-04 executed every other VER-XX item but **deferred VER-05** because the agent environment has no real hardware. This was documented in `95-VERIFICATION.md` as `deferred` (not `cheat-pass`).

## What needs to happen

A human runner needs to:

1. Boot the production-like build locally (`pnpm build && pnpm start`) or deploy to a preview URL
2. On each target device + browser combination, run through the 10 TZ §18 scenarios:
   - Desktop hero load, mobile hero load
   - Cursor sweep through hero / cards / form
   - 3-second cursor dwell (heat accumulator)
   - Cursor leave block, leave window
   - `prefers-reduced-motion` toggle (system or DevTools emulation)
   - CTA / form readability under blob
3. Capture screenshots / video at each device per TZ §18 evidence requirement
4. Sign off (or reject) each scenario in `95-VERIFICATION.md` VER-05 row
5. Store evidence in `.planning/phases/95-audit-and-verification/manual-uat/`

## Defer until

User has access to real-device hardware OR opts to merge v9.0.1 without full real-device sign-off (relaxed gate).

If relaxing the gate: document in PROJECT.md Key Decisions that v9.0.1 shipped without VER-05 hardware sign-off and accept the residual risk for ЦА 45+ usability claims.
