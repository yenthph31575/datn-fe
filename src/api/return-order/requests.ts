import client from '../axios';
import type { IReturnRequestPayload } from './types';

export const createReturnRequest = async (payload: IReturnRequestPayload) => {
  const { data } = await client({
    url: '/api/return-requests',
    method: 'POST',
    data: payload,
  });
  return data?.data;
};
