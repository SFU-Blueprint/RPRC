import { CSV_COLUMNS } from '@/lib/constants/admin';
import type { ApplicationType } from '@/types/admin.types';

const escape = (v: string | null | undefined): string => {
  const text = v ?? '';
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function downloadApplicationsCsv(applications: ApplicationType[]): void {
  const csv = [
    CSV_COLUMNS.map((c) => escape(c.header)).join(','),
    ...applications.map((a) =>
      CSV_COLUMNS.map((c) => escape(c.value(a))).join(','),
    ),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
