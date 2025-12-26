'use client';

import { useVouchersQuery } from '@/api/voucher/queries';
import Breadcrumb from '@/components/Breadcrumb';
import NoDataAvailable from '@/components/NoDataAvailable';
import H2 from '@/components/text/H2';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import { onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { Ticket } from 'lucide-react';
import Link from 'next/link';
import VoucherCard from './components/VoucherCard';
import VoucherSkeleton from './components/VoucherSkeleton';

type VoucherFilterTab = 'all' | 'active' | 'inactive' | 'expired';

const VouchersPage = () => {
  const { data, isFetching } = useVouchersQuery({
    onError: onMutateError,
  });

  return (
    <div>
      <Breadcrumb breadcrumbs={[{ name: 'Trang chủ', path: ROUTER.HOME }, { name: 'Mã giảm giá' }]} />

      <Container className="py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <H2>Các mã giảm giá hiện có</H2>
          {/* <div className="mt-4 w-full sm:mt-0 sm:w-64">
            <SearchInput placeholder="Tìm kiếm mã giảm giá..." onSearch={handleSearch} value={searchKeyword} loading={isFetching} />
          </div> */}
        </div>

        {/* Hiển thị skeleton khi đang tải dữ liệu */}
        <Show when={isFetching}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <VoucherSkeleton key={index} />
            ))}
          </div>
        </Show>

        <Show when={!isFetching && (!data || data?.length === 0)}>
          <NoDataAvailable
            title="Không có mã giảm giá"
            description="Hiện tại không có mã giảm giá nào khả dụng."
            icon={<Ticket className="h-16 w-16 text-gray-400" />}
            action={
              <Link href={ROUTER.COLLECTIONS}>
                <Button>Tiếp tục mua hàng</Button>
              </Link>
            }
          />
        </Show>

        <Show when={!isFetching && data && data.length > 0}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.map((voucher) => (
              <VoucherCard key={voucher._id} voucher={voucher} />
            ))}
          </div>
        </Show>
      </Container>
    </div>
  );
};

export default VouchersPage;
