# Phase 93 Plan 07: Sweep Audit

**Date:** 2026-04-30
**Scope:** Phase 93 IN-SCOPE files (23 — 22 TSX section/primitive components + 1 contacts page) audited at the close of Wave 3 from the main working tree at HEAD `1ab4c54` (after Tasks 1-3 of Plan 07 land — visual baseline regen + submission E2E body + DESIGN.md anti-pattern #16). Phase 92 territory (`ContactForm.tsx`, `ContactSection.tsx`, `liquid-glass.css`, `globals.css`) and shadcn primitives (`next/src/components/ui/`) are explicitly out of scope per Plan 07 deviation rules and are not re-audited here; their disposition is captured in `92-08-SWEEP-AUDIT.md` and `93-06-SHADCN-AUDIT.md` respectively.

---

## Section 1: Per-file `bg-white/{N}` residue grep

Command per file:
```bash
grep -n 'bg-white/[0-9]' <file>
```

| File | Result | Disposition |
|------|--------|-------------|
| `next/src/components/sections/service/ServiceHero.tsx` | 0 matches | ✅ swept (93-01) |
| `next/src/components/sections/service/SocialProof.tsx` | 0 matches | ✅ swept (93-01) |
| `next/src/components/sections/service/FAQ.tsx` | 0 matches | ✅ swept (93-01) |
| `next/src/components/sections/service/LeadFormSection.tsx` | 0 matches | ✅ swept (93-01, Decision A flatten executed) |
| `next/src/components/sections/checkup/CheckupAdvantages.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupB2B.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupProblem.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupProcess.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupProgramsKorea.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupProgramsTurkey.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/checkup/CheckupWhyUs.tsx` | 0 matches | ✅ swept (93-02) |
| `next/src/components/sections/consultations/ConsultationAdvantages.tsx` | 0 matches | ✅ swept (93-03) |
| `next/src/components/sections/consultations/ConsultationBenefits.tsx` | 0 matches | ✅ swept (93-03) |
| `next/src/components/sections/consultations/ConsultationDoctors.tsx` | 0 matches | ✅ swept (93-03; 3-tier sibling stack documented as Phase 82 grandfathered exception) |
| `next/src/components/sections/consultations/ConsultationPricing.tsx` | 0 matches | ✅ swept (93-03) |
| `next/src/components/sections/consultations/ConsultationProblem.tsx` | 0 matches | ✅ swept (93-03) |
| `next/src/components/sections/consultations/ConsultationProcess.tsx` | 0 matches | ✅ swept (93-03; explicit Tier-1→Tier-2 hover ramp wired) |
| `next/src/components/sections/consultations/ConsultationScenarios.tsx` | 0 matches | ✅ swept (93-03) |
| `next/src/components/sections/treatment/TreatmentAboutUs.tsx` | 0 matches | ✅ swept (93-04) |
| `next/src/components/sections/treatment/TreatmentClinics.tsx` | 0 matches | ✅ swept (93-04; 8 country cards via `replace_all`) |
| `next/src/components/sections/treatment/TreatmentReviews.tsx` | 0 matches | ✅ swept (93-04; data-driven `review.gradient` field preserved) |
| `next/src/components/sections/treatment/TreatmentSteps.tsx` | 0 matches | ✅ swept (93-04) |
| `next/src/app/contacts/page.tsx` | 0 matches | ✅ verify-only no-op (93-05; cosmetic page-frame gradient is non-glass) |

### Phase-93 conclusion (Section 1)

**Zero unsanctioned `bg-white/{N}` residue across 23 IN-SCOPE files.** No sanctioned exceptions necessary — Phase 93 inherits Phase 92's archetype ladder cleanly. The Archetype B/C/D/F/J variants Phase 93 actually consumes do not require the `bg-white/N` layer that Archetype H + MobileMenu hovers needed in Phase 92.

---

## Section 2: Hardcoded `backdrop-blur-*` residue grep

Command:
```bash
grep -rnE 'backdrop-blur-(xl|2xl|3xl|md|sm|lg|\[[0-9]+px\])' \
  next/src/components/sections/service/ \
  next/src/components/sections/checkup/ \
  next/src/components/sections/consultations/ \
  next/src/components/sections/treatment/ \
  next/src/app/contacts/
```

Verbatim output: **(no matches — exit 0)**

Result: **ZERO** ✅ — every blur in Phase 93 IN-SCOPE files goes through the `--glass-{tier}-blur` token (or omits backdrop-blur entirely on Tier 0 / non-glass surfaces). The bracketed `backdrop-blur-[var(--glass-*-blur)]` form does not match this regex by design — only Tailwind's named scale (xl/2xl/3xl/md/sm/lg) and arbitrary `[Npx]` literals are flagged.

---

## Section 3: CTA invariant negative-grep across all 4 sub-routes + service primitives

Step 1 — locate every `from-mu-blue to-mu-accent-blue` occurrence in Phase 93 IN-SCOPE TSX:

```bash
grep -rnE 'from-mu-blue to-mu-accent-blue' \
  next/src/components/sections/service/ \
  next/src/components/sections/checkup/ \
  next/src/components/sections/consultations/ \
  next/src/components/sections/treatment/
```

Verbatim output (12 hits):

```
next/src/components/sections/service/ServiceHero.tsx:50  (Archetype J CTA — opaque)
next/src/components/sections/checkup/CheckupProcess.tsx:50  (text-gradient — clip-text)
next/src/components/sections/checkup/CheckupProgramsKorea.tsx:17  (badge pill — solid bg)
next/src/components/sections/checkup/CheckupProgramsKorea.tsx:29  (text-gradient — clip-text)
next/src/components/sections/checkup/CheckupWhyUs.tsx:45  (text-gradient — clip-text)
next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:110  (badge pill — solid bg)
next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:118  (text-gradient — clip-text)
next/src/components/sections/checkup/CheckupProgramsTurkey.tsx:132  (Archetype J CTA — opaque)
next/src/components/sections/checkup/CheckupB2B.tsx:85  (Archetype J CTA — opaque)
next/src/components/sections/consultations/ConsultationPricing.tsx:28  (text-gradient — clip-text)
next/src/components/sections/consultations/ConsultationPricing.tsx:43  (Archetype J CTA — opaque)
next/src/components/sections/treatment/TreatmentReviews.tsx:6  (review.gradient data field — avatar)
```

Step 2 — narrow to lines where the CTA gradient and `backdrop-*` co-locate on the same className:

```bash
grep -rE 'from-mu-blue to-mu-accent-blue' \
  next/src/components/sections/{service,checkup,consultations,treatment}/ \
  | grep -E '(backdrop-blur|backdrop-filter)'
```

Verbatim output: **(no matches — exit 1)**

Result: **ZERO MATCHES** ✅

The opaque-forever invariant holds across all in-scope sub-routes. Plan 93 Archetype-J CTA call-sites verified opaque:

| Location | Type | Status |
|----------|------|--------|
| `service/ServiceHero.tsx:50` | Archetype J primary CTA on shared service hero | ✅ opaque |
| `checkup/CheckupB2B.tsx:85` | Archetype J B2B CTA | ✅ opaque |
| `checkup/CheckupProgramsTurkey.tsx:132` | Archetype J programs CTA | ✅ opaque |
| `consultations/ConsultationPricing.tsx:43` | Archetype J pricing CTA | ✅ opaque |
| `sections/ContactForm.tsx:247` | Archetype J ContactForm submit (Phase 92 frozen — re-checked verbatim, untouched) | ✅ opaque (inherited) |

Non-CTA gradient occurrences are decorative variants explicitly permitted by 93-PATTERNS.md:

- **`bg-clip-text text-transparent`** uses (CheckupProcess:50, CheckupProgramsKorea:29, CheckupWhyUs:45, CheckupProgramsTurkey:118, ConsultationPricing:28) — text-gradient clip; the gradient paints text glyphs, not a glass surface; CTA invariant N/A.
- **Solid badge pills** (CheckupProgramsKorea:17, CheckupProgramsTurkey:110) — featured-variant brand-color decorative pill background; documented in 93-02 SUMMARY as preserved decorative non-CTA pattern (no co-located backdrop-*).
- **`TreatmentReviews.tsx:6`** — data field `review.gradient` for avatar tint; no backdrop-* co-location possible (the gradient is consumed downstream via inline style on a `<div>` representing the reviewer avatar circle).

---

## Section 4: ROUTE-NN coverage matrix

| Req ID | Plan(s) | File(s) modified | Grep gate result | Status |
|--------|---------|------------------|------------------|--------|
| ROUTE-01 | 93-01 + 93-02 | service/{ServiceHero,SocialProof,FAQ,LeadFormSection}.tsx + checkup/*.tsx (7 files) | §1 = 0 unsanctioned (11 files); §2 = 0; §3 = 3 hits all clip-text/badge non-CTA, 2 CTA hits opaque | ✅ |
| ROUTE-02 | 93-01 + 93-03 | service/* + consultations/*.tsx (7 files) | §1 = 0 unsanctioned (11 files); §2 = 0; §3 = 1 clip-text + 1 CTA opaque; brand-color chip preservation verified | ✅ |
| ROUTE-03 | 93-01 + 93-04 | service/* + treatment/*.tsx (4 files) | §1 = 0 unsanctioned (8 files); §2 = 0; §3 = `review.gradient` data field preserved verbatim | ✅ |
| ROUTE-04 | 93-05 (verify-only) | (none — read-only audit at 93-05-CONTACTS-AUDIT.md) | §1 = 0 on `app/contacts/page.tsx`; §2 = 0; LeadFormSection inherited via ESM import from Plan 01 sweep | ✅ |
| ROUTE-05 | 93-01 (service primitives) | service/{ServiceHero,SocialProof,FAQ,LeadFormSection}.tsx | §1 = 0 (4 files); §2 = 0; Decision A flatten verified at LeadFormSection.tsx:47 (`p-6 md:p-12` outer = Tier 0 no-glass, inner Tier 2 panel only); Decision C honored (no honeypot/timing on LeadFormSection; embedded ContactForm inherits the trap as a Phase 92 grandfathered surface) | ✅ |
| ROUTE-06 | 93-06 (verify-only) | (none — read-only audit at 93-06-SHADCN-AUDIT.md) | shadcn admin-only impact confirmed; dialog.tsx:34 future-proof recipe recorded; `git diff next/src/components/ui/` = empty | ✅ |
| ROUTE-07 | 93-00 (Wave 0) + 93-07 (this plan) | playwright.config.ts + tests/visual/baseline.spec.ts + tests/e2e/submission.spec.ts + 8 baseline PNGs | Task 1 baseline regen 8/8 passed deterministically; Task 2 E2E body implemented for 4 routes (graceful-skip when `PLAYWRIGHT_E2E_RUN` unset) | ✅ |

**Conclusion:** All 7 ROUTE-NN requirements code-complete. Phase 93 closes with the same archetype ladder Phase 92 validated, propagated mechanically across 22 sub-route components + 1 contacts page + 4 service primitives.

---

## Section 5: Anti-pattern enforcement gate

Each row evaluates Phase 93 IN-SCOPE files against DESIGN.md `## v9.0 Anti-Patterns` after Task 3's #16 append.

| # | Anti-pattern | Status | Evidence |
|---|--------------|--------|----------|
| #4 | Solid-white / milky glass fills above 0.16 (non-form) | PASS | All consumers go through `--glass-{section,card,button}-fill` tokens (≤0.10/0.10 desktop, ≤0.10/0.14/0.16 mobile per Phase 90 ranges). KD-v9-002 `--glass-form-fill = 0.50` is the only sanctioned escalation, applied exclusively at LeadFormSection inner Tier 2 panel + ContactForm success overlay. |
| #5 | Statically painted green tint on cards | PASS | Phase 93 brand-color chips preserved (consultations spec-pills, checkup featured-variant badges, mu-green-600 SVG strokes) are INSIDE cards as decorative inner sub-elements, NOT card surfaces themselves. Anti-pattern requires green tint on the card surface (`bg-mu-green-100/N` directly on card) — not present in any IN-SCOPE file. |
| #6 | Animated `backdrop-filter` blur values | PASS | `grep -rnE 'transition-\[.*backdrop' next/src/components/sections/{service,checkup,consultations,treatment}/ next/src/app/contacts/` returns 0 matches. |
| #8 | `mix-blend-mode` on glass surfaces | PASS | `grep -rnE 'mix-blend-(multiply\|screen\|overlay)' <IN-SCOPE>` returns 0 matches. |
| #11 | `backdrop-filter` on `.living-blob-field` | PASS | N/A — Phase 93 does not touch the blob field. `next/src/styles/blob.css` git-diff is empty across the phase. |
| #12 | Mobile blur >12px | PASS | Token clamp enforces automatically (`--glass-*-blur` clamps to 12px on `<768px` per Phase 90 mobile media query). All consumers use `backdrop-blur-[var(--glass-*-blur)]`; no hardcoded `[Npx]` literals or named-scale `xl/2xl/3xl` (verified by §2 above). |
| #13 | >2 glass layers per viewport | PASS | LeadFormSection Decision A flatten cleared the primary risk (outer Tier 0 wrapper removed). ConsultationDoctors 3-tier sibling stack documented in 93-03 SUMMARY as Phase 82 grandfathered exception (siblings, not nested). No new nested glass introduced. |
| #14 | New glass class without `@a11y-layer-coverage` | PASS | Decision E (class-swap, no new utility) — zero new CSS classes added across waves 1-3. `liquid-glass.css` git-diff is empty across the phase. |
| #15 | Cheat-passing a11y verification | PASS | Phase 93 makes no live-toggle a11y claims. `prefers-reduced-{transparency,motion}` and `prefers-contrast: more` verification deferred to Phase 94 hard gate per CONTEXT.md. |
| #16 NEW | ContactForm honeypot/timing propagation | PASS | `grep -irE '(honeypot\|loadTimeRef)' next/src/components/sections/{service,checkup,consultations,treatment}/ next/src/app/contacts/` returns 0 matches. LeadFormSection.tsx is honeypot/timing-free; ContactForm.tsx (Phase 92 grandfathered surface, untouched in Phase 93) carries the pattern but is exempt — see Decision C in 93-CONTEXT.md. Future form components must NOT propagate the pattern; DESIGN.md #16 is the gate. |

---

## Section 6: Sign-off

```
PHASE 93 SWEEP AUDIT COMPLETE: 2026-04-30
All 7 ROUTE-NN requirements code-complete.
All 5 in-scope CTAs verified opaque (ServiceHero:50, CheckupB2B:85, CheckupProgramsTurkey:132, ConsultationPricing:43, ContactForm:247 inherited).
LeadFormSection Decision A executed (outer Tier 0 flattened; inner Tier 2 panel α=0.50 via KD-v9-002).
LeadFormSection Decision C honored (no honeypot/timing propagation on the new component shell; ContactForm grandfathered exemption preserved).
Decision F honored (/contacts dead-code skipped — separate cleanup todo at .planning/todos/pending/contacts-route-dead-code-cleanup.md, with path discrepancy noted in Outstanding Items below).
shadcn primitives verified admin-only impact (Plan 06; verify-only no-op; dialog.tsx:34 future-proof recipe recorded).
Submission E2E body implemented across 4 routes (Plan 07 Task 2). Default graceful-skip when PLAYWRIGHT_E2E_RUN unset; live run requires Postgres + project-bound dev server.
Post-Phase-93 visual baseline locked (Plan 07 Task 1; 8 PNGs deterministic 8/8 green; PLAYWRIGHT_PORT override added to playwright.config.ts).
DESIGN.md anti-pattern #16 appended (ContactForm honeypot/timing prohibition; YAML + markdown both updated).
Phase 93 ready for /gsd-verify-work and Phase 94 hand-off.
```

### Outstanding Items (Phase 94 input)

1. **`/contacts` dead-code path discrepancy.** `.planning/todos/pending/contacts-route-dead-code-cleanup.md` references `next/src/app/contacts/*` (4 unimported files), but the actual on-disk location of `ContactsHero`, `ContactMethodGrid`, `CoordinatorCard`, `TrustBadges` is `next/src/components/sections/contacts/`. The cleanup todo must be corrected before deletion executes. Decision F deferred the actual deletion to a future cleanup phase; this audit logs the path mismatch for that future work.

2. **Submission E2E live-run pending.** Plan 07 Task 2 ships the body but the live path was not exercised because (a) Directus is not part of this project's stack — submissions go via Drizzle/Postgres, not Directus REST; (b) Postgres is not running in the local dev environment of the executor; (c) port 3000 is occupied by an unrelated sibling Next dev server. Phase 94 UAT or a future CI environment with a project-bound Postgres should set `PLAYWRIGHT_E2E_RUN=1` + `PLAYWRIGHT_PORT=3100` (or equivalent) + `DATABASE_URL=...` to exercise the spec end-to-end. The spec is route-agnostic and matches ContactForm's HTML name attributes, so it will run cleanly in any env that meets the three preconditions.

3. **REQUIREMENTS.md ROUTE-02 status row.** Pre-Plan-07 state showed ROUTE-02 = "Pending" despite Plan 03 completing the consultations sweep. Plan 07's `requirements.mark-complete` step flips it to Complete (Phase 93) along with ROUTE-04, ROUTE-05, ROUTE-06, ROUTE-07.

4. **REQUIREMENTS.md ROADMAP file-count drift.** ROADMAP estimates `/checkup` (8 files), `/consultations` (8 files), `/contacts` (2 files); actuals are 7, 7, and 0-rendered-via-page.tsx (page.tsx imports from `next/src/components/sections/service/` only). 93-02 SUMMARY and 93-03 SUMMARY both note the discrepancy. ROADMAP itself stays as-is until milestone-end audit per Decision G in 93-CONTEXT.md.
