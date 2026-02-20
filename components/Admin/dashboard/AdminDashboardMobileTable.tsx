'use client';

import { StatusChip } from '@/components/admin';
import { formatDateWithOrdinal } from '@/lib/utils';
import { ADMIN_DASHBOARD_CONST } from '@/lib/constants/admin';
import { useApplicationList } from '@/lib/hooks/useApplicationList';
import { AdminDashboardMobileTablePropTypes } from '@/types/admin.types';
import { Pagination } from '@/components/Pagination';

export default function AdminDashboardMobileTable({
  applications,
  currentTab,
  searchQuery,
  pagination,
}: AdminDashboardMobileTablePropTypes) {
  const {
    filteredApplications,
    paginatedApplications,
    currentPage,
    setCurrentPage,
  } = useApplicationList({
    applications,
    currentTab,
    searchQuery,
    pagination,
  });

  const displayedCount = paginatedApplications.length;
  const totalCount = filteredApplications.length;
  const footerText =
    totalCount > 0
      ? `Showing ${displayedCount} of ${totalCount} application${totalCount === 1 ? '' : 's'}`
      : 'Showing 0 of 0';

  const isEmpty = filteredApplications.length === 0;

  return (
    <>
      <div className="flex flex-col mt-5.5 gap-y-4">
        {isEmpty ? (
          <div className="p-12 text-center text-[16px] leading-6 tracking-[-0.31px] text-gray-600 rounded-3xl border-2 border-[#BAB7B2] bg-[#F5F4F2]">
            {ADMIN_DASHBOARD_CONST.EMPTY_STATE_MESSAGE}
          </div>
        ) : (
          paginatedApplications.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border-2 border-[#BAB7B2] bg-[#F5F4F2] p-4.5"
            >
              <div className="flex justify-between">
                <div className="font-bold text-[18px]">{app.applicantName}</div>
                <div className="font-medium">
                  <StatusChip theme={app.status} />
                </div>
              </div>
              <div className="flex text-[14px] leading-5 mt-3">
                <div className="w-37.5 mr-3">
                  <p className="text-[#74654C] font-medium ">Type</p>
                  <p className="font-normal">{app.type}</p>
                </div>
                <div className="w-37.5">
                  <p className="text-[#74654C] font-medium">Date Received</p>
                  <p className="font-normal">
                    {formatDateWithOrdinal(app.dateReceived)}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#BAB7B2] mt-3 flex text-[14px] leading-5 ">
                <div className="w-37.5 mr-3">
                  <p className="text-[#74654C] font-medium pt-3">Reviewer 1</p>
                  <p className="font-normal">
                    {app.reviewer1 === '' ? '-' : app.reviewer1}
                  </p>
                </div>
                <div className="w-37.5">
                  <p className="text-[#74654C] font-medium pt-3">Reviewer 2</p>
                  <p className="font-normal">
                    {app.reviewer2 === '' ? '-' : app.reviewer2}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 px-1 text-[14px] text-gray-600">
        {footerText}
      </div>
      {pagination && (
        <Pagination
          activePage={currentPage}
          itemCount={filteredApplications.length}
          numberItemsPerPage={pagination.numberPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
