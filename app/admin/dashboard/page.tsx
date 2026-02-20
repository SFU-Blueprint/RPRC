import { ManageApplications, StatCards } from '@/components/admin';
import { robotoCondensed } from '@/app/fonts';
import { getAdminApplicationList, getAdminDashboardStats } from '@/lib/api/services/server/admin-application-service';
import { toStatCardsData } from '@/lib/constants/admin';

// Server-side data fetching  
export default async function AdminDashboard() {
  const [applications, stats] = await Promise.all([
    getAdminApplicationList(),
    getAdminDashboardStats(),
  ]);

  const statCardsData = toStatCardsData(stats);

  return (
    <div className="">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-10 lg:px-12 pb-12 md:pb-16 lg:pb-20 mt-2">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <h1
            className={`${robotoCondensed.className} mt-5.75 md:mt-10.5 mb-6 text-[28px] md:text-[32px] font-bold`}
          >
            Overview
          </h1>
          <StatCards stats={statCardsData} />
        </div>
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <ManageApplications applications={applications} />
        </div>
      </div>
    </div>
  );
}
