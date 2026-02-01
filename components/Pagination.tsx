import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from './Button';
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
        <Button
          name="paginationPage"
          value={`${Math.max(activePage - 1, 1)}`}
          disabled={activePage === 1}
          handleClick={() => onPageChange(Math.max(activePage - 1, 1))}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, hook.pageCount) }).map(
            (_, index) => {
              const pageNumber = hook.windowStart + index;
              const isActive = activePage === pageNumber;

              return (
                <Button
                  key={`pagination-${pageNumber}`}
                  name="paginationPage"
                  value={`${pageNumber}`}
                  handleClick={() => onPageChange(pageNumber)}
                  isActive={isActive}
                >
                  {pageNumber}
                </Button>
              );
            },
          )}
        </div>

        <Button
          name="paginationPage"
          value={`${Math.min(activePage + 1, hook.pageCount)}`}
          disabled={activePage === hook.pageCount}
          handleClick={() =>
            onPageChange(Math.min(activePage + 1, hook.pageCount))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
