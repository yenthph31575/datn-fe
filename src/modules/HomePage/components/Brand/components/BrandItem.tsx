'use client';

import type { IBrand } from '@/api/brand/types';
import H4 from '@/components/text/H4';
import { ROUTER } from '@/libs/router';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  loading?: boolean;
} & Partial<IBrand>;
const BrandItem = ({ loading, name, slug, _id, logo }: Props) => {
  return (
    <Link href={`${ROUTER.COLLECTIONS}?brand=${_id}`} className="group h-full">
      <div className="relative flex h-full w-full overflow-hidden rounded-lg border">
        <Image
          src={logo || ''}
          alt=""
          width={300}
          height={300}
          className="w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        <div className="absolute right-2 bottom-2 hidden h-10 w-10 rounded-full border border-primary-500 hover:bg-primary-300 group-hover:flex">
          <ChevronRight className="m-auto text-primary-500" />
        </div>
      </div>

      <H4 className="mt-2 text-center font-poppins text-[#041675] text-sm">{name}</H4>
    </Link>
  );
};

export default BrandItem;
