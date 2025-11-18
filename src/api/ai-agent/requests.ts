import client from '../axios';
import type { IProductRecommendationRequest, IProductRecommendationResponse } from './types';

export const getProductRecommendations = async (request: IProductRecommendationRequest): Promise<IProductRecommendationResponse> => {
  const { data } = await client({
    url: '/api/ai-agent',
    method: 'POST',
    data: request,
  });
  return data?.data;
};
