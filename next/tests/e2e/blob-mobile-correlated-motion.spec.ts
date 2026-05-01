// next/tests/e2e/blob-mobile-correlated-motion.spec.ts
// v9.0.1 Phase 96 Plan 03 — BR-03 mobile ambient correlated-motion assertion.
//
// The mobile ambient code path uses lissajousTarget() to compute target
// positions, which is then fed into the same updateLayers() that desktop
// cursor mode uses. Plan 96-02's LERP cluster tuning is therefore inherited
// automatically; this spec provides proof under slow Lissajous drift.

import { test, expect } from '@playwright/test';

interface BlobDebug {
  mode: string;
  maxAngularSeparation: number;
  resetMaxSeparation: () => void;
}

// Force Playwright to emulate a coarse-pointer / no-hover touch device so
// matchMedia('(pointer: coarse) and (hover: none)') matches and resolveMode
// returns 'ambient'.
test.use({ hasTouch: true, isMobile: true });

test.describe('blob mobile ambient correlated motion (BR-03)', () => {
  test('max angular separation during 5s Lissajous drift stays <= 8px', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'mobile-only — ambient mode');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for the engine to enter ambient mode (coarse-pointer chain).
    await page.waitForFunction(
      () => {
        const w = window as unknown as { __blobDebug?: BlobDebug };
        return Boolean(w.__blobDebug && w.__blobDebug.mode === 'ambient');
      },
      { timeout: 10000 },
    );

    // Reset rolling max so the initialization frame doesn't pollute the sample.
    await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      w.__blobDebug?.resetMaxSeparation();
    });

    // Sample over 5 seconds — Lissajous periods are 17s + 23s, 5s gives a
    // representative arc with low velocity (Lissajous max v << VELOCITY_MAX).
    await page.waitForTimeout(5000);

    const maxSep = await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      return w.__blobDebug?.maxAngularSeparation ?? -1;
    });
    // eslint-disable-next-line no-console
    console.log(`[BR-03] mobile ambient maxAngularSeparation over 5s: ${maxSep.toFixed(2)}px`);
    expect(maxSep).toBeLessThanOrEqual(8);
  });
});
