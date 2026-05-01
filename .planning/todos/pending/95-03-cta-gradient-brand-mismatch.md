---
title: CTA gradient palette diverges from medicusunion.kz reference (BR-D-01 MAJOR)
created: 2026-05-01
priority: high
context: Phase 95 AUDIT-03 brand review found 1 major deviation
severity: major
---

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
