---
phase: 41
slug: foundation-tokens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 41 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Tailwind CSS CLI build + make build (shell-based) |
| **Config file** | Makefile + src/styles/theme.css |
| **Quick run command** | `make build` |
| **Full suite command** | `make build && git diff --exit-code *.html` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `make build`
- **After every plan wave:** Run `make build && git diff --exit-code *.html`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 41-01-01 | 01 | 1 | GRID-01 | — | N/A | build | `make build` | ✅ | ⬜ pending |
| 41-01-02 | 01 | 1 | GRID-01 | — | N/A | grep | `grep 'container-max-content' css/styles.css` | ✅ | ⬜ pending |
| 41-02-01 | 02 | 1 | SQUIRCLE-03 | — | N/A | grep | `grep 'outline.*mu-blue-text' src/styles/theme.css` | ✅ | ⬜ pending |
| 41-02-02 | 02 | 1 | SQUIRCLE-03 | — | N/A | build | `make build && git diff --exit-code *.html` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. `make build` and `grep` are sufficient for token verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Focus-visible ring renders outside mask-image boundary | SQUIRCLE-03 | Visual rendering behavior cannot be tested via grep | Open any page in browser, Tab to a button, verify outline ring visible outside element boundary |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
