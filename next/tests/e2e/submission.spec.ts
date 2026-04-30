// next/tests/e2e/submission.spec.ts
// v9.0 Phase 93 Plan 00 (Wave 0) — Submission-path E2E SKELETON.
//
// This file is an intentional placeholder. Plan 07 (Wave 3) will:
//   1. Replace `test.describe.skip(...)` with `test.describe(...)`.
//   2. Implement each route's submission flow (fill name/phone/specialization
//      dropdown/optional description; submit; assert success state).
//   3. Confirm Directus arrival via API (GET /items/submissions filtered by
//      a `[E2E]` marker + timestamp suffix in the name field).
//   4. Clean up the test record via DELETE call to Directus.
//
// Until then, the .skip ensures Wave 0/1/2 verification runs cannot trip on
// this spec.

import { test } from '@playwright/test';

test.describe.skip('submission-e2e (Wave 3 Plan 07 only)', () => {
  const routes = [
    '/checkup',
    '/consultations',
    '/treatment-abroad',
    '/contacts',
  ] as const;

  for (const route of routes) {
    test(`${route} — submission reaches Directus`, async () => {
      // Plan 07 task: implement submission flow + Directus arrival check + cleanup.
      // Marker convention: name field contains "[E2E]" prefix + timestamp suffix.
      // <read_first> in Plan 07 must enumerate ContactForm fields
      // (name, phone, specialization dropdown, optional description) AND
      // LeadFormSection field shape before authoring spec body.
      test.fail(); // placeholder — keeps the spec harmless while skipped.
    });
  }
});
