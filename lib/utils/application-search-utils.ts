import type { ApplicationType } from '@/types/admin.types';

export function filterApplicationsBySearch(
  applications: ApplicationType[],
  query: string,
): ApplicationType[] {
  const q = query.trim().toLowerCase();
  if (!q) return applications;
  return applications.filter((app) => {
    const name = (app.applicantName ?? '').toLowerCase();
    const r1 = (app.reviewer1 ?? '').toLowerCase();
    const r2 = (app.reviewer2 ?? '').toLowerCase();
    return name.includes(q) || r1.includes(q) || r2.includes(q);
  });
}
