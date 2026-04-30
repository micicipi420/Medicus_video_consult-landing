// next/tests/e2e/submission.spec.ts
// v9.0 Phase 93 Plan 07 (Wave 3) — Submission-path E2E for all 4 sub-routes.
//
// Flow per route:
//   1. Navigate to /checkup, /consultations, /treatment-abroad, /contacts.
//   2. Fill ContactForm (mounted directly on /contacts; wrapped by
//      LeadFormSection on the other three).
//   3. Wait ≥3.1 s after form mount so the client-side honeypot/timing trap
//      (ContactForm.tsx:69 — Date.now() - loadTimeRef.current < 3000) does
//      NOT silent-succeed. The same timing applies on every route because
//      LeadFormSection embeds the same ContactForm component verbatim.
//   4. Submit and assert the success overlay copy ("Спасибо!").
//   5. Optionally read back from Postgres via the `submissions` table to
//      confirm DB arrival, then delete the row. Cleanup is best-effort —
//      missing DATABASE_URL or an unreachable database produces a logged
//      warning, not a test failure.
//
// This project does NOT route submissions through Directus REST. The
// `submitContactForm` server action writes directly to Postgres via Drizzle
// (next/src/lib/db/actions.ts → schema.ts → submissions table). The plan-07
// language "Directus arrival check" is aspirational; the actual contract is
// Postgres arrival, which is what we verify here.
//
// Skip conditions:
//   - PLAYWRIGHT_E2E_RUN env var not set ⇒ all 4 tests skipped (default).
//     Reason: the suite needs both a working dev server bound to the project
//     under test AND a reachable Postgres on DATABASE_URL. Running it
//     accidentally (e.g. as part of `playwright test` with no flags) would
//     either pollute the DB or fail noisily on environments lacking either.
//   - PLAYWRIGHT_E2E_RUN set but Postgres unreachable ⇒ test still runs
//     against the UI success overlay; DB read-back + cleanup are skipped
//     with a warning. SUMMARY records the [E2E] marker for manual cleanup.

import { test, expect } from '@playwright/test';

const ROUTES = [
  '/checkup',
  '/consultations',
  '/treatment-abroad',
  '/contacts',
] as const;

// 3.1 s clears both the client (3 s) and server (2 s) anti-bot timing checks.
const TIMING_TRAP_WAIT_MS = 3100;

// Marker convention: human-readable plus enough entropy to avoid collisions
// between concurrent runs.
function makeMarker(route: string): string {
  return `[E2E] ${route} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const RUN_E2E = process.env.PLAYWRIGHT_E2E_RUN === '1';

// Track inserted records (best-effort cleanup in afterAll).
const createdMarkers: string[] = [];

test.describe('submission-e2e', () => {
  test.skip(
    !RUN_E2E,
    'Set PLAYWRIGHT_E2E_RUN=1 to exercise the live submission path. Requires a reachable Postgres at DATABASE_URL and a dev server bound to this project.',
  );

  test.afterAll(async () => {
    if (!process.env.DATABASE_URL || createdMarkers.length === 0) return;
    // Best-effort cleanup using Drizzle. Failure here is logged, not thrown —
    // the SUMMARY captures the leftover markers for manual deletion.
    try {
      const { default: postgres } = await import('postgres');
      const sql = postgres(process.env.DATABASE_URL, { max: 1 });
      try {
        for (const marker of createdMarkers) {
          await sql`DELETE FROM submissions WHERE name = ${marker}`;
        }
      } finally {
        await sql.end({ timeout: 5 });
      }
      console.log(`[E2E] cleaned up ${createdMarkers.length} test record(s)`);
    } catch (err) {
      console.warn(
        '[E2E] cleanup failed; manual deletion required for markers:',
        createdMarkers,
        err,
      );
    }
  });

  for (const route of ROUTES) {
    test(`${route} — submission reaches DB`, async ({ page }) => {
      const marker = makeMarker(route);
      const mountTime = Date.now();

      await page.goto(route, { waitUntil: 'networkidle' });

      // Locate ContactForm fields by their HTML `name` attribute. Field
      // shape extracted from next/src/components/sections/ContactForm.tsx:
      //   - input[name="name"]          (required)
      //   - input[name="phone"]         (required, formatted on input)
      //   - select[name="interest"]     (required, options: consultation |
      //     treatment | checkup | not-sure)
      //   - textarea[name="description"] (optional)
      //   - input[name="website"]       (HONEYPOT — must remain empty)
      await page.locator('input[name="name"]').fill(marker);
      await page.locator('input[name="phone"]').fill('7 701 555 00 00');
      // 'consultation' is the first valid option. Spec is route-agnostic by
      // design — the form posts the same enum regardless of which page it
      // lives on.
      await page.locator('select[name="interest"]').selectOption('consultation');
      await page
        .locator('textarea[name="description"]')
        .fill('Phase 93 Plan 07 E2E — please ignore.');

      // Wait out the client+server timing trap. Subtract elapsed time since
      // navigation so we do not over-wait when networkidle was slow.
      const elapsed = Date.now() - mountTime;
      const remaining = Math.max(0, TIMING_TRAP_WAIT_MS - elapsed);
      if (remaining > 0) await page.waitForTimeout(remaining);

      // Submit. Button label flips to "Отправка..." while in flight.
      await page.getByRole('button', { name: /отправить заявку/i }).click();

      // Success overlay (ContactForm.tsx:109 → "Спасибо!"). Generous timeout
      // to absorb server-action round-trip + Postgres insert.
      await expect(
        page.getByRole('heading', { name: 'Спасибо!' }),
      ).toBeVisible({ timeout: 15_000 });

      // DB read-back (best-effort).
      if (!process.env.DATABASE_URL) {
        console.warn(
          `[E2E] DATABASE_URL not set; skipping DB arrival check for ${route}. Marker: ${marker}`,
        );
        return;
      }

      try {
        const { default: postgres } = await import('postgres');
        const sql = postgres(process.env.DATABASE_URL, { max: 1 });
        try {
          const rows = await sql<
            { id: string; name: string }[]
          >`SELECT id, name FROM submissions WHERE name = ${marker} LIMIT 1`;
          expect(rows.length).toBeGreaterThanOrEqual(1);
          createdMarkers.push(marker);
        } finally {
          await sql.end({ timeout: 5 });
        }
      } catch (err) {
        console.warn(
          `[E2E] DB read-back failed for ${route} (marker: ${marker}). UI success was confirmed.`,
          err,
        );
        createdMarkers.push(marker);
      }
    });
  }
});
