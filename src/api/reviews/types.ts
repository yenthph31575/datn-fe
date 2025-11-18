import type { IMetaResponse, ITableQuery } from '@/types';

export interface IReviewQueryParams extends ITableQuery {
  productId: string;
  rating?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}

export interface IReviewRequest {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface IReview {
  _id: string;
  productId: string;
  orderId?: string;
  userId?: string;
  rating: number;
  comment: string;
  images: string[];
  isActive?: boolean;
  isVerified?: boolean;
  isPurchased?: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    username: string;
    avatar?: string;
    email?: string;
  };
}

export interface IRatingStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface IReviewResponse {
  meta: IMetaResponse;
  ratingStats: IRatingStats;
  items: IReview[];
}
