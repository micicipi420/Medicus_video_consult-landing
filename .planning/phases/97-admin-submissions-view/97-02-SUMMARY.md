# 97-02 SUMMARY — 6-column view + Russian mapping + 50/page pagination

**Status:** Complete
**Wave:** 2
**Requirement:** ADM-02

## Drizzle query shape

Two parallel queries via `Promise.all`:

```ts
const [rowsResult, totalsResult] = await Promise.all([
  db.select().from(submissions).orderBy(desc(submissions.dateCreated)).limit(50).offset(offset),
  db.select({ count: sql<number>`count(*)::int` }).from(submissions),
]);
```

`count(*)::int` casts Postgres `bigint` → `int` so JS gets a number, not a string.

## Performance (local Postgres, N=55)

Query times (dev server, cold + warm) on local Postgres in Docker:
- Cold first request: ~50–100 ms total (includes JS hydration + middleware compile)
- Warm request: ~5–8 ms for the rows+count parallel pair
- Negligible for v9.0.1's expected N (sub-thousand submissions)

`count(*)` runs once per page render. At N=247 with the secondary index `dateCreated` it's still seq-scan-fast on a low-cardinality table (no joins). Acceptable.

## Mapping resilience — why both English keys AND Russian strings

`actions.ts` already maps incoming form values to Russian strings BEFORE
`db.insert`:

```ts
const specMap = {
  consultation: 'Онлайн-консультация',
  treatment:    'Лечение за рубежом',
  checkup:      'Чек-ап',
  'not-sure':   'Пока не определился',
};
```

So new rows always store Russian. But legacy/test rows MAY contain raw English
keys. `submission-mappings.ts` accepts BOTH forms idempotently:

```ts
SPECIALIZATION_LABELS: Record<string, string> = {
  consultation: 'Онлайн-консультация',
  treatment:    'Лечение за рубежом',
  checkup:      'Чек-ап',
  'not-sure':   'Пока не определился',
  'Онлайн-консультация': 'Онлайн-консультация',  // idempotent
  'Лечение за рубежом':  'Лечение за рубежом',
  'Чек-ап':              'Чек-ап',
  'Пока не определился': 'Пока не определился',
};
```

Critical context for future maintainers — do NOT remove the idempotent
passthrough rows; they protect against breakage if `actions.ts` mapping is
changed or removed.

## Decision: client-side filter UI preserved

Plan 02 is additive. The existing `useState`-driven filter UI in
`submissions-table.tsx` (status select + date range + Сбросить) is **kept
as-is** so users have working filtering during the milestone in case plan 03
slips. Plan 03 replaces it with URL-driven server filters.

## Loading state design

`next/src/app/admin/loading.tsx` — opaque utility skeleton, NO glass tokens
(per DESIGN.md / Phase 93 SHADCN-AUDIT for admin):

- `bg-background` body
- `bg-muted/30` skeleton card with "Загрузка заявок…" text
- `aria-busy="true"` + `aria-live="polite"` for accessibility
- No backdrop-filter, no `--liquid-blur-*` tokens

## Files

- `next/src/app/admin/page.tsx` — RSC with `searchParams` + parsePage + parallel queries + 2× Pagination (above + below)
- `next/src/app/admin/submissions-table.tsx` — extended to 6 columns (added Описание with truncate+title attr); header "Дата заявки"; uses `labelForSpecialization`; preserves client filter UI
- `next/src/app/admin/submission-mappings.ts` — `SPECIALIZATION_LABELS`, `STATUS_LABELS`, `labelForSpecialization`, `truncate`
- `next/src/app/admin/submission-mappings.test.ts` — 9/9 pass
- `next/src/app/admin/pagination-math.ts` — pure `computePageRange` helper (split out for testability)
- `next/src/app/admin/pagination.tsx` — client component `Pagination` using `useRouter`/`useSearchParams`/`usePathname` to preserve all params on navigation; reads from pagination-math.ts
- `next/src/app/admin/pagination.test.ts` — 7/7 pass
- `next/src/app/admin/loading.tsx` — SSR skeleton

## Verifications

- `pnpm build` exit 0
- `pnpm lint` exit 0
- `node --experimental-strip-types --test src/app/admin/submission-mappings.test.ts` → 9/9
- `node --experimental-strip-types --test src/app/admin/pagination.test.ts` → 7/7
- Manual smoke (see `97-02-MANUAL-VERIFY.md`):
  - Page 1: 50 rows (Тест 1..50), `1–50 из 55`, "Назад" disabled
  - Page 2: 5 rows (Тест 51..55), `51–55 из 55`, "Вперёд" disabled
  - Russian labels render for all 4 spec values
  - Truncated descriptions show with title attr for hover

## Threat dispositions

| ID | Disposition | Evidence |
|----|------------|----------|
| T-97-08 (server-log PII) | mitigate | `page.tsx` catch block stores generic message string only; never logs row contents. No console.log/error of row data anywhere in admin code. |
| T-97-09 (?page= injection) | mitigate | `parsePage` clamps to ≥1 with `Number.isNaN`; offset always ≥0; Drizzle `.limit().offset()` parameter-bound. |
| T-97-10 (description in DOM) | accept | Operator-only route (gate active per 97-01); hover-title is intentional UX. |
| T-97-11 (unbounded query) | mitigate | LIMIT 50 enforced; `count(*)` is fast on submissions (no joins, low cardinality). |
