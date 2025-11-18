import { useElementSize } from '@mantine/hooks';
import { ChevronDown } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { memo, useEffect, useState } from 'react';

import { Icons } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/utilities';
import { cn } from '@/libs/common';

type IListData = {
  label: string;
  value: string;
  isShow?: boolean;
};
type Props = {
  className?: string;
  disabled?: boolean;
  data?: IListData[];
  values?: string[];
  placeholder?: string;
  onChange?: (e: IListData[]) => void;
  onValueChange?: (e: string[]) => void;
};

const SelectMulti = ({ className, values, data, onChange, onValueChange, placeholder }: Props) => {
  const [Data, setData] = useState<IListData[]>(data || []);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [defaultData, setDefaultData] = useState<IListData[]>(data || []);
  const { ref, width } = useElementSize();

  const isSelectAll = !defaultData?.some((item) => !item.isShow);

  const handleSelectALl = () => {
    const _Data = Data?.map((item) => ({ ...item, isShow: !isSelectAll }));

    const _listValuesSelect = !isSelectAll ? Data?.map((item) => item.value) : [];

    setData(_Data);
    setDefaultData(_Data);

    onChange?.(_Data);
    onValueChange?.(_listValuesSelect);
  };

  const handleClearAll = () => {
    const _Data = defaultData?.map((item) => ({ ...item, isShow: false }));
    setValueSearch('');
    setData(_Data);
    setDefaultData(_Data);

    onChange?.(_Data);
    onValueChange?.([]);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
    if (!e.target.value) {
      setData(defaultData);
    } else {
      const _Data = defaultData?.filter((item) => String(item.label)?.toLowerCase()?.match(new RegExp(e.target.value.toLowerCase(), 'g')));
      setData(_Data || []);
    }
  };

  const handleCheckItem = (clientId: string) => {
    const _Data = Data?.map((item) => (item.value === clientId ? { ...item, isShow: !item.isShow } : item));
    const _defaultData = defaultData?.map((item) => (item.value === clientId ? { ...item, isShow: !item.isShow } : item));

    const _listValuesSelect = _defaultData?.filter((item) => item.isShow)?.map((item) => item.value);

    setData(_Data);
    setDefaultData(_defaultData);

    onChange?.(_Data);
    onValueChange?.(_listValuesSelect);
  };

  useEffect(() => {
    if (!data || !!valueSearch) return;
    let _data: any = [];

    if (values) {
      _data = data?.map((item) => ({ ...item, isShow: values.some((x) => x === item.value) }));
    } else {
      _data = data?.map((item) => ({ ...item, isShow: true }));
    }

    setData(_data);
    setDefaultData(_data);
  }, [data, values, valueSearch]);

  const listClient = defaultData?.filter((item) => item.isShow)?.map((item) => item.label);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <HStack noWrap pos="apart" ref={ref} className={cn('rounded-md border hover:border-primary-400', className)}>
            <div className="line-clamp-1 h-9 w-full cursor-pointer pt-1.5 pl-2 font-san text-grey-400">
              {listClient?.length === 1 && listClient?.[0]}
              {!isSelectAll && listClient?.length > 1 && `Select Multiple (${listClient?.length})`}
              {isSelectAll && '( All )'}
              {!isSelectAll && (!listClient || listClient?.length === 0) && (placeholder ?? 'Select ...')}
            </div>

            <div className="px-1.5 text-grey-500">
              <ChevronDown className="h-5 w-5" />
            </div>
          </HStack>
        </PopoverTrigger>

        <PopoverContent className="w-full overflow-hidden rounded-md py-0" style={{ width: `${width - 6}px` }}>
          <div className="flex flex-col font-sans text-xs">
            <input
              className={cn('h-10 w-full rounded-t-md border-b px-2.5 font-medium text-gray-600 text-sm outline-none')}
              onChange={handleSearch}
              placeholder="Search.."
              value={valueSearch}
            />

            <Separator className="border-primary-400" />

            <HStack pos="apart">
              <Label className="flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-gray-200">
                <Input type="checkbox" checked={isSelectAll} onChange={() => {}} onClick={handleSelectALl} className="h-4 w-4" />
                <div className="text-grey-600 text-sm">
                  Select all
                  <span className="ml-1 text-primary-400">({Data.length || 0})</span>
                </div>
              </Label>
              <Show when={listClient?.length > 0}>
                <button className="pr-2 hover:opacity-90" onClick={handleClearAll}>
                  <Icons.X className="h-4 w-4 stroke-grey-600" />
                </button>
              </Show>
            </HStack>

            <Separator className="border-primary-400" />

            <VStack spacing={2} className="mt-2 max-h-[260px] overflow-y-auto">
              {Data?.map((client, index) => (
                <Label
                  className={cn('flex cursor-pointer items-center space-x-2 px-2 py-2 text-grey-600 hover:bg-primary-300', {
                    'bg-primary-400 text-white accent-primary-400': client.isShow,
                  })}
                  key={client.value}
                >
                  <Input
                    type="checkbox"
                    checked={client.isShow}
                    onClick={() => handleCheckItem(client.value)}
                    onChange={() => {}}
                    className="h-4 w-4 cursor-pointer "
                  />
                  <span className="font-sans text-[13px] leading-5">{client.label}</span>
                </Label>
              ))}
            </VStack>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default memo(SelectMulti);
