'use client';

import type { SubmissionRow } from './page';

interface SubmissionsTableProps {
  submissions: SubmissionRow[];
}

// Placeholder -- implemented in Task 2
export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  return <div>Loading table ({submissions.length} rows)...</div>;
}
