import { createQuery } from 'react-query-kit';
import { getVoucherById, getVouchers } from './requests';
import type { IVoucher, IVoucherQuery } from './types';

export const useVouchersQuery = createQuery<IVoucher[], Partial<IVoucherQuery>>({
  queryKey: ['vouchers'],
  fetcher: (params) => getVouchers(params),
});

export const useVoucherByIdQuery = createQuery<IVoucher, string>({
  queryKey: ['vouchers/detail'],
  fetcher: (voucherId) => getVoucherById(voucherId),
});
