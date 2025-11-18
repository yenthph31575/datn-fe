'use client';

import { useProductsFeaturedQuery } from '@/api/product/queries';
import H2 from '@/components/text/H2';
import { Show } from '@/components/utilities';
import ProductItem from '@/modules/ProductsPage/components/ProductItem';
import React from 'react';

const FeaturedProducts = () => {
  const { data, isFetching } = useProductsFeaturedQuery({
    variables: { limit: 6 },
  });

  return (
    <section className="mt-10 rounded-lg bg-gray-50 py-10">
      <div className="mb-8 ">
        <H2 className="text-center text-primary-500">Sản phẩm nổi bật</H2>
      </div>

      <Show when={isFetching}>
        <div className="grid grid-cols-2 gap-5 px-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductItem key={index} loading />
          ))}
        </div>
      </Show>

      <Show when={!isFetching && (!data?.items || data.items.length === 0)}>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Chưa có sản phẩm nổi bật</p>
        </div>
      </Show>

      <Show when={!isFetching && data && data?.items?.length > 0}>
        <div className="grid grid-cols-2 gap-5 px-4 md:grid-cols-3 lg:grid-cols-4">
          {data?.items?.map((item) => (
            <ProductItem key={item._id} {...item} />
          ))}
        </div>
      </Show>
    </section>
  );
};

export default FeaturedProducts;
