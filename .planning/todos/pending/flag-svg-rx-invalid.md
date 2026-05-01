---
title: Fix invalid SVG rx="0 0 3 3" on country flags (console errors)
created: 2026-05-01
priority: low
context: Phase 93 UAT (F1) surfaced pre-existing console-noise bug
severity: cosmetic
---

# Fix invalid SVG `rx` on country flags

`<rect>` `rx` attribute is a single length value — CSS `border-radius` shorthand syntax does not apply. Browsers reject the malformed value (DOMException in console) and fall back to no rounding, producing flat-cornered flag stripes.

Surfaced during Phase 93 UAT (`93-UAT.md` Finding F1, 2026-05-01). Pre-existing — `git blame` traces to commit `6b6a3dde` from 2026-04-12, 18 days before Phase 93 work began. NOT a Phase 93 regression.

## Affected files

- `next/src/components/sections/consultations/ConsultationDoctors.tsx`
  - line 50: `<rect y="21" width="48" height="11" rx="0 0 3 3" fill="#FFCC00" />`
  - line 104: `<rect x="12" y="21" width="36" height="11" rx="0 0 3 3" fill="#000" />`
  - line 105: `<rect width="12" height="32" rx="3 0 0 3" fill="#FF0000" />`
- `next/src/components/sections/treatment/TreatmentClinics.tsx`
  - line 37: `<rect y="21" width="48" height="11" rx="0 0 3 3" fill="#FFCC00" />`
  - line 90: `<rect width="48" height="11" rx="3 3 0 0" fill="#FF9933" />`
  - line 91: `<rect y="21" width="48" height="11" rx="0 0 3 3" fill="#138808" />`
  - line 112: `<rect width="12" height="32" rx="3 0 0 3" fill="#FF0000" />`

## Symptoms

- Browser console errors on `/consultations` (3 errors) and `/treatment-abroad` (4 errors): `Error: <rect> attribute rx: Expected length, "0 0 3 3"`
- Visual: flag stripes render with flat corners instead of subtly rounded inner corners

## Action

Two viable fixes:

1. **Single-corner-radius approximation** — replace 4-value `rx` with single value `rx="3"` or `rx="0"`. Loses the "round only outer corners" intent but eliminates errors. ~7 line edits.
2. **Path-based corners** — rebuild each affected stripe as a `<path>` with explicit `M`/`L`/`A` commands so only specified corners are rounded. Faithful to original design intent. More work, ~14 lines per flag.

Recommend (1) for cost, (2) only if visual review insists on asymmetric rounding.

## Defer until

Next minor cleanup pass or paired with a UI quality sweep. Not blocking for v9.0 ship.
