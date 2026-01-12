'use client';

import { useOrderByIdQuery } from '@/api/order/queries';
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
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Package, RefreshCw, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DialogCancelOrder from '../OrdersPage/components/DialogCancelOrder';
import {
  getItemStatusColor,
  getItemStatusIcon,
  getItemStatusText,
  getReturnStatusColor,
  getReturnStatusIcon,
  getReturnStatusText,
} from '../OrdersPage/libs/utils';

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

  const getStatusBadge = () => {
    if (!order) return null;

    // Kiểm tra xem đơn hàng đã hoàn tiền chưa
    if (order.paymentStatus === 'REFUNDED') {
      return (
        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', 'bg-blue-100 text-blue-800')}>
          <RefreshCw className="h-5 w-5" />
          Đã hoàn tiền
        </span>
      );
    }

    // Kiểm tra xem đơn hàng đã hoàn tất hay chưa (đã giao hàng và đã thanh toán)
    if (order.shippingStatus === 'DELIVERED' && order.paymentStatus === 'COMPLETED') {
      return (
        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', 'bg-green-100 text-green-800')}>
          <CheckCircle className="h-5 w-5" />
          Hoàn tất
        </span>
      );
    }

    // Cấu hình trạng thái dựa trên trạng thái giao hàng
    const statusConfig = {
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle className="h-5 w-5" />,
        text: 'Chờ xử lý',
      },
      PROCESSING: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="h-5 w-5" />,
        text: 'Đang xử lý',
      },
      SHIPPED: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Truck className="h-5 w-5" />,
        text: 'Đang vận chuyển',
      },
      CANCELED: {
        color: 'bg-red-100 text-red-800',
        icon: <X className="h-5 w-5" />,
        text: 'Đã hủy',
      },
    };

    // Nếu thanh toán thất bại, hiển thị trạng thái này trước
    if (order.paymentStatus === 'FAILED') {
      return (
        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', 'bg-red-100 text-red-800')}>
          <AlertCircle className="h-5 w-5" />
          Thanh toán thất bại
        </span>
      );
    }

    // Nếu không, hiển thị trạng thái vận chuyển
    const config = (statusConfig as any)[order.shippingStatus] || statusConfig.PENDING;

    return (
      <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', config.color)}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getReturnStatusBadge = () => {
    if (!order || !order.returnStatus || order.returnStatus === 'NONE') return null;

    return (
      <span
        className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm', getReturnStatusColor(order.returnStatus))}
      >
        {getReturnStatusIcon(order.returnStatus)}
        {getReturnStatusText(order.returnStatus)}
      </span>
    );
  };

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 text-xl">Không tìm thấy đơn hàng</h2>
          <p className="mt-2 text-gray-600">Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.</p>
          <Link href={ROUTER.ORDERS}>
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đơn hàng
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
      console.error('Lỗi khi định dạng ngày:', error);
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
      console.error('Lỗi khi định dạng ngày giờ:', error);
      return 'N/A';
    }
  };

  return (
    <div>
      <Breadcrumb
        breadcrumbs={[
          { name: 'Trang chủ', path: ROUTER.HOME },
          { name: 'Đơn hàng của tôi', path: ROUTER.ORDERS },
          { name: order ? `Mã đơn hàng: ${order.orderCode}` : 'Chi tiết đơn hàng' },
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
                  <H2 className="mb-1">Mã đơn hàng {order?.orderCode}</H2>
                  <p className="text-gray-500 text-sm">Đã đặt: {formatDate(order?.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  {getReturnStatusBadge()}
                </div>
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
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 text-sm">{item.productName}</h4>
                            {item.itemStatus && item.itemStatus !== 'NORMAL' && (
                              <span
                                className={cn(
                                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                                  getItemStatusColor(item.itemStatus)
                                )}
                              >
                                {getItemStatusIcon(item.itemStatus)}
                                {getItemStatusText(item.itemStatus)}
                              </span>
                            )}
                          </div>
                          {item.variantId && <p className="mt-1 text-gray-500 text-xs">Phân loại {item.variantId}</p>}
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-gray-500 text-sm">Số lượng {item.quantity}</p>
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

                  {/* Return Request Details */}
                  {order?.returnRequest && (
                    <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <h3 className="mb-4 font-medium text-lg text-orange-900">Thông tin yêu cầu hoàn trả</h3>
                      <div className="space-y-3">
                        <HStack className="justify-between">
                          <span className="text-gray-700 text-sm">Loại yêu cầu:</span>
                          <span className="font-medium text-sm">
                            {order.returnRequest.type === 'RETURN' ? 'Trả hàng hoàn tiền' : 'Đổi hàng'}
                          </span>
                        </HStack>
                        <HStack className="justify-between">
                          <span className="text-gray-700 text-sm">Lý do:</span>
                          <span className="font-medium text-sm">{order.returnRequest.reason}</span>
                        </HStack>
                        {order.returnRequest.description && (
                          <div>
                            <span className="text-gray-700 text-sm">Mô tả:</span>
                            <p className="mt-1 text-sm">{order.returnRequest.description}</p>
                          </div>
                        )}
                        <HStack className="justify-between">
                          <span className="text-gray-700 text-sm">Trạng thái:</span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 font-medium text-xs',
                              order.returnRequest.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : order.returnRequest.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : order.returnRequest.status === 'COMPLETED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            )}
                          >
                            {order.returnRequest.status === 'PENDING'
                              ? 'Đang chờ xử lý'
                              : order.returnRequest.status === 'APPROVED'
                                ? 'Đã chấp nhận'
                                : order.returnRequest.status === 'REJECTED'
                                  ? 'Đã từ chối'
                                  : 'Đã hoàn tất'}
                          </span>
                        </HStack>
                        {order.returnRequest.refundInfo && (
                          <>
                            <Separator className="my-2" />
                            <div>
                              <h4 className="mb-2 font-medium text-gray-700 text-sm">Thông tin hoàn tiền:</h4>
                              <div className="space-y-2">
                                <HStack className="justify-between">
                                  <span className="text-gray-600 text-xs">Ngân hàng:</span>
                                  <span className="text-sm">{order.returnRequest.refundInfo.bankName}</span>
                                </HStack>
                                <HStack className="justify-between">
                                  <span className="text-gray-600 text-xs">Số tài khoản:</span>
                                  <span className="text-sm">{order.returnRequest.refundInfo.bankAccount}</span>
                                </HStack>
                                <HStack className="justify-between">
                                  <span className="text-gray-600 text-xs">Chủ tài khoản:</span>
                                  <span className="text-sm">{order.returnRequest.refundInfo.bankAccountName}</span>
                                </HStack>
                              </div>
                            </div>
                          </>
                        )}
                        {order.returnRequest.exchangeOrderId && (
                          <HStack className="justify-between">
                            <span className="text-gray-700 text-sm">Mã đơn đổi hàng:</span>
                            <Link
                              href={`${ROUTER.ORDERS}/${order.returnRequest.exchangeOrderId}`}
                              className="font-medium text-primary text-sm hover:underline"
                            >
                              Xem đơn hàng
                            </Link>
                          </HStack>
                        )}
                        <HStack className="justify-between">
                          <span className="text-gray-700 text-sm">Ngày yêu cầu:</span>
                          <span className="text-sm">{formatDateTime(order.returnRequest.createdAt)}</span>
                        </HStack>
                      </div>
                    </div>
                  )}
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
                            Thanh toán thất bạibại
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
