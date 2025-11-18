import { createMutation, createQuery } from 'react-query-kit';
import { cancelOrder, createOrder, getOrderById, getOrders } from './requests';
import type { ICreateOrderRequest, IOrder, IOrderQuery, IOrderResponse } from './types';

export const useOrdersQuery = createQuery<IOrderResponse, Partial<IOrderQuery>>({
  queryKey: ['orders'],
  fetcher: (params) => getOrders(params),
});

export const useOrderByIdQuery = createQuery<IOrder, string>({
  queryKey: ['orders/detail'],
  fetcher: (orderId) => getOrderById(orderId),
});

export const useCreateOrderMutation = createMutation<IOrder, ICreateOrderRequest>({
  mutationKey: ['orders/create'],
  mutationFn: (orderData) => createOrder(orderData),
});

export const useCancelOrderMutation = createMutation<IOrder, { orderId: string; reason: string }>({
  mutationKey: ['orders/cancel'],
  mutationFn: (data) => cancelOrder(data),
});
