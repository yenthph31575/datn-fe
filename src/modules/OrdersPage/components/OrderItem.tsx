'use client';
import type { IOrder, IOrderItem } from '@/api/order/types';
import H4 from '@/components/text/H4';
import { Button } from '@/components/ui/button';
import { HStack, Show, VStack } from '@/components/utilities';
import { cn } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  getPaymentMethodIcon,
  getPaymentMethodText,
  getPaymentStatusColor,
  getPaymentStatusIcon,
  getPaymentStatusText,
  getShippingStatusColor,
  getShippingStatusIcon,
  getShippingStatusText,
  getSimplifiedStatusDisplay,
} from '../libs/utils';
import DialogCancelOrder from './DialogCancelOrder';
import ReviewDialog from './ReviewDialog';

interface OrderItemProps {
  order: IOrder;
  onCancelSuccess?: () => void;
  refetch: any;
}

const OrderItem = ({ order, onCancelSuccess, refetch }: OrderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<IOrderItem | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const openReviewDialog = (item: IOrderItem) => {
    setSelectedItemForReview(item);
    setIsReviewDialogOpen(true);
  };

  // Add a new function to determine if an order is fully completed

  // Add a function to get the simplified status display

  const canReview = order.shippingStatus === 'DELIVERED' && order.paymentStatus === 'COMPLETED';

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Order header - with gradient background for better visual hierarchy */}
      <div className="border-gray-200 border-b bg-gradient-to-r from-gray-50 to-white p-4">
        <HStack className="justify-between">
          <HStack spacing={8}>
            <span className="font-medium text-gray-700 text-sm">Order Code: {order.orderCode}</span>
            <span className="text-gray-500 text-sm">{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </HStack>

          <HStack spacing={8}>
            {/* Simplified status badge with improved styling */}
            <span
              className={cn(
                'flex items-center rounded-full px-3 py-1 font-medium text-xs shadow-sm',
                getSimplifiedStatusDisplay(order).color
              )}
            >
              {getSimplifiedStatusDisplay(order).icon}
              <span className="ml-1">{getSimplifiedStatusDisplay(order).text}</span>
            </span>

            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-gray-100">
              {isExpanded ? 'Hide Details' : 'View Details'}
            </Button>
          </HStack>
        </HStack>
      </div>

      {/* Order summary (always visible) - with improved spacing and visual hierarchy */}
      <div className="p-4">
        <HStack className="justify-between">
          <div>
            <H4 className="mb-1 text-primary-700">Tổng cộng: {formatNumber((order.totalAmount || 0) + (order.discountAmount || 0))}</H4>
            <HStack spacing={4} className="text-gray-500 text-sm">
              <span className="font-medium">{order.items.length} items</span>
              <span>•</span>
              <span className="flex items-center">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span className="ml-1">{getPaymentMethodText(order.paymentMethod)}</span>
              </span>
            </HStack>
          </div>

          <VStack spacing={8} align="center">
            <Link href={`${ROUTER.ORDERS}/${order._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary-200 text-primary-700 hover:bg-primary-50 hover:text-primary-800"
              >
                View Order
              </Button>
            </Link>
            {order.shippingStatus === 'PENDING' && order.paymentStatus === 'PENDING' && order.paymentMethod === 'CASH_ON_DELIVERY' && (
              <DialogCancelOrder orderId={order._id} refetch={refetch} />
            )}
          </VStack>
        </HStack>
      </div>

      {/* Product preview with improved layout and hover effects */}
      <VStack spacing={4} className="px-4 pb-4">
        {order.items.map((item, index) => {
          // && !item?.isReviewed;

          return (
            <div className="flex items-center" key={index}>
              <HStack className="flex-1">
                <div
                  className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-gray-200 transition-all hover:border-primary-300 hover:shadow-md"
                  onClick={() => canReview && openReviewDialog(item)}
                >
                  <Image
                    src={item.productImage || '/images/no-image.svg'}
                    alt={item.productName}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="64px"
                  />
                  {item.quantity > 1 && (
                    <div className="absolute right-0 bottom-0 rounded-tl-md bg-black bg-opacity-70 px-1 text-white text-xs">
                      x{item.quantity}
                    </div>
                  )}
                </div>

                <VStack>
                  <span className="line-clamp-1 font-medium text-sm">{item.productName}</span>
                  <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                </VStack>
              </HStack>

              <VStack>
                <Show when={canReview}>
                  {!item.isReviewed ? (
                    <ReviewDialog
                      productId={item.productId}
                      productName={item.productName}
                      productImage={item.productImage}
                      orderId={order._id}
                      refetch={refetch}
                    />
                  ) : (
                    <Button size="xs" disabled>
                      Đã đánh giá
                    </Button>
                  )}
                </Show>
              </VStack>
            </div>
          );
        })}
      </VStack>

      <Show when={order.shippingStatus === 'DELIVERED' && order.paymentStatus === 'COMPLETED'}>
        {order.shipperOfProof && order.shipperOfProof.length > 0 && (
          <div className="px-4 pb-2">
            <span className="font-medium text-gry-500 text-sm">Minh chứng giao hàng</span>
            <div className="flex flex-wrap gap-2">
              {order.shipperOfProof.map((image, index) => (
                <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                  <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Show>

      <Show when={order.shippingStatus === 'CANCELED'}>
        <p className="px-4 pb-2 text-red-500 text-sm">Lý do hủy: {order?.cancelledReason || 'Không có lý do'}</p>
      </Show>

      {/* Expanded details with improved sections and visual hierarchy */}
      {isExpanded && (
        <div className="border-gray-200 border-t bg-gray-50 p-4">
          {/* Order ID and dates with card styling */}
          <div className="mb-4 rounded-md bg-white p-3 shadow-sm">
            <VStack spacing={2} className="text-sm">
              <HStack className="w-full justify-between">
                <span className="font-medium text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-800">{order._id}</span>
              </HStack>
              <HStack className="w-full justify-between">
                <span className="font-medium text-gray-600">Ngày đặt hàng:</span>
                <span className="text-gray-800">{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm:ss')}</span>
              </HStack>
              <HStack className="w-full justify-between">
                <span className="font-medium text-gray-600">Ngày cập nhật:</span>
                <span className="text-gray-800">{format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</span>
              </HStack>
              <HStack className="w-full justify-between">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="font-mono text-gray-800">{order.userId}</span>
              </HStack>
              {order.voucherId && (
                <HStack className="w-full justify-between">
                  <span className="font-medium text-gray-600">Voucher:</span>
                  <span className="font-mono text-gray-800">{order.voucherId}</span>
                </HStack>
              )}
            </VStack>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Order items with improved card styling */}
            <div>
              <h5 className="mb-3 font-medium text-gray-700">Danh sách sản phẩm</h5>
              <div className="rounded-md bg-white p-3 shadow-sm">
                <VStack spacing={12} className="max-h-80 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="w-full">
                      <HStack className="w-full justify-between">
                        <HStack spacing={4} className="w-full">
                          {item.productImage && (
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <VStack align="start" spacing={2} className="flex-1">
                            <Link
                              href={`${ROUTER.PRODUCTS}/${item.productId}`}
                              className="line-clamp-2 font-medium text-primary-600 text-sm transition-colors hover:text-primary-700 hover:underline"
                            >
                              {item.productName}
                            </Link>

                            <VStack spacing={2} align="start" className="w-full">
                              <HStack className="text-gray-500 text-xs">
                                <span className="font-medium">Product ID:</span>
                                <span className="font-mono">{item.productId}</span>
                              </HStack>
                              <HStack className="text-gray-500 text-xs">
                                <span className="font-medium">Variant ID:</span>
                                <span className="font-mono">{item.variantId}</span>
                              </HStack>
                              <HStack className="text-gray-500 text-xs">
                                <span className="font-medium">Item ID:</span>
                                <span className="font-mono">{item._id}</span>
                              </HStack>
                            </VStack>

                            {item.attributes && Object.keys(item.attributes).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {Object.entries(item.attributes).map(([key, value]) => (
                                  <span key={key} className="rounded bg-gray-100 px-2 py-1 text-xs">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}

                            <HStack className="mt-1 w-full justify-between">
                              <span className="text-gray-500 text-xs">
                                Số lượng: {item.quantity} x {formatNumber(item.price)}
                              </span>
                              <span className="font-medium text-primary-700 text-sm">{formatNumber(item.price * item.quantity)} vnđ</span>
                            </HStack>

                            {/* Review button for completed orders */}
                          </VStack>
                        </HStack>
                      </HStack>

                      {index < order.items.length - 1 && <div className="my-3 border-gray-100 border-b"></div>}
                    </div>
                  ))}
                </VStack>
              </div>
            </div>

            {/* Order details with improved card styling */}
            <div>
              <h5 className="mb-3 font-medium text-gray-700">Thông tin đơn hàng</h5>
              <div className="space-y-4">
                {/* Payment information */}
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <h6 className="mb-2 font-medium text-gray-700">Thông tin thanh toán</h6>
                  <VStack spacing={2} className="text-sm">
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Phương thức thanh toán:</span>
                      <span className="flex items-center font-medium">
                        {getPaymentMethodIcon(order.paymentMethod)}
                        <span className="ml-1">{getPaymentMethodText(order.paymentMethod)}</span>
                      </span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={cn('flex items-center rounded-full px-2 py-0.5 text-xs', getPaymentStatusColor(order.paymentStatus))}
                      >
                        {getPaymentStatusIcon(order.paymentStatus)}
                        <span className="ml-1">{getPaymentStatusText(order.paymentStatus)}</span>
                      </span>
                    </HStack>
                  </VStack>
                </div>

                {/* Shipping information */}
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <h6 className="mb-2 font-medium text-gray-700">Thông tin vận chuyển</h6>
                  <VStack spacing={2} className="text-sm">
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={cn('flex items-center rounded-full px-2 py-0.5 text-xs', getShippingStatusColor(order.shippingStatus))}
                      >
                        {getShippingStatusIcon(order.shippingStatus)}
                        <span className="ml-1">{getShippingStatusText(order.shippingStatus)}</span>
                      </span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="text-right text-gray-800">{order.shippingAddress?.addressLine1}</span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Thành phố:</span>
                      <span className="text-gray-800">{order.shippingAddress?.city}</span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Quận/Huyện:</span>
                      <span className="text-gray-800">{order.shippingAddress?.district}</span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Phường/Xã:</span>
                      <span className="text-gray-800">{order.shippingAddress?.ward}</span>
                    </HStack>
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Postal Code:</span>
                      <span className="text-gray-800">{order.shippingAddress?.postalCode}</span>
                    </HStack>
                  </VStack>
                </div>

                {/* Price breakdown */}
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <h6 className="mb-2 font-medium text-gray-700">Tóm tắt đơn hàng</h6>
                  <VStack spacing={2} className="text-sm">
                    <HStack className="w-full justify-between">
                      <span className="text-gray-600">Tổng tiền hàng:</span>
                      <span className="text-gray-800"> {formatNumber((order.totalAmount || 0) + (order.discountAmount || 0))} vnđ</span>
                    </HStack>

                    {order.discountAmount > 0 && (
                      <HStack className="w-full justify-between">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="text-green-600">-{formatNumber(order.discountAmount)} vnđ</span>
                      </HStack>
                    )}
                    <div className="my-1 border-gray-200 border-t"></div>
                    <HStack className="w-full justify-between">
                      <span className="font-medium text-gray-700">Tổng cộng:</span>
                      <span className="font-medium text-primary-700">{formatNumber(order.totalAmount || 0)} vnđ</span>
                    </HStack>
                  </VStack>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  {order.shippingStatus === 'PENDING' &&
                    order.paymentStatus === 'PENDING' &&
                    order.paymentMethod === 'CASH_ON_DELIVERY' && <DialogCancelOrder orderId={order._id} refetch={refetch} />}
                  <Link href={`${ROUTER.ORDERS}/${order._id}`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary-200 text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
