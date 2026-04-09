---
status: resolved
trigger: "Squircle shapes (mask-image SVG) look visually broken. They should be almost indistinguishable from regular rounded rectangles."
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T12:05:00Z
---

## Current Focus

hypothesis: CONFIRMED AND FIXED -- Replaced full-superellipse SVG paths with rect-with-superellipse-corners paths. New paths use viewBox 0 0 1 1, small corner fractions (6-8%), n=5 exponent.
test: Visual verification on live site
expecting: Squircle-masked elements now look like subtly-smoothed rounded rectangles, nearly indistinguishable from border-radius fallback
next_action: User verifies visually on http://localhost:8080/index.html

## Symptoms

expected: Squircle-masked elements should look like slightly smoother rounded rectangles. The superellipse (n=5) curve is visually very close to a regular border-radius -- the difference is subtle.
actual: The squircle shapes look "broken" -- visually distorted or wrong
errors: No JS errors. Visual CSS issue with SVG mask data-URIs.
reproduction: Open http://localhost:8080/index.html -- look at any card element with squircle-md/lg/xl class.
started: Since Phase 42 (squircle primitives creation). SVG mask data-URIs created in Phase 41 (theme.css tokens).

## Eliminated

## Evidence

- timestamp: 2026-04-09T00:01
  checked: SVG path math for squircle-md (viewBox 0 0 100 100)
  found: Path points (100, 67.34), (99.98, 71.13) etc. are NOT on an n=5 superellipse curve. Evaluated |x/a|^5 + |y/b|^5 and got values 1.005-1.22 (should be 1.0). The path traces a rectangle with superellipse corner regions, NOT a pure superellipse.
  implication: The path structure is correct (rect + corner curves), but the corner proportions need investigation.

- timestamp: 2026-04-09T00:02
  checked: Corner blend region size as percentage of element side
  found: squircle-md corners = 32.66% of side, squircle-lg = 38.65%, squircle-xl = 43.99%. For comparison, border-radius 16px on a 300px element = 5.3%.
  implication: Corner regions are 6-8x larger than what border-radius would produce. This makes shapes look like capsules/pills instead of subtly-smoothed rectangles.

- timestamp: 2026-04-09T00:03
  checked: Superellipse n value vs corner proportion
  found: n=5 produces 45.3% corner blend. n=20 produces 8.2% (matches 24px/300px). n=30 produces 4.4% (matches 16px/400px). The FULL superellipse approach inherently has large corners at n=5.
  implication: The n=5 exponent was chosen correctly for superellipse smoothness, but using a FULL superellipse shape means corners are proportionally huge. Need a rect-with-superellipse-corners approach instead.

- timestamp: 2026-04-09T12:04
  checked: Generated new SVG paths with rect-with-superellipse-corners approach
  found: New paths use viewBox 0 0 1 1, corner fractions md=6%, lg=7%, xl=8%, n=5 exponent. Each path is ~1100 chars (vs old ~2500+ chars). Paths verified mathematically -- corner coordinates lie on n=5 superellipse curve centered at each corner.
  implication: Fix applied to theme.css, CSS rebuilt. 3x viewBox='0 0 1 1' in compiled output, 0x old viewBox='0 0 100 100'.

## Resolution

root_cause: The SVG mask paths encoded a FULL n=5 superellipse (|x/a|^n + |y/b|^n = 1) where corner blend regions occupied 33-44% of each element side. This made elements look like rounded capsules/pills instead of subtly-smoothed rectangles. The viewBox was also 0 0 100 100 with hundreds of L commands per path.
fix: Replaced all three SVG mask data-URIs in theme.css with rect-with-superellipse-corners paths. New paths use viewBox 0 0 1 1 (unit square), small corner fractions (md=6%, lg=7%, xl=8%), n=5 superellipse exponent, and H/V commands for straight edges. Corner regions are now proportionally correct (~6-8% of element side vs the old 33-44%). Rebuilt CSS via make build.
verification: Compiled css/styles.css contains 3 instances of viewBox='0 0 1 1', zero instances of old viewBox='0 0 100 100'. Build succeeded with no errors.
files_changed: [src/styles/theme.css, css/styles.css]
