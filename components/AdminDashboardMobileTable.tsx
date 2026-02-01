import Table from './Table';
import { formatDateWithOrdinal } from '@/lib/utils';
import StatusChip from './StatusChip';
import { AdminDashboardMobileTablePropTypes } from '@/types/adminDashboard';
import { useState, useMemo } from 'react';
import { Pagination } from './Pagination';

export default function AdminDashboardMobileTable({
  applications,
  currentTab,
  pagination,
}: AdminDashboardMobileTablePropTypes) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // TODO: This should be handled in the backend
  const filteredApplications = useMemo(() => {
    return applications.filter((app) =>
      currentTab.value !== 'all' ? app.status === currentTab.value : true,
    );
  }, [applications, currentTab]);

  // TODO: This should be handled in the backend
  const paginatedApplications = useMemo(() => {
    if (!pagination) {
      return filteredApplications;
    }
    const startIndex = (currentPage - 1) * pagination.numberPerPage;
    const endIndex = startIndex + pagination.numberPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, pagination]);

  return (
    <>
      <div className="flex flex-col mt-5.5 gap-y-4">
        {paginatedApplications.map((app) => (
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
        ))}
      </div>
      {pagination && (
        <Pagination
          activePage={currentPage}
          itemCount={filteredApplications.length}
          numberItemsPerPage={pagination.numberPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
