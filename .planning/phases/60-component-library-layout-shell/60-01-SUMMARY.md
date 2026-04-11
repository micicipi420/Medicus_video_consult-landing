---
phase: 60-component-library-layout-shell
plan: 01
subsystem: component-library
tags: [shadcn-ui, components, svg-filters, navigation-config]
dependency_graph:
  requires: [59-next-js-scaffold-css-foundation]
  provides: [shadcn-ui-components, cn-utility, svg-refraction-defs, nav-links-config]
  affects: [next/src/app/globals.css, next/package.json]
tech_stack:
  added: [shadcn/ui (base-nova), @base-ui/react, class-variance-authority, clsx, tailwind-merge, lucide-react]
  patterns: [shadcn component library, cn() class merging, SVG filter defs as Server Component, shared navigation constants]
key_files:
  created:
    - next/components.json
    - next/src/lib/utils.ts
    - next/src/components/ui/button.tsx
    - next/src/components/ui/card.tsx
    - next/src/components/ui/input.tsx
    - next/src/components/ui/select.tsx
    - next/src/components/ui/textarea.tsx
    - next/src/components/ui/dialog.tsx
    - next/src/lib/navigation.ts
    - next/src/components/layout/SvgRefractionDefs.tsx
  modified:
    - next/src/app/globals.css
    - next/package.json
    - next/pnpm-lock.yaml
decisions:
  - shadcn v4 uses "base-nova" style (successor to "new-york") -- accepted CLI default
  - Restored globals.css after shadcn init to preserve MedicusUnion tokens, manually merged only new shadcn additions
  - Added --font-sans mapping to --font-family-body to keep shadcn body font consistent with project fonts
metrics:
  duration: 5min
  completed: "2026-04-10T20:42:18Z"
  tasks: 2
  files: 13
---

# Phase 60 Plan 01: Component Library and Shared Infrastructure Summary

shadcn/ui initialized with 6 base components (Button, Card, Input, Select, Textarea, Dialog) using base-nova style on Tailwind v4; cn() utility, SVG refraction defs, and navigation config established as shared infrastructure for layout components.

## What Was Done

### Task 1: Initialize shadcn/ui and add 6 base components
- Ran `npx shadcn@latest init` which created components.json, utils.ts, and button.tsx
- shadcn init overwrote globals.css with its own token values; restored from backup and manually merged only the necessary additions:
  - Added `@import "shadcn/tailwind.css"` to import chain
  - Added popover, chart, sidebar token families to both `:root` and `.dark`
  - Added corresponding `@theme inline` mappings for new tokens
  - Added `--font-sans` pointing to `var(--font-family-body)` for shadcn component compatibility
  - Added `--radius-2xl`, `--radius-3xl`, `--radius-4xl` extended radius tokens
- All original MedicusUnion tokens preserved: `--mu-*`, `--liquid-*`, `--section-*`, glass hierarchy, motion tokens
- Ran `npx shadcn@latest add card input select textarea dialog` for remaining 5 components
- Build passes with 0 errors

### Task 2: Create shared navigation config and SvgRefractionDefs
- Created `next/src/lib/navigation.ts` with NAV_LINKS, FOOTER_NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY, EMAIL, COMPANY_NAME, TAGLINE
- All nbsp binding applied per project convention (\u00A0 on subject+verb pairs)
- Created `next/src/components/layout/SvgRefractionDefs.tsx` as Server Component (no "use client")
- 3-tier SVG refraction filters: sm (0.02 freq, scale 0), md (0.012 freq, scale 18), lg (0.006 freq, scale 12)
- Build passes with 0 errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] shadcn init overwrote globals.css token values**
- **Found during:** Task 1
- **Issue:** `npx shadcn@latest init` replaced our custom --background, --foreground, --primary, --border, --input values with oklch defaults and changed --font-heading to var(--font-sans)
- **Fix:** Restored globals.css from backup, manually added only the new shadcn token families (popover, chart, sidebar) and @import
- **Files modified:** next/src/app/globals.css
- **Commit:** 7fcc3ce

**2. [Rule 3 - Blocking] shadcn v4 style name changed from "new-york" to "base-nova"**
- **Found during:** Task 1
- **Issue:** Plan specified `--style new-york` but shadcn v4 CLI uses "base-nova" as the default style
- **Fix:** Accepted CLI default; components are functionally identical
- **Files modified:** next/components.json
- **Commit:** 7fcc3ce

## Verification Results

1. `npm run build` -- passes (exit 0, compiled in 728ms)
2. All 6 component files exist in next/src/components/ui/
3. cn() exported from next/src/lib/utils.ts
4. SVG filter IDs liquid-refract-sm/md/lg present in SvgRefractionDefs.tsx
5. NAV_LINKS, FOOTER_NAV_LINKS exported from next/src/lib/navigation.ts
6. --mu-blue: #38C6F4 confirmed in globals.css (tokens preserved)

## Self-Check: PASSED

All 10 created files verified on disk. Both commit hashes (7fcc3ce, 9f74873) confirmed in git log.
