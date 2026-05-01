// next/tests/a11y/axe.spec.ts
// AUDIT-02 — axe-core a11y audit across 5 routes × 3 a11y emulation modes.
//
// Hard gate: 0 violations of impact 'critical' or 'serious' across all 15 audits.
// Moderate/minor violations are written to disk and dispositioned in summary.md;
// they do NOT fail this spec — disposition is a human judgment recorded out-of-band.
//
// Output dir: .planning/phases/95-audit-and-verification/axe/
//   {slug}--{mode}.json   — full axe Result (violations, passes, incomplete, inapplicable)
//
// Determinism: same as visual baseline — emulate reducedMotion before goto;
// hide the .living-blob-field canvas before analyze() so animation timing
// noise does not surface as transient violations.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROUTES = ['/', '/checkup', '/consultations', '/treatment-abroad', '/contacts'] as const;

type A11yMode = 'default' | 'reduced-motion' | 'reduced-transparency';
const MODES: A11yMode[] = ['default', 'reduced-motion', 'reduced-transparency'];

const OUTPUT_DIR = path.resolve(
  __dirname,
  '../../../.planning/phases/95-audit-and-verification/axe',
);

function slugFor(route: string): string {
  return route === '/' ? 'index' : route.slice(1);
}

async function applyMode(page: import('@playwright/test').Page, mode: A11yMode) {
  if (mode === 'reduced-motion') {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return;
  }
  if (mode === 'reduced-transparency') {
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });
    return;
  }
}

test.describe('axe-core a11y audit', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  });

  for (const route of ROUTES) {
    for (const mode of MODES) {
      test(`${route} — ${mode}`, async ({ page }) => {
        await applyMode(page, mode);
        await page.goto(route, { waitUntil: 'networkidle' });

        await page.addStyleTag({
          content: `.living-blob-field, .living-blob-field * { display: none !important; }`,
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();

        const slug = slugFor(route);
        const outPath = path.join(OUTPUT_DIR, `${slug}--${mode}.json`);
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

        const blocking = results.violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious',
        );
        if (blocking.length > 0) {
          for (const v of blocking) {
            console.error(
              `[axe ${slug}/${mode}] ${v.impact} ${v.id}: ${v.help} ` +
                `(${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'}) — ${v.helpUrl}`,
            );
          }
        }
        expect(
          blocking,
          `Found ${blocking.length} critical/serious violation(s) on ${route} (${mode}). See ${outPath}.`,
        ).toEqual([]);
      });
    }
  }
});
