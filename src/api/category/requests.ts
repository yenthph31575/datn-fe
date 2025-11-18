import client from '../axios';
import type { ICategoryResponse, ICategory, ICategoryQuery } from './types';

export const getCategories = async (params: Partial<ICategoryQuery>): Promise<ICategoryResponse> => {
  const { data } = await client({
    url: '/api/categories',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const { data } = await client({
    url: `/api/admin/categories/${id}`,
    method: 'GET',
  });
  return data?.data;
};
