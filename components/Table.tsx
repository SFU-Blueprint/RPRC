import { inter } from '@/app/fonts';
import { ReactNode } from 'react';
import { ColumnType } from '@/types/adminDashboard';

type TableProps = {
  columnNames: ColumnType[];
  sort?: {
    sortedBy?: string;
    sortingOrder: 'asc' | 'desc';
  };
  pagination?: {
    itemCount: number;
    numberPerPage: number;
    usePagination?: boolean;
  };
  children: ReactNode;
  additionalClasses?: {
    wrapper?: string;
    table?: string;
  };
};

export default function Table({
  columnNames,
  children,
  additionalClasses,
}: TableProps) {
  return (
    <div
      className={`${inter.className} ${additionalClasses?.wrapper ?? ''} overflow-x-auto w-full`}
    >
      <table
        className={`w-full min-w-200 md:min-w-240 table-auto border-separate border-spacing-x-0 border-spacing-y-2 md:border-spacing-y-4.5 ${additionalClasses?.table ?? ''}`}
      >
        <thead>
          <tr>
            {columnNames.map((column, index) => (
              <th
                key={column.value}
                className={`
                  first:pl-4 last:pr-4 md:first:pl-7.5 md:last:pr-7.5 px-0 md:px-1 text-left font-medium text-[12px] md:text-[14px] lg:text-[16px]
                  ${column.width ?? ''}
                `}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
