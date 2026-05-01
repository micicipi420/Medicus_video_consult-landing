'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { computePageRange } from './pagination-math';

interface PaginationProps {
  currentPage: number; // 1-indexed
  pageSize: number;
  totalCount: number;
}

export { computePageRange };

export function Pagination({
  currentPage,
  pageSize,
  totalCount,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { start, end, totalPages, clampedPage } = computePageRange(
    currentPage,
    pageSize,
    totalCount
  );

  function navigate(nextPage: number) {
    const next = new URLSearchParams(params?.toString() ?? '');
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  if (totalCount === 0) {
    return (
      <div className="flex items-center justify-between py-3 text-sm text-muted-foreground">
        <span>Нет заявок</span>
      </div>
    );
  }

  const prevDisabled = clampedPage <= 1;
  const nextDisabled = clampedPage >= totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
      <span className="text-muted-foreground">
        {start}–{end} из {totalCount}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={prevDisabled}
          onClick={() => navigate(clampedPage - 1)}
        >
          Назад
        </Button>
        <span className="px-2 text-muted-foreground">
          Страница {clampedPage} из {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={nextDisabled}
          onClick={() => navigate(clampedPage + 1)}
        >
          Вперёд
        </Button>
      </div>
    </div>
  );
}
