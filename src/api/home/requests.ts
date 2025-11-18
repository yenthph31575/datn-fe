import client from '../axios';
import type { IVoucher } from '../voucher/types';

export const getHomeVouchers = async (limit: number = 4): Promise<IVoucher[]> => {
  const { data } = await client({
    url: '/api/vouchers/featured',
    method: 'GET',
    params: { limit },
  });
  return data?.data || [];
};
