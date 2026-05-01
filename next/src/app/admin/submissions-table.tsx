'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { SubmissionRow } from './page';
import {
  STATUS_LABELS,
  labelForSpecialization,
  truncate,
} from './submission-mappings';

interface SubmissionsTableProps {
  submissions: SubmissionRow[];
  anyFilterActive: boolean;
}

function getStatusVariant(
  status: string
): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'new':
      return 'default';
    case 'contacted':
      return 'secondary';
    case 'completed':
      return 'outline';
    default:
      return 'outline';
  }
}

function formatDate(date: Date): string {
  const d = new Date(date);
  return (
    d.toLocaleDateString('ru-RU') +
    ' ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  );
}

const DESCRIPTION_MAX = 80;

/**
 * Render-only submissions table. Plan 03 removed the local useState filter UI;
 * filtering now happens server-side via URL params (see filters.tsx + page.tsx).
 *
 * Empty-state copy is filter-aware: "Нет заявок по выбранным фильтрам" when
 * filters are active, "Заявок пока нет" when the table is genuinely empty.
 */
export function SubmissionsTable({
  submissions,
  anyFilterActive,
}: SubmissionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата заявки</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Направление</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                {anyFilterActive
                  ? 'Нет заявок по выбранным фильтрам'
                  : 'Заявок пока нет'}
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{formatDate(row.dateCreated)}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  {labelForSpecialization(row.specialization)}
                </TableCell>
                <TableCell title={row.description ?? ''}>
                  {truncate(row.description, DESCRIPTION_MAX)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(row.status)}>
                    {STATUS_LABELS[row.status] ?? row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
