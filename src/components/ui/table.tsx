import * as React from 'react';

import { Icons } from '@/assets/icons';
import { cn } from '@/libs/common';
import type { IMetaResponse } from '@/types';
import { ChevronDown } from 'lucide-react';
import { HStack, Show, VStack } from '../utilities';
import Pagination from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { SkeletonWrapper } from './skeleton-wrapper';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn('mt-4 text-muted-foreground text-sm', className)} {...props} />
);
TableCaption.displayName = 'TableCaption';

type TableSkeletonProps = {
  loading?: boolean;
  row?: number;
  col?: number;
};
export const TableSkeleton = ({ loading = false, row = 5, col = 4 }: TableSkeletonProps) => {
  return (
    <Show when={loading}>
      {Array.from({ length: row }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: col }, (__, index2) => (
            <TableCell key={index2} className="py-2">
              <SkeletonWrapper loading={loading} className="h-7 w-full min-w-[16px]"></SkeletonWrapper>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Show>
  );
};

export type TablePaginationProps = {
  onPageChange: (page: number) => void;
  pagination?: IMetaResponse;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
};
export const TablePagination = ({ onPageSizeChange, onPageChange, pagination }: TablePaginationProps) => {
  return (
    <HStack pos="apart" className="w-full text-white">
      <HStack className="hidden lg:flex">
        <Select value={String(pagination?.limit)} onValueChange={(value) => onPageSizeChange?.(Number(value))}>
          <SelectTrigger
            className="h-9 w-fit gap-1 rounded border border-[#5832201A] bg-primary-500 px-3 py-2 font-semibold text-xs"
            icon={<ChevronDown size={16} />}
          >
            Show <SelectValue />
          </SelectTrigger>

          <SelectContent className="font-semibold text-sm">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </HStack>

      <HStack className="gap-10">
        <div className="ml-2 hidden font-semibold text-gray-800 text-sm lg:flex">
          Page&nbsp;
          {Number(pagination?.page) || 0}&nbsp;of&nbsp;
          <SkeletonWrapper>{pagination?.totalPages || 0}</SkeletonWrapper>
        </div>

        <Pagination
          onPageChange={onPageChange}
          totalCount={pagination?.total || 0}
          currentPage={pagination?.page || 0}
          pageSize={pagination?.limit || 10}
        />
      </HStack>
    </HStack>
  );
};

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

type NodataTableProps = {
  col: number;
};

const NodataTable = ({ col }: NodataTableProps) => {
  return (
    <tr>
      <td colSpan={col + 1}>
        <HStack pos="center" className="px-4 pt-18 pb-24 lg:pt-24 lg:pb-32">
          <VStack>
            <Icons.noDataTable />

            <div className="mt-3 text-center font-medium text-grey-300 text-sm lg:text-base">No data available in table !</div>
          </VStack>
        </HStack>
      </td>
    </tr>
  );
};

export interface ITableColumn {
  title: string;
  key: string;
  getCell?: ({ value, row }: { value: any; row: any }) => React.ReactNode;
  align?: 'center' | 'left' | 'right';
  color?: string;
  className?: string;
}

type TableBaseProps = {
  columns: ITableColumn[];
  dataSource: any;
  loading?: boolean;
};

const TableBase = ({ columns, dataSource, loading }: TableBaseProps) => {
  return (
    <Table className="rounded border">
      <TableHeader>
        <TableRow className="bg-table-header-bg">
          {columns?.map((column, index) => (
            <TableHead
              key={column.key}
              className={cn(
                'relative pl-4 font-semibold text-grey-600',
                {
                  'text-left': !column.align || column.align === 'left',
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                },
                column.className
              )}
            >
              <div className={''}>{column.title}</div>
              {index > 0 && <div className="absolute top-2 bottom-2 left-0 border"></div>}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <Show when={!loading && dataSource && dataSource?.length > 0}>
          {dataSource?.map((row: any, index: number) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.getCell ? (
                    column.getCell({ value: row[column.key], row })
                  ) : (
                    <div
                      className={cn('line-clamp-3 min-h-4 w-full px-2 py-1 font-medium text-[13px] text-grey-600', {
                        'justify-start': !column.align || column.align === 'left',
                        'justify-center': column.align === 'center',
                        'justify-end': column.align === 'right',
                      })}
                      style={column.color ? { color: column.color } : undefined}
                    >
                      {row[column.key]}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Show>

        {/* Loading */}
        <Show when={loading}>
          {[1, 2, 3].map((item) => (
            <TableRow key={item}>
              {columns?.map((column) => (
                <TableCell key={column.key} className="py-1.5">
                  <SkeletonWrapper loading className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Show>
        <Show when={!loading && (!dataSource || dataSource?.length === 0)}>
          <NodataTable col={columns?.length} />
        </Show>
      </TableBody>
    </Table>
  );
};

export default TableBase;
