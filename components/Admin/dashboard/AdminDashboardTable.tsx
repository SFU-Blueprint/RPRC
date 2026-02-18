'use client';

import { Table, StatusChip } from '@/components/Admin';
import { formatDateWithOrdinal } from '@/lib/utils';
import { ADMIN_DASHBOARD_CONST } from '@/lib/constants/admin';
import { AdminDashboardTablePropTypes } from '@/types/admin.types';
import { useRouter } from 'next/navigation';
import { useApplicationList } from './useApplicationList';

export default function AdminDashboardTable({
  columns,
  applications,
  currentTab,
  searchQuery,
  pagination,
}: AdminDashboardTablePropTypes) {
  const router = useRouter();
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

  const handleRowClick = (appId: string) => {
    router.push(`/admin/dashboard/${appId}`);
  };

  const displayedCount = paginatedApplications.length;
  const totalCount = filteredApplications.length;
  const footerText =
    totalCount > 0
      ? `Showing ${displayedCount} of ${totalCount} application${totalCount === 1 ? '' : 's'}`
      : 'Showing 0 of 0';

  const isEmpty = filteredApplications.length === 0;

  return (
    <Table
      columnNames={columns}
      activePage={currentPage}
      additionalClasses={{
        wrapper: 'mt-4 md:mt-8',
      }}
      pagination={
        pagination
          ? {
              itemCount: filteredApplications.length,
              numberPerPage: pagination.numberPerPage,
              usePagination:
                filteredApplications.length > pagination.numberPerPage,
            }
          : undefined
      }
      onPageChange={setCurrentPage}
      footer={footerText}
    >
      {isEmpty ? (
        <tr>
          <td
            colSpan={columns.length}
            className="p-12 text-center text-[16px] leading-6 tracking-[-0.31px] text-gray-600"
          >
            {ADMIN_DASHBOARD_CONST.EMPTY_STATE_MESSAGE}
          </td>
        </tr>
      ) : (
        paginatedApplications.map((app) => (
        <tr
          key={app.id}
          onClick={() => handleRowClick(app.id)}
          className="bg-[#F6F6F6] hover:bg-[#E9E9E8] cursor-pointer not-last:border-b not-last:border-[#BAB7B2] leading-6 tracking-[-0.31px] text-[16px]"
        >
          <td className="p-6 font-bold">{app.applicantName}</td>
          <td className="p-6 font-normal">{app.type}</td>
          <td className="p-6 font-normal">
            {formatDateWithOrdinal(app.dateReceived)}
          </td>
          <td className="p-6 font-normal">
            <StatusChip theme={app.status} />
          </td>
          <td className="p-6 font-normal">
            {app.reviewer1 === '' ? '-' : app.reviewer1}
          </td>
          <td className="p-6 font-normal">
            {app.reviewer2 === '' ? '-' : app.reviewer2}
          </td>
        </tr>
      ))
      )}
    </Table>
  );
}
