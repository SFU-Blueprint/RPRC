import ApplicationDetailPage from '@/components/admin/ApplicationDetailPage';
import { ADMIN_APPLICATION_DETAILS } from '@/lib/mock-data/admin-applications';

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = ADMIN_APPLICATION_DETAILS[id] ?? ADMIN_APPLICATION_DETAILS.APP01;
  return <ApplicationDetailPage appId={id} {...data} />;
}
