// next/tests/visual/blob-halo-feather.spec.ts
// v9.0.1 Phase 96 Plan 01 — BR-01 halo feather visual baseline.
//
// Unlike baseline.spec.ts (which hides the blob entirely), this spec keeps
// the blob visible and pins its position deterministically so the snapshot
// is reproducible. We use `reducedMotion: 'reduce'` to lock the engine into
// 'static' mode (per Phase 93 finding F1: __blobDebug.setMode is read-only,
// so the documented fallback is reduced-motion media emulation).
//
// In static mode the engine renders a single frame at viewport-center
// (innerWidth/2, innerHeight/2) and stops the rAF loop, so the canvas is
// stable across runs.

import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  // Explicit reinforcement — Phase 93 baseline.spec.ts uses this pattern as the
  // canonical way to ensure prefers-reduced-motion matches before first paint.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function waitForStaticBlob(page: import('@playwright/test').Page) {
  // Engine runs in useEffect after hydration; wait for any data-blob-mode
  // attribute first, then assert it is static.
  await page.waitForFunction(
    () => document.documentElement.hasAttribute('data-blob-mode'),
    { timeout: 15000 },
  );
  const mode = await page.evaluate(() => document.documentElement.getAttribute('data-blob-mode'));
  if (mode !== 'static') {
    // Attach hint into test annotations rather than failing silently.
    throw new Error(`expected data-blob-mode=static, got ${mode}`);
  }
}

test.describe('blob halo feather (BR-01) — desktop', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only baseline');

  test('halo feather smooth — desktop 1280x800 zoom', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only test');
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStaticBlob(page);

    // Apply 2x zoom via CSS so the gradient stop boundary, if present, is
    // crisp enough to detect in the snapshot.
    await page.evaluate(() => {
      // @ts-expect-error — CSS `zoom` is non-standard but supported in Chromium.
      document.body.style.zoom = '2';
    });
    await page.waitForTimeout(100);

    const clip = { x: 440, y: 200, width: 400, height: 400 };
    await expect(page).toHaveScreenshot('halo-feather-desktop-zoom2x.png', {
      clip,
      maxDiffPixelRatio: 0.005,
    });
  });

  test('halo feather smooth — mobile 375x667', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'mobile-only test');
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStaticBlob(page);

    const clip = { x: 28, y: 174, width: 320, height: 320 };
    await expect(page).toHaveScreenshot('halo-feather-mobile.png', {
      clip,
      maxDiffPixelRatio: 0.005,
    });
  });
});
