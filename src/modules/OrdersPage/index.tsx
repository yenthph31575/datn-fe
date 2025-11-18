'use client';

import { useOrdersQuery } from '@/api/order/queries';
import type { OrderStatus, PaymentStatus } from '@/api/order/types';
import Breadcrumb from '@/components/Breadcrumb';
import NoDataAvailable from '@/components/NoDataAvailable';
import Tabs from '@/components/tabs/Tabs';
import H2 from '@/components/text/H2';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/components/ui/table';
import { Show, VStack } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import { onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { AlertCircle, CheckCircle, Clock, Package, ShoppingBag, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import OrderItem from './components/OrderItem';

// Tab type to handle simplified status
type OrderFilterTab = 'all' | 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'payment-failed';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Convert tab to API status filters
  const getStatusFilters = (): { shippingStatus?: OrderStatus; paymentStatus?: PaymentStatus } => {
    switch (activeTab) {
      // Main status tabs
      case 'pending':
        return { shippingStatus: 'PENDING' };
      case 'processing':
        return { shippingStatus: 'PROCESSING' };
      case 'shipping':
        return { shippingStatus: 'SHIPPED' };
      case 'cancelled':
        return { shippingStatus: 'CANCELED' };
      case 'payment-failed':
        return { paymentStatus: 'FAILED' };

      // Combined success status - both delivered and payment completed
      case 'completed':
        return { shippingStatus: 'DELIVERED', paymentStatus: 'COMPLETED' };

      // All orders
      default:
        return {};
    }
  };

  const { data, isFetching, refetch } = useOrdersQuery({
    variables: {
      page,
      limit,
      ...getStatusFilters(),
    },
    onError: onMutateError,
  });

  // Reset page when changing tabs
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleTabChange = (value: string | number) => {
    setActiveTab(value.toString() as OrderFilterTab);
  };

  return (
    <div>
      <Breadcrumb breadcrumbs={[{ name: 'Home', path: ROUTER.HOME }, { name: 'My Orders' }]} />

      <Container className="py-8">
        <H2 className="mb-6">My Orders</H2>

        <div className="mb-6">
          <div className="mb-2 flex items-center">
            <h3 className="font-medium text-lg">Filter by Status</h3>
          </div>
          <Tabs
            data={[
              { label: 'Tất cả', value: 'all' },
              { label: 'Đã hoàn thành', value: 'completed' },
              { label: 'Đang xử lý', value: 'pending' },
              { label: 'Đang vận chuyển', value: 'shipping' },
              { label: 'Đã hủy', value: 'cancelled' },
              { label: 'Payment Failed', value: 'payment-failed' },
            ]}
            onChange={handleTabChange}
            value={activeTab}
            layoutId="order-status-tabs"
          />
        </div>

        <Show when={isFetching}>
          <VStack spacing={16} className="mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 w-full animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </VStack>
        </Show>

        <Show when={!isFetching && (!data?.items || data.items.length === 0)}>
          <NoDataAvailable
            title="Chưa có đơn hàng"
            description={getEmptyStateDescription(activeTab)}
            icon={getEmptyStateIcon(activeTab)}
            action={
              <Link href={ROUTER.COLLECTIONS}>
                <Button>Tiếp tục mua hàng</Button>
              </Link>
            }
          />
        </Show>

        <Show when={!isFetching && data && data.items.length > 0}>
          <VStack spacing={16} className="mt-4">
            {data?.items.map((order) => (
              <OrderItem key={order._id} order={order} refetch={refetch} />
            ))}
          </VStack>

          <div className="mt-8 flex justify-center">
            <TablePagination pagination={data?.meta} loading={isFetching} onPageChange={setPage} onPageSizeChange={setLimit} />
          </div>
        </Show>
      </Container>
    </div>
  );
};

// Helper function to get appropriate icon for empty state
function getEmptyStateIcon(tab: OrderFilterTab) {
  switch (tab) {
    case 'completed':
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    case 'pending':
      return <Clock className="h-16 w-16 text-yellow-500" />;
    case 'processing':
      return <Package className="h-16 w-16 text-blue-500" />;
    case 'shipping':
      return <Truck className="h-16 w-16 text-blue-500" />;
    case 'cancelled':
      return <X className="h-16 w-16 text-red-500" />;
    case 'payment-failed':
      return <AlertCircle className="h-16 w-16 text-red-500" />;
    default:
      return <ShoppingBag className="h-16 w-16 text-gray-400" />;
  }
}

// Helper function to get description for empty state
function getEmptyStateDescription(tab: OrderFilterTab): string {
  switch (tab) {
    case 'completed':
      return 'Bạn chưa có đơn hàng nào được hoàn thành.';
    case 'pending':
      return 'Bạn chưa có đơn hàng nào đang chờ xử lý.';
    case 'processing':
      return 'Bạn chưa có đơn hàng nào đang được xử lý.';
    case 'shipping':
      return 'Bạn chưa có đơn hàng nào đang vận chuyển.';
    case 'cancelled':
      return 'Bạn chưa có đơn hàng nào đã bị hủy.';
    case 'payment-failed':
      return 'Bạn chưa có đơn hàng nào thanh toán thất bại.';
    default:
      return 'Bạn chưa có đơn hàng nào.';
  }
}

export default OrdersPage;
