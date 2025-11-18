import type { ICategory } from '../category/types';
import type { IMetaResponse, ITableQuery } from './../../types/index';

export interface IProductQuery extends ITableQuery {
  brandId: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: string;
  sortOrder: string;
}

export interface IProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  salePrice: number;
  quantity: number;
  soldCount: number;
  attributes: Record<string, string>;
  images: string[];
}

export interface IBrandInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  type: string;
  images: string[];
  categories: string[];
  primaryCategory?: ICategory;
  brand: IBrandInfo;
  variants: IProductVariant[];
  viewCount: number;
  totalSoldCount: number;
  averageRating: number;
  reviewCount: number;
  originalPrice: number;
  currentPrice: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  totalQuantity: number;
  specifications: Record<string, string>;
}

export interface IProductResponse {
  items: IProduct[];
  meta: IMetaResponse;
}

export interface IProductQuery extends ITableQuery {
  category?: string;
  brand?: string;
}
