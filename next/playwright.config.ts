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

// Port override: PLAYWRIGHT_PORT defaults to 3000 but can be set when port 3000
// is occupied by another local Next dev server (Phase 93 Plan 07 ran into this
// collision with a sibling project — unrelated next-server squatting on :3000).
// Both `webServer.command` and `use.baseURL` consume the same value so reuseExistingServer
// detection lines up with the spawned server.
const PORT = process.env.PLAYWRIGHT_PORT || '3000';
const BASE_URL = `http://localhost:${PORT}`;

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
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },

  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: BASE_URL,
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
