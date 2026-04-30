---
status: passed
phase: 86-service-pages-v8-propagation
verified: 2026-04-30
mode: build+static
must_haves_passed: 8
must_haves_total: 8
notes: pnpm build runs clean — compiled successfully, 11 routes generated, zero lint warnings. Substantive Directus submission round-trip deferred to live UAT in Phase 89.
---

# Phase 86 Verification

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | ServiceHero scoped transitions (no transition-all) | ✅ | grep returns 0 |
| 2 | Headline caps at lg:text-6xl (no overflow at 1366px) | ✅ | line 41 |
| 3 | variant prop wired to data-hero-variant | ✅ | line 26 |
| 4 | LeadFormSection responsive padding | ✅ | outer `p-6 md:p-12`, inner `p-5 sm:p-7 md:p-9` |
| 5 | ContactForm uses submitContactForm | ✅ | 2 references (import + call) |
| 6 | Unused PHONE_NUMBER import removed | ✅ | grep returns 0 |
| 7 | pnpm build compiles clean with 0 warnings | ✅ | "Compiled successfully in 1.4–1.8s" |
| 8 | All 11 routes generate | ✅ | "Generating static pages (11/11)" |

## Requirements Traceability

| Req | Coverage |
|-----|----------|
| PROP-01 | Service pages adopt v8.0 chrome via shared ServiceHero/LeadFormSection components consuming Phase 79 tokens |
| PROP-02 | ServiceHero + LeadFormSection ship scoped transitions, mobile-tightened sizing, canonical class ordering |
| PROP-03 | ContactForm preserved at API surface — `submitContactForm` server action import + call unchanged → Directus path intact |

## Provenance

All 6 source files extracted via `git checkout stash@{0} -- <files>` from the user's pre-existing v8.0-aligned draft work. No reinterpretation. Build verified clean.

Stash@{0} still has remaining content: research-doc rewrites, layout.tsx tweak, globals.css 1-line change (likely conflict with Phase 79), `LiquidBlobLayer.tsx` + `liquid-depth.css` (new files). These are Phase 88 territory.
