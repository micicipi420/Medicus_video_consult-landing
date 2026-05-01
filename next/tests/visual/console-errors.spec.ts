// next/tests/visual/console-errors.spec.ts
// v9.0.1 Phase 94 Plan 01 — POL-01 console-error baseline.
//
// Asserts that visiting /consultations and /treatment-abroad produces
// 0 console errors matching `<rect> attribute rx`. The 4-value SVG `rx`
// attributes that produced these errors were replaced with a valid
// single-length value `rx="3"` in Phase 94 Plan 01 Task 1.
//
// Also asserts a clean error-baseline (0 error-type messages of any kind)
// to surface any other console regressions ahead of Phase 95 axe/Lighthouse.
// A failure on the broader assertion is informative for triage rather than
// a strict POL-01 success criterion (success criterion #1 is the rx-specific
// assertion).
//
// Runs only on the `desktop` project — console errors are viewport-agnostic.

import { test, expect } from '@playwright/test';

const routes = ['/consultations', '/treatment-abroad'] as const;

test.describe('console-errors', () => {
  for (const route of routes) {
    test(`${route} — 0 SVG rx console errors`, async ({ page }) => {
      const consoleMessages: { type: string; text: string }[] = [];

      page.on('console', (msg) => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
      });

      await page.goto(route, { waitUntil: 'networkidle' });

      const rxErrors = consoleMessages.filter(
        (m) => m.type === 'error' && m.text.includes('attribute rx'),
      );
      expect(rxErrors, `Found <rect> attribute rx errors on ${route}: ${JSON.stringify(rxErrors, null, 2)}`).toHaveLength(0);

      const allErrors = consoleMessages.filter((m) => m.type === 'error');
      expect(allErrors, `Found console errors on ${route}: ${JSON.stringify(allErrors, null, 2)}`).toHaveLength(0);
    });
  }
});
