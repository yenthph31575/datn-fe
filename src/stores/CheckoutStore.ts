import type { ICartItem } from '@/api/cart/types';
import type { IShippingAddress } from '@/api/order/types';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IPaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'cod';
  details?: Record<string, any>;
}

export interface ICheckoutStore {
  items: ICartItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: IPaymentMethod;
  shippingFee: number;
  discount: number;
  subtotal: number;
  total: number;

  // Actions
  setItems: (items: ICartItem[]) => void;
  setShippingAddress: (address: Partial<IShippingAddress>) => void;
  setPaymentMethod: (method: IPaymentMethod) => void;
  setShippingFee: (fee: number) => void;
  setDiscount: (discount: number) => void;
  calculateTotals: () => void;
  clearCheckout: () => void;
}

const initialShippingAddress: IShippingAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  ward: '',
  postalCode: '',
};

const initialPaymentMethod: IPaymentMethod = {
  type: 'cod',
};

const useBaseCheckoutStore = create<ICheckoutStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingAddress: initialShippingAddress,
      paymentMethod: initialPaymentMethod,
      shippingFee: 0,
      discount: 0,
      subtotal: 0,
      total: 0,

      setItems: (items) => {
        set({ items });
        get().calculateTotals();
      },

      setShippingAddress: (address) => {
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...address },
        }));
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setShippingFee: (fee) => {
        set({ shippingFee: fee });
        get().calculateTotals();
      },

      setDiscount: (discount) => {
        set({ discount });
        get().calculateTotals();
      },

      calculateTotals: () => {
        const { items, shippingFee, discount } = get();
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const total = subtotal + shippingFee - discount;

        set({ subtotal, total });
      },

      clearCheckout: () => {
        set({
          items: [],
          shippingAddress: initialShippingAddress,
          paymentMethod: initialPaymentMethod,
          shippingFee: 0,
          discount: 0,
          subtotal: 0,
          total: 0,
        });
      },
    }),
    {
      name: 'checkout-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCheckoutStore = createSelectorFunctions(useBaseCheckoutStore);
