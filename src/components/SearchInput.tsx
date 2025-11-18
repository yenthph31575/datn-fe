'use client';

import { debounce } from 'lodash';
import type { ChangeEvent } from 'react';
import React, { useEffect, useImperativeHandle, useState } from 'react';

import { Icons } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/libs/common';
import { HStack } from './utilities';

export type SearchInputProps = {
  loading?: boolean;
  onSearch: (value: string) => void;
  className?: string;
  value?: string;
  onChangeInput?: (value: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};
export interface SearchInputRef {
  setValueInput: (value: string) => void;
}

const SearchInput = React.forwardRef<SearchInputRef, SearchInputProps>(
  ({ loading, onSearch, className, value = '', onChangeInput, placeholder }, ref) => {
    const [valueSearch, setValueSearch] = useState(value);

    const handleChangeInput = debounce((e: ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    }, 500);

    const handleClearSearch = () => {
      setValueSearch('');
      onSearch('');
    };

    const handleKeyPress = (e: any) => {
      if (e.key === 'Escape') {
        setValueSearch('');
        onSearch('');
      }
    };

    useImperativeHandle(ref, () => ({
      setValueInput: (_value) => {
        setValueSearch(_value);
      },
    }));

    useEffect(() => {
      if (value) {
        setValueSearch(value);
        onSearch(value);
      }
    }, [value, onSearch]);

    return (
      <div className={cn('relative w-[250px] lg:w-[300px]')}>
        <Input
          value={valueSearch}
          onChange={(e) => {
            setValueSearch(e.target.value);
            handleChangeInput(e);
            onChangeInput?.(e);
          }}
          className={cn(
            'h-9 rounded-l-none border-l-0 pl-10 text-xs+ ',
            {
              'pr-8': valueSearch && !loading,
            },
            className
          )}
          placeholder={placeholder ?? 'Search value...'}
          onKeyDown={handleKeyPress}
          rightIcon={
            valueSearch &&
            !loading && (
              <span className="-translate-y-1/2 absolute top-1/2 right-1 cursor-pointer hover:opacity-80">
                <Icons.close onClick={handleClearSearch} className="scale-[0.80] text-white" />
              </span>
            )
          }
        />

        <HStack className="absolute top-0 bottom-0 left-0 w-10 cursor-pointer rounded-tr-md rounded-br-md bg-main-button" pos="center">
          <span className="flex h-full w-full items-center justify-center">
            {valueSearch && loading ? (
              <Icons.spinner className="h-5 animate-spin text-grey-600" />
            ) : (
              <Icons.search fill="#fff" className="m-auto" />
            )}
          </span>
        </HStack>
      </div>
    );
  }
);

export default SearchInput;
