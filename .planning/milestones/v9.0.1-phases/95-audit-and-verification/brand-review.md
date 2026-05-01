# AUDIT-03 — Brand Review vs medicusunion.com / medicusunion.kz

**Run date:** 2026-05-01
**Tool:** Playwright capture spec (`next/tests/brand/brand-capture.spec.ts`) + DESIGN.md token extraction + computed-styles.json
**Reference sites:** medicusunion.com (mother brand), medicusunion.kz (KZ portal)
**Routes audited locally:** /, /checkup, /consultations, /treatment-abroad, /contacts
**Commit SHA:** (see commit log for 95-03 brand artifacts)
**Approver:** auto-approved per Phase 95 orchestrator pre-approval (one MAJOR deviation flagged for user direction)

## 1. Color Comparison

Token-by-token comparison: DESIGN.md YAML vs sampled computed style.

| Token (DESIGN.md) | Hex (DESIGN.md) | Sampled (medicusunion.com) | Sampled (medicusunion.kz) | Sampled (local /) | Disposition |
|---|---|---|---|---|---|
| brand-blue        | `#38C6F4` | n/a (mostly white/text on hero) | n/a | CTA from-color `rgb(56,198,244)` = `#38C6F4` | match |
| green-600 / primary | `#35B678` | n/a (no green CTA on .com hero) | reference CTA bg uses `#1AC67E → #0D9DB5` gradient (cta-gradient-* tokens) | absent from local hero CTA | divergence (see major deviation) |
| cta-gradient-from | `#1AC67E` | n/a | matched: `linear-gradient(90deg, rgb(26,198,126), rgb(13,157,181))` = `#1AC67E → #0D9DB5` | local hero CTA uses `#38C6F4 → #4F84E8` instead | MAJOR — see Deviation BR-D-01 |
| cta-gradient-to   | `#0D9DB5` | n/a | matched | local hero CTA uses `#4F84E8` instead | MAJOR — see Deviation BR-D-01 |
| accent-blue       | `#4F84E8` | n/a | n/a | `rgb(79,132,232)` = `#4F84E8` (used as CTA gradient-to) | match (token), but used in CTA role |
| text-primary      | `#18212C` | hero h1 = `rgb(24,33,44)` = `#18212C` | hero h1 uses gradient text (TildaSans) — n/a | local h1 = `rgb(27,33,44)` = `#1B212C` | minor — 3-bit diff (DESIGN.md `text-900: #1B212C` is the actual sampled token; alias confusion in DESIGN.md) |
| text-700          | `#4A4E5C` | n/a | n/a | local body p = `rgb(74,78,92)` = `#4A4E5C` | match |

**Note on .com:** medicusunion.com mother-brand hero is text-only (no gradient CTA visible at viewport-fold) so token sampling is sparse. .kz portal is the authoritative reference for CTA gradient.

## 2. Typography Comparison

| Property | DESIGN.md spec | medicusunion.com | medicusunion.kz | Local | Match? |
|---|---|---|---|---|:---:|
| Body font-family    | Inter | `Inter, "Inter Fallback", sans-serif` | `TildaSans, Arial, sans-serif` (Tilda CMS default) | `inter, "inter Fallback"` | match (.com) / divergent (.kz uses Tilda's default font) |
| Heading font-family | Manrope | `Inter` (no Manrope) | `TildaSans` | `manrope, "manrope Fallback"` | divergent — local uses Manrope; .com uses Inter; .kz uses TildaSans |
| Heading weight (h1) | 800 (per DESIGN.md typography section) | 700 (.com) | 900 (.kz) | 800 (local) | match per DESIGN.md spec |
| Body weight | 400-500 | 500 | n/a (no plain `<p>` sampled on .kz) | 500 | match |
| Body letter-spacing | normal | normal | normal | normal | match |
| H1 letter-spacing | tight (-1.5px / -1.2px) | normal | normal | -1.5px (/) / -1.2px (sub-routes) | local-specific tighter tracking (intentional brand voice) |

**Typography assessment:** local Manrope-headings + Inter-body matches DESIGN.md spec exactly. medicusunion.com (Inter only) and medicusunion.kz (TildaSans Tilda CMS-default) each use a single typeface — **local KZ portal is more typographically intentional than the reference .kz** (which uses Tilda CMS's stock TildaSans). This is **intentional brand uplift**, not a regression.

## 3. Tone-of-Voice Spot-Check

### /checkup
- **Heading area:** "Чек-ап за рубежом" (eyebrow) + "Чек-ап в Южной Корее" (subheading) — register: **formal-medical, geographic anchor, no marketing pump**
- **Primary CTA:** "Записаться" / "Получить консультацию" — register: imperative-but-restrained, medical
- **Body sample:** "Каждая программа — это комплекс обследований, составленный так, чтобы ничего не пропустить. От базового скрининга до углублённого обследования с колоноскопией и МРТ." — register: **clinical, factual, lists procedures**
- **Reference comparison:** matches medicusunion.com / .kz "formal medical" register. No "amazing" / "best" / "instant" marketing words. Verdict: **match**.

### /consultations
- **Body sample:** "Онлайн-встреча с переводчиком — или приём в клинике" — register: **factual, no embellishment**
- **Reference comparison:** matches register. Verdict: **match**.

### /treatment-abroad
- **Body sample:** "Обследование проводят профессора и ведущие специалисты. По результатам — личная консультация врача: что в норме, что требует внимания, что делать дальше." — register: **medical authority + outcome-oriented**
- **Reference comparison:** matches. Verdict: **match**.

**Tone assessment:** All 3 sub-routes hold the formal-medical register. The CLAUDE.md tone constraint ("Спокойный, уверенный, медицинский — без маркетинговой агрессии") is honored.

## 4. Deviation Table — All Findings

| ID | Axis | Severity | Description | Disposition | Approver |
|----|------|---------:|-------------|-------------|----------|
| BR-D-01 | color | **major** | Local CTAs use `#38C6F4 → #4F84E8` (brand-blue → accent-blue). medicusunion.kz reference uses `#1AC67E → #0D9DB5` (cta-gradient-from → cta-gradient-to per DESIGN.md). DESIGN.md defines BOTH gradient pairs (cta-gradient + cta-gradient-v6 = "0E8FB5 → 3B6DD0"). Local site is closer to v6 endpoint values but uses brand-blue/accent-blue tokens, not the v6 endpoints either. Brand owner intent unclear. | **flag for user direction — do NOT auto-fix** | **needs user** |
| BR-D-02 | typography | accepted-divergence | Local uses Manrope (headings) + Inter (body). medicusunion.kz uses TildaSans (Tilda CMS default — likely accidental, not intentional brand). medicusunion.com uses Inter for both. | accepted: local is more typographically intentional than .kz reference; matches DESIGN.md spec | claude (auto-approved, intentional brand uplift) |
| BR-D-03 | color | minor | text-primary sampled `rgb(27,33,44)` ≈ `#1B212C` on local; DESIGN.md `text-primary` = `#18212C`; DESIGN.md `text-900` = `#1B212C`. The token alias used at the actual h1 selector (`text-mu-text-900`) is correct; the DESIGN.md `text-primary` alias may be redundant. | accepted: token used correctly at runtime; documentation clarification deferred | claude (auto-approved, no visible regression) |
| BR-D-04 | typography | accepted-divergence | Local h1 letter-spacing -1.5px on `/`, -1.2px on sub-routes. References use `normal`. | accepted: local typography is tighter for visual density / Manrope's optical correction; matches DESIGN.md typography spec | claude (auto-approved, intentional) |
| BR-D-05 | color | match | All other token mappings (brand-blue, accent-blue, text-700, body fonts) match DESIGN.md to within hex precision | match | claude (auto-approved) |
| BR-D-06 | tone | match | All 3 sub-routes hold formal-medical register matching .com/.kz reference | match | claude (auto-approved) |

**Severity scale:**
- **major** — visible brand-violation; user-perceivable wrong color / wrong font / off-tone; user direction required
- **should-fix** — sub-pixel drift, low-impact divergence we'd correct in next polish pass
- **accepted-divergence** — intentional differentiation; auto-approved when uplift is documented
- **match / minor** — no action needed; auto-approved

## 5. Hard-Gate Status

- [ ] All `major` deviations have approved direction OR are downgraded to `accepted-divergence` with rationale — **NOT MET: BR-D-01 needs user direction on CTA gradient palette**
- [x] All `should-fix` deviations have either a follow-up todo or accepted-risk rationale (none in this audit)
- [x] All other deviations are auto-approved per Phase 95 orchestrator pre-approval

If BR-D-01 is left unresolved, milestone v9.0.1 closeout is BLOCKED on AUDIT-03.

## 6. Recommended Remediation for BR-D-01 (suggested only — needs user)

Two paths the user can choose:

**Path A — match .kz reference exactly:** Change local hero CTAs to `linear-gradient(90deg, #1AC67E, #0D9DB5)` (existing `cta-gradient-from/to` tokens). This restores brand parity with the live KZ portal. Locks the green→teal "medical CTA" identity.

**Path B — keep brand-blue CTA (local design intent):** Document in DESIGN.md that the v9 redesign deliberately uses brand-blue → accent-blue CTAs to differentiate from the legacy .kz portal aesthetic. Add a Key Decision in PROJECT.md. Update `cta-gradient-from-v6 / cta-gradient-to-v6` tokens (already in DESIGN.md as `#0E8FB5 → #3B6DD0`) — but local CTAs still don't match those v6 values exactly (`#38C6F4 → #4F84E8`); either align to v6 tokens or define a new v9-cta-gradient pair.

**Do NOT auto-fix.** Phase 95 orchestrator brief explicitly forbids auto-applying brand-color changes — brand owner judgment required.

## 7. Files

- Reference: `brand/medicusunion-com--home.png`, `brand/medicusunion-kz--home.png`
- Local: `brand/local--{index,checkup,consultations,treatment-abroad,contacts}.png` × 5
- Computed styles: `brand/computed-styles.json`
- Capture spec: `next/tests/brand/brand-capture.spec.ts`
