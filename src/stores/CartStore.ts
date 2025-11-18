import { addToCart, mergeCart, removeItemsFromCart, updateCartItem } from '@/api/cart/requests';
import type { ICartItem } from '@/api/cart/types';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { getCookie } from 'cookies-next';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ICartStore {
  carts: ICartItem[];
  isLoading: boolean;
  addToCart: (data: ICartItem) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  removeMultipleFromCart: (cartItemIds: string[]) => Promise<void>;
  mergeCart: () => Promise<void>;
  clearCart: () => void;
  setCart: (carts: ICartItem[]) => void;
}

const useBaseCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      carts: [] as ICartItem[],
      isLoading: false,

      addToCart: async (data: ICartItem) => {
        set({ isLoading: true });
        try {
          // First check if adding this item would exceed available quantity
          const state = get();
          const existingCart = state.carts.find((item) => item.productId === data.productId && item.variantId === data.variantId);

          const totalRequestedQuantity = (existingCart?.quantity || 0) + data.quantity;

          if (totalRequestedQuantity > data.totalQuantity) {
            throw new Error(`Cannot add to cart. Only ${data.totalQuantity} items available.`);
          }

          // Update local state for immediate feedback
          set((state) => {
            const existingCart = state.carts.find((item) => item.productId === data.productId && item.variantId === data.variantId);

            if (existingCart) {
              existingCart.quantity += data.quantity;
              return { carts: [...state.carts] };
            } else {
              return { carts: [...state.carts, data] };
            }
          });

          // Then sync with server if user is logged in
          if (typeof window !== 'undefined' && getCookie('access_token')) {
            await addToCart({
              productId: data.productId,
              variantId: data.variantId,
              quantity: data.quantity,
            });
          }
        } catch (error) {
          console.error('Failed to add to cart:', error);
          // Show error message to user
          if (typeof window !== 'undefined') {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
            // You can use your toast notification system here
            console.error(errorMessage);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      updateCartItem: async (cartItemId: string, quantity: number) => {
        set({ isLoading: true });
        try {
          // Check if the new quantity exceeds available stock
          const state = get();
          const cartItem = state.carts.find((item) => item._id === cartItemId);

          if (!cartItem) {
            throw new Error('Cart item not found');
          }

          if (quantity > cartItem.totalQuantity) {
            throw new Error(`Cannot update quantity. Only ${cartItem.totalQuantity} items available.`);
          }

          // Update local state
          set((state) => {
            const cart = state.carts.find((item) => item._id === cartItemId);
            if (cart) {
              cart.quantity = quantity;
            }
            return { carts: [...state.carts] };
          });

          // Sync with server if logged in
          if (typeof window !== 'undefined' && getCookie('access_token')) {
            await updateCartItem({ cartItemId, quantity });
          }
        } catch (error) {
          console.error('Failed to update cart item:', error);
          // Show error message to user
          if (typeof window !== 'undefined') {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
            console.error(errorMessage);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (cartItemId: string) => {
        set({ isLoading: true });
        try {
          // Update local state
          set((state) => ({
            carts: state.carts.filter((item) => item._id !== cartItemId),
          }));

          // Sync with server if logged in
          if (typeof window !== 'undefined' && getCookie('access_token')) {
            await removeItemsFromCart({ itemIds: [cartItemId] });
          }
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeMultipleFromCart: async (cartItemIds: string[]) => {
        set({ isLoading: true });
        try {
          // Update local state first
          set((state) => ({
            carts: state.carts.filter((item) => !cartItemIds.includes(item._id || '')),
          }));

          // Sync with server if logged in
          if (typeof window !== 'undefined' && getCookie('access_token')) {
            // Remove each item one by one
            await removeItemsFromCart({ itemIds: cartItemIds });
          }
        } catch (error) {
          console.error('Failed to remove multiple items from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      mergeCart: async () => {
        const { carts } = get();
        if (carts.length === 0) return;

        set({ isLoading: true });
        try {
          if (typeof window !== 'undefined' && getCookie('access_token')) {
            console.log('aaaaaaaa', carts);
            const cartMerges = carts.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            }));

            console.log(cartMerges);
            const response = await mergeCart({ items: cartMerges });
            set({ carts: response.items });
          }
        } catch (error) {
          console.error('Failed to merge cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ carts: [] });
      },

      setCart: (carts: ICartItem[]) => {
        set({ carts });
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCartStore = createSelectorFunctions(useBaseCartStore);
