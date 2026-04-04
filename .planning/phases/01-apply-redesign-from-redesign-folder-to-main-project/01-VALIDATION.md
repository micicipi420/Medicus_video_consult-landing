---
phase: 1
slug: apply-redesign-from-redesign-folder-to-main-project
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser verification (no test framework — vanilla HTML/CSS/JS) |
| **Config file** | none |
| **Quick run command** | `open index.html` (browser check) |
| **Full suite command** | `open index.html && open online-consultations.html && open treatment-abroad.html && open checkups.html && open contacts.html` |
| **Estimated runtime** | ~30 seconds (manual visual inspection) |

---

## Sampling Rate

- **After every task commit:** Open affected HTML file in browser, verify visual correctness
- **After every plan wave:** Open all 5 pages, check responsive at 375px and 1440px
- **Before `/gsd:verify-work`:** Full suite must show all sections rendered correctly
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | TBD | manual | `open index.html` | TBD | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing infrastructure covers all phase requirements — no test framework needed for static HTML landing page

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glassmorphism renders | Visual | CSS visual effect, no automated check | Open in Chrome, verify backdrop-blur on header and cards |
| Counter animation | Visual | JS animation timing, no automated check | Scroll to stats section, verify numbers animate from 0 |
| Form submission | Functional | Requires Directus backend | Fill form, submit, check Directus admin panel |
| Dark mode toggle | Functional | Visual + localStorage | Toggle dark mode, refresh, verify persistence |
| Responsive layout | Visual | Layout verification | Chrome DevTools at 375px, 768px, 1440px |
| SF Pro font fallback | Visual | System font check | Test on non-Apple device, verify fallback renders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
