---
title: CTA gradient palette diverges from medicusunion.kz reference (BR-D-01 MAJOR)
created: 2026-05-01
completed: 2026-04-30
resolution: Path A — reverted to brand green→teal
priority: high
context: Phase 95 AUDIT-03 brand review found 1 major deviation; Phase 98-03 fix
severity: major
---

## Resolution (98-03, 2026-04-30)

**Path A applied.** All 10 local CTA action buttons now consume `--mu-cta-brand-from` (`#1AC67E`) and `--mu-cta-brand-to` (`#0D9DB5`) tokens, matching the canonical DESIGN.md `cta-gradient-from`/`cta-gradient-to` and the medicusunion.kz reference site.

Components touched (gradient stops only — minimal-edit; shadow-color refs preserved):
- `Header.tsx`, `MobileMenu.tsx`, `StickyBar.tsx` (chrome CTAs)
- `HeroHub.tsx`, `ServiceHero.tsx` (hero primary CTAs across 5 routes)
- `FinalCTA.tsx`, `ContactForm.tsx` (page-level CTAs)
- `ConsultationPricing.tsx`, `CheckupB2B.tsx`, `CheckupProgramsTurkey.tsx` (vertical-specific CTAs)

Token additions in `next/src/app/globals.css`:
- `--mu-cta-brand-from: #1AC67E` and `--mu-cta-brand-to: #0D9DB5` in `:root`
- `--color-mu-cta-brand-from`/`--color-mu-cta-brand-to` in `@theme inline` (Tailwind v4 mapping)

Phase 93 visual baseline regenerated (8 PNGs in `next/tests/visual/__snapshots__/baseline.spec.ts/`); new green→teal CTA baselines replace the v9.0 blue baselines as post-correction source-of-truth.

**Out of scope** (kept intentionally blue — NOT CTA action buttons):
- MedicusUnion logo wordmark (`Header.tsx:14`, `Footer.tsx:23`) — `bg-clip-text` brand wordmark
- Section headline highlights (`from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text`)
- Eyebrow pills (parallel agent owns BR-D-02 contrast fix)
- Icon backgrounds, hover/focus colors, SVG illustrations
- `ContactSection` section background (form container backdrop, not a CTA button)
- "Featured plan" badges (`CheckupProgramsKorea/Turkey`) — tier indicators

**Known minor visual tension:** the `ContactForm` submit button (green→teal) sits inside the `ContactSection` blue gradient backdrop. The CTA itself is highly legible; the blue section bg stays per minimal-edit principle. If a future polish pass wants visual harmony, swap the section background to neutral or a subtle green tint.

## Suggested Key Decision text for PROJECT.md (KD-v9.0.1-04)

```
KD-v9.0.1-04 (2026-04-30): CTA gradient restored to brand green→teal (#1AC67E → #0D9DB5). Phase 95 AUDIT-03 BR-D-01 found local v9.0 CTAs rendered #38C6F4 → #4F84E8 (blue→blue) without an explicit decision, breaking parity with medicusunion.kz and DESIGN.md `cta-gradient-from/to` tokens. Phase 98-03 reverted via new `--mu-cta-brand-from/to` tokens consumed by all 10 CTA components; v9.0 visual baseline regenerated.
```

---

# Original audit finding



# CTA gradient palette mismatch — Phase 95 AUDIT-03 (BR-D-01)

Local CTAs render the gradient `#38C6F4 → #4F84E8` (brand-blue → accent-blue).
The reference site `medicusunion.kz` (Tilda) uses `#1AC67E → #0D9DB5` (green → teal — the original DESIGN.md `cta-gradient-from/to` tokens).

DESIGN.md YAML says CTA gradient is `cta-gradient-from: '#1AC67E'` and `cta-gradient-to: '#0D9DB5'`. The local implementation does NOT consume those tokens — it uses the blue accent gradient instead.

This is a **major** brand divergence: green is the dominant brand color across `medicusunion.com`, `medicusunion.kz`, and the older v8.x designs. Switching to blue without an explicit Key Decision in PROJECT.md violates the brand parity rule from CLAUDE.md ("every color must trace to medicusunion.com or medicusunion.kz").

## Two paths

### Path A: Revert CTAs to brand green→teal (recommended for consistency)

- Repoint local CTA gradient consumers to `var(--cta-gradient-from)` and `var(--cta-gradient-to)` per DESIGN.md
- Likely 5-10 component edits (header CTA, hero CTA, sticky bottom CTA, lead-form submit, FinalCTA)
- Visual diff will be substantial (every CTA changes color); plan to regenerate Phase 93 visual baseline after
- Restores brand parity with reference sites

### Path B: Document blue→blue as v9.0.1 brand decision

- Add Key Decision to PROJECT.md: "v9.0.1 CTA gradient changed from green→teal to blue→blue (`#38C6F4 → #4F84E8`) for visual consistency with the Living Blob accent palette"
- Update DESIGN.md `cta-gradient-from/to` token values to the new blue range
- Update CLAUDE.md brand parity rule to reflect new canonical CTA palette
- BR-D-01 marked as accepted divergence; reference-site comparison expects this delta

## Recommendation

**Path A** — green→teal is the established brand identity across the entire MedicusUnion family of sites. Local v9.0.1 is the outlier. The blue accent better fits the Living Blob palette but it shouldn't override brand identity for primary CTAs.

If user prefers blue (Path B), the Key Decision needs to be explicit and brand-team-reviewed before locking.

## Defer until

User picks A or B. If A: small phase (v9.0.2 Phase 98 plan or new phase) — token repoint + baseline regen. If B: docs-only Key Decision + DESIGN.md token update.
