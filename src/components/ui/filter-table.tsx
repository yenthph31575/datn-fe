import type { ChangeEvent } from 'react';
import React, { memo, useEffect, useState } from 'react';

import { Icons } from '@/assets/icons';
import { useTablet } from '@/hooks/breakpoint';

import { cn } from '@/libs/common';
import { Show, VStack } from '../utilities';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const FilterTableList = ({
  tabFilter,
  handleTabFilter,
  listFilter,
  tag,
}: {
  tabFilter: number;
  handleTabFilter: (value: number) => void;
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
            'flex w-full max-w-[21rem] cursor-pointer items-center justify-between py-2 pr-10 pl-4 font-normal text-grey-600 text-sm leading-5 hover:bg-gray-200',
            tabFilter === index && 'bg-primary-400 text-white'
          )}
          onClick={() => handleTabFilter(index)}
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
  onChange?: (value: IFilterTable) => void;
  isSearch?: boolean;
  inputClassName?: string;
  placeholder?: string;
  iconClassName?: string;
  disabled?: boolean;
  tag?: (data: any) => React.ReactNode;
};

const FilterTable = memo(
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
    const [tabFilter, setTabFilter] = useState<number>(placeholder ? -1 : 0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isTablet = useTablet();

    const handleTabFilter = (_value: number) => {
      setTabFilter(_value);
      if (onChange) onChange(listFilter[_value]);
      setIsOpen(false);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      if (!defaultList) return;
      if (!e.target.value) {
        setListFilter(defaultList);
      } else {
        const _listFilter = defaultList.filter((item) => item.label.toLowerCase().match(new RegExp(e.target.value.toLowerCase(), 'g')));
        setListFilter(_listFilter);
      }
    };

    useEffect(() => {
      if (!defaultList) return;
      setListFilter(defaultList);
    }, [defaultList, isOpen]);

    useEffect(() => {
      if (!value || !defaultList) {
        setTabFilter(placeholder ? -1 : 0);
        return;
      }
      const defaultIndex = defaultList.findIndex((item) => item.value === value);
      setTabFilter(defaultIndex === -1 ? 0 : defaultIndex);
    }, [value, defaultList, placeholder]);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="select"
            className={cn(
              'h-10 rounded-sm border bg-[#091E420A] px-4 hover:bg-grey-100 ',
              { 'h-9 px-3 text-[0.8rem]': isTablet },
              buttonClassName,
              isOpen && 'bg-primary-400 text-white hover:bg-primary-400'
            )}
            disabled={disabled}
          >
            <p className="line-clamp-1 max-w-[8.6rem] break-all">{defaultList[tabFilter]?.label ?? placeholder}</p>
            <Icons.chevronDown className={cn('ml-3', isTablet && 'w-[1.35rem]', iconClassName)} stroke={!isOpen ? '#333333' : 'white'} />
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
                />
              </div>
            </Show>

            <FilterTableList
              listFilter={listFilter}
              handleTabFilter={(_value: number) => handleTabFilter(_value)}
              tabFilter={tabFilter}
              tag={tag}
            />
          </VStack>
        </PopoverContent>
      </Popover>
    );
  }
);

export { FilterTable, FilterTableList };
