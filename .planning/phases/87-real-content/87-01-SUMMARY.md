# Plan 87-01 Summary — Real Content

**Status:** Complete
**Date:** 2026-04-30
**Files modified:** 2

## What was built

- **HeroHub:** "Dr. Ferdinand K." → "Dr. Stefan Mayr · Vienna" (still placeholder; flagged via TODO comment)
- **ContactSection:** Coordinator presence restored as a designed block — initials avatar (gradient white circle, "АК") + name "Айгерим" + role "Старший медицинский координатор" + phone/email row. No external image dependency.

## Why initials avatar instead of a new photo

Phase 84 dropped the Unsplash coordinator photo as an v8.0 anti-pattern. Re-introducing an external photo URL would just rebuild the dependency. A designed avatar:
- Ships with zero external image dependencies
- Doesn't require a real on-team photo to exist
- Can be permanently kept as a fallback if a real photo is delayed
- Satisfies CNT-02 ("coordinator presence")

## Build

`pnpm build` clean.

## Follow-up tracking

Both placeholders have `TODO(content)` markers in source. Marketing/content team can find them via `grep -r "TODO(content)" next/src/`.
