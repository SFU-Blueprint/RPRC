'use client';

import { inter } from '@/app/fonts';
import AdminNavbar from '@/components/AdminNavbar';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import { ADMIN_DASHBOARD_MOCK, ADMIN_DASHBOARD_CONST } from './const';
import { useState } from 'react';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(ADMIN_DASHBOARD_CONST.TABS[0]);

  return (
    <>
      <AdminNavbar
        adminName={ADMIN_DASHBOARD_MOCK.ADMIN_NAME}
        profilePictureUrl={ADMIN_DASHBOARD_MOCK.PROFILE_PICTURE_URL}
      />
      <div
        className={`bg-[#D2E9FF] ${inter.className} font-bold text-[36px] w-113 h-23.25 rounded-r-4xl flex items-center justify-center mt-15`}
      >
        {ADMIN_DASHBOARD_CONST.PAGE_TITLE}
      </div>
      <div className="mx-50">
        <div className="mt-15 flex justify-center gap-x-19">
          {ADMIN_DASHBOARD_MOCK.STAT_CARDS.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
        <Tabs
          tabs={ADMIN_DASHBOARD_CONST.TABS}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
    </>
  );
}
