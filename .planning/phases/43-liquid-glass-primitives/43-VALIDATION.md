---
phase: 43
slug: liquid-glass-primitives
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 43 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Structural grep + `make build` (no test framework — CSS primitives phase) |
| **Config file** | Makefile + src/styles/tailwind.css |
| **Quick run command** | `make build` |
| **Full suite command** | `make build && grep -c 'liquid-regular' css/styles.css` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `make build`
- **After every plan wave:** Run `make build && grep -c 'liquid-regular\|shimmer-sweep\|stats-glass\|scroll-fade' css/styles.css`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 43-01-01 | 01 | 1 | LIQUID-01..07, DIFF-01..03 | grep+build | `make build && grep -c 'liquid-regular' css/styles.css` | ⬜ pending |
| 43-01-02 | 01 | 1 | LIQUID-01 | build | `make build && git diff --quiet '*.html'` | ⬜ pending |
| 43-02-01 | 02 | 2 | LIQUID-05 | grep | `grep 'data-refract' js/main.js` | ⬜ pending |
| 43-02-02 | 02 | 2 | LIQUID-05 | build | `make build` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. `make build` and `grep` are sufficient for CSS/JS primitive verification. No test framework install needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glass visual appearance over colored content | LIQUID-01 | Visual rendering | Place .liquid-regular over colored background, verify blur+tint visible |
| Dark mode glass appearance | LIQUID-02 | Visual rendering | Toggle .dark class on html, verify dark glass recipe |
| Shimmer hover effect | DIFF-01 | Animation visual | Hover hero CTA, verify sweep animation |
| Refraction distortion | LIQUID-05 | Chrome-only visual | Open in Chrome 139+, verify subtle distortion |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
