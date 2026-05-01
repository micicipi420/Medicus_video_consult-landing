import { desc } from 'drizzle-orm';

import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';

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

export default async function AdminPage() {
  let allSubmissions: SubmissionRow[] = [];
  let error: string | null = null;

  try {
    allSubmissions = await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.dateCreated));
  } catch (e) {
    error =
      e instanceof Error ? e.message : 'Failed to connect to the database';
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-8 text-foreground">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Заявки</h1>
        <span className="text-sm text-muted-foreground">
          Всего: {allSubmissions.length}
        </span>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Ошибка подключения к&nbsp;базе данных</p>
          <p className="mt-1 text-xs opacity-75">{error}</p>
        </div>
      ) : (
        <SubmissionsTable submissions={allSubmissions} />
      )}
    </main>
  );
}
