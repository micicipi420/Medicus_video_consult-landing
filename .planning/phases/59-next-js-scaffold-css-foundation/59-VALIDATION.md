---
phase: 59
slug: next-js-scaffold-css-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 59 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Built-in Next.js build + CSS verification |
| **Config file** | next.config.ts (created in this phase) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run dev -- --port 3001` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run dev -- --port 3001`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 59-01-01 | 01 | 1 | SCAF-01 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 59-01-02 | 01 | 1 | SCAF-02 | — | N/A | build+inspect | `npm run build` | ❌ W0 | ⬜ pending |
| 59-01-03 | 01 | 1 | SCAF-04 | — | N/A | build+inspect | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Next.js project initialized with `npm run build` passing
- [ ] CSS import chain verified (no ordering bugs)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glass materials render identically | SCAF-02 | Visual comparison needed | Side-by-side screenshot of test page vs production |
| backdrop-filter standard-first order | SCAF-04 | DevTools inspection needed | Inspect computed styles, verify standard before -webkit- |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
