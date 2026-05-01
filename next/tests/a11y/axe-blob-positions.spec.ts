// next/tests/a11y/axe-blob-positions.spec.ts
// AUDIT-04 / VER-06 — axe-core run with blob parked at 3 representative positions per route.
//
// AUDIT-02 ran axe with the blob HIDDEN. VER-06 specifically requires verifying
// a11y while the blob is positioned over hero / form / cta surfaces.
//
// Position is forced by writing CSS vars on :root (--blob-x / --blob-y) — the
// engine reads these as input pointer position when present.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

const OUT_DIR = path.resolve(
  __dirname,
  '../../../.planning/phases/95-audit-and-verification/axe',
);

const ROUTES = ['/', '/checkup', '/consultations', '/treatment-abroad', '/contacts'] as const;

const POSITION_SELECTORS: Record<string, string> = {
  hero: 'section:first-of-type, header + section, [class*="hero" i]',
  form: '[class*="lead-form" i], [class*="ContactForm" i], form',
  cta: 'a[class*="bg-gradient"], button[class*="bg-gradient"]',
};

function slugFor(route: string): string {
  return route === '/' ? 'index' : route.slice(1);
}

test.describe('axe @ blob position', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const route of ROUTES) {
    for (const [pos, sel] of Object.entries(POSITION_SELECTORS)) {
      test(`axe @ ${route} blob:${pos}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        const target = page.locator(sel).first();
        const found = await target.count();
        const slug = slugFor(route);
        const outPath = path.join(OUT_DIR, `${slug}--blob-${pos}.json`);
        if (found === 0) {
          // Record placeholder JSON so file inventory is complete
          fs.writeFileSync(
            outPath,
            JSON.stringify({ skipped: true, reason: `selector "${sel}" not found on ${route}`, violations: [] }, null, 2),
          );
          test.skip(true, `selector "${sel}" not found on ${route}`);
          return;
        }
        const box = await target.boundingBox();
        if (!box) {
          fs.writeFileSync(
            outPath,
            JSON.stringify({ skipped: true, reason: `no bounding box for ${sel} on ${route}`, violations: [] }, null, 2),
          );
          test.skip(true, `no bounding box for ${sel} on ${route}`);
          return;
        }
        const cx = Math.round(box.x + box.width / 2);
        const cy = Math.round(box.y + box.height / 2);
        await page.evaluate(
          ([x, y]) => {
            document.documentElement.style.setProperty('--blob-x', `${x}px`);
            document.documentElement.style.setProperty('--blob-y', `${y}px`);
          },
          [cx, cy],
        );
        await page.waitForTimeout(300);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
        const blocking = results.violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious',
        );
        if (blocking.length > 0) {
          for (const v of blocking) {
            console.error(
              `[axe-pos ${slug}/${pos}] ${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodes)`,
            );
          }
        }
        expect(blocking, `Found ${blocking.length} critical/serious on ${route} @ ${pos}. See ${outPath}.`).toEqual([]);
      });
    }
  }
});
