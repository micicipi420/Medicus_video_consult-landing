// next/tests/visual/baseline.spec.ts
// v9.0 Phase 93 Plan 00 (Wave 0) — Per-route visual-regression baseline.
//
// Captures pre-Phase-93 baseline at HEAD of feat/v3.1 (post-Phase-92 merge).
// Wave 1+ visual diffs validate against these snapshots.
//
// Determinism contract (RESEARCH §Pattern 4 + 93-PATTERNS.md "Wave 0 Playwright determinism"):
//
//   STRATEGY=reducedMotion (chosen Wave 0 Task 1).
//     Reason: next/src/lib/blob-engine/debug.ts exposes window.__blobDebug
//     as a READ-ONLY snapshot getter (rafCount, mode, pointer, heat, ...).
//     The setMode() method was NOT implemented in Phase 91, so the planned
//     primary path is unavailable; the documented fallback is used instead.
//
// Blob exclusion strategy (deviation from plan-00, Rule 1 fix):
//   The plan asked to mask `.living-blob-field` via Playwright's `mask`
//   option. However `.living-blob-field` is `position: fixed; inset: 0`
//   (covers the full viewport), so the mask paints magenta over the whole
//   screenshot — every route became a flat magenta PNG, identical bytes.
//   We instead inject CSS to set `display: none !important;` on the field
//   *and* its canvas/sublayers via addStyleTag. This removes the
//   non-deterministic surface entirely while leaving the actual page
//   content (which sits at higher z-index) visible for diffing.
//
// Viewports come from playwright.config.ts projects (desktop 1280x800,
// mobile-375 375x667 @2x DPR).
//
// Routes (4) × projects (2) = 8 baseline PNGs total.

import { test, expect } from '@playwright/test';

const routes = [
  '/checkup',
  '/consultations',
  '/treatment-abroad',
  '/contacts',
] as const;

// Run serial within this describe to avoid baseline flake from parallel
// requests hammering a single dev server. fullyParallel still applies
// across projects (desktop vs mobile-375 run in parallel as separate
// workers, each with its own dev-server reuse).
test.describe.configure({ mode: 'serial' });

test.describe('visual-regression', () => {
  test.beforeEach(async ({ page }) => {
    // STRATEGY=reducedMotion fallback (see header comment).
    // Must precede page.goto so the media query is honored at first paint.
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  for (const route of routes) {
    const slug = route.slice(1) || 'home';

    test(`${route} — visual baseline`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });

      // Hide the non-deterministic blob field (and its canvas) so the
      // diff focuses on stable layout/glass surfaces. See header comment
      // for why we do not use Playwright's `mask` option here.
      // Also hide Next.js dev-mode indicators (build-watcher badge,
      // hot-reload portal) — these flicker in/out between runs and
      // produced a 1-test flake on the first determinism re-run.
      await page.addStyleTag({
        content: `
          .living-blob-field,
          .living-blob-field .blob-canvas,
          .living-blob-field .blob-sublayer { display: none !important; }
          nextjs-portal,
          #__next-build-watcher,
          [data-nextjs-toast],
          [data-next-mark] { display: none !important; }
        `,
      });

      // Wait for fonts to fully load before snapshotting — `networkidle`
      // can fire before the web-font swap completes, producing 1-pixel
      // anti-alias diffs on heading text between runs.
      await page.evaluate(() => document.fonts.ready);

      // Settle late hydration / lazy components / web-font swap.
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${slug}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
