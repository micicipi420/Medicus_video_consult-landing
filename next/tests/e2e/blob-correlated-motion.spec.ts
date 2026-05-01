// next/tests/e2e/blob-correlated-motion.spec.ts
// v9.0.1 Phase 96 Plan 02 — BR-02 cursor separation assertions (Option B model).
//
// 1. Fast-sweep test: drives a 1.5s diagonal sweep across the viewport
//    (~918 px/s, within VELOCITY_MAX = 1500 px/s) and asserts max angular
//    separation across 4 sublayers stays ≤ 8px (BR-02 ceiling).
// 2. Low-velocity drift test: drives a slow ~200 px/s sweep and asserts
//    separation stays ≤ 2px. Verifies the velocity-LP capped-offset model
//    preserves the "calm cluster" feel at low velocity (f → 0 collapses
//    all layers toward core).

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

  test('max angular separation under slow drift (~200 px/s) stays <= 2px', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only — cursor mode');

    await page.goto('/', { waitUntil: 'networkidle' });

    await page.waitForFunction(
      () => {
        const w = window as unknown as { __blobDebug?: BlobDebug };
        return Boolean(w.__blobDebug && w.__blobDebug.mode === 'cursor');
      },
      { timeout: 15000 },
    );

    // Prime the cursor at a stable position and let the engine settle for
    // ~500ms so velocityLP decays to ~0 from any prior init transient.
    await page.mouse.move(640, 400);
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      w.__blobDebug?.resetMaxSeparation();
    });

    // Slow drift: 100 steps × 50ms = 5000ms, traverse 1000px → 200 px/s.
    const steps = 100;
    const dt = 50;
    const startX = 100;
    const endX = 1100;
    const y = 400;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      await page.mouse.move(startX + (endX - startX) * t, y);
      await page.waitForTimeout(dt);
    }

    const maxSep = await page.evaluate(() => {
      const w = window as unknown as { __blobDebug?: BlobDebug };
      return w.__blobDebug?.maxAngularSeparation ?? -1;
    });
    // eslint-disable-next-line no-console
    console.log(`[BR-02] maxAngularSeparation under 200 px/s drift: ${maxSep.toFixed(2)}px`);
    // At 200 px/s: f = 200/1500 = 0.133; halo cap × f = 8 × 0.133 ≈ 1.07px.
    // Allow 2px headroom for transients during velocity-LP ramp-up.
    expect(maxSep).toBeLessThanOrEqual(2);
  });
});
