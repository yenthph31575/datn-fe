'use client';

import { useCancelOrderMutation, useOrderByIdQuery } from '@/api/order/queries';
import Breadcrumb from '@/components/Breadcrumb';
import H2 from '@/components/text/H2';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import { cn, onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Package, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DialogCancelOrder from '../OrdersPage/components/DialogCancelOrder';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    data: order,
    isFetching,
    error,
    refetch,
  } = useOrderByIdQuery({
    variables: orderId,
    enabled: Boolean(orderId),
    onError: onMutateError,
  });

  // Simplified status display function
  const getStatusBadge = () => {
    if (!order) return null;

    // Check if order is fully completed (delivered and paid)
    if (order.shippingStatus === 'DELIVERED' && order.paymentStatus === 'COMPLETED') {
      return (
        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', 'bg-green-100 text-green-800')}>
          <CheckCircle className="h-5 w-5" />
          Completed
        </span>
      );
    }

    // Status config based on shipping status
    const statusConfig = {
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle className="h-5 w-5" />,
        text: 'Pending',
      },
      PROCESSING: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="h-5 w-5" />,
        text: 'Processing',
      },
      SHIPPED: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Truck className="h-5 w-5" />,
        text: 'Shipping',
      },
      CANCELED: {
        color: 'bg-red-100 text-red-800',
        icon: <X className="h-5 w-5" />,
        text: 'Đã hủy',
      },
    };

    // If payment failed, show that first
    if (order.paymentStatus === 'FAILED') {
      return (
        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', 'bg-red-100 text-red-800')}>
          <AlertCircle className="h-5 w-5" />
          Payment Failed
        </span>
      );
    }

    // Otherwise show shipping status
    const config = (statusConfig as any)[order.shippingStatus] || statusConfig.PENDING;

    return (
      <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', config.color)}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 text-xl">Order not found</h2>
          <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href={ROUTER.ORDERS}>
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      // Kiểm tra xem date có hợp lệ không
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      // Kiểm tra xem date có hợp lệ không
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'N/A';
    }
  };

  return (
    <div>
      <Breadcrumb
        breadcrumbs={[
          { name: 'Home', path: ROUTER.HOME },
          { name: 'My Orders', path: ROUTER.ORDERS },
          { name: order ? `Order Code: ${order.orderCode}` : 'Order Details' },
        ]}
      />

      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href={ROUTER.ORDERS}>
            <Button variant="ghost" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại đơn hàng
            </Button>
          </Link>
          {order &&
            order.shippingStatus === 'PENDING' &&
            order.paymentStatus === 'PENDING' &&
            order.paymentMethod === 'CASH_ON_DELIVERY' && <DialogCancelOrder refetch={refetch} orderId={order._id} />}
        </div>

        <Show when={isFetching}>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Show>

        <Show when={!isFetching && !!order}>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Order header */}
            <div className="border-gray-200 border-b p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <H2 className="mb-1">Order Code: {order?.orderCode}</H2>
                  <p className="text-gray-500 text-sm">Đã đặt: {formatDate(order?.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">{getStatusBadge()}</div>
              </div>
            </div>

            {/* Order details */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Order items */}
                <div className="lg:col-span-2">
                  <h3 className="mb-4 font-medium text-lg">Danh sách sản phẩm</h3>
                  <div className="rounded-lg border border-gray-200">
                    {order?.items.map((item, index) => (
                      <div
                        key={index}
                        className={cn('flex items-start gap-4 p-4', index !== order.items.length - 1 && 'border-gray-200 border-b')}
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.productImage ? (
                            <Image src={item.productImage} alt={item.productName} fill className="object-cover object-center" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <h4 className="font-medium text-gray-900 text-sm">{item.productName}</h4>
                          {item.variantId && <p className="mt-1 text-gray-500 text-xs">Variant: {item.variantId}</p>}
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                            <p className="font-medium text-gray-900 text-sm">{formatNumber(item.price * item.quantity)} vnđ</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order summary */}
                  <div className="mt-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 font-medium text-lg">Tóm tắt đơn hàng</h3>
                    <div className="space-y-2">
                      <HStack className="justify-between">
                        <span className="text-gray-600 text-sm">Tổng tiền hàng</span>
                        <span className="font-medium text-sm">
                          {formatNumber((order?.totalAmount || 0) + (order?.discountAmount || 0))} vnđ
                        </span>
                      </HStack>
                      {(order?.discountAmount || 0) > 0 && (
                        <HStack className="justify-between">
                          <span className="text-gray-600 text-sm">Giảm giá</span>
                          <span className="font-medium text-red-600 text-sm">-{formatNumber(order?.discountAmount || 0)} vnđ</span>
                        </HStack>
                      )}
                      <Separator className="my-2" />
                      <HStack className="justify-between">
                        <span className="font-medium">Tổng cộng</span>
                        <span className="font-medium">{formatNumber(order?.totalAmount || 0)} vnđ</span>
                      </HStack>
                    </div>
                  </div>
                </div>

                {/* Shipping and payment info */}
                <div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 font-medium text-lg">Thông tin vận chuyển</h3>
                    <VStack spacing={8} align="start">
                      <div>
                        <p className="font-medium">{order?.shippingAddress.fullName}</p>
                        <p className="text-gray-600 text-sm">{order?.shippingAddress.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm">{order?.shippingAddress.addressLine1}</p>
                        {order?.shippingAddress.addressLine2 && <p className="text-sm">{order?.shippingAddress.addressLine2}</p>}
                        <p className="text-sm">
                          {order?.shippingAddress.city}, {order?.shippingAddress.district} {order?.shippingAddress.postalCode}
                        </p>
                        {order?.shippingAddress.ward && <p className="text-sm">{order?.shippingAddress.ward}</p>}
                      </div>
                    </VStack>
                  </div>

                  <div className="mt-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 font-medium text-lg">Phương thức thanh toán</h3>
                    <p className="text-gray-700 capitalize">
                      {order?.paymentMethod === 'CASH_ON_DELIVERY' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
                    </p>

                    {/* Payment status */}
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium text-sm">Trạng thái thanh toán</h4>
                      {order?.paymentStatus === 'COMPLETED' ? (
                        <div className="mt-2 rounded-md bg-green-50 p-2">
                          <p className="flex items-center font-medium text-green-600 text-sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {formatDateTime(order.updatedAt)}
                          </p>
                        </div>
                      ) : order?.paymentStatus === 'FAILED' ? (
                        <div className="mt-2 rounded-md bg-red-50 p-2">
                          <p className="flex items-center font-medium text-red-600 text-sm">
                            <X className="mr-2 h-4 w-4" />
                            Payment Failed
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 rounded-md bg-yellow-50 p-2">
                          <p className="flex items-center font-medium text-sm text-yellow-600">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Đang chờ thanh toán
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Shipping status */}
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium text-sm">Trạng thái vận chuyển</h4>
                      <div className="mt-2 space-y-2">
                        {/* Shipping timeline */}
                        <div className="flex items-center">
                          <div
                            className={cn(
                              'mr-2 h-4 w-4 rounded-full',
                              order?.shippingStatus !== 'CANCELED' ? 'bg-green-500' : 'bg-gray-300'
                            )}
                          ></div>
                          <p className="text-sm">Đã đặt hàng</p>
                          <p className="ml-auto text-gray-500 text-xs">{formatDate(order?.createdAt)}</p>
                        </div>

                        <div className="flex items-center">
                          <div
                            className={cn(
                              'mr-2 h-4 w-4 rounded-full',
                              ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order?.shippingStatus || '') ? 'bg-green-500' : 'bg-gray-300'
                            )}
                          ></div>
                          <p className="text-sm">Đang xử lý</p>
                        </div>

                        <div className="flex items-center">
                          <div
                            className={cn(
                              'mr-2 h-4 w-4 rounded-full',
                              ['SHIPPED', 'DELIVERED'].includes(order?.shippingStatus || '') ? 'bg-green-500' : 'bg-gray-300'
                            )}
                          ></div>
                          <p className="text-sm">Đang vận chuyển</p>
                        </div>

                        <div className="flex items-center">
                          <div
                            className={cn(
                              'mr-2 h-4 w-4 rounded-full',
                              order?.shippingStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'
                            )}
                          ></div>
                          <p className="text-sm">Đã vận chuyển</p>
                          {order?.shippingStatus === 'DELIVERED' && order.updatedAt && (
                            <p className="ml-auto text-gray-500 text-xs">{formatDate(order.updatedAt)}</p>
                          )}
                        </div>

                        {order?.shippingStatus === 'CANCELED' && (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 rounded-full bg-red-500"></div>
                            <p className="text-red-600 text-sm">Đã hủy</p>
                            <p className="ml-auto text-gray-500 text-xs">{formatDate(order.updatedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Container>
    </div>
  );
};

export default OrderDetailPage;
