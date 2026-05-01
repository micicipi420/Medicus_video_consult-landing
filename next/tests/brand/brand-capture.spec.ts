// next/tests/brand/brand-capture.spec.ts
// AUDIT-03 — capture reference + local screenshots for brand review.
//
// Reference sites: medicusunion.com (mother brand), medicusunion.kz (KZ portal).
// Local routes: /, /checkup, /consultations, /treatment-abroad, /contacts.
// Output: PNGs under .planning/phases/95-audit-and-verification/brand/.

import { test } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const OUT_DIR = path.resolve(
  __dirname,
  '../../../.planning/phases/95-audit-and-verification/brand',
);

const REFERENCE_SITES = [
  { name: 'medicusunion-com--home', url: 'https://medicusunion.com/' },
  { name: 'medicusunion-kz--home', url: 'https://medicusunion.kz/' },
];

const LOCAL_ROUTES = [
  { name: 'local--index', route: '/' },
  { name: 'local--checkup', route: '/checkup' },
  { name: 'local--consultations', route: '/consultations' },
  { name: 'local--treatment-abroad', route: '/treatment-abroad' },
  { name: 'local--contacts', route: '/contacts' },
];

test.describe.configure({ mode: 'serial' });

test.describe('brand-capture', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const site of REFERENCE_SITES) {
    test(`reference: ${site.name}`, async ({ page }) => {
      try {
        await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30_000 });
      } catch (e) {
        // Reference site unreachable — record placeholder so summary can note the gap
        const placeholderPath = path.join(OUT_DIR, `${site.name}.UNREACHABLE.txt`);
        fs.writeFileSync(placeholderPath, `Reference site ${site.url} unreachable at capture time: ${(e as Error).message}\n`);
        return;
      }
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(OUT_DIR, `${site.name}.png`),
        fullPage: false,
      });
    });
  }

  for (const local of LOCAL_ROUTES) {
    test(`local: ${local.name}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(local.route, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: `
          .living-blob-field, .living-blob-field * { display: none !important; }
          nextjs-portal, [data-nextjs-toast], [data-next-mark] { display: none !important; }
        `,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(OUT_DIR, `${local.name}.png`),
        fullPage: false,
      });
    });
  }
});

test.describe('brand-extract — computed styles for token comparison', () => {
  type SampleSelectors = Record<string, string>;
  const COMMON_LOCAL_SELECTORS: SampleSelectors = {
    primaryCta: 'a[class*="bg-gradient-to-r"], button[class*="bg-gradient"], a[class*="cta"]',
    heroHeading: 'h1',
    bodyText: 'main p, p',
  };
  const REFERENCE_SELECTORS: SampleSelectors = {
    primaryCta: 'a[href*="form"], a[class*="btn"], button[type="submit"], a[class*="cta"]',
    heroHeading: 'h1',
    bodyText: 'p',
  };

  const SAMPLES: Array<{ context: string; url: string; selectors: SampleSelectors; navigationOptional?: boolean }> = [
    { context: 'medicusunion.com home', url: 'https://medicusunion.com/', selectors: REFERENCE_SELECTORS, navigationOptional: true },
    { context: 'medicusunion.kz home', url: 'https://medicusunion.kz/', selectors: REFERENCE_SELECTORS, navigationOptional: true },
    { context: 'local /', url: 'http://localhost:3000/', selectors: COMMON_LOCAL_SELECTORS },
    { context: 'local /checkup', url: 'http://localhost:3000/checkup', selectors: COMMON_LOCAL_SELECTORS },
    { context: 'local /consultations', url: 'http://localhost:3000/consultations', selectors: COMMON_LOCAL_SELECTORS },
    { context: 'local /treatment-abroad', url: 'http://localhost:3000/treatment-abroad', selectors: COMMON_LOCAL_SELECTORS },
  ];

  for (const s of SAMPLES) {
    test(`extract: ${s.context}`, async ({ page, baseURL }) => {
      const url = s.url.startsWith('http://localhost:3000') && baseURL
        ? s.url.replace('http://localhost:3000', baseURL)
        : s.url;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
      } catch (e) {
        if (s.navigationOptional) {
          const outPath = path.join(OUT_DIR, 'computed-styles.json');
          const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};
          existing[s.context] = { unreachable: (e as Error).message };
          fs.writeFileSync(outPath, JSON.stringify(existing, null, 2));
          return;
        }
        throw e;
      }
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      await page.waitForTimeout(500);
      const result: Record<string, Record<string, string> | null> = {};
      for (const [key, sel] of Object.entries(s.selectors)) {
        try {
          const el = page.locator(sel).first();
          if ((await el.count()) === 0) {
            result[key] = null;
            continue;
          }
          result[key] = await el.evaluate((node) => {
            const cs = getComputedStyle(node as Element);
            return {
              color: cs.color,
              backgroundColor: cs.backgroundColor,
              backgroundImage: cs.backgroundImage,
              fontFamily: cs.fontFamily,
              fontWeight: cs.fontWeight,
              fontSize: cs.fontSize,
              letterSpacing: cs.letterSpacing,
            };
          });
        } catch {
          result[key] = null;
        }
      }
      const outPath = path.join(OUT_DIR, 'computed-styles.json');
      const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};
      existing[s.context] = result;
      fs.writeFileSync(outPath, JSON.stringify(existing, null, 2));
    });
  }
});
