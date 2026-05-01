# AUDIT-02 a11y Fix Summary (98-02)

**Fix date:** 2026-04-30
**Base SHA:** `2d161d2` (main)
**Tool:** axe-core via @axe-core/playwright (same spec as Phase 95 audit)
**Status:** complete — hard gate passes (0 critical, 0 serious across 15 audits)

## Approach

**Approach A** — retarget existing AA-safe foreground tokens. The repo already
defined `--mu-blue-text`, `--mu-accent-blue-text`, `--mu-green-text`,
`--mu-accent-teal-text`, `--mu-accent-orange-text` (in `next/src/app/globals.css`)
as accessible variants of the brand accents specifically for foreground use on
light glass. Phase 95's audit confirmed each of the 5 brand accents fails 4.5:1
when used unmodified as text. Approach B (collapse all to `text-mu-green`)
would have eliminated brand differentiation across services. Approach A keeps
each service's accent identity (consultations = blue, checkup = green,
treatment-abroad = teal, b2b = orange) while satisfying WCAG AA.

One token (`--mu-accent-orange-text`) was nudged from `#B5621D` (4.33:1 — fail)
to `#A55E1B` (4.85:1 — pass) so the small bold "для компаний" chip clears AA.

## Fix Map

| Component / Selector | Before | Ratio | After | Ratio |
|---|---|---:|---|---:|
| `ServicesGrid` "Наши Услуги" eyebrow | `text-mu-accent-blue` (#4F84E8) | 3.5:1 | `text-mu-accent-blue-text` (#3B6DD0) | 4.73:1 |
| `ServicesGrid` "от 450 €" chip | `text-mu-accent-blue` | 3.53:1 | `text-mu-accent-blue-text` | 4.73:1 |
| `ServicesGrid` "от $350" chip | `text-mu-green-700` (#2D9E68) | 3.3:1 | `text-mu-green-text` (#1F7A4F) | 5.17:1 |
| `ServicesGrid` "план бесплатно" chip | `text-mu-accent-teal` (#78C3BF) | 1.97:1 | `text-mu-accent-teal-text` (#3D7E7A) | 4.58:1 |
| `ServicesGrid` "для компаний" chip | `text-mu-accent-orange` (#FFA25C) | 1.93:1 | `text-mu-accent-orange-text` (#A55E1B) | 4.85:1 |
| `ServiceHero` eyebrow (/checkup, /treatment-abroad) | `text-mu-blue` (#38C6F4) | 1.92:1 | `text-mu-blue-text` (#0B7A9A) | 4.75:1 |
| `ContactForm` "(необязательно)" label | `text-mu-text-500` (#6B6F80) | 4.47:1 | `text-mu-text-700` (#4A4E5C) | 8.21:1 |

Worst-case post-fix contrast: **4.58:1** (teal chip "план бесплатно") — clears
the 4.5:1 AA floor.

## Per-Route axe Delta

| Route | Mode | Before (crit/serious) | After (crit/serious) |
|---|---|---:|---:|
| / | default | 0 / 1 | 0 / 0 |
| / | reduced-motion | 0 / 1 | 0 / 0 |
| / | reduced-transparency | 0 / 1 | 0 / 0 |
| /checkup | default | 0 / 1 | 0 / 0 |
| /checkup | reduced-motion | 0 / 1 | 0 / 0 |
| /checkup | reduced-transparency | 0 / 1 | 0 / 0 |
| /consultations | all 3 | 0 / 0 | 0 / 0 |
| /treatment-abroad | default | 0 / 1 | 0 / 0 |
| /treatment-abroad | reduced-motion | 0 / 1 | 0 / 0 |
| /treatment-abroad | reduced-transparency | 0 / 1 | 0 / 0 |
| /contacts | default | 0 / 0 | 0 / 0 |
| /contacts | reduced-motion | 0 / 0 | 0 / 0 |
| /contacts | reduced-transparency | 0 / 1 | 0 / 0 |
| **TOTALS** | 15 audits | **0 / 10** | **0 / 0** |

## Files Changed

- `next/src/app/globals.css` — `--mu-accent-orange-text` `#B5621D` → `#A55E1B`
- `next/src/components/sections/ServicesGrid.tsx` — 5 token swaps (eyebrow + 4 chips)
- `next/src/components/sections/service/ServiceHero.tsx` — eyebrow `text-mu-blue` → `text-mu-blue-text`
- `next/src/components/sections/ContactForm.tsx` — `text-mu-text-500` → `text-mu-text-700`

## Constraints Honoured

- No CTA gradient touched (parallel agent owned that area).
- No hero images touched (parallel LCP agent owned that area).
- No glass surface, blur, or opacity changes — pure foreground colour edits.
- Russian copy verbatim — no microcopy touched.
- No new dependencies.
- All swapped-to tokens already existed; only one (`--mu-accent-orange-text`)
  was nudged darker by 4 hue degrees within the same orange family — brand
  parity preserved.

## Verification Commands

```sh
pnpm --dir next lint           # 0 errors (4 pre-existing warnings unrelated to fix)
pnpm --dir next build          # exit 0
PLAYWRIGHT_PORT=3211 pnpm --dir next exec playwright test tests/a11y/axe.spec.ts --project=desktop
# 15 passed (26.3s) — 0 critical, 0 serious across all 15 audits
```
