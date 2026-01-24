import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { IconButton } from './IconButton';
import { useState, useEffect } from 'react';

type PaginationPropTypes = {
  activePage: number;
  itemCount: number;
  numberItemsPerPage?: number;
  onPageChange: (page: number) => void;
};

type usePaginationPropTypes = {
  numberItemsPerPage?: number;
  activePage: number;
  itemCount: number;
};

const usePagination = ({
  numberItemsPerPage,
  itemCount,
  activePage,
}: usePaginationPropTypes) => {
  const [pageCount, setPageCount] = useState(1);
  const [numberPerPage, setNumberPerPage] = useState(10);

  const windowSize = 5;
  const maxPage = pageCount;
  const shouldShift = activePage > windowSize;

  const windowEnd = shouldShift ? Math.min(activePage, maxPage) : windowSize;
  const windowStart = Math.max(windowEnd - (windowSize - 1), 1);

  const setupPagination = (itemCount: number) => {
    const numberOfPages = Math.ceil(itemCount / numberPerPage);
    setPageCount(numberOfPages);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (numberItemsPerPage) setNumberPerPage(numberItemsPerPage);
  }, [numberItemsPerPage]);

  useEffect(() => {
    if (!itemCount) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setupPagination(itemCount);
  }, [itemCount, numberPerPage]);

  return {
    pageCount,
    windowStart,
  };
};

export const Pagination = ({
  activePage,
  itemCount,
  numberItemsPerPage,
  onPageChange,
}: PaginationPropTypes) => {
  const hook = usePagination({ numberItemsPerPage, itemCount, activePage });

  if (hook.pageCount <= 1) return null;

  return (
    <div className="flex justify-center items-center py-6">
      <div className="flex items-center gap-1">
        <IconButton
          name="paginationPage"
          value={`${Math.max(activePage - 1, 1)}`}
          disabled={activePage === 1}
          handleClick={() => onPageChange(Math.max(activePage - 1, 1))}
          additionalClasses={{
            button: ['bg-[#F1F2F4] hover:bg-[#dce5fa] cursor-pointer'],
          }}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </IconButton>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, hook.pageCount) }).map(
            (_, index) => {
              const pageNumber = hook.windowStart + index;
              const isActive = activePage === pageNumber;

              return (
                <IconButton
                  key={`pagination-${pageNumber}`}
                  name="paginationPage"
                  value={`${pageNumber}`}
                  handleClick={() => onPageChange(pageNumber)}
                  additionalClasses={{
                    button: [
                      isActive
                        ? 'bg-[#195CFF] text-white shadow-sm'
                        : 'text-black bg-[#F1F2F4] hover:bg-[#dce5fa] cursor-pointer',
                    ],
                  }}
                >
                  {pageNumber}
                </IconButton>
              );
            },
          )}
        </div>

        <IconButton
          name="paginationPage"
          value={`${Math.min(activePage + 1, hook.pageCount)}`}
          disabled={activePage === hook.pageCount}
          handleClick={() =>
            onPageChange(Math.min(activePage + 1, hook.pageCount))
          }
          additionalClasses={{
            button: ['bg-[#F1F2F4] hover:bg-[#dce5fa] cursor-pointer'],
          }}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </IconButton>
      </div>
    </div>
  );
};
