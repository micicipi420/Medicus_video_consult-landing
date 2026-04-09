---
phase: 44
slug: chrome-partials-upgrade
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 44 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `make build` + `make check` (byte-identity gate) + grep |
| **Config file** | Makefile + scripts/build-pages.sh |
| **Quick run command** | `make build` |
| **Full suite command** | `make build && make check` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `make build`
- **After every plan wave:** Run `make build && make check`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 44-01-01 | 01 | 1 | CHROME-02 | grep+build | `grep -c 'liquid-refract' partials/svg-defs.html && grep -c 'svg-defs' scripts/build-pages.sh` | ⬜ pending |
| 44-01-02 | 01 | 1 | CHROME-02 | build | `make build && grep -c 'BUILD:svg-defs' index.html` | ⬜ pending |
| 44-02-01 | 02 | 2 | CHROME-01 | grep+build | `grep -c 'liquid-regular' partials/header.html && make build` | ⬜ pending |
| 44-02-02 | 02 | 2 | CHROME-01 | build | `make build && make check` | ⬜ pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. `make build`, `make check`, and `grep` are sufficient.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glass header/footer/mobile-menu/sticky-bar visual | CHROME-01 | Visual rendering | Open any page, verify glass effect on all 4 chrome elements |
| SVG refraction filter rendering | CHROME-02 | Chrome-only visual | Open in Chrome 139+, verify subtle refraction on glass surfaces |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
