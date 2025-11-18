import type { ChangeEvent } from 'react';
import React, { memo, useEffect, useState } from 'react';

import { Icons } from '@/assets/icons';
import { useTablet } from '@/hooks/breakpoint';

import { cn } from '@/libs/common';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Show, VStack } from '../utilities';

const FilterTableList = ({
  tabFilter,
  handleTabFilter,
  listFilter,
  tag,
}: {
  tabFilter: string[];
  handleTabFilter: (value: string) => void;
  listFilter?: IFilterTable[];
  tag?: (data: any) => React.ReactNode;
}) => {
  return (
    <div className="flex h-fit max-h-[20rem] w-full flex-col space-y-1 overflow-y-auto bg-white">
      {listFilter?.map((item, index) => (
        <div
          key={index}
          data-value={item.value}
          className={cn(
            'flex w-full max-w-[21rem] cursor-pointer items-center justify-between py-2 pr-6 pl-4 font-normal text-grey-600 text-sm leading-5 hover:bg-gray-200',
            Array.isArray(tabFilter) && tabFilter?.includes(item.value) && 'bg-[#4d8436] text-white hover:bg-[#4d8436]'
          )}
          onClick={() => handleTabFilter(item.value)}
        >
          {item.label}
          {tag?.(item)}
        </div>
      ))}
    </div>
  );
};

export type IFilterTable = {
  label: string;
  value: string;
  [key: string]: any;
};

type FilterTableProps = {
  value?: string;
  listFilter: IFilterTable[];
  buttonClassName?: string;
  onChange?: (id: string[]) => void;
  isSearch?: boolean;
  inputClassName?: string;
  placeholder?: string;
  iconClassName?: string;
  disabled?: boolean;
  tag?: (data: any) => React.ReactNode;
};

const FilterTableMulti = memo(
  ({
    isSearch = false,
    listFilter: defaultList,
    value,
    buttonClassName,
    inputClassName,
    iconClassName,
    placeholder,
    disabled,
    onChange,
    tag,
  }: FilterTableProps) => {
    const [listFilter, setListFilter] = useState<IFilterTable[]>(defaultList);
    const [tabFilter, setTabFilter] = useState<string[]>(placeholder ? [] : [defaultList[0].value]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isTablet = useTablet();

    const [valueSearch, setValueSearch] = useState<string>('');

    const handleTabFilter = (_value: string) => {
      setTabFilter((prev) => {
        let newListTabValue: string[] = [];

        if (prev.includes(_value)) {
          newListTabValue = prev.filter((tabValue) => tabValue !== _value);
        } else {
          newListTabValue = [...prev, _value];
        }

        if (onChange) {
          onChange(newListTabValue);
        }

        return newListTabValue;
      });
    };

    const isSelectAll = Boolean(listFilter?.length === tabFilter?.length && tabFilter?.length > 1);

    const handleSelectAll = () => {
      const _tabFilter = !isSelectAll ? listFilter?.map((c, index) => c.value) : [];
      if (onChange) {
        onChange(_tabFilter);
      }
      setTabFilter(_tabFilter);
    };

    const handleClearAll = () => {
      setTabFilter(placeholder ? [] : [defaultList[0].value]);
      if (onChange) {
        onChange([]);
      }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setValueSearch(e.target.value);
    };

    useEffect(() => {
      if (!defaultList) return;
      const _listFilter = defaultList.filter((item) => item.label.toLowerCase().match(new RegExp(valueSearch.toLowerCase(), 'g')));
      setListFilter(_listFilter);
    }, [defaultList, isOpen, valueSearch]);

    return (
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setValueSearch('');
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="select"
            className={cn(
              'h-10 rounded-sm border bg-[#091E420A] px-4 hover:bg-grey-100 ',
              { 'h-9 px-3 text-[0.8rem]': isTablet },
              buttonClassName,
              (isOpen || tabFilter.length > 1) && 'bg-primary-400 text-white hover:bg-primary-400'
            )}
            disabled={disabled}
          >
            <p className="line-clamp-1 max-w-[8.6rem] break-all">
              {isSelectAll ? (
                'Select All'
              ) : (
                <>
                  {tabFilter?.length === 1 ? (
                    <>{defaultList.find((item) => item.value === tabFilter[0])?.label}</>
                  ) : (
                    <>{tabFilter?.length > 1 ? `Select Multiple (${tabFilter.length})` : placeholder}</>
                  )}
                </>
              )}
            </p>
            <Icons.chevronDown
              className={cn('ml-3', isTablet && 'w-[1.35rem]', iconClassName)}
              stroke={isOpen || tabFilter.length > 1 ? 'white' : '#333333'}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-[110] w-[content] py-0">
          <VStack spacing={4} className="pb-2">
            <Show when={isSearch}>
              <div className="">
                <input
                  className={cn('h-10 w-full rounded-t-md border-b px-2.5 font-medium text-gray-600 text-sm outline-none', inputClassName)}
                  placeholder={`Search...(${defaultList?.length || 0})`}
                  onChange={handleSearch}
                  value={valueSearch}
                />
              </div>
            </Show>

            <div className="relative">
              <div
                className={cn(
                  'flex w-full max-w-[21rem] cursor-pointer items-center justify-between border-b py-2 pr-10 pl-4 font-normal text-grey-600 text-sm leading-5 hover:bg-gray-200',
                  isSelectAll && 'bg-[#34672e] text-white hover:bg-[#34672e]'
                )}
                onClick={() => handleSelectAll()}
              >
                Select all
              </div>

              {tabFilter.length > 1 && (
                <div className={cn('-translate-y-1/2 absolute top-1/2 right-3 cursor-pointer hover:opacity-70')} onClick={handleClearAll}>
                  <Icons.X className={cn('w-5', isSelectAll && 'stroke-white')} />
                </div>
              )}
            </div>

            <FilterTableList
              listFilter={listFilter}
              handleTabFilter={(_value: string) => handleTabFilter(_value)}
              tabFilter={tabFilter}
              tag={tag}
            />
          </VStack>
        </PopoverContent>
      </Popover>
    );
  }
);

export { FilterTableMulti };
