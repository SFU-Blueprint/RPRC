import { ManageApplications, StatCards } from '@/components/admin';
import { robotoCondensed } from '@/lib/fonts';
import { ADMIN_APPLICATIONS } from '@/lib/mock-data';
import { toStatCardsData } from '@/lib/constants/admin';

export default async function AdminDashboard() {
  // const [applications, backendStats] = await Promise.all([getAdminApplicationList(), getAdminDashboardStats()]);
  const applications = ADMIN_APPLICATIONS;
  const stats = {
    independent: applications.filter((application) => application.type === 'individual').length,
    organization: applications.filter((application) => application.type === 'organization').length,
    toReview: applications.filter((application) => application.status === 'to_review').length,
  };
  return (
    <div>
      <div className="max-w-screen-2xl mx-auto px-8 md:px-10 lg:px-12 pb-12 md:pb-16 lg:pb-20 mt-2">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <h1
            className={`${robotoCondensed.className} mt-5.75 md:mt-10.5 mb-6 text-[28px] md:text-[32px] font-bold`}
          >
            Overview
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">Demo data — review actions are not saved.</p>
          <StatCards stats={toStatCardsData(stats)} />
        </div>
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <ManageApplications applications={applications} />
        </div>
      </div>
    </div>
  );
}
