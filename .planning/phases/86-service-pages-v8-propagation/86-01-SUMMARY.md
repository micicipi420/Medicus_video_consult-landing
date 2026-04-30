# Plan 86-01 Summary — Service Pages v8.0 Propagation

**Status:** Complete
**Date:** 2026-04-30
**Files modified:** 6 (extracted from `stash@{0}`)

## What was built

Surgical extraction from your stash of v8.0-aligned upgrades to:

| File | Change |
|------|--------|
| `ServiceHero.tsx` | Scoped transitions, mobile-tightened sizing, headline cap, variant→DOM attribute |
| `LeadFormSection.tsx` | Responsive padding, glass tint bump |
| `ContactForm.tsx` | Plays well in both gradient-card and glass-card contexts |
| `/checkup/page.tsx` | Section ordering tweaks |
| `/consultations/page.tsx` | Section ordering tweaks |
| `/treatment-abroad/page.tsx` | Section ordering tweaks + remove unused `PHONE_NUMBER` import |

## Build verification

```
✓ Compiled successfully in 1.8s
✓ Generating static pages (11/11)
Zero lint warnings
```

## Side effects

- Auto-resolves HYG-01 (both pre-existing lint warnings) — `variant` is now used in ServiceHero, `PHONE_NUMBER` removed from treatment-abroad page

## Provenance

100% extracted from `stash@{0}` via `git checkout stash@{0} -- <files>`. No reinterpretation. Stash entry still intact for remaining Phase 88 work.
