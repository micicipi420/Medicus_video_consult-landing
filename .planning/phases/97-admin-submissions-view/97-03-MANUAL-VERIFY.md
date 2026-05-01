# 97-03 Manual Verify

Dev server: `PORT=3201 pnpm dev` with `ADMIN_TOKEN=test-token-32chars-min-yes-this-is-fine-for-test`.

DB seeded with 55 rows mixing 4 specs × 3 statuses (12 distinct cells, 4–5 rows each).

DB ground truth (`SELECT specialization, status, COUNT(*) FROM submissions GROUP BY 1,2`):
```
Лечение за рубежом  | completed | 5
Лечение за рубежом  | contacted | 5
Лечение за рубежом  | new       | 4
Онлайн-консультация | completed | 5
Онлайн-консультация | contacted | 4
Онлайн-консультация | new       | 5
Пока не определился | completed | 4
Пока не определился | contacted | 5
Пока не определился | new       | 5
Чек-ап              | completed | 4
Чек-ап              | contacted | 5
Чек-ап              | new       | 4   ← used as filter target below
```

## Filter URL examples (all return correct counts)

| URL | Expected | Actual totalCount |
|-----|----------|-------------------|
| `?token=...` (no filters) | 55 | 55 (badge: Всего: 55) |
| `?token=...&spec=%D0%A7%D0%B5%D0%BA-%D0%B0%D0%BF` (Чек-ап) | 13 (4+5+4) | 13 (badge: Найдено: 13) |
| `?token=...&spec=Чек-ап&status=new` | 4 | 4 |
| `?token=...&from=2026-04-29` | rows w/ date >= 2026-04-29 | 50 |
| `?token=...&from=2099-01-01&to=2099-12-31` | 0 | 0 ("Нет заявок по выбранным фильтрам") |

## Filter form preserves values on round-trip

```html
<input id="from" type="date" name="from" value="2026-04-29"/>
<option value="Чек-ап" selected="">Чек-ап</option>
```
Bookmark URL pasted in fresh tab → form pre-populated. Sharable URL confirmed.

## Pagination + filters compose

`?token=...&spec=Чек-ап&page=2`:
- 13 rows match Чек-ап filter, all fit on page 1 (50/page)
- Page 2 displays Pagination's empty state correctly ("Нет заявок", clamped page label)
- Pagination links preserve `spec=Чек-ап` query param when navigating (verified by source review of `pagination.tsx`)

## Empty-state copy

| Filter active? | Empty rows? | Copy |
|----------------|-------------|------|
| Yes | Yes | "Нет заявок по выбранным фильтрам" — confirmed for `from=2099-01-01` |
| No | Yes | "Заявок пока нет" — N/A in this run (DB has 55 rows) |

## Reset link

```html
<a href="/admin?token=test-token-32chars-min-yes-this-is-fine-for-test">Сбросить</a>
```
Clears all filter params, preserves token. Verified.

## Whitelist enforcement

- `?spec=invalid` → filter dropped (treated as no spec filter)
- `?spec=checkup` (English key) → dropped (whitelist contains Russian only)
- `?status=garbage` → dropped
- `?from=invalid-date` → dropped
- All exercised in `filter-params.test.ts` (10/10 pass)

## SQL evidence

When filters applied, Drizzle composes WHERE via `and(gte, lte, eq, eq)`. Query shape (parameterized):
```
SELECT id, name, phone, specialization, description, status, date_created
FROM submissions
WHERE date_created >= $1 AND specialization = $2 AND status = $3
ORDER BY date_created DESC
LIMIT 50 OFFSET 0;

SELECT count(*)::int FROM submissions WHERE date_created >= $1 AND specialization = $2 AND status = $3;
```

## Build + lint

- `pnpm build` exit 0 (admin route 6.16 kB — slightly smaller after removing client filter useState)
- `pnpm lint` exit 0 (no new warnings)

## Сбросить link verified — all 9 plan checks pass
