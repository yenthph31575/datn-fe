import { createQuery } from 'react-query-kit';
import { getCategories, getCategoryById } from './requests';
import type { ICategory, ICategoryQuery, ICategoryResponse } from './types';

export const useCategoriesQuery = createQuery<ICategoryResponse, Partial<ICategoryQuery>>({
  queryKey: ['categories'],
  fetcher: (params) => getCategories(params),
});
export const useCategoryByIdQuery = createQuery<ICategory, string>({
  queryKey: ['category'],
  fetcher: (id) => getCategoryById(id),
});
