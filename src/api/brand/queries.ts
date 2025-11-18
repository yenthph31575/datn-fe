import { createQuery } from 'react-query-kit';
import { getBrandById, getBrands } from './requests';
import type { IBrand, IBrandQuery, IBrandResponse } from './types';

export const useBrands = createQuery<IBrandResponse, Partial<IBrandQuery>>({
  queryKey: ['brands'],
  fetcher: (params) => getBrands(params),
});
export const useBrandByIdQuery = createQuery<IBrand, string>({
  queryKey: ['brand'],
  fetcher: (id) => getBrandById(id),
});
