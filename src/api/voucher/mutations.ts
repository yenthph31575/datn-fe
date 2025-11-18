import { createMutation } from 'react-query-kit';
import { applyVoucher, verifyVoucher } from './requests';
import type { IVerifyVoucherRequest, IVerifyVoucherResponse } from './types';

export const useApplyVoucherMutation = createMutation<{ discount: number }, string>({
  mutationKey: ['vouchers/apply'],
  mutationFn: (code) => applyVoucher(code),
});

export const useVerifyVoucherMutation = createMutation<IVerifyVoucherResponse, IVerifyVoucherRequest>({
  mutationKey: ['vouchers/verify'],
  mutationFn: (data) => verifyVoucher(data),
});
