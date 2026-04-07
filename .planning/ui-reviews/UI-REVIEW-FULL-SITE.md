# UI Review — Full Site Audit (post Phase 32)

**Audited:** 2026-04-06
**Baseline:** DESIGN-SYSTEM.md + 6-pillar standards
**Pages:** index.html (1167), online-consultations.html (868), treatment-abroad.html (953), checkup.html (820), contacts.html (342), 404.html (215)
**Method:** Code audit (Tailwind class scan + string scan) + visual capture (Playwright on http://localhost:8080)
**Screenshots:** 23 captured in `.planning/ui-reviews/full-site-20260406-132115/`
**Auditor:** gsd-ui-auditor (Claude Opus 4.6, 1M context)

This is a fresh, full-site re-audit replacing the 2026-04-05 review. Phase 32 (accessible tokens, focus-visible, CTA gradient) has shipped, so a11y baseline is now solid. This audit focuses on the **remaining gaps** that the prior review could not see and on issues that surfaced AFTER tokens were corrected.

---

## Executive Summary

| Metric | Value |
|--------|------:|
| Overall site score | **17/24** |
| Pages audited | 5 production + 1 secondary (404) |
| Cross-cutting issues found | 8 |
| Visual blockers (mobile + desktop) | 4 |
| Quick wins (<1 hr each) | 6 |
| Strategic improvements | 3 |

The site is in solid shape after Phase 32. Glassmorphism execution is consistent, focus-visible works, the WCAG-AA token set is wired up, and Russian typography (`&nbsp;` binding) is meticulously handled. The remaining defects are concentrated in three areas: (1) **content-data drift** between pages (two different Vienna addresses, two different ТОО spellings), (2) **off-system code** in `treatment-abroad.html` (hardcoded SVG hex strokes, emoji icons in stat bar), and (3) **two intermediate-viewport overflow bugs** (checkup hero headline clips on 1024–1440px, mobile sticky bar overlaps hero trust line). None of these are catastrophic but every one is the kind of detail a 45+ user notices and that erodes the "European medical company" trust signal.

---

## Pillar Scores (site-wide)

| Pillar | Score | Key Finding |
|--------|:----:|-------------|
| 1. Copywriting | **4/4** | Specific, calm, conversion-focused. RU nbsp binding executed thoroughly. No generic CTAs. |
| 2. Visuals | **2/4** | `treatment-abroad.html` hero photo (close-up syringes) is anxiety-inducing for 45+ medical audience. `checkup.html` H1 clips on 1024–1440px viewports. |
| 3. Color | **3/4** | Tokens are correct post-Phase 32; accent palette is disciplined. BUT `treatment-abroad.html` has 25+ hardcoded `#38C6F4` / `#35B678` / `#047857` strings in inline SVGs that bypass the token system. |
| 4. Typography | **3/4** | Type scale is reasonable (12 sizes used: xs→8xl, but xs and 8xl are 1–2 occurrences each — effectively 7 sizes). Weight discipline is perfect (4 weights, all justified). Heading H1 collisions on checkup page knock this down from 4. |
| 5. Spacing | **3/4** | 4/8px scale adherence is strong. Arbitrary values (88×`[2.5rem]`, 55×`[3rem]`, 22×`[2rem]`) are explicit-by-convention and consistent across pages. ONE bug: `main.pb-8` doesn't account for the 75px sticky mobile bar. |
| 6. Experience Design | **2/4** | Forms are clean, focus rings work, motion-safe is wired up. BUT: data drift between pages (2 different addresses, 2 different ТОО spellings), mobile sticky bar overlap, missing live form validation feedback for 45+ users (no visible "valid" state, only error). |

**Overall: 17/24** (Average: 2.83/4)

Sub-page totals (informal, weighted by issue density):
| Page | Score | Notes |
|------|:----:|------|
| index.html | 18/24 | Solid execution; minor mobile sticky overlap |
| online-consultations.html | 18/24 | Cleanest service page |
| treatment-abroad.html | **14/24** | Hero photo, hardcoded SVG colors, address mismatch, emoji stat bar |
| checkup.html | 15/24 | Hero H1 overflow at 1024–1440px is a real visual bug |
| contacts.html | 19/24 | Cleanest page; good form layout |
| 404.html | 19/24 | Simple, on-brand, accessible |

---

## Top 5 Cross-Cutting Issues (≥2 pages)

### 🔴 1. Data drift between pages — different Vienna addresses & company name
**Where:**
- `index.html:1082` — `MedicusUnion GmbH · Bruno-Marek-Allee 20/50, 1020 Wien, Austria`
- `treatment-abroad.html:867` — `MedicusUnion GmbH · Billrothstrasse 78, 1190 Vienna, Austria`
- `index.html:1083` — `ТОО «MedicusUnion KZ»` (no space)
- `treatment-abroad.html:866, 826` — `ТОО «Medicus Union KZ»` (with space)
- JSON-LD on index.html:72 hardcodes `Bruno-Marek-Allee` so SEO/structured data agrees with index but disagrees with treatment-abroad's visible footer.

**User impact:** A 45+ user comparing pages — or a regulator — will spot the contradiction and lose trust instantly. Medical sector + cross-border = single-source-of-truth for legal entities is non-negotiable.

**Fix:** Pick one canonical address (the JSON-LD on index.html says `Bruno-Marek-Allee 20/50, 1020 Wien` — use that everywhere, or update JSON-LD to whichever is correct). Then `sed -i` propagate to all 5 footers. Same for ТОО name. Estimated effort: 15 minutes.

### 🔴 2. `treatment-abroad.html` bypasses the design-token system
**Where:** `treatment-abroad.html:215, 216, 226–229, 239–243, 253–257` — 25 inline SVG `<path stroke="#38C6F4">`, `stroke="#35B678">`, `fill="rgba(56,198,244,0.1)">` instances. Plus `treatment-abroad.html:752` uses `stroke="#047857"` (emerald-700, **not** brand `--mu-green-600 #35B678`).

**User impact:** When you change the brand blue or green tokens, this page silently won't update. The `#047857` is straight-up off-palette — visible mismatch with the rest of the page.

**Fix:**
```html
<!-- Replace -->
<circle stroke="#38C6F4" fill="rgba(56,198,244,0.1)" .../>
<!-- With -->
<circle stroke="currentColor" class="text-mu-blue" fill="currentColor" fill-opacity="0.1" .../>
```
And on line 752, change `stroke="#047857"` → `stroke="var(--mu-green-600)"`. ~20 lines, ~10 minutes.

### 🟡 3. Mobile sticky bar overlaps content
**Where:** All 5 pages — `main.pb-8` (32px). Sticky bar is `bottom-4` + `p-3` + `~52px button height` = ~80px tall. Visible in screenshot `index-mobile-sticky.png`: the bar covers the hero trust-line text "MedicusUnion GmbH, Австрия · ТОО в Казахстане · ISO 27001 · 43 клиники".

**User impact:** Content-CTA collision on mobile, exactly the viewport where 45+ KZ users land. The trust signals are obscured by the CTA itself.

**Fix:** In all 5 pages, change `main` class:
```diff
- <main id="page-content" class="relative z-10 flex flex-col gap-8 md:gap-16 pb-8">
+ <main id="page-content" class="relative z-10 flex flex-col gap-8 md:gap-16 pb-28 lg:pb-8">
```
Adds 112px (28 * 4px) bottom padding on mobile, reverts to 32px on `lg:` where the sticky bar is hidden. 5 edits, 5 minutes.

### 🟡 4. Inconsistent footer copy across pages
**Where:**
- `index.html:1082-1083` — Full footer with both legal entities + addresses (4 lines)
- `online-consultations.html:783-785` — Single line `Международный медицинский сервис. Австрия · Казахстан`
- `treatment-abroad.html:864-867` — Three lines, includes (different!) Vienna address
- `checkup.html` — likely yet another variant
- `contacts.html:273-275` — Two lines, omits address entirely

There are essentially **5 different footer "Company" column variants** on 5 pages.

**User impact:** Looks like 5 different sites stitched together. The footer is the trust anchor — it should be byte-identical (or template-included) across all pages.

**Fix:** Either (a) extract footer to a JS-included partial (`fetch + innerHTML` on DOMContentLoaded), or (b) write a build-step `sed` script that syncs all 5 footers from a master file. Option (a) is more maintainable. Estimated effort: 1–2 hours.

### 🟡 5. Emoji icons in `treatment-abroad.html` stat bar — off-brand
**Where:** `treatment-abroad.html:181, 186, 191, 196` — `🏥`, `👨‍⚕️`, `📅`, `❤️` rendered as `<div class="text-4xl">` content.

**User impact:** Emoji are vendor-rendered (Apple/Google/Windows render them very differently), color-bombed, and contextually casual. The rest of the site uses meticulous custom Lucide-style stroked SVGs with brand colors. This stat row looks like a 2014 newsletter wedged into a 2026 medical platform.

**Fix:** Replace with the same SVG icon pattern used in `index.html:278-294` Stats section. Re-use the existing `bg-mu-blue/10 ... rounded-2xl` icon-tile pattern. ~30 minutes.

---

## Top 3 Quick Wins

1. **Address & ТОО name unification** (Issue #1) — 15 min, fixes a credibility blocker.
2. **Mobile sticky bar padding fix** (Issue #3) — 5 min, fixes a visible mobile UX bug on every page.
3. **Replace emoji stat bar on treatment-abroad** (Issue #5) — 30 min, removes the most visually jarring element on the site.

## Top 3 Strategic Improvements

1. **Footer template extraction** (Issue #4) — Stop manually maintaining 5 divergent footer copies. Either client-side fetch-and-inject, or a build-step Tailwind/HTML partial. Will pay for itself within one content update.
2. **Replace `treatment-abroad.html` hero photo** — The current `hero-treatment-abroad.webp` shows close-up syringes/needles. For an audience that includes oncology/cardiology patients evaluating where to fly for treatment, this is the wrong emotional cue. Replace with a clinic interior, smiling care team, or international team photo (matching the hero compositions on index.html and online-consultations.html). The visual asset is the issue; CSS is fine.
3. **Form-field success/valid state feedback** — Currently the forms only show errors (red border, error span). For a 45+ audience submitting medical inquiries, a positive "valid" tick (e.g. `border-mu-green-600` + checkmark on blur after valid input) would reassure users that their input was accepted before they hit submit. Apply on all 5 forms.

---

## Per-Page Findings

### index.html (18/24)

**Strengths:**
- Hero composition with overlapping doctor + patient images + floating "43 clinics" / "15+ years" cards is the strongest visual on the site.
- 11-section narrative arc (Hero → Stats → Services → Problem → Process → Why Us → Clinics → Platform → Reviews → FAQ → Contact) is well-paced and conversion-aware.
- `&nbsp;` binding is exhaustive; no orphan widows visible in screenshots.
- JSON-LD MedicalBusiness schema (lines 52–136) is thorough.

**Issues:**
- 🟡 `index.html:201` — Hero is `min-h-screen flex items-center` on mobile, which on a 375×812 viewport pushes the floating image collage below the fold. Mobile fold shows mostly text + the trust-line (which the sticky bar then covers). Consider `min-h-[80vh] lg:min-h-screen` to give mobile users a glimpse of the doctor photo above the fold.
- 🟡 `index.html:198` — `pb-8` insufficient for mobile sticky bar (cross-cutting Issue #3).
- 🔵 `index.html:212` — `text-5xl md:text-6xl lg:text-7xl xl:text-8xl` is a 4-step responsive ladder. The `xl:text-8xl` (96px) is rare across the site (only 2 occurrences total). At ≥1280px the headline becomes uncomfortably large for the column width and competes with the hero image. Consider capping at `lg:text-7xl`.
- 🔵 `index.html:54` vs 1080 — Logo text is `text-2xl font-bold` in header (24px) and `text-3xl font-extrabold` (30px) in footer. Consistent footer-heavier branding is fine, but the gap between bold (700) and extrabold (800) is small enough that the sizing difference is what reads, not the weight. Pick one weight for the wordmark.
- 🔵 `index.html:1042` — H2 "Не откладывайте решение о здоровье" is `text-4xl md:text-5xl lg:text-6xl` — the tone "не откладывайте" is slightly more urgent than the rest of the page's calm voice. Consider "Готовы обсудить ваше здоровье?" or similar.

### online-consultations.html (18/24)

**Strengths:**
- Hero is the cleanest of the service pages — single image, no overlap collage, headline fits cleanly at all viewports.
- Pricing card (`:530-560`) has a clear single-price anchor (`от 450 €`) with a 5-bullet "what's included" list. Best pricing UX on the site.
- "Когда имеет смысл получить второе мнение" trigger list (`:482-520`) is well-targeted at 45+ decision-making patterns.

**Issues:**
- 🟡 `online-consultations.html:127-131` — Hero H1 wraps "Мнение немецкого врача — / за 5 дней, без перелёта". On 1440px desktop the line "врача —" sits alone with the em-dash dangling. Either bind `немецкого&nbsp;врача` or restructure as "Мнение / немецкого врача — / за 5 дней".
- 🟡 `online-consultations.html:331-361` — Country flag SVGs are inlined as raw `viewBox 0 0 48 32` rectangles. They render but look like geometric shapes more than flags. A user not knowing what each shape is (German tricolor with rounded corners on a 48×32 swatch?) won't recognize half of them. Either use a real icon font (e.g. `circle-flags`) or omit the visual cue and lean on the country names.
- 🔵 `online-consultations.html:140` — Secondary CTA "Узнать, подходит ли мой случай" is good copy but the link target `#triggers` jumps users *up* the page (triggers section is later but still above pricing/form). Verify scroll behavior.
- 🔵 `online-consultations.html:295, 301, 307` — Step number `text-6xl ... opacity-20` decorative numerals overlap with the Step heading on narrow viewports. Consider `text-5xl sm:text-6xl` or absolute-positioning them so heading text never collides.

### treatment-abroad.html (14/24)

**Strengths:**
- 4-step process cards with timing badges ("2--4 дня", "7--10 дней", "По плану лечения", "Долгосрочно") are the strongest "what to expect" UX on the site.
- The "Что включено" 6-card grid (`:436-485`) with role icons + 1-line descriptions is scannable and conversion-aware.

**Issues:**
- 🔴 `treatment-abroad.html:163-171` — **Hero image is wrong tone for the audience.** Close-up of syringes/needles. For a page selling international cancer/cardiology treatment to anxious 45+ patients, this triggers fear, not confidence. Replace with a hospital interior, doctor-patient consultation, or international team photo. (Strategic improvement #2.)
- 🔴 `treatment-abroad.html:215-260` — 25× hardcoded brand hex strings in inline SVGs (cross-cutting Issue #2). All other pages use `stroke="currentColor"` + Tailwind text color classes; this one page silently bypasses the token system.
- 🔴 `treatment-abroad.html:752` — `stroke="#047857"` (emerald-700, NOT brand green). Visibly off-palette.
- 🔴 `treatment-abroad.html:181, 186, 191, 196` — Emoji stat icons (cross-cutting Issue #5).
- 🔴 `treatment-abroad.html:866-867` — Vienna address says `Billrothstrasse 78, 1190 Vienna` while index/JSON-LD says `Bruno-Marek-Allee 20/50, 1020 Wien` (cross-cutting Issue #1).
- 🟡 `treatment-abroad.html:498, 524, 550, 572` — Step duration badges use English-style hyphens ("2--4 дня") instead of en-dash ("2–4 дня"). The HTML source has literal `--` not `&ndash;`. The rest of the site uses `&ndash;` (e.g. `index.html:172` `Пн&ndash;Пт`, `checkup.html` `1&ndash;2&nbsp;дня`).
- 🟡 `treatment-abroad.html:447` — Same `2--3 клиник` typewriter dash bug.
- 🟡 `treatment-abroad.html:180-200` — Stat bar has 3 nested `text-` font sizes (text-4xl emoji + text-lg heading + text-sm subhead) with no real hierarchy difference vs. other stat bars on index that use `text-5xl md:text-6xl` for the number. Inconsistent component reuse.

### checkup.html (15/24)

**Strengths:**
- Clinic-name brand callouts (Samsung Medical Center, Severance Hospital) anchored to specific Korean institutions add credibility.
- Pricing/program cards with "Базовая / Премиум" tiers and explicit USD ranges build budget confidence.
- B2B section (`:504-554`) for corporate checkups is a smart secondary funnel that no other page has.

**Issues:**
- 🔴 `checkup.html:128-132` — **Hero H1 visibly clips on 1024–1440px viewports.** The headline reads "Проверьте здоровье в [gradient]Samsung Medical Center и Severance Hospital[/gradient] — за 1–2 дня". On 1440px the gradient line is too long and overflows behind the right-column hero image. Captured in `checkup-fold-desktop.png` and `checkup-fold-mobile.png`. Tablet (768px) and ultra-wide (1920px) render correctly. **Fix:** Add a responsive `<br>` after "Samsung Medical Center и" or shorten the gradient phrase to "корейских и турецких клиниках" with the brand names moved to a subtitle.
- 🟡 `checkup.html:170-184` — Stats counter card numbers (`43`, `11`, `1–2`, `ISO`) — the 4th card uses `ISO` as the "number" with subtitle `27001`, breaking the visual rhythm of the first three (digits → label). Consider `01` `02` step-style or `27001` as the number with `ISO standard` as label.
- 🟡 `checkup.html:642` — Form heading H2 "Узнайте всё о своём здоровье за 1–2 дня" is `text-4xl md:text-5xl` while the page H1 is `text-5xl md:text-6xl lg:text-7xl`. The H2 is too close to the H1 in weight/size. Drop H2 to `text-3xl md:text-4xl`.
- 🔵 `checkup.html:113` — Hero is `min-h-[80vh]` on mobile while index is `min-h-screen`. Inconsistency. Pick one (`min-h-[80vh]` is the better choice for fold balance).
- 🔵 `checkup.html` form label "Направление" with options "Южная Корея / Турция / Не определился" — the 3rd option "Не определился" is masculine-only. The placeholder name on every form is "Айгуль" (female). Change to "Пока не выбрал(а)" or "Помогите выбрать".

### contacts.html (19/24)

**Strengths:**
- Cleanest page on the site. 2-column info-left/form-right is the right pattern for a contact page.
- Coordinator card with photo + name + role + 1-sentence reassurance (`:131-141`) is the strongest trust card on the entire site. This pattern should be reused on the index.html contact section (it almost is — see `index.html:923-947`).
- Trust badges (4 pills: `На связи 24/7`, `ISO 27001`, `Astana Hub Resident`, `10 000+ пациентов`) on `:177-194` are well-balanced.
- `aria-current="page"` on the nav link (`:68`, `:95`) — the only page that does this consistently. **All other pages should adopt this pattern.**

**Issues:**
- 🟡 `contacts.html:117` — H1 is just the word "Контакты" with the gradient. Compared to other pages where H1 carries the value proposition ("Мнение немецкого врача — за 5 дней"), this is a missed opportunity. Consider "Свяжитесь с нами — координатор ответит за 24 часа".
- 🟡 `contacts.html:165` — Office line says "Астана, Казахстан" but `index.html:1083` and footer say "Алматы". Which is the actual office? Another data drift.
- 🔵 `contacts.html:172` — "Пн–Пт 9:00–18:00" — the en-dash and time format are correct, but missing timezone. KZ has 2 zones (Almaty UTC+5, West KZ UTC+5). Add `(Алматы)` or `UTC+5`.
- 🔵 `contacts.html:208` — Privacy line "Мы перезвоним в течение 24 часов. Ваши данные защищены." — the second sentence is generic. Replace with concrete "Шифруем по ISO 27001, не передаём третьим лицам" to match the rest of the site's specificity.

### 404.html (19/24)

**Strengths:**
- Simple, on-brand, gradient 404 number, single primary CTA back to home.
- Reuses header/footer/sticky-bar exactly — proves the components are reusable in principle.

**Issues:**
- 🔵 `404.html:108` — H1 "Страница не найдена" is `text-3xl font-extrabold`. All other H1s on the site are `text-5xl md:text-6xl lg:text-7xl`. The 404 should match — make the H1 prominent.
- 🔵 `404.html:110` — Body text "Возможно, страница была перемещена или удалена." is the only generic copy on the entire site. Replace with: "Эту страницу либо перенесли, либо она ещё не появилась. Откройте главную или напишите координатору."

---

## Cross-Cutting Findings (full picture)

### Color Discipline (3/4)
- **Token usage** is correct for ~98% of color references. Tailwind classes resolve to brand tokens via `@theme inline` mapping in `theme.css:128-160`.
- **Accent overuse:** `text-mu-blue-text` appears 97 times — appropriate (the canonical text-link color).
- **Hardcoded hex outside SVG flags:** Only `treatment-abroad.html` violates this (25 SVG strokes + 1 emerald-700). All other pages use `currentColor` + Tailwind classes.
- **Country flag SVGs** in `online-consultations.html:331-361` and `treatment-abroad.html:326-420` use literal flag colors (#000, #DD0000, #FFCC00 for Germany, etc.) — this is acceptable since flags MUST be their actual colors, but the rendering is geometric and flag-like-only-if-you-already-know-the-flag.

### Typography (3/4)
- **Sizes used:** 12 distinct sizes — `text-xs` (1×), `text-sm` (191×), `text-base` (24×), `text-lg` (124×), `text-xl` (62×), `text-2xl` (44×), `text-3xl` (10×), `text-4xl` (52×), `text-5xl` (53×), `text-6xl` (24×), `text-7xl` (5×), `text-8xl` (2×). Effective scale: ~7 sizes (text-xs and text-8xl are accidents).
- **Weights used:** 4 — `font-medium` (435×), `font-bold` (230×), `font-extrabold` (205×), `font-semibold` (49×). Discipline is excellent — no `font-light` / `font-black` / `font-thin` ad-hoc usage.
- **H1/H2 hierarchy:** Most pages H1 is `text-5xl md:text-6xl lg:text-7xl` (good). H2 is usually `text-4xl md:text-5xl` (good). H3 is `text-xl font-extrabold` or `text-2xl font-bold` (some inconsistency between cards).
- **Russian typography:** `&nbsp;` binding is the strongest in the codebase. Subject+verb pairs, units (43&nbsp;клиник, 15+&nbsp;лет), prepositions (за&nbsp;границей, в&nbsp;течение), em-dash bindings — all consistent. Recent commits show this was a deliberate, audited pass. **This pillar would be 4/4 if not for the typewriter `--` dashes in treatment-abroad.html.**

### Spacing (3/4)
- **Top 5 spacing utilities:** `px-6` (144×), `p-8` (126×), `px-4` (123×), `mb-4` (105×), `gap-2` (105×). All multiples of 4px. Healthy.
- **Arbitrary radius values:** `rounded-[2.5rem]` (88×), `rounded-[3rem]` (55×), `rounded-[2rem]` (22×), `rounded-[3.5rem]` (7×). These are explicit-by-convention (40px, 48px, 32px, 56px) — consistent across all card patterns. Acceptable as a "design dialect" since they're applied uniformly.
- **Arbitrary sizes for mesh blobs:** `[60vw]`, `[50vw]`, `[70vw]`, `[120px]`, `[40px]` — all on the animated mesh background, all consistent across pages.
- **The one bug:** `main.pb-8` on all 5 pages, which is 32px while the mobile sticky bar is ~80px tall. Cross-cutting Issue #3.
- **Vertical rhythm:** Sections use `py-16` (~64px) consistently. Hero uses `pt-32 pb-16` (128/64). Footer uses `py-16 p-12` for the inner card. Good.

### Experience Design (2/4)
- **Form UX:** All 5 forms have `novalidate` + JS validation. Fields have `aria-live="polite"` error spans. Honeypot inputs for spam. Good.
- **Form feedback gap:** No visible "valid" state. 45+ users benefit from a checkmark on blur after typing a valid name/phone — current UX only shows errors. Strategic improvement #3.
- **Mobile menu:** Implemented as a fixed overlay with `aria-expanded` toggle. Standard, accessible.
- **FAQ accordion:** `<button>` with `aria-expanded` — accessible. `max-height: 500px` cap on `.faq__answer.is-open` could clip very long FAQ answers (the longest one I see is ~250 chars, fits comfortably).
- **Sticky mobile CTA bar:** Implemented but causes the cross-cutting overlap (Issue #3).
- **Reduced motion:** `theme.css:303-312` correctly suppresses animations for `prefers-reduced-motion: reduce`. Good.
- **Focus rings:** `theme.css:235-244` defines focus-visible rings on all interactive elements. Good (Phase 32 work).
- **Touch targets:** All CTAs are `py-4` (32px) or `py-5` (40px) on `px-8` — touch target is comfortably ≥44px. Footer links are smaller (`text-mu-text-700` font-medium) but at `space-y-3` (12px gaps) they meet WCAG 2.5.8.

### Visuals (2/4)
- **Hero photo on `treatment-abroad.html`** is the single biggest visual issue on the site (close-up syringes for an anxious cancer/cardiology audience).
- **Hero H1 overflow on `checkup.html`** at 1024–1440px is a real visual bug.
- **All other heroes** are well-composed with overlapping cards, floating badges, and decorative borders. The glassmorphism execution is consistent and looks like the Redesign/ prototype (verified visually).
- **Mesh backgrounds** with 3 blob layers + 40px backdrop-blur are implemented consistently across all 5 pages. Good.
- **Icon system:** Custom Lucide-style stroked SVGs everywhere — except the 4 emojis on treatment-abroad's stat bar (Issue #5).

### Copywriting (4/4)
- Tone is calm, specific, conversion-focused. No "Click Here" / "Submit" / "Learn More" generic CTAs.
- CTAs are case-specific: "Обсудить мой случай бесплатно", "Получить план лечения", "Подобрать программу".
- Trust signals are concrete (43 clinics, 11 countries, 15+ years, 10 000+ patients) not vague.
- FAQ answers are 1–2 sentences, direct, no marketing fluff.
- The single weak copy spot is the 404 page subtitle (Issue noted above). One typo-style issue: `treatment-abroad.html` uses literal `--` instead of `&ndash;` in step durations.

---

## Recommended Action Plan (ROI-ranked)

| # | Action | Effort | Impact | ROI |
|---|--------|:-:|:-:|:-:|
| 1 | Fix mobile sticky bar `pb-8` → `pb-28 lg:pb-8` on all 5 pages | 5 min | High (visible mobile bug) | ★★★★★ |
| 2 | Unify Vienna address + ТОО name across all pages + JSON-LD | 15 min | High (trust/credibility) | ★★★★★ |
| 3 | Replace `treatment-abroad.html` emoji stat bar with SVG icons (copy from index.html stats) | 30 min | High (off-brand) | ★★★★★ |
| 4 | Replace 25 hardcoded SVG hex strokes in `treatment-abroad.html` with `currentColor` + Tailwind classes | 30 min | Medium (token discipline) | ★★★★ |
| 5 | Fix typewriter `--` → `&ndash;` in `treatment-abroad.html` (`2--4 дня` etc.) | 10 min | Medium (typography polish) | ★★★★ |
| 6 | Fix `checkup.html` H1 overflow on 1024–1440px viewports | 30 min | High (visual bug) | ★★★★ |
| 7 | Replace `treatment-abroad.html` hero photo (syringes → clinic interior or team) | 1 hr (asset sourcing) | High (emotional tone) | ★★★ |
| 8 | Fix Astana vs Алматы office address inconsistency (`contacts.html:165` vs `index.html:1083`) | 10 min | Medium (data drift) | ★★★ |
| 9 | Fix `online-consultations.html` H1 line break (em-dash dangles on "врача —") | 5 min | Low (polish) | ★★★ |
| 10 | Add `aria-current="page"` to all nav links on every page (currently only contacts.html does this) | 20 min | Medium (a11y + active state) | ★★★ |
| 11 | Improve 404.html — bigger H1, less generic copy | 15 min | Low (rare page) | ★★ |
| 12 | Footer template extraction (5 footers → 1 source) | 1–2 hr | High (long-term maintainability) | ★★ |
| 13 | Add valid-state checkmark on form fields | 1–2 hr | Medium (45+ UX) | ★★ |
| 14 | Replace country-flag inline SVGs with a real flag icon set | 1 hr | Low (cosmetic) | ★ |

**Recommended GSD phase scope:** items 1–6 + 8 + 9 + 10 = ~2.5 hours of work, addresses every 🔴/🟡 issue. Item 7 (hero photo replacement) is a separate asset task.

---

## Files Audited

**Production HTML pages:**
- `/Users/mikhail/Projects/Medicus_video_consult-landing/index.html` (1167 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/online-consultations.html` (868 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/treatment-abroad.html` (953 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/checkup.html` (820 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/contacts.html` (342 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/404.html` (215 lines, skim)

**Design system:**
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/theme.css` (312 lines, fully read)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/fonts.css` (17 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/src/styles/index.css` (12 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/DESIGN-SYSTEM.md` (skimmed first 150 lines for token reference)

**Screenshots captured (Playwright on http://localhost:8080):**
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/ui-reviews/full-site-20260406-132115/`
  - `index-{desktop,mobile,fold-desktop,fold-mobile,mobile-sticky}.png`
  - `online-consultations-{desktop,mobile,fold-desktop,fold-mobile}.png`
  - `treatment-abroad-{desktop,mobile,fold-desktop,fold-mobile}.png`
  - `checkup-{desktop,mobile,fold-desktop,fold-mobile,wide-desktop,tablet}.png`
  - `contacts-{desktop,mobile,fold-desktop,fold-mobile}.png`
  - 23 PNGs total, ~28 MB on disk, gitignored via `.planning/ui-reviews/.gitignore`

**Audit scripts run:**
- Font-size class enumeration across all pages
- Font-weight class enumeration
- Spacing class top-40 frequency
- Arbitrary `[Npx]` / `[Nrem]` value enumeration
- Brand color class frequency (top 40)
- Hardcoded hex/rgb scan (excluded flag SVGs)
- Tap target audit on `tel:` links
- Emoji scan
- Form ID duplicate check
- Address/ТОО name consistency check across all pages

---

## Notes for Future Audits

1. **The dev server discovery issue:** Port 3000 was serving a different project (Dubai Off-Plan Analytics, Next.js 404). The real MedicusUnion server was on port 8080. Future audits should `curl http://localhost:$port` and check the `<title>` before assuming the server. The auditor's `<screenshot_approach>` block hardcodes port 3000 as the first try — recommend updating it to scan for `<title>MedicusUnion`.
2. **Why this audit changed scores vs the 2026-04-05 review:** Phase 32 (accessible tokens, focus-visible, CTA gradient) shipped on 2026-04-05. The previous audit was pre-Phase 32 and cited those token issues as 1/4 a11y. The current state has a11y at solid baseline; the issues that remain are content-data drift, off-system code in one page, and two visual overflow bugs.
3. **The `.planning/ui-reviews/.gitignore`** correctly excludes `*.png` so the 28 MB of screenshots will not be committed.
