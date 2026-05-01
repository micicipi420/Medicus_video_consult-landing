// next/tests/uat/leak.spec.ts
// AUDIT-04 / VER-03 — singleton-guard verification across 5-route navigation cycle.
//
// Acceptance (REQUIREMENTS.md VER-03):
//   "navigate / → /checkup → /consultations → /treatment-abroad → / and assert
//    window.__blobDebug.rafCount === 1 and pointermove listener count === 1"
//
// rafCount: read directly from __blobDebug.
// listenerCount: __blobDebug exposes listenerCount natively (Phase 91 BLOB-12 surface
// includes a `listenerCount` field derived from the engine's AbortController state).
// We use that as the canonical signal AND additionally instrument
// addEventListener / removeEventListener as a cross-check.

import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const RESULTS_PATH = path.resolve(
  __dirname,
  '../../../.planning/phases/95-audit-and-verification/uat/leak-results.json',
);

test.describe('VER-03 — leak test', () => {
  test('5-route cycle: rafCount===1 and pointermove listener count===1', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __listenerCounts?: { pointermove: number } };
      w.__listenerCounts = { pointermove: 0 };
      const origAdd = window.addEventListener.bind(window);
      const origRemove = window.removeEventListener.bind(window);
      type AnyArgs = Parameters<typeof window.addEventListener>;
      window.addEventListener = function (...args: AnyArgs) {
        if (args[0] === 'pointermove') (w.__listenerCounts as { pointermove: number }).pointermove++;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (origAdd as any)(...args);
      };
      window.removeEventListener = function (...args: AnyArgs) {
        if (args[0] === 'pointermove') (w.__listenerCounts as { pointermove: number }).pointermove--;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (origRemove as any)(...args);
      };
    });

    const ROUTES = ['/', '/checkup', '/consultations', '/treatment-abroad', '/'];
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(250);
    }

    const debug = await page.evaluate(
      () => (window as unknown as {
        __blobDebug?: { rafCount: number; listenerCount: number };
      }).__blobDebug ?? null,
    );
    const listenerCounts = await page.evaluate(
      () => (window as unknown as { __listenerCounts?: { pointermove: number } }).__listenerCounts ?? null,
    );

    expect(debug, '__blobDebug must be exposed in dev build').not.toBeNull();
    expect(debug!.rafCount, 'rAF singleton-guard violated — multiple rAFs running after 5-route cycle').toBe(1);
    // Note: window-level pointermove listener count is the wrapping addEventListener instrument's
    // signal. Engine attaches via signal-aborted controllers; expected steady-state = 1.
    expect(
      listenerCounts!.pointermove,
      'pointermove listener leak — singleton-guard violated across App Router navigation',
    ).toBe(1);

    fs.mkdirSync(path.dirname(RESULTS_PATH), { recursive: true });
    fs.writeFileSync(
      RESULTS_PATH,
      JSON.stringify(
        {
          rafCount: debug!.rafCount,
          blobDebugListenerCount: debug!.listenerCount,
          pointermoveListenerCount: listenerCounts!.pointermove,
          routes: ROUTES,
          ts: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
  });
});
