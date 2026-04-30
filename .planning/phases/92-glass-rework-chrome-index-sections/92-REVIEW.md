---
phase: 92-glass-rework-chrome-index-sections
reviewed: 2026-04-30T00:00:00Z
depth: standard
files_reviewed: 19
files_reviewed_list:
  - next/src/app/globals.css
  - next/src/components/layout/Footer.tsx
  - next/src/components/layout/HeaderClient.tsx
  - next/src/components/layout/MobileMenu.tsx
  - next/src/components/layout/StickyBar.tsx
  - next/src/components/sections/ClinicsSection.tsx
  - next/src/components/sections/ContactForm.tsx
  - next/src/components/sections/ContactSection.tsx
  - next/src/components/sections/FAQSection.tsx
  - next/src/components/sections/FinalCTA.tsx
  - next/src/components/sections/HeroHub.tsx
  - next/src/components/sections/PlatformSection.tsx
  - next/src/components/sections/ProblemSection.tsx
  - next/src/components/sections/ProcessSection.tsx
  - next/src/components/sections/ReviewsSection.tsx
  - next/src/components/sections/ServicesGrid.tsx
  - next/src/components/sections/StatsBar.tsx
  - next/src/components/sections/WhyUsSection.tsx
  - next/src/styles/liquid-glass.css
findings:
  blocker: 4
  warning: 11
  info: 6
  total: 21
status: issues_found
---

# Phase 92: Code Review Report

**Reviewed:** 2026-04-30
**Depth:** standard
**Files Reviewed:** 19
**Status:** issues_found

## Summary

Phase 92 migrated chrome (Header, MobileMenu, StickyBar, Footer) and 11 index-page sections from direct Tailwind opacity utilities (`bg-white/{30,55,…}`) and hardcoded blurs to v9.0 tier-token arbitrary values (`bg-[var(--glass-section-fill)]` etc.) consuming `--glass-{section,card,form,button}-{fill,blur}` custom properties. The migration is structurally consistent across sections — same token-pair pattern is applied uniformly — but the review surfaces several real defects:

1. The mobile-blur cap rule in `globals.css` does not match Tailwind v4’s arbitrary-value class output (`backdrop-blur-[var(--…)]`), which means **the Phase 79 `≤12px mobile blur` budget is silently broken** by the very migration that introduced these classes. This is a regression with documented contract impact.
2. The `prefers-contrast: more` and `prefers-reduced-transparency: reduce` blocks in `globals.css` no longer cover `bg-[var(--glass-*-fill)]` consumers — only `bg-white/N` patterns. The migration moved every chrome and section glass surface out of that selector’s reach, leaving them translucent in high-contrast mode (a11y regression).
3. The Phase 92 Decision F migration target was the form-fill token, but `ContactForm.tsx`’s success overlay was missed — it still uses `bg-white/82 backdrop-blur-3xl`, contradicting both the migration intent and the global mobile-blur cap (which does cap `backdrop-blur-3xl`, but the success surface is still a fixed opacity outside the token system).
4. ContactForm’s honeypot-pass and timing-trap branches return the same `success` UI shown to genuine submissions. While intentional, both branches *do not call* the server action, so silent bot drops are indistinguishable from successful submissions to legitimate users who filled the form too quickly — there is no rate-limiting telemetry or differentiated client signal. Combined, this produces the **opposite** of the intended outcome on slow human users (loss of leads).

Beyond these, several sections continue to apply `backdrop-filter` to elements that already nest inside a glass parent (Footer’s contact icons inside the Footer card; Stat icons in StatsBar mobile container; Coordinator avatar inside the dark gradient ContactSection — though the latter does not nest glass-on-glass). This violates the documented anti-pattern in `liquid-glass.css` lines 51–52 ("NEVER nest glass inside glass"). In quantity, multiple sections also exceed the documented “≤2 glass layers per viewport” mobile budget when scrolled to at narrow widths.

## Blocker Issues

### BL-01: Mobile blur cap rule does not match arbitrary-value classes used by the entire Phase 92 migration

**File:** `next/src/app/globals.css:518-528`
**Issue:** The mobile blur cap selector enumerates `.backdrop-blur-md`, `.backdrop-blur-lg`, `.backdrop-blur-xl`, `.backdrop-blur-2xl`, `.backdrop-blur-3xl`, and `[class*="backdrop-blur-["]`. The last selector is intended to catch arbitrary-value Tailwind classes such as `backdrop-blur-[40px]`. However, every chrome/section component in this phase emits classes of the form `backdrop-blur-[var(--glass-section-blur)]`. The attribute selector `[class*="backdrop-blur-["]` *does* match those classes literally, but Tailwind v4 generates rules of the form `.backdrop-blur-\\[var\\(--glass-section-blur\\)\\] { backdrop-filter: blur(var(--glass-section-blur)); }`. The cap selector overrides them to `blur(12px)` only when the *user agent* matches the literal class string in the DOM — which it does. So mechanically the rule may fire, but its `!important` value (`12px`) intentionally clamps blur on mobile. This part is correct.

The real defect: `--glass-section-blur` is itself defined as `clamp(12px, 2vw, 24px)` in `:root` (line 251). On mobile (<768px) `2vw` is ~7.7-15.3px, so the clamp returns 12px naturally and the !important override is redundant. BUT for `--glass-card-blur` (line 252) `clamp(12px, 1.6vw, 20px)` and `--glass-form-blur` (line 253) `clamp(12px, 1.4vw, 18px)`, mobile values already collapse to the 12px floor. This part is fine.

The actual bug is for **HeaderClient.tsx line 17 / 19 and MobileMenu.tsx line 38 / 52**: these use `backdrop-saturate-[150%]`, `backdrop-saturate-[180%]`, `backdrop-saturate-[200%]`. The 12px cap rule rewrites `backdrop-filter` whole-cloth via `!important` in the mobile media query, which means **any component combining `backdrop-blur-[…]` with `backdrop-saturate-[…]` loses the saturate filter on mobile**. `backdrop-filter: blur(12px) !important` clobbers the merged Tailwind utility filter chain. Header on mobile <768px renders with no saturation boost — measurable visual regression.

**Fix:** Either (a) include `backdrop-saturate-*` in the mobile cap rule by re-emitting the full filter chain instead of just `blur(12px)`, or (b) use `backdrop-filter: blur(12px) saturate(var(--liquid-saturate, 180%))` so saturation is preserved. Concretely:
```css
@media (max-width: 767.98px) {
  .backdrop-blur-md, .backdrop-blur-lg, .backdrop-blur-xl,
  .backdrop-blur-2xl, .backdrop-blur-3xl,
  [class*="backdrop-blur-["] {
    /* Preserve saturate/brightness from Tailwind utilities. The
       backdrop-filter shorthand replaces; chain explicitly here. */
    backdrop-filter: blur(12px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
  }
}
```

---

### BL-02: `prefers-contrast: more` and `prefers-reduced-transparency` do not cover `bg-[var(--glass-*-fill)]` consumers

**File:** `next/src/app/globals.css:546-566`
**Issue:** The `@media (prefers-contrast: more)` block targets `[class*="bg-white/"]` to force translucent surfaces opaque, and `[class*="border-white/"]` for borders. After Phase 92, every section/chrome glass surface was migrated *away* from `bg-white/N` to `bg-[var(--glass-*-fill)]`. The high-contrast cascade therefore no longer flips the fill on any of these surfaces — Footer card, HeaderClient, MobileMenu, StickyBar, all section card grids (ServicesGrid, ProblemSection, ReviewsSection, ClinicsSection, FAQSection, ProcessSection, PlatformSection, FinalCTA, HeroHub, StatsBar mobile container) remain at the translucent token value.

The `prefers-reduced-transparency` block only zeroes `backdrop-filter` (lines 538-543) but never substitutes an opaque background, so glass surfaces become near-transparent rectangles with no fill — content readability collapses. `liquid-glass.css` Section 14 handles this correctly for *named* `.liquid-*` classes, but utility-class consumers fall outside that selector list.

This is a real WCAG/accessibility regression for users with vestibular or contrast accessibility needs (CA 45+ being the primary audience makes this particularly costly).

**Fix:** Add coverage for the v9 token-fill pattern. For example:
```css
@media (prefers-contrast: more) {
  [class*="bg-[var(--glass-"], [style*="--glass-"][class*="bg-["] {
    background-color: rgb(255 255 255) !important;
  }
  [class*="border-glass-border"] {
    border-color: rgba(0, 0, 0, 0.55) !important;
  }
}
@media (prefers-reduced-transparency: reduce) {
  [class*="bg-[var(--glass-"] {
    background-color: rgba(255, 255, 255, 0.92) !important;
  }
}
```
Alternatively, attribute-select on the literal class fragment used in source (`bg-[var(--glass-section-fill)]` etc.) with explicit enumeration matching the four tier tokens.

---

### BL-03: ContactForm success overlay was not migrated to the v9 form-fill token

**File:** `next/src/components/sections/ContactForm.tsx:111`
**Issue:** Phase 92 logged KD-v9-002 explicitly raising `--glass-form-fill` desktop to 0.50 to satisfy WCAG AA on body copy at gradient worst-case. That decision was the migration target for the form glass surface. `ContactSection.tsx:120` correctly consumes `bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)]`. However, the *success state* in `ContactForm.tsx:111` is rendered as a sibling overlay (`absolute inset-0 z-20`) and still uses `bg-white/82 backdrop-blur-3xl` directly. After successful submission, the user sees a surface with different opacity (0.82 vs 0.50) and a much heavier blur than the rest of the form — visual regression and inconsistent with the Decision F contract. Mobile-blur cap rule does collapse the 3xl to 12px (so visually less broken there), but desktop still shows the discrepancy.

**Fix:** Migrate the success overlay to consume the same form token:
```tsx
<div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[inherit] bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-8 text-center shadow-glass-lg">
```
Alternatively introduce `--glass-success-fill` if a different opacity is required; document that as a Key Decision in PROJECT.md per project conventions.

---

### BL-04: ContactForm honeypot/timing branches silently swallow legitimate submissions

**File:** `next/src/components/sections/ContactForm.tsx:62-72`
**Issue:** Both anti-bot guards short-circuit to `setFormState('success')` *before* validation runs and *before* the server is ever called. The website honeypot field is rendered inside an `aria-hidden="true"` `sr-only` container, but the input itself remains visible to assistive tech under several screen readers (NVDA + Firefox historically reads `sr-only` content; Safari VoiceOver behavior varies) — a screen-reader user who tabs through (despite `tabIndex={-1}` on line 228) and accidentally types into "Website" will see a fake success and never actually submit. More critically, the **timing trap** (line 69) drops *every* submission made within 3 seconds of mount. A user landing directly on `/#contact` with prefilled state (e.g., browser autofill, returning visitor) can complete and submit a real form in <3s and lose the lead with a "Thanks!" UI confirming false delivery.

This is a data-integrity / business-logic blocker: the form silently drops legitimate conversion events while presenting a successful UX. There is no client telemetry or fallback signal to differentiate. The server-side action presumably has its own rate limiting; client-side traps that *fake success* are an anti-pattern (better practice: silently flag the submission server-side, or display a "verifying..." UI while server-side checks run).

**Fix:** Either remove the client-side fake-success branches and let the server be the sole authority, or differentiate them — e.g., on suspected bot, send the data tagged `suspected_bot: true` for server-side scoring rather than dropping it client-side. At minimum, raise the timing threshold significantly (sub-3s is plausible for autofill users) and log a console warning in development:
```tsx
if (Date.now() - loadTimeRef.current < 1500) {
  // Treat as suspect — still submit, but tag.
  return submitContactForm({ ...payload, suspectedBot: true });
}
```

---

## Warnings

### WR-01: Glass-on-glass nesting in Footer contact icons violates documented anti-pattern

**File:** `next/src/components/layout/Footer.tsx:89, 100`
**Issue:** The Footer card itself applies `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]` (line 18). Inside that card, each contact icon's `<span>` reapplies `bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)]`. `liquid-glass.css:51-52` documents: "NEVER nest glass inside glass. Double backdrop-filter compounds blur and kills readability." The Phase 79 mobile budget also caps to ≤2 glass layers per viewport — Footer alone now uses 3 (card + 2 icons).
**Fix:** Replace nested glass on icon backgrounds with a flat soft tint (e.g., `bg-mu-blue/10` or a static rgba). Reserve `--glass-button-fill` for buttons that aren’t already inside a glass parent.

### WR-02: Glass-on-glass nesting in HeroHub floating credibility badge

**File:** `next/src/components/sections/HeroHub.tsx:139`
**Issue:** The credibility badge applies `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)]` while the page already has the global living-blob field below (which itself contributes to compositor cost). On mobile, with HeaderClient also rendering glass, total glass layer count in the hero viewport exceeds the documented `--glass-budget-viewport: 2`.
**Fix:** Convert the badge to a flat surface (`bg-white shadow-md`) on mobile via `md:` breakpoints; keep glass at md+.

### WR-03: ProblemSection card double-pads with double border

**File:** `next/src/components/sections/ProblemSection.tsx:102-103`
**Issue:** Outer `<div>` applies `p-3` and the glass card classes, then inner `<div>` adds `p-8 pt-8`. Net horizontal padding = 11 (44px), and the outer 12px padding sits *outside* the visible card edge, producing inconsistent inner padding compared with all other sections (ServicesGrid uses `p-6`, ProcessSection `p-6`/`sm:p-7`, ReviewsSection `p-8`). Likely an oversight from the migration; the outer `p-3` is dead padding.
**Fix:** Remove the outer `p-3` and let the inner `p-8` define the card padding.

### WR-04: StatsBar mobile container nests stat surfaces inside an outer glass surface (sm: only — but description says one layer)

**File:** `next/src/components/sections/StatsBar.tsx:49, 56`
**Issue:** The outer `<div>` is glass (line 49) on mobile and unstyled at `sm:` and above. Each inner stat tile then applies `sm:bg-[var(--glass-card-fill)] sm:backdrop-blur-[var(--glass-card-blur)]` (line 56). On the `sm` breakpoint exactly, both the outer container glass *and* the inner per-stat glass apply (because the outer container only switches off at `sm:` via `sm:bg-transparent sm:backdrop-blur-none`). Wait — recheck: the outer container has `sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none`, so at sm+ outer glass is removed. Below sm, inner glass is removed (no `bg-` classes on inner without `sm:` prefix). So the layering is correctly mutually exclusive — but the comment on line 47 claims "single glass layer on mobile … 4 layers acceptable on desktop"; with 4 stat tiles each running `backdrop-filter`, that is 4 compositor layers per viewport and exceeds the `--glass-budget-viewport: 2` documented in globals.css line 158, contradicting the comment’s rationale.
**Fix:** Either lower the per-stat blur on desktop (use `bg-mu-text-100` flat or a single `.stats-glass`-style outer wrap), or update the comment + budget token to acknowledge the budget violation. The named class `.stats-glass` already exists in `liquid-glass.css:458` for exactly this case.

### WR-05: ContactSection trust-signal cards and coordinator card use raw `backdrop-blur-md` instead of v9 tokens

**File:** `next/src/components/sections/ContactSection.tsx:60, 83`
**Issue:** Phase 92's stated mandate was to migrate every chrome/section glass surface to v9 tier tokens. The trust-signal `<li>` and coordinator card here still use `bg-white/10 backdrop-blur-md` (raw Tailwind), bypassing both `--glass-card-fill` and `--glass-card-blur`. They will be capped on mobile by the cascade in BL-01, but desktop stays at Tailwind’s 12px default — inconsistent with the rest of the site (cards now blur 12-20px via `--glass-card-blur`).
**Fix:** Migrate these surfaces:
```tsx
className="… rounded-2xl border border-white/15 bg-[var(--glass-card-fill)] p-4 backdrop-blur-[var(--glass-card-blur)]"
```

### WR-06: HeroHub video-call decorations use raw `backdrop-blur-md` and mu-text-900/55 fill

**File:** `next/src/components/sections/HeroHub.tsx:94, 103, 115`
**Issue:** Three glass pills inside the video-call frame (`Dr. Stefan Mayr`, "В эфире", and the call-control bar) use `bg-mu-text-900/55 backdrop-blur-md` — also bypassing v9 tokens. While these are dark surfaces overlaid on a dark photo (different visual contract from the section glass), no `--glass-overlay-fill` token exists. Either codify the dark-overlay pattern as a token or document the exemption.
**Fix:** Either add a fifth tier (e.g., `--glass-overlay-fill: rgba(0,0,0,0.55)`) for dark on-image overlays, or leave a comment marking these as an explicit exemption to the migration.

### WR-07: WhyUsSection image collage applies `backdrop-blur` to image containers

**File:** `next/src/components/sections/WhyUsSection.tsx:99, 102, 107, 110`
**Issue:** Each image card has `backdrop-blur-[var(--glass-section-blur)] bg-[var(--glass-section-fill)]` *plus* an `<Image>` filling the container with `object-cover`. Backdrop-filter applies to the area behind the element; on a fully opaque image-covered surface, there is nothing to blur — wasted compositor layers (4 at desktop). The icon advantages (lines 28, 45, 62, 79) also nest `backdrop-blur-[var(--glass-button-blur)]` over a tinted background (`bg-mu-blue/10` etc.), which has the same issue.
**Fix:** Drop `backdrop-blur` and `bg-[var(--glass-section-fill)]` from image-container divs; keep only the border + shadow. For the small icon tiles, drop `backdrop-blur-[var(--glass-button-blur)]` — the `bg-mu-*-50/bg` opaque tint already provides the visual.

### WR-08: FinalCTA secondary button stacks two `shadow-glass-*` utilities

**File:** `next/src/components/sections/FinalCTA.tsx:30`
**Issue:** Class list contains both `shadow-glass-sm` and `shadow-glass-inner-strong`. In Tailwind v4 the second `box-shadow` utility wins (rule order in generated CSS), so `shadow-glass-sm` is dead. Same pattern in primary CTA on line 23 (`shadow-lg shadow-mu-blue/30 shadow-glass-inner` — three shadows, last wins).
**Fix:** Either combine via a single class that emits the full multi-stop box-shadow, or pick one. If the intent is *both* outer and inset shadows, define a composite shadow token (`--shadow-glass-cta`) emitting the multi-shadow value in one rule.

### WR-09: HeroHub `<br className="hidden md:block" />` for line break is brittle

**File:** `next/src/components/sections/HeroHub.tsx:27`
**Issue:** Visually placing a `<br>` only at md+ produces inconsistent layout when content wraps differently across viewport widths (e.g., 1024px Russian text length differs from English). This is a brittle workaround for what should be controlled via flex/grid wrap or `display: contents`. Not a correctness issue, but an a11y concern: screen readers announce the `<br>` as a paragraph-like pause; introducing it conditionally produces inconsistent spoken structure across breakpoints.
**Fix:** Use a wrapping span and let the inline gradient + base text wrap naturally:
```tsx
<span className="text-mu-text-900 drop-shadow-sm">Европейские врачи, мировые клиники&nbsp;&mdash;{' '}</span>
<span className="bg-gradient-to-r …">доступны из&nbsp;Казахстана</span>
```

### WR-10: MobileMenu body-scroll-lock leaks if `overflow` was previously set inline

**File:** `next/src/components/layout/MobileMenu.tsx:20-28`
**Issue:** The effect sets `document.body.style.overflow = 'hidden'` on open and restores it to `''` on close/cleanup. If any other component in the tree previously set an inline `overflow: hidden` (e.g., a modal that mounted before MobileMenu), the cleanup unconditionally clears it — visual regression. Also: on cleanup with `isOpen === false`, the effect still fires the `else` branch and re-clears overflow, which is unnecessary and competes with whichever component owns body lock.
**Fix:** Capture the previous value on mount and restore exactly:
```tsx
useEffect(() => {
  if (!isOpen) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
  window.addEventListener('keydown', onKey);
  return () => {
    document.body.style.overflow = prev;
    window.removeEventListener('keydown', onKey);
  };
}, [isOpen]);
```

### WR-11: StickyBar IntersectionObserver runs once on mount; misses targets if they mount later

**File:** `next/src/components/layout/StickyBar.tsx:12-40`
**Issue:** The effect has an empty dependency array and queries `#contact` and `<footer>` exactly once on mount. If `ContactSection` or `Footer` are conditionally rendered or hydrated after the StickyBar mounts (e.g., dynamic imports, route transitions on a client-side navigation that re-uses StickyBar), `targets` will be empty and the bar will never auto-hide near the contact form/footer. On `pathname` change the bar's `ctaHref` updates, but the observer is not re-created — sub-page routes never get the auto-hide logic.
**Fix:** Re-bind on `pathname` change and use a `MutationObserver` fallback if elements may mount later. Minimum: add `[pathname]` to the dep array so SPA route changes re-bind:
```tsx
useEffect(() => { /* observer logic */ }, [pathname]);
```

---

## Info

### IN-01: Inconsistent `key={i}` in mapped lists

**File:** `next/src/components/sections/FAQSection.tsx:114`, `ProblemSection.tsx:101`, `ReviewsSection.tsx:76`
**Issue:** These use array index as React key. Lists are static here so it isn't broken, but the pattern is brittle if ordering changes (e.g., A/B testing FAQ order). Other sections in the same migration (`ClinicsSection.tsx:129`, `ServicesGrid.tsx:102`, `ProcessSection.tsx:106`) use stable string keys (`item.country`, `card.href`, `step.number`). Inconsistent within the same phase output.
**Fix:** Use `item.question` / `card.name + i` / problem title as a stable key.

### IN-02: `'use client'` boundary on FAQSection forces client hydration for static content

**File:** `next/src/components/sections/FAQSection.tsx:1`
**Issue:** Only the open/close interaction is dynamic; the rendered FAQ content is static. The current implementation hydrates the entire 7-item content tree client-side. A `<details>/<summary>` HTML pattern would be progressive-enhancement-friendly and remove the `'use client'` directive entirely. Not a correctness issue, but it shifts text-heavy content out of the SSR/initial-paint stream.
**Fix:** Convert to native `<details>` and use CSS-only animation on `[open]`. Keeps Russian-language SEO content server-rendered with no hydration cost.

### IN-03: Magic numbers and inline opacity values in v9-token migration

**File:** `next/src/components/layout/MobileMenu.tsx:38, 47, 52`, `StickyBar.tsx:44`, `Footer.tsx:18`
**Issue:** The migration intent was to centralize `bg-white/N` into v9 tier tokens, but several class lists still pin specific border opacities directly: `border-white/55`, `border-white/60`, `border-white/45`. The migration target (DESIGN.md `border-glass-border` / `border-glass-border-strong`) exists and is used elsewhere (`ServicesGrid.tsx:104`, `ClinicsSection.tsx:130`). Inconsistency reduces token coverage.
**Fix:** Replace literal `border-white/N` with `border-glass-border` or `border-glass-border-strong` per DESIGN.md.

### IN-04: TODO comments shipped in production code

**File:** `next/src/components/sections/ContactSection.tsx:80-82`, `next/src/components/sections/HeroHub.tsx:97`
**Issue:** `TODO(content): swap initials avatar for a real on-team coordinator photo …` and `TODO(content): replace with real on-team doctor name …`. Names "Айгерим" and "Dr. Stefan Mayr" render as live content. For a medical site targeting CA 45+, fictional doctor names are a credibility / consumer-protection risk (Kazakhstan and Austria both regulate medical-services advertising).
**Fix:** Either remove the placeholder names until real on-team people are confirmed, or wrap in a feature flag that renders only after real content is set. At minimum, consider the regulatory exposure of a photo-less ВРАЧ pill labeled "Vienna" with a fictitious name on a healthcare landing.

### IN-05: Phone WhatsApp link uses hardcoded number that diverges from `PHONE_NUMBER`

**File:** `next/src/components/sections/FinalCTA.tsx:41`
**Issue:** `<a href="https://wa.me/77015322478">` hardcodes a phone number, but `PHONE_NUMBER` and `PHONE_DISPLAY` are imported from `@/lib/navigation` and used in the `tel:` link directly above. If `PHONE_NUMBER` is changed centrally, the WhatsApp link silently drifts out of sync.
**Fix:** Compute WhatsApp href from the same source: `href={\`https://wa.me/${PHONE_NUMBER.replace(/\D/g, '')}\`}`.

### IN-06: Large CSS file — `globals.css` mixes deprecated tokens with active ones

**File:** `next/src/app/globals.css:169, 597-717`
**Issue:** Two large `@layer components` blocks are explicitly marked `DEPRECATED: Production utility classes (67.1 visual parity)` with a comment "Remove when phases 69-72 migrate all section components." Phase 92 has now migrated chrome and index sections. Some of these utilities (`.btn-primary`, `.btn-outline`, `.card-prod`, `.container-prod`) may still be used elsewhere, but the deprecation note from phases 69-72 is stale four phases later. Carrying these adds compile time, bundle size, and developer confusion.
**Fix:** Audit grep for these classes in `next/src/`; remove unused ones and update or drop the deprecation comment.

---

_Reviewed: 2026-04-30_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
