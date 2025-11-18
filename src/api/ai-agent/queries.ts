import { createQuery } from 'react-query-kit';
import { getProductRecommendations } from './requests';
import type { IProductRecommendationRequest, IProductRecommendationResponse } from './types';

export const useProductRecommendationsQuery = createQuery<IProductRecommendationResponse, IProductRecommendationRequest>({
  queryKey: ['products/recommendations'],
  fetcher: (request) => getProductRecommendations(request),
});
