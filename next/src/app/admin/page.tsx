import { desc, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';

import {
  parseFilterParams,
  buildWhere,
  isAnyFilterActive,
} from './filter-params';
import { Filters } from './filters';
import { Pagination } from './pagination';
import { SubmissionsTable } from './submissions-table';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Заявки -- Админ-панель',
  robots: { index: false },
};

export type SubmissionRow = {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  description: string | null;
  status: string;
  dateCreated: Date;
};

const PAGE_SIZE = 50;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilterParams(sp);
  const where = buildWhere(filters);
  const offset = (filters.page - 1) * PAGE_SIZE;
  const tokenInUrl = typeof sp.token === 'string' ? sp.token : undefined;
  const filtersActive = isAnyFilterActive(filters);

  let rows: SubmissionRow[] = [];
  let totalCount = 0;
  let error: string | null = null;

  try {
    const [rowsResult, totalsResult] = await Promise.all([
      db
        .select()
        .from(submissions)
        .where(where)
        .orderBy(desc(submissions.dateCreated))
        .limit(PAGE_SIZE)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(submissions)
        .where(where),
    ]);
    rows = rowsResult;
    totalCount = totalsResult[0]?.count ?? 0;
  } catch (e) {
    error =
      e instanceof Error ? e.message : 'Failed to connect to the database';
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const clampedPage = Math.min(Math.max(1, filters.page), totalPages);
  const countLabel = filtersActive ? 'Найдено' : 'Всего';

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-8 text-foreground">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Заявки</h1>
        <span className="text-sm text-muted-foreground">
          Страница {clampedPage} из {totalPages} · {countLabel}: {totalCount}
        </span>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Ошибка подключения к&nbsp;базе данных</p>
          <p className="mt-1 text-xs opacity-75">{error}</p>
        </div>
      ) : (
        <>
          <Filters current={filters} tokenInUrl={tokenInUrl} />
          <Pagination
            currentPage={clampedPage}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
          />
          <SubmissionsTable
            submissions={rows}
            anyFilterActive={filtersActive}
          />
          <Pagination
            currentPage={clampedPage}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
          />
        </>
      )}
    </main>
  );
}
