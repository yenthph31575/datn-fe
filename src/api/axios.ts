import { env } from '@/libs/const';
import { useUserStore } from '@/stores/UserStore';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { refreshTokenRequest } from './auth/requests';

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: env.API_URL,
};

const request: AxiosInstance = axios.create(axiosRequestConfig);

let isRefreshPending = false;
let refreshTokenPromise: Promise<string | null> | null = null;

const onRefreshToken = async (refreshToken: string) => {
  const store = useUserStore.getState();

  try {
    const { accessToken } = await refreshTokenRequest(refreshToken);
    return accessToken;
  } catch (e) {
    isRefreshPending = false;
    refreshTokenPromise = null;

    // store.logout();
    // deleteCookie('access_token');
    // deleteCookie('refresh_token');
  }

  return null;
};

export const handleError = async (error: AxiosError): Promise<void> => {
  const originalRequest = error.config!;
  const data = error?.response as any;

  if (data?.status === 401 || data?.data?.error === 'Invalid token') {
    const refreshToken = getCookie('refresh_token');

    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (!refreshTokenPromise) {
      isRefreshPending = true;
      refreshTokenPromise = onRefreshToken(refreshToken);
    }

    const token = await refreshTokenPromise;
    if (!token) {
      toast.error('Your session is expired, please try to login again');
      return Promise.reject();
    }
    isRefreshPending = false;
    refreshTokenPromise = null;

    axios.defaults.headers.Authorization = `Bearer ${token}`;
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return request(originalRequest);
  }

  return Promise.reject(error);
};

request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const accessToken = getCookie('access_token');

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

request.interceptors.response.use((response: AxiosResponse) => response, handleError);

export default request;
