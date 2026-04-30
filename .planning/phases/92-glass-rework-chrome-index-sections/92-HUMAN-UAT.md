---
status: partial
phase: 92-glass-rework-chrome-index-sections
source: [92-VERIFICATION.md]
started: 2026-04-30T00:00:00Z
updated: 2026-04-30T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual verification of v9.0 4-tier glass tokens at three blob positions
expected: All chrome (Header, MobileMenu, StickyBar, Footer) + 11 `/` route sections render with correct glass-tier opacities (Tier 0 ≤0.16, Tier 1 ≤0.10, Tier 2 0.50 form, Tier 3 0.12 button); heat-leak gradient visibly warms surfaces near blob centroid; no glass surface looks empty or over-blurred. Test on desktop (≥1280px) and mobile (≤375px) with cursor / static / ambient blob modes.
result: [pending]

### 2. WCAG AA spot-check on ContactForm body copy at mu-accent-blue gradient endpoint
expected: Body copy contrast ≥4.5:1 per KD-v9-002 (form-fill 0.50 → theoretical 4.60:1 worst-case). Use Chrome DevTools contrast picker on the privacy-notice line "Мы перезвоним..." with blob parked at mu-accent-blue gradient end.
result: [pending]

### 3. Mobile blur cap (≤12px) verified empirically on real device <768px
expected: Every chrome + section glass surface caps at 12px blur. BL-01 (mobile filter-chain saturate clobber) was deferred — confirm visual saturation is not visibly regressed in Header/MobileMenu on a real iOS or Android device.
result: [pending]

### 4. FAQSection accordion open/close interaction
expected: Closed items render at Tier 1 (`--glass-card-fill`); button hover ramps to Tier 2 (`--glass-form-fill`); smooth max-height transition preserved at 300ms; aria-expanded toggles correctly.
result: [pending]

### 5. ContactForm honeypot + 3-second timing trap (BL-04 deferred — product decision)
expected: Decide whether sub-3s legitimate-user submissions (browser autofill, returning visitors) being silently dropped while showing fake success UI is acceptable. If not: BL-04 needs server-side mitigation or threshold lift. This is a product/business decision — not a code regression of Phase 92.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
