import type { IOrder, OrderStatus, PaymentMethod, PaymentStatus } from '@/api/order/types';
import { AlertCircle, CheckCircle, Clock, CreditCard, DollarSign, Package, RefreshCw, Truck, X } from 'lucide-react';

export const getShippingStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'PROCESSING':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'SHIPPED':
      return <Truck className="h-5 w-5 text-blue-500" />;
    case 'DELIVERED':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'CANCELED':
      return <X className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export const getShippingStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Đã đặt hàng';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'SHIPPED':
      return 'Đang vận chuyển';
    case 'DELIVERED':
      return 'Đã vận chuyển';
    case 'CANCELED':
      return 'Đã hủy';
    default:
      return 'Unknown';
  }
};

export const getShippingStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'PENDING':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'FAILED':
      return <X className="h-5 w-5 text-red-500" />;
    case 'REFUNDED':
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export const getPaymentStatusText = (status: PaymentStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'Đã thanh toán';
    case 'PENDING':
      return 'Đang chờ thanh toán';
    case 'FAILED':
      return 'Failed';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    default:
      return 'Unknown';
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'REFUNDED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSimplifiedStatusDisplay = (order: IOrder) => {
  const isOrderFullyCompleted = (order: IOrder): boolean => {
    return order.shippingStatus === 'DELIVERED' && order.paymentStatus === 'COMPLETED';
  };

  if (isOrderFullyCompleted(order)) {
    return {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: 'Đã hoàn thành',
      color: 'bg-green-100 text-green-800',
    };
  }

  if (order.shippingStatus === 'CANCELED') {
    return {
      icon: <X className="h-5 w-5 text-red-500" />,
      text: 'Đã hủy',
      color: 'bg-red-100 text-red-800',
    };
  }

  if (order.paymentStatus === 'FAILED') {
    return {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: 'Payment Failed',
      color: 'bg-red-100 text-red-800',
    };
  }

  if (order.shippingStatus === 'PENDING') {
    return {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      text: 'Đang chờ xử lý',
      color: 'bg-yellow-100 text-yellow-800',
    };
  }

  if (order.shippingStatus === 'PROCESSING') {
    return {
      icon: <Package className="h-5 w-5 text-blue-500" />,
      text: 'Đang xử lý',
      color: 'bg-blue-100 text-blue-800',
    };
  }

  if (order.shippingStatus === 'SHIPPED') {
    return {
      icon: <Truck className="h-5 w-5 text-blue-500" />,
      text: 'Đang vận chuyển',
      color: 'bg-blue-100 text-blue-800',
    };
  }

  return {
    icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
    text: 'Unknown',
    color: 'bg-gray-100 text-gray-800',
  };
};

export const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case 'CASH_ON_DELIVERY':
      return <DollarSign className="h-5 w-5 text-gray-500" />;
    case 'ONLINE_PAYMENT':
      return <CreditCard className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export const getPaymentMethodText = (method: PaymentMethod) => {
  switch (method) {
    case 'CASH_ON_DELIVERY':
      return 'Thanh toán khi nhận hàng';
    case 'ONLINE_PAYMENT':
      return 'Thanh toán online';
    default:
      return 'Unknown';
  }
};
