---
phase: 65-database-form-submission
plan: 01
subsystem: database
tags: [drizzle-orm, postgres, zod, server-action, form-submission, spam-protection]

# Dependency graph
requires:
  - phase: 64-glassmorphism-interactive
    provides: ContactForm.tsx component with form structure, validation, honeypot
provides:
  - Drizzle ORM submissions table schema (7 columns matching Directus collection)
  - PostgreSQL connection with lazy initialization (build-safe)
  - Server Action with Zod validation and spam protection
  - ContactForm wired to real database submission
affects: [67-docker-production, contacts-page]

# Tech tracking
tech-stack:
  added: [drizzle-orm, postgres.js, zod, drizzle-kit]
  patterns: [server-action-form-submission, lazy-db-connection, honeypot-timing-spam-defense, zod-server-validation]

key-files:
  created:
    - next/src/lib/db/schema.ts
    - next/src/lib/db/index.ts
    - next/src/lib/db/validation.ts
    - next/src/lib/db/actions.ts
    - next/drizzle.config.ts
    - next/.env.example
  modified:
    - next/src/components/sections/ContactForm.tsx
    - next/package.json
    - next/.gitignore

key-decisions:
  - "Lazy DB connection via Proxy to avoid build failures without DATABASE_URL"
  - "Zod v4 for server-side validation with Russian error messages"
  - "Specialization values mapped from select option keys to Russian labels before DB storage"
  - "Dual-layer spam protection: client-side fast rejection + server-side validation"

patterns-established:
  - "Lazy DB singleton: use Proxy wrapper so db/index.ts never connects at module load time"
  - "Server Action error shape: { success: boolean, errors?: Record<string, string> } with _form key for form-level errors"
  - "Spam defense: honeypot + timing check both client-side (skip network) and server-side (defense in depth)"

requirements-completed: [DATA-01, DATA-02]

# Metrics
duration: 12min
completed: 2026-04-10
---

# Phase 65 Plan 01: Database Form Submission Summary

**Drizzle ORM submissions schema with Server Action, Zod validation, honeypot/timing spam protection, and ContactForm wired to PostgreSQL**

## Performance

- **Duration:** 12 min
- **Tasks:** 3/3
- **Files created:** 6
- **Files modified:** 3

## Accomplishments
- Drizzle ORM schema defines submissions table with all 7 fields matching the original Directus collection (id, name, phone, specialization, description, status, dateCreated)
- Server Action validates with Zod (Russian error messages), silently rejects spam (honeypot + 2s timing), inserts valid data into PostgreSQL
- ContactForm on both `/` and `/contacts` pages calls the same Server Action with loading state, form-level errors, and field-level errors
- Build passes without PostgreSQL running thanks to lazy DB connection pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Drizzle ORM + define submissions schema + database connection** - `484ed12` (feat)
2. **Task 2: Create Zod validation schema + Server Action with spam protection** - `becca6e` (feat)
3. **Task 3: Wire ContactForm to Server Action with real submission + error/success states** - `61aa5b2` (feat)

## Files Created/Modified
- `next/src/lib/db/schema.ts` - Drizzle ORM submissions table definition (7 columns)
- `next/src/lib/db/index.ts` - Lazy PostgreSQL connection via Proxy (build-safe)
- `next/src/lib/db/validation.ts` - Zod contactFormSchema with Russian error messages
- `next/src/lib/db/actions.ts` - Server Action: validate, spam-check, insert to PostgreSQL
- `next/drizzle.config.ts` - Drizzle Kit config for push/migrate
- `next/.env.example` - DATABASE_URL template
- `next/src/components/sections/ContactForm.tsx` - Wired to Server Action with error/success/loading states
- `next/package.json` - Added drizzle-orm, postgres, zod, drizzle-kit, db scripts
- `next/.gitignore` - Allow .env.example to be committed

## Decisions Made
- **Lazy DB connection via Proxy:** The original plan used eager module-level connection (`const client = postgres(connectionString)`). This crashes `next build` when DATABASE_URL is not set. Fixed by wrapping in a Proxy that defers connection to first actual use (Rule 3 -- blocking issue fix).
- **Zod v4 API compatibility:** Project uses Zod v4.3.6 (not v3). Verified that `safeParse`, `error.issues`, and `.optional().default()` chain all work identically. No code changes needed.
- **Specialization mapping:** Form select values (`consultation`, `treatment`, `checkup`, `not-sure`) are mapped to Russian labels (`Онлайн-консультация`, etc.) before DB storage, matching the original Directus flow.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Lazy DB connection to fix build without DATABASE_URL**
- **Found during:** Task 1 (database connection setup)
- **Issue:** Plan specified eager `const client = postgres(connectionString)` at module top level. During `next build`, the Server Action import chain would evaluate this, crashing because DATABASE_URL is not set in CI/build environment.
- **Fix:** Wrapped DB connection in a Proxy that lazily initializes on first property access. Added `getDb()` function with explicit error message when DATABASE_URL is missing.
- **Files modified:** `next/src/lib/db/index.ts`
- **Verification:** `npm run build` succeeds with all pages generating statically
- **Committed in:** 484ed12 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed unused variable ESLint warning in ContactForm**
- **Found during:** Task 3 (build verification)
- **Issue:** Destructuring `const { _form, ...fieldErrors } = result.errors` flagged `_form` as unused by ESLint despite being used in the preceding if-check.
- **Fix:** Replaced destructuring with `Object.fromEntries(Object.entries(...).filter())` to avoid the unused binding entirely.
- **Files modified:** `next/src/components/sections/ContactForm.tsx`
- **Verification:** `npm run build` passes with zero warnings
- **Committed in:** 61aa5b2 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes essential for build correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required. PostgreSQL setup will be handled in Phase 67 (Docker production).

## Next Phase Readiness
- Database schema ready for `drizzle-kit push` when PostgreSQL is available
- Server Action fully functional -- needs only a running PostgreSQL to accept submissions
- Phase 67 (Docker production) can wire DATABASE_URL to real PostgreSQL instance

## Self-Check: PASSED

All 7 created files verified present. All 3 task commits verified in git log.

---
*Phase: 65-database-form-submission*
*Completed: 2026-04-10*
