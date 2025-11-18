import client from '../axios';
import type { IReview, IReviewQueryParams, IReviewRequest, IReviewResponse } from './types';

export const submitReview = async (reviewData: IReviewRequest): Promise<IReview> => {
  const { data } = await client({
    url: '/api/reviews',
    method: 'POST',
    data: reviewData,
  });
  return data?.data;
};

export const getProductReviews = async (params: Partial<IReviewQueryParams>): Promise<IReviewResponse> => {
  const { productId, ...queryParams } = params;
  const { data } = await client({
    url: `/api/reviews/product/${productId}`,
    method: 'GET',
    params: queryParams,
  });
  return data?.data;
};
