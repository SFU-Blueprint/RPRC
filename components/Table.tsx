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
    <div className={`${inter.className} ${additionalClasses?.wrapper ?? ''}`}>
      <table
        className={`w-full table-fixed border-separate border-spacing-y-4.5 ${additionalClasses?.table ?? ''}`}
      >
        <thead>
          <tr>
            {columnNames.map((column, index) => (
              <th
                key={column.value}
                className={`
                  first:pl-7.5 last:pr-7.5 px-2 pb-1.5 text-left font-medium text-[16px]
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
