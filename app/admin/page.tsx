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
      <div className="px-8">
        <Tabs
          tabs={ADMIN_DASHBOARD_CONST.TABS}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          additionalClasses={{
            wrapper: 'mt-[43px]',
          }}
        />
        {/* <div className="max-w-480 mx-auto px-8 md:px-14 xl:px-28">
        <div className="mt-10 md:mt-15 flex justify-center gap-x-4 md:gap-x-8 lg:gap-x-12">
          {ADMIN_DASHBOARD_MOCK.STAT_CARDS.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
        
        <AdminDashboardTable
          columns={ADMIN_DASHBOARD_CONST.TABLE_COLUMNS}
          applications={ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK}
          currentTab={currentTab}
        />
      </div> */}
      </div>
    </>
  );
}
