'use client';

import { inter } from '@/app/fonts';
import { ReactNode, useState } from 'react';
import { ColumnType } from '@/types/admin.types';
import { Pagination } from '@/components/Pagination';

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
  activePage?: number;
  children: ReactNode;
  additionalClasses?: {
    wrapper?: string;
    table?: string;
  };
  onPageChange?: (page: number) => void;
};

export default function Table({
  columnNames,
  children,
  additionalClasses,
  pagination,
  activePage: controlledPage,
  onPageChange,
}: TableProps) {
  const [internalPage, setInternalPage] = useState(1);
  const activePage = controlledPage ?? internalPage;

  const handlePageChange = (page: number) => {
    if (controlledPage == null) setInternalPage(page);
    onPageChange?.(page);
  };

  return (
    <div className={`${inter.className} ${additionalClasses?.wrapper ?? ''}`}>
      <div className="overflow-hidden rounded-t-4xl rounded-b-4xl border-2 border-[#BAB7B2]">
        <table
          className={`w-full table-fixed ${additionalClasses?.table ?? ''}`}
        >
          <thead>
            <tr className="bg-[#E9E9E8] border-b-2 border-[#BAB7B2]">
              {columnNames.map((column, idx) => (
                <th
                  key={column.value}
                  style={{ width: `${100 / columnNames.length}%` }}
                  className={`text-left p-6
                    ${column.width ?? ''} ${idx === 0 ? 'rounded-tl-4xl' : ''} 
                    ${idx === columnNames.length - 1 ? 'rounded-tr-4xl' : ''}
                    text-[16px] ${inter.className} leading-6 font-semibold tracking-[-0.31px]
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

      {pagination?.usePagination && (
        <Pagination
          activePage={activePage}
          itemCount={pagination.itemCount}
          numberItemsPerPage={pagination.numberPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
