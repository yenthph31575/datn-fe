import { useBrands } from '@/api/brand/queries';
import { useCategoriesQuery } from '@/api/category/queries';
import H3 from '@/components/text/H3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { HStack, VStack } from '@/components/utilities';
import { cn } from '@/libs/common';
import { debounce } from 'lodash';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LIST_PRICE_FILTER } from '../../libs/consts';

type Filter = {
  brandId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
};

type Props = {
  onChange?: (filter: Partial<Filter>) => void;
};

const FilterLeftBar = ({ onChange }: Props) => {
  const [filter, setFilter] = useState<Partial<Filter>>({});
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const { data: categories } = useCategoriesQuery({ variables: { limit: 1000 } });
  const { data: brands } = useBrands({ variables: { limit: 1000 } });

  const searchParams = useSearchParams();
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const pathname = usePathname();

  // Debounced function to update filter
  const debouncedUpdateFilter = useCallback(
    debounce((newFilter: Partial<Filter>) => {
      onChange?.(newFilter);
    }, 500),
    [onChange]
  );

  // Update filter and call onChange with debounce
  const updateFilter = useCallback(
    (newFilter: Partial<Filter>) => {
      setFilter(newFilter);
      debouncedUpdateFilter(newFilter);
    },
    [debouncedUpdateFilter]
  );

  // Handle radio button price range selection
  const handlePriceRangeChange = (value: string) => {
    const [min, max] = value.split('-').map(Number);

    setMinPrice(min.toString());
    setMaxPrice(max.toString());

    updateFilter({
      ...filter,
      minPrice: min,
      maxPrice: max,
    });
  };

  // Handle input change for min price with debounce
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);

    const min = value ? Number(value) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    updateFilter({
      ...filter,
      minPrice: min,
      maxPrice: max,
    });
  };

  // Handle input change for max price with debounce
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);

    const min = minPrice ? Number(minPrice) : undefined;
    const max = value ? Number(value) : undefined;

    updateFilter({
      ...filter,
      minPrice: min,
      maxPrice: max,
    });
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateFilter.cancel();
    };
  }, [debouncedUpdateFilter]);

  return (
    <VStack className="w-[280px]" spacing={36}>
      <VStack spacing={32}>
        <H3 className="text-primary-600">Categories</H3>

        <VStack spacing={20} className="max-h-[300px] overflow-auto">
          {categories?.items?.map((item) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('category', item._id);

            const href = `${pathname}?${params.toString()}`;
            return (
              <Link
                href={href}
                key={item._id}
                className={cn('flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-primary-200', {
                  'bg-primary-200': category === item._id,
                })}
                onClick={() => updateFilter({ ...filter, categoryId: item._id })}
              >
                <span>{item.name}</span>

                <ChevronRight className="w-5" />
              </Link>
            );
          })}
        </VStack>
      </VStack>

      <Separator />

      <VStack spacing={20}>
        <H3 className="text-primary-600">Price (VND)</H3>

        <RadioGroup value={minPrice && maxPrice ? `${minPrice}-${maxPrice}` : undefined} onValueChange={handlePriceRangeChange}>
          <VStack spacing={16}>
            {LIST_PRICE_FILTER?.map((item) => (
              <Label className="flex cursor-pointer space-x-2 text-sm" key={item.value}>
                <RadioGroupItem value={item.value} />
                <span className="font-normal">{item.label}</span>
              </Label>
            ))}
          </VStack>
        </RadioGroup>
        <HStack noWrap className="px-8">
          <Separator className="flex-1 border-primary-400" />
          <span>or</span>
          <Separator className="flex-1 border-primary-400" />
        </HStack>
        <HStack noWrap>
          <Input type="number" placeholder="From (vnđ)" value={minPrice} onChange={handleMinPriceChange} />
          <span>-</span>
          <Input type="number" placeholder="To (vnđ)" value={maxPrice} onChange={handleMaxPriceChange} />
        </HStack>
      </VStack>

      <Separator />

      <VStack spacing={24}>
        <H3 className="text-primary-600">Brands</H3>

        <VStack spacing={20} className="max-h-[300px] overflow-auto">
          {brands?.items?.map((item) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('brand', item._id);

            const href = `${pathname}?${params.toString()}`;
            return (
              <Link
                href={href}
                key={item._id}
                className={cn('flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-primary-200', {
                  'bg-primary-200': brand === item._id,
                })}
                onClick={() => updateFilter({ ...filter, brandId: item._id })}
              >
                <span>{item.name}</span>

                <ChevronRight className="w-5" />
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default FilterLeftBar;
