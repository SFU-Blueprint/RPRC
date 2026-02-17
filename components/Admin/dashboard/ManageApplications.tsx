'use client';

import { useMemo, useState } from 'react';
import { inter, robotoCondensed } from '@/app/fonts';
import {
  AdminSearchBar,
  AdminDashboardTable,
  AdminDashboardMobileTable,
} from '@/components/Admin';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { Button } from '@/components/ui/button';
import { ADMIN_DASHBOARD_CONST } from '@/lib/constants/admin';
import { getPagination } from '@/lib/admin/utils';
import type { ManageApplicationsProps } from '@/types/admin.types';

export default function ManageApplications({ applications }: ManageApplicationsProps) {
  const [currentTab, setCurrentTab] = useState(ADMIN_DASHBOARD_CONST.TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const paginationMobile = useMemo(
    () => getPagination(applications.length, 5),
    [applications.length]
  );
  const paginationDesktop = useMemo(
    () => getPagination(applications.length, 10),
    [applications.length]
  );

  return (
    <div className="mb-20 -mx-4 md:-mx-8 px-4 md:px-8 w-full">
      <BackdropContainer>
        {/* Title and Search row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 first:mt-0">
          <h1
            className={`${robotoCondensed.className} text-[28px] md:text-[32px] font-bold shrink-0`}
          >
            Manage Applications
          </h1>
          <div className="w-full md:w-auto [&>div]:!mt-0">
            <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className={`${inter.className} flex gap-x-4 overflow-x-auto scrollbar-hide rounded-3xl md:rounded-none bg-background-off-white md:bg-transparent mt-6 p-0`}
        >
          {ADMIN_DASHBOARD_CONST.TABS.map((tab) => {
            const isActive = tab.value === currentTab.value;
            return (
              <Button
                key={tab.value}
                type="button"
                onClick={() => setCurrentTab(tab)}
                variant="outline"
                className={`cursor-pointer h-auto font-semibold text-[14px] md:text-[16px] px-4.25 md:px-6.75 py-3.25 md:py-3.5 rounded-lg border-2 border-gray-400 text-nowrap leading-5 ${isActive
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
            applications={applications}
            currentTab={currentTab}
            pagination={paginationMobile}
          />
        </div>
        <div className="hidden md:block">
          <AdminDashboardTable
            columns={ADMIN_DASHBOARD_CONST.TABLE_COLUMNS}
            applications={applications}
            currentTab={currentTab}
            pagination={paginationDesktop}
          />
        </div>
      </BackdropContainer>
    </div>
  );
}
