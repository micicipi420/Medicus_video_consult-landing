---
status: human_needed
phase: 89-milestone-closeout
verified: 2026-04-30
mode: documentation
must_haves_passed: 4
must_haves_total: 4
human_verification_needed: 8
notes: CLO-01 done autonomously. CLO-02 (live a11y UAT, 7 checks) and CLO-03 (/gsd-cleanup with interactive approval) require user action with the exact commands documented below.
---

# Phase 89 Verification

## Done autonomously

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `stash@{0}` for v8.0 wip dropped | ✅ | `git stash list` no longer references "wip-pre-v8-autonomous" |
| 2 | CLO-02 documented with the 7 specific checks | ✅ | This file's "Live a11y UAT (CLO-02)" section below |
| 3 | CLO-03 documented with the exact command | ✅ | This file's "Run /gsd-cleanup (CLO-03)" section below |
| 4 | Phase 85's residual human_needed items rolled forward | ✅ | Cross-referenced from `85-VERIFICATION.md` |

## User actions remaining

### Live a11y UAT (CLO-02) — 7 checks

Run from the project root:

```bash
cd next
pnpm dev
# open http://localhost:3000 in a browser
```

Then verify each item against the running site:

1. **Glass intensity vs mockup** — open `/` at 1440px and 375px. Compare side-by-side to your v8.0 mockup. Confirm chrome strength matches.
2. **WCAG 2.2 AA contrast** — DevTools → Inspect → color-picker. Sample text on glass surfaces against worst-case composite background. Body text ≥ 4.5:1, large text ≥ 3:1.
3. **`prefers-contrast: more` toggled in OS** — toggle the OS setting (macOS: System Settings → Accessibility → Display → Increase Contrast; Windows: Settings → Accessibility → Contrast themes). Confirm:
   - Every glass surface goes opaque
   - `bg-white/X` → solid white; `border-white/X` → dark border
   - Text contrast still passes
4. **`prefers-reduced-transparency: reduce` toggled in OS** — toggle (macOS: System Settings → Accessibility → Display → Reduce Transparency; Windows: Settings → Personalization → Colors → Transparency effects off). Confirm:
   - Zero transparency on the index page
   - No `backdrop-filter` blur on any element
   - Layout still renders correctly (no broken positioning)
5. **`prefers-reduced-motion: reduce` toggled in OS** — toggle (macOS: System Settings → Accessibility → Display → Reduce Motion; Windows: Settings → Accessibility → Visual effects → Animation effects off). Confirm:
   - HeroHub live-indicator `animate-ping` halo stops painting
   - All hover/transition animations are instant
   - No scroll-reveal animations fire
6. **Focus visibility (Tab traversal)** — close the menu, click somewhere blank, press Tab repeatedly through the page. Confirm a visible `:focus-visible` ring on:
   - Header logo + nav links + phone link + CTA button
   - MobileMenu toggle (resize to <1024px first) + nav links + CTA
   - StickyBar phone + CTA (resize to <1024px first)
   - Hero CTAs (Обсудить мой случай, Узнать больше)
   - All 4 service cards (Phase 83)
   - Form fields + submit button
   - Coordinator phone + email links
7. **Tap targets ≥44×44 on 375px** — DevTools → Inspect → Computed → check rendered box dimensions. All buttons/CTAs/links should report ≥44×44 CSS pixels in mobile viewport.

When all 7 are satisfied, run:

```bash
# Update Phase 85's verification status from human_needed to passed
# (manual edit, or via gsd-sdk if a status bump command exists)
```

…and Phase 89's status can be moved from `human_needed` to `passed`.

### Run /gsd-cleanup (CLO-03)

```bash
/gsd-cleanup
```

The command will:
1. Show a dry-run listing every directory it intends to move (`.planning/phases/79-*` through `85-*`)
2. Ask for explicit approval
3. On approval, move them to `.planning/milestones/v8.0-phases/`

**Recommended:** read the dry-run carefully before approving. v8.1 phase directories (86–89) should NOT appear in the dry-run since v8.1 isn't shipped yet.

## Requirements Traceability

| Req | Status | Coverage |
|-----|--------|----------|
| CLO-01 | DONE autonomously | `git stash drop stash@{0}` executed; v8.0 wip stash gone |
| CLO-02 | DEFERRED to user | 7 browser-only checks documented above with exact OS-level toggle paths |
| CLO-03 | STAGED for user | `/gsd-cleanup` command + reasoning documented; not auto-invoked because cleanup's interactive dry-run review is a safety feature that should not be bypassed |

## Provenance

CLO-01 executed autonomously per user's "do as you see fit" mandate; documented before the destructive `git stash drop`.
CLO-02 and CLO-03 are user-gated by design — automating them would either fail (no browser) or bypass intended safety prompts (cleanup's dry-run review).
