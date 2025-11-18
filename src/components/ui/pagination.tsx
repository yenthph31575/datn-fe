import React from 'react';

import { cn } from '@/libs/common';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DOTS, usePagination } from '../../hooks/usePagination';
import { Button } from './button';

type Props = {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
};

const Pagination = (props: Props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (paginationRange?.length === 0) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex items-center justify-center rounded-[8px] border border-white/15">
      <Button
        size={'sm'}
        variant={'transparent'}
        className="hidden items-center gap-1 px-4 py-2 font-semibold text-gray-800 text-sm md:flex"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon size={18} />
        Previous
      </Button>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return (
            <div className="mb-1 text-gray-800" key={pageNumber + i}>
              {pageNumber}
            </div>
          );
        }

        return (
          <Button
            size={'sm'}
            key={pageNumber}
            variant={`${pageNumber === currentPage ? 'default' : 'outline'}`}
            className={cn('w-9 rounded-sm font-semibold text-xs', pageNumber === currentPage ? 'text-white' : 'text-gray-800')}
            onClick={() => {
              onPageChange(pageNumber as number);
            }}
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button
        size={'sm'}
        variant={'transparent'}
        className="hidden items-center gap-1 px-4 py-2 font-semibold text-gray-800 text-sm md:flex"
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        Next
        <ChevronRightIcon size={18} />
      </Button>
    </div>
  );
};

export default Pagination;
