import client from '../axios';
import type { IBrand, IBrandQuery, IBrandResponse } from './types';

export const getBrands = async (params: Partial<IBrandQuery>): Promise<IBrandResponse> => {
  const { data } = await client({
    url: '/api/brands',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getBrandById = async (id: string): Promise<IBrand> => {
  const { data } = await client({
    url: `/api/brands/${id}`,
    method: 'GET',
  });
  return data?.data;
};
