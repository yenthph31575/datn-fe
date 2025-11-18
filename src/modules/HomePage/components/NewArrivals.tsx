'use client';

import { useProductsNewArrivalsQuery } from '@/api/product/queries';
import H2 from '@/components/text/H2';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { ROUTER } from '@/libs/router';
import ProductItem from '@/modules/ProductsPage/components/ProductItem';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const NewArrivals = () => {
  const { data, isFetching } = useProductsNewArrivalsQuery({
    variables: { limit: 6 },
  });

  return (
    <section className="mt-10">
      <div className="mb-8 flex items-center justify-between">
        <H2 className="text-center text-primary-500">Sản phẩm mới</H2>
        <Link href={ROUTER.COLLECTIONS}>
          <Button variant="ghost" className="group">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <Show when={isFetching}>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductItem key={index} loading />
          ))}
        </div>
      </Show>

      <Show when={!isFetching && (!data?.items || data.items.length === 0)}>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Chưa có sản phẩm mới</p>
        </div>
      </Show>

      <Show when={!isFetching && data && data?.items?.length > 0}>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {data?.items?.map((item) => (
            <ProductItem key={item._id} {...item} />
          ))}
        </div>
      </Show>
    </section>
  );
};

export default NewArrivals;
