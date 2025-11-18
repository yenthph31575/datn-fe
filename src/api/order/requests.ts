import client from '../axios';
import type { ICreateOrderRequest, IOrder, IOrderQuery, IOrderResponse } from './types';

export const getOrders = async (params: Partial<IOrderQuery>): Promise<IOrderResponse> => {
  const { data } = await client({
    url: '/api/orders',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getOrderById = async (orderId: string): Promise<IOrder> => {
  const { data } = await client({
    url: `/api/orders/${orderId}`,
    method: 'GET',
  });
  return data?.data;
};

export const createOrder = async (orderData: ICreateOrderRequest): Promise<IOrder> => {
  const { data } = await client({
    url: '/api/orders',
    method: 'POST',
    data: orderData,
  });
  return data?.data;
};

export const cancelOrder = async ({ orderId, reason }: { orderId: string; reason: string }): Promise<IOrder> => {
  const { data } = await client({
    url: `/api/orders/${orderId}/cancel`,
    method: 'POST',
    data: { reason },
  });
  return data?.data;
};
