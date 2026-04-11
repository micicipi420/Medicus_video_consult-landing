'use client';

import { useMemo, useState } from 'react';

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

interface SubmissionsTableProps {
  submissions: SubmissionRow[];
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новые' },
  { value: 'contacted', label: 'Связались' },
  { value: 'completed', label: 'Завершено' },
] as const;

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  contacted: 'Связались',
  completed: 'Завершено',
};

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

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (new Date(s.dateCreated) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(s.dateCreated) > to) return false;
      }
      return true;
    });
  }, [submissions, statusFilter, dateFrom, dateTo]);

  const hasActiveFilters =
    statusFilter !== 'all' || dateFrom !== '' || dateTo !== '';

  function resetFilters() {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="status-filter"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Статус
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date-from"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            С
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="date-to"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            По
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="h-9 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Filtered count */}
      {hasActiveFilters && (
        <p className="mb-4 text-sm text-muted-foreground">
          Показано: {filtered.length} из {submissions.length}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Направление</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {submissions.length === 0
                    ? 'Заявок пока нет'
                    : 'Нет заявок по выбранным фильтрам'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatDate(row.dateCreated)}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.specialization}</TableCell>
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
    </div>
  );
}
