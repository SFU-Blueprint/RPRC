'use client';

import { useState } from 'react';
import { inter } from '@/app/fonts';
import AdminNavbar from '@/components/AdminNavbar';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import { ADMIN_DASHBOARD_MOCK, ADMIN_DASHBOARD_CONST } from './const';
import AdminDashboardTable from '@/components/AdminDashboardTable';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(ADMIN_DASHBOARD_CONST.TABS[0]);

  return (
    <>
      <AdminNavbar />
      <div className="md:px-7.25">
        <Tabs
          tabs={ADMIN_DASHBOARD_CONST.TABS}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          additionalClasses={{
            wrapper: 'md:mt-[43px] p-[10px] md:p-0',
          }}
        />
      </div>
      <div className="px-4 md:px-8 mt-5.75 md:mt-10.5 flex justify-around gap-x-4 md:gap-x-6 w-full">
        {ADMIN_DASHBOARD_MOCK.STAT_CARDS.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
      {/* <div className="max-w-480 mx-auto px-8 md:px-14 xl:px-28">
        
        <AdminDashboardTable
          columns={ADMIN_DASHBOARD_CONST.TABLE_COLUMNS}
          applications={ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK}
          currentTab={currentTab}
        />
      </div> */}
    </>
  );
}
