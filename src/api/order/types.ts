import type { IMetaResponse } from '@/types';
import type { IProduct } from '../product/types';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export interface IOrderItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage?: string;
  attributes?: Record<string, string>;
  isReviewed?: boolean;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  ward?: string;
  postalCode: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  orderCode: string;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount: number;
  voucherId: string | null;
  paymentStatus: PaymentStatus;
  shippingStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: IShippingAddress;
  createdAt: string;
  updatedAt: string;
  paymentSession?: {
    url: string;
    paymentId: string;
  };
  product?: IProduct;
  userNote?: string;
  shipperOfProof?: string[];
  cancelledReason?: string;
}

export interface IOrderResponse {
  items: IOrder[];
  meta: IMetaResponse;
}

export interface ICreateOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ICreateOrderShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  ward?: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface ICreateOrderRequest {
  items: ICreateOrderItem[];
  paymentMethod: PaymentMethod;
  shippingAddress: ICreateOrderShippingAddress;
  voucherId?: string;
  notes?: string;
}

export interface IOrderQuery {
  page: number;
  limit: number;
  shippingStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}
