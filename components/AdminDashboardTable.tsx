import Table from './Table';
import { formatDateWithOrdinal } from '@/lib/utils';
import StatusChip from './StatusChip';
import { AdminDashboardTablePropTypes } from '@/types/adminDashboard';
import { useState, useMemo } from 'react';

export default function AdminDashboardTable({
  columns,
  applications,
  currentTab,
  pagination,
}: AdminDashboardTablePropTypes) {
  const [currentPage, setCurrentPage] = useState(1);

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
    <Table
      columnNames={columns}
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
    >
      {paginatedApplications.map((app) => (
        <tr
          key={app.id}
          className="bg-[#F5F4F2] not-last:border-b not-last:border-[#BAB7B2] leading-6 tracking-[-0.31px] text-[16px]"
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
      ))}
    </Table>
  );
}
