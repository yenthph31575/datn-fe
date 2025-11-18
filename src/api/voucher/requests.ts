import client from '../axios';
import type { IVoucher, IVoucherQuery, IVerifyVoucherRequest, IVerifyVoucherResponse } from './types';

export const getVouchers = async (params: Partial<IVoucherQuery>): Promise<IVoucher[]> => {
  const { data } = await client({
    url: '/api/vouchers/active',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getVoucherById = async (voucherId: string): Promise<IVoucher> => {
  const { data } = await client({
    url: `/api/vouchers/${voucherId}`,
    method: 'GET',
  });
  return data?.data;
};

export const applyVoucher = async (code: string): Promise<{ discount: number }> => {
  const { data } = await client({
    url: '/api/vouchers/apply',
    method: 'POST',
    data: { code },
  });
  return data?.data;
};

export const verifyVoucher = async (verifyData: IVerifyVoucherRequest): Promise<IVerifyVoucherResponse> => {
  const { data } = await client({
    url: '/api/vouchers/verify',
    method: 'POST',
    data: verifyData,
  });
  return data?.data;
};
