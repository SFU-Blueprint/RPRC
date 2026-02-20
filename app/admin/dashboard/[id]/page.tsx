import ApplicationDetailPage from '@/components/admin/ApplicationDetailPage';
import { getAdminApplicationPageDataServer } from '@/lib/api/services/server/application-service';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationPage({ params }: PageProps) {
  const { id } = await params;
  const appId = id;

  const { headerName, headerStatus, details, reviewHistory } =
    await getAdminApplicationPageDataServer(appId);

  return (
    <ApplicationDetailPage
      appId={appId}
      headerName={headerName}
      headerStatus={headerStatus}
      details={details}
      reviewHistory={reviewHistory}
    />
  );
}
