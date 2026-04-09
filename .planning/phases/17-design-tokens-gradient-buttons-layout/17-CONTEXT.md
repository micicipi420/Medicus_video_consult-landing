---
phase: 17
name: Design Tokens, Gradient Buttons & Layout
status: context_captured
requirements: TOKEN-02, BTN-04, BTN-05, BTN-06, LAYOUT-01, LAYOUT-02
---

# Phase 17 Context

## Goal
CTA buttons use gradient style matching medicusunion.kz, hero background is white, container is 1200px wide.

## Requirements → Implementation Map

### TOKEN-02: CSS gradient token for CTA
- Add `--gradient-cta: linear-gradient(0.25turn, #1AC67E 0%, #0D9DB5 100%)`
- Add `--color-cta-hover-kz: #00c08e` for hover state
- Location: `:root` block in css/styles.css (line ~53)

### BTN-04: Gradient CTA buttons
- Change `.button--primary` background from `var(--color-cta)` to `var(--gradient-cta)`
- Update `.button--primary:hover` for gradient hover
- Location: css/styles.css lines 280-287

### BTN-05: Border-radius 16px
- Change `.button` border-radius from `100px` to `16px`
- Location: css/styles.css line 272

### BTN-06: Hover transition
- Add opacity transition or color shift to #00c08e on hover
- Update transition property to include opacity
- Location: css/styles.css lines 274-275, 285-287

### LAYOUT-01: Container 1200px
- Already done: `--container-max: 1200px` at line 100
- Verify `.container` uses this token at line 227 ✓

### LAYOUT-02: White hero background
- Change `.hero` background from `#fffbf4` to `#ffffff`
- Location: css/styles.css line 422

## Collateral Changes
- Update `@keyframes pulse-glow` to use gradient-compatible colors (lines 1502-1509)
- The pulse-glow uses `rgba(53, 182, 120, ...)` which is the old solid green — update to match new gradient start color #1AC67E

## Grey Areas (Resolved)
All resolved during requirements approval:
- Gradient direction: 0.25turn (matching .kz exactly)
- Button radius: 16px (not 14px)
- Hover approach: opacity transition (simpler, works with gradients)
- Container already 1200px — just verify

## Files to Modify
- `css/styles.css` — all changes in this single file
