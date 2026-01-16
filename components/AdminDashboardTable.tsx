import Table from './Table';
import { formatDateWithOrdinal } from '@/lib/utils';
import StatusChip from './StatusChip';
import { AdminDashboardTablePropTypes } from '@/types/adminDashboard';

export default function AdminDashboardTable({
  columns,
  applications,
}: AdminDashboardTablePropTypes) {
  return (
    <Table
      columnNames={columns}
      additionalClasses={{
        wrapper: 'mt-11.25',
      }}
    >
      {applications.map((app) => (
        <tr key={app.id} className="bg-[#D4D0CA]">
          <td className="pl-7.5 py-13.75 font-bold text-[24px] leading-[160%] tracking-[0] border-y-4 border-[#CEC8B9] border-l-4 rounded-l-[25px]">
            {app.applicantName}
          </td>

          <td className="px-2 py-13.75 font-normal text-[24px] leading-[150%] tracking-[0] border-y-4 border-[#CEC8B9]">
            {app.type}
          </td>

          <td className="px-2 py-13.75 font-normal text-[24px] leading-[150%] tracking-[0] border-y-4 border-[#CEC8B9]">
            {formatDateWithOrdinal(app.dateReceived)}
          </td>

          <td className="px-2 py-13.75 text-[24px] border-y-4 border-[#CEC8B9]">
            <StatusChip theme={app.status} />
          </td>

          <td className="px-2 py-13.75 font-normal text-[24px] leading-[150%] tracking-[0] border-y-4 border-[#CEC8B9]">
            {app.reviewer1}
          </td>

          <td className="pr-7.5 py-13.75 font-normal text-[24px] leading-[150%] tracking-[0] border-y-4 border-[#CEC8B9] border-r-4 rounded-r-[25px]">
            {app.reviewer2}
          </td>
        </tr>
      ))}
    </Table>
  );
}
