'use client';

import { AdminNavbar, ManageApplications, StatCard } from '@/components/Admin';
import { robotoCondensed } from '@/app/fonts';
import { ADMIN_DASHBOARD_MOCK } from './const';

export default function AdminDashboard() {
  return (
    <>
      <AdminNavbar />
      <div className="mx-auto min-h-screen bg-[#FFFDFA]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <h1
            className={`${robotoCondensed.className} mt-5.75 md:mt-10.5 mb-6 text-[28px] md:text-[32px] font-bold`}
          >
            Overview
          </h1>
          <div className="mb-16 md:mb-24 flex w-full gap-x-4 md:gap-x-6">
            {ADMIN_DASHBOARD_MOCK.STAT_CARDS.map((card) => (
              <StatCard key={card.type} type={card.type} value={card.value} />
            ))}
          </div>
          <ManageApplications />
        </div>
      </div>
    </>
  );
}
