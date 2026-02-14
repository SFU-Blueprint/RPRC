import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

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
  numberItemsPerPage = 10,
  itemCount,
  activePage,
}: usePaginationPropTypes) => {
  const pageCount = useMemo(() => {
    return Math.ceil(itemCount / numberItemsPerPage);
  }, [itemCount, numberItemsPerPage]);

  const { windowStart, windowEnd } = useMemo(() => {
    const windowSize = 5;
    const maxPage = pageCount;
    const shouldShift = activePage > windowSize;

    const end = shouldShift ? Math.min(activePage, maxPage) : windowSize;
    const start = Math.max(end - (windowSize - 1), 1);

    return { windowStart: start, windowEnd: end };
  }, [activePage, pageCount]);

  return {
    pageCount,
    windowStart,
    windowEnd,
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
    <div className="flex flex-wrap justify-center items-center py-6">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={activePage === 1}
          onClick={() => onPageChange(Math.max(activePage - 1, 1))}
        >
          <ChevronLeft className="mr-1" />
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
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className={cn(
                    'min-w-[40px]',
                    isActive && 'pointer-events-none'
                  )}
                >
                  {pageNumber}
                </Button>
              );
            },
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={activePage === hook.pageCount}
          onClick={() =>
            onPageChange(Math.min(activePage + 1, hook.pageCount))
          }
        >
          Next
          <ChevronRight className="ml-1" />
        </Button>
      </div>
    </div>
  );
};
