import type { IMetaResponse } from '../../types';
import type { IProduct } from '../product/types';

export interface IProductRecommendationMeta extends IMetaResponse {
  description: string;
}

export interface IProductRecommendationResponse {
  success: boolean;
  message: string;
  isProductRecommendation: boolean;
  items: IProduct[];
  responseText: string;
  meta: IProductRecommendationMeta;
}

export interface IProductRecommendationRequest {
  prompt: string;
  limit: number;
  chatHistory: string[];
}
