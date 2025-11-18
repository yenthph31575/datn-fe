import { createQuery } from 'react-query-kit';
import { getProductReviews } from './requests';
import type { IReviewQueryParams, IReviewResponse } from './types';

export const useProductReviewsQuery = createQuery<IReviewResponse, Partial<IReviewQueryParams>>({
  queryKey: ['reviews/product'],
  fetcher: (params) => getProductReviews(params),
});
