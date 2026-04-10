---
status: awaiting_human_verify
trigger: "invisible-glass-on-white: liquid glass cards appear as flat white rectangles on white section backgrounds"
created: 2026-04-09T12:00:00Z
updated: 2026-04-09T12:30:00Z
---

## Current Focus

hypothesis: Glass tokens are too subtle for white-on-white — --liquid-bg opacity 0.18 is invisible, shadow opacity 0.12 is barely visible, rim lighting white-on-white invisible. Sections have no background variation for backdrop-filter to blur against.
test: Adjust tokens in theme.css to increase opacity/contrast; add section background tints
expecting: Cards become visually distinct with depth, frosted appearance, visible shadows
next_action: Apply token changes to theme.css (--liquid-bg, --liquid-shadow-outer, --liquid-border-top) then add section background utility class in liquid-glass.css

## Symptoms

expected: Cards should show visible glass material -- frosted translucency with subtle depth, rim highlights visible at top edge, shadows giving depth. Apple iOS 26 Liquid Glass aesthetic.
actual: All cards on all pages look like plain white rectangles. No visible glass effect, no depth, no shadows. backdrop-filter blur on white background = invisible. The liquid-card-wrap shadows (0 16px 40px rgba(20,30,60,0.12)) are too subtle on light backgrounds.
errors: No CSS errors. The glass CSS is technically correct but the visual design doesn't work on white/near-white section backgrounds.
reproduction: Open any page at http://localhost:8080 -- all cards look like flat white boxes.
started: Since v4.0 migration.

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-04-09T12:01:00Z
  checked: theme.css light-mode liquid tokens
  found: --liquid-bg: rgba(255,255,255,0.18) -- nearly transparent on white. --liquid-shadow-outer: 0 16px 40px rgba(20,30,60,0.12) -- 12% opacity barely visible. --liquid-border-top: rgba(255,255,255,0.9) -- white border on white = invisible. --liquid-shadow-inset-top: inset 0 1px 0 rgba(255,255,255,0.8) -- same problem.
  implication: All glass tokens are calibrated for colored backgrounds. On white, everything is white-on-white = invisible.

- timestamp: 2026-04-09T12:02:00Z
  checked: Section backgrounds across all pages
  found: All sections have no background color. body is bg-background (#ffffff). index.html has fixed mesh-bg blobs (mu-blue/30, mu-green-300/20, mu-accent-blue/15) but these are very subtle and only color the hero area significantly. Inner pages have NO mesh-bg at all.
  implication: Cards sit on pure white everywhere except index.html hero vicinity. backdrop-filter has nothing to blur/tint.

- timestamp: 2026-04-09T12:03:00Z
  checked: Dark mode tokens in .dark block
  found: Dark mode has --liquid-bg: rgba(30,40,60,0.45), --liquid-shadow-outer with 0.45 opacity. These would be visible because the background is dark and the glass has a blue tint. Light mode needs analogous treatment.
  implication: The fix needs to increase light-mode token values to be visible on white/light backgrounds.

## Resolution

root_cause: Light-mode liquid glass tokens (--liquid-bg, --liquid-shadow-outer, --liquid-border-top) have opacity values calibrated for colored backgrounds. On the actual white (#ffffff) page background, white glass on white = invisible. Additionally, section backgrounds are all white with no tints, giving backdrop-filter nothing to work with.
fix: |
  1. theme.css: Raised --liquid-bg from rgba(255,255,255,0.18) to rgba(255,255,255,0.42) so glass surface is self-evident on white.
  2. theme.css: Raised --liquid-shadow-outer opacity from 0.12 to 0.16 for visible card depth.
  3. theme.css: Changed --liquid-border-top from rgba(255,255,255,0.9) to rgba(220,225,235,0.7) -- subtle grey tint visible against white.
  4. theme.css: Changed --liquid-border-bottom to rgba(200,210,225,0.25) for subtle bottom edge definition.
  5. theme.css: Changed --liquid-shadow-inset-bottom to rgba(200,210,225,0.15) for inner bottom edge.
  6. theme.css: Raised --liquid-shadow-inset-top to rgba(255,255,255,0.95) for stronger top rim.
  7. liquid-glass.css: Added 3 section tint utility classes (.section-tint-cool, .section-tint-warm, .section-tint-mint) with dark-mode suppression.
  8. All 5 main pages: Applied alternating section-tint-cool/warm/mint to content sections so backdrop-filter has color variation.
verification: Build succeeds. Compiled CSS contains correct token values and new tint classes. Awaiting visual verification.
files_changed:
  - src/styles/theme.css
  - src/styles/liquid-glass.css
  - css/styles.css
  - index.html
  - online-consultations.html
  - treatment-abroad.html
  - checkup.html
  - contacts.html
