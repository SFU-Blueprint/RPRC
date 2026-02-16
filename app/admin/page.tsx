'use client';

import { AdminNavbar, ManageApplications, StatCards } from '@/components/Admin';
import { robotoCondensed } from '@/app/fonts';

export default function AdminDashboard() {
  return (
    <div className="">
      <AdminNavbar />
      <div className="max-w-screen-2xl mx-auto px-8 md:px-10 lg:px-12 pb-12 md:pb-16 lg:pb-20 mt-2">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8">
          <h1
            className={`${robotoCondensed.className} mt-5.75 md:mt-10.5 mb-6 text-[28px] md:text-[32px] font-bold`}
          >
            Overview
          </h1>
          <StatCards />
          <ManageApplications />
        </div>
      </div>
    </div>
  );
}
