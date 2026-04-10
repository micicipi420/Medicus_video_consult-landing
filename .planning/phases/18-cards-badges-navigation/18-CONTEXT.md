---
phase: 18
name: Cards, Badges & Navigation
status: context_captured
requirements: CARD-04, CARD-05, CARD-06, NAV-01
---

# Phase 18 Context

## Goal
Cards are flat with larger radius, badges use mint palette, and navigation matches medicusunion.kz style.

## Requirements → Implementation Map

### CARD-04: Border-radius 30px
- Change `--radius-lg` from `1.25rem` (20px) to `1.875rem` (30px)
- This affects `.card` which uses `var(--radius-lg)` at line 297
- Location: `:root` in css/styles.css line 116

### CARD-05: Remove all card shadows
- Remove `box-shadow: var(--shadow-md)` from `.card` (line 298)
- Remove `box-shadow: var(--shadow-lg)` from `.card:hover` (line 307)
- Keep `transform: translateY(-2px)` on hover for subtle interaction feedback
- Location: css/styles.css lines 295-308

### CARD-06: Mint badges
- Change `.pricing__badge` background from `var(--color-primary)` (cyan) to `#d0fae4` (mint)
- Change `.pricing__badge` text color from `var(--color-text-on-primary)` to `#007955` (dark green)
- Add badge token vars: `--color-badge-bg: #d0fae4` and `--color-badge-text: #007955`
- Location: css/styles.css lines 859-872

### NAV-01: White nav 76px height
- Navigation already has white background (`var(--color-white)`) at line 350 ✓
- Change header height to 76px on desktop — currently uses `padding-block: var(--space-2)` (16px total)
- Set explicit `height: 76px` on desktop or adjust padding to achieve 76px
- Remove the `::after` gradient accent line (lines 366-371) — medicusunion.kz has no accent line
- Location: css/styles.css lines 349-371

## Grey Areas (Resolved)
- Card hover: keep translateY(-2px) but remove shadow change (flat design = no shadows in any state)
- Badge scope: only `.pricing__badge` exists currently — update it to mint palette
- Nav height: use explicit height on desktop media query, keep flexible on mobile
- Gradient accent line on header: remove it — .kz has clean white nav without decoration

## Files to Modify
- `css/styles.css` — all changes in this single file
