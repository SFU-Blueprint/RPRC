'use client';

import { useMemo, useState } from 'react';
import { inter, robotoCondensed } from '@/app/fonts';
import {
  AdminSearchBar,
  AdminDashboardTable,
  AdminDashboardMobileTable,
} from '@/components/admin';
import { Button } from '@/components/ui/button';
import { ADMIN_DASHBOARD_CONST } from '@/lib/constants/admin';
import { getPagination } from '@/lib/utils/pagination-utils';
import { filterApplicationsBySearch } from '@/lib/utils/application-search-utils';
import type { ManageApplicationsProps } from '@/types/admin.types';
import { downloadApplicationsCsv } from '@/lib/utils/csv-utils';

export default function ManageApplications({
  applications,
}: ManageApplicationsProps) {
  const [currentTab, setCurrentTab] = useState(ADMIN_DASHBOARD_CONST.TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBySearch = useMemo(
    () => filterApplicationsBySearch(applications, searchQuery),
    [applications, searchQuery],
  );

  const paginationMobile = useMemo(
    () => getPagination(filteredBySearch.length, 5),
    [filteredBySearch.length],
  );
  const paginationDesktop = useMemo(
    () => getPagination(filteredBySearch.length, 10),
    [filteredBySearch.length],
  );

  return (
    <div className="mb-20 w-full">
      {/* No backdrop on mobile; backdrop container from md up */}
      <div className="rounded-[16px] p-5 md:border-2 md:bg-[#F6F6F6] md:p-5 md:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] lg:p-6">
        <div className="flex items-center justify-between gap-4">
          <h1
            className={`${robotoCondensed.className} text-[30px] md:text-[32px] font-bold`}
          >
            Manage Applications
          </h1>
          <Button
            type="button"
            onClick={() => downloadApplicationsCsv(filteredBySearch)}
            className={`${inter.className} cursor-pointer shrink-0 gap-2 h-auto font-semibold text-[14px] md:text-[16px] text-primary-black px-4.25 md:px-6.75 py-3.25 md:py-3.5 rounded-lg border-2 border-gray-400 text-nowrap leading-5 bg-transparent hover:bg-primary-black hover:text-primary-foreground hover:border-primary-black`}
          >
            Download List
          </Button>
        </div>

        <div className="mt-6 w-full [&>div]:!mt-0">
          <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Row 3: Filter Tabs */}
        <div
          className={`${inter.className} flex gap-x-4 overflow-x-auto scrollbar-hide mt-6 p-0`}
        >
          {ADMIN_DASHBOARD_CONST.TABS.map((tab) => {
            const isActive = tab.value === currentTab.value;
            return (
              <Button
                key={tab.value}
                type="button"
                onClick={() => setCurrentTab(tab)}
                variant="outline"
                className={`cursor-pointer h-auto font-semibold text-[14px] md:text-[16px] px-4.25 md:px-6.75 py-3.25 md:py-3.5 rounded-lg border-2 border-gray-400 text-nowrap leading-5 ${
                  isActive
                    ? 'bg-primary-black text-primary-foreground border-primary-black hover:bg-primary-black hover:text-primary-foreground'
                    : 'bg-transparent hover:bg-primary-black hover:text-primary-foreground hover:border-primary-black'
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tables */}
        <div className="block md:hidden">
          <AdminDashboardMobileTable
            applications={filteredBySearch}
            currentTab={currentTab}
            pagination={paginationMobile}
            searchQuery={searchQuery}
          />
        </div>
        <div className="hidden md:block">
          <AdminDashboardTable
            columns={ADMIN_DASHBOARD_CONST.TABLE_COLUMNS}
            applications={filteredBySearch}
            currentTab={currentTab}
            pagination={paginationDesktop}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
