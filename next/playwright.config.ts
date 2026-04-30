// next/playwright.config.ts
// v9.0 Phase 93 Plan 00 (Wave 0) — Playwright config for visual-regression baseline
// + submission-path E2E.
//
// Two projects ONLY (no Firefox / WebKit per CLAUDE.md and 93-RESEARCH §Standard Stack):
//   - desktop     (1280×800)
//   - mobile-375  (375×667, deviceScaleFactor: 2)
//
// Phase 94 territory: multi-browser, leak tests, mobile-real-device. Not here.

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  // Snapshot path: next/tests/visual/__snapshots__/baseline.spec.ts/checkup-desktop.png
  //
  // Plan-00 spec'd '{testFilePath}/__snapshots__/...' but {testFilePath} is
  // a FILE path (e.g. tests/visual/baseline.spec.ts), so mkdir hits ENOTDIR.
  // {testFileDir} resolves relative to testDir (= 'visual' here), losing the
  // 'tests/' prefix. Anchor with {testDir} + {testFileDir} + {testFileName}
  // to land snapshots co-located with the spec under a __snapshots__ subdir.
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}{ext}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile-375',
      use: {
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
      },
    },
  ],
});
