'use client';

import type { IProduct } from '@/api/product/types';
import React from 'react';
import Introduce from './Introduce';
import ProductImage from './ProductImage';

export type ProductInfoProps = {} & Partial<IProduct>;

const ProductInfo = (props: ProductInfoProps) => {
  return (
    <div className="flex">
      <div className="flex-[1.4] overflow-hidden">
        <ProductImage {...props} />
      </div>

      <div className="ml-10 flex-1">
        <Introduce {...props} />
      </div>
    </div>
  );
};

export default ProductInfo;
