'use client';

import type { ChangeEvent } from 'react';
import React, { useState } from 'react';

import type { SearchInputProps, SearchInputRef } from './SearchInput';
import SearchInput from './SearchInput';
import type { IFilterTable } from './ui/filter-table';
import { FilterTable } from './ui/filter-table';
import { HStack } from './utilities';

export interface ISearchTableParams {
  key: string;
  value: string;
}

type Props = {
  listFilter?: IFilterTable[];
  onSelectFilter?: (value: IFilterTable) => void;
  onSearchInput?: (value: string) => void;
  onSearch?: (value: ISearchTableParams) => void;
  onChangeInput?: (value: ChangeEvent<HTMLInputElement>) => void;
} & Omit<SearchInputProps, 'onSearch'>;

const SearchTable = React.forwardRef<SearchInputRef, Props>(({ listFilter, onSelectFilter, onChangeInput, onSearch, ...props }, ref) => {
  const [params, setParams] = useState<ISearchTableParams>({ key: 'all', value: '' });

  const handleSelectFilter = (e: IFilterTable) => {
    onSelectFilter?.(e);
    setParams((prev) => ({ ...prev, key: e.value }));

    if (params.value) {
      onSearch?.({ key: e.value, value: params.value });
    }
  };

  const handleSearchInput = (_value: string) => {
    setParams((prev) => {
      return { ...prev, value: _value };
    });
    onSearch?.({ key: params.key, value: _value });
  };

  return (
    <HStack spacing={0}>
      <FilterTable
        listFilter={[{ label: 'All', value: 'all' }, ...(listFilter || [])]}
        buttonClassName="h-9 text-xs rounded-tr-none rounded-br-none "
        isSearch
        iconClassName="ml-3 w-5"
        value={params.key}
        onChange={handleSelectFilter}
      />

      <SearchInput {...props} ref={ref} onSearch={handleSearchInput} onChangeInput={onChangeInput} />
    </HStack>
  );
});

export default SearchTable;
