---
audit_type: site-wide
contract: DESIGN.md (commit 633d3b6, root)
date: 2026-04-29
auditor: gsd-ui-auditor
overall_score: 11/24
status: blocked
---

# UI Review — Site-wide audit vs DESIGN.md

## Summary

Overall: **11/24** — `blocked`

The implementation diverges from the freshly-committed `DESIGN.md` contract on its two non-negotiable pillars: the **squircle system** is defined in CSS but is effectively **unused** (zero usages in production components — 0/130 visible rounded surfaces ship `.squircle-*`), and the **Apple Liquid Glass HIG hard constraints** (mobile blur ≤12px, ≤2 glass layers per viewport, `prefers-contrast` opt-out) are violated on every audited page. Color tokens are partially mapped, but the central Tailwind `--color-primary` is wired to shadcn's `#030213` instead of the brand green `#35B678` — a silent contract break that affects any consumer of `bg-primary` / `text-primary`.

| Pillar | Score | Verdict |
|--------|-------|---------|
| Copywriting | 3/4 | Tone clean and audience-appropriate; canonical 43/11 numbers drift on `/treatment-abroad` (still 100+/6). |
| Visuals | 1/4 | Squircle system shipped in CSS but zero adoption in components; mixed-rounded siblings everywhere; arbitrary radii outside the 8/16/24/40 scale. |
| Color | 2/4 | `--primary` token wired to shadcn default (`#030213`), not brand green; `bg-[#…]` and hardcoded `text-[#1A4D80]` drift; brand-blue hex literal used directly in 7 component files. |
| Typography | 3/4 | Manrope/Inter loaded, fluid clamp scale present, `text-wrap: balance` declared; but `globals.css` `h1/h2/h3` `@layer base` overrides ship `var(--text-2xl)` etc. instead of the design `--font-size-h1` clamp — heading sizes likely smaller than spec on default elements. |
| Spacing | 3/4 | Spacing scale tokens are present and used; some sections rely on arbitrary `lg:py-[6.25rem]` (=100px, equivalent to `spacing.10`+) instead of `--space-10`. |
| Experience Design | 1/4 | `prefers-contrast` opt-out missing entirely; mobile blur budget (≤12px) violated on every glass surface (24/40/60/80px in mobile viewport); ≤2 glass layers per viewport rule violated on every page (Hero alone ships 5+ glass surfaces + persistent header). |

## Top fixes (priority order)

1. **Wire `--primary` to brand green, not shadcn black.** `next/src/app/globals.css:76` declares `--primary: #030213`. The Tailwind theme block at line 254 maps `--color-primary` to this. Per DESIGN.md YAML `primary: "#35B678"` and `colors.primary` semantic alias, every `bg-primary` / `text-primary` consumer is rendering shadcn's default near-black, not the brand green. Fix: set `--primary: var(--mu-green-600)` (or `#35B678`), confirm CTA-related classes do not regress, and re-verify across all components that read `--color-primary`. **BLOCK — silent contract break, every consumer is wrong.**

2. **Adopt `.squircle-*` utilities in components, or formally retract the squircle mandate.** The system is fully implemented in `next/src/styles/squircles.css` (md/lg/xl/full live, sm scheduled) but has **zero consumers** in production components — Grep finds `squircle-` only in `test-glass/page.tsx` (fixture) and `AdvantagesGrid.tsx` (single match in a comment). Meanwhile 130 occurrences of plain `rounded-*` Tailwind ship across 46 files. DESIGN.md states "Plain CSS `border-radius` rounding is forbidden in components" — currently 100% of visible rounded UI violates this. Fix: phased migration (cards first, then buttons, then badges) using `.squircle-lg` / `.squircle-md` / `.squircle-full`, paired with the `inset` shadow border pattern. **BLOCK — non-negotiable contract rule violated everywhere.**

3. **Enforce mobile blur budget and per-viewport glass layer count.** DESIGN.md hard constraints: ≤12px blur on viewports <768px, ≤2 glass elements per viewport. Current state: HeroHub ships `backdrop-blur-3xl` (64px), `backdrop-blur-2xl` (40px), `backdrop-blur-[40px]`, `backdrop-blur-[20px]` on five distinct surfaces in the hero alone (badge pill, hero frame, secondary frame, two floating badges) — plus the persistent Header glass = 6 layers in viewport on mobile, all over 12px blur. MobileMenu uses `backdrop-blur-[80px]`. ServicesGrid stacks glass cards with glass-icon-chip children = nested glass (forbidden anti-pattern in `liquid-glass.css:52`). Fix: add `md:backdrop-blur-2xl backdrop-blur-[12px]` responsive guards or migrate offending surfaces to `.liquid-*` utilities (which already have the `prefers-reduced-motion` blur=8px clamp), then trim the Hero composition to a single glass card + Header. **BLOCK — every page exceeds budget.**

## Findings by pillar

### Copywriting (3/4)

- [FLAG] `next/src/app/treatment-abroad/page.tsx:16,23` — Description and OG description say "100+ клиник в 6 странах" / "100+ клиник, 500+ врачей". Canonical PROJECT.md numbers are **43 клиники, 11 стран**. `SOCIAL_PROOF_ITEMS` (line 29) also ships "100+" / "клиник". Already a known TODO in PROJECT.md, but logged here for tracking — every `/treatment-abroad` consumer sees inconsistent counts vs the index hero `Клиники в 11 странах` (HeroHub.tsx:107) and the OG description on `/` ("43 клиники, 11 стран").
- [FLAG] `next/src/app/consultations/page.tsx:179-184` — `SocialProof` ships "7 стран / 50+ врачей / 15+ специализаций". This matches PROJECT.md "Online consultations" sub-stats, so it is internally consistent on this page, but a casual reader cross-referencing to `/` (43/11) or to the StatsBar (43/11/500+/15+) sees four different number scales. Not a contract violation, but a copywriting consistency risk.
- [PASS] Hero copy across all 4 pages reads as project-tone-compliant: спокойное, медицинское, без агрессии. `Европейские врачи, мировые клиники` (index), `Мнение немецкого врача — за 5 дней, без перелёта` (consultations), `Проверьте здоровье в Samsung Medical Center и Severance Hospital — за 1–2 дня` (checkup), `Организуем лечение за границей` (treatment) — all factual, none are clickbait. Subject+verb nbsp-binding (`мы\u00A0берём`, `Вам остаётся`) appears consistent.
- [PASS] Footer/Header CTA labels (`Обсудить мой случай`, `Записаться на консультацию`, `Подобрать программу`, `Получить план лечения`) are specific to context, not generic "Submit/OK/Click here" patterns.
- [PASS] Form validation copy lives behind `errors.X` keys (ContactForm.tsx) — error display structure exists, role="alert" attached for screen readers.
- [FLAG] `next/src/components/sections/HeroHub.tsx:23-31` — h1 splits across `<span>` and `<br className="hidden md:block">` with em-dash + non-breaking space separator. The `&mdash;{' '}` after `мировые клиники` ends the first span, then `<br>` breaks (desktop), then a gradient span for `доступны из Казахстана`. On mobile (no break), the em-dash dangles at line end — visually weak but tolerable. Not a contract break.

### Visuals (1/4)

- [BLOCK] **Squircle system has zero adoption.** Grep `squircle-(sm|md|lg|xl|full)` returns 4 file matches: `next/src/styles/liquid-glass.css` (2 — comments), `next/src/styles/squircles.css` (15 — definition), `next/src/app/test-glass/page.tsx:4` (test fixture), `next/src/components/sections/AdvantagesGrid.tsx:1` (single match — appears to be a comment/import, not a class binding). Production sections, layout, ui — none use `.squircle-*`. DESIGN.md `Shapes` section: "Plain CSS `border-radius` rounding is forbidden on visible UI surfaces." Current violation count: **130 plain `rounded-*` occurrences across 46 files** including all buttons, cards, badges, avatars, modals, glass pills.
- [BLOCK] **Mixed-rounded siblings everywhere — anti-pattern #6.** Examples:
  - `next/src/components/sections/HeroHub.tsx` — single component ships `rounded-full` (badge pill, line 15), `rounded-3xl` (CTA buttons, lines 48, 56), `rounded-[3rem]` (hero image, line 73), `rounded-[2.5rem]` (secondary image, line 86), `rounded-[2rem]` (floating badges, lines 98, 113), `rounded-2xl` (icon chips, lines 99, 114). Six different radii on adjacent elements.
  - `next/src/components/sections/StatsBar.tsx:16` — `rounded-[2.5rem]` (40px) outside the tokenized 8/16/24/40 scale (it equals `xl`/40px exactly but bypasses the token).
  - `next/src/components/sections/ServicesGrid.tsx:102,105,116,126,141,165` — six different radii inside one card family: `rounded-[3rem]`, `rounded-[2rem]`, `rounded-2xl`, `rounded-full`, `rounded-2xl`. Per DESIGN.md "All buttons squircle. All cards squircle. No mixed siblings."
- [BLOCK] **Anti-pattern #1 (border on squircle/masked element) is structurally embedded.** Cards, glass buttons, and pills currently combine `border border-glass-border` + `rounded-[X]` + `bg-white/Y backdrop-blur-Z`. When the squircle migration lands, every one of these `border-` declarations will be clipped by `mask-image` and disappear. Examples (sample of dozens): `MobileMenu.tsx:38,52,60,69,82`, `StickyBar.tsx:44`, `Footer.tsx:89,100`, `FinalCTA.tsx:33`, `HeroHub.tsx:15,98,113`, `ServiceHero.tsx:35,73`, `ServicesGrid.tsx:86,116,126,141`, every `consultations/Consultation*.tsx` file, every `checkup/Checkup*.tsx` file, every `treatment/Treatment*.tsx` file. Migration will silently break borders unless replaced with `box-shadow: inset 0 0 0 1px ...` (a `border-inset-glass` utility already exists in `globals.css:314`).
- [BLOCK] **Anti-pattern #3 (`filter: drop-shadow()` on glass ancestor) is shipping in 13 places.** Tailwind `drop-shadow-sm` is `filter: drop-shadow(...)`. Found at:
  - `Footer.tsx:23`, `service/SocialProof.tsx:21`, `FinalCTA.tsx:16`, `StatsBar.tsx:18`, `WhyUsSection.tsx:16,33,50,67,84,111`, `HeroHub.tsx:24`. Several of these (`StatsBar.tsx:18`, `WhyUsSection.tsx:33,50,67,84`) are on heading children of glass ancestors (`bg-white/60 backdrop-blur-2xl` containers). Per `liquid-glass.css:36` and DESIGN.md anti-pattern #3, this breaks `backdrop-filter` on children — known regression that was originally fixed in commit ba29f8a and is now reintroduced. Live verification blocked (Next dev server not running on standard ports).
- [FLAG] `next/src/components/sections/StatsBar.tsx:14-24` — Glass card with no rotating element, but the icon child rotation pattern `group-hover:rotate-3` shows up in `ProcessSection.tsx:93`, `ServicesGrid.tsx:116`, `consultations/ConsultationAdvantages.tsx:17,36,55,74,93`, `consultations/ConsultationBenefits.tsx:15,28,41,54`, `treatment/TreatmentAboutUs.tsx:16,32,50,69`, `checkup/CheckupAdvantages.tsx:16,29,42,55`, `checkup/CheckupProblem.tsx:16,29,42`, `ProblemSection.tsx:105`. None of these are squircle elements *yet*. When migrated, `transform: rotate()` on a `.squircle-*` element distorts the mask (anti-pattern #4). Safe today, will break post-migration.
- [BLOCK] `next/src/components/ui/badge.tsx:8` — `rounded-4xl` Tailwind utility (resolves via `@theme inline --radius-4xl: calc(var(--radius) * 2.6)` ≈ 26px). Outside the rounded scale entirely. Should be `.squircle-full` per DESIGN.md badge spec.
- [FLAG] `next/src/components/ui/button.tsx:25,26,30,32` — Buttons use `rounded-[min(var(--radius-md),10px)]` arbitrary calc. The DESIGN.md button-primary spec is `rounded.md` = 16px → `.squircle-md`. Current implementation diverges to a 10px-clamped value.

### Color (2/4)

- [BLOCK] `next/src/app/globals.css:76` — `--primary: #030213;` (shadcn dark). DESIGN.md YAML: `primary: "#35B678"`. Then `globals.css:254` maps `--color-primary: var(--primary)`. Every consumer of `bg-primary`, `text-primary`, `border-primary` Tailwind class renders shadcn dark, not brand green. PROJECT.md Key Decision row "Separate --color-cta from --color-primary" already deferred this (the green `--color-cta: #35B678` lives at line 172), so the production shipped components use `bg-mu-green-600` or `--color-cta` and skip the broken `--primary`. But `next/src/components/ui/*` (button, card, dialog, etc. — ported from shadcn registry) DO consume `bg-primary` (`button.tsx:7` references `bg-primary`-derived variables). Anyone using `<Button variant="default">` from `ui/button.tsx` ships shadcn dark, not brand green. **Net: brand parity is broken on shadcn-derived components.**
- [BLOCK] **Hardcoded hex in component className** (Tailwind arbitrary values for color):
  - `next/src/app/contacts/page.tsx:23` — `from-[#F0F7FF] to-white`
  - `next/src/app/contacts/page.tsx:25` — `text-[#18212C]`
  - `next/src/components/sections/AdvantagesGrid.tsx:77` — `bg-[#F0F7FF]`
  - `next/src/components/sections/GuideGrid.tsx:64` — `bg-[#FFF8F0]`
  - `next/src/components/sections/GuideGrid.tsx:84` — `text-[#1A4D80] hover:text-[#18212C]`
  - `next/src/components/sections/contacts/ContactsHero.tsx:12` — `to-[#38C6F4]` (gradient end matches `--mu-blue` exactly but bypasses token)
  All trace to existing tokens (`--color-bg-blue: #F0F7FF`, `--color-bg-cream: #FFF8F0`, `--color-primary-dark: #1A4D80`, `--color-text-primary: #18212C`, `--mu-blue: #38C6F4`) — the values are correct, the indirection is broken.
- [FLAG] **Brand blue hex literal `#38C6F4` and `#35B678` used directly in 89 occurrences across 7 component files** (`AdvantagesGrid.tsx`, `ClinicsSection.tsx`, `GuideGrid.tsx`, `ConsultationDoctors.tsx`, `treatment/TreatmentClinics.tsx`, `treatment/TreatmentAboutUs.tsx`, `contacts/ContactsHero.tsx`). All inside SVG illustrations as `stroke=` / `fill=` attributes. Live brand value — but bypasses the token system. Acceptable for SVG `<line>`/`<rect>` attributes per DESIGN.md "pixel-pick from the live site" rule, but a Key Decision row should record this exemption explicitly.
- [FLAG] Country-flag SVGs in `ClinicsSection.tsx` and `treatment/TreatmentClinics.tsx` use national flag colors hard-coded (`#DD0000`, `#FFCE00`, `#0038B8`, `#E30A17`, `#138808`, etc.) — these are not brand colors, they are flag spec colors. Acceptable; not a contract violation.
- [PASS] `--mu-*` token block in `globals.css:20-66` matches DESIGN.md YAML brand-blue, brand-black, brand-white, green ramp, text scale, accents, accessible CTA gradient. Tokens are properly mirrored.
- [PASS] Tailwind `@theme inline` block at `globals.css:209-310` exposes every `--mu-*` as `--color-mu-*` for `bg-mu-blue` / `text-mu-green-600` etc. — the brand consumption pattern is correct in production sections.
- [BLOCK] **Glass-tint dark-mode block missing.** `liquid-glass.css:643-668` covers `.section-tint-cool/warm/mint` for dark mode. But DESIGN.md "Dark mode glass-off" rule (line 560) says "When `[data-theme="dark"]` is active, `backdrop-filter` is disabled on most surfaces." Neither `liquid-glass.css` nor `globals.css` contains a `[data-theme="dark"] .liquid-* { backdrop-filter: none }` block — only the `.dark` selector for token cascade. The "glass-off" rule is documented but not implemented in CSS. This is a regression vs the v1.4 Key Decision row.

### Typography (3/4)

- [PASS] Two font families wired in `globals.css:16-17` via `--font-family-body-next` / `--font-family-heading-next` (Next/font pipeline) with fallback chain to system fonts.
- [PASS] DESIGN.md YAML scale matches `globals.css:160-163` declarations: `--font-size-h1: clamp(2.5rem, 5vw, 3.5rem)`, `--font-size-h2: clamp(1.75rem, 3.5vw, 2.75rem)`, `--font-size-h3: clamp(1.375rem, 2.5vw, 2rem)`. Numbers correct.
- [BLOCK] `globals.css:350-369` — The base `h1`/`h2`/`h3`/`h4` rules in `@layer base` set `font-size: var(--text-2xl/xl/lg/base)` and `font-weight: var(--font-weight-medium)` (500). But DESIGN.md YAML demands h1=clamp(2.5rem,5vw,3.5rem) at weight 800. This means:
  - **A bare `<h1>` element** without explicit Tailwind classes renders at `text-2xl` (1.5rem) / weight 500 — far below spec.
  - Production sections (HeroHub, ServicesGrid) work-around with explicit `text-5xl md:text-6xl font-extrabold` classes, but every page that ships a default heading inherits the wrong size.
  - The override exists because shadcn ports expect this behavior, but the base override silently breaks the typography contract. Fix: either remove the `@layer base` h1-h4 size resets or wire them to `--font-size-h1` instead of `--text-2xl`.
- [FLAG] **Distinct font sizes in component classes: 296 occurrences across 50 files** spanning `text-xs` → `text-7xl`. Spec covers display/h1/h2/h3/body-lg/body-base/body-sm/caption (8 tokens). Tailwind scale exposes ~12 distinct sizes that components are picking from. Notable inflation: `text-5xl`/`text-6xl` (HeroHub:23, StatsBar:18, WhyUsSection:16, FinalCTA:16, ServicesGrid:91) are all "h1-display" magnitude but mid-section. Spec assigns `display`/`h1` to "Hero titles, section openers" — multiple section H2s currently render at h1/display scale.
- [FLAG] `globals.css:380-394` — `label`, `button`, `input` base rules set `font-size: var(--text-base)`. `--text-base` is Tailwind's default 1rem (16px), but DESIGN.md `body-base` is **1.125rem (18px)** for ≥45 audience. Inputs render at 16px, not 18px. Tested via mobile viewport 45+ heuristic: 16px is at the floor of accessibility for that audience (DESIGN.md Layout note "do not compress below the values in the YAML schema").
- [PASS] `text-wrap: balance` available — verified declared in heading components but check is not blanket. DESIGN.md "Apply `text-wrap: balance` to every heading" — `HeroHub.tsx:23` lacks `text-balance`; `treatment-abroad/page.tsx:25` ContactsHero h1 has `text-balance` (acceptable pattern).
- [PASS] Self-hosted Inter + Manrope WOFF2 confirmed by Key Decision row in PROJECT.md and `--font-family-body-next` Next/font integration.

### Spacing (3/4)

- [PASS] `--space-1` … `--space-10` declared in `globals.css:197-205` as 8px / 16px / 24px / 32px / 40px / 48px / 64px / 80px — exact match to DESIGN.md YAML spacing scale.
- [PASS] Container width pinned at `--container-content: 1200px` (line 287) — matches DESIGN.md Layout.
- [PASS] Section paddings use `py-12 lg:py-16` or `py-16 relative z-10` patterns (ServicesGrid:82, StatsBar:10) — these resolve to 48/64px which match `spacing.6`/`spacing.8`. Acceptable.
- [FLAG] **Arbitrary value `lg:py-[6.25rem]` (=100px) in 4 files**: `AdvantagesGrid.tsx:77`, `GuideGrid.tsx:64`, plus implied via `--section-padding-desktop: 6.25rem`. DESIGN.md spacing tops out at `spacing.10 = 80px`. The 100px is documented as "Section padding (desktop)" in `globals.css:205` (`--section-padding-desktop`) but **the token isn't in the YAML scale** — `spacing.10` (80px) is the contract. Either log a Key Decision for 100px desktop section padding or migrate to 80px.
- [FLAG] `next/src/components/sections/ServicesGrid.tsx:99,124,138,165` — Internal card padding `p-8` (32px = `spacing.4`), then `space-y-4 mb-8 flex-grow` (16px gap, 32px bottom — `spacing.2` and `spacing.4`). Mostly compliant. But hardcoded gaps like `gap-2 mb-3` (`StatsBar.tsx:18`) duplicate token values rather than referencing them — fine because Tailwind's default scale matches MOST of DESIGN.md, but doesn't enforce future drift.
- [FLAG] Multiple components ship `min-h-section-hero-rich`, `min-h-section-hero-medium` — these `--section-h-hero-*` clamps (`globals.css:65-67`) are tokenized but their values don't appear in the DESIGN.md YAML. Custom layer extension; acceptable but undocumented.

### Experience Design (1/4)

- [BLOCK] **`prefers-contrast` opt-out missing.** Grep across `next/src` returns zero occurrences of `prefers-contrast`. DESIGN.md "Mandatory accessibility opt-outs" table requires: "Increase border opacity (rgba(255,255,255,0.95)+) and text contrast to AAA." Not implemented anywhere. PROJECT.md Audit Baseline already flagged this: "prefers-contrast is wired but not visually verified" — actual state is **not wired at all**. Verified across `liquid-glass.css`, `liquid-depth.css`, `globals.css`, `squircles.css`.
- [BLOCK] **Mobile blur budget violations.** Live verification blocked (Next.js dev server not running on standard ports — port 3000 ran an unrelated "OrgBoard" Next app, port 8080 served the legacy vanilla site). Static analysis confirms violations in source:
  - `next/src/components/layout/MobileMenu.tsx:52` — `backdrop-blur-[80px]` on the open mobile menu nav (mobile-only by `lg:hidden`). 80px ≫ 12px budget = **6.7×over**.
  - `MobileMenu.tsx:38` — `backdrop-blur-xl` (24px) on the mobile menu trigger. 2× over.
  - `StickyBar.tsx:44` — `backdrop-blur-3xl` (64px) on the persistent mobile sticky bar. 5.3× over.
  - `HeroHub.tsx:73,86,98,113` — `backdrop-blur-3xl` / `backdrop-blur-2xl` / `backdrop-blur-[40px]` on hero photos and floating badges. The hero is mobile-visible. All violations.
  - `liquid-glass.css:88,200,246,319` — base `.liquid-regular` / `.liquid-card` / `.liquid-fluted` / `.liquid-btn-secondary` ship `var(--liquid-blur-md) = 24px` with no mobile media query downscale. The `prefers-reduced-motion` block (line 717) clamps to 8px on motion-reduced — but no `@media (max-width: 767px)` clamp. **Every glass surface in mobile viewport is over budget.**
- [BLOCK] **Glass-layer-per-viewport budget violations.** Mobile viewport 375×812:
  - **Index `/`** initial viewport: Header (1) + HeroHub badge pill + hero photo frame + secondary photo frame + 2 floating badges = **6 layers** (3× over budget of 2).
  - **`/services` ServicesGrid** initial viewport: Header (1) + section eyebrow pill (1) + 1-2 visible card surfaces (each card is glass) + their floating icon chips = **4-6 layers** (2-3× over budget). DESIGN.md "Stack glass on glass" violation: cards are glass, icon chips inside cards are also glass = nested glass, which is anti-pattern in `liquid-glass.css:52`.
  - **All Consultation* / Checkup* / Treatment* sections** ship 4 glass icon-chip cards per row + section-eyebrow glass pill + Header = 5+ layers.
- [BLOCK] **`prefers-reduced-motion` opt-out incomplete on shimmer.** `liquid-glass.css:735` hides `.shimmer-sweep::before` — good. But Tailwind classes like `transition-all`, `transition-transform`, `transition-colors` (296 occurrences across 31 files), `group-hover:translate-x-1`, `group-hover:scale-110`, `group-hover:rotate-3`, `group-hover:-translate-y-2` (ServicesGrid, ConsultationAdvantages, ConsultationBenefits, TreatmentAboutUs, CheckupAdvantages, CheckupProblem, ProblemSection) are NOT covered by the `transform: none` rule — only `animation-duration` and `transition-duration` are zeroed. DESIGN.md "Use `prefers-reduced-motion` with `duration: 0` only — also strip `transform`. Otherwise scroll-reveal snaps from offset." `globals.css:415-431` strips animation/transition durations only. Hover-scale/rotate transforms still fire on motion-reduced.
- [FLAG] `next/src/components/motion/ScrollReveal.tsx` (used on every page) — by name implies framer-motion or similar; live verification of `prefers-reduced-motion` honoring blocked. If component doesn't internally check `useReducedMotion()`, scroll-reveal will fire snap-from-offset on motion-reduced users.
- [BLOCK] **Anti-pattern #3 violations (`drop-shadow` on glass ancestors)** repeated from Visuals pillar — they belong here too because they break the glass *experience* (children backdrop-filter stops blurring). 13 instances listed in Visuals. Live verification blocked.
- [PASS] `prefers-reduced-transparency` is implemented in `liquid-glass.css:768-829` and `liquid-depth.css:638` — disables backdrop-filter and replaces with opaque white/dark. Good.
- [PASS] `prefers-reduced-motion` partially implemented (`globals.css:415`, `liquid-glass.css:717`, `liquid-depth.css:560`) — animation-duration/transition-duration zeroed, glass blur clamped to 8px. Falls short on transform-strip only.
- [PASS] Form has `role="alert"` on error messages (`ContactForm.tsx:154,177,202,237`) — accessible error announcement.
- [FLAG] Live audit limited: Next.js dev server is not running on detectable ports. Could not validate browser-side computed styles, glass surface counts in actual viewports, or screenshot the rendered Next app. **Live findings deferred to next audit pass when Next dev server is up.**

## Live audit (Playwright)

**Status:** PARTIAL — Next.js dev server not detected on port 3000 (unrelated "OrgBoard" Next app present), 5173, 8000, 8080 (legacy vanilla site). Live capture and computed-style probing of the audited Next.js project at `next/` was not possible in this session.

Screenshots: `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/audit-screenshots/`
- `legacy-vanilla-desktop.png` (10.8MB) — port 8080 reference, NOT the audited code.
- `legacy-vanilla-mobile.png` (5.2MB) — port 8080 reference, NOT the audited code.

The audited Next.js project lives in `next/` and would need its own dev server (`pnpm --dir next dev` or `npm --prefix next run dev`) on a free port. Suggested re-run protocol:
1. Start the Next.js dev server explicitly: `cd next && PORT=3100 pnpm dev`.
2. Re-run the gsd-ui-auditor with `BASE_URL=http://localhost:3100`.
3. Validate computed `backdrop-filter` values per glass element via `getComputedStyle(el).backdropFilter` and confirm the static-analysis findings above.

### Findings from live capture (legacy port 8080 reference site)

The captured screenshots show the legacy v1.4 vanilla HTML/CSS site, which is the visual *target* the Next.js port aims to match. They are not the system under test. Reference observations:
- Legacy site uses pill-shape buttons (radius ≈ 100px) and 30px card radius — the Next.js port has diverged to `rounded-3xl`/`rounded-[3rem]` (24/48px). Visual rhythm is no longer 1:1 with the reference.
- Legacy hero is single-glass-element (one card on cream/white). Next.js hero ships 5+ glass elements. Visual "calmness" the project tone demands has been lost.

## Live Audit (Playwright)

Captured: 2026-04-29 — http://localhost:3001 (Next.js dev server, MedicusUnion KZ, verified 200). The earlier "Live audit (Playwright) PARTIAL" section above is preserved as historical record. This section augments — it does not replace — the static findings; pillar scores stand at **11/24**.

### Capture protocol

- Driver: `playwright` (chromium, headless), invoked from a Node script (`/tmp/medicus-live-audit.cjs`) wired against the cached Playwright in `~/.npm/_npx/705bc6b22212b352/node_modules/playwright`. Equivalent to the requested `mcp__playwright__*` flow — `mcp__playwright__*` tool surface was not available in this session, but every step from the live-capture protocol was reproduced one-for-one.
- Pages: `/`, `/consultations`, `/checkup`, `/treatment-abroad`. Viewports: 1440×900 desktop, 375×812 mobile. 8 full-page screenshots + one reduced-motion variant.
- Per page+viewport, ran the requested in-page evaluator: total elements, rounded count, squircle count, radius distribution, glass elements (with `backdropFilter`, position, in-viewport flag), drop-shadow on glass ancestors, distinct rendered colors, distinct font sizes, computed `var(--primary)`.
- Reduced-motion: `chromium.newContext({ reducedMotion: 'reduce' })` — captured `transitionDuration` / `animationDuration` / `transform` on 113 candidate elements.

### Screenshots

| Viewport | Page | File |
|---|---|---|
| 1440×900 | / | `.planning/audit-screenshots/desktop-index.png` (4.4 MB) |
| 1440×900 | /consultations | `.planning/audit-screenshots/desktop-consultations.png` (2.5 MB) |
| 1440×900 | /checkup | `.planning/audit-screenshots/desktop-checkup.png` (2.7 MB) |
| 1440×900 | /treatment-abroad | `.planning/audit-screenshots/desktop-treatment-abroad.png` (2.3 MB) |
| 375×812 | / | `.planning/audit-screenshots/mobile-index.png` (2.4 MB) |
| 375×812 | /consultations | `.planning/audit-screenshots/mobile-consultations.png` (1.0 MB) |
| 375×812 | /checkup | `.planning/audit-screenshots/mobile-checkup.png` (1.2 MB) |
| 375×812 | /treatment-abroad | `.planning/audit-screenshots/mobile-treatment-abroad.png` (1.0 MB) |
| 1440×900 | / (reducedMotion) | `.planning/audit-screenshots/desktop-index-reduced-motion.png` (0.9 MB) |

Raw computed-style data: `.planning/audit-screenshots/audit-data.json` (256 KB).

### Computed-style evidence per page

`rounded` = elements with non-zero `border-top-left-radius`. `squircle` = elements with `squircle-(sm|md|lg|xl|full)` class. `glass viewport` = elements with non-`none` `backdrop-filter` whose bounding box intersects the viewport. `--primary` = `getComputedStyle(probe).color` where `probe.style.color = 'var(--primary)'`.

#### / (index)

| Metric | Desktop 1440×900 | Mobile 375×812 |
|---|---|---|
| total DOM elements | 868 | 868 |
| rounded elements | **124** | **124** |
| squircle elements | **0** | **0** |
| glass total in DOM | 95 | 95 |
| glass IN VIEWPORT | **6** | **5** |
| drop-shadow on glass ancestors | 0 | 0 |
| distinct rendered colors (rgb) | 21 | 21 |
| distinct font sizes | 10 (14, 16, 18, 20, 24, 30, 36, 48, 56, 60 px) | 10 (12, 14, 16, 18, 20, 24, 30, 34.5, 36, 48 px) |
| distinct font weights | 400, 500, 600, 700, 800 | 400, 500, 600, 700, 800 |
| computed `--primary` | **`rgb(3, 2, 19)` = #030213** | **`rgb(3, 2, 19)` = #030213** |

Radius distribution (px count): `40px`×15, `32px`×9, `52px`×23, `20px`×28, `24px`×4, `48px`×1, `14px`×3, `18px`×1, `6px`×8, `3.35e7px`×30 (= `rounded-full`), plus two ellipse radii (`57% 48%` / `52% 48%`). **8 distinct numeric radii** on a single page — DESIGN.md scale is 4 (8/16/24/40 px). The values 52px and 6px are entirely outside the contract scale.

**Hero on mobile — glass layers in initial viewport:**

| # | tag | rect (xy w×h) | backdrop-filter | className head |
|---|---|---|---|---|
| 0 | DIV | 0,0 375×812 | **`blur(40px) saturate(1.8)`** | `absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]` — full-viewport glass overlay |
| 1 | HEADER | 16,16 343×70 | **`blur(40px) saturate(1.5)`** | fixed Header glass |
| 2 | BUTTON | 298,29 44×44 | **`blur(28px) saturate(1.88) brightness(1.015)`** | mobile menu trigger (.liquid-btn or similar) |
| 3 | DIV | 16,176 343×55 | **`blur(28px) saturate(1.88) brightness(1.015)`** | hero badge pill (`bg-white/40 …`) |
| 4 | A | 16,796 343×62 | **`blur(44px) saturate(2.15) contrast(1.035) brightness(1.025)`** | sticky bottom CTA (`bg-white/50`) |

= **5 glass surfaces in 375×812**, all blur values **28–44 px**. Budget per DESIGN.md is **≤2 surfaces, ≤12 px blur on <768px**. Violations: layer count 2.5× over, blur 2.3–3.7× over.

Note: layer **[0]** is a full-bleed `inset-0` 40px-blur overlay covering the entire viewport — present on every page. This is a single architectural surface that by itself blows the mobile blur budget for everything painted under it. Static finding [BLOCK] re. mobile blur is **confirmed live and is per-page, not per-section**.

#### /consultations

| Metric | Desktop | Mobile |
|---|---|---|
| total DOM | 710 | 710 |
| rounded | 93 | 93 |
| squircle | **0** | **0** |
| glass viewport | 3 | 4 |
| drop-shadow on glass ancestors | 0 | 0 |
| distinct colors | 20 | 20 |
| distinct font sizes | 9 (14, 16, 18, 20, 24, 30, 36, 48, 60) | 9 (14, 16, 18, 20, 24, 30, 36, 48, 60) |
| computed `--primary` | #030213 | #030213 |

Radius distribution (desktop): `40`×20, `32`×11, `20`×22, `52`×4, `48`×1, `14`×3, `18`×1, `rounded-full`×29. **7 distinct radii**. The mobile radius set replaces 40/52 with 28 px — yet another value outside scale.

#### /checkup

| Metric | Desktop | Mobile |
|---|---|---|
| total DOM | 803 | 803 |
| rounded | 107 | 107 |
| squircle | **0** | **0** |
| glass viewport | 4 | 5 |
| drop-shadow on glass ancestors | 0 | 0 |
| distinct colors | 18 | 18 |
| distinct font sizes | 9 | 9 (incl. **12 px**) |
| computed `--primary` | #030213 | #030213 |

Radius distribution (desktop): `40`×27, `32`×13, `20`×12, `52`×20, `48`×1, `14`×3, `18`×1, `rounded-full`×28. **7 distinct radii**, 52 px and 6 px both off-scale (6 px is on form inputs / focus outlines).

#### /treatment-abroad

| Metric | Desktop | Mobile |
|---|---|---|
| total DOM | 657 | 657 |
| rounded | 72 | 72 |
| squircle | **0** | **0** |
| glass viewport | 4 | 5 |
| drop-shadow on glass ancestors | 0 | 0 |
| distinct colors | 22 | 22 |
| distinct font sizes | 8 | 10 (incl. **12 px**) |
| computed `--primary` | #030213 | #030213 |

### Findings cross-referenced with static audit

| Static finding | Static line(s) | Live evidence | Status |
|---|---|---|---|
| `--primary` wired to shadcn dark, not brand green | line 29, 62 | Computed `var(--primary)` returns `rgb(3, 2, 19)` = `#030213` on **all 4 pages, both viewports** — confirmed | **CONFIRMED LIVE** |
| Squircle adoption = 0 | line 31, 48 | `squircle-(sm|md|lg|xl|full)` element count = **0** across all 8 page+viewport runs (rounded-element count = 124 / 93 / 107 / 72) — confirmed | **CONFIRMED LIVE** |
| Mobile blur ≤ 12 px budget violated | line 33, 102–107 | Mobile / hero ships 5 glass surfaces with blur **28 / 28 / 28 / 40 / 44 px** + a full-viewport `blur(40px)` overlay layered behind all of them. Mobile /checkup, /treatment-abroad: 5 layers each. | **CONFIRMED LIVE — worse than static estimate (full-viewport overlay was not counted statically)** |
| ≤2 glass per viewport rule | line 33, 108–111 | Mobile glass-in-viewport: index 5, consultations 4, checkup 5, treatment 5. Desktop: 6 / 3 / 4 / 4. Every page ≥ 2× budget; index 2.5–3× over. | **CONFIRMED LIVE** |
| Mixed-rounded radii | line 49–52 | Index page ships **8 distinct numeric radii** (6, 14, 18, 20, 24, 32, 40, 48, 52 px + `rounded-full` ellipse). DESIGN.md scale is 4 (8/16/24/40). 52 px and 6 px are entirely off-scale; 14/18/20/32/48 are in the Tailwind scale but not the DESIGN.md scale. | **CONFIRMED LIVE** |
| `text-xs` (12 px) below 45+ floor | line 86 | 12 px appears in mobile font-size set on /, /checkup, /treatment-abroad. Desktop set starts at 14 px. DESIGN.md `body-base` is 18 px for ≥45 audience. | **CONFIRMED LIVE — mobile-specific** |
| Multiple H2s rendering at h1/display scale | line 85 | Desktop / shows 56 px and 60 px font sizes alongside 48 px h1. 48/56/60 px in one page = three near-identical "display" magnitudes. | **CONFIRMED LIVE** |
| `drop-shadow` on glass ancestors (anti-pattern #3) | line 54–55 | Live `dropShadowOnGlassAncestors` = **0 on every page+viewport**. The static audit found 13 source-level occurrences of `drop-shadow-sm` on glass ancestors, but live computed `filter: drop-shadow(...)` was not detected with a glass-class descendant on the rendered DOM. | **NOT REPRODUCED LIVE — re-investigate.** Possible causes: (a) Tailwind 4 emits `drop-shadow-sm` as `--tw-drop-shadow` text-shadow combo without a `filter:` declaration, (b) the static-graph parent/child relationship doesn't materialise in DOM (e.g. `drop-shadow` is on a heading whose container is glass *via different DOM path*), (c) elements with `drop-shadow` are below the fold. The static-source defect remains valid; the live blast-radius is smaller than estimated. |
| `prefers-reduced-motion` strips duration but not transform | line 112 | Reduced-motion run: `transitionDuration: 1e-05s`, `animationDuration: 1e-05s` on all 113 sampled elements (good). `transform: 'none'` initially (good — no scroll-reveal offset baked in). **However** `group-hover:scale-110` / `group-hover:rotate-3` / `group-hover:translate-x-1` classes still resolve their hover transforms when the user hovers — Playwright cannot trigger hover non-interactively here, but the static finding stands: hover transforms are NOT inside the `prefers-reduced-motion` block. | **PARTIALLY CONFIRMED — initial render is clean; hover is still un-stripped.** |
| Page-level number drift 100+/6 vs canonical 43/11 | line 39 | Live text scrape: `/` shows "43 клиник", "11 стран" repeatedly. `/checkup` shows "43 клиник", "11 стран". `/treatment-abroad` shows **"100+ КЛИНИК", "500+ ВРАЧ"** — drift confirmed visually in StatsBar / hero stats on the rendered page. `/consultations` shows "7 СТРАН / 50+ ВРАЧ / 15+ СПЕЦИАЛИЗАЦ" (sub-stats variant). | **CONFIRMED LIVE — visible on rendered page** |

### NEW findings from live capture

- **[NEW BLOCK] Full-viewport `backdrop-blur-[40px]` overlay element on every page.** Computed: `<div class="absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]">` covers the entire 375×812 (and 1440×900) viewport on all 4 pages. This is *layer 0* of the glass stack and applies a 40 px backdrop-filter to **everything painted underneath it**. Since every other glass surface (Header, hero pill, CTA, cards) sits *on top* of this layer, the rendered effect double-blurs lower content. On mobile this is **3.3× the 12 px budget** before any other glass is counted. Static audit did not catch this because the class lives in a layout/wrapper component, not in the section components grepped. Suggested location to investigate: a top-level `Layout` / `Background` / `Atmosphere` wrapper rendering this `inset-0` div.
- **[NEW FLAG] Single `border-top-left-radius` ellipse value `57% 48%` / `52% 48%` appears on every page.** This indicates an SVG or `border-radius: 57% 48% / 52% 48%` blob shape (common for hero background "blob" decoration). It is not on the contract radius scale and not inherently wrong (decorative blob), but it is undocumented and adds to the radius-zoo count. Likely lives in a `BackgroundBlobs` / `HeroBackground` component.
- **[NEW BLOCK] Off-scale 52 px radius is heavily used.** `52 px` (≈3.25 rem) appears 23 times on `/` desktop, 20 times on `/checkup` desktop, 4 times on `/consultations` desktop, 2 times on `/treatment-abroad` desktop. DESIGN.md scale tops at 40 px. Likely source: `rounded-[3.25rem]` or `rounded-[52px]` arbitrary classes. Static audit caught `rounded-[3rem]` (=48 px) and `rounded-[2.5rem]` (=40 px) but did not enumerate 52 px specifically — a third off-scale arbitrary value is shipping.
- **[NEW BLOCK] 6 px radius shipping on `/` (×8 occurrences).** Also off-scale (DESIGN.md min is 8 px). Likely on form `<input>` / `<select>` border-radius or on tiny SVG decoration. The site uses 6/14/18/20/24/32/40/48/52 px = **9 distinct radii**, none of which form a coherent "8/16/24/40" scale.
- **[NEW BLOCK] Distinct rendered color count 18–22 per page.** DESIGN.md color YAML defines roughly: brand-blue, brand-green ramp (3-4 stops), brand-black, brand-white, text scale (3 stops), 3 accent colors, 2 backgrounds, glass borders ≈ 12 distinct colors. Live count is 18–22 per page (rgb form, deduped, transparent excluded). Difference of 6–10 colors per page = drift / one-off colors (likely from `text-[#1A4D80]`, `bg-[#F0F7FF]`, `to-[#38C6F4]` arbitrary values flagged statically + SVG illustration colors). Confirms color-pillar inflation live.
- **[NEW PASS] `--primary` is identical across all 4 pages.** No accidental override. The single fix at `globals.css:76` is the entire surface area for the brand-primary repair — once flipped, all 8 viewport variants will switch in lockstep.
- **[NEW PASS] Reduced-motion initial render is clean** — `transform: none` on all 113 sampled animated elements after page settle, transition/animation durations clamped to `1e-05s`. Scroll-reveal does not snap from offset on motion-reduced (one of the fears in static finding line 112). The remaining gap is hover-state transforms only.
- **[NEW FLAG] Hero on `/` mobile: `<a>` element at y=796 with blur(44px)** — this is the sticky bottom CTA bar. Combined with Header (y=16) and full-bleed overlay, the user sees blur top, blur bottom, blur full-bleed *plus* the in-content glass pill — **the entire mobile viewport is glass-on-glass**, no opaque resting surface. Apple HIG explicitly prohibits this composition pattern.
- **[NEW FLAG] desktop / shows `font-size: 56 px` and `60 px`** — two distinct "display" sizes within 4 px of each other. 56 px is `text-5xl` (3.5 rem * 16) and 60 px is `text-6xl` * scale; both used in the same render. Visual hierarchy noise.

### Verdict update

The static score **11/24** stands. Live evidence:
- **Strengthens** every BLOCK finding from Visuals and Experience Design pillars (squircle 0%, glass count over budget, mobile blur over budget, --primary wrong, mixed radii).
- **Surfaces an additional architectural BLOCK** (full-viewport `inset-0 backdrop-blur-[40px]` overlay) that the static audit missed — this should be the *first* fix because it short-circuits any per-component blur-budget cleanup downstream.
- **Refines one finding downward**: live `drop-shadow on glass ancestors` count is 0 (vs static's 13 source-level occurrences). The source-level defect is still real and worth fixing as a future-proofing measure, but the *live blast-radius* is smaller than the static analysis implied. No score change since this finding was not the dominant driver of the Experience Design score.

Items requiring human-judgment review (not addressable by the live capture):
- Brand "feel" / visual calmness vs the legacy site (subjective; legacy reference screenshots on file).
- Russian copy tone (audited statically; no automated check).
- Whether the 52 px / 6 px radii are intentional brand exceptions or drift.
- Whether the full-viewport blur overlay is a deliberate atmospheric choice (e.g. Apple HIG "Material" treatment) or accidental layering.

Out of scope for this live re-run:
- Hover-state transforms under `prefers-reduced-motion` (Playwright default-context did not exercise hover).
- Form submission / Directus API integration.
- `/admin/*` and `/test-glass` routes.

## Out of scope (noted but not audited)

- `.planning/research/*.md` — phase 79 WIP, not audited.
- 12 modified `next/src/**` files in working tree — phase 79 WIP, code deltas not yet committed; the audit applies to the committed state on `feat/v3.1`.
- Print stylesheet rules (`@media print` in `liquid-glass.css:528` and `squircles.css:97`) — present and reviewed at glance, not stress-tested.
- `next/src/app/test-glass/page.tsx` — test fixture, excluded from production scoring.
- `next/src/app/admin/*` — internal admin UI, separate audience and contract.
- Form submission behavior (Directus integration, validation, anti-spam) — out of UI-review scope.

## Files Audited

- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN.md` (the contract)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/PROJECT.md`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/CLAUDE.md`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/globals.css`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/styles/squircles.css`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/styles/liquid-glass.css`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/page.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/consultations/page.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/checkup/page.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/app/treatment-abroad/page.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/HeroHub.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/StatsBar.tsx`
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/components/sections/ServicesGrid.tsx`
- Grep audits across `next/src/**/*.tsx` for hex literals, Tailwind arbitrary color, `rounded-*`, `squircle-*`, `backdrop-(filter|blur)`, `drop-shadow`, `prefers-reduced-*`, `prefers-contrast`, font-size/font-weight Tailwind classes, page numbers (43/11, 100+/6, 7/50+/15+).
- Live Playwright capture of http://localhost:3001/, /consultations, /checkup, /treatment-abroad at 1440×900 and 375×812 (2026-04-29). Computed-style data persisted to `.planning/audit-screenshots/audit-data.json`.

## UI REVIEW COMPLETE

`/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/UI-REVIEW.md`
