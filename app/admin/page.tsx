'use client';

import { useEffect, useState } from 'react';
import { inter } from '@/app/fonts';
import AdminNavbar from '@/components/AdminNavbar';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import AdminSearchBar from '@/components/AdminSearchBar';
import { ADMIN_DASHBOARD_MOCK, ADMIN_DASHBOARD_CONST } from './const';
import AdminDashboardTable from '@/components/AdminDashboardTable';
import AdminDashboardMobileTable from '@/components/AdminDashboardMobileTable';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(ADMIN_DASHBOARD_CONST.TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce the search query
  // TODO: Use the debouncedSearchQuery to filter the applications in the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      <div className="px-4 md:px-8 mb-20">
        <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="block md:hidden">
          <AdminDashboardMobileTable
            applications={ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK}
            currentTab={currentTab}
            pagination={{
              itemCount: ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK.length,
              numberPerPage: 5,
            }}
          />
        </div>
        <div className="hidden md:block">
          <AdminDashboardTable
            columns={ADMIN_DASHBOARD_CONST.TABLE_COLUMNS}
            applications={ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK}
            currentTab={currentTab}
            pagination={{
              itemCount: ADMIN_DASHBOARD_MOCK.APPLICATIONS_MOCK.length,
              numberPerPage: 5,
            }}
          />
        </div>
      </div>
    </>
  );
}
