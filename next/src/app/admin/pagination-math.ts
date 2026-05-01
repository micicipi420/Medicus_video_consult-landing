/**
 * Pure pagination math — extracted from pagination.tsx for testability
 * (node:test can't load TSX files that import next/navigation).
 */
export interface PageRange {
  start: number; // 1-indexed; 0 when totalCount===0
  end: number; // inclusive last row on page; 0 when totalCount===0
  totalPages: number; // >= 1
  clampedPage: number; // currentPage clamped to [1, totalPages]
}

export function computePageRange(
  currentPage: number,
  pageSize: number,
  totalCount: number
): PageRange {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
  if (totalCount === 0) {
    return { start: 0, end: 0, totalPages: 1, clampedPage: 1 };
  }
  const start = (clampedPage - 1) * pageSize + 1;
  const end = Math.min(clampedPage * pageSize, totalCount);
  return { start, end, totalPages, clampedPage };
}
