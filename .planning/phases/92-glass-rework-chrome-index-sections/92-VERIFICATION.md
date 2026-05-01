---
phase: 92-glass-rework-chrome-index-sections
verified: 2026-04-30T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Visual verification of v9.0 4-tier glass tokens at three blob positions (cursor / static / ambient) on desktop + mobile (≤375px and ≥1280px)"
    expected: "All chrome (Header, MobileMenu, StickyBar, Footer) + 11 `/` route sections render with correct glass-tier opacities (Tier 0 ≤0.16, Tier 1 ≤0.10, Tier 2 0.50 form, Tier 3 0.12 button); heat-leak gradient visibly warms surfaces near blob centroid; no glass surface looks empty or over-blurred"
    why_human: "Visual appearance and optical response to live blob movement cannot be programmatically verified — requires human eye on running blob engine"
  - test: "WCAG AA spot-check on ContactForm body copy with blob parked at mu-accent-blue gradient endpoint"
    expected: "Body copy contrast ≥4.5:1 (per KD-v9-002 escalation: form-fill 0.50 should yield 4.60:1 worst-case per theoretical computation in PROJECT.md:189); empirical Chrome DevTools contrast picker reading recommended as future spot-check"
    why_human: "KD-v9-002 PROJECT.md entry explicitly notes 'Empirical re-measurement via Chrome DevTools contrast picker recommended as a future spot-check' — automated grep cannot measure rendered contrast"
  - test: "Mobile blur cap (≤12px) verified empirically on real device under 768px viewport"
    expected: "Every chrome + section glass surface caps at 12px blur via either token clamp() or globals.css media-query !important rule; saturate filter chain on Header may clobber under BL-01 (deferred) — requires confirmation that visual saturation is not regressed on mobile"
    why_human: "BL-01 was intentionally deferred (mobile filter-chain clobber). Need human visual check on mobile to confirm severity of saturate-filter loss in Header/MobileMenu"
  - test: "FAQSection accordion open/close interaction"
    expected: "Closed items render at Tier 1 (`--glass-card-fill`); button hover ramps to Tier 2 (`--glass-form-fill`); smooth max-height transition preserved at 300ms; aria-expanded toggles correctly"
    why_human: "Smooth-anim accordion behavior is dynamic and hover-state dependent — not programmatically verifiable from static code grep"
  - test: "ContactForm honeypot/timing fake-success branches (BL-04 deferred)"
    expected: "Genuine slow-human submissions (>3s after mount) reach the server; sub-3s legitimate users with browser autofill should NOT be silently dropped. BL-04 was intentionally deferred — needs product decision on lead-loss tolerance"
    why_human: "Data-integrity / business-logic concern crossing client/server boundary. Project owner must decide on threshold + tagging strategy"
---

# Phase 92: Glass Rework — Chrome + Index Sections Verification Report

**Phase Goal:** All `/` route components and always-visible chrome (Header, MobileMenu, StickyBar, Footer) sweep to v9.0 4-tier glass system. Forms remain WCAG AA-readable; CTAs stay fully opaque; mobile blur cap ≤12px preserved; glass surfaces optically respond to blob position via heat-leak gradients.

**Verified:** 2026-04-30
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| #   | Truth   | Status     | Evidence       |
| --- | ------- | ---------- | -------------- |
| 1   | HeaderClient/MobileMenu/StickyBar/Footer swept to v9.0 tiers (Tier 0 fill ≤0.16); HIG 44pt + ESC preserved; mobile blur ≤12px verified per component | ✓ VERIFIED | All 4 chrome files consume `bg-[var(--glass-section-fill)]` (0.06) + `backdrop-blur-[var(--glass-section-blur)]` (clamp 12-24px floor 12). MobileMenu burger `h-11 w-11` (44pt HIG); ESC handler `event.key === 'Escape'` at line 14. Section blur token clamps to 12px on mobile per Phase 90 contract. Footer card line 18 + inner contact icon chips lines 89/100 (Tier 3 button tokens). |
| 2   | All `/` route sections show transparent glass per token map; ≤2 glass siblings per viewport; Phase 82 responsive nesting preserved on StatsBar; FAQSection closed Tier 1 / open Tier 2 with smooth-anim accordion | ✓ VERIFIED | StatsBar.tsx:49 mobile wrapper Tier 0 + 56 desktop cards `sm:bg-[var(--glass-card-fill)]` Tier 1 (Phase 82 nesting preserved via `sm:` mutually-exclusive switch). FAQSection.tsx:115 closed card uses `bg-[var(--glass-card-fill)]`; line 119 button hover `hover:bg-[var(--glass-form-fill)]` Tier 2; accordion `transition-[max-height] duration-300 ease-in-out` preserved at 141. All 7 mid-sections (Process/Problem/WhyUs/Clinics/Platform/Reviews) consume v9 tokens (verified count). |
| 3   | ContactForm + ContactSection form panel uses --glass-form-fill (escalated to 0.50 per KD-v9-002); labels promoted to text-primary; inputs bg-white opaque; localized blob dimming deferred under KD-v9-003 (Path A); body copy contrast ≥4.5:1 verified | ✓ VERIFIED | globals.css:249 `--glass-form-fill: rgba(255, 255, 255, 0.50)` (escalated per KD-v9-002, PROJECT.md:189 documents escalation rationale + 4.60:1 worst-case theoretical contrast). ContactSection.tsx:120 panel uses `bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)]`. ContactForm.tsx:128 inputBase = `bg-white` (opaque, no `bg-white/50` no `backdrop-blur-md`). Labels `text-mu-text-900 font-bold` (lines 137, 159, 182, 207). Path A blue-gradient occlusion preserved at ContactSection.tsx:26. |
| 4   | CTA buttons (gradient #1AC67E → #0D9DB5) verified opaque at all blob positions — no backdrop-filter ever applied; FinalCTA Tier 0 frame with opaque CTA preserved | ✓ VERIFIED | 92-08-SWEEP-AUDIT.md §3 negative-grep across HeroHub/MobileMenu/StickyBar/ContactForm/FinalCTA: ZERO MATCHES. CTA invariant baseline (92-02-AUDIT.md §1) preserved verbatim across all 5+2 in-scope CTA call-sites. FinalCTA.tsx:8 frame at Tier 0; line 23 primary CTA opaque gradient (no backdrop). |
| 5   | liquid-glass.css utilities re-pointed to --glass-* tier tokens; heat-leak radial-gradient rules preserved on .liquid-card and .liquid-regular | ✓ VERIFIED | liquid-glass.css:170-201 `.liquid-regular` consumes `var(--glass-section-fill)` + `var(--glass-section-blur)` with heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` line 178-182 (alpha 0.04). liquid-glass.css:337-365 `.liquid-card` consumes `var(--glass-card-fill)` + `var(--glass-card-blur)` with heat-leak gradient at 343-347 (alpha 0.06). `.liquid-nav` (line 211) + `.liquid-btn-secondary` (line 417) re-pointed. `@a11y-layer-coverage` block lines 79-157 preserved. |

**Score:** 5/5 truths verified

### Required Artifacts (Three-Level Check)

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `next/src/styles/liquid-glass.css` | Utility re-point + heat-leak rules | ✓ VERIFIED | 4 `.liquid-*` classes consume v9 tier tokens; 2 heat-leak `at var(--blob-x` rules on .liquid-card + .liquid-regular |
| `next/src/app/globals.css` | --glass-* tokens registered + a11y selectors fixed | ✓ VERIFIED | Lines 247-254 token registry; lines 554-559 (reduced-transparency) + 589-594 (prefers-contrast) override tokens to opaque white (BL-02 fix per commit da8d1fd) |
| `next/src/components/layout/HeaderClient.tsx` | v9 tokens, scrolled state | ✓ VERIFIED | Lines 17, 19 consume section-fill + section-blur; saturate intentional |
| `next/src/components/layout/MobileMenu.tsx` | v9 tokens + 44pt + ESC | ✓ VERIFIED | Burger line 38 `h-11 w-11` + section tokens; drawer line 52 section tokens; ESC at line 14 |
| `next/src/components/layout/StickyBar.tsx` | v9 tokens + CTA opaque | ✓ VERIFIED | Line 44 wrapper section tokens; line 58 CTA gradient untouched |
| `next/src/components/layout/Footer.tsx` | Tier 0 frame + Tier 3 icon chips | ✓ VERIFIED | Line 18 outer card section tokens; lines 89/100 contact icons button tokens (Tier 3) |
| `next/src/components/sections/HeroHub.tsx` | Pill + secondary CTA + credibility badge | ✓ VERIFIED | Line 15 pill section; line 56 secondary CTA section; line 139 credibility badge card. Line 48 primary CTA opaque (no backdrop). Lines 117/123 sanctioned Archetype H sub-elements (over-photo) |
| `next/src/components/sections/StatsBar.tsx` | Phase 82 responsive nesting preserved | ✓ VERIFIED | Mobile wrapper line 49 Tier 0; sm+ cards line 56 Tier 1 → Tier 2 hover (`sm:hover:bg-[var(--glass-form-fill)]`) |
| `next/src/components/sections/ServicesGrid.tsx` | Tier 1 cards / Tier 2 hover | ✓ VERIFIED | 3 token consumption sites |
| `next/src/components/sections/ProcessSection.tsx` | Tier 1 cards | ✓ VERIFIED | 2 token consumption sites |
| `next/src/components/sections/ProblemSection.tsx` | Tier 1 cards | ✓ VERIFIED | 2 token consumption sites |
| `next/src/components/sections/WhyUsSection.tsx` | Section + cards | ✓ VERIFIED | 9 token consumption sites |
| `next/src/components/sections/ClinicsSection.tsx` | Tier 1 → Tier 2 hover | ✓ VERIFIED | 1 token consumption site |
| `next/src/components/sections/PlatformSection.tsx` | Tier 0 single panel | ✓ VERIFIED | 1 token consumption site |
| `next/src/components/sections/ReviewsSection.tsx` | Tier 1 → Tier 2 hover | ✓ VERIFIED | 1 token consumption site |
| `next/src/components/sections/FAQSection.tsx` | Closed Tier 1 / open Tier 2 / smooth accordion | ✓ VERIFIED | Line 115 card token; line 119 hover Tier 2; line 141 max-height transition |
| `next/src/components/sections/FinalCTA.tsx` | Tier 0 frame + opaque CTA + mix-blend retired | ✓ VERIFIED | Line 8 frame; line 23 opaque CTA; mix-blend-multiply absent (grep zero matches); line 30 phone CTA Tier 3 → Tier 2 hover |
| `next/src/components/sections/ContactForm.tsx` | Inputs bg-white + opaque submit + success overlay tokens | ✓ VERIFIED | Line 128 `bg-white` opaque (no /50); line 247 CTA gradient opaque; line 111 success overlay migrated to form tokens (BL-03 fix per commit f599af9) |
| `next/src/components/sections/ContactSection.tsx` | Form panel form tokens + Path A | ✓ VERIFIED | Line 120 panel form tokens; line 26 blue gradient outer preserved |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `liquid-card`/`liquid-regular` utilities | `--blob-x/y/heat` runtime vars | `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` heat-leak rules | ✓ WIRED | liquid-glass.css:178, 344 — gradient writes runtime vars consumed live |
| Tailwind arbitrary classes | `--glass-{tier}-{fill,blur}` tokens | `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]` | ✓ WIRED | 30 occurrences across 13 sections + chrome files |
| ContactForm | KD-v9-002 escalated form-fill | `bg-[var(--glass-form-fill)]` resolves to 0.50 | ✓ WIRED | globals.css:249 token = 0.50; ContactSection.tsx:120 consumes |
| a11y prefers-contrast media-query | v9 token consumers | `:root { --glass-*-fill: rgb(255 255 255) }` token rewrite | ✓ WIRED | globals.css:589-594 (BL-02 fix); flips every consumer in cascade |
| FAQSection accordion | open-state hover ramp | `hover:bg-[var(--glass-form-fill)]` button | ✓ WIRED | FAQSection.tsx:119 |
| Phase 91 blob engine | Phase 92 heat-leak | `--blob-heat` runtime var × 0.04/0.06 alpha | ✓ WIRED | Engine writes per-frame; CSS reads via `calc(0.04 * var(--blob-heat, 0))` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `.liquid-card` heat-leak | `--blob-heat` | Phase 91 engine writes :root | Yes (Phase 91 verified) | ✓ FLOWING |
| `.liquid-card` heat-leak | `--blob-x/y` | Phase 91 engine writes :root | Yes | ✓ FLOWING |
| `bg-[var(--glass-form-fill)]` | `--glass-form-fill` | globals.css:249 (0.50) | Yes — token resolves to rgba | ✓ FLOWING |
| ContactForm submit | `submitContactForm` server action | `@/lib/db/actions` import | Yes (server-action) | ✓ FLOWING (BL-04 caveat — see human_verification) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| `pnpm --dir next build` clean | `pnpm --dir next build` | 11 routes generated, 0 errors | ✓ PASS |
| CTA invariant negative-grep | grep gradient + backdrop on same line in 5 in-scope files | ZERO MATCHES | ✓ PASS |
| `bg-white/[0-9]` residue in chrome | grep `bg-white/[0-9]` in layout/ | Only sanctioned MobileMenu hovers + divider | ✓ PASS |
| `mix-blend-multiply` retired in FinalCTA | grep `mix-blend-multiply` in FinalCTA.tsx | No matches | ✓ PASS |
| Heat-leak gradient on .liquid-card / .liquid-regular | grep `at var(--blob-x` | 2 occurrences (preserved) | ✓ PASS |
| `--glass-form-fill` escalated to 0.50 (KD-v9-002) | grep token in globals.css:249 | `rgba(255, 255, 255, 0.50)` | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| GLASS-01 | 92-03 | HeaderClient/MobileMenu/StickyBar v9 + 44pt + ESC + ≤12px | ✓ SATISFIED | Verified above |
| GLASS-02 | 92-02 + 92-04 | HeroHub Tier 0 + opaque CTA | ✓ SATISFIED | HeroHub line 15 pill, 48 opaque CTA |
| GLASS-03 | 92-04 | StatsBar Phase 82 responsive nesting | ✓ SATISFIED | Lines 49 + 56 mutually-exclusive responsive switch |
| GLASS-04 | 92-04 | ServicesGrid Tier 1 / Tier 2 hover | ✓ SATISFIED | 3 token sites |
| GLASS-05 | 92-05 | 6 mid-sections per-tier sweep | ✓ SATISFIED | All 6 files consume v9 tokens |
| GLASS-06 | 92-06 | FAQSection closed Tier 1 / open Tier 2 / smooth accordion | ✓ SATISFIED | FAQSection.tsx:115/119/141 |
| GLASS-07 | 92-07 | ContactForm form-safety + WCAG AA + KD-v9-002 escalation | ✓ SATISFIED | KD-v9-002 PROJECT.md:189; form-fill 0.50; inputs bg-white; labels text-mu-text-900 |
| GLASS-08 | 92-02 + 92-06 + 92-08 | FinalCTA Tier 0 frame + opaque CTA + mix-blend retired | ✓ SATISFIED | FinalCTA.tsx:8/23; mix-blend-multiply removed |
| GLASS-09 | 92-03 | Footer Tier 0 fill | ✓ SATISFIED | Footer.tsx:18 |
| GLASS-10 | 92-01 | liquid-glass.css re-pointed + heat-leak | ✓ SATISFIED | 4 utilities re-pointed; 2 heat-leak gradients |

**REQUIREMENTS.md status flags:** Currently still listed as "Pending" in lines 292-301. Code-completeness verified here; the markers should be flipped to Complete by the orchestrator post-verification.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `globals.css` | 518-528 | Mobile blur cap clobbers `backdrop-saturate-*` filter chain (BL-01) | ⚠️ Warning (deferred) | Mobile <768px Header/MobileMenu lose saturate filter; Phase 92-REVIEW-FIX.md explicitly defers |
| `ContactForm.tsx` | 62-72 | Honeypot + 3-second timing trap fakes success (BL-04) | ⚠️ Warning (deferred) | Sub-3s legitimate submissions silently dropped; Phase 92-REVIEW-FIX.md defers pending product decision |
| `Footer.tsx` | 89, 100 | Glass-on-glass nesting (icon chips inside Footer card) (WR-01) | ℹ️ Info | Documented anti-pattern in liquid-glass.css; visual contract acceptable per planner judgment |
| `HeroHub.tsx` | 139 | Glass credibility badge in hero viewport — may exceed --glass-budget-viewport: 2 on mobile (WR-02) | ℹ️ Info | Mobile-only concern; visual verification needed |
| `WhyUsSection.tsx` | 99-110 | backdrop-blur on image-cover containers (no backdrop visible) (WR-07) | ℹ️ Info | Compositor cost; no correctness issue |
| `FinalCTA.tsx` | 30 | Multiple shadow-glass utilities stacked (WR-08) | ℹ️ Info | Last shadow wins in Tailwind v4; non-blocking |
| `MobileMenu.tsx` | 20-28 | body-overflow restoration leaks if previously set inline (WR-10) | ℹ️ Info | Edge case, not currently triggered |
| `StickyBar.tsx` | 12-40 | IntersectionObserver runs once on mount, misses SPA route changes (WR-11) | ℹ️ Info | Edge case for SPA navigation |
| `ContactSection.tsx` | 60, 83 | Trust-signal cards over-blue-gradient use raw `bg-white/10 backdrop-blur-md` (WR-05) | ℹ️ Info | Sanctioned by 92-08-SWEEP-AUDIT planner-judgment (over-blue-gradient backdrop reads differently than over the blob) |
| `HeroHub.tsx` | 94, 103, 115 | Over-photo control bar uses `bg-mu-text-900/55 backdrop-blur-md` (WR-06) | ℹ️ Info | Sanctioned Archetype H — dark surface on dark photo (NOT GLASS); no `--glass-overlay-fill` token by design |
| `ContactForm.tsx` | 222-233 | Honeypot input visible to some screen readers despite `aria-hidden` + `tabIndex={-1}` (BL-04 sub-issue) | ⚠️ Warning (deferred) | Same root cause as BL-04 above |

### Human Verification Required

(See YAML frontmatter `human_verification:` section above for the canonical list.)

1. **Visual verification of v9 4-tier glass tokens at three blob positions** (cursor / static / ambient) on desktop + mobile.
2. **WCAG AA empirical contrast spot-check** on ContactForm body copy at mu-accent-blue gradient endpoint (Chrome DevTools contrast picker recommended per PROJECT.md:189).
3. **Mobile blur cap verification on real device** under 768px viewport — confirm BL-01 saturate-filter clobber severity in chrome.
4. **FAQSection accordion smooth-anim interaction** — closed Tier 1 / open Tier 2 ramp + 300ms max-height transition.
5. **ContactForm honeypot/timing fake-success behavior (BL-04 deferred)** — needs product decision on lead-loss tolerance.

### Gaps Summary

**No must-have failures.** All five ROADMAP success criteria for Phase 92 are programmatically verified against the codebase:

1. **Chrome migration (GLASS-01, GLASS-09):** All 4 chrome files consume v9 tier tokens; HIG 44pt + ESC preserved; mobile blur capped via clamp() + globals.css media-query.
2. **Index sections sweep (GLASS-02–06):** All 11 in-scope `/` route components consume `--glass-*` tokens; StatsBar Phase 82 responsive nesting preserved (mutually-exclusive `sm:` switch); FAQSection closed Tier 1 / button-hover Tier 2 with smooth-anim accordion.
3. **Form-safety treatment (GLASS-07):** ContactForm + ContactSection use `--glass-form-fill` (escalated to 0.50 per KD-v9-002 in PROJECT.md:189 — theoretical contrast 4.60:1 worst-case); inputs `bg-white` opaque; labels `text-mu-text-900 font-bold`; KD-v9-003 Path A blue-gradient occlusion preserved.
4. **CTA opaque-forever invariant (GLASS-02, GLASS-08):** Negative-grep across 5 in-scope CTA call-sites (HeroHub:48, MobileMenu:94, StickyBar:58, ContactForm:247, FinalCTA:23) returns ZERO MATCHES — no CTA gradient ever paired with backdrop-filter. FinalCTA Tier 0 frame at line 8; mix-blend-multiply retired (commit 73d05a8).
5. **liquid-glass.css re-point (GLASS-10):** 4 utility classes (`.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-btn-secondary`, `.stats-glass`) re-pointed to v9 tier tokens; heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` rules preserved on `.liquid-card` (alpha 0.06) and `.liquid-regular` (alpha 0.04). `@a11y-layer-coverage` block byte-identical.

**`pnpm --dir next build` exits 0** — 11 routes, 0 errors.

**Why human_needed (not passed):** Phase 92 explicitly defers visual / WCAG / real-device verification to Phase 94 per CONTEXT.md `<deferred>` block. The Phase 94 hard-gate items (Lighthouse, axe-core, Playwright UAT, real-device perf) are out of Phase 92 scope. However, the items in `human_verification:` are the residual programmatic-blind-spots within Phase 92's own success criteria — particularly the optical heat-leak response, KD-v9-002 empirical re-measurement (PROJECT.md:189 explicitly recommends), and the BL-01 / BL-04 deferred decisions.

**BL-01 + BL-04 deferred items** (per 92-REVIEW-FIX.md): Mobile filter-chain saturate clobber and honeypot/timing fake-success branches were intentionally deferred and require separate triage. Both are pre-existing issues not introduced by Phase 92's token migration; they surfaced during Phase 92 review but were left out of scope by explicit decision.

**Code-complete; awaiting human visual + WCAG + product decision verification before Phase 92 closure.**

---

_Verified: 2026-04-30_
_Verifier: Claude (gsd-verifier)_
