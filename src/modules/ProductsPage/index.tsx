'use client';

import { useProductsQuery } from '@/api/product/queries';
import type { IProductQuery } from '@/api/product/types';
import Breadcrumb from '@/components/Breadcrumb';
import NoDataAvailable from '@/components/NoDataAvailable';
import { Separator } from '@/components/ui/separator';
import { TablePagination } from '@/components/ui/table';
import { Show } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import { onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import FilterLeftBar from './components/FilterLeftBar';
import FilterTopBar from './components/FilterTopBar';
import ProductItem from './components/ProductItem';

const ProductPage = () => {
  const [paramsQuery, setParamsQuery] = useState<Partial<IProductQuery>>({
    page: 1,
    limit: 20,
  });

  const searchParams = useSearchParams();
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');

  const { data, isFetching } = useProductsQuery({
    variables: { ...paramsQuery, brandId: String(brand), categoryId: String(category) },
    onError: onMutateError,
  });

  return (
    <section>
      <Breadcrumb breadcrumbs={[{ name: 'Home', path: ROUTER.HOME }, { name: 'Collection' }]} />

      <Container className="mt-10">
        <div className=" flex">
          <FilterLeftBar onChange={(value) => setParamsQuery((prev) => ({ ...prev, ...value }))} />

          <div className="ml-4 flex-1 lg:ml-8">
            <FilterTopBar total={data?.meta.total || 0} />

            <Separator className="my-6" />

            <Show when={isFetching}>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <ProductItem key={index} loading />
                ))}
              </div>
            </Show>

            <Show when={!isFetching && data && data?.items?.length > 0}>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {data?.items?.map((item) => (
                  <ProductItem key={item._id} {...item} />
                ))}
              </div>
            </Show>

            <Show when={!isFetching && data && data?.items?.length === 0}>
              <NoDataAvailable />
            </Show>

            <div className="mt-10">
              <TablePagination
                pagination={data?.meta}
                onPageSizeChange={(limit) => setParamsQuery((prev) => ({ ...prev, limit }))}
                onPageChange={(page) => setParamsQuery((prev) => ({ ...prev, page }))}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductPage;
