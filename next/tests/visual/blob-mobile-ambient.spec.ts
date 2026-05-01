// next/tests/visual/blob-mobile-ambient.spec.ts
// v9.0.1 Phase 96 Plan 03 — BR-03 mobile ambient visual baseline.
//
// Captures a 320x320 crop of the ambient blob at 375x667 with reduced-motion
// off (so the engine runs Lissajous + lerp updates). Determinism is achieved
// via Decision K's lissajousFrozenTime mechanism: dispatching a synthetic
// scroll event freezes the Lissajous orbit at performance.now() and the
// engine renders that frozen frame indefinitely.

import { test, expect } from '@playwright/test';

interface BlobDebug {
  mode: string;
}

test.use({ hasTouch: true, isMobile: true });

test.describe('blob mobile ambient visual (BR-03)', () => {
  test('mobile ambient blob baseline @ 375x667', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'mobile-only — ambient mode');

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForFunction(
      () => {
        const w = window as unknown as { __blobDebug?: BlobDebug };
        return Boolean(w.__blobDebug && w.__blobDebug.mode === 'ambient');
      },
      { timeout: 10000 },
    );

    // Trigger scroll to freeze Lissajous orbit (Decision K).
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
    // Allow rAF ticks for the freeze to take effect + a few frames of lerp
    // to settle close to the frozen target.
    await page.waitForTimeout(400);

    const clip = { x: 27, y: 173, width: 320, height: 320 };
    await expect(page).toHaveScreenshot('mobile-ambient.png', {
      clip,
      maxDiffPixelRatio: 0.01,
    });
  });
});
