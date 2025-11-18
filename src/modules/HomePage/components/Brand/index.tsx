'use client';
import { useBrands } from '@/api/brand/queries';
import H2 from '@/components/text/H2';
import { Show } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import React from 'react';
import BrandItem from './components/BrandItem';

const Brand = () => {
  const { data, isFetching } = useBrands({ variables: { limit: 10 }, onError: onMutateError });
  return (
    <section className="mt-10 rounded-lg bg-[#FEF373] pt-8 pb-16">
      <div className="mb-8 flex items-center justify-between px-4">
        <H2 className="text-primary-500">Danh sách thương hiệu</H2>
        {/* <Link href={ROUTER.COLLECTIONS}>
          <Button variant="ghost" className="group">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link> */}
      </div>

      <Show when={isFetching}>
        <div className="grid grid-cols-2 gap-5 px-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <BrandItem key={index} loading />
          ))}
        </div>
      </Show>

      <Show when={!isFetching && (!data?.items || data?.items.length === 0)}>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Chưa có thương hiệu</p>
        </div>
      </Show>

      <Show when={!isFetching && data && data?.items?.length > 0}>
        <div className="grid grid-cols-2 gap-5 px-4 md:grid-cols-4 lg:grid-cols-6">
          {data?.items?.map((item) => (
            <BrandItem key={item._id} {...item} />
          ))}
        </div>
      </Show>
    </section>
  );
};

export default Brand;
