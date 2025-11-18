import { createMutation, createQuery } from 'react-query-kit';
import { addToCart, clearCart, getCart, mergeCart, updateCartItem } from './requests';
import type { IAddToCartRequest, ICartItem, ICartResponse, IMergeCartRequest, IUpdateCartRequest } from './types';

export const useCartQuery = createQuery<ICartResponse, void>({
  queryKey: ['cart'],
  fetcher: () => getCart(),
});

export const useAddToCartMutation = createMutation<ICartItem, IAddToCartRequest>({
  mutationKey: ['cart/add'],
  mutationFn: (data) => addToCart(data),
});

export const useUpdateCartItemMutation = createMutation<ICartItem, IUpdateCartRequest>({
  mutationKey: ['cart/update'],
  mutationFn: (data) => updateCartItem(data),
});

export const useMergeCartMutation = createMutation<ICartResponse, IMergeCartRequest>({
  mutationKey: ['cart/merge'],
  mutationFn: (data) => mergeCart(data),
});

export const useClearCartMutation = createMutation<boolean, void>({
  mutationKey: ['cart/clear'],
  mutationFn: () => clearCart(),
});
