---
phase: 68
slug: design-tokens-layout-chrome
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-12
---

# Phase 68 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + ESLint |
| **Config file** | next.config.ts, eslint.config.mjs |
| **Quick run command** | `cd next && npx next build 2>&1 | tail -5` |
| **Full suite command** | `cd next && npx next build && npx next lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd next && npx next build 2>&1 | tail -5`
- **After every plan wave:** Run `cd next && npx next build && npx next lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 68-01-01 | 01 | 1 | LAY-03 | — | N/A | build | `cd next && npx next build` | N/A | ⬜ pending |
| 68-02-01 | 02 | 1 | NAV-01 | — | N/A | build | `cd next && npx next build` | N/A | ⬜ pending |
| 68-02-02 | 02 | 1 | NAV-02 | — | N/A | build | `cd next && npx next build` | N/A | ⬜ pending |
| 68-03-01 | 03 | 2 | LAY-01 | — | N/A | build | `cd next && npx next build` | N/A | ⬜ pending |
| 68-04-01 | 04 | 2 | LAY-02 | — | N/A | build | `cd next && npx next build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Next.js build validation is already configured.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header glass effect renders at 1440px | NAV-01 | Visual rendering requires browser | Open localhost:3000, scroll down, verify header transitions to glass |
| Footer 4-column layout matches design | LAY-01 | Visual layout comparison | Compare footer at 1440px and 375px with feat/new-design HTML |
| MobileMenu glass overlay at 375px | NAV-02 | Mobile viewport interaction | Open at 375px, tap burger, verify glass overlay |
| StickyBar glass style on mobile | LAY-02 | Mobile viewport styling | Open at 375px, verify glass rounded bar |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
