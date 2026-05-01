---
title: Resolve mobile hero glass-layer count vs ≤2-per-viewport contract
created: 2026-05-01
priority: low
context: Phase 93 UAT (F2) surfaced borderline design-contract violation
severity: minor
---

# Mobile hero shows 3 glass surfaces vs `≤2 per viewport` contract

CLAUDE.md design contract: "Mobile blur ≤12px, ≤2 glass elements per viewport." On `/treatment-abroad` at 375×667 (top-of-page viewport), three glass surfaces are simultaneously visible:

1. Sticky `<header>` — pre-existing chrome, glass since v8.x
2. Eyebrow pill `МЕДИЦИНСКИЙ ТУРИЗМ` (above hero headline) — token-swept by Phase 93 Plan 01
3. Sticky bottom CTA wrapper (`fixed bottom-[max(1rem,env(safe-area-inset-bottom))]`) — pre-existing chrome FAB, glass since v8.x

Surfaced during Phase 93 UAT (`93-UAT.md` Finding F2, 2026-05-01). Phase 93 did not introduce surfaces #1 or #3 — they pre-date the phase. The contract violation existed before Phase 93 swept the eyebrow pill, but it is now formally noted.

The page scrolls into compliance once the eyebrow pill leaves viewport (header + bottom-CTA = exactly 2 glass surfaces), so the violation is restricted to the hero viewport.

## Three viable resolutions

1. **Drop eyebrow pill to non-glass on mobile only.** Solid pale fill instead of `--glass-section-fill`. Smallest visual change; preserves desktop look.
2. **Make sticky bottom CTA opaque on mobile only.** The button itself is already opaque; the wrapper around it becomes opaque too. May reduce visual richness on mobile.
3. **Update DESIGN.md / CLAUDE.md** to clarify whether sticky chrome surfaces (header, bottom FAB) count toward the per-viewport glass budget. If "chrome doesn't count," the current state already satisfies the contract; document and move on.

Recommend (3) first — the contract was likely written with content-glass in mind, not chrome. Confirm intent with the design rule, then apply (1) or (2) only if chrome counts.

## Defer until

Paired with a Phase 94 design-system pass, or whenever mobile UX gets a focused review. Not blocking for v9.0 ship — does not affect functional behavior or contrast/legibility for the 45+ audience.

## Related

- `next/src/components/layout/Header.tsx` — sticky nav glass surface
- `next/src/components/sections/service/ServiceHero.tsx` — eyebrow pill (Archetype B)
- `next/src/components/MobileStickyCta.tsx` (or equivalent) — sticky bottom FAB wrapper
- `DESIGN.md` § Liquid Glass — per-viewport budget rule
- `CLAUDE.md` § Design Contract
