# 97-03 SUMMARY — URL-driven filters + flatten useState filter UI

**Status:** Complete
**Wave:** 3
**Requirement:** ADM-03

## Final URL schema

```
/admin
  ?from=YYYY-MM-DD          # inclusive lower bound
  &to=YYYY-MM-DD            # inclusive upper bound (parsed to 23:59:59.999Z)
  &spec=<Russian string>    # whitelisted; see ALLOWED_SPEC
  &status=<new|contacted|completed>
  &page=<positive int>
  &token=<admin token>      # only when arrived via URL auth (97-01)
```

## Allowed values

### `spec` — Russian strings (must match `actions.ts` WRITE-time mapping)
```
Онлайн-консультация
Лечение за рубежом
Чек-ап
Пока не определился
```

### `status` — English values (per `STATUS_LABELS` keys)
```
new
contacted
completed
```

Unknown values are silently dropped (filter not applied) — see threat T-97-12.

## Date parsing rules

- Strict ISO format `YYYY-MM-DD` (regex enforced); other shapes → null
- `from` parses to `T00:00:00.000Z` (UTC start-of-day)
- `to` parses to `T23:59:59.999Z` (UTC end-of-day) — INCLUSIVE upper bound
- `Number.isNaN(d.getTime())` rejects invalid dates after parse
- `parseFilterParams` is NaN-safe and pure

## Token-in-URL handling

`page.tsx` reads `searchParams.token` and, if present, passes `tokenInUrl`
prop to `Filters`. `Filters` then renders a hidden `<input name="token">` so
GET form submission preserves auth across reloads.

If auth came via `X-Admin-Token` header (curl/proxy), the header is the
caller's responsibility to maintain on subsequent requests. The form does NOT
introspect headers and does NOT add a hidden token input in that case.

## Why native `<form method="get">`

- Shareable URLs by construction: every filter state has a unique URL
- No client JavaScript for the filter form itself (server component)
- Pagination + filter compose for free: `<Pagination>` reads
  `useSearchParams()` and rebuilds URL preserving ALL params, not just `page`
- One render, one query — no client/server state mismatch

## Decision: client-side filter UI was REPLACED, not duplicated

The pre-Phase-97 useState-driven filter UI in `submissions-table.tsx` is
REMOVED in this plan. `submissions-table.tsx` is now purely presentational:

- No `useState`
- No `useMemo`
- No `'all' / new / contacted / completed` STATUS_OPTIONS array (now lives in
  `filters.tsx`)
- No date-from / date-to inputs
- No `resetFilters` callback
- No "Показано: N из M" computed text
- 6 columns + filter-aware empty-state copy

Filter form moved to `filters.tsx` (server component). The component still
uses `'use client'` to allow shadcn Table primitives but no longer holds
filter state — purely render-only.

## Performance

count(*) with WHERE on local Postgres at N=55:
- Filtered query (1 condition) ~5 ms
- Filtered query (3 conditions) ~6 ms
- Negligible at expected production scale (<1k submissions)

## Files

- `next/src/app/admin/filter-parsing.ts` — pure URL-param parser + whitelist + `isAnyFilterActive` (no Drizzle deps; testable via node:test)
- `next/src/app/admin/filter-params.ts` — re-exports parsing + adds `buildWhere` Drizzle helper (separated so tests don't need path-alias resolution)
- `next/src/app/admin/filter-params.test.ts` — 10/10 pass (parseFilterParams + isAnyFilterActive)
- `next/src/app/admin/filters.tsx` — server component using `<form method="get">` with hidden token input + 4 inputs + Применить/Сбросить
- `next/src/app/admin/page.tsx` — RSC reads searchParams → parseFilterParams → buildWhere → parallel Drizzle queries → pass `anyFilterActive` to table; renders `<Filters>` above + `<Pagination>` above/below table
- `next/src/app/admin/submissions-table.tsx` — flattened to render-only; removed all useState/useMemo; filter-aware empty-state copy

## Verifications

- `pnpm build` exit 0 (admin route 6.16 kB, smaller than 97-02's 6.82 kB after removing client filter state)
- `pnpm lint` exit 0
- `node --experimental-strip-types --test src/app/admin/filter-params.test.ts` → 10/10
- Manual smoke (see `97-03-MANUAL-VERIFY.md`):
  - 5 filter URL combinations return correct totalCount (matches DB ground truth)
  - Form values preserved on round-trip (verified by HTML inspection of `value=` and `selected=`)
  - Empty-state copy correct ("Нет заявок по выбранным фильтрам")
  - Reset link clears params, preserves token
  - Whitelist drops unknown spec/status/dates

## Threat dispositions

| ID | Disposition | Evidence |
|----|------------|----------|
| T-97-12 (URL filter injection) | mitigate | `parseFilterParams` whitelists `spec` against `ALLOWED_SPEC` and `status` against `ALLOWED_STATUS`; date parser regex-matches `YYYY-MM-DD` only. Unknown values → null → filter not applied. Drizzle `eq`/`gte`/`lte` parameter-bound. Verified by 10/10 unit tests. |
| T-97-13 (filter URL referer leak) | accept | Specialization names + status values are public-knowledge. Sensitive `?token=` portion handled by 97-01. |
| T-97-14 (unbounded date range DoS) | mitigate | LIMIT 50 always; count(*) on bounded table without joins runs in <10 ms at N=55. |
| T-97-15 (description preview disclosure) | accept | Operator-only route; gate active per 97-01. |
