// next/tests/e2e/blob-correlated-motion.spec.ts
// v9.0.1 Phase 96 Plan 02 — BR-02 fast-cursor sweep separation assertion.
//
// Drives a deterministic 1.5s diagonal sweep across the viewport (~918 px/s,
// within VELOCITY_MAX = 1500 px/s) and asserts that the rolling max angular
// separation across the 4 sublayers (core / body / halo / glint) stays
// <= 8px — the BR-02 acceptance criterion from ROADMAP.

import { test, expect } from '@playwright/test';

interface BlobDebug {
  mode: string;
  maxAngularSeparation: number;
  resetMaxSeparation: () => void;
}

test.describe('blob correlated motion (BR-02)', () => {
  test('max angular separation across 4 sublayers stays <= 8px under fast sweep', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only — cursor mode');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for the engine to settle into cursor mode.
    await page.waitForFunction(
      () => {
        const w = window as unknown as { __blobDebug?: BlobDebug };
        return Boolean(w.__blobDebug && w.__blobDebug.mode === 'cursor');
      },
      { timeout: 15000 },
    );

    // Reset rolling max so the initialization frame doesn't pollute the sample.
    await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      w.__blobDebug?.resetMaxSeparation();
    });

    // Fast diagonal sweep: 1280x800 viewport, (50,50) -> (1230,750), 30 steps,
    // 50ms/step = 1500ms total = ~918 px/s.
    const steps = 30;
    const dt = 50;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      await page.mouse.move(50 + (1230 - 50) * t, 50 + (750 - 50) * t);
      await page.waitForTimeout(dt);
    }
    // Sweep back diagonally for stress.
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      await page.mouse.move(1230 - (1230 - 50) * t, 50 + (750 - 50) * t);
      await page.waitForTimeout(dt);
    }

    const maxSep = await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      return w.__blobDebug?.maxAngularSeparation ?? -1;
    });
    // eslint-disable-next-line no-console
    console.log(`[BR-02] maxAngularSeparation under 1500ms diagonal sweep: ${maxSep.toFixed(2)}px`);
    expect(maxSep).toBeLessThanOrEqual(8);
  });
});
