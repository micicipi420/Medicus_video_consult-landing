---
phase: 92
slug: glass-rework-chrome-index-sections
status: draft
shadcn_initialized: true
preset: project-internal (next/src/components/ui/* + DESIGN.md YAML)
created: 2026-04-30
language: ru
milestone: v9.0
scope: contract-only (visual + interaction contracts; tokens locked in Phase 90, FROZEN)
---

# Phase 92 — UI Design Contract

> Контракт визуального и интерактивного поведения для sweep компонентов `/`-роута и постоянного chrome к v9.0 4-tier glass-системе. Токены, master-list CTA, z-index-контракт и anti-patterns зафиксированы в Phase 90 и копируются сюда как входные данные. Этот документ — distillation per-component, interaction states, blob-heat intensity, form-safety и a11y matrix для исполнителя и UI-checker'а.

**Источник истины токенов:** `DESIGN.md` (YAML `glass:` + `## v9.0 Custom Rules` + `## v9.0 Anti-Patterns`) и `next/src/app/globals.css` (`--glass-*`, `--blob-*`).
**Источник user-decisions:** `92-CONTEXT.md` (Decisions A–I, claude-decided).
**Источник требований:** `REQUIREMENTS.md` GLASS-01..10.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn (project-internal — `components.json` отсутствует, primitives живут вручную в `next/src/components/ui/`); Phase 92 их НЕ трогает (Phase 93). |
| Preset | n/a — design-system-as-DESIGN.md (YAML front matter + `globals.css` mirror). |
| Component library | Tailwind v4 + ad-hoc primitives (`next/src/components/ui/*`); никаких зависимостей в Phase 92 не добавляется. |
| Icon library | `lucide-react` (already used). FROZEN. |
| Font | Inter (body) + Manrope (headings) — self-hosted variable WOFF2. FROZEN. |
| Tokens consumed | `--glass-{section,card,form,button}-{fill,blur}` (Phase 90), `--blob-x`, `--blob-y`, `--blob-heat`, `--blob-velocity` (Phase 91 runtime), `--mu-cta-from-v6/--mu-cta-to-v6` + `--mu-cta-from/--mu-cta-to` (CTA gradient — opaque-forever). |
| Tokens added | НЕТ. Phase 92 не вводит новых токенов (Decision I — globals.css token block FROZEN). |

---

## Spacing Scale

Phase 92 не модифицирует scale; sweep — это замена opacity/blur-классов, не layout. DESIGN.md scale (унаследовано):

| Token | Value | Usage |
|-------|-------|-------|
| spacing.1 | 8px | Inline gaps, icon padding |
| spacing.2 | 16px | Default element gap, button padding-Y |
| spacing.3 | 24px | Card content gap, button padding-X |
| spacing.4 | 32px | Card padding |
| spacing.5 | 40px | Section internal gaps |
| spacing.6 | 48px | Block separation |
| spacing.8 | 64px | Section padding (mobile) |
| spacing.10 | 80px | Section padding (desktop) |

Exceptions для Phase 92: **HIG 44pt минимальный tap-target** на `HeaderClient` toggle / `MobileMenu` close / `StickyBar` CTA / `ContactForm` submit / `FAQSection` accordion handle. Verifiable Playwright-ом в Phase 94 (cheat-pass запрещён).

---

## Typography

Phase 92 НЕ изменяет type scale (Phase 79 территория). Roles унаследованы из DESIGN.md YAML; явная переопределяющая поправка в Decision B:

| Role | Size | Weight | Line Height | Phase 92 mutation |
|------|------|--------|-------------|-------------------|
| Display / h1 | clamp(2.5rem, 5vw, 3.5rem) | 800 | 1.1 | none |
| h2 | clamp(1.75rem, 3.5vw, 2.75rem) | 800 | 1.2 | none |
| h3 | clamp(1.375rem, 2.5vw, 2rem) | 700 | 1.3 | none |
| body-base | clamp(1.0625rem, 1.2vw, 1.125rem) | 400 | 1.5 | none |
| body-sm | 1rem | 400 | 1.5 | none |
| caption | 0.8125rem | 400 | 1.4 | none |
| **form label (FORM-SAFETY)** | inherits body-sm | **700** | 1.5 | **promoted from `text-mu-text-500/text-muted` → `text-mu-text-900/text-primary`** (Decision B, GLASS-07) |

---

## Color

60/30/10 анкоры на `/` после Phase 92 sweep:

| Role | Value | Usage |
|------|-------|-------|
| Dominant 60% (доминирующая поверхность) | `#FFFFFF` (`--mu-white`) — base canvas; effective fill через 4-tier alpha | Section frames, card surfaces, form panels, chrome backgrounds — все становятся transparent glass над живым blob. |
| Secondary 30% (текст / структурный neutral) | `#18212C` (`--mu-text-900` / `--color-text-primary`) для body, `#4A4E5C` (`--mu-text-700`) для secondary copy | All copy on glass; promoted label color на формах (Decision B). |
| Accent 10% (CTA / brand) | gradient `#1AC67E → #0D9DB5` (v1.3 `--mu-cta-from/to`) AND `#0E8FB5 → #3B6DD0` (v6 `--mu-cta-from-v6/to-v6`) | **Reserved for the 7-component CTA master list (Phase 90).** No glass, no `backdrop-filter`, no opacity transparency. |
| Blob (живой объект под стеклом) | `#35B678` (`--blob-core`) → `#4FE098` (`--blob-hot`, KD-v9-001) | Phase 91 engine territory; Phase 92 reads `--blob-x/y/heat` only. |
| Heat-leak gradient (на стекле) | `hsla(150, 60%, 50%, calc(0.04 * var(--blob-heat, 0)))` для `.liquid-regular`, `hsla(150, 60%, 50%, calc(0.06 * var(--blob-heat, 0)))` для `.liquid-card` | Already shipped commit 9c93b9f. Decision C. |
| Destructive | `#F50057` (`--mu-accent-red`), bg `#FFF0F5` | Form-error states only. Unchanged from v8.0. |

**Accent reserved for (master list — DESIGN.md `## v9.0 Custom Rules`, FROZEN):**

1. `HeroHub` primary CTA («Обсудить мой случай»)
2. `FinalCTA` primary submit
3. `ContactForm` submit button
4. `StickyBar` primary action (mobile sticky CTA)
5. `Header` phone CTA (where rendered with gradient)
6. Service-page `LeadFormSection` submit (Phase 93 territory — listed for completeness)
7. Any future component using `.btn-primary` / `.liquid-btn-primary` / v6 gradient utility classes (`from-mu-cta-from-v6`, `to-mu-cta-to-v6`)

**Color anti-patterns (DESIGN.md `## v9.0 Anti-Patterns`, must not violate in Phase 92 sweep):**

- #4: fills > 0.16 (Tier 3 button — exact 0.16 — единственное исключение)
- #5: green tint **directly painted** on cards (heat-leak `radial-gradient` — допустимо, потому что blob-position-driven, не static)
- #10: heat-driven shift toward red/orange — запрещено
- #14: добавление нового glass-класса без регистрации в `@a11y-layer-coverage` (Phase 92 не добавляет новых классов)

---

## Glass Tier Tokens (LOCKED — Phase 90)

Скопировано из `DESIGN.md` YAML `glass:` + `globals.css` для удобства исполнителя. **Не редактировать в Phase 92.**

| Tier | Component family | Fill (desktop) | Fill (mobile) | Blur (desktop) | Blur (mobile) | Token (Tailwind arbitrary) |
|------|-----------------|----------------|---------------|----------------|---------------|----------------------------|
| 0 — section | Header, MobileMenu, StickyBar, Footer, HeroHub frame, FinalCTA frame, ContactSection chrome, decorative section wrappers | 0.06 | 0.10 | 24px | 12px | `bg-[var(--glass-section-fill)]` / `backdrop-blur-[var(--glass-section-blur)]` |
| 1 — card | Cards в ServicesGrid / StatsBar (desktop) / WhyUsSection / ClinicsSection / PlatformSection / ReviewsSection / FAQSection (closed) | 0.10 | 0.14 | 20px | 12px | `bg-[var(--glass-card-fill)]` / `backdrop-blur-[var(--glass-card-blur)]` |
| 2 — form / hover | ContactForm panel, hover на Tier-1 cards, FAQSection (open) | 0.14 | 0.18 | 18px | 12px | `bg-[var(--glass-form-fill)]` / `backdrop-blur-[var(--glass-form-blur)]` |
| 3 — button | Secondary glass buttons (НЕ primary CTA — primary всегда opaque) | 0.12 | 0.16 | 16px | 12px | `bg-[var(--glass-button-fill)]` / `backdrop-blur-[var(--glass-button-blur)]` |

> NB: «Tier 2 form (≥0.16 floor)» в success-criteria — это floor-rule из TZ §13 + GLASS-07. Token-value у `--glass-form-fill` сейчас 0.14/desktop; floor 0.16 enforced на per-component level если контраст body-copy не проходит WCAG AA при blob-worst-case → escalation до 0.30 с `KD-v9-002` (Decision G).

---

## Per-Component Tier Assignment

Источник: Decision A (LOCKED). Hover-tier повышение применяется только к interactive cards.

### Chrome (always-visible, mounted в `layout.tsx`)

| Component | Default tier | Hover tier | Heat-leak | Notes |
|-----------|-------------|------------|-----------|-------|
| `HeaderClient` | Tier 0 (≤0.16 fill, blur ≤24px desktop / ≤12px mobile) | — | none (chrome-restraint) | Sticky `z-50`. Scrolled state: keep current `bg-white/50 → bg-[var(--glass-section-fill)]` swap. Decision E — Tailwind class swap. |
| `MobileMenu` | Tier 0 (drawer) | — | none | Heavier blur acceptable but capped by `--glass-section-blur` mobile token (12px). HIG 44pt close-toggle preserved. ESC dismissal preserved. |
| `StickyBar` | Tier 0 | — | none | Bottom mobile sticky `z-50`. Primary CTA внутри — opaque (master-list #4). |
| `Footer` | Tier 0 | — | none | Tier 0 fill; copy contrast verified vs heat=0 worst-case. |

### `/` index sections (top → bottom by visual order)

| Component | Default tier | Hover tier | Heat-leak intensity | Notes |
|-----------|-------------|------------|---------------------|-------|
| `HeroHub` frame (glass pill badge + secondary CTA) | Tier 0 (≤0.16) | Tier 1 on secondary CTA hover | weak (heat=0..1 → α 0..0.04) | Primary CTA gradient: opaque-forever (master-list #1). Floating credibility badge top-right: keep current Tier 1 (cards-style). HD/Mic/Cam control overlay over photo: hardcoded `bg-mu-text-900/55` — **NOT glass, do not sweep** (over-photo control bar; preserve current dark surface). Doctor-name pill / live-indicator pill: same — preserve. |
| `StatsBar` (mobile = 1 wrapper) | Tier 0 wrapper | — | weak on wrapper | Phase 82 responsive-glass-nesting preserved (mobile = 1 glass wrapper, 4 stats inside it transparent). |
| `StatsBar` (desktop = 4 cards) | Tier 1 cards | Tier 2 hover | medium (heat=0..1 → α 0..0.06) | Each of 4 cards individually `Tier 1`. ≤2 glass siblings per viewport rule: respected because the wrapper is non-glass on desktop. |
| `ServicesGrid` (4 cards) | Tier 1 | Tier 2 hover | medium (α 0..0.06) | Cards link to service pages — preserve link semantics. |
| `ProcessSection` (4 numbered steps) | Tier 1 cards | Tier 2 hover | medium (α 0..0.06) | Dotted connectors остаются (Phase 83). On `<768px` connectors уже свёрнуты — preserve. |
| `ProblemSection` | Tier 0 (section frame) или Tier 1 (cards) — per-component judgment via in-browser tuning | Tier 2 hover for cards | weak-to-medium | Per Decision A row 6: «per-component judgment via in-browser tuning». Default to Tier 1 cards if section already groups problems в карточный формат. |
| `WhyUsSection` | Tier 1 cards | Tier 2 hover | medium | Same Decision-A judgment row. |
| `ClinicsSection` | Tier 1 cards (clinic logos / locations) | Tier 2 hover | medium | Logo backgrounds: keep opaque white surfaces где требуется brand legibility (clinics' own brand contracts). Glass-frame around card. |
| `PlatformSection` | Tier 0 frame OR Tier 1 cards | Tier 2 hover | weak-to-medium | Section-level frame Tier 0; inner feature cards Tier 1. |
| `ReviewsSection` | Tier 1 cards (review carousel/grid items) | Tier 2 hover | medium | Star/rating colors не trogem (preserve brand). |
| `FAQSection` (closed item) | Tier 1 | — | weak (α 0..0.04) | Smooth-anim accordion preserved (Phase 71 work). |
| `FAQSection` (open item) | Tier 2 | — | medium (α 0..0.06) | Open-state gets one tier higher fill for body-copy readability. |
| `ContactSection` chrome (encloses ContactForm) | Tier 0 | — | none | Outer wrapper. |
| `ContactForm` panel (the form itself) | **Tier 2 form** (`--glass-form-fill`, ≥0.16 floor — escalation to 0.30 with `KD-v9-002` if WCAG AA fails при blob-worst-case) | — | **suppressed** — heat-leak gradient explicitly NOT added to form panel | Inputs inside: `bg-white` opaque, NOT glass. Localized blob dimming (mask or absolute dimmer overlay) when blob centroid enters form bounds. See FORM-SAFETY section. |
| `FinalCTA` frame | Tier 0 | — | weak (α 0..0.04) | Decorative blue blob inside (existing) is Phase 92 freeze — preserve current `mix-blend-multiply` rendering OR remove if it conflicts with anti-pattern #8 (`mix-blend-mode` on glass). **Recommendation:** retire the `mix-blend-multiply` decoration (anti-pattern #8) and let the heat-leak gradient handle ambient. Plan-level decision; flag in 92-08. |
| `Footer` | Tier 0 | — | none | (duplicate of chrome row above for canonical placement in section walk). |

**Tier validation rule (anti-pattern #4):** any computed `background-color` final fill > 0.16 в Phase 92 sweep is a defect. Tier 3 button = 0.12 desktop / 0.16 mobile is the only allowed 0.16 occurrence.

**≤2 glass siblings per viewport rule:** ServicesGrid (4 Tier-1 cards) is checked per viewport: at 1440px width, 4 cards visible simultaneously is a documented exception sanctioned by Phase 82 (cards count as siblings of each other, not of an enclosing glass). On mobile (<768px), grid collapses to 1-column → ≤1 card per viewport — within budget. Verify in Phase 94.

---

## Interaction States — per Component

States to verify in Phase 94: `:hover`, `:focus-visible`, `:active`, `:disabled`. Reduced-motion + reduced-transparency + prefers-contrast: more — global guards via `liquid-glass.css` `@a11y-layer-coverage` block (Phase 90, FROZEN).

### Tier 0 chrome (Header, MobileMenu, StickyBar, Footer)

| State | Visual | Token / class | Notes |
|-------|--------|--------------|-------|
| rest | Tier 0 fill, blur per token | `bg-[var(--glass-section-fill)]` `backdrop-blur-[var(--glass-section-blur)]` | — |
| `:hover` | none on chrome wrapper itself | — | Hover on inner nav-links: existing v8.0 underline / color shift preserved. |
| `:focus-visible` (inner links / buttons) | `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` | inherited from `globals.css :focus-visible` | NEVER box-shadow ring (anti-pattern: clipped by squircle mask). |
| `:active` (links) | `transform: scale(0.97)` 100ms | `--dur-press` | Existing pattern. |
| scrolled (HeaderClient) | Tier 0 fill stays; blur may increase to 60px desktop / cap 12px mobile | conditional class swap | Decision E — Tailwind class swap. |

### Tier 1 cards (ServicesGrid, StatsBar desktop, WhyUs, Clinics, Platform, Reviews, FAQ closed)

| State | Visual | Token / class | Notes |
|-------|--------|--------------|-------|
| rest | Tier 1 fill, blur per token | `bg-[var(--glass-card-fill)]` `backdrop-blur-[var(--glass-card-blur)]` | — |
| `:hover` | Tier 2 fill ramp + `translateY(-2px)` | `bg-[var(--glass-form-fill)]` (Tier 2 = form-fill token; same value used for hover surface) | DESIGN.md DOs: «Lift on hover with `translateY(-2px)` for cards (subtler than scale)». NEVER scale. NEVER shadow-jump (anti-pattern #7). |
| `:focus-visible` | `outline: 2px solid var(--mu-blue-text); outline-offset: 4px; box-shadow: none` | inherited | Squircle-safe. |
| `:active` (clickable cards) | `transform: scale(0.985)`; `filter: brightness(0.96)` | `--dur-press` 120ms | From `liquid-glass.css` Section 16. |
| `:disabled` | n/a в Phase 92 (cards не имеют disabled state) | — | — |

### Tier 2 form (ContactForm panel)

| State | Visual | Token / class | Notes |
|-------|--------|--------------|-------|
| rest | Tier 2 form fill (≥0.16 floor enforced) | `bg-[var(--glass-form-fill)]` или escalated-fill (`KD-v9-002`) | Heat-leak gradient suppressed. |
| inputs `rest` | `bg-white` opaque (NOT glass) | replace existing `bg-white/50` → `bg-white` | Decision B step 3. |
| inputs `:focus-visible` | `outline: 2px solid var(--mu-blue); ring 4px var(--mu-blue)/0.20` | existing pattern | — |
| inputs `:focus` (typing) | `bg-white` (stays opaque) | — | NO transparency shift on focus (anti-pattern: animated transparency). |
| inputs `:invalid` | `border-color: var(--mu-accent-red)`; error message in `text-red-600` on `bg-red-50/80` | existing | Unchanged. |
| submit button (CTA — gradient) | `bg-gradient-to-r from-mu-blue to-mu-accent-blue` | opaque-forever — master-list #3 | Never `backdrop-filter`. Never glass. |
| submit `:hover` | shadow ramp (existing) | — | No fill change (already opaque). |
| submit `:active` | `transform: scale(0.96)` | `--dur-press` | Existing. |
| submit `[aria-busy="true"]` / `:disabled` | `opacity: 0.70`; `cursor: not-allowed` | existing | — |
| success-state overlay | `bg-white/82` opaque-leaning (current value) — preserve | — | Already opaque enough; не трогать. |

### Tier 3 buttons (secondary glass buttons; `liquid-btn-secondary` re-pointed via Decision D)

| State | Visual | Token / class | Notes |
|-------|--------|--------------|-------|
| rest | Tier 3 fill | `bg-[var(--glass-button-fill)]` `backdrop-blur-[var(--glass-button-blur)]` | — |
| `:hover` | `filter: brightness(1.10) saturate(1.20)` | existing `liquid-glass.css` Section 3 | — |
| `:focus-visible` | `outline: 2px solid var(--mu-blue-text); outline-offset: 3px` | inherited | — |
| `:active` | `transform: scale(0.97)` | `--dur-press` | Existing. |

### Primary CTA (master-list components — opaque-forever)

| State | Visual | Token / class | Notes |
|-------|--------|--------------|-------|
| rest | gradient `linear-gradient(to right, var(--mu-blue), var(--mu-accent-blue))` OR v6 gradient | opaque, no transparency | NEVER `backdrop-filter`. |
| `:hover` | shadow-ramp + filter `brightness(1.08)` | existing | — |
| `:active` | `transform: scale(0.97)` | `--dur-press` | — |
| `:disabled` | `opacity: 0.70`; `cursor: not-allowed` | existing | — |

---

## Per-Component Blob-Heat Response Intensity

Heat-leak gradient (Decision C — already shipped commit 9c93b9f for `.liquid-card` and `.liquid-regular`) intensities per component family. Formula form: `radial-gradient(ellipse 600px 400px at var(--blob-x) var(--blob-y), hsla(150, 60%, 50%, calc(<α-mult> * var(--blob-heat, 0))), transparent 70%)`.

| Component | α-multiplier | Rationale |
|-----------|--------------|-----------|
| `.liquid-regular` (utility — section frames) | **0.04** | Already shipped. Section-level subtle warm. |
| `.liquid-card` (utility — Tier 1 cards) | **0.06** | Already shipped. Card-level slightly brighter optical response per TZ §10 «под карточкой он становится сочнее». |
| `HeaderClient` / `Footer` chrome | **0** (none) | TZ §10: «верхняя навигация: сдержанная реакция, без визуального шума». Chrome-restraint. |
| `MobileMenu` / `StickyBar` chrome | **0** (none) | Same restraint rule. |
| `HeroHub` glass pill badge / secondary CTA | **0.04** (via `.liquid-regular` if utility-applied; otherwise inline arbitrary value) | Section-level. |
| `StatsBar` desktop cards | **0.06** (via card-tier rule) | Card-tier. |
| `ServicesGrid` / `WhyUsSection` / `ClinicsSection` / `PlatformSection` / `ReviewsSection` / `ProcessSection` cards | **0.06** | Card-tier. |
| `FAQSection` (closed) | **0.04** | Section-level visual noise constraint — keep subtle. |
| `FAQSection` (open) | **0.06** | Card-tier when expanded. |
| `ContactForm` panel | **0** (suppressed — see FORM-SAFETY) | Form-readability protected. |
| `ContactSection` chrome (outer) | **0.04** | Section-level. |
| `FinalCTA` frame | **0.04** | Section-level. |

**Rule:** intensity values above are caps. If in-browser tuning (Plan 92-08 verification) shows perceptual collapse (form area readable вне зависимости от blob, BUT heat-leak gradient on adjacent сard читается «грязно»), reduce α-multiplier by ≥25% for that component family. Log as plan note (no Key Decision needed — within token budget).

**Anti-patterns to enforce on heat-leak:**

- #6: never animate `backdrop-filter` blur values. Heat-leak is on `background-image`, NOT on `backdrop-filter` — compliant.
- #8: never `mix-blend-mode` on glass. Heat-leak uses `hsla()` alpha-channel only — compliant.
- #11: heat-leak rule MUST NOT be added to `.living-blob-field` itself (blob is BEHIND glass). Frozen file `blob.css`.

---

## Form-Safety Treatment (GLASS-07 — Decision B, LOCKED)

Applies to: `ContactForm` (Phase 92), `ContactSection` (Phase 92), `LeadFormSection` (Phase 93 — listed for parity). Phase 92 implements only the `/` route surfaces.

### Required treatments

1. **Panel fill floor (`--glass-form-fill`, ≥0.16 effective):**
   - Start: `var(--glass-form-fill)` = 0.14 desktop / 0.18 mobile per Phase 90 token. Mobile already meets ≥0.16 floor.
   - Desktop verification: at blob-worst-case position (heat=1.0, blob centroid behind form), measure `text-mu-text-900` (#18212C) body copy contrast vs computed composite background. WCAG AA threshold: ≥4.5:1 for body, ≥3:1 for ≥18px or ≥14px-bold.
   - **Escalation rule:** if any contrast cell fails, increase `--glass-form-fill` desktop value → 0.30 (or empirical intermediate). Log `KD-v9-002` row in PROJECT.md Key Decisions: rationale, before/after values, blob-worst-case screenshot. Decision G — auto-decided per delegation.

2. **Label promotion:**
   - Current: `text-sm font-bold text-mu-text-900` (already promoted in current code — `ContactForm.tsx` lines 137, 159, 182, 207). Verify all 4 labels stay at `text-mu-text-900` (`#18212C`); no regression to `text-mu-text-500` allowed.

3. **Inputs opaque:**
   - Replace `bg-white/50` and `focus:bg-white/72` → `bg-white` opaque (no opacity, no `backdrop-filter`). The `inputBase` template-string in `ContactForm.tsx` line 128 is the change point.
   - Preserve focus-ring (`focus:ring-4 focus:ring-mu-blue/20`) — outline is OUTSIDE the input box, not affecting fill.

4. **Heat-leak suppressed on form panel:**
   - `ContactForm` panel must NOT receive heat-leak `background-image`. If wrapping element uses `.liquid-card` utility (which carries heat-leak from commit 9c93b9f), wrap with a more specific class OR use `bg-[var(--glass-form-fill)]` directly without `.liquid-card`.

5. **Localized blob dimming когда blob enters form bounds:**
   - Implementation hint (executor-discretion): an absolute-positioned dimmer pseudo-element `::after` on `ContactSection` OR `ContactForm` outer wrapper at `z-index: -1` relative to form content, with `background: rgba(255,255,255,0.20)`, `opacity: 0`, scaling `opacity` based on blob-distance-to-form via `--blob-distance-form` runtime var (engine может вычислять distance — но Phase 91 engine FROZEN, не модифицируется).
   - **Pragmatic Phase-92-only fallback** (если engine modification deferred): static localized dim via `mask-image: radial-gradient(...)` over `.living-blob-field` portion behind form bounds — implemented purely в CSS на form panel side. Mark as TODO if not implementable cleanly without engine touch; escalate during in-browser tuning Plan 92-08.

6. **Body copy contrast verified at heat=0 (worst dark-blob position) AND heat=1 (worst hot-blob position):**
   - Min ratios: 4.5:1 body, 3:1 large.
   - Tooling: Chrome DevTools Color Picker; or Playwright + axe-core (Phase 94 territory but Phase 92 records baseline).

### Form-state copy (Russian — locked from existing component)

| Element | Copy | Status |
|---------|------|--------|
| Submit (idle) | «Отправить заявку» | preserve |
| Submit (busy) | «Отправка...» | preserve |
| Success heading | «Спасибо!» | preserve |
| Success body | «Мы свяжемся с вами в течение 24 часов.» | preserve |
| Validation: name | «Введите ваше имя» | preserve |
| Validation: phone | «Введите корректный номер телефона» | preserve |
| Validation: interest | «Выберите направление» | preserve |
| Helper line | «Мы перезвоним в течение 24 часов. Ваши данные защищены.» | preserve |

---

## Copywriting Contract

Phase 92 is a glass-sweep — copy в основном preserved. Locked entries (verified vs current components):

| Element | Copy | Source |
|---------|------|--------|
| Primary CTA (Hero) | «Обсудить мой случай» | `HeroHub.tsx` line 50 |
| Primary CTA (FinalCTA) | «Обсудить мой случай» | `FinalCTA.tsx` line 28 |
| Primary CTA (ContactForm submit) | «Отправить заявку» / «Отправка...» | `ContactForm.tsx` line 249 |
| Secondary CTA (Hero) | «Узнать больше» | `HeroHub.tsx` line 58 |
| Secondary CTA (FinalCTA, phone) | «Позвонить» | `FinalCTA.tsx` line 36 |
| Trust microcopy (Hero) | «MedicusUnion GmbH, Австрия · ТОО в Казахстане · ISO 27001 · 43 клиники · 11 стран · 15+ лет опыта» | `HeroHub.tsx` line 64-66 |
| Helper microcopy (ContactForm) | «Мы перезвоним в течение 24 часов. Ваши данные защищены.» | `ContactForm.tsx` line 258 |
| Empty state | n/a — no empty-state surfaces in Phase 92 scope | — |
| Error state (form-level) | rendered from server response через `setFormError(result.errors._form)` | `ContactForm.tsx` line 95-96 — preserve |
| Destructive confirmation | n/a — no destructive actions in Phase 92 scope | — |

Phase 92 не вводит нового copy. Subject+verb nbsp binding (project rule from MEMORY) уже применён в текущих компонентах — preserve.

---

## Accessibility Verification Matrix per State

Phase 92 must NOT regress Phase 85 / Phase 89 a11y guarantees. Phase 94 will execute live-OS-toggle UAT (no cheat-pass — see anti-pattern #15). Phase 92 records the matrix; Phase 94 fills evidence column.

| Component × State | `prefers-reduced-motion: reduce` expected | `prefers-reduced-transparency: reduce` expected | `prefers-contrast: more` expected | Touch target ≥44pt | WCAG AA contrast |
|-------------------|------------------------------------------|----------------------------------------------|----------------------------------|--------------------|------------------|
| HeaderClient (rest) | no scroll-state transition; static glass | `backdrop-filter: none`; `bg: rgba(255,255,255,0.85)` opaque | `bg: #fff` + `border: rgba(0,0,0,0.85)`; outline-rings amplified | toggle ≥44×44 (already verified Phase 85 cheat-pass — Phase 94 re-verify) | nav links ≥4.5:1 |
| HeaderClient (scrolled) | identical to rest under reduce-motion | same opaque fallback | same | same | same |
| MobileMenu (open) | no slide-in transition; appears immediately | opaque drawer | opaque + amplified borders | close button ≥44×44; menu items ≥44×44 | menu items ≥4.5:1 |
| StickyBar | no entrance animation | opaque bottom bar | opaque + amplified | CTA inside ≥44×44 | CTA white-on-gradient (parent rule WCAG note: parity exception per DESIGN.md) |
| Footer | static | opaque | opaque + amplified | links ≥44×44 | ≥4.5:1 |
| HeroHub frame | no entrance shimmer; pulse-animation на live indicator suppressed (`animate-ping motion-reduce:hidden` already в коде) | opaque pill badges | opaque + amplified | secondary CTA ≥44×44; primary CTA ≥44×44 | primary CTA: parity-exception (white on gradient ~2.6:1, locked per DESIGN.md WCAG note); secondary CTA: ≥4.5:1 |
| StatsBar (mobile wrapper) | no entrance | opaque | opaque + amplified | each stat tappable area ≥44×44 if interactive (currently декоративные — n/a) | numbers ≥4.5:1 |
| StatsBar (desktop cards) | no hover transition | opaque cards | opaque + amplified | cards ≥44pt if clickable | numbers ≥4.5:1 |
| ServicesGrid cards | no hover lift | opaque cards | opaque + amplified | cards ≥44pt (whole card is link target) | titles ≥4.5:1; descriptions ≥4.5:1 |
| ProcessSection steps | no entrance | opaque | opaque + amplified | n/a (декор) | step labels ≥4.5:1 |
| ProblemSection / WhyUsSection / ClinicsSection / PlatformSection / ReviewsSection cards | no hover lift; no shimmer / glint | opaque | opaque + amplified | clickable cards ≥44pt | body copy ≥4.5:1 |
| FAQSection (closed) | accordion smooth-anim disabled (immediate snap) | opaque closed-row | opaque + amplified | accordion handle ≥44×44 | question text ≥4.5:1 |
| FAQSection (open) | answer appears immediately, no max-height transition | opaque open-row | opaque + amplified | same handle | answer body ≥4.5:1 |
| ContactForm panel (rest) | no transition | **opaque white panel + opaque inputs** | opaque + amplified borders | inputs ≥44×44 (height min 56px in current `inputBase`); submit ≥44×44 (`min-h-14` = 56px) | **labels ≥4.5:1 (text-primary), inputs `placeholder-mu-text-500` ≥3:1** |
| ContactForm submit | no shadow-pulse | gradient stays (CTA opaque-forever) | gradient stays | ≥44×44 | parity-exception (WCAG note in DESIGN.md) |
| FinalCTA frame | static blob decoration disabled | opaque frame | opaque + amplified | both CTAs ≥44×44 | similar to Hero CTAs |

**Cheat-pass forbidden:** Phase 94 will execute physical OS-toggle for all three media queries и attach screenshot/video evidence. Phase 92 plans must NOT mark a11y rows passed via «code-only» inspection.

**Coverage anchor:** all classes touched by Phase 92 sweep are already enumerated in `liquid-glass.css` `@a11y-layer-coverage:start/end` block from Phase 90 (utility classes `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.liquid-card-wrap`, `.liquid-btn-secondary`, `.liquid-header-backdrop`, `.stats-glass`, `.glass-idle`, `.living-blob-field`, `.blob-*`). Phase 92 doesn't ADD new classes — only re-points utility internals. Anti-pattern #14 satisfied by no-op.

---

## Z-index Bands (LOCKED — Phase 90 FND-04, FROZEN — repeated for executor convenience)

| Layer | z-index | Phase 92 components |
|-------|---------|--------------------|
| `.living-blob-field` | `z-0` | FROZEN — not touched |
| `<main>` content + glass surfaces | `z-1..10` | All `/` route sections; `<main className="relative z-10">` already anchored |
| Header / StickyBar / sticky chrome | `z-50+` | HeaderClient, StickyBar, MobileMenu trigger |
| Modals / dialogs | `z-100+` | n/a в Phase 92 scope |

Any Phase 92 plan that introduces a `z-` value outside these bands → Key Decision in PROJECT.md required.

---

## Liquid-Glass Utility Re-Pointing (Decision D — LOCKED)

Surface map for `liquid-glass.css` edits in Plan 92-01 (Wave 1, foundation):

| Utility class | Old (legacy) bg | New v9.0 token | Old blur | New blur token |
|---------------|----------------|----------------|----------|----------------|
| `.liquid-regular` | `var(--liquid-bg)` (rgba 255,255,255,0.42) | `var(--glass-section-fill)` | `var(--liquid-blur-md)` (24px clamp) | `var(--glass-section-blur)` (24/12px) |
| `.liquid-card` | `var(--liquid-bg)` | `var(--glass-card-fill)` | `var(--liquid-blur-md)` | `var(--glass-card-blur)` (20/12px) |
| `.liquid-nav` | `var(--liquid-nav-bg)` | `var(--glass-section-fill)` | `var(--liquid-nav-blur)` (16px clamp) | `var(--glass-section-blur)` |
| `.liquid-clear` | `var(--liquid-clear-bg)` | leave as-is (special-purpose modal/overlay material) | leave | leave |
| `.liquid-fluted` | `var(--liquid-bg)` (with fluted streaks) | leave as-is (special-purpose texture) | leave | leave |
| `.stats-glass` | `var(--liquid-bg)` | `var(--glass-card-fill)` | `var(--liquid-blur-lg)` (40px) | `var(--glass-card-blur)` |
| `.liquid-btn-primary` | gradient (opaque) | NO CHANGE | n/a | n/a |
| `.liquid-btn-secondary` | `var(--liquid-bg)` | `var(--glass-button-fill)` | `var(--liquid-blur-md)` | `var(--glass-button-blur)` |
| `.liquid-header-backdrop` | n/a | leave (Josh-Comeau extended pattern) | hardcoded `blur(20px)` | leave or migrate to `var(--glass-section-blur)` per executor judgment |

**Legacy `--liquid-*` tokens stay in `globals.css`** for any consumer outside the swept utilities (defensive). Decision D explicitly preserves them.

**Heat-leak addition** (already shipped, commit 9c93b9f): `.liquid-card` and `.liquid-regular` ship the `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` rule as the FIRST `background-image` layer. Phase 92 plans verify this is preserved through any subsequent edits.

---

## Component Sweep Approach (Decision E — LOCKED)

**Strategy:** Tailwind class swap, NOT utility migration.

Index components currently use direct Tailwind classes (`bg-white/40`, `backdrop-blur-[20px]`, `border-glass-border`), not `.liquid-card` utility wrappers. Phase 92 sweeps Tailwind class values, plus utility internals в `liquid-glass.css`.

| Pattern | Old | New |
|---------|-----|-----|
| Section-level fill | `bg-white/30..bg-white/40` | `bg-[var(--glass-section-fill)]` |
| Card-level fill | `bg-white/40..bg-white/60` | `bg-[var(--glass-card-fill)]` |
| Form panel fill | `bg-white/60..bg-white/82` (success overlay) | `bg-[var(--glass-form-fill)]` (form panel); success overlay preserved opaque |
| Button-level glass fill | `bg-white/50..bg-white/68` | `bg-[var(--glass-button-fill)]` |
| Section blur | `backdrop-blur-[20px]..backdrop-blur-3xl` | `backdrop-blur-[var(--glass-section-blur)]` |
| Card blur | `backdrop-blur-[20px]` | `backdrop-blur-[var(--glass-card-blur)]` |
| Form blur | `backdrop-blur-md..3xl` | `backdrop-blur-[var(--glass-form-blur)]` |
| Borders | `border-glass-border` / `border-glass-border-strong` | NO CHANGE (already token-based, Phase 73 era) |
| Shadows | `shadow-glass`, `shadow-glass-lg`, `shadow-glass-sm` | NO CHANGE (already token-based) |
| CTA gradient classes | `from-mu-blue to-mu-accent-blue` / `from-mu-cta-from to-mu-cta-to` | NEVER touched (CTA opaque-forever) |
| Inputs | `bg-white/50` / `focus:bg-white/72` | `bg-white` (opaque) — Decision B |

---

## Wave/Plan Decomposition (Decision F — LOCKED)

| Plan | Wave | Scope | Files (approximate) |
|------|------|-------|---------------------|
| 92-01 | 1 | `liquid-glass.css` utility re-pointing + heat-leak rules verify | `next/src/styles/liquid-glass.css` |
| 92-02 | 2 | Chrome | `HeaderClient.tsx`, `MobileMenu.tsx`, `StickyBar.tsx`, `Footer.tsx` |
| 92-03 | 2 | Hero + Stats | `HeroHub.tsx`, `StatsBar.tsx` |
| 92-04 | 2 | Mid sections part 1 | `ServicesGrid.tsx`, `ProcessSection.tsx`, `ProblemSection.tsx` |
| 92-05 | 2 | Mid sections part 2 | `WhyUsSection.tsx`, `ClinicsSection.tsx`, `PlatformSection.tsx`, `ReviewsSection.tsx` |
| 92-06 | 3 | FAQSection | `FAQSection.tsx` |
| 92-07 | 3 | ContactForm + ContactSection FORM-SAFETY (potential KD-v9-002 escalation) | `ContactForm.tsx`, `ContactSection.tsx` |
| 92-08 | 4 | FinalCTA + Phase 92 verification (DOM-evaluate per-component opacity check + WCAG contrast measurement at heat=0/heat=1) | `FinalCTA.tsx` + verification artifacts |

Wave 1 (foundation) → Wave 2 (parallel components, no shared files) → Wave 3 (form-safety + accordion) → Wave 4 (verification).

Note 92-01 partially shipped — commit 9c93b9f added heat-leak rules to `.liquid-card` and `.liquid-regular`. Plan 92-01 finalizes utility re-pointing per Decision D table.

---

## Anti-Pattern Enforcement Gate (Decision H — LOCKED)

Each Plan 92-NN MUST grep `DESIGN.md ## v9.0 Anti-Patterns` before generating tasks. Specifically blocked in Phase 92:

| # | Pattern | Phase 92 enforcement |
|---|---------|---------------------|
| #4 | fills > 0.16 | Tier 3 button at exact 0.16 — единственное исключение; cards ≤0.12 desktop; form-panel ≤0.18 mobile (≤0.30 only after KD-v9-002). |
| #5 | green tint statically painted on cards | NOT static green tint — heat-leak `radial-gradient` is blob-position-driven. Compliant. |
| #6 | animated `backdrop-filter` blur | Heat-leak is on `background-image`, NOT on `backdrop-filter` — compliant. |
| #8 | `mix-blend-mode` on glass | `FinalCTA` currently has `mix-blend-multiply` decorative blob: **flag for retirement в Plan 92-08**. |
| #11 | `backdrop-filter` on `.living-blob-field` | Phase 92 doesn't touch blob-field — compliant. |
| #12 | mobile blur >12px | All `--glass-*-blur` tokens clamp to 12px на mobile — compliant by token consumption. |
| #13 | >2 glass layers per viewport | StatsBar Phase 82 nesting preserved (mobile = 1 wrapper). Other multi-card sections respect rule by collapsing на mobile. ServicesGrid 4-cards-on-desktop is documented exception (Phase 82). |
| #14 | new glass class without `@a11y-layer-coverage` registration | Phase 92 doesn't add new classes (Decision E — Tailwind class swap, NOT new utility classes). Compliant by no-op. |
| #15 | cheat-passing a11y verification | Phase 92 plans MUST mark a11y rows as «pending live-toggle (Phase 94)» — never «verified». |

---

## Frozen Ranges (Decision I — DO NOT MODIFY in Phase 92)

| Path | Reason |
|------|--------|
| `next/src/styles/blob.css` | Phase 90/91 territory; Phase 92 consumes runtime vars only |
| `next/src/lib/blob-engine/*` | Phase 91 territory |
| `next/src/app/globals.css` token blocks | Phase 90 frozen (`--blob-*`, `--glass-*`, legacy `--liquid-*`) |
| `next/src/hooks/use-specular-highlight.ts` | orthogonal — different namespace (`--mouse-x/y`) |
| `next/src/components/layout/SvgRefractionDefs.tsx` | frozen |
| `DESIGN.md` | Phase 90 finalized |
| `next/src/components/sections/{checkup,consultations,treatment,contacts}/**` | Phase 93 territory |
| `next/src/components/sections/service/**` | Phase 93 territory |
| `next/src/components/ui/**` (shadcn primitives) | Phase 93 territory |
| `liquid-glass.css` `@a11y-layer-coverage:start/end` block (lines 79-158) | Phase 90 finalized; Phase 92 only edits utility class internals OUTSIDE markers |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| Project-internal (`next/src/components/ui/*`) | Phase 92 не вводит новых ui-primitives | n/a — Phase 93 territory |
| shadcn official | n/a — Phase 92 don't fetch new blocks | n/a |
| Third-party | none declared | n/a |

No registry vetting needed: zero new external blocks ingested in Phase 92 scope.

---

## Success Criteria (mirrored from CONTEXT.md `<success_criteria>`)

Phase 92 ships when:

1. ✅ HeaderClient + MobileMenu + StickyBar + Footer на Tier 0 (≤0.16 fill); HIG 44pt tap targets preserved; mobile blur ≤12px verified
2. ✅ All 14 `/` route sections updated to v9.0 4-tier (cards Tier 1 ≤0.12 / hover Tier 2 ≤0.16); ≤2 glass siblings per viewport rule respected; responsive-glass-nesting on StatsBar preserved
3. ✅ ContactForm uses `--glass-form-fill` (≥0.16 floor; escalated to 0.30 with `KD-v9-002` if WCAG AA fails); labels promoted to `text-primary`; inputs `bg-white` opaque; localized blob dimming when centroid enters form bounds; body copy contrast ≥4.5:1
4. ✅ All CTAs verified opaque at all blob positions (grep on every CTA component; no `backdrop-filter`); FinalCTA Tier 0 frame; gradient unchanged
5. ✅ `liquid-glass.css` utilities re-pointed from `--liquid-bg` to `--glass-*` tier tokens; heat-leak rules preserved on `.liquid-card` + `.liquid-regular`; visual confirmation of optical response to blob movement
6. ✅ Page renders without runtime errors на `/`; `pnpm build` clean
7. ✅ No new dependencies
8. ✅ All 10 GLASS-NN requirements code-complete
9. ✅ Frozen ranges respected

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (locked from existing components; 0 new copy strings; subject+verb nbsp preserved)
- [ ] Dimension 2 Visuals: PASS (per-component tier mapping LOCKED; heat-leak intensities specified; interaction states defined per family)
- [ ] Dimension 3 Color: PASS (60/30/10 anchors documented; CTA gradient parity-exception flagged per DESIGN.md WCAG note; accent reserved for 7-component master list)
- [ ] Dimension 4 Typography: PASS (no Phase 92 mutation except form-label promotion; sizes/weights/line-heights inherited from Phase 79)
- [ ] Dimension 5 Spacing: PASS (no scale change; HIG 44pt exceptions enumerated)
- [ ] Dimension 6 Registry Safety: PASS (zero new blocks; Phase 93 ui/* deferred)

**Approval:** pending
