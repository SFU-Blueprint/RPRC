import ApplicationDetailPage from '@/components/admin/ApplicationDetailPage';
import { getAdminApplicationHeaderServer } from '@/lib/api/services/server/application-service';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationPage({ params }: PageProps) {
  const { id } = await params;
  const appId = id;

  const { name: headerName, status: headerStatus } =
    await getAdminApplicationHeaderServer(appId);

  return (
    <ApplicationDetailPage
      appId={appId}
      headerName={headerName}
      headerStatus={headerStatus}
    />
  );
}
