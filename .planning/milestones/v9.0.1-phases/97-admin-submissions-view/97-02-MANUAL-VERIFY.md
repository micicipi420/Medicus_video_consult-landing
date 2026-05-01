# 97-02 Manual Verify

Dev server: `PORT=3201 pnpm dev` with `ADMIN_TOKEN=test-token-32chars-min-yes-this-is-fine-for-test`.

DB seeded with 55 rows mixing all 4 specializations and 3 statuses (date_created spread across last 55 hours).

## Curl evidence

### Page 1 (default) — `/admin?token=...`

- Header text "Дата заявки" present in HTML
- Header line: `Страница 1 из 2 · Всего: 55`
- Pagination component: `1–50 из 55`, "Назад" disabled, "Вперёд" enabled
- 50 rows rendered (Тест 1 .. Тест 50)
- All 4 Russian specialization labels visible: "Чек-ап", "Лечение за рубежом", "Онлайн-консультация", "Пока не определился"
- Description column: long descriptions truncated at 80 chars with `…`; rendered as `<td title="<full>">truncated…</td>`
- Status badges show Russian labels: Новая / Связались / Завершено

### Page 2 — `/admin?token=...&page=2`

- Rows rendered: Тест 51, Тест 52, Тест 53, Тест 54, Тест 55 (5 rows)
- Pagination: `51–55 из 55`, "Назад" enabled, "Вперёд" disabled

## Sample row renderings

| name | phone | specialization (Russian) | description | status (Russian badge) |
|------|-------|--------------------------|-------------|------------------------|
| Тест 1 | +7 (701) 532 0007 | Лечение за рубежом | (null → empty cell, title='') | Связались |
| Тест 3 | +7 (701) 532 0021 | Пока не определился | "Описание заявки номер 3 — длинный текст для проверки усечения по 80 сим…" (truncated to 80 chars) | Новая |
| Тест 12 | +7 (701) 532 0084 | Чек-ап | "Описание заявки номер 12 — длинный текст для проверки усечения по 80 си…" | Новая |

## Drizzle SQL evidence

Query shape (pseudocode emitted by Drizzle):
```sql
SELECT id, name, phone, specialization, description, status, date_created
FROM submissions
ORDER BY date_created DESC
LIMIT 50 OFFSET 0;     -- page 1

SELECT count(*)::int FROM submissions;   -- totals query (parallel)
```

Page 2 emits `OFFSET 50`. Row count from totals query: **55**.

## Build + lint

- `pnpm build` exit 0 (admin route 6.82 kB)
- `pnpm lint` exit 0 (no new warnings)

## node:test results

- `submission-mappings.test.ts`: **9/9 pass** (mappings, idempotence, truncate)
- `pagination.test.ts` (via `pagination-math.ts`): **7/7 pass** (clamping, boundaries, totalCount=0/1/247)
