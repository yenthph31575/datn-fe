'use client';

import { useMeQuery } from '@/api/auth/queries';
import type { IUser } from '@/api/auth/types';
import { useUserStore } from '@/stores/UserStore';
import { getCookie } from 'cookies-next';

export const useUserLogin = () => {
  const { setUser, logout } = useUserStore();

  // to do remove as IUser
  const { data, refetch, ...rest } = useMeQuery({
    onSuccess: (user) => {
      setUser(user as IUser);
    },
    onError: (error) => {
      // deleteCookie('access_token');
      // deleteCookie('refresh_token');
      // logout();
      // if (disconnect) disconnect();
    },
    enabled: Boolean(getCookie('access_token')),
  });

  return {
    isLoggedIn: Boolean(data && getCookie('access_token')),
    user: data,
    refetch,
    ...rest,
  };
};
