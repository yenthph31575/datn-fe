import type { IUser } from '@/api/auth/types';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IUserStore {
  user: IUser;
  setUser: (data: IUser) => void;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (data: boolean) => void;
}

const useBaseUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: {} as IUser,
      setUser: (data) => set((state) => ({ ...state, user: data, isLoggedIn: !!data?.id })),
      setIsLoggedIn: (data) => set((state) => ({ ...state, isLoggedIn: data })),
      logout: () =>
        set(() => ({
          accessToken: '',
          verifyToken: '',
          isLoggedIn: false,
          user: {} as IUser,
          isWalletConnected: false,
          isVerifiedUser: undefined,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUserStore = createSelectorFunctions(useBaseUserStore);
