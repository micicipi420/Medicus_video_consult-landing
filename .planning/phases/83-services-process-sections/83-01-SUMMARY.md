# Plan 83-01 Summary — Services & Process Sections

**Status:** Complete
**Date:** 2026-04-30
**Files modified:** 2 source files (full rewrites)

## What was built

### ServicesGrid (`next/src/components/sections/ServicesGrid.tsx`)
- Reduced from 3 image-heavy cards to **4 compact icon cards** matching Phase 83 spec
- New title "Мы помогаем на каждом этапе" (was "Выберите, что вам нужно")
- 4 cards: Online consultation → `/consultations`, Чек-ап → `/checkup`, Treatment abroad → `/treatment-abroad`, Corporate B2B чек-апы → `/checkup#b2b`
- Whole card is the Link (larger tap target, simpler interaction)
- Scoped transition `transition-[background-color,border-color,box-shadow,transform]`
- 1-col mobile / 2-col sm / 4-col lg

### ProcessSection (`next/src/components/sections/ProcessSection.tsx`)
- Step structure preserved (4 steps with same titles); added per-step **icon** (FileSearch, Plane, HeartPulse, ClipboardList) shown in a glass-tinted square next to the gradient number badge
- Tightened descriptions for scannability
- Added horizontal **dotted connector** line: single absolute element, `border-t-2 border-dotted border-mu-text-700/25`, `top-[64px]`, spanning `left-[12%] right-[12%]`, `hidden md:block` (no DOM weight on mobile)
- All transitions scoped

## Requirements covered

- SVC-01 — 4 cards with icons in glass style ✓
- SVC-02 — icon + title + short scannable description ✓
- SVC-03 — all 4 hrefs reach existing destinations ✓

## Self-Check: PASSED

All 9 must-haves verified statically (see VERIFICATION.md).
